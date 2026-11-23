import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Chip } from "./Chip";

const meta = {
  title: "Components/Chip",
  component: Chip,
  tags: ["autodocs"],
  // Фон полотна Storybook білий, а токени за замовчуванням темні: ставимо під chip фон canvas.
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
_Коротка позначка в рамці: сильна сторона, властивість, умова. Підкреслює головне поруч із заголовком чи кнопками. Не натискається._

## Параметри

| Параметр | Значення | За замовчуванням |
| --- | --- | --- |
| \`children\` | короткий текст: одна-три слова або фраза до 5 слів | немає |
| \`className\` | клас для зовнішнього елемента (положення в списку тощо) | немає |
| решта атрибутів \`<span>\` | як у звичайного \`span\` | немає |

## Варіанти й стани

- Один вигляд, станів немає: chip не інтерактивний, тому в нього немає hover, focus чи disabled.
- Вигляд: прозора заливка, рамка \`line\` 1 px, текст \`text-muted\`, повністю закруглений край.
- Контраст тексту \`text-muted\` до фону не менше 4,5:1 в обох темах. Рамка \`line\` — лише декор.

## Токени

- Кольори: \`line\` (рамка), \`text-muted\` (текст).
- Текст: \`text-caption\`.
- Радіус: \`rounded-control\`.
- Відступи: \`px-4 py-2\`.
- Шрифт: \`font-sans\`.

## Коли використовувати

- Для 2–4 коротких тез поруч, наприклад сильних сторін чи умов: «Start w 2–3 tygodnie».
- Кілька chips став у список \`ul\` > \`li\` з \`flex flex-wrap gap-3\`: скрінрідер прочитає їх як список.
- Не роби chip посиланням чи кнопкою: для дії бери \`Button\`.
- Не став довгі речення: chip має читатися одним поглядом.

## Як брати в код

\`\`\`tsx
import { Chip } from "@/components/Chip";

<ul className="flex flex-wrap gap-3">
  <li><Chip>Marka i strona od jednej osoby</Chip></li>
  <li><Chip>Start w 2–3 tygodnie</Chip></li>
</ul>
\`\`\`
`,
      },
    },
  },
  argTypes: {
    children: { control: "text", description: "Текст chip" },
  },
  args: {
    children: "Start w 2–3 tygodnie",
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
