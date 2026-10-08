/* =====================================================================
   Bac Up landing v3 — new behaviours
   ===================================================================== */

/* ---------- theme switch (Clair / Sombre) ---------- */
(function(){
  const root=document.documentElement,btns=[...document.querySelectorAll("#tsw button")],th=$("tsth");
  const place=()=>{const b=btns.find(x=>x.getAttribute("aria-pressed")==="true");if(!b)return;th.style.width=b.offsetWidth+"px";th.style.transform=`translateX(${b.offsetLeft-3}px)`;};
  const set=(t,persist)=>{root.setAttribute("data-theme",t);btns.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.t===t)));place();if(persist){try{localStorage.setItem("bacup-theme",t);}catch(e){}}};
  btns.forEach(b=>b.addEventListener("click",()=>set(b.dataset.t,true)));
  set(root.getAttribute("data-theme")||"dark",false);
  addEventListener("resize",place);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(place);
})();

/* static formulas are hand-written MathML so the marketing visuals never depend on a CDN */
const MCi='<mi>c</mi><mo>=</mo><mfrac><mi>d</mi><mrow><mi mathvariant="normal">Δ</mi><mi>t</mi></mrow></mfrac>',MC=`<math>${MCi}</math>`;
const Mx2='<msup><mi>x</mi><mn>2</mn></msup>';
/* ---------- nav, mobile CTA, reveals, counters ---------- */
(function(){
  const nav=$("nav"),mc=$("mcta");
  const on=()=>{const y=scrollY;nav.classList.toggle("stuck",y>24);mc.classList.toggle("show",y>720);};
  addEventListener("scroll",on,{passive:true});on();
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}}),{threshold:.12,rootMargin:"0px 0px -6% 0px"});
  document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
  const fmt=(n,sep)=>sep?n.toLocaleString("fr-FR"):String(n);
  const run=el=>{const to=+el.dataset.count,pre=el.dataset.pre||"",suf=el.dataset.suf||"",sep=el.dataset.sep,t0=performance.now(),dur=RM?0:1600;
    const f=t=>{const p=dur?Math.min(1,(t-t0)/dur):1,e=1-Math.pow(1-p,4);el.textContent=pre+fmt(Math.round(to*e),sep)+suf;if(p<1)requestAnimationFrame(f);};requestAnimationFrame(f);};
  const cio=new IntersectionObserver((es,o)=>{if(es.some(e=>e.isIntersecting)){document.querySelectorAll("[data-count]").forEach(run);o.disconnect();}},{threshold:.35});
  cio.observe($("statsband"));
  document.querySelectorAll(".bc").forEach(c=>c.addEventListener("pointermove",e=>{const b=c.getBoundingClientRect();c.style.setProperty("--mx",(e.clientX-b.left)+"px");c.style.setProperty("--my",(e.clientY-b.top)+"px");}));
  // founder seats
  const bar=$("seatBar");new IntersectionObserver((es,o)=>{if(es.some(e=>e.isIntersecting)){bar.style.width="80%";o.disconnect();}},{threshold:.4}).observe(bar);
  // formula in the callout and the phone reader
  if($("fCelerite"))$("fCelerite").innerHTML=MC;
  if($("rdFm"))$("rdFm").innerHTML=`<math>${MCi}<mspace width="1.6em"></mspace><mi>τ</mi><mo>=</mo><mfrac><mi>d</mi><mi>c</mi></mfrac></math>`;
})();

/* ---------- perspective: map a flat UI rectangle onto a quad of the mockup photo ---------- */
function solve(A,b){const n=b.length;for(let i=0;i<n;i++){let m=i;for(let r=i+1;r<n;r++)if(Math.abs(A[r][i])>Math.abs(A[m][i]))m=r;[A[i],A[m]]=[A[m],A[i]];[b[i],b[m]]=[b[m],b[i]];
  for(let r=i+1;r<n;r++){const f=A[r][i]/A[i][i];for(let c=i;c<n;c++)A[r][c]-=f*A[i][c];b[r]-=f*b[i];}}
  const x=Array(n).fill(0);for(let i=n-1;i>=0;i--){let s=b[i];for(let c=i+1;c<n;c++)s-=A[i][c]*x[c];x[i]=s/A[i][i];}return x;}
