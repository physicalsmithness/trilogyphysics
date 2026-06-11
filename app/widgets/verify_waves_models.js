/* Headless physics assertions for WavesModels (no DOM). Run:
     node verify_waves_models.js
   Mirrors verify_forces_models.js: pure model + pure scorers, so Housing
   can re-score stored attempts and Architecture can audit the physics.   */
var W = require("./waves-diagrams.js").Models;
var pass = 0, fail = 0;
function ok(c, m) { if (c) { pass++; } else { fail++; console.error("FAIL: " + m); } }
function close(a, b, t) { return Math.abs(a - b) <= (t || 1e-6); }

/* --- wave equation + transverse model --- */
ok(close(W.waveSpeed(2, 3), 6), "v = f*lambda");
ok(close(W.frequency(6, 3), 2), "f = v/lambda");
ok(close(W.wavelengthFrom(6, 2), 3), "lambda = v/f");
ok(close(W.frequencyFromCount(10, 4), 2.5), "f = count/time");
var m = W.wave({ wavelength: 4, amplitude: 2, cycles: 2 });
ok(close(m.crests[0], 1), "first crest at lambda/4");
ok(close(m.troughs[0], 3), "first trough at 3lambda/4");
ok(close(m.crests[1] - m.crests[0], 4), "crest spacing = lambda");
ok(m.features.amplitude.orientation === "vertical" && close(m.features.amplitude.length, 2), "amplitude = A, vertical");
ok(m.features.wavelength.orientation === "horizontal" && close(m.features.wavelength.length, 4), "wavelength horizontal");
ok(close(m.features.half_wavelength.length, 2), "half wavelength = lambda/2");

/* --- longitudinal --- */
var L = W.longitudinal({ wavelength: 4, cycles: 3 });
ok(close(L.compressions[0], 2), "compression at lambda/2");
ok(close(L.rarefactions[0], 0), "rarefaction at 0");
ok(close(L.compressions[1] - L.compressions[0], 4), "compression spacing = lambda");

/* --- refraction: Snell, critical, spacing, vector form --- */
ok(close(W.refractAngle(30, 1.0, 1.5), 19.471, 1e-3), "Snell 30 air->glass");
ok(close(W.refractAngle(0, 1.0, 1.5), 0), "normal incidence no bend");
ok(W.refractAngle(50, 1.5, 1.0) === null, "TIR past critical");
ok(close(W.criticalAngle(1.5, 1.0), 41.81, 1e-2), "critical angle glass->air");
ok(W.criticalAngle(1.0, 1.5) === null, "no critical angle into denser");
ok(close(W.wavefrontSpacingRatio(1.0, 1.5), 2 / 3, 1e-9), "lambda2/lambda1 = n1/n2");
ok(W.bendsTowardNormal(1.0, 1.5) === true && W.bendsTowardNormal(1.5, 1.0) === false, "bend direction");
/* vector Snell: incidence on +x normal, 1->1.5 bends toward normal */
var dr = W.refractDir([Math.cos(40 * Math.PI / 180), Math.sin(40 * Math.PI / 180)], [-1, 0], 1 / 1.5);
var ang = Math.atan2(dr[1], dr[0]) * 180 / Math.PI;
ok(close(ang, 25.37, 0.1), "refractDir angle from normal ~25.4 (" + ang.toFixed(2) + ")");
ok(close(Math.hypot(dr[0], dr[1]), 1, 1e-9), "refractDir returns a unit vector");
ok(W.refractDir([Math.cos(50 * Math.PI / 180), Math.sin(50 * Math.PI / 180)], [-1, 0], 1.5) === null, "refractDir TIR -> null");

/* --- speed of sound / echo --- */
ok(close(W.speedDirect(100, 0.3), 333.33, 1e-2), "v = d/t");
ok(close(W.echoDistance(1500, 0.4), 300), "sonar depth = v t/2");
ok(close(W.echoTime(330, 50), 0.303, 1e-3), "echo time = 2d/v");
ok(close(W.speedFromEcho(660, 4), 330), "v = 2d/t");

