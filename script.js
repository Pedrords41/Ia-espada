/* ═══════════════════════════════════════════════
   SHADOWBLADE — SCRIPT PRINCIPAL
   Responsável por:
   1. Partículas de fundo
   2. Validação visual do login
   3. Animação da espada (mover → crescer → cortar)
   4. Separação da tela e revelação da dashboard
   5. Contadores animados e gráfico de barras
═══════════════════════════════════════════════ */

'use strict';

/* ─── Elementos do DOM ──────────────────────── */
const loginScreen    = document.getElementById('login-screen');
const cutOverlay     = document.getElementById('cut-overlay');
const mainScreen     = document.getElementById('main-screen');
const swordContainer = document.getElementById('sword-container');
const swordSvg       = document.getElementById('sword-svg');
const centerSwordWrap= document.getElementById('center-sword-wrap');
const crackLine      = document.getElementById('crack-line');
const leftHalf       = document.getElementById('left-half');
const rightHalf      = document.getElementById('right-half');
const loginBtn       = document.getElementById('login-btn');
const errorMsg       = document.getElementById('error-msg');
const particles      = document.getElementById('particles');


/* ════════════════════════════════════════════
   1. PARTÍCULAS DE FUNDO
════════════════════════════════════════════ */
function createParticles() {
  const count = 40;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left     = Math.random() * 100 + 'vw';
    p.style.bottom   = '-4px';
    p.style.setProperty('--dur',   (4 + Math.random() * 8) + 's');
    p.style.setProperty('--delay', (Math.random() * 8) + 's');
    p.style.width    = (1 + Math.random() * 2) + 'px';
    p.style.height   = p.style.width;
    p.style.opacity  = 0;
    particles.appendChild(p);
  }
}

createParticles();


/* ════════════════════════════════════════════
   2. VALIDAÇÃO VISUAL DO LOGIN
════════════════════════════════════════════ */
function handleLogin() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Esconde erro anterior
  errorMsg.classList.remove('visible');

  // Validação: apenas verifica se os campos foram preenchidos
  if (!username || !password) {
    errorMsg.classList.add('visible');
    return;
  }

  // Salva o nome para uso na dashboard
  const displayName = username.toUpperCase();
  document.getElementById('display-username').textContent = displayName;
  document.getElementById('welcome-name').textContent      = displayName;

  // Desabilita o botão e inicia animação
  loginBtn.classList.add('loading');
  loginBtn.querySelector('.btn-text').textContent = 'AUTENTICANDO...';

  // Pequeno delay antes da animação começar
  setTimeout(() => startSwordAnimation(), 600);
}

// Permite acionar com a tecla Enter
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleLogin();
});


/* ════════════════════════════════════════════
   3. ANIMAÇÃO DA ESPADA
════════════════════════════════════════════ */
function startSwordAnimation() {
  // Clona o SVG da espada para o overlay central
  const clonedSvg = swordSvg.cloneNode(true);
  clonedSvg.setAttribute('width',  '80');
  clonedSvg.setAttribute('height', '260');
  centerSwordWrap.innerHTML = '';
  centerSwordWrap.appendChild(clonedSvg);

  // Ativa o overlay
  cutOverlay.classList.add('active');

  // Captura posição original da espada (canto superior esquerdo)
  const swordRect = swordContainer.getBoundingClientRect();
  const startX = swordRect.left + swordRect.width / 2;
  const startY = swordRect.top  + swordRect.height / 2;

  // Posiciona a espada clonada na posição de origem
  centerSwordWrap.style.transition = 'none';
  centerSwordWrap.style.transform  =
    `translate(calc(${startX}px - 50%), calc(${startY}px - 50%)) scale(0.55)`;
  centerSwordWrap.style.opacity = '1';

  // Esconde espada original
  swordContainer.style.opacity = '0';

  // ─ Fase 1: mover para o centro da tela ─────
  setTimeout(() => {
    centerSwordWrap.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s';
    centerSwordWrap.style.transform  = 'translate(-50%, -50%) scale(0.8)';
  }, 50);

  // ─ Fase 2: crescer ──────────────────────────
  setTimeout(() => {
    centerSwordWrap.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.3, 0.64, 1)';
    centerSwordWrap.style.transform  = 'translate(-50%, -50%) scale(2.2)';
  }, 850);

  // ─ Fase 3: tremor antes do golpe ────────────
  setTimeout(() => {
    centerSwordWrap.style.animation = 'swordShake 0.25s ease-in-out';
    addShakeStyle();
  }, 1450);

  // ─ Fase 4: executa o corte ──────────────────
  setTimeout(() => {
    executeCut();
  }, 1750);
}

/* Adiciona keyframe de tremor dinamicamente */
function addShakeStyle() {
  if (document.getElementById('shake-style')) return;
  const style = document.createElement('style');
  style.id = 'shake-style';
  style.textContent = `
    @keyframes swordShake {
      0%,100% { transform: translate(-50%,-50%) scale(2.2) rotate(0deg); }
      25%      { transform: translate(-48%,-50%) scale(2.2) rotate(-2deg); }
      75%      { transform: translate(-52%,-50%) scale(2.2) rotate(2deg); }
    }
  `;
  document.head.appendChild(style);
}


