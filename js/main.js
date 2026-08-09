/* ============================================================
   main.js — Logic de la landing page
   ============================================================ */

var FEATURED = [
  { name: 'Camille',                label: 'Wellness Electronic Device', labelFr: 'Dispositif de bien-être' },
  { name: 'Shredsauce Exploration', label: 'Edition & Interface',        labelFr: 'Édition & Interface' },
  { name: 'Tristan-Linder.ch',      label: 'Web Design',                labelFr: 'Design Web' },
  { name: 'Wild Destroyer',         label: 'Generative Interface',       labelFr: 'Interface Générative' },
  { name: 'Idle Car',               label: 'Game',                       labelFr: 'Jeu' },
  { name: 'Pluck',                  label: 'Sound Toy',                  labelFr: 'Jouet Sonore' },
  { name: 'Greenlab',               label: '3D Poster',                  labelFr: 'Affiche 3D' },
  { name: 'Gallium Switch',         label: 'Installation',               labelFr: 'Installation' }
];

var CATEGORIES = [
  { name: 'Interaction', nameFr: 'Interaction', page: 'interaction', label: 'More', labelFr: 'Plus', projects: [
      { name: '3-2-1-0',             label: 'Webtoy',       labelFr: 'Webtoy' },
      { name: 'Webtoy Cam Lazer',    label: 'Webtoy',       labelFr: 'Webtoy' },
      { name: 'Mickey Incremental',  label: 'Game',         labelFr: 'Jeu' },
      { name: "Dad's Trauma House",  label: '3D Narrative', labelFr: 'Narration 3D' },
      { name: 'Hyper',               label: '3D Narrative', labelFr: 'Narration 3D' },
      { name: 'Memoryshell',         label: '3D Memory',    labelFr: 'Mémoire 3D' }
    ]
  },
  { name: 'Vidéo', nameFr: 'Vidéo', page: 'video', label: 'More', labelFr: 'Plus', projects: [
      { name: 'Systematic Noise', label: 'Science 3D Doc', labelFr: 'Doc Science 3D' },
      { name: 'Programmer',       label: 'Clip',           labelFr: 'Clip' },
      { name: 'Play',             label: 'Clip',           labelFr: 'Clip' },
      { name: 'Belle Étoile',     label: 'Visualizer',     labelFr: 'Visualiseur' },
      { name: 'Alicia Keys',      label: 'Visualizer',     labelFr: 'Visualiseur' }
    ]
  },
  { name: 'Identity', nameFr: 'Identité', page: 'identity', label: 'More', labelFr: 'Plus', projects: [
      { name: 'CFF Refont',    label: 'New Design',       labelFr: 'Nouveau Design' },
      { name: 'Pink Link',     label: 'Chrome Extension', labelFr: 'Extension Chrome' },
      { name: 'Maison Jaffar', label: 'Branding',         labelFr: 'Identité Visuelle' }
    ]
  }
];

var uiTop       = document.getElementById('ui-top');
var maskT       = document.getElementById('mask-top');
var maskB       = document.getElementById('mask-bottom');
var lineWork    = document.getElementById('line-work');
var lineContact = document.getElementById('line-contact');
var workBtn     = document.getElementById('work-btn');
var sign        = document.getElementById('sign');
var list        = document.getElementById('list');
var listIsOpen  = false;

/* ── Landing Carousel ── */
var LANDING = [
  { name: 'Shredsauce Exploration', src: './covers/shredsauce.webm', href: 'projects/shredsauce-exploration.html', size: '104%', mobileSize: '82%' },
  { name: 'Camille',                src: './covers/camille.webm',    href: 'projects/camille.html',                size: '94%',  mobileSize: '105%',  nudge: '-2vh' },
  { name: 'Tristan-Linder.ch',      src: './covers/tristan.webm',   href: 'projects/tristan-linder-ch.html',      size: '77%',  mobileSize: '85%',   nudge: '-2vh' },
  { name: 'Pluck',                  src: './carouselPluck/3.webm',   href: 'projects/pluck.html',                  size: '80%',  mobileSize: '95%',   nudge: '-2vh' },
  { name: 'Wild Destroyer',         src: './covers/wild.webm',       href: 'projects/wild-destroyer.html',         size: '78%',  mobileSize: '55%',   nudge: '-2vh' }
];

