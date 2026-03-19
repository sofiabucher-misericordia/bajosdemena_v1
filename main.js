/* ===== BAJOS DE MENA — MAIN JS ===== */

// ---- Progress Bar ----
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
  });
}

// ---- Nav scroll effect ----
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ---- Animated counter ----
function animateCounter(el, target, duration = 2200) {
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const start = performance.now();

  function update(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const cur = target * eased;
    el.textContent = prefix + (decimals ? cur.toFixed(decimals) : Math.round(cur).toLocaleString('es-CL')) + suffix;
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const els = document.querySelectorAll('[data-counter]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target._done) {
        e.target._done = true;
        animateCounter(e.target, parseFloat(e.target.dataset.counter));
      }
    });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}

// ---- Etapas tabs ----
function initEtapasTabs() {
  const tabs = document.querySelectorAll('.etapa-tab');
  const panels = document.querySelectorAll('.etapa-panel');

  function activate(idx) {
    tabs.forEach((t, i) => t.classList.toggle('active', i === idx));
    panels.forEach((p, i) => p.classList.toggle('active', i === idx));
  }

  activate(0);
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(i));
  });
}

// ---- Presupuesto bars ----
function initPresupuestoBars() {
  const bars = document.querySelectorAll('.presupuesto-card__bar-fill');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.width = e.target.dataset.width;
        }, 300);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => obs.observe(b));
}

// ---- Video play button ----
function initVideoPlayer() {
  const btn = document.getElementById('video-play-btn');
  const video = document.getElementById('hero-video-player');
  if (!btn || !video) return;

  btn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      btn.classList.add('hidden');
    }
  });

  video.addEventListener('pause', () => btn.classList.remove('hidden'));
}

// ---- GSAP Scroll Animations ----
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Fade up on every .reveal element
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.fromTo(el, {
      opacity: 0,
      y: 40
    }, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Stagger children
  gsap.utils.toArray('.reveal-stagger').forEach(parent => {
    const children = parent.children;
    gsap.fromTo(children, {
      opacity: 0,
      y: 30
    }, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: parent,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Hero entrance
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .fromTo('.hero__eyebrow', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.8 }, 0.3)
    .fromTo('.hero__title', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 0.5)
    .fromTo('.hero__subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, 0.8)
    .fromTo('.hero__meta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 1.0)
    .fromTo('.hero__scroll', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.3);

  // Cierre section pin animation
  const cierreSec = document.querySelector('.cierre-section');
  if (cierreSec) {
    gsap.fromTo('.cierre-logo', { scale: 0.5, opacity: 0 }, {
      scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.7)',
      scrollTrigger: { trigger: cierreSec, start: 'top 70%' }
    });
    gsap.fromTo('.cierre-title', { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 1,
      scrollTrigger: { trigger: cierreSec, start: 'top 65%' }
    });
  }
}

// ---- Chart.js budget chart ----
function initChart() {
  const canvas = document.getElementById('budget-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !canvas._inited) {
        canvas._inited = true;
        new Chart(canvas, {
          type: 'bar',
          data: {
            labels: ['Saneamiento\nTotal', 'Construcción\nTotal', 'Etapa 1\nTotal', 'Capilla', 'Edificio\nContenedores', 'Saneam.\nEtapa 1'],
            datasets: [{
              label: 'Monto (CLP)',
              data: [780000000, 1806080000, 1500000000, 600000000, 500000000, 303140000],
              backgroundColor: [
                'rgba(245, 197, 24, 0.8)',
                'rgba(245, 197, 24, 0.6)',
                'rgba(245, 197, 24, 0.9)',
                'rgba(245, 197, 24, 0.5)',
                'rgba(245, 197, 24, 0.4)',
                'rgba(245, 197, 24, 0.3)',
              ],
              borderColor: 'rgba(245, 197, 24, 1)',
              borderWidth: 1,
              borderRadius: 4,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: { duration: 1500, easing: 'easeOutQuart' },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: ctx => ' $' + ctx.parsed.y.toLocaleString('es-CL')
                }
              }
            },
            scales: {
              x: {
                ticks: { color: '#7a7670', font: { size: 11 } },
                grid: { color: 'rgba(255,255,255,0.04)' }
              },
              y: {
                ticks: {
                  color: '#7a7670',
                  callback: val => '$' + (val / 1000000).toFixed(0) + 'M'
                },
                grid: { color: 'rgba(255,255,255,0.04)' }
              }
            }
          }
        });
      }
    });
  }, { threshold: 0.3 });
  obs.observe(canvas);
}

// ---- Init all ----
document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initNav();
  initCounters();
  initEtapasTabs();
  initPresupuestoBars();
  initVideoPlayer();
  initChart();
  initScrollAnimations();
});
