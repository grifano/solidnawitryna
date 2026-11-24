@AGENTS.md

# SolidnaWitryna

## Стек

- Next.js (App Router), TypeScript, Tailwind CSS v4.
- Код лежить у `src/app`. Головний файл стилів: `src/app/globals.css`.
- Скрипти: `npm run dev` (розробка), `npm run build` (збірка), `npm run lint` (перевірка коду).

## Робота з Git

- Уся робота йде в гілці `main`.
- Нових гілок не створюй, поки я прямо не попрошу.
- Пуш у `main` публікує сайт (Vercel публікує кожен пуш). Тому перед пушем питай мене.

## Токени

Джерело правди — блок `@theme` у `src/app/globals.css` (код). Figma DS — орієнтир. Кольори, шрифти, радіуси, розміри тексту й пропорції беремо тільки з токенів, без довільних значень (`text-[17px]`, `bg-[#123456]`). Стандартні палітра, розміри тексту й радіуси Tailwind скинуто.

- **Кольори** (`--color-*`; Dark за замовчуванням. Тема йде за системною (`prefers-color-scheme`), а `data-theme="light"` чи `"dark"` на `<html>` примусово її вмикає): `canvas` (фон сторінки), `surface` (картки), `line` (лише декор: розділювачі, рамки карток і chips), `accent`, `accent-hover` (заливка основної кнопки при hover), `text`, `text-muted` (межі полів і кнопок без заливки), `danger` (помилка). Приклади: `bg-canvas`, `text-text-muted`, `border-line`. Текст на заливці accent — `text-canvas`. **Кольори сцени** (`scene-ink`, `scene-paper`, `scene-sky`, `scene-line`, `scene-accent`, `scene-accent-soft`, `scene-warm`, `scene-green`, `scene-hill`, `scene-muted`): однакові в Dark і Light, лише для ілюстрації першого екрана (`fill-scene-warm`); фон сцени й кільце беруть `surface` і `accent`.
- **Текст** (`--text-*`, разом із висотою рядка, трекінгом і жирністю): `display`, `heading`, `lead`, `lead-strong`, `body`, `body-strong`, `caption`, `caption-strong`, `label` (регістр капсом додає `uppercase`). Приклад: `text-body-strong`.
- **Тіні** (`--drop-shadow-*`; решту тіней скинуто): `drop-shadow-scene` (вікно в ілюстрації першого екрана). Інших тіней у системі поки немає.
- **Брейкпоінти** (`--breakpoint-*`; стандартні `sm`, `2xl` скинуто): база 375 px без префікса, `md:` 768 px (планшет вертикально), `lg:` 1024 px (невеликий ноутбук), `xl:` 1440 px (широкий екран). Розкладка секцій за таблицею поведінки з курсу (блок 8).
- **Радіуси** (`--radius-*`): `control` (кнопки, поля, chips, перемикач, портрет), `card` (картки). Приклад: `rounded-control`.
- **Пропорції** (`--aspect-*`): `portrait` (1 / 1), `cover` (4 / 3). Приклад: `aspect-cover`.
- **Лише для сторінок, не для компонентів:** `--container-page` (ширина контенту 1312 px, `max-w-page`), `--container-prose` (ширина читабельного тексту 576 px, `max-w-prose`) і `--spacing-section` (відстань між секціями, `py-section`).
- **Ілюстрація першого екрана** (ізольована від решти системи, токени лише для `HeroStage`): `--container-portrait-ring` і `--container-portrait-photo` (частки ширини сцени, `w-portrait-ring`, `w-portrait-photo`), `--container-splash-mark` (знак і фото на заставці, `w-splash-mark`), `--container-stage` (ширина сцени, `max-w-stage`). Рух (криві, тривалості, зсуви) і геометрія SVG токенів не мають.
- **Шрифт** (`--font-sans`): DM Sans, підключений у `src/app/fonts.ts` (підмножини latin і latin-ext, бо кирилиці в DM Sans немає).
- **Відступи** окремо не оголошені: тільки кроки 8, 12, 16, 24, 32 px = `2`, `3`, `4`, `6`, `8` (наприклад `p-4`). Поля сторінки: 64 px на десктопі (`px-16`), 16 px на мобільному (`px-4`).
- **Рамки** (поки без токенів): 1 px декор, 1,5 px елементи керування, 2 px фокус-кільце (accent, відступ 3 px).

## Компоненти

Компоненти лежать у `src/components`, історія й docs поруч (`<Компонент>.stories.tsx`). Дивимось у Storybook (`npm run storybook`), одна історія на компонент, `title` латиницею (`Components/Button`).