/* --- EM spectrum --- */
ok(W.EM.order.length === 7, "seven EM regions");
ok(W.EM.indexOf("radio") === 0 && W.EM.indexOf("gamma") === 6, "radio..gamma ordering");
ok(W.emHigherFrequency("infrared", "ultraviolet") === "ultraviolet", "higher frequency");
ok(W.emLongerWavelength("infrared", "ultraviolet") === "infrared", "longer wavelength");
ok(W.EM.region.gamma.origin.indexOf("nucleus") >= 0, "gamma from nucleus");
ok(/aerial|circuit/.test(W.EM.region.radio.origin), "radio from circuit/aerial");

/* --- scorer: wave marking --- */
function s(a, c) { return W.scoreWaveMark(a, c); }
var cT = { wavelength: 4, amplitude: 2, cycles: 2, kind: "transverse" };
ok(s({ feature: "wavelength", p1: [1, 1], p2: [5, 1] }, cT).marksAwarded === 2, "correct wavelength = 2/2");
ok(s({ feature: "wavelength", p1: [1, 1], p2: [3, 1] }, cT).errorCodes.indexOf("wavelength_half") >= 0, "wavelength_half flagged");
ok(s({ feature: "amplitude", p1: [1, 0], p2: [1, 2] }, cT).marksAwarded === 2, "correct amplitude = 2/2");
var apt = s({ feature: "amplitude", p1: [1, 2], p2: [1, -2] }, cT);
ok(apt.errorCodes.indexOf("amplitude_peak_to_trough") >= 0 && apt.marksAwarded < 2, "amplitude peak-to-trough flagged, not full");
var cL = { wavelength: 4, cycles: 3, kind: "longitudinal" };
ok(s({ feature: "wavelength", p1: [2, 0], p2: [6, 0] }, cL).marksAwarded === 2, "longitudinal wavelength C-to-C = 2/2");
ok(s({ feature: "wavelength", p1: [2, 0], p2: [4, 0] }, cL).errorCodes.indexOf("wavelength_C_to_R") >= 0, "longitudinal C-to-R flagged");

/* --- scorer: refraction --- */
var sr = W.scoreRefraction({ theta2_deg: 19.5 }, { n1: 1, n2: 1.5, theta1: 30 });
ok(sr.marksAwarded === 2, "refraction correct angle = 2/2");
var srw = W.scoreRefraction({ theta2_deg: 40 }, { n1: 1, n2: 1.5, theta1: 30 });
ok(srw.errorCodes.indexOf("bent_wrong_way") >= 0 && srw.marksAwarded < 2, "bent away from normal flagged");
var sre = W.scoreRefraction({ theta2_deg: 30 }, { n1: 1, n2: 1.5, theta1: 30 });
ok(sre.errorCodes.indexOf("equal_angle_no_refraction") >= 0, "no-refraction (i=r) flagged");
var stir = W.scoreRefraction({ tir: true }, { n1: 1.5, n2: 1, theta1: 50 });
ok(stir.marksAwarded === stir.marksPossible, "TIR recognised = full");

/* --- scorer: EM marking --- */
ok(W.scoreEmMark({ region: "gamma" }, { question: "which_end", attribute: "high_frequency" }).marksAwarded === 1, "gamma = high frequency end");
ok(W.scoreEmMark({ region: "radio" }, { question: "which_end", attribute: "high_frequency" }).errorCodes.indexOf("spectrum_ends_swapped") >= 0, "ends swapped flagged");
ok(W.scoreEmMark({ region: "xray" }, { question: "name_region", target: "ultraviolet" }).errorCodes.indexOf("em_off_by_one_region") >= 0, "off-by-one region flagged");

