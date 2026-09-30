(function(){
"use strict";
const C=window.CONTENT,R=C.R,yt=C.yt;
const TP={};(window.TOPICS||[]).forEach(t=>{if(t.more&&TP[t.id]){["quiz","code","terms","ex"].forEach(k=>{if(t.more[k])TP[t.id][k]=(TP[t.id][k]||[]).concat(t.more[k])})}else TP[t.id]=t});const T=Object.values(TP);
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const KEY="pw_data",SALT="pw-plan:",HASH="99e23ea9001b10f2f0862b4cfa5b9cbde8b64868bb5b0a84828338985e7a4ac7";
const AREAS={html:"🧱 HTML",css:"🎨 CSS",js:"⚡ JavaScript",tools:"🧰 Herramientas",net:"🌐 Redes",sec:"🛡️ Seguridad",ia:"🤖 IA"};

/* ---------- datos del usuario (nunca dependen del contenido: se enlazan por IDs estables) ---------- */
let D;
function mig(d){d=d&&typeof d=="object"?d:{};d.v=d.v||1;d.start=d.start||"2026-09-30";
 ["checks","hours","mast","quiz","cards","ex","done","exam","games"].forEach(k=>{if(!d[k]||typeof d[k]!="object"||Array.isArray(d[k]))d[k]={}});
 if(!Array.isArray(d.notes))d.notes=[];d.theme=d.theme||"auto";return d}
try{D=mig(JSON.parse(localStorage.getItem(KEY)))}catch(e){D=mig(null)}
function toast(m){const t=$("#toast");t.textContent=m;t.className="show";setTimeout(()=>{t.className=""},2600)}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){toast("⚠️ No pude guardar (¿modo privado o disco lleno?)")}};

/* ---------- plan ---------- */
const P=s=>{const[a,b,c]=s.split("|");return{t:a,k:(b||"").split(" ").filter(Boolean),y:c||""}};
const days=[];C.W.forEach((w,wi)=>{w.id=w.id||"w"+wi;w.d.forEach((e,i)=>days.push({id:w.id+"."+i,w,wi,i,n:days.length,hrs:w.h[i],sum:!!w.s&&i<6,rest:!!w.s&&i==6,b:e.split(";;").map(P)}))});
const base=()=>{const d=new Date(D.start+"T00:00:00");return isNaN(d)?new Date("2026-09-30T00:00:00"):d};
const dOf=i=>{const d=base();d.setDate(d.getDate()+i);return d};
const iso=d=>{const z=n=>String(n).padStart(2,"0");return d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate())};
const today=()=>{const d=new Date();d.setHours(0,0,0,0);return d};
const tIdx=()=>Math.round((today()-base())/864e5);
const fmt=d=>d.toLocaleDateString("es-UY",{weekday:"long",day:"numeric",month:"short"});
const nb=d=>d.rest?0:d.b.length+(d.sum?1:0);
const dn=d=>{let c=0;d.b.forEach((_,j)=>{if(D.checks[d.id+"."+j])c++});if(d.sum&&D.checks[d.id+".x"])c++;return c};
const lg=d=>+D.hours[d.id]||0;
function stats(){let tb=0,db=0,ph=0,lh=0;days.forEach(d=>{tb+=nb(d);db+=dn(d);ph+=d.hrs;lh+=lg(d)});return{tb,db,ph,lh,pct:tb?Math.round(db/tb*100):0,rem:Math.max(0,ph-lh)}}
function streak(){let s=0;for(let i=Math.min(tIdx(),days.length-1);i>=0;i--){const d=days[i];if(d.rest)continue;if(dn(d)>0||lg(d)>0)s++;else if(i==tIdx())continue;else break}return s}
const lk=b=>b.k.map(k=>R[k]?`<a href="${R[k][1]}" target="_blank" rel="noopener">${esc(R[k][0])}</a>`:"").join("")+(b.y?`<a href="${yt(b.y)}" target="_blank" rel="noopener">▶ videos (YouTube)</a>`:"");
function card(d,cur){
 const lab=d.sum?["💻 Web · 3,5 h","🛡️ Seguridad · 2,5 h"]:["📌 Tarea principal","🛡️/🤖 Segundo bloque"];
 let h=`<div class="card${cur?" cur":""}" id="d-${d.id}"><div class="row"><b>Día ${d.n+1} · ${fmt(dOf(d.n))}</b><span class="mut">${d.hrs?"≈ "+d.hrs+" h":"descanso"} · ${esc(d.w.n)}</span></div>`;
 if(d.rest)return h+`<p>😴 ${esc(d.b[0].t)}</p></div>`;
 d.b.forEach((b,j)=>{const k=d.id+"."+j;h+=`<div class="blk"><label><input type="checkbox" data-c="${k}"${D.checks[k]?" checked":""}><span><b>${lab[j]||""}</b> ${esc(b.t)}</span></label><div class="lk">${lk(b)}</div></div>`});
 if(d.sum){const k=d.id+".x";h+=`<div class="blk"><label><input type="checkbox" data-c="${k}"${D.checks[k]?" checked":""}><span><b>🤖 IA + repaso · 1 h</b> Anki/tarjetas de Repaso, cuaderno y un quiz de 5 preguntas hecho por la IA sobre lo de hoy</span></label></div>`}
 const m=D.mast[d.id]||"";
 return h+`<div class="row mut" style="margin-top:6px"><label>Horas reales: <input class="num" type="number" min="0" max="16" step="0.5" data-h="${d.id}" value="${D.hours[d.id]??""}"></label><label>¿Lo dominé? <select data-m="${d.id}"><option value="">—</option><option value="ok"${m=="ok"?" selected":""}>✅ Sí, avanzo</option><option value="rep"${m=="rep"?" selected":""}>🔁 Me falta, repito</option></select></label></div><div class="mut" style="margin-top:6px">🎯 Meta de la semana: ${esc(d.w.k)}</div></div>`}
