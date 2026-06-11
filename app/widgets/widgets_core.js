/* =====================================================================
   Trilogy Physics - widgets_core: shared widget primitives
   Factored per d026 (widgets are topic-scoped chats on a shared core):
   one set of graph/axis/arrow primitives for ALL topic widget files,
   so topic chats build on this rather than forking each other's code.

   Seeded from the 6.2 widget file's primitives (el/txt/makeSVG/
   arrowHead/graph, unchanged semantics) and extended for 6.5 with:
     - grid():        graph frame WITH minor/major gridlines and numbered
                      ticks (5, sometimes 4, small boxes per big box;
                      readings land ON gridlines)
     - forceArrow():  labelled vector arrow, head sized with width
     - shadeSquaresUnder(): square-count shading under a curve
                      (full squares strong, part squares light)
     - protractor():  semicircular protractor with two degree scales
     - makeDraggable(): pointer-event drag helper (browser only)
     - Maths:         piecewise segment curves, trapezoid area,
                      numeric gradient, linspace
   Vanilla SVG, no libraries, mobile-safe, editorial paper-on-ink
   tokens with hex fallbacks. Dual export: window.WIDGETS_CORE in a
   browser, module.exports in Node (for headless physics checks).

   Owner note: owned centrally per d026; topic widget files (6.2, 6.5,
   ...) consume it. Coordinate changes through inter_chat.
   ===================================================================== */
