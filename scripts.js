/* =====================================================================
   Evam Global Trading FZCO — shared scripts · v2
   ===================================================================== */
(function () {

  /* Live Dubai time */
  function updateDubaiTime() {
    const el = document.getElementById('dubaiTime');
    if (!el) return;
    try {
      el.textContent = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Dubai',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(new Date());
    } catch { el.textContent = '—'; }
  }
  updateDubaiTime();
  setInterval(updateDubaiTime, 1000);

  /* Nav scroll state */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Mobile menu */
  const menuBtn = document.querySelector('.nav__menu-btn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      menuBtn.classList.toggle('is-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        menuBtn.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }
  const mobileClose = document.querySelector('.mobile-menu__close');
  if (mobileClose && mobileMenu && menuBtn) {
    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      menuBtn.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  }

  /* Scroll reveal */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

  /* Count-up */
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1300;
    const start = performance.now();
    function frame(t) {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); countObs.unobserve(e.target); } });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

  /* FAQ accordion */
  document.querySelectorAll('.faq__item').forEach(item => {
    const btn = item.querySelector('.faq__btn');
    const ans = item.querySelector('.faq__a');
    if (!btn || !ans) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq__item').forEach(i => {
        i.classList.remove('is-open');
        const a = i.querySelector('.faq__a');
        if (a) a.style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('is-open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  /* Dot grid for reach map */
  function generateDotGrid(targetId, w, h, spacing) {
    const g = document.getElementById(targetId);
    if (!g) return;
    const svgNS = 'http://www.w3.org/2000/svg';
    for (let y = spacing; y < h; y += spacing) {
      for (let x = spacing; x < w; x += spacing) {
        if (Math.random() > 0.55) continue;
        const c = document.createElementNS(svgNS, 'circle');
        c.setAttribute('cx', x);
        c.setAttribute('cy', y);
        c.setAttribute('r', 1.2);
        c.setAttribute('class', 'map-grid-dot');
        g.appendChild(c);
      }
    }
  }
  generateDotGrid('reachDotGrid', 600, 500, 18);

  /* Contact form pseudo-submit */
  const form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (!btn) return;
      const orig = btn.innerHTML;
      btn.innerHTML = 'Sending… <span class="arrow">→</span>';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = '✓ Inquiry received';
        btn.style.background = '#2F8F5C';
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.disabled = false;
          btn.style.background = '';
          form.reset();
        }, 2200);
      }, 800);
    });
  }

})();
