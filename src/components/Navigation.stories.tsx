import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Logo } from "./Logo";
import { Navigation } from "./Navigation";

const items = [
  { label: "Prace", href: "/prace" },
  { label: "O mnie", href: "/o-mnie" },
  { label: "Kontakt", href: "/kontakt" },
];

const meta = {
  title: "Components/Navigation",
  component: Navigation,
  tags: ["autodocs"],
  // Фон полотна Storybook білий, а токени за замовчуванням темні: ставимо фон canvas.
  // Навігація стоїть у шапці над текстом, щоб було видно: відкрите меню лягає поверх контенту й не зсуває його.
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-canvas font-sans text-text">
        <header className="border-b border-line px-4 py-4 sm:px-16">
          <div className="flex items-center justify-between gap-4">
            <Logo href="/" />
            <div className="flex-1">
              <Story />
            </div>
          </div>
        </header>
        <main className="px-4 py-8 sm:px-16">
          <h1 className="text-heading">Solidna strona dla małej firmy</h1>
          <p className="mt-4 text-lead text-text-muted">
            Ten tekst leży pod nawigacją. Na wąskim ekranie otwarte menu zasłania go,
            ale nie przesuwa strony w dół.
          </p>
        </main>
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
_Меню сайту: пункти, за якими користувач переходить між розділами. На широкому екрані пункти стоять у ряд, на вузькому меню згортається в кнопку «Menu». Відкрите меню лягає поверх контенту й не зсуває сторінку._

## Параметри

| Параметр | Значення | За замовчуванням |
| --- | --- | --- |
| \`items\` | список пунктів \`{ label, href }\` | обов'язковий |
| \`activeHref\` | \`href\` активного пункту; порожнє значення: активного немає | немає |
| \`label\` | назва навігації для скрінрідера (\`aria-label\`) | \`Menu główne\` |
| \`menuLabel\` | текст кнопки на вузькому екрані | \`Menu\` |
| \`className\` | клас для зовнішнього \`nav\` | немає |

Активний пункт у Controls перемикається параметром \`activeHref\`.

## Варіанти й стани

- Default: текст \`text-muted\`, межа прозора (місце під межу зарезервоване, пункт не стрибає при зміні стану).
- Hover: заливка \`surface\`, текст \`text\`.
- Focus (Tab на клавіатурі): контур 2 px кольору \`accent\` з відступом 3 px, контраст до фону не менше 3:1 (і на \`canvas\`, і на \`surface\` в обох темах). Показується лише при навігації з клавіатури.
- Активний пункт: межа 2 px \`accent\` і текст \`text\`. Пункт відрізняється від інших не лише кольором, а й межею. Для скрінрідера він має \`aria-current="page"\`.
- Вузький екран (менше 40 rem): пункти сховані, видно кнопку «Menu» (вторинна \`Button\`). Кнопка має \`aria-expanded\` і \`aria-controls\`. Відкрите меню — панель \`surface\` з рамкою \`line\` поверх контенту (позиціювання \`absolute\`, сторінка не зсувається).
- Закриття меню: клавіша Escape (фокус повертається на кнопку «Menu»), повторний клік по кнопці, клік поза меню або вибір пункту.
- Перехід: колір заливки, межі й тексту змінюється за 150 мс. При «зменшити рух» у системі анімація вимкнена (\`motion-reduce:transition-none\`).

Вузький екран дивись через Viewport у тулбарі Storybook (іконка з прямокутником зверху, вибери мобільний розмір).

## Токени

- Кольори: \`text\`, \`text-muted\`, \`surface\`, \`line\`, \`accent\`.
- Текст: \`text-body-strong\` (пункти).
- Радіуси: \`rounded-control\` (пункт), \`rounded-card\` (панель відкритого меню).
- Відступи: \`px-4 py-3\` (пункт на вузькому екрані), \`sm:py-2\` (пункт на широкому), \`gap-2\` (між пунктами), \`p-2\` (панель), \`mt-2\` (відступ панелі від кнопки).
- Шрифт: \`font-sans\`.

## Коли використовувати

- Одна навігація в шапці сайту, вона веде між головними розділами.
- Пунктів небагато (до п'яти-шести): довше меню не вміститься в ряд на планшеті.
- Для окремої дії на сторінці бери \`Button\`, а не пункт меню.
- Ширину й положення в шапці задає розкладка сторінки (клас \`className\`), сам компонент займає ширину батька. Для кнопки й панелі на вузькому екрані батько має мати відому ширину.

## Як брати в код

\`\`\`tsx
"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/Navigation";

const items = [
  { label: "Prace", href: "/prace" },
  { label: "O mnie", href: "/o-mnie" },
  { label: "Kontakt", href: "/kontakt" },
];

export function SiteNavigation() {
  const pathname = usePathname();
  return <Navigation items={items} activeHref={pathname} />;
}
\`\`\`
`,
      },
    },
  },
  argTypes: {
    activeHref: {
      control: {
        type: "select",
        labels: {
          "": "Немає активного",
          "/prace": "Prace",
          "/o-mnie": "O mnie",
          "/kontakt": "Kontakt",
        },
      },
      options: ["", "/prace", "/o-mnie", "/kontakt"],
      description: "Активний пункт (href поточної сторінки)",
    },
    items: {
      control: "object",
      description: "Пункти меню: label і href",
    },
    label: {
      control: "text",
      description: "Назва навігації для скрінрідера",
    },
    menuLabel: {
      control: "text",
      description: "Текст кнопки меню на вузькому екрані",
    },
  },
  args: {
    items,
    activeHref: "/prace",
    label: "Menu główne",
    menuLabel: "Menu",
  },
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
