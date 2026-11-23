import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FormField, type FormFieldProps } from "./FormField";

// Аргументи історії: пропси поля плюс перемикач hasError (у самого компонента його немає:
// стан помилки там задається наявністю тексту в error).
type StoryArgs = FormFieldProps & { hasError: boolean };

const meta = {
  title: "Components/FormField",
  component: FormField,
  tags: ["autodocs"],
  // Фон полотна Storybook білий, а токени за замовчуванням темні: ставимо під поле фон canvas.
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
_Текстове поле з підписом для форм: контактна форма, підписка, пошук. Підпис завжди стоїть над полем і прив'язаний до нього, тож клік по підпису ставить курсор у поле, а скрінрідер читає підпис разом із полем. Помилка показується під полем і не лише кольором: є іконка й текст._

## Параметри

| Параметр | Значення | За замовчуванням |
| --- | --- | --- |
| \`label\` | підпис над полем (обов'язковий) | немає |
| \`error\` | текст помилки; порожній або без значення — помилки немає | немає |
| \`disabled\` | \`true\`, \`false\` | \`false\` |
| \`defaultValue\` / \`value\` | значення поля (звичайне або кероване) | порожнє |
| \`placeholder\` | підказка всередині порожнього поля | немає |
| \`type\` | \`text\`, \`email\`, \`tel\` та інші типи \`<input>\` | \`text\` |
| \`id\` | ідентифікатор поля; якщо не передати, створюється сам | авто |
| \`className\` | клас для зовнішньої обгортки | немає |
| \`name\`, \`onChange\`, \`required\` та решта атрибутів \`<input>\` | як у звичайного поля | немає |

## Варіанти й стани

Варіантів вигляду в поля немає, є лише стани.

- Default: межа \`text-muted\` (контраст до фону не менше 3:1), текст \`text\`, підказка \`text-muted\`.
- Hover: межа стає кольору \`text\`. Для вимкненого поля й поля з помилкою hover вигляд не змінює.
- Focus: контур 2 px кольору \`accent\` з відступом 3 px, контраст до фону не менше 3:1. Межа не змінюється, тож у стані помилки видно і контур, і межу \`danger\`.
- Заповнене: у полі є значення, воно набране кольором \`text\`, а не кольором підказки. Перемикається в Controls через \`defaultValue\`.
- Помилка: межа \`danger\`, під полем іконка й текст кольору \`danger\`. Поле отримує \`aria-invalid\`, а текст помилки зв'язується з ним через \`aria-describedby\`: скрінрідер читає його разом із полем.
- Disabled: заливка \`surface\`, межа \`line\`, текст і підпис \`text-muted\`, курсор «заборонено». Це справжній атрибут \`disabled\`: поле не змінюється й пропускається клавішею Tab.
- Перехід: колір межі змінюється плавно за 150 мс. Якщо в системі ввімкнено «зменшити рух», анімація вимкнена (\`motion-reduce:transition-none\`).

## Токени

- Кольори: \`text\`, \`text-muted\`, \`accent\`, \`danger\`, \`surface\`, \`line\`.
- Текст: \`text-caption-strong\` (підпис), \`text-body\` (значення й підказка), \`text-caption\` (помилка).
- Радіус: \`rounded-control\`.
- Відступи: \`px-6 py-3\` (всередині поля), \`gap-2\` (між підписом, полем і помилкою та між іконкою й текстом), \`size-4\` (іконка).
- Шрифт: \`font-sans\`.

## Коли використовувати

- Для короткого однорядкового тексту: ім'я, e-mail, телефон, тема.
- Підпис пиши завжди й не заміняй його підказкою всередині поля: підказка зникає, коли користувач починає писати.
- Текст помилки пиши конкретно: що не так і що зробити («Wpisz adres e-mail w formacie imie@domena.pl»), а не просто «Błąd».
- Вимкнене поле лишай, лише коли значення справді не можна змінити. Для багаторядкового тексту (повідомлення) цей компонент не підходить.

## Як брати в код

\`\`\`tsx
import { FormField } from "@/components/FormField";

<FormField label="Imię" name="name" placeholder="Jan Kowalski" />
<FormField
  label="E-mail"
  type="email"
  name="email"
  defaultValue="jan@"
  error="Wpisz adres e-mail w formacie imie@domena.pl"
/>
<FormField label="Temat" disabled defaultValue="Wycena strony" />
\`\`\`
`,
      },
    },
  },
  argTypes: {
    label: { control: "text", description: "Підпис над полем" },
    defaultValue: {
      control: "text",
      description: "Значення поля. Порожнє — поле порожнє, з текстом — заповнене",
    },
    placeholder: {
      control: "text",
      description: "Підказка всередині порожнього поля",
    },
    hasError: {
      control: "boolean",
      description: "Показати стан помилки (у коді це наявність тексту в error)",
    },
    error: { control: "text", description: "Текст помилки під полем" },
    disabled: { control: "boolean", description: "Вимкнене поле" },
  },
  args: {
    label: "E-mail",
    placeholder: "jan@domena.pl",
    defaultValue: "",
    hasError: false,
    error: "Wpisz adres e-mail w formacie imie@domena.pl",
    disabled: false,
  },
  // key змушує поле перемальовуватись, коли в Controls змінюється значення:
  // саме по собі defaultValue поле, що вже показане, не оновлює.
  render: ({ hasError, error, ...args }) => (
    <FormField
      key={String(args.defaultValue)}
      {...args}
      error={hasError ? error : undefined}
    />
  ),
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
