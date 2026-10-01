const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const STORAGE = "euviral-projects-v2";
const state = {format:"reels", goal:"engajar", tone:"direto", generated:false, slides:[]};

const templates = {
  reels: {
    engajar: ["Você está fazendo isso e nem percebeu.","A maioria das pessoas complica isso sem necessidade.","Se eu tivesse que começar do zero hoje, faria assim."],
    ensinar: ["Quer aprender isso de um jeito simples? Começa aqui.","Em 30 segundos, vou te mostrar como fazer isso.","Salva este passo a passo porque você vai usar de novo."],
    vender: ["Antes de comprar qualquer coisa, veja isso.","Se você quer chegar em [resultado], presta atenção.","O que ninguém te conta antes de escolher isso:"],
    conectar: ["Eu também já passei por isso.","Talvez você precisava ouvir isso hoje.","Se essa fase parece familiar, fica comigo."]
  },
  tiktok: {
    engajar: ["Pare de fazer isso se você quer mais resultado.","POV: você finalmente entendeu como isso funciona.","Ninguém fala sobre essa parte, então eu vou falar."],
    ensinar: ["3 coisas que eu faria diferente hoje.","Anota: esse é o jeito mais simples de começar.","Tutorial rápido: faz exatamente assim."],
    vender: ["Eu testei para você não precisar testar no escuro.","Se você está procurando [resultado], olha isso.","3 motivos para considerar essa solução."],
    conectar: ["Isso aconteceu comigo e talvez aconteça com você.","Confissão: eu também achava que era impossível.","Se você está nessa fase, esse vídeo é para você."]
  },
  carousel: {
    engajar: ["5 verdades sobre [tema] que quase ninguém fala.","Pare de ignorar estes sinais sobre [tema].","O que eu gostaria de ter aprendido antes sobre [tema]."],
    ensinar: ["Guia prático: [tema] sem complicação.","Passo a passo para entender [tema].","Salva este carrossel: você vai consultar depois."],
    vender: ["Antes de escolher, compare estes pontos.","O checklist que eu usaria antes de comprar.","Quer [resultado]? Comece avaliando isso."],
    conectar: ["Se você se identifica com isso, não está sozinho.","Talvez esta seja a parte que ninguém te contou.","Uma conversa honesta sobre [tema]."]
  }
};

const examples = [
  "como criar uma rotina mais produtiva","como cuidar melhor do dinheiro","ideias de conteúdo para uma pequena empresa",
  "como começar a treinar","erros comuns no atendimento ao cliente","como melhorar a comunicação no trabalho"
];

