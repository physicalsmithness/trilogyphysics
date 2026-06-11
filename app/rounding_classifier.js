/* ============================================================================
   Electric Circuits Mastery — rounding classifier, v1 (M2.x per d032).
   ----------------------------------------------------------------------------
   Implements the four hooks Architecture specified in AUTHORING_BRIEF.md
   v0.12 §3b (rounding-variant near-miss classification):

     1. Read author overrides off a numeric template's `rounding_variants:`
        block; validate against the formula evaluator's trace.
     2. Evaluate the rounded-intermediate path per author variant: substitute
        params into `intermediate`, evaluate, round to `sig_figs` under
        `regime`, then continue the answer formula with that rounded value
        substituted for the matching AST sub-expression.
     3. Engine-derived sweep: when no author variant matches, run the five
        default rounding regimes (2 sig figs, 3 sig figs, truncate,
        round_half_up, round_half_to_even) across every plausible
        intermediate the trace surfaces. Match within 0.5%.
     4. Verdict: correct (within 2% of formal answer; classifier skipped),
        half_rounding (within 0.5% of an author variant — slug + feedback
        from the variant; within 0.5% of an engine-derived variant — slug
        `rounding_mistake` + generic engine string), or wrong.

   Non-applicability: skip for concrete (non-template) items, symbolic-R
   templates, qualitative templates, and unit-prefix misses (those stay as
   regular distractors with `unit_prefix_not_converted` / `units_off_by_factor`).

   Public API exposed via window.CircuitsRoundingClassifier:

     classify(item, learnerValue) -> verdict
        Returns { status, slug, feedback, exact_value, exact_intermediate,
                  rounded_intermediate, sig_figs, regime, source } where
        source is "correct" | "author" | "engine" | "wrong".

     round(value, sigFigs, regime) -> number
        Round to N significant figures under one of the regimes.

     astEqual(a, b) -> boolean
        Deep structural equality on the formula evaluator's AST nodes.

     evaluateWithIntermediateReplaced(answerAst, intermediateAst, value, params)
                                            -> number | null

     DEFAULT_TOLERANCE_PCT_CORRECT = 2
     DEFAULT_TOLERANCE_PCT_VARIANT = 0.5
     DEFAULT_REGIMES = ["round_half_up", "round_half_to_even", "truncate",
                        "round_half_up_3sf", "round_half_up_2sf"]
   ============================================================================ */

