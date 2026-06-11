# Trilogy Magnetism & Electromagnetism 6.7 - vocabulary proposal (Stage 1)

Status: **PROPOSED, awaiting Architecture ratification.**

From: 6.7 Magnetism Authoring chat. To: Architecture. Date: 2026-06-11.

## State absorbed before drafting (standing principle 3)

Read: `inter_chat/Architecture_Authoring_6_7_kickoff.md`, `AUTHORING_BRIEF.md`, `SCHEMA.md` (v1.3 incl. the d035 widget qtype and d036 diagram-option MCQ), `QUESTION_TYPES.md` (incl. the d038 calc tiers), `DECISIONS.md` (esp. d034 salvage-and-retag, d037 multistage catalogue), `review/SYLLABUS_6_7.md` (43-code spine), `review/MULTISTAGE_CALC_CATALOGUE.md` (the four 6.7 rows), `inter_chat/Architecture_Widgets_6_7_dispatch.md` (the 11 widget kinds in build), the standing principles, the ratified 6.2 and 6.5 vocabulary proposals (format models), and the Codex DB README. Mined the live bank (`aqa_extraction_plus_calc.db`): **98 distinct parts tagged under 6.7** (112 tag rows) across Trilogy 2018-2025 plus specimens and the Synergy sister papers, **77 examiner-report entries** aligned to those parts, the full six-layer tagging on the **8 parts using `FORMULA.MAG_FORCE`**, and per-part mark schemes. Mined `7_Magnetism/questions.js` (162 items) for salvage per d034 (harvest, dedupe, retag, re-illustrate, re-grade); inventory in section 5.

Findings that shape the proposal, not just name things:

1. **6.7 is recall-light on calculation but brutal on conceptual misconceptions.** Only one Trilogy equation (F=BIl, HT) versus 6.2's six and 6.5's nine. The marks are lost on concepts the examiner reports document at startling failure rates: only 2-11% can identify which metals are magnetic; only 1-11% can explain induced magnetism (the "vast majority" think a paperclip attracted to a N pole will be repelled by a S pole); 75% score zero on the motor-rotation explanation; under 10% can label Fleming's fingers. This topic is where the misconception registry earns its keep (principle 1).

2. **F=BIl is on BOTH inserts.** `formula_catalogue`: `FORMULA.MAG_FORCE` has `on_2023_insert=1` AND `on_pre_covid_insert=1`. Like `v^2-u^2=2as`, it is a select-and-apply equation, always given. The kickoff says "given on the 2023 insert"; the stronger fact is it survives the insert reversion cliff that 6.2/6.5 flagged (OQ-3). Every F=BIl item tags `equation_sheet: from_insert`.

3. **One genuine anti-ECF gate, in exactly the d037 chain shape.** Synergy 2025 9.4 (V=IR -> F=BIl, 6mk): "If V=IR was not used to calculate current, marks could not be awarded for this subsequent calculation." That is the once-per-Higher-paper hard gate the brief predicts, and it sits on the catalogue's "Force on wire given V and R" row. Model it there; elsewhere the bank shows ordinary `ecf_allowed` (2024 P2H 4.2 allows full follow-through on an unconverted length).

4. **The prefix mark is where the F=BIl calc is actually lost.** All 8 tagged MAG_FORCE parts but one carry a `prefix_strip` action (mm/cm on l, mT on B, mN on F, plus standard form in Synergy 2025); examiner reports: "few converted the flux density from mT to T", "25% either did not know the unit or missed the conversion". `prefix_not_converted` (shared WS) and the `unit` mark (tesla recall: "very few students were able to recall the unit") are the diagnostic core.

---

## Scope exclusions (proposed; spine- and bank-confirmed) - do NOT author for Trilogy

| Spec area | Code | Why excluded | Evidence |
|---|---|---|---|
| Interpreting diagrams of electromagnetic devices (bell, relay, etc.) | 6.7.2.1.e | Spec "(Physics only)" | Marked Physics-only in `syllabus_sections`; 0 Trilogy tag rows |
| Induced potential, generator effect, generators/alternators | 6.7.3.x | Whole section Physics-only; absent from the 43-code Trilogy spine | `SYLLABUS_6_7.md` ends at 6.7.2.3 |
| Microphones and loudspeakers | 6.7.3.x | Physics-only | absent from spine |
| Transformers and Vp Ip = Vs Is | 6.7.3 | Physics-only (`FORMULA.TRANSFORMER` spec_ref 6.7.3, HT, Triple). NB the Trilogy National Grid transformer story is already homed in 6.2 (d020) | absent from spine |

