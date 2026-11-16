(()=> {
"use strict";
const translations={
 fr:{bismillah:"Au nom d’Allah, le Tout Miséricordieux, le Très Miséricordieux",verse:"et contre le mal de l’envieux lorsqu’il envie",closing:"Allah, le Très-Haut, dit la vérité"},
 en:{bismillah:"In the name of Allah, the Most Compassionate, the Most Merciful",verse:"and from the evil of an envier when they envy",closing:"Allah Almighty has spoken the truth"},
 es:{bismillah:"En el nombre de Alá, el Clemente, el Misericordioso",verse:"y del mal del envidioso cuando envidia",closing:"Alá, el Altísimo, ha dicho la verdad"},
 de:{bismillah:"Im Namen Allahs, des Allerbarmers, des Barmherzigen",verse:"und vor dem Übel eines Neiders, wenn er neidet",closing:"Allah, der Erhabene, hat die Wahrheit gesprochen"},
 tr:{bismillah:"Rahmân ve Rahîm olan Allah’ın adıyla",verse:"haset ettiği zaman hasetçinin şerrinden",closing:"Yüce Allah doğru söylemiştir"}
};
const css=`
.quran-brand-suite{display:flex;align-items:center;gap:clamp(10px,2vw,22px);min-width:0;max-width:100%}
.quran-brand-suite>.brand,.quran-brand-suite>.brand-logo-lockup{flex:0 0 auto;transform:translateX(-5px)}
.quran-verse-frame{position:relative;isolation:isolate;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-width:230px;max-width:390px;padding:10px 19px 9px;border:1px solid rgba(37,201,160,.52);border-radius:19px;background:linear-gradient(145deg,rgba(255,255,255,.97),rgba(237,249,255,.94));box-shadow:0 7px 0 rgba(26,139,132,.08),0 12px 25px rgba(46,112,145,.12),inset 0 1px 0 #fff;color:#176e67;text-align:center;overflow:hidden}
.quran-verse-frame:before,.quran-verse-frame:after{content:"۞";position:absolute;z-index:-1;color:rgba(37,201,160,.19);font-family:serif;font-size:36px;line-height:1}
.quran-verse-frame:before{inset-inline-start:7px;top:4px}
.quran-verse-frame:after{inset-inline-end:7px;bottom:2px}
.quran-frame-kicker{font-size:9px;font-weight:800;letter-spacing:.16em;color:#55a8ad;text-transform:uppercase}
.quran-frame-arabic{font-family:"Amiri","Noto Naskh Arabic","Traditional Arabic",serif;font-size:clamp(15px,1.45vw,19px);font-weight:700;line-height:1.55;color:#176e67;text-shadow:0 1px 0 #fff}
.quran-frame-translation{max-width:100%;font-family:Inter,system-ui,sans-serif;font-size:10px;font-weight:650;line-height:1.45;color:#397b9a}
.quran-frame-closing{font-family:"Amiri","Noto Naskh Arabic","Traditional Arabic",serif;font-size:11px;color:#8b9b9d}
.quran-brand-suite .brand-full-logo{max-width:min(100%,260px)}
@media(max-width:680px){
 .quran-brand-suite{width:100%;justify-content:center;flex-wrap:wrap;gap:8px}
 .quran-brand-suite>.brand,.quran-brand-suite>.brand-logo-lockup{transform:translateX(-2px)}
 .quran-verse-frame{min-width:0;width:min(100%,360px);padding:8px 15px;border-radius:16px}
 .quran-frame-arabic{font-size:16px}
 .quran-frame-translation{font-size:9px}
}
@media(min-width:681px) and (max-width:900px){.quran-verse-frame{min-width:205px;padding-inline:12px}.quran-frame-arabic{font-size:15px}}
html[dir="rtl"] .quran-brand-suite{direction:rtl}
html[dir="ltr"] .quran-brand-suite{direction:ltr}
@media(prefers-reduced-motion:no-preference){.quran-verse-frame{transition:transform .25s ease,box-shadow .25s ease}.quran-verse-frame:hover{transform:translateY(-2px);box-shadow:0 9px 0 rgba(26,139,132,.07),0 16px 28px rgba(46,112,145,.16),inset 0 1px 0 #fff}}
`;
function mount(){
 if(document.querySelector(".quran-brand-suite"))return;
 const brand=document.querySelector("header .brand-logo-lockup,header .brand,header a.brand,.dashboard-header .brand,.brand");
 if(!brand||!brand.parentElement)return;
 const suite=document.createElement("div");suite.className="quran-brand-suite";
 brand.parentElement.insertBefore(suite,brand);suite.appendChild(brand);
 const lang=(document.documentElement.lang||(()=>{try{return localStorage.getItem("msdz-language")||"ar"}catch(e){return"ar"}})()).toLowerCase().slice(0,2);
 const tr=translations[lang]||null;
 const frame=document.createElement("div");frame.className="quran-verse-frame";frame.setAttribute("role","note");frame.setAttribute("aria-label","آيات من سورة الفلق");
 frame.innerHTML='<span class="quran-frame-kicker">✦ آية مباركة ✦</span><span class="quran-frame-arabic" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span><span class="quran-frame-arabic" lang="ar" dir="rtl">وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ</span>'+(tr?'<span class="quran-frame-translation" lang="'+lang+'" dir="auto">'+tr.bismillah+' · '+tr.verse+'</span>':'')+'<span class="quran-frame-closing" lang="ar" dir="rtl">صَدَقَ اللَّهُ الْعَظِيمُ</span>'+(tr?'<span class="quran-frame-translation" lang="'+lang+'" dir="auto">'+tr.closing+'</span>':'');
 suite.appendChild(frame);
 function refreshQuranTranslation(){
  let current=(document.documentElement.lang||"ar").toLowerCase().slice(0,2);
  if(current==="ar"){try{current=(localStorage.getItem("msdz-language")||"ar").toLowerCase().slice(0,2)}catch(e){}}
  const copy=translations[current]||null;
  let lines=frame.querySelectorAll(".quran-frame-translation");
  if(copy){
   if(!lines.length){
    const first=document.createElement("span");first.className="quran-frame-translation";
    const second=document.createElement("span");second.className="quran-frame-translation";
    frame.querySelector(".quran-frame-closing").before(first);frame.querySelector(".quran-frame-closing").after(second);
    lines=frame.querySelectorAll(".quran-frame-translation");
   }
   lines[0].textContent=copy.bismillah+" · "+copy.verse;lines[0].lang=current;lines[0].dir="auto";
   lines[1].textContent=copy.closing;lines[1].lang=current;lines[1].dir="auto";
  }else{lines.forEach(node=>node.remove());}
  frame.querySelector(".quran-frame-kicker").textContent=copy?"✦ "+({fr:"VERSET CORANIQUE",en:"QURANIC VERSE",es:"VERSÍCULO CORÁNICO",de:"KORANVERS",tr:"KUR’AN AYETİ"}[current]||"آية مباركة")+" ✦":"✦ آية مباركة ✦";
 }
 new MutationObserver(refreshQuranTranslation).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
 document.querySelectorAll("select[id*=Language],select[id*=language]").forEach(select=>select.addEventListener("change",()=>setTimeout(refreshQuranTranslation,0)));
 const style=document.createElement("style");style.id="quran-brand-frame-styles";style.textContent=css;document.head.appendChild(style);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();