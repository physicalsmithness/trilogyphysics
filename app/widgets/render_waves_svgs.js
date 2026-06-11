/* Headless renders of every Waves 6.6 kind + key variants, using the same
   minimal SVG-DOM shim as render_forces_svgs.js / render_svgs.js. Run:
     node render_waves_svgs.js [outdir]                                  */
function makeEl(ns, tag) {
  return {
    nodeName: tag, attrs: {}, children: [], _text: null, style: {},
    setAttribute: function (k, v) { this.attrs[k] = v; },
    appendChild: function (c) { this.children.push(c); return c; },
    set textContent(t) { this._text = t; },
    get textContent() { return this._text; }
  };
}
global.document = { createElementNS: function (ns, tag) { return makeEl(ns, tag); } };
global.window = global.window || {};
require("./widgets_core.js");
var mod = require("./waves-diagrams.js");
var reg = mod.registry;

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function serialize(n) {
  if (typeof n === "string") return esc(n);
  var a = Object.keys(n.attrs).map(function (k) { return " " + k + '="' + esc(n.attrs[k]) + '"'; }).join("");
  var inner = (n._text != null ? esc(n._text) : "") + n.children.map(serialize).join("");
  return "<" + n.nodeName + a + ">" + inner + "</" + n.nodeName + ">";
}
function strip(svg) { return svg.replace(/var\(--[a-z0-9-]+,\s*([^)]*)\)/gi, "$1"); }

var fs = require("fs"), dir = process.argv[2] || "previews_6_6";
try { fs.mkdirSync(dir); } catch (e) {}
var jobs = [
  ["wave_train_clean", "wave_train", { wavelength: 4, amplitude: 1, cycles: 2 }],
  ["wave_train_marked", "wave_train", { wavelength: 4, amplitude: 1, cycles: 2, mark: { wavelength: true, amplitude: true, arrows: true } }],
  ["wave_train_DISTRACTOR_amp_double", "wave_train", { wavelength: 4, amplitude: 1, cycles: 2, distractor: "amplitude_double" }],
  ["wave_train_DISTRACTOR_wl_half", "wave_train", { wavelength: 4, amplitude: 1, cycles: 2, distractor: "wavelength_half" }],
  ["wavefronts_parallel", "wavefronts", { count: 6, mark: { wavelength: true } }],
  ["wavefronts_curved", "wavefronts", { count: 5, curved: true, mark: { wavelength: true } }],
  ["longitudinal_marked", "longitudinal_wave", { wavelength: 4, cycles: 3, mark: { labelCR: true, wavelength: true } }],
  ["longitudinal_DISTRACTOR_CtoR", "longitudinal_wave", { wavelength: 4, cycles: 3, mark: { labelCR: true }, distractor: "wavelength_C_to_R" }],
  ["scenario_shore", "wave_scenario", { variant: "shore", mark: { distance: true }, values: { distance: "d" } }],
  ["scenario_pier", "wave_scenario", { variant: "pier", mark: { count: true, time: true }, values: { count: 8, time: 20 } }],
  ["scenario_sonar", "wave_scenario", { variant: "sonar", mark: { time: true, distance: true }, values: { time: "0.4" } }],
  ["scenario_speed_clap", "wave_scenario", { variant: "speed_clap", mark: { distance: true, time: true }, values: { distance: "100 m", time: "0.3" } }],
  ["scenario_echo_wall", "wave_scenario", { variant: "echo_wall", mark: { distance: true, time: true }, values: { distance: "50 m" } }],
  ["scenario_clap_rhythm", "wave_scenario", { variant: "clap_rhythm", mark: { distance: true } }],
  ["ripple_tank", "ripple_tank", { waves: 5, mark: { distance: true } }],
  ["standing_wave_3loops", "standing_wave", { loops: 3, mark: { nodes: true, antinodes: true, halfLambda: true, length: true } }],
  ["em_spectrum_full", "em_spectrum", { mark: { frequencyArrow: true, wavelengthArrow: true } }],
  ["em_spectrum_blank", "em_spectrum", { blanks: ["infrared"], highlight: ["infrared"] }],
  ["em_origins_all", "em_origins", {}],
  ["em_uses_all", "em_uses", {}],
  ["refraction_wavefronts_into_glass", "refraction_wavefronts", { n1: 1, n2: 1.5, theta1: 40, mark: { angles: true, spacing: true } }],
  ["refraction_wavefronts_into_air", "refraction_wavefronts", { n1: 1.5, n2: 1, theta1: 25, mark: { angles: true, spacing: true } }],
  ["refraction_ray_rectangle", "refraction_ray", { shape: "rectangle", n: 1.5, theta1: 40, mark: { angles: true } }],
  ["refraction_ray_triangle", "refraction_ray", { shape: "triangle", n: 1.5 }],
  ["refraction_ray_semicircle", "refraction_ray", { shape: "semicircle", n: 1.5, theta1: 30 }],
  ["material_behaviour", "material_wave_behaviour", { material: "coloured glass", rays: [{ label: "visible", behaviour: "transmit" }, { label: "ultraviolet", behaviour: "absorb" }, { label: "infrared", behaviour: "reflect" }] }],
  ["radiation_leslie_cube", "radiation_demo", { variant: "leslie_cube" }],
  ["radiation_wax_rod", "radiation_demo", { variant: "wax_rod" }],
  ["radiation_two_bottles", "radiation_demo", { variant: "two_bottles" }],
  ["radiation_ir_detection", "radiation_demo", { variant: "ir_detection" }]
];
var cards = [], okN = 0;
jobs.forEach(function (j) {
  var name = j[0], kind = j[1], params = j[2];
  try {
    var node = reg[kind](params);
    var svg = strip(serialize(node));
    fs.writeFileSync(dir + "/" + name + ".svg", svg);
    cards.push('<figure><figcaption>' + esc(name) + ' <small>(' + esc(kind) + ')</small></figcaption>' + svg + '</figure>');
    okN++;
  } catch (e) {
    cards.push('<figure class="err"><figcaption>' + esc(name) + ' FAILED: ' + esc(e.message) + '</figcaption></figure>');
    console.error("FAIL", name, e.message);
  }
});
var html = '<!doctype html><meta charset="utf-8"><title>Waves 6.6 widget previews</title>' +
  '<style>body{font:14px system-ui;background:#faf6ed;color:#1a1a17;margin:18px}' +
  'h1{font-size:18px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:14px}' +
  'figure{margin:0;background:#fffdf6;border:1px solid #ddd6c6;border-radius:8px;padding:10px}' +
  'figcaption{font-size:12px;color:#4d4943;margin-bottom:6px}figure.err{border-color:#b03030;color:#b03030}' +
  'svg{max-width:100%;height:auto}small{color:#8c8579}</style>' +
  '<h1>Waves 6.6 widget catalogue - ' + okN + '/' + jobs.length + ' rendered</h1><div class="grid">' + cards.join("") + '</div>';
fs.writeFileSync(dir + "/index.html", html);
console.log("Rendered " + okN + "/" + jobs.length + " -> " + dir + "/index.html");
