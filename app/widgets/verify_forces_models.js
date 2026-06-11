/* Node assertions on the Forces 6.5 widget physics (no DOM).
   Run: node verify_forces_models.js                                    */
"use strict";
var CORE = require("./widgets_core.js");
var FD = require("./forces-diagrams.js");
var Mo = FD.Models;

var passed = 0, failed = 0;
function ok(cond, name) {
  if (cond) { passed++; console.log("  ok  " + name); }
  else { failed++; console.log("FAIL  " + name); }
}
function approx(a, b, tol) { return Math.abs(a - b) <= (tol || 1e-9); }

/* ---- journey kinematics ---- */
var J = Mo.journey(Mo.scenarios.walk_to_shops.phases);
ok(J.T === 160, "walk: total time 160 s");
ok(approx(J.s(160), 0), "walk: displacement returns to 0 (got home)");
ok(approx(J.d(160), 120), "walk: distance 120 m (60 out + 60 back)");
ok(approx(J.d(120), 60), "walk: distance unchanged while stopped");
ok(approx(J.s(120), 60), "walk: displacement 60 m at the shops");
ok(J.v(140) === -1.5, "walk: return velocity is negative");
ok(Math.abs(J.v(140)) === 1.5, "walk: return speed is positive (speed-time differs from velocity-time)");

var B = Mo.journey(Mo.scenarios.bus_journey.phases);
ok(B.T === 40, "bus: total time 40 s");
ok(approx(B.s(40), 360), "bus: total displacement 360 m (60+240+60)");
ok(approx(B.a(5), 1.2), "bus: acceleration phase a = +1.2");
ok(B.a(20) === 0, "bus: cruise a = 0");
ok(approx(B.a(35), -1.2), "bus: braking a = -1.2");
/* monotone speeding-up d-t is concave up during acceleration */
ok(B.s(5) < 0.5 * (B.s(0) + B.s(10)), "bus: d-t concave UP while accelerating");
ok(B.s(35) > 0.5 * (B.s(30) + B.s(40)), "bus: d-t concave DOWN while braking");

/* sign-change-inside-a-phase distance integral */
var Z = Mo.journey([{ dur: 10, v0: 5, v1: -5 }]);
ok(approx(Z.s(10), 0), "zigzag: displacement 0");
ok(approx(Z.d(10), 25), "zigzag: distance 25 (12.5 out, 12.5 back)");

/* ---- gradient presets ---- */
var gl = Mo.gradient.line, gc = Mo.gradient.curve;
ok(approx(gl.f(8) / 8, gl.slope), "line: slope matches f");
ok(approx((gl.triangle[1][1] - gl.triangle[0][1]) /
          (gl.triangle[1][0] - gl.triangle[0][0]), gl.slope), "line: triangle slope 1.5");
ok(approx(gc.slopeAt(gc.tangentAt), gc.slope), "curve: analytic slope at t=6 is 6");
ok(approx(CORE.Maths.gradAt(gc.f, gc.tangentAt), gc.slope, 1e-4), "curve: numeric slope agrees");
/* tangent read-off points really lie on the tangent line */
var t0 = gc.tangentAt, y0 = gc.f(t0);
var tp = gc.tangentPoints;
ok(approx(y0 + gc.slope * (tp[0][0] - t0), tp[0][1]), "curve: tangent point 1 on tangent");
ok(approx(y0 + gc.slope * (tp[1][0] - t0), tp[1][1]), "curve: tangent point 2 on tangent");
/* both read-off points land on gridlines (small box 0.2 x 2) */
function onGrid(v, step) { return approx(v / step, Math.round(v / step), 1e-9); }
ok(onGrid(tp[0][0], 0.2) && onGrid(tp[0][1], 2), "curve: read-off point 1 on gridlines");
ok(onGrid(tp[1][0], 0.2) && onGrid(tp[1][1], 2), "curve: read-off point 2 on gridlines");
/* the chord distractor is genuinely wrong (average, not instantaneous) */
ok(approx(gc.chordSlope, (gc.f(6) - gc.f(0)) / 6), "curve: chord slope is the average speed");
ok(gc.chordSlope < gc.slope, "curve: chord underestimates the tangent (concave-up)");

