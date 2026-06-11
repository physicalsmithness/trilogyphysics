# Trilogy Forces 6.5 — vocabulary proposal (Stage 1)

Status: **PROPOSED, awaiting Architecture ratification.** Mirrors the structure of the ratified `trilogy_electricity_vocabulary_proposal.md`.

From: 6.5 Forces Authoring chat. To: Architecture. Date: 2026-06-11.

## State absorbed before drafting (standing principle 3)

Read: `inter_chat/Architecture_Authoring_6_5_kickoff.md`, `AUTHORING_BRIEF.md`, `SCHEMA.md` (locked item contract v1.0, d022), `QUESTION_TYPES.md` (the 6.2 type map this file EXTENDS, principle 5), `DECISIONS.md`, `ROADMAP.md`, `OPEN_QUESTIONS.md`, the ratified 6.2 vocabulary proposal, and `review/SYLLABUS_6_5.md` (the v3 code spine). Mined the live bank (`aqa_extraction_plus_calc.db`) for Forces: **404 syllabus-tag rows under 6.5** across the Trilogy papers, the per-code spec descriptions in `syllabus_sections`, **338 examiner-report entries** aligned to 6.5 parts, the `formula_catalogue` insert flags, and the six-layer calc tagging (formula uses, unit handling, mark categories, gate records).

Three things from that reading shaped this proposal up front and are flagged because they change scope or grading, not just naming:

1. **Forces is multi-stage-calculation-heavy in a way 6.2 was not.** In the tagged Trilogy slice the forces-formula parts carry **43 `non_final_evaluation` marks and 35 `ecf_allowed` gate records** (versus 4 `no_ecf_gating`). Questions routinely chain: read a speed from a graph -> feed it into stopping distance; convert delta-v -> acceleration -> distance; use `v^2-u^2=2as` then `F=ma`. The locked `calc_workings` qtype is described as "the 4-line marks-the-method type" (single formula). **The single biggest open question for Forces is whether `calc_workings` chains across stages, or whether a multi-stage variant is needed (section 5, OQ-A).** This is load-bearing; I have not authored multi-stage items pending your ruling.

2. **Three spec areas that look in-scope are Physics-only (Triple), not Combined Trilogy, and the bank confirms it.** `syllabus_sections` marks them "(Physics only)", and they have **zero Trilogy syllabus-tag rows**: terminal-velocity v-t graph *drawing* (6.5.4.1.5.j), conservation-of-momentum *collision calculation* of two objects (6.5.5.2.c.ii), and the entire *changes-in-momentum* / `F=delta-p/t` subsection (6.5.5.3, incl. the air-bag/seat-belt momentum-safety reasoning). I propose these are **out of scope for Trilogy authoring** (see Scope exclusions). Trilogy momentum is `p=mv` (HT) plus conservation described *qualitatively*. Pushback welcome if the spine intends a later Triple build.

3. **Two forces equations are given even on the minimal (pre-Covid) insert; the rest are recall.** `Ee=1/2 k e^2` and `v^2-u^2=2as` are AQA's "select-and-apply / given" equations (`on_pre_covid_insert=1`). `W=mg`, `F=ke`, `W=Fs`, `F=ma`, `a=delta-v/t`, `s=vt`, `p=mv` are on the generous 2023 insert but are fundamentally **recall** equations (`on_pre_covid_insert=0`). Same difficulty cliff 6.2 flagged: once the insert reverts, seven forces equations become must-recall while only two stay given. Carried onto every calc item via `equation_sheet` (principle 6).

---

## Scope exclusions (proposed; bank-confirmed) — do NOT author for Trilogy

| Spec area | Code | Why excluded | Bank evidence |
|---|---|---|---|
| Terminal-velocity v-t graph drawing | 6.5.4.1.5.j | Spec "(Physics only)" | 0 Trilogy tag rows (terminal velocity is examined *qualitatively* via 6.5.4.1.5.i x13) |
| Conservation-of-momentum collision *calculation* | 6.5.5.2.c.ii | Spec "(physics only)" | 0 Trilogy tag rows; momentum collisions appear only as qualitative description (6.5.5.2.c.i x1) |
| Changes in momentum / `F=delta-p/t`, momentum-safety reasoning | 6.5.5.3.a-d | Whole subsection "(physics only)" | 0 Trilogy tag rows; `BRIDGE.MOMENTUM_CONSERVATION` and `F=delta-p/t` not used in any tagged Trilogy part |

