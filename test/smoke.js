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

console.log("\nDiagram registry");
ok("registry has circuit kind", D.kinds().indexOf("circuit") !== -1);
ok("unknown kind renders null", D.render({ kind: "iv_characteristic" }) === null);
ok("circuit without CircuitBuilder -> null (no throw)", D.render({ kind: "circuit", dsl: "2cb,sc,r" }) === null);

console.log("\n" + pass + " passed, " + fail + " failed.\n");
process.exit(fail ? 1 : 0);
