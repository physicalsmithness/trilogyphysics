# Trilogy Physics: AUTHORING_BRIEF

This brief tells a Trilogy Authoring chat how to write questions. Read it, then read `QUESTION_TYPES.md`, then read the standing principles at the GCSE Physics Overview folder. The brief is owned by the Architecture chat and evolves as authoring surfaces what works (standing principle 5: both think, neither prescribes, the flow runs both ways).

## READ THIS FIRST

You are writing for AQA Combined Science: Trilogy (8464) physics, Foundation and Higher. Trilogy is **calculation-heavy and explanation-heavy**. That is the opposite of the Pre-IB single-science work, which is memory-heavy with few calculations; do not import the Pre-IB content shape, only its structural discipline. Your three big content families are: calculation questions (often multi-stage, with prefix and unit handling and AQA's harsh anti-ECF gating), written explanation questions (including the 6-mark level-of-response items), and a smaller set of recall, MCQ, and practical-method items.

## How to cover a topic: two passes, both directions

Do not author straight off the past papers; that narrows coverage to what has historically been asked. Instead:

1. **Spec-first pass.** Take the spec point (for example 6.5.4.1 motion equations) and think up the questions that genuinely cover the physics a learner must be able to do, before looking at the papers. Write the coverage you would want even if AQA had never set it.
2. **Past-paper pass.** Then mine the full extracted bank (the Codex DB, see below) for how AQA has really examined that point: the stimulus shapes, the mark-scheme expectations, the examiner-report pain points, the typical mark splits.
3. **Gap pass.** Reconcile the two. Keep what the papers do well, fill what your spec-first pass covered that the papers neglect, and add what has not been asked but plausibly could be. Go one way, then the other.

This keeps the bank both faithful to the exam and broader than any single year's paper.

## The full bank is yours

You get the full structured question bank, not just PDFs. The Codex Trilogy categorisation DB is `C:\CodexProjects\PaperDatabases\Trilogy Categorisation\aqa_extraction_plus_calc.db`; read that folder's `README.md` first. It gives you, per paper: segmented questions and parts, marks, printed formulae, mark-scheme `answers` and `extra_information` (the per-mark source of truth; `mark_points` is only a hint), examiner reports, and the six-layer calculation tagging. Use `answers` plus `extra_information` for per-mark content. You will likely need the parent `PaperDatabases` folder mounted to reach `outputs/previews/`; ask Smith.

## Calculation questions (the Trilogy core)

- The Codex six-layer tagging is your vocabulary: calculation shape, formula/relation/rule code, number source per substituted variable, unit-handling action, mark category per mark, and ECF gate. Author calculation items so the grader can classify an attempt into these, not just right/wrong (standing principle 1).
- Grade structured attributes: value right, unit right, prefix handled, rearrangement correct, and pin a specific reason string to known wrong patterns (for example "used the full division, not half" on uncertainty, "left the answer in grams" on a g-to-kg item).
- Honour the **equation-sheet-versus-recall** distinction (standing principle 6). AQA's 2023 insert is generous; the pre-Covid insert gave only seven equations; whether a formula is given or must be recalled changes what the item tests. The Codex data records this; carry it onto the item.
- Expect AQA's **anti-ECF gating** ("this mark can only be scored if equation X has been used", "no further marks unless"), roughly once per Higher paper near the end. Model it where it is genuine; do not invent it.
- Cover the prefix and standard-form and significant-figure handling that AQA marks explicitly (the "give the unit" mark sits last and lifts the total by one; sig-figs embeds in the evaluation mark; standard-form gates the evaluation mark via mark-scheme wording).

## Written explanation questions

- Trilogy's explanation load is heavy and is where many marks are won and lost. Author the 6-mark level-of-response items and the 2-to-4-mark explanation items as first-class, not afterthoughts.
- For these, atomic understanding means tagging which specific point in a chain the learner missed, not just a global score. Decide with Architecture how the grader handles free-text explanation (it may be constrained to selectable claim-points rather than free typing where no grader exists yet; see qtype constraints below).

## Tone (standing principle 2)

Warm and low-stakes in framing; plain-speaking in the verdict. When an answer is wrong, say so plainly, no "so close!" unless it is a genuine near-miss (sign only, rounding slip, arithmetic slip on the right method). No infantilising, no exclamation-mark filler, no emoji. This holds for Foundation-tier and weaker learners too; plainness and warmth are not tier-dependent.

## Boundaries (from Architecture, until changed)

- **Qtype constraints:** do not author a question type the engine cannot yet grade. If you want a new qtype, propose it (NEW_QTYPE) rather than writing items the grader will mishandle.
- **New misconception slugs:** propose them explicitly (NEW_FLAG) when the material reveals one; do not silently fold a new misconception into an existing bucket (standing principle 1).
- **Tier and board tags** are required on every item (standing principle 6).
- **Cohort data** informs calibration and sequencing, not coverage priority (DECISIONS d006).

## What to report after a batch

A short review note per batch (a `review/<topic>.md` is the suggested pattern): what you covered, which spec points, which qtypes, which misconception slugs you exercised, any NEW_QTYPE or NEW_FLAG proposals, and anything that felt awkward. Architecture reads these and ratifies proposals with their substance (principle 4).
