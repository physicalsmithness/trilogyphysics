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

**M2 progress (Housing, 2026-06-08, DECISIONS d022):** engine spine built and running behind the `app/` shell — blended ECM drilling + atom dashboard + Circuit Builder, TOPIC_CONFIG-driven, with MCQ/short/calc_workings graders and the `window.TOPIC_DIAGRAMS` registry. 44 automated assertions green. REMAINING for M2: lock the schema (q-schema-lock, Architecture) then fold the ~160-question Magnetism bank to it; lift calc_workings verbatim + add per-line method-marking once the Pre-IB source is reachable (currently online-only, see d022).
