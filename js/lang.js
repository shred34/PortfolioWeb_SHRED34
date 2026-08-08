/* ============================================================
   lang.js — Système bilingue EN / FR
   ============================================================ */

var CURRENT_LANG = localStorage.getItem('lang') || 'en';

var TRANSLATIONS = {
  en: {
    work:      'Work',
    available: 'Available for work',
    visitSite: 'Visit website',
    bio:       "I’m Alexander Anhorn, a designer from Lausanne, currently studying Media, Interaction and Design at ECAL. My work explores interfaces, games, interactive objects, video and 3D, with a keen sensitivity to visual identity and graphic design."
  },
  fr: {
    work:      'Projets',
    available: 'Disponible pour des projets',
    visitSite: 'Voir le site',
    bio:       "Je suis Alexander Anhorn, designer lausannois, encore étudiant en Media, Interaction et Design à l’ECAL. Mon travail explore les interfaces, le jeu, les objets interactifs, la vidéo et la 3D, avec une sensibilité accrue à l’identité visuelle et au graphisme."
  }
};

function applyTranslations() {
  var t = TRANSLATIONS[CURRENT_LANG];
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });
}

function setLang(l) {
  localStorage.setItem('lang', l);
  location.reload();
}

document.addEventListener('DOMContentLoaded', function () {
  applyTranslations();

  /* Toggle — landing page uniquement */
  var elEn = document.getElementById('lang-en');
  var elFr = document.getElementById('lang-fr');
  if (elEn && elFr) {
    elEn.style.opacity = CURRENT_LANG === 'en' ? '1' : '0.3';
    elFr.style.opacity = CURRENT_LANG === 'fr' ? '1' : '0.3';
    elEn.addEventListener('click', function () { if (CURRENT_LANG !== 'en') setLang('en'); });
    elFr.addEventListener('click', function () { if (CURRENT_LANG !== 'fr') setLang('fr'); });
  }
});
