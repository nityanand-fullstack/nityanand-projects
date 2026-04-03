/* =====================================================
   PORTFOLIO — Nityanand Payasi
   js/script.js

   Modules:
   1. Navbar scroll & active link
   2. Hamburger menu
   3. Typing animation
   4. Scroll-reveal (IntersectionObserver)
   5. Smooth scroll (anchor links)
   6. Contact form UI feedback
   7. Footer year
   ===================================================== */

'use strict';

/* ================================================
   1. NAVBAR — scroll class & active link highlight
================================================ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

/**
 * Adds/removes `.scrolled` class for backdrop blur when
 * the user scrolls past the first 50 px.
 */
function handleNavbarScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  highlightActiveLink();
}

/**
 * Reads current scroll position and marks the matching
 * nav link as `.active` based on which section is visible.
 */
function highlightActiveLink() {
  const scrollMid = window.scrollY + window.innerHeight / 2;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollMid >= top && scrollMid < bottom) {
      navLinks.forEach(link => {
        const isMatch = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isMatch);
      });
    }
  });
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
// Run once on load to set correct initial state
handleNavbarScroll();


/* ================================================
   2. HAMBURGER MENU — mobile drawer toggle
================================================ */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

/** Toggle the mobile drawer open / closed. */
function toggleMenu() {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  // Prevent body scroll while menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

/** Close the drawer (used on link click and outside click). */
function closeMenu() {
  navMenu.classList.remove('open');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', toggleMenu);

// Close when any nav link is tapped
navLinks.forEach(link => link.addEventListener('click', closeMenu));

// Close when user clicks outside the navbar
document.addEventListener('click', e => {
  if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
    closeMenu();
  }
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMenu();
});


/* ================================================
   3. TYPING ANIMATION
================================================ */
const typingEl = document.getElementById('typing-text');

/** Phrases that cycle through in the hero section. */
const PHRASES = [
  'Flutter Developer',
  'Full Stack Developer',
  'Remote Ready Engineer',
];

let phraseIdx  = 0;   // which phrase we're on
let charIdx    = 0;   // how many chars are currently shown
let isDeleting = false;
let delay      = 120; // ms between frames

/**
 * Recursive typing / deleting effect.
 * Uses variable `delay` to control speed for natural feel.
 */
function runTyping() {
  const phrase = PHRASES[phraseIdx];

  if (!isDeleting) {
    // Type one character
    typingEl.textContent = phrase.slice(0, ++charIdx);

    if (charIdx === phrase.length) {
      // Finished typing — pause before deleting
      isDeleting = true;
      delay = 1800;
    } else {
      delay = 100 + Math.random() * 40; // slight natural jitter
    }
  } else {
    // Delete one character
    typingEl.textContent = phrase.slice(0, --charIdx);

    if (charIdx === 0) {
      // Finished deleting — move to next phrase
      isDeleting  = false;
      phraseIdx   = (phraseIdx + 1) % PHRASES.length;
      delay       = 380;
    } else {
      delay = 55;
    }
  }

  setTimeout(runTyping, delay);
}

// Start after a short initial pause so the page loads first
setTimeout(runTyping, 900);


/* ================================================
   4. SCROLL REVEAL — IntersectionObserver
================================================ */

/**
 * Observes every `[data-reveal]` element and adds `.revealed`
 * when it enters the viewport. Supports optional staggered
 * delay via `data-reveal-delay` attribute (ms).
 */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el    = entry.target;
    const delay = parseInt(el.dataset.revealDelay ?? 0, 10);

    setTimeout(() => el.classList.add('revealed'), delay);
    revealObserver.unobserve(el); // fire once
  });
}, {
  threshold:  0.1,
  rootMargin: '0px 0px -40px 0px',
});

/**
 * Apply staggered delays to groups of sibling cards.
 * @param {string} selector  - CSS selector for the group
 * @param {number} stepMs    - delay increment per item in ms
 */
function staggerGroup(selector, stepMs) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.dataset.revealDelay = i * stepMs;
  });
}

