// node tools/shot.mjs <outdir> <W> <H> <prefix> <pos1,pos2,...> [query]
// pos = número (fracción de scroll 0-1) o selector[+px]. query p. ej. "hero=C&nointro=1"
import { spawn } from "node:child_process"; import fs from "node:fs";
const [out, W, H, pre, list, query = ""] = process.argv.slice(2);
const port = 9400 + Math.floor(Math.random()*400);
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new",`--remote-debugging-port=${port}`,`--user-data-dir=${out}/prof${port}`,"--hide-scrollbars","--autoplay-policy=no-user-gesture-required","about:blank"]);
const sleep = ms => new Promise(r => setTimeout(r, ms));
let tabs; for (let i=0;i<60;i++){ try{ tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break;}catch{ await sleep(250);} }
const ws = new WebSocket(tabs.find(t=>t.type==="page").webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id=0; const pend={}; const logs=[];
ws.onmessage = e => { const m=JSON.parse(e.data); if(m.id&&pend[m.id]){pend[m.id](m.result);delete pend[m.id];}
  if(m.method==="Runtime.exceptionThrown") logs.push("EXC "+(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text));
  if(m.method==="Runtime.consoleAPICalled" && ["error","warning"].includes(m.params.type)) logs.push(m.params.type+" "+m.params.args.map(a=>a.value||a.description).join(" "));
  if(m.method==="Log.entryAdded" && m.params.entry.level==="error") logs.push("LOG "+m.params.entry.text+" "+(m.params.entry.url||"")); };
const send=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}));});
await send("Runtime.enable"); await send("Log.enable"); await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride",{width:+W,height:+H,deviceScaleFactor:1,mobile:+W<600});
await send("Page.navigate",{url:"http://localhost:8765/"+(process.env.PAGE||"")+"?"+query+"&t="+Date.now()}); await sleep(5000);
let k=0;
for (const p of list.split(",")) {
  const isNum = /^[0-9.]+$/.test(p);
  const [sel, off] = p.split("+");
  const expr = isNum ? `window.scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*${p})` : `window.scrollTo(0, document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect().top+scrollY+${+off||0})`;
  // pasos para que ScrollTrigger/Lenis registren el movimiento
  await send("Runtime.evaluate",{expression:`(async()=>{const y0=scrollY; ${expr}; const y1=scrollY; window.scrollTo(0,y0); for(let i=1;i<=12;i++){window.scrollTo(0,y0+(y1-y0)*i/12); await new Promise(r=>setTimeout(r,40));} if(window.lenis) {} })()`,awaitPromise:true});
  await sleep(1800);
  const r = await send("Page.captureScreenshot",{format:"jpeg",quality:70});
  fs.writeFileSync(`${out}/${pre}-${String(k++).padStart(2,"0")}.jpg`, Buffer.from(r.data,"base64"));
}
console.log(logs.length?logs.join("\n"):"no errors");
ws.close(); chrome.kill();
