/* ============================================================================
   Trilogy Physics - TOPIC_CONFIG for Magnetism & Electromagnetism 6.7, v0.1
   ----------------------------------------------------------------------------
   Per-topic config for the one shared engine (d016/d017). Mirrors
   app/topics/forces_6_5.js. AUTHORED by the 6.7 Authoring chat; this file
   FORKS AND SUPERSEDES app/topics/magnetism_6_7.generated.js (the mechanical
   migration of the legacy bank), per that file's own header. Housing: swap
   the script tag when wiring.

   VOCABULARY: review/trilogy_magnetism_vocabulary_proposal.md (PROPOSED,
   awaiting Architecture ratification; authoring proceeds on Smith's nod,
   matching the 6.5 precedent). Atom and misconception registries below are
   the full proposal sets; items land by subtag, one batch per
   review/<subtag>.md.

   BATCHES PRESENT: magnets_and_poles (6.7.1.1), induced_magnetism
   (6.7.1.1.e/f.ii, 6.7.1.2.b). Both Foundation-reachable (tier "both"
   throughout; the HT subtags motor_effect / dc_motor come later, with the
   F=BIl calc_workings and the d037 chains).

   SALVAGE (d034): items marked source:"salvaged:<old id>" rework an idea
   from the legacy 7_Magnetism/questions.js bank (deduped, retagged,
   re-graded); source:"aqa_ppq:<part>" mirrors a real bank part;
   source:"authored" is the spec-first/gap pass. Extra fields are ignored
   by the grader, read by tooling.

   Engine item shape (app/engine.js grader):
     { id, qtype, tier, atom, syllabus, prompt, explanation?, diagram?,
       distractors? | claims? | calc? }
     mcq* : distractors:[{id, text|diagram, status:"correct"|"wrong", misconception?}]
            (diagram options per SCHEMA v1.3 / d036; engine renders via
             window.TOPIC_DIAGRAMS, the 6.7 kinds in magnetism-diagrams.js)
     short: claims:[{id,text,correct:bool,misconception?}]
   ============================================================================ */

