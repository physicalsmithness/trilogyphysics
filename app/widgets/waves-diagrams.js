/* =====================================================================
   Trilogy Physics - Waves 6.6 widget catalogue
   Waves 6.6 Widgets chat deliverable (Architecture dispatch d032; brief
   inter_chat/Architecture_Widgets_6_6_dispatch.md).

   Built ON the shared core (app/widgets/widgets_core.js, d026): no
   private copies of graph/axis/arrow primitives live here.

   Contract:
     STATIC      window.TOPIC_DIAGRAMS[kind](params) -> SVGElement
     INTERACTIVE window.TOPIC_WIDGETS[kind](host, config) -> instance
                 instance = { getAnswer(), score(answer, config),
                              destroy() }   (Fields-driller pattern;
                 grading contract proposed to Housing in
                 inter_chat/Widgets_Housing_interactive_66.md)

   d031 build order: STATIC RENDER FIRST, interactive/markable layer
   second. For Waves many items ARE the widget (mark a wavelength, drag
   wavefronts across a boundary, slide a prism into a beam), so the
   interactive layer emits the pupil's response (the mark placed, the
   angle read, the position dragged to) in a defined shape, and Housing's
   engine grades it. Pure physics lives in WavesModels (no DOM),
   dual-exported so Node can assert on it headless
   (verify_waves_models.js).

   Physical-correctness notes are inline at each model function; the
   hand-back in the dispatch thread cites the assumed behaviour.
   ===================================================================== */
