/* Headless physics assertions for MagnetismModels (no DOM).
   Run: node verify_magnetism_models.js                                  */
function makeEl(ns, tag) {
  return { nodeName: tag, attrs: {}, children: [], _text: null, style: {},
    setAttribute: function (k, v) { this.attrs[k] = v; },
    appendChild: function (c) { this.children.push(c); return c; },
    set textContent(t) { this._text = t; },
    get textContent() { return this._text; } };
}
global.document = { createElementNS: function (ns, tag) { return makeEl(ns, tag); } };
global.window = global.window || {};

var M = require("./magnetism-diagrams.js").Models;
var reg = require("./magnetism-diagrams.js").registry;

var passed = 0, failed = 0;
function ok(cond, name) {
  if (cond) { passed++; }
  else { failed++; console.error("FAIL: " + name); }
}
function eq(a, b, name) { ok(a === b, name + " (got " + JSON.stringify(a) + ", want " + JSON.stringify(b) + ")"); }

/* ---- Fleming's left-hand rule: F = IL x B ---------------------------- */
eq(M.flhr("out", "right"), "up",    "FLHR: I out, B right -> F up");
eq(M.flhr("in",  "right"), "down",  "FLHR: I in, B right -> F down");
eq(M.flhr("out", "left"),  "down",  "FLHR: I out, B left -> F down");
eq(M.flhr("in",  "left"),  "up",    "FLHR: I in, B left -> F up");
eq(M.flhr("up",  "right"), "in",    "FLHR: I up, B right -> F into page");
eq(M.flhr("down","right"), "out",   "FLHR: I down, B right -> F out of page");
eq(M.flhr("right","right"), null,   "FLHR: I parallel to B -> zero force");
eq(M.flhr("left", "right"), null,   "FLHR: I antiparallel to B -> zero force");
eq(M.opposite("up"), "down", "opposite up");
eq(M.opposite("in"), "out",  "opposite in");

/* ---- grip rule and wire circles --------------------------------------- */
eq(M.wireCirculation("out"), "anticlockwise", "grip: out -> anticlockwise (viewer)");
eq(M.wireCirculation("in"),  "clockwise",     "grip: in -> clockwise (viewer)");
var rr = M.wireRadii(4);
ok(rr.length === 4, "wireRadii: 4 circles");
ok(rr[1] - rr[0] < rr[2] - rr[1] && rr[2] - rr[1] < rr[3] - rr[2],
   "wireRadii: spacing GROWS with distance (B ~ 1/r)");
var re = M.wireRadii(4, "equal_spacing");
ok(Math.abs((re[1] - re[0]) - (re[3] - re[2])) < 1e-9, "wireRadii distractor: equal spacing");

/* ---- solenoid and induction ------------------------------------------- */
eq(M.solenoidNEnd("out"), "right", "solenoid: dots on top -> N at right");
eq(M.solenoidNEnd("in"),  "left",  "solenoid: crosses on top -> N at left");
eq(M.inducedPole("N"), "S", "induced: near face opposite (N induces S)");
eq(M.inducedPole("S"), "N", "induced: near face opposite (S induces N)");
ok(M.inducedRetains("steel") === true,  "steel keeps induced magnetism");
ok(M.inducedRetains("iron") === false,  "soft iron loses induced magnetism");

/* ---- materials --------------------------------------------------------- */
["iron", "steel", "cobalt", "nickel"].forEach(function (m) {
  ok(M.isMagnetic(m) === true, m + " is magnetic");
});
["copper", "aluminium", "plastic", "wood", "brass"].forEach(function (m) {
  ok(M.isMagnetic(m) === false, m + " is NOT magnetic");
});

