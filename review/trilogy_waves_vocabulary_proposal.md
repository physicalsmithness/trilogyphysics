# Trilogy Waves 6.6 — vocabulary proposal (Stage 1)

Status: **RATIFIED by Architecture, 2026-06-11 (d043). Rulings on OQ-A..G in inter_chat/Architecture_Authoring_6_6_kickoff.md.**

From: 6.6 Waves Authoring chat. To: Architecture. Date: 2026-06-11.

## State absorbed before drafting (standing principle 3)

Read: `inter_chat/Architecture_Authoring_6_6_kickoff.md`, `AUTHORING_BRIEF.md`, `SCHEMA.md` (v1.3: `widget` qtype d035, diagram/widget MCQ options d036, calc `stages` d029), `QUESTION_TYPES.md` (incl. the d038 calc complexity tiers), `DECISIONS.md` (d004–d041), `review/SYLLABUS_6_6.md` (64-code spine), `review/MULTISTAGE_CALC_CATALOGUE.md` (the three 6.6 rows), the ratified 6.2 and 6.5 vocabulary proposals, the standing principles, and the two Widgets 6.6 threads (`Architecture_Widgets_6_6_dispatch.md` delivery note; `Widgets_Housing_interactive_66.md` grading contract with its per-kind errorCodes). Mined the live bank (`aqa_extraction_plus_calc.db`): **191 Trilogy syllabus-tag rows under 6.6**, **136 examiner-report entries** aligned to 6.6 parts, the six-layer calc tagging (formula uses, mark categories, unit handling, number sources, gate records), and the per-code `syllabus_sections` descriptions.

Four things from that reading shaped the proposal up front:

1. **6.6 calc is single-formula plus savage unit handling, not chained.** The tagged Trilogy slice: 21 `single_formula` parts vs 2 `multi_stage`; mark categories evaluation 28 / substitution 25 / rearrangement 12 / non_final_evaluation 8 / equation_quoted 6 / prefix_conv 5 / unit 3; one `ecf_allowed` gate. The opposite balance to Forces (43 non_final, 35 gates). But the unit-handling rows are the densest of any topic so far: kHz→Hz, GHz→Hz, ms→s, min→s, **nm applied on output**, standard form on input AND output. Waves is the prefix-and-standard-form heartland (radio at GHz, light at nm and 3×10⁸). Consequence: the d037 catalogue chains (v=fλ → v=d/t; f=1/T → v=fλ → v=d/t; echo d=2x) are mostly **unasked in the tagged papers** — they are gap-pass authoring targets per d007 (two-pass), not bank-mining targets, and Smith rates them L4–L5.

