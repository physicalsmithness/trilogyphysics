/* ============================================================================
   Electric Circuits Mastery — formula evaluator, v1.
   ----------------------------------------------------------------------------
   Per d025 (the small formula evaluator scope) + d032 (the hybrid rounding
   classifier's eventual hook into intermediate values) + the four extension
   asks Architecture bundled in M2 v9 (pi as a named constant; exponent
   operator via `**` and `pow`; inline unit conversions like `r/1000` which
   the arithmetic already covers; named builtins min/max/abs).

   Public API exposed via `window.CircuitsFormula`:

     evaluate(expr, params, options?) -> number | { value, trace }
        Evaluate a formula string against a parameter map. With options.trace
        set to true, returns { value, trace } where trace is the ordered list
        of intermediate (binop / call) results, available to the M2.x rounding
        classifier so it can simulate per-step rounding without a re-parse.

     substitute(template, bindings) -> string
        Replace {name} slots in a template string with bindings[name]. Numeric
        values are formatted via formatValue() for display. Unknown slots are
        left as `{name}` literally so the renderer can surface authoring
        problems (a missing slot is a bug; silently dropping it is worse).

     formatValue(v) -> string
        Format a numeric value to ~4 significant figures, stripping trailing
        zeros. Integers come through unchanged.

     tokenize, parse, evalAst, VERSION
        Internals exposed for tests and for the M2.x rounding classifier to
        rebuild on top.

   Grammar (precedence low to high, right-associative for `**`):

     expr   = term  (('+' | '-') term)*
     term   = power (('*' | '/') power)*
     power  = unary ('**' power)?
     unary  = '-' unary | '+' unary | call
     call   = IDENT '(' arglist ')'   |  atom
     atom   = NUM | IDENT | PARAM | '(' expr ')'
     PARAM  = '{' word '}'
     IDENT  = letter (letter | digit)*    (e.g. pi, min, max, abs)
     NUM    = digit+ ('.' digit+)? (('e' | 'E') ('+' | '-')? digit+)?

   Identifiers reserved as constants: pi, Pi, PI, e (Euler's number).
   Identifiers reserved as builtins: min, max, abs, sqrt, pow.

   Errors: thrown as Error with a "formula: <message>" prefix and the
   character or token offset where possible.
   ============================================================================ */