/* ---- dipole field ------------------------------------------------------ */
/* magnet centred at origin, N pole to the LEFT: moment m = (-1, 0).      */
var ax = M.dipoleFieldAt(-100, 0, 0, 0, -1, 0);
ok(ax.bx < -0.99, "dipole: on the axis beyond N, field points AWAY (out of N)");
var ax2 = M.dipoleFieldAt(100, 0, 0, 0, -1, 0);
ok(ax2.bx < -0.99, "dipole: on the axis beyond S, field points INTO S");
var eqt = M.dipoleFieldAt(0, 100, 0, 0, -1, 0);
ok(eqt.bx > 0.99, "dipole: on the equator, field antiparallel to the moment");
var nearP = M.dipoleFieldAt(-70, 0, 0, 0, -1, 0), farP = M.dipoleFieldAt(-140, 0, 0, 0, -1, 0);
ok(nearP.mag > farP.mag * 5, "dipole: much stronger near the pole (1/r^3)");

/* ---- d.c. motor --------------------------------------------------------- */
var m0 = M.motorForces(0, "right");
eq(m0.A, "up",   "motor: side A (current out), field right -> force up");
eq(m0.B, "down", "motor: side B (current in) -> force down");
ok(m0.torqueFactor > 0.99 && !m0.atDeadPoint, "motor: coil horizontal -> max turning effect");
var m90 = M.motorForces(90, "right");
ok(m90.atDeadPoint, "motor: coil vertical -> zero turning effect (commutator moment)");
eq(m90.A, "up", "motor: forces stay VERTICAL at 90 deg (do not rotate with coil)");
var m45 = M.motorForces(45, "right");
ok(Math.abs(m45.torqueFactor - Math.SQRT1_2) < 1e-9, "motor: 45 deg -> cos(45) of max torque");

/* ---- scorers (Housing contract shapes) --------------------------------- */
var s1 = M.scoreDirection({ direction: "up" }, { expected: "up", marks: 1 });
ok(s1.status === "full" && s1.marksAwarded === 1, "scoreDirection: correct = full");
var s2 = M.scoreDirection({ direction: "down" }, { expected: "up" });
ok(s2.status === "none" && s2.errorCodes.indexOf("direction_reversed") >= 0,
   "scoreDirection: opposite -> direction_reversed");
var s3 = M.scoreDirection({ direction: "right" }, { expected: "up", field: "right", current: "out" });
ok(s3.errorCodes.indexOf("gave_field_direction") >= 0, "scoreDirection: parroted the field");
var s4 = M.scorePoles({ poles: { left: "S", right: "N" } }, { expected: { left: "S", right: "N" } });
ok(s4.status === "full" && s4.marksAwarded === 2, "scorePoles: both right = full");
var s5 = M.scorePoles({ poles: { left: "N", right: "S" } }, { expected: { left: "S", right: "N" } });
ok(s5.status === "none" && s5.errorCodes.indexOf("poles_reversed") >= 0,
   "scorePoles: both swapped -> poles_reversed");
var s6 = M.scorePoles({ poles: { left: "S", right: "S" } }, { expected: { left: "S", right: "N" } });
ok(s6.status === "partial" && s6.marksAwarded === 1, "scorePoles: one right = partial");

/* ---- two-pole field tracer (bar_magnet_field correctness) -------------- */
/* N pole at (140,125), S at (220,125): the renderer's canonical layout.  */
var NP = [140, 125], SP = [220, 125];
var above = M.twoPoleFieldAt(180, 50, NP[0], NP[1], SP[0], SP[1]);
ok(above.bx > 0.9, "two-pole field above the magnet points N-side to S-side");
var offN = M.twoPoleFieldAt(110, 125, NP[0], NP[1], SP[0], SP[1]);
ok(offN.bx < -0.99, "two-pole field beyond N points away along the axis");
var apexes = [];
[64, 76, 88].forEach(function (phi) {
  var a = (180 - phi) * Math.PI / 180;
  var t = M.traceFieldLine(NP[0] + 24 * Math.cos(a), 125 - 24 * Math.sin(a),
    { nPole: NP, sPole: SP, capture: 24, bounds: [-50, -80, 470, 440] });
  ok(t.closed, "loop launched at " + phi + " deg closes onto the S pole");
  var last = t.pts[t.pts.length - 1];
  ok(Math.abs(last[1] - 125) < 26 && last[0] > 185, "loop " + phi + " ends AT the S pole face");
  var minY = 1e9, j, apexI = 0;
  for (j = 0; j < t.pts.length; j++) if (t.pts[j][1] < minY) { minY = t.pts[j][1]; apexI = j; }
  apexes.push(minY);
  var dirx = t.pts[apexI + 1][0] - t.pts[apexI - 1][0];
  ok(dirx > 0, "loop " + phi + ": field at the apex runs N-side to S-side");
});
ok(apexes[0] < apexes[1] && apexes[1] < apexes[2],
   "loops NEST (shallower launch = bigger loop): they cannot cross");
