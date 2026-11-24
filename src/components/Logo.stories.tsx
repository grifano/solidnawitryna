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
| \`disabled\` | вимкнене лого-посилання (лише з \`href\`) | \`false\` |
| \`disabledReason\` | пояснення для скрінрідера, чому лого вимкнене; на екрані не показується | немає |
| \`className\` | клас для зовнішнього елемента | немає |
| \`markClassName\` | клас розміру знака; \`size-full\` розтягує знак на батьківський блок | \`size-8\` |

## Варіанти й стани

- \`full\`: знак і напис. «solidna» кольору \`text\`, «witryna» кольору \`accent\`, «.pl» кольору \`text-muted\`.
- \`mark\`: лише знак, для тісних місць (мала шапка, іконка). Назва для скрінрідера лишається.
- Знак: рамка \`text\`, три крапки \`canvas\`, внутрішнє вікно \`surface\`, літера W кольору \`accent\`. Літера на вікні має контраст не менше 3:1 в обох темах.
- Лого з \`href\`: посилання, у фокусі (Tab на клавіатурі) контур 2 px кольору \`accent\` з відступом 3 px, контраст до фону не менше 3:1.
- Лого з \`href\`, hover: знак плавно припіднімається вправо й зависає на нижньому правому куті (\`rotate-6\` навколо нижнього правого кута, 150 мс, \`ease-out\`, як усі переходи сайту). Напис не рухається. При «зменшити рух» у системі анімації немає (\`motion-reduce:transition-none\`).
- Лого з \`href\`, disabled: робиться через \`aria-disabled\`, без адреси (\`role="link"\`, \`tabIndex=0\`). Лого лишається у фокусі й нікуди не веде. Знак сірий (\`grayscale\`), текст \`text-muted\`, курсор \`not-allowed\`, hover-ефекту (нахилу знака) немає. Пояснення \`disabledReason\` читає скрінрідер через \`aria-describedby\`.
- Лого без \`href\`: не інтерактивне, має \`role="img"\` і назву.
- Скрінрідер читає \`label\` замість візуального напису (напис має \`aria-hidden\`). У \`full\` назва починається з видимого тексту «solidnawitryna.pl»: так голосове керування («натисни solidnawitryna.pl») знаходить лого, а Accessibility не показує порушення «Content name mismatch».

## Токени

- Кольори: \`text\`, \`canvas\`, \`surface\`, \`accent\`, \`text-muted\`.
- Текст: \`text-lead-strong\` (напис). У disabled напис \`text-muted\`.
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
<Logo href="/" disabled disabledReason="Strona jest w przebudowie" />
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
    disabled: {
      control: "boolean",
      description: "Вимкнене лого-посилання (лише з href)",
    },
    disabledReason: {
      control: "text",
      description: "Пояснення для скрінрідера, чому лого вимкнене",
    },
  },
  args: {
    variant: "full",
    href: "/",
    label: "solidnawitryna.pl by Serhii Orlenko",
    disabled: false,
    disabledReason: "",
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
