import { Manrope } from "next/font/google";

/*
 * Лише для Storybook, на сайт не потрапляє.
 * У DM Sans немає кирилиці, тому українські підписи на сторінках Storybook
 * малюються цим шрифтом (геометричний, близький до DM Sans). Латиницю й польські літери
 * далі малює DM Sans: браузер бере наступний шрифт зі списку лише для літер, яких бракує.
 */
export const storybookCyrillic = Manrope({
  subsets: ["cyrillic"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-storybook-cyrillic",
});
