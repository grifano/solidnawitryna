import type { Metadata } from "next";
import { dmSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "SolidnaWitryna",
  description: "Strona, o którą nie trzeba się martwić.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={dmSans.variable}>
      <body>{children}</body>
    </html>
  );
}
