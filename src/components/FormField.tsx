import { useId, type ComponentPropsWithoutRef } from "react";

export interface FormFieldProps
  extends Omit<ComponentPropsWithoutRef<"input">, "className"> {
  /** Підпис поля. Завжди стоїть над полем і прив'язаний до нього (`<label for>`). */
  label: string;
  /**
   * Текст помилки. Якщо передати непорожній рядок, поле переходить у стан помилки:
   * межа кольору `danger`, під полем з'являється іконка й цей текст.
   * Текст зв'язаний з полем через `aria-describedby`, а саме поле позначене `aria-invalid`.
   */
  error?: string;
  /** Клас для зовнішньої обгортки (відступи від сусідніх елементів тощо). */
  className?: string;
  /** Вимкнене поле: його не можна змінити, воно пропускається клавішею Tab. */
  disabled?: boolean;
}

const inputBase =
  "w-full rounded-control border-2 bg-transparent px-6 py-3 font-sans text-body text-text " +
  "placeholder:text-text-muted outline-accent focus-visible:outline-2 focus-visible:outline-offset-3 " +
  "transition duration-150 ease-out motion-reduce:transition-none " +
  "disabled:cursor-not-allowed disabled:border-line disabled:bg-surface disabled:text-text-muted";

const inputDefault = "border-text-muted enabled:hover:border-text";
const inputError = "border-danger";

/**
 * Поле форми: текстове поле з підписом над ним і місцем для помилки під ним.
 */
export function FormField({
  label,
  error,
  className,
  disabled = false,
  id,
  type = "text",
  "aria-describedby": describedBy,
  ...rest
}: FormFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(error);
  const describedByIds =
    [describedBy, hasError ? errorId : undefined].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}>
      <label
        htmlFor={inputId}
        className={[
          "font-sans text-caption-strong",
          disabled ? "text-text-muted" : "text-text",
        ].join(" ")}
      >
        {label}
      </label>
      <input
        {...rest}
        id={inputId}
        type={type}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        aria-describedby={describedByIds}
        className={[inputBase, hasError ? inputError : inputDefault].join(" ")}
      />
      {hasError && (
        <p
          id={errorId}
          className="flex items-start gap-2 font-sans text-caption text-danger"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="size-4 shrink-0"
          >
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 4.5v4" />
            <path d="M8 11.25v.01" />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
