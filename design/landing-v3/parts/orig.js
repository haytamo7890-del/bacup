const BANK=JSON.parse(document.getElementById("bank").textContent);
const RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
const $=id=>document.getElementById(id);
const LOGO=document.querySelector("#logo path").getAttribute("d");
const PARTS=(()=>{const s=LOGO.split(/(?=M)/).map(x=>x.trim()).filter(Boolean);return{body:s[0],cap:s[1],tassel:s[2]};})();
let uid=0;
function laureat(){const id="l"+(uid++);return`<svg class="lau" viewBox="0 0 613 533" aria-hidden="true"><defs><linearGradient id="g${id}" x1="0" x2="1"><stop offset="0" stop-color="#0DB8D3" stop-opacity="0"/><stop offset=".44" stop-color="#0DB8D3" stop-opacity="0"/><stop offset=".5" stop-color="#0DB8D3" stop-opacity=".95"/><stop offset=".56" stop-color="#1B7FDC" stop-opacity=".85"/><stop offset=".62" stop-color="#1B7FDC" stop-opacity="0"/></linearGradient><clipPath id="c${id}"><path d="${PARTS.body}"/><path d="${PARTS.cap}"/><path d="${PARTS.tassel}"/></clipPath></defs><g class="lau-body"><path fill="currentColor" fill-rule="evenodd" d="${PARTS.body}"/></g><g class="lau-tassel"><path fill="currentColor" d="${PARTS.tassel}"/></g><g class="lau-cap"><path fill="currentColor" d="${PARTS.cap}"/></g><g clip-path="url(#c${id})"><rect class="lau-glint" width="613" height="533" fill="url(#g${id})"/></g></svg>`;}
function talk(el){el.classList.remove("talk");void el.offsetWidth;el.classList.add("talk");setTimeout(()=>el.classList.remove("talk"),1300);}

/* countdown, estimated until the official calendar */
const J=(()=>{const t=new Date(2027,5,1),n=new Date();n.setHours(0,0,0,0);return Math.max(0,Math.round((t-n)/864e5));})();
document.querySelectorAll(".jd").forEach(e=>e.textContent="J-"+J);
document.querySelectorAll("#h1 .w").forEach((w,i)=>w.style.animationDelay=(.06+i*.055)+"s");
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{const el=$(b.dataset.go);if(el)el.scrollIntoView({behavior:RM?"auto":"smooth"});});

