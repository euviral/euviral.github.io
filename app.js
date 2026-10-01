(() => {
  'use strict';

  const STORAGE_KEY = 'euviral.history.v1';
  const MAX_HISTORY = 12;
  const state = { format: 'reels', generated: '' };

  const $ = (id) => document.getElementById(id);
  const topic = $('topic');
  const output = $('output');
  const result = $('result');
  const resultFormat = $('resultFormat');
  const historyList = $('historyList');
  const generateBtn = $('generateBtn');
  const toast = $('toast');

  const labels = {
    reels: 'Instagram Reels · 9:16',
    tiktok: 'TikTok · 9:16',
    carrossel: 'Carrossel · 4:5'
  };

  function notify(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function clean(value) {
    return value.replace(/\s+/g, ' ').trim();
  }

  function makeScript(theme, format) {
    const intro = `TEMA: ${theme}`;
    if (format === 'carrossel') {
      return `${intro}\n\nSLIDE 1 — GANCHO\nVocê está falando sobre “${theme}” do jeito que todo mundo fala? Pare aqui.\n\nSLIDE 2 — CONTEXTO\nMostre em uma frase por que esse tema importa para quem está vendo o post.\n\nSLIDE 3 — PROBLEMA\nApresente o erro, dúvida ou oportunidade mais comum relacionada ao tema.\n\nSLIDE 4 — VALOR\nEntregue 3 pontos práticos que a pessoa consegue aplicar hoje.\n• Ponto 1: explique com um exemplo.\n• Ponto 2: mostre um caminho simples.\n• Ponto 3: destaque um cuidado importante.\n\nSLIDE 5 — EXEMPLO\nDemonstre como aplicar a ideia em uma situação real e curta.\n\nSLIDE 6 — CTA\n“Salve este post para consultar depois e envie para alguém que precisa ver isso.”\n\nLEGENDA\nComece com uma frase que retome o gancho, entregue o contexto em 2 linhas e termine com uma pergunta para incentivar comentários.`;
    }

    return `${intro}\n\nGANCHO · 0–3s\n“Se você quer melhorar ${theme.toLowerCase()}, preste atenção nisso antes de continuar.”\n\nDESENVOLVIMENTO · 3–25s\n1. Apresente o problema em uma frase.\n2. Explique a causa ou contexto sem enrolação.\n3. Entregue 3 ações práticas.\n4. Dê um exemplo visual para cada ação.\n\nCORTE / RITMO\n• Troque enquadramento ou texto na tela a cada ideia.\n• Use frases curtas na tela.\n• Corte pausas e repetições.\n\nCTA · FINAL\n“Se isso te ajudou, salve este vídeo e compartilhe com alguém que precisa dessa dica.”\n\nTEXTO DE CAPA\n${theme}\n\nLEGENDA\nResuma a promessa do vídeo, liste os 3 pontos principais e finalize com uma pergunta curta.`;
  }

  function setFormat(format) {
    state.format = format;
    document.querySelectorAll('.format-tab').forEach((button) => {
      button.classList.toggle('active', button.dataset.format === format);
    });
    document.querySelectorAll('[data-format]').forEach((button) => {
      if (button.classList.contains('mosaic-card')) button.setAttribute('aria-pressed', button.dataset.format === format ? 'true' : 'false');
    });
    resultFormat.textContent = labels[format];
  }

  function generate() {
    const theme = clean(topic.value);
    if (!theme) {
      topic.focus();
      notify('Digite um tema para começar.');
      return;
    }
    generateBtn.disabled = true;
    $('generateText').textContent = 'Criando...';
    window.setTimeout(() => {
      state.generated = makeScript(theme, state.format);
      output.value = state.generated;
      resultFormat.textContent = labels[state.format];
      result.classList.remove('hidden');
      generateBtn.disabled = false;
      $('generateText').textContent = 'Criar roteiro';
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      notify('Roteiro criado.');
    }, 280);
  }

  function getHistory() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  }

  function saveHistory() {
    const theme = clean(topic.value);
    const text = clean(output.value);
    if (!theme || !text) { notify('Gere um roteiro antes de salvar.'); return; }
    const items = getHistory();
    items.unshift({ id: Date.now(), theme, format: state.format, text, createdAt: new Date().toISOString() });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_HISTORY))); renderHistory(); notify('Salvo no histórico.'); } catch { notify('Não foi possível salvar neste navegador.'); }
  }

  function renderHistory() {
    const items = getHistory();
    if (!items.length) { historyList.innerHTML = '<p class="empty">Nenhum conteúdo salvo ainda.</p>'; return; }
    historyList.innerHTML = items.map((item) => `
      <article class="history-item">
        <div><strong>${escapeHtml(item.theme)}</strong><small>${escapeHtml(labels[item.format] || item.format)} · ${new Date(item.createdAt).toLocaleDateString('pt-BR')}</small></div>
        <button class="secondary-btn load-history" data-id="${item.id}" type="button">Abrir</button>
      </article>`).join('');
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[char]));
  }

  function loadHistory(id) {
    const item = getHistory().find((entry) => String(entry.id) === String(id));
    if (!item) return;
    topic.value = item.theme;
    setFormat(item.format);
    output.value = item.text;
    state.generated = item.text;
    result.classList.remove('hidden');
    document.getElementById('criador').scrollIntoView({ behavior: 'smooth', block: 'start' });
    notify('Conteúdo aberto.');
  }

  function clearHistory() {
    if (!getHistory().length) { notify('O histórico já está vazio.'); return; }
    if (window.confirm('Apagar todos os conteúdos salvos neste dispositivo?')) {
      localStorage.removeItem(STORAGE_KEY);
      renderHistory();
      notify('Histórico apagado.');
    }
  }

  async function copyOutput() {
    const text = output.value;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      notify('Roteiro copiado.');
    } catch {
      output.focus(); output.select(); document.execCommand('copy');
      notify('Roteiro copiado.');
    }
  }

  document.querySelectorAll('.format-tab').forEach((button) => button.addEventListener('click', () => setFormat(button.dataset.format)));
  document.querySelectorAll('.mosaic-card[data-format]').forEach((button) => button.addEventListener('click', () => { setFormat(button.dataset.format); document.getElementById('criador').scrollIntoView({ behavior: 'smooth' }); topic.focus(); }));
  generateBtn.addEventListener('click', generate);
  topic.addEventListener('keydown', (event) => { if (event.key === 'Enter') generate(); });
  $('copyBtn').addEventListener('click', copyOutput);
  $('saveBtn').addEventListener('click', saveHistory);
  $('newBtn').addEventListener('click', () => { topic.value = ''; output.value = ''; state.generated = ''; result.classList.add('hidden'); topic.focus(); });
  $('clearHistoryBtn').addEventListener('click', clearHistory);
  historyList.addEventListener('click', (event) => { const button = event.target.closest('.load-history'); if (button) loadHistory(button.dataset.id); });

  let zoneVisible = true;
  $('toggleZoneBtn').addEventListener('click', () => {
    zoneVisible = !zoneVisible;
    document.querySelectorAll('.phone-frame .zone').forEach((zone) => zone.style.display = zoneVisible ? '' : 'none');
    $('toggleZoneBtn').textContent = zoneVisible ? 'Ocultar guia' : 'Mostrar guia';
  });

  let deferredInstallPrompt = null;
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    $('installBtn').classList.remove('hidden');
  });
  $('installBtn').addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    $('installBtn').classList.add('hidden');
  });

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }

  renderHistory();
})();
