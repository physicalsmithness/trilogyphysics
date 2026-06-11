/* ============================================================================
   Trilogy Physics — TOPIC_CONFIG for Electricity 6.2, v0.1
   ----------------------------------------------------------------------------
   The per-topic config the one shared engine is driven by (d017 (Trilogy-wide
   driller, electricity first); the TOPIC_CONFIG multi-deployment pattern from
   d016). One config object per topic; the engine reads atoms, misconceptions,
   and items from it.

   ITEMS ARE EMPTY ON PURPOSE. Authoring owns 6.2 content (dispatch boundary:
   "Do not author questions"). The Authoring chat fills `items` from its two-pass
   build (kickoff: inter_chat/Architecture_Authoring_kickoff.md). To see the
   engine run before content lands, append ?demo=1 to the URL: a few neutral
   fixtures (clearly tagged _demo) are loaded so the loop, grading, circuit
   diagram, and atom dashboard are demonstrable. They are NOT teaching content.

   ATOMS and MISCONCEPTIONS below are PROVISIONAL starters, taken from the
   sub-topics named in the kickoff. They are placeholders for Authoring's
   Stage-1 vocabulary proposal (review/trilogy_electricity_vocabulary_proposal.md),
   which Architecture ratifies and which then supersedes this list.

   Item schema the engine consumes (see app/engine.js header for the grader):
     { id, qtype, tier, atom, syllabus, prompt, explanation?, diagram?,
       distractors? | claims? | calc? }
     qtype in { mcq_single, mcq_multi, short, calc_workings }
     tier  in { foundation, higher, both }   (d005 (tier is first-class))
   ============================================================================ */

(function () {
  "use strict";

  window.TRILOGY_TOPICS = window.TRILOGY_TOPICS || {};

  // Provisional atom registry (placeholder for Authoring's vocabulary proposal).
  const ATOMS = [
    { slug: "circuit_basics",     label: "Circuit basics" },
    { slug: "components_symbols", label: "Components & symbols" },
    { slug: "series",             label: "Series circuits" },
    { slug: "parallel",           label: "Parallel circuits" },
    { slug: "mixed",              label: "Mixed circuits" },
    { slug: "calc_vir",           label: "V = IR" },
    { slug: "calc_piv",           label: "P = IV" },
    { slug: "calc_i2r",           label: "P = I²R" },
    { slug: "calc_ept",           label: "E = Pt" },
    { slug: "calc_qit",           label: "Q = It" },
    { slug: "iv_characteristics", label: "I–V characteristics" },
    { slug: "mains",              label: "Mains & the grid" }
  ];

  // Provisional misconception labels (placeholder; Authoring proposes the real
  // slugs per distractor as it writes items, d004 (atom dashboard in v1)).
  const MISCONCEPTIONS = [
    { slug: "confused_v_and_i",        label: "Confused voltage and current" },
    { slug: "series_parallel_swapped", label: "Swapped the series and parallel rules" },
    { slug: "equal_share_assumption",  label: "Assumed an equal share of current or pd" },
    { slug: "forgot_prefix_conversion",label: "Did not convert a prefix (mA, kΩ, ...) to SI" },
    { slug: "power_formula_confusion", label: "Picked the wrong power formula" },
    { slug: "rounding_mistake",        label: "Right method, rounding/precision slip" }
  ];

  const CONFIG = {
    id: "6.2",
    slug: "electricity",
    name: "Electricity",
    board: "AQA Trilogy 8464",
    atoms: ATOMS,
    misconceptions: MISCONCEPTIONS,
    // Diagram kinds this topic expects (Widgets registers the renderers; circuit
    // is provided by Housing via diagrams.js).
    diagram_kinds: ["circuit", "iv_characteristic", "resistance_temperature",
                    "resistance_light", "ac_dc_trace", "transformer",
                    "transmission_line", "mains_three_wire", "live_earth_danger"],
    items: []   // <-- Authoring fills this.
  };

  // ── demo fixtures (only with ?demo=1) ───────────────────────────────────────
  function demoItems() {
    return [
      {
        id: "_demo_series_R", qtype: "mcq_single", tier: "both",
        atom: "series", syllabus: "6.2.1.4",
        prompt: "Two identical resistors are connected in series, as shown. Compared with a single one of them, the total resistance is:",
        diagram: { kind: "circuit", params: { dsl: "2cb,sc,r,r" } },
        explanation: "Resistances in series add, so two identical resistors give double the resistance.",
        distractors: [
          { id: "a", text: "doubled", status: "correct" },
          { id: "b", text: "halved", status: "wrong", misconception: "series_parallel_swapped" },
          { id: "c", text: "unchanged", status: "wrong", misconception: "equal_share_assumption" },
          { id: "d", text: "quartered", status: "wrong" }
        ]
      },
      {
        id: "_demo_parallel_multi", qtype: "mcq_multi", tier: "higher",
        atom: "parallel", syllabus: "6.2.1.4.j",
        prompt: "Two identical resistors are connected in parallel. Which statements are correct?",
        diagram: { kind: "circuit", params: { dsl: "2cb,sc,(r;r)" } },
        explanation: "In parallel the pd across each branch is the same and the total resistance is below either branch.",
        distractors: [
          { id: "a", text: "The pd across each resistor is the same", status: "correct" },
          { id: "b", text: "The total resistance is less than one resistor alone", status: "correct" },
          { id: "c", text: "The total resistance is double one resistor", status: "wrong", misconception: "series_parallel_swapped" },
          { id: "d", text: "The current divides equally between identical branches", status: "correct" }
        ]
      },
      {
        id: "_demo_mains_short", qtype: "short", tier: "both",
        atom: "mains", syllabus: "6.2.4",
        prompt: "Why is electrical power transmitted across the National Grid at very high voltage?",
        claims: [
          { id: "a", text: "High voltage means lower current for the same power", correct: true },
          { id: "b", text: "Lower current reduces I²R heating losses in the cables", correct: true },
          { id: "c", text: "High voltage makes the electrons move faster to arrive sooner", correct: false, misconception: "confused_v_and_i" },
          { id: "d", text: "Transformers step the voltage up for transmission and down for use", correct: true }
        ]
      },
      {
        id: "_demo_vir_calc", qtype: "calc_workings", tier: "both",
        atom: "calc_vir", syllabus: "6.2.1.3",
        prompt: "A resistor carries a current of 0.50 A when the pd across it is 6.0 V. Calculate its resistance.",
        calc: {
          knowns: { V: 6.0, I: 0.5 },
          unknown: "R",
          expectedFinalValue: 12,
          expectedUnit: ["Ω", "ohm"],
          equationCanonicalForms: ["R=V/I"],
          requireUnit: true,
          marks: 4
        }
      }
    ];
  }

  try {
    if (typeof location !== "undefined" &&
        new URLSearchParams(location.search).get("demo") === "1") {
      CONFIG.items = CONFIG.items.concat(demoItems());
    }
  } catch (e) {}

  window.TRILOGY_TOPICS["6.2"] = CONFIG;
})();
