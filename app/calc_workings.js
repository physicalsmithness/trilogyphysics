/* ============================================================================
   Trilogy Physics — calc_workings marks-the-method grader, v1 (verbatim lift)
   ----------------------------------------------------------------------------
   LIFTED VERBATIM from the Pre-IB engine (preibphysics/new/engine.js,
   v1.5.22–v1.5.26, §3b-bis "calc_workings type" + §3b-ter error taxonomy),
   fetched from https://physicalsmithness.github.io/preibphysics/ . This is the
   real four-line structured-calculation grader d016 (engine blend) calls for,
   replacing the value-only interim. The functions below are the Pre-IB source
   unchanged; only the wrapper (IIFE + statusFromFraction + the window export at
   the foot) is Trilogy glue. Keeping the lift verbatim makes a later Pre-IB /
   Trilogy convergence cheap (q-shared-engine).

   The grader parses user-entered equations for the four lines:
     line1  the equation            e.g. "R = V / I"
     line2  the substitution        e.g. "R = 6.0 / 0.50"
     line3  the rearranged eval     e.g. "R = 12"
     line4  final value + unit      value "12", unit "Ω"
   and marks each line independently, so method earns credit even when the
   arithmetic slips. Per-line failures map to canonical error-type codes.

   Public surface: window.TrilogyCalcWorkings = {
     markCalcWorkings(q, lines), ERROR_TYPES, calcDeriveErrorTypes,
     // plus the parser internals, exposed for tests:
     calcTokenize, calcParseEqn, calcEval, calcSymbols, calcNormEqn
   }

   The `q` (item.calc) contract authors write to:
     { knowns:{SYM:value,...}, unknown:"R", expectedFinalValue:12,
       expectedUnit:["Ω","ohm"], equationCanonicalForms:["R=V/I",...],
       tolerance?, requireUnit?=true, allowRepeat?=false, marks?=4 }
   ============================================================================ */

