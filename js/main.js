/* =============================================
   SCROP — Laboratoires Oscorpe
   Brigade 21 — THE GLITCH 2026
   Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initConsentPopup();
  initScrollCounter();
  initScrollAnimations();
  initCounters();
  initCartButtons();
  initCarousel();
  initFakeFeed();
  initQuiz();
  initEssaiChart();
  initRechuteMode();
});

/* =============================================
   NAVBAR — Scroll behavior & active section
   ============================================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          navbar.classList.add('navbar--scrolled');
        } else {
          navbar.classList.remove('navbar--scrolled');
        }
        updateActiveSection(sections, navLinks);
        ticking = false;
      });
      ticking = true;
    }
  });
}

function updateActiveSection(sections, navLinks) {
  const scrollPos = window.scrollY + window.innerHeight / 3;
  let currentSection = '';

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollPos >= top && scrollPos < top + height) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('navbar__link--active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('navbar__link--active');
    }
  });
}

/* =============================================
   MOBILE MENU
   ============================================= */
function initMobileMenu() {
  const burger = document.getElementById('burgerBtn');
  if (!burger) return;

  // Create mobile menu if it doesn't exist
  let mobileMenu = document.getElementById('mobileMenu');
  if (!mobileMenu) {
    mobileMenu = document.createElement('nav');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.id = 'mobileMenu';
    mobileMenu.setAttribute('aria-hidden', 'true');

    const links = document.querySelectorAll('.navbar__link');
    links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.className = 'mobile-menu__link';
      a.textContent = link.textContent;
      mobileMenu.appendChild(a);
    });

    document.body.appendChild(mobileMenu);
  }

  const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('navbar__burger--open');
    mobileMenu.classList.toggle('mobile-menu--open');
    burger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('navbar__burger--open');
      mobileMenu.classList.remove('mobile-menu--open');
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
}

/* =============================================
   SMOOTH SCROLL
   ============================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const navHeight = document.getElementById('navbar').offsetHeight;
        const targetPos = target.offsetTop - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });
}

/* =============================================
   CONSENT POPUP
   ============================================= */
function initConsentPopup() {
  const popup = document.getElementById('consentPopup');
  const acceptBtn = document.getElementById('consentAccept');
  const refuseBtn = document.getElementById('consentRefuse');
  if (!popup) return;

  function closePopup() {
    popup.classList.add('consent-popup--hidden');
    setTimeout(() => { popup.style.display = 'none'; }, 500);
  }

  if (acceptBtn) acceptBtn.addEventListener('click', closePopup);
  if (refuseBtn) {
    refuseBtn.addEventListener('click', () => {
      refuseBtn.textContent = 'Trop tard, vous êtes déjà libéré.';
      setTimeout(closePopup, 1500);
    });
  }
}

/* =============================================
   SCROLL COUNTER
   ============================================= */
function initScrollCounter() {
  const counter = document.getElementById('scrollCounter');
  const timeEl = document.getElementById('scrollTime');
  const msgEl = document.getElementById('scrollMsg');
  const distEl = document.getElementById('scrollDistance');
  if (!counter || !timeEl || !msgEl || !distEl) return;

  let scrollCount = 0;
  let seconds = 0;
  let shown = false;

  const messages = [
    { threshold: 0, text: 'Tout va bien.', warn: false },
    { threshold: 30, text: 'Vous scrollez...', warn: false },
    { threshold: 60, text: 'Ça commence à faire.', warn: false },
    { threshold: 120, text: 'Vous avez besoin de SCROP.', warn: true },
    { threshold: 180, text: 'URGENCE NASALE.', warn: true }
  ];

  // Count time
  setInterval(() => {
    seconds++;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    timeEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;

    // Update message
    let current = messages[0];
    for (const msg of messages) {
      if (seconds >= msg.threshold) current = msg;
    }
    msgEl.textContent = current.text;
    if (current.warn) {
      counter.classList.add('scroll-counter--warn');
    } else {
      counter.classList.remove('scroll-counter--warn');
    }
  }, 1000);

  // Count scroll events
  window.addEventListener('scroll', () => {
    scrollCount++;
    distEl.textContent = `${scrollCount} scrolls`;

    if (!shown && window.scrollY > 200) {
      shown = true;
      counter.classList.add('scroll-counter--visible');
    }
  });
}

