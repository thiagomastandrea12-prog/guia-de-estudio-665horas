(function(){
"use strict";
const P=window.PW,esc=P.esc,$=s=>document.querySelector(s),D=()=>P.D(),L=window.LAB={};
const lvl=x=>Math.floor(Math.sqrt(x/40))+1;
function E(){const d=D();d.xp=d.xp||0;d.coins=d.coins||0;["ach","lab","own","eq"].forEach(k=>{if(!d[k]||typeof d[k]!="object")d[k]={}});return d}
const cnt=(d,k)=>Object.keys(d.lab).filter(x=>x.indexOf("blk:")!=0&&(!k||x.startsWith(k+":"))).length;
const AC=[["a1","🌱","Primer reto resuelto",d=>cnt(d)>=1],["a2","🔟","10 retos resueltos",d=>cnt(d)>=10],["a3","🏅","30 retos resueltos",d=>cnt(d)>=30],["a4","🔥","Racha de 3 días",()=>P.streak()>=3],["a5","⚡","Racha de 7 días",()=>P.streak()>=7],["a6","🚀","Nivel 5",d=>lvl(d.xp)>=5],["a7","🎨","5 puzzles de CSS",d=>cnt(d,"css")>=5],["a8","🧠","5 retos de JavaScript",d=>cnt(d,"js")>=5],["a9","🛡️","5 casos de seguridad",d=>cnt(d,"hunt")+cnt(d,"term")>=5],["a10","🛍️","Primera compra",d=>Object.keys(d.own).length>0]];
function award(xp,c){const d=E(),a=lvl(d.xp);d.xp+=xp;d.coins+=c;if(lvl(d.xp)>a)P.toast("⬆️ ¡Nivel "+lvl(d.xp)+"! 🎉");AC.forEach(x=>{if(!d.ach[x[0]]&&x[3](d)){d.ach[x[0]]=1;d.coins+=20;P.toast("🏆 Logro: "+x[2]+" (+20 🪙)")}});P.save()}
L.blk=id=>{const d=E(),k="blk:"+id;if(!d.lab[k]){d.lab[k]=1;award(10,2)}};
L.fin=g=>{const s=g.s,n=g.its.length;award(g.kind=="exam"?s*8+(s/n>=.7?100:0):g.kind=="game"?s*2:s*5,g.kind=="exam"?20:5)};
function solve(k,xp){const d=E();if(d.lab[k])return true;d.lab[k]=1;const t=P.iso(P.today());d.q=d.q&&d.q.d==t?d.q:{d:t,n:0};d.q.n++;award(xp,8);if(d.q.n==3){d.coins+=30;P.save();P.toast("📅 ¡Misión diaria completa! +30 🪙")}return true}
const SH=[["c1","🎨","Acento esmeralda",60,"acc","#10b981"],["c2","🎨","Acento violeta",60,"acc","#8b5cf6"],["c3","🎨","Acento naranja",60,"acc","#f97316"],["c4","🎨","Acento rosa",80,"acc","#ec4899"],["v1","🦊","Avatar zorro",40,"av","🦊"],["v2","🤖","Avatar robot",80,"av","🤖"],["v3","🧙","Avatar mago",100,"av","🧙"],["v4","🐉","Avatar dragón",120,"av","🐉"],["t1","🏷️","Título: Hacker en formación",50,"ti","Hacker en formación"],["t2","🏷️","Título: Depurador nato",70,"ti","Depurador nato"],["t3","🏷️","Título: Dev de otro nivel",150,"ti","Dev de otro nivel"]];
L.apply=()=>{const d=E(),r=document.documentElement.style;if(d.eq.acc){r.setProperty("--acc",d.eq.acc);r.setProperty("--acc2","color-mix(in srgb,"+d.eq.acc+" 16%,var(--card))")}else{r.removeProperty("--acc");r.removeProperty("--acc2")}};
L.stat=()=>{const d=E();return `<div class="st"><div class="v">${esc(d.eq.av||"🙂")} Nv ${lvl(d.xp)}</div><div class="mut">${esc(d.eq.ti||"Aprendiz")} · ${d.xp} XP</div></div><div class="st"><div class="v">🪙 ${d.coins}</div><div class="mut">Monedas</div></div>`};

/* ---------- contenido ---------- */
const B3='<div class="caja"><i></i><i></i><i></i></div>',B6='<div class="caja"><i></i><i></i><i></i><i></i><i></i><i></i></div>';
const CSSL=[
["Activa Flexbox","Haz que .caja sea un contenedor flex: los cuadros deben quedar en fila.",B3,".caja {\n  \n}",[[".caja","cs.display=='flex'"]]],
["Centrar en horizontal","Con flex activo, centra los cuadros en el eje principal.",B3,".caja {\n  display: flex;\n  \n}",[[".caja","cs.justifyContent=='center'"]]],
["Centrar en vertical","Centra los cuadros en el eje transversal (la caja mide 200px).",B3,".caja {\n  display: flex;\n  height: 200px;\n  \n}",[[".caja","cs.alignItems=='center'"]]],
["Columna","Coloca los cuadros en columna.",B3,".caja {\n  display: flex;\n  \n}",[[".caja","cs.flexDirection=='column'"]]],
["Espacio entre","Primer cuadro pegado a la izquierda, último a la derecha, el resto repartido.",B3,".caja {\n  display: flex;\n  \n}",[[".caja","cs.justifyContent=='space-between'"]]],
["Gap","Deja 20px entre los cuadros con la propiedad gap.",B3,".caja {\n  display: flex;\n  \n}",[[".caja","cs.columnGap=='20px'"]]],
["Wrap","Los 6 cuadros no caben en 200px: haz que pasen a otra línea.",B6,".caja {\n  display: flex;\n  width: 200px;\n  \n}",[[".caja","cs.flexWrap=='wrap'"]]],
["Grid: 3 columnas","Crea un grid de 3 columnas iguales.",B6,".caja {\n  \n}",[[".caja","cs.display=='grid'&&cs.gridTemplateColumns.split(' ').length==3"]]],
["Grid: separación","Con el grid de 3 columnas, agrega 10px de separación (gap).",B6,".caja {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  \n}",[[".caja","cs.columnGap=='10px'&&cs.rowGap=='10px'"]]],
["Selector de clase","Pinta de rojo solo el párrafo con clase .aviso.",'<p>uno</p><p class="aviso">dos</p><p>tres</p>',"",[[".aviso","cs.color=='rgb(255, 0, 0)'"],["p:not(.aviso)","cs.color!='rgb(255, 0, 0)'"]]],
["Modelo de caja","A .tarjeta: ancho 300px, padding 20px, borde 2px sólido y box-sizing border-box.",'<div class="tarjeta">Hola</div>',".tarjeta {\n  \n}",[[".tarjeta","cs.paddingTop=='20px'&&cs.borderTopWidth=='2px'&&cs.boxSizing=='border-box'&&cs.width=='300px'"]]],
["Posicionar","Pon .badge en la esquina superior derecha de .caja (position absolute).",'<div class="caja"><b class="badge">1</b></div>',".caja {\n  \n}\n.badge {\n  \n}",[[".caja","cs.position=='relative'"],[".badge","cs.position=='absolute'&&cs.top=='0px'&&cs.right=='0px'"]]]];
const NIN=[
["Todos los elementos con clase x",'<ul><li id="a" class="x"></li><li id="b"></li><li id="c" class="x"></li></ul>',"a,c"],
["Solo el primer li",'<ul><li id="a"></li><li id="b"></li><li id="c"></li></ul>',"a"],
["Los p que son hijos directos de #m",'<div id="m"><p id="a"></p><div><p id="b"></p></div><p id="c"></p></div>',"a,c"],
["Los inputs de tipo text",'<form><input id="a" type="text"><input id="b" type="email"><input id="c" type="text"></form>',"a,c"],
["Todos los li excepto los de clase off",'<ul><li id="a"></li><li id="b" class="off"></li><li id="c"></li></ul>',"a,c"],
["El p que va justo después de un h2",'<h2></h2><p id="a"></p><p id="b"></p>',"a"],
["Los li pares (2º y 4º)",'<ul><li id="a"></li><li id="b"></li><li id="c"></li><li id="d"></li></ul>',"b,d"],
["Los enlaces cuyo href empieza por https",'<a id="a" href="https://x.com"></a><a id="b" href="http://x.com"></a><a id="c" href="https://y.com"></a>',"a,c"]];
const JSC=[["Suma","Devuelve la suma de a y b.","suma",[[[2,3],5],[[-1,1],0]]],["¿Es par?","Devuelve true si n es par.","esPar",[[[4],true],[[7],false],[[0],true]]],["Invertir texto","Devuelve el texto al revés.","invertir",[[["hola"],"aloh"],[[""],""]]],["Contar vocales","Cuenta las vocales (a e i o u) de un texto en minúsculas.","vocales",[[["hola mundo"],4],[["xyz"],0]]],["Máximo","Devuelve el mayor número de un array (sin Math.max).","maximo",[[[[3,9,2]],9],[[[-5,-2]],-2]]],["FizzBuzz","Para n: 'FizzBuzz' si es múltiplo de 3 y 5, 'Fizz' si de 3, 'Buzz' si de 5; si no, n.","fizz",[[[15],"FizzBuzz"],[[9],"Fizz"],[[10],"Buzz"],[[7],7]]],["Palíndromo","true si el texto se lee igual al revés (ignora mayúsculas).","palindromo",[[["Ana"],true],[["casa"],false]]],["Suma de pares","Suma solo los números pares de un array.","sumaPares",[[[[1,2,3,4]],6],[[[1,3]],0]]],["Únicos","Devuelve el array sin repetidos, en el mismo orden.","unicos",[[[[1,2,2,3,1]],[1,2,3]]]],["Capitalizar","Pon en mayúscula la primera letra de cada palabra.","capitalizar",[[["hola mundo"],"Hola Mundo"]]],["Fibonacci","Devuelve el n-ésimo Fibonacci (fib(0)=0, fib(1)=1).","fib",[[[0],0],[[1],1],[[10],55]]],["Contar palabras","Devuelve un objeto con cuántas veces aparece cada palabra.","contar",[[["a b a"],{a:2,b:1}]]]];
const FS={home:{user:{"notas.txt":"La bandera no está aquí. Prueba con ls -a",".oculto":"FLAG{ls-a-muestra-ocultos}",docs:{"a.txt":"nada interesante","b.txt":"tampoco","c.txt":"FLAG{grep-es-poderoso}"}}},var:{log:{"auth.log":"ok login user\nFailed password for root\nok login user\nFailed password for admin\nFailed password for root"}}};
const TM=[["Misión 1","Hay una bandera escondida en un archivo oculto de /home/user. Encuéntrala (ls -a) y léela (cat).","FLAG{ls-a-muestra-ocultos}"],["Misión 2","En /home/user/docs, averigua qué archivo contiene la palabra FLAG (grep -r) y entrega la bandera.","FLAG{grep-es-poderoso}"],["Misión 3","¿Cuántas líneas con “Failed” hay en /var/log/auth.log? Escribe solo el número.","3"]];
const HU=[
["Auditoría: consulta SQL","Marca la línea vulnerable.",['app.get("/user", (req, res) => {','  const name = req.query.name;','  const q = "SELECT * FROM users WHERE name=\'" + name + "\'";','  db.query(q, (err, rows) => res.json(rows));','});'],[2],"Concatenar la entrada en la consulta permite inyección SQL: usa consultas parametrizadas."],
["Auditoría: XSS","Marca la línea vulnerable.",["const params = new URLSearchParams(location.search);",'const nombre = params.get("nombre");','saludo.innerHTML = "Hola " + nombre;','document.title = "Bienvenido";'],[2],"innerHTML con datos del usuario puede ejecutar scripts (XSS): usa textContent."],
["Auditoría: secretos y contraseñas","Marca las 2 líneas con problemas.",['const express = require("express");','const API_KEY = "sk_live_51H8xYz";','app.post("/registro", (req, res) => {','  db.save({ user: req.body.user, password: req.body.password });','  res.send("ok");'],[1,3],"Hay una clave secreta escrita en el código y la contraseña se guarda sin hash (usa .env y bcrypt)."],
["Logs: fuerza bruta","Marca las líneas del atacante.",["10:01 login OK user=ana ip=192.168.0.10","10:02 login FAIL user=root ip=45.9.148.7","10:02 login FAIL user=admin ip=45.9.148.7","10:02 login FAIL user=test ip=45.9.148.7","10:03 login OK user=luis ip=192.168.0.22"],[1,2,3],"Muchos fallos seguidos desde una misma IP externa: fuerza bruta."],
["Logs web: peticiones raras","Marca las peticiones sospechosas.",["GET /index.html 200","GET /img/logo.png 200","GET /buscar?q=' OR 1=1-- 500","GET /../../etc/passwd 403","GET /contacto 200"],[2,3],"Intento de inyección SQL y de path traversal."],
["Triage de malware (laboratorio)","El análisis estático de una muestra mostró estos indicadores. Marca los sospechosos.",["Importa user32.dll: MessageBoxA","Cadena: 'Copyright 2019 Acme Soft'","Importa advapi32.dll: RegSetValueExA (clave Run)","Cadena: cmd.exe /c powershell -enc JAB...","Importa ws2_32.dll: connect + IP fija 185.0.0.9"],[2,3,4],"Persistencia (clave Run), PowerShell codificado y conexión a una IP fija forman un patrón. Un solo import no prueba nada."],
["Triage: programa normal","Indicadores de un editor de texto. Marca solo los sospechosos (puede que ninguno).",["Importa comdlg32.dll: GetOpenFileNameA","Cadena: 'Archivo | Guardar como…'","Importa kernel32.dll: CreateFileA","Cadena: https://ejemplo.com/ayuda"],[],"Ninguno: son funciones normales de abrir y guardar. Sospechar de todo también es un error."]];
const CATS=[["css","🎨 Puzzles de CSS (código real, como Flexbox Froggy)",CSSL],["nin","🎯 Selector Ninja",NIN],["js","⚡ Retos de JavaScript con pruebas",JSC],["term","💻 Terminal de Linux (laboratorio simulado)",TM],["hunt","🛡️ Caza de vulnerabilidades, logs y triage",HU]];

/* ---------- vistas ---------- */
let S={tab:"p",c:null,i:0,v:null,msg:"",t:null,sel:[]};
const doc=()=>{const x=CSSL[S.i];return `<style>body{margin:8px;font:14px sans-serif}i{display:block;width:36px;height:36px;background:#2563eb;margin:4px;border-radius:6px}.caja{border:2px dashed #999;min-height:60px}p{margin:4px 0}</style><style>${S.v??x[3]}</style>`+x[2]};
const jsStart=x=>`function ${x[2]}() {\n  \n}`;
function level(d){const arr=CATS.find(x=>x[0]==S.c)[2],x=arr[S.i];
 let h=`<p><button data-lab="back">← Volver</button> <span class="mut">${S.i+1}/${arr.length} ${d.lab[S.c+":"+S.i]?"· ✅ resuelto":""}</span></p><div class="card"><b>${esc(x[0])}</b>`;
 if(S.c=="css")h+=`<p>${esc(x[1])}</p><div class="row" style="align-items:stretch"><div style="flex:1 1 260px"><textarea id="lc" spellcheck="false" style="font-family:monospace;min-height:170px">${esc(S.v??x[3])}</textarea></div><iframe id="lf" style="flex:1 1 260px;min-height:200px;border:1px solid var(--bd);border-radius:9px;background:#fff"></iframe></div><div class="row" style="justify-content:flex-start"><button class="p" data-lab="run">▶ Comprobar</button><button data-lab="reset">↺ Reiniciar</button></div>`;
 else if(S.c=="nin")h+=`<p>${esc(x[0])}. Escribe un selector CSS.</p><pre style="overflow:auto;background:var(--bg);padding:10px;border-radius:9px">${esc(x[1])}</pre><input id="ns" value="${esc(S.v||"")}" placeholder="ej: .clase > p" style="width:100%;font-family:monospace"><br><br><button class="p" data-lab="run">▶ Comprobar</button>`;
 else if(S.c=="js")h+=`<p>${esc(x[1])}</p><textarea id="jc" spellcheck="false" style="font-family:monospace;min-height:150px">${esc(S.v??jsStart(x))}</textarea><div class="row" style="justify-content:flex-start;margin-top:6px"><button class="p" data-lab="run">▶ Ejecutar pruebas</button><button data-lab="reset">↺ Reiniciar</button></div><p class="mut">Tip: no uses bucles infinitos; la página se congelaría.</p>`;
 else if(S.c=="term")h+=`<p>${esc(x[1])}</p><div id="to" style="background:#0b0f14;color:#d1fae5;font:13px monospace;padding:10px;border-radius:9px;height:190px;overflow:auto;white-space:pre-wrap">${esc(S.t.out.join("\n")||"Comandos: ls [-a], cd, cat, pwd, grep [-r] texto ruta, help")}</div><input id="tin" placeholder="${"/"+S.t.cwd.join("/")}$ escribe un comando y Enter" autocomplete="off" style="width:100%;font-family:monospace;margin-top:6px"><div class="row" style="margin-top:8px;justify-content:flex-start"><input id="tans" placeholder="Tu respuesta / bandera"><button class="p" data-lab="run">Entregar</button></div>`;
 else h+=`<p>${esc(x[1])}</p>`+x[2].map((l,k)=>`<button class="opt" style="font-family:monospace;font-size:.85rem;${S.sel.includes(k)?"border-color:var(--acc);background:var(--acc2);":""}" data-lab="tog" data-k="${k}">${esc(l)}</button>`).join("")+`<button class="p" data-lab="run">▶ Comprobar</button>`;
 h+=`</div>`+(S.msg?`<div class="card">${S.msg}</div>`:"");
 if(d.lab[S.c+":"+S.i]&&S.i+1<arr.length)h+=`<button class="p" data-lab="next">Siguiente reto →</button>`;
 return h}
function shop(d){return `<h2>🛍️ Tienda (gasta tus monedas 🪙)</h2><div class="grid">`+SH.map(x=>{const own=d.own[x[0]],on=d.eq[x[4]]==x[5];return `<div class="card"><b>${x[1]} ${esc(x[2])}</b><div class="mut">${own?"Comprado":x[3]+" 🪙"}</div><button class="${own&&!on?"p":""}" data-lab="${own?"eq":"buy"}" data-id="${x[0]}">${own?(on?"Quitar":"Equipar"):"Comprar"}</button></div>`}).join("")+`</div><p class="mut">Gana monedas resolviendo retos, completando bloques del plan, aprobando pruebas y con la misión diaria.</p>`}
function ach(d){return `<h2>🏆 Logros</h2>`+AC.map(x=>`<div class="card">${d.ach[x[0]]?x[1]:"🔒"} <b>${x[2]}</b> <span class="mut">${d.ach[x[0]]?"· desbloqueado":"· +20 🪙 al lograrlo"}</span></div>`).join("")}
L.view=()=>{const d=E(),l=lvl(d.xp),cur=(l-1)*(l-1)*40,nx=l*l*40,pc=Math.round((d.xp-cur)/(nx-cur)*100),q=d.q&&d.q.d==P.iso(P.today())?d.q.n:0;
 let h=`<h1>🧪 Laboratorio</h1><div class="card"><div class="row"><b>${esc(d.eq.av||"🙂")} ${esc(d.eq.ti||"Aprendiz")} · Nivel ${l}</b><span>🪙 ${d.coins} · ${d.xp} XP · 🔥 ${P.streak()} días</span></div><div class="bar"><i style="width:${pc}%"></i></div><div class="mut">📅 Misión diaria: resuelve 3 retos nuevos (${Math.min(q,3)}/3) → +30 🪙</div></div><div class="row" style="justify-content:flex-start"><button data-lab="tab" data-v="p">🧪 Práctica</button><button data-lab="tab" data-v="s">🛍️ Tienda</button><button data-lab="tab" data-v="a">🏆 Logros</button></div>`;
 if(S.tab=="s")return h+shop(d);if(S.tab=="a")return h+ach(d);if(S.c)return h+level(d);
 CATS.forEach(([k,n,arr])=>{h+=`<h2>${n} <span class="mut">${arr.filter((_,i)=>d.lab[k+":"+i]).length}/${arr.length}</span></h2><div class="row" style="justify-content:flex-start">`+arr.map((x,i)=>`<button data-lab="open" data-c="${k}" data-i="${i}" title="${esc(x[0])}">${d.lab[k+":"+i]?"✅":i+1}</button>`).join("")+`</div>`});return h};
L.post=()=>{if(S.tab=="p"&&S.c=="css"){const f=$("#lf");if(f)f.srcdoc=doc()}const o=$("#to");if(o)o.scrollTop=1e9};

/* ---------- lógica ---------- */
function open(c,i){S={tab:"p",c,i,v:null,msg:"",t:c=="term"?{cwd:["home","user"],out:[]}:null,sel:[]};P.route(true)}
function walk(p,cw){const st=[];(p.startsWith("/")?p.slice(1).split("/"):cw.concat(p.split("/"))).forEach(x=>{if(!x||x==".")return;if(x=="..")st.pop();else st.push(x)});let n=FS;for(const x of st){if(n&&typeof n=="object"&&x in n)n=n[x];else return[null,st]}return[n,st]}
function cmd(s){const[a,...r]=s.trim().split(/\s+/),cw=S.t.cwd;
 if(a=="help")return "Comandos: ls [-a], cd, cat, pwd, grep [-r] texto ruta";if(a=="pwd")return "/"+cw.join("/");
 if(a=="ls"){const n=walk(r.find(x=>x[0]!="-")||".",cw)[0];if(!n||typeof n!="object")return "ls: no existe";return Object.keys(n).filter(k=>r.includes("-a")||k[0]!=".").map(k=>typeof n[k]=="object"?k+"/":k).join("  ")||"(vacío)"}
 if(a=="cd"){const[n,st]=walk(r[0]||"/",cw);if(n&&typeof n=="object"){S.t.cwd=st;return ""}return "cd: no existe"}
 if(a=="cat"){const n=walk(r[0]||"",cw)[0];return typeof n=="string"?n:"cat: no existe"}
 if(a=="grep"){const rec=r[0]=="-r",pat=r[rec?1:0],p=r[rec?2:1]||".",o=[];if(!pat)return "uso: grep [-r] texto ruta";(function w(n,q){if(typeof n=="string")n.split("\n").forEach(l=>{if(l.includes(pat))o.push(q+": "+l)});else if(n&&rec)Object.keys(n).forEach(k=>w(n[k],q+"/"+k))})(walk(p,cw)[0],p);return o.join("\n")||"(sin resultados)"}
 return a?a+": comando no encontrado (escribe help)":""}
function check(d){const k=S.c+":"+S.i,x=CATS.find(y=>y[0]==S.c)[2][S.i];let ok=false,m="";
 if(S.c=="css"){const dc=$("#lf").contentDocument,bad=[];x[4].forEach(([s,e])=>{const els=[...dc.querySelectorAll(s)];if(!els.length){bad.push(s);return}els.forEach(el=>{try{if(!new Function("cs","el","return "+e)(dc.defaultView.getComputedStyle(el),el))bad.push(s)}catch(_){bad.push(s)}})});ok=!bad.length;m=ok?"":"❌ Aún no: revisa "+bad.map(esc).join(", ")}
 else if(S.c=="nin"){const b=document.createElement("div");b.innerHTML=x[1];let r="";try{r=[...b.querySelectorAll(S.v||"*:not(*)")].map(e=>e.id).sort().join(",")}catch(_){m="❌ Selector no válido"}ok=r==x[2];if(!m&&!ok)m="❌ Tu selector elige: "+(r||"nada")+" · Debe elegir: "+x[2]}
 else if(S.c=="js"){try{const fn=new Function((S.v??jsStart(x))+"\nreturn "+x[2])();const res=x[3].map(([a,e])=>{let r;try{r=fn(...a)}catch(er){r="Error: "+er.message}return[a,r,e,JSON.stringify(r)===JSON.stringify(e)]});ok=res.every(y=>y[3]);m=res.map(y=>(y[3]?"✅ ":"❌ ")+esc(x[2]+"("+y[0].map(z=>JSON.stringify(z)).join(", ")+")")+" → "+esc(JSON.stringify(y[1]))+(y[3]?"":" (esperado "+esc(JSON.stringify(y[2]))+")")).join("<br>")}catch(er){m="❌ Error: "+esc(er.message)}}
 else if(S.c=="term"){const v=($("#tans").value||"").trim();ok=v==x[2];m=ok?"":"❌ Esa no es la respuesta. Sigue explorando."}
 else{const bad=x[3];ok=bad.length==S.sel.length&&bad.every(b=>S.sel.includes(b));m=ok?"":"❌ Revisa: "+(S.sel.length!=bad.length?"esperaba "+bad.length+" línea(s) sospechosa(s)":"alguna línea marcada no es la correcta")}
 if(ok){solve(k,S.c=="css"||S.c=="nin"?20:S.c=="js"?30:35);m="🎉 ¡Resuelto! "+(S.c=="hunt"?esc(x[4]):"")+(S.c=="js"?"<br>"+m:"")}
 S.msg=m;P.route(true)}
document.addEventListener("click",e=>{const b=e.target.closest("[data-lab]");if(!b)return;const a=b.dataset.lab,d=E();
 if(a=="tab"){S.tab=b.dataset.v;S.c=null;P.route(true)}
 else if(a=="open")open(b.dataset.c,+b.dataset.i);
 else if(a=="back"){S.c=null;P.route(true)}
 else if(a=="next")open(S.c,S.i+1);
 else if(a=="reset"){S.v=null;S.msg="";P.route(true)}
 else if(a=="tog"){const k=+b.dataset.k,j=S.sel.indexOf(k);if(j<0)S.sel.push(k);else S.sel.splice(j,1);P.route(true)}
 else if(a=="run")check(d);
 else if(a=="buy"){const x=SH.find(y=>y[0]==b.dataset.id);if(d.coins>=x[3]){d.coins-=x[3];d.own[x[0]]=1;award(0,0);P.toast("🛍️ ¡Comprado!")}else P.toast("Te faltan monedas 🪙");P.route(true)}
 else if(a=="eq"){const x=SH.find(y=>y[0]==b.dataset.id);if(d.eq[x[4]]==x[5])delete d.eq[x[4]];else d.eq[x[4]]=x[5];P.save();L.apply();P.route(true)}});
document.addEventListener("input",e=>{const t=e.target;if(t.id=="lc"){S.v=t.value;const f=$("#lf");if(f)f.srcdoc=doc()}else if(t.id=="ns"||t.id=="jc")S.v=t.value});
document.addEventListener("keydown",e=>{if(e.key=="Enter"&&e.target.id=="tin"){const v=e.target.value;S.t.out.push("$ "+v);const o=cmd(v);if(o)S.t.out.push(o);P.route(true);const i=$("#tin");if(i)i.focus()}});
L.apply();if(!document.getElementById("app").hidden)P.route(true);
})();