So Trilogy 6.7 = 6.7.1 (magnetism) + 6.7.2 (motor effect), with 6.7.2.2 and 6.7.2.3 HT-only. Nothing labelled "electromagnetic induction" is ours.

**Board note:** the Synergy (8465) parts in the DB (the W=mg, V=IR, P=IV chains onto F=BIl) are used as evidence of chain shape and difficulty only. Items authored here carry `board: aqa_trilogy_8464`; Synergy stimuli are adapted, never silently ported (principle 6).

---

## 1. Sub-topic (subtag) groups for 6.7

The kickoff's candidate spine has 5 groups, with `magnets_and_fields` carrying poles + attract/repel + field lines + induced magnetism. I propose splitting that group three ways, for 7 subtags total (pushback exercised per principle 5; flagged OQ-1):

- **Induced magnetism is its own independently-failing skill.** The induced cluster (induced = temporary, induced polarity, always-attracts, which materials magnetise) fails at 1-25% in the reports while the same cohorts answer pole attraction at 90%+ (2023 P2F 3.3). Folding them would bury the single worst diagnostic signal in the topic, exactly the argument that won the three-way motion split in 6.5 (d028).
- **Field-pattern skills (drawing, arrows, spacing, plotting) are a drawing/diagram family** with their own misconception set (arrows reversed, radial arrows, crossing lines) and their own widget support (the wrong-field distractor variants). They behave like 6.5's `motion_graphs`: a representation skill, not a facts skill.

| subtag | v3 codes (primary) | What it covers | Bank weight (tag rows) |
|---|---|---|---|
| `magnets_and_poles` | 6.7.1.1.a-d, 6.7.1.1.f.i | Poles as strongest points; like/unlike poles repel/attract; force between magnets; non-contact force; testing whether a bar is a permanent magnet | 19 |
| `induced_magnetism` | 6.7.1.1.e, 6.7.1.1.f.ii, 6.7.1.2.b | Permanent vs induced (temporary) magnets; induced polarity; magnet-to-magnetic-material force always attractive; which materials are magnetic (iron, steel, nickel, cobalt) | 3 tag rows, but the heaviest misconception cluster in the topic |
| `magnetic_fields` | 6.7.1.2.a, c, d, f.i, f.ii | Field definition (region where a force acts); field-line drawing rules; direction convention (force on a free N pole, N to S); strength from line spacing and distance; plotting with a compass | 28 |
| `compass_and_earth` | 6.7.1.2.e, 6.7.1.2.f.iii | Compass contains a bar magnet; points north; behaviour as evidence the Earth's core is magnetic | 3 (thin but regularly examined inside field questions) |
| `electromagnetism` | 6.7.2.1.a-d | Field around a straight wire (concentric circles, right-hand grip, weakens with distance); solenoid field (strong/uniform inside, bar-magnet-like outside); strengthening (turns, current, iron core); electromagnet definition and uses (crane, scrap separation, on/off advantage) | 21 |
| `motor_effect` **(HT)** | 6.7.2.2.a-d | Magnet and current-carrying conductor exert equal/opposite forces; Fleming's left-hand rule (labels and application); F=BIl; factors affecting the force; right-angle condition; reversing the force; the balance experiment | 33 |
| `dc_motor` **(HT)** | 6.7.2.3.a-c | Coil rotation (opposite currents -> opposite forces); split-ring commutator; changing rotation speed | 5 |

`dc_motor` stays separate despite thin tagging: the rotation explanation is the topic's hardest item (75% score zero in 2019; "many misconceptions communicated" in 2025) with a misconception set disjoint from single-wire motor effect.

Foundation/Higher: `magnets_and_poles` through `electromagnetism` are FH; `motor_effect` and `dc_motor` are H only (tier on the item, d005).

---

## 2. Atom groups (the units the dashboard tracks)

Candidate `atom_id`s by subtag, at the grain where one wrong answer is diagnostic (d004). Tier-shared; HT marked.

