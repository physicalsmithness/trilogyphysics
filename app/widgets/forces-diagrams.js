/* =====================================================================
   Trilogy Physics - Forces 6.5 widget catalogue
   Widgets 6.5 chat deliverable (Architecture dispatch d025/d026).

   Built ON the shared core (app/widgets/widgets_core.js, d026): no
   private copies of graph/axis/arrow primitives live here.

   Contract:
     STATIC      window.TOPIC_DIAGRAMS[kind](params) -> SVGElement
     INTERACTIVE window.TOPIC_WIDGETS[kind](host, config) -> instance
                 instance = { getAnswer(), score(answer, config),
                              destroy() }   (Fields-driller pattern;
                 grading contract proposed to Housing in
                 inter_chat/Widgets_Housing_interactive_65.md)

   Graph convention (dispatch): readings land ON gridlines; 5 small
   boxes per big box (sometimes 4); axis scales deliberately not all
   1-2-3. Deliberately-wrong distractor variants are named per kind.

   Pure physics lives in ForcesModels (no DOM), dual-exported so Node
   can assert on it headless (verify_forces_models.js).
   ===================================================================== */
(function (root) {
  "use strict";

  var CORE = (typeof window !== "undefined" && window.WIDGETS_CORE) ||
             (typeof require !== "undefined" ? require("./widgets_core.js") : null);
  if (!CORE) throw new Error("widgets_core.js must load before forces-diagrams.js");
  var el = CORE.el, txt = CORE.txt, C = CORE.C, M = CORE.Maths, fmt = CORE.fmt;

  /* ============================== MODELS ================================= */
  /* A JOURNEY is the single source of truth for every kinematics graph:
     phases = [{dur, v0, v1}] (v linear within a phase, so a is constant
     per phase). From it we derive v(t), a(t), displacement s(t) and
     path-length distance d(t). All kinematic kinds plot the SAME journey,
     which keeps the five graph kinds mutually consistent by construction. */
  function journey(phases) {
    var T = 0, i, marks = [0];
    for (i = 0; i < phases.length; i++) { T += phases[i].dur; marks.push(T); }
    function phaseAt(t) {
      var acc = 0, j;
      for (j = 0; j < phases.length; j++) {
        if (t <= acc + phases[j].dur + 1e-9) return { p: phases[j], t0: acc };
        acc += phases[j].dur;
      }
      return null;
    }
    function shapeOf(p) { return p.shape || "linear"; }
    function isLin(p) { var s = shapeOf(p); return s === "linear" || s === "hold"; }
    function v(t) {
      var ph = phaseAt(t); if (!ph) return null;
      var u = (t - ph.t0) / ph.p.dur;
      if (shapeOf(ph.p) === "hold") return ph.p.v0;
      return ph.p.v0 + (ph.p.v1 - ph.p.v0) * M.shapeFn(shapeOf(ph.p))(u);
    }
    function a(t) {
      var ph = phaseAt(t); if (!ph) return null;
      if (isLin(ph.p)) return (ph.p.v1 - ph.p.v0) / ph.p.dur;
      /* curved phase: numeric gradient of v, sampled inside the phase  */
      var h = ph.p.dur * 1e-4;
      var ta = Math.max(ph.t0 + 1e-9, t - h), tb = Math.min(ph.t0 + ph.p.dur - 1e-9, t + h);
      return (v(tb) - v(ta)) / (tb - ta);
    }
    /* displacement: integral of v. Exact for linear/hold phases
       (piecewise quadratic); numeric trapezia for curved shapes.        */
    function phaseInt(p, tauEnd, absolute) {
      /* integral of v (or |v|) over local time [0, tauEnd] of phase p   */
      if (isLin(p) && !absolute) {
        var u = tauEnd / p.dur;
        return p.v0 * tauEnd + 0.5 * (p.v1 - p.v0) * p.dur * u * u;
      }
      if (isLin(p) && absolute) {
        /* exact, split at a zero crossing                                */
        var cuts = [0, tauEnd];
        if (p.v0 * p.v1 < 0) {
          var tz = -p.v0 * p.dur / (p.v1 - p.v0);
          if (tz > 0 && tz < tauEnd) cuts = [0, tz, tauEnd];
        }
        var D = 0, k;
        for (k = 0; k < cuts.length - 1; k++) {
          var ua = cuts[k] / p.dur, ub = cuts[k + 1] / p.dur;
          D += Math.abs(p.v0 * (cuts[k + 1] - cuts[k]) +
                        0.5 * (p.v1 - p.v0) * p.dur * (ub * ub - ua * ua));
        }
        return D;
      }
      /* curved: numeric */
      var g = M.shapeFn(shapeOf(p));
      var f = function (tau) {
        var val = p.v0 + (p.v1 - p.v0) * g(tau / p.dur);
        return absolute ? Math.abs(val) : val;
      };
      return M.trapz(f, 0, tauEnd, 400);
    }
    function s(t) {
      var acc = 0, S = 0, j, p;
      for (j = 0; j < phases.length; j++) {
        p = phases[j];
        if (t <= acc + 1e-12) break;
        S += phaseInt(p, Math.min(t - acc, p.dur), false);
        acc += p.dur;
      }
      return S;
    }
    /* distance (path length): integral of |v|; exact for linear/hold
       phases, numeric for curved shapes (handles over_top/under_bottom
       sign wiggles without needing crossing-finding).                   */
    function d(t) {
      var acc = 0, D = 0, j, p;
      for (j = 0; j < phases.length; j++) {
        p = phases[j];
        if (t <= acc + 1e-12) break;
        D += phaseInt(p, Math.min(t - acc, p.dur), true);
        acc += p.dur;
      }
      return D;
    }
    return { phases: phases, T: T, marks: marks, v: v, a: a, s: s, d: d };
  }

  var ForcesModels = {
    journey: journey,

    /* Scenario presets. Numbers chosen so the plotted values land on
       small-box gridlines for the axes each preset declares.           */
    scenarios: {
      /* "walk to the shops": slow progress, a stop, a faster return leg */
      walk_to_shops: {
        phases: [ { dur: 60, v0: 1.0,  v1: 1.0 },
                  { dur: 60, v0: 0,    v1: 0   },
                  { dur: 40, v0: -1.5, v1: -1.5 } ],
        axes: {
          distance_time:     { xmax: 160, xstep: 20, ymax: 140, ystep: 20, minorDiv: 4,
                               ylabel: "distance / m" },
          displacement_time: { xmax: 160, xstep: 20, ymin: 0, ymax: 80, ystep: 20, minorDiv: 4,
                               ylabel: "displacement / m" },
          speed_time:        { xmax: 160, xstep: 20, ymax: 2, ystep: 0.5, minorDiv: 5,
                               ylabel: "speed / m/s" },
          velocity_time:     { xmax: 160, xstep: 20, ymin: -2, ymax: 2, ystep: 0.5, minorDiv: 5,
                               ylabel: "velocity / m/s" },
          acceleration_time: { xmax: 160, xstep: 20, ymin: -1, ymax: 1, ystep: 0.5, minorDiv: 5,
                               ylabel: "acceleration / m/s²" }
        }
      },
      /* conventional bus/car journey: accelerate, cruise, brake to rest */
      bus_journey: {
        phases: [ { dur: 10, v0: 0,  v1: 12 },
                  { dur: 20, v0: 12, v1: 12 },
                  { dur: 10, v0: 12, v1: 0  } ],
        axes: {
          distance_time:     { xmax: 40, xstep: 5, ymax: 400, ystep: 50, minorDiv: 5,
                               ylabel: "distance / m" },
          displacement_time: { xmax: 40, xstep: 5, ymax: 400, ystep: 50, minorDiv: 5,
                               ylabel: "displacement / m" },
          speed_time:        { xmax: 40, xstep: 5, ymax: 14, ystep: 2, minorDiv: 4,
                               ylabel: "speed / m/s" },
          velocity_time:     { xmax: 40, xstep: 5, ymax: 14, ystep: 2, minorDiv: 4,
                               ylabel: "velocity / m/s" },
          acceleration_time: { xmax: 40, xstep: 5, ymin: -1.6, ymax: 1.6, ystep: 0.4, minorDiv: 4,
                               ylabel: "acceleration / m/s²" }
        }
      }
    },

    /* gradient_tool presets */
    gradient: {
      /* straight line: v-t, gradient = acceleration 1.5 m/s^2.
         Read-off triangle (2,3) -> (6,9), all on gridlines.            */
      line: {
        f: function (t) { return 1.5 * t; },
        domain: [0, 8], slopeAt: function () { return 1.5; },
        axes: { xmax: 8, xstep: 2, ymax: 12, ystep: 2, minorDiv: 4,
                xlabel: "time / s", ylabel: "velocity / m/s" },
        triangle: [[2, 3], [6, 9]], slope: 1.5,
        slopeUnits: "m/s²"
      },
      /* curve: d-t for an accelerating object, d = 0.5 t^2.
         Tangent at t = 6 has slope 6 and passes (3,0) and (9,36):
         both read-off points land on gridlines.                        */
      curve: {
        f: function (t) { return 0.5 * t * t; },
        domain: [0, 10], slopeAt: function (t) { return t; },
        axes: { xmax: 10, xstep: 1, ymax: 50, ystep: 10, minorDiv: 5,
                xlabel: "time / s", ylabel: "distance / m" },
        tangentAt: 6, tangentPoints: [[3, 0], [9, 36]], slope: 6,
        /* the WRONG straight-line read: chord from the origin to the
           point, slope 3 (average speed, not instantaneous)            */
        chordPoints: [[0, 0], [6, 18]], chordSlope: 3,
        slopeUnits: "m/s"
      }
    },

    /* area_under_vt default: braking curve (non-linear so counting is
       the method). v = 12(1-u)^2 over 6 s; exact area = 12*6/3 = 24 m.
       Grid: small box 0.5 s x 1 m/s -> 0.5 m per square -> 48 squares. */
    area: {
      braking_curve: {
        f: function (t) { var u = t / 6; return 12 * (1 - u) * (1 - u); },
        domain: [0, 6],
        axes: { xmax: 6, xstep: 2, ymax: 12, ystep: 4, minorDiv: 4,
                xlabel: "time / s", ylabel: "velocity / m/s" },
        exactArea: 24, squareValue: 0.5, squares: 48
      },
      /* simple triangle + rectangle (linear) variant for lower demand */
      accelerate_cruise: {
        journeyPhases: [ { dur: 4, v0: 0, v1: 8 }, { dur: 6, v0: 8, v1: 8 } ],
        axes: { xmax: 10, xstep: 2, ymax: 10, ystep: 2, minorDiv: 4,
                xlabel: "time / s", ylabel: "velocity / m/s" },
        exactArea: 64, squareValue: 0.25, squares: 256 /* counting not the
                point here; distance comes from triangle+rectangle      */
      }
    },

    /* P2: braking & stopping. v-t: constant u during the reaction time
       tr (thinking), then uniform deceleration a to rest (braking).
       thinking distance = u·tr; braking distance = u²/2a.              */
    braking: {
      presets: {
        base:         { u: 20, tr: 1.0, a: 5,   note: "dry road, alert driver" },
        fast:         { u: 30, tr: 1.0, a: 5,   note: "higher initial speed" },
        slow:         { u: 10, tr: 1.0, a: 5,   note: "lower initial speed" },
        wet_road:     { u: 20, tr: 1.0, a: 2.5, note: "wet road: weaker braking, same thinking" },
        worn_brakes:  { u: 20, tr: 1.0, a: 2.5, note: "worn brakes: weaker braking, same thinking" },
        tired_driver: { u: 20, tr: 2.0, a: 5,   note: "tired/distracted/drunk: longer thinking, same braking" }
      },
      thinking: function (u, tr) { return u * tr; },
      braking:  function (u, a)  { return u * u / (2 * a); },
      stopping: function (u, tr, a) { return u * tr + u * u / (2 * a); },
      brakeTime: function (u, a) { return u / a; }
    },

    /* distance-vs-speed stopping graph: thinking linear in v, braking
       quadratic in v, total = sum. Reaction time readable from the
       linear gradient.                                                  */
    stopping: {
      thinking: function (v, tr) { return tr * v; },
      braking:  function (v, a)  { return v * v / (2 * a); },
      total:    function (v, tr, a) { return tr * v + v * v / (2 * a); }
    },

    /* P4: vector addition. Angles in degrees anticlockwise from +x.    */
    vectors: {
      resultant: function (list) {
        var x = 0, y = 0, i, sum = 0, a;
        for (i = 0; i < list.length; i++) {
          a = list[i].angle * Math.PI / 180;
          x += list[i].mag * Math.cos(a);
          y += list[i].mag * Math.sin(a);
          sum += Math.abs(list[i].mag);
        }
        var mag = Math.sqrt(x * x + y * y);
        return { x: x, y: y, mag: mag,
                 angleDeg: Math.atan2(y, x) * 180 / Math.PI,
                 scalarSum: sum }; /* the distance-vs-displacement distractor */
      }
    },

    /* P3 ramp: weight components on an incline of angle theta.          */
    ramp: {
      alongSlope: function (W, thetaDeg) { return W * Math.sin(thetaDeg * Math.PI / 180); },
      perpSlope:  function (W, thetaDeg) { return W * Math.cos(thetaDeg * Math.PI / 180); }
    },

    /* P5 springs: extension factors relative to one spring carrying the
       same load (same k): series doubles, parallel halves.              */
    springs: {
      factor: { single: 1, series: 2, parallel: 0.5 },
      extension: function (arrangement, xSingle) {
        return (ForcesModels.springs.factor[arrangement] || 1) * xSingle;
      }
    },

    /* P6 collisions (1-D, qualitative illustration backed by exact
       momentum conservation so the arrows are honest):
       sticky   = perfectly inelastic, common final velocity
       bouncy   = perfectly elastic (KE conserved)
       explosion= from rest, momenta equal and opposite                  */
    collisions: {
      sticky: function (m1, u1, m2, u2) {
        var v = (m1 * u1 + m2 * u2) / (m1 + m2);
        return { v1: v, v2: v };
      },
      bouncy: function (m1, u1, m2, u2) {
        return {
          v1: ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2),
          v2: ((m2 - m1) * u2 + 2 * m1 * u1) / (m1 + m2)
        };
      },
      explosion: function (m1, m2, v2) {
        return { v1: -m2 * v2 / m1, v2: v2 };
      },
      momentum: function (m1, v1, m2, v2) { return m1 * v1 + m2 * v2; }
    }
  };

  /* ------------- v2 model layer: author-specified everything ------------ */

  /* Partial axes override: author states only the fields they want
     changed; everything else keeps the kind's computed default.         */
  ForcesModels.mergeAxes = function (base, over) {
    if (!over) return base;
    var out = {}, k;
    for (k in base) if (base.hasOwnProperty(k)) out[k] = base[k];
    for (k in over) if (over.hasOwnProperty(k)) out[k] = over[k];
    return out;
  };


  /* Decompose a piecewise-LINEAR, non-negative v-t journey into rectangles
     and triangles, auto-labelled A, B, C... left to right (rect before
     triangle within a ramp phase). Returns [{label, kind, t0, t1, vLo,
     vHi, area, cx, cy}] with cx/cy a sensible label position (data
     coords). Throws if a phase is curved or dips negative.              */
  ForcesModels.areaRegions = function (phases) {
    var out = [], acc = 0, j, p, lo, hi, dur;
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    function push(kind, t0, t1, vLo, vHi, area, cx, cy) {
      out.push({ label: letters[out.length] || ("R" + out.length), kind: kind,
                 t0: t0, t1: t1, vLo: vLo, vHi: vHi, area: area, cx: cx, cy: cy });
    }
    for (j = 0; j < phases.length; j++) {
      p = phases[j]; dur = p.dur;
      if (p.shape && p.shape !== "linear" && p.shape !== "hold")
        throw new Error("areaRegions needs linear phases");
      var v0 = p.v0, v1 = (p.shape === "hold") ? p.v0 : p.v1;
      if (v0 < -1e-9 || v1 < -1e-9) throw new Error("areaRegions needs non-negative v");
      lo = Math.min(v0, v1); hi = Math.max(v0, v1);
      if (lo > 1e-9)
        push("rectangle", acc, acc + dur, 0, lo, lo * dur, acc + dur / 2, lo / 2);
      if (hi - lo > 1e-9)
        push("triangle", acc, acc + dur, lo, hi, 0.5 * (hi - lo) * dur,
             acc + dur * (v1 > v0 ? 2 / 3 : 1 / 3), lo + (hi - lo) / 3);
      acc += dur;
    }
    return out;
  };

  /* Resolve an area_under_vt params object (author phases + axes, or a
     legacy preset name) into everything the renderer, the interactive
     widget and the grader need.                                          */
  ForcesModels.areaInfo = function (p) {
    p = p || {};
    var f, dom, axes, regions = null, area;
    if (p.phases) {
      if (!p.axes) throw new Error("area_under_vt with phases requires axes");
      var J = journey(p.phases);
      f = J.v; dom = [0, J.T]; axes = p.axes;
      var allLin = p.phases.every(function (ph) {
        return !ph.shape || ph.shape === "linear" || ph.shape === "hold"; });
      area = J.s(J.T);
      if (allLin) { try { regions = ForcesModels.areaRegions(p.phases); } catch (e) {} }
    } else {
      var preset = ForcesModels.area[p.preset || "braking_curve"] || ForcesModels.area.braking_curve;
      if (preset.journeyPhases) {
        var JJ = journey(preset.journeyPhases);
        f = JJ.v; dom = [0, JJ.T];
        try { regions = ForcesModels.areaRegions(preset.journeyPhases); } catch (e2) {}
      } else { f = preset.f; dom = preset.domain; }
      axes = ForcesModels.mergeAxes(preset.axes, p.axes);
      area = (typeof preset.exactArea === "number") ? preset.exactArea : M.trapz(f, dom[0], dom[1], 2000);
    }
    var minor = axes.minorDiv || 5;
    var squareValue = (axes.xstep / minor) * (axes.ystep / minor);
    var a = (typeof p.from === "number") ? p.from : dom[0];
    var b = (typeof p.to === "number") ? p.to : dom[1];
    var shadeArea = (a > dom[0] || b < dom[1]) ? M.trapz(f, a, b, 2000) : area;
    return { f: f, domain: dom, axes: axes, area: area,
             from: a, to: b, shadeArea: shadeArea,
             squareValue: squareValue, squares: shadeArea / squareValue,
             regions: regions };
  };

  /* Curve families for gradient_tool (analytic slopes, no eval):
       {type:"linear", m, c}          y = m t + c
       {type:"power", a, p}           y = a t^p
       {type:"asymptote", A, k}       y = A (1 - e^{-k t})               */
  ForcesModels.curveFromSpec = function (spec) {
    switch (spec.type) {
      case "linear": return {
        f: function (t) { return spec.m * t + (spec.c || 0); },
        slopeAt: function () { return spec.m; }, isLine: true };
      case "asymptote": return {
        f: function (t) { return spec.A * (1 - Math.exp(-spec.k * t)); },
        slopeAt: function (t) { return spec.A * spec.k * Math.exp(-spec.k * t); } };
      case "power": default: return {
        f: function (t) { return spec.a * Math.pow(t, spec.p); },
        slopeAt: function (t) { return spec.a * spec.p * Math.pow(t, spec.p - 1); } };
    }
  };

  /* Default tangent read-off points: the widest pair of points on the
     tangent that (a) stay inside the domain and axes window and (b) land
     on minor-gridline intersections in BOTH coordinates. Falls back to a
     snapped pair flagged exact:false if no exact pair exists, so the
     caller can warn the author that the convention is broken.            */
  ForcesModels.tangentReadPoints = function (f, slopeAt, t0, axes, domain) {
    var m = slopeAt(t0), y0 = f(t0);
    var minor = axes.minorDiv || 5;
    var dx = axes.xstep / minor, dy = axes.ystep / minor;
    var ymin = (typeof axes.ymin === "number") ? axes.ymin : 0;
    var span = domain[1] - domain[0];
    function snap(v, st) { return Math.round(v / st) * st; }
    var best = null, halfRun;
    for (halfRun = Math.floor(span * 0.45 / dx) * dx; halfRun >= 2 * dx - 1e-9; halfRun -= dx) {
      var x1 = snap(t0 - halfRun, dx), x2 = snap(t0 + halfRun, dx);
      if (x1 < domain[0] - 1e-9 || x2 > domain[1] + 1e-9) continue;
      var y1 = y0 + m * (x1 - t0), y2 = y0 + m * (x2 - t0);
      if (y1 < ymin - 1e-9 || y2 < ymin - 1e-9 || y1 > axes.ymax + 1e-9 || y2 > axes.ymax + 1e-9) continue;
      if (M.onGrid(y1, dy) && M.onGrid(y2, dy))
        return { points: [[x1, y1], [x2, y2]], exact: true };
      if (!best) best = { points: [[x1, snap(y1, dy)], [x2, snap(y2, dy)]], exact: false };
    }
    return best;
  };

  /* -------------- wave 2 model layer: resolving + scale drawing --------- */

  /* Pythagorean triples for by-hand resolving (a < b < c).               */
  ForcesModels.TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];

  /* Resolve a vector {mag, angle (deg above horizontal)} into components,
     detecting whether it is a scaled Pythagorean triple (so "by hand"
     items can say which one and the multiplier).                         */
  ForcesModels.resolveInfo = function (spec) {
    var rad = spec.angle * Math.PI / 180;
    var fx = spec.mag * Math.cos(rad), fy = spec.mag * Math.sin(rad);
    var triple = null, i, t, k;
    for (i = 0; i < ForcesModels.TRIPLES.length && !triple; i++) {
      t = ForcesModels.TRIPLES[i];
      [[t[0], t[1]], [t[1], t[0]]].forEach(function (ab) {
        if (triple) return;
        k = spec.mag / t[2];
        if (Math.abs(fx - ab[1] * k) < spec.mag * 0.002 &&
            Math.abs(fy - ab[0] * k) < spec.mag * 0.002)
          triple = { a: t[0], b: t[1], c: t[2], scale: k,
                     legs: [ab[1] * k, ab[0] * k] };
      });
    }
    return { fx: fx, fy: fy, triple: triple };
  };

  /* Pure scorer for vector_resolve (numeric entry): answer {fx, fy}.
     errorCodes: sin_cos_swapped, component_exceeds_magnitude,
     magnitude_unresolved (gave F itself for a component).               */
  ForcesModels.scoreResolve = function (answer, cfg) {
    var info = ForcesModels.resolveInfo(cfg);
    var marksPossible = (typeof cfg.marks === "number") ? cfg.marks : 2;
    var tol = (typeof cfg.tolerance === "number") ? cfg.tolerance : Math.max(cfg.mag * 0.02, 0.5);
    var hits = [], misses = [], codes = [], marks = 0;
    function nr(a, b) { return isFinite(a) && Math.abs(a - b) <= tol; }
    var okX = nr(answer.fx, info.fx), okY = nr(answer.fy, info.fy);
    if (okX) { marks++; hits.push("horizontal component " + answer.fx); }
    if (okY) { marks++; hits.push("vertical component " + answer.fy); }
    if (!okX || !okY) {
      if (nr(answer.fx, info.fy) && nr(answer.fy, info.fx)) {
        misses.push("components swapped: that is sin/cos the wrong way round");
        codes.push("sin_cos_swapped");
      } else {
        if (!okX) misses.push("horizontal: expected about " + fmt(Math.round(info.fx * 100) / 100));
        if (!okY) misses.push("vertical: expected about " + fmt(Math.round(info.fy * 100) / 100));
        if (nr(answer.fx, cfg.mag) || nr(answer.fy, cfg.mag)) codes.push("magnitude_unresolved");
        if ((isFinite(answer.fx) && Math.abs(answer.fx) > cfg.mag + tol) ||
            (isFinite(answer.fy) && Math.abs(answer.fy) > cfg.mag + tol))
          codes.push("component_exceeds_magnitude");
      }
    }
    return { marksAwarded: marks, marksPossible: marksPossible,
             status: marks === marksPossible ? "full" : (marks > 0 ? "partial" : "none"),
             hits: hits, misses: misses, errorCodes: codes };
  };

  /* What absolute direction (deg anticlockwise from +x) does a pupil's
     "angle + reference" statement describe?                              */
  ForcesModels.directionFromReference = function (angle, reference) {
    switch (reference) {
      case "below_horizontal": return -angle;
      case "right_of_vertical": return 90 - angle;
      case "left_of_vertical": return 90 + angle;
      default: return angle; /* above_horizontal */
    }
  };

  /* Pure scorer for the staged scale-drawing flow (Smith's commissioned
     sequence). answer:
       { scale,            units per big box (cm), pupil-chosen
         legs: [[dx,dy]..] each drawn leg in CM (grid units)
         length_cm,        their ruler reading of the resultant line
         magnitude,        their conversion to real units
         angle,            their protractor reading (deg)
         reference }       above_horizontal | below_horizontal |
                           right_of_vertical | left_of_vertical
     cfg: { vectors, marks=4, tolerances... }
     Four marks: drawing, measuring, converting, direction. Conversion is
     marked against THEIR length (ECF), correctness against the model.   */
  ForcesModels.scoreScaleDrawing = function (answer, cfg) {
    var R = ForcesModels.vectors.resultant(cfg.vectors);
    var s = answer.scale;
    var marksPossible = (typeof cfg.marks === "number") ? cfg.marks : 4;
    var hits = [], misses = [], codes = [], marks = 0;
    var trueDir = R.angleDeg;

    /* 1. drawing: every given vector appears once among the legs (any
       order, tip-to-tail), each within half a small box (0.1 cm)        */
    var legTol = (typeof cfg.legTolerance === "number") ? cfg.legTolerance : 0.11;
    var legs = (answer.legs || []).slice();
    var matchedAll = isFinite(s) && s > 0 && legs.length === cfg.vectors.length &&
      cfg.vectors.every(function (vv) {
        var a = vv.angle * Math.PI / 180;
        var want = [vv.mag * Math.cos(a) / s, vv.mag * Math.sin(a) / s];
        var idx = -1, j;
        for (j = 0; j < legs.length; j++)
          if (Math.abs(legs[j][0] - want[0]) <= legTol &&
              Math.abs(legs[j][1] - want[1]) <= legTol) { idx = j; break; }
        if (idx < 0) return false;
        legs.splice(idx, 1);
        return true;
      });
    if (matchedAll) { marks++; hits.push("both vectors drawn tip-to-tail at your scale"); }
    else { misses.push("the drawn lines do not match the given vectors at your scale"); codes.push("legs_wrong"); }

    /* their actual drawn resultant, in cm                                */
    var sx = 0, sy = 0;
    (answer.legs || []).forEach(function (l) { sx += l[0]; sy += l[1]; });
    var theirHyp = Math.sqrt(sx * sx + sy * sy);
    var theirDir = Math.atan2(sy, sx) * 180 / Math.PI;

    /* 2. measuring: ruler reading vs their own drawing                   */
    var measTol = (typeof cfg.measureTolerance === "number") ? cfg.measureTolerance : 0.15;
    if (isFinite(answer.length_cm) && theirHyp > 0 &&
        Math.abs(answer.length_cm - theirHyp) <= measTol) {
      marks++; hits.push("resultant line measured: " + answer.length_cm + " cm");
    } else { misses.push("the measured length does not match your drawn line (" +
        fmt(Math.round(theirHyp * 100) / 100) + " cm)"); codes.push("length_misread"); }

    /* 3. converting: magnitude = their length x their scale (ECF), and
       flag if instead they added the magnitudes                          */
    var magTol = (typeof cfg.tolerance === "number") ? cfg.tolerance : Math.max(R.mag * 0.05, 0.5);
    var viaScale = answer.length_cm * s;
    if (isFinite(answer.magnitude) && isFinite(viaScale) &&
        Math.abs(answer.magnitude - viaScale) <= Math.max(magTol, viaScale * 0.02)) {
      marks++; hits.push("converted with your scale: " + answer.magnitude);
      if (Math.abs(answer.magnitude - R.mag) > magTol)
        misses.push("note: conversion follows your drawing, but the value differs from the true resultant " +
          fmt(Math.round(R.mag * 10) / 10));
    } else {
      if (isFinite(answer.magnitude) && Math.abs(answer.magnitude - R.scalarSum) <= magTol) {
        misses.push("that is the magnitudes simply added, not the measured resultant");
        codes.push("scalar_sum_given");
      } else { misses.push("magnitude should be your measured length × your scale"); codes.push("scale_conversion_wrong"); }
    }

    /* 4. direction: angle + reference describe the resultant direction   */
    var angTol = (typeof cfg.angleTolerance === "number") ? cfg.angleTolerance : 2;
    function norm(d) { while (d > 180) d -= 360; while (d <= -180) d += 360; return d; }
    if (isFinite(answer.angle)) {
      var implied = ForcesModels.directionFromReference(answer.angle, answer.reference || "above_horizontal");
      if (Math.abs(norm(implied - trueDir)) <= angTol) {
        marks++; hits.push(answer.angle + "° " + (answer.reference || "above_horizontal").replace(/_/g, " "));
      } else {
        var refs = ["above_horizontal", "below_horizontal", "right_of_vertical", "left_of_vertical"];
        var fitsOther = refs.some(function (rf) {
          return rf !== (answer.reference || "above_horizontal") &&
            Math.abs(norm(ForcesModels.directionFromReference(answer.angle, rf) - trueDir)) <= angTol;
        });
        if (fitsOther) { misses.push("the angle is right for a DIFFERENT reference than the one you stated"); codes.push("reference_mismatch"); }
        else if (Math.abs(norm(ForcesModels.directionFromReference(180 - answer.angle, answer.reference || "above_horizontal") - trueDir)) <= angTol)
          { misses.push("that reads the protractor's other scale"); codes.push("wrong_protractor_scale"); }
        else { misses.push("direction: expected about " + fmt(Math.round(trueDir * 10) / 10) + "° above horizontal"); codes.push("angle_wrong"); }
      }
    } else misses.push("no angle given");

    return { marksAwarded: marks, marksPossible: marksPossible,
             status: marks === marksPossible ? "full" : (marks > 0 ? "partial" : "none"),
             hits: hits, misses: misses, errorCodes: codes,
             theirDrawing: { hyp_cm: theirHyp, dir_deg: theirDir } };
  };

  /* ===================== STATIC RENDERERS (P1) ========================== */

  function gridFrom(axes, label) {
    return CORE.grid({
      w: 440, h: 300,
      xmin: axes.xmin || 0, xmax: axes.xmax,
      ymin: (typeof axes.ymin === "number") ? axes.ymin : 0, ymax: axes.ymax,
      xstep: axes.xstep, ystep: axes.ystep, minorDiv: axes.minorDiv || 5,
      xlabel: axes.xlabel || "time / s", ylabel: axes.ylabel || "",
      label: label
    });
  }

  /* 1. motion_graph
     params: { kind: distance_time|displacement_time|speed_time|
                     velocity_time|acceleration_time,
               scenario: "walk_to_shops"|"bus_journey",
               phases: [...]   (overrides scenario's),
               axes: {...}     (overrides preset's),
               variant: "correct" | "curved_constant" (DISTRACTOR:
                        constant-speed d-t wrongly drawn as a curve)    } */
  function motion_graph(p) {
    p = p || {};
    var kind = p.kind || "velocity_time";
    var scen = ForcesModels.scenarios[p.scenario || "bus_journey"] ||
               ForcesModels.scenarios.bus_journey;
    var phases = p.phases || scen.phases;
    var J = journey(phases);
    var axes = ForcesModels.mergeAxes(
      (scen.axes && scen.axes[kind]) || scen.axes.velocity_time, p.axes);
    var variant = p.variant || "correct";
    var cap = kind.replace(/_/g, "-") + " graph";
    var g = gridFrom(axes, cap + (variant !== "correct" ? " (distractor)" : ""));

    var fn = { distance_time: J.d, displacement_time: J.s,
               speed_time: function (t) { var vv = J.v(t); return vv == null ? null : Math.abs(vv); },
               velocity_time: J.v, acceleration_time: J.a }[kind] || J.v;

    if (variant === "curved_constant" &&
        (kind === "distance_time" || kind === "displacement_time")) {
      /* DISTRACTOR: each constant-velocity stretch drawn as a curve
         (an S-bulge) instead of a straight line. Wrong on purpose.     */
      var fWrong = function (t) {
        var ph = null, acc = 0, j;
        for (j = 0; j < phases.length; j++) {
          if (t <= acc + phases[j].dur + 1e-9) { ph = { p: phases[j], t0: acc }; break; }
          acc += phases[j].dur;
        }
        if (!ph) return null;
        var base = (kind === "distance_time") ? J.d : J.s;
        var u = (t - ph.t0) / ph.p.dur;
        var y0 = base(ph.t0), y1 = base(ph.t0 + ph.p.dur);
        if (Math.abs(ph.p.v1 - ph.p.v0) > 1e-9 || Math.abs(ph.p.v0) < 1e-9)
          return base(t); /* only bend the constant-v moving stretches */
        return y0 + (y1 - y0) * (u * u * (3 - 2 * u)); /* smoothstep bulge */
      };
      g.addFn(fWrong, 0, J.T, { n: 400 });
    } else if (kind === "acceleration_time") {
      /* piecewise-constant: draw each phase as its own horizontal bar so
         the verticals at transitions read as jumps, not data            */
      var acc = 0, j, aVal;
      for (j = 0; j < phases.length; j++) {
        aVal = (phases[j].v1 - phases[j].v0) / phases[j].dur;
        g.addSegments([[acc, aVal], [acc + phases[j].dur, aVal]], {});
        if (j > 0) {
          var aPrev = (phases[j - 1].v1 - phases[j - 1].v0) / phases[j - 1].dur;
          g.addSegments([[acc, aPrev], [acc, aVal]], { width: 1.2, dash: "3 3", color: C.muted });
        }
        acc += phases[j].dur;
      }
    } else {
      g.addFn(fn, 0, J.T, { n: 400 });
    }
    return g.svg;
  }

  /* 2. area_under_vt (static mode)
     params: { phases: [{dur, v0, v1, shape?}] + axes: {...}   (author-
                 specified journey; any SHAPES name per phase), OR
               preset: "braking_curve"|"accelerate_cruise" (legacy),
               axes: { xmax, xstep, ymax, ystep, minorDiv, xlabel,
                       ylabel } (units live in the label strings),
               from, to     (shade range; defaults to the full domain),
               display: "squares" (counted squares)
                      | "regions" (rectangles + triangles auto-labelled
                                   A, B, C... ; linear phases only)
                      | "none"    (no area marking at all: the pupil
                                   works unaided),
               mark: { squareCaption: true, regionLabels: true,
                       areaValues: false (per-region values caption) }   } */
  function area_under_vt(p) {
    p = p || {};
    var info = ForcesModels.areaInfo(p);
    var display = p.display || "squares";
    var mark = p.mark || {};
    var g = gridFrom(info.axes, "velocity-time graph (area: " + display + ")");

    if (display === "squares") {
      var counts = {};
      g.shadeSquaresUnder(info.f, info.from, info.to, { out: counts });
      if (mark.squareCaption !== false)
        g.note(g.plot.X0 + 8, g.plot.Y1 + 12,
          "1 small square = " + fmt(info.squareValue) + " m",
          { "font-size": 11, fill: C.accent });
    } else if (display === "regions") {
      if (!info.regions) throw new Error("display:'regions' needs linear, non-negative phases");
      g.shadeRegion(info.f, info.from, info.to, {});
      var vals = [];
      info.regions.forEach(function (r) {
        if (r.t1 <= info.from + 1e-9 || r.t0 >= info.to - 1e-9) return;
        g.addSegments([[r.t0, r.vLo], [r.t0, r.vHi]], { width: 1.1, dash: "4 3", color: C.ink2 });
        g.addSegments([[r.t1, r.vLo], [r.t1, r.vHi]], { width: 1.1, dash: "4 3", color: C.ink2 });
        /* the rect/triangle split line (also the triangle's base)        */
        if (r.vLo > 1e-9 || r.kind === "rectangle")
          g.addSegments([[r.t0, r.kind === "rectangle" ? r.vHi : r.vLo],
                         [r.t1, r.kind === "rectangle" ? r.vHi : r.vLo]],
                        { width: 1.1, dash: "4 3", color: C.ink2 });
        if (mark.regionLabels !== false)
          g.note(g.px(r.cx), g.py(r.cy) + 4, r.label,
            { "text-anchor": "middle", "font-size": 13.5, fill: C.accent });
        vals.push(r.label + " = " + fmt(r.area) + " m");
      });
      if (mark.areaValues)
        g.note(g.plot.X0 + 8, g.plot.Y1 + 12, vals.join("   "),
          { "font-size": 10.5, fill: C.ink2 });
    }
    /* display "none": draw nothing but the graph itself                  */
    g.addFn(info.f, info.domain[0], info.domain[1], { n: 300 });
    return g.svg;
  }

  /* 3. gradient_tool (static mode)
     params: { curve: "line"|"curve" (presets), OR
               fspec: {type:"power",a,p} | {type:"linear",m,c} |
                      {type:"asymptote",A,k}   (author curve, analytic
                      slope; requires axes + domain),
               domain, axes, slopeUnits   (full author control),
               tangentAt    (target point; read-off points are computed
                            to land on gridlines, or give readPoints),
               readPoints: [[x1,y1],[x2,y2]]  (explicit override),
               variant: "correct" | "chord" (DISTRACTOR: straight-line
                        chord read on a curve, no tangent),
               chordFrom    (chord anchor, default domain start),
               mark: { triangle:true, deltas:true, working:true,
                       label:true, dropLines:true }                     } */
  function resolveGradient(p) {
    p = p || {};
    var out;
    if (p.fspec) {
      if (!p.axes || !p.domain) throw new Error("gradient_tool with fspec requires axes and domain");
      var fam = ForcesModels.curveFromSpec(p.fspec);
      out = { f: fam.f, slopeAt: fam.slopeAt, isLine: !!fam.isLine,
              domain: p.domain, axes: p.axes, slopeUnits: p.slopeUnits || "",
              tangentAt: p.tangentAt, presetReadPoints: null };
    } else {
      var which = p.curve || "curve";
      var preset = ForcesModels.gradient[which] || ForcesModels.gradient.curve;
      out = { f: preset.f, slopeAt: preset.slopeAt, isLine: which === "line",
              domain: p.domain || preset.domain,
              axes: ForcesModels.mergeAxes(preset.axes, p.axes),
              slopeUnits: p.slopeUnits || preset.slopeUnits,
              tangentAt: (typeof p.tangentAt === "number") ? p.tangentAt : preset.tangentAt,
              presetReadPoints: (p.tangentAt == null && !p.axes) ?
                (which === "line" ? preset.triangle : preset.tangentPoints) : null };
    }
    if (out.tangentAt == null)
      out.tangentAt = (out.domain[0] + out.domain[1]) / 2;
    out.chordFrom = (typeof p.chordFrom === "number") ? p.chordFrom : out.domain[0];
    return out;
  }

  function gradient_tool(p) {
    p = p || {};
    var r = resolveGradient(p);
    var variant = p.variant || "correct";
    var mark = p.mark || {};
    var g = gridFrom(r.axes, "gradient read-off" +
            (variant === "chord" ? " (distractor: chord)" : ""));
    g.addFn(r.f, r.domain[0], r.domain[1], { n: 300 });

    function triangle(p1, p2, slope, units, color) {
      if (mark.triangle !== false) {
        g.addSegments([p1, [p2[0], p1[1]]], { width: 1.3, dash: "5 3", color: color });
        g.addSegments([[p2[0], p1[1]], p2], { width: 1.3, dash: "5 3", color: color });
        g.marker(p1[0], p1[1], {}); g.marker(p2[0], p2[1], {});
      }
      if (mark.dropLines !== false) { g.dropLines(p1[0], p1[1]); g.dropLines(p2[0], p2[1]); }
      if (mark.deltas !== false) {
        g.note((g.px(p1[0]) + g.px(p2[0])) / 2, g.py(p1[1]) + 14,
          "Δx = " + fmt(p2[0] - p1[0]), { "text-anchor": "middle", "font-size": 10.5, fill: color });
        g.note(g.px(p2[0]) + 6, (g.py(p1[1]) + g.py(p2[1])) / 2,
          "Δy = " + fmt(p2[1] - p1[1]), { "font-size": 10.5, fill: color });
      }
      if (mark.working !== false)
        g.note(g.plot.X0 + 8, g.plot.Y1 + 12,
          "gradient = " + fmt(p2[1] - p1[1]) + " / " + fmt(p2[0] - p1[0]) +
          " = " + fmt(Math.round(slope * 1e6) / 1e6) + " " + units,
          { "font-size": 11, fill: color });
    }

    var t0 = r.tangentAt, y0 = r.f(t0), m0 = r.slopeAt(t0);
    if (variant === "chord" && !r.isLine) {
      /* DISTRACTOR: chord read as if it were the gradient at the point   */
      var c1 = [r.chordFrom, r.f(r.chordFrom)], c2 = [t0, y0];
      var chordSlope = (c2[1] - c1[1]) / (c2[0] - c1[0]);
      g.addSegments([c1, c2], { width: 2, color: C.muted });
      triangle(c1, c2, chordSlope, r.slopeUnits, C.muted);
    } else {
      var rp = p.readPoints ? { points: p.readPoints, exact: true }
             : r.presetReadPoints ? { points: r.presetReadPoints, exact: true }
             : ForcesModels.tangentReadPoints(r.f, r.slopeAt, t0, r.axes, r.domain);
      if (!rp) throw new Error("no usable tangent read-off points; widen the domain or move tangentAt");
      var tp = rp.points;
      if (!r.isLine) {
        g.addSegments([tp[0], tp[1]], { width: 2, color: C.ok });
        g.marker(t0, y0, { fill: C.accent });
        if (mark.label !== false)
          g.note(g.px(t0) + 8, g.py(y0) - 8, "tangent at t = " + fmt(t0),
            { "font-size": 10.5, fill: C.ok });
      }
      triangle(tp[0], tp[1], m0, r.slopeUnits, C.ok);
      if (!rp.exact)
        g.note(g.plot.X0 + 8, g.plot.Y1 + 26,
          "WARNING: read-off points snapped, not exactly on gridlines",
          { "font-size": 10, fill: C.accent });
    }
    return g.svg;
  }

  /* ===================== STATIC RENDERERS (P2-P6) ======================== */

  /* 4. braking_vt
     params: { condition: base|fast|slow|wet_road|worn_brakes|tired_driver,
               speed, reaction_time, decel   (override the preset),
               axes: {...}                   (full override; default is
                                              computed to fit all lines),
               keyLabel                      (legend label for the main
                                              line, default the preset
                                              note or condition name),
               compare: [ { condition | speed/reaction_time/decel,
                            label, dash } ]  (overlaid comparison lines,
                                              dotted by default, with a
                                              key, e.g. wet road versus
                                              the dry solid line),
               mark: { areas:true, values:true, caption:true,
                       dropLines:true, key:true }   (what is marked),
               variant: "correct" | "rising_reaction" | "sloped_reaction"
                      | "curved_brake"       (DISTRACTORS as before)     } */
  function braking_vt(p) {
    p = p || {};
    var B = ForcesModels.braking;
    function resolve(spec) {
      spec = spec || {};
      var pre = B.presets[spec.condition || "base"] || B.presets.base;
      return { u:  (typeof spec.speed === "number") ? spec.speed : pre.u,
               tr: (typeof spec.reaction_time === "number") ? spec.reaction_time : pre.tr,
               a:  (typeof spec.decel === "number") ? spec.decel : pre.a,
               label: spec.label || spec.keyLabel || pre.note || (spec.condition || "base"),
               dash: spec.dash || "2 5" };
    }
    var main = resolve(p);
    var u = main.u, tr = main.tr, a = main.a;
    var variant = p.variant || "correct";
    var mark = p.mark || {};
    var compares = (p.compare || []).map(resolve);
    var tb = B.brakeTime(u, a), T = tr + tb;
    var Tmax = T, umax = u;
    compares.forEach(function (c) {
      Tmax = Math.max(Tmax, c.tr + B.brakeTime(c.u, c.a));
      umax = Math.max(umax, c.u);
    });
    var axes = ForcesModels.mergeAxes({ xmax: Math.ceil(Tmax), xstep: 1,
                 ymax: Math.max(20, Math.ceil(umax / 5) * 5) + 5,
                 ystep: 5, minorDiv: 5, xlabel: "time / s", ylabel: "velocity / m/s" }, p.axes);
    var g = gridFrom(axes, "braking velocity-time graph (" + (p.condition || "base") +
            (variant !== "correct" ? ", distractor: " + variant : "") + ")");

    /* shading + value annotations, all author-suppressible              */
    if (variant === "correct" && mark.areas !== false) {
      g.shadeRegion(function () { return u; }, 0, tr, { fill: "rgba(45,106,63,.15)" });
      g.shadeRegion(function (t) { return u * (1 - (t - tr) / tb); }, tr, T,
        { fill: CORE.C.shadeLight });
      g.note(g.px(tr / 2), g.py(u / 2), "thinking", { "text-anchor": "middle", "font-size": 10.5, fill: C.ok });
      g.note(g.px(tr + tb / 3), g.py(u / 3), "braking", { "text-anchor": "middle", "font-size": 10.5, fill: C.accent });
      if (mark.values !== false) {
        g.note(g.px(tr / 2), g.py(u / 2) + 13, fmt(B.thinking(u, tr)) + " m", { "text-anchor": "middle", "font-size": 10, fill: C.ok });
        g.note(g.px(tr + tb / 3), g.py(u / 3) + 13, fmt(B.braking(u, a)) + " m", { "text-anchor": "middle", "font-size": 10, fill: C.accent });
      }
    }
    if (variant === "correct" && mark.caption !== false && mark.values !== false)
      g.note(g.plot.X0 + 8, g.plot.Y1 + 12, "stopping distance = " +
        fmt(B.thinking(u, tr)) + " + " + fmt(B.braking(u, a)) + " = " +
        fmt(B.stopping(u, tr, a)) + " m", { "font-size": 11, fill: C.ink });

    /* the main line (or its deliberately-wrong variant)                  */
    if (variant === "rising_reaction") {
      g.addSegments([[0, u], [tr, u * 1.25], [T, 0]], {});
    } else if (variant === "sloped_reaction") {
      g.addSegments([[0, u], [tr, u * 0.75], [T, 0]], {});
    } else if (variant === "curved_brake") {
      g.addSegments([[0, u], [tr, u]], {});
      g.addFn(function (t) { return u * Math.exp(-(t - tr) * 2.2 / tb); }, tr, axes.xmax, { n: 160 });
    } else {
      g.addSegments([[0, u], [tr, u], [T, 0]], {});
    }
    /* comparison overlays, dotted, same physics                          */
    compares.forEach(function (c) {
      g.addSegments([[0, c.u], [c.tr, c.u], [c.tr + B.brakeTime(c.u, c.a), 0]],
        { width: 2.2, dash: c.dash, color: C.ink2 });
    });
    /* key (auto when compares exist)                                     */
    if (compares.length && mark.key !== false) {
      var kx = g.plot.X1 - 150, ky = g.plot.Y1 + 10, row = 0;
      function keyRow(color, dash, label) {
        g.add(el("line", { x1: kx, y1: ky + row * 15, x2: kx + 26, y2: ky + row * 15,
          stroke: color, "stroke-width": 2.2, "stroke-dasharray": dash || "none" }));
        g.note(kx + 32, ky + row * 15 + 3.5, label, { "font-size": 10, fill: C.ink2 });
        row++;
      }
      keyRow(C.accent, "none", p.keyLabel || main.label);
      compares.forEach(function (c) { keyRow(C.ink2, c.dash, c.label); });
    }
    if (mark.dropLines !== false) g.dropLines(tr, u);
    return g.svg;
  }

  /* 5. stopping_distance_speed
     params: { reaction_time = 0.5, decel = 5, vmax = 40,
               show: ["thinking","braking","total"] (any subset),
               variant: "correct"
                      | "thinking_quadratic" (DISTRACTOR)
                      | "braking_linear"     (DISTRACTOR)                } */
  function stopping_distance_speed(p) {
    p = p || {};
    var tr = (typeof p.reaction_time === "number") ? p.reaction_time : 0.5;
    var a = (typeof p.decel === "number") ? p.decel : 5;
    var vmax = p.vmax || 40;
    var variant = p.variant || "correct";
    var S = ForcesModels.stopping;
    var show = p.show || ["thinking", "braking", "total"];
    var has = function (k) { return show.indexOf(k) >= 0; };
    var mark = p.mark || {};
    var ymax = Math.ceil(S.total(vmax, tr, a) / 25) * 25;
    var g = gridFrom(ForcesModels.mergeAxes({ xmax: vmax, xstep: 10, ymax: ymax, ystep: 25, minorDiv: 5,
                       xlabel: "speed / m/s", ylabel: "distance / m" }, p.axes),
      "stopping distance against speed" + (variant !== "correct" ? " (distractor: " + variant + ")" : ""));

    var fThink = function (v) { return S.thinking(v, tr); };
    var fBrake = function (v) { return S.braking(v, a); };
    if (variant === "thinking_quadratic") fThink = function (v) { return tr * v * v / vmax * 2; };
    if (variant === "braking_linear")     fBrake = function (v) { return S.braking(vmax, a) * v / vmax; };

    if (has("thinking")) {
      g.addFn(fThink, 0, vmax, { color: C.ok, width: 2.2 });
      if (mark.labels !== false) g.note(g.px(vmax) - 6, g.py(fThink(vmax)) - 6, "thinking", { "text-anchor": "end", "font-size": 10.5, fill: C.ok });
    }
    if (has("braking")) {
      g.addFn(fBrake, 0, vmax, { color: C.accent, width: 2.2 });
      if (mark.labels !== false) g.note(g.px(vmax) - 6, g.py(fBrake(vmax)) - 6, "braking", { "text-anchor": "end", "font-size": 10.5, fill: C.accent });
    }
    if (has("total")) {
      g.addFn(function (v) { return fThink(v) + fBrake(v); }, 0, vmax, { color: C.ink, width: 2.6 });
      if (mark.labels !== false) g.note(g.px(vmax) - 6, g.py(fThink(vmax) + fBrake(vmax)) + 14, "stopping", { "text-anchor": "end", "font-size": 10.5, fill: C.ink });
    }
    return g.svg;
  }

  /* ===================== STATIC RENDERERS (P3) ========================== */

  /* shared FBD arrow placement. Body drawn centred at (cx, cy) with half
     sizes (hw, hh). Forces: [{name, dir, mag}] where dir is "up","down",
     "left","right" or degrees anticlockwise from +x (maths convention;
     screen-y handled here). Arrow length scales with mag.               */
  function drawForces(svg, cx, cy, hw, hh, forces) {
    var maxMag = 0, i, f;
    for (i = 0; i < forces.length; i++) maxMag = Math.max(maxMag, Math.abs(forces[i].mag || 1));
    var pxPerUnit = 78 / (maxMag || 1);
    for (i = 0; i < forces.length; i++) {
      f = forces[i];
      var deg = (f.dir === "up") ? 90 : (f.dir === "down") ? -90 :
                (f.dir === "left") ? 180 : (f.dir === "right") ? 0 : (f.dir || 0);
      var rad = deg * Math.PI / 180;
      var L = (Math.abs(f.mag || 1)) * pxPerUnit;
      /* anchor: contact-surface forces start at the bottom edge; weight
         and everything else from the centre of mass                      */
      var n = (f.name || "").toLowerCase();
      var ax = cx, ay = cy;
      if (/normal|reaction/.test(n)) { ay = cy + hh; }
      if (/friction/.test(n)) { ay = cy + hh; }
      if (/upthrust/.test(n)) { ay = cy + hh * 0.4; }
      var x2 = ax + L * Math.cos(rad), y2 = ay - L * Math.sin(rad);
      svg.appendChild(CORE.forceArrow(ax, ay, x2, y2, {
        label: f.name + (f.showMag && f.mag ? " = " + fmt(f.mag) + " N" : ""),
        color: /weight/.test(n) ? C.ink : C.accent,
        width: 2.6, fontSize: 11,
        anchor: Math.cos(rad) < -0.3 ? "end" : (Math.abs(Math.cos(rad)) <= 0.3 ? "middle" : "start")
      }));
    }
  }

  /* ----------------------------- sprites -------------------------------- */
  /* Simple editorial line-art bodies for FBDs and momentum diagrams.
     Origin at GROUND-CENTRE (the contact point under the body's middle);
     returns { node, hw (half width), hc (body-centre height above the
     ground), h (full height) }. kinds: trolley, cart, car, car_trailer,
     boat, person. Mass m nudges trolley/cart widths.                    */
  function makeSprite(kind, m, facing) {
    m = m || 1;
    var g = el("g"), hw, hc, h;
    function wheel(x, cy, r, spoked) {
      g.appendChild(el("circle", { cx: x, cy: cy, r: r, fill: C.paper, stroke: C.ink, "stroke-width": 1.6 }));
      if (spoked) { g.appendChild(el("line", { x1: x - r + 2, y1: cy, x2: x + r - 2, y2: cy, stroke: C.ink2, "stroke-width": 1 }));
        g.appendChild(el("line", { x1: x, y1: cy - r + 2, x2: x, y2: cy + r - 2, stroke: C.ink2, "stroke-width": 1 })); }
    }
    switch (kind) {
      case "cart":
        hw = 40 + m * 6; h = 22; hc = 14;
        g.appendChild(el("rect", { x: -hw, y: -22, width: 2 * hw, height: 10, rx: 2,
          fill: C.paper, stroke: C.ink, "stroke-width": 2 }));
        wheel(-hw * 0.55, -7, 7, true); wheel(hw * 0.55, -7, 7, true);
        break;
      case "car":
        hw = 48; h = 46; hc = 20;
        /* faces RIGHT: squared rear on the left, long sloped bonnet and
           low nose on the right                                          */
        g.appendChild(el("path", { d: "M-48,-8 L-48,-27 L-39,-31 L-31,-31 L-24,-44 L1,-44 L12,-31 L34,-31 Q48,-29 48,-18 L48,-8 Z",
          fill: C.paper, stroke: C.ink, "stroke-width": 2, "stroke-linejoin": "round" }));
        g.appendChild(el("path", { d: "M-20,-32 L-15,-41 L-1,-41 L6,-32 Z", fill: "rgba(140,133,121,.2)", stroke: C.ink2, "stroke-width": 1 }));
        g.appendChild(el("circle", { cx: 45, cy: -22, r: 2.2, fill: C.ink2 })); /* headlight */
        wheel(-28, -8, 8, false); wheel(28, -8, 8, false);
        break;
      case "car_trailer":
        hw = 104; h = 46; hc = 20;
        /* the directional car, shifted right; trailer behind on the left */
        var carPart = makeSprite("car", 1);
        carPart.node.setAttribute("transform", "translate(56,0)");
        g.appendChild(carPart.node);
        g.appendChild(el("line", { x1: 8, y1: -14, x2: -16, y2: -14, stroke: C.ink, "stroke-width": 2.4 }));
        g.appendChild(el("rect", { x: -104, y: -38, width: 88, height: 26, rx: 2,
          fill: C.paper, stroke: C.ink, "stroke-width": 2 }));
        wheel(-60, -8, 8, false);
        break;
      case "boat":
        hw = 52; h = 40; hc = 16;
        /* faces RIGHT: squared stern left, pointed bow right             */
        g.appendChild(el("path", { d: "M-52,-22 L34,-22 Q48,-21 52,-13 L38,-2 L-40,-2 Z",
          fill: C.paper, stroke: C.ink, "stroke-width": 2, "stroke-linejoin": "round" }));
        g.appendChild(el("rect", { x: -22, y: -40, width: 30, height: 18, rx: 2,
          fill: C.paper, stroke: C.ink, "stroke-width": 1.8 }));
        /* waterline */
        g.appendChild(el("path", { d: "M-62,-2 q6,5 12,0 q6,5 12,0 M40,-2 q6,5 12,0 q6,5 12,0",
          fill: "none", stroke: C.muted, "stroke-width": 1.2 }));
        break;
      case "person":
        hw = 16; h = 70; hc = 34;
        g.appendChild(el("circle", { cx: 0, cy: -62, r: 7, fill: C.paper, stroke: C.ink, "stroke-width": 2 }));
        g.appendChild(el("line", { x1: 0, y1: -55, x2: 0, y2: -26, stroke: C.ink, "stroke-width": 2.6 }));
        g.appendChild(el("line", { x1: 0, y1: -48, x2: -14, y2: -34, stroke: C.ink, "stroke-width": 2.2 }));
        g.appendChild(el("line", { x1: 0, y1: -48, x2: 14, y2: -34, stroke: C.ink, "stroke-width": 2.2 }));
        g.appendChild(el("line", { x1: 0, y1: -26, x2: -10, y2: 0, stroke: C.ink, "stroke-width": 2.4 }));
        g.appendChild(el("line", { x1: 0, y1: -26, x2: 10, y2: 0, stroke: C.ink, "stroke-width": 2.4 }));
        break;
      default: /* trolley */
        hw = (34 + m * 10) / 2; h = 47; hc = 25;
        g.appendChild(el("rect", { x: -hw, y: -42, width: 2 * hw, height: 34, rx: 3,
          fill: C.paper, stroke: C.ink, "stroke-width": 2 }));
        wheel(-hw / 2, -5, 5, false); wheel(hw / 2, -5, 5, false);
    }
    if (facing === "left") {
      /* mirror the whole body about its centre line                      */
      var flip = el("g");
      flip.setAttribute("transform", "scale(-1,1)");
      flip.appendChild(g);
      var outer = el("g");
      outer.appendChild(flip);
      g = outer;
    }
    return { node: g, hw: hw, hc: hc, h: h };
  }
  var SPRITE_KINDS = { trolley: 1, cart: 1, car: 1, car_trailer: 1, boat: 1, person: 1 };

  /* 6. free_body_diagram
     params: { object: "box"|"car"|"ball",
               preset: named force sets below, OR
               forces: [{name, dir, mag, showMag}] (full control; the
               distractors - missing force, wrong direction, equal arrows
               when they should differ - are authored via this list)     } */
  var FBD_PRESETS = {
    box_resting:        [ { name: "weight", dir: "down", mag: 10 },
                          { name: "normal contact force", dir: "up", mag: 10 } ],
    car_constant_speed: [ { name: "weight", dir: "down", mag: 12 },
                          { name: "normal contact force", dir: "up", mag: 12 },
                          { name: "driving force", dir: "right", mag: 8 },
                          { name: "resistive forces", dir: "left", mag: 8 } ],
    car_accelerating:   [ { name: "weight", dir: "down", mag: 12 },
                          { name: "normal contact force", dir: "up", mag: 12 },
                          { name: "driving force", dir: "right", mag: 10 },
                          { name: "resistive forces", dir: "left", mag: 5 } ],
    falling_terminal:   [ { name: "weight", dir: "down", mag: 8 },
                          { name: "air resistance", dir: "up", mag: 8 } ],
    falling_speeding_up:[ { name: "weight", dir: "down", mag: 8 },
                          { name: "air resistance", dir: "up", mag: 3 } ]
  };
  function free_body_diagram(p) {
    p = p || {};
    var forces = p.forces || FBD_PRESETS[p.preset || "car_constant_speed"] ||
                 FBD_PRESETS.car_constant_speed;
    var w = 380, h = 300;
    var svg = CORE.makeSVG(w, h, "free body diagram" + (p.preset ? " (" + p.preset + ")" : "") +
      (p.object ? " [" + p.object + "]" : ""));
    var cx = w / 2, cy = h / 2, hw = 44, hh = 28;
    var obj = p.object || "box";
    if (obj === "ball") {
      svg.appendChild(el("circle", { cx: cx, cy: cy, r: 30, fill: C.paper, stroke: C.ink, "stroke-width": 2 }));
      hw = 30; hh = 30;
    } else if (SPRITE_KINDS[obj]) {
      var sp = makeSprite(obj, 2, p.facing || "right");
      sp.node.setAttribute("transform", "translate(" + cx + "," + (cy + sp.hc) + ")");
      svg.appendChild(sp.node);
      hw = sp.hw; hh = sp.hc;
      /* ground (or water) line under grounded bodies                     */
      if (obj !== "boat")
        svg.appendChild(el("line", { x1: 20, y1: cy + sp.hc, x2: w - 20, y2: cy + sp.hc,
          stroke: C.line, "stroke-width": 1.4 }));
    } else {
      svg.appendChild(el("rect", { x: cx - hw, y: cy - hh, width: hw * 2, height: hh * 2,
        rx: 3, fill: C.paper, stroke: C.ink, "stroke-width": 2 }));
    }
    drawForces(svg, cx, cy, hw, hh, forces);
    return svg;
  }

  /* 7. ramp_fbd
     params: { angle = 30, object: "block"|"ball",
               friction: true|false   (up-slope friction force),
               resolve:  true|false   (dashed weight components),
               variant: "correct"
                      | "weight_along_slope" (DISTRACTOR)
                      | "normal_vertical"    (DISTRACTOR)                } */
  function ramp_fbd(p) {
    p = p || {};
    var th = (typeof p.angle === "number") ? p.angle : 30;
    var rad = th * Math.PI / 180;
    var variant = p.variant || "correct";
    var w = 420, h = 300;
    var svg = CORE.makeSVG(w, h, "forces on an incline (" + th + " deg" +
      (variant !== "correct" ? ", distractor: " + variant : "") + ")");
    /* incline rising to the RIGHT: base from (40, 250) to (380, 250),
       slope surface from (40, 250) up to (380, 250 - run*tan)           */
    var bx = 40, by = 250, ex = 380;
    var ey = by - (ex - bx) * Math.tan(rad);
    svg.appendChild(el("path", { d: "M" + bx + "," + by + " L" + ex + "," + by + " L" + ex + "," + ey + " Z",
      fill: "rgba(140,133,121,.12)", stroke: C.ink2, "stroke-width": 1.8 }));
    /* angle arc at the base vertex */
    var arcR = 46;
    svg.appendChild(el("path", { d: "M" + (bx + arcR) + "," + by +
      " A" + arcR + "," + arcR + " 0 0 0 " +
      (bx + arcR * Math.cos(rad)) + "," + (by - arcR * Math.sin(rad)),
      fill: "none", stroke: C.ink2, "stroke-width": 1.2 }));
    svg.appendChild(txt(bx + arcR + 12, by - 10, th + "°", { "font-size": 11.5, fill: C.ink }));

    /* block mid-slope (rotated rect), or ball (circle) */
    var mx = (bx + ex) * 0.52, myOnSlope = by - (mx - bx) * Math.tan(rad);
    var bw = 56, bh = 34;
    var cxB = mx + (bh / 2) * Math.sin(rad), cyB = myOnSlope - (bh / 2) * Math.cos(rad);
    if ((p.object || "block") === "ball") {
      cxB = mx; cyB = myOnSlope - 24;
      svg.appendChild(el("circle", { cx: cxB, cy: cyB, r: 24, fill: C.paper, stroke: C.ink, "stroke-width": 2 }));
    } else {
      var rect = el("rect", { x: -bw / 2, y: -bh / 2, width: bw, height: bh, rx: 2,
        fill: C.paper, stroke: C.ink, "stroke-width": 2 });
      rect.setAttribute("transform", "translate(" + cxB + "," + cyB + ") rotate(" + (-th) + ")");
      svg.appendChild(rect);
    }

    var W = 80; /* weight arrow length in px */
    /* weight */
    if (variant === "weight_along_slope") {
      /* WRONG: weight drawn pointing down the slope */
      svg.appendChild(CORE.forceArrow(cxB, cyB,
        cxB - W * Math.cos(rad), cyB + W * Math.sin(rad),
        { label: "weight", color: C.ink, width: 2.6 }));
    } else {
      svg.appendChild(CORE.forceArrow(cxB, cyB, cxB, cyB + W,
        { label: "weight", color: C.ink, width: 2.6, labelDx: 6, labelDy: 0 }));
    }
    /* normal */
    var nL = W * Math.cos(rad);
    if (variant === "normal_vertical") {
      /* WRONG: normal drawn straight up */
      svg.appendChild(CORE.forceArrow(cxB, cyB, cxB, cyB - nL,
        { label: "normal", color: C.accent, width: 2.6 }));
    } else {
      svg.appendChild(CORE.forceArrow(cxB, cyB,
        cxB - nL * Math.sin(rad), cyB - nL * Math.cos(rad),
        { label: "normal", color: C.accent, width: 2.6 }));
    }
    /* friction up the slope (for a block tending to slide down) */
    if (p.friction) {
      var fL = W * Math.sin(rad);
      svg.appendChild(CORE.forceArrow(cxB, cyB,
        cxB + fL * Math.cos(rad), cyB - fL * Math.sin(rad),
        { label: "friction", color: C.ok, width: 2.6 }));
    }
    /* resolved weight components, dashed */
    if (p.resolve && variant === "correct") {
      var along = W * Math.sin(rad), perp = W * Math.cos(rad);
      svg.appendChild(CORE.forceArrow(cxB, cyB,
        cxB - along * Math.cos(rad), cyB + along * Math.sin(rad),
        { label: "W sin θ", color: C.muted, width: 1.8, dash: "5 4", fontSize: 10 }));
      svg.appendChild(CORE.forceArrow(cxB, cyB,
        cxB + perp * Math.sin(rad), cyB + perp * Math.cos(rad),
        { label: "W cos θ", color: C.muted, width: 1.8, dash: "5 4", fontSize: 10 }));
    }
    return svg;
  }

  /* ===================== STATIC RENDERERS (P4-P6) ======================== */

  /* 8. vector_addition (static)
     params: { vectors: [{mag, angle}]  (deg anticlockwise from +x; the
                         default 3-4-5 pair keeps tips on gridlines),
               quantity: "force"|"displacement",
               method: "scale"|"maths",
               unitsPerBox: 10,
               variant: "correct" | "distance_scalar" (DISTRACTOR: offers
                        the scalar path-length sum as the "answer")      } */
  function vector_addition(p) {
    p = p || {};
    var vecs = p.vectors || [ { mag: 30, angle: 0 }, { mag: 40, angle: 90 } ];
    var quantity = p.quantity || "force";
    var unit = p.unit || (quantity === "force" ? "N" : "m");
    var method = p.method || "scale";
    var upb = p.unitsPerBox || 10;
    var variant = p.variant || "correct";
    var mark = p.mark || {};
    var R = ForcesModels.vectors.resultant(vecs);

    /* work out a grid that fits the tip-to-tail chain */
    var xs = [0], ys = [0], cx = 0, cy = 0, i, a;
    for (i = 0; i < vecs.length; i++) {
      a = vecs[i].angle * Math.PI / 180;
      cx += vecs[i].mag * Math.cos(a); cy += vecs[i].mag * Math.sin(a);
      xs.push(cx); ys.push(cy);
    }
    var xmaxV = Math.max.apply(null, xs), ymaxV = Math.max.apply(null, ys);
    var xminV = Math.min.apply(null, xs.concat([0])), yminV = Math.min.apply(null, ys.concat([0]));
    function up(v) { return Math.ceil(v / upb) * upb; }
    function dn(v) { return Math.floor(v / upb) * upb; }
    var g = CORE.grid(ForcesModels.mergeAxes({
      w: 440, h: 340,
      xmin: dn(xminV) - upb, xmax: up(xmaxV) + upb,
      ymin: dn(yminV) - upb, ymax: up(ymaxV) + upb,
      xstep: upb, ystep: upb, minorDiv: 5, tickLabels: false,
      xlabel: "", ylabel: "",
      label: "vector addition (" + method + (variant !== "correct" ? ", distractor: scalar sum" : "") + ")"
    }, p.axes));
    /* tip-to-tail arrows */
    cx = 0; cy = 0;
    for (i = 0; i < vecs.length; i++) {
      a = vecs[i].angle * Math.PI / 180;
      var nx = cx + vecs[i].mag * Math.cos(a), ny = cy + vecs[i].mag * Math.sin(a);
      g.add(CORE.forceArrow(g.px(cx), g.py(cy), g.px(nx), g.py(ny),
        { label: (mark.vectorLabels !== false) ? fmt(vecs[i].mag) + " " + unit : "",
          color: C.ink, width: 2.4, labelDx: 8, labelDy: -8 }));
      cx = nx; cy = ny;
    }
    /* resultant, dashed accent, tail to final tip (hideable for
       "draw the resultant" stimuli via mark.resultant:false)            */
    if (mark.resultant !== false)
      g.add(CORE.forceArrow(g.px(0), g.py(0), g.px(R.x), g.py(R.y),
        { label: "resultant", color: C.accent, width: 2.8, dash: "7 4", labelDx: 10, labelDy: 14 }));

    if (method === "scale") {
      if (mark.scaleCaption !== false)
        g.note(g.plot.X0 + 8, g.plot.Y1 + 12,
          "scale: 1 big box = " + fmt(upb) + " " + unit,
          { "font-size": 11, fill: C.ink });
      /* protractor at the tail, baseline horizontal, to read the angle  */
      if (mark.protractor !== false)
        g.add(CORE.protractor(g.px(0), g.py(0), 62, { showInner: true }));
    } else if (mark.working !== false) {
      g.note(g.plot.X0 + 8, g.plot.Y1 + 12,
        "R = sqrt(" + fmt(R.x) + "² + " + fmt(R.y) + "²) = " + fmt(Math.round(R.mag * 100) / 100) +
        " " + unit + " at " + fmt(Math.round(R.angleDeg * 10) / 10) + "° to the horizontal",
        { "font-size": 11, fill: C.ink });
    }
    if (variant === "distance_scalar") {
      /* DISTRACTOR: the scalar path-length sum offered as the answer    */
      g.note(g.plot.X0 + 8, g.plot.Y1 + 26,
        (quantity === "displacement" ? "distance travelled" : "sum of magnitudes") +
        " = " + fmt(R.scalarSum) + " " + unit + "  (NOT the resultant)",
        { "font-size": 11, fill: C.muted });
    }
    return g.svg;
  }

  /* 8b. vector_resolve (static)
     params: { mag = 50, angle = 53.13 (deg above horizontal; the default
                 is the 3-4-5 triple so components land on gridlines),
               quantity: "force"|"displacement"|"velocity", unit override,
               method: "calculation" (trig working shown)
                     | "triples"     (Pythagorean-triple annotation)
                     | "scale"       (grid + scale caption, protractor),
               unitsPerBox = 10,
               mark: { components:true, working:true, angle:true,
                       rightAngle:true, protractor (scale mode) },
               variant: "correct" | "sin_cos_swapped" (DISTRACTOR: the
                        two components labelled the wrong way round)     } */
  function vector_resolve(p) {
    p = p || {};
    var mag = (typeof p.mag === "number") ? p.mag : 50;
    var angle = (typeof p.angle === "number") ? p.angle : Math.atan2(4, 3) * 180 / Math.PI;
    var quantity = p.quantity || "force";
    var unit = p.unit || (quantity === "force" ? "N" : quantity === "velocity" ? "m/s" : "m");
    var method = p.method || "calculation";
    var upb = p.unitsPerBox || 10;
    var mark = p.mark || {};
    var variant = p.variant || "correct";
    var info = ForcesModels.resolveInfo({ mag: mag, angle: angle });
    var fx = info.fx, fy = info.fy;

    function up(v) { return Math.ceil(v / upb) * upb; }
    var g = CORE.grid(ForcesModels.mergeAxes({
      w: 440, h: 340,
      xmin: -upb, xmax: up(Math.max(fx, 1)) + upb,
      ymin: -upb, ymax: up(Math.max(fy, 1)) + upb,
      xstep: upb, ystep: upb, minorDiv: 5, tickLabels: false,
      xlabel: "", ylabel: "",
      label: "resolving a vector (" + method +
        (variant !== "correct" ? ", distractor: components swapped" : "") + ")"
    }, p.axes));
    /* the vector */
    g.add(CORE.forceArrow(g.px(0), g.py(0), g.px(fx), g.py(fy),
      { label: fmt(mag) + " " + unit, color: C.ink, width: 2.8, labelDx: 4, labelDy: -12 }));
    /* components: horizontal from the tail, vertical up to the tip       */
    var labX = variant === "sin_cos_swapped" ? fmt(Math.round(fy * 100) / 100) : fmt(Math.round(fx * 100) / 100);
    var labY = variant === "sin_cos_swapped" ? fmt(Math.round(fx * 100) / 100) : fmt(Math.round(fy * 100) / 100);
    if (mark.components !== false) {
      g.add(CORE.forceArrow(g.px(0), g.py(0), g.px(fx), g.py(0),
        { label: labX + " " + unit, color: C.accent, width: 2.2, dash: "6 4", labelDx: 0, labelDy: 16, anchor: "middle" }));
      g.add(CORE.forceArrow(g.px(fx), g.py(0), g.px(fx), g.py(fy),
        { label: labY + " " + unit, color: C.ok, width: 2.2, dash: "6 4", labelDx: 10, labelDy: 0 }));
      if (mark.rightAngle !== false) {
        var s = 9;
        g.add(el("path", { d: "M" + (g.px(fx) - s) + "," + g.py(0) + " L" + (g.px(fx) - s) + "," + (g.py(0) - s) +
          " L" + g.px(fx) + "," + (g.py(0) - s), fill: "none", stroke: C.ink2, "stroke-width": 1.2 }));
      }
    }
    /* angle arc at the tail */
    if (mark.angle !== false) {
      var r0 = 34, a0 = angle * Math.PI / 180;
      g.add(el("path", { d: "M" + (g.px(0) + r0) + "," + g.py(0) +
        " A" + r0 + "," + r0 + " 0 0 0 " +
        (g.px(0) + r0 * Math.cos(a0)) + "," + (g.py(0) - r0 * Math.sin(a0)),
        fill: "none", stroke: C.ink2, "stroke-width": 1.2 }));
      g.note(g.px(0) + r0 + 8, g.py(0) - 8, fmt(Math.round(angle * 10) / 10) + "°",
        { "font-size": 11, fill: C.ink });
    }
    /* method caption */
    if (mark.working !== false) {
      var cap;
      if (variant === "sin_cos_swapped")
        cap = "Fx = F sin θ = " + labX + " " + unit + "   Fy = F cos θ = " + labY + " " + unit + "   (WRONG)";
      else if (method === "triples" && info.triple)
        cap = info.triple.a + "-" + info.triple.b + "-" + info.triple.c + " triple × " +
          fmt(info.triple.scale) + "  →  sides " + fmt(Math.round(fx * 100) / 100) +
          " and " + fmt(Math.round(fy * 100) / 100) + " " + unit;
      else if (method === "scale")
        cap = "scale: 1 big box = " + fmt(upb) + " " + unit + " — drop a perpendicular and measure both sides";
      else
        cap = "Fx = F cos θ = " + fmt(Math.round(fx * 100) / 100) + " " + unit +
          "   Fy = F sin θ = " + fmt(Math.round(fy * 100) / 100) + " " + unit;
      g.note(g.plot.X0 + 8, g.plot.Y1 + 12, cap, { "font-size": 11, fill: C.ink });
    }
    if (method === "scale" && mark.protractor !== false)
      g.add(CORE.protractor(g.px(0), g.py(0), 58, { showInner: true }));
    return g.svg;
  }

  /* 9. spring_extension
     params: { arrangement: "single"|"series"|"parallel",
               masses = 1, naturalLen = 60 (px), extPerMass = 30 (px),
               variant: "correct" | "total_as_extension" (DISTRACTOR:
                        the whole stretched length labelled "extension") } */
  function spring_extension(p) {
    p = p || {};
    var arr = p.arrangement || "single";
    var masses = (typeof p.masses === "number") ? p.masses : 1;
    var L0 = p.naturalLen || 60;
    var xPerMass = p.extPerMass || 30;
    var fac = ForcesModels.springs.factor[arr] || 1;
    var ext = masses * xPerMass * fac;
    var variant = p.variant || "correct";
    var top = 40;
    /* canvas sized to the content: series stacks two springs */
    var springLen = (arr === "series") ? (2 * L0 + ext + 8) : (L0 + ext);
    var w = 460, h = Math.max(300, top + springLen + masses * 24 + 40);
    var svg = CORE.makeSVG(w, h, "spring extension (" + arr +
      (variant !== "correct" ? ", distractor: total length as extension" : "") + ")");
    /* ceiling */
    svg.appendChild(el("line", { x1: 30, y1: top, x2: w - 30, y2: top, stroke: C.ink, "stroke-width": 2.2 }));
    var hx;
    for (hx = 36; hx < w - 30; hx += 14)
      svg.appendChild(el("line", { x1: hx, y1: top, x2: hx - 8, y2: top - 9, stroke: C.muted, "stroke-width": 1 }));

    function zigzag(x, y0, len, coils) {
      var d = "M" + x + "," + y0, i2, n = coils || 8, seg = len / n;
      for (i2 = 0; i2 < n; i2++)
        d += " L" + (x + (i2 % 2 === 0 ? 12 : -12)) + "," + (y0 + seg * (i2 + 0.5));
      d += " L" + x + "," + (y0 + len);
      return el("path", { d: d, fill: "none", stroke: C.ink, "stroke-width": 2, "stroke-linejoin": "round" });
    }
    function massBox(x, y, n) {
      var g2 = el("g"), j;
      for (j = 0; j < n; j++) {
        g2.appendChild(el("rect", { x: x - 16, y: y + j * 24, width: 32, height: 22, rx: 2,
          fill: "rgba(140,133,121,.25)", stroke: C.ink, "stroke-width": 1.6 }));
        g2.appendChild(txt(x, y + j * 24 + 15, "100 g", { "text-anchor": "middle", "font-size": 9, fill: C.ink2 }));
      }
      return g2;
    }
    function bracket(x, y1, y2, label, color) {
      var g2 = el("g");
      g2.appendChild(el("path", { d: "M" + x + "," + y1 + " h7 M" + x + "," + y2 + " h7 M" +
        (x + 7) + "," + y1 + " V" + y2, fill: "none", stroke: color, "stroke-width": 1.4 }));
      g2.appendChild(txt(x + 13, (y1 + y2) / 2 + 4, label, { "font-size": 11, fill: color }));
      return g2;
    }

    /* unloaded reference spring on the left */
    var xRef = 120;
    svg.appendChild(zigzag(xRef, top, L0));
    svg.appendChild(txt(xRef, top + L0 + 18, "unloaded", { "text-anchor": "middle", "font-size": 10, fill: C.muted }));
    svg.appendChild(bracket(xRef + 28, top, top + L0, "natural length", C.ink2));

    /* loaded arrangement on the right */
    var xL = 250;
    if (arr === "parallel") {
      /* load shared between two springs: each extends half the single-
         spring extension; ext already includes the 0.5 factor           */
      var sep = 26;
      svg.appendChild(zigzag(xL - sep, top, L0 + ext, 8));
      svg.appendChild(zigzag(xL + sep, top, L0 + ext, 8));
      svg.appendChild(el("line", { x1: xL - sep - 6, y1: top + L0 + ext, x2: xL + sep + 6, y2: top + L0 + ext,
        stroke: C.ink, "stroke-width": 2 }));
      svg.appendChild(massBox(xL, top + L0 + ext + 2, masses));
      svg.appendChild(bracket(xL + sep + 34, top, top + L0, "L₀", C.ink2));
      if (variant === "total_as_extension")
        svg.appendChild(bracket(xL + sep + 70, top, top + L0 + ext, "extension (WRONG)", C.muted));
      else
        svg.appendChild(bracket(xL + sep + 70, top + L0, top + L0 + ext, "extension", C.accent));
    } else if (arr === "series") {
      svg.appendChild(zigzag(xL, top, L0 + ext / 2, 8));
      svg.appendChild(el("circle", { cx: xL, cy: top + L0 + ext / 2 + 4, r: 4, fill: C.ink }));
      svg.appendChild(zigzag(xL, top + L0 + ext / 2 + 8, L0 + ext / 2, 8));
      svg.appendChild(massBox(xL, top + 2 * L0 + ext + 10, masses));
      svg.appendChild(bracket(xL + 34, top, top + 2 * L0 + ext + 8, "total", C.ink2));
      if (variant !== "total_as_extension")
        svg.appendChild(bracket(xL + 86, top + 2 * L0 + 8, top + 2 * L0 + ext + 8, "extension", C.accent));
    } else {
      svg.appendChild(zigzag(xL, top, L0 + ext, 8));
      svg.appendChild(massBox(xL, top + L0 + ext + 2, masses));
      svg.appendChild(bracket(xL + 34, top, top + L0, "L₀ (natural length)", C.ink2));
      if (variant === "total_as_extension")
        svg.appendChild(bracket(xL + 110, top, top + L0 + ext, "extension (WRONG)", C.muted));
      else
        svg.appendChild(bracket(xL + 110, top + L0, top + L0 + ext, "extension x", C.accent));
    }
    return svg;
  }

  /* 10. collision_illustration
     params: { type: "sticky"|"bouncy"|"explosion",
               m1 = 2, m2 = 1, u1 = 3, u2 = 0,
               v2 = 2 (explosion only),
               showValues: true }
     Illustrative only (not to scale), but the after-velocities are
     computed by exact momentum conservation so arrows are honest.       */
  function collision_illustration(p) {
    p = p || {};
    var type = p.type || "sticky";
    var m1 = p.m1 || 2, m2 = p.m2 || 1;
    var u1 = (typeof p.u1 === "number") ? p.u1 : (type === "explosion" ? 0 : 3);
    var u2 = (typeof p.u2 === "number") ? p.u2 : 0;
    var out;
    if (type === "explosion")      out = ForcesModels.collisions.explosion(m1, m2, (typeof p.v2 === "number") ? p.v2 : 2);
    else if (type === "bouncy")    out = ForcesModels.collisions.bouncy(m1, u1, m2, u2);
    else                           out = ForcesModels.collisions.sticky(m1, u1, m2, u2);

    var w = 460, h = 260;
    var svg = CORE.makeSVG(w, h, "momentum: " + type + " collision (before and after)");
    var groundY1 = 105, groundY2 = 215;
    svg.appendChild(txt(16, 36, "BEFORE", { "font-size": 12, fill: C.ink }));
    svg.appendChild(txt(16, 146, "AFTER", { "font-size": 12, fill: C.ink }));
    svg.appendChild(el("line", { x1: 10, y1: groundY1, x2: w - 10, y2: groundY1, stroke: C.line, "stroke-width": 1.4 }));
    svg.appendChild(el("line", { x1: 10, y1: groundY2, x2: w - 10, y2: groundY2, stroke: C.line, "stroke-width": 1.4 }));

    var maxV = Math.max(Math.abs(u1), Math.abs(u2), Math.abs(out.v1), Math.abs(out.v2), 1);
    var pxPerV = 55 / maxV;
    var kind1 = p.object1 || p.object || "trolley", kind2 = p.object2 || p.object || "trolley";
    var arrowH = 56 + Math.max(makeSprite(kind1, m1).h, makeSprite(kind2, m2).h) - 47;
    /* facing: along the initial motion (after-motion for an explosion);
       a body at rest faces the other body. Overridable.                  */
    function autoFace(vel, fallback) {
      return vel > 1e-9 ? "right" : (vel < -1e-9 ? "left" : fallback);
    }
    var face1 = p.facing1 || autoFace(type === "explosion" ? out.v1 : u1, "right");
    var face2 = p.facing2 || autoFace(type === "explosion" ? out.v2 : u2, "left");
    function trolley(x, gy, m, label, kind, facing) {
      var sp = makeSprite(kind || "trolley", m, facing);
      sp.node.setAttribute("transform", "translate(" + x + "," + gy + ")");
      var g2 = el("g");
      g2.appendChild(sp.node);
      g2.appendChild(txt(x, gy - sp.h - 6, label, { "text-anchor": "middle", "font-size": 10.5, fill: C.ink }));
      return g2;
    }
    function vArrow(x, gy, v, showVal) {
      if (Math.abs(v) < 1e-9) {
        svg.appendChild(txt(x, gy - arrowH - 18, "at rest", { "text-anchor": "middle", "font-size": 9.5, fill: C.muted }));
        return;
      }
      var L = Math.abs(v) * pxPerV, sgn = v >= 0 ? 1 : -1;
      svg.appendChild(CORE.forceArrow(x, gy - arrowH - 18, x + sgn * L, gy - arrowH - 18, {
        color: C.accent, width: 2.4,
        label: showVal !== false ? fmt(Math.round(Math.abs(v) * 100) / 100) + " m/s" : "",
        labelDx: 0, labelDy: -10, anchor: "middle"
      }));
    }

    if (type === "explosion") {
      /* before: the two parts together, at rest */
      svg.appendChild(trolley(w / 2 - 24, groundY1, m1, m1 + " kg", kind1, face1));
      svg.appendChild(trolley(w / 2 + 30, groundY1, m2, m2 + " kg", kind2, face2));
      svg.appendChild(txt(w / 2, groundY1 - arrowH - 22, "at rest", { "text-anchor": "middle", "font-size": 9.5, fill: C.muted }));
      svg.appendChild(trolley(w / 2 - 110, groundY2, m1, m1 + " kg", kind1, face1));
      svg.appendChild(trolley(w / 2 + 110, groundY2, m2, m2 + " kg", kind2, face2));
      vArrow(w / 2 - 110, groundY2, out.v1, p.showValues);
      vArrow(w / 2 + 110, groundY2, out.v2, p.showValues);
    } else if (type === "sticky") {
      svg.appendChild(trolley(120, groundY1, m1, m1 + " kg", kind1, face1));
      svg.appendChild(trolley(310, groundY1, m2, m2 + " kg", kind2, face2));
      vArrow(120, groundY1, u1, p.showValues);
      vArrow(310, groundY1, u2, p.showValues);
      /* after: stuck together */
      svg.appendChild(trolley(200, groundY2, m1, m1 + " kg", kind1, face1));
      svg.appendChild(trolley(200 + makeSprite(kind1, m1).hw + makeSprite(kind2, m2).hw, groundY2, m2, m2 + " kg", kind2, face2));
      vArrow(228, groundY2, out.v1, p.showValues);
    } else {
      svg.appendChild(trolley(120, groundY1, m1, m1 + " kg", kind1, face1));
      svg.appendChild(trolley(310, groundY1, m2, m2 + " kg", kind2, face2));
      vArrow(120, groundY1, u1, p.showValues);
      vArrow(310, groundY1, u2, p.showValues);
      svg.appendChild(trolley(140, groundY2, m1, m1 + " kg", kind1, face1));
      svg.appendChild(trolley(330, groundY2, m2, m2 + " kg", kind2, face2));
      vArrow(140, groundY2, out.v1, p.showValues);
      vArrow(330, groundY2, out.v2, p.showValues);
    }
    if (p.showValues !== false) {
      var pBefore = (type === "explosion") ? 0 : ForcesModels.collisions.momentum(m1, u1, m2, u2);
      var pAfter = ForcesModels.collisions.momentum(m1, out.v1, m2, out.v2);
      svg.appendChild(txt(w / 2, h - 8, "momentum before = momentum after = " +
        fmt(Math.round(pBefore * 100) / 100) + " kg m/s (check: " + fmt(Math.round(pAfter * 100) / 100) + ")",
        { "text-anchor": "middle", "font-size": 10.5, fill: C.muted }));
    }
    return svg;
  }

  /* ============================ REGISTRATION ============================ */
  var registry = {
    motion_graph: motion_graph,
    area_under_vt: area_under_vt,
    gradient_tool: gradient_tool,
    braking_vt: braking_vt,
    stopping_distance_speed: stopping_distance_speed,
    free_body_diagram: free_body_diagram,
    ramp_fbd: ramp_fbd,
    vector_addition: vector_addition,
    vector_resolve: vector_resolve,
    spring_extension: spring_extension,
    collision_illustration: collision_illustration
  };

  /* ========================= INTERACTIVE WIDGETS ========================= */
  /* Contract (proposed to Housing in Widgets_Housing_interactive_65.md,
     mirroring the Fields driller):
       window.TOPIC_WIDGETS[kind](host, config) -> instance
       instance.getAnswer() -> structured pupil response (shape per kind)
       instance.score(answer, config) ->
         { marksAwarded, marksPossible, status: "full"|"partial"|"none",
           hits: [...], misses: [...], errorCodes: [...] }
       instance.destroy()
     The errorCodes vocabulary borrows graphingskills module-8 slugs:
       triangle_too_small, inverse_gradient, chord_used,
       tangent_misses_point, arithmetic_inconsistent, square_count_off,
       area_value_wrong, scalar_sum_given (distance vs displacement).    */

  function inputRow(panel, labelText, unitText) {
    var row = document.createElement("label");
    row.style.cssText = "display:flex;align-items:center;gap:8px;margin:6px 0;font:13px var(--sans, system-ui)";
    var span = document.createElement("span");
    span.textContent = labelText;
    span.style.minWidth = "190px";
    var inp = document.createElement("input");
    inp.type = "number"; inp.step = "any";
    inp.style.cssText = "width:110px;padding:4px 6px;font:inherit";
    var unit = document.createElement("span");
    unit.textContent = unitText || "";
    row.appendChild(span); row.appendChild(inp); row.appendChild(unit);
    panel.appendChild(row);
    return inp;
  }
  function makePanel(host) {
    var panel = document.createElement("div");
    panel.className = "tw-panel";
    panel.style.cssText = "margin-top:8px;padding:8px 10px;border:1px solid rgba(26,26,23,.18);border-radius:6px";
    host.appendChild(panel);
    return panel;
  }
  function near(a, b, tol) { return Math.abs(a - b) <= tol; }

  /* -- interactive area_under_vt: count squares, give the distance ------- */
  function widget_area_under_vt(host, config) {
    config = config || {};
    var info = ForcesModels.areaInfo(config);
    var display = config.display || "squares";
    host.innerHTML = "";
    host.appendChild(area_under_vt(config));
    var panel = makePanel(host);
    var inSquares = (display === "squares") ?
      inputRow(panel, "Number of small squares under the line:", "squares") : null;
    var inDist = inputRow(panel, "Distance travelled:", "m");
    return {
      getAnswer: function () {
        return { squares: inSquares ? parseFloat(inSquares.value) : null,
                 distance: parseFloat(inDist.value) };
      },
      score: function (answer, cfg) {
        cfg = cfg || config;
        var marksPossible = (typeof cfg.marks === "number") ? cfg.marks : (inSquares ? 2 : 1);
        var expSq = info.squares, expD = info.shadeArea;
        var tolSq = (typeof cfg.toleranceSquares === "number") ? cfg.toleranceSquares
                    : Math.max(2, expSq * 0.06);
        var tolD = (typeof cfg.tolerance === "number") ? cfg.tolerance : expD * 0.06;
        var hits = [], misses = [], codes = [], marks = 0;
        if (inSquares) {
          if (isFinite(answer.squares) && near(answer.squares, expSq, tolSq)) {
            marks++; hits.push("square count " + answer.squares + " (accepted: " + Math.round(expSq) + " ± " + Math.round(tolSq) + ")");
          } else { misses.push("square count: expected about " + Math.round(expSq)); codes.push("square_count_off"); }
        }
        if (isFinite(answer.distance) && near(answer.distance, expD, tolD)) {
          marks++; hits.push("distance " + answer.distance + " m");
        } else {
          misses.push("distance: expected about " + fmt(expD) + " m" +
            (inSquares ? " (squares × " + fmt(info.squareValue) + " m)" : ""));
          codes.push("area_value_wrong");
          /* common slip: gave the square count as the distance */
          if (inSquares && isFinite(answer.distance) && near(answer.distance, expSq, tolSq)) codes.push("square_value_not_applied");
        }
        return { marksAwarded: marks, marksPossible: marksPossible,
                 status: marks === marksPossible ? "full" : (marks > 0 ? "partial" : "none"),
                 hits: hits, misses: misses, errorCodes: codes };
      },
      destroy: function () { host.innerHTML = ""; }
    };
  }

  /* -- interactive gradient_tool: place a tangent, read two points ------- */
  function widget_gradient_tool(host, config) {
    config = config || {};
    if (typeof config.targetT === "number" && config.tangentAt == null)
      config.tangentAt = config.targetT;          /* alias               */
    var r = resolveGradient(config);
    var t0 = r.tangentAt;
    var y0 = r.f(t0), trueSlope = r.slopeAt(t0);
    var chordSlope = (!r.isLine && t0 !== r.chordFrom) ?
      (r.f(t0) - r.f(r.chordFrom)) / (t0 - r.chordFrom) : null;

    host.innerHTML = "";
    var g = gridFrom(r.axes, "place the tangent at t = " + fmt(t0));
    g.addFn(r.f, r.domain[0], r.domain[1], { n: 300 });
    g.marker(t0, y0, { fill: C.accent, r: 4.5 });
    host.appendChild(g.svg);

    /* pupil's line: two draggable endpoint handles, snapped to small-box
       gridline intersections so "read off two points" is literal        */
    var sb = g.smallBox;
    var p1 = [r.domain[0] + sb.dx * 2, g.bounds.ymin + sb.dy * 2];
    var p2 = [r.domain[1] - sb.dx * 2, g.bounds.ymin + sb.dy * 2];
    var lineEl = el("line", { stroke: C.ok, "stroke-width": 2.4, "stroke-linecap": "round" });
    var h1 = el("circle", { r: 8, fill: C.ok, "fill-opacity": 0.55, stroke: C.ok, "stroke-width": 1.5 });
    var h2 = el("circle", { r: 8, fill: C.ok, "fill-opacity": 0.55, stroke: C.ok, "stroke-width": 1.5 });
    g.add(lineEl); g.add(h1); g.add(h2);
    function snap(v, step) { return Math.round(v / step) * step; }
    function clampX(v) { return Math.max(g.bounds.xmin, Math.min(g.bounds.xmax, v)); }
    function clampY(v) { return Math.max(g.bounds.ymin, Math.min(g.bounds.ymax, v)); }
    function redraw() {
      lineEl.setAttribute("x1", g.px(p1[0])); lineEl.setAttribute("y1", g.py(p1[1]));
      lineEl.setAttribute("x2", g.px(p2[0])); lineEl.setAttribute("y2", g.py(p2[1]));
      h1.setAttribute("cx", g.px(p1[0])); h1.setAttribute("cy", g.py(p1[1]));
      h2.setAttribute("cx", g.px(p2[0])); h2.setAttribute("cy", g.py(p2[1]));
    }
    function pxInv(X) { return g.bounds.xmin + (X - g.plot.X0) / (g.plot.X1 - g.plot.X0) * (g.bounds.xmax - g.bounds.xmin); }
    function pyInv(Y) { return g.bounds.ymin + (g.plot.Y0 - Y) / (g.plot.Y0 - g.plot.Y1) * (g.bounds.ymax - g.bounds.ymin); }
    CORE.makeDraggable(g.svg, h1, function (pt) {
      p1 = [snap(clampX(pxInv(pt.x)), sb.dx), snap(clampY(pyInv(pt.y)), sb.dy)]; redraw();
    });
    CORE.makeDraggable(g.svg, h2, function (pt) {
      p2 = [snap(clampX(pxInv(pt.x)), sb.dx), snap(clampY(pyInv(pt.y)), sb.dy)]; redraw();
    });
    redraw();

    var panel = makePanel(host);
    var note = document.createElement("div");
    note.style.cssText = "font:12px var(--sans, system-ui);color:#666;margin-bottom:4px";
    note.textContent = "Drag the two handles so the line is a tangent to the curve at the marked point, then read your two points and work out the gradient.";
    panel.appendChild(note);
    var inGrad = inputRow(panel, "gradient =", r.slopeUnits || "");

    return {
      getAnswer: function () {
        var slopePlaced = (p2[0] === p1[0]) ? Infinity : (p2[1] - p1[1]) / (p2[0] - p1[0]);
        return { p1: p1.slice(), p2: p2.slice(), slope_placed: slopePlaced,
                 gradient_entered: parseFloat(inGrad.value) };
      },
      score: function (answer, cfg) {
        cfg = cfg || config;
        var marksPossible = (typeof cfg.marks === "number") ? cfg.marks : 2;
        var hits = [], misses = [], codes = [], marks = 0;
        var span = r.domain[1] - r.domain[0];
        var slopeTol = (typeof cfg.slopeTolerance === "number") ? cfg.slopeTolerance
                       : Math.abs(trueSlope) * 0.12 || 0.1;
        var run = Math.abs(answer.p2[0] - answer.p1[0]);

        /* method mark: a real tangent at the right point, big triangle  */
        var passesPoint = (function () {
          if (run < 1e-9) return false;
          var yAt = answer.p1[1] + answer.slope_placed * (t0 - answer.p1[0]);
          return near(yAt, y0, sb.dy * 1.01); /* within one small box     */
        })();
        var slopeOK = isFinite(answer.slope_placed) && near(answer.slope_placed, trueSlope, slopeTol);
        var isChord = chordSlope != null &&
                      near(answer.slope_placed, chordSlope, Math.abs(chordSlope) * 0.12);
        var bigEnough = run >= ((typeof cfg.minRun === "number") ? cfg.minRun : span * 0.4);

        if (passesPoint && slopeOK && bigEnough) {
          marks++; hits.push("tangent placed at t = " + fmt(t0) + " with a large read-off triangle");
        } else {
          if (!passesPoint) { misses.push("the line does not pass through the marked point"); codes.push("tangent_misses_point"); }
          if (!slopeOK && isChord && !r.isLine) { misses.push("that is the chord (average) slope, not the tangent at the point"); codes.push("chord_used"); }
          else if (!slopeOK) { misses.push("tangent angle is off"); codes.push("tangent_angle_off"); }
          if (!bigEnough) { misses.push("read-off points too close together"); codes.push("triangle_too_small"); }
        }

        /* value mark: their arithmetic and the final number             */
        var entered = answer.gradient_entered;
        if (isFinite(entered)) {
          var consistent = isFinite(answer.slope_placed) &&
                           near(entered, answer.slope_placed, Math.abs(answer.slope_placed) * 0.02 + 1e-9);
          var correct = near(entered, trueSlope, slopeTol);
          if (correct) { marks++; hits.push("gradient = " + entered + " " + (r.slopeUnits || "")); }
          else {
            if (isFinite(answer.slope_placed) && Math.abs(answer.slope_placed) > 1e-9 &&
                near(entered, 1 / answer.slope_placed, Math.abs(1 / answer.slope_placed) * 0.05))
              { misses.push("that is Δx/Δy (run over rise)"); codes.push("inverse_gradient"); }
            else if (!consistent)
              { misses.push("the value does not follow from your own two points"); codes.push("arithmetic_inconsistent"); }
            else misses.push("gradient value wrong (expected about " + fmt(trueSlope) + ")");
          }
        } else misses.push("no gradient entered");

        return { marksAwarded: marks, marksPossible: marksPossible,
                 status: marks === marksPossible ? "full" : (marks > 0 ? "partial" : "none"),
                 hits: hits, misses: misses, errorCodes: codes };
      },
      destroy: function () { host.innerHTML = ""; }
    };
  }

  /* -- interactive vector_addition (scale mode): pick scale, read the
        resultant magnitude and protractor angle -------------------------- */
  function widget_vector_addition(host, config) {
    config = config || {};
    var vecs = config.vectors || [ { mag: 30, angle: 0 }, { mag: 40, angle: 90 } ];
    var quantity = config.quantity || "force";
    var unit = quantity === "force" ? "N" : "m";
    var R = ForcesModels.vectors.resultant(vecs);
    var choices = config.scaleChoices || [5, 10, 20];

    host.innerHTML = "";
    var figDiv = document.createElement("div");
    host.appendChild(figDiv);
    var panel = makePanel(host);
    var selRow = document.createElement("label");
    selRow.style.cssText = "display:flex;align-items:center;gap:8px;margin:6px 0;font:13px var(--sans, system-ui)";
    var selSpan = document.createElement("span");
    selSpan.textContent = "Choose your scale (1 big box =):";
    selSpan.style.minWidth = "190px";
    var sel = document.createElement("select");
    var i, o;
    for (i = 0; i < choices.length; i++) {
      o = document.createElement("option");
      o.value = String(choices[i]); o.textContent = choices[i] + " " + unit;
      sel.appendChild(o);
    }
    sel.selectedIndex = Math.min(1, choices.length - 1);
    selRow.appendChild(selSpan); selRow.appendChild(sel);
    panel.appendChild(selRow);
    var inMag = inputRow(panel, "Resultant magnitude:", unit);
    var inAng = inputRow(panel, "Angle above the horizontal:", "°");

    function build() {
      var upb = parseFloat(sel.value);
      figDiv.innerHTML = "";
      figDiv.appendChild(vector_addition({ vectors: vecs, quantity: quantity,
        method: "scale", unitsPerBox: upb,
        mark: { resultant: false, protractor: false } }));
      /* stimulus only: the resultant is NOT given away; for the full
         drawing experience use the vector_scale_drawing flow              */
    }
    sel.addEventListener("change", build);
    build();

    return {
      getAnswer: function () {
        return { scale: parseFloat(sel.value),
                 magnitude: parseFloat(inMag.value),
                 angle: parseFloat(inAng.value) };
      },
      score: function (answer, cfg) {
        cfg = cfg || config;
        var marksPossible = (typeof cfg.marks === "number") ? cfg.marks : 2;
        var hits = [], misses = [], codes = [], marks = 0;
        var tolM = (typeof cfg.tolerance === "number") ? cfg.tolerance : Math.max(R.mag * 0.05, 0.5);
        var tolA = (typeof cfg.angleTolerance === "number") ? cfg.angleTolerance : 2;
        if (isFinite(answer.magnitude) && near(answer.magnitude, R.mag, tolM)) {
          marks++; hits.push("magnitude " + answer.magnitude + " " + unit);
        } else {
          if (isFinite(answer.magnitude) && near(answer.magnitude, R.scalarSum, tolM)) {
            misses.push("that is the scalar sum of magnitudes (" +
              (quantity === "displacement" ? "the distance travelled" : "adding without direction") +
              "), not the resultant"); codes.push("scalar_sum_given");
          } else misses.push("magnitude: expected about " + fmt(Math.round(R.mag * 10) / 10) + " " + unit);
        }
        if (isFinite(answer.angle) && near(answer.angle, R.angleDeg, tolA)) {
          marks++; hits.push("angle " + answer.angle + "°");
        } else if (isFinite(answer.angle) && near(answer.angle, 90 - R.angleDeg, tolA)) {
          misses.push("that is the angle to the VERTICAL (or the wrong protractor scale)");
          codes.push("wrong_protractor_scale");
        } else misses.push("angle: expected about " + fmt(Math.round(R.angleDeg * 10) / 10) + "°");
        return { marksAwarded: marks, marksPossible: marksPossible,
                 status: marks === marksPossible ? "full" : (marks > 0 ? "partial" : "none"),
                 hits: hits, misses: misses, errorCodes: codes };
      },
      destroy: function () { host.innerHTML = ""; }
    };
  }

  /* -- interactive vector_resolve (numeric entry; calculation/triples) --- */
  function widget_vector_resolve(host, config) {
    config = config || {};
    var mag = (typeof config.mag === "number") ? config.mag : 50;
    var angle = (typeof config.angle === "number") ? config.angle : Math.atan2(4, 3) * 180 / Math.PI;
    var quantity = config.quantity || "force";
    var unit = config.unit || (quantity === "force" ? "N" : quantity === "velocity" ? "m/s" : "m");
    host.innerHTML = "";
    /* stimulus form: components hidden, the pupil supplies them          */
    host.appendChild(vector_resolve({ mag: mag, angle: angle, quantity: quantity, unit: config.unit,
      method: config.method || "calculation", unitsPerBox: config.unitsPerBox,
      mark: { components: false, working: false } }));
    var panel = makePanel(host);
    if (config.method === "triples") {
      var hint = document.createElement("div");
      hint.style.cssText = "font:12px var(--sans, system-ui);color:#666;margin-bottom:4px";
      hint.textContent = "Do this one by hand: the triangle is a Pythagorean triple.";
      panel.appendChild(hint);
    }
    var inFx = inputRow(panel, "Horizontal component:", unit);
    var inFy = inputRow(panel, "Vertical component:", unit);
    return {
      getAnswer: function () {
        return { fx: parseFloat(inFx.value), fy: parseFloat(inFy.value) };
      },
      score: function (answer, cfg) {
        cfg = cfg || config;
        return ForcesModels.scoreResolve(answer,
          { mag: mag, angle: angle, marks: cfg.marks, tolerance: cfg.tolerance });
      },
      destroy: function () { host.innerHTML = ""; }
    };
  }

  /* -- interactive vector_scale_drawing: Smith's commissioned staged flow.
        1 choose scale (nothing drawn until then; the scale stays shown)
        2 draw the legs (drag the tip, Place line; auto-join hypotenuse)
        3 ruler appears: measure the resultant line, enter cm
        4 convert with the scale, enter the magnitude
        5 protractor appears: measure the angle, enter degrees
        6 state the reference (above horizontal, right of vertical, ...)
     Scored by the pure ForcesModels.scoreScaleDrawing (4 marks: drawing,
     measuring, converting, direction; conversion ECF on their length). - */
  function widget_vector_scale_drawing(host, config) {
    config = config || {};
    var vecs = config.vectors || [ { mag: 30, angle: 0 }, { mag: 40, angle: 90 } ];
    var quantity = config.quantity || "force";
    var unit = config.unit || (quantity === "force" ? "N" : "m");
    var choices = config.scaleChoices || [5, 10, 20];
    var REFS = [["above_horizontal", "above the horizontal"],
                ["below_horizontal", "below the horizontal"],
                ["right_of_vertical", "right of the vertical"],
                ["left_of_vertical", "left of the vertical"]];

    host.innerHTML = "";
    var figDiv = document.createElement("div");
    host.appendChild(figDiv);
    var panel = makePanel(host);
    var status = document.createElement("div");
    status.style.cssText = "font:12.5px var(--sans, system-ui);color:#444;margin-bottom:6px";
    panel.appendChild(status);
    var scaleBadge = document.createElement("div");
    scaleBadge.style.cssText = "font:bold 12.5px var(--sans, system-ui);color:#1a1a17;margin-bottom:6px";
    panel.appendChild(scaleBadge);
    var stageBox = document.createElement("div");
    panel.appendChild(stageBox);

    var st = { stage: 1, scale: null, legs: [] };
    var g = null, cmPx = 0, chainEnd = [0, 0], tipPos = null;
    var tipHandle = null, liveLine = null, placedLayer = null;
    var dragHint = null, hasDragged = false;
    var ins = {};

    function problemText() {
      return vecs.map(function (v) { return v.mag + " " + unit + " at " + v.angle + "°"; }).join("  +  ");
    }
    function btn(label, fn) {
      var b = document.createElement("button");
      b.textContent = label;
      b.style.cssText = "font:13px var(--sans, system-ui);margin:4px 6px 0 0;padding:5px 12px;cursor:pointer";
      b.addEventListener("click", fn);
      return b;
    }
    function snap(v, step) { return Math.round(v / step) * step; }

    function buildGrid() {
      /* paper in cm: 1 big box = 1 cm; bounds fit the true sum with margin */
      var cx = 0, cy = 0, xs = [0], ys = [0];
      vecs.forEach(function (v) {
        var a = v.angle * Math.PI / 180;
        cx += v.mag * Math.cos(a) / st.scale; cy += v.mag * Math.sin(a) / st.scale;
        xs.push(cx); ys.push(cy);
      });
      var pad = 2;
      g = CORE.grid({
        w: 460, h: 380,
        xmin: Math.floor(Math.min.apply(null, xs)) - pad,
        xmax: Math.ceil(Math.max.apply(null, xs)) + pad,
        ymin: Math.floor(Math.min.apply(null, ys)) - pad,
        ymax: Math.ceil(Math.max.apply(null, ys)) + pad,
        xstep: 1, ystep: 1, minorDiv: 5, tickLabels: false,
        xlabel: "1 big box = 1 cm", ylabel: "",
        label: "scale drawing"
      });
      cmPx = g.px(1) - g.px(0);
      figDiv.innerHTML = "";
      figDiv.appendChild(g.svg);
      placedLayer = el("g"); g.add(placedLayer);
      g.marker(0, 0, { fill: C.ink, r: 4 });
      /* the draggable tip for the next leg                               */
      liveLine = el("line", { stroke: C.ok, "stroke-width": 2.2, "stroke-dasharray": "5 4" });
      tipHandle = el("circle", { r: 11, fill: C.ok, "fill-opacity": 0.55, stroke: C.ok, "stroke-width": 2 });
      g.add(liveLine); g.add(tipHandle);
      dragHint = txt(0, 0, "← drag this tip", { fill: C.ok, "font-size": 12, "font-weight": "bold" });
      g.add(dragHint);
      tipPos = [chainEnd[0] + 1, chainEnd[1] + 1];
      drawLive();
      dragHint.setAttribute("x", g.px(tipPos[0]) + 16);
      dragHint.setAttribute("y", g.py(tipPos[1]) + 4);
      function pxInv(X) { return g.bounds.xmin + (X - g.plot.X0) / (g.plot.X1 - g.plot.X0) * (g.bounds.xmax - g.bounds.xmin); }
      function pyInv(Y) { return g.bounds.ymin + (g.plot.Y0 - Y) / (g.plot.Y0 - g.plot.Y1) * (g.bounds.ymax - g.bounds.ymin); }
      CORE.makeDraggable(g.svg, tipHandle, function (p2) {
        if (!hasDragged) { hasDragged = true; dragHint.setAttribute("display", "none"); }
        tipPos = [snap(Math.max(g.bounds.xmin, Math.min(g.bounds.xmax, pxInv(p2.x))), 0.2),
                  snap(Math.max(g.bounds.ymin, Math.min(g.bounds.ymax, pyInv(p2.y))), 0.2)];
        drawLive();
      });
    }
    function drawLive() {
      liveLine.setAttribute("x1", g.px(chainEnd[0])); liveLine.setAttribute("y1", g.py(chainEnd[1]));
      liveLine.setAttribute("x2", g.px(tipPos[0]));   liveLine.setAttribute("y2", g.py(tipPos[1]));
      tipHandle.setAttribute("cx", g.px(tipPos[0]));  tipHandle.setAttribute("cy", g.py(tipPos[1]));
    }
    function redrawPlaced() {
      placedLayer.textContent = "";
      var x = 0, y = 0;
      st.legs.forEach(function (l) {
        placedLayer.appendChild(CORE.forceArrow(g.px(x), g.py(y), g.px(x + l[0]), g.py(y + l[1]),
          { color: C.ink, width: 2.4 }));
        x += l[0]; y += l[1];
      });
      chainEnd = [x, y];
      if (st.legs.length === vecs.length && (x !== 0 || y !== 0)) {
        /* auto-join the hypotenuse                                       */
        placedLayer.appendChild(CORE.forceArrow(g.px(0), g.py(0), g.px(x), g.py(y),
          { color: C.accent, width: 2.6, dash: "7 4", label: "resultant", labelDx: 8, labelDy: 14 }));
      }
    }
    function setStage(n) {
      st.stage = n;
      stageBox.textContent = "";
      scaleBadge.textContent = st.scale ? ("Your scale: 1 cm (big box) = " + st.scale + " " + unit) : "";
      if (n === 1) {
        status.textContent = "Add by scale drawing:  " + problemText() + ".  First choose your scale.";
        var sel = document.createElement("select");
        choices.forEach(function (c) {
          var o = document.createElement("option");
          o.value = String(c); o.textContent = "1 cm = " + c + " " + unit;
          sel.appendChild(o);
        });
        stageBox.appendChild(sel);
        stageBox.appendChild(btn("Use this scale", function () {
          st.scale = parseFloat(sel.value);
          buildGrid(); setStage(2);
        }));
      } else if (n === 2) {
        status.textContent = "Drag the green tip to the end of line " + (st.legs.length + 1) +
          " (" + vecs[st.legs.length].mag + " " + unit + " at " + vecs[st.legs.length].angle +
          "°), then place it. Lines join tip-to-tail.";
        stageBox.appendChild(btn("Place line " + (st.legs.length + 1), function () {
          var leg = [tipPos[0] - chainEnd[0], tipPos[1] - chainEnd[1]];
          if (Math.abs(leg[0]) < 1e-9 && Math.abs(leg[1]) < 1e-9) return;
          st.legs.push(leg);
          redrawPlaced();
          if (st.legs.length === vecs.length) {
            liveLine.setAttribute("display", "none"); tipHandle.setAttribute("display", "none");
            setStage(3);
          } else { tipPos = [chainEnd[0] + 1, chainEnd[1] + 1]; drawLive(); setStage(2); }
        }));
        if (st.legs.length) stageBox.appendChild(btn("Undo last line", function () {
          st.legs.pop(); redrawPlaced();
          liveLine.removeAttribute("display"); tipHandle.removeAttribute("display");
          tipPos = [chainEnd[0] + 1, chainEnd[1] + 1]; drawLive(); setStage(2);
        }));
      } else if (n === 3) {
        status.textContent = "A ruler has appeared (round handle moves it, square handle turns it). Line it up along your resultant and measure it.";
        var rg = el("g");
        rg.appendChild(CORE.ruler(cmPx, { lengthCm: Math.ceil((g.bounds.xmax - g.bounds.xmin)) , minorDiv: 5 }));
        g.add(rg);
        CORE.makeManipulable(g.svg, rg, { x: g.plot.X0 + 20, y: g.plot.Y0 - 16, deg: 0, rotHandleAt: cmPx * 4 });
        ins.len = inputRow(stageBox, "Length of the resultant line:", "cm");
        stageBox.appendChild(btn("Next", function () {
          if (isFinite(parseFloat(ins.len.value))) setStage(4);
        }));
      } else if (n === 4) {
        status.textContent = "Now convert your measurement to a real " + quantity + " using your scale.";
        ins.mag = inputRow(stageBox, "Resultant " + quantity + ":", unit);
        stageBox.appendChild(btn("Next", function () {
          if (isFinite(parseFloat(ins.mag.value))) setStage(5);
        }));
      } else if (n === 5) {
        status.textContent = "A protractor has appeared. Centre it where your lines start, line up the base, and measure the angle of the resultant.";
        var pg = el("g");
        pg.appendChild(CORE.protractor(0, 0, 64, { showInner: true }));
        g.add(pg);
        CORE.makeManipulable(g.svg, pg, { x: g.px(0), y: g.py(0), deg: 0, rotHandleAt: 64 });
        ins.ang = inputRow(stageBox, "Angle of the resultant:", "°");
        stageBox.appendChild(btn("Next", function () {
          if (isFinite(parseFloat(ins.ang.value))) setStage(6);
        }));
      } else {
        status.textContent = "Last step: what is that angle measured from?";
        var refSel = document.createElement("select");
        REFS.forEach(function (r) {
          var o = document.createElement("option");
          o.value = r[0]; o.textContent = r[1];
          refSel.appendChild(o);
        });
        stageBox.appendChild(refSel);
        ins.ref = refSel;
        var doneNote = document.createElement("div");
        doneNote.style.cssText = "font:12px var(--sans, system-ui);color:#666;margin-top:6px";
        doneNote.textContent = "Done. Submit when you are happy.";
        stageBox.appendChild(doneNote);
      }
    }
    setStage(1);

    return {
      getAnswer: function () {
        return {
          scale: st.scale,
          legs: st.legs.map(function (l) { return l.slice(); }),
          length_cm: ins.len ? parseFloat(ins.len.value) : NaN,
          magnitude: ins.mag ? parseFloat(ins.mag.value) : NaN,
          angle: ins.ang ? parseFloat(ins.ang.value) : NaN,
          reference: ins.ref ? ins.ref.value : "above_horizontal"
        };
      },
      score: function (answer, cfg) {
        cfg = cfg || config;
        return ForcesModels.scoreScaleDrawing(answer, {
          vectors: vecs, marks: cfg.marks, tolerance: cfg.tolerance,
          legTolerance: cfg.legTolerance, measureTolerance: cfg.measureTolerance,
          angleTolerance: cfg.angleTolerance
        });
      },
      destroy: function () { host.innerHTML = ""; }
    };
  }

  var interactive = {
    area_under_vt: widget_area_under_vt,
    gradient_tool: widget_gradient_tool,
    /* the staged drawing flow IS the vector-addition interaction; the
       old numeric read-off form stays available as _quick               */
    vector_addition: widget_vector_scale_drawing,
    vector_addition_quick: widget_vector_addition,
    vector_resolve: widget_vector_resolve,
    vector_scale_drawing: widget_vector_scale_drawing
  };

  if (typeof window !== "undefined") {
    window.TOPIC_DIAGRAMS = window.TOPIC_DIAGRAMS || {};
    for (var k in registry) if (registry.hasOwnProperty(k)) window.TOPIC_DIAGRAMS[k] = registry[k];
    window.TOPIC_WIDGETS = window.TOPIC_WIDGETS || {};
    for (var k2 in interactive) if (interactive.hasOwnProperty(k2)) window.TOPIC_WIDGETS[k2] = interactive[k2];
    window.FORCES_MODELS = ForcesModels;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { registry: registry, Models: ForcesModels, interactive: interactive };
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
