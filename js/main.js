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

var maskT       = document.getElementById('mask-top');
var maskB       = document.getElementById('mask-bottom');
var lineWork    = document.getElementById('line-work');
var lineContact = document.getElementById('line-contact');
var workBtn     = document.getElementById('work-btn');
var sign        = document.getElementById('sign');
var list        = document.getElementById('list');
var listIsOpen  = false;

/* ── Landing Carousel ── */
/* Couvertures en H.264/MP4 : décodage matériel sur tous les navigateurs,
   Safari macOS compris (qui n'a pas de décodeur VP9 matériel). */
var LANDING = [
  { name: 'Shredsauce Exploration', src: './covers/shredsauce.mp4', href: 'projects/shredsauce-exploration.html', size: '104%', mobileSize: '82%' },
  { name: 'Camille',                src: './covers/camille.mp4',    href: 'projects/camille.html',                size: '94%',  mobileSize: '105%',  nudge: '-2vh' },
  { name: 'Tristan-Linder.ch',      src: './covers/tristan.mp4',    href: 'projects/tristan-linder-ch.html',      size: '77%',  mobileSize: '85%',   nudge: '-2vh' },
  { name: 'Pluck',                  src: './covers/pluck.mp4',      href: 'projects/pluck.html',                  size: '80%',  mobileSize: '95%',   nudge: '-2vh' },
  { name: 'Wild Destroyer',         src: './covers/wild.mp4',       href: 'projects/wild-destroyer.html',         size: '78%',  mobileSize: '55%',   nudge: '-2vh' }
];

var landingCarousel = document.getElementById('landing-carousel');
var landingPrev     = document.getElementById('landing-prev');
var landingNext     = document.getElementById('landing-next');
var landingNameEl   = document.getElementById('landing-name');
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

/* ── Maintien de la lecture ──────────────────────────────────────────
   Volontairement non destructif : on ne fait JAMAIS de seek
   (v.currentTime = ...) ni de v.load(). Ces deux opérations vident et
   reconstruisent tout le pipeline de décodage — sur Safari elles coûtent
   plus cher que de laisser la vidéo continuer, et transforment un simple
   hoquet en blocage définitif. Un play() sur une vidéo en pause suffit. */
function playAllVideos() {
  landingVideos.forEach(function (v) {
    if (v.paused) v.play().catch(function () {});
  });
}

/* Le navigateur met une vidéo en pause (économie d'énergie) → on relance */
landingVideos.forEach(function (v) {
  v.addEventListener('pause', function () {
    setTimeout(function () {
      if (v.paused && !document.hidden) v.play().catch(function () {});
    }, 200);
  });
});

playAllVideos();

/* Retour de l'onglet / de la fenêtre au premier plan */
document.addEventListener('visibilitychange', function () {
  if (!document.hidden) playAllVideos();
});
window.addEventListener('focus', playAllVideos);

/* Filet de sécurité */
setInterval(function () {
  if (!document.hidden) playAllVideos();
}, 3000);

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
var swipeStartX = 0, swipeStartY = 0, swipeTracking = false;

landingCarousel.addEventListener('touchstart', function (e) {
  if (e.touches.length !== 1) { swipeTracking = false; return; }
  swipeStartX   = e.touches[0].clientX;
  swipeStartY   = e.touches[0].clientY;
  swipeTracking = true;
}, { passive: true });

landingCarousel.addEventListener('touchend', function (e) {
  if (!swipeTracking) return;
  swipeTracking = false;
  var dx = e.changedTouches[0].clientX - swipeStartX;
  var dy = e.changedTouches[0].clientY - swipeStartY;
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
    goLanding(dx < 0 ? landingCur + 1 : landingCur - 1);
  }
}, { passive: true });

landingCarousel.addEventListener('touchcancel', function () { swipeTracking = false; }, { passive: true });

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

