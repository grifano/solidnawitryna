import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface IconButtonProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "aria-label" | "children"
> {
  /**
   * Назва дії для скрінрідера (атрибут `aria-label`): кнопка не має видимого тексту,
   * тож без назви її не можна ні прочитати, ні знайти голосом. Пиши дію, а не картинку:
   * «Zatrzymaj animację», а не «Pauza».
   */
  label: string;
  /** Значок усередині: SVG з `fill="currentColor"` (колір бере від тексту кнопки), розмір `size-6`. */
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center rounded-control border-2 border-text-muted " +
  "bg-transparent p-3 font-sans text-text cursor-pointer " +
  "outline-accent focus-visible:outline-2 focus-visible:outline-offset-3 " +
  "transition duration-150 ease-out motion-reduce:transition-none " +
  "hover:bg-surface active:scale-97";

/**
 * Кругла кнопка зі значком і без тексту, для другорядної дії: пауза анімації, закрити.
 * Вигляд як у `Button` secondary, але квадратна (`rounded-control` на квадраті дає коло).
 */
export function IconButton({
  label,
  type = "button",
  className,
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      aria-label={label}
      className={[base, className].filter(Boolean).join(" ")}
    >
      {children}
    </button>
  );
}
