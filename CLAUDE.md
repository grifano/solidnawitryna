@AGENTS.md

# SolidnaWitryna

## Проєкт і стек

Маркетинговий сайт solidnawitryna.pl (польською), він же проєкт курсу AI UX/UI Engineer.

- Next.js (App Router), React, TypeScript, Tailwind CSS v4, шрифт DM Sans (`src/app/fonts.ts`, підмножини latin і latin-ext).
- Сторінки й стилі: `src/app`. Токени: блок `@theme` у `src/app/globals.css`. Компоненти: `src/components`. Картинки: `src/assets`.
- Скрипти: `npm run dev` (розробка), `npm run build` (Storybook у `public/storybook`, потім Next), `npm run lint`, `npm run storybook` (порт 6006).
- Джерело правди — код (`@theme`). Figma DS — орієнтир.

## Робота з Git

- Уся робота йде в гілці `main`.
- Нових гілок не створюй, поки я прямо не попрошу.
- Пуш у `main` публікує сайт (Vercel публікує кожен пуш). Тому перед пушем питай мене.

## Кольори

Імена з `@theme` (`--color-*`). Dark за замовчуванням; тема йде за системною (`prefers-color-scheme`), а `data-theme="light"` чи `"dark"` на `<html>` примусово її вмикає. Класи: `bg-canvas`, `text-text-muted`, `border-line`, `fill-scene-warm`.

- `canvas` — фон сторінки; текст на заливці accent (`text-canvas`).
- `surface` — картки, смуга реалізацій, ореол фото, hover кнопок без заливки.
- `line` — лише декор: розділювачі, рамки карток і chips.
- `accent` — кнопка, посилання, eyebrow, фокус-кільце.
- `accent-hover` — заливка основної кнопки при hover.
- `text` — основний текст.
- `text-muted` — другорядний текст; межі полів і кнопок без заливки.
- `danger` — помилка: текст і межа поля.
- Кольори сцени, однакові в Dark і Light, лише для ілюстрації першого екрана (`HeroStage`):
  - `scene-ink` — контури, дах, текст у вікні.
  - `scene-paper` — вікно, стіни, світлі деталі.
  - `scene-sky` — панель вікна, картки, небо, шибки.
  - `scene-line` — тонкі лінії й заглушки тексту.
  - `scene-accent` — акцент у сцені.
  - `scene-accent-soft` — світліший акцент.
  - `scene-warm` — кнопка, олівець, зірка, промені.
  - `scene-green` — щит, крона.
  - `scene-hill` — пагорб.
  - `scene-muted` — напрямні й контур напису.

## Типографіка

Розмір, висота рядка, трекінг і жирність задані токеном `--text-*`; одним класом: `text-body-strong`. Шрифт `font-sans` (DM Sans).

- `text-display` — 64 px, `h1`.
- `text-heading` — 32 px, заголовок секції (`h2`).
- `text-lead` — 18 px, лід під заголовком.
- `text-lead-strong` — 18 px, назва в картці.
- `text-body` — 16 px, основний текст.
- `text-body-strong` — 16 px, кнопка, пункт меню, посилання.
- `text-caption` — 14 px, підпис, chip.
- `text-caption-strong` — 14 px, мала кнопка, перемикач мови.
- `text-label` — 14 px, eyebrow, заголовок смуги; регістр капсом додає `uppercase`.

## Відступи, радіуси й пропорції

- **Відступи** не оголошені, беремо кроки Tailwind: 8, 12, 16, 24, 32 px = `2`, `3`, `4`, `6`, `8` (`p-4`, `gap-6`). Поля сторінки: `px-16` на десктопі, `px-4` на мобільному.
- **Рамки** (без токенів): 1 px декор, 2 px елементи керування (`border-2`; клас на 1,5 px без дужок Tailwind не створює), 2 px фокус-кільце `accent` з відступом 3 px.
- **Радіуси:** `rounded-control` (кнопки, поля, chips, перемикач, портрет), `rounded-card` (картки).
- **Пропорції:** `aspect-portrait` (1 / 1), `aspect-cover` (4 / 3).
- **Тіні:** лише `drop-shadow-scene` (вікно в ілюстрації першого екрана).
- **Брейкпоінти:** база 375 px без префікса, `md:` 768, `lg:` 1024, `xl:` 1440. Стандартні `sm` і `2xl` скинуто.
- **Токени лише для сторінок:** `max-w-page` (1312 px), `max-w-reading` (576 px), `py-section` / `gap-section` (96 px, на мобільному 64 px).
- **Токени лише для `HeroStage`:** `w-portrait-ring`, `w-portrait-photo`, `w-splash-mark`, `max-w-stage`.
- Стандартні палітра, розміри тексту, радіуси й тіні Tailwind скинуто (`--color-*: initial` та інші).