const stat=(l,v)=>`<div class="st"><div class="v">${v}</div><div class="mut">${l}</div></div>`;

/* ---------- cursos, tarjetas, quiz ---------- */
const cardMap={};T.forEach(t=>(t.terms||[]).forEach(x=>{cardMap[t.id+":"+x[0]]={f:x[0],b:x[1],t:t.title}}));
const dueCards=()=>Object.keys(cardMap).filter(k=>{const c=D.cards[k];return !c||c.due<=iso(today())});
const passedEx=()=>C.sectors.filter(s=>(D.exam[s.id]||[]).some(x=>x.s/x.n>=.7)).length;
const lastQ=id=>{const a=D.quiz[id]||[];return a[a.length-1]};
const avgQ=()=>{const v=T.map(t=>lastQ(t.id)).filter(Boolean).map(x=>x.s/x.n);return v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length*100)+"%":"—"};
const tl=t=>(t.links||"").split(" ").filter(Boolean).map(k=>R[k]?`<a href="${R[k][1]}" target="_blank" rel="noopener">${esc(R[k][0])}</a>`:"").join("")+(t.yt?`<a href="${yt(t.yt)}" target="_blank" rel="noopener">▶ Videos (YouTube)</a>`:"");
let RV={q:null,sh:false};const OP=new Set();

function vHome(){
 const s=stats(),i=tIdx(),due=dueCards().length;
 let h=`<h1>Hola 👋 ¿qué toca hoy?</h1><div class="grid">${stat("Progreso",s.pct+" %")}${stat("Horas hechas",s.lh+" h")}${stat("Horas restantes",s.rem+" h")}${stat("Racha",streak()+" días")}${stat("Tarjetas por repasar",due)}${stat("Promedio quizzes",avgQ())}${stat("Pruebas grandes",passedEx()+"/"+C.sectors.filter(s=>s.t.some(i=>TP[i])).length)}${window.LAB?LAB.stat():""}</div><div class="bar"><i style="width:${s.pct}%"></i></div>`;
 const le=D.lastExport;if(!le||Date.now()-le>6048e5)h+=`<div class="card">💾 Hace tiempo que no descargas una copia de tus datos. <a href="#/ajustes">Hazlo en Ajustes</a>.</div>`;
 if(due)h+=`<div class="card">🧠 Tienes <b>${due}</b> tarjetas para repasar hoy → <a href="#/repaso">ir a Repaso</a></div>`;
 h+=`<h2>🎯 Hoy</h2>`;
 if(i<0)h+=`<div class="card">Tu plan empieza el ${fmt(base())}. Prepara VS Code y tu cuaderno.</div>`;
 else if(i>=days.length)h+=`<div class="card">🏁 Completaste el plan. Repasa tus metas y planifica lo siguiente.</div>`;
 else{h+=card(days[i],true);if(days[i+1])h+=`<details><summary>Ver mañana</summary>${card(days[i+1])}</details>`;
  h+=`<div class="row"><button data-act="late">⏸ Me atrasé: repetir hoy (desplaza el calendario 1 día)</button></div>`}
 return h+`<div class="card"><b>¿Cómo sé si dominé el tema?</b> (1) Lo hago sin mirar. (2) Lo explico con mis palabras. (3) Resuelvo 3 ejercicios nuevos. <b>3 de 3:</b> avanzo. <b>1-2:</b> mañana empiezo con 1 h de repaso. <b>0:</b> cambio de recurso o le pido a la IA que me lo explique con ejemplos, sin darme la solución. Reglas: bloques de 25-50 min, 60-75 % práctica, dormir 8-9 h, practicar solo en laboratorios o con permiso.</div>`}

function vPlan(a){
 if(a){const d=days.find(x=>x.id==a);if(d)OP.add(d.w.id)}
 const ti=tIdx(),cw=days[ti]?days[ti].w.id:null;
 let h=`<h1>🗓️ Plan completo</h1><p class="mut">Primero 9 semanas con clases; después 13 semanas de verano con 7 h por día. Fecha de inicio: ${fmt(base())} (cámbiala en Ajustes).</p>`;
 C.W.forEach((w,wi)=>{const ds=days.filter(d=>d.wi==wi);let tb=0,db=0,ph=0,lh=0;ds.forEach(d=>{tb+=nb(d);db+=dn(d);ph+=d.hrs;lh+=lg(d)});
  h+=`<details data-w="${w.id}"${OP.has(w.id)||w.id==cw?" open":""}><summary>${esc(w.n)} <span class="mut">· ${db}/${tb} bloques · ${lh}/${ph} h</span></summary><div class="bar"><i style="width:${tb?db/tb*100:0}%"></i></div><p class="mut">🎯 ${esc(w.k)}</p>${ds.map(d=>card(d,d.n==ti)).join("")}</details>`});
 return h}