var landingCarousel = document.getElementById('landing-carousel');
var landingPrev     = document.getElementById('landing-prev');
var landingNext     = document.getElementById('landing-next');
var landingNameEl   = document.getElementById('landing-name');
var contactEl       = document.getElementById('contact');
var landingCur      = 0;
var landingSlides   = [];
var landingVideos   = [];
var landingVisible  = true;
var nameTimer       = null;
var isTouchDevice   = ('ontouchstart' in window);

function applyLandingSizes() {
  var mobile = window.innerWidth <= 768;
  LANDING.forEach(function (item, i) {
    var vid = landingVideos[i];
    if (!vid) return;
    var sz = (mobile && item.mobileSize) ? item.mobileSize : item.size;
    if (sz) { vid.style.maxWidth = sz; vid.style.maxHeight = sz; }
  });
}

/* Build slides */
LANDING.forEach(function (item, i) {
  var slide = document.createElement('div');
  slide.className = 'landing-slide' + (i === 0 ? ' active' : '');
  var vid = document.createElement('video');
  vid.src = item.src;
  vid.loop = true;
  vid.muted = true;
  vid.playsInline = true;
  vid.setAttribute('playsinline', '');
  vid.preload = 'auto';
  if (item.nudge) { vid.style.transform = 'translateY(' + item.nudge + ')'; }
  slide.appendChild(vid);
  landingCarousel.appendChild(slide);
  landingSlides.push(slide);
  landingVideos.push(vid);
});

applyLandingSizes();

function playAllVideos() {
  landingVideos.forEach(function(v) {
    if (v.paused) v.play().catch(function(){});
  });
}

function fixVideo(v) {
  v.currentTime = 0;
  v.play().catch(function(){});
}

/* Pause détectée → relancer */
landingVideos.forEach(function(v) {
  v.addEventListener('pause', function() {
    setTimeout(function() {
      if (v.paused && !document.hidden) v.play().catch(function(){});
    }, 200);
  });
  /* Stall (browser a arrêté de recevoir des données) → débloquer */
  v.addEventListener('stalled', function() { fixVideo(v); });
  v.addEventListener('error',   function() {
    v.load();
    v.play().catch(function(){});
  });
});

playAllVideos();

/* Reprendre si l'onglet revient au premier plan ou focus */
document.addEventListener('visibilitychange', function() {
  if (!document.hidden) playAllVideos();
});
window.addEventListener('focus', playAllVideos);

/* Détection de freeze réel : currentTime qui n'avance plus alors que paused=false */
(function watchFreeze() {
  var lastTimes = landingVideos.map(function() { return -1; });
  var stalledFor = landingVideos.map(function() { return 0; });

  setInterval(function() {
    if (document.hidden) return;
    landingVideos.forEach(function(v, i) {
      if (v.paused || v.ended || v.readyState < 2) { stalledFor[i] = 0; return; }
      if (v.currentTime === lastTimes[i]) {
        stalledFor[i]++;
        if (stalledFor[i] >= 2) { /* 2 checks × 1.5s = 3s de freeze → on débloq */
          stalledFor[i] = 0;
          fixVideo(v);
        }
      } else {
        stalledFor[i] = 0;
      }
      lastTimes[i] = v.currentTime;
    });
  }, 1500);
})();
if (isTouchDevice) showLandingName(true);

function showLandingName(temporary) {
  if (!landingVisible) return;
  if (nameTimer) clearTimeout(nameTimer);
  landingNameEl.textContent = LANDING[landingCur].name;
  landingNameEl.style.opacity = '1';
  if (temporary) {
    nameTimer = setTimeout(function () {
      landingNameEl.style.opacity = '0';
      nameTimer = null;
    }, 3000);
  }
}

function hideLandingName() {
  if (nameTimer) { clearTimeout(nameTimer); nameTimer = null; }
  landingNameEl.style.opacity = '0';
}

