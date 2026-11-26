"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export interface TestimonialCardProps {
  /** Текст відгуку. Лапки компонент додає сам. */
  quote: string;
  /** Ім'я автора відгуку: ім'я та перша літера прізвища, як на Upwork («Randy G.»). */
  name: string;
  /** Хто цей клієнт: компанія, галузь, країна («Szkoła sztuk walki, USA»). */
  role: string;
  /** Оцінка від 1 до 5. Показується зірками, скрінрідер читає «Ocena: 5 z 5». */
  rating?: number;
  /**
   * Відгук перекладено з іншої мови. Під текстом з'являється позначка `(tłumaczenie)`:
   * за правилами сайту переклад завжди позначаємо.
   */
  translated?: boolean;
  /**
   * Оригінал відгуку дослівно (зазвичай англійською). Якщо є, під текстом з'являється кнопка
   * «Pokaż oryginał», що розгортає оригінал просто на картці: перевірити можна без реєстрації.
   */
  original?: string;
  /** Мова оригіналу (атрибут `lang`, щоб скрінрідер читав правильно). */
  originalLang?: string;
  /** Адреса живого сайту клієнта. Посилання відкривається в новій вкладці. */
  siteHref?: string;
  /** Текст посилання на сайт клієнта. */
  siteLabel?: string;
  /**
   * Адреса оригіналу відгуку (профіль на Upwork тощо). Відкривається в новій вкладці.
   * Без адреси посилання під відгуком немає.
   */
  sourceHref?: string;
  /** Текст посилання на оригінал. */
  sourceLabel?: string;
  /**
   * Вимкнене посилання на оригінал (наприклад, профіль тимчасово прихований).
   * Робиться через `aria-disabled`, без адреси: посилання лишається у фокусі, але нікуди не веде.
   */
  sourceDisabled?: boolean;
  /** Пояснення, чому посилання вимкнене. Показується під ним і читається через `aria-describedby`. */
  sourceDisabledReason?: string;
  /**
   * Затримка появи картки в мілісекундах. Кілька карток в ряд з'являються по черзі:
   * передай 0, 120, 240…
   */
  revealDelay?: number;
  /** Клас для зовнішнього елемента (висота в сітці тощо). */
  className?: string;
}

const EASE = "cubic-bezier(.22,.8,.3,1)";
const SPRING = "cubic-bezier(.34,1.56,.64,1)";

const linkBase =
  "inline-flex items-center gap-2 self-start rounded-control text-caption-strong " +
  "outline-accent focus-visible:outline-2 focus-visible:outline-offset-3 " +
  "transition-colors duration-150 ease-out motion-reduce:transition-none";

/* Активне посилання чи кнопка: іменована група, щоб лінія й значок реагували на hover і фокус. */
const linkActive = `${linkBase} group/link cursor-pointer text-accent`;

/* Значок усередині активного посилання: плавно зсувається на hover і у фокусі (лише без «зменшити рух»). */
const iconMotion = "transition-transform duration-150 ease-out motion-reduce:transition-none";

/**
 * Текст посилання з лінією під ним. На hover і у фокусі лінія малюється зліва направо,
 * а коли курсор іде, стягується справа наліво: так само, як підкреслення шапки
 * при відкритті й закритті мобільного меню (Navigation).
 */
function DrawnLabel({ children }: { children: ReactNode }) {
  return (
    <span className="relative">
      {children}
      <span
        aria-hidden="true"
        className={
          "absolute inset-x-0 top-full h-px origin-left scale-x-0 bg-current " +
          "transition-transform duration-300 ease-in-out motion-reduce:transition-none " +
          "group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100"
        }
      />
    </span>
  );
}

/**
 * Картка відгуку клієнта: оцінка зірками, текст, кнопка з оригіналом, автор і посилання
 * на сайт клієнта та на оригінал. Сама картка не інтерактивна, натискаються лише кнопка й посилання.
 *
 * Поява: коли картка доїжджає до екрана, вона піднімається й проявляється, а зірки
 * вискакують по одній. З увімкненим «зменшити рух» і без JS картка просто стоїть на місці.
 */