(function () {
  "use strict";

  if (!window.CircuitsFormula) {
    console.warn("RoundingClassifier: CircuitsFormula not loaded; classifier disabled.");
    return;
  }
  const F = window.CircuitsFormula;

  const DEFAULT_TOLERANCE_PCT_CORRECT = 2;
  const DEFAULT_TOLERANCE_PCT_VARIANT = 0.5;
  const DEFAULT_REGIMES = ["round_half_up", "round_half_to_even", "truncate"];
  const DEFAULT_SIG_FIGS_SWEEP = [2, 3];

  /* ──────────────────────────────────────────────────────────────────────────
     1. Rounding to N significant figures under a regime.
     ────────────────────────────────────────────────────────────────────────── */

  function round(value, sigFigs, regime) {
    if (!Number.isFinite(value) || value === 0) return value;
    const sign = value < 0 ? -1 : 1;
    const abs = Math.abs(value);
    const magnitude = Math.floor(Math.log10(abs));
    const factor = Math.pow(10, sigFigs - 1 - magnitude);
    const scaled = abs * factor;

    let rounded;
    if (regime === "round_half_up") {
      rounded = Math.floor(scaled + 0.5);
    } else if (regime === "round_half_to_even") {
      // Banker's rounding.
      const floor = Math.floor(scaled);
      const diff = scaled - floor;
      if (diff < 0.5) rounded = floor;
      else if (diff > 0.5) rounded = floor + 1;
      else rounded = (floor % 2 === 0) ? floor : floor + 1;
    } else if (regime === "truncate") {
      rounded = Math.floor(scaled);
    } else if (regime === "ceil") {
      rounded = Math.ceil(scaled);
    } else if (regime === "floor") {
      rounded = Math.floor(scaled);
    } else {
      // Unknown regime: fall back to round_half_up.
      rounded = Math.floor(scaled + 0.5);
    }
    return sign * rounded / factor;
  }

  /* ──────────────────────────────────────────────────────────────────────────
     2. AST equality + walk-and-replace.
     ────────────────────────────────────────────────────────────────────────── */

  function astEqual(a, b) {
    if (a === b) return true;
    if (!a || !b || a.type !== b.type) return false;
    switch (a.type) {
      case "num":   return a.value === b.value;
      case "param": return a.name === b.name;
      case "ident": return a.name === b.name;
      case "unary": return a.op === b.op && astEqual(a.operand, b.operand);
      case "binop": return a.op === b.op && astEqual(a.left, b.left) && astEqual(a.right, b.right);
      case "call": {
        if (a.name !== b.name) return false;
        if (a.args.length !== b.args.length) return false;
        for (let i = 0; i < a.args.length; i++) {
          if (!astEqual(a.args[i], b.args[i])) return false;
        }
        return true;
      }
    }
    return false;
  }

  // Walk the AST returning a new AST with the FIRST sub-node matching `target`
  // replaced by `replacement`. Returns the unmodified AST if no match.
  function walkAndReplace(ast, target, replacement) {
    if (!ast) return ast;
    if (astEqual(ast, target)) return replacement;
    switch (ast.type) {
      case "num":
      case "param":
      case "ident":
        return ast;
      case "unary":
        return { type: "unary", op: ast.op, operand: walkAndReplace(ast.operand, target, replacement) };
      case "binop":
        return {
          type: "binop", op: ast.op,
          left:  walkAndReplace(ast.left,  target, replacement),
          right: walkAndReplace(ast.right, target, replacement)
        };
      case "call":
        return {
          type: "call", name: ast.name,
          args: ast.args.map(function (a) { return walkAndReplace(a, target, replacement); })
        };
    }
    return ast;
  }

  /* ──────────────────────────────────────────────────────────────────────────
     3. Evaluate answer with a rounded intermediate substituted in.
     Returns null when the intermediate AST does not appear in the answer AST
     (the variant declaration is then defer-but-warn).
     ────────────────────────────────────────────────────────────────────────── */

  function evaluateWithIntermediateReplaced(answerAst, intermediateAst, replacementValue, params) {
    const replacement = { type: "num", value: replacementValue };
    const modified = walkAndReplace(answerAst, intermediateAst, replacement);
    // Detect "no replacement happened" by re-checking equality.
    if (astEqual(modified, answerAst)) return null;
    try { return F.evalAst(modified, params, null); }
    catch (e) { return null; }
  }

  /* ──────────────────────────────────────────────────────────────────────────
     4. Author-variant matching.
     ────────────────────────────────────────────────────────────────────────── */

  function matchAuthorVariant(variant, item, learnerValue) {
    if (!item.answer || typeof item.answer.formula !== "string") return null;
    if (typeof variant.intermediate !== "string") return null;
    const sigFigs = Number.isInteger(variant.sig_figs) ? variant.sig_figs : 3;
    const regime = variant.regime || "round_half_up";
    const tolerancePct = Number.isFinite(variant.tolerance_pct)
                       ? variant.tolerance_pct : DEFAULT_TOLERANCE_PCT_VARIANT;
    const params = item.sample || {};

    let answerAst, intermediateAst, exactIntermediate;
    try {
      answerAst = F.parse(F.tokenize(item.answer.formula));
      intermediateAst = F.parse(F.tokenize(variant.intermediate));
      exactIntermediate = F.evalAst(intermediateAst, params, null);
    } catch (e) {
      console.warn("RoundingClassifier: author variant '" + variant.name + "' failed to parse:", e.message);
      return null;
    }
    if (!Number.isFinite(exactIntermediate)) return null;

    const roundedIntermediate = round(exactIntermediate, sigFigs, regime);
    const roundedPathAnswer = evaluateWithIntermediateReplaced(
      answerAst, intermediateAst, roundedIntermediate, params
    );
    if (roundedPathAnswer === null) {
      console.warn("RoundingClassifier: author variant '" + variant.name
                 + "' intermediate '" + variant.intermediate
                 + "' does not appear in the answer formula's AST; skipping.");
      return null;
    }
    if (!Number.isFinite(roundedPathAnswer)) return null;

    if (!withinPercent(learnerValue, roundedPathAnswer, tolerancePct)) return null;

    return {
      matched: true,
      kind: "author",
      variant: variant,
      exact_intermediate: exactIntermediate,
      rounded_intermediate: roundedIntermediate,
      rounded_path_answer: roundedPathAnswer,
      sig_figs: sigFigs,
      regime: regime
    };
  }

  /* ──────────────────────────────────────────────────────────────────────────
     5. Engine-derived sweep across trace intermediates.
     ────────────────────────────────────────────────────────────────────────── */

  function sweepEngineDerived(item, learnerValue) {
    if (!item.answer || typeof item.answer.formula !== "string") return null;
    const params = item.sample || {};

    let answerAst;
    try {
      answerAst = F.parse(F.tokenize(item.answer.formula));
    } catch (e) { return null; }

    // Gather intermediate sub-AST nodes worth considering. Strategy: collect
    // every internal node (binop / unary / call) of the answer AST. Each is a
    // candidate intermediate.
    const candidates = [];
    function walk(node) {
      if (!node) return;
      if (node.type === "binop" || node.type === "unary" || node.type === "call") {
        candidates.push(node);
      }
      if (node.type === "binop") { walk(node.left); walk(node.right); }
      if (node.type === "unary") walk(node.operand);
      if (node.type === "call") node.args.forEach(walk);
    }
    walk(answerAst);

    let bestHit = null;
    candidates.forEach(function (candidate) {
      // Skip the whole answer AST itself; that would just round the final value.
      if (astEqual(candidate, answerAst)) return;
      let exactIntermediate;
      try { exactIntermediate = F.evalAst(candidate, params, null); }
      catch (e) { return; }
      if (!Number.isFinite(exactIntermediate)) return;

      DEFAULT_SIG_FIGS_SWEEP.forEach(function (sf) {
        DEFAULT_REGIMES.forEach(function (regime) {
          const roundedIntermediate = round(exactIntermediate, sf, regime);
          if (roundedIntermediate === exactIntermediate) return; // no actual rounding happened
          const roundedPath = evaluateWithIntermediateReplaced(
            answerAst, candidate, roundedIntermediate, params
          );
          if (!Number.isFinite(roundedPath)) return;
          if (withinPercent(learnerValue, roundedPath, DEFAULT_TOLERANCE_PCT_VARIANT)) {
            const delta = Math.abs(learnerValue - roundedPath);
            if (!bestHit || delta < bestHit.delta) {
              bestHit = {
                matched: true,
                kind: "engine",
                exact_intermediate: exactIntermediate,
                rounded_intermediate: roundedIntermediate,
                rounded_path_answer: roundedPath,
                sig_figs: sf,
                regime: regime,
                delta: delta
              };
            }
          }
        });
      });
    });
    return bestHit;
  }

  /* ──────────────────────────────────────────────────────────────────────────
     6. The public classify() entry point.
     ────────────────────────────────────────────────────────────────────────── */

  function isApplicable(item) {
    if (!item || typeof item !== "object") return false;
    // The classifier rides on parametric numeric templates. Concrete items,
    // symbolic-R templates, qualitative templates are out of scope per §3b.
    if (item.flavor && item.flavor !== "numeric") return false;
    if (item.symbolic_R === true) return false;
    if (item.mode === "qual") return false;
    if (!item.answer || typeof item.answer.formula !== "string") return false;
    return true;
  }

  function withinPercent(learner, target, pct) {
    if (!Number.isFinite(learner) || !Number.isFinite(target)) return false;
    if (target === 0) return Math.abs(learner) <= pct / 100;
    return Math.abs((learner - target) / target) * 100 <= pct;
  }

  function classify(item, learnerValue) {
    if (!isApplicable(item)) {
      return { status: "wrong", source: "not_applicable", slug: null, feedback: null };
    }
    const params = item.sample || {};
    let answerValue;
    try {
      answerValue = F.evaluate(item.answer.formula, params);
    } catch (e) {
      return { status: "wrong", source: "answer_eval_failed", slug: null, feedback: null };
    }
    if (!Number.isFinite(answerValue)) {
      return { status: "wrong", source: "answer_nonfinite", slug: null, feedback: null };
    }

    const correctTolerance = Number.isFinite(item.answer.tolerance_pct)
                           ? item.answer.tolerance_pct : DEFAULT_TOLERANCE_PCT_CORRECT;
    if (withinPercent(learnerValue, answerValue, correctTolerance)) {
      return {
        status: "correct",
        source: "correct",
        slug: null,
        feedback: null,
        exact_value: answerValue
      };
    }

    // Author variants first.
    const variants = Array.isArray(item.rounding_variants) ? item.rounding_variants : [];
    for (let i = 0; i < variants.length; i++) {
      const hit = matchAuthorVariant(variants[i], item, learnerValue);
      if (hit) {
        const bindings = Object.assign({}, params, {
          value: learnerValue,
          answer: answerValue,
          exact_intermediate: hit.exact_intermediate,
          rounded_intermediate: hit.rounded_intermediate,
          sig_figs: hit.sig_figs,
          regime: hit.regime
        });
        return {
          status: "half_rounding",
          source: "author",
          slug: hit.variant.misconception || "rounding_mistake",
          feedback: hit.variant.feedback_template
            ? F.substitute(hit.variant.feedback_template, bindings)
            : null,
          exact_value: answerValue,
          exact_intermediate: hit.exact_intermediate,
          rounded_intermediate: hit.rounded_intermediate,
          sig_figs: hit.sig_figs,
          regime: hit.regime,
          variant_name: hit.variant.name
        };
      }
    }

    // Engine-derived sweep.
    const engineHit = sweepEngineDerived(item, learnerValue);
    if (engineHit) {
      const feedback = "Within 0.5% of the answer you would get by rounding "
        + F.formatValue(engineHit.exact_intermediate)
        + " to " + engineHit.sig_figs + " sig figs under " + engineHit.regime
        + " (you would get " + F.formatValue(engineHit.rounded_path_answer)
        + "; the unrounded answer is " + F.formatValue(answerValue) + ").";
      return {
        status: "half_rounding",
        source: "engine",
        slug: "rounding_mistake",
        feedback: feedback,
        exact_value: answerValue,
        exact_intermediate: engineHit.exact_intermediate,
        rounded_intermediate: engineHit.rounded_intermediate,
        sig_figs: engineHit.sig_figs,
        regime: engineHit.regime
      };
    }

    return {
      status: "wrong",
      source: "wrong",
      slug: null,
      feedback: null,
      exact_value: answerValue
    };
  }

  /* ──────────────────────────────────────────────────────────────────────────
     7. Public surface.
     ────────────────────────────────────────────────────────────────────────── */

  window.CircuitsRoundingClassifier = {
    classify: classify,
    round: round,
    astEqual: astEqual,
    walkAndReplace: walkAndReplace,
    evaluateWithIntermediateReplaced: evaluateWithIntermediateReplaced,
    matchAuthorVariant: matchAuthorVariant,
    sweepEngineDerived: sweepEngineDerived,
    isApplicable: isApplicable,
    withinPercent: withinPercent,
    DEFAULT_TOLERANCE_PCT_CORRECT: DEFAULT_TOLERANCE_PCT_CORRECT,
    DEFAULT_TOLERANCE_PCT_VARIANT: DEFAULT_TOLERANCE_PCT_VARIANT,
    DEFAULT_REGIMES: DEFAULT_REGIMES,
    DEFAULT_SIG_FIGS_SWEEP: DEFAULT_SIG_FIGS_SWEEP,
    VERSION: "v1"
  };

})();
