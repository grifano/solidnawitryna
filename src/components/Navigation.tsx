"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Button } from "./Button";

export interface NavigationItem {
  /** Текст пункту меню. */
  label: string;
  /** Адреса, куди веде пункт. */
  href: string;
}

export interface NavigationProps {
  /** Пункти меню в порядку показу. */
  items: NavigationItem[];
  /**
   * Адреса активного пункту (поточна сторінка). Пункт з такою `href` отримує
   * вигляд активного й `aria-current="page"`. Порожнє значення: активного пункту немає.
   * На сайті передай `usePathname()`.
   */
  activeHref?: string;
  /** Назва навігації для скрінрідера (атрибут `aria-label`). */
  label?: string;
  /** Текст кнопки, яка відкриває меню на вузькому екрані. */
  menuLabel?: string;
  /** Текст тієї самої кнопки, коли меню відкрите на весь екран (закриває його). */
  closeLabel?: string;
  /** Клас для зовнішнього `nav` (положення в шапці тощо). */
  className?: string;
}

const itemBase =
  "block rounded-control border-2 px-4 py-3 text-heading font-sans sm:py-2 sm:text-body-strong " +
  "outline-accent focus-visible:outline-2 focus-visible:outline-offset-3 " +
  "transition duration-150 ease-out motion-reduce:transition-none " +
  "hover:bg-surface hover:text-text";

const itemDefault = "border-transparent text-text-muted";
const itemActive = "border-accent text-text";

/*
 * Один список для обох екранів. На широкому це звичайний ряд. На вузькому (max-sm)
 * відкрите меню займає весь екран (fixed inset-0) на фоні canvas, а шапка (лого й кнопка)
 * лишається над ним: сторінка має дати їй z-index вище за контент, див. page.tsx.
 * Зверху лишаємо місце під шапку.
 */
const listBase =
  "flex gap-2 " +
  "max-sm:fixed max-sm:inset-0 max-sm:flex-col max-sm:overflow-y-auto " +
  "max-sm:bg-canvas max-sm:px-4 max-sm:pt-24 max-sm:pb-8";

/*
 * Таймлайн анімації меню той самий, що в заставки першого екрана (HeroStage):
 * панель опускається/піднімається за 600 мс з кривою заставки, а пункти виринають
 * (прозорість і зсув 18 px) за 450 мс із кроком 70 мс.
 */
const LIFT = "cubic-bezier(.7,0,.2,1)";
const EASE = "cubic-bezier(.22,.8,.3,1)";
const PANEL_MS = 600;
const ITEM_MS = 450;
const ITEM_STEP_MS = 70;
const ITEMS_DELAY_MS = 300;

const isNarrow = () => window.matchMedia("(width < 40rem)").matches;
const isReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function play(
  store: RefObject<Animation[]>,
  el: Element,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
) {
  const animation = el.animate(keyframes, options);
  store.current.push(animation);
  return animation;
}

function cancelAll(store: RefObject<Animation[]>) {
  store.current.forEach((animation) => animation.cancel());
  store.current = [];
}

/**
 * Навігація сайту: пункти меню. На вузькому екрані згортається в кнопку
 * «Menu», відкрите меню опускається на весь екран і закривається клавішею Escape.
 */
export function Navigation({
  items,
  activeHref,
  label = "Menu główne",
  menuLabel = "Menu",
  closeLabel = "Zamknij",
  className,
}: NavigationProps) {
  const [open, setOpen] = useState(false);
  // Список видно на вузькому екрані, поки меню відкрите або триває анімація закриття.
  const [shown, setShown] = useState(false);
  const listId = useId();
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const animations = useRef<Animation[]>([]);

  const close = useCallback(() => {
    setOpen(false);
    const list = listRef.current;
    if (!list || !isNarrow() || isReduced()) {
      setShown(false);
      return;
    }
    cancelAll(animations);
    list.querySelectorAll("li").forEach((item) =>
      play(animations, item, [{ opacity: 1 }, { opacity: 0 }], {
        duration: 200,
        easing: "ease-out",
        fill: "forwards",
      }),
    );
    play(
      animations,
      list,
      [{ transform: "none" }, { transform: "translateY(-100%)" }],
      { duration: PANEL_MS, delay: 100, easing: LIFT, fill: "forwards" },
    ).onfinish = () => setShown(false);
  }, []);

  function toggle() {
    if (open) {
      close();
    } else {
      setOpen(true);
      setShown(true);
    }
  }

  // Анімація відкриття. Layout-ефект, щоб перший кадр уже був із панеллю над екраном.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!open || !list || !isNarrow() || isReduced()) return;
    cancelAll(animations);
    play(
      animations,
      list,
      [{ transform: "translateY(-100%)" }, { transform: "none" }],
      { duration: PANEL_MS, easing: LIFT, fill: "backwards" },
    );
    list.querySelectorAll("li").forEach((item, index) =>
      play(
        animations,
        item,
        [
          { opacity: 0, transform: "translateY(18px)" },
          { opacity: 1, transform: "none" },
        ],
        {
          duration: ITEM_MS,
          delay: ITEMS_DELAY_MS + index * ITEM_STEP_MS,
          easing: EASE,
          fill: "backwards",
        },
      ),
    );
  }, [open]);

  // Коли список сховано, знімаємо залишки анімацій (fill: forwards після закриття).
  useEffect(() => {
    if (!shown) cancelAll(animations);
  }, [shown]);

  useEffect(() => {
    if (!open) return;

    // Меню на весь екран: сторінка під ним не прокручується. Блокуємо на <html>, а не на <body>:
    // overflow на body переходить на вікно перегляду і скасовує overflow-x-clip сторінки (її ширші за екран елементи зсунули б сторінку вбік).
    const previousOverflow = document.documentElement.style.overflow;
    if (isNarrow()) document.documentElement.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      close();
      // Фокус повертаємо на кнопку: клавіатурний користувач не губить місце.
      navRef.current?.querySelector("button")?.focus();
    }

    function handlePointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) close();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [open, close]);

  const labelStyles =
    "col-start-1 row-start-1 transition-opacity duration-150 ease-out motion-reduce:transition-none";

  return (
    <nav
      ref={navRef}
      aria-label={label}
      className={["relative flex justify-end", className]
        .filter(Boolean)
        .join(" ")}
    >
      {/*
        Кнопка лишається на місці й тієї самої ширини: обидва підписи лежать в одній клітинці,
        а ширину задає довший. Тому при відкритті нічого не зсувається.
      */}
      <Button
        variant="secondary"
        aria-expanded={open}
        aria-controls={listId}
        onClick={toggle}
        className="relative z-10 sm:hidden"
      >
        <span className="grid">
          <span
            aria-hidden={open}
            className={`${labelStyles} ${open ? "opacity-0" : "opacity-100"}`}
          >
            {menuLabel}
          </span>
          <span
            aria-hidden={!open}
            className={`${labelStyles} ${open ? "opacity-100" : "opacity-0"}`}
          >
            {closeLabel}
          </span>
        </span>
      </Button>
      <ul
        id={listId}
        ref={listRef}
        className={[listBase, shown ? "" : "max-sm:hidden"].join(" ")}
      >
        {items.map((item) => {
          const active = item.href === activeHref;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={close}
                className={[itemBase, active ? itemActive : itemDefault].join(
                  " ",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
