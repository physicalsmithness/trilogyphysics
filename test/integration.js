/* Trilogy Physics — jsdom integration test for the blended engine.
   Loads the full app/ script stack into a DOM, mounts the engine with the
   ?demo=1 fixtures, and asserts: a question renders, the circuit kind produces
   an SVG, answering logs an event, and the dashboard renders atom cells.
   Run:  node test/integration.js   (needs jsdom on NODE_PATH) */
"use strict";
const fs = require("fs"), path = require("path");
let JSDOM;
try { JSDOM = require(process.env.JSDOM_PATH || "jsdom").JSDOM; }
catch (e) {
  try { JSDOM = require(require("path").join(__dirname, "..", "..", "outputs", "node_modules", "jsdom")).JSDOM; }
  catch (e2) { console.log("SKIP: jsdom not installed (npm i jsdom to run this test)."); process.exit(0); }
}

const APP = path.join(__dirname, "..", "app");
const read = f => fs.readFileSync(path.join(APP, f), "utf8");

const dom = new JSDOM('<!doctype html><html><body><div id="host"></div></body></html>',
  { url: "http://localhost/?demo=1", runScripts: "outside-only", pretendToBeVisual: true });
const w = dom.window;
// give the engine the browser globals it expects
w.eval(read("circuit-builder-embed.js"));
w.eval(read("formula.js"));
w.eval(read("rounding_classifier.js"));
w.eval(read("diagrams.js"));
w.eval(read("engine.js"));
w.eval(read("calc_workings.js"));
w.eval(read("../data/misconceptions.js"));
w.eval(read("widgets/widgets_core.js"));
try { w.eval(read("widgets/forces-diagrams.js")); } catch(e){ console.log("note: forces widgets not loaded:", e.message); }
w.eval(read("topics/electricity_6_2.js"));
try { w.eval(read("widgets/topic-diagrams.js")); } catch (e) { console.log("note: widgets catalogue not loaded:", e.message); }

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log("  ok   " + n); } else { fail++; console.log("  FAIL " + n); } };

console.log("\nGlobals present");
ok("CircuitBuilder loaded", typeof w.CircuitBuilder === "object" && typeof w.CircuitBuilder.renderDSL === "function");
ok("TrilogyEngine loaded", typeof w.TrilogyEngine === "object");
ok("TRILOGY_TOPICS 6.2 loaded", !!(w.TRILOGY_TOPICS && w.TRILOGY_TOPICS["6.2"]));
const cfg = w.TRILOGY_TOPICS["6.2"];
ok("demo items loaded via ?demo=1", (cfg.items || []).length >= 4);

console.log("\nCircuit kind renders SVG");
const svg = w.TrilogyDiagrams.render({ kind: "circuit", dsl: "2cb,sc,r,r" });
ok("circuit DSL -> SVG node", svg && String(svg.tagName).toLowerCase() === "svg");

console.log("\nMount + render a question");
let reported = [];
w.TrilogyEngine.mount({
  container: w.document.getElementById("host"),
  topic: { id: "6.2", slug: "electricity", name: "Electricity" },
  config: cfg,
  identity: { anonymous_id: "test", display_name: "T", cohort: "C" },
  report: ev => reported.push(ev)
});
const host = w.document.getElementById("host");
ok("scaffold built (#tp-qcard)", !!host.querySelector("#tp-qcard"));
ok("a prompt rendered", !!host.querySelector(".tp-prompt"));
ok("dashboard atom cells rendered", host.querySelectorAll(".tp-atomcell").length === cfg.atoms.length);
ok("tier control rendered", host.querySelectorAll(".tp-tierbtn").length === 3);

