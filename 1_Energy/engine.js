(function(){
  const META = window.TRILOGY_ENERGY_QUIZ_META || {title:"Quiz", subtitle:""};
  const BANK = window.TRILOGY_ENERGY_QUIZ_QUESTIONS || [];

  const els = {
    statusPill: document.getElementById("statusPill"),
    setPill: document.getElementById("setPill"),
    numQ: document.getElementById("numQ"),
    diffMix: document.getElementById("diffMix"),
    startBtn: document.getElementById("startBtn"),
    newSetBtn: document.getElementById("newSetBtn"),
    revealAllBtn: document.getElementById("revealAllBtn"),
    quiz: document.getElementById("quiz"),
    scoreLine: document.getElementById("scoreLine"),
    summaryLine: document.getElementById("summaryLine"),
    kpiChecked: document.getElementById("kpiChecked"),
    kpiFull: document.getElementById("kpiFull"),
    kpiPartial: document.getElementById("kpiPartial"),
    kpiWrong: document.getElementById("kpiWrong"),
    title: document.getElementById("title"),
    subtitle: document.getElementById("subtitle"),
        resetOverallBtn: document.getElementById("resetOverallBtn"),
    resetDeckBtn: document.getElementById("resetDeckBtn"),
    statSet: document.getElementById("statSet"),
    statOverall: document.getElementById("statOverall"),
  };
  els.title.textContent = META.title || "Quiz";
  els.subtitle.textContent = META.subtitle || "";

  function applyHeaderOffset(){
    const h = document.querySelector("header.topbar");
    if(!h) return;
    const px = h.offsetHeight || 0;
    document.documentElement.style.setProperty("--headerOffset", px + "px");
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
  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }
function prettyNum(a){
  const abs = Math.abs(a);
  let s = (abs >= 1000 || (abs > 0 && abs < 0.01)) ? a.toExponential(3) : a.toPrecision(4);
  // trim trailing zeros
  s = s.replace(/(\.\d*?[1-9])0+$/, '$1');
  s = s.replace(/\.0+(e|$)/, '$1');
  s = s.replace(/(\d)0+e/, '$1e');
  return s;
}
  function rchoice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  function svgAxesIV(){
    // 4-quadrant axes centered in the viewBox
    return `
      <line x1="120" y1="14" x2="120" y2="156" stroke="rgba(255,255,255,.35)"/>
      <line x1="18" y1="85" x2="222" y2="85" stroke="rgba(255,255,255,.35)"/>
      <text x="10" y="28" fill="rgba(255,255,255,.65)" font-size="11">I</text>
      <text x="210" y="166" fill="rgba(255,255,255,.65)" font-size="11">V</text>
    `;
  }
  function gOhmic4(){
    return `<line x1="25" y1="150" x2="215" y2="20" stroke="rgba(255,255,255,.85)" stroke-width="3"/>`;
  }
  function gFilament4(){
    // Filament lamp: I increases with V but NOT proportionally; slope decreases as |V| increases (curve flattens).
    // Smooth concave-down curve (no S-shape / no knee), mirrored for negative V.
    return `
      <path d="M120 85 Q 125 55 215 45"
            fill="none" stroke="rgba(255,255,255,.85)" stroke-width="3"/>
      <path d="M120 85 Q 115 115 25 125"
            fill="none" stroke="rgba(255,255,255,.85)" stroke-width="3"/>
    `;
  }
  function gDiode4(){
    // Diode/LED: ~zero current for reverse and small forward V, then steep rise after a threshold.
    // (Used mainly as a distractor in this quiz.)
    return `
      <path d="M25 85 L 120 85" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="3"/>
      <path d="M120 85 L 158 85" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="3"/>
      <path d="M158 85 C 172 82, 188 66, 202 44 C 210 30, 214 24, 215 22"
            fill="none" stroke="rgba(255,255,255,.85)" stroke-width="3"/>
    `;
  }
  function gFlat4(){
    return `<line x1="25" y1="85" x2="215" y2="85" stroke="rgba(255,255,255,.85)" stroke-width="3"/>`;
  }
  function gCurveUp4(){
    // steeper as |V| increases, mirrored (distractor)
    return `
      <path d="M120 85 C 150 84, 180 70, 215 22" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="3"/>
      <path d="M120 85 C 90 86, 60 100, 25 148" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="3"/>
    `;
  }

  function graphSVG(kind){
    let path = gOhmic4();
    if(kind==="filament") path = gFilament4();
    if(kind==="diode") path = gDiode4();
    if(kind==="flat") path = gFlat4();
    if(kind==="curveUp") path = gCurveUp4();
    return `
      <div class="choiceViz">
        <svg viewBox="0 0 240 170" width="220" height="150">
          ${svgAxesIV()}
          ${path}
        </svg>
      </div>`;
  }

function symbolSVG(kind){
    const stroke = 'stroke="rgba(255,255,255,.92)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"';
    const solid = 'fill="rgba(255,255,255,.92)"';

    if(kind==="cell"){
      return `<svg viewBox="0 0 240 70" width="220" height="56">
        <line x1="20" y1="35" x2="92" y2="35" ${stroke}/>
        <line x1="92" y1="18" x2="92" y2="52" ${stroke}/>
        <line x1="112" y1="25" x2="112" y2="45" ${stroke}/>
        <line x1="112" y1="35" x2="220" y2="35" ${stroke}/>
      </svg>`;
    }

    if(kind==="battery"){
      // Add explicit joining wire between cells (between the middle plates)
      return `<svg viewBox="0 0 240 70" width="220" height="56">
        <line x1="20" y1="35" x2="70" y2="35" ${stroke}/>
        <line x1="70" y1="18" x2="70" y2="52" ${stroke}/>
        <line x1="90" y1="25" x2="90" y2="45" ${stroke}/>
        <line x1="90" y1="35" x2="110" y2="35" ${stroke}/>
        <line x1="110" y1="18" x2="110" y2="52" ${stroke}/>
        <line x1="130" y1="25" x2="130" y2="45" ${stroke}/>
        <line x1="130" y1="35" x2="220" y2="35" ${stroke}/>
      </svg>`;
    }

    if(kind==="lamp"){
      // Extend wires slightly into the circle so it visually touches.
      return `<svg viewBox="0 0 240 70" width="220" height="56">
        <line x1="20" y1="35" x2="102" y2="35" ${stroke}/>
        <circle cx="120" cy="35" r="22" ${stroke}/>
        <path d="M108 27 L 132 43 M132 27 L108 43" ${stroke}/>
        <line x1="138" y1="35" x2="220" y2="35" ${stroke}/>
      </svg>`;
    }

    if(kind==="resistor"){
      return `<svg viewBox="0 0 240 70" width="220" height="56">
        <line x1="20" y1="35" x2="70" y2="35" ${stroke}/>
        <rect x="70" y="22" width="100" height="26" ${stroke}/>
        <line x1="170" y1="35" x2="220" y2="35" ${stroke}/>
      </svg>`;
    }

    if(kind==="varres"){
      // Full diagonal arrow across the resistor
      return `<svg viewBox="0 0 240 70" width="220" height="56">
        <line x1="20" y1="35" x2="70" y2="35" ${stroke}/>
        <rect x="70" y="22" width="100" height="26" ${stroke}/>
        <line x1="170" y1="35" x2="220" y2="35" ${stroke}/>
        <line x1="64" y1="60" x2="176" y2="10" ${stroke}/>
        <polyline points="170,12 176,10 173,16" ${stroke}/>
      </svg>`;
    }

    if(kind==="led"){
      // Diode + two arrows pointing OUTWARDS (light emission).
      return `<svg viewBox="0 0 240 70" width="220" height="56">
        <line x1="20" y1="35" x2="95" y2="35" ${stroke}/>
        <polygon points="95,20 95,50 130,35" ${stroke}/>
        <line x1="138" y1="20" x2="138" y2="50" ${stroke}/>
        <line x1="138" y1="35" x2="220" y2="35" ${stroke}/>
        <line x1="150" y1="18" x2="170" y2="6" ${stroke}/>
        <polyline points="164,6 170,6 168,11" ${stroke}/>
        <line x1="155" y1="32" x2="175" y2="20" ${stroke}/>
        <polyline points="169,20 175,20 173,25" ${stroke}/>
      </svg>`;
    }

    if(kind==="switch"){
      return `<svg viewBox="0 0 240 70" width="220" height="56">
        <line x1="20" y1="35" x2="90" y2="35" ${stroke}/>
        <circle cx="90" cy="35" r="4" ${solid}/>
        <circle cx="150" cy="35" r="4" ${solid}/>
        <line x1="90" y1="35" x2="142" y2="15" ${stroke}/>
        <line x1="150" y1="35" x2="220" y2="35" ${stroke}/>
      </svg>`;
    }

    // Custom SVGs for magnetism diagrams (used in MCQ choices via {svgKind: "..."}).
  function customSVG(kind){
    const stroke = 'stroke="rgba(255,255,255,.88)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"';
    const faint  = 'stroke="rgba(255,255,255,.35)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"';
    const txt    = 'fill="rgba(255,255,255,.85)" font-size="12" font-weight="700"';
    const tmuted = 'fill="rgba(255,255,255,.65)" font-size="11"';
    const box    = 'fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.20)" stroke-width="2"';

    if(kind==="barField_good"){
      return `<svg viewBox="0 0 260 160" width="240" height="150">
        <rect x="85" y="62" width="90" height="36" rx="6" ${box}/>
        <text x="102" y="86" ${txt}>N</text>
        <text x="160" y="86" ${txt}>S</text>

        <!-- outer loops -->
        <path d="M85 65 C 35 45, 35 20, 130 18 C 225 20, 225 45, 175 65" ${stroke}/>
        <path d="M85 95 C 35 115, 35 140, 130 142 C 225 140, 225 115, 175 95" ${stroke}/>
        <!-- inner loops -->
        <path d="M95 65 C 70 55, 70 38, 130 36 C 190 38, 190 55, 165 65" ${faint}/>
        <path d="M95 95 C 70 105, 70 122, 130 124 C 190 122, 190 105, 165 95" ${faint}/>

        <!-- arrows N->S on the top and bottom loops -->
        <polyline points="132,18 138,18 135,24" ${stroke}/>
        <polyline points="132,142 138,142 135,136" ${stroke}/>
      </svg>`;
    }

    if(kind==="barField_wrong_arrows"){
      return `<svg viewBox="0 0 260 160" width="240" height="150">
        <rect x="85" y="62" width="90" height="36" rx="6" ${box}/>
        <text x="102" y="86" ${txt}>N</text>
        <text x="160" y="86" ${txt}>S</text>
        <path d="M85 65 C 35 45, 35 20, 130 18 C 225 20, 225 45, 175 65" ${stroke}/>
        <path d="M85 95 C 35 115, 35 140, 130 142 C 225 140, 225 115, 175 95" ${stroke}/>
        <!-- arrows wrongly S->N -->
        <polyline points="128,18 122,18 125,24" ${stroke}/>
        <polyline points="128,142 122,142 125,136" ${stroke}/>
      </svg>`;
    }

    if(kind==="barField_wrong_cross"){
      return `<svg viewBox="0 0 260 160" width="240" height="150">
        <rect x="85" y="62" width="90" height="36" rx="6" ${box}/>
        <text x="102" y="86" ${txt}>N</text>
        <text x="160" y="86" ${txt}>S</text>
        <path d="M85 65 C 35 45, 35 20, 130 18 C 225 20, 225 45, 175 65" ${stroke}/>
        <path d="M85 95 C 35 115, 35 140, 130 142 C 225 140, 225 115, 175 95" ${stroke}/>
        <!-- add a crossing line (invalid) -->
        <path d="M70 30 L 190 130" ${stroke}/>
      </svg>`;
    }

    if(kind==="barField_wrong_gaps"){
      return `<svg viewBox="0 0 260 160" width="240" height="150">
        <rect x="85" y="62" width="90" height="36" rx="6" ${box}/>
        <text x="102" y="86" ${txt}>N</text>
        <text x="160" y="86" ${txt}>S</text>
        <!-- loops that do not reach the magnet (gaps) -->
        <path d="M78 60 C 35 45, 35 20, 130 18 C 225 20, 225 45, 182 60" ${stroke}/>
        <path d="M78 100 C 35 115, 35 140, 130 142 C 225 140, 225 115, 182 100" ${stroke}/>
        <text x="18" y="152" ${tmuted}>Lines don't touch magnet</text>
      </svg>`;
    }

    if(kind==="uniformField_good"){
      return `<svg viewBox="0 0 260 160" width="240" height="150">
        <rect x="20" y="50" width="70" height="60" rx="6" ${box}/>
        <rect x="170" y="50" width="70" height="60" rx="6" ${box}/>
        <text x="45" y="85" ${txt}>N</text>
        <text x="195" y="85" ${txt}>S</text>
        <!-- straight parallel evenly spaced field lines -->
        <line x1="90" y1="62" x2="170" y2="62" ${stroke}/>
        <line x1="90" y1="80" x2="170" y2="80" ${stroke}/>
        <line x1="90" y1="98" x2="170" y2="98" ${stroke}/>
        <!-- arrows N->S -->
        <polyline points="148,62 154,62 151,68" ${stroke}/>
        <polyline points="148,80 154,80 151,86" ${stroke}/>
        <polyline points="148,98 154,98 151,104" ${stroke}/>
      </svg>`;
    }

    if(kind==="uniformField_wrong_curved"){
      return `<svg viewBox="0 0 260 160" width="240" height="150">
        <rect x="20" y="50" width="70" height="60" rx="6" ${box}/>
        <rect x="170" y="50" width="70" height="60" rx="6" ${box}/>
        <text x="45" y="85" ${txt}>N</text>
        <text x="195" y="85" ${txt}>S</text>
        <path d="M90 62 C 120 40, 140 40, 170 62" ${stroke}/>
        <path d="M90 80 C 120 80, 140 80, 170 80" ${stroke}/>
        <path d="M90 98 C 120 120, 140 120, 170 98" ${stroke}/>
      </svg>`;
    }

    if(kind==="uniformField_wrong_notParallel"){
      return `<svg viewBox="0 0 260 160" width="240" height="150">
        <rect x="20" y="50" width="70" height="60" rx="6" ${box}/>
        <rect x="170" y="50" width="70" height="60" rx="6" ${box}/>
        <text x="45" y="85" ${txt}>N</text>
        <text x="195" y="85" ${txt}>S</text>
        <line x1="90" y1="62" x2="170" y2="62" ${stroke}/>
        <line x1="90" y1="80" x2="165" y2="70" ${stroke}/>
        <line x1="90" y1="98" x2="170" y2="108" ${stroke}/>
      </svg>`;
    }

    if(kind==="uniformField_wrong_arrows"){
      return `<svg viewBox="0 0 260 160" width="240" height="150">
        <rect x="20" y="50" width="70" height="60" rx="6" ${box}/>
        <rect x="170" y="50" width="70" height="60" rx="6" ${box}/>
        <text x="45" y="85" ${txt}>N</text>
        <text x="195" y="85" ${txt}>S</text>
        <line x1="90" y1="62" x2="170" y2="62" ${stroke}/>
        <line x1="90" y1="80" x2="170" y2="80" ${stroke}/>
        <line x1="90" y1="98" x2="170" y2="98" ${stroke}/>
        <!-- arrows wrongly S->N -->
        <polyline points="112,62 106,62 109,68" ${stroke}/>
        <polyline points="112,80 106,80 109,86" ${stroke}/>
        <polyline points="112,98 106,98 109,104" ${stroke}/>
      </svg>`;
    }

    if(kind==="wire_circles"){
      return `<svg viewBox="0 0 260 160" width="240" height="150">
        <circle cx="130" cy="80" r="10" fill="rgba(255,255,255,.88)"/>
        <circle cx="130" cy="80" r="28" ${faint}/>
        <circle cx="130" cy="80" r="48" ${faint}/>
        <circle cx="130" cy="80" r="68" ${faint}/>
        <text x="16" y="24" ${tmuted}>Field around straight wire</text>
      </svg>`;
    }

    if(kind==="wire_dot"){
      return `<svg viewBox="0 0 260 160" width="240" height="150">
        <circle cx="130" cy="80" r="30" ${faint}/>
        <circle cx="130" cy="80" r="52" ${faint}/>
        <circle cx="130" cy="80" r="74" ${faint}/>
        <circle cx="130" cy="80" r="12" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
        <circle cx="130" cy="80" r="4" fill="rgba(255,255,255,.88)"/>
        <text x="96" y="140" ${tmuted}>• current out of page</text>
      </svg>`;
    }

    if(kind==="wire_cross"){
      return `<svg viewBox="0 0 260 160" width="240" height="150">
        <circle cx="130" cy="80" r="30" ${faint}/>
        <circle cx="130" cy="80" r="52" ${faint}/>
        <circle cx="130" cy="80" r="74" ${faint}/>
        <circle cx="130" cy="80" r="12" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
        <line x1="124" y1="74" x2="136" y2="86" ${stroke}/>
        <line x1="136" y1="74" x2="124" y2="86" ${stroke}/>
        <text x="92" y="140" ${tmuted}>× current into page</text>
      </svg>`;
if(kind==="twoMagnets_attract"){
      return `<svg viewBox="0 0 260 160" width="240" height="150">
        <rect x="20" y="55" width="80" height="50" rx="6" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.20)" stroke-width="2"/>
        <rect x="160" y="55" width="80" height="50" rx="6" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.20)" stroke-width="2"/>
        <text x="46" y="85" fill="rgba(255,255,255,.85)" font-size="12" font-weight="700">N</text>
        <text x="84" y="85" fill="rgba(255,255,255,.85)" font-size="12" font-weight="700">S</text>
        <text x="186" y="85" fill="rgba(255,255,255,.85)" font-size="12" font-weight="700">N</text>
        <text x="224" y="85" fill="rgba(255,255,255,.85)" font-size="12" font-weight="700">S</text>

        <!-- Field lines connect across the gap (attraction) -->
        <path d="M100 65 C 120 55, 140 55, 160 65" stroke="rgba(255,255,255,.88)" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M100 80 C 120 80, 140 80, 160 80" stroke="rgba(255,255,255,.88)" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M100 95 C 120 105, 140 105, 160 95" stroke="rgba(255,255,255,.88)" stroke-width="3" fill="none" stroke-linecap="round"/>
        <polyline points="140,80 146,80 143,86" stroke="rgba(255,255,255,.88)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    }

    if(kind==="twoMagnets_repel"){
      return `<svg viewBox="0 0 260 160" width="240" height="150">
        <rect x="20" y="55" width="80" height="50" rx="6" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.20)" stroke-width="2"/>
        <rect x="160" y="55" width="80" height="50" rx="6" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.20)" stroke-width="2"/>
        <text x="46" y="85" fill="rgba(255,255,255,.85)" font-size="12" font-weight="700">N</text>
        <text x="84" y="85" fill="rgba(255,255,255,.85)" font-size="12" font-weight="700">S</text>
        <text x="186" y="85" fill="rgba(255,255,255,.85)" font-size="12" font-weight="700">S</text>
        <text x="224" y="85" fill="rgba(255,255,255,.85)" font-size="12" font-weight="700">N</text>

        <!-- Like poles facing: lines bow outward (repulsion) -->
        <path d="M100 65 C 125 30, 135 30, 160 65" stroke="rgba(255,255,255,.88)" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M100 95 C 125 130, 135 130, 160 95" stroke="rgba(255,255,255,.88)" stroke-width="3" fill="none" stroke-linecap="round"/>
        <text x="92" y="150" fill="rgba(255,255,255,.65)" font-size="11">Weak field region in gap</text>
      </svg>`;
    }

    }

    return `<svg viewBox="0 0 260 160" width="240" height="150"><text x="20" y="80" ${txt}>[unknown svgKind]</text></svg>`;
  }

return "";
  }

  function numParts(raw){
    if(raw === null || raw === undefined) return {ok:false};
    let s = raw.toString().trim();
    if(!s) return {ok:false};
    s = s.replace(/×/g,'x');
    let compact = s.replace(/\s+/g,'');
    compact = compact.replace(/x10\^?\(?(-?\d+)\)?/i, 'e$1');
    compact = compact.replace(/10\^\(?(-?\d+)\)?/i, 'e$1');
    const m = compact.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/i);
    if(!m) return {ok:false};
    const num = Number(m[0]);
    if(Number.isNaN(num)) return {ok:false};
    return {ok:true, num, numStr:m[0]};
  }
  function tidyUnitToken(u){
    if(!u) return null;
    let t = u.trim();
    if(!t) return null;
    t = t.replace(/Ω/g,'ohm');
    t = t.replace(/²/g,'^2').replace(/³/g,'^3');
    t = t.replace(/°C/g,"degC");
    t = t.replace(/\s+/g,'');
    return t;
  }
  function unitInfo(raw){
    if(!raw) return null;
    const eq = (want) => raw === want;
    const ieq = (want) => raw.toLowerCase() === want.toLowerCase();

    // Mass
    if(ieq("kg")) return {type:"mass", canonical:"kg", scale:1, caseOk:eq("kg")};
    if(ieq("g")) return {type:"mass", canonical:"g", scale:1e-3, caseOk:eq("g")};

    // Length / time
    if(ieq("m")) return {type:"length", canonical:"m", scale:1, caseOk:eq("m")};
    if(ieq("cm")) return {type:"length", canonical:"cm", scale:1e-2, caseOk:eq("cm")};
    if(ieq("mm")) return {type:"length", canonical:"mm", scale:1e-3, caseOk:eq("mm")};
    if(ieq("s")) return {type:"time", canonical:"s", scale:1, caseOk:eq("s")};
    if(ieq("min") || ieq("mins") || ieq("minute") || ieq("minutes")) return {type:"time", canonical:"min", scale:60, caseOk:true};
    if(ieq("h") || ieq("hr") || ieq("hour") || ieq("hours")) return {type:"time", canonical:"h", scale:3600, caseOk:true};

    // Speed / acceleration
    if(ieq("m/s") || ieq("ms^-1") || ieq("mps")) return {type:"speed", canonical:"m/s", scale:1, caseOk:eq("m/s")};
    if(ieq("m/s^2") || ieq("ms^-2")) return {type:"acc", canonical:"m/s^2", scale:1, caseOk:eq("m/s^2")};

    // Force / g / spring constant
    if(ieq("N") || ieq("newton") || ieq("newtons")) return {type:"force", canonical:"N", scale:1, caseOk:eq("N")};
    if(ieq("N/kg") || ieq("Nkg^-1")) return {type:"gfield", canonical:"N/kg", scale:1, caseOk:eq("N/kg")};
    if(ieq("N/m") || ieq("Nm^-1")) return {type:"spring", canonical:"N/m", scale:1, caseOk:eq("N/m")};

    // Energy
    if(ieq("J")) return {type:"energy", canonical:"J", scale:1, caseOk:eq("J")};
    if(ieq("kJ")) return {type:"energy", canonical:"kJ", scale:1e3, caseOk:eq("kJ")};
    if(ieq("MJ")) return {type:"energy", canonical:"MJ", scale:1e6, caseOk:eq("MJ")};
    if(ieq("Wh")) return {type:"energy", canonical:"Wh", scale:3600, caseOk:eq("Wh")};
    if(ieq("kWh")) return {type:"energy", canonical:"kWh", scale:3.6e6, caseOk:eq("kWh")};

    // Power
    if(ieq("W")) return {type:"power", canonical:"W", scale:1, caseOk:eq("W")};
    if(ieq("kW")) return {type:"power", canonical:"kW", scale:1e3, caseOk:eq("kW")};
    if(ieq("MW")) return {type:"power", canonical:"MW", scale:1e6, caseOk:eq("MW")};

    // Electrical
    if(ieq("V")) return {type:"voltage", canonical:"V", scale:1, caseOk:eq("V")};
    if(ieq("A")) return {type:"current", canonical:"A", scale:1, caseOk:eq("A")};
    if(ieq("mA")) return {type:"current", canonical:"mA", scale:1e-3, caseOk:eq("mA")};
    if(ieq("ohm") || ieq("ohms")) return {type:"resistance", canonical:"Ω", scale:1, caseOk:true};
    if(raw.includes("Ω")) return {type:"resistance", canonical:"Ω", scale:1, caseOk:true};

    // Temperature
    if(raw === "°C" || raw === "degC" || raw === "degC") return {type:"tempC", canonical:"°C", scale:1, caseOk:(raw === "°C" || raw === "degC")};
    if(raw === "K") return {type:"tempK", canonical:"K", scale:1, caseOk:eq("K")};

    // Specific heat capacity
    const shcTokens = ["J/kg°C","J/kgdegC","J/kg°C".replace("°","deg")];
    if(shcTokens.some(t => raw === t)) return {type:"shc", canonical:"J/kg °C", scale:1, caseOk:true};
    if(ieq("J/kg°C") || ieq("J/kgdegC") || ieq("J/kg°c")) return {type:"shc", canonical:"J/kg °C", scale:1, caseOk:(raw === "J/kg°C" || raw === "J/kgdegC")};

    return null;
  }

  function parseQuantity(raw){
    const parts = numParts(raw);
    if(!parts.ok) return {ok:false};
    const rawStr = raw.toString().trim();
    const m = rawStr.match(/[-+]?\d*\.?\d+(?:\s*(?:e|E|x\s*10\^?)\s*[-+]?\d+)?/);
    let suffix = "";
    if(m){ suffix = rawStr.slice(rawStr.indexOf(m[0]) + m[0].length).trim(); }
    const token = tidyUnitToken(suffix);
    const unitPresent = !!token;
    const info = unitPresent ? unitInfo(token) : null;
    return {ok:true, num:parts.num, numStr:(m ? m[0].replace(/\s+/g,'') : parts.numStr), unitPresent, unitToken:token, unitInfo:info};
  }
  function countDecimalPlaces(numStr){
    const s = numStr.toLowerCase();
    const base = s.split('e')[0];
    const dot = base.indexOf('.');
    return (dot === -1) ? 0 : (base.length - dot - 1);
  }
  function countSigFigs(numStr){
    let s = numStr.toLowerCase();
    s = s.replace(/^[-+]/,'');
    s = s.split('e')[0];
    if(s.includes('.')){
      s = s.replace(/^0+/, '').replace('.','').replace(/^0+/, '');
      return Math.max(1, s.length);
    } else {
      s = s.replace(/^0+/, '').replace(/0+$/,'');
      return Math.max(1, s.length || 1);
    }
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
    if(nearlyEqual(studentVal, trueVal)) return {ok:true, basis:"exact"};
    const dp = countDecimalPlaces(numStr);
    const sf = countSigFigs(numStr);
    const tDp = roundToDp(trueVal, dp);
    if(nearlyEqual(studentVal, tDp, 1e-10, 1e-12)) return {ok:true, basis:`${dp} d.p.`};
    const tSf = roundToSf(trueVal, sf);
    if(nearlyEqual(studentVal, tSf, 1e-10, 1e-12)) return {ok:true, basis:`${sf} s.f.`};
    return {ok:false};
  }
  function closeButBadRounding(studentVal, trueVal, numStr, relTolClose){
    const diff = Math.abs(studentVal-trueVal);
    const scale = Math.max(Math.abs(trueVal), 1e-12);
    const rel = diff/scale;
    const close = rel <= (relTolClose ?? 0.03);
    if(!close) return null;
    const dp = countDecimalPlaces(numStr);
    const sf = countSigFigs(numStr);
    const base = numStr.toLowerCase().split('e')[0];
    const hasDot = base.includes('.');
    const target = hasDot ? roundToDp(trueVal, dp) : roundToSf(trueVal, sf);
    let hint = "";
    if(target > studentVal) hint = "You needed to round up.";
    if(target < studentVal) hint = "You needed to round down.";
    return {basis: hasDot ? `${dp} d.p.` : `${sf} s.f.`, target, hint, dp: hasDot ? dp : null, sf: hasDot ? null : sf};
  }
  function fmtRounded(value, opts){
    if(opts && Number.isInteger(opts.dp)) return Number(value).toFixed(opts.dp);
    if(opts && Number.isInteger(opts.sf)) return Number(value).toPrecision(opts.sf);
    const a = Number(value);
    return (Math.abs(a) >= 1000 || Math.abs(a) < 0.01) ? a.toExponential(3) : a.toPrecision(4);
  }

  function qMaxMarks(q){
    if(Number.isFinite(q.marks)) return q.marks;
    if(Array.isArray(q.markPoints)) return q.markPoints.length;
    return 1;
  }
  function textIncludesAny(t, arr){ return arr.some(x => t.includes(norm(x))); }

  function genPIV_Current(){
    const PkW = rchoice([0.6, 0.9, 1.2, 1.4, 1.8, 2.2, 2.8, 3.0]);
    const V = 230;
    const P = PkW*1000;
    const I = P / V;
    return {
      prompt: `A device is rated ${PkW} kW on ${V} V mains. Calculate the current.`,
      answer: I,
      unitHint: "A",
      explanation:
`Mark scheme:
Use P = IV, so I = P / V.
Convert kW to W: P = ${PkW} kW = ${P} W.
I = ${P} / ${V} = ${I.toPrecision(4)} A.`
    };
  }
  function genPIV_Power(){
    const V = rchoice([6, 9, 12, 24]);
    const I = rchoice([0.25, 0.4, 0.6, 0.8, 1.2, 1.5]);
    const P = V * I;
    return {prompt:`A motor takes ${I} A from a ${V} V supply. Calculate the power.`, answer:P, unitHint:"W",
            explanation:`Mark scheme:\nP = IV = ${I} × ${V} = ${P.toPrecision(4)} W.`};
  }
  function genOhms_Current(){
    const V = rchoice([3, 4.5, 6, 9, 12]);
    const R = rchoice([3.3, 4.7, 6.8, 10, 15, 22, 33]);
    const I = V / R;
    return {prompt:`A ${R} Ω resistor is connected to a ${V} V supply. Calculate the current.`, answer:I, unitHint:"A",
            explanation:`Mark scheme:\nUse V = IR so I = V / R.\nI = ${V} / ${R} = ${I.toPrecision(4)} A.`};
  }
  function genOhms_Voltage(){
    const I = rchoice([0.12, 0.18, 0.25, 0.30, 0.40, 0.55]);
    const R = rchoice([5.6, 8.2, 10, 12, 15, 22, 47]);
    const V = I * R;
    return {prompt:`The current through a resistor is ${I} A and its resistance is ${R} Ω. Calculate the voltage across it.`, answer:V, unitHint:"V",
            explanation:`Mark scheme:\nUse V = IR.\nV = ${I} × ${R} = ${V.toPrecision(4)} V.`};
  }
  function genSeriesTwoResistors(){
    const R1 = rchoice([4.7, 6.8, 10, 12, 15, 22, 33, 47]);
    const R2 = rchoice([5.6, 8.2, 10, 18, 27, 39, 56]);
    const Vs = rchoice([6, 9, 12]);
    const Rt = R1+R2;
    const I = Vs/Rt;
    const V1 = I*R1;
    const V2 = I*R2;
    const pick = rchoice(["current","V1","V2","Rt"]);
    if(pick==="current"){
      return {prompt:`Two resistors ${R1} Ω and ${R2} Ω are connected in series to a ${Vs} V supply. Calculate the current in the circuit.`, answer:I, unitHint:"A",
              explanation:`Mark scheme:\nR_total = ${R1} + ${R2} = ${Rt} Ω.\nI = V / R_total = ${Vs} / ${Rt} = ${I.toPrecision(4)} A.`};
    }
    if(pick==="V1"){
      return {prompt:`Two resistors ${R1} Ω and ${R2} Ω are in series on a ${Vs} V supply. Calculate the voltage across the ${R1} Ω resistor.`, answer:V1, unitHint:"V",
              explanation:`Mark scheme:\nR_total = ${Rt} Ω, so I = ${Vs}/${Rt} = ${I.toPrecision(4)} A.\nV1 = IR1 = ${I.toPrecision(4)} × ${R1} = ${V1.toPrecision(4)} V.`};
    }
    if(pick==="V2"){
      return {prompt:`Two resistors ${R1} Ω and ${R2} Ω are in series on a ${Vs} V supply. Calculate the voltage across the ${R2} Ω resistor.`, answer:V2, unitHint:"V",
              explanation:`Mark scheme:\nI = ${Vs}/${Rt} = ${I.toPrecision(4)} A.\nV2 = IR2 = ${I.toPrecision(4)} × ${R2} = ${V2.toPrecision(4)} V.`};
    }
    return {prompt:`Two resistors ${R1} Ω and ${R2} Ω are connected in series. Calculate the total resistance.`, answer:Rt, unitHint:"Ω",
            explanation:`Mark scheme:\nIn series, resistances add: R_total = ${R1} + ${R2} = ${Rt} Ω.`};
  }
  const GENERATORS = {genPIV_Current, genPIV_Power, genOhms_Current, genOhms_Voltage, genSeriesTwoResistors};

  function expandQuestion(q){
    if(q.generator && q.generator.name && GENERATORS[q.generator.name]){
      const inst = GENERATORS[q.generator.name]();
      return {...q, ...inst};
    }
    return {...q};
  }

  function expectedUnitInfo(unitHint){
    if(!unitHint) return null;
    if(unitHint==="Ω") return {type:"resistance", canonical:"Ω", scale:1, caseOk:true, token:"Ω"};
    const info = unitInfo(unitHint);
    if(!info) return null;
    return {...info, token: unitHint};
  }

  function checkNumeric(q, raw){
    const parsed = parseQuantity(raw);
    if(!parsed.ok) return {checked:false, msg:"Enter a number (you can add units)."};
    const exp = expectedUnitInfo(q.unitHint || "");
    const unitNeeded = !!exp;
    const max = qMaxMarks(q);

    let usedScale = 1;
    let unitOkForFull = true;
    let unitMsg = "";

    if(unitNeeded){
      if(!parsed.unitPresent){
        unitOkForFull = false;
        unitMsg = "Unit missing.";
        usedScale = exp.scale;
      } else {
        const info = parsed.unitInfo;
        if(!info){
          unitOkForFull = false;
          unitMsg = "Unit not recognised.";
        } else if(info.type !== exp.type){
          unitOkForFull = false;
          unitMsg = "Unit looks wrong for this quantity.";
          usedScale = info.scale;
        } else {
          usedScale = info.scale;
          if(info.caseOk === false){
            unitOkForFull = false;
            unitMsg = `Unit case matters: use ${info.canonical} exactly.`;
          } else {
            unitOkForFull = true;
          }
        }
      }
    }

    const trueInStudentUnits = unitNeeded ? (q.answer / usedScale) : q.answer;
    const rm = roundingMatch(parsed.num, trueInStudentUnits, parsed.numStr);
    const okNumeric = rm.ok;

    let status="wrong", score=0, reason="";
    if(okNumeric && (!unitNeeded || unitOkForFull)){
      status="full"; score=max;
    } else if(okNumeric && unitNeeded){
      status="partial"; score=max/2;
      reason = unitMsg || "Number correct but unit not accepted.";
    } else {
      // partial for "close but wrong rounding" isn't included in this simplified rebuild
      status="wrong"; score=0;
    }
    return {checked:true, status, score, max, reason, unitMsg, auto:false};
  }

  function checkShortMarkPoints(q, raw){
    const rawTrim = (raw ?? "").toString().trim();
    const t = norm(rawTrim);

    // Special handling for "state the formula" style questions:
    // Full marks if symbols are correct *and* case is correct (e.g. V=IR).
    // Half marks if symbols are correct but case is wrong (e.g. v=ir).
    // Worded statements can still earn full marks.
    if(Array.isArray(q.expectedSymbolic) && q.expectedSymbolic.length){
      const max = qMaxMarks(q);

      // Full credit for a fully-correct worded statement (keyword-based).
      if(Array.isArray(q.markPoints) && q.markPoints.length){
        const gotWord = q.markPoints.every(mp => !mp.any || textIncludesAny(t, mp.any));
        if(gotWord) return {score:max, max, status:"full", missing:[], auto:true};
      }

      // Normalise symbolic: remove spaces and multiplication dots/crosses.
      const compact = rawTrim.replace(/\s+/g,'').replace(/[×*·]/g,'');

      // Full (case-sensitive) match
      if(q.expectedSymbolic.some(a => compact === a)){
        return {score:max, max, status:"full", missing:[], auto:true};
      }

      // Partial (case-insensitive) match
      const lower = compact.toLowerCase();
      if(q.expectedSymbolic.some(a => lower === a.toLowerCase())){
        return {score:max/2, max, status:"partial", missing:["Case matters for symbols (e.g. V, I, R)."], auto:true};
      }
      // Fall through to generic marking
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
    const status = (got===0) ? "wrong" : (got===max ? "full" : "partial");
    return {score:got, max, status, missing, auto:true};
  }

  function getSelectedTopics(){
    return Array.from(document.querySelectorAll(".topicCb")).filter(cb=>cb.checked).map(cb=>cb.value);
  }
  function applyDifficultyFilter(list, mix){
    if(mix === "all") return list;
    if(mix === "easy") return list.filter(q => q.difficulty==="easy" || q.difficulty==="med");
    if(mix === "med") return list.filter(q => q.difficulty!=="easy");
    if(mix === "hard") return list.filter(q => q.difficulty==="hard");
    return list;
  }

  // ---------------- Overall stats across sets (this device only) ----------------
  const OVERALL_KEY = "preibphysics_trilogy_mag_em_overall_v1";
  function loadOverall(){
    try{
      const raw = localStorage.getItem(OVERALL_KEY);
      if(!raw) return {items:{}, seen:{}};
      const obj = JSON.parse(raw);
      if(!obj || typeof obj !== "object") return {items:{}};
      if(!obj.items || typeof obj.items !== "object") obj.items = {};
      if(!obj.seen || typeof obj.seen !== "object") obj.seen = {};
      return obj;
    }catch(e){
      return {items:{}, seen:{}};
    }
  }
  function saveOverall(obj){
    try{ localStorage.setItem(OVERALL_KEY, JSON.stringify(obj)); }catch(e){}
  }
  function computeOverallSeen(){
    const o = loadOverall();
    const seen = o.seen || {};
    return {seenCount: Object.keys(seen).length};
  }
  function computeOverallTotals(){
    const o = loadOverall();
    let totalScore = 0;
    let totalMax = 0;
    for(const k of Object.keys(o.items)){
      const it = o.items[k];
      if(it && typeof it === "object" && Number.isFinite(it.score) && Number.isFinite(it.max)){
        totalScore += it.score;
        totalMax += it.max;
      }
    }
    return {totalScore, totalMax, count:Object.keys(o.items).length};
  }
  function updateOverallForInstance(qid, baseId, score, max){
    const o = loadOverall();
    if(!o.items) o.items = {};
    o.items[qid] = {score:Number(score)||0, max:Number(max)||0, t:Date.now()};
    if(baseId){ if(!o.seen) o.seen = {}; o.seen[baseId] = 1; }
    saveOverall(o);
  }
  function resetOverall(){
    try{ localStorage.removeItem(OVERALL_KEY); }catch(e){}
  }
  function resetDeck(){
    try{ localStorage.removeItem(DECK_KEY); }catch(e){}
  }
// ---------------- Shuffle-deck (no repeats until exhausted) ----------------
  const DECK_KEY = "preibphysics_trilogy_energy_deck_v1";

  function fnv1a(str){
    let h = 2166136261;
    for(let i=0;i<str.length;i++){
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h>>>0).toString(16);
  }

  function loadDeck(){
    try{
      const raw = localStorage.getItem(DECK_KEY);
      if(!raw) return null;
      const obj = JSON.parse(raw);
      if(!obj || typeof obj !== "object") return null;
      return obj;
    }catch(e){ return null; }
  }

  function saveDeck(obj){
    try{ localStorage.setItem(DECK_KEY, JSON.stringify(obj)); }catch(e){}
  }

  function buildDeckSignature(pool, topics, diffMix){
    // Signature changes whenever the pool changes (topics/difficulty), so we can safely reuse a deck across sets.
    const ids = pool.map(q=>q.id).slice().sort().join("|");
    const sigStr = `${ids}||${topics.slice().sort().join(",")}||${diffMix}`;
    return fnv1a(sigStr);
  }

  function getNextFromDeck(pool, topics, diffMix, nWanted){
    const need = clamp(nWanted, 5, pool.length);

    const sig = buildDeckSignature(pool, topics, diffMix);
    let deck = loadDeck();

    // Build id list and map
    const poolMap = new Map();
    for(const q of pool){
      if(!poolMap.has(q.id)) poolMap.set(q.id, q);
    }
    const poolIds = Array.from(poolMap.keys());

    // (Re)initialise deck if missing/mismatched
    if(!deck || deck.sig !== sig || !Array.isArray(deck.order) || typeof deck.cursor !== "number"){
      deck = {sig, order: shuffle(poolIds.slice()), cursor: 0};
    }

    function familyOfId(id){
      const m = id.match(/^(.*)_\d+$/);
      return m ? m[1] : id;
    }

    // Cap how many from “near-identical series” can appear in a single set.
    const caps = {
      "stores_scenario": 2,
      "transfer_path": 2,
      "formula_recall": 2,
      "ke_calc": 2,
      "gpe_calc": 2,
      "epe_calc": 2,
      "work_calc": 2,
      "power_calc": 2,
      "elec_work_calc": 2,
      "shc_calc": 2,
      "shc_practical": 1,
      "data_handling": 2,
      "eff_calc": 2,
      "dissipation": 2,
      "insulation": 2,
      "resources": 2,
      "grid": 2
    };

    const counts = {};
    const chosenIds = [];

    let i = deck.cursor;
    let safety = 0;
    let relax = false;

    while(chosenIds.length < need && safety < 5000){
      safety += 1;

      if(i >= deck.order.length){
        // reached end of deck: reshuffle for next cycle
        deck.order = shuffle(poolIds.slice());
        i = 0;
        // if we're struggling to fill because caps are too strict, relax
        relax = true;
      }

      const id = deck.order[i];
      i += 1;

      if(chosenIds.includes(id)) continue;

      const fam = familyOfId(id);
      const cap = (relax ? 999 : (caps[fam] ?? ((fam!==id) ? 2 : 999)));
      if((counts[fam] ?? 0) >= cap) continue;

      chosenIds.push(id);
      counts[fam] = (counts[fam] ?? 0) + 1;
    }

    deck.cursor = i;
    saveDeck(deck);

    // Convert ids to questions
    const chosen = [];
    for(const id of chosenIds){
      const q = poolMap.get(id);
      if(q) chosen.push(q);
    }
    return chosen;
  }

let currentSet = [];
  let answered = new Map();

  function qMaxMarksSafe(q){ return qMaxMarks(q); }
  function totalMaxMarks(){ return currentSet.reduce((s,q)=> s + qMaxMarksSafe(q), 0); }
  function totalScore(){
    let s=0;
    for(const v of answered.values()){
      if(v.checked) s += (v.score ?? 0);
    }
    return s;
  }
  function renderKPIs(){
    const vals = Array.from(answered.values());
    const checked = vals.filter(x => x.checked).length;
    const full = vals.filter(x => x.checked && x.status==="full").length;
    const partial = vals.filter(x => x.checked && x.status==="partial").length;
    const wrong = vals.filter(x => x.checked && x.status==="wrong").length;

    els.kpiChecked.textContent = checked;
    els.kpiFull.textContent = full;
    els.kpiPartial.textContent = partial;
    els.kpiWrong.textContent = wrong;

    const max = totalMaxMarks();
    const s = totalScore();
    els.scoreLine.textContent = max ? `${s.toFixed(1)} / ${max}` : "-";
    els.summaryLine.innerHTML = currentSet.length
      ? `<b>${full}</b> full, <b>${partial}</b> partial, <b>${wrong}</b> wrong, <b>${currentSet.length-checked}</b> unchecked.`
      : "Start a set to begin.";
// Update header stats (always visible)
    const checkedN = Array.from(answered.values()).filter(v => v && v.checked).length;
    const setN = currentSet.length || 0;
    const maxSet = totalMaxMarks();
    const sSet = totalScore();
    const pctSet = maxSet ? (100*sSet/maxSet) : 0;

    if(els.statSet){
      const prog = setN ? (100*checkedN/setN) : 0;
      els.statSet.textContent = setN ? `${checkedN}/${setN} tackled • ${pctSet.toFixed(0)}% score` : "–";
    }

    if(els.statOverall){
      const tot = computeOverallTotals();
      const seen = computeOverallSeen();
      const pctO = tot.totalMax ? (100*tot.totalScore/tot.totalMax) : 0;
      const bankN = Array.isArray(BANK) ? BANK.length : 0;
      const seenPct = bankN ? (100*seen.seenCount/bankN) : 0;
      els.statOverall.textContent = bankN ? `${seen.seenCount}/${bankN} seen (${seenPct.toFixed(0)}%) • ${pctO.toFixed(0)}% score` : "–";
    }

  }

  function renderChoice(q, idx){
    const name = `q_${q._instanceId}`;
    const choice = q.choices[idx];

    let inner = "";
    if(choice && typeof choice === "object" && choice.symbolKind){
      inner = `<div class="choiceText"><div class="choiceTitle">${escapeHtml(choice.label || String.fromCharCode(65+idx))}</div>
               <div class="choiceViz">${symbolSVG(choice.symbolKind)}</div></div>`;
    } else if(choice && typeof choice === "object" && choice.graphKind){
      inner = `<div class="choiceText"><div class="choiceTitle">${escapeHtml(choice.label || String.fromCharCode(65+idx))}</div>
               ${graphSVG(choice.graphKind)}
               ${choice.caption ? `<div class="small">${escapeHtml(choice.caption)}</div>` : ``}</div>`;

    } else if(choice && typeof choice === "object" && choice.svgKind){
      inner = `<div class="choiceText"><div class="choiceTitle">${escapeHtml(choice.label || String.fromCharCode(65+idx))}</div>
               <div class="choiceViz">${customSVG(choice.svgKind)}</div>
               ${choice.caption ? `<div class="small">${escapeHtml(choice.caption)}</div>` : ``}</div>`;
    } else {
      inner = `<div class="choiceText">${escapeHtml(choice)}</div>`;
    }

    return `<label class="choice">
        <input type="radio" name="${name}" value="${idx}" />
        ${inner}
      </label>`;
  }

  function renderQuestionCard(q, index){
    const qnum = index+1;
    const tags = (q.tags||[]).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("");
    let inputHTML = "";

    if(q.type==="mcq"){
      inputHTML = q.choices.map((_,i)=>renderChoice(q,i)).join("")
        + `<div style="margin-top:8px; display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
             <button class="btn" data-action="check" data-qid="${q._instanceId}">Check</button>
             <span class="small">Tip: click an option then press Enter.</span>
           </div>`;
    } else if(q.type==="short"){
      inputHTML = `<div class="answerbox">
        <textarea id="in_${q._instanceId}" placeholder="Type your answer…"></textarea>
        <button class="btn" data-action="check" data-qid="${q._instanceId}">Check</button>
      </div>
      <div class="small">Enter submits. Shift+Enter = new line.</div>`;
    } else if(q.type==="long"){
      inputHTML = `<div class="answerbox">
        <textarea id="in_${q._instanceId}" placeholder="Type your answer… (aim for full sentences)"></textarea>
        <button class="btn" data-action="check" data-qid="${q._instanceId}">Check</button>
      </div>
      <div class="small">Enter submits. Shift+Enter = new line.</div>`;
    } else {
      inputHTML = `<div class="answerbox">
        <input type="text" id="in_${q._instanceId}" placeholder="Type a number (include units if you can)" />
        <button class="btn" data-action="check" data-qid="${q._instanceId}">Check</button>
      </div>
      <div class="small">Tip: press Enter to submit this question.</div>`;
    }

    return `<div class="qcard" id="card_${q._instanceId}">
        <div class="qhead">
          <div>
            <div class="qnum">Q${qnum} • ${qMaxMarksSafe(q)} mark${qMaxMarksSafe(q)===1?"":"s"}</div>
            <div class="qtext">${escapeHtml(q.prompt)}</div>
          </div>
          <div class="tags">${tags}<button class="btn mini" data-action="report" data-qid="${q._instanceId}" title="Report this question">Report</button></div>
        </div>
        ${inputHTML}
        <div id="fb_${q._instanceId}"></div>
      </div>`;
  }

  function renderQuiz(){
    els.quiz.innerHTML = currentSet.map(renderQuestionCard).join("");
    
  // Extra safety: if focus is on a radio option, Enter submits that question.
  document.addEventListener("keydown", (e) => {
    if(e.key !== "Enter") return;
    const t = e.target;
    if(!t) return;
    if(t.matches && t.matches('input[type="radio"]')){
      const card = t.closest('.qcard');
      if(card){
        const id = card.id.replace('card_','');
        if(id){ e.preventDefault(); checkAndShow(id); }
      }
    }
  });

renderKPIs();
    els.statusPill.textContent = "In progress";
    els.setPill.textContent = `${currentSet.length} Q set`;
    els.newSetBtn.disabled = false;
    els.revealAllBtn.disabled = false;

    for(const q of currentSet){
      const inp = document.getElementById(`in_${q._instanceId}`);
      if(inp){
        inp.addEventListener("keydown", (e) => {
          if(e.key === "Enter"){
            if((q.type === "short" || q.type==="long") && !e.shiftKey){
              e.preventDefault();
              checkAndShow(q._instanceId);
            }
            if(!(q.type === "short" || q.type==="long")){
              e.preventDefault();
              checkAndShow(q._instanceId);
            }
          }
        });
      }
      if(q.type === "mcq"){
        const card = document.getElementById(`card_${q._instanceId}`);
        if(card){
          card.addEventListener("keydown", (e) => {
            if(e.key === "Enter"){
              const active = document.activeElement;
              if(card.contains(active)){
                e.preventDefault();
                checkAndShow(q._instanceId);
              }
            }
          });
          card.setAttribute("tabindex","-1");
        }
      }
    }
  }

  function getMCQSelection(q){
    const name = `q_${q._instanceId}`;
    const sel = document.querySelector(`input[name="${name}"]:checked`);
    return sel ? Number(sel.value) : null;
  }

  function checkQuestion(q){
    if(q.type==="mcq"){
      const sel = getMCQSelection(q);
      if(sel === null) return {checked:false, msg:"Choose an option first."};
      const correct = sel === q.answerIndex;
      const max = qMaxMarksSafe(q);
      return {checked:true, status: correct ? "full" : "wrong", score: correct ? max : 0, max, auto:false};
    }
    if(q.type==="numeric"){
      const input = document.getElementById(`in_${q._instanceId}`);
      return checkNumeric(q, input ? input.value : "");
    }
    if(q.type==="short" || q.type==="long"){
      const input = document.getElementById(`in_${q._instanceId}`);
      const raw = input ? input.value : "";
      if(!raw.trim()) return {checked:false, msg:"Type an answer first."};
      const out = checkShortMarkPoints(q, raw);
      return {checked:true, ...out};
    }
    return {checked:false, msg:"Unsupported question type."};
  }

  function correctLine(q){
    if(q.type==="mcq"){
      const c = q.choices[q.answerIndex];
      if(c && typeof c === "object"){
        return `Correct answer: ${c.label || "option"}`;
      }
      return `Correct answer: ${(""+c).trim()}`;
    }
    if(q.type==="numeric"){
      const a = q.answer;
      const rounded = prettyNum(a);
      const unitShow = q.unitHint ? q.unitHint : "";
      return `Correct answer: ${rounded}${unitShow ? " " + unitShow : ""}`;
    }
    if(q.type==="short" || q.type==="long"){
      return `Mark scheme: ${qMaxMarksSafe(q)} point(s).`;
    }
    return "";
  }

  function autoWarnHTML(){
    return `<div class="autoWarn">
        <div class="h">AUTO-MARKING WARNING (NOT AI MARKING)</div>
        <div class="b">
          This written answer has <b>not</b> been properly marked. The checker only looks for the
          <b>presence of a few keywords/phrases</b>. It can miss good answers and it can also give credit to weak answers.
          Use the mark scheme and judge it yourself.
        </div>
      </div>`;
  }

  function adjustMarksHTML(qid, maxMarks){
    return `<div class="adjustRow">
        <div class="note"><b>Optional:</b> adjust marks for this question (0 to ${maxMarks}). This updates the totals.</div>
        <input type="number" min="0" max="${maxMarks}" step="0.5" data-adjust="${qid}" />
        <button class="btn" data-action="applyAdjust" data-qid="${qid}">Apply</button>
      </div>`;
  }

  function showFeedback(q, outcome){
    const fb = document.getElementById(`fb_${q._instanceId}`);
    if(!fb) return;

    if(!outcome.checked){
      fb.innerHTML = `<div class="feedback bad"><div class="title">Not checked</div><p class="explain">${escapeHtml(outcome.msg)}</p></div>`;
      return;
    }
    const max = outcome.max ?? qMaxMarksSafe(q);
    const good = outcome.status === "full";
    const partial = outcome.status === "partial";
    const title = good ? "Correct" : (partial ? "Partly correct" : "Not quite");
    const cls = good ? "good" : (partial ? "" : "bad");

    let diag = "";
    if(outcome.unitMsg) diag += outcome.unitMsg + "\n";
    if(outcome.reason) diag += outcome.reason + "\n";
    if(outcome.auto){
      if(outcome.status !== "full" && outcome.missing && outcome.missing.length){
        diag += `Missing ideas (examples): ${outcome.missing.slice(0,3).join("; ")}\n`;
      }
    }

    const explainText = (diag ? (diag + "\n") : "") + (q.explanation || "");
    const open = true;
    const warn = outcome.auto ? autoWarnHTML() : "";

    fb.innerHTML = `<div class="feedback ${cls}">
        <div class="title">${title} (${(outcome.score??0).toFixed(1)} / ${max.toFixed(1)} marks)</div>
        <p class="explain">${escapeHtml(correctLine(q))}</p>
        ${warn}
        <details ${open ? "open" : ""}>
          <summary>${good ? "Show explanation" : "Explanation (mark-scheme style)"}</summary>
          <p class="model">${escapeHtml(explainText)}</p>
        </details>
        ${(outcome.auto && (q.allowAdjust || q.type==="long")) ? adjustMarksHTML(q._instanceId, max) : ``}
      </div>`;
  }

  function updateSetFromUI(){
    const topics = getSelectedTopics();
    let pool = BANK.filter(q => (q.tags||[]).some(t => topics.includes(t)));
    pool = applyDifficultyFilter(pool, els.diffMix.value);
    const n = Number(els.numQ.value);

    if(pool.length < 1){
      els.quiz.innerHTML = `<div class="hint">No questions available — select at least one topic.</div>`;
      els.startBtn.disabled = false;
      return false;
    }

    // Immediate feedback so it never feels "dead"
    els.statusPill.textContent = "Building set…";
    els.startBtn.disabled = true;
    els.newSetBtn.disabled = true;
    els.revealAllBtn.disabled = true;

    // Shuffle-deck selection: no repeats until exhausted, then reshuffle.
    const chosen = getNextFromDeck(pool, topics, els.diffMix.value, n).map(expandQuestion);

    const now = Date.now().toString(36);
    currentSet = chosen.map((q,i)=> ({...q, _instanceId:`${q.id}_${now}_${i}`}));

    answered = new Map();
    renderQuiz();

    els.setPill.textContent = `Set ${now.toUpperCase()}`;
    els.statusPill.textContent = "In progress";
    els.revealAllBtn.disabled = false;
    els.newSetBtn.disabled = false;
    els.startBtn.disabled = false;

    renderKPIs();
    return true;
  }

  function checkAndShow(qid){
    const q = currentSet.find(x => x._instanceId === qid);
    if(!q) return;
    const outcome = checkQuestion(q);
    showFeedback(q, outcome);
    if(outcome.checked){
      answered.set(q._instanceId, {checked:true, status: outcome.status, score: outcome.score, max: outcome.max ?? qMaxMarksSafe(q), auto: !!outcome.auto});
      updateOverallForInstance(q._instanceId, q.id, outcome.score, outcome.max ?? qMaxMarksSafe(q));
      renderKPIs();
    }
  }

  els.startBtn.addEventListener("click", updateSetFromUI);
  els.newSetBtn.addEventListener("click", updateSetFromUI);

  els.revealAllBtn.addEventListener("click", () => {
    currentSet.forEach(q => {
      const fb = document.getElementById(`fb_${q._instanceId}`);
      const warn = (q.type==="short" && q.markPoints) ? autoWarnHTML() : "";
      fb.innerHTML = `<div class="feedback">
          <div class="title">Mark scheme</div>
          <p class="explain">${escapeHtml(correctLine(q))}</p>
          ${warn}
          <details open><summary>Explanation</summary><p class="model">${escapeHtml(q.explanation || "")}</p></details>
          ${((q.type==='short' && Array.isArray(q.markPoints)) ? adjustMarksHTML(q._instanceId, qMaxMarksSafe(q)) : ``)}
        </div>`;
    });
    els.statusPill.textContent = "Revealed";
  });

  els.quiz.addEventListener("click", (e) => {
const repBtn = e.target.closest("button[data-action='report']");
    if(repBtn){
      const qid = repBtn.getAttribute("data-qid");
      const q = currentSet.find(x => x._instanceId === qid);
      const baseId = q ? q.id : "(unknown)";
      const payload = `Please check this question:\n\nTopic: 6 Magnetism\nbase id: ${baseId}\ninstance id: ${qid}\n\nPrompt:\n${q ? q.prompt : ""}\n`;
      const banner = document.getElementById("reportBanner");
      if(banner){
        banner.style.display = "block";
        banner.innerHTML = `
          <div class="reportRow">
            <div>
              <b>Report a dodgy question</b>
              <div class="small">Paste the text below into an email (it identifies the exact question).</div>
            </div>
            <button class="btn mini" type="button" id="closeReportBtn">Close</button>
          </div>
          <textarea class="reportBox" readonly>${escapeHtml(payload)}</textarea>
          <div class="reportActions">
            <button class="btn mini" type="button" id="copyReportBtn">Copy</button>
            <span class="small">If copy is blocked, just select the text and copy manually.</span>
          </div>
        `;
        const cbtn = document.getElementById("copyReportBtn");
        if(cbtn){
          cbtn.addEventListener("click", ()=>{
            if(navigator.clipboard && navigator.clipboard.writeText){
              navigator.clipboard.writeText(payload).catch(()=>{});
            }
          }, {once:true});
        }
        const xbtn = document.getElementById("closeReportBtn");
        if(xbtn){
          xbtn.addEventListener("click", ()=>{ banner.style.display="none"; }, {once:true});
        }
        // Auto-hide after 15 seconds
        setTimeout(()=>{ try{ banner.style.display="none"; }catch(_){} }, 15000);
        banner.scrollIntoView({behavior:"smooth", block:"start"});
        // Attempt immediate clipboard copy
        if(navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(payload).catch(()=>{});
        }
      } else {
        alert(payload);
      }
      return;
    }

    const btnCheck = e.target.closest("button[data-action='check']");
    if(btnCheck){
      checkAndShow(btnCheck.getAttribute("data-qid"));
      return;
    }
    const btnAdj = e.target.closest("button[data-action='applyAdjust']");
    if(btnAdj){
      const qid = btnAdj.getAttribute("data-qid");
      const q = currentSet.find(x => x._instanceId === qid);
      if(!q) return;
      const input = document.querySelector(`input[data-adjust="${qid}"]`);
      if(!input) return;
      const val = Number(input.value);
      if(Number.isNaN(val)) return;

      const max = qMaxMarksSafe(q);
      const adj = clamp(val, 0, max);
      const status = (adj===0) ? "wrong" : (adj===max ? "full" : "partial");
      answered.set(qid, {checked:true, status, score:adj, max, auto:(q.type==="short" && Array.isArray(q.markPoints)), selfOverride:true});
      updateOverallForInstance(qid, q.id, adj, max);

      const fb = document.getElementById(`fb_${qid}`);
      if(fb){
        const titleEl = fb.querySelector(".feedback .title");
        if(titleEl) titleEl.textContent = `Marks set (${adj.toFixed(1)} / ${max.toFixed(1)} marks)`;
      }
      renderKPIs();
      return;
    }
  });

  if(els.resetOverallBtn){
    els.resetOverallBtn.addEventListener('click', ()=>{
      resetOverall();
      renderKPIs();
    });
  }
  if(els.resetDeckBtn){
    els.resetDeckBtn.addEventListener('click', ()=>{
      resetDeck();
      els.statusPill.textContent = "Deck reset";
      // Next set will start a fresh shuffled order
    });
  }

  renderKPIs();
})();
