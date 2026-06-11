/* Headless renders of every Forces 6.5 kind + variant, using the same
   minimal SVG-DOM shim as the 6.2 render_svgs.js. Run:
     node render_forces_svgs.js [outdir]                                 */
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
var mod = require("./forces-diagrams.js");
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
  /* P1 motion graphs: both scenarios x key kinds + distractor */
  ["motion_dt_walk", "motion_graph", { kind: "distance_time", scenario: "walk_to_shops" }],
  ["motion_st_walk", "motion_graph", { kind: "displacement_time", scenario: "walk_to_shops" }],
  ["motion_speedt_walk", "motion_graph", { kind: "speed_time", scenario: "walk_to_shops" }],
  ["motion_vt_walk", "motion_graph", { kind: "velocity_time", scenario: "walk_to_shops" }],
  ["motion_dt_bus", "motion_graph", { kind: "distance_time", scenario: "bus_journey" }],
  ["motion_vt_bus", "motion_graph", { kind: "velocity_time", scenario: "bus_journey" }],
  ["motion_at_bus", "motion_graph", { kind: "acceleration_time", scenario: "bus_journey" }],
  ["motion_dt_walk_DISTRACTOR_curved", "motion_graph",
    { kind: "distance_time", scenario: "walk_to_shops", variant: "curved_constant" }],
  /* P1 area + gradient */
  ["area_braking_curve", "area_under_vt", { preset: "braking_curve" }],
  ["area_accel_cruise", "area_under_vt", { preset: "accelerate_cruise" }],
  ["gradient_line", "gradient_tool", { curve: "line" }],
  ["gradient_curve_tangent", "gradient_tool", { curve: "curve" }],
  ["gradient_curve_DISTRACTOR_chord", "gradient_tool", { curve: "curve", variant: "chord" }],
  /* P2 braking/stopping */
  ["braking_base", "braking_vt", { condition: "base" }],
  ["braking_fast", "braking_vt", { condition: "fast" }],
  ["braking_wet_road", "braking_vt", { condition: "wet_road" }],
  ["braking_tired_driver", "braking_vt", { condition: "tired_driver" }],
  ["braking_DISTRACTOR_rising", "braking_vt", { variant: "rising_reaction" }],
  ["braking_DISTRACTOR_sloped", "braking_vt", { variant: "sloped_reaction" }],
  ["braking_DISTRACTOR_curved", "braking_vt", { variant: "curved_brake" }],
  ["stopping_distance_speed", "stopping_distance_speed", {}],
  ["stopping_DISTRACTOR_think_quad", "stopping_distance_speed", { variant: "thinking_quadratic" }],
  /* P3 FBDs */
  ["fbd_car_constant", "free_body_diagram", { preset: "car_constant_speed" }],
  ["fbd_car_accel", "free_body_diagram", { preset: "car_accelerating" }],
  ["fbd_falling_terminal", "free_body_diagram", { preset: "falling_terminal", object: "ball" }],
  ["fbd_falling_speeding", "free_body_diagram", { preset: "falling_speeding_up", object: "ball" }],
  ["ramp_block", "ramp_fbd", { angle: 30, friction: true }],
  ["ramp_resolved", "ramp_fbd", { angle: 30, resolve: true }],
  ["ramp_DISTRACTOR_weight_slope", "ramp_fbd", { angle: 30, variant: "weight_along_slope" }],
  ["ramp_DISTRACTOR_normal_vert", "ramp_fbd", { angle: 30, variant: "normal_vertical" }],
  /* P4 vectors */
  ["vector_scale_345", "vector_addition", { method: "scale" }],
  ["vector_maths_345", "vector_addition", { method: "maths" }],
  ["vector_DISTRACTOR_scalar", "vector_addition",
    { quantity: "displacement", variant: "distance_scalar" }],
  /* P5 springs */
  ["spring_single", "spring_extension", { arrangement: "single", masses: 2 }],
  ["spring_series", "spring_extension", { arrangement: "series", masses: 2 }],
  ["spring_parallel", "spring_extension", { arrangement: "parallel", masses: 2 }],
  ["spring_DISTRACTOR_total", "spring_extension", { arrangement: "single", masses: 2, variant: "total_as_extension" }],
  /* P6 collisions */
  ["collision_sticky", "collision_illustration", { type: "sticky" }],
  ["collision_bouncy", "collision_illustration", { type: "bouncy", m1: 1, m2: 1, u1: 4 }],
  ["collision_explosion", "collision_illustration", { type: "explosion", m1: 1, m2: 2, v2: 2 }],
  /* v2: author-specified everything */
  ["v2_area_regions_ABC", "area_under_vt", { phases: [{ dur: 10, v0: 0, v1: 12 }, { dur: 20, v0: 12, v1: 12 }, { dur: 10, v0: 12, v1: 0 }],
    axes: { xmax: 40, xstep: 5, ymax: 14, ystep: 2, minorDiv: 4, xlabel: "time / s", ylabel: "velocity / m/s" },
    display: "regions", mark: { areaValues: true } }],
  ["v2_area_none_unaided", "area_under_vt", { phases: [{ dur: 4, v0: 0, v1: 8 }, { dur: 6, v0: 8, v1: 8 }],
    axes: { xmax: 10, xstep: 2, ymax: 10, ystep: 2, minorDiv: 4, xlabel: "time / s", ylabel: "velocity / m/s" },
    display: "none" }],
  ["v2_area_squares_author_curve", "area_under_vt", { phases: [{ dur: 6, v0: 12, v1: 0, shape: "curve_down" }],
    axes: { xmax: 6, xstep: 2, ymax: 12, ystep: 4, minorDiv: 4, xlabel: "time / s", ylabel: "velocity / m/s" },
    display: "squares" }],
  ["v2_motion_asymptote_terminal", "motion_graph", { kind: "velocity_time",
    phases: [{ dur: 8, v0: 0, v1: 10, shape: "asymptote" }, { dur: 4, v0: 10, v1: 10 }],
    axes: { xmax: 12, xstep: 2, ymax: 12, ystep: 2, minorDiv: 5, xlabel: "time / s", ylabel: "velocity / m/s" } }],
  ["v2_motion_over_top", "motion_graph", { kind: "velocity_time",
    phases: [{ dur: 6, v0: 2, v1: 8, shape: "over_top" }],
    axes: { xmax: 6, xstep: 1, ymax: 12, ystep: 2, minorDiv: 5, xlabel: "time / s", ylabel: "velocity / m/s" } }],
  ["v2_gradient_author_asymptote", "gradient_tool", { fspec: { type: "asymptote", A: 10, k: 0.5 },
    domain: [0, 8], axes: { xmax: 8, xstep: 1, ymax: 10, ystep: 2, minorDiv: 5, xlabel: "time / s", ylabel: "velocity / m/s" },
    tangentAt: 2, slopeUnits: "m/s²" }],
  ["v2_gradient_unmarked", "gradient_tool", { curve: "curve",
    mark: { working: false, deltas: false, dropLines: false } }],
  ["v2_braking_compare_wet_key", "braking_vt", { condition: "base", keyLabel: "dry road",
    compare: [{ condition: "wet_road", label: "wet road" }],
    mark: { areas: false, values: false, caption: false, dropLines: false } }],
  ["v2_vector_no_resultant", "vector_addition", { method: "scale",
    mark: { resultant: false, protractor: false } }],
  /* wave 2: sprites + resolving */
  ["w2_fbd_car_sprite", "free_body_diagram", { preset: "car_accelerating", object: "car" }],
  ["w2_fbd_boat_sprite", "free_body_diagram", { object: "boat",
    forces: [ { name: "weight", dir: "down", mag: 10 }, { name: "upthrust", dir: "up", mag: 10 },
              { name: "thrust", dir: "right", mag: 6 }, { name: "water resistance", dir: "left", mag: 6 } ] }],
  ["w2_fbd_person_sprite", "free_body_diagram", { object: "person",
    forces: [ { name: "weight", dir: "down", mag: 8 }, { name: "normal contact force", dir: "up", mag: 8 } ] }],
  ["w2_fbd_car_trailer", "free_body_diagram", { object: "car_trailer",
    forces: [ { name: "weight", dir: "down", mag: 14 }, { name: "normal contact force", dir: "up", mag: 14 },
              { name: "driving force", dir: "right", mag: 9 }, { name: "resistive forces", dir: "left", mag: 6 } ] }],
  ["w2_collision_cars", "collision_illustration", { type: "sticky", object1: "car", object2: "car", m1: 2, m2: 1, u1: 3 }],
  ["w2_collision_boat_person", "collision_illustration", { type: "explosion", object1: "boat", object2: "person", m1: 4, m2: 1, v2: 2 }],
  ["w2_resolve_calculation", "vector_resolve", { method: "calculation" }],
  ["w2_resolve_triples", "vector_resolve", { mag: 26, angle: 22.62, method: "triples", unitsPerBox: 5 }],
  ["w2_resolve_scale", "vector_resolve", { method: "scale" }],
  ["w2_resolve_DISTRACTOR_swapped", "vector_resolve", { variant: "sin_cos_swapped" }],
  ["w3_fbd_car_faces_right", "free_body_diagram", { preset: "car_accelerating", object: "car" }],
  ["w3_fbd_car_faces_left", "free_body_diagram", { object: "car", facing: "left",
    forces: [ { name: "weight", dir: "down", mag: 12 }, { name: "normal contact force", dir: "up", mag: 12 },
              { name: "driving force", dir: "left", mag: 10 }, { name: "resistive forces", dir: "right", mag: 5 } ] }],
  ["w3_collision_head_on", "collision_illustration", { type: "sticky", object1: "car", object2: "car",
    m1: 2, m2: 1, u1: 3, u2: -3 }],
  ["w3_boat_faces_left", "free_body_diagram", { object: "boat", facing: "left",
    forces: [ { name: "weight", dir: "down", mag: 10 }, { name: "upthrust", dir: "up", mag: 10 },
              { name: "thrust", dir: "left", mag: 6 }, { name: "water resistance", dir: "right", mag: 6 } ] }]
];
var failures = 0;
jobs.forEach(function (j) {
  try {
    var node = reg[j[1]](j[2]);
    if (!node || node.nodeName !== "svg") throw new Error("did not return an <svg>");
    var svg = '<?xml version="1.0" encoding="UTF-8"?>\n' + strip(serialize(node));
    fs.writeFileSync(dir + "/" + j[0] + ".svg", svg);
    console.log("wrote " + j[0] + ".svg");
  } catch (e) {
    failures++;
    console.log("FAIL " + j[0] + ": " + e.message);
  }
});
console.log(jobs.length - failures + "/" + jobs.length + " kinds rendered");
process.exit(failures ? 1 : 0);