(function (root) {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var doc = (typeof document !== "undefined") ? document : (root && root.document);

  /* ---- theme tokens (hex fallbacks match app/index.html) ---- */
  function tok(name, fallback) { return "var(" + name + ", " + fallback + ")"; }
  var C = {
    ink:    tok("--ink",   "#1a1a17"),
    ink2:   tok("--ink-2", "#4d4943"),
    muted:  tok("--muted", "#8c8579"),
    paper:  tok("--paper", "#fffdf6"),
    bg:     tok("--bg",    "#faf6ed"),
    accent: tok("--accent","#b03030"),
    ok:     tok("--ok",    "#2d6a3f"),
    line:   tok("--line-2","rgba(26,26,23,.22)"),
    gridMinor: "rgba(26,26,23,.10)",
    gridMajor: "rgba(26,26,23,.26)",
    shade:     "rgba(176,48,48,.28)",
    shadeLight:"rgba(176,48,48,.12)"
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

  /* number formatting that trims float noise: 0.6000000000000001 -> "0.6" */
  function fmt(v) {
    if (!isFinite(v)) return "";
    var r = Math.round(v * 1e6) / 1e6;
    return String(r);
  }

  /* ------------------- plain graph frame (6.2 style, no grid) ------------ */
  /* cfg: {w,h, xmin,xmax,ymin,ymax, xlabel,ylabel, label} -> api
     Kept behaviour-compatible with the 6.2 file's graph() so the 6.2 chat
     can migrate onto the core without re-eyeballing its renders.          */
  function graph(cfg) {
    var w = cfg.w || 340, h = cfg.h || 250;
    var m = { l: 40, r: 20, t: 20, b: 36 };
    var svg = makeSVG(w, h, cfg.label);
    var X0 = m.l, X1 = w - m.r, Y0 = h - m.b, Y1 = m.t;
    var px = function (x) { return X0 + (x - cfg.xmin) / (cfg.xmax - cfg.xmin) * (X1 - X0); };
    var py = function (y) { return Y0 - (y - cfg.ymin) / (cfg.ymax - cfg.ymin) * (Y0 - Y1); };
    var ax = px(Math.max(cfg.xmin, Math.min(cfg.xmax, 0)));
    var ay = py(Math.max(cfg.ymin, Math.min(cfg.ymax, 0)));

    var g = el("g");
    g.appendChild(el("line", { x1: X0, y1: ay, x2: X1, y2: ay, stroke: C.line, "stroke-width": 1.4 }));
    g.appendChild(arrowHead(X1, ay, 0, 6, C.line));
    if (cfg.xmin < 0) g.appendChild(arrowHead(X0, ay, Math.PI, 6, C.line));
    g.appendChild(el("line", { x1: ax, y1: Y0, x2: ax, y2: Y1, stroke: C.line, "stroke-width": 1.4 }));
    g.appendChild(arrowHead(ax, Y1, -Math.PI / 2, 6, C.line));
    if (cfg.ymin < 0) g.appendChild(arrowHead(ax, Y0, Math.PI / 2, 6, C.line));
    g.appendChild(txt(X1 - 2, ay - 8, cfg.xlabel || "", { "text-anchor": "end", fill: C.ink, "font-style": "italic" }));
    g.appendChild(txt(ax + 7, Y1 + 11, cfg.ylabel || "", { "text-anchor": "start", fill: C.ink, "font-style": "italic" }));
    if (cfg.xmin < 0 || cfg.ymin < 0) g.appendChild(txt(ax - 4, ay + 12, "0", { "text-anchor": "end", fill: C.muted, "font-size": 10 }));
    svg.appendChild(g);

    var api = {
      svg: svg, px: px, py: py,
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

  /* --------------- gridded graph frame (exam-paper style) ---------------- */
  /* cfg: { w, h, xmin=0, xmax, ymin=0, ymax,
            xstep, ystep            big-box value steps (ticks numbered here)
            minorDiv = 5 | 4        small boxes per big box (dispatch: 5,
                                    sometimes 4)
            xlabel, ylabel          axis quantity labels, e.g. "time / s"
            label                   aria/title
            tickEvery = 1           number every nth major tick (declutter) }
     Readings are designed to land ON gridlines: pick xstep/ystep and data
     so values sit at small-box intersections.                              */
  function grid(cfg) {
    var w = cfg.w || 420, h = cfg.h || 300;
    var m = { l: 52, r: 18, t: 18, b: 46 };
    var xmin = cfg.xmin || 0, ymin = cfg.ymin || 0;
    var xmax = cfg.xmax, ymax = cfg.ymax;
    var minorDiv = cfg.minorDiv || 5;
    var xstep = cfg.xstep, ystep = cfg.ystep;
    var tickEvery = cfg.tickEvery || 1;
    var svg = makeSVG(w, h, cfg.label);
    var X0 = m.l, X1 = w - m.r, Y0 = h - m.b, Y1 = m.t;
    var px = function (x) { return X0 + (x - xmin) / (xmax - xmin) * (X1 - X0); };
    var py = function (y) { return Y0 - (y - ymin) / (ymax - ymin) * (Y0 - Y1); };
    var dxMinor = xstep / minorDiv, dyMinor = ystep / minorDiv;
    var EPS = 1e-9;

    var gGrid = el("g"), gAxes = el("g");
    var x, y, isMajorX, isMajorY, idx;
    for (x = xmin, idx = 0; x <= xmax + EPS; x += dxMinor, idx++) {
      isMajorX = (idx % minorDiv === 0);
      gGrid.appendChild(el("line", { x1: px(x), y1: Y0, x2: px(x), y2: Y1,
        stroke: isMajorX ? C.gridMajor : C.gridMinor, "stroke-width": isMajorX ? 1 : 0.6 }));
    }
    for (y = ymin, idx = 0; y <= ymax + EPS; y += dyMinor, idx++) {
      isMajorY = (idx % minorDiv === 0);
      gGrid.appendChild(el("line", { x1: X0, y1: py(y), x2: X1, y2: py(y),
        stroke: isMajorY ? C.gridMajor : C.gridMinor, "stroke-width": isMajorY ? 1 : 0.6 }));
    }
    svg.appendChild(gGrid);

    gAxes.appendChild(el("line", { x1: X0, y1: Y0, x2: X1, y2: Y0, stroke: C.ink, "stroke-width": 1.6 }));
    gAxes.appendChild(el("line", { x1: X0, y1: Y0, x2: X0, y2: Y1, stroke: C.ink, "stroke-width": 1.6 }));
    var tickN;
    if (cfg.tickLabels !== false) {
      for (x = xmin, tickN = 0; x <= xmax + EPS; x += xstep, tickN++) {
        if (tickN % tickEvery === 0)
          gAxes.appendChild(txt(px(x), Y0 + 16, fmt(x), { "text-anchor": "middle", "font-size": 10.5, fill: C.ink2 }));
      }
      for (y = ymin, tickN = 0; y <= ymax + EPS; y += ystep, tickN++) {
        if (tickN % tickEvery === 0)
          gAxes.appendChild(txt(X0 - 6, py(y) + 3.5, fmt(y), { "text-anchor": "end", "font-size": 10.5, fill: C.ink2 }));
      }
    }
    gAxes.appendChild(txt((X0 + X1) / 2, h - 8, cfg.xlabel || "",
      { "text-anchor": "middle", fill: C.ink, "font-size": 12, "font-style": "italic" }));
    var ylab = txt(0, 0, cfg.ylabel || "", { "text-anchor": "middle", fill: C.ink, "font-size": 12, "font-style": "italic" });
    ylab.setAttribute("transform", "translate(13," + ((Y0 + Y1) / 2) + ") rotate(-90)");
    gAxes.appendChild(ylab);
    svg.appendChild(gAxes);

    var api = {
      svg: svg, px: px, py: py,
      smallBox: { dx: dxMinor, dy: dyMinor },
      plot: { X0: X0, X1: X1, Y0: Y0, Y1: Y1 },
      bounds: { xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax },
      addFn: function (f, a, b, opts) {
        opts = opts || {};
        var N = opts.n || 220, d = "", i, xx, yy, first = true;
        for (i = 0; i <= N; i++) {
          xx = a + (b - a) * i / N; yy = f(xx);
          if (yy == null || !isFinite(yy)) { first = true; continue; }
          d += (first ? "M" : "L") + px(xx).toFixed(2) + "," + py(yy).toFixed(2) + " ";
          first = false;
        }
        svg.appendChild(el("path", { d: d.trim(), fill: "none", stroke: opts.color || C.accent,
          "stroke-width": opts.width || 2.6, "stroke-linecap": "round", "stroke-linejoin": "round",
          "stroke-dasharray": opts.dash || "none" }));
        return api;
      },
      addSegments: function (pts, opts) {
        opts = opts || {};
        var d = "", i;
        for (i = 0; i < pts.length; i++)
          d += (i ? "L" : "M") + px(pts[i][0]).toFixed(2) + "," + py(pts[i][1]).toFixed(2) + " ";
        svg.appendChild(el("path", { d: d.trim(), fill: "none", stroke: opts.color || C.accent,
          "stroke-width": opts.width || 2.6, "stroke-linecap": "round", "stroke-linejoin": "round",
          "stroke-dasharray": opts.dash || "none" }));
        return api;
      },
      marker: function (xv, yv, opts) {
        opts = opts || {};
        svg.appendChild(el("circle", { cx: px(xv), cy: py(yv), r: opts.r || 3.4,
          fill: opts.fill || C.accent, stroke: C.paper, "stroke-width": 1 }));
        return api;
      },
      dropLines: function (xv, yv, opts) {
        opts = opts || {};
        var col = opts.color || C.ink2;
        svg.appendChild(el("line", { x1: px(xv), y1: py(yv), x2: px(xv), y2: Y0,
          stroke: col, "stroke-width": 1.1, "stroke-dasharray": "4 3" }));
        svg.appendChild(el("line", { x1: px(xv), y1: py(yv), x2: X0, y2: py(yv),
          stroke: col, "stroke-width": 1.1, "stroke-dasharray": "4 3" }));
        return api;
      },
      shadeRegion: function (f, a, b, opts) {
        opts = opts || {};
        var N = opts.n || 120, d = "M" + px(a).toFixed(2) + "," + py(0).toFixed(2), i, xx;
        for (i = 0; i <= N; i++) {
          xx = a + (b - a) * i / N;
          d += " L" + px(xx).toFixed(2) + "," + py(f(xx)).toFixed(2);
        }
        d += " L" + px(b).toFixed(2) + "," + py(0).toFixed(2) + " Z";
        svg.appendChild(el("path", { d: d, fill: opts.fill || C.shadeLight, stroke: "none" }));
        return api;
      },
      /* Square-count shading: small boxes wholly under f filled strongly,
         boxes the curve passes through filled lightly (count as halves).
         Counts are returned through opts.out = {full, part}.              */
      shadeSquaresUnder: function (f, a, b, opts) {
        opts = opts || {};
        var out = opts.out || {};
        var full = 0, part = 0;
        var gx, gy, topY, minF, maxF, s, fv;
        for (gx = a; gx < b - EPS; gx += dxMinor) {
          minF = Infinity; maxF = -Infinity;
          for (s = 0; s <= 4; s++) {
            fv = f(gx + dxMinor * s / 4);
            if (fv < minF) minF = fv;
            if (fv > maxF) maxF = fv;
          }
          for (gy = ymin; gy < ymax - EPS; gy += dyMinor) {
            topY = gy + dyMinor;
            if (topY <= minF + EPS) {
              svg.appendChild(el("rect", { x: px(gx) + 0.4, y: py(topY) + 0.4,
                width: px(gx + dxMinor) - px(gx) - 0.8, height: py(gy) - py(topY) - 0.8,
                fill: C.shade, stroke: "none" }));
              full++;
            } else if (gy < maxF - EPS) {
              svg.appendChild(el("rect", { x: px(gx) + 0.4, y: py(topY) + 0.4,
                width: px(gx + dxMinor) - px(gx) - 0.8, height: py(gy) - py(topY) - 0.8,
                fill: C.shadeLight, stroke: "none" }));
              part++;
            }
          }
        }
        out.full = full; out.part = part;
        return api;
      },
      add: function (node) { svg.appendChild(node); return api; },
      note: function (xpix, ypix, s, attrs) { svg.appendChild(txt(xpix, ypix, s, attrs)); return api; }
    };
    return api;
  }

  /* ------------------------------ arrows --------------------------------- */
  /* Labelled force/vector arrow from (x1,y1) to (x2,y2) in PIXEL space.
     opts: {color, width, label, labelDx, labelDy, dash, fontSize, anchor}  */
  function forceArrow(x1, y1, x2, y2, opts) {
    opts = opts || {};
    var g = el("g");
    var ang = Math.atan2(y2 - y1, x2 - x1);
    var wdt = opts.width || 2.6;
    var head = Math.max(7, wdt * 3.2);
    var sx2 = x2 - head * 0.7 * Math.cos(ang), sy2 = y2 - head * 0.7 * Math.sin(ang);
    g.appendChild(el("line", { x1: x1, y1: y1, x2: sx2, y2: sy2,
      stroke: opts.color || C.accent, "stroke-width": wdt, "stroke-linecap": "round",
      "stroke-dasharray": opts.dash || "none" }));
    g.appendChild(arrowHead(x2, y2, ang, head, opts.color || C.accent));
    if (opts.label) {
      var lx = (typeof opts.labelDx === "number") ? (x1 + x2) / 2 + opts.labelDx : x2 + 10 * Math.cos(ang);
      var ly = (typeof opts.labelDy === "number") ? (y1 + y2) / 2 + opts.labelDy : y2 + 10 * Math.sin(ang) + 4;
      g.appendChild(txt(lx, ly, opts.label, { fill: opts.color || C.accent, "font-size": opts.fontSize || 11.5,
        "text-anchor": opts.anchor || "start" }));
    }
    return g;
  }

  /* ----------------------------- protractor ------------------------------ */
  /* Semicircular protractor centred (cx, cy), radius r. Baseline runs along
     direction `rot` degrees (0 = horizontal, anticlockwise positive, SVG
     y-down handled internally). Two scales like a real protractor: outer
     0->180 anticlockwise from the right end, inner the reverse.
     opts: {rot, showInner}                                                 */
  function protractor(cx, cy, r, opts) {
    opts = opts || {};
    var rotDeg = opts.rot || 0;
    var g = el("g");
    /* angle helper: deg anticlockwise from the rightward baseline (screen) */
    function xy(deg, rad) {
      var a = (rotDeg + deg) * Math.PI / 180;
      return [cx + rad * Math.cos(a), cy - rad * Math.sin(a)];
    }
    var pR = xy(0, r), pL = xy(180, r);
    g.appendChild(el("path", {
      d: "M" + pR[0].toFixed(1) + "," + pR[1].toFixed(1) +
         " A" + r + "," + r + " 0 0 0 " + pL[0].toFixed(1) + "," + pL[1].toFixed(1) + " Z",
      fill: "rgba(140,133,121,.10)", stroke: C.ink2, "stroke-width": 1.4
    }));
    g.appendChild(el("line", { x1: pL[0], y1: pL[1], x2: pR[0], y2: pR[1], stroke: C.ink2, "stroke-width": 1 }));
    g.appendChild(el("circle", { cx: cx, cy: cy, r: 2, fill: C.ink2 }));
    var d, p1, p2, lab, isTen;
    for (d = 0; d <= 180; d += 5) {
      isTen = (d % 10 === 0);
      p1 = xy(d, r); p2 = xy(d, r - (isTen ? 9 : 5.5));
      g.appendChild(el("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1],
        stroke: C.ink2, "stroke-width": isTen ? 1.1 : 0.7 }));
      if (d % 30 === 0) {
        lab = xy(d, r - 18);
        g.appendChild(txt(lab[0], lab[1] + 3, String(d), { "text-anchor": "middle", "font-size": 8.5, fill: C.ink }));
        if (opts.showInner !== false) {
          lab = xy(d, r - 29);
          g.appendChild(txt(lab[0], lab[1] + 3, String(180 - d), { "text-anchor": "middle", "font-size": 7.5, fill: C.muted }));
        }
      }
    }
    return g;
  }

  /* --------------------------- drag (browser) ---------------------------- */
  /* Make `handle` draggable within `svg` (viewBox coords). onMove receives
     {x, y} in viewBox units. No-op outside a real browser.                  */
  function makeDraggable(svg, handle, onMove) {
    if (typeof window === "undefined" || !svg.getScreenCTM) return;
    function toLocal(evt) {
      var ctm = svg.getScreenCTM();
      if (!ctm) return null;
      return { x: (evt.clientX - ctm.e) / ctm.a, y: (evt.clientY - ctm.f) / ctm.d };
    }
    var active = false;
    handle.style.cursor = "grab";
    handle.style.touchAction = "none";
    handle.addEventListener("pointerdown", function (e) {
      active = true;
      try { handle.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    });
    handle.addEventListener("pointermove", function (e) {
      if (!active) return;
      var p = toLocal(e);
      if (p) onMove(p);
    });
    handle.addEventListener("pointerup", function (e) {
      active = false;
      try { handle.releasePointerCapture(e.pointerId); } catch (err) {}
    });
    handle.addEventListener("pointercancel", function () { active = false; });
  }

  /* ------------------------------ ruler ----------------------------------- */
  /* A graduated ruler for scale-drawing questions. Graduated in "cm"
     where 1 cm = one BIG grid box (boxPx pixels), minor ticks per
     minorDiv. Origin (local 0,0) is the ZERO MARK on the reading edge;
     the body extends upward (negative y). Rotate about the origin.
     opts: { lengthCm = 12, minorDiv = 5, label = "cm" }                  */
  function ruler(boxPx, opts) {
    opts = opts || {};
    var nCm = opts.lengthCm || 12;
    var minorDiv = opts.minorDiv || 5;
    var len = nCm * boxPx, depth = 30;
    var g = el("g", { class: "wc-ruler" });
    g.appendChild(el("rect", { x: -8, y: -depth, width: len + 16, height: depth, rx: 3,
      fill: "rgba(244,238,222,.92)", stroke: C.ink2, "stroke-width": 1.4 }));
    var i, n = nCm * minorDiv, x, isCm;
    for (i = 0; i <= n; i++) {
      x = i * boxPx / minorDiv; isCm = (i % minorDiv === 0);
      g.appendChild(el("line", { x1: x, y1: 0, x2: x, y2: -(isCm ? 11 : 6.5),
        stroke: C.ink, "stroke-width": isCm ? 1.1 : 0.6 }));
      if (isCm) g.appendChild(txt(x, -15, String(i / minorDiv),
        { "text-anchor": "middle", "font-size": 8.5, fill: C.ink }));
    }
    g.appendChild(txt(len - 2, -23, opts.label || "cm",
      { "text-anchor": "end", "font-size": 8, fill: C.muted }));
    return g;
  }

  /* Make a group movable and rotatable inside an svg (browser only):
     a round MOVE handle sits at the group's local origin side and a
     square ROTATE handle further along; dragging the rotate handle
     turns the group about its local origin. Angles anticlockwise
     positive (screen flip handled here). Returns a state object
     { x, y, deg } kept current.
     opts: { x, y, deg, rotHandleAt (local x of the rotate handle) }     */
  function makeManipulable(svg, group, opts) {
    opts = opts || {};
    var st = { x: opts.x || 0, y: opts.y || 0, deg: opts.deg || 0 };
    var rotAt = (typeof opts.rotHandleAt === "number") ? opts.rotHandleAt : 80;
    var mv = el("circle", { cx: 0, cy: 8, r: 9, fill: C.ok, "fill-opacity": 0.5,
      stroke: C.ok, "stroke-width": 1.4 });
    var rot = el("rect", { x: rotAt - 7, y: 1, width: 14, height: 14, rx: 3,
      fill: C.accent, "fill-opacity": 0.5, stroke: C.accent, "stroke-width": 1.4 });
    group.appendChild(mv); group.appendChild(rot);
    function apply() {
      group.setAttribute("transform",
        "translate(" + st.x + "," + st.y + ") rotate(" + (-st.deg) + ")");
    }
    apply();
    makeDraggable(svg, mv, function (p) { st.x = p.x; st.y = p.y; apply(); });
    makeDraggable(svg, rot, function (p) {
      st.deg = Math.atan2(st.y - p.y, p.x - st.x) * 180 / Math.PI;
      apply();
    });
    return st;
  }

  /* ------------------------------ maths ---------------------------------- */
  var MathsCore = {
    linspace: function (a, b, n) {
      var out = [], i;
      for (i = 0; i <= n; i++) out.push(a + (b - a) * i / n);
      return out;
    },
    trapz: function (f, a, b, n) {
      n = n || 400;
      var s = 0, prev = f(a), i, x, cur;
      for (i = 1; i <= n; i++) {
        x = a + (b - a) * i / n; cur = f(x);
        s += 0.5 * (prev + cur) * ((b - a) / n);
        prev = cur;
      }
      return s;
    },
    gradAt: function (f, x) {
      var h = Math.max(1e-7, Math.abs(x) * 1e-5);
      return (f(x + h) - f(x - h)) / (2 * h);
    },
    /* Named curve shapes on u in [0,1], mapping 0 -> 0 and 1 -> 1.
       Author gives start point, end point, and the shape NAME; the exact
       curve is the widget's liberty under the commissioned rule: the
       gradient never goes vertical and never goes horizontal mid-curve,
       EXCEPT for the three shapes whose point is the exception:
         over_top     overshoots above the end value, then settles back
                      (one stationary point at the peak, by design)
         under_bottom dips below the start value, then recovers (one
                      stationary point in the dip, by design)
         asymptote    flattens toward the end value but never goes flat
       The monotone shapes keep the gradient strictly positive:
         linear       straight join
         curve_up     concave up, gradient GROWS  (g = 0.15u + 0.85u^2)
         curve_down   concave down, gradient SHRINKS (mirror of curve_up)
       Legacy aliases speed_up/slow_down map to curve_up/curve_down.      */
    SHAPES: {
      linear:     function (u) { return u; },
      curve_up:   function (u) { return 0.15 * u + 0.85 * u * u; },
      curve_down: function (u) { var v = 1 - u; return 1 - (0.15 * v + 0.85 * v * v); },
      asymptote:  function (u) { return (1 - Math.exp(-4 * u)) / (1 - Math.exp(-4)); },
      over_top:   function (u) { return u + 0.6 * u * Math.sin(Math.PI * u); },
      under_bottom: function (u) { return u - 0.5 * (1 - u) * Math.sin(Math.PI * u); }
    },
    shapeFn: function (name) {
      var S = MathsCore.SHAPES;
      if (name === "speed_up") return S.curve_up;
      if (name === "slow_down") return S.curve_down;
      return S[name] || S.linear;
    },
    /* Build f(t) from piecewise segments:
       [{shape, from:[t0,y0], to:[t1,y1]}], shape any SHAPES name (or
       "hold" for constant at from-y). Returns f defined on the segments'
       union, null outside.                                               */
    piecewise: function (segs) {
      return function (t) {
        var i, s, t0, t1, y0, y1, u;
        for (i = 0; i < segs.length; i++) {
          s = segs[i]; t0 = s.from[0]; t1 = s.to[0]; y0 = s.from[1]; y1 = s.to[1];
          if (t < t0 - 1e-9 || t > t1 + 1e-9) continue;
          u = (t1 === t0) ? 0 : (t - t0) / (t1 - t0);
          if (s.shape === "hold") return y0;
          return y0 + (y1 - y0) * MathsCore.shapeFn(s.shape)(u);
        }
        return null;
      };
    },
    /* does a value land on a (minor) gridline step? */
    onGrid: function (v, step) {
      var r = v / step;
      return Math.abs(r - Math.round(r)) < 1e-6;
    },
    /* exact area under piecewise-LINEAR segments (sum of trapezia) */
    polyArea: function (segs) {
      var A = 0, i, s;
      for (i = 0; i < segs.length; i++) {
        s = segs[i];
        A += 0.5 * (s.from[1] + s.to[1]) * (s.to[0] - s.from[0]);
      }
      return A;
    },
    deg2rad: function (d) { return d * Math.PI / 180; },
    rad2deg: function (r) { return r * 180 / Math.PI; }
  };

  /* ------------------------------ export --------------------------------- */
  var CORE = {
    NS: NS, C: C, tok: tok,
    el: el, txt: txt, makeSVG: makeSVG, arrowHead: arrowHead, fmt: fmt,
    graph: graph, grid: grid,
    forceArrow: forceArrow, protractor: protractor, makeDraggable: makeDraggable,
    ruler: ruler, makeManipulable: makeManipulable,
    Maths: MathsCore
  };

  if (typeof window !== "undefined") window.WIDGETS_CORE = CORE;
  if (typeof module !== "undefined" && module.exports) module.exports = CORE;
})(typeof globalThis !== "undefined" ? globalThis : this);
