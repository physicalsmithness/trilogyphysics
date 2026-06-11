/* ============================================================================
   Trilogy Physics — TOPIC_CONFIG for Electricity 6.2, v0.2 (SCHEMA v1.0 aligned)
   ----------------------------------------------------------------------------
   Drives the shared engine (d017). Subtags, atoms, and misconception slugs are
   the RATIFIED 6.2 vocabulary (review/trilogy_electricity_vocabulary_proposal.md,
   ratified by Smith 2026-06-08) as locked into SCHEMA.md v1.0. Items obey that
   schema: { id, board, tier:F|H|FH, topic, subtag, syllabus_codes[], atoms[],
   qtype, difficulty, prompt, marks, ... } with per-qtype fields.

   ITEMS ARE EMPTY ON PURPOSE — Authoring owns 6.2 content. ?demo=1 loads a few
   neutral fixtures (tagged _demo) so the loop, grading, circuit diagram, and the
   per-atom dashboard are demonstrable. They are not teaching content.

   The misconception map below is a LABEL subset for the dashboard; the canonical
   registry (slug/topic/label/description) lives in data/misconceptions for the
   engine to read (SCHEMA "Registries"), owned with Authoring.
   ============================================================================ */

(function () {
  "use strict";
  window.TRILOGY_TOPICS = window.TRILOGY_TOPICS || {};

  // Subtags = dashboard groups (proposal §1).
  const SUBTAGS = [
    { slug: "circuit_basics",     label: "Circuit basics" },
    { slug: "charge_current",     label: "Charge & current" },
    { slug: "resistance_ohm",     label: "Resistance & V=IR" },
    { slug: "iv_characteristics", label: "I–V characteristics" },
    { slug: "series_parallel",    label: "Series & parallel" },
    { slug: "mains_ac_dc",        label: "Mains, a.c./d.c." },
    { slug: "mains_safety",       label: "Mains safety" },
    { slug: "power_electrical",   label: "Electrical power" },
    { slug: "energy_appliances",  label: "Energy & appliances" },
    { slug: "national_grid",      label: "National Grid" }
  ];

  // Atoms = the per-skill units the dashboard tracks (proposal §2), each tagged
  // with its subtag. Tier-shared (tier carried on the item, d005).
  const ATOMS = [
    { slug: "recall_symbol",                 subtag: "circuit_basics",     label: "Recall a symbol" },
    { slug: "draw_measuring_circuit",        subtag: "circuit_basics",     label: "Draw a measuring circuit" },
    { slug: "meter_placement",               subtag: "circuit_basics",     label: "Meter placement" },
    { slug: "charge_flow_calc",              subtag: "charge_current",     label: "Q = It" },
    { slug: "current_as_rate",               subtag: "charge_current",     label: "Current as rate of charge" },
    { slug: "ohm_law_calc",                  subtag: "resistance_ohm",     label: "V = IR" },
    { slug: "resistance_definition",         subtag: "resistance_ohm",     label: "R = V/I (definition)" },
    { slug: "ohmic_recognise",               subtag: "iv_characteristics", label: "Recognise ohmic" },
    { slug: "ohmic_sketch",                  subtag: "iv_characteristics", label: "Sketch ohmic I–V" },
    { slug: "filament_behaviour",            subtag: "iv_characteristics", label: "Filament behaviour" },
    { slug: "diode_behaviour",               subtag: "iv_characteristics", label: "Diode behaviour" },
    { slug: "thermistor_behaviour",          subtag: "iv_characteristics", label: "Thermistor R–T" },
    { slug: "ldr_behaviour",                 subtag: "iv_characteristics", label: "LDR R–light" },
    { slug: "rp_resistance_method",          subtag: "iv_characteristics", label: "RP15 resistance method" },
    { slug: "rp_wire_length",                subtag: "iv_characteristics", label: "RP16 R ∝ L" },
    { slug: "series_current_same",           subtag: "series_parallel",    label: "Series current same" },
    { slug: "series_voltage_sum",            subtag: "series_parallel",    label: "Series pd sum" },
    { slug: "parallel_voltage_same",         subtag: "series_parallel",    label: "Parallel pd same" },
    { slug: "parallel_current_sum",          subtag: "series_parallel",    label: "Parallel current sum" },
    { slug: "series_resistance_sum",         subtag: "series_parallel",    label: "Series R sum" },
    { slug: "parallel_resistance_qualitative",subtag: "series_parallel",   label: "Parallel R is less (qual.)" },
    { slug: "cells_in_series_voltage",       subtag: "series_parallel",    label: "Cells in series" },
    { slug: "choose_right_V",                subtag: "series_parallel",    label: "Choose the right pd" },
    { slug: "choose_right_I",                subtag: "series_parallel",    label: "Choose the right current" },
    { slug: "mains_values_recall",           subtag: "mains_ac_dc",        label: "230 V / 50 Hz" },
    { slug: "ac_vs_dc",                      subtag: "mains_ac_dc",        label: "a.c. vs d.c." },
    { slug: "wire_identification",           subtag: "mains_safety",       label: "Live/neutral/earth" },
    { slug: "earthing_fuse_safety",          subtag: "mains_safety",       label: "Earthing & fuse safety" },
    { slug: "cable_insulation",              subtag: "mains_safety",       label: "Cable & insulation" },
    { slug: "power_vi_calc",                 subtag: "power_electrical",   label: "P = VI" },
    { slug: "power_i2r_calc",                subtag: "power_electrical",   label: "P = I²R" },
    { slug: "power_rating_interpret",        subtag: "power_electrical",   label: "Power rating" },
    { slug: "energy_pt_calc",                subtag: "energy_appliances",  label: "E = Pt" },
    { slug: "energy_qv_calc",                subtag: "energy_appliances",  label: "E = QV" },
    { slug: "appliance_energy_reasoning",    subtag: "energy_appliances",  label: "Appliance energy/cost" },
    { slug: "transformer_function",          subtag: "national_grid",      label: "Transformer role" },
    { slug: "grid_high_voltage_reason",      subtag: "national_grid",      label: "Why high V on the grid" }
  ];

  // Label subset for the dashboard (canonical registry: data/misconceptions).
  const MISCONCEPTIONS = [
    { slug: "swapped_series_parallel",        label: "Swapped the series and parallel rules (qualitative)" },
    { slug: "topology_indifferent_assumption",label: "Assumed topology does not change the distribution" },
    { slug: "equal_share_assumption",         label: "Assumed an equal share between unequal branches" },
    { slug: "confused_v_and_i",               label: "Confused voltage and current" },
    { slug: "voltage_same_in_series",         label: "Assumed equal pd across series components" },
    { slug: "current_consumed_at_components", label: "Thinks current is used up in a component" },
    { slug: "confused_definition_with_law",   label: "Treated R=V/I as Ohm's law, not the definition" },
    { slug: "diode_reverse_current_nonzero",  label: "Reverse diode current 'reverses/decreases' not zero" },
    { slug: "proportionality_stated_as_increases", label: "Said 'increases' instead of naming proportionality" },
    { slug: "mains_values_confused",          label: "Wrong/swapped mains pd or frequency" },
    { slug: "live_neutral_earth_confused",    label: "Mismatched wire to colour/role" },
    { slug: "transformer_role_confused",      label: "Step-up vs step-down inverted" },
    { slug: "grid_loss_reason_missed",        label: "Missed high V → low I → low I²R loss" },
    { slug: "prefix_not_converted",           label: "Did not convert an SI prefix (mA, kΩ)" },
    { slug: "rounding_mistake",               label: "Right method, rounding/precision slip" }
  ];

  const CONFIG = {
    id: "6.2", slug: "electricity", name: "Electricity",
    board: "aqa_trilogy_8464",
    subtags: SUBTAGS, atoms: ATOMS, misconceptions: MISCONCEPTIONS,
    diagram_kinds: ["circuit", "iv_characteristic", "resistance_temperature",
                    "resistance_light", "ac_dc_trace", "transformer",
                    "transmission_line", "mains_three_wire", "live_earth_danger"],
    items: []   // <-- Authoring fills this, to SCHEMA.md v1.0.
  };

  function demoItems() {
    return [
      {
        id: "_demo_series_R", qtype: "mcq", board: "aqa_trilogy_8464", tier: "FH",
        topic: "6.2", subtag: "series_parallel", syllabus_codes: ["6.2.1.4"],
        atoms: ["series_resistance_sum"], difficulty: "d1", marks: 1, equation_sheet: "must_recall",
        prompt: "Two identical resistors are connected in series, as shown. Compared with a single one of them, the total resistance is:",
        diagram: { kind: "circuit", params: { dsl: "2cb,sc,r,r" } },
        choices: [
          { text: "doubled" },
          { text: "halved", misconception_id: "swapped_series_parallel" },
          { text: "unchanged", misconception_id: "topology_indifferent_assumption" },
          { text: "quartered" }
        ],
        answerIndex: 0,
        applicable_misconceptions: ["swapped_series_parallel", "topology_indifferent_assumption"],
        explanation: "Resistances in series add, so two identical resistors give double the resistance.",
        source: "authored"
      },
      {
        id: "_demo_parallel_multi", qtype: "mcq_multi", board: "aqa_trilogy_8464", tier: "H",
        topic: "6.2", subtag: "series_parallel", syllabus_codes: ["6.2.2"],
        atoms: ["parallel_voltage_same", "parallel_current_sum", "parallel_resistance_qualitative"],
        difficulty: "d2", marks: 2,
        prompt: "Two identical resistors are connected in parallel. Which statements are correct?",
        diagram: { kind: "circuit", params: { dsl: "2cb,sc,(r;r)" } },
        choices: [
          { text: "The pd across each resistor is the same" },
          { text: "The total resistance is less than one resistor alone" },
          { text: "The total resistance is double one resistor", misconception_id: "swapped_series_parallel" },
          { text: "The current divides between the branches" }
        ],
        answerIndices: [0, 1, 3],
        applicable_misconceptions: ["swapped_series_parallel", "equal_share_assumption"],
        explanation: "In parallel the pd across each branch is the same and the total resistance is below either branch.",
        source: "authored"
      },
      {
        id: "_demo_grid_short", qtype: "short", board: "aqa_trilogy_8464", tier: "H",
        topic: "6.2", subtag: "national_grid", syllabus_codes: ["6.2.6.3"],
        atoms: ["grid_high_voltage_reason"], difficulty: "d3", marks: 3,
        prompt: "Explain why electrical power is transmitted across the National Grid at very high voltage.",
        markPoints: [
          { any: ["high voltage", "higher voltage", "step up", "step-up"] },
          { any: ["low current", "lower current", "smaller current", "reduce the current", "reduces current"] },
          { any: ["power loss", "heat", "i²r", "i2r", "i squared r", "energy loss", "heating", "dissipat"] }
        ],
        applicable_misconceptions: ["grid_loss_reason_missed", "confused_v_and_i"],
        explanation: "High voltage means a lower current for the same power, and lower current cuts the I²R heating loss in the cables.",
        source: "authored"
      },
      {
        id: "_demo_iv_select", qtype: "mcq", board: "aqa_trilogy_8464", tier: "FH",
        topic: "6.2", subtag: "iv_characteristics", syllabus_codes: ["6.2.1.4"],
        atoms: ["ohmic_recognise"], difficulty: "d2", marks: 1,
        prompt: "Which graph shows the I\u2013V characteristic of an ohmic resistor at constant temperature?",
        choices: [
          { diagram: { kind: "iv_characteristic", params: { device: "ohmic" } } },
          { diagram: { kind: "iv_characteristic", params: { device: "filament" } }, misconception_id: "drew_lamp_curve_for_ohmic" },
          { diagram: { kind: "iv_characteristic", params: { device: "diode" } }, misconception_id: "misread_iv_graph_for_ohmic" },
          { diagram: { kind: "iv_characteristic", params: { device: "filament", variant: "plateau" } }, misconception_id: "misread_iv_graph_for_ohmic" }
        ],
        answerIndex: 0,
        applicable_misconceptions: ["drew_lamp_curve_for_ohmic", "iv_line_one_quadrant_only", "misread_iv_graph_for_ohmic"],
        explanation: "An ohmic conductor at constant temperature gives a straight line through the origin in both quadrants.",
        source: "authored"
      },
      {
        id: "_demo_vir_calc", qtype: "calc_workings", board: "aqa_trilogy_8464", tier: "FH",
        topic: "6.2", subtag: "resistance_ohm", syllabus_codes: ["6.2.1.3"],
        atoms: ["ohm_law_calc"], difficulty: "d1", marks: 4, equation_sheet: "from_insert",
        prompt: "A resistor carries a current of 0.50 A when the pd across it is 6.0 V. Calculate its resistance.",
        calc: {
          knowns: { V: { value: 6.0, unit: "V" }, I: { value: 0.5, unit: "A" } },
          unknown: "R",
          equationCanonicalForms: ["R=V/I"],
          expectedFinalValue: 12,
          expectedUnit: ["Ω", "ohm"],
          requireUnit: true, allowRepeat: false, marks: 4
        },
        explanation: "R = V / I = 6.0 / 0.50 = 12 Ω.",
        source: "authored"
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
