/* jsdom mount test for the 6.7 interactive widgets (d042 contract):
   mount -> click -> getAnswer -> score, both kinds, correct and
   misconception paths. Run: node verify_magnetism_widgets.js
   (skips cleanly if jsdom is not installed)                              */
"use strict";
var path = require("path");
var JSDOM;
try { JSDOM = require(process.env.JSDOM_PATH || "jsdom").JSDOM; }
catch (e) {
  try { JSDOM = require(path.join(__dirname, "..", "..", "..", "outputs", "node_modules", "jsdom")).JSDOM; }
  catch (e2) { console.log("SKIP: jsdom not installed (npm i jsdom to run this test)."); process.exit(0); }
}
var fs = require("fs");
var dom = new JSDOM('<!doctype html><html><body><div id="h1"></div><div id="h2"></div></body></html>',
  { runScripts: "outside-only", pretendToBeVisual: true });
var w = dom.window;
w.eval(fs.readFileSync(path.join(__dirname, "widgets_core.js"), "utf8"));
w.eval(fs.readFileSync(path.join(__dirname, "magnetism-diagrams.js"), "utf8"));

var passed = 0, failed = 0;
function ok(c, name) { if (c) passed++; else { failed++; console.error("FAIL: " + name); } }

/* ---- flhr_direction ---------------------------------------------------- */
var host1 = w.document.getElementById("h1");
var cfg1 = { stimulus: { kind: "motor_effect_setup", params: { force: "none" } },
             current: "out", field: "right" };
var inst1 = w.TOPIC_WIDGETS.flhr_direction(host1, cfg1);
ok(host1.querySelector("svg"), "flhr_direction mounts its stimulus SVG");
var buttons = host1.querySelectorAll("button[data-dir]");
ok(buttons.length === 6, "six direction buttons");
ok(inst1.getAnswer().direction === null, "no pick yet -> null");
/* click the WRONG (reversed) one, then the right one */
host1.querySelector('button[data-dir="down"]').click();
var sBad = inst1.score(inst1.getAnswer(), cfg1);
ok(sBad.status === "none" && sBad.errorCodes.indexOf("direction_reversed") >= 0,
   "clicking down (reversed) scores none + direction_reversed");
host1.querySelector('button[data-dir="up"]').click();
var sGood = inst1.score(inst1.getAnswer(), cfg1);
ok(sGood.status === "full" && sGood.marksAwarded === 1, "clicking up scores full");
inst1.destroy();
ok(host1.innerHTML === "", "destroy clears the host");

/* ---- mark_poles --------------------------------------------------------- */
var host2 = w.document.getElementById("h2");
var cfg2 = { stimulus: { kind: "solenoid_field", params: { show_poles: "markable" } } };
var inst2 = w.TOPIC_WIDGETS.mark_poles(host2, cfg2);
ok(host2.querySelector("svg"), "mark_poles mounts its stimulus SVG");
ok(host2.querySelectorAll("button[data-pole]").length === 4, "two slots x N/S toggles");
var a0 = inst2.getAnswer();
ok(a0.poles.left === null && a0.poles.right === null, "unset slots are null");
host2.querySelector('button[data-slot="left"][data-pole="N"]').click();
host2.querySelector('button[data-slot="right"][data-pole="S"]').click();
var sRev = inst2.score(inst2.getAnswer(), cfg2);
ok(sRev.status === "none" && sRev.errorCodes.indexOf("poles_reversed") >= 0,
   "both swapped -> poles_reversed");
host2.querySelector('button[data-slot="left"][data-pole="S"]').click();
host2.querySelector('button[data-slot="right"][data-pole="N"]').click();
var sOk = inst2.score(inst2.getAnswer(), cfg2);
ok(sOk.status === "full" && sOk.marksAwarded === 2, "S left, N right -> full (grip rule)");
/* re-pick one slot only: partial */
host2.querySelector('button[data-slot="left"][data-pole="N"]').click();
var sPart = inst2.score(inst2.getAnswer(), cfg2);
ok(sPart.status === "partial" && sPart.marksAwarded === 1, "one slot wrong -> partial");
inst2.destroy();

/* ---- engine-shaped flow: mount via registry name, item-style config ---- */
var item = { qtype: "widget", widget: { kind: "mark_poles", config: {
  stimulus: { kind: "induced_magnetism", params: { pole: "S", markable: true } },
  errorCodeMap: { poles_reversed: "induced_magnet_expected_to_repel" } } } };
var host3 = w.document.createElement("div");
w.document.body.appendChild(host3);
var inst3 = w.TOPIC_WIDGETS[item.widget.kind](host3, item.widget.config);
host3.querySelector('button[data-slot="near"][data-pole="S"]').click();
host3.querySelector('button[data-slot="far"][data-pole="N"]').click();
var s3 = inst3.score(inst3.getAnswer(), item.widget.config);
ok(s3.status === "none" && s3.errorCodes[0] === "induced_magnet_expected_to_repel",
   "induced nail item: reversal fires the REGISTERED subject slug via errorCodeMap");

console.log(passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
