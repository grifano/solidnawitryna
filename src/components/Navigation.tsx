"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
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
  /** Клас для зовнішнього `nav` (положення в шапці тощо). */
  className?: string;
}

const itemBase =
  "block rounded-control border-2 px-4 py-3 text-body-strong font-sans sm:py-2 " +
  "outline-accent focus-visible:outline-2 focus-visible:outline-offset-3 " +
  "transition duration-150 ease-out motion-reduce:transition-none " +
  "hover:bg-surface hover:text-text";

const itemDefault = "border-transparent text-text-muted";
const itemActive = "border-accent text-text";

/*
 * Один список для обох екранів. На широкому це звичайний ряд. На вузькому (max-sm)
 * він лежить поверх контенту панеллю (absolute, сторінку не зсуває).
 */
const listBase =
  "flex gap-2 " +
  "max-sm:absolute max-sm:inset-x-0 max-sm:top-full max-sm:z-10 max-sm:mt-2 max-sm:flex-col " +
  "max-sm:rounded-card max-sm:border max-sm:border-line max-sm:bg-surface max-sm:p-2";

/**
 * Навігація сайту: пункти меню. На вузькому екрані згортається в кнопку
 * «Menu», відкрите меню лежить поверх контенту й закривається клавішею Escape.
 */
export function Navigation({
  items,
  activeHref,
  label = "Menu główne",
  menuLabel = "Menu",
  className,
}: NavigationProps) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      // Фокус повертаємо на кнопку: клавіатурний користувач не губить місце.
      navRef.current?.querySelector("button")?.focus();
    }

    function handlePointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <nav
      ref={navRef}
      aria-label={label}
      className={["relative flex justify-end", className].filter(Boolean).join(" ")}
    >
      <Button
        variant="secondary"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className="sm:hidden"
      >
        {menuLabel}
      </Button>
      <ul id={listId} className={[listBase, open ? "" : "max-sm:hidden"].join(" ")}>
        {items.map((item) => {
          const active = item.href === activeHref;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={[itemBase, active ? itemActive : itemDefault].join(" ")}
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