/* ── Masques, flèches et padding liste ──────────────────────────────
   Tout est déduit de la position RÉELLE des deux lignes, mesurée dans le
   document. Les lignes elles-mêmes sont placées en CSS pur (elles sont
   enfants de #ui-top et #contact-wrap). Il n'existe donc qu'une seule
   source de vérité : impossible que les masques, les flèches et les
   lignes se retrouvent désaccordés.

   MASK_SOLID doit correspondre au CSS des masques : le dégradé est
   100% opaque sur ses 88 premiers %, puis s'estompe sur les 12 derniers. */
var MASK_SOLID = 0.88;
var NUDGE_COMP = 0.02;  /* fraction de la hauteur d'écran : compense le
                           nudge -2vh commun aux vidéos du carousel.
                           C'est LA valeur à retoucher si les vidéos ne
                           tombent pas pile sur l'axe des flèches.
                           Augmenter = descendre / diminuer = remonter. */
var EDGE_PAD   = 2;   /* px : la liste a totalement disparu ce nombre de
                         pixels avant d'atteindre la ligne.
                         AUGMENTER = disparaît plus tôt / cache plus grand.
                         DIMINUER  = disparaît plus près de la ligne.
                         C'est LA valeur à retoucher pour ce réglage. */

function sync() {
  var vh       = window.innerHeight;
  var topLineY = lineWork.getBoundingClientRect().bottom;   /* sous la ligne du haut */
  var botLineY = lineContact.getBoundingClientRect().top;   /* sur la ligne du bas   */

  /* Hauteur telle que la zone 100% opaque s'arrête à EDGE_PAD px
     à l'intérieur de chaque ligne. */
  maskT.style.height = Math.ceil((topLineY + EDGE_PAD) / MASK_SOLID) + 'px';
  maskB.style.height = Math.ceil((vh - botLineY + EDGE_PAD) / MASK_SOLID) + 'px';

  landingNameEl.style.top = Math.round(topLineY + 10) + 'px';

  /* Flèches ET carousel : centrés sur le même axe, calculé depuis les lignes.
     Le carousel avait gardé un calc(50% + 4vh) figé dans le CSS, sans rapport
     avec la position réelle des lignes — d'où les vidéos légèrement trop
     basses. Les 'nudge' par vidéo dans LANDING restent, eux, des réglages
     individuels de cadrage. */
  var midY = Math.round((topLineY + botLineY) / 2);
  landingPrev.style.top = midY + 'px';
  landingNext.style.top = midY + 'px';

  /* 4 vidéos sur 5 portent un nudge -2vh dans LANDING. Ce décalage commun
     n'est pas un cadrage individuel, c'est un déplacement de tout le groupe :
     on l'annule ici pour que les vidéos tombent pile sur l'axe des flèches.
     Les nudge restent utiles pour les écarts d'une vidéo à l'autre. */
  landingCarousel.style.top = Math.round(midY + NUDGE_COMP * vh) + 'px';

  if (list.style.display !== 'none') {
    list.style.paddingTop    = Math.ceil(topLineY) + 'px';
    list.style.paddingBottom = Math.ceil(vh - botLineY) + 'px';
  }
}

/* ── Déclenchement de sync() ────────────────────────────────────────
   Problème corrigé ici : sur iOS, la barre de Safari qui apparaît ou
   disparaît pendant le scroll émet un 'resize' PENDANT son animation.
   sync() mesurait alors les lignes dans un état transitoire, calculait une
   hauteur de cache fausse — et cette valeur restait figée jusqu'au resize
   suivant. D'où les rares décalages cache/ligne en bout de scroll.

   Parade : on mesure tout de suite (réactivité desktop) PUIS de nouveau une
   fois que tout s'est stabilisé. Et on repasse un coup après chaque fin de
   scroll, ce qui rattrape aussi le rebond élastique en bout de course.
   Les caches sont blancs sur fond blanc : ces recalculs sont invisibles. */
var settleTimer = null;
function syncNowAndAfterSettle() {
  sync();
  clearTimeout(settleTimer);
  settleTimer = setTimeout(sync, 250);
}

sync();

window.addEventListener('resize', function () {
  syncNowAndAfterSettle();
  applyLandingSizes();
});

var scrollTimer = null;
window.addEventListener('scroll', function () {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(sync, 150);   /* uniquement à l'arrêt du scroll */
}, { passive: true });

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
