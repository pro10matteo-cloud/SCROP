/* =============================================
   PSCHITT — Main JavaScript
   Brigade 21 — THE GLITCH 2026
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initCounters();
  initBenchmarkBars();
  initCartButtons();
  initEasterEgg();
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
        // Navbar background on scroll
        if (window.scrollY > 50) {
          navbar.classList.add('navbar--scrolled');
        } else {
          navbar.classList.remove('navbar--scrolled');
        }

        // Active section highlight
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
  const burger = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
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
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* =============================================
   SCROLL ANIMATIONS — GSAP ScrollTrigger
   ============================================= */
function initScrollAnimations() {
  // Check if GSAP is available
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback: use IntersectionObserver
    initFallbackAnimations();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Fade-up elements
  document.querySelectorAll('[data-animate="fade-up"]').forEach(el => {
    const delay = parseFloat(el.dataset.delay) || 0;

    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: delay,
      ease: 'power2.out'
    });
  });

  // Section labels
  document.querySelectorAll('.section__label').forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%'
      },
      x: -30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    });
  });

  // Section titles
  document.querySelectorAll('.section__title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.1
    });
  });

  // Section subtitles
  document.querySelectorAll('.section__subtitle').forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%'
      },
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.2
    });
  });

  // Story pullquote
  document.querySelectorAll('.story__pullquote').forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 80%'
      },
      scale: 0.9,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });
  });

  // Timeline items
  document.querySelectorAll('.timeline__item').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%'
      },
      x: -30,
      opacity: 0,
      duration: 0.6,
      delay: i * 0.15,
      ease: 'power2.out'
    });
  });

  // Manifeste items
  document.querySelectorAll('.manifeste__item').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%'
      },
      x: -20,
      opacity: 0,
      duration: 0.5,
      delay: i * 0.1,
      ease: 'power2.out'
    });
  });
}

// Fallback for when GSAP is not loaded
function initFallbackAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('[data-animate]').forEach(el => {
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
      const isDecimal = target % 1 !== 0;
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 80%'
        },
        onUpdate: () => {
          counter.textContent = isDecimal ? obj.val.toFixed(1) : Math.round(obj.val);
        }
      });
    });
  } else {
    // Fallback with IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
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
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;

    el.textContent = isDecimal ? current.toFixed(1) : Math.round(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* =============================================
   BENCHMARK BARS
   ============================================= */
function initBenchmarkBars() {
  const bars = document.querySelectorAll('.benchmark-bar');

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    bars.forEach(bar => {
      const value = bar.dataset.value;
      bar.style.setProperty('--bar-value', value);

      ScrollTrigger.create({
        trigger: bar,
        start: 'top 85%',
        onEnter: () => bar.classList.add('benchmark-bar--animated')
      });
    });
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.setProperty('--bar-value', bar.dataset.value);
          bar.classList.add('benchmark-bar--animated');
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });

    bars.forEach(bar => observer.observe(bar));
  }
}

/* =============================================
   CART BUTTONS (fake interaction)
   ============================================= */
function initCartButtons() {
  document.querySelectorAll('.product-card__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('cart-added');
      const originalText = btn.textContent;
      btn.textContent = 'Ajouté ! ✅';
      btn.style.background = 'var(--color-mint)';
      btn.style.color = 'var(--color-black)';
      btn.style.borderColor = 'var(--color-mint)';

      setTimeout(() => {
        btn.classList.remove('cart-added');
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 2000);
    });
  });
}

/* =============================================
   EASTER EGG — Konami Code → Spray Rain
   ============================================= */
function initEasterEgg() {
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.code === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        triggerSprayRain();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
}

function triggerSprayRain() {
  const emojis = ['💨', '👃', '🧴', '✨', '🌿', '💊'];
  const count = 50;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const spray = document.createElement('div');
      spray.classList.add('spray-rain');
      spray.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      spray.style.left = Math.random() * 100 + 'vw';
      spray.style.animationDuration = (2 + Math.random() * 3) + 's';
      spray.style.fontSize = (1 + Math.random() * 2) + 'rem';
      document.body.appendChild(spray);

      spray.addEventListener('animationend', () => spray.remove());
    }, i * 60);
  }
}
