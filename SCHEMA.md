# Trilogy Physics: ITEM SCHEMA v1.0 (locked 2026-06-08, resolves q-schema-lock)

The contract every item obeys and every chat builds against. Locked by Architecture from the ratified 6.2 vocabulary proposal (`review/trilogy_electricity_vocabulary_proposal.md`), the v3 syllabus spine (`review/SYLLABUS_6_2.md`, d021), the Codex six-layer calc tagging (d003), and the ECM/Pre-IB engine shapes (d015, d016). Authoring proposes changes from the material (principle 5); Architecture versions this file.

## Every item carries
- `id` — stable snake_case unique id.
- `board` — `aqa_trilogy_8464` (first-class, d005 / principle 6).
- `tier` — `F` | `H` | `FH` (shared cross-tier item; tier on the item, atoms shared, d005).
- `topic` — e.g. `6.2`.
- `subtag` — one dashboard group (6.2 set: circuit_basics, charge_current, resistance_ohm, iv_characteristics, series_parallel, mains_ac_dc, mains_safety, power_electrical, energy_appliances, national_grid).
- `syllabus_codes` — array of the finest applicable v3 codes (d021), e.g. `["6.2.1.3.c"]`.
- `atoms` — array of `atom_id` from the registry (the per-skill units the dashboard tracks, d004). Multi-cell types may add `atomMap: { atom_id: [cellIndex,...] }` (ECM pattern).
- `qtype` — see QUESTION_TYPES.md. Gradeable now: `mcq`, `mcq_multi`, `short`, `calc_workings`. Staged: `level_of_response_6`, `circuit_draw`, `graph_sketch` (d023).
- `difficulty` — `d1` | `d2` | `d3` (calibration/sequencing; informed by the AQA national facility, NOT our cohort, d006).
- `prompt` — stem text.
- `marks` — integer.
- `equation_sheet` — `from_insert` | `must_recall` where a formula is involved (principle 6). NB all six 6.2 formulae are on the 2023 insert but none on the pre-Covid insert.
- `commonMisconceptions` — array of misconception slugs predicted for this item (ECM capture-while-authoring; engine may ignore, tooling reads).
- `applicable_misconceptions` — slugs that COULD fire here, so the dashboard can count avoids as well as fires (principle 1: track non-fires).
- `explanation` — mark-scheme text. For ported items, quote the AQA source (no invented port claims); else `based_on` / `in_style_of`.
- `diagram` (optional) — `{ kind, params }`. `kind:"circuit"` routes to the Circuit Builder (Housing); other kinds route to the Widgets registry (see Widgets dispatch). 
- `source` — `authored` | `ported_from_ecm` | `aqa_ppq:<ref>`.

## Per-qtype fields
- **mcq / mcq_multi** — `choices: [ {text | symbolKind | graphKind | svgKind | diagram, label} ]`, `answerIndex` (or `answerIndices`), and **per diagnostic distractor** `misconception_id` (d004) plus a `rationale`. Optional `distractorErrorTypes` (ECM error-type tags). Choices may be widget/circuit renders (this is the interim form of the draw/sketch types, d023).
- **short** — `markPoints: [ {any:[synonyms]} ]`. Keyword-presence marking only; the engine shows the auto-mark warning. Avoid multi-point `short`; prefer `calc_workings` or `level_of_response_6` claim-points where the answer is structured.
- **calc_workings** (the 4-line marks-the-method type, d016, from the Pre-IB engine) — `knowns: { SYM:{ value, unit, dimension, asGiven } }`, `unknown`, `equationCanonicalForms: [...]`, `expectedFinalValue`, `expectedUnit:[...]`, `tolerance`, `allowRepeat`, `requireUnit`, `marks:4`. Each line maps to the Codex Layer-5 mark categories 6.2 uses: `equation_quoted`, `substitution`, `rearrangement`, `evaluation`, `prefix_conv`, `sig_figs`, `standard_form`, `unit`. ECF via `gate:{kind:"from_previous_part"}` (anti-ECF gating is rare in 6.2).

## Registries (data, owned with Authoring; Architecture ratifies)
- **Atom registry** — the ratified `atom_id` set grouped by subtag (proposal §2). Atoms are tier-shared.
- **Misconception registry** — ECM `misconceptions` schema (`slug / topic / label / description`), seeded from proposal §3 (ported / port-trim / NEW_FLAG). `topic` uses the subtag. Lives in `data/misconceptions` for the engine to read (d016).
- **Working-scientifically slugs** (`repeatability_reproducibility_confused`, `freehand_line_not_ruled`, `prefix_not_converted`) are cross-topic; they live in a SHARED WS taxonomy owned at the GCSE Physics Overview level, referenced by items, not duplicated per topic (q-ws-taxonomy, routed to Overview).

## Trilogy scope exclusions (ratified, d024) — do NOT author these for Trilogy
Parallel-resistance reciprocal calculation (spec 6.2.2 excludes it); resistivity `R=ρL/A`, potential dividers, capacitance (Triple/A-level); `P=V²/R` (not a Trilogy equation; power is `P=VI` and `P=I²R` only); static electricity (Triple-only). Much of ECM's `resistor_combinations`/`resistivity`/`potential_divider` content therefore does NOT port.
