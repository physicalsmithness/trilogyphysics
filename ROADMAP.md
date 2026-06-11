# Trilogy Physics: ROADMAP

Milestones. The Architecture-and-Housing chat owns this and re-sequences as needed. Standing principle 1's reading test applies: the atom-level display must be scheduled early enough that v1 demonstrates what the product is.

- **M0 (done, 2026-06-08): project seeded.** Operating-model docs written, repo identified for revival, Overview seat coordinating.
- **M1: lock the schema, the topic list, and the question-type summary.** Architecture reads the Codex DB and the existing Magnetism bank, ratifies or amends the seed schema (DECISIONS d003), and fills `QUESTION_TYPES.md` from the extracted mark schemes and examiner reports. Output: a locked item schema and a real Trilogy question-type map.
- **M2: revive the engine and fold in the Magnetism bank.** Evaluate the existing `trilogyphysics` engine (keep, refactor, or replace, resolving OPEN_QUESTION q-engine), retrofit the ~160 Magnetism questions to the locked schema, and stand up the atom-level dashboard skeleton (the schema logs misconception_id and avoid counts from here).
- **M3: first authored topic end to end, with the dashboard live.** Pick one calculation-and-explanation-rich topic (Energy 6.1 or Forces 6.5 are natural, given the Y10 exam work already centres there). Run the two-pass authoring (DECISIONS d007) for it, ship it with the atom dashboard actually displaying coverage and fire/avoid counts. This is the v1 demonstration.
- **M4: widen to the remaining topics**, several authors by topic, each running the two-pass method and reporting batch reviews.
- **M5: cross-board engine review.** With Trilogy and Pre-IB both running, the Overview seat brokers whether a shared GCSE driller engine/display is worth consolidating (the answer to the Fields/electricity duplication). Decide keep-separate or converge.
- **Later: accounts, server-side question delivery, monetisation runway** if Trilogy follows the IB drillers toward a public product. Out of near-term scope.

---

**M2 progress (Housing, 2026-06-08, DECISIONS d022):** engine spine built and running behind the `app/` shell — blended ECM drilling + atom dashboard + Circuit Builder, TOPIC_CONFIG-driven, with MCQ/short/calc_workings graders and the `window.TOPIC_DIAGRAMS` registry. 44 automated assertions green. REMAINING for M2: lock the schema (q-schema-lock, Architecture) then fold the ~160-question Magnetism bank to it; lift calc_workings verbatim + add per-line method-marking once the Pre-IB source is reachable (currently online-onl
---

## Status update 2026-06-11 (Architecture)

Reality has outrun the original M-sequence because Smith parallelised topics. Current picture:

- **M0 (project seeded), M1 (schema + question types locked):** DONE. SCHEMA at v1.3 (calc_workings stages d029, fbd/widget qtypes d023/d035, diagram-in-MCQ d036); QUESTION_TYPES filled for 6.2 and 6.5.
- **M2 (engine + widgets):** IN PROGRESS and well advanced. Engine blended (d016) and green (36/36 tests); 6.2 widgets built, 6.5 widgets built with the interactive `widget` contract ratified (d035); 6.6 and 6.7 widgets commissioned. Housing still owes: diagram/widget options in MCQ (d036), wiring the Forces topic, and the window.TOPIC_WIDGETS flow.
- **M3 (first topic end-to-end with the dashboard live):** the LIVE target and the gate to pupils testing. BLOCKED on one thing: **6.2 has no authored questions yet** (electricity_6_2.js items empty). 6.2 is the designated proof topic; it must produce batches (nudged in the Authoring kickoff thread). Once 6.2 has content + Housing finishes wiring, this slice is demonstrable and deployable.
- **M4 (widen to topics):** already running ahead of M3 by Smith's choice, 6.5 authoring (batch 1 ratified) and 6.5/6.6/6.7 widgets in flight. Holding the caveat (d027) that 6.2 stays the end-to-end proof so pipeline lessons feed back.
- **Parallel track not in the seed sequence:** the widget-centric pivot (d031) made interactive widgets a first-class question surface across 6.5/6.6/6.7; the schema and engine now carry it.

Near-term critical path to a live pupil test: (1) 6.2 authoring fills its bank; (2) Housing lands diagram-in-MCQ + wires forces and the widget flow; (3) Smith pushes to GitHub and runs the backend sign-in test; (4) deploy (GitHub Pages / Firebase Hosting).
