/* =====================================================================
   Trilogy Physics - Electricity 6.2 / National Grid widget catalogue
   Widgets/Diagrams chat deliverable (Architecture dispatch d019).

   Contract (Pre-IB diagrams contract, see Architecture_Widgets_dispatch):
     - Each widget is a renderer keyed by `kind`.
     - Called with a single `params` object.
     - Returns an inline SVG node (SVGElement), ready to appendChild.
     - Registered on window.TOPIC_DIAGRAMS[kind].
   Vanilla SVG only, no libraries, mobile-safe (viewBox + width:100%).

   Theming: editorial paper-on-ink tokens via CSS custom properties with
   hex fallbacks, e.g. var(--ink, #1a1a17). Real-world wire/standard
   colours (mains colour code) are literal, since the colour IS the
   physics there and must not be re-themed.

   Physics models live in a pure-maths `Models` object so they can be
   unit-tested with no DOM. See widgets/verify_models.js and the harness.

   Dual export: attaches to window in a browser; module.exports in Node.
   ===================================================================== */
(function (root) {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var doc = (typeof document !== "undefined") ? document : (root && root.document);

  /* ---- theme tokens (with hex fallbacks matching app/index.html) ---- */
  function tok(name, fallback) { return "var(" + name + ", " + fallback + ")"; }
  var C = {
    ink:   tok("--ink",   "#1a1a17"),
    ink2:  tok("--ink-2", "#4d4943"),
    muted: tok("--muted", "#8c8579"),
    paper: tok("--paper", "#fffdf6"),
    bg:    tok("--bg",    "#faf6ed"),
    accent:tok("--accent","#b03030"),
    ok:    tok("--ok",    "#2d6a3f"),
    line:  tok("--line-2","rgba(26,26,23,.22)")
  };
  /* Standard mains/earth colours - literal, the colour carries the meaning. */
  var WIRE = {
    live:        "#6f4a2a",  /* brown  */
    neutral:     "#1657c4",  /* blue   */
    earthGreen:  "#1f7a36",  /* green  */
    earthYellow: "#e6c326",  /* yellow */
    metal:       "#b9b2a4",
    flesh:       "#d9a878",
    spark:       "#e8a317"
  };

  /* ----------------------------- DOM helpers ----------------------------- */
  function el(tag, attrs, kids) {
    var n = doc.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) if (attrs.hasOwnProperty(k)) {
      if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, String(attrs[k]));
    }
    if (kids) for (var i = 0; i < kids.length; i++) if (kids[i]) n.appendChild(kids[i]);
    return n;
  }
  function txt(x, y, s, attrs) {
    var a = { x: x, y: y, "font-family": "var(--sans, system-ui, sans-serif)",
              "font-size": 12, fill: C.ink2 };
    if (attrs) for (var k in attrs) if (attrs.hasOwnProperty(k)) a[k] = attrs[k];
    var t = el("text", a); t.textContent = s; return t;
  }
  function makeSVG(w, h, label) {
    var s = el("svg", {
      xmlns: NS, viewBox: "0 0 " + w + " " + h, width: "100%",
      preserveAspectRatio: "xMidYMid meet", role: "img",
      "aria-label": label || "", class: "td-svg"
    });
    s.setAttribute("style", "max-width:" + w + "px;height:auto;display:block;font-family:var(--serif, Georgia, serif)");
    s.appendChild(el("title", { text: label || "" }));
    return s;
  }
  function arrowHead(x, y, ang, size, color) {
    var a1 = ang + Math.PI * 0.86, a2 = ang - Math.PI * 0.86, f = function (v) { return v.toFixed(1); };
    return el("path", {
      d: "M" + f(x) + "," + f(y) +
         " L" + f(x + size * Math.cos(a1)) + "," + f(y + size * Math.sin(a1)) +
         " L" + f(x + size * Math.cos(a2)) + "," + f(y + size * Math.sin(a2)) + " Z",
      fill: color, stroke: "none"
    });
  }

  /* ----------------------------- graph frame ----------------------------- */
  /* cfg: {w,h, xmin,xmax,ymin,ymax, xlabel,ylabel, label} -> {svg, px, py, add} */
  function graph(cfg) {
    var w = cfg.w || 340, h = cfg.h || 250;
    var m = { l: 40, r: 20, t: 20, b: 36 };
    var svg = makeSVG(w, h, cfg.label);
    var X0 = m.l, X1 = w - m.r, Y0 = h - m.b, Y1 = m.t;
    var px = function (x) { return X0 + (x - cfg.xmin) / (cfg.xmax - cfg.xmin) * (X1 - X0); };
    var py = function (y) { return Y0 - (y - cfg.ymin) / (cfg.ymax - cfg.ymin) * (Y0 - Y1); };
    var ax = px(Math.max(cfg.xmin, Math.min(cfg.xmax, 0)));   /* x-pixel of value 0 */
    var ay = py(Math.max(cfg.ymin, Math.min(cfg.ymax, 0)));   /* y-pixel of value 0 */

    var g = el("g");
    /* horizontal (x) axis at value y=0 */
    g.appendChild(el("line", { x1: X0, y1: ay, x2: X1, y2: ay, stroke: C.line, "stroke-width": 1.4 }));
    g.appendChild(arrowHead(X1, ay, 0, 6, C.line));
    if (cfg.xmin < 0) g.appendChild(arrowHead(X0, ay, Math.PI, 6, C.line));
    /* vertical (y) axis at value x=0 */
    g.appendChild(el("line", { x1: ax, y1: Y0, x2: ax, y2: Y1, stroke: C.line, "stroke-width": 1.4 }));
    g.appendChild(arrowHead(ax, Y1, -Math.PI / 2, 6, C.line));
    if (cfg.ymin < 0) g.appendChild(arrowHead(ax, Y0, Math.PI / 2, 6, C.line));
    /* axis labels at the positive arrow tips */
    g.appendChild(txt(X1 - 2, ay - 8, cfg.xlabel || "", { "text-anchor": "end", fill: C.ink, "font-style": "italic" }));
    g.appendChild(txt(ax + 7, Y1 + 11, cfg.ylabel || "", { "text-anchor": "start", fill: C.ink, "font-style": "italic" }));
    if (cfg.xmin < 0 || cfg.ymin < 0) g.appendChild(txt(ax - 4, ay + 12, "0", { "text-anchor": "end", fill: C.muted, "font-size": 10 }));
    svg.appendChild(g);

    var api = {
      svg: svg, px: px, py: py,
      /* sample a pure function f over [a,b] and stroke it */
      addFn: function (f, a, b, opts) {
        opts = opts || {};
        var N = opts.n || 220, d = "", i, x, y, first = true;
        for (i = 0; i <= N; i++) {
          x = a + (b - a) * i / N; y = f(x);
          if (y == null || !isFinite(y)) { first = true; continue; }
          d += (first ? "M" : "L") + px(x).toFixed(2) + "," + py(y).toFixed(2) + " ";
          first = false;
        }
        svg.appendChild(el("path", {
          d: d.trim(), fill: "none", stroke: opts.color || C.accent,
          "stroke-width": opts.width || 2.6, "stroke-linecap": "round", "stroke-linejoin": "round",
          "stroke-dasharray": opts.dash || "none"
        }));
        return api;
      },
      add: function (node) { svg.appendChild(node); return api; },
      note: function (x, y, s, attrs) { svg.appendChild(txt(x, y, s, attrs)); return api; }
    };
    return api;
  }

  /* ============================== MODELS ================================= */
  /* Pure maths. Normalised units (axis ~[-1,1] or [0,1]); shape is the point,
     not absolute values. Each documents the physics it encodes.            */
  var Models = {
    iv: {
      /* Ohmic resistor: I proportional to V (Ohm's law at constant R). Odd, linear. */
      ohmic: function (V) { return 0.85 * V; },

      /* Filament lamp (CORRECT). Steep & ~linear near origin (cold, low R),
         current KEEPS rising with V but the gradient falls as the filament
         heats and R rises -> concave for V>0, convex for V<0 (odd-symmetric).
         Model: linear-near-0 saturating term + a residual linear term so the
         gradient never reaches zero (never plateaus, never droops).
         f(V) = sign * [A(1-e^{-k|V|}) + B|V|],  A=1,k=2.2,B=0.18.           */
      filament: function (V) {
        var A = 1, k = 2.2, B = 0.18, a = Math.abs(V), s = Math.sign(V);
        var norm = A * (1 - Math.exp(-k)) + B; /* value at |V|=1 */
        return s * (A * (1 - Math.exp(-k * a)) + B * a) / norm * 0.92;
      },

      /* Diode: ~zero for reverse bias and small forward V, steep rise past a
         forward threshold (~0.6 V). Reverse current taken as 0 (leakage
         negligible at this scale). Threshold at normalised V=0.45.          */
      diode: function (V) {
        if (V <= 0) return 0;
        var Vth = 0.45, k = 9, top = Math.exp(k * (1 - Vth)) - 1;
        var raw = Math.exp(k * (V - Vth)) - 1;
        return Math.max(0, raw / top) * 0.95;
      },

      /* DISTRACTOR (wrong): filament that plateaus flat. Steep tanh saturates
         early so the top is visibly horizontal (current stops rising) - the
         classic wrong "the lamp current levels off" shape. */
      filament_plateau: function (V) { return Math.sign(V) * 0.82 * Math.tanh(4.4 * Math.abs(V)); },

      /* DISTRACTOR (wrong): current rises to a peak then DROPS at high V
         (spurious negative-resistance). f = sign*(c|V| - d|V|^3), peak ~0.69. */
      filament_droop: function (V) {
        var a = Math.abs(V), s = Math.sign(V), val = 2.4 * a - 1.7 * a * a * a;
        return s * (val / 1.097) * 0.84;
      },

      /* DISTRACTOR (wrong): filament drawn as ohmic (straight line). */
      filament_linear: function (V) { return 0.84 * V; },

      /* DISTRACTOR (wrong): straight line with NEGATIVE gradient through the
         origin (current falls as voltage rises). Device-agnostic distractor. */
      negative_line: function (V) { return -0.84 * V; }
    },

    /* Resistance vs voltage (optional widget). */
    rv: {
      resistor: function () { return 0.5; },                 /* constant R */
      filament: function (V) { return 0.22 + 0.6 * Math.abs(V); } /* R rises with V (heating) */
    },

    /* Resistance vs temperature. t normalised 0..1 over the plotted range. */
    rt: {
      /* Thermistor (NTC): R falls as T rises - convex decreasing. */
      thermistor: function (t) { return 0.08 + 0.92 * Math.exp(-3.0 * t); },
      /* Metal wire: R rises with T, roughly linear (positive temp. coeff.). */
      metal_wire: function (t) { return 0.18 + 0.62 * t; },
      /* DISTRACTOR (wrong): straight line with NEGATIVE gradient (R falls
         linearly with T) - the "other way" distractor against the metal wire. */
      negative_line: function (t) { return 0.85 - 0.62 * t; }
    },

    /* Resistance vs light intensity (LDR): R falls as light rises - convex decreasing. */
    rl: { ldr: function (L) { return 0.07 + 0.93 * Math.exp(-3.2 * L); } },

    /* Value vs time. AC: sinusoid about zero. DC: constant > 0. */
    trace: {
      ac: function (t) { return 0.82 * Math.sin(2 * Math.PI * 1.5 * t); },
      dc: function () { return 0.6; }
    }
  };

  /* ============================ GRAPH WIDGETS ============================ */

  /* 1. iv_characteristic */
  function iv_characteristic(p) {
    p = p || {};
    var device = p.device || "ohmic";
    var variant = p.variant || "correct";
    var fn, dom = [-1, 1], cap;
    if (device === "ohmic") { fn = Models.iv.ohmic; cap = "Ohmic resistor"; }
    else if (device === "diode") { fn = Models.iv.diode; cap = "Diode"; }
    else { /* filament */
      cap = "Filament lamp";
      if (variant === "plateau") { fn = Models.iv.filament_plateau; cap += " (distractor: plateaus)"; }
      else if (variant === "droop") { fn = Models.iv.filament_droop; cap += " (distractor: droops)"; }
      else if (variant === "linear") { fn = Models.iv.filament_linear; cap += " (distractor: linear)"; }
      else { fn = Models.iv.filament; }
    }
    /* device-agnostic negative-gradient line distractor */
    if (variant === "negative") { fn = Models.iv.negative_line; cap += " (distractor: negative-gradient line)"; }
    var g = graph({
      xmin: -1, xmax: 1, ymin: device === "diode" ? -0.12 : -1, ymax: 1,
      xlabel: "V", ylabel: "I", label: cap + " current-voltage characteristic"
    });
    g.addFn(fn, dom[0], dom[1]);
    return g.svg;
  }

  /* 2. resistance_voltage (optional, lower priority) */
  function resistance_voltage(p) {
    p = p || {};
    var device = p.device || "resistor";
    var fn = device === "filament" ? Models.rv.filament : Models.rv.resistor;
    var g = graph({ xmin: 0, xmax: 1, ymin: 0, ymax: 1, xlabel: "V", ylabel: "R",
      label: (device === "filament" ? "Filament" : "Resistor") + " resistance against voltage" });
    g.addFn(fn, 0, 1);
    return g.svg;
  }

  /* 3. resistance_temperature */
  function resistance_temperature(p) {
    p = p || {};
    var device = p.device || "thermistor";
    var variant = p.variant || "correct";
    var fn = device === "metal_wire" ? Models.rt.metal_wire : Models.rt.thermistor;
    var cap = device === "metal_wire" ? "Metal wire: R rises with temperature"
                                      : "Thermistor (NTC): R falls as temperature rises";
    if (variant === "negative") { fn = Models.rt.negative_line; cap += " (distractor: negative-gradient line)"; }
    var g = graph({ xmin: 0, xmax: 1, ymin: 0, ymax: 1, xlabel: "temp", ylabel: "R", label: cap });
    g.addFn(fn, 0, 1);
    return g.svg;
  }

  /* 4. resistance_light (LDR) */
  function resistance_light(p) {
    var g = graph({ xmin: 0, xmax: 1, ymin: 0, ymax: 1, xlabel: "light", ylabel: "R",
      label: "LDR: resistance falls as light intensity rises" });
    g.addFn(Models.rl.ldr, 0, 1);
    return g.svg;
  }

  /* 5. ac_dc_trace */
  function ac_dc_trace(p) {
    p = p || {};
    var quantity = p.quantity || "current";   /* current | pd */
    var signal = p.signal || "ac";            /* ac | dc */
    var ylab = quantity === "pd" ? "V" : "I";
    var yname = quantity === "pd" ? "p.d." : "current";
    var g = graph({ xmin: 0, xmax: 1, ymin: -1, ymax: 1, xlabel: "t", ylabel: ylab,
      label: (signal === "ac" ? "Alternating" : "Direct") + " " + yname + " against time" });
    if (signal === "dc") g.addFn(Models.trace.dc, 0, 1);
    else g.addFn(Models.trace.ac, 0, 1);
    return g.svg;
  }

  /* ========================== SCHEMATIC WIDGETS ========================= */

  /* small coil of n bumps along a vertical line at x, from yTop to yBot,
     bumping toward +dir (dir=-1 left, +1 right). */
  function coil(x, yTop, yBot, n, dir) {
    var g = el("g"), r = (yBot - yTop) / (2 * n), i, y = yTop, d = "M" + x + "," + y;
    for (i = 0; i < n; i++) {
      d += " A" + r + "," + r + " 0 0 " + (dir > 0 ? 1 : 0) + " " + x + "," + (y + 2 * r);
      y += 2 * r;
    }
    g.appendChild(el("path", { d: d, fill: "none", stroke: C.ink, "stroke-width": 2.2, "stroke-linecap": "round" }));
    return g;
  }

  /* 6. transformer */
  function transformer(p) {
    p = p || {};
    var type = p.type || "step_up";           /* step_up | step_down */
    var Np = p.Np || (type === "step_up" ? 4 : 8);
    var Ns = p.Ns || (type === "step_up" ? 8 : 4);
    var w = 360, h = 230, svg = makeSVG(w, h, "Transformer schematic (" + type.replace("_", "-") + ")");
    var coreX1 = 150, coreX2 = 210, coreTop = 30, coreBot = 200;

    /* laminated iron core */
    svg.appendChild(el("rect", { x: coreX1, y: coreTop, width: coreX2 - coreX1, height: coreBot - coreTop,
      fill: "none", stroke: C.ink2, "stroke-width": 2 }));
    var lx; for (lx = coreX1 + 7; lx < coreX2; lx += 7)
      svg.appendChild(el("line", { x1: lx, y1: coreTop + 4, x2: lx, y2: coreBot - 4, stroke: C.line, "stroke-width": 1 }));

    /* primary coil (left of core) and secondary (right of core) */
    svg.appendChild(coil(coreX1, 55, 175, Np, -1));
    svg.appendChild(coil(coreX2, 55, 175, Ns, +1));

    /* primary leads + a.c. source */
    svg.appendChild(el("line", { x1: 40, y1: 70, x2: coreX1 - 18, y2: 70, stroke: C.ink, "stroke-width": 2 }));
    svg.appendChild(el("line", { x1: 40, y1: 160, x2: coreX1 - 18, y2: 160, stroke: C.ink, "stroke-width": 2 }));
    svg.appendChild(el("line", { x1: coreX1 - 18, y1: 70, x2: coreX1 - 18, y2: 55, stroke: C.ink, "stroke-width": 2 }));
    svg.appendChild(el("line", { x1: coreX1 - 18, y1: 160, x2: coreX1 - 18, y2: 175, stroke: C.ink, "stroke-width": 2 }));
    svg.appendChild(el("circle", { cx: 40, cy: 115, r: 16, fill: C.paper, stroke: C.ink, "stroke-width": 2 }));
    svg.appendChild(el("path", { d: "M32,115 q4,-7 8,0 q4,7 8,0", fill: "none", stroke: C.ink, "stroke-width": 1.6 }));
    svg.appendChild(el("line", { x1: 40, y1: 99, x2: 40, y2: 70, stroke: C.ink, "stroke-width": 2 }));
    svg.appendChild(el("line", { x1: 40, y1: 131, x2: 40, y2: 160, stroke: C.ink, "stroke-width": 2 }));

    /* secondary leads + load */
    svg.appendChild(el("line", { x1: coreX2 + 18, y1: 70, x2: 320, y2: 70, stroke: C.ink, "stroke-width": 2 }));
    svg.appendChild(el("line", { x1: coreX2 + 18, y1: 160, x2: 320, y2: 160, stroke: C.ink, "stroke-width": 2 }));
    svg.appendChild(el("line", { x1: coreX2 + 18, y1: 70, x2: coreX2 + 18, y2: 55, stroke: C.ink, "stroke-width": 2 }));
    svg.appendChild(el("line", { x1: coreX2 + 18, y1: 160, x2: coreX2 + 18, y2: 175, stroke: C.ink, "stroke-width": 2 }));
    svg.appendChild(el("rect", { x: 308, y: 100, width: 24, height: 30, fill: C.paper, stroke: C.ink, "stroke-width": 2 }));
    svg.appendChild(el("line", { x1: 320, y1: 70, x2: 320, y2: 100, stroke: C.ink, "stroke-width": 2 }));
    svg.appendChild(el("line", { x1: 320, y1: 130, x2: 320, y2: 160, stroke: C.ink, "stroke-width": 2 }));

    /* labels */
    svg.appendChild(txt(95, 210, "Primary", { "text-anchor": "middle", fill: C.ink2, "font-size": 11 }));
    svg.appendChild(txt(95, 224, "Np = " + Np, { "text-anchor": "middle", fill: C.accent, "font-size": 12 }));
    svg.appendChild(txt(265, 210, "Secondary", { "text-anchor": "middle", fill: C.ink2, "font-size": 11 }));
    svg.appendChild(txt(265, 224, "Ns = " + Ns, { "text-anchor": "middle", fill: C.accent, "font-size": 12 }));
    svg.appendChild(txt(180, 22, (type === "step_up" ? "Step-up" : "Step-down") +
      " (Ns " + (Ns > Np ? ">" : "<") + " Np)", { "text-anchor": "middle", fill: C.ink, "font-size": 12 }));
    svg.appendChild(txt(40, 150, "a.c. in", { "text-anchor": "middle", fill: C.muted, "font-size": 10 }));
    return svg;
  }

  /* 7. transmission_line (National Grid) */
  function transmission_line(p) {
    p = p || {};
    var w = 620, h = 250, svg = makeSVG(w, h, "National Grid transmission line");
    var ground = 200;
    svg.appendChild(el("line", { x1: 0, y1: ground, x2: w, y2: ground, stroke: C.line, "stroke-width": 1.4 }));

    function box(x, y, bw, bh, label, sub) {
      svg.appendChild(el("rect", { x: x, y: y, width: bw, height: bh, rx: 3, fill: C.paper, stroke: C.ink, "stroke-width": 1.8 }));
      svg.appendChild(txt(x + bw / 2, y + bh / 2 - 1, label, { "text-anchor": "middle", fill: C.ink, "font-size": 11 }));
      if (sub) svg.appendChild(txt(x + bw / 2, y + bh / 2 + 12, sub, { "text-anchor": "middle", fill: C.accent, "font-size": 10 }));
    }
    function cableLabel(x, v, note) {
      if (v) svg.appendChild(txt(x, 44, v, { "text-anchor": "middle", fill: C.accent, "font-size": 11 }));
      if (note) svg.appendChild(txt(x, 58, note, { "text-anchor": "middle", fill: C.muted, "font-size": 9 }));
    }

    /* power station */
    svg.appendChild(el("rect", { x: 14, y: ground - 46, width: 70, height: 46, fill: C.paper, stroke: C.ink, "stroke-width": 1.8 }));
    svg.appendChild(el("rect", { x: 30, y: ground - 70, width: 9, height: 24, fill: C.ink2 }));
    svg.appendChild(el("circle", { cx: 35, cy: ground - 78, r: 6, fill: "none", stroke: C.muted, "stroke-width": 1.4 }));
    svg.appendChild(el("circle", { cx: 41, cy: ground - 86, r: 7, fill: "none", stroke: C.muted, "stroke-width": 1.2 }));
    svg.appendChild(txt(49, ground + 14, "Power station", { "text-anchor": "middle", fill: C.ink2, "font-size": 10 }));
    cableLabel(49, "~25 kV", "generated");

    /* step-up */
    box(108, ground - 50, 64, 50, "Step-up", "transformer");

    /* pylons + cables (high voltage transmission) */
    var pylonXs = [230, 330, 430];
    function pylon(cx) {
      var topY = 96, baseY = ground;
      svg.appendChild(el("path", { d: "M" + (cx - 16) + "," + baseY + " L" + (cx - 6) + "," + topY +
        " M" + (cx + 16) + "," + baseY + " L" + (cx + 6) + "," + topY +
        " M" + (cx - 6) + "," + topY + " L" + (cx + 6) + "," + topY, fill: "none", stroke: C.ink2, "stroke-width": 1.6 }));
      svg.appendChild(el("line", { x1: cx - 11, y1: 140, x2: cx + 11, y2: 140, stroke: C.ink2, "stroke-width": 1.4 }));
      svg.appendChild(el("line", { x1: cx - 14, y1: 168, x2: cx + 14, y2: 168, stroke: C.ink2, "stroke-width": 1.4 }));
      svg.appendChild(el("line", { x1: cx - 18, y1: 104, x2: cx + 18, y2: 104, stroke: C.ink2, "stroke-width": 1.6 }));
    }
    pylonXs.forEach(pylon);
    /* catenary cables between supports */
    var supports = [176, 212, 312, 412, 470], i;
    for (i = 0; i < supports.length - 1; i++) {
      var sx1 = supports[i], sx2 = supports[i + 1], mid = (sx1 + sx2) / 2;
      svg.appendChild(el("path", { d: "M" + sx1 + ",104 Q" + mid + ",120 " + sx2 + ",104",
        fill: "none", stroke: C.accent, "stroke-width": 1.8 }));
    }
    cableLabel(330, "400 kV", "high V, low I");

    /* step-down */
    box(474, ground - 50, 64, 50, "Step-down", "transformer");

    /* homes */
    function house(x) {
      var y = ground;
      svg.appendChild(el("path", { d: "M" + x + "," + y + " L" + x + "," + (y - 20) + " L" + (x + 14) + "," + (y - 30) +
        " L" + (x + 28) + "," + (y - 20) + " L" + (x + 28) + "," + y + " Z", fill: C.paper, stroke: C.ink, "stroke-width": 1.6 }));
    }
    house(560); house(584);
    svg.appendChild(txt(584, ground + 14, "Homes", { "text-anchor": "middle", fill: C.ink2, "font-size": 10 }));
    cableLabel(560, "230 V", "domestic");

    /* connecting wires */
    svg.appendChild(el("line", { x1: 84, y1: ground - 30, x2: 108, y2: ground - 30, stroke: C.ink, "stroke-width": 1.6 }));
    svg.appendChild(el("line", { x1: 140, y1: ground - 50, x2: 140, y2: 104, stroke: C.accent, "stroke-width": 1.6 }));
    svg.appendChild(el("line", { x1: 140, y1: 104, x2: 176, y2: 104, stroke: C.accent, "stroke-width": 1.6 }));
    svg.appendChild(el("line", { x1: 470, y1: 104, x2: 506, y2: 104, stroke: C.accent, "stroke-width": 1.6 }));
    svg.appendChild(el("line", { x1: 506, y1: 104, x2: 506, y2: ground - 50, stroke: C.accent, "stroke-width": 1.6 }));
    svg.appendChild(el("line", { x1: 538, y1: ground - 30, x2: 560, y2: ground - 30, stroke: C.ink, "stroke-width": 1.6 }));

    /* the physics caption */
    svg.appendChild(txt(w / 2, h - 8,
      "Transmit at high voltage -> low current -> small power loss in cables (P = I squared R)",
      { "text-anchor": "middle", fill: C.ink, "font-size": 11 }));
    return svg;
  }

  /* 8. mains_three_wire */
  function mains_three_wire(p) {
    p = p || {};
    var w = 380, h = 230, svg = makeSVG(w, h, "Three-core mains cable colour code");
    /* outer sheath / cable on the left */
    svg.appendChild(el("rect", { x: 16, y: 50, width: 70, height: 130, rx: 14, fill: "#efe9dc", stroke: C.ink2, "stroke-width": 1.6 }));
    svg.appendChild(txt(51, 196, "outer sheath", { "text-anchor": "middle", fill: C.muted, "font-size": 9 }));

    function wire(y, color, dashed, label, role, pin) {
      var x0 = 70, x1 = 250;
      if (dashed) {
        /* earth: green/yellow striped */
        svg.appendChild(el("line", { x1: x0, y1: y, x2: x1, y2: y, stroke: WIRE.earthGreen, "stroke-width": 7 }));
        svg.appendChild(el("line", { x1: x0, y1: y, x2: x1, y2: y, stroke: WIRE.earthYellow, "stroke-width": 7,
          "stroke-dasharray": "7 7" }));
      } else {
        svg.appendChild(el("line", { x1: x0, y1: y, x2: x1, y2: y, stroke: color, "stroke-width": 7 }));
      }
      svg.appendChild(el("rect", { x: x1, y: y - 11, width: 22, height: 22, rx: 2, fill: C.paper, stroke: C.ink, "stroke-width": 1.6 }));
      svg.appendChild(txt(x1 + 11, y + 4, pin, { "text-anchor": "middle", fill: C.ink, "font-size": 12 }));
      svg.appendChild(txt(290, y - 2, label, { fill: C.ink, "font-size": 12 }));
      svg.appendChild(txt(290, y + 12, role, { fill: C.muted, "font-size": 9.5 }));
    }
    wire(75,  WIRE.live,    false, "Live", "brown", "L");
    wire(115, WIRE.neutral, false, "Neutral", "blue", "N");
    wire(155, null,         true,  "Earth", "green & yellow", "E");

    svg.appendChild(txt(w / 2, 28, "Three-wire mains cable: colour code", { "text-anchor": "middle", fill: C.ink, "font-size": 13 }));
    return svg;
  }

  /* 9. live_earth_danger */
  function live_earth_danger(p) {
    p = p || {};
    var w = 380, h = 270, svg = makeSVG(w, h, "Electric shock hazard: live-to-earth fault path");
    var ground = 232;
    /* ground / earth hatch */
    svg.appendChild(el("line", { x1: 0, y1: ground, x2: w, y2: ground, stroke: C.ink2, "stroke-width": 2 }));
    var gx; for (gx = 8; gx < w; gx += 16)
      svg.appendChild(el("line", { x1: gx, y1: ground, x2: gx - 8, y2: ground + 9, stroke: C.muted, "stroke-width": 1 }));
    svg.appendChild(txt(w - 8, ground + 20, "earth (0 V)", { "text-anchor": "end", fill: C.muted, "font-size": 10 }));

    /* faulty appliance with a metal case; live wire touching the case */
    svg.appendChild(el("rect", { x: 40, y: 96, width: 92, height: 70, rx: 4, fill: WIRE.metal, stroke: C.ink2, "stroke-width": 2 }));
    svg.appendChild(txt(86, 88, "metal case", { "text-anchor": "middle", fill: C.ink2, "font-size": 10 }));
    svg.appendChild(el("line", { x1: 0, y1: 120, x2: 70, y2: 120, stroke: WIRE.live, "stroke-width": 5 }));
    svg.appendChild(el("line", { x1: 70, y1: 120, x2: 84, y2: 130, stroke: WIRE.live, "stroke-width": 5 }));
    svg.appendChild(txt(8, 112, "live (brown)", { fill: WIRE.live, "font-size": 10 }));
    svg.appendChild(el("circle", { cx: 86, cy: 132, r: 5, fill: WIRE.spark }));
    svg.appendChild(txt(110, 180, "fault: live touches case", { "text-anchor": "middle", fill: C.accent, "font-size": 10 }));

    /* person touching the case (simple figure) */
    var pcx = 232;
    svg.appendChild(el("circle", { cx: pcx, cy: 96, r: 13, fill: WIRE.flesh, stroke: C.ink2, "stroke-width": 1.4 }));
    svg.appendChild(el("line", { x1: pcx, y1: 109, x2: pcx, y2: 168, stroke: C.ink, "stroke-width": 3 }));
    svg.appendChild(el("line", { x1: pcx, y1: 122, x2: 132, y2: 138, stroke: C.ink, "stroke-width": 3 }));
    svg.appendChild(el("line", { x1: pcx, y1: 122, x2: pcx + 26, y2: 142, stroke: C.ink, "stroke-width": 3 }));
    svg.appendChild(el("line", { x1: pcx, y1: 168, x2: pcx - 16, y2: ground, stroke: C.ink, "stroke-width": 3 }));
    svg.appendChild(el("line", { x1: pcx, y1: 168, x2: pcx + 16, y2: ground, stroke: C.ink, "stroke-width": 3 }));

    /* current path arrows: live -> case -> arm -> body -> feet -> earth */
    function dot(x, y) { svg.appendChild(el("circle", { cx: x, cy: y, r: 2.6, fill: C.accent })); }
    var path = [[20, 120], [86, 132], [160, 140], [pcx, 150], [pcx, 168], [pcx - 15, ground - 2]], i;
    for (i = 0; i < path.length; i++) dot(path[i][0], path[i][1]);
    svg.appendChild(arrowHead(180, 142, 0.2, 7, C.accent));
    svg.appendChild(arrowHead(pcx, 162, Math.PI / 2, 7, C.accent));
    svg.appendChild(arrowHead(pcx - 12, ground - 8, Math.PI / 2 + 0.5, 7, C.accent));
    svg.appendChild(txt(pcx + 58, 150, "current flows", { fill: C.accent, "font-size": 10 }));
    svg.appendChild(txt(pcx + 58, 163, "through the body", { fill: C.accent, "font-size": 10 }));
    svg.appendChild(txt(pcx + 58, 176, "to earth", { fill: C.accent, "font-size": 10 }));

    svg.appendChild(txt(w / 2, 24, "Live-to-earth fault: danger of electric shock", { "text-anchor": "middle", fill: C.ink, "font-size": 13 }));
    svg.appendChild(txt(w / 2, h - 6, "An earth wire gives a safe low-resistance path, blowing the fuse", { "text-anchor": "middle", fill: C.muted, "font-size": 10 }));
    return svg;
  }

  /* ============================ REGISTRATION ============================ */
  var registry = {
    iv_characteristic: iv_characteristic,
    resistance_voltage: resistance_voltage,
    resistance_temperature: resistance_temperature,
    resistance_light: resistance_light,
    ac_dc_trace: ac_dc_trace,
    transformer: transformer,
    transmission_line: transmission_line,
    mains_three_wire: mains_three_wire,
    live_earth_danger: live_earth_danger
  };

  if (typeof window !== "undefined") {
    window.TOPIC_DIAGRAMS = window.TOPIC_DIAGRAMS || {};
    for (var k in registry) if (registry.hasOwnProperty(k)) window.TOPIC_DIAGRAMS[k] = registry[k];
    window.TOPIC_DIAGRAMS_MODELS = Models;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { registry: registry, Models: Models };
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
