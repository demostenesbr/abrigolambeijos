"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const items = [
  { href: "/", label: "Início" },
  { href: "/adotar", label: "Adotar" },
  { href: "/parceiros", label: "Parceiros" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
  { href: "/doacoes", label: "Doações" },
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `text-sm font-semibold transition-colors duration-200 hover:text-[#F28C28] ${
      isActive(href) ? "text-[#F28C28]" : "text-[#37474F]"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#FFF8F0]/95 backdrop-blur-sm border-b border-[#D1C4E9]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="font-semibold text-[#4D246A] text-xl tracking-tight">
            Abrigo Lambeijos
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClass(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/entrar"
            className="text-sm font-semibold text-[#37474F] hover:text-[#4D246A] transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="text-sm font-semibold bg-[#F28C28] text-white px-4 py-2 rounded-full hover:bg-[#D97820] transition-colors"
          >
            Cadastre-se
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-[#37474F]"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <div className="flex flex-col gap-1.5 w-6">
            <span
              className={`block h-0.5 bg-current transition-transform ${
                open ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 bg-current transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 bg-current transition-transform ${
                open ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#D1C4E9] bg-[#FFF8F0] px-6 py-4 flex flex-col gap-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClass(item.href)}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <div className="flex gap-3 pt-2 border-t border-[#D1C4E9]">
            <Link
              href="/entrar"
              onClick={() => setOpen(false)}
              className="text-sm font-semibold text-[#37474F]"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              onClick={() => setOpen(false)}
              className="text-sm font-semibold bg-[#F28C28] text-white px-4 py-2 rounded-full"
            >
              Cadastre-se
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
