import Image from "next/image";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { Navigation } from "@/components/Navigation";
import portrait from "@/assets/serhii.jpg";
import { HeroStage } from "./HeroStage";

/* Секцій з цими id ще немає: меню й кнопки ведуть на якорі, а не на сторінки з помилкою 404. */
const menu = [
  { label: "Realizacje", href: "#cases" },
  { label: "Usługi", href: "#services" },
  { label: "O mnie", href: "#about" },
];

/* Адреса консультації: коли буде Calendly, заміни якір на https://calendly.com/… */
const FORM_HREF = "#form";
const CONSULTATION_HREF = "#consultation";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-control bg-accent px-4 py-2 text-body-strong text-canvas focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-10"
      >
        Przejdź do treści
      </a>

      <div className="px-4 sm:px-16">
        <header className="relative z-40 mx-auto flex max-w-page items-center justify-between gap-4 border-b border-line py-4">
          <div className="flex min-w-0 items-center gap-4">
            {/* Лого лежить зверху й має фон: підпис виїжджає з-під нього (див. HeroStage). */}
            <Logo
              href="#top"
              label="solidnawitryna.pl, strona główna"
              className="relative z-10 bg-canvas pr-2"
            />
            <div
              data-intro="by"
              className="relative z-0 hidden items-center gap-3 border-l border-line pl-4 opacity-0 sm:flex"
            >
              <Image
                src={portrait}
                alt=""
                sizes="2rem"
                className="aspect-portrait size-8 rounded-control object-cover"
              />
              <span data-intro="by-text" className="text-caption text-text-muted">
                by{" "}
                <span className="text-body-strong block text-text sm:inline">
                  Serhii Orlenko
                </span>
              </span>
            </div>
          </div>
          <Navigation items={menu} label="Menu główne" menuLabel="Menu" />
        </header>
      </div>

      <main id="main" className="px-4 sm:px-16">
        <section
          id="top"
          className="mx-auto grid max-w-page items-center gap-8 py-section lg:grid-cols-2 lg:gap-16"
        >
          <div className="flex flex-col items-start gap-6">
            <p data-intro="reveal" className="text-label text-accent uppercase">
              Marka i strona dla małych firm usługowych
            </p>
            <h1 className="text-heading sm:text-display">
              Strona, o którą nie trzeba się martwić
            </h1>
            <p data-intro="reveal" className="max-w-xl text-lead text-text-muted">
              Robię markę i stronę, a potem się nią opiekuję. SEO, aktualizacje,
              kopie zapasowe i bezpieczeństwo biorę na siebie.
            </p>
            <div data-intro="reveal" className="flex flex-wrap gap-4">
              <Button size="lg" href={FORM_HREF}>
                Zamów bezpłatny mini-audyt
              </Button>
              <Button size="lg" variant="secondary" href={CONSULTATION_HREF}>
                Umów bezpłatną konsultację
              </Button>
            </div>
          </div>

          <HeroStage />
        </section>
      </main>
    </>
  );
}
