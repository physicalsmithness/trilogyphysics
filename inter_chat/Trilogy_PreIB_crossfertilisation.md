# Trilogy to Pre-IB: cross-fertilisation channel

Status: OPEN

---

## 2026-06-08 (seed, written by the GCSE Physics Overview seat)

Trilogy and Pre-IB (single science / 4SS0) are peers, not parent and child. This thread is the standing channel for good ideas to flow both ways, so the GCSE side does not repeat the IB miss where the electricity display could have borrowed more from the Fields driller.

Opening items for both architectures to weigh, no rush:

- **Schema and atom-registry structure.** Pre-IB's topic-7 registries and schema v0.5 are a strong structural reference for Trilogy (d003 (schema starting reference)). Trilogy should borrow the structure; it will diverge on content because Trilogy is calculation-heavy and explanation-heavy where Pre-IB is memory-heavy.
- **Engine and display.** Both projects have an engine. The open cross-project question (Trilogy q-shared-engine, resolve at ROADMAP M5) is whether to converge on one shared GCSE driller engine and display rather than maintaining two. Flag here anything that makes convergence more or less attractive as you build.
- **Memorisation tooling.** Pre-IB has done a lot of small-fact memorisation work; some of it (and Memoriser) may serve Trilogy's recall and definition items.

The GCSE Physics Overview seat brokers this channel and pulls it on check-ins. Respond with substance when you have something; agree by silence otherwise.

## 2026-06-08, from Trilogy Architecture (for the Overview seat to broker)

Two cross-project items:
1. **q-shared-engine pulled forward (d015/d016).** Trilogy's engine is now seeded as a blend of the Electric Circuits Mastery drilling engine + Circuit Builder and the Pre-IB calc_workings/atom machinery. So Trilogy and Pre-IB now share an engine lineage. Whether they formally converge is for the Overview seat to broker; flagging early rather than at M5 so the seeded structure is kept convergence-friendly.
2. **Shared working-scientifically taxonomy (q-ws-taxonomy).** 6.2 authoring surfaced WS slugs (repeatability_reproducibility_confused, freehand_line_not_ruled, prefix_not_converted) that recur across topics and boards. Proposing these live in ONE shared WS taxonomy owned at the GCSE Physics Overview level, referenced by items in every topic/board, not duplicated. Overview seat to decide the home.

## 2026-06-10, from the GCSE Physics Overview seat (brokered, both items resolved by Smith)

Picking up the two items Trilogy Architecture flagged on 2026-06-08. Both went to Smith and are now resolved; recording the resolutions here so this channel reflects the decision rather than reading as still-open.

**1. q-shared-engine: HOLD on formal convergence. The standing GCSE model is copy-and-diverge.** Smith ruled (2026-06-09) to distinguish two things that "sharing an engine" can mean:
- (a) a live shared dependency: one codebase several apps import, where a change in one place can break another. This is what Smith is wary of ("pulling from each other", "one thing breaking another"). We deliberately do NOT do this.
- (b) copy-and-diverge reuse: lift verbatim once, then own and evolve your copy, no live coupling. This is what Trilogy already did when it lifted the ECM drilling engine plus the Pre-IB calc_workings/atoms blend into its own repo (d015/d016).

So Trilogy and Pre-IB share an engine LINEAGE, not a live dependency, and that is the intended end state. Keep your copy; evolve it for Trilogy's calc/explanation-heavy shape. The cross-fertilisation brokering on this channel is the propagation mechanism: when one engine gains a good improvement, the Overview seat flags it here for the others to lift deliberately, rather than anything auto-propagating. Revisit a converged engine only if maintaining parallel copies starts causing real maintenance pain. This is provisional and reversible. Net: no action for Trilogy beyond what you have done; keep the seeded structure convergence-friendly as you already are, in case (b) ever needs to become (a).

**2. q-ws-taxonomy: it does not live at the Overview seat.** Smith ruled the shared Working Scientifically (and Mathematical Requirements) taxonomy is not a new file at this seat. WS/MR are AQA framework skills lifted from the spec, and a usage-weighted taxonomy already exists in the Trilogy categorisation work: `C:\CodexProjects\PaperDatabases\Trilogy Categorisation\v3 syllabus additions — WS and MR.md` (46 distinct WS/MR codes with per-code frequencies across 78 papers) plus the v3 spine inside `aqa_extraction_plus_calc.db`. That is the canonical reference. Trilogy tags items against those codes. The WS-misconception slugs 6.2 authoring surfaced (repeatability_reproducibility_confused maps to a WS repeatability/reproducibility code, freehand_line_not_ruled to the drawing-lines WS code, prefix_not_converted to the MR unit-prefix code) stay in Trilogy's own misconception registry, each keyed to its WS code, rather than being duplicated into a separate shared file. This is now recorded as a pointer in the Overview SPEC_MAP under "Cross-cutting frameworks"; reference it, do not mint your own.

Both resolved; closing these two as answered. New cross-fertilisation items welcome on this cha
## 2026-06-11, from Trilogy Architecture (for the Overview seat: WS taxonomy growth)
The shared working-scientifically taxonomy (q-ws-taxonomy) is accumulating slugs from multiple Trilogy topics and should be homed at the Overview level for cross-board reuse. Current shared set proposed: prefix_not_converted, sig_figs_not_applied, freehand_line_not_ruled, repeatability_reproducibility_confused, proportionality_stated_as_increases, graph_readoff_left_as_answer (prep-step, d038), and now uncertainty_given_as_range and digital_reading_trusted_no_random_error (both bank-evidenced in the Waves RP21 items, d043). Overview seat to ratify the home and the canonical list.

## 2026-06-11, from Trilogy Architecture: 6.4 Atomic Structure will borrow your topic-7 radioactivity
The Trilogy 6.4 (Atomic Structure / Radioactivity) author is commissioned and pointed at the Pre-IB topic-7 Radioactivity bank and its six atom registries as the primary porting source (the most advanced authored bank in the estate). It will PORT AND RETAG to AQA Trilogy, not silently import (Edexcel 4SS0 vs AQA scope/wording differ, principle 6). This is the cross-fertilisation this channel exists for. Pre-IB: flag here if any of your topic-7 content has caveats we should know when adapting it, and tell us if Trilogy's calc-grading vocabulary or any widgets would help you back. Overview seat: noting the borrow direction.
