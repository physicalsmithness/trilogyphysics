/* ============================================================================
   Trilogy Physics - TOPIC_CONFIG for Waves 6.6, v0.1
   ----------------------------------------------------------------------------
   Per-topic config for the one shared engine (d016/d017). Mirrors
   app/topics/forces_6_5.js. AUTHORED CONTENT: ATOMS and MISCONCEPTIONS are the
   ratified Waves 6.6 vocabulary (review/trilogy_waves_vocabulary_proposal.md,
   RATIFIED d043, 2026-06-11).

   ITEMS: authored by subtag, one batch per review/<subtag>.md. Batches present:
   wave_basics (6.6.1.1), wave_properties (6.6.1.2.a/b/c/e/g.i).

   Engine item shape (app/engine.js grader):
     { id, qtype, tier, atom, syllabus, prompt, explanation?, diagram?,
       distractors? | claims? | calc? }
     qtype: mcq_single | mcq_multi | short | calc_workings
            (+ "widget" items per d035: widget:{kind,config}; the engine
             qtype:"widget" submit flow is Housing wiring, pending - these
             items carry pending_engine:"widget_qtype" until it lands)
     tier : foundation | higher | both   (d005)
   diagram:{kind,params} routes to the Waves Widgets registry (static kinds,
   live). equation_sheet carried on numeric items (principle 6). Calc-grader
   limits honoured (6.5 findings): no prefix grading (interim_for:"calc_prefix"
   MCQs), no multi-letter symbols, no ^ operator. v=f*L and f=1/T grade full
   (lambda authored as single symbol L).
   ============================================================================ */