(function () {
  "use strict";

  function statusFromFraction(awarded, possible) {
    if (possible <= 0) return "none";
    var f = awarded / possible;
    if (f >= 0.999) return "full";
    if (f <= 0.001) return "none";
    return "partial";
  }

  // Tokenize an expression or equation string.
  function calcTokenize(str) {
    const tokens = [];
    const s = String(str || "")
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/[−–—]/g, "-")
      .trim();
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9.]/.test(c)) {
        // Number, possibly with e-notation
        let j = i + 1;
        while (j < s.length) {
          if (/[0-9.]/.test(s[j])) { j++; continue; }
          if ((s[j] === "e" || s[j] === "E") && j + 1 < s.length) {
            j++;
            if (s[j] === "+" || s[j] === "-") j++;
            continue;
          }
          break;
        }
        const numStr = s.slice(i, j);
        const num = parseFloat(numStr);
        if (!isFinite(num)) { tokens.push({ kind: "unknown", value: numStr }); }
        else tokens.push({ kind: "num", value: num });
        i = j;
      } else if (/[a-zA-Z]/.test(c)) {
        // Single-character symbol (multi-char treated as separate; physics symbols are one letter)
        tokens.push({ kind: "sym", value: c });
        i++;
      } else if ("+-*/".indexOf(c) !== -1) {
        tokens.push({ kind: "op", value: c });
        i++;
      } else if (c === "(") { tokens.push({ kind: "lparen" }); i++; }
      else if (c === ")") { tokens.push({ kind: "rparen" }); i++; }
      else if (c === "=") { tokens.push({ kind: "eq" }); i++; }
      else { tokens.push({ kind: "unknown", value: c }); i++; }
    }
    return tokens;
  }

  // Parse a token stream into an AST. Recursive descent. Returns [ast, nextPos].
  function calcParseExpr(tokens, pos) {
    function parsePrimary(p) {
      const t = tokens[p];
      if (!t) throw new Error("Unexpected end");
      if (t.kind === "num") return [{ kind: "num", value: t.value }, p + 1];
      if (t.kind === "sym") {
        // Implicit multiplication: "IR" is two adjacent syms — treat as I*R
        let node = { kind: "sym", value: t.value };
        let p2 = p + 1;
        while (tokens[p2] && tokens[p2].kind === "sym") {
          node = { kind: "binop", op: "*", left: node, right: { kind: "sym", value: tokens[p2].value } };
          p2++;
        }
        // Number-then-sym (e.g. "2I"): handle in higher level via primary chain
        return [node, p2];
      }
      if (t.kind === "lparen") {
        const [expr, p2] = parseAddSub(p + 1);
        if (tokens[p2] && tokens[p2].kind === "rparen") return [expr, p2 + 1];
        throw new Error("Missing )");
      }
      if (t.kind === "op" && (t.value === "-" || t.value === "+")) {
        const [expr, p2] = parsePrimary(p + 1);
        if (t.value === "-") return [{ kind: "neg", arg: expr }, p2];
        return [expr, p2];
      }
      throw new Error("Unexpected token: " + JSON.stringify(t));
    }
    function parseImplicit(p) {
      // Handle "2I" as 2*I
      let [left, p2] = parsePrimary(p);
      while (tokens[p2] && (tokens[p2].kind === "sym" || tokens[p2].kind === "lparen")) {
        const [right, p3] = parsePrimary(p2);
        left = { kind: "binop", op: "*", left: left, right: right };
        p2 = p3;
      }
      return [left, p2];
    }
    function parseMulDiv(p) {
      let [left, p2] = parseImplicit(p);
      while (tokens[p2] && tokens[p2].kind === "op" && (tokens[p2].value === "*" || tokens[p2].value === "/")) {
        const op = tokens[p2].value;
        const [right, p3] = parseImplicit(p2 + 1);
        left = { kind: "binop", op: op, left: left, right: right };
        p2 = p3;
      }
      return [left, p2];
    }
    function parseAddSub(p) {
      let [left, p2] = parseMulDiv(p);
      while (tokens[p2] && tokens[p2].kind === "op" && (tokens[p2].value === "+" || tokens[p2].value === "-")) {
        const op = tokens[p2].value;
        const [right, p3] = parseMulDiv(p2 + 1);
        left = { kind: "binop", op: op, left: left, right: right };
        p2 = p3;
      }
      return [left, p2];
    }
    return parseAddSub(pos);
  }

  // Parse "left = right" into { left: AST, right: AST }.
  function calcParseEqn(str) {
    const tokens = calcTokenize(str);
    let eqIdx = -1;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].kind === "eq") { eqIdx = i; break; }
    }
    if (eqIdx === -1) throw new Error("No '=' in equation");
    const leftToks = tokens.slice(0, eqIdx);
    const rightToks = tokens.slice(eqIdx + 1);
    if (leftToks.length === 0 || rightToks.length === 0) throw new Error("Empty side");
    const [left] = calcParseExpr(leftToks, 0);
    const [right] = calcParseExpr(rightToks, 0);
    return { left: left, right: right };
  }

  // Evaluate an AST given a variable bindings object.
  function calcEval(ast, vars) {
    if (!ast) throw new Error("Null AST");
    if (ast.kind === "num") return ast.value;
    if (ast.kind === "sym") {
      if (vars && Object.prototype.hasOwnProperty.call(vars, ast.value)) return vars[ast.value];
      throw new Error("Unbound symbol: " + ast.value);
    }
    if (ast.kind === "neg") return -calcEval(ast.arg, vars);
    if (ast.kind === "binop") {
      const l = calcEval(ast.left, vars);
      const r = calcEval(ast.right, vars);
      if (ast.op === "+") return l + r;
      if (ast.op === "-") return l - r;
      if (ast.op === "*") return l * r;
      if (ast.op === "/") return l / r;
    }
    throw new Error("Unknown AST kind: " + ast.kind);
  }

  // Collect all symbols in an AST.
  function calcSymbols(ast) {
    const out = {};
    function walk(node) {
      if (!node) return;
      if (node.kind === "sym") out[node.value] = true;
      if (node.kind === "neg") walk(node.arg);
      if (node.kind === "binop") { walk(node.left); walk(node.right); }
    }
    walk(ast);
    return out;
  }

  // Light normalization for line 1 exact-match comparison.
  function calcNormEqn(str) {
    return String(str || "")
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/[−–—]/g, "-")
      .replace(/\s+/g, "")
      .toLowerCase();
  }

  // v1.5.24: pre-tokenizer normalisation for lines 1-3 of calc_workings.
  // Lowercases everything (case-insensitive symbol matching), normalises
  // typographic operators, and replaces standalone `x` with `*` when `x` is
  // not in the question's symbol set (knowns + unknown, lowercased).
  // Lets students write `2x5` instead of `2 × 5` or `2 * 5` at GCSE level.
  function calcPreNorm(str, lowerSymSet) {
    let s = String(str || "")
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/[−–—]/g, "-")
      .toLowerCase();
    if (!lowerSymSet["x"]) {
      // Replace `x` with `*` whenever it's a standalone letter (not part of
      // a longer identifier — but our tokens are single-letter anyway).
      s = s.replace(/x/g, "*");
    }
    return s;
  }

  // Build lowercased knowns + lowercased unknown for case-insensitive eval.
  function calcLowerVars(knowns, unknown, unknownVal) {
    const out = {};
    Object.keys(knowns || {}).forEach(function (k) {
      out[String(k).toLowerCase()] = knowns[k];
    });
    const u = unknown ? String(unknown).toLowerCase() : "";
    if (u && unknownVal !== null && unknownVal !== undefined) {
      out[u] = unknownVal;
    }
    return { vars: out, unknownLower: u };
  }

  // Collect numeric literals appearing in an AST. Used to detect whether
  // a line shows substitution (line 2) vs is purely symbolic (line 1).
  function calcCollectNumericLiterals(ast) {
    const out = [];
    function walk(node) {
      if (!node) return;
      if (node.kind === "num") out.push(node.value);
      if (node.kind === "neg") walk(node.arg);
      if (node.kind === "binop") { walk(node.left); walk(node.right); }
    }
    walk(ast);
    return out;
  }

  // The marker: per-line check, returns marksAwarded out of 4 plus per-line
  // results so the renderer can show which line the student got wrong.
  function markCalcWorkings(q, lines) {
    const knowns = (q.knowns && typeof q.knowns === "object") ? q.knowns : {};
    const unknown = q.unknown || "";
    const expectedFinalValue = (typeof q.expectedFinalValue === "number") ? q.expectedFinalValue : null;
    // v1.5.23: case-sensitive unit matching. In physics V (volts) ≠ v (velocity);
    // mA ≠ Ma. Only whitespace is stripped before comparison.
    const expectedUnit = Array.isArray(q.expectedUnit)
      ? q.expectedUnit.map(function (u) { return String(u || "").trim(); })
      : [];
    const tolerance = (typeof q.tolerance === "number") ? q.tolerance
                    : Math.max(Math.abs(expectedFinalValue || 0) * 0.005, 0.0001);
    const allowRepeat = !!q.allowRepeat;
    const requireUnit = q.requireUnit !== false;
    const possible = q.marks || 4;

    const l1 = (lines && lines.line1) ? String(lines.line1) : "";
    const l2 = (lines && lines.line2) ? String(lines.line2) : "";
    const l3 = (lines && lines.line3) ? String(lines.line3) : "";
    const l4Value = (lines && lines.line4Value) ? String(lines.line4Value) : "";
    const l4Unit = (lines && lines.line4Unit) ? String(lines.line4Unit) : "";

    const lineResults = [];
    let awarded = 0;

    // v1.5.24: build lowercased symbol set for case-insensitive line 1-3 marking.
    const lowerSymSet = {};
    Object.keys(knowns).forEach(function (k) { lowerSymSet[String(k).toLowerCase()] = true; });
    if (unknown) lowerSymSet[String(unknown).toLowerCase()] = true;
    const lvUnknown = calcLowerVars(knowns, unknown, expectedFinalValue);
    const varsKnown = calcLowerVars(knowns, null, null).vars; // knowns only, no unknown bound

    // Line 1: equation match. Two paths:
    //   (a) Fast literal match against equationCanonicalForms (exact after norm).
    //   (b) Algebraic equivalence: parse user's equation, substitute knowns
    //       plus unknown=expectedFinalValue, accept if both sides agree.
    // v1.5.24: case-insensitive symbol matching; `x` accepted as multiplication.
    const canonical = (q.equationCanonicalForms || []).map(calcNormEqn);
    const l1Norm = calcNormEqn(l1);
    let line1Ok = l1Norm !== "" && canonical.indexOf(l1Norm) !== -1;
    let line1Reason = "";
    if (!line1Ok) {
      if (l1.trim() === "") {
        line1Reason = "Write the equation here (e.g. as shown in the data booklet).";
      } else if (expectedFinalValue !== null) {
        try {
          const eqn = calcParseEqn(calcPreNorm(l1, lowerSymSet));
          const allSyms = Object.assign({}, calcSymbols(eqn.left), calcSymbols(eqn.right));
          let unboundSym = null;
          Object.keys(allSyms).forEach(function (s) {
            if (!Object.prototype.hasOwnProperty.call(lvUnknown.vars, s)) unboundSym = s;
          });
          if (unboundSym) {
            line1Reason = "Unknown symbol '" + unboundSym + "' in your equation. Use the variables given in the question.";
          } else {
            const lhs = calcEval(eqn.left, lvUnknown.vars);
            const rhs = calcEval(eqn.right, lvUnknown.vars);
            if (isFinite(lhs) && isFinite(rhs) && Math.abs(lhs - rhs) <= tolerance) {
              line1Ok = true;
            } else {
              line1Reason = "The two sides don't balance. Check the equation.";
            }
          }
        } catch (e) {
          line1Reason = "Couldn't read this as an equation. Check operators and brackets.";
        }
      }
    }
    if (line1Ok) awarded++;
    lineResults.push({ line: 1, ok: line1Ok, user: l1, reason: line1Reason });

    // Line 2: substitution. v1.5.24: rewritten to use the algebraic-equivalence
    // approach. Requirements:
    //   (a) The equation must contain at least one numeric literal — line 2 is
    //       where the student "plugs in the values".
    //   (b) The equation must be algebraically consistent under knowns +
    //       unknown=expectedFinalValue (i.e., both sides agree numerically).
    // This means natural rearranged-substitution like `5 = V/2` (when line 1
    // was R = V/I) is accepted, not just the canonical `V = 2 × 5`.
    let line2Ok = false;
    let line2Reason = "";
    if (l2.trim() === "") {
      line2Reason = "Write the equation again with the known values plugged in.";
    } else if (expectedFinalValue !== null) {
      try {
        const eqn = calcParseEqn(calcPreNorm(l2, lowerSymSet));
        const numLits = calcCollectNumericLiterals(eqn.left).concat(calcCollectNumericLiterals(eqn.right));
        if (numLits.length === 0) {
          line2Reason = "You haven't substituted any numbers. Line 2 should show the values plugged in.";
        } else {
          const allSyms = Object.assign({}, calcSymbols(eqn.left), calcSymbols(eqn.right));
          let unboundSym = null;
          Object.keys(allSyms).forEach(function (s) {
            if (!Object.prototype.hasOwnProperty.call(lvUnknown.vars, s)) unboundSym = s;
          });
          if (unboundSym) {
            line2Reason = "Unknown symbol '" + unboundSym + "' in your substitution. Use the variables given in the question.";
          } else {
            const lhs = calcEval(eqn.left, lvUnknown.vars);
            const rhs = calcEval(eqn.right, lvUnknown.vars);
            if (isFinite(lhs) && isFinite(rhs) && Math.abs(lhs - rhs) <= tolerance) {
              line2Ok = true;
            } else {
              line2Reason = "The two sides don't agree. Check that you've used the right values.";
            }
          }
        }
      } catch (e) {
        line2Reason = "Couldn't read this as an equation. Check operators and brackets.";
      }
    }
    if (line2Ok) awarded++;
    lineResults.push({ line: 2, ok: line2Ok, user: l2, reason: line2Reason });

    // Line 3: rearrangement. Unknown should be alone on one side; other side
    // evaluates to expectedFinalValue. If allowRepeat and line3 == line2, accept.
    // v1.5.24: case-insensitive; reason text on failure.
    let line3Ok = false;
    let line3Reason = "";
    if (l3.trim() === "") {
      line3Reason = "Rearrange so the unknown is alone on one side, then evaluate the other side.";
    } else if (allowRepeat && calcNormEqn(l3) === calcNormEqn(l2) && line2Ok) {
      line3Ok = true;
    } else {
      try {
        const eqn = calcParseEqn(calcPreNorm(l3, lowerSymSet));
        const leftSyms = calcSymbols(eqn.left);
        const rightSyms = calcSymbols(eqn.right);
        const leftKeys = Object.keys(leftSyms);
        const rightKeys = Object.keys(rightSyms);
        const uLower = lvUnknown.unknownLower;
        const unknownInLeft = !!leftSyms[uLower];
        const unknownInRight = !!rightSyms[uLower];
        const allSyms = Object.assign({}, leftSyms, rightSyms);
        let unboundSym = null;
        Object.keys(allSyms).forEach(function (s) {
          if (s !== uLower && !Object.prototype.hasOwnProperty.call(varsKnown, s)) unboundSym = s;
        });
        if (unboundSym) {
          line3Reason = "Unknown symbol '" + unboundSym + "' in your line. Use the variables given in the question.";
        } else if (unknownInLeft && leftKeys.length === 1 && !rightSyms[uLower]) {
          const val = calcEval(eqn.right, varsKnown);
          if (expectedFinalValue !== null && Math.abs(val - expectedFinalValue) <= tolerance) {
            line3Ok = true;
          } else {
            line3Reason = "Right-hand side evaluates to " + val + ", not " + expectedFinalValue + ".";
          }
        } else if (unknownInRight && rightKeys.length === 1 && !leftSyms[uLower]) {
          const val = calcEval(eqn.left, varsKnown);
          if (expectedFinalValue !== null && Math.abs(val - expectedFinalValue) <= tolerance) {
            line3Ok = true;
          } else {
            line3Reason = "Left-hand side evaluates to " + val + ", not " + expectedFinalValue + ".";
          }
        } else if (!unknownInLeft && !unknownInRight) {
          line3Reason = "Your line doesn't contain the unknown '" + unknown + "'.";
        } else {
          line3Reason = "The unknown '" + unknown + "' should be alone on one side.";
        }
      } catch (e) {
        line3Reason = "Couldn't read this as an equation. Check operators and brackets.";
      }
    }
    if (line3Ok) awarded++;
    lineResults.push({ line: 3, ok: line3Ok, user: l3, reason: line3Reason });

    // Line 4: final answer (numeric value) + unit. v1.5.24: per-fault reasons.
    let line4Ok = false;
    let line4Reason = "";
    let valueStr = l4Value.trim();
    // Strip optional "X = " prefix (case-insensitive — we don't penalise V/v here).
    if (unknown) {
      const prefixRe = new RegExp("^\\s*" + unknown + "\\s*=\\s*", "i");
      valueStr = valueStr.replace(prefixRe, "");
    }
    valueStr = valueStr.replace(/[−–—]/g, "-").trim();
    const numMatch = valueStr.match(/^[+\-]?[\d.]+(?:[eE][+\-]?\d+)?/);
    if (valueStr === "" && l4Unit.trim() === "") {
      line4Reason = "Write the final answer and its unit.";
    } else if (!numMatch || expectedFinalValue === null) {
      if (valueStr === "") {
        line4Reason = "Write the final numeric answer.";
      } else {
        line4Reason = "Couldn't read '" + valueStr + "' as a number.";
      }
    } else {
      const value = parseFloat(numMatch[0]);
      const valueOk = isFinite(value) && Math.abs(value - expectedFinalValue) <= tolerance;
      const userUnit = l4Unit.trim();  // v1.5.23: case-sensitive
      const unitOk = !requireUnit || (userUnit !== "" && expectedUnit.indexOf(userUnit) !== -1);
      if (valueOk && unitOk) {
        line4Ok = true;
      } else if (!valueOk && !unitOk) {
        line4Reason = "Value " + value + " doesn't match the expected " + expectedFinalValue +
                      ", and the unit '" + (userUnit || "(missing)") + "' isn't accepted.";
      } else if (!valueOk) {
        line4Reason = "Value " + value + " doesn't match the expected " + expectedFinalValue + ".";
      } else if (!unitOk) {
        if (userUnit === "") {
          line4Reason = "Don't forget the unit.";
        } else {
          // Case-sensitive failure detection: did they get the right letters but wrong case?
          const userLower = userUnit.toLowerCase();
          const matchesLower = expectedUnit.some(function (u) { return u.toLowerCase() === userLower; });
          if (matchesLower) {
            line4Reason = "Unit case matters: try '" + (expectedUnit[0] || "") + "' instead of '" + userUnit + "'.";
          } else {
            line4Reason = "Unit '" + userUnit + "' isn't one of the accepted units (" + expectedUnit.join(", ") + ").";
          }
        }
      }
    }
    if (line4Ok) awarded++;
    const userLine4Display = ((l4Value || "").trim() + (l4Unit ? " " + l4Unit : "")).trim() || "(blank)";
    lineResults.push({ line: 4, ok: line4Ok, user: userLine4Display, reason: line4Reason });

    // v1.5.26: derive canonical error-type codes from the line-level reasons.
    // Soft launch — these are stored on the attempt record but NOT shown to
    // the student. See ERROR_TYPES registry below for the canonical code list
    // and Smith's hand-marking taxonomy in project_error_taxonomy.md memory.
    const errorTypes = calcDeriveErrorTypes(lineResults);

    return {
      marksAwarded: awarded,
      marksPossible: possible,
      status: statusFromFraction(awarded, possible),
      lineResults: lineResults,
      errorTypes: errorTypes,
      calcLines: lines
    };
  }

  /* ──────────────────────────────────────────────────────────────────────────
     3b-ter. Error-type taxonomy (v1.5.26, added 2026-05-10)

     Smith's hand-marking taxonomy mapped to canonical codes. Each code is
     snake_case and stable; the display label can change without breaking
     stored data. Two label variants: `internal` (Smith / teacher view, uses
     Smith's terminology like "SubF") and `student` (gentler; not shown yet
     but reserved).

     Currently populated only for calc_workings line-level errors (Band 1 of
     the taxonomy). Band 2 (dimensioned knowns, prefix conversions, expected
     form) will land as schema additions; Band 3 (question-shape metadata) is
     parked; Band 4 (descriptive / conceptual) is partially covered by the
     per-distractor MCQ tagging (v1.5.26 schema; not yet authored).
     ────────────────────────────────────────────────────────────────────────── */

  const ERROR_TYPES = {
    // ── calc_workings line-level codes (v1.5.26) ────────────────────────────
    // Emitted automatically by calcDeriveErrorTypes from per-line reasons.
    // Line 1 (equation)
    equation_wrong:           { internal: "Wrong equation",        student: "The equation isn't quite right." },
    equation_made_up:         { internal: "Made an equation up",   student: "The equation doesn't follow from the data." },
    equation_blank:           { internal: "Left blank (equation)", student: "No equation written." },
    equation_unknown_symbol:  { internal: "Unknown symbol",        student: "Used a variable that isn't in the question." },
    // Line 2 (substitution)
    sub_failure:              { internal: "SubF",                  student: "Values weren't substituted in." },
    sub_inconsistent:         { internal: "SubP / calc",           student: "Substitution doesn't balance, wrong value or arithmetic." },
    // Line 3 (rearrangement)
    algebra_error:            { internal: "Algebra errors",        student: "Rearrangement isn't right." },
    rearrange_not_isolated:   { internal: "Algebra errors",        student: "Unknown not isolated on one side." },
    rearrange_blank:          { internal: "Calc unattempted",      student: "No rearrangement attempted." },
    // Line 4 (final answer)
    value_wrong:              { internal: "Calculation error",     student: "Final value doesn't match." },
    unit_missing:             { internal: "unit",                  student: "Unit missing." },
    unit_wrong_case:          { internal: "unit",                  student: "Unit case matters." },
    unit_wrong:               { internal: "unit",                  student: "Unit isn't accepted." },
    final_unreadable:         { internal: "Care",                  student: "Final answer isn't a number." },
    // Catch-all
    parse_error:              { internal: "Randomly combines numbers", student: "Couldn't read this line." },

    // ── MCQ distractor-tagged codes (v1.5.29, ratified 2026-06-09) ──────────
    // Authors apply these to MCQ distractors via distractorErrorTypes per d095.
    // Set unified from Topic 7 (concept_swap, property_value_swap, false_dependency,
    // false_consequence, magnitude_wrong, context_inversion → direction_reversed)
    // and Topic 8 (stage_confusion → concept_swap, simpler_model_persistence,
    // scope_leakage, direction_reversed, pattern_transferred, causation_inverted)
    // batches. geostationary_misconception rejected as too specific (lives in
    // commonMisconceptions per question).
    concept_swap:             { internal: "Concept swap",          student: "Picked another concept's identity." },
    property_value_swap:      { internal: "Property value swap",   student: "Right concept, wrong specific value." },
    false_dependency:         { internal: "False dependency",      student: "Treats one thing as depending on another when it doesn't." },
    false_consequence:        { internal: "False consequence",     student: "Wrong outcome attributed to the process." },
    causation_inverted:       { internal: "Causation inverted",    student: "Causal chain read in the wrong direction." },
    magnitude_wrong:          { internal: "Magnitude wrong",       student: "Right kind, wrong order of magnitude." },
    direction_reversed:       { internal: "Direction reversed",    student: "Right relationship, wrong direction or context." },
    simpler_model_persistence:{ internal: "Simpler-model persistence", student: "An earlier or simpler model applied past its scope." },
    scope_leakage:            { internal: "Scope leakage",         student: "Fact from outside the syllabus." },
    pattern_transferred:      { internal: "Pattern transferred",   student: "Behaviour from one entity applied to another." }
  };

  // Map a single line's failure reason to one or more canonical error codes.
  // Mapping is deterministic by reason-string content (the reasons are author-
  // controlled fixed strings emitted by markCalcWorkings).
  function calcLineToErrorCodes(line, reason) {
    if (!reason) return [];
    const r = reason.toLowerCase();
    const out = [];
    if (line === 1) {
      if (r.indexOf("write the equation") === 0) out.push("equation_blank");
      else if (r.indexOf("unknown symbol") === 0) out.push("equation_unknown_symbol");
      else if (r.indexOf("two sides don't balance") !== -1) out.push("equation_wrong");
      else if (r.indexOf("couldn't read") !== -1) out.push("equation_made_up");
    } else if (line === 2) {
      if (r.indexOf("plugged in") !== -1 && r.indexOf("again") !== -1) out.push("sub_failure"); // blank line
      else if (r.indexOf("haven't substituted any numbers") !== -1) out.push("sub_failure");
      else if (r.indexOf("unknown symbol") === 0) out.push("equation_unknown_symbol");
      else if (r.indexOf("two sides don't agree") !== -1) out.push("sub_inconsistent");
      else if (r.indexOf("couldn't read") !== -1) out.push("parse_error");
    } else if (line === 3) {
      if (r.indexOf("rearrange so the unknown is alone") !== -1) out.push("rearrange_blank");
      else if (r.indexOf("unknown symbol") === 0) out.push("equation_unknown_symbol");
      else if (r.indexOf("unknown") !== -1 && r.indexOf("alone on one side") !== -1) out.push("rearrange_not_isolated");
      else if (r.indexOf("evaluates to") !== -1 && r.indexOf("not") !== -1) out.push("algebra_error");
      else if (r.indexOf("doesn't contain the unknown") !== -1) out.push("rearrange_not_isolated");
      else if (r.indexOf("couldn't read") !== -1) out.push("parse_error");
    } else if (line === 4) {
      if (r.indexOf("write the final answer") !== -1) out.push("rearrange_blank");
      else if (r.indexOf("couldn't read") !== -1 && r.indexOf("as a number") !== -1) out.push("final_unreadable");
      else if (r.indexOf("unit case matters") !== -1) out.push("unit_wrong_case");
      else if (r.indexOf("don't forget the unit") !== -1) out.push("unit_missing");
      else if (r.indexOf("unit") !== -1 && r.indexOf("isn't one of the accepted") !== -1) out.push("unit_wrong");
      else if (r.indexOf("value") !== -1 && r.indexOf("doesn't match") !== -1) {
        out.push("value_wrong");
        if (r.indexOf("unit") !== -1) out.push("unit_wrong");
      }
    }
    return out;
  }

  // Aggregate per-line error codes into a deduped list for the whole question.
  function calcDeriveErrorTypes(lineResults) {
    const seen = {};
    const out = [];
    (lineResults || []).forEach(function (lr) {
      if (lr.ok) return;
      calcLineToErrorCodes(lr.line, lr.reason).forEach(function (code) {
        if (!seen[code]) { seen[code] = true; out.push(code); }
      });
    });
    return out;
  }

  window.TrilogyCalcWorkings = {
    markCalcWorkings: markCalcWorkings,
    ERROR_TYPES: ERROR_TYPES,
    calcDeriveErrorTypes: calcDeriveErrorTypes,
    calcLineToErrorCodes: calcLineToErrorCodes,
    calcTokenize: calcTokenize,
    calcParseEqn: calcParseEqn,
    calcEval: calcEval,
    calcSymbols: calcSymbols,
    calcNormEqn: calcNormEqn,
    statusFromFraction: statusFromFraction
  };
})();
