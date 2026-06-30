/* =================================================================
   تجربة معرض غامرة — المنطق والتفاعلات
   ================================================================= */

/* ╔════════════════════════════════════════════════════════════╗
   ║  ★★★ هنا تضع مشاريعك / تصاميمك لاحقًا ★★★                    ║
   ║  كل مشروع = نقطة مرقّمة على الخريطة + محطة + شرائح قصة.       ║
   ║  - x / y : موضع النقطة على القاعة (%) (x من اليمين لأن RTL). ║
   ║  - booth : صورة الجناح (ضعها في assets/ ثم اكتب المسار).     ║
   ║  - slides: شرائح القصة (صورة + تعليق + عنوان + نص).          ║
   ╚════════════════════════════════════════════════════════════╝ */
const STATIONS = [
  {
    num: '01',
    title: 'مشروع الواجهة الرقمية',
    x: '28%', y: '52%',
    booth: '',            // مثال: 'assets/booth-01.jpg'
    boothText: 'ضع تصميم الجناح هنا',
    slides: [
      {
        img: 'assets/placeholder.svg',
        caption: 'هذا النص تعليق على الصورة — استبدله بوصف مشروعك. يظهر التعليق أسفل الصورة بخلفية متدرّجة.',
        heading: 'نظرة عامة على المشروع',
        text: 'هنا تكتب القصة الكاملة للمشروع: الفكرة، الأهداف، والقيمة المضافة. هذا محتوى مبدئي (placeholder) يوضّح شكل لوحة القصة تمامًا كما في الموقع المرجعي — صورة في الأعلى بتعليق، ثم عنوان، ثم فقرة نصية. عند تزويدي بمحتواك سأستبدله بالكامل.'
      },
      {
        img: 'assets/placeholder.svg',
        caption: 'شريحة ثانية — يمكن إضافة أي عدد من الشرائح لكل مشروع، وتتنقّل بينها بالأسهم أسفل اللوحة.',
        heading: 'التفاصيل والمراحل',
        text: 'الشريحة الثانية من قصة المشروع. الترقيم في الأسفل (مثل 2/2) يتغيّر تلقائيًا حسب عدد الشرائح. أضف صورًا ونصوصًا بقدر ما تشاء.'
      }
    ]
  },
  // النقاط التالية مقفلة مؤقتًا (locked) — افتحها بإضافة slides ومحتوى لها.
  { num:'02', title:'مشروع 02', x:'48%', y:'40%', locked:true },
  { num:'03', title:'مشروع 03', x:'66%', y:'58%', locked:true },
  { num:'04', title:'مشروع 04', x:'40%', y:'68%', locked:true },
  { num:'05', title:'مشروع 05', x:'74%', y:'36%', locked:true },
];

/* الكلمات التي تظهر في المقدمة (عدّلها كما تريد) */
const INTRO_WORDS = ['مركز', 'المعارض', 'السعودي'];

/* ================= أدوات إدارة الشاشات ================= */
const screens = {
  loading: document.getElementById('section-1-loading'),
  intro:   document.getElementById('section-2-intro'),
  map:     document.getElementById('section-4-map'),
  station: document.getElementById('section-5-station'),
  story:   document.getElementById('section-6-story'),
};
const chromeBar = document.getElementById('section-3-chrome');

function show(name) {
  Object.entries(screens).forEach(([k, el]) => {
    if (!el) return;
    el.hidden = false;
    el.classList.toggle('is-active', k === name);
  });
  // الشريط العلوي يظهر في الخريطة فقط (كما في الموقع المرجعي)
  chromeBar.hidden = !(name === 'map');
}

/* =================================================================
   القسم 1 — عدّاد التحميل ثم الانتقال للمقدمة
   ================================================================= */
const counterEl = document.getElementById('loadCounter');
let count = 0;
const counterTimer = setInterval(() => {
  count += Math.floor(Math.random() * 6) + 2;
  if (count >= 100) { count = 100; clearInterval(counterTimer); setTimeout(startIntro, 600); }
  counterEl.textContent = count;
}, 90);

/* =================================================================
   القسم 2 — المقدمة: إظهار الكلمات واحدة واحدة
   ================================================================= */
function startIntro() {
  show('intro');
  const wrap = document.getElementById('introWords');
  wrap.innerHTML = INTRO_WORDS.map(w => `<span class="intro__word">${w}</span>`).join('');
  const words = wrap.querySelectorAll('.intro__word');
  words.forEach((w, i) => setTimeout(() => w.classList.add('show'), 500 + i * 750));
  // بعد انتهاء الكلمات ننتقل للخريطة
  setTimeout(buildMap, 600 + words.length * 750 + 900);
}