Trilogy momentum (6.5.5, **HT only**) is therefore: `p=mv` calculation, and conservation of momentum stated/described qualitatively. No two-body collision algebra, no impulse, no `F=delta-p/t`.

Note also two **cross-topic** equations that surface inside Forces contexts but whose atoms live in **Energy 6.1**: kinetic energy `1/2 m v^2` (`FORMULA.KE`, used x10 in the tagged Trilogy slice) and GPE `mgh` (`FORMULA.GPE`, x10), e.g. braking energy = KE, work-energy on ramps. See OQ-D for how forces items should reference 6.1 atoms.

---

## 1. Sub-topic (subtag) groups for 6.5

Mapped to `SYLLABUS_6_5.md` and confirmed against what the bank examines under each code. Proposed `subtag` slugs (snake_case; the value an item carries alongside its finest v3 code, per d021). Bank weight = distinct Trilogy syllabus-tag rows under the listed codes.

| subtag | v3 codes (primary) | What it covers | Bank weight |
|---|---|---|---|
| `forces_basics` | 6.5.1.1, 6.5.1.2 | Scalar vs vector; representing a vector by an arrow; contact vs non-contact forces; force as an interaction | heavy (6.5.1.1.a x12) |
| `weight_gravity` | 6.5.1.3 | Weight `W=mg`; gravitational field strength; weight proportional to mass; centre of mass; reading a newtonmeter | heavy (6.5.1.3.a x15) |
| `resultant_forces` | 6.5.1.4 | Resultant of collinear forces; free-body diagrams (HT, qualitative); resolving a force into perpendicular components and equilibrium vector diagrams (HT) | medium |
| `work_done` | 6.5.2 | `W=Fs`; 1 J = 1 N m and the N m <-> J conversion; work against friction -> thermal | heavy (6.5.2.b x20) |
| `springs_elasticity` | 6.5.3 | Hooke `F=ke`; elastic vs inelastic deformation; linear vs non-linear, limit of proportionality; spring constant; elastic PE `Ee=1/2 k e^2`; RP18 | heavy (6.5.3.c x24, 6.5.3.a x9) |
| `motion_descriptors` | 6.5.4.1.1-3 | Distance vs displacement; speed vs velocity; typical speeds (and speed of sound); `s=vt`; average speed for non-uniform motion; circular motion (HT, qualitative) | heavy (6.5.4.1.2.i x17) |
| `motion_graphs` | 6.5.4.1.4, .5.d/f | Distance-time (gradient = speed; tangent for instantaneous speed HT); velocity-time (gradient = acceleration; area = distance/displacement HT, by counting squares) | heavy |
| `acceleration` | 6.5.4.1.5.a/b/g | `a=delta-v/t`; deceleration; estimating everyday accelerations; uniform-acceleration `v^2-u^2=2as` | heavy (6.5.4.1.5.a x19, .g x8) |
| `newtons_laws` | 6.5.4.2 | N1 (resultant zero => constant velocity); N2 `F=ma` and a prop F, a prop 1/m; N3 equal-and-opposite; inertia and inertial mass (HT); RP19 | heavy (6.5.4.2.2.b x29) |
| `terminal_velocity` | 6.5.4.1.5.i | Object falling through a fluid; drag rises with speed until it balances weight => constant velocity (qualitative; the iconic 6-marker) | medium (6.5.4.1.5.i x13) |
| `stopping_distance` | 6.5.4.3 | Stopping = thinking + braking; reaction time and its factors; speed-stopping-distance graphs; braking force does work = KE; estimating braking force (HT) | heavy |
| `momentum` | 6.5.5 | `p=mv` (HT); conservation of momentum described qualitatively (HT). Collision *calculation* excluded (see Scope) | medium (6.5.5.1.a x12) |

