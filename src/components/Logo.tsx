import Link from "next/link";
import { useId } from "react";

export type LogoVariant = "full" | "mark";

export interface LogoProps {
  /** Вигляд: `full` — знак і напис «solidnawitryna.pl», `mark` — лише знак. */
  variant?: LogoVariant;
  /**
   * Адреса, куди веде лого (зазвичай головна). Якщо не передати, лого не є посиланням
   * і показується як зображення з назвою.
   */
  href?: string;
  /**
   * Назва для скрінрідера. Скрінрідер читає її замість візуального напису.
   * У `full` назва має містити видимий текст «solidnawitryna.pl» дослівно (WCAG 2.5.3),
   * інакше голосове керування не знайде лого за видимим написом.
   */
  label?: string;
  /**
   * Вимкнене лого-посилання (працює лише з `href`). Робиться через `aria-disabled`, без адреси:
   * лого лишається у фокусі, але ніде не веде. Hover-ефекту немає, знак стає сірим.
   */
  disabled?: boolean;
  /**
   * Пояснення для скрінрідера, чому лого вимкнене. Зв'язується з лого через `aria-describedby`,
   * на екрані не показується. Працює лише при `disabled`.
   */
  disabledReason?: string;
  /** Клас для зовнішнього елемента (положення в шапці тощо). */
  className?: string;
  /** Клас розміру знака. За замовчуванням `size-8` (32 px); `size-full` розтягує знак на батьківський блок. */
  markClassName?: string;
}

/**
 * Знак «Rama»: вікно браузера з трьома крапками й літерою W.
 * Кольори тільки з токенів, тому знак сам перемикається між Dark і Light.
 */
function LogoMark({
  className,
  tilts,
  muted,
}: {
  className: string;
  tilts: boolean;
  muted: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={[
        className,
        "shrink-0",
        // Hover на посиланні: знак плавно припіднімається вправо й зависає на нижньому правому куті.
        tilts
          ? "origin-bottom-right transition-transform duration-150 ease-out group-hover:rotate-6 motion-reduce:transition-none"
          : "",
        muted ? "grayscale" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <rect x="4" y="4" width="112" height="112" rx="28" className="fill-text" />
      <circle cx="27" cy="22" r="4.5" className="fill-canvas" />
      <circle cx="40" cy="22" r="4.5" className="fill-canvas" />
      <circle cx="53" cy="22" r="4.5" className="fill-canvas" />
      <rect x="17" y="34" width="86" height="70" rx="13" className="fill-surface" />
      <polyline
        points="35,52 47,86 60,63 73,86 85,52"
        fill="none"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-accent"
      />
    </svg>
  );
}

const base = "inline-flex items-center gap-3 font-sans text-lead-strong text-text";

const linkStyles =
  "group outline-accent focus-visible:outline-2 focus-visible:outline-offset-3";

/**
 * Лого сайту: знак «Rama» і напис «solidnawitryna.pl». Може вести на головну.
 */
export function Logo({
  variant = "full",
  href,
  label = "solidnawitryna.pl by Serhii Orlenko",
  disabled = false,
  disabledReason,
  className,
  markClassName = "size-8",
}: LogoProps) {
  const reasonId = useId();
  const isDisabled = Boolean(href) && disabled;
  const content = (
    <>
      <LogoMark
        className={markClassName}
        tilts={Boolean(href) && !isDisabled}
        muted={isDisabled}
      />
      {variant === "full" && (
        <span aria-hidden="true">
          solidna<span className={isDisabled ? "" : "text-accent"}>witryna</span>
          <span className="text-text-muted">.pl</span>
        </span>
      )}
    </>
  );

  if (isDisabled) {
    // Без href: посилання, що ніде не веде. Лишається у фокусі (tabIndex), як вимкнена Button.
    return (
      <span
        role="link"
        tabIndex={0}
        aria-disabled="true"
        aria-label={label}
        aria-describedby={disabledReason ? reasonId : undefined}
        className={[base, linkStyles, "cursor-not-allowed text-text-muted", className]
          .filter(Boolean)
          .join(" ")}
      >
        {content}
        {disabledReason && (
          <span id={reasonId} className="sr-only">
            {disabledReason}
          </span>
        )}
      </span>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        aria-label={label}
        className={[base, linkStyles, className].filter(Boolean).join(" ")}
      >
        {content}
      </Link>
    );
  }

  return (
    <span
      role="img"
      aria-label={label}
      className={[base, className].filter(Boolean).join(" ")}
    >
      {content}
    </span>
  );
}