const grid=ts=>`<div class="grid">`+ts.map(t=>{const q=lastQ(t.id),ex=(t.ex||[]).filter((_,i)=>D.ex[t.id+":"+i]).length;return `<a class="card" style="text-decoration:none;color:inherit" href="#/cursos/${t.id}"><b>${D.done[t.id]?"✅ ":""}${esc(t.title)}</b><div class="mut">${t.hrs?"≈ "+t.hrs+" h · ":""}Quiz: ${q?Math.round(q.s/q.n*100)+" %":"—"} · Ejercicios ${ex}/${(t.ex||[]).length}</div></a>`}).join("")+`</div>`;
function vCourses(){
 let h=`<h1>📖 Cursos</h1><p class="mut">Cada tema es un mini curso: recursos, glosario, mini prueba y ejercicios. Al terminar un sector, haz su <a href="#/retos">prueba grande</a>.</p>`;const seen={};
 C.sectors.forEach(s=>{const ts=s.t.map(i=>TP[i]).filter(Boolean);if(!ts.length)return;ts.forEach(x=>{seen[x.id]=1});h+=`<h2>${s.ic} ${s.n}</h2>`+grid(ts)});
 const o=T.filter(x=>!seen[x.id]);if(o.length)h+=`<h2>Otros</h2>`+grid(o);return h}

function vTopic(id){
 const t=TP[id];if(!t)return `<div class="card">Tema no encontrado. <a href="#/cursos">Volver</a></div>`;
 let h=`<p><a href="#/cursos">← Cursos</a></p><h1>${esc(t.title)}</h1><p class="mut">${AREAS[t.area]||""}${t.hrs?" · ≈ "+t.hrs+" h":""}</p><p>${esc(t.summary||"")}</p>
 <label><input type="checkbox" data-done="${t.id}"${D.done[t.id]?" checked":""}> Tema estudiado</label>
 <h2>🔗 Recursos gratuitos</h2><div class="card"><div class="lk" style="margin:0">${tl(t)}</div></div>`;
 if(t.terms&&t.terms.length)h+=`<h2>📚 Glosario (se convierte en tarjetas de Repaso)</h2>`+t.terms.map(x=>`<div class="card"><b>${esc(x[0])}</b><br>${esc(x[1])}</div>`).join("");
 h+=`<h2>❓ Mini prueba</h2>`;
 if(G&&G.kind=="topic"&&G.key==id)h+=runUI();
 else{const a=D.quiz[id]||[];h+=`<div class="card">${t.quiz&&t.quiz.length?`<button class="p" data-act="quiz" data-t="${id}">Empezar (${t.quiz.length} preguntas)</button>${t.code&&t.code.length?` <button data-act="codetopic" data-t="${id}">💻 Completa el código</button>`:""}`:"Aún no hay preguntas para este tema."}${a.length?`<p class="mut">Intentos: ${a.slice(-5).map(x=>x.d+" → "+x.s+"/"+x.n).join(" · ")}</p>`:""}</div>`}
 if(t.ex&&t.ex.length)h+=`<h2>🛠️ Ejercicios prácticos</h2><div class="card">`+t.ex.map((e,i)=>`<div class="blk"><label><input type="checkbox" data-x="${t.id}:${i}"${D.ex[t.id+":"+i]?" checked":""}><span>${esc(e)}</span></label></div>`).join("")+`</div>`;
 return h}
let G=null,M=null,A=null;
const mk=(q,c)=>({q:q[0],c,o:shuf(q[1].map((x,k)=>({x,ok:k==q[2]}))),e:q[3]});
const tItems=(ids,code)=>{const r=[];ids.forEach(i=>{const t=TP[i];if(!t)return;(t.quiz||[]).forEach(q=>r.push(mk(q,0)));if(code!==0)(t.code||[]).forEach(q=>r.push(mk(q,1)))});return r};
function endRun(){if(G&&G.iv)clearInterval(G.iv);G=M=A=null}
function startRun(o){endRun();G=Object.assign({i:0,s:0,a:null,fin:0},o);if(o.time){G.end=Date.now()+o.time*1e3;G.iv=setInterval(()=>{const l=Math.max(0,Math.ceil((G.end-Date.now())/1e3)),e=$("#tl");if(e)e.textContent="⏱ "+l+" s";if(!l){clearInterval(G.iv);finish();route(true)}},500)}route(true)}
function finish(){if(!G||G.fin)return;G.fin=1;const r={d:iso(today()),s:G.s,n:G.its.length};
 if(G.kind=="topic")(D.quiz[G.key]=D.quiz[G.key]||[]).push(r);else if(G.kind=="exam")(D.exam[G.key]=D.exam[G.key]||[]).push(r);else D.games[G.key]=Math.max(D.games[G.key]||0,G.s);save();if(window.LAB)LAB.fin(G)}
