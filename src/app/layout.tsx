import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SolidnaWitryna",
  description: "Strona, o którą nie trzeba się martwić.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
