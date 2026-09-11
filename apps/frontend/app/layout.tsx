import NavMenu from "./components/layout/NavMenu";
import Footer from "./components/layout/Footer";

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
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NavMenu />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