**magnets_and_poles**
- `poles_strongest_points` - the poles are where the magnetic forces are strongest; locate them on a diagram
- `like_unlike_poles` - like repel, unlike attract; conclude facing poles from observed attraction/repulsion
- `attract_repel_demo` - describe demonstrating both attraction and repulsion with two bar magnets
- `magnetic_force_noncontact` - pole-pole attraction/repulsion is a non-contact force
- `test_permanent_magnet` - repulsion is the only proof of a permanent magnet; attraction proves nothing

**induced_magnetism**
- `permanent_vs_induced` - permanent produces its own field; induced magnetism is caused by a field and is temporary
- `induced_polarity` - the near end of the induced magnet gains the opposite pole (label the poles on the nail/paperclip chain)
- `induced_always_attracts` - magnet-to-magnetic-material force is always attractive (incl. the paperclip-at-the-south-pole reasoning)
- `magnetic_materials_recall` - iron, steel, nickel, cobalt are magnetic; aluminium, copper, etc. are not
- `identify_magnet_iron_other` - method to distinguish a permanent magnet, a magnetic material, and a non-magnetic material

**magnetic_fields**
- `field_definition` - region around a magnet where a force acts on another magnet or magnetic material
- `field_line_drawing` - bar-magnet pattern: lines pole-to-pole, arrows N to S outside, never crossing or touching, denser at poles
- `field_direction_convention` - field direction at a point = direction of force on a free N pole; draw the arrow at a marked point
- `field_strength_spacing` - closer lines = stronger field; read relative strength off a diagram
- `field_strength_distance` - field/force weakens with distance from the magnet
- `plot_field_with_compass` - the plotting-compass method for mapping a field line

**compass_and_earth**
- `compass_is_bar_magnet` - compass needle is a small bar magnet, free to rotate, made of a magnetic/steel material
- `earth_field_evidence` - compass aligns with Earth's field wherever you are, so the core must be magnetic

**electromagnetism**
- `wire_field_pattern` - concentric circles centred on the wire, in a plane perpendicular to it; draw on a card
- `wire_field_direction` - right-hand grip / circulation sense for current into and out of the page; reverses when current reverses
- `wire_field_distance` - field weakens with distance from the wire (circles further apart)
- `solenoid_field_pattern` - strong and uniform inside; bar-magnet-like outside; identify the poles
- `solenoid_strengthening` - more turns, more current, iron core
- `electromagnet_definition` - solenoid with an iron core, magnetic only while current flows
- `electromagnet_applications` - crane/scrap-separation reasoning; the switch-off advantage (the 6-marker)
- `magnetic_effect_demo` - demonstrate that a current produces a field (deflecting plotting compasses)

**motor_effect (HT)**
- `motor_effect_concept` - magnet's field and the wire's field interact; magnet and conductor exert equal and opposite forces
- `flhr_labels` - thuMb = Motion/force, First finger = Field (N to S), seCond finger = Current
- `flhr_apply` - given field and current directions (incl. into/out-of-page), find the force direction
- `bil_calc` - F=BIl, any subject (find F, B, I or l), with the prefix handling the bank marks
- `flux_density_unit` - tesla; B as the quantity the force-per-unit-current-per-unit-length measures
- `motor_force_factors` - larger B, I or l increases the force
- `force_direction_reversal` - reverse the current or reverse the field; a magnitude change does NOT reverse it
- `right_angle_condition` - force is maximal at right angles to the field, zero when parallel
- `balance_experiment_reasoning` - balance reading change -> Newton's-3rd pair -> force on the wire; convert mass difference to force

**dc_motor (HT)**
- `motor_rotation_explain` - current in opposite directions on the two sides -> forces in opposite directions -> rotation
- `commutator_function` - split ring swaps the connection each half turn so the force on each side keeps the same sense
- `motor_speed_changes` - increase current / field strength / turns to increase the rate of rotation, via a larger force