function startTopic(id){const its=shuf(tItems([id],0));startRun({kind:"topic",key:id,title:"❓ "+TP[id].title,its,re:()=>startTopic(id)})}
function startTopicCode(id){const its=shuf((TP[id].code||[]).map(q=>mk(q,1)));startRun({kind:"topic",key:id,title:"💻 Código: "+TP[id].title,its,re:()=>startTopicCode(id)})}
function startExam(sid){const s=C.sectors.find(x=>x.id==sid),its=shuf(tItems(s.t)).slice(0,12);if(its.length<3){toast("Este sector aún tiene pocas preguntas");return}startRun({kind:"exam",key:sid,title:"🏆 Prueba grande: "+s.n,its,re:()=>startExam(sid)})}
function startRel(){const ids=T.map(x=>x.id),its=shuf(tItems(ids)).concat(shuf(tItems(ids)));startRun({kind:"game",key:"rel",time:60,title:"⚡ Relámpago",its,re:startRel})}
function startCodeGame(){const its=shuf(tItems(T.map(x=>x.id)).filter(x=>x.c)).slice(0,10);if(its.length<3){toast("Aún hay pocos ejercicios de código");return}startRun({kind:"game",key:"cod",title:"💻 Completa el código",its,re:startCodeGame})}
const qh=q=>q.c?`<p><b>Completa el código:</b></p><pre style="overflow:auto;background:var(--bg);border:1px solid var(--bd);padding:10px;border-radius:9px">${esc(q.q)}</pre>`:`<p><b>${esc(q.q)}</b></p>`;
function runUI(){
 if(G.fin){const n=G.its.length,p=Math.round(G.s/n*100),ok=p>=70,btn=`<button class="p" data-act="again">Repetir</button> <button data-act="qend">Cerrar</button>`;
  if(G.time)return `<div class="card"><div class="big">⚡ ${G.s} puntos</div><p class="mut">Tu mejor marca: ${D.games[G.key]}</p>${btn}</div>`;
  return `<div class="card"><div class="big">${ok?"🎉":"💪"} ${G.s}/${n} (${p} %)</div><p>${G.kind=="exam"?(ok?"✅ Prueba aprobada: puedes pasar al siguiente sector.":"Aún no llegas al 70 %. Repasa el glosario y los recursos del sector y vuelve a intentarlo mañana."):p>=80?"Lo dominas: avanza.":p>=50?"Casi. Repasa el glosario y repite en unos días.":"Vuelve a mirar los recursos y repite mañana."}</p>${btn}</div>`}
 const q=G.its[G.i];
 return `<div class="card"><div class="row"><b>${esc(G.title)}</b><span class="mut">${G.time?`<span id="tl">⏱ ${Math.max(0,Math.ceil((G.end-Date.now())/1e3))} s</span> · Puntos ${G.s}`:"Pregunta "+(G.i+1)+" de "+G.its.length}</span></div>${qh(q)}${q.o.map((o,k)=>`<button class="opt${G.a!=null?(o.ok?" ok":k==G.a?" bad":""):""}" data-act="ans" data-k="${k}"${G.a!=null?" disabled":""}>${esc(o.x)}</button>`).join("")}${G.a!=null?`<p>${q.o[G.a].ok?"✅ Correcto.":"❌ Incorrecto."} ${esc(q.e||"")}</p><button class="p" data-act="next">${G.i+1<G.its.length?"Siguiente":"Ver resultado"}</button>`:""}</div>`}
function startMatch(){endRun();const ks=shuf(Object.keys(cardMap)).slice(0,6),cs=[];ks.forEach(k=>{cs.push({k,t:cardMap[k].f});cs.push({k,t:cardMap[k].b})});M={cs:shuf(cs),sel:[],ok:{},mv:0};route(true)}
function matchUI(){let h=`<p><button data-act="qend">← Retos</button> <span class="mut">Empareja cada término con su definición · Movimientos: ${M.mv}</span></p><div class="grid">`;
 M.cs.forEach((c,i)=>{const on=M.ok[i]||M.sel.includes(i);h+=`<button class="opt" style="${M.ok[i]?"opacity:.5;":""}min-height:74px;font-size:.85rem" data-act="mc" data-k="${i}"${M.ok[i]?" disabled":""}>${on?esc(c.t):"❓"}</button>`});h+=`</div>`;
 if(Object.keys(M.ok).length==M.cs.length){const b=D.games.match;if(!b||M.mv<b){D.games.match=M.mv;save()}h+=`<div class="card"><div class="big">🎉 ¡Completado en ${M.mv} movimientos!</div><p class="mut">Mejor marca: ${D.games.match}</p><button class="p" data-act="gm">Jugar otra vez</button></div>`}return h}
