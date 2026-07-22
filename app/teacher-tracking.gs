/**
 * Smithics drillers - shared multi-project tracking endpoint
 * tt-3 DRAFT (TeacherViewer d007): teacher read surface with real Google sign-in.
 *
 * TWO DEPLOYMENTS of this one script, different jobs, different settings:
 *
 *   1. PUPIL WRITE (already live, DO NOT TOUCH): Execute as Me / access Anyone.
 *      Pupils POST attempts; doPost routes them to per-project tabs. That
 *      deployment stays pinned to its existing version, so pasting this file
 *      changes nothing for pupils until that deployment is deliberately
 *      version-bumped.
 *
 *   2. TEACHER READ (new): Execute as "User accessing the web app" /
 *      access "Anyone with a Google account". A teacher visits this
 *      deployment's URL, Google signs them in as themselves, and doGet
 *      checks their email against the `teachers` tab allowlist. Listed ->
 *      the viewer page, served by the script, with data via google.script.run
 *      (running with the teacher's own view access to the workbook).
 *      Not listed -> refused by name. Signed out -> Google's login wall.
 *      No keys, no secrets, per-teacher revocation.
 *
 * The gate has two layers, both required:
 *   - Drive ACL: the workbook is view-shared ONLY with allowlisted teachers.
 *     A stranger's Google account has no read access, so even a crafted
 *     request gets nothing.
 *   - The `teachers` tab: header row `email` (more columns later for
 *     per-teacher view config). doGet refuses emails not on it.
 *
 * Reserved tabs (never project tabs): `classes`, `teachers`.
 * `google_email` is never included in data served to the page.
 *
 * Updating the PUPIL deployment later: Deploy -> Manage deployments -> pencil
 * on the pupil deployment -> Version: New version -> Deploy (URL survives).
 * Never delete it and never make a fresh deployment for pupils: a fresh one
 * mints a new URL and orphans every driller's REPORT_URL.
 */

var COLUMNS = [
  'received_at','timestamp','project','anonymous_id','display_name','cohort',
  'google_email','session_id','item_id','topic','qtype','mode','level',
  'status','picked_id','misconception_id','extra_json'
];

// Columns never served to the teacher page (they stay in the Sheet).
var PRIVATE_COLUMNS = { google_email: true };

// Tab names that are NOT project response tabs.
var RESERVED_TABS = { classes: true, teachers: true };

/* ------------------------- pupil write path (unchanged) ------------------ */