function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove("show"),2200)}
function labelFormat(){return state.format==="reels"?"REELS · 9:16":state.format==="tiktok"?"TIKTOK · 9:16":"CARROSSEL · 4:5"}
function readFields(){state.tone=$("#tone").value}
function buildContent(){
  const topic=$("#topic").value.trim() || "seu tema";
  const goal=state.goal, tone=state.tone;
  const pool=templates[state.format][goal];
  let hook=pool[Math.floor(Math.random()*pool.length)].replaceAll("[tema]",topic).replaceAll("[resultado]", "esse resultado");
  const toneLine={direto:"Sem enrolação: vamos direto ao ponto.",leve:"Vamos deixar isso simples, leve e prático.",profissional:"A abordagem mais eficiente começa pelo essencial.",inspirador:"Comece pequeno, mas comece com intenção.",provocativo:"E aqui está a parte que quase ninguém quer admitir."}[tone];
  const goalLine={engajar:"Convide a pessoa a comentar uma experiência ou opinião.",ensinar:"Entregue um passo acionável que possa ser testado hoje.",vender:"Mostre o benefício com clareza e conduza para uma próxima ação.",conectar:"Use uma experiência real e termine abrindo espaço para identificação."}[goal];
  const script = state.format==="carousel"
    ? `SLIDE 1 — ${hook}\n\nSLIDE 2 — O problema\nExplique em uma frase por que ${topic} merece atenção.\n\nSLIDE 3 — O ponto principal\nApresente a primeira ideia prática e elimine uma dúvida comum.\n\nSLIDE 4 — Como aplicar\nDê um exemplo simples relacionado a ${topic}.\n\nSLIDE 5 — O que evitar\nMostre um erro frequente e como corrigir.\n\nSLIDE 6 — Fechamento\nReforce a transformação e leve a pessoa para a próxima ação.`
    : `0–3s — GANCHO\n${hook}\n\n3–8s — CONTEXTO\n${toneLine} Apresente rapidamente o problema relacionado a ${topic} e por que ele importa.\n\n8–22s — DESENVOLVIMENTO\nMostre 2 ou 3 pontos concretos. Use exemplos curtos, frases na tela e cortes sempre que houver uma nova ideia.\n\n22–30s — ENTREGA\n${goalLine}\n\n30s+ — FECHAMENTO\nResuma a ideia em uma frase e faça a chamada para ação.`;
  const cta = goal==="engajar"?"Comenta “EU” se você quer mais conteúdos assim.":goal==="ensinar"?"Salva este conteúdo para colocar em prática depois.":goal==="vender"?"Quer ajuda para aplicar isso? Fale comigo pelo perfil.":"Compartilha com alguém que precisava ouvir isso hoje.";
  return {topic,hook,script,cta};
}
function renderGenerated(){
  const data=buildContent(); state.generated=true; state.current=data;
  $("#emptyState").classList.add("hidden"); $("#resultState").classList.remove("hidden");
  $("#resultFormat").textContent=labelFormat(); $("#resultGoal").textContent=state.goal.toUpperCase();
  $("#hook").value=data.hook; $("#script").value=data.script; $("#cta").value=data.cta;
  $("#previewFormat").textContent=state.format==="carousel"?"CARROSSEL 4:5":state.format.toUpperCase();
  $("#previewHook").textContent=data.hook; updateCounter(); renderSlides();
  $("#projectStatus").textContent="EDITANDO";
  if(state.format==="carousel") $("#carouselPreview").classList.remove("hidden"); else $("#carouselPreview").classList.add("hidden");
  toast("Conteúdo criado. Agora você pode editar tudo.");
}
function updateCounter(){ $("#scriptCounter").textContent=`${$("#script").value.length} caracteres`; $("#previewHook").textContent=$("#hook").value||"Seu gancho aparece aqui."; }
function renderSlides(){
  const wrap=$("#slides"); wrap.innerHTML="";
  const text=$("#script").value.split(/\n\n/).filter(Boolean);
  state.slides = state.slides.length ? state.slides : [
    $("#hook").value, "O problema e por que ele importa.", "A primeira ideia prática.", "Como aplicar na vida real.", "O erro que você deve evitar.", $("#cta").value
  ];
  state.slides.forEach((s,i)=>{
    const row=document.createElement("div"); row.className="slide";
    row.innerHTML=`<span class="slide-num">${String(i+1).padStart(2,"0")}</span><textarea rows="2">${escapeHtml(s)}</textarea><button class="delete-slide" title="Excluir slide">×</button>`;
    row.querySelector("textarea").addEventListener("input",e=>state.slides[i]=e.target.value);
    row.querySelector("button").onclick=()=>{state.slides.splice(i,1);renderSlides()};
    wrap.appendChild(row);
  });
}
function escapeHtml(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
function projectFromUI(){
  return {id:Date.now(),created:new Date().toISOString(),format:state.format,goal:state.goal,tone:state.tone,topic:$("#topic").value.trim(),hook:$("#hook").value,script:$("#script").value,cta:$("#cta").value,slides:[...state.slides]};
}
function getHistory(){try{return JSON.parse(localStorage.getItem(STORAGE)||"[]")}catch{return[]}}
function setHistory(v){localStorage.setItem(STORAGE,JSON.stringify(v));updateHistoryCount()}
function updateHistoryCount(){$("#historyCount").textContent=getHistory().length}
function saveProject(){
  if(!state.generated){toast("Gere um conteúdo antes de salvar.");return}
  const p=projectFromUI(), list=getHistory().filter(x=>x.id!==p.id); list.unshift(p); setHistory(list.slice(0,30)); $("#projectStatus").textContent="SALVO"; toast("Projeto salvo no histórico.");
}
function loadProject(p){
  state.format=p.format;state.goal=p.goal;state.tone=p.tone;state.generated=true;state.slides=p.slides||[];
  $("#topic").value=p.topic;$("#tone").value=p.tone;
  $$(".format-card").forEach(x=>x.classList.toggle("selected",x.dataset.format===state.format));
  $$(".chip").forEach(x=>x.classList.toggle("selected",x.dataset.goal===state.goal));
  $("#emptyState").classList.add("hidden");$("#resultState").classList.remove("hidden");
  $("#resultFormat").textContent=labelFormat();$("#resultGoal").textContent=state.goal.toUpperCase();
  $("#hook").value=p.hook;$("#script").value=p.script;$("#cta").value=p.cta;$("#previewFormat").textContent=state.format==="carousel"?"CARROSSEL 4:5":state.format.toUpperCase();updateCounter();renderSlides();
  $("#carouselPreview").classList.toggle("hidden",state.format!=="carousel"); navigate("studio");toast("Projeto carregado.");
}
function renderHistory(){
  const list=getHistory(), wrap=$("#historyList"), empty=$("#historyEmpty");wrap.innerHTML="";empty.classList.toggle("hidden",list.length>0);
  list.forEach(p=>{
    const card=document.createElement("article");card.className="history-card";
    const date=new Date(p.created).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"});
    card.innerHTML=`<span class="tag">${labelFor(p.format)} · ${date}</span><h3>${escapeHtml(p.topic||"Sem tema")}</h3><p>${escapeHtml(p.hook)}</p><div class="history-actions"><button class="open">Abrir</button><button class="remove">Excluir</button></div>`;
    card.querySelector(".open").onclick=()=>loadProject(p);card.querySelector(".remove").onclick=()=>{setHistory(getHistory().filter(x=>x.id!==p.id));renderHistory();toast("Projeto removido.")};wrap.appendChild(card);
  });updateHistoryCount();
}
function labelFor(f){return f==="reels"?"Reels":f==="tiktok"?"TikTok":"Carrossel"}
function navigate(view){$$(".view").forEach(v=>v.classList.remove("active"));$(`#${view}View`).classList.add("active");$$(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.nav===view));if(view==="history")renderHistory();scrollTo({top:0,behavior:"smooth"})}

