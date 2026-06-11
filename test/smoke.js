/* Trilogy Physics — headless smoke test for the blended engine.
   Run:  node test/smoke.js   (from the repo root)
   Exercises the pure graders, servability/tier filter, event shape, and the
   diagram registry, without a browser DOM. */

"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// ── minimal browser-global stubs ────────────────────────────────────────────
const store = {};
globalThis.window = globalThis;
globalThis.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; }
};
globalThis.location = { search: "" };
globalThis.console = console;

function load(rel) {
  const p = path.join(__dirname, "..", "app", rel);
  vm.runInThisContext(fs.readFileSync(p, "utf8"), { filename: rel });
}

load("diagrams.js");
load("engine.js");
load("calc_workings.js");
vm.runInThisContext(fs.readFileSync(path.join(__dirname,"..","data","misconceptions.js"),"utf8"));

const T = window.TRILOGY_ENGINE_TEST;
const D = window.TrilogyDiagrams;

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; console.log("  ok   " + name); }
  else { fail++; console.log("  FAIL " + name); }
}
function eq(name, a, b) { ok(name + " (" + JSON.stringify(a) + " === " + JSON.stringify(b) + ")", a === b); }

console.log("\nMCQ grader (choices + answerIndex)");
const mcq = { qtype: "mcq", choices: [{text:"a"},{text:"b"},{text:"c"}], answerIndex: 0 };
eq("correct pick", T.gradeMcq(mcq, [0]), "correct");
eq("wrong pick", T.gradeMcq(mcq, [1]), "wrong");
eq("empty", T.gradeMcq(mcq, []), "wrong");

const multi = { qtype: "mcq_multi", choices: [{text:"a"},{text:"b"},{text:"c"}], answerIndices: [0,1] };
eq("multi all correct", T.gradeMcq(multi, [0,1]), "correct");
eq("multi partial -> half", T.gradeMcq(multi, [0]), "half");
eq("multi includes wrong", T.gradeMcq(multi, [0,2]), "wrong");

console.log("\nShort grader (markPoints keyword presence)");
const short = { qtype: "short", markPoints: [ {any:["high voltage","step up"]}, {any:["low current","lower current"]} ] };
eq("all points -> correct", T.gradeShort(short, "a high voltage gives a lower current").status, "correct");
eq("one point -> half", T.gradeShort(short, "use a high voltage").status, "half");
eq("no points -> wrong", T.gradeShort(short, "because physics").status, "wrong");

console.log("\ncalc_workings grader (tolerance path)");
const calc = { qtype: "calc_workings", calc: { answer: { value: 12, unit: "ohm", tolerance: 0.02 } } };
eq("exact", T.gradeCalcWorkings(calc, "12").status, "correct");
eq("within tol", T.gradeCalcWorkings(calc, "12.1").status, "correct");
eq("near miss -> half", T.gradeCalcWorkings(calc, "12.4").status, "half");
eq("far -> wrong", T.gradeCalcWorkings(calc, "6").status, "wrong");
eq("non-numeric -> wrong", T.gradeCalcWorkings(calc, "abc").status, "wrong");

console.log("\nlevel_of_response_6 grader (banded claim-points)");
const lor = { marks: 6, lor: { points: [
  {creditworthy:true},{creditworthy:true},{creditworthy:true},{creditworthy:true},{creditworthy:true},
  {creditworthy:false},{creditworthy:false} ] } };
eq("all 5 creditworthy -> 6/6 full", (function(){var r=T.gradeLor(lor,[0,1,2,3,4]);return r.marks+"/"+r.status;})(), "6/full");
eq("3 creditworthy -> partial", T.gradeLor(lor,[0,1,2]).status, "partial");
eq("only wrong points -> none", T.gradeLor(lor,[5,6]).status, "none");
ok("a wrong pick costs a mark (net)", T.gradeLor(lor,[0,1,2,5]).net === 2);

console.log("\nServability + tier filter (SCHEMA v1.0 F|H|FH)");
T.setPrefsTier("all");
ok("mcq servable", T.isServable({ qtype: "mcq", choices: [] }));
ok("mcq_multi servable", T.isServable({ qtype: "mcq_multi", choices: [] }));
ok("unknown qtype not servable", !T.isServable({ qtype: "drag_drop" }));
T.setPrefsTier("F");
ok("H item hidden at F", !T.isServable({ qtype: "mcq", tier: "H" }));
ok("FH item shown at F", T.isServable({ qtype: "mcq", tier: "FH" }));
ok("F item shown at F", T.isServable({ qtype: "mcq", tier: "F" }));
ok("legacy 'higher' normalises to H (hidden at F)", !T.isServable({ qtype: "mcq", tier: "higher" }));
T.setPrefsTier("all");