function esc(s){return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function tex(src){if(!src)return"";return src.split(/(\$[^$]+\$)/g).map(p=>{if(p.length>2&&p[0]==="$"&&p.endsWith("$")){try{if(window.katex)return katex.renderToString(p.slice(1,-1),{output:"mathml",throwOnError:false});}catch(e){}return"<code>"+esc(p.slice(1,-1))+"</code>";}return esc(p).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>");}).join("");}
const ico=(id,cls="i")=>`<svg class="${cls}"><use href="#${id}"/></svg>`;


/* course books (real covers, PC filière) */
const BOOKS=[["maths","Mathématiques","Coeff. 7","6 chapitres","#E2671A","#FFC79E",38],["pc","Physique-Chimie","Coeff. 7","29 chapitres","#5B3FD1","#B9A8FF",22],["svt","SVT","Coeff. 5","10 chapitres","#0F9C6E","#9FF0CF",30],["philo","Philosophie","Coeff. 2","13 chapitres","#4F55D8","#B8BCFF",12],["anglais","Anglais","Coeff. 2","15 chapitres","#D93C67","#FFB3C6",18]];
$("shelf").innerHTML=BOOKS.map((b,i)=>`<div style="--c1:${b[4]};--hi:${b[5]};--i:${i}"><div class="sb-b3d"><div class="sb-front"><span class="sb-glow"></span><span class="sb-spine"></span></div><div class="sb-title"><span class="sb-name">${b[1]}</span><small>${b[2]} · ${b[3]}</small></div><svg class="sb-glyph" viewBox="0 0 24 24"><use href="#g-${b[0]}"/></svg><div class="sb-prog"><span class="sb-track"><i data-p="${b[6]}"></i></span><span class="pc-n">${b[6]}%</span><svg class="sb-mark"><use href="#logo"/></svg></div></div><div class="sb-cap">${b[1]}<small>${b[3]} · ${b[6]} %</small></div></div>`).join("");
$("dashMedal").innerHTML=laureat();

function fit(){[["dashCanvas","mscreen",1440],["phoneCanvas","pscreen",440]].forEach(([c,s,w])=>{$(c).style.transform=`scale(${$(s).clientWidth/w})`;});}
addEventListener("resize",fit);

/* MacBook: the day plays out — plan tasks tick, Monk ring fills, streak grows */
function dashLife(){
  const rows=[...document.querySelectorAll("#ptl .pt-row")],chks=[...document.querySelectorAll(".monk .chk")],C=226.2;
  const bars=[...document.querySelectorAll("#shelf .sb-track i")];
  const reset=()=>{rows.forEach((r,i)=>{r.classList.remove("pt-done","pt-next");r.querySelector(".pt-ck").textContent=i+1;});rows[0].classList.add("pt-next");$("ptCta").textContent="Commencer";
    chks.forEach(c=>c.classList.remove("on"));$("mcount").textContent=0;$("mring").style.strokeDashoffset=C;$("mtt").textContent="Journée en cours";$("mts").textContent="Tes 4 non-négociables.";$("flame").textContent="5 j";$("dayJ").classList.remove("ok");};
  const doneRow=k=>{rows[k].classList.remove("pt-next");rows[k].classList.add("pt-done");rows[k].querySelector(".pt-ck").innerHTML=ico("i-check");if(rows[k+1])rows[k+1].classList.add("pt-next");$("ptCta").textContent=k<2?"Continuer":"Séance terminée";};
  const tick=k=>{chks[k].classList.add("on");$("mcount").textContent=k+1;$("mring").style.strokeDashoffset=C*(1-(k+1)/4);
    if(k===3){$("mtt").textContent="Journée validée";$("mts").textContent="Reviens demain pour garder ta série.";$("flame").textContent="6 j";$("flame").classList.add("pop");setTimeout(()=>$("flame").classList.remove("pop"),500);$("dayJ").classList.add("ok");talk($("dashMedal"));}};
  const seq=[[0,()=>doneRow(0)],[900,()=>tick(0)],[1800,()=>doneRow(1)],[2600,()=>tick(1)],[3400,()=>tick(2)],[4300,()=>doneRow(2)],[5200,()=>tick(3)]];
  if(RM){reset();[0,1,2].forEach(doneRow);[0,1,2,3].forEach(tick);bars.forEach(b=>b.style.width=b.dataset.p+"%");return;}
  setTimeout(()=>bars.forEach(b=>b.style.width=b.dataset.p+"%"),2200);
  const run=()=>{reset();seq.forEach(([t,f])=>setTimeout(f,t+1400));setTimeout(run,12000);};
  setTimeout(run,1800);
}

/* iPhone: the runner answers a real question, wrong then right */
const PQ={s:"$u_{n+1} = 3u_n - 4$ converge vers $\\ell$. Point fixe ?",o:["$4$","$-2$","$2$","$-4$"],c:2,sol:"$\\ell = 3\\ell - 4 \\Rightarrow \\ell = 2$."};
function phoneLife(){
  let round=0;
  const draw=()=>{$("pqs").innerHTML=tex(PQ.s);$("pos").innerHTML=PQ.o.map((o,i)=>`<div class="o"><span class="l">${"ABCD"[i]}</span><span>${tex(o)}</span></div>`).join("");$("pcorr").className="corr";$("pai").className="ai";[...$("pai").children].forEach(s=>s.classList.remove("hot"));};
  const play=()=>{draw();const pick=round%2===0?0:2,opts=[...$("pos").children],good=pick===PQ.c;
    setTimeout(()=>opts[pick].classList.add("tap"),1200);
    setTimeout(()=>{opts[pick].classList.remove("tap");opts[PQ.c].classList.add("ok");opts[PQ.c].querySelector(".l").innerHTML=ico("i-check");
      if(!good){opts[pick].classList.add("ko");opts[pick].querySelector(".l").innerHTML=ico("i-x");}
      $("pcorr").innerHTML=good?`<span class="t">Bonne réponse</span>${tex(PQ.sol)}`:`<span class="t">Correction</span>${tex(PQ.sol)}<br><span class="rcours">${ico("i-bookopen")}Revoir le cours · Suites arithmético-géométriques</span>`;
      $("pcorr").className="corr show"+(good?" good":"");$("pai").className="ai show";
      const n=good?10:9;$("pb").textContent=n+" bonnes";
      if(!good)setTimeout(()=>$("pai").children[0].classList.add("hot"),900);
    },1550);
    setTimeout(()=>{round++;play();},7400);};
  if(RM){draw();return;}setTimeout(play,2000);
}


/* keyboard keys */
(function(){const rows=[[14],[14],[1,12,1],[1,11,1],[1,10,1,1],[3,1,6,1,3]];let h="";for(let k=0;k<6;k++){for(let j=0;j<14;j++){h+=k===5&&j===4?'<i class="sp"></i>':(k===5&&j>4&&j<10?"":"<i></i>");}}$("kb").innerHTML=h;})();
/* Dynamic Island: Live Activity when the Monk day is validated */
(function(){const mt=$("mtt");if(!mt)return;new MutationObserver(()=>{const on=mt.textContent==="Journée validée";$("di").classList.toggle("live",on);$("diR").textContent=$("flame").textContent;}).observe(mt,{childList:true,characterData:true,subtree:true});})();
/* pointer parallax on the device shot */
(function(){if(RM)return;const s=$("shot"),r=$("rig");setTimeout(()=>{r.style.animation="none";r.style.transition="transform .8s cubic-bezier(.2,.7,.2,1)";},2100);
  if(matchMedia("(hover:hover)").matches){s.addEventListener("pointermove",e=>{const b=s.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;r.style.transform=`rotateX(${-6-y*5}deg) rotateY(${-23+x*8}deg)`;});s.addEventListener("pointerleave",()=>{r.style.transform="";});}})();
/* ===== Diagnostic ===== */
const SUBJ={maths:{lbl:"Mathématiques",c:"#F97316",g:"linear-gradient(90deg,#F97316,#EA580C)",c1:"#E2671A",hi:"#FFC79E"},pc:{lbl:"Physique-Chimie",c:"#8B5CF6",g:"linear-gradient(90deg,#8B5CF6,#6D28D9)",c1:"#5B3FD1",hi:"#B9A8FF"},svt:{lbl:"SVT",c:"#10B981",g:"linear-gradient(90deg,#10B981,#047857)",c1:"#0F9C6E",hi:"#9FF0CF"}};
const SCENES={
 maths:`<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor"><g opacity=".9"><path class="draw" d="M210 30 L270 150 L150 150 Z" stroke-width="1.5" opacity=".5"/><path class="draw" d="M210 30 L150 150 M210 30 L245 120 M270 150 L245 120 L150 150" stroke-width="1" opacity=".35"/><path class="draw" d="M40 150 C90 150 100 60 300 40" stroke-width="2" opacity=".7"/><g opacity=".4"><circle cx="60" cy="150" r="1.6" fill="currentColor" stroke="none"/><circle cx="104" cy="150" r="1.6" fill="currentColor" stroke="none"/><circle cx="148" cy="150" r="1.6" fill="currentColor" stroke="none"/><circle cx="192" cy="150" r="1.6" fill="currentColor" stroke="none"/><circle cx="236" cy="150" r="1.6" fill="currentColor" stroke="none"/><circle cx="280" cy="150" r="1.6" fill="currentColor" stroke="none"/></g><text x="46" y="60" font-size="20" fill="currentColor" stroke="none" opacity=".45" font-style="italic">∫ƒ</text></g></svg>`,
 pc:`<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor"><g opacity=".9"><circle cx="185" cy="100" r="10" fill="currentColor" stroke="none" opacity=".8"/><g opacity=".55" stroke-width="1.6"><ellipse class="draw" cx="185" cy="100" rx="70" ry="26"/><ellipse class="draw" cx="185" cy="100" rx="70" ry="26" transform="rotate(60 185 100)"/><ellipse class="draw" cx="185" cy="100" rx="70" ry="26" transform="rotate(120 185 100)"/></g><circle cx="255" cy="100" r="4" fill="currentColor" stroke="none"/><path class="draw" d="M285 60 L285 92 L300 140 A6 6 0 0 1 294 150 L266 150 A6 6 0 0 1 260 140 L275 92 L275 60 Z" stroke-width="1.6" opacity=".5"/><path d="M270 60 L290 60" stroke-width="2" opacity=".6"/></g></svg>`,
 svt:`<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor"><g opacity=".9" stroke-width="1.6"><path class="draw" d="M150 20 C210 55 150 90 210 125 C150 160 210 190 150 200" opacity=".6"/><path class="draw" d="M200 20 C140 55 200 90 140 125 C200 160 140 190 200 200" opacity=".6"/><g opacity=".4"><line x1="152" y1="40" x2="198" y2="40"/><line x1="158" y1="66" x2="192" y2="66"/><line x1="152" y1="92" x2="198" y2="92"/><line x1="158" y1="118" x2="192" y2="118"/><line x1="152" y1="144" x2="198" y2="144"/><line x1="158" y1="170" x2="192" y2="170"/></g><path class="draw" d="M262 70 C300 70 300 130 262 130 C262 100 262 90 262 70 Z" opacity=".5"/><path d="M262 70 C262 100 280 110 296 110" opacity=".5"/></g></svg>`};
const LEVELS=["À découvrir","En cours","Acquis","Maîtrisé","Niveau BAC"];
function notionLevel(o){if(!o.done)return 0;const r=o.total?o.correct/o.total:0;if(r>=.8&&o.correct>=Math.min(3,o.total))return o.probTotal>0&&o.probCorrect===o.probTotal?4:3;return r>=.5?2:1;}
function shuffle(a){const r=[...a];for(let k=r.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[r[k],r[j]]=[r[j],r[k]];}return r;}
const FIL=[["pc","PC"],["svt","SVT"],["sm","SM"]],MAT=[["maths","Mathématiques"],["pc","Physique-Chimie"],["svt","SVT"]];
function bankFor(f,m){if(m==="maths")return f==="sm"?BANK.maths_sm:BANK.maths_std;if(m==="pc")return BANK.pc;const b={...BANK.svt};if(f==="svt")b.chapter="Consommation de la matière organique et flux d'énergie";return b;}
const month=new Date().toLocaleDateString("fr-FR",{month:"long"});
let D={f:"pc",m:"maths",deck:[],i:0,ans:[]};
const dxEl=$("dx");
function swap(h){const h0=dxEl.offsetHeight;dxEl.style.height="auto";dxEl.innerHTML=h;if(RM||!h0)return;const h1=dxEl.offsetHeight;dxEl.style.height=h0+"px";dxEl.offsetHeight;dxEl.style.height=h1+"px";clearTimeout(swap.t);swap.t=setTimeout(()=>dxEl.style.height="auto",600);}
const dx={set innerHTML(h){swap(h);},querySelectorAll:s=>dxEl.querySelectorAll(s),querySelector:s=>dxEl.querySelector(s),getBoundingClientRect:()=>dxEl.getBoundingClientRect(),scrollIntoView:o=>dxEl.scrollIntoView(o)};
function sban(h1,h2,sub,cta,line){const s=SUBJ[D.m];return`${line?`<div class="saywrap"><div class="say" id="dSay"><b>Ton Lauréat</b>${line}</div></div>`:""}<div class="sban" style="--sc:${s.c};--sg:${s.g}"><span class="glw"></span><div class="scene">${SCENES[D.m]}</div>
  <span class="mm-medal medal" id="dMedal" style="--c1:${s.c1};--hi:${s.hi}">${laureat()}</span>
  <div class="cp"><span class="lbl">${s.lbl}</span><h3>${h1} <span>${h2}</span></h3><p>${sub}</p>${cta?`<span class="cta">${ico("i-play")}${cta}${ico("i-arrow")}</span>`:""}</div></div>`;}
function speak(){const m=$("dMedal"),s=$("dSay");if(m)talk(m);if(s)setTimeout(()=>s.classList.add("on"),RM?0:450);}
function dSetup(){
  const b=bankFor(D.f,D.m),ns=[...new Set(b.qs.map(q=>q.n))],s=SUBJ[D.m];
  dx.innerHTML=`${sban("TESTE","TON NIVEAU",esc(b.chapter),"6 questions",`On commence par ce que ta classe voit en ${month}.`)}
  <div class="dcard lgl">
    <div class="dlbl">Filière</div><div class="chips">${FIL.map(([k,l])=>`<button class="chip" data-f="${k}" aria-pressed="${D.f===k}">${l}</button>`).join("")}</div>
    <div class="dlbl">Matière</div><div class="chips">${MAT.map(([k,l])=>`<button class="chip" data-m="${k}" aria-pressed="${D.m===k}">${l}</button>`).join("")}</div>
    <div class="dlbl">Notions testées</div>
    <ul class="notions">${ns.map(n=>`<li><i style="background:${s.c}"></i>${esc(n)}</li>`).join("")}</ul>
    <p class="dnote">On suit la progression officielle : seulement ce qui a déjà été vu en classe à cette date.</p>
    <div class="endrow"><button class="gbtn" id="dgo" style="background:${s.g}">Essayer ${ico("i-chev")}</button></div>
  </div>`;
  dx.querySelectorAll("[data-f]").forEach(e=>e.onclick=()=>{D.f=e.dataset.f;dSetup();});
  dx.querySelectorAll("[data-m]").forEach(e=>e.onclick=()=>{D.m=e.dataset.m;dSetup();});
  $("dgo").onclick=dStart;observeSpeak();
}
let spoke=false;function observeSpeak(){if(spoke){speak();return;}const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){spoke=true;speak();io.disconnect();}},{threshold:.5});io.observe(dxEl);}
function dStart(){const b=bankFor(D.f,D.m),by={};b.qs.forEach(q=>(by[q.n]=by[q.n]||[]).push(q));
  D.deck=Object.values(by).flatMap(l=>[...l].sort((a,c)=>(a.d||1)-(c.d||1))).map(q=>({...q,o:shuffle(q.o)}));D.i=0;D.ans=[];dQ();}
function dQ(){
  const b=bankFor(D.f,D.m),q=D.deck[D.i],s=SUBJ[D.m],nC=D.ans.filter(Boolean).length;
  dx.innerHTML=`${sban("NOTION",esc(q.n).toUpperCase(),esc(b.chapter)+" · correction immédiate","","")}
  <div class="dcard lgl">
    <div class="drh"><b style="color:${s.c}">Question ${D.i+1} / ${D.deck.length}</b><span>${nC} bonne${nC>1?"s":""}</span></div>
    <div class="dprog"><i style="width:${D.i/D.deck.length*100}%;background:${s.c}"></i></div>
    <div class="dq">${tex(q.s)}</div>
    ${q.h?`<button class="hintbtn" id="hb">${ico("i-bulb")}Indice</button>`:""}
    <div class="dos">${q.o.map((o,k)=>`<button class="dopt" data-k="${k}" style="animation-delay:${.08+k*.05}s"><span class="l">${"ABCD"[k]}</span><span class="tx">${tex(o[0])}</span></button>`).join("")}</div>
    <div id="after"></div>
  </div>`;
  if(q.h)$("hb").onclick=()=>{$("hb").outerHTML=`<div class="hint">${ico("i-bulb")}<span>${tex(q.h)}</span></div>`;};
  dx.querySelectorAll(".dopt").forEach(e=>e.onclick=()=>dPick(+e.dataset.k));
}
function dPick(k){
  const q=D.deck[D.i],s=SUBJ[D.m],ch=q.o[k],ok=!!ch[1],right=q.o.find(o=>o[1]);D.ans[D.i]=ok;
  dx.querySelectorAll(".dopt").forEach((e,j)=>{e.disabled=true;const c=!!q.o[j][1];if(c){e.classList.add("ok");e.querySelector(".l").innerHTML=ico("i-check");}else if(j===k){e.classList.add("ko");e.querySelector(".l").innerHTML=ico("i-x");}});
  const hb=$("hb");if(hb)hb.remove();talk($("dMedal"));
  const nC=D.ans.filter(Boolean).length;dx.querySelector(".drh span").textContent=nC+" bonne"+(nC>1?"s":"");dx.querySelector(".dprog i").style.width=((D.i+1)/D.deck.length*100)+"%";
  const last=D.i+1>=D.deck.length;
  $("after").innerHTML=`<div class="dcorr ${ok?"good":"bad"}"><div class="t">${ok?"Bonne réponse":"Correction"}</div>
      ${!ok&&ch[2]?`<div class="w"><b>Pourquoi ta réponse est fausse : </b>${tex(ch[2])}</div>`:""}
      ${ok&&ch[2]?`<div>${tex(ch[2])}</div>`:""}
      ${!ok?`<div class="g"><b>La bonne réponse : </b>${tex(right[2]||right[0])}</div>`:""}
      ${!ok?`<button class="rc" data-ai="cours">${ico("i-bookopen")}Revoir le cours · ${esc(q.n)}</button>`:""}</div>
    ${q.m?`<div class="meth"><div class="t">${ico("i-compass")}Méthode à retenir</div>${tex(q.m)}</div>`:""}
    <div class="aim"><button data-ai="1">${ico("i-bulb")}Explique autrement</button><button data-ai="1">${ico("i-list")}Étape par étape</button><button data-ai="1">${ico("i-bookopen")}Rappel du cours</button><button data-ai="1">${ico("i-alert")}Erreurs fréquentes</button><button data-ai="1">${ico("i-compass")}Méthode générale</button></div>
    <div id="aiN"></div>
    <div class="endrow"><button class="gbtn" id="dn" style="background:${s.g}">${last?"Voir mon score":"Suivant"} ${ico("i-chev")}</button></div>`;
  dx.querySelectorAll("[data-ai]").forEach(e=>e.onclick=()=>{$("aiN").innerHTML=`<div class="aimnote">${e.dataset.ai==="cours"?"Le cours complet de cette notion s'ouvre avec ton compte gratuit.":"Les explications IA s'ouvrent avec ton compte gratuit : 3 par jour, illimitées avec l'accès complet."}</div>`;});
  $("dn").onclick=()=>{if(last)dRes();else{D.i++;dQ();}const top=dx.getBoundingClientRect().top;if(top<0)dx.scrollIntoView({behavior:RM?"auto":"smooth",block:"start"});};
}
function dRes(){
  const b=bankFor(D.f,D.m),s=SUBJ[D.m],ns=[...new Set(D.deck.map(q=>q.n))];
  const rows=ns.map(n=>{const ix=D.deck.map((q,k)=>q.n===n?k:-1).filter(k=>k>=0),c=ix.filter(k=>D.ans[k]).length;return{n,c,tot:ix.length,lv:notionLevel({total:ix.length,done:ix.length,correct:c,probTotal:0,probCorrect:0})};});
  const nC=D.ans.filter(Boolean).length,pct=Math.round(nC/D.deck.length*100),weak=[...rows].sort((a,c)=>a.lv-c.lv||a.c-c.c)[0];
  dx.innerHTML=`${sban("TON","POINT DE DÉPART",esc(b.chapter),"",`Commence par « ${esc(weak.n)} ». C'est là que tu gagnes le plus.`)}
  <div class="dcard lgl res">
    <div class="tile" style="background:linear-gradient(135deg,${s.c},${s.c1})">${ico("i-trophy")}</div>
    <div class="big" id="bigN">0 / ${D.deck.length}</div>
    <div class="bsub">${pct===100?"Parfait ! Notion maîtrisée.":pct>=70?"Bien joué — encore un petit effort pour le sans-faute.":"Relis le cours de la notion, puis retente."}</div>
    <div class="nrows">${rows.map((r,i)=>`<div class="nrow" style="animation-delay:${.15+i*.1}s"><span class="n">${esc(r.n)}<small>${r.c} / ${r.tot} juste${r.c>1?"s":""}</small></span><span class="lvl lvl-${r.lv}">${LEVELS[r.lv]}</span></div>`).join("")}</div>
    <div class="prio"><b>À travailler en premier</b>${esc(weak.n)}</div>
    <div class="soft-fork">
      <button class="fk paid" data-c="free"><span>Continuer gratuitement<small>« ${esc(weak.n)} » en entier, ton résultat gardé</small></span>${ico("i-chev")}</button>
    </div>
    <button class="quiet" data-c="paid">Voir l'accès complet · 220 DH l'année</button>
    <div id="cN"></div>
    <div class="links2"><button data-c="parent">Envoyer mon résultat à mes parents</button><button class="m" id="again">Refaire le test</button></div>
  </div>`;
  speak();
  let n=0;const el=$("bigN");const tm=setInterval(()=>{el.textContent=n+" / "+D.deck.length;if(n>=nC)clearInterval(tm);n++;},RM?0:120);
  const msg={paid:"Ici : inscription Google en un clic, puis paiement par carte (CMI) ou à la livraison.",free:"Ici : inscription Google en un clic. Ton résultat est sauvegardé et la notion s'ouvre.",parent:"Ici : un lien WhatsApp vers la page parents, avec ton résultat et le tarif."};
  dx.querySelectorAll("[data-c]").forEach(e=>e.onclick=()=>{$("cN").innerHTML=`<div class="toast">Maquette · ${msg[e.dataset.c]}</div>`;});
  $("again").onclick=dSetup;
}


/* ===== Section 3: real plan phases (engine.ts PHASES) + review curve ===== */
const PHASES=[{label:"Fondations",from:Infinity,to:120,hint:"Chaque notion : cours, puis QCU."},{label:"Consolidation",from:120,to:45,hint:"Tes notions fragiles, en séries mixtes."},{label:"Simulation",from:45,to:10,hint:"Annales en conditions réelles."},{label:"Ligne droite",from:10,to:0,hint:"Résumés, flashcards et sommeil."}];
(function(){
  const start=Math.max(J,121);const span=[start-120,75,35,10];const tot=span.reduce((a,b)=>a+b,0);
  $("phases").style.setProperty("--cols","repeat(4,minmax(0,1fr))");
  $("phases").innerHTML=PHASES.map((p,i)=>{const now=J<=(p.from===Infinity?1e9:p.from)&&J>p.to;const range=p.from===Infinity?`J-${start} → J-120`:`J-${p.from} → J-${p.to}`;return`<div class="ph ${now?"now":""}"><div class="j">${range}</div><h4>${p.label}</h4><p>${p.hint}</p></div>`;}).join("");
  let pos;{const idx=PHASES.findIndex(p=>J<=(p.from===Infinity?1e9:p.from)&&J>p.to);const p=PHASES[Math.max(0,idx)];const a=p.from===Infinity?start:p.from;pos=(Math.max(0,idx)+(a-J)/Math.max(1,a-p.to))/4;}$("today").style.left=(pos*100)+"%";
  const fillTo=()=>{$("rfill").style.width=Math.max(pos*100,1.5)+"%";};
  new IntersectionObserver((es,o)=>{if(es.some(e=>e.isIntersecting)){fillTo();o.disconnect();}},{threshold:.4}).observe($("road"));
})();
(function(){
  const X0=48,X1=620,days=10,x=d=>X0+(X1-X0)*d/days,y=r=>40+(1-r)/0.9*240;
  $("xt").innerHTML=[0,1,3,7,10].map(d=>`<text class="ax" x="${x(d)}" y="306" text-anchor="middle">${d===0?"Jour 0":"J+"+d}</text>`).join("");
  const decay=(d,s)=>Math.max(.1,Math.exp(-d/s));
  const pts=(fn)=>{let p="";for(let i=0;i<=200;i++){const d=days*i/200;p+=(i?"L":"M")+x(d).toFixed(1)+" "+y(fn(d)).toFixed(1);}return p;};
  $("lose").setAttribute("d",pts(d=>decay(d,1.3)));
  const rev=[1,3,7],st=[1.3,3.2,7,14];
  const keep=d=>{let k=0;while(k<rev.length&&d>=rev[k])k++;const t0=k?rev[k-1]:0;return decay(d-t0,st[k]);};
  const kp=pts(keep);
  $("keep").setAttribute("d",kp);
  $("area").setAttribute("d",kp+`L${X1} 280L${X0} 280Z`);
  $("rvs").innerHTML=rev.map((d,i)=>`<g class="rv" data-i="${i}"><circle cx="${x(d)}" cy="${y(1)}" r="6"/><text x="${x(d)}" y="${y(1)-14}" text-anchor="middle">Rappel ${d} j</text></g>`).join("")+`<text class="lab" x="${x(9.6)}" y="${y(keep(9.6))-12}" fill="#7FE3F2" text-anchor="end">Gardé</text><text class="lab" x="${x(9.6)}" y="${y(.1)-10}" fill="#66737E" text-anchor="end">Oublié</text>`;
  const keepEl=$("keep"),loseEl=$("lose"),L=keepEl.getTotalLength(),L2=loseEl.getTotalLength();
  if(!RM){keepEl.style.strokeDasharray=L;keepEl.style.strokeDashoffset=L;loseEl.style.opacity=0;}
  const go=()=>{$("chart").classList.add("on");if(RM){document.querySelectorAll(".rv").forEach(g=>g.style.opacity=1);return;}
    loseEl.style.transition="opacity .8s";loseEl.style.opacity=1;
    keepEl.style.transition="stroke-dashoffset 2.6s cubic-bezier(.4,.1,.2,1) .4s";keepEl.style.strokeDashoffset=0;
    document.querySelectorAll(".rv").forEach((g,i)=>setTimeout(()=>g.style.opacity=1,700+[0.1,0.3,0.7][i]*2600));};
  new IntersectionObserver((es,o)=>{if(es.some(e=>e.isIntersecting)){go();o.disconnect();}},{threshold:.45}).observe($("chart"));
})();


/* impact toggle (Postflows-style) */
(function(){
  const DATA={res:{s:[["+",5.2,1," pts","de moyenne"],["×",2.4,1,"","note estimée"],["top ",10,0," %","de la classe"]],c:[[0,215],[150,205],[300,160],[450,90],[600,30]]},
              disc:{s:[["",38,0," j","de série en moyenne"],["+",12,0," h","de focus par semaine"],["×",3,0,"","examens blancs faits"]],c:[[0,220],[150,190],[300,150],[450,105],[600,55]]}};
  const sp=p=>{let d=`M${p[0][0]},${p[0][1]}`;for(let i=1;i<p.length;i++){const [x0,y0]=p[i-1],[x1,y1]=p[i],cx=(x0+x1)/2;d+=` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;}return d;};
  const seg=$("seg"),th=$("th"),btns=[...seg.querySelectorAll("button")];
  const place=b=>{th.style.width=b.offsetWidth+"px";th.style.transform=`translateX(${b.offsetLeft-4}px)`;};
  function show(k,anim){const D=DATA[k];
    $("stats").innerHTML=D.s.map(s=>`<div class="stat"><i></i><div><b data-to="${s[1]}" data-d="${s[2]}" data-p="${s[0]}" data-s="${s[3]}">${s[0]}0${s[3]}</b><span>${s[4]}</span></div></div>`).join("");
    $("stats").querySelectorAll("b").forEach(b=>{const to=+b.dataset.to,d=+b.dataset.d,t0=performance.now(),dur=RM?0:1300;const f=t=>{const p=dur?Math.min(1,(t-t0)/dur):1,e=1-Math.pow(1-p,3);b.textContent=b.dataset.p+(to*e).toFixed(d).replace(".",",")+b.dataset.s;if(p<1)requestAnimationFrame(f);};requestAnimationFrame(f);});
    const d=sp(D.c),L=$("pline");L.setAttribute("d",d);$("parea").setAttribute("d",d+" L600,260 L0,260 Z");
    const e=D.c[D.c.length-1];$("pend").setAttribute("cx",e[0]);$("pend").setAttribute("cy",e[1]);
    if(!RM&&anim){const len=L.getTotalLength();L.style.transition="none";L.style.strokeDasharray=len;L.style.strokeDashoffset=len;$("parea").style.opacity=0;$("pend").style.opacity=0;L.getBoundingClientRect();
      requestAnimationFrame(()=>{L.style.transition="stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1)";L.style.strokeDashoffset=0;$("parea").style.transition="opacity 1s .6s";$("parea").style.opacity=1;$("pend").style.transition="opacity .4s 1.5s";$("pend").style.opacity=1;});}}
  btns.forEach(b=>b.onclick=()=>{btns.forEach(x=>x.setAttribute("aria-pressed",x===b));place(b);show(b.dataset.k,true);});
  requestAnimationFrame(()=>place(btns[0]));addEventListener("resize",()=>place(btns.find(b=>b.getAttribute("aria-pressed")==="true")));
  show("res",false);let seen=false;new IntersectionObserver(es=>{if(!seen&&es.some(x=>x.isIntersecting)){seen=true;show("res",true);}},{threshold:.4}).observe($("plot"));
})();
/* wordplay: « La bac app. » morphs into « Bac Up. » */
(function(){const w=$("wpw");const go=()=>w.classList.add("morph");
  new IntersectionObserver((es,o)=>{if(es.some(e=>e.isIntersecting)){setTimeout(go,RM?0:700);o.disconnect();}},{threshold:.7}).observe(w);
  w.onclick=()=>{w.classList.remove("morph");setTimeout(go,900);};})();