console.log("\nAnswer the current question");
const before = JSON.parse(w.localStorage.getItem("trilogy_physics_log_v1") || "[]").length;
let opt = host.querySelector(".tp-option");
let answered = false;
if (opt) {
  // mcq/short: click options. For multi/short, click then press Enter.
  const qcard = host.querySelector("#tp-qcard");
  opt.click();
  // if still answering (multi/short), submit with Enter
  if (host.querySelector(".tp-feedback") && host.querySelector(".tp-feedback").hidden) {
    const ev = new w.KeyboardEvent("keydown", { key: "Enter" });
    w.document.dispatchEvent(ev);
  }
  answered = true;
} else if (host.querySelector(".tp-selfmark") || Array.prototype.some.call(host.querySelectorAll("button"), b => /reveal model/i.test(b.textContent))) {
  // fallback self-check item
  const rb = Array.prototype.find.call(host.querySelectorAll("button"), b => /reveal model/i.test(b.textContent));
  if (rb) rb.click();
  const sm = host.querySelector(".tp-selfmark button");
  if (sm) sm.click();
  answered = true;
} else if (host.querySelector("#tp-short-input")) {
  host.querySelector("#tp-short-input").value = "use a high voltage so the current is lower and the heating loss falls";
  host.querySelector(".tp-calc-go").click();
  answered = true;
} else if (host.querySelector("#tp-cc-0-l1")) {
  // chained multi-stage calc: fill every stage then mark
  let si = 0;
  while (host.querySelector("#tp-cc-" + si + "-l1")) {
    host.querySelector("#tp-cc-" + si + "-l1").value = "x=y";
    si++;
  }
  host.querySelector(".tp-calc-go").click();
  answered = true;
} else if (host.querySelector("#tp-cw-l1")) {
  // four-line calc_workings: fill all lines and mark
  host.querySelector("#tp-cw-l1").value = "R = V / I";
  host.querySelector("#tp-cw-l2").value = "R = 6.0 / 0.5";
  host.querySelector("#tp-cw-l3").value = "R = 12";
  host.querySelector("#tp-cw-v").value = "12";
  host.querySelector("#tp-cw-u").value = "\u03a9";
  host.querySelector(".tp-calc-go").click();
  answered = true;
} else {
  // value-only calc item
  const inp = host.querySelector("#tp-calc-input");
  if (inp) { inp.value = "12"; host.querySelector(".tp-calc-go").click(); answered = true; }
}
ok("an answer was submitted", answered);
const after = JSON.parse(w.localStorage.getItem("trilogy_physics_log_v1") || "[]").length;
ok("attempt appended to event log", after === before + 1);
ok("attempt reported to shell callback", reported.length >= 1);
ok("feedback shown after answer", !!host.querySelector(".tp-feedback") && !host.querySelector(".tp-feedback").hidden);
ok("next button present", !!host.querySelector(".tp-next"));

console.log("\nWidgets catalogue composes with the registry (cross-chat)");
const wk = w.TrilogyDiagrams.kinds();
ok("circuit kind present (Housing)", wk.indexOf("circuit") !== -1);
ok("iv_characteristic present (Widgets)", wk.indexOf("iv_characteristic") !== -1);
let ivNode = null, threw = false;
try { ivNode = w.TrilogyDiagrams.render({ kind: "iv_characteristic", device: "filament", variant: "correct" }); }
catch (e) { threw = true; }
ok("iv_characteristic renders without throwing", !threw);
ok("iv_characteristic returns an SVG (or null) cleanly", ivNode === null || String(ivNode.tagName).toLowerCase() === "svg");

console.log("\nFour-line calc_workings renders + marks (verbatim grader)");
w.TrilogyEngine.unmount();
// mount again and force the calc item by filtering the pool to it
const calcCfg = Object.assign({}, cfg, { items: cfg.items.filter(it => it.id === "_demo_vir_calc") });
w.TrilogyEngine.mount({ container: w.document.getElementById("host"),
  topic: { id: "6.2", slug: "electricity", name: "Electricity" }, config: calcCfg,
  identity: { anonymous_id: "t", display_name: "T", cohort: "C" }, report: () => {} });
const host2 = w.document.getElementById("host");
ok("four-line calc UI rendered", !!host2.querySelector("#tp-cw-l1") && !!host2.querySelector("#tp-cw-u"));
host2.querySelector("#tp-cw-l1").value = "R = V / I";
host2.querySelector("#tp-cw-l2").value = "R = 6.0 / 0.5";
host2.querySelector("#tp-cw-l3").value = "R = 12";
host2.querySelector("#tp-cw-v").value = "12";
host2.querySelector("#tp-cw-u").value = "\u03a9";
host2.querySelector(".tp-calc-go").click();
const reveal = host2.querySelector(".tp-calc-reveal-h");
ok("marked working revealed", !!reveal);
ok("full marks shown (4/4)", reveal && reveal.textContent.indexOf("4/4") !== -1);
ok("four per-line results shown", host2.querySelectorAll(".tp-cw-result").length === 4);

