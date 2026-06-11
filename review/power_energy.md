# Batch review: power_electrical + energy_appliances (calibration sample, batch 4)

From: 6.2 Authoring chat. To: Architecture. Date: 2026-06-08.
Status: CALIBRATION SAMPLE for review, not yet wired into `app/topics/electricity_6_2.js`.

Twelve items across two sub-topics: `power_electrical` (P=VI, P=I²R, power rating) and `energy_appliances` (E=Pt, E=QV, appliance energy reasoning). Atoms: `power_vi_calc`, `power_i2r_calc`, `power_rating_interpret`, `energy_pt_calc`, `energy_qv_calc`, `appliance_energy_reasoning`.

**Consistency with the Forces seat's calc-grader findings.** Before authoring I checked `calc_workings.js` and the 6.5 review notes. The grader's expression evaluator supports only `+ - * /` and implicit multiplication, with single-character case-folded symbols; the Forces seat filed three constraints (prefix conversion not separately gradable; multi-letter symbols collide; no `^` operator) and authors squared/prefix calcs as MCQs tagged `interim_for`. I follow that pattern exactly: products and quotients (P=VI, E=Pt, E=QV) are `calc_workings`; **P=I²R is an MCQ** (it needs `^`), as are the prefix items. No new constraint this batch, just the same three biting electricity's only squared formula.

Two-pass provenance: calc items 02, 03, 04, 06 and MCQ 08 mirror real AQA mark schemes (2100 W / 230 V -> 9.1 A; 200 000 W x 300 s; 460 000 J / 250 s -> 1840 W; the 500 mA / 640 Ω -> 160 W whisk; the electron-across-a-cell E=QV). MCQ 07, 09, 12 are retagged ECM `bcf` items.

---

## A. The items (engine schema, ready to paste)

