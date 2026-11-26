import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button, type ButtonActionProps } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
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
_Кнопка для дії на сторінці: надіслати форму, відкрити розділ, перейти до контакту. Одна кнопка — одна дія. Основна кнопка виділяє головну дію екрана, другорядна стоїть поруч і не відволікає від неї._

## Параметри

| Параметр | Значення | За замовчуванням |
| --- | --- | --- |
| \`variant\` | \`primary\`, \`secondary\` | \`primary\` |
| \`size\` | \`md\` (звичайний), \`lg\` (великий) | \`md\` |
| \`disabled\` | \`true\`, \`false\` | \`false\` |
| \`disabledReason\` | текст пояснення під кнопкою | немає |
| \`type\` | \`button\`, \`submit\`, \`reset\` | \`button\` |
| \`href\` | адреса: сторінка, якір (\`#form\`) або \`https://…\`; з нею кнопка стає посиланням \`<a>\` | немає |
| \`onClick\`, \`children\` та решта атрибутів \`<button>\` | як у звичайної кнопки | немає |

## Варіанти й стани

- \`primary\`: заливка \`accent\`, текст \`canvas\`. Контраст тексту до заливки не менше 4,5:1 в обох темах (у Dark 6,32:1, у Light 6,36:1).
- \`secondary\`: без заливки, межа \`text-muted\` (контраст до фону не менше 3:1), текст \`text\`.
- Hover: у \`primary\` заливка стає трохи темнішою (\`accent-hover\`, контраст тексту \`canvas\` не менше 4,5:1), у \`secondary\` з'являється заливка \`surface\`.
- Focus (Tab на клавіатурі): контур 2 px кольору \`accent\` з відступом 3 px, контраст до фону не менше 3:1. Показується лише при навігації з клавіатури.
- Перехід: колір заливки, межі й тексту змінюється плавно за 150 мс (\`transition duration-150 ease-out\`). При натисканні кнопка трохи стискається до 97% (\`active:scale-97\`). Вимкнена кнопка не стискається. Якщо в системі ввімкнено «зменшити рух», анімація вимкнена (\`motion-reduce:transition-none\`).
- Disabled: заливка \`surface\`, текст \`text-muted\`, межа \`line\`, курсор «заборонено». Кнопка лишається у фокусі (\`aria-disabled\`, а не атрибут \`disabled\`), клік і Enter нічого не роблять. Hover не змінює вигляд. Так само працює кнопка з \`href\`: у вимкненому стані адреса прибирається, замість \`<a>\` рендериться \`<span role="link">\` з \`aria-disabled\` (як у вимкнених WorkCard і Logo), тож посилання нікуди не веде.
- Пояснення: якщо передати \`disabledReason\`, під вимкненою кнопкою з'явиться текст, зв'язаний з нею через \`aria-describedby\`. Скрінрідер читає його разом з назвою кнопки. Пояснення пиши конкретно: чому кнопка недоступна і що зробити.

## Токени

- Кольори: \`accent\`, \`canvas\`, \`text\`, \`text-muted\`, \`surface\`, \`line\`.
- Текст: \`text-body-strong\` (звичайна), \`text-lead-strong\` (велика), \`text-caption\` (пояснення).
- Радіус: \`rounded-control\`.
- Відступи: \`px-6 py-3\` (звичайна), \`px-8 py-4\` (велика), \`gap-2\` (між кнопкою й поясненням).
- Шрифт: \`font-sans\`.

## Коли використовувати

- Основна кнопка: одна на екран або блок, для головної дії.
- Другорядна кнопка: для додаткової дії поруч з основною або коли дія не головна.
- Вимкнену кнопку лишай, коли дію тимчасово не можна виконати й користувачу треба пояснити чому. Завжди додавай \`disabledReason\`.
- Не став дві основні кнопки поруч.
- Дія на сторінці (надіслати, відкрити) — кнопка без \`href\`. Перехід на сторінку, якір чи Calendly — кнопка з \`href\`: це справжнє посилання \`<a>\`, тому працюють відкриття в новій вкладці, копіювання адреси й Enter. Зовнішня адреса (\`https://…\`) відкривається в новій вкладці з \`rel="noopener noreferrer"\`. Якщо перехід тимчасово недоступний (наприклад, Calendly ще не підключений), постав \`disabled\` і \`disabledReason\`: кнопка лишиться на місці, але нікуди не поведе.

## Як брати в код

\`\`\`tsx
import { Button } from "@/components/Button";

<Button>Napisz do mnie</Button>
<Button variant="secondary" size="lg">Zobacz prace</Button>
<Button href="#form">Zamów mini-audyt</Button>
<Button variant="secondary" href="https://calendly.com/…">Umów konsultację</Button>
<Button disabled disabledReason="Uzupełnij formularz, aby wysłać wiadomość.">
  Wyślij
</Button>
<Button href="https://calendly.com/…" disabled disabledReason="Kalendarz będzie dostępny wkrótce.">
  Umów konsultację
</Button>
\`\`\`
`,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
      description: "Вигляд кнопки",
    },
    size: {
      control: "select",
      options: ["md", "lg"],
      description: "Розмір: звичайний (md) або великий (lg)",
    },
    disabled: {
      control: "boolean",
      description: "Вимкнена кнопка (aria-disabled, лишається у фокусі)",
    },
    disabledReason: {
      control: "text",
      description: "Пояснення під вимкненою кнопкою",
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
      description: "Тип кнопки у формі (за замовчуванням button)",
    },
    children: { control: "text", description: "Текст кнопки" },
  },
  args: {
    children: "Napisz do mnie",
    variant: "primary",
    size: "md",
    disabled: false,
    disabledReason: "Uzupełnij formularz, aby wysłać wiadomość.",
  },
} satisfies Meta<ButtonActionProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * Кнопка-посилання: з `href` це `<a>` з тим самим виглядом. Адресу задай в `href` у коді.
 * Перемикач `disabled` прибирає адресу: посилання лишається у фокусі, але нікуди не веде.
 */
export const AsLink: Story = {
  args: {
    children: "Umów bezpłatną konsultację",
    variant: "secondary",
    disabledReason: "Kalendarz konsultacji będzie dostępny wkrótce.",
  },
  render: ({ variant, size, children, disabled, disabledReason }) => (
    <Button
      variant={variant}
      size={size}
      href="#consultation"
      disabled={disabled}
      disabledReason={disabledReason}
    >
      {children}
    </Button>
  ),
};
