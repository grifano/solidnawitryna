import type { Metadata } from "next";
import Script from "next/script";
import { dmSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "SolidnaWitryna",
  description: "Strona, o którą nie trzeba się martwić.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={dmSans.variable} suppressHydrationWarning>
      {/* overflow-x-clip: портрет відкочується вправо з поворотом, його блок не має давати горизонтальний скрол. */}
      <body className="overflow-x-clip bg-canvas font-sans text-body text-text">
        {/* Без JS інтро не грає: ховаємо заставку й портрет, показуємо готову сцену. */}
        <noscript>
          <style>
            {`[data-sc="splash"],[data-sc="photo"],[data-sc="rings"],[data-sc="ctrls"]{display:none}[data-sc="scene"],[data-intro="by"]{opacity:1}`}
          </style>
        </noscript>
        {/* Заставку показуємо раз за сесію: на повторних відкриттях ховаємо її до гідратації. */}
        <Script id="splash-seen" strategy="beforeInteractive">
          {`try{if(sessionStorage.getItem('sw-splash-seen')==='1')document.documentElement.classList.add('no-splash')}catch(e){}`}
        </Script>
        {children}
      </body>
    </html>
  );
}
