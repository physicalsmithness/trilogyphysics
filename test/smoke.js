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

const T = window.TRILOGY_ENGINE_TEST;
const D = window.TrilogyDiagrams;

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; console.log("  ok   " + name); }
  else { fail++; console.log("  FAIL " + name); }
}
function eq(name, a, b) { ok(name + " (" + JSON.stringify(a) + " === " + JSON.stringify(b) + ")", a === b); }

console.log("\nMCQ grader");
const mcq = { qtype: "mcq_single", distractors: [
  { id: "a", status: "correct" }, { id: "b", status: "wrong", misconception: "x" },
  { id: "c", status: "wrong" } ] };
eq("correct pick", T.gradeMcq(mcq, ["a"]), "correct");
eq("wrong pick", T.gradeMcq(mcq, ["b"]), "wrong");
eq("empty", T.gradeMcq(mcq, []), "wrong");

const multi = { qtype: "mcq_multi", distractors: [
  { id: "a", status: "correct" }, { id: "b", status: "correct" },
  { id: "c", status: "wrong" } ] };
eq("multi all correct", T.gradeMcq(multi, ["a", "b"]), "correct");
eq("multi partial -> half", T.gradeMcq(multi, ["a"]), "half");
eq("multi includes wrong", T.gradeMcq(multi, ["a", "c"]), "wrong");

console.log("\nClaims (short) grader");
const short = { qtype: "short", claims: [
  { id: "a", correct: true }, { id: "b", correct: true },
  { id: "c", correct: false, misconception: "confused_v_and_i" } ] };
eq("all right", T.gradeClaims(short, ["a", "b"]), "correct");
eq("some right none wrong -> half", T.gradeClaims(short, ["a"]), "half");
eq("picked a wrong claim", T.gradeClaims(short, ["a", "c"]), "wrong");

console.log("\ncalc_workings grader (tolerance path)");
const calc = { qtype: "calc_workings", calc: { answer: { value: 12, unit: "ohm", tolerance: 0.02 } } };
eq("exact", T.gradeCalcWorkings(calc, "12").status, "correct");
eq("within tol", T.gradeCalcWorkings(calc, "12.1").status, "correct");
eq("near miss -> half", T.gradeCalcWorkings(calc, "12.4").status, "half");
eq("far -> wrong", T.gradeCalcWorkings(calc, "6").status, "wrong");
eq("non-numeric -> wrong", T.gradeCalcWorkings(calc, "abc").status, "wrong");

console.log("\nServability + tier filter (d005)");
T.setPrefsTier("both");
ok("known mcq servable", T.isServable({ qtype: "mcq_single", distractors: [] }));
ok("unknown qtype not servable", !T.isServable({ qtype: "drag_drop" }));
T.setPrefsTier("foundation");
ok("higher item hidden at foundation", !T.isServable({ qtype: "mcq_single", tier: "higher" }));
ok("both-tier item shown at foundation", T.isServable({ qtype: "mcq_single", tier: "both" }));
ok("foundation item shown at foundation", T.isServable({ qtype: "mcq_single", tier: "foundation" }));
T.setPrefsTier("both");

console.log("\nEvent shape (d004 atom + fire/avoid)");
const item = { id: "q1", topic: "6.2", atom: "series", qtype: "mcq_single",
  distractors: [ { id: "a", status: "correct" },
                 { id: "b", status: "wrong", misconception: "series_parallel_swapped" } ] };
const ev = T.buildEvent(item, "b", "wrong", "series_parallel_swapped", "6.2");
eq("event topic", ev.topic, "6.2");
eq("event atom", ev.atom, "series");
eq("event misconception", ev.misconception_id, "series_parallel_swapped");
ok("slugs_offered captured", Array.isArray(ev.slugs_offered) && ev.slugs_offered.indexOf("series_parallel_swapped") !== -1);

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

console.log("\nDiagram registry");
ok("registry has circuit kind", D.kinds().indexOf("circuit") !== -1);
ok("unknown kind renders null", D.render({ kind: "iv_characteristic" }) === null);
ok("circuit without CircuitBuilder -> null (no throw)", D.render({ kind: "circuit", dsl: "2cb,sc,r" }) === null);

console.log("\n" + pass + " passed, " + fail + " failed.\n");
process.exit(fail ? 1 : 0);
