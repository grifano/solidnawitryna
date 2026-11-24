import type {
  ComponentPropsWithoutRef,
  MouseEvent,
  ReactNode,
} from "react";

export interface IconButtonProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "aria-label" | "children" | "disabled"
> {
  /**
   * Назва дії для скрінрідера (атрибут `aria-label`): кнопка не має видимого тексту,
   * тож без назви її не можна ні прочитати, ні знайти голосом. Пиши дію, а не картинку:
   * «Zatrzymaj animację», а не «Pauza».
   */
  label: string;
  /** Значок усередині: SVG з `fill="currentColor"` (колір бере від тексту кнопки), розмір `size-6`. */
  children: ReactNode;
  /**
   * Вимкнена кнопка. Робиться через `aria-disabled`, а не атрибут `disabled`, як у `Button`:
   * кнопка лишається у фокусі, клік і Enter/Space нічого не роблять.
   */
  disabled?: boolean;
}

const base =
  "inline-flex items-center justify-center rounded-control border-2 border-text-muted " +
  "bg-transparent p-3 font-sans text-text cursor-pointer " +
  "outline-accent focus-visible:outline-2 focus-visible:outline-offset-3 " +
  "transition duration-150 ease-out motion-reduce:transition-none " +
  "not-aria-disabled:hover:bg-surface not-aria-disabled:active:scale-97 " +
  "aria-disabled:cursor-not-allowed aria-disabled:border-line aria-disabled:bg-surface aria-disabled:text-text-muted";

/**
 * Кругла кнопка зі значком і без тексту, для другорядної дії: пауза анімації, закрити.
 * Вигляд як у `Button` secondary, але квадратна (`rounded-control` на квадраті дає коло).
 */
export function IconButton({
  label,
  type = "button",
  disabled = false,
  className,
  children,
  onClick,
  ...rest
}: IconButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (disabled) {
      // aria-disabled не блокує клік сам: зупиняємо дію (і submit у формі) вручну.
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  return (
    <button
      {...rest}
      type={type}
      aria-label={label}
      aria-disabled={disabled || undefined}
      onClick={handleClick}
      className={[base, className].filter(Boolean).join(" ")}
    >
      {children}
    </button>
  );
}