function homog(w,h,q){const src=[[0,0],[w,0],[w,h],[0,h]],A=[],b=[];
  for(let i=0;i<4;i++){const[x,y]=src[i],[u,v]=q[i];A.push([x,y,1,0,0,0,-u*x,-u*y]);b.push(u);A.push([0,0,0,x,y,1,-v*x,-v*y]);b.push(v);}
  const h8=solve(A,b);return`matrix3d(${h8[0]},${h8[3]},0,${h8[6]},${h8[1]},${h8[4]},0,${h8[7]},0,0,1,0,${h8[2]},${h8[5]},0,1)`;}
function grow(q,px){const cx=q.reduce((a,p)=>a+p[0],0)/4,cy=q.reduce((a,p)=>a+p[1],0)/4;return q.map(([x,y])=>{const dx=x-cx,dy=y-cy,d=Math.hypot(dx,dy)||1;return[x+dx/d*px,y+dy/d*px];});}
const GEO={
  lap:grow([[264,155],[592,229],[544,492],[215,404]],3),
  ph:grow([[212,230],[298,248],[240,460],[149,437]],3),
  hand:[[96,10],[326,92],[326,736],[96,736]],
  c1:[[486,129],[680,180],[668,268],[464,222]],
  c2:[[484,341],[661,386],[642,496],[461,452]],
  c3:[[90,220],[238,251],[226,336],[76,300]]
};
function fitAll(){
  const sw=$("stagewrap"),k=sw.clientWidth/736;$("stage").style.transform=`translate(0,${-88*k}px) scale(${k})`;
  const hs=$("hstage");if(hs)$("hst").style.transform=`scale(${hs.clientWidth/480})`;
  document.querySelectorAll(".sc").forEach(sc=>{const k=sc.clientWidth/+sc.dataset.w;sc.firstElementChild.style.transform=`scale(${k})`;sc.style.height=(+sc.dataset.h*k)+"px";});
}
(function(){
  $("wLap").style.transform=homog(1120,700,GEO.lap);
  $("wPh").style.transform=homog(440,956,GEO.ph);
  $("wHand").style.transform=homog(393,852,GEO.hand);
  [["wc1","c1"],["wc2","c2"],["wc3","c3"]].forEach(([id,k])=>{const e=$(id);e.style.transform=homog(+e.dataset.w,+e.dataset.h,GEO[k]);});
  addEventListener("resize",fitAll);
})();
document.querySelectorAll(".laureat").forEach(e=>{e.innerHTML=laureat();});

/* ---------- Cours shelf progress (second shelf) ---------- */
(function(){const s=$("shelf2");if(!s)return;
  new IntersectionObserver((es,o)=>{if(es.some(e=>e.isIntersecting)){s.querySelectorAll(".sb-track i").forEach(b=>b.style.width=b.dataset.p+"%");o.disconnect();}},{threshold:.3}).observe(s);})();

/* ---------- Examens blancs mock ---------- */
(function(){
  const nav=$("xnav");let h="";for(let i=1;i<=20;i++)h+=`<i class="${i===14?"c":i<14?"d":""}">${i}</i>`;nav.innerHTML=h;
  const lnx=`<mi>ln</mi><mo>(</mo>${Mx2}<mo>+</mo><mn>1</mn><mo>)</mo>`;
  $("xq").innerHTML=`Soit <math><mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo>${lnx}</math>. Que vaut <math><msup><mi>f</mi><mo>′</mo></msup><mo>(</mo><mi>x</mi><mo>)</mo></math> pour tout réel <math><mi>x</mi></math> ?`;
  const O=[`<mfrac><mrow><mn>2</mn><mi>x</mi></mrow><mrow>${Mx2}<mo>+</mo><mn>1</mn></mrow></mfrac>`,`<mfrac><mn>1</mn><mrow>${Mx2}<mo>+</mo><mn>1</mn></mrow></mfrac>`,`<mfrac><mn>2</mn><mi>x</mi></mfrac>`,`<mn>2</mn><mi>x</mi><mo>·</mo>${lnx}`];
  $("xo").innerHTML=O.map((o,i)=>`<button class="dopt" disabled style="animation-delay:${.08+i*.05}s"><span class="l">${"ABCD"[i]}</span><span class="tx"><math>${o}</math></span></button>`).join("");
  const opts=[...$("xo").children];
  const play=()=>{opts.forEach(o=>o.classList.remove("ok","ko"));opts.forEach((o,i)=>o.querySelector(".l").textContent="ABCD"[i]);
    setTimeout(()=>{opts[1].classList.add("ko");opts[1].querySelector(".l").innerHTML=ico("i-x");},1400);
    setTimeout(()=>{opts[0].classList.add("ok");opts[0].querySelector(".l").innerHTML=ico("i-check");},2300);
    setTimeout(play,8200);};
  let t=(3600+42*60+18);const clk=$("xclock");const pad=n=>String(n).padStart(2,"0");
  const tick=()=>{clk.textContent=`${pad(Math.floor(t/3600))}:${pad(Math.floor(t%3600/60))}:${pad(t%60)}`;t--;};tick();if(!RM)setInterval(tick,1000);
  new IntersectionObserver((es,o)=>{if(es.some(e=>e.isIntersecting)){o.disconnect();if(!RM)play();else{opts[0].classList.add("ok");}
    const el=$("xscore"),t0=performance.now(),dur=RM?0:1500;const f=tt=>{const p=dur?Math.min(1,(tt-t0)/dur):1,e=1-Math.pow(1-p,3);el.textContent=(16.5*e).toFixed(1).replace(".",",");if(p<1)requestAnimationFrame(f);};setTimeout(()=>requestAnimationFrame(f),RM?0:600);}},{threshold:.4}).observe($("xres"));
})();