/* --- scorer: scenario reads --- */
ok(W.scoreScenarioRead({ value: 2.5 }, { quantity: "frequency_count", count: 10, time: 4 }).marksAwarded === 1, "frequency from count");
ok(W.scoreScenarioRead({ value: 300 }, { quantity: "sonar_depth", speed: 1500, time: 0.4 }).marksAwarded === 1, "sonar depth read");
var sf2 = W.scoreScenarioRead({ value: 600 }, { quantity: "sonar_depth", speed: 1500, time: 0.4 });
ok(sf2.errorCodes.indexOf("echo_factor_two_missed") >= 0, "forgot factor of 2 flagged");
ok(W.scoreScenarioRead({ value: 4 }, { quantity: "node_count", loops: 3 }).marksAwarded === 1, "nodes = loops + 1");
ok(W.scoreScenarioRead({ value: 3 }, { quantity: "node_count", loops: 3 }).errorCodes.indexOf("counted_loops_not_nodes") >= 0, "counted loops not nodes flagged");
ok(close(W.scenarioExpected({ quantity: "wavelength_standing", length: 1.2, loops: 3 }), 0.8), "standing-wave lambda = 2L/n");

/* --- surfaces --- */
ok(W.bestEmitter(["shiny_silver", "matt_black", "dull_white"]) === "matt_black", "matt black best emitter");

/* --- scorer: refraction QUALITATIVE spacing (Trilogy default) --- */
var sq = W.scoreRefraction({ theta2_deg: 25.4, spacing_change: "closer" }, { n1:1, n2:1.5, theta1:40 });
ok(sq.marksPossible === 3 && sq.marksAwarded === 3, "qualitative: bend+angle+closer = 3/3 (got "+sq.marksAwarded+"/"+sq.marksPossible+")");
var sqs = W.scoreRefraction({ theta2_deg: 25.4, spacing_change: "same" }, { n1:1, n2:1.5, theta1:40 });
ok(sqs.errorCodes.indexOf("spacing_unchanged") >= 0, "qualitative: said spacing same -> spacing_unchanged");
var sqi = W.scoreRefraction({ theta2_deg: 25.4, spacing_change: "further" }, { n1:1, n2:1.5, theta1:40 });
ok(sqi.errorCodes.indexOf("spacing_inverted") >= 0, "qualitative: said further when slowing -> spacing_inverted");
var sqf = W.scoreRefraction({ theta2_deg: 30, spacing_change: "further" }, { n1:1.5, n2:1.0, theta1:20 });
ok(sqf.errorCodes.indexOf("spacing_inverted") < 0, "into faster medium: further apart is correct (no invert flag)");

/* --- scorer: refraction with spacing (drag-the-wavefronts v1.1) --- */
var ss = W.scoreRefraction({ theta2_deg: 25.4, lambda2_over_lambda1: 1/1.5 }, { n1:1, n2:1.5, theta1:40, gradeSpacing:true });
ok(ss.marksPossible === 3 && ss.marksAwarded === 3, "refraction+spacing all correct = 3/3 (got "+ss.marksAwarded+"/"+ss.marksPossible+")");
var ssi = W.scoreRefraction({ theta2_deg: 25.4, lambda2_over_lambda1: 1.5 }, { n1:1, n2:1.5, theta1:40, gradeSpacing:true });
ok(ssi.errorCodes.indexOf("spacing_inverted") >= 0, "spacing inverted (n2/n1) flagged");
var ssu = W.scoreRefraction({ theta2_deg: 25.4, lambda2_over_lambda1: 1.0 }, { n1:1, n2:1.5, theta1:40, gradeSpacing:true });
ok(ssu.errorCodes.indexOf("spacing_unchanged") >= 0, "spacing unchanged flagged");
var ssd = W.scoreRefraction({ theta2_deg: 50, lambda2_over_lambda1: 1/1.5 }, { n1:1, n2:1.5, theta1:40, gradeSpacing:true });
ok(ssd.errorCodes.indexOf("bent_wrong_way")>=0 && ssd.marksAwarded === 1, "wrong angle but right spacing = 1/3 (spacing mark independent)");

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
