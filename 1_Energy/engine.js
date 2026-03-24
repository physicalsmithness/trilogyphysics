(function(){
  const META = window.TRILOGY_ENERGY_QUIZ_META || {title:"Quiz", subtitle:""};
  const BANK = window.TRILOGY_ENERGY_QUIZ_QUESTIONS || [];
  const REPORT_FORM = window.TRILOGY_ENERGY_REPORT_FORM || null;

  const els = {
    title: document.getElementById("title"),
    subtitle: document.getElementById("subtitle"),
    statusPill: document.getElementById("statusPill"),
    poolPill: document.getElementById("poolPill"),
    questionMetaPill: document.getElementById("questionMetaPill"),
    questionType: document.getElementById("questionType"),
    difficultyRating: document.getElementById("difficultyRating"),
    electricityDone: document.getElementById("electricityDone"),
    startBtn: document.getElementById("startBtn"),
    quiz: document.getElementById("quiz"),
    statSeen: document.getElementById("statSeen"),
    statDone: document.getElementById("statDone"),
    statRightDone: document.getElementById("statRightDone"),
    statRightAll: document.getElementById("statRightAll"),
    filterStatSeen: document.getElementById("filterStatSeen"),
    filterStatDone: document.getElementById("filterStatDone"),
    filterStatRightDone: document.getElementById("filterStatRightDone"),
    filterStatRightAll: document.getElementById("filterStatRightAll"),
    filterSummary: document.getElementById("filterSummary"),
    recentDots: document.getElementById("recentDots"),
    resetOverallBtn: document.getElementById("resetOverallBtn"),
    resetDeckBtn: document.getElementById("resetDeckBtn"),
    reportBanner: document.getElementById("reportBanner")
  };
  els.title.textContent = META.title || "Trilogy Energy Quiz";
  els.subtitle.textContent = META.subtitle || "";

  const PROGRESS_KEY = "preibphysics_trilogy_energy_progress_v4";
  const DECK_KEY = "preibphysics_trilogy_energy_deck_v4";

  let activePool = [];
  let currentQuestion = null;
  let sessionSerial = 0;
  const lastVariantByBase = Object.create(null);

  const TYPE_LABELS = {calc:'Calculation', short:'Short answer', long:'Long answer', quick:'Quick check'};

  function questionKindOf(q){
    if(!q) return 'quick';
    if(q.quizKind) return q.quizKind;
    if(q.type === 'numeric' || (q.tags || []).includes('calc')) return 'calc';
    if(q.type === 'short') return 'short';
    if(q.type === 'long') return 'long';
    return 'quick';
  }
  function inferDifficultyRating(q){
    if(Number.isFinite(Number(q.difficultyRating))) return clamp(Number(q.difficultyRating), 1, 5);
    let rating = 3;
    if(q.difficulty === 'easy') rating = 2;
    else if(q.difficulty === 'med') rating = 3;
    else if(q.difficulty === 'hard') rating = 4;

    const kind = questionKindOf(q);
    const marks = Number(q.marks || 0);
    const calcMeta = q.calcMeta || q._calcMeta || null;
    if(kind === 'quick') rating -= 1;
    if(kind === 'long') rating += 1;
    if(kind === 'calc' && marks >= 5) rating += 1;
    if(kind === 'short' && marks >= 4) rating += 1;
    if(q.bridge) rating += 1;
    if(calcMeta && calcMeta.needsRearrangement) rating += 0.5;
    if(calcMeta && calcMeta.needsConversion) rating += 0.5;
    const hardKinds = new Set(['accelPowerMoving','dropWithInitialKE','keToTempNoMass','hangingSpringEnergy','brakingForceFromKE']);
    if(calcMeta && hardKinds.has(calcMeta.kind)) rating += 0.5;
    rating = Math.round(rating);
    return clamp(rating, 1, 5);
  }
  function normalizeBank(){
    BANK.forEach(q => {
      q.quizKind = questionKindOf(q);
      q.difficultyRating = inferDifficultyRating(q);
    });
  }
  normalizeBank();

  function applyHeaderOffset(){
    const h = document.querySelector("header.topbar");
    if(!h) return;
    document.documentElement.style.setProperty("--headerOffset", (h.offsetHeight || 0) + "px");
  }
  applyHeaderOffset();
  window.addEventListener("resize", applyHeaderOffset);

  function escapeHtml(s){
    return (s ?? "").toString()
      .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
      .replaceAll('"',"&quot;").replaceAll("'","&#39;");
  }
  function norm(s){
    return (s ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[“”"]/g,'"')
      .replace(/[’]/g,"'")
      .replace(/\s+/g,' ');
  }
  function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }
  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  function cloneDeep(obj){
    return obj === undefined ? undefined : JSON.parse(JSON.stringify(obj));
  }
  function materializeQuestion(base){
    let q = cloneDeep(base);
    const variants = Array.isArray(base && base.instances) ? base.instances : [];
    if(variants.length){
      const options = [null, ...variants];
      let idxs = options.map((_, i) => i);
      const prev = lastVariantByBase[base.id];
      if(options.length > 2 && Number.isInteger(prev)) idxs = idxs.filter(i => i !== prev);
      const pickIndex = idxs[Math.floor(Math.random() * idxs.length)];
      lastVariantByBase[base.id] = pickIndex;
      const variant = options[pickIndex];
      if(variant){
        const merged = {...q, ...cloneDeep(variant)};
        merged.tags = Array.from(new Set([...(q.tags || []), ...(variant.tags || [])]));
        if(variant.bridge === null) delete merged.bridge;
        q = merged;
      }
    }
    q.quizKind = questionKindOf(q);
    q.difficultyRating = inferDifficultyRating(q);
    return q;
  }

  function fnv1a(str){
    let h = 2166136261;
    for(let i=0;i<str.length;i++){
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h>>>0).toString(16);
  }
  function familyOfId(id){
    const m = (id || "").match(/^(.*)_\d+$/);
    return m ? m[1] : id;
  }
  function prettyNum(a){
    if(a === null || a === undefined || Number.isNaN(a)) return "";
    const abs = Math.abs(a);
    const isInt = Math.abs(a - Math.round(a)) < 1e-9;
    function withCommas(nStr){
      const parts = nStr.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
    if(isInt && abs < 1e12) return withCommas(String(Math.round(a)));
    if(abs === 0) return "0";
    if(abs >= 0.001 && abs < 1e9){
      let s = Number(a).toPrecision(4).replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
      if(!(s.includes("e") || s.includes("E"))){
        const neg = s.startsWith("-");
        if(neg) s = s.slice(1);
        s = withCommas(s);
        return neg ? "-" + s : s;
      }
    }
    return Number(a).toExponential(3).replace(/e\+?/,' × 10^');
  }
  function pct(n,d){ return d ? Math.round((100*n)/d) : 0; }

  function loadProgress(){
    try{
      const raw = localStorage.getItem(PROGRESS_KEY);
      if(!raw) return {byBase:{}, recent:[]};
      const obj = JSON.parse(raw);
      if(!obj || typeof obj !== "object") return {byBase:{}, recent:[]};
      if(!obj.byBase || typeof obj.byBase !== "object") obj.byBase = {};
      if(!Array.isArray(obj.recent)) obj.recent = [];
      return obj;
    }catch(_){ return {byBase:{}, recent:[]}; }
  }
  function saveProgress(obj){
    try{ localStorage.setItem(PROGRESS_KEY, JSON.stringify(obj)); }catch(_){ }
  }
  function resetProgress(){
    try{ localStorage.removeItem(PROGRESS_KEY); }catch(_){ }
  }

  function loadDeck(){
    try{
      const raw = localStorage.getItem(DECK_KEY);
      if(!raw) return null;
      const obj = JSON.parse(raw);
      if(!obj || typeof obj !== "object") return null;
      return obj;
    }catch(_){ return null; }
  }
  function saveDeck(obj){
    try{ localStorage.setItem(DECK_KEY, JSON.stringify(obj)); }catch(_){ }
  }
  function resetDeck(){
    try{ localStorage.removeItem(DECK_KEY); }catch(_){ }
  }

  function getSelectedTopics(){
    return Array.from(document.querySelectorAll('.topicCb')).filter(cb => cb.checked).map(cb => cb.value);
  }
  function buildBasePool(){
    const topics = getSelectedTopics();
    let pool = BANK.filter(q => (q.tags || []).some(t => topics.includes(t)));
    if(!els.electricityDone.checked){
      pool = pool.filter(q => !q.needsElectricity);
    }
    return pool;
  }
  function filterPool(list){
    let pool = list.slice();
    const type = els.questionType ? els.questionType.value : 'all';
    const rating = els.difficultyRating ? els.difficultyRating.value : 'all';
    if(type !== 'all') pool = pool.filter(q => questionKindOf(q) === type);
    if(rating !== 'all') pool = pool.filter(q => String(q.difficultyRating || '') === String(rating));
    return pool;
  }
  function buildPool(){
    return filterPool(buildBasePool());
  }
  function currentFilterSummary(){
    const type = els.questionType ? els.questionType.value : 'all';
    const rating = els.difficultyRating ? els.difficultyRating.value : 'all';
    const typeText = type === 'all' ? 'All question types' : TYPE_LABELS[type];
    const diffText = rating === 'all' ? 'any difficulty' : `difficulty ${rating}`;
    return `${typeText} • ${diffText}`;
  }
  function buildDeckSignature(ids){
    return fnv1a(ids.slice().sort().join('|'));
  }

  function getNextQuestionFromDeck(pool){
    const ids = pool.map(q => q.id);
    const sig = buildDeckSignature(ids);
    const map = new Map(pool.map(q => [q.id, q]));
    let deck = loadDeck();
    if(!deck || deck.sig !== sig || !Array.isArray(deck.order) || typeof deck.cursor !== "number"){
      deck = {sig, order: shuffle(ids), cursor: 0};
    }
    if(deck.cursor >= deck.order.length){
      deck.order = shuffle(ids);
      deck.cursor = 0;
    }

    const progress = loadProgress();
    const lastEvent = progress.recent.length ? progress.recent[progress.recent.length - 1] : null;
    const lastFamily = lastEvent ? familyOfId(lastEvent.baseId) : null;
    if(lastFamily){
      for(let j=deck.cursor; j<Math.min(deck.order.length, deck.cursor + 6); j++){
        if(familyOfId(deck.order[j]) !== lastFamily){
          [deck.order[deck.cursor], deck.order[j]] = [deck.order[j], deck.order[deck.cursor]];
          break;
        }
      }
    }

    const baseId = deck.order[deck.cursor];
    deck.cursor += 1;
    saveDeck(deck);

    sessionSerial += 1;
    const q = materializeQuestion(map.get(baseId));
    return {...q, _instanceId: `${baseId}_${Date.now().toString(36)}_${sessionSerial}`};
  }

  function markSeen(baseId){
    const progress = loadProgress();
    if(!progress.byBase[baseId]) progress.byBase[baseId] = {};
    progress.byBase[baseId].seen = true;
    progress.byBase[baseId].updatedAt = Date.now();
    saveProgress(progress);
  }
  function pushRecent(progress, entry, replaceLastSame){
    if(replaceLastSame && progress.recent.length && progress.recent[progress.recent.length-1].baseId === entry.baseId){
      progress.recent[progress.recent.length-1] = entry;
    } else {
      progress.recent.push(entry);
      if(progress.recent.length > 10) progress.recent = progress.recent.slice(-10);
    }
  }
  function saveOutcome(baseId, outcome, replaceLastSame){
    const progress = loadProgress();
    if(!progress.byBase[baseId]) progress.byBase[baseId] = {};
    progress.byBase[baseId] = {
      ...progress.byBase[baseId],
      seen: true,
      answered: true,
      status: outcome.status,
      score: Number(outcome.score) || 0,
      max: Number(outcome.max) || 0,
      updatedAt: Date.now()
    };
    pushRecent(progress, {baseId, status: outcome.status, t: Date.now()}, !!replaceLastSame);
    saveProgress(progress);
  }
  function saveSkip(baseId){
    const progress = loadProgress();
    if(!progress.byBase[baseId]) progress.byBase[baseId] = {};
    progress.byBase[baseId] = {
      ...progress.byBase[baseId],
      seen: true,
      answered: false,
      status: 'skip',
      score: 0,
      max: qMaxMarks(currentQuestion),
      updatedAt: Date.now()
    };
    pushRecent(progress, {baseId, status:'skip', t:Date.now()}, false);
    saveProgress(progress);
  }

  function computeStatsForPool(pool, progress){
    const ids = pool.map(q => q.id);
    let seen = 0, answered = 0, full = 0;
    ids.forEach(id => {
      const item = progress.byBase[id];
      if(!item) return;
      if(item.seen) seen += 1;
      if(item.answered){
        answered += 1;
        if(item.status === 'full') full += 1;
      }
    });
    return {total: ids.length, seen, answered, full};
  }

  function renderStats(){
    const progress = loadProgress();
    const overallPool = buildBasePool();
    const filteredPool = filterPool(overallPool);
    const overall = computeStatsForPool(overallPool, progress);
    const filtered = computeStatsForPool(filteredPool, progress);

    els.statSeen.textContent = `${overall.seen}/${overall.total} (${pct(overall.seen, overall.total)}%)`;
    els.statDone.textContent = `${overall.answered}/${overall.total} (${pct(overall.answered, overall.total)}%)`;
    els.statRightDone.textContent = `${overall.full}/${overall.answered} (${pct(overall.full, overall.answered)}%)`;
    els.statRightAll.textContent = `${overall.full}/${overall.total} (${pct(overall.full, overall.total)}%)`;

    if(els.filterStatSeen) els.filterStatSeen.textContent = `${filtered.seen}/${filtered.total} (${pct(filtered.seen, filtered.total)}%)`;
    if(els.filterStatDone) els.filterStatDone.textContent = `${filtered.answered}/${filtered.total} (${pct(filtered.answered, filtered.total)}%)`;
    if(els.filterStatRightDone) els.filterStatRightDone.textContent = `${filtered.full}/${filtered.answered} (${pct(filtered.full, filtered.answered)}%)`;
    if(els.filterStatRightAll) els.filterStatRightAll.textContent = `${filtered.full}/${filtered.total} (${pct(filtered.full, filtered.total)}%)`;
    if(els.filterSummary) els.filterSummary.textContent = currentFilterSummary();

    const recent = progress.recent.slice(-10);
    els.recentDots.innerHTML = recent.length
      ? recent.map(x => `<span class="dot ${x.status === 'skip' ? 'skip' : x.status}" title="${escapeHtml(x.baseId)} • ${escapeHtml(x.status)}"></span>`).join('')
      : `<span class="small">No recent answers yet.</span>`;
    const totalText = filtered.total ? `${filtered.total} possible in selected filter` : `No questions in selected filter`;
    els.poolPill.textContent = totalText;
    applyHeaderOffset();
  }


  function parseNumBits(s){
    return Number(String(s).replace(/,/g,'').trim());
  }
  function secondsFrom(value, unitText){
    const u = String(unitText || '').toLowerCase();
    if(u.startsWith('hour') || u === 'h' || u === 'hr' || u === 'hrs') return value * 3600;
    if(u.startsWith('min')) return value * 60;
    return value;
  }
  function inferCalcMeta(q){
    if(!q || q.type !== 'numeric') return null;
    if(q._calcMeta) return q._calcMeta;
    if(q.calcMeta){
      const meta = Object.assign({}, q.calcMeta);
      if(!Number.isFinite(meta.max)) meta.max = Number.isFinite(q.marks) ? q.marks : ((meta.needsRearrangement || meta.needsConversion) ? 4 : 3);
      q._calcMeta = meta;
      return meta;
    }
    const id = q.id || '';
    const prompt = q.prompt || '';
    let meta = null;

    let m = null;
    if((m = prompt.match(/^A\s+([\d.,]+)\s+kg object moves at\s+([\d.,]+)\s+m\/s\./i))){
      meta = {kind:'ke', m:parseNumBits(m[1]), v:parseNumBits(m[2]), needsRearrangement:false, needsConversion:false};
    } else if((m = prompt.match(/^A\s+([\d.,]+)\s+kg mass is raised by\s+([\d.,]+)\s+m on a planet where g\s*=\s*([\d.,]+)\s+N\/kg\./i))){
      meta = {kind:'gpe', m:parseNumBits(m[1]), h:parseNumBits(m[2]), g:parseNumBits(m[3]), needsRearrangement:false, needsConversion:false};
    } else if((m = prompt.match(/^A spring has k\s*=\s*([\d.,]+)\s+N\/m and is stretched by\s+([\d.,]+)\s+m/i))){
      meta = {kind:'epe', k:parseNumBits(m[1]), e:parseNumBits(m[2]), needsRearrangement:false, needsConversion:false};
    } else if((m = prompt.match(/^A force of\s+([\d.,]+)\s+N moves an object\s+([\d.,]+)\s+m/i))){
      meta = {kind:'work', F:parseNumBits(m[1]), s:parseNumBits(m[2]), needsRearrangement:false, needsConversion:false};
    } else if((m = prompt.match(/^A device transfers\s+([\d.,]+)\s+J of energy in\s+([\d.,]+)\s+([A-Za-z]+)\./i))){
      const E = parseNumBits(m[1]);
      const timeValue = parseNumBits(m[2]);
      const timeUnit = m[3];
      const timeSeconds = secondsFrom(timeValue, timeUnit);
      meta = {kind:'power', E, timeValue, timeUnit, timeSeconds, needsRearrangement:false, needsConversion:Math.abs(timeSeconds - timeValue) > 1e-12};
    } else if((m = prompt.match(/^An appliance has power\s+([\d.,]+)\s+(kW|W) and runs for\s+([\d.,]+)\s+([A-Za-z]+)\./i))){
      const powerValue = parseNumBits(m[1]);
      const powerUnit = m[2];
      const timeValue = parseNumBits(m[3]);
      const timeUnit = m[4];
      const powerW = /^kW$/i.test(powerUnit) ? powerValue * 1000 : powerValue;
      const timeSeconds = secondsFrom(timeValue, timeUnit);
      meta = {kind:'elecEnergyPt', powerValue, powerUnit, powerW, timeValue, timeUnit, timeSeconds, needsRearrangement:false, needsConversion:(Math.abs(powerW - powerValue) > 1e-12) || (Math.abs(timeSeconds - timeValue) > 1e-12)};
    } else if((m = prompt.match(/^A device takes\s+([\d.,]+)\s+A at\s+([\d.,]+)\s+V for\s+([\d.,]+)\s+([A-Za-z]+)\./i))){
      const I = parseNumBits(m[1]);
      const V = parseNumBits(m[2]);
      const timeValue = parseNumBits(m[3]);
      const timeUnit = m[4];
      const timeSeconds = secondsFrom(timeValue, timeUnit);
      meta = {kind:'elecEnergyIVt', I, V, timeValue, timeUnit, timeSeconds, needsRearrangement:false, needsConversion:Math.abs(timeSeconds - timeValue) > 1e-12};
    } else if((m = prompt.match(/^An appliance has power\s+([\d.,]+)\s+(kW|W) at\s+([\d.,]+)\s+V\./i))){
      const powerValue = parseNumBits(m[1]);
      const powerUnit = m[2];
      const V = parseNumBits(m[3]);
      const powerW = /^kW$/i.test(powerUnit) ? powerValue * 1000 : powerValue;
      meta = {kind:'currentFromPV', powerValue, powerUnit, powerW, V, needsRearrangement:true, needsConversion:Math.abs(powerW - powerValue) > 1e-12};
    } else if((m = prompt.match(/^A device takes\s+([\d.,]+)\s+A at\s+([\d.,]+)\s+V\./i))){
      meta = {kind:'powerFromIV', I:parseNumBits(m[1]), V:parseNumBits(m[2]), needsRearrangement:false, needsConversion:false};
    } else if((m = prompt.match(/^A\s+([\d.,]+)\s+kg block gains\s+([\d.,]+)\s+J of thermal energy and its temperature rises by\s+([\d.,]+)\s+°C\./i))){
      meta = {kind:'shc', m:parseNumBits(m[1]), E:parseNumBits(m[2]), dT:parseNumBits(m[3]), needsRearrangement:true, needsConversion:false};
    } else if((m = prompt.match(/^A\s+([\d.,]+)\s+kg substance has c\s*=\s*([\d.,]+)\s+J\/\(kg\s*°C\)\. It gains\s+([\d.,]+)\s+J\./i))){
      meta = {kind:'deltaT', m:parseNumBits(m[1]), c:parseNumBits(m[2]), E:parseNumBits(m[3]), needsRearrangement:true, needsConversion:false};
    } else if((m = prompt.match(/^A\s+([\d.,]+)\s+kW heater runs for\s+([\d.,]+)\s+s\. Only\s+([\d.,]+)% of the energy heats\s+([\d.,]+)\s+kg of water\. Water warms from\s+([\d.,]+)\s+°C to\s+([\d.,]+)\s+°C\./i))){
      const powerValue = parseNumBits(m[1]);
      const powerW = powerValue * 1000;
      const timeSeconds = parseNumBits(m[2]);
      const effPercent = parseNumBits(m[3]);
      const mMass = parseNumBits(m[4]);
      const startT = parseNumBits(m[5]);
      const endT = parseNumBits(m[6]);
      meta = {kind:'shcEff', powerValue, powerW, timeSeconds, effPercent, effFraction:effPercent/100, m:mMass, startT, endT, dT:endT-startT, needsRearrangement:true, needsConversion:true};
    } else if((m = prompt.match(/^A device transfers\s+([\d.,]+)\s+J usefully when\s+([\d.,]+)\s+J is supplied\./i))){
      meta = {kind:'efficiency', useful:parseNumBits(m[1]), total:parseNumBits(m[2]), needsRearrangement:false, needsConversion:false};
    }

    if(!meta) meta = {kind:'genericNumeric', needsRearrangement:false, needsConversion:false};
    meta.max = (meta.needsRearrangement || meta.needsConversion) ? 4 : 3;
    q._calcMeta = meta;
    return meta;
  }
  function qMaxMarks(q){
    if(Number.isFinite(q.marks)) return q.marks;
    if(q.type === 'numeric'){
      const meta = inferCalcMeta(q);
      if(meta && Number.isFinite(meta.max)) return meta.max;
    }
    if(Array.isArray(q.markPoints)) return q.markPoints.length;
    return 1;
  }

  function bridgePlaceholder(name){
    if(name === 'lhs') return 'left side';
    if(name === 'relation') return 'relation';
    if(name === 'rhs') return 'right side';
    return 'choose';
  }
  function bridgeLabel(name){
    if(name === 'lhs') return 'Pick the first quantity';
    if(name === 'relation') return 'Pick the relation';
    if(name === 'rhs') return 'Pick the second quantity';
    return 'Choose';
  }
  function renderBridgeSelect(name, options, currentValue){
    const opts = (options || []).map(opt => `<option value="${escapeHtml(String(opt))}" ${String(opt) === String(currentValue || '') ? 'selected' : ''}>${escapeHtml(String(opt))}</option>`).join('');
    return `<label class="bridgePick"><span>${bridgeLabel(name)}</span><select data-bridge="${name}"><option value="">${bridgePlaceholder(name)}</option>${opts}</select></label>`;
  }
  function bridgeMarkup(q){
    if(!q || !q.bridge) return '';
    const b = q.bridge;
    return `<div class="bridgeBox">
      <div class="bridgeTitle">${escapeHtml(b.prompt || 'Helpful bridge (optional):')}</div>
      <div class="bridgeRow">
        ${renderBridgeSelect('lhs', b.lhsChoices || [], '')}
        ${renderBridgeSelect('relation', b.relationChoices || ['='], '')}
        ${renderBridgeSelect('rhs', b.rhsChoices || [], '')}
      </div>
      <div class="small">Pick the quantities you are treating as equal. A correct final answer still gets full marks.</div>
    </div>`;
  }
  function getBridgeState(q){
    if(!q || !q.bridge || !q._instanceId) return null;
    const root = document.getElementById(`card_${q._instanceId}`);
    if(!root) return null;
    const lhs = root.querySelector('select[data-bridge="lhs"]');
    const relation = root.querySelector('select[data-bridge="relation"]');
    const rhs = root.querySelector('select[data-bridge="rhs"]');
    return {lhs: lhs ? lhs.value : '', relation: relation ? relation.value : '', rhs: rhs ? rhs.value : ''};
  }
  function evaluateBridge(q){
    if(!q || !q.bridge) return {attempted:false, correct:false, marks:0, note:''};
    const state = getBridgeState(q);
    if(!state) return {attempted:false, correct:false, marks:0, note:''};
    if(!state.lhs && !state.relation && !state.rhs) return {attempted:false, correct:false, marks:0, note:''};
    const c = q.bridge.correct || {};
    const correct = state.lhs === c.lhs && state.relation === c.relation && state.rhs === c.rhs;
    const marks = correct ? (q.bridge.marks || 1) : 0;
    const answerText = [c.lhs, c.relation, c.rhs].filter(Boolean).join(' ');
    return {attempted:true, correct, marks, note: correct ? `Bridge statement correct: ${answerText}.` : `Bridge statement not quite right. A good bridge here is ${answerText}.`};
  }

  function getCalcWorking(q){
    if(!q || !q._instanceId) return '';
    const el = document.getElementById(`work_${q._instanceId}`);
    return el ? (el.value || '') : '';
  }
  function normWorking(raw){
    return String(raw || '')
      .toLowerCase()
      .replace(/Δ/g,'delta')
      .replace(/θ/g,'theta')
      .replace(/×/g,'x')
      .replace(/\s+/g,'');
  }
  function textHasAny(raw, arr){
    const t = normWorking(raw);
    return (arr || []).some(x => t.includes(normWorking(x)));
  }
  function scoreCalcWorking(meta, working){
    const raw = String(working || '').trim();
    if(!raw || !meta) return {marks:0, notes:[]};
    let marks = 0;
    const notes = [];
    const seen = new Set();
    function award(key, cond, note){
      if(cond && !seen.has(key)){
        seen.add(key);
        marks += 1;
        notes.push(note);
      }
    }
    const t = normWorking(raw);
    const has = (arr) => (arr || []).some(x => t.includes(normWorking(x)));
    const mentionsSeconds = (value) => Number.isFinite(value) && (t.includes(String(value)) || t.includes(String(value).replace(/\.0+$/,'')));
    const convertedTime = () => has(['x60','*60','÷60','/60','seconds','secs','s=']) || mentionsSeconds(meta.timeSeconds);
    const convertedPower = () => has(['x1000','*1000','kw','w']) || mentionsSeconds(meta.powerW);

    switch(meta.kind){
      case 'gpeToKeSpeed':
        award('gpe', has(['mgh','ep=','gpe']), 'Method seen: using gravitational potential energy.');
        award('ke', has(['1/2mv^2','0.5mv^2','ek=','v^2','sqrt']), 'Method seen: linking to the kinetic energy equation.');
        award('rearrange', has(['v=','sqrt','v^2']), 'Method seen: rearranging for the speed.');
        break;
      case 'keToGpeHeight':
        award('ke', has(['1/2mv^2','0.5mv^2','ek=']), 'Method seen: using kinetic energy.');
        award('gpe', has(['mgh','ep=','gpe','h=']), 'Method seen: linking to gravitational potential energy.');
        award('rearrange', has(['h=','/g','/10','/9.8']), 'Method seen: rearranging for the height.');
        break;
      case 'liftPower':
        award('gpe', has(['mgh','ep=','gpe']), 'Method seen: finding the useful energy gain.');
        award('power', has(['p=e/t','power=e/t','p=ep/t','p=9000/']), 'Method seen: using P = E / t.');
        award('time', convertedTime(), 'Method seen: converting the time to seconds.');
        break;
      case 'liftInputPowerEff':
        award('gpe', has(['mgh','ep=','gpe']), 'Method seen: finding the useful energy gain.');
        award('power', has(['p=e/t','power=e/t','p=ep/t']), 'Method seen: finding the useful power first.');
        award('eff', has(['eff','efficiency','useful/input','input=useful/']), 'Method seen: using efficiency to move from useful output to input.');
        award('time', convertedTime(), 'Method seen: converting the time to seconds.');
        break;
      case 'accelPowerRest':
        award('ke', has(['1/2mv^2','0.5mv^2','ek=']), 'Method seen: finding the gain in kinetic energy.');
        award('power', has(['p=e/t','power=e/t']), 'Method seen: using P = E / t.');
        award('time', convertedTime(), 'Method seen: converting the time to seconds.');
        break;
      case 'accelPowerMoving':
        award('added', has(['pt','e=pt','pxt','p*t']), 'Method seen: finding the energy added from the power.');
        award('initial', has(['1/2mu^2','0.5mu^2','initialek','ek(initial)','10^2','u^2']), 'Method seen: finding the initial kinetic energy.');
        award('change', has(['deltaek','changeinke','ek(final)','finalek','+']), 'Method seen: combining the added energy with the initial kinetic energy.');
        award('rearrange', has(['v=','sqrt','v^2']), 'Method seen: rearranging ½mv² for the new speed.');
        break;
      case 'keToTempRise':
        award('ke', has(['1/2mv^2','0.5mv^2','ek=']), 'Method seen: finding the kinetic energy first.');
        award('heat', has(['mcdelta','mcdelta','mcθ','mcΔ','mc']), 'Method seen: using ΔE = mcΔθ.');
        award('rearrange', has(['deltatheta=','deltaθ=','/mc','/450','/130','/390']), 'Method seen: rearranging for the temperature rise.');
        break;
      case 'gpeToTempRise':
        award('gpe', has(['mgh','ep=','gpe']), 'Method seen: finding the gravitational potential energy first.');
        award('heat', has(['mcdelta','mcdelta','mcθ','mcΔ','mc']), 'Method seen: using ΔE = mcΔθ.');
        award('rearrange', has(['deltatheta=','deltaθ=','/mc','/130','/450','/390']), 'Method seen: rearranging for the temperature rise.');
        break;
      case 'springToSpeed':
        award('epe', has(['1/2ke^2','0.5ke^2','ee=','elast']), 'Method seen: finding the elastic energy first.');
        award('ke', has(['1/2mv^2','0.5mv^2','ek=']), 'Method seen: linking to the kinetic energy equation.');
        award('rearrange', has(['v=','sqrt','v^2']), 'Method seen: rearranging for the speed.');
        break;
      case 'springToHeight':
        award('epe', has(['1/2ke^2','0.5ke^2','ee=','elast']), 'Method seen: finding the elastic energy first.');
        award('gpe', has(['mgh','ep=','gpe','h=']), 'Method seen: linking to gravitational potential energy.');
        award('rearrange', has(['h=','/g','/10','/9.8']), 'Method seen: rearranging for the height.');
        break;
      case 'brakingForceFromKE':
        award('ke', has(['1/2mv^2','0.5mv^2','ek=']), 'Method seen: finding the kinetic energy.');
        award('work', has(['w=fs','work=fs','fs=']), 'Method seen: using W = Fs.');
        award('rearrange', has(['f=','/45','/s']), 'Method seen: rearranging for the braking force.');
        break;
      case 'hangingSpringEnergy':
        award('weight', has(['mg','weight','w=mg']), 'Method seen: finding the weight.');
        award('hooke', has(['f=ke','k=f/e','springforce','equilibrium','weight=spring']), 'Method seen: linking the weight to the spring force.');
        award('epe', has(['1/2ke^2','0.5ke^2','ee=']), 'Method seen: using Ee = ½ke².');
        break;
      case 'dropWithInitialKE':
        award('initial', has(['1/2mu^2','0.5mu^2','initialek','ek(initial)','8^2','u^2']), 'Method seen: finding the initial kinetic energy.');
        award('gpe', has(['mgh','ep=','gpe']), 'Method seen: finding the gravitational potential energy.');
        award('combine', has(['finalek','ek(final)','totalke','+']), 'Method seen: combining the energies to get the final kinetic energy.');
        award('rearrange', has(['v=','sqrt','v^2']), 'Method seen: rearranging for the final speed.');
        break;
      case 'keToTempNoMass':
        award('ke', has(['1/2mv^2','0.5mv^2','ek=']), 'Method seen: writing the kinetic energy expression.');
        award('heat', has(['mcdelta','mcdelta','mcθ','mcΔ']), 'Method seen: writing the thermal energy expression.');
        award('cancel', has(['cancelm','masscancels','massescancel','/m']), 'Method seen: cancelling the mass correctly.');
        award('rearrange', has(['deltatheta=','deltaθ=','/390','/c']), 'Method seen: rearranging for the temperature rise.');
        break;
      case 'power':
      case 'elecEnergyPt':
      case 'elecEnergyIVt':
      case 'currentFromPV':
      case 'powerFromIV':
      case 'shc':
      case 'deltaT':
      case 'shcEff':
      case 'efficiency':
      default:
        award('formula', has(['=']), 'Sensible working shown.');
        if(meta.needsConversion) award('conversion', convertedTime() || convertedPower(), 'Method seen: a conversion step is being attempted.');
        break;
    }
    return {marks, notes};
  }

  function textIncludesAny(t, arr){ return arr.some(x => t.includes(norm(x))); }
  function countDecimalPlaces(numStr){
    const s = numStr.toLowerCase();
    const base = s.split('e')[0];
    const dot = base.indexOf('.');
    return (dot === -1) ? 0 : (base.length - dot - 1);
  }
  function countSigFigs(numStr){
    let s = numStr.toLowerCase();
    s = s.replace(/^[-+]/,'').split('e')[0];
    if(s.includes('.')){
      s = s.replace(/^0+/, '').replace('.','').replace(/^0+/, '');
      return Math.max(1, s.length);
    }
    s = s.replace(/^0+/, '').replace(/0+$/,'');
    return Math.max(1, s.length || 1);
  }
  function roundToDp(x, dp){
    const f = Math.pow(10, dp);
    return Math.round((x + Number.EPSILON) * f) / f;
  }
  function roundToSf(x, sf){
    if(x === 0) return 0;
    return Number(x.toPrecision(sf));
  }
  function nearlyEqual(a,b, rel=1e-4, abs=1e-9){
    const diff = Math.abs(a-b);
    if(diff <= abs) return true;
    const scale = Math.max(Math.abs(a), Math.abs(b), 1e-12);
    return diff/scale <= rel;
  }
  function roundingMatch(studentVal, trueVal, numStr){
    if(nearlyEqual(studentVal, trueVal)) return {ok:true};
    const dp = countDecimalPlaces(numStr);
    const sf = countSigFigs(numStr);
    if(nearlyEqual(studentVal, roundToDp(trueVal, dp), 1e-10, 1e-12)) return {ok:true};
    if(nearlyEqual(studentVal, roundToSf(trueVal, sf), 1e-10, 1e-12)) return {ok:true};
    return {ok:false};
  }

  function tidyUnitToken(u){
    if(!u) return null;
    let t = u.toString().trim();
    if(!t) return null;
    t = t.replace(/[–−]/g,'-');
    t = t.replace(/Ω/g,'ohm');
    t = t.replace(/²/g,'^2').replace(/³/g,'^3');
    t = t.replace(/degrees?\s*c/ig,'degC');
    t = t.replace(/deg\s*c/ig,'degC');
    t = t.replace(/°\s*c/ig,'degC');
    t = t.replace(/\s+/g,'');
    return t;
  }
  function parseShcUnit(raw){
    const compact = raw.replace(/degrees?\s*c/ig,'degC').replace(/deg\s*c/ig,'degC').replace(/°\s*c/ig,'degC').replace(/\s+/g,'');
    const okBracket = /^J\/\(kg(?:degC|K)\)$/.test(compact);
    const okIndex = /^Jkg\^-?1(?:degC|K)\^-?1$/.test(compact);
    if(!(okBracket || okIndex)) return null;
    return {type:'shc', canonical:'J kg^-1 °C^-1', scale:1, caseOk:true};
  }
  function unitInfo(raw){
    if(!raw) return null;
    const eq = want => raw === want;
    const ieq = want => raw.toLowerCase() === want.toLowerCase();

    if(ieq('kg')) return {type:'mass', canonical:'kg', scale:1, caseOk:eq('kg')};
    if(ieq('g')) return {type:'mass', canonical:'g', scale:1e-3, caseOk:eq('g')};
    if(ieq('m')) return {type:'length', canonical:'m', scale:1, caseOk:eq('m')};
    if(ieq('cm')) return {type:'length', canonical:'cm', scale:1e-2, caseOk:eq('cm')};
    if(ieq('mm')) return {type:'length', canonical:'mm', scale:1e-3, caseOk:eq('mm')};
    if(ieq('s')) return {type:'time', canonical:'s', scale:1, caseOk:eq('s')};
    if(ieq('min') || ieq('mins') || ieq('minute') || ieq('minutes')) return {type:'time', canonical:'min', scale:60, caseOk:true};
    if(ieq('h') || ieq('hr') || ieq('hour') || ieq('hours')) return {type:'time', canonical:'h', scale:3600, caseOk:true};
    if(ieq('m/s') || ieq('ms^-1') || ieq('mps')) return {type:'speed', canonical:'m/s', scale:1, caseOk:eq('m/s')};
    if(ieq('m/s^2') || ieq('ms^-2')) return {type:'acc', canonical:'m/s^2', scale:1, caseOk:eq('m/s^2')};
    if(ieq('N') || ieq('newton') || ieq('newtons')) return {type:'force', canonical:'N', scale:1, caseOk:eq('N')};
    if(ieq('N/kg') || ieq('Nkg^-1')) return {type:'gfield', canonical:'N/kg', scale:1, caseOk:eq('N/kg')};
    if(ieq('N/m') || ieq('Nm^-1')) return {type:'spring', canonical:'N/m', scale:1, caseOk:eq('N/m')};
    if(ieq('J')) return {type:'energy', canonical:'J', scale:1, caseOk:eq('J')};
    if(ieq('kJ')) return {type:'energy', canonical:'kJ', scale:1e3, caseOk:eq('kJ')};
    if(ieq('MJ')) return {type:'energy', canonical:'MJ', scale:1e6, caseOk:eq('MJ')};
    if(ieq('W')) return {type:'power', canonical:'W', scale:1, caseOk:eq('W')};
    if(ieq('kW')) return {type:'power', canonical:'kW', scale:1e3, caseOk:eq('kW')};
    if(ieq('MW')) return {type:'power', canonical:'MW', scale:1e6, caseOk:eq('MW')};
    if(ieq('V')) return {type:'voltage', canonical:'V', scale:1, caseOk:eq('V')};
    if(ieq('A')) return {type:'current', canonical:'A', scale:1, caseOk:eq('A')};
    if(ieq('mA')) return {type:'current', canonical:'mA', scale:1e-3, caseOk:eq('mA')};
    if(ieq('ohm') || ieq('ohms')) return {type:'resistance', canonical:'Ω', scale:1, caseOk:true};
    if(raw.includes('ohm')) return {type:'resistance', canonical:'Ω', scale:1, caseOk:true};
    if(/^degC$/i.test(raw) || /^degreesC$/i.test(raw)) return {type:'tempC', canonical:'°C', scale:1, caseOk:true};
    if(raw === 'K') return {type:'tempK', canonical:'K', scale:1, caseOk:true};
    const shc = parseShcUnit(raw);
    if(shc) return shc;
    return null;
  }
  function parseQuantity(raw){
    if(raw === null || raw === undefined) return {ok:false};
    let s = raw.toString().trim();
    if(!s) return {ok:false};
    s = s.replace(/,/g,'').replace(/×/g,'x').replace(/[–−]/g,'-');
    s = s.replace(/([-+]?(?:\d+(?:\.\d*)?|\.\d+))\s*[x\*]\s*10\^?\s*\(?\s*([-+]?\d+)\s*\)?/gi, '$1e$2');

    const frac = s.match(/^\s*([-+]?\d+)\s*\/\s*([1-9]\d*)(.*)$/);
    if(frac){
      const a = Number(frac[1]);
      const b = Number(frac[2]);
      const suffix = frac[3].trim();
      const token = tidyUnitToken(suffix);
      const unitPresent = !!token;
      return {ok:true, num:a/b, numStr:`${a}/${b}`, unitPresent, unitToken:token, unitInfo: unitPresent ? unitInfo(token) : null, fromFraction:true};
    }

    const m = s.match(/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?/i);
    if(m){
      const numStr = m[0].replace(/\s+/g,'');
      const num = Number(numStr);
      if(!Number.isNaN(num)){
        const suffix = s.slice(m[0].length).trim();
        const token = tidyUnitToken(suffix);
        const unitPresent = !!token;
        return {ok:true, num, numStr, unitPresent, unitToken:token, unitInfo: unitPresent ? unitInfo(token) : null, fromFraction:false};
      }
    }

    const tail = s.match(/([-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?)\s*([A-Za-z°Ω/%][A-Za-z°Ω/%()\s^-]*)?\s*$/i);
    if(tail){
      const numStr = String(tail[1] || '').replace(/\s+/g,'');
      const num = Number(numStr);
      if(!Number.isNaN(num)){
        const suffix = String(tail[2] || '').trim();
        const token = tidyUnitToken(suffix);
        const unitPresent = !!token;
        return {ok:true, num, numStr, unitPresent, unitToken:token, unitInfo: unitPresent ? unitInfo(token) : null, fromFraction:false, fromTrailing:true};
      }
    }
    return {ok:false};
  }

  function expectedUnitInfo(unitHint){
    if(!unitHint) return null;
    if(unitHint === 'Ω') return {type:'resistance', canonical:'Ω', scale:1};
    if(unitHint === '°C') return {type:'tempDelta', canonical:'°C', scale:1};
    if(unitHint === 'J/kg°C' || unitHint === 'J/kg °C') return {type:'shc', canonical:'J kg^-1 °C^-1', scale:1};
    const info = unitInfo(tidyUnitToken(unitHint));
    return info ? {type:info.type, canonical:info.canonical, scale:info.scale} : null;
  }
  function unitAcceptedForExpected(info, exp){
    if(!info || !exp) return false;
    if(exp.type === 'tempDelta') return info.type === 'tempC' || info.type === 'tempK';
    return info.type === exp.type;
  }


  function scoreWithUnitPenalty(baseScore, max, unitPenalty){
    const score = clamp(baseScore - (unitPenalty ? 0.5 : 0), 0, max);
    const status = score <= 0 ? 'wrong' : (score >= max ? 'full' : 'partial');
    return {score, status};
  }
  function candidateOutcome(baseMarks, max, unitPenalty, reason, unitMsg){
    const scored = scoreWithUnitPenalty(baseMarks, max, unitPenalty);
    return {checked:true, status:scored.status, score:scored.score, max, reason, unitMsg:unitPenalty ? (unitMsg || 'Unit missing.') : '', auto:false};
  }
  function addCalcMarkGuide(meta, reason){
    const guide = (meta && meta.markGuide)
      ? meta.markGuide
      : (() => {
          const bits = ['Marking idea: 1 for substitution'];
          if(meta && meta.needsRearrangement) bits.push('1 for rearrangement');
          bits.push('1 for correct answer');
          if(meta && meta.needsConversion) bits.push('1 for converting units/time properly');
          return bits.join(', ') + '. A fully correct final answer gets full marks.';
        })();
    return reason ? `${reason}
${guide}` : guide;
  }
  function findCandidate(studentBase, numStr, candidates){
    let best = null;
    for(const cand of candidates){
      if(!cand || !Number.isFinite(cand.value)) continue;
      if(roundingMatch(studentBase, cand.value, numStr).ok){
        if(!best || cand.marks > best.marks) best = cand;
      }
    }
    return best;
  }
  function numericFallbackReason(meta){
    if(!meta) return 'Check the formula, your substitution and any unit conversions.';
    switch(meta.kind){
      case 'ke': return 'Use Ek = ½mv². Square the speed first, then multiply by the mass and by ½.';
      case 'gpe': return 'Use GPE = mgh. Multiply the mass, g and the height.';
      case 'epe': return 'Use Ee = ½ke². Square the extension, then multiply by k and by ½.';
      case 'work': return 'Use W = Fs. Multiply force by distance moved in the direction of the force.';
      case 'power': return 'Use P = E / t, with time in seconds.';
      case 'elecEnergyPt': return 'Use E = Pt, with power in watts and time in seconds.';
      case 'elecEnergyIVt': return 'Use E = IVt, with time in seconds.';
      case 'currentFromPV': return 'Use P = IV, so I = P / V. Convert kW to W first if needed.';
      case 'powerFromIV': return 'Use P = IV. Multiply current by voltage.';
      case 'shc': return 'Start from ΔE = mcΔθ and rearrange to c = ΔE / (mΔθ).';
      case 'deltaT': return 'Start from ΔE = mcΔθ and rearrange to Δθ = ΔE / (mc).';
      case 'shcEff': return 'Use c = (energy that heats the water) / (mΔθ). For the heater, E = Pt and only 80% is useful.';
      case 'efficiency': return 'Use efficiency = useful output / total input. Give a decimal, or a percentage with %.';
      case 'gpeToKeSpeed': return 'Find the GPE first, then use the bridge Ep = Ek before solving ½mv² for the speed.';
      case 'keToGpeHeight': return 'Find the KE first, then use the bridge Ek = Ep before solving mgh for the height.';
      case 'liftPower': return 'Find the useful energy change first, bridge it to E in P = E/t, and make sure the time is in seconds.';
      case 'liftInputPowerEff': return 'Find the useful GPE gain, then the useful power, then use efficiency to get the input power.';
      case 'accelPowerRest': return 'Find the gain in kinetic energy, bridge it to E in P = E/t, then divide by the time.';
      case 'accelPowerMoving': return 'Find the energy added from power first; that equals the change in KE, not the final KE by itself.';
      case 'keToTempRise': return 'Find the KE first, bridge it to ΔE, then use ΔE = mcΔθ and rearrange for the temperature rise.';
      case 'gpeToTempRise': return 'Find the GPE first, bridge it to ΔE, then use ΔE = mcΔθ and rearrange for the temperature rise.';
      case 'springToSpeed': return 'Find the elastic energy first, bridge Ee = Ek, then rearrange ½mv² for the speed.';
      case 'springToHeight': return 'Find the elastic energy first, bridge Ee = Ep, then rearrange mgh for the height.';
      case 'brakingForceFromKE': return 'Find the KE first, bridge it to work done, then use W = Fs and rearrange for the force.';
      case 'hangingSpringEnergy': return 'Use weight = mg, then at equilibrium weight = spring force, then F = ke, then Ee = ½ke².';
      case 'dropWithInitialKE': return 'Find the initial KE and the GPE, add them to get the final KE, then rearrange ½mv² for the final speed.';
      case 'keToTempNoMass': return 'Set ½mv² = mcΔθ and cancel the mass before rearranging for the temperature rise.';
      default: return 'Check the correct formula, your substitution and any conversions.';
    }
  }
  function diagnoseNumeric(meta, studentBase, numStr){
    if(!meta) return null;
    let candidates = [];
    if(meta.kind === 'ke'){
      const {m, v} = meta;
      candidates = [
        {value:m*v*v, marks:2, reason:'Looks like you forgot the ½ in Ek = ½mv².'},
        {value:0.5*m*v, marks:1, reason:'Looks like you did not square the speed.'},
        {value:m*v, marks:1, reason:'Looks like you did not square the speed and may also have missed the ½.'}
      ];
    } else if(meta.kind === 'gpe'){
      const {m, g, h} = meta;
      candidates = [
        {value:m*h, marks:1, reason:'Looks like you left out g in GPE = mgh.'},
        {value:m*g, marks:1, reason:'Looks like you left out the height in GPE = mgh.'},
        {value:g*h, marks:1, reason:'Looks like you left out the mass in GPE = mgh.'}
      ];
    } else if(meta.kind === 'epe'){
      const {k, e} = meta;
      candidates = [
        {value:k*e*e, marks:2, reason:'Looks like you forgot the ½ in Ee = ½ke².'},
        {value:0.5*k*e, marks:1, reason:'Looks like you did not square the extension.'},
        {value:k*e, marks:1, reason:'Looks like you did not square the extension and may also have missed the ½.'}
      ];
    } else if(meta.kind === 'work'){
      const {F, s} = meta;
      candidates = [
        {value:F/s, marks:1, reason:'Looks like you divided instead of multiplying. Use W = Fs.'},
        {value:s/F, marks:0.5, reason:'Looks like the quantities have been used the wrong way round. Use W = Fs.'}
      ];
    } else if(meta.kind === 'power'){
      const {E, timeValue, timeSeconds, needsConversion} = meta;
      if(needsConversion) candidates.push({value:E/timeValue, marks:2, reason:`Looks like you used ${prettyNum(timeValue)} ${meta.timeUnit} directly. Convert time to seconds before using P = E / t.`});
      candidates.push({value:E*timeSeconds, marks:1.5, reason:'Looks like you multiplied by time. For power, divide energy by time.'});
      if(needsConversion) candidates.push({value:E*timeValue, marks:1, reason:'Looks like you both used the wrong operation and did not convert the time to seconds.'});
    } else if(meta.kind === 'elecEnergyPt'){
      const {powerValue, powerW, timeValue, timeSeconds} = meta;
      if(Math.abs(powerW - powerValue) > 1e-12) candidates.push({value:powerValue*timeSeconds, marks:2, reason:'Looks like you used kW as if it were W. Convert power to watts first.'});
      if(Math.abs(timeSeconds - timeValue) > 1e-12) candidates.push({value:powerW*timeValue, marks:2, reason:`Looks like you used ${prettyNum(timeValue)} ${meta.timeUnit} directly. Convert the time to seconds first.`});
      if(Math.abs(powerW - powerValue) > 1e-12 && Math.abs(timeSeconds - timeValue) > 1e-12) candidates.push({value:powerValue*timeValue, marks:1, reason:'Looks like both the power and the time were left in the given units. Convert to watts and seconds before using E = Pt.'});
      candidates.push({value:powerW/timeSeconds, marks:1.5, reason:'Looks like you divided by time. For energy transferred here, use E = Pt.'});
    } else if(meta.kind === 'elecEnergyIVt'){
      const {I, V, timeValue, timeSeconds} = meta;
      if(Math.abs(timeSeconds - timeValue) > 1e-12) candidates.push({value:I*V*timeValue, marks:2, reason:`Looks like you used ${prettyNum(timeValue)} ${meta.timeUnit} directly. Convert the time to seconds before using E = IVt.`});
      candidates.push({value:(I*V)/timeSeconds, marks:1.5, reason:'Looks like you divided by time instead of multiplying by it. Use E = IVt.'});
    } else if(meta.kind === 'currentFromPV'){
      const {powerValue, powerW, V} = meta;
      if(Math.abs(powerW - powerValue) > 1e-12) candidates.push({value:powerValue/V, marks:2, reason:'Looks like you used kW as if it were W. Convert power to watts before finding the current.'});
      candidates.push({value:powerW*V, marks:1, reason:'Looks like you multiplied by the voltage. From P = IV, rearrange to I = P / V.'});
      candidates.push({value:V/powerW, marks:0.5, reason:'Looks like the rearrangement went the wrong way. From P = IV, I = P / V.'});
    } else if(meta.kind === 'powerFromIV'){
      const {I, V} = meta;
      candidates = [
        {value:I/V, marks:1, reason:'Looks like you divided instead of multiplying. Use P = IV.'},
        {value:V/I, marks:1, reason:'Looks like you divided instead of multiplying. Use P = IV.'}
      ];
    } else if(meta.kind === 'shc'){
      const {E, m, dT} = meta;
      candidates = [
        {value:E/m, marks:2, reason:'Looks like you divided by the mass but not by the temperature rise. Use c = ΔE / (mΔθ).'},
        {value:E/dT, marks:2, reason:'Looks like you divided by the temperature rise but not by the mass. Use c = ΔE / (mΔθ).'},
        {value:E*m*dT, marks:1.5, reason:'Looks like you multiplied by mΔθ instead of dividing by it when rearranging ΔE = mcΔθ.'},
        {value:(E/m)*dT, marks:1.5, reason:'Looks like the rearrangement is off. After rearranging, divide by both m and Δθ.'}
      ];
    } else if(meta.kind === 'deltaT'){
      const {E, m, c} = meta;
      candidates = [
        {value:E/m, marks:2, reason:'Looks like you divided by the mass but not by c. Use Δθ = ΔE / (mc).'},
        {value:E/c, marks:2, reason:'Looks like you divided by c but not by the mass. Use Δθ = ΔE / (mc).'},
        {value:E*m*c, marks:1.5, reason:'Looks like you multiplied by mc instead of dividing by it.'},
        {value:(E/m)*c, marks:1.5, reason:'Looks like the rearrangement is off. For Δθ, divide by both m and c.'}
      ];
    } else if(meta.kind === 'shcEff'){
      const {powerValue, powerW, timeSeconds, effFraction, effPercent, m, dT, endT} = meta;
      const usefulEnergy = powerW * timeSeconds * effFraction;
      candidates = [
        {value:(powerW * timeSeconds) / (m * dT), marks:2.5, reason:'Looks like you forgot to use only the useful 80% of the heater energy.'},
        {value:usefulEnergy / (m * endT), marks:2.5, reason:'Looks like you used the final temperature 100 °C instead of the temperature rise 82 °C.'},
        {value:(powerW * timeSeconds * effPercent) / (m * dT), marks:2, reason:'Looks like you used 80 instead of 0.80 for the efficiency factor.'},
        {value:(powerValue * timeSeconds * effFraction) / (m * dT), marks:2, reason:'Looks like you left the power in kW instead of converting to W.'}
      ];
    } else if(meta.kind === 'efficiency'){
      const {useful, total} = meta;
      candidates = [
        {value:total/useful, marks:1, reason:'Looks like the efficiency fraction has been reversed. Use useful output / total input.'},
        {value:(useful/total)*100, marks:2, reason:'That is the percentage value. Add % if you want to give the answer as a percentage.'}
      ];
    } else if(meta.kind === 'gpeToKeSpeed'){
      const E = meta.m * meta.g * meta.h;
      candidates = [
        {value:E, marks:2, reason:'That looks like the energy in joules. Use Ep = Ek and then solve ½mv² for the speed.'},
        {value:Math.sqrt(meta.g * meta.h), marks:2, reason:'Looks like the ½ in ½mv² has been missed when finding the speed.'}
      ];
    } else if(meta.kind === 'keToGpeHeight'){
      const E = 0.5 * meta.m * meta.v * meta.v;
      candidates = [
        {value:E, marks:2, reason:'That looks like the kinetic energy in joules. After finding it, set Ek = Ep and solve for the height.'},
        {value:E / meta.g, marks:1.5, reason:'Looks like the mass may have been left out when rearranging mgh.'}
      ];
    } else if(meta.kind === 'liftPower'){
      const E = meta.m * meta.g * meta.h;
      candidates = [
        {value:E, marks:2, reason:'That looks like the useful energy gain. Now use P = E/t.'},
        {value:E / meta.timeValue, marks:3, reason:`Looks like ${prettyNum(meta.timeValue)} ${meta.timeUnit} was used directly. Convert the time to seconds first.`}
      ];
    } else if(meta.kind === 'liftInputPowerEff'){
      const usefulE = meta.m * meta.g * meta.h;
      const usefulP = usefulE / meta.timeSeconds;
      candidates = [
        {value:usefulE, marks:2, reason:'That looks like the useful energy gain, not the input power.'},
        {value:usefulP, marks:4, reason:'That is the useful output power. One more step is needed: use the efficiency to find the input power.'},
        {value:usefulP * meta.effFraction, marks:3, reason:'Looks like the efficiency has been used in the wrong direction. Input power should be larger than useful output power.'}
      ];
    } else if(meta.kind === 'accelPowerRest'){
      const E = 0.5 * meta.m * meta.v * meta.v;
      candidates = [
        {value:E, marks:2, reason:'That looks like the gain in kinetic energy. Now use P = E/t.'},
        {value:(meta.m * meta.v * meta.v) / meta.timeSeconds, marks:3, reason:'Looks like the ½ in the kinetic energy equation has been missed.'}
      ];
    } else if(meta.kind === 'accelPowerMoving'){
      const added = meta.powerW * meta.timeSeconds;
      const initial = 0.5 * meta.m * meta.u * meta.u;
      candidates = [
        {value:added, marks:2, reason:'That looks like the energy added by the engine. It equals the change in KE, not the final speed.'},
        {value:Math.sqrt((2 * added) / meta.m), marks:3, reason:'Looks like only the added energy was used, without including the initial kinetic energy.'}
      ];
    } else if(meta.kind === 'keToTempRise'){
      const E = 0.5 * meta.m * meta.v * meta.v;
      candidates = [
        {value:E, marks:2, reason:'That looks like the kinetic energy in joules. Now use ΔE = mcΔθ to find the temperature rise.'},
        {value:E / meta.c, marks:2.5, reason:'Looks like c was used but the mass was missed when rearranging ΔE = mcΔθ.'}
      ];
    } else if(meta.kind === 'gpeToTempRise'){
      const E = meta.m * meta.g * meta.h;
      candidates = [
        {value:E, marks:2, reason:'That looks like the gravitational potential energy in joules. Now use ΔE = mcΔθ.'},
        {value:E / meta.c, marks:2.5, reason:'Looks like c was used but the mass was missed when rearranging ΔE = mcΔθ.'}
      ];
    } else if(meta.kind === 'springToSpeed'){
      const E = 0.5 * meta.k * meta.e * meta.e;
      candidates = [
        {value:E, marks:2, reason:'That looks like the elastic energy in joules. Now set Ee = Ek and solve for the speed.'},
        {value:Math.sqrt((meta.k * meta.e * meta.e) / meta.m), marks:3, reason:'Looks like the ½ terms were not handled correctly when bridging to the kinetic energy equation.'}
      ];
    } else if(meta.kind === 'springToHeight'){
      const E = 0.5 * meta.k * meta.e * meta.e;
      candidates = [
        {value:E, marks:2, reason:'That looks like the elastic energy in joules. Now set Ee = Ep and solve for the height.'},
        {value:E / meta.g, marks:2, reason:'Looks like the mass may have been left out when rearranging mgh.'}
      ];
    } else if(meta.kind === 'brakingForceFromKE'){
      const E = 0.5 * meta.m * meta.v * meta.v;
      candidates = [
        {value:E, marks:2, reason:'That looks like the kinetic energy in joules. Now use W = Fs to find the force.'},
        {value:E * meta.s, marks:2, reason:'Looks like you multiplied by the distance instead of dividing by it when using W = Fs.'}
      ];
    } else if(meta.kind === 'hangingSpringEnergy'){
      const weight = meta.m * meta.g;
      const k = weight / meta.e;
      candidates = [
        {value:weight, marks:2, reason:'That looks like the weight. You still need F = ke, then Ee = ½ke².'},
        {value:k, marks:4, reason:'That looks like the spring constant. One more step is needed: Ee = ½ke².'}
      ];
    } else if(meta.kind === 'dropWithInitialKE'){
      const initial = 0.5 * meta.m * meta.u * meta.u;
      const gpe = meta.m * meta.g * meta.h;
      candidates = [
        {value:initial, marks:2, reason:'That looks like only the initial kinetic energy.'},
        {value:gpe, marks:2, reason:'That looks like only the gravitational potential energy.'},
        {value:Math.sqrt((2 * gpe) / meta.m), marks:3, reason:'Looks like the fall was treated as if there were no initial speed.'}
      ];
    } else if(meta.kind === 'keToTempNoMass'){
      candidates = [
        {value:0.5 * meta.v * meta.v, marks:3, reason:'That looks like ½v². After cancelling mass, you still need to divide by c to get the temperature rise.'}
      ];
    }
    return findCandidate(studentBase, numStr, candidates);
  }
  function checkNumeric(q, raw, workingRaw){
    const rawText = (raw ?? '').toString().trim();
    const workingText = (workingRaw ?? '').toString();
    const parsed = parseQuantity(rawText || workingText);
    if(!parsed.ok) return {checked:false, msg:'Enter a number for the final answer (you can add units). Show working separately if you want method marks.'};

    const meta = inferCalcMeta(q);
    const bridge = evaluateBridge(q);
    const working = scoreCalcWorking(meta, workingText);
    const exp = expectedUnitInfo(q.unitHint || '');
    const unitNeeded = !!exp;
    const max = qMaxMarks(q);
    let usedScale = exp ? exp.scale : 1;
    let unitAccepted = !unitNeeded;
    let unitMsg = '';
    let unitPenalty = false;

    if(unitNeeded){
      if(!parsed.unitPresent){
        unitAccepted = false;
        unitPenalty = true;
        unitMsg = 'Unit missing.';
      } else if(!parsed.unitInfo){
        unitAccepted = false;
        unitMsg = 'Unit not recognised.';
      } else if(!unitAcceptedForExpected(parsed.unitInfo, exp)){
        unitAccepted = false;
        unitMsg = 'Unit looks wrong for this quantity.';
        usedScale = parsed.unitInfo.scale || 1;
      } else {
        usedScale = parsed.unitInfo.scale || 1;
        unitAccepted = true;
      }
    }

    if(q.allowFractionHalf){
      const percentMatch = rawText.match(/^\s*([-+]?(?:\d+(?:\.\d*)?|\.\d+))\s*%\s*$/);
      if(percentMatch){
        const pctVal = Number(percentMatch[1]);
        if(!Number.isNaN(pctVal) && roundingMatch(pctVal / 100, q.answer, percentMatch[1]).ok){
          return {checked:true, status:'full', score:max, max, unitMsg:'', auto:false};
        }
      }
    }

    const trueInStudentUnits = unitNeeded ? (q.answer / usedScale) : q.answer;
    const okNumeric = roundingMatch(parsed.num, trueInStudentUnits, parsed.numStr).ok;
    if(okNumeric){
      if(parsed.fromFraction && q.allowFractionHalf){
        return {checked:true, status:'partial', score:max/2, max, reason:addCalcMarkGuide(meta, 'Equivalent value, but write the efficiency as a decimal or percentage.'), unitMsg:'', auto:false};
      }
      const scored = scoreWithUnitPenalty(max, max, unitPenalty);
      const reasonParts = [];
      if(unitPenalty) reasonParts.push('Number correct, but include the unit.');
      if(working.notes.length) reasonParts.push('Method credit seen: ' + working.notes.join(' '));
      if(bridge.attempted && !bridge.correct) reasonParts.push(bridge.note);
      const reason = reasonParts.length ? addCalcMarkGuide(meta, reasonParts.join('\n')) : '';
      return {checked:true, status:scored.status, score:scored.score, max, reason, unitMsg:unitPenalty ? unitMsg : '', auto:false};
    }

    if(parsed.fromFraction && q.allowFractionHalf){
      const fracBase = parsed.num;
      if(roundingMatch(fracBase, q.answer, parsed.numStr).ok){
        return {checked:true, status:'partial', score:max/2, max, reason:addCalcMarkGuide(meta, 'Equivalent value, but write the efficiency as a decimal or percentage.'), unitMsg:'', auto:false};
      }
    }

    let studentBase = parsed.num;
    if(unitNeeded && parsed.unitInfo && unitAcceptedForExpected(parsed.unitInfo, exp)){
      studentBase = parsed.num * (parsed.unitInfo.scale || 1);
    }
    const diag = diagnoseNumeric(meta, studentBase, parsed.numStr);
    if(diag){
      const methodMarks = Math.max(diag.marks || 0, working.marks || 0);
      const totalMarks = Math.min(Math.max(0, max - 1), methodMarks + (bridge.correct ? bridge.marks : 0));
      const pieces = [diag.reason];
      if(working.notes.length) pieces.push('Method credit seen: ' + working.notes.join(' '));
      if(bridge.attempted) pieces.push(bridge.note);
      const reason = addCalcMarkGuide(meta, pieces.filter(Boolean).join('\n'));
      return candidateOutcome(totalMarks, max, unitPenalty, reason, unitMsg);
    }

    const methodOnly = Math.min(Math.max(0, max - 1), (working.marks || 0) + (bridge.correct ? bridge.marks : 0));
    const fallbackParts = [numericFallbackReason(meta)];
    if(working.notes.length) fallbackParts.push('Method credit seen: ' + working.notes.join(' '));
    if(bridge.attempted) fallbackParts.push(bridge.note);
    const fallback = addCalcMarkGuide(meta, fallbackParts.filter(Boolean).join('\n'));
    if(methodOnly > 0) return candidateOutcome(methodOnly, max, unitPenalty, fallback, unitMsg);
    return {checked:true, status:'wrong', score:0, max, reason:fallback, unitMsg:unitPenalty ? unitMsg : '', auto:false};
  }

  function checkUncertaintyQuestion(raw){
    const max = 2;
    const compact = (raw || '').toString().trim().replace(/\s+/g,'');
    if(!compact) return {checked:false, msg:'Type an answer first.'};
    const unitPresent = /s$/i.test(compact);
    let numText = compact.replace(/(?:\+\/\-|\+\-|±)/g,'');
    numText = numText.replace(/s$/i,'');
    const num = Number(numText);
    if(Number.isNaN(num)) return {checked:true, status:'wrong', score:0, max, auto:false};
    if(nearlyEqual(Math.abs(num), 0.02, 1e-8, 1e-10)){
      if(unitPresent) return {checked:true, status:'full', score:max, max, auto:false};
      return {checked:true, status:'partial', score:max/2, max, reason:'Correct uncertainty but include the unit s.', unitMsg:'Unit missing.', auto:false};
    }
    return {checked:true, status:'wrong', score:0, max, auto:false};
  }

  function checkShortMarkPoints(q, raw){
    if(q.id === 'data_handling_1') return checkUncertaintyQuestion(raw);
    const rawTrim = (raw ?? '').toString().trim();
    const t = norm(rawTrim);

    if(Array.isArray(q.expectedSymbolic) && q.expectedSymbolic.length){
      const max = qMaxMarks(q);
      if(Array.isArray(q.markPoints) && q.markPoints.length){
        const gotWord = q.markPoints.every(mp => !mp.any || textIncludesAny(t, mp.any));
        if(gotWord) return {score:max, max, status:'full', missing:[], auto:true};
      }
      const compact = rawTrim.replace(/\s+/g,'').replace(/[×*·]/g,'');
      if(q.expectedSymbolic.some(a => compact === a)){
        return {score:max, max, status:'full', missing:[], auto:true};
      }
      const lower = compact.toLowerCase();
      if(q.expectedSymbolic.some(a => lower === a.toLowerCase())){
        return {score:max/2, max, status:'partial', missing:['Case matters for symbols.'], auto:true};
      }
    }

    const points = q.markPoints || [];
    let got = 0;
    const missing = [];
    for(const mp of points){
      if(mp.any){
        const ok = textIncludesAny(t, mp.any);
        if(ok) got += 1; else missing.push(mp.any[0]);
      }
    }
    const max = qMaxMarks(q);
    const status = (got===0) ? 'wrong' : (got===max ? 'full' : 'partial');
    return {score:got, max, status, missing, auto:true};
  }

  function getMCQSelection(q){
    const sel = document.querySelector(`input[name="q_${q._instanceId}"]:checked`);
    return sel ? Number(sel.value) : null;
  }
  function checkQuestion(q){
    if(q.type === 'mcq'){
      const sel = getMCQSelection(q);
      if(sel === null) return {checked:false, msg:'Choose an option first.'};
      const correct = sel === q.answerIndex;
      const max = qMaxMarks(q);
      return {checked:true, status: correct ? 'full' : 'wrong', score: correct ? max : 0, max, auto:false};
    }
    if(q.type === 'numeric'){
      const input = document.getElementById(`in_${q._instanceId}`);
      const work = document.getElementById(`work_${q._instanceId}`);
      return checkNumeric(q, input ? input.value : '', work ? work.value : '');
    }
    if(q.type === 'short' || q.type === 'long'){
      const input = document.getElementById(`in_${q._instanceId}`);
      const raw = input ? input.value : '';
      if(!raw.trim()) return {checked:false, msg:'Type an answer first.'};
      return {checked:true, ...checkShortMarkPoints(q, raw)};
    }
    return {checked:false, msg:'Unsupported question type.'};
  }

  function correctLine(q){
    if(q.id === 'data_handling_1') return 'Correct answer: ±0.02 s';
    if(q.type === 'mcq') return `Correct answer: ${escapeHtml(String(q.choices[q.answerIndex] ?? ''))}`;
    if(q.type === 'numeric'){
      let unitShow = q.unitHint || '';
      if(unitShow === 'J/kg°C') unitShow = 'J/(kg °C)';
      if(unitShow === '°C') unitShow = '°C (K also accepted for temperature change)';
      const bridgeLine = q.bridge ? ` • Bridge: ${(q.bridge.correct && [q.bridge.correct.lhs, q.bridge.correct.relation, q.bridge.correct.rhs].filter(Boolean).join(' ')) || ''}` : '';
      if(q.allowFractionHalf) return `Correct answer: ${prettyNum(q.answer)} (or ${prettyNum(q.answer * 100)}%)${bridgeLine}`;
      return `Correct answer: ${prettyNum(q.answer)}${unitShow ? ' ' + unitShow : ''}${bridgeLine}`;
    }
    if(q.type === 'short' || q.type === 'long') return `Mark scheme: ${qMaxMarks(q)} point(s).`;
    return '';
  }
  function autoWarnHTML(){
    return `<div class="autoWarn">
      <div class="h">AUTO-MARKING WARNING (NOT AI MARKING)</div>
      <div class="b">This written answer has <b>not</b> been properly marked. The checker only looks for the <b>presence of a few keywords/phrases</b>. It can miss good answers and it can also give credit to weak answers. Use the mark scheme and judge it yourself.</div>
    </div>`;
  }
  function adjustMarksHTML(qid, maxMarks){
    return `<div class="adjustRow">
      <div class="note"><b>Optional:</b> adjust marks for this written answer (0 to ${maxMarks}). This updates the totals.</div>
      <input type="number" min="0" max="${maxMarks}" step="0.5" data-adjust="${qid}" />
      <button class="btn" data-action="applyAdjust" data-qid="${qid}" type="button">Apply</button>
    </div>`;
  }
  function showFeedback(q, outcome){
    const fb = document.getElementById(`fb_${q._instanceId}`);
    if(!fb) return;
    if(!outcome.checked){
      fb.innerHTML = `<div class="feedback bad"><div class="title">Not checked</div><p class="explain">${escapeHtml(outcome.msg)}</p></div>`;
      return;
    }
    const max = outcome.max ?? qMaxMarks(q);
    const statusCls = outcome.status === 'full' ? 'good' : (outcome.status === 'partial' ? 'partial' : 'bad');
    const title = outcome.status === 'full' ? 'Correct' : (outcome.status === 'partial' ? 'Partly correct' : 'Not quite');
    let diag = '';
    if(outcome.unitMsg) diag += outcome.unitMsg + '\n';
    if(outcome.reason) diag += outcome.reason + '\n';
    if(outcome.auto && outcome.status !== 'full' && outcome.missing && outcome.missing.length){
      diag += `Missing ideas (examples): ${outcome.missing.slice(0,3).join('; ')}\n`;
    }
    const explainText = (diag ? diag + '\n' : '') + (q.explanation || '');
    const warn = outcome.auto ? autoWarnHTML() : '';
    fb.innerHTML = `<div class="feedback ${statusCls}">
      <div class="title">${title} (${(outcome.score ?? 0).toFixed(1)} / ${max.toFixed(1)} marks)</div>
      <p class="explain">${escapeHtml(correctLine(q))}</p>
      ${warn}
      <details open>
        <summary>${outcome.status === 'full' ? 'Show explanation' : 'Explanation (mark-scheme style)'}</summary>
        <p class="model">${escapeHtml(explainText)}</p>
      </details>
      ${(q.type === 'short' || q.type === 'long') ? adjustMarksHTML(q._instanceId, max) : ``}
    </div>`;
  }

  function setPrimaryButtonMode(mode){
    const btn = document.getElementById('primaryActionBtn');
    const skipBtn = document.getElementById('skipBtn');
    if(!btn) return;
    if(mode === 'next'){
      btn.textContent = 'Next question';
      btn.dataset.mode = 'next';
      if(skipBtn) skipBtn.disabled = true;
    } else {
      btn.textContent = 'Check answer';
      btn.dataset.mode = 'check';
      if(skipBtn) skipBtn.disabled = false;
    }
  }

  function renderQuestion(){
    if(!currentQuestion){
      els.quiz.innerHTML = `<div class="emptyState">Choose your settings, then press <b>Start / restart drill</b>.</div>`;
      return;
    }
    const q = currentQuestion;
    const tags = (q.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');
    let inputHTML = '';
    if(q.type === 'mcq'){
      inputHTML = `${q.choices.map((choice, i) => `<label class="choice"><input type="radio" name="q_${q._instanceId}" value="${i}" /> <span>${escapeHtml(choice)}</span></label>`).join('')}`;
    } else if(q.type === 'short' || q.type === 'long'){
      inputHTML = `<div class="answerbox"><textarea id="in_${q._instanceId}" placeholder="${q.type === 'long' ? 'Type your answer… (aim for full sentences)' : 'Type your answer…'}"></textarea></div>`;
    } else {
      inputHTML = `${bridgeMarkup(q)}
      <div class="calcFields">
        <div class="answerbox calcField">
          <label class="fieldLabel" for="in_${q._instanceId}">Final answer</label>
          <input type="text" id="in_${q._instanceId}" placeholder="Type the final answer here (include units if you can)" />
        </div>
        <div class="answerbox calcField calcFieldWide">
          <label class="fieldLabel" for="work_${q._instanceId}">Working (optional)</label>
          <textarea id="work_${q._instanceId}" placeholder="Show substitutions, conversions and equations here. Sensible working can earn method marks."></textarea>
        </div>
      </div>`;
    }
    els.quiz.innerHTML = `<div class="qcard" id="card_${q._instanceId}">
      <div class="qhead">
        <div>
          <div class="qnum">${qMaxMarks(q)} mark${qMaxMarks(q) === 1 ? '' : 's'}</div>
          <div class="qtext">${escapeHtml(q.prompt)}</div>
        </div>
        <div class="tags">${tags}<button class="btn mini" data-action="report" data-qid="${q._instanceId}" type="button">Report</button></div>
      </div>
      ${inputHTML}
      <div class="actionRow">
        <button class="btn primary" id="primaryActionBtn" data-mode="check" data-action="primary" data-qid="${q._instanceId}" type="button">Check answer</button>
        <button class="btn" id="skipBtn" data-action="skip" data-qid="${q._instanceId}" type="button">Skip</button>
        <span class="small">Enter = check / next. Shift+Enter = new line.</span>
      </div>
      <div id="fb_${q._instanceId}"></div>
    </div>`;
    setPrimaryButtonMode('check');
    els.questionMetaPill.textContent = `${activePool.length} possible • ${TYPE_LABELS[questionKindOf(q)] || 'Question'} • difficulty ${q.difficultyRating || '?'}`;
    wireInputHandlers(q);
    applyHeaderOffset();
  }

  function focusCurrentInput(){
    if(!currentQuestion) return;
    const text = document.getElementById(`in_${currentQuestion._instanceId}`);
    if(text){ text.focus(); return; }
    const radio = document.querySelector(`input[name="q_${currentQuestion._instanceId ? `q_${currentQuestion._instanceId}` : ''}"]`);
    if(radio) radio.focus();
  }

  function nextQuestion(){
    if(!activePool.length){
      currentQuestion = null;
      els.statusPill.textContent = 'No questions';
      renderQuestion();
      renderStats();
      return;
    }
    currentQuestion = getNextQuestionFromDeck(activePool);
    markSeen(currentQuestion.id);
    els.statusPill.textContent = 'In progress';
    renderStats();
    renderQuestion();
    setTimeout(focusCurrentInput, 0);
  }

  function startOrRestart(){
    activePool = buildPool();
    if(!activePool.length){
      currentQuestion = null;
      els.statusPill.textContent = 'No questions';
      els.questionMetaPill.textContent = 'No questions in current settings';
      els.quiz.innerHTML = `<div class="emptyState">No questions are available with the current settings. Tick at least one topic, or loosen the type/difficulty filters.</div>`;
      renderStats();
      return;
    }
    nextQuestion();
  }

  function handlePrimary(){
    if(!currentQuestion) return;
    const btn = document.getElementById('primaryActionBtn');
    if(btn && btn.dataset.mode === 'next'){
      nextQuestion();
      return;
    }
    const outcome = checkQuestion(currentQuestion);
    showFeedback(currentQuestion, outcome);
    if(outcome.checked){
      saveOutcome(currentQuestion.id, outcome, false);
      renderStats();
      els.statusPill.textContent = outcome.status === 'full' ? 'Right' : (outcome.status === 'partial' ? 'Partial' : 'Checked');
      setPrimaryButtonMode('next');
      applyHeaderOffset();
    }
  }
  function handleSkip(){
    if(!currentQuestion) return;
    saveSkip(currentQuestion.id);
    renderStats();
    els.statusPill.textContent = 'Skipped';
    nextQuestion();
  }

  function wireInputHandlers(q){
    const bindEnter = (el, allowShiftNewline) => {
      if(!el) return;
      el.addEventListener('keydown', (e) => {
        if(e.key !== 'Enter') return;
        const primary = document.getElementById('primaryActionBtn');
        if(allowShiftNewline && e.shiftKey) return;
        e.preventDefault();
        if(primary && primary.dataset.mode === 'next') nextQuestion();
        else handlePrimary();
      });
    };
    const input = document.getElementById(`in_${q._instanceId}`);
    bindEnter(input, q.type === 'short' || q.type === 'long' || q.type === 'numeric');
    if(q.type === 'numeric'){
      const work = document.getElementById(`work_${q._instanceId}`);
      bindEnter(work, true);
    }
    if(q.type === 'mcq'){
      const card = document.getElementById(`card_${q._instanceId}`);
      if(card){
        card.addEventListener('keydown', (e) => {
          if(e.key !== 'Enter') return;
          e.preventDefault();
          const primary = document.getElementById('primaryActionBtn');
          if(primary && primary.dataset.mode === 'next') nextQuestion();
          else handlePrimary();
        });
      }
    }
  }

  function buildReportFormUrl(q, qid){
    if(!REPORT_FORM || !REPORT_FORM.formUrl) return null;
    try{
      const u = new URL(REPORT_FORM.formUrl, window.location.href);
      if(REPORT_FORM.entryTestName) u.searchParams.set(REPORT_FORM.entryTestName, META.title || 'Trilogy Energy Quiz');
      if(REPORT_FORM.entryBaseId) u.searchParams.set(REPORT_FORM.entryBaseId, q ? q.id : '(unknown)');
      if(REPORT_FORM.entryInstanceId) u.searchParams.set(REPORT_FORM.entryInstanceId, qid || '');
      if(REPORT_FORM.entryPrompt) u.searchParams.set(REPORT_FORM.entryPrompt, q ? q.prompt : '');
      return u.toString();
    }catch(_){ return null; }
  }

  function showReport(qid){
    const q = currentQuestion && currentQuestion._instanceId === qid ? currentQuestion : null;
    const formUrl = buildReportFormUrl(q, qid);
    if(formUrl){
      const opened = window.open(formUrl, '_blank', 'noopener');
      if(!opened) window.location.href = formUrl;
      els.statusPill.textContent = 'Report form opened';
      return;
    }
    els.statusPill.textContent = 'Report form unavailable';
  }

  document.addEventListener('click', (e) => {
    const primary = e.target.closest("button[data-action='primary']");
    if(primary){ handlePrimary(); return; }
    const skip = e.target.closest("button[data-action='skip']");
    if(skip){ handleSkip(); return; }
    const report = e.target.closest("button[data-action='report']");
    if(report){ showReport(report.getAttribute('data-qid')); return; }
    const adj = e.target.closest("button[data-action='applyAdjust']");
    if(adj){
      const qid = adj.getAttribute('data-qid');
      if(!currentQuestion || currentQuestion._instanceId !== qid) return;
      const input = document.querySelector(`input[data-adjust="${qid}"]`);
      if(!input) return;
      const val = Number(input.value);
      if(Number.isNaN(val)) return;
      const max = qMaxMarks(currentQuestion);
      const adjScore = clamp(val, 0, max);
      const status = adjScore === 0 ? 'wrong' : (adjScore === max ? 'full' : 'partial');
      const outcome = {checked:true, status, score:adjScore, max, auto:(currentQuestion.type === 'short' || currentQuestion.type === 'long')};
      saveOutcome(currentQuestion.id, outcome, true);
      const fb = document.getElementById(`fb_${qid}`);
      if(fb){
        const titleEl = fb.querySelector('.feedback .title');
        if(titleEl) titleEl.textContent = `Marks set (${adjScore.toFixed(1)} / ${max.toFixed(1)} marks)`;
      }
      renderStats();
      els.statusPill.textContent = 'Adjusted';
      setPrimaryButtonMode('next');
      return;
    }
  });

  els.startBtn.addEventListener('click', startOrRestart);
  els.resetOverallBtn.addEventListener('click', () => {
    if(window.confirm && !window.confirm('Reset saved progress on this device?')) return;
    resetProgress();
    renderStats();
    els.statusPill.textContent = 'Progress reset';
  });
  els.resetDeckBtn.addEventListener('click', () => {
    resetDeck();
    els.statusPill.textContent = 'Order reset';
  });
  els.questionType.addEventListener('change', renderStats);
  els.difficultyRating.addEventListener('change', renderStats);
  els.electricityDone.addEventListener('change', renderStats);
  document.querySelectorAll('.topicCb').forEach(cb => cb.addEventListener('change', renderStats));

  renderStats();
  renderQuestion();
})();
