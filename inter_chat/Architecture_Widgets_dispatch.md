# Architecture to Widgets/Diagrams: Electricity 6.2 widget catalogue

Status: OPEN

## 2026-06-08, from Architecture (Widgets chat commissioned per d019)

You build the non-circuit visual widgets for Electricity 6.2 and the National Grid. Circuits, transformers-in-a-circuit, and required-practical apparatus are handled by the Circuit Builder (Housing); you own everything that is a graph or a labelled diagram.

Interface (reuse the Pre-IB diagrams contract, see `G:\My Drive\github local files\preibphysics\new\BRIEF_diagrams_chat.md`): each widget is a renderer keyed by `kind`, called with a `params` object, returning an inline SVG node, registered on the engine's diagram registry (`window.TOPIC_DIAGRAMS[kind]`). Vanilla SVG only, no heavy libraries, mobile-safe, editorial paper-on-ink tokens (`--ink`, `--paper`, `--accent`, etc.). Coordinate the exact registry hook with Housing. Ship a small test harness (an index.html rendering each kind with sample params) for Architecture to eyeball.

**Physical correctness is the priority.** Where noted, also provide deliberately-wrong distractor variants so Authoring can use them as MCQ options.

### Widgets

1. **`iv_characteristic`** (params: `device` = ohmic | filament | diode; `variant` = correct | distractor flavour).
   - **Ohmic resistor:** straight line through the origin (I proportional to V), symmetric through negative.
   - **Filament lamp:** S-shaped curve through the origin; current KEEPS INCREASING with V but the gradient decreases (curve flattens) as the filament heats and resistance rises. It must never plateau flat and never droop downward. This is the one to get exactly right.
   - **Diode:** ~zero current for reverse bias and small forward V, then a steep rise past the threshold.
   - **Distractor variants (filament especially):** a version that plateaus flat, and a version where current begins to drop again at high V. Both are wrong; offer them as named variants.
2. **`resistance_voltage`** (optional): R against V for a component (resistor: horizontal; filament: rising). Lower priority.
3. **`resistance_temperature`** (params: `device` = thermistor | metal_wire).
   - **Thermistor (NTC):** resistance falls as temperature rises (decreasing curve).
   - **Metal wire:** resistance rises with temperature (increasing, roughly linear).
4. **`resistance_light`**: LDR, resistance falls as light intensity rises (decreasing curve).
5. **`ac_dc_trace`** (params: `quantity` = current | pd; `signal` = ac | dc): a value-against-time trace. AC is a sinusoid oscillating about zero; DC is a constant horizontal line. Used for both the current and the potential-difference versions.
6. **`transformer`**: step-up / step-down schematic (primary and secondary coils on a core, turns ratio annotatable). First check whether the Circuit Builder `tr` element is good enough with Housing; build bespoke only if not.
7. **`transmission_line`** (National Grid): power station, step-up transformer, pylons/cables, step-down transformer, homes, annotated to show transmission at high voltage and low current (the P = I^2 R loss-reduction story). A widget, not a photo.
8. **`mains_three_wire`**: a plug or cable showing the three-wire colour code: live = brown, neutral = blue, earth = green-and-yellow.
9. **`live_earth_danger`**: illustrates the hazard of a conducting path between the live wire and earth (fault path through a person to ground), for the electrical-safety items.

### Boundaries
Do not author questions or build the engine. Surface any new widget needs from Authoring back through Architecture. Keep each widget's physics defensible; cite the behaviour you assumed in your hand-back note.

---

## 2026-06-08, from Widgets (delivery: all 9 kinds + test harness)

Shipped to `app/widgets/`:
- `topic-diagrams.js` - the renderers plus a pure-maths `Models` object (no DOM), dual-exported to `window` (browser) and `module.exports` (Node).
- `index.html` - the test harness: every `kind` and every variant rendered with sample params, distractors flagged, and an in-browser physics self-check panel.
- `verify_models.js` - Node assertions on the physics (20 of 20 pass).
- `render_svgs.js` - a tiny SVG-DOM shim that runs the browser renderers headless and serialises each widget to SVG.
- `previews/` - rasterised PNGs of all 16 sample renders plus a `contact_sheet.png`, so this seat can eyeball them without opening a browser.

Interface exactly as commissioned: each renderer is `window.TOPIC_DIAGRAMS[kind](params) -> SVGElement`. Vanilla SVG, no libraries, mobile-safe (every widget is a single `<svg>` with its own `viewBox` and `width:100%`). Editorial tokens are used with hex fallbacks, e.g. `var(--ink, #1a1a17)`, so the widgets theme with the app but still render standalone. The exact registry hook and the `circuit`-kind coordination are in `Widgets_Housing_registry.md`.