/* ════════════════════════════════════════════
   4. EXECUÇÃO DO CORTE E SEPARAÇÃO DA TELA
════════════════════════════════════════════ */
function executeCut() {
  // Esconde a espada com fade
  centerSwordWrap.style.transition = 'opacity 0.15s, transform 0.15s';
  centerSwordWrap.style.opacity    = '0';
  centerSwordWrap.style.transform  = 'translate(-50%, -300%) scale(2.2)'; // espada "sobe" após cortar

  // Ativa as metades pretas (copiam a aparência da tela)
  leftHalf.style.opacity  = '1';
  rightHalf.style.opacity = '1';

  // Revela a rachadura luminosa
  crackLine.style.transition = 'height 0.2s linear';
  crackLine.style.height     = '120%';

  // Efeito de flash branco na tela toda
  setTimeout(() => {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position:fixed; inset:0; z-index:220;
      background:rgba(255,30,0,0.18);
      animation:flashOut 0.4s ease-out forwards;
      pointer-events:none;
    `;
    addFlashStyle();
    cutOverlay.appendChild(flash);
  }, 150);

  // ─ Separação das metades ──────────────────────
  setTimeout(() => {
    // Fade out da rachadura
    crackLine.style.transition = 'opacity 0.3s';
    crackLine.style.opacity    = '0';

    // Revela a main screen por baixo
    mainScreen.style.opacity        = '1';
    mainScreen.style.pointerEvents  = 'all';

    // Anima as metades saindo para os lados
    leftHalf.style.transition  = 'transform 0.65s cubic-bezier(0.55, 0, 1, 0.45)';
    rightHalf.style.transition = 'transform 0.65s cubic-bezier(0.55, 0, 1, 0.45)';
    leftHalf.style.transform   = 'translateX(-100%)';
    rightHalf.style.transform  = 'translateX(100%)';

  }, 350);

  // ─ Limpa o overlay e mostra dashboard ────────
  setTimeout(() => {
    cutOverlay.style.display = 'none';
    loginScreen.style.display = 'none';
    cutOverlay.classList.remove('active');

    // Inicia os efeitos da dashboard
    initDashboard();

  }, 1050);
}

/* Keyframe do flash vermelho */
function addFlashStyle() {
  if (document.getElementById('flash-style')) return;
  const style = document.createElement('style');
  style.id = 'flash-style';
  style.textContent = `
    @keyframes flashOut {
      0%   { opacity: 1; }
      100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}


/* ════════════════════════════════════════════
   5. DASHBOARD — EFEITOS PÓS-LOGIN
════════════════════════════════════════════ */
function initDashboard() {
  animateCounters();
  buildChart();
  animateStatBars();
}

/* ─── Contadores animados ───────────────────── */
function animateCounters() {
  const values = document.querySelectorAll('.stat-value[data-target]');
  values.forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out expo
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  });
}

/* ─── Animação das barras de progresso ──────── */
function animateStatBars() {
  // As barras têm width definido via style inline no HTML,
  // mas começam em 0 via CSS. Um pequeno delay garante a transição.
  const fills = document.querySelectorAll('.stat-fill');
  fills.forEach((fill, i) => {
    const targetWidth = fill.style.width;
    fill.style.width = '0';
    setTimeout(() => {
      fill.style.width = targetWidth;
    }, 200 + i * 100);
  });
}

/* ─── Gráfico de barras da semana ───────────── */
function buildChart() {
  const chartBars = document.getElementById('chart-bars');
  // Valores simulados de atividade por dia (%)
  const data = [45, 72, 58, 91, 67, 38, 55];
  chartBars.innerHTML = '';

  data.forEach((value, i) => {
    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    bar.style.height = '0%';
    // Inicia animação com delay escalonado
    setTimeout(() => {
      bar.style.height = value + '%';
    }, 100 + i * 80);
    chartBars.appendChild(bar);
  });
}

/* ─── Botão de logout ───────────────────────── */
function handleLogout() {
  // Fade out da dashboard
  mainScreen.style.transition = 'opacity 0.5s';
  mainScreen.style.opacity    = '0';

  setTimeout(() => {
    // Reseta estado
    mainScreen.style.pointerEvents = 'none';
    loginScreen.style.display      = 'flex';
    loginScreen.style.opacity      = '0';
    swordContainer.style.opacity   = '1';
    loginBtn.classList.remove('loading');
    loginBtn.querySelector('.btn-text').textContent = 'ENTRAR';
    errorMsg.classList.remove('visible');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    crackLine.style.height   = '0';
    crackLine.style.opacity  = '1';
    leftHalf.style.transform  = '';
    rightHalf.style.transform = '';
    leftHalf.style.opacity    = '0';
    rightHalf.style.opacity   = '0';

    // Fade in da login screen
    requestAnimationFrame(() => {
      loginScreen.style.transition = 'opacity 0.5s';
      loginScreen.style.opacity    = '1';
    });

  }, 500);
}