```js
// power_electrical + energy_appliances — calibration batch v1 (12 items)
[
  // ---- calc_workings: grader-safe products / quotients ----
  {
    id: "pw_vi_find_P_01", qtype: "calc_workings", tier: "both",
    atom: "power_vi_calc", syllabus: "6.2.4.1", _src: "ECM bcf_005 (as calc)",
    prompt: "An electric kettle is connected to the 230 V mains supply. The current in the heating element is 9.0 A. Calculate the power of the heating element.\nUse the equation: power = potential difference × current",
    explanation: "P = VI = 230 × 9.0 = 2070 W.",
    calc: {
      knowns: { V: 230, I: 9.0 }, unknown: "P",
      equationCanonicalForms: ["P=V*I"],
      expectedFinalValue: 2070, expectedUnit: ["W", "watt", "watts"],
      requireUnit: true, marks: 3
    }
  },
  {
    id: "pw_vi_find_I_02", qtype: "calc_workings", tier: "higher",
    atom: "power_vi_calc", syllabus: "6.2.6.1.a",
    prompt: "The power of the heating element in a kettle is 2100 W. The potential difference across it is 230 V. Calculate the current in the heating element.\nUse the equation: power = potential difference × current",
    explanation: "Rearrange P = VI to I = P / V = 2100 / 230 = 9.13 A, which rounds to 9.1 A.",
    calc: {
      knowns: { P: 2100, V: 230 }, unknown: "I",
      equationCanonicalForms: ["P=V*I", "I=P/V"],
      expectedFinalValue: 9.13, tolerance: 0.05, expectedUnit: ["A", "amp", "amps", "ampere"],
      requireUnit: true, marks: 4
    }
  },
  {
    id: "en_pt_find_E_03", qtype: "calc_workings", tier: "both",
    atom: "energy_pt_calc", syllabus: "6.2.6.2.e",
    prompt: "A wind turbine generates 200 000 W of electrical power for a time of 300 s. Calculate the energy transferred.\nUse the equation: energy transferred = power × time",
    explanation: "E = Pt = 200 000 × 300 = 60 000 000 J (6.0 × 10⁷ J).",
    calc: {
      knowns: { P: 200000, t: 300 }, unknown: "E",
      equationCanonicalForms: ["E=P*t"],
      expectedFinalValue: 60000000, expectedUnit: ["J", "joule", "joules"],
      requireUnit: true, marks: 2
    }
  },
  {
    id: "en_pt_find_P_04", qtype: "calc_workings", tier: "both",
    atom: "energy_pt_calc", syllabus: "6.2.6.2.e",
    prompt: "A hairdryer transfers 460 000 J of energy in 250 s. Calculate the power of the hairdryer.\nUse the equation: power = energy transferred / time",
    explanation: "P = E / t = 460 000 / 250 = 1840 W.",
    calc: {
      knowns: { E: 460000, t: 250 }, unknown: "P",
      equationCanonicalForms: ["P=E/t", "E=P*t"],
      expectedFinalValue: 1840, expectedUnit: ["W", "watt", "watts"],
      requireUnit: true, marks: 2
    }
  },
  {
    id: "en_qv_find_E_05", qtype: "calc_workings", tier: "both",
    atom: "energy_qv_calc", syllabus: "6.2.4.2",
    prompt: "A 12 V battery moves 50 C of charge through a circuit. Calculate the energy transferred to the charge.\nUse the equation: energy transferred = charge × potential difference",
    explanation: "E = QV = 50 × 12 = 600 J.",
    calc: {
      knowns: { Q: 50, V: 12 }, unknown: "E",
      equationCanonicalForms: ["E=Q*V"],
      expectedFinalValue: 600, expectedUnit: ["J", "joule", "joules"],
      requireUnit: true, marks: 2
    }
  },
  {
    id: "en_qv_find_V_stdform_06", qtype: "calc_workings", tier: "higher",
    atom: "energy_qv_calc", syllabus: "6.2.4.2", _src: "ECM bcf_011",
    prompt: "When an electron crosses the terminals of a cell it gains 4.8 × 10⁻¹⁹ J of energy. The electron carries a charge of 1.6 × 10⁻¹⁹ C. Calculate the potential difference across the cell.\nUse the equation: energy transferred = charge × potential difference",
    explanation: "Rearrange E = QV to V = E / Q = (4.8 × 10⁻¹⁹) / (1.6 × 10⁻¹⁹) = 3.0 V. The powers of ten cancel.",
    calc: {
      knowns: { E: 4.8e-19, Q: 1.6e-19 }, unknown: "V",
      equationCanonicalForms: ["E=Q*V", "V=E/Q"],
      expectedFinalValue: 3.0, tolerance: 0.01, expectedUnit: ["V", "volt", "volts"],
      requireUnit: true, marks: 3
    }
  },

  // ---- MCQ: power = VI (numeric + rearrangement) ----
  {
    id: "pw_vi_mcq_07", qtype: "mcq_single", tier: "both",
    atom: "power_vi_calc", syllabus: "6.2.4.1", _src: "ECM bcf_005",
    prompt: "An electric kettle is connected to the 230 V mains. The current in the heating element is 9.0 A. What is the power of the heating element?",
    explanation: "P = VI = 230 × 9.0 = 2070 W.",
    distractors: [
      { id: "a", text: "2070 W", status: "correct" },
      { id: "b", text: "25.6 W", status: "wrong", misconception: "wrong_formula_rearrangement" },
      { id: "c", text: "0.039 W", status: "wrong", misconception: "wrong_formula_rearrangement" },
      { id: "d", text: "52 900 W", status: "wrong", misconception: "treated_I_as_V" }
    ]
  },
  {
    id: "pw_vi_find_I_mcq_08", qtype: "mcq_single", tier: "both",
    atom: "power_vi_calc", syllabus: "6.2.4.1", _src: "ECM bcf_012",
    prompt: "A 230 V supply delivers 1840 W of power to a heater. What is the current in the heater?",
    explanation: "Rearrange P = VI to I = P / V = 1840 / 230 = 8.0 A.",
    distractors: [
      { id: "a", text: "8.0 A", status: "correct" },
      { id: "b", text: "423 200 A", status: "wrong", misconception: "wrong_formula_rearrangement" },
      { id: "c", text: "0.125 A", status: "wrong", misconception: "wrong_formula_rearrangement" },
      { id: "d", text: "1840 A", status: "wrong", misconception: "picked_given_value" }
    ]
  },

  // ---- MCQ: power = I^2 R (interim: needs ^ operator and prefix, both calc-grader gaps) ----
  {
    id: "pw_i2r_prefix_mcq_09", qtype: "mcq_single", tier: "higher",
    atom: "power_i2r_calc", syllabus: "6.2.6.1.a",
    _interim_for: "calc_workings (blocked by calc-grader gaps: ^ operator + prefix conversion)",
    prompt: "The current in a whisk is 500 mA. The resistance of the whisk is 640 Ω. Calculate the power of the whisk.\nUse the equation: power = (current)² × resistance",
    explanation: "Convert 500 mA to 0.50 A, then P = I²R = 0.50² × 640 = 160 W.",
    distractors: [
      { id: "a", text: "160 W", status: "correct" },
      { id: "b", text: "320 W", status: "wrong", misconception: "forgot_to_square_in_power" },
      { id: "c", text: "160 000 000 W", status: "wrong", misconception: "prefix_not_converted" },
      { id: "d", text: "204 800 W", status: "wrong", misconception: "swapped_factor_in_squared" }
    ]
  },
  {
    id: "pw_i2r_series_qual_mcq_10", qtype: "mcq_single", tier: "higher",
    atom: "power_i2r_calc", syllabus: "6.2.6.1.a", _src: "ECM bcf_006",
    prompt: "A 2 Ω resistor and a 6 Ω resistor are connected in series across a battery. Which resistor dissipates more power?",
    explanation: "In series the current is the same through both, so by P = I²R the larger resistance dissipates more power: the 6 Ω resistor.",
    distractors: [
      { id: "a", text: "The 6 Ω resistor", status: "correct" },
      { id: "b", text: "The 2 Ω resistor", status: "wrong" },
      { id: "c", text: "Both dissipate equal power", status: "wrong", misconception: "topology_indifferent_assumption" },
      { id: "d", text: "It cannot be determined without the battery voltage", status: "wrong", misconception: "qualitative_inference_doubted" }
    ]
  },

  // ---- MCQ: interpret power rating + appliance energy reasoning ----
  {
    id: "pw_rating_interpret_mcq_11", qtype: "mcq_single", tier: "both",
    atom: "power_rating_interpret", syllabus: "6.2.6.1.a",
    prompt: "An appliance has a power rating of 2000 W. What does this tell you?",
    explanation: "Power is energy per second, so a 2000 W appliance transfers 2000 J of energy each second.",
    distractors: [
      { id: "a", text: "It transfers 2000 J of energy each second", status: "correct" },
      { id: "b", text: "It transfers 2000 J of energy in total", status: "wrong", misconception: "appliance_energy_confused_power_energy" },
      { id: "c", text: "It stores 2000 J of energy", status: "wrong", misconception: "appliance_energy_confused_power_energy" },
      { id: "d", text: "It transfers 2000 J of energy each hour", status: "wrong", misconception: "appliance_energy_confused_power_energy" }
    ]
  },
  {
    id: "en_appliance_compare_mcq_12", qtype: "mcq_single", tier: "both",
    atom: "appliance_energy_reasoning", syllabus: "6.2.6.2.e",
    prompt: "Appliance A has a power of 1000 W and runs for 60 s. Appliance B has a power of 2000 W and runs for 20 s. Which appliance transfers more energy?",
    explanation: "E = Pt. A: 1000 × 60 = 60 000 J. B: 2000 × 20 = 40 000 J. Appliance A transfers more.",
    distractors: [
      { id: "a", text: "Appliance A (60 000 J vs 40 000 J)", status: "correct" },
      { id: "b", text: "Appliance B, because it has the higher power", status: "wrong", misconception: "appliance_energy_confused_power_energy" },
      { id: "c", text: "They transfer the same energy", status: "wrong", misconception: "appliance_energy_confused_power_energy" },
      { id: "d", text: "It cannot be told without the voltage", status: "wrong", misconception: "qualitative_inference_doubted" }
    ]
  }
]
```

