# Electric Circuits Mastery: port assessment for Trilogy 6.2

From: 6.2 Authoring chat. To: Architecture. Date: 2026-06-08.
Status: FINDINGS, includes two corrections to the ratified vocabulary proposal.

I went through ECM's question banks at Smith's prompt ("there are an awful lot of questions there you might like, a lot beyond Trilogy to bring down, and some basic questions and misconceptions to bring in"). This is what I found and what I propose to do with it.

## What ECM holds

Authored, misconception-tagged item banks in `data/*.yaml`, each item a template with parameterised stimulus, distractors carrying misconception slugs, feedback templates, and B.5 syllabus tags:

| file | items | pre_ib | ib | shape |
|---|---|---|---|---|
| basic_circuit_formulas | 24 | 13 | 11 | numeric + qualitative MCQ on V=IR, Q=It, P=VI, P=I²R, E=QV |
| circuit_rules | 49 | 19 | 30 | qualitative circuit-reasoning MCQ (series/parallel rules, meters, brightness, topology) |
| resistor_combinations(_templates) | many | some | most | series/parallel resistance combination (mostly reciprocal) |
| resistivity | 22 | 6 | 16 | R = ρL/A |

Plus past-paper packs (PDF) and a `b.5 question categorisation` catalogue.

## The key reframing

**ECM's `pre_ib` / `ib` split is its own difficulty axis, not a Trilogy-scope boundary.** Several `ib`-tagged ECM items are squarely Trilogy 6.2 content (the ohmic-vs-non-ohmic, constant-temperature, IV-graph items carry `misread_iv_graph_for_ohmic`, `ohmic_confused_with_metal` and sit at `ib` in ECM but are GCSE-core). So I filter by **physics topic against the 6.2 spec**, not by ECM level. Filtering by level alone would have dropped Trilogy-valid content and kept some out-of-scope basics.

## A. Ports cleanly to 6.2 (bring in, retag to AQA + tier)

**From basic_circuit_formulas** (gives me ready content for atoms I have not yet authored):
- `bcf_001` R = V/I as definition -> `resistance_definition` / `ohm_law_calc`
- `bcf_017`, `bcf_018` V=IR both rearrangement directions -> `ohm_law_calc`
- `bcf_020` R from ammeter + voltmeter readings -> `ohm_law_calc` + `meter_placement`
- `bcf_004`, `bcf_008` Q=It and charge-from-current-time -> `charge_flow_calc`
- `bcf_005` P=VI mains kettle (230 V, 9 A) -> `power_vi_calc` (also seeds `mains`)
- `bcf_012` I from P and V -> `power_vi_calc`
- `bcf_006` series power comparison via P=I²R -> `power_i2r_calc` (NB drop its sibling `bcf_007`, which uses P=V²/R, not in Trilogy)
- `bcf_009`, `bcf_010`, `bcf_011` E=QV / pd-from-energy-per-charge -> `energy_qv_calc` (confirms E=QV belongs; gives the electron-energy concrete framing)

**From circuit_rules** (19 pre_ib + several ib are a near-complete `series_parallel` + `circuit_basics` batch ready to retag):
- meter placement / reading: `cr_001`, `cr_006`, `cr_007` (voltmeter across series bulb, ammeter two positions, voltmeter across battery)
- series current same: `cr_002`
- series pd: `cr_011` (larger R larger pd), `cr_045`, `cr_046` (pd sums to supply)
- parallel pd same: `cr_014`; parallel current sums: `cr_015`, `cr_047`; identical-branch share: `cr_017`
- brightness reasoning: `cr_018` (add parallel bulb), `cr_019` (add series bulb), `cr_023`, `cr_024` (unscrew one bulb)
- switch state: `cr_025`; topology identification: `cr_030` (series), `cr_031` (parallel); current direction: `cr_033`

Retag actions for every ported item: replace B.5.* tags with the 6.2 v3 leaf code; set `board: AQA Trilogy 8464`; set `tier`; convert ECM's `circuit_template` DSL to the Trilogy Circuit Builder DSL (Housing's `diagrams.js`); keep the misconception slug (all are in our ratified set, see corrections below). The ECM numeric *templates* (sample_from parameter sets) are richer than my hand-written singletons; see finding C.

## B. Beyond Trilogy (do NOT bring; confirms the proposal's exclusions)

- All `resistivity` (22 items) R = ρL/A: Triple-only.
- `resistor_combinations` reciprocal calculation (parallel total by 1/R sum): spec-excluded at 6.2.2.
- ib `basic_circuit_formulas` using P=V²/R (`bcf_007`) and `incomplete_reduction` (multi-step network reduction): not Trilogy.
- Anything on internal resistance / EMF / potential divider in the ib set: not Trilogy.

## C. Two CORRECTIONS to the ratified vocabulary proposal

Looking at the actual ECM items (not just the misconception file) shows I mis-scoped two slugs as out. They are **qualitative topology-reading** skills, not reciprocal-calculation traps, and they appear on `pre_ib` qualitative items that port:

1. **`treated_bypass_as_active`** — reclassify OUT -> PORT. It is "ignored a wire that short-circuits a component" (e.g. `cr_018`), a qualitative reading skill that applies directly to Trilogy circuit questions. No calculation involved.
2. **`disguised_parallel_missed`** — reclassify OUT -> PORT. It is "read the topology wrongly when the diagram disguises it" (`cr_030`, `cr_031`), again purely qualitative and in-scope for Trilogy series/parallel identification.

Both join `series_parallel`. My original OUT rationale ("parallel-reciprocal traps") was too hasty; the reciprocal *calculation* is out, but these topology-reading slugs are not tied to it.

Plus one near-duplicate to resolve: ECM items use **`equal_current_in_parallel_assumed`**, which is the same trap as our ratified **`equal_share_assumption`**. Recommend keeping `equal_share_assumption` as canonical and treating the ECM name as an alias on import, so we do not carry two slugs for one trap.

## D. Findings for Architecture

1. **ECM's numeric-template MCQ generator is a portable capability worth considering.** One template (`{V}`, `{I}` with `sample_from` sets, distractor formulas, feedback templates, resample constraints) yields many drilled instances. Trilogy's `calc_workings` is a different, deeper type (marks-the-method, one instance). They are complementary: MCQ-numeric for fast recall drilling, `calc_workings` for method credit. Proposing we adopt the ECM template mechanism for the MCQ-numeric calc items (it is mature and already wired to misconception logging), alongside `calc_workings` for the structured ones. This is a Housing/engine question; flagging it.
2. **The ECM feedback-template style is strong and on-tone** (plain, names the specific error, shows the correct route). Recommend porting that convention into Trilogy item authoring; my batches so far use a single `explanation` string, which is thinner. Could add an optional per-distractor `feedback` field.
3. The corrections in section C should be folded into `trilogy_electricity_vocabulary_proposal.md` on your nod (I can make the edit).

## Proposed next action

Fold ECM's `circuit_rules` pre_ib set into the upcoming `series_parallel` batch (retagged, not rewritten from scratch, honouring d009's "existing work is real work"), and ECM's `bcf` E=QV / P=VI items into the `power_electrical` and `energy_appliances` batches. That turns two ECM banks into a large head start on three of my remaining 6.2 sub-topics.