(function (root) {
  "use strict";

  var CORE = (typeof window !== "undefined" && window.WIDGETS_CORE) ||
             (typeof require !== "undefined" ? require("./widgets_core.js") : null);
  if (!CORE) throw new Error("widgets_core.js must load before waves-diagrams.js");
  var el = CORE.el, txt = CORE.txt, C = CORE.C, M = CORE.Maths, fmt = CORE.fmt;
  var makeSVG = CORE.makeSVG, arrowHead = CORE.arrowHead;
  var TAU = Math.PI * 2;

  /* small shared DOM helpers (mirrors forces-diagrams.js so the two
     topic files read the same way; only additive, no core change). */
  function line(x1, y1, x2, y2, opts) {
    opts = opts || {};
    return el("line", { x1: x1, y1: y1, x2: x2, y2: y2,
      stroke: opts.color || C.ink, "stroke-width": opts.width || 1.4,
      "stroke-linecap": opts.cap || "butt",
      "stroke-dasharray": opts.dash || "none" });
  }
  function circle(cx, cy, r, opts) {
    opts = opts || {};
    return el("circle", { cx: cx, cy: cy, r: r,
      fill: opts.fill || "none", stroke: opts.stroke || C.ink,
      "stroke-width": (opts.width == null ? 1.4 : opts.width),
      "stroke-dasharray": opts.dash || "none" });
  }
  function near(a, b, tol) { return Math.abs(a - b) <= tol; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* ============================== MODELS ================================= */
  /* WavesModels: the single source of physical truth for every Waves
     widget. No DOM. Every renderer and every interactive scorer reads
     from here, so the static picture and the graded answer can never
     disagree by construction (the 6.5 "one journey model" discipline).  */
  var WavesModels = {};

  /* ---- transverse wave: y(x) = A sin(2 pi x / lambda + phase) ----------
     Physics: a transverse wave displaces the medium perpendicular to the
     direction of energy transfer. amplitude A = rest line -> crest (NOT
     crest -> trough, which is 2A: the canonical distractor). wavelength
     lambda = crest -> next crest = trough -> next trough = any one full
     cycle. cycles = how many full wavelengths are drawn.                 */
  WavesModels.wave = function (p) {
    p = p || {};
    var lambda = (p.wavelength != null) ? p.wavelength : 4;   /* arb units */
    var A = (p.amplitude != null) ? p.amplitude : 1;
    var cycles = (p.cycles != null) ? p.cycles : 2;
    var phase = (p.phase != null) ? p.phase : 0;              /* radians   */
    var xmax = lambda * cycles;
    function y(x) { return A * Math.sin(TAU * x / lambda + phase); }
    /* crest x where sin = +1: TAU x/lambda + phase = pi/2 + 2 pi k        */
    var crests = [], troughs = [], k, xc;
    for (k = -1; k < cycles + 2; k++) {
      xc = lambda * (0.25 - phase / TAU + k);
      if (xc >= -1e-9 && xc <= xmax + 1e-9) crests.push(xc);
      xc = lambda * (0.75 - phase / TAU + k);
      if (xc >= -1e-9 && xc <= xmax + 1e-9) troughs.push(xc);
    }
    crests.sort(function (a, b) { return a - b; });
    troughs.sort(function (a, b) { return a - b; });
    return {
      y: y, wavelength: lambda, amplitude: A, cycles: cycles,
      phase: phase, xmax: xmax, crests: crests, troughs: troughs,
      /* the markable features, each as a {kind, span, orientation}:
         span is the correct measured length; orientation tells the
         interactive scorer whether the pupil's two marks should be
         horizontal (along x) or vertical (along y).                      */
      features: {
        wavelength:     { length: lambda,      orientation: "horizontal" },
        half_wavelength:{ length: lambda / 2,   orientation: "horizontal" },
        amplitude:      { length: A,            orientation: "vertical"   }
      }
    };
  };

  /* the wave equation, for scenario/markable consistency: v = f lambda    */
  WavesModels.waveSpeed = function (f, lambda) { return f * lambda; };
  WavesModels.frequency = function (v, lambda) { return v / lambda; };
  WavesModels.wavelengthFrom = function (v, f) { return v / f; };
  /* period T = 1/f; "waves past a point" counting: f = count / time       */
  WavesModels.frequencyFromCount = function (count, time) { return count / time; };

  /* ---- longitudinal wave: compressions and rarefactions ----------------
     Physics: particles oscillate ALONG the direction of energy transfer.
     Local particle displacement s(x) = A sin(kx); particle DENSITY is
     highest where the gradient of displacement is most negative
     (particles crowd) -> compressions, lowest at rarefactions. We model
     density as rho(x) = 1 - cos(2 pi x / lambda + phase) (max where the
     cosine is -1). wavelength = compression -> next compression
     (= rarefaction -> next rarefaction); compression -> nearest
     rarefaction is HALF a wavelength (the C-to-R distractor).            */
  WavesModels.longitudinal = function (p) {
    p = p || {};
    var lambda = (p.wavelength != null) ? p.wavelength : 4;
    var cycles = (p.cycles != null) ? p.cycles : 3;
    var phase = (p.phase != null) ? p.phase : 0;
    var xmax = lambda * cycles;
    function density(x) { return 1 - Math.cos(TAU * x / lambda + phase); }
    var comp = [], rar = [], k, xc;
    for (k = -1; k < cycles + 2; k++) {
      /* compression where cos = -1: arg = pi + 2 pi k                     */
      xc = lambda * (0.5 - phase / TAU + k);
      if (xc >= -1e-9 && xc <= xmax + 1e-9) comp.push(xc);
      /* rarefaction where cos = +1: arg = 2 pi k                          */
      xc = lambda * (0 - phase / TAU + k);
      if (xc >= -1e-9 && xc <= xmax + 1e-9) rar.push(xc);
    }
    comp.sort(function (a, b) { return a - b; });
    rar.sort(function (a, b) { return a - b; });
    return {
      density: density, wavelength: lambda, cycles: cycles, xmax: xmax,
      compressions: comp, rarefactions: rar,
      features: {
        wavelength:      { length: lambda,    orientation: "horizontal" },
        half_wavelength: { length: lambda / 2, orientation: "horizontal" }
      }
    };
  };

  /* ---- wavefronts (plan view) ------------------------------------------
     Physics: a wavefront joins points of the SAME phase (e.g. all crests);
     the perpendicular distance between adjacent wavefronts is one
     wavelength. Plane waves -> parallel straight fronts; a point/curved
     source -> concentric circular fronts whose radii increase by lambda.  */
  WavesModels.wavefronts = function (p) {
    p = p || {};
    return {
      wavelength: (p.spacing != null) ? p.spacing : (p.wavelength != null ? p.wavelength : 1),
      count: (p.count != null) ? p.count : 6,
      curved: !!p.curved
    };
  };

  /* ---- refraction: Snell's law -----------------------------------------
     n1 sin(theta1) = n2 sin(theta2), angles measured FROM THE NORMAL.
     Entering a denser/slower medium (n2 > n1) bends the ray TOWARD the
     normal (theta2 < theta1) and the wavefronts get CLOSER together
     (lambda2 = lambda1 * v2/v1 = lambda1 * n1/n2, since v = c/n and
     frequency is unchanged across a boundary). Returns null for total
     internal reflection (no real refracted angle).                       */
  WavesModels.refractAngle = function (theta1_deg, n1, n2) {
    var s2 = (n1 / n2) * Math.sin(theta1_deg * Math.PI / 180);
    if (s2 > 1 + 1e-12 || s2 < -1 - 1e-12) return null;      /* TIR        */
    return Math.asin(clamp(s2, -1, 1)) * 180 / Math.PI;
  };
  WavesModels.criticalAngle = function (n1, n2) {
    if (n1 <= n2) return null;                                /* only dense->less dense */
    return Math.asin(n2 / n1) * 180 / Math.PI;
  };
  /* wavefront spacing ratio across a boundary (lambda2 / lambda1)         */
  WavesModels.wavefrontSpacingRatio = function (n1, n2) { return n1 / n2; };
  /* bends toward normal?  true when slowing down (n2 > n1)                */
  WavesModels.bendsTowardNormal = function (n1, n2) { return n2 > n1; };
  /* 2D vector form of Snell's law for ray tracing through faces. d = unit
     incident direction; nrm = unit normal on the INCIDENCE side (cosi =
     -d.nrm > 0); eta = n_incidence / n_transmit. Returns unit refracted
     direction, or null for total internal reflection. */
  WavesModels.refractDir = function (d, nrm, eta) {
    var cosi = -(d[0] * nrm[0] + d[1] * nrm[1]);
    var k = 1 - eta * eta * (1 - cosi * cosi);
    if (k < 0) return null;
    var c2 = Math.sqrt(k);
    var rx = eta * d[0] + (eta * cosi - c2) * nrm[0];
    var ry = eta * d[1] + (eta * cosi - c2) * nrm[1];
    var L = Math.hypot(rx, ry);
    return [rx / L, ry / L];
  };

  /* ---- speed of sound / echo methods -----------------------------------
     Direct timing over a measured distance: v = d / t.
     Echo (sonar / echolocation / clap-off-a-wall): the pulse travels to
     the reflector and back, so v = 2 d / t  <=>  d = v t / 2.            */
  WavesModels.speedDirect = function (d, t) { return d / t; };
  WavesModels.echoDistance = function (v, t) { return v * t / 2; };
  WavesModels.echoTime = function (v, d) { return 2 * d / v; };
  WavesModels.speedFromEcho = function (d, t) { return 2 * d / t; };

  /* ---- electromagnetic spectrum ----------------------------------------
     Seven regions. Canonical order by INCREASING frequency / DECREASING
     wavelength (radio has the longest wavelength + lowest frequency;
     gamma the shortest wavelength + highest frequency). All travel at c
     in a vacuum. wlText/freqText are order-of-magnitude anchors for
     labels only (not exam-required values). origin = where the radiation
     is produced; uses = the spec's example applications.                 */
  WavesModels.EM = {
    order: ["radio", "microwave", "infrared", "visible", "ultraviolet", "xray", "gamma"],
    region: {
      radio:       { label: "Radio",        wlText: "1 km - 10 cm",  origin: "oscillations of charge in an aerial / electrical circuit",
                     uses: ["television and radio broadcasting"] },
      microwave:   { label: "Microwave",    wlText: "10 cm - 1 mm",  origin: "electron oscillations, e.g. in a magnetron",
                     uses: ["satellite communications", "cooking food"] },
      infrared:    { label: "Infrared",     wlText: "1 mm - 700 nm", origin: "warm/hot objects (thermal vibration of particles)",
                     uses: ["electrical heaters", "cooking food", "infrared cameras"] },
      visible:     { label: "Visible",      wlText: "700 - 400 nm",  origin: "very hot objects and electron energy-level transitions",
                     uses: ["fibre-optic communications"] },
      ultraviolet: { label: "Ultraviolet",  wlText: "400 - 10 nm",   origin: "very hot objects and some electron transitions",
                     uses: ["energy-efficient lamps", "sun tanning"] },
      xray:        { label: "X-ray",        wlText: "10 nm - 0.01 nm", origin: "fast electrons stopped by a metal target",
                     uses: ["medical imaging of bones", "security scanners"] },
      gamma:       { label: "Gamma",        wlText: "< 0.01 nm",     origin: "changes in the nucleus of an atom (radioactive decay)",
                     uses: ["sterilising food and medical equipment", "killing cancer cells"] }
    },
    /* index in the canonical order; lower index = longer wavelength,
       lower frequency. Used by the marking widget to grade "which end is
       high frequency".                                                    */
    indexOf: function (name) { return WavesModels.EM.order.indexOf(name); }
  };
  WavesModels.emHigherFrequency = function (a, b) {
    return WavesModels.EM.indexOf(a) > WavesModels.EM.indexOf(b) ? a : b;
  };
  WavesModels.emLongerWavelength = function (a, b) {
    return WavesModels.EM.indexOf(a) < WavesModels.EM.indexOf(b) ? a : b;
  };


  /* ===================== STATIC RENDERERS: anatomy ====================== */
  /* A side-on plotting frame for transverse pictures: x runs left->right,
     y is vertical displacement with the rest line centred. Not CORE.grid
     (no exam gridlines wanted for anatomy); a private light mapping.     */
  function sideFrame(cfg) {
    var w = cfg.w || 460, h = cfg.h || 220;
    var m = { l: cfg.ml || 30, r: cfg.mr || 30, t: cfg.mt || 26, b: cfg.mb || 26 };
    var svg = makeSVG(w, h, cfg.label);
    var X0 = m.l, X1 = w - m.r, Yc = (m.t + (h - m.b)) / 2;
    var halfH = (h - m.t - m.b) / 2;
    var xmin = 0, xmax = cfg.xmax;
    var yspan = cfg.yspan || 1;                  /* data y at +-yspan -> edges */
    function px(x) { return X0 + (x - xmin) / (xmax - xmin) * (X1 - X0); }
    function py(y) { return Yc - (y / yspan) * halfH; }
    return { svg: svg, px: px, py: py, X0: X0, X1: X1, Yc: Yc, halfH: halfH,
             w: w, h: h, add: function (n) { svg.appendChild(n); return this; } };
  }

  /* double-headed measurement arrow with a label, in PIXEL space         */
  function measureArrow(x1, y1, x2, y2, label, opts) {
    opts = opts || {};
    var g = el("g");
    var col = opts.color || C.accent;
    var ang = Math.atan2(y2 - y1, x2 - x1);
    g.appendChild(line(x1, y1, x2, y2, { color: col, width: opts.width || 1.6 }));
    g.appendChild(arrowHead(x1, y1, ang + Math.PI, 6, col));
    g.appendChild(arrowHead(x2, y2, ang, 6, col));
    if (label) {
      var mx = (x1 + x2) / 2 + (opts.ldx || 0), my = (y1 + y2) / 2 + (opts.ldy || -5);
      g.appendChild(txt(mx, my, label, { fill: col, "font-size": opts.fontSize || 12.5,
        "text-anchor": opts.anchor || "middle", "font-style": "italic" }));
    }
    return g;
  }
  /* short tick marks (end caps) for an extent line                        */
  function endCaps(x1, y1, x2, y2, capLen, col) {
    var g = el("g"), c = capLen || 6;
    var ang = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
    var dx = Math.cos(ang) * c, dy = Math.sin(ang) * c;
    g.appendChild(line(x1 - dx, y1 - dy, x1 + dx, y1 + dy, { color: col || C.ink2, width: 1 }));
    g.appendChild(line(x2 - dx, y2 - dy, x2 + dx, y2 + dy, { color: col || C.ink2, width: 1 }));
    return g;
  }

  /* ---------------------------- wave_train ------------------------------
     params: { wavelength, amplitude, cycles, orientation:"horizontal",
               mark:{ wavelength, half_wavelength, amplitude, arrows,
                      restLine }, distractor:"amplitude_double" |
               "amplitude_diagonal" | "wavelength_half" |
               "wavelength_peak_to_trough", label }
     mark.* default false (clean anatomy unless an item asks to annotate);
     a single named distractor renders a DELIBERATELY-WRONG annotation in
     a warning colour, for MCQ-over-the-picture items (the 6.5 named-wrong
     pattern). The interactive widget below grades pupil-placed marks.    */
  function wave_train(params) {
    params = params || {};
    var mdl = WavesModels.wave(params);
    var mark = params.mark || {};
    var orient = params.orientation || "horizontal";
    var fr = sideFrame({ w: params.w || 480, h: params.h || 230, xmax: mdl.xmax,
      yspan: 1.25, label: params.label || "transverse wave" });
    var ampPx = fr.halfH / 1.25;             /* pixels per unit amplitude (A=1) */

    /* rest line (axis of the medium at rest) */
    if (mark.restLine !== false)
      fr.add(line(fr.X0, fr.Yc, fr.X1, fr.Yc, { color: C.line, width: 1.1, dash: "5 4" }));

    /* the wave itself */
    var d = "", i, N = 360, x, yy, first = true;
    for (i = 0; i <= N; i++) {
      x = mdl.xmax * i / N; yy = mdl.y(x) / Math.max(1, mdl.amplitude);
      d += (first ? "M" : "L") + fr.px(x).toFixed(2) + "," + fr.py(yy).toFixed(2) + " ";
      first = false;
    }
    fr.add(el("path", { d: d.trim(), fill: "none", stroke: C.accent,
      "stroke-width": 2.6, "stroke-linecap": "round", "stroke-linejoin": "round" }));

    /* crest / trough direction arrows (oscillation is perpendicular) */
    if (mark.arrows) {
      var aLen = ampPx * 0.55, cx;
      if (mdl.crests[0] != null) {
        cx = mdl.crests[0];
        fr.add(CORE.forceArrow(fr.px(cx), fr.Yc - ampPx * 0.18, fr.px(cx), fr.Yc - ampPx - aLen * 0.0,
          { color: C.ink2, width: 2, label: "" }));
      }
      if (mdl.troughs[0] != null) {
        cx = mdl.troughs[0];
        fr.add(CORE.forceArrow(fr.px(cx), fr.Yc + ampPx * 0.18, fr.px(cx), fr.Yc + ampPx,
          { color: C.ink2, width: 2 }));
      }
    }

    /* correct annotations (opt-in) */
    if (mark.wavelength && mdl.crests.length >= 2) {
      var a = mdl.crests[0], b = mdl.crests[1], yL = fr.py(1) - 14;
      fr.add(endCaps(fr.px(a), yL, fr.px(b), yL, 6, C.ink2));
      fr.add(measureArrow(fr.px(a), yL, fr.px(b), yL, "lambda", { ldy: -6 }));
    }
    if (mark.half_wavelength && mdl.crests[0] != null && mdl.troughs[0] != null) {
      var c0 = Math.min(mdl.crests[0], mdl.troughs[0]);
      var t0 = (mdl.troughs[0] > mdl.crests[0]) ? mdl.troughs[0] : (mdl.troughs[1] != null ? mdl.troughs[1] : mdl.troughs[0]);
      var yH = fr.Yc + fr.halfH * 0.62;
      fr.add(measureArrow(fr.px(mdl.crests[0]), yH, fr.px(t0), yH, "lambda/2", { ldy: 14, color: C.ink2 }));
    }
    if (mark.amplitude && mdl.crests[0] != null) {
      var xc = mdl.crests[0];
      fr.add(measureArrow(fr.px(xc) - 0, fr.Yc, fr.px(xc), fr.py(1), "A",
        { color: C.ok, anchor: "start", ldx: 8, ldy: 4 }));
    }

    /* deliberately-wrong named annotation (for distractor pictures) */
    var dz = params.distractor;
    if (dz) {
      var warn = C.accent;
      if (dz === "amplitude_double" && mdl.crests[0] != null) {
        var xa = mdl.crests[0];
        fr.add(measureArrow(fr.px(xa), fr.py(1), fr.px(xa), fr.py(-1), "A?",
          { color: warn, anchor: "start", ldx: 8 }));
      } else if (dz === "amplitude_diagonal" && mdl.crests[0] != null && mdl.troughs[0] != null) {
        fr.add(measureArrow(fr.px(mdl.crests[0]), fr.py(1), fr.px(mdl.troughs[0]), fr.py(-1),
          "A?", { color: warn }));
      } else if (dz === "wavelength_half" && mdl.crests[0] != null && mdl.troughs[0] != null) {
        var yLh = fr.py(1) - 14;
        fr.add(measureArrow(fr.px(mdl.crests[0]), yLh, fr.px(mdl.troughs[0]), yLh, "lambda?",
          { color: warn, ldy: -6 }));
      } else if (dz === "wavelength_peak_to_trough" && mdl.crests[0] != null && mdl.troughs[0] != null) {
        fr.add(measureArrow(fr.px(mdl.crests[0]), fr.py(1), fr.px(mdl.troughs[0]), fr.py(-1),
          "lambda?", { color: warn }));
      }
    }

    /* vertical orientation: rotate the whole picture 90 degrees */
    if (orient === "vertical") {
      var gWrap = el("g", { transform: "rotate(90 " + (fr.w / 2) + " " + (fr.h / 2) + ")" });
      while (fr.svg.childNodes.length > 1) gWrap.appendChild(fr.svg.childNodes[1]);
      fr.svg.appendChild(gWrap);
    }
    return fr.svg;
  }

  /* ----------------------------- wavefronts -----------------------------
     Plan view. Plane waves -> parallel fronts one wavelength apart; a
     point source -> concentric arcs whose radii step by one wavelength.
     params: { spacing|wavelength, count, curved, direction:"right",
               mark:{ wavelength }, source:false, label }                 */
  function wavefronts(params) {
    params = params || {};
    var info = WavesModels.wavefronts(params);
    var w = params.w || 360, h = params.h || 240;
    var svg = makeSVG(w, h, params.label || "wavefronts (plan view)");
    var m = 26;
    var curved = info.curved;
    var n = info.count;

    if (!curved) {
      /* parallel vertical fronts moving in the direction of the ray */
      var spanX = (w - 2 * m);
      var dpx = spanX / (n + 0.5);
      var i, x;
      for (i = 0; i < n; i++) {
        x = m + dpx * (i + 0.5);
        svg.appendChild(line(x, m, x, h - m, { color: C.ink, width: 2 }));
      }
      /* direction-of-travel ray arrow */
      svg.appendChild(CORE.forceArrow(m + dpx * 0.3, h / 2, w - m * 0.6, h / 2,
        { color: C.muted, width: 1.6, label: "" }));
      if (params.mark && params.mark.wavelength && n >= 2) {
        var xa = m + dpx * 0.5, xb = m + dpx * 1.5, yL = h - m + 0;
        svg.appendChild(measureArrow(xa, m - 8, xb, m - 8, "lambda", { ldy: -5 }));
      }
    } else {
      /* concentric circular fronts from a source at left-centre */
      var sx = m + 6, sy = h / 2, j, r;
      var dr = (w - 2 * m) / (n + 0.5);
      svg.appendChild(circle(sx, sy, 3, { fill: C.accent, stroke: C.accent }));
      for (j = 1; j <= n; j++) {
        r = dr * j;
        /* draw a forward arc (semicircle facing right) */
        svg.appendChild(el("path", {
          d: "M" + sx + "," + (sy - r) + " A" + r + "," + r + " 0 0 1 " + sx + "," + (sy + r),
          fill: "none", stroke: C.ink, "stroke-width": 2 }));
      }
      if (params.mark && params.mark.wavelength && n >= 2) {
        svg.appendChild(measureArrow(sx + dr * 1, sy, sx + dr * 2, sy, "lambda", { ldy: -6 }));
      }
    }
    return svg;
  }

  /* -------------------------- longitudinal_wave -------------------------
     Particle/coil density picture. Particles drawn as vertical lines;
     base positions are displaced by s(x) = shift*sin(kx+phase) so that
     d(x_drawn)/dx_base = 1 + shift*k*cos(kx) is minimum (lines crowd ->
     COMPRESSION) where cos = -1, i.e. at x = lambda/2, 3lambda/2, ...,
     consistent with WavesModels.longitudinal compressions. Rarefactions
     where lines spread. wavelength = C-to-C (= R-to-R); C-to-R is HALF
     (the named distractor).
     params: { wavelength, cycles, phase, blanks:false (label boxes at a
               C and an R), mark:{ wavelength, half_wavelength, labelCR },
               distractor:"wavelength_C_to_R", label }                    */
  function longitudinal_wave(params) {
    params = params || {};
    var info = WavesModels.longitudinal(params);
    var lambda = info.wavelength, k = TAU / lambda, phase = params.phase || 0;
    var w = params.w || 480, h = params.h || 200;
    var svg = makeSVG(w, h, params.label || "longitudinal wave");
    var m = 28, X0 = m, X1 = w - m, yTop = m, yBot = h - m - 18;
    var shift = 0.7 / k;                       /* shift*k = 0.7 < 1, no crossing */
    var px = function (x) { return X0 + (x / info.xmax) * (X1 - X0); };
    /* draw base particle lines */
    var step = lambda / 14, x;
    for (x = 0; x <= info.xmax + 1e-9; x += step) {
      var xd = x + shift * Math.sin(k * x + phase);
      if (xd < -1e-6 || xd > info.xmax + 1e-6) continue;
      svg.appendChild(line(px(xd), yTop, px(xd), yBot, { color: C.ink, width: 1.4 }));
    }
    /* C / R labels under the first compression and rarefaction */
    var cX = info.compressions[0], rX = info.rarefactions.filter(function (v) { return v > 0.01; })[0];
    var yLab = yBot + 14;
    if (params.mark && params.mark.labelCR) {
      if (cX != null) svg.appendChild(txt(px(cX), yLab, "C", { "text-anchor": "middle", fill: C.accent, "font-weight": "bold", "font-size": 13 }));
      if (rX != null) svg.appendChild(txt(px(rX), yLab, "R", { "text-anchor": "middle", fill: C.ok, "font-weight": "bold", "font-size": 13 }));
    }
    if (params.blanks) {
      /* empty label boxes (pupil writes C / R) */
      [cX, rX].forEach(function (xx) {
        if (xx == null) return;
        svg.appendChild(el("rect", { x: px(xx) - 9, y: yLab - 12, width: 18, height: 16, rx: 3,
          fill: C.paper, stroke: C.ink2, "stroke-width": 1, "stroke-dasharray": "3 2" }));
      });
    }
    /* wavelength marked compression-to-compression */
    if (params.mark && params.mark.wavelength && info.compressions.length >= 2) {
      var ya = yTop - 8;
      svg.appendChild(measureArrow(px(info.compressions[0]), ya, px(info.compressions[1]), ya, "lambda", { ldy: -5 }));
    }
    if (params.mark && params.mark.half_wavelength && cX != null && rX != null) {
      var yh = yTop - 8;
      svg.appendChild(measureArrow(px(Math.min(cX, rX)), yh, px(Math.max(cX, rX)), yh, "lambda/2", { ldy: -5, color: C.ink2 }));
    }
    /* distractor: wavelength marked C-to-R (half) */
    if (params.distractor === "wavelength_C_to_R" && cX != null && rX != null) {
      var yd = yTop - 8;
      svg.appendChild(measureArrow(px(cX), yd, px(rX), yd, "lambda?", { ldy: -5, color: C.accent }));
    }
    return svg;
  }

  /* ================= PURE SCORER: wave-feature marking ==================
     Re-scorable headless (no DOM), so Housing can grade stored attempts.
     answer: { feature, p1:[x,y], p2:[x,y] } in DATA units (x along the
     wave, y = displacement for transverse; for longitudinal/wavefronts y
     is unused and any small value is fine).
     cfg:    the wave params PLUS { kind:"transverse"|"longitudinal"|
             "wavefronts", target, tolerance, marks }.
     marks (default 2): METHOD mark (right feature, right orientation,
     endpoints on the correct wave landmarks) + VALUE mark (length within
     tolerance). errorCodes feed the d004 dashboard.                       */
  WavesModels.scoreWaveMark = function (answer, cfg) {
    cfg = cfg || {};
    var marksPossible = (typeof cfg.marks === "number") ? cfg.marks : 2;
    var target = (answer && answer.feature) || cfg.target || "wavelength";
    var mdl, A = 1, lambda;
    if (cfg.kind === "longitudinal") { mdl = WavesModels.longitudinal(cfg); lambda = mdl.wavelength; }
    else if (cfg.kind === "wavefronts") {
      lambda = (cfg.spacing != null) ? cfg.spacing : (cfg.wavelength != null ? cfg.wavelength : 1);
      mdl = { features: { wavelength: { length: lambda, orientation: "horizontal" },
                          half_wavelength: { length: lambda / 2, orientation: "horizontal" } } };
    } else { mdl = WavesModels.wave(cfg); lambda = mdl.wavelength; A = mdl.amplitude; }
    var feat = mdl.features[target];
    if (!feat) return { marksAwarded: 0, marksPossible: marksPossible, status: "none",
      hits: [], misses: ["unknown feature: " + target], errorCodes: ["feature_unknown"] };

    var p1 = (answer && answer.p1) || [0, 0], p2 = (answer && answer.p2) || [0, 0];
    var dx = Math.abs(p2[0] - p1[0]), dy = Math.abs(p2[1] - p1[1]);
    var orient = feat.orientation;
    var lenTol = (cfg.tolerance != null) ? cfg.tolerance : Math.max(feat.length * 0.12, lambda * 0.06);
    /* orientation tolerances in data units */
    var hTol = lambda * 0.10;           /* horizontal feature: |dy| small  */
    var vTol = (A || 1) * 0.18;         /* vertical feature:   |dx| small  */

    var hits = [], misses = [], codes = [], marks = 0;
    var measured = (orient === "horizontal") ? dx : dy;
    var orientationOk = (orient === "horizontal") ? (dy <= hTol) : (dx <= vTol);
    var lengthOk = near(measured, feat.length, lenTol);

    /* ---- diagnostics: catch the named distractor placements ---- */
    if (orient === "horizontal") {
      if (!orientationOk) codes.push("feature_orientation_wrong");   /* drew a diagonal/vertical */
      if (target === "wavelength" && near(measured, lambda / 2, lenTol)) codes.push("wavelength_half");
      if (target === "half_wavelength" && near(measured, lambda, lenTol)) codes.push("half_marked_as_full");
      /* a diagonal crest->trough reads ~lambda/2 in x AND ~2A in y */
      if (target === "wavelength" && !orientationOk && near(dx, lambda / 2, lenTol)) codes.push("wavelength_peak_to_trough");
      if (cfg.kind === "longitudinal" && target === "wavelength" && near(measured, lambda / 2, lenTol)) codes.push("wavelength_C_to_R");
    } else {  /* amplitude */
      if (near(dy, 2 * A, Math.max(2 * A * 0.12, lenTol)) ) { codes.push("amplitude_peak_to_trough"); }
      if (dx > vTol && dy > vTol) codes.push("amplitude_diagonal");
      if (dx > vTol) codes.push("feature_orientation_wrong");
    }

    /* method mark */
    if (orientationOk && (orient === "horizontal" ? true : true)) {
      if (orient === "horizontal" || (dx <= vTol)) { marks++; hits.push("placement: correct orientation for " + target); }
    }
    if (!(orientationOk)) misses.push("placement: " + target + " should be measured " + orient + "ly");
    /* value mark */
    if (lengthOk) { marks++; hits.push(target + " length " + fmt(measured) + " (accepted " + fmt(feat.length) + " +- " + fmt(lenTol) + ")"); }
    else { misses.push(target + ": expected about " + fmt(feat.length) + ", got " + fmt(measured)); if (codes.indexOf("amplitude_peak_to_trough") < 0) codes.push(orient === "horizontal" ? "wavelength_value_wrong" : "amplitude_value_wrong"); }

    /* never award the value mark off a wrong-orientation read even if the
       number coincides (e.g. amplitude read peak-to-trough that happens to
       match a tolerance) */
    if (!orientationOk && marks > 1) marks = 1;
    /* de-dupe codes */
    codes = codes.filter(function (v, i) { return codes.indexOf(v) === i; });
    return { marksAwarded: marks, marksPossible: marksPossible,
      status: marks >= marksPossible ? "full" : (marks > 0 ? "partial" : "none"),
      hits: hits, misses: misses, errorCodes: codes };
  };

  /* ===================== INTERACTIVE WIDGETS ============================ */
  /* Contract (proposed to Housing in Widgets_Housing_interactive_66.md,
     identical shape to the 6.5 thread):
       window.TOPIC_WIDGETS[kind](host, config) -> instance
       instance.getAnswer() -> structured pupil response (shape per kind)
       instance.score(answer, config) ->
         { marksAwarded, marksPossible, status, hits, misses, errorCodes }
       instance.destroy()                                                  */
  function makePanel(host) {
    var panel = document.createElement("div");
    panel.className = "tw-panel";
    panel.style.cssText = "margin-top:8px;padding:8px 10px;border:1px solid rgba(26,26,23,.18);border-radius:6px;font:13px var(--sans, system-ui)";
    host.appendChild(panel);
    return panel;
  }
  function featureSelect(panel, features, fixed) {
    var row = document.createElement("label");
    row.style.cssText = "display:flex;align-items:center;gap:8px;margin:2px 0 8px";
    var span = document.createElement("span"); span.textContent = "I am marking:";
    var sel = document.createElement("select");
    features.forEach(function (f) {
      var o = document.createElement("option"); o.value = f;
      o.textContent = f.replace(/_/g, " "); sel.appendChild(o);
    });
    if (fixed) { sel.value = fixed; sel.disabled = true; }
    sel.style.cssText = "font:inherit;padding:3px 6px";
    row.appendChild(span); row.appendChild(sel); panel.appendChild(row);
    return sel;
  }

  /* -- interactive wave marking: drag a two-handle measurement line ------
     Used for wave_train (transverse), longitudinal_wave and wavefronts:
     the pupil drags two snapped handles to span the feature, picks which
     feature from a selector (or the author fixes it), and is scored by
     WavesModels.scoreWaveMark.                                            */
  function buildMarkWidget(host, config, kind) {
    config = config || {};
    host.innerHTML = "";
    var featList = (kind === "transverse") ? ["wavelength", "half_wavelength", "amplitude"]
                 : ["wavelength", "half_wavelength"];
    /* rebuild the picture WITH coordinate maps so handles live in data space */
    var maps;
    if (kind === "transverse") {
      var mdl = WavesModels.wave(config);
      var fr = sideFrame({ w: config.w || 480, h: config.h || 230, xmax: mdl.xmax, yspan: 1.25,
        label: "mark the feature" });
      fr.add(line(fr.X0, fr.Yc, fr.X1, fr.Yc, { color: C.line, width: 1.1, dash: "5 4" }));
      var d = "", i, N = 360, x, yy, first = true;
      for (i = 0; i <= N; i++) { x = mdl.xmax * i / N; yy = mdl.y(x) / Math.max(1, mdl.amplitude);
        d += (first ? "M" : "L") + fr.px(x).toFixed(2) + "," + fr.py(yy).toFixed(2) + " "; first = false; }
      fr.add(el("path", { d: d.trim(), fill: "none", stroke: C.accent, "stroke-width": 2.6,
        "stroke-linecap": "round", "stroke-linejoin": "round" }));
      maps = { svg: fr.svg, px: fr.px, py: fr.py, x2data: function (X) { return (X - fr.X0) / (fr.X1 - fr.X0) * mdl.xmax; },
        y2data: function (Y) { return (fr.Yc - Y) / fr.halfH * 1.25; }, xmax: mdl.xmax, yspan: 1.25 };
    } else if (kind === "longitudinal") {
      host.appendChild(longitudinal_wave(config));
      var lm = WavesModels.longitudinal(config);
      var w = config.w || 480, m = 28;
      var X0 = m, X1 = w - m;
      maps = { svg: host.firstChild, px: function (x) { return X0 + x / lm.xmax * (X1 - X0); },
        py: function () { return (config.h || 200) / 2; },
        x2data: function (X) { return (X - X0) / (X1 - X0) * lm.xmax; }, y2data: function () { return 0; },
        xmax: lm.xmax, yspan: 1 };
    } else { /* wavefronts */
      host.appendChild(wavefronts(config));
      var lamb = (config.spacing != null) ? config.spacing : (config.wavelength != null ? config.wavelength : 1);
      var nfr = (config.count != null) ? config.count : 6;
      var ww = config.w || 360, mm = 26, spanX = ww - 2 * mm, dpx = spanX / (nfr + 0.5);
      maps = { svg: host.firstChild, px: function (x) { return mm + dpx * 0.5 + x / lamb * dpx; },
        py: function () { return (config.h || 240) / 2; },
        x2data: function (X) { return (X - (mm + dpx * 0.5)) / dpx * lamb; }, y2data: function () { return 0; },
        xmax: lamb * nfr, yspan: 1 };
    }
    if (kind === "transverse") host.appendChild(maps.svg);

    /* draggable measurement line over the picture */
    var sb = maps.xmax / 10;
    var p1 = [maps.xmax * 0.25, 0], p2 = [maps.xmax * 0.55, 0];
    var lineEl = el("line", { stroke: C.ok, "stroke-width": 2.4, "stroke-linecap": "round" });
    var h1 = el("circle", { r: 8, fill: C.ok, "fill-opacity": 0.55, stroke: C.ok, "stroke-width": 1.5 });
    var h2 = el("circle", { r: 8, fill: C.ok, "fill-opacity": 0.55, stroke: C.ok, "stroke-width": 1.5 });
    maps.svg.appendChild(lineEl); maps.svg.appendChild(h1); maps.svg.appendChild(h2);
    function redraw() {
      lineEl.setAttribute("x1", maps.px(p1[0])); lineEl.setAttribute("y1", maps.py(p1[1]));
      lineEl.setAttribute("x2", maps.px(p2[0])); lineEl.setAttribute("y2", maps.py(p2[1]));
      h1.setAttribute("cx", maps.px(p1[0])); h1.setAttribute("cy", maps.py(p1[1]));
      h2.setAttribute("cx", maps.px(p2[0])); h2.setAttribute("cy", maps.py(p2[1]));
    }
    redraw();
    CORE.makeDraggable(maps.svg, h1, function (pt) { p1 = [clamp(maps.x2data(pt.x), 0, maps.xmax), maps.y2data(pt.y)]; redraw(); });
    CORE.makeDraggable(maps.svg, h2, function (pt) { p2 = [clamp(maps.x2data(pt.x), 0, maps.xmax), maps.y2data(pt.y)]; redraw(); });

    var panel = makePanel(host);
    var sel = featureSelect(panel, featList, config.target);
    var note = document.createElement("div");
    note.style.cssText = "color:var(--muted,#8c8579);font-size:12px";
    note.textContent = "Drag the two green handles to span the feature.";
    panel.appendChild(note);

    var scoreKind = (kind === "transverse") ? "transverse" : kind;
    return {
      getAnswer: function () { return { feature: sel.value, p1: p1.slice(), p2: p2.slice() }; },
      score: function (answer, cfg2) {
        cfg2 = cfg2 || config; var c = {}; for (var kk in cfg2) c[kk] = cfg2[kk];
        c.kind = scoreKind; if (!c.target) c.target = (answer && answer.feature);
        return WavesModels.scoreWaveMark(answer, c);
      },
      destroy: function () { host.innerHTML = ""; }
    };
  }
  function widget_wave_train(host, config) { return buildMarkWidget(host, config, "transverse"); }
  function widget_longitudinal_wave(host, config) { return buildMarkWidget(host, config, "longitudinal"); }
  function widget_wavefronts(host, config) { return buildMarkWidget(host, config, "wavefronts"); }

  /* ===================== STATIC RENDERERS: scenarios ==================== */
  /* small reusable sprites (schematic, not to scale; labels carry the
     physics). All take a parent <svg> and pixel coords.                  */
  function stickPerson(x, yFeet, h, col) {
    var g = el("g"), c = col || C.ink, head = h * 0.18;
    g.appendChild(circle(x, yFeet - h + head, head, { stroke: c, width: 1.6 }));
    g.appendChild(line(x, yFeet - h + 2 * head, x, yFeet - h * 0.35, { color: c, width: 1.6 }));
    g.appendChild(line(x, yFeet - h * 0.78, x - h * 0.2, yFeet - h * 0.55, { color: c, width: 1.6 }));
    g.appendChild(line(x, yFeet - h * 0.78, x + h * 0.2, yFeet - h * 0.55, { color: c, width: 1.6 }));
    g.appendChild(line(x, yFeet - h * 0.35, x - h * 0.18, yFeet, { color: c, width: 1.6 }));
    g.appendChild(line(x, yFeet - h * 0.35, x + h * 0.18, yFeet, { color: c, width: 1.6 }));
    return g;
  }
  function waterBand(svg, x0, x1, yTop, yBot, lambdaPx, opts) {
    opts = opts || {};
    svg.appendChild(el("rect", { x: x0, y: yTop, width: x1 - x0, height: yBot - yTop,
      fill: "rgba(60,110,150,.12)", stroke: "none" }));
    /* surface ripples drawn as a sine on the top edge */
    var d = "", N = 200, i, x, amp = opts.amp || 5, first = true;
    for (i = 0; i <= N; i++) { x = x0 + (x1 - x0) * i / N;
      d += (first ? "M" : "L") + x.toFixed(1) + "," + (yTop + amp * Math.sin(TAU * (x - x0) / lambdaPx)).toFixed(1) + " "; first = false; }
    svg.appendChild(el("path", { d: d.trim(), fill: "none", stroke: C.ink2, "stroke-width": 1.6 }));
    return yTop;
  }

  /* ---------------------------- wave_scenario ---------------------------
     variants: "shore" | "pier" | "sonar" | "speed_clap" | "echo_wall" |
               "clap_rhythm"
     params: { variant, mark:{distance,time,count}, values:{...}, label }
     Each scene is schematic; markable distances/times carry the physics.
     Models: pier frequency = count/time; sonar depth = v t/2; clap-distance
     v = d/t; echo-wall/clap-rhythm v = 2d/t.                              */
  function wave_scenario(params) {
    params = params || {};
    var v = params.variant || "shore";
    var w = params.w || 460, h = params.h || 240;
    var svg = makeSVG(w, h, params.label || ("wave scenario: " + v));
    var mk = params.mark || {}, val = params.values || {};

    if (v === "shore") {
      waterBand(svg, 20, w - 90, 70, h - 30, 46, { amp: 6 });
      /* beach wedge on the right */
      svg.appendChild(el("path", { d: "M" + (w - 90) + "," + (h - 30) + " L" + (w - 20) + "," + (h - 70) +
        " L" + (w - 20) + "," + (h - 30) + " Z", fill: "rgba(180,150,90,.35)", stroke: C.ink2, "stroke-width": 1.2 }));
      svg.appendChild(CORE.forceArrow(60, 55, w - 110, 55, { color: C.muted, width: 1.6 }));
      svg.appendChild(txt(w / 2 - 30, 46, "waves travel toward the shore", { fill: C.ink2, "font-size": 11.5, "text-anchor": "middle" }));
      if (mk.distance) svg.appendChild(measureArrow(50, h - 18, w - 130, h - 18, (val.distance || "d"), { ldy: 12 }));
    } else if (v === "pier") {
      waterBand(svg, 20, w - 20, 95, h - 24, 40, { amp: 6 });
      /* pier post + person counting */
      svg.appendChild(el("rect", { x: w * 0.5 - 6, y: 70, width: 12, height: h - 24 - 70, fill: "rgba(120,90,60,.5)", stroke: C.ink2, "stroke-width": 1 }));
      svg.appendChild(stickPerson(w * 0.5, 70, 40, C.ink));
      svg.appendChild(txt(w * 0.5 + 16, 40, "counts waves passing a point", { fill: C.ink2, "font-size": 11.5 }));
      svg.appendChild(txt(w * 0.5 + 16, 56, "in a measured time -> f = count / time", { fill: C.muted, "font-size": 10.5 }));
      if (mk.count) svg.appendChild(txt(40, 120, "N = " + (val.count || "?") + " waves", { fill: C.accent, "font-size": 12 }));
      if (mk.time) svg.appendChild(txt(40, 138, "t = " + (val.time || "?") + " s", { fill: C.accent, "font-size": 12 }));
    } else if (v === "sonar") {
      /* boat on the surface, pulse down to seabed and back */
      svg.appendChild(line(20, 60, w - 20, 60, { color: "rgba(60,110,150,.5)", width: 2 }));
      svg.appendChild(el("rect", { x: 20, y: 60, width: w - 40, height: h - 90, fill: "rgba(60,110,150,.12)" }));
      svg.appendChild(el("path", { d: "M" + (w / 2 - 28) + ",54 q28,16 56,0 z", fill: "rgba(120,90,60,.7)", stroke: C.ink2, "stroke-width": 1 }));
      svg.appendChild(el("rect", { x: 20, y: h - 30, width: w - 40, height: 16, fill: "rgba(120,90,60,.4)", stroke: C.ink2, "stroke-width": 1 }));
      svg.appendChild(CORE.forceArrow(w / 2 - 6, 64, w / 2 - 6, h - 32, { color: C.accent, width: 1.6 }));
      svg.appendChild(CORE.forceArrow(w / 2 + 6, h - 32, w / 2 + 6, 64, { color: C.ok, width: 1.6 }));
      svg.appendChild(txt(w / 2 + 14, h / 2, "pulse down, echo back: depth = v t / 2", { fill: C.ink2, "font-size": 11 }));
      if (mk.time) svg.appendChild(txt(40, 80, "echo time t = " + (val.time || "?") + " s", { fill: C.accent, "font-size": 12 }));
      if (mk.distance) svg.appendChild(measureArrow(34, 64, 34, h - 32, (val.depth || "depth"), { ldx: -2, ldy: 0, anchor: "end" }));
    } else if (v === "speed_clap") {
      /* two people a measured distance apart; clap + stopwatch */
      svg.appendChild(line(20, h - 40, w - 20, h - 40, { color: C.ink2, width: 1.4 }));
      svg.appendChild(stickPerson(60, h - 40, 46, C.ink));
      svg.appendChild(stickPerson(w - 60, h - 40, 46, C.ink));
      svg.appendChild(txt(60, h - 96, "claps", { fill: C.ink2, "font-size": 11, "text-anchor": "middle" }));
      svg.appendChild(txt(w - 60, h - 96, "stopwatch", { fill: C.ink2, "font-size": 11, "text-anchor": "middle" }));
      svg.appendChild(el("path", { d: "M70," + (h - 70) + " q40,-12 80,0", fill: "none", stroke: C.accent, "stroke-width": 1.4, "stroke-dasharray": "4 3" }));
      svg.appendChild(txt(w / 2, 30, "sound over a measured distance: v = d / t", { fill: C.ink2, "font-size": 11.5, "text-anchor": "middle" }));
      if (mk.distance) svg.appendChild(measureArrow(60, h - 22, w - 60, h - 22, (val.distance || "d"), { ldy: 12 }));
      if (mk.time) svg.appendChild(txt(w - 60, h - 110, "t = " + (val.time || "?") + " s", { fill: C.accent, "font-size": 11, "text-anchor": "middle" }));
    } else if (v === "echo_wall" || v === "clap_rhythm") {
      /* person a measured distance from a wall; clap, hear echo */
      svg.appendChild(line(20, h - 40, w - 40, h - 40, { color: C.ink2, width: 1.4 }));
      svg.appendChild(el("rect", { x: w - 40, y: 50, width: 20, height: h - 90, fill: "rgba(120,120,120,.5)", stroke: C.ink2, "stroke-width": 1.2 }));
      svg.appendChild(txt(w - 30, 44, "wall", { fill: C.ink2, "font-size": 10.5, "text-anchor": "middle" }));
      svg.appendChild(stickPerson(70, h - 40, 46, C.ink));
      svg.appendChild(CORE.forceArrow(86, h - 70, w - 48, h - 70, { color: C.accent, width: 1.5 }));
      svg.appendChild(CORE.forceArrow(w - 48, h - 86, 86, h - 86, { color: C.ok, width: 1.5 }));
      var msg = (v === "clap_rhythm")
        ? "clap in rhythm with each echo: t between claps = 2d / v"
        : "time the echo: v = 2d / t";
      svg.appendChild(txt(w / 2, 30, msg, { fill: C.ink2, "font-size": 11, "text-anchor": "middle" }));
      if (mk.distance) svg.appendChild(measureArrow(70, h - 22, w - 30, h - 22, (val.distance || "d"), { ldy: 12 }));
      if (mk.time) svg.appendChild(txt(120, h - 100, "t = " + (val.time || "?") + " s", { fill: C.accent, "font-size": 11 }));
    }
    return svg;
  }

  /* ----------------------------- ripple_tank ----------------------------
     Apparatus: a vibrating dipper/beam makes ripples on water; a lamp
     above casts shadows of the wavefronts onto a screen/paper below; a
     stroboscope (or a photo/video) freezes the pattern so a ruler can
     measure ACROSS SEVERAL wavelengths, then lambda = distance / n (the
     count-several-and-divide method that reduces measurement error). With
     f set by the vibrator, v = f lambda.
     params: { variant:"shadow"|"strobe"|"ruler", waves (n spanned),
               mark:{ distance, wavelength }, label }                      */
  function ripple_tank(params) {
    params = params || {};
    var w = params.w || 460, h = params.h || 300;
    var svg = makeSVG(w, h, params.label || "ripple tank");
    var nWaves = (params.waves != null) ? params.waves : 5;
    /* lamp */
    svg.appendChild(circle(w / 2, 26, 9, { fill: "rgba(240,210,80,.8)", stroke: C.ink2, width: 1.2 }));
    svg.appendChild(txt(w / 2 + 16, 28, "lamp", { fill: C.ink2, "font-size": 10.5 }));
    /* light cone */
    svg.appendChild(el("path", { d: "M" + (w / 2 - 6) + ",34 L40,120 L" + (w - 40) + ",120 Z",
      fill: "rgba(240,210,80,.10)", stroke: "none" }));
    /* tank with water + straight wavefronts (plan-ish, seen edge-on) */
    var tx0 = 40, tx1 = w - 40, ty = 96, tb = 124;
    svg.appendChild(el("rect", { x: tx0, y: ty, width: tx1 - tx0, height: tb - ty, fill: "rgba(60,110,150,.14)", stroke: C.ink2, "stroke-width": 1.3 }));
    /* vibrating beam at left makes the ripples */
    svg.appendChild(el("rect", { x: tx0 - 6, y: ty - 10, width: 14, height: 12, fill: "rgba(120,90,60,.6)", stroke: C.ink2, "stroke-width": 1 }));
    svg.appendChild(txt(tx0 + 4, ty - 14, "vibrating beam (frequency f)", { fill: C.ink2, "font-size": 10 }));
    /* screen below with projected wavefronts and a ruler */
    var sy = 150, sb = h - 40;
    svg.appendChild(el("rect", { x: tx0, y: sy, width: tx1 - tx0, height: sb - sy, fill: C.paper, stroke: C.ink2, "stroke-width": 1.2 }));
    svg.appendChild(txt(tx0, sy - 6, "screen: shadows of the wavefronts", { fill: C.muted, "font-size": 10.5 }));
    var span = tx1 - tx0 - 30, lamPx = span / (nWaves + 1), i, x;
    for (i = 1; i <= nWaves + 1; i++) {
      x = tx0 + 15 + lamPx * (i - 0.5);
      svg.appendChild(line(x, sy + 10, x, sb - 24, { color: C.ink, width: 2 }));
    }
    /* ruler measuring across n wavelengths */
    var rx0 = tx0 + 15 + lamPx * 0.5, rx1 = rx0 + lamPx * nWaves;
    svg.appendChild(CORE.ruler ? el("g") : el("g"));
    if (params.mark && params.mark.distance) {
      svg.appendChild(measureArrow(rx0, sb - 14, rx1, sb - 14,
        (nWaves + " wavelengths"), { ldy: 12 }));
      svg.appendChild(txt(tx1, sy - 6, "lambda = distance / " + nWaves, { fill: C.muted, "font-size": 10, "text-anchor": "end" }));
    }
    return svg;
  }

  /* ---------------------------- standing_wave ---------------------------
     Required-practical apparatus: a signal generator drives a vibration
     generator (transducer) at one end; the string passes over a pulley to
     a hanging mass that sets the tension. At the right driving frequency a
     STANDING WAVE forms: fixed NODES (zero amplitude) at the ends and
     between loops, ANTINODES (maximum amplitude) at loop centres. Each
     loop is HALF a wavelength, so lambda = 2 * (node-to-node distance) and
     for n loops over length L, lambda = 2L / n. Changing the masses
     (tension) changes the wave speed and so the pattern.
     params: { loops, masses, mark:{ nodes, antinodes, length, halfLambda },
               label }                                                     */
  function standing_wave(params) {
    params = params || {};
    var loops = (params.loops != null) ? params.loops : 3;
    var w = params.w || 480, h = params.h || 220;
    var svg = makeSVG(w, h, params.label || "standing wave on a string (required practical)");
    var Lx0 = 70, Lx1 = w - 70, yMid = h / 2 - 6, A = Math.min(34, (h / 2 - 30));
    /* vibration generator (left clamp/box) */
    svg.appendChild(el("rect", { x: 28, y: yMid - 22, width: 30, height: 44, rx: 3, fill: "rgba(150,150,150,.4)", stroke: C.ink2, "stroke-width": 1.2 }));
    svg.appendChild(txt(43, yMid + 40, "vibration", { fill: C.ink2, "font-size": 9.5, "text-anchor": "middle" }));
    svg.appendChild(txt(43, yMid + 50, "generator", { fill: C.ink2, "font-size": 9.5, "text-anchor": "middle" }));
    /* the standing-wave envelope: two mirrored sine curves over n loops */
    function envY(x, sgn) {
      var u = (x - Lx0) / (Lx1 - Lx0);
      return yMid + sgn * A * Math.sin(loops * Math.PI * u);
    }
    var d1 = "", d2 = "", N = 240, i, x;
    for (i = 0; i <= N; i++) { x = Lx0 + (Lx1 - Lx0) * i / N;
      d1 += (i ? "L" : "M") + x.toFixed(1) + "," + envY(x, 1).toFixed(1) + " ";
      d2 += (i ? "L" : "M") + x.toFixed(1) + "," + envY(x, -1).toFixed(1) + " "; }
    svg.appendChild(el("path", { d: d1.trim(), fill: "none", stroke: C.accent, "stroke-width": 2, "stroke-opacity": 0.85 }));
    svg.appendChild(el("path", { d: d2.trim(), fill: "none", stroke: C.accent, "stroke-width": 2, "stroke-opacity": 0.5, "stroke-dasharray": "5 3" }));
    svg.appendChild(line(Lx0, yMid, Lx1, yMid, { color: C.line, width: 1, dash: "4 3" }));
    /* pulley at right + hanging masses */
    svg.appendChild(circle(Lx1 + 14, yMid, 9, { stroke: C.ink2, width: 1.4 }));
    svg.appendChild(line(Lx1, yMid, Lx1 + 14, yMid, { color: C.ink, width: 1.6 }));
    svg.appendChild(line(Lx1 + 23, yMid, Lx1 + 23, h - 36, { color: C.ink, width: 1.4 }));
    svg.appendChild(el("rect", { x: Lx1 + 16, y: h - 36, width: 14, height: 18, fill: "rgba(80,80,80,.6)", stroke: C.ink2, "stroke-width": 1 }));
    svg.appendChild(txt(Lx1 + 23, h - 6, "masses", { fill: C.ink2, "font-size": 9.5, "text-anchor": "middle" }));
    /* node / antinode marks */
    var k, xn;
    if (params.mark && params.mark.nodes) {
      for (k = 0; k <= loops; k++) { xn = Lx0 + (Lx1 - Lx0) * k / loops;
        svg.appendChild(circle(xn, yMid, 3, { fill: C.ink, stroke: C.paper, width: 1 }));
      }
      svg.appendChild(txt(Lx0, yMid - A - 6, "N = node", { fill: C.ink2, "font-size": 10 }));
    }
    if (params.mark && params.mark.antinodes) {
      for (k = 0; k < loops; k++) { xn = Lx0 + (Lx1 - Lx0) * (k + 0.5) / loops;
        svg.appendChild(txt(xn, yMid - A - 4, "A", { fill: C.ok, "font-size": 11, "text-anchor": "middle", "font-weight": "bold" }));
      }
    }
    if (params.mark && params.mark.halfLambda && loops >= 1) {
      var x0 = Lx0, x1 = Lx0 + (Lx1 - Lx0) / loops;
      svg.appendChild(measureArrow(x0, yMid + A + 14, x1, yMid + A + 14, "lambda/2", { ldy: 12, color: C.ink2 }));
    }
    if (params.mark && params.mark.length) {
      svg.appendChild(measureArrow(Lx0, h - 22, Lx1, h - 22, (params.lengthLabel || "L"), { ldy: 12 }));
    }
    return svg;
  }

  /* ================= PURE SCORER: scenario / count reads ================
     For light interactive items where the pupil reads/computes one number
     (frequency from a count, depth from an echo, a node count, a wave
     speed). cfg.quantity selects the model; cfg carries the inputs.       */
  WavesModels.scenarioExpected = function (cfg) {
    cfg = cfg || {};
    switch (cfg.quantity) {
      case "frequency_count": return WavesModels.frequencyFromCount(cfg.count, cfg.time);
      case "sonar_depth":     return WavesModels.echoDistance(cfg.speed, cfg.time);
      case "speed_direct":    return WavesModels.speedDirect(cfg.distance, cfg.time);
      case "speed_echo":      return WavesModels.speedFromEcho(cfg.distance, cfg.time);
      case "wave_speed":      return WavesModels.waveSpeed(cfg.frequency, cfg.wavelength);
      case "wavelength_ripple": return cfg.distance / cfg.waves;
      case "node_count":      return (cfg.loops != null) ? cfg.loops + 1 : null;   /* nodes = loops + 1 */
      case "wavelength_standing": return (cfg.length != null && cfg.loops) ? 2 * cfg.length / cfg.loops : null;
      default: return null;
    }
  };
  WavesModels.scoreScenarioRead = function (answer, cfg) {
    cfg = cfg || {};
    var marksPossible = (typeof cfg.marks === "number") ? cfg.marks : 1;
    var expected = WavesModels.scenarioExpected(cfg);
    var got = (answer && answer.value);
    var tol = (cfg.tolerance != null) ? cfg.tolerance : Math.max(Math.abs(expected) * 0.05, 1e-9);
    var hits = [], misses = [], codes = [], marks = 0;
    if (expected == null) return { marksAwarded: 0, marksPossible: marksPossible, status: "none",
      hits: [], misses: ["no model for quantity " + cfg.quantity], errorCodes: ["quantity_unknown"] };
    if (isFinite(got) && near(got, expected, tol)) { marks++; hits.push(cfg.quantity + " = " + fmt(got)); }
    else {
      misses.push(cfg.quantity + ": expected about " + fmt(expected) + ", got " + fmt(got));
      /* common halving slips: forgot the factor of 2 in echo methods */
      if ((cfg.quantity === "sonar_depth" || cfg.quantity === "speed_echo") && isFinite(got)) {
        if (near(got, expected * 2, tol * 2) || near(got, expected / 2, tol)) codes.push("echo_factor_two_missed");
      }
      if (cfg.quantity === "node_count" && isFinite(got) && near(got, cfg.loops, 0.5)) codes.push("counted_loops_not_nodes");
      if (codes.length === 0) codes.push(cfg.quantity + "_wrong");
    }
    return { marksAwarded: marks, marksPossible: marksPossible,
      status: marks >= marksPossible ? "full" : "none", hits: hits, misses: misses, errorCodes: codes };
  };

  /* -- interactive numeric read: render a scene, pupil reads/computes one
        number, scored by WavesModels.scoreScenarioRead -------------------*/
  function inputRow(panel, labelText, unitText) {
    var row = document.createElement("label");
    row.style.cssText = "display:flex;align-items:center;gap:8px;margin:6px 0;font:13px var(--sans, system-ui)";
    var span = document.createElement("span"); span.textContent = labelText; span.style.minWidth = "210px";
    var inp = document.createElement("input"); inp.type = "number"; inp.step = "any";
    inp.style.cssText = "width:110px;padding:4px 6px;font:inherit";
    var unit = document.createElement("span"); unit.textContent = unitText || "";
    row.appendChild(span); row.appendChild(inp); row.appendChild(unit); panel.appendChild(row);
    return inp;
  }
  function buildReadWidget(host, config, renderFn) {
    config = config || {};
    host.innerHTML = "";
    host.appendChild(renderFn(config));
    var panel = makePanel(host);
    var label = config.readLabel || ((config.quantity || "value") + ":");
    var inp = inputRow(panel, label, config.unit || "");
    return {
      getAnswer: function () { return { value: parseFloat(inp.value) }; },
      score: function (answer, cfg2) { return WavesModels.scoreScenarioRead(answer, cfg2 || config); },
      destroy: function () { host.innerHTML = ""; }
    };
  }
  function widget_wave_scenario(host, config) { return buildReadWidget(host, config, wave_scenario); }
  function widget_ripple_tank(host, config) { return buildReadWidget(host, config, ripple_tank); }
  function widget_standing_wave(host, config) { return buildReadWidget(host, config, standing_wave); }

  /* ===================== STATIC RENDERERS: EM spectrum ================== */
  /* per-region tints (editorial, distinguishable, not literal colour) */
  var EM_TINT = {
    radio: "rgba(90,120,170,.30)", microwave: "rgba(110,150,170,.30)",
    infrared: "rgba(190,110,80,.32)", visible: "rgba(120,170,110,.34)",
    ultraviolet: "rgba(140,110,180,.32)", xray: "rgba(120,130,150,.34)",
    gamma: "rgba(170,90,110,.34)"
  };
  /* draw the seven-region band; returns segment x-centres by region name.
     opts: { x0,x1,y,bh, blanks:[...], highlight:[...], hide:[...],
             labels:true }                                                 */
  function emBand(svg, opts) {
    opts = opts || {};
    var order = WavesModels.EM.order, n = order.length;
    var x0 = opts.x0, x1 = opts.x1, y = opts.y, bh = opts.bh || 34;
    var segW = (x1 - x0) / n, centres = {}, i, name, sx;
    var blanks = opts.blanks || [], hi = opts.highlight || [], hide = opts.hide || [];
    for (i = 0; i < n; i++) {
      name = order[i]; sx = x0 + segW * i; centres[name] = sx + segW / 2;
      if (hide.indexOf(name) >= 0) {
        svg.appendChild(el("rect", { x: sx, y: y, width: segW, height: bh, fill: C.paper, stroke: C.line, "stroke-width": 1, "stroke-dasharray": "3 2" }));
        continue;
      }
      svg.appendChild(el("rect", { x: sx, y: y, width: segW, height: bh,
        fill: EM_TINT[name] || "rgba(0,0,0,.1)", stroke: C.ink2,
        "stroke-width": (hi.indexOf(name) >= 0) ? 2.4 : 1 }));
      if (opts.labels !== false) {
        if (blanks.indexOf(name) >= 0) {
          svg.appendChild(el("rect", { x: sx + segW * 0.18, y: y + bh / 2 - 8, width: segW * 0.64, height: 16, rx: 3,
            fill: C.paper, stroke: C.ink2, "stroke-width": 1, "stroke-dasharray": "3 2" }));
        } else {
          svg.appendChild(txt(centres[name], y + bh / 2 + 4, WavesModels.EM.region[name].label,
            { "text-anchor": "middle", "font-size": (segW < 56 ? 9.5 : 11), fill: C.ink }));
        }
      }
    }
    svg.appendChild(el("rect", { x: x0, y: y, width: x1 - x0, height: bh, fill: "none", stroke: C.ink2, "stroke-width": 1.2 }));
    return { centres: centres, segW: segW, x0: x0, x1: x1, y: y, bh: bh };
  }

  /* ----------------------------- em_spectrum ----------------------------
     params: { mark:{ frequencyArrow, wavelengthArrow, ends }, blanks:[...],
               highlight:[...], hide:[...], label }
     ends marks the low/high wavelength + frequency ends (radio = long
     wavelength / low frequency; gamma = short wavelength / high frequency).*/
  function em_spectrum(params) {
    params = params || {};
    var w = params.w || 560, h = params.h || 170;
    var svg = makeSVG(w, h, params.label || "electromagnetic spectrum");
    var mk = params.mark || {};
    var band = emBand(svg, { x0: 30, x1: w - 30, y: 52, bh: 38,
      blanks: params.blanks, highlight: params.highlight, hide: params.hide });
    svg.appendChild(txt(w / 2, 26, "The electromagnetic spectrum", { "text-anchor": "middle", fill: C.ink2, "font-size": 12, "font-style": "italic" }));
    /* end labels */
    if (mk.ends !== false) {
      svg.appendChild(txt(band.x0, 48, "long wavelength", { "font-size": 9.5, fill: C.muted }));
      svg.appendChild(txt(band.x1, 48, "short wavelength", { "font-size": 9.5, fill: C.muted, "text-anchor": "end" }));
      svg.appendChild(txt(band.x0, band.y + band.bh + 14, "low frequency", { "font-size": 9.5, fill: C.muted }));
      svg.appendChild(txt(band.x1, band.y + band.bh + 14, "high frequency", { "font-size": 9.5, fill: C.muted, "text-anchor": "end" }));
    }
    if (mk.wavelengthArrow) {
      var yw = band.y + band.bh + 30;
      svg.appendChild(CORE.forceArrow(band.x1, yw, band.x0, yw, { color: C.ink2, width: 1.6, label: "" }));
      svg.appendChild(txt(w / 2, yw - 5, "wavelength increases", { "text-anchor": "middle", "font-size": 10.5, fill: C.ink2 }));
    }
    if (mk.frequencyArrow) {
      var yf = band.y + band.bh + (mk.wavelengthArrow ? 50 : 30);
      svg.appendChild(CORE.forceArrow(band.x0, yf, band.x1, yf, { color: C.accent, width: 1.6, label: "" }));
      svg.appendChild(txt(w / 2, yf - 5, "frequency increases", { "text-anchor": "middle", "font-size": 10.5, fill: C.accent }));
    }
    return svg;
  }

  /* ------------------------------ em_origins ----------------------------
     Where each region is produced. Author-specifiable: pass regions to
     show (default all). Light: a band with origin captions; gamma from the
     nucleus, radio from oscillations of charge in a circuit/aerial, the
     rest in between.
     params: { regions:["gamma","radio"] | "all", label }                 */
  function em_origins(params) {
    params = params || {};
    var regions = (params.regions && params.regions !== "all") ? params.regions : WavesModels.EM.order.slice();
    var w = params.w || 560, h = params.h || 96 + regions.length * 18;
    var svg = makeSVG(w, h, params.label || "origins of EM radiation");
    var band = emBand(svg, { x0: 30, x1: w - 30, y: 30, bh: 30, highlight: regions });
    svg.appendChild(txt(w / 2, 18, "Where each region comes from", { "text-anchor": "middle", fill: C.ink2, "font-size": 11.5, "font-style": "italic" }));
    var yy = band.y + band.bh + 18, i, r;
    for (i = 0; i < regions.length; i++) {
      r = regions[i];
      svg.appendChild(el("rect", { x: band.centres[r] - 3, y: band.y + band.bh, width: 6, height: 6, fill: C.ink2 }));
      svg.appendChild(txt(34, yy + i * 17, WavesModels.EM.region[r].label + ": " + WavesModels.EM.region[r].origin,
        { "font-size": 10.5, fill: C.ink2 }));
    }
    return svg;
  }

  /* ------------------------------- em_uses ------------------------------
     Author-specifiable illustrations of EM uses (the spec examples).
     params: { regions:[...] | "all", label }                             */
  function em_uses(params) {
    params = params || {};
    var regions = (params.regions && params.regions !== "all") ? params.regions : WavesModels.EM.order.slice();
    var w = params.w || 560, h = params.h || 90 + regions.length * 17;
    var svg = makeSVG(w, h, params.label || "uses of EM radiation");
    var band = emBand(svg, { x0: 30, x1: w - 30, y: 30, bh: 30, highlight: regions });
    svg.appendChild(txt(w / 2, 18, "Uses of each region", { "text-anchor": "middle", fill: C.ink2, "font-size": 11.5, "font-style": "italic" }));
    var yy = band.y + band.bh + 18, i, r, uses;
    for (i = 0; i < regions.length; i++) {
      r = regions[i]; uses = WavesModels.EM.region[r].uses.join("; ");
      svg.appendChild(el("rect", { x: band.centres[r] - 3, y: band.y + band.bh, width: 6, height: 6, fill: C.ink2 }));
      svg.appendChild(txt(34, yy + i * 17, WavesModels.EM.region[r].label + ": " + uses, { "font-size": 10.5, fill: C.ink2 }));
    }
    return svg;
  }

  /* ================= PURE SCORER: EM spectrum marking ===================
     answer: { region } (name a region) OR { end, attribute } (which end is
     high/low frequency/wavelength). cfg: { question, target } where
     question in {"name_region","which_end"}.                              */
  WavesModels.scoreEmMark = function (answer, cfg) {
    cfg = cfg || {}; answer = answer || {};
    var marksPossible = (typeof cfg.marks === "number") ? cfg.marks : 1;
    var hits = [], misses = [], codes = [], marks = 0;
    if (cfg.question === "which_end") {
      /* cfg.attribute in {high_frequency,low_frequency,long_wavelength,short_wavelength}
         correct region is gamma (high f / short wl) or radio (low f / long wl) */
      var attr = cfg.attribute || "high_frequency";
      var correct = (attr === "high_frequency" || attr === "short_wavelength") ? "gamma" : "radio";
      if (answer.region === correct) { marks++; hits.push(attr + " end = " + correct); }
      else {
        misses.push(attr + " end is " + correct);
        if (answer.region === (correct === "gamma" ? "radio" : "gamma")) codes.push("spectrum_ends_swapped");
        else codes.push("em_end_wrong");
      }
    } else { /* name_region against a target */
      if (answer.region === cfg.target) { marks++; hits.push("named " + cfg.target); }
      else {
        misses.push("expected " + cfg.target + ", got " + (answer.region || "(none)"));
        var ti = WavesModels.EM.indexOf(cfg.target), gi = WavesModels.EM.indexOf(answer.region);
        if (gi >= 0 && Math.abs(gi - ti) === 1) codes.push("em_off_by_one_region");
        else codes.push("em_region_wrong");
      }
    }
    return { marksAwarded: marks, marksPossible: marksPossible,
      status: marks >= marksPossible ? "full" : "none", hits: hits, misses: misses, errorCodes: codes };
  };

  /* -- interactive em_spectrum: click/select a region or an end --------- */
  function widget_em_spectrum(host, config) {
    config = config || {};
    host.innerHTML = "";
    host.appendChild(em_spectrum(config));
    var panel = makePanel(host);
    var q = document.createElement("div");
    q.style.cssText = "margin-bottom:6px;font:13px var(--sans, system-ui)";
    q.textContent = config.prompt || (config.question === "which_end"
      ? ("Which region is at the " + (config.attribute || "high_frequency").replace(/_/g, " ") + " end?")
      : "Which region is highlighted?");
    panel.appendChild(q);
    var sel = document.createElement("select");
    WavesModels.EM.order.forEach(function (r) {
      var o = document.createElement("option"); o.value = r; o.textContent = WavesModels.EM.region[r].label; sel.appendChild(o);
    });
    sel.style.cssText = "font:13px var(--sans, system-ui);padding:4px 8px";
    panel.appendChild(sel);
    return {
      getAnswer: function () { return { region: sel.value }; },
      score: function (answer, cfg2) { return WavesModels.scoreEmMark(answer, cfg2 || config); },
      destroy: function () { host.innerHTML = ""; }
    };
  }

  /* ===================== STATIC RENDERERS: refraction ================== */
  var D2R = Math.PI / 180, R2D = 180 / Math.PI;
  /* small-angle arc for marking an angle from the normal, in pixels */
  function angleArc(svg, ox, oy, fromAng, toAng, r, label, col) {
    var p0 = [ox + r * Math.cos(fromAng), oy + r * Math.sin(fromAng)];
    var p1 = [ox + r * Math.cos(toAng), oy + r * Math.sin(toAng)];
    var large = Math.abs(toAng - fromAng) > Math.PI ? 1 : 0;
    var sweep = (toAng > fromAng) ? 1 : 0;
    svg.appendChild(el("path", { d: "M" + p0[0].toFixed(1) + "," + p0[1].toFixed(1) +
      " A" + r + "," + r + " 0 " + large + " " + sweep + " " + p1[0].toFixed(1) + "," + p1[1].toFixed(1),
      fill: "none", stroke: col || C.ink2, "stroke-width": 1 }));
    if (label) {
      var mid = (fromAng + toAng) / 2;
      svg.appendChild(txt(ox + (r + 12) * Math.cos(mid), oy + (r + 12) * Math.sin(mid) + 3, label,
        { "font-size": 10, fill: col || C.ink2, "text-anchor": "middle" }));
    }
  }

  /* -------------------------- refraction_wavefronts ---------------------
     Parallel wavefronts crossing a straight boundary. Medium 1 (n1) above,
     medium 2 (n2) below. Snell bends the ray; the perpendicular spacing of
     the fronts changes from lambda1 to lambda2 = lambda1 * n1/n2 (slower ->
     closer). The trace spacing ALONG the boundary is continuous
     (lambda1/sin t1 = lambda2/sin t2), which is why the fronts join up at
     the interface; that identity is the construction used here.
     params: { n1, n2, theta1 (deg), mark:{normal,angles,spacing,ray},
               label }                                                     */
  function refraction_wavefronts(params) {
    params = params || {};
    var n1 = (params.n1 != null) ? params.n1 : 1.0;
    var n2 = (params.n2 != null) ? params.n2 : 1.5;
    var t1 = (params.theta1 != null) ? params.theta1 : 40;
    var t2d = WavesModels.refractAngle(t1, n1, n2);
    var w = params.w || 420, h = params.h || 320;
    var svg = makeSVG(w, h, params.label || "refraction of wavefronts");
    var yB = h / 2, xL = 24, xR = w - 24, ox = w * 0.46;
    var mk = params.mark || {};
    /* media tint + boundary */
    svg.appendChild(el("rect", { x: xL, y: 16, width: xR - xL, height: yB - 16, fill: "rgba(60,110,150,.06)" }));
    svg.appendChild(el("rect", { x: xL, y: yB, width: xR - xL, height: h - 16 - yB, fill: "rgba(60,110,150,.18)" }));
    svg.appendChild(line(xL, yB, xR, yB, { color: C.ink, width: 1.6 }));
    /* Trilogy is QUALITATIVE: never print a readable refractive index on the
       diagram. Label media by name + the wave-speed cue (the spec cause of
       refraction). n1/n2 are used only to compute correct-looking geometry. */
    var slower2 = n2 > n1, showSpd = params.showSpeedCue !== false;
    var med1L = (params.medium1 || "medium 1") + (showSpd ? (slower2 ? " (wave faster)" : " (wave slower)") : "");
    var med2L = (params.medium2 || "medium 2") + (showSpd ? (slower2 ? " (wave slower)" : " (wave faster)") : "");
    svg.appendChild(txt(xR, 28, med1L, { "font-size": 10, fill: C.ink2, "text-anchor": "end" }));
    svg.appendChild(txt(xR, h - 22, med2L, { "font-size": 10, fill: C.ink2, "text-anchor": "end" }));

    var lam1 = 26, t1r = t1 * D2R;
    if (t1 < 0.5) {
      /* normal incidence: fronts parallel to the boundary, spacing only */
      var lam2n = lam1 * n1 / n2, yy;
      for (yy = yB - lam1; yy > 20; yy -= lam1) svg.appendChild(line(xL + 8, yy, xR - 8, yy, { color: C.ink, width: 2 }));
      for (yy = yB + lam2n; yy < h - 20; yy += lam2n) svg.appendChild(line(xL + 8, yy, xR - 8, yy, { color: C.ink, width: 2 }));
    } else {
      var t2r = t2d * D2R;
      var dAlong = lam1 / Math.sin(t1r);          /* boundary trace spacing */
      var perp1 = [Math.cos(t1r), -Math.sin(t1r)];/* up into medium1        */
      var perp2 = [-Math.cos(t2r), Math.sin(t2r)]; /* down-left into medium2 */
      var L = 78, j, bx;
      for (j = -6; j <= 6; j++) {
        bx = ox + j * dAlong;
        if (bx < xL + 4 || bx > xR - 4) continue;
        svg.appendChild(line(bx, yB, clamp(bx + L * perp1[0], xL, xR), clamp(yB + L * perp1[1], 16, yB), { color: C.ink, width: 1.8 }));
        svg.appendChild(line(bx, yB, clamp(bx + L * perp2[0], xL, xR), clamp(yB + L * perp2[1], yB, h - 16), { color: C.ink, width: 1.8 }));
      }
      /* the ray (perpendicular to the fronts) refracting at O */
      if (mk.ray !== false) {
        var dr1 = [Math.sin(t1r), Math.cos(t1r)], dr2 = [Math.sin(t2r), Math.cos(t2r)];
        svg.appendChild(CORE.forceArrow(ox - 70 * dr1[0], yB - 70 * dr1[1], ox, yB, { color: C.accent, width: 1.8 }));
        svg.appendChild(CORE.forceArrow(ox, yB, ox + 70 * dr2[0], yB + 70 * dr2[1], { color: C.accent, width: 1.8 }));
      }
    }
    /* normal + angle marks */
    if (mk.normal !== false) svg.appendChild(line(ox, 20, ox, h - 16, { color: C.muted, width: 1, dash: "5 4" }));
    if (mk.angles && t1 >= 0.5 && t2d != null) {
      angleArc(svg, ox, yB, -Math.PI / 2, -Math.PI / 2 + t1 * D2R, 30, "i", C.ink2);
      angleArc(svg, ox, yB, Math.PI / 2, Math.PI / 2 + t2d * D2R, 30, "r", C.ink2);
    }
    if (mk.spacing) {
      svg.appendChild(txt(xL + 6, yB - 8, "lambda1", { "font-size": 10, fill: C.ink2 }));
      svg.appendChild(txt(xL + 6, yB + 16, "lambda2 (" + (n2 > n1 ? "closer" : "wider") + ")", { "font-size": 10, fill: C.ink2 }));
    }
    return svg;
  }

  /* ----------------------------- refraction_ray -------------------------
     A single ray refracting through a block. shapes:
       "rectangle"  - two parallel faces; emergent ray parallel to incident
                      with a lateral shift (the classic glass-block result).
       "triangle"   - equilateral prism; ray bends toward the base at both
                      faces (deviation).
       "semicircle" - ray entering the flat face aimed at the centre of the
                      curved face hits the curved face along its normal and
                      passes straight out (the standard "ray box +
                      semicircular block" set-up); a non-central ray
                      refracts at the curved face.
     params: { shape, n (block index, vs air=1), theta1 (deg), reflect:false
               (show the weak reflected ray), mark:{normal,angles,labels},
               label }                                                     */
  function refraction_ray(params) {
    params = params || {};
    var shape = params.shape || "rectangle";
    var n = (params.n != null) ? params.n : 1.5;
    var t1 = (params.theta1 != null) ? params.theta1 : 40;
    var w = params.w || 420, h = params.h || 300;
    var svg = makeSVG(w, h, params.label || ("refraction through a " + shape));
    var mk = params.mark || {};
    var glassFill = "rgba(120,170,190,.22)", glassStroke = C.ink2;

    if (shape === "rectangle") {
      var bx0 = w * 0.28, bx1 = w * 0.72, by0 = 60, by1 = h - 50;
      svg.appendChild(el("rect", { x: bx0, y: by0, width: bx1 - bx0, height: by1 - by0, fill: glassFill, stroke: glassStroke, "stroke-width": 1.4 }));
      /* entry on the top face at point E; normal is vertical there */
      var E = [w * 0.42, by0], t1r = t1 * D2R, t2 = WavesModels.refractAngle(t1, 1, n), t2r = t2 * D2R;
      svg.appendChild(CORE.forceArrow(E[0] - 70 * Math.sin(t1r), E[1] - 70 * Math.cos(t1r), E[0], E[1], { color: C.accent, width: 1.8 }));
      /* internal ray to the bottom face */
      var run = (by1 - by0) * Math.tan(t2r);
      var X = [E[0] + run, by1];
      svg.appendChild(line(E[0], E[1], X[0], X[1], { color: C.accent, width: 1.8 }));
      /* emergent ray: parallel to incident (exit angle = t1) */
      svg.appendChild(CORE.forceArrow(X[0], X[1], X[0] + 70 * Math.sin(t1r), X[1] + 70 * Math.cos(t1r), { color: C.accent, width: 1.8 }));
      if (mk.normal !== false) { svg.appendChild(line(E[0], by0 - 30, E[0], by0 + 40, { color: C.muted, width: 1, dash: "5 4" }));
        svg.appendChild(line(X[0], by1 - 40, X[0], by1 + 30, { color: C.muted, width: 1, dash: "5 4" })); }
      if (mk.angles) { angleArc(svg, E[0], E[1], -Math.PI / 2, -Math.PI / 2 + t1r, 26, "i", C.ink2);
        angleArc(svg, E[0], E[1], Math.PI / 2, Math.PI / 2 + t2r, 26, "r", C.ink2); }
      if (mk.labels !== false) svg.appendChild(txt(bx0 + 6, by0 + 16, (params.material || "glass block"), { "font-size": 10, fill: C.ink2 }));
    } else if (shape === "triangle") {
      var cx = w / 2, Ttop = [cx, 64], halfBase = 94, baseY = h - 54;
      var Lp = [cx - halfBase, baseY], Rp = [cx + halfBase, baseY];
      svg.appendChild(el("path", { d: "M" + Ttop[0] + "," + Ttop[1] + " L" + Lp[0] + "," + Lp[1] + " L" + Rp[0] + "," + Rp[1] + " Z",
        fill: glassFill, stroke: glassStroke, "stroke-width": 1.4 }));
      function unit(v) { var L = Math.hypot(v[0], v[1]); return [v[0] / L, v[1] / L]; }
      /* left face (L->T): outward normal points up-left (x<0) */
      var leftEdge = unit([Ttop[0] - Lp[0], Ttop[1] - Lp[1]]);
      var nLeftOut = [-leftEdge[1], leftEdge[0]]; if (nLeftOut[0] > 0) nLeftOut = [-nLeftOut[0], -nLeftOut[1]];
      var rightEdge = unit([Rp[0] - Ttop[0], Rp[1] - Ttop[1]]);
      var nRightOut = [-rightEdge[1], rightEdge[0]]; if (nRightOut[0] < 0) nRightOut = [-nRightOut[0], -nRightOut[1]];
      var E1 = [(Ttop[0] + Lp[0]) / 2 + 4, (Ttop[1] + Lp[1]) / 2 + 8];
      var dInc = unit([Math.cos(16 * D2R), Math.sin(16 * D2R)]);   /* down-right */
      var dIn = WavesModels.refractDir(dInc, nLeftOut, 1 / n) || dInc;
      /* intersect E1 + s*dIn with right face line Ttop + u*rightEdge */
      var det = dIn[0] * (-rightEdge[1]) - (-rightEdge[0]) * dIn[1];
      var bx = Ttop[0] - E1[0], by = Ttop[1] - E1[1];
      var sS = (bx * (-rightEdge[1]) - (-rightEdge[0]) * by) / det;
      var E2 = [E1[0] + sS * dIn[0], E1[1] + sS * dIn[1]];
      var dOut = WavesModels.refractDir(dIn, [-nRightOut[0], -nRightOut[1]], n) || dIn;
      svg.appendChild(CORE.forceArrow(E1[0] - 72 * dInc[0], E1[1] - 72 * dInc[1], E1[0], E1[1], { color: C.accent, width: 1.8 }));
      svg.appendChild(line(E1[0], E1[1], E2[0], E2[1], { color: C.accent, width: 1.8 }));
      svg.appendChild(CORE.forceArrow(E2[0], E2[1], E2[0] + 72 * dOut[0], E2[1] + 72 * dOut[1], { color: C.accent, width: 1.8 }));
      svg.appendChild(txt(cx, baseY - 8, "bends toward the base", { "text-anchor": "middle", "font-size": 10, fill: C.ink2 }));
      if (mk.labels !== false) svg.appendChild(txt(cx, Ttop[1] - 8, (params.material || "glass prism"), { "text-anchor": "middle", "font-size": 10, fill: C.ink2 }));
    } else { /* semicircle */
      var rad = 92, flatX = w * 0.40, sc = [flatX, h / 2];
      /* flat (diameter) face vertical on the left; curved face bulges right */
      svg.appendChild(el("path", { d: "M" + flatX + "," + (sc[1] - rad) + " A" + rad + "," + rad + " 0 0 1 " + flatX + "," + (sc[1] + rad) + " Z",
        fill: glassFill, stroke: glassStroke, "stroke-width": 1.4 }));
      svg.appendChild(line(flatX, sc[1] - rad, flatX, sc[1] + rad, { color: glassStroke, width: 1.4 }));
      /* ray meets the flat face AT THE CENTRE; flat-face normal is horizontal.
         It refracts toward the normal, travels a RADIUS to the curved face and
         exits undeviated (curved face normal = radius). */
      var t1s = t1 * D2R, t2s = WavesModels.refractAngle(t1, 1, n) * D2R;
      var dIn0 = [Math.cos(t1s), Math.sin(t1s)];
      svg.appendChild(CORE.forceArrow(sc[0] - 82 * dIn0[0], sc[1] - 82 * dIn0[1], sc[0], sc[1], { color: C.accent, width: 1.8 }));
      var dR = [Math.cos(t2s), Math.sin(t2s)];
      var P = [sc[0] + rad * dR[0], sc[1] + rad * dR[1]];
      svg.appendChild(line(sc[0], sc[1], P[0], P[1], { color: C.accent, width: 1.8 }));
      svg.appendChild(CORE.forceArrow(P[0], P[1], P[0] + 70 * dR[0], P[1] + 70 * dR[1], { color: C.accent, width: 1.8 }));
      if (mk.normal !== false) svg.appendChild(line(sc[0] - 40, sc[1], sc[0] + 40, sc[1], { color: C.muted, width: 1, dash: "5 4" }));
      if (mk.angles) { angleArc(svg, sc[0], sc[1], Math.PI, Math.PI - t1s, 26, "i", C.ink2);
        angleArc(svg, sc[0], sc[1], 0, t2s, 26, "r", C.ink2); }
      if (mk.labels !== false) svg.appendChild(txt(sc[0] + rad * 0.4, sc[1] - rad * 0.55, (params.material || "glass"), { "font-size": 10, fill: C.ink2 }));
    }
    return svg;
  }

  /* ================= PURE SCORER: refraction angle ======================
     answer: { theta2_deg } (the refracted angle the pupil set, measured
     from the normal). cfg: { n1, n2, theta1, tolerance(deg), marks }.
     marks (default 2): DIRECTION mark (bent the correct way) + VALUE mark
     (within tolerance of Snell). Handles TIR (no real refracted ray).     */
  WavesModels.scoreRefraction = function (answer, cfg) {
    cfg = cfg || {}; answer = answer || {};
    var n1 = (cfg.n1 != null) ? cfg.n1 : 1, n2 = (cfg.n2 != null) ? cfg.n2 : 1.5;
    var t1 = (cfg.theta1 != null) ? cfg.theta1 : 40;
    var marksPossible = (typeof cfg.marks === "number") ? cfg.marks : 2;
    var expected = WavesModels.refractAngle(t1, n1, n2);
    var tol = (cfg.tolerance != null) ? cfg.tolerance : 3;
    var got = answer.theta2_deg;
    var hits = [], misses = [], codes = [], marks = 0;
    if (expected == null) {               /* total internal reflection */
      if (answer.tir === true || answer.theta2_deg == null) { marks = marksPossible; hits.push("total internal reflection (no refracted ray)"); }
      else { misses.push("beyond the critical angle: total internal reflection, no refracted ray"); codes.push("tir_not_recognised"); }
      return { marksAwarded: marks, marksPossible: marksPossible,
        status: marks >= marksPossible ? "full" : "none", hits: hits, misses: misses, errorCodes: codes };
    }
    var towardNormal = n2 > n1;           /* slowing -> bend toward normal */
    var bentToward = isFinite(got) && (got < t1 - 0.5);
    var bentAway = isFinite(got) && (got > t1 + 0.5);
    var directionOk = towardNormal ? bentToward : bentAway;
    if (directionOk) { marks++; hits.push("bent " + (towardNormal ? "toward" : "away from") + " the normal"); }
    else {
      misses.push("a ray entering the " + (towardNormal ? "slower (denser)" : "faster (less dense)") + " medium bends " + (towardNormal ? "toward" : "away from") + " the normal");
      if (isFinite(got) && near(got, t1, 1.0)) codes.push("equal_angle_no_refraction");
      else codes.push("bent_wrong_way");
    }
    if (directionOk && isFinite(got) && near(got, expected, tol)) { marks++; hits.push("refracted angle " + fmt(got) + " deg (Snell: " + expected.toFixed(1) + " deg)"); }
    else if (isFinite(got)) { misses.push("refracted angle: it should bend " + (towardNormal ? "toward" : "away from") + " the normal" + (directionOk ? " a little " + (got > expected ? "less" : "more") : "")); if (directionOk) codes.push("snell_angle_off"); }
    /* optional third mark: the wavefront SPACING change (lambda2/lambda1 = n1/n2) */
    if (cfg.gradeSpacing || answer.lambda2_over_lambda1 != null || answer.spacing_change != null) {
      marksPossible = (typeof cfg.marks === "number") ? cfg.marks : 3;
      var slower = n2 > n1;                 /* wave slows -> fronts closer */
      if (answer.spacing_change != null) {  /* Trilogy qualitative default */
        var want = slower ? "closer" : "further";
        if (answer.spacing_change === want) { marks++; hits.push("wavefront spacing: " + want + " together"); }
        else if (answer.spacing_change === "same") { misses.push("the wavefronts change spacing across the boundary"); codes.push("spacing_unchanged"); }
        else { misses.push("entering the " + (slower ? "slower" : "faster") + " medium the wavefronts get " + want); codes.push("spacing_inverted"); }
      } else {                              /* numeric ratio (Triple/HT) */
        var expRatio = n1 / n2, gotR = answer.lambda2_over_lambda1, rtol = (cfg.spacingTolerance != null) ? cfg.spacingTolerance : 0.1;
        if (isFinite(gotR) && near(gotR, expRatio, rtol)) { marks++; hits.push("spacing ratio " + fmt(gotR)); }
        else {
          misses.push("wavefront spacing ratio should be " + expRatio.toFixed(2));
          if (isFinite(gotR) && near(gotR, n2 / n1, rtol)) codes.push("spacing_inverted");
          else if (isFinite(gotR) && near(gotR, 1, rtol)) codes.push("spacing_unchanged");
          else codes.push("spacing_wrong");
        }
      }
    }
    codes = codes.filter(function (v, i) { return codes.indexOf(v) === i; });
    return { marksAwarded: marks, marksPossible: marksPossible,
      status: marks >= marksPossible ? "full" : (marks > 0 ? "partial" : "none"),
      hits: hits, misses: misses, errorCodes: codes };
  };

  /* -- interactive refraction: drag the refracted ray, set the angle -----
     A fixed incident ray meets a horizontal boundary at O; the pupil drags
     a handle in medium 2 to place the refracted ray. theta2 is read from
     the handle and scored by WavesModels.scoreRefraction. Used for both
     refraction_wavefronts and refraction_ray items (same physics; the
     static pictures differ, the graded quantity is the refracted angle).
     v1.1 flagged to Housing: drag-the-wavefronts-through and lateral-shift
     reads; the contract is unchanged (getAnswer gains fields).            */
  function buildRefractionWidget(host, config) {
    config = config || {};
    host.innerHTML = "";
    var n1 = (config.n1 != null) ? config.n1 : 1, n2 = (config.n2 != null) ? config.n2 : 1.5;
    var t1 = (config.theta1 != null) ? config.theta1 : 40;
    var w = config.w || 380, h = config.h || 320;
    var svg = makeSVG(w, h, "place the refracted ray");
    var yB = h / 2, xL = 20, xR = w - 20, ox = w / 2;
    svg.appendChild(el("rect", { x: xL, y: 16, width: xR - xL, height: yB - 16, fill: "rgba(60,110,150,.06)" }));
    svg.appendChild(el("rect", { x: xL, y: yB, width: xR - xL, height: h - 16 - yB, fill: "rgba(60,110,150,.18)" }));
    svg.appendChild(line(xL, yB, xR, yB, { color: C.ink, width: 1.6 }));
    svg.appendChild(line(ox, 22, ox, h - 16, { color: C.muted, width: 1, dash: "5 4" }));
    var slowerB = n2 > n1, showB = config.showSpeedCue !== false;
    svg.appendChild(txt(xR, 28, (config.medium1 || "medium 1") + (showB ? (slowerB ? " (faster)" : " (slower)") : ""), { "font-size": 10, fill: C.ink2, "text-anchor": "end" }));
    svg.appendChild(txt(xR, h - 22, (config.medium2 || "medium 2") + (showB ? (slowerB ? " (slower)" : " (faster)") : ""), { "font-size": 10, fill: C.ink2, "text-anchor": "end" }));
    /* fixed incident ray */
    var t1r = t1 * D2R;
    svg.appendChild(CORE.forceArrow(ox - 80 * Math.sin(t1r), yB - 80 * Math.cos(t1r), ox, yB, { color: C.muted, width: 1.8 }));
    svg.appendChild(txt(ox - 80 * Math.sin(t1r) - 6, yB - 80 * Math.cos(t1r), "incident, i = " + fmt(t1) + " deg", { "font-size": 10, fill: C.ink2, "text-anchor": "end" }));
    /* draggable refracted-ray handle in medium 2 */
    var refLen = 90, t2start = 25 * D2R;
    var hp = [ox + refLen * Math.sin(t2start), yB + refLen * Math.cos(t2start)];
    var refLine = el("line", { stroke: C.accent, "stroke-width": 2, "stroke-linecap": "round" });
    var handle = el("circle", { r: 9, fill: C.accent, "fill-opacity": 0.5, stroke: C.accent, "stroke-width": 1.5 });
    svg.appendChild(refLine); svg.appendChild(handle);
    var readout = null, theta2 = 25;
    function redraw() {
      var dx = hp[0] - ox, dy = hp[1] - yB;
      theta2 = Math.atan2(dx, dy) * R2D;     /* from the downward normal */
      refLine.setAttribute("x1", ox); refLine.setAttribute("y1", yB);
      refLine.setAttribute("x2", hp[0]); refLine.setAttribute("y2", hp[1]);
      handle.setAttribute("cx", hp[0]); handle.setAttribute("cy", hp[1]);
      if (readout) readout.textContent = "refracted angle r = " + theta2.toFixed(0) + " deg";
    }
    CORE.makeDraggable(svg, handle, function (pt) {
      var dx = pt.x - ox, dy = Math.max(6, pt.y - yB);   /* keep in medium 2 */
      var L = Math.sqrt(dx * dx + dy * dy);
      hp = [ox + refLen * dx / L, yB + refLen * dy / L]; redraw();
    });
    host.appendChild(svg);
    var panel = makePanel(host);
    readout = document.createElement("div");
    readout.style.cssText = "font:13px var(--sans, system-ui);color:var(--accent,#b03030)";
    panel.appendChild(readout);
    var hint = document.createElement("div");
    hint.style.cssText = "font:12px var(--sans, system-ui);color:var(--muted,#8c8579);margin-top:4px";
    hint.textContent = "Drag the red handle so the refracted ray has the correct angle.";
    panel.appendChild(hint);
    redraw();
    return {
      getAnswer: function () { return { theta2_deg: theta2 }; },
      score: function (answer, cfg2) { return WavesModels.scoreRefraction(answer, cfg2 || config); },
      destroy: function () { host.innerHTML = ""; }
    };
  }
  /* v1.1 (dispatch-named): drag the parallel wavefronts THROUGH the
     boundary. The pupil rotates the refracted fronts (sets the refracted
     angle) AND types how the spacing changes; both are graded. Contract
     unchanged: getAnswer gains lambda2_over_lambda1, scored by the same
     WAVES_MODELS.scoreRefraction with gradeSpacing. */
  function widget_refraction_wavefronts(host, config) {
    config = config || {};
    host.innerHTML = "";
    var n1 = (config.n1 != null) ? config.n1 : 1, n2 = (config.n2 != null) ? config.n2 : 1.5;
    var t1 = (config.theta1 != null) ? config.theta1 : 40;
    var w = config.w || 380, h = config.h || 320;
    var svg = makeSVG(w, h, "drag the refracted wavefronts");
    var yB = h / 2, xL = 18, xR = w - 18, ox = w / 2;
    svg.appendChild(el("rect", { x: xL, y: 14, width: xR - xL, height: yB - 14, fill: "rgba(60,110,150,.06)" }));
    svg.appendChild(el("rect", { x: xL, y: yB, width: xR - xL, height: h - 14 - yB, fill: "rgba(60,110,150,.18)" }));
    svg.appendChild(line(xL, yB, xR, yB, { color: C.ink, width: 1.6 }));
    svg.appendChild(line(ox, 18, ox, h - 14, { color: C.muted, width: 1, dash: "5 4" }));
    var slowerW = n2 > n1, showW = config.showSpeedCue !== false;
    svg.appendChild(txt(xR, 26, (config.medium1 || "medium 1") + (showW ? (slowerW ? " (faster)" : " (slower)") : ""), { "font-size": 10, fill: C.ink2, "text-anchor": "end" }));
    svg.appendChild(txt(xR, h - 20, (config.medium2 || "medium 2") + (showW ? (slowerW ? " (slower)" : " (faster)") : ""), { "font-size": 10, fill: C.ink2, "text-anchor": "end" }));
    var t1r = t1 * D2R, lam1 = 24, dAlong = lam1 / Math.sin(t1r);
    var perp1 = [Math.cos(t1r), -Math.sin(t1r)], jj, bx;
    for (jj = -5; jj <= 5; jj++) { bx = ox + jj * dAlong; if (bx < xL + 3 || bx > xR - 3) continue;
      svg.appendChild(line(bx, yB, clamp(bx + 70 * perp1[0], xL, xR), clamp(yB + 70 * perp1[1], 14, yB), { color: C.muted, width: 1.5 })); }
    svg.appendChild(CORE.forceArrow(ox - 64 * Math.sin(t1r), yB - 64 * Math.cos(t1r), ox, yB, { color: C.muted, width: 1.4 }));
    var gFront = el("g"); svg.appendChild(gFront);
    var handle = el("circle", { r: 9, fill: C.accent, "fill-opacity": 0.5, stroke: C.accent, "stroke-width": 1.5 });
    svg.appendChild(handle);
    var t2 = 25, ratio = 1.0, spacingChange = "same", readout = null;
    function redraw() {
      while (gFront.firstChild) gFront.removeChild(gFront.firstChild);
      var t2r = Math.max(0.02, t2 * D2R), lam2 = lam1 * ratio;
      var dA2 = lam2 / Math.sin(t2r), perp2 = [-Math.cos(t2r), Math.sin(t2r)], k, b2;
      for (k = -6; k <= 6; k++) { b2 = ox + k * dA2; if (b2 < xL + 3 || b2 > xR - 3) continue;
        gFront.appendChild(line(b2, yB, clamp(b2 + 70 * perp2[0], xL, xR), clamp(yB + 70 * perp2[1], yB, h - 14), { color: C.accent, width: 1.8 })); }
      handle.setAttribute("cx", ox + 84 * Math.sin(t2r)); handle.setAttribute("cy", yB + 84 * Math.cos(t2r));
      if (readout) readout.textContent = "refracted angle r = " + t2.toFixed(0) + " deg,  spacing lambda2/lambda1 = " + ratio.toFixed(2);
    }
    CORE.makeDraggable(svg, handle, function (pt) { var dx = pt.x - ox, dy = Math.max(6, pt.y - yB); t2 = Math.atan2(dx, dy) * R2D; redraw(); });
    host.appendChild(svg);
    var panel = makePanel(host);
    readout = document.createElement("div"); readout.style.cssText = "font:13px var(--sans, system-ui);color:var(--accent,#b03030)"; panel.appendChild(readout);
    var srow = document.createElement("label");
    srow.style.cssText = "display:flex;align-items:center;gap:8px;margin:6px 0;font:13px var(--sans, system-ui)";
    var sspan = document.createElement("span"); sspan.textContent = "In medium 2 the wavefronts are:"; sspan.style.minWidth = "180px";
    var ssel = document.createElement("select"); ssel.style.cssText = "font:inherit;padding:3px 6px";
    [["same", "the same distance apart"], ["closer", "closer together"], ["further", "further apart"]].forEach(function (o) { var e = document.createElement("option"); e.value = o[0]; e.textContent = o[1]; ssel.appendChild(e); });
    srow.appendChild(sspan); srow.appendChild(ssel); panel.appendChild(srow);
    ssel.addEventListener("change", function () { spacingChange = ssel.value; ratio = (spacingChange === "closer") ? 0.7 : (spacingChange === "further") ? 1.4 : 1.0; redraw(); });
    var hint = document.createElement("div"); hint.style.cssText = "font:12px var(--sans, system-ui);color:var(--muted,#8c8579);margin-top:4px";
    hint.textContent = "Drag the handle to set the refracted angle; choose how the spacing changes."; panel.appendChild(hint);
    redraw();
    return {
      getAnswer: function () { return { theta2_deg: t2, spacing_change: spacingChange }; },
      score: function (answer, cfg2) { var c = {}, src = cfg2 || config, kk; for (kk in src) c[kk] = src[kk]; c.gradeSpacing = true; return WavesModels.scoreRefraction(answer, c); },
      destroy: function () { host.innerHTML = ""; }
    };
  }
  function widget_refraction_ray(host, config) { return buildRefractionWidget(host, config); }

  /* ================ STATIC: material behaviour + radiation =============== */
  /* ----------------------- material_wave_behaviour ----------------------
     Different materials/wavelengths transmit, absorb, reflect or refract.
     Author-specifiable: each ray names its behaviour at the material.
     params: { material, rays:[{label, behaviour, tint}], label }
       behaviour in {transmit, absorb, reflect, refract}                   */
  function material_wave_behaviour(params) {
    params = params || {};
    var rays = params.rays || [
      { label: "visible", behaviour: "transmit" },
      { label: "ultraviolet", behaviour: "absorb" },
      { label: "infrared", behaviour: "reflect" }
    ];
    var w = params.w || 460, h = params.h || 60 + rays.length * 52;
    var svg = makeSVG(w, h, params.label || "wavelength-dependent behaviour");
    var mx0 = w * 0.46, mx1 = w * 0.6;
    svg.appendChild(el("rect", { x: mx0, y: 30, width: mx1 - mx0, height: h - 56, fill: "rgba(120,150,170,.30)", stroke: C.ink2, "stroke-width": 1.4 }));
    svg.appendChild(txt((mx0 + mx1) / 2, 22, params.material || "material", { "text-anchor": "middle", "font-size": 10.5, fill: C.ink2 }));
    var i, r, y, col;
    for (i = 0; i < rays.length; i++) {
      r = rays[i]; y = 56 + i * 52; col = r.tint || C.accent;
      svg.appendChild(CORE.forceArrow(24, y, mx0, y, { color: col, width: 2 }));
      svg.appendChild(txt(24, y - 8, r.label, { "font-size": 10.5, fill: C.ink2 }));
      if (r.behaviour === "transmit") {
        svg.appendChild(CORE.forceArrow(mx1, y, w - 24, y, { color: col, width: 2 }));
        svg.appendChild(txt(w - 24, y - 8, "transmitted", { "font-size": 10, fill: C.muted, "text-anchor": "end" }));
      } else if (r.behaviour === "refract") {
        svg.appendChild(line(mx0, y, mx1, y + 10, { color: col, width: 2 }));
        svg.appendChild(CORE.forceArrow(mx1, y + 10, w - 24, y + 22, { color: col, width: 2 }));
        svg.appendChild(txt(w - 24, y + 14, "refracted", { "font-size": 10, fill: C.muted, "text-anchor": "end" }));
      } else if (r.behaviour === "reflect") {
        svg.appendChild(CORE.forceArrow(mx0, y, 24, y - 26, { color: col, width: 2 }));
        svg.appendChild(txt(60, y - 30, "reflected", { "font-size": 10, fill: C.muted }));
      } else { /* absorb */
        svg.appendChild(circle((mx0 + mx1) / 2, y, 4, { fill: col, stroke: col }));
        svg.appendChild(txt((mx0 + mx1) / 2 + 8, y - 8, "absorbed", { "font-size": 10, fill: C.muted }));
      }
    }
    return svg;
  }

  /* emission/absorption ranking of surfaces (matt black best emitter AND
     absorber; shiny silver worst). Used by the radiation demos + scorer.  */
  WavesModels.SURFACE_RANK = { matt_black: 4, dull_black: 3, dull_white: 2, shiny_white: 1, shiny_silver: 0 };
  WavesModels.bestEmitter = function (surfaces) {
    var best = null, bv = -1;
    surfaces.forEach(function (s) { var v = WavesModels.SURFACE_RANK[s]; if (v > bv) { bv = v; best = s; } });
    return best;
  };

  /* ----------------------------- radiation_demo -------------------------
     Infrared required practical. variants:
       "leslie_cube" - a hot Leslie cube; an IR detector reads each face;
                       the matt black face emits the most.
       "wax_rod"     - matt-black vs shiny rods/plates around a heat source;
                       wax holding a ball melts first on the matt black side.
       "two_bottles" - matt-black vs shiny bottles of hot water cooling; a
                       cooling curve (black cools faster).
       "ir_detection"- detecting IR from a warm object by hand, IR sensor
                       and thermal camera.
     params: { variant, faces:[...], mark:{...}, label }                   */
  function radiation_demo(params) {
    params = params || {};
    var v = params.variant || "leslie_cube";
    var w = params.w || 460, h = params.h || 280;
    var svg = makeSVG(w, h, params.label || ("infrared demo: " + v));

    if (v === "leslie_cube") {
      var cx = w * 0.4, cy = h / 2, s = 90;
      svg.appendChild(el("rect", { x: cx - s / 2, y: cy - s / 2, width: s, height: s, fill: "rgba(80,80,80,.35)", stroke: C.ink2, "stroke-width": 1.6 }));
      svg.appendChild(el("rect", { x: cx - s / 2, y: cy - s / 2, width: s / 2, height: s, fill: "rgba(30,30,28,.65)" }));
      svg.appendChild(txt(cx - s / 4, cy, "matt", { "text-anchor": "middle", "font-size": 9, fill: C.paper }));
      svg.appendChild(txt(cx - s / 4, cy + 11, "black", { "text-anchor": "middle", "font-size": 9, fill: C.paper }));
      svg.appendChild(txt(cx + s / 4, cy + 5, "shiny", { "text-anchor": "middle", "font-size": 9, fill: C.ink2 }));
      svg.appendChild(txt(cx, cy - s / 2 - 6, "hot water inside (Leslie cube)", { "text-anchor": "middle", "font-size": 10, fill: C.ink2 }));
      /* IR detector facing the matt black face + meter */
      var dx = cx - s / 2 - 60;
      svg.appendChild(el("rect", { x: dx, y: cy - 12, width: 26, height: 24, rx: 3, fill: "rgba(150,150,150,.5)", stroke: C.ink2, "stroke-width": 1.2 }));
      svg.appendChild(CORE.forceArrow(cx - s / 2 - 4, cy, dx + 26 + 2, cy, { color: C.accent, width: 1.6 }));
      svg.appendChild(txt(dx + 13, cy + 36, "IR", { "text-anchor": "middle", "font-size": 9.5, fill: C.ink2 }));
      svg.appendChild(txt(dx + 13, cy + 47, "detector", { "text-anchor": "middle", "font-size": 9.5, fill: C.ink2 }));
      svg.appendChild(circle(dx - 28, cy, 16, { stroke: C.ink2, width: 1.4 }));
      svg.appendChild(txt(dx - 28, cy + 4, "mV", { "text-anchor": "middle", "font-size": 9, fill: C.ink2 }));
      svg.appendChild(txt(w - 20, h - 16, "matt black emits the most IR", { "text-anchor": "end", "font-size": 10, fill: C.muted }));
    } else if (v === "wax_rod") {
      var hx = w / 2;
      svg.appendChild(el("rect", { x: hx - 10, y: 40, width: 20, height: h - 90, fill: "rgba(200,90,40,.5)", stroke: C.ink2, "stroke-width": 1.2 }));
      svg.appendChild(txt(hx, 32, "heat source", { "text-anchor": "middle", "font-size": 10, fill: C.ink2 }));
      [["matt black", hx - 110, "rgba(30,30,28,.8)", true], ["shiny", hx + 90, "rgba(180,180,185,.8)", false]].forEach(function (a) {
        var px = a[1];
        svg.appendChild(el("rect", { x: px, y: 60, width: 16, height: h - 130, fill: a[2], stroke: C.ink2, "stroke-width": 1.2 }));
        /* wax blob + ball on the source-facing side */
        var bx = (a[1] < hx) ? px + 16 : px;
        svg.appendChild(circle(bx, h - 80, 5, { fill: "rgba(220,200,120,.9)", stroke: C.ink2, width: 1 }));
        svg.appendChild(txt(px + 8, 54, a[0], { "text-anchor": "middle", "font-size": 9.5, fill: C.ink2 }));
        if (a[3]) svg.appendChild(txt(px + 8, h - 50, "ball falls first", { "text-anchor": "middle", "font-size": 9, fill: C.accent }));
      });
      svg.appendChild(txt(w / 2, h - 14, "matt black absorbs more IR: its wax melts first", { "text-anchor": "middle", "font-size": 10, fill: C.muted }));
    } else if (v === "two_bottles") {
      /* cooling curve: black bottle cools faster (steeper) */
      var g = CORE.grid({ w: w, h: h, xmax: 20, xstep: 5, ymax: 80, ystep: 20, minorDiv: 5,
        xlabel: "time / min", ylabel: "temperature / C", label: "cooling curves" });
      var T0 = 80, Tamb = 20;
      function cool(kr) { return function (t) { return Tamb + (T0 - Tamb) * Math.exp(-kr * t); }; }
      g.addFn(cool(0.16), 0, 20, { color: C.ink, width: 2.4 });           /* matt black: faster */
      g.addFn(cool(0.075), 0, 20, { color: C.accent, width: 2.4, dash: "6 4" }); /* shiny: slower */
      g.note(g.px(13), g.py(cool(0.16)(13)) - 6, "matt black (cools faster)", { "font-size": 10, fill: C.ink });
      g.note(g.px(12), g.py(cool(0.075)(12)) + 14, "shiny (cools slower)", { "font-size": 10, fill: C.accent });
      return g.svg;
    } else { /* ir_detection */
      var oy = h / 2, obx = 60;
      svg.appendChild(circle(obx, oy, 22, { fill: "rgba(200,90,40,.5)", stroke: C.ink2, width: 1.4 }));
      svg.appendChild(txt(obx, oy + 40, "warm object", { "text-anchor": "middle", "font-size": 10, fill: C.ink2 }));
      ["hand", "IR sensor + meter", "thermal camera"].forEach(function (lab, i) {
        var ty = 50 + i * ((h - 90) / 2), tx = w - 150;
        svg.appendChild(CORE.forceArrow(obx + 26, oy, tx - 4, ty, { color: C.accent, width: 1.4 }));
        svg.appendChild(el("rect", { x: tx, y: ty - 12, width: 120, height: 24, rx: 4, fill: C.paper, stroke: C.ink2, "stroke-width": 1.1 }));
        svg.appendChild(txt(tx + 60, ty + 4, lab, { "text-anchor": "middle", "font-size": 10, fill: C.ink2 }));
      });
      svg.appendChild(txt(w / 2, h - 12, "infrared can be detected by hand, an IR sensor and a thermal camera", { "text-anchor": "middle", "font-size": 9.5, fill: C.muted }));
    }
    return svg;
  }

  /* ============================ REGISTRATION ============================= */
  var registry = {
    wave_train: wave_train,
    wavefronts: wavefronts,
    longitudinal_wave: longitudinal_wave,
    wave_scenario: wave_scenario,
    ripple_tank: ripple_tank,
    standing_wave: standing_wave,
    em_spectrum: em_spectrum,
    em_origins: em_origins,
    em_uses: em_uses,
    refraction_wavefronts: refraction_wavefronts,
    refraction_ray: refraction_ray,
    material_wave_behaviour: material_wave_behaviour,
    radiation_demo: radiation_demo
  };
  var interactive = {
    wave_train: widget_wave_train,
    wavefronts: widget_wavefronts,
    longitudinal_wave: widget_longitudinal_wave,
    wave_scenario: widget_wave_scenario,
    ripple_tank: widget_ripple_tank,
    standing_wave: widget_standing_wave,
    em_spectrum: widget_em_spectrum,
    refraction_wavefronts: widget_refraction_wavefronts,
    refraction_ray: widget_refraction_ray
  };

  if (typeof window !== "undefined") {
    window.TOPIC_DIAGRAMS = window.TOPIC_DIAGRAMS || {};
    for (var k in registry) if (registry.hasOwnProperty(k)) window.TOPIC_DIAGRAMS[k] = registry[k];
    window.TOPIC_WIDGETS = window.TOPIC_WIDGETS || {};
    for (var k2 in interactive) if (interactive.hasOwnProperty(k2)) window.TOPIC_WIDGETS[k2] = interactive[k2];
    window.WAVES_MODELS = WavesModels;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { registry: registry, interactive: interactive, Models: WavesModels };
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
