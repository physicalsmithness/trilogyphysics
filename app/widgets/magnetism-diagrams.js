/* =====================================================================
   Trilogy Physics - Magnetism & Electromagnetism 6.7 widget catalogue
   Magnetism 6.7 Widgets chat deliverable (Architecture dispatch d033;
   brief inter_chat/Architecture_Widgets_6_7_dispatch.md).

   Built ON the shared core (app/widgets/widgets_core.js, d026): no
   private copies of graph/axis/arrow primitives live here.

   Contract:
     STATIC      window.TOPIC_DIAGRAMS[kind](params) -> SVGElement
     INTERACTIVE window.TOPIC_WIDGETS[kind](host, config) -> instance
                 { getAnswer(), score(answer, config), destroy() }
                 (Fields-driller pattern; 6.7 grading contract proposed
                 to Housing in inter_chat/Widgets_Housing_interactive_67.md)

   d031 build order: STATIC RENDER FIRST. This file ships the full static
   catalogue plus pure scorers in MagnetismModels so Housing can see the
   grading shapes; the mounted interactive layer follows the contract
   exchange. Pure physics lives in MagnetismModels (no DOM),
   dual-exported so Node asserts on it headless
   (verify_magnetism_models.js).

   3D convention (dispatch: "3D is required throughout"): screen x to the
   right, screen y UP (physics), z OUT of the page toward the viewer.
   dot = out of page, cross = into page, drawn with the standard
   circled-symbol notation everywhere a third dimension is needed.

   SALVAGE NOTE (d034): geometry of the bar-magnet loops, uniform field,
   end-on wire and two-magnet panels is harvested and improved from
   7_Magnetism/engine.js customSVG. Two of those blocks
   (twoMagnets_attract/repel) were UNREACHABLE in the old engine (nested
   after the wire_cross return); they render here for the first time.
   ===================================================================== */
