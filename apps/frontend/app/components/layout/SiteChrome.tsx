"use client";

import { usePathname } from "next/navigation";
import NavMenu from "./NavMenu";
import Footer from "./Footer";

const routesWithoutChrome = new Set(["/entrar", "/cadastro"]);

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (routesWithoutChrome.has(pathname)) {
    return children;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <NavMenu />
      {children}
      <Footer />
    </div>
  );
}
