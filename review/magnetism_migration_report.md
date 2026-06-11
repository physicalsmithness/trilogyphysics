# Magnetism 6.7 migration report (Housing, generated)

Source: `7_Magnetism/questions.js` (legacy `window.TRILOGY_MAGEM_QUIZ_QUESTIONS`).
Output: `app/topics/magnetism_6_7.generated.js` (SCHEMA v1.0 TOPIC_CONFIG for 6.7).

**162 items migrated.**

## By qtype

- mcq: 120
- short: 21
- calc_workings: 21

## By provisional subtag

- motor_effect: 29
- magnetic_fields: 21
- magnets_poles: 69
- electromagnetism: 43

## What is mechanical vs needs Authoring judgment

Mechanical (filled): qtype, choices, answerIndex (already index-based), markPoints (already {any:[...]}), difficulty (easy/med/hard -> d1/d2/d3), explanation, marks.

Needs Authoring judgment (flagged per item under `_authoring.needs`):
- **tier**: every item defaulted to `FH`; set F / H / FH (motor-effect / induced-potential leanings).
- **syllabus_codes**: empty; set the finest 6.7 v3 code (review/SYLLABUS_6_7.md).
- **per_distractor_misconception_id**: MCQ distractors carry no slug yet; tag the diagnostic ones (d004).
- **confirm_subtag_atoms**: the tag->subtag map and the legacy-tag atoms are provisional; a ratified 6.7 vocabulary proposal supersedes them.

## Near-duplicate groups (legacy padding; Authoring may cull)

- 4 copies: mag_poles_pair_1, mag_poles_pair_7, mag_poles_pair_9, mag_poles_pair_16
- 7 copies: mag_poles_pair_2, mag_poles_pair_6, mag_poles_pair_12, mag_poles_pair_13, mag_poles_pair_15, mag_poles_pair_17, mag_poles_pair_24
- 7 copies: mag_poles_pair_3, mag_poles_pair_4, mag_poles_pair_5, mag_poles_pair_8, mag_poles_pair_14, mag_poles_pair_18, mag_poles_pair_21
- 6 copies: mag_poles_pair_10, mag_poles_pair_11, mag_poles_pair_19, mag_poles_pair_20, mag_poles_pair_22, mag_poles_pair_23
- 8 copies: mag_wire_dir_1, mag_wire_dir_3, mag_wire_dir_5, mag_wire_dir_7, mag_wire_dir_9, mag_wire_dir_11, mag_wire_dir_13, mag_wire_dir_15
- 7 copies: mag_wire_dir_2, mag_wire_dir_4, mag_wire_dir_6, mag_wire_dir_8, mag_wire_dir_10, mag_wire_dir_12, mag_wire_dir_14
- 15 copies: mag_solenoid_strength_1, mag_solenoid_strength_2, mag_solenoid_strength_3, mag_solenoid_strength_4, mag_solenoid_strength_5, mag_solenoid_strength_6, mag_solenoid_strength_7, mag_solenoid_strength_8, mag_solenoid_strength_9, mag_solenoid_strength_10, mag_solenoid_strength_11, mag_solenoid_strength_12, mag_solenoid_strength_13, mag_solenoid_strength_14, mag_solenoid_strength_15
- 6 copies: mag_flhr_case_1, mag_flhr_case_7, mag_flhr_case_8, mag_flhr_case_9, mag_flhr_case_13, mag_flhr_case_17
- 5 copies: mag_flhr_case_2, mag_flhr_case_6, mag_flhr_case_11, mag_flhr_case_12, mag_flhr_case_15
- 3 copies: mag_flhr_case_3, mag_flhr_case_10, mag_flhr_case_19
- 4 copies: mag_flhr_case_4, mag_flhr_case_14, mag_flhr_case_18, mag_flhr_case_20
- 2 copies: mag_flhr_case_5, mag_flhr_case_16

## Provisional tag -> subtag map used

- `poles` -> magnets_poles
- `induced` -> magnets_poles
- `fields` -> magnetic_fields
- `compass` -> magnetic_fields
- `plotting` -> magnetic_fields
- `wirefield` -> electromagnetism
- `solenoid` -> electromagnetism
- `bil` -> motor_effect
- `motoreffect` -> motor_effect
- `units` -> motor_effect