2. **Widgets are the primary question surface here (d031), and the errorCode unification (d035) does real work.** Many 6.6 items ARE the widget: mark a wavelength (the bank's 2019 "mean amplitude of the duck" fiasco is exactly the `amplitude_peak_to_trough` errorCode), drag the refracted ray (the 2025 "rays drawn in many different directions"), select the EM region. §3 registers the Widgets-built errorCodes as misconception slugs with the bank evidence each one matches.

3. **Sound-as-a-topic and ultrasound are Physics-only; sound-as-a-context is everywhere.** The v3 spine jumps from 6.6.1.2 straight to 6.6.2: there is no Trilogy 6.6.1.3 (sound in solids, the ear) or 6.6.1.4 (ultrasound, echo sounding, seismic). But sound-wave contexts dominate the Trilogy 6.6.1 bank (longitudinal labelling, speed-of-sound methods 6.6.1.2.g.ii, the speed-vs-temperature graph items). See Scope exclusions and OQ-B/OQ-C.

4. **Equation status: v=fλ is the recall equation, T=1/f is always given.** `FORMULA.WAVE_SPEED` is on the 2023 insert but NOT the pre-Covid insert (Appendix B: recall); `FORMULA.PERIOD` is on BOTH (always given, select-and-apply). The bank shows how much this matters: "write down the equation linking f, λ, v" scored 22% on 2019 2F (recall, no sheet) and 90–99% from 2022 on (sheet given, or pick-from-three). Carried on every calc item via `equation_sheet` (principle 6).

---

## Scope exclusions (proposed; spine- and bank-confirmed) — do NOT author for Trilogy

| Spec area | Code(s) | Why excluded | Evidence |
|---|---|---|---|
| Sound in solids, the ear, hearing range 20 Hz–20 kHz | (Physics 4.6.1.3) | Absent from the v3 Trilogy spine (jumps 6.6.1.2 → 6.6.2) | 0 spine codes, 0 tag rows |
| Ultrasound, echo sounding (depth), seismic waves | (Physics 4.6.1.4) | Absent from the spine | 0 spine codes, 0 tag rows; but see OQ-B on echo CONTEXTS |
| Total internal reflection / critical angle | — | Not in the Trilogy spec at all (refraction only) | the refraction widgets support TIR configs; do not author them (OQ-E) |
| Lenses, colour/filters, black-body radiation | (Physics 4.6.2.5/.6, 4.6.3) | Physics-only | 0 spine codes. NB: "hotter emits more IR" IS examined in Trilogy (2021 2H IR camera); avoid only the black-body formalism |

**Kept despite a "(Physics only)" label:** 6.6.1.2.h ("show how changes in velocity, frequency and wavelength, in transmission of sound waves from one medium to another, are inter-related") carries the Physics-only label in the spec text yet has **x4 Trilogy tag rows** — AQA examines the shape in Trilogy via data framing (speed of sound vs air temperature graphs, 2022 and 2023; the ripple-tank depth question, 2021 2H). I propose the qualitative v=fλ reasoning shape is IN (it is just 6.6.1.2.f applied), with the formal sound-between-media wording avoided. Flagged OQ-C.

---

## 1. Sub-topic (subtag) groups for 6.6

Mapped to `SYLLABUS_6_6.md` and the bank. Bank weight = Trilogy tag rows under the listed codes (read with care: the method 6-markers are tagged under 6.6.1.2.a/b, and the 6.6.2.3.a/b rows mix dose/risk items with radio-origin items, so the per-code counts under- and over-state some groups; weights below are corrected by reading the actual parts).

| subtag | v3 codes (primary) | What it covers | Bank weight |
|---|---|---|---|
| `wave_basics` | 6.6.1.1 (a–f) | Transverse vs longitudinal; sound is longitudinal, ripples/EM transverse; compressions and rarefactions; the wave travels, not the medium | heavy (x18; the define-transverse 1–2 markers recur yearly) |
| `wave_properties` | 6.6.1.2.a/b/c/e, .g.i | Amplitude, wavelength, frequency, period as quantities: definitions, identify/mark on diagrams, compare two displayed waves, waves transfer energy | heavy (x33) |
| `wave_calculations` | 6.6.1.2.d/f (+6.5 v=d/t cross) | v=fλ; f=1/T; v=d/t in wave contexts incl. echo d=2x; the d037 chains; qualitative v=fλ reasoning; the prefix/standard-form load | heavy (24 WAVE_SPEED + 10 PERIOD uses) |
| `wave_measurement` | 6.6.1.2.g.ii/g.iii, .i.iA/.i.iB/.i.ii | Methods: speed of sound in air (direct and echo), speed of ripples; RP20 ripple tank AND waves-on-a-string; measure-across-several-wavelengths; means, precision | heavy (the worst-scoring 4–6 markers in the topic, every other year) |
| `refraction_boundaries` | 6.6.2.2.a/b/c/d | Refraction at a boundary; ray diagrams with the normal (FH); HT: velocity-difference cause, wavefront explanation, wavelength-dependent absorb/transmit/refract/reflect | medium (x12 genuine; reflection only inside .a) |
| `em_spectrum` | 6.6.2.1 (a–e) | The seven groups in order; continuous spectrum; common speed in vacuum/air; transverse, transfer energy; eyes detect only visible; place a wavelength in its region | heavy (x25) |
| `em_origins` | 6.6.2.3.a/b/c | HT: radio from oscillations in circuits; absorbed radio induces a.c. of the same frequency; gamma from the nucleus; atoms generate/absorb EM | light in count but recurrent and brutal (1–10% full marks every appearance) |
| `em_dangers` | 6.6.2.3.d–h | UV/X/gamma hazards; ionising vs radioactive; dose in sieverts as risk measure; mSv↔Sv; conclusions from dose data; use-despite-risk | heavy (most of the x12 tagged .b are these) |
| `em_uses` | 6.6.2.4 | Match group to application; HT explain suitability; communications uses (radio/microwave/fibre); satellite microwaves pass the atmosphere | heavy (x23) |
| `infrared_radiation` | 6.6.2.2.e.i–iii (+.a contexts) | RP21: emission and absorption by surface type, matt black vs shiny; Leslie cube, bottles/flasks, cooling curves; rate vs final temperature; thermal equilibrium; IR detection | heavy (x13 plus the whole 2025 F and H batches) |

Notes:
- **`wave_basics` and `wave_properties` split**, mirroring the 6.5 motion three-way split (d028): the bank shows classify-the-wave-type and define-transverse failing on one axis (55% picked longitudinal for sound; 13–25% can define transverse) while quantity-on-diagram work fails on a different axis (amplitude marked peak-to-trough, wavelength marked as half). Independently-failing skills, separately tracked.
- **`wave_measurement` merges the speed-of-sound/ripple methods with RP20** rather than a separate RP subtag: 6.6.1.2.g.ii/g.iii and the RP are the same skill cluster (the spec's own method list), AQA examines them interchangeably (the 2018 echo 4-marker, the 2019/2021 ripple-tank 4–6 markers, the 2024 string question), and every one of them fails the same way (apparatus described, measurements not used). Note the 2024 string RP items are tagged `6.6.1.2.i.iA` in the bank even though they are the waves-on-a-string half — `i.iB` carries 0 rows only as a tagging-granularity artefact, not because the string RP is unasked.
- **`em_origins` kept distinct from `em_uses`/`em_dangers`**: the HT radio-oscillation material is its own misconception cluster (ionosphere reflection, transverse/longitudinal padding) and the most catastrophic scorer in the topic (1% full marks 2018, ~90% zero 2020, 10% >1 mark 2024). Folding it into em_uses would hide that signal.
- 10 subtags vs 6.5's 12: right size for a topic with roughly half Forces' bank weight.

---

## 2. Atom groups (the units the dashboard tracks)

Candidate `atom_id`s by subtag, at the grain where one wrong answer is diagnostic (d004). Tier-shared (d005); HT-only marked **(HT)**.

**wave_basics**
- `transverse_longitudinal_classify` — classify a named wave (sound → longitudinal; ripples, EM → transverse)
- `transverse_definition` — oscillations perpendicular to the direction of energy transfer
- `longitudinal_definition` — oscillations parallel to energy transfer; shows compressions and rarefactions
- `compression_rarefaction_identify` — label C and R on a longitudinal picture (widget: `longitudinal_wave`)
- `wave_not_medium` — evidence the wave travels, not the medium (the bobbing duck; air does not travel to the ear)

**wave_properties**
- `amplitude_definition` — maximum displacement from the undisturbed position
- `wavelength_definition` — point to the equivalent point on the adjacent wave
- `frequency_definition` — waves passing a point per second (Hz)
- `period_definition` — time for one complete wave to pass a point
- `mark_wavelength_on_diagram` — mark/identify λ on a wave train or wavefront picture (widget: `wave_train`, `wavefronts`)
- `mark_amplitude_on_diagram` — mark/identify amplitude, rest line to crest (widget: `wave_train`)
- `compare_two_waves` — same-scale comparison of amplitude/frequency/wavelength of two displayed waves
- `period_from_trace` — read the period off a time-axis trace
- `wave_energy_transfer` — waves transfer energy (not matter, not charge)

**wave_calculations**
- `wave_speed_calc` — v=fλ, any subject
- `wave_equation_recall` — write down/select v=fλ (equation_sheet-sensitive: 22% recall vs 90%+ given)
- `period_frequency_calc` — f=1/T and T=1/f (always given)
- `echo_distance_doubling` — d=2x in any echo/reflection timing (clap-echo, radar)
- `wave_equation_qualitative` — reason with v=fλ at constant f (v∝λ: deeper/faster ⇒ longer λ; the 2021 2H ripple-depth and 2022/2023 sound-temperature shape)
- `chained_wave_calc` — the d037 chains as `calc_workings` stages: v=fλ → v=d/t; f=1/T → v=fλ → v=d/t
- Cross-topic: v=d/t substitutes reference the 6.5 `speed_calc` atom via `atomMap` (d030), not a waves-local duplicate (OQ-A).

**wave_measurement**
- `speed_sound_direct_method` — two observers a measured distance apart (clap/drum, see-then-hear), v=d/t
- `speed_sound_echo_method` — clap against a wall at a measured distance, time the echo (or clap-in-rhythm), d=2x
- `ripple_tank_method` — RP20: lamp/screen shadow, signal-generator frequency, measure the screen pattern (widget: `ripple_tank`)
- `several_wavelengths_measured` — measure across several λ and divide (incl. applying a screen scale factor)
- `string_standing_wave_method` — RP20 solid: vibration generator, pulley and masses; λ from loop lengths (each loop = λ/2); v=fλ (widget: `standing_wave`)
- `frequency_count_method` — count waves passing a point per unit time (the pier/duck count; widget: `wave_scenario`)
- `mean_of_repeats` — mean of repeated readings, used on the RIGHT quantity
- `precision_uncertainty_basics` — precision = small spread about the mean; uncertainty = ± half the range

**refraction_boundaries**
- `refraction_name` — name the change of direction at a boundary
- `ray_diagram_construct` — draw normal + refracted ray, correct side and direction (FH; widget: `refraction_ray` interactive)
- `refraction_direction` — toward the normal entering the slower medium, away leaving it
- `refraction_speed_cause` **(HT)** — refraction is due to the velocity difference between media
- `wavefront_explanation` **(HT)** — one end of the wavefront slows first; spacing shortens; direction kinks (widget: `refraction_wavefronts`)
- `frequency_unchanged_at_boundary` — f fixed at a boundary; v and λ change together
- `wavelength_dependent_behaviour` **(HT)** — substances absorb/transmit/refract/reflect differently by wavelength (violet bends most; glass blocks UV)

**em_spectrum**
- `em_order` — the seven groups in order (widget: `em_spectrum`)
- `em_ends_identify` — which group sits at the high-frequency / long-wavelength end
- `freq_wavelength_inverse` — long λ ⇔ low f across the spectrum
- `em_common_properties` — all transverse, all transfer energy, all at the same speed in vacuum/air
- `em_continuous_spectrum` — the spectrum is continuous
- `visible_limited_detection` — eyes detect only the visible band
- `visible_colour_order` — red long λ to violet short λ
- `em_wavelength_magnitude` — place a given wavelength (with prefixes/standard form) in its region (the 2021 2H 6.5×10⁻⁷ m item)

**em_origins**
- `radio_from_oscillations` **(HT)** — radio waves produced by oscillations in electrical circuits
- `radio_induce_ac` **(HT)** — absorbed radio waves induce an a.c. of the same frequency in a circuit
- `gamma_from_nucleus` — gamma originates in nuclear changes; atomic changes generate/absorb EM across a wide range

**em_dangers**
- `uv_hazards` — premature skin ageing; increased skin-cancer risk
- `ionising_hazards` — X/gamma are ionising; gene mutation and cancer
- `hazard_matched_to_group` — the right risk for the right group (UV vs X/gamma)
- `dose_as_risk_measure` — sieverts measure risk of harm (unit not recalled); 1000 mSv = 1 Sv
- `risk_data_conclusions` — compare doses / draw conclusions from given data
- `use_despite_risk` — justify medical use against the dose (benefit outweighs risk)

**em_uses**
- `em_use_match` — match each group to its spec applications
- `em_use_explain` **(HT)** — explain WHY the wave suits the application (microwaves pass the atmosphere; IR heats; X-rays pass soft tissue, absorbed by bone)
- `communication_uses` — radio/TV, satellite microwaves, fibre-optic visible light, Bluetooth-type comparisons

**infrared_radiation**
- `ir_emission_surface` — matt black best emitter, shiny/white worst (widget: `radiation_demo` Leslie cube)
- `ir_absorption_surface` — matt black best absorber (bulb/wax, bottles)
- `rp21_method` — RP21 method essentials: identical containers, volume by measuring cylinder, thermometer/probe, timed readings, control variables
- `cooling_curve_interpret` — initial gradient = rate; black's curve steeper; read temperature differences off the curves
- `ir_temperature_link` — hotter surfaces emit more IR (the IR-camera shape; no black-body formalism)
- `thermal_equilibrium_rates` — constant temperature = absorbing and emitting at equal rates

(~50 atoms across 10 subtags.)

---

## 3. Misconception slugs

ECM schema (`slug / topic / label / description`); `topic` = subtag. **NEW_FLAG** = surfaced from the AQA Trilogy 6.6 bank with examiner-report evidence. **[widget]** = already an errorCode in the built Widgets 6.6 grading contract (`Widgets_Housing_interactive_66.md`) — per the d035 ruling these MUST be registered in the misconception registry; where the bank independently evidences them I cite it, so widget fires and MCQ/calc fires land in one taxonomy.

### NEW_FLAG — surfaced from the bank

| slug | subtag | trap | evidence (examiner reports) |
|---|---|---|---|
| `sound_called_transverse` | wave_basics | classifies sound as transverse | "only 55% identified a sound wave as longitudinal; many of those that did not score selected transverse" (2018 2F) |
| `updown_sideways_vague` | wave_basics | describes transverse/longitudinal as "up and down" / "side to side" with no oscillation-vs-energy-transfer directions | "many vague incorrect descriptions of 'up and down' and 'side to side'" (2018 2H) |
| `perpendicular_to_what_missing` | wave_basics | says "perpendicular" but never to WHAT (direction of travel/energy transfer) | "knew transverse waves were perpendicular but could not say what they were perpendicular to" (2019 2H); "no mention of energy transfer" (2024 2H) |
| `oscillation_term_missing` | wave_basics | definition omits oscillations/vibrations entirely | "almost complete description but no mention of oscillations/vibrations so the mark cannot be awarded" (2024 2H) |
| `compression_rarefaction_confused` | wave_basics | swaps C and R, or labels them amplitude/frequency | "many confused rarefaction and compression with amplitude and frequency" (2018 2F); "the majority correctly labelled the compression [only]" (2023 2F) |
| `amplitude_peak_to_trough` | wave_properties | amplitude taken as crest-to-trough (2A) **[widget]** | the 2019 duck item: "a third worked out the difference [11 mm]... less than 10% went on to halve this value" (2019 2H) |
| `wavelength_half_marked` | wave_properties | wavelength marked crest-to-adjacent-trough (λ/2) **[widget: `wavelength_half`]** | widget distractor, built; spec 6.6.1.2.c is the direct counter |
| `wavelength_peak_to_trough` | wave_properties | wavelength marked as the diagonal crest→trough **[widget]** | widget distractor, built |
| `amplitude_diagonal` | wave_properties | amplitude marked as a diagonal **[widget]** | widget distractor, built |
| `wavelength_c_to_r` | wave_basics | longitudinal wavelength marked compression-to-rarefaction (λ/2) **[widget: `wavelength_C_to_R`]** | widget distractor, built |
| `period_frequency_confused` | wave_properties | swaps period and frequency (definition or trace read) | "some confusion evident between period and frequency" (2019 2F ripple 6-marker); only ~50% picked the period definition (2025 2F); ~25% read the period off the trace, equal numbers picking the half- and double-cycle values (2020 2F) |
| `wave_equation_inverted` | wave_calculations | divides the wrong way / builds the equation from stem word order | "most common to see frequency divided by speed" (2019 2F); "frequency = wave speed × wavelength... terms in the order they appear in the stem" (2019 2H); "arrived at the reciprocal of the correct answer" (2019 2H) |
| `reciprocal_not_taken` | wave_calculations | with f=1/T (or T=1/f), returns the given value as the answer (divides by one) | "rearranged incorrectly and multiplied the period by one, so gave their final answer as the same number as the period" (2024 2H); "incorrect calculations such as '1/48 = 48'" (2025 2F) |
| `stem_numbers_multiplied` | wave_calculations | grabs two stem numbers and multiplies regardless of physics | "many students just multiplied 300 by 28" (2022, the sound-temperature graph item); "most just multiplied the two numbers together" (2024 2F) |
| `graph_readoff_left_as_answer` | wave_calculations | reads the right value off the graph then submits IT as the final answer, skipping the formula step | "some students did read the correct value from the graph, but then wrote that as their final answer" (2022 2F and 2H) — prep-step tier d038; candidate for the shared WS/cross-topic set (OQ-F) |
| `faster_means_longer_time` | wave_calculations | fails the qualitative speed–time inversion (faster sound ⇒ LESS travel time) | "stated the speed would increase with temperature, but then said that the time would increase" (2023 2F) |
| `echo_factor_two_missed` | wave_calculations | forgets d=2x in echo/reflection timing **[widget]** | widget errorCode; the d037 echoes row (L5); the 2018 echo item's mark scheme carries the doubling |
| `apparatus_described_not_method` | wave_measurement | describes the equipment/setup instead of what is measured and how | "tried to explain what each part of the apparatus was used for rather than how to collect the required data" (2019 2F); "mostly written a description of the equipment set-up... nothing of relevance to a method" (2024 2H); "used half the space describing how to set up the ripple tank" (2019 2H) |
| `measurement_purpose_missing` | wave_measurement | takes measurements but never says what is done with them (no v=d/t, no v=fλ) | "those that did mention distance failed to give any account of what would be done with the measured values" (2018 2F echo); "did not give any description of what these measurements were for" (2021 2F) |
| `single_wavelength_measured` | wave_measurement | measures one λ instead of across several and dividing | "only a small percentage accurately measured across a number of wavelengths... the majority measured across one wavelength and multiplied that by 5" (2023 2H, scale-factor item) |
| `mean_across_different_quantities` | wave_measurement | averages numbers that are not repeats of one quantity (all six duck heights pooled) | "the vast majority of the 58% who gained no marks simply found the mean of all 6 figures" (2019 2F) |
| `counted_loops_not_nodes` | wave_measurement | nodes = loops + 1 miscounted on a standing wave **[widget]** | widget errorCode (the string RP unasked in this form so far; spec-first coverage) |
| `refraction_term_unknown` | refraction_boundaries | cannot name refraction | "approximately 20% knew that the process is refraction" (2023 2F) |
| `bent_wrong_way` | refraction_boundaries | refracted ray on the wrong side of the normal / wrong direction **[widget]** | "refracted rays were drawn in many different directions" (2025 2H); "refraction along the normal line... emergent ray parallel to incident" listed wrong forms (2019 2H prism) |
| `equal_angle_no_refraction` | refraction_boundaries | draws r = i (no refraction) **[widget]** | widget errorCode, built |
| `snell_angle_off` | refraction_boundaries | right direction, angle outside tolerance **[widget]** | widget errorCode (method/value split, mirrors calc grading) |
| `normal_not_drawn` | refraction_boundaries | omits the normal (or measures angles from the surface) | "even fewer remembered to add in a normal at the emergent ray" (2019 2H); the 2025 2H item's first mark is the normal |
| `density_cited_not_speed` | refraction_boundaries | explains refraction by "the glass is denser", no speed change | "very common for students to refer to the density of the glass, and sometimes to optical density. All of these references were ignored" (2025 2H) |
| `speed_change_direction_unstated` | refraction_boundaries | says the speed changes but not whether it speeds up or slows | "did not make it clear whether they thought the waves were increasing or decreasing in speed, so did not score" (2025 2H) |
| `boundary_frequency_not_constant` | refraction_boundaries | lets frequency change at the boundary when reasoning about λ and v | the 2021 2H ripple-depth item (under 20% scored; stem fixed f, most could not run v∝λ); spec 6.6.1.2.h |
| `em_order_confused` | em_spectrum | misplaces a region (UV between microwave and visible) **[widget: `em_off_by_one_region`, `em_region_wrong`]** | "many believed it came between microwaves and visible light" (2018 2F); fewer than 25% named A/B/C on the 2023 2F spectrum |
| `spectrum_ends_swapped` | em_spectrum | gives radio for the high-frequency end or gamma for long-wavelength **[widget]** | "a third of students scored no marks" on the gamma-greatest/radio-greatest box-fill (2019 2F) |
| `freq_wavelength_inverse_missed` | em_spectrum | treats long wavelength as going with high frequency | "the most common error was that they would have a longer wavelength than microwaves" (2018 2F UV statements) |
| `red_called_shortest` | em_spectrum | wrong colour order within visible | "the most common incorrect answer was red [for shortest wavelength]" (2024 2H) |
| `property_answered_with_use` | em_spectrum | gives a use when asked for a property (or repeats the stem's property back) | "many wrote about uses of the waves, rather than their properties" (2025 2F); "many simply repeated the wording of the stem" (2024 2H); "for the difference, most did not refer to a property" (2023) |
| `radio_oscillation_link_missed` | em_origins | no link from oscillating charges/a.c. to radio emission, or from absorption to induced a.c. of the SAME frequency | "just over 1% gaining full marks... considerable reference to radio waves being reflected off the ionosphere" (2018 2H); "90% scored 0 or did not attempt" (2020 2H); "10% scored more than 1 mark" (2024 2H) |
| `ionising_confused_with_radioactive` | em_dangers | calls X/gamma "radioactive" instead of ionising | "the majority that did not gain the mark thought that X-rays are radioactive" (2020 2F) |
| `risk_unqualified` | em_dangers | bare "cancer"/"burning" with no qualification (skin cancer, mutation, dose link) | "weaker responses of 'cancer' or 'burning' without further qualification" (2018 2F) |
| `hazard_wrong_for_group` | em_dangers | attaches the wrong risk to the wrong group (skin cancer for gamma; generic "cancer" for all three) | "responses regarding health issues referred, incorrectly, specifically to skin cancer [for gamma absorption]" (2019 2F); "less than 20% listed the three groups and correctly linked each to a specific risk" (2024 2H) |
| `dose_magnitude_misread` | em_dangers | cannot compare 0.100 mSv with 100 mSv (decimal/place-value on dose data) | "some students did not appreciate that 0.100 is much less than 100, and some thought that they were the same" (2020 2F) |
| `protection_mechanism_vague` | em_dangers | "the screen protects the doctor" with no absorption mechanism | "very few students were able to explain how the screen reduced the risk by absorbing X-rays, many just repeated the question" (2020 2H) |
| `microwave_only_cooking` | em_uses | knows microwave ovens only; no communications use, or no idea microwaves are EM | "many described microwave ovens cooking food and demonstrated no knowledge or understanding that microwaves are a form of electromagnetic radiation" (2020 2F); "most failing to identify the correct use of microwaves" on the line-match (2022 2F) |
| `ultrasound_treated_as_em` | em_uses | offers ultrasound (or "longitudinal"/"transverse") as an EM wave type for imaging | "other incorrect responses of note were longitudinal, transverse and ultrasound" (2018 2F medical imaging) |
| `shiny_white_called_good_emitter` | infrared_radiation | inverts the surface ranking (white/shiny best emitter, or black worst absorber) | "common misconceptions included the idea that white surfaces are the best emitters" (2025 2H) |
| `final_temp_cited_not_rate` | infrared_radiation | cites the higher final temperature where the initial RATE (gradient) is asked | "answers often referred to a higher final temperature, and not that the initial rate at which the temperature increased was higher" (2022 2H) |
| `heat_not_radiation_language` | infrared_radiation | answers in "absorbs heat" terms instead of absorbing/emitting IR radiation | "relatively common for students to express that the cubes were absorbing heat, but this was not given any credit" (2025 2H) |
| `thermal_equilibrium_missed` | infrared_radiation | cannot express constant temperature as absorption rate = emission rate | "explaining the idea of a thermal equilibrium in terms of absorbing and emitting infrared radiation at the same rate was a far more challenging idea, and very few students were able to express this" (2025 2H) |
| `ir_temperature_link_missed` | infrared_radiation | no link from IR amount to temperature (camera/hand items) | "very few students linked the amount of infra-red radiation to temperature" (2021 2H) |

### Widget errorCodes — registration housekeeping (d035 ruling)

All scorer errorCodes from `Widgets_Housing_interactive_66.md` resolve into the table above or map as follows: `feature_orientation_wrong`, `wavelength_value_wrong`, `amplitude_value_wrong` (wave-marking method/value codes) → register as engine-level codes mapped to `wavelength_half_marked`/`amplitude_peak_to_trough` where the named pattern matches, else logged as value-tolerance misses (not misconceptions); `em_end_wrong` → `spectrum_ends_swapped`; the `<quantity>_wrong` scenario codes → value-tolerance misses; `tir_not_recognised` → registered but UNUSED for Trilogy (TIR out of scope, OQ-E). The static distractor names `amplitude_double`/`wavelength_half` map to `amplitude_peak_to_trough`/`wavelength_half_marked`.

### Ported from the 6.2/6.5 sets / cross-topic calc slugs (valid as-is for 6.6)

| slug | subtag | note |
|---|---|---|
| `wrong_formula_rearrangement` | (cross-calc) | "substituted into an incorrectly rearranged equation" (2024 2H); "a large number of responses using an incorrect rearrangement" (2018 2H) |
| `power_of_ten_evaluation_error` | (cross-calc) | the standard-form heartland: "did not use their calculator to evaluate the numbers in standard form, so scored 2 marks" (2023, both tiers); "6.25×10¹⁴ Hz = 4.8×10²¹ m being relatively common" (2025 2H) |
| `picked_given_value` | (cross-calc) | overlaps `reciprocal_not_taken` and `graph_readoff_left_as_answer`; keep for generic fires |
| `rounding_mistake` | (cross-calc) | engine-derived near-miss |
| `graph_scale_misread` | (cross, from 6.5) | reads the speed-of-sound graph off-gridline |

### Cross-topic / working-scientifically (for the Overview-owned WS taxonomy, q-ws-taxonomy)

| slug | note |
|---|---|
| `prefix_not_converted` | The dominant 6.6 calc killer, as in 6.5 but with a different prefix population: **kHz→Hz** ("only 5% of students performed the conversion from kHz to Hz", 2022 2F), **GHz→Hz** (2025 2F: a very small proportion fully correct), **ms→s**, and uniquely **nm on OUTPUT** ("many students who attempted the conversion to nm thought that nano referred to 10⁻³ or 10⁻⁶... very common to multiply by 10⁻⁹ instead of dividing", 2025 2H), plus cm→m in the ripple-tank mean ("only approximately 5% converted", 2021 2H). |
| `sig_figs_not_applied` | "usually not giving the answer to two significant figures" (2018 2H); "a surprising number who decided to give their answer to one significant figure" unasked (2025 2F). |
| `proportionality_stated_as_increases` | already shared (d028); fires here on dose-distance and refraction-data conclusions. |
| `freehand_line_not_ruled` / `repeatability_reproducibility_confused` | RP20/RP21 plotting and evaluation, as 6.2/6.5. |
| **propose NEW WS:** `uncertainty_given_as_range` | "common to see students calculate the size of the range, but to state that this was equal to the uncertainty" (2025 2H, RP21). Uncertainty = ± half the range. |
| **propose NEW WS:** `digital_reading_trusted_no_random_error` | "students perceive that digital devices give a definitive value for what they are measuring and therefore cannot possibly show random errors" (2025 2H, named as a misconception by the examiner). |
| **propose promotion:** `graph_readoff_left_as_answer` | listed under wave_calculations above; it is a prep-step (d038 tier-2) failure that will recur in 6.1/6.3 heater chains and 6.5 graph chains. Architecture to place (OQ-F). |

---

## 4. Calculation vocabulary mapping (Codex six-layer alignment)

| Codex code | Equation | subtag | 2023 insert? | Pre-Covid insert? | Recall status |
|---|---|---|---|---|---|
| `FORMULA.WAVE_SPEED` | v = fλ | wave_calculations | yes | **no** | **recall once the insert reverts** (Appendix B recall; x24 in the tagged slice) |
| `FORMULA.PERIOD` | T = 1/f | wave_calculations | yes | **yes** | **always given (select-and-apply)**; x10 |
| `FORMULA.DISTANCE_VT` | v = d/t | (6.5 cross-topic) | yes | no | invoked by the echo and travelling-wave chains; atom referenced from 6.5 (OQ-A) |

Mark-category frequencies in the tagged Trilogy 6.6 slice: `evaluation` 28, `substitution` 25, `rearrangement` 12, `non_final_evaluation` 8, `equation_quoted` 6, `prefix_conv` 5, `unit` 3. Number sources: `direct` 37, `from_table` 4, `from_graph` 3, `prefix_strip` 3, `calculated_earlier_in_same_part` 2, `from_previous_part` 1. Gate records: `ecf_allowed` 1 (the 2020 period→frequency pair is the bank's clean `from_previous_part` ECF exemplar). Unit-handling rows: kilo-on-f x2, milli-on-T x2, giga-on-f, **nano-on-λ (apply, output)**, min→s, std-form input x3, std-form output x1.

Structural reading, against 6.5's profile:

- **The asked bank is single-formula** (21 vs 2 multi-stage) **with the difficulty loaded into Layers 3 and 4**: prefix strips and applies, standard form both ways, graph and table number sources. Authoring should make tier-2 prep-step items (d038) a deliberate spine here: graph read → v=fλ (the 2022 sound-temperature shape), table means → v=fλ with cm→m (the 2021 2H mean-wave-speed shape, a genuine 4-marker), trace read → f=1/T.
- **The d037 chains are the gap pass.** Travelling waves (v=fλ → v=d/t, L5), with-period (f=1/T → v=fλ → v=d/t, L4), echoes (v=d/t with d=2x, L5) are barely present in the tagged papers; author them as chained `calc_workings` `stages` with `gate:{kind:"from_previous_part"}`, ECF allowed, anti-ECF gates NOT manufactured (one gate record in the whole slice).
- **The "give the unit" mark** appears in its classic last-slot form (the 2022 period item: 4 marks = sub + eval + prefix + unit; "very few gave the correct unit" at F). The 2025 choose-the-unit-from-a-box variant is a Foundation-friendly form worth copying.
- **Standard-form gating:** the 2024 2H "give your answer in standard form" item gates evaluation via mark-scheme wording, exactly the README's recurring pattern.

---

## 5. Question-type constraints and forms (no NEW_QTYPE needed)

6.6 is the first topic that can be authored almost entirely inside the v1.3 schema; the widget centrality (d031) is already paid for. Forms I will use:

- **`qtype:"widget"` (d035) as a first-class item**: mark-the-wavelength / mark-the-amplitude on `wave_train` (2 marks, method + value); mark λ on `wavefronts` / C-to-C on `longitudinal_wave`; drag the refracted ray on `refraction_ray` / `refraction_wavefronts` (direction + Snell-tolerance value); `em_spectrum` region select; numeric reads on `wave_scenario` / `ripple_tank` / `standing_wave`. Every errorCode resolves to a §3 slug.
- **`mcq` with diagram/widget options (d036)**: "which diagram shows the amplitude?" over the built distractor renders (amplitude_double, wavelength_half, diagonal); "which ray diagram is correct?" as the interim form of the FH ray-construction point 6.6.2.2.c (the d023 pattern); which-wave-has-greatest-amplitude/frequency/wavelength over rendered wave sets (the 2020 2F trio).
- **`calc_workings`**: single-formula with the Layer-3/4 load carried on the knowns (`asGiven` prefixes, standard form); tier-2 prep-step items with a leading read/mean/convert stage (d038); the d037 chains as `stages` (d029).
- **`level_of_response_6` (staged, claim-points)**: the method 4/6-markers — ripple tank, speed of sound by echo and direct, the string RP, RP21 — and the HT radio-oscillation explanation. The claim-point banks fall straight out of the §3 method misconceptions (apparatus-not-method, measurement-purpose-missing, several-wavelengths).
- **`short`** kept minimal (tight single-point recall), per the d034 steer against keyword marking. The transverse-definition family in particular should NOT be `short`: the examiner evidence shows the mark turns on TWO co-present elements (oscillations AND perpendicular-to-energy-transfer), which keyword-presence marking mis-grades; MCQ/claim-points instead.

One small flag, not a NEW_QTYPE: the `refraction_ray` widget grades the refracted ray but has no draw-the-normal response, so `normal_not_drawn` is reachable only via MCQ distractors for now. If Widgets later add a normal handle the contract gains a field (their v1.1 pattern); nothing blocks.

---

## 6. Open questions for Architecture / Smith

- **OQ-A (cross-topic atoms):** echo and travelling-wave chains invoke v=d/t whose atom is 6.5 `speed_calc`. Confirm waves items reference it via `atomMap` (d030 pattern), with `echo_distance_doubling` as the waves-local atom for the d=2x step.
- **OQ-B (echo contexts):** ultrasound/echo-sounding is Physics-only as SPEC content, but Smith's catalogue lists the echo calc (L5) with "clap-echo, ultrasound depth, radar" contexts. Propose: author echo items in Trilogy-safe frames (clap off a wall, EM radar); sonar/ultrasound-depth allowed as a context with no ultrasound-specific physics claims. Confirm or trim.
- **OQ-C (6.6.1.2.h):** the spec marks it "(Physics only)" yet AQA examines its substance in Trilogy via data framing (x4 tag rows: sound-speed-vs-temperature, ripple depth). Propose: in scope as qualitative v=fλ reasoning (`wave_equation_qualitative`, `boundary_frequency_not_constant`), avoiding the formal sound-between-media wording. Confirm.
- **OQ-D (subtag splits):** confirm `wave_basics`/`wave_properties` and the three-way `em_origins`/`em_dangers`/`em_uses` splits (diagnostic argument in §1 notes).
- **OQ-E (TIR):** total internal reflection is not Trilogy (nor AQA GCSE) content; the refraction widgets support TIR configs. Propose: do not author TIR items; `tir_not_recognised` stays registered-but-unused, or is dropped from the registry — your call; it is the only widget code without a Trilogy use.
- **OQ-F (WS additions):** accept `uncertainty_given_as_range` and `digital_reading_trusted_no_random_error` into the shared WS taxonomy, and rule where `graph_readoff_left_as_answer` lives (waves-local vs shared; I argue shared — a d038 prep-step failure that 6.1/6.3 heater chains will also hit).
- **OQ-G (sequencing, not blocking):** the insert cliff is asymmetric here: v=fλ goes must-recall when the insert reverts (22% could recall it in 2019) while T=1/f stays given. Worth carrying in difficulty calibration for `wave_equation_recall` items.

Pushback welcomed. On ratification I author by subtag, two-pass (spec-first, then bank, then gap), reporting each batch as `review/<subtag>.md` with any NEW_QTYPE/NEW_FLAG proposals that surface.
