/* ============================================================================
   Trilogy Physics — diagram registry (window.TOPIC_DIAGRAMS), v0.1
   ----------------------------------------------------------------------------
   Housing owns this registry; the Widgets/Diagrams chat plugs renderers into
   it (d019 (Widgets chat commissioned)). Contract (reused from the Pre-IB
   diagrams brief, confirmed with Widgets in
   inter_chat/Architecture_Widgets_dispatch.md):

       window.TOPIC_DIAGRAMS[kind] = function (params) -> SVGElement | null

   An item that needs a visual carries  diagram: { kind: "<kind>", ...params }.
   The engine looks up TOPIC_DIAGRAMS[diagram.kind] and calls it with the whole
   diagram object as params, inserting the returned node above the prompt. A
   renderer returns null (or throws) to mean "cannot render"; the engine then
   shows a small, non-fatal placeholder so a missing widget never blanks a
   question.

   Ships ONE renderer, `circuit`, wired to Electric Circuits Mastery's Circuit
   Builder embed (d016 (engine blend: use ECM's Circuit Builder embed)). Every
   other Widgets kind (iv_characteristic, resistance_temperature,
   resistance_light, ac_dc_trace, transformer, transmission_line,
   mains_three_wire, live_earth_danger) is left for the Widgets chat to register
   against this same object.
   ============================================================================ */

(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";
  var REGISTRY = (window.TOPIC_DIAGRAMS = window.TOPIC_DIAGRAMS || {});

  function renderCircuit(params) {
    var CB = window.CircuitBuilder;
    if (!CB || typeof CB.renderDSL !== "function") return null;
    var src = params.dsl != null ? params.dsl
            : params.circuit != null ? params.circuit
            : params.circuit_template;
    if (src == null) return null;
    var list = Array.isArray(src) ? src : [src];
    if (list.length === 1) return CB.renderDSL(String(list[0]));

    var wrap = document.createElementNS(SVG_NS, "svg");
    wrap.setAttribute("class", "diagram-multi");
    var figs = [], totalW = 0, maxH = 0;
    list.forEach(function (dsl, i) {
      var node = CB.renderDSL(String(dsl));
      if (!node) return;
      var w = parseFloat(node.getAttribute("width")) || 200;
      var h = parseFloat(node.getAttribute("height")) || 120;
      figs.push({ node: node, w: w, h: h, label: "(" + String.fromCharCode(97 + i) + ")" });
      totalW += w + 24;
      if (h > maxH) maxH = h;
    });
    if (!figs.length) return null;
    var labelH = 20;
    wrap.setAttribute("width", totalW);
    wrap.setAttribute("height", maxH + labelH);
    wrap.setAttribute("viewBox", "0 0 " + totalW + " " + (maxH + labelH));
    var x = 0;
    figs.forEach(function (f) {
      var t = document.createElementNS(SVG_NS, "text");
      t.setAttribute("x", x + 4); t.setAttribute("y", 14);
      t.setAttribute("font-size", "13");
      t.setAttribute("font-family", "system-ui, sans-serif");
      t.setAttribute("fill", "var(--ink-2, #4d4943)");
      t.textContent = f.label;
      wrap.appendChild(t);
      var g = document.createElementNS(SVG_NS, "g");
      g.setAttribute("transform", "translate(" + x + "," + labelH + ")");
      g.appendChild(f.node);
      wrap.appendChild(g);
      x += f.w + 24;
    });
    return wrap;
  }

  if (!REGISTRY.circuit) REGISTRY.circuit = renderCircuit;

  function renderDiagram(diagram) {
    if (!diagram || typeof diagram !== "object" || !diagram.kind) return null;
    var fn = REGISTRY[diagram.kind];
    if (typeof fn !== "function") return null;
    try {
      // Locked SCHEMA.md v1.0: item.diagram is { kind, params }. Pass the inner
      // params to the renderer; fall back to the whole object for legacy items
      // that put fields (e.g. dsl) directly on the diagram.
      var params = (diagram.params && typeof diagram.params === "object") ? diagram.params : diagram;
      var node = fn(params);
      if (typeof Node !== "undefined") return node instanceof Node ? node : null;
      return node || null;
    } catch (e) {
      if (window.console) console.warn("TOPIC_DIAGRAMS[" + diagram.kind + "] threw:", e);
      return null;
    }
  }

  window.TrilogyDiagrams = {
    render: renderDiagram,
    registry: REGISTRY,
    kinds: function () { return Object.keys(REGISTRY); }
  };
})();