Notes:
- **Three motion subtags, not one.** I propose splitting motion into `motion_descriptors` (definitions + `s=vt`), `motion_graphs` (gradient/area reading), and `acceleration` (`a=delta-v/t`, `v^2-u^2=2as`) because the examiner data shows these are three independently-failing skills: graph-gradient naming collapses to 10-40% even where the same cohort can do `s=vt` at 90%+. Folding them would hide the single largest diagnostic signal in the topic. Flagged as a decision (OQ-B).
- `terminal_velocity` kept distinct from `acceleration`/`newtons_laws` (the kickoff lists it separately): it has its own misconception cluster and is one of the hardest 6-markers (often 85% scoring zero).
- 12 subtags is more than 6.2's 10, appropriate for the largest topic; none is a thin shell.

---

## 2. Atom groups (the units the dashboard tracks)

Candidate `atom_id`s, grouped by subtag, at the grain where a single wrong answer is diagnostic (d004). Atoms **shared across tiers**, tier carried on the item (d005). HT-only atoms marked **(HT)**.

**forces_basics**
- `scalar_vector_distinction` — scalar has magnitude only; vector has magnitude + direction
- `identify_vector_quantity` — pick the vector from a list (the asked quantity, not the reflex answer)
- `contact_noncontact_classify` — classify a named force as contact or non-contact
- `force_as_interaction` — describe the interaction pair that produces a force
- `vector_arrow_representation` — arrow length = magnitude, arrow direction = force direction

**weight_gravity**
- `weight_calc` — `W=mg` (find W, m, or g)
- `weight_mass_distinction` — weight is a force (N); mass is kg; not interchangeable
- `gfs_dependence` — weight depends on g at the location
- `weight_mass_proportional` — W proportional to m
- `centre_of_mass` — weight acts at the centre of mass; draw the weight arrow from it
- `newtonmeter_read` — read a value off a calibrated spring-balance scale

**resultant_forces**
- `resultant_in_line` — combine collinear forces (add same-direction, subtract opposing)
- `free_body_diagram` **(HT)** — draw/interpret a free-body diagram qualitatively
- `resolve_components` **(HT)** — resolve a force into two perpendicular components (scale diagram)
- `equilibrium_vector_diagram` **(HT)** — use a vector diagram to show equilibrium/resolution

**work_done**
- `work_calc` — `W=Fs`
- `joule_newtonmetre` — 1 J = 1 N m; convert N m <-> J
- `work_energy_transfer` — work done => energy transferred; work against friction => thermal rise

**springs_elasticity**
- `hooke_calc` — `F=ke` (find F, k, or e)
- `spring_constant_calc` — k = F/e in the linear region
- `elastic_inelastic` — distinguish elastic from inelastic deformation
- `linear_nonlinear` — linear vs non-linear force-extension; limit of proportionality
- `epe_calc` — `Ee=1/2 k e^2` (given equation)
- `fe_graph_interpret` — interpret a force-extension graph; gradient = spring constant
- `rp18_force_extension` — RP18 method/analysis (force-extension of a spring)

**motion_descriptors**
- `distance_displacement` — distance scalar; displacement vector (magnitude + direction)
- `speed_velocity` — speed scalar; velocity vector
- `typical_speeds` — recall typical walking/running/cycling speeds; speed of sound ~330 m/s
- `speed_calc` — `s=vt`
- `average_speed` — average speed for non-uniform motion
- `circular_motion_velocity` **(HT)** — constant speed but changing velocity (direction changes)

**motion_graphs**
- `dt_gradient_speed` — gradient of a distance-time graph = speed
- `dt_describe_motion` — read a d-t graph (stationary / constant speed / accelerating)
- `vt_gradient_accel` — gradient of a velocity-time graph = acceleration
- `vt_area_distance` **(HT)** — area under a v-t graph = distance/displacement; count squares
- `dt_tangent_speed` **(HT)** — tangent to a curved d-t graph gives instantaneous speed

**acceleration**
- `accel_calc` — `a=delta-v/t` (with the m/s^2 unit)
- `deceleration` — slowing as negative acceleration
- `suvat_calc` — `v^2-u^2=2as`
- `estimate_accel` — estimate everyday acceleration magnitudes

