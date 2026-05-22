/* =====================================================
   EMBER & ASH — script.js
   All interactions, animations & functionality
   ===================================================== */

'use strict';

/* ─────────────────────────────────────────────────────
   1. PAGE LOADER
───────────────────────────────────────────────────── */
const loader = document.getElementById('page-loader');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('loaded');
  }, 2000); // let the bar animation finish
});

/* ─────────────────────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────────────────────── */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

if (cursorDot && cursorRing) {
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let animId = null;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // Smooth lag on ring
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    animId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover reaction on interactive elements
  const hoverTargets = 'a, button, input, textarea, select, .menu-card, .gallery-item, .testimonial-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Hide cursor when it leaves window
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity  = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity  = '1';
    cursorRing.style.opacity = '0.6';
  });
}

/* ─────────────────────────────────────────────────────
   3. NAVBAR — scroll behaviour
───────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* ─────────────────────────────────────────────────────
   4. MOBILE HAMBURGER + DRAWER
───────────────────────────────────────────────────── */
const hamburgerBtn  = document.getElementById('hamburger-btn');
const mobileDrawer  = document.getElementById('mobile-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const drawerLinks   = document.querySelectorAll('.drawer-link');

function openDrawer() {
  hamburgerBtn.classList.add('open');
  mobileDrawer.classList.add('open');
  drawerOverlay.classList.add('open');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  hamburgerBtn.classList.remove('open');
  mobileDrawer.classList.remove('open');
  drawerOverlay.classList.remove('open');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburgerBtn.addEventListener('click', () => {
  if (mobileDrawer.classList.contains('open')) {
    closeDrawer();
  } else {
    openDrawer();
  }
});

drawerOverlay.addEventListener('click', closeDrawer);
drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

// Keyboard: close drawer with Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
    closeDrawer();
  }
});

/* ─────────────────────────────────────────────────────
   5. SMOOTH SCROLL (for all anchor links)
───────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = navbar.offsetHeight;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────────────────────
   6. INTERSECTION OBSERVER — Scroll Reveal
───────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = entry.target.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right');
      let delay = 0;
      siblings.forEach((sib, idx) => {
        if (sib === entry.target) delay = idx * 100;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ─────────────────────────────────────────────────────
   7. CHARACTER-BY-CHARACTER HEADING REVEAL
───────────────────────────────────────────────────── */
function splitIntoChars(el) {
  const html = el.innerHTML;
  // Preserve <br> and <em> tags while wrapping characters
  const parser = new DOMParser();
  const doc    = parser.parseFromString(`<span>${html}</span>`, 'text/html');
  const root   = doc.body.firstChild;

  // Walk text nodes inside, wrap each char
  function wrapTextNodes(node) {
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        [...child.textContent].forEach(char => {
          if (char === ' ') {
            frag.appendChild(document.createTextNode('\u00A0'));
          } else {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char;
            frag.appendChild(span);
          }
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        wrapTextNodes(child);
      }
    });
  }

  wrapTextNodes(root);
  el.innerHTML = root.innerHTML;
}

const charRevealEls = document.querySelectorAll('.char-reveal');
charRevealEls.forEach(el => splitIntoChars(el));

const charObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const chars = entry.target.querySelectorAll('.char');
      chars.forEach((char, i) => {
        setTimeout(() => {
          char.style.opacity   = '1';
          char.style.transform = 'translateY(0) rotate(0)';
        }, i * 28);
      });
      charObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

charRevealEls.forEach(el => charObserver.observe(el));

/* ─────────────────────────────────────────────────────
   8. NUMBER COUNTER ANIMATION
───────────────────────────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  const start     = performance.now();
  const startVal  = 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(startVal + (target - startVal) * eased);
    el.textContent = value + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat-number[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

/* ─────────────────────────────────────────────────────
   9. MENU TABS
───────────────────────────────────────────────────── */
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.dataset.tab;

    // Update buttons
    tabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    // Update panels
    tabPanels.forEach(panel => {
      panel.classList.remove('active');
    });

    const activePanel = document.getElementById(`tab-${targetTab}`);
    if (activePanel) {
      activePanel.classList.add('active');

      // Re-trigger reveal for newly shown cards
      activePanel.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(40px)';
        setTimeout(() => {
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          el.style.opacity    = '1';
          el.style.transform  = 'translateY(0)';
        }, i * 120);
      });
    }
  });
});

/* ─────────────────────────────────────────────────────
   10. PARALLAX HERO BACKGROUND
───────────────────────────────────────────────────── */
const heroBg = document.querySelector('.hero-bg');

function parallaxHero() {
  if (!heroBg) return;
  const scrolled = window.scrollY;
  const rate = scrolled * 0.35;
  heroBg.style.transform = `scale(1.05) translateY(${rate}px)`;
}

// Only apply if not reduced motion
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', parallaxHero, { passive: true });
}

/* ─────────────────────────────────────────────────────
   11. RESERVATION FORM VALIDATION
───────────────────────────────────────────────────── */
const reservationForm = document.getElementById('reservation-form');
const formSuccess     = document.getElementById('form-success');

