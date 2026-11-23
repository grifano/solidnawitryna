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

- **Кольори** (`--color-*`; Dark за замовчуванням, Light через `data-theme="light"` на `<html>`): `canvas` (фон сторінки), `surface` (картки), `line` (лише декор: розділювачі, рамки карток і chips), `accent`, `text`, `text-muted` (межі полів і кнопок без заливки), `danger` (помилка). Приклади: `bg-canvas`, `text-text-muted`, `border-line`. Текст на заливці accent — `text-canvas`.
- **Текст** (`--text-*`, разом із висотою рядка, трекінгом і жирністю): `display`, `heading`, `lead`, `lead-strong`, `body`, `body-strong`, `caption`, `caption-strong`, `label` (регістр капсом додає `uppercase`). Приклад: `text-body-strong`.
- **Радіуси** (`--radius-*`): `control` (кнопки, поля, chips, перемикач, портрет), `card` (картки). Приклад: `rounded-control`.
- **Пропорції** (`--aspect-*`): `portrait` (1 / 1), `cover` (4 / 3). Приклад: `aspect-cover`.
- **Лише для сторінок, не для компонентів:** `--container-page` (ширина контенту 1312 px, `max-w-page`) і `--spacing-section` (відстань між секціями, `py-section`).
- **Шрифт** (`--font-sans`): DM Sans, підключений у `src/app/fonts.ts` (підмножини latin і latin-ext, бо кирилиці в DM Sans немає).
- **Відступи** окремо не оголошені: тільки кроки 8, 12, 16, 24, 32 px = `2`, `3`, `4`, `6`, `8` (наприклад `p-4`). Поля сторінки: 64 px на десктопі (`px-16`), 16 px на мобільному (`px-4`).
- **Рамки** (поки без токенів): 1 px декор, 1,5 px елементи керування, 2 px фокус-кільце (accent, відступ 3 px).

## Компоненти

Компоненти лежать у `src/components`, історія й docs поруч (`<Компонент>.stories.tsx`). Дивимось у Storybook (`npm run storybook`), одна історія на компонент, `title` латиницею (`Components/Button`).

- **Button** (`src/components/Button.tsx`): варіанти `primary` (accent, текст `text-canvas`) і `secondary` (без заливки, межа `text-muted`); розміри `md` і `lg`; `rounded-control`. Стани: hover, focus (контур 2 px `accent`, відступ 3 px), disabled. Вимкнена кнопка робиться через `disabled` у пропсах (у DOM це `aria-disabled`, кнопка лишається у фокусі), пояснення передається в `disabledReason` (зв'язане через `aria-describedby`). Перехід: 150 мс на кольори, стискання до 97% при натисканні (не для вимкненої), без анімації при `motion-reduce`. Межа кнопки 2 px, а не 1,5 px: клас на 1,5 px без квадратних дужок Tailwind не створює.
- **FormField** (`src/components/FormField.tsx`): текстове поле з підписом, підпис завжди над полем (`<label for>`). Пропси: `label` (обов'язковий), `error` (текст помилки), `disabled`, решта атрибутів `<input>`. Межа поля `text-muted`, 2 px (не `line`), `rounded-control`. Стани: default, hover (межа `text`), focus (контур 2 px `accent`, відступ 3 px), заповнене, помилка (межа й текст `danger`, іконка, `aria-invalid` і `aria-describedby`), disabled (справжній `disabled`: `surface`, межа `line`). Історія: `Components/FormField`, помилка в Controls через `hasError` і `error`, заповнене через `defaultValue`.
- Новий компонент: одразу історія з Controls і docs (параметри, варіанти й стани, токени за іменами, коли використовувати, як брати в код), тоді додаємо рядок сюди.

## Правила

Заповнимо далі.

## Посилання

- План сайту: `docs/plan.md`