## Компоненти

Лежать у `src/components`, поруч `<Компонент>.stories.tsx` (`title` латиницею, `Components/Button`).

- **Button:** варіанти `primary` (заливка `accent`, hover `accent-hover`, текст `text-canvas`) і `secondary` (межа `text-muted`, hover `surface`); розміри `md`, `lg`. З `href` стає посиланням `next/link` (сторінка, якір, зовнішня адреса в новій вкладці); з `href` і `disabled` адреса прибирається (`span role="link"`). Вимкнена: `disabled` у пропсах дає `aria-disabled`, пояснення в `disabledReason` (`aria-describedby`).
- **FormField:** поле з підписом над ним (`label` обов'язковий), `error`, `disabled`. Межа `text-muted` 2 px. Стани: default, hover (заливка `surface` у будь-якому стані, звичайна межа ще й `text`), focus, заповнене, помилка (`danger`, іконка, `aria-invalid`), disabled.
- **WorkCard:** вся картка — одне посилання. Пропси `title`, `description`, `image`, `imageAlt`, `href`, `sizes`, `disabled`, `disabledReason`. Обкладинка `aspect-cover`, `rounded-card`, рамка `line`. Hover: рамка й назва `accent`. Disabled: без адреси (`aria-disabled`), у фокусі, hover немає, обкладинка сіра.
- **Navigation** (клієнтський): пропси `items`, `activeHref`, `label`, `menuLabel`, `closeLabel`. Активний пункт `aria-current="page"`. Пункт `items` може бути `disabled` (з `disabledReason`). Менше 1024 px згортається в кнопку-меню на весь екран; закривається кнопкою, Escape або вибором пункту.
- **Logo:** `variant` `full` або `mark`; з `href` — посилання, без нього `role="img"`. Hover: знак припіднімається вправо (`rotate-6`). `disabled` (лише з `href`): без адреси (`aria-disabled`), у фокусі, hover немає.
- **Chip:** коротка неінтерактивна позначка, рамка `line`, `text-caption`, `rounded-control`. Кілька — в `ul` > `li` з `flex flex-wrap gap-3`.
- **TestimonialCard** (клієнтський): відгук клієнта. Пропси `quote`, `name`, `role`, `rating`, `translated` (позначка «(tłumaczenie)»), `original` і `originalLang` (кнопка «Pokaż oryginał» розгортає оригінал на картці), `siteHref`, `siteLabel` (живий сайт клієнта), `sourceHref`, `sourceLabel`, `sourceDisabled`, `sourceDisabledReason`, `revealDelay`. Сама картка не натискається; посилання відкриваються в новій вкладці. Hover і focus посилань: лінія під текстом малюється зліва направо (як підкреслення шапки в мобільному меню), значок зсувається на 2 px. Поява при прокрутці (підйом і проявлення, зірки по одній), без анімації при `motion-reduce` і без JS.
- **IconButton:** кругла кнопка зі значком; `label` обов'язковий (`aria-label`), `disabled` через `aria-disabled`, значок `size-6 fill-current`.
- Спільне для інтерактивних: focus — контур 2 px `accent`, відступ 3 px; перехід 150 мс; без анімації при `motion-reduce`.

## Правила

- Кольори, розміри тексту, радіуси й пропорції тільки з токенів `@theme`.
- Класи, яких немає в `@theme` (`text-white`, `bg-black`, `text-gray-500`, `rounded-lg`, `shadow-md`), не використовувати.
- Відступи в компонентах тільки з кроків 8, 12, 16, 24, 32 px (`2`, `3`, `4`, `6`, `8`). Токени розкладки (`max-w-page`, `max-w-reading`, `py-section`) тільки на сторінках.
- Довільні значення в квадратних дужках (`p-[13px]`, `h-[150px]`, `text-[#123456]`, `text-[17px]`) заборонені.
- Нові кольори не додавати.
- Використовуй готові компоненти замість нових.
- Кожен інтерактивний елемент має стани default, hover, focus, disabled; поле форми ще й помилку.
- Вимкнена кнопка через `aria-disabled` з поясненням (`disabledReason`), а не атрибут `disabled`.
- Картинки лежать у `src/assets` і імпортуються (`import cover from "@/assets/…"`), не з `public`.
- Після змін у компонентах оновлюй його історію (Controls) і документацію в Storybook. Новий компонент: одразу історія й docs, потім рядок у розділі «Компоненти».

## Посилання

- План сайту: `docs/plan.md`
- Storybook: `npm run storybook` (http://localhost:6006), збірка `public/storybook` (`/storybook` на сайті). Токени й компоненти дивимось там.
