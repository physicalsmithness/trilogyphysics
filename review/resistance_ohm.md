# Batch review: resistance_ohm + charge_current (calibration sample)

From: 6.2 Authoring chat. To: Architecture. Date: 2026-06-08.
Status: CALIBRATION SAMPLE for review, not yet wired into `app/topics/electricity_6_2.js`.

This is the first authored batch, deliberately small (10 items) to test the ratified vocabulary against real items and surface schema friction before I scale. It covers `resistance_ohm` (V=IR, R as definition) and `charge_current` (Q=It, current as rate of charge). Every item is written to the **exact engine item schema** in `app/topics/electricity_6_2.js` / `app/calc_workings.js`, so it can drop straight into `CONFIG.items` if you approve the shape.

Two-pass provenance: the calc items mirror real AQA mark-scheme shapes mined from the bank (the 450 mA → 0.45 A conversion 4-marker at 6.2.1.3.c; the clean 3-marker V=IR; the Q=It 2-markers at 6.2.1.2.b). The distractors and the power-of-ten item are seeded from examiner-report pain points ("typically a power of ten error, 3.0/2000 = 1.5 V common").

---

## A. The items (engine schema, ready to paste)

```js
// resistance_ohm + charge_current — calibration batch v1 (10 items)
[
  // ---- calc_workings: V = IR family ----
  {
    id: "ohm_vir_clean_01", qtype: "calc_workings", tier: "both",
    atom: "ohm_law_calc", syllabus: "6.2.1.3.c",
    prompt: "The current in a filament lamp is 1.5 A when the potential difference across it is 12 V. Calculate the resistance of the filament lamp.\nUse the equation: potential difference = current × resistance",
    explanation: "Rearrange V = IR to R = V / I. R = 12 / 1.5 = 8 Ω.",
    calc: {
      knowns: { V: 12, I: 1.5 }, unknown: "R",
      equationCanonicalForms: ["V=I*R", "R=V/I"],
      expectedFinalValue: 8, expectedUnit: ["Ω", "ohm", "ohms"],
      requireUnit: true, marks: 3
    }
  },
  {
    id: "ohm_vir_prefix_02", qtype: "calc_workings", tier: "both",
    atom: "ohm_law_calc", syllabus: "6.2.1.3.c",
    prompt: "When the reading on the ammeter is 450 mA, the reading on the voltmeter is 2.7 V. Calculate the resistance of the resistor.\nUse the equation: potential difference = current × resistance",
    explanation: "Convert 450 mA to 0.45 A first, then R = V / I = 2.7 / 0.45 = 6 Ω. The conversion is the mark most often lost here.",
    calc: {
      knowns: { V: 2.7, I: 0.45 }, unknown: "R",
      equationCanonicalForms: ["V=I*R", "R=V/I"],
      expectedFinalValue: 6, expectedUnit: ["Ω", "ohm", "ohms"],
      requireUnit: true, marks: 4
    }
  },
  {
    id: "ohm_findV_03", qtype: "calc_workings", tier: "both",
    atom: "ohm_law_calc", syllabus: "6.2.1.3.c",
    prompt: "A resistor of resistance 15 Ω carries a current of 0.20 A. Calculate the potential difference across the resistor.\nUse the equation: potential difference = current × resistance",
    explanation: "V = IR = 0.20 × 15 = 3.0 V. No rearrangement needed.",
    calc: {
      knowns: { I: 0.20, R: 15 }, unknown: "V",
      equationCanonicalForms: ["V=I*R"],
      expectedFinalValue: 3.0, expectedUnit: ["V", "volt", "volts"],
      requireUnit: true, marks: 3
    }
  },
  {
    id: "ohm_findI_poweroften_04", qtype: "calc_workings", tier: "higher",
    atom: "ohm_law_calc", syllabus: "6.2.1.3.c",
    prompt: "The potential difference across a resistor is 6.0 V and its resistance is 2000 Ω. Calculate the current in the resistor.\nUse the equation: potential difference = current × resistance",
    explanation: "Rearrange to I = V / R = 6.0 / 2000 = 0.003 A (3 mA). The common slip is a power-of-ten error giving 3 or 0.3.",
    calc: {
      knowns: { V: 6.0, R: 2000 }, unknown: "I",
      equationCanonicalForms: ["V=I*R", "I=V/R"],
      expectedFinalValue: 0.003, expectedUnit: ["A", "amp", "amps", "ampere"],
      tolerance: 0.0000001, requireUnit: true, marks: 3
    }
  },

  // ---- calc_workings: Q = It family ----
  {
    id: "charge_qit_clean_05", qtype: "calc_workings", tier: "both",
    atom: "charge_flow_calc", syllabus: "6.2.1.2.b",
    prompt: "There is a current of 1.5 A in a filament lamp for a time of 30 s. Calculate the charge flow in the filament lamp.\nUse the equation: charge flow = current × time",
    explanation: "Q = It = 1.5 × 30 = 45 C.",
    calc: {
      knowns: { I: 1.5, t: 30 }, unknown: "Q",
      equationCanonicalForms: ["Q=I*t"],
      expectedFinalValue: 45, expectedUnit: ["C", "coulomb", "coulombs"],
      requireUnit: true, marks: 2
    }
  },
  {
    id: "charge_qit_findI_06", qtype: "calc_workings", tier: "both",
    atom: "charge_flow_calc", syllabus: "6.2.1.2.b",
    prompt: "A charge of 60 C flows through a lamp in 40 s. Calculate the current in the lamp.\nUse the equation: charge flow = current × time",
    explanation: "Rearrange Q = It to I = Q / t = 60 / 40 = 1.5 A.",
    calc: {
      knowns: { Q: 60, t: 40 }, unknown: "I",
      equationCanonicalForms: ["Q=I*t", "I=Q/t"],
      expectedFinalValue: 1.5, expectedUnit: ["A", "amp", "amps", "ampere"],
      requireUnit: true, marks: 3
    }
  },

  // ---- MCQ / tick-box / short ----
  {
    id: "ohm_rearrange_mcq_07", qtype: "mcq_single", tier: "both",
    atom: "ohm_law_calc", syllabus: "6.2.1.3.c",
    prompt: "A component has a current of 0.50 A through it and a potential difference of 6.0 V across it. Which calculation gives its resistance?",
    explanation: "R = V / I = 6.0 / 0.50 = 12 Ω.",
    distractors: [
      { id: "a", text: "6.0 ÷ 0.50 = 12 Ω", status: "correct" },
      { id: "b", text: "0.50 ÷ 6.0 = 0.083 Ω", status: "wrong", misconception: "wrong_formula_rearrangement" },
      { id: "c", text: "6.0 × 0.50 = 3.0 Ω", status: "wrong", misconception: "wrong_formula_rearrangement" },
      { id: "d", text: "6.0 Ω (the pd value)", status: "wrong", misconception: "picked_given_value" }
    ]
  },
  {
    id: "ohm_definition_mcq_08", qtype: "mcq_single", tier: "higher",
    atom: "resistance_definition", syllabus: "6.2.1.3.a",
    prompt: "Which statement best describes the relationship R = V / I?",
    explanation: "R = V / I is the definition of resistance and holds for any component. Ohm's law is the stronger claim that R stays constant as V changes, at constant temperature.",
    distractors: [
      { id: "a", text: "It defines the resistance of a component, and holds for any component", status: "correct" },
      { id: "b", text: "It is Ohm's law, and only holds when the resistance is constant", status: "wrong", misconception: "confused_definition_with_law" },
      { id: "c", text: "It only holds for components in series", status: "wrong", misconception: "topology_indifferent_assumption" },
      { id: "d", text: "It shows that current is used up inside the component", status: "wrong", misconception: "current_consumed_at_components" }
    ]
  },
  {
    id: "current_rate_mcq_09", qtype: "mcq_single", tier: "foundation",
    atom: "current_as_rate", syllabus: "6.2.1.2.a",
    prompt: "What does an electric current of 2 A mean?",
    explanation: "Current is the rate of flow of charge: 2 A means 2 coulombs of charge pass a point each second.",
    distractors: [
      { id: "a", text: "2 coulombs of charge pass a point each second", status: "correct" },
      { id: "b", text: "2 coulombs of charge are stored in the wire", status: "wrong", misconception: "current_consumed_at_components" },
      { id: "c", text: "2 volts are pushed through the wire each second", status: "wrong", misconception: "confused_v_and_i" },
      { id: "d", text: "the wire has a resistance of 2 ohms", status: "wrong", misconception: "confused_v_and_i" }
    ]
  },
  {
    id: "charge_qit_multi_10", qtype: "mcq_multi", tier: "both",
    atom: "charge_flow_calc", syllabus: "6.2.1.2.b",
    prompt: "A constant current flows through a lamp. Using charge flow = current × time, which statements are correct?",
    explanation: "Charge is measured in coulombs; at constant current, doubling the time doubles the charge; a larger current moves more charge in the same time. Current is not 'used up'.",
    distractors: [
      { id: "a", text: "Charge flow is measured in coulombs", status: "correct" },
      { id: "b", text: "Doubling the time doubles the charge that flows", status: "correct" },
      { id: "c", text: "A larger current moves more charge in the same time", status: "correct" },
      { id: "d", text: "Less charge leaves the lamp than enters it, because current is used up", status: "wrong", misconception: "current_consumed_at_components" }
    ]
  }
]
```

