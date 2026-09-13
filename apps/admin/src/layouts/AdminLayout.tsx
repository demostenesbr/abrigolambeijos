import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { to: "/admin", icon: "🏠", label: "Início", end: true },
  { to: "/admin/pets", icon: "🐶", label: "Pets" },
  { to: "/admin/adotantes", icon: "👤", label: "Adotantes" },
  { to: "/admin/solicitacoes", icon: "📋", label: "Solicitações" },
  { to: "/admin/adocoes", icon: "❤️", label: "Adoções" },
  { to: "/admin/resgates", icon: "🚑", label: "Resgates" },
  { to: "/admin/doacoes", icon: "💰", label: "Doações" },
  { to: "/admin/recomendacoes", icon: "🧠", label: "Recomendações" },
  { to: "/admin/parceiros", icon: "🤝", label: "Parceiros" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    navigate("/entrar");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? "bg-[#F28C28]/15 text-[#F28C28] font-semibold"
        : "text-[#A89BC2] hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="min-h-screen flex bg-[#F3F0F8]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1A1033] flex flex-col transform transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <div>
              <p className="font-bold text-white text-base leading-tight">Lar Feliz</p>
              <p className="text-[10px] text-[#78909C] uppercase tracking-widest">Painel Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#D9534F] hover:bg-[#D9534F]/10 transition-all"
          >
            <span className="text-base w-5 text-center">🚪</span>
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#E8E0F0] px-6 py-3.5 flex items-center justify-between">
          <button
            className="md:hidden p-1.5 text-[#4D246A]"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <div className="flex flex-col gap-1 w-5">
              <span className="block h-0.5 bg-current" />
              <span className="block h-0.5 bg-current" />
              <span className="block h-0.5 bg-current" />
            </div>
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-[#263238]">Ana Cristina</p>
              <p className="text-[10px] text-[#78909C]">Administradora</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#4D246A] flex items-center justify-center text-white text-xs font-bold">
              AC
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