console.log("\nShort (markPoints) renders + marks through the DOM");
w.TrilogyEngine.unmount();
const shortCfg = Object.assign({}, cfg, { items: cfg.items.filter(it => it.id === "_demo_grid_short") });
w.TrilogyEngine.mount({ container: w.document.getElementById("host"),
  topic: { id: "6.2", slug: "electricity", name: "Electricity" }, config: shortCfg,
  identity: { anonymous_id: "t", display_name: "T", cohort: "C" }, report: () => {} });
let h3 = w.document.getElementById("host");
ok("short textarea rendered", !!h3.querySelector("#tp-short-input"));
h3.querySelector("#tp-short-input").value = "transmit at high voltage so the lower current cuts I2R heating loss";
h3.querySelector(".tp-calc-go").click();
const sh = h3.querySelector(".tp-calc-reveal-h");
ok("short mark points revealed", !!sh && sh.textContent.indexOf("Mark points") !== -1);
ok("short scored full (3/3)", !!sh && sh.textContent.indexOf("3/3") !== -1);

console.log("\nMCQ multi renders + grades through the DOM");
w.TrilogyEngine.unmount();
const mcqCfg = Object.assign({}, cfg, { items: cfg.items.filter(it => it.id === "_demo_parallel_multi") });
w.TrilogyEngine.mount({ container: w.document.getElementById("host"),
  topic: { id: "6.2", slug: "electricity", name: "Electricity" }, config: mcqCfg,
  identity: { anonymous_id: "t", display_name: "T", cohort: "C" }, report: () => {} });
let h4 = w.document.getElementById("host");
const optBtns = h4.querySelectorAll(".tp-option");
ok("mcq_multi options rendered with data-idx", optBtns.length === 4 && optBtns[0].dataset.idx !== undefined);
ok("mcq_multi circuit stimulus rendered", !!h4.querySelector(".stimulus svg"));
// select the three correct indices (0,1,3) by data-idx, then Enter
["0","1","3"].forEach(function (ix) { const b = h4.querySelector('.tp-option[data-idx="' + ix + '"]'); if (b) b.click(); });
w.document.dispatchEvent(new w.KeyboardEvent("keydown", { key: "Enter" }));
ok("mcq_multi graded correct (feedback shown)", !!h4.querySelector(".tp-feedback") && !h4.querySelector(".tp-feedback").hidden);
ok("mcq_multi marked the correct options", h4.querySelectorAll(".tp-option.is-correct").length === 3);

console.log("\nInteractive widget qtype (window.TOPIC_WIDGETS + qtype:widget)");
w.TrilogyEngine.unmount();
// real widget files compose
ok("TOPIC_WIDGETS populated by widget files", w.TOPIC_WIDGETS && Object.keys(w.TOPIC_WIDGETS).length >= 5);
ok("FORCES_MODELS pure scorer present", w.FORCES_MODELS && typeof w.FORCES_MODELS.scoreResolve === "function");
const rs = w.FORCES_MODELS.scoreResolve({fx:30,fy:40},{magnitude:50,angle:53});
ok("pure scorer returns the contract shape", rs && "marksAwarded" in rs && "status" in rs && Array.isArray(rs.errorCodes));

// engine flow via a deterministic stub widget
w.TOPIC_WIDGETS.test_widget = function (host, config) {
  host.appendChild(w.document.createElement("div"));
  return {
    getAnswer: function () { return { value: config.pupil }; },
    score: function (ans, cfg) {
      const okv = ans.value === cfg.expected;
      return { marksAwarded: okv ? 2 : 0, marksPossible: 2, status: okv ? "full" : "none",
               hits: okv ? ["value correct"] : [], misses: okv ? [] : ["value wrong"],
               errorCodes: okv ? [] : ["test_error_slug"] };
    },
    destroy: function () {}
  };
};
function widgetCfg(pupil) {
  return { id: "6.2", slug: "electricity", name: "Electricity", subtags: cfg.subtags, atoms: cfg.atoms,
    misconceptions: cfg.misconceptions, items: [ { id: "_tw", qtype: "widget", tier: "FH",
      topic: "6.2", subtag: "series_parallel", atoms: ["series_resistance_sum"],
      widget: { kind: "test_widget", config: { expected: 5, pupil: pupil } },
      applicable_misconceptions: ["test_error_slug"] } ] };
}
// correct submission
w.localStorage.removeItem("trilogy_physics_log_v1");
w.TrilogyEngine.mount({ container: w.document.getElementById("host"),
  topic: { id: "6.2", slug: "electricity", name: "Electricity" }, config: widgetCfg(5),
  identity: { anonymous_id: "t", display_name: "T", cohort: "C" }, report: () => {} });
