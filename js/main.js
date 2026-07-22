// INSIGHT FOUNDATION - MAIN JAVASCRIPT
document.addEventListener('DOMContentLoaded', () => {

  // ─── PAGE TRANSITION (ICO style — fade up on enter, fade down on leave) ──
  // Trigger enter animation on every page load
  document.body.classList.add('page-entering');
  document.body.addEventListener('animationend', () => {
    document.body.classList.remove('page-entering');
  }, { once: true });

  // Intercept internal link clicks — play leave animation then navigate
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (
      !href ||
      href.startsWith('http') ||
      href.startsWith('//') ||
      href.startsWith('#') ||
      href.startsWith('mailto') ||
      href.startsWith('tel') ||
      href.startsWith('javascript') ||
      link.target === '_blank'
    ) return;

    e.preventDefault();
    document.body.classList.add('page-leaving');
    setTimeout(() => {
      window.location.href = href;
    }, 290);
  });

  // ─── BACK TO TOP ─────────────────────────────────────────────────────────
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── YEAR IN FOOTER ──────────────────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ─── HAMBURGER MENU ──────────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('main-nav');
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('active');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    // Close nav on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mainNav.contains(e.target)) {
        mainNav.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });
  }

  // ─── STICKY HEADER SHADOW ────────────────────────────────────────────────
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      siteHeader.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ─── STICKY CTA VISIBILITY ───────────────────────────────────────────────
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    window.addEventListener('scroll', () => {
      stickyCTA.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
  }

  // ─── SCROLL REVEAL ───────────────────────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade').forEach(el => revealObserver.observe(el));

  // ─── COUNTER ANIMATION ───────────────────────────────────────────────────
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseInt(entry.target.dataset.target);
        const suffix = entry.target.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();
        const animate = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          entry.target.textContent = Math.floor(eased * target).toLocaleString() + suffix;
          if (t < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.stat-num[data-target], .tamil-stat-num[data-target], .kn-num[data-target], .impact-counter-num[data-target]').forEach(el => counterObserver.observe(el));

  // ─── HERO CAROUSEL ───────────────────────────────────────────────────────
  const heroSlides = [
    {
      img: 'assets/hero-1.jpg',
      // eyebrow: 'Welcome to The Insight Foundation',
      title: 'Opening Every Door to',
      accent: 'Opportunity',
      desc: 'A Sri Lankan educational development institution committed to expanding human potential, strengthening national workforce capabilities, and advancing social inclusion.',
      primary: { label: 'Explore Our Institutions →', to: 'training&programs.html' },
      secondary: { label: 'Support a Student', to: 'donation.html' }
    },
    {
      img: 'assets/hero-2.jpg',
      //eyebrow: 'NVQ Vocational Training',
      title: 'Hands-on Skills for',
      accent: 'Real-World Careers',
      desc: 'Four training centres delivering TVEC-accredited NVQ Level 3 & 4 training in automobile, electrical, refrigeration, IT and digital design — built for employability.',
      primary: { label: 'View Programs →', to: 'training&programs.html' },
      secondary: { label: 'Contact Us', to: 'contact.html' }
    },
    {
      img: 'assets/hero-3.jpg',
      //eyebrow: 'Tamil-Medium Excellence',
      title: 'Breaking Barriers,',
      accent: 'Building Futures',
      desc: "Sri Lanka's only non-profit provider of Tamil-medium technical vocational education — removing language, geography and economics as barriers to opportunity.",
      primary: { label: 'Learn More →', to: 'news.html' },
      secondary: { label: 'Our Partners', to: 'our-partners.html' }
    }
  ];

  let currentSlide = 0;
  let heroTimer = null;
  const heroText = document.getElementById('hero-text');
  const heroBgImg = document.getElementById('hero-bg-img');
  const dots = document.querySelectorAll('.dot');

  function updateHero(index, direction = 'next') {
    const slide = heroSlides[index];
    if (!heroText || !heroBgImg) return;

    // Fade out — opacity only, no transform to avoid position shifts
    heroText.style.transition = 'opacity 0.4s ease';
    heroText.style.opacity = '0';
    heroBgImg.style.transition = 'opacity 0.5s ease';
    heroBgImg.style.opacity = '0';

    setTimeout(() => {
      heroText.innerHTML = `
        ${slide.eyebrow ? `<div class="eyebrow"><span class="sparkle">✦</span> ${slide.eyebrow}</div>` : ''}
        <h1>${slide.title} <span class="gradient-text">${slide.accent}</span></h1>
        <p>${slide.desc}</p>
        <div class="hero-btns">
          <a href="${slide.primary.to}" class="btn btn-brand">${slide.primary.label}</a>
          <a href="${slide.secondary.to}" class="btn btn-outline-white">${slide.secondary.label}</a>
        </div>
      `;
      heroBgImg.src = slide.img;

      // Remove transition, set invisible, force reflow, then fade in
      heroText.style.transition = 'none';
      heroText.style.opacity = '0';
      heroText.offsetHeight; // force reflow
      heroText.style.transition = 'opacity 0.7s ease';
      heroBgImg.style.transition = 'opacity 0.9s ease';
      heroText.style.opacity = '1';
      heroBgImg.style.opacity = '1';

      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }, 420);
  }

  function startHeroTimer() {
    heroTimer = setInterval(() => {
      currentSlide = (currentSlide + 1) % heroSlides.length;
      updateHero(currentSlide);
    }, 6000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(heroTimer);
      currentSlide = i;
      updateHero(currentSlide);
      startHeroTimer();
    });
  });

  if (heroText && heroBgImg) startHeroTimer();

  // ─── TESTIMONIALS CAROUSEL (new style) ──────────────────────────────────
  initTestiCarousel('.testi-carousel', '.testi-track', '.testi-dots', '.testi-prev', '.testi-next', 2800);

  // ─── NEWS CAROUSEL (new style) ───────────────────────────────────────────
  initTestiCarousel('.news-carousel-wrap .testi-carousel', '.news-testi-track', '.news-testi-dots', '.news-testi-prev', '.news-testi-next', 0);

  // ─── TESTI CAROUSEL FACTORY ──────────────────────────────────────────────
  function initTestiCarousel(wrapSel, trackSel, dotsSel, prevSel, nextSel, autoDelay) {
    const wrap = document.querySelector(wrapSel);
    if (!wrap) return;
    const track = wrap.querySelector(trackSel);
    if (!track) return;
    const slides = Array.from(track.children);
    if (slides.length === 0) return;

    const dotsWrap = wrap.querySelector(dotsSel);
    const prevBtn = wrap.querySelector(prevSel);
    const nextBtn = wrap.querySelector(nextSel);
    let current = 0;
    let autoTimer = null;

    // Build dots
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'testi-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', `Slide ${i + 1}`);
        d.addEventListener('click', () => { clearAuto(); goTo(i); startAuto(); });
        dotsWrap.appendChild(d);
      });
    }

    function goTo(index) {
      if (index >= slides.length) index = 0;
      if (index < 0) index = slides.length - 1;
      current = index;
      // Each slide is 100% of viewport width
      const vp = wrap.querySelector('.testi-viewport');
      const w = vp ? vp.offsetWidth : wrap.offsetWidth;
      track.style.transform = `translateX(-${w * current}px)`;
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === current));
      }
    }

    function startAuto() {
      if (!autoDelay) return;
      clearAuto();
      autoTimer = setInterval(() => goTo(current + 1), autoDelay);
    }
    function clearAuto() { clearInterval(autoTimer); }

    if (prevBtn) prevBtn.addEventListener('click', () => { clearAuto(); goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { clearAuto(); goTo(current + 1); startAuto(); });

    // Swipe
    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = tx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { clearAuto(); goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
    });

    // Recalc on resize
    window.addEventListener('resize', () => goTo(current));

    goTo(0);
    startAuto();
  }
  function initCarousel(wrapSel, trackSel, dotSel, prevSel, nextSel, autoDelay) {
    const wrap = document.querySelector(wrapSel);
    if (!wrap) return;

    const viewport = wrap.querySelector('.carousel-viewport');
    const track = wrap.querySelector(trackSel);
    if (!track) return;
    const slides = Array.from(track.children);
    if (slides.length === 0) return;

    const dotsContainer = wrap.querySelector('.carousel-dots');
    const prevBtn = wrap.querySelector(prevSel);
    const nextBtn = wrap.querySelector(nextSel);

    let current = 0;
    let perView = getPerView();
    let autoTimer = null;

    function getPerView() {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return Math.min(2, parseInt(wrap.dataset.perView || 3));
      return parseInt(wrap.dataset.perView || 3);
    }

    function getSlidesTotal() {
      // Number of positions we can scroll to
      return Math.max(1, slides.length - perView + 1);
    }

    function setSlideSizes() {
      const w = (viewport || wrap).offsetWidth;
      const slideW = w / perView;
      slides.forEach(s => { s.style.width = slideW + 'px'; });
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const total = getSlidesTotal();
      for (let i = 0; i < total; i++) {
        const d = document.createElement('button');
        d.className = 'carousel-dot-btn' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', `Slide ${i + 1}`);
        d.addEventListener('click', () => { clearAuto(); goTo(i); startAuto(); });
        dotsContainer.appendChild(d);
      }
    }

    function goTo(index) {
      const total = getSlidesTotal();
      // Loop: wrap around
      if (index >= total) index = 0;
      if (index < 0) index = total - 1;
      current = index;

      const slideW = (viewport || wrap).offsetWidth / perView;
      track.style.transform = `translateX(-${slideW * current}px)`;

      if (dotsContainer) {
        dotsContainer.querySelectorAll('.carousel-dot-btn').forEach((d, i) => d.classList.toggle('active', i === current));
      }
    }

    function startAuto() {
      if (!autoDelay) return;
      clearAuto();
      autoTimer = setInterval(() => goTo(current + 1), autoDelay);
    }
    function clearAuto() { clearInterval(autoTimer); }

    if (prevBtn) prevBtn.addEventListener('click', () => { clearAuto(); goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { clearAuto(); goTo(current + 1); startAuto(); });

    // Touch/swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { clearAuto(); goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
    });

    // Responsive rebuild
    window.addEventListener('resize', () => {
      const newPer = getPerView();
      perView = newPer;
      setSlideSizes();
      buildDots();
      goTo(0);
    });

    setSlideSizes();
    buildDots();
    goTo(0);
    startAuto();
  }

  // ─── TESTIMONIALS CAROUSEL ───────────────────────────────────────────────
  initCarousel('.testimonials-carousel', '.testimonials-track', null, '.testimonials-prev', '.testimonials-next', 4000);

  // ─── GALLERY CAROUSEL ────────────────────────────────────────────────────
  initCarousel('.gallery-carousel', '.gallery-track', null, '.gallery-prev', '.gallery-next', 0);

  // ─── NEWS CAROUSEL ───────────────────────────────────────────────────────
  initCarousel('.news-carousel', '.news-track', null, '.news-prev', '.news-next', 0);

  // ─── SDG ACCORDION ───────────────────────────────────────────────────────
  document.querySelectorAll('.sdg-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const block = btn.closest('.sdg-block');
      const body = block.querySelector('.sdg-block-body');
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // Close others
      document.querySelectorAll('.sdg-block-body.is-open').forEach(b => {
        if (b !== body) {
          b.classList.remove('is-open');
          b.style.maxHeight = '0';
          b.closest('.sdg-block').querySelector('.sdg-toggle').setAttribute('aria-expanded', 'false');
        }
      });
      btn.setAttribute('aria-expanded', !isOpen);
      if (!isOpen) {
        body.classList.add('is-open');
        body.style.maxHeight = body.scrollHeight + 'px';
      } else {
        body.classList.remove('is-open');
        body.style.maxHeight = '0';
      }
    });
  });

  // ─── CONTACT FORM — mailto fallback (no backend yet) ────────────────────
  window.handleContact = (e) => {
    e.preventDefault();
    const form = e.target;

    // Clear previous errors
    form.querySelectorAll('.field-error').forEach(el => el.remove());
    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    // Validate required fields
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const isEmpty = field.tagName === 'SELECT' ? field.value === '' : field.value.trim() === '';
      if (isEmpty) {
        valid = false;
        field.classList.add('input-error');
        const err = document.createElement('span');
        err.className = 'field-error';
        err.textContent = 'This field is required';
        field.parentNode.appendChild(err);
      }
    });
    if (!valid) return;

    // Build mailto: link from form data
    const name    = (form.querySelector('[name="name"]')         || {}).value || '';
    const email   = (form.querySelector('[name="email"]')        || {}).value || '';
    const phone   = (form.querySelector('[name="phone"]')        || {}).value || '';
    const type    = (form.querySelector('[name="enquiry-type"]') || {}).value || '';
    const subject = (form.querySelector('[name="subject"]')      || {}).value || 'Website Enquiry';
    const message = (form.querySelector('[name="message"]')      || {}).value || '';

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : '',
      type  ? `Enquiry Type: ${type}` : '',
      '',
      message
    ].filter(Boolean).join('\n');

    const mailto = `mailto:foundation@insight.edu.lk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;

    // Show confirmation in the button while the email client opens
    const btn = form.querySelector('[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '✓ Opening your email app…';
    btn.style.background = 'var(--tertiary)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  };

  // ─── NEWSLETTER FORM — no backend yet, show acknowledgement ─────────────
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = (newsletterForm.querySelector('input[type="email"]') || {}).value.trim();
      if (!email) return;

      // Show thank-you message in place of the form
      newsletterForm.innerHTML = `
        <div class="newsletter-success">
          <i class="fas fa-check-circle"></i>
          <div>
            <strong>Thank you for your interest!</strong>
            <p>We have noted your email. Our team will be in touch once our mailing list is set up. In the meantime, feel free to <a href="contact.html" style="color:var(--primary);font-weight:600;">contact us directly</a>.</p>
          </div>
        </div>`;
    });
  }

  // ─── ACTIVE NAV HIGHLIGHT ON SCROLL ──────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.main-nav .nav-link').forEach(link => {
            link.classList.toggle('section-active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => navObserver.observe(s));
  }

});


// ─── NEWS FILTER DROPDOWNS ────────────────────────────────────────────────
(function () {
  const filtersBar = document.getElementById('news-filters-bar');
  if (!filtersBar) return;

  // ── Dropdown open/close ──────────────────────────────────────────────────
  const dropdowns = filtersBar.querySelectorAll('.nf-dropdown');

  dropdowns.forEach(dd => {
    const btn  = dd.querySelector('.nf-dropdown-btn');
    const list = dd.querySelector('.nf-dropdown-list');

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dd.classList.contains('open');
      // Close all first
      dropdowns.forEach(d => { d.classList.remove('open'); d.querySelector('.nf-dropdown-btn').setAttribute('aria-expanded', 'false'); });
      if (!isOpen) {
        dd.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Option click
    list.querySelectorAll('.nf-option').forEach(opt => {
      opt.addEventListener('click', () => {
        list.querySelectorAll('.nf-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        btn.querySelector('.nf-selected-label').textContent = opt.textContent;
        dd.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        applyFilters();
      });
    });
  });

  // Close on outside click
  document.addEventListener('click', () => {
    dropdowns.forEach(d => { d.classList.remove('open'); d.querySelector('.nf-dropdown-btn').setAttribute('aria-expanded', 'false'); });
  });

  // ── Clear button ─────────────────────────────────────────────────────────
  const resetBtn = document.getElementById('nf-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      dropdowns.forEach(dd => {
        const opts = dd.querySelectorAll('.nf-option');
        opts.forEach(o => o.classList.remove('active'));
        opts[0].classList.add('active');                         // reset to first ("all")
        dd.querySelector('.nf-selected-label').textContent = opts[0].textContent;
        dd.classList.remove('open');
      });
      applyFilters();
    });
  }

  // ── Filter logic ─────────────────────────────────────────────────────────
  function applyFilters() {
    const catDd   = document.getElementById('nf-category');
    const yearDd  = document.getElementById('nf-year');
    const catVal  = catDd  ? catDd.querySelector('.nf-option.active').dataset.value  : 'all';
    const yearVal = yearDd ? yearDd.querySelector('.nf-option.active').dataset.value : 'all';

    const cards   = document.querySelectorAll('#recent-updates-list .news-article-card');
    let visible   = 0;

    cards.forEach(card => {
      const matchCat  = catVal  === 'all' || card.dataset.category === catVal;
      const matchYear = yearVal === 'all' || card.dataset.year      === yearVal;
      const show = matchCat && matchYear;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    const noResults = document.getElementById('nf-no-results');
    if (noResults) noResults.style.display = visible === 0 ? 'flex' : 'none';
  }

  // Init — show all
  applyFilters();
})();

// ══════════════════════════════════════════════════════
// GLOBAL SCROLL ANIMATIONS — runs on every page
// ══════════════════════════════════════════════════════
(function () {

  // ── Inject scroll progress bar if not already in HTML ──────────────────
  if (!document.getElementById('scroll-progress')) {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.prepend(bar);
  }
  const progressBar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }, { passive: true });

  // ── Auto-apply reveal-left / reveal-right to two-column grids ──────────
  // Only on screens wider than 768px to avoid mobile overlap issues
  if (window.innerWidth > 768) {
    document.querySelectorAll(
      '.opening-grid, .who-we-are-grid, .zakat-grid, .endow-why-grid, .endow-transparency-grid, .transparency-grid, .donate-intro-grid, .gov-framework-grid'
    ).forEach(grid => {
      const children = Array.from(grid.children);
      children.forEach((child, i) => {
        if (!child.classList.contains('reveal') &&
            !child.classList.contains('reveal-left') &&
            !child.classList.contains('reveal-right')) {
          child.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
        }
      });
    });
  }

  // ── Auto-apply reveal-scale to cards that only have reveal ─────────────
  // Cards in 3-col and 2-col grids get a subtle scale-up on entry
  document.querySelectorAll(
    '.cards-3 .card:not(.reveal-scale), .ways-grid .way-card:not(.reveal-scale), .ioc-grid .ioc-card:not(.reveal-scale)'
  ).forEach((card, i) => {
    if (!card.classList.contains('reveal-left') && !card.classList.contains('reveal-right')) {
      card.classList.add('reveal-scale');
      // Stagger by position
      const delay = (i % 3) * 80;
      card.style.transitionDelay = delay + 'ms';
    }
  });

  // ── Observer for ALL animation classes ─────────────────────────────────
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        // Icon bounce: bounce any icon inside the newly-visible card
        entry.target.querySelectorAll('.card-icon, .ioc-icon, .vmv-icon-wrap, .way-icon').forEach((icon, idx) => {
          setTimeout(() => icon.classList.add('bounced'), idx * 80);
        });

        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-left, .reveal-right, .reveal-scale, .reveal-fade').forEach(el => {
    animObserver.observe(el);
  });

  // ── Section header underline — removed ────────────────────────────────

  // ── Timeline items: alternate left/right ───────────────────────────────
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    const card = item.querySelector('.timeline-card');
    if (card && !card.classList.contains('reveal-left') && !card.classList.contains('reveal-right')) {
      card.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
      animObserver.observe(card);
    }
  });

  // ── Process steps (donation / endowment page) scale-up ─────────────────
  document.querySelectorAll('.process-step').forEach((step, i) => {
    if (!step.classList.contains('reveal') && !step.classList.contains('reveal-scale')) {
      step.classList.add('reveal-scale');
      step.style.transitionDelay = (i * 100) + 'ms';
      animObserver.observe(step);
    }
  });

  // ── CTA banner scale-up ─────────────────────────────────────────────────
  document.querySelectorAll('.cta-banner').forEach(banner => {
    if (!banner.classList.contains('reveal-scale')) {
      banner.classList.add('reveal-scale');
      animObserver.observe(banner);
    }
  });

  // ── VMV cards: staggered left-slide ────────────────────────────────────
  document.querySelectorAll('.who-right .vmv-card, .vmv-card').forEach((card, i) => {
    if (!card.classList.contains('reveal') && !card.classList.contains('reveal-left')) {
      card.classList.add('reveal-left');
      card.style.transitionDelay = (i * 100) + 'ms';
      animObserver.observe(card);
    }
  });

  // ── Impact counter cards: right-slide ──────────────────────────────────
  document.querySelectorAll('.impact-counter-card, .donate-counter-card').forEach((card, i) => {
    if (!card.classList.contains('reveal')) {
      card.classList.add('reveal-right');
      card.style.transitionDelay = (i * 120) + 'ms';
      animObserver.observe(card);
    }
  });

  // ── News / article cards: fade up ──────────────────────────────────────
  document.querySelectorAll('.news-article-card, .partner-card, .testimonial-card').forEach((card, i) => {
    if (!card.classList.contains('reveal') && !card.classList.contains('reveal-scale')) {
      card.classList.add('reveal');
      card.style.transitionDelay = (i % 3 * 80) + 'ms';
      animObserver.observe(card);
    }
  });

  // ── Governance blocks (about page) ─────────────────────────────────────
  document.querySelectorAll('.gov-block, .gov-person, .gov-director-card').forEach((el, i) => {
    if (!el.classList.contains('reveal') && !el.classList.contains('reveal-scale')) {
      el.classList.add('reveal-scale');
      el.style.transitionDelay = (i % 4 * 60) + 'ms';
      animObserver.observe(el);
    }
  });

  // ── Zakat cert list items ───────────────────────────────────────────────
  document.querySelectorAll('.zakat-cert-list li, .endow-zakat-list li, .compliance-row, .gov-check-item').forEach((el, i) => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i * 60) + 'ms';
      animObserver.observe(el);
    }
  });

})();