/* Morocco network map */
(function(){
  const M=JSON.parse($("madata").textContent),svg=$("map");svg.setAttribute("viewBox",`0 0 ${M.W} ${M.H}`);
  const BIG=["Tanger","Rabat","Casablanca","Fès","Marrakech","Agadir","Oujda","Laâyoune"];
  const names=Object.keys(M.C);
  let h=`<defs><radialGradient id="cg"><stop offset="0" stop-color="#0DB8D3" stop-opacity=".55"/><stop offset="1" stop-color="#0DB8D3" stop-opacity="0"/></radialGradient><linearGradient id="arcg" x1="0" x2="1"><stop offset="0" stop-color="#0DB8D3" stop-opacity="0"/><stop offset=".5" stop-color="#7FE3F2"/><stop offset="1" stop-color="#1B7FDC" stop-opacity="0"/></linearGradient></defs>`;
  h+=`<g>${M.dots.map((d,i)=>`<circle class="dot${i%9===0?" tw":""}" cx="${d[0]}" cy="${d[1]}" r="2.1" style="animation-delay:${(i%37)*.11}s"/>`).join("")}</g>`;
  const pairs=[];for(let i=0;i<names.length;i++){const a=M.C[names[i]];const near=names.map((n,j)=>[j,Math.hypot(M.C[n][0]-a[0],M.C[n][1]-a[1])]).filter(x=>x[0]!==i).sort((x,y)=>x[1]-y[1]).slice(0,2);near.forEach(([j])=>{if(i<j||!pairs.some(p=>p[0]===j&&p[1]===i))pairs.push([i,j]);});}
  const curve=(a,b)=>{const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1],k=.18;return`M${a[0]},${a[1]} Q${mx-dy*k},${my+dx*k} ${b[0]},${b[1]}`;};
  h+=`<g>${pairs.map(([i,j])=>`<path class="edge" d="${curve(M.C[names[i]],M.C[names[j]])}"/>`).join("")}</g><g id="arcs"></g>`;
  h+=`<g>${names.map((n,i)=>{const [x,y]=M.C[n],big=BIG.includes(n),r=big?4.2:2.8,left=x>M.W*.6;return`<g class="city${big?" big":""}" data-n="${n}"><circle class="glow" cx="${x}" cy="${y}" r="${big?22:14}"/><circle class="h" cx="${x}" cy="${y}" r="${r}" style="animation-delay:${(i*.37)%3.2}s"/><circle class="c" cx="${x}" cy="${y}" r="${r}"/><text x="${left?x-9:x+9}" y="${y+4}" text-anchor="${left?"end":"start"}">${n}</text></g>`;}).join("")}</g>`;
  svg.innerHTML=h;
  if(RM)return;
  const arcs=$("arcs");
  const fire=()=>{const [i,j]=pairs[Math.floor(Math.random()*pairs.length)],a=M.C[names[i]],b=M.C[names[j]];
    const p=document.createElementNS("http://www.w3.org/2000/svg","path");p.setAttribute("class","arc");p.setAttribute("d",curve(a,b));arcs.appendChild(p);
    const L=p.getTotalLength();p.style.strokeDasharray=`${L*.35} ${L}`;p.style.strokeDashoffset=L*.35;
    p.animate([{strokeDashoffset:L*.35},{strokeDashoffset:-L}],{duration:1800,easing:"cubic-bezier(.4,.1,.2,1)"}).onfinish=()=>p.remove();
    [names[i],names[j]].forEach((n,k)=>setTimeout(()=>{const g=svg.querySelector(`.city[data-n="${n}"]`);g.classList.add("lit");setTimeout(()=>g.classList.remove("lit"),1400);},k?1300:0));};
  let timer=null;new IntersectionObserver(es=>{const v=es.some(e=>e.isIntersecting);if(v&&!timer)timer=setInterval(fire,750);if(!v&&timer){clearInterval(timer);timer=null;}},{threshold:.2}).observe(svg);
})();

