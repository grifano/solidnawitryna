import Image from "next/image";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { Logo } from "@/components/Logo";
import { Navigation } from "@/components/Navigation";
import { TestimonialCard } from "@/components/TestimonialCard";
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

/*
 * Відгуки з Upwork (листопад 2026). Окремої сторінки для одного відгуку Upwork не має:
 * навіть посилання з кнопки «Share on LinkedIn» (/ab/g/pub/wom/prx/…) лише перенаправляє
 * на профіль. Тому ведемо прямо на профіль, на блок «Client feedback» (якір). Без входу
 * Upwork показує лише початок відгуку, тому оригінал англійською (дослівно, з помилками
 * автора) розгортається просто на картці. Пропуски (…) однакові в перекладі й оригіналі.
 * Randy G. = Randy W. George, sensei Fresno Samurai Arts (є на сторінці школи).
 * Ryan K. = Ryan Kelley, контракт «Webflow Expert for Website Portfolio» (травень 2023):
 * кілька власних сайтів, тож одного «сайту клієнта» для посилання немає.
 */
const UPWORK_PROFILE =
  "https://www.upwork.com/freelancers/~018d80f89cc75022e7#portal-feedbacks-section";

const testimonials = [
  {
    name: "Randy G.",
    role: "Sensei, Fresno Samurai Arts (USA)",
    quote:
      "Serhii jest życzliwy, profesjonalny i bardzo łatwo się z nim współpracuje! Przyszedł z pomocą, gdy mój webdeveloper miał problemy zdrowotne, i płynnie przejął jego pracę. Dalej będziemy razem dbać o stronę i ją ulepszać, i cieszę się na kolejne wspólne projekty.",
    original:
      "Serhii is friendly, professional, and so easy to work with! He came to the rescue after my web developer had health issues and picked up the slack seamlessly. We'll continue to work together on website maintenance and improvements and I'm looking forward to working with Serhii on future projects.",
    siteHref: "https://www.fresnosamuraiarts.com/",
  },
  {
    name: "Ryan K.",
    role: "Przedsiębiorca, zleca projekty na Upwork od ponad 10 lat",
    quote:
      "Od ponad 10 lat zatrudniam freelancerów na Upwork i uważam, że Serhii jest jednym z najlepszych na świecie! To ekspert od Webflow, a komunikacja z nim jest na najwyższym poziomie. Doceniam jego uczciwość i gotowość, by »dać z siebie więcej«, żeby projekt się udał. Serhii ma moją najwyższą rekomendację. Zatrudnij go, a nie będziesz rozczarowany!",
    original:
      'In over 10 years of hiring freelancers on Upwork, I think Serhii is one of the very best in the world! He is an expert Webflow developer with top notch communication. I appreciated his honesty and willingness to "go the extra mile" to make sure the project was a success. Sehii gets my highest recommendation. Hire him and you won\'t be disappointed!',
  },
  {
    name: "Alexey K.",
    role: "C-Octopus, monitoring wideo dla produkcji (Izrael)",
    quote:
      "(…) Zatrudniliśmy Serhiiego do nowej strony i odświeżenia marki. Przyniósł bardzo ciekawe pomysły, wybraliśmy jeden i na nim zbudowaliśmy stronę. Uczciwość, profesjonalizm i łatwa komunikacja. Na pewno będziemy dalej współpracować.",
    original:
      "(…) We hired Serhii yo develop new website + rebranding. He brought us very interesting ideas, so we choose one and continue in developing the website. Integrity, professional and easy communication. Definitely will work with him in future.",
    siteHref: "https://www.c-octopus.co.il/",
  },
];

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-control bg-accent px-4 py-2 text-body-strong text-canvas focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-10 outline-accent focus-visible:outline-2 focus-visible:outline-offset-3"
      >
        Przejdź do treści
      </a>

      <div className="px-4 md:px-16">
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
              className="relative z-0 hidden items-center gap-3 border-l border-line pl-4 opacity-0 md:flex"
            >
              <Image
                src={portrait}
                alt=""
                sizes="2rem"
                className="aspect-portrait size-8 rounded-control object-cover"
              />
              <span data-intro="by-text" className="text-caption text-text-muted">
                by{" "}
                <span className="text-body-strong block text-text md:inline">
                  Serhii Orlenko
                </span>
              </span>
            </div>
          </div>
          <Navigation items={menu} label="Menu główne" menuLabel="Menu" />
        </header>
      </div>

      {/* overflow-x-clip: портрет у HeroStage відкочується за правий край. На телефоні clip на body
          цього не стримує (сторінка ширшала до 426 px), тому обрізаємо ще й тут. */}
      <main id="main" className="overflow-x-clip px-4 md:px-16">
        <section
          id="top"
          className="mx-auto grid max-w-page items-center gap-8 py-section lg:grid-cols-2"
        >
          <div className="flex flex-col items-start gap-6">
            <p data-intro="reveal" className="text-label text-accent uppercase">
              Marka i strona dla małych firm usługowych
            </p>
            <h1 className="text-heading md:text-display">
              Strona, o którą nie trzeba się martwić
            </h1>
            <p data-intro="reveal" className="max-w-reading text-lead text-text-muted">
              Robię markę i stronę, a potem się nią opiekuję. SEO, aktualizacje,
              kopie zapasowe i bezpieczeństwo biorę na siebie.
            </p>
            {/* 375: кнопки на всю ширину, одна під одною. Від 768: за шириною тексту, в ряд. */}
            <div
              data-intro="reveal"
              className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:flex-wrap"
            >
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

        <section
          id="opinie"
          aria-labelledby="opinie-title"
          className="mx-auto flex max-w-page flex-col gap-8 border-t border-line py-section"
        >
          <div className="flex flex-col items-start gap-4">
            <p className="text-label text-accent uppercase">Opinie klientów</p>
            <h2 id="opinie-title" className="text-heading">
              Co mówią ci, którzy już ze mną pracowali
            </h2>
            <p className="max-w-reading text-lead text-text-muted">
              Opinie z platformy Upwork, przetłumaczone na polski. Oryginał każdej
              opinii można rozwinąć pod tłumaczeniem.
            </p>
            <ul className="flex flex-wrap gap-3">
              <li>
                <Chip>100% Job Success na Upwork</Chip>
              </li>
              <li>
                <Chip>39 zrealizowanych projektów</Chip>
              </li>
            </ul>
          </div>

          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              /* 768–1023: дві колонки, третя картка займає весь ряд, щоб не лишати дірки. */
              <li key={t.name} className="flex md:last:col-span-2 lg:last:col-span-1">
                <TestimonialCard
                  {...t}
                  translated
                  sourceHref={UPWORK_PROFILE}
                  revealDelay={i * 120}
                  className="w-full"
                />
              </li>
            ))}
          </ul>

          <div className="flex w-full flex-col md:w-auto md:flex-row">
            <Button size="lg" href={FORM_HREF}>
              Napisz do mnie
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