**newtons_laws**
- `n1_resultant_zero` — constant velocity => resultant force zero (balanced forces)
- `n1_apply` — apply N1 (steady-speed vehicle: driving force = resistive force)
- `n2_calc` — `F=ma`
- `n2_proportionality` — a prop F (fixed m); a prop 1/m (fixed F)
- `n3_equal_opposite` — interaction pairs are equal, opposite, on different objects
- `inertia_concept` **(HT)** — tendency to resist a change in velocity
- `inertial_mass` **(HT)** — inertial mass = ratio force/acceleration
- `rp19_force_mass_accel` — RP19 method/analysis (force, mass, acceleration)

**terminal_velocity**
- `terminal_velocity_concept` — name the constant velocity reached
- `air_resistance_speed` — drag increases with speed
- `terminal_velocity_explain` — force account: weight vs rising drag -> balance -> constant v (the 6-marker)

**stopping_distance**
- `stopping_components` — stopping distance = thinking distance + braking distance
- `reaction_time_factors` — tiredness, drugs, alcohol, distraction
- `thinking_distance_calc` — thinking distance = speed x reaction time (`s=vt`)
- `reaction_time_distinct` — reaction time is a *time*; thinking distance is a *distance*
- `braking_factors` — road/weather conditions and vehicle (brakes/tyres) condition
- `speed_stopping_relationship` — braking distance rises steeply (prop speed^2) with speed; interpret graphs
- `braking_force_energy` — braking does work = KE transferred; estimate braking force **(HT)**

**momentum**
- `momentum_calc` **(HT)** — `p=mv`
- `conservation_qualitative` **(HT)** — total momentum conserved; describe a collision/explosion qualitatively

(~57 atoms across 12 subtags; the largest topic, as expected.)

---

## 3. Misconception slugs

