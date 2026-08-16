const chartSets = {
  robots: [
    { name: 'N2', value: 71, color: 'linear-gradient(90deg,#93c5fd,#2563eb)' },
    { name: 'Bumi', value: 64, color: 'linear-gradient(90deg,#99f6e4,#14b8a6)' },
    { name: 'E1', value: 65, color: 'linear-gradient(90deg,#ddd6fe,#7c3aed)' }
  ],
  scenes: [
    { name: '商业导览', value: 44, color: 'linear-gradient(90deg,#93c5fd,#2563eb)' },
    { name: '教育实验室', value: 28, color: 'linear-gradient(90deg,#99f6e4,#14b8a6)' },
    { name: '展厅服务', value: 44, color: 'linear-gradient(90deg,#ddd6fe,#7c3aed)' },
    { name: '科研测试', value: 53, color: 'linear-gradient(90deg,#bfdbfe,#0f62fe)' },
    { name: '复杂户外', value: 31, color: 'linear-gradient(90deg,#fed7aa,#f97316)' }
  ],
  priority: [
    { name: 'P0 当天处理', value: 53, color: 'linear-gradient(90deg,#fecaca,#ef4444)' },
    { name: 'P1 重点跟进', value: 21, color: 'linear-gradient(90deg,#fed7aa,#f59e0b)' },
    { name: 'P2 排期观察', value: 17, color: 'linear-gradient(90deg,#bfdbfe,#2563eb)' }
  ]
};

function markActiveNav() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current) link.classList.add('active');
  });
}

function initNavigation() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  if (!nav || !toggle) return;

  const closeMenu = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '打开导航菜单');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? '关闭导航菜单' : '打开导航菜单');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
}

function initRobotShowcase() {
  const tabs = [...document.querySelectorAll('.robot-tab')];
  const panels = [...document.querySelectorAll('[data-robot-panel]')];
  if (!tabs.length || !panels.length) return;

  const selectRobot = selectedTab => {
    const robot = selectedTab.dataset.robot;
    tabs.forEach(tab => {
      const active = tab === selectedTab;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => {
      const active = panel.dataset.robotPanel === robot;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectRobot(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const offset = event.key === 'ArrowRight' ? 1 : -1;
      const next = tabs[(index + offset + tabs.length) % tabs.length];
      selectRobot(next);
      next.focus();
    });
  });
}

function initHeroDataField() {
  const canvas = document.querySelector('.hero-data-field');
  const hero = document.querySelector('.home-hero');
  if (!canvas || !hero) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let frameId = 0;
  let visible = true;
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;

  const hash = (row, column, salt = 0) => {
    const value = Math.sin(row * 91.7 + column * 47.3 + salt * 19.1) * 43758.5453;
    return value - Math.floor(value);
  };

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(bounds.width));
    height = Math.max(1, Math.round(bounds.height));
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    draw(reducedMotion ? 1.8 : performance.now() / 1000);
  };

  const draw = time => {
    context.clearRect(0, 0, width, height);
    pointerX += (targetX - pointerX) * .035;
    pointerY += (targetY - pointerY) * .035;

    const mobile = width < 640;
    const columns = mobile ? 18 : 36;
    const rows = mobile ? 11 : 17;
    const horizon = height * .08;
    const fieldHeight = height * .9;

    for (let row = 0; row < rows; row += 1) {
      const depth = row / Math.max(1, rows - 1);
      const perspective = .22 + depth * .92;
      const y = horizon + Math.pow(depth, 1.48) * fieldHeight + pointerY * depth;

      for (let column = 0; column < columns; column += 1) {
        if (hash(row, column) > (mobile ? .25 : .32)) continue;

        const horizontal = column / Math.max(1, columns - 1) - .5;
        const x = width * .5 + horizontal * width * perspective + pointerX * depth;
        const wave = Math.max(0, Math.sin(time * (.42 + hash(row, column, 2) * .35) + hash(row, column, 3) * 12));
        const packet = Math.pow(wave, 9);
        const sequence = Math.pow(Math.max(0, Math.sin(time * .72 - row * .52 + column * .18)), 14);
        let alpha = .085 + packet * .68 + sequence * .42;

        if (x < width * .56 && y > height * .14 && y < height * .8) alpha *= .12;
        if (y < height * .22) alpha *= .55;

        const radius = .72 + depth * 1.6 + packet * .78;
        const warm = hash(row, column, 5) > .82;
        const color = warm ? '123, 167, 255' : '71, 226, 177';

        context.beginPath();
        context.fillStyle = `rgba(${color}, ${alpha})`;
        context.shadowColor = `rgba(${color}, ${Math.min(.55, alpha)})`;
        context.shadowBlur = 5 + depth * 9;
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();

        if (sequence > .76 && row < rows - 1) {
          const nextDepth = (row + 1) / Math.max(1, rows - 1);
          const nextY = horizon + Math.pow(nextDepth, 1.48) * fieldHeight + pointerY * nextDepth;
          context.beginPath();
          context.strokeStyle = `rgba(${color}, ${alpha * .22})`;
          context.lineWidth = .6;
          context.moveTo(x, y + 2);
          context.lineTo(x + horizontal * 8, nextY - 3);
          context.stroke();
        }
      }
    }
    context.shadowBlur = 0;
  };

  const animate = now => {
    if (!visible) {
      frameId = 0;
      return;
    }
    draw(now / 1000);
    frameId = requestAnimationFrame(animate);
  };

  hero.addEventListener('pointermove', event => {
    const bounds = hero.getBoundingClientRect();
    targetX = ((event.clientX - bounds.left) / bounds.width - .5) * 12;
    targetY = ((event.clientY - bounds.top) / bounds.height - .5) * 7;
  });
  hero.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
  });

  const visibilityObserver = new IntersectionObserver(entries => {
    const nextVisible = entries[0]?.isIntersecting ?? true;
    if (nextVisible === visible) return;
    visible = nextVisible;
    if (!visible) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    } else if (!reducedMotion && !frameId) {
      frameId = requestAnimationFrame(animate);
    }
  }, { threshold: 0 });
  visibilityObserver.observe(hero);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(hero);
  resize();

  if (!reducedMotion) frameId = requestAnimationFrame(animate);
  window.addEventListener('pagehide', () => cancelAnimationFrame(frameId), { once: true });
}

