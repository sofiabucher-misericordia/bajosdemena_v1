/* ===== SHARED CORE UTILITIES ===== */

// Animated counter
function animateCounter(el, target, duration = 2000, prefix = '', suffix = '') {
  const start = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = prefix + current.toLocaleString('es-CL') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Init counters via IntersectionObserver
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target._counted) {
        entry.target._counted = true;
        const target = parseFloat(entry.target.dataset.counter);
        const prefix = entry.target.dataset.prefix || '';
        const suffix = entry.target.dataset.suffix || '';
        animateCounter(entry.target, target, 2000, prefix, suffix);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

// Progress bar
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  });
}

// Video autoplay via IntersectionObserver
function initVideoAutoplay() {
  const videos = document.querySelectorAll('video[data-autoplay]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play().catch(() => {});
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.3 });
  videos.forEach(v => obs.observe(v));
}

// Card video hover
function initCardVideoHover() {
  document.querySelectorAll('.card-video').forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;
    card.addEventListener('mouseenter', () => video.play().catch(() => {}));
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
  });
}

export { animateCounter, initCounters, initProgressBar, initVideoAutoplay, initCardVideoHover };