Format follows the ECM `misconceptions.yaml` schema (`slug / topic / label / description`); `topic` uses the subtags above. **NEW_FLAG** = surfaced from the AQA Trilogy bank with examiner-report evidence (proposed explicitly per principle 1 / the brief's boundaries). **[port]** = carried from the 6.2 set / cross-topic calc slugs, valid for Forces.

### NEW_FLAG — surfaced from the AQA Trilogy 6.5 bank

| slug | subtag | trap | evidence (examiner reports) |
|---|---|---|---|
| `vector_defaulted_to_velocity` | forces_basics | when asked which quantity is the vector, answers "velocity" reflexively rather than the asked quantity (displacement/weight) | "30% knew displacement was the vector... most common incorrect response was velocity"; "just under a quarter identified that weight is a vector" |
| `air_resistance_called_noncontact` | forces_basics | classifies air resistance (or friction) as a non-contact force | "the majority thought that air resistance was a non-contact force" |
| `normal_force_unrecognised` | forces_basics | fails to name the normal contact force for an upward support force | "approximately one third knew the upward force... was a normal contact force" |
| `weight_gfs_confused` | weight_gravity | asked how *weight* changes, describes how *gravitational field strength* changes (or vice versa) | "many described how the gravitational field strength changed... asked for a description of how the weight changed" |
| `centre_of_mass_arrow_missing` | weight_gravity | draws the weight arrow not from the centre of mass, or just labels the object "weight" | "vast majority unaware the arrow should be drawn from the centre of mass... just labelled the apple 'weight'" |
| `weight_mass_conflated` | weight_gravity | treats weight and mass as the same quantity / uses kg for weight | recurrent on `W=mg` recall items (only 24% recalled the equation in one sitting) |
| `resultant_added_not_subtracted` | resultant_forces | multiplies or adds opposing forces instead of subtracting to get the resultant | "the majority... just multiplied the two numbers together rather than subtracting them" |
| `used_fma_for_resultant` | resultant_forces | reaches for `F=ma` when the resultant must come from a force balance with no mass/accel given | "had many students attempting to use F=ma which was not possible given the information provided" |
| `resultant_nonzero_at_constant_v` | newtons_laws | thinks the resultant force is non-zero at constant speed | "approximately 40%... knew the resultant force at constant velocity was zero. The most popular incorrect answer was 600 N" |
| `fbd_labelled_not_arrows` | resultant_forces | labels a diagram instead of drawing force arrows; arrows not equal/parallel | "many incorrect answers had labelled the diagram rather than drawn force arrows" |
| `work_nonzero_when_stationary` | work_done | gives non-zero work done when the object does not move | "just over 40% understood that when the man was not moving the work done would be 0 J" |
| `work_used_weight_not_force` | work_done | substitutes `mg` (or a wrong distance) into `W=Fs` instead of the applied force | "incorrect answers... used 9.8 N/kg x 0.63 m" |
| `extension_total_length_used` | springs_elasticity | uses the spring's total length instead of its extension in `F=ke`/`Ee` | "nearly 15% correctly suggested initial and final length should be measured then subtracted" (implies most did not) |
| `used_epe_for_hooke` | springs_elasticity | uses the given `Ee=1/2 k e^2` when `F=ke` was needed (because F=ke must be recalled) | "many could not recall F=ke and tried to use the elastic potential energy equation given on the equation sheet... could not score any marks" |
| `wrong_spring_graph_sketched` | springs_elasticity | sketches a generic curve / copies the previous graph rather than the spring's linear-then-curving line | "copied the sketch graph from the previous page... various curves and squiggles" |
| `speed_velocity_direction_dropped` | motion_descriptors | states "velocity" where constant speed is meant, or gives velocity without direction | "very common to state the velocity was constant, which prevented scoring"; "very few referred to the direction of the stone" |
| `distance_displacement_conflated` | motion_descriptors | treats displacement as a plain distance (drops the direction/straight-line component) | "30% knew displacement was the vector" |
| `extraneous_factor_multiplied` | motion_descriptors | multiplies a correct distance/answer by an irrelevant figure from the stem | "multiplying their answer by 20, which prevented them from scoring any marks" |
| `gradient_described_not_named` | motion_graphs | describes the trend ("distance increases", "the line is steep") instead of naming gradient = speed/acceleration | "fewer than half... only about 10% could recall that the gradient of a distance-time graph represents speed. Many gave descriptions of the distance increasing" |
| `area_under_vt_not_recognised` | motion_graphs | fails to recognise that the area under a v-t graph gives distance | "only a small percentage appreciated they had to determine the area under the graph"; "65%... neither attempted the area" |
| `graph_scale_misread` | motion_graphs | misreads the axis scale or does not read between gridlines | "widespread misreading of the graph... little attempt to read between the grid lines" |
| `gradient_ratio_inverted` | motion_graphs | computes run/rise instead of rise/run | "the most commonly seen incorrect response was 10/2 (the inverse of what was required)" |
| `accel_unit_unknown` | acceleration | cannot give the m/s^2 unit for acceleration | "20% determined the gradient but could not recall the unit for acceleration" |
| `suvat_squared_mishandled` | acceleration | mishandles the `v^2` term (squares the wrong value, leaves v^2 as the answer, or subtracts u^2 from 2as) | "confused by v2=450 and either squared 450, or wrote 450 as their final answer"; "subtracted u2 from 2as" |
| `accel_value_used_as_displacement` | acceleration | substitutes the acceleration value into the displacement slot of `v^2-u^2=2as` | "substituted the value of acceleration as the displacement" |
| `deceleration_sign_confused` | acceleration | treats deceleration as identical to acceleration / drops the sign | "lack of understanding... that deceleration and acceleration..." |
| `n2_acceleration_squared` | newtons_laws | reads "60 m/s^2" as an instruction to square the acceleration | "thought that 60 m/s2 means the acceleration value should be squared" |
| `n2_inverse_stated_as_decreases` | newtons_laws | states "as mass increases acceleration decreases" instead of inversely proportional | "few stated the relationship as inversely proportional, rather... as mass increases acceleration decreases" |
| `n3_confused_with_n1` | newtons_laws | applies N3 equal-and-opposite to a single object to argue the resultant is zero (mixing N1 and N3) | "a large number mixed Newton's first and third laws stating that the cars exert equal and opposite forces... therefore the resultant force is zero" |
| `inertia_term_unknown` | newtons_laws | cannot name inertia | "fewer than 20% correctly answered inertia" |
| `terminal_velocity_named_average` | terminal_velocity | calls the constant velocity "average velocity" | "the most common incorrect answer was average velocity" |
| `terminal_velocity_explained_as_tiring` | terminal_velocity | explains the slowing/constant speed by non-force reasons (getting tired, "it takes time") | "most students just explained why it took time"; "the runner becoming tired" |
| `accel_equated_with_force` | terminal_velocity | equates acceleration with air resistance / a force (a category error) | "describing acceleration as being equal to air resistance" |
| `terminal_velocity_balance_missed` | terminal_velocity | fails to link rising drag = weight => resultant zero => constant velocity | "85% scored zero... most just explained why it slows but not the force balance" |
| `reaction_time_distance_confused` | stopping_distance | conflates reaction time (a time) with thinking distance (a distance) | "do not make the distinction that reaction time is a time and thinking distance is a distance" (flagged across multiple sittings) |
| `stopping_factor_miscategorised` | stopping_distance | attributes braking-distance factors to thinking distance, or vice versa | "incorrect answers referred to factors that would affect thinking distance" on a braking item; "because the brakes were poor, the driver would have to start thinking earlier" |
| `speed_stopping_called_inverse` | stopping_distance | calls the speed-braking/stopping relationship inversely proportional | "inversely proportional was a more popular response" |
| `relationship_stated_vaguely` | stopping_distance | "it increases" without naming/quantifying the relationship | "vague statements such as 'it increases' or 'speed increases the braking distance'" |
| `braking_energy_link_missed` | stopping_distance | fails to link reduced mass/speed -> kinetic energy -> braking distance | "very few students linked that to a greater deceleration or a decrease in kinetic energy" |
| `momentum_not_converted` | momentum | omits a unit conversion (e.g. g->kg) in `p=mv` | "approximately 30%... used the equation correctly but did not carry out the conversion to kg" |
| `conservation_not_applied` | momentum | does not use conservation to reason about post-collision velocity | "fewer than 2% scored full marks... very few attempted to describe what happened to the velocity" |

### Ported from the 6.2 set / cross-topic calc slugs (valid as-is for Forces)

| slug | subtag | trap |
|---|---|---|
| `wrong_formula_rearrangement` | (cross-calc) | rearranged `W=Fs`, `F=ma`, `v^2-u^2=2as`, `F=ke` the wrong way [port] — evidenced: "inability to rearrange the equation, substitution marks were rare" |
| `picked_given_value` | (cross-calc) | answered with a value lifted straight from the stem [port] |
| `power_of_ten_evaluation_error` | (cross-calc) | correct method, place-value slip in the evaluation [port from 6.2] |
| `units_off_by_factor` | (cross-calc) | right number, wrong prefix [port] — subsumed by `prefix_not_converted` below |
| `rounding_mistake` | (cross-calc) | engine-derived near-miss under a rounding regime [port, d032] — evidenced: "2.23 should be rounded to 2" |

### Cross-topic / working-scientifically slugs (propose; owner = Architecture to place per q-ws-taxonomy)

| slug | note |
|---|---|
| `prefix_not_converted` | **The dominant Forces calc error.** 30 `prefix_strip` actions in the tagged slice. Forces instances: **g->kg** (weight: "answer too large by a factor of a thousand"; "only 1% converted grams to kg"), **cm->m** (springs: "only 35% converted the extension to metres" — the signature spring error), **kN->N** (work: "just under 5% successfully converted kN into N"), **km->m** (braking distance). Cross-topic; lives in the shared WS taxonomy, referenced by items. |
| `proportionality_stated_as_increases` | Already proposed for 6.2 (iv_characteristics). **Recurs hard in Forces** — springs ("extension increases as force increases" instead of directly proportional) and stopping distance ("speed increases the braking distance"). Propose **promoting to the shared cross-topic taxonomy** rather than duplicating per subtag. |
| `freehand_line_not_ruled` | WS/graph technique; RP18/RP19 plotting. Evidenced: "lines of best fit were often mistakenly given as straight lines [where a curve was needed]". Shared WS slug. |
| `repeatability_reproducibility_confused` | WS; RP18/RP19 evaluation. Shared WS slug (raised by 6.2; recurs here). |
| `sig_figs_not_applied` | WS/calc; "35% gave the answer correctly to 2 significant figures" recurs. Maps to the `sig_figs` mark category. Shared. |

---

## 4. Calculation vocabulary mapping (Codex six-layer alignment)

Calculation items carry the Codex tagging so the grader classifies an attempt (principle 1). The 6.5 formula codes (from `formula_catalogue`), with the recall-vs-insert flag the brief demands (principle 6):

| Codex code | Equation | subtag | On 2023 insert? | Pre-Covid insert? | Recall status |
|---|---|---|---|---|---|
| `FORMULA.WEIGHT` | W = mg | weight_gravity | yes | no | recall once insert reverts |
| `FORMULA.WORK_FS` | W = Fs | work_done | yes | no | recall once insert reverts |
| `FORMULA.HOOKE` | F = ke | springs_elasticity | yes | no | recall once insert reverts |
| `FORMULA.EPE_ELASTIC` | Ee = 1/2 k e^2 | springs_elasticity | yes | **yes** | **always given (select-and-apply)** |
| `FORMULA.DISTANCE_VT` | s = vt | motion_descriptors | yes | no | recall once insert reverts |
| `FORMULA.ACCEL` | a = delta-v/t | acceleration | yes | no | recall once insert reverts |
| `FORMULA.V2_U2_2AS` | v^2 - u^2 = 2as | acceleration | yes | **yes** | **always given (select-and-apply)** |
| `FORMULA.NEWTON2` | F = ma | newtons_laws | yes | no | recall once insert reverts |
| `FORMULA.MOMENTUM` | p = mv (HT) | momentum | yes | no | recall once insert reverts |
| `RELATION.STOPPING_DISTANCE` | stopping = thinking + braking | stopping_distance | n/a | n/a | always recall (qualitative sum) |
| `INTERPRET.GRADIENT_DT_IS_SPEED` | graph | motion_graphs | — | — | technique, not given |
| `INTERPRET.GRADIENT_VT_IS_ACCELERATION` | graph | motion_graphs | — | — | technique |
| `INTERPRET.AREA_VT_IS_DISPLACEMENT` | graph (HT) | motion_graphs | — | — | technique |
| `INTERPRET.GRADIENT_FE_IS_SPRING_CONSTANT` | graph | springs_elasticity | — | — | technique |
| `METHOD.GRADIENT_OF_STRAIGHT_LINE` / `METHOD.COUNT_SQUARES` / `METHOD.TANGENT_RISE_OVER_RUN` | graph method | motion_graphs | — | — | technique |
| `FORMULA.KE` / `FORMULA.GPE` | 1/2 m v^2 / mgh | *(Energy 6.1)* | yes / yes | no / no | cross-topic; invoked in braking/work items (OQ-D) |

`calc_workings` items should expose, per mark, the Codex Layer-5 categories the Forces bank actually uses (frequencies from the tagged slice): `substitution` (113), `evaluation` (89), `rearrangement` (46), **`non_final_evaluation` (43)**, `equation_quoted` (19), `prefix_conv` (10), `unit` (5), `sig_figs` (5), `substitution_and_rearrangement` (2), `evaluation_with_conclusion` (2).

Two structural features distinguish Forces calc from 6.2:
- **Multi-stage chains are the norm** (`non_final_evaluation` x43, `ecf_allowed` x35). The classic shapes: graph read-off -> formula; delta-v -> `a=delta-v/t` -> distance; speed -> stopping distance; `v^2-u^2=2as` then `F=ma`. See OQ-A — this is the qtype question.
- **ECF is mostly *allowed*, not gated.** `gate_kind` in the tagged slice is `ecf_allowed` x35 vs `no_ecf_gating` x4. AQA's harsh "no further marks unless equation X used" gate is rarer in Forces than the brief's once-per-Higher-paper would suggest for the tagged sittings — model genuine ECF chains via `gate:{kind:"from_previous_part"}`; do not manufacture hard anti-ECF gates.

**Deliberately excluded from calc authoring** (see Scope): two-body momentum-collision algebra, `F=delta-p/t`, terminal-velocity v-t graph drawing.

---

## 5. Question-type constraints and NEW_QTYPE proposals

Author only what the engine grades now — `mcq`, `mcq_multi`, `short`, `calc_workings`. Coverage Forces needs beyond those, proposed for you to coordinate:

- **OQ-A / multi-stage calculation — the central one.** Forces' defining calc shape is multi-stage. Does the locked 4-line `calc_workings` chain across stages (each stage its own equation/sub/rearrange/eval block, linked by `gate:{kind:"from_previous_part"}` with ECF), or do we need a `calc_workings_multistage` variant? I can author single-stage forces calcs immediately (`W=mg`, `F=ke`, `s=vt`, `F=ma`, `a=delta-v/t`, single-step `v^2-u^2=2as`) and hold the chained ones (speed->stopping, delta-v->a->distance, mass-from-braking-graph) until you rule. **This is the blocker for ~40% of the forces calc bank.**

- **`level_of_response_6` (already staged, d023).** Forces is dense with 6-markers: the terminal-velocity force-balance explanation, stopping-distance/braking evaluations, RP18/RP19 method descriptions, the "explain the motion" extended responses. Author as selectable claim-points against the level descriptors until an LLM grader lands. I can build the claim-point banks now.

- **Free-body / vector diagrams — propose NEW_QTYPE `fbd_vector_draw` (staged).** Resultant-force FBDs (6.5.1.4) and HT resolution/equilibrium scale-vector diagrams need a drawing/placement input surface, like `circuit_draw`. **Interim form available now (d023):** MCQ "which free-body diagram is correct?" / "which vector diagram shows the resultant?" using the Widgets `free_body_diagram`, `ramp_fbd`, and `vector_addition` distractor variants. The `fbd_labelled_not_arrows` and `resultant_added_not_subtracted` misconceptions are gradable through those distractors now; true drawing/scale-diagram scoring is the staged piece (depends on Widgets interactive + Housing).

- **Motion & force-extension graphs — `graph_sketch` (already staged) + interactive read-off.** Pick-the-correct-graph and read-off items work now as `mcq` over the `motion_graph` / `braking_vt` / `spring_extension` widget variants. The `gradient_tool` and `area_under_vt` interactive read-offs (gradient = speed/accel; area = distance by counting squares) need Housing grading — coordinate any item needing a live read-off through you (kickoff instruction). The `gradient_described_not_named`, `area_under_vt_not_recognised`, `graph_scale_misread`, and `gradient_ratio_inverted` misconceptions all attach to these.

No new `mcq`/`short` machinery is needed; the four NEW_QTYPE/staged items above are `level_of_response_6` (exists, staged), `fbd_vector_draw` (new), plus the already-staged `graph_sketch` reused for force-extension and motion graphs.

---

## 6. Open questions for Architecture / Smith

- **OQ-A (blocking):** Multi-stage `calc_workings` — chain the existing 4-line type via `gate:from_previous_part`, or mint a multi-stage variant? Biggest decision; gates ~40% of the forces calc bank.
- **OQ-B:** Three motion subtags (`motion_descriptors` / `motion_graphs` / `acceleration`) vs folding — I argue split, on the diagnostic evidence. Confirm.
- **OQ-C:** Confirm the three Physics-only exclusions (terminal-velocity v-t drawing, momentum-collision calculation, `F=delta-p/t`/momentum-safety) are out of Trilogy scope. Bank supports exclusion (0 tag rows each).
- **OQ-D:** Cross-topic KE/GPE — braking-energy and work-energy forces items invoke `1/2 m v^2` and `mgh`, whose atoms belong to Energy 6.1. Should forces items reference 6.1 atoms via `atomMap`, or do we mint forces-local duplicates? (Prefer referencing 6.1 to avoid divergence.)
- **OQ-E:** Greenlight `fbd_vector_draw` as a staged NEW_QTYPE (interim MCQ form ready now)?
- **OQ-F:** Promote `proportionality_stated_as_increases` to the shared cross-topic/WS taxonomy (it now spans 6.2 iv, springs, and stopping distance)?
- **OQ-G:** Sequencing note (not blocking): once the insert reverts, seven of nine forces equations become must-recall; only `Ee=1/2 k e^2` and `v^2-u^2=2as` stay given. Same difficulty cliff 6.2 flagged for `V=IR`.

Pushback welcomed on any of this. On ratification I will author by subtag, two-pass, reporting each batch as `review/<subtag>.md`.
