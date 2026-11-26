import Link from "next/link";
import {
  useId,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
} from "react";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "md" | "lg";

interface ButtonBaseProps {
  /** Вигляд кнопки: `primary` — на кольорі accent, `secondary` — без заливки, з межею. */
  variant?: ButtonVariant;
  /** Розмір: `md` — звичайний, `lg` — великий. */
  size?: ButtonSize;
}

/** Кнопка-посилання: з `href` рендериться `<a>`, а не `<button>`. */
export interface ButtonLinkProps
  extends ButtonBaseProps,
    Omit<ComponentPropsWithoutRef<"a">, "href"> {
  /**
   * Адреса, куди веде кнопка: сторінка, якір (`#form`) або зовнішня (`https://…`).
   * Зовнішня адреса відкривається в новій вкладці (`target="_blank"`, `rel="noopener noreferrer"`),
   * якщо не передати свої `target` і `rel`.
   */
  href: string;
  /**
   * Вимкнена кнопка-посилання. Адреса прибирається: рендериться `<span role="link">` з
   * `aria-disabled`, як у вимкнених WorkCard і Logo. Лишається у фокусі, але нікуди не веде.
   */
  disabled?: boolean;
  /**
   * Пояснення під вимкненою кнопкою: чому вона недоступна й що зробити.
   * Зв'язується з кнопкою через `aria-describedby`. Показується тільки при `disabled`.
   */
  disabledReason?: string;
}

export interface ButtonActionProps
  extends ButtonBaseProps,
    Omit<ComponentPropsWithoutRef<"button">, "disabled"> {
  href?: undefined;
  /**
   * Вимкнена кнопка. Робиться через `aria-disabled`, а не атрибут `disabled`,
   * тому лишається у фокусі: клавіша Tab її не пропускає, скрінрідер читає пояснення.
   * Клік і Enter/Space у цьому стані нічого не роблять.
   */
  disabled?: boolean;
  /**
   * Пояснення під вимкненою кнопкою: чому вона недоступна й що зробити.
   * Зв'язується з кнопкою через `aria-describedby`. Показується тільки при `disabled`.
   */
  disabledReason?: string;
}

const base =
  "inline-flex items-center justify-center rounded-control border-2 font-sans " +
  "cursor-pointer outline-accent focus-visible:outline-2 focus-visible:outline-offset-3 " +
  "transition duration-150 ease-out motion-reduce:transition-none " +
  "not-aria-disabled:active:scale-97";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-accent bg-accent text-canvas not-aria-disabled:hover:bg-accent-hover",
  secondary:
    "border-text-muted bg-transparent text-text not-aria-disabled:hover:bg-surface",
};

const sizes: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-body-strong",
  lg: "px-8 py-4 text-lead-strong",
};

const disabledStyles =
  "aria-disabled:cursor-not-allowed aria-disabled:border-line aria-disabled:bg-surface aria-disabled:text-text-muted";

export type ButtonProps = ButtonLinkProps | ButtonActionProps;

/**
 * Кнопка дизайн-системи: основна дія (`primary`) або другорядна (`secondary`).
 * Без `href` це `<button>`, з `href` — посилання з тим самим виглядом.
 */
export function Button(props: ButtonProps) {
  if (props.href !== undefined) return <ButtonLink {...props} />;
  return <ButtonAction {...props} />;
}

/** Кнопка й пояснення під нею, зв'язане через `aria-describedby`. */
function WithReason({
  control,
  reasonId,
  reason,
}: {
  control: ReactNode;
  reasonId: string;
  reason: string;
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      {control}
      <p id={reasonId} className="text-caption text-text-muted">
        {reason}
      </p>
    </div>
  );
}

function ButtonLink({
  variant = "primary",
  size = "md",
  href,
  target,
  rel,
  disabled = false,
  disabledReason,
  className,
  children,
  "aria-describedby": describedBy,
  ...rest
}: ButtonLinkProps) {
  const reasonId = useId();
  const classes = [base, variants[variant], sizes[size], disabledStyles, className]
    .filter(Boolean)
    .join(" ");

  if (disabled) {
    // Без href: посилання, що нікуди не веде. Лишається у фокусі (tabIndex), як вимкнена кнопка.
    const showReason = Boolean(disabledReason);
    const describedByIds =
      [describedBy, showReason ? reasonId : undefined].filter(Boolean).join(" ") ||
      undefined;
    const link = (
      <span
        id={rest.id}
        role="link"
        tabIndex={0}
        aria-disabled="true"
        aria-label={rest["aria-label"]}
        aria-describedby={describedByIds}
        className={classes}
      >
        {children}
      </span>
    );
    if (!showReason) return link;
    return <WithReason control={link} reasonId={reasonId} reason={disabledReason!} />;
  }

  const external = /^https?:\/\//.test(href);
  return (
    <Link
      {...rest}
      href={href}
      target={target ?? (external ? "_blank" : undefined)}
      rel={rel ?? (external ? "noopener noreferrer" : undefined)}
      aria-describedby={describedBy}
      className={classes}
    >
      {children}
    </Link>
  );
}

function ButtonAction({
  variant = "primary",
  size = "md",
  disabled = false,
  disabledReason,
  type = "button",
  className,
  onClick,
  children,
  "aria-describedby": describedBy,
  ...rest
}: ButtonActionProps) {
  const reasonId = useId();
  const showReason = disabled && Boolean(disabledReason);
  const describedByIds =
    [describedBy, showReason ? reasonId : undefined].filter(Boolean).join(" ") ||
    undefined;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (disabled) {
      // aria-disabled не блокує клік сам: зупиняємо дію (і submit у формі) вручну.
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  const button = (
    <button
      {...rest}
      type={type}
      aria-disabled={disabled || undefined}
      aria-describedby={describedByIds}
      onClick={handleClick}
      className={[base, variants[variant], sizes[size], disabledStyles, className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );

  if (!showReason) return button;
  return <WithReason control={button} reasonId={reasonId} reason={disabledReason!} />;
}
