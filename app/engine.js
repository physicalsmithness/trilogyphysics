/* ============================================================================
   Trilogy Physics — blended engine, v0.1  (M2 spine)
   ----------------------------------------------------------------------------
   The engine blend mandated by d016 (engine blend: ECM drilling + Pre-IB
   calc_workings/atoms), running BEHIND the course-wide shell in app/index.html
   (d017 (Trilogy-wide driller, electricity first)). It does NOT own identity or
   the network report; the shell does. The shell mounts the engine into a
   topic's panel and hands it an identity + a report callback.

   WHAT IS LIFTED FROM WHERE (the dispatch's explicit-borrowing requirement,
   the answer to the Fields/electricity "could have borrowed more" miss):

     From Electric Circuits Mastery (app/engine.js v0.14), all available and
     lifted here, adapted to the shell seam and the TOPIC_CONFIG pattern:
       - the localStorage event-log mastery model (one record per grading;
         widgets derived from the log, no separate counter state);
       - the MCQ grader (gradeMcq) and its correct/half/wrong vocabulary;
       - slugs_offered per attempt -> fire-vs-avoid per misconception (d047),
         which is exactly the d004 (atom dashboard in v1) "track non-fires"
         requirement;
       - the greenness bucketing + ticks-and-crosses row;
       - the per-atom coverage mosaic colouring (band + mixWithWhite), itself
         lifted into ECM from the Pre-IB engine.
       - the Circuit Builder embed as the `circuit` diagram kind, via the
         TOPIC_DIAGRAMS registry in diagrams.js.

     From the Pre-IB engine (preibphysics/new/engine.js):
       - the calc_workings 4-line marks-the-method calculation type, LIFTED
         VERBATIM into app/calc_workings.js (window.TrilogyCalcWorkings). The
         Drive mount never surfaced the file (online-only), so it was fetched
         from the public GitHub Pages mirror
         https://physicalsmithness.github.io/preibphysics/ . The four-line UI
         (renderCalc/commitCalcFourLine/revealCalcFourLine) drives it; per-line
         marks, reasons, and canonical error codes all come from the lifted
         grader. A value-only calc item (calc.answer.value) still uses the
         simple tolerance grader gradeCalcWorkings as a fallback.

   Public API (window.TrilogyEngine): mount(opts), unmount(). Headless test
   surface: window.TRILOGY_ENGINE_TEST.
   ============================================================================ */

