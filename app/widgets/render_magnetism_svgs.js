/* Headless renders of every Magnetism 6.7 kind + variant, same minimal
   SVG-DOM shim as render_forces_svgs.js. Run:
     node render_magnetism_svgs.js [outdir]                              */
function makeEl(ns, tag) {
  return { nodeName: tag, attrs: {}, children: [], _text: null, style: {},
    setAttribute: function (k, v) { this.attrs[k] = v; },
    appendChild: function (c) { this.children.push(c); return c; },
    set textContent(t) { this._text = t; },
    get textContent() { return this._text; } };
}
global.document = { createElementNS: function (ns, tag) { return makeEl(ns, tag); } };
global.window = global.window || {};
require("./widgets_core.js");
var reg = require("./magnetism-diagrams.js").registry;

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function serialize(n) {
  if (typeof n === "string") return esc(n);
  var a = Object.keys(n.attrs).map(function (k) { return " " + k + '="' + esc(n.attrs[k]) + '"'; }).join("");
  var inner = (n._text != null ? esc(n._text) : "") + n.children.map(serialize).join("");
  return "<" + n.nodeName + a + ">" + inner + "</" + n.nodeName + ">";
}
function strip(svg) { return svg.replace(/var\(--[a-z0-9-]+,\s*([^)]*)\)/gi, "$1"); }

var fs = require("fs");
var dir = process.argv[2] || ".";
var jobs = [
  ["bar_field_correct", "bar_magnet_field", {}],
  ["bar_field_SN", "bar_magnet_field", { poles: "SN" }],
  ["bar_field_DISTRACTOR_reversed", "bar_magnet_field", { variant: "reversed_arrows" }],
  ["bar_field_DISTRACTOR_crossing", "bar_magnet_field", { variant: "crossing" }],
  ["bar_field_DISTRACTOR_through", "bar_magnet_field", { variant: "through_magnet" }],
  ["bar_field_DISTRACTOR_lopsided", "bar_magnet_field", { variant: "lopsided" }],
  ["bar_field_DISTRACTOR_gaps", "bar_magnet_field", { variant: "not_reaching" }],
  ["uniform_correct", "uniform_field", {}],
  ["uniform_DISTRACTOR_curved", "uniform_field", { variant: "curved" }],
  ["uniform_DISTRACTOR_notparallel", "uniform_field", { variant: "not_parallel" }],
  ["uniform_DISTRACTOR_reversed", "uniform_field", { variant: "reversed_arrows" }],
  ["two_attract", "two_magnets_field", {}],
  ["two_repel_NN", "two_magnets_field", { orientation: "repel" }],
  ["two_repel_SS", "two_magnets_field", { orientation: "repel", facing: "SS" }],
  ["two_attract_DISTRACTOR_wrongpoles", "two_magnets_field", { variant: "wrong_poles" }],
  ["two_attract_DISTRACTOR_reversed", "two_magnets_field", { variant: "reversed_arrows" }],
  ["solenoid_correct", "solenoid_field", {}],
  ["solenoid_topin", "solenoid_field", { top_current: "in" }],
  ["solenoid_markable", "solenoid_field", { show_poles: "markable" }],
  ["solenoid_DISTRACTOR_wrongpoles", "solenoid_field", { variant: "wrong_poles" }],
  ["solenoid_DISTRACTOR_nonuniform", "solenoid_field", { variant: "nonuniform" }],
  ["electromagnet_core", "electromagnet", {}],
  ["induced_nail_N", "induced_magnetism", {}],
  ["induced_nail_S", "induced_magnetism", { pole: "S" }],
  ["induced_nail_DISTRACTOR_wrongpoles", "induced_magnetism", { variant: "wrong_poles" }],
  ["induced_chain", "induced_magnetism", { object: "clip_chain" }],
  ["induced_chain_removed_iron", "induced_magnetism", { object: "clip_chain", state: "removed" }],
  ["induced_chain_removed_steel", "induced_magnetism", { object: "clip_chain", state: "removed", material: "steel" }],
  ["materials_quiz", "magnetic_materials", {}],
  ["materials_result", "magnetic_materials", { show_result: true }],
  ["compass_around", "compass", {}],
  ["compass_around_DISTRACTOR_reversed", "compass", { variant: "reversed" }],
  ["compass_single", "compass", { mode: "single" }],
  ["compass_earth", "compass", { mode: "earth" }],
  ["mapping_filings", "field_mapping", {}],
  ["mapping_compasses", "field_mapping", { mode: "compasses" }],
  ["wire_out_correct", "wire_field", {}],
  ["wire_in_correct", "wire_field", { current: "in" }],
  ["wire_DISTRACTOR_equal", "wire_field", { variant: "equal_spacing" }],
  ["wire_DISTRACTOR_reversed", "wire_field", { variant: "reversed" }],
  ["flhr_full", "flemings_lhr", {}],
  ["flhr_blank_force", "flemings_lhr", { blanks: ["thumb"] }],
  ["motor_basic_out", "motor_effect_setup", {}],
  ["motor_basic_in", "motor_effect_setup", { current: "in" }],
  ["motor_parallel", "motor_effect_setup", { variant: "parallel" }],
  ["motor_pivot", "motor_effect_setup", { variant: "pivot" }],
  ["motor_balance", "motor_effect_setup", { variant: "balance" }],
  ["motor_far", "motor_effect_setup", { offset: "far" }],
  ["motor_DISTRACTOR_reversed", "motor_effect_setup", { force: "reversed" }],
  ["motor_DISTRACTOR_alongfield", "motor_effect_setup", { force: "along_field" }],
  ["dcmotor_0", "dc_motor", {}],
  ["dcmotor_45", "dc_motor", { rotation_angle: 45 }],
  ["dcmotor_90", "dc_motor", { rotation_angle: 90 }],
  ["dcmotor_DISTRACTOR_bothsame", "dc_motor", { variant: "both_same" }],
  ["dcmotor_DISTRACTOR_reversed", "dc_motor", { variant: "reversed" }],
  ["dcmotor_DISTRACTOR_rotate45", "dc_motor", { rotation_angle: 45, variant: "forces_rotate" }]
];
var n = 0;
jobs.forEach(function (j) {
  var node = reg[j[1]](j[2]);
  fs.writeFileSync(dir + "/" + j[0] + ".svg", strip(serialize(node)));
  n++;
});
console.log(n + " previews written to " + dir);
