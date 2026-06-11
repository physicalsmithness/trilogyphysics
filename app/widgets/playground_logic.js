(function () {
  "use strict";
  var DIAG = window.TOPIC_DIAGRAMS, WID = window.TOPIC_WIDGETS;
  var REGIONS = ["radio","microwave","infrared","visible","ultraviolet","xray","gamma"];
  var INTERACTIVE = { wave_train:1, wavefronts:1, longitudinal_wave:1, wave_scenario:1,
    ripple_tank:1, standing_wave:1, em_spectrum:1, refraction_wavefronts:1, refraction_ray:1 };
  var SCHEMA = {
    wave_train: [
      {k:"wavelength", t:"num", d:4, step:0.5}, {k:"amplitude", t:"num", d:1, step:0.5},
      {k:"cycles", t:"num", d:2, step:1, min:1},
      {k:"orientation", t:"sel", o:["horizontal","vertical"], d:"horizontal"},
      {k:"mark.wavelength", t:"bool"}, {k:"mark.half_wavelength", t:"bool"},
      {k:"mark.amplitude", t:"bool"}, {k:"mark.arrows", t:"bool"},
      {k:"distractor", t:"sel", o:["(none)","amplitude_double","amplitude_diagonal","wavelength_half","wavelength_peak_to_trough"], d:"(none)",
        hint:"renders a deliberately-WRONG marking for MCQ-over-the-picture items"},
      {k:"target", t:"sel", o:["(pupil picks)","wavelength","half_wavelength","amplitude"], d:"(pupil picks)", io:1, hint:"fix which feature the pupil must mark"}
    ],
    wavefronts: [
      {k:"count", t:"num", d:6, step:1, min:1}, {k:"spacing", t:"num", d:1, step:0.5, hint:"wavelength between fronts"},
      {k:"curved", t:"bool", hint:"point source (arcs) vs plane waves (straight)"}, {k:"mark.wavelength", t:"bool"},
      {k:"target", t:"sel", o:["(pupil picks)","wavelength","half_wavelength"], d:"(pupil picks)", io:1}
    ],
    longitudinal_wave: [
      {k:"wavelength", t:"num", d:4, step:0.5}, {k:"cycles", t:"num", d:3, step:1, min:1},
      {k:"mark.labelCR", t:"bool", hint:"label a compression (C) and rarefaction (R)"},
      {k:"mark.wavelength", t:"bool"}, {k:"mark.half_wavelength", t:"bool"},
      {k:"blanks", t:"bool", hint:"empty C/R boxes for the pupil to fill"},
      {k:"distractor", t:"sel", o:["(none)","wavelength_C_to_R"], d:"(none)"}
    ],
    wave_scenario: [
      {k:"variant", t:"sel", o:["shore","pier","sonar","speed_clap","echo_wall","clap_rhythm"], d:"shore"},
      {k:"mark.distance", t:"bool"}, {k:"mark.time", t:"bool"}, {k:"mark.count", t:"bool"},
      {k:"values.distance", t:"text", hint:"label on the distance arrow, e.g. '100 m'"},
      {k:"values.time", t:"text"}, {k:"values.count", t:"text"}, {k:"values.depth", t:"text"},
      {k:"caption", t:"text", hint:"your own caption; blank = default"}
    ],
    ripple_tank: [ {k:"waves", t:"num", d:5, step:1, min:1, hint:"how many wavelengths the ruler spans"}, {k:"mark.distance", t:"bool"} ],
    standing_wave: [
      {k:"loops", t:"num", d:3, step:1, min:1, hint:"number of loops (antinodes)"},
      {k:"mark.nodes", t:"bool"}, {k:"mark.antinodes", t:"bool"}, {k:"mark.halfLambda", t:"bool"}, {k:"mark.length", t:"bool"},
      {k:"lengthLabel", t:"text", d:"L"}
    ],
    em_spectrum: [
      {k:"mark.frequencyArrow", t:"bool"}, {k:"mark.wavelengthArrow", t:"bool"}, {k:"mark.ends", t:"bool", d:true},
      {k:"blanks", t:"regions", hint:"comma list, e.g. infrared,xray - blanks those labels"},
      {k:"highlight", t:"regions"}, {k:"hide", t:"regions"},
      {k:"question", t:"sel", o:["which_end","name_region"], d:"which_end", io:1},
      {k:"attribute", t:"sel", o:["high_frequency","low_frequency","short_wavelength","long_wavelength"], d:"high_frequency", io:1},
      {k:"target", t:"sel", o:REGIONS, d:"gamma", io:1}
    ],
    em_origins: [ {k:"regions", t:"text", d:"all", hint:"'all' or comma list"}, {k:"blanks", t:"regions", hint:"comma list of regions to gap out (or 'all') - makes it a question"} ],
    em_uses:    [ {k:"regions", t:"text", d:"all", hint:"'all' or comma list of regions"} ],
    refraction_wavefronts: [
      {k:"n1", t:"num", d:1, step:0.05, hint:"index of top medium (drives geometry; never drawn)"},
      {k:"n2", t:"num", d:1.5, step:0.05}, {k:"theta1", t:"num", d:40, step:5, hint:"angle of incidence, degrees"},
      {k:"medium1", t:"text", hint:"name shown for top medium, e.g. air"}, {k:"medium2", t:"text"},
      {k:"showSpeedCue", t:"bool", d:true},
      {k:"mark.normal", t:"bool", d:true}, {k:"mark.angles", t:"bool"}, {k:"mark.spacing", t:"bool"},
      {k:"mark.ray", t:"bool", hint:"off by default - usually you don't draw the ray on a wavefront diagram"}
    ],
    refraction_ray: [
      {k:"shape", t:"sel", o:["rectangle","triangle","semicircle"], d:"rectangle"},
      {k:"n", t:"num", d:1.5, step:0.05}, {k:"theta1", t:"num", d:40, step:5},
      {k:"material", t:"text", hint:"label on the block, e.g. 'glass block'"},
      {k:"mark.normal", t:"bool", d:true}, {k:"mark.angles", t:"bool"}, {k:"mark.labels", t:"bool", d:true}
    ],
    material_wave_behaviour: [
      {k:"material", t:"text", d:"coloured glass"},
      {k:"_preset", t:"sel", o:["visible through / UV absorbed / IR reflected","all transmitted (transparent)","all reflected (mirror)","visible through / IR absorbed"],
        d:"visible through / UV absorbed / IR reflected", hint:"authors can also pass a custom rays:[{label,behaviour}] array"}
    ],
    radiation_demo: [ {k:"variant", t:"sel", o:["leslie_cube","wax_rod","two_bottles","ir_detection"], d:"leslie_cube"} ]
  };
  var MAT_PRESETS = {
    "visible through / UV absorbed / IR reflected": [{label:"visible",behaviour:"transmit"},{label:"ultraviolet",behaviour:"absorb"},{label:"infrared",behaviour:"reflect"}],
    "all transmitted (transparent)": [{label:"visible",behaviour:"transmit"},{label:"infrared",behaviour:"transmit"}],
    "all reflected (mirror)": [{label:"visible",behaviour:"reflect"},{label:"infrared",behaviour:"reflect"}],
    "visible through / IR absorbed": [{label:"visible",behaviour:"transmit"},{label:"infrared",behaviour:"absorb"}]
  };
  var kindSel=document.getElementById("kind"), interToggle=document.getElementById("inter"),
      controlsEl=document.getElementById("controls"), hostEl=document.getElementById("host"),
      markBtn=document.getElementById("mark"), scoreEl=document.getElementById("score"), cfgEl=document.getElementById("cfg");
  var ctrls=[], current=null;
  Object.keys(SCHEMA).forEach(function(k){ var o=document.createElement("option"); o.value=k; o.textContent=k+(INTERACTIVE[k]?"":"  (static only)"); kindSel.appendChild(o); });
  function setPath(obj,path,val){ var parts=path.split("."),o=obj,i; for(i=0;i<parts.length-1;i++){ if(!o[parts[i]])o[parts[i]]={}; o=o[parts[i]]; } o[parts[parts.length-1]]=val; }
  function buildControls(kind){
    controlsEl.innerHTML=""; ctrls=[];
    var isInter=interToggle.checked && INTERACTIVE[kind];
    SCHEMA[kind].forEach(function(p){
      if(p.io && !isInter) return;
      var row=document.createElement("div"); row.className="ctrl";
      var lab=document.createElement("label"); lab.textContent=p.k+(p.io?" *":""); var inp;
      if(p.t==="bool"){ inp=document.createElement("input"); inp.type="checkbox"; inp.checked=!!p.d; }
      else if(p.t==="sel"){ inp=document.createElement("select"); p.o.forEach(function(v){ var e=document.createElement("option"); e.value=v; e.textContent=v; inp.appendChild(e); }); inp.value=(p.d!=null)?p.d:p.o[0]; }
      else if(p.t==="num"){ inp=document.createElement("input"); inp.type="number"; if(p.step!=null)inp.step=p.step; if(p.min!=null)inp.min=p.min; if(p.d!=null)inp.value=p.d; }
      else { inp=document.createElement("input"); inp.type="text"; if(p.d!=null)inp.value=p.d; }
      inp.addEventListener("input",render); inp.addEventListener("change",render);
      row.appendChild(lab); row.appendChild(inp);
      if(p.hint){ var hh=document.createElement("div"); hh.className="hint"; hh.textContent=p.hint; row.appendChild(hh); }
      controlsEl.appendChild(row); ctrls.push({p:p,inp:inp});
    });
  }
  function readConfig(){
    var cfg={};
    ctrls.forEach(function(c){
      var p=c.p, inp=c.inp, v;
      if(p.t==="bool"){ if(inp.checked) setPath(cfg,p.k,true); }
      else if(p.t==="num"){ v=parseFloat(inp.value); if(isFinite(v)) setPath(cfg,p.k,v); }
      else if(p.t==="regions"){ var a=inp.value.split(",").map(function(x){return x.trim();}).filter(Boolean); if(a.length) setPath(cfg,p.k,a); }
      else { v=inp.value; if(v!=="" && v.charAt(0)!=="("){ if(p.k==="_preset"){ cfg.rays=MAT_PRESETS[v]; } else setPath(cfg,p.k,v); } }
    });
    return cfg;
  }
  function augmentForScoring(kind,cfg){
    if(kind==="wave_scenario"){ var v=cfg.variant||"shore";
      if(v==="sonar"){cfg.quantity="sonar_depth";cfg.speed=1500;cfg.time=0.4;cfg.readLabel="depth:";cfg.unit="m";}
      else if(v==="pier"){cfg.quantity="frequency_count";cfg.count=8;cfg.time=20;cfg.readLabel="frequency:";cfg.unit="Hz";}
      else if(v==="speed_clap"){cfg.quantity="speed_direct";cfg.distance=100;cfg.time=0.3;cfg.readLabel="speed:";cfg.unit="m/s";}
      else {cfg.quantity="speed_echo";cfg.distance=50;cfg.time=0.3;cfg.readLabel="speed:";cfg.unit="m/s";}
    } else if(kind==="ripple_tank"){cfg.quantity="wavelength_ripple";cfg.distance=0.20;cfg.readLabel="wavelength:";cfg.unit="m";}
    else if(kind==="standing_wave"){cfg.quantity="wavelength_standing";cfg.length=1.2;cfg.readLabel="wavelength:";cfg.unit="m";if(!cfg.mark)cfg.mark={};cfg.mark.length=true;cfg.lengthLabel="1.2 m";}
    return cfg;
  }
  function render(){
    var kind=kindSel.value, isInter=interToggle.checked && INTERACTIVE[kind], cfg=readConfig();
    hostEl.innerHTML=""; scoreEl.textContent=""; current=null;
    markBtn.style.display=isInter?"inline-block":"none";
    var shown=JSON.parse(JSON.stringify(cfg));
    try{
      if(isInter){ augmentForScoring(kind,cfg); current=WID[kind](hostEl,cfg); }
      else { var node=DIAG[kind](cfg); if(node) hostEl.appendChild(node); }
    }catch(e){ hostEl.innerHTML="<div class='err'>render error: "+e.message+"</div>"; }
    var field=isInter?"widget":"diagram", inner=isInter?"config":"params";
    cfgEl.textContent="// the author writes this on the item:\nitem."+field+" = {\n  kind: \""+kind+"\",\n  "+inner+": "+JSON.stringify(shown,null,2).replace(/\n/g,"\n  ")+"\n};";
  }
  markBtn.addEventListener("click",function(){
    if(!current) return;
    var kind=kindSel.value, cfg=augmentForScoring(kind,readConfig());
    var ans=current.getAnswer(), res=current.score(ans,cfg);
    scoreEl.innerHTML="<b>getAnswer()</b>\n"+JSON.stringify(ans,null,2)+"\n\n<b>score()</b>  <span class='st-"+res.status+"'>"+res.status+" "+res.marksAwarded+"/"+res.marksPossible+"</span>\n"+JSON.stringify(res,null,2);
  });
  function reload(){ buildControls(kindSel.value); render(); }
  kindSel.addEventListener("change",reload); interToggle.addEventListener("change",reload);
  kindSel.value="wave_train"; reload();
})();
