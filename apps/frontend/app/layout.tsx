import SiteChrome from "./components/layout/SiteChrome";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abrigo Lambeijos",
  description: "Abrigo Lambeijos - Conectando animais que precisam de amor com famílias prontas para amar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <SiteChrome />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
