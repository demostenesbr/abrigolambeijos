"use client";

import { usePathname } from "next/navigation";
import NavMenu from "./NavMenu";
import Footer from "./Footer";

const routesWithoutChrome = new Set(["/entrar", "/cadastro"]);

export default function SiteChrome() {
  const pathname = usePathname();

  if (routesWithoutChrome.has(pathname)) {
    return null;
  }

  return (
    <>
      <NavMenu />
      <Footer />
    </>
  );
}
