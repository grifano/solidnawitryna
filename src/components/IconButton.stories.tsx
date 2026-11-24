import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconButton } from "./IconButton";

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current">
      <path
        d="M8 5v14l11-7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  // Фон полотна Storybook білий, а токени за замовчуванням темні: ставимо під кнопку фон canvas.
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
_Кругла кнопка зі значком і без тексту для другорядної дії, яка зрозуміла без слів: пауза й відтворення анімації, закрити. Для головних дій бери \`Button\` з текстом._

## Параметри

| Параметр | Значення | За замовчуванням |
| --- | --- | --- |
| \`label\` | назва дії для скрінрідера (\`aria-label\`), обов'язкова | немає |
| \`children\` | значок: SVG з \`fill-current\`, розмір \`size-6\` | немає |
| \`disabled\` | вимкнена кнопка (\`aria-disabled\`, лишається у фокусі) | \`false\` |
| \`type\` | \`button\`, \`submit\`, \`reset\` | \`button\` |
| \`onClick\`, \`className\` та решта атрибутів \`<button>\` | як у звичайної кнопки | немає |

## Варіанти й стани

- Один вигляд: без заливки, межа \`text-muted\` 2 px (контраст до фону не менше 3:1), значок кольору \`text\`, коло.
- Hover: заливка \`surface\`.
- Focus (Tab на клавіатурі): контур 2 px кольору \`accent\` з відступом 3 px, контраст до фону не менше 3:1.
- Disabled (\`disabled\`): заливка \`surface\`, межа \`line\`, значок \`text-muted\`, курсор «заборонено», без hover і стискання. Робиться через \`aria-disabled\`, тож кнопка лишається у фокусі (Tab її не пропускає), клік нічого не робить. Місця для пояснення поруч немає: якщо причина важлива, напиши її текстом біля кнопки.
- Перехід 150 мс; при натисканні кнопка стискається до 97% (\`active:scale-97\`). При «зменшити рух» у системі анімація вимкнена (\`motion-reduce:transition-none\`).
- Розмір 52 × 52 px (значок 24 px, \`p-3\`, межа 2 px), більше за мінімальну ціль дотику 44 px.
- Якщо значок змінюється зі станом (пауза ↔ відтворення), міняй і \`label\`: скрінрідер читає дію, яка станеться після натискання («Zatrzymaj animację» → «Wznów animację»).

## Токени

- Кольори: \`text\`, \`text-muted\`, \`surface\`, \`line\`, \`accent\`.
- Радіус: \`rounded-control\`.
- Відступи: \`p-3\`, значок \`size-6\`.

## Коли використовувати

- Для знайомої дії, яку впізнають за значком: пауза, закрити, відтворити.
- Завжди передавай \`label\`: без нього кнопка нечитабельна для скрінрідера.
- Для дії зі словами («Napisz do mnie») бери \`Button\`.

## Як брати в код

\`\`\`tsx
import { IconButton } from "@/components/IconButton";

<IconButton label="Zatrzymaj animację" onClick={pause}>
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current">…</svg>
</IconButton>
\`\`\`
`,
      },
    },
  },
  argTypes: {
    label: { control: "text", description: "Назва дії для скрінрідера" },
    disabled: { control: "boolean", description: "Вимкнена кнопка (aria-disabled)" },
  },
  args: {
    label: "Zatrzymaj animację",
    children: <PauseIcon />,
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Вимкнена кнопка: без hover і стискання, лишається у фокусі. */
export const Disabled: Story = {
  args: { disabled: true },
};

/** Значок і назва міняються зі станом: пауза ↔ відтворення. */
export const PauseAndPlay: Story = {
  render: function Render() {
    const [paused, setPaused] = useState(false);
    return (
      <IconButton
        label={paused ? "Wznów animację" : "Zatrzymaj animację"}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? <PlayIcon /> : <PauseIcon />}
      </IconButton>
    );
  },
};
