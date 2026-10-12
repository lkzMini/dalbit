(function(){"use strict";
const {UI,DATA,LESSONS}=Hangul.Data,{units,ROWS,SH,J2K,K2J,VW,ALPHA}=Hangul.Engine,{Progress,Navigation}=Hangul;
const $=s=>document.querySelector(s);let storage;try{storage=localStorage}catch{storage=null}
const ld=(k,d)=>Progress.read(storage,k)??d,sv=(k,v)=>Progress.write(storage,k,String(v));
let lang=Navigation.preferenceLanguage(ld("lang",navigator.language.startsWith("es")?"es":"en"));
let theme=ld("theme",matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light");if(!["light","dark"].includes(theme))theme="light";
let showKb=ld("kb","1")==="1",showRom=ld("rom","1")==="1",completed=Progress.load(storage,DATA,Hangul.Data.ORIGINAL_IDS);
const esc=t=>String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const S={lv:0,i:0,u:[],p:0,k:0,err:0,hit:0,done:0,n:0,tot:1,sh:false,combo:0};let tm,al="V",view="learn",lessonLevel=0;
const skip=()=>{while(S.p<S.u.length&&!S.u[S.p].k.length)S.p++},doneN=l=>Progress.count(completed,DATA[l]);
const speak=t=>{try{speechSynthesis.cancel();speechSynthesis.speak(Object.assign(new SpeechSynthesisUtterance(t),{lang:"ko-KR",rate:.8}))}catch{}};
function load(){clearTimeout(tm);S.it=DATA[S.lv].items[S.i];S.u=units(S.it.ko);S.p=0;S.k=0;S.n=0;S.combo=0;S.sh=false;document.querySelector('.k[data-k="⇧"]')?.setAttribute("aria-pressed","false");document.querySelector('.k[data-k="⇧"]')?.classList.remove("fl");skip();S.tot=S.u.reduce((a,x)=>a+x.k.length,0)||1;$("#msg").textContent="";render()}
function next(){S.i=(S.i+1)%DATA[S.lv].items.length;load()}
function render(){if(!S.it)return;const it=S.it,cu=S.u[S.p];
 $("#txt").innerHTML=S.u.map((x,i)=>`<span class="${i<S.p?"d":i==S.p?"c":""}">${esc(x.ch)}</span>`).join("");
 $("#brk").innerHTML=cu?`<b>${esc(cu.ch)}</b>→`+cu.k.map((k,i)=>`<i class="${i<S.k?"d":i==S.k?"n":""}">${K2J[k]}</i>`).join(""):"";
 $("#rom").textContent=showRom?it.roman:"";$("#tr").textContent=it[lang];
 $("#cnt").textContent=`${S.i+1}/${DATA[S.lv].items.length}`;$("#pbar").style.width=S.n/S.tot*100+"%";$("#combo").textContent=S.combo>2?"🔥 "+S.combo:"";
 $("#man").style.left=`calc((100% - 3rem) * ${S.n/S.tot})`;
 $("#kbw").hidden=!showKb;document.querySelectorAll(".k").forEach(e=>e.classList.remove("nx"));
 const need=cu?.k[S.k];if(need){document.querySelector(`.k[data-k="${need.toLowerCase()}"]`)?.classList.add("nx");if(need!==need.toLowerCase())document.querySelector('.k[data-k="⇧"]')?.classList.add("nx")}
 const t=S.hit+S.err;$("#s1").textContent=S.done;$("#s2").textContent=S.err;$("#s3").textContent=t?Math.round(S.hit/t*100)+"%":"—"}
function flash(l,ok){const e=document.querySelector(`.k[data-k="${l.toLowerCase()}"]`);if(!e)return;e.classList.add(ok?"fl":"bad");setTimeout(()=>e.classList.remove("fl","bad"),160)}
function hop(){const m=$("#man");m.classList.remove("hop");void m.offsetWidth;m.classList.add("hop")}
function boom(){const t=$("#trk"),x=$("#man").offsetLeft+20;for(let i=0;i<20;i++){const e=document.createElement("i");e.className="cf";e.style.cssText=`left:${x}px;--x:${Math.round((Math.random()-.5)*200)}px;--y:${-20-Math.round(Math.random()*50)}px;background:var(--l${i%4})`;t.appendChild(e);setTimeout(()=>e.remove(),900)}}
function press(l){if(S.p>=S.u.length)return;
 if(S.sh&&SH[l.toUpperCase()])l=l.toUpperCase();S.sh=false;document.querySelector('.k[data-k="⇧"]')?.setAttribute("aria-pressed","false");document.querySelector('.k[data-k="⇧"]')?.classList.remove("fl");
 const need=S.u[S.p].k[S.k],ok=l===need;flash(l,ok);
 if(ok){S.hit++;S.n++;S.combo++;S.k++;if(S.k>=S.u[S.p].k.length){S.p++;S.k=0;skip()}hop();
  if(S.p>=S.u.length){S.done++;completed=Progress.complete(completed,S.it.id,DATA);Progress.save(storage,completed,DATA);$("#msg").textContent=UI[lang].good;boom();tabs();tm=setTimeout(()=>{if(view==="practice")next()},1500)}render()}
 else{S.err++;S.combo=0;$("#txt").classList.add("sk");setTimeout(()=>$("#txt").classList.remove("sk"),250);render()}}
// ---- UI ----
function tabs(){$("#lv").innerHTML=DATA.map((l,i)=>`<button class="${i==S.lv?"on":""}" style="--c:var(--l${i})" data-l="${i}">${i+1}. ${l[lang]}<small>${doneN(i)}/${l.items.length}</small></button>`).join("");
 $("#road").innerHTML=DATA.map((l,i)=>`<button class="lc" style="--c:var(--l${i})" data-l="${i}"><span class="n">${i+1}</span><span><b>${l[lang]}</b><p>${UI[lang].rd[i]}</p></span><div><small>${doneN(i)}/${l.items.length} ${lang==="es"?"practicados":"practiced"}</small><div class="pb"><i style="width:${doneN(i)/l.items.length*100}%"></i></div></div></button>`).join("")}
function learn(){const G=$("#G");G.style.setProperty("--c",al=="V"?"var(--l0)":"var(--l3)");
 G.innerHTML=ALPHA[al].split(" ").map(x=>{const[j,r]=x.split(":"),k=J2K[j];return`<button class="g" data-j="${j}"><b>${j}</b><span>${r}</span><small>⌨ ${k==k.toUpperCase()?"⇧+":""}${k.toUpperCase()}</small></button>`}).join("");
 document.querySelectorAll("#seg button").forEach(b=>b.classList.toggle("on",b.dataset.a==al));
 $("#tips").innerHTML=UI[lang].tips.map(x=>`<li>${x}</li>`).join("")}
function paint(){document.documentElement.lang=lang;document.documentElement.dataset.theme=theme;
 document.querySelectorAll("[data-i]").forEach(e=>e.textContent=UI[lang][e.dataset.i]);
 $("#lang").textContent=lang.toUpperCase();$("#th").textContent=theme=="dark"?"☀️":"🌙";$("#ckb").checked=showKb;$("#crm").checked=showRom;tabs();learn();render()}
function lesson(){
 const level=DATA[lessonLevel],content=LESSONS[lessonLevel][lang],byId=new Map(DATA.flatMap(l=>l.items).map(x=>[x.id,x]));
 const e=$("#lesson");e.style.setProperty("--c",`var(--l${lessonLevel})`);
 e.innerHTML=`<p class="mu">${lang==="es"?"Introducción · lectura sin cronómetro":"Introduction · untimed reading"}</p><h2>${esc(content.title)}</h2>`+content.paragraphs.map(p=>`<p>${esc(p)}</p>`).join("")+`<h3>${lang==="es"?"Ejemplos para leer":"Examples to read"}</h3><ul class="examples">`+LESSONS[lessonLevel].examples.map(id=>{const x=byId.get(id);return `<li><strong>${esc(x.ko)}</strong><span>${esc(x[lang])}</span><div class="mu">${esc(x.roman)}</div><button class="ghost" data-audio="${x.id}">${UI[lang].listen}</button></li>`}).join("")+`</ul><p class="mu">${lang==="es"?"Escritura guiada, no evaluación de dominio. Fuentes y alcance en README.":"Guided typing, not a mastery assessment. Sources and scope in README."}</p><div class="bar"><button class="ghost" data-back>${lang==="es"?"← Volver a aprender":"← Back to learn"}</button><button class="cta" data-practice>${lang==="es"?"Practicar este nivel ▸":"Practice this level ▸"}</button></div>`;
}
function applyRoute(){
 clearTimeout(tm);const route=Navigation.parse(location.hash,DATA);view=route.view;lessonLevel=route.level;
 if(view==="practice"){
  const entry=Navigation.practiceEntry({loaded:!!S.it,level:S.lv,index:S.i,position:S.p,units:S.u.length},route.level,DATA[route.level].items.length);
  if(entry.action==="load"){S.lv=route.level;S.i=entry.index;load()}
 }
 for(const id of ["learn","lesson","practice"])$("#"+id).hidden=id!==view;
 document.querySelectorAll(".pill button").forEach(b=>{const active=b.dataset.t===(view==="lesson"?"learn":view);b.classList.toggle("on",active);b.setAttribute("aria-pressed",String(active))});
 if(view==="lesson"){lesson();$("#lesson").focus()}
 if(view==="practice")$("#stage").focus()
 tabs();scrollTo(0,0);
}
function go(t,l=S.lv){const hash=Navigation.hash(t,l,DATA);if(location.hash===hash)applyRoute();else location.hash=hash}
const pick=l=>go("lesson",+l);
$("#kb").innerHTML=ROWS.map((r,ri)=>`<div class="r">${ri==2?'<button type="button" class="k" data-k="⇧" aria-label="Shift" aria-pressed="false">⇧</button>':""}${[...r[0]].map((c,i)=>`<button type="button" class="k ${VW.includes(r[1][i])?"v":"c"}" data-k="${c}" aria-label="${r[1][i]} · ${c.toUpperCase()}">${r[1][i]}${SH[c.toUpperCase()]?`<sub>${SH[c.toUpperCase()]}</sub>`:""}<small>${c.toUpperCase()}</small></button>`).join("")}</div>`).join("");
$("#kb").onclick=e=>{const k=e.target.closest(".k");if(!k)return;if(k.dataset.k=="⇧"){S.sh=!S.sh;k.classList.toggle("fl",S.sh);k.setAttribute("aria-pressed",String(S.sh))}else press(k.dataset.k)};
document.querySelector(".pill").onclick=e=>e.target.dataset.t&&go(e.target.dataset.t);
$("#lv").onclick=e=>{const b=e.target.closest("button");if(b)go("practice",+b.dataset.l)};
$("#road").onclick=e=>{const b=e.target.closest("button");b&&pick(b.dataset.l)};
$("#go").onclick=()=>pick(0);
$("#seg").onclick=e=>{const a=e.target.closest("button")?.dataset.a;if(a){al=a;learn()}};
$("#G").onclick=e=>{const b=e.target.closest("button");if(!b)return;speak(b.dataset.j);b.classList.remove("pop");void b.offsetWidth;b.classList.add("pop")};
$("#syl").onclick=()=>{const s=$("#syl");s.classList.remove("go");void s.offsetWidth;s.classList.add("go");speak("한")};
$("#lang").onclick=()=>{lang=lang=="es"?"en":"es";sv("lang",lang);paint();if(view==="lesson")lesson()};
$("#th").onclick=()=>{theme=theme=="dark"?"light":"dark";sv("theme",theme);paint()};
$("#ckb").onchange=e=>{showKb=e.target.checked;sv("kb",+showKb);render()};
$("#crm").onchange=e=>{showRom=e.target.checked;sv("rom",+showRom);render()};
$("#stage").onclick=e=>{if(!e.target.closest("button,input,label"))$("#stage").focus()};
$("#nx").onclick=()=>{next();$("#stage").focus()};$("#sp").onclick=()=>speak(S.it.ko);
addEventListener("keydown",e=>{if(!Navigation.capturesKey(e,view))return;e.preventDefault();
 let l=e.code[3].toLowerCase();if(e.shiftKey&&SH[l.toUpperCase()])l=l.toUpperCase();press(l)});

$("#lesson").onclick=e=>{const b=e.target.closest("button");if(!b)return;if(b.hasAttribute("data-back"))go("learn");if(b.hasAttribute("data-practice"))go("practice",lessonLevel);if(b.dataset.audio){const x=DATA.flatMap(l=>l.items).find(x=>x.id===b.dataset.audio);if(x)speak(x.ko)}};
addEventListener("hashchange",applyRoute);paint();applyRoute();
})();
