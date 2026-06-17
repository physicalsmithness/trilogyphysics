/* ============================================================================
   Trilogy Physics — old-shape -> SCHEMA item migration (d053)
   ----------------------------------------------------------------------------
   Reuses the Forces author's transform (review/forces_6_5_migration_and_enhancement.md)
   to migrate a topic file authored against the stale fixture shape
   (mcq_single / distractors[{status}] / claims / tier "both") onto the locked
   SCHEMA the engine reads (mcq + choices[]+answerIndex(es), claim-short ->
   level_of_response_6.lor, tier F|H|FH, atoms[]/syllabus_codes[]).

   Answer keys are preserved exactly: the choice index of each old status:"correct"
   distractor becomes the answerIndex/answerIndices; claim creditworthy sets carry
   over; widget / calc_workings / already-new items pass through verbatim.

   Run:  node tools/migrate_item_shape.js <app/topics/FILE.js> <topicId>
   Writes the migrated file in place and backs the original up to
   outputs/<FILE>.premigration.bak.js
   ============================================================================ */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..");
const rel = process.argv[2], topicId = process.argv[3];
if (!rel || !topicId) { console.error("usage: node tools/migrate_item_shape.js <app/topics/FILE.js> <topicId>"); process.exit(1); }
const target = path.join(ROOT, rel);

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(target, "utf8"), sandbox);
const config = (sandbox.window.TRILOGY_TOPICS || {})[topicId];
if (!config || !Array.isArray(config.items)) { console.error("no TRILOGY_TOPICS[" + topicId + "].items in " + rel); process.exit(1); }

function normTier(t) {
  if (t === "F" || t === "H" || t === "FH") return t;
  if (t === "foundation") return "F";
  if (t === "higher") return "H";
  return "FH";
}
function collectAppl(arr) {
  const seen = {}, out = [];
  arr.forEach(function (d) { const m = d.misconception_id || d.misconception; if (m && !seen[m]) { seen[m] = true; out.push(m); } });
  return out;
}

let counts = {};
function migrate(it) {
  const out = {}; Object.keys(it).forEach(function (k) { out[k] = it[k]; });
  out.board = out.board || config.board || "aqa_trilogy_8464";
  out.topic = out.topic || topicId;
  if (!Array.isArray(out.atoms)) out.atoms = out.atom ? [out.atom] : [];
  if (!Array.isArray(out.syllabus_codes)) out.syllabus_codes = out.syllabus ? [out.syllabus] : [];
  out.tier = normTier(out.tier);

  const qt = out.qtype;
  if ((qt === "mcq_single" || qt === "mcq" || qt === "mcq_multi") && Array.isArray(out.distractors)) {
    const correctIdx = [];
    out.choices = out.distractors.map(function (d, i) {
      const c = {};
      if (d.diagram) c.diagram = d.diagram;
      if (d.widget) c.widget = d.widget;
      if (d.text != null) c.text = d.text;
      const m = d.misconception_id || d.misconception;
      if (m) c.misconception_id = m;
      if (d.status === "correct") correctIdx.push(i);
      return c;
    });
    const multi = (qt === "mcq_multi") || correctIdx.length > 1;
    out.qtype = multi ? "mcq_multi" : "mcq";
    if (multi) out.answerIndices = correctIdx; else out.answerIndex = (correctIdx.length ? correctIdx[0] : 0);
    const appl = collectAppl(out.distractors);
    if (appl.length && !out.applicable_misconceptions) out.applicable_misconceptions = appl;
    delete out.distractors;
  } else if (qt === "short" && Array.isArray(out.claims)) {
    out.qtype = "level_of_response_6";
    out.lor = { points: out.claims.map(function (c) {
      const p = { text: c.text, creditworthy: !!c.correct };
      const m = c.misconception_id || c.misconception; if (m) p.misconception_id = m;
      return p;
    }) };
    out.marks = out.marks || out.lor.points.filter(function (p) { return p.creditworthy; }).length || 1;
    const appl = collectAppl(out.claims);
    if (appl.length && !out.applicable_misconceptions) out.applicable_misconceptions = appl;
    delete out.claims;
  }
  // widget / calc_workings / short-with-markPoints / already-new items: verbatim
  counts[out.qtype] = (counts[out.qtype] || 0) + 1;
  return out;
}

const before = config.items.length;
config.items = config.items.map(migrate);

// backup + re-emit
fs.mkdirSync(path.join(ROOT, "outputs"), { recursive: true });
fs.copyFileSync(target, path.join(ROOT, "outputs", path.basename(rel, ".js") + ".premigration.bak.js"));
const header = "/* SHAPE-MIGRATED to SCHEMA by tools/migrate_item_shape.js (Housing, d053).\n"
  + "   Original backed up to outputs/" + path.basename(rel, ".js") + ".premigration.bak.js\n"
  + "   Answer keys preserved (status:correct -> answerIndex; claims -> lor.points). */\n";
const body = "(function(){\n  \"use strict\";\n  window.TRILOGY_TOPICS = window.TRILOGY_TOPICS || {};\n"
  + "  window.TRILOGY_TOPICS[" + JSON.stringify(topicId) + "] = " + JSON.stringify(config, null, 1) + ";\n})();\n";
fs.writeFileSync(target, header + body);
console.log("migrated " + before + " items in " + rel + " -> " + JSON.stringify(counts));