function renderBarCharts() {
  document.querySelectorAll('[data-chart]').forEach(container => {
    const key = container.dataset.chart;
    const data = chartSets[key] || [];
    const max = Math.max(...data.map(d => d.value), 1);
    container.innerHTML = data.map(d => `
      <div class="bar-row">
        <div class="bar-name">${d.name}</div>
        <div class="track"><div class="fill" style="--bar-width:${Math.max(6, d.value / max * 100)}%; background:${d.color}"></div></div>
        <div class="bar-value">${d.value}</div>
      </div>
    `).join('');
  });
}

function initReveal() {
  const targets = document.querySelectorAll('.card, .metric, .performance-item, .flow-node, .decision-rail > div, .robot-panel, .bento, .preview-role, .moat-card, .step, .route, .layer-card, .roadmap-item, .spread-card, .gate-node, .gate-route');
  targets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  targets.forEach(el => io.observe(el));
}

function initChartGrowth() {
  const charts = document.querySelectorAll('.chart');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        entry.target.querySelectorAll('.fill').forEach((fill, index) => {
          fill.style.transitionDelay = `${index * 90}ms`;
        });
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .18 });
  charts.forEach(chart => io.observe(chart));
}

function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    counters.forEach(el => {
      const target = Number(el.dataset.count);
      const state = { value: 0 };
      gsap.to(state, {
        value: target,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onUpdate: () => { el.textContent = Math.round(state.value); }
      });
    });
    return;
  }
  counters.forEach(el => {
    const target = Number(el.dataset.count);
    const start = performance.now();
    const duration = 900;
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

function initGsapMotion() {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out', duration: .8 });

  const heroTargets = document.querySelectorAll('.eyebrow, h1, .hero-copy-panel p, .page-hero p, .hero-actions');
  if (heroTargets.length) {
    gsap.from(heroTargets, { y: 24, autoAlpha: 0, stagger: .1, duration: .9 });
  }

  const robotStage = document.querySelector('.robot-stage');
  if (robotStage) gsap.from(robotStage, { x: 36, scale: .96, autoAlpha: 0, duration: 1 });

  const stageChips = document.querySelectorAll('.stage-chip');
  if (stageChips.length) gsap.from(stageChips, { y: 18, autoAlpha: 0, stagger: .12, delay: .35, duration: .7 });

  const factoryOrbit = document.querySelector('.factory-orbit');
  if (factoryOrbit) {
    gsap.from(factoryOrbit, {
      scale: .92,
      rotation: -2,
      autoAlpha: 0,
      scrollTrigger: { trigger: factoryOrbit, start: 'top 80%', once: true }
    });
    const orbitChips = document.querySelectorAll('.orbit-chip');
    if (orbitChips.length) {
      gsap.from(orbitChips, {
        scale: .82,
        y: 18,
        autoAlpha: 0,
        stagger: { each: .1, from: 'center' },
        scrollTrigger: { trigger: factoryOrbit, start: 'top 74%', once: true }
      });
    }
  }

  const factoryCore = document.querySelector('.factory-core');
  if (factoryCore) gsap.to(factoryCore, { y: -8, repeat: -1, yoyo: true, duration: 2.8, ease: 'sine.inOut' });
}

renderBarCharts();
markActiveNav();
initNavigation();
initRobotShowcase();
initHeroDataField();
initReveal();
initChartGrowth();
animateCounters();
initGsapMotion();