/* ---------- Morocco network map v2 ---------- */
(function(){
  const M=JSON.parse($("madata").textContent),svg=$("map");svg.setAttribute("viewBox",`0 0 ${M.W} ${M.H}`);
  const BIG=["Tanger","Rabat","Casablanca","Fès","Marrakech","Agadir","Oujda","Laâyoune","Dakhla"];
  const names=Object.keys(M.C);
  let h=`<defs>
    <radialGradient id="cg"><stop offset="0" stop-color="#0DB8D3" stop-opacity=".6"/><stop offset="1" stop-color="#0DB8D3" stop-opacity="0"/></radialGradient>
    <linearGradient id="arcg" x1="0" x2="1"><stop offset="0" stop-color="#0DB8D3" stop-opacity="0"/><stop offset=".5" stop-color="#7FE3F2"/><stop offset="1" stop-color="#1B7FDC" stop-opacity="0"/></linearGradient>
    <linearGradient id="landg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0DB8D3" stop-opacity=".18"/><stop offset=".6" stop-color="#1B7FDC" stop-opacity=".07"/><stop offset="1" stop-color="#1B7FDC" stop-opacity=".02"/></linearGradient>
    <linearGradient id="edgeg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7FE3F2" stop-opacity=".9"/><stop offset="1" stop-color="#1B7FDC" stop-opacity=".35"/></linearGradient></defs>`;
  let g="";for(let x=0;x<=M.W;x+=60)g+=`M${x},0V${M.H}`;for(let y=0;y<=M.H;y+=60)g+=`M0,${y}H${M.W}`;
  h+=`<path class="grat" d="${g}"/>`;
  h+=`<text class="sea" x="22" y="300" transform="rotate(-90 22 300)">Océan Atlantique</text><text class="sea" x="${M.W-40}" y="16" text-anchor="end">Méditerranée</text>`;
  h+=`<path class="land" d="${M.d}"/>`;
  h+=`<g>${M.dots.map((d,i)=>`<circle class="dot${i%9===0?" tw":""}" cx="${d[0]}" cy="${d[1]}" r="2.1" style="animation-delay:${(i%37)*.11}s"/>`).join("")}</g>`;
  const pairs=[];for(let i=0;i<names.length;i++){const a=M.C[names[i]];const near=names.map((n,j)=>[j,Math.hypot(M.C[n][0]-a[0],M.C[n][1]-a[1])]).filter(x=>x[0]!==i).sort((x,y)=>x[1]-y[1]).slice(0,2);near.forEach(([j])=>{if(i<j||!pairs.some(p=>p[0]===j&&p[1]===i))pairs.push([i,j]);});}
  const curve=(a,b)=>{const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1],k=.18;return`M${a[0]},${a[1]} Q${mx-dy*k},${my+dx*k} ${b[0]},${b[1]}`;};
  h+=`<g>${pairs.map(([i,j])=>`<path class="edge" d="${curve(M.C[names[i]],M.C[names[j]])}"/>`).join("")}</g><g id="arcs"></g>`;
  h+=`<g>${names.map((n,i)=>{const [x,y]=M.C[n],big=BIG.includes(n),r=big?4.6:3,left=x>M.W*.6||n==="Dakhla"&&false;return`<g class="city${big?" big":""}" data-n="${n}"><circle class="glow" cx="${x}" cy="${y}" r="${big?26:15}" fill="url(#cg)"/><circle class="h" cx="${x}" cy="${y}" r="${r}" style="animation-delay:${(i*.37)%3.2}s"/><circle class="c" cx="${x}" cy="${y}" r="${r}"/><text x="${left?x-9:x+9}" y="${y+4}" text-anchor="${left?"end":"start"}">${n}</text></g>`;}).join("")}</g>`;
  svg.innerHTML=h;
  const chips=$("cities");chips.innerHTML=BIG.map(n=>`<span data-n="${n}">${n}</span>`).join("");
  if(RM)return;
  const arcs=$("arcs"),NS="http://www.w3.org/2000/svg";
  const light=n=>{const g=svg.querySelector(`.city[data-n="${n}"]`),c=chips.querySelector(`[data-n="${n}"]`);if(g){g.classList.add("lit");setTimeout(()=>g.classList.remove("lit"),1500);}if(c){c.classList.add("lit");setTimeout(()=>c.classList.remove("lit"),1500);}};
  const fire=()=>{const [i,j]=pairs[Math.floor(Math.random()*pairs.length)],a=M.C[names[i]],b=M.C[names[j]];
    const p=document.createElementNS(NS,"path");p.setAttribute("class","arc");p.setAttribute("d",curve(a,b));arcs.appendChild(p);
    const dot=document.createElementNS(NS,"circle");dot.setAttribute("class","pkt");dot.setAttribute("r","3");arcs.appendChild(dot);
    const L=p.getTotalLength(),t0=performance.now(),dur=1800;p.style.strokeDasharray=`${L*.35} ${L}`;
    const f=t=>{const k=Math.min(1,(t-t0)/dur),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;const pt=p.getPointAtLength(L*e);dot.setAttribute("cx",pt.x);dot.setAttribute("cy",pt.y);p.style.strokeDashoffset=L*.35-(L*1.35)*e;dot.style.opacity=k>.92?(1-k)/.08:1;
      if(k<1)requestAnimationFrame(f);else{p.remove();dot.remove();}};requestAnimationFrame(f);
    light(names[i]);setTimeout(()=>light(names[j]),1300);};
  let timer=null;new IntersectionObserver(es=>{const v=es.some(e=>e.isIntersecting);if(v&&!timer)timer=setInterval(fire,800);if(!v&&timer){clearInterval(timer);timer=null;}},{threshold:.2}).observe(svg);
})();

