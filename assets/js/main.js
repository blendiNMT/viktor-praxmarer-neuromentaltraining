/* === Viktor Praxmarer - Animations & Interactions === */

document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileToggle();
  initRevealAnimations();
  initParallaxHero();
  initSmoothScroll();
  initCounterAnimation();
  initContactFormFallback();
  initFaqAccordion();
});

/* Nav scroll effect */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* Mobile menu toggle */
function initMobileToggle() {
  const toggle = document.querySelector('.mobile-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('active');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('active'));
  });
}

/* Reveal on scroll */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));
}

/* Hero parallax mouse effect */
function initParallaxHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const layers = hero.querySelectorAll('.parallax-layer');
  if (!layers.length) return;

  hero.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = hero.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    layers.forEach((layer, i) => {
      const speed = (i + 1) * 15;
      layer.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    layers.forEach(layer => {
      layer.style.transform = 'translate(0, 0)';
      layer.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => layer.style.transition = '', 600);
    });
  });

  /* Scroll-based parallax */
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return;
    layers.forEach((layer, i) => {
      const speed = (i + 1) * 0.3;
      layer.style.transform = `translateY(${scrollY * speed}px)`;
    });
    /* Hero content fades out */
    const content = hero.querySelector('.hero-content');
    if (content) {
      content.style.opacity = 1 - scrollY / (window.innerHeight * 0.6);
      content.style.transform = `translateY(${scrollY * 0.4}px)`;
    }
  });
}

/* Smooth scroll for anchor links */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* Counter animation for stats */
function initCounterAnimation() {
  const stats = document.querySelectorAll('.about-stat h4');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target) || parseInt(el.textContent);
        if (!target) return;
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(el => observer.observe(el));
}

function animateCounter(el, target) {
  const duration = 1500;
  const start = 0;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased) + '+';
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* Static-site fallback: opens a prefilled email instead of silently doing nothing */
function initContactFormFallback() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(`Anfrage Neuromentaltraining: ${data.get('topic') || 'Erstgespräch'}`);
    const body = encodeURIComponent([
      `Name: ${data.get('name') || ''}`,
      `E-Mail: ${data.get('email') || ''}`,
      `Thema: ${data.get('topic') || ''}`,
      '',
      data.get('message') || ''
    ].join('\n'));
    window.location.href = `mailto:info@viktorpraxmarer.com?subject=${subject}&body=${body}`;
  });
}


function initFaqAccordion() {
  const accordion = document.querySelector('[data-accordion]');
  if (!accordion) return;

  const items = Array.from(accordion.querySelectorAll('.faq-item'));
  items.forEach((item) => {
    const button = item.querySelector('.faq-question');
    if (!button) return;
    button.addEventListener('click', () => {
      const shouldOpen = !item.classList.contains('is-open');
      items.forEach((other) => {
        other.classList.remove('is-open');
        const otherButton = other.querySelector('.faq-question');
        if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
      });
      if (shouldOpen) {
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* Offer card subtle parallax removed - handled by CSS */