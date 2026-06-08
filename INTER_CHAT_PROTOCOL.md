# Trilogy Physics: INTER_CHAT_PROTOCOL

How the Trilogy chats coordinate. This is the discipline the GCSE side has lacked; honour it (standing principle 3: read the shared state, it is the communication).

## The chats

- **Architecture-and-Housing:** owns PROJECT, DESIGN, DECISIONS, OPEN_QUESTIONS, ROADMAP, AUTHORING_BRIEF, QUESTION_TYPES, and the engine/display. Ratifies authoring proposals.
- **Authoring (one or more):** writes questions per topic, proposes qtypes and misconception slugs, reports batch reviews.

## The channel

All cross-chat communication is file-mediated through `inter_chat/`. There is no out-of-band channel. A thread is a markdown file named `<FromRole>_<ToRole>_<topic>.md` with a status line (OPEN / RESOLVED) and dated entries, newest at the bottom.

## Session-start discipline (every chat, every session)

Before substantive work: read your memory if any; read DECISIONS, the relevant DESIGN and AUTHORING_BRIEF sections, and OPEN_QUESTIONS; open `inter_chat/` and read every OPEN thread addressed to your role, especially any bumped since your last visit. Then surface what you found in your first turn as evidence the state is absorbed, not as a status report. A chat that wakes and asks "what shall we do?" without reading shared state is failing the role.

## Conventions

- Cite decisions with their substance, never bare numbers (standing principle 4): "d004 (atom dashboard in v1)", not "d004".
- Agree-by-silence is allowed on explicitly-flagged defaults; respond with substance only. No silent absorption of a new misconception into an existing bucket.
- Mount the GCSE Physics Overview folder read-only so the standing principles, spec map, and packets are reachable (DECISIONS d011).
- No em-dash character (U+2014).

## Cross-project threads

Trilogy and Pre-IB are peers that cross-fertilise. Cross-project threads live here too, named `Trilogy_PreIB_<topic>.md`. The GCSE Physics Overview seat brokers; it pulls these on its check-ins.