var mirror = M.traceFieldLine(140 + 24 * Math.cos((180 - 76) * Math.PI / 180),
  125 + 24 * Math.sin((180 - 76) * Math.PI / 180),
  { nPole: NP, sPole: SP, capture: 24, bounds: [-50, -80, 470, 440] });
ok(mirror.closed, "lower-side loop closes too (up/down symmetric)");

/* ---- body-aware tracing (Smith: lines must STOP AT the magnet) --------- */
/* bar layout: body [155,148,265,192], poles (170,170)/(250,170)          */
var BODY = [155, 148, 265, 192], NP2 = [170, 170], SP2 = [250, 170];
function onRectEdge(pt, r) {
  var e = 0.9;
  var onV = (Math.abs(pt[0] - r[0]) < e || Math.abs(pt[0] - r[2]) < e) && pt[1] > r[1] - e && pt[1] < r[3] + e;
  var onH = (Math.abs(pt[1] - r[1]) < e || Math.abs(pt[1] - r[3]) < e) && pt[0] > r[0] - e && pt[0] < r[2] + e;
  return onV || onH;
}
[64, 76, 88].forEach(function (phi) {
  var a = (180 - phi) * Math.PI / 180;
  var ang = Math.atan2(-Math.sin(a), Math.cos(a));
  var sd = M.rayRectExit(NP2, ang, BODY);
  ok(onRectEdge(sd, BODY), "loop " + phi + ": seed sits ON the magnet surface");
  var t = M.traceFieldLine(sd[0] + Math.cos(ang) * 0.6, sd[1] + Math.sin(ang) * 0.6,
    { nPole: NP2, sPole: SP2, bounds: [12, 10, 408, 330], stopRects: [BODY] });
  ok(t.closed && onRectEdge(t.pts[t.pts.length - 1], BODY),
     "loop " + phi + ": far end snapped ON the magnet surface, not short, not inside");
});
var sdAx = M.rayRectExit(NP2, Math.PI, BODY);
ok(Math.abs(sdAx[0] - 155) < 1e-9 && Math.abs(sdAx[1] - 170) < 1e-9,
   "axial line starts exactly at the centre of the pole face");

/* two magnets: attract gap line connects FACE TO FACE; repel has a real
   neutral point and the axial stub dies there                            */
var RL2 = [40, 128, 140, 172], RR2 = [300, 128, 400, 172];
var ATT = [[52, 150, -1], [128, 150, 1], [312, 150, -1], [388, 150, 1]];
var FA = function (x, y) { return M.multiPoleFieldAt(x, y, ATT); };
var gx = M.rayRectExit([128, 150], 0, RL2);
var tg = M.traceFieldLine(gx[0] + 0.6, gx[1], { field: FA, stopRects: [RL2, RR2], bounds: [10, 8, 430, 292] });
ok(Math.abs(gx[0] - 140) < 1e-9, "attract: gap line starts ON the left magnet's N face");
ok(tg.closed && Math.abs(tg.pts[tg.pts.length - 1][0] - 300) < 0.9,
   "attract: gap line ends ON the right magnet's S face");
