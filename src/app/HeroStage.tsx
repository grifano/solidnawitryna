"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { IconButton } from "@/components/IconButton";
import { Logo } from "@/components/Logo";
import portrait from "@/assets/serhii.jpg";

/*
 * Правий бік першого екрана: портрет, що відкочується, і анімована сцена
 * «бренд → сайт → довіра». Тут же заставка (splash) на весь екран.
 *
 * Інтро (портрет за 1,8 с після заставки): заставка піднімається вгору, портрет з кільцем
 * відкочується вправо й гасне, на його місці з'являється сцена, а підпис «by Serhii Orlenko»
 * в шапці виїжджає з-під лого. Решту елементів сторінки знаходимо за атрибутами
 * data-intro="by | by-text | reveal" (див. page.tsx).
 *
 * Базові стилі сцени — ГОТОВИЙ стан; анімація (Web Animations API) веде до нього.
 * Заставка показується раз за сесію. При prefers-reduced-motion анімації немає:
 * одразу готовий стан. Без JS заставка й портрет сховані (noscript у layout.tsx).
 */

const SPLASH_KEY = "sw-splash-seen"; // той самий ключ, що в скрипті в <head> (layout.tsx)
const SPLASH_MS = 1800; // повна довжина заставки; кроки в playSplash написані під 900 мс і множаться на K
const K = SPLASH_MS / 900;
const TO_SCENE_AFTER = 600; // портрет відкочується, а сцена з'являється через стільки після заставки
const SCENE_LOOP_MS = 10000;

const EASE = "cubic-bezier(.22,.8,.3,1)";
const SPRING = "cubic-bezier(.34,1.56,.64,1)";
const SOFT = "cubic-bezier(.45,0,.25,1)";

/* Елементи сцени, що «вискакують» і масштабуються від власного центру / верху. */
const pop: CSSProperties = {
  transformBox: "fill-box",
  transformOrigin: "50% 50%",
};
const top: CSSProperties = {
  transformBox: "fill-box",
  transformOrigin: "50% 0",
};
const fromOrigin: CSSProperties = { transformOrigin: "0 0" };

const WORD: [string, string][] = [
  ["solidna", "text-text"],
  ["witryna", "text-accent"],
  [".pl", "text-text-muted"],
];

interface StageApi {
  setPaused: (paused: boolean) => void;
}

