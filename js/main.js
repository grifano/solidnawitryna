/* Solidna Witryna: first screen (hero)
   Intro: splash (logo → wordmark → logo left / photo right) lifts away; hero follows.
   Hero: photo backs the headline, then flies into the header; the brand-to-website scene takes its place.
   Respects prefers-reduced-motion: no intro, no animation, final state shown at once. */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var ease = 'cubic-bezier(.22,.8,.3,1)', spring = 'cubic-bezier(.34,1.56,.64,1)';
  var paused = false;

  /* wordmark letters for the splash */
  var spWord = $('#spWord');
  [['solidna', 'a'], ['witryna', 'b'], ['.pl', 'c']].forEach(function (p) {
    p[0].split('').forEach(function (ch) {
      var s = document.createElement('span');
      s.className = 'ch ' + p[1];
      s.textContent = ch;
      spWord.appendChild(s);
    });
  });

  /* ---------- rotating business word (draft list, genitive after "dla") ---------- */
  var words = ['dentystów', 'fizjoterapeutów', 'kosmetologów', 'szkół językowych', 'szkół jazdy', 'weterynarzy', 'studiów tańca', 'fryzjerów', 'mechaników', 'psychologów', 'trenerów', 'przedszkoli'];
  var wi = 0, rotTimer = null, rot = $('#rot');
  function rotateOnce() {
    var out = rot.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(-.35em)', opacity: 0 }], { duration: 200, easing: 'ease-in', fill: 'forwards' });
    out.onfinish = function () {
      wi = (wi + 1) % words.length;
      rot.textContent = words[wi];
      out.cancel();
      rot.animate([{ transform: 'translateY(.35em)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 280, easing: ease });
    };
  }
  function startRot() { stopRot(); if (!paused) rotTimer = setInterval(rotateOnce, 1700); }
  function stopRot() { clearInterval(rotTimer); rotTimer = null; }

  /* ---------- scene: brand → website → trust ---------- */
  var L = 10000, sAnims = [], sTimer = null, sceneOn = false;
  function S(el, kf, o) { var a = el.animate(kf, Object.assign({ fill: 'both', easing: ease }, o)); sAnims.push(a); return a; }
  function stopScene() { sAnims.forEach(function (a) { a.cancel(); }); sAnims = []; clearTimeout(sTimer); }
  function pop(el, delay, dur) { S(el, [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'none' }], { duration: dur || 450, delay: delay, easing: spring }); }
  function playScene() {
    stopScene(); if (paused || !sceneOn) return;
    S($('#stage'), [{ opacity: 1 }, { opacity: 1, offset: .94 }, { opacity: 0 }], { duration: L, easing: 'linear' });
    S($('#win'), [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 600 });
    S($('#guides'), [{ opacity: 0 }, { opacity: 1, offset: .15 }, { opacity: 1, offset: .8 }, { opacity: 0 }], { duration: 2300, delay: 300, easing: 'linear' });
    S($('#pencil'), [
      { opacity: 0, transform: 'translate(190px,330px) rotate(-35deg)' },
      { opacity: 1, transform: 'translate(206px,318px) rotate(-35deg)', offset: .1 },
      { opacity: 1, transform: 'translate(398px,306px) rotate(-35deg)', offset: .9 },
      { opacity: 0, transform: 'translate(414px,300px) rotate(-35deg)' }], { duration: 1700, delay: 500, easing: 'linear' });
    S($('#wm'), [{ strokeDashoffset: 600, fillOpacity: 0, strokeOpacity: 1 }, { strokeDashoffset: 0, fillOpacity: 0, strokeOpacity: 1 }], { duration: 1500, delay: 600, easing: 'ease-in-out' });
    S($('#wm'), [{ strokeDashoffset: 0, fillOpacity: 0, strokeOpacity: 1 }, { strokeDashoffset: 0, fillOpacity: 1, strokeOpacity: 0 }], { duration: 600, delay: 2200, fill: 'forwards' });
    S($('#arcA'), [{ strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDasharray: 1, strokeDashoffset: 0 }], { duration: 550, delay: 2600 });
    S($('#arcB'), [{ strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDasharray: 1, strokeDashoffset: 0 }], { duration: 550, delay: 2850 });
    S($('#sw'), [{ opacity: 1 }, { opacity: 1, offset: .75 }, { opacity: 0 }], { duration: 1700, delay: 3100, easing: 'linear' });
    $$('#sw circle').forEach(function (c, i) { pop(c, 3200 + i * 130, 420); });
    S($('#logo'), [{ transform: 'translate(300px,292px) scale(1)' }, { transform: 'translate(88px,138px) scale(.46)' }], { duration: 1000, delay: 4700, easing: 'cubic-bezier(.6,0,.2,1)' });
    $$('.navp').forEach(function (n, i) { pop(n, 5400 + i * 90, 380); });
    S($('#heroBg'), [{ opacity: 0, transform: 'scaleY(.3)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 5300 });
    S($('#sc'), [{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 5600, easing: 'linear' });
    S($('#house'), [{ transform: 'translateY(26px)' }, { transform: 'none' }], { duration: 700, delay: 5700 });
    pop($('#tree'), 6100, 500);
    $$('.hl').forEach(function (h, i) { var o = h.getAttribute('opacity') || 1; S(h, [{ opacity: 0, transform: 'translateX(-22px)' }, { opacity: o, transform: 'none' }], { duration: 500, delay: 5700 + i * 130 }); });
    pop($('#heroBtn'), 6200, 450);
    $$('.card').forEach(function (c, i) { pop(c, 6400 + i * 180, 480); });
    S($('#shieldBody'), [{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 7400, easing: spring });
    S($('#rays'), [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 7800, easing: spring });
    sTimer = setTimeout(playScene, L + 400);
  }

  /* ---------- intro: splash → hero → photo flies into header ---------- */
  var iAnims = [], iTimers = [];
  var page = $('#page'), splash = $('#splash'), heroPhoto = $('#heroPhoto'), rings = $('#rings'),
      hdrPhoto = $('#hdrPhoto'), byText = $('#by span'), scene = $('#scene');
  function I(el, kf, o) { var a = el.animate(kf, Object.assign({ fill: 'both', easing: ease }, o)); iAnims.push(a); return a; }
  function later(fn, ms) { iTimers.push(setTimeout(fn, ms)); }
  /* While the splash covers the page, keep the page out of reach of keyboard and screen reader. */
  function lockPage(on) { page.inert = on; }
  function resetAll() {
    iAnims.forEach(function (a) { a.cancel(); }); iAnims = []; iTimers.forEach(clearTimeout); iTimers = [];
    stopScene(); stopRot(); sceneOn = false;
    wi = 0; rot.textContent = words[0];
  }
  function finalState() {
    splash.hidden = true; document.documentElement.style.overflow = ''; lockPage(false);
    heroPhoto.style.visibility = 'hidden'; rings.style.visibility = 'hidden';
    hdrPhoto.style.opacity = 1; byText.style.opacity = 1; scene.style.opacity = 1;
  }
  function flipToHeader() {
    var p = heroPhoto.getBoundingClientRect(), a = hdrPhoto.getBoundingClientRect();
    var s = a.width / p.width, dx = a.left - p.left, dy = a.top - p.top;
    I(rings, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 });
    var f = I(heroPhoto, [{ transform: 'none' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')' }], { duration: 500, easing: 'cubic-bezier(.65,0,.25,1)' });
    f.onfinish = function () {
      heroPhoto.style.visibility = 'hidden'; hdrPhoto.style.opacity = 1;
      I(byText, [{ opacity: 0, transform: 'translateX(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 450 });
      I(scene, [{ opacity: 0 }, { opacity: 1 }], { duration: 500 });
      sceneOn = true; playScene();
    };
  }
  function intro() {
    resetAll();
    if (mq.matches) { finalState(); rot.textContent = 'lokalnych firm'; $('#ctrl').hidden = true; $('#replay').hidden = true; return; }
    splash.hidden = false; document.documentElement.style.overflow = 'hidden'; lockPage(true);
    heroPhoto.style.visibility = 'visible'; rings.style.visibility = 'visible';
    hdrPhoto.style.opacity = 0; byText.style.opacity = 0; scene.style.opacity = 0;
    var mark = $('#spMark'), spP = $('#spPhoto');
    I(mark, [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'none' }], { duration: 650, easing: spring });
    $$('#spWord .ch').forEach(function (c, i) { I(c, [{ transform: 'translateY(110%)' }, { transform: 'none' }], { duration: 520, delay: 650 + i * 35 }); });
    I(mark, [{ transform: 'translateX(0)' }, { transform: 'translateX(-82px)' }], { duration: 750, delay: 1200, fill: 'forwards', easing: 'cubic-bezier(.65,0,.25,1)' });
    I(spP, [{ opacity: 0, transform: 'translateX(0) scale(.7)' }, { opacity: 1, transform: 'translateX(82px) scale(1)' }], { duration: 750, delay: 1200, easing: 'cubic-bezier(.65,0,.25,1)' });
    I($('#spBy'), [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 1800 });
    I(splash, [{ transform: 'none' }, { transform: 'translateY(-100%)' }], { duration: 850, delay: 3000, easing: 'cubic-bezier(.7,0,.2,1)' })
      .onfinish = function () { splash.hidden = true; document.documentElement.style.overflow = ''; lockPage(false); };
    $$('.reveal').forEach(function (e, i) { I(e, [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 650, delay: 3300 + i * 110 }); });
    I(heroPhoto, [{ opacity: 0, transform: 'scale(.85)' }, { opacity: 1, transform: 'none' }], { duration: 750, delay: 3400 });
    I(rings, [{ opacity: 0, transform: 'scale(.85)' }, { opacity: 1, transform: 'none' }], { duration: 750, delay: 3400 });
    later(startRot, 4200);
    later(flipToHeader, 5300);
  }

  /* The button label already tells the state ("Zatrzymaj" / "Wznów"), so no aria-pressed here. */
  $('#ctrl').addEventListener('click', function () {
    paused = !paused;
    this.textContent = paused ? 'Wznów animację' : 'Zatrzymaj animację';
    if (paused) { stopScene(); stopRot(); } else { if (sceneOn) playScene(); if (splash.hidden) startRot(); }
  });
  $('#replay').addEventListener('click', function () { window.scrollTo(0, 0); intro(); });
  intro();
})();