var mid = M.multiPoleFieldAt(220, 150, ATT);
ok(mid.bx > 0.99, "attract: field at mid-gap points N-side to S-side");
var REP = [[52, 150, -1], [128, 150, 1], [312, 150, 1], [388, 150, -1]];
ok(M.multiPoleFieldAt(220, 150, REP).mag < 1e-8, "repel N-N: mid-gap field is ZERO (neutral point)");
var FR = function (x, y) { return M.multiPoleFieldAt(x, y, REP); };
var tr2 = M.traceFieldLine(140.6, 150, { field: FR, stopRects: [RL2, RR2], bounds: [10, 8, 430, 292], minField: 9e-6 });
var lastR = tr2.pts[tr2.pts.length - 1];
ok(lastR[0] < 219 && lastR[0] > 175, "repel: the axial stub DIES AT the neutral point (does not cross it)");

/* ---- d042 interactive wrappers (engine re-scores through these) -------- */
var w1 = M.scoreFlhrDirection({ direction: "up" }, { current: "out", field: "right" });
ok(w1.status === "full", "scoreFlhrDirection: expected DERIVED from FLHR (out,right -> up)");
var w2 = M.scoreFlhrDirection({ direction: "down" }, { current: "out", field: "right" });
ok(w2.errorCodes.indexOf("direction_reversed") >= 0, "scoreFlhrDirection: reversal coded");
var w3 = M.scoreFlhrDirection({ direction: "clockwise" }, { circulation: true, current: "out" });
ok(w3.status === "none" && w3.errorCodes.indexOf("direction_reversed") >= 0,
   "scoreFlhrDirection circulation: out is anticlockwise; clockwise = reversal");
var w4 = M.scoreFlhrDirection({ direction: "anticlockwise" }, { circulation: true, current: "out" });
ok(w4.status === "full", "scoreFlhrDirection circulation: correct sense = full");
var ep1 = M.expectedPoles({ stimulus: { kind: "solenoid_field", params: {} } });
ok(ep1.left === "S" && ep1.right === "N", "expectedPoles: solenoid dots-on-top -> S left, N right");
var ep2 = M.expectedPoles({ stimulus: { kind: "solenoid_field", params: { top_current: "in" } } });
ok(ep2.left === "N" && ep2.right === "S", "expectedPoles: reversed current flips the ends");
var ep3 = M.expectedPoles({ stimulus: { kind: "induced_magnetism", params: { pole: "N" } } });
ok(ep3.near === "S" && ep3.far === "N", "expectedPoles: induced nail, opposite near");
var w5 = M.scoreMarkPoles({ poles: { near: "N", far: "S" } },
  { stimulus: { kind: "induced_magnetism", params: { pole: "N" } },
    errorCodeMap: { poles_reversed: "induced_magnet_expected_to_repel" } });
ok(w5.status === "none" && w5.errorCodes.indexOf("induced_magnet_expected_to_repel") >= 0,
   "scoreMarkPoles: errorCodeMap re-homes poles_reversed onto the registered subject slug");
var w6 = M.scoreMarkPoles({ poles: { left: "S", right: "N" } },
  { stimulus: { kind: "solenoid_field", params: {} } });
ok(w6.status === "full" && w6.marksAwarded === 2, "scoreMarkPoles: solenoid both right = full");
eq(M.opposite("clockwise"), "anticlockwise", "opposite handles circulation senses");

/* ---- registry completeness --------------------------------------------- */
["bar_magnet_field", "uniform_field", "two_magnets_field", "solenoid_field",
 "electromagnet", "induced_magnetism", "magnetic_materials", "compass",
 "field_mapping", "wire_field", "flemings_lhr", "motor_effect_setup",
 "dc_motor"].forEach(function (k) {
  ok(typeof reg[k] === "function", "registry has " + k);
  var node = reg[k]({});
  ok(node && node.nodeName === "svg", k + "({}) renders an <svg>");
});

["flhr_direction", "mark_poles"].forEach(function (k) {
  ok(typeof require("./magnetism-diagrams.js").interactive[k] === "function",
     "interactive registry has " + k);
});

console.log(passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
