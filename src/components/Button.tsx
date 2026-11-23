import { useId, type ComponentPropsWithoutRef, type MouseEvent } from "react";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "md" | "lg";

export interface ButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "disabled"> {
  /** Вигляд кнопки: `primary` — на кольорі accent, `secondary` — без заливки, з межею. */
  variant?: ButtonVariant;
  /** Розмір: `md` — звичайний, `lg` — великий. */
  size?: ButtonSize;
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
    "border-accent bg-accent text-canvas not-aria-disabled:hover:bg-accent/85",
  secondary:
    "border-text-muted bg-transparent text-text not-aria-disabled:hover:bg-surface",
};

const sizes: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-body-strong",
  lg: "px-8 py-4 text-lead-strong",
};

const disabledStyles =
  "aria-disabled:cursor-not-allowed aria-disabled:border-line aria-disabled:bg-surface aria-disabled:text-text-muted";

/**
 * Кнопка дизайн-системи: основна дія (`primary`) або другорядна (`secondary`).
 */
export function Button({
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
}: ButtonProps) {
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

  return (
    <div className="flex flex-col items-start gap-2">
      {button}
      <p id={reasonId} className="text-caption text-text-muted">
        {disabledReason}
      </p>
    </div>
  );
}
