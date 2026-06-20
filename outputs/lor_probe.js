"use strict";
const fs=require("fs"),path=require("path");
let JSDOM; try{JSDOM=require("jsdom").JSDOM;}catch(e){JSDOM=require(path.join(__dirname,"node_modules","jsdom")).JSDOM;}
const APP=path.join(__dirname,"..","app"); const read=f=>fs.readFileSync(path.join(APP,f),"utf8");
const dom=new JSDOM('<!doctype html><html><body><div id="host"></div></body></html>',{url:"http://localhost/?demo=1",runScripts:"outside-only",pretendToBeVisual:true});
const w=dom.window;
// surface uncaught errors from event handlers/render
w.addEventListener("error",e=>console.log("WINDOW ERROR:",e.error&&e.error.stack||e.message));
["circuit-builder-embed.js","formula.js","rounding_classifier.js","diagrams.js","engine.js","calc_workings.js","../data/misconceptions.js","widgets/widgets_core.js"].forEach(f=>{try{w.eval(read(f));}catch(e){console.log("load fail",f,e.message);}});
w.eval(read("topics/electricity_6_2.js"));
w.eval(read("../test/fixtures_6_2.js"));
const cfg=Object.assign({},w.TRILOGY_TOPICS["6.2"],{items:w.TRILOGY_TEST_FIXTURES});
const lorItem=cfg.items.filter(it=>it.id==="_demo_grid_lor");
console.log("LOR fixture found:",lorItem.length,"| has lor.points:",!!(lorItem[0]&&lorItem[0].lor&&lorItem[0].lor.points),"count:",lorItem[0]&&lorItem[0].lor&&lorItem[0].lor.points.length);
const lorCfg=Object.assign({},cfg,{items:lorItem});
try{
  w.TrilogyEngine.mount({container:w.document.getElementById("host"),topic:{id:"6.2",slug:"electricity",name:"Electricity"},config:lorCfg,identity:{anonymous_id:"t",display_name:"T",cohort:"C"},report:()=>{}});
  const n=w.document.getElementById("host").querySelectorAll(".tp-option").length;
  console.log("RENDERED .tp-option count:",n,"(expected 8)");
  if(n===0) console.log("host innerHTML (first 400):", w.document.getElementById("host").innerHTML.slice(0,400));
}catch(e){console.log("MOUNT THREW:",e.stack);}