/* =============================================
   SCROLL ANIMATIONS — IntersectionObserver (100% natif, sans GSAP)
   ============================================= */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  const selectors = [
    '[data-animate]',
    '.section__label',
    '.section__title',
    '.section__subtitle',
    '.stat-card',
    '.step-card',
    '.product-card',
    '.team-card',
    '.dossier-card',
    '.essai-stat',
    '.essai-badge',
    '.biz-block',
    '.timeline__item',
    '.manifeste__item',
    '.story-content__text',
    '.story-content__quote',
    '.kpi-card',
    '.ingredient-row',
    '.pyramide-level',
    '.gamme-offer',
    '.diag-neuro',
    '.traitement-intro',
    '.testimonial-card',
    '.chart-container',
  ];

  document.querySelectorAll(selectors.join(', ')).forEach(el => {
    if (el.closest('.section-hero')) return; // hero géré par CSS animations
    observer.observe(el);
  });
}

/* =============================================
   ANIMATED COUNTERS
   ============================================= */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    counters.forEach(counter => {
      const target = parseFloat(counter.dataset.count);
      if (target === 0) return;
      const isDecimal = target % 1 !== 0;
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: { trigger: counter, start: 'top 80%' },
        onUpdate: () => {
          counter.textContent = isDecimal ? obj.val.toFixed(1) : Math.round(obj.val);
        }
      });
    });
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      if (parseFloat(counter.dataset.count) !== 0) {
        observer.observe(counter);
      }
    });
  }
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const isDecimal = target % 1 !== 0;
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* =============================================
   CART BUTTONS
   ============================================= */
function initCartButtons() {
  document.querySelectorAll('.product-card__cart').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('cart-added');
      const originalText = btn.textContent;
      btn.textContent = 'Ajouté !';

      setTimeout(() => {
        btn.classList.remove('cart-added');
        btn.textContent = originalText;
      }, 2000);
    });
  });
}

/* =============================================
   TESTIMONIAL CAROUSEL
   ============================================= */
function initCarousel() {
  const carousel = document.getElementById('testimonialCarousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel__track');
  const slides = carousel.querySelectorAll('.carousel__slide');
  const prevBtn = carousel.querySelector('.carousel__btn--prev');
  const nextBtn = carousel.querySelector('.carousel__btn--next');
  const dotsContainer = document.getElementById('carouselDots');

  if (!track || slides.length === 0) return;

  let current = 0;
  const total = slides.length;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel__dot' + (i === 0 ? ' carousel__dot--active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;

    dotsContainer.querySelectorAll('.carousel__dot').forEach((dot, i) => {
      dot.classList.toggle('carousel__dot--active', i === current);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-slide
  let autoSlide = setInterval(() => goTo(current + 1), 5000);

  carousel.addEventListener('mouseenter', () => clearInterval(autoSlide));
  carousel.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => goTo(current + 1), 5000);
  });

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
    }
  }, { passive: true });
}

/* =============================================
   FAKE FEED TIKTOK
   ============================================= */
function initFakeFeed() {
  const screen = document.getElementById('feedScreen');
  const feed = document.getElementById('fakeFeed');
  const overlay = document.getElementById('feedSprayOverlay');
  const phoneFrame = screen ? screen.closest('.phone-frame') : null;
  if (!screen || !feed || !overlay) return;

  let triggered = false;

  screen.addEventListener('scroll', () => {
    if (triggered) return;

    const scrollPercent = screen.scrollTop / (screen.scrollHeight - screen.clientHeight);

    // At 70% scroll, trigger glitch then spray
    if (scrollPercent > 0.7) {
      triggered = true;

      // Glitch phase
      if (phoneFrame) {
        phoneFrame.classList.add('phone-frame--glitching');
        setTimeout(() => {
          phoneFrame.classList.remove('phone-frame--glitching');
        }, 1500);
      }

      // Spray overlay
      setTimeout(() => {
        overlay.classList.add('feed-spray-overlay--visible');
      }, 1000);
    }
  });
}