(function () {
  "use strict";

  window.TRILOGY_TOPICS = window.TRILOGY_TOPICS || {};

  // Atom registry (ratified vocabulary section 2; grouped by subtag)
  const ATOMS = [
    { slug: "transverse_longitudinal_classify", label: "Classify a wave as transverse/longitudinal", subtag: "wave_basics" },
    { slug: "transverse_definition",       label: "Define a transverse wave",        subtag: "wave_basics" },
    { slug: "longitudinal_definition",     label: "Define a longitudinal wave",      subtag: "wave_basics" },
    { slug: "compression_rarefaction_identify", label: "Identify compressions and rarefactions", subtag: "wave_basics" },
    { slug: "wave_not_medium",             label: "The wave travels, not the medium", subtag: "wave_basics" },
    { slug: "amplitude_definition",        label: "Define amplitude",                subtag: "wave_properties" },
    { slug: "wavelength_definition",       label: "Define wavelength",               subtag: "wave_properties" },
    { slug: "frequency_definition",        label: "Define frequency",                subtag: "wave_properties" },
    { slug: "period_definition",           label: "Define period",                   subtag: "wave_properties" },
    { slug: "mark_wavelength_on_diagram",  label: "Mark/identify wavelength on a diagram", subtag: "wave_properties" },
    { slug: "mark_amplitude_on_diagram",   label: "Mark/identify amplitude on a diagram",  subtag: "wave_properties" },
    { slug: "compare_two_waves",           label: "Compare two displayed waves",     subtag: "wave_properties" },
    { slug: "period_from_trace",           label: "Read the period off a trace",     subtag: "wave_properties" },
    { slug: "wave_energy_transfer",        label: "Waves transfer energy",           subtag: "wave_properties" },
    { slug: "wave_speed_calc",             label: "Wave speed v = f lambda",         subtag: "wave_calculations" },
    { slug: "wave_equation_recall",        label: "Recall/select v = f lambda",      subtag: "wave_calculations" },
    { slug: "period_frequency_calc",       label: "f = 1/T and T = 1/f",             subtag: "wave_calculations" },
    { slug: "echo_distance_doubling",      label: "Echo timing: d = 2x",             subtag: "wave_calculations" },
    { slug: "wave_equation_qualitative",   label: "Qualitative v = f lambda reasoning", subtag: "wave_calculations" },
    { slug: "chained_wave_calc",           label: "Chained wave calculations (d037)", subtag: "wave_calculations" },
    { slug: "speed_sound_direct_method",   label: "Speed of sound: direct method",   subtag: "wave_measurement" },
    { slug: "speed_sound_echo_method",     label: "Speed of sound: echo method",     subtag: "wave_measurement" },
    { slug: "ripple_tank_method",          label: "RP20 ripple tank method",         subtag: "wave_measurement" },
    { slug: "several_wavelengths_measured", label: "Measure across several wavelengths", subtag: "wave_measurement" },
    { slug: "string_standing_wave_method", label: "RP20 waves on a string",          subtag: "wave_measurement" },
    { slug: "frequency_count_method",      label: "Count waves to find frequency",   subtag: "wave_measurement" },
    { slug: "mean_of_repeats",             label: "Mean of repeated readings",       subtag: "wave_measurement" },
    { slug: "precision_uncertainty_basics", label: "Precision and uncertainty basics", subtag: "wave_measurement" },
    { slug: "refraction_name",             label: "Name refraction",                 subtag: "refraction_boundaries" },
    { slug: "ray_diagram_construct",       label: "Construct a refraction ray diagram", subtag: "refraction_boundaries" },
    { slug: "refraction_direction",        label: "Which way the ray bends",         subtag: "refraction_boundaries" },
    { slug: "refraction_speed_cause",      label: "Refraction caused by speed change (HT)", subtag: "refraction_boundaries" },
    { slug: "wavefront_explanation",       label: "Wavefront explanation of refraction (HT)", subtag: "refraction_boundaries" },
    { slug: "frequency_unchanged_at_boundary", label: "Frequency unchanged at a boundary", subtag: "refraction_boundaries" },
    { slug: "wavelength_dependent_behaviour", label: "Wavelength-dependent behaviour (HT)", subtag: "refraction_boundaries" },
    { slug: "em_order",                    label: "Order of the EM spectrum",        subtag: "em_spectrum" },
    { slug: "em_ends_identify",            label: "Identify the spectrum ends",      subtag: "em_spectrum" },
    { slug: "freq_wavelength_inverse",     label: "Long wavelength = low frequency", subtag: "em_spectrum" },
    { slug: "em_common_properties",        label: "Common EM properties",            subtag: "em_spectrum" },
    { slug: "em_continuous_spectrum",      label: "Continuous spectrum",             subtag: "em_spectrum" },
    { slug: "visible_limited_detection",   label: "Eyes detect only visible",        subtag: "em_spectrum" },
    { slug: "visible_colour_order",        label: "Colour order within visible",     subtag: "em_spectrum" },
    { slug: "em_wavelength_magnitude",     label: "Place a wavelength in its region", subtag: "em_spectrum" },
    { slug: "radio_from_oscillations",     label: "Radio from circuit oscillations (HT)", subtag: "em_origins" },
    { slug: "radio_induce_ac",             label: "Absorbed radio induces a.c. (HT)", subtag: "em_origins" },
    { slug: "gamma_from_nucleus",          label: "Gamma originates in the nucleus", subtag: "em_origins" },
    { slug: "uv_hazards",                  label: "UV hazards",                      subtag: "em_dangers" },
    { slug: "ionising_hazards",            label: "Ionising X/gamma hazards",        subtag: "em_dangers" },
    { slug: "hazard_matched_to_group",     label: "Match hazard to EM group",        subtag: "em_dangers" },
    { slug: "dose_as_risk_measure",        label: "Dose (Sv) measures risk",         subtag: "em_dangers" },
    { slug: "risk_data_conclusions",       label: "Conclusions from dose data",      subtag: "em_dangers" },
    { slug: "use_despite_risk",            label: "Justify use despite risk",        subtag: "em_dangers" },
    { slug: "em_use_match",                label: "Match EM group to use",           subtag: "em_uses" },
    { slug: "em_use_explain",              label: "Explain suitability for a use (HT)", subtag: "em_uses" },
    { slug: "communication_uses",          label: "EM communication uses",           subtag: "em_uses" },
    { slug: "ir_emission_surface",         label: "Best/worst IR emitters",          subtag: "infrared_radiation" },
    { slug: "ir_absorption_surface",       label: "Best/worst IR absorbers",         subtag: "infrared_radiation" },
    { slug: "rp21_method",                 label: "RP21 method essentials",          subtag: "infrared_radiation" },
    { slug: "cooling_curve_interpret",     label: "Interpret heating/cooling curves", subtag: "infrared_radiation" },
    { slug: "ir_temperature_link",         label: "Hotter emits more IR",            subtag: "infrared_radiation" },
    { slug: "thermal_equilibrium_rates",   label: "Constant temp = absorb rate = emit rate", subtag: "infrared_radiation" }
  ];

  // Misconception registry (ratified vocabulary section 3 + d043 rulings).
  // [widget] = also a Widgets 6.6 scorer errorCode (d035 one-taxonomy ruling).
  // NEW = NEW_FLAG raised during authoring, awaiting ratification.
  const MISCONCEPTIONS = [
    { slug: "sound_called_transverse",        label: "Called sound a transverse wave" },
    { slug: "updown_sideways_vague",          label: "'Up and down / side to side' with no reference directions" },
    { slug: "perpendicular_to_what_missing",  label: "'Perpendicular' without saying to what" },
    { slug: "oscillation_term_missing",       label: "Definition with no oscillations/vibrations" },
    { slug: "compression_rarefaction_confused", label: "Swapped compression and rarefaction" },
    { slug: "medium_travels_with_wave",       label: "Thought the medium travels with the wave (NEW)" },
    { slug: "amplitude_peak_to_trough",       label: "Amplitude taken crest-to-trough (2A) [widget]" },
    { slug: "wavelength_half_marked",         label: "Wavelength marked as a half (crest to trough) [widget]" },
    { slug: "wavelength_peak_to_trough",      label: "Wavelength marked as the diagonal crest-trough [widget]" },
    { slug: "amplitude_diagonal",             label: "Amplitude marked as a diagonal [widget]" },
    { slug: "wavelength_c_to_r",              label: "Longitudinal wavelength marked C-to-R (half) [widget]" },
    { slug: "period_frequency_confused",      label: "Swapped period and frequency" },
    { slug: "wave_equation_inverted",         label: "v=f*lambda divided/built the wrong way" },
    { slug: "reciprocal_not_taken",           label: "f=1/T: returned the given value (divided by one)" },
    { slug: "stem_numbers_multiplied",        label: "Multiplied two stem numbers regardless of physics" },
    { slug: "graph_readoff_left_as_answer",   label: "Graph read-off submitted as the final answer (WS, d043)" },
    { slug: "faster_means_longer_time",       label: "Faster speed taken to mean a longer time" },
    { slug: "echo_factor_two_missed",         label: "Echo timing: factor of 2 missed [widget]" },
    { slug: "apparatus_described_not_method", label: "Described the apparatus instead of the method" },
    { slug: "measurement_purpose_missing",    label: "Measurements taken but never used" },
    { slug: "single_wavelength_measured",     label: "Measured one wavelength, not across several" },
    { slug: "mean_across_different_quantities", label: "Averaged values that are not repeats of one quantity" },
    { slug: "counted_loops_not_nodes",        label: "Counted loops as nodes (nodes = loops + 1) [widget]" },
    { slug: "refraction_term_unknown",        label: "Could not name refraction" },
    { slug: "bent_wrong_way",                 label: "Refracted ray bent the wrong way [widget]" },
    { slug: "equal_angle_no_refraction",      label: "Drew r = i (no refraction) [widget]" },
    { slug: "snell_angle_off",                label: "Right direction, refraction angle off [widget]" },
    { slug: "normal_not_drawn",               label: "Normal omitted / angles from the surface" },
    { slug: "density_cited_not_speed",        label: "Explained refraction by density, not speed change" },
    { slug: "speed_change_direction_unstated", label: "Speed 'changes' with no faster/slower" },
    { slug: "boundary_frequency_not_constant", label: "Let frequency change at a boundary" },
    { slug: "em_order_confused",              label: "Misplaced an EM region [widget: em_off_by_one_region]" },
    { slug: "spectrum_ends_swapped",          label: "Swapped the spectrum ends [widget]" },
    { slug: "freq_wavelength_inverse_missed", label: "Long wavelength paired with high frequency" },
    { slug: "red_called_shortest",            label: "Wrong visible colour order" },
    { slug: "property_answered_with_use",     label: "Gave a use when asked for a property" },
    { slug: "radio_oscillation_link_missed",  label: "No oscillation link for radio emission/absorption" },
    { slug: "em_origin_swapped",              label: "Swapped the origins of radio and gamma (NEW)" },
    { slug: "ionising_confused_with_radioactive", label: "Called X/gamma 'radioactive' instead of ionising" },
    { slug: "risk_unqualified",               label: "Bare 'cancer'/'burning' with no qualification" },
    { slug: "hazard_wrong_for_group",         label: "Wrong risk attached to the wrong EM group" },
    { slug: "dose_magnitude_misread",         label: "Misread dose magnitudes (0.100 vs 100 mSv)" },
    { slug: "protection_mechanism_vague",     label: "'The screen protects' with no absorption mechanism" },
    { slug: "microwave_only_cooking",         label: "Microwaves = ovens only; no communications use" },
    { slug: "ultrasound_treated_as_em",       label: "Offered ultrasound as an EM wave" },
    { slug: "shiny_white_called_good_emitter", label: "Inverted the IR surface ranking" },
    { slug: "final_temp_cited_not_rate",      label: "Cited final temperature where the rate was asked" },
    { slug: "heat_not_radiation_language",    label: "'Absorbs heat' instead of IR radiation" },
    { slug: "thermal_equilibrium_missed",     label: "Missed absorb rate = emit rate at constant temp" },
    { slug: "ir_temperature_link_missed",     label: "No link from IR amount to temperature" },
    { slug: "tir_not_recognised",             label: "TIR not recognised [widget; DORMANT for Trilogy, d043]" },
    { slug: "wrong_formula_rearrangement",    label: "Rearranged the equation the wrong way" },
    { slug: "chain_prep_stage_skipped",       label: "Skipped a prep stage; used a raw stem value (6.5 NEW)" },
    { slug: "chain_intermediate_as_final",    label: "Gave an intermediate stage value as the final answer (6.5 NEW)" },
    { slug: "picked_given_value",             label: "Answered with a value lifted from the stem" },
    { slug: "power_of_ten_evaluation_error",  label: "Standard-form / place-value slip in the evaluation" },
    { slug: "rounding_mistake",               label: "Right method, rounding/precision slip" },
    { slug: "graph_scale_misread",            label: "Misread the graph scale / gridlines" },
    { slug: "prefix_not_converted",           label: "Did not convert a prefix (kHz, GHz, ms, nm, cm)" },
    { slug: "sig_figs_not_applied",           label: "Did not give the answer to the required sig figs" },
    { slug: "proportionality_stated_as_increases", label: "Said 'increases' instead of directly proportional" },
    { slug: "freehand_line_not_ruled",        label: "Best-fit line drawn freehand / wrong shape" },
    { slug: "repeatability_reproducibility_confused", label: "Confused repeatability and reproducibility" },
    { slug: "uncertainty_given_as_range",     label: "Uncertainty given as the full range, not half (WS, d043)" },
    { slug: "digital_reading_trusted_no_random_error", label: "Digital devices 'cannot show random error' (WS, d043)" }
  ];

  const CONFIG = {
    id: "6.6",
    slug: "waves",
    name: "Waves",
    board: "AQA Trilogy 8464",
    atoms: ATOMS,
    misconceptions: MISCONCEPTIONS,
    diagram_kinds: ["wave_train", "wavefronts", "longitudinal_wave", "wave_scenario",
                    "ripple_tank", "standing_wave", "em_spectrum", "em_origins",
                    "em_uses", "refraction_wavefronts", "refraction_ray",
                    "material_wave_behaviour", "radiation_demo"],

    items: [
      /* Batch 1a: wave_basics (6.6.1.1.a-f). Transverse vs longitudinal,
         compressions/rarefactions, wave-not-medium. Shapes mirror the AQA
         Trilogy bank (2018-2025). See review/wave_basics.md. */
      {
        id: "wb_sound_type", qtype: "mcq_single", tier: "both",
        atom: "transverse_longitudinal_classify", syllabus: "6.6.1.1.d",
        source: "aqa_ppq:trilogy_2018_p2f_02.2", facility_pct: 55,
        prompt: "What type of wave is a sound wave travelling through air?",
        explanation: "Sound in air is longitudinal: the air particles oscillate parallel to the direction the sound travels, making compressions and rarefactions.",
        distractors: [
          { id: "a", text: "Longitudinal", status: "correct" },
          { id: "b", text: "Transverse", status: "wrong", misconception: "sound_called_transverse" },
          { id: "c", text: "Electromagnetic", status: "wrong" }
        ]
      },
      {
        id: "wb_ripples_type", qtype: "mcq_single", tier: "both",
        atom: "transverse_longitudinal_classify", syllabus: "6.6.1.1.b",
        prompt: "Ripples on a water surface are an example of which type of wave?",
        explanation: "Water-surface ripples are transverse: the surface oscillates up and down, perpendicular to the direction the ripples travel across the water.",
        distractors: [
          { id: "a", text: "Transverse", status: "correct" },
          { id: "b", text: "Longitudinal", status: "wrong" },
          { id: "c", text: "Electromagnetic", status: "wrong" }
        ]
      },
      {
        id: "wb_pick_longitudinal", qtype: "mcq_single", tier: "both",
        atom: "transverse_longitudinal_classify", syllabus: "6.6.1.1.a",
        prompt: "Which of the following waves is longitudinal?",
        explanation: "Sound is the longitudinal one. Water ripples and all electromagnetic waves (radio, visible light) are transverse.",
        distractors: [
          { id: "a", text: "A sound wave in air", status: "correct" },
          { id: "b", text: "A ripple on a pond", status: "wrong" },
          { id: "c", text: "A radio wave", status: "wrong" },
          { id: "d", text: "A light wave", status: "wrong" }
        ]
      },
      {
        id: "wb_transverse_def", qtype: "mcq_single", tier: "both",
        atom: "transverse_definition", syllabus: "6.6.1.1.e",
        source: "aqa_ppq:trilogy_2024_p2h_03.2", facility_pct: 20,
        prompt: "What is meant by a 'transverse wave'?",
        explanation: "Both parts are needed: the oscillations, and that they are perpendicular to the direction of energy transfer. AQA refuses the mark if either is missing.",
        distractors: [
          { id: "a", text: "A wave in which the oscillations are perpendicular to the direction of energy transfer", status: "correct" },
          { id: "b", text: "A wave that moves up and down", status: "wrong", misconception: "updown_sideways_vague" },
          { id: "c", text: "A wave in which the oscillations are perpendicular", status: "wrong", misconception: "perpendicular_to_what_missing" },
          { id: "d", text: "A wave in which the oscillations are parallel to the direction of energy transfer", status: "wrong" }
        ]
      },
      {
        id: "wb_longitudinal_def", qtype: "mcq_single", tier: "both",
        atom: "longitudinal_definition", syllabus: "6.6.1.1.e",
        prompt: "What is meant by a 'longitudinal wave'?",
        explanation: "Longitudinal: oscillations parallel to the direction of energy transfer, producing compressions and rarefactions.",
        distractors: [
          { id: "a", text: "A wave in which the oscillations are parallel to the direction of energy transfer", status: "correct" },
          { id: "b", text: "A wave in which the oscillations are perpendicular to the direction of energy transfer", status: "wrong" },
          { id: "c", text: "A wave that moves side to side", status: "wrong", misconception: "updown_sideways_vague" },
          { id: "d", text: "A wave in which the particles travel along with the wave", status: "wrong", misconception: "medium_travels_with_wave" }
        ]
      },
      {
        id: "wb_difference_claims", qtype: "short", tier: "both",
        atom: "transverse_definition", syllabus: "6.6.1.1.e", marks: 2,
        source: "aqa_ppq:trilogy_2023_p2h_03.4", facility_pct: 25,
        prompt: "Describe the difference between longitudinal waves and transverse waves. Tick the statements that should be part of a full answer.",
        explanation: "The difference is the direction of the oscillations RELATIVE to the direction of energy transfer: perpendicular (transverse) versus parallel (longitudinal). 'Up and down versus side to side' earns nothing on its own.",
        claims: [
          { id: "a", text: "In a transverse wave the oscillations are perpendicular to the direction of energy transfer", correct: true },
          { id: "b", text: "In a longitudinal wave the oscillations are parallel to the direction of energy transfer", correct: true },
          { id: "c", text: "Transverse waves go up and down; longitudinal waves go side to side", correct: false, misconception: "updown_sideways_vague" },
          { id: "d", text: "Only transverse waves transfer energy", correct: false },
          { id: "e", text: "Longitudinal waves show compressions and rarefactions", correct: true }
        ]
      },
      {
        id: "wb_label_compression", qtype: "mcq_single", tier: "both",
        atom: "compression_rarefaction_identify", syllabus: "6.6.1.1.c",
        source: "aqa_ppq:trilogy_2023_p2f_04.1", facility_pct: 30,
        diagram: { kind: "longitudinal_wave", params: { cycles: 3, mark: { labelCR: false } } },
        prompt: "On the diagram, what are the regions where the particles are closest together called?",
        explanation: "Where the particles crowd together is a compression; where they spread out is a rarefaction.",
        distractors: [
          { id: "a", text: "Compressions", status: "correct" },
          { id: "b", text: "Rarefactions", status: "wrong", misconception: "compression_rarefaction_confused" },
          { id: "c", text: "Amplitudes", status: "wrong" },
          { id: "d", text: "Reflections", status: "wrong" }
        ]
      },
      {
        id: "wb_rarefaction_meaning", qtype: "mcq_single", tier: "both",
        atom: "compression_rarefaction_identify", syllabus: "6.6.1.1.c",
        source: "aqa_ppq:trilogy_2024_p2f_03.6", facility_pct: 25,
        prompt: "When sound waves travel through air, what is a rarefaction?",
        explanation: "A rarefaction is a region where the air particles are more spread out (lower pressure). A compression is the opposite.",
        distractors: [
          { id: "a", text: "A region where the air particles are spread further apart", status: "correct" },
          { id: "b", text: "A region where the air particles are squashed together", status: "wrong", misconception: "compression_rarefaction_confused" },
          { id: "c", text: "The maximum displacement of a particle", status: "wrong" },
          { id: "d", text: "The number of waves per second", status: "wrong" }
        ]
      },
      {
        id: "wb_longitudinal_cr_distance", qtype: "mcq_single", tier: "higher",
        atom: "compression_rarefaction_identify", syllabus: "6.6.1.1.c",
        diagram: { kind: "longitudinal_wave", params: { cycles: 3, distractor: "wavelength_C_to_R" } },
        prompt: "A student marks the distance from the centre of a compression to the centre of the NEXT RAREFACTION and calls it one wavelength. What is the distance the student has marked?",
        explanation: "One wavelength on a longitudinal wave is compression to the next compression (or R to R). C to the adjacent R is only HALF a wavelength.",
        distractors: [
          { id: "a", text: "Half a wavelength", status: "correct" },
          { id: "b", text: "One wavelength", status: "wrong", misconception: "wavelength_c_to_r" },
          { id: "c", text: "Two wavelengths", status: "wrong" },
          { id: "d", text: "One amplitude", status: "wrong" }
        ]
      },
      {
        id: "wb_duck_not_medium", qtype: "mcq_single", tier: "both",
        atom: "wave_not_medium", syllabus: "6.6.1.1.f",
        prompt: "A plastic duck floats on a ripple tank. As waves pass, the duck bobs up and down but does not move across the tank. What does this show?",
        explanation: "The duck stays put while the wave pattern travels: the WAVE (and its energy) moves through the water; the water itself does not travel with it.",
        distractors: [
          { id: "a", text: "The wave travels through the water, but the water itself does not travel with the wave", status: "correct" },
          { id: "b", text: "The water moves along with the wave across the tank", status: "wrong", misconception: "medium_travels_with_wave" },
          { id: "c", text: "Water waves do not transfer energy", status: "wrong" },
          { id: "d", text: "The duck is too heavy to be moved by the wave", status: "wrong" }
        ]
      },
      {
        id: "wb_duck_transverse", qtype: "mcq_single", tier: "both",
        atom: "transverse_longitudinal_classify", syllabus: "6.6.1.1.a",
        source: "aqa_ppq:trilogy_2019_p2f_07.2", facility_pct: 3,
        prompt: "The duck moves up and down as the waves pass horizontally. Which statement BEST explains how this demonstrates that water waves are transverse?",
        explanation: "The mark needs the perpendicular RELATION: the oscillation (vertical) is perpendicular to the direction of wave travel (horizontal). 'Up and down, not side to side' scored nothing on the real paper (only 3% gained this mark).",
        distractors: [
          { id: "a", text: "The duck oscillates perpendicular to the direction the wave travels", status: "correct" },
          { id: "b", text: "The duck goes up and down, not side to side", status: "wrong", misconception: "updown_sideways_vague" },
          { id: "c", text: "The duck is perpendicular to the wave", status: "wrong", misconception: "perpendicular_to_what_missing" },
          { id: "d", text: "The duck moves along with the wave", status: "wrong", misconception: "medium_travels_with_wave" }
        ]
      },
      {
        id: "wb_sound_particles", qtype: "mcq_single", tier: "both",
        atom: "wave_not_medium", syllabus: "6.6.1.1.f",
        prompt: "A loudspeaker plays a steady note. Which statement describes the air particles between the loudspeaker and a listener's ear?",
        explanation: "The particles oscillate back and forth about fixed positions, parallel to the direction the sound travels. The air does not flow from speaker to ear; the wave and its energy do.",
        distractors: [
          { id: "a", text: "They oscillate back and forth about fixed positions, parallel to the direction the sound travels", status: "correct" },
          { id: "b", text: "They travel with the wave from the loudspeaker to the ear", status: "wrong", misconception: "medium_travels_with_wave" },
          { id: "c", text: "They oscillate perpendicular to the direction the sound travels", status: "wrong", misconception: "sound_called_transverse" },
          { id: "d", text: "They stay completely still while the energy passes", status: "wrong" }
        ]
      },

      /* Batch 1b: wave_properties (6.6.1.2.a/b/c/e/g.i). Definitions of the
         four quantities, identify/mark on diagrams (widget items per d031/d035),
         compare two waves, energy transfer. See review/wave_properties.md. */
      {
        id: "wp_amplitude_def", qtype: "mcq_single", tier: "both",
        atom: "amplitude_definition", syllabus: "6.6.1.2.b",
        prompt: "What is the amplitude of a wave?",
        explanation: "Amplitude is the maximum displacement of a point on the wave from its undisturbed (rest) position: rest line to crest, NOT crest to trough.",
        distractors: [
          { id: "a", text: "The maximum displacement of a point on the wave from its undisturbed position", status: "correct" },
          { id: "b", text: "The distance from a crest to the next trough, measured vertically", status: "wrong", misconception: "amplitude_peak_to_trough" },
          { id: "c", text: "The distance from one crest to the next crest", status: "wrong" },
          { id: "d", text: "The number of waves passing a point each second", status: "wrong" }
        ]
      },
      {
        id: "wp_wavelength_def", qtype: "mcq_single", tier: "both",
        atom: "wavelength_definition", syllabus: "6.6.1.2.c",
        prompt: "What is the wavelength of a wave?",
        explanation: "Wavelength is the distance from a point on one wave to the EQUIVALENT point on the adjacent wave (crest to crest, or trough to trough).",
        distractors: [
          { id: "a", text: "The distance from a point on one wave to the equivalent point on the adjacent wave", status: "correct" },
          { id: "b", text: "The distance from a crest to the adjacent trough", status: "wrong", misconception: "wavelength_half_marked" },
          { id: "c", text: "The maximum displacement from the undisturbed position", status: "wrong" },
          { id: "d", text: "The time taken for one complete wave to pass a point", status: "wrong" }
        ]
      },
      {
        id: "wp_frequency_def", qtype: "mcq_single", tier: "both",
        atom: "frequency_definition", syllabus: "6.6.1.2.a",
        prompt: "What is the frequency of a wave?",
        explanation: "Frequency is the number of waves passing a fixed point each second, measured in hertz (Hz).",
        distractors: [
          { id: "a", text: "The number of waves passing a fixed point each second", status: "correct" },
          { id: "b", text: "The time taken for one complete wave to pass a fixed point", status: "wrong", misconception: "period_frequency_confused" },
          { id: "c", text: "The distance travelled by a wave each second", status: "wrong" },
          { id: "d", text: "The maximum displacement of the wave", status: "wrong" }
        ]
      },
      {
        id: "wp_period_def", qtype: "mcq_single", tier: "both",
        atom: "period_definition", syllabus: "6.6.1.2.a",
        source: "aqa_ppq:trilogy_2025_p2f_05.3", facility_pct: 48,
        prompt: "What is meant by the 'period of a wave'?",
        explanation: "The period is the TIME for one complete wave to pass a fixed point. (Waves per second is the frequency; they are reciprocals, T = 1/f.)",
        distractors: [
          { id: "a", text: "The time taken for one wave to pass a fixed point", status: "correct" },
          { id: "b", text: "The number of waves passing a fixed point each second", status: "wrong", misconception: "period_frequency_confused" },
          { id: "c", text: "The distance travelled by a wave in one second", status: "wrong" }
        ]
      },
      {
        id: "wp_amplitude_double_spot", qtype: "mcq_single", tier: "both",
        atom: "mark_amplitude_on_diagram", syllabus: "6.6.1.2.g.i",
        source: "in_style_of:aqa_trilogy_2019_duck_amplitude",
        diagram: { kind: "wave_train", params: { cycles: 2.5, distractor: "amplitude_double", mark: { restLine: true } } },
        prompt: "A student draws the arrow shown (crest to trough) and labels it 'amplitude'. What mistake has the student made?",
        explanation: "Crest to trough is TWICE the amplitude. Amplitude is measured from the undisturbed (rest) position to a crest (or to a trough). On the 2019 paper fewer than 10% halved the crest-trough height.",
        distractors: [
          { id: "a", text: "The arrow shows twice the amplitude; amplitude is from the rest position to a crest", status: "correct" },
          { id: "b", text: "Nothing is wrong; amplitude is from a crest to a trough", status: "wrong", misconception: "amplitude_peak_to_trough" },
          { id: "c", text: "The arrow should join two crests", status: "wrong" },
          { id: "d", text: "The arrow should be horizontal, not vertical", status: "wrong" }
        ]
      },
      {
        id: "wp_wavelength_half_spot", qtype: "mcq_single", tier: "both",
        atom: "mark_wavelength_on_diagram", syllabus: "6.6.1.2.g.i",
        diagram: { kind: "wave_train", params: { cycles: 2.5, distractor: "wavelength_half", mark: { restLine: true } } },
        prompt: "A student marks the horizontal distance from a crest to the NEXT TROUGH and labels it 'one wavelength'. What has the student actually marked?",
        explanation: "Crest to the adjacent trough is half a cycle, so the student has marked half a wavelength. One wavelength runs crest to crest (or any point to the equivalent point on the next wave).",
        distractors: [
          { id: "a", text: "Half a wavelength", status: "correct" },
          { id: "b", text: "One full wavelength", status: "wrong", misconception: "wavelength_half_marked" },
          { id: "c", text: "The amplitude", status: "wrong" },
          { id: "d", text: "Two wavelengths", status: "wrong" }
        ]
      },
      {
        id: "wp_mark_wavelength", qtype: "widget", tier: "both",
        atom: "mark_wavelength_on_diagram", syllabus: "6.6.1.2.g.i",
        pending_engine: "widget_qtype", marks: 2,
        widget: { kind: "wave_train", config: { cycles: 3, target: "wavelength" } },
        prompt: "Drag the two markers to show ONE WAVELENGTH on the wave.",
        explanation: "Any point to the equivalent point on the adjacent wave: crest to crest is the easiest. Method mark for the right landmarks and orientation; value mark for the right length."
      },
      {
        id: "wp_mark_amplitude", qtype: "widget", tier: "both",
        atom: "mark_amplitude_on_diagram", syllabus: "6.6.1.2.g.i",
        pending_engine: "widget_qtype", marks: 2,
        widget: { kind: "wave_train", config: { cycles: 3, target: "amplitude" } },
        prompt: "Drag the two markers to show the AMPLITUDE of the wave.",
        explanation: "Rest line to a crest (or rest line to a trough): the maximum displacement from the undisturbed position. Crest-to-trough scores the named error (twice the amplitude)."
      },
      {
        id: "wp_compare_two_waves", qtype: "mcq_single", tier: "both",
        atom: "compare_two_waves", syllabus: "6.6.1.2.g.i",
        source: "aqa_ppq:trilogy_2024_p2f_03.3", facility_pct: 45,
        prompt: "Two sound waves, A and B, are displayed on the same screen with the same settings. Wave A shows 6 complete waves across the screen; wave B shows 3. Both waves reach the same height above the rest line. Which statement compares the waves correctly?",
        explanation: "More complete cycles in the same time means a higher frequency (and so a shorter wavelength); the same height above the rest line means the same amplitude. On the 2024 paper most one-mark answers got the frequency difference but missed that the amplitudes were equal.",
        distractors: [
          { id: "a", text: "Wave A has a higher frequency than B; both have the same amplitude", status: "correct" },
          { id: "b", text: "Wave A has a larger amplitude than B", status: "wrong" },
          { id: "c", text: "Wave A has a longer wavelength than B", status: "wrong", misconception: "freq_wavelength_inverse_missed" },
          { id: "d", text: "Wave A has a longer period than B", status: "wrong", misconception: "period_frequency_confused" }
        ]
      },
      {
        id: "wp_energy_transfer", qtype: "mcq_single", tier: "foundation",
        atom: "wave_energy_transfer", syllabus: "6.6.1.2.e",
        source: "aqa_ppq:trilogy_2024_p2f_03.1", facility_pct: 90,
        prompt: "What is transferred by sound waves as they travel through the air?",
        explanation: "Waves transfer energy (and information) from the source to an absorber. They do not transfer matter.",
        distractors: [
          { id: "a", text: "Energy", status: "correct" },
          { id: "b", text: "Mass", status: "wrong", misconception: "medium_travels_with_wave" },
          { id: "c", text: "Temperature", status: "wrong" }
        ]
      },
      {
        id: "wp_wave_speed_def", qtype: "mcq_single", tier: "both",
        atom: "wave_energy_transfer", syllabus: "6.6.1.2.e",
        prompt: "What is meant by the 'wave speed'?",
        explanation: "Wave speed is the speed at which the energy is transferred (the speed the wave moves) through the medium.",
        distractors: [
          { id: "a", text: "The speed at which the energy is transferred through the medium", status: "correct" },
          { id: "b", text: "The speed at which the particles of the medium oscillate", status: "wrong", misconception: "medium_travels_with_wave" },
          { id: "c", text: "The number of waves passing a point each second", status: "wrong", misconception: "period_frequency_confused" }
        ]
      },
      {
        id: "wp_period_trace", qtype: "mcq_single", tier: "both",
        atom: "period_from_trace", syllabus: "6.6.1.2.a",
        source: "in_style_of:aqa_ppq:trilogy_2020_p2f_05.5", facility_pct: 25,
        prompt: "A microphone displays a sound wave on a screen. The screen shows exactly 2 complete waves in 0.008 s. What is the period of the wave?",
        explanation: "The period is the time for ONE complete wave: 0.008 / 2 = 0.004 s. On the 2020 paper, equal numbers wrongly read half a cycle (0.002 s) and the whole trace (0.008 s).",
        distractors: [
          { id: "a", text: "0.004 s", status: "correct" },
          { id: "b", text: "0.008 s", status: "wrong" },
          { id: "c", text: "0.002 s", status: "wrong" },
          { id: "d", text: "250 s", status: "wrong", misconception: "period_frequency_confused" }
        ]
      },

      /* Batch 2: wave_calculations (6.6.1.2.d/f + d037 chains). Single-formula
         calc_workings (v=fL, f=1/T grade full; lambda authored as L); prefix
         traps as interim MCQs (grader limit, 6.5 finding); the d037 chains in
         the enriched-MCQ form (6.5 batch-7 pattern: stages + per-mark scheme +
         failsAt per distractor). See review/wave_calculations.md. */
      {
        id: "wc_equation_recall", qtype: "mcq_single", tier: "both",
        atom: "wave_equation_recall", syllabus: "6.6.1.2.f", equation_sheet: "must_recall",
        source: "aqa_ppq:trilogy_2019_p2f_06.4", facility_pct: 22,
        prompt: "Which equation links wave speed (v), frequency (f) and wavelength (lambda)?",
        explanation: "v = f x lambda. With no equation sheet only 22% recalled it (2019 Foundation); when AQA prints the sheet, 90%+ select it. The wrong builds usually follow the word order of the stem.",
        distractors: [
          { id: "a", text: "wave speed = frequency x wavelength", status: "correct" },
          { id: "b", text: "frequency = wave speed x wavelength", status: "wrong", misconception: "wave_equation_inverted" },
          { id: "c", text: "wavelength = frequency x wave speed", status: "wrong", misconception: "wave_equation_inverted" },
          { id: "d", text: "wave speed = frequency + wavelength", status: "wrong" }
        ]
      },
      {
        id: "wc_wave_speed_calc", qtype: "calc_workings", tier: "both",
        atom: "wave_speed_calc", syllabus: "6.6.1.2.f", equation_sheet: "from_insert",
        source: "aqa_ppq:trilogy_2020_p2f_05.4", facility_pct: 93,
        prompt: "A wave has a frequency of 1650 Hz and a wavelength of 0.200 m. Calculate the wave speed. Use the equation: wave speed = frequency x wavelength (v = f L).",
        explanation: "v = f x lambda = 1650 x 0.200 = 330 m/s (the speed of sound in air).",
        calc: {
          knowns: { f: 1650, L: 0.200 },
          unknown: "v",
          expectedFinalValue: 330,
          expectedUnit: ["m/s"],
          equationCanonicalForms: ["v=f*L", "v=fL"],
          tolerance: 0.5,
          requireUnit: true,
          marks: 4
        }
      },
      {
        id: "wc_wavelength_calc", qtype: "calc_workings", tier: "both",
        atom: "wave_speed_calc", syllabus: "6.6.1.2.f", equation_sheet: "from_insert",
        source: "aqa_ppq:trilogy_2024_p2h_01.3", facility_pct: 90,
        prompt: "A wave on a string has a frequency of 45.0 Hz. The wave speed is 35.1 m/s. Calculate the wavelength of the wave. (v = f L)",
        explanation: "Rearrange v = f lambda to lambda = v / f = 35.1 / 45.0 = 0.78 m. Multiplying instead of dividing was the standard zero-mark route on this paper.",
        calc: {
          knowns: { v: 35.1, f: 45.0 },
          unknown: "L",
          expectedFinalValue: 0.78,
          expectedUnit: ["m"],
          equationCanonicalForms: ["L=v/f", "v=f*L"],
          tolerance: 0.005,
          requireUnit: true,
          marks: 4
        }
      },
      {
        id: "wc_frequency_calc", qtype: "calc_workings", tier: "both",
        atom: "wave_speed_calc", syllabus: "6.6.1.2.f", equation_sheet: "from_insert",
        source: "aqa_ppq:trilogy_2019_p2h_01.5", facility_pct: 52,
        prompt: "Electromagnetic waves have a wavelength of 0.125 m. The speed of electromagnetic waves is 300000000 m/s. Calculate the frequency of the waves. (v = f L)",
        explanation: "f = v / lambda = 300000000 / 0.125 = 2400000000 Hz (2.4 GHz). The classic error is the reciprocal: dividing the wrong way round gives 4.2 x 10^-10.",
        calc: {
          knowns: { v: 300000000, L: 0.125 },
          unknown: "f",
          expectedFinalValue: 2400000000,
          expectedUnit: ["Hz", "hertz"],
          equationCanonicalForms: ["f=v/L", "v=f*L"],
          tolerance: 1000000,
          requireUnit: true,
          marks: 4
        }
      },
      {
        id: "wc_period_calc", qtype: "calc_workings", tier: "both",
        atom: "period_frequency_calc", syllabus: "6.6.1.2.d", equation_sheet: "from_insert",
        source: "aqa_ppq:trilogy_2021_p2f_04.4", facility_pct: 85,
        prompt: "Water waves in a ripple tank have a frequency of 20 Hz. Calculate the period of the waves. Use the equation: period = 1 / frequency (T = 1/f).",
        explanation: "T = 1/f = 1/20 = 0.05 s. (T = 1/f is on every equation sheet, including the minimal pre-Covid insert: always given.)",
        calc: {
          knowns: { f: 20 },
          unknown: "T",
          expectedFinalValue: 0.05,
          expectedUnit: ["s", "seconds", "second"],
          equationCanonicalForms: ["T=1/f"],
          tolerance: 0.001,
          requireUnit: true,
          marks: 4
        }
      },
      {
        id: "wc_freq_from_period", qtype: "calc_workings", tier: "both",
        atom: "period_frequency_calc", syllabus: "6.6.1.2.d", equation_sheet: "from_insert",
        source: "in_style_of:aqa_ppq:trilogy_2020_p2f_05.6",
        prompt: "A sound wave has a period of 0.004 s. Calculate the frequency of the wave. (f = 1/T)",
        explanation: "f = 1/T = 1/0.004 = 250 Hz. On the 2020 paper this part allowed full ECF from a wrongly-read period: the bank's cleanest from_previous_part exemplar.",
        calc: {
          knowns: { T: 0.004 },
          unknown: "f",
          expectedFinalValue: 250,
          expectedUnit: ["Hz", "hertz"],
          equationCanonicalForms: ["f=1/T"],
          tolerance: 0.5,
          requireUnit: true,
          marks: 4
        }
      },
      {
        id: "wc_period_khz_mcq", qtype: "mcq_single", tier: "both",
        atom: "period_frequency_calc", syllabus: "6.6.1.2.d", equation_sheet: "from_insert",
        interim_for: "calc_prefix", // TODO: convert to calc_workings once the grader grades prefix conversion
        source: "aqa_ppq:trilogy_2022_p2h_01.2", facility_pct: 10,
        prompt: "A sound wave has a frequency of 4.0 kHz. What is the period of the wave?",
        explanation: "Convert first: 4.0 kHz = 4000 Hz. T = 1/f = 1/4000 = 0.00025 s. On the real paper only 5% of Foundation students converted; 1/4.0 = 0.25 s was the standard wrong answer, and the unit mark was rarely earned.",
        distractors: [
          { id: "a", text: "0.00025 s", status: "correct" },
          { id: "b", text: "0.25 s", status: "wrong", misconception: "prefix_not_converted" },
          { id: "c", text: "4000 s", status: "wrong", misconception: "reciprocal_not_taken" },
          { id: "d", text: "0.0025 s", status: "wrong", misconception: "power_of_ten_evaluation_error" }
        ]
      },
      {
        id: "wc_period_ghz_mcq", qtype: "mcq_single", tier: "both",
        atom: "period_frequency_calc", syllabus: "6.6.1.2.d", equation_sheet: "from_insert",
        interim_for: "calc_prefix",
        source: "aqa_ppq:trilogy_2025_p2f_05.4",
        prompt: "Data is transmitted to satellites by electromagnetic waves with a frequency of 48 GHz. What is the period of the waves?",
        explanation: "48 GHz = 4.8 x 10^10 Hz. T = 1/f = 1/(4.8 x 10^10) = 2.1 x 10^-11 s. The real paper saw '1/48 = 48' (the value handed back) and unconverted 1/48 = 0.021 s.",
        distractors: [
          { id: "a", text: "2.1 x 10^-11 s", status: "correct" },
          { id: "b", text: "0.021 s", status: "wrong", misconception: "prefix_not_converted" },
          { id: "c", text: "48 s", status: "wrong", misconception: "reciprocal_not_taken" },
          { id: "d", text: "2.1 x 10^-8 s", status: "wrong", misconception: "power_of_ten_evaluation_error" }
        ]
      },
      {
        id: "wc_nm_output_mcq", qtype: "mcq_single", tier: "higher",
        atom: "wave_speed_calc", syllabus: "6.6.1.2.f", equation_sheet: "from_insert",
        interim_for: "calc_prefix",
        source: "aqa_ppq:trilogy_2025_p2h_03.4", facility_pct: 10,
        prompt: "A wave of visible light has a frequency of 6.25 x 10^14 Hz. The speed of light is 3.00 x 10^8 m/s. What is the wavelength of this light in nanometres (nm)?",
        explanation: "lambda = v/f = (3.00 x 10^8)/(6.25 x 10^14) = 4.8 x 10^-7 m. To nanometres DIVIDE by 10^-9: 480 nm. Under 10% managed this on the 2025 paper; multiplying by 10^-9, and reading nano as 10^-3 or 10^-6, were the named failures.",
        distractors: [
          { id: "a", text: "480 nm", status: "correct" },
          { id: "b", text: "4.8 x 10^-16 nm", status: "wrong", misconception: "prefix_not_converted" },
          { id: "c", text: "4.8 x 10^21 nm", status: "wrong", misconception: "power_of_ten_evaluation_error" },
          { id: "d", text: "0.48 nm", status: "wrong", misconception: "prefix_not_converted" }
        ]
      },
      {
        id: "wc_depth_wavelength", qtype: "mcq_single", tier: "higher",
        atom: "wave_equation_qualitative", syllabus: "6.6.1.2.f",
        source: "aqa_ppq:trilogy_2021_p2h_03.4", facility_pct: 20,
        prompt: "In a ripple tank, the deeper the water, the faster the waves travel. The frequency of the waves is kept constant. What happens to the wavelength of the waves in deeper water?",
        explanation: "v = f lambda with f fixed: if v goes up, lambda must go up in proportion. Under 20% scored on the real item; most ignored the given speed-depth fact or let the frequency change.",
        distractors: [
          { id: "a", text: "The wavelength increases", status: "correct" },
          { id: "b", text: "The wavelength decreases", status: "wrong" },
          { id: "c", text: "The wavelength stays the same and the frequency increases", status: "wrong", misconception: "boundary_frequency_not_constant" },
          { id: "d", text: "The wavelength stays the same", status: "wrong" }
        ]
      },
      {
        id: "wc_speed_time_qual", qtype: "mcq_single", tier: "both",
        atom: "wave_equation_qualitative", syllabus: "6.6.1.2.f",
        source: "aqa_ppq:trilogy_2023_p2f_04.6", facility_pct: 25,
        prompt: "The warmer the air, the faster sound travels through it. A device emits a sound that travels a fixed distance to a farmer. What happens to the time taken for the sound to reach the farmer on a warmer day?",
        explanation: "Same distance, higher speed, LESS time. On the 2023 paper many students stated the speed increases and then said the time would increase too: the speed-time inversion is the trap.",
        distractors: [
          { id: "a", text: "The time decreases", status: "correct" },
          { id: "b", text: "The time increases", status: "wrong", misconception: "faster_means_longer_time" },
          { id: "c", text: "The time stays the same", status: "wrong" }
        ]
      },
      {
        id: "wc_graph_prep_wavelength", qtype: "mcq_single", tier: "both",
        atom: "wave_speed_calc", syllabus: "6.6.1.2.f", equation_sheet: "from_insert",
        difficulty: "d2", marks: 4, facility_pct: 20, source: "aqa_ppq:trilogy_2022_p2f_06.4",
        prompt: "A graph shows how the speed of sound varies with air temperature. At 28.0 degrees C the graph shows a speed of 348 m/s. A sound wave with a frequency of 300 Hz travels through air at 28.0 degrees C. Determine the wavelength of the sound wave. (v = f L)",
        explanation: "Tier-2 prep-step calc (d038): read v = 348 m/s off the graph, THEN lambda = v/f = 348/300 = 1.16 m. The two named failures from the real paper: writing the graph value (348) as the final answer, and multiplying the two stem numbers (300 x 28).",
        calc: {
          markCategories: ["other_skill","substitution","rearrangement","evaluation"],
          stages: [
            { equation: "graph_read", knowns: {}, unknown: "v", expectedFinalValue: 348, expectedUnit: ["m/s"],
              markScheme: [ {mark:1,category:"other_skill",text:"v read from the graph at 28.0 C = 348 m/s"} ] },
            { equation: "v=f*L", knowns: { v: 348, f: 300 }, unknown: "L", expectedFinalValue: 1.16, expectedUnit: ["m"],
              gate: { kind: "from_previous_part" },
              markScheme: [ {mark:2,category:"substitution",text:"348 = 300 x L"}, {mark:3,category:"rearrangement",text:"L = 348 / 300"}, {mark:4,category:"evaluation",text:"L = 1.16 (m)"} ] }
          ]
        },
        distractors: [
          { id: "a", text: "1.16 m", status: "correct" },
          { id: "b", text: "348 m", status: "wrong", misconception: "graph_readoff_left_as_answer", failsAt: "stage2 skipped: the graph read-off submitted as the final answer" },
          { id: "c", text: "8400 m", status: "wrong", misconception: "stem_numbers_multiplied", failsAt: "no graph read: multiplied 300 by 28" },
          { id: "d", text: "0.862 m", status: "wrong", misconception: "wave_equation_inverted", failsAt: "stage2: divided f by v" }
        ]
      },
      {
        id: "wc_mean_speed_chain", qtype: "mcq_single", tier: "higher",
        atom: "wave_speed_calc", syllabus: "6.6.1.2.f", equation_sheet: "from_insert",
        difficulty: "d3", marks: 4, facility_pct: 5, source: "aqa_ppq:trilogy_2021_p2h_03.2",
        prompt: "A student measures waves in a ripple tank. Frequency readings: 9.8 Hz, 9.4 Hz, 9.3 Hz. Wavelength readings: 1.7 cm, 2.2 cm, 2.1 cm. Determine the mean wave speed in m/s. (v = f L)",
        explanation: "Mean f = (9.8+9.4+9.3)/3 = 9.5 Hz. Mean lambda = (1.7+2.2+2.1)/3 = 2.0 cm = 0.020 m. v = 9.5 x 0.020 = 0.19 m/s. Only ~5% converted the centimetres on the real paper.",
        calc: {
          markCategories: ["other_skill","other_skill","prefix_conv","evaluation"],
          stages: [
            { equation: "mean", knowns: {}, unknown: "f", expectedFinalValue: 9.5, expectedUnit: ["Hz"],
              markScheme: [ {mark:1,category:"other_skill",text:"mean f = 9.5 Hz"} ] },
            { equation: "mean", knowns: {}, unknown: "L", expectedFinalValue: 0.020, expectedUnit: ["m"],
              markScheme: [ {mark:2,category:"other_skill",text:"mean lambda = 2.0 cm"}, {mark:3,category:"prefix_conv",text:"= 0.020 m"} ] },
            { equation: "v=f*L", knowns: { f: 9.5, L: 0.020 }, unknown: "v", expectedFinalValue: 0.19, expectedUnit: ["m/s"],
              gate: { kind: "from_previous_part" },
              markScheme: [ {mark:4,category:"evaluation",text:"v = 9.5 x 0.020 = 0.19 m/s"} ] }
          ]
        },
        distractors: [
          { id: "a", text: "0.19 m/s", status: "correct" },
          { id: "b", text: "19 m/s", status: "wrong", misconception: "prefix_not_converted", failsAt: "stage2: wavelength left in cm" },
          { id: "c", text: "0.17 m/s", status: "wrong", misconception: "mean_across_different_quantities", failsAt: "stage1: used the first readings only, no means" },
          { id: "d", text: "9.5 m/s", status: "wrong", misconception: "chain_intermediate_as_final", failsAt: "stopped after the mean frequency" }
        ]
      },
      {
        id: "wc_chain_travelling", qtype: "mcq_single", tier: "higher",
        atom: "chained_wave_calc", syllabus: "6.6.1.2.f", equation_sheet: "from_insert",
        difficulty: "d2", marks: 5, facility_pct: null, source: "in_style_of:d037_travelling_waves_L5",
        prompt: "A loudspeaker emits sound with a frequency of 170 Hz and a wavelength of 2.0 m. How long does the sound take to reach a cliff 680 m away? Use v = f L and v = d/t.",
        explanation: "Stage 1: v = f lambda = 170 x 2.0 = 340 m/s. Stage 2: t = d/v = 680/340 = 2.0 s. The d037 catalogue's L5 'travelling waves' chain, barely asked in the papers so far: gap-pass coverage.",
        calc: {
          markCategories: ["substitution","non_final_evaluation","substitution","rearrangement","evaluation"],
          stages: [
            { equation: "v=f*L", knowns: { f: 170, L: 2.0 }, unknown: "v", expectedFinalValue: 340, expectedUnit: ["m/s"],
              markScheme: [ {mark:1,category:"substitution",text:"v = 170 x 2.0"}, {mark:2,category:"non_final_evaluation",text:"v = 340 (m/s)"} ] },
            { equation: "v=d/t", knowns: { d: 680, v: 340 }, unknown: "t", expectedFinalValue: 2.0, expectedUnit: ["s"],
              gate: { kind: "from_previous_part" },
              markScheme: [ {mark:3,category:"substitution",text:"340 = 680 / t"}, {mark:4,category:"rearrangement",text:"t = 680 / 340"}, {mark:5,category:"evaluation",text:"t = 2.0 (s)"} ] }
          ]
        },
        distractors: [
          { id: "a", text: "2.0 s", status: "correct" },
          { id: "b", text: "340 s", status: "wrong", misconception: "chain_intermediate_as_final", failsAt: "stopped at stage 1 and gave the speed as the time" },
          { id: "c", text: "4.0 s", status: "wrong", misconception: "chain_prep_stage_skipped", failsAt: "stage1 skipped: divided 680 by the frequency 170" },
          { id: "d", text: "0.5 s", status: "wrong", misconception: "wrong_formula_rearrangement", failsAt: "stage2: divided v by d" }
        ]
      },
      {
        id: "wc_chain_period_first", qtype: "mcq_single", tier: "higher",
        atom: "chained_wave_calc", syllabus: "6.6.1.2.d", equation_sheet: "from_insert",
        difficulty: "d3", marks: 6, facility_pct: null, source: "in_style_of:d037_travelling_waves_with_period_L4",
        prompt: "A sound wave has a period of 0.0025 s and a wavelength of 0.85 m. How long does the sound take to travel 1020 m? Use f = 1/T, v = f L and v = d/t.",
        explanation: "Stage 1: f = 1/0.0025 = 400 Hz. Stage 2: v = 400 x 0.85 = 340 m/s. Stage 3: t = 1020/340 = 3.0 s. The full d037 three-formula waves chain.",
        calc: {
          markCategories: ["substitution","non_final_evaluation","substitution","non_final_evaluation","rearrangement","evaluation"],
          stages: [
            { equation: "f=1/T", knowns: { T: 0.0025 }, unknown: "f", expectedFinalValue: 400, expectedUnit: ["Hz"],
              markScheme: [ {mark:1,category:"substitution",text:"f = 1 / 0.0025"}, {mark:2,category:"non_final_evaluation",text:"f = 400 (Hz)"} ] },
            { equation: "v=f*L", knowns: { f: 400, L: 0.85 }, unknown: "v", expectedFinalValue: 340, expectedUnit: ["m/s"],
              gate: { kind: "from_previous_part" },
              markScheme: [ {mark:3,category:"substitution",text:"v = 400 x 0.85"}, {mark:4,category:"non_final_evaluation",text:"v = 340 (m/s)"} ] },
            { equation: "v=d/t", knowns: { d: 1020, v: 340 }, unknown: "t", expectedFinalValue: 3.0, expectedUnit: ["s"],
              gate: { kind: "from_previous_part" },
              markScheme: [ {mark:5,category:"rearrangement",text:"t = 1020 / 340"}, {mark:6,category:"evaluation",text:"t = 3.0 (s)"} ] }
          ]
        },
        distractors: [
          { id: "a", text: "3.0 s", status: "correct" },
          { id: "b", text: "340 s", status: "wrong", misconception: "chain_intermediate_as_final", failsAt: "stopped at stage 2 and gave the speed as the time" },
          { id: "c", text: "2.55 s", status: "wrong", misconception: "chain_prep_stage_skipped", failsAt: "stages 1-2 skipped: multiplied 1020 by the period" },
          { id: "d", text: "1200 s", status: "wrong", misconception: "stem_numbers_multiplied", failsAt: "divided 1020 by 0.85, ignoring the time formulae" }
        ]
      },
      {
        id: "wc_chain_echo_clap", qtype: "mcq_single", tier: "both",
        atom: "echo_distance_doubling", syllabus: "6.6.1.2.g.ii.i", equation_sheet: "must_recall",
        difficulty: "d2", marks: 4, facility_pct: null, source: "in_style_of:d037_echoes_L5+aqa_trilogy_2018_p2f_02.3",
        prompt: "A student stands 85 m from a large wall, claps two bricks together, and measures 0.50 s between the clap and the echo. Calculate the speed of sound. Use v = d/t.",
        explanation: "The sound goes there AND back: d = 2 x 85 = 170 m. v = d/t = 170/0.50 = 340 m/s. Forgetting the doubling gives 170 m/s, the named echo error (and the widget errorCode).",
        calc: {
          markCategories: ["substitution","non_final_evaluation","substitution","evaluation"],
          stages: [
            { equation: "d=2x", knowns: { x: 85 }, unknown: "d", expectedFinalValue: 170, expectedUnit: ["m"],
              markScheme: [ {mark:1,category:"substitution",text:"distance = 2 x 85"}, {mark:2,category:"non_final_evaluation",text:"d = 170 (m)"} ] },
            { equation: "v=d/t", knowns: { d: 170, t: 0.50 }, unknown: "v", expectedFinalValue: 340, expectedUnit: ["m/s"],
              gate: { kind: "from_previous_part" },
              markScheme: [ {mark:3,category:"substitution",text:"v = 170 / 0.50"}, {mark:4,category:"evaluation",text:"v = 340 (m/s)"} ] }
          ]
        },
        distractors: [
          { id: "a", text: "340 m/s", status: "correct" },
          { id: "b", text: "170 m/s", status: "wrong", misconception: "echo_factor_two_missed", failsAt: "stage1: used 85 m one-way, not there-and-back" },
          { id: "c", text: "42.5 m/s", status: "wrong", misconception: "stem_numbers_multiplied", failsAt: "multiplied 85 by 0.50" },
          { id: "d", text: "0.0059 m/s", status: "wrong", misconception: "wrong_formula_rearrangement", failsAt: "stage2: divided t by d" }
        ]
      },
      {
        id: "wc_chain_radar", qtype: "mcq_single", tier: "higher",
        atom: "echo_distance_doubling", syllabus: "6.6.1.2.f", equation_sheet: "must_recall",
        difficulty: "d3", marks: 4, facility_pct: null, source: "in_style_of:d037_echoes_L5_radar",
        prompt: "A radar pulse (an electromagnetic wave, speed 3.0 x 10^8 m/s) is sent towards an aircraft. The reflected pulse returns 1.2 x 10^-4 s after transmission. How far away is the aircraft? Use v = d/t.",
        explanation: "Total path = v x t = 3.0 x 10^8 x 1.2 x 10^-4 = 36000 m, which is there AND back. Distance to the aircraft = 36000/2 = 18000 m (18 km). Radar is the d037 echoes chain in a Trilogy-safe EM frame (d043 OQ-B).",
        calc: {
          markCategories: ["substitution","non_final_evaluation","substitution","evaluation"],
          stages: [
            { equation: "d=v*t", knowns: { v: 300000000, t: 0.00012 }, unknown: "d", expectedFinalValue: 36000, expectedUnit: ["m"],
              markScheme: [ {mark:1,category:"substitution",text:"d = 3.0 x 10^8 x 1.2 x 10^-4"}, {mark:2,category:"non_final_evaluation",text:"total path = 36000 (m)"} ] },
            { equation: "x=d/2", knowns: { d: 36000 }, unknown: "x", expectedFinalValue: 18000, expectedUnit: ["m"],
              gate: { kind: "from_previous_part" },
              markScheme: [ {mark:3,category:"substitution",text:"distance = 36000 / 2"}, {mark:4,category:"evaluation",text:"x = 18000 (m)"} ] }
          ]
        },
        distractors: [
          { id: "a", text: "18000 m", status: "correct" },
          { id: "b", text: "36000 m", status: "wrong", misconception: "echo_factor_two_missed", failsAt: "stage2: forgot the pulse travelled there and back" },
          { id: "c", text: "1800 m", status: "wrong", misconception: "power_of_ten_evaluation_error", failsAt: "stage1: power-of-ten slip in the standard-form product" },
          { id: "d", text: "4.0 x 10^-13 m", status: "wrong", misconception: "wrong_formula_rearrangement", failsAt: "stage1: divided t by v" }
        ]
      },

      /* Batch 3: wave_measurement (6.6.1.2.g.ii/g.iii, .i.iA/.i.iB/.i.ii).
         The worst-scoring 4/6-markers in the topic: methods authored as claim-
         point `short` items (interim level_of_response per d023/d034), the
         measurement-skill traps as MCQs over the scenario/standing-wave
         renders. See review/wave_measurement.md. */
      {
        id: "wm_ripple_method_claims", qtype: "short", tier: "both",
        atom: "ripple_tank_method", syllabus: "6.6.1.2.i.iA", marks: 4,
        source: "aqa_ppq:trilogy_2019_p2h_02.1", facility_pct: 10,
        diagram: { kind: "ripple_tank", params: {} },
        prompt: "Describe how the ripple tank can be used to measure the wavelength, frequency and speed of water waves. Tick the statements that belong in a good method.",
        explanation: "The method is measurements and what is done with them: frequency from the signal generator (or counting waves per second), wavelength measured across SEVERAL spacings on the screen shadow and divided, then v = f x lambda. Describing what each part of the apparatus is for scored nothing on the real papers.",
        claims: [
          { id: "a", text: "Read the frequency from the signal generator, or count the waves passing a point in a known time", correct: true },
          { id: "b", text: "Photograph or freeze the shadow pattern and measure across several wavelengths with a ruler, then divide by the number of wavelengths", correct: true },
          { id: "c", text: "Calculate the wave speed using v = f x lambda", correct: true },
          { id: "d", text: "Explain what the lamp, motor and screen are each for", correct: false, misconception: "apparatus_described_not_method" },
          { id: "e", text: "Time how long a wave takes, without measuring any distance", correct: false, misconception: "measurement_purpose_missing" }
        ]
      },
      {
        id: "wm_several_wavelengths_why", qtype: "mcq_single", tier: "both",
        atom: "several_wavelengths_measured", syllabus: "6.6.1.2.i.iA",
        source: "aqa_ppq:trilogy_2023_p2h_03.1", facility_pct: 25,
        prompt: "When measuring wavelength on a ripple-tank image, why is it better to measure across several wavelengths and divide, rather than measure a single wavelength?",
        explanation: "One spacing is small, so the ruler's measurement error is a large fraction of it. Measuring across several and dividing shares that error out, reducing its effect.",
        distractors: [
          { id: "a", text: "The measurement error becomes a smaller fraction of the distance measured", status: "correct" },
          { id: "b", text: "Measuring one wavelength is just as accurate", status: "wrong", misconception: "single_wavelength_measured" },
          { id: "c", text: "It increases the frequency of the waves", status: "wrong" },
          { id: "d", text: "It gives the mean of the frequency readings", status: "wrong", misconception: "mean_across_different_quantities" }
        ]
      },
      {
        id: "wm_scale_factor", qtype: "mcq_single", tier: "higher",
        atom: "several_wavelengths_measured", syllabus: "6.6.1.2.i.iA",
        source: "in_style_of:aqa_ppq:trilogy_2023_p2h_03.1", marks: 3,
        prompt: "On a printed figure of a ripple-tank shadow, a student measures 24 mm across 4 complete wavelengths. 1.0 mm on the figure represents 5.0 mm on the real screen. What is the wavelength on the screen?",
        explanation: "Figure wavelength = 24/4 = 6.0 mm; on the screen that is 6.0 x 5.0 = 30 mm. The majority on the real item measured ONE wavelength and multiplied by 5: measure across several, divide, THEN scale.",
        distractors: [
          { id: "a", text: "30 mm", status: "correct" },
          { id: "b", text: "120 mm", status: "wrong" },
          { id: "c", text: "6.0 mm", status: "wrong", misconception: "graph_scale_misread" },
          { id: "d", text: "1.2 mm", status: "wrong" }
        ]
      },
      {
        id: "wm_string_method_claims", qtype: "short", tier: "both",
        atom: "string_standing_wave_method", syllabus: "6.6.1.2.i.iB", marks: 4,
        source: "aqa_ppq:trilogy_2024_p2h_01.1", facility_pct: 10,
        diagram: { kind: "standing_wave", params: { loops: 3 } },
        prompt: "A string is stretched between a vibration generator and a pulley with hanging masses. Describe a method to investigate how the frequency of the wave affects the wavelength. Tick the statements that belong in a good method.",
        explanation: "Change the frequency on the signal generator; at each frequency get a clear standing wave, measure across several loops and use loop length = half a wavelength; keep the masses (tension) the same. On the 2024 papers most students described the picture of the apparatus and scored nothing.",
        claims: [
          { id: "a", text: "Change the frequency using the signal generator, taking readings at several different frequencies", correct: true },
          { id: "b", text: "Measure the length of several loops with a ruler and use: one loop = half a wavelength", correct: true },
          { id: "c", text: "Keep the same masses on the pulley so the tension does not change", correct: true },
          { id: "d", text: "Describe the vibration generator, the pulley and the masses shown in the figure", correct: false, misconception: "apparatus_described_not_method" },
          { id: "e", text: "Time how long the standing wave takes to travel along the string", correct: false, misconception: "measurement_purpose_missing" }
        ]
      },
      {
        id: "wm_standing_nodes", qtype: "mcq_single", tier: "both",
        atom: "string_standing_wave_method", syllabus: "6.6.1.2.i.iB",
        diagram: { kind: "standing_wave", params: { loops: 4 } },
        prompt: "The string shows a standing wave with 4 loops. How many NODES (points that do not move) are there, including the two ends?",
        explanation: "Nodes sit at both ends and between every pair of loops: nodes = loops + 1 = 5. Counting the loops themselves as the nodes is the named error.",
        distractors: [
          { id: "a", text: "5", status: "correct" },
          { id: "b", text: "4", status: "wrong", misconception: "counted_loops_not_nodes" },
          { id: "c", text: "3", status: "wrong" },
          { id: "d", text: "8", status: "wrong" }
        ]
      },
      {
        id: "wm_standing_wavelength", qtype: "mcq_single", tier: "higher",
        atom: "string_standing_wave_method", syllabus: "6.6.1.2.i.iB",
        diagram: { kind: "standing_wave", params: { loops: 4 } },
        prompt: "A standing wave with 4 loops forms on a string 2.0 m long. What is the wavelength of the wave?",
        explanation: "Each loop is HALF a wavelength. Loop length = 2.0/4 = 0.50 m, so lambda = 2 x 0.50 = 1.0 m. Treating one loop as a full wavelength gives 0.50 m, half the true value.",
        distractors: [
          { id: "a", text: "1.0 m", status: "correct" },
          { id: "b", text: "0.50 m", status: "wrong", misconception: "wavelength_half_marked" },
          { id: "c", text: "2.0 m", status: "wrong" },
          { id: "d", text: "8.0 m", status: "wrong" }
        ]
      },
      {
        id: "wm_speed_sound_direct_claims", qtype: "short", tier: "both",
        atom: "speed_sound_direct_method", syllabus: "6.6.1.2.g.ii.i", marks: 4,
        diagram: { kind: "wave_scenario", params: { variant: "speed_clap", mark: { distance: true } } },
        prompt: "Two students measure the speed of sound in air using a drum and a stopwatch. Tick the statements that belong in a good method.",
        explanation: "A LARGE measured distance; start timing when the drummer is SEEN to hit the drum, stop when the sound is heard; v = d/t; repeat and take a mean. The light is effectively instantaneous over these distances, which is what makes see-then-hear timing valid.",
        claims: [
          { id: "a", text: "Stand a large measured distance apart (several hundred metres)", correct: true },
          { id: "b", text: "Start the stopwatch on SEEING the drum hit, stop it on HEARING the sound", correct: true },
          { id: "c", text: "Calculate speed = distance / time, repeat and take a mean", correct: true },
          { id: "d", text: "Stand close together so the sound is louder", correct: false },
          { id: "e", text: "Time the sound, without measuring the distance between the students", correct: false, misconception: "measurement_purpose_missing" }
        ]
      },
      {
        id: "wm_echo_method_claims", qtype: "short", tier: "both",
        atom: "speed_sound_echo_method", syllabus: "6.6.1.2.g.ii.ii", marks: 4,
        source: "aqa_ppq:trilogy_2018_p2f_02.3", facility_pct: 9,
        diagram: { kind: "wave_scenario", params: { variant: "echo_wall", mark: { distance: true } } },
        prompt: "A student bangs two bricks together and hears the echo from a large wall. Describe how to determine the speed of sound. Tick the statements that belong in a good method.",
        explanation: "Measure the distance to the wall, time from clap to echo, and use speed = 2 x distance / time: the sound travels there AND back. On the real paper only 9% reached level 2, mostly for missing what to do with the measurements; a memorable minority proposed throwing the bricks at the wall.",
        claims: [
          { id: "a", text: "Measure the distance from the student to the wall", correct: true },
          { id: "b", text: "Measure the time between the clap and hearing the echo", correct: true },
          { id: "c", text: "Calculate speed = (2 x distance) / time, because the sound travels to the wall and back", correct: true },
          { id: "d", text: "Calculate speed = distance / time using the distance to the wall", correct: false, misconception: "echo_factor_two_missed" },
          { id: "e", text: "Throw the bricks at the wall and time how long they take to hit it", correct: false }
        ]
      },
      {
        id: "wm_frequency_count", qtype: "mcq_single", tier: "both",
        atom: "frequency_count_method", syllabus: "6.6.1.2.a",
        diagram: { kind: "wave_scenario", params: { variant: "pier", mark: { count: true, time: true }, values: { count: 12, time: 60 } } },
        prompt: "A person on a pier counts 12 waves passing a post in 60 s. What is the frequency of the waves?",
        explanation: "Frequency = waves per second = 12/60 = 0.2 Hz. Dividing the other way (60/12 = 5) gives the PERIOD of the waves, not the frequency.",
        distractors: [
          { id: "a", text: "0.2 Hz", status: "correct" },
          { id: "b", text: "5 Hz", status: "wrong", misconception: "period_frequency_confused" },
          { id: "c", text: "12 Hz", status: "wrong" },
          { id: "d", text: "720 Hz", status: "wrong", misconception: "stem_numbers_multiplied" }
        ]
      },
      {
        id: "wm_mean_reading", qtype: "mcq_single", tier: "foundation",
        atom: "mean_of_repeats", syllabus: "6.6.1.2.i.ii",
        source: "aqa_ppq:trilogy_2021_p2f_04.2", facility_pct: 70,
        prompt: "Three readings of the frequency of waves in a ripple tank: 12.8 Hz, 12.4 Hz, 12.3 Hz. What is the mean frequency?",
        explanation: "Mean = (12.8 + 12.4 + 12.3) / 3 = 37.5 / 3 = 12.5 Hz.",
        distractors: [
          { id: "a", text: "12.5 Hz", status: "correct" },
          { id: "b", text: "12.4 Hz", status: "wrong" },
          { id: "c", text: "37.5 Hz", status: "wrong" },
          { id: "d", text: "12.8 Hz", status: "wrong" }
        ]
      },
      {
        id: "wm_precision", qtype: "mcq_single", tier: "higher",
        atom: "precision_uncertainty_basics", syllabus: "6.6.1.2.i.ii",
        source: "aqa_ppq:trilogy_2023_p2h_03.3", facility_pct: 40,
        prompt: "A teacher states that a set of repeated wavelength measurements is very precise. Which of the following supports the statement?",
        explanation: "Precise = the repeated values cluster tightly: a small spread about the mean. Being close to the true value is ACCURACY, a different idea.",
        distractors: [
          { id: "a", text: "The spread of values about the mean is very small", status: "correct" },
          { id: "b", text: "The mean value is very close to the true value", status: "wrong" },
          { id: "c", text: "The values are all given to the nearest millimetre", status: "wrong" },
          { id: "d", text: "The measurement was taken five times", status: "wrong", misconception: "repeatability_reproducibility_confused" }
        ]
      },
      {
        id: "wm_uncertainty", qtype: "mcq_single", tier: "higher",
        atom: "precision_uncertainty_basics", syllabus: "6.6.2.2.e.i",
        source: "aqa_ppq:trilogy_2025_p2h_05.2", facility_pct: 18,
        prompt: "Five repeated readings of a wavelength: 28 mm, 30 mm, 31 mm, 29 mm, 32 mm. What is the uncertainty in the readings?",
        explanation: "Range = 32 - 28 = 4 mm; uncertainty = plus or minus HALF the range = +/- 2 mm. Giving the whole range as the uncertainty was the standard error on the 2025 paper.",
        distractors: [
          { id: "a", text: "+/- 2 mm", status: "correct" },
          { id: "b", text: "+/- 4 mm", status: "wrong", misconception: "uncertainty_given_as_range" },
          { id: "c", text: "+/- 30 mm", status: "wrong" },
          { id: "d", text: "+/- 0.8 mm", status: "wrong" }
        ]
      },
      {
        id: "wm_random_error", qtype: "mcq_single", tier: "higher",
        atom: "precision_uncertainty_basics", syllabus: "6.6.2.2.e.i",
        source: "aqa_ppq:trilogy_2025_p2h_05.1", facility_pct: 15,
        prompt: "A student takes repeated readings with a digital temperature probe. The readings differ slightly from each other in an unpredictable way. What type of error is shown?",
        explanation: "Unpredictable scatter in repeats is RANDOM error. Digital displays do not abolish it: only 15% got this on the 2025 paper, where the examiner named the 'digital devices give a definitive value' misconception.",
        distractors: [
          { id: "a", text: "Random error", status: "correct" },
          { id: "b", text: "Systematic error", status: "wrong" },
          { id: "c", text: "There is no error, because the probe is digital", status: "wrong", misconception: "digital_reading_trusted_no_random_error" },
          { id: "d", text: "Zero error", status: "wrong" }
        ]
      },

      /* Batch 4: refraction_boundaries (6.6.2.2.a/b/c/d). Naming, ray
         diagrams (FH; widget drag + spot-the-error MCQs as the d023 interim
         for true drawing), HT speed-cause and wavefront explanation,
         wavelength-dependent behaviour. TIR not authored (d043 OQ-E).
         See review/refraction_boundaries.md. */
      {
        id: "rb_name_refraction", qtype: "mcq_single", tier: "both",
        atom: "refraction_name", syllabus: "6.6.2.2.b",
        source: "aqa_ppq:trilogy_2023_p2f_06.3", facility_pct: 20,
        prompt: "Light changes direction when it passes from air into a glass prism. What name is given to this process?",
        explanation: "Refraction: the change of direction when a wave crosses a boundary between media. (Reflection is bouncing back; dispersion is the splitting into colours that refraction causes.)",
        distractors: [
          { id: "a", text: "Refraction", status: "correct" },
          { id: "b", text: "Reflection", status: "wrong", misconception: "refraction_term_unknown" },
          { id: "c", text: "Diffraction", status: "wrong", misconception: "refraction_term_unknown" },
          { id: "d", text: "Radiation", status: "wrong" }
        ]
      },
      {
        id: "rb_ray_into_glass", qtype: "mcq_single", tier: "both",
        atom: "refraction_direction", syllabus: "6.6.2.2.c",
        source: "aqa_ppq:trilogy_2025_p2h_03.6", facility_pct: 20,
        diagram: { kind: "refraction_ray", params: { shape: "rectangle", theta1: 45, mark: { normal: true, angles: true } } },
        prompt: "A ray of light passes from air into glass. The angle of incidence is 45 degrees. Which describes the refracted ray inside the glass?",
        explanation: "Entering a denser (slower) medium the ray bends TOWARD the normal, so the angle of refraction is smaller than 45 degrees (28 degrees on the real paper). Measured from the NORMAL, not the surface.",
        distractors: [
          { id: "a", text: "It bends toward the normal: the angle of refraction is less than 45 degrees", status: "correct" },
          { id: "b", text: "It bends away from the normal: the angle of refraction is more than 45 degrees", status: "wrong", misconception: "bent_wrong_way" },
          { id: "c", text: "It continues at 45 degrees to the normal", status: "wrong", misconception: "equal_angle_no_refraction" },
          { id: "d", text: "It travels along the boundary", status: "wrong" }
        ]
      },
      {
        id: "rb_ray_out_of_glass", qtype: "mcq_single", tier: "both",
        atom: "refraction_direction", syllabus: "6.6.2.2.c",
        prompt: "A ray of light passes from glass into air. Which way does the ray bend as it leaves the glass?",
        explanation: "Leaving the slower medium for the faster one, the ray speeds up and bends AWAY from the normal: the mirror image of entry.",
        distractors: [
          { id: "a", text: "Away from the normal", status: "correct" },
          { id: "b", text: "Toward the normal", status: "wrong", misconception: "bent_wrong_way" },
          { id: "c", text: "It does not bend", status: "wrong", misconception: "equal_angle_no_refraction" }
        ]
      },
      {
        id: "rb_normal_role", qtype: "mcq_single", tier: "both",
        atom: "ray_diagram_construct", syllabus: "6.6.2.2.c",
        source: "aqa_ppq:trilogy_2019_p2h_07.2", facility_pct: 40,
        prompt: "When constructing a ray diagram for refraction, what is the 'normal'?",
        explanation: "The normal is a construction line at 90 degrees to the boundary at the point where the ray meets it; angles of incidence and refraction are measured from it. Omitting it (or measuring from the surface) loses the construction mark.",
        distractors: [
          { id: "a", text: "A line at right angles to the boundary at the point where the ray meets it", status: "correct" },
          { id: "b", text: "A line along the boundary surface", status: "wrong", misconception: "normal_not_drawn" },
          { id: "c", text: "The refracted ray itself", status: "wrong" },
          { id: "d", text: "A line parallel to the incident ray", status: "wrong" }
        ]
      },
      {
        id: "rb_drag_refracted_ray", qtype: "widget", tier: "both",
        atom: "ray_diagram_construct", syllabus: "6.6.2.2.c",
        pending_engine: "widget_qtype", marks: 2,
        widget: { kind: "refraction_ray", config: { n1: 1.0, n2: 1.5, theta1: 45 } },
        prompt: "A ray of light meets the glass block at 45 degrees to the normal. Drag the refracted ray to show its path inside the glass.",
        explanation: "Toward the normal (glass is slower): Snell gives about 28 degrees. Direction mark for the correct side of the normal; value mark within tolerance."
      },
      {
        id: "rb_block_emergent", qtype: "mcq_single", tier: "higher",
        atom: "ray_diagram_construct", syllabus: "6.6.2.2.c",
        source: "aqa_ppq:trilogy_2019_p2h_07.2",
        diagram: { kind: "refraction_ray", params: { shape: "rectangle", theta1: 40, mark: { normal: true } } },
        prompt: "A ray passes right through a rectangular glass block and emerges from the far side. How does the emergent ray compare with the incident ray?",
        explanation: "The two refractions cancel: the emergent ray is PARALLEL to the incident ray, shifted sideways (lateral displacement). Drawing it bent at a new angle, or undeviated with no shift, were the common wrong forms.",
        distractors: [
          { id: "a", text: "Parallel to the incident ray, but shifted sideways", status: "correct" },
          { id: "b", text: "At a larger angle to the normal than the incident ray", status: "wrong", misconception: "bent_wrong_way" },
          { id: "c", text: "Exactly in line with the incident ray, with no shift", status: "wrong", misconception: "equal_angle_no_refraction" },
          { id: "d", text: "Reflected back into the block", status: "wrong" }
        ]
      },
      {
        id: "rb_speed_cause", qtype: "mcq_single", tier: "higher",
        atom: "refraction_speed_cause", syllabus: "6.6.2.2.b",
        source: "aqa_ppq:trilogy_2025_p2h_03.5", facility_pct: 20,
        prompt: "Why does light refract as it passes from air into glass?",
        explanation: "Refraction is caused by the CHANGE OF SPEED: light slows down in glass. 'Because glass is denser' was explicitly ignored by the 2025 mark scheme, and 'the speed changes' without slower/faster scored nothing.",
        distractors: [
          { id: "a", text: "The light slows down as it enters the glass", status: "correct" },
          { id: "b", text: "The glass is denser than air", status: "wrong", misconception: "density_cited_not_speed" },
          { id: "c", text: "The speed of the light changes", status: "wrong", misconception: "speed_change_direction_unstated" },
          { id: "d", text: "The frequency of the light changes in the glass", status: "wrong", misconception: "boundary_frequency_not_constant" }
        ]
      },
      {
        id: "rb_wavefront_explain", qtype: "short", tier: "higher",
        atom: "wavefront_explanation", syllabus: "6.6.2.2.d", marks: 3,
        source: "aqa_ppq:trilogy_2025_p2h_03.5", facility_pct: 20,
        diagram: { kind: "refraction_wavefronts", params: {} },
        prompt: "Wavefronts of light meet a glass boundary at an angle. Use the wavefront diagram to explain why the light changes direction. Tick the statements that belong in a full explanation.",
        explanation: "One end of each wavefront crosses the boundary FIRST and slows down while the other end is still in air; the wavefronts close up and swing round, so the direction of travel bends toward the normal. The frequency does not change; the wavelength shortens.",
        claims: [
          { id: "a", text: "One end of each wavefront enters the glass and slows down before the other end", correct: true },
          { id: "b", text: "The wavefronts become closer together in the glass (shorter wavelength)", correct: true },
          { id: "c", text: "The change in direction follows from one end travelling slower than the other", correct: true },
          { id: "d", text: "The light bends because glass is optically denser", correct: false, misconception: "density_cited_not_speed" },
          { id: "e", text: "The frequency of the waves decreases in the glass", correct: false, misconception: "boundary_frequency_not_constant" }
        ]
      },
      {
        id: "rb_frequency_constant", qtype: "mcq_single", tier: "higher",
        atom: "frequency_unchanged_at_boundary", syllabus: "6.6.2.2.d",
        prompt: "A wave passes from air into glass and slows down. Which row describes what happens to its frequency and wavelength?",
        explanation: "Frequency is set by the source and cannot change at a boundary (the wavefronts arriving must equal the wavefronts leaving). With v = f lambda and v down at fixed f, the wavelength must shorten.",
        distractors: [
          { id: "a", text: "Frequency unchanged; wavelength shorter", status: "correct" },
          { id: "b", text: "Frequency lower; wavelength unchanged", status: "wrong", misconception: "boundary_frequency_not_constant" },
          { id: "c", text: "Frequency lower; wavelength shorter", status: "wrong", misconception: "boundary_frequency_not_constant" },
          { id: "d", text: "Frequency unchanged; wavelength longer", status: "wrong" }
        ]
      },
      {
        id: "rb_violet_most", qtype: "mcq_single", tier: "higher",
        atom: "wavelength_dependent_behaviour", syllabus: "6.6.2.2.a",
        source: "aqa_ppq:trilogy_2019_p2h_07.3", facility_pct: 1,
        prompt: "Different wavelengths of light travel at different speeds in water: the shorter the wavelength, the slower the light travels. Explain why violet light is refracted the most as it enters water from air.",
        explanation: "Violet has the shortest wavelength of the visible colours, so it slows the MOST at the boundary; the bigger the speed change, the bigger the change of direction. Only about 1% of students chained these two steps on the real paper.",
        distractors: [
          { id: "a", text: "Violet has the shortest wavelength, so its speed changes the most, so its direction changes the most", status: "correct" },
          { id: "b", text: "Violet has the longest wavelength of the visible colours", status: "wrong", misconception: "red_called_shortest" },
          { id: "c", text: "Violet light slows down, so it refracts", status: "wrong", misconception: "speed_change_direction_unstated" },
          { id: "d", text: "Water is denser for violet light", status: "wrong", misconception: "density_cited_not_speed" }
        ]
      },
      {
        id: "rb_material_behaviour", qtype: "mcq_single", tier: "higher",
        atom: "wavelength_dependent_behaviour", syllabus: "6.6.2.2.a",
        source: "aqa_ppq:trilogy_specimen_set2_p2h_03.7",
        diagram: { kind: "material_wave_behaviour", params: {} },
        prompt: "Glass transmits visible light but does NOT transmit ultraviolet radiation. What happens to ultraviolet radiation incident on glass?",
        explanation: "Substances absorb, transmit, refract or reflect EM waves in ways that VARY WITH WAVELENGTH (6.6.2.2.a). UV that is not transmitted is absorbed (or reflected) by the glass; visible light, a longer wavelength, passes through.",
        distractors: [
          { id: "a", text: "It is absorbed or reflected by the glass", status: "correct" },
          { id: "b", text: "It passes through, because all electromagnetic waves behave the same in glass", status: "wrong" },
          { id: "c", text: "It speeds up inside the glass", status: "wrong" },
          { id: "d", text: "It turns into visible light", status: "wrong" }
        ]
      },

      /* Batch 5: em_spectrum (6.6.2.1.a-e). Order, ends, the inverse
         frequency-wavelength pairing, common properties, continuity, eyes,
         colour order, place-a-wavelength. Several over the em_spectrum
         render (blanks/highlight). See review/em_spectrum.md. */
      {
        id: "es_name_missing", qtype: "mcq_single", tier: "both",
        atom: "em_order", syllabus: "6.6.2.1.c",
        source: "aqa_ppq:trilogy_2023_p2h_01.1", facility_pct: 60,
        diagram: { kind: "em_spectrum", params: { blanks: ["microwave"] } },
        prompt: "The spectrum runs: radio, [blank], infrared, visible light, ultraviolet, X-rays, gamma rays. Which group fills the blank?",
        explanation: "Long-to-short wavelength: radio, MICROWAVE, infrared, visible, ultraviolet, X-ray, gamma. On the 2023 Foundation paper 70% could not name all the missing groups.",
        distractors: [
          { id: "a", text: "Microwaves", status: "correct" },
          { id: "b", text: "Ultrasound", status: "wrong", misconception: "ultrasound_treated_as_em" },
          { id: "c", text: "X-rays", status: "wrong", misconception: "em_order_confused" },
          { id: "d", text: "Ultraviolet", status: "wrong", misconception: "em_order_confused" }
        ]
      },
      {
        id: "es_uv_position", qtype: "mcq_single", tier: "both",
        atom: "em_order", syllabus: "6.6.2.1.c",
        source: "aqa_ppq:trilogy_2018_p2f_04.1", facility_pct: 50,
        diagram: { kind: "em_spectrum", params: {} },
        prompt: "Where does ultraviolet (UV) sit in the electromagnetic spectrum?",
        explanation: "UV sits between visible light and X-rays. 'Between microwaves and visible light' was the named wrong answer on the 2018 paper (that is infrared's slot).",
        distractors: [
          { id: "a", text: "Between visible light and X-rays", status: "correct" },
          { id: "b", text: "Between microwaves and visible light", status: "wrong", misconception: "em_order_confused" },
          { id: "c", text: "Between radio waves and microwaves", status: "wrong", misconception: "em_order_confused" },
          { id: "d", text: "Beyond gamma rays", status: "wrong" }
        ]
      },
      {
        id: "es_high_freq_end", qtype: "mcq_single", tier: "both",
        atom: "em_ends_identify", syllabus: "6.6.2.1.c",
        source: "aqa_ppq:trilogy_2025_p2f_05.2", facility_pct: 55,
        prompt: "Which of the following electromagnetic waves has the greatest frequency?",
        explanation: "Gamma rays: the short-wavelength, high-frequency end. Radio is the opposite end (long wavelength, low frequency).",
        distractors: [
          { id: "a", text: "Gamma rays", status: "correct" },
          { id: "b", text: "Radio waves", status: "wrong", misconception: "spectrum_ends_swapped" },
          { id: "c", text: "Ultraviolet", status: "wrong", misconception: "em_order_confused" },
          { id: "d", text: "Visible light", status: "wrong" }
        ]
      },
      {
        id: "es_long_wavelength_end", qtype: "mcq_single", tier: "both",
        atom: "em_ends_identify", syllabus: "6.6.2.1.c",
        source: "aqa_ppq:trilogy_2019_p2f_05.1", facility_pct: 17,
        prompt: "Which group of electromagnetic waves has the longest wavelength?",
        explanation: "Radio waves: long wavelength means LOW frequency. Gamma rays have the greatest frequency and the shortest wavelength. A third of students scored zero on the 2019 fill-the-box version of this.",
        distractors: [
          { id: "a", text: "Radio waves", status: "correct" },
          { id: "b", text: "Gamma rays", status: "wrong", misconception: "spectrum_ends_swapped" },
          { id: "c", text: "X-rays", status: "wrong", misconception: "spectrum_ends_swapped" },
          { id: "d", text: "Microwaves", status: "wrong" }
        ]
      },
      {
        id: "es_uv_statements", qtype: "mcq_multi", tier: "both",
        atom: "freq_wavelength_inverse", syllabus: "6.6.2.1.c",
        source: "aqa_ppq:trilogy_2018_p2f_04.2", facility_pct: 15,
        prompt: "A lamp emits ultraviolet radiation. Which TWO statements about the ultraviolet waves are correct? Tick two.",
        explanation: "All EM waves share one speed (in vacuum/air), so 'same wave speed as visible light' is right; UV sits below gamma in frequency, so 'lower frequency than gamma rays' is right. 'Longer wavelength than microwaves' was the named error: higher frequency means SHORTER wavelength.",
        distractors: [
          { id: "a", text: "They have the same wave speed as visible light", status: "correct" },
          { id: "b", text: "They have a lower frequency than gamma rays", status: "correct" },
          { id: "c", text: "They have a longer wavelength than microwaves", status: "wrong", misconception: "freq_wavelength_inverse_missed" },
          { id: "d", text: "They have a higher frequency than X-rays", status: "wrong", misconception: "em_order_confused" },
          { id: "e", text: "They have a greater wave speed than radio waves", status: "wrong" }
        ]
      },
      {
        id: "es_common_property", qtype: "mcq_single", tier: "higher",
        atom: "em_common_properties", syllabus: "6.6.2.1.b",
        source: "aqa_ppq:trilogy_2024_p2h_03.1", facility_pct: 20,
        prompt: "Electromagnetic waves can all travel through a vacuum. Give one OTHER property that is the same for all types of electromagnetic wave.",
        explanation: "All EM waves are transverse, all transfer energy, and all travel at the same speed through a vacuum (or air). Answers about USES (transmitting data) are not properties; repeating the stem's vacuum fact scores nothing.",
        distractors: [
          { id: "a", text: "They all travel at the same speed through a vacuum", status: "correct" },
          { id: "b", text: "They can all be used to transmit data", status: "wrong", misconception: "property_answered_with_use" },
          { id: "c", text: "They can all travel through a vacuum", status: "wrong" },
          { id: "d", text: "They all have the same wavelength", status: "wrong" }
        ]
      },
      {
        id: "es_transfer", qtype: "mcq_single", tier: "foundation",
        atom: "em_common_properties", syllabus: "6.6.2.1.a",
        source: "aqa_ppq:trilogy_2022_p2f_01.1", facility_pct: 70,
        prompt: "What do all electromagnetic waves transfer from a source to an absorber?",
        explanation: "Energy. EM waves are transverse waves that transfer energy from the source of the waves to an absorber (6.6.2.1.a).",
        distractors: [
          { id: "a", text: "Energy", status: "correct" },
          { id: "b", text: "Matter", status: "wrong", misconception: "medium_travels_with_wave" },
          { id: "c", text: "Charge", status: "wrong" },
          { id: "d", text: "Sound", status: "wrong" }
        ]
      },
      {
        id: "es_continuous", qtype: "mcq_single", tier: "both",
        atom: "em_continuous_spectrum", syllabus: "6.6.2.1.b",
        prompt: "The electromagnetic spectrum is described as a CONTINUOUS spectrum. What does this mean?",
        explanation: "The wavelengths run smoothly from the longest radio waves to the shortest gamma rays with no gaps; the seven named groups are labels on a continuum, not separate bands with spaces between.",
        distractors: [
          { id: "a", text: "The wavelengths run from longest to shortest with no gaps between the groups", status: "correct" },
          { id: "b", text: "It is made of seven separate bands with gaps between them", status: "wrong" },
          { id: "c", text: "The waves are emitted without stopping", status: "wrong" },
          { id: "d", text: "Every wave in it is visible if the source is bright enough", status: "wrong" }
        ]
      },
      {
        id: "es_eyes", qtype: "mcq_single", tier: "both",
        atom: "visible_limited_detection", syllabus: "6.6.2.1.d",
        prompt: "Why can human eyes not see infrared or ultraviolet radiation?",
        explanation: "Our eyes detect only a limited range of the spectrum: the visible band. The other groups are physically the same kind of wave, just at wavelengths the eye cannot detect.",
        distractors: [
          { id: "a", text: "Eyes only detect the visible-light range of the electromagnetic spectrum", status: "correct" },
          { id: "b", text: "Infrared and ultraviolet are not electromagnetic waves", status: "wrong" },
          { id: "c", text: "Infrared and ultraviolet travel too fast to be seen", status: "wrong" },
          { id: "d", text: "Infrared and ultraviolet carry no energy", status: "wrong" }
        ]
      },
      {
        id: "es_colour_order", qtype: "mcq_single", tier: "higher",
        atom: "visible_colour_order", syllabus: "6.6.2.1.c",
        source: "aqa_ppq:trilogy_2024_p2h_03.4", facility_pct: 27,
        prompt: "Which colour of visible light has the shortest wavelength?",
        explanation: "Violet. Visible runs red (long wavelength) to violet (short wavelength); red was the most common wrong answer on the 2024 paper.",
        distractors: [
          { id: "a", text: "Violet", status: "correct" },
          { id: "b", text: "Red", status: "wrong", misconception: "red_called_shortest" },
          { id: "c", text: "Green", status: "wrong" },
          { id: "d", text: "White", status: "wrong" }
        ]
      },
      {
        id: "es_place_wavelength", qtype: "mcq_single", tier: "higher",
        atom: "em_wavelength_magnitude", syllabus: "6.6.2.1.a",
        source: "aqa_ppq:trilogy_2021_p2h_05.2", facility_pct: 30,
        prompt: "Infrared has wavelengths from 700 nm to 1 mm. Which part of the electromagnetic spectrum has waves with a wavelength of 6.5 x 10^-7 m?",
        explanation: "6.5 x 10^-7 m = 650 nm, which is SHORTER than 700 nm, so it sits just outside infrared on the visible side: visible light. The demand is the unit comparison (nm, mm, standard form), exactly what made this a sub-30% item.",
        distractors: [
          { id: "a", text: "Visible light", status: "correct" },
          { id: "b", text: "Infrared", status: "wrong", misconception: "prefix_not_converted" },
          { id: "c", text: "Microwaves", status: "wrong" },
          { id: "d", text: "Radio waves", status: "wrong" }
        ]
      },
      {
        id: "es_uv_gamma_compare", qtype: "mcq_multi", tier: "higher",
        atom: "em_common_properties", syllabus: "6.6.2.1.b",
        source: "aqa_ppq:trilogy_2023_p2h_01.2", facility_pct: 15,
        prompt: "Which TWO statements give a correct similarity and a correct difference between ultraviolet waves and gamma rays? Tick two.",
        explanation: "Similarity: both are transverse EM waves travelling at the same speed in a vacuum. Difference: gamma rays have a higher frequency (shorter wavelength) than UV. Uses are not properties: that confusion cost most of the marks on the real item (2% full at Foundation).",
        distractors: [
          { id: "a", text: "Both are transverse waves travelling at the same speed in a vacuum", status: "correct" },
          { id: "b", text: "Gamma rays have a higher frequency than ultraviolet waves", status: "correct" },
          { id: "c", text: "Ultraviolet is used in lamps but gamma is used in hospitals", status: "wrong", misconception: "property_answered_with_use" },
          { id: "d", text: "Gamma rays travel faster than ultraviolet waves", status: "wrong" },
          { id: "e", text: "Ultraviolet waves have a higher frequency than gamma rays", status: "wrong", misconception: "spectrum_ends_swapped" }
        ]
      },

      /* Batch 6: em_origins (6.6.2.3.a/b/c, mostly HT). The topic's most
         catastrophic scorer (1-10% full marks every appearance): radio from
         oscillations, absorbed radio inducing a.c., gamma from the nucleus.
         See review/em_origins.md. */
      {
        id: "eo_radio_production", qtype: "mcq_single", tier: "higher",
        atom: "radio_from_oscillations", syllabus: "6.6.2.3.a",
        source: "aqa_ppq:trilogy_2020_p2h_05.3", facility_pct: 5,
        prompt: "How can radio waves be produced?",
        explanation: "By oscillations in an electrical circuit: an alternating current makes charges oscillate in the transmitting aerial, and the oscillating charges emit radio waves of the same frequency. 90% scored zero or did not attempt the 2020 version.",
        distractors: [
          { id: "a", text: "By oscillations (alternating current) in an electrical circuit connected to an aerial", status: "correct" },
          { id: "b", text: "By changes in the nucleus of an atom", status: "wrong", misconception: "em_origin_swapped" },
          { id: "c", text: "By reflecting other waves off the ionosphere", status: "wrong", misconception: "radio_oscillation_link_missed" },
          { id: "d", text: "By heating a wire until it glows", status: "wrong" }
        ]
      },
      {
        id: "eo_radio_receive", qtype: "mcq_single", tier: "higher",
        atom: "radio_induce_ac", syllabus: "6.6.2.3.b",
        source: "aqa_ppq:trilogy_2018_p2h_05.3", facility_pct: 1,
        prompt: "Radio waves reach the aerial of a car radio. What happens when the waves are absorbed by the aerial?",
        explanation: "The absorbed waves induce an ALTERNATING current in the aerial circuit with the SAME frequency as the radio wave itself. That same-frequency link is the whole point of 6.6.2.3.b, and just over 1% earned full marks on the 2018 version.",
        distractors: [
          { id: "a", text: "They induce an alternating current with the same frequency as the radio wave", status: "correct" },
          { id: "b", text: "They induce a direct current in the aerial", status: "wrong", misconception: "radio_oscillation_link_missed" },
          { id: "c", text: "They induce an alternating current at a much lower frequency", status: "wrong", misconception: "radio_oscillation_link_missed" },
          { id: "d", text: "They only heat the aerial", status: "wrong" }
        ]
      },
      {
        id: "eo_transmitter_chain_claims", qtype: "short", tier: "higher",
        atom: "radio_induce_ac", syllabus: "6.6.2.3.b", marks: 4,
        source: "aqa_ppq:trilogy_2024_p2h_03.7", facility_pct: 10,
        prompt: "Explain how oscillations in a transmitter enable information to be transferred to the detector circuit in a receiver. Tick the statements that belong in a full explanation.",
        explanation: "Oscillating charges (an a.c.) in the transmitter emit radio waves at the same frequency; the waves travel to the receiver; absorption induces an a.c. of the same frequency in the detector circuit, reproducing the signal. Ionosphere stories and transverse/longitudinal padding scored nothing on the real papers.",
        claims: [
          { id: "a", text: "An alternating current makes charges oscillate in the transmitter circuit", correct: true },
          { id: "b", text: "The oscillating charges produce radio waves with the same frequency as the a.c.", correct: true },
          { id: "c", text: "When absorbed at the receiver, the waves induce an alternating current with the same frequency", correct: true },
          { id: "d", text: "The radio waves bounce off the ionosphere into the receiver", correct: false, misconception: "radio_oscillation_link_missed" },
          { id: "e", text: "The information travels because radio waves are longitudinal", correct: false }
        ]
      },
      {
        id: "eo_gamma_origin", qtype: "mcq_single", tier: "both",
        atom: "gamma_from_nucleus", syllabus: "6.6.2.3.c",
        prompt: "Where do gamma rays originate?",
        explanation: "Gamma rays originate from changes in the NUCLEUS of an atom. (Changes in atoms and their nuclei can generate or absorb EM waves over a wide frequency range; gamma is specifically nuclear.)",
        distractors: [
          { id: "a", text: "Changes in the nucleus of an atom", status: "correct" },
          { id: "b", text: "Oscillations in an electrical circuit", status: "wrong", misconception: "em_origin_swapped" },
          { id: "c", text: "Chemical reactions between atoms", status: "wrong" },
          { id: "d", text: "The vibration of whole molecules", status: "wrong" }
        ]
      },
      {
        id: "eo_which_nuclear", qtype: "mcq_single", tier: "both",
        atom: "gamma_from_nucleus", syllabus: "6.6.2.3.c",
        prompt: "Which group of electromagnetic waves is generated by changes in the nucleus of an atom?",
        explanation: "Gamma rays. Radio waves come from the other extreme: charge oscillations in circuits; the groups between originate in changes in atoms and electrons.",
        distractors: [
          { id: "a", text: "Gamma rays", status: "correct" },
          { id: "b", text: "Radio waves", status: "wrong", misconception: "em_origin_swapped" },
          { id: "c", text: "Visible light", status: "wrong" },
          { id: "d", text: "Microwaves", status: "wrong" }
        ]
      },

      /* Batch 7: em_dangers (6.6.2.3.d-h). Hazards by group, ionising vs
         radioactive, dose as risk, mSv/Sv, conclusions from dose data,
         use-despite-risk. See review/em_dangers.md. */
      {
        id: "ed_uv_risks", qtype: "mcq_multi", tier: "both",
        atom: "uv_hazards", syllabus: "6.6.2.3.h.i",
        source: "aqa_ppq:trilogy_2018_p2f_04.3", facility_pct: 15,
        prompt: "Which TWO are risks of exposure to high levels of ultraviolet radiation? Tick two.",
        explanation: "UV causes premature ageing of the skin and increases the risk of SKIN cancer. Bare 'cancer' or 'burning' without qualification scored nothing on the real paper.",
        distractors: [
          { id: "a", text: "Premature ageing of the skin", status: "correct" },
          { id: "b", text: "Increased risk of skin cancer", status: "correct" },
          { id: "c", text: "Mutation of genes deep inside body organs", status: "wrong", misconception: "hazard_wrong_for_group" },
          { id: "d", text: "Broken bones", status: "wrong" },
          { id: "e", text: "It makes the skin radioactive", status: "wrong", misconception: "ionising_confused_with_radioactive" }
        ]
      },
      {
        id: "ed_xgamma_harmful", qtype: "mcq_single", tier: "both",
        atom: "ionising_hazards", syllabus: "6.6.2.3.h.i",
        source: "aqa_ppq:trilogy_2020_p2f_03.5", facility_pct: 30,
        prompt: "Why are gamma rays and X-rays harmful to humans?",
        explanation: "They are IONISING radiation: they can mutate genes and cause cancer. 'They are radioactive' was the majority wrong answer in 2020; waves are not radioactive substances.",
        distractors: [
          { id: "a", text: "They are ionising", status: "correct" },
          { id: "b", text: "They are radioactive", status: "wrong", misconception: "ionising_confused_with_radioactive" },
          { id: "c", text: "They travel at the speed of light", status: "wrong" },
          { id: "d", text: "They are hot", status: "wrong" }
        ]
      },
      {
        id: "ed_ionising_effects", qtype: "mcq_single", tier: "both",
        atom: "ionising_hazards", syllabus: "6.6.2.3.h.ii",
        prompt: "What effect can ionising radiation (X-rays and gamma rays) have on human body tissue?",
        explanation: "It can cause the mutation of genes, which can lead to cancer. The qualified chain (ionising, gene mutation, cancer) is what the mark schemes want; bare 'cancer' is not enough.",
        distractors: [
          { id: "a", text: "It can cause gene mutation, which can lead to cancer", status: "correct" },
          { id: "b", text: "It can cause cancer", status: "wrong", misconception: "risk_unqualified" },
          { id: "c", text: "It makes the body tissue radioactive", status: "wrong", misconception: "ionising_confused_with_radioactive" },
          { id: "d", text: "It only warms the tissue slightly", status: "wrong" }
        ]
      },
      {
        id: "ed_dose_meaning", qtype: "mcq_single", tier: "both",
        atom: "dose_as_risk_measure", syllabus: "6.6.2.3.d",
        prompt: "Radiation dose, measured in sieverts, is a measure of what?",
        explanation: "The RISK of harm resulting from an exposure of the body to radiation: it depends on the type of radiation and the size of the dose. (You are not required to recall the unit; it is given.)",
        distractors: [
          { id: "a", text: "The risk of harm from an exposure of the body to radiation", status: "correct" },
          { id: "b", text: "The temperature rise of the body", status: "wrong" },
          { id: "c", text: "The speed of the radiation", status: "wrong" },
          { id: "d", text: "How radioactive the person becomes", status: "wrong", misconception: "ionising_confused_with_radioactive" }
        ]
      },
      {
        id: "ed_msv_convert", qtype: "mcq_single", tier: "both",
        atom: "dose_as_risk_measure", syllabus: "6.6.2.3.e",
        prompt: "1000 millisieverts (mSv) = 1 sievert (Sv). A worker receives a dose of 0.5 Sv. What is this dose in mSv?",
        explanation: "0.5 Sv x 1000 = 500 mSv.",
        distractors: [
          { id: "a", text: "500 mSv", status: "correct" },
          { id: "b", text: "0.0005 mSv", status: "wrong", misconception: "prefix_not_converted" },
          { id: "c", text: "5000 mSv", status: "wrong", misconception: "power_of_ten_evaluation_error" },
          { id: "d", text: "50 mSv", status: "wrong", misconception: "power_of_ten_evaluation_error" }
        ]
      },
      {
        id: "ed_dose_compare", qtype: "mcq_single", tier: "both",
        atom: "risk_data_conclusions", syllabus: "6.6.2.3.g",
        source: "aqa_ppq:trilogy_2020_p2f_03.2", facility_pct: 50,
        prompt: "A table shows: 100 mSv slightly increases cancer risk; 1000 mSv gives a 5% increased risk; 5000 mSv gives a high risk of death. One chest X-ray gives a dose of 0.100 mSv. Why is this X-ray unlikely to harm the patient?",
        explanation: "0.100 mSv is a THOUSANDTH of the lowest dose in the table that even slightly increases risk. On the real paper some students read 0.100 as equal to 100: the decimal comparison is the trap.",
        distractors: [
          { id: "a", text: "The dose is very much smaller than the lowest dose that increases risk", status: "correct" },
          { id: "b", text: "0.100 mSv is the same as 100 mSv, which only slightly increases risk", status: "wrong", misconception: "dose_magnitude_misread" },
          { id: "c", text: "X-rays are not ionising", status: "wrong", misconception: "ionising_confused_with_radioactive" },
          { id: "d", text: "X-rays cannot pass into the body", status: "wrong" }
        ]
      },
      {
        id: "ed_radiographer_claims", qtype: "short", tier: "higher",
        atom: "risk_data_conclusions", syllabus: "6.6.2.3.g", marks: 3,
        source: "aqa_ppq:trilogy_2020_p2h_05.2", facility_pct: 8,
        prompt: "A radiographer takes many X-ray images each day and stands behind a protective screen for each one. Explain why. Tick the statements that belong in a full explanation.",
        explanation: "Many exposures a day means a large CUMULATIVE dose; a higher dose means a higher risk; the screen ABSORBS the X-rays, reducing the dose received. 'The screen protects the radiographer' restates the question and scored nothing; only 8% got all three steps.",
        claims: [
          { id: "a", text: "Taking many X-rays each day would give the radiographer a large total (cumulative) dose", correct: true },
          { id: "b", text: "A larger dose means a higher risk of harm", correct: true },
          { id: "c", text: "The screen absorbs X-rays, reducing the dose the radiographer receives", correct: true },
          { id: "d", text: "The screen protects the radiographer from the X-rays", correct: false, misconception: "protection_mechanism_vague" },
          { id: "e", text: "Without the screen the radiographer would become radioactive", correct: false, misconception: "ionising_confused_with_radioactive" }
        ]
      },
      {
        id: "ed_hazard_match", qtype: "mcq_single", tier: "both",
        atom: "hazard_matched_to_group", syllabus: "6.6.2.3.h.i",
        source: "aqa_ppq:trilogy_2024_p2h_03.5", facility_pct: 20,
        prompt: "Which row correctly matches each group of electromagnetic waves to a specific risk?",
        explanation: "UV: premature skin ageing and skin cancer. X-rays and gamma rays: ionising, so gene mutation and cancer. Fewer than 20% linked each group to its specific risk on the 2024 paper; generic 'they cause cancer' earned only the compensation mark.",
        distractors: [
          { id: "a", text: "UV: skin ageing and skin cancer; X-rays and gamma: gene mutation and cancer", status: "correct" },
          { id: "b", text: "UV: gene mutation; X-rays and gamma: skin ageing", status: "wrong", misconception: "hazard_wrong_for_group" },
          { id: "c", text: "UV, X-rays and gamma all cause sunburn", status: "wrong", misconception: "hazard_wrong_for_group" },
          { id: "d", text: "They all cause cancer", status: "wrong", misconception: "risk_unqualified" }
        ]
      },
      {
        id: "ed_use_despite", qtype: "mcq_single", tier: "both",
        atom: "use_despite_risk", syllabus: "6.6.2.3.g",
        source: "aqa_ppq:trilogy_specimen_set2_p2f_02.6",
        prompt: "X-rays increase a patient's risk of cancer. Why do doctors still use X-ray imaging?",
        explanation: "Risk-benefit: the dose from one image is tiny (a very small added risk), and the benefit of the diagnosis outweighs it.",
        distractors: [
          { id: "a", text: "The benefit of diagnosing the problem outweighs the very small added risk", status: "correct" },
          { id: "b", text: "Hospital X-rays are not ionising", status: "wrong", misconception: "ionising_confused_with_radioactive" },
          { id: "c", text: "X-rays only affect the skin", status: "wrong", misconception: "hazard_wrong_for_group" },
          { id: "d", text: "Doctors are immune to radiation", status: "wrong" }
        ]
      },

      /* Batch 8: em_uses (6.6.2.4). Match group to use; HT suitability
         explanations; communications. See review/em_uses.md. */
      {
        id: "eu_microwave_uses", qtype: "mcq_multi", tier: "both",
        atom: "em_use_match", syllabus: "6.6.2.4.a.ii",
        source: "aqa_ppq:trilogy_2022_p2f_01.4", facility_pct: 15,
        prompt: "Which TWO are uses of microwaves? Tick two.",
        explanation: "Microwaves: satellite communications AND cooking food. Failing to spot the satellite use (knowing only the oven) was the standard error on the 2022 line-match.",
        distractors: [
          { id: "a", text: "Satellite communications", status: "correct" },
          { id: "b", text: "Cooking food", status: "correct" },
          { id: "c", text: "Imaging broken bones", status: "wrong" },
          { id: "d", text: "Energy-efficient lamps", status: "wrong" },
          { id: "e", text: "Detecting heat loss from houses", status: "wrong" }
        ]
      },
      {
        id: "eu_match_rows", qtype: "mcq_single", tier: "foundation",
        atom: "em_use_match", syllabus: "6.6.2.4.a.i",
        source: "in_style_of:aqa_ppq:trilogy_2022_p2f_01.4",
        prompt: "Which row correctly matches the wave to its use?",
        explanation: "Radio: television and radio. Infrared: electrical heaters, cooking, IR cameras. Ultraviolet: energy-efficient lamps and sun tanning. X-rays: medical imaging.",
        distractors: [
          { id: "a", text: "Radio waves: television and radio", status: "correct" },
          { id: "b", text: "Ultraviolet: imaging bones", status: "wrong", misconception: "hazard_wrong_for_group" },
          { id: "c", text: "X-rays: energy-efficient lamps", status: "wrong" },
          { id: "d", text: "Infrared: satellite communications", status: "wrong" }
        ]
      },
      {
        id: "eu_gamma_use", qtype: "mcq_single", tier: "foundation",
        atom: "em_use_match", syllabus: "6.6.2.4.a.vi",
        source: "aqa_ppq:trilogy_2020_p2f_03.4", facility_pct: 50,
        prompt: "Which of the following are gamma rays used for?",
        explanation: "Sterilising medical equipment (and medical imaging and treatment): gamma's ionising power kills microbes. Cooking is microwaves/infrared; lamps are ultraviolet.",
        distractors: [
          { id: "a", text: "Sterilising medical equipment", status: "correct" },
          { id: "b", text: "Cooking food", status: "wrong", misconception: "microwave_only_cooking" },
          { id: "c", text: "Energy-efficient lamps", status: "wrong" },
          { id: "d", text: "Television remote controls", status: "wrong" }
        ]
      },
      {
        id: "eu_medical_imaging", qtype: "mcq_multi", tier: "both",
        atom: "em_use_match", syllabus: "6.6.2.4.a.vi",
        source: "aqa_ppq:trilogy_2018_p2f_04.4", facility_pct: 32,
        prompt: "Which TWO types of ELECTROMAGNETIC wave are used for medical imaging? Tick two.",
        explanation: "X-rays and gamma rays. Ultrasound is the classic trap: it is a sound wave, not an electromagnetic wave ('longitudinal, transverse and ultrasound' were the named wrong answers in 2018).",
        distractors: [
          { id: "a", text: "X-rays", status: "correct" },
          { id: "b", text: "Gamma rays", status: "correct" },
          { id: "c", text: "Ultrasound", status: "wrong", misconception: "ultrasound_treated_as_em" },
          { id: "d", text: "Radio waves", status: "wrong" },
          { id: "e", text: "Ultraviolet", status: "wrong" }
        ]
      },
      {
        id: "eu_visible_use", qtype: "mcq_single", tier: "both",
        atom: "communication_uses", syllabus: "6.6.2.4.a.iv",
        source: "aqa_ppq:trilogy_2020_p2f_03.6", facility_pct: 30,
        prompt: "Visible light is used in communications. How?",
        explanation: "Fibre-optic communication: pulses of visible light carry data along glass fibres. Very few students gave this spec example on the 2020 paper.",
        distractors: [
          { id: "a", text: "Pulses of light carry signals along fibre-optic cables", status: "correct" },
          { id: "b", text: "Light beams carry phone calls to satellites", status: "wrong" },
          { id: "c", text: "Light is used to cook food in restaurants", status: "wrong", misconception: "microwave_only_cooking" },
          { id: "d", text: "Visible light is not used in communications", status: "wrong" }
        ]
      },
      {
        id: "eu_satellite_why", qtype: "mcq_single", tier: "higher",
        atom: "em_use_explain", syllabus: "6.6.2.4.b.i",
        source: "aqa_ppq:trilogy_2019_p2f_05.3", facility_pct: 5,
        prompt: "Some microwaves are NOT absorbed by the Earth's atmosphere. Why does this make microwaves suitable for satellite communications?",
        explanation: "The signal must pass through the whole atmosphere up to the satellite and back; a wave the atmosphere absorbs would never get there. Fewer than 5% scored on the 2019 version (many proposed harvesting the microwaves for cooking).",
        distractors: [
          { id: "a", text: "The signal can pass through the atmosphere to and from the satellite without being absorbed", status: "correct" },
          { id: "b", text: "Microwaves are the fastest electromagnetic waves", status: "wrong" },
          { id: "c", text: "Microwaves can also be used for cooking", status: "wrong", misconception: "microwave_only_cooking" },
          { id: "d", text: "Microwaves bounce off the atmosphere to reach the satellite", status: "wrong", misconception: "radio_oscillation_link_missed" }
        ]
      },
      {
        id: "eu_xray_bones", qtype: "mcq_single", tier: "higher",
        atom: "em_use_explain", syllabus: "6.6.2.4.b.iii",
        source: "aqa_ppq:trilogy_2020_p2h_05.1", facility_pct: 9,
        prompt: "Explain why X-rays can be used to produce images of the bones inside the body.",
        explanation: "BOTH halves are needed: X-rays pass through soft tissue but are ABSORBED by bone, so the bones cast a shadow on the detector. Only 9% gave both halves in 2020.",
        distractors: [
          { id: "a", text: "X-rays pass through soft tissue but are absorbed by bone", status: "correct" },
          { id: "b", text: "X-rays pass through the body", status: "wrong", misconception: "risk_unqualified" },
          { id: "c", text: "X-rays are reflected by the skin", status: "wrong" },
          { id: "d", text: "Bones are radioactive, so they show up", status: "wrong", misconception: "ionising_confused_with_radioactive" }
        ]
      },
      {
        id: "eu_microwaves_are_em", qtype: "mcq_single", tier: "foundation",
        atom: "communication_uses", syllabus: "6.6.2.4.a.ii",
        source: "aqa_ppq:trilogy_2020_p2f_03.6", facility_pct: 30,
        prompt: "A student says: 'Microwaves are just for ovens; they are not electromagnetic waves.' What is wrong with this statement?",
        explanation: "Microwaves ARE a group of the electromagnetic spectrum, and besides cooking they carry satellite communications. The 2020 examiners reported exactly this oven-only picture.",
        distractors: [
          { id: "a", text: "Microwaves are electromagnetic waves, also used for satellite communications", status: "correct" },
          { id: "b", text: "Nothing: microwaves only exist inside ovens", status: "wrong", misconception: "microwave_only_cooking" },
          { id: "c", text: "Microwaves are sound waves, not electromagnetic waves", status: "wrong", misconception: "ultrasound_treated_as_em" },
          { id: "d", text: "Microwaves are only used for communications, never cooking", status: "wrong" }
        ]
      },

      /* Batch 9: infrared_radiation (6.6.2.2.e.i-iii RP21 + 6.6.2.2.a
         contexts). Surface rankings, the RP, rates vs final temperature,
         thermal equilibrium, IR-temperature link. Diagrams: radiation_demo
         variants leslie_cube / two_bottles. See review/infrared_radiation.md. */
      {
        id: "ir_best_emitter", qtype: "mcq_single", tier: "both",
        atom: "ir_emission_surface", syllabus: "6.6.2.2.e.ii",
        diagram: { kind: "radiation_demo", params: { variant: "leslie_cube" } },
        prompt: "A Leslie cube filled with hot water has four different faces. An infrared detector is held the same distance from each face in turn. Which face emits the MOST infrared radiation?",
        explanation: "Matt black is the best emitter; shiny silver the worst. (The same ranking holds for absorption.)",
        distractors: [
          { id: "a", text: "The matt black face", status: "correct" },
          { id: "b", text: "The shiny silver face", status: "wrong", misconception: "shiny_white_called_good_emitter" },
          { id: "c", text: "The shiny white face", status: "wrong", misconception: "shiny_white_called_good_emitter" },
          { id: "d", text: "All faces emit the same", status: "wrong" }
        ]
      },
      {
        id: "ir_best_absorber", qtype: "mcq_single", tier: "both",
        atom: "ir_absorption_surface", syllabus: "6.6.2.2.e.i",
        diagram: { kind: "radiation_demo", params: { variant: "wax_rod" } },
        prompt: "Two plates face a heater: one matt black, one shiny silver. A ball is stuck to the back of each plate with wax. Which wax melts first, and why?",
        explanation: "The matt black plate's wax melts first: matt black is the best ABSORBER of infrared, so that plate heats fastest.",
        distractors: [
          { id: "a", text: "The matt black plate's wax: matt black absorbs the most infrared", status: "correct" },
          { id: "b", text: "The shiny plate's wax: shiny surfaces absorb the most infrared", status: "wrong", misconception: "shiny_white_called_good_emitter" },
          { id: "c", text: "Both at the same time: the surface does not matter", status: "wrong" },
          { id: "d", text: "The matt black plate's wax: black surfaces soak up the heat", status: "wrong", misconception: "heat_not_radiation_language" }
        ]
      },
      {
        id: "ir_rp21_method_claims", qtype: "short", tier: "both",
        atom: "rp21_method", syllabus: "6.6.2.2.e.i", marks: 4,
        source: "aqa_ppq:trilogy_2022_p2f_02.2", facility_pct: 25,
        diagram: { kind: "radiation_demo", params: { variant: "two_bottles" } },
        prompt: "A student compares the infrared radiation emitted by different surfaces using containers of hot water. Tick the statements that belong in a good method.",
        explanation: "Identical containers differing ONLY in surface; the same volume of water measured with a measuring cylinder; the same starting temperature; temperature recorded with a thermometer at fixed time intervals. The 2022 answers that missed level 2 were vague about the measuring cylinder and the thermometer's actual readings.",
        claims: [
          { id: "a", text: "Use identical containers that differ only in their surface (e.g. matt black vs shiny)", correct: true },
          { id: "b", text: "Measure equal volumes of hot water into each using a measuring cylinder", correct: true },
          { id: "c", text: "Record the temperature of each at fixed time intervals with a thermometer", correct: true },
          { id: "d", text: "Describe what the thermometer and the containers are", correct: false, misconception: "apparatus_described_not_method" },
          { id: "e", text: "Stand the containers at different distances from the window", correct: false }
        ]
      },
      {
        id: "ir_control_variable", qtype: "mcq_single", tier: "foundation",
        atom: "rp21_method", syllabus: "6.6.2.2.e.i",
        source: "aqa_ppq:trilogy_2025_p2f_02.2", facility_pct: 40,
        prompt: "A student investigates how the colour of a container affects how fast the water inside cools. Which of these is a CONTROL variable?",
        explanation: "Control variables are kept the same: the initial temperature of the water. The colour is the independent variable; the temperature change is the dependent variable.",
        distractors: [
          { id: "a", text: "The initial temperature of the water", status: "correct" },
          { id: "b", text: "The colour of the container", status: "wrong" },
          { id: "c", text: "The final temperature of the water", status: "wrong" },
          { id: "d", text: "Whether the water cools at all", status: "wrong" }
        ]
      },
      {
        id: "ir_initial_rate", qtype: "mcq_single", tier: "higher",
        atom: "cooling_curve_interpret", syllabus: "6.6.2.2.e.iii",
        source: "aqa_ppq:trilogy_2022_p2h_05.3", facility_pct: 75,
        prompt: "Two flasks (one black, one white) are heated by the same lamp, and their temperatures are graphed against time. The initial rate of absorption was greater for the black flask. How does the GRAPH show this?",
        explanation: "Rate is the GRADIENT: the black flask's line is steeper at the start. 'It reaches a higher final temperature' describes a different feature and was the standard wrong answer.",
        distractors: [
          { id: "a", text: "The black flask's line is steeper at the start", status: "correct" },
          { id: "b", text: "The black flask reaches a higher final temperature", status: "wrong", misconception: "final_temp_cited_not_rate" },
          { id: "c", text: "The black flask's line is longer", status: "wrong" },
          { id: "d", text: "The black flask's line starts at a higher temperature", status: "wrong" }
        ]
      },
      {
        id: "ir_equilibrium", qtype: "mcq_single", tier: "higher",
        atom: "thermal_equilibrium_rates", syllabus: "6.6.2.2.a",
        source: "aqa_ppq:trilogy_2025_p2h_05.5", facility_pct: 10,
        prompt: "Two clay cubes warmed by an infrared heater eventually stop changing temperature. Why?",
        explanation: "Constant temperature means the cube is absorbing infrared radiation at the SAME RATE as it is emitting it: a dynamic balance, not a full tank. Very few students expressed this on the 2025 paper.",
        distractors: [
          { id: "a", text: "Each cube is absorbing radiation at the same rate as it is emitting it", status: "correct" },
          { id: "b", text: "The cubes have absorbed all the heat they can hold", status: "wrong", misconception: "thermal_equilibrium_missed" },
          { id: "c", text: "The cubes stop absorbing heat", status: "wrong", misconception: "heat_not_radiation_language" },
          { id: "d", text: "The heater stops emitting infrared", status: "wrong" }
        ]
      },
      {
        id: "ir_explain_claims", qtype: "short", tier: "higher",
        atom: "thermal_equilibrium_rates", syllabus: "6.6.2.2.a", marks: 4,
        source: "aqa_ppq:trilogy_2025_p2h_05.5", facility_pct: 10,
        prompt: "A black cube and a white cube near an infrared heater: the black cube's temperature rises faster at first; after a few minutes both stop changing temperature. Explain these observations, referring to absorption and emission of radiation. Tick the statements that belong.",
        explanation: "Black absorbs infrared faster than white (better absorber); as each cube warms it emits more; the temperature becomes constant when absorption rate equals emission rate. Answers in terms of 'absorbing heat' were given no credit on the real paper: it must be infrared RADIATION.",
        claims: [
          { id: "a", text: "The black surface absorbs infrared radiation at a greater rate than the white surface", correct: true },
          { id: "b", text: "As a cube gets hotter it emits radiation at a greater rate", correct: true },
          { id: "c", text: "The temperature becomes constant when the absorption rate equals the emission rate", correct: true },
          { id: "d", text: "The cubes absorb heat from the heater until they are full", correct: false, misconception: "heat_not_radiation_language" },
          { id: "e", text: "White surfaces are the best emitters, so the white cube stays cooler", correct: false, misconception: "shiny_white_called_good_emitter" }
        ]
      },
      {
        id: "ir_camera", qtype: "mcq_single", tier: "higher",
        atom: "ir_temperature_link", syllabus: "6.6.2.2.a",
        source: "aqa_ppq:trilogy_2021_p2h_05.1", facility_pct: 10,
        prompt: "An infrared camera shows different parts of a hand in different colours. Explain why the camera can show that parts of the hand are at different temperatures.",
        explanation: "Hotter parts of the hand EMIT MORE infrared radiation; the camera displays different amounts of infrared as different colours. Both links were needed; only 10% scored in 2021.",
        distractors: [
          { id: "a", text: "Hotter parts emit more infrared, and the camera shows different amounts of infrared as different colours", status: "correct" },
          { id: "b", text: "The camera sees the heat inside the hand", status: "wrong", misconception: "heat_not_radiation_language" },
          { id: "c", text: "All parts of the hand emit the same infrared, but some reflect more light", status: "wrong", misconception: "ir_temperature_link_missed" },
          { id: "d", text: "The hand absorbs infrared from the camera", status: "wrong" }
        ]
      },
      {
        id: "ir_all_bodies", qtype: "mcq_single", tier: "both",
        atom: "ir_temperature_link", syllabus: "6.6.2.2.a",
        prompt: "Which statement about infrared emission is correct?",
        explanation: "ALL objects emit infrared radiation; the hotter the object, the more infrared it emits per second. (Emission does not switch on at some special temperature.)",
        distractors: [
          { id: "a", text: "All objects emit infrared; hotter objects emit more of it", status: "correct" },
          { id: "b", text: "Only hot objects emit infrared", status: "wrong", misconception: "ir_temperature_link_missed" },
          { id: "c", text: "Only black objects emit infrared", status: "wrong", misconception: "shiny_white_called_good_emitter" },
          { id: "d", text: "Objects emit infrared only while they are being heated", status: "wrong", misconception: "thermal_equilibrium_missed" }
        ]
      },
      {
        id: "ir_bottles_cooling", qtype: "mcq_single", tier: "both",
        atom: "ir_emission_surface", syllabus: "6.6.2.2.e.ii",
        diagram: { kind: "radiation_demo", params: { variant: "two_bottles" } },
        prompt: "Two identical bottles of hot water, one matt black and one shiny silver, are left to cool from the same temperature. Which cools faster, and why?",
        explanation: "The matt black bottle: matt black is the better EMITTER of infrared, so it loses energy by radiation faster, giving the steeper cooling curve.",
        distractors: [
          { id: "a", text: "The matt black bottle, because matt black is the better emitter of infrared", status: "correct" },
          { id: "b", text: "The shiny bottle, because shiny surfaces emit the most infrared", status: "wrong", misconception: "shiny_white_called_good_emitter" },
          { id: "c", text: "The matt black bottle, because black soaks up its own heat", status: "wrong", misconception: "heat_not_radiation_language" },
          { id: "d", text: "Both the same, because they hold the same water", status: "wrong" }
        ]
      }
    ]
  };

  window.TRILOGY_TOPICS["6.6"] = CONFIG;
})();
