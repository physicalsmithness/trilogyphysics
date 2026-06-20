"use strict";
const fs=require("fs"),path=require("path");
let JSDOM; try{JSDOM=require("jsdom").JSDOM;}catch(e){JSDOM=require(path.join(__dirname,"node_modules","jsdom")).JSDOM;}
const APP=path.join(__dirname,"..","app"); const read=f=>fs.readFileSync(path.join(APP,f),"utf8");
const dom=new JSDOM('<!doctype html><html><body><div id="host"></div></body></html>',{url:"http://localhost/?demo=1",runScripts:"outside-only",pretendToBeVisual:true});
const w=dom.window;
["circuit-builder-embed.js","formula.js","rounding_classifier.js","diagrams.js","engine.js","calc_workings.js","../data/misconceptions.js","widgets/widgets_core.js"].forEach(f=>{try{w.eval(read(f));}catch(e){}});
w.eval(read("topics/electricity_6_2.js")); w.eval(read("../test/fixtures_6_2.js"));
const cfg=Object.assign({},w.TRILOGY_TOPICS["6.2"],{items:w.TRILOGY_TEST_FIXTURES});
const host=()=>w.document.getElementById("host");
function mount(c){ w.TrilogyEngine.mount({container:host(),topic:{id:"6.2",slug:"electricity",name:"Electricity"},config:c,identity:{anonymous_id:"t",display_name:"T",cohort:"C"},report:()=>{}}); }
const lorCfg=Object.assign({},cfg,{items:cfg.items.filter(it=>it.id==="_demo_grid_lor")});
console.log("A) fresh mount lorCfg ->", host().querySelectorAll(".tp-option").length); // baseline (worked)
try{
  mount(cfg);                                  // full demo flow (first item)
  console.log("B) after mount(full): unmount fn?", typeof w.TrilogyEngine.unmount);
  w.TrilogyEngine.unmount();
  mount(lorCfg);                               // remount just LOR (the test's sequence)
  console.log("C) after unmount+mount(lorCfg): .tp-option =", host().querySelectorAll(".tp-option").length, "(test expects 8)");
  console.log("   host snippet:", host().innerHTML.replace(/\s+/g," ").slice(0,300));
}catch(e){ console.log("THREW:", e.stack); }
