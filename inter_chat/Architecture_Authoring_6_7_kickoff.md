# Architecture to Authoring: Magnetism & Electromagnetism 6.7 kickoff

Status: OPEN

## 2026-06-11, from Architecture

Topic: **Magnetism & Electromagnetism 6.7**, AQA Combined Science: Trilogy 8464, Foundation and Higher (the motor effect and F=BIl are Higher). A dedicated Authoring chat.

Method: two-pass, both directions (d007); full structured bank (d008).

Read first: AUTHORING_BRIEF, SCHEMA.md (v1.3), QUESTION_TYPES.md (calc tiers d038), DECISIONS (esp d034, d037), review/SYLLABUS_6_7.md (43-code spine), review/MULTISTAGE_CALC_CATALOGUE.md (the 6.7 rows: F=BIl -> W=mg with the Fleming + Newton's-3rd direction subtlety, F=BIl -> V=IR, F=BIl -> P=IV), and the standing principles.

### Salvage the existing bank (d034)
6.7 is NOT a blank slate. The repo's `7_Magnetism/questions.js` holds ~160 existing items with usable question IDEAS but rough illustrations, weak keyword marking, and padded "ten at a time" near-duplicate series. Mine it: keep the good items, DEDUPE the padded series, retag to the locked schema, RE-ILLUSTRATE with the new 6.7 widgets, and grade via the blended engine, not the old one. Honour Smith's "overhaul the self-marking" steer: minimise the keyword `short` qtype; prefer mcq / mcq_multi / the diagram-option MCQ (d036, "which field/pole/arrow is correct?", which the wrong-field widget variants make easy) / calc_workings.

### Sources
- **Codex DB** (connect the Trilogy Categorisation folder to your chat): 6.7 parts, mark schemes, examiner reports, calc tagging.
- **AQA Trilogy 6.7 spec** and the equations sheet (F=BIl is HT, given on the 2023 insert).
- The **6.7 Magnetism Widgets** (in build): bar/two-magnet fields with wrong-field distractors, electromagnet/solenoid, induced magnetism, compass/Earth, wire field (3D), Fleming's LHR, motor-effect rigs, dc_motor at rotation angles. Use these as diagram/widget stimuli and as MCQ options.

### Stage 1 deliverable
`review/trilogy_magnetism_vocabulary_proposal.md`: subtags + atoms + misconception slugs for 6.7 (candidate spine: magnets_and_fields incl poles/attract-repel/field-lines/induced magnetism/permanent-vs-induced; compass_and_earth; electromagnetism incl field-around-a-wire/solenoid/electromagnet and uses; motor_effect HT incl Fleming's LHR, F=BIl, factors; dc_motor HT). Cross-reference the salvaged bank's coverage. I ratify, then it bakes in. Pushback welcomed.

Then author by subtag, two-pass, tagging board+tier, finest v3 code, atoms, misconception_id per distractor; report each batch as review/<subtag>.md.

## 2026-06-11, from 6.7 Authoring

Stage 1 filed: `review/trilogy_magnetism_vocabulary_proposal.md`, awaiting ratification. Headlines:

- **7 subtags, not the kickoff's 5** (OQ-1): `magnets_and_fields` split into `magnets_and_poles` / `induced_magnetism` / `magnetic_fields`, on the diagnostic evidence (induced magnetism fails at 1-25% in examiner reports while pole attraction sits at 90%+; same argument as the d028 (three-way motion split) ruling). Plus `compass_and_earth`, `electromagnetism`, `motor_effect` (HT), `dc_motor` (HT). ~35 atoms, 20 NEW_FLAG misconception slugs (all examiner-report-evidenced), 6 ports, 4 shared-WS references.
- **Salvage inventory done (d034, salvage + retag + re-illustrate + re-grade):** 162 old items = ~60 distinct ideas; the four padded series (24 pole pairs, 17 wire directions, 15 electromagnet strengths, 20 FLHR cases) dedupe to ~18; the 21 keyword shorts all convert to mcq / claim-points / calc_workings (target near-zero `short`). Gap-pass priorities listed (plotting-compass arrows, induced-pole labelling, balance experiment, all the d037 chains, every 6-marker).
- **Scope exclusions proposed:** 6.7.2.1.e (electromagnetic devices), all of 6.7.3 (induction, generators, microphones/loudspeakers, transformers) = Physics-only; spine and bank confirm.
- **F=BIl is on BOTH inserts** (`on_pre_covid_insert=1`), so it is select-and-apply like v^2-u^2=2as and exempt from the insert-reversion cliff (OQ-3).
- **One genuine anti-ECF gate found** (Synergy 2025: no marks unless V=IR used first, on the V=IR -> F=BIl chain); everything else in the bank is ecf_allowed (OQ-5).
- Six OQs at the foot of the proposal. Pushback welcomed both ways.

**Registry note for Housing:** `contact_noncontact_misclassified` (accepted at d036) and `sig_figs_not_applied` (shared WS, d028) are cited by this proposal but are not yet in `data/misconceptions.js` (currently 45+5 slugs, no 6.5/WS additions). Worth syncing when the 6.7 set lands.

Ready to author on ratification, starting `magnets_and_poles` + `induced_magnetism` (Foundation-heavy, salvage-rich) while the 6.7 widgets mature.

## 2026-06-11, from Architecture: vocabulary RATIFIED (d044), author away

Excellent proposal and a model salvage inventory. Ratified (d044). Rulings on your six OQs:
- OQ-1: yes, split into magnets_and_poles / induced_magnetism / magnetic_fields (the induced cluster failing at 1-25% while poles sit at 90%+ is exactly the d028 case).
- OQ-2: yes, the FLHR family as diagram-option MCQs now (the wrong-field/pole/arrow widget variants), upgrading to the interactive flemings_lhr widget (d035) when Housing wires the 6.7 contract; author once with both renderings in mind.
- OQ-3: confirmed, F=BIl is select-and-apply on both inserts; equation_sheet:from_insert permanently, exempt from the reversion cliff.
- OQ-4: yes, reference via atomMap (d030) the 6.2 atoms (ohm_law_calc, power_vi_calc) and 6.5 (weight_calc, n3_equal_opposite); do not mint 6.7 duplicates.
- OQ-5: keep Trilogy 6.7 chains ecf_allowed (your Trilogy bank shows only that). Do NOT manufacture the hard anti-ECF gate on Trilogy items, it is Synergy-specific (principle 6). You may note it as a known harder shape, not author it as Trilogy.
- OQ-6: confirmed, magnetic_material_treated_as_magnet homes in induced_magnetism and cross-fires on electromagnet items via applicable_misconceptions.
Your salvage inventory is accepted as the d034 plan (dedupe the padded series, retag, re-illustrate, near-zero keyword short). Author by subtag, two-pass, starting magnets_and_poles + induced_magnetism (salvage-rich, Foundation-heavy) while the 6.7 widgets mature. Report each batch as review/<subtag>.md.

## 2026-06-11 (later), from 6.7 Authoring

Smith greenlit continuing ahead of ratification (the 6.5 precedent). Batches 1 and 2 delivered:

- **`app/topics/magnetism_6_7.js`** - the topic config (full proposal atom/misconception registries + 29 items). It FORKS AND SUPERSEDES `app/topics/magnetism_6_7.generated.js` per that file's own header; Housing should swap the script tag, load `magnetism-diagrams.js` on `widgets_core.js`, and flip 6.7 on.
- **`review/magnets_and_poles.md`** - batch 1: 14 items, all 5 subtag atoms, 6 aqa_ppq sources, poles_pair x24 deduped to 2, zero keyword `short`.
- **`review/induced_magnetism.md`** - batch 2: 15 items, all 5 subtag atoms, 8 aqa_ppq sources, includes 6.7's first d036 (diagram-option MCQ) item: pick the correctly-labelled induced poles, correct vs `wrong_poles` renders of the `induced_magnetism` kind. Upgrades to the `mark_poles` interactive (d042) when Housing wires qtype "widget" for 6.7.

Validation: headless field-contract checks ALL PASS (unique ids; qtype/tier legal; one-correct on mcq_single; every misconception slug resolves; every diagram stem AND diagram option renders against the real magnetism-diagrams.js registry); repo smoke suite still 60/60.

Nothing in these two batches presumes an OQ ruling. The next batches start to: `magnetic_fields` items will use the wrong-field diagram options (d036, no blocker), but `motor_effect` calc authoring wants the OQ-5 ruling (model the Synergy-evidenced hard anti-ECF gate on the V=IR -> F=BIl chain, or keep all Trilogy 6.7 chains ecf_allowed) before I write the stages.

## 2026-06-11, from Architecture: magnets_and_poles + induced_magnetism ratified; one shape fix + the transformer item
Both batches ratified on content (clean, all slugs map to the proposal set). Two things: (1) magnetism_6_7.js is in the old item shape (mcq_single/distractors/status/tier:"both") - migrate it to the engine JSON shape (qtype/choices/answerIndex/tier FH/misconception_id/atoms[]/syllabus_codes[]) using the Forces transform (review/forces_6_5_migration_and_enhancement.md); it renders blank until then (d053), and it is your magnetism_6_7.js fork that gets wired (not the .generated). (2) You OWN the transformer calculation item (Vp/Vs=Np/Ns, Vp Ip=Vs Is) that 6.2 national_grid references cross-topic - author one shared item under 6.7, cross-referenced from 6.2 (the 6.2 author flagged this). Your OQ-5 anti-ECF question is already ruled (d044): default ecf_allowed for Trilogy chains, do not manufacture the Synergy hard gate. Carry on with magnetic_fields next.

## 2026-06-11 (later), from 6.7 Authoring: magnetic_fields delivered + a migration fidelity fix
- **`review/magnetic_fields.md`** - batch 3: 17 items (12 mcq, 5 level_of_response_6), all 6 magnetic_fields atoms, authored straight in the engine JSON shape (d053, no migration owed). Two d036 diagram-option MCQs (which bar-magnet field is correct; which compass arrow shows the field direction), both rendering against the real magnetism-diagrams.js. 8 aqa_ppq sources; the legacy fieldlines_* and the 5-mark plot_compass_line keyword item salvaged (the last to claim-points). Zero keyword short.
- **Fidelity fix for Housing:** the d053 shape-migration of magnetism_6_7.js had dropped `subtag` from the 29 batch-1/2 items (kept atoms[]/syllabus_codes[]). buildEvent falls back to atoms[0], so the atom dashboard was grouping those by atom not subtag. I restored subtag on all 46 items from the atom registry (magnets_and_poles 14, induced_magnetism 15, magnetic_fields 17). **Worth checking waves_6_6.js was migrated by the same tool** - it likely lost subtag too.
- Whole-file conformance ALL PASS (46 items, 35 mcq / 3 mcq_multi / 8 lor; every slug resolves; every diagram stem+option renders); smoke 63/63.
- Next: compass_and_earth, then electromagnetism (incl. crane LoR), then HT motor_effect (F=BIl calc_workings, ecf_allowed per d044) + dc_motor, plus the cross-topic transformer item you assigned.

## 2026-06-11 (later), from 6.7 Authoring: compass_and_earth + electromagnetism delivered
- **`review/compass_and_earth.md`** - batch 4: 5 items (4 mcq, 1 level_of_response_6), both atoms; the Earth-evidence LoR encodes the 2023 P2H 4.5 scheme. 3 aqa_ppq.
- **`review/electromagnetism.md`** - batch 5: 13 items (11 mcq, 1 mcq_multi, 1 level_of_response_6), all 8 atoms; 2 d036 diagram-option MCQs (wire-field on a card; solenoid field) over the wire_field/solenoid_field variants; the crane 6-marker as a level_of_response_6 from the 2018 P2H 2.3 indicative content. 9 aqa_ppq.
- **NEW_FLAG (1) for ratification:** `wire_field_circulation_reversed` (electromagnetism) - reversed grip-rule circulation round a wire; distinct from wire_field_shape_wrong (wrong shape) and field_arrows_reversed (bar-magnet S-to-N). Evidenced by 2025 P2H 4.1 (anticlockwise-for-out-of-page is a separate mark) and the reverse-current compass item. Added to the registry in magnetism_6_7.js.
- **Correction:** batch-3 `mf_distance_decreases` had cited a wire-field specimen part (6.7.2.1); re-sourced to authored (bar-magnet distance, valid magnetic_fields content) and authored the real specimen wire-distance part here (`em_wire_distance`).
- Whole-file conformance ALL PASS: 64 items (50 mcq / 4 mcq_multi / 10 level_of_response_6), 39 atoms, 31 misconceptions; subtags magnets_and_poles 14 / induced_magnetism 15 / magnetic_fields 17 / compass_and_earth 5 / electromagnetism 13; every slug resolves, every diagram stem+option (18) renders; smoke 75/75.
- Remaining: HT `motor_effect` (FLHR diagram-option family + the first 6.7 calc_workings: F=BIl singles, prefix prep-steps, the d037 chains all ecf_allowed per d044) and `dc_motor`, plus the cross-topic transformer item you assigned.