(function () {
  "use strict";

  window.TRILOGY_TOPICS = window.TRILOGY_TOPICS || {};

  // Atom registry (proposal section 2; grouped by subtag; tier-shared, d005)
  const ATOMS = [
    { slug: "poles_strongest_points",   label: "Poles are the strongest points",      subtag: "magnets_and_poles" },
    { slug: "like_unlike_poles",        label: "Like repel, unlike attract",          subtag: "magnets_and_poles" },
    { slug: "attract_repel_demo",       label: "Demonstrate attraction & repulsion",  subtag: "magnets_and_poles" },
    { slug: "magnetic_force_noncontact", label: "Magnetic force is non-contact",      subtag: "magnets_and_poles" },
    { slug: "test_permanent_magnet",    label: "Repulsion is the only test",          subtag: "magnets_and_poles" },

    { slug: "permanent_vs_induced",     label: "Permanent vs induced (temporary)",    subtag: "induced_magnetism" },
    { slug: "induced_polarity",         label: "Induced poles (opposite facing)",     subtag: "induced_magnetism" },
    { slug: "induced_always_attracts",  label: "Induced magnetism always attracts",   subtag: "induced_magnetism" },
    { slug: "magnetic_materials_recall", label: "Iron, steel, nickel, cobalt",        subtag: "induced_magnetism" },
    { slug: "identify_magnet_iron_other", label: "Identify magnet / iron / other",    subtag: "induced_magnetism" },

    { slug: "field_definition",         label: "What a magnetic field is",            subtag: "magnetic_fields" },
    { slug: "field_line_drawing",       label: "Draw the bar-magnet field",           subtag: "magnetic_fields" },
    { slug: "field_direction_convention", label: "Field direction (force on a free N)", subtag: "magnetic_fields" },
    { slug: "field_strength_spacing",   label: "Line spacing shows strength",         subtag: "magnetic_fields" },
    { slug: "field_strength_distance",  label: "Field weakens with distance",         subtag: "magnetic_fields" },
    { slug: "plot_field_with_compass",  label: "Plot a field line with a compass",    subtag: "magnetic_fields" },

    { slug: "compass_is_bar_magnet",    label: "A compass is a small bar magnet",     subtag: "compass_and_earth" },
    { slug: "earth_field_evidence",     label: "Compass evidence for Earth's core",   subtag: "compass_and_earth" },

    { slug: "wire_field_pattern",       label: "Field around a wire (circles)",       subtag: "electromagnetism" },
    { slug: "wire_field_direction",     label: "Right-hand grip / circulation",       subtag: "electromagnetism" },
    { slug: "wire_field_distance",      label: "Wire field weakens with distance",    subtag: "electromagnetism" },
    { slug: "solenoid_field_pattern",   label: "Solenoid field pattern & poles",      subtag: "electromagnetism" },
    { slug: "solenoid_strengthening",   label: "Strengthen a solenoid/electromagnet", subtag: "electromagnetism" },
    { slug: "electromagnet_definition", label: "What an electromagnet is",            subtag: "electromagnetism" },
    { slug: "electromagnet_applications", label: "Electromagnet uses & advantage",    subtag: "electromagnetism" },
    { slug: "magnetic_effect_demo",     label: "Demonstrate a current's field",       subtag: "electromagnetism" },

    { slug: "motor_effect_concept",     label: "Why the wire feels a force (HT)",     subtag: "motor_effect" },
    { slug: "flhr_labels",              label: "Fleming's LHR finger labels (HT)",    subtag: "motor_effect" },
    { slug: "flhr_apply",               label: "Apply Fleming's LHR (HT)",            subtag: "motor_effect" },
    { slug: "bil_calc",                 label: "F = BIl (HT)",                        subtag: "motor_effect" },
    { slug: "flux_density_unit",        label: "Tesla (HT)",                          subtag: "motor_effect" },
    { slug: "motor_force_factors",      label: "Factors affecting the force (HT)",    subtag: "motor_effect" },
    { slug: "force_direction_reversal", label: "Reversing the force (HT)",            subtag: "motor_effect" },
    { slug: "right_angle_condition",    label: "Right angles / parallel = zero (HT)", subtag: "motor_effect" },
    { slug: "balance_experiment_reasoning", label: "Balance experiment & N3 (HT)",    subtag: "motor_effect" },

    { slug: "motor_rotation_explain",   label: "Why the coil rotates (HT)",           subtag: "dc_motor" },
    { slug: "commutator_function",      label: "Split-ring commutator (HT)",          subtag: "dc_motor" },
    { slug: "motor_speed_changes",      label: "Change the rotation rate (HT)",       subtag: "dc_motor" }
  ];

  // Misconception registry (proposal section 3: 20 NEW_FLAG + ports + shared WS)
  const MISCONCEPTIONS = [
    // NEW_FLAG (examiner-report-evidenced; pending ratification with the proposal)
    { slug: "pole_names_confused",            label: "Poles named +/-, east/west or by colour (NEW)" },
    { slug: "attraction_taken_as_magnet_proof", label: "Took attraction as proof of a permanent magnet (NEW)" },
    { slug: "induced_magnet_expected_to_repel", label: "Expected the other pole to repel a magnetic material (NEW)" },
    { slug: "magnetic_materials_misidentified", label: "Wrong metals called magnetic (NEW)" },
    { slug: "magnetic_material_treated_as_magnet", label: "Treated a magnetic material as a magnet itself (NEW)" },
    { slug: "field_arrows_reversed",          label: "Field arrows drawn S to N (NEW)" },
    { slug: "field_arrows_radial",            label: "Arrows point straight away from the magnet (NEW)" },
    { slug: "field_strength_evidence_missed", label: "Could not read strength from line spacing (NEW)" },
    { slug: "force_increases_with_distance",  label: "Said magnetic force grows with distance (NEW)" },
    { slug: "earth_field_link_missed",        label: "'Points north' with no Earth-field link (NEW)" },
    { slug: "wire_field_shape_wrong",         label: "Wrong field shape around a wire (NEW)" },
    { slug: "coil_turns_stated_ambiguously",  label: "Said 'more coils' instead of more turns (NEW)" },
    { slug: "electromagnet_mechanism_missing", label: "Switch-on/off answer with no mechanism (NEW)" },
    { slug: "stronger_magnet_for_electromagnet", label: "'Use a stronger magnet' for an electromagnet (NEW)" },
    { slug: "magnitude_change_given_for_reversal", label: "Gave a size change to reverse a direction (NEW)" },
    { slug: "flhr_finger_assignment_confused", label: "Fleming finger assignments confused (NEW)" },
    { slug: "flux_density_unit_unknown",      label: "Could not give the tesla (NEW)" },
    { slug: "balance_increase_called_weight_gain", label: "Balance increase called weight/gravity gain (NEW)" },
    { slug: "current_attracted_to_pole",      label: "Current 'attracted/repelled' by a pole (NEW)" },
    { slug: "motor_opposite_currents_missed", label: "Opposite currents on the two sides missed (NEW)" },
    // Ports (registered slugs valid for 6.7; see proposal section 3)
    { slug: "contact_noncontact_misclassified", label: "Misclassified a contact/non-contact force" },
    { slug: "confused_v_and_i",               label: "Confused potential difference with current" },
    { slug: "wrong_formula_rearrangement",    label: "Rearranged the formula the wrong way" },
    { slug: "picked_given_value",             label: "Answered with a value from the stem" },
    { slug: "power_of_ten_evaluation_error",  label: "Place-value slip in the evaluation" },
    { slug: "rounding_mistake",               label: "Rounding slip on the right method" },
    // Shared WS / cross-topic (owned at Overview, referenced here)
    { slug: "prefix_not_converted",           label: "Prefix not converted (mm/cm/mT/g)" },
    { slug: "proportionality_stated_as_increases", label: "'Increases' instead of proportional" },
    { slug: "repeatability_reproducibility_confused", label: "Repeatability vs reproducibility" },
    { slug: "sig_figs_not_applied",           label: "Significant figures not applied" }
  ];

  const CONFIG = {
    id: "6.7",
    slug: "magnetism",
    name: "Magnetism & Electromagnetism",
    board: "AQA Trilogy 8464",
    atoms: ATOMS,
    misconceptions: MISCONCEPTIONS,
    // Static kinds registered by the 6.7 Widgets chat (magnetism-diagrams.js);
    // flhr_direction and mark_poles are the d042 INTERACTIVE kinds (qtype "widget").
    diagram_kinds: ["bar_magnet_field", "uniform_field", "two_magnets_field",
                    "solenoid_field", "electromagnet", "induced_magnetism",
                    "magnetic_materials", "compass", "field_mapping",
                    "wire_field", "flemings_lhr", "motor_effect_setup", "dc_motor"],

    items: [
      /* ===================================================================
         Batch 1: magnets_and_poles (6.7.1.1.a-d, f.i). All five atoms.
         See review/magnets_and_poles.md.
         =================================================================== */
      {
        id: "mp_poles_strongest", qtype: "mcq_single", tier: "both",
        atom: "poles_strongest_points", syllabus: "6.7.1.1.a",
        source: "aqa_ppq:trilogy_2021_p2h_04.1",
        prompt: "Where are the magnetic forces of a bar magnet strongest?",
        explanation: "The poles of a magnet are the places where the magnetic forces are strongest (AQA: only 33% knew this in 2021).",
        applicable_misconceptions: ["field_strength_evidence_missed"],
        distractors: [
          { id: "a", text: "At the two poles.", status: "correct" },
          { id: "b", text: "At the centre of the magnet.", status: "wrong" },
          { id: "c", text: "Spread evenly over the whole magnet.", status: "wrong", misconception: "field_strength_evidence_missed" },
          { id: "d", text: "Only at the north pole.", status: "wrong" }
        ]
      },
      {
        id: "mp_strongest_position_diagram", qtype: "mcq_single", tier: "both",
        atom: "poles_strongest_points", syllabus: "6.7.1.1.a",
        source: "aqa_ppq:trilogy_2019_p2f_01.2",
        prompt: "The diagram shows a bar magnet and its magnetic field. A steel paperclip is placed near the magnet. Where will the magnetic force on the paperclip be strongest?",
        explanation: "Closest to a pole: that is where the field lines are most concentrated and the forces strongest.",
        diagram: { kind: "bar_magnet_field", params: { variant: "correct" } },
        applicable_misconceptions: ["field_strength_evidence_missed", "force_increases_with_distance"],
        distractors: [
          { id: "a", text: "Right next to one of the poles.", status: "correct" },
          { id: "b", text: "Next to the middle of one of the long sides.", status: "wrong", misconception: "field_strength_evidence_missed" },
          { id: "c", text: "Far away from the magnet, where the field lines are widely spaced.", status: "wrong", misconception: "force_increases_with_distance" },
          { id: "d", text: "Anywhere; the force is the same at all positions.", status: "wrong", misconception: "field_strength_evidence_missed" }
        ]
      },
      {
        id: "mp_pole_names", qtype: "mcq_single", tier: "both",
        atom: "like_unlike_poles", syllabus: "6.7.1.1.a",
        source: "authored", // gap pass; evidenced by 2025 P2F 4.1 ("east and west poles, or positive and negative")
        prompt: "What are the two poles of a magnet called?",
        explanation: "North and south. Poles are not positive/negative (that is charge) and not east/west (that is a compass bearing).",
        applicable_misconceptions: ["pole_names_confused"],
        distractors: [
          { id: "a", text: "North pole and south pole.", status: "correct" },
          { id: "b", text: "Positive pole and negative pole.", status: "wrong", misconception: "pole_names_confused" },
          { id: "c", text: "East pole and west pole.", status: "wrong", misconception: "pole_names_confused" },
          { id: "d", text: "Red pole and blue pole.", status: "wrong", misconception: "pole_names_confused" }
        ]
      },
      {
        id: "mp_like_poles", qtype: "mcq_single", tier: "both",
        atom: "like_unlike_poles", syllabus: "6.7.1.1.c",
        source: "salvaged:poles_pair_10",
        prompt: "The north pole of one magnet is brought near the north pole of another magnet. What happens?",
        explanation: "Two like poles repel each other.",
        applicable_misconceptions: ["pole_names_confused"],
        distractors: [
          { id: "a", text: "The magnets repel each other.", status: "correct" },
          { id: "b", text: "The magnets attract each other.", status: "wrong" },
          { id: "c", text: "There is no force between them.", status: "wrong" },
          { id: "d", text: "They attract, then repel once they touch.", status: "wrong" }
        ]
      },
      {
        id: "mp_unlike_poles", qtype: "mcq_single", tier: "both",
        atom: "like_unlike_poles", syllabus: "6.7.1.1.c",
        source: "salvaged:poles_pair_1",
        prompt: "The north pole of one magnet is brought near the south pole of another magnet. What happens?",
        explanation: "Two unlike poles attract each other.",
        distractors: [
          { id: "a", text: "The magnets attract each other.", status: "correct" },
          { id: "b", text: "The magnets repel each other.", status: "wrong" },
          { id: "c", text: "There is no force until they touch.", status: "wrong" },
          { id: "d", text: "Only the north pole exerts a force.", status: "wrong" }
        ]
      },
      {
        id: "mp_attract_conclusion", qtype: "mcq_single", tier: "both",
        atom: "like_unlike_poles", syllabus: "6.7.1.1.c",
        source: "aqa_ppq:trilogy_2023_p2f_03.3",
        prompt: "Two bar magnets are brought close together and they ATTRACT. The facing poles are marked X and Y. What can you conclude about X and Y?",
        explanation: "Attraction means the facing poles are unlike: one north, one south. You cannot tell which is which from attraction alone.",
        applicable_misconceptions: ["pole_names_confused"],
        distractors: [
          { id: "a", text: "X and Y are unlike poles (one north, one south).", status: "correct" },
          { id: "b", text: "X and Y are both north poles.", status: "wrong" },
          { id: "c", text: "X and Y are both south poles.", status: "wrong" },
          { id: "d", text: "X is positive and Y is negative.", status: "wrong", misconception: "pole_names_confused" }
        ]
      },
      {
        id: "mp_repel_conclusion_multi", qtype: "mcq_multi", tier: "both",
        atom: "like_unlike_poles", syllabus: "6.7.1.1.c",
        source: "authored", // gap pass: the repulsion counterpart of 2023 P2F 3.3
        prompt: "Two bar magnets are brought close together and they REPEL. Which two of the following could the facing poles be? Tick two.",
        explanation: "Repulsion means the facing poles are like poles: both north or both south. A north-south pair would attract.",
        distractors: [
          { id: "a", text: "Both north poles.", status: "correct" },
          { id: "b", text: "Both south poles.", status: "correct" },
          { id: "c", text: "One north pole and one south pole.", status: "wrong" },
          { id: "d", text: "One magnetised pole and one unmagnetised pole.", status: "wrong", misconception: "magnetic_material_treated_as_magnet" }
        ]
      },
      {
        id: "mp_force_interaction", qtype: "mcq_single", tier: "both",
        atom: "like_unlike_poles", syllabus: "6.7.1.1.b",
        source: "authored", // spec-first: 6.7.1.1.b "they exert a force on each other"
        prompt: "Two magnets are brought close together. Which statement about the forces is correct?",
        explanation: "When two magnets are brought close together they exert a force on EACH OTHER: each magnet feels an equal-sized force (Newton's third law).",
        distractors: [
          { id: "a", text: "Each magnet exerts a force on the other.", status: "correct" },
          { id: "b", text: "Only the stronger magnet exerts a force.", status: "wrong" },
          { id: "c", text: "Only the north poles exert forces.", status: "wrong" },
          { id: "d", text: "There is no force unless the magnets touch.", status: "wrong", misconception: "contact_noncontact_misclassified" }
        ]
      },
      {
        id: "mp_noncontact", qtype: "mcq_single", tier: "both",
        atom: "magnetic_force_noncontact", syllabus: "6.7.1.1.d",
        source: "salvaged:non_contact",
        prompt: "Attraction and repulsion between two magnetic poles are examples of which type of force?",
        explanation: "Magnetic forces act between separated objects, so they are non-contact forces (like gravity and electrostatic forces).",
        applicable_misconceptions: ["contact_noncontact_misclassified"],
        distractors: [
          { id: "a", text: "Non-contact force.", status: "correct" },
          { id: "b", text: "Contact force.", status: "wrong", misconception: "contact_noncontact_misclassified" },
          { id: "c", text: "Friction force.", status: "wrong", misconception: "contact_noncontact_misclassified" },
          { id: "d", text: "Electrostatic force.", status: "wrong" }
        ]
      },
      {
        id: "mp_attract_repel_demo", qtype: "short", tier: "both",
        atom: "attract_repel_demo", syllabus: "6.7.1.1.f.i",
        source: "aqa_ppq:trilogy_2019_p2f_01.3",
        prompt: "Describe how two bar magnets can be used to demonstrate a force of attraction AND a force of repulsion. (2 marks)",
        explanation: "AQA mark scheme: bring a north pole near a south pole to show attraction; bring two like poles (N-N or S-S) together to show repulsion. Vague answers ('put opposite sides together') and 'positive/negative' poles scored zero.",
        applicable_misconceptions: ["pole_names_confused"],
        claims: [
          { id: "a", text: "Bring the north pole of one magnet near the south pole of the other: they attract.", correct: true },
          { id: "b", text: "Bring two north poles (or two south poles) together: they repel.", correct: true },
          { id: "c", text: "Bring the positive end of one magnet near the negative end of the other.", correct: false, misconception: "pole_names_confused" },
          { id: "d", text: "Put the two magnets anywhere near each other; they always attract.", correct: false }
        ]
      },
      {
        id: "mp_test_permanent_claims", qtype: "short", tier: "both",
        atom: "test_permanent_magnet", syllabus: "6.7.1.1.f.ii",
        source: "aqa_ppq:trilogy_2023_p2h_04.4",
        prompt: "You have an iron bar that may or may not be a permanent magnet, and a known permanent magnet. Describe how to test whether the iron bar is a permanent magnet. (2 marks)",
        explanation: "AQA mark scheme: bring the same end of the iron bar near each pole of the known magnet in turn. Any repulsion shows the bar is a permanent magnet; if one end is attracted to BOTH poles, it is not. Most students wrongly said any attraction proves it is a magnet.",
        applicable_misconceptions: ["attraction_taken_as_magnet_proof"],
        claims: [
          { id: "a", text: "Bring the same end of the iron bar close to each pole of the known magnet in turn.", correct: true },
          { id: "b", text: "If there is any repulsion, the iron bar is a permanent magnet.", correct: true },
          { id: "c", text: "If the bar is attracted to the magnet, that proves it is a permanent magnet.", correct: false, misconception: "attraction_taken_as_magnet_proof" },
          { id: "d", text: "Weigh the bar; permanent magnets are heavier.", correct: false }
        ]
      },
      {
        id: "mp_test_permanent_mcq", qtype: "mcq_single", tier: "both",
        atom: "test_permanent_magnet", syllabus: "6.7.1.1.f.ii",
        source: "authored", // spec-first restatement of the 2023 idea as a single diagnostic pick
        prompt: "Which observation PROVES that a metal bar is a permanent magnet?",
        explanation: "Only repulsion is proof. Attraction happens with any magnetic material (because of induced magnetism), so it cannot distinguish a magnet from a piece of iron.",
        applicable_misconceptions: ["attraction_taken_as_magnet_proof", "magnetic_material_treated_as_magnet"],
        distractors: [
          { id: "a", text: "One end of the bar is repelled by a pole of a known magnet.", status: "correct" },
          { id: "b", text: "The bar is attracted to a pole of a known magnet.", status: "wrong", misconception: "attraction_taken_as_magnet_proof" },
          { id: "c", text: "The bar attracts an iron nail.", status: "wrong", misconception: "attraction_taken_as_magnet_proof" },
          { id: "d", text: "The bar is made of steel.", status: "wrong" }
        ]
      },
      {
        id: "mp_ring_float", qtype: "mcq_single", tier: "both",
        atom: "like_unlike_poles", syllabus: "6.7.1.1.c",
        source: "salvaged:ppq_ring_float", // mirrors specimen set 1 P2F 4.1
        prompt: "A ring magnet appears to float above another ring magnet on a vertical rod. What is the most likely reason?",
        explanation: "The facing surfaces are like poles, so they repel; the repulsion balances the top magnet's weight.",
        distractors: [
          { id: "a", text: "The facing poles are like poles, so the magnets repel.", status: "correct" },
          { id: "b", text: "The facing poles are unlike poles, so the magnets attract.", status: "wrong" },
          { id: "c", text: "The top magnet is too light for gravity to act on it.", status: "wrong" },
          { id: "d", text: "The rod pushes the top magnet upwards.", status: "wrong" }
        ]
      },
      {
        id: "mp_ring_flip", qtype: "mcq_single", tier: "both",
        atom: "like_unlike_poles", syllabus: "6.7.1.1.c",
        source: "salvaged:ppq_ring_flip", // mirrors specimen set 1 P2F 4.2
        prompt: "The floating ring magnet is lifted off, turned upside down, and put back on the rod. What happens now?",
        explanation: "Flipping the magnet swaps which pole faces down, so the facing poles are now unlike: the magnets attract and the top one falls and sticks to the bottom one.",
        distractors: [
          { id: "a", text: "The magnets attract, so the top magnet falls and sticks to the lower one.", status: "correct" },
          { id: "b", text: "The top magnet floats at the same height as before.", status: "wrong" },
          { id: "c", text: "The top magnet floats, but higher than before.", status: "wrong" },
          { id: "d", text: "The magnets lose their magnetism.", status: "wrong" }
        ]
      },

      /* ===================================================================
         Batch 2: induced_magnetism (6.7.1.1.e, 6.7.1.1.f.ii, 6.7.1.2.b).
         All five atoms. See review/induced_magnetism.md.
         =================================================================== */
      {
        id: "im_type_name", qtype: "mcq_single", tier: "both",
        atom: "permanent_vs_induced", syllabus: "6.7.1.1.e",
        source: "aqa_ppq:trilogy_2019_p2f_01.4",
        prompt: "Paperclips become magnetised when they are close to a permanent magnet. What is the name of this type of magnetism?",
        explanation: "Induced magnetism: the magnet's field turns the magnetic material into a temporary magnet. (Half of students got this in 2019.)",
        distractors: [
          { id: "a", text: "Induced magnetism.", status: "correct" },
          { id: "b", text: "Forced magnetism.", status: "wrong" },
          { id: "c", text: "Permanent magnetism.", status: "wrong", misconception: "magnetic_material_treated_as_magnet" },
          { id: "d", text: "Static magnetism.", status: "wrong" }
        ]
      },
      {
        id: "im_permanent_def", qtype: "mcq_single", tier: "both",
        atom: "permanent_vs_induced", syllabus: "6.7.1.1.e",
        source: "salvaged:perm_definition",
        prompt: "Which statement best describes a PERMANENT magnet?",
        explanation: "A permanent magnet produces its own magnetic field all the time. An induced magnet only becomes magnetic when it is in another magnetic field.",
        distractors: [
          { id: "a", text: "It produces its own magnetic field.", status: "correct" },
          { id: "b", text: "It only becomes magnetic when placed in a magnetic field.", status: "wrong" },
          { id: "c", text: "It is only magnetic while a current flows through it.", status: "wrong" },
          { id: "d", text: "It always repels magnetic materials.", status: "wrong", misconception: "induced_magnet_expected_to_repel" }
        ]
      },
      {
        id: "im_induced_def", qtype: "mcq_single", tier: "both",
        atom: "permanent_vs_induced", syllabus: "6.7.1.1.e",
        source: "authored", // spec-first: the induced half of 6.7.1.1.e
        prompt: "Which statement best describes an INDUCED magnet?",
        explanation: "An induced magnet is a material that becomes a magnet when it is placed in a magnetic field, and loses most of its magnetism quickly when removed.",
        distractors: [
          { id: "a", text: "A material that becomes a magnet when placed in a magnetic field.", status: "correct" },
          { id: "b", text: "A magnet that produces its own field all the time.", status: "wrong" },
          { id: "c", text: "A magnet that can only repel other magnets.", status: "wrong", misconception: "induced_magnet_expected_to_repel" },
          { id: "d", text: "Any metal object near a magnet.", status: "wrong", misconception: "magnetic_materials_misidentified" }
        ]
      },
      {
        id: "im_temporary", qtype: "mcq_single", tier: "both",
        atom: "permanent_vs_induced", syllabus: "6.7.1.1.e",
        source: "salvaged:induced_temporary",
        prompt: "An induced magnet is removed from the magnetic field that magnetised it. What usually happens?",
        explanation: "Induced magnetism is temporary: the material loses most or all of its magnetism quickly once it leaves the field.",
        distractors: [
          { id: "a", text: "It loses most of its magnetism quickly.", status: "correct" },
          { id: "b", text: "It keeps its magnetism permanently.", status: "wrong", misconception: "magnetic_material_treated_as_magnet" },
          { id: "c", text: "Its poles swap over.", status: "wrong" },
          { id: "d", text: "It becomes a stronger magnet.", status: "wrong" }
        ]
      },
      {
        id: "im_polarity_nail", qtype: "mcq_single", tier: "both",
        atom: "induced_polarity", syllabus: "6.7.1.1.e",
        source: "aqa_ppq:trilogy_2021_p2f_02.2",
        prompt: "The NORTH pole of a permanent magnet is held near one end of an iron nail. The nail becomes an induced magnet. What does the end of the nail NEAREST the magnet become?",
        explanation: "The near end is induced as the OPPOSITE pole (a south pole), which is why the nail is attracted. If the near end became a north pole the nail would be repelled, which never happens with induced magnetism.",
        diagram: { kind: "induced_magnetism", params: { object: "nail", pole: "N", variant: "correct" } },
        applicable_misconceptions: ["induced_magnet_expected_to_repel"],
        distractors: [
          { id: "a", text: "A south pole.", status: "correct" },
          { id: "b", text: "A north pole.", status: "wrong", misconception: "induced_magnet_expected_to_repel" },
          { id: "c", text: "It has no pole.", status: "wrong" },
          { id: "d", text: "A positive pole.", status: "wrong", misconception: "pole_names_confused" }
        ]
      },
      {
        id: "im_polarity_diagram_pick", qtype: "mcq_single", tier: "both",
        atom: "induced_polarity", syllabus: "6.7.1.1.e",
        source: "aqa_ppq:trilogy_2019_p2f_01.5", // interim MCQ form of the label-the-poles draw item (d036; upgrades to the mark_poles interactive widget)
        prompt: "A permanent magnet holds a chain of paperclips, which become induced magnets. Which diagram labels the induced poles CORRECTLY?",
        explanation: "Each near face is induced opposite to the pole facing it, so the poles alternate down the chain and every junction is an attraction. In 2019 only 27% labelled both clips correctly.",
        applicable_misconceptions: ["induced_magnet_expected_to_repel"],
        distractors: [
          { id: "a", diagram: { kind: "induced_magnetism", params: { object: "clip_chain", pole: "N", n: 2, variant: "correct" } }, status: "correct" },
          { id: "b", diagram: { kind: "induced_magnetism", params: { object: "clip_chain", pole: "N", n: 2, variant: "wrong_poles" } }, status: "wrong", misconception: "induced_magnet_expected_to_repel" },
          { id: "c", text: "Neither: paperclips cannot have poles.", status: "wrong" }
        ]
      },
      {
        id: "im_clip_chain_why", qtype: "mcq_single", tier: "both",
        atom: "induced_polarity", syllabus: "6.7.1.1.e",
        source: "authored", // gap pass: the chain mechanism behind 2019 P2F 1.5
        prompt: "A paperclip hangs from a magnet. A second paperclip sticks to the bottom of the first. Why?",
        explanation: "The first clip is an induced magnet, so it has its own (temporary) poles and induces magnetism in the second clip, attracting it.",
        applicable_misconceptions: ["magnetic_material_treated_as_magnet"],
        distractors: [
          { id: "a", text: "The first clip becomes an induced magnet and magnetises the second.", status: "correct" },
          { id: "b", text: "Paperclips are permanent magnets.", status: "wrong", misconception: "magnetic_material_treated_as_magnet" },
          { id: "c", text: "The clips are held together by electrostatic charge.", status: "wrong" },
          { id: "d", text: "The second clip is glued by friction.", status: "wrong" }
        ]
      },
      {
        id: "im_south_pole_return", qtype: "mcq_single", tier: "both",
        atom: "induced_always_attracts", syllabus: "6.7.1.2.b",
        source: "aqa_ppq:trilogy_2020_p2f_06.2",
        prompt: "A paperclip is attracted to the NORTH pole of a permanent magnet. The paperclip is removed, then brought close to the SOUTH pole of the same magnet. What happens?",
        explanation: "It is attracted again. The clip is an induced magnet: whichever pole approaches, the near face is induced opposite, so the force between a magnet and a magnetic material is ALWAYS attraction. The vast majority of students predicted repulsion (only 16% of Foundation students got this).",
        applicable_misconceptions: ["induced_magnet_expected_to_repel"],
        distractors: [
          { id: "a", text: "The paperclip is attracted to the south pole.", status: "correct" },
          { id: "b", text: "The paperclip is repelled by the south pole.", status: "wrong", misconception: "induced_magnet_expected_to_repel" },
          { id: "c", text: "There is no force this time.", status: "wrong" },
          { id: "d", text: "The paperclip is pushed sideways.", status: "wrong" }
        ]
      },
      {
        id: "im_south_pole_explain", qtype: "short", tier: "both",
        atom: "induced_always_attracts", syllabus: "6.7.1.2.b",
        source: "aqa_ppq:trilogy_2020_p2h_01.2",
        prompt: "Explain what happens when the paperclip (not a permanent magnet) is brought close to the SOUTH pole of the permanent magnet. (2 marks)",
        explanation: "AQA mark scheme: the paperclip is still attracted (1) because it is an induced/temporary magnet, so the face nearest the south pole becomes a north pole (1). Only 11% of Higher students scored both marks.",
        applicable_misconceptions: ["induced_magnet_expected_to_repel", "magnetic_material_treated_as_magnet"],
        claims: [
          { id: "a", text: "The paperclip is attracted to the south pole.", correct: true },
          { id: "b", text: "The paperclip is an induced (temporary) magnet: the near face becomes a north pole.", correct: true },
          { id: "c", text: "The paperclip is repelled, because it was attracted to the north pole before.", correct: false, misconception: "induced_magnet_expected_to_repel" },
          { id: "d", text: "The paperclip keeps the poles it had, like a permanent magnet.", correct: false, misconception: "magnetic_material_treated_as_magnet" }
        ]
      },
      {
        id: "im_always_attract", qtype: "mcq_single", tier: "both",
        atom: "induced_always_attracts", syllabus: "6.7.1.2.b",
        source: "aqa_ppq:trilogy_2024_p2f_04.4",
        prompt: "Which of the following describes the force between a magnet and a magnetic material?",
        explanation: "Always attractive: the material is induced with the opposite pole facing the magnet, whichever way round the magnet is. (Just under 40% got this in 2024.)",
        applicable_misconceptions: ["induced_magnet_expected_to_repel"],
        distractors: [
          { id: "a", text: "The force is always attractive.", status: "correct" },
          { id: "b", text: "The force is always repulsive.", status: "wrong" },
          { id: "c", text: "The force can be attractive or repulsive.", status: "wrong", misconception: "induced_magnet_expected_to_repel" },
          { id: "d", text: "There is no force until they touch.", status: "wrong", misconception: "contact_noncontact_misclassified" }
        ]
      },
      {
        id: "im_materials_two", qtype: "mcq_multi", tier: "both",
        atom: "magnetic_materials_recall", syllabus: "6.7.1.1.e",
        source: "aqa_ppq:trilogy_2021_p2f_02.4",
        prompt: "Which TWO of the following metals would be attracted to a magnet? Tick two.",
        explanation: "Nickel and steel (an iron alloy) are magnetic. Aluminium, copper and magnesium are not, even though they are metals. Only about 15% of students picked both correctly in 2021.",
        applicable_misconceptions: ["magnetic_materials_misidentified"],
        distractors: [
          { id: "a", text: "Nickel", status: "correct" },
          { id: "b", text: "Steel", status: "correct" },
          { id: "c", text: "Aluminium", status: "wrong", misconception: "magnetic_materials_misidentified" },
          { id: "d", text: "Copper", status: "wrong", misconception: "magnetic_materials_misidentified" },
          { id: "e", text: "Magnesium", status: "wrong", misconception: "magnetic_materials_misidentified" }
        ]
      },
      {
        id: "im_materials_five", qtype: "mcq_multi", tier: "both",
        atom: "magnetic_materials_recall", syllabus: "6.7.1.1.e",
        source: "salvaged:ppq_which_metals_magnetic", // mirrors trilogy_2020 06.1/01.1
        prompt: "A student tests five metals with a magnet: iron, steel, aluminium, copper and brass. Which TWO are attracted to the magnet? Tick two.",
        explanation: "Iron and steel. In 2020 only 2% of Foundation students (11% Higher) identified exactly these; many thought ALL metals are magnetic.",
        diagram: { kind: "magnetic_materials", params: { materials: ["iron", "steel", "aluminium", "copper", "brass"] } },
        applicable_misconceptions: ["magnetic_materials_misidentified"],
        distractors: [
          { id: "a", text: "Iron", status: "correct" },
          { id: "b", text: "Steel", status: "correct" },
          { id: "c", text: "Aluminium", status: "wrong", misconception: "magnetic_materials_misidentified" },
          { id: "d", text: "Copper", status: "wrong", misconception: "magnetic_materials_misidentified" },
          { id: "e", text: "Brass", status: "wrong", misconception: "magnetic_materials_misidentified" }
        ]
      },
      {
        id: "im_compass_needle_material", qtype: "mcq_single", tier: "both",
        atom: "magnetic_materials_recall", syllabus: "6.7.1.2.e",
        source: "aqa_ppq:trilogy_2022_p2f_04.2",
        prompt: "A compass needle is a small magnet. What material could the needle be made from?",
        explanation: "Steel: it is magnetic AND keeps its magnetism (a compass needle must stay magnetised). Aluminium, copper and plastic are not magnetic. Only 33% got this in 2022; aluminium was the most popular answer.",
        applicable_misconceptions: ["magnetic_materials_misidentified"],
        distractors: [
          { id: "a", text: "Steel", status: "correct" },
          { id: "b", text: "Aluminium", status: "wrong", misconception: "magnetic_materials_misidentified" },
          { id: "c", text: "Copper", status: "wrong", misconception: "magnetic_materials_misidentified" },
          { id: "d", text: "Plastic", status: "wrong" }
        ]
      },
      {
        id: "im_identify_blocks", qtype: "short", tier: "both",
        atom: "identify_magnet_iron_other", syllabus: "6.7.1.1.f.ii",
        source: "aqa_ppq:trilogy_2018_p2h_02.2",
        prompt: "Three unlabelled metal blocks are: a permanent magnet, a block of iron, and a block of aluminium. Describe how another permanent magnet can be used to identify all three blocks. (3 marks)",
        explanation: "AQA mark scheme: the block repelled (by one pole) is the permanent magnet; the block attracted (but never repelled) is the iron; the block not attracted at all is the aluminium. 60% of Foundation students scored zero, mostly by not testing all three or by trusting attraction.",
        applicable_misconceptions: ["attraction_taken_as_magnet_proof", "magnetic_materials_misidentified", "magnetic_material_treated_as_magnet"],
        claims: [
          { id: "a", text: "The block that can be REPELLED by the known magnet is the permanent magnet.", correct: true },
          { id: "b", text: "The block that is attracted but never repelled is the iron.", correct: true },
          { id: "c", text: "The block that is not attracted at all is the aluminium.", correct: true },
          { id: "d", text: "The block that attracts most strongly is the permanent magnet.", correct: false, misconception: "attraction_taken_as_magnet_proof" },
          { id: "e", text: "All three blocks will be attracted, because they are all metals.", correct: false, misconception: "magnetic_materials_misidentified" }
        ]
      },
      {
        id: "im_electromagnet_iron_pickup", qtype: "mcq_single", tier: "both",
        atom: "identify_magnet_iron_other", syllabus: "6.7.1.1.e",
        source: "authored", // gap pass; bridges to the electromagnetism batch (crane stem) and exercises the treated-as-magnet trap in its other home
        prompt: "An electromagnet on a crane picks up iron blocks. The iron blocks are NOT magnets. Why are they attracted to the electromagnet?",
        explanation: "The electromagnet's field induces magnetism in each iron block (opposite pole facing), so the blocks are attracted. They do not need to be magnets themselves; believing they are was the classic error on the 2018 crane 6-marker.",
        applicable_misconceptions: ["magnetic_material_treated_as_magnet"],
        distractors: [
          { id: "a", text: "The electromagnet induces magnetism in the iron blocks.", status: "correct" },
          { id: "b", text: "The iron blocks are permanent magnets, so they attract and repel the electromagnet.", status: "wrong", misconception: "magnetic_material_treated_as_magnet" },
          { id: "c", text: "The electricity in the electromagnet flows into the blocks.", status: "wrong" },
          { id: "d", text: "Gravity pulls the blocks towards the electromagnet.", status: "wrong" }
        ]
      }
    ]
  };

  window.TRILOGY_TOPICS["6.7"] = CONFIG;
})();
