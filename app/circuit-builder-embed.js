/* ============================================================================
   Electric Circuits Mastery — Circuit Builder embed module, v2.
   ----------------------------------------------------------------------------
   Clean direct extract from the now-complete updated Builder HTML:
     existing htmls/circuit-builder (updated 2026-06-04 with open circuits
                                     and arbitrary labels).html
     Lines 165-1723 (the parser/renderer body, everything before the
     "// ── UI ──" section header). The dropped UI lines 1726-1788 cover
     the textarea/error/SVG-wrap DOM coupling, the EXAMPLES object, the
     button event handlers, and the trailing update() call.

   Supersedes v1, which was built via /tmp/build_embed.py by lifting from
   the older complete Builder and applying d033 deltas as ten anchored
   patches on top. The d033 build was truncated mid-renderCircuit at that
   point; the truncation is now resolved (UPDATES.md, Architecture
   2026-06-05 16:10), so this v2 is a clean direct extract.

   Public API exposed via window.CircuitBuilder:
     renderDSL(dsl: string) -> SVGElement | null   Parse + render. null on parse failure.
     parseDSL(dsl: string)  -> AST                 Parser only.
     VERSION                -> string              Diagnostic tag.

   Internal globals (parse, render, _orientation, all helpers) are kept
   module-scoped by the IIFE. Nothing leaks beyond window.CircuitBuilder.
   ============================================================================ */

(function () {
  "use strict";

//
// ───── Tokenize / preprocess ─────────────────────────────────────────────
//
function preprocess(text) {
  text = text.replace(/\/\/[^\n]*/g, '');
  let out = '', depth = 0;
  for (const c of text) {
    if (c === '(' || c === '[' || c === '{') { depth++; out += c; }
    else if (c === ')' || c === ']' || c === '}') { depth--; out += c; }
    else if (c === '\n') { out += depth === 0 ? ',' : ' '; }
    else out += c;
  }
  return out;
}

function tokenize(text) {
  text = preprocess(text);
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === ',') { tokens.push({ type: 'series' }); i++; continue; }
    if (c === '+') { tokens.push({ type: 'plus' }); i++; continue; }
    if (c === '-') { tokens.push({ type: 'minus' }); i++; continue; }
    if (c === '!') { tokens.push({ type: 'flip' }); i++; continue; }
    if (c === '*') { tokens.push({ type: 'many' }); i++; continue; }
    if (c === '<') { tokens.push({ type: 'chevL' }); i++; continue; }
    if (c === '>') { tokens.push({ type: 'chevR' }); i++; continue; }
    if (c === '|' || c === ';') { tokens.push({ type: 'parsep' }); i++; continue; }
    if (c === ':') { tokens.push({ type: 'topen' }); i++; continue; }
    if (c === '\\') { tokens.push({ type: 'tclose' }); i++; continue; }
    if (c === '/') { tokens.push({ type: 'vwrap' }); i++; continue; }
    if (c === '(' || c === '[' || c === '{') { tokens.push({ type: 'lparen' }); i++; continue; }
    if (c === ')' || c === ']' || c === '}') { tokens.push({ type: 'rparen' }); i++; continue; }
    let j = i;
    while (j < text.length && /[A-Za-z0-9._µμ]/.test(text[j])) j++;
    if (j > i) { tokens.push({ type: 'word', value: text.substring(i, j) }); i = j; continue; }
    i++;
  }
  return tokens;
}

//
// ───── Component lookup ──────────────────────────────────────────────────
//
const SHORT_CODES = {
  c:  { kind: 'cell' },
  cb: { kind: 'battery' },
  b:  { kind: 'battery' },
  bb: { kind: 'bulb' },
  l:  { kind: 'bulb' },
  r:  { kind: 'resistor' },
  vr: { kind: 'varresistor' },
  s:  { kind: 'switch', closed: false },
  sc: { kind: 'switch', closed: true },
  so: { kind: 'switch', closed: false },
  s2: { kind: 'switch2' },
  a:  { kind: 'ammeter' },
  v:  { kind: 'voltmeter' },
  d:  { kind: 'diode' },
  led:{ kind: 'led' },
  f:  { kind: 'fuse' },
  fu: { kind: 'fuse' },
  th: { kind: 'thermistor' },
  ntc:{ kind: 'thermistor' },
  ldr:{ kind: 'ldr' },
  bz: { kind: 'buzzer' },
  buz:{ kind: 'buzzer' },
  sp: { kind: 'speaker' },
  ls: { kind: 'speaker' },
  mic:{ kind: 'microphone' },
  m:  { kind: 'motor' },
  mot:{ kind: 'motor' },
  g:  { kind: 'generator' },
  gen:{ kind: 'generator' },
  e:  { kind: 'earth' },
  gnd:{ kind: 'earth' },
  htr:{ kind: 'heater' },
  pdc:{ kind: 'psdc' },
  pac:{ kind: 'psac' },
  tr: { kind: 'transformer' },
  wire:{ kind: 'wire' },
  w:   { kind: 'wire' },
  pot: { kind: 'pot' },
  vc:  { kind: 'varcell' },
  vb:  { kind: 'varbattery' },
  vcb: { kind: 'varbattery' },
  o:   { kind: 'terminal' },
  term:{ kind: 'terminal' },
};
const LONG_NAMES = {
  cell: 'cell',
  battery: 'battery', bat: 'battery',
  bulb: 'bulb', lamp: 'bulb',
  resistor: 'resistor',
  variable: 'varresistor', rheostat: 'varresistor', varresistor: 'varresistor',
  switch: 'switch', sw: 'switch',
  ammeter: 'ammeter', am: 'ammeter',
  voltmeter: 'voltmeter', vm: 'voltmeter',
  diode: 'diode', fuse: 'fuse', thermistor: 'thermistor',
  buzzer: 'buzzer', bell: 'buzzer', speaker: 'speaker', loudspeaker: 'speaker', microphone: 'microphone',
  motor: 'motor', generator: 'generator',
  earth: 'earth', ground: 'earth',
  heater: 'heater',
  psdc: 'psdc', psac: 'psac',
  transformer: 'transformer',
  wire: 'wire',
  potentiometer: 'pot', pot: 'pot',
  varcell: 'varcell', varbattery: 'varbattery',
};
const SKIP_WORDS = new Set(['cells', 'cell', 'ohms', 'ohm', 'volts', 'volt', 'v', 'amps', 'amp', 'a']);

// SI prefix parsing — splits a unit suffix into (display prefix, base unit).
// Case-sensitive for M/m and G/g; case-insensitive for k, u, n, p.
// Multi-char aliases: `meg` = M (mega), `mu` = µ (micro).
function parseValueSuffix(suffix) {
  if (!suffix) return { prefixDisplay: '', baseUnit: '' };
  const lcAll = suffix.toLowerCase();
  if (lcAll.startsWith('meg')) return { prefixDisplay: 'M', baseUnit: lcAll.substring(3) };
  if (lcAll.startsWith('mu'))  return { prefixDisplay: 'µ', baseUnit: lcAll.substring(2) };
  const c = suffix[0];
  const rest = lcAll.substring(1);
  const SINGLE = {
    p: 'p', n: 'n',
    u: 'µ', U: 'µ', 'µ': 'µ', 'μ': 'µ',
    m: 'm', M: 'M',
    k: 'k', K: 'k',
    g: 'G', G: 'G',
  };
  if (SINGLE[c]) return { prefixDisplay: SINGLE[c], baseUnit: rest };
  return { prefixDisplay: '', baseUnit: lcAll };
}

