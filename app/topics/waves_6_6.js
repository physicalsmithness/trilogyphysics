/* ============================================================================
   Trilogy Physics - TOPIC_CONFIG for Waves 6.6, v1.0 (engine-shape, d053)
   ----------------------------------------------------------------------------
   Ratified vocabulary (d043/d048) authored as 109 items, MIGRATED to the locked
   engine JSON shape (d053): qtype mcq|mcq_multi|level_of_response_6|calc_workings
   |widget; tier F|H|FH; choices[]+answerIndex(es) with per-choice misconception_id;
   level_of_response_6.lor.points[{text,creditworthy,misconception_id}]; atoms[];
   syllabus_codes[]; board/topic; applicable_misconceptions[]. Author NEW items in
   THIS shape. Pre-migration (lean fixture) backup: outputs/waves_6_6.premigration.bak.js.

   Grader limits honoured (6.5 findings): v=fL & f=1/T grade full (lambda = single
   char L); prefix/std-form traps are interim_for:"calc_prefix" MCQs; enriched d037
   chains are mcq carrying calc.stages/markScheme/failsAt; 3 qtype:"widget" items
   carry pending_engine:"widget_qtype" until Housing wires the submit flow + d036.
   ============================================================================ */

(function () {
  "use strict";
  window.TRILOGY_TOPICS = window.TRILOGY_TOPICS || {};

  const ATOMS = [
  {
    "slug": "transverse_longitudinal_classify",
    "label": "Classify a wave as transverse/longitudinal",
    "subtag": "wave_basics"
  },
  {
    "slug": "transverse_definition",
    "label": "Define a transverse wave",
    "subtag": "wave_basics"
  },
  {
    "slug": "longitudinal_definition",
    "label": "Define a longitudinal wave",
    "subtag": "wave_basics"
  },
  {
    "slug": "compression_rarefaction_identify",
    "label": "Identify compressions and rarefactions",
    "subtag": "wave_basics"
  },
  {
    "slug": "wave_not_medium",
    "label": "The wave travels, not the medium",
    "subtag": "wave_basics"
  },
  {
    "slug": "amplitude_definition",
    "label": "Define amplitude",
    "subtag": "wave_properties"
  },
  {
    "slug": "wavelength_definition",
    "label": "Define wavelength",
    "subtag": "wave_properties"
  },
  {
    "slug": "frequency_definition",
    "label": "Define frequency",
    "subtag": "wave_properties"
  },
  {
    "slug": "period_definition",
    "label": "Define period",
    "subtag": "wave_properties"
  },
  {
    "slug": "mark_wavelength_on_diagram",
    "label": "Mark/identify wavelength on a diagram",
    "subtag": "wave_properties"
  },
  {
    "slug": "mark_amplitude_on_diagram",
    "label": "Mark/identify amplitude on a diagram",
    "subtag": "wave_properties"
  },
  {
    "slug": "compare_two_waves",
    "label": "Compare two displayed waves",
    "subtag": "wave_properties"
  },
  {
    "slug": "period_from_trace",
    "label": "Read the period off a trace",
    "subtag": "wave_properties"
  },
  {
    "slug": "wave_energy_transfer",
    "label": "Waves transfer energy",
    "subtag": "wave_properties"
  },
  {
    "slug": "wave_speed_calc",
    "label": "Wave speed v = f lambda",
    "subtag": "wave_calculations"
  },
  {
    "slug": "wave_equation_recall",
    "label": "Recall/select v = f lambda",
    "subtag": "wave_calculations"
  },
  {
    "slug": "period_frequency_calc",
    "label": "f = 1/T and T = 1/f",
    "subtag": "wave_calculations"
  },
  {
    "slug": "echo_distance_doubling",
    "label": "Echo timing: d = 2x",
    "subtag": "wave_calculations"
  },
  {
    "slug": "wave_equation_qualitative",
    "label": "Qualitative v = f lambda reasoning",
    "subtag": "wave_calculations"
  },
  {
    "slug": "chained_wave_calc",
    "label": "Chained wave calculations (d037)",
    "subtag": "wave_calculations"
  },
  {
    "slug": "speed_sound_direct_method",
    "label": "Speed of sound: direct method",
    "subtag": "wave_measurement"
  },
  {
    "slug": "speed_sound_echo_method",
    "label": "Speed of sound: echo method",
    "subtag": "wave_measurement"
  },
  {
    "slug": "ripple_tank_method",
    "label": "RP20 ripple tank method",
    "subtag": "wave_measurement"
  },
  {
    "slug": "several_wavelengths_measured",
    "label": "Measure across several wavelengths",
    "subtag": "wave_measurement"
  },
  {
    "slug": "string_standing_wave_method",
    "label": "RP20 waves on a string",
    "subtag": "wave_measurement"
  },
  {
    "slug": "frequency_count_method",
    "label": "Count waves to find frequency",
    "subtag": "wave_measurement"
  },
  {
    "slug": "mean_of_repeats",
    "label": "Mean of repeated readings",
    "subtag": "wave_measurement"
  },
  {
    "slug": "precision_uncertainty_basics",
    "label": "Precision and uncertainty basics",
    "subtag": "wave_measurement"
  },
  {
    "slug": "refraction_name",
    "label": "Name refraction",
    "subtag": "refraction_boundaries"
  },
  {
    "slug": "ray_diagram_construct",
    "label": "Construct a refraction ray diagram",
    "subtag": "refraction_boundaries"
  },
  {
    "slug": "refraction_direction",
    "label": "Which way the ray bends",
    "subtag": "refraction_boundaries"
  },
  {
    "slug": "refraction_speed_cause",
    "label": "Refraction caused by speed change (HT)",
    "subtag": "refraction_boundaries"
  },
  {
    "slug": "wavefront_explanation",
    "label": "Wavefront explanation of refraction (HT)",
    "subtag": "refraction_boundaries"
  },
  {
    "slug": "frequency_unchanged_at_boundary",
    "label": "Frequency unchanged at a boundary",
    "subtag": "refraction_boundaries"
  },
  {
    "slug": "wavelength_dependent_behaviour",
    "label": "Wavelength-dependent behaviour (HT)",
    "subtag": "refraction_boundaries"
  },
  {
    "slug": "em_order",
    "label": "Order of the EM spectrum",
    "subtag": "em_spectrum"
  },
  {
    "slug": "em_ends_identify",
    "label": "Identify the spectrum ends",
    "subtag": "em_spectrum"
  },
  {
    "slug": "freq_wavelength_inverse",
    "label": "Long wavelength = low frequency",
    "subtag": "em_spectrum"
  },
  {
    "slug": "em_common_properties",
    "label": "Common EM properties",
    "subtag": "em_spectrum"
  },
  {
    "slug": "em_continuous_spectrum",
    "label": "Continuous spectrum",
    "subtag": "em_spectrum"
  },
  {
    "slug": "visible_limited_detection",
    "label": "Eyes detect only visible",
    "subtag": "em_spectrum"
  },
  {
    "slug": "visible_colour_order",
    "label": "Colour order within visible",
    "subtag": "em_spectrum"
  },
  {
    "slug": "em_wavelength_magnitude",
    "label": "Place a wavelength in its region",
    "subtag": "em_spectrum"
  },
  {
    "slug": "radio_from_oscillations",
    "label": "Radio from circuit oscillations (HT)",
    "subtag": "em_origins"
  },
  {
    "slug": "radio_induce_ac",
    "label": "Absorbed radio induces a.c. (HT)",
    "subtag": "em_origins"
  },
  {
    "slug": "gamma_from_nucleus",
    "label": "Gamma originates in the nucleus",
    "subtag": "em_origins"
  },
  {
    "slug": "uv_hazards",
    "label": "UV hazards",
    "subtag": "em_dangers"
  },
  {
    "slug": "ionising_hazards",
    "label": "Ionising X/gamma hazards",
    "subtag": "em_dangers"
  },
  {
    "slug": "hazard_matched_to_group",
    "label": "Match hazard to EM group",
    "subtag": "em_dangers"
  },
  {
    "slug": "dose_as_risk_measure",
    "label": "Dose (Sv) measures risk",
    "subtag": "em_dangers"
  },
  {
    "slug": "risk_data_conclusions",
    "label": "Conclusions from dose data",
    "subtag": "em_dangers"
  },
  {
    "slug": "use_despite_risk",
    "label": "Justify use despite risk",
    "subtag": "em_dangers"
  },
  {
    "slug": "em_use_match",
    "label": "Match EM group to use",
    "subtag": "em_uses"
  },
  {
    "slug": "em_use_explain",
    "label": "Explain suitability for a use (HT)",
    "subtag": "em_uses"
  },
  {
    "slug": "communication_uses",
    "label": "EM communication uses",
    "subtag": "em_uses"
  },
  {
    "slug": "ir_emission_surface",
    "label": "Best/worst IR emitters",
    "subtag": "infrared_radiation"
  },
  {
    "slug": "ir_absorption_surface",
    "label": "Best/worst IR absorbers",
    "subtag": "infrared_radiation"
  },
  {
    "slug": "rp21_method",
    "label": "RP21 method essentials",
    "subtag": "infrared_radiation"
  },
  {
    "slug": "cooling_curve_interpret",
    "label": "Interpret heating/cooling curves",
    "subtag": "infrared_radiation"
  },
  {
    "slug": "ir_temperature_link",
    "label": "Hotter emits more IR",
    "subtag": "infrared_radiation"
  },
  {
    "slug": "thermal_equilibrium_rates",
    "label": "Constant temp = absorb rate = emit rate",
    "subtag": "infrared_radiation"
  }
];

  const MISCONCEPTIONS = [
  {
    "slug": "sound_called_transverse",
    "label": "Called sound a transverse wave"
  },
  {
    "slug": "updown_sideways_vague",
    "label": "'Up and down / side to side' with no reference directions"
  },
  {
    "slug": "perpendicular_to_what_missing",
    "label": "'Perpendicular' without saying to what"
  },
  {
    "slug": "oscillation_term_missing",
    "label": "Definition with no oscillations/vibrations"
  },
  {
    "slug": "compression_rarefaction_confused",
    "label": "Swapped compression and rarefaction"
  },
  {
    "slug": "medium_travels_with_wave",
    "label": "Thought the medium travels with the wave (NEW)"
  },
  {
    "slug": "amplitude_peak_to_trough",
    "label": "Amplitude taken crest-to-trough (2A) [widget]"
  },
  {
    "slug": "wavelength_half_marked",
    "label": "Wavelength marked as a half (crest to trough) [widget]"
  },
  {
    "slug": "wavelength_peak_to_trough",
    "label": "Wavelength marked as the diagonal crest-trough [widget]"
  },
  {
    "slug": "amplitude_diagonal",
    "label": "Amplitude marked as a diagonal [widget]"
  },
  {
    "slug": "wavelength_c_to_r",
    "label": "Longitudinal wavelength marked C-to-R (half) [widget]"
  },
  {
    "slug": "period_frequency_confused",
    "label": "Swapped period and frequency"
  },
  {
    "slug": "wave_equation_inverted",
    "label": "v=f*lambda divided/built the wrong way"
  },
  {
    "slug": "reciprocal_not_taken",
    "label": "f=1/T: returned the given value (divided by one)"
  },
  {
    "slug": "stem_numbers_multiplied",
    "label": "Multiplied two stem numbers regardless of physics"
  },
  {
    "slug": "graph_readoff_left_as_answer",
    "label": "Graph read-off submitted as the final answer (WS, d043)"
  },
  {
    "slug": "faster_means_longer_time",
    "label": "Faster speed taken to mean a longer time"
  },
  {
    "slug": "echo_factor_two_missed",
    "label": "Echo timing: factor of 2 missed [widget]"
  },
  {
    "slug": "apparatus_described_not_method",
    "label": "Described the apparatus instead of the method"
  },
  {
    "slug": "measurement_purpose_missing",
    "label": "Measurements taken but never used"
  },
  {
    "slug": "single_wavelength_measured",
    "label": "Measured one wavelength, not across several"
  },
  {
    "slug": "mean_across_different_quantities",
    "label": "Averaged values that are not repeats of one quantity"
  },
  {
    "slug": "counted_loops_not_nodes",
    "label": "Counted loops as nodes (nodes = loops + 1) [widget]"
  },
  {
    "slug": "refraction_term_unknown",
    "label": "Could not name refraction"
  },
  {
    "slug": "bent_wrong_way",
    "label": "Refracted ray bent the wrong way [widget]"
  },
  {
    "slug": "equal_angle_no_refraction",
    "label": "Drew r = i (no refraction) [widget]"
  },
  {
    "slug": "snell_angle_off",
    "label": "Right direction, refraction angle off [widget]"
  },
  {
    "slug": "normal_not_drawn",
    "label": "Normal omitted / angles from the surface"
  },
  {
    "slug": "density_cited_not_speed",
    "label": "Explained refraction by density, not speed change"
  },
  {
    "slug": "speed_change_direction_unstated",
    "label": "Speed 'changes' with no faster/slower"
  },
  {
    "slug": "boundary_frequency_not_constant",
    "label": "Let frequency change at a boundary"
  },
  {
    "slug": "em_order_confused",
    "label": "Misplaced an EM region [widget: em_off_by_one_region]"
  },
  {
    "slug": "spectrum_ends_swapped",
    "label": "Swapped the spectrum ends [widget]"
  },
  {
    "slug": "freq_wavelength_inverse_missed",
    "label": "Long wavelength paired with high frequency"
  },
  {
    "slug": "red_called_shortest",
    "label": "Wrong visible colour order"
  },
  {
    "slug": "property_answered_with_use",
    "label": "Gave a use when asked for a property"
  },
  {
    "slug": "radio_oscillation_link_missed",
    "label": "No oscillation link for radio emission/absorption"
  },
  {
    "slug": "em_origin_swapped",
    "label": "Swapped the origins of radio and gamma (NEW)"
  },
  {
    "slug": "ionising_confused_with_radioactive",
    "label": "Called X/gamma 'radioactive' instead of ionising"
  },
  {
    "slug": "risk_unqualified",
    "label": "Bare 'cancer'/'burning' with no qualification"
  },
  {
    "slug": "hazard_wrong_for_group",
    "label": "Wrong risk attached to the wrong EM group"
  },
  {
    "slug": "dose_magnitude_misread",
    "label": "Misread dose magnitudes (0.100 vs 100 mSv)"
  },
  {
    "slug": "protection_mechanism_vague",
    "label": "'The screen protects' with no absorption mechanism"
  },
  {
    "slug": "microwave_only_cooking",
    "label": "Microwaves = ovens only; no communications use"
  },
  {
    "slug": "ultrasound_treated_as_em",
    "label": "Offered ultrasound as an EM wave"
  },
  {
    "slug": "shiny_white_called_good_emitter",
    "label": "Inverted the IR surface ranking"
  },
  {
    "slug": "final_temp_cited_not_rate",
    "label": "Cited final temperature where the rate was asked"
  },
  {
    "slug": "heat_not_radiation_language",
    "label": "'Absorbs heat' instead of IR radiation"
  },
  {
    "slug": "thermal_equilibrium_missed",
    "label": "Missed absorb rate = emit rate at constant temp"
  },
  {
    "slug": "ir_temperature_link_missed",
    "label": "No link from IR amount to temperature"
  },
  {
    "slug": "tir_not_recognised",
    "label": "TIR not recognised [widget; DORMANT for Trilogy, d043]"
  },
  {
    "slug": "wrong_formula_rearrangement",
    "label": "Rearranged the equation the wrong way"
  },
  {
    "slug": "chain_prep_stage_skipped",
    "label": "Skipped a prep stage; used a raw stem value (6.5 NEW)"
  },
  {
    "slug": "chain_intermediate_as_final",
    "label": "Gave an intermediate stage value as the final answer (6.5 NEW)"
  },
  {
    "slug": "picked_given_value",
    "label": "Answered with a value lifted from the stem"
  },
  {
    "slug": "power_of_ten_evaluation_error",
    "label": "Standard-form / place-value slip in the evaluation"
  },
  {
    "slug": "rounding_mistake",
    "label": "Right method, rounding/precision slip"
  },
  {
    "slug": "graph_scale_misread",
    "label": "Misread the graph scale / gridlines"
  },
  {
    "slug": "prefix_not_converted",
    "label": "Did not convert a prefix (kHz, GHz, ms, nm, cm)"
  },
  {
    "slug": "sig_figs_not_applied",
    "label": "Did not give the answer to the required sig figs"
  },
  {
    "slug": "proportionality_stated_as_increases",
    "label": "Said 'increases' instead of directly proportional"
  },
  {
    "slug": "freehand_line_not_ruled",
    "label": "Best-fit line drawn freehand / wrong shape"
  },
  {
    "slug": "repeatability_reproducibility_confused",
    "label": "Confused repeatability and reproducibility"
  },
  {
    "slug": "uncertainty_given_as_range",
    "label": "Uncertainty given as the full range, not half (WS, d043)"
  },
  {
    "slug": "digital_reading_trusted_no_random_error",
    "label": "Digital devices 'cannot show random error' (WS, d043)"
  }
];

  const CONFIG = {
    id: "6.6",
    slug: "waves",
    name: "Waves",
    board: "aqa_trilogy_8464",
    atoms: ATOMS,
    misconceptions: MISCONCEPTIONS,
    diagram_kinds: ["wave_train","wavefronts","longitudinal_wave","wave_scenario","ripple_tank","standing_wave","em_spectrum","em_origins","em_uses","refraction_wavefronts","refraction_ray","material_wave_behaviour","radiation_demo"],
    items: [
    {
        "id": "wb_sound_type",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_basics",
        "syllabus_codes": [
            "6.6.1.1.d"
        ],
        "atoms": [
            "transverse_longitudinal_classify"
        ],
        "prompt": "What type of wave is a sound wave travelling through air?",
        "facility_pct": 55,
        "choices": [
            {
                "text": "Longitudinal"
            },
            {
                "text": "Transverse",
                "misconception_id": "sound_called_transverse"
            },
            {
                "text": "Electromagnetic"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Sound in air is longitudinal: the air particles oscillate parallel to the direction the sound travels, making compressions and rarefactions.",
        "applicable_misconceptions": [
            "sound_called_transverse"
        ],
        "source": "aqa_ppq:trilogy_2018_p2f_02.2"
    },
    {
        "id": "wb_ripples_type",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_basics",
        "syllabus_codes": [
            "6.6.1.1.b"
        ],
        "atoms": [
            "transverse_longitudinal_classify"
        ],
        "prompt": "Ripples on a water surface are an example of which type of wave?",
        "choices": [
            {
                "text": "Transverse"
            },
            {
                "text": "Longitudinal"
            },
            {
                "text": "Electromagnetic"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Water-surface ripples are transverse: the surface oscillates up and down, perpendicular to the direction the ripples travel across the water.",
        "source": "authored"
    },
    {
        "id": "wb_pick_longitudinal",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_basics",
        "syllabus_codes": [
            "6.6.1.1.a"
        ],
        "atoms": [
            "transverse_longitudinal_classify"
        ],
        "prompt": "Which of the following waves is longitudinal?",
        "choices": [
            {
                "text": "A sound wave in air"
            },
            {
                "text": "A ripple on a pond"
            },
            {
                "text": "A radio wave"
            },
            {
                "text": "A light wave"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Sound is the longitudinal one. Water ripples and all electromagnetic waves (radio, visible light) are transverse.",
        "source": "authored"
    },
    {
        "id": "wb_transverse_def",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_basics",
        "syllabus_codes": [
            "6.6.1.1.e"
        ],
        "atoms": [
            "transverse_definition"
        ],
        "prompt": "What is meant by a 'transverse wave'?",
        "facility_pct": 20,
        "choices": [
            {
                "text": "A wave in which the oscillations are perpendicular to the direction of energy transfer"
            },
            {
                "text": "A wave that moves up and down",
                "misconception_id": "updown_sideways_vague"
            },
            {
                "text": "A wave in which the oscillations are perpendicular",
                "misconception_id": "perpendicular_to_what_missing"
            },
            {
                "text": "A wave in which the oscillations are parallel to the direction of energy transfer"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Both parts are needed: the oscillations, and that they are perpendicular to the direction of energy transfer. AQA refuses the mark if either is missing.",
        "applicable_misconceptions": [
            "updown_sideways_vague",
            "perpendicular_to_what_missing"
        ],
        "source": "aqa_ppq:trilogy_2024_p2h_03.2"
    },
    {
        "id": "wb_longitudinal_def",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_basics",
        "syllabus_codes": [
            "6.6.1.1.e"
        ],
        "atoms": [
            "longitudinal_definition"
        ],
        "prompt": "What is meant by a 'longitudinal wave'?",
        "choices": [
            {
                "text": "A wave in which the oscillations are parallel to the direction of energy transfer"
            },
            {
                "text": "A wave in which the oscillations are perpendicular to the direction of energy transfer"
            },
            {
                "text": "A wave that moves side to side",
                "misconception_id": "updown_sideways_vague"
            },
            {
                "text": "A wave in which the particles travel along with the wave",
                "misconception_id": "medium_travels_with_wave"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Longitudinal: oscillations parallel to the direction of energy transfer, producing compressions and rarefactions.",
        "applicable_misconceptions": [
            "updown_sideways_vague",
            "medium_travels_with_wave"
        ],
        "source": "authored"
    },
    {
        "id": "wb_difference_claims",
        "qtype": "level_of_response_6",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_basics",
        "syllabus_codes": [
            "6.6.1.1.e"
        ],
        "atoms": [
            "transverse_definition"
        ],
        "prompt": "Describe the difference between longitudinal waves and transverse waves. Tick the statements that should be part of a full answer.",
        "facility_pct": 25,
        "marks": 3,
        "lor": {
            "points": [
                {
                    "text": "In a transverse wave the oscillations are perpendicular to the direction of energy transfer",
                    "creditworthy": true
                },
                {
                    "text": "In a longitudinal wave the oscillations are parallel to the direction of energy transfer",
                    "creditworthy": true
                },
                {
                    "text": "Transverse waves go up and down; longitudinal waves go side to side",
                    "creditworthy": false,
                    "misconception_id": "updown_sideways_vague"
                },
                {
                    "text": "Only transverse waves transfer energy",
                    "creditworthy": false
                },
                {
                    "text": "Longitudinal waves show compressions and rarefactions",
                    "creditworthy": true
                }
            ]
        },
        "explanation": "The difference is the direction of the oscillations RELATIVE to the direction of energy transfer: perpendicular (transverse) versus parallel (longitudinal). 'Up and down versus side to side' earns nothing on its own.",
        "applicable_misconceptions": [
            "updown_sideways_vague"
        ],
        "source": "aqa_ppq:trilogy_2023_p2h_03.4"
    },
    {
        "id": "wb_label_compression",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_basics",
        "syllabus_codes": [
            "6.6.1.1.c"
        ],
        "atoms": [
            "compression_rarefaction_identify"
        ],
        "prompt": "On the diagram, what are the regions where the particles are closest together called?",
        "facility_pct": 30,
        "diagram": {
            "kind": "longitudinal_wave",
            "params": {
                "cycles": 3,
                "mark": {
                    "labelCR": false
                }
            }
        },
        "choices": [
            {
                "text": "Compressions"
            },
            {
                "text": "Rarefactions",
                "misconception_id": "compression_rarefaction_confused"
            },
            {
                "text": "Amplitudes"
            },
            {
                "text": "Reflections"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Where the particles crowd together is a compression; where they spread out is a rarefaction.",
        "applicable_misconceptions": [
            "compression_rarefaction_confused"
        ],
        "source": "aqa_ppq:trilogy_2023_p2f_04.1"
    },
    {
        "id": "wb_rarefaction_meaning",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_basics",
        "syllabus_codes": [
            "6.6.1.1.c"
        ],
        "atoms": [
            "compression_rarefaction_identify"
        ],
        "prompt": "When sound waves travel through air, what is a rarefaction?",
        "facility_pct": 25,
        "choices": [
            {
                "text": "A region where the air particles are spread further apart"
            },
            {
                "text": "A region where the air particles are squashed together",
                "misconception_id": "compression_rarefaction_confused"
            },
            {
                "text": "The maximum displacement of a particle"
            },
            {
                "text": "The number of waves per second"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "A rarefaction is a region where the air particles are more spread out (lower pressure). A compression is the opposite.",
        "applicable_misconceptions": [
            "compression_rarefaction_confused"
        ],
        "source": "aqa_ppq:trilogy_2024_p2f_03.6"
    },
    {
        "id": "wb_longitudinal_cr_distance",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "wave_basics",
        "syllabus_codes": [
            "6.6.1.1.c"
        ],
        "atoms": [
            "compression_rarefaction_identify"
        ],
        "prompt": "A student marks the distance from the centre of a compression to the centre of the NEXT RAREFACTION and calls it one wavelength. What is the distance the student has marked?",
        "diagram": {
            "kind": "longitudinal_wave",
            "params": {
                "cycles": 3,
                "distractor": "wavelength_C_to_R"
            }
        },
        "choices": [
            {
                "text": "Half a wavelength"
            },
            {
                "text": "One wavelength",
                "misconception_id": "wavelength_c_to_r"
            },
            {
                "text": "Two wavelengths"
            },
            {
                "text": "One amplitude"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "One wavelength on a longitudinal wave is compression to the next compression (or R to R). C to the adjacent R is only HALF a wavelength.",
        "applicable_misconceptions": [
            "wavelength_c_to_r"
        ],
        "source": "authored"
    },
    {
        "id": "wb_duck_not_medium",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_basics",
        "syllabus_codes": [
            "6.6.1.1.f"
        ],
        "atoms": [
            "wave_not_medium"
        ],
        "prompt": "A plastic duck floats on a ripple tank. As waves pass, the duck bobs up and down but does not move across the tank. What does this show?",
        "choices": [
            {
                "text": "The wave travels through the water, but the water itself does not travel with the wave"
            },
            {
                "text": "The water moves along with the wave across the tank",
                "misconception_id": "medium_travels_with_wave"
            },
            {
                "text": "Water waves do not transfer energy"
            },
            {
                "text": "The duck is too heavy to be moved by the wave"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "The duck stays put while the wave pattern travels: the WAVE (and its energy) moves through the water; the water itself does not travel with it.",
        "applicable_misconceptions": [
            "medium_travels_with_wave"
        ],
        "source": "authored"
    },
    {
        "id": "wb_duck_transverse",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_basics",
        "syllabus_codes": [
            "6.6.1.1.a"
        ],
        "atoms": [
            "transverse_longitudinal_classify"
        ],
        "prompt": "The duck moves up and down as the waves pass horizontally. Which statement BEST explains how this demonstrates that water waves are transverse?",
        "facility_pct": 3,
        "choices": [
            {
                "text": "The duck oscillates perpendicular to the direction the wave travels"
            },
            {
                "text": "The duck goes up and down, not side to side",
                "misconception_id": "updown_sideways_vague"
            },
            {
                "text": "The duck is perpendicular to the wave",
                "misconception_id": "perpendicular_to_what_missing"
            },
            {
                "text": "The duck moves along with the wave",
                "misconception_id": "medium_travels_with_wave"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "The mark needs the perpendicular RELATION: the oscillation (vertical) is perpendicular to the direction of wave travel (horizontal). 'Up and down, not side to side' scored nothing on the real paper (only 3% gained this mark).",
        "applicable_misconceptions": [
            "updown_sideways_vague",
            "perpendicular_to_what_missing",
            "medium_travels_with_wave"
        ],
        "source": "aqa_ppq:trilogy_2019_p2f_07.2"
    },
    {
        "id": "wb_sound_particles",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_basics",
        "syllabus_codes": [
            "6.6.1.1.f"
        ],
        "atoms": [
            "wave_not_medium"
        ],
        "prompt": "A loudspeaker plays a steady note. Which statement describes the air particles between the loudspeaker and a listener's ear?",
        "choices": [
            {
                "text": "They oscillate back and forth about fixed positions, parallel to the direction the sound travels"
            },
            {
                "text": "They travel with the wave from the loudspeaker to the ear",
                "misconception_id": "medium_travels_with_wave"
            },
            {
                "text": "They oscillate perpendicular to the direction the sound travels",
                "misconception_id": "sound_called_transverse"
            },
            {
                "text": "They stay completely still while the energy passes"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "The particles oscillate back and forth about fixed positions, parallel to the direction the sound travels. The air does not flow from speaker to ear; the wave and its energy do.",
        "applicable_misconceptions": [
            "medium_travels_with_wave",
            "sound_called_transverse"
        ],
        "source": "authored"
    },
    {
        "id": "wp_amplitude_def",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_properties",
        "syllabus_codes": [
            "6.6.1.2.b"
        ],
        "atoms": [
            "amplitude_definition"
        ],
        "prompt": "What is the amplitude of a wave?",
        "choices": [
            {
                "text": "The maximum displacement of a point on the wave from its undisturbed position"
            },
            {
                "text": "The distance from a crest to the next trough, measured vertically",
                "misconception_id": "amplitude_peak_to_trough"
            },
            {
                "text": "The distance from one crest to the next crest"
            },
            {
                "text": "The number of waves passing a point each second"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Amplitude is the maximum displacement of a point on the wave from its undisturbed (rest) position: rest line to crest, NOT crest to trough.",
        "applicable_misconceptions": [
            "amplitude_peak_to_trough"
        ],
        "source": "authored"
    },
    {
        "id": "wp_wavelength_def",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_properties",
        "syllabus_codes": [
            "6.6.1.2.c"
        ],
        "atoms": [
            "wavelength_definition"
        ],
        "prompt": "What is the wavelength of a wave?",
        "choices": [
            {
                "text": "The distance from a point on one wave to the equivalent point on the adjacent wave"
            },
            {
                "text": "The distance from a crest to the adjacent trough",
                "misconception_id": "wavelength_half_marked"
            },
            {
                "text": "The maximum displacement from the undisturbed position"
            },
            {
                "text": "The time taken for one complete wave to pass a point"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Wavelength is the distance from a point on one wave to the EQUIVALENT point on the adjacent wave (crest to crest, or trough to trough).",
        "applicable_misconceptions": [
            "wavelength_half_marked"
        ],
        "source": "authored"
    },
    {
        "id": "wp_frequency_def",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_properties",
        "syllabus_codes": [
            "6.6.1.2.a"
        ],
        "atoms": [
            "frequency_definition"
        ],
        "prompt": "What is the frequency of a wave?",
        "choices": [
            {
                "text": "The number of waves passing a fixed point each second"
            },
            {
                "text": "The time taken for one complete wave to pass a fixed point",
                "misconception_id": "period_frequency_confused"
            },
            {
                "text": "The distance travelled by a wave each second"
            },
            {
                "text": "The maximum displacement of the wave"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Frequency is the number of waves passing a fixed point each second, measured in hertz (Hz).",
        "applicable_misconceptions": [
            "period_frequency_confused"
        ],
        "source": "authored"
    },
    {
        "id": "wp_period_def",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_properties",
        "syllabus_codes": [
            "6.6.1.2.a"
        ],
        "atoms": [
            "period_definition"
        ],
        "prompt": "What is meant by the 'period of a wave'?",
        "facility_pct": 48,
        "choices": [
            {
                "text": "The time taken for one wave to pass a fixed point"
            },
            {
                "text": "The number of waves passing a fixed point each second",
                "misconception_id": "period_frequency_confused"
            },
            {
                "text": "The distance travelled by a wave in one second"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "The period is the TIME for one complete wave to pass a fixed point. (Waves per second is the frequency; they are reciprocals, T = 1/f.)",
        "applicable_misconceptions": [
            "period_frequency_confused"
        ],
        "source": "aqa_ppq:trilogy_2025_p2f_05.3"
    },
    {
        "id": "wp_amplitude_double_spot",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_properties",
        "syllabus_codes": [
            "6.6.1.2.g.i"
        ],
        "atoms": [
            "mark_amplitude_on_diagram"
        ],
        "prompt": "A student draws the arrow shown (crest to trough) and labels it 'amplitude'. What mistake has the student made?",
        "diagram": {
            "kind": "wave_train",
            "params": {
                "cycles": 2.5,
                "distractor": "amplitude_double",
                "mark": {
                    "restLine": true
                }
            }
        },
        "choices": [
            {
                "text": "The arrow shows twice the amplitude; amplitude is from the rest position to a crest"
            },
            {
                "text": "Nothing is wrong; amplitude is from a crest to a trough",
                "misconception_id": "amplitude_peak_to_trough"
            },
            {
                "text": "The arrow should join two crests"
            },
            {
                "text": "The arrow should be horizontal, not vertical"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Crest to trough is TWICE the amplitude. Amplitude is measured from the undisturbed (rest) position to a crest (or to a trough). On the 2019 paper fewer than 10% halved the crest-trough height.",
        "applicable_misconceptions": [
            "amplitude_peak_to_trough"
        ],
        "source": "in_style_of:aqa_trilogy_2019_duck_amplitude"
    },
    {
        "id": "wp_wavelength_half_spot",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_properties",
        "syllabus_codes": [
            "6.6.1.2.g.i"
        ],
        "atoms": [
            "mark_wavelength_on_diagram"
        ],
        "prompt": "A student marks the horizontal distance from a crest to the NEXT TROUGH and labels it 'one wavelength'. What has the student actually marked?",
        "diagram": {
            "kind": "wave_train",
            "params": {
                "cycles": 2.5,
                "distractor": "wavelength_half",
                "mark": {
                    "restLine": true
                }
            }
        },
        "choices": [
            {
                "text": "Half a wavelength"
            },
            {
                "text": "One full wavelength",
                "misconception_id": "wavelength_half_marked"
            },
            {
                "text": "The amplitude"
            },
            {
                "text": "Two wavelengths"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Crest to the adjacent trough is half a cycle, so the student has marked half a wavelength. One wavelength runs crest to crest (or any point to the equivalent point on the next wave).",
        "applicable_misconceptions": [
            "wavelength_half_marked"
        ],
        "source": "authored"
    },
    {
        "id": "wp_mark_wavelength",
        "qtype": "widget",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_properties",
        "syllabus_codes": [
            "6.6.1.2.g.i"
        ],
        "atoms": [
            "mark_wavelength_on_diagram"
        ],
        "prompt": "Drag the two markers to show ONE WAVELENGTH on the wave.",
        "pending_engine": "widget_qtype",
        "widget": {
            "kind": "wave_train",
            "config": {
                "cycles": 3,
                "target": "wavelength"
            }
        },
        "marks": 2,
        "explanation": "Any point to the equivalent point on the adjacent wave: crest to crest is the easiest. Method mark for the right landmarks and orientation; value mark for the right length.",
        "source": "authored"
    },
    {
        "id": "wp_mark_amplitude",
        "qtype": "widget",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_properties",
        "syllabus_codes": [
            "6.6.1.2.g.i"
        ],
        "atoms": [
            "mark_amplitude_on_diagram"
        ],
        "prompt": "Drag the two markers to show the AMPLITUDE of the wave.",
        "pending_engine": "widget_qtype",
        "widget": {
            "kind": "wave_train",
            "config": {
                "cycles": 3,
                "target": "amplitude"
            }
        },
        "marks": 2,
        "explanation": "Rest line to a crest (or rest line to a trough): the maximum displacement from the undisturbed position. Crest-to-trough scores the named error (twice the amplitude).",
        "source": "authored"
    },
    {
        "id": "wp_compare_two_waves",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_properties",
        "syllabus_codes": [
            "6.6.1.2.g.i"
        ],
        "atoms": [
            "compare_two_waves"
        ],
        "prompt": "Two sound waves, A and B, are displayed on the same screen with the same settings. Wave A shows 6 complete waves across the screen; wave B shows 3. Both waves reach the same height above the rest line. Which statement compares the waves correctly?",
        "facility_pct": 45,
        "choices": [
            {
                "text": "Wave A has a higher frequency than B; both have the same amplitude"
            },
            {
                "text": "Wave A has a larger amplitude than B"
            },
            {
                "text": "Wave A has a longer wavelength than B",
                "misconception_id": "freq_wavelength_inverse_missed"
            },
            {
                "text": "Wave A has a longer period than B",
                "misconception_id": "period_frequency_confused"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "More complete cycles in the same time means a higher frequency (and so a shorter wavelength); the same height above the rest line means the same amplitude. On the 2024 paper most one-mark answers got the frequency difference but missed that the amplitudes were equal.",
        "applicable_misconceptions": [
            "freq_wavelength_inverse_missed",
            "period_frequency_confused"
        ],
        "source": "aqa_ppq:trilogy_2024_p2f_03.3"
    },
    {
        "id": "wp_energy_transfer",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "F",
        "topic": "6.6",
        "subtag": "wave_properties",
        "syllabus_codes": [
            "6.6.1.2.e"
        ],
        "atoms": [
            "wave_energy_transfer"
        ],
        "prompt": "What is transferred by sound waves as they travel through the air?",
        "facility_pct": 90,
        "choices": [
            {
                "text": "Energy"
            },
            {
                "text": "Mass",
                "misconception_id": "medium_travels_with_wave"
            },
            {
                "text": "Temperature"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Waves transfer energy (and information) from the source to an absorber. They do not transfer matter.",
        "applicable_misconceptions": [
            "medium_travels_with_wave"
        ],
        "source": "aqa_ppq:trilogy_2024_p2f_03.1"
    },
    {
        "id": "wp_wave_speed_def",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_properties",
        "syllabus_codes": [
            "6.6.1.2.e"
        ],
        "atoms": [
            "wave_energy_transfer"
        ],
        "prompt": "What is meant by the 'wave speed'?",
        "choices": [
            {
                "text": "The speed at which the energy is transferred through the medium"
            },
            {
                "text": "The speed at which the particles of the medium oscillate",
                "misconception_id": "medium_travels_with_wave"
            },
            {
                "text": "The number of waves passing a point each second",
                "misconception_id": "period_frequency_confused"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Wave speed is the speed at which the energy is transferred (the speed the wave moves) through the medium.",
        "applicable_misconceptions": [
            "medium_travels_with_wave",
            "period_frequency_confused"
        ],
        "source": "authored"
    },
    {
        "id": "wp_period_trace",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_properties",
        "syllabus_codes": [
            "6.6.1.2.a"
        ],
        "atoms": [
            "period_from_trace"
        ],
        "prompt": "A microphone displays a sound wave on a screen. The screen shows exactly 2 complete waves in 0.008 s. What is the period of the wave?",
        "facility_pct": 25,
        "choices": [
            {
                "text": "0.004 s"
            },
            {
                "text": "0.008 s"
            },
            {
                "text": "0.002 s"
            },
            {
                "text": "250 s",
                "misconception_id": "period_frequency_confused"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "The period is the time for ONE complete wave: 0.008 / 2 = 0.004 s. On the 2020 paper, equal numbers wrongly read half a cycle (0.002 s) and the whole trace (0.008 s).",
        "applicable_misconceptions": [
            "period_frequency_confused"
        ],
        "source": "in_style_of:aqa_ppq:trilogy_2020_p2f_05.5"
    },
    {
        "id": "wc_equation_recall",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_calculations",
        "syllabus_codes": [
            "6.6.1.2.f"
        ],
        "atoms": [
            "wave_equation_recall"
        ],
        "prompt": "Which equation links wave speed (v), frequency (f) and wavelength (lambda)?",
        "equation_sheet": "must_recall",
        "facility_pct": 22,
        "choices": [
            {
                "text": "wave speed = frequency x wavelength"
            },
            {
                "text": "frequency = wave speed x wavelength",
                "misconception_id": "wave_equation_inverted"
            },
            {
                "text": "wavelength = frequency x wave speed",
                "misconception_id": "wave_equation_inverted"
            },
            {
                "text": "wave speed = frequency + wavelength"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "v = f x lambda. With no equation sheet only 22% recalled it (2019 Foundation); when AQA prints the sheet, 90%+ select it. The wrong builds usually follow the word order of the stem.",
        "applicable_misconceptions": [
            "wave_equation_inverted"
        ],
        "source": "aqa_ppq:trilogy_2019_p2f_06.4"
    },
    {
        "id": "wc_wave_speed_calc",
        "qtype": "calc_workings",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_calculations",
        "syllabus_codes": [
            "6.6.1.2.f"
        ],
        "atoms": [
            "wave_speed_calc"
        ],
        "prompt": "A wave has a frequency of 1650 Hz and a wavelength of 0.200 m. Calculate the wave speed. Use the equation: wave speed = frequency x wavelength (v = f L).",
        "equation_sheet": "from_insert",
        "facility_pct": 93,
        "calc": {
            "knowns": {
                "f": 1650,
                "L": 0.2
            },
            "unknown": "v",
            "expectedFinalValue": 330,
            "expectedUnit": [
                "m/s"
            ],
            "equationCanonicalForms": [
                "v=f*L",
                "v=fL"
            ],
            "tolerance": 0.5,
            "requireUnit": true,
            "marks": 4
        },
        "marks": 4,
        "explanation": "v = f x lambda = 1650 x 0.200 = 330 m/s (the speed of sound in air).",
        "source": "aqa_ppq:trilogy_2020_p2f_05.4"
    },
    {
        "id": "wc_wavelength_calc",
        "qtype": "calc_workings",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_calculations",
        "syllabus_codes": [
            "6.6.1.2.f"
        ],
        "atoms": [
            "wave_speed_calc"
        ],
        "prompt": "A wave on a string has a frequency of 45.0 Hz. The wave speed is 35.1 m/s. Calculate the wavelength of the wave. (v = f L)",
        "equation_sheet": "from_insert",
        "facility_pct": 90,
        "calc": {
            "knowns": {
                "v": 35.1,
                "f": 45
            },
            "unknown": "L",
            "expectedFinalValue": 0.78,
            "expectedUnit": [
                "m"
            ],
            "equationCanonicalForms": [
                "L=v/f",
                "v=f*L"
            ],
            "tolerance": 0.005,
            "requireUnit": true,
            "marks": 4
        },
        "marks": 4,
        "explanation": "Rearrange v = f lambda to lambda = v / f = 35.1 / 45.0 = 0.78 m. Multiplying instead of dividing was the standard zero-mark route on this paper.",
        "source": "aqa_ppq:trilogy_2024_p2h_01.3"
    },
    {
        "id": "wc_frequency_calc",
        "qtype": "calc_workings",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_calculations",
        "syllabus_codes": [
            "6.6.1.2.f"
        ],
        "atoms": [
            "wave_speed_calc"
        ],
        "prompt": "Electromagnetic waves have a wavelength of 0.125 m. The speed of electromagnetic waves is 300000000 m/s. Calculate the frequency of the waves. (v = f L)",
        "equation_sheet": "from_insert",
        "facility_pct": 52,
        "calc": {
            "knowns": {
                "v": 300000000,
                "L": 0.125
            },
            "unknown": "f",
            "expectedFinalValue": 2400000000,
            "expectedUnit": [
                "Hz",
                "hertz"
            ],
            "equationCanonicalForms": [
                "f=v/L",
                "v=f*L"
            ],
            "tolerance": 1000000,
            "requireUnit": true,
            "marks": 4
        },
        "marks": 4,
        "explanation": "f = v / lambda = 300000000 / 0.125 = 2400000000 Hz (2.4 GHz). The classic error is the reciprocal: dividing the wrong way round gives 4.2 x 10^-10.",
        "source": "aqa_ppq:trilogy_2019_p2h_01.5"
    },
    {
        "id": "wc_period_calc",
        "qtype": "calc_workings",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_calculations",
        "syllabus_codes": [
            "6.6.1.2.d"
        ],
        "atoms": [
            "period_frequency_calc"
        ],
        "prompt": "Water waves in a ripple tank have a frequency of 20 Hz. Calculate the period of the waves. Use the equation: period = 1 / frequency (T = 1/f).",
        "equation_sheet": "from_insert",
        "facility_pct": 85,
        "calc": {
            "knowns": {
                "f": 20
            },
            "unknown": "T",
            "expectedFinalValue": 0.05,
            "expectedUnit": [
                "s",
                "seconds",
                "second"
            ],
            "equationCanonicalForms": [
                "T=1/f"
            ],
            "tolerance": 0.001,
            "requireUnit": true,
            "marks": 4
        },
        "marks": 4,
        "explanation": "T = 1/f = 1/20 = 0.05 s. (T = 1/f is on every equation sheet, including the minimal pre-Covid insert: always given.)",
        "source": "aqa_ppq:trilogy_2021_p2f_04.4"
    },
    {
        "id": "wc_freq_from_period",
        "qtype": "calc_workings",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_calculations",
        "syllabus_codes": [
            "6.6.1.2.d"
        ],
        "atoms": [
            "period_frequency_calc"
        ],
        "prompt": "A sound wave has a period of 0.004 s. Calculate the frequency of the wave. (f = 1/T)",
        "equation_sheet": "from_insert",
        "calc": {
            "knowns": {
                "T": 0.004
            },
            "unknown": "f",
            "expectedFinalValue": 250,
            "expectedUnit": [
                "Hz",
                "hertz"
            ],
            "equationCanonicalForms": [
                "f=1/T"
            ],
            "tolerance": 0.5,
            "requireUnit": true,
            "marks": 4
        },
        "marks": 4,
        "explanation": "f = 1/T = 1/0.004 = 250 Hz. On the 2020 paper this part allowed full ECF from a wrongly-read period: the bank's cleanest from_previous_part exemplar.",
        "source": "in_style_of:aqa_ppq:trilogy_2020_p2f_05.6"
    },
    {
        "id": "wc_period_khz_mcq",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_calculations",
        "syllabus_codes": [
            "6.6.1.2.d"
        ],
        "atoms": [
            "period_frequency_calc"
        ],
        "prompt": "A sound wave has a frequency of 4.0 kHz. What is the period of the wave?",
        "equation_sheet": "from_insert",
        "interim_for": "calc_prefix",
        "facility_pct": 10,
        "choices": [
            {
                "text": "0.00025 s"
            },
            {
                "text": "0.25 s",
                "misconception_id": "prefix_not_converted"
            },
            {
                "text": "4000 s",
                "misconception_id": "reciprocal_not_taken"
            },
            {
                "text": "0.0025 s",
                "misconception_id": "power_of_ten_evaluation_error"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Convert first: 4.0 kHz = 4000 Hz. T = 1/f = 1/4000 = 0.00025 s. On the real paper only 5% of Foundation students converted; 1/4.0 = 0.25 s was the standard wrong answer, and the unit mark was rarely earned.",
        "applicable_misconceptions": [
            "prefix_not_converted",
            "reciprocal_not_taken",
            "power_of_ten_evaluation_error"
        ],
        "source": "aqa_ppq:trilogy_2022_p2h_01.2"
    },
    {
        "id": "wc_period_ghz_mcq",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_calculations",
        "syllabus_codes": [
            "6.6.1.2.d"
        ],
        "atoms": [
            "period_frequency_calc"
        ],
        "prompt": "Data is transmitted to satellites by electromagnetic waves with a frequency of 48 GHz. What is the period of the waves?",
        "equation_sheet": "from_insert",
        "interim_for": "calc_prefix",
        "choices": [
            {
                "text": "2.1 x 10^-11 s"
            },
            {
                "text": "0.021 s",
                "misconception_id": "prefix_not_converted"
            },
            {
                "text": "48 s",
                "misconception_id": "reciprocal_not_taken"
            },
            {
                "text": "2.1 x 10^-8 s",
                "misconception_id": "power_of_ten_evaluation_error"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "48 GHz = 4.8 x 10^10 Hz. T = 1/f = 1/(4.8 x 10^10) = 2.1 x 10^-11 s. The real paper saw '1/48 = 48' (the value handed back) and unconverted 1/48 = 0.021 s.",
        "applicable_misconceptions": [
            "prefix_not_converted",
            "reciprocal_not_taken",
            "power_of_ten_evaluation_error"
        ],
        "source": "aqa_ppq:trilogy_2025_p2f_05.4"
    },
    {
        "id": "wc_nm_output_mcq",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "wave_calculations",
        "syllabus_codes": [
            "6.6.1.2.f"
        ],
        "atoms": [
            "wave_speed_calc"
        ],
        "prompt": "A wave of visible light has a frequency of 6.25 x 10^14 Hz. The speed of light is 3.00 x 10^8 m/s. What is the wavelength of this light in nanometres (nm)?",
        "equation_sheet": "from_insert",
        "interim_for": "calc_prefix",
        "facility_pct": 10,
        "choices": [
            {
                "text": "480 nm"
            },
            {
                "text": "4.8 x 10^-16 nm",
                "misconception_id": "prefix_not_converted"
            },
            {
                "text": "4.8 x 10^21 nm",
                "misconception_id": "power_of_ten_evaluation_error"
            },
            {
                "text": "0.48 nm",
                "misconception_id": "prefix_not_converted"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "lambda = v/f = (3.00 x 10^8)/(6.25 x 10^14) = 4.8 x 10^-7 m. To nanometres DIVIDE by 10^-9: 480 nm. Under 10% managed this on the 2025 paper; multiplying by 10^-9, and reading nano as 10^-3 or 10^-6, were the named failures.",
        "applicable_misconceptions": [
            "prefix_not_converted",
            "power_of_ten_evaluation_error"
        ],
        "source": "aqa_ppq:trilogy_2025_p2h_03.4"
    },
    {
        "id": "wc_depth_wavelength",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "wave_calculations",
        "syllabus_codes": [
            "6.6.1.2.f"
        ],
        "atoms": [
            "wave_equation_qualitative"
        ],
        "prompt": "In a ripple tank, the deeper the water, the faster the waves travel. The frequency of the waves is kept constant. What happens to the wavelength of the waves in deeper water?",
        "facility_pct": 20,
        "choices": [
            {
                "text": "The wavelength increases"
            },
            {
                "text": "The wavelength decreases"
            },
            {
                "text": "The wavelength stays the same and the frequency increases",
                "misconception_id": "boundary_frequency_not_constant"
            },
            {
                "text": "The wavelength stays the same"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "v = f lambda with f fixed: if v goes up, lambda must go up in proportion. Under 20% scored on the real item; most ignored the given speed-depth fact or let the frequency change.",
        "applicable_misconceptions": [
            "boundary_frequency_not_constant"
        ],
        "source": "aqa_ppq:trilogy_2021_p2h_03.4"
    },
    {
        "id": "wc_speed_time_qual",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_calculations",
        "syllabus_codes": [
            "6.6.1.2.f"
        ],
        "atoms": [
            "wave_equation_qualitative"
        ],
        "prompt": "The warmer the air, the faster sound travels through it. A device emits a sound that travels a fixed distance to a farmer. What happens to the time taken for the sound to reach the farmer on a warmer day?",
        "facility_pct": 25,
        "choices": [
            {
                "text": "The time decreases"
            },
            {
                "text": "The time increases",
                "misconception_id": "faster_means_longer_time"
            },
            {
                "text": "The time stays the same"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Same distance, higher speed, LESS time. On the 2023 paper many students stated the speed increases and then said the time would increase too: the speed-time inversion is the trap.",
        "applicable_misconceptions": [
            "faster_means_longer_time"
        ],
        "source": "aqa_ppq:trilogy_2023_p2f_04.6"
    },
    {
        "id": "wc_graph_prep_wavelength",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_calculations",
        "syllabus_codes": [
            "6.6.1.2.f"
        ],
        "atoms": [
            "wave_speed_calc"
        ],
        "prompt": "A graph shows how the speed of sound varies with air temperature. At 28.0 degrees C the graph shows a speed of 348 m/s. A sound wave with a frequency of 300 Hz travels through air at 28.0 degrees C. Determine the wavelength of the sound wave. (v = f L)",
        "equation_sheet": "from_insert",
        "difficulty": "d2",
        "facility_pct": 20,
        "marks": 4,
        "choices": [
            {
                "text": "1.16 m"
            },
            {
                "text": "348 m",
                "misconception_id": "graph_readoff_left_as_answer",
                "failsAt": "stage2 skipped: the graph read-off submitted as the final answer"
            },
            {
                "text": "8400 m",
                "misconception_id": "stem_numbers_multiplied",
                "failsAt": "no graph read: multiplied 300 by 28"
            },
            {
                "text": "0.862 m",
                "misconception_id": "wave_equation_inverted",
                "failsAt": "stage2: divided f by v"
            }
        ],
        "answerIndex": 0,
        "calc": {
            "markCategories": [
                "other_skill",
                "substitution",
                "rearrangement",
                "evaluation"
            ],
            "stages": [
                {
                    "equation": "graph_read",
                    "knowns": {},
                    "unknown": "v",
                    "expectedFinalValue": 348,
                    "expectedUnit": [
                        "m/s"
                    ],
                    "markScheme": [
                        {
                            "mark": 1,
                            "category": "other_skill",
                            "text": "v read from the graph at 28.0 C = 348 m/s"
                        }
                    ]
                },
                {
                    "equation": "v=f*L",
                    "knowns": {
                        "v": 348,
                        "f": 300
                    },
                    "unknown": "L",
                    "expectedFinalValue": 1.16,
                    "expectedUnit": [
                        "m"
                    ],
                    "gate": {
                        "kind": "from_previous_part"
                    },
                    "markScheme": [
                        {
                            "mark": 2,
                            "category": "substitution",
                            "text": "348 = 300 x L"
                        },
                        {
                            "mark": 3,
                            "category": "rearrangement",
                            "text": "L = 348 / 300"
                        },
                        {
                            "mark": 4,
                            "category": "evaluation",
                            "text": "L = 1.16 (m)"
                        }
                    ]
                }
            ]
        },
        "explanation": "Tier-2 prep-step calc (d038): read v = 348 m/s off the graph, THEN lambda = v/f = 348/300 = 1.16 m. The two named failures from the real paper: writing the graph value (348) as the final answer, and multiplying the two stem numbers (300 x 28).",
        "applicable_misconceptions": [
            "graph_readoff_left_as_answer",
            "stem_numbers_multiplied",
            "wave_equation_inverted"
        ],
        "source": "aqa_ppq:trilogy_2022_p2f_06.4"
    },
    {
        "id": "wc_mean_speed_chain",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "wave_calculations",
        "syllabus_codes": [
            "6.6.1.2.f"
        ],
        "atoms": [
            "wave_speed_calc"
        ],
        "prompt": "A student measures waves in a ripple tank. Frequency readings: 9.8 Hz, 9.4 Hz, 9.3 Hz. Wavelength readings: 1.7 cm, 2.2 cm, 2.1 cm. Determine the mean wave speed in m/s. (v = f L)",
        "equation_sheet": "from_insert",
        "difficulty": "d3",
        "facility_pct": 5,
        "marks": 4,
        "choices": [
            {
                "text": "0.19 m/s"
            },
            {
                "text": "19 m/s",
                "misconception_id": "prefix_not_converted",
                "failsAt": "stage2: wavelength left in cm"
            },
            {
                "text": "0.17 m/s",
                "misconception_id": "mean_across_different_quantities",
                "failsAt": "stage1: used the first readings only, no means"
            },
            {
                "text": "9.5 m/s",
                "misconception_id": "chain_intermediate_as_final",
                "failsAt": "stopped after the mean frequency"
            }
        ],
        "answerIndex": 0,
        "calc": {
            "markCategories": [
                "other_skill",
                "other_skill",
                "prefix_conv",
                "evaluation"
            ],
            "stages": [
                {
                    "equation": "mean",
                    "knowns": {},
                    "unknown": "f",
                    "expectedFinalValue": 9.5,
                    "expectedUnit": [
                        "Hz"
                    ],
                    "markScheme": [
                        {
                            "mark": 1,
                            "category": "other_skill",
                            "text": "mean f = 9.5 Hz"
                        }
                    ]
                },
                {
                    "equation": "mean",
                    "knowns": {},
                    "unknown": "L",
                    "expectedFinalValue": 0.02,
                    "expectedUnit": [
                        "m"
                    ],
                    "markScheme": [
                        {
                            "mark": 2,
                            "category": "other_skill",
                            "text": "mean lambda = 2.0 cm"
                        },
                        {
                            "mark": 3,
                            "category": "prefix_conv",
                            "text": "= 0.020 m"
                        }
                    ]
                },
                {
                    "equation": "v=f*L",
                    "knowns": {
                        "f": 9.5,
                        "L": 0.02
                    },
                    "unknown": "v",
                    "expectedFinalValue": 0.19,
                    "expectedUnit": [
                        "m/s"
                    ],
                    "gate": {
                        "kind": "from_previous_part"
                    },
                    "markScheme": [
                        {
                            "mark": 4,
                            "category": "evaluation",
                            "text": "v = 9.5 x 0.020 = 0.19 m/s"
                        }
                    ]
                }
            ]
        },
        "explanation": "Mean f = (9.8+9.4+9.3)/3 = 9.5 Hz. Mean lambda = (1.7+2.2+2.1)/3 = 2.0 cm = 0.020 m. v = 9.5 x 0.020 = 0.19 m/s. Only ~5% converted the centimetres on the real paper.",
        "applicable_misconceptions": [
            "prefix_not_converted",
            "mean_across_different_quantities",
            "chain_intermediate_as_final"
        ],
        "source": "aqa_ppq:trilogy_2021_p2h_03.2"
    },
    {
        "id": "wc_chain_travelling",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "wave_calculations",
        "syllabus_codes": [
            "6.6.1.2.f"
        ],
        "atoms": [
            "chained_wave_calc"
        ],
        "prompt": "A loudspeaker emits sound with a frequency of 170 Hz and a wavelength of 2.0 m. How long does the sound take to reach a cliff 680 m away? Use v = f L and v = d/t.",
        "equation_sheet": "from_insert",
        "difficulty": "d2",
        "facility_pct": null,
        "marks": 5,
        "choices": [
            {
                "text": "2.0 s"
            },
            {
                "text": "340 s",
                "misconception_id": "chain_intermediate_as_final",
                "failsAt": "stopped at stage 1 and gave the speed as the time"
            },
            {
                "text": "4.0 s",
                "misconception_id": "chain_prep_stage_skipped",
                "failsAt": "stage1 skipped: divided 680 by the frequency 170"
            },
            {
                "text": "0.5 s",
                "misconception_id": "wrong_formula_rearrangement",
                "failsAt": "stage2: divided v by d"
            }
        ],
        "answerIndex": 0,
        "calc": {
            "markCategories": [
                "substitution",
                "non_final_evaluation",
                "substitution",
                "rearrangement",
                "evaluation"
            ],
            "stages": [
                {
                    "equation": "v=f*L",
                    "knowns": {
                        "f": 170,
                        "L": 2
                    },
                    "unknown": "v",
                    "expectedFinalValue": 340,
                    "expectedUnit": [
                        "m/s"
                    ],
                    "markScheme": [
                        {
                            "mark": 1,
                            "category": "substitution",
                            "text": "v = 170 x 2.0"
                        },
                        {
                            "mark": 2,
                            "category": "non_final_evaluation",
                            "text": "v = 340 (m/s)"
                        }
                    ]
                },
                {
                    "equation": "v=d/t",
                    "knowns": {
                        "d": 680,
                        "v": 340
                    },
                    "unknown": "t",
                    "expectedFinalValue": 2,
                    "expectedUnit": [
                        "s"
                    ],
                    "gate": {
                        "kind": "from_previous_part"
                    },
                    "markScheme": [
                        {
                            "mark": 3,
                            "category": "substitution",
                            "text": "340 = 680 / t"
                        },
                        {
                            "mark": 4,
                            "category": "rearrangement",
                            "text": "t = 680 / 340"
                        },
                        {
                            "mark": 5,
                            "category": "evaluation",
                            "text": "t = 2.0 (s)"
                        }
                    ]
                }
            ]
        },
        "explanation": "Stage 1: v = f lambda = 170 x 2.0 = 340 m/s. Stage 2: t = d/v = 680/340 = 2.0 s. The d037 catalogue's L5 'travelling waves' chain, barely asked in the papers so far: gap-pass coverage.",
        "applicable_misconceptions": [
            "chain_intermediate_as_final",
            "chain_prep_stage_skipped",
            "wrong_formula_rearrangement"
        ],
        "source": "in_style_of:d037_travelling_waves_L5"
    },
    {
        "id": "wc_chain_period_first",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "wave_calculations",
        "syllabus_codes": [
            "6.6.1.2.d"
        ],
        "atoms": [
            "chained_wave_calc"
        ],
        "prompt": "A sound wave has a period of 0.0025 s and a wavelength of 0.85 m. How long does the sound take to travel 1020 m? Use f = 1/T, v = f L and v = d/t.",
        "equation_sheet": "from_insert",
        "difficulty": "d3",
        "facility_pct": null,
        "marks": 6,
        "choices": [
            {
                "text": "3.0 s"
            },
            {
                "text": "340 s",
                "misconception_id": "chain_intermediate_as_final",
                "failsAt": "stopped at stage 2 and gave the speed as the time"
            },
            {
                "text": "2.55 s",
                "misconception_id": "chain_prep_stage_skipped",
                "failsAt": "stages 1-2 skipped: multiplied 1020 by the period"
            },
            {
                "text": "1200 s",
                "misconception_id": "stem_numbers_multiplied",
                "failsAt": "divided 1020 by 0.85, ignoring the time formulae"
            }
        ],
        "answerIndex": 0,
        "calc": {
            "markCategories": [
                "substitution",
                "non_final_evaluation",
                "substitution",
                "non_final_evaluation",
                "rearrangement",
                "evaluation"
            ],
            "stages": [
                {
                    "equation": "f=1/T",
                    "knowns": {
                        "T": 0.0025
                    },
                    "unknown": "f",
                    "expectedFinalValue": 400,
                    "expectedUnit": [
                        "Hz"
                    ],
                    "markScheme": [
                        {
                            "mark": 1,
                            "category": "substitution",
                            "text": "f = 1 / 0.0025"
                        },
                        {
                            "mark": 2,
                            "category": "non_final_evaluation",
                            "text": "f = 400 (Hz)"
                        }
                    ]
                },
                {
                    "equation": "v=f*L",
                    "knowns": {
                        "f": 400,
                        "L": 0.85
                    },
                    "unknown": "v",
                    "expectedFinalValue": 340,
                    "expectedUnit": [
                        "m/s"
                    ],
                    "gate": {
                        "kind": "from_previous_part"
                    },
                    "markScheme": [
                        {
                            "mark": 3,
                            "category": "substitution",
                            "text": "v = 400 x 0.85"
                        },
                        {
                            "mark": 4,
                            "category": "non_final_evaluation",
                            "text": "v = 340 (m/s)"
                        }
                    ]
                },
                {
                    "equation": "v=d/t",
                    "knowns": {
                        "d": 1020,
                        "v": 340
                    },
                    "unknown": "t",
                    "expectedFinalValue": 3,
                    "expectedUnit": [
                        "s"
                    ],
                    "gate": {
                        "kind": "from_previous_part"
                    },
                    "markScheme": [
                        {
                            "mark": 5,
                            "category": "rearrangement",
                            "text": "t = 1020 / 340"
                        },
                        {
                            "mark": 6,
                            "category": "evaluation",
                            "text": "t = 3.0 (s)"
                        }
                    ]
                }
            ]
        },
        "explanation": "Stage 1: f = 1/0.0025 = 400 Hz. Stage 2: v = 400 x 0.85 = 340 m/s. Stage 3: t = 1020/340 = 3.0 s. The full d037 three-formula waves chain.",
        "applicable_misconceptions": [
            "chain_intermediate_as_final",
            "chain_prep_stage_skipped",
            "stem_numbers_multiplied"
        ],
        "source": "in_style_of:d037_travelling_waves_with_period_L4"
    },
    {
        "id": "wc_chain_echo_clap",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_calculations",
        "syllabus_codes": [
            "6.6.1.2.g.ii.i"
        ],
        "atoms": [
            "echo_distance_doubling"
        ],
        "prompt": "A student stands 85 m from a large wall, claps two bricks together, and measures 0.50 s between the clap and the echo. Calculate the speed of sound. Use v = d/t.",
        "equation_sheet": "must_recall",
        "difficulty": "d2",
        "facility_pct": null,
        "marks": 4,
        "choices": [
            {
                "text": "340 m/s"
            },
            {
                "text": "170 m/s",
                "misconception_id": "echo_factor_two_missed",
                "failsAt": "stage1: used 85 m one-way, not there-and-back"
            },
            {
                "text": "42.5 m/s",
                "misconception_id": "stem_numbers_multiplied",
                "failsAt": "multiplied 85 by 0.50"
            },
            {
                "text": "0.0059 m/s",
                "misconception_id": "wrong_formula_rearrangement",
                "failsAt": "stage2: divided t by d"
            }
        ],
        "answerIndex": 0,
        "calc": {
            "markCategories": [
                "substitution",
                "non_final_evaluation",
                "substitution",
                "evaluation"
            ],
            "stages": [
                {
                    "equation": "d=2x",
                    "knowns": {
                        "x": 85
                    },
                    "unknown": "d",
                    "expectedFinalValue": 170,
                    "expectedUnit": [
                        "m"
                    ],
                    "markScheme": [
                        {
                            "mark": 1,
                            "category": "substitution",
                            "text": "distance = 2 x 85"
                        },
                        {
                            "mark": 2,
                            "category": "non_final_evaluation",
                            "text": "d = 170 (m)"
                        }
                    ]
                },
                {
                    "equation": "v=d/t",
                    "knowns": {
                        "d": 170,
                        "t": 0.5
                    },
                    "unknown": "v",
                    "expectedFinalValue": 340,
                    "expectedUnit": [
                        "m/s"
                    ],
                    "gate": {
                        "kind": "from_previous_part"
                    },
                    "markScheme": [
                        {
                            "mark": 3,
                            "category": "substitution",
                            "text": "v = 170 / 0.50"
                        },
                        {
                            "mark": 4,
                            "category": "evaluation",
                            "text": "v = 340 (m/s)"
                        }
                    ]
                }
            ]
        },
        "explanation": "The sound goes there AND back: d = 2 x 85 = 170 m. v = d/t = 170/0.50 = 340 m/s. Forgetting the doubling gives 170 m/s, the named echo error (and the widget errorCode).",
        "applicable_misconceptions": [
            "echo_factor_two_missed",
            "stem_numbers_multiplied",
            "wrong_formula_rearrangement"
        ],
        "source": "in_style_of:d037_echoes_L5+aqa_trilogy_2018_p2f_02.3"
    },
    {
        "id": "wc_chain_radar",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "wave_calculations",
        "syllabus_codes": [
            "6.6.1.2.f"
        ],
        "atoms": [
            "echo_distance_doubling"
        ],
        "prompt": "A radar pulse (an electromagnetic wave, speed 3.0 x 10^8 m/s) is sent towards an aircraft. The reflected pulse returns 1.2 x 10^-4 s after transmission. How far away is the aircraft? Use v = d/t.",
        "equation_sheet": "must_recall",
        "difficulty": "d3",
        "facility_pct": null,
        "marks": 4,
        "choices": [
            {
                "text": "18000 m"
            },
            {
                "text": "36000 m",
                "misconception_id": "echo_factor_two_missed",
                "failsAt": "stage2: forgot the pulse travelled there and back"
            },
            {
                "text": "1800 m",
                "misconception_id": "power_of_ten_evaluation_error",
                "failsAt": "stage1: power-of-ten slip in the standard-form product"
            },
            {
                "text": "4.0 x 10^-13 m",
                "misconception_id": "wrong_formula_rearrangement",
                "failsAt": "stage1: divided t by v"
            }
        ],
        "answerIndex": 0,
        "calc": {
            "markCategories": [
                "substitution",
                "non_final_evaluation",
                "substitution",
                "evaluation"
            ],
            "stages": [
                {
                    "equation": "d=v*t",
                    "knowns": {
                        "v": 300000000,
                        "t": 0.00012
                    },
                    "unknown": "d",
                    "expectedFinalValue": 36000,
                    "expectedUnit": [
                        "m"
                    ],
                    "markScheme": [
                        {
                            "mark": 1,
                            "category": "substitution",
                            "text": "d = 3.0 x 10^8 x 1.2 x 10^-4"
                        },
                        {
                            "mark": 2,
                            "category": "non_final_evaluation",
                            "text": "total path = 36000 (m)"
                        }
                    ]
                },
                {
                    "equation": "x=d/2",
                    "knowns": {
                        "d": 36000
                    },
                    "unknown": "x",
                    "expectedFinalValue": 18000,
                    "expectedUnit": [
                        "m"
                    ],
                    "gate": {
                        "kind": "from_previous_part"
                    },
                    "markScheme": [
                        {
                            "mark": 3,
                            "category": "substitution",
                            "text": "distance = 36000 / 2"
                        },
                        {
                            "mark": 4,
                            "category": "evaluation",
                            "text": "x = 18000 (m)"
                        }
                    ]
                }
            ]
        },
        "explanation": "Total path = v x t = 3.0 x 10^8 x 1.2 x 10^-4 = 36000 m, which is there AND back. Distance to the aircraft = 36000/2 = 18000 m (18 km). Radar is the d037 echoes chain in a Trilogy-safe EM frame (d043 OQ-B).",
        "applicable_misconceptions": [
            "echo_factor_two_missed",
            "power_of_ten_evaluation_error",
            "wrong_formula_rearrangement"
        ],
        "source": "in_style_of:d037_echoes_L5_radar"
    },
    {
        "id": "wm_ripple_method_claims",
        "qtype": "level_of_response_6",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_measurement",
        "syllabus_codes": [
            "6.6.1.2.i.iA"
        ],
        "atoms": [
            "ripple_tank_method"
        ],
        "prompt": "Describe how the ripple tank can be used to measure the wavelength, frequency and speed of water waves. Tick the statements that belong in a good method.",
        "facility_pct": 10,
        "diagram": {
            "kind": "ripple_tank",
            "params": {}
        },
        "marks": 3,
        "lor": {
            "points": [
                {
                    "text": "Read the frequency from the signal generator, or count the waves passing a point in a known time",
                    "creditworthy": true
                },
                {
                    "text": "Photograph or freeze the shadow pattern and measure across several wavelengths with a ruler, then divide by the number of wavelengths",
                    "creditworthy": true
                },
                {
                    "text": "Calculate the wave speed using v = f x lambda",
                    "creditworthy": true
                },
                {
                    "text": "Explain what the lamp, motor and screen are each for",
                    "creditworthy": false,
                    "misconception_id": "apparatus_described_not_method"
                },
                {
                    "text": "Time how long a wave takes, without measuring any distance",
                    "creditworthy": false,
                    "misconception_id": "measurement_purpose_missing"
                }
            ]
        },
        "explanation": "The method is measurements and what is done with them: frequency from the signal generator (or counting waves per second), wavelength measured across SEVERAL spacings on the screen shadow and divided, then v = f x lambda. Describing what each part of the apparatus is for scored nothing on the real papers.",
        "applicable_misconceptions": [
            "apparatus_described_not_method",
            "measurement_purpose_missing"
        ],
        "source": "aqa_ppq:trilogy_2019_p2h_02.1"
    },
    {
        "id": "wm_several_wavelengths_why",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_measurement",
        "syllabus_codes": [
            "6.6.1.2.i.iA"
        ],
        "atoms": [
            "several_wavelengths_measured"
        ],
        "prompt": "When measuring wavelength on a ripple-tank image, why is it better to measure across several wavelengths and divide, rather than measure a single wavelength?",
        "facility_pct": 25,
        "choices": [
            {
                "text": "The measurement error becomes a smaller fraction of the distance measured"
            },
            {
                "text": "Measuring one wavelength is just as accurate",
                "misconception_id": "single_wavelength_measured"
            },
            {
                "text": "It increases the frequency of the waves"
            },
            {
                "text": "It gives the mean of the frequency readings",
                "misconception_id": "mean_across_different_quantities"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "One spacing is small, so the ruler's measurement error is a large fraction of it. Measuring across several and dividing shares that error out, reducing its effect.",
        "applicable_misconceptions": [
            "single_wavelength_measured",
            "mean_across_different_quantities"
        ],
        "source": "aqa_ppq:trilogy_2023_p2h_03.1"
    },
    {
        "id": "wm_scale_factor",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "wave_measurement",
        "syllabus_codes": [
            "6.6.1.2.i.iA"
        ],
        "atoms": [
            "several_wavelengths_measured"
        ],
        "prompt": "On a printed figure of a ripple-tank shadow, a student measures 24 mm across 4 complete wavelengths. 1.0 mm on the figure represents 5.0 mm on the real screen. What is the wavelength on the screen?",
        "marks": 3,
        "choices": [
            {
                "text": "30 mm"
            },
            {
                "text": "120 mm"
            },
            {
                "text": "6.0 mm",
                "misconception_id": "graph_scale_misread"
            },
            {
                "text": "1.2 mm"
            }
        ],
        "answerIndex": 0,
        "explanation": "Figure wavelength = 24/4 = 6.0 mm; on the screen that is 6.0 x 5.0 = 30 mm. The majority on the real item measured ONE wavelength and multiplied by 5: measure across several, divide, THEN scale.",
        "applicable_misconceptions": [
            "graph_scale_misread"
        ],
        "source": "in_style_of:aqa_ppq:trilogy_2023_p2h_03.1"
    },
    {
        "id": "wm_string_method_claims",
        "qtype": "level_of_response_6",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_measurement",
        "syllabus_codes": [
            "6.6.1.2.i.iB"
        ],
        "atoms": [
            "string_standing_wave_method"
        ],
        "prompt": "A string is stretched between a vibration generator and a pulley with hanging masses. Describe a method to investigate how the frequency of the wave affects the wavelength. Tick the statements that belong in a good method.",
        "facility_pct": 10,
        "diagram": {
            "kind": "standing_wave",
            "params": {
                "loops": 3
            }
        },
        "marks": 3,
        "lor": {
            "points": [
                {
                    "text": "Change the frequency using the signal generator, taking readings at several different frequencies",
                    "creditworthy": true
                },
                {
                    "text": "Measure the length of several loops with a ruler and use: one loop = half a wavelength",
                    "creditworthy": true
                },
                {
                    "text": "Keep the same masses on the pulley so the tension does not change",
                    "creditworthy": true
                },
                {
                    "text": "Describe the vibration generator, the pulley and the masses shown in the figure",
                    "creditworthy": false,
                    "misconception_id": "apparatus_described_not_method"
                },
                {
                    "text": "Time how long the standing wave takes to travel along the string",
                    "creditworthy": false,
                    "misconception_id": "measurement_purpose_missing"
                }
            ]
        },
        "explanation": "Change the frequency on the signal generator; at each frequency get a clear standing wave, measure across several loops and use loop length = half a wavelength; keep the masses (tension) the same. On the 2024 papers most students described the picture of the apparatus and scored nothing.",
        "applicable_misconceptions": [
            "apparatus_described_not_method",
            "measurement_purpose_missing"
        ],
        "source": "aqa_ppq:trilogy_2024_p2h_01.1"
    },
    {
        "id": "wm_standing_nodes",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_measurement",
        "syllabus_codes": [
            "6.6.1.2.i.iB"
        ],
        "atoms": [
            "string_standing_wave_method"
        ],
        "prompt": "The string shows a standing wave with 4 loops. How many NODES (points that do not move) are there, including the two ends?",
        "diagram": {
            "kind": "standing_wave",
            "params": {
                "loops": 4
            }
        },
        "choices": [
            {
                "text": "5"
            },
            {
                "text": "4",
                "misconception_id": "counted_loops_not_nodes"
            },
            {
                "text": "3"
            },
            {
                "text": "8"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Nodes sit at both ends and between every pair of loops: nodes = loops + 1 = 5. Counting the loops themselves as the nodes is the named error.",
        "applicable_misconceptions": [
            "counted_loops_not_nodes"
        ],
        "source": "authored"
    },
    {
        "id": "wm_standing_wavelength",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "wave_measurement",
        "syllabus_codes": [
            "6.6.1.2.i.iB"
        ],
        "atoms": [
            "string_standing_wave_method"
        ],
        "prompt": "A standing wave with 4 loops forms on a string 2.0 m long. What is the wavelength of the wave?",
        "diagram": {
            "kind": "standing_wave",
            "params": {
                "loops": 4
            }
        },
        "choices": [
            {
                "text": "1.0 m"
            },
            {
                "text": "0.50 m",
                "misconception_id": "wavelength_half_marked"
            },
            {
                "text": "2.0 m"
            },
            {
                "text": "8.0 m"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Each loop is HALF a wavelength. Loop length = 2.0/4 = 0.50 m, so lambda = 2 x 0.50 = 1.0 m. Treating one loop as a full wavelength gives 0.50 m, half the true value.",
        "applicable_misconceptions": [
            "wavelength_half_marked"
        ],
        "source": "authored"
    },
    {
        "id": "wm_speed_sound_direct_claims",
        "qtype": "level_of_response_6",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_measurement",
        "syllabus_codes": [
            "6.6.1.2.g.ii.i"
        ],
        "atoms": [
            "speed_sound_direct_method"
        ],
        "prompt": "Two students measure the speed of sound in air using a drum and a stopwatch. Tick the statements that belong in a good method.",
        "diagram": {
            "kind": "wave_scenario",
            "params": {
                "variant": "speed_clap",
                "mark": {
                    "distance": true
                }
            }
        },
        "marks": 3,
        "lor": {
            "points": [
                {
                    "text": "Stand a large measured distance apart (several hundred metres)",
                    "creditworthy": true
                },
                {
                    "text": "Start the stopwatch on SEEING the drum hit, stop it on HEARING the sound",
                    "creditworthy": true
                },
                {
                    "text": "Calculate speed = distance / time, repeat and take a mean",
                    "creditworthy": true
                },
                {
                    "text": "Stand close together so the sound is louder",
                    "creditworthy": false
                },
                {
                    "text": "Time the sound, without measuring the distance between the students",
                    "creditworthy": false,
                    "misconception_id": "measurement_purpose_missing"
                }
            ]
        },
        "explanation": "A LARGE measured distance; start timing when the drummer is SEEN to hit the drum, stop when the sound is heard; v = d/t; repeat and take a mean. The light is effectively instantaneous over these distances, which is what makes see-then-hear timing valid.",
        "applicable_misconceptions": [
            "measurement_purpose_missing"
        ],
        "source": "authored"
    },
    {
        "id": "wm_echo_method_claims",
        "qtype": "level_of_response_6",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_measurement",
        "syllabus_codes": [
            "6.6.1.2.g.ii.ii"
        ],
        "atoms": [
            "speed_sound_echo_method"
        ],
        "prompt": "A student bangs two bricks together and hears the echo from a large wall. Describe how to determine the speed of sound. Tick the statements that belong in a good method.",
        "facility_pct": 9,
        "diagram": {
            "kind": "wave_scenario",
            "params": {
                "variant": "echo_wall",
                "mark": {
                    "distance": true
                }
            }
        },
        "marks": 3,
        "lor": {
            "points": [
                {
                    "text": "Measure the distance from the student to the wall",
                    "creditworthy": true
                },
                {
                    "text": "Measure the time between the clap and hearing the echo",
                    "creditworthy": true
                },
                {
                    "text": "Calculate speed = (2 x distance) / time, because the sound travels to the wall and back",
                    "creditworthy": true
                },
                {
                    "text": "Calculate speed = distance / time using the distance to the wall",
                    "creditworthy": false,
                    "misconception_id": "echo_factor_two_missed"
                },
                {
                    "text": "Throw the bricks at the wall and time how long they take to hit it",
                    "creditworthy": false
                }
            ]
        },
        "explanation": "Measure the distance to the wall, time from clap to echo, and use speed = 2 x distance / time: the sound travels there AND back. On the real paper only 9% reached level 2, mostly for missing what to do with the measurements; a memorable minority proposed throwing the bricks at the wall.",
        "applicable_misconceptions": [
            "echo_factor_two_missed"
        ],
        "source": "aqa_ppq:trilogy_2018_p2f_02.3"
    },
    {
        "id": "wm_frequency_count",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "wave_measurement",
        "syllabus_codes": [
            "6.6.1.2.a"
        ],
        "atoms": [
            "frequency_count_method"
        ],
        "prompt": "A person on a pier counts 12 waves passing a post in 60 s. What is the frequency of the waves?",
        "diagram": {
            "kind": "wave_scenario",
            "params": {
                "variant": "pier",
                "mark": {
                    "count": true,
                    "time": true
                },
                "values": {
                    "count": 12,
                    "time": 60
                }
            }
        },
        "choices": [
            {
                "text": "0.2 Hz"
            },
            {
                "text": "5 Hz",
                "misconception_id": "period_frequency_confused"
            },
            {
                "text": "12 Hz"
            },
            {
                "text": "720 Hz",
                "misconception_id": "stem_numbers_multiplied"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Frequency = waves per second = 12/60 = 0.2 Hz. Dividing the other way (60/12 = 5) gives the PERIOD of the waves, not the frequency.",
        "applicable_misconceptions": [
            "period_frequency_confused",
            "stem_numbers_multiplied"
        ],
        "source": "authored"
    },
    {
        "id": "wm_mean_reading",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "F",
        "topic": "6.6",
        "subtag": "wave_measurement",
        "syllabus_codes": [
            "6.6.1.2.i.ii"
        ],
        "atoms": [
            "mean_of_repeats"
        ],
        "prompt": "Three readings of the frequency of waves in a ripple tank: 12.8 Hz, 12.4 Hz, 12.3 Hz. What is the mean frequency?",
        "facility_pct": 70,
        "choices": [
            {
                "text": "12.5 Hz"
            },
            {
                "text": "12.4 Hz"
            },
            {
                "text": "37.5 Hz"
            },
            {
                "text": "12.8 Hz"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Mean = (12.8 + 12.4 + 12.3) / 3 = 37.5 / 3 = 12.5 Hz.",
        "source": "aqa_ppq:trilogy_2021_p2f_04.2"
    },
    {
        "id": "wm_precision",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "wave_measurement",
        "syllabus_codes": [
            "6.6.1.2.i.ii"
        ],
        "atoms": [
            "precision_uncertainty_basics"
        ],
        "prompt": "A teacher states that a set of repeated wavelength measurements is very precise. Which of the following supports the statement?",
        "facility_pct": 40,
        "choices": [
            {
                "text": "The spread of values about the mean is very small"
            },
            {
                "text": "The mean value is very close to the true value"
            },
            {
                "text": "The values are all given to the nearest millimetre"
            },
            {
                "text": "The measurement was taken five times",
                "misconception_id": "repeatability_reproducibility_confused"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Precise = the repeated values cluster tightly: a small spread about the mean. Being close to the true value is ACCURACY, a different idea.",
        "applicable_misconceptions": [
            "repeatability_reproducibility_confused"
        ],
        "source": "aqa_ppq:trilogy_2023_p2h_03.3"
    },
    {
        "id": "wm_uncertainty",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "wave_measurement",
        "syllabus_codes": [
            "6.6.2.2.e.i"
        ],
        "atoms": [
            "precision_uncertainty_basics"
        ],
        "prompt": "Five repeated readings of a wavelength: 28 mm, 30 mm, 31 mm, 29 mm, 32 mm. What is the uncertainty in the readings?",
        "facility_pct": 18,
        "choices": [
            {
                "text": "+/- 2 mm"
            },
            {
                "text": "+/- 4 mm",
                "misconception_id": "uncertainty_given_as_range"
            },
            {
                "text": "+/- 30 mm"
            },
            {
                "text": "+/- 0.8 mm"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Range = 32 - 28 = 4 mm; uncertainty = plus or minus HALF the range = +/- 2 mm. Giving the whole range as the uncertainty was the standard error on the 2025 paper.",
        "applicable_misconceptions": [
            "uncertainty_given_as_range"
        ],
        "source": "aqa_ppq:trilogy_2025_p2h_05.2"
    },
    {
        "id": "wm_random_error",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "wave_measurement",
        "syllabus_codes": [
            "6.6.2.2.e.i"
        ],
        "atoms": [
            "precision_uncertainty_basics"
        ],
        "prompt": "A student takes repeated readings with a digital temperature probe. The readings differ slightly from each other in an unpredictable way. What type of error is shown?",
        "facility_pct": 15,
        "choices": [
            {
                "text": "Random error"
            },
            {
                "text": "Systematic error"
            },
            {
                "text": "There is no error, because the probe is digital",
                "misconception_id": "digital_reading_trusted_no_random_error"
            },
            {
                "text": "Zero error"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Unpredictable scatter in repeats is RANDOM error. Digital displays do not abolish it: only 15% got this on the 2025 paper, where the examiner named the 'digital devices give a definitive value' misconception.",
        "applicable_misconceptions": [
            "digital_reading_trusted_no_random_error"
        ],
        "source": "aqa_ppq:trilogy_2025_p2h_05.1"
    },
    {
        "id": "rb_name_refraction",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "refraction_boundaries",
        "syllabus_codes": [
            "6.6.2.2.b"
        ],
        "atoms": [
            "refraction_name"
        ],
        "prompt": "Light changes direction when it passes from air into a glass prism. What name is given to this process?",
        "facility_pct": 20,
        "choices": [
            {
                "text": "Refraction"
            },
            {
                "text": "Reflection",
                "misconception_id": "refraction_term_unknown"
            },
            {
                "text": "Diffraction",
                "misconception_id": "refraction_term_unknown"
            },
            {
                "text": "Radiation"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Refraction: the change of direction when a wave crosses a boundary between media. (Reflection is bouncing back; dispersion is the splitting into colours that refraction causes.)",
        "applicable_misconceptions": [
            "refraction_term_unknown"
        ],
        "source": "aqa_ppq:trilogy_2023_p2f_06.3"
    },
    {
        "id": "rb_ray_into_glass",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "refraction_boundaries",
        "syllabus_codes": [
            "6.6.2.2.c"
        ],
        "atoms": [
            "refraction_direction"
        ],
        "prompt": "A ray of light passes from air into glass. The angle of incidence is 45 degrees. Which describes the refracted ray inside the glass?",
        "facility_pct": 20,
        "diagram": {
            "kind": "refraction_ray",
            "params": {
                "shape": "rectangle",
                "theta1": 45,
                "mark": {
                    "normal": true,
                    "angles": true
                }
            }
        },
        "choices": [
            {
                "text": "It bends toward the normal: the angle of refraction is less than 45 degrees"
            },
            {
                "text": "It bends away from the normal: the angle of refraction is more than 45 degrees",
                "misconception_id": "bent_wrong_way"
            },
            {
                "text": "It continues at 45 degrees to the normal",
                "misconception_id": "equal_angle_no_refraction"
            },
            {
                "text": "It travels along the boundary"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Entering a denser (slower) medium the ray bends TOWARD the normal, so the angle of refraction is smaller than 45 degrees (28 degrees on the real paper). Measured from the NORMAL, not the surface.",
        "applicable_misconceptions": [
            "bent_wrong_way",
            "equal_angle_no_refraction"
        ],
        "source": "aqa_ppq:trilogy_2025_p2h_03.6"
    },
    {
        "id": "rb_ray_out_of_glass",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "refraction_boundaries",
        "syllabus_codes": [
            "6.6.2.2.c"
        ],
        "atoms": [
            "refraction_direction"
        ],
        "prompt": "A ray of light passes from glass into air. Which way does the ray bend as it leaves the glass?",
        "choices": [
            {
                "text": "Away from the normal"
            },
            {
                "text": "Toward the normal",
                "misconception_id": "bent_wrong_way"
            },
            {
                "text": "It does not bend",
                "misconception_id": "equal_angle_no_refraction"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Leaving the slower medium for the faster one, the ray speeds up and bends AWAY from the normal: the mirror image of entry.",
        "applicable_misconceptions": [
            "bent_wrong_way",
            "equal_angle_no_refraction"
        ],
        "source": "authored"
    },
    {
        "id": "rb_normal_role",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "refraction_boundaries",
        "syllabus_codes": [
            "6.6.2.2.c"
        ],
        "atoms": [
            "ray_diagram_construct"
        ],
        "prompt": "When constructing a ray diagram for refraction, what is the 'normal'?",
        "facility_pct": 40,
        "choices": [
            {
                "text": "A line at right angles to the boundary at the point where the ray meets it"
            },
            {
                "text": "A line along the boundary surface",
                "misconception_id": "normal_not_drawn"
            },
            {
                "text": "The refracted ray itself"
            },
            {
                "text": "A line parallel to the incident ray"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "The normal is a construction line at 90 degrees to the boundary at the point where the ray meets it; angles of incidence and refraction are measured from it. Omitting it (or measuring from the surface) loses the construction mark.",
        "applicable_misconceptions": [
            "normal_not_drawn"
        ],
        "source": "aqa_ppq:trilogy_2019_p2h_07.2"
    },
    {
        "id": "rb_drag_refracted_ray",
        "qtype": "widget",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "refraction_boundaries",
        "syllabus_codes": [
            "6.6.2.2.c"
        ],
        "atoms": [
            "ray_diagram_construct"
        ],
        "prompt": "A ray of light meets the glass block at 45 degrees to the normal. Drag the refracted ray to show its path inside the glass.",
        "pending_engine": "widget_qtype",
        "widget": {
            "kind": "refraction_ray",
            "config": {
                "n1": 1,
                "n2": 1.5,
                "theta1": 45
            }
        },
        "marks": 2,
        "explanation": "Toward the normal (glass is slower): Snell gives about 28 degrees. Direction mark for the correct side of the normal; value mark within tolerance.",
        "source": "authored"
    },
    {
        "id": "rb_block_emergent",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "refraction_boundaries",
        "syllabus_codes": [
            "6.6.2.2.c"
        ],
        "atoms": [
            "ray_diagram_construct"
        ],
        "prompt": "A ray passes right through a rectangular glass block and emerges from the far side. How does the emergent ray compare with the incident ray?",
        "diagram": {
            "kind": "refraction_ray",
            "params": {
                "shape": "rectangle",
                "theta1": 40,
                "mark": {
                    "normal": true
                }
            }
        },
        "choices": [
            {
                "text": "Parallel to the incident ray, but shifted sideways"
            },
            {
                "text": "At a larger angle to the normal than the incident ray",
                "misconception_id": "bent_wrong_way"
            },
            {
                "text": "Exactly in line with the incident ray, with no shift",
                "misconception_id": "equal_angle_no_refraction"
            },
            {
                "text": "Reflected back into the block"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "The two refractions cancel: the emergent ray is PARALLEL to the incident ray, shifted sideways (lateral displacement). Drawing it bent at a new angle, or undeviated with no shift, were the common wrong forms.",
        "applicable_misconceptions": [
            "bent_wrong_way",
            "equal_angle_no_refraction"
        ],
        "source": "aqa_ppq:trilogy_2019_p2h_07.2"
    },
    {
        "id": "rb_speed_cause",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "refraction_boundaries",
        "syllabus_codes": [
            "6.6.2.2.b"
        ],
        "atoms": [
            "refraction_speed_cause"
        ],
        "prompt": "Why does light refract as it passes from air into glass?",
        "facility_pct": 20,
        "choices": [
            {
                "text": "The light slows down as it enters the glass"
            },
            {
                "text": "The glass is denser than air",
                "misconception_id": "density_cited_not_speed"
            },
            {
                "text": "The speed of the light changes",
                "misconception_id": "speed_change_direction_unstated"
            },
            {
                "text": "The frequency of the light changes in the glass",
                "misconception_id": "boundary_frequency_not_constant"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Refraction is caused by the CHANGE OF SPEED: light slows down in glass. 'Because glass is denser' was explicitly ignored by the 2025 mark scheme, and 'the speed changes' without slower/faster scored nothing.",
        "applicable_misconceptions": [
            "density_cited_not_speed",
            "speed_change_direction_unstated",
            "boundary_frequency_not_constant"
        ],
        "source": "aqa_ppq:trilogy_2025_p2h_03.5"
    },
    {
        "id": "rb_wavefront_explain",
        "qtype": "level_of_response_6",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "refraction_boundaries",
        "syllabus_codes": [
            "6.6.2.2.d"
        ],
        "atoms": [
            "wavefront_explanation"
        ],
        "prompt": "Wavefronts of light meet a glass boundary at an angle. Use the wavefront diagram to explain why the light changes direction. Tick the statements that belong in a full explanation.",
        "facility_pct": 20,
        "diagram": {
            "kind": "refraction_wavefronts",
            "params": {}
        },
        "marks": 3,
        "lor": {
            "points": [
                {
                    "text": "One end of each wavefront enters the glass and slows down before the other end",
                    "creditworthy": true
                },
                {
                    "text": "The wavefronts become closer together in the glass (shorter wavelength)",
                    "creditworthy": true
                },
                {
                    "text": "The change in direction follows from one end travelling slower than the other",
                    "creditworthy": true
                },
                {
                    "text": "The light bends because glass is optically denser",
                    "creditworthy": false,
                    "misconception_id": "density_cited_not_speed"
                },
                {
                    "text": "The frequency of the waves decreases in the glass",
                    "creditworthy": false,
                    "misconception_id": "boundary_frequency_not_constant"
                }
            ]
        },
        "explanation": "One end of each wavefront crosses the boundary FIRST and slows down while the other end is still in air; the wavefronts close up and swing round, so the direction of travel bends toward the normal. The frequency does not change; the wavelength shortens.",
        "applicable_misconceptions": [
            "density_cited_not_speed",
            "boundary_frequency_not_constant"
        ],
        "source": "aqa_ppq:trilogy_2025_p2h_03.5"
    },
    {
        "id": "rb_frequency_constant",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "refraction_boundaries",
        "syllabus_codes": [
            "6.6.2.2.d"
        ],
        "atoms": [
            "frequency_unchanged_at_boundary"
        ],
        "prompt": "A wave passes from air into glass and slows down. Which row describes what happens to its frequency and wavelength?",
        "choices": [
            {
                "text": "Frequency unchanged; wavelength shorter"
            },
            {
                "text": "Frequency lower; wavelength unchanged",
                "misconception_id": "boundary_frequency_not_constant"
            },
            {
                "text": "Frequency lower; wavelength shorter",
                "misconception_id": "boundary_frequency_not_constant"
            },
            {
                "text": "Frequency unchanged; wavelength longer"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Frequency is set by the source and cannot change at a boundary (the wavefronts arriving must equal the wavefronts leaving). With v = f lambda and v down at fixed f, the wavelength must shorten.",
        "applicable_misconceptions": [
            "boundary_frequency_not_constant"
        ],
        "source": "authored"
    },
    {
        "id": "rb_violet_most",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "refraction_boundaries",
        "syllabus_codes": [
            "6.6.2.2.a"
        ],
        "atoms": [
            "wavelength_dependent_behaviour"
        ],
        "prompt": "Different wavelengths of light travel at different speeds in water: the shorter the wavelength, the slower the light travels. Explain why violet light is refracted the most as it enters water from air.",
        "facility_pct": 1,
        "choices": [
            {
                "text": "Violet has the shortest wavelength, so its speed changes the most, so its direction changes the most"
            },
            {
                "text": "Violet has the longest wavelength of the visible colours",
                "misconception_id": "red_called_shortest"
            },
            {
                "text": "Violet light slows down, so it refracts",
                "misconception_id": "speed_change_direction_unstated"
            },
            {
                "text": "Water is denser for violet light",
                "misconception_id": "density_cited_not_speed"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Violet has the shortest wavelength of the visible colours, so it slows the MOST at the boundary; the bigger the speed change, the bigger the change of direction. Only about 1% of students chained these two steps on the real paper.",
        "applicable_misconceptions": [
            "red_called_shortest",
            "speed_change_direction_unstated",
            "density_cited_not_speed"
        ],
        "source": "aqa_ppq:trilogy_2019_p2h_07.3"
    },
    {
        "id": "rb_material_behaviour",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "refraction_boundaries",
        "syllabus_codes": [
            "6.6.2.2.a"
        ],
        "atoms": [
            "wavelength_dependent_behaviour"
        ],
        "prompt": "Glass transmits visible light but does NOT transmit ultraviolet radiation. What happens to ultraviolet radiation incident on glass?",
        "diagram": {
            "kind": "material_wave_behaviour",
            "params": {}
        },
        "choices": [
            {
                "text": "It is absorbed or reflected by the glass"
            },
            {
                "text": "It passes through, because all electromagnetic waves behave the same in glass"
            },
            {
                "text": "It speeds up inside the glass"
            },
            {
                "text": "It turns into visible light"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Substances absorb, transmit, refract or reflect EM waves in ways that VARY WITH WAVELENGTH (6.6.2.2.a). UV that is not transmitted is absorbed (or reflected) by the glass; visible light, a longer wavelength, passes through.",
        "source": "aqa_ppq:trilogy_specimen_set2_p2h_03.7"
    },
    {
        "id": "es_name_missing",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_spectrum",
        "syllabus_codes": [
            "6.6.2.1.c"
        ],
        "atoms": [
            "em_order"
        ],
        "prompt": "The spectrum runs: radio, [blank], infrared, visible light, ultraviolet, X-rays, gamma rays. Which group fills the blank?",
        "facility_pct": 60,
        "diagram": {
            "kind": "em_spectrum",
            "params": {
                "blanks": [
                    "microwave"
                ]
            }
        },
        "choices": [
            {
                "text": "Microwaves"
            },
            {
                "text": "Ultrasound",
                "misconception_id": "ultrasound_treated_as_em"
            },
            {
                "text": "X-rays",
                "misconception_id": "em_order_confused"
            },
            {
                "text": "Ultraviolet",
                "misconception_id": "em_order_confused"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Long-to-short wavelength: radio, MICROWAVE, infrared, visible, ultraviolet, X-ray, gamma. On the 2023 Foundation paper 70% could not name all the missing groups.",
        "applicable_misconceptions": [
            "ultrasound_treated_as_em",
            "em_order_confused"
        ],
        "source": "aqa_ppq:trilogy_2023_p2h_01.1"
    },
    {
        "id": "es_uv_position",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_spectrum",
        "syllabus_codes": [
            "6.6.2.1.c"
        ],
        "atoms": [
            "em_order"
        ],
        "prompt": "Where does ultraviolet (UV) sit in the electromagnetic spectrum?",
        "facility_pct": 50,
        "diagram": {
            "kind": "em_spectrum",
            "params": {}
        },
        "choices": [
            {
                "text": "Between visible light and X-rays"
            },
            {
                "text": "Between microwaves and visible light",
                "misconception_id": "em_order_confused"
            },
            {
                "text": "Between radio waves and microwaves",
                "misconception_id": "em_order_confused"
            },
            {
                "text": "Beyond gamma rays"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "UV sits between visible light and X-rays. 'Between microwaves and visible light' was the named wrong answer on the 2018 paper (that is infrared's slot).",
        "applicable_misconceptions": [
            "em_order_confused"
        ],
        "source": "aqa_ppq:trilogy_2018_p2f_04.1"
    },
    {
        "id": "es_high_freq_end",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_spectrum",
        "syllabus_codes": [
            "6.6.2.1.c"
        ],
        "atoms": [
            "em_ends_identify"
        ],
        "prompt": "Which of the following electromagnetic waves has the greatest frequency?",
        "facility_pct": 55,
        "choices": [
            {
                "text": "Gamma rays"
            },
            {
                "text": "Radio waves",
                "misconception_id": "spectrum_ends_swapped"
            },
            {
                "text": "Ultraviolet",
                "misconception_id": "em_order_confused"
            },
            {
                "text": "Visible light"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Gamma rays: the short-wavelength, high-frequency end. Radio is the opposite end (long wavelength, low frequency).",
        "applicable_misconceptions": [
            "spectrum_ends_swapped",
            "em_order_confused"
        ],
        "source": "aqa_ppq:trilogy_2025_p2f_05.2"
    },
    {
        "id": "es_long_wavelength_end",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_spectrum",
        "syllabus_codes": [
            "6.6.2.1.c"
        ],
        "atoms": [
            "em_ends_identify"
        ],
        "prompt": "Which group of electromagnetic waves has the longest wavelength?",
        "facility_pct": 17,
        "choices": [
            {
                "text": "Radio waves"
            },
            {
                "text": "Gamma rays",
                "misconception_id": "spectrum_ends_swapped"
            },
            {
                "text": "X-rays",
                "misconception_id": "spectrum_ends_swapped"
            },
            {
                "text": "Microwaves"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Radio waves: long wavelength means LOW frequency. Gamma rays have the greatest frequency and the shortest wavelength. A third of students scored zero on the 2019 fill-the-box version of this.",
        "applicable_misconceptions": [
            "spectrum_ends_swapped"
        ],
        "source": "aqa_ppq:trilogy_2019_p2f_05.1"
    },
    {
        "id": "es_uv_statements",
        "qtype": "mcq_multi",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_spectrum",
        "syllabus_codes": [
            "6.6.2.1.c"
        ],
        "atoms": [
            "freq_wavelength_inverse"
        ],
        "prompt": "A lamp emits ultraviolet radiation. Which TWO statements about the ultraviolet waves are correct? Tick two.",
        "facility_pct": 15,
        "choices": [
            {
                "text": "They have the same wave speed as visible light"
            },
            {
                "text": "They have a lower frequency than gamma rays"
            },
            {
                "text": "They have a longer wavelength than microwaves",
                "misconception_id": "freq_wavelength_inverse_missed"
            },
            {
                "text": "They have a higher frequency than X-rays",
                "misconception_id": "em_order_confused"
            },
            {
                "text": "They have a greater wave speed than radio waves"
            }
        ],
        "answerIndices": [
            0,
            1
        ],
        "marks": 2,
        "explanation": "All EM waves share one speed (in vacuum/air), so 'same wave speed as visible light' is right; UV sits below gamma in frequency, so 'lower frequency than gamma rays' is right. 'Longer wavelength than microwaves' was the named error: higher frequency means SHORTER wavelength.",
        "applicable_misconceptions": [
            "freq_wavelength_inverse_missed",
            "em_order_confused"
        ],
        "source": "aqa_ppq:trilogy_2018_p2f_04.2"
    },
    {
        "id": "es_common_property",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "em_spectrum",
        "syllabus_codes": [
            "6.6.2.1.b"
        ],
        "atoms": [
            "em_common_properties"
        ],
        "prompt": "Electromagnetic waves can all travel through a vacuum. Give one OTHER property that is the same for all types of electromagnetic wave.",
        "facility_pct": 20,
        "choices": [
            {
                "text": "They all travel at the same speed through a vacuum"
            },
            {
                "text": "They can all be used to transmit data",
                "misconception_id": "property_answered_with_use"
            },
            {
                "text": "They can all travel through a vacuum"
            },
            {
                "text": "They all have the same wavelength"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "All EM waves are transverse, all transfer energy, and all travel at the same speed through a vacuum (or air). Answers about USES (transmitting data) are not properties; repeating the stem's vacuum fact scores nothing.",
        "applicable_misconceptions": [
            "property_answered_with_use"
        ],
        "source": "aqa_ppq:trilogy_2024_p2h_03.1"
    },
    {
        "id": "es_transfer",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "F",
        "topic": "6.6",
        "subtag": "em_spectrum",
        "syllabus_codes": [
            "6.6.2.1.a"
        ],
        "atoms": [
            "em_common_properties"
        ],
        "prompt": "What do all electromagnetic waves transfer from a source to an absorber?",
        "facility_pct": 70,
        "choices": [
            {
                "text": "Energy"
            },
            {
                "text": "Matter",
                "misconception_id": "medium_travels_with_wave"
            },
            {
                "text": "Charge"
            },
            {
                "text": "Sound"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Energy. EM waves are transverse waves that transfer energy from the source of the waves to an absorber (6.6.2.1.a).",
        "applicable_misconceptions": [
            "medium_travels_with_wave"
        ],
        "source": "aqa_ppq:trilogy_2022_p2f_01.1"
    },
    {
        "id": "es_continuous",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_spectrum",
        "syllabus_codes": [
            "6.6.2.1.b"
        ],
        "atoms": [
            "em_continuous_spectrum"
        ],
        "prompt": "The electromagnetic spectrum is described as a CONTINUOUS spectrum. What does this mean?",
        "choices": [
            {
                "text": "The wavelengths run from longest to shortest with no gaps between the groups"
            },
            {
                "text": "It is made of seven separate bands with gaps between them"
            },
            {
                "text": "The waves are emitted without stopping"
            },
            {
                "text": "Every wave in it is visible if the source is bright enough"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "The wavelengths run smoothly from the longest radio waves to the shortest gamma rays with no gaps; the seven named groups are labels on a continuum, not separate bands with spaces between.",
        "source": "authored"
    },
    {
        "id": "es_eyes",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_spectrum",
        "syllabus_codes": [
            "6.6.2.1.d"
        ],
        "atoms": [
            "visible_limited_detection"
        ],
        "prompt": "Why can human eyes not see infrared or ultraviolet radiation?",
        "choices": [
            {
                "text": "Eyes only detect the visible-light range of the electromagnetic spectrum"
            },
            {
                "text": "Infrared and ultraviolet are not electromagnetic waves"
            },
            {
                "text": "Infrared and ultraviolet travel too fast to be seen"
            },
            {
                "text": "Infrared and ultraviolet carry no energy"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Our eyes detect only a limited range of the spectrum: the visible band. The other groups are physically the same kind of wave, just at wavelengths the eye cannot detect.",
        "source": "authored"
    },
    {
        "id": "es_colour_order",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "em_spectrum",
        "syllabus_codes": [
            "6.6.2.1.c"
        ],
        "atoms": [
            "visible_colour_order"
        ],
        "prompt": "Which colour of visible light has the shortest wavelength?",
        "facility_pct": 27,
        "choices": [
            {
                "text": "Violet"
            },
            {
                "text": "Red",
                "misconception_id": "red_called_shortest"
            },
            {
                "text": "Green"
            },
            {
                "text": "White"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Violet. Visible runs red (long wavelength) to violet (short wavelength); red was the most common wrong answer on the 2024 paper.",
        "applicable_misconceptions": [
            "red_called_shortest"
        ],
        "source": "aqa_ppq:trilogy_2024_p2h_03.4"
    },
    {
        "id": "es_place_wavelength",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "em_spectrum",
        "syllabus_codes": [
            "6.6.2.1.a"
        ],
        "atoms": [
            "em_wavelength_magnitude"
        ],
        "prompt": "Infrared has wavelengths from 700 nm to 1 mm. Which part of the electromagnetic spectrum has waves with a wavelength of 6.5 x 10^-7 m?",
        "facility_pct": 30,
        "choices": [
            {
                "text": "Visible light"
            },
            {
                "text": "Infrared",
                "misconception_id": "prefix_not_converted"
            },
            {
                "text": "Microwaves"
            },
            {
                "text": "Radio waves"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "6.5 x 10^-7 m = 650 nm, which is SHORTER than 700 nm, so it sits just outside infrared on the visible side: visible light. The demand is the unit comparison (nm, mm, standard form), exactly what made this a sub-30% item.",
        "applicable_misconceptions": [
            "prefix_not_converted"
        ],
        "source": "aqa_ppq:trilogy_2021_p2h_05.2"
    },
    {
        "id": "es_uv_gamma_compare",
        "qtype": "mcq_multi",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "em_spectrum",
        "syllabus_codes": [
            "6.6.2.1.b"
        ],
        "atoms": [
            "em_common_properties"
        ],
        "prompt": "Which TWO statements give a correct similarity and a correct difference between ultraviolet waves and gamma rays? Tick two.",
        "facility_pct": 15,
        "choices": [
            {
                "text": "Both are transverse waves travelling at the same speed in a vacuum"
            },
            {
                "text": "Gamma rays have a higher frequency than ultraviolet waves"
            },
            {
                "text": "Ultraviolet is used in lamps but gamma is used in hospitals",
                "misconception_id": "property_answered_with_use"
            },
            {
                "text": "Gamma rays travel faster than ultraviolet waves"
            },
            {
                "text": "Ultraviolet waves have a higher frequency than gamma rays",
                "misconception_id": "spectrum_ends_swapped"
            }
        ],
        "answerIndices": [
            0,
            1
        ],
        "marks": 2,
        "explanation": "Similarity: both are transverse EM waves travelling at the same speed in a vacuum. Difference: gamma rays have a higher frequency (shorter wavelength) than UV. Uses are not properties: that confusion cost most of the marks on the real item (2% full at Foundation).",
        "applicable_misconceptions": [
            "property_answered_with_use",
            "spectrum_ends_swapped"
        ],
        "source": "aqa_ppq:trilogy_2023_p2h_01.2"
    },
    {
        "id": "eo_radio_production",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "em_origins",
        "syllabus_codes": [
            "6.6.2.3.a"
        ],
        "atoms": [
            "radio_from_oscillations"
        ],
        "prompt": "How can radio waves be produced?",
        "facility_pct": 5,
        "choices": [
            {
                "text": "By oscillations (alternating current) in an electrical circuit connected to an aerial"
            },
            {
                "text": "By changes in the nucleus of an atom",
                "misconception_id": "em_origin_swapped"
            },
            {
                "text": "By reflecting other waves off the ionosphere",
                "misconception_id": "radio_oscillation_link_missed"
            },
            {
                "text": "By heating a wire until it glows"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "By oscillations in an electrical circuit: an alternating current makes charges oscillate in the transmitting aerial, and the oscillating charges emit radio waves of the same frequency. 90% scored zero or did not attempt the 2020 version.",
        "applicable_misconceptions": [
            "em_origin_swapped",
            "radio_oscillation_link_missed"
        ],
        "source": "aqa_ppq:trilogy_2020_p2h_05.3"
    },
    {
        "id": "eo_radio_receive",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "em_origins",
        "syllabus_codes": [
            "6.6.2.3.b"
        ],
        "atoms": [
            "radio_induce_ac"
        ],
        "prompt": "Radio waves reach the aerial of a car radio. What happens when the waves are absorbed by the aerial?",
        "facility_pct": 1,
        "choices": [
            {
                "text": "They induce an alternating current with the same frequency as the radio wave"
            },
            {
                "text": "They induce a direct current in the aerial",
                "misconception_id": "radio_oscillation_link_missed"
            },
            {
                "text": "They induce an alternating current at a much lower frequency",
                "misconception_id": "radio_oscillation_link_missed"
            },
            {
                "text": "They only heat the aerial"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "The absorbed waves induce an ALTERNATING current in the aerial circuit with the SAME frequency as the radio wave itself. That same-frequency link is the whole point of 6.6.2.3.b, and just over 1% earned full marks on the 2018 version.",
        "applicable_misconceptions": [
            "radio_oscillation_link_missed"
        ],
        "source": "aqa_ppq:trilogy_2018_p2h_05.3"
    },
    {
        "id": "eo_transmitter_chain_claims",
        "qtype": "level_of_response_6",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "em_origins",
        "syllabus_codes": [
            "6.6.2.3.b"
        ],
        "atoms": [
            "radio_induce_ac"
        ],
        "prompt": "Explain how oscillations in a transmitter enable information to be transferred to the detector circuit in a receiver. Tick the statements that belong in a full explanation.",
        "facility_pct": 10,
        "marks": 3,
        "lor": {
            "points": [
                {
                    "text": "An alternating current makes charges oscillate in the transmitter circuit",
                    "creditworthy": true
                },
                {
                    "text": "The oscillating charges produce radio waves with the same frequency as the a.c.",
                    "creditworthy": true
                },
                {
                    "text": "When absorbed at the receiver, the waves induce an alternating current with the same frequency",
                    "creditworthy": true
                },
                {
                    "text": "The radio waves bounce off the ionosphere into the receiver",
                    "creditworthy": false,
                    "misconception_id": "radio_oscillation_link_missed"
                },
                {
                    "text": "The information travels because radio waves are longitudinal",
                    "creditworthy": false
                }
            ]
        },
        "explanation": "Oscillating charges (an a.c.) in the transmitter emit radio waves at the same frequency; the waves travel to the receiver; absorption induces an a.c. of the same frequency in the detector circuit, reproducing the signal. Ionosphere stories and transverse/longitudinal padding scored nothing on the real papers.",
        "applicable_misconceptions": [
            "radio_oscillation_link_missed"
        ],
        "source": "aqa_ppq:trilogy_2024_p2h_03.7"
    },
    {
        "id": "eo_gamma_origin",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_origins",
        "syllabus_codes": [
            "6.6.2.3.c"
        ],
        "atoms": [
            "gamma_from_nucleus"
        ],
        "prompt": "Where do gamma rays originate?",
        "choices": [
            {
                "text": "Changes in the nucleus of an atom"
            },
            {
                "text": "Oscillations in an electrical circuit",
                "misconception_id": "em_origin_swapped"
            },
            {
                "text": "Chemical reactions between atoms"
            },
            {
                "text": "The vibration of whole molecules"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Gamma rays originate from changes in the NUCLEUS of an atom. (Changes in atoms and their nuclei can generate or absorb EM waves over a wide frequency range; gamma is specifically nuclear.)",
        "applicable_misconceptions": [
            "em_origin_swapped"
        ],
        "source": "authored"
    },
    {
        "id": "eo_which_nuclear",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_origins",
        "syllabus_codes": [
            "6.6.2.3.c"
        ],
        "atoms": [
            "gamma_from_nucleus"
        ],
        "prompt": "Which group of electromagnetic waves is generated by changes in the nucleus of an atom?",
        "choices": [
            {
                "text": "Gamma rays"
            },
            {
                "text": "Radio waves",
                "misconception_id": "em_origin_swapped"
            },
            {
                "text": "Visible light"
            },
            {
                "text": "Microwaves"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Gamma rays. Radio waves come from the other extreme: charge oscillations in circuits; the groups between originate in changes in atoms and electrons.",
        "applicable_misconceptions": [
            "em_origin_swapped"
        ],
        "source": "authored"
    },
    {
        "id": "ed_uv_risks",
        "qtype": "mcq_multi",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_dangers",
        "syllabus_codes": [
            "6.6.2.3.h.i"
        ],
        "atoms": [
            "uv_hazards"
        ],
        "prompt": "Which TWO are risks of exposure to high levels of ultraviolet radiation? Tick two.",
        "facility_pct": 15,
        "choices": [
            {
                "text": "Premature ageing of the skin"
            },
            {
                "text": "Increased risk of skin cancer"
            },
            {
                "text": "Mutation of genes deep inside body organs",
                "misconception_id": "hazard_wrong_for_group"
            },
            {
                "text": "Broken bones"
            },
            {
                "text": "It makes the skin radioactive",
                "misconception_id": "ionising_confused_with_radioactive"
            }
        ],
        "answerIndices": [
            0,
            1
        ],
        "marks": 2,
        "explanation": "UV causes premature ageing of the skin and increases the risk of SKIN cancer. Bare 'cancer' or 'burning' without qualification scored nothing on the real paper.",
        "applicable_misconceptions": [
            "hazard_wrong_for_group",
            "ionising_confused_with_radioactive"
        ],
        "source": "aqa_ppq:trilogy_2018_p2f_04.3"
    },
    {
        "id": "ed_xgamma_harmful",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_dangers",
        "syllabus_codes": [
            "6.6.2.3.h.i"
        ],
        "atoms": [
            "ionising_hazards"
        ],
        "prompt": "Why are gamma rays and X-rays harmful to humans?",
        "facility_pct": 30,
        "choices": [
            {
                "text": "They are ionising"
            },
            {
                "text": "They are radioactive",
                "misconception_id": "ionising_confused_with_radioactive"
            },
            {
                "text": "They travel at the speed of light"
            },
            {
                "text": "They are hot"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "They are IONISING radiation: they can mutate genes and cause cancer. 'They are radioactive' was the majority wrong answer in 2020; waves are not radioactive substances.",
        "applicable_misconceptions": [
            "ionising_confused_with_radioactive"
        ],
        "source": "aqa_ppq:trilogy_2020_p2f_03.5"
    },
    {
        "id": "ed_ionising_effects",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_dangers",
        "syllabus_codes": [
            "6.6.2.3.h.ii"
        ],
        "atoms": [
            "ionising_hazards"
        ],
        "prompt": "What effect can ionising radiation (X-rays and gamma rays) have on human body tissue?",
        "choices": [
            {
                "text": "It can cause gene mutation, which can lead to cancer"
            },
            {
                "text": "It can cause cancer",
                "misconception_id": "risk_unqualified"
            },
            {
                "text": "It makes the body tissue radioactive",
                "misconception_id": "ionising_confused_with_radioactive"
            },
            {
                "text": "It only warms the tissue slightly"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "It can cause the mutation of genes, which can lead to cancer. The qualified chain (ionising, gene mutation, cancer) is what the mark schemes want; bare 'cancer' is not enough.",
        "applicable_misconceptions": [
            "risk_unqualified",
            "ionising_confused_with_radioactive"
        ],
        "source": "authored"
    },
    {
        "id": "ed_dose_meaning",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_dangers",
        "syllabus_codes": [
            "6.6.2.3.d"
        ],
        "atoms": [
            "dose_as_risk_measure"
        ],
        "prompt": "Radiation dose, measured in sieverts, is a measure of what?",
        "choices": [
            {
                "text": "The risk of harm from an exposure of the body to radiation"
            },
            {
                "text": "The temperature rise of the body"
            },
            {
                "text": "The speed of the radiation"
            },
            {
                "text": "How radioactive the person becomes",
                "misconception_id": "ionising_confused_with_radioactive"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "The RISK of harm resulting from an exposure of the body to radiation: it depends on the type of radiation and the size of the dose. (You are not required to recall the unit; it is given.)",
        "applicable_misconceptions": [
            "ionising_confused_with_radioactive"
        ],
        "source": "authored"
    },
    {
        "id": "ed_msv_convert",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_dangers",
        "syllabus_codes": [
            "6.6.2.3.e"
        ],
        "atoms": [
            "dose_as_risk_measure"
        ],
        "prompt": "1000 millisieverts (mSv) = 1 sievert (Sv). A worker receives a dose of 0.5 Sv. What is this dose in mSv?",
        "choices": [
            {
                "text": "500 mSv"
            },
            {
                "text": "0.0005 mSv",
                "misconception_id": "prefix_not_converted"
            },
            {
                "text": "5000 mSv",
                "misconception_id": "power_of_ten_evaluation_error"
            },
            {
                "text": "50 mSv",
                "misconception_id": "power_of_ten_evaluation_error"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "0.5 Sv x 1000 = 500 mSv.",
        "applicable_misconceptions": [
            "prefix_not_converted",
            "power_of_ten_evaluation_error"
        ],
        "source": "authored"
    },
    {
        "id": "ed_dose_compare",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_dangers",
        "syllabus_codes": [
            "6.6.2.3.g"
        ],
        "atoms": [
            "risk_data_conclusions"
        ],
        "prompt": "A table shows: 100 mSv slightly increases cancer risk; 1000 mSv gives a 5% increased risk; 5000 mSv gives a high risk of death. One chest X-ray gives a dose of 0.100 mSv. Why is this X-ray unlikely to harm the patient?",
        "facility_pct": 50,
        "choices": [
            {
                "text": "The dose is very much smaller than the lowest dose that increases risk"
            },
            {
                "text": "0.100 mSv is the same as 100 mSv, which only slightly increases risk",
                "misconception_id": "dose_magnitude_misread"
            },
            {
                "text": "X-rays are not ionising",
                "misconception_id": "ionising_confused_with_radioactive"
            },
            {
                "text": "X-rays cannot pass into the body"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "0.100 mSv is a THOUSANDTH of the lowest dose in the table that even slightly increases risk. On the real paper some students read 0.100 as equal to 100: the decimal comparison is the trap.",
        "applicable_misconceptions": [
            "dose_magnitude_misread",
            "ionising_confused_with_radioactive"
        ],
        "source": "aqa_ppq:trilogy_2020_p2f_03.2"
    },
    {
        "id": "ed_radiographer_claims",
        "qtype": "level_of_response_6",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "em_dangers",
        "syllabus_codes": [
            "6.6.2.3.g"
        ],
        "atoms": [
            "risk_data_conclusions"
        ],
        "prompt": "A radiographer takes many X-ray images each day and stands behind a protective screen for each one. Explain why. Tick the statements that belong in a full explanation.",
        "facility_pct": 8,
        "marks": 3,
        "lor": {
            "points": [
                {
                    "text": "Taking many X-rays each day would give the radiographer a large total (cumulative) dose",
                    "creditworthy": true
                },
                {
                    "text": "A larger dose means a higher risk of harm",
                    "creditworthy": true
                },
                {
                    "text": "The screen absorbs X-rays, reducing the dose the radiographer receives",
                    "creditworthy": true
                },
                {
                    "text": "The screen protects the radiographer from the X-rays",
                    "creditworthy": false,
                    "misconception_id": "protection_mechanism_vague"
                },
                {
                    "text": "Without the screen the radiographer would become radioactive",
                    "creditworthy": false,
                    "misconception_id": "ionising_confused_with_radioactive"
                }
            ]
        },
        "explanation": "Many exposures a day means a large CUMULATIVE dose; a higher dose means a higher risk; the screen ABSORBS the X-rays, reducing the dose received. 'The screen protects the radiographer' restates the question and scored nothing; only 8% got all three steps.",
        "applicable_misconceptions": [
            "protection_mechanism_vague",
            "ionising_confused_with_radioactive"
        ],
        "source": "aqa_ppq:trilogy_2020_p2h_05.2"
    },
    {
        "id": "ed_hazard_match",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_dangers",
        "syllabus_codes": [
            "6.6.2.3.h.i"
        ],
        "atoms": [
            "hazard_matched_to_group"
        ],
        "prompt": "Which row correctly matches each group of electromagnetic waves to a specific risk?",
        "facility_pct": 20,
        "choices": [
            {
                "text": "UV: skin ageing and skin cancer; X-rays and gamma: gene mutation and cancer"
            },
            {
                "text": "UV: gene mutation; X-rays and gamma: skin ageing",
                "misconception_id": "hazard_wrong_for_group"
            },
            {
                "text": "UV, X-rays and gamma all cause sunburn",
                "misconception_id": "hazard_wrong_for_group"
            },
            {
                "text": "They all cause cancer",
                "misconception_id": "risk_unqualified"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "UV: premature skin ageing and skin cancer. X-rays and gamma rays: ionising, so gene mutation and cancer. Fewer than 20% linked each group to its specific risk on the 2024 paper; generic 'they cause cancer' earned only the compensation mark.",
        "applicable_misconceptions": [
            "hazard_wrong_for_group",
            "risk_unqualified"
        ],
        "source": "aqa_ppq:trilogy_2024_p2h_03.5"
    },
    {
        "id": "ed_use_despite",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_dangers",
        "syllabus_codes": [
            "6.6.2.3.g"
        ],
        "atoms": [
            "use_despite_risk"
        ],
        "prompt": "X-rays increase a patient's risk of cancer. Why do doctors still use X-ray imaging?",
        "choices": [
            {
                "text": "The benefit of diagnosing the problem outweighs the very small added risk"
            },
            {
                "text": "Hospital X-rays are not ionising",
                "misconception_id": "ionising_confused_with_radioactive"
            },
            {
                "text": "X-rays only affect the skin",
                "misconception_id": "hazard_wrong_for_group"
            },
            {
                "text": "Doctors are immune to radiation"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Risk-benefit: the dose from one image is tiny (a very small added risk), and the benefit of the diagnosis outweighs it.",
        "applicable_misconceptions": [
            "ionising_confused_with_radioactive",
            "hazard_wrong_for_group"
        ],
        "source": "aqa_ppq:trilogy_specimen_set2_p2f_02.6"
    },
    {
        "id": "eu_microwave_uses",
        "qtype": "mcq_multi",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_uses",
        "syllabus_codes": [
            "6.6.2.4.a.ii"
        ],
        "atoms": [
            "em_use_match"
        ],
        "prompt": "Which TWO are uses of microwaves? Tick two.",
        "facility_pct": 15,
        "choices": [
            {
                "text": "Satellite communications"
            },
            {
                "text": "Cooking food"
            },
            {
                "text": "Imaging broken bones"
            },
            {
                "text": "Energy-efficient lamps"
            },
            {
                "text": "Detecting heat loss from houses"
            }
        ],
        "answerIndices": [
            0,
            1
        ],
        "marks": 2,
        "explanation": "Microwaves: satellite communications AND cooking food. Failing to spot the satellite use (knowing only the oven) was the standard error on the 2022 line-match.",
        "source": "aqa_ppq:trilogy_2022_p2f_01.4"
    },
    {
        "id": "eu_match_rows",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "F",
        "topic": "6.6",
        "subtag": "em_uses",
        "syllabus_codes": [
            "6.6.2.4.a.i"
        ],
        "atoms": [
            "em_use_match"
        ],
        "prompt": "Which row correctly matches the wave to its use?",
        "choices": [
            {
                "text": "Radio waves: television and radio"
            },
            {
                "text": "Ultraviolet: imaging bones",
                "misconception_id": "hazard_wrong_for_group"
            },
            {
                "text": "X-rays: energy-efficient lamps"
            },
            {
                "text": "Infrared: satellite communications"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Radio: television and radio. Infrared: electrical heaters, cooking, IR cameras. Ultraviolet: energy-efficient lamps and sun tanning. X-rays: medical imaging.",
        "applicable_misconceptions": [
            "hazard_wrong_for_group"
        ],
        "source": "in_style_of:aqa_ppq:trilogy_2022_p2f_01.4"
    },
    {
        "id": "eu_gamma_use",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "F",
        "topic": "6.6",
        "subtag": "em_uses",
        "syllabus_codes": [
            "6.6.2.4.a.vi"
        ],
        "atoms": [
            "em_use_match"
        ],
        "prompt": "Which of the following are gamma rays used for?",
        "facility_pct": 50,
        "choices": [
            {
                "text": "Sterilising medical equipment"
            },
            {
                "text": "Cooking food",
                "misconception_id": "microwave_only_cooking"
            },
            {
                "text": "Energy-efficient lamps"
            },
            {
                "text": "Television remote controls"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Sterilising medical equipment (and medical imaging and treatment): gamma's ionising power kills microbes. Cooking is microwaves/infrared; lamps are ultraviolet.",
        "applicable_misconceptions": [
            "microwave_only_cooking"
        ],
        "source": "aqa_ppq:trilogy_2020_p2f_03.4"
    },
    {
        "id": "eu_medical_imaging",
        "qtype": "mcq_multi",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_uses",
        "syllabus_codes": [
            "6.6.2.4.a.vi"
        ],
        "atoms": [
            "em_use_match"
        ],
        "prompt": "Which TWO types of ELECTROMAGNETIC wave are used for medical imaging? Tick two.",
        "facility_pct": 32,
        "choices": [
            {
                "text": "X-rays"
            },
            {
                "text": "Gamma rays"
            },
            {
                "text": "Ultrasound",
                "misconception_id": "ultrasound_treated_as_em"
            },
            {
                "text": "Radio waves"
            },
            {
                "text": "Ultraviolet"
            }
        ],
        "answerIndices": [
            0,
            1
        ],
        "marks": 2,
        "explanation": "X-rays and gamma rays. Ultrasound is the classic trap: it is a sound wave, not an electromagnetic wave ('longitudinal, transverse and ultrasound' were the named wrong answers in 2018).",
        "applicable_misconceptions": [
            "ultrasound_treated_as_em"
        ],
        "source": "aqa_ppq:trilogy_2018_p2f_04.4"
    },
    {
        "id": "eu_visible_use",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "em_uses",
        "syllabus_codes": [
            "6.6.2.4.a.iv"
        ],
        "atoms": [
            "communication_uses"
        ],
        "prompt": "Visible light is used in communications. How?",
        "facility_pct": 30,
        "choices": [
            {
                "text": "Pulses of light carry signals along fibre-optic cables"
            },
            {
                "text": "Light beams carry phone calls to satellites"
            },
            {
                "text": "Light is used to cook food in restaurants",
                "misconception_id": "microwave_only_cooking"
            },
            {
                "text": "Visible light is not used in communications"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Fibre-optic communication: pulses of visible light carry data along glass fibres. Very few students gave this spec example on the 2020 paper.",
        "applicable_misconceptions": [
            "microwave_only_cooking"
        ],
        "source": "aqa_ppq:trilogy_2020_p2f_03.6"
    },
    {
        "id": "eu_satellite_why",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "em_uses",
        "syllabus_codes": [
            "6.6.2.4.b.i"
        ],
        "atoms": [
            "em_use_explain"
        ],
        "prompt": "Some microwaves are NOT absorbed by the Earth's atmosphere. Why does this make microwaves suitable for satellite communications?",
        "facility_pct": 5,
        "choices": [
            {
                "text": "The signal can pass through the atmosphere to and from the satellite without being absorbed"
            },
            {
                "text": "Microwaves are the fastest electromagnetic waves"
            },
            {
                "text": "Microwaves can also be used for cooking",
                "misconception_id": "microwave_only_cooking"
            },
            {
                "text": "Microwaves bounce off the atmosphere to reach the satellite",
                "misconception_id": "radio_oscillation_link_missed"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "The signal must pass through the whole atmosphere up to the satellite and back; a wave the atmosphere absorbs would never get there. Fewer than 5% scored on the 2019 version (many proposed harvesting the microwaves for cooking).",
        "applicable_misconceptions": [
            "microwave_only_cooking",
            "radio_oscillation_link_missed"
        ],
        "source": "aqa_ppq:trilogy_2019_p2f_05.3"
    },
    {
        "id": "eu_xray_bones",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "em_uses",
        "syllabus_codes": [
            "6.6.2.4.b.iii"
        ],
        "atoms": [
            "em_use_explain"
        ],
        "prompt": "Explain why X-rays can be used to produce images of the bones inside the body.",
        "facility_pct": 9,
        "choices": [
            {
                "text": "X-rays pass through soft tissue but are absorbed by bone"
            },
            {
                "text": "X-rays pass through the body",
                "misconception_id": "risk_unqualified"
            },
            {
                "text": "X-rays are reflected by the skin"
            },
            {
                "text": "Bones are radioactive, so they show up",
                "misconception_id": "ionising_confused_with_radioactive"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "BOTH halves are needed: X-rays pass through soft tissue but are ABSORBED by bone, so the bones cast a shadow on the detector. Only 9% gave both halves in 2020.",
        "applicable_misconceptions": [
            "risk_unqualified",
            "ionising_confused_with_radioactive"
        ],
        "source": "aqa_ppq:trilogy_2020_p2h_05.1"
    },
    {
        "id": "eu_microwaves_are_em",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "F",
        "topic": "6.6",
        "subtag": "em_uses",
        "syllabus_codes": [
            "6.6.2.4.a.ii"
        ],
        "atoms": [
            "communication_uses"
        ],
        "prompt": "A student says: 'Microwaves are just for ovens; they are not electromagnetic waves.' What is wrong with this statement?",
        "facility_pct": 30,
        "choices": [
            {
                "text": "Microwaves are electromagnetic waves, also used for satellite communications"
            },
            {
                "text": "Nothing: microwaves only exist inside ovens",
                "misconception_id": "microwave_only_cooking"
            },
            {
                "text": "Microwaves are sound waves, not electromagnetic waves",
                "misconception_id": "ultrasound_treated_as_em"
            },
            {
                "text": "Microwaves are only used for communications, never cooking"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Microwaves ARE a group of the electromagnetic spectrum, and besides cooking they carry satellite communications. The 2020 examiners reported exactly this oven-only picture.",
        "applicable_misconceptions": [
            "microwave_only_cooking",
            "ultrasound_treated_as_em"
        ],
        "source": "aqa_ppq:trilogy_2020_p2f_03.6"
    },
    {
        "id": "ir_best_emitter",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "infrared_radiation",
        "syllabus_codes": [
            "6.6.2.2.e.ii"
        ],
        "atoms": [
            "ir_emission_surface"
        ],
        "prompt": "A Leslie cube filled with hot water has four different faces. An infrared detector is held the same distance from each face in turn. Which face emits the MOST infrared radiation?",
        "diagram": {
            "kind": "radiation_demo",
            "params": {
                "variant": "leslie_cube"
            }
        },
        "choices": [
            {
                "text": "The matt black face"
            },
            {
                "text": "The shiny silver face",
                "misconception_id": "shiny_white_called_good_emitter"
            },
            {
                "text": "The shiny white face",
                "misconception_id": "shiny_white_called_good_emitter"
            },
            {
                "text": "All faces emit the same"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Matt black is the best emitter; shiny silver the worst. (The same ranking holds for absorption.)",
        "applicable_misconceptions": [
            "shiny_white_called_good_emitter"
        ],
        "source": "authored"
    },
    {
        "id": "ir_best_absorber",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "infrared_radiation",
        "syllabus_codes": [
            "6.6.2.2.e.i"
        ],
        "atoms": [
            "ir_absorption_surface"
        ],
        "prompt": "Two plates face a heater: one matt black, one shiny silver. A ball is stuck to the back of each plate with wax. Which wax melts first, and why?",
        "diagram": {
            "kind": "radiation_demo",
            "params": {
                "variant": "wax_rod"
            }
        },
        "choices": [
            {
                "text": "The matt black plate's wax: matt black absorbs the most infrared"
            },
            {
                "text": "The shiny plate's wax: shiny surfaces absorb the most infrared",
                "misconception_id": "shiny_white_called_good_emitter"
            },
            {
                "text": "Both at the same time: the surface does not matter"
            },
            {
                "text": "The matt black plate's wax: black surfaces soak up the heat",
                "misconception_id": "heat_not_radiation_language"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "The matt black plate's wax melts first: matt black is the best ABSORBER of infrared, so that plate heats fastest.",
        "applicable_misconceptions": [
            "shiny_white_called_good_emitter",
            "heat_not_radiation_language"
        ],
        "source": "authored"
    },
    {
        "id": "ir_rp21_method_claims",
        "qtype": "level_of_response_6",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "infrared_radiation",
        "syllabus_codes": [
            "6.6.2.2.e.i"
        ],
        "atoms": [
            "rp21_method"
        ],
        "prompt": "A student compares the infrared radiation emitted by different surfaces using containers of hot water. Tick the statements that belong in a good method.",
        "facility_pct": 25,
        "diagram": {
            "kind": "radiation_demo",
            "params": {
                "variant": "two_bottles"
            }
        },
        "marks": 3,
        "lor": {
            "points": [
                {
                    "text": "Use identical containers that differ only in their surface (e.g. matt black vs shiny)",
                    "creditworthy": true
                },
                {
                    "text": "Measure equal volumes of hot water into each using a measuring cylinder",
                    "creditworthy": true
                },
                {
                    "text": "Record the temperature of each at fixed time intervals with a thermometer",
                    "creditworthy": true
                },
                {
                    "text": "Describe what the thermometer and the containers are",
                    "creditworthy": false,
                    "misconception_id": "apparatus_described_not_method"
                },
                {
                    "text": "Stand the containers at different distances from the window",
                    "creditworthy": false
                }
            ]
        },
        "explanation": "Identical containers differing ONLY in surface; the same volume of water measured with a measuring cylinder; the same starting temperature; temperature recorded with a thermometer at fixed time intervals. The 2022 answers that missed level 2 were vague about the measuring cylinder and the thermometer's actual readings.",
        "applicable_misconceptions": [
            "apparatus_described_not_method"
        ],
        "source": "aqa_ppq:trilogy_2022_p2f_02.2"
    },
    {
        "id": "ir_control_variable",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "F",
        "topic": "6.6",
        "subtag": "infrared_radiation",
        "syllabus_codes": [
            "6.6.2.2.e.i"
        ],
        "atoms": [
            "rp21_method"
        ],
        "prompt": "A student investigates how the colour of a container affects how fast the water inside cools. Which of these is a CONTROL variable?",
        "facility_pct": 40,
        "choices": [
            {
                "text": "The initial temperature of the water"
            },
            {
                "text": "The colour of the container"
            },
            {
                "text": "The final temperature of the water"
            },
            {
                "text": "Whether the water cools at all"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Control variables are kept the same: the initial temperature of the water. The colour is the independent variable; the temperature change is the dependent variable.",
        "source": "aqa_ppq:trilogy_2025_p2f_02.2"
    },
    {
        "id": "ir_initial_rate",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "infrared_radiation",
        "syllabus_codes": [
            "6.6.2.2.e.iii"
        ],
        "atoms": [
            "cooling_curve_interpret"
        ],
        "prompt": "Two flasks (one black, one white) are heated by the same lamp, and their temperatures are graphed against time. The initial rate of absorption was greater for the black flask. How does the GRAPH show this?",
        "facility_pct": 75,
        "choices": [
            {
                "text": "The black flask's line is steeper at the start"
            },
            {
                "text": "The black flask reaches a higher final temperature",
                "misconception_id": "final_temp_cited_not_rate"
            },
            {
                "text": "The black flask's line is longer"
            },
            {
                "text": "The black flask's line starts at a higher temperature"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Rate is the GRADIENT: the black flask's line is steeper at the start. 'It reaches a higher final temperature' describes a different feature and was the standard wrong answer.",
        "applicable_misconceptions": [
            "final_temp_cited_not_rate"
        ],
        "source": "aqa_ppq:trilogy_2022_p2h_05.3"
    },
    {
        "id": "ir_equilibrium",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "infrared_radiation",
        "syllabus_codes": [
            "6.6.2.2.a"
        ],
        "atoms": [
            "thermal_equilibrium_rates"
        ],
        "prompt": "Two clay cubes warmed by an infrared heater eventually stop changing temperature. Why?",
        "facility_pct": 10,
        "choices": [
            {
                "text": "Each cube is absorbing radiation at the same rate as it is emitting it"
            },
            {
                "text": "The cubes have absorbed all the heat they can hold",
                "misconception_id": "thermal_equilibrium_missed"
            },
            {
                "text": "The cubes stop absorbing heat",
                "misconception_id": "heat_not_radiation_language"
            },
            {
                "text": "The heater stops emitting infrared"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Constant temperature means the cube is absorbing infrared radiation at the SAME RATE as it is emitting it: a dynamic balance, not a full tank. Very few students expressed this on the 2025 paper.",
        "applicable_misconceptions": [
            "thermal_equilibrium_missed",
            "heat_not_radiation_language"
        ],
        "source": "aqa_ppq:trilogy_2025_p2h_05.5"
    },
    {
        "id": "ir_explain_claims",
        "qtype": "level_of_response_6",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "infrared_radiation",
        "syllabus_codes": [
            "6.6.2.2.a"
        ],
        "atoms": [
            "thermal_equilibrium_rates"
        ],
        "prompt": "A black cube and a white cube near an infrared heater: the black cube's temperature rises faster at first; after a few minutes both stop changing temperature. Explain these observations, referring to absorption and emission of radiation. Tick the statements that belong.",
        "facility_pct": 10,
        "marks": 3,
        "lor": {
            "points": [
                {
                    "text": "The black surface absorbs infrared radiation at a greater rate than the white surface",
                    "creditworthy": true
                },
                {
                    "text": "As a cube gets hotter it emits radiation at a greater rate",
                    "creditworthy": true
                },
                {
                    "text": "The temperature becomes constant when the absorption rate equals the emission rate",
                    "creditworthy": true
                },
                {
                    "text": "The cubes absorb heat from the heater until they are full",
                    "creditworthy": false,
                    "misconception_id": "heat_not_radiation_language"
                },
                {
                    "text": "White surfaces are the best emitters, so the white cube stays cooler",
                    "creditworthy": false,
                    "misconception_id": "shiny_white_called_good_emitter"
                }
            ]
        },
        "explanation": "Black absorbs infrared faster than white (better absorber); as each cube warms it emits more; the temperature becomes constant when absorption rate equals emission rate. Answers in terms of 'absorbing heat' were given no credit on the real paper: it must be infrared RADIATION.",
        "applicable_misconceptions": [
            "heat_not_radiation_language",
            "shiny_white_called_good_emitter"
        ],
        "source": "aqa_ppq:trilogy_2025_p2h_05.5"
    },
    {
        "id": "ir_camera",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "H",
        "topic": "6.6",
        "subtag": "infrared_radiation",
        "syllabus_codes": [
            "6.6.2.2.a"
        ],
        "atoms": [
            "ir_temperature_link"
        ],
        "prompt": "An infrared camera shows different parts of a hand in different colours. Explain why the camera can show that parts of the hand are at different temperatures.",
        "facility_pct": 10,
        "choices": [
            {
                "text": "Hotter parts emit more infrared, and the camera shows different amounts of infrared as different colours"
            },
            {
                "text": "The camera sees the heat inside the hand",
                "misconception_id": "heat_not_radiation_language"
            },
            {
                "text": "All parts of the hand emit the same infrared, but some reflect more light",
                "misconception_id": "ir_temperature_link_missed"
            },
            {
                "text": "The hand absorbs infrared from the camera"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "Hotter parts of the hand EMIT MORE infrared radiation; the camera displays different amounts of infrared as different colours. Both links were needed; only 10% scored in 2021.",
        "applicable_misconceptions": [
            "heat_not_radiation_language",
            "ir_temperature_link_missed"
        ],
        "source": "aqa_ppq:trilogy_2021_p2h_05.1"
    },
    {
        "id": "ir_all_bodies",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "infrared_radiation",
        "syllabus_codes": [
            "6.6.2.2.a"
        ],
        "atoms": [
            "ir_temperature_link"
        ],
        "prompt": "Which statement about infrared emission is correct?",
        "choices": [
            {
                "text": "All objects emit infrared; hotter objects emit more of it"
            },
            {
                "text": "Only hot objects emit infrared",
                "misconception_id": "ir_temperature_link_missed"
            },
            {
                "text": "Only black objects emit infrared",
                "misconception_id": "shiny_white_called_good_emitter"
            },
            {
                "text": "Objects emit infrared only while they are being heated",
                "misconception_id": "thermal_equilibrium_missed"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "ALL objects emit infrared radiation; the hotter the object, the more infrared it emits per second. (Emission does not switch on at some special temperature.)",
        "applicable_misconceptions": [
            "ir_temperature_link_missed",
            "shiny_white_called_good_emitter",
            "thermal_equilibrium_missed"
        ],
        "source": "authored"
    },
    {
        "id": "ir_bottles_cooling",
        "qtype": "mcq",
        "board": "aqa_trilogy_8464",
        "tier": "FH",
        "topic": "6.6",
        "subtag": "infrared_radiation",
        "syllabus_codes": [
            "6.6.2.2.e.ii"
        ],
        "atoms": [
            "ir_emission_surface"
        ],
        "prompt": "Two identical bottles of hot water, one matt black and one shiny silver, are left to cool from the same temperature. Which cools faster, and why?",
        "diagram": {
            "kind": "radiation_demo",
            "params": {
                "variant": "two_bottles"
            }
        },
        "choices": [
            {
                "text": "The matt black bottle, because matt black is the better emitter of infrared"
            },
            {
                "text": "The shiny bottle, because shiny surfaces emit the most infrared",
                "misconception_id": "shiny_white_called_good_emitter"
            },
            {
                "text": "The matt black bottle, because black soaks up its own heat",
                "misconception_id": "heat_not_radiation_language"
            },
            {
                "text": "Both the same, because they hold the same water"
            }
        ],
        "answerIndex": 0,
        "marks": 1,
        "explanation": "The matt black bottle: matt black is the better EMITTER of infrared, so it loses energy by radiation faster, giving the steeper cooling curve.",
        "applicable_misconceptions": [
            "shiny_white_called_good_emitter",
            "heat_not_radiation_language"
        ],
        "source": "authored"
    }
]
  };

  window.TRILOGY_TOPICS["6.6"] = CONFIG;
})();
