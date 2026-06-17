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
    { slug: "identify_topology",            subtag: "series_parallel",    label: "Identify series/parallel topology" },
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
    items: [
      {
        "id": "ohm_vir_clean_01",
        "qtype": "calc_workings",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "resistance_ohm",
        "syllabus_codes": [
          "6.2.1.3.c"
        ],
        "atoms": [
          "ohm_law_calc"
        ],
        "prompt": "The current in a filament lamp is 1.5 A when the potential difference across it is 12 V. Calculate the resistance of the filament lamp.\nUse the equation: potential difference = current × resistance",
        "explanation": "Rearrange V = IR to R = V / I. R = 12 / 1.5 = 8 Ω.",
        "source": "authored",
        "calc": {
          "knowns": {
            "V": 12,
            "I": 1.5
          },
          "unknown": "R",
          "equationCanonicalForms": [
            "V=I*R",
            "R=V/I"
          ],
          "expectedFinalValue": 8,
          "expectedUnit": [
            "Ω",
            "ohm",
            "ohms"
          ],
          "requireUnit": true,
          "marks": 3
        },
        "marks": 3,
        "equation_sheet": "from_insert"
      },
      {
        "id": "ohm_vir_prefix_02",
        "qtype": "calc_workings",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "resistance_ohm",
        "syllabus_codes": [
          "6.2.1.3.c"
        ],
        "atoms": [
          "ohm_law_calc"
        ],
        "prompt": "When the reading on the ammeter is 450 mA, the reading on the voltmeter is 2.7 V. Calculate the resistance of the resistor.\nUse the equation: potential difference = current × resistance",
        "explanation": "Convert 450 mA to 0.45 A first, then R = V / I = 2.7 / 0.45 = 6 Ω. The conversion is the mark most often lost here.",
        "source": "authored",
        "calc": {
          "knowns": {
            "V": 2.7,
            "I": 0.45
          },
          "unknown": "R",
          "equationCanonicalForms": [
            "V=I*R",
            "R=V/I"
          ],
          "expectedFinalValue": 6,
          "expectedUnit": [
            "Ω",
            "ohm",
            "ohms"
          ],
          "requireUnit": true,
          "marks": 4
        },
        "marks": 4,
        "equation_sheet": "from_insert"
      },
      {
        "id": "ohm_findV_03",
        "qtype": "calc_workings",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "resistance_ohm",
        "syllabus_codes": [
          "6.2.1.3.c"
        ],
        "atoms": [
          "ohm_law_calc"
        ],
        "prompt": "A resistor of resistance 15 Ω carries a current of 0.20 A. Calculate the potential difference across the resistor.\nUse the equation: potential difference = current × resistance",
        "explanation": "V = IR = 0.20 × 15 = 3.0 V. No rearrangement needed.",
        "source": "authored",
        "calc": {
          "knowns": {
            "I": 0.2,
            "R": 15
          },
          "unknown": "V",
          "equationCanonicalForms": [
            "V=I*R"
          ],
          "expectedFinalValue": 3,
          "expectedUnit": [
            "V",
            "volt",
            "volts"
          ],
          "requireUnit": true,
          "marks": 3
        },
        "marks": 3,
        "equation_sheet": "from_insert"
      },
      {
        "id": "ohm_findI_poweroften_04",
        "qtype": "calc_workings",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.2",
        "subtag": "resistance_ohm",
        "syllabus_codes": [
          "6.2.1.3.c"
        ],
        "atoms": [
          "ohm_law_calc"
        ],
        "prompt": "The potential difference across a resistor is 6.0 V and its resistance is 2000 Ω. Calculate the current in the resistor.\nUse the equation: potential difference = current × resistance",
        "explanation": "Rearrange to I = V / R = 6.0 / 2000 = 0.003 A (3 mA). The common slip is a power-of-ten error giving 3 or 0.3.",
        "source": "authored",
        "calc": {
          "knowns": {
            "V": 6,
            "R": 2000
          },
          "unknown": "I",
          "equationCanonicalForms": [
            "V=I*R",
            "I=V/R"
          ],
          "expectedFinalValue": 0.003,
          "expectedUnit": [
            "A",
            "amp",
            "amps",
            "ampere"
          ],
          "tolerance": 1e-7,
          "requireUnit": true,
          "marks": 3
        },
        "marks": 3,
        "equation_sheet": "from_insert"
      },
      {
        "id": "charge_qit_clean_05",
        "qtype": "calc_workings",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "charge_current",
        "syllabus_codes": [
          "6.2.1.2.b"
        ],
        "atoms": [
          "charge_flow_calc"
        ],
        "prompt": "There is a current of 1.5 A in a filament lamp for a time of 30 s. Calculate the charge flow in the filament lamp.\nUse the equation: charge flow = current × time",
        "explanation": "Q = It = 1.5 × 30 = 45 C.",
        "source": "authored",
        "calc": {
          "knowns": {
            "I": 1.5,
            "t": 30
          },
          "unknown": "Q",
          "equationCanonicalForms": [
            "Q=I*t"
          ],
          "expectedFinalValue": 45,
          "expectedUnit": [
            "C",
            "coulomb",
            "coulombs"
          ],
          "requireUnit": true,
          "marks": 2
        },
        "marks": 2,
        "equation_sheet": "from_insert"
      },
      {
        "id": "charge_qit_findI_06",
        "qtype": "calc_workings",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "charge_current",
        "syllabus_codes": [
          "6.2.1.2.b"
        ],
        "atoms": [
          "charge_flow_calc"
        ],
        "prompt": "A charge of 60 C flows through a lamp in 40 s. Calculate the current in the lamp.\nUse the equation: charge flow = current × time",
        "explanation": "Rearrange Q = It to I = Q / t = 60 / 40 = 1.5 A.",
        "source": "authored",
        "calc": {
          "knowns": {
            "Q": 60,
            "t": 40
          },
          "unknown": "I",
          "equationCanonicalForms": [
            "Q=I*t",
            "I=Q/t"
          ],
          "expectedFinalValue": 1.5,
          "expectedUnit": [
            "A",
            "amp",
            "amps",
            "ampere"
          ],
          "requireUnit": true,
          "marks": 3
        },
        "marks": 3,
        "equation_sheet": "from_insert"
      },
      {
        "id": "ohm_rearrange_mcq_07",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "resistance_ohm",
        "syllabus_codes": [
          "6.2.1.3.c"
        ],
        "atoms": [
          "ohm_law_calc"
        ],
        "prompt": "A component has a current of 0.50 A through it and a potential difference of 6.0 V across it. Which calculation gives its resistance?",
        "explanation": "R = V / I = 6.0 / 0.50 = 12 Ω.",
        "source": "authored",
        "choices": [
          {
            "text": "6.0 ÷ 0.50 = 12 Ω"
          },
          {
            "text": "0.50 ÷ 6.0 = 0.083 Ω",
            "misconception_id": "wrong_formula_rearrangement"
          },
          {
            "text": "6.0 × 0.50 = 3.0 Ω",
            "misconception_id": "wrong_formula_rearrangement"
          },
          {
            "text": "6.0 Ω (the pd value)",
            "misconception_id": "picked_given_value"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "wrong_formula_rearrangement",
          "picked_given_value"
        ]
      },
      {
        "id": "ohm_definition_mcq_08",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.2",
        "subtag": "resistance_ohm",
        "syllabus_codes": [
          "6.2.1.3.a"
        ],
        "atoms": [
          "resistance_definition"
        ],
        "prompt": "Which statement best describes the relationship R = V / I?",
        "explanation": "R = V / I is the definition of resistance and holds for any component. Ohm's law is the stronger claim that R stays constant as V changes, at constant temperature.",
        "source": "authored",
        "choices": [
          {
            "text": "It defines the resistance of a component, and holds for any component"
          },
          {
            "text": "It is Ohm's law, and only holds when the resistance is constant",
            "misconception_id": "confused_definition_with_law"
          },
          {
            "text": "It only holds for components in series",
            "misconception_id": "topology_indifferent_assumption"
          },
          {
            "text": "It shows that current is used up inside the component",
            "misconception_id": "current_consumed_at_components"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "confused_definition_with_law",
          "topology_indifferent_assumption",
          "current_consumed_at_components"
        ]
      },
      {
        "id": "current_rate_mcq_09",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "F",
        "topic": "6.2",
        "subtag": "charge_current",
        "syllabus_codes": [
          "6.2.1.2.a"
        ],
        "atoms": [
          "current_as_rate"
        ],
        "prompt": "What does an electric current of 2 A mean?",
        "explanation": "Current is the rate of flow of charge: 2 A means 2 coulombs of charge pass a point each second.",
        "source": "authored",
        "choices": [
          {
            "text": "2 coulombs of charge pass a point each second"
          },
          {
            "text": "2 coulombs of charge are stored in the wire",
            "misconception_id": "current_consumed_at_components"
          },
          {
            "text": "2 volts are pushed through the wire each second",
            "misconception_id": "confused_v_and_i"
          },
          {
            "text": "the wire has a resistance of 2 ohms",
            "misconception_id": "confused_v_and_i"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "current_consumed_at_components",
          "confused_v_and_i"
        ]
      },
      {
        "id": "charge_qit_multi_10",
        "qtype": "mcq_multi",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "charge_current",
        "syllabus_codes": [
          "6.2.1.2.b"
        ],
        "atoms": [
          "charge_flow_calc"
        ],
        "prompt": "A constant current flows through a lamp. Using charge flow = current × time, which statements are correct?",
        "explanation": "Charge is measured in coulombs; at constant current, doubling the time doubles the charge; a larger current moves more charge in the same time. Current is not 'used up'.",
        "source": "authored",
        "choices": [
          {
            "text": "Charge flow is measured in coulombs"
          },
          {
            "text": "Doubling the time doubles the charge that flows"
          },
          {
            "text": "A larger current moves more charge in the same time"
          },
          {
            "text": "Less charge leaves the lamp than enters it, because current is used up",
            "misconception_id": "current_consumed_at_components"
          }
        ],
        "answerIndices": [
          0,
          1,
          2
        ],
        "marks": 3,
        "applicable_misconceptions": [
          "current_consumed_at_components"
        ]
      },
      {
        "id": "iv_ohmic_drawshape_01",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "iv_characteristics",
        "syllabus_codes": [
          "6.2.1.4.b"
        ],
        "atoms": [
          "ohmic_sketch"
        ],
        "prompt": "A student must draw the I–V characteristic of a fixed resistor at constant temperature. Which graph should they draw?",
        "explanation": "A fixed resistor at constant temperature is ohmic: a straight line through the origin. A curve that flattens is the filament-lamp characteristic.",
        "source": "authored",
        "choices": [
          {
            "text": "A straight line through the origin"
          },
          {
            "text": "A curve that flattens out as the pd increases",
            "misconception_id": "drew_lamp_curve_for_ohmic"
          },
          {
            "text": "A line in one direction only",
            "misconception_id": "misread_iv_graph_for_ohmic"
          },
          {
            "text": "A horizontal straight line",
            "misconception_id": "misread_iv_graph_for_ohmic"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "drew_lamp_curve_for_ohmic",
          "misread_iv_graph_for_ohmic"
        ]
      },
      {
        "id": "iv_identify_filament_02",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "iv_characteristics",
        "syllabus_codes": [
          "6.2.1.4.e"
        ],
        "atoms": [
          "ohmic_recognise"
        ],
        "prompt": "The graph shows an I–V characteristic. Which component does it represent?",
        "diagram": {
          "kind": "iv_characteristic",
          "params": {
            "device": "filament"
          }
        },
        "explanation": "The current keeps rising but the gradient falls as the pd increases: resistance is increasing as the filament heats. That is a filament lamp, not an ohmic resistor.",
        "source": "authored",
        "choices": [
          {
            "text": "A filament lamp"
          },
          {
            "text": "A fixed resistor at constant temperature",
            "misconception_id": "misread_iv_graph_for_ohmic"
          },
          {
            "text": "A diode",
            "misconception_id": "misread_iv_graph_for_ohmic"
          },
          {
            "text": "A thermistor",
            "misconception_id": "ohmic_confused_with_variable_resistor"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "misread_iv_graph_for_ohmic",
          "ohmic_confused_with_variable_resistor"
        ]
      },
      {
        "id": "iv_ohmic_constantT_03",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "iv_characteristics",
        "syllabus_codes": [
          "6.2.1.4.b"
        ],
        "atoms": [
          "ohmic_recognise"
        ],
        "prompt": "Which quantity must stay the same so that a metal wire behaves as an ohmic conductor?",
        "explanation": "An ohmic conductor gives I ∝ V only at constant temperature. If the wire heats, its resistance changes and the line is no longer straight.",
        "source": "authored",
        "choices": [
          {
            "text": "Temperature of the wire"
          },
          {
            "text": "Air pressure",
            "misconception_id": "ohms_law_misread_temperature_role"
          },
          {
            "text": "Density of the metal",
            "misconception_id": "ohms_law_misread_temperature_role"
          },
          {
            "text": "Length of the wire",
            "misconception_id": "ohms_law_misread_temperature_role"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "ohms_law_misread_temperature_role"
        ]
      },
      {
        "id": "iv_ohmic_thirdquadrant_04",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.2",
        "subtag": "iv_characteristics",
        "syllabus_codes": [
          "6.2.1.4.b"
        ],
        "atoms": [
          "ohmic_sketch"
        ],
        "prompt": "The I–V characteristic of an ohmic resistor is a straight line through the origin. When the potential difference is made negative, the line should:",
        "explanation": "The relationship is symmetric: reversing the pd reverses the current by the same amount, so the straight line continues into the third quadrant. Drawing it only in the first quadrant loses the mark.",
        "source": "authored",
        "choices": [
          {
            "text": "Continue as a straight line into the third quadrant (negative V, negative I)"
          },
          {
            "text": "Stop at the origin",
            "misconception_id": "iv_line_one_quadrant_only"
          },
          {
            "text": "Become a horizontal line along the V-axis",
            "misconception_id": "iv_line_one_quadrant_only"
          },
          {
            "text": "Curve back towards the V-axis",
            "misconception_id": "misread_iv_graph_for_ohmic"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "iv_line_one_quadrant_only",
          "misread_iv_graph_for_ohmic"
        ]
      },
      {
        "id": "iv_diode_reverse_05",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "iv_characteristics",
        "syllabus_codes": [
          "6.2.1.4.e"
        ],
        "atoms": [
          "diode_behaviour"
        ],
        "prompt": "There is a current of 1.00 A in a diode. The student then reverses the connections to the diode. What is the new current in the diode?",
        "explanation": "A diode conducts in one direction only. Reversed, it blocks the current, so the new current is 0.00 A. It does not reverse or merely reduce.",
        "source": "authored",
        "choices": [
          {
            "text": "0.00 A"
          },
          {
            "text": "1.00 A in the opposite direction",
            "misconception_id": "diode_reverse_current_nonzero"
          },
          {
            "text": "1.00 A in the same direction",
            "misconception_id": "diode_reverse_current_nonzero"
          },
          {
            "text": "A smaller current, but not zero",
            "misconception_id": "diode_reverse_current_nonzero"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "diode_reverse_current_nonzero"
        ]
      },
      {
        "id": "iv_diode_explain_06",
        "qtype": "level_of_response_6",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "iv_characteristics",
        "syllabus_codes": [
          "6.2.1.4.e"
        ],
        "atoms": [
          "diode_behaviour"
        ],
        "prompt": "Explain what happens to the current in an LED when the potential difference across it is made negative.",
        "explanation": "A diode/LED conducts in one direction only. With the pd reversed it is reverse-biased, so the current is (almost) zero and the LED does not light.",
        "source": "authored",
        "lor": {
          "points": [
            {
              "text": "The current becomes (almost) zero",
              "creditworthy": true
            },
            {
              "text": "The LED is reverse-biased / only conducts one way",
              "creditworthy": true
            },
            {
              "text": "The current reverses direction but keeps the same size",
              "creditworthy": false,
              "misconception_id": "diode_reverse_current_nonzero"
            },
            {
              "text": "The current stays the same as before",
              "creditworthy": false,
              "misconception_id": "diode_reverse_current_nonzero"
            }
          ]
        },
        "marks": 2,
        "applicable_misconceptions": [
          "diode_reverse_current_nonzero"
        ]
      },
      {
        "id": "iv_diode_symbol_07",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "iv_characteristics",
        "syllabus_codes": [
          "6.2.1.1.a"
        ],
        "atoms": [
          "diode_behaviour"
        ],
        "prompt": "Which component allows current to flow in one direction only?",
        "explanation": "A diode allows current in one direction only. A resistor, thermistor and LDR all conduct in either direction.",
        "source": "authored",
        "choices": [
          {
            "text": "Diode"
          },
          {
            "text": "Fixed resistor",
            "misconception_id": "diode_vs_led"
          },
          {
            "text": "Thermistor",
            "misconception_id": "ohmic_confused_with_variable_resistor"
          },
          {
            "text": "LDR",
            "misconception_id": "ldr_vs_led"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "diode_vs_led",
          "ohmic_confused_with_variable_resistor",
          "ldr_vs_led"
        ]
      },
      {
        "id": "iv_filament_resistance_08",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "iv_characteristics",
        "syllabus_codes": [
          "6.2.1.4.e"
        ],
        "atoms": [
          "filament_behaviour"
        ],
        "prompt": "As the current in a filament lamp increases, the filament gets hotter. What happens to the resistance of the filament?",
        "explanation": "A hotter filament has a higher resistance, which is why its I–V line curves (gradient falls).",
        "source": "authored",
        "choices": [
          {
            "text": "It increases"
          },
          {
            "text": "It decreases",
            "misconception_id": "filament_resistance_falls"
          },
          {
            "text": "It stays the same",
            "misconception_id": "ohmic_confused_with_metal"
          },
          {
            "text": "It drops to zero",
            "misconception_id": "filament_resistance_falls"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "filament_resistance_falls",
          "ohmic_confused_with_metal"
        ]
      },
      {
        "id": "iv_thermistor_direction_09",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "iv_characteristics",
        "syllabus_codes": [
          "6.2.1.4.f"
        ],
        "atoms": [
          "thermistor_behaviour"
        ],
        "prompt": "The temperature of a thermistor increases. What happens to its resistance?",
        "diagram": {
          "kind": "resistance_temperature",
          "params": {
            "device": "thermistor"
          }
        },
        "explanation": "For an NTC thermistor, resistance decreases as temperature increases (the curve falls).",
        "source": "authored",
        "choices": [
          {
            "text": "It decreases"
          },
          {
            "text": "It increases",
            "misconception_id": "sensor_direction_reversed"
          },
          {
            "text": "It stays the same",
            "misconception_id": "ohmic_confused_with_variable_resistor"
          },
          {
            "text": "It first rises then falls",
            "misconception_id": "sensor_direction_reversed"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "sensor_direction_reversed",
          "ohmic_confused_with_variable_resistor"
        ]
      },
      {
        "id": "iv_ldr_direction_10",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "iv_characteristics",
        "syllabus_codes": [
          "6.2.1.4.f"
        ],
        "atoms": [
          "ldr_behaviour"
        ],
        "prompt": "The light shining on an LDR gets brighter. What happens to the resistance of the LDR?",
        "diagram": {
          "kind": "resistance_light",
          "params": {}
        },
        "explanation": "For an LDR, brighter light means lower resistance (the curve falls as light intensity rises).",
        "source": "authored",
        "choices": [
          {
            "text": "It decreases"
          },
          {
            "text": "It increases",
            "misconception_id": "sensor_direction_reversed"
          },
          {
            "text": "It stays the same",
            "misconception_id": "ohmic_confused_with_variable_resistor"
          },
          {
            "text": "It drops to zero",
            "misconception_id": "sensor_direction_reversed"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "sensor_direction_reversed",
          "ohmic_confused_with_variable_resistor"
        ]
      },
      {
        "id": "iv_rp_wirelength_11",
        "qtype": "level_of_response_6",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "iv_characteristics",
        "syllabus_codes": [
          "6.2.1.3.d.iiA"
        ],
        "atoms": [
          "rp_wire_length"
        ],
        "prompt": "A student's results suggest the resistance of a wire is directly proportional to its length. How can the graph of resistance against length confirm this?",
        "explanation": "Direct proportion needs both a straight line AND a line that passes through the origin. 'Resistance increases as length increases' only shows a positive correlation, not proportionality.",
        "source": "authored",
        "lor": {
          "points": [
            {
              "text": "The points lie on a straight line",
              "creditworthy": true
            },
            {
              "text": "The straight line passes through the origin",
              "creditworthy": true
            },
            {
              "text": "Showing that resistance increases as length increases is enough on its own",
              "creditworthy": false,
              "misconception_id": "proportionality_stated_as_increases"
            },
            {
              "text": "The line is the best fit drawn with a ruler, not freehand",
              "creditworthy": true
            }
          ]
        },
        "marks": 3,
        "applicable_misconceptions": [
          "proportionality_stated_as_increases"
        ]
      },
      {
        "id": "iv_rp_repeatable_12",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "iv_characteristics",
        "syllabus_codes": [
          "6.2.1.4.d"
        ],
        "atoms": [
          "rp_resistance_method"
        ],
        "prompt": "A student measures the current three times under the same conditions and gets the same value each time. This shows the results are:",
        "explanation": "Repeating the same method and getting the same values shows repeatability. Reproducibility is when a different person or method gets the same result.",
        "source": "authored",
        "choices": [
          {
            "text": "Repeatable"
          },
          {
            "text": "Reproducible",
            "misconception_id": "repeatability_reproducibility_confused"
          },
          {
            "text": "Accurate",
            "misconception_id": "repeatability_reproducibility_confused"
          },
          {
            "text": "Valid",
            "misconception_id": "repeatability_reproducibility_confused"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "repeatability_reproducibility_confused"
        ]
      },
      {
        "id": "sp_series_current_same_01",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "series_parallel",
        "syllabus_codes": [
          "6.2.2.c"
        ],
        "atoms": [
          "series_current_same"
        ],
        "prompt": "Two resistors of unequal resistance are connected in series with a battery and a closed switch. How does the current through the smaller resistor compare with the current through the larger resistor?",
        "diagram": {
          "kind": "circuit",
          "params": {
            "dsl": "2cb,sc,r,r"
          }
        },
        "explanation": "There is one path, so the current is the same through every component in a series loop, whatever the resistor values.",
        "source": "ported_from_ecm",
        "choices": [
          {
            "text": "They are equal: the same current flows through every component in a series loop"
          },
          {
            "text": "The smaller resistor carries the larger current, because current prefers the easier path",
            "misconception_id": "current_splits_when_not_branching"
          },
          {
            "text": "The larger resistor carries the larger current, because more resistance attracts more current",
            "misconception_id": "current_consumed_at_components"
          },
          {
            "text": "The first resistor reduces the current, so the second carries less",
            "misconception_id": "current_consumed_at_components"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "current_splits_when_not_branching",
          "current_consumed_at_components"
        ]
      },
      {
        "id": "sp_series_pd_larger_R_02",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.2",
        "subtag": "series_parallel",
        "syllabus_codes": [
          "6.2.2.c"
        ],
        "atoms": [
          "series_voltage_sum"
        ],
        "prompt": "Two unequal resistors are connected in series with a battery and a closed switch. Without doing any calculation, which resistor has the larger potential difference across it?",
        "diagram": {
          "kind": "circuit",
          "params": {
            "dsl": "2cb,sc,r,r"
          }
        },
        "explanation": "In series the current is the same, so by V = IR the larger resistance has the larger pd across it.",
        "source": "ported_from_ecm",
        "choices": [
          {
            "text": "The larger resistor"
          },
          {
            "text": "The smaller resistor",
            "misconception_id": "confused_v_and_i"
          },
          {
            "text": "Both have the same pd, because they are in series",
            "misconception_id": "voltage_same_in_series"
          },
          {
            "text": "It cannot be told without the supply pd or the resistor values",
            "misconception_id": "qualitative_inference_doubted"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "confused_v_and_i",
          "voltage_same_in_series",
          "qualitative_inference_doubted"
        ]
      },
      {
        "id": "sp_series_pd_sum_two_03",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "series_parallel",
        "syllabus_codes": [
          "6.2.2.c"
        ],
        "atoms": [
          "series_voltage_sum"
        ],
        "prompt": "Two resistors are in series with a battery. The supply pd is V_S. The pd across one resistor is 2V_S/3. What is the pd across the other resistor?",
        "diagram": {
          "kind": "circuit",
          "params": {
            "dsl": "2cb,sc,r,r"
          }
        },
        "explanation": "The component pds in series add up to the supply pd, so the other pd is V_S - 2V_S/3 = V_S/3.",
        "source": "ported_from_ecm",
        "choices": [
          {
            "text": "V_S/3"
          },
          {
            "text": "2V_S/3, the same as the first",
            "misconception_id": "voltage_same_in_series"
          },
          {
            "text": "V_S, the full supply",
            "misconception_id": "voltage_same_in_series"
          },
          {
            "text": "It cannot be told without the resistor values",
            "misconception_id": "qualitative_inference_doubted"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "voltage_same_in_series",
          "qualitative_inference_doubted"
        ]
      },
      {
        "id": "sp_series_pd_sum_three_04",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.2",
        "subtag": "series_parallel",
        "syllabus_codes": [
          "6.2.2.c"
        ],
        "atoms": [
          "series_voltage_sum"
        ],
        "prompt": "Three resistors R1, R2 and R3 are in series with a battery. The pd across R1 is one third of the supply pd, and the pd across R2 is one half of the supply pd. What is the pd across R3?",
        "diagram": {
          "kind": "circuit",
          "params": {
            "dsl": "2cb,sc,r.1,r.2,r.3"
          }
        },
        "explanation": "The three pds add to the supply: 1 - 1/3 - 1/2 = 1/6 of the supply pd.",
        "source": "ported_from_ecm",
        "choices": [
          {
            "text": "One sixth of the supply pd"
          },
          {
            "text": "Five sixths of the supply pd"
          },
          {
            "text": "Two thirds of the supply pd"
          },
          {
            "text": "The full supply pd, because the three components share it equally",
            "misconception_id": "voltage_same_in_series"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "voltage_same_in_series"
        ]
      },
      {
        "id": "sp_series_unscrew_bulb_05",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "series_parallel",
        "syllabus_codes": [
          "6.2.2.c"
        ],
        "atoms": [
          "series_current_same"
        ],
        "prompt": "Two identical bulbs are connected in series with a battery and a closed switch. One bulb is unscrewed, leaving an open break where it was. What happens to the other bulb?",
        "diagram": {
          "kind": "circuit",
          "params": {
            "dsl": "2cb,sc,bb,bb"
          }
        },
        "explanation": "A series loop has one path. Breaking it anywhere stops the current everywhere, so the other bulb also goes out.",
        "source": "ported_from_ecm",
        "choices": [
          {
            "text": "It also goes out"
          },
          {
            "text": "It stays at the same brightness",
            "misconception_id": "current_consumed_at_components"
          },
          {
            "text": "It becomes brighter, because the loop's total resistance is now lower",
            "misconception_id": "bulb_brightness_from_resistance_only"
          },
          {
            "text": "It becomes dimmer but stays lit",
            "misconception_id": "current_consumed_at_components"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "current_consumed_at_components",
          "bulb_brightness_from_resistance_only"
        ]
      },
      {
        "id": "sp_open_switch_series_06",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "series_parallel",
        "syllabus_codes": [
          "6.2.2.c"
        ],
        "atoms": [
          "series_current_same"
        ],
        "prompt": "In the circuit shown the switch S is open. The loop also contains a battery and a single bulb L1. What is the state of L1?",
        "diagram": {
          "kind": "circuit",
          "params": {
            "dsl": "2cb,s,bb.1"
          }
        },
        "explanation": "An open switch breaks the single loop, so no current flows and the bulb is off.",
        "source": "ported_from_ecm",
        "choices": [
          {
            "text": "L1 is off: no current flows because the loop is broken at the switch"
          },
          {
            "text": "L1 is dimly lit, because some current still flows across the open switch",
            "misconception_id": "switch_state_inverted"
          },
          {
            "text": "L1 is at full brightness, because the open switch does not affect the bulb directly",
            "misconception_id": "switch_state_inverted"
          },
          {
            "text": "The bulb is damaged because the open switch creates a voltage spike"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "switch_state_inverted"
        ]
      },
      {
        "id": "sp_parallel_pd_same_07",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "series_parallel",
        "syllabus_codes": [
          "6.2.2.d"
        ],
        "atoms": [
          "parallel_voltage_same"
        ],
        "prompt": "Three components R1, R2 and L1 are connected as parallel branches across a battery, with a closed switch in the main line. What is true about the potential difference across them?",
        "diagram": {
          "kind": "circuit",
          "params": {
            "dsl": "2cb,sc,(r10.1;r10.2;bb.1)"
          }
        },
        "explanation": "Branches in parallel share the same two nodes, so each has the same pd across it, equal to the supply pd.",
        "source": "ported_from_ecm",
        "choices": [
          {
            "text": "All three have the same pd, equal to the supply pd"
          },
          {
            "text": "Each has a different pd, because they have different resistances",
            "misconception_id": "equal_share_assumption"
          },
          {
            "text": "The component with the smallest resistance has the largest pd",
            "misconception_id": "confused_v_and_i"
          },
          {
            "text": "The bulb has a different pd because it is not a resistor",
            "misconception_id": "equal_share_assumption"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "equal_share_assumption",
          "confused_v_and_i"
        ]
      },
      {
        "id": "sp_parallel_current_sum_08",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "series_parallel",
        "syllabus_codes": [
          "6.2.2.d"
        ],
        "atoms": [
          "parallel_current_sum"
        ],
        "prompt": "A battery drives two parallel branches. Ammeter A1 is in the main line; A2 and A3 are in the two branches. Which equation is correct?",
        "diagram": {
          "kind": "circuit",
          "params": {
            "dsl": "2cb,sc,a.1,(r10,a.2;r10,a.3)"
          }
        },
        "explanation": "The current from the battery splits between the branches and recombines, so A1 = A2 + A3.",
        "source": "ported_from_ecm",
        "choices": [
          {
            "text": "A1 = A2 + A3"
          },
          {
            "text": "A1 = A2 = A3, because the current is the same through every ammeter",
            "misconception_id": "current_consumed_at_components"
          },
          {
            "text": "A2 + A3 is larger than A1, because each branch generates its own current",
            "misconception_id": "current_consumed_at_components"
          },
          {
            "text": "A1 = A2 × A3"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "current_consumed_at_components"
        ]
      },
      {
        "id": "sp_parallel_share_equal_09",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "series_parallel",
        "syllabus_codes": [
          "6.2.2.d"
        ],
        "atoms": [
          "parallel_current_sum"
        ],
        "prompt": "Three identical resistors are connected as three parallel branches across a battery. How does the cell's total current divide between the branches?",
        "diagram": {
          "kind": "circuit",
          "params": {
            "dsl": "2cb,sc,(r;r;r)"
          }
        },
        "explanation": "Identical branches carry equal current, so each carries one third of the cell current.",
        "source": "ported_from_ecm",
        "choices": [
          {
            "text": "It divides equally; each branch carries one third of the cell current"
          },
          {
            "text": "All the current flows through the first branch; the others carry none"
          },
          {
            "text": "The current is the same in each branch and equal to the cell current",
            "misconception_id": "current_consumed_at_components"
          },
          {
            "text": "It divides equally only when the cell pd is above a threshold",
            "misconception_id": "qualitative_inference_doubted"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "current_consumed_at_components",
          "qualitative_inference_doubted"
        ]
      },
      {
        "id": "sp_parallel_add_bulb_10",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.2",
        "subtag": "series_parallel",
        "syllabus_codes": [
          "6.2.2.d"
        ],
        "atoms": [
          "parallel_voltage_same"
        ],
        "prompt": "A bulb L1 is connected to a battery via a closed switch. An identical bulb L2 is then added in parallel with L1 (same two nodes). What happens to the brightness of L1?",
        "diagram": {
          "kind": "circuit",
          "params": {
            "dsl": "left,2cb,sc,(bb.1;bb.2)"
          }
        },
        "explanation": "Each parallel branch still has the full supply pd across it, so L1 keeps the same current and stays the same brightness.",
        "source": "ported_from_ecm",
        "choices": [
          {
            "text": "It stays the same"
          },
          {
            "text": "L1 dims, because the current it used to get now shares with L2",
            "misconception_id": "equal_share_assumption"
          },
          {
            "text": "L1 gets brighter, because the total resistance is lower so more current flows",
            "misconception_id": "bulb_brightness_from_resistance_only"
          },
          {
            "text": "L1 goes out, because L2 short-circuits it",
            "misconception_id": "treated_bypass_as_active"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "equal_share_assumption",
          "bulb_brightness_from_resistance_only",
          "treated_bypass_as_active"
        ]
      },
      {
        "id": "sp_identify_series_11",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "series_parallel",
        "syllabus_codes": [
          "6.2.2.a"
        ],
        "atoms": [
          "identify_topology"
        ],
        "prompt": "Three components R1, L1 and VR1 are connected in a single loop with a battery and a closed switch. How are they arranged with respect to one another?",
        "diagram": {
          "kind": "circuit",
          "params": {
            "dsl": "left,2cb,sc,r10.1,bb.1,vr.1"
          }
        },
        "explanation": "A single loop with no branches is a series arrangement: the same current flows through each component.",
        "source": "ported_from_ecm",
        "choices": [
          {
            "text": "All three are in series: the same current flows through each"
          },
          {
            "text": "All three are in parallel with one another",
            "misconception_id": "disguised_parallel_missed"
          },
          {
            "text": "R1 is in series with L1, but VR1 is in parallel with R1",
            "misconception_id": "disguised_parallel_missed"
          },
          {
            "text": "Only L1 and VR1 are in series; R1 sits on its own"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "disguised_parallel_missed"
        ]
      },
      {
        "id": "sp_identify_parallel_12",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "series_parallel",
        "syllabus_codes": [
          "6.2.2.a"
        ],
        "atoms": [
          "identify_topology"
        ],
        "prompt": "Three components R1, L1 and VR1 are connected as branches between the same pair of nodes, with a battery and a closed switch in the main line. How are they arranged?",
        "diagram": {
          "kind": "circuit",
          "params": {
            "dsl": "2cb,sc,(r10.1;bb.1;vr.1)"
          }
        },
        "explanation": "Components between the same two nodes are in parallel: each has the same pd across it.",
        "source": "ported_from_ecm",
        "choices": [
          {
            "text": "All three are in parallel: each has the same pd across it"
          },
          {
            "text": "All three are in series: the same current flows through each",
            "misconception_id": "disguised_parallel_missed"
          },
          {
            "text": "R1 and L1 are in parallel; VR1 is in series with them",
            "misconception_id": "disguised_parallel_missed"
          },
          {
            "text": "It is a mixed network whose details depend on the values",
            "misconception_id": "topology_indifferent_assumption"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "disguised_parallel_missed",
          "topology_indifferent_assumption"
        ]
      },
      {
        "id": "sp_voltmeter_placement_13",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "series_parallel",
        "syllabus_codes": [
          "6.2.1.1.a"
        ],
        "atoms": [
          "choose_right_V"
        ],
        "prompt": "Two identical bulbs L1 and L2 are in series with a battery, switch and ammeter. Where should a voltmeter be connected to measure the potential difference across L1 only?",
        "diagram": {
          "kind": "circuit",
          "params": {
            "dsl": "2cb,sc,bb.1,bb.2,a.1"
          }
        },
        "explanation": "A voltmeter measures pd across a component, so it goes in parallel with L1, its two leads on the two terminals of L1.",
        "source": "ported_from_ecm",
        "choices": [
          {
            "text": "In parallel with bulb L1 only, leads on the two terminals of L1"
          },
          {
            "text": "In series with L1, placed between L1 and L2 in the loop",
            "misconception_id": "voltmeter_in_series"
          },
          {
            "text": "In parallel across both bulbs at once",
            "misconception_id": "voltage_same_in_series"
          },
          {
            "text": "In place of the ammeter A1, after removing A1",
            "misconception_id": "meter_kinds_interchangeable"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "voltmeter_in_series",
          "voltage_same_in_series",
          "meter_kinds_interchangeable"
        ]
      },
      {
        "id": "sp_cells_in_series_14",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "F",
        "topic": "6.2",
        "subtag": "series_parallel",
        "syllabus_codes": [
          "6.2.2.b"
        ],
        "atoms": [
          "cells_in_series_voltage"
        ],
        "prompt": "A student connects identical 1.5 V cells in series to make a 6.0 V battery. How many cells are used?",
        "explanation": "Cell pds in series add: 6.0 / 1.5 = 4 cells.",
        "source": "authored",
        "choices": [
          {
            "text": "4 cells"
          },
          {
            "text": "3 cells"
          },
          {
            "text": "2 cells"
          },
          {
            "text": "6 cells",
            "misconception_id": "picked_given_value"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "picked_given_value"
        ]
      },
      {
        "id": "sp_series_R_sum_15",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "series_parallel",
        "syllabus_codes": [
          "6.2.2.c"
        ],
        "atoms": [
          "series_resistance_sum"
        ],
        "prompt": "A 4 Ω resistor and a 6 Ω resistor are connected in series. What is their combined resistance?",
        "diagram": {
          "kind": "circuit",
          "params": {
            "dsl": "2cb,sc,r.1,r.2"
          }
        },
        "explanation": "Resistances in series add: 4 + 6 = 10 Ω.",
        "source": "authored",
        "choices": [
          {
            "text": "10 Ω"
          },
          {
            "text": "2.4 Ω",
            "misconception_id": "swapped_series_parallel"
          },
          {
            "text": "24 Ω",
            "misconception_id": "wrong_formula_rearrangement"
          },
          {
            "text": "5 Ω"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "swapped_series_parallel",
          "wrong_formula_rearrangement"
        ]
      },
      {
        "id": "sp_parallel_R_qualitative_16",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.2",
        "subtag": "series_parallel",
        "syllabus_codes": [
          "6.2.2.d"
        ],
        "atoms": [
          "parallel_resistance_qualitative"
        ],
        "prompt": "A 4 Ω resistor and a 6 Ω resistor are connected in parallel. Without calculating, what can you say about their combined resistance?",
        "explanation": "Adding a parallel path gives the current more routes, so the combined resistance is less than either resistor on its own, i.e. less than 4 Ω.",
        "source": "authored",
        "choices": [
          {
            "text": "It is less than 4 Ω (less than the smaller resistor)"
          },
          {
            "text": "It is between 4 Ω and 6 Ω",
            "misconception_id": "equal_share_assumption"
          },
          {
            "text": "It is 10 Ω (the two added together)",
            "misconception_id": "swapped_series_parallel"
          },
          {
            "text": "It is exactly 5 Ω (their average)",
            "misconception_id": "swapped_series_parallel"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "equal_share_assumption",
          "swapped_series_parallel"
        ]
      },
      {
        "id": "pw_vi_find_P_01",
        "qtype": "calc_workings",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "power_electrical",
        "syllabus_codes": [
          "6.2.4.1"
        ],
        "atoms": [
          "power_vi_calc"
        ],
        "prompt": "An electric kettle is connected to the 230 V mains supply. The current in the heating element is 9.0 A. Calculate the power of the heating element.\nUse the equation: power = potential difference × current",
        "explanation": "P = VI = 230 × 9.0 = 2070 W.",
        "source": "ported_from_ecm",
        "calc": {
          "knowns": {
            "V": 230,
            "I": 9
          },
          "unknown": "P",
          "equationCanonicalForms": [
            "P=V*I"
          ],
          "expectedFinalValue": 2070,
          "expectedUnit": [
            "W",
            "watt",
            "watts"
          ],
          "requireUnit": true,
          "marks": 3
        },
        "marks": 3,
        "equation_sheet": "from_insert"
      },
      {
        "id": "pw_vi_find_I_02",
        "qtype": "calc_workings",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.2",
        "subtag": "power_electrical",
        "syllabus_codes": [
          "6.2.6.1.a"
        ],
        "atoms": [
          "power_vi_calc"
        ],
        "prompt": "The power of the heating element in a kettle is 2100 W. The potential difference across it is 230 V. Calculate the current in the heating element.\nUse the equation: power = potential difference × current",
        "explanation": "Rearrange P = VI to I = P / V = 2100 / 230 = 9.13 A, which rounds to 9.1 A.",
        "source": "authored",
        "calc": {
          "knowns": {
            "P": 2100,
            "V": 230
          },
          "unknown": "I",
          "equationCanonicalForms": [
            "P=V*I",
            "I=P/V"
          ],
          "expectedFinalValue": 9.13,
          "tolerance": 0.05,
          "expectedUnit": [
            "A",
            "amp",
            "amps",
            "ampere"
          ],
          "requireUnit": true,
          "marks": 4
        },
        "marks": 4,
        "equation_sheet": "from_insert"
      },
      {
        "id": "en_pt_find_E_03",
        "qtype": "calc_workings",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "energy_appliances",
        "syllabus_codes": [
          "6.2.6.2.e"
        ],
        "atoms": [
          "energy_pt_calc"
        ],
        "prompt": "A wind turbine generates 200 000 W of electrical power for a time of 300 s. Calculate the energy transferred.\nUse the equation: energy transferred = power × time",
        "explanation": "E = Pt = 200 000 × 300 = 60 000 000 J (6.0 × 10⁷ J).",
        "source": "authored",
        "calc": {
          "knowns": {
            "P": 200000,
            "t": 300
          },
          "unknown": "E",
          "equationCanonicalForms": [
            "E=P*t"
          ],
          "expectedFinalValue": 60000000,
          "expectedUnit": [
            "J",
            "joule",
            "joules"
          ],
          "requireUnit": true,
          "marks": 2
        },
        "marks": 2,
        "equation_sheet": "from_insert"
      },
      {
        "id": "en_pt_find_P_04",
        "qtype": "calc_workings",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "energy_appliances",
        "syllabus_codes": [
          "6.2.6.2.e"
        ],
        "atoms": [
          "energy_pt_calc"
        ],
        "prompt": "A hairdryer transfers 460 000 J of energy in 250 s. Calculate the power of the hairdryer.\nUse the equation: power = energy transferred / time",
        "explanation": "P = E / t = 460 000 / 250 = 1840 W.",
        "source": "authored",
        "calc": {
          "knowns": {
            "E": 460000,
            "t": 250
          },
          "unknown": "P",
          "equationCanonicalForms": [
            "P=E/t",
            "E=P*t"
          ],
          "expectedFinalValue": 1840,
          "expectedUnit": [
            "W",
            "watt",
            "watts"
          ],
          "requireUnit": true,
          "marks": 2
        },
        "marks": 2,
        "equation_sheet": "from_insert"
      },
      {
        "id": "en_qv_find_E_05",
        "qtype": "calc_workings",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "energy_appliances",
        "syllabus_codes": [
          "6.2.4.2"
        ],
        "atoms": [
          "energy_qv_calc"
        ],
        "prompt": "A 12 V battery moves 50 C of charge through a circuit. Calculate the energy transferred to the charge.\nUse the equation: energy transferred = charge × potential difference",
        "explanation": "E = QV = 50 × 12 = 600 J.",
        "source": "authored",
        "calc": {
          "knowns": {
            "Q": 50,
            "V": 12
          },
          "unknown": "E",
          "equationCanonicalForms": [
            "E=Q*V"
          ],
          "expectedFinalValue": 600,
          "expectedUnit": [
            "J",
            "joule",
            "joules"
          ],
          "requireUnit": true,
          "marks": 2
        },
        "marks": 2,
        "equation_sheet": "from_insert"
      },
      {
        "id": "en_qv_find_V_stdform_06",
        "qtype": "calc_workings",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.2",
        "subtag": "energy_appliances",
        "syllabus_codes": [
          "6.2.4.2"
        ],
        "atoms": [
          "energy_qv_calc"
        ],
        "prompt": "When an electron crosses the terminals of a cell it gains 4.8 × 10⁻¹⁹ J of energy. The electron carries a charge of 1.6 × 10⁻¹⁹ C. Calculate the potential difference across the cell.\nUse the equation: energy transferred = charge × potential difference",
        "explanation": "Rearrange E = QV to V = E / Q = (4.8 × 10⁻¹⁹) / (1.6 × 10⁻¹⁹) = 3.0 V. The powers of ten cancel.",
        "source": "ported_from_ecm",
        "calc": {
          "knowns": {
            "E": 4.8e-19,
            "Q": 1.6e-19
          },
          "unknown": "V",
          "equationCanonicalForms": [
            "E=Q*V",
            "V=E/Q"
          ],
          "expectedFinalValue": 3,
          "tolerance": 0.01,
          "expectedUnit": [
            "V",
            "volt",
            "volts"
          ],
          "requireUnit": true,
          "marks": 3
        },
        "marks": 3,
        "equation_sheet": "from_insert"
      },
      {
        "id": "pw_vi_mcq_07",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "power_electrical",
        "syllabus_codes": [
          "6.2.4.1"
        ],
        "atoms": [
          "power_vi_calc"
        ],
        "prompt": "An electric kettle is connected to the 230 V mains. The current in the heating element is 9.0 A. What is the power of the heating element?",
        "explanation": "P = VI = 230 × 9.0 = 2070 W.",
        "source": "ported_from_ecm",
        "choices": [
          {
            "text": "2070 W"
          },
          {
            "text": "25.6 W",
            "misconception_id": "wrong_formula_rearrangement"
          },
          {
            "text": "0.039 W",
            "misconception_id": "wrong_formula_rearrangement"
          },
          {
            "text": "52 900 W",
            "misconception_id": "treated_I_as_V"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "wrong_formula_rearrangement",
          "treated_I_as_V"
        ]
      },
      {
        "id": "pw_vi_find_I_mcq_08",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "power_electrical",
        "syllabus_codes": [
          "6.2.4.1"
        ],
        "atoms": [
          "power_vi_calc"
        ],
        "prompt": "A 230 V supply delivers 1840 W of power to a heater. What is the current in the heater?",
        "explanation": "Rearrange P = VI to I = P / V = 1840 / 230 = 8.0 A.",
        "source": "ported_from_ecm",
        "choices": [
          {
            "text": "8.0 A"
          },
          {
            "text": "423 200 A",
            "misconception_id": "wrong_formula_rearrangement"
          },
          {
            "text": "0.125 A",
            "misconception_id": "wrong_formula_rearrangement"
          },
          {
            "text": "1840 A",
            "misconception_id": "picked_given_value"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "wrong_formula_rearrangement",
          "picked_given_value"
        ]
      },
      {
        "id": "pw_i2r_prefix_mcq_09",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.2",
        "subtag": "power_electrical",
        "syllabus_codes": [
          "6.2.6.1.a"
        ],
        "atoms": [
          "power_i2r_calc"
        ],
        "prompt": "The current in a whisk is 500 mA. The resistance of the whisk is 640 Ω. Calculate the power of the whisk.\nUse the equation: power = (current)² × resistance",
        "interim_for": "calc_workings (blocked by calc-grader gaps: ^ operator + prefix conversion)",
        "explanation": "Convert 500 mA to 0.50 A, then P = I²R = 0.50² × 640 = 160 W.",
        "source": "authored",
        "choices": [
          {
            "text": "160 W"
          },
          {
            "text": "320 W",
            "misconception_id": "forgot_to_square_in_power"
          },
          {
            "text": "160 000 000 W",
            "misconception_id": "prefix_not_converted"
          },
          {
            "text": "204 800 W",
            "misconception_id": "swapped_factor_in_squared"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "forgot_to_square_in_power",
          "prefix_not_converted",
          "swapped_factor_in_squared"
        ]
      },
      {
        "id": "pw_i2r_series_qual_mcq_10",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.2",
        "subtag": "power_electrical",
        "syllabus_codes": [
          "6.2.6.1.a"
        ],
        "atoms": [
          "power_i2r_calc"
        ],
        "prompt": "A 2 Ω resistor and a 6 Ω resistor are connected in series across a battery. Which resistor dissipates more power?",
        "explanation": "In series the current is the same through both, so by P = I²R the larger resistance dissipates more power: the 6 Ω resistor.",
        "source": "ported_from_ecm",
        "choices": [
          {
            "text": "The 6 Ω resistor"
          },
          {
            "text": "The 2 Ω resistor"
          },
          {
            "text": "Both dissipate equal power",
            "misconception_id": "topology_indifferent_assumption"
          },
          {
            "text": "It cannot be determined without the battery voltage",
            "misconception_id": "qualitative_inference_doubted"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "topology_indifferent_assumption",
          "qualitative_inference_doubted"
        ]
      },
      {
        "id": "pw_rating_interpret_mcq_11",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "power_electrical",
        "syllabus_codes": [
          "6.2.6.1.a"
        ],
        "atoms": [
          "power_rating_interpret"
        ],
        "prompt": "An appliance has a power rating of 2000 W. What does this tell you?",
        "explanation": "Power is energy per second, so a 2000 W appliance transfers 2000 J of energy each second.",
        "source": "authored",
        "choices": [
          {
            "text": "It transfers 2000 J of energy each second"
          },
          {
            "text": "It transfers 2000 J of energy in total",
            "misconception_id": "appliance_energy_confused_power_energy"
          },
          {
            "text": "It stores 2000 J of energy",
            "misconception_id": "appliance_energy_confused_power_energy"
          },
          {
            "text": "It transfers 2000 J of energy each hour",
            "misconception_id": "appliance_energy_confused_power_energy"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "appliance_energy_confused_power_energy"
        ]
      },
      {
        "id": "en_appliance_compare_mcq_12",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "energy_appliances",
        "syllabus_codes": [
          "6.2.6.2.e"
        ],
        "atoms": [
          "appliance_energy_reasoning"
        ],
        "prompt": "Appliance A has a power of 1000 W and runs for 60 s. Appliance B has a power of 2000 W and runs for 20 s. Which appliance transfers more energy?",
        "explanation": "E = Pt. A: 1000 × 60 = 60 000 J. B: 2000 × 20 = 40 000 J. Appliance A transfers more.",
        "source": "authored",
        "choices": [
          {
            "text": "Appliance A (60 000 J vs 40 000 J)"
          },
          {
            "text": "Appliance B, because it has the higher power",
            "misconception_id": "appliance_energy_confused_power_energy"
          },
          {
            "text": "They transfer the same energy",
            "misconception_id": "appliance_energy_confused_power_energy"
          },
          {
            "text": "It cannot be told without the voltage",
            "misconception_id": "qualitative_inference_doubted"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "appliance_energy_confused_power_energy",
          "qualitative_inference_doubted"
        ]
      },
      {
        "id": "cb_thermistor_id_01",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "circuit_basics",
        "syllabus_codes": [
          "6.2.1.4.f"
        ],
        "atoms": [
          "recall_symbol"
        ],
        "prompt": "Which component has a resistance that decreases as its temperature increases?",
        "explanation": "A thermistor's resistance falls as it gets hotter. An LDR responds to light, not temperature.",
        "source": "authored",
        "choices": [
          {
            "text": "Thermistor"
          },
          {
            "text": "LDR (light-dependent resistor)",
            "misconception_id": "sensor_stimulus_confused"
          },
          {
            "text": "Fixed resistor"
          },
          {
            "text": "Fuse"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "sensor_stimulus_confused"
        ]
      },
      {
        "id": "cb_ldr_id_02",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "circuit_basics",
        "syllabus_codes": [
          "6.2.1.4.f"
        ],
        "atoms": [
          "recall_symbol"
        ],
        "prompt": "Which component has a resistance that decreases as the light shining on it gets brighter?",
        "explanation": "An LDR's resistance falls as light intensity rises. A thermistor responds to temperature, not light.",
        "source": "authored",
        "choices": [
          {
            "text": "LDR (light-dependent resistor)"
          },
          {
            "text": "Thermistor",
            "misconception_id": "sensor_stimulus_confused"
          },
          {
            "text": "Diode"
          },
          {
            "text": "Variable resistor"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "sensor_stimulus_confused"
        ]
      },
      {
        "id": "cb_variable_resistor_03",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "circuit_basics",
        "syllabus_codes": [
          "6.2.1.1.a"
        ],
        "atoms": [
          "recall_symbol"
        ],
        "prompt": "Which component is used to change the current in a circuit by changing its own resistance?",
        "explanation": "A variable resistor (rheostat) has an adjustable resistance, used to vary the current.",
        "source": "authored",
        "choices": [
          {
            "text": "Variable resistor"
          },
          {
            "text": "Fixed resistor"
          },
          {
            "text": "Fuse"
          },
          {
            "text": "Diode"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": []
      },
      {
        "id": "cb_cell_vs_battery_04",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "F",
        "topic": "6.2",
        "subtag": "circuit_basics",
        "syllabus_codes": [
          "6.2.1.1.a"
        ],
        "atoms": [
          "recall_symbol"
        ],
        "prompt": "What is the difference between a cell and a battery?",
        "explanation": "A battery is two or more cells connected together. A single cell is one unit.",
        "source": "authored",
        "choices": [
          {
            "text": "A battery is two or more cells connected together"
          },
          {
            "text": "A cell is two or more batteries connected together",
            "misconception_id": "cell_battery_confusion"
          },
          {
            "text": "They are two names for exactly the same thing",
            "misconception_id": "cell_battery_confusion"
          },
          {
            "text": "A battery is a single unit; a cell is several joined",
            "misconception_id": "cell_battery_confusion"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "cell_battery_confusion"
        ]
      },
      {
        "id": "cb_ammeter_placement_05",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "circuit_basics",
        "syllabus_codes": [
          "6.2.1.1.a"
        ],
        "atoms": [
          "meter_placement"
        ],
        "prompt": "How should an ammeter be connected to measure the current through a lamp?",
        "explanation": "An ammeter measures the current through a component, so it goes in series with the lamp, in the same loop.",
        "source": "authored",
        "choices": [
          {
            "text": "In series with the lamp"
          },
          {
            "text": "In parallel with the lamp",
            "misconception_id": "ammeter_in_parallel"
          },
          {
            "text": "Directly across the battery terminals",
            "misconception_id": "ammeter_in_parallel"
          },
          {
            "text": "In place of the lamp, after removing it",
            "misconception_id": "meter_kinds_interchangeable"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "ammeter_in_parallel",
          "meter_kinds_interchangeable"
        ]
      },
      {
        "id": "cb_voltmeter_symbol_06",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "circuit_basics",
        "syllabus_codes": [
          "6.2.1.1.a"
        ],
        "atoms": [
          "recall_symbol"
        ],
        "prompt": "A circuit symbol is a circle with the letter V inside it. What is it?",
        "explanation": "A circle with V is a voltmeter (measures potential difference). A circle with A is an ammeter.",
        "source": "authored",
        "choices": [
          {
            "text": "A voltmeter"
          },
          {
            "text": "An ammeter",
            "misconception_id": "swapped_meter_letter"
          },
          {
            "text": "An ohmmeter",
            "misconception_id": "swapped_meter_letter"
          },
          {
            "text": "A cell",
            "misconception_id": "power_supply_vs_cell"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "swapped_meter_letter",
          "power_supply_vs_cell"
        ]
      },
      {
        "id": "cb_draw_fuse_symbol_07",
        "qtype": "circuit_draw",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "circuit_basics",
        "syllabus_codes": [
          "6.2.1.1.a"
        ],
        "atoms": [
          "recall_symbol"
        ],
        "prompt": "Draw the circuit symbol for a fuse.",
        "interim_for": "circuit_draw grader (Builder-as-input); needs a component_symbol render kind for the isolated-symbol reveal",
        "explanation": "The fuse symbol is a rectangle with a thin line through it (the wire that melts).",
        "source": "authored",
        "target": {
          "kind": "circuit",
          "params": {
            "dsl": "cell,sw,f,bb"
          }
        },
        "accept": {
          "component_present": "fuse",
          "symbol_form": "rectangle_with_line"
        },
        "on_fail": {
          "drew_resistor": "fuse_resistor_swap"
        },
        "fallback": {
          "mode": "self_check",
          "reveal": {
            "kind": "circuit",
            "params": {
              "dsl": "cell,sw,f,bb"
            }
          },
          "reveal_note": "The fuse is the rectangle with the line through it. A component_symbol render kind would show it on its own; for now it is shown in a simple loop.",
          "self_mark_prompt": "Compare your symbol with the fuse in the revealed circuit. Did you draw a rectangle with a line through it (not a plain resistor rectangle)?",
          "log_as": "ungraded_self_assessed"
        },
        "marks": 1
      },
      {
        "id": "cb_draw_measure_current_08",
        "qtype": "circuit_draw",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "circuit_basics",
        "syllabus_codes": [
          "6.2.1.1.a"
        ],
        "atoms": [
          "draw_measuring_circuit"
        ],
        "prompt": "Draw a circuit diagram for a circuit that could be used to measure the current in a filament lamp. Use a cell, a filament lamp and an ammeter.",
        "interim_for": "circuit_draw grader (Builder-as-input)",
        "explanation": "A single series loop: cell, switch, filament lamp and ammeter all in series, so the ammeter reads the current through the lamp.",
        "source": "authored",
        "target": {
          "kind": "circuit",
          "params": {
            "dsl": "cell,sw,bb,am"
          }
        },
        "accept": {
          "components_present": [
            "cell",
            "bulb",
            "ammeter"
          ],
          "ammeter_in_series_with": "bulb",
          "complete_loop": true
        },
        "on_fail": {
          "ammeter_in_parallel": "ammeter_in_parallel",
          "voltmeter_used_instead": "meter_kinds_interchangeable"
        },
        "fallback": {
          "mode": "self_check",
          "reveal": {
            "kind": "circuit",
            "params": {
              "dsl": "cell,sw,bb,am"
            }
          },
          "self_mark_prompt": "Compare your circuit with the model. Is the ammeter (circle with A) in series with the lamp, in one complete loop with the cell?",
          "log_as": "ungraded_self_assessed"
        },
        "marks": 1
      },
      {
        "id": "mn_ac_dc_supply_01",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "mains_ac_dc",
        "syllabus_codes": [
          "6.2.3.1.a"
        ],
        "atoms": [
          "ac_vs_dc"
        ],
        "prompt": "A battery supplies direct current (d.c.). What does the UK mains electricity supply provide?",
        "diagram": {
          "kind": "ac_dc_trace",
          "params": {
            "quantity": "pd",
            "signal": "ac"
          }
        },
        "explanation": "Mains electricity is an alternating supply: the potential difference repeatedly reverses direction, giving alternating current (a.c.).",
        "source": "authored",
        "choices": [
          {
            "text": "Alternating current (a.c.)"
          },
          {
            "text": "Direct current, like the battery",
            "misconception_id": "ac_dc_confused"
          },
          {
            "text": "A current that only flows when a switch is pressed"
          },
          {
            "text": "No current until a transformer is added"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "ac_dc_confused"
        ]
      },
      {
        "id": "mn_mains_values_02",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "mains_ac_dc",
        "syllabus_codes": [
          "6.2.3.1.a"
        ],
        "atoms": [
          "mains_values_recall"
        ],
        "prompt": "What are the potential difference and frequency of the UK mains electricity supply?",
        "explanation": "UK mains is 230 V and 50 Hz.",
        "source": "authored",
        "choices": [
          {
            "text": "230 V and 50 Hz"
          },
          {
            "text": "230 V and 60 Hz",
            "misconception_id": "mains_values_confused"
          },
          {
            "text": "12 V and 50 Hz",
            "misconception_id": "mains_values_confused"
          },
          {
            "text": "50 V and 230 Hz",
            "misconception_id": "mains_values_confused"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "mains_values_confused"
        ]
      },
      {
        "id": "mn_alternating_meaning_03",
        "qtype": "level_of_response_6",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "mains_ac_dc",
        "syllabus_codes": [
          "6.2.3.1.a"
        ],
        "atoms": [
          "ac_vs_dc"
        ],
        "prompt": "What is meant by an 'alternating potential difference'?",
        "explanation": "An alternating pd repeatedly changes direction, so the current it drives keeps reversing direction.",
        "source": "authored",
        "lor": {
          "points": [
            {
              "text": "The potential difference repeatedly reverses direction",
              "creditworthy": true
            },
            {
              "text": "The direction of the current it drives keeps changing",
              "creditworthy": true
            },
            {
              "text": "It stays constant in one direction, like a battery",
              "creditworthy": false,
              "misconception_id": "ac_dc_confused"
            },
            {
              "text": "It increases steadily and never decreases",
              "creditworthy": false,
              "misconception_id": "ac_dc_confused"
            }
          ]
        },
        "marks": 2,
        "applicable_misconceptions": [
          "ac_dc_confused"
        ]
      },
      {
        "id": "mn_identify_trace_04",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "mains_ac_dc",
        "syllabus_codes": [
          "6.2.3.1.a"
        ],
        "atoms": [
          "ac_vs_dc"
        ],
        "prompt": "The graph shows how the potential difference from a supply varies with time. What type of supply is it?",
        "diagram": {
          "kind": "ac_dc_trace",
          "params": {
            "quantity": "pd",
            "signal": "ac"
          }
        },
        "explanation": "The trace repeatedly crosses from positive to negative, so the pd reverses: it is an alternating (a.c.) supply.",
        "source": "authored",
        "choices": [
          {
            "text": "Alternating (a.c.), because the pd reverses direction"
          },
          {
            "text": "Direct (d.c.), because the pd is always changing",
            "misconception_id": "ac_dc_confused"
          },
          {
            "text": "Direct (d.c.), because it is a smooth curve",
            "misconception_id": "ac_dc_confused"
          },
          {
            "text": "Neither: the supply is switched off"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "ac_dc_confused"
        ]
      },
      {
        "id": "mn_earth_potential_05",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "mains_safety",
        "syllabus_codes": [
          "6.2.3.2.a"
        ],
        "atoms": [
          "wire_identification"
        ],
        "prompt": "What is the potential of the earth wire?",
        "explanation": "The earth wire is at 0 V; it carries no current in normal use.",
        "source": "authored",
        "choices": [
          {
            "text": "0 V"
          },
          {
            "text": "230 V",
            "misconception_id": "live_neutral_earth_confused"
          },
          {
            "text": "12 V",
            "misconception_id": "live_neutral_earth_confused"
          },
          {
            "text": "1.5 V",
            "misconception_id": "live_neutral_earth_confused"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "live_neutral_earth_confused"
        ]
      },
      {
        "id": "mn_live_wire_06",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "mains_safety",
        "syllabus_codes": [
          "6.2.3.2.a"
        ],
        "atoms": [
          "wire_identification"
        ],
        "prompt": "In a UK three-pin plug, which wire carries the alternating potential difference from the supply, and what colour is it?",
        "diagram": {
          "kind": "mains_three_wire",
          "params": {}
        },
        "explanation": "The live wire (brown) carries the alternating pd from the supply, at about 230 V.",
        "source": "authored",
        "choices": [
          {
            "text": "The live wire, coloured brown"
          },
          {
            "text": "The neutral wire, coloured blue",
            "misconception_id": "live_neutral_earth_confused"
          },
          {
            "text": "The earth wire, coloured green and yellow",
            "misconception_id": "live_neutral_earth_confused"
          },
          {
            "text": "The earth wire, coloured brown",
            "misconception_id": "live_neutral_earth_confused"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "live_neutral_earth_confused"
        ]
      },
      {
        "id": "mn_neutral_wire_07",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "mains_safety",
        "syllabus_codes": [
          "6.2.3.2.a"
        ],
        "atoms": [
          "wire_identification"
        ],
        "prompt": "What is the role of the neutral wire (blue) in a mains circuit?",
        "explanation": "The neutral wire completes the circuit and is at (or near) 0 V.",
        "source": "authored",
        "choices": [
          {
            "text": "It completes the circuit and is at about 0 V"
          },
          {
            "text": "It carries the 230 V supply to the appliance",
            "misconception_id": "live_neutral_earth_confused"
          },
          {
            "text": "It only carries current if there is a fault",
            "misconception_id": "live_neutral_earth_confused"
          },
          {
            "text": "It connects the metal case to the ground for safety",
            "misconception_id": "live_neutral_earth_confused"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "live_neutral_earth_confused"
        ]
      },
      {
        "id": "mn_earthing_safety_08",
        "qtype": "level_of_response_6",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.2",
        "subtag": "mains_safety",
        "syllabus_codes": [
          "6.2.3.2.a"
        ],
        "atoms": [
          "earthing_fuse_safety"
        ],
        "prompt": "An appliance has a metal case connected to the earth wire. Explain why this makes the appliance safe if the live wire touches the case.",
        "explanation": "If the live touches the case, a large current flows to earth through the low-resistance earth wire; this large current melts the fuse, disconnecting the live and leaving the case safe to touch.",
        "source": "authored",
        "lor": {
          "points": [
            {
              "text": "A large current flows from the live wire to earth through the earth wire",
              "creditworthy": true
            },
            {
              "text": "This large current melts the fuse (or trips the breaker), cutting off the live wire",
              "creditworthy": true
            },
            {
              "text": "The case cannot stay at a dangerous voltage, so it is safe to touch",
              "creditworthy": true
            },
            {
              "text": "The earth wire carries the normal working current of the appliance",
              "creditworthy": false,
              "misconception_id": "live_neutral_earth_confused"
            }
          ]
        },
        "marks": 3,
        "applicable_misconceptions": [
          "live_neutral_earth_confused"
        ]
      },
      {
        "id": "mn_fuse_function_09",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "mains_safety",
        "syllabus_codes": [
          "6.2.3.2.a"
        ],
        "atoms": [
          "earthing_fuse_safety"
        ],
        "prompt": "What is the purpose of a fuse in a plug?",
        "explanation": "A fuse contains a thin wire that melts and breaks the circuit if the current rises above a safe value.",
        "source": "authored",
        "choices": [
          {
            "text": "It melts and breaks the circuit if the current gets too high"
          },
          {
            "text": "It reduces the potential difference supplied to the appliance",
            "misconception_id": "fuse_resistor_swap"
          },
          {
            "text": "It stores charge to smooth out the supply"
          },
          {
            "text": "It increases the current so the appliance works faster"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "fuse_resistor_swap"
        ]
      },
      {
        "id": "mn_insulation_10",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "F",
        "topic": "6.2",
        "subtag": "mains_safety",
        "syllabus_codes": [
          "6.2.3.2.a"
        ],
        "atoms": [
          "cable_insulation"
        ],
        "prompt": "Why is the material covering the wires in a mains cable made of plastic?",
        "explanation": "Plastic is an electrical insulator, so it stops the user touching the live conductors and stops the wires short-circuiting.",
        "source": "authored",
        "choices": [
          {
            "text": "Plastic is an electrical insulator"
          },
          {
            "text": "Plastic is a good electrical conductor",
            "misconception_id": "confused_v_and_i"
          },
          {
            "text": "Plastic increases the current in the wires"
          },
          {
            "text": "Plastic stores the charge safely"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "confused_v_and_i"
        ]
      },
      {
        "id": "ng_stepup_function_11",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "national_grid",
        "syllabus_codes": [
          "6.2.6.3.b"
        ],
        "atoms": [
          "transformer_function"
        ],
        "prompt": "What is the function of the step-up transformer in the National Grid?",
        "diagram": {
          "kind": "transformer",
          "params": {
            "type": "step_up"
          }
        },
        "explanation": "A step-up transformer increases the potential difference (and lowers the current) for efficient transmission.",
        "source": "authored",
        "choices": [
          {
            "text": "To increase the potential difference for transmission"
          },
          {
            "text": "To decrease the potential difference",
            "misconception_id": "transformer_role_confused"
          },
          {
            "text": "To increase the current in the cables",
            "misconception_id": "transformer_role_confused"
          },
          {
            "text": "To increase the power supplied to the cables",
            "misconception_id": "transformer_role_confused"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "transformer_role_confused"
        ]
      },
      {
        "id": "ng_stepdown_function_12",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "national_grid",
        "syllabus_codes": [
          "6.2.6.3.b"
        ],
        "atoms": [
          "transformer_function"
        ],
        "prompt": "What is the function of the step-down transformer in the National Grid?",
        "diagram": {
          "kind": "transformer",
          "params": {
            "type": "step_down"
          }
        },
        "explanation": "A step-down transformer decreases the potential difference to a safer, usable level before electricity reaches homes.",
        "source": "authored",
        "choices": [
          {
            "text": "To decrease the potential difference for safe use in homes"
          },
          {
            "text": "To increase the potential difference",
            "misconception_id": "transformer_role_confused"
          },
          {
            "text": "To decrease the power delivered to homes",
            "misconception_id": "transformer_role_confused"
          },
          {
            "text": "To change alternating current into direct current",
            "misconception_id": "ac_dc_confused"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "transformer_role_confused",
          "ac_dc_confused"
        ]
      },
      {
        "id": "ng_high_voltage_explain_13",
        "qtype": "level_of_response_6",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.2",
        "subtag": "national_grid",
        "syllabus_codes": [
          "6.2.6.3.a"
        ],
        "atoms": [
          "grid_high_voltage_reason"
        ],
        "prompt": "Explain why electrical power is transmitted across the National Grid at very high potential difference.",
        "diagram": {
          "kind": "transmission_line",
          "params": {}
        },
        "explanation": "For a fixed power, P = VI means a higher pd gives a lower current; a lower current wastes less energy heating the cables (losses scale with I²R), so transmission is more efficient.",
        "source": "authored",
        "lor": {
          "points": [
            {
              "text": "For the same power, a higher pd means a lower current (P = VI)",
              "creditworthy": true
            },
            {
              "text": "A lower current wastes less energy heating the cables (I²R losses)",
              "creditworthy": true
            },
            {
              "text": "This makes transmission over long distances more efficient",
              "creditworthy": true
            },
            {
              "text": "The high voltage makes the electrons travel faster so they arrive sooner",
              "creditworthy": false,
              "misconception_id": "grid_loss_reason_missed"
            }
          ]
        },
        "marks": 3,
        "applicable_misconceptions": [
          "grid_loss_reason_missed"
        ]
      },
      {
        "id": "ng_loss_reason_mcq_14",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.2",
        "subtag": "national_grid",
        "syllabus_codes": [
          "6.2.6.3.a"
        ],
        "atoms": [
          "grid_high_voltage_reason"
        ],
        "prompt": "Transmitting electrical power at high voltage reduces energy losses in the cables. Why?",
        "explanation": "Higher voltage means a lower current for the same power, and lower current means less energy wasted as heat in the cable resistance.",
        "source": "authored",
        "choices": [
          {
            "text": "The current is lower, so less energy is wasted heating the cables"
          },
          {
            "text": "The higher voltage pushes the energy along faster",
            "misconception_id": "grid_loss_reason_missed"
          },
          {
            "text": "The resistance of the cables falls to zero at high voltage",
            "misconception_id": "grid_loss_reason_missed"
          },
          {
            "text": "High voltage stops any current flowing, so nothing is wasted",
            "misconception_id": "grid_loss_reason_missed"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": [
          "grid_loss_reason_missed"
        ]
      },
      {
        "id": "ng_network_name_15",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "F",
        "topic": "6.2",
        "subtag": "national_grid",
        "syllabus_codes": [
          "6.2.6.3.a"
        ],
        "atoms": [
          "transformer_function"
        ],
        "prompt": "What is the name of the nationwide system of cables and transformers that distributes electricity from power stations to consumers?",
        "explanation": "It is the National Grid.",
        "source": "authored",
        "choices": [
          {
            "text": "The National Grid"
          },
          {
            "text": "The mains circuit"
          },
          {
            "text": "The ring main"
          },
          {
            "text": "The power factor"
          }
        ],
        "answerIndex": 0,
        "marks": 1,
        "applicable_misconceptions": []
      },
      {
        "id": "iv_sketch_ohmic_01",
        "qtype": "graph_sketch",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "iv_characteristics",
        "syllabus_codes": [
          "6.2.1.4.b"
        ],
        "atoms": [
          "ohmic_sketch"
        ],
        "prompt": "Sketch the I–V characteristic of a fixed resistor at constant temperature. Draw it for both positive and negative potential difference.",
        "explanation": "Ohmic at constant temperature means I ∝ V: a straight line through the origin, continuing symmetrically into the third quadrant for negative pd.",
        "source": "authored",
        "axes": {
          "x": {
            "label": "potential difference",
            "unit": "V",
            "min": -1,
            "max": 1
          },
          "y": {
            "label": "current",
            "unit": "A",
            "min": -1,
            "max": 1
          }
        },
        "target": {
          "kind": "iv_characteristic",
          "params": {
            "device": "ohmic"
          }
        },
        "accept": {
          "through_origin": true,
          "monotonic": "increasing",
          "linearity": "straight",
          "quadrants": [
            "I",
            "III"
          ],
          "gradient_trend": "constant"
        },
        "on_fail": {
          "quadrants_missing_III": "iv_line_one_quadrant_only",
          "linearity_curved": "drew_lamp_curve_for_ohmic"
        },
        "fallback": {
          "mode": "self_check",
          "reveal": {
            "kind": "iv_characteristic",
            "params": {
              "device": "ohmic"
            }
          },
          "self_mark_prompt": "Compare your sketch with the model. Did your line go straight through the origin AND into the bottom-left (third quadrant)?",
          "log_as": "ungraded_self_assessed"
        },
        "marks": 1
      },
      {
        "id": "iv_sketch_filament_02",
        "qtype": "graph_sketch",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.2",
        "subtag": "iv_characteristics",
        "syllabus_codes": [
          "6.2.1.4.e"
        ],
        "atoms": [
          "ohmic_sketch"
        ],
        "prompt": "Sketch the I–V characteristic of a filament lamp. Draw it for both positive and negative potential difference.",
        "explanation": "The filament heats as current rises, so its resistance increases: the line curves, with the gradient falling as pd increases, but current keeps rising. It is an S-shape through the origin (odd symmetry), never flattening to horizontal.",
        "source": "authored",
        "axes": {
          "x": {
            "label": "potential difference",
            "unit": "V",
            "min": -1,
            "max": 1
          },
          "y": {
            "label": "current",
            "unit": "A",
            "min": -1,
            "max": 1
          }
        },
        "target": {
          "kind": "iv_characteristic",
          "params": {
            "device": "filament"
          }
        },
        "accept": {
          "through_origin": true,
          "monotonic": "increasing",
          "linearity": "curved",
          "quadrants": [
            "I",
            "III"
          ],
          "gradient_trend": "decreasing",
          "symmetry": "odd"
        },
        "on_fail": {
          "linearity_straight": "drew_lamp_curve_for_ohmic",
          "gradient_trend_increasing": "filament_resistance_falls",
          "gradient_trend_plateau": "filament_resistance_falls",
          "quadrants_missing_III": "iv_line_one_quadrant_only"
        },
        "fallback": {
          "mode": "self_check",
          "reveal": {
            "kind": "iv_characteristic",
            "params": {
              "device": "filament"
            }
          },
          "self_mark_prompt": "Compare your sketch with the model. Does your curve keep rising (never going flat) while bending towards the pd-axis, and pass through the origin into the third quadrant?",
          "log_as": "ungraded_self_assessed"
        },
        "marks": 1
      }
    ]
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
        id: "_demo_grid_lor", qtype: "level_of_response_6", board: "aqa_trilogy_8464", tier: "H",
        topic: "6.2", subtag: "national_grid", syllabus_codes: ["6.2.6.3"],
        atoms: ["grid_high_voltage_reason", "transformer_function"], difficulty: "d3", marks: 6,
        prompt: "The National Grid transmits electricity at very high voltage. Explain, as fully as you can, how step-up and step-down transformers and the choice of high voltage make transmission efficient and safe.",
        lor: {
          points: [
            { text: "A step-up transformer increases the voltage for transmission", creditworthy: true },
            { text: "Higher voltage means a lower current for the same power (P = VI)", creditworthy: true },
            { text: "Lower current reduces the I\u00b2R heating loss in the cables", creditworthy: true },
            { text: "A step-down transformer lowers the voltage for safe use in homes", creditworthy: true },
            { text: "Transformers only work with alternating current", creditworthy: true },
            { text: "High voltage makes the electrons travel faster so energy arrives sooner", creditworthy: false, misconception_id: "confused_v_and_i" },
            { text: "A step-up transformer increases the power transmitted", creditworthy: false, misconception_id: "transformer_role_confused" },
            { text: "Thicker cables are used so no transformers are needed", creditworthy: false }
          ]
        },
        applicable_misconceptions: ["confused_v_and_i", "transformer_role_confused", "grid_loss_reason_missed"],
        explanation: "Full answers link step-up to high voltage, high voltage to low current, low current to reduced I\u00b2R loss, and step-down to safe domestic use.",
        source: "authored"
      },
      {
        id: "_demo_iv_sketch", qtype: "graph_sketch", board: "aqa_trilogy_8464", tier: "FH",
        topic: "6.2", subtag: "iv_characteristics", syllabus_codes: ["6.2.1.4.b"],
        atoms: ["ohmic_sketch"], difficulty: "d2", marks: 2,
        prompt: "Sketch the I\u2013V characteristic of a fixed resistor at constant temperature, for both positive and negative potential difference.",
        axes: { x: { label: "potential difference", unit: "V", min: -1, max: 1 }, y: { label: "current", unit: "A", min: -1, max: 1 } },
        target: { kind: "iv_characteristic", params: { device: "ohmic" } },
        accept: { through_origin: true, monotonic: "increasing", linearity: "straight", quadrants: ["I", "III"], gradient_trend: "constant" },
        on_fail: { quadrants_missing_III: "iv_line_one_quadrant_only", linearity_curved: "drew_lamp_curve_for_ohmic" },
        applicable_misconceptions: ["iv_line_one_quadrant_only", "drew_lamp_curve_for_ohmic"],
        explanation: "Ohmic at constant temperature means I \u221d V: a straight line through the origin, continuing symmetrically into the third quadrant.",
        fallback: { mode: "self_check", reveal: { kind: "iv_characteristic", params: { device: "ohmic" } },
          self_mark_prompt: "Compare your sketch with the model. Did your line go straight through the origin AND into the bottom-left (third quadrant)?",
          log_as: "ungraded_self_assessed" },
        source: "authored"
      },
      {
        id: "_demo_energy_chain", qtype: "calc_workings", board: "aqa_trilogy_8464", tier: "FH",
        topic: "6.2", subtag: "energy_appliances", syllabus_codes: ["6.2.4.2"],
        atoms: ["power_vi_calc", "energy_pt_calc"], difficulty: "d3", marks: 4,
        prompt: "A 12 V supply drives a current of 0.50 A through a resistor for 2.0 minutes. Calculate the energy transferred. Use P = VI then E = Pt.",
        calc: {
          markCategories: ["substitution", "evaluation", "substitution", "evaluation"],
          stages: [
            { equation: "P=V*I", knowns: { V: 12, I: 0.5 }, unknown: "P", expectedFinalValue: 6, expectedUnit: ["W"],
              markScheme: [ {mark:1,category:"substitution",text:"P=12 x 0.5"}, {mark:2,category:"evaluation",text:"P=6 W"} ] },
            { equation: "E=P*t", knowns: { P: 6, t: 120 }, unknown: "E", expectedFinalValue: 720, expectedUnit: ["J"],
              gate: { kind: "from_previous_part" },
              markScheme: [ {mark:3,category:"substitution",text:"E=6 x 120"}, {mark:4,category:"evaluation",text:"E=720 J"} ] }
          ]
        },
        explanation: "P = VI = 12 \u00d7 0.50 = 6 W; E = Pt = 6 \u00d7 120 = 720 J.",
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