- **Button** (`src/components/Button.tsx`): варіанти `primary` (accent, при hover заливка `accent-hover`, текст `text-canvas`) і `secondary` (без заливки, межа `text-muted`); розміри `md` і `lg`; `rounded-control`. Стани: hover, focus (контур 2 px `accent`, відступ 3 px), disabled. Вимкнена кнопка робиться через `disabled` у пропсах (у DOM це `aria-disabled`, кнопка лишається у фокусі), пояснення передається в `disabledReason` (зв'язане через `aria-describedby`). З `href` кнопка стає посиланням `<a>` (`next/link`) з тим самим виглядом: сторінка, якір (`#form`) чи зовнішня адреса (`https://…`, відкривається в новій вкладці з `rel="noopener noreferrer"`); `disabled` з `href` не діє. Перехід: 150 мс на кольори, стискання до 97% при натисканні (не для вимкненої), без анімації при `motion-reduce`. Межа кнопки 2 px, а не 1,5 px: клас на 1,5 px без квадратних дужок Tailwind не створює.
- **FormField** (`src/components/FormField.tsx`): текстове поле з підписом, підпис завжди над полем (`<label for>`). Пропси: `label` (обов'язковий), `error` (текст помилки), `disabled`, решта атрибутів `<input>`. Межа поля `text-muted`, 2 px (не `line`), `rounded-control`. Стани: default, hover (межа `text`), focus (контур 2 px `accent`, відступ 3 px), заповнене, помилка (межа й текст `danger`, іконка, `aria-invalid` і `aria-describedby`), disabled (справжній `disabled`: `surface`, межа `line`). Історія: `Components/FormField`, помилка в Controls через `hasError` і `error`, заповнене через `defaultValue`.
- **WorkCard** (`src/components/WorkCard.tsx`): картка роботи, вся картка — одне посилання (`next/link`). Пропси: `title` (заголовок `h3`), `description`, `image` (імпорт з `src/assets`), `imageAlt` (порожній = декоративна), `href`, `sizes`, `className`. Обкладинка `aspect-cover` + `object-cover`, `rounded-card`, рамка `line` 1 px, заливка `surface`. Стани: default, hover (рамка й назва `accent`), focus (контур 2 px `accent`, відступ 3 px, контраст до фону не менше 3:1). Перехід 150 мс, без анімації при `motion-reduce`. Ширину задає сітка. Історія: `Components/WorkCard`.
- **Navigation** (`src/components/Navigation.tsx`, клієнтський компонент): меню сайту. Пропси: `items` (`{ label, href }`), `activeHref` (поточна сторінка, на сайті `usePathname()`), `label` (`aria-label`), `menuLabel` (текст кнопки), `closeLabel` (текст кнопки, коли меню відкрите), `className`. Пункт: `rounded-control`, межа 2 px (прозора; у активного `accent`, текст `text`), `text-body-strong`. Стани: default (`text-muted`), hover (заливка `surface`, текст `text`), focus (контур 2 px `accent`, відступ 3 px), активний (`aria-current="page"`). Менше 64 rem (1024 px, тобто 375 і 768) меню згортається в кнопку `Button` secondary («Menu», `aria-expanded`); відкрите меню виїжджає з-під шапки поверх сторінки (обгортка `fixed overflow-hidden` від нижнього краю шапки до низу екрана обрізає панель, тож вона не заходить на лого й «by …»; верхній край рахується при відкритті; відступ зверху `pt-8`; фон `canvas`; нижню межу шапки підкреслює лінія `accent` 1 px, що малюється зліва направо при відкритті й стягується справа наліво при закритті, пункти `text-heading`, сторінка під ним не прокручується) з тим самим таймлайном, що в заставки: панель 600 мс (`cubic-bezier(.7,0,.2,1)`), пункти 450 мс із кроком 70 мс; шапка з лого й кнопкою лишається над меню (шапка сторінки `relative z-40`, лого `z-10`), кнопка не рухається, підпис «Menu» плавно змінюється на «Zamknij»; закривається кнопкою, Escape (фокус повертається на кнопку) або вибором пункту; при `motion-reduce` без анімації. Перехід 150 мс, без анімації при `motion-reduce`. Історія: `Components/Navigation`, активний пункт у Controls через `activeHref`, вузький екран через Viewport.
- **Logo** (`src/components/Logo.tsx`): лого сайту, знак «Rama» (вікно браузера з трьома крапками й літерою W) і напис «solidnawitryna.pl». Взято з пілотного репо `grifano/solidnawitryna-pilot`. Пропси: `variant` (`full` — знак і напис, `mark` — лише знак), `markClassName` (розмір знака, за замовчуванням `size-8`), `href` (з нею лого — посилання `next/link`, без неї `role="img"`), `label` (назва для скрінрідера), `className`. Знак з токенів: рамка `text`, крапки `canvas`, вікно `surface`, літера W `accent`, тож сам перемикається між Dark і Light. Напис `text-lead-strong`: «solidna» `text`, «witryna» `accent`, «.pl» `text-muted`. Знак `size-8`, `gap-3`. Focus: контур 2 px `accent`, відступ 3 px. Hover (з `href`): знак плавно припіднімається вправо навколо нижнього правого кута (`rotate-6`, 150 мс `ease-out`, без анімації при `motion-reduce`). Історія: `Components/Logo`.
- **Chip** (`src/components/Chip.tsx`): коротка позначка в рамці для сильної сторони чи умови, не інтерактивна. Пропси: `children`, `className`, решта атрибутів `<span>`. Рамка `line` 1 px, текст `text-muted` (`text-caption`), `rounded-control`, `px-4 py-2`. Станів немає. Кілька chips ставимо в `ul` > `li` з `flex flex-wrap gap-3`. Історія: `Components/Chip`.
- **IconButton** (`src/components/IconButton.tsx`): кругла кнопка зі значком без тексту для впізнаваної другорядної дії (пауза, закрити). Пропси: `label` (обов'язковий, `aria-label`; міняй його зі станом), `disabled` (через `aria-disabled`, як у `Button`: без hover і стискання, лишається у фокусі), `children` (SVG `size-6 fill-current`), решта атрибутів `<button>`. Вигляд як у `Button` secondary: межа `text-muted` 2 px, `rounded-control`, `p-3` (52 px з межею), hover `surface`, disabled (`surface`, межа `line`, значок `text-muted`), focus (контур 2 px `accent`, відступ 3 px), перехід 150 мс, стискання до 97%, без анімації при `motion-reduce`. Історія: `Components/IconButton` (Playground, PauseAndPlay).
- Новий компонент: одразу історія з Controls і docs (параметри, варіанти й стани, токени за іменами, коли використовувати, як брати в код), тоді додаємо рядок сюди.

## Правила

Заповнимо далі.

## Посилання

- План сайту: `docs/plan.md`
