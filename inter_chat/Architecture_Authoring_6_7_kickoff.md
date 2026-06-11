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