function startTerm(){endRun();A={its:shuf(Object.keys(cardMap)).slice(0,10),i:0,s:0,fb:null,h:0,v:""};route(true)}
function termUI(){if(A.i>=A.its.length){const b=D.games.term;if(!b||A.s>b){D.games.term=A.s;save()}return `<div class="card"><div class="big">🔤 ${A.s}/${A.its.length}</div><p class="mut">Mejor marca: ${D.games.term}</p><button class="p" data-act="gt">Otra vez</button> <button data-act="qend">Cerrar</button></div>`}
 const c=cardMap[A.its[A.i]];return `<p><button data-act="qend">← Retos</button> <span class="mut">Ronda ${A.i+1}/${A.its.length} · Puntos ${A.s}</span></p><div class="card"><p>¿Qué término es este?</p><p><b>${esc(c.b)}</b></p>${A.fb?`<p>${A.fb}</p><button class="p" data-act="tn">Siguiente</button>`:`<input id="ga" value="${esc(A.v)}" placeholder="Escribe el término" autocomplete="off" style="width:100%">${A.h?`<p class="mut">Pista: empieza con “${esc(c.f[0])}” y tiene ${c.f.length} letras</p>`:""}<div class="row" style="margin-top:8px"><button class="p" data-act="tg">Responder</button><button data-act="th2">💡 Pista</button></div>`}</div>`}
function vRetos(){
 if(G&&G.kind!="topic")return `<p><button data-act="qend">← Salir</button></p>`+runUI();
 if(M)return matchUI();if(A)return termUI();
 let h=`<h1>🎮 Retos</h1><h2>🏆 Pruebas grandes por sector</h2><p class="mut">Hasta 12 preguntas al azar del sector. Aprueba con 70 %. Hazlas al terminar cada sector del plan.</p><div class="grid">`;
 C.sectors.forEach(s=>{if(!s.t.some(i=>TP[i]))return;const ex=D.exam[s.id]||[],best=ex.reduce((a,x)=>Math.max(a,Math.round(x.s/x.n*100)),0);
  h+=`<div class="card"><b>${best>=70?"✅ ":""}${s.ic} ${s.n}</b><div class="mut">Mejor: ${ex.length?best+" %":"—"} · Intentos: ${ex.length}</div><button class="p" data-act="exam" data-s="${s.id}">Empezar prueba</button></div>`});
 const g=D.games;h+=`</div><h2>🎮 Mini juegos</h2><div class="grid">
 <div class="card"><b>⚡ Relámpago</b><div class="mut">60 segundos: responde todas las que puedas. Mejor: ${g.rel||0}</div><button class="p" data-act="rel">Jugar</button></div>
 <div class="card"><b>💻 Completa el código</b><div class="mut">10 fragmentos con un hueco. Mejor: ${g.cod||0}</div><button class="p" data-act="cod">Jugar</button></div>
 <div class="card"><b>🧩 Emparejar</b><div class="mut">Une términos con definiciones. Mejor: ${g.match?g.match+" mov.":"—"}</div><button class="p" data-act="gm">Jugar</button></div>
 <div class="card"><b>🔤 Adivina el término</b><div class="mut">Lee la definición y escribe el término. Mejor: ${g.term||0}/10</div><button class="p" data-act="gt">Jugar</button></div></div>`;return h}
function vTips(){let h=`<h1>💡 Consejos y páginas útiles</h1><p class="mut">También puedes encontrarlos con la barra de búsqueda de arriba.</p>`;
 (C.tips||[]).forEach(c=>{h+=`<details open><summary>${esc(c.c)}</summary>`+c.i.map(x=>`<div class="blk"><b>${x[2]?`<a href="${esc(x[2])}" target="_blank" rel="noopener">${esc(x[0])}</a>`:esc(x[0])}</b><div class="mut">${esc(x[1])}</div></div>`).join("")+`</details>`});return h}

function vReview(){
 if(!RV.q)RV.q=shuf(dueCards());
 const k=RV.q[0],tot=Object.keys(cardMap).length;
 let h=`<h1>🧠 Repaso espaciado</h1>`;
 if(!k)return h+`<div class="card"><div class="big">🎉 Sin pendientes hoy</div><p class="mut">Total de tarjetas: ${tot}. Las tarjetas vuelven a aparecer según qué tan bien las recuerdes (1, 3, 7, 14 y 30 días).</p></div>`;
 const c=cardMap[k];
 return h+`<p class="mut">Pendientes: ${RV.q.length} · ${esc(c.t)}</p><div class="card"><div class="big">${esc(c.f)}</div>${RV.sh?`<p style="text-align:center">${esc(c.b)}</p><div class="row" style="justify-content:center"><button data-act="rate" data-r="0">😕 Otra vez</button><button data-act="rate" data-r="1">🙂 Bien</button><button data-act="rate" data-r="2">😎 Fácil</button></div>`:`<div class="row" style="justify-content:center"><button class="p" data-act="show">Ver respuesta</button></div>`}</div><p class="mut">Antes de ver la respuesta, intenta decirla en voz alta o escribirla.</p>`}
function rate(r){const k=RV.q.shift();const c=D.cards[k]||{box:0};if(r==0)RV.q.push(k);else c.box=Math.min(5,c.box+r);const d=today();d.setDate(d.getDate()+(r==0?0:[0,1,3,7,14,30][c.box]));c.due=iso(d);if(r==0)c.box=0;D.cards[k]=c;RV.sh=false;save();route(true)}