/* ===== Monk Mode (TIERS from components/monk/badges.tsx) ===== */
const TIERS=[["novice",0,"Novice","Le premier pas","#94a3b8","#475569","#64748b","t-sprout",0],["apprenti",7,"Apprenti","La première semaine","#f4a15a","#b45309","#d97706","t-flame",50],["disciple",21,"Disciple","Habitude formée · 21 jours","#e2e8f0","#94a3b8","#cbd5e1","t-leaf",150],["initie",66,"Initié","Automatisme · 66 jours","#fcd34d","#d97706","#fbbf24","t-brain",400],["moine",90,"Moine","3 mois de discipline","#fb7185","#e11d48","#f43f5e","t-award",600],["maitre",180,"Maître","6 mois · maîtrise","#c084fc","#7c3aed","#a855f7","t-crown",1200],["legende",365,"Légende","1 an · légende vivante","#38bdf8","#2563eb","#0ea5e9","t-gem",3000]];
function shield(t,cls="shield"){const id="sh"+(uid++);return`<svg class="${cls}" viewBox="0 0 100 100" fill="none"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t[4]}"/><stop offset="1" stop-color="${t[5]}"/></linearGradient><linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><path d="M50 4 L88 16 V46 C88 72 71 88 50 96 C29 88 12 72 12 46 V16 Z" fill="url(#${id})" stroke="${t[6]}" stroke-width="3"/><path d="M50 4 L88 16 V46 C88 72 71 88 50 96 C29 88 12 72 12 46 V16 Z" fill="url(#${id}s)"/><circle cx="50" cy="44" r="23" fill="#000" fill-opacity=".14"/></svg>`;}
(function(){
  const lad=$("ladder");
  lad.insertAdjacentHTML("beforeend",TIERS.map((t,i)=>`<div class="tier locked" data-i="${i}"><div class="sh">${shield(t)}<svg class="i ico"><use href="#${t[7]}"/></svg></div><div class="tx"><b>${t[2]}</b><span>${t[3]}</span></div><div class="dd"><b>${t[1]} j</b><span>${t[8]?"+"+t[8]+" XP":"Départ"}</span></div></div>`).join(""));
  const rows=[...lad.querySelectorAll(".tier")],rail=$("railI");
  const onScroll=()=>{const r=lad.getBoundingClientRect(),vh=innerHeight;const p=Math.min(1,Math.max(0,(vh*.62-r.top)/(r.height-60)));rail.style.height=(p*100)+"%";
    rows.forEach((row,i)=>{const on=p>=i/(rows.length-1)-.001;row.classList.toggle("locked",!on);});};
  if(RM){rows.forEach(r=>r.classList.remove("locked"));rail.style.height="100%";}else{addEventListener("scroll",onScroll,{passive:true});onScroll();}
  // the live day: Apprenti at 6 → 7 days when the 4 habits are ticked
  const items=[...$("nn").querySelectorAll("div")];let streak=6;
  const setShield=d=>{let t=TIERS[0];TIERS.forEach(x=>{if(d>=x[1])t=x;});const nx=TIERS.find(x=>x[1]>d);$("bigShield").innerHTML=shield(t)+`<svg class="i ico"><use href="#${t[7]}"/></svg>`;$("bigShield").querySelector(".shield").style.filter=`drop-shadow(0 16px 30px ${t[6]}66)`;
    $("sT").textContent=`jours · ${t[2]}`;$("sNext").textContent=nx?`${nx[1]-d} jour${nx[1]-d>1?"s":""} pour devenir ${nx[2]}`:"Rang maximum";$("sBar").style.width=nx?((d-t[1])/(nx[1]-t[1])*100)+"%":"100%";$("sBar").style.background=`linear-gradient(90deg,${nx?nx[4]:t[4]},${nx?nx[6]:t[6]})`;};
  const setN=(d,anim)=>{const el=$("sN");const old=el.textContent;el.innerHTML=`<span>${d}</span>`;if(anim&&!RM){const sp=el.firstChild;sp.style.transform="translateY(100%)";requestAnimationFrame(()=>requestAnimationFrame(()=>sp.style.transform="none"));}};
  const reset=()=>{items.forEach(x=>x.classList.remove("on"));$("mOk").classList.remove("on");streak=6;setN(streak);setShield(streak);};
  const play=()=>{reset();items.forEach((x,k)=>setTimeout(()=>x.classList.add("on"),900+k*850));
    setTimeout(()=>{$("mOk").classList.add("on");streak=7;setN(streak,true);setShield(streak);},900+4*850+200);
    setTimeout(play,9800);};
  reset();if(RM){items.forEach(x=>x.classList.add("on"));setN(7);setShield(7);$("mOk").classList.add("on");return;}
  let started=false;new IntersectionObserver(es=>{if(!started&&es.some(e=>e.isIntersecting)){started=true;play();}},{threshold:.35}).observe($("nn"));
})();