$$(".nav-btn,[data-nav]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.nav)));
$$(".format-card").forEach(b=>b.addEventListener("click",()=>{state.format=b.dataset.format;$$(".format-card").forEach(x=>x.classList.toggle("selected",x===b));}));
$$(".chip").forEach(b=>b.addEventListener("click",()=>{state.goal=b.dataset.goal;$$(".chip").forEach(x=>x.classList.toggle("selected",x===b));}));
$("#tone").addEventListener("change",readFields);
$("#generateBtn").onclick=renderGenerated;
$("#surpriseBtn").onclick=()=>{$("#topic").value=examples[Math.floor(Math.random()*examples.length)];renderGenerated()};
$("#script").addEventListener("input",updateCounter);$("#hook").addEventListener("input",updateCounter);
$("#saveBtn").onclick=saveProject;
$("#copyBtn").onclick=async()=>{if(!state.generated)return toast("Nada para copiar ainda.");const text=`${$("#hook").value}\n\n${$("#script").value}\n\n${$("#cta").value}`;try{await navigator.clipboard.writeText(text);toast("Conteúdo copiado.");}catch{toast("Não foi possível copiar.");}};
$$("[data-copy-target]").forEach(b=>b.onclick=async()=>{const el=$("#"+b.dataset.copyTarget);try{await navigator.clipboard.writeText(el.value);toast("Copiado.");}catch{toast("Não foi possível copiar.");}});
$("#toggleSafe").onclick=()=>{const o=$("#safeOverlay");o.classList.toggle("hidden");$("#toggleSafe").textContent=o.classList.contains("hidden")?"Mostrar guia":"Ocultar guia"};
$("#addSlide").onclick=()=>{state.slides.push("Novo slide — escreva sua ideia aqui.");renderSlides()};
$("#clearHistory").onclick=()=>{if(confirm("Excluir todos os projetos salvos neste dispositivo?")){setHistory([]);renderHistory();toast("Histórico limpo.")}};
$("#topic").addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter")renderGenerated()});
updateHistoryCount();

let deferredInstall;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstall=e;$("#installBtn").classList.remove("hidden")});
$("#installBtn").onclick=async()=>{if(!deferredInstall)return;deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;$("#installBtn").classList.add("hidden")};
if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