(~35 atoms across 7 subtags; smaller than 6.5's ~57, as the topic warrants.)

**Cross-topic references (d030 pattern, OQ-4):** the F=BIl chains invoke `W=mg` (weight atom, Energy/Forces shared registry), `V=IR`, `P=IV` (6.2 atoms `resistance_ohm`/`power_electrical` families) via `atomMap`, not 6.7-local duplicates. `balance_experiment_reasoning` references the 6.5 `n3_equal_opposite` atom the same way. `magnetic_force_noncontact` references the registered `contact_noncontact_misclassified` slug rather than minting a twin.

---

## 3. Misconception slugs

ECM schema (`slug / topic / label / description`); `topic` = subtag. **NEW_FLAG** = surfaced from the AQA 6.7 bank with examiner-report evidence. **[port]** = existing registered slug, valid here.

### NEW_FLAG - surfaced from the AQA Trilogy 6.7 bank

| slug | subtag | trap | evidence (examiner reports) |
|---|---|---|---|
| `pole_names_confused` | magnets_and_poles | names poles positive/negative, east/west, or red/blue instead of north/south (or swaps N and S) | "frequently referred to 'positive' and 'negative'"; "common answers including east and west poles, or positive and negative"; 2024: 70% knew N/S "however, most named them the wrong way round" |
| `attraction_taken_as_magnet_proof` | magnets_and_poles | concludes a bar is a permanent magnet because it attracts; misses that only repulsion is conclusive | "most suggested bringing both sides of the magnet close... but then incorrectly stated that any attraction proves it is a magnet" (2023 P2H 4.4, 20% scored 2) |
| `induced_magnet_expected_to_repel` | induced_magnetism | thinks a magnetic material attracted to one pole will be repelled by the other | "The vast majority... thought that the paperclip would be repelled from the south pole" (2020, only 16-25% correct) |
| `magnetic_materials_misidentified` | induced_magnetism | picks aluminium/copper/magnesium as magnetic, or assumes all metals are magnetic | "Only 2% correctly identified that iron and steel were magnetic"; "Aluminium was the most popular answer" (2022); "Lots of students thought that all the metals were magnetic" |
| `magnetic_material_treated_as_magnet` | induced_magnetism | treats iron blocks/paperclips as magnets in their own right (e.g. expects repulsion from an electromagnet, or "the blocks attract and repel") | "Many believed that the magnetic blocks were themselves magnets and talked about attraction and repulsion" (2018 crane 6-marker, 2% level 3) |
| `field_arrows_reversed` | magnetic_fields | draws/picks field arrows running S to N outside the magnet | "The most common incorrect response was where the direction of the magnetic field lines ran from south to north" (2018, both tiers) |
| `field_arrows_radial` | magnetic_fields | draws all arrows pointing straight away from the magnet instead of along the field lines | "The most common answer by far was to have all of the arrows pointing away from the magnet" (2025 P2F 4.7, <10% full marks) |
| `field_strength_evidence_missed` | magnetic_fields | cannot read relative field strength from line spacing / cites no feature of the diagram | "12% were able to correctly describe how the diagram showed that the field was not the same at all places" (2021 P2H 4.2) |
| `force_increases_with_distance` | magnetic_fields | says the magnetic force gets bigger as separation increases | "Many incorrectly stated that the force would increase" (2023 P2F 3.8, 40% correct) |
| `earth_field_link_missed` | compass_and_earth | says "the compass points north" without linking needle alignment to the Earth's magnetic field/core | "mostly contained simple statements like 'it always points north'. Only a small percentage explained that the magnet aligns itself with the Earth's magnetic field" (2023 P2H 4.5) |
| `wire_field_shape_wrong` | electromagnetism | draws the wire's field as straight lines/a bar-magnet pattern, or rings not centred on the wire | "Surprisingly few students were able to draw the magnetic field pattern around a current-carrying wire... only about 40% scoring any marks" (2025 P2H 4.1) |
| `coil_turns_stated_ambiguously` | electromagnetism | writes "more coils" instead of "more turns on the coil" (not creditworthy) | "'increasing the number of coils' is ambiguous and would not gain the mark" (2024 P2H 4.4) |
| `electromagnet_mechanism_missing` | electromagnetism | crane/separator answers say "switch it on and off" with no account of current -> field -> induced magnetism in the load | "Many simply stated that the electromagnet could be switched on, moved... and switched off. There were few descriptions of how the electromagnet worked" (2018, 2% level 3) |
| `stronger_magnet_for_electromagnet` | electromagnetism | answers "use a stronger/bigger magnet" for how to strengthen an electromagnet (or "bigger" for "stronger" on motors) | "Most students who did not score any marks referred to a stronger magnet" (2022 P2F 4.5); "Many students mentioned using a bigger magnet instead of stronger magnet" (2022 P2H 4.3) |
| `magnitude_change_given_for_reversal` | motor_effect | offers "increase the current/field" when asked how to REVERSE the force direction | "A number incorrectly stated that increasing, decreasing or changing the field strength or current would have the effect of changing the direction of the force" (2019 P2H 4.2) |
| `flhr_finger_assignment_confused` | motor_effect | cannot assign force/field/current to thumb/first/second finger, or states "use the left-hand rule" without the assignments | "10% were able to write the correct word in the correct place for each finger" (2021 P2H 4.7); "half... failed to gain any further credit as they were unable to describe what each finger represents" (2022) |
| `flux_density_unit_unknown` | motor_effect | cannot give tesla (derives N/(A m) or guesses) | "Very few students were able to recall the unit of magnetic flux density" (2025); "did not recall the unit" (2021) |
| `balance_increase_called_weight_gain` | motor_effect | explains the balance-reading increase as the magnet getting heavier / more gravity / pressure, missing the Newton's-3rd downward partner force | "Many students simply referred to increasing weight or pressure... Some suggested that the force of gravity was increased" (Synergy 2025 9.1, ~10% creditworthy; Trilogy 2020 7.1, 10% scored) |
| `current_attracted_to_pole` | dc_motor | explains motor rotation as current/wire being attracted or repelled by the poles, or charges attracting | "Misconceptions included: current is attracted or repelled by the north or south pole" (2025 P2H 4.3); "mixing magnetism and charges attracting or repelling" (2019 P2H 4.4, 75% scored 0) |
| `motor_opposite_currents_missed` | dc_motor | explains one side of the coil only; never states the currents (hence forces) on the two sides are opposite | "only discussing current and force on one side of the coil" (2019 P2H 4.4) |

### Ported from the registered 6.2/6.5/cross-calc set (valid as-is for 6.7)

| slug | subtag use | note |
|---|---|---|
| `contact_noncontact_misclassified` | magnets_and_poles | registered at d036; magnetic pole forces are the canonical non-contact example [port] |
| `confused_v_and_i` | motor_effect (chains) | Synergy 2023: "A common error... was to use the potential difference value of 0.14 V as the current" [port from 6.2] |
| `wrong_formula_rearrangement` | motor_effect | rearranging F=BIl for B, I or l [port] |
| `picked_given_value` | motor_effect | [port] |
| `power_of_ten_evaluation_error` | motor_effect | standard-form inputs (Synergy 2025: "struggled with using values in standard form") [port] |
| `rounding_mistake` | motor_effect | [port] |

### Cross-topic / working-scientifically (shared taxonomy, referenced not duplicated)

| slug | 6.7 instances |
|---|---|
| `prefix_not_converted` | **The dominant 6.7 calc error**: mm->m and cm->m on l, mT->T on B, mN->N on F, g->kg on the balance mass. 7 of the 8 tagged MAG_FORCE parts carry a `prefix_strip` action; "few converted the flux density from mT to T" |
| `proportionality_stated_as_increases` | F proportional to I (the specimen sketch-graph item; "force increases with current" instead of direct proportion / straight line through origin) |
| `repeatability_reproducibility_confused` | the 2025 P2F magnet-distance method items (mean, random errors) |
| `sig_figs_not_applied` | standard calc hygiene on F=BIl evaluations |

One placement question: `magnetic_material_treated_as_magnet` fires in both `induced_magnetism` and `electromagnetism` (crane) items; proposed home is induced_magnetism with `applicable_misconceptions` carrying it on electromagnet items (OQ-6).

---

## 4. Calculation vocabulary mapping (Codex six-layer alignment)

| Codex code | Equation | subtag | 2023 insert? | Pre-Covid insert? | Recall status |
|---|---|---|---|---|---|
| `FORMULA.MAG_FORCE` | F = BIl (HT) | motor_effect | yes | **yes** | **always given (select-and-apply)**, survives insert reversion |
| `FORMULA.WEIGHT` | W = mg | (cross: 6.5/6.1) | yes | no | referenced atom; in the wire-on-balance chain |
| `FORMULA.OHM` / `FORMULA.POWER_IV` | V = IR / P = IV | (cross: 6.2) | yes | no | referenced atoms; feed I into F=BIl |
| `INTERPRET.GRADIENT_*` + `METHOD.GRADIENT_OF_STRAIGHT_LINE` | gradient of F-I graph = Bl | motor_effect | - | - | technique (2020 P2H 7.3) |

Mark shape the bank actually uses on F=BIl (from the 8 tagged parts): `substitution`, `rearrangement`, `evaluation`, `unit` as the 4-line core, with `prefix_conv` as a leading fifth mark when l or B arrives in mm/cm/mT (2021 P2H 4.6 and 2019 P2H 4.3 give it its own mark), and `non_final_evaluation` only in the graph-gradient chain. ECF: `ecf_allowed` on unconverted values (2024 P2H 4.2, explicit "allow... using an incorrectly converted value of l"); the one hard anti-ECF gate is the Synergy V=IR->F=BIl chain (finding 3). Do not manufacture others.

**The three d038 calc tiers in 6.7:**
1. *Single-step*: F=BIl plug-in (find F), or find B/I/l with one rearrangement; the bank's standard 4-5 marker. Salvageable from the old bank's `bil_calc_*` series.
2. *Intermediate / prep-step*: the prefix conversion as a marked leading step (the bank gives `prefix_conv` its own mark); the balance-reading *difference* (252.3 g -> 254.8 g -> delta-m -> force, 2020 P2H 7.2); the F-I graph gradient read-off (2020 P2H 7.3). Authored per d038: leading stage or number-source-tagged known.
3. *Multi-stage chains* (the d037 catalogue rows, all four evidenced in the bank or specimens):
   - **F=BIl <-> W=mg** (L5): both specimen P2H 6.3 items (resultant force zero on the rod; balance reading in kg). The Fleming + Newton's-3rd direction subtlety (does the wire's weight add or subtract) is the harder variant; the catalogue flags it.
   - **V=IR -> F=BIl** (L3): Synergy 2020/2023/2025, with the genuine anti-ECF gate.
   - **Q=It -> F=BIl** (L1): not yet seen in the bank; author thinly.
   - **F=BIl -> P=IV** (L3): old bank's `piv_bil_combo_*` already has the P=IV -> I -> F=BIl shape.
   All as `calc_workings` with `stages` (d029), `gate:{kind:"from_previous_part"}`, ECF allowed except where finding 3 applies.

