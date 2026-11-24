import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useId } from "react";

export interface WorkCardProps {
  /** Назва роботи. Показується під обкладинкою як заголовок `h3`. */
  title: string;
  /** Короткий опис роботи: одне-два речення. */
  description: string;
  /** Обкладинка. Картинку імпортуй з теки `src/assets`: `import cover from "@/assets/cover.jpeg"`. */
  image: StaticImageData;
  /**
   * Опис картинки для скрінрідера. Лиши порожнім, якщо картинка лише прикрашає
   * і не додає змісту до назви: тоді скрінрідер її пропустить.
   */
  imageAlt?: string;
  /** Адреса, куди веде вся картка. */
  href: string;
  /**
   * Ширина картинки на різних екранах, для вибору розміру файлу (атрибут `sizes`).
   * Підлаштуй під сітку, де стоїть картка.
   */
  sizes?: string;
  /**
   * Вимкнена картка (наприклад, кейс ще не готовий). Робиться через `aria-disabled`, без адреси:
   * картка лишається у фокусі, але ніде не веде. Hover-ефекту немає, обкладинка стає сірою.
   */
  disabled?: boolean;
  /**
   * Пояснення, чому картка вимкнена, і що зробити. Показується під описом
   * й зв'язується з карткою через `aria-describedby`. Працює лише при `disabled`.
   */
  disabledReason?: string;
  /** Клас для зовнішнього посилання (ширина картки в сітці тощо). */
  className?: string;
}

const base =
  "group flex flex-col overflow-hidden rounded-card border border-line bg-surface font-sans " +
  "outline-accent focus-visible:outline-2 focus-visible:outline-offset-3 " +
  "transition duration-150 ease-out motion-reduce:transition-none " +
  "not-aria-disabled:hover:border-accent aria-disabled:cursor-not-allowed";

/**
 * Картка роботи: обкладинка, назва й короткий опис. Уся картка — одне посилання.
 */
export function WorkCard({
  title,
  description,
  image,
  imageAlt = "",
  href,
  sizes = "(min-width: 64rem) 33vw, 100vw",
  disabled = false,
  disabledReason,
  className,
}: WorkCardProps) {
  const reasonId = useId();
  const showReason = disabled && Boolean(disabledReason);

  const content = (
    <>
      <span className="relative block aspect-cover w-full">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes={sizes}
          className="object-cover group-aria-disabled:grayscale"
        />
      </span>
      <span className="flex flex-col gap-2 p-6">
        <h3
          className={
            "text-lead-strong text-text transition-colors duration-150 ease-out " +
            "motion-reduce:transition-none group-aria-disabled:text-text-muted " +
            "group-not-aria-disabled:group-hover:text-accent"
          }
        >
          {title}
        </h3>
        <span className="text-body text-text-muted">{description}</span>
        {showReason && (
          <span id={reasonId} className="text-caption text-text-muted">
            {disabledReason}
          </span>
        )}
      </span>
    </>
  );

  const classes = [base, className].filter(Boolean).join(" ");

  if (disabled) {
    // Без href: картка ніде не веде, але лишається у фокусі (tabIndex), як вимкнена Button.
    return (
      <div
        role="link"
        tabIndex={0}
        aria-disabled="true"
        aria-describedby={showReason ? reasonId : undefined}
        className={classes}
      >
        {content}
      </div>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
