/* ============================================================
   carousel.js — Carousel d'images et vidéos minimaliste
   ============================================================
   Images : fichiers 1.jpg, 2.jpg … dans le dossier indiqué
   Vidéos : fichiers 1.mp4, 2.mp4 … + data-ext="mp4|webm"
   Mixte  : data-files="3.webm,1.jpg,2.jpg" (chemin relatif ou nom)
   ============================================================ */

function initCarousel(el) {
  var folder  = el.dataset.folder;
  var count   = el.dataset.count ? parseInt(el.dataset.count, 10) : 0;
  var ext     = el.dataset.ext || 'jpg';
  var isVideo = ext === 'mp4' || ext === 'webm';
  var track   = el.querySelector('.carousel-track');
  var prevBtn = el.querySelector('.carousel-prev');
  var nextBtn = el.querySelector('.carousel-next');
  var ctr     = el.querySelector('.carousel-counter');
  var items   = [];
  var cur     = 0;

  function isVideoSrc(src) {
    return /\.(mp4|webm)$/i.test(src);
  }

  function go(n) {
    /* Pause la vidéo courante avant de changer */
    if (items[cur] && items[cur].tagName === 'VIDEO') {
      items[cur].pause();
      items[cur].currentTime = 0;
    }
    cur = ((n % items.length) + items.length) % items.length;
    track.style.transform = 'translateX(-' + (cur * 100) + '%)';
    ctr.textContent = (cur + 1) + '/' + items.length;
    /* Lance la nouvelle vidéo */
    if (items[cur] && items[cur].tagName === 'VIDEO') {
      items[cur].play().catch(function () {});
    }
  }

  function makeEl(src) {
    var node;
    if (isVideoSrc(src)) {
      node = document.createElement('video');
      node.src = src;
      node.loop = true;
      node.muted = true;
      node.playsInline = true;
      node.setAttribute('playsinline', '');
      node.autoplay = false;
    } else {
      node = document.createElement('img');
      node.src = src;
      node.alt = '';
      node.draggable = false;
    }
    return node;
  }

  function build(srcs) {
    if (!srcs.length) return;
    srcs.forEach(function (src) {
      var node = makeEl(src);
      items.push(node);
      track.appendChild(node);
    });
    ctr.textContent = '1/' + items.length;
    /* Lance la première vidéo si c'en est une */
    if (items[0] && items[0].tagName === 'VIDEO') items[0].play().catch(function () {});
  }

  function loadSeq(i, max, acc, cb) {
    if (i > max) { cb(acc); return; }
    var testEl;
    if (isVideo) {
      acc.push('../' + folder + '/' + i + '.' + ext);
      loadSeq(i + 1, max, acc, cb);
    } else {
      testEl = new Image();
      testEl.onload  = function () { acc.push('../' + folder + '/' + i + '.jpg'); loadSeq(i + 1, max, acc, cb); };
      testEl.onerror = function () { cb(acc); };
      testEl.src = '../' + folder + '/' + i + '.jpg';
    }
  }

  /* Mode data-files : liste explicite de fichiers (mixte) */
  if (el.dataset.files) {
    var srcs = el.dataset.files.split(',').map(function (f) {
      f = f.trim();
      return f.indexOf('/') === -1 ? '../' + folder + '/' + f : f;
    });
    build(srcs);
  } else if (count > 0) {
    var srcs = [];
    for (var i = 1; i <= count; i++) srcs.push('../' + folder + '/' + i + '.' + ext);
    build(srcs);
  } else {
    loadSeq(1, 50, [], build);
  }

  prevBtn.addEventListener('click', function () { go(cur - 1); });
  nextBtn.addEventListener('click', function () { go(cur + 1); });

  /* ── Swipe tactile ────────────────────────────────────────────────
     Les écouteurs sont sur .carousel-window et NON sur .carousel-track :
     le track subit translateX(-100%, -200%…), donc dès la 2e slide sa boîte
     est sortie de la zone visible. Comme les <img>/<video> sont en
     pointer-events:none, le toucher ne rencontrait plus aucun élément à
     l'écoute et le swipe cessait de fonctionner. La fenêtre, elle, ne
     bouge jamais. */
  var swipeSurface = el.querySelector('.carousel-window') || el;
  var startX = 0, startY = 0, tracking = false;

  swipeSurface.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { tracking = false; return; }
    startX   = e.touches[0].clientX;
    startY   = e.touches[0].clientY;
    tracking = true;
  }, { passive: true });

  swipeSurface.addEventListener('touchend', function (e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    /* Geste horizontal uniquement : un scroll vertical ne doit pas
       déclencher un changement de slide. */
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? cur + 1 : cur - 1);
    }
  }, { passive: true });

  swipeSurface.addEventListener('touchcancel', function () { tracking = false; }, { passive: true });
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.carousel').forEach(initCarousel);
});
