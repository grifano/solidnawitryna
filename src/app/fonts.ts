import { DM_Sans } from "next/font/google";

/*
 * DM Sans у Google Fonts має лише підмножини latin і latin-ext (кирилиці немає).
 * latin-ext потрібен для польських літер: ą ć ę ł ń ó ś ź ż.
 * Ваги: 400 (текст) і 600 (акцент). Діапазон "400 600" next/font для DM Sans не приймає.
 * Змінна --font-dm-sans підключається до токена --font-sans у globals.css.
 */
export const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-dm-sans",
});