export function HeroStage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<StageApi | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const one = (sel: string) => root.querySelector<HTMLElement>(sel)!;
    const all = (sel: string) =>
      Array.from(root.querySelectorAll<SVGElement>(sel));
    const page = (sel: string) => document.querySelector<HTMLElement>(sel);
    const pageAll = (sel: string) =>
      Array.from(document.querySelectorAll<HTMLElement>(sel));

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const splash = one('[data-sc="splash"]');
    const photo = one('[data-sc="photo"]');
    const rings = one('[data-sc="rings"]');
    const scene = one('[data-sc="scene"]');
    const ctrls = one('[data-sc="ctrls"]');
    const by = page('[data-intro="by"]');
    const byText = page('[data-intro="by-text"]');

    let isPaused = false;
    let sceneOn = false;
    let sAnims: Animation[] = [];
    let sTimer: ReturnType<typeof setTimeout> | undefined;
    let iAnims: Animation[] = [];
    let iTimers: ReturnType<typeof setTimeout>[] = [];

    const splashSeen = () => {
      try {
        return sessionStorage.getItem(SPLASH_KEY) === "1";
      } catch {
        return false; // сховище може бути заблоковане
      }
    };
    const markSplashSeen = () => {
      try {
        sessionStorage.setItem(SPLASH_KEY, "1");
      } catch {
        /* ignore */
      }
    };

    /* ---------- сцена: бренд → сайт → довіра ---------- */
    const S = (el: Element, kf: Keyframe[], o: KeyframeAnimationOptions) => {
      const a = el.animate(kf, { fill: "both", easing: EASE, ...o });
      sAnims.push(a);
      return a;
    };
    const stopScene = () => {
      sAnims.forEach((a) => a.cancel());
      sAnims = [];
      clearTimeout(sTimer);
    };
    const popIn = (el: Element, delay: number, dur = 450) =>
      S(
        el,
        [
          { opacity: 0, transform: "scale(.5)" },
          { opacity: 1, transform: "none" },
        ],
        {
          duration: dur,
          delay,
          easing: SPRING,
        },
      );

    const playScene = () => {
      stopScene();
      if (isPaused || !sceneOn) return;
      const q = (sel: string) => root.querySelector(sel)!;
      S(
        q("#sc-stage"),
        [{ opacity: 1 }, { opacity: 1, offset: 0.94 }, { opacity: 0 }],
        { duration: SCENE_LOOP_MS, easing: "linear" },
      );
      S(
        q("#sc-win"),
        [
          { opacity: 0, transform: "translateY(14px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 600 },
      );
      S(
        q("#sc-guides"),
        [
          { opacity: 0 },
          { opacity: 1, offset: 0.15 },
          { opacity: 1, offset: 0.8 },
          { opacity: 0 },
        ],
        { duration: 2300, delay: 300, easing: "linear" },
      );
      S(
        q("#sc-pencil"),
        [
          { opacity: 0, transform: "translate(190px,330px) rotate(-35deg)" },
          {
            opacity: 1,
            transform: "translate(206px,318px) rotate(-35deg)",
            offset: 0.1,
          },
          {
            opacity: 1,
            transform: "translate(398px,306px) rotate(-35deg)",
            offset: 0.9,
          },
          { opacity: 0, transform: "translate(414px,300px) rotate(-35deg)" },
        ],
        { duration: 1700, delay: 500, easing: "linear" },
      );
      S(
        q("#sc-wm"),
        [
          { strokeDashoffset: 600, fillOpacity: 0, strokeOpacity: 1 },
          { strokeDashoffset: 0, fillOpacity: 0, strokeOpacity: 1 },
        ],
        { duration: 1500, delay: 600, easing: "ease-in-out" },
      );
      S(
        q("#sc-wm"),
        [
          { strokeDashoffset: 0, fillOpacity: 0, strokeOpacity: 1 },
          { strokeDashoffset: 0, fillOpacity: 1, strokeOpacity: 0 },
        ],
        { duration: 600, delay: 2200 },
      );
      S(
        q("#sc-arc-a"),
        [
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDasharray: 1, strokeDashoffset: 0 },
        ],
        { duration: 550, delay: 2600 },
      );
      S(
        q("#sc-arc-b"),
        [
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDasharray: 1, strokeDashoffset: 0 },
        ],
        { duration: 550, delay: 2850 },
      );
      S(
        q("#sc-sw"),
        [{ opacity: 1 }, { opacity: 1, offset: 0.75 }, { opacity: 0 }],
        { duration: 1700, delay: 3100, easing: "linear" },
      );
      all("#sc-sw circle").forEach((c, i) => popIn(c, 3200 + i * 130, 420));
      S(
        q("#sc-logo"),
        [
          { transform: "translate(300px,292px) scale(1)" },
          { transform: "translate(88px,138px) scale(.46)" },
        ],
        { duration: 1000, delay: 4700, easing: "cubic-bezier(.6,0,.2,1)" },
      );
      all("[data-nav]").forEach((n, i) => popIn(n, 5400 + i * 90, 380));
      S(
        q("#sc-hero-bg"),
        [
          { opacity: 0, transform: "scaleY(.3)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 600, delay: 5300 },
      );
      S(q("#sc-scenery"), [{ opacity: 0 }, { opacity: 1 }], {
        duration: 600,
        delay: 5600,
        easing: "linear",
      });
      S(
        q("#sc-house"),
        [{ transform: "translateY(26px)" }, { transform: "none" }],
        { duration: 700, delay: 5700 },
      );
      popIn(q("#sc-tree"), 6100, 500);
      all("[data-hl]").forEach((h, i) => {
        const o = h.getAttribute("opacity") || "1";
        S(
          h,
          [
            { opacity: 0, transform: "translateX(-22px)" },
            { opacity: Number(o), transform: "none" },
          ],
          { duration: 500, delay: 5700 + i * 130 },
        );
      });
      popIn(q("#sc-hero-btn"), 6200, 450);
      all("[data-card]").forEach((c, i) => popIn(c, 6400 + i * 180, 480));
      S(
        q("#sc-shield-body"),
        [
          { opacity: 0, transform: "scale(.2)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 700, delay: 7400, easing: SPRING },
      );
      S(
        q("#sc-rays"),
        [
          { opacity: 0, transform: "scale(.6)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 500, delay: 7800, easing: SPRING },
      );
      sTimer = setTimeout(playScene, SCENE_LOOP_MS + 400);
    };

    /* ---------- інтро: заставка → хіро → портрет відкочується, сцена з'являється ---------- */
    const I = (el: Element, kf: Keyframe[], o: KeyframeAnimationOptions) => {
      const a = el.animate(kf, { fill: "both", easing: EASE, ...o });
      iAnims.push(a);
      return a;
    };
    const later = (fn: () => void, ms: number) => {
      iTimers.push(setTimeout(fn, ms));
    };
    const resetAll = () => {
      iAnims.forEach((a) => a.cancel());
      iAnims = [];
      iTimers.forEach(clearTimeout);
      iTimers = [];
      stopScene();
      sceneOn = false;
    };
    const finalState = () => {
      splash.hidden = true;
      photo.style.visibility = "hidden";
      rings.style.visibility = "hidden";
      if (by) by.style.opacity = "1";
      scene.style.opacity = "1";
    };

    /* Портрет і кільце відкочуються вправо й гаснуть, сцена з'являється на тому ж місці,
       а підпис в шапці виїжджає з-під лого (лого має фон і лежить зверху). */
    const toScene = () => {
      I(
        rings,
        [
          { opacity: 1, transform: "none" },
          { opacity: 0, transform: "translateX(60px) scale(.96)" },
        ],
        { duration: 900, easing: SOFT },
      );
      I(
        photo,
        [
          { opacity: 1, transform: "none" },
          {
            opacity: 0,
            transform: "translateX(90px) rotate(28deg) scale(.96)",
          },
        ],
        { duration: 900, easing: SOFT },
      ).onfinish = () => {
        photo.style.visibility = "hidden";
        rings.style.visibility = "hidden";
      };
      sceneOn = true;
      playScene();
      I(
        scene,
        [
          { opacity: 0, transform: "scale(.97)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 1000, delay: 200, easing: SOFT },
      );
      if (by)
        I(
          by,
          [
            { opacity: 0, transform: "translateX(-64px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 900, delay: 150 },
        );
      if (byText)
        I(byText, [{ opacity: 0 }, { opacity: 1 }], {
          duration: 600,
          delay: 400,
          easing: "ease-out",
        });
    };

    const playSplash = () => {
      const mark = one('[data-sc="sp-mark"]');
      const spPhoto = one('[data-sc="sp-photo"]');
      document.documentElement.classList.remove("no-splash");
      splash.hidden = false;
      one('[data-sc="sp-in"]').style.opacity = "1";
      I(
        mark,
        [
          { opacity: 0, transform: "scale(.4)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 240 * K, easing: SPRING },
      );
      Array.from(root.querySelectorAll('[data-sc="ch"]')).forEach((c, i) =>
        I(c, [{ transform: "translateY(110%)" }, { transform: "none" }], {
          duration: 220 * K,
          delay: (110 + i * 11) * K,
        }),
      );
      I(
        mark,
        [{ transform: "translateX(0)" }, { transform: "translateX(-82px)" }],
        {
          duration: 260 * K,
          delay: 300 * K,
          easing: "cubic-bezier(.65,0,.25,1)",
        },
      );
      I(
        spPhoto,
        [
          { opacity: 0, transform: "translateX(0) scale(.7)" },
          { opacity: 1, transform: "translateX(82px) scale(1)" },
        ],
        {
          duration: 260 * K,
          delay: 300 * K,
          easing: "cubic-bezier(.65,0,.25,1)",
        },
      );
      I(
        one('[data-sc="sp-by"]'),
        [
          { opacity: 0, transform: "translateY(8px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 200 * K, delay: 380 * K },
      );
      I(splash, [{ transform: "none" }, { transform: "translateY(-100%)" }], {
        duration: 300 * K,
        delay: 600 * K,
        easing: "cubic-bezier(.7,0,.2,1)",
      }).onfinish = () => {
        splash.hidden = true;
      };
      /* Дрібні тексти з'являються, коли заставка піднімається; h1 і портрет не гаснуть (це LCP). */
      pageAll('[data-intro="reveal"]').forEach((e, i) =>
        I(
          e,
          [
            { opacity: 0, transform: "translateY(18px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 450, delay: SPLASH_MS - 300 * K + i * 70 },
        ),
      );
      /* Позначаємо «побачено» лише в кінці: у dev React запускає ефект двічі, і ранній запис вимкнув би заставку в другому запуску. */
      later(markSplashSeen, SPLASH_MS);
    };

    const intro = () => {
      resetAll();
      if (mq.matches) {
        finalState();
        ctrls.hidden = true;
        return;
      }
      ctrls.hidden = false;
      const withSplash = !splashSeen();
      const t0 = withSplash ? SPLASH_MS : 0;
      photo.style.visibility = "visible";
      rings.style.visibility = "visible";
      if (by) by.style.opacity = "0";
      scene.style.opacity = "0";
      if (withSplash) playSplash();
      else splash.hidden = true;
      later(toScene, t0 + TO_SCENE_AFTER);
    };

    apiRef.current = {
      setPaused: (next) => {
        isPaused = next;
        if (next) stopScene();
        else if (sceneOn) playScene();
      },
    };

    intro();
    return () => {
      resetAll();
      apiRef.current = null;
    };
  }, []);

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-2xl">
      {/* ---------- Заставка ---------- */}
      <div
        data-sc="splash"
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 grid place-items-center bg-canvas px-4 motion-reduce:hidden"
      >
        <div
          data-sc="sp-in"
          className="flex flex-col items-center gap-6 opacity-0"
        >
          <div className="relative h-32 w-full max-w-xs">
            <div
              data-sc="sp-mark"
              className="absolute top-0 left-1/2 -ml-16 grid size-32 place-items-center"
            >
              <div className="scale-400">
                <Logo variant="mark" label="Logo" />
              </div>
            </div>
            <Image
              data-sc="sp-photo"
              src={portrait}
              alt=""
              sizes="8rem"
              className="absolute top-0 left-1/2 -ml-16 aspect-portrait size-32 rounded-control border-2 border-accent object-cover"
            />
          </div>
          <div className="flex overflow-hidden pb-1 text-heading font-sans sm:text-display">
            {WORD.map(([text, color]) =>
              text.split("").map((ch, i) => (
                <span
                  key={`${text}${i}`}
                  data-sc="ch"
                  className={`inline-block ${color}`}
                >
                  {ch}
                </span>
              )),
            )}
          </div>
          <p data-sc="sp-by" className="text-body text-text-muted">
            by{" "}
            <span className="text-body-strong text-text">Serhii Orlenko</span>
          </p>
        </div>
      </div>

      {/* Кільце, портрет і сцена лежать в одному блоці: портрет центруємо по ньому, а не по кнопках нижче. */}
      <div className="relative">
        {/* ---------- Портрет з кільцем (відкочується) ---------- */}
        <div
          data-sc="rings"
          className="absolute inset-0 z-10 m-auto aspect-portrait w-3/4 rounded-control border-2 border-accent bg-surface"
        />
        <Image
          data-sc="photo"
          src={portrait}
          alt="Portret Serhii Orlenko"
          preload
          sizes="(min-width: 64rem) 28rem, 70vw"
          className="absolute inset-0 z-20 m-auto aspect-portrait w-2/3 rounded-control object-cover"
        />

        {/* ---------- Сцена ---------- */}
        <div data-sc="scene" className="opacity-0">
          <svg
            id="sc-stage"
            viewBox="0 0 600 520"
            role="img"
            aria-label="Ilustracja: puste okno przeglądarki, w którym powstaje logo MARKA, potem gotowa strona i tarcza z kłódką jako znak zaufania."
            className="block h-auto w-full overflow-visible"
          >
            <defs>
              <clipPath id="sc-winclip">
                <rect x="20" y="70" width="560" height="420" rx="20" />
              </clipPath>
              <clipPath id="sc-heroclip">
                <rect x="36" y="170" width="528" height="190" rx="14" />
              </clipPath>
            </defs>
            <ellipse
              cx="300"
              cy="290"
              rx="290"
              ry="238"
              className="fill-surface"
            />
            <ellipse
              cx="300"
              cy="290"
              rx="312"
              ry="258"
              fill="none"
              strokeWidth="2"
              className="stroke-accent"
            />

            <g id="sc-win" className="drop-shadow-xl drop-shadow-scene-ink/35">
              <rect
                x="20"
                y="70"
                width="560"
                height="420"
                rx="20"
                className="fill-scene-paper"
              />
              <g clipPath="url(#sc-winclip)">
                <rect
                  x="20"
                  y="70"
                  width="560"
                  height="44"
                  className="fill-scene-sky"
                />
                <rect
                  x="20"
                  y="112"
                  width="560"
                  height="2"
                  className="fill-scene-line"
                />
                <circle cx="42" cy="92" r="5" className="fill-scene-accent" />
                <circle cx="62" cy="92" r="5" className="fill-scene-line" />
                <circle cx="82" cy="92" r="5" className="fill-scene-line" />
                <rect
                  x="120"
                  y="80"
                  width="300"
                  height="24"
                  rx="12"
                  strokeWidth="1.5"
                  className="fill-scene-paper stroke-scene-line"
                />
                <g>
                  <rect
                    data-nav
                    style={pop}
                    x="376"
                    y="131"
                    width="26"
                    height="7"
                    rx="3.5"
                    className="fill-scene-line"
                  />
                  <rect
                    data-nav
                    style={pop}
                    x="412"
                    y="131"
                    width="26"
                    height="7"
                    rx="3.5"
                    className="fill-scene-line"
                  />
                  <rect
                    data-nav
                    style={pop}
                    x="448"
                    y="131"
                    width="26"
                    height="7"
                    rx="3.5"
                    className="fill-scene-line"
                  />
                  <rect
                    data-nav
                    style={pop}
                    x="486"
                    y="124"
                    width="78"
                    height="22"
                    rx="11"
                    className="fill-scene-accent"
                  />
                  <rect
                    data-nav
                    style={pop}
                    x="510"
                    y="133"
                    width="30"
                    height="4"
                    rx="2"
                    className="fill-scene-paper"
                  />
                </g>
                <rect
                  id="sc-hero-bg"
                  style={top}
                  x="36"
                  y="170"
                  width="528"
                  height="190"
                  rx="14"
                  className="fill-scene-accent"
                />
                <g id="sc-scenery" clipPath="url(#sc-heroclip)">
                  <circle
                    cx="470"
                    cy="200"
                    r="78"
                    opacity=".55"
                    className="fill-scene-accent-soft"
                  />
                  <path
                    d="M36 340 Q180 300 330 336 T564 328 V360 H36 Z"
                    className="fill-scene-hill"
                  />
                  <g id="sc-house">
                    <rect
                      x="404"
                      y="270"
                      width="100"
                      height="82"
                      className="fill-scene-paper"
                    />
                    <rect
                      x="396"
                      y="256"
                      width="116"
                      height="16"
                      rx="4"
                      className="fill-scene-ink"
                    />
                    <rect
                      x="414"
                      y="288"
                      width="22"
                      height="22"
                      rx="3"
                      strokeWidth="2"
                      className="fill-scene-sky stroke-scene-ink"
                    />
                    <rect
                      x="472"
                      y="288"
                      width="22"
                      height="22"
                      rx="3"
                      strokeWidth="2"
                      className="fill-scene-sky stroke-scene-ink"
                    />
                    <rect
                      x="445"
                      y="312"
                      width="22"
                      height="40"
                      rx="3"
                      strokeWidth="2"
                      className="fill-scene-warm stroke-scene-ink"
                    />
                  </g>
                  <g id="sc-tree" style={pop}>
                    <rect
                      x="530"
                      y="318"
                      width="6"
                      height="34"
                      className="fill-scene-ink"
                    />
                    <circle
                      cx="533"
                      cy="304"
                      r="22"
                      className="fill-scene-green"
                    />
                  </g>
                </g>
                <g>
                  <rect
                    data-hl
                    x="60"
                    y="204"
                    width="230"
                    height="16"
                    rx="8"
                    className="fill-scene-paper"
                  />
                  <rect
                    data-hl
                    x="60"
                    y="232"
                    width="170"
                    height="10"
                    rx="5"
                    opacity=".75"
                    className="fill-scene-paper"
                  />
                  <rect
                    data-hl
                    x="60"
                    y="250"
                    width="130"
                    height="10"
                    rx="5"
                    opacity=".75"
                    className="fill-scene-paper"
                  />
                  <rect
                    id="sc-hero-btn"
                    style={pop}
                    x="60"
                    y="282"
                    width="120"
                    height="34"
                    rx="17"
                    className="fill-scene-warm"
                  />
                </g>
                <g>
                  <g data-card style={pop}>
                    <rect
                      x="36"
                      y="378"
                      width="164"
                      height="96"
                      rx="12"
                      className="fill-scene-sky"
                    />
                    <polygon
                      transform="translate(118 412)"
                      points="0,-17 4.1,-5.7 16.2,-5.25 6.66,2.16 10,13.75 0,7 -10,13.75 -6.66,2.16 -16.2,-5.25 -4.1,-5.7"
                      className="fill-scene-warm"
                    />
                    <rect
                      x="73"
                      y="440"
                      width="90"
                      height="8"
                      rx="4"
                      className="fill-scene-line"
                    />
                    <rect
                      x="88"
                      y="454"
                      width="60"
                      height="8"
                      rx="4"
                      className="fill-scene-line"
                    />
                  </g>
                  <g data-card style={pop}>
                    <rect
                      x="218"
                      y="378"
                      width="164"
                      height="96"
                      rx="12"
                      className="fill-scene-sky"
                    />
                    <g transform="translate(300 412)">
                      <circle
                        cx="8"
                        cy="-7"
                        r="5"
                        className="fill-scene-accent-soft"
                      />
                      <path
                        d="M2 14q0-9 8-9t8 9z"
                        className="fill-scene-accent-soft"
                      />
                      <circle
                        cx="-7"
                        cy="-8"
                        r="6"
                        className="fill-scene-accent"
                      />
                      <path
                        d="M-18 14q0-12 11-12t11 12z"
                        className="fill-scene-accent"
                      />
                    </g>
                    <rect
                      x="255"
                      y="440"
                      width="90"
                      height="8"
                      rx="4"
                      className="fill-scene-line"
                    />
                    <rect
                      x="270"
                      y="454"
                      width="60"
                      height="8"
                      rx="4"
                      className="fill-scene-line"
                    />
                  </g>
                  <g data-card style={pop}>
                    <rect
                      x="400"
                      y="378"
                      width="164"
                      height="96"
                      rx="12"
                      className="fill-scene-sky"
                    />
                    <g transform="translate(482 412)">
                      <circle r="16" className="fill-scene-accent" />
                      <path
                        d="M-7 0L-2 6L8-6"
                        fill="none"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="stroke-scene-paper"
                      />
                    </g>
                    <rect
                      x="437"
                      y="440"
                      width="90"
                      height="8"
                      rx="4"
                      className="fill-scene-line"
                    />
                    <rect
                      x="452"
                      y="454"
                      width="60"
                      height="8"
                      rx="4"
                      className="fill-scene-line"
                    />
                  </g>
                </g>
                <g
                  id="sc-guides"
                  opacity="0"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  transform="translate(300 292)"
                  className="text-scene-muted"
                >
                  <line x1="-120" y1="-23" x2="120" y2="-23" />
                  <line x1="-120" y1="22" x2="120" y2="22" />
                  <line x1="-100" y1="-40" x2="-100" y2="40" />
                  <line x1="100" y1="-40" x2="100" y2="40" />
                </g>
                <g id="sc-sw" opacity="0">
                  <circle
                    style={pop}
                    cx="262"
                    cy="410"
                    r="13"
                    className="fill-scene-accent"
                  />
                  <circle
                    style={pop}
                    cx="300"
                    cy="410"
                    r="13"
                    className="fill-scene-warm"
                  />
                  <circle
                    style={pop}
                    cx="338"
                    cy="410"
                    r="13"
                    className="fill-scene-accent-soft"
                  />
                </g>
                <g
                  id="sc-logo"
                  style={{
                    ...fromOrigin,
                    transform: "translate(88px, 138px) scale(.46)",
                  }}
                >
                  <path
                    id="sc-arc-a"
                    pathLength="1"
                    d="M-72 -18Q0 -64 72 -18"
                    fill="none"
                    strokeWidth="9"
                    strokeLinecap="round"
                    className="stroke-scene-warm"
                  />
                  <path
                    id="sc-arc-b"
                    pathLength="1"
                    d="M-72 36Q0 80 72 36"
                    fill="none"
                    strokeWidth="9"
                    strokeLinecap="round"
                    className="stroke-scene-accent"
                  />
                  <text
                    id="sc-wm"
                    x="0"
                    y="22"
                    textAnchor="middle"
                    fontSize="64"
                    fontWeight="700"
                    letterSpacing="-1"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                    strokeDasharray="600"
                    strokeOpacity="0"
                    fillOpacity="1"
                    className="fill-scene-ink stroke-scene-muted font-sans"
                  >
                    MARKA
                  </text>
                </g>
                <g id="sc-pencil" opacity="0" style={fromOrigin}>
                  <rect
                    x="0"
                    y="-5"
                    width="46"
                    height="10"
                    strokeWidth="2"
                    className="fill-scene-warm stroke-scene-ink"
                  />
                  <polygon
                    points="0,-5 -13,0 0,5"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    className="fill-scene-sky stroke-scene-ink"
                  />
                  <rect
                    x="46"
                    y="-5"
                    width="8"
                    height="10"
                    rx="2"
                    strokeWidth="2"
                    className="fill-scene-accent-soft stroke-scene-ink"
                  />
                </g>
              </g>
              <rect
                x="20"
                y="70"
                width="560"
                height="420"
                rx="20"
                fill="none"
                strokeWidth="2.5"
                className="stroke-scene-ink"
              />
            </g>

            <g style={{ ...fromOrigin, transform: "translate(546px, 72px)" }}>
              <g
                id="sc-rays"
                style={pop}
                strokeWidth="5"
                strokeLinecap="round"
                className="stroke-scene-warm"
              >
                <line x1="-52" y1="-14" x2="-72" y2="-20" />
                <line x1="-44" y1="-40" x2="-60" y2="-54" />
                <line x1="-22" y1="-56" x2="-26" y2="-76" />
              </g>
              <g id="sc-shield-body" style={pop}>
                <path
                  d="M0-46L38-32V4C38 28 20 40 0 50C-20 40-38 28-38 4V-32Z"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  className="fill-scene-green stroke-scene-ink"
                />
                <rect
                  x="-13"
                  y="-4"
                  width="26"
                  height="22"
                  rx="4"
                  className="fill-scene-paper"
                />
                <path
                  d="M-8-4V-12a8 8 0 0 1 16 0V-4"
                  fill="none"
                  strokeWidth="5"
                  strokeLinecap="round"
                  className="stroke-scene-paper"
                />
                <circle cx="0" cy="6" r="3" className="fill-scene-green" />
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* ---------- Керування анімацією ---------- */}
      <div data-sc="ctrls" className="mt-4 flex">
        <IconButton
          label={paused ? "Wznów animację" : "Zatrzymaj animację"}
          onClick={() => {
            const next = !paused;
            setPaused(next);
            apiRef.current?.setPaused(next);
          }}
        >
          {paused ? <PlayIcon /> : <PauseIcon />}
        </IconButton>
      </div>
    </div>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current">
      <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
