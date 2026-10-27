import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import favicon from "../assets/favicon.ico";
import {
  getAccessToken,
  persistAdminSession,
  signOutAdmin,
  type AdminUser,
} from "../services/adminAuth";

const navItems = [
  { to: "/admin/home", icon: "🏠", label: "Início", end: true },
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
  const [authState, setAuthState] = useState<
    "checking" | "authenticated" | "unauthenticated"
  >("checking");
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const handoffToken = params.get("access_token");
    if (handoffToken) {
      localStorage.setItem("abrigo_access_token", handoffToken);
      window.history.replaceState(
        null,
        document.title,
        `${window.location.pathname}${window.location.search}`,
      );
    }

    const token = getAccessToken();
    if (!token) {
      queueMicrotask(() => setAuthState("unauthenticated"));
      return;
    }

    api
      .get<AdminUser>("/auth/me")
      .then((authenticatedUser) => {
        if (authenticatedUser.role !== "ADMIN") {
          throw new Error("Perfil sem permissão administrativa.");
        }
        persistAdminSession({ accessToken: token, user: authenticatedUser });
        setUser(authenticatedUser);
        setAuthState("authenticated");
      })
      .catch(() => {
        signOutAdmin();
        setAuthState("unauthenticated");
      });
  }, []);

  if (authState === "checking") {
    return <div className="min-h-screen bg-[#F3F0F8]" />;
  }

  if (authState === "unauthenticated") {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    signOutAdmin();
    navigate("/admin/login", { replace: true });
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
            <span className="text-xl">
              <img
                src={favicon}
                alt="Abrigo Lambeijos Logo"
                width={24}
                height={24}
              />
            </span>
            <div>
              <p className="font-bold text-white text-base leading-tight">
                Abrigo Lambeijos
              </p>
              <p className="text-[10px] text-[#78909C] uppercase tracking-widest">
                Painel Admin
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-hidden px-3 py-3 space-y-0.5">
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
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl p-1 text-left transition hover:bg-[#F5F1F8]"
            onClick={() => navigate("/admin/perfil")}
            title="Editar perfil"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-[#263238]">
                {user?.name || user?.email || "Administrador"}
              </p>
              <p className="text-[10px] text-[#78909C]">Administradora</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#4D246A] flex items-center justify-center text-white text-xs font-bold">
              AC
            </div>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