console.log("\nEvent shape (atoms[] + subtag + fire/avoid)");
const item = { id: "q1", topic: "6.2", subtag: "series_parallel",
  atoms: ["series_resistance_sum"], qtype: "mcq", tier: "H", syllabus_codes: ["6.2.1.4"],
  choices: [ {text:"a"}, {text:"b", misconception_id:"swapped_series_parallel"} ], answerIndex: 0,
  applicable_misconceptions: ["topology_indifferent_assumption"] };
const ev = T.buildEvent(item, 1, "wrong", "swapped_series_parallel", "6.2");
eq("event topic", ev.topic, "6.2");
ok("event atoms[] carries the atom", ev.atoms.indexOf("series_resistance_sum") !== -1);
eq("event subtag", ev.subtag, "series_parallel");
eq("event tier normalised", ev.tier, "H");
eq("event misconception", ev.misconception_id, "swapped_series_parallel");
ok("slugs_offered = choice slugs + applicable",
   ev.slugs_offered.indexOf("swapped_series_parallel") !== -1 && ev.slugs_offered.indexOf("topology_indifferent_assumption") !== -1);

console.log("\nGreenness bucketing");
eq("no events -> grey", T.greennessBucket([], 5), "grey");
eq("all correct -> green", T.greennessBucket([{status:"correct"},{status:"correct"}], 5), "green");
eq("all wrong -> red", T.greennessBucket([{status:"wrong"},{status:"wrong"}], 5), "red");

console.log("\ncalc_workings marks-the-method grader (verbatim Pre-IB lift)");
const CW = window.TrilogyCalcWorkings;
ok("module loaded", CW && typeof CW.markCalcWorkings === "function");
const cwq = { knowns: { V: 6.0, I: 0.5 }, unknown: "R", expectedFinalValue: 12,
  expectedUnit: ["\u03a9", "ohm"], equationCanonicalForms: ["R=V/I"], requireUnit: true, marks: 4 };
const perfect = CW.markCalcWorkings(cwq, { line1: "R = V / I", line2: "R = 6.0 / 0.5", line3: "R = 12", line4Value: "12", line4Unit: "\u03a9" });
eq("perfect -> 4/4 full", perfect.marksAwarded + "/" + perfect.status, "4/full");
const nounit = CW.markCalcWorkings(cwq, { line1: "R = V / I", line2: "R = 6.0 / 0.5", line3: "R = 12", line4Value: "12", line4Unit: "" });
eq("missing unit -> 3/4 partial", nounit.marksAwarded + "/" + nounit.status, "3/partial");
ok("missing unit error code", nounit.errorTypes.indexOf("unit_missing") !== -1);
const wrongm = CW.markCalcWorkings(cwq, { line1: "R = V * I", line2: "R = 6.0 * 0.5", line3: "R = 3", line4Value: "3", line4Unit: "\u03a9" });
eq("wrong method -> 0/4 none", wrongm.marksAwarded + "/" + wrongm.status, "0/none");
ok("wrong method error codes", wrongm.errorTypes.indexOf("equation_wrong") !== -1 && wrongm.errorTypes.indexOf("value_wrong") !== -1);
const rearr = CW.markCalcWorkings({ knowns:{V:6,I:0.5}, unknown:"R", expectedFinalValue:12, expectedUnit:["\u03a9"], equationCanonicalForms:["R=V/I"], requireUnit:true },
  { line1:"R = V / I", line2:"6 = R * 0.5", line3:"R = 12", line4Value:"12", line4Unit:"\u03a9" });
ok("accepts algebraically-equivalent substitution", rearr.marksAwarded >= 3);

console.log("\nCanonical misconception registry (data/misconceptions.js)");
const REG = window.TRILOGY_MISCONCEPTIONS || [];
ok("registry loaded (40+ slugs)", REG.length >= 40);
const slugs = REG.map(function (m) { return m.slug; });
ok("retired slug absent (wrong_power_form_for_topology)", slugs.indexOf("wrong_power_form_for_topology") === -1);
ok("out-of-scope reciprocal slug absent (forgot_final_reciprocal)", slugs.indexOf("forgot_final_reciprocal") === -1);
ok("NEW_FLAG present (diode_reverse_current_nonzero)", slugs.indexOf("diode_reverse_current_nonzero") !== -1);
ok("every entry has slug+label+topic", REG.every(function (m) { return m.slug && m.label && m.topic; }));