/* ---------- Monk Mode: Launchpad-grade badges ---------- */
const TIERS=[["novice",0,"Novice","Le premier pas","#9FB3C8","#3F4E60","rgba(100,116,139,.7)","t-sprout",0],["apprenti",7,"Apprenti","La première semaine","#FFB26B","#C2410C","rgba(234,88,12,.7)","t-flame",50],["disciple",21,"Disciple","Habitude formée · 21 jours","#F1F5F9","#7C8A9B","rgba(148,163,184,.7)","t-leaf",150],["initie",66,"Initié","Automatisme · 66 jours","#FFE27A","#D97706","rgba(245,158,11,.75)","t-brain",400],["moine",90,"Moine","3 mois de discipline","#FF8FA3","#BE123C","rgba(225,29,72,.7)","t-award",600],["maitre",180,"Maître","6 mois · maîtrise","#D8B4FE","#6D28D9","rgba(124,58,237,.75)","t-crown",1200],["legende",365,"Légende","1 an · légende vivante","#8EEBFF","#1D4ED8","rgba(14,165,233,.8)","t-gem",3000]];
function badge(t,cls=""){return`<span class="lp ${cls}" style="--a:${t[4]};--b:${t[5]};--g:${t[6]}"><span class="lp-ring"></span><span class="lp-tile"></span><svg class="i lp-ico"><use href="#${t[7]}"/></svg><span class="lp-lock"><svg class="i"><use href="#i-lock"/></svg></span></span>`;}
(function(){
  const lad=$("ladder");
  lad.insertAdjacentHTML("beforeend",TIERS.map((t,i)=>`<div class="tier locked" data-i="${i}"><div class="sh">${badge(t,"locked")}</div><div class="tx"><b>${t[2]}</b><span>${t[3]}</span></div><div class="dd"><b>${t[1]} j</b><span>${t[8]?"+"+t[8]+" XP":"Départ"}</span></div></div>`).join(""));
  const rows=[...lad.querySelectorAll(".tier")],rail=$("railI");
  const onScroll=()=>{const r=lad.getBoundingClientRect(),vh=innerHeight;const p=Math.min(1,Math.max(0,(vh*.62-r.top)/(r.height-60)));rail.style.height=(p*100)+"%";
    rows.forEach((row,i)=>{const on=p>=i/(rows.length-1)-.001;row.classList.toggle("locked",!on);row.querySelector(".lp").classList.toggle("locked",!on);});};
  if(RM){rows.forEach(r=>{r.classList.remove("locked");r.querySelector(".lp").classList.remove("locked");});rail.style.height="100%";}else{addEventListener("scroll",onScroll,{passive:true});onScroll();}
  const items=[...$("nn").querySelectorAll("div")];let streak=6;
  const setShield=d=>{let t=TIERS[0];TIERS.forEach(x=>{if(d>=x[1])t=x;});const nx=TIERS.find(x=>x[1]>d);$("bigShield").innerHTML=badge(t,"big");
    $("sT").textContent=`jours · ${t[2]}`;$("sNext").textContent=nx?`${nx[1]-d} jour${nx[1]-d>1?"s":""} pour devenir ${nx[2]}`:"Rang maximum";$("sBar").style.width=nx?((d-t[1])/(nx[1]-t[1])*100)+"%":"100%";$("sBar").style.background=`linear-gradient(90deg,${nx?nx[4]:t[4]},${nx?nx[5]:t[5]})`;};
  const setN=(d,anim)=>{const el=$("sN");el.innerHTML=`<span>${d}</span>`;if(anim&&!RM){const sp=el.firstChild;sp.style.transform="translateY(100%)";requestAnimationFrame(()=>requestAnimationFrame(()=>sp.style.transform="none"));}};
  const reset=()=>{items.forEach(x=>x.classList.remove("on"));$("mOk").classList.remove("on");streak=6;setN(streak);setShield(streak);};
  const play=()=>{reset();items.forEach((x,k)=>setTimeout(()=>x.classList.add("on"),900+k*850));
    setTimeout(()=>{$("mOk").classList.add("on");streak=7;setN(streak,true);setShield(streak);},900+4*850+200);
    setTimeout(play,9800);};
  reset();if(RM){items.forEach(x=>x.classList.add("on"));setN(7);setShield(7);$("mOk").classList.add("on");}
  else{let started=false;new IntersectionObserver(es=>{if(!started&&es.some(e=>e.isIntersecting)){started=true;play();}},{threshold:.35}).observe($("nn"));}
  // collectible badges
  const ACH=[["Première série","7 jours d'affilée","t-flame","#FFB26B","#C2410C","rgba(234,88,12,.7)"],["100 QCU","bonnes réponses","i-target","#6EE7B7","#047857","rgba(16,185,129,.7)"],["Examen blanc","premier terminé","n-clipboard","#7DD3FC","#1D4ED8","rgba(59,130,246,.75)"],["20 sur 20","sans aucune faute","t-award","#FFE27A","#D97706","rgba(245,158,11,.75)"],["Top 10","de ta classe","i-trophy","#D8B4FE","#6D28D9","rgba(124,58,237,.75)"],["Annale maîtrisée","corrigée et comprise","i-scroll","#FDA4AF","#BE123C","rgba(225,29,72,.7)"]];
  $("ach").innerHTML=ACH.map(a=>`<div class="a1">${badge([0,0,0,0,a[3],a[4],a[5],a[2]])}<b>${a[0]}</b><span>${a[1]}</span></div>`).join("");
})();

/* ---------- boot ---------- */
function boot(){fitAll();dashLife();phoneLife();dSetup();}
if(document.readyState==="complete")boot();else addEventListener("load",boot);
