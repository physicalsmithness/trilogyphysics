/* ============================================================================
   Trilogy Physics - TOPIC_CONFIG for Forces 6.5, v0.1
   ----------------------------------------------------------------------------
   Per-topic config the one shared engine is driven by (d016/d017). Mirrors
   app/topics/electricity_6_2.js. AUTHORED CONTENT: ATOMS and MISCONCEPTIONS are
   the full Forces 6.5 vocabulary from review/trilogy_forces_vocabulary_proposal.md
   (proposed; Smith greenlit authoring 2026-06-11).

   ITEMS: authored by subtag, one batch per review/<subtag>.md. Batches present:
   forces_basics (6.5.1.1, 6.5.1.2), weight_gravity (6.5.1.3). Multi-stage
   calc_workings greenlit (Smith 2026-06-11) as chained 4-line blocks via
   gate:{kind:"from_previous_part"}; those land with later calc-heavy subtags.

   Engine item shape (app/engine.js grader):
     { id, qtype, tier, atom, syllabus, prompt, explanation?, diagram?,
       distractors? | claims? | calc? }
     qtype: mcq_single | mcq_multi | short | calc_workings
     tier : foundation | higher | both   (d005)
     mcq* : distractors:[{id,text,status:"correct"|"wrong"|"half",misconception?}]
     short: claims:[{id,text,correct:bool,misconception?}]
     calc : {knowns:{SYM:value}, unknown, expectedFinalValue, expectedUnit:[...],
             equationCanonicalForms:[...], tolerance?, requireUnit?, marks?}
     diagram:{kind,params} routes to the Forces Widgets registry.
   equation_sheet (from_insert|must_recall) carried on numeric items (principle 6);
   extra fields are ignored by the grader, read by tooling.
   ============================================================================ */

