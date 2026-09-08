import { NavLink, Link } from "react-router";
import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors duration-200 hover:text-[#F28C28] ${
      isActive ? "text-[#F28C28]" : "text-[#37474F]"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#FFF8F0]/95 backdrop-blur-sm border-b border-[#D1C4E9]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="font-semibold text-[#4D246A] text-xl tracking-tight">
            Lar Feliz
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={linkClass}>
            Início
          </NavLink>
          <NavLink to="/adotar" className={linkClass}>
            Adotar
          </NavLink>
          <NavLink to="/parceiros" className={linkClass}>
            Parceiros
          </NavLink>
          <NavLink to="/sobre" className={linkClass}>
            Sobre
          </NavLink>
          <NavLink to="/contato" className={linkClass}>
            Contato
          </NavLink>
          <NavLink to="/doacoes" className={linkClass}>
            Doações
          </NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/entrar"
            className="text-sm font-semibold text-[#37474F] hover:text-[#4D246A] transition-colors"
          >
            Entrar
          </Link>
          <Link
            to="/cadastro"
            className="text-sm font-semibold bg-[#F28C28] text-white px-4 py-2 rounded-full hover:bg-[#D97820] transition-colors"
          >
            Cadastre-se
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[#37474F]"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <div className="flex flex-col gap-1.5 w-6">
            <span
              className={`block h-0.5 bg-current transition-transform ${open ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 bg-current transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 bg-current transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#D1C4E9] bg-[#FFF8F0] px-6 py-4 flex flex-col gap-4">
          {[
            { to: "/", label: "Início", end: true },
            { to: "/adotar", label: "Adotar" },
            { to: "/parceiros", label: "Parceiros" },
            { to: "/sobre", label: "Sobre" },
            { to: "/contato", label: "Contato" },
            { to: "/doacoes", label: "Doações" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="flex gap-3 pt-2 border-t border-[#D1C4E9]">
            <Link
              to="/entrar"
              onClick={() => setOpen(false)}
              className="text-sm font-semibold text-[#37474F]"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
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