/* ---- area preset ---- */
var ar = Mo.area.braking_curve;
ok(approx(CORE.Maths.trapz(ar.f, ar.domain[0], ar.domain[1], 4000), ar.exactArea, 1e-3),
   "area: braking curve area = 24 m exactly (quadratic)");
ok(approx(ar.exactArea / ar.squareValue, ar.squares), "area: 48 squares at 0.5 m per square");
ok(ar.f(0) === 12 && approx(ar.f(6), 0), "area: braking curve runs 12 -> 0");
/* strictly decreasing, decelerating less hard over time (gradient rises toward 0) */
var dec = true, soft = true, t;
for (t = 0.1; t < 5.8; t += 0.1) {
  if (ar.f(t + 0.05) >= ar.f(t)) dec = false;
  if (CORE.Maths.gradAt(ar.f, t + 0.1) < CORE.Maths.gradAt(ar.f, t) - 1e-9) soft = false;
}
ok(dec, "area: v strictly decreasing");
ok(soft, "area: deceleration eases off (curve, not straight line)");

/* ---- braking / stopping ---- */
var bk = Mo.braking;
ok(bk.thinking(20, 1.0) === 20, "braking: thinking distance u*tr");
ok(bk.braking(20, 5) === 40, "braking: braking distance u^2/2a");
ok(bk.stopping(20, 1.0, 5) === 60, "braking: stopping = 60 m");
ok(bk.braking(20, 2.5) === 80, "braking: wet road doubles braking distance");
ok(bk.thinking(20, 2.0) === 40, "braking: tired driver doubles thinking distance");
ok(bk.braking(30, 5) / bk.braking(15, 5) === 4, "braking: doubling speed quadruples braking distance");
ok(bk.thinking(30, 1) / bk.thinking(15, 1) === 2, "braking: doubling speed doubles thinking distance");
var st = Mo.stopping;
ok(approx(st.total(20, 0.5, 5), 50), "stopping: total at 20 m/s = 10 + 40");
ok(approx(st.thinking(40, 0.5) / st.thinking(10, 0.5), 4), "stopping: thinking linear in v");
ok(approx(st.braking(40, 5) / st.braking(10, 5), 16), "stopping: braking quadratic in v");

/* ---- vectors ---- */
var R = Mo.vectors.resultant([{ mag: 30, angle: 0 }, { mag: 40, angle: 90 }]);
ok(approx(R.mag, 50), "vectors: 3-4-5 resultant 50");
ok(approx(R.angleDeg, Math.atan2(40, 30) * 180 / Math.PI), "vectors: angle = atan(4/3)");
ok(R.scalarSum === 70, "vectors: scalar-sum distractor 70 (distance vs displacement)");
var R2 = Mo.vectors.resultant([{ mag: 10, angle: 0 }, { mag: 10, angle: 180 }]);
ok(approx(R2.mag, 0, 1e-9), "vectors: opposite vectors cancel");

/* ---- ramp ---- */
ok(approx(Mo.ramp.alongSlope(10, 30), 5), "ramp: W sin30 = W/2");
ok(approx(Mo.ramp.perpSlope(10, 60), 5), "ramp: W cos60 = W/2");
ok(approx(Math.pow(Mo.ramp.alongSlope(10, 37), 2) + Math.pow(Mo.ramp.perpSlope(10, 37), 2), 100),
   "ramp: components recombine to W (Pythagoras)");

/* ---- springs ---- */
ok(Mo.springs.extension("single", 4) === 4, "springs: single x");
ok(Mo.springs.extension("series", 4) === 8, "springs: series 2x (same load through both)");
ok(Mo.springs.extension("parallel", 4) === 2, "springs: parallel x/2 (load shared)");

