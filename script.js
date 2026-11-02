(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Toast ---------- */
  const toast = $('#toast');
  let toastTimer;
  function say(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
  }

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('.menu-btn');
  const nav = $('#nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('#nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Active link while scrolling ---------- */
  const links = $$('#nav a:not(.btn)');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => {
        const on = l.getAttribute('href') === '#' + entry.target.id;
        l.classList.toggle('active', on);
        on ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => observer.observe(s));

  /* ---------- Service cards ---------- */
  $$('.more').forEach(btn => btn.addEventListener('click', () => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    const wasOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!wasOpen));
    panel.hidden = wasOpen;
    btn.firstElementChild.textContent = wasOpen ? 'Learn more' : 'Show less';
  }));

  /* ---------- FAQ accordion ---------- */
  $$('.q button').forEach(btn => btn.addEventListener('click', () => {
    const item = btn.closest('.q');
    const open = !item.classList.contains('open');
    item.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  }));

  /* ---------- Pricing buttons (demo) ---------- */
  const form = $('#form');
  $$('[data-plan]').forEach(btn => btn.addEventListener('click', () => {
    const plan = btn.dataset.plan;
    $('#f-message').value = `Hello! I am interested in the ${plan} plan (example price). Please contact me.`;
    $('#contact').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => $('#f-name').focus({ preventScroll: true }), 600);
    say(`Demo: the ${plan} plan was added to the contact form below.`);
  }));

  /* ---------- Contact form validation (front-end demo only) ---------- */
  const rules = {
    name: v => v.trim().length >= 2 || 'Please enter your name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.',
    company: v => v.trim().length >= 2 || 'Please enter your company name.',
    message: v => v.trim().length >= 10 || 'Please write at least 10 characters.'
  };
  const fields = $$('input, textarea', form);

  function check(input) {
    const result = rules[input.name](input.value);
    const bad = result !== true;
    $('#' + input.id + '-err').textContent = bad ? result : '';
    input.setAttribute('aria-invalid', String(bad));
    return !bad;
  }

  fields.forEach(input => {
    input.addEventListener('blur', () => check(input));
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') check(input);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const invalid = fields.filter(i => !check(i));
    if (invalid.length) { invalid[0].focus(); return; }
    // No backend yet: nothing is sent. Connect a real endpoint here later.
    form.reset();
    fields.forEach(i => i.removeAttribute('aria-invalid'));
    const ok = $('#ok');
    ok.hidden = false;
    ok.focus();
  });

  $('#year').textContent = new Date().getFullYear();
})();