// Assign stagger delays before observing
staggerGroup('.skills-grid   .skill-category', 100);
staggerGroup('.projects-grid .project-card',   150);
staggerGroup('.why-grid      .why-card',        90);
staggerGroup('.about-stats   .stat-card',       80);

// Observe every element tagged for reveal
document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));


/* ================================================
   5. SMOOTH SCROLL — anchor links
================================================ */

/**
 * Overrides default anchor jump with smooth scrolling
 * that accounts for the fixed navbar height.
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href   = this.getAttribute('href');
    if (href === '#') return; // bare # links — skip

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const navH      = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
      10
    );
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navH;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});


/* ================================================
   6. CONTACT FORM — UI-only feedback
================================================ */
const contactForm = document.getElementById('contact-form');
const submitBtn   = document.getElementById('submit-btn');

if (contactForm && submitBtn) {
  const originalLabel = submitBtn.innerHTML;

  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    // Basic HTML5 validation check
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    // Show loading state
    submitBtn.disabled   = true;
    submitBtn.innerHTML  = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending…';

    // Simulate async send (UI only — no backend)
    setTimeout(() => {
      submitBtn.innerHTML  = '<i class="fas fa-check" aria-hidden="true"></i> Message Sent!';
      submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

      // Reset after 3 s
      setTimeout(() => {
        submitBtn.innerHTML        = originalLabel;
        submitBtn.style.background = '';
        submitBtn.disabled         = false;
        contactForm.reset();
      }, 3000);
    }, 1500);
  });
}


/* ================================================
   7. FOOTER — dynamic copyright year
================================================ */
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ================================================
   UTILITY — passive scroll listener performance note
   All scroll listeners use { passive: true } where
   applicable to avoid blocking the main thread.
================================================ */


/* ================================================
   8. ANIMATED COUNTERS — Metrics Section
================================================ */

/**
 * Eases a counter from 0 → target over `duration` ms.
 * Uses requestAnimationFrame for smooth 60fps animation.
 *
 * @param {HTMLElement} el       - The element whose textContent to update
 * @param {number}      target   - Final numeric value
 * @param {number}      duration - Animation length in ms
 */
function animateCounter(el, target, duration = 1800) {
  const startTime = performance.now();

  function tick(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic for a natural deceleration feel
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);

    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target; // ensure exact final value
  }

  requestAnimationFrame(tick);
}

/**
 * Fire counters only once when the metrics section
 * enters the viewport.
 */
const metricsSection = document.querySelector('.metrics');

if (metricsSection) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Find every counter element inside this section
      entry.target.querySelectorAll('.metric-num[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        animateCounter(el, target);
      });

      counterObserver.unobserve(entry.target); // run once
    });
  }, { threshold: 0.3 });

  counterObserver.observe(metricsSection);
}


/* ================================================
   9. CODE SHOWCASE — Tab Switcher
================================================ */

const showcaseTabs   = document.querySelectorAll('.showcase-tab');
const showcasePanels = document.querySelectorAll('.showcase-panel');

showcaseTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetId = tab.dataset.tab;

    // Update tab button states
    showcaseTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    // Show matching panel, hide others
    showcasePanels.forEach(panel => {
      const isTarget = panel.id === targetId;
      panel.classList.toggle('active', isTarget);
      panel.hidden = !isTarget;
    });
  });
});


/* ================================================
   10. EXTEND STAGGER GROUPS — new sections
================================================ */

// Add staggered reveal delays to new section cards
staggerGroup('.metrics-grid    .metric-card',    120);
staggerGroup('.arch-flow       .arch-layer',     100);
staggerGroup('.services-grid   .service-card',   120);
staggerGroup('.blog-grid       .blog-card',      130);
staggerGroup('.timeline        .timeline-item',  120);

// Re-observe any new [data-reveal] elements added by the new sections
// (the main observer was set up before these sections existed in the DOM,
//  so we call observe() on each newly added element.)
document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => {
  revealObserver.observe(el);
});