/* ---- collisions ---- */
var s1 = Mo.collisions.sticky(2, 3, 1, 0);
ok(approx(s1.v1, 2) && approx(s1.v2, 2), "sticky: 2kg@3 + 1kg@0 -> both at 2");
ok(approx(Mo.collisions.momentum(2, 3, 1, 0), Mo.collisions.momentum(2, s1.v1, 1, s1.v2)),
   "sticky: momentum conserved");
var e1 = Mo.collisions.bouncy(1, 4, 1, 0);
ok(approx(e1.v1, 0) && approx(e1.v2, 4), "bouncy: equal masses swap velocities");
ok(approx(0.5 * 1 * 16, 0.5 * 1 * e1.v1 * e1.v1 + 0.5 * 1 * e1.v2 * e1.v2),
   "bouncy: KE conserved");
var x1 = Mo.collisions.explosion(1, 2, 2);
ok(approx(x1.v1, -4), "explosion: momenta equal and opposite (1kg recoils at 4)");
ok(approx(Mo.collisions.momentum(1, x1.v1, 2, x1.v2), 0), "explosion: total momentum stays 0");

/* ---- interactive scoring templates (pure, no DOM needed) ---- */
/* fake a gradient_tool instance score via the module's exported logic:
   reproduce the checks by scoring through a minimal stub               */
var iv = FD.interactive;
ok(typeof iv.area_under_vt === "function" &&
   typeof iv.gradient_tool === "function" &&
   typeof iv.vector_addition === "function", "interactive factories exported");

/* ---- v2: curve shapes (the commissioned liberty rules) ---- */
["curve_up", "curve_down"].forEach(function (n) {
  var g = CORE.Maths.shapeFn(n), worst = 9, t;
  for (t = 0; t <= 1; t += 0.001) {
    var grad = (g(Math.min(1, t + 1e-6)) - g(t)) / 1e-6;
    if (grad < worst) worst = grad;
  }
  ok(worst > 0.1, "shape " + n + ": gradient never horizontal (min " + worst.toFixed(2) + ")");
});
var asym = CORE.Maths.shapeFn("asymptote");
ok(asym(1) === 1 && (asym(1) - asym(0.999)) / 0.001 > 0.05,
   "shape asymptote: flattens but never flat");
var ot = CORE.Maths.shapeFn("over_top"), ub = CORE.Maths.shapeFn("under_bottom");
var mx = -9, mn = 9, t2;
for (t2 = 0; t2 <= 1; t2 += 0.001) { if (ot(t2) > mx) mx = ot(t2); if (ub(t2) < mn) mn = ub(t2); }
ok(mx > 1.05, "shape over_top: genuinely overshoots the end value");
ok(mn < -0.02, "shape under_bottom: genuinely dips below the start");

/* ---- v2: curved journey phases ---- */
var JC = Mo.journey([{ dur: 8, v0: 0, v1: 10, shape: "asymptote" }, { dur: 4, v0: 10, v1: 10 }]);
ok(approx(JC.v(8), 10, 1e-9), "curved journey: hits the phase end value exactly");
ok(JC.a(1) > JC.a(6) && JC.a(6) > 0, "curved journey: acceleration decreasing, never zero (terminal-velocity shape)");
ok(approx(JC.s(12), CORE.Maths.trapz(JC.v, 0, 12, 4000), 0.05), "curved journey: displacement matches independent integration");
var JU = Mo.journey([{ dur: 10, v0: 2, v1: 8, shape: "curve_up" }]);
ok(JU.v(5) < 5, "curve_up phase: lags the straight line (concave up)");

/* ---- v2: region decomposition ---- */
var regs = Mo.areaRegions([{ dur: 10, v0: 0, v1: 12 }, { dur: 20, v0: 12, v1: 12 }, { dur: 10, v0: 12, v1: 0 }]);
ok(regs.length === 3 && regs[0].label === "A" && regs[2].label === "C", "regions: labelled A, B, C left to right");
ok(regs[0].kind === "triangle" && regs[1].kind === "rectangle" && regs[2].kind === "triangle", "regions: triangle, rectangle, triangle");
ok(approx(regs[0].area + regs[1].area + regs[2].area, 360), "regions: areas sum to the displacement");
var regs2 = Mo.areaRegions([{ dur: 4, v0: 4, v1: 10 }]);
ok(regs2.length === 2 && regs2[0].kind === "rectangle" && approx(regs2[0].area, 16) && approx(regs2[1].area, 12),
   "regions: ramp from nonzero splits into rectangle 16 + triangle 12");