---

## B. Companion Codex six-layer tagging (for the calc items)

The engine item schema has **no slot** for the Codex calculation tags, so I carry them here. This is the first schema-friction finding (see section D). Layer 5 mark categories follow the real mark schemes.

| id | shape | formula code | number sources | unit handling | mark categories (per mark) | ECF |
|---|---|---|---|---|---|---|
| ohm_vir_clean_01 | single_formula | FORMULA.OHM | V direct, I direct | none | substitution, evaluation, unit | no_ecf_gating |
| ohm_vir_prefix_02 | single_formula | FORMULA.OHM | V direct, I prefix_strip (mA→A) | prefix_strip (milli on A) | prefix_conv, substitution, evaluation, unit | ecf_allowed (MS: subsequent marks on unconverted value) |
| ohm_findV_03 | single_formula | FORMULA.OHM | I direct, R direct | none | substitution, evaluation, unit | no_ecf_gating |
| ohm_findI_poweroften_04 | single_formula | FORMULA.OHM | V direct, R direct | (answer small; mA option) | rearrangement, evaluation, unit | no_ecf_gating |
| charge_qit_clean_05 | single_formula | FORMULA.CHARGE_IT | I direct, t direct | none | substitution, evaluation | no_ecf_gating |
| charge_qit_findI_06 | single_formula | FORMULA.CHARGE_IT | Q direct, t direct | none | rearrangement, substitution, evaluation | no_ecf_gating |