function goLanding(n) {
  var prev = landingCur;
  landingCur = ((n % LANDING.length) + LANDING.length) % LANDING.length;
  landingSlides[prev].classList.remove('active');
  landingSlides[landingCur].classList.add('active');
  showLandingName(isTouchDevice);
}

/* Click → projet (zone centre uniquement) */
landingCarousel.addEventListener('click', function (e) {
  var cx = window.innerWidth / 2;
  var hw = window.innerWidth * 0.28;
  if (e.clientX > cx - hw && e.clientX < cx + hw) {
    window.location.href = LANDING[landingCur].href;
  }
});

/* Flèches */
landingPrev.addEventListener('click', function (e) {
  e.stopPropagation();
  goLanding(landingCur - 1);
});
landingNext.addEventListener('click', function (e) {
  e.stopPropagation();
  goLanding(landingCur + 1);
});

/* Desktop : 3 zones de hover + clic (gauche / centre / droite) */
if (!isTouchDevice) {
  var _hoverIn = false;

  function landingZone(clientX, clientY) {
    var lw = lineWork.getBoundingClientRect().top;
    var lc = lineContact.getBoundingClientRect().top;
    if (clientY <= lw || clientY >= lc) return 'none';
    var cx = window.innerWidth / 2;
    var hw = window.innerWidth * 0.28;
    if (clientX < cx - hw) return 'left';
    if (clientX > cx + hw) return 'right';
    return 'center';
  }

  document.addEventListener('mousemove', function (e) {
    if (!landingVisible) return;
    var zone = landingZone(e.clientX, e.clientY);
    var inCenter = zone === 'center';
    if (inCenter  && !_hoverIn) { _hoverIn = true;  showLandingName(false); }
    if (!inCenter &&  _hoverIn) { _hoverIn = false; hideLandingName(); }
    landingPrev.style.opacity = zone === 'left'  ? '0.9' : '';
    landingNext.style.opacity = zone === 'right' ? '0.9' : '';
  });

  document.addEventListener('click', function (e) {
    if (!landingVisible) return;
    var zone = landingZone(e.clientX, e.clientY);
    if (zone === 'left')  goLanding(landingCur - 1);
    if (zone === 'right') goLanding(landingCur + 1);
  });
}

/* Swipe mobile */
var swipeStartX = 0;
landingCarousel.addEventListener('touchstart', function (e) {
  swipeStartX = e.touches[0].clientX;
}, { passive: true });
landingCarousel.addEventListener('touchend', function (e) {
  var dx = e.changedTouches[0].clientX - swipeStartX;
  if (Math.abs(dx) > 40) goLanding(dx < 0 ? landingCur + 1 : landingCur - 1);
});

/* Visibilité globale (synchro ouverture/fermeture liste) */
function setLandingVisible(visible, dur) {
  var d = (dur || 0.3).toFixed(3) + 's ease';
  landingCarousel.style.transition = 'opacity ' + d;
  landingCarousel.style.opacity    = visible ? '1' : '0';
  landingCarousel.style.pointerEvents = visible ? '' : 'none';
  landingPrev.style.transition    = 'opacity ' + d;
  landingNext.style.transition    = 'opacity ' + d;
  landingPrev.style.opacity       = visible ? '' : '0';
  landingNext.style.opacity       = visible ? '' : '0';
  landingPrev.style.pointerEvents = visible ? '' : 'none';
  landingNext.style.pointerEvents = visible ? '' : 'none';
  if (!visible) hideLandingName();
  landingVisible = visible;
}