(function () {
  "use strict";

  /* ──────────────────────────────────────────────────────────────────────────
     1. Tokenizer.
     ────────────────────────────────────────────────────────────────────────── */

  function tokenize(expr) {
    if (typeof expr !== "string") throw new Error("formula: expression must be a string");
    const tokens = [];
    const n = expr.length;
    let i = 0;
    while (i < n) {
      const c = expr[i];
      if (/\s/.test(c)) { i++; continue; }

      // {param} — bracketed parameter reference.
      if (c === "{") {
        const end = expr.indexOf("}", i);
        if (end === -1) throw new Error("formula: unmatched '{' at " + i);
        const name = expr.slice(i + 1, end).trim();
        if (!name) throw new Error("formula: empty parameter at " + i);
        tokens.push({ type: "PARAM", name: name, pos: i });
        i = end + 1;
        continue;
      }

      // Number (with optional decimal and exponent).
      // A leading "." is OK if followed by a digit.
      const isDigit = c >= "0" && c <= "9";
      const isDotDigit = c === "." && (i + 1 < n) && expr[i + 1] >= "0" && expr[i + 1] <= "9";
      if (isDigit || isDotDigit) {
        let j = i;
        while (j < n && expr[j] >= "0" && expr[j] <= "9") j++;
        if (expr[j] === ".") {
          j++;
          while (j < n && expr[j] >= "0" && expr[j] <= "9") j++;
        }
        if (expr[j] === "e" || expr[j] === "E") {
          j++;
          if (expr[j] === "+" || expr[j] === "-") j++;
          while (j < n && expr[j] >= "0" && expr[j] <= "9") j++;
        }
        const numText = expr.slice(i, j);
        const value = parseFloat(numText);
        if (!Number.isFinite(value)) throw new Error("formula: bad number '" + numText + "' at " + i);
        tokens.push({ type: "NUM", value: value, text: numText, pos: i });
        i = j;
        continue;
      }

      // ** before single * so we lex the exponent correctly.
      if (c === "*" && expr[i + 1] === "*") {
        tokens.push({ type: "POW", pos: i });
        i += 2;
        continue;
      }

      // Single-character operators and punctuation.
      if (c === "+" || c === "-" || c === "*" || c === "/") {
        tokens.push({ type: "OP", op: c, pos: i });
        i++;
        continue;
      }
      if (c === "(") { tokens.push({ type: "LP", pos: i }); i++; continue; }
      if (c === ")") { tokens.push({ type: "RP", pos: i }); i++; continue; }
      if (c === ",") { tokens.push({ type: "COMMA", pos: i }); i++; continue; }

      // Identifier (constants and built-in functions).
      if (/[A-Za-z_]/.test(c)) {
        let j = i;
        while (j < n && /[A-Za-z0-9_]/.test(expr[j])) j++;
        tokens.push({ type: "IDENT", name: expr.slice(i, j), pos: i });
        i = j;
        continue;
      }

      throw new Error("formula: unexpected character '" + c + "' at " + i);
    }
    return tokens;
  }

  /* ──────────────────────────────────────────────────────────────────────────
     2. Recursive-descent parser.
     ────────────────────────────────────────────────────────────────────────── */

  function parse(tokens) {
    let pos = 0;
    function peek(off) { return tokens[pos + (off || 0)]; }
    function eat(t) {
      if (peek() && peek().type === t) { pos++; return tokens[pos - 1]; }
      return null;
    }
    function expect(t) {
      const tok = eat(t);
      if (!tok) {
        const got = peek() ? peek().type : "EOF";
        throw new Error("formula: expected " + t + ", got " + got + " at token " + pos);
      }
      return tok;
    }

    function parseExpr() {
      let left = parseTerm();
      while (peek() && peek().type === "OP" && (peek().op === "+" || peek().op === "-")) {
        const op = peek().op; pos++;
        const right = parseTerm();
        left = { type: "binop", op: op, left: left, right: right };
      }
      return left;
    }
    function parseTerm() {
      let left = parsePower();
      while (peek() && peek().type === "OP" && (peek().op === "*" || peek().op === "/")) {
        const op = peek().op; pos++;
        const right = parsePower();
        left = { type: "binop", op: op, left: left, right: right };
      }
      return left;
    }
    // Right-associative power.
    function parsePower() {
      const left = parseUnary();
      if (peek() && peek().type === "POW") {
        pos++;
        const right = parsePower();
        return { type: "binop", op: "**", left: left, right: right };
      }
      return left;
    }
    function parseUnary() {
      if (peek() && peek().type === "OP" && peek().op === "-") {
        pos++;
        return { type: "unary", op: "-", operand: parseUnary() };
      }
      if (peek() && peek().type === "OP" && peek().op === "+") {
        pos++;
        return parseUnary();
      }
      return parseCall();
    }
    function parseCall() {
      if (peek() && peek().type === "IDENT" && peek(1) && peek(1).type === "LP") {
        const name = peek().name;
        pos += 2; // consume IDENT and LP
        const args = [];
        if (peek() && peek().type !== "RP") {
          args.push(parseExpr());
          while (eat("COMMA")) args.push(parseExpr());
        }
        expect("RP");
        return { type: "call", name: name, args: args };
      }
      return parseAtom();
    }
    function parseAtom() {
      const t = peek();
      if (!t) throw new Error("formula: unexpected end of expression");
      if (t.type === "NUM")   { pos++; return { type: "num", value: t.value }; }
      if (t.type === "IDENT") { pos++; return { type: "ident", name: t.name }; }
      if (t.type === "PARAM") { pos++; return { type: "param", name: t.name }; }
      if (t.type === "LP") {
        pos++;
        const e = parseExpr();
        expect("RP");
        return e;
      }
      throw new Error("formula: unexpected token " + t.type + " at position " + pos);
    }

    const ast = parseExpr();
    if (pos < tokens.length) {
      throw new Error("formula: trailing tokens after position " + pos
                    + " (next: " + tokens[pos].type + ")");
    }
    return ast;
  }

  /* ──────────────────────────────────────────────────────────────────────────
     3. Evaluator.
     ────────────────────────────────────────────────────────────────────────── */

  const CONSTANTS = {
    pi: Math.PI, Pi: Math.PI, PI: Math.PI,
    e:  Math.E
  };
  const BUILTINS = {
    min:  function () { return Math.min.apply(null, arguments); },
    max:  function () { return Math.max.apply(null, arguments); },
    abs:  function (x) { return Math.abs(x); },
    sqrt: function (x) { return Math.sqrt(x); },
    pow:  function (b, e) { return Math.pow(b, e); }
  };

  function evalAst(ast, params, trace) {
    switch (ast.type) {
      case "num":
        return ast.value;
      case "param": {
        if (params == null || !(ast.name in params)) {
          throw new Error("formula: unbound parameter '" + ast.name + "'");
        }
        const v = params[ast.name];
        if (typeof v !== "number") {
          throw new Error("formula: parameter '" + ast.name + "' is not numeric: " + v);
        }
        return v;
      }
      case "ident":
        if (ast.name in CONSTANTS) return CONSTANTS[ast.name];
        throw new Error("formula: unknown identifier '" + ast.name + "'");
      case "unary": {
        const v = evalAst(ast.operand, params, trace);
        const r = (ast.op === "-") ? -v : +v;
        if (trace) trace.push({ kind: "unary", op: ast.op, args: [v], result: r });
        return r;
      }
      case "binop": {
        const l = evalAst(ast.left, params, trace);
        const r = evalAst(ast.right, params, trace);
        let result;
        switch (ast.op) {
          case "+":  result = l + r; break;
          case "-":  result = l - r; break;
          case "*":  result = l * r; break;
          case "/":  result = l / r; break;
          case "**": result = Math.pow(l, r); break;
          default: throw new Error("formula: unknown binop '" + ast.op + "'");
        }
        if (trace) trace.push({ kind: "binop", op: ast.op, args: [l, r], result: result });
        return result;
      }
      case "call": {
        if (!(ast.name in BUILTINS)) {
          throw new Error("formula: unknown function '" + ast.name + "'");
        }
        const args = ast.args.map(function (a) { return evalAst(a, params, trace); });
        const result = BUILTINS[ast.name].apply(null, args);
        if (trace) trace.push({ kind: "call", name: ast.name, args: args, result: result });
        return result;
      }
    }
    throw new Error("formula: unknown ast type '" + ast.type + "'");
  }

  function evaluate(expr, params, options) {
    const tokens = tokenize(expr);
    const ast = parse(tokens);
    if (options && options.trace) {
      const trace = [];
      const value = evalAst(ast, params || {}, trace);
      return { value: value, trace: trace };
    }
    return evalAst(ast, params || {}, null);
  }

  /* ──────────────────────────────────────────────────────────────────────────
     4. String substitution + numeric formatting.
     ────────────────────────────────────────────────────────────────────────── */

  function formatValue(v) {
    if (typeof v !== "number") return String(v);
    if (!Number.isFinite(v)) return String(v);
    if (Number.isInteger(v)) return String(v);
    // Round to 4 significant figures by default.
    const sig = 4;
    if (v === 0) return "0";
    const abs = Math.abs(v);
    const exp = Math.floor(Math.log10(abs)) + 1;   // number of digits before decimal
    const factor = Math.pow(10, sig - exp);
    const rounded = Math.round(v * factor) / factor;
    let s = rounded.toString();
    // Strip trailing zeros in the fractional part, then a trailing dot.
    if (s.indexOf(".") !== -1) {
      s = s.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
    }
    return s;
  }

  // Replace {name} slots in a template string. Bindings are looked up by name;
  // unknown slots are left as `{name}` literally so the renderer surfaces them.
  function substitute(template, bindings) {
    if (template == null) return "";
    return String(template).replace(/\{([A-Za-z_][A-Za-z0-9_]*)\}/g,
      function (match, name) {
        if (bindings && (name in bindings)) return formatValue(bindings[name]);
        return match;
      });
  }

  window.CircuitsFormula = {
    tokenize: tokenize,
    parse: parse,
    evalAst: evalAst,
    evaluate: evaluate,
    substitute: substitute,
    formatValue: formatValue,
    CONSTANTS: CONSTANTS,
    BUILTINS: BUILTINS,
    VERSION: "v1"
  };

})();
