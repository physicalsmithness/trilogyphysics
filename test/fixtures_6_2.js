/* Test-only fixtures: one item per engine qtype/path, extracted from the
   former ?demo=1 block in electricity_6_2.js (d058). Loaded by test/integration.js
   ONLY; never shipped, so the authored bank stays clean and tests cannot collide
   with authored items. */
window.TRILOGY_TEST_FIXTURES = [
 {
  "id": "_demo_series_R",
  "qtype": "mcq",
  "board": "aqa_trilogy_8464",
  "tier": "FH",
  "topic": "6.2",
  "subtag": "series_parallel",
  "syllabus_codes": [
   "6.2.1.4"
  ],
  "atoms": [
   "series_resistance_sum"
  ],
  "difficulty": "d1",
  "marks": 1,
  "equation_sheet": "must_recall",
  "prompt": "Two identical resistors are connected in series, as shown. Compared with a single one of them, the total resistance is:",
  "diagram": {
   "kind": "circuit",
   "params": {
    "dsl": "2cb,sc,r,r"
   }
  },
  "choices": [
   {
    "text": "doubled"
   },
   {
    "text": "halved",
    "misconception_id": "swapped_series_parallel"
   },
   {
    "text": "unchanged",
    "misconception_id": "topology_indifferent_assumption"
   },
   {
    "text": "quartered"
   }
  ],
  "answerIndex": 0,
  "applicable_misconceptions": [
   "swapped_series_parallel",
   "topology_indifferent_assumption"
  ],
  "explanation": "Resistances in series add, so two identical resistors give double the resistance.",
  "source": "authored"
 },
 {
  "id": "_demo_parallel_multi",
  "qtype": "mcq_multi",
  "board": "aqa_trilogy_8464",
  "tier": "H",
  "topic": "6.2",
  "subtag": "series_parallel",
  "syllabus_codes": [
   "6.2.2"
  ],
  "atoms": [
   "parallel_voltage_same",
   "parallel_current_sum",
   "parallel_resistance_qualitative"
  ],
  "difficulty": "d2",
  "marks": 2,
  "prompt": "Two identical resistors are connected in parallel. Which statements are correct?",
  "diagram": {
   "kind": "circuit",
   "params": {
    "dsl": "2cb,sc,(r;r)"
   }
  },
  "choices": [
   {
    "text": "The pd across each resistor is the same"
   },
   {
    "text": "The total resistance is less than one resistor alone"
   },
   {
    "text": "The total resistance is double one resistor",
    "misconception_id": "swapped_series_parallel"
   },
   {
    "text": "The current divides between the branches"
   }
  ],
  "answerIndices": [
   0,
   1,
   3
  ],
  "applicable_misconceptions": [
   "swapped_series_parallel",
   "equal_share_assumption"
  ],
  "explanation": "In parallel the pd across each branch is the same and the total resistance is below either branch.",
  "source": "authored"
 },
 {
  "id": "_demo_grid_short",
  "qtype": "short",
  "board": "aqa_trilogy_8464",
  "tier": "H",
  "topic": "6.2",
  "subtag": "national_grid",
  "syllabus_codes": [
   "6.2.6.3"
  ],
  "atoms": [
   "grid_high_voltage_reason"
  ],
  "difficulty": "d3",
  "marks": 3,
  "prompt": "Explain why electrical power is transmitted across the National Grid at very high voltage.",
  "markPoints": [
   {
    "any": [
     "high voltage",
     "higher voltage",
     "step up",
     "step-up"
    ]
   },
   {
    "any": [
     "low current",
     "lower current",
     "smaller current",
     "reduce the current",
     "reduces current"
    ]
   },
   {
    "any": [
     "power loss",
     "heat",
     "i²r",
     "i2r",
     "i squared r",
     "energy loss",
     "heating",
     "dissipat"
    ]
   }
  ],
  "applicable_misconceptions": [
   "grid_loss_reason_missed",
   "confused_v_and_i"
  ],
  "explanation": "High voltage means a lower current for the same power, and lower current cuts the I²R heating loss in the cables.",
  "source": "authored"
 },
 {
  "id": "_demo_iv_select",
  "qtype": "mcq",
  "board": "aqa_trilogy_8464",
  "tier": "FH",
  "topic": "6.2",
  "subtag": "iv_characteristics",
  "syllabus_codes": [
   "6.2.1.4"
  ],
  "atoms": [
   "ohmic_recognise"
  ],
  "difficulty": "d2",
  "marks": 1,
  "prompt": "Which graph shows the I–V characteristic of an ohmic resistor at constant temperature?",
  "choices": [
   {
    "diagram": {
     "kind": "iv_characteristic",
     "params": {
      "device": "ohmic"
     }
    }
   },
   {
    "diagram": {
     "kind": "iv_characteristic",
     "params": {
      "device": "filament"
     }
    },
    "misconception_id": "drew_lamp_curve_for_ohmic"
   },
   {
    "diagram": {
     "kind": "iv_characteristic",
     "params": {
      "device": "diode"
     }
    },
    "misconception_id": "misread_iv_graph_for_ohmic"
   },
   {
    "diagram": {
     "kind": "iv_characteristic",
     "params": {
      "device": "filament",
      "variant": "plateau"
     }
    },
    "misconception_id": "misread_iv_graph_for_ohmic"
   }
  ],
  "answerIndex": 0,
  "applicable_misconceptions": [
   "drew_lamp_curve_for_ohmic",
   "iv_line_one_quadrant_only",
   "misread_iv_graph_for_ohmic"
  ],
  "explanation": "An ohmic conductor at constant temperature gives a straight line through the origin in both quadrants.",
  "source": "authored"
 },
 {
  "id": "_demo_grid_lor",
  "qtype": "level_of_response_6",
  "board": "aqa_trilogy_8464",
  "tier": "H",
  "topic": "6.2",
  "subtag": "national_grid",
  "syllabus_codes": [
   "6.2.6.3"
  ],
  "atoms": [
   "grid_high_voltage_reason",
   "transformer_function"
  ],
  "difficulty": "d3",
  "marks": 6,
  "prompt": "The National Grid transmits electricity at very high voltage. Explain, as fully as you can, how step-up and step-down transformers and the choice of high voltage make transmission efficient and safe.",
  "lor": {
   "points": [
    {
     "text": "A step-up transformer increases the voltage for transmission",
     "creditworthy": true
    },
    {
     "text": "Higher voltage means a lower current for the same power (P = VI)",
     "creditworthy": true
    },
    {
     "text": "Lower current reduces the I²R heating loss in the cables",
     "creditworthy": true
    },
    {
     "text": "A step-down transformer lowers the voltage for safe use in homes",
     "creditworthy": true
    },
    {
     "text": "Transformers only work with alternating current",
     "creditworthy": true
    },
    {
     "text": "High voltage makes the electrons travel faster so energy arrives sooner",
     "creditworthy": false,
     "misconception_id": "confused_v_and_i"
    },
    {
     "text": "A step-up transformer increases the power transmitted",
     "creditworthy": false,
     "misconception_id": "transformer_role_confused"
    },
    {
     "text": "Thicker cables are used so no transformers are needed",
     "creditworthy": false
    }
   ]
  },
  "applicable_misconceptions": [
   "confused_v_and_i",
   "transformer_role_confused",
   "grid_loss_reason_missed"
  ],
  "explanation": "Full answers link step-up to high voltage, high voltage to low current, low current to reduced I²R loss, and step-down to safe domestic use.",
  "source": "authored"
 },
 {
  "id": "_demo_iv_sketch",
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
  "difficulty": "d2",
  "marks": 2,
  "prompt": "Sketch the I–V characteristic of a fixed resistor at constant temperature, for both positive and negative potential difference.",
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
  "applicable_misconceptions": [
   "iv_line_one_quadrant_only",
   "drew_lamp_curve_for_ohmic"
  ],
  "explanation": "Ohmic at constant temperature means I ∝ V: a straight line through the origin, continuing symmetrically into the third quadrant.",
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
  "source": "authored"
 },
 {
  "id": "_demo_energy_chain",
  "qtype": "calc_workings",
  "board": "aqa_trilogy_8464",
  "tier": "FH",
  "topic": "6.2",
  "subtag": "energy_appliances",
  "syllabus_codes": [
   "6.2.4.2"
  ],
  "atoms": [
   "power_vi_calc",
   "energy_pt_calc"
  ],
  "difficulty": "d3",
  "marks": 4,
  "prompt": "A 12 V supply drives a current of 0.50 A through a resistor for 2.0 minutes. Calculate the energy transferred. Use P = VI then E = Pt.",
  "calc": {
   "markCategories": [
    "substitution",
    "evaluation",
    "substitution",
    "evaluation"
   ],
   "stages": [
    {
     "equation": "P=V*I",
     "knowns": {
      "V": 12,
      "I": 0.5
     },
     "unknown": "P",
     "expectedFinalValue": 6,
     "expectedUnit": [
      "W"
     ],
     "markScheme": [
      {
       "mark": 1,
       "category": "substitution",
       "text": "P=12 x 0.5"
      },
      {
       "mark": 2,
       "category": "evaluation",
       "text": "P=6 W"
      }
     ]
    },
    {
     "equation": "E=P*t",
     "knowns": {
      "P": 6,
      "t": 120
     },
     "unknown": "E",
     "expectedFinalValue": 720,
     "expectedUnit": [
      "J"
     ],
     "gate": {
      "kind": "from_previous_part"
     },
     "markScheme": [
      {
       "mark": 3,
       "category": "substitution",
       "text": "E=6 x 120"
      },
      {
       "mark": 4,
       "category": "evaluation",
       "text": "E=720 J"
      }
     ]
    }
   ]
  },
  "explanation": "P = VI = 12 × 0.50 = 6 W; E = Pt = 6 × 120 = 720 J.",
  "source": "authored"
 },
 {
  "id": "_demo_vir_calc",
  "qtype": "calc_workings",
  "board": "aqa_trilogy_8464",
  "tier": "FH",
  "topic": "6.2",
  "subtag": "resistance_ohm",
  "syllabus_codes": [
   "6.2.1.3"
  ],
  "atoms": [
   "ohm_law_calc"
  ],
  "difficulty": "d1",
  "marks": 4,
  "equation_sheet": "from_insert",
  "prompt": "A resistor carries a current of 0.50 A when the pd across it is 6.0 V. Calculate its resistance.",
  "calc": {
   "knowns": {
    "V": {
     "value": 6,
     "unit": "V"
    },
    "I": {
     "value": 0.5,
     "unit": "A"
    }
   },
   "unknown": "R",
   "equationCanonicalForms": [
    "R=V/I"
   ],
   "expectedFinalValue": 12,
   "expectedUnit": [
    "Ω",
    "ohm"
   ],
   "requireUnit": true,
   "allowRepeat": false,
   "marks": 4
  },
  "explanation": "R = V / I = 6.0 / 0.50 = 12 Ω.",
  "source": "authored"
 }
];