function resolveComponent(word, args) {
  // Strip subscript suffix first ("s2.1" → main="s2", sub="1")
  let mainPart = word;
  let subscript = null;
  const dotIdx = word.indexOf('.');
  if (dotIdx > 0) {
    mainPart = word.substring(0, dotIdx);
    subscript = word.substring(dotIdx + 1).toLowerCase();
  }

  let kind = null, closed = null;
  let numPre = null, numPost = null, unitPart = null;
  const mainLC = mainPart.toLowerCase();

  // Whole-word lookup catches alphanumeric codes like "s2", "sc", "so", "cb"
  if (SHORT_CODES[mainLC]) {
    kind = SHORT_CODES[mainLC].kind;
    if (SHORT_CODES[mainLC].closed != null) closed = SHORT_CODES[mainLC].closed;
  } else if (LONG_NAMES[mainLC]) {
    kind = LONG_NAMES[mainLC];
  } else {
    // Regex fallback: [Npre]name[Npost][unit]  — unit kept case-sensitive for SI prefixes
    const m = mainPart.match(/^(\d+)?([A-Za-z]+)(\d+)?([A-Za-zµμ]+)?$/);
    if (!m) throw new Error('Bad component: "' + word + '"');
    numPre = m[1] ? parseFloat(m[1]) : null;
    const namePart = m[2].toLowerCase();
    numPost = m[3] ? parseFloat(m[3]) : null;
    unitPart = m[4] || null;             // PRESERVE case so M/m, G/g stay distinct

    if (SHORT_CODES[namePart]) {
      kind = SHORT_CODES[namePart].kind;
      if (SHORT_CODES[namePart].closed != null) closed = SHORT_CODES[namePart].closed;
    } else if (LONG_NAMES[namePart]) {
      kind = LONG_NAMES[namePart];
    } else {
      throw new Error('Unknown component: "' + word + '"');
    }
  }

  const comp = { type: 'component', kind };
  if (closed != null) comp.closed = closed;
  if (subscript != null) comp.subscript = subscript;

  // Assign a numeric reading + optional SI prefix to the appropriate slot on the component.
  function assignNumeric(num, suffix) {
    const u = parseValueSuffix(suffix || '');
    const isPower = kind === 'cell' || kind === 'battery' || kind === 'varcell' || kind === 'varbattery';
    if (u.baseUnit === 'v') {
      if (kind === 'voltmeter') { comp.value = num; comp.valuePrefix = u.prefixDisplay; }
      else if (isPower)         { comp.volts = num; comp.voltsPrefix = u.prefixDisplay; }
      else                      { comp.voltsLabel = num; comp.voltsLabelPrefix = u.prefixDisplay; }
    } else if (u.baseUnit === 'a') {
      if (kind === 'ammeter')   { comp.value = num; comp.valuePrefix = u.prefixDisplay; }
      else                      { comp.ampsLabel = num; comp.ampsLabelPrefix = u.prefixDisplay; }
    } else if (u.baseUnit === 'ohm' || u.baseUnit === 'ohms' || u.baseUnit === 'r') {
      // Explicit ohms. On meters this is the internal resistance (non-ideal meter); elsewhere
      // it's the primary value with Ω as the displayed unit.
      if (kind === 'ammeter' || kind === 'voltmeter') {
        comp.resistance = num; comp.resistancePrefix = u.prefixDisplay;
      } else {
        comp.value = num; comp.valuePrefix = u.prefixDisplay; comp.valueUnit = 'Ω';
      }
    } else {
      if (isPower) { comp.volts = num; comp.voltsPrefix = u.prefixDisplay; }
      else         { comp.value = num; comp.valuePrefix = u.prefixDisplay; }
    }
  }

  if (numPost != null) assignNumeric(numPost, unitPart);
  if (numPre != null && (kind === 'cell' || kind === 'battery' || kind === 'varcell' || kind === 'varbattery')) comp.cells = numPre;

  for (const aRaw of args) {
    const a = aRaw.toLowerCase();
    if (a === 'closed' || a === 'on') comp.closed = true;
    else if (a === 'open' || a === 'off') comp.closed = false;
    else if (a === 'pm' || a === 'polarity') comp.showPolarity = true;
    else if (a === 'fat' || a === 'thick') comp.fat = true;
    else if (a === 'wiggle' || a === 'wiggly') comp.wiggle = true;
    else if (SKIP_WORDS.has(a)) continue;
    else {
      const mm = aRaw.match(/^(\d+(?:\.\d+)?)([A-Za-zµμ]*)$/);  // preserve case for prefix
      if (mm) assignNumeric(parseFloat(mm[1]), mm[2]);
    }
  }
  return comp;
}

//
// ───── Parser ────────────────────────────────────────────────────────────
//
let _orientation = 'vertical'; // 'vertical' = battery top, components bottom; 'horizontal' = battery left, components right

function defaultWall(atom) {
  if (atom.type === 'component') {
    const k = atom.kind;
    const isPower = (k === 'cell' || k === 'battery' || k === 'varcell' || k === 'varbattery' || k === 'psdc' || k === 'psac');
    if (_orientation === 'horizontal') {
      if (isPower) return 'l';
      if (k === 'transformer') return 'r';
      return 'r';
    }
    if (isPower) return 't';
    if (k === 'transformer') return 'r';
  }
  return _orientation === 'horizontal' ? 'r' : 'b';
}

function parse(text) {
  _orientation = 'vertical';
  text = text.replace(/^\s*left\b\s*[,\n]?\s*/i, m => { _orientation = 'horizontal'; return ''; });
  const tokens = tokenize(text);
  let pos = 0;
  const eof = () => pos >= tokens.length;
  const peek = () => tokens[pos];
  const check = t => !eof() && peek().type === t;
  const accept = t => { if (check(t)) { pos++; return true; } return false; };

  function isBoundary() {
    if (eof()) return true;
    const t = peek().type;
    return t === 'parsep' || t === 'rparen' || t === 'topen' || t === 'tclose';
  }
  function isAtomStart() {
    if (eof()) return false;
    const t = peek().type;
    return t === 'word' || t === 'lparen' || t === 'vwrap' || t === 'chevL' || t === 'chevR';
  }

  function parseComponent() {
    if (!check('word')) throw new Error('Expected component name');
    const word = tokens[pos++].value;
    const args = [];
    while (check('word')) args.push(tokens[pos++].value);
    return resolveComponent(word, args);
  }

  function parseAtomNoMod() {
    if (accept('chevR') || accept('chevL')) {
      const dir = tokens[pos - 1].type === 'chevR' ? 'right' : 'left';
      const mark = { type: 'wmark', direction: dir };
      if (check('word')) {
        const w = peek().value;
        const numMatch = w.match(/^(\d+(?:\.\d+)?)([A-Za-zµμ]*)$/);
        if (numMatch) {
          const unitLC = numMatch[2].toLowerCase();
          if (!SHORT_CODES[unitLC] && !LONG_NAMES[unitLC]) {
            pos++;
            const u = parseValueSuffix(numMatch[2]);
            mark.value = parseFloat(numMatch[1]);
            mark.valuePrefix = u.prefixDisplay;
          }
        }
      }
      return mark;
    }
    if (accept('vwrap')) {
      const inner = parseAtomNoMod();
      return { type: 'vacross', child: inner };
    }
    if (accept('lparen')) {
      const branches = [parseSeries()];
      while (accept('parsep')) branches.push(parseSeries());
      if (!accept('rparen')) throw new Error('Missing closing bracket');
      return branches.length === 1 ? branches[0] : { type: 'parallel', children: branches };
    }
    const comp = parseComponent();
    // Allow `!` right after the component name so `pot!(X)` flips the wiper side before binding
    if (accept('flip')) comp.reversed = true;
    // Two-way switch and potentiometer can bind directly to an immediately-following bracket
    if (comp.type === 'component' && (comp.kind === 'switch2' || comp.kind === 'pot') && check('lparen')) {
      accept('lparen');
      const branches = [parseSeries()];
      while (accept('parsep')) branches.push(parseSeries());
      if (!accept('rparen')) throw new Error('Missing closing bracket');
      comp.bound = branches.length === 1
        ? branches[0]
        : { type: 'parallel', children: branches };
    }
    return comp;
  }

  function parseAtom() {
    const atom = parseAtomNoMod();
    let pl = 0, mn = 0;
    let wallSet = false;
    while (true) {
      if (accept('plus')) { pl++; wallSet = true; }
      else if (accept('minus')) { mn++; wallSet = true; }
      else if (accept('flip')) atom.reversed = true;
      else if (accept('many')) atom.dotted = true;
      else if (check('word') && peek().value.toLowerCase() === 'pm') { pos++; atom.showPolarity = true; }
      else break;
    }
    let wall;
    if (wallSet) {
      if (pl === 1 && mn === 0) wall = 'r';
      else if (mn === 1 && pl === 0) wall = 'l';
      else if (pl >= 2 || mn >= 2) wall = 't';
      else wall = defaultWall(atom);
    } else {
      wall = defaultWall(atom);
    }
    atom.wall = wall;
    return atom;
  }

  function parseSeries() {
    while (accept('series')) {}
    if (isBoundary() || !isAtomStart()) return { type: 'series', children: [] };
    const items = [parseAtom()];
    while (!isBoundary()) {
      while (accept('series')) {}
      if (isBoundary() || !isAtomStart()) break;
      items.push(parseAtom());
    }
    return items.length === 1 ? items[0] : { type: 'series', children: items };
  }

  function parseFull() {
    const items = [];
    while (!eof()) {
      while (accept('series')) {}
      if (eof()) break;
      if (accept('topen')) {
        const branches = [parseSeries()];
        while (accept('parsep')) branches.push(parseSeries());
        const par = branches.length === 1 ? branches[0] : { type: 'parallel', children: branches };
        let pl = 0, mn = 0, wallSet = false;
        while (true) {
          if (accept('plus')) { pl++; wallSet = true; }
          else if (accept('minus')) { mn++; wallSet = true; }
          else break;
        }
        let wall = 'b';
        if (wallSet) {
          if (pl === 1 && mn === 0) wall = 'r';
          else if (mn === 1 && pl === 0) wall = 'l';
          else if (pl >= 2 || mn >= 2) wall = 't';
        }
        par.wall = wall;
        items.push(par);
        accept('tclose');
        continue;
      }
      if (!isAtomStart()) { pos++; continue; }
      items.push(parseAtom());
    }
    return items.length === 1 ? items[0] : { type: 'series', children: items };
  }

  return parseFull();
}

