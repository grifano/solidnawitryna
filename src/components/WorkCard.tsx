import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

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
  /** Клас для зовнішнього посилання (ширина картки в сітці тощо). */
  className?: string;
}

const base =
  "group flex flex-col overflow-hidden rounded-card border border-line bg-surface font-sans " +
  "outline-accent focus-visible:outline-2 focus-visible:outline-offset-3 " +
  "transition duration-150 ease-out motion-reduce:transition-none " +
  "hover:border-accent";

/**
 * Картка роботи: обкладинка, назва й короткий опис. Уся картка — одне посилання.
 */
export function WorkCard({
  title,
  description,
  image,
  imageAlt = "",
  href,
  sizes = "(min-width: 40rem) 33vw, 100vw",
  className,
}: WorkCardProps) {
  return (
    <Link href={href} className={[base, className].filter(Boolean).join(" ")}>
      <span className="relative block aspect-cover w-full">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </span>
      <span className="flex flex-col gap-2 p-6">
        <h3
          className={
            "text-lead-strong text-text transition-colors duration-150 ease-out " +
            "motion-reduce:transition-none group-hover:text-accent"
          }
        >
          {title}
        </h3>
        <span className="text-body text-text-muted">{description}</span>
      </span>
    </Link>
  );
}
