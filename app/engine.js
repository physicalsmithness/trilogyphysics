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
  let WIDGET_INSTANCE = null;  // mounted interactive widget (qtype: "widget")
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
    return EVENT_LOG.filter(function (e) {
      if (e.topic !== topic) return false;
      if (Array.isArray(e.atoms)) return e.atoms.indexOf(atom) !== -1;
      return e.atom === atom;   // legacy single-atom events
    });
  }
  function eventsForTopic(topic) {
    return EVENT_LOG.filter(function (e) { return e.topic === topic; });
  }

  function greennessBucket(events, window_) {
    const graded = events.filter(function (e) { return e.grading !== "ungraded_self_assessed"; });
    if (!graded.length) return "grey";
    const recent = graded.slice(-window_);
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
  // SCHEMA v1.0: tier is F | H | FH on items; the filter is all | F | H.
  function normTier(t) {
    if (t === "F" || t === "H" || t === "FH") return t;
    if (t === "foundation") return "F";
    if (t === "higher") return "H";
    return "FH";   // "both" / unspecified -> shared
  }
  function defaultPrefs() { return { tier: "all" }; }   // all | F | H
  function loadPrefs() {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (!raw) return defaultPrefs();
      const p = JSON.parse(raw);
      const t = p && p.tier;
      return { tier: (t === "F" || t === "H") ? t : "all" };
    } catch (e) { return defaultPrefs(); }
  }
  let PREFS = loadPrefs();
  function persistPrefs() { try { localStorage.setItem(PREFS_KEY, JSON.stringify(PREFS)); } catch (e) {} }

  /* ──────────────────────────────────────────────────────────────────────────
     Pool + servability.
     Known qtypes the engine can serve. calc_workings is interim (see header).
     ────────────────────────────────────────────────────────────────────────── */
  const KNOWN_QTYPES = { mcq: 1, mcq_single: 1, mcq_multi: 1, short: 1, calc_workings: 1, widget: 1, level_of_response_6: 1 };
  function isSingleMcq(q) { return q === "mcq" || q === "mcq_single"; }
  function isMcq(q) { return isSingleMcq(q) || q === "mcq_multi"; }

  function tierMatches(item) {
    const t = normTier(item.tier);
    if (PREFS.tier === "all") return true;
    if (t === "FH") return true;
    return t === PREFS.tier;
  }
  function isServable(item) {
    if (!item || typeof item !== "object") return false;
    if (!KNOWN_QTYPES[item.qtype] && !item.fallback) return false;   // d047 fallback self-check
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
  // MCQ — SCHEMA v1.0: choices[] graded by index against answerIndex(es).
  function correctIndices(item) {
    if (Array.isArray(item.answerIndices)) return item.answerIndices.slice();
    if (typeof item.answerIndex === "number") return [item.answerIndex];
    return [];
  }
  function gradeMcq(item, selectedIdx) {
    const correct = correctIndices(item);
    if (selectedIdx.some(function (i) { return correct.indexOf(i) === -1; })) return "wrong";
    if (selectedIdx.length && correct.every(function (i) { return selectedIdx.indexOf(i) !== -1; })) return "correct";
    if (selectedIdx.length) return "half";   // some right, none wrong, not all
    return "wrong";
  }

  // short — SCHEMA v1.0: free text marked by keyword presence against
  // markPoints:[{any:[synonyms]}]. Keyword-presence only; the engine shows an
  // auto-mark warning and the teacher sees the full text (the schema lock chose
  // this over claim-point selection).
  function gradeShort(item, text) {
    const pts = item.markPoints || [];
    const t = String(text || "").toLowerCase();
    let hits = 0;
    const detail = pts.map(function (mp) {
      const got = (mp.any || []).some(function (syn) {
        const s = String(syn).toLowerCase().trim();
        return s !== "" && t.indexOf(s) !== -1;
      });
      if (got) hits++;
      return { got: got, any: mp.any || [] };
    });
    const status = (pts.length && hits === pts.length) ? "correct" : (hits > 0 ? "half" : "wrong");
    return { status: status, hits: hits, total: pts.length, detail: detail };
  }

  // SCHEMA v1.0 calc knowns are {SYM:{value,unit,dimension,asGiven}}; the lifted
  // grader wants flat {SYM:value}. Flatten before marking.
  function normalizeCalc(calc) {
    if (!calc || !calc.knowns) return calc;
    const flat = {}; let changed = false;
    Object.keys(calc.knowns).forEach(function (sym) {
      const v = calc.knowns[sym];
      if (v && typeof v === "object" && "value" in v) { flat[sym] = v.value; changed = true; }
      else flat[sym] = v;
    });
    return changed ? Object.assign({}, calc, { knowns: flat }) : calc;
  }

  // calc_workings — value-only fallback grader (see file header). The final numeric value
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
  // Misconceptions OFFERED on an item: per-choice slugs plus the explicit
  // applicable_misconceptions list (SCHEMA v1.0, principle 1 track-non-fires).
  function slugsOffered(item) {
    const seen = {}, out = [];
    function add(sg) { if (sg && !seen[sg]) { seen[sg] = true; out.push(sg); } }
    (item.choices || []).forEach(function (c) { add(c.misconception_id || c.misconception); });
    ((item.lor && item.lor.points) || []).forEach(function (pt) { add(pt.misconception_id || pt.misconception); });
    (item.applicable_misconceptions || []).forEach(add);
    return out;
  }
  function buildEvent(item, picked, status, misconceptionId) {
    const atoms = (Array.isArray(item.atoms) && item.atoms.length) ? item.atoms.slice()
                : (item.atom ? [item.atom] : []);
    return {
      item_id: item.id,
      topic: (M && M.topic && M.topic.id) || item.topic || "",
      atoms: atoms,
      subtag: item.subtag || atoms[0] || "",
      syllabus: (item.syllabus_codes && item.syllabus_codes[0]) || item.syllabus || "",
      qtype: item.qtype,
      tier: normTier(item.tier),
      status: status,
      picked_id: Array.isArray(picked) ? picked.join(",") : (picked == null ? "" : String(picked)),
      misconception_id: misconceptionId || null,
      slugs_offered: slugsOffered(item),
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

  function destroyWidget() {
    if (WIDGET_INSTANCE && typeof WIDGET_INSTANCE.destroy === "function") {
      try { WIDGET_INSTANCE.destroy(); } catch (e) {}
    }
    WIDGET_INSTANCE = null;
  }
  function renderItem(item) {
    destroyWidget();
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
      (normTier(item.tier) !== "FH" ? ' · <span class="tp-tier">' + escapeHtml(normTier(item.tier)) + '</span>' : '')));

    renderDiagram(item, card);
    card.appendChild(el("p", "tp-prompt", renderInline(item.prompt)));

    if (isMcq(item.qtype)) renderMcq(item, card);
    else if (item.qtype === "short") renderShort(item, card);
    else if (item.qtype === "calc_workings") renderCalc(item, card);
    else if (item.qtype === "widget") renderWidget(item, card);
    else if (item.qtype === "level_of_response_6") renderLor(item, card);
    else if (item.fallback) renderFallback(item, card);

    const fb = el("div", "tp-feedback");
    fb.id = "tp-feedback"; fb.hidden = true;
    card.appendChild(fb);
  }

  // A choice may be {text} or {diagram:{kind,params}} or {widget:{kind,config}}
  // (SCHEMA v1.3, d036). Returns a render node for the non-text forms, else null.
  function choiceNode(choice) {
    if (!window.TrilogyDiagrams || typeof window.TrilogyDiagrams.render !== "function") return null;
    if (choice.diagram) return window.TrilogyDiagrams.render(choice.diagram);
    if (choice.widget) return window.TrilogyDiagrams.render({ kind: choice.widget.kind, params: choice.widget.config });
    return null;
  }
  function renderMcq(item, card) {
    const choices = item.choices || [];
    // DISPLAYED_OPTIONS holds {choice, idx} so grading stays keyed to the
    // authored index while presentation is shuffled.
    DISPLAYED_OPTIONS = shuffle(choices.map(function (c, i) { return { choice: c, idx: i }; }));
    SELECTED_IDS = [];
    const opts = el("div", "tp-options");
    DISPLAYED_OPTIONS.forEach(function (d, pos) {
      const b = el("button", "tp-option");
      b.type = "button"; b.dataset.idx = String(d.idx);
      b.innerHTML = '<span class="tp-optkey">[' + (pos + 1) + ']</span>';
      const body = el("span", "tp-optbody");
      const node = choiceNode(d.choice);
      if (node) body.appendChild(node);
      else body.innerHTML = renderInline(d.choice.text || d.choice.label || "");
      b.appendChild(body);
      b.addEventListener("click", function () { onPick(d.idx); });
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
      "Write your answer. Include the key points; press Submit when done."));
    const ta = document.createElement("textarea");
    ta.id = "tp-short-input"; ta.className = "tp-short-input"; ta.rows = 3; ta.autocomplete = "off";
    card.appendChild(ta);
    const go = el("button", "tp-calc-go", "Submit");
    go.type = "button";
    go.addEventListener("click", function () { commitShort(ta.value); });
    card.appendChild(go);
    card.appendChild(el("div", "tp-shortwarn",
      "Auto-marking checks for key words only. If you think you were right, your teacher can see your full answer."));
    setTimeout(function () { ta.focus(); }, 20);
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
    if (Array.isArray(calc.stages) && calc.stages.length && window.TrilogyCalcWorkings) {
      renderCalcChain(item, card); return;
    }
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

  // Chained multi-stage calc_workings (d047). Each calc.stages[i] is a single-
  // block spec (equation/knowns/unknown/expectedFinalValue/expectedUnit +
  // markScheme). We loop the lifted single-block marker per stage and carry the
  // pupil's own previous-stage final value forward under ECF (gate:
  // from_previous_part), so a wrong earlier value still earns later method marks.
  // ECF carry is by value-match (the stage known equal to the previous stage's
  // expected value is replaced with the pupil's value); for an isolated-unknown
  // equation the expected value is recomputed from the carried known so the
  // pupil's consistent working scores. v1 limitation: non-isolated stage
  // equations keep the official expected value (method marks via the equation
  // line still apply); noted to Architecture.
  function chainFieldId(si, slot) { return "tp-cc-" + si + "-" + slot; }

  function recomputeStageAnswer(stage, effKnowns) {
    const CW = window.TrilogyCalcWorkings;
    try {
      const eqn = CW.calcParseEqn(stage.equation);
      const lsyms = Object.keys(CW.calcSymbols(eqn.left));
      if (lsyms.length === 1 && lsyms[0].toLowerCase() === String(stage.unknown).toLowerCase()) {
        const vars = {};
        Object.keys(effKnowns).forEach(function (k) { vars[k.toLowerCase()] = effKnowns[k]; });
        const v = CW.calcEval(eqn.right, vars);
        if (isFinite(v)) return v;
      }
    } catch (e) {}
    return null;
  }

  function markCalcChain(item, allLines) {
    const CW = window.TrilogyCalcWorkings;
    const stages = (item.calc && item.calc.stages) || [];
    const results = [];
    let totalAwarded = 0, totalPossible = 0;
    let prevVal = null, prevExpected = null;
    stages.forEach(function (stage, i) {
      const effKnowns = {};
      Object.keys(stage.knowns || {}).forEach(function (k) { effKnowns[k] = stage.knowns[k]; });
      let carried = false;
      if (stage.gate && prevVal != null && prevExpected != null) {
        Object.keys(effKnowns).forEach(function (k) {
          if (effKnowns[k] === prevExpected) { effKnowns[k] = prevVal; carried = true; }
        });
      }
      let expFinal = stage.expectedFinalValue;
      if (carried) { const rc = recomputeStageAnswer(stage, effKnowns); if (rc != null) expFinal = rc; }
      const spec = {
        knowns: effKnowns, unknown: stage.unknown,
        expectedFinalValue: expFinal, expectedUnit: stage.expectedUnit || [],
        equationCanonicalForms: [stage.equation],
        requireUnit: i === stages.length - 1,    // unit mark on the final stage
        tolerance: stage.tolerance, marks: 4
      };
      const res = CW.markCalcWorkings(spec, allLines[i] || {});
      const possible = (stage.markScheme && stage.markScheme.length) || 4;
      const awarded = Math.round(possible * res.marksAwarded / 4);
      totalAwarded += awarded; totalPossible += possible;
      results.push({ stage: i + 1, awarded: awarded, possible: possible, carried: carried,
                     lineResults: res.lineResults, errorTypes: res.errorTypes || [] });
      // pupil's own final value for this stage feeds the next stage's ECF
      const lv = allLines[i] && allLines[i].line4Value;
      const num = lv != null ? parseFloat(String(lv).replace(/,/g, "")) : NaN;
      prevVal = isFinite(num) ? num : null;
      prevExpected = stage.expectedFinalValue;
    });
    const possible = item.marks || totalPossible || 1;
    const marks = (totalPossible === possible)
      ? totalAwarded
      : Math.min(possible, Math.round(possible * totalAwarded / (totalPossible || 1)));
    const status = marks >= possible ? "full" : marks > 0 ? "partial" : "none";
    return { marks: marks, possible: possible, status: status, stages: results };
  }

  function renderCalcChain(item, card) {
    const stages = (item.calc && item.calc.stages) || [];
    const wrap = el("div", "tp-calc");
    wrap.appendChild(el("div", "tp-calc-lede",
      "Multi-stage calculation. Work each stage through; each line earns a mark, and a wrong value carried forward still earns later method marks."));
    function field(id, label, ph) {
      const f = el("div", "tp-calc-field");
      f.appendChild(el("label", "tp-calc-flab", label));
      const inp = document.createElement("input");
      inp.id = id; inp.className = "tp-calc-input"; inp.type = "text"; inp.autocomplete = "off";
      if (ph) inp.placeholder = ph;
      f.appendChild(inp);
      return f;
    }
    stages.forEach(function (stage, i) {
      const block = el("div", "tp-cc-stage");
      block.appendChild(el("div", "tp-cc-stage-h", "Stage " + (i + 1)
        + (stage.equation ? " \u00b7 " + escapeHtml(stage.equation) : "")));
      block.appendChild(field(chainFieldId(i, "l1"), "Equation", stage.equation ? ("e.g. " + stage.equation) : ""));
      block.appendChild(field(chainFieldId(i, "l2"), "Substitute", ""));
      block.appendChild(field(chainFieldId(i, "l3"), "Rearrange / evaluate", ""));
      const f4 = el("div", "tp-calc-field");
      f4.appendChild(el("label", "tp-calc-flab", "Stage answer"));
      const row = el("div", "tp-calc-row");
      const v = document.createElement("input");
      v.id = chainFieldId(i, "v"); v.className = "tp-calc-input"; v.type = "text"; v.autocomplete = "off"; v.placeholder = "value";
      const u = document.createElement("input");
      u.id = chainFieldId(i, "u"); u.className = "tp-calc-input tp-calc-unit"; u.type = "text"; u.autocomplete = "off"; u.placeholder = "unit";
      row.appendChild(v); row.appendChild(u); f4.appendChild(row); block.appendChild(f4);
      wrap.appendChild(block);
    });
    const go = el("button", "tp-calc-go", "Mark my working");
    go.type = "button";
    go.addEventListener("click", commitCalcChain);
    wrap.appendChild(go);
    card.appendChild(wrap);
    setTimeout(function () { const e = document.getElementById(chainFieldId(0, "l1")); if (e) e.focus(); }, 20);
  }

  function commitCalcChain() {
    if (STATE !== "answering" || !CURRENT_ITEM) return;
    const item = CURRENT_ITEM;
    const stages = (item.calc && item.calc.stages) || [];
    const allLines = stages.map(function (stage, i) {
      return {
        line1: calcVal(chainFieldId(i, "l1")), line2: calcVal(chainFieldId(i, "l2")),
        line3: calcVal(chainFieldId(i, "l3")), line4Value: calcVal(chainFieldId(i, "v")),
        line4Unit: calcVal(chainFieldId(i, "u"))
      };
    });
    STATE = "feedback"; SESSION_COUNT++;
    const res = markCalcChain(item, allLines);
    const status = res.status === "full" ? "correct" : res.status === "partial" ? "half" : "wrong";
    const ev = buildEvent(item, "chain", status, null);
    ev.marks = res.marks + "/" + res.possible;
    ev.error_types = res.stages.reduce(function (acc, st) { return acc.concat(st.errorTypes || []); }, []);
    appendToEventLog(ev); reportToShell(ev);
    revealCalcChain(item, res);
    showFeedback(item, status, ev);
  }

  function revealCalcChain(item, res) {
    const stages = (item.calc && item.calc.stages) || [];
    stages.forEach(function (stage, i) {
      ["l1", "l2", "l3", "v", "u"].forEach(function (slot) {
        const e = document.getElementById(chainFieldId(i, slot)); if (e) e.disabled = true;
      });
    });
    const card = document.getElementById("tp-qcard"); if (!card) return;
    const box = el("div", "tp-calc-reveal");
    box.appendChild(el("div", "tp-calc-reveal-h", "Marked: " + res.marks + "/" + res.possible));
    res.stages.forEach(function (st) {
      box.appendChild(el("div", "tp-cc-stage-h", "Stage " + st.stage + ": " + st.awarded + "/" + st.possible
        + (st.carried ? " (carried forward)" : "")));
      (st.lineResults || []).forEach(function (lr, idx) {
        const labels = ["Equation", "Substitute", "Rearrange", "Answer"];
        const mark = lr.ok ? '<span class="tp-cw-tick">\u2713</span>' : '<span class="tp-cw-cross">\u2717</span>';
        const reason = (!lr.ok && lr.reason) ? ' <span class="tp-cw-reason">' + escapeHtml(lr.reason) + '</span>' : '';
        box.appendChild(el("div", "tp-calc-line tp-cw-result",
          mark + ' <span class="tp-calc-line-lab">' + (labels[idx] || "") + '</span> ' + escapeHtml(lr.user || "(blank)") + reason));
      });
    });
    if (item.explanation) box.appendChild(el("div", "tp-calc-line", escapeHtml(item.explanation)));
    card.insertBefore(box, document.getElementById("tp-feedback"));
  }

  /* ── interaction ── */
  function onPick(idx) {
    if (STATE !== "answering" || !CURRENT_ITEM) return;
    if (CURRENT_ITEM.qtype === "mcq_multi" || CURRENT_ITEM.qtype === "level_of_response_6") toggleSelection(idx);
    else commitMcq([idx]);
  }
  function toggleSelection(idx) {
    const i = SELECTED_IDS.indexOf(idx);
    if (i === -1) SELECTED_IDS.push(idx); else SELECTED_IDS.splice(i, 1);
    const btn = document.querySelector('.tp-option[data-idx="' + idx + '"]');
    if (btn) btn.classList.toggle("is-selected", SELECTED_IDS.indexOf(idx) !== -1);
  }

  function commitMcq(idxs) {
    if (STATE !== "answering" || !CURRENT_ITEM) return;
    STATE = "feedback"; SESSION_COUNT++;
    const item = CURRENT_ITEM;
    const status = gradeMcq(item, idxs);
    const correct = correctIndices(item);
    let misc = null;
    idxs.forEach(function (i) {
      if (correct.indexOf(i) === -1) {
        const c = (item.choices || [])[i];
        if (c && (c.misconception_id || c.misconception)) misc = c.misconception_id || c.misconception;
      }
    });
    const ev = buildEvent(item, idxs.length === 1 ? idxs[0] : idxs, status, misc);
    appendToEventLog(ev); reportToShell(ev);
    markOptions(item, idxs);
    showFeedback(item, status, ev);
  }

  function commitShort(text) {
    if (STATE !== "answering" || !CURRENT_ITEM) return;
    STATE = "feedback"; SESSION_COUNT++;
    const item = CURRENT_ITEM;
    const res = gradeShort(item, text);
    const ev = buildEvent(item, String(text || "").slice(0, 120), res.status, null);
    ev.short_hits = res.hits + "/" + res.total;
    appendToEventLog(ev); reportToShell(ev);
    revealShort(item, res);
    showFeedback(item, res.status, ev);
  }
  function revealShort(item, res) {
    const ta = document.getElementById("tp-short-input"); if (ta) ta.disabled = true;
    const card = document.getElementById("tp-qcard"); if (!card) return;
    const box = el("div", "tp-calc-reveal");
    box.appendChild(el("div", "tp-calc-reveal-h", "Mark points: " + res.hits + "/" + res.total));
    (res.detail || []).forEach(function (d) {
      const mark = d.got ? '<span class="tp-cw-tick">\u2713</span>' : '<span class="tp-cw-cross">\u2717</span>';
      box.appendChild(el("div", "tp-calc-line tp-cw-result", mark + ' ' + escapeHtml(d.any[0] || "")));
    });
    if (item.explanation) box.appendChild(el("div", "tp-calc-line", escapeHtml(item.explanation)));
    card.insertBefore(box, document.getElementById("tp-feedback"));
  }

  // Interactive widget (SCHEMA v1.2 / d031, d035). The Widgets chats own the
  // input surface via window.TOPIC_WIDGETS[kind](host, config) -> instance with
  // { getAnswer(), score(answer,config) -> {marksAwarded,marksPossible,status,
  // hits,misses,errorCodes}, destroy() }. Housing owns marks, mastery, and the
  // attempt event. errorCodes are misconception slugs (d035), logged so the d004
  // fire/avoid dashboard unifies MCQ, calc_workings, and widget errors.
  function renderWidget(item, card) {
    const w = item.widget || {};
    const factory = (window.TOPIC_WIDGETS || {})[w.kind];
    const host = el("div", "tp-widget-host");
    card.appendChild(host);
    if (typeof factory !== "function") {
      host.appendChild(el("div", "stimulus-missing",
        "[interactive widget '" + escapeHtml(w.kind || "") + "' not available]"));
      return;
    }
    try { WIDGET_INSTANCE = factory(host, w.config || {}); }
    catch (e) {
      WIDGET_INSTANCE = null;
      host.appendChild(el("div", "stimulus-missing", "[widget failed to mount]"));
      return;
    }
    const go = el("button", "tp-calc-go", "Submit");
    go.type = "button";
    go.addEventListener("click", commitWidget);
    card.appendChild(go);
  }

  function commitWidget() {
    if (STATE !== "answering" || !CURRENT_ITEM) return;
    const item = CURRENT_ITEM, w = item.widget || {};
    if (!WIDGET_INSTANCE || typeof WIDGET_INSTANCE.getAnswer !== "function"
        || typeof WIDGET_INSTANCE.score !== "function") return;
    STATE = "feedback"; SESSION_COUNT++;
    const answer = WIDGET_INSTANCE.getAnswer();
    let res;
    try { res = WIDGET_INSTANCE.score(answer, w.config || {}); }
    catch (e) { res = { marksAwarded: 0, marksPossible: (w.config && w.config.marks) || 1, status: "none", hits: [], misses: [], errorCodes: [] }; }
    res = res || {};
    const status = res.status === "full" ? "correct" : res.status === "partial" ? "half" : "wrong";
    const codes = res.errorCodes || [];
    const ev = buildEvent(item, JSON.stringify(answer).slice(0, 160), status, codes[0] || null);
    ev.error_codes = codes;
    ev.marks = (res.marksAwarded != null ? res.marksAwarded : "?") + "/" + (res.marksPossible != null ? res.marksPossible : "?");
    appendToEventLog(ev); reportToShell(ev);
    revealWidget(item, res);
    showFeedback(item, status, ev);
  }

  function revealWidget(item, res) {
    const card = document.getElementById("tp-qcard"); if (!card) return;
    const box = el("div", "tp-calc-reveal");
    box.appendChild(el("div", "tp-calc-reveal-h", "Marked: "
      + (res.marksAwarded != null ? res.marksAwarded : "?") + "/"
      + (res.marksPossible != null ? res.marksPossible : "?")));
    (res.hits || []).forEach(function (h) {
      box.appendChild(el("div", "tp-calc-line tp-cw-result", '<span class="tp-cw-tick">\u2713</span> ' + escapeHtml(String(h))));
    });
    (res.misses || []).forEach(function (m) {
      box.appendChild(el("div", "tp-calc-line tp-cw-result", '<span class="tp-cw-cross">\u2717</span> ' + escapeHtml(String(m))));
    });
    if (item.explanation) box.appendChild(el("div", "tp-calc-line", escapeHtml(item.explanation)));
    card.insertBefore(box, document.getElementById("tp-feedback"));
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
    try { res = CW.markCalcWorkings(normalizeCalc(calc), lines); }
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

  function markOptions(item, idxs) {
    const optsEl = document.querySelector(".tp-options");
    if (!optsEl) return;
    const correct = correctIndices(item);
    Array.prototype.forEach.call(optsEl.querySelectorAll(".tp-option"), function (b) {
      b.disabled = true; b.classList.add("is-disabled"); b.classList.remove("is-selected");
      const idx = parseInt(b.dataset.idx, 10);
      const picked = idxs.indexOf(idx) !== -1;
      const good = correct.indexOf(idx) !== -1;
      if (picked) { if (good) b.classList.add("is-correct"); else b.classList.add("is-wrong"); }
      else if (good) b.classList.add("is-missed");   // correct option not picked
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
    [["all", "Both"], ["F", "Foundation"], ["H", "Higher"]].forEach(function (pair) {
      const b = el("button", "tp-tierbtn" + (PREFS.tier === pair[0] ? " is-active" : ""), pair[1]);
      b.type = "button";
      b.addEventListener("click", function () {
        PREFS.tier = pair[0]; persistPrefs(); buildPool(); renderDashboard();
      });
      tierBox.appendChild(b);
    });
    root.appendChild(tierBox);

    // Per-atom mastery mosaic, grouped by subtag (SCHEMA v1.0). Cells colour by
    // running average of the last COVERAGE_WINDOW attempts on items carrying the atom.
    const subtags = (M.config && M.config.subtags) || [];
    const block = el("div", "tp-atomblock");
    block.appendChild(el("div", "tp-atomblock-h", "Atom coverage"));
    function atomCell(a) {
      const ev = eventsForAtom(topic, a.slug);
      const graded = ev.filter(function (e) { return e.grading !== "ungraded_self_assessed"; });
      const recent = graded.slice(-COVERAGE_WINDOW);
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
      cell.title = (a.label || a.slug) + " \u2014 " + (ev.length ? ev.length + " attempts" : "not attempted");
      cell.appendChild(el("span", "tp-atomcell-lab", escapeHtml(a.label || a.slug)));
      return cell;
    }
    if (subtags.length) {
      subtags.forEach(function (st) {
        const group = atoms.filter(function (a) { return a.subtag === st.slug; });
        if (!group.length) return;
        block.appendChild(el("div", "tp-subtag-h", escapeHtml(st.label || st.slug)));
        const grid = el("div", "tp-atomgrid");
        group.forEach(function (a) { grid.appendChild(atomCell(a)); });
        block.appendChild(grid);
      });
    } else {
      const grid = el("div", "tp-atomgrid");
      atoms.forEach(function (a) { grid.appendChild(atomCell(a)); });
      block.appendChild(grid);
    }
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
  function firedSlugs(e) {
    const f = {};
    if (e.misconception_id) f[e.misconception_id] = true;
    (e.error_types || []).forEach(function (c) { if (c) f[c] = true; });   // calc_workings
    (e.error_codes || []).forEach(function (c) { if (c) f[c] = true; });   // widgets
    return f;
  }
  function computeMisconceptionTable(topic) {
    const agg = {};
    eventsForTopic(topic).forEach(function (e) {
      const fired = firedSlugs(e);
      const offered = {};
      (e.slugs_offered || []).forEach(function (s) { offered[s] = true; });
      Object.keys(fired).forEach(function (s) { offered[s] = true; });   // a fired slug was offered
      Object.keys(offered).forEach(function (slug) {
        if (!agg[slug]) agg[slug] = { slug: slug, fired: 0, avoided: 0 };
        if (fired[slug]) agg[slug].fired++; else agg[slug].avoided++;
      });
    });
    return Object.keys(agg).map(function (k) { return agg[k]; })
      .sort(function (a, b) { return (b.fired + b.avoided) - (a.fired + a.avoided); });
  }

  // level_of_response_6 — the AQA 6-mark level-of-response item. Interim form
  // (d023): selectable claim-points against level descriptors until an LLM grader
  // lands. The pupil ticks the points they would include; marks come from how
  // many creditworthy points are selected, with wrong picks costing a mark, then
  // mapped to the 6-mark scale (author bands override the default mapping).
  function gradeLor(item, selectedIdx) {
    const pts = (item.lor && item.lor.points) || [];
    const possible = item.marks || 6;
    const C = pts.filter(function (p) { return p.creditworthy; }).length || 1;
    let hits = 0, wrong = 0;
    selectedIdx.forEach(function (i) {
      const p = pts[i]; if (!p) return;
      if (p.creditworthy) hits++; else wrong++;
    });
    const net = Math.max(0, hits - wrong);
    let marks, band = "";
    const bands = item.lor && item.lor.bands;
    if (Array.isArray(bands) && bands.length) {
      bands.slice().sort(function (a, b) { return (b.minHits || 0) - (a.minHits || 0); })
        .some(function (bnd) { if (net >= (bnd.minHits || 0)) { marks = bnd.marks; band = bnd.label || ""; return true; } return false; });
      if (marks == null) marks = 0;
    } else {
      marks = Math.round(possible * net / C);
    }
    marks = Math.max(0, Math.min(possible, marks));
    if (!band) {
      const third = possible / 3;
      band = marks >= 2 * third ? "Level 3" : marks >= third ? "Level 2" : marks >= 1 ? "Level 1" : "";
    }
    const status = marks >= Math.ceil(possible * 5 / 6) ? "full" : marks >= 1 ? "partial" : "none";
    return { marks: marks, possible: possible, net: net, hits: hits, wrong: wrong, status: status, band: band, C: C };
  }

  function renderLor(item, card) {
    const pts = (item.lor && item.lor.points) || [];
    const mk = item.marks || pts.filter(function (p) { return p.creditworthy; }).length;
    card.appendChild(el("div", "tp-shortlede",
      (mk ? "This is a " + mk + "-mark answer. " : "") + "Tick the points you would include for a full response."));
    DISPLAYED_OPTIONS = shuffle(pts.map(function (pt, i) { return { choice: pt, idx: i }; }));
    SELECTED_IDS = [];
    const opts = el("div", "tp-options");
    DISPLAYED_OPTIONS.forEach(function (d, pos) {
      const b = el("button", "tp-option");
      b.type = "button"; b.dataset.idx = String(d.idx);
      b.innerHTML = '<span class="tp-optkey">[' + (pos + 1) + ']</span>';
      const body = el("span", "tp-optbody"); body.innerHTML = renderInline(d.choice.text || "");
      b.appendChild(body);
      b.addEventListener("click", function () { onPick(d.idx); });
      opts.appendChild(b);
    });
    card.appendChild(opts);
    const go = el("button", "tp-calc-go", "Submit");
    go.type = "button";
    go.addEventListener("click", commitLor);
    card.appendChild(go);
    card.appendChild(el("div", "tp-hint",
      "Tick all that belong, then Submit. Marked by how many creditworthy points you include; a wrong pick costs a mark."));
  }

  function commitLor() {
    if (STATE !== "answering" || !CURRENT_ITEM) return;
    const item = CURRENT_ITEM, pts = (item.lor && item.lor.points) || [];
    STATE = "feedback"; SESSION_COUNT++;
    const res = gradeLor(item, SELECTED_IDS);
    const status = res.status === "full" ? "correct" : res.status === "partial" ? "half" : "wrong";
    const fired = [];
    SELECTED_IDS.forEach(function (i) {
      const p = pts[i];
      if (p && !p.creditworthy && (p.misconception_id || p.misconception)) fired.push(p.misconception_id || p.misconception);
    });
    const ev = buildEvent(item, SELECTED_IDS.join(","), status, fired[0] || null);
    ev.error_codes = fired;
    ev.marks = res.marks + "/" + res.possible;
    appendToEventLog(ev); reportToShell(ev);
    revealLor(item, res);
    showFeedback(item, status, ev);
  }

  function revealLor(item, res) {
    const pts = (item.lor && item.lor.points) || [];
    const optsEl = document.querySelector(".tp-options");
    if (optsEl) {
      Array.prototype.forEach.call(optsEl.querySelectorAll(".tp-option"), function (b) {
        b.disabled = true; b.classList.add("is-disabled"); b.classList.remove("is-selected");
        const idx = parseInt(b.dataset.idx, 10);
        const p = pts[idx]; const picked = SELECTED_IDS.indexOf(idx) !== -1;
        if (p && p.creditworthy) { if (picked) b.classList.add("is-correct"); else b.classList.add("is-missed"); }
        else if (picked) b.classList.add("is-wrong");
      });
    }
    const card = document.getElementById("tp-qcard"); if (!card) return;
    const box = el("div", "tp-calc-reveal");
    box.appendChild(el("div", "tp-calc-reveal-h",
      "Marked: " + res.marks + "/" + res.possible + (res.band ? " (" + res.band + ")" : "")));
    if (item.explanation) box.appendChild(el("div", "tp-calc-line", escapeHtml(item.explanation)));
    card.insertBefore(box, document.getElementById("tp-feedback"));
  }

  // Generic fallback self-check (d047): any item whose qtype the engine does not
  // natively grade, but which carries a `fallback` block, ships as a self-check.
  // Render prompt (already shown) + axes note + reveal model + self-mark; log as
  // ungraded_self_assessed so it records exposure without polluting atom accuracy.
  function renderFallback(item, card) {
    const fb = item.fallback || {};
    if (item.axes) {
      const ax = item.axes;
      card.appendChild(el("div", "tp-shortlede", "Sketch on paper. Axes: x = "
        + escapeHtml((ax.x && ax.x.label) || "x") + ", y = " + escapeHtml((ax.y && ax.y.label) || "y") + "."));
    }
    const reveal = el("button", "tp-calc-go", "Reveal model answer");
    reveal.type = "button";
    card.appendChild(reveal);
    reveal.addEventListener("click", function () {
      reveal.disabled = true;
      const box = el("div", "tp-calc-reveal");
      box.appendChild(el("div", "tp-calc-reveal-h", "Model answer"));
      const node = (fb.reveal && window.TrilogyDiagrams) ? window.TrilogyDiagrams.render(fb.reveal) : null;
      if (node) { const holder = el("div", "stimulus"); holder.appendChild(node); box.appendChild(holder); }
      if (item.explanation) box.appendChild(el("div", "tp-calc-line", escapeHtml(item.explanation)));
      if (fb.self_mark_prompt) box.appendChild(el("div", "tp-calc-line", escapeHtml(fb.self_mark_prompt)));
      const row = el("div", "tp-selfmark");
      [["correct", "I got it right"], ["half", "Partly"], ["wrong", "Not yet"]].forEach(function (pair) {
        const b = el("button", "tp-tierbtn", pair[1]); b.type = "button";
        b.addEventListener("click", function () { commitFallback(item, pair[0], fb); });
        row.appendChild(b);
      });
      box.appendChild(row);
      card.insertBefore(box, document.getElementById("tp-feedback"));
    });
  }
  function commitFallback(item, selfStatus, fb) {
    if (STATE !== "answering" || !CURRENT_ITEM) return;
    STATE = "feedback"; SESSION_COUNT++;
    const ev = buildEvent(item, "self:" + selfStatus, selfStatus, null);
    ev.grading = (fb && fb.log_as) || "ungraded_self_assessed";
    appendToEventLog(ev); reportToShell(ev);
    showFeedback(item, selfStatus, ev);
  }

  /* ── keyboard: digits pick/toggle, Enter commits multi/short ── */
  function onKey(e) {
    if (!M || STATE !== "answering" || !CURRENT_ITEM) return;
    const q = CURRENT_ITEM;
    if (q.qtype === "calc_workings" || q.qtype === "short" || q.qtype === "widget" || q.fallback) return;   // own inputs
    if (/^[1-9]$/.test(e.key)) {
      const pos = parseInt(e.key, 10) - 1;
      const d = DISPLAYED_OPTIONS[pos];
      if (d) { e.preventDefault(); onPick(d.idx); }
    } else if (e.key === "Enter") {
      if (q.qtype === "mcq_multi" && SELECTED_IDS.length) { e.preventDefault(); commitMcq(SELECTED_IDS.slice()); }
      else if (q.qtype === "level_of_response_6" && SELECTED_IDS.length) { e.preventDefault(); commitLor(); }
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
    // Canonical registry (data/misconceptions.js) first; per-topic config overlays.
    (window.TRILOGY_MISCONCEPTIONS || []).forEach(function (m) { if (m && m.slug) LABELS_MISC[m.slug] = m.label || m.slug; });
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
    destroyWidget();
    if (M && M.container) M.container.innerHTML = "";
    M = null; POOL = []; CURRENT_ITEM = null; STATE = "idle";
  }

  window.TrilogyEngine = { mount: mount, unmount: unmount, version: "0.3" };

  /* ── headless test surface (no DOM needed for these pure fns) ── */
  window.TRILOGY_ENGINE_TEST = {
    gradeMcq: gradeMcq,
    correctIndices: correctIndices,
    gradeShort: gradeShort,
    gradeLor: gradeLor,
    gradeCalcWorkings: gradeCalcWorkings,
    normalizeCalc: normalizeCalc,
    markCalcChain: markCalcChain,
    normTier: normTier,
    buildEvent: function (item, picked, status, misc, topicId) {
      M = M || { topic: { id: topicId || (item.topic || "") } };
      return buildEvent(item, picked, status, misc);
    },
    isServable: isServable,
    greennessBucket: greennessBucket,
    bandKeyForAverage: bandKeyForAverage,
    mixWithWhite: mixWithWhite,
    slugsOffered: slugsOffered,
    renderInline: renderInline,
    setPrefsTier: function (t) { PREFS = { tier: t }; },
    KNOWN_QTYPES: KNOWN_QTYPES
  };
})();