function doPost(e) {
  try {
    var p = JSON.parse(e.postData.contents) || {};
    var sheet = getProjectSheet_(p.project);
    var known = {};
    COLUMNS.forEach(function (c) { known[c] = true; });
    var extra = {};
    Object.keys(p).forEach(function (k) { if (!known[k]) extra[k] = p[k]; });

    var row = COLUMNS.map(function (c) {
      if (c === 'received_at') return new Date();
      if (c === 'extra_json')  return Object.keys(extra).length ? JSON.stringify(extra) : '';
      return p[c] != null ? p[c] : '';
    });
    sheet.appendRow(row);
    return jsonOut_({ ok: true });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

/* ------------------------- teacher read path (tt-3) ---------------------- */

function doGet() {
  var email = signedInEmail_();

  // Anonymous GET: this is the pupil deployment (or a signed-out visitor on
  // a stale link). Keep the historical banner; serve no data.
  if (!email) {
    return ContentService.createTextOutput('Smithics multi-project tracking endpoint is live.')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  if (!isAllowlisted_(email)) {
    return HtmlService.createHtmlOutput(
      '<p style="font-family:sans-serif;max-width:34em">Signed in as <b>' + esc_(email) +
      '</b>, which is not on the TeacherViewer allowlist. If it should be, ask Smith to add it to the ' +
      'workbook’s <code>teachers</code> tab.</p>'
    ).setTitle('TeacherViewer: not authorised');
  }

  // Serve the real viewer if a 'viewer' HTML file has been added to the Apps
  // Script project (milestone 0's app/viewer.html); otherwise the shell below.
  try {
    return HtmlService.createHtmlOutputFromFile('viewer').setTitle('TeacherViewer');
  } catch (err) {
    return HtmlService.createHtmlOutput(viewerShellHtml_(email)).setTitle('TeacherViewer');
  }
}

// Server functions callable from the served page via google.script.run.
// They execute as the signed-in teacher (view access via the workbook share),
// and re-check the allowlist on every call (fail closed, cheap).

function tvListProjects() {
  requireAllowlisted_();
  return SpreadsheetApp.getActive().getSheets()
    .filter(function (s) { return !RESERVED_TABS[s.getName()]; })
    .map(function (s) { return { project: s.getName(), rows: Math.max(0, s.getLastRow() - 1) }; });
}

function tvGetRows(project, since) {
  requireAllowlisted_();
  if (!project) throw new Error('tvGetRows needs a project');
  var sheet = SpreadsheetApp.getActive().getSheetByName(sanitizeTab_(project));
  if (!sheet) return [];
  var visible = visibleCohortsFor_(signedInEmail_());  // null = all cohorts
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  var header = values[0].map(String);
  var out = [];
  for (var i = 1; i < values.length; i++) {
    var obj = {};
    for (var j = 0; j < header.length; j++) {
      if (PRIVATE_COLUMNS[header[j]]) continue;
      var v = values[i][j];
      obj[header[j]] = (v instanceof Date) ? v.toISOString() : v;
    }
    if (visible && visible.indexOf(String(obj.cohort || '').trim().toLowerCase()) === -1) continue;
    // 'since' compares ISO strings; rows with no timestamp are kept.
    if (since && obj.timestamp && String(obj.timestamp) < since) continue;
    out.push(obj);
  }
  return out;
}

// Per-teacher cohort visibility (d009, the loose model Smith asked for):
// on the teachers tab, the cell to the RIGHT of a teacher's email may name
// the cohorts they see, comma-separated (e.g. "12A, 12B"). Blank, "all" or
// "*" means everything. Returns null for everything, else a lowercase list.
// NOTE this is a courtesy filter, not a hard wall: allowlisted teachers hold
// view access to the whole workbook and could open the Sheet directly. That
// matches the commissioned "different teachers see different things, LOOSELY";
// hard walls are the later multi-school security tier.
function visibleCohortsFor_(email) {
  if (!email) return null;
  var sheet = SpreadsheetApp.getActive().getSheetByName('teachers');
  if (!sheet) return null;
  var values = sheet.getDataRange().getValues();
  for (var i = 0; i < values.length; i++) {
    for (var j = 0; j < values[i].length; j++) {
      if (String(values[i][j]).trim().toLowerCase() === email) {
        var spec = String(values[i][j + 1] != null ? values[i][j + 1] : '').trim();
        if (!spec || spec.toLowerCase() === 'all' || spec === '*') return null;
        return spec.split(/[,;]+/).map(function (s) { return s.trim().toLowerCase(); })
                   .filter(function (s) { return s; });
      }
    }
  }
  return null;
}

function tvGetClasses() {
  requireAllowlisted_();
  return readTabAsObjects_('classes');
}

function tvWhoAmI() {
  var email = signedInEmail_();
  return { email: email, allowlisted: isAllowlisted_(email),
           cohorts: visibleCohortsFor_(email) };  // null = all
}

/* ------------------------- helpers --------------------------------------- */

function signedInEmail_() {
  var email = '';
  try { email = Session.getActiveUser().getEmail() || ''; } catch (err) {}
  if (!email) { try { email = Session.getEffectiveUser().getEmail() || ''; } catch (err2) {} }
  return String(email).trim().toLowerCase();
}

function isAllowlisted_(email) {
  if (!email) return false;
  var sheet = SpreadsheetApp.getActive().getSheetByName('teachers');
  if (!sheet) return false;  // fail closed: no teachers tab, nobody reads
  // Any email address appearing anywhere on the teachers tab is allowlisted
  // (tolerant of header row or none; the tab has one job).
  var values = sheet.getDataRange().getValues();
  for (var i = 0; i < values.length; i++) {
    for (var j = 0; j < values[i].length; j++) {
      var v = String(values[i][j]).trim().toLowerCase();
      if (v && v.indexOf('@') > 0 && v === email) return true;
    }
  }
  return false;
}

function requireAllowlisted_() {
  if (!isAllowlisted_(signedInEmail_())) throw new Error('not authorised');
}

function readTabAsObjects_(name) {
  var sheet = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sheet) return [];
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  var header = values[0].map(String);
  return values.slice(1).map(function (row) {
    var obj = {};
    header.forEach(function (h, j) {
      obj[h] = (row[j] instanceof Date) ? row[j].toISOString() : row[j];
    });
    return obj;
  });
}

// Minimal authenticated shell proving the whole loop (sign-in, allowlist,
// data read). Milestone 0 replaces this with the real viewer (the generalised
// seed matrix); the server functions above are already its data API.
function viewerShellHtml_(email) {
  return '' +
'<!doctype html><html><head><meta charset="utf-8">' +
'<meta name="viewport" content="width=device-width, initial-scale=1">' +
'<style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;' +
'max-width:44em;margin:2em auto;padding:0 1em;color:#1d1d1f;line-height:1.4}' +
'h1{font-size:1.2em} .muted{color:#666} li{margin:0.2em 0}</style></head><body>' +
'<h1>TeacherViewer <span class="muted">(shell, pre-M0)</span></h1>' +
'<p class="muted">Signed in as ' + esc_(email) + '. The real viewer lands here at milestone 0; ' +
'this shell proves sign-in, the allowlist, and data access.</p>' +
'<p id="status">Loading project tabs…</p><ul id="list"></ul>' +
'<script>' +
'google.script.run.withSuccessHandler(function(ps){' +
'  document.getElementById("status").textContent = ps.length ? "Project tabs:" : "No project tabs found.";' +
'  document.getElementById("list").innerHTML = ps.map(function(p){' +
'    return "<li><b>"+p.project+"</b>: "+p.rows+" rows</li>";}).join("");' +
'}).withFailureHandler(function(e){' +
'  document.getElementById("status").textContent = "Error: "+e.message;' +
'}).tvListProjects();' +
'</script></body></html>';
}

function getProjectSheet_(project) {
  var name = sanitizeTab_(project || 'misc');
  if (RESERVED_TABS[name]) name = 'misc';  // a payload cannot write into classes/teachers
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
  }
  return sheet;
}

// Google Sheets tab names: <=100 chars, cannot contain  [ ] * ? / \ :
function sanitizeTab_(s) {
  return String(s).replace(/[\[\]\*\?\/\\:]/g, '_').slice(0, 100) || 'misc';
}

function esc_(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
