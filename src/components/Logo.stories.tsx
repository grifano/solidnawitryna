import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Logo } from "./Logo";

const meta = {
  title: "Components/Logo",
  component: Logo,
  tags: ["autodocs"],
  // Фон полотна Storybook білий, а токени за замовчуванням темні: ставимо під лого фон canvas.
  decorators: [
    (Story) => (
      <div className="bg-canvas p-8">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
_Лого сайту: знак «Rama» (вікно браузера з трьома крапками й літерою W) і напис «solidnawitryna.pl». Стоїть у шапці, веде на головну. Знак сам змінює кольори між темами Dark і Light, бо будується з токенів._

## Параметри

| Параметр | Значення | За замовчуванням |
| --- | --- | --- |
| \`variant\` | \`full\` (знак і напис), \`mark\` (лише знак) | \`full\` |
| \`href\` | адреса, куди веде лого; без неї лого не посилання | немає |
| \`label\` | назва для скрінрідера; у \`full\` має містити видимий текст «solidnawitryna.pl» | \`solidnawitryna.pl by Serhii Orlenko\` |
| \`className\` | клас для зовнішнього елемента | немає |

## Варіанти й стани

- \`full\`: знак і напис. «solidna» кольору \`text\`, «witryna» кольору \`accent\`, «.pl» кольору \`text-muted\`.
- \`mark\`: лише знак, для тісних місць (мала шапка, іконка). Назва для скрінрідера лишається.
- Знак: рамка \`text\`, три крапки \`canvas\`, внутрішнє вікно \`surface\`, літера W кольору \`accent\`. Літера на вікні має контраст не менше 3:1 в обох темах.
- Лого з \`href\`: посилання, у фокусі (Tab на клавіатурі) контур 2 px кольору \`accent\` з відступом 3 px, контраст до фону не менше 3:1.
- Лого без \`href\`: не інтерактивне, має \`role="img"\` і назву.
- Скрінрідер читає \`label\` замість візуального напису (напис має \`aria-hidden\`). У \`full\` назва починається з видимого тексту «solidnawitryna.pl»: так голосове керування («натисни solidnawitryna.pl») знаходить лого, а Accessibility не показує порушення «Content name mismatch».

## Токени

- Кольори: \`text\`, \`canvas\`, \`surface\`, \`accent\`, \`text-muted\`.
- Текст: \`text-lead-strong\` (напис).
- Відступи: \`gap-3\` (між знаком і написом), знак \`size-8\`.
- Шрифт: \`font-sans\`.

## Коли використовувати

- Одне лого в шапці сайту, зазвичай з \`href="/"\`.
- \`mark\` бери, коли напис не вміщається або потрібна лише іконка.
- Без \`href\` лого можна ставити в підвалі, де воно не повинно бути посиланням.
- Не перефарбовуй знак своїми кольорами: він уже підлаштовується під тему.

## Як брати в код

\`\`\`tsx
import { Logo } from "@/components/Logo";

<Logo href="/" />
<Logo variant="mark" href="/" />
<Logo label="solidnawitryna.pl" />
\`\`\`
`,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["full", "mark"],
      description: "Знак із написом (full) або лише знак (mark)",
    },
    href: {
      control: "text",
      description: "Адреса, куди веде лого; порожнє: не посилання",
    },
    label: {
      control: "text",
      description: "Назва лого для скрінрідера",
    },
  },
  args: {
    variant: "full",
    href: "/",
    label: "solidnawitryna.pl by Serhii Orlenko",
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