function vNotes(){
 let h=`<h1>📝 Cuaderno de hallazgos</h1><p class="mut">Comandos, errores y conceptos nuevos: qué hace y cuándo se usa. Se puede buscar desde la barra de arriba.</p>
 <div class="card"><input id="nt" placeholder="Título (ej: grep -r)" style="width:100%;margin-bottom:6px"><textarea id="nx" placeholder="Qué hace, cuándo se usa, ejemplo…"></textarea><div class="row"><input id="ng" placeholder="Etiqueta (linux, css…)"><button class="p" data-act="addnote">Guardar nota</button></div></div>`;
 if(!D.notes.length)h+=`<p class="mut">Aún no tienes notas.</p>`;
 D.notes.slice().reverse().forEach(n=>{h+=`<div class="card"><div class="row"><b>${esc(n.t)}</b><span>${n.tag?`<span class="tag">${esc(n.tag)}</span> `:""}<span class="mut">${esc(n.d)}</span> <button class="d" data-act="delnote" data-id="${n.id}">🗑</button></span></div><div style="white-space:pre-wrap">${esc(n.x)}</div></div>`});
 return h}

function vProg(){
 const s=stats();
 let h=`<h1>📊 Progreso</h1><div class="grid">${stat("Bloques",s.db+"/"+s.tb)}${stat("Horas hechas",s.lh+" / "+s.ph)}${stat("Horas restantes",s.rem)}${stat("Temas estudiados",Object.keys(D.done).filter(k=>D.done[k]).length+"/"+T.length)}</div><h2>Por semana</h2><div class="card">`;
 C.W.forEach((w,wi)=>{const ds=days.filter(d=>d.wi==wi);let tb=0,db=0,ph=0,lh=0;ds.forEach(d=>{tb+=nb(d);db+=dn(d);ph+=d.hrs;lh+=lg(d)});
  h+=`<div class="mut">${esc(w.n)} · ${lh}/${ph} h</div><div class="bar"><i style="width:${tb?db/tb*100:0}%"></i></div>`});
 h+=`</div><h2>Quizzes</h2><div class="card">`;
 const qs=T.filter(t=>(D.quiz[t.id]||[]).length);h+=qs.length?qs.map(t=>`<div>${esc(t.title)}: ${D.quiz[t.id].slice(-4).map(x=>Math.round(x.s/x.n*100)+"%").join(" → ")}</div>`).join(""):`<span class="mut">Aún no hiciste ninguna mini prueba.</span>`;
 h+=`</div><h2>Días marcados 🔁 (a repasar)</h2><div class="card">`;
 const rp=days.filter(d=>D.mast[d.id]=="rep");h+=rp.length?rp.map(d=>`<div><a href="#/plan/${d.id}">Día ${d.n+1}</a> · ${esc(d.b[0].t)}</div>`).join(""):`<span class="mut">Ninguno.</span>`;
 return h+`</div><h2>🧭 Etapas, duración y trabajos posibles</h2>${C.stagesHTML||""}`}

function vSettings(){
 return `<h1>⚙️ Ajustes</h1>
 <div class="card"><b>Fecha de inicio del plan</b><br><input type="date" id="sd" value="${esc(D.start)}"> <span class="mut">Cambiarla desplaza todas las fechas; tus casillas se conservan.</span></div>
 <div class="card"><b>Tema</b><br><select id="tm"><option value="auto"${D.theme=="auto"?" selected":""}>Automático</option><option value="light"${D.theme=="light"?" selected":""}>Claro</option><option value="dark"${D.theme=="dark"?" selected":""}>Oscuro</option></select></div>
 <div class="card"><b>💾 Copia de seguridad</b><p class="mut">Última descarga: ${D.lastExport?new Date(D.lastExport).toLocaleString("es-UY"):"nunca"}. Tus datos viven solo en este navegador: descarga una copia cada semana y antes de cambiar de dispositivo, de usuario de GitHub o del nombre del repositorio.</p>
 <button class="p" data-act="export">⬇️ Descargar todos mis datos (.json)</button> <label class="mut"><input type="file" id="imp" accept=".json,application/json" hidden><button data-act="import">⬆️ Importar copia</button></label></div>
 <div class="card"><b>🔄 Cómo actualizar la página sin perder datos</b><ol><li>Tus datos están separados del contenido: se guardan en tu navegador con IDs fijos.</li><li>Cuando te entregue archivos nuevos, sube <b>solo esos archivos</b> al repositorio (los mismos nombres reemplazan a los viejos). Para agregar un tema nuevo se agrega un archivo <code>topics/tN.js</code>.</li><li>Espera 1-2 minutos a que GitHub Pages publique y recarga. La página evita usar archivos viejos en caché.</li></ol>Versión del contenido: <b>${esc(C.version)}</b> (${esc(C.updated||"")}) · Temas: ${T.length}</div>
 <div class="card"><b>🔒 Sobre la clave</b><p class="mut">La clave solo evita curiosos. Como la página está en GitHub, cualquier persona técnica puede leer los archivos. No pongas aquí datos privados ni uses esta clave en cuentas importantes.</p></div>
 <div class="card"><b>Zona peligrosa</b><br><button class="d" data-act="reset">Borrar todos mis datos</button></div>`}

