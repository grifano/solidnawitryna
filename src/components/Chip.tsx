import type { ComponentPropsWithoutRef } from "react";

export type ChipProps = ComponentPropsWithoutRef<"span">;

/**
 * Chip: коротка позначка в рамці, наприклад сильна сторона або властивість.
 * Не інтерактивний: не посилання й не кнопка. Кілька chips ставимо в список `ul` > `li`.
 */
export function Chip({ className, children, ...rest }: ChipProps) {
  return (
    <span
      {...rest}
      className={[
        "inline-flex items-center rounded-control border border-line px-4 py-2",
        "font-sans text-caption text-text-muted",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