(function () {
  "use strict";

  window.TRILOGY_TOPICS = window.TRILOGY_TOPICS || {};

  // Atom registry (ratified vocabulary section 2; grouped by subtag)
  const ATOMS = [
    { slug: "scalar_vector_distinction", label: "Scalar vs vector",            subtag: "forces_basics" },
    { slug: "identify_vector_quantity",  label: "Identify a vector quantity",  subtag: "forces_basics" },
    { slug: "contact_noncontact_classify", label: "Contact vs non-contact force", subtag: "forces_basics" },
    { slug: "force_as_interaction",      label: "Force as an interaction",     subtag: "forces_basics" },
    { slug: "vector_arrow_representation", label: "Representing a vector by an arrow", subtag: "forces_basics" },
    { slug: "weight_calc",               label: "Weight W = mg",               subtag: "weight_gravity" },
    { slug: "weight_mass_distinction",   label: "Weight vs mass",              subtag: "weight_gravity" },
    { slug: "gfs_dependence",            label: "Weight depends on g",         subtag: "weight_gravity" },
    { slug: "weight_mass_proportional",  label: "Weight proportional to mass", subtag: "weight_gravity" },
    { slug: "centre_of_mass",            label: "Centre of mass",              subtag: "weight_gravity" },
    { slug: "newtonmeter_read",          label: "Read a newtonmeter",          subtag: "weight_gravity" },
    { slug: "resultant_in_line",         label: "Resultant of collinear forces", subtag: "resultant_forces" },
    { slug: "free_body_diagram",         label: "Free-body diagram (HT)",      subtag: "resultant_forces" },
    { slug: "resolve_components",        label: "Resolve into components (HT)", subtag: "resultant_forces" },
    { slug: "equilibrium_vector_diagram", label: "Equilibrium vector diagram (HT)", subtag: "resultant_forces" },
    { slug: "work_calc",                 label: "Work W = Fs",                 subtag: "work_done" },
    { slug: "joule_newtonmetre",         label: "1 J = 1 N m",                 subtag: "work_done" },
    { slug: "work_energy_transfer",      label: "Work to energy transfer",     subtag: "work_done" },
    { slug: "hooke_calc",                label: "Hooke F = ke",                subtag: "springs_elasticity" },
    { slug: "spring_constant_calc",      label: "Spring constant k = F/e",     subtag: "springs_elasticity" },
    { slug: "elastic_inelastic",         label: "Elastic vs inelastic",        subtag: "springs_elasticity" },
    { slug: "linear_nonlinear",          label: "Linear vs non-linear F-e",    subtag: "springs_elasticity" },
    { slug: "epe_calc",                  label: "Elastic PE Ee = half k e^2",  subtag: "springs_elasticity" },
    { slug: "fe_graph_interpret",        label: "Interpret a force-extension graph", subtag: "springs_elasticity" },
    { slug: "rp18_force_extension",      label: "RP18 force & extension",      subtag: "springs_elasticity" },
    { slug: "distance_displacement",     label: "Distance vs displacement",    subtag: "motion_descriptors" },
    { slug: "speed_velocity",            label: "Speed vs velocity",           subtag: "motion_descriptors" },
    { slug: "typical_speeds",            label: "Typical speeds",              subtag: "motion_descriptors" },
    { slug: "speed_calc",                label: "Speed s = vt",                subtag: "motion_descriptors" },
    { slug: "average_speed",             label: "Average speed",               subtag: "motion_descriptors" },
    { slug: "circular_motion_velocity",  label: "Circular motion velocity (HT)", subtag: "motion_descriptors" },
    { slug: "dt_gradient_speed",         label: "d-t gradient = speed",        subtag: "motion_graphs" },
    { slug: "dt_describe_motion",        label: "Describe motion from d-t",    subtag: "motion_graphs" },
    { slug: "vt_gradient_accel",         label: "v-t gradient = acceleration", subtag: "motion_graphs" },
    { slug: "vt_area_distance",          label: "Area under v-t = distance (HT)", subtag: "motion_graphs" },
    { slug: "dt_tangent_speed",          label: "Tangent on d-t (HT)",         subtag: "motion_graphs" },
    { slug: "accel_calc",                label: "Acceleration a = dv/t",       subtag: "acceleration" },
    { slug: "deceleration",              label: "Deceleration",                subtag: "acceleration" },
    { slug: "suvat_calc",                label: "v^2 - u^2 = 2as",             subtag: "acceleration" },
    { slug: "estimate_accel",            label: "Estimate everyday accelerations", subtag: "acceleration" },
    { slug: "n1_resultant_zero",         label: "N1: constant v means resultant 0", subtag: "newtons_laws" },
    { slug: "n1_apply",                  label: "Apply Newton's First Law",    subtag: "newtons_laws" },
    { slug: "n2_calc",                   label: "Newton's Second Law F = ma",  subtag: "newtons_laws" },
    { slug: "n2_proportionality",        label: "a prop F, a prop 1/m",        subtag: "newtons_laws" },
    { slug: "n3_equal_opposite",         label: "Newton's Third Law",          subtag: "newtons_laws" },
    { slug: "inertia_concept",           label: "Inertia (HT)",                subtag: "newtons_laws" },
    { slug: "inertial_mass",             label: "Inertial mass = F/a (HT)",    subtag: "newtons_laws" },
    { slug: "rp19_force_mass_accel",     label: "RP19 force, mass, acceleration", subtag: "newtons_laws" },
    { slug: "terminal_velocity_concept", label: "Name terminal velocity",      subtag: "terminal_velocity" },
    { slug: "air_resistance_speed",      label: "Drag increases with speed",   subtag: "terminal_velocity" },
    { slug: "terminal_velocity_explain", label: "Explain terminal velocity",   subtag: "terminal_velocity" },
    { slug: "stopping_components",       label: "Stopping = thinking + braking", subtag: "stopping_distance" },
    { slug: "reaction_time_factors",     label: "Factors affecting reaction time", subtag: "stopping_distance" },
    { slug: "thinking_distance_calc",    label: "Thinking distance s = vt",    subtag: "stopping_distance" },
    { slug: "reaction_time_distinct",    label: "Reaction time is a time",     subtag: "stopping_distance" },
    { slug: "braking_factors",           label: "Factors affecting braking distance", subtag: "stopping_distance" },
    { slug: "speed_stopping_relationship", label: "Speed vs stopping distance", subtag: "stopping_distance" },
    { slug: "braking_force_energy",      label: "Braking work = KE (HT)",      subtag: "stopping_distance" },
    { slug: "momentum_calc",             label: "Momentum p = mv (HT)",        subtag: "momentum" },
    { slug: "conservation_qualitative",  label: "Conservation of momentum (HT)", subtag: "momentum" }
  ];

  // Misconception registry (ratified vocabulary section 3; NEW = NEW_FLAG raised
  // during authoring, awaiting ratification)
  const MISCONCEPTIONS = [
    { slug: "vector_defaulted_to_velocity",   label: "Defaulted to 'velocity' as the vector" },
    { slug: "scalar_vector_definition_confused", label: "Inverted the scalar/vector definition (NEW)" },
    { slug: "air_resistance_called_noncontact", label: "Called air resistance a non-contact force" },
    { slug: "contact_noncontact_misclassified", label: "Misclassified a contact force as non-contact (NEW)" },
    { slug: "normal_force_unrecognised",      label: "Did not recognise the normal contact force" },
    { slug: "force_not_an_interaction",       label: "Treated a force as a property of one object (NEW)" },
    { slug: "distance_displacement_conflated", label: "Treated displacement as a plain distance" },
    { slug: "weight_gfs_confused",            label: "Confused weight change with g change" },
    { slug: "centre_of_mass_arrow_missing",   label: "Weight arrow not from the centre of mass" },
    { slug: "weight_mass_conflated",          label: "Treated weight and mass as the same" },
    { slug: "resultant_added_not_subtracted", label: "Added/multiplied opposing forces instead of subtracting" },
    { slug: "used_fma_for_resultant",         label: "Used F=ma when a force balance was needed" },
    { slug: "resultant_nonzero_at_constant_v", label: "Thought resultant not zero at constant speed" },
    { slug: "fbd_labelled_not_arrows",        label: "Labelled the diagram instead of drawing arrows" },
    { slug: "work_nonzero_when_stationary",   label: "Non-zero work done with no movement" },
    { slug: "work_used_weight_not_force",     label: "Used weight, not the applied force, in W=Fs" },
    { slug: "extension_total_length_used",    label: "Used total length instead of extension" },
    { slug: "used_epe_for_hooke",             label: "Used Ee=half-ke^2 when F=ke was needed" },
    { slug: "wrong_spring_graph_sketched",    label: "Sketched the wrong force-extension graph" },
    { slug: "elastic_inelastic_confused",   label: "Confused elastic and inelastic deformation (NEW)" },
    { slug: "chain_prep_stage_skipped",     label: "Skipped a prep stage; used a raw stem value (NEW)" },
    { slug: "chain_intermediate_as_final",  label: "Gave an intermediate stage value as the final answer (NEW)" },
    { slug: "speed_velocity_direction_dropped", label: "Dropped direction / said velocity for speed" },
    { slug: "extraneous_factor_multiplied",   label: "Multiplied by an irrelevant factor from the stem" },
    { slug: "gradient_described_not_named",   label: "Described the trend instead of naming the gradient" },
    { slug: "area_under_vt_not_recognised",   label: "Did not use the area under a v-t graph" },
    { slug: "graph_scale_misread",            label: "Misread the graph scale / gridlines" },
    { slug: "gradient_ratio_inverted",        label: "Computed run/rise instead of rise/run" },
    { slug: "accel_unit_unknown",             label: "Could not give the m/s^2 unit" },
    { slug: "suvat_squared_mishandled",       label: "Mishandled the v^2 term" },
    { slug: "accel_value_used_as_displacement", label: "Put acceleration in the displacement slot" },
    { slug: "deceleration_sign_confused",     label: "Confused deceleration with acceleration" },
    { slug: "n2_acceleration_squared",        label: "Squared the acceleration (m/s^2 misread)" },
    { slug: "n2_inverse_stated_as_decreases", label: "Said 'decreases' instead of inversely proportional" },
    { slug: "n3_confused_with_n1",            label: "Mixed Newton's First and Third Laws" },
    { slug: "inertia_term_unknown",           label: "Could not name inertia" },
    { slug: "terminal_velocity_named_average", label: "Called terminal velocity 'average velocity'" },
    { slug: "terminal_velocity_explained_as_tiring", label: "Explained slowing by non-force reasons" },
    { slug: "accel_equated_with_force",       label: "Equated acceleration with a force" },
    { slug: "terminal_velocity_balance_missed", label: "Missed the weight = drag force balance" },
    { slug: "reaction_time_distance_confused", label: "Confused reaction time with thinking distance" },
    { slug: "stopping_factor_miscategorised", label: "Put a braking factor under thinking distance" },
    { slug: "speed_stopping_called_inverse",  label: "Called speed-stopping inversely proportional" },
    { slug: "relationship_stated_vaguely",    label: "'It increases' without naming the relationship" },
    { slug: "braking_energy_link_missed",     label: "Missed the mass/speed to KE to braking link" },
    { slug: "momentum_not_converted",         label: "Omitted a unit conversion in p=mv" },
    { slug: "conservation_not_applied",       label: "Did not apply conservation of momentum" },
    { slug: "wrong_formula_rearrangement",    label: "Rearranged the equation the wrong way" },
    { slug: "picked_given_value",             label: "Answered with a value lifted from the stem" },
    { slug: "power_of_ten_evaluation_error",  label: "Place-value slip in the evaluation" },
    { slug: "rounding_mistake",               label: "Right method, rounding/precision slip" },
    { slug: "prefix_not_converted",           label: "Did not convert a prefix (g to kg, cm to m, kN to N)" },
    { slug: "proportionality_stated_as_increases", label: "Said 'increases' instead of directly proportional" },
    { slug: "freehand_line_not_ruled",        label: "Best-fit line drawn freehand / wrong shape" },
    { slug: "repeatability_reproducibility_confused", label: "Confused repeatability and reproducibility" },
    { slug: "sig_figs_not_applied",           label: "Did not give the answer to the required sig figs" }
  ];

  const CONFIG = {
    id: "6.5",
    slug: "forces",
    name: "Forces",
    board: "AQA Trilogy 8464",
    atoms: ATOMS,
    misconceptions: MISCONCEPTIONS,
    diagram_kinds: ["motion_graph", "area_under_vt", "gradient_tool", "braking_vt",
                    "stopping_distance_speed", "free_body_diagram", "ramp_fbd",
                    "vector_addition", "spring_extension", "collision_illustration"],

    items: [
      /* Batch 1: forces_basics (6.5.1.1 scalar/vector & arrows; 6.5.1.2 contact /
         non-contact). Shapes mirror the AQA Trilogy bank. See review/forces_basics.md. */
      {
        id: "fb_scalar_def", qtype: "mcq_single", tier: "both",
        atom: "scalar_vector_distinction", syllabus: "6.5.1.1.a",
        prompt: "Why is distance a scalar quantity?",
        explanation: "A scalar quantity has magnitude only. Distance tells you how far, with no direction; that is what makes it a scalar.",
        distractors: [
          { id: "a", text: "Distance has magnitude only.", status: "correct" },
          { id: "b", text: "Distance has direction only.", status: "wrong", misconception: "scalar_vector_definition_confused" },
          { id: "c", text: "Distance has both direction and magnitude.", status: "wrong", misconception: "distance_displacement_conflated" }
        ]
      },
      {
        id: "fb_vector_def", qtype: "mcq_single", tier: "both",
        atom: "scalar_vector_distinction", syllabus: "6.5.1.1.a",
        prompt: "Velocity and acceleration are both vector quantities. What is a vector quantity?",
        explanation: "A vector has both magnitude and direction. (A scalar has magnitude only.)",
        distractors: [
          { id: "a", text: "A quantity with both magnitude and direction.", status: "correct" },
          { id: "b", text: "A quantity with direction only.", status: "wrong" },
          { id: "c", text: "A quantity with magnitude only.", status: "wrong", misconception: "scalar_vector_definition_confused" }
        ]
      },
      {
        id: "fb_identify_vector", qtype: "mcq_single", tier: "both",
        atom: "identify_vector_quantity", syllabus: "6.5.1.1.a",
        prompt: "Which of the following is a vector quantity?",
        explanation: "Displacement has a size and a direction, so it is the vector. Distance, time and work done are scalars.",
        distractors: [
          { id: "a", text: "Displacement", status: "correct" },
          { id: "b", text: "Distance", status: "wrong", misconception: "distance_displacement_conflated" },
          { id: "c", text: "Time", status: "wrong" },
          { id: "d", text: "Work done", status: "wrong" }
        ]
      },
      {
        id: "fb_scalars_multi", qtype: "mcq_multi", tier: "higher",
        atom: "identify_vector_quantity", syllabus: "6.5.1.1.a",
        prompt: "Which two of these are scalar quantities? Tick two.",
        explanation: "Distance and speed have magnitude only. Displacement and velocity are the matching vectors (they also carry direction).",
        distractors: [
          { id: "a", text: "Distance", status: "correct" },
          { id: "b", text: "Speed", status: "correct" },
          { id: "c", text: "Displacement", status: "wrong", misconception: "distance_displacement_conflated" },
          { id: "d", text: "Velocity", status: "wrong", misconception: "vector_defaulted_to_velocity" }
        ]
      },
      {
        id: "fb_scalar_vector_describe", qtype: "short", tier: "both",
        atom: "scalar_vector_distinction", syllabus: "6.5.1.1.a",
        prompt: "Velocity is a vector quantity and speed is a scalar quantity. Describe what is meant by a vector quantity and by a scalar quantity.",
        explanation: "AQA mark scheme: a vector has magnitude and a direction; a scalar has magnitude only.",
        claims: [
          { id: "a", text: "A vector has magnitude and a direction.", correct: true },
          { id: "b", text: "A scalar has magnitude only.", correct: true },
          { id: "c", text: "A vector has direction only.", correct: false, misconception: "scalar_vector_definition_confused" },
          { id: "d", text: "A scalar and a vector are the same apart from the name.", correct: false }
        ]
      },
      {
        id: "fb_weight_arrow", qtype: "mcq_single", tier: "both",
        atom: "vector_arrow_representation", syllabus: "6.5.1.1.c",
        prompt: "On a diagram, the weight of a gymnast is represented by an arrow. Why is weight represented by an arrow?",
        explanation: "An arrow is used because weight is a vector: the arrow's length shows the magnitude and its direction shows which way the force acts.",
        distractors: [
          { id: "a", text: "Weight is a vector.", status: "correct" },
          { id: "b", text: "Weight is a scalar.", status: "wrong", misconception: "scalar_vector_definition_confused" },
          { id: "c", text: "Weight is a unit.", status: "wrong" },
          { id: "d", text: "Weight is constant.", status: "wrong" }
        ]
      },
      {
        id: "fb_arrow_two_ways", qtype: "mcq_multi", tier: "both",
        atom: "vector_arrow_representation", syllabus: "6.5.1.1.c",
        prompt: "A diagram shows several force arrows. Which two features of the arrows show that forces are vector quantities? Tick two.",
        explanation: "AQA mark scheme: the arrows have different lengths (showing different magnitudes) and point in different directions (showing direction).",
        diagram: { kind: "free_body_diagram", params: { object: "box", preset: "car_constant_speed" } },
        distractors: [
          { id: "a", text: "The arrows have different lengths.", status: "correct" },
          { id: "b", text: "The arrows point in different directions.", status: "correct" },
          { id: "c", text: "The arrows are labelled with words.", status: "wrong", misconception: "fbd_labelled_not_arrows" },
          { id: "d", text: "The arrows are all the same colour.", status: "wrong" }
        ]
      },
      {
        id: "fb_noncontact_identify", qtype: "mcq_single", tier: "both",
        atom: "contact_noncontact_classify", syllabus: "6.5.1.2.a",
        prompt: "Which of the following is a non-contact force?",
        explanation: "An electrostatic force acts between separated objects, so it is non-contact. Friction, tension and air resistance all need the objects to be touching.",
        distractors: [
          { id: "a", text: "Electrostatic force", status: "correct" },
          { id: "b", text: "Friction force", status: "wrong", misconception: "contact_noncontact_misclassified" },
          { id: "c", text: "Tension force", status: "wrong", misconception: "contact_noncontact_misclassified" },
          { id: "d", text: "Air resistance", status: "wrong", misconception: "air_resistance_called_noncontact" }
        ]
      },
      {
        id: "fb_noncontact_multi", qtype: "mcq_multi", tier: "both",
        atom: "contact_noncontact_classify", syllabus: "6.5.1.2.c",
        prompt: "Which two of these are non-contact forces? Tick two.",
        explanation: "Gravitational and electrostatic forces act between objects that are physically separated. Air resistance, friction and tension are contact forces.",
        distractors: [
          { id: "a", text: "Electrostatic", status: "correct" },
          { id: "b", text: "Gravitational", status: "correct" },
          { id: "c", text: "Air resistance", status: "wrong", misconception: "air_resistance_called_noncontact" },
          { id: "d", text: "Friction", status: "wrong", misconception: "contact_noncontact_misclassified" },
          { id: "e", text: "Tension", status: "wrong", misconception: "contact_noncontact_misclassified" }
        ]
      },
      {
        id: "fb_normal_force", qtype: "mcq_single", tier: "foundation",
        atom: "contact_noncontact_classify", syllabus: "6.5.1.2.b",
        prompt: "A person stands still on bathroom scales. The person pushes down on the scales. What is the name of the upward force the scales exert on the person?",
        explanation: "The surface pushes back perpendicular to itself: this is the normal contact force. It balances the person's weight here.",
        diagram: { kind: "free_body_diagram", params: { object: "person", forces: [ { name: "weight", dir: "down", mag: 10 } ] } },
        distractors: [
          { id: "a", text: "Normal contact force", status: "correct" },
          { id: "b", text: "Weight", status: "wrong", misconception: "normal_force_unrecognised" },
          { id: "c", text: "Air resistance", status: "wrong", misconception: "normal_force_unrecognised" }
        ]
      },
      {
        id: "fb_bicycle_noncontact", qtype: "mcq_single", tier: "both",
        atom: "contact_noncontact_classify", syllabus: "6.5.1.2.b",
        prompt: "A bicycle is moving along a road. Which force acting on the moving bicycle is a non-contact force?",
        explanation: "Gravitational force acts on the bicycle without anything touching it, so it is the non-contact force. Air resistance, friction and the normal contact force all act through contact.",
        distractors: [
          { id: "a", text: "Gravitational force", status: "correct" },
          { id: "b", text: "Air resistance", status: "wrong", misconception: "air_resistance_called_noncontact" },
          { id: "c", text: "Friction", status: "wrong", misconception: "contact_noncontact_misclassified" },
          { id: "d", text: "Normal contact force", status: "wrong", misconception: "contact_noncontact_misclassified" }
        ]
      },
      {
        id: "fb_force_interaction", qtype: "short", tier: "both",
        atom: "force_as_interaction", syllabus: "6.5.1.2.a",
        prompt: "A book rests on a table. Explain what is meant by saying the force between the book and the table is an interaction.",
        explanation: "A force arises from the interaction between two objects: the book pushes down on the table and the table pushes up on the book. A single object on its own does not 'have' a force.",
        claims: [
          { id: "a", text: "A force acts on an object because of its interaction with another object.", correct: true },
          { id: "b", text: "The book pushes down on the table and the table pushes up on the book.", correct: true },
          { id: "c", text: "The force is stored inside the book on its own.", correct: false, misconception: "force_not_an_interaction" },
          { id: "d", text: "Only the table exerts a force; the book exerts none.", correct: false, misconception: "force_not_an_interaction" }
        ]
      },

      /* Batch 2: weight_gravity (6.5.1.3). W=mg as calc_workings; the g-to-kg
         prefix trap as a diagnostic MCQ (the calc grader takes plain-number
         knowns, so cannot natively grade a prefix conversion - see
         review/weight_gravity.md). */
      {
        id: "wg_equation_recall", qtype: "mcq_single", tier: "both",
        atom: "weight_calc", syllabus: "6.5.1.3.a", equation_sheet: "must_recall",
        prompt: "Which equation links the weight (W), mass (m) and gravitational field strength (g) of an object?",
        explanation: "Weight = mass x gravitational field strength, W = mg. A recall equation: on the 2023 insert but not the minimal pre-Covid insert.",
        distractors: [
          { id: "a", text: "W = m g", status: "correct" },
          { id: "b", text: "W = m / g", status: "wrong", misconception: "wrong_formula_rearrangement" },
          { id: "c", text: "W = g / m", status: "wrong", misconception: "wrong_formula_rearrangement" },
          { id: "d", text: "W = m + g", status: "wrong" }
        ]
      },
      {
        id: "wg_weight_calc_basic", qtype: "calc_workings", tier: "both",
        atom: "weight_calc", syllabus: "6.5.1.3.a", equation_sheet: "from_insert",
        prompt: "A bicycle has a mass of 15 kg. The gravitational field strength is 9.8 N/kg. Calculate the weight of the bicycle. Use the equation: weight = mass x gravitational field strength.",
        explanation: "W = mg = 15 x 9.8 = 147 N. (AQA allows 150 N.)",
        calc: {
          knowns: { m: 15, g: 9.8 },
          unknown: "W",
          expectedFinalValue: 147,
          expectedUnit: ["N", "newton", "newtons"],
          equationCanonicalForms: ["W=mg", "W=m*g"],
          tolerance: 0.5,
          requireUnit: true,
          marks: 4
        }
      },
      {
        id: "wg_weight_prefix_mcq", qtype: "mcq_single", tier: "foundation",
        atom: "weight_calc", syllabus: "6.5.1.3.a", equation_sheet: "from_insert",
        interim_for: "calc_prefix", // TODO: convert to calc_workings once the grader can grade a prefix conversion (knowns asGiven+unit, prefix_conv line-mark)
        prompt: "An apple has a mass of 150 g. The gravitational field strength is 9.8 N/kg. What is the weight of the apple?",
        explanation: "Convert first: 150 g = 0.150 kg. W = mg = 0.150 x 9.8 = 1.47 N. Not converting grams to kilograms gives 150 x 9.8 = 1470 N, a thousand times too large.",
        distractors: [
          { id: "a", text: "1.47 N", status: "correct" },
          { id: "b", text: "1470 N", status: "wrong", misconception: "prefix_not_converted" },
          { id: "c", text: "15.3 N", status: "wrong", misconception: "wrong_formula_rearrangement" },
          { id: "d", text: "0.0147 N", status: "wrong", misconception: "prefix_not_converted" }
        ]
      },
      {
        id: "wg_mass_rearrange", qtype: "calc_workings", tier: "both",
        atom: "weight_calc", syllabus: "6.5.1.3.d", equation_sheet: "must_recall",
        prompt: "An engineer has a weight of 710 N. The gravitational field strength is 9.8 N/kg. Calculate the mass of the engineer.",
        explanation: "Rearrange W = mg to m = W / g = 710 / 9.8 = 72.4..., about 72 kg.",
        calc: {
          knowns: { W: 710, g: 9.8 },
          unknown: "m",
          expectedFinalValue: 72.4,
          expectedUnit: ["kg", "kilogram", "kilograms"],
          equationCanonicalForms: ["m=W/g", "W=mg"],
          tolerance: 0.6,
          requireUnit: true,
          marks: 4
        }
      },
      {
        id: "wg_weight_mass_distinction", qtype: "mcq_single", tier: "both",
        atom: "weight_mass_distinction", syllabus: "6.5.1.3.c",
        prompt: "Which statement about weight and mass is correct?",
        explanation: "Weight is a force, measured in newtons (N). Mass is the amount of matter, measured in kilograms (kg). Different quantities, different units.",
        distractors: [
          { id: "a", text: "Weight is a force measured in newtons; mass is measured in kilograms.", status: "correct" },
          { id: "b", text: "Weight and mass are the same quantity.", status: "wrong", misconception: "weight_mass_conflated" },
          { id: "c", text: "Weight is measured in kilograms.", status: "wrong", misconception: "weight_mass_conflated" },
          { id: "d", text: "Mass is a force measured in newtons.", status: "wrong", misconception: "weight_mass_conflated" }
        ]
      },
      {
        id: "wg_gfs_equator", qtype: "mcq_single", tier: "both",
        atom: "gfs_dependence", syllabus: "6.5.1.3.c",
        prompt: "The gravitational field strength is weakest at the equator. A person travels from the UK to the equator. The person's mass does not change. What happens to the person's weight?",
        explanation: "Weight = mass x g. The mass is unchanged but g is smaller at the equator, so the weight decreases.",
        distractors: [
          { id: "a", text: "The weight decreases.", status: "correct" },
          { id: "b", text: "The weight increases.", status: "wrong", misconception: "weight_gfs_confused" },
          { id: "c", text: "The weight stays the same.", status: "wrong", misconception: "weight_gfs_confused" },
          { id: "d", text: "The mass decreases.", status: "wrong", misconception: "weight_mass_conflated" }
        ]
      },
      {
        id: "wg_gfs_explain", qtype: "short", tier: "higher",
        atom: "gfs_dependence", syllabus: "6.5.1.3.c",
        prompt: "An object is moved to a place where the gravitational field strength is smaller. Its mass does not change. Explain how and why its weight changes.",
        explanation: "Weight depends on both mass and gravitational field strength (W = mg). With the mass unchanged and g smaller, the weight decreases.",
        claims: [
          { id: "a", text: "Weight depends on both mass and gravitational field strength.", correct: true },
          { id: "b", text: "The mass is unchanged but g is smaller, so the weight decreases.", correct: true },
          { id: "c", text: "The mass decreases, so the weight decreases.", correct: false, misconception: "weight_mass_conflated" },
          { id: "d", text: "The weight stays the same because the mass is unchanged.", correct: false, misconception: "weight_gfs_confused" }
        ]
      },
      {
        id: "wg_weight_mass_proportional", qtype: "mcq_single", tier: "both",
        atom: "weight_mass_proportional", syllabus: "6.5.1.3.f",
        prompt: "For objects in the same gravitational field, how are weight and mass related?",
        explanation: "Weight is directly proportional to mass: doubling the mass doubles the weight (a straight line through the origin on a weight-mass graph).",
        distractors: [
          { id: "a", text: "Weight is directly proportional to mass.", status: "correct" },
          { id: "b", text: "Weight increases as mass increases, but not proportionally.", status: "wrong", misconception: "proportionality_stated_as_increases" },
          { id: "c", text: "Weight is inversely proportional to mass.", status: "wrong", misconception: "proportionality_stated_as_increases" },
          { id: "d", text: "Weight and mass are equal in value.", status: "wrong", misconception: "weight_mass_conflated" }
        ]
      },
      {
        id: "wg_centre_of_mass", qtype: "mcq_single", tier: "both",
        atom: "centre_of_mass", syllabus: "6.5.1.3.e",
        prompt: "On a diagram, the weight of a gymnast is shown as a single arrow acting from one point. What is the name given to this point?",
        explanation: "The weight of an object can be treated as acting at a single point, its centre of mass.",
        distractors: [
          { id: "a", text: "Centre of mass", status: "correct" },
          { id: "b", text: "Centre of weight", status: "wrong", misconception: "centre_of_mass_arrow_missing" },
          { id: "c", text: "Centre of force", status: "wrong", misconception: "centre_of_mass_arrow_missing" },
          { id: "d", text: "Centre of tension", status: "wrong" }
        ]
      },
      {
        id: "wg_weight_arrow_cofm", qtype: "mcq_single", tier: "both",
        atom: "centre_of_mass", syllabus: "6.5.1.3.a",
        prompt: "How should the arrow representing the weight of an object be drawn?",
        explanation: "Weight acts straight down, from the centre of mass. A common error is to draw it from the top or edge, or to just label the object 'weight' without an arrow from the centre of mass.",
        distractors: [
          { id: "a", text: "Vertically downwards, from the centre of mass.", status: "correct" },
          { id: "b", text: "Vertically downwards, from the top of the object.", status: "wrong", misconception: "centre_of_mass_arrow_missing" },
          { id: "c", text: "Vertically upwards, from the base of the object.", status: "wrong", misconception: "centre_of_mass_arrow_missing" },
          { id: "d", text: "Horizontally, from the centre of the object.", status: "wrong" }
        ]
      },
      {
        id: "wg_newtonmeter_read", qtype: "mcq_single", tier: "foundation",
        atom: "newtonmeter_read", syllabus: "6.5.1.3.g",
        prompt: "A suitcase hangs from a newtonmeter. The scale is marked every 10 N, and the pointer rests exactly halfway between the 190 N and 200 N marks. What is the weight of the suitcase?",
        explanation: "Halfway between 190 N and 200 N is 195 N. A newtonmeter (calibrated spring-balance) measures weight in newtons.",
        distractors: [
          { id: "a", text: "195 N", status: "correct" },
          { id: "b", text: "19.5 N", status: "wrong", misconception: "prefix_not_converted" },
          { id: "c", text: "200 N", status: "wrong", misconception: "graph_scale_misread" },
          { id: "d", text: "1.95 N", status: "wrong", misconception: "prefix_not_converted" }
        ]
      }
,

      /* Batch 3: springs_elasticity (6.5.3). F=ke and k=F/e as calc_workings
         (single-char symbols). Ee=half-ke^2 as MCQ: the calc grader uses
         single-character, case-folded symbols, so the multi-letter unknown Ee
         (read as E*e, and E/e collide when lowercased) does not fit the 4-line
         type - see review/springs_elasticity.md. cm->m prefix trap is an interim
         MCQ flagged interim_for:"calc_prefix". RP18 method is short claim-points
         (the engine cannot render level_of_response_6 yet, d023). */
      {
        id: "spr_hooke_recall", qtype: "mcq_single", tier: "both",
        atom: "hooke_calc", syllabus: "6.5.3.c", equation_sheet: "must_recall",
        prompt: "Which equation links the force (F) on a spring, its spring constant (k) and its extension (e), for a spring obeying Hooke's law?",
        explanation: "Force = spring constant x extension, F = ke. It must be recalled (it is on the 2023 insert but not the minimal insert).",
        distractors: [
          { id: "a", text: "F = k e", status: "correct" },
          { id: "b", text: "F = k / e", status: "wrong", misconception: "wrong_formula_rearrangement" },
          { id: "c", text: "F = 0.5 k e^2", status: "wrong", misconception: "used_epe_for_hooke" },
          { id: "d", text: "F = k + e", status: "wrong" }
        ]
      },
      {
        id: "spr_hooke_calc", qtype: "calc_workings", tier: "both",
        atom: "hooke_calc", syllabus: "6.5.3.c", equation_sheet: "from_insert",
        prompt: "A spring in a keyboard key has a spring constant of 200 N/m. When the key is pressed the spring is compressed by 0.0040 m. Calculate the force on the spring. Use the equation: force = spring constant x compression.",
        explanation: "F = ke = 200 x 0.0040 = 0.80 N.",
        calc: {
          knowns: { k: 200, e: 0.0040 },
          unknown: "F",
          expectedFinalValue: 0.80,
          expectedUnit: ["N", "newton", "newtons"],
          equationCanonicalForms: ["F=ke", "F=k*e"],
          tolerance: 0.02,
          requireUnit: true,
          marks: 4
        }
      },
      {
        id: "spr_hooke_prefix_mcq", qtype: "mcq_single", tier: "foundation",
        atom: "hooke_calc", syllabus: "6.5.3.c", equation_sheet: "from_insert",
        interim_for: "calc_prefix",
        prompt: "A spring has a spring constant of 1600 N/m. It is extended by 7.5 cm. Calculate the force on the spring. Use the equation: force = spring constant x extension.",
        explanation: "Convert first: 7.5 cm = 0.075 m. F = ke = 1600 x 0.075 = 120 N. Not converting cm to m gives 1600 x 7.5 = 12000 N, the classic spring error.",
        distractors: [
          { id: "a", text: "120 N", status: "correct" },
          { id: "b", text: "12000 N", status: "wrong", misconception: "prefix_not_converted" },
          { id: "c", text: "213 N", status: "wrong", misconception: "wrong_formula_rearrangement" },
          { id: "d", text: "0.12 N", status: "wrong", misconception: "prefix_not_converted" }
        ]
      },
      {
        id: "spr_spring_constant_calc", qtype: "calc_workings", tier: "both",
        atom: "spring_constant_calc", syllabus: "6.5.3.c", equation_sheet: "must_recall",
        prompt: "A force of 300 N is applied to a spring. The force causes the spring to extend by 0.40 m. Calculate the spring constant of the spring.",
        explanation: "Rearrange F = ke to k = F / e = 300 / 0.40 = 750 N/m.",
        calc: {
          knowns: { F: 300, e: 0.40 },
          unknown: "k",
          expectedFinalValue: 750,
          expectedUnit: ["N/m", "N m^-1", "newton per metre", "newtons per metre"],
          equationCanonicalForms: ["k=F/e", "F=ke", "F=k*e"],
          tolerance: 1,
          requireUnit: true,
          marks: 4
        }
      },
      {
        id: "spr_extension_meaning", qtype: "mcq_single", tier: "both",
        atom: "rp18_force_extension", syllabus: "6.5.3.b",
        prompt: "A spring has a natural (unstretched) length of 5.0 cm. When a weight is hung from it, the spring becomes 8.0 cm long. What is the extension of the spring?",
        explanation: "Extension = stretched length - natural length = 8.0 - 5.0 = 3.0 cm. The extension is the increase in length, not the total length.",
        distractors: [
          { id: "a", text: "3.0 cm", status: "correct" },
          { id: "b", text: "8.0 cm", status: "wrong", misconception: "extension_total_length_used" },
          { id: "c", text: "13.0 cm", status: "wrong" },
          { id: "d", text: "5.0 cm", status: "wrong" }
        ]
      },
      {
        id: "spr_elastic_meaning", qtype: "mcq_single", tier: "both",
        atom: "elastic_inelastic", syllabus: "6.5.3.a",
        prompt: "A spring is described as being 'elastically deformed'. What does this mean?",
        explanation: "An elastically deformed object returns to its original length when the force is removed.",
        distractors: [
          { id: "a", text: "The spring returns to its original length when the force is removed.", status: "correct" },
          { id: "b", text: "The spring stays stretched after the force is removed.", status: "wrong", misconception: "elastic_inelastic_confused" },
          { id: "c", text: "Only a very small force is needed to stretch the spring.", status: "wrong" },
          { id: "d", text: "The spring extends more and more as the force increases.", status: "wrong" }
        ]
      },
      {
        id: "spr_inelastic_meaning", qtype: "mcq_single", tier: "both",
        atom: "elastic_inelastic", syllabus: "6.5.3.a",
        prompt: "A spring is stretched so much that it becomes 'inelastically deformed'. What does this mean?",
        explanation: "An inelastically deformed object does not return to its original length when the force is removed.",
        distractors: [
          { id: "a", text: "The spring will not go back to its original length when the force is removed.", status: "correct" },
          { id: "b", text: "The spring returns to its original length when the force is removed.", status: "wrong", misconception: "elastic_inelastic_confused" },
          { id: "c", text: "The spring extends in proportion to the force.", status: "wrong" },
          { id: "d", text: "The spring needs a larger force to start stretching.", status: "wrong" }
        ]
      },
      {
        id: "spr_limit_proportionality", qtype: "mcq_multi", tier: "higher",
        atom: "linear_nonlinear", syllabus: "6.5.3.a",
        prompt: "A spring hangs in equilibrium from a support. It has been stretched beyond its limit of proportionality. Which two statements are true for this spring? Tick two.",
        explanation: "In equilibrium the upward force equals the downward force. Beyond the limit of proportionality the spring is inelastically deformed (it no longer obeys F = ke and will not fully return to its original length).",
        distractors: [
          { id: "a", text: "The upward force on the spring equals the downward force.", status: "correct" },
          { id: "b", text: "The spring is inelastically deformed.", status: "correct" },
          { id: "c", text: "The extension is still directly proportional to the force.", status: "wrong", misconception: "proportionality_stated_as_increases" },
          { id: "d", text: "The spring will return to its original length when unloaded.", status: "wrong", misconception: "elastic_inelastic_confused" }
        ]
      },
      {
        id: "spr_proportionality", qtype: "mcq_single", tier: "both",
        atom: "linear_nonlinear", syllabus: "6.5.3.c",
        prompt: "A spring obeys Hooke's law. How is the extension of the spring related to the force applied to it?",
        explanation: "Up to the limit of proportionality, the extension is directly proportional to the force: a straight line through the origin on a force-extension graph.",
        distractors: [
          { id: "a", text: "The extension is directly proportional to the force.", status: "correct" },
          { id: "b", text: "The extension increases as the force increases, but not proportionally.", status: "wrong", misconception: "proportionality_stated_as_increases" },
          { id: "c", text: "The extension is inversely proportional to the force.", status: "wrong", misconception: "proportionality_stated_as_increases" },
          { id: "d", text: "The extension equals the force.", status: "wrong" }
        ]
      },
      {
        id: "spr_fe_graph_shape", qtype: "mcq_single", tier: "both",
        atom: "fe_graph_interpret", syllabus: "6.5.3.e.i",
        prompt: "On a graph of force (vertical axis) against extension (horizontal axis) for a spring, what shows that the extension is directly proportional to the force?",
        explanation: "Direct proportionality shows as a straight line passing through the origin. A curve would mean the spring no longer obeys Hooke's law.",
        diagram: { kind: "spring_extension", params: { variant: "linear" } },
        distractors: [
          { id: "a", text: "A straight line through the origin.", status: "correct" },
          { id: "b", text: "A curve that gets steeper.", status: "wrong", misconception: "wrong_spring_graph_sketched" },
          { id: "c", text: "A straight line that does not pass through the origin.", status: "wrong", misconception: "wrong_spring_graph_sketched" },
          { id: "d", text: "A horizontal straight line.", status: "wrong" }
        ]
      },
      {
        id: "spr_fe_graph_gradient", qtype: "short", tier: "higher",
        atom: "fe_graph_interpret", syllabus: "6.5.3.c",
        prompt: "A force-extension graph for a spring (force on the vertical axis) is a straight line through the origin. A second, stiffer spring is tested on the same axes. Describe what the gradient represents and how the stiffer spring's line differs.",
        explanation: "For force against extension, the gradient equals the spring constant k. A stiffer spring has a larger spring constant, so its line is steeper (greater gradient).",
        claims: [
          { id: "a", text: "The gradient of the line equals the spring constant.", correct: true },
          { id: "b", text: "A stiffer spring has a larger spring constant.", correct: true },
          { id: "c", text: "The stiffer spring's line is steeper (greater gradient).", correct: true },
          { id: "d", text: "The stiffer spring's line is less steep (smaller gradient).", correct: false, misconception: "wrong_spring_graph_sketched" }
        ]
      },
      {
        id: "spr_epe_mcq", qtype: "mcq_single", tier: "both",
        atom: "epe_calc", syllabus: "6.5.3.g", equation_sheet: "from_insert",
        prompt: "A spring with a spring constant of 12000 N/m is extended by 0.070 m, within its limit of proportionality. Calculate the elastic potential energy stored. Use the equation: elastic potential energy = 0.5 x spring constant x (extension)^2.",
        explanation: "Ee = 0.5 x 12000 x (0.070)^2 = 0.5 x 12000 x 0.0049 = 29.4 J. Forgetting to square the extension gives 420 J; forgetting the factor of 0.5 gives 58.8 J.",
        distractors: [
          { id: "a", text: "29.4 J", status: "correct" },
          { id: "b", text: "420 J", status: "wrong", misconception: "wrong_formula_rearrangement" },
          { id: "c", text: "58.8 J", status: "wrong", misconception: "wrong_formula_rearrangement" },
          { id: "d", text: "840 J", status: "wrong", misconception: "wrong_formula_rearrangement" }
        ]
      },
      {
        id: "spr_rp18_method", qtype: "short", tier: "both",
        atom: "rp18_force_extension", syllabus: "6.5.3.b",
        prompt: "Describe a method to investigate how the extension of a spring depends on the force applied to it. (Required practical 18.)",
        explanation: "Measure the natural length with a ruler; hang known weights one at a time, measuring the new length each time; find each extension by subtracting the natural length; plot force against extension and draw a line of best fit.",
        claims: [
          { id: "a", text: "Measure the natural (unstretched) length of the spring with a ruler.", correct: true },
          { id: "b", text: "Add known weights one at a time and measure the new length each time.", correct: true },
          { id: "c", text: "Find each extension by subtracting the natural length from the stretched length.", correct: true },
          { id: "d", text: "Plot force against extension and draw a line of best fit.", correct: true },
          { id: "e", text: "Use the final stretched length itself as the extension.", correct: false, misconception: "extension_total_length_used" },
          { id: "f", text: "Join every plotted point with a freehand line.", correct: false, misconception: "freehand_line_not_ruled" }
        ]
      }
,

      /* Batch 4: motion_descriptors (6.5.4.1.1-3). distance/displacement,
         speed/velocity, typical speeds, s=vt + average speed as calc_workings,
         circular motion (HT). md_mean_speed_prefix is a min->s conversion trap
         (interim MCQ, interim_for:"calc_prefix"). See review/motion_descriptors.md. */
      {
        id: "md_distance_vs_displacement", qtype: "mcq_single", tier: "both",
        atom: "distance_displacement", syllabus: "6.5.4.1.1.a",
        prompt: "A student cycles a journey along winding roads and ends some way from the start. How does the total distance travelled compare with the displacement?",
        explanation: "Distance is the whole path length; displacement is the straight-line distance from start to finish. Along a curved route the distance travelled is greater than the displacement.",
        distractors: [
          { id: "a", text: "The total distance travelled is greater than the displacement.", status: "correct" },
          { id: "b", text: "The total distance travelled is equal to the displacement.", status: "wrong", misconception: "distance_displacement_conflated" },
          { id: "c", text: "The displacement is greater than the total distance travelled.", status: "wrong", misconception: "distance_displacement_conflated" }
        ]
      },
      {
        id: "md_displacement_loop", qtype: "mcq_single", tier: "both",
        atom: "distance_displacement", syllabus: "6.5.4.1.1.b",
        prompt: "A runner completes exactly one lap of a 400 m running track, finishing at the same point where they started. What is the runner's displacement?",
        explanation: "Displacement is measured in a straight line from start to finish. Starting and finishing at the same point gives a displacement of 0 m, even though the distance run is 400 m.",
        distractors: [
          { id: "a", text: "0 m", status: "correct" },
          { id: "b", text: "400 m", status: "wrong", misconception: "distance_displacement_conflated" },
          { id: "c", text: "200 m", status: "wrong" },
          { id: "d", text: "800 m", status: "wrong" }
        ]
      },
      {
        id: "md_speed_vs_velocity", qtype: "mcq_single", tier: "both",
        atom: "speed_velocity", syllabus: "6.5.4.1.3.a",
        prompt: "What is the difference between speed and velocity?",
        explanation: "Speed is a scalar (magnitude only). Velocity is a vector: it is the speed in a given direction.",
        distractors: [
          { id: "a", text: "Velocity is the speed in a given direction; speed has no direction.", status: "correct" },
          { id: "b", text: "Speed and velocity are the same thing.", status: "wrong", misconception: "speed_velocity_direction_dropped" },
          { id: "c", text: "Speed is a vector and velocity is a scalar.", status: "wrong", misconception: "scalar_vector_definition_confused" },
          { id: "d", text: "Velocity is always larger than speed.", status: "wrong" }
        ]
      },
      {
        id: "md_velocity_falling", qtype: "short", tier: "higher",
        atom: "speed_velocity", syllabus: "6.5.4.1.3.a",
        prompt: "A stone falls straight down through the air. Assume there is no air resistance. Velocity is a vector. Describe the velocity of the stone as it falls.",
        explanation: "AQA mark scheme: the magnitude of the velocity increases (the stone speeds up) while its direction stays constant (vertically downward).",
        claims: [
          { id: "a", text: "The magnitude of the velocity increases.", correct: true },
          { id: "b", text: "The direction of the velocity stays constant (downward).", correct: true },
          { id: "c", text: "The velocity is constant.", correct: false, misconception: "speed_velocity_direction_dropped" },
          { id: "d", text: "Only the direction of the velocity changes.", correct: false, misconception: "speed_velocity_direction_dropped" }
        ]
      },
      {
        id: "md_speed_of_sound", qtype: "mcq_single", tier: "both",
        atom: "typical_speeds", syllabus: "6.5.4.1.2.g",
        prompt: "What is a typical value for the speed of sound in air?",
        explanation: "A typical value for the speed of sound in air is 330 m/s.",
        distractors: [
          { id: "a", text: "330 m/s", status: "correct" },
          { id: "b", text: "33 m/s", status: "wrong" },
          { id: "c", text: "3300 m/s", status: "wrong" },
          { id: "d", text: "33 000 m/s", status: "wrong" }
        ]
      },
      {
        id: "md_typical_cycle_speed", qtype: "mcq_single", tier: "foundation",
        atom: "typical_speeds", syllabus: "6.5.4.1.2.j",
        prompt: "A typical cycling speed is about 6 m/s. A typical walking speed is about 1.5 m/s. About how does cycling speed compare with walking speed?",
        explanation: "6 m/s is about four times 1.5 m/s, so a typical cycling speed is about four times a typical walking speed.",
        distractors: [
          { id: "a", text: "About four times faster", status: "correct" },
          { id: "b", text: "About twice as fast", status: "wrong" },
          { id: "c", text: "About eight times faster", status: "wrong" }
        ]
      },
      {
        id: "md_speed_eqn_recall", qtype: "mcq_single", tier: "both",
        atom: "speed_calc", syllabus: "6.5.4.1.2.i", equation_sheet: "must_recall",
        prompt: "Which equation links distance travelled (s), speed (v) and time (t)?",
        explanation: "distance travelled = speed x time, s = vt.",
        distractors: [
          { id: "a", text: "s = v t", status: "correct" },
          { id: "b", text: "v = t / s", status: "wrong", misconception: "wrong_formula_rearrangement" },
          { id: "c", text: "t = v s", status: "wrong", misconception: "wrong_formula_rearrangement" },
          { id: "d", text: "s = v + t", status: "wrong" }
        ]
      },
      {
        id: "md_speed_calc_distance", qtype: "calc_workings", tier: "both",
        atom: "speed_calc", syllabus: "6.5.4.1.2.i", equation_sheet: "from_insert",
        prompt: "After opening a parachute, a skydiver falls at a constant speed of 3.6 m/s for 25 s. Calculate the distance travelled by the skydiver during this time. Use the equation: distance = speed x time.",
        explanation: "s = vt = 3.6 x 25 = 90 m.",
        calc: {
          knowns: { v: 3.6, t: 25 },
          unknown: "s",
          expectedFinalValue: 90,
          expectedUnit: ["m", "metre", "metres", "meters"],
          equationCanonicalForms: ["s=vt", "s=v*t"],
          tolerance: 0.5,
          requireUnit: true,
          marks: 4
        }
      },
      {
        id: "md_average_speed_calc", qtype: "calc_workings", tier: "both",
        atom: "average_speed", syllabus: "6.5.4.1.2.j", equation_sheet: "must_recall",
        prompt: "The London Marathon is a distance of 42000 m. The winner finished in a time of 5600 s. Calculate the average speed of the winner.",
        explanation: "Rearrange s = vt to v = s / t = 42000 / 5600 = 7.5 m/s.",
        calc: {
          knowns: { s: 42000, t: 5600 },
          unknown: "v",
          expectedFinalValue: 7.5,
          expectedUnit: ["m/s", "m s^-1", "metres per second"],
          equationCanonicalForms: ["v=s/t", "s=vt", "s=v*t"],
          tolerance: 0.1,
          requireUnit: true,
          marks: 4
        }
      },
      {
        id: "md_mean_speed_prefix", qtype: "mcq_single", tier: "foundation",
        atom: "average_speed", syllabus: "6.5.4.1.2.i",
        interim_for: "calc_prefix",
        prompt: "A car travels a distance of 2040 m in 2 minutes. Calculate the mean speed of the car in m/s.",
        explanation: "Convert the time first: 2 minutes = 120 s. Mean speed = distance / time = 2040 / 120 = 17 m/s. Using 2 (minutes) instead of 120 (seconds) gives 1020 m/s, far too fast.",
        distractors: [
          { id: "a", text: "17 m/s", status: "correct" },
          { id: "b", text: "1020 m/s", status: "wrong", misconception: "prefix_not_converted" },
          { id: "c", text: "34 m/s", status: "wrong", misconception: "wrong_formula_rearrangement" },
          { id: "d", text: "8.5 m/s", status: "wrong" }
        ]
      },
      {
        id: "md_circular_motion", qtype: "short", tier: "higher",
        atom: "circular_motion_velocity", syllabus: "6.5.4.1.3.c",
        prompt: "An athlete runs at a constant speed around a circular track. Describe the athlete's velocity as they run around the track.",
        explanation: "Speed (the magnitude) stays constant, but the direction of motion keeps changing around the circle, so the velocity is continually changing (velocity is a vector).",
        claims: [
          { id: "a", text: "The magnitude (speed) of the velocity stays constant.", correct: true },
          { id: "b", text: "The direction of the velocity keeps changing.", correct: true },
          { id: "c", text: "The velocity is therefore continually changing.", correct: true },
          { id: "d", text: "The velocity is constant because the speed is constant.", correct: false, misconception: "speed_velocity_direction_dropped" }
        ]
      }
,

      /* Batch 5: motion_graphs (6.5.4.1.4, .1.5.d/f). d-t gradient=speed,
         describe motion, v-t gradient=acceleration, area under v-t = distance
         (HT), tangent for instantaneous speed (HT). All mcq/short (the suvat
         calcs live in the acceleration batch). See review/motion_graphs.md. */
      {
        id: "mg_dt_gradient_speed", qtype: "mcq_single", tier: "both",
        atom: "dt_gradient_speed", syllabus: "6.5.4.1.4.b",
        prompt: "What does the gradient of a distance-time graph represent?",
        explanation: "The gradient of a distance-time graph is the speed (how fast the distance changes with time).",
        distractors: [
          { id: "a", text: "The speed", status: "correct" },
          { id: "b", text: "The acceleration", status: "wrong", misconception: "gradient_described_not_named" },
          { id: "c", text: "The total distance travelled", status: "wrong", misconception: "gradient_described_not_named" },
          { id: "d", text: "The time taken", status: "wrong" }
        ]
      },
      {
        id: "mg_dt_describe", qtype: "short", tier: "both",
        atom: "dt_describe_motion", syllabus: "6.5.4.1.4.b",
        prompt: "A distance-time graph is a straight line sloping upwards. Describe the motion and say what the gradient tells you.",
        explanation: "A straight sloping line means constant speed; the gradient equals the speed, and a steeper line means a greater speed.",
        claims: [
          { id: "a", text: "The object is moving at a constant speed.", correct: true },
          { id: "b", text: "The gradient of the line is equal to the speed.", correct: true },
          { id: "c", text: "A steeper line would mean a greater speed.", correct: true },
          { id: "d", text: "The graph just shows that the distance increases with time.", correct: false, misconception: "gradient_described_not_named" }
        ]
      },
      {
        id: "mg_dt_constant_speed", qtype: "mcq_single", tier: "both",
        atom: "dt_describe_motion", syllabus: "6.5.4.1.4.a",
        prompt: "Which feature of a distance-time graph shows that an object is travelling at a constant speed?",
        explanation: "A constant speed gives a straight (sloping) line: equal distance covered in equal times.",
        diagram: { kind: "motion_graph", params: { kind: "distance_time", shape: "linear" } },
        distractors: [
          { id: "a", text: "The line is straight (and sloping).", status: "correct" },
          { id: "b", text: "The line is horizontal.", status: "wrong", misconception: "graph_scale_misread" },
          { id: "c", text: "The line curves upwards.", status: "wrong" },
          { id: "d", text: "The line passes through the origin.", status: "wrong" }
        ]
      },
      {
        id: "mg_dt_stationary", qtype: "mcq_single", tier: "both",
        atom: "dt_describe_motion", syllabus: "6.5.4.1.4.a",
        prompt: "On a distance-time graph, what does a horizontal line show?",
        explanation: "A horizontal line means the distance is not changing, so the object is stationary (at rest).",
        distractors: [
          { id: "a", text: "The object is stationary.", status: "correct" },
          { id: "b", text: "The object is moving at a constant speed.", status: "wrong", misconception: "graph_scale_misread" },
          { id: "c", text: "The object is accelerating.", status: "wrong" },
          { id: "d", text: "The object is moving backwards.", status: "wrong" }
        ]
      },
      {
        id: "mg_dt_gradient_calc", qtype: "mcq_single", tier: "both",
        atom: "dt_gradient_speed", syllabus: "6.5.4.1.4.b",
        prompt: "A distance-time graph is a straight line from the origin (0 s, 0 m) to the point (50 s, 250 m). What is the speed?",
        explanation: "Speed = gradient = change in distance / change in time = 250 / 50 = 5.0 m/s. Dividing time by distance (50/250) inverts the gradient and gives 0.2 m/s.",
        distractors: [
          { id: "a", text: "5.0 m/s", status: "correct" },
          { id: "b", text: "0.2 m/s", status: "wrong", misconception: "gradient_ratio_inverted" },
          { id: "c", text: "250 m/s", status: "wrong" },
          { id: "d", text: "50 m/s", status: "wrong" }
        ]
      },
      {
        id: "mg_vt_gradient_accel", qtype: "mcq_single", tier: "both",
        atom: "vt_gradient_accel", syllabus: "6.5.4.1.5.d",
        prompt: "What does the gradient of a velocity-time graph represent?",
        explanation: "The gradient of a velocity-time graph is the acceleration (how fast the velocity changes with time).",
        distractors: [
          { id: "a", text: "The acceleration", status: "correct" },
          { id: "b", text: "The speed", status: "wrong", misconception: "gradient_described_not_named" },
          { id: "c", text: "The distance travelled", status: "wrong", misconception: "area_under_vt_not_recognised" },
          { id: "d", text: "The time taken", status: "wrong" }
        ]
      },
      {
        id: "mg_vt_constant_accel", qtype: "mcq_single", tier: "foundation",
        atom: "vt_gradient_accel", syllabus: "6.5.4.1.5.d",
        prompt: "The gradient of a velocity-time graph represents acceleration. How does the graph show that the acceleration is constant?",
        explanation: "A constant gradient (a straight line) means a constant acceleration.",
        distractors: [
          { id: "a", text: "The line has a constant gradient (it is straight).", status: "correct" },
          { id: "b", text: "The line is horizontal.", status: "wrong", misconception: "graph_scale_misread" },
          { id: "c", text: "The line curves upwards.", status: "wrong" },
          { id: "d", text: "The line passes through the origin.", status: "wrong" }
        ]
      },
      {
        id: "mg_vt_deceleration", qtype: "mcq_single", tier: "both",
        atom: "vt_gradient_accel", syllabus: "6.5.4.1.5.d",
        prompt: "On a velocity-time graph, a straight line slopes downwards to the right (velocity decreasing). What does this show about the motion?",
        explanation: "A downward slope means the velocity is decreasing, so the object is decelerating (slowing down).",
        distractors: [
          { id: "a", text: "The object is decelerating.", status: "correct" },
          { id: "b", text: "The object is accelerating.", status: "wrong", misconception: "deceleration_sign_confused" },
          { id: "c", text: "The object is moving at a constant velocity.", status: "wrong" },
          { id: "d", text: "The object is stationary.", status: "wrong" }
        ]
      },
      {
        id: "mg_vt_area_distance", qtype: "mcq_single", tier: "higher",
        atom: "vt_area_distance", syllabus: "6.5.4.1.5.f.ii",
        prompt: "On a velocity-time graph, what does the area under the line represent?",
        explanation: "The area under a velocity-time graph is the distance travelled (or displacement).",
        diagram: { kind: "area_under_vt", params: { shape: "trapezium" } },
        distractors: [
          { id: "a", text: "The distance travelled", status: "correct" },
          { id: "b", text: "The acceleration", status: "wrong", misconception: "area_under_vt_not_recognised" },
          { id: "c", text: "The final velocity", status: "wrong", misconception: "area_under_vt_not_recognised" },
          { id: "d", text: "The time taken", status: "wrong" }
        ]
      },
      {
        id: "mg_vt_area_count", qtype: "mcq_single", tier: "higher",
        atom: "vt_area_distance", syllabus: "6.5.4.1.5.f.iii",
        prompt: "To find the distance from a curved velocity-time graph, a student counts the squares under the line. There are 9 squares, and each square represents 5 m. What distance does this give?",
        explanation: "Distance = number of squares x value of one square = 9 x 5 = 45 m.",
        distractors: [
          { id: "a", text: "45 m", status: "correct" },
          { id: "b", text: "9 m", status: "wrong", misconception: "area_under_vt_not_recognised" },
          { id: "c", text: "14 m", status: "wrong" },
          { id: "d", text: "1.8 m", status: "wrong", misconception: "gradient_ratio_inverted" }
        ]
      },
      {
        id: "mg_tangent_speed", qtype: "mcq_single", tier: "higher",
        atom: "dt_tangent_speed", syllabus: "6.5.4.1.4.c",
        prompt: "A distance-time graph is a curve (the object is accelerating). How do you find the object's speed at one particular instant?",
        explanation: "Draw a tangent to the curve at that point and find the gradient of the tangent. That gives the instantaneous speed.",
        distractors: [
          { id: "a", text: "Draw a tangent to the curve at that point and find its gradient.", status: "correct" },
          { id: "b", text: "Divide the total distance by the total time.", status: "wrong", misconception: "gradient_described_not_named" },
          { id: "c", text: "Read the distance value off the graph at that time.", status: "wrong", misconception: "graph_scale_misread" },
          { id: "d", text: "Find the area under the curve up to that point.", status: "wrong", misconception: "area_under_vt_not_recognised" }
        ]
      }
,

      /* Batch 6: acceleration (6.5.4.1.5.a/b/g). a=(v-u)/t as calc_workings
         (grades full). suvat v^2-u^2=2as as MCQ: the calc grader's evaluator
         does not support the ^ (power) operator, so the substitution mark on a
         squared-term equation cannot be earned with natural v^2 input - see
         review/acceleration.md. One light-gates multi-stage `stages`
         calc_workings (d029) demonstrates the chained form; it grades once
         Housing wires the d029 stage loop (ECF carry). */
      {
        id: "acc_eqn_recall", qtype: "mcq_single", tier: "both",
        atom: "accel_calc", syllabus: "6.5.4.1.5.a", equation_sheet: "must_recall",
        prompt: "Which equation links acceleration (a), change in velocity (dv) and time taken (t)?",
        explanation: "acceleration = change in velocity / time taken, a = dv / t.",
        distractors: [
          { id: "a", text: "a = dv / t", status: "correct" },
          { id: "b", text: "a = t / dv", status: "wrong", misconception: "wrong_formula_rearrangement" },
          { id: "c", text: "a = dv x t", status: "wrong", misconception: "wrong_formula_rearrangement" },
          { id: "d", text: "a = dv + t", status: "wrong" }
        ]
      },
      {
        id: "acc_calc", qtype: "calc_workings", tier: "both",
        atom: "accel_calc", syllabus: "6.5.4.1.5.a", equation_sheet: "must_recall",
        prompt: "A car speeds up from rest (0 m/s) to 24 m/s in a time of 8.0 s. Calculate the acceleration of the car.",
        explanation: "a = (v - u) / t = (24 - 0) / 8.0 = 3.0 m/s^2.",
        calc: {
          knowns: { v: 24, u: 0, t: 8.0 },
          unknown: "a",
          expectedFinalValue: 3.0,
          expectedUnit: ["m/s^2", "m/s2", "m s^-2"],
          equationCanonicalForms: ["a=(v-u)/t"],
          tolerance: 0.1,
          requireUnit: true,
          marks: 4
        }
      },
      {
        id: "acc_unit", qtype: "mcq_single", tier: "both",
        atom: "accel_calc", syllabus: "6.5.4.1.5.a",
        prompt: "What is the unit of acceleration?",
        explanation: "Acceleration is the change in velocity (m/s) per second, so its unit is metres per second squared, m/s^2.",
        distractors: [
          { id: "a", text: "m/s^2", status: "correct" },
          { id: "b", text: "m/s", status: "wrong", misconception: "accel_unit_unknown" },
          { id: "c", text: "m", status: "wrong", misconception: "accel_unit_unknown" },
          { id: "d", text: "s", status: "wrong", misconception: "accel_unit_unknown" }
        ]
      },
      {
        id: "acc_deceleration_calc", qtype: "mcq_single", tier: "both",
        atom: "deceleration", syllabus: "6.5.4.1.5.b",
        prompt: "A car slows down from 20 m/s to 8 m/s in a time of 4.0 s. What is its acceleration?",
        explanation: "a = (v - u) / t = (8 - 20) / 4.0 = -3.0 m/s^2. The negative sign shows it is a deceleration of 3.0 m/s^2.",
        distractors: [
          { id: "a", text: "-3.0 m/s^2 (a deceleration)", status: "correct" },
          { id: "b", text: "+3.0 m/s^2 (an acceleration)", status: "wrong", misconception: "deceleration_sign_confused" },
          { id: "c", text: "-7.0 m/s^2", status: "wrong", misconception: "wrong_formula_rearrangement" },
          { id: "d", text: "-12 m/s^2", status: "wrong" }
        ]
      },
      {
        id: "acc_decel_meaning", qtype: "mcq_single", tier: "both",
        atom: "deceleration", syllabus: "6.5.4.1.5.b",
        prompt: "An object is decelerating. What does this mean?",
        explanation: "Decelerating means slowing down: the velocity is decreasing, which is a negative acceleration.",
        distractors: [
          { id: "a", text: "It is slowing down (a negative acceleration).", status: "correct" },
          { id: "b", text: "It is speeding up.", status: "wrong", misconception: "deceleration_sign_confused" },
          { id: "c", text: "It is moving at a constant velocity.", status: "wrong" },
          { id: "d", text: "It is stationary.", status: "wrong" }
        ]
      },
      {
        id: "acc_suvat_recall", qtype: "mcq_single", tier: "both",
        atom: "suvat_calc", syllabus: "6.5.4.1.5.g", equation_sheet: "from_insert",
        prompt: "For an object moving with uniform acceleration, which equation links final velocity (v), initial velocity (u), acceleration (a) and distance (s)?",
        explanation: "v^2 - u^2 = 2as. This is a given (select-and-apply) equation on the equations sheet.",
        distractors: [
          { id: "a", text: "v^2 - u^2 = 2 a s", status: "correct" },
          { id: "b", text: "v - u = 2 a s", status: "wrong", misconception: "suvat_squared_mishandled" },
          { id: "c", text: "v^2 + u^2 = 2 a s", status: "wrong", misconception: "wrong_formula_rearrangement" },
          { id: "d", text: "v^2 - u^2 = 2 a / s", status: "wrong", misconception: "wrong_formula_rearrangement" }
        ]
      },
      {
        id: "acc_suvat_mcq", qtype: "mcq_single", tier: "both",
        atom: "suvat_calc", syllabus: "6.5.4.1.5.g", equation_sheet: "from_insert",
        prompt: "A car braking at a constant 3.0 m/s^2 slows from 12 m/s to rest (0 m/s). Calculate the braking distance. Use the equation: v^2 - u^2 = 2as.",
        explanation: "v^2 - u^2 = 2as, so s = (v^2 - u^2) / (2a) = (0 - 12^2) / (2 x -3.0) = -144 / -6 = 24 m.",
        distractors: [
          { id: "a", text: "24 m", status: "correct" },
          { id: "b", text: "144 m", status: "wrong", misconception: "suvat_squared_mishandled" },
          { id: "c", text: "2.0 m", status: "wrong", misconception: "accel_value_used_as_displacement" },
          { id: "d", text: "72 m", status: "wrong", misconception: "suvat_squared_mishandled" }
        ]
      },
      {
        id: "acc_estimate", qtype: "mcq_single", tier: "both",
        atom: "estimate_accel", syllabus: "6.5.4.1.5.c",
        prompt: "Which of these is the most realistic estimate for the acceleration of a car pulling away from traffic lights?",
        explanation: "A typical car accelerates at a few metres per second squared; about 2 m/s^2 is realistic. 0.02 is far too small and 200 far too large.",
        distractors: [
          { id: "a", text: "About 2 m/s^2", status: "correct" },
          { id: "b", text: "About 0.02 m/s^2", status: "wrong" },
          { id: "c", text: "About 200 m/s^2", status: "wrong" },
          { id: "d", text: "About 2000 m/s^2", status: "wrong" }
        ]
      },
      {
        id: "acc_lightgates_chain", qtype: "calc_workings", tier: "higher",
        atom: "accel_calc", syllabus: "6.5.4.1.5.a", equation_sheet: "must_recall",
        prompt: "A trolley starts from rest. A card of length 0.060 m on the trolley passes through a light gate in 0.030 s. The card reaches the light gate 1.6 s after the trolley was released. Calculate the acceleration of the trolley. (Stage 1: find the trolley's velocity at the gate from the card. Stage 2: use it to find the acceleration.)",
        explanation: "Stage 1: v = d / t = 0.060 / 0.030 = 2.0 m/s. Stage 2: a = (v - u) / t = (2.0 - 0) / 1.6 = 1.25 m/s^2. Chained calc_workings per d029; grades per-stage once Housing wires the ECF stage loop.",
        calc: {
          stages: [
            {
              knowns: { d: 0.060, t: 0.030 },
              unknown: "v",
              expectedFinalValue: 2.0,
              expectedUnit: ["m/s"],
              equationCanonicalForms: ["v=d/t"],
              tolerance: 0.05,
              requireUnit: false,
              marks: 2
            },
            {
              knowns: { v: 2.0, u: 0, t: 1.6 },
              unknown: "a",
              expectedFinalValue: 1.25,
              expectedUnit: ["m/s^2", "m/s2"],
              equationCanonicalForms: ["a=(v-u)/t"],
              tolerance: 0.05,
              requireUnit: true,
              marks: 2,
              gate: { kind: "from_previous_part" }
            }
          ]
        }
      }
,

      /* Batch 7: multi-stage CALCULATION CHAINS (the catalogued 4-6 markers,
         d037). Authored as mcq_single for now (the calc grader cannot yet grade
         prefix/multi-letter/^-power terms, see review/acceleration.md), BUT each
         carries the full real AQA marking data in `calc`: the per-stage 4-line
         blocks (d029), the per-mark Codex Layer-5 categories, the mark-scheme
         step text, AQA national facility, and source ref. Each distractor maps
         to a specific lost mark via `failsAt`, so Housing can derive a partial /
         fail grade from this data once the chained grader lands. See
         review/multistage_calc_chains.md. */
      {
        id: "cc_speed_camera", qtype: "mcq_single", tier: "higher",
        atom: "suvat_calc", syllabus: "6.5.4.1.5.g",
        difficulty: "d3", marks: 6, facility_pct: null, source: "aqa_ppq:trilogy_2020_p2h_06.3", equation_sheet: "from_insert",
        prompt: "A car is driven at constant speed past a speed camera. The camera records two images 0.70 s apart, and the car travels 14 m between them. The maximum deceleration of the car is 6.25 m/s^2. Calculate the minimum braking distance for the car at the speed it passed the camera. Use s = vt and v^2 - u^2 = 2as.",
        explanation: "Stage 1: v = d/t = 14 / 0.70 = 20 m/s. Stage 2: v^2 - u^2 = 2as, so s = (0^2 - 20^2) / (2 x -6.25) = 400 / 12.5 = 32 m.",
        calc: {
          markCategories: ["substitution","non_final_evaluation","substitution","rearrangement","non_final_evaluation","evaluation"],
          stages: [
            { equation: "v=d/t", knowns: { d: 14, t: 0.70 }, unknown: "v", expectedFinalValue: 20, expectedUnit: ["m/s"],
              markScheme: [ {mark:1,category:"substitution",text:"14 = v x 0.70"}, {mark:2,category:"non_final_evaluation",text:"v = 20 (m/s)"} ] },
            { equation: "v^2-u^2=2as", knowns: { v: 0, u: 20, a: -6.25 }, unknown: "s", expectedFinalValue: 32, expectedUnit: ["m"],
              gate: { kind: "from_previous_part" },
              markScheme: [ {mark:3,category:"substitution",text:"0^2 - 20^2 = 2 x (-6.25) x s"}, {mark:4,category:"rearrangement",text:"s = 20^2 / (2 x 6.25)"}, {mark:5,category:"non_final_evaluation",text:"= 400 / 12.5"}, {mark:6,category:"evaluation",text:"s = 32 (m)"} ] }
          ]
        },
        distractors: [
          { id: "a", text: "32 m", status: "correct" },
          { id: "b", text: "16 m", status: "wrong", misconception: "chain_prep_stage_skipped", failsAt: "stage1: used the 14 m between images as the speed, skipping v = d/t" },
          { id: "c", text: "2.0 m", status: "wrong", misconception: "accel_value_used_as_displacement", failsAt: "stage2: substituted the deceleration into the displacement slot" },
          { id: "d", text: "400 m", status: "wrong", misconception: "suvat_squared_mishandled", failsAt: "stage2: left v^2 without dividing by 2a" }
        ]
      },
      {
        id: "cc_apple_fall", qtype: "mcq_single", tier: "higher",
        atom: "suvat_calc", syllabus: "6.5.4.1.5.g",
        difficulty: "d2", marks: 6, facility_pct: 52, source: "aqa_ppq:trilogy_2022_p2h_07.2", equation_sheet: "from_insert",
        prompt: "An apple falls from rest and takes 0.50 s to reach the ground. The acceleration due to gravity is 9.8 m/s^2. Calculate the distance fallen by the apple. Use a = dv/t and v^2 - u^2 = 2as.",
        explanation: "Stage 1: a = dv/t, so dv = 9.8 x 0.50 = 4.9 m/s; the final velocity is 4.9 m/s. Stage 2: s = (v^2 - u^2)/(2a) = (4.9^2 - 0)/(2 x 9.8) = 24.01/19.6 = 1.2 m.",
        calc: {
          markCategories: ["substitution","non_final_evaluation","substitution","rearrangement","non_final_evaluation","evaluation"],
          stages: [
            { equation: "a=(v-u)/t", knowns: { a: 9.8, u: 0, t: 0.50 }, unknown: "v", expectedFinalValue: 4.9, expectedUnit: ["m/s"],
              markScheme: [ {mark:1,category:"substitution",text:"9.8 = dv / 0.5"}, {mark:2,category:"non_final_evaluation",text:"dv = final velocity = 4.9 (m/s)"} ] },
            { equation: "v^2-u^2=2as", knowns: { v: 4.9, u: 0, a: 9.8 }, unknown: "s", expectedFinalValue: 1.2, expectedUnit: ["m"],
              gate: { kind: "from_previous_part" },
              markScheme: [ {mark:3,category:"substitution",text:"4.9^2 - 0^2 = 2 x 9.8 x s"}, {mark:4,category:"rearrangement",text:"s = 4.9^2 / (2 x 9.8)"}, {mark:5,category:"non_final_evaluation",text:"= 24.01 / 19.6"}, {mark:6,category:"evaluation",text:"s = 1.2 (m)"} ] }
          ]
        },
        distractors: [
          { id: "a", text: "1.2 m", status: "correct" },
          { id: "b", text: "4.9 m", status: "wrong", misconception: "chain_intermediate_as_final", failsAt: "stopped at stage 1 and gave the velocity (4.9 m/s) as the distance" },
          { id: "c", text: "2.45 m", status: "wrong", misconception: "wrong_formula_rearrangement", failsAt: "stage2: used s = vt with the final velocity instead of v^2-u^2=2as" },
          { id: "d", text: "9.6 m", status: "wrong", misconception: "suvat_squared_mishandled", failsAt: "stage2: did not square the velocity" }
        ]
      },
      {
        id: "cc_aeroplane_mass", qtype: "mcq_single", tier: "higher",
        atom: "n2_calc", syllabus: "6.5.4.2.2.b",
        difficulty: "d3", marks: 5, facility_pct: 36, source: "aqa_ppq:trilogy_2019_p2h_06.2", equation_sheet: "must_recall",
        prompt: "An aeroplane lands at 80 m/s and decelerates to 10 m/s in 28 s. The mean resultant force on the aeroplane is 750000 N. Calculate the mass of the aeroplane. Use a = dv/t and F = ma.",
        explanation: "Stage 1: a = (10 - 80)/28 = -2.5 m/s^2. Stage 2: F = ma, so m = F/a = 750000 / 2.5 = 300000 kg.",
        calc: {
          markCategories: ["substitution","non_final_evaluation","substitution","rearrangement","evaluation"],
          stages: [
            { equation: "a=(v-u)/t", knowns: { v: 10, u: 80, t: 28 }, unknown: "a", expectedFinalValue: -2.5, expectedUnit: ["m/s^2"],
              markScheme: [ {mark:1,category:"substitution",text:"a = (10 - 80) / 28"}, {mark:2,category:"non_final_evaluation",text:"a = -2.5 (m/s^2)"} ] },
            { equation: "F=ma", knowns: { F: 750000, a: 2.5 }, unknown: "m", expectedFinalValue: 300000, expectedUnit: ["kg"],
              gate: { kind: "from_previous_part" },
              markScheme: [ {mark:3,category:"substitution",text:"750000 = m x 2.5"}, {mark:4,category:"rearrangement",text:"m = 750000 / 2.5"}, {mark:5,category:"evaluation",text:"m = 300000 (kg)"} ] }
          ]
        },
        distractors: [
          { id: "a", text: "300000 kg", status: "correct" },
          { id: "b", text: "1875000 kg", status: "wrong", misconception: "wrong_formula_rearrangement", failsAt: "stage2: used m = F x a instead of m = F / a" },
          { id: "c", text: "10714 kg", status: "wrong", misconception: "chain_prep_stage_skipped", failsAt: "stage1: divided F by the change in velocity (70) instead of finding a first" },
          { id: "d", text: "2.5 kg", status: "wrong", misconception: "chain_intermediate_as_final", failsAt: "gave the acceleration as the mass" }
        ]
      },
      {
        id: "cc_car_initial_velocity", qtype: "mcq_single", tier: "higher",
        atom: "accel_calc", syllabus: "6.5.4.1.5.a",
        difficulty: "d3", marks: 4, facility_pct: 18, source: "aqa_ppq:trilogy_2024_p2h_05.1", equation_sheet: "must_recall",
        prompt: "A car accelerates at 5.8 m/s^2 for 2.5 s. Its final velocity is 20 m/s. Calculate the initial velocity of the car. Use a = dv/t.",
        explanation: "dv = a x t = 5.8 x 2.5 = 14.5 m/s. Initial velocity u = v - dv = 20 - 14.5 = 5.5 m/s.",
        calc: {
          markCategories: ["substitution","rearrangement","non_final_evaluation","evaluation"],
          stages: [
            { equation: "a=(v-u)/t", knowns: { a: 5.8, v: 20, t: 2.5 }, unknown: "u", expectedFinalValue: 5.5, expectedUnit: ["m/s"],
              markScheme: [ {mark:1,category:"substitution",text:"5.8 = dv / 2.5"}, {mark:2,category:"rearrangement",text:"dv = 5.8 x 2.5"}, {mark:3,category:"non_final_evaluation",text:"dv = 14.5 (m/s)"}, {mark:4,category:"evaluation",text:"u = 20 - 14.5 = 5.5 (m/s)"} ] }
          ]
        },
        distractors: [
          { id: "a", text: "5.5 m/s", status: "correct" },
          { id: "b", text: "34.5 m/s", status: "wrong", misconception: "deceleration_sign_confused", failsAt: "final step: added dv to v (20 + 14.5) instead of subtracting" },
          { id: "c", text: "14.5 m/s", status: "wrong", misconception: "chain_intermediate_as_final", failsAt: "gave the change in velocity (14.5) as the initial velocity" },
          { id: "d", text: "8.0 m/s", status: "wrong", misconception: "wrong_formula_rearrangement", failsAt: "rearranged a = dv/t incorrectly" }
        ]
      }
    ]
  };

  window.TRILOGY_TOPICS["6.5"] = CONFIG;
})();
