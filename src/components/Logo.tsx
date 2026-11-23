import Link from "next/link";

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
  /** Клас для зовнішнього елемента (положення в шапці тощо). */
  className?: string;
}

/**
 * Знак «Rama»: вікно браузера з трьома крапками й літерою W.
 * Кольори тільки з токенів, тому знак сам перемикається між Dark і Light.
 */
function LogoMark() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className="size-8 shrink-0">
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
  "outline-accent focus-visible:outline-2 focus-visible:outline-offset-3";

/**
 * Лого сайту: знак «Rama» і напис «solidnawitryna.pl». Може вести на головну.
 */
export function Logo({
  variant = "full",
  href,
  label = "solidnawitryna.pl by Serhii Orlenko",
  className,
}: LogoProps) {
  const content = (
    <>
      <LogoMark />
      {variant === "full" && (
        <span aria-hidden="true">
          solidna<span className="text-accent">witryna</span>
          <span className="text-text-muted">.pl</span>
        </span>
      )}
    </>
  );

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