let hw = w.document.getElementById("host");
ok("widget host rendered", !!hw.querySelector(".tp-widget-host"));
ok("submit button rendered", !!hw.querySelector(".tp-calc-go"));
hw.querySelector(".tp-calc-go").click();
const rev = hw.querySelector(".tp-calc-reveal-h");
ok("marks revealed", !!rev && rev.textContent.indexOf("2/2") !== -1);
ok("graded correct (feedback ok)", !!hw.querySelector(".tp-feedback-correct"));
let logC = JSON.parse(w.localStorage.getItem("trilogy_physics_log_v1") || "[]");
ok("widget attempt logged with status", logC.length >= 1 && logC[logC.length-1].status === "correct");

// wrong submission -> error code logged
w.TrilogyEngine.unmount();
w.localStorage.removeItem("trilogy_physics_log_v1");
w.TrilogyEngine.mount({ container: w.document.getElementById("host"),
  topic: { id: "6.2", slug: "electricity", name: "Electricity" }, config: widgetCfg(9),
  identity: { anonymous_id: "t", display_name: "T", cohort: "C" }, report: () => {} });
hw = w.document.getElementById("host");
hw.querySelector(".tp-calc-go").click();
let logW = JSON.parse(w.localStorage.getItem("trilogy_physics_log_v1") || "[]");
ok("wrong widget logs error code as slug", logW.length >= 1 && (logW[logW.length-1].error_codes || []).indexOf("test_error_slug") !== -1);
ok("wrong widget status mapped to wrong", logW[logW.length-1].status === "wrong");

console.log("\nFour-way graph-select MCQ: per-option diagrams render + grade (d036)");
w.TrilogyEngine.unmount();
// stub the iv_characteristic renderer (the real one is in topic-diagrams.js, not
// loaded headless); register on the same TOPIC_DIAGRAMS object the engine reads.
w.TOPIC_DIAGRAMS = w.TOPIC_DIAGRAMS || {};
w.TOPIC_DIAGRAMS.iv_characteristic = function (params) {
  const svg = w.document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "120"); svg.setAttribute("height", "90");
  svg.setAttribute("data-device", (params && params.device) || "");
  return svg;
};
const gsCfg = Object.assign({}, cfg, { items: cfg.items.filter(it => it.id === "_demo_iv_select") });
w.TrilogyEngine.mount({ container: w.document.getElementById("host"),
  topic: { id: "6.2", slug: "electricity", name: "Electricity" }, config: gsCfg,
  identity: { anonymous_id: "t", display_name: "T", cohort: "C" }, report: () => {} });
let hg = w.document.getElementById("host");
const gopts = hg.querySelectorAll(".tp-option");
ok("four diagram options rendered", gopts.length === 4);
ok("every option contains an SVG (per-option diagram)", Array.prototype.every.call(gopts, o => !!o.querySelector("svg")));
// pick the correct option (authored index 0) via its data-idx
const correctBtn = hg.querySelector('.tp-option[data-idx="0"]');
ok("correct option present by index", !!correctBtn);
correctBtn.click();
ok("graph-select graded correct", !!hg.querySelector(".tp-feedback-correct"));

console.log("\nlevel_of_response_6 renders + marks through the DOM");
w.TrilogyEngine.unmount();
const lorCfg = Object.assign({}, cfg, { items: cfg.items.filter(it => it.id === "_demo_grid_lor") });
w.TrilogyEngine.mount({ container: w.document.getElementById("host"),
  topic: { id: "6.2", slug: "electricity", name: "Electricity" }, config: lorCfg,
  identity: { anonymous_id: "t", display_name: "T", cohort: "C" }, report: () => {} });