/* ---- v2: areaInfo with author phases ---- */
var ai = Mo.areaInfo({ phases: [{ dur: 4, v0: 0, v1: 8 }, { dur: 6, v0: 8, v1: 8 }],
  axes: { xmax: 10, xstep: 2, ymax: 10, ystep: 2, minorDiv: 4, xlabel: "t", ylabel: "v" } });
ok(approx(ai.area, 64) && approx(ai.squareValue, 0.25) && approx(ai.squares, 256), "areaInfo: author phases give exact area/squares");
ok(ai.regions && ai.regions.length === 2, "areaInfo: regions available for linear author phases");
var aiC = Mo.areaInfo({ phases: [{ dur: 6, v0: 12, v1: 0, shape: "curve_down" }],
  axes: { xmax: 6, xstep: 2, ymax: 12, ystep: 4, minorDiv: 4, xlabel: "t", ylabel: "v" } });
ok(aiC.regions === null && aiC.area > 0, "areaInfo: curved phases give area but no regions");

/* ---- v2: curve families + tangent read points ---- */
var famP = Mo.curveFromSpec({ type: "power", a: 0.5, p: 2 });
ok(approx(famP.slopeAt(6), 6), "curveFromSpec power: analytic slope");
var famA = Mo.curveFromSpec({ type: "asymptote", A: 10, k: 0.5 });
ok(approx(famA.slopeAt(0), 5) && famA.slopeAt(4) < famA.slopeAt(1), "curveFromSpec asymptote: slope decays");
var rp = Mo.tangentReadPoints(famP.f, famP.slopeAt, 6, { xstep: 1, ystep: 10, minorDiv: 5, ymax: 50 }, [0, 10]);
ok(rp.exact && JSON.stringify(rp.points) === "[[3,0],[9,36]]",
   "tangentReadPoints: recovers the exact gridline pair (3,0)-(9,36)");

/* ---- v2: renderers accept the open params (shim render smoke) ---- */
ok(typeof FD.registry.area_under_vt === "function", "registry intact after v2");

/* ---- wave 2: resolving ---- */
var ri = Mo.resolveInfo({ mag: 50, angle: Math.atan2(40, 30) * 180 / Math.PI });
ok(approx(ri.fx, 30, 1e-6) && approx(ri.fy, 40, 1e-6), "resolve: 50 at 53.13 gives 30 and 40");
ok(ri.triple && ri.triple.c === 5 && approx(ri.triple.scale, 10), "resolve: detected as 3-4-5 x 10");
var ri2 = Mo.resolveInfo({ mag: 26, angle: Math.atan2(10, 24) * 180 / Math.PI });
ok(ri2.triple && ri2.triple.c === 13 && approx(ri2.triple.scale, 2), "resolve: 5-12-13 x 2 detected");
var ri3 = Mo.resolveInfo({ mag: 50, angle: 40 });
ok(ri3.triple === null, "resolve: a non-triple angle is not claimed as a triple");
ok(approx(ri.fx * ri.fx + ri.fy * ri.fy, 2500, 1e-6), "resolve: components recombine (Pythagoras)");

var sr = Mo.scoreResolve({ fx: 30, fy: 40 }, { mag: 50, angle: Math.atan2(40, 30) * 180 / Math.PI });
ok(sr.marksAwarded === 2 && sr.status === "full", "scoreResolve: correct pair full marks");
var sr2 = Mo.scoreResolve({ fx: 40, fy: 30 }, { mag: 50, angle: Math.atan2(40, 30) * 180 / Math.PI });
ok(sr2.marksAwarded === 0 && sr2.errorCodes.indexOf("sin_cos_swapped") >= 0, "scoreResolve: swap caught and coded");
var sr3 = Mo.scoreResolve({ fx: 50, fy: 40 }, { mag: 50, angle: Math.atan2(40, 30) * 180 / Math.PI });
ok(sr3.errorCodes.indexOf("magnitude_unresolved") >= 0, "scoreResolve: gave F itself for a component");

