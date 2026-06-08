# Trilogy Physics

A GCSE AQA Combined Science: Trilogy (8464) physics driller, plus the authoring that feeds it. Part of the GCSE physics estate coordinated by the GCSE Physics Overview seat (`C:\Users\patri\OneDrive\Documents\Claude\Projects\GCSE Physics Overview`). Read that seat's `README.md`, `SPEC_MAP.md`, and `dispatch_packets/standing_principles.md` before working here.

## What this is

A coordinated, multi-chat driller project with a question bank backed by real extracted past-paper data. It differs from the earlier one-off GCSE drillers (Y9 Pressure, the loose Energy/Magnetism builds) by having the operating-model discipline the IB side uses, and from the IB drillers by having an already-extracted, already-tagged question bank from day one.

## Scope

- **Board and tier:** AQA Trilogy 8464, Foundation and Higher. Physics content topics 6.1 to 6.7 (Energy, Electricity, Particle model of matter, Atomic structure, Forces, Waves, Magnetism and electromagnetism).
- **Out of scope for now:** AQA Separate/Triple Physics (8463) triple-only content, and AQA Synergy (8465) as an authoring target, though Synergy is already extracted and available. Add later if Smith asks.

## Relationship to the rest of the estate

- **Peer of Pre-IB (single science / Edexcel 4SS0), not subordinate to it.** The Pre-IB architecture had been treating Trilogy as its own responsibility; that boundary is now drawn (see the Overview seat's `dispatch_packets/preib_trilogy_boundary.md`). The two are peers that cross-fertilise via inter_chat threads. Pre-IB is a strong structural reference (schema, atom registries, handover discipline) but not a content template: Pre-IB is memory-heavy and thin on calculation and explanation, whereas Trilogy is calculation-heavy and explanation-heavy.
- **Fed by the Codex Trilogy categorisation** (`C:\CodexProjects\PaperDatabases\Trilogy Categorisation`): the integrated SQLite DB `aqa_extraction_plus_calc.db` with extracted papers, mark schemes, examiner reports, six-layer calculation tagging, and question-level (national and our-centre) average marks.
- **Calculation Automation** (`...\Projects\Calculation Automation`, calc_checker_v3) is a candidate shared calculation component.

## Chat topology

- **Architecture-and-Housing (combined):** owns project shape and the engine/display. Combined deliberately (see DECISIONS d002).
- **Authoring:** one to begin, several by topic as it grows.
- **Housing/Implementation (later, on trigger):** see DECISIONS d002.

## Homes

- **Docs and code (this repo):** `G:\My Drive\github local files\trilogyphysics`. Provisional, co-located with the existing Energy/Magnetism code to revive (the Fields pattern). Revisit if cloud-sync races with active multi-chat editing (DECISIONS d010).
- **Question-bank feed:** the Codex DB at the path above (read-only to this project).