export function TestimonialCard({
  quote,
  name,
  role,
  rating = 5,
  translated = false,
  original,
  originalLang = "en",
  siteHref,
  siteLabel = "Zobacz stronę klienta",
  sourceHref,
  sourceLabel = "Opinia na Upwork",
  sourceDisabled = false,
  sourceDisabledReason,
  revealDelay = 0,
  className,
}: TestimonialCardProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reasonId = useId();
  const originalId = useId();
  const [showOriginal, setShowOriginal] = useState(false);
  const stars = Math.max(0, Math.min(5, Math.round(rating)));
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    // Картка вже на екрані при завантаженні: не ховаємо її, щоб текст не блимав.
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;

    const starEls = Array.from(el.querySelectorAll<SVGElement>("[data-star]"));
    // Ховаємо лише тоді, коли JS точно програє анімацію: без JS картка видима одразу.
    el.style.opacity = "0";

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        el.style.opacity = "";
        el.animate(
          [
            { opacity: 0, transform: "translateY(24px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 600, delay: revealDelay, easing: EASE, fill: "backwards" },
        );
        starEls.forEach((star, i) =>
          star.animate(
            [
              { opacity: 0, transform: "scale(0)" },
              { opacity: 1, transform: "scale(1)" },
            ],
            {
              duration: 400,
              delay: revealDelay + 300 + i * 70,
              easing: SPRING,
              fill: "backwards",
            },
          ),
        );
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.style.opacity = "";
    };
  }, [revealDelay]);

  const showReason = sourceDisabled && Boolean(sourceDisabledReason);

  // moves: у активному посиланні стрілка «тягне» в нову вкладку, зсуваючись угору й управо.
  const arrow = (moves: boolean) => (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={[
        "size-4 fill-current",
        moves
          ? `${iconMotion} motion-safe:group-hover/link:translate-x-0.5 motion-safe:group-hover/link:-translate-y-0.5 ` +
            "motion-safe:group-focus-visible/link:translate-x-0.5 motion-safe:group-focus-visible/link:-translate-y-0.5"
          : "",
      ].join(" ")}
    >
      <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42L17.59 5H14V3ZM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    </svg>
  );

  return (
    <figure
      ref={rootRef}
      className={[
        "flex flex-col gap-6 rounded-card border border-line bg-surface p-6 font-sans md:p-8",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div role="img" aria-label={`Ocena: ${stars} z 5`} className="flex gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            data-star
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`size-5 ${i < stars ? "fill-accent" : "fill-line"}`}
          >
            <path d="M12 2.5l2.94 6.08 6.56.9-4.78 4.63 1.17 6.64L12 17.6l-5.89 3.15 1.17-6.64L2.5 9.48l6.56-.9L12 2.5Z" />
          </svg>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <blockquote className="flex flex-col gap-2">
          <p className="text-body text-text">„{quote}”</p>
          {translated && (
            <p className="text-caption text-text-muted">(tłumaczenie)</p>
          )}
        </blockquote>

        {original && (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              aria-expanded={showOriginal}
              aria-controls={originalId}
              onClick={() => setShowOriginal((v) => !v)}
              className={linkActive}
            >
              <DrawnLabel>{showOriginal ? "Ukryj oryginał" : "Pokaż oryginał"}</DrawnLabel>
              {/* Шеврон на hover зсувається туди, куди піде текст: униз — розгорнути, угору — згорнути. */}
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={[
                  "size-4 fill-current",
                  iconMotion,
                  showOriginal
                    ? "rotate-180 motion-safe:group-hover/link:-translate-y-0.5 motion-safe:group-focus-visible/link:-translate-y-0.5"
                    : "motion-safe:group-hover/link:translate-y-0.5 motion-safe:group-focus-visible/link:translate-y-0.5",
                ].join(" ")}
              >
                <path d="M12 15.5 5.5 9l1.41-1.41L12 12.67l5.09-5.08L18.5 9 12 15.5Z" />
              </svg>
            </button>
            <blockquote
              id={originalId}
              lang={originalLang}
              hidden={!showOriginal}
              className="border-l-2 border-line pl-4 text-caption text-text-muted"
            >
              “{original}”
            </blockquote>
          </div>
        )}
      </div>

      <figcaption className="flex items-center gap-4 border-t border-line pt-6">
        <span
          aria-hidden="true"
          className="flex aspect-portrait size-12 shrink-0 items-center justify-center rounded-control bg-accent text-body-strong text-canvas"
        >
          {initials}
        </span>
        <span className="flex flex-col">
          <span className="text-body-strong text-text">{name}</span>
          <span className="text-caption text-text-muted">{role}</span>
        </span>
      </figcaption>

      {(siteHref || sourceHref || sourceDisabled) && (
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {siteHref && (
            <a
              href={siteHref}
              target="_blank"
              rel="noopener noreferrer"
              className={linkActive}
            >
              <DrawnLabel>{siteLabel}</DrawnLabel>
              <span className="sr-only">(otwiera się w nowej karcie)</span>
              {arrow(true)}
            </a>
          )}
          {sourceDisabled ? (
            <span className="flex flex-col gap-2">
              <span
                role="link"
                tabIndex={0}
                aria-disabled="true"
                aria-describedby={showReason ? reasonId : undefined}
                className={`${linkBase} cursor-not-allowed text-text-muted`}
              >
                {sourceLabel}
                {arrow(false)}
              </span>
              {showReason && (
                <span id={reasonId} className="text-caption text-text-muted">
                  {sourceDisabledReason}
                </span>
              )}
            </span>
          ) : (
            sourceHref && (
              <a
                href={sourceHref}
                target="_blank"
                rel="noopener noreferrer"
                className={linkActive}
              >
                <DrawnLabel>{sourceLabel}</DrawnLabel>
                <span className="sr-only">(otwiera się w nowej karcie)</span>
                {arrow(true)}
              </a>
            )
          )}
        </div>
      )}
    </figure>
  );
}
