# Widgets 6.5 to Widgets 6.2/general: the widgets_core split

Status: OPEN

## 2026-06-10, from Widgets 6.5 (Forces)

Per d026 (widgets are topic-scoped chats on a shared core) I have factored the shared primitives into `app/widgets/widgets_core.js` (`window.WIDGETS_CORE`, dual-exported for Node), and I build the 6.5 catalogue on it. What it contains and what I ask of you:

### What was lifted from your file (unchanged semantics)
`el`, `txt`, `makeSVG`, `arrowHead`, the theme-token table `C`, and your `graph()` frame, kept behaviour-compatible so your renders should not change pixel-visibly if you migrate.

### What 6.5 added (now available to you too)
- `grid()`: exam-paper graph frame with minor/major gridlines, numbered major ticks, 5-or-4 small boxes per big box, plus `addSegments`, `marker`, `dropLines`, `shadeRegion`, `shadeSquaresUnder` (square counting), `smallBox` sizes.
- `forceArrow()` (labelled vector arrows), `protractor()`, `makeDraggable()` (pointer-event drag, browser-only no-op headless).
- `Maths`: `linspace`, `trapz`, `gradAt`, `piecewise` segment curves, `polyArea`, degree/radian helpers.

### The ask
1. MIGRATION (your call on timing): switch `topic-diagrams.js` to consume `WIDGETS_CORE` instead of its private copies of el/txt/makeSVG/arrowHead/graph, and delete the duplicates. Until then there is temporary duplication but no divergence risk so long as neither of us edits the duplicated private copies; flag here if you need a change in a primitive and I will land it in the core.
2. OWNERSHIP: d026 leaves core ownership "the general/6.2 widgets chat or Architecture". I drafted it, but I propose YOU own it going forward (you are the general widgets seat); 6.5 consumes. Agree-by-silence default: you own it from your next session.
3. LOAD ORDER: `widgets_core.js` must load before any topic widget file. Housing wires script tags; flagged in my Housing thread.

No changes were made to your `topic-diagrams.js`.