---

## 5. Salvage inventory (d034): the 162-item `7_Magnetism/questions.js` bank

Shape: 120 mcq / 21 short / 21 numeric; no board/tier/code tags; no diagrams (3D items are text-only); `short` is keyword-marked. Roughly **60 distinct question ideas** under the padding. Verdicts:

| old cluster | n | verdict | maps to |
|---|---|---|---|
| `poles_pair_1..24` | 24 | **dedupe to 3** (N-N, S-S, N-S), retag mcq d1 | `like_unlike_poles` |
| `wire_dir_1..15`, `wire_dot`, `wire_cross` | 17 | **dedupe to ~4**, rebuild as d036 diagram-option MCQs over the `wire_field` widget variants (currently text-only, hopeless for 3D) | `wire_field_direction` |
| `solenoid_strength_1..15` | 15 | **dedupe to ~3** with genuinely distinct distractor sets | `solenoid_strengthening` |
| `flhr_case_1..20` | 20 | **keep as a drill family but dedupe to the ~8 distinct 3D orientation cases**, re-illustrated with the `flemings_lhr` / `motor_effect_setup` widgets; later the interactive widget qtype (d035) | `flhr_apply` |
| `bil_calc_1..10`, `bil_find_B`, `bil_find_I` | 12 | **keep ~5** retagged `calc_workings` (find F x2 with prefix variants, find B, find I, one clean d1); fix the float-dirty expected values (0.10500000000000001 etc.) | `bil_calc` |
| `piv_bil_combo_1..3` | 3 | **keep 1-2** as multi-stage `calc_workings` with stages (P=IV -> I -> F=BIl) | catalogue row 4 |
| `ppq_*` set | 32 | **mostly keep**: these mirror real bank parts (balance reading, mT/mm conversions, B-from-balance-zero = specimen 6.3, ring magnets, three-blocks, reverse-force-two-ways). Retag with `source: aqa_ppq:<ref>` where they match a bank part; re-illustrate | across all subtags |
| `fields_rule_*` cluster | 7 | **keep**, convert the 1 short to mcq_multi; pair with wrong-field widget options | `field_line_drawing` |
| units mcqs (`u_flux`, `u_current`, `u_force`, `u_length`) | 4 | keep `u_flux` (tesla recall is evidenced weak); fold the other three into calc items' unit marks | `flux_density_unit` |
| remaining one-off mcqs (induced, compass, motor, fields) | ~20 | **keep**, retag, sharpen distractors to carry `misconception_id` | various |
| the 21 `short` items | 21 | **convert per the d034 self-marking steer**: 6-markers (`motor_rotate`, `ppq_electromagnet_crane`) -> `level_of_response_6` claim-points; method items (`plot_compass_line`, `ppq_test_perm_magnet`, `ppq_identify_three_blocks`) -> claim-points or mcq_multi; definitional shorts -> mcq. Target: zero or near-zero keyword `short` in the new bank | various |

