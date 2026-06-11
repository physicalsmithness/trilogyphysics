/* ============================================================================
   Trilogy Physics — Magnetism bank migration to SCHEMA v1.0 (ROADMAP M2)
   ----------------------------------------------------------------------------
   Reads the legacy 7_Magnetism/questions.js (window.TRILOGY_MAGEM_QUIZ_QUESTIONS)
   and emits a SCHEMA v1.0 TOPIC_CONFIG for 6.7 plus a migration report.

   MECHANICAL fields are filled (type->qtype, choices->[{text}], answerIndex
   passthrough since the legacy bank is already index-based, markPoints
   passthrough since it is already the {any:[synonyms]} form, difficulty->dN,
   explanation, marks). JUDGMENT fields are flagged on each item under
   `_authoring.needs` for the 6.7 Authoring chat: tier (defaulted FH), the finest
   syllabus_codes, the per-distractor misconception_id, and confirmation of the
   provisional subtag/atom mapping. The subtag/atom registries here are
   PROVISIONAL (derived from the legacy `tags`), placeholders for a ratified 6.7
   vocabulary proposal, exactly as the 6.2 config flagged before ratification.

   Run:  node tools/migrate_magnetism.js
   Out:  app/topics/magnetism_6_7.generated.js
         review/magnetism_migration_report.md
   ============================================================================ */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..");

// load the legacy bank
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "7_Magnetism", "questions.js"), "utf8"), sandbox);
const LEGACY = sandbox.window.TRILOGY_MAGEM_QUIZ_QUESTIONS || [];

// PROVISIONAL tag -> subtag map (Authoring to confirm against the 6.7 spine)
const SUBTAG_OF = {
  poles: "magnets_poles", induced: "magnets_poles",
  fields: "magnetic_fields", compass: "magnetic_fields", plotting: "magnetic_fields",
  wirefield: "electromagnetism", solenoid: "electromagnetism",
  bil: "motor_effect", motoreffect: "motor_effect", units: "motor_effect"
};
const SUBTAGS = [
  { slug: "magnets_poles",   label: "Magnets, poles & induced magnetism" },
  { slug: "magnetic_fields", label: "Magnetic fields & compasses" },
  { slug: "electromagnetism",label: "Electromagnetism (wire & solenoid fields)" },
  { slug: "motor_effect",    label: "The motor effect (F = BIl)" }
];
const ATOM_LABEL = {
  poles: "Poles attract/repel", induced: "Induced magnetism",
  fields: "Field lines", compass: "Compass behaviour", plotting: "Plotting a field line",
  wirefield: "Field around a wire", solenoid: "Solenoid / electromagnet",
  bil: "F = BIl", motoreffect: "Why the force arises", units: "Units in F = BIl"
};
const DIFF = { easy: "d1", med: "d2", hard: "d3" };

function mapQ(q) {
  const tags = q.tags || [];
  const sub = SUBTAG_OF[tags[0]] || "magnets_poles";
  const needs = ["tier", "syllabus_codes", "confirm_subtag_atoms"];
  const item = {
    id: "mag_" + q.id,
    board: "aqa_trilogy_8464",
    topic: "6.7",
    tier: "FH",                 // PROVISIONAL default; Authoring to set F/H/FH
    subtag: sub,
    atoms: tags.slice(),        // PROVISIONAL: legacy tags as atoms
    syllabus_codes: [],         // Authoring (finest 6.7 v3 code)
    difficulty: DIFF[q.difficulty] || "d2",
    prompt: q.prompt,
    explanation: q.explanation || "",
    source: "ported_magnetism_bank"
  };
  if (q.type === "mcq") {
    item.qtype = "mcq";
    item.marks = q.marks || 1;
    item.choices = (q.choices || []).map(function (t) { return { text: t }; });
    item.answerIndex = q.answerIndex;
    needs.push("per_distractor_misconception_id");
  } else if (q.type === "short") {
    item.qtype = "short";
    item.marks = q.marks || 1;
    item.markPoints = q.markPoints || [];
    if (q.expectedSymbolic) item.expectedSymbolic = q.expectedSymbolic;
  } else if (q.type === "numeric") {
    // Legacy numeric -> calc_workings VALUE-ONLY form (servable now via the
    // engine's value-only fallback). Authoring upgrades to the full four-line
    // shape (knowns/unknown/equationCanonicalForms) for method marks.
    item.qtype = "calc_workings";
    item.marks = q.marks || 1;
    var val = (typeof q.answer === "number") ? Number(q.answer.toPrecision(6)) : q.answer;
    item.calc = { answer: { value: val, unit: q.unitHint || "", tolerance: 0.02 } };
    needs.push("upgrade_to_4line_calc_workings");
  } else {
    item.qtype = q.type;
    needs.push("unrecognised_type_review:" + q.type);
  }
  item._authoring = { needs: needs, legacy_id: q.id, legacy_tags: tags, legacy_difficulty: q.difficulty };
  return item;
}

