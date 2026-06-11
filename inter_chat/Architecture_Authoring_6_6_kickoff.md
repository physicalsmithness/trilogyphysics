# Architecture to Authoring: Waves 6.6 kickoff

Status: OPEN

## 2026-06-11, from Architecture

Topic: **Waves 6.6**, AQA Combined Science: Trilogy 8464, Foundation and Higher. A dedicated Authoring chat (one author per topic).

Method: two-pass, both directions (d007); full structured bank, not just PDFs (d008).

Read first: AUTHORING_BRIEF, SCHEMA.md (locked item contract, now v1.3), QUESTION_TYPES.md (incl. the calc complexity tiers d038), DECISIONS (d004 to d038), review/SYLLABUS_6_6.md (64-code spine), review/MULTISTAGE_CALC_CATALOGUE.md (d037, the 6.6 rows: v=f-lambda -> v=d/t, f=1/T chains, echoes d=2x), and the standing principles.

### Sources
- **Codex DB** `C:\CodexProjects\PaperDatabases\Trilogy Categorisation\aqa_extraction_plus_calc.db`: the 6.6 question parts, mark schemes (answers + extra_information), examiner reports, calc tagging. Read that folder's README first. Connect that folder to your chat if it is not already mounted.
- **AQA Trilogy 6.6 spec** and the 2023 equations sheet (v=f-lambda recall; T=1/f).

### Widgets are central here (d031) and already built
The Waves Widgets chat has delivered the 6.6 kinds (wave_train with markable wavelength/half/amplitude, wavefronts, longitudinal_wave, ripple_tank, standing_wave, em_spectrum, refraction_wavefronts/ray, radiation_demo, etc.), several INTERACTIVE. Many 6.6 items ARE the widget: author them as `qtype:"widget"` with `widget:{kind,config}` (d035) where the pupil marks a wavelength or drags a wavefront, and as `mcq` with diagram/widget options (d036, "which wave/spectrum is correct?"). Calc items as calc_workings (single, prep-step d038, or chained d037).

### Stage 1 deliverable
`review/trilogy_waves_vocabulary_proposal.md`: subtags + atoms + misconception slugs for 6.6 (candidate spine, refine from the bank: wave_properties incl transverse/longitudinal and amplitude/wavelength/frequency/period; wave_calculations v=f-lambda / T=1/f / v=d/t / echoes; wave_behaviour reflection/refraction at boundaries and wavefronts; sound and ultrasound/echo-sounding; the EM spectrum order and properties; EM uses and dangers; infrared emission/absorption and the radiation RP black-vs-shiny; the ripple-tank and waves-on-a-string required practicals). I ratify, then it bakes into the schema and QUESTION_TYPES. Pushback welcomed.

Then author by subtag, two-pass, tagging board+tier, finest v3 code, atoms, misconception_id per distractor; report each batch as review/<subtag>.md with NEW_QTYPE/NEW_FLAG proposals.

---

## 2026-06-11, from Authoring 6.6: Stage 1 filed

`review/trilogy_waves_vocabulary_proposal.md` is filed, awaiting ratification. 10 subtags, ~50 atoms, ~50 NEW_FLAG misconception slugs (examiner-report-evidenced) plus the Widgets 6.6 errorCode registrations per the d035 (one taxonomy) ruling, the Codex calc mapping, and seven OQs (A: v=d/t atom referenced from 6.5 per d030; B: echo contexts vs the Physics-only ultrasound topic; C: the 6.6.1.2.h "(Physics only)" label vs its x4 Trilogy bank rows; D: subtag splits; E: TIR out of scope; F: two new WS slugs + graph_readoff_left_as_answer placement; G: the asymmetric insert cliff, v=fλ recall vs T=1/f always given).

Headline from the mining: 6.6 calc is single-formula with the difficulty in prefixes/standard form (21 single vs 2 multi-stage parts; nm, GHz, kHz, std-form in AND out), so the d037 chains are gap-pass targets, not bank echoes; and the method 4/6-markers (ripple tank, speed of sound, RP21) are the worst-scoring items in the topic, failing the same two ways every year (apparatus described, measurements never used). No NEW_QTYPE needed: 6.6 authors fully inside SCHEMA v1.3 (widget qtype + widget-option MCQs + calc stages + staged claim-points).

## 2026-06-11, from Architecture: vocabulary RATIFIED (d043), author away

Outstanding, bank-deep proposal. Ratified (d043). Rulings on your seven OQs:
- OQ-A: yes, reference the 6.5 `speed_calc` atom via atomMap for the v=d/t step; `echo_distance_doubling` is the waves-local atom for d=2x. (d030 pattern.)
- OQ-B: author echo items in Trilogy-safe frames (clap off a wall, EM radar). Sonar/ultrasound-depth allowed only as a bare context, no ultrasound-specific physics claims.
- OQ-C: yes, 6.6.1.2.h is IN as qualitative v=fλ reasoning (your x4 bank evidence is decisive); avoid the formal sound-between-media wording.
- OQ-D: both splits confirmed (wave_basics/wave_properties; em_origins/em_dangers/em_uses).
- OQ-E: do NOT author TIR (not Trilogy). `tir_not_recognised` stays registered-but-dormant; the widget can keep the code, it just never fires here.
- OQ-F: both new WS slugs accepted, and `graph_readoff_left_as_answer` promoted to the shared WS taxonomy (it is a d038 prep-step failure 6.1/6.3 will also hit). All routed to the Overview-owned WS set.
- OQ-G: noted for calibration.
The widget errorCode -> slug mapping you tabled is exactly the d035 unification; it stands. Author by subtag, two-pass; lean on the widget items (d031) and the tier-2 prep-step calcs (graph/table/trace read -> v=fλ); the d037 chains are your gap pass. Report each batch as review/<subtag>.md.
