/* =================================================================
   سكربت المؤثّرات — كل التفاعلات في مكان واحد
   ================================================================= */

/* --- 1) شريط التنقل: تغيير الخلفية عند التمرير --- */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
});

/* --- 2) قائمة الجوّال (Burger) --- */
const burger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('is-open'));
navLinks.querySelectorAll('.nav__link').forEach(l =>
  l.addEventListener('click', () => navLinks.classList.remove('is-open'))
);

/* --- 3) تمييز الرابط النشِط حسب القسم الظاهر --- */
const sections = document.querySelectorAll('section[id], header[id]');
const linkMap = {};
document.querySelectorAll('.nav__link').forEach(l => {
  linkMap[l.getAttribute('href').slice(1)] = l;
});
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && linkMap[e.target.id]) {
      document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('is-active'));
      linkMap[e.target.id].classList.add('is-active');
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });
sections.forEach(s => navObserver.observe(s));

/* --- 4) الظهور عند التمرير (Scroll Reveal) --- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('is-visible'), delay);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* --- 5) العدّادات المتحركة (Counters) --- */
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    const dur = 1600;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(eased * target).toLocaleString('ar-EG');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

/* --- 6) تأثير التموّج على الأزرار (Ripple) --- */
document.querySelectorAll('[data-ripple]').forEach(btn => {
  btn.addEventListener('click', e => {
    const r = document.createElement('span');
    const size = Math.max(btn.offsetWidth, btn.offsetHeight);
    const rect = btn.getBoundingClientRect();
    r.className = 'ripple';
    r.style.width = r.style.height = size + 'px';
    r.style.left = (e.clientX - rect.left - size / 2) + 'px';
    r.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });
});

/* --- 7) التحقق من النموذج وإرساله --- */
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll('.input').forEach(inp => {
    const invalid = !inp.value.trim() || (inp.type === 'email' && !/^[^@]+@[^@]+\.[^@]+$/.test(inp.value));
    inp.classList.toggle('is-error', invalid);
    if (invalid) ok = false;
  });
  if (ok) {
    note.hidden = false;
    form.reset();
    setTimeout(() => { note.hidden = true; }, 4000);
  }
});

/* --- 8) إزالة حالة الخطأ أثناء الكتابة --- */
form.querySelectorAll('.input').forEach(inp =>
  inp.addEventListener('input', () => inp.classList.remove('is-error'))
);
