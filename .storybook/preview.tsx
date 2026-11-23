import type { Preview } from "@storybook/nextjs-vite";
import { dmSans } from "../src/app/fonts";
import "../src/app/globals.css";

/*
 * Як і в src/app/layout.tsx, змінна шрифту ставиться на <html>: Tailwind бере
 * font-family саме звідти. Preview виконується всередині iframe Storybook,
 * тому це діє і на історії, і на сторінки docs (MDX).
 */
document.documentElement.classList.add(...dmSans.variable.split(" "));

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