---

## B. Atom and flag coverage

| atom | items | flags exercised |
|---|---|---|
| power_vi_calc | 01, 02, 07, 08 | wrong_formula_rearrangement, treated_I_as_V, picked_given_value |
| power_i2r_calc | 09, 10 | forgot_to_square_in_power, prefix_not_converted, swapped_factor_in_squared, topology_indifferent_assumption, qualitative_inference_doubted |
| power_rating_interpret | 11 | appliance_energy_confused_power_energy (NEW) |
| energy_pt_calc | 03, 04 | (clean calcs) |
| energy_qv_calc | 05, 06 | (clean calcs, one std-form) |
| appliance_energy_reasoning | 12 | appliance_energy_confused_power_energy (NEW), qualitative_inference_doubted |

## C. NEW_FLAG proposal

**`appliance_energy_confused_power_energy`** (energy_appliances / power_electrical) — conflated power (rate, W) with energy (total, J): read a power rating as a total energy, or judged total energy transferred by power alone ignoring time. Surfaced by the power-rating item and the appliance-comparison item, where it is the central trap. Not in the ported ECM set (ECM's `bcf` energy items test the formula route, not the power-vs-energy concept). One slug covers both framings.

## D. Findings

1. **P=I²R is MCQ-only until the grader gains `^`** (the Forces seat's third constraint). Items 09, 10 are MCQ; item 09 is tagged `_interim_for` and converts to `calc_workings` once `^` and prefix grading land. This is the only 6.2 formula affected (Q=It, V=IR, P=VI, E=Pt, E=QV are all product/quotient).
2. **Retro-fix to batch 1.** My `ohm_vir_prefix_02` (450 mA -> R) was authored as `calc_workings` with `marks: 4` including a prefix-conversion mark. Per constraint (a) the grader cannot separately credit the prefix step, so that mark is not actually gradable. To stay consistent with the Forces convention I should either (i) drop it to a 3-mark calc and not claim the prefix mark, or (ii) add an `interim_for:"calc_prefix"` MCQ twin (like `spr_hooke_prefix_mcq`). Recommend (ii); flagging rather than silently leaving the marks:4 claim. Same applies to `ohm_findI_poweroften_04` only if you want the mA-form answer separately credited.
3. **`treated_I_as_V` distractor in item 07** (52 900 W = 230²) reuses the ECM slug; it reads as "used the pd value twice / squared the supply". Fine, but note it overlaps conceptually with a P=V²/R intuition, which is not a Trilogy formula; the slug name is about the substitution slip, which is the right read.
4. **Retired-slug gap visible again.** Item 10's "2 Ω resistor" distractor (the classic wrong answer) has no slug, because `wrong_power_form_for_topology` was retired. The per-option log still records the pick, but if you want this high-value distractor named, we need a replacement topology-power slug (e.g. `power_topology_reasoning_wrong`, the I²R/series and V-shared/parallel reasoning, minus the V²/R formula). Raising it a second time; your call.
5. Std-form calc (item 06) relies on the tokenizer's e-notation handling (present in `calc_workings.js`), but I have not run it through the marker; included in the verification below.

## E. Calibration notes

- Running total across batches 1 to 4: 54 items (10 + 12 + 16 + 16... ) plus 2 graph_sketch. [Power/energy is batch 4 at 12 items; corrected total 50 graded items + 2 graph_sketch, see running tally in series_parallel.md section E + this 12.]
- Remaining sub-topics: `circuit_basics` (symbols, the ×46 6.2.1.1 territory), `mains_ac_dc`, `mains_safety`, `national_grid`. The mains and grid set carries the last cluster of NEW_FLAGs from the proposal (`mains_values_confused`, `live_neutral_earth_confused`, `transformer_role_confused`, `grid_loss_reason_missed`).
- The `appliance_energy_confused_power_energy` flag feels like a high-fire one: power-vs-energy is a perennial confusion and the National Grid items will lean on it too (transmit at high power vs high voltage).

Next: `circuit_basics` (symbol recall and circuit-drawing, the highest-frequency 6.2.1.1 code), pulling the ECM symbol confusions and the AQA draw-a-circuit shapes.