let hl = w.document.getElementById("host");
ok("LOR options rendered (8 points)", hl.querySelectorAll(".tp-option").length === 8);
// tick the five creditworthy points (authored indices 0..4) then Submit
["0","1","2","3","4"].forEach(function (ix) { const b = hl.querySelector('.tp-option[data-idx="' + ix + '"]'); if (b) b.click(); });
hl.querySelector(".tp-calc-go").click();
const lrev = hl.querySelector(".tp-calc-reveal-h");
ok("LOR marked + banded", !!lrev && lrev.textContent.indexOf("6/6") !== -1 && lrev.textContent.indexOf("Level 3") !== -1);
ok("LOR graded correct", !!hl.querySelector(".tp-feedback-correct"));
ok("creditworthy points shown correct", hl.querySelectorAll(".tp-option.is-correct").length === 5);

console.log("\nGeneric fallback self-check renders + logs ungraded (d047)");
w.TrilogyEngine.unmount();
w.TOPIC_DIAGRAMS = w.TOPIC_DIAGRAMS || {};
w.TOPIC_DIAGRAMS.iv_characteristic = w.TOPIC_DIAGRAMS.iv_characteristic || function () {
  return w.document.createElementNS("http://www.w3.org/2000/svg", "svg");
};
const fbCfg = Object.assign({}, cfg, { items: cfg.items.filter(it => it.id === "_demo_iv_sketch") });
w.localStorage.removeItem("trilogy_physics_log_v1");
w.TrilogyEngine.mount({ container: w.document.getElementById("host"),
  topic: { id: "6.2", slug: "electricity", name: "Electricity" }, config: fbCfg,
  identity: { anonymous_id: "t", display_name: "T", cohort: "C" }, report: () => {} });
let hf = w.document.getElementById("host");
ok("graph_sketch item served via fallback", !!hf.querySelector("#tp-qcard .tp-prompt"));
const revealBtn = Array.prototype.find.call(hf.querySelectorAll("button"), b => /reveal model/i.test(b.textContent));
ok("reveal-model control rendered", !!revealBtn);
revealBtn.click();
ok("model answer SVG revealed", !!hf.querySelector(".tp-calc-reveal .stimulus svg"));
const selfBtns = hf.querySelectorAll(".tp-selfmark button");
ok("three self-mark buttons", selfBtns.length === 3);
selfBtns[0].click();   // "I got it right"
const fbLog = JSON.parse(w.localStorage.getItem("trilogy_physics_log_v1") || "[]");
ok("fallback attempt logged as ungraded_self_assessed",
   fbLog.length >= 1 && fbLog[fbLog.length-1].grading === "ungraded_self_assessed" && fbLog[fbLog.length-1].status === "correct");

console.log("\nChained calc renders all stages + marks (d047)");
w.TrilogyEngine.unmount();
const chCfg = Object.assign({}, cfg, { items: cfg.items.filter(it => it.id === "_demo_energy_chain") });
w.TrilogyEngine.mount({ container: w.document.getElementById("host"),
  topic: { id: "6.2", slug: "electricity", name: "Electricity" }, config: chCfg,
  identity: { anonymous_id: "t", display_name: "T", cohort: "C" }, report: () => {} });
let hc = w.document.getElementById("host");
ok("two stage blocks rendered", hc.querySelectorAll(".tp-cc-stage").length === 2);
ok("stage inputs present", !!hc.querySelector("#tp-cc-0-l1") && !!hc.querySelector("#tp-cc-1-v"));
const fillStage = (i, l1, l2, l3, v, u) => {
  hc.querySelector("#tp-cc-" + i + "-l1").value = l1;
  hc.querySelector("#tp-cc-" + i + "-l2").value = l2;
  hc.querySelector("#tp-cc-" + i + "-l3").value = l3;
  hc.querySelector("#tp-cc-" + i + "-v").value = v;
  hc.querySelector("#tp-cc-" + i + "-u").value = u;
};
fillStage(0, "P=V*I", "P=12*0.5", "P=6", "6", "W");
fillStage(1, "E=P*t", "E=6*120", "E=720", "720", "J");
hc.querySelector(".tp-calc-go").click();
const crev = hc.querySelector(".tp-calc-reveal-h");
ok("chain marked 4/4", !!crev && crev.textContent.indexOf("4/4") !== -1);
ok("chain graded correct", !!hc.querySelector(".tp-feedback-correct"));
ok("per-stage breakdown shown", hc.querySelectorAll(".tp-cc-stage-h").length >= 2);

console.log("\nUnmount clears the panel");
w.TrilogyEngine.unmount();
ok("panel emptied on unmount", host.innerHTML === "");

console.log("\n" + pass + " passed, " + fail + " failed.\n");
process.exit(fail ? 1 : 0);