/* ---- wave 2: direction references ---- */
ok(approx(Mo.directionFromReference(53, "above_horizontal"), 53) &&
   approx(Mo.directionFromReference(37, "right_of_vertical"), 53),
   "direction: 37 right of vertical = 53 above horizontal");

/* ---- wave 2: staged scale-drawing scorer ---- */
var SD = { vectors: [{ mag: 30, angle: 0 }, { mag: 40, angle: 90 }] };
var p1 = Mo.scoreScaleDrawing({ scale: 10, legs: [[3, 0], [0, 4]], length_cm: 5,
  magnitude: 50, angle: 53, reference: "above_horizontal" }, SD);
ok(p1.marksAwarded === 4 && p1.status === "full", "scaleDrawing: perfect run 4/4");
var p1b = Mo.scoreScaleDrawing({ scale: 10, legs: [[0, 4], [3, 0]], length_cm: 5,
  magnitude: 50, angle: 37, reference: "right_of_vertical" }, SD);
ok(p1b.marksAwarded === 4, "scaleDrawing: legs in the other order + vertical reference also 4/4");
var p2 = Mo.scoreScaleDrawing({ scale: 20, legs: [[3, 0], [0, 4]], length_cm: 5,
  magnitude: 100, angle: 53, reference: "above_horizontal" }, SD);
ok(p2.errorCodes.indexOf("legs_wrong") >= 0, "scaleDrawing: drawing that ignores the chosen scale caught");
ok(p2.marksAwarded >= 2, "scaleDrawing: but measuring + converting THEIR drawing still earns (ECF)");
var p3 = Mo.scoreScaleDrawing({ scale: 10, legs: [[3, 0], [0, 4]], length_cm: 5,
  magnitude: 70, angle: 53, reference: "above_horizontal" }, SD);
ok(p3.errorCodes.indexOf("scalar_sum_given") >= 0, "scaleDrawing: 70 (added magnitudes) coded");
var p4 = Mo.scoreScaleDrawing({ scale: 10, legs: [[3, 0], [0, 4]], length_cm: 5,
  magnitude: 50, angle: 53, reference: "right_of_vertical" }, SD);
ok(p4.errorCodes.indexOf("reference_mismatch") >= 0, "scaleDrawing: right angle, wrong stated reference");
var p5 = Mo.scoreScaleDrawing({ scale: 10, legs: [[3, 0], [0, 4]], length_cm: 5,
  magnitude: 50, angle: 127, reference: "above_horizontal" }, SD);
ok(p5.errorCodes.indexOf("wrong_protractor_scale") >= 0, "scaleDrawing: 127 = other protractor scale coded");
var p6 = Mo.scoreScaleDrawing({ scale: 10, legs: [[3, 0], [0, 4]], length_cm: 4.2,
  magnitude: 42, angle: 53, reference: "above_horizontal" }, SD);
ok(p6.errorCodes.indexOf("length_misread") >= 0 &&
   p6.hits.join(" ").indexOf("converted with your scale") >= 0,
   "scaleDrawing: misread length loses the measure mark but the conversion still follows (ECF)");

/* ---- partial axes overrides ---- */
var mA = Mo.mergeAxes({ xmax: 40, xstep: 5, ymax: 14, ystep: 2, minorDiv: 4, ylabel: "v" }, { ymax: 20 });
ok(mA.ymax === 20 && mA.xstep === 5 && mA.ylabel === "v", "mergeAxes: override one field, keep the rest");
ok(Mo.mergeAxes({ a: 1 }, null).a === 1, "mergeAxes: no override is a no-op");

console.log("\n" + passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
