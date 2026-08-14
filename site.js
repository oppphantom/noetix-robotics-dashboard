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
  const targets = document.querySelectorAll('.card, .metric, .gateway-card, .moat-card, .step, .route, .layer-card, .roadmap-item, .spread-card, .gate-node, .gate-route');
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

  gsap.from('.eyebrow, h1, .hero-copy-panel p, .page-hero p, .hero-actions', {
    y: 24,
    autoAlpha: 0,
    stagger: .1,
    duration: .9
  });
  gsap.from('.robot-stage', { x: 36, scale: .96, autoAlpha: 0, duration: 1 });
  gsap.from('.stage-chip', { y: 18, autoAlpha: 0, stagger: .12, delay: .35, duration: .7 });
  gsap.from('.factory-orbit', {
    scale: .92,
    rotation: -2,
    autoAlpha: 0,
    scrollTrigger: { trigger: '.factory-orbit', start: 'top 80%', once: true }
  });
  gsap.from('.orbit-chip', {
    scale: .82,
    y: 18,
    autoAlpha: 0,
    stagger: { each: .1, from: 'center' },
    scrollTrigger: { trigger: '.factory-orbit', start: 'top 74%', once: true }
  });
  gsap.to('.factory-core', { y: -8, repeat: -1, yoyo: true, duration: 2.8, ease: 'sine.inOut' });
}

renderBarCharts();
markActiveNav();
initReveal();
initChartGrowth();
animateCounters();
initGsapMotion();
