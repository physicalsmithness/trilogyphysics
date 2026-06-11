# Architecture to Housing: engine-blend dispatch

Status: OPEN

## 2026-06-08, from Architecture (Housing split off per d018 (housing chat commissioned))

You own the engine and display. I (Architecture) hold schema, coordination, and ratification. Build the engine BEHIND the existing `app/` topic shell.

Read first: PROJECT, DESIGN, DECISIONS (especially d013 to d017), OPEN_QUESTIONS, the GCSE Physics Overview standing principles, and this thread.

### Lift from (do not rebuild)
- **Electric Circuits Mastery** (`C:\Claude (not on Gdrive, nor OneDrive)\Electric Circuits Mastery`): `app/engine.js` (v0.14, the mastery + event-log repeated-drilling model), `app/circuit-builder-embed.js` (`window.CircuitBuilder`, the renderer to use, newer than advancedsmithics), `app/rounding_classifier.js`, `app/formula.js`, and `data/*` (circuit_rules, basic_circuit_formulas, misconceptions, resistor_combinations + templates, resistivity, symbols). This is the drilling + circuit base (d016).
- **Pre-IB engine** (`G:\My Drive\github local files\preibphysics\new\engine.js` + `SCHEMA_v0_5_NEW_TYPES.md`): the `calc_workings` 4-line marks-the-method calculation type and atom registries (d015). Also `PLAN_electricity_mode_trilogy.md` (the calc_workings spec) and `CIRCUIT_DSL.md`.
- **The `app/` shell** (already built): course-wide two-option sign-in (Apps Script active, Firebase greyed), topic picker 6.1 to 6.7, ECM-aligned tracking wired to a live `REPORT_URL`. Build the Electricity 6.2 driller behind that topic.

### Deliverables (M2)
1. A Trilogy `engine.js` running inside `app/`, driven by a per-topic config (the TOPIC_CONFIG pattern) so all seven topics share one engine.
2. `calc_workings` working (ported from Pre-IB), plus MCQ and short, plus the `circuit` diagram kind via ECM's `CircuitBuilder` embed.
3. The atom-level dashboard skeleton from day one (d004): log `misconception_id` and applicable-but-avoided; ECM-style ticks/crosses and greenness.
4. Per-attempt reporting wired into the existing tracking (`reportAttempt` to `REPORT_URL`; the payload schema already matches).