/* =============================================
   QUIZ
   ============================================= */
function initQuiz() {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  const startBtn = document.getElementById('quizStart');
  const progressBar = document.getElementById('quizProgress');
  const progressFill = document.getElementById('quizProgressFill');
  const progressText = document.getElementById('quizProgressText');
  const generateBtn = document.getElementById('generatePrescription');

  const questions = ['quizQ1', 'quizQ2', 'quizQ3', 'quizQ4', 'quizQ5', 'quizQ6', 'quizQ7'];
  let currentQ = 0;

  function showStep(id) {
    container.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('quiz-step--active'));
    const step = document.getElementById(id);
    if (step) {
      step.classList.add('quiz-step--active');
      step.style.display = '';
    }
  }

  function updateProgress() {
    const pct = ((currentQ + 1) / questions.length) * 100;
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressText) progressText.textContent = `${currentQ + 1}/${questions.length}`;
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      showStep(questions[0]);
      if (progressBar) progressBar.style.display = '';
      updateProgress();
    });
  }

  // Option click handlers
  container.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const nextId = opt.dataset.next;

      // Check if next is a question or result
      const qIndex = questions.indexOf(nextId);
      if (qIndex !== -1) {
        currentQ = qIndex;
        updateProgress();
      } else {
        // Going to result — hide progress
        if (progressBar) progressBar.style.display = 'none';
      }

      showStep(nextId);
    });
  });

  // Generate prescription
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('patientName');
      const patientEl = document.getElementById('ordonnancePatient');
      const dateEl = container.querySelector('.ordonnance__date');

      const name = (nameInput && nameInput.value.trim()) || 'Patient Anonyme';
      if (patientEl) patientEl.textContent = name;

      if (dateEl) {
        const now = new Date();
        dateEl.textContent = now.toLocaleDateString('fr-FR', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        });
      }

      const ordonnanceStep = document.getElementById('quizOrdonnance');
      if (ordonnanceStep) {
        ordonnanceStep.style.display = '';
        showStep('quizOrdonnance');
      }
    });
  }

  // Téléchargement ordonnance
  const downloadBtn = document.getElementById('downloadPrescription');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const content = document.getElementById('ordonnanceContent');
      if (!content || typeof html2canvas === 'undefined') return;

      downloadBtn.textContent = 'Génération en cours...';
      downloadBtn.disabled = true;

      html2canvas(content, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true
      }).then(canvas => {
        const link = document.createElement('a');
        const patientName = document.getElementById('ordonnancePatient').textContent || 'patient';
        link.download = `ordonnance-scrop-${patientName.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        downloadBtn.textContent = '⬇ Télécharger mon ordonnance';
        downloadBtn.disabled = false;
      });
    });
  }
}

/* =============================================
   ESSAI CLINIQUE — Canvas Chart
   ============================================= */
function initEssaiChart() {
  const canvas = document.getElementById('essaiChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Data
  const days = 30;
  const scropData = [];
  const placeboData = [];
  for (let i = 0; i <= days; i++) {
    scropData.push(100 - (85 * (1 - Math.exp(-i / 8))));
    placeboData.push(100 - (15 * (1 - Math.exp(-i / 15))));
  }

  function drawChart() {
    ctx.clearRect(0, 0, w, h);

    const padL = 60, padR = 30, padT = 30, padB = 50;
    const chartW = w - padL - padR;
    const chartH = h - padT - padB;

    // Grid
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padT + (chartH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();

      ctx.fillStyle = '#4A5568';
      ctx.font = '11px "Space Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(100 - (i * 20)) + '%', padL - 10, y + 4);
    }

    // X axis labels
    ctx.textAlign = 'center';
    for (let i = 0; i <= days; i += 5) {
      const x = padL + (chartW / days) * i;
      ctx.fillText('J' + i, x, h - 15);
    }

    // Draw line helper
    function drawLine(data, color, label) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      data.forEach((val, i) => {
        const x = padL + (chartW / days) * i;
        const y = padT + chartH - (val / 100) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Label at end
      const lastY = padT + chartH - (data[data.length - 1] / 100) * chartH;
      ctx.fillStyle = color;
      ctx.font = 'bold 12px "Outfit", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label, w - padR + 5, lastY + 4);
    }

    // Placebo line (gray)
    drawLine(placeboData, '#A0AEC0', 'Placebo');
    // SCROP line (blue)
    drawLine(scropData, '#1E56A0', 'SCROP');

    // Title labels
    ctx.fillStyle = '#0D2B4E';
    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Addiction résiduelle au scroll (%)', padL, padT - 10);
  }

  // Draw on scroll into view
  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          drawChart();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(canvas);
  } else {
    drawChart();
  }
}

/* =============================================
   MODE RECHUTE — Easter Egg
   ============================================= */
function initRechuteMode() {
  const btn = document.getElementById('rechuteBtn');
  const overlay = document.getElementById('rechuteOverlay');
  if (!btn || !overlay) return;

  btn.addEventListener('click', () => {
    overlay.classList.add('rechute-overlay--active');

    // Show glitchy TikTok content
    overlay.innerHTML = `
      <div class="rechute-overlay__content">
        <p style="font-size: 3rem; margin-bottom: 1rem;">📱</p>
        <p style="font-family: var(--font-mono); color: #E53E3E;">RECHUTE DÉTECTÉE</p>
        <p style="font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.5;">Spray en cours d'administration...</p>
      </div>
    `;

    // After 3s, spray clean
    setTimeout(() => {
      const spray = document.createElement('div');
      spray.className = 'rechute-spray';
      overlay.appendChild(spray);

      // Clean up after animation
      setTimeout(() => {
        overlay.classList.remove('rechute-overlay--active');
        overlay.innerHTML = '';
      }, 1800);
    }, 3000);
  });
}

/* =============================================
   PRÉVISIONNEL CHART — Business Plan
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('previsionChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  const years = ['2026', '2027', '2028'];
  const ca = [160000, 480000, 1200000];
  const couts = [150000, 390000, 900000];
  const maxVal = 1300000;

  const padL = 80, padR = 40, padT = 30, padB = 50;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;
  const barW = chartW / years.length / 3;
  const barGap = barW * 0.4;
  const groupW = chartW / years.length;

  ctx.fillStyle = '#F7F9FC';
  ctx.fillRect(0, 0, w, h);

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const y = padT + (chartH / 4) * i;
    ctx.beginPath();
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.moveTo(padL, y);
    ctx.lineTo(w - padR, y);
    ctx.stroke();

    const val = maxVal - (maxVal / 4) * i;
    ctx.fillStyle = '#4A5568';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText((val / 1000).toFixed(0) + 'k', padL - 8, y + 4);
  }

  years.forEach((yr, i) => {
    const groupX = padL + i * groupW + groupW / 2;
    const caBarH = (ca[i] / maxVal) * chartH;
    const coutsBarH = (couts[i] / maxVal) * chartH;

    // Coûts bar
    ctx.fillStyle = '#D6E6F5';
    ctx.fillRect(groupX - barW - barGap / 2, padT + chartH - coutsBarH, barW, coutsBarH);

    // CA bar
    ctx.fillStyle = '#1E56A0';
    ctx.fillRect(groupX + barGap / 2, padT + chartH - caBarH, barW, caBarH);

    // Year label
    ctx.fillStyle = '#0D2B4E';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(yr, groupX, padT + chartH + 20);
  });

  // Legend
  ctx.fillStyle = '#1E56A0';
  ctx.fillRect(padL, h - 18, 14, 10);
  ctx.fillStyle = '#4A5568';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('CA', padL + 18, h - 10);

  ctx.fillStyle = '#D6E6F5';
  ctx.strokeStyle = '#1E56A0';
  ctx.lineWidth = 1;
  ctx.fillRect(padL + 60, h - 18, 14, 10);
  ctx.strokeRect(padL + 60, h - 18, 14, 10);
  ctx.fillStyle = '#4A5568';
  ctx.fillText('Coûts', padL + 78, h - 10);
});
