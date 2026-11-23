/*
 * Сторінка «Токени» для Storybook.
 * Значень тут немає: кольори, розміри тексту, радіуси й пропорції беруться з класів Tailwind,
 * які будуються зі змінних @theme у src/app/globals.css. Змінився @theme — сторінка оновилась.
 * Імена класів записані повністю (не склеюються), щоб Tailwind їх знайшов.
 */

const colors = [
  { name: "canvas", swatch: "bg-canvas", note: "фон сторінки; текст на заливці accent" },
  { name: "surface", swatch: "bg-surface", note: "картки" },
  { name: "line", swatch: "bg-line", note: "лише декор: розділювачі, рамки карток і chips" },
  { name: "accent", swatch: "bg-accent", note: "кнопка, посилання, eyebrow, фокус" },
  { name: "text", swatch: "bg-text", note: "основний текст" },
  { name: "text-muted", swatch: "bg-text-muted", note: "другорядний текст; межі полів і кнопок без заливки" },
  { name: "danger", swatch: "bg-danger", note: "помилка: текст і межа поля" },
];

const textSizes = [
  { name: "text-display", className: "text-display", note: "головний заголовок (h1)" },
  { name: "text-heading", className: "text-heading", note: "заголовок секції (h2)" },
  { name: "text-lead", className: "text-lead", note: "лід під заголовком" },
  { name: "text-lead-strong", className: "text-lead-strong", note: "назва в картці" },
  { name: "text-body", className: "text-body", note: "основний текст" },
  { name: "text-body-strong", className: "text-body-strong", note: "кнопка, пункт меню, посилання" },
  { name: "text-caption", className: "text-caption", note: "підпис, chip" },
  { name: "text-caption-strong", className: "text-caption-strong", note: "мала кнопка, перемикач мови" },
  { name: "text-label + uppercase", className: "text-label uppercase", note: "eyebrow, заголовок смуги" },
];

const radii = [
  { name: "rounded-control", className: "rounded-control", note: "кнопки, поля, chips, перемикач, портрет" },
  { name: "rounded-card", className: "rounded-card", note: "картки, смуга реалізацій" },
];

const aspects = [
  { name: "aspect-portrait", className: "aspect-portrait", note: "портрет" },
  { name: "aspect-cover", className: "aspect-cover", note: "обкладинка роботи" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-heading">{title}</h2>
      {children}
    </section>
  );
}

export function TokensPage() {
  return (
    <div className="bg-canvas text-text font-sans rounded-card p-8 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-label uppercase text-accent">Foundations</p>
        <h1 className="text-display">Токени</h1>
        <p className="text-lead text-text-muted">
          Кольори, розміри тексту, радіуси й пропорції сайту. Сторінка читає змінні з @theme, тож після зміни
          токена вона оновлюється сама.
        </p>
      </header>

      <Section title="Кольори">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {colors.map((c) => (
            <li key={c.name} className="flex items-center gap-4">
              <span className={`${c.swatch} border border-line rounded-card w-16 h-16 shrink-0`} />
              <span className="flex flex-col">
                <code className="text-body-strong">{c.name}</code>
                <span className="text-caption text-text-muted">{c.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Шкала шрифтів">
        <p className="text-body text-text-muted">
          Шрифт — DM Sans (font-sans). Кожен клас задає розмір, висоту рядка, трекінг і жирність разом.
        </p>
        <ul className="flex flex-col">
          {textSizes.map((t) => (
            <li key={t.name} className="flex flex-col gap-2 border-t border-line py-4">
              <span className="text-caption text-text-muted">
                <code>{t.name}</code> · {t.note}
              </span>
              <span className={t.className}>Strona, o którą nie trzeba się martwić</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Радіуси">
        <ul className="flex flex-wrap gap-6">
          {radii.map((r) => (
            <li key={r.name} className="flex flex-col gap-3">
              <span className={`${r.className} block bg-surface border border-line w-48 h-16`} />
              <code className="text-caption-strong">{r.name}</code>
              <span className="text-caption text-text-muted">{r.note}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Пропорції">
        <ul className="flex flex-wrap items-end gap-6">
          {aspects.map((a) => (
            <li key={a.name} className="flex flex-col gap-3 w-48">
              <span className={`${a.className} block bg-surface border border-line rounded-card`} />
              <code className="text-caption-strong">{a.name}</code>
              <span className="text-caption text-text-muted">{a.note}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
