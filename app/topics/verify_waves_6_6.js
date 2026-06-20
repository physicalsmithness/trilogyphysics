/* Headless engine smoke test for Waves 6.6 (run: node app/topics/verify_waves_6_6.js).
   Loads the real engine graders + the topic config and confirms every item is
   servable and grades full/correct when given its own correct answer. Catches
   shape-drift regressions (the d053 migration class of bug) without a browser. */
global.window = {};
global.document = { getElementById: () => null,
  createElement: () => ({ appendChild(){}, addEventListener(){}, style:{}, classList:{ add(){} } }) };
const base = require("path").join(__dirname, "..");
require(base + "/calc_workings.js");
require(base + "/engine.js");
require(__dirname + "/waves_6_6.js");
const T = window.TRILOGY_ENGINE_TEST, CW = window.TrilogyCalcWorkings, cfg = window.TRILOGY_TOPICS["6.6"];

// Correct four-line working per single-formula calc item (equation / substitution
// / rearrangement=value / final value+unit), so the marks-the-method grader can
// award all four. Add a line set here when a new calc_workings item is authored.
const CALC_LINES = {
  wc_wave_speed_calc:  { line1:"v=f*L", line2:"v=1650*0.200",      line3:"v=330",        line4Value:"330",        line4Unit:"m/s" },
  wc_wavelength_calc:  { line1:"L=v/f", line2:"L=35.1/45.0",       line3:"L=0.78",       line4Value:"0.78",       line4Unit:"m"   },
  wc_frequency_calc:   { line1:"f=v/L", line2:"f=300000000/0.125", line3:"f=2400000000", line4Value:"2400000000", line4Unit:"Hz"  },
  wc_period_calc:      { line1:"T=1/f", line2:"T=1/20",            line3:"T=0.05",       line4Value:"0.05",       line4Unit:"s"   },
  wc_freq_from_period: { line1:"f=1/T", line2:"f=1/0.004",         line3:"f=250",        line4Value:"250",        line4Unit:"Hz"  }
};

let pass = 0; const fail = [];
for (const it of cfg.items) {
  if (!T.isServable(it)) { fail.push(it.id + ": NOT SERVABLE"); continue; }
  if (/mcq/.test(it.qtype)) {
    (T.gradeMcq(it, T.correctIndices(it)) === "correct") ? pass++ : fail.push(it.id + ": mcq not correct");
  } else if (it.qtype === "level_of_response_6") {
    const idx = it.lor.points.map((p, i) => p.creditworthy ? i : -1).filter(i => i >= 0);
    const r = T.gradeLor(it, idx);
    (r.status === "full" && r.marks === it.marks) ? pass++ : fail.push(it.id + ": lor " + r.status + " " + r.marks + "/" + it.marks);
  } else if (it.qtype === "calc_workings") {
    const lines = CALC_LINES[it.id];
    if (!lines) { fail.push(it.id + ": no test lines defined in verify script"); continue; }
    const r = CW.markCalcWorkings(T.normalizeCalc(it.calc), lines);
    (r.status === "full") ? pass++ : fail.push(it.id + ": calc " + r.marksAwarded + "/" + r.marksPossible);
  } else if (it.qtype === "widget") {
    pass++; // servable; the widget scorer path is exercised by app/widgets/verify_waves_models.js
  } else fail.push(it.id + ": unknown qtype " + it.qtype);
}
const tag = "[verify_waves_6_6]";
if (fail.length) { console.error(tag + " FAIL\n" + fail.join("\n")); process.exit(1); }
console.log(tag + " PASS: " + pass + "/" + cfg.items.length + " items servable and grade full/correct on the engine graders");