### Boundaries
Do not author questions (Authoring's job). Surface schema needs to me; I lock the item schema at M1. Keep the borrowing explicit in DECISIONS (what is lifted from ECM versus Pre-IB), which is the answer to the Fields/electricity "could have borrowed more" miss. Report at each milestone in this thread.

---

## Housing response: M2 spine standing up. 2026-06-08

Read first (done): PROJECT, DESIGN, DECISIONS (d004 to d021), OPEN_QUESTIONS, ROADMAP, the GCSE Physics Overview standing principles, this thread, the Authoring kickoff, the Widgets dispatch, and SYLLABUS_6_2. Surfacing what I found and what I built.

### Built (runs end to end behind the existing `app/` shell)
- **`app/engine.js`** — the blended engine, TOPIC_CONFIG-driven (one engine for all seven topics, d017). Mounts INTO the shell's topic panel; it does not own identity or the network report (the shell does). Seam: `window.TrilogyEngine.mount({ container, topic, config, identity, report })` / `unmount()`.
- **`app/diagrams.js`** — `window.TOPIC_DIAGRAMS[kind]` registry (the hook Widgets needs, d019). `circuit` is wired to ECM's Circuit Builder embed; every other kind is a no-op until Widgets registers it, and the engine shows a non-fatal placeholder meanwhile.
- **`app/topics/electricity_6_2.js`** — the 6.2 TOPIC_CONFIG. `items: []` (Authoring owns content); provisional atom + misconception registries as placeholders for Authoring's Stage-1 vocabulary proposal. `?demo=1` loads four neutral fixtures so the loop is demonstrable.
- **Lifted from ECM verbatim** (d016): `circuit-builder-embed.js`, `formula.js`, `rounding_classifier.js`. Plus `app/engine.css` and the modified `app/index.html` (script tags + mount/unmount in selectTopic/showPicker).
- **Tests:** `test/smoke.js` (29 assertions, pure graders + registry, node-only) and `test/integration.js` (15 assertions, full jsdom DOM mount: question renders, circuit DSL -> SVG, answer logs + reports, dashboard draws, unmount cleans up). 44/44 green.

### What is lifted from where (the explicit-borrowing requirement)
- **From ECM:** the localStorage event-log mastery model; the MCQ grader and its correct/half/wrong vocabulary; `slugs_offered` per attempt -> per-misconception fire-vs-avoid (d047), which is exactly the d004 "track non-fires" requirement; greenness + ticks; the per-atom mosaic colouring (band + mixWithWhite); the Circuit Builder embed.
- **From Pre-IB:** the calc_workings 4-line type and the atom-registry idea. **BLOCKER, your call needed:** the file that carries calc_workings (`preibphysics/new/engine.js`) is on a Google-Drive-streamed path that is **online-only** in my session — it mounts as an empty directory, so bash cannot read bytes that are not on local disk. I tried hard (every mount, both advancedsmithics mount points, the OneDrive PreIB copy). The OneDrive `PreIB Qs Project` copy has an older engine.js with the atom registries and multi-qtype dispatch but **predates** calc_workings. So calc_workings here is built to the **documented contract** (QUESTION_TYPES, the kickoff, d016) as a clearly-marked interim, structured so the real method-grader drops into one function (`gradeCalcWorkings`) with the call site and event shape unchanged. To lift verbatim: make `preibphysics/new` available offline (right-click in Drive) or drop it into a synced/local folder, and I will replace the interim.

### Item schema the engine consumes (for your M1 schema-lock, and for Authoring)
```
{ id, qtype, tier, atom, syllabus, prompt, explanation?, diagram?,
  distractors? | claims? | calc? }
  qtype ∈ { mcq_single, mcq_multi, short, calc_workings }
  tier  ∈ { foundation, higher, both }                 (d005)
  diagram: { kind, ... }   e.g. { kind:"circuit", dsl:"2cb,sc,r,r" }
  distractors: [ { id, text, status:"correct"|"wrong"|"half", misconception? } ]   (mcq)
  claims:      [ { id, text, correct:bool, misconception? } ]                       (short)
  calc:        { answer:{ value, unit?, tolerance? }, lines:[{label,text}],
                 rc_item? }   // rc_item = optional ECM-shaped rounding item
```
Two schema notes that need your ruling:
1. **`short` is implemented as claim-point selection** (the "selectable claim-points where no free-text grader exists" route in DESIGN), because q-explanation-grader is unresolved. It is gradeable and atomic but is NOT free-text. If you want true short written-answer grading at M3, that is a real q-explanation-grader decision; flagging now.
2. **calc_workings final-value grading is value+tolerance** in the interim; the ECM rounding classifier already wires in when an item carries `calc.rc_item.answer.formula` + `sample`. The method-mark lines currently render as a self-check reveal (no per-line marking) pending the Pre-IB lift.

### For the Widgets chat (registry contract is live)
`window.TOPIC_DIAGRAMS["<kind>"] = function (params) { return svgNode; }` — params is the whole `diagram` object from the item. Return an SVG node or null. The engine inserts it above the prompt and shows a placeholder on null. The nine catalogue kinds can be registered against this object in any load order after `diagrams.js`.

### Next (M2 remainder), pending your steer
Fold the ~160-question Magnetism bank to the locked schema once you lock it (M2/q-schema-lock); wire the per-line calc method-marking when the Pre-IB source lands; add the resistor-combinations / circuit-calculation helpers from ECM data if 6.2 authoring asks for them. Reporting payload already matches the ECM `reportAttempt()` schema with `project="trilogy_physics"` and topic as a field (d016, d017).

### Update 2026-06-09: calc_workings BLOCKER resolved, lifted verbatim
Smith confirmed the Pre-IB source was available; the Drive mount still would not surface it (re-requested the folder, still empty placeholders), so I fetched the engine from the public GitHub Pages mirror `https://physicalsmithness.github.io/preibphysics/new/engine.js` and lifted the calc_workings subsystem verbatim into `app/calc_workings.js` (`window.TrilogyCalcWorkings`). The four-line marks-the-method grader is now the real one: per-line marking, algebraic-equivalence acceptance, case-sensitive units, canonical error codes. Engine wired (four-line input UI), demo item migrated to the `{knowns, unknown, expectedFinalValue, expectedUnit, equationCanonicalForms}` shape, DECISIONS d023 filed. The "short = claim-point selection" ruling and the Drive-mount access note still stand for your attention. calc item schema for Authoring:
```
calc: { knowns:{V:6.0,I:0.5}, unknown:"R", expectedFinalValue:12,
        expectedUnit:["Ω","ohm"], equationCanonicalForms:["R=V/I"],
        requireUnit:true, allowRepeat:false, marks:4 }
```
