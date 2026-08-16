/* Cashel Street Takeways — site behaviour */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Opening animation ---- */
  function closeIntro() {
    var intro = document.getElementById('intro');
    if (!intro) return;
    intro.classList.add('done');
    window.setTimeout(function () {
      if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
    }, 1600);
  }
  if (document.getElementById('intro')) {
    window.addEventListener('load', function () {
      window.setTimeout(closeIntro, reduced ? 0 : 420);
    });
    window.setTimeout(closeIntro, 2600);
  }

  /* ---- Sticky nav state ---- */
  var nav = document.querySelector('.nav');
  var hero = document.querySelector('.hero');
  function onScroll() {
    if (!nav) return;
    var trigger = hero ? Math.min(140, hero.offsetHeight * 0.25) : 20;
    if (window.scrollY > trigger) nav.classList.add('solid');
    else nav.classList.remove('solid');
  }
  if (nav && hero) {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile menu ---- */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Rolling hero ---- */
  var slides = document.querySelectorAll('.hero-slides img');
  if (slides.length > 1 && !reduced) {
    var i = 0;
    window.setInterval(function () {
      slides[i].classList.remove('active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('active');
    }, 5200);
  }

  /* ---- Reveal on scroll ---- */
  var revealables = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealables.forEach(function (el, idx) {
      el.style.transitionDelay = (idx % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Email buttons: build a pre-filled Gmail compose link at runtime ---- */
  document.querySelectorAll('a[data-gmail]').forEach(function (a) {
    var to = a.getAttribute('data-user') + '@' + a.getAttribute('data-domain');
    a.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to) +
      '&su=' + (a.getAttribute('data-su') || '') +
      '&body=' + (a.getAttribute('data-body') || '');
    a.target = '_blank';
    a.rel = 'noopener';
    if (a.hasAttribute('data-showaddr')) { a.textContent = to; }
  });

  /* ---- Current year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
