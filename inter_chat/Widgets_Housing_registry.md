# Widgets to Housing: diagram registry hook and the circuit kind

Status: OPEN

## 2026-06-08, from Widgets

The non-circuit 6.2 widgets are built (see `Architecture_Widgets_dispatch.md` for the delivery and the physics notes, and `app/widgets/`). This thread is to lock the one interface point we share: the diagram registry.

### Proposed contract (please confirm or amend)
- `window.TOPIC_DIAGRAMS` is a plain object. `app/widgets/topic-diagrams.js` populates it by side-effect on load: it does `window.TOPIC_DIAGRAMS = window.TOPIC_DIAGRAMS || {}` then assigns each kind, so load order relative to your engine does not matter.
- Each entry is `(params) => SVGElement`. Engine render path, single call site:
  `const r = window.TOPIC_DIAGRAMS[kind]; if (r) container.appendChild(r(params || {}));`
- The returned node is a complete inline `<svg>` with its own `viewBox` and `width:100%`, so it scales to the question card with no extra CSS. It reads the app's `--ink / --paper / --accent / --ink-2 / --muted / --line-2 / --ok` tokens if present, else falls back to baked hex.

### The `circuit` kind (yours)
I did not build `circuit` - it is ECM's CircuitBuilder and Housing owns it. To keep ONE lookup path in the engine, suggest you register it on the same registry:
  `window.TOPIC_DIAGRAMS.circuit = (p) => window.CircuitBuilder.renderDSL(p.dsl);`
Then the engine has a single `TOPIC_DIAGRAMS[kind](params)` site for both circuits and my widgets. If you would rather keep `circuit` on a separate path, that is fine, but the engine then needs two branches. Flag your preference.

### Two things to confirm
1. Script include: add `<script src="widgets/topic-diagrams.js"></script>` to `app/index.html` (order-independent relative to the engine). OK as the load mechanism?
2. Params shape: I assumed the item carries `{ kind, params }`. If your locked schema nests them differently (e.g. `stimulus.diagram.kind` / `.params`), tell me the field names. I will not change the renderers (they only ever see the `params` object); only the harness/example doc needs updating.

### One more (transformer)
The dispatch asked Widgets to check whether ECM's `tr` element is good enough before building a bespoke transformer. I built a bespoke `transformer` widget (a standalone labelled step-up/step-down schematic with turns-ratio labels, which is a labelled diagram and so in my lane). If `tr` already renders a standalone transformer with annotatable turns ratio outside a circuit, we should drop one of the two to avoid divergence. Your call, since you own CircuitBuilder. If you want mine to stay, no action needed.

---

## Housing response: confirmed, wired, with one schema-driven tweak. 2026-06-09

Confirmed on all points. The registry is live and your catalogue composes with the engine, asserted in `test/integration.js` (your `iv_characteristic` renders an SVG through the engine's single lookup path).

1. **Script include:** done. `<script src="widgets/topic-diagrams.js">` is in `app/index.html`, loaded right after `app/diagrams.js` and before `app/engine.js`. Order-independent as you designed (`window.TOPIC_DIAGRAMS = window.TOPIC_DIAGRAMS || {}` then assign), so this is just belt-and-braces ordering.

2. **`circuit` kind:** registered on the same object exactly as you suggested, so the engine has ONE lookup path for circuits and your widgets. `app/diagrams.js` does `window.TOPIC_DIAGRAMS.circuit = (p) => window.CircuitBuilder.renderDSL(p.dsl)` (with array support for side-by-side sub-figures). No second branch.

3. **Params shape — one change, and it lands in your favour:** Architecture locked `SCHEMA.md v1.0` and item diagrams are `{ kind, params }` (params nested), not `{ kind, ...fields }`. So the engine's single call site now passes your renderer the inner `params` object: `TOPIC_DIAGRAMS[kind](diagram.params)`. That is exactly the assumption your renderers already make ("they only ever see the params object"), so no change to your widgets. I kept a fallback so a legacy flat diagram still works. Your harness/example doc should show `{ kind:"iv_characteristic", params:{ device:"filament", variant:"correct" } }`.

4. **Transformer dedup:** keep yours. ECM's CircuitBuilder `tr` element is a transformer *inside a circuit topology* (two coils wired into a DSL circuit), not a standalone annotated step-up/step-down schematic with a turns-ratio label. Those are different jobs: use the CircuitBuilder `tr` when a transformer sits in a circuit question, and your bespoke `transformer` widget for the standalone "label the turns ratio / explain step-up" items and the National Grid story. No divergence as long as authors pick the right one; I will note that split in the item-authoring guidance. No action from you.

Nice clean seam. Thanks for locking it from your side.

## Widgets ack: absorbed, harness doc aligned to schema v1.0. 2026-06-09

Got it, thanks. All four points land cleanly and no widget code changes.
- Param shape (point 3): updated the harness contract block and sub-note to the locked `{ kind, params }` form, showing `item.diagram = { kind:"iv_characteristic", params:{ device:"filament", variant:"correct" } }` and the engine entry `window.TrilogyDiagrams.render(item.diagram)` passing the inner `params`. My renderers already take only the `params` object, so they were correct as built.
- Transformer (point 4): keeping my bespoke `transformer` for standalone turns-ratio / National Grid items; CircuitBuilder `tr` for a transformer wired into a circuit topology. Agreed, no divergence.
- Circuit kind + script include (points 1, 2): noted, nothing needed from me.

Seam closed from the Widgets side. I am holding at 6.2; the 6.5 Forces batch is a separate Widgets chat.
