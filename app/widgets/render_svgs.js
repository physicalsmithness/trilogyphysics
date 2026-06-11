/* Minimal SVG-DOM shim so the browser renderers run in Node, then serialise
   each widget to an .svg file (var() stripped to hex fallbacks for raster). */
function makeEl(ns, tag) {
  return {
    nodeName: tag, attrs: {}, children: [], _text: null,
    setAttribute: function (k, v) { this.attrs[k] = v; },
    appendChild: function (c) { this.children.push(c); return c; },
    set textContent(t) { this._text = t; },
    get textContent() { return this._text; }
  };
}
global.document = { createElementNS: function (ns, tag) { return makeEl(ns, tag); } };
global.window = global.window || {};

var mod = require("./topic-diagrams.js");
var reg = mod.registry;

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
  ["iv_ohmic", "iv_characteristic", { device: "ohmic" }],
  ["iv_filament_correct", "iv_characteristic", { device: "filament", variant: "correct" }],
  ["iv_filament_plateau", "iv_characteristic", { device: "filament", variant: "plateau" }],
  ["iv_filament_droop", "iv_characteristic", { device: "filament", variant: "droop" }],
  ["iv_filament_negative", "iv_characteristic", { device: "filament", variant: "negative" }],
  ["iv_diode", "iv_characteristic", { device: "diode" }],
  ["resistance_voltage_filament", "resistance_voltage", { device: "filament" }],
  ["rt_thermistor", "resistance_temperature", { device: "thermistor" }],
  ["rt_negative_line", "resistance_temperature", { device: "metal_wire", variant: "negative" }],
  ["rt_metal_wire", "resistance_temperature", { device: "metal_wire" }],
  ["resistance_light", "resistance_light", {}],
  ["acdc_ac_current", "ac_dc_trace", { quantity: "current", signal: "ac" }],
  ["acdc_dc_pd", "ac_dc_trace", { quantity: "pd", signal: "dc" }],
  ["transformer_stepup", "transformer", { type: "step_up" }],
  ["transformer_stepdown", "transformer", { type: "step_down" }],
  ["transmission_line", "transmission_line", {}],
  ["mains_three_wire", "mains_three_wire", {}],
  ["live_earth_danger", "live_earth_danger", {}]
];
jobs.forEach(function (j) {
  var node = reg[j[1]](j[2]);
  var svg = '<?xml version="1.0" encoding="UTF-8"?>\n' + strip(serialize(node));
  fs.writeFileSync(dir + "/" + j[0] + ".svg", svg);
  console.log("wrote " + j[0] + ".svg");
});
