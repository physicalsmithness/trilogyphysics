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

/* ---- registry completeness --------------------------------------------- */
["bar_magnet_field", "uniform_field", "two_magnets_field", "solenoid_field",
 "electromagnet", "induced_magnetism", "magnetic_materials", "compass",
 "field_mapping", "wire_field", "flemings_lhr", "motor_effect_setup",
 "dc_motor"].forEach(function (k) {
  ok(typeof reg[k] === "function", "registry has " + k);
  var node = reg[k]({});
  ok(node && node.nodeName === "svg", k + "({}) renders an <svg>");
});

console.log(passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