---

## C. ERROR_TYPES → misconception-slug crosswalk

The `calc_workings` grader auto-derives per-line `ERROR_TYPES` (in `calc_workings.js`). For the per-atom dashboard (d004) and principle-1 analytics to speak in our vocabulary, the engine's auto codes need mapping to our slugs. Proposed crosswalk for this batch's formulae:

| grader ERROR_TYPE | our misconception slug | when it fires |
|---|---|---|
| `concept_swap` / `property_value_swap` | `confused_v_and_i` | substituted V where I was needed, etc. |
| `algebra_error` / `rearrange_not_isolated` | `wrong_formula_rearrangement` | line-3 rearrangement wrong |
| `magnitude_wrong` | `power_of_ten_evaluation_error` (or `prefix_not_converted` if traced to the input) | answer off by a power of ten |
| `value_wrong` (within rounding band) | `rounding_mistake` | near-miss under a rounding regime |
| `unit_missing` / `unit_wrong` / `unit_wrong_case` | (unit-mark loss; no separate slug needed) | the "give the unit" mark |

Recommend the engine expose this mapping as a table it reads, so the crosswalk is data not code. Flagging for Housing.

---

## D. Findings and proposals for Architecture

1. **NEW: schema has no slot for Codex calc tags.** Items carry `atom` and a single `syllabus` code, but there is nowhere to record formula code, number sources, unit handling, mark categories, or ECF gate (the d003/d016 calc vocabulary). Proposed: an optional `calc.codex: { formula, sources[], unit_actions[], mark_categories[], ecf }` block. Without it, the principle-1 "classify the attempt" promise is only half-served (the grader derives error types live, but the static tagging that powers coverage analytics is homeless).

2. **NEW: no per-distractor misconception crosswalk for calc_workings.** MCQ items pin `misconception` per distractor; calc items rely on auto ERROR_TYPES. The crosswalk in section C closes the gap but needs an owner (proposing Housing wires it; Architecture ratifies the mapping).

3. **`syllabus` is a single finest code (good, matches d021).** I used `.c` / `.a` / `.b` leaf codes. Confirm leaf-level is what you want rather than the 6.2.1.3 parent.

4. **No item-level `subtag` field.** The ratified subtags (`resistance_ohm`, `charge_current`) currently have nowhere to live except by overloading `atom`. Proposed: add `subtag` to the item schema so the dashboard can group atoms under sub-topics. Minor, but it is the grouping layer the proposal is built on.

5. **Board is topic-level only.** `CONFIG.board = "AQA Trilogy 8464"` covers every item; items do not carry board. Fine for a single-board topic, but principle 6 wants board per item for the cross-board future. Flagging, not urgent.

6. **`atom` registry in `electricity_6_2.js` is the old provisional list** (`calc_vir`, `series`, `mixed`, etc.). On ratification it should be replaced with the proposal's atom slugs (`ohm_law_calc`, `charge_flow_calc`, ...). These calibration items already use the new slugs, so the config and the items must be updated together.

## E. Calibration notes (what felt right / awkward)

- The `calc_workings` four-line model fits Trilogy's calc core cleanly; the prefix item (02) is exactly where the marks-the-method grader earns its keep, since a student who fumbles the mA→A conversion still scores the substitution and rearrangement lines, mirroring AQA's ECF allowance on that part.
- `requireUnit: true` plus a generous `expectedUnit` list reproduces AQA's independent unit mark and its "allow ohms" leniency well.
- Awkward: item 04's answer (0.003 A) invites a unit-prefix answer (3 mA). The grader checks one `expectedFinalValue`; if we want to *also* accept "3 mA", the contract needs either a prefixed-equivalent acceptor or we pin the expected unit to A and treat mA as a unit-mark issue. Flagged in finding 1.
- I held to the four ratified qtypes only. No NEW_QTYPE or NEW_FLAG surfaced in this batch (the new flags all live in `iv_characteristics` / `series_parallel` / mains, which I will reach in later batches).

On your nod to the item shape and findings 1 and 4, I will wire this batch into `electricity_6_2.js`, swap the provisional atom registry for the ratified one, and move to `iv_characteristics` (the richest misconception territory).
