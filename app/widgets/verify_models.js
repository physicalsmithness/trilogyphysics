/* Pure-maths physics assertions for the Trilogy 6.2 widget Models.
   No DOM. Run: node verify_models.js */
var M = require("./topic-diagrams.js").Models;
var fails = 0, pass = 0;
function ok(name, cond, detail) {
  if (cond) { pass++; console.log("  PASS " + name); }
  else { fails++; console.log("  FAIL " + name + (detail ? "  [" + detail + "]" : "")); }
}
function grad(f, V, h) { h = h || 1e-3; return (f(V + h) - f(V - h)) / (2 * h); }
function samples(a, b, n) { var r = [], i; for (i = 0; i <= n; i++) r.push(a + (b - a) * i / n); return r; }

console.log("iv.ohmic");
ok("through origin", Math.abs(M.iv.ohmic(0)) < 1e-9);
ok("odd symmetric", Math.abs(M.iv.ohmic(0.7) + M.iv.ohmic(-0.7)) < 1e-9);
(function () { var g0 = grad(M.iv.ohmic, 0.2), g1 = grad(M.iv.ohmic, 0.9);
  ok("constant gradient (linear)", Math.abs(g0 - g1) < 1e-6, "g0=" + g0 + " g1=" + g1); })();

console.log("iv.filament (CORRECT - the critical one)");
ok("through origin", Math.abs(M.iv.filament(0)) < 1e-9);
ok("odd symmetric", Math.abs(M.iv.filament(0.6) + M.iv.filament(-0.6)) < 1e-9);
(function () {
  var xs = samples(0.02, 1, 60), mono = true, conc = true, posGrad = true, i;
  for (i = 1; i < xs.length; i++) if (M.iv.filament(xs[i]) <= M.iv.filament(xs[i - 1])) mono = false;
  for (i = 1; i < xs.length; i++) if (grad(M.iv.filament, xs[i]) >= grad(M.iv.filament, xs[i - 1]) + 1e-9) conc = false;
  for (i = 0; i < xs.length; i++) if (grad(M.iv.filament, xs[i]) <= 0.02) posGrad = false;
  ok("strictly increasing (current keeps rising)", mono);
  ok("gradient strictly decreasing (curve flattens)", conc);
  ok("gradient stays clearly positive (never plateaus, never droops)", posGrad,
     "min grad=" + Math.min.apply(null, xs.map(function (v) { return grad(M.iv.filament, v); })).toFixed(3));
  ok("near-origin gradient >> high-V gradient (S-shape)", grad(M.iv.filament, 0.05) > 3 * grad(M.iv.filament, 0.95));
})();

console.log("iv.diode");
ok("zero for reverse bias", M.iv.diode(-0.8) === 0 && M.iv.diode(-0.2) === 0);
ok("near zero below threshold", M.iv.diode(0.3) < 0.05);
ok("steep rise past threshold", M.iv.diode(1) > 0.6 && M.iv.diode(0.9) > M.iv.diode(0.7) * 2);
(function () { var xs = samples(0.5, 1, 30), mono = true, i;
  for (i = 1; i < xs.length; i++) if (M.iv.diode(xs[i]) < M.iv.diode(xs[i - 1])) mono = false;
  ok("monotonic increasing in forward region", mono); })();

console.log("iv.filament_plateau (DISTRACTOR - must be wrongly flat)");
ok("visibly flat by mid-range (gradient small at V=0.7)", grad(M.iv.filament_plateau, 0.7) < 0.05,
   "g(0.7)=" + grad(M.iv.filament_plateau, 0.7).toFixed(3));
ok("dead flat at high V (gradient ~0 at V=0.95)", grad(M.iv.filament_plateau, 0.95) < 0.02,
   "g(0.95)=" + grad(M.iv.filament_plateau, 0.95).toFixed(3));

console.log("negative-gradient line DISTRACTORS");
ok("iv.negative_line has negative, constant gradient",
   grad(M.iv.negative_line, 0.3) < 0 && Math.abs(grad(M.iv.negative_line, 0.3) - grad(M.iv.negative_line, 0.8)) < 1e-6);
ok("rt.negative_line falls linearly (negative gradient)",
   M.rt.negative_line(0.1) > M.rt.negative_line(0.9) &&
   Math.abs(grad(M.rt.negative_line, 0.3) - grad(M.rt.negative_line, 0.7)) < 1e-6);

console.log("iv.filament_droop (DISTRACTOR - must droop down)");
(function () { var xs = samples(0.1, 1, 50), droops = false, i;
  for (i = 1; i < xs.length; i++) if (M.iv.filament_droop(xs[i]) < M.iv.filament_droop(xs[i - 1])) droops = true;
  ok("does droop (current falls at high V)", droops); })();

console.log("rt.thermistor / rt.metal_wire");
(function () { var xs = samples(0, 1, 40), dec = true, inc = true, i;
  for (i = 1; i < xs.length; i++) { if (M.rt.thermistor(xs[i]) >= M.rt.thermistor(xs[i - 1])) dec = false;
    if (M.rt.metal_wire(xs[i]) <= M.rt.metal_wire(xs[i - 1])) inc = false; }
  ok("thermistor (NTC) R decreases with temperature", dec);
  ok("metal wire R increases with temperature", inc); })();

console.log("rl.ldr");
(function () { var xs = samples(0, 1, 40), dec = true, i;
  for (i = 1; i < xs.length; i++) if (M.rl.ldr(xs[i]) >= M.rl.ldr(xs[i - 1])) dec = false;
  ok("LDR R decreases as light increases", dec); })();

console.log("trace.ac / trace.dc");
ok("ac oscillates about zero", M.trace.ac(0.0) < 0.05 && M.trace.ac(1 / 6) > 0.5 && M.trace.ac(0.5) < -0.5);
ok("dc constant", M.trace.dc(0) === M.trace.dc(0.9) && M.trace.dc(0) > 0);

console.log("\n" + pass + " passed, " + fails + " failed");
process.exit(fails ? 1 : 0);
