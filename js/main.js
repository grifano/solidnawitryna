/* Solidna Witryna: first screen (hero)
   Intro: a short splash (logo → wordmark → logo left / photo right) lifts away in 1.8 s; the hero follows.
   The h1, the photo and the rings are visible from the first paint (they are LCP candidates), so the splash
   never delays content. The photo then flies into the header and the brand-to-website scene takes its place.
   Full splash: once per session. Respects prefers-reduced-motion: no intro, no animation, final state at once. */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var ease = 'cubic-bezier(.22,.8,.3,1)', spring = 'cubic-bezier(.34,1.56,.64,1)';
  var paused = false;

  /* ---------- timing (ms) ---------- */
  var SPLASH_MS = 1800;  /* full splash length (was 900). The steps in playSplash() are written for 900 ms and scaled by K. */
  var K = SPLASH_MS / 900;
  var ROT_AFTER = 350;   /* rotating word starts this long after the splash ends */
  var FLIP_AFTER = 800;  /* photo flies into the header this long after the splash ends */
  var FLIP_MS = 1200;    /* length of that flight (was 500) */
  var FLIP_EASE = 'cubic-bezier(.42,0,.58,1)'; /* ease in and out (same as Figma "Ease in and out" / CSS ease-in-out): slow start, fast middle, slow landing */

  /* ---------- splash shown once per session (storage can be blocked, so always try/catch) ---------- */
  var SPLASH_KEY = 'sw-splash-seen'; /* same key as the inline script in <head> */
  function splashSeen() { try { return sessionStorage.getItem(SPLASH_KEY) === '1'; } catch (e) { return false; } }
  function markSplashSeen() { try { sessionStorage.setItem(SPLASH_KEY, '1'); } catch (e) { /* ignore */ } }

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
  var START_TEXT = 'lokalnych firm'; /* same as the HTML, so the h1 does not change when the script starts */
  var wi = -1, rotTimer = null, rot = $('#rot');
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
  var splash = $('#splash'), heroPhoto = $('#heroPhoto'), rings = $('#rings'),
      hdrPhoto = $('#hdrPhoto'), byText = $('#by span'), scene = $('#scene');
  function I(el, kf, o) { var a = el.animate(kf, Object.assign({ fill: 'both', easing: ease }, o)); iAnims.push(a); return a; }
  function later(fn, ms) { iTimers.push(setTimeout(fn, ms)); }
  function resetAll() {
    iAnims.forEach(function (a) { a.cancel(); }); iAnims = []; iTimers.forEach(clearTimeout); iTimers = [];
    stopScene(); stopRot(); sceneOn = false;
    wi = -1; rot.textContent = START_TEXT;
  }
  function finalState() {
    splash.hidden = true;
    heroPhoto.style.visibility = 'hidden'; rings.style.visibility = 'hidden';
    hdrPhoto.style.opacity = 1; byText.style.opacity = 1; scene.style.opacity = 1;
  }
  function flipToHeader() {
    var p = heroPhoto.getBoundingClientRect(), a = hdrPhoto.getBoundingClientRect();
    var s = a.width / p.width, dx = a.left - p.left, dy = a.top - p.top;
    /* the rings fade while the photo leaves, instead of vanishing at the start */
    I(rings, [{ opacity: 1 }, { opacity: 0 }], { duration: FLIP_MS * .7, easing: FLIP_EASE });
    var f = I(heroPhoto, [{ transform: 'none' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')' }], { duration: FLIP_MS, easing: FLIP_EASE });
    /* the scene and the "by" text start while the photo is still travelling, so the move flows into them */
    later(function () { I(scene, [{ opacity: 0 }, { opacity: 1 }], { duration: 800, easing: FLIP_EASE }); sceneOn = true; playScene(); }, FLIP_MS * .45);
    I(byText, [{ opacity: 0, transform: 'translateX(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 650, delay: FLIP_MS * .7, easing: FLIP_EASE });
    f.onfinish = function () { heroPhoto.style.visibility = 'hidden'; hdrPhoto.style.opacity = 1; };
  }
  function playSplash() {
    var mark = $('#spMark'), spP = $('#spPhoto');
    markSplashSeen();
    document.documentElement.classList.remove('no-splash');
    splash.hidden = false; splash.classList.add('is-live');
    I(mark, [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'none' }], { duration: 240 * K, easing: spring });
    $$('#spWord .ch').forEach(function (c, i) { I(c, [{ transform: 'translateY(110%)' }, { transform: 'none' }], { duration: 220 * K, delay: (110 + i * 11) * K }); });
    I(mark, [{ transform: 'translateX(0)' }, { transform: 'translateX(-82px)' }], { duration: 260 * K, delay: 300 * K, fill: 'forwards', easing: 'cubic-bezier(.65,0,.25,1)' });
    I(spP, [{ opacity: 0, transform: 'translateX(0) scale(.7)' }, { opacity: 1, transform: 'translateX(82px) scale(1)' }], { duration: 260 * K, delay: 300 * K, easing: 'cubic-bezier(.65,0,.25,1)' });
    I($('#spBy'), [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 200 * K, delay: 380 * K });
    I(splash, [{ transform: 'none' }, { transform: 'translateY(-100%)' }], { duration: 300 * K, delay: 600 * K, easing: 'cubic-bezier(.7,0,.2,1)' })
      .onfinish = function () { splash.hidden = true; };
    /* small text blocks fade in as the splash lifts; the h1 and the photo are never faded */
    $$('.reveal').forEach(function (e, i) { I(e, [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 450, delay: SPLASH_MS - 300 * K + i * 70 }); });
  }
  function intro(opts) {
    resetAll();
    if (mq.matches) { finalState(); $('#ctrl').hidden = true; $('#replay').hidden = true; return; }
    var withSplash = !!(opts && opts.forceSplash) || !splashSeen();
    var t0 = withSplash ? SPLASH_MS : 0;
    heroPhoto.style.visibility = 'visible'; rings.style.visibility = 'visible';
    hdrPhoto.style.opacity = 0; byText.style.opacity = 0; scene.style.opacity = 0;
    if (withSplash) playSplash(); else splash.hidden = true;
    later(startRot, t0 + ROT_AFTER);
    later(flipToHeader, t0 + FLIP_AFTER);
  }

  /* The button label already tells the state ("Zatrzymaj" / "Wznów"), so no aria-pressed here. */
  $('#ctrl').addEventListener('click', function () {
    paused = !paused;
    this.textContent = paused ? 'Wznów animację' : 'Zatrzymaj animację';
    if (paused) { stopScene(); stopRot(); } else { if (sceneOn) playScene(); if (splash.hidden) startRot(); }
  });
  $('#replay').addEventListener('click', function () { window.scrollTo(0, 0); intro({ forceSplash: true }); });
  intro();
})();