Net effect: ~160 items -> ~60 salvaged ideas + the spec-first and gap-pass items to be authored. Old `tags` map cleanly onto the proposed subtags (poles -> magnets_and_poles; fields/plotting -> magnetic_fields; induced -> induced_magnetism; compass -> compass_and_earth; wirefield/solenoid -> electromagnetism; flhr/bil/motoreffect -> motor_effect; motors -> dc_motor).

**Coverage cross-check (salvage vs spine):** the old bank is strong on like/unlike poles, wire-field direction, electromagnet strengthening, FLHR cases and F=BIl, and adequate on field rules and induced. It has **nothing or nearly nothing** on: testing a permanent magnet via repulsion (6.7.1.1, the 2023 item), labelling induced poles on a diagram, the plotting-compass arrow-drawing items (2022/2024/2025 staples), field-strength-from-spacing evidence, the Earth-core explanation as claim-points, solenoid field *pattern* drawing/recognition, the right-angle (parallel = zero force) condition, the balance experiment reasoning, the F-I proportionality graph, all the multi-stage chains, and every level-of-response 6-marker. Those are the gap-pass priorities.

---

## 6. Question-type constraints and widget cross-references

No NEW_QTYPE needed. 6.7 authors against: `mcq`/`mcq_multi` (heavily diagram-optioned per d036, using the wrong-field/wrong-pole/wrong-arrow widget variants the 6.7 Widgets chat is building), `calc_workings` (single + stages), `level_of_response_6` claim-points (crane, motor rotation), `qtype:"widget"` (d035) once the 6.7 interactive contracts land (FLHR direction-pick, markable solenoid poles, compass-arrow placement). The drawing-flavoured spec points (draw the bar-magnet/solenoid/wire field, draw compass arrows, label induced poles) take the interim diagram-option MCQ form now and upgrade to interactive widgets when Housing wires the 6.7 contracts; this is the d023/d031 staging pattern, and those widgets exist precisely to replace the old bank's keyword shorts (d034).