/* ===== community request (saved to Supabase `leads` in the real build) ===== */
(function(){
  const M=JSON.parse($("madata").textContent);$("jc").insertAdjacentHTML("beforeend",Object.keys(M.C).map(c=>`<option>${c}</option>`).join("")+"<option>Autre ville</option>");
  $("jform").addEventListener("submit",e=>{e.preventDefault();
    const v=id=>$(id).value.trim(),err=$("jerr");const tel=v("jw").replace(/[\s.-]/g,"");
    const bad=!v("jn")?"Ton prénom":!v("jc")?"Ta ville":!v("jf")?"Ta filière":!/^(\+212|0)[5-7]\d{8}$/.test(tel)?"Un numéro WhatsApp valide (06…, 07… ou +212…)":!/^\S+@\S+\.\S+$/.test(v("je"))?"Un email valide":!$("ja").checked?"La case âge ou accord parental":!$("jo").checked?"La case contact WhatsApp":"";
    if(bad){err.textContent="Il manque : "+bad+".";err.hidden=false;return;}
    err.hidden=true;
    $("join").querySelector("form").outerHTML=`<div class="done"><div class="okc"><svg class="i"><use href="#i-check"/></svg></div><b>Demande reçue, ${esc(v("jn"))}.</b><p>On t'écrit sur WhatsApp dès que le groupe ${esc(v("jf"))} de ${esc(v("jc"))} ouvre.</p></div>`;
  });
})();

/* ===== pricing actions (mock) ===== */
document.querySelectorAll("[data-pt]").forEach(b=>b.onclick=()=>{const m={free:"Ici : inscription Google en un clic.",paid:"Ici : inscription, puis paiement par carte (CMI) ou à la livraison avec une carte d'activation.",parent:"Ici : un lien WhatsApp vers la page parents."};$("ptoast").textContent="Maquette · "+m[b.dataset.pt];});

function boot(){fit();dashLife();phoneLife();dSetup();}
if(document.readyState==="complete")boot();else addEventListener("load",boot);