//
// ───── Geometry ──────────────────────────────────────────────────────────
//
const COMP_H = 36;
const SYMBOL_HALF = 16;
const WIRE_PAD = 14;
const PARALLEL_GAP = 30;
const VTAP_DROP = 42;
const OUTER_PAD = 30;
const WALL_PAD = 18;
const MIN_WALL_LEN = 90;
const WMARK_W = 30;

function componentWidth(node) {
  switch (node.kind) {
    case 'cell':       return 30;
    case 'varcell':    return 40;
    case 'battery': {
      if (node.dotted) return 54;
      const n = Math.max(1, Math.floor(node.cells || 2));
      return 14 + 9 * n;
    }
    case 'varbattery': {
      if (node.dotted) return 58;
      const n = Math.max(1, Math.floor(node.cells || 2));
      return 18 + 9 * n;
    }
    case 'switch':     return 54;
    case 'switch2':    return 60;
    case 'resistor':   return 60;
    case 'varresistor':return 66;
    case 'bulb':       return 40;
    case 'voltmeter':  return node.subscript ? 46 : 40;
    case 'ammeter':    return node.subscript ? 46 : 40;
    case 'diode':      return 50;
    case 'led':        return 56;
    case 'fuse':       return 56;
    case 'thermistor': return 60;
    case 'ldr':        return 76;
    case 'buzzer':     return 44;
    case 'speaker':    return 44;
    case 'microphone': return 40;
    case 'motor':      return 40;
    case 'generator':  return 40;
    case 'earth':      return 30;
    case 'heater':     return 64;
    case 'psdc':       return 60;
    case 'psac':       return 60;
    case 'transformer':return 80;
    case 'wire':       return 50;
    case 'pot':        return 64;
    case 'terminal':   return 16;
    default:           return 50;
  }
}

function isVoltmeterOnly(node) {
  if (!node) return false;
  if (node.type === 'component' && node.kind === 'voltmeter') return true;
  if (node.type === 'series' && node.children.length === 1) return isVoltmeterOnly(node.children[0]);
  return false;
}

function measure(node) {
  if (node.type === 'wmark') return { w: WMARK_W, above: SYMBOL_HALF, below: SYMBOL_HALF };
  if (node.type === 'component' && node.kind === 'pot' && node.bound) {
    const potRBW = 64;
    const bM = measure(node.bound);
    const minDistFromCx = Math.max(potRBW / 2 + 8, bM.w + 4);
    return {
      w: 2 * minDistFromCx + 8,
      above: SYMBOL_HALF,
      below: 30 + bM.above + bM.below + 8
    };
  }
  if (node.type === 'component' && node.kind === 'switch2' && node.bound) {
    const s2W = componentWidth(node);
    const b = node.bound;
    if (b.type === 'parallel') {
      let maxW = 0;
      for (const child of b.children) {
        const cm = measure(child);
        if (cm.w > maxW) maxW = cm.w;
      }
      const first = measure(b.children[0]);
      const second = b.children.length >= 2 ? measure(b.children[1]) : null;
      const dUp = Math.max(first.below + 10, 14);
      const above = first.above + dUp;
      let below = 18;
      if (second) {
        const dDown = Math.max(second.above + 10, 14);
        below = second.below + dDown;
      }
      return { w: s2W + maxW, above, below };
    }
    const bm = measure(b);
    return { w: s2W + bm.w, above: bm.above, below: bm.below };
  }
  if (node.type === 'component') {
    let above = SYMBOL_HALF, below = SYMBOL_HALF;
    if (node.kind === 'ldr') { above = 28; }
    if (node.kind === 'led') { above = 24; }
    if (node.kind === 'switch2') { above = 18; below = 18; }
    if ((node.kind === 'cell' || node.kind === 'battery') && node.showPolarity) below = 28;
    if (node.kind === 'varcell' || node.kind === 'varbattery') { above = 18; below = node.showPolarity ? 30 : 18; }
    if (node.kind === 'earth') below = 24;
    if (node.kind === 'transformer') below = 110;
    if (node.kind === 'speaker') above = 26;
    if (node.kind === 'microphone') above = 24;
    if (node.kind === 'buzzer') above = 22;
    if (node.kind === 'pot') below = 24;
    return { w: componentWidth(node), above, below };
  }
  if (node.type === 'vacross') {
    const m = measure(node.child);
    return { w: m.w, above: m.above, below: m.below + VTAP_DROP };
  }
  if (node.type === 'series') {
    if (node.children.length === 0) return { w: 60, above: SYMBOL_HALF, below: SYMBOL_HALF };
    let w = 0, above = 0, below = 0;
    for (const c of node.children) {
      const m = measure(c);
      w += m.w;
      above = Math.max(above, m.above);
      below = Math.max(below, m.below);
    }
    w += WIRE_PAD * (node.children.length - 1);
    return { w, above, below };
  }
  const reals = node.children.filter(c => !isVoltmeterOnly(c));
  const meters = node.children.filter(c => isVoltmeterOnly(c));
  const layout = reals.length > 0 ? reals : node.children;
  const taps = reals.length > 0 ? meters : [];
  let maxW = 0;
  for (const b of layout) maxW = Math.max(maxW, measure(b).w);
  const w = maxW + WIRE_PAD * 2;
  const first = measure(layout[0]);
  let above = first.above;
  let below = first.below;
  for (let i = 1; i < layout.length; i++) {
    const m = measure(layout[i]);
    below += PARALLEL_GAP + m.above + m.below;
  }
  for (let i = 0; i < taps.length; i++) below += VTAP_DROP;
  return { w, above, below };
}

