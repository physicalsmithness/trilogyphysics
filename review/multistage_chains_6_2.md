# Depth pass: 6.2 multi-stage calc chains (wired)

From: 6.2 Authoring chat. To: Architecture. Date: 2026-06-08.
Status: DONE. 3 chained `calc_workings` items authored from `MULTISTAGE_CALC_CATALOGUE.md`, verified through the chain grader (d050) stage-by-stage, and appended to `electricity_6_2.js` (now 78 items).

## The chains (all single-formula legs, ECF-gated, d029/d050)

| id | chain | stages | marks | atoms |
|---|---|---|---|---|
| `ch_vir_qit_01` | V=IR -> Q=It (single resistor) | I=V/R -> Q=It | 4 | ohm_law_calc, charge_flow_calc |
| `ch_vir_pvi_ept_02` | V=IR -> P=VI -> E=Pt (kettle) | I=V/R -> P=VI -> E=Pt | 6 | ohm_law_calc, power_vi_calc, energy_pt_calc |
| `ch_qit_eqv_03` | Q=It -> E=QV (lamp) | Q=It -> E=QV | 4 | charge_flow_calc, energy_qv_calc |

Each later stage carries `gate:{kind:"from_previous_part"}` so the pupil's own previous value flows forward (ECF). Every stage grades `full` through the lifted single-block marker (what the d050 chain grader loops); verified headless.

## Constraint finding: the series-resistance-sum chains are held

The catalogue's high-value 6.2 chains "Potential-divider voltages" and "Circuit rules + V=IR/Q=It" want a `R_total = R_1 + R_2` stage. The calc grader (d040 constraint b) splits any multi-character symbol into a product (`Rt` -> R*t, `R1` -> R*1), so three distinct resistance symbols (R1, R2, Rt) cannot be expressed; a student's `R = R1 + R2` line will not parse. I therefore did NOT author the R1+R2 series-sum chains as calc_workings. Options for them:
- hold until the grader supports multi-character symbols (the same d040(b) fix Forces/Waves want), then author the potential-divider chain cleanly; or
- author as MCQ-interim now (pick the correct total / the correct pd) with `failsAt` per distractor.

The three chains above sidestep the sum (single resistor, or product/quotient legs only), so they are fully gradable today. Flagging the series-sum chains as blocked on the multi-symbol grader gap, consistent with the other interim_for items.

## Not authored here (cross-topic, d030)
Heater chains (P -> E=Pt -> dE=mcΔθ / E=mL) are 6.3 Particle-model territory (thermal leg); force-on-wire (V=IR -> F=BIl) and motor power (F=BIl -> P=VI) are 6.7 Magnetism. These reference shared atoms, owned by those topics; not duplicated in 6.2.

## State
`electricity_6_2.js`: 78 items (53 mcq, 1 mcq_multi, 15 calc_workings [12 single + 3 chained], 5 level_of_response_6, 2 circuit_draw, 2 graph_sketch). Conformance clean; all 12 single calc full; all 3 chains full per stage. The bank is live and drillable (pending Housing's enabled:true after a render smoke-test, d053).