/* ── Slugification (gère les accents) ── */
function slug(s) {
  return s.toLowerCase()
    .replace(/[éèêë]/g, 'e')
    .replace(/[àâä]/g, 'a')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/[ùûü]/g, 'u')
    .replace(/\s+/g, '-')
    .replace(/\./g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/* ── Construction de la liste ── */
(function buildList() {
  var frag = document.createDocumentFragment();

  for (var i = 0; i < FEATURED.length; i++) {
    var f = FEATURED[i];
    var a = document.createElement('a');
    a.className = 'proj';
    a.href = 'projects/' + slug(f.name) + '.html';
    a.textContent = f.name;
    a.dataset.index = i + 1;
    a.dataset.label = (CURRENT_LANG === 'fr' && f.labelFr) ? f.labelFr : f.label;
    frag.appendChild(a);
  }

  for (var c = 0; c < CATEGORIES.length; c++) {
    var cat = CATEGORIES[c];
    var row = document.createElement('div');
    row.className = 'cat-row';

    var btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.dataset.label = (CURRENT_LANG === 'fr' && cat.labelFr) ? cat.labelFr : cat.label;
    btn.innerHTML = ((CURRENT_LANG === 'fr' && cat.nameFr) ? cat.nameFr : cat.name) + ' <span class="cat-sign">+</span>';

    var sub = document.createElement('div');
    sub.className = 'cat-sub';

    for (var p = 0; p < cat.projects.length; p++) {
      var proj = cat.projects[p];
      var pa = document.createElement('a');
      pa.className = 'proj proj-sub';
      pa.href = 'projects/' + cat.page + '.html#' + slug(proj.name);
      pa.textContent = proj.name;
      pa.dataset.label = (CURRENT_LANG === 'fr' && proj.labelFr) ? proj.labelFr : proj.label;
      sub.appendChild(pa);
    }

    row.appendChild(btn);
    row.appendChild(sub);
    frag.appendChild(row);
  }

  list.appendChild(frag);
})();


/* ── Helpers hauteur cat-sub ── */
function openSub(sub) {
  var items = sub.querySelectorAll('.proj-sub');
  var dur   = (items.length - 1) * 0.015 + 0.18;

  sub.style.transition = 'none';
  sub.style.height     = 'auto';
  var targetH          = sub.offsetHeight;
  sub.style.height     = '0px';
  sub.offsetHeight;
  var futureScrollH    = document.body.scrollHeight + targetH;
  sub.style.transition = 'height ' + dur.toFixed(3) + 's ease';
  sub.style.height     = targetH + 'px';
  window.scrollTo({ top: futureScrollH, behavior: 'smooth' });

  setTimeout(function () {
    sub.style.height     = 'auto';
    sub.style.transition = '';
  }, dur * 1000 + 16);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      items.forEach(function (item, i) {
        item.style.animationDelay = (i * 0.015) + 's';
        item.classList.remove('anim-in', 'anim-out');
        item.classList.add('anim-in');
      });
    });
  });
}

function closeSub(sub) {
  var items = sub.querySelectorAll('.proj-sub');
  var dur   = (items.length - 1) * 0.015 + 0.18;

  sub.style.transition = 'none';
  sub.style.height = sub.offsetHeight + 'px';
  sub.offsetHeight;
  sub.style.transition = 'height ' + dur.toFixed(3) + 's ease';
  sub.style.height = '0px';

  items.forEach(function (item, i) {
    item.style.animationDelay = ((items.length - 1 - i) * 0.015) + 's';
    item.classList.remove('anim-in', 'anim-out');
    item.classList.add('anim-out');
  });

  setTimeout(function () {
    sub.style.transition = '';
    items.forEach(function (item) {
      item.classList.remove('anim-in', 'anim-out');
      item.style.animationDelay = '';
    });
  }, dur * 1000 + 16);
}

/* ── Category toggle ── */
list.addEventListener('click', function (e) {
  var btn = e.target.closest('.cat-btn');
  if (!btn) return;

  var isOpen  = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!isOpen));
  var catSign = btn.querySelector('.cat-sign');
  if (catSign) catSign.textContent = isOpen ? '+' : '−';

  var row = btn.parentElement;
  var sub = row && row.querySelector('.cat-sub');
  if (!sub) return;

  if (!isOpen) { openSub(sub); } else { closeSub(sub); }
});

/* ── Collecte tous les items visibles dans l'ordre DOM ── */
function visibleItems() {
  var items = [];
  list.querySelectorAll('.proj:not(.proj-sub), .cat-btn').forEach(function (item) {
    items.push(item);
    if (item.classList.contains('cat-btn') && item.getAttribute('aria-expanded') === 'true') {
      var row = item.parentElement;
      var sub = row && row.querySelector('.cat-sub');
      if (sub) {
        sub.querySelectorAll('.proj-sub').forEach(function (si) { items.push(si); });
      }
    }
  });
  return items;
}