//
// ───── SVG primitives ────────────────────────────────────────────────────
//
function svgEl(tag, attrs, children) {
  const ns = 'http://www.w3.org/2000/svg';
  const e = document.createElementNS(ns, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (children) for (const c of children) e.appendChild(c);
  return e;
}
const line = (x1, y1, x2, y2) => svgEl('line', { x1, y1, x2, y2, stroke: '#222', 'stroke-width': 1.6, 'stroke-linecap': 'round' });
const rect = (x, y, w, h) => svgEl('rect', { x, y, width: w, height: h, fill: '#fff', stroke: '#222', 'stroke-width': 1.6 });
const circ = (cx, cy, r) => svgEl('circle', { cx, cy, r, fill: '#fff', stroke: '#222', 'stroke-width': 1.6 });
const dot  = (cx, cy, r) => svgEl('circle', { cx, cy, r, fill: '#222' });
const txt  = (x, y, s, opts) => {
  const o = Object.assign({ size: 11, anchor: 'middle', weight: 'normal', fill: '#222', halo: true }, opts || {});
  const attrs = {
    x, y,
    'font-size': o.size, 'text-anchor': o.anchor, 'font-family': 'system-ui, sans-serif',
    'font-weight': o.weight, fill: o.fill, 'dominant-baseline': o.baseline || 'alphabetic'
  };
  if (o.halo) {
    attrs['paint-order'] = 'stroke';
    attrs.stroke = '#fff';
    attrs['stroke-width'] = '3.5';
    attrs['stroke-linejoin'] = 'round';
  }
  const e = svgEl('text', attrs);
  e.textContent = s;
  return e;
};

const SUB_DIGITS = {'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉',
  'a':'ₐ','e':'ₑ','i':'ᵢ','o':'ₒ','x':'ₓ','h':'ₕ','k':'ₖ','l':'ₗ','m':'ₘ','n':'ₙ','p':'ₚ','s':'ₛ','t':'ₜ'};
function toSub(s) { return String(s).split('').map(c => SUB_DIGITS[c] || c).join(''); }

const LABEL_PREFIX = {
  resistor: 'R', varresistor: 'R', thermistor: 'T', ldr: 'R', pot: 'R',
  fuse: 'F', bulb: 'L', diode: 'D', led: 'D',
  cell: 'B', battery: 'B', varcell: 'B', varbattery: 'B',
  switch: 'S', switch2: 'S',
  motor: 'M', generator: 'G', heater: 'H', transformer: 'T',
  buzzer: 'BZ', speaker: 'LS', microphone: 'M',
};
const LABEL_UNIT = {
  resistor: ' Ω', varresistor: ' Ω', thermistor: ' Ω', ldr: ' Ω',
  fuse: ' A',
};
function compLabel(node) {
  const parts = [];
  const px = LABEL_PREFIX[node.kind];
  if (node.subscript != null) {
    if (node.subscript.startsWith('.')) {
      // `..X` form — arbitrary label, no default prefix
      const arbitrary = node.subscript.substring(1);
      if (arbitrary) parts.push(arbitrary.toUpperCase());
    } else if (px) {
      parts.push(px + toSub(node.subscript));
    }
  }
  if (node.kind !== 'ammeter' && node.kind !== 'voltmeter') {
    if (node.volts != null && (node.kind === 'cell' || node.kind === 'battery' || node.kind === 'varcell' || node.kind === 'varbattery')) {
      parts.push(node.volts + ' ' + (node.voltsPrefix || '') + 'V');
    } else if (node.value != null) {
      const baseUnit = node.valueUnit || (LABEL_UNIT[node.kind] || '').trim();
      const tail = (node.valuePrefix || '') + baseUnit;
      parts.push(tail ? node.value + ' ' + tail : String(node.value));
    }
  }
  let main = parts.join(' = ');
  const extras = [];
  const isPower = node.kind === 'cell' || node.kind === 'battery' || node.kind === 'varcell' || node.kind === 'varbattery';
  if (node.voltsLabel != null && !isPower) extras.push(node.voltsLabel + ' ' + (node.voltsLabelPrefix || '') + 'V');
  if (node.ampsLabel != null && node.kind !== 'ammeter') extras.push(node.ampsLabel + ' ' + (node.ampsLabelPrefix || '') + 'A');
  if (extras.length) main = main ? main + ', ' + extras.join(', ') : extras.join(', ');
  return main;
}

// Draws an arrow that always appears in the same orientation globally regardless of the wall.
// Use this for "indicator" arrows (variable resistor, variable cell, variable battery) that
// have no physical direction tied to current flow.
function uprightArrow(g, ax1, ay1, ax2, ay2, cr, strokeWidth) {
  const arrLine = line(ax1, ay1, ax2, ay2);
  arrLine.setAttribute('marker-end', 'url(#arrowhead)');
  if (strokeWidth != null) arrLine.setAttribute('stroke-width', strokeWidth);
  if (cr) {
    const mx = (ax1 + ax2) / 2, my = (ay1 + ay2) / 2;
    const wrapper = svgEl('g', { transform: `rotate(${cr}, ${mx}, ${my})` });
    wrapper.appendChild(arrLine);
    g.appendChild(wrapper);
  } else {
    g.appendChild(arrLine);
  }
}

function uprightText(localX, localY, str, opts, cr) {
  if (!cr) return txt(localX, localY, str, opts);
  const g = svgEl('g', { transform: `translate(${localX}, ${localY}) rotate(${cr})` });
  g.appendChild(txt(0, 0, str, opts));
  return g;
}

//
// ───── Component drawings ────────────────────────────────────────────────
//
function drawComponent(node, x, y, w, g, cr) {
  const cx = x + w / 2;
  const m = measure(node);
  const labelY = y - Math.max(22, m.above + 6);

  switch (node.kind) {
    case 'cell': {
      const reversed = node.reversed;
      const longX = reversed ? cx + 3 : cx - 3;
      const shortX = reversed ? cx - 3 : cx + 3;
      g.appendChild(line(x, y, cx - 4, y));
      g.appendChild(line(cx + 4, y, x + w, y));
      g.appendChild(line(longX, y - 12, longX, y + 12));
      g.appendChild(line(shortX, y - 7, shortX, y + 7));
      if (node.showPolarity) {
        g.appendChild(uprightText(longX + (reversed ? 4 : -4), y + 22, '+', { size: 11, weight: 'bold' }, cr));
        g.appendChild(uprightText(shortX + (reversed ? -4 : 4), y + 22, '−', { size: 12, weight: 'bold' }, cr));
      }
      break;
    }

    case 'battery': {
      const stub = 7;
      const reversed = node.reversed;
      g.appendChild(line(x, y, x + stub, y));
      g.appendChild(line(x + w - stub, y, x + w, y));
      if (node.dotted) {
        // IEC "battery of cells" with unspecified count — every cell points the same way:
        // long–short  (dots)  long–short   so each visible cell is +/− in the same direction.
        const a = x + stub + 2;   // leftmost line
        const b = x + stub + 8;   // next line in
        const c = x + w - stub - 8;
        const d = x + w - stub - 2;  // rightmost line
        const longA  = reversed ? b : a;
        const shortA = reversed ? a : b;
        const longB  = reversed ? d : c;
        const shortB = reversed ? c : d;
        g.appendChild(line(longA,  y - 12, longA,  y + 12));
        g.appendChild(line(shortA, y - 7,  shortA, y + 7));
        g.appendChild(line(longB,  y - 12, longB,  y + 12));
        g.appendChild(line(shortB, y - 7,  shortB, y + 7));
        for (let i = -1; i <= 1; i++) g.appendChild(dot(cx + i * 4, y, 1.2));
      } else {
        const n = Math.max(1, Math.floor(node.cells || 2));
        const lines = 2 * n;
        const innerW = w - 2 * stub;
        const step = innerW / (lines - 1);
        for (let i = 0; i < lines; i++) {
          const lx = x + stub + i * step;
          const longHere = reversed ? (i % 2 === 1) : (i % 2 === 0);
          const half = longHere ? 12 : 7;
          g.appendChild(line(lx, y - half, lx, y + half));
        }
      }
      if (node.showPolarity) {
        const plusX = reversed ? x + w - stub : x + stub;
        const minusX = reversed ? x + stub : x + w - stub;
        g.appendChild(uprightText(plusX, y + 22, '+', { size: 11, weight: 'bold' }, cr));
        g.appendChild(uprightText(minusX, y + 22, '−', { size: 12, weight: 'bold' }, cr));
      }
      break;
    }

    case 'resistor': {
      const boxH = 14, boxW = w - 18;
      g.appendChild(line(x, y, x + 9, y));
      g.appendChild(line(x + w - 9, y, x + w, y));
      g.appendChild(rect(x + 9, y - boxH / 2, boxW, boxH));
      break;
    }

    case 'varresistor': {
      const boxH = 14, boxW = w - 18;
      g.appendChild(line(x, y, x + 9, y));
      g.appendChild(line(x + w - 9, y, x + w, y));
      g.appendChild(rect(x + 9, y - boxH / 2, boxW, boxH));
      uprightArrow(g, cx - 18, y + 14, cx + 18, y - 14, cr);
      break;
    }

    case 'bulb': {
      const r = 11;
      g.appendChild(line(x, y, cx - r, y));
      g.appendChild(line(cx + r, y, x + w, y));
      g.appendChild(circ(cx, y, r));
      const o = r * 0.72;
      g.appendChild(line(cx - o, y - o, cx + o, y + o));
      g.appendChild(line(cx - o, y + o, cx + o, y - o));
      break;
    }

    case 'switch': {
      const L = cx - 11, R = cx + 11;
      g.appendChild(line(x, y, L, y));
      g.appendChild(line(R, y, x + w, y));
      g.appendChild(dot(L, y, 2.2));
      g.appendChild(dot(R, y, 2.2));
      if (node.closed) g.appendChild(line(L, y, R, y));
      else g.appendChild(line(L, y, R - 2, y - 14));
      break;
    }

    case 'switch2': {
      // SPDT: common contact on the main wire (left); two output contacts BOTH offset from
      // the main wire (one above, one below); arm flicks between them.
      const L = cx - 14, R = cx + 14;
      const upY = y - 12;
      const downY = y + 12;
      g.appendChild(line(x, y, L, y));
      g.appendChild(dot(L, y, 2.2));
      // Upper output
      g.appendChild(dot(R, upY, 2.2));
      g.appendChild(line(R, upY, x + w, upY));
      // Lower output
      g.appendChild(dot(R, downY, 2.2));
      g.appendChild(line(R, downY, x + w, downY));
      // Arm: default position flicks UP to the upper contact
      g.appendChild(line(L, y, R - 2, upY));
      break;
    }

    case 'voltmeter':
    case 'ammeter': {
      const r = 11;
      g.appendChild(line(x, y, cx - r, y));
      g.appendChild(line(cx + r, y, x + w, y));
      g.appendChild(circ(cx, y, r));
      const base = node.kind === 'voltmeter' ? 'V' : 'A';
      let lbl;
      if (node.subscript != null && node.subscript.startsWith('.')) {
        const raw = node.subscript.substring(1);
        lbl = raw ? raw.toUpperCase() : base;
      } else {
        lbl = node.subscript != null ? base + toSub(node.subscript) : base;
      }
      g.appendChild(uprightText(cx, y, lbl, { size: 13, weight: 'bold', baseline: 'middle' }, cr));
      {
        const parts = [];
        if (node.value != null) {
          const baseUnit = node.kind === 'voltmeter' ? 'V' : 'A';
          parts.push(node.value + ' ' + (node.valuePrefix || '') + baseUnit);
        }
        if (node.resistance != null) {
          parts.push(node.resistance + ' ' + (node.resistancePrefix || '') + 'Ω');
        }
        if (parts.length) {
          g.appendChild(uprightText(cx, labelY, parts.join(', '), { size: 11 }, cr));
        }
      }
      break;
    }

    case 'diode': {
      const tipLen = 14;
      const stubLen = (w - tipLen) / 2;
      const baseX = x + stubLen;
      const tipX = baseX + tipLen;
      const left = node.triangleLeft != null ? node.triangleLeft : node.reversed;
      g.appendChild(line(x, y, baseX, y));
      g.appendChild(line(tipX, y, x + w, y));
      if (!left) {
        g.appendChild(svgEl('path', { d: `M ${baseX} ${y - 8} L ${tipX} ${y} L ${baseX} ${y + 8} Z`, fill: '#fff', stroke: '#222', 'stroke-width': 1.6, 'stroke-linejoin': 'round' }));
        g.appendChild(line(tipX, y - 8, tipX, y + 8));
      } else {
        g.appendChild(svgEl('path', { d: `M ${tipX} ${y - 8} L ${baseX} ${y} L ${tipX} ${y + 8} Z`, fill: '#fff', stroke: '#222', 'stroke-width': 1.6, 'stroke-linejoin': 'round' }));
        g.appendChild(line(baseX, y - 8, baseX, y + 8));
      }
      break;
    }

    case 'led': {
      const tipLen = 14;
      const stubLen = (w - tipLen) / 2;
      const baseX = x + stubLen;
      const tipX = baseX + tipLen;
      const left = node.triangleLeft != null ? node.triangleLeft : node.reversed;
      g.appendChild(line(x, y, baseX, y));
      g.appendChild(line(tipX, y, x + w, y));
      if (!left) {
        g.appendChild(svgEl('path', { d: `M ${baseX} ${y - 8} L ${tipX} ${y} L ${baseX} ${y + 8} Z`, fill: '#fff', stroke: '#222', 'stroke-width': 1.6, 'stroke-linejoin': 'round' }));
        g.appendChild(line(tipX, y - 8, tipX, y + 8));
      } else {
        g.appendChild(svgEl('path', { d: `M ${tipX} ${y - 8} L ${baseX} ${y} L ${tipX} ${y + 8} Z`, fill: '#fff', stroke: '#222', 'stroke-width': 1.6, 'stroke-linejoin': 'round' }));
        g.appendChild(line(baseX, y - 8, baseX, y + 8));
      }
      const dx = left ? -1 : 1;
      const a1 = line(cx - 3 * dx, y - 9, cx + 4 * dx, y - 17);
      a1.setAttribute('marker-end', 'url(#arrowhead)');
      a1.setAttribute('stroke-width', '1.1');
      g.appendChild(a1);
      const a2 = line(cx + 3 * dx, y - 9, cx + 10 * dx, y - 17);
      a2.setAttribute('marker-end', 'url(#arrowhead)');
      a2.setAttribute('stroke-width', '1.1');
      g.appendChild(a2);
      break;
    }

    case 'fuse': {
      const boxH = 12, boxW = w - 18;
      g.appendChild(line(x, y, x + 9, y));
      g.appendChild(line(x + w - 9, y, x + w, y));
      g.appendChild(rect(x + 9, y - boxH / 2, boxW, boxH));
      g.appendChild(line(x + 9, y, x + 9 + boxW, y));
      break;
    }

    case 'thermistor': {
      const boxH = 14, boxW = w - 18;
      const leftEdge = x + 9;
      const rightEdge = x + w - 9;
      g.appendChild(line(x, y, leftEdge, y));
      g.appendChild(line(rightEdge, y, x + w, y));
      g.appendChild(rect(leftEdge, y - boxH / 2, boxW, boxH));
      // Hockey-stick: from a quarter below the left edge, up to a quarter above and three-quarters along,
      // then horizontal to level with the right edge.
      const slantBottomY = y + boxH / 2 + boxH / 4;
      const slantTopY    = y - boxH / 2 - boxH / 4;
      const slantTopX    = leftEdge + 0.75 * boxW;
      g.appendChild(svgEl('path', {
        d: `M ${leftEdge} ${slantBottomY} L ${slantTopX} ${slantTopY} L ${rightEdge} ${slantTopY}`,
        fill: 'none', stroke: '#222', 'stroke-width': 1.6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round'
      }));
      break;
    }

    case 'ldr': {
      const innerW = 36, innerH = 14;
      const circR = 22;
      g.appendChild(line(x, y, cx - circR, y));
      g.appendChild(line(cx + circR, y, x + w, y));
      g.appendChild(circ(cx, y, circR));
      g.appendChild(rect(cx - innerW/2, y - innerH/2, innerW, innerH));
      const a1 = line(cx - 18, y - 24, cx - 8, y - 14);
      a1.setAttribute('marker-end', 'url(#arrowhead)');
      g.appendChild(a1);
      const a2 = line(cx - 8, y - 24, cx + 2, y - 14);
      a2.setAttribute('marker-end', 'url(#arrowhead)');
      g.appendChild(a2);
      break;
    }

    case 'buzzer': {
      // Electric bell lifted off the wire: half-dome with a small gap below it, two short stems to the wire.
      const r = 12;
      const lift = 4;
      const baseY = y - lift;
      const t1 = cx - r * 0.65;
      const t2 = cx + r * 0.65;
      g.appendChild(line(x, y, t1, y));
      g.appendChild(line(t2, y, x + w, y));
      g.appendChild(line(t1, y, t1, baseY));
      g.appendChild(line(t2, y, t2, baseY));
      g.appendChild(svgEl('path', {
        d: `M ${cx - r} ${baseY} A ${r} ${r} 0 0 1 ${cx + r} ${baseY}`,
        fill: '#fff', stroke: '#222', 'stroke-width': 1.6
      }));
      g.appendChild(line(cx - r, baseY, cx + r, baseY));
      break;
    }

    case 'speaker': {
      // Rotated 90°: driver outlined, horn opens UP with a splayed wider cone,
      // two short stems enter the centre of the driver's base from below.
      const recW = 12, recH = 9, hornH = 12, hornHalf = 17;
      const recBottom = y - 4;
      const recTop = recBottom - recH;
      const recX = cx - recW / 2;
      const t1 = cx - 3;
      const t2 = cx + 3;
      // Wire stubs along the main wire
      g.appendChild(line(x, y, t1, y));
      g.appendChild(line(t2, y, x + w, y));
      // Vertical stems from wire up into the centre of the driver's base
      g.appendChild(line(t1, y, t1, recBottom));
      g.appendChild(line(t2, y, t2, recBottom));
      // Driver rectangle (outlined)
      g.appendChild(rect(recX, recTop, recW, recH));
      // Horn opens upward from the top edge of the driver
      const hornTopY = recTop - hornH;
      g.appendChild(svgEl('path', {
        d: `M ${recX} ${recTop} L ${cx - hornHalf} ${hornTopY} L ${cx + hornHalf} ${hornTopY} L ${recX + recW} ${recTop} Z`,
        fill: '#fff', stroke: '#222', 'stroke-width': 1.6, 'stroke-linejoin': 'round'
      }));
      break;
    }

    case 'varcell': {
      const reversed = node.reversed;
      const longX = reversed ? cx + 3 : cx - 3;
      const shortX = reversed ? cx - 3 : cx + 3;
      g.appendChild(line(x, y, cx - 4, y));
      g.appendChild(line(cx + 4, y, x + w, y));
      g.appendChild(line(longX, y - 12, longX, y + 12));
      g.appendChild(line(shortX, y - 7, shortX, y + 7));
      uprightArrow(g, cx - 14, y + 14, cx + 14, y - 14, cr);
      if (node.showPolarity) {
        g.appendChild(uprightText(longX + (reversed ? 4 : -4), y + 24, '+', { size: 11, weight: 'bold' }, cr));
        g.appendChild(uprightText(shortX + (reversed ? -4 : 4), y + 24, '−', { size: 12, weight: 'bold' }, cr));
      }
      break;
    }

    case 'varbattery': {
      const stub = 9;
      const reversed = node.reversed;
      g.appendChild(line(x, y, x + stub, y));
      g.appendChild(line(x + w - stub, y, x + w, y));
      if (node.dotted) {
        const leftLongX  = x + stub + 2;
        const leftShortX = x + stub + 8;
        const rightShortX = x + w - stub - 8;
        const rightLongX  = x + w - stub - 2;
        const longLPos  = reversed ? leftShortX : leftLongX;
        const shortLPos = reversed ? leftLongX  : leftShortX;
        const shortRPos = reversed ? rightLongX : rightShortX;
        const longRPos  = reversed ? rightShortX : rightLongX;
        g.appendChild(line(longLPos, y - 12, longLPos, y + 12));
        g.appendChild(line(shortLPos, y - 7, shortLPos, y + 7));
        g.appendChild(line(shortRPos, y - 7, shortRPos, y + 7));
        g.appendChild(line(longRPos, y - 12, longRPos, y + 12));
        for (let i = -1; i <= 1; i++) g.appendChild(dot(cx + i * 4, y, 1.2));
      } else {
        const n = Math.max(1, Math.floor(node.cells || 2));
        const lines = 2 * n;
        const innerW = w - 2 * stub;
        const step = innerW / (lines - 1);
        for (let i = 0; i < lines; i++) {
          const lx = x + stub + i * step;
          const longHere = reversed ? (i % 2 === 1) : (i % 2 === 0);
          const half = longHere ? 12 : 7;
          g.appendChild(line(lx, y - half, lx, y + half));
        }
      }
      uprightArrow(g, x + 4, y + 16, x + w - 4, y - 16, cr);
      if (node.showPolarity) {
        const plusX  = reversed ? x + w - stub : x + stub;
        const minusX = reversed ? x + stub : x + w - stub;
        g.appendChild(uprightText(plusX, y + 26, '+', { size: 11, weight: 'bold' }, cr));
        g.appendChild(uprightText(minusX, y + 26, '−', { size: 12, weight: 'bold' }, cr));
      }
      break;
    }

    case 'terminal': {
      // Open-circuit terminal: small open circle with optional label above.
      const r = 4;
      g.appendChild(line(x, y, cx - r, y));
      g.appendChild(line(cx + r, y, x + w, y));
      g.appendChild(circ(cx, y, r));
      if (node.subscript != null) {
        const raw = node.subscript.startsWith('.') ? node.subscript.substring(1) : node.subscript;
        if (raw) g.appendChild(uprightText(cx, y - 16, raw.toUpperCase(), { size: 13, weight: 'bold' }, cr));
      }
      break;
    }

    case 'wire': {
      if (node.wiggle) {
        // Gentle wiggle: long humps, low amplitude
        const startX = x + 6, endX = x + w - 6;
        const innerW = endX - startX;
        const humpCount = Math.max(2, Math.floor(innerW / 12));
        const humpW = innerW / humpCount;
        const humpH = 1.4;
        let d = `M ${x} ${y} L ${startX} ${y}`;
        for (let i = 0; i < humpCount; i++) {
          const yOff = (i % 2 === 0 ? -1 : 1) * humpH * 2;
          d += ` q ${humpW / 2} ${yOff} ${humpW} 0`;
        }
        d += ` L ${x + w} ${y}`;
        g.appendChild(svgEl('path', { d, fill: 'none', stroke: '#222', 'stroke-width': 1.6, 'stroke-linecap': 'round' }));
        g.appendChild(dot(startX, y, 1.6));
        g.appendChild(dot(endX, y, 1.6));
      } else if (node.fat) {
        g.appendChild(svgEl('line', {
          x1: x, y1: y, x2: x + w, y2: y,
          stroke: '#222', 'stroke-width': 3.5, 'stroke-linecap': 'round'
        }));
      } else {
        g.appendChild(line(x, y, x + w, y));
      }
      g.appendChild(uprightText(cx, y - 12, 'wire', { size: 10 }, cr));
      break;
    }

    case 'pot': {
      // Potentiometer: resistor body with a wiper arrow coming up from below into its centre
      const boxH = 14, boxW = w - 18;
      g.appendChild(line(x, y, x + 9, y));
      g.appendChild(line(x + w - 9, y, x + w, y));
      g.appendChild(rect(x + 9, y - boxH / 2, boxW, boxH));
      const arrowStartY = y + 20;
      const arrowEndY = y + boxH / 2 + 1;
      const arr = svgEl('line', {
        x1: cx, y1: arrowStartY, x2: cx, y2: arrowEndY,
        stroke: '#222', 'stroke-width': 1.6, 'stroke-linecap': 'round'
      });
      arr.setAttribute('marker-end', 'url(#arrowhead)');
      g.appendChild(arr);
      break;
    }

    case 'microphone': {
      // Raised symbol: thick line on TOP (tangent to top of circle), circle, two short stems.
      // Wire passes through underneath without touching the symbol.
      const r = 7;
      const stemH = 2;
      const lineHalfW = r * 1.1;
      const symBaseY = y - 2;
      const stemTopY = symBaseY - stemH;
      const circleY = stemTopY - r;
      const lineY = circleY - r;
      g.appendChild(line(x, y, x + w, y));
      g.appendChild(circ(cx, circleY, r));
      g.appendChild(line(cx - r * 0.4, stemTopY, cx - r * 0.4, symBaseY));
      g.appendChild(line(cx + r * 0.4, stemTopY, cx + r * 0.4, symBaseY));
      g.appendChild(svgEl('line', {
        x1: cx - lineHalfW, y1: lineY,
        x2: cx + lineHalfW, y2: lineY,
        stroke: '#222', 'stroke-width': 3.5, 'stroke-linecap': 'round'
      }));
      break;
    }

    case 'motor':
    case 'generator': {
      const r = 11;
      g.appendChild(line(x, y, cx - r, y));
      g.appendChild(line(cx + r, y, x + w, y));
      g.appendChild(circ(cx, y, r));
      const base = node.kind === 'motor' ? 'M' : 'G';
      let lbl;
      if (node.subscript != null && node.subscript.startsWith('.')) {
        const raw = node.subscript.substring(1);
        lbl = raw ? raw.toUpperCase() : base;
      } else {
        lbl = node.subscript != null ? base + toSub(node.subscript) : base;
      }
      g.appendChild(uprightText(cx, y, lbl, { size: 13, weight: 'bold', baseline: 'middle' }, cr));
      break;
    }

    case 'earth': {
      // Wire passes through; vertical stub drops to three decreasing horizontal bars
      g.appendChild(line(x, y, x + w, y));
      const tapY = y + 9;
      g.appendChild(line(cx, y, cx, tapY));
      g.appendChild(line(cx - 10, tapY, cx + 10, tapY));
      g.appendChild(line(cx - 7, tapY + 4, cx + 7, tapY + 4));
      g.appendChild(line(cx - 4, tapY + 8, cx + 4, tapY + 8));
      break;
    }

    case 'heater': {
      const boxH = 14, boxW = w - 18;
      g.appendChild(line(x, y, x + 9, y));
      g.appendChild(line(x + w - 9, y, x + w, y));
      g.appendChild(rect(x + 9, y - boxH / 2, boxW, boxH));
      for (let i = 1; i <= 3; i++) {
        const lx = x + 9 + (boxW * i) / 4;
        g.appendChild(line(lx, y - boxH / 2 + 1, lx, y + boxH / 2 - 1));
      }
      break;
    }

    case 'psdc': {
      g.appendChild(line(x, y, x + 10, y));
      g.appendChild(line(x + w - 10, y, x + w, y));
      g.appendChild(dot(x + 10, y, 3));
      g.appendChild(dot(x + w - 10, y, 3));
      // + (left of break) and − (right of break)
      g.appendChild(uprightText(cx - 8, y, '+', { size: 13, weight: 'bold', baseline: 'middle' }, cr));
      g.appendChild(uprightText(cx + 8, y, '−', { size: 14, weight: 'bold', baseline: 'middle' }, cr));
      break;
    }

    case 'psac': {
      g.appendChild(line(x, y, x + 10, y));
      g.appendChild(line(x + w - 10, y, x + w, y));
      g.appendChild(dot(x + 10, y, 3));
      g.appendChild(dot(x + w - 10, y, 3));
      // Sine wave between the dots — no straight wire bar
      g.appendChild(svgEl('path', {
        d: `M ${cx - 10} ${y} q 5 -8 10 0 t 10 0`,
        fill: 'none', stroke: '#222', 'stroke-width': 1.6, 'stroke-linecap': 'round'
      }));
      break;
    }

    case 'transformer': {
      // Primary on the main wire, curving AWAY from the core (humps up).
      // Iron-core: two lines running PARALLEL to the coils (horizontal here → vertical on R-wall).
      // Secondary below the core, also curving away (humps down).
      // A larger square-ish secondary loop with a labelled "load" resistor.
      const stub = 8;
      const coilW = Math.min(30, w - 2 * stub);
      const humps = 3;
      const humpW = coilW / humps;
      const pStart = cx - coilW / 2;
      const pEnd   = cx + coilW / 2;
      // Primary stubs
      g.appendChild(line(x, y, pStart, y));
      g.appendChild(line(pEnd, y, x + w, y));
      // Primary coil: humps curving UPWARD (away from core)
      let pPath = `M ${pStart} ${y} `;
      for (let i = 0; i < humps; i++) pPath += `a ${humpW / 2} 5 0 0 0 ${humpW} 0 `;
      g.appendChild(svgEl('path', { d: pPath, fill: 'none', stroke: '#222', 'stroke-width': 1.6 }));
      // Iron core: two horizontal lines parallel to the coils (vertical in global on R-wall)
      const coreY1 = y + 10;
      const coreY2 = y + 14;
      g.appendChild(line(pStart, coreY1, pEnd, coreY1));
      g.appendChild(line(pStart, coreY2, pEnd, coreY2));
      // Secondary coil at sY: humps curving DOWNWARD (away from core)
      const sY = y + 22;
      let sPath = `M ${pStart} ${sY} `;
      for (let i = 0; i < humps; i++) sPath += `a ${humpW / 2} 5 0 0 1 ${humpW} 0 `;
      g.appendChild(svgEl('path', { d: sPath, fill: 'none', stroke: '#222', 'stroke-width': 1.6 }));
      // Secondary loop — larger, square-ish
      const loopTop = sY + 12;
      const loopBot = loopTop + 56;
      const loopL = cx - 32;
      const loopR = cx + 32;
      // Wires from secondary ends down + across to the load loop's top corners
      g.appendChild(line(pStart, sY, pStart, loopTop));
      g.appendChild(line(pEnd, sY, pEnd, loopTop));
      g.appendChild(line(pStart, loopTop, loopL, loopTop));
      g.appendChild(line(pEnd, loopTop, loopR, loopTop));
      // Vertical sides of the loop
      g.appendChild(line(loopL, loopTop, loopL, loopBot));
      g.appendChild(line(loopR, loopTop, loopR, loopBot));
      // Bottom side with load resistor in the middle
      const rW = 22, rH = 10;
      const rX1 = cx - rW / 2;
      const rX2 = cx + rW / 2;
      g.appendChild(line(loopL, loopBot, rX1, loopBot));
      g.appendChild(line(rX2, loopBot, loopR, loopBot));
      g.appendChild(rect(rX1, loopBot - rH / 2, rW, rH));
      g.appendChild(uprightText(cx, loopBot + 16, 'load', { size: 11 }, cr));
      break;
    }

    default:
      g.appendChild(rect(x + 6, y - 10, w - 12, 20));
      g.appendChild(uprightText(cx, y + 4, node.kind, { size: 10 }, cr));
  }

  // Single label rendering for any kind that has a subscript and/or value worth showing.
  // Skip the fall-through label for components that already show their letter inside their symbol
  const SELF_LABELED = { voltmeter: 1, ammeter: 1, motor: 1, generator: 1, terminal: 1 };
  if (!SELF_LABELED[node.kind]) {
    const lbl = compLabel(node);
    if (lbl) g.appendChild(uprightText(cx, labelY, lbl, { size: 11 }, cr));
  }
}

function drawWmark(x, y, w, node, g, cr) {
  g.appendChild(line(x, y, x + w, y));
  const cx = x + w / 2;
  const sz = 6;
  const d = node.direction === 'right'
    ? `M ${cx - sz} ${y - sz} L ${cx + sz} ${y} L ${cx - sz} ${y + sz}`
    : `M ${cx + sz} ${y - sz} L ${cx - sz} ${y} L ${cx + sz} ${y + sz}`;
  g.appendChild(svgEl('path', { d, stroke: '#222', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  if (node.value != null) {
    const label = node.value + ' ' + (node.valuePrefix || '') + 'A';
    g.appendChild(uprightText(cx, y - 14, label, { size: 11 }, cr));
  }
}

function drawVoltmeterTap(xL, xR, y, g, narrow, cr) {
  const tapY = y + VTAP_DROP;
  const cxm = (xL + xR) / 2;
  const r = narrow ? 9 : 11;
  g.appendChild(line(xL, y, xL, tapY));
  g.appendChild(line(xR, y, xR, tapY));
  g.appendChild(line(xL, tapY, cxm - r, tapY));
  g.appendChild(line(cxm + r, tapY, xR, tapY));
  g.appendChild(circ(cxm, tapY, r));
  g.appendChild(uprightText(cxm, tapY, 'V', { size: narrow ? 12 : 13, weight: 'bold', baseline: 'middle' }, cr));
}

//
// ───── Renderer ──────────────────────────────────────────────────────────
//
function renderPotBound(node, x, y, g, cr) {
  const m = measure(node);
  const potRBW = 64;
  const cx = x + m.w / 2;          // resistor (and wiper) centre
  const rBoxX1 = cx - potRBW / 2;
  const rBoxX2 = cx + potRBW / 2;
  const reversed = !!node.reversed;

  // Main wire across the whole allocated width
  g.appendChild(line(x, y, rBoxX1, y));
  g.appendChild(line(rBoxX2, y, x + m.w, y));
  // Resistor body
  const boxH = 14;
  g.appendChild(rect(rBoxX1, y - boxH / 2, potRBW, boxH));
  // Wiper arrow up into the centre of the resistor
  const arrowStartY = y + 22;
  const arrowEndY = y + boxH / 2 + 1;
  const arr = svgEl('line', {
    x1: cx, y1: arrowStartY, x2: cx, y2: arrowEndY,
    stroke: '#222', 'stroke-width': 1.6, 'stroke-linecap': 'round'
  });
  arr.setAttribute('marker-end', 'url(#arrowhead)');
  g.appendChild(arr);
  // Optional value label above the resistor
  const lbl = compLabel(node);
  if (lbl) g.appendChild(uprightText(cx, y - Math.max(22, m.above + 6), lbl, { size: 11 }, cr));

  // U-loop: tap on the main wire (left by default, right with `!`), drop, X inline, rise to wiper.
  const bound = node.bound;
  const bM = measure(bound);
  const minDist = Math.max(potRBW / 2 + 8, bM.w + 4);
  const tapX = reversed ? cx + minDist : cx - minDist;
  const trackY = y + 30 + bM.above;
  // Verticals
  g.appendChild(line(tapX, y, tapX, trackY));
  g.appendChild(line(cx, arrowStartY, cx, trackY));
  // Inline X centred in the horizontal run between tap and wiper
  const trackLeft  = Math.min(tapX, cx);
  const trackRight = Math.max(tapX, cx);
  const xStart = (trackLeft + trackRight - bM.w) / 2;
  if (xStart > trackLeft) g.appendChild(line(trackLeft, trackY, xStart, trackY));
  const xEnd = render(bound, xStart, trackY, g, cr);
  if (xEnd < trackRight) g.appendChild(line(xEnd, trackY, trackRight, trackY));

  return x + m.w;
}

function renderSwitch2Bound(node, x, y, g, cr) {
  const s2W = componentWidth(node);
  drawComponent(node, x, y, s2W, g, cr);
  const s2RightX = x + s2W;
  const upY = y - 12;
  const downY = y + 12;
  const bound = node.bound;

  if (!bound || bound.type !== 'parallel') {
    if (bound) return render(bound, s2RightX, y, g, cr);
    return s2RightX;
  }

  const branches = bound.children;
  let maxW = 0;
  for (const b of branches) maxW = Math.max(maxW, measure(b).w);
  const branchStartX = s2RightX;
  const branchEndX = branchStartX + maxW;

  // Branch 1: ABOVE the main wire, fed from s2's upper output
  const first = branches[0];
  const firstM = measure(first);
  const dUp = Math.max(firstM.below + 10, 14);
  const y1 = y - dUp;
  const fLP = (maxW - firstM.w) / 2;
  g.appendChild(line(s2RightX, upY, s2RightX, y1));
  g.appendChild(line(s2RightX, y1, branchStartX + fLP, y1));
  const fEnd = render(first, branchStartX + fLP, y1, g, cr);
  if (branchEndX - fEnd > 0) g.appendChild(line(fEnd, y1, branchEndX, y1));

  // Branch 2: BELOW the main wire, fed from s2's lower output
  let y2 = y;
  if (branches.length >= 2) {
    const second = branches[1];
    const sM = measure(second);
    const dDown = Math.max(sM.above + 10, 14);
    y2 = y + dDown;
    const sLP = (maxW - sM.w) / 2;
    g.appendChild(line(s2RightX, downY, s2RightX, y2));
    g.appendChild(line(s2RightX, y2, branchStartX + sLP, y2));
    const sEnd = render(second, branchStartX + sLP, y2, g, cr);
    if (branchEndX - sEnd > 0) g.appendChild(line(sEnd, y2, branchEndX, y2));
  }

  // Right rail joining both branches back to the main wire level (y passes through it)
  g.appendChild(line(branchEndX, y1, branchEndX, y2));

  return branchEndX;
}

function render(node, x, y, g, cr) {
  const m = measure(node);

  if (node.type === 'wmark') {
    drawWmark(x, y, m.w, node, g, cr);
    return x + m.w;
  }
  if (node.type === 'component') {
    if (node.kind === 'switch2' && node.bound) {
      return renderSwitch2Bound(node, x, y, g, cr);
    }
    if (node.kind === 'pot' && node.bound) {
      return renderPotBound(node, x, y, g, cr);
    }
    drawComponent(node, x, y, m.w, g, cr);
    return x + m.w;
  }
  if (node.type === 'vacross') {
    const endX = render(node.child, x, y, g, cr);
    drawVoltmeterTap(x, endX, y, g, false, cr);
    return endX;
  }
  if (node.type === 'series') {
    if (node.children.length === 0) {
      g.appendChild(line(x, y, x + m.w, y));
      return x + m.w;
    }
    let curX = x;
    for (let i = 0; i < node.children.length; i++) {
      if (i > 0) { g.appendChild(line(curX, y, curX + WIRE_PAD, y)); curX += WIRE_PAD; }
      curX = render(node.children[i], curX, y, g, cr);
    }
    return curX;
  }

  const reals = node.children.filter(c => !isVoltmeterOnly(c));
  const meters = node.children.filter(c => isVoltmeterOnly(c));
  const layout = reals.length > 0 ? reals : node.children;
  const taps = reals.length > 0 ? meters : [];

  let maxW = 0;
  for (const b of layout) maxW = Math.max(maxW, measure(b).w);
  const railL = x + WIRE_PAD;
  const railR = railL + maxW;

  g.appendChild(line(x, y, railL, y));
  g.appendChild(line(railR, y, x + m.w, y));

  const first = layout[0];
  const firstM = measure(first);
  const fLP = (maxW - firstM.w) / 2;
  if (fLP > 0) g.appendChild(line(railL, y, railL + fLP, y));
  const fEnd = render(first, railL + fLP, y, g, cr);
  if (railR - fEnd > 0) g.appendChild(line(fEnd, y, railR, y));

  let cursorBottom = y + firstM.below;
  let lastBranchY = y;
  for (let i = 1; i < layout.length; i++) {
    const b = layout[i];
    const bm = measure(b);
    const bY = cursorBottom + PARALLEL_GAP + bm.above;
    const lp = (maxW - bm.w) / 2;
    if (lp > 0) g.appendChild(line(railL, bY, railL + lp, bY));
    const ex = render(b, railL + lp, bY, g, cr);
    if (railR - ex > 0) g.appendChild(line(ex, bY, railR, bY));
    cursorBottom = bY + bm.below;
    lastBranchY = bY;
  }

  g.appendChild(line(railL, y, railL, lastBranchY));
  g.appendChild(line(railR, y, railR, lastBranchY));

  let tapBase = lastBranchY;
  for (const t of taps) {
    drawVoltmeterTap(railL, railR, tapBase, g, true, cr);
    tapBase += VTAP_DROP;
  }

  return x + m.w;
}

//
// ───── Outer-loop layout ─────────────────────────────────────────────────
//
function extractByWall(ast) {
  const walls = { b: [], r: [], t: [], l: [] };
  const atoms = ast.type === 'series' ? ast.children : [ast];
  for (const a of atoms) (walls[a.wall || 'b']).push(a);
  return walls;
}
function wallSeries(atoms) {
  if (atoms.length === 0) return null;
  if (atoms.length === 1) return atoms[0];
  return { type: 'series', children: atoms };
}

const WALL_COUNTER_ROTATE = { b: 0, r: 90, t: 180, l: -90 };

function deduceCurrentLocalDir(ast) {
  let count = 0, theBat = null;
  function scan(n) {
    if (!n) return;
    if (n.type === 'component' && (n.kind === 'cell' || n.kind === 'battery')) {
      count++; theBat = n;
    }
    if (n.children) for (const c of n.children) scan(c);
    if (n.child) scan(n.child);
  }
  scan(ast);
  if (count !== 1) return null;
  // Default battery → conventional current flows CW globally (against CCW wall traversal) → chevron points local-left.
  // Reversed battery → CCW → with traversal → local-right.
  return theBat.reversed ? 'right' : 'left';
}

function applyChevronAutoDir(ast) {
  const dir = deduceCurrentLocalDir(ast);
  if (!dir) return;
  // For diodes/LEDs the "natural" orientation lets current through:
  // current local-left → triangle should point local-left (= reversed in our drawing).
  const naturalDiodeReversed = (dir === 'left');
  function apply(n) {
    if (!n) return;
    if (n.type === 'wmark') n.direction = dir;
    if (n.type === 'component' && (n.kind === 'diode' || n.kind === 'led')) {
      // User-supplied `!` flips relative to the natural direction (a reverse-biased diode).
      n.triangleLeft = n.reversed ? !naturalDiodeReversed : naturalDiodeReversed;
    }
    if (n.children) for (const c of n.children) apply(c);
    if (n.child) apply(n.child);
  }
  apply(ast);
}

function isOpenCircuit(ast) {
  if (!ast) return false;
  const isTerm = n => n && n.type === 'component' && n.kind === 'terminal';
  if (ast.type === 'component') return isTerm(ast);
  if (ast.type !== 'series' || ast.children.length === 0) return false;
  return isTerm(ast.children[0]) || isTerm(ast.children[ast.children.length - 1]);
}

function renderOpenCircuit(ast) {
  // Flat horizontal series — no loop closure. Position modifiers are ignored.
  const series = ast.type === 'series' ? ast : { type: 'series', children: [ast] };
  const m = measure(series);
  const pad = 30;
  const svgW = m.w + 2 * pad;
  const svgH = m.above + m.below + 2 * pad;
  const startX = pad;
  const y = pad + m.above;

  const svg = svgEl('svg', { xmlns: 'http://www.w3.org/2000/svg', width: svgW, height: svgH, viewBox: `0 0 ${svgW} ${svgH}` });
  const defs = svgEl('defs');
  const marker = svgEl('marker', { id: 'arrowhead', viewBox: '0 0 10 10', refX: '8', refY: '5', markerWidth: '6', markerHeight: '6', orient: 'auto-start-reverse' });
  marker.appendChild(svgEl('path', { d: 'M0,0 L10,5 L0,10 z', fill: '#222' }));
  defs.appendChild(marker);
  svg.appendChild(defs);

  const root = svgEl('g', {});
  svg.appendChild(root);
  render(series, startX, y, root, 0);
  return svg;
}

function renderCircuit(ast) {
  applyChevronAutoDir(ast);
  if (isOpenCircuit(ast)) return renderOpenCircuit(ast);
  const walls = extractByWall(ast);
  const series = {
    b: wallSeries(walls.b), r: wallSeries(walls.r),
    t: wallSeries(walls.t), l: wallSeries(walls.l),
  };
  const mes = {
    b: series.b ? measure(series.b) : { w: 0, above: 0, below: 0 },
    r: series.r ? measure(series.r) : { w: 0, above: 0, below: 0 },
    t: series.t ? measure(series.t) : { w: 0, above: 0, below: 0 },
    l: series.l ? measure(series.l) : { w: 0, above: 0, below: 0 },
  };
  const innerW = Math.max(mes.b.w + 2 * WALL_PAD, mes.t.w + 2 * WALL_PAD, MIN_WALL_LEN);
  const innerH = Math.max(mes.r.w + 2 * WALL_PAD, mes.l.w + 2 * WALL_PAD, MIN_WALL_LEN);
  const out = { b: mes.b.below + 6, r: mes.r.below + 6, t: mes.t.below + 6, l: mes.l.below + 6 };
  const svgW = OUTER_PAD + out.l + innerW + out.r + OUTER_PAD;
  const svgH = OUTER_PAD + out.t + innerH + out.b + OUTER_PAD;
  const loopLeft = OUTER_PAD + out.l;
  const loopRight = loopLeft + innerW;
  const loopTop = OUTER_PAD + out.t;
  const loopBottom = loopTop + innerH;

  const svg = svgEl('svg', { xmlns: 'http://www.w3.org/2000/svg', width: svgW, height: svgH, viewBox: `0 0 ${svgW} ${svgH}` });
  const defs = svgEl('defs');
  const marker = svgEl('marker', { id: 'arrowhead', viewBox: '0 0 10 10', refX: '8', refY: '5', markerWidth: '6', markerHeight: '6', orient: 'auto-start-reverse' });
  marker.appendChild(svgEl('path', { d: 'M0,0 L10,5 L0,10 z', fill: '#222' }));
  defs.appendChild(marker);
  svg.appendChild(defs);

  const root = svgEl('g', {});
  svg.appendChild(root);

  function placeWall(name, s, m, baseTransform, wallLen) {
    const cw = m.w;
    const startOffset = (wallLen - cw) / 2;
    const g = svgEl('g', { transform: baseTransform + ` translate(${startOffset}, 0)` });
    if (s) render(s, 0, 0, g, WALL_COUNTER_ROTATE[name]);
    root.appendChild(g);
    return { startOffset, contentW: cw };
  }

  const b = placeWall('b', series.b, mes.b, `translate(${loopLeft}, ${loopBottom})`, innerW);
  const r = placeWall('r', series.r, mes.r, `translate(${loopRight}, ${loopBottom}) rotate(-90)`, innerH);
  const t = placeWall('t', series.t, mes.t, `translate(${loopRight}, ${loopTop}) rotate(180)`, innerW);
  const l = placeWall('l', series.l, mes.l, `translate(${loopLeft}, ${loopTop}) rotate(90)`, innerH);

  const bStart = loopLeft + b.startOffset, bEnd = bStart + b.contentW;
  if (b.contentW > 0) {
    root.appendChild(line(loopLeft, loopBottom, bStart, loopBottom));
    root.appendChild(line(bEnd, loopBottom, loopRight, loopBottom));
  } else root.appendChild(line(loopLeft, loopBottom, loopRight, loopBottom));

  const rStart = loopBottom - r.startOffset, rEnd = rStart - r.contentW;
  if (r.contentW > 0) {
    root.appendChild(line(loopRight, loopBottom, loopRight, rStart));
    root.appendChild(line(loopRight, rEnd, loopRight, loopTop));
  } else root.appendChild(line(loopRight, loopBottom, loopRight, loopTop));

  const tStart = loopRight - t.startOffset, tEnd = tStart - t.contentW;
  if (t.contentW > 0) {
    root.appendChild(line(loopRight, loopTop, tStart, loopTop));
    root.appendChild(line(tEnd, loopTop, loopLeft, loopTop));
  } else root.appendChild(line(loopRight, loopTop, loopLeft, loopTop));

  const lStart = loopTop + l.startOffset, lEnd = lStart + l.contentW;
  if (l.contentW > 0) {
    root.appendChild(line(loopLeft, loopTop, loopLeft, lStart));
    root.appendChild(line(loopLeft, lEnd, loopLeft, loopBottom));
  } else root.appendChild(line(loopLeft, loopTop, loopLeft, loopBottom));

  return svg;
}


  function renderDSL(dsl) {
    let ast;
    try { ast = parse(dsl); } catch (e) { return null; }
    if (!ast) return null;
    if (ast.type === "series" && (!ast.children || ast.children.length === 0)) return null;
    return renderCircuit(ast);
  }

  window.CircuitBuilder = {
    renderDSL: renderDSL,
    parseDSL: parse,
    VERSION: "v2 (clean d033 extract)"
  };

})();
