import type { Preview } from "@storybook/nextjs-vite";
import { dmSans } from "../src/app/fonts";
import { storybookCyrillic } from "./fonts";
import "../src/app/globals.css";

/*
 * Як і в src/app/layout.tsx, змінна шрифту ставиться на <html>: Tailwind бере
 * font-family саме звідти. Preview виконується всередині iframe Storybook,
 * тому це діє і на історії, і на сторінки docs (MDX).
 */
document.documentElement.classList.add(...dmSans.variable.split(" "));

/*
 * Кирилиця лише в Storybook: у список шрифтів токена --font-sans після DM Sans додається Manrope.
 * Сам токен у globals.css не змінюється, на сайті нічого не міняється.
 */
document.documentElement.classList.add(...storybookCyrillic.variable.split(" "));
document.documentElement.style.setProperty(
  "--font-sans",
  "var(--font-dm-sans), var(--font-storybook-cyrillic), ui-sans-serif, system-ui, sans-serif",
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