// Set minimum date to today
const dateInput = document.getElementById('res-date');
if (dateInput) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm   = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd   = String(tomorrow.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

function showError(fieldGroupId, show) {
  const fg = document.getElementById(fieldGroupId);
  if (!fg) return;
  if (show) {
    fg.classList.add('error');
  } else {
    fg.classList.remove('error');
  }
}

function validateForm() {
  let valid = true;

  // Name
  const name = document.getElementById('res-name');
  if (!name.value.trim() || name.value.trim().length < 2) {
    showError('fg-name', true); valid = false;
  } else {
    showError('fg-name', false);
  }

  // Email
  const email = document.getElementById('res-email');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email.value.trim())) {
    showError('fg-email', true); valid = false;
  } else {
    showError('fg-email', false);
  }

  // Date
  const date = document.getElementById('res-date');
  if (!date.value) {
    showError('fg-date', true); valid = false;
  } else {
    showError('fg-date', false);
  }

  // Time
  const time = document.getElementById('res-time');
  if (!time.value) {
    showError('fg-time', true); valid = false;
  } else {
    showError('fg-time', false);
  }

  // Guests
  const guests = document.getElementById('res-guests');
  if (!guests.value) {
    showError('fg-guests', true); valid = false;
  } else {
    showError('fg-guests', false);
  }

  return valid;
}

// Clear error on input
['res-name','res-email','res-date','res-time','res-guests'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    const fgId = `fg-${id.replace('res-', '')}`;
    showError(fgId, false);
  });
  el.addEventListener('change', () => {
    const fgId = `fg-${id.replace('res-', '')}`;
    showError(fgId, false);
  });
});

if (reservationForm) {
  reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitBtn = document.getElementById('submit-btn');

    // Loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Confirming…';

    // Simulate async submission
    setTimeout(() => {
      formSuccess.classList.add('show');
      reservationForm.reset();
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Confirm Reservation';

      // Scroll to success message
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Hide success after 8s
      setTimeout(() => formSuccess.classList.remove('show'), 8000);
    }, 1400);
  });
}

/* ─────────────────────────────────────────────────────
   12. GALLERY KEYBOARD NAVIGATION
───────────────────────────────────────────────────── */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'img');

  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // Simple focus highlight — could extend to lightbox
      item.style.outline = `2px solid var(--ember)`;
      setTimeout(() => item.style.outline = '', 1200);
    }
  });
});

/* ─────────────────────────────────────────────────────
   13. FLOATING LABELS — Force label up when input has value
───────────────────────────────────────────────────── */
// Select elements don't trigger :placeholder-shown, so handle manually
document.querySelectorAll('.form-group select').forEach(sel => {
  sel.addEventListener('change', () => {
    const label = sel.parentElement.querySelector('label');
    if (!label) return;
    if (sel.value) {
      label.style.top       = '0.28rem';
      label.style.fontSize  = '0.63rem';
      label.style.color     = 'var(--ember)';
    } else {
      label.style.top       = '';
      label.style.fontSize  = '';
      label.style.color     = '';
    }
  });
});

/* ─────────────────────────────────────────────────────
   14. MARQUEE — pause on hover
───────────────────────────────────────────────────── */
const marqueeTrack = document.querySelector('.marquee-track');
const marqueeWrap  = document.querySelector('.marquee-wrap');

if (marqueeWrap && marqueeTrack) {
  marqueeWrap.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeWrap.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

/* ─────────────────────────────────────────────────────
   15. ACTIVE NAV HIGHLIGHT on scroll (SPA-style)
───────────────────────────────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active-nav', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, {
  threshold: 0.35,
  rootMargin: '-80px 0px 0px 0px'
});

sections.forEach(section => sectionObserver.observe(section));

/* ─────────────────────────────────────────────────────
   16. ACTIVE NAV STYLE (inject via JS to avoid specificity wars)
───────────────────────────────────────────────────── */
const activeNavStyle = document.createElement('style');
activeNavStyle.textContent = `
  .nav-links a.active-nav { color: var(--cream) !important; }
  .nav-links a.active-nav::after { width: 100% !important; }
`;
document.head.appendChild(activeNavStyle);

/* ─────────────────────────────────────────────────────
   17. HERO TITLE — subtle mouse parallax
───────────────────────────────────────────────────── */
const heroContent = document.querySelector('.hero-content');

if (heroContent && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.getElementById('hero')?.addEventListener('mousemove', (e) => {
    const { innerWidth: W, innerHeight: H } = window;
    const x = (e.clientX / W - 0.5) * 12;
    const y = (e.clientY / H - 0.5) * 8;
    heroContent.style.transform = `translate(${x}px, ${y}px)`;
    heroContent.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });

  document.getElementById('hero')?.addEventListener('mouseleave', () => {
    heroContent.style.transform  = 'translate(0, 0)';
    heroContent.style.transition = 'transform 1.2s ease';
  });
}

/* ─────────────────────────────────────────────────────
   18. PERFORMANCE — preload critical images
───────────────────────────────────────────────────── */
function preloadImage(src) {
  const link = document.createElement('link');
  link.rel  = 'preload';
  link.as   = 'image';
  link.href = src;
  document.head.appendChild(link);
}

// Preload the hero background (above the fold, critical)
preloadImage('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80&auto=format&fit=crop');

/* ─────────────────────────────────────────────────────
   19. INIT — log ready state
───────────────────────────────────────────────────── */
console.log(
  '%c Ember & Ash %c Fine Dining Website Ready ',
  'background:#c4622d;color:#f0ebe2;padding:4px 8px;border-radius:3px 0 0 3px;font-family:Georgia,serif;font-size:13px;',
  'background:#0a0806;color:#d4a853;padding:4px 8px;border-radius:0 3px 3px 0;font-family:monospace;font-size:11px;'
);