### Physics assumed (cited per dispatch)
- `iv_characteristic` ohmic: I proportional to V, straight line through the origin, symmetric through negative (constant R).
- `iv_characteristic` filament (CORRECT): odd-symmetric S-shape. Near the origin it is approximately ohmic (cold filament, low R); as |V| rises the filament heats and R rises, so the gradient falls monotonically, but current KEEPS increasing. Modelled I = sign(V)[A(1-e^-k|V|) + B|V|] with A=1, k=2.2, B=0.18; the residual B|V| term guarantees the gradient never reaches zero. Verified numerically: strictly increasing, strictly concave for V>0, minimum gradient stays clearly positive (so it never plateaus and never droops).
- `iv_characteristic` diode: ~zero current for reverse bias and small forward V, then a steep (exponential) rise past a forward threshold (~0.6 V, normalised 0.45). Reverse leakage taken as exactly 0 at this scale.
- `resistance_temperature` thermistor (NTC): R falls as temperature rises (convex decreasing). metal_wire: R rises with temperature, roughly linear (positive temperature coefficient).
- `resistance_light` LDR: R falls as light intensity rises (convex decreasing).
- `ac_dc_trace`: AC is a sinusoid oscillating about zero; DC is a constant positive horizontal line. One renderer serves both the current and the p.d. versions (axis label switches).
- `resistance_voltage` (optional, built): resistor horizontal (constant R); filament rising (R increases with V through heating).
- `transformer`: laminated iron core, primary and secondary coils, turns annotated (Np, Ns). Step-up has Ns>Np, step-down Ns<Np. a.c. source on the primary, load on the secondary.
- `transmission_line`: ~25 kV generation -> step-up -> 400 kV transmission on pylons -> step-down -> 230 V domestic, annotated "high V, low I" and captioned with the P = I^2 R loss-reduction story.
- `mains_three_wire`: live brown, neutral blue, earth green-and-yellow (UK/EU harmonised colours).
- `live_earth_danger`: fault path live -> exposed metal case -> person -> earth; captioned that an earth wire provides a safe low-resistance path that blows the fuse.

### Distractors for Authoring (named variants of `iv_characteristic`)
Filament `variant: "plateau"` (wrongly flattens to horizontal), `variant: "droop"` (wrongly falls at high V), `variant: "linear"` (wrongly drawn ohmic). All three are verified to be wrong in the intended way, so Authoring can use them as MCQ options against the correct filament curve.

### Coordination flagged
- Transformer: I built a bespoke labelled `transformer` schematic. The dispatch asked to first check whether the Circuit Builder `tr` element suffices. That is a Housing call (they own CircuitBuilder); raised in `Widgets_Housing_registry.md`. If `tr` covers a standalone step-up/step-down with turns-ratio labels, mine can be dropped.
- Colour tokens vs literal colours: for `mains_three_wire` and the live wire in `live_earth_danger` I used literal standard wire colours rather than theme tokens, because the colour IS the assessed content and must not be re-themed. Everything else uses the editorial tokens.
- No new widget needs have come back from Authoring yet; will surface any through this thread.

Boundaries respected: no questions authored, no engine built.

## 2026-06-08, from Widgets (distractor refinements, per Smith)

- Filament `plateau` distractor flattened: it now saturates earlier (steeper tanh) so the top is dead-horizontal, reading clearly as "the lamp current levels off". Verified its gradient is already small by mid-range (V=0.7) and ~0 at high V.
- Added a NEGATIVE-gradient straight-line distractor ("goes the other way") to two widgets:
  - `iv_characteristic` `variant: "negative"` - a line through the origin with negative gradient (current falling as V rises). Device-agnostic.
  - `resistance_temperature` `variant: "negative"` - a falling straight line, the wrong-direction option against the metal wire (and a wrong-shape option against the thermistor).
- Harness and previews updated (18 sample renders now). Model assertions: 23 of 23 pass.

---

## Housing note: registry wired, your catalogue composes. 2026-06-08

Confirmed from the Housing side. `app/diagrams.js` provides `window.TOPIC_DIAGRAMS` and the `circuit` kind; your `app/widgets/topic-diagrams.js` registers the other ten kinds onto the same object with zero collision. I wired `<script src="widgets/topic-diagrams.js">` into `app/index.html` (loaded right after `diagrams.js`, before `engine.js`). The engine calls `window.TrilogyDiagrams.render(item.diagram)` and inserts your SVG above the prompt; null falls back to a non-fatal placeholder. Cross-chat composition is asserted in `test/integration.js` (iv_characteristic renders an SVG through the engine's registry path). When an item author sets `diagram:{ kind:"iv_characteristic", device:"filament", variant:"correct" }` it now renders live. No interface change needed from you.

## 2026-06-19, from Architecture: graph axis-label fix (d060; log review/PLAYTEST_FEEDBACK_2026-06-19.md)
Playtest found axis labels colliding with the curve and rendering INSIDE the plot (the AC/DC V-t trace and the LDR R-vs-light graph; the "t" sits under the line). Fix in widgets_core graph(): axis labels OUTSIDE the axes, y-axis label on the opposite side from the curve, x-axis label clear of the plotted line. This is the shared core, so it benefits every graph widget across 6.2/6.5/6.6/6.7. Please land it in the core and re-run the topic verifiers.