---

## 7. Open questions for Architecture / Smith

- **OQ-1:** 7 subtags vs the kickoff's 5: confirm splitting `magnets_and_fields` into `magnets_and_poles` / `induced_magnetism` / `magnetic_fields` on the diagnostic evidence (induced failing at 1-25% while pole attraction sits at 90%+).
- **OQ-2:** The FLHR orientation drill family: ~8 deduped 3D cases as diagram-option MCQs now, upgrading to the interactive `flemings_lhr` widget (d035) when its Housing contract lands. Confirm the interim-then-upgrade path so items are authored once with both renderings in mind.
- **OQ-3:** F=BIl is on BOTH inserts (select-and-apply). Confirm `equation_sheet: from_insert` permanently, exempt from the insert-reversion difficulty cliff flagged for 6.2/6.5.
- **OQ-4:** Cross-topic atoms in the chains: W=mg, V=IR, P=IV (and N3 for the balance items) referenced via `atomMap` per d030. Confirm the 6.2 atom ids to reference (`resistance_ohm`/`power_electrical` families) since 6.2 authoring owns them.
- **OQ-5:** The Synergy-evidenced anti-ECF gate (V=IR -> F=BIl): model the hard gate on that one chain for Trilogy items, or keep all Trilogy 6.7 chains `ecf_allowed`? The Trilogy bank itself shows only `ecf_allowed`.
- **OQ-6:** `magnetic_material_treated_as_magnet` homes in `induced_magnetism` but fires on electromagnet items; confirm slug `topic` = home subtag with cross-firing via `applicable_misconceptions`.

On ratification I author by subtag, two-pass (spec-first then bank-mine then gap), board+tier+finest-code+atoms+misconception_id per distractor on every item, reporting each batch as `review/<subtag>.md`, starting with `magnets_and_poles` + `induced_magnetism` (Foundation-heavy, salvage-rich) while the 6.7 widgets mature for the field-drawing and HT sets.