const items = LEGACY.map(mapQ);

// distinct atoms actually used, grouped by subtag
const usedTags = {};
items.forEach(function (it) { (it.atoms || []).forEach(function (t) { usedTags[t] = true; }); });
const ATOMS = Object.keys(usedTags).map(function (t) {
  return { slug: t, label: ATOM_LABEL[t] || t, subtag: SUBTAG_OF[t] || "magnets_poles" };
});

// near-duplicate detection (same prompt + same choices/answer)
const seen = {}, dupGroups = {};
items.forEach(function (it) {
  const key = it.prompt + "||" + (it.choices ? it.choices.map(function (c) { return c.text; }).join("|") + "#" + it.answerIndex : "short");
  (seen[key] = seen[key] || []).push(it.id);
});
Object.keys(seen).forEach(function (k) { if (seen[k].length > 1) dupGroups[k] = seen[k]; });

// emit the generated config
const header = '/* GENERATED by tools/migrate_magnetism.js from the legacy Magnetism bank.\n'
  + '   SCHEMA v1.0 shape; MECHANICAL fields filled, JUDGMENT fields flagged under\n'
  + '   item._authoring.needs for the 6.7 Authoring chat. Subtags/atoms are\n'
  + '   PROVISIONAL (from legacy tags), pending a ratified 6.7 vocabulary proposal.\n'
  + '   Do not hand-edit; re-run the migration or let Authoring fork it. */\n';
const body = "(function(){\n  \"use strict\";\n  window.TRILOGY_TOPICS = window.TRILOGY_TOPICS || {};\n"
  + "  window.TRILOGY_TOPICS[\"6.7\"] = {\n"
  + "    id: \"6.7\", slug: \"magnetism\", name: \"Magnetism & EM\", board: \"aqa_trilogy_8464\",\n"
  + "    provisional_vocab: true,\n"
  + "    subtags: " + JSON.stringify(SUBTAGS) + ",\n"
  + "    atoms: " + JSON.stringify(ATOMS) + ",\n"
  + "    misconceptions: [],\n"
  + "    items: " + JSON.stringify(items, null, 0) + "\n  };\n})();\n";
fs.writeFileSync(path.join(ROOT, "app", "topics", "magnetism_6_7.generated.js"), header + body);

// report
const byType = {}, bySub = {};
items.forEach(function (it) { byType[it.qtype] = (byType[it.qtype] || 0) + 1; bySub[it.subtag] = (bySub[it.subtag] || 0) + 1; });
let rep = "# Magnetism 6.7 migration report (Housing, generated)\n\n";
rep += "Source: `7_Magnetism/questions.js` (legacy `window.TRILOGY_MAGEM_QUIZ_QUESTIONS`).\n";
rep += "Output: `app/topics/magnetism_6_7.generated.js` (SCHEMA v1.0 TOPIC_CONFIG for 6.7).\n\n";
rep += "**" + items.length + " items migrated.**\n\n";
rep += "## By qtype\n\n" + Object.keys(byType).map(function (k) { return "- " + k + ": " + byType[k]; }).join("\n") + "\n\n";
rep += "## By provisional subtag\n\n" + Object.keys(bySub).map(function (k) { return "- " + k + ": " + bySub[k]; }).join("\n") + "\n\n";
rep += "## What is mechanical vs needs Authoring judgment\n\n";
rep += "Mechanical (filled): qtype, choices, answerIndex (already index-based), markPoints (already {any:[...]}), difficulty (easy/med/hard -> d1/d2/d3), explanation, marks.\n\n";
rep += "Needs Authoring judgment (flagged per item under `_authoring.needs`):\n";
rep += "- **tier**: every item defaulted to `FH`; set F / H / FH (motor-effect / induced-potential leanings).\n";
rep += "- **syllabus_codes**: empty; set the finest 6.7 v3 code (review/SYLLABUS_6_7.md).\n";
rep += "- **per_distractor_misconception_id**: MCQ distractors carry no slug yet; tag the diagnostic ones (d004).\n";
rep += "- **confirm_subtag_atoms**: the tag->subtag map and the legacy-tag atoms are provisional; a ratified 6.7 vocabulary proposal supersedes them.\n\n";
rep += "## Near-duplicate groups (legacy padding; Authoring may cull)\n\n";
const dk = Object.keys(dupGroups);
if (!dk.length) rep += "_None detected._\n";
else dk.forEach(function (k) { rep += "- " + dupGroups[k].length + " copies: " + dupGroups[k].join(", ") + "\n"; });
rep += "\n## Provisional tag -> subtag map used\n\n";
Object.keys(SUBTAG_OF).forEach(function (t) { rep += "- `" + t + "` -> " + SUBTAG_OF[t] + "\n"; });
fs.writeFileSync(path.join(ROOT, "review", "magnetism_migration_report.md"), rep);

console.log("migrated " + items.length + " items; qtypes " + JSON.stringify(byType) + "; subtags " + JSON.stringify(bySub) + "; dup groups " + dk.length);