(function (root) {
  "use strict";

  var CORE = (typeof window !== "undefined" && window.WIDGETS_CORE) ||
             (typeof require !== "undefined" ? require("./widgets_core.js") : null);
  if (!CORE) throw new Error("widgets_core.js must load before magnetism-diagrams.js");
  var el = CORE.el, txt = CORE.txt, C = CORE.C, fmt = CORE.fmt;
  var makeSVG = CORE.makeSVG, arrowHead = CORE.arrowHead, forceArrow = CORE.forceArrow;

  /* small shared DOM helpers (mirrors waves-diagrams.js; additive only) */
  function line(x1, y1, x2, y2, opts) {
    opts = opts || {};
    return el("line", { x1: x1, y1: y1, x2: x2, y2: y2,
      stroke: opts.color || C.ink, "stroke-width": opts.width || 1.4,
      "stroke-linecap": opts.cap || "round",
      "stroke-dasharray": opts.dash || "none" });
  }
  function circle(cx, cy, r, opts) {
    opts = opts || {};
    return el("circle", { cx: cx, cy: cy, r: r,
      fill: opts.fill || "none", stroke: opts.stroke || C.ink,
      "stroke-width": (opts.width == null ? 1.4 : opts.width),
      "stroke-dasharray": opts.dash || "none" });
  }
  function path(d, opts) {
    opts = opts || {};
    return el("path", { d: d, fill: opts.fill || "none",
      stroke: opts.stroke || C.ink, "stroke-width": opts.width || 1.6,
      "stroke-linecap": "round", "stroke-linejoin": "round",
      "stroke-dasharray": opts.dash || "none" });
  }
  function rect(x, y, w, h, opts) {
    opts = opts || {};
    return el("rect", { x: x, y: y, width: w, height: h, rx: opts.rx || 0,
      fill: opts.fill || "none", stroke: opts.stroke || C.ink,
      "stroke-width": (opts.width == null ? 1.4 : opts.width),
      "stroke-dasharray": opts.dash || "none" });
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* deterministic PRNG for iron filings (same render every mount) */
  function mulberry32(seed) {
    var t = seed >>> 0;
    return function () {
      t += 0x6D2B79F5;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---- 3D notation: dot = out of page, cross = into page -------------- */
  function dotSym(x, y, r, opts) {
    opts = opts || {};
    var col = opts.color || C.ink;
    var g = el("g");
    g.appendChild(circle(x, y, r, { stroke: col, width: opts.width || 2, fill: opts.fill || C.paper }));
    g.appendChild(el("circle", { cx: x, cy: y, r: Math.max(1.6, r * 0.22), fill: col }));
    return g;
  }
  function crossSym(x, y, r, opts) {
    opts = opts || {};
    var col = opts.color || C.ink;
    var k = r * 0.62;
    var g = el("g");
    g.appendChild(circle(x, y, r, { stroke: col, width: opts.width || 2, fill: opts.fill || C.paper }));
    g.appendChild(line(x - k, y - k, x + k, y + k, { color: col, width: opts.width || 2 }));
    g.appendChild(line(x + k, y - k, x - k, y + k, { color: col, width: opts.width || 2 }));
    return g;
  }
  function currentSym(x, y, r, dir, opts) {
    return dir === "out" ? dotSym(x, y, r, opts) : crossSym(x, y, r, opts);
  }

  /* ---- bar magnet (two-tone halves, bold pole letters) ----------------- */
  /* horizontal magnet, x..x+w, y..y+h; poles "NS" = N on the left (or on
     top when vertical). opts: { vertical, hidePoles, markable, dash } */
  var N_FILL = "rgba(176,48,48,.14)", S_FILL = "rgba(26,26,23,.08)";
  function magnet(x, y, w, h, poles, opts) {
    opts = opts || {};
    var g = el("g");
    var vert = !!opts.vertical;
    var a = (poles || "NS").charAt(0), b = (poles || "NS").charAt(1);
    var dash = opts.dash ? "5 4" : "none";
    var halfW = vert ? w : w / 2, halfH = vert ? h / 2 : h;
    if (!opts.markable) {
      g.appendChild(rect(x, y, halfW, halfH, { fill: a === "N" ? N_FILL : S_FILL, stroke: "none", width: 0 }));
      g.appendChild(rect(vert ? x : x + w / 2, vert ? y + h / 2 : y, halfW, halfH,
        { fill: b === "N" ? N_FILL : S_FILL, stroke: "none", width: 0 }));
    }
    g.appendChild(rect(x, y, w, h, { rx: 4, stroke: opts.stroke || C.ink, width: 1.8, dash: dash }));
    g.appendChild(line(vert ? x : x + w / 2, vert ? y + h / 2 : y,
                       vert ? x + w : x + w / 2, vert ? y + h / 2 : y + h,
                       { color: opts.stroke || C.ink, width: 1.2, dash: dash }));
    var f = { "font-size": 15, "font-weight": 700, fill: C.ink, "text-anchor": "middle" };
    var qf = { "font-size": 15, "font-weight": 700, fill: C.accent, "text-anchor": "middle" };
    var la = opts.markable ? "?" : a, lb = opts.markable ? "?" : b;
    var ff = opts.markable ? qf : f;
    if (!opts.hidePoles) {
      if (vert) {
        g.appendChild(txt(x + w / 2, y + h * 0.25 + 5, la, ff));
        g.appendChild(txt(x + w / 2, y + h * 0.75 + 5, lb, ff));
      } else {
        g.appendChild(txt(x + w * 0.25, y + h / 2 + 5, la, ff));
        g.appendChild(txt(x + w * 0.75, y + h / 2 + 5, lb, ff));
      }
    }
    return g;
  }

  /* ---- plotting compass ------------------------------------------------ */
  /* needleDeg in SCREEN-MATH degrees: 0 = points right, anticlockwise
     positive with y UP (the SVG y-flip is handled here). N half accent. */
  function compassFace(x, y, r, needleDeg, opts) {
    opts = opts || {};
    var g = el("g");
    g.appendChild(circle(x, y, r, { stroke: C.ink2, width: 1.6, fill: opts.fill || "rgba(244,238,222,.85)" }));
    var a = -needleDeg * Math.PI / 180; /* to screen coords (y down) */
    var nx = Math.cos(a), ny = Math.sin(a);
    var px = -ny, py = nx; /* perpendicular */
    var L = r * 0.78, Wd = r * 0.26;
    function tri(tipx, tipy, col) {
      return el("path", { d: "M" + tipx.toFixed(1) + "," + tipy.toFixed(1) +
        " L" + (x + px * Wd).toFixed(1) + "," + (y + py * Wd).toFixed(1) +
        " L" + (x - px * Wd).toFixed(1) + "," + (y - py * Wd).toFixed(1) + " Z",
        fill: col, stroke: "none" });
    }
    g.appendChild(tri(x + nx * L, y + ny * L, C.accent));      /* N end */
    g.appendChild(tri(x - nx * L, y - ny * L, C.ink2));        /* S end */
    g.appendChild(el("circle", { cx: x, cy: y, r: 1.8, fill: C.ink }));
    return g;
  }

  /* small caption under a figure */
  function caption(svg, w, h, s) {
    if (s) svg.appendChild(txt(w / 2, h - 8, s, { "text-anchor": "middle", "font-size": 11, fill: C.muted }));
  }

  /* ============================== MODELS ================================= */
  /* MagnetismModels: single source of physical truth. No DOM. Directions
     are the named 6-set right/left/up/down/out/in on the screen frame
     (x right, y up, z out of page toward the viewer).                     */
  var DIRS = {
    right: [1, 0, 0], left: [-1, 0, 0],
    up: [0, 1, 0], down: [0, -1, 0],
    out: [0, 0, 1], "in": [0, 0, -1]
  };
  function vcross(a, b) {
    return [a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]];
  }
  function dirName(v) {
    for (var k in DIRS) if (DIRS.hasOwnProperty(k)) {
      var d = DIRS[k];
      if (Math.abs(v[0] - d[0]) < 1e-9 && Math.abs(v[1] - d[1]) < 1e-9 && Math.abs(v[2] - d[2]) < 1e-9) return k;
    }
    return null;
  }
  var MagnetismModels = {
    DIRS: DIRS,
    cross: vcross,
    opposite: function (name) {
      var v = DIRS[name];
      return dirName([-v[0], -v[1], -v[2]]);
    },

    /* Fleming's left-hand rule, F = I L x B (conventional current).
       Returns the force direction name, or null when I is parallel or
       antiparallel to B (zero force: the motor-effect "parallel" case). */
    flhr: function (currentName, fieldName) {
      var I = DIRS[currentName], B = DIRS[fieldName];
      var F = vcross(I, B);
      if (Math.abs(F[0]) + Math.abs(F[1]) + Math.abs(F[2]) < 1e-9) return null;
      return dirName(F);
    },

    /* Right-hand grip rule for a straight wire seen END-ON.
       Current out of the page (thumb toward the viewer) -> field circles
       run anticlockwise AS THE VIEWER SEES THEM; into the page ->
       clockwise. */
    wireCirculation: function (current) {
      return current === "out" ? "anticlockwise" : "clockwise";
    },

    /* Concentric field-circle radii around a straight wire. B ~ 1/r, so
       drawing circles at equal field-strength steps means the SPACING
       between circles grows with distance: that is the "correct" look the
       dispatch asks for, with equal spacing as the named distractor. */
    wireRadii: function (n, variant) {
      n = n || 4;
      var out = [], i;
      if (variant === "equal_spacing") {
        for (i = 1; i <= n; i++) out.push(18 * i);
      } else {
        var r = 18, gap = 14;
        for (i = 0; i < n; i++) { out.push(r); r += gap; gap += 5; }
      }
      return out;
    },

    /* Solenoid drawn in section, axis horizontal. topCurrent is the
       symbol on the TOP row of wire sections ("out" = dots on top).
       Top out / bottom in means the magnetic moment points +x (grip the
       coil with the right hand, fingers with the current, thumb = N), so
       the N pole is the RIGHT end and the field inside points right. */
    solenoidNEnd: function (topCurrent) {
      return topCurrent === "out" ? "right" : "left";
    },

    /* Induced magnetism: the near face of the induced object becomes the
       OPPOSITE pole to the inducing face (which is why induced magnetism
       always shows up as attraction). */
    inducedPole: function (inducingPole) {
      return inducingPole === "N" ? "S" : "N";
    },
    /* Magnetically hard steel keeps its induced magnetism when the magnet
       is removed; soft iron loses it (induced = temporary). */
    inducedRetains: function (material) {
      return material === "steel";
    },

    /* The magnetic materials at GCSE: iron, steel, cobalt, nickel. */
    MATERIALS: {
      iron: true, steel: true, cobalt: true, nickel: true,
      copper: false, aluminium: false, brass: false, gold: false,
      silver: false, plastic: false, wood: false, glass: false, rubber: false
    },
    isMagnetic: function (m) { return MagnetismModels.MATERIALS[m] === true; },

    /* 2D dipole field direction at point (px,py) for a bar magnet whose
       moment points along unit (mx,my) from centre (cx,cy):
       B ~ (3(m.r^)r^ - m)/|r|^3, evaluated in the plane. Returns
       {bx, by, mag} with (bx,by) normalised. Used for plotting-compass
       needles and iron filings, so the mapped patterns are genuinely
       dipolar, not hand-waved. Coordinates here are SCREEN px with y
       DOWN; pass my with that in mind (the renderers do).               */
    dipoleFieldAt: function (px, py, cx, cy, mx, my) {
      var rx = px - cx, ry = py - cy;
      var r = Math.sqrt(rx * rx + ry * ry);
      if (r < 1e-6) return { bx: mx, by: my, mag: 0 };
      var ux = rx / r, uy = ry / r;
      var mdotu = mx * ux + my * uy;
      var bx = (3 * mdotu * ux - mx) / (r * r * r);
      var by = (3 * mdotu * uy - my) / (r * r * r);
      var bm = Math.sqrt(bx * bx + by * by);
      return { bx: bx / (bm || 1), by: by / (bm || 1), mag: bm };
    },

    /* d.c. motor, end-on. Coil sides A and B sit on a circle of radius R
       about the axle; thetaDeg = 0 means A on the LEFT, B on the RIGHT,
       coil plane horizontal. A carries current "out", B "in" (one series
       loop). field "right" = field points left-to-right (N pole on the
       left). Forces NEVER rotate with the coil: while B is horizontal
       and the sides run into/out of the page, F = BIL is vertical; what
       changes is the moment arm ~ |cos theta|, zero when the coil plane
       is vertical (theta 90), where the split-ring commutator swaps the
       current so rotation continues.                                    */
    motorForces: function (thetaDeg, field) {
      field = field || "right";
      var FA = MagnetismModels.flhr("out", field);
      var FB = MagnetismModels.flhr("in", field);
      var torque = Math.abs(Math.cos(thetaDeg * Math.PI / 180));
      return { A: FA, B: FB, torqueFactor: torque, atDeadPoint: torque < 1e-9 };
    },

    /* -------- pure scorers (the d031 grading shapes; Housing thread) ---- */
    /* Direction pick (Fleming's LHR / motor effect / circulation sense):
       answer { direction }, cfg { expected, current, field, marks }.     */
    scoreDirection: function (answer, cfg) {
      cfg = cfg || {};
      var marks = cfg.marks || 1;
      var got = answer && answer.direction;
      var exp = cfg.expected;
      var codes = [];
      var ok = got === exp;
      if (!ok && got) {
        if (got === MagnetismModels.opposite(exp)) codes.push("direction_reversed");
        else if (cfg.field && got === cfg.field) codes.push("gave_field_direction");
        else if (cfg.current && got === cfg.current) codes.push("gave_current_direction");
        else codes.push("direction_wrong_axis");
      }
      return { marksAwarded: ok ? marks : 0, marksPossible: marks,
               status: ok ? "full" : "none",
               hits: ok ? ["direction"] : [], misses: ok ? [] : ["direction"],
               errorCodes: codes };
    },
    /* Pole marking (solenoid ends, induced nail/clips):
       answer { poles: {left:"N", right:"S", ...} } against cfg.expected
       of the same shape. All right = full; every one swapped = the
       classic reversal (named errorCode poles_reversed); else per-pole
       partial credit.                                                    */
    scorePoles: function (answer, cfg) {
      cfg = cfg || {};
      var exp = cfg.expected || {};
      var got = (answer && answer.poles) || {};
      var keys = [], k;
      for (k in exp) if (exp.hasOwnProperty(k)) keys.push(k);
      var marks = cfg.marks || keys.length;
      var hit = 0, allSwapped = keys.length > 0;
      var hits = [], misses = [];
      for (var i = 0; i < keys.length; i++) {
        k = keys[i];
        if (got[k] === exp[k]) { hit++; hits.push(k); allSwapped = false; }
        else {
          misses.push(k);
          if (got[k] !== (exp[k] === "N" ? "S" : "N")) allSwapped = false;
        }
      }
      var codes = [];
      if (hit < keys.length) codes.push(allSwapped ? "poles_reversed" : "pole_wrong");
      var per = keys.length ? marks / keys.length : 0;
      return { marksAwarded: Math.round(hit * per * 100) / 100, marksPossible: marks,
               status: hit === keys.length ? "full" : (hit > 0 ? "partial" : "none"),
               hits: hits, misses: misses, errorCodes: codes };
    }
  };

  /* ===================== STATIC RENDERERS ================================ */
  function fp(p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }

  /* 1. bar_magnet_field
     params { poles:"NS"|"SN", show_field:true, variant:
              "correct" | "reversed_arrows" | "crossing" | "through_magnet"
              | "lopsided" | "not_reaching" }
     Physics: closed loops N->S OUTSIDE the magnet, never crossing, never
     stopping short, denser near the poles (the nested loops). The
     distractor variants break exactly one rule each, for the MCQ "which
     drawing is correct?" items the dispatch names.                        */
  function bar_magnet_field(p) {
    p = p || {};
    var W = 360, H = 250;
    var svg = makeSVG(W, H, "Bar magnet and its magnetic field");
    var poles = p.poles === "SN" ? "SN" : "NS";
    var variant = p.variant || "correct";
    var nLeft = poles === "NS";
    svg.appendChild(magnet(125, 103, 110, 44, poles, { markable: p.markable }));
    if (p.show_field === false) return svg;

    var TOPS = [
      { s: [122, 101], c1: [88, 88], c2: [88, 52], a: [180, 46] },
      { s: [120, 99],  c1: [60, 82], c2: [60, 26], a: [180, 24] },
      { s: [118, 97],  c1: [30, 74], c2: [30, 12], a: [180, 10] }
    ];
    if (variant === "crossing") {      /* inner and middle loops swap reach */
      var t = TOPS[0].a[1]; TOPS[0].a[1] = TOPS[1].a[1]; TOPS[1].a[1] = t;
      t = TOPS[0].c2[1]; TOPS[0].c2[1] = TOPS[1].c2[1]; TOPS[1].c2[1] = t;
    }
    var gapOff = variant === "not_reaching" ? 13 : 0;
    function lx(x) { return variant === "lopsided" ? 180 + (x - 180) * 0.82 - 34 : x; }

    function loopD(L, bottom) {
      function pt(q, mir, anchor) {
        var x = mir ? W - q[0] : q[0], y = bottom ? H - q[1] : q[1];
        return [anchor ? x : lx(x), y];
      }
      var s = pt(L.s, 0, 1), c1 = pt(L.c1), c2 = pt(L.c2), a = pt(L.a);
      var c2m = pt(L.c2, 1), c1m = pt(L.c1, 1), sm = pt(L.s, 1, 1);
      if (gapOff) {
        s[0] -= gapOff; sm[0] += gapOff;
        s[1] += bottom ? 7 : -7; sm[1] += bottom ? 7 : -7;
      }
      return "M" + fp(s) + " C" + fp(c1) + " " + fp(c2) + " " + fp(a) +
             " C" + fp(c2m) + " " + fp(c1m) + " " + fp(sm);
    }

    var fwd = nLeft ? 0 : Math.PI;                  /* apex arrows point N -> S */
    if (variant === "reversed_arrows") fwd = fwd === 0 ? Math.PI : 0;
    var i, L;
    for (i = 0; i < TOPS.length; i++) {
      L = TOPS[i];
      svg.appendChild(path(loopD(L, false), { width: i === 0 ? 1.9 : 1.6 }));
      svg.appendChild(path(loopD(L, true),  { width: i === 0 ? 1.9 : 1.6 }));
      svg.appendChild(arrowHead(lx(L.a[0]), L.a[1], fwd, 7.5, C.ink));
      svg.appendChild(arrowHead(lx(L.a[0]), H - L.a[1], fwd, 7.5, C.ink));
    }
    /* axial lines: out of N along the axis, into S along the axis */
    var axDir = nLeft ? Math.PI : 0;                /* both point away from N side */
    if (variant === "reversed_arrows") axDir = axDir === 0 ? Math.PI : 0;
    svg.appendChild(line(44, 125, 118 - gapOff, 125, { width: 1.6 }));
    svg.appendChild(line(242 + gapOff, 125, 316, 125, { width: 1.6 }));
    svg.appendChild(arrowHead(78, 125, axDir, 7.5, C.ink));
    svg.appendChild(arrowHead(282, 125, axDir, 7.5, C.ink));

    if (variant === "through_magnet") {
      var thrDir = nLeft ? 0 : Math.PI;
      [112, 125, 138].forEach(function (y) {
        svg.appendChild(line(128, y, 232, y, { width: 1.6 }));
        svg.appendChild(arrowHead(184, y, thrDir, 7, C.ink));
      });
    }
    return svg;
  }

  /* 2. uniform_field (between two facing unlike poles; the field the
     motor-effect rigs sit in). params { poles:"NS"|"SN", variant:
     "correct" | "curved" | "not_parallel" | "reversed_arrows" }          */
  function uniform_field(p) {
    p = p || {};
    var W = 360, H = 180;
    var svg = makeSVG(W, H, "Uniform field between two unlike poles");
    var poles = p.poles === "SN" ? "SN" : "NS";
    var nLeft = poles === "NS";
    var variant = p.variant || "correct";
    svg.appendChild(rect(24, 36, 56, 108, { rx: 5, fill: nLeft ? N_FILL : S_FILL, width: 1.8 }));
    svg.appendChild(rect(280, 36, 56, 108, { rx: 5, fill: nLeft ? S_FILL : N_FILL, width: 1.8 }));
    svg.appendChild(txt(52, 96, nLeft ? "N" : "S", { "font-size": 17, "font-weight": 700, fill: C.ink, "text-anchor": "middle" }));
    svg.appendChild(txt(308, 96, nLeft ? "S" : "N", { "font-size": 17, "font-weight": 700, fill: C.ink, "text-anchor": "middle" }));
    var dir = nLeft ? 0 : Math.PI;
    if (variant === "reversed_arrows") dir = dir === 0 ? Math.PI : 0;
    var ys = [58, 90, 122];
    var i;
    for (i = 0; i < ys.length; i++) {
      var y = ys[i];
      if (variant === "curved") {
        var bow = (i === 0) ? -26 : (i === 2 ? 26 : 0);
        svg.appendChild(path("M84," + y + " C160," + (y + bow) + " 200," + (y + bow) + " 276," + y, { width: 1.8 }));
        svg.appendChild(arrowHead(180, y + bow * 0.74, dir, 7.5, C.ink));
      } else if (variant === "not_parallel") {
        var y2 = (i === 0) ? y - 16 : (i === 2 ? y + 16 : y);
        svg.appendChild(line(84, y, 276, y2, { width: 1.8 }));
        svg.appendChild(arrowHead(184, (y + y2) / 2 + 1, dir + (nLeft ? Math.atan2(y2 - y, 192) : -Math.atan2(y2 - y, 192)), 7.5, C.ink));
      } else {
        svg.appendChild(line(84, y, 276, y, { width: 1.8 }));
        svg.appendChild(arrowHead(184, y, dir, 7.5, C.ink));
      }
    }
    return svg;
  }

  /* 3. two_magnets_field
     params { orientation:"attract"|"repel",
              facing: attract "NS"(default)|"SN"; repel "NN"(default)|"SS",
              variant: "correct" | "reversed_arrows" | "wrong_poles" }
     Physics: unlike poles facing -> lines LINK across the gap (tension
     along lines pulls the magnets together); like poles facing -> lines
     bow AWAY and a neutral point of zero field sits midway between them.
     wrong_poles keeps the line geometry but swaps the right magnet's
     labels: the field drawn cannot belong to those poles.                */
  function two_magnets_field(p) {
    p = p || {};
    var W = 380, H = 240;
    var svg = makeSVG(W, H, "Field between two bar magnets");
    var orient = p.orientation === "repel" ? "repel" : "attract";
    var facing = p.facing || (orient === "attract" ? "NS" : "NN");
    var variant = p.variant || "correct";

    /* pole strings so the FACING ends carry `facing` */
    var leftPoles = (facing.charAt(0) === "N") ? "SN" : "NS";
    var rightPoles = (facing.charAt(1) === "N") ? "NS" : "SN";
    if (variant === "wrong_poles")
      rightPoles = rightPoles === "NS" ? "SN" : "NS";
    svg.appendChild(magnet(20, 98, 110, 44, leftPoles));
    svg.appendChild(magnet(250, 98, 110, 44, rightPoles));

    var rev = variant === "reversed_arrows";
    if (orient === "attract") {
      /* gap lines left->right when left face is N */
      var dir = (facing.charAt(0) === "N") ? 0 : Math.PI;
      if (rev) dir = dir === 0 ? Math.PI : 0;
      svg.appendChild(path("M132,108 C170,99 210,99 248,108", { width: 1.8 }));
      svg.appendChild(line(132, 120, 248, 120, { width: 1.8 }));
      svg.appendChild(path("M132,132 C170,141 210,141 248,132", { width: 1.8 }));
      svg.appendChild(arrowHead(192, 102.2, dir, 7.5, C.ink));
      svg.appendChild(arrowHead(192, 120, dir, 7.5, C.ink));
      svg.appendChild(arrowHead(192, 137.8, dir, 7.5, C.ink));
      /* long return loops over the top and bottom (outer N end to outer S end) */
      var outDir = (facing.charAt(0) === "N") ? Math.PI : 0;   /* apex arrow */
      if (rev) outDir = outDir === 0 ? Math.PI : 0;
      svg.appendChild(path("M354,94 C312,18 68,18 26,94", { width: 1.6 }));
      svg.appendChild(path("M354,146 C312,222 68,222 26,146", { width: 1.6 }));
      svg.appendChild(arrowHead(190, 37, outDir, 7.5, C.ink));
      svg.appendChild(arrowHead(190, 203, outDir, 7.5, C.ink));
    } else {
      /* repel: lines leave each facing pole and bow away; neutral point  */
      var away = facing === "NN";                  /* arrows away from N */
      var aOut = rev ? !away : away;
      function bentPair(x0, sgn) {
        /* sgn +1 = right magnet (curves toward the right side outward)   */
        var d1 = "M" + (x0) + ",106 C" + (x0 - sgn * 26) + ",96 " + (x0 - sgn * 40) + ",78 " + (x0 - sgn * 44) + ",50";
        var d2 = "M" + (x0) + ",134 C" + (x0 - sgn * 26) + ",144 " + (x0 - sgn * 40) + ",162 " + (x0 - sgn * 44) + ",190";
        svg.appendChild(path(d1, { width: 1.8 }));
        svg.appendChild(path(d2, { width: 1.8 }));
        var angUp = aOut ? Math.atan2(-28, -sgn * 4) : Math.atan2(28, sgn * 4);
        var angDn = aOut ? Math.atan2(28, -sgn * 4) : Math.atan2(-28, sgn * 4);
        svg.appendChild(arrowHead(x0 - sgn * 44, 50, angUp, 7.5, C.ink));
        svg.appendChild(arrowHead(x0 - sgn * 44, 190, angDn, 7.5, C.ink));
        /* short axial stub dying out toward the neutral point            */
        svg.appendChild(line(x0, 120, x0 - sgn * 36, 120, { width: 1.8 }));
        svg.appendChild(arrowHead(aOut ? x0 - sgn * 30 : x0 - sgn * 8, 120, aOut ? (sgn > 0 ? Math.PI : 0) : (sgn > 0 ? 0 : Math.PI), 7.5, C.ink));
      }
      bentPair(132, -1);
      bentPair(248, 1);
      if (variant !== "wrong_poles") {
        svg.appendChild(line(184, 114, 196, 126, { color: C.accent, width: 2 }));
        svg.appendChild(line(196, 114, 184, 126, { color: C.accent, width: 2 }));
        svg.appendChild(txt(190, 146, "neutral point", { "text-anchor": "middle", "font-size": 10.5, fill: C.accent }));
      }
    }
    return svg;
  }

  /* 4. solenoid_field / electromagnet (section view, the 3D cut)
     params { top_current:"out"|"in", show_poles:true|false|"markable",
              show_circuit:true, core:false (electromagnet defaults true),
              variant:"correct" | "wrong_poles" | "nonuniform"
                      | "reversed_arrows" }
     Physics: the coil is CUT by the page: each turn shows as a wire
     section, dots along the top row and crosses along the bottom (or
     vice versa). Right-hand grip on the visible circulation gives the
     field: top row "out" -> field inside points RIGHT, N at the right
     end (MagnetismModels.solenoidNEnd). Inside: straight, parallel,
     evenly spaced (strong uniform field); outside: a bar-magnet-like
     return field, N round to S. Battery polarity drawn consistent with
     an assumed winding handedness (noted in the hand-back).             */
  function solenoid_field(p) {
    p = p || {};
    var W = 420, H = 290;
    var svg = makeSVG(W, H, "Solenoid field in section, with supply circuit");
    var top = p.top_current === "in" ? "in" : "out";
    var variant = p.variant || "correct";
    var nEnd = MagnetismModels.solenoidNEnd(top);
    var fieldRight = nEnd === "right";
    var dir = fieldRight ? 0 : Math.PI;
    if (variant === "reversed_arrows") dir = dir === 0 ? Math.PI : 0;

    if (p.core) {
      svg.appendChild(rect(118, 108, 184, 32, { rx: 4, fill: "rgba(140,133,121,.25)", stroke: C.muted, width: 1.2 }));
      svg.appendChild(txt(210, 102, "iron core", { "text-anchor": "middle", "font-size": 10.5, fill: C.muted }));
    }

    /* inside field lines first (under the wire sections) */
    var ys = (variant === "nonuniform") ? [100, 122, 130] : [102, 124, 146];
    ys.forEach(function (y, i) {
      if (variant === "nonuniform") {
        svg.appendChild(path("M120," + y + " C160," + (y - 8) + " 250," + (y + 9) + " 300," + (y - 4), { width: 1.7 }));
        svg.appendChild(arrowHead(212, y + 2, dir, 7.5, C.ink));
      } else {
        svg.appendChild(line(120, y, 300, y, { width: 1.7 }));
        svg.appendChild(arrowHead(176, y, dir, 7.5, C.ink));
        svg.appendChild(arrowHead(252, y, dir, 7.5, C.ink));
      }
    });
    /* outside return loops (over the top and under the bottom) */
    var outDir = fieldRight ? Math.PI : 0;
    if (variant === "reversed_arrows") outDir = outDir === 0 ? Math.PI : 0;
    svg.appendChild(path("M306,96 C398,62 398,18 210,16 C22,18 22,62 114,96", { width: 1.6 }));
    svg.appendChild(path("M306,152 C386,178 386,216 252,222", { width: 1.6 }));
    svg.appendChild(path("M114,152 C34,178 34,216 168,222", { width: 1.6 }));
    svg.appendChild(arrowHead(210, 16, outDir, 7.5, C.ink));
    /* bottom arcs: midpoints (359,194.5)/(61,194.5); field N round to S  */
    var aR = Math.atan2(81, -40.5), aLft = Math.atan2(-81, -40.5);
    if (!fieldRight) { aR = aR - Math.PI; aLft = aLft - Math.PI; }
    if (variant === "reversed_arrows") { aR += Math.PI; aLft += Math.PI; }
    svg.appendChild(arrowHead(359, 194.5, aR, 7.5, C.ink));
    svg.appendChild(arrowHead(61, 194.5, aLft, 7.5, C.ink));

    /* the cut turns: 7 sections top and bottom */
    var xs = [135, 160, 185, 210, 235, 260, 285];
    xs.forEach(function (x) {
      svg.appendChild(currentSym(x, 86, 8, top));
      svg.appendChild(currentSym(x, 162, 8, top === "out" ? "in" : "out"));
    });

    /* poles */
    var showP = (p.show_poles !== false);
    if (showP) {
      var mark = p.show_poles === "markable" || p.markable;
      var f = { "font-size": 18, "font-weight": 700, "text-anchor": "middle",
                fill: mark ? C.accent : C.ink };
      var leftL = fieldRight ? "S" : "N", rightL = fieldRight ? "N" : "S";
      if (variant === "wrong_poles") { var tq = leftL; leftL = rightL; rightL = tq; }
      svg.appendChild(txt(86, 130, mark ? "?" : leftL, f));
      svg.appendChild(txt(334, 130, mark ? "?" : rightL, f));
    }

    /* supply circuit: wires from the end turns to a cell at the bottom  */
    if (p.show_circuit !== false) {
      var plusLeft = (top === "out");   /* assumed winding handedness     */
      svg.appendChild(path("M135,172 L135,252 L201,252", { width: 1.5, stroke: C.ink2 }));
      svg.appendChild(path("M285,172 L285,252 L219,252", { width: 1.5, stroke: C.ink2 }));
      /* cell: long plate = +, short plate = -                            */
      var lxp = plusLeft ? 202 : 218, sxp = plusLeft ? 218 : 202;
      svg.appendChild(line(lxp, 236, lxp, 268, { color: C.ink, width: 2 }));
      svg.appendChild(line(sxp, 244, sxp, 260, { color: C.ink, width: 4 }));
      svg.appendChild(txt(lxp, 230, "+", { "text-anchor": "middle", "font-size": 13, fill: C.ink }));
      /* conventional current arrows out of + terminal                    */
      var aL = plusLeft ? -Math.PI / 2 : Math.PI / 2;
      svg.appendChild(arrowHead(135, 212, aL, 7.5, C.accent));
      svg.appendChild(arrowHead(285, 212, -aL, 7.5, C.accent));
      svg.appendChild(txt(118, 212, "I", { "font-size": 12, "font-style": "italic", fill: C.accent }));
    }
    return svg;
  }
  function electromagnet(p) {
    p = p || {};
    if (p.core === undefined) p.core = true;
    return solenoid_field(p);
  }

  /* 5. induced_magnetism
     params { object:"nail"|"clip_chain", pole:"N"|"S" (the facing pole),
              n: clips in the chain (1-3), material:"iron"|"steel",
              state:"held"|"removed", variant:"correct"|"wrong_poles",
              markable }
     Physics: the near face of the object is induced OPPOSITE to the
     inducing pole (so the force is always attraction); poles alternate
     down a clip chain. Induced magnetism is temporary: remove the magnet
     and soft-iron clips fall; magnetically hard steel keeps some
     (MagnetismModels.inducedRetains).                                    */
  function induced_magnetism(p) {
    p = p || {};
    var pole = p.pole === "S" ? "S" : "N";
    var near = MagnetismModels.inducedPole(pole);
    var far = pole;
    if (p.variant === "wrong_poles") { var tq = near; near = far; far = tq; }
    var indF = { "font-size": 13, "font-weight": 700, fill: C.accent, "text-anchor": "middle" };

    if (p.object === "clip_chain") {
      var W = 360, H = 290;
      var svg = makeSVG(W, H, "Magnet inducing magnetism in a chain of paperclips");
      var removed = p.state === "removed";
      var retains = MagnetismModels.inducedRetains(p.material || "iron");
      var my = removed ? -22 : 0;
      svg.appendChild(magnet(160, 24 + my, 44, 78, pole === "N" ? "SN" : "NS",
        { vertical: true, dash: removed }));
      if (removed) {
        svg.appendChild(forceArrow(236, 92, 236, 44, { color: C.muted, width: 2, label: "magnet removed", labelDx: 8, labelDy: -18, fontSize: 10.5 }));
      }
      var n = clamp(p.n || 3, 1, 3);
      var i, cy = 122;
      var fall = removed && !retains;
      for (i = 0; i < n; i++) {
        var jx = fall ? (i % 2 ? 36 + i * 8 : -30 - i * 6) : 0;
        var jy = fall ? 36 + i * 14 : 0;
        var rot = fall ? (i % 2 ? 28 : -22) : 0;
        var g = el("g");
        g.appendChild(el("ellipse", { cx: 0, cy: 0, rx: 11, ry: 17, fill: "none",
          stroke: C.ink, "stroke-width": 1.8 }));
        g.appendChild(el("ellipse", { cx: 0, cy: -2.5, rx: 6.5, ry: 11, fill: "none",
          stroke: C.ink2, "stroke-width": 1.2 }));
        if (!fall) {
          g.appendChild(txt(20, -8, near, indF));
          g.appendChild(txt(20, 16, far, indF));
        }
        g.setAttribute("transform", "translate(" + (182 + jx) + "," + (cy + jy) + ") rotate(" + rot + ")");
        svg.appendChild(g);
        cy += 36;
      }
      caption(svg, W, H, removed
        ? (retains ? "steel: keeps some induced magnetism (becomes permanent-ish)"
                   : "soft iron: induced magnetism is temporary, the clips fall")
        : "induced poles shown beside each clip");
      return svg;
    }

    /* nail layout */
    var W2 = 400, H2 = 220;
    var svg2 = makeSVG(W2, H2, "Magnet inducing magnetism in an iron nail");
    svg2.appendChild(magnet(20, 85, 110, 44, pole === "N" ? "SN" : "NS"));
    /* nail: head, shaft, point */
    svg2.appendChild(line(172, 90, 172, 124, { width: 3 }));
    svg2.appendChild(path("M172,100 L300,100 L332,107 L300,114 L172,114 Z",
      { width: 1.8, fill: "rgba(140,133,121,.15)" }));
    var mk = p.markable;
    svg2.appendChild(txt(192, 88, mk ? "?" : near, indF));
    svg2.appendChild(txt(296, 88, mk ? "?" : far, indF));
    svg2.appendChild(txt(192, 138, "(induced)", { "text-anchor": "middle", "font-size": 9.5, fill: C.muted }));
    /* attraction arrows in the gap */
    svg2.appendChild(arrowHead(150, 107, 0, 7, C.accent));
    svg2.appendChild(arrowHead(156, 107, Math.PI, 7, C.accent));
    caption(svg2, W2, H2, "the nail is attracted whichever pole faces it");
    return svg2;
  }

  /* 6. magnetic_materials
     params { materials:[slugs], show_result:false }
     Physics: iron, steel (an iron alloy), cobalt and nickel are the
     magnetic materials; copper, aluminium and non-metals are not.       */
  var MAT_LABEL = {
    iron: "iron nail", steel: "steel paperclip", cobalt: "cobalt disc",
    nickel: "nickel coin", copper: "copper coin", aluminium: "aluminium can",
    brass: "brass screw", plastic: "plastic ruler", wood: "wooden block",
    glass: "glass marble", rubber: "rubber band", gold: "gold ring", silver: "silver ring"
  };
  function matGlyph(m) {
    var g = el("g");
    if (m === "iron") {
      g.appendChild(line(-14, -6, -14, 6, { width: 2.6 }));
      g.appendChild(path("M-14,-3 L8,-3 L16,0 L8,3 L-14,3 Z", { width: 1.4, fill: "rgba(140,133,121,.2)" }));
    } else if (m === "steel") {
      g.appendChild(el("ellipse", { cx: 0, cy: 0, rx: 8, ry: 13, fill: "none", stroke: C.ink, "stroke-width": 1.8 }));
      g.appendChild(el("ellipse", { cx: 0, cy: -2, rx: 4.5, ry: 8, fill: "none", stroke: C.ink2, "stroke-width": 1.1 }));
    } else if (m === "cobalt" || m === "nickel" || m === "copper" || m === "gold" || m === "silver") {
      g.appendChild(circle(0, 0, 11, { width: 1.8, fill: m === "copper" ? "rgba(176,86,48,.18)" : "rgba(140,133,121,.15)" }));
      g.appendChild(circle(0, 0, 7.5, { width: 0.9, stroke: C.ink2 }));
    } else if (m === "aluminium") {
      g.appendChild(rect(-8, -13, 16, 26, { rx: 4, width: 1.8, fill: "rgba(140,133,121,.12)" }));
      g.appendChild(line(-8, -8, 8, -8, { width: 1 }));
    } else if (m === "plastic") {
      g.appendChild(rect(-16, -5, 32, 10, { rx: 2, width: 1.6 }));
      [-10, -4, 2, 8].forEach(function (x) { g.appendChild(line(x, -5, x, -1, { width: 1 })); });
    } else if (m === "wood") {
      g.appendChild(rect(-13, -9, 26, 18, { rx: 2, width: 1.6, fill: "rgba(176,138,48,.12)" }));
      g.appendChild(path("M-9,-4 C-2,-7 4,-1 9,-4", { width: 0.9, stroke: C.ink2 }));
      g.appendChild(path("M-9,3 C-2,0 4,6 9,3", { width: 0.9, stroke: C.ink2 }));
    } else {
      g.appendChild(circle(0, 0, 9, { width: 1.6 }));
    }
    return g;
  }
  function magnetic_materials(p) {
    p = p || {};
    var mats = p.materials || ["iron", "steel", "cobalt", "nickel", "copper", "aluminium", "plastic", "wood"];
    var rows = Math.ceil(mats.length / 2);
    var W = 430, H = Math.max(220, 58 * rows + 44);
    var svg = makeSVG(W, H, "Which materials does a magnet attract?");
    svg.appendChild(magnet(20, H / 2 - 22, 110, 44, "SN"));
    mats.forEach(function (m, i) {
      var col = i % 2, row = Math.floor(i / 2);
      var x = 230 + col * 105, y = 46 + row * 58;
      var g = matGlyph(m);
      g.setAttribute("transform", "translate(" + x + "," + y + ")");
      svg.appendChild(g);
      svg.appendChild(txt(x, y + 28, MAT_LABEL[m] || m, { "text-anchor": "middle", "font-size": 10, fill: C.ink2 }));
      if (p.show_result) {
        if (MagnetismModels.isMagnetic(m)) {
          svg.appendChild(line(x - 52, y, x - 24, y, { color: C.accent, width: 2.2 }));
          svg.appendChild(arrowHead(x - 52, y, Math.PI, 7.5, C.accent));
        } else {
          svg.appendChild(txt(x - 38, y + 4, "stays", { "text-anchor": "middle", "font-size": 9.5, fill: C.muted }));
        }
      }
    });
    if (p.show_result) caption(svg, W, H, "arrow = attracted toward the magnet");
    return svg;
  }

  /* 7. compass
     params { mode:"around_magnet"|"single"|"earth",
              poles:"NS"|"SN" (around_magnet), variant:"correct"|"reversed" }
     Physics: a compass needle is a small bar magnet free to rotate; its
     N end points along the local field direction. Needle directions
     around the magnet come from MagnetismModels.dipoleFieldAt, so each
     compass genuinely sits on the dipole field, not on guesswork. The
     Earth behaves as if a bar magnet sits in its core with the magnetic
     S pole up near GEOGRAPHIC north (that is why N needles point north).
     variant "reversed" flips every needle: the named distractor.        */
  function compass(p) {
    p = p || {};
    var flip = p.variant === "reversed" ? 180 : 0;

    if (p.mode === "earth") {
      var W = 380, H = 320;
      var svg = makeSVG(W, H, "The Earth as a bar magnet, with a compass");
      var cx = 180, cy = 165, R = 88, tilt = 11;
      /* geographic axis */
      svg.appendChild(line(cx, cy - R - 22, cx, cy + R + 22, { color: C.muted, width: 1.1, dash: "5 4" }));
      svg.appendChild(txt(cx, cy - R - 28, "geographic North", { "text-anchor": "middle", "font-size": 10.5, fill: C.ink2 }));
      svg.appendChild(circle(cx, cy, R, { width: 1.8, fill: "rgba(140,170,200,.10)" }));
      /* internal magnet, tilted; magnetic S pole UP (toward geographic N) */
      var mg = magnet(cx - 17, cy - 52, 34, 104, "SN", { vertical: true, dash: true });
      mg.setAttribute("transform", "rotate(" + tilt + " " + cx + " " + cy + ")");
      svg.appendChild(mg);
      /* external field loops: out of N (bottom) round to S (top) */
      var tr = Math.PI / 180 * tilt;
      function rot(x, y) {
        var dx = x - cx, dy = y - cy;
        return [cx + dx * Math.cos(tr) - dy * Math.sin(tr), cy + dx * Math.sin(tr) + dy * Math.cos(tr)];
      }
      [{ rr: 118, sx: 10, sy: 62 }, { rr: 166, sx: 28, sy: 68 }].forEach(function (q) {
        var rr = q.rr;
        var d = "M" + fp(rot(cx + q.sx, cy + q.sy)) + " C" + fp(rot(cx + rr, cy + 74)) + " " +
                fp(rot(cx + rr, cy - 74)) + " " + fp(rot(cx + q.sx, cy - q.sy));
        svg.appendChild(path(d, { width: 1.5 }));
        var d2 = "M" + fp(rot(cx - q.sx, cy + q.sy)) + " C" + fp(rot(cx - rr, cy + 74)) + " " +
                 fp(rot(cx - rr, cy - 74)) + " " + fp(rot(cx - q.sx, cy - q.sy));
        svg.appendChild(path(d2, { width: 1.5 }));
        /* arrows at the equator crossings, pointing N-to-S i.e. upward */
        var pR = rot(cx + rr * 0.747, cy), pL = rot(cx - rr * 0.747, cy);
        svg.appendChild(arrowHead(pR[0], pR[1], -Math.PI / 2 + tr + flip * Math.PI / 180, 7, C.ink));
        svg.appendChild(arrowHead(pL[0], pL[1], -Math.PI / 2 + tr + flip * Math.PI / 180, 7, C.ink));
      });
      /* a compass out at the side: N end follows the local field (up)   */
      var mdirX = Math.sin(tr), mdirY = Math.cos(tr);   /* moment S->N = downward, tilted */
      var b = MagnetismModels.dipoleFieldAt(322, cy, cx, cy, mdirX, mdirY);
      var deg = Math.atan2(-b.by, b.bx) * 180 / Math.PI + flip;
      svg.appendChild(compassFace(322, cy, 20, deg));
      svg.appendChild(txt(322, cy + 46, "compass", { "text-anchor": "middle", "font-size": 10, fill: C.muted }));
      caption(svg, W, H, "the magnetic pole near geographic North is a magnetic S pole");
      return svg;
    }

    if (p.mode === "single") {
      var W2 = 340, H2 = 170;
      var svg2 = makeSVG(W2, H2, "Compass needle aligning with a field");
      [55, 85, 115].forEach(function (y) {
        svg2.appendChild(line(30, y, 310, y, { color: C.muted, width: 1.3 }));
        svg2.appendChild(arrowHead(286, y, 0, 7, C.muted));
      });
      svg2.appendChild(compassFace(170, 85, 24, 0 + flip));
      caption(svg2, W2, H2, "the needle's N end points along the field");
      return svg2;
    }

    /* around_magnet (default) */
    var W3 = 380, H3 = 270;
    var svg3 = makeSVG(W3, H3, "Plotting compasses around a bar magnet");
    var poles = p.poles === "SN" ? "SN" : "NS";
    var mx = poles === "NS" ? -1 : 1;   /* moment points toward the N pole */
    svg3.appendChild(magnet(135, 113, 110, 44, poles));
    var pts = [[62, 135], [318, 135], [190, 40], [190, 230],
               [92, 62], [288, 62], [92, 208], [288, 208]];
    pts.forEach(function (q) {
      var b = MagnetismModels.dipoleFieldAt(q[0], q[1], 190, 135, mx, 0);
      var deg = Math.atan2(-b.by, b.bx) * 180 / Math.PI + flip;
      svg3.appendChild(compassFace(q[0], q[1], 15, deg));
    });
    return svg3;
  }

  /* 8. field_mapping
     params { mode:"filings"|"compasses", poles:"NS"|"SN", seed }
     Physics: both methods reveal the same dipole pattern
     (MagnetismModels.dipoleFieldAt drives every filing and needle).
     Iron filings line up along the field but carry NO arrows: the
     pattern shows shape, not direction; that is exactly what the
     plotting compasses add.                                              */
  function field_mapping(p) {
    p = p || {};
    var W = 380, H = 270;
    var poles = p.poles === "SN" ? "SN" : "NS";
    var mx = poles === "NS" ? -1 : 1;
    var cx = 190, cyy = 135;

    if (p.mode === "compasses") {
      var svg = makeSVG(W, H, "Plotting compasses mapping the field");
      svg.appendChild(magnet(135, 113, 110, 44, poles));
      var rowY = [44, 90, 135, 180, 226], colX = [56, 123, 190, 257, 324];
      rowY.forEach(function (y) {
        colX.forEach(function (x) {
          if (x > 118 && x < 262 && y > 96 && y < 174) return; /* magnet zone */
          var b = MagnetismModels.dipoleFieldAt(x, y, cx, cyy, mx, 0);
          svg.appendChild(compassFace(x, y, 12.5, Math.atan2(-b.by, b.bx) * 180 / Math.PI));
        });
      });
      caption(svg, W, H, "move the compass, dot the N end, join the dots");
      return svg;
    }

    var svg2 = makeSVG(W, H, "Iron filings revealing the field pattern");
    svg2.appendChild(magnet(135, 113, 110, 44, poles));
    var rng = mulberry32(p.seed || 7);
    var i, x, y, b, a, L = 4.6, alpha;
    for (i = 0; i < 460; i++) {
      x = 14 + rng() * (W - 28);
      y = 12 + rng() * (H - 36);
      if (x > 124 && x < 256 && y > 104 && y < 166) continue;   /* inside magnet */
      b = MagnetismModels.dipoleFieldAt(x, y, cx, cyy, mx, 0);
      alpha = clamp(0.14 + b.mag * 30000, 0.14, 0.8);
      svg2.appendChild(el("line", {
        x1: (x - b.bx * L).toFixed(1), y1: (y - b.by * L).toFixed(1),
        x2: (x + b.bx * L).toFixed(1), y2: (y + b.by * L).toFixed(1),
        stroke: "rgba(26,26,23," + alpha.toFixed(2) + ")", "stroke-width": 1.5,
        "stroke-linecap": "round" }));
    }
    caption(svg2, W, H, "filings show the pattern but not the direction");
    return svg2;
  }

  /* 9. wire_field (straight wire seen END-ON: the 3D view)
     params { current:"out"|"in", n:4,
              variant:"correct" | "equal_spacing" | "reversed" }
     Physics: concentric circles centred on the wire; B ~ 1/r so the
     circles SPREAD OUT with distance (equal_spacing is the named
     distractor); circulation by the right-hand grip rule, anticlockwise
     for current out of the page ("reversed" flips it).                  */
  function wire_field(p) {
    p = p || {};
    var W = 340, H = 270;
    var svg = makeSVG(W, H, "Field around a straight wire, end-on");
    var cur = p.current === "in" ? "in" : "out";
    var variant = p.variant || "correct";
    var radii = MagnetismModels.wireRadii(p.n || 4, variant);
    var cx = 170, cy = 128;
    var sense = MagnetismModels.wireCirculation(cur);
    if (variant === "reversed") sense = sense === "anticlockwise" ? "clockwise" : "anticlockwise";
    /* tangent at the TOP of a circle: anticlockwise (as seen) = leftward */
    var topAng = sense === "anticlockwise" ? Math.PI : 0;
    radii.forEach(function (r, i) {
      svg.appendChild(circle(cx, cy, r, { stroke: C.ink2, width: 1.4 }));
      svg.appendChild(arrowHead(cx, cy - r, topAng, 7.5, C.ink));
      if (i === radii.length - 1)
        svg.appendChild(arrowHead(cx, cy + r, topAng === 0 ? Math.PI : 0, 7.5, C.ink));
    });
    svg.appendChild(currentSym(cx, cy, 10, cur, { width: 2.2 }));
    caption(svg, W, H, cur === "out" ? "dot: current out of the page" : "cross: current into the page");
    return svg;
  }

  /* 10. flemings_lhr (HT)
     params { labels:{thumb,first,second}, blanks:["thumb"|...],
              show_mnemonic:true, show_force:true }
     A stylised LEFT hand in the canonical pose:
       First finger  -> points RIGHT       = Field (N to S)
       seCond finger -> points OUT of page = Current (the circled dot)
       thuMb         -> points UP          = Force / Motion
     which agrees with F = IL x B: out x right = up
     (MagnetismModels.flhr("out","right") === "up": asserted headless).
     Blanked digits print "?" so authors can ask "which way...?";
     orientation variants are the interactive widget's job (the pupil
     answers with a direction; no rotated-hand art needed).               */
  function flemings_lhr(p) {
    p = p || {};
    var W = 400, H = 330;
    var svg = makeSVG(W, H, "Fleming's left-hand rule");
    var labels = p.labels || { thumb: "Force / Motion", first: "Field (N to S)", second: "Current" };
    var blanks = p.blanks || [];
    function lab(k, fallback) {
      return blanks.indexOf(k) >= 0 ? "?" : (labels[k] || fallback);
    }
    var HAND = "rgba(244,238,222,.9)";
    /* palm + wrist */
    svg.appendChild(rect(168, 188, 92, 92, { rx: 20, fill: HAND, width: 2 }));
    svg.appendChild(rect(186, 272, 58, 50, { rx: 12, fill: HAND, width: 2 }));
    /* curled ring + little fingers (two bumps on the right edge)        */
    svg.appendChild(el("ellipse", { cx: 262, cy: 218, rx: 15, ry: 12, fill: HAND, stroke: C.ink, "stroke-width": 2 }));
    svg.appendChild(el("ellipse", { cx: 259, cy: 244, rx: 13, ry: 11, fill: HAND, stroke: C.ink, "stroke-width": 2 }));
    /* thumb: UP */
    svg.appendChild(rect(164, 96, 28, 102, { rx: 14, fill: HAND, width: 2 }));
    /* first finger: RIGHT */
    svg.appendChild(rect(250, 168, 112, 28, { rx: 14, fill: HAND, width: 2 }));
    /* second finger: OUT of the page, toward you (foreshortened tip)    */
    svg.appendChild(circle(216, 178, 17, { fill: HAND, width: 2 }));
    svg.appendChild(circle(216, 178, 9, { width: 1.4, stroke: C.ink2 }));
    svg.appendChild(el("circle", { cx: 216, cy: 178, r: 2.6, fill: C.ink }));

    /* labelled directions */
    svg.appendChild(forceArrow(178, 88, 178, 30, { color: C.accent, width: 3,
      label: lab("thumb", "Force / Motion"), labelDx: 12, labelDy: -22, fontSize: 12.5 }));
    svg.appendChild(forceArrow(366, 182, 394, 182, { color: C.ink, width: 3,
      label: "", labelDx: 0, labelDy: 0 }));
    svg.appendChild(txt(330, 216, lab("first", "Field (N to S)"),
      { "text-anchor": "middle", "font-size": 12.5, fill: C.ink }));
    svg.appendChild(line(216, 152, 216, 120, { color: C.ok, width: 1.4, dash: "3 3" }));
    svg.appendChild(dotSym(216, 106, 11, { color: C.ok }));
    svg.appendChild(txt(216, 84, lab("second", "Current"),
      { "text-anchor": "middle", "font-size": 12.5, fill: C.ok }));
    if (blanks.indexOf("second") < 0)
      svg.appendChild(txt(216, 132, "(out of the page)", { "text-anchor": "middle", "font-size": 9.5, fill: C.ok }));

    if (p.show_mnemonic !== false)
      caption(svg, W, H, "thuMb = Motion   First finger = Field   seCond finger = Current");
    return svg;
  }

  /* 11. motor_effect_setup (HT)
     params { poles:"NS"|"SN", current:"out"|"in",
              variant:"basic" | "parallel" | "pivot" | "balance",
              offset:"near"|"far", force:"auto"|"none"|"reversed"
                                          |"along_field" }
     Physics: F = BIL on a current-carrying wire AT RIGHT ANGLES to the
     field; direction from Fleming's LHR (MagnetismModels.flhr drives the
     drawn arrow, never hand-set); zero force when current is parallel to
     the field; smaller force further from the poles (weaker field);
     "balance" shows the Newton's-third-law reading change.               */
  function motor_effect_setup(p) {
    p = p || {};
    var W = 400, H = 280;
    var svg = makeSVG(W, H, "Motor effect: wire in a magnetic field");
    var poles = p.poles === "SN" ? "SN" : "NS";
    var nLeft = poles === "NS";
    var fieldDir = nLeft ? "right" : "left";
    var variant = p.variant || "basic";
    var cur = p.current === "in" ? "in" : "out";

    function poleBlocks(x1, x2, y, h, wdt) {
      svg.appendChild(rect(x1, y, wdt, h, { rx: 5, fill: nLeft ? N_FILL : S_FILL, width: 1.8 }));
      svg.appendChild(rect(x2, y, wdt, h, { rx: 5, fill: nLeft ? S_FILL : N_FILL, width: 1.8 }));
      svg.appendChild(txt(x1 + wdt / 2, y + h / 2 + 6, nLeft ? "N" : "S", { "font-size": 17, "font-weight": 700, fill: C.ink, "text-anchor": "middle" }));
      svg.appendChild(txt(x2 + wdt / 2, y + h / 2 + 6, nLeft ? "S" : "N", { "font-size": 17, "font-weight": 700, fill: C.ink, "text-anchor": "middle" }));
      [0.25, 0.55, 0.85].forEach(function (f) {
        var yy = y + h * f;
        svg.appendChild(line(x1 + wdt + 6, yy, x2 - 6, yy, { color: C.muted, width: 1.2 }));
        svg.appendChild(arrowHead(nLeft ? x2 - 24 : x1 + wdt + 24, yy, nLeft ? 0 : Math.PI, 6.5, C.muted));
      });
    }

    if (variant === "balance") {
      poleBlocks(124, 232, 92, 92, 44);
      /* yoke joining the poles, sitting on a balance pan                */
      svg.appendChild(rect(124, 184, 152, 14, { fill: "rgba(140,133,121,.2)", width: 1.4 }));
      svg.appendChild(rect(104, 198, 192, 42, { rx: 6, width: 1.8 }));
      svg.appendChild(rect(122, 208, 76, 22, { rx: 3, fill: "rgba(26,26,23,.06)", width: 1.2 }));
      svg.appendChild(txt(160, 223, "+ 0.24 g", { "text-anchor": "middle", "font-size": 12, fill: C.ink }));
      svg.appendChild(txt(248, 223, "balance", { "text-anchor": "middle", "font-size": 10, fill: C.muted }));
      /* clamped wire through the gap, current into the page             */
      svg.appendChild(currentSym(200, 138, 10, cur, { width: 2.2 }));
      var Fw = MagnetismModels.flhr(cur, fieldDir);
      var sgn = Fw === "up" ? -1 : 1;
      svg.appendChild(forceArrow(200, 138 + sgn * 16, 200, 138 + sgn * 62,
        { color: C.accent, width: 3, label: "force on wire", labelDx: 14, labelDy: sgn * -8, fontSize: 11 }));
      svg.appendChild(forceArrow(296, 138 - sgn * 18, 296, 138 - sgn * 64,
        { color: C.ink2, width: 2.2 }));
      svg.appendChild(txt(392, 158, "equal, opposite force", { "text-anchor": "end", "font-size": 10, fill: C.ink2 }));
      svg.appendChild(txt(392, 171, "on the magnet (N3)", { "text-anchor": "end", "font-size": 10, fill: C.ink2 }));
      caption(svg, W, H, "the reading changes by the same size of force, opposite way");
      return svg;
    }

    poleBlocks(26, 320, 70, 130, 54);

    if (variant === "parallel") {
      svg.appendChild(line(96, 135, 304, 135, { color: C.ink, width: 5 }));
      svg.appendChild(arrowHead(244, 135, nLeft ? 0 : Math.PI, 9, C.accent));
      svg.appendChild(txt(244, 120, "I", { "font-size": 13, "font-style": "italic", fill: C.accent }));
      svg.appendChild(txt(200, 236, "current PARALLEL to the field: force = 0",
        { "text-anchor": "middle", "font-size": 12, fill: C.ink }));
      return svg;
    }

    var wx = p.offset === "far" ? 264 : 200, wy = 135;
    if (variant === "pivot") {
      svg.appendChild(line(150, 26, 250, 26, { width: 2 }));
      svg.appendChild(line(168, 26, wx - 6, wy - 8, { color: C.ink2, width: 1.6 }));
      svg.appendChild(line(232, 26, wx + 6, wy - 8, { color: C.ink2, width: 1.6 }));
      svg.appendChild(el("circle", { cx: 168, cy: 26, r: 3, fill: C.ink }));
      svg.appendChild(el("circle", { cx: 232, cy: 26, r: 3, fill: C.ink }));
      svg.appendChild(txt(264, 24, "pivot", { "font-size": 10, fill: C.muted }));
    }
    svg.appendChild(currentSym(wx, wy, 11, cur, { width: 2.4 }));

    var F = MagnetismModels.flhr(cur, fieldDir);          /* "up" | "down" */
    var fmode = p.force || "auto";
    if (fmode !== "none" && F) {
      var drawDir = F;
      if (fmode === "reversed") drawDir = MagnetismModels.opposite(F);
      var len = p.offset === "far" ? 34 : 58;
      if (fmode === "along_field") {
        svg.appendChild(forceArrow(wx + 16, wy, wx + 16 + len, wy,
          { color: C.accent, width: 3, label: "F", labelDx: 26, labelDy: -8, fontSize: 13 }));
      } else {
        var s2 = drawDir === "up" ? -1 : 1;
        svg.appendChild(forceArrow(wx, wy + s2 * 18, wx, wy + s2 * (18 + len),
          { color: C.accent, width: 3, label: "F", labelDx: 12, labelDy: s2 * 10, fontSize: 13 }));
        if (variant === "pivot")
          svg.appendChild(circle(wx + (s2 < 0 ? 34 : -34), wy + s2 * 34, 11, { stroke: C.muted, width: 1.4, dash: "4 3" }));
      }
    }
    if (p.offset === "far")
      caption(svg, W, H, "further from the poles: weaker field, smaller force");
    return svg;
  }

  /* 12. dc_motor (HT)
     params { rotation_angle:0|45|90 (deg), variant:"correct" |
              "reversed" | "both_same" | "forces_rotate",
              poles:"NS"|"SN", show_commutator:true }
     Physics (end-on view, coil sides A and B cut by the page):
     MagnetismModels.motorForces drives the arrows. The forces stay
     VERTICAL at every coil angle (B horizontal, current along the page
     normal): what changes is the moment arm, biggest with the coil
     horizontal, ZERO with the coil vertical, where the split-ring
     commutator swaps the current direction so the spin continues.
     Distractors: both forces the same way, both reversed, and the
     classic "forces rotate with the coil" misconception.                */
  function dc_motor(p) {
    p = p || {};
    var W = 420, H = 330;
    var svg = makeSVG(W, H, "d.c. motor, end-on, with split-ring commutator");
    var poles = p.poles === "SN" ? "SN" : "NS";
    var nLeft = poles === "NS";
    var fieldDir = nLeft ? "right" : "left";
    var th = (p.rotation_angle == null ? 0 : p.rotation_angle) * Math.PI / 180;
    var cx = 210, cy = 150, R = 74;
    var variant = p.variant || "correct";

    /* poles + field */
    svg.appendChild(rect(20, 70, 52, 160, { rx: 5, fill: nLeft ? N_FILL : S_FILL, width: 1.8 }));
    svg.appendChild(rect(348, 70, 52, 160, { rx: 5, fill: nLeft ? S_FILL : N_FILL, width: 1.8 }));
    svg.appendChild(txt(46, 156, nLeft ? "N" : "S", { "font-size": 17, "font-weight": 700, fill: C.ink, "text-anchor": "middle" }));
    svg.appendChild(txt(374, 156, nLeft ? "S" : "N", { "font-size": 17, "font-weight": 700, fill: C.ink, "text-anchor": "middle" }));
    [104, 150, 196].forEach(function (y) {
      svg.appendChild(line(80, y, 340, y, { color: C.muted, width: 1.1 }));
      svg.appendChild(arrowHead(nLeft ? 322 : 98, y, nLeft ? 0 : Math.PI, 6.5, C.muted));
    });

    /* coil seen edge-on: side A starts on the LEFT and rises as it turns */
    var A = [cx - R * Math.cos(th), cy - R * Math.sin(th)];
    var B = [cx + R * Math.cos(th), cy + R * Math.sin(th)];
    svg.appendChild(line(A[0], A[1], B[0], B[1], { color: C.ink2, width: 4.5 }));
    svg.appendChild(el("circle", { cx: cx, cy: cy, r: 4.5, fill: C.paper, stroke: C.ink, "stroke-width": 1.6 }));
    var aCur = variant === "reversed" ? "in" : "out";
    svg.appendChild(currentSym(A[0], A[1], 10, aCur, { width: 2.2 }));
    svg.appendChild(currentSym(B[0], B[1], 10, aCur === "out" ? "in" : "out", { width: 2.2 }));
    svg.appendChild(txt(A[0] - 20, A[1] + 4, "A", { "font-size": 12, "font-weight": 700, fill: C.ink2 }));
    svg.appendChild(txt(B[0] + 14, B[1] + 4, "B", { "font-size": 12, "font-weight": 700, fill: C.ink2 }));

    /* forces from the model */
    var MF = MagnetismModels.motorForces(p.rotation_angle || 0, fieldDir);
    function drawF(at, dir, labl) {
      if (!dir) return;
      var s = dir === "up" ? -1 : 1;
      svg.appendChild(forceArrow(at[0], at[1] + s * 16, at[0], at[1] + s * 60,
        { color: C.accent, width: 3, label: labl, labelDx: 10, labelDy: s * 12, fontSize: 12 }));
    }
    if (variant === "forces_rotate") {
      /* WRONG: arrows drawn perpendicular to the coil plane, turning with it */
      var ux = Math.sin(th), uy = -Math.cos(th);
      [[A, 1], [B, -1]].forEach(function (q) {
        var at = q[0], s = q[1];
        svg.appendChild(forceArrow(at[0] + s * ux * 16, at[1] + s * uy * 16,
          at[0] + s * ux * 60, at[1] + s * uy * 60, { color: C.accent, width: 3, label: "F", labelDx: 8, labelDy: 0, fontSize: 12 }));
      });
    } else if (variant === "both_same") {
      drawF(A, "up", "F"); drawF(B, "up", "F");
    } else if (variant === "reversed") {
      drawF(A, MagnetismModels.opposite(MF.A), "F");
      drawF(B, MagnetismModels.opposite(MF.B), "F");
    } else {
      drawF(A, MF.A, "F"); drawF(B, MF.B, "F");
    }

    /* split-ring commutator inset, rotated with the coil */
    if (p.show_commutator !== false) {
      var ix = 96, iy = 286, ir = 24, gap = 0.16;
      function arcPt(ang) { return [ix + ir * Math.cos(ang), iy - ir * Math.sin(ang)]; }
      [0, Math.PI].forEach(function (base) {
        var a1 = th + base - Math.PI / 2 + gap, a2 = th + base + Math.PI / 2 - gap;
        var p1 = arcPt(a1), p2 = arcPt(a2);
        svg.appendChild(path("M" + fp(p1) + " A" + ir + "," + ir + " 0 0 0 " + fp(p2), { width: 3, stroke: C.ink }));
      });
      svg.appendChild(rect(ix - ir - 16, iy - 7, 13, 14, { fill: "rgba(26,26,23,.15)", width: 1.4 }));
      svg.appendChild(rect(ix + ir + 3, iy - 7, 13, 14, { fill: "rgba(26,26,23,.15)", width: 1.4 }));
      svg.appendChild(line(ix - ir - 16, iy, ix - ir - 34, iy, { width: 1.4 }));
      svg.appendChild(line(ix + ir + 16, iy, ix + ir + 34, iy, { width: 1.4 }));
      svg.appendChild(txt(ix + 46, iy + 4, "split-ring commutator + brushes", { "text-anchor": "start", "font-size": 9.5, fill: C.muted }));
    }

    var capTxt = MF.atDeadPoint
      ? "coil vertical: no turning effect; the commutator swaps the current"
      : (MF.torqueFactor > 0.99 ? "coil horizontal: maximum turning effect"
                                : "turning effect reduced as the coil turns");
    if (variant === "correct") caption(svg, W, H, capTxt);
    return svg;
  }

  /* ========================== REGISTRY / EXPORT ========================== */
  var registry = {
    bar_magnet_field: bar_magnet_field,
    uniform_field: uniform_field,
    two_magnets_field: two_magnets_field,
    solenoid_field: solenoid_field,
    electromagnet: electromagnet,
    induced_magnetism: induced_magnetism,
    magnetic_materials: magnetic_materials,
    compass: compass,
    field_mapping: field_mapping,
    wire_field: wire_field,
    flemings_lhr: flemings_lhr,
    motor_effect_setup: motor_effect_setup,
    dc_motor: dc_motor
  };

  /* Interactive kinds land after the Housing contract exchange
     (inter_chat/Widgets_Housing_interactive_67.md): direction-pick over
     flemings_lhr / motor_effect_setup / dc_motor scoring through
     MagnetismModels.scoreDirection, and pole-marking over
     solenoid_field / induced_magnetism / bar_magnet_field scoring
     through MagnetismModels.scorePoles. The scorers are pure and already
     exported, so Housing can re-score stored attempts headless.          */

  if (typeof window !== "undefined") {
    window.TOPIC_DIAGRAMS = window.TOPIC_DIAGRAMS || {};
    for (var k in registry) if (registry.hasOwnProperty(k)) window.TOPIC_DIAGRAMS[k] = registry[k];
    window.MAGNETISM_MODELS = MagnetismModels;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { registry: registry, Models: MagnetismModels };
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