/* ── Calcul masques + padding liste ── */
function sync() {
  var topEdge     = uiTop.getBoundingClientRect().bottom;
  var fs          = parseFloat(getComputedStyle(uiTop).fontSize);
  var lh          = fs * 1.2;
  var tH          = Math.ceil(topEdge + fs * 0.7);
  var bH          = Math.ceil(window.innerHeight * 0.12 + lh * 1.2);
  var contactRect = contactEl.getBoundingClientRect();

  maskT.style.height    = tH + 'px';
  maskB.style.height    = bH + 'px';
  lineWork.style.top    = Math.round(topEdge) + 'px';
  lineContact.style.top = Math.round(contactRect.top) + 'px';
  landingNameEl.style.top = (Math.round(topEdge) + 10) + 'px';

  var midY = Math.round((topEdge + contactRect.top) / 2);
  landingPrev.style.top = midY + 'px';
  landingNext.style.top = midY + 'px';

  if (list.style.display !== 'none') {
    list.style.paddingTop    = Math.ceil(topEdge) + 'px';
    list.style.paddingBottom = Math.ceil(bH * 0.875 - fs * 0.08 + 3) + 'px';
  }
}

sync();
window.addEventListener('resize', function() { sync(); applyLandingSizes(); });
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(sync);
}

/* ── Toggle work +/− ── */
var closeTimer = null;

function resetItems() {
  list.querySelectorAll('.proj, .cat-btn').forEach(function (item) {
    item.classList.remove('anim-in', 'anim-out');
    item.style.animationDelay = '';
  });
}

function closeAllCategories() {
  list.querySelectorAll('.cat-btn').forEach(function (btn) {
    btn.setAttribute('aria-expanded', 'false');
    var s = btn.querySelector('.cat-sign');
    if (s) s.textContent = '+';
  });
  list.querySelectorAll('.cat-sub').forEach(function (sub) {
    sub.style.transition = 'none';
    sub.style.height = '0px';
    sub.querySelectorAll('.proj-sub').forEach(function (item) {
      item.classList.remove('anim-in', 'anim-out');
      item.style.animationDelay = '';
    });
    requestAnimationFrame(function () { sub.style.transition = ''; });
  });
}

workBtn.addEventListener('click', function () {
  var isOpen = workBtn.getAttribute('aria-expanded') === 'true';
  var next   = !isOpen;

  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }

  workBtn.setAttribute('aria-expanded', String(next));
  sign.textContent = next ? '−' : '+';

  if (next) {
    listIsOpen = true;
    list.style.display = 'block';
    sync();
    window.scrollTo({ top: 0, behavior: 'instant' });
    resetItems();
    var openItemCount = list.querySelectorAll('.proj:not(.proj-sub), .cat-btn').length;
    var openDur       = (openItemCount - 1) * 0.015 + 0.18;
    setLandingVisible(false, openDur);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        list.querySelectorAll('.proj:not(.proj-sub), .cat-btn').forEach(function (item, i) {
          item.style.animationDelay = (i * 0.015) + 's';
          item.classList.add('anim-in');
        });
      });
    });

  } else {
    var items    = visibleItems();
    var total    = items.length;
    var closeDur = (total - 1) * 0.015 + 0.18;
    setLandingVisible(true, closeDur);

    list.querySelectorAll('.cat-btn[aria-expanded="true"]').forEach(function (btn) {
      var row = btn.parentElement;
      var sub = row && row.querySelector('.cat-sub');
      if (sub) {
        sub.style.transition = 'none';
        sub.style.height = sub.offsetHeight + 'px';
        sub.offsetHeight;
        sub.style.transition = 'height ' + closeDur.toFixed(3) + 's ease';
        sub.style.height = '0px';
      }
    });

    resetItems();
    items.forEach(function (item, i) {
      item.style.animationDelay = ((total - 1 - i) * 0.015) + 's';
      item.classList.add('anim-out');
    });

    closeTimer = setTimeout(function () {
      closeTimer = null;
      listIsOpen = false;
      list.style.display = 'none';
      resetItems();
      closeAllCategories();
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, closeDur * 1000 + 16);
  }
});
