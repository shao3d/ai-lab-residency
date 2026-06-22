// ИИ-лаборатория — Резидентура · interactions
(function () {
  'use strict';

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var open = item.classList.contains('open');
      // close siblings
      item.parentElement.querySelectorAll('.faq-item.open').forEach(function (sib) {
        if (sib !== item) { sib.classList.remove('open'); sib.querySelector('.faq-a').style.maxHeight = null; }
      });
      if (open) { item.classList.remove('open'); a.style.maxHeight = null; }
      else { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  // ---- mobile menu ----
  var burger = document.querySelector('.nav-burger');
  var menu = document.querySelector('.mobile-menu');
  if (burger && menu) {
    burger.addEventListener('click', function () { menu.classList.toggle('open'); });
    menu.querySelectorAll('a').forEach(function (l) {
      l.addEventListener('click', function () { menu.classList.remove('open'); });
    });
  }

  // ---- scroll reveal ----
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }) : null;
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    if (io) { el.style.transitionDelay = (Math.min(i % 4, 3) * 60) + 'ms'; io.observe(el); }
    else { el.classList.add('in'); }
  });

  // ---- year ----
  var y = document.querySelector('[data-year]');
  if (y) { y.textContent = (new Date()).getFullYear(); }
})();
