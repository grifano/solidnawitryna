import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TestimonialCard } from "./TestimonialCard";

const meta = {
  title: "Components/TestimonialCard",
  component: TestimonialCard,
  tags: ["autodocs"],
  // Фон полотна Storybook білий, а токени за замовчуванням темні: ставимо під картку фон canvas.
  // Ширину картки задає сітка: ставимо її в першу з трьох колонок, як на сторінці.
  decorators: [
    (Story) => (
      <div className="bg-canvas p-8">
        <div className="grid grid-cols-3 gap-6">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
_Картка відгуку клієнта: оцінка зірками, текст, автор і посилання на оригінал. Картки ставимо в сітку під заголовком секції «Opinie klientów»._

## Параметри

| Параметр | Значення | За замовчуванням |
| --- | --- | --- |
| \`quote\` | текст відгуку, без лапок: їх додає картка (обов'язковий) | немає |
| \`name\` | ім'я автора, як на Upwork: «Randy G.» (обов'язковий) | немає |
| \`role\` | хто клієнт: компанія, галузь, країна (обов'язковий) | немає |
| \`rating\` | оцінка від 1 до 5 | \`5\` |
| \`translated\` | відгук перекладено: під текстом позначка «(tłumaczenie)» | \`false\` |
| \`original\` | оригінал дослівно; з'являється кнопка «Pokaż oryginał» | немає |
| \`originalLang\` | мова оригіналу (атрибут \`lang\`) | \`en\` |
| \`siteHref\` | адреса живого сайту клієнта; без неї посилання немає | немає |
| \`siteLabel\` | текст посилання на сайт клієнта | \`Zobacz stronę klienta\` |
| \`sourceHref\` | адреса оригіналу; без неї посилання немає | немає |
| \`sourceLabel\` | текст посилання на оригінал | \`Opinia na Upwork\` |
| \`sourceDisabled\` | вимкнене посилання на оригінал | \`false\` |
| \`sourceDisabledReason\` | пояснення під вимкненим посиланням | немає |
| \`revealDelay\` | затримка появи в мс, щоб картки в ряд з'являлися по черзі | \`0\` |
| \`className\` | клас для зовнішнього елемента (ширина в сітці тощо) | немає |

## Варіанти й стани

Варіантів і розмірів немає. Сама картка не натискається, тож hover на ній немає. Інтерактивні тут кнопка «Pokaż oryginał» і посилання (сайт клієнта, Upwork), стани в них справжні: наведи мишу й пройди клавішею Tab.

- Кнопка «Pokaż oryginał»: вигляд як у посилання (\`text-caption-strong\`, \`accent\`), стрілка вниз. Натиск розгортає оригінал під перекладом (\`aria-expanded\`, \`aria-controls\`), напис стає «Ukryj oryginał», стрілка повертається на 180°. Оригінал: \`text-caption\`, \`text-muted\`, ліва рамка \`line\` 2 px, атрибут \`lang\`. Hover і focus: під текстом малюється лінія (як у посилань), шеврон зсувається на 2 px униз (або вгору, коли оригінал розгорнутий): туди, куди піде текст. Focus: контур 2 px \`accent\` з відступом 3 px. Кнопка є лише тоді, коли передано \`original\`, тож вимкненого стану в неї немає.

- Картка: заливка \`surface\`, рамка \`line\` 1 px, \`rounded-card\`. Зірки \`accent\`, порожні зірки \`line\`. Скрінрідер читає оцінку одним рядком «Ocena: 5 z 5».
- Аватар: ініціали з \`name\` на колі \`accent\`, текст \`canvas\`. Для скрінрідера прихований: ім'я вже є поруч.
- Посилання, default: \`text-caption-strong\`, колір \`accent\`, значок «відкрити в новій вкладці». Відкривається в новій вкладці, скрінрідер чує «(otwiera się w nowej karcie)».
- Посилання, hover і focus: під текстом зліва направо малюється лінія 1 px кольору посилання (300 мс), а коли курсор іде, стягується справа наліво, як підкреслення шапки при відкритті мобільного меню. Значок «відкрити в новій вкладці» зсувається на 2 px угору й управо (150 мс). При «зменшити рух» лінія з'являється без анімації, значок не рухається.
- Посилання, focus (Tab): контур 2 px \`accent\` з відступом 3 px.
- Посилання, disabled: через \`aria-disabled\`, без адреси (\`role="link"\`, \`tabIndex=0\`). Лишається у фокусі, колір \`text-muted\`, курсор \`not-allowed\`, без лінії й руху значка на hover. Під ним \`sourceDisabledReason\`.
- Поява: коли картка доїжджає до екрана, вона за 600 мс піднімається на 24 px і проявляється, а зірки вискакують по одній. Картка, що вже на екрані при завантаженні, не анімується. При «зменшити рух» і без JS анімації немає, картка видима одразу. У Storybook картка зазвичай уже на екрані, тож поява видна лише на сайті при прокрутці.

## Токени

- Кольори: \`surface\`, \`line\`, \`accent\`, \`canvas\`, \`text\`, \`text-muted\`.
- Текст: \`text-body\` (відгук), \`text-body-strong\` (ім'я, ініціали), \`text-caption\` (роль, «tłumaczenie»), \`text-caption-strong\` (посилання).
- Радіуси: \`rounded-card\` (картка), \`rounded-control\` (аватар, контур фокусу посилання).
- Пропорція: \`aspect-portrait\` (аватар).
- Відступи: \`p-6\` (на мобільному), \`md:p-8\`, \`gap-6\`, \`gap-4\`, \`gap-2\`, \`pt-6\`.
- Шрифт: \`font-sans\`.

## Коли використовувати

- Для відгуків клієнтів: 2–3 картки в сітці \`grid gap-6 md:grid-cols-2 lg:grid-cols-3\`, кожна в \`li\`.
- Перекладений відгук завжди з \`translated\`. Оригінал дай через \`sourceHref\`, щоб читач міг перевірити.
- Короткий текст: 2–4 речення. Скорочення в цитаті позначай «(…)».
- Не вигадуй відгуків і не змінюй їхнього змісту: лише переклад і скорочення.

## Як брати в код

\`\`\`tsx
import { TestimonialCard } from "@/components/TestimonialCard";

<TestimonialCard
  name="Randy G."
  role="Szkoła sztuk walki, USA"
  quote="Serhii jest życzliwy, profesjonalny i bardzo łatwo się z nim współpracuje!"
  translated
  sourceHref="https://www.upwork.com/freelancers/~018d80f89cc75022e7"
  revealDelay={120}
/>
\`\`\`
`,
      },
    },
  },
  argTypes: {
    quote: { control: "text", description: "Текст відгуку, без лапок" },
    name: { control: "text", description: "Ім'я автора" },
    role: { control: "text", description: "Хто клієнт: компанія, галузь, країна" },
    rating: {
      control: { type: "range", min: 1, max: 5, step: 1 },
      description: "Оцінка від 1 до 5",
    },
    translated: {
      control: "boolean",
      description: "Переклад: показує позначку «(tłumaczenie)»",
    },
    original: {
      control: "text",
      description: "Оригінал дослівно; порожній — кнопки «Pokaż oryginał» немає",
    },
    originalLang: { control: "text", description: "Мова оригіналу (lang)" },
    siteHref: {
      control: "text",
      description: "Адреса сайту клієнта; порожня — посилання немає",
    },
    siteLabel: { control: "text", description: "Текст посилання на сайт клієнта" },
    sourceHref: {
      control: "text",
      description: "Адреса оригіналу; порожня — посилання немає",
    },
    sourceLabel: { control: "text", description: "Текст посилання на оригінал" },
    sourceDisabled: {
      control: "boolean",
      description: "Вимкнене посилання: нікуди не веде, лишається у фокусі",
    },
    sourceDisabledReason: {
      control: "text",
      description: "Пояснення під вимкненим посиланням",
    },
    revealDelay: {
      control: { type: "number", min: 0, step: 120 },
      description: "Затримка появи в мс",
    },
    className: { control: false },
  },
  args: {
    name: "Randy G.",
    role: "Sensei, Fresno Samurai Arts (USA)",
    quote:
      "Serhii jest życzliwy, profesjonalny i bardzo łatwo się z nim współpracuje! Przyszedł z pomocą, gdy mój webdeveloper miał problemy zdrowotne, i płynnie przejął jego pracę.",
    rating: 5,
    translated: true,
    original:
      "Serhii is friendly, professional, and so easy to work with! He came to the rescue after my web developer had health issues and picked up the slack seamlessly.",
    originalLang: "en",
    siteHref: "https://www.fresnosamuraiarts.com/",
    siteLabel: "Zobacz stronę klienta",
    sourceHref:
      "https://www.upwork.com/freelancers/~018d80f89cc75022e7#portal-feedbacks-section",
    sourceLabel: "Opinia na Upwork",
    sourceDisabled: false,
    sourceDisabledReason: "Profil jest chwilowo niedostępny",
    revealDelay: 0,
  },
} satisfies Meta<typeof TestimonialCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