/* ---------- búsqueda ---------- */
function index(){const r=[];
 T.forEach(t=>{r.push({o:1,k:"Curso",l:t.title,s:t.summary||"",h:"#/cursos/"+t.id,n:norm(t.title+" "+(t.summary||"")+" "+(AREAS[t.area]||""))});(t.terms||[]).forEach(x=>r.push({o:0,k:"Término",l:x[0],s:x[1],h:"#/cursos/"+t.id,n:norm(x[0]+" "+x[1])}))});
 days.forEach(d=>d.b.forEach(b=>r.push({o:2,k:"Plan",l:b.t,s:"Día "+(d.n+1)+" · "+d.w.n,h:"#/plan/"+d.id,n:norm(b.t+" "+d.w.n)})));
 D.notes.forEach(n=>r.push({o:1,k:"Nota",l:n.t,s:n.x.slice(0,90),h:"#/notas",n:norm(n.t+" "+n.x+" "+(n.tag||""))}));
 (C.tips||[]).forEach(c=>c.i.forEach(x=>r.push({o:2,k:"Consejo",l:x[0],s:x[1],h:x[2]||"#/consejos",ext:!!x[2],n:norm(x[0]+" "+x[1]+" "+c.c)})));
 Object.values(R).forEach(x=>r.push({o:3,k:"Recurso",l:x[0],s:x[1],h:x[1],ext:1,n:norm(x[0])}));return r}
function search(v){const b=$("#sr"),w=norm(v).split(/\s+/).filter(Boolean);
 if(!w.length||norm(v).length<2){b.hidden=true;return}
 const res=index().filter(x=>w.every(k=>x.n.includes(k))).sort((a,b)=>a.o-b.o).slice(0,20);
 b.innerHTML=res.map(x=>`<a href="${x.h}"${x.ext?' target="_blank" rel="noopener"':""}><b>${esc(x.l)}</b> <span class="tag">${x.k}</span><small>${esc(x.s.slice(0,110))}</small></a>`).join("")+`<a href="${yt(v)}" target="_blank" rel="noopener">▶ Buscar «${esc(v)}» en YouTube</a>`;b.hidden=false}

