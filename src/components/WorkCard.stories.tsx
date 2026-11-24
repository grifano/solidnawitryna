import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import cover from "@/assets/simpleprint-cover.jpeg";
import { WorkCard } from "./WorkCard";

const meta = {
  title: "Components/WorkCard",
  component: WorkCard,
  tags: ["autodocs"],
  // Фон полотна Storybook білий, а токени за замовчуванням темні: ставимо під картку фон canvas.
  // Ширину картки задає сітка, а не сама картка: ставимо її в першу з трьох колонок, як на сторінці.
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
_Картка однієї реалізації: обкладинка, назва й короткий опис. Вся картка — одне посилання на сторінку або кейс роботи. Картки ставимо в сітку, ширину кожної задає сітка._

## Параметри

| Параметр | Значення | За замовчуванням |
| --- | --- | --- |
| \`title\` | назва роботи (обов'язковий) | немає |
| \`description\` | короткий опис, одне-два речення (обов'язковий) | немає |
| \`image\` | обкладинка, імпортована з \`src/assets\` (обов'язковий) | немає |
| \`imageAlt\` | опис картинки для скрінрідера | порожній рядок (картинка декоративна) |
| \`href\` | адреса, куди веде картка (обов'язковий) | немає |
| \`sizes\` | ширина картинки на екранах, для вибору розміру файлу | \`(min-width: 64rem) 33vw, 100vw\` |
| \`className\` | клас для зовнішнього посилання (ширина в сітці тощо) | немає |

## Варіанти й стани

Варіантів і розмірів немає: картка одна. Стани показані справжні, наведи мишу й пройди клавішею Tab.

- Default: заливка \`surface\`, рамка \`line\` 1 px, назва \`text\`, опис \`text-muted\`.
- Hover: рамка стає \`accent\`, назва теж \`accent\`. Колір змінюється плавно за 150 мс.
- Focus (Tab на клавіатурі): контур 2 px кольору \`accent\` з відступом 3 px навколо всієї картки. Контраст контуру до фону сторінки не менше 3:1 (у Dark 6,32:1, у Light 6,36:1). Показується лише при навігації з клавіатури.
- Анімація: якщо в системі ввімкнено «зменшити рух», перехід кольору вимкнено (\`motion-reduce:transition-none\`).
- Обкладинка: завжди пропорції \`aspect-cover\` (4 / 3), картинка заповнює її без розтягування (\`object-cover\`). Будь-яке співвідношення сторін файлу обрізається до 4 / 3.

## Токени

- Кольори: \`surface\`, \`line\`, \`accent\`, \`text\`, \`text-muted\`.
- Текст: \`text-lead-strong\` (назва), \`text-body\` (опис).
- Радіус: \`rounded-card\`.
- Пропорція: \`aspect-cover\`.
- Відступи: \`p-6\` (всередині під обкладинкою), \`gap-2\` (між назвою й описом).
- Шрифт: \`font-sans\`.

## Коли використовувати

- Для переліку реалізацій на сторінці: кілька карток у сітці, однакової висоти обкладинки.
- Заголовок картки — \`h3\`, тож став картки під заголовком секції \`h2\`.
- Картинку клади в \`src/assets\` і імпортуй у код, а не бери з \`public\`.
- Якщо обкладинка лише прикрашає, лиши \`imageAlt\` порожнім. Якщо на ній є зміст, якого немає в назві, опиши його.
- Не став у картку інші посилання чи кнопки: вся картка вже посилання.

## Як брати в код

\`\`\`tsx
import cover from "@/assets/simpleprint-cover.jpeg";
import { WorkCard } from "@/components/WorkCard";

<WorkCard
  title="SimplePrint"
  description="Marka i strona dla amerykańskiej platformy print-on-demand: logo, katalog produktów i układ na każdy ekran."
  image={cover}
  imageAlt="Logo SimplePrint i kolaż zdjęć produktów z nadrukiem"
  href="/prace/simpleprint"
/>
\`\`\`
`,
      },
    },
  },
  argTypes: {
    title: { control: "text", description: "Назва роботи (заголовок h3)" },
    description: { control: "text", description: "Короткий опис роботи" },
    image: {
      control: false,
      description: "Обкладинка, імпортована з src/assets (у Controls не змінюється)",
    },
    imageAlt: {
      control: "text",
      description: "Опис картинки для скрінрідера; порожній — картинка декоративна",
    },
    href: { control: "text", description: "Адреса, куди веде вся картка" },
    sizes: {
      control: "text",
      description: "Ширина картинки на екранах, для вибору розміру файлу",
    },
    className: { control: false },
  },
  args: {
    title: "SimplePrint",
    description:
      "Marka i strona dla amerykańskiej platformy print-on-demand: logo, katalog produktów i układ na każdy ekran.",
    image: cover,
    imageAlt: "Logo SimplePrint i kolaż zdjęć produktów z nadrukiem",
    href: "#",
  },
} satisfies Meta<typeof WorkCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