(function () {
  "use strict";

  /* ── persistence keys (engine-local; identity + network are the shell's) ──
     Log is GLOBAL across topics: one mastery profile per pupil (d017). Topic is
     a field on each record, not a key, so the dashboard can scope by topic. */
  const LOG_KEY   = "trilogy_physics_log_v1";
  const PREFS_KEY = "trilogy_physics_engine_prefs_v1";
  const LOG_CAP   = 2000;

  const ROLLING_WINDOW  = 10;   // ticks-and-crosses depth per atom slot
  const ITEM_WINDOW     = 5;    // greenness window per item
  const COVERAGE_WINDOW = 3;    // per-atom mosaic running average depth
  const THRESHOLD_GREEN = 0.8;
  const THRESHOLD_AMBER = 0.5;

  /* ── module state for the currently-mounted topic ── */
  let M = null;          // { container, topic, config, identity, report }
  let POOL = [];         // servable items for the mounted topic
  let CURRENT_ITEM = null;
  let DISPLAYED_OPTIONS = [];
  let SELECTED_IDS = [];
  let STATE = "idle";    // idle | answering | feedback
  let SESSION_COUNT = 0;

  /* ──────────────────────────────────────────────────────────────────────────
     Inline text: subscripts (V_s -> V<sub>s</sub>) + HTML escaping. Lifted
     from ECM.
     ────────────────────────────────────────────────────────────────────────── */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c];
    });
  }
  function withSubscripts(escaped) {
    let out = escaped.replace(/_\{([^}]+)\}/g, "<sub>$1</sub>");
    out = out.replace(/_([A-Za-z0-9])/g, "<sub>$1</sub>");
    return out;
  }
  function renderInline(text) {
    return withSubscripts(escapeHtml(text == null ? "" : String(text)));
  }

  /* ──────────────────────────────────────────────────────────────────────────
     Event log (localStorage). One record per grading. Lifted from ECM.
     ────────────────────────────────────────────────────────────────────────── */
  function loadEventLog() {
    try {
      const raw = (typeof localStorage !== "undefined") && localStorage.getItem(LOG_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  let EVENT_LOG = loadEventLog();
  function persistEventLog() {
    try { localStorage.setItem(LOG_KEY, JSON.stringify(EVENT_LOG)); } catch (e) {}
  }
  function appendToEventLog(event) {
    EVENT_LOG.push(event);
    if (EVENT_LOG.length > LOG_CAP) EVENT_LOG = EVENT_LOG.slice(EVENT_LOG.length - LOG_CAP);
    persistEventLog();
  }
  function eventsForItem(itemId) {
    return EVENT_LOG.filter(function (e) { return e.item_id === itemId; });
  }
  // Atom slot = (topic, atom). Scopes ticks/mosaic to the current topic.
  function eventsForAtom(topic, atom) {
    return EVENT_LOG.filter(function (e) { return e.topic === topic && e.atom === atom; });
  }
  function eventsForTopic(topic) {
    return EVENT_LOG.filter(function (e) { return e.topic === topic; });
  }

  function greennessBucket(events, window_) {
    if (!events.length) return "grey";
    const recent = events.slice(-window_);
    let weight = 0;
    recent.forEach(function (e) {
      if (e.status === "correct") weight += 1;
      else if (e.status === "half") weight += 0.5;
    });
    const acc = weight / recent.length;
    if (acc >= THRESHOLD_GREEN) return "green";
    if (acc >= THRESHOLD_AMBER) return "amber";
    return "red";
  }

  /* Per-atom mosaic colour bands. Lifted (via ECM) from the Pre-IB engine. */
  const BAND = [
    { min: 0.8,  fill: "#2d6a3f" },   // green
    { min: 0.5,  fill: "#b9912b" },   // amber
    { min: 0.0,  fill: "#b03030" },   // red
    { min: null, fill: "#d8d2c4" }    // grey: no attempts
  ];
  function bandKeyForAverage(avg) {
    if (avg == null) return BAND[3];
    for (let i = 0; i < 3; i++) if (avg >= BAND[i].min) return BAND[i];
    return BAND[2];
  }
  function mixWithWhite(hex, t) {
    // t in [0,1]; 0 = full colour, 1 = white. Fades low-evidence cells.
    const m = hex.replace("#", "");
    const r = parseInt(m.slice(0, 2), 16), g = parseInt(m.slice(2, 4), 16), b = parseInt(m.slice(4, 6), 16);
    const mr = Math.round(r + (255 - r) * t), mg = Math.round(g + (255 - g) * t), mb = Math.round(b + (255 - b) * t);
    return "rgb(" + mr + "," + mg + "," + mb + ")";
  }

  /* ──────────────────────────────────────────────────────────────────────────
     Per-topic preferences: tier filter. Persisted globally.
     ────────────────────────────────────────────────────────────────────────── */
  function defaultPrefs() { return { tier: "both" }; }   // both | foundation | higher
  function loadPrefs() {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (!raw) return defaultPrefs();
      const p = JSON.parse(raw);
      const t = p && p.tier;
      return { tier: (t === "foundation" || t === "higher") ? t : "both" };
    } catch (e) { return defaultPrefs(); }
  }
  let PREFS = loadPrefs();
  function persistPrefs() { try { localStorage.setItem(PREFS_KEY, JSON.stringify(PREFS)); } catch (e) {} }

  /* ──────────────────────────────────────────────────────────────────────────
     Pool + servability.
     Known qtypes the engine can serve. calc_workings is interim (see header).
     ────────────────────────────────────────────────────────────────────────── */
  const KNOWN_QTYPES = { mcq_single: 1, mcq_multi: 1, short: 1, calc_workings: 1 };

  function tierMatches(item) {
    const t = item.tier || "both";
    if (PREFS.tier === "both") return true;
    if (t === "both") return true;
    return t === PREFS.tier;
  }
  function isServable(item) {
    if (!item || typeof item !== "object") return false;
    if (!KNOWN_QTYPES[item.qtype]) return false;
    if (!tierMatches(item)) return false;
    return true;
  }
  function buildPool() {
    const items = (M && M.config && Array.isArray(M.config.items)) ? M.config.items : [];
    POOL = items.filter(isServable);
  }

  /* ──────────────────────────────────────────────────────────────────────────
     Graders.
     ────────────────────────────────────────────────────────────────────────── */
  // MCQ — lifted verbatim from ECM. status in {correct, half, wrong}.
  function gradeMcq(question, selectedIds) {
    const opts = question.distractors || [];
    const selected = opts.filter(function (o) { return selectedIds.indexOf(o.id) !== -1; });
    const correctOpts = opts.filter(function (o) { return o.status === "correct"; });
    const correctIds = correctOpts.map(function (o) { return o.id; });
    if (selected.some(function (o) { return o.status === "wrong"; })) return "wrong";
    if (selected.some(function (o) { return o.status === "half"; })) return "half";
    if (selected.length > 0 && selected.every(function (o) { return o.status === "correct"; })) {
      const allPicked = correctIds.every(function (id) { return selectedIds.indexOf(id) !== -1; });
      return allPicked ? "correct" : "half";
    }
    return "wrong";
  }

  // short = claim-point selection (the "selectable claim-points where no
  // free-text grader exists" route named in DESIGN.md). Item carries
  // claims:[{id,text,correct:bool,misconception?}]; learner ticks the claims
  // that belong in a correct answer. Graded like mcq_multi over the claim set.
  // PROVISIONAL pending q-explanation-grader; flagged to Architecture.
  function gradeClaims(item, selectedIds) {
    const claims = item.claims || [];
    const correctIds = claims.filter(function (c) { return c.correct; }).map(function (c) { return c.id; });
    const pickedWrong = claims.some(function (c) {
      return !c.correct && selectedIds.indexOf(c.id) !== -1;
    });
    if (pickedWrong) return "wrong";
    const gotAllRight = correctIds.every(function (id) { return selectedIds.indexOf(id) !== -1; });
    if (gotAllRight && selectedIds.length) return "correct";
    if (selectedIds.length) return "half";   // some right, none wrong, not all
    return "wrong";
  }

  // calc_workings — INTERIM grader (see file header). The final numeric value
  // is graded by ECM's rounding classifier when present; the method lines
  // (formula / substitution / evaluation / unit) are revealed for self-check.
  // Replace this whole function with the ported Pre-IB method-grader when the
  // source is available; the call site and event shape stay identical.
  function gradeCalcWorkings(item, learnerValue) {
    const calc = item.calc || {};
    const target = calc.answer;            // { value, unit?, tolerance? }
    if (target == null || learnerValue == null || learnerValue === "") {
      return { status: "wrong", detail: "no_answer" };
    }
    const learnerNum = parseFloat(String(learnerValue).replace(/,/g, ""));
    if (!isFinite(learnerNum)) return { status: "wrong", detail: "not_numeric" };

    // If the author supplies an ECM-shaped rounding item (calc.rc_item with
    // answer.formula + sample), use ECM's rounding classifier verbatim for the
    // atomic numeric/rounding grade. This is the path that lights up once calc
    // items carry the formula/sample shape; the simple demo items below use the
    // tolerance compare instead. The Pre-IB method-grader, when its source is
    // available, slots in here too — same call site, same return shape.
    const RC = window.CircuitsRoundingClassifier;
    if (RC && typeof RC.classify === "function" && calc.rc_item && calc.rc_item.answer
        && calc.rc_item.answer.formula) {
      try {
        const res = RC.classify(calc.rc_item, learnerNum);
        if (res && res.status) {
          if (res.status === "correct") return { status: "correct", detail: res };
          if (res.status === "half" || res.status === "half_rounding")
            return { status: "half", detail: res, misconception: res.slug || "rounding_mistake" };
          return { status: "wrong", detail: res };
        }
      } catch (e) { /* fall through to plain compare */ }
    }
    // Plain relative-tolerance compare (interim, for value-only calc items).
    const tol = (typeof target.tolerance === "number") ? target.tolerance : 0.01;
    const denom = Math.abs(target.value) || 1;
    const rel = Math.abs(learnerNum - target.value) / denom;
    if (rel <= tol) return { status: "correct", detail: { rel: rel } };
    if (rel <= Math.max(tol * 5, 0.05)) return { status: "half", detail: { rel: rel }, misconception: "rounding_mistake" };
    return { status: "wrong", detail: { rel: rel } };
  }

  /* ──────────────────────────────────────────────────────────────────────────
     Event construction. Carries the atom slug + slugs_offered so the dashboard
     can show per-atom mastery and per-misconception fire-vs-avoid (d004).
     ────────────────────────────────────────────────────────────────────────── */
  function distractorSlugs(item) {
    const opts = item.distractors || item.claims || [];
    const seen = {}, out = [];
    opts.forEach(function (o) {
      const s = o && o.misconception ? o.misconception : null;
      if (s && !seen[s]) { seen[s] = true; out.push(s); }
    });
    return out;
  }
  function buildEvent(item, picked, status, misconceptionId) {
    return {
      item_id: item.id,
      topic: (M && M.topic && M.topic.id) || item.topic || "",
      atom: item.atom || "",
      syllabus: item.syllabus || "",
      qtype: item.qtype,
      tier: item.tier || "both",
      status: status,
      picked_id: Array.isArray(picked) ? picked.join(",") : (picked == null ? "" : picked),
      misconception_id: misconceptionId || null,
      slugs_offered: distractorSlugs(item),
      ts: new Date().toISOString()
    };
  }

  /* Report to the shell (which adds project/identity/session/topic and POSTs to
     REPORT_URL). Payload fields match the ECM reportAttempt() schema (d016). */
  function reportToShell(event) {
    if (!M || typeof M.report !== "function") return;
    M.report({
      item_id: event.item_id,
      qtype: event.qtype,
      mode: event.tier,        // shell's `level`/`mode` slots carry tier for now
      level: event.tier,
      status: event.status,
      picked_id: event.picked_id,
      misconception_id: event.misconception_id || ""
    });
  }

  /* ──────────────────────────────────────────────────────────────────────────
     Rendering.
     ────────────────────────────────────────────────────────────────────────── */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function renderDiagram(item, card) {
    if (!item.diagram) return;
    let node = null;
    if (window.TrilogyDiagrams && typeof window.TrilogyDiagrams.render === "function") {
      node = window.TrilogyDiagrams.render(item.diagram);
    }
    const holder = el("div", "stimulus");
    if (node) {
      holder.appendChild(node);
    } else {
      holder.appendChild(el("div", "stimulus-missing",
        "[" + escapeHtml(item.diagram.kind || "diagram") + " — widget not yet available]"));
    }
    card.appendChild(holder);
  }

  function pickNext() {
    if (!POOL.length) return null;
    // Weight toward weaker / less-seen atoms: lowest greenness first, ties random.
    const scored = POOL.map(function (it) {
      const ev = eventsForItem(it.id);
      const b = greennessBucket(ev, ITEM_WINDOW);
      const rank = b === "grey" ? 0 : b === "red" ? 1 : b === "amber" ? 2 : 3;
      return { it: it, rank: rank, r: Math.random() };
    }).sort(function (a, b) { return (a.rank - b.rank) || (a.r - b.r); });
    // Avoid immediately repeating the just-served item when there's a choice.
    if (CURRENT_ITEM && scored.length > 1 && scored[0].it.id === CURRENT_ITEM.id) {
      return scored[1].it;
    }
    return scored[0].it;
  }

  function renderItem(item) {
    CURRENT_ITEM = item;
    SELECTED_IDS = [];
    STATE = "answering";
    const card = document.getElementById("tp-qcard");
    if (!card) return;
    card.innerHTML = "";

    // counter + per-item greenness
    const bucket = greennessBucket(eventsForItem(item.id), ITEM_WINDOW);
    card.appendChild(el("div", "tp-counter",
      '<span class="tp-greenness tp-greenness-' + bucket + '" title="Your recent accuracy on this item"></span>' +
      ' Question ' + (SESSION_COUNT + 1) + ' this session' +
      (item.tier && item.tier !== "both" ? ' · <span class="tp-tier">' + escapeHtml(item.tier) + '</span>' : '')));

    renderDiagram(item, card);
    card.appendChild(el("p", "tp-prompt", renderInline(item.prompt)));

    if (item.qtype === "mcq_single" || item.qtype === "mcq_multi") renderMcq(item, card);
    else if (item.qtype === "short") renderShort(item, card);
    else if (item.qtype === "calc_workings") renderCalc(item, card);

    const fb = el("div", "tp-feedback");
    fb.id = "tp-feedback"; fb.hidden = true;
    card.appendChild(fb);
  }

  function renderMcq(item, card) {
    DISPLAYED_OPTIONS = shuffle(item.distractors || []);
    const opts = el("div", "tp-options");
    DISPLAYED_OPTIONS.forEach(function (opt, idx) {
      const b = el("button", "tp-option");
      b.type = "button"; b.dataset.optionId = opt.id;
      b.innerHTML = '<span class="tp-optkey">[' + (idx + 1) + ']</span>' +
                    '<span class="tp-optbody">' + renderInline(opt.text || "") + '</span>';
      b.addEventListener("click", function () { onPick(opt.id); });
      opts.appendChild(b);
    });
    card.appendChild(opts);
    if (item.qtype === "mcq_multi") {
      card.appendChild(el("div", "tp-hint",
        'Select all that apply, then press <kbd>Enter</kbd> to submit.'));
    }
  }

  function renderShort(item, card) {
    card.appendChild(el("div", "tp-shortlede",
      "Tick every statement that belongs in a correct answer."));
    DISPLAYED_OPTIONS = shuffle(item.claims || []);
    const opts = el("div", "tp-options");
    DISPLAYED_OPTIONS.forEach(function (c, idx) {
      const b = el("button", "tp-option");
      b.type = "button"; b.dataset.optionId = c.id;
      b.innerHTML = '<span class="tp-optkey">[' + (idx + 1) + ']</span>' +
                    '<span class="tp-optbody">' + renderInline(c.text || "") + '</span>';
      b.addEventListener("click", function () { toggleSelection(c.id); });
      opts.appendChild(b);
    });
    card.appendChild(opts);
    card.appendChild(el("div", "tp-hint",
      'Tick all that belong, then press <kbd>Enter</kbd> to submit.'));
  }

  // A full calc_workings item carries an unknown + expectedFinalValue and is
  // graded by the verbatim Pre-IB marks-the-method grader (window.TrilogyCalcWorkings,
  // app/calc_workings.js). A value-only calc item (answer.value) uses the simple
  // tolerance grader (gradeCalcWorkings).
  function calcIsFourLine(calc) {
    return !!(calc && calc.unknown && typeof calc.expectedFinalValue === "number"
              && window.TrilogyCalcWorkings);
  }
  function calcVal(id) { const e = document.getElementById(id); return e ? e.value : ""; }

  function renderCalc(item, card) {
    const calc = item.calc || {};
    const wrap = el("div", "tp-calc");
    if (calcIsFourLine(calc)) {
      wrap.appendChild(el("div", "tp-calc-lede",
        "Show your working. Each line earns a mark, so method counts even if the arithmetic slips."));
      function field(id, label, ph) {
        const f = el("div", "tp-calc-field");
        f.appendChild(el("label", "tp-calc-flab", label));
        const inp = document.createElement("input");
        inp.id = id; inp.className = "tp-calc-input"; inp.type = "text"; inp.autocomplete = "off";
        if (ph) inp.placeholder = ph;
        f.appendChild(inp);
        return f;
      }
      const eg = (calc.equationCanonicalForms && calc.equationCanonicalForms[0]) || "";
      wrap.appendChild(field("tp-cw-l1", "1 \u00b7 Equation", eg ? ("e.g. " + eg) : ""));
      wrap.appendChild(field("tp-cw-l2", "2 \u00b7 Substitute the values", ""));
      wrap.appendChild(field("tp-cw-l3", "3 \u00b7 Rearrange and evaluate", ""));
      const f4 = el("div", "tp-calc-field");
      f4.appendChild(el("label", "tp-calc-flab", "4 \u00b7 Final answer"));
      const row = el("div", "tp-calc-row");
      const v = document.createElement("input");
      v.id = "tp-cw-v"; v.className = "tp-calc-input"; v.type = "text"; v.autocomplete = "off"; v.placeholder = "value";
      const u = document.createElement("input");
      u.id = "tp-cw-u"; u.className = "tp-calc-input tp-calc-unit"; u.type = "text"; u.autocomplete = "off"; u.placeholder = "unit";
      row.appendChild(v); row.appendChild(u); f4.appendChild(row); wrap.appendChild(f4);
      const go = el("button", "tp-calc-go", "Mark my working");
      go.type = "button";
      go.addEventListener("click", commitCalcFourLine);
      wrap.appendChild(go);
      card.appendChild(wrap);
      setTimeout(function () { const e = document.getElementById("tp-cw-l1"); if (e) e.focus(); }, 20);
      return;
    }
    // value-only fallback
    wrap.appendChild(el("div", "tp-calc-lede",
      "Work it through. Enter your final value; the worked lines reveal after."));
    const row = el("div", "tp-calc-row");
    const input = document.createElement("input");
    input.id = "tp-calc-input"; input.className = "tp-calc-input";
    input.type = "text"; input.autocomplete = "off";
    input.placeholder = calc.answer && calc.answer.unit ? ("value in " + calc.answer.unit) : "final value";
    row.appendChild(input);
    const go = el("button", "tp-calc-go", "Check");
    go.type = "button";
    go.addEventListener("click", function () { commitCalc(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") commitCalc(input.value); });
    row.appendChild(go);
    wrap.appendChild(row);
    card.appendChild(wrap);
    setTimeout(function () { input.focus(); }, 20);
  }

  /* ── interaction ── */
  function onPick(id) {
    if (STATE !== "answering" || !CURRENT_ITEM) return;
    if (CURRENT_ITEM.qtype === "mcq_multi") toggleSelection(id);
    else commitMcq([id]);
  }
  function toggleSelection(id) {
    const i = SELECTED_IDS.indexOf(id);
    if (i === -1) SELECTED_IDS.push(id); else SELECTED_IDS.splice(i, 1);
    const btn = document.querySelector('.tp-option[data-option-id="' + cssEsc(id) + '"]');
    if (btn) btn.classList.toggle("is-selected", SELECTED_IDS.indexOf(id) !== -1);
  }
  function cssEsc(s) { return String(s).replace(/"/g, '\\"'); }

  function commitMcq(ids) {
    if (STATE !== "answering" || !CURRENT_ITEM) return;
    STATE = "feedback"; SESSION_COUNT++;
    const item = CURRENT_ITEM;
    let status, misc = null;
    if (item.qtype === "short") {
      status = gradeClaims(item, ids);
    } else {
      status = gradeMcq(item, ids);
      const pickedOpt = (item.distractors || []).find(function (o) { return ids.indexOf(o.id) !== -1 && o.status !== "correct"; });
      misc = pickedOpt && pickedOpt.misconception ? pickedOpt.misconception : null;
    }
    const ev = buildEvent(item, ids.length === 1 ? ids[0] : ids, status, misc);
    appendToEventLog(ev); reportToShell(ev);
    markOptions(item, ids);
    showFeedback(item, status, ev);
  }

  function commitCalc(rawValue) {
    if (STATE !== "answering" || !CURRENT_ITEM) return;
    STATE = "feedback"; SESSION_COUNT++;
    const item = CURRENT_ITEM;
    const res = gradeCalcWorkings(item, rawValue);
    const ev = buildEvent(item, String(rawValue), res.status, res.misconception || null);
    appendToEventLog(ev); reportToShell(ev);
    revealCalcLines(item);
    showFeedback(item, res.status, ev);
  }

  // Four-line calc_workings: gather the lines, run the verbatim marks-the-method
  // grader, map its full/partial/none to correct/half/wrong, log error_types.
  function commitCalcFourLine() {
    if (STATE !== "answering" || !CURRENT_ITEM) return;
    const item = CURRENT_ITEM, calc = item.calc || {};
    const CW = window.TrilogyCalcWorkings;
    const lines = {
      line1: calcVal("tp-cw-l1"), line2: calcVal("tp-cw-l2"), line3: calcVal("tp-cw-l3"),
      line4Value: calcVal("tp-cw-v"), line4Unit: calcVal("tp-cw-u")
    };
    let res;
    try { res = CW.markCalcWorkings(calc, lines); }
    catch (e) { res = { status: "none", marksAwarded: 0, marksPossible: calc.marks || 4, lineResults: [], errorTypes: [] }; }
    STATE = "feedback"; SESSION_COUNT++;
    const status = res.status === "full" ? "correct" : res.status === "partial" ? "half" : "wrong";
    const summary = [lines.line1, lines.line2, lines.line3, (lines.line4Value + " " + lines.line4Unit).trim()].join(" | ");
    const ev = buildEvent(item, summary, status, (res.errorTypes && res.errorTypes[0]) || null);
    ev.error_types = res.errorTypes || [];
    ev.marks = res.marksAwarded + "/" + res.marksPossible;
    appendToEventLog(ev); reportToShell(ev);
    revealCalcFourLine(item, res);
    showFeedback(item, status, ev);
  }

  function revealCalcFourLine(item, res) {
    const card = document.getElementById("tp-qcard");
    if (!card) return;
    ["tp-cw-l1", "tp-cw-l2", "tp-cw-l3", "tp-cw-v", "tp-cw-u"].forEach(function (id) {
      const e = document.getElementById(id); if (e) e.disabled = true;
    });
    const box = el("div", "tp-calc-reveal");
    box.appendChild(el("div", "tp-calc-reveal-h",
      "Marked working: " + res.marksAwarded + "/" + res.marksPossible));
    const labels = ["Equation", "Substitute", "Rearrange", "Final answer"];
    (res.lineResults || []).forEach(function (lr, i) {
      const mark = lr.ok ? '<span class="tp-cw-tick">\u2713</span>'
                         : '<span class="tp-cw-cross">\u2717</span>';
      const reason = (!lr.ok && lr.reason)
        ? ' <span class="tp-cw-reason">' + escapeHtml(lr.reason) + '</span>' : '';
      box.appendChild(el("div", "tp-calc-line tp-cw-result",
        mark + ' <span class="tp-calc-line-lab">' + (labels[i] || ("Line " + (i + 1))) + '</span> '
        + escapeHtml(lr.user || "(blank)") + reason));
    });
    card.insertBefore(box, document.getElementById("tp-feedback"));
  }

  function markOptions(item, ids) {
    const optsEl = document.querySelector(".tp-options");
    if (!optsEl) return;
    const pool = item.distractors || item.claims || [];
    Array.prototype.forEach.call(optsEl.querySelectorAll(".tp-option"), function (b) {
      b.disabled = true; b.classList.add("is-disabled"); b.classList.remove("is-selected");
      const id = b.dataset.optionId;
      const opt = pool.find(function (o) { return o.id === id; });
      const picked = ids.indexOf(id) !== -1;
      const good = opt && (opt.status === "correct" || opt.correct === true);
      const half = opt && opt.status === "half";
      if (picked) {
        if (good) b.classList.add("is-correct");
        else if (half) b.classList.add("is-half");
        else b.classList.add("is-wrong");
      } else if (good) {
        b.classList.add("is-missed");   // correct option the learner did not pick
      }
    });
  }

  function revealCalcLines(item) {
    const calc = item.calc || {};
    const lines = calc.lines || [];   // [{label, text}] formula/sub/eval/unit
    const card = document.getElementById("tp-qcard");
    if (!card) return;
    const box = el("div", "tp-calc-reveal");
    box.appendChild(el("div", "tp-calc-reveal-h", "Worked solution"));
    if (lines.length) {
      lines.forEach(function (ln) {
        box.appendChild(el("div", "tp-calc-line",
          (ln.label ? '<span class="tp-calc-line-lab">' + renderInline(ln.label) + '</span> ' : '') +
          renderInline(ln.text)));
      });
    } else if (calc.answer != null) {
      box.appendChild(el("div", "tp-calc-line",
        "Answer: " + renderInline(String(calc.answer.value)) +
        (calc.answer.unit ? " " + renderInline(calc.answer.unit) : "")));
    }
    const inp = document.getElementById("tp-calc-input");
    if (inp) { inp.disabled = true; }
    card.insertBefore(box, document.getElementById("tp-feedback"));
  }

  function showFeedback(item, status, ev) {
    const fb = document.getElementById("tp-feedback");
    if (fb) {
      fb.hidden = false;
      fb.className = "tp-feedback tp-feedback-" + status;
      let msg = status === "correct" ? "Correct."
              : status === "half" ? "Partly right."
              : "Not right.";
      // Plain-speaking explanation, no false near-miss praise (principle 2).
      if (item.explanation) msg += " " + escapeHtml(item.explanation);
      else if (status !== "correct" && ev.misconception_id && LABELS_MISC[ev.misconception_id])
        msg += " " + escapeHtml(LABELS_MISC[ev.misconception_id]);
      fb.innerHTML = '<div class="tp-fb-line">' + msg + '</div>' +
        '<button type="button" class="tp-next" id="tp-next">Next question →</button>';
      const nb = document.getElementById("tp-next");
      if (nb) nb.addEventListener("click", nextQuestion);
      if (nb) nb.focus();
    }
    renderDashboard();
  }

  function nextQuestion() {
    buildPool();
    const next = pickNext();
    if (!next) {
      const card = document.getElementById("tp-qcard");
      if (card) card.innerHTML = '<p class="tp-prompt">No items available for this tier. ' +
        'Switch the tier filter, or this topic is still being authored.</p>';
      return;
    }
    renderItem(next);
  }

  /* ──────────────────────────────────────────────────────────────────────────
     Dashboard: tier control, ticks-and-crosses per atom, per-atom mastery
     mosaic, and per-misconception fire-vs-avoid. This is the d004 atom
     dashboard skeleton, live from day one.
     ────────────────────────────────────────────────────────────────────────── */
  let LABELS_ATOM = {};      // atom slug -> label, from TOPIC_CONFIG
  let LABELS_MISC = {};      // misconception slug -> label, from TOPIC_CONFIG

  function renderDashboard() {
    const root = document.getElementById("tp-dashboard");
    if (!root || !M) return;
    const topic = M.topic.id;
    const atoms = (M.config && M.config.atoms) || [];   // [{slug,label}]
    root.innerHTML = "";

    // Tier control.
    const tierBox = el("div", "tp-tierctrl");
    tierBox.appendChild(el("span", "tp-tierctrl-lab", "Tier:"));
    ["both", "foundation", "higher"].forEach(function (t) {
      const b = el("button", "tp-tierbtn" + (PREFS.tier === t ? " is-active" : ""), t);
      b.type = "button";
      b.addEventListener("click", function () {
        PREFS.tier = t; persistPrefs(); buildPool(); renderDashboard();
      });
      tierBox.appendChild(b);
    });
    root.appendChild(tierBox);

    // Per-atom mastery mosaic + last-N ticks.
    const block = el("div", "tp-atomblock");
    block.appendChild(el("div", "tp-atomblock-h", "Atom coverage"));
    const grid = el("div", "tp-atomgrid");
    atoms.forEach(function (a) {
      const ev = eventsForAtom(topic, a.slug);
      const recent = ev.slice(-COVERAGE_WINDOW);
      let avg = null;
      if (recent.length) {
        let w = 0;
        recent.forEach(function (e) { w += e.status === "correct" ? 1 : e.status === "half" ? 0.5 : 0; });
        avg = w / recent.length;
      }
      const band = bandKeyForAverage(avg);
      const fade = recent.length ? Math.max(0, (COVERAGE_WINDOW - recent.length) / COVERAGE_WINDOW * 0.7) : 1;
      const cell = el("div", "tp-atomcell");
      cell.style.background = avg == null ? band.fill : mixWithWhite(band.fill, fade);
      cell.title = (a.label || a.slug) + " — " + (ev.length ? ev.length + " attempts" : "not attempted");
      cell.appendChild(el("span", "tp-atomcell-lab", escapeHtml(a.label || a.slug)));
      grid.appendChild(cell);
    });
    block.appendChild(grid);
    root.appendChild(block);

    // Per-misconception fire vs avoid (the principle-1 "fired 3, avoided 60").
    const misc = computeMisconceptionTable(topic);
    if (misc.length) {
      const mblock = el("div", "tp-miscblock");
      mblock.appendChild(el("div", "tp-miscblock-h", "Misconceptions: fired vs avoided"));
      misc.forEach(function (m) {
        const total = m.fired + m.avoided;
        const pctAvoid = total ? Math.round(100 * m.avoided / total) : 0;
        const row = el("div", "tp-miscrow");
        row.innerHTML =
          '<span class="tp-miscname">' + escapeHtml(LABELS_MISC[m.slug] || m.slug) + '</span>' +
          '<span class="tp-miscbar"><span class="tp-miscbar-fill" style="width:' + pctAvoid + '%"></span></span>' +
          '<span class="tp-miscnums">avoided ' + m.avoided + ' · fired ' + m.fired + '</span>';
        mblock.appendChild(row);
      });
      root.appendChild(mblock);
    }
  }

  // For each misconception slug offered on items in this topic: count fires
  // (learner picked the distractor carrying it) and avoids (it was offered and
  // the learner did NOT fire it). Lifted from ECM's slugs_offered logic.
  function computeMisconceptionTable(topic) {
    const agg = {};
    eventsForTopic(topic).forEach(function (e) {
      (e.slugs_offered || []).forEach(function (slug) {
        if (!agg[slug]) agg[slug] = { slug: slug, fired: 0, avoided: 0 };
        if (e.misconception_id === slug) agg[slug].fired++;
        else agg[slug].avoided++;
      });
    });
    return Object.keys(agg).map(function (k) { return agg[k]; })
      .sort(function (a, b) { return (b.fired + b.avoided) - (a.fired + a.avoided); });
  }

  /* ── keyboard: digits pick/toggle, Enter commits multi/short ── */
  function onKey(e) {
    if (!M || STATE !== "answering" || !CURRENT_ITEM) return;
    const q = CURRENT_ITEM;
    if (q.qtype === "calc_workings") return;   // input handles its own keys
    if (/^[1-9]$/.test(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      const opt = DISPLAYED_OPTIONS[idx];
      if (opt) { e.preventDefault(); onPick(opt.id); }
    } else if (e.key === "Enter") {
      if (q.qtype === "mcq_multi" && SELECTED_IDS.length) { e.preventDefault(); commitMcq(SELECTED_IDS.slice()); }
      else if (q.qtype === "short" && SELECTED_IDS.length) { e.preventDefault(); commitMcq(SELECTED_IDS.slice()); }
    }
  }

  /* ──────────────────────────────────────────────────────────────────────────
     Mount / unmount — the seam with the shell.
     ────────────────────────────────────────────────────────────────────────── */
  function buildScaffold(container, topic) {
    container.innerHTML =
      '<div class="tp-engine">' +
      '  <div class="tp-main">' +
      '    <section id="tp-qcard" class="tp-qcard" aria-live="polite"></section>' +
      '  </div>' +
      '  <aside id="tp-dashboard" class="tp-dashboard"></aside>' +
      '</div>';
  }

  function mount(opts) {
    opts = opts || {};
    if (!opts.container || !opts.config || !opts.topic) {
      throw new Error("TrilogyEngine.mount needs { container, topic, config, identity?, report? }");
    }
    M = {
      container: opts.container,
      topic: opts.topic,
      config: opts.config,
      identity: opts.identity || null,
      report: typeof opts.report === "function" ? opts.report : null
    };
    LABELS_ATOM = {};
    LABELS_MISC = {};
    (M.config.atoms || []).forEach(function (a) { LABELS_ATOM[a.slug] = a.label || a.slug; });
    (M.config.misconceptions || []).forEach(function (m) { LABELS_MISC[m.slug] = m.label || m.slug; });
    SESSION_COUNT = 0;
    CURRENT_ITEM = null;
    STATE = "idle";
    PREFS = loadPrefs();
    buildScaffold(M.container, M.topic);
    document.addEventListener("keydown", onKey);
    buildPool();
    renderDashboard();
    nextQuestion();
  }

  function unmount() {
    document.removeEventListener("keydown", onKey);
    if (M && M.container) M.container.innerHTML = "";
    M = null; POOL = []; CURRENT_ITEM = null; STATE = "idle";
  }

  window.TrilogyEngine = { mount: mount, unmount: unmount, version: "0.1" };

  /* ── headless test surface (no DOM needed for these pure fns) ── */
  window.TRILOGY_ENGINE_TEST = {
    gradeMcq: gradeMcq,
    gradeClaims: gradeClaims,
    gradeCalcWorkings: gradeCalcWorkings,
    buildEvent: function (item, picked, status, misc, topicId) {
      M = M || { topic: { id: topicId || (item.topic || "") } };
      return buildEvent(item, picked, status, misc);
    },
    isServable: isServable,
    greennessBucket: greennessBucket,
    bandKeyForAverage: bandKeyForAverage,
    mixWithWhite: mixWithWhite,
    distractorSlugs: distractorSlugs,
    renderInline: renderInline,
    setPrefsTier: function (t) { PREFS = { tier: t }; },
    KNOWN_QTYPES: KNOWN_QTYPES
  };
})();