/* ---------- datos: exportar / importar ---------- */
function exp(){D.lastExport=Date.now();save();const b=new Blob([JSON.stringify(D,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="plan-datos-"+iso(today())+".json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500);toast("✅ Copia descargada")}
function imp(f){const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(!o||typeof o!="object"||typeof o.checks!="object")throw 0;if(!confirm("Esto reemplaza tus datos actuales por los del archivo. ¿Continuar?"))return;D=mig(o);save();theme();route();toast("✅ Datos importados")}catch(e){toast("❌ Archivo no válido")}};r.readAsText(f)}

/* ---------- router y eventos ---------- */
const NAV=[["inicio","🏠 Inicio"],["plan","🗓️ Plan"],["cursos","📖 Cursos"],["retos","🎮 Retos"],["lab","🧪 Laboratorio"],["repaso","🧠 Repaso"],["notas","📝 Notas"],["consejos","💡 Consejos"],["progreso","📊 Progreso"],["ajustes","⚙️ Ajustes"]];
function theme(){document.documentElement.dataset.theme=D.theme=="auto"?"":D.theme}
function route(keep){
 const y=window.scrollY,p=location.hash.replace(/^#\/?/,"").split("/"),v=p[0]||"inicio",a=p[1];
  const V={inicio:vHome,plan:()=>vPlan(a),cursos:()=>a?vTopic(a):vCourses(),retos:vRetos,lab:()=>window.LAB?LAB.view():"",consejos:vTips,repaso:vReview,notas:vNotes,progreso:vProg,ajustes:vSettings};
 $("#main").innerHTML=(V[v]||vHome)();if(window.LAB&&LAB.post)LAB.post();
 document.querySelectorAll("#nav a").forEach(x=>x.classList.toggle("on",x.dataset.n==(V[v]?v:"inicio")));
 if(keep)window.scrollTo(0,y);else if(v=="plan"&&a){const e=document.getElementById("d-"+a);if(e)e.scrollIntoView({block:"center"})}else window.scrollTo(0,0)}
function init(){
 theme();$("#nav").innerHTML=NAV.map(x=>`<a href="#/${x[0]}" data-n="${x[0]}">${x[1]}</a>`).join("");
 window.addEventListener("hashchange",()=>{endRun();RV.q=null;RV.sh=false;route()});route();
 $("#th").onclick=()=>{const dk=document.documentElement.dataset.theme=="dark"||(document.documentElement.dataset.theme==""&&matchMedia("(prefers-color-scheme:dark)").matches);D.theme=dk?"light":"dark";save();theme()};
 $("#q").addEventListener("input",e=>search(e.target.value));
 document.addEventListener("click",e=>{if(!e.target.closest(".sw"))$("#sr").hidden=true;if(e.target.closest("#sr a"))$("#sr").hidden=true;
  const b=e.target.closest("[data-act]");if(!b)return;const a=b.dataset.act;
  if(a=="quiz")startTopic(b.dataset.t);
  else if(a=="codetopic")startTopicCode(b.dataset.t);
  else if(a=="exam")startExam(b.dataset.s);
  else if(a=="rel")startRel();
  else if(a=="cod")startCodeGame();
  else if(a=="gm")startMatch();
  else if(a=="gt")startTerm();
  else if(a=="again"&&G&&G.re)G.re();
  else if(a=="ans"&&G&&G.a==null&&!G.fin){G.a=+b.dataset.k;if(G.its[G.i].o[G.a].ok)G.s++;route(true)}
  else if(a=="next"&&G){G.i++;G.a=null;if(G.i>=G.its.length)finish();route(true)}
  else if(a=="qend"){endRun();route(true)}
  else if(a=="mc"&&M&&M.sel.length<2){const k=+b.dataset.k;if(M.sel.includes(k))return;M.sel.push(k);if(M.sel.length==2){M.mv++;const[x,y]=M.sel;if(M.cs[x].k==M.cs[y].k&&M.cs[x].t!=M.cs[y].t){M.ok[x]=M.ok[y]=1;M.sel=[]}else setTimeout(()=>{if(M){M.sel=[];route(true)}},900)}route(true)}
  else if(a=="tg"&&A){const c=cardMap[A.its[A.i]],v=norm($("#ga").value.trim()),f=norm(c.f);if(v&&(v==f||v.includes(f)||(v.length>=4&&f.includes(v)))){A.s++;A.fb="✅ ¡Correcto! "+esc(c.f)}else A.fb="❌ Era: <b>"+esc(c.f)+"</b>";route(true)}
  else if(a=="th2"&&A){A.v=$("#ga").value;A.h=1;route(true)}
  else if(a=="tn"&&A){A.i++;A.fb=null;A.h=0;A.v="";route(true)}
  else if(a=="show"){RV.sh=true;route(true)}
  else if(a=="rate")rate(+b.dataset.r);
  else if(a=="addnote"){const t=$("#nt").value.trim(),x=$("#nx").value.trim();if(!t){toast("Escribe un título");return}D.notes.push({id:Date.now().toString(36),t,x,tag:$("#ng").value.trim(),d:iso(today())});save();route(true);toast("📝 Nota guardada")}
  else if(a=="delnote"){if(confirm("¿Borrar esta nota?")){D.notes=D.notes.filter(n=>n.id!=b.dataset.id);save();route(true)}}
  else if(a=="late"){const d=base();d.setDate(d.getDate()+1);D.start=iso(d);save();route(true);toast("Calendario desplazado 1 día")}
  else if(a=="export")exp();
  else if(a=="import")$("#imp").click();
  else if(a=="reset"){if(confirm("Se borrarán TODOS tus datos. ¿Descargaste una copia?")&&prompt("Escribe BORRAR para confirmar")=="BORRAR"){D=mig(null);save();route();toast("Datos borrados")}}});
 document.addEventListener("change",e=>{const t=e.target,d=t.dataset;
  if(d.c){if(t.checked){D.checks[d.c]=1;if(window.LAB)LAB.blk(d.c)}else delete D.checks[d.c]}
  else if(d.h){if(t.value==="")delete D.hours[d.h];else D.hours[d.h]=Math.max(0,Math.min(16,+t.value||0))}
  else if(d.m){if(t.value)D.mast[d.m]=t.value;else delete D.mast[d.m]}
  else if(d.x){if(t.checked)D.ex[d.x]=1;else delete D.ex[d.x]}
  else if(d.done){if(t.checked)D.done[d.done]=1;else delete D.done[d.done]}
  else if(t.id=="sd"&&t.value)D.start=t.value;
  else if(t.id=="tm"){D.theme=t.value;theme()}
  else if(t.id=="imp"){if(t.files[0])imp(t.files[0]);t.value="";return}
  else return;
  save();route(true)});
 document.addEventListener("toggle",e=>{const w=e.target.dataset&&e.target.dataset.w;if(w){if(e.target.open)OP.add(w);else OP.delete(w)}},true);
 document.addEventListener("keydown",e=>{if(e.key=="/"&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();$("#q").focus()}if(e.key=="Escape")$("#sr").hidden=true;if(e.key=="Enter"&&e.target.id=="ga"){const x=document.querySelector('[data-act="tg"]');if(x)x.click()}})}

window.PW={D:()=>D,save,route,toast,esc,iso,today,streak,shuf};
/* ---------- puerta de acceso ---------- */
async function sha(s){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(SALT+s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
function open(){$("#gate").hidden=true;$("#app").hidden=false;init()}
if(sessionStorage.getItem("pw_ok")==HASH||localStorage.getItem("pw_dev")==HASH)open();
else{let tries=0;$("#gf").onsubmit=async e=>{e.preventDefault();const er=$("#ge");
 if(!window.crypto||!crypto.subtle){er.textContent="Este navegador no puede verificar la clave aquí (abre la página por https).";return}
 if(await sha($("#gp").value)==HASH){sessionStorage.setItem("pw_ok",HASH);if($("#gr").checked)localStorage.setItem("pw_dev",HASH);open()}
 else{tries++;er.textContent="Clave incorrecta";$("#gp").value="";if(tries>=5){const b=$("#gf button");b.disabled=true;er.textContent="Demasiados intentos. Espera 30 s.";setTimeout(()=>{b.disabled=false;tries=0;er.textContent=""},3e4)}}}}
})();