console.log("\nChained multi-stage calc_workings grader (d047, ECF)");
const chainItem = { marks: 4, calc: { stages: [
  { equation: "P=V*I", knowns: { V: 12, I: 0.5 }, unknown: "P", expectedFinalValue: 6, expectedUnit: ["W"],
    markScheme: [{mark:1},{mark:2}] },
  { equation: "E=P*t", knowns: { P: 6, t: 120 }, unknown: "E", expectedFinalValue: 720, expectedUnit: ["J"],
    gate: { kind: "from_previous_part" }, markScheme: [{mark:3},{mark:4}] }
] } };
const allRight = [
  { line1: "P=V*I", line2: "P=12*0.5", line3: "P=6", line4Value: "6", line4Unit: "W" },
  { line1: "E=P*t", line2: "E=6*120", line3: "E=720", line4Value: "720", line4Unit: "J" }
];
const rc = T.markCalcChain(chainItem, allRight);
eq("fully-correct chain -> 4/4 full", rc.marks + "/" + rc.status, "4/full");
const stage2blank = [ allRight[0], { line1: "", line2: "", line3: "", line4Value: "", line4Unit: "" } ];
const rb = T.markCalcChain(chainItem, stage2blank);
eq("stage 1 right, stage 2 blank -> 2/4 partial", rb.marks + "/" + rb.status, "2/partial");
// ECF: wrong stage-1 value carried, but stage-2 method consistent with the carried value
const ecf = [
  { line1: "P=V*I", line2: "P=12*0.5", line3: "P=5", line4Value: "5", line4Unit: "W" },  // wrong eval (5 not 6)
  { line1: "E=P*t", line2: "E=5*120", line3: "E=600", line4Value: "600", line4Unit: "J" } // consistent with carried 5
];
ok("ECF: consistent stage-2 working on a carried wrong value still earns stage-2 marks", T.markCalcChain(ecf.length?chainItem:chainItem, ecf).stages[1].awarded >= 1);

console.log("\nGeneric fallback self-check (d047)");
T.setPrefsTier("all");
ok("unknown qtype with fallback IS servable", T.isServable({ qtype: "graph_sketch", fallback: { mode: "self_check" } }));
ok("unknown qtype without fallback is NOT servable", !T.isServable({ qtype: "graph_sketch" }));
eq("ungraded self-assessed does not count toward accuracy",
   T.greennessBucket([{ status: "correct", grading: "ungraded_self_assessed" }], 5), "grey");
eq("graded events still bucket normally",
   T.greennessBucket([{ status: "correct" }, { status: "correct" }], 5), "green");

console.log("\nMagnetism 6.7 migrated bank (generated config)");
globalThis.location = { search: "" };
vm.runInThisContext(fs.readFileSync(path.join(__dirname,"..","app","topics","magnetism_6_7.generated.js"),"utf8"));
const M67 = window.TRILOGY_TOPICS["6.7"];
ok("6.7 config present", !!M67 && Array.isArray(M67.items));
ok("~160 items migrated", M67.items.length >= 150);
T.setPrefsTier("all");
ok("every migrated item is servable", M67.items.every(T.isServable));
ok("flagged provisional vocab", M67.provisional_vocab === true);
ok("every item flags Authoring judgment", M67.items.every(it => it._authoring && Array.isArray(it._authoring.needs)));
const m = M67.items.find(it => it.qtype === "mcq");
eq("a migrated mcq grades correct", T.gradeMcq(m, [m.answerIndex]), "correct");
const cw = M67.items.find(it => it.qtype === "calc_workings");
eq("a migrated numeric->calc grades", T.gradeCalcWorkings(cw, String(cw.calc.answer.value)).status, "correct");

console.log("\nDiagram registry");
ok("registry has circuit kind", D.kinds().indexOf("circuit") !== -1);
ok("unknown kind renders null", D.render({ kind: "iv_characteristic" }) === null);
ok("circuit without CircuitBuilder -> null (no throw)", D.render({ kind: "circuit", dsl: "2cb,sc,r" }) === null);

console.log("\n" + pass + " passed, " + fail + " failed.\n");
process.exit(fail ? 1 : 0);