/* =================================================================
   القسم 4 — بناء الخريطة بالنقاط المرقّمة
   ================================================================= */
function buildMap() {
  const wrap = document.getElementById('hotspots');
  wrap.innerHTML = '';
  STATIONS.forEach((s, idx) => {
    const dot = document.createElement('button');
    dot.className = 'hotspot' + (s.locked ? ' is-locked' : '');
    dot.style.right = s.x;     // RTL: نضع من اليمين
    dot.style.top = s.y;
    dot.innerHTML = `${s.num}<span class="hotspot__label">${s.title}</span>`;
    if (!s.locked) dot.addEventListener('click', () => openStation(idx));
    wrap.appendChild(dot);
  });
  show('map');
}

document.getElementById('timelineBtn').addEventListener('click', () => {
  // القائمة الكاملة — افتح أول مشروع متاح كمثال (سنبنيها قائمة لاحقًا)
  const firstOpen = STATIONS.findIndex(s => !s.locked);
  if (firstOpen > -1) openStation(firstOpen);
});
document.getElementById('logoHome').addEventListener('click', e => { e.preventDefault(); show('map'); });

/* =================================================================
   القسم 5 — فتح محطة مشروع
   ================================================================= */
let currentStation = 0;
function openStation(idx) {
  currentStation = idx;
  const s = STATIONS[idx];
  document.getElementById('stationTitle').textContent = s.title;
  document.getElementById('stationNum').textContent = s.num;
  const booth = document.getElementById('stationBooth');
  if (s.booth) { booth.style.backgroundImage = `url('${s.booth}')`; booth.textContent = ''; }
  else { booth.style.backgroundImage = ''; booth.textContent = s.boothText || s.title; }
  show('station');
}
document.getElementById('stationClose').addEventListener('click', () => show('map'));
document.getElementById('openStory').addEventListener('click', () => openStory(currentStation, 0));

// أسهم المحطة: الانتقال بين المشاريع المتاحة
document.querySelectorAll('#section-5-station [data-nav]').forEach(btn => {
  btn.addEventListener('click', () => {
    const dir = btn.dataset.nav === 'next' ? 1 : -1;
    let i = currentStation;
    for (let n = 0; n < STATIONS.length; n++) {
      i = (i + dir + STATIONS.length) % STATIONS.length;
      if (!STATIONS[i].locked) { openStation(i); break; }
    }
  });
});

/* =================================================================
   القسم 6 — لوحة القصة + الترقيم
   ================================================================= */
let storyStation = 0, storyPage = 0;
function openStory(stationIdx, page) {
  const s = STATIONS[stationIdx];
  if (!s.slides || !s.slides.length) return;
  storyStation = stationIdx;
  storyPage = Math.max(0, Math.min(page, s.slides.length - 1));
  renderStory();
  show('story');
}
function renderStory() {
  const s = STATIONS[storyStation];
  const slide = s.slides[storyPage];
  document.getElementById('storyImg').src = slide.img || 'assets/placeholder.svg';
  document.getElementById('storyCaption').textContent = slide.caption || '';
  document.getElementById('storyHeading').textContent = slide.heading || '';
  document.getElementById('storyText').textContent = slide.text || '';
  document.getElementById('storySection').textContent = `${s.num} — ${s.title}`;
  document.getElementById('storyCount').textContent = `${storyPage + 1}/${s.slides.length}`;
  document.querySelector('[data-page="prev"]').disabled = storyPage === 0;
  document.querySelector('[data-page="next"]').disabled = storyPage === s.slides.length - 1;
  document.getElementById('storyScroll').scrollTop = 0;
}
document.querySelectorAll('#section-7-nav [data-page]').forEach(btn => {
  btn.addEventListener('click', () => {
    storyPage += btn.dataset.page === 'next' ? 1 : -1;
    renderStory();
  });
});
document.getElementById('storyClose').addEventListener('click', () => show('station'));

/* =================================================================
   القسم 3 — الشريط العلوي (صوت / لغة) — تبديل بسيط
   ================================================================= */
document.getElementById('soundBtn').addEventListener('click', e => {
  e.currentTarget.textContent = e.currentTarget.textContent === '♪' ? '✕' : '♪';
});
document.getElementById('langBtn').addEventListener('click', e => {
  e.currentTarget.textContent = e.currentTarget.textContent === 'AR' ? 'EN' : 'AR';
});

/* تنقّل بلوحة المفاتيح (Esc للرجوع) */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (screens.story.classList.contains('is-active')) show('station');
    else if (screens.station.classList.contains('is-active')) show('map');
  }
});
