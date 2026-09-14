const menuByRole = {
  ADOPTER: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Minhas recomendações", href: "/dashboard/recomendacoes" },
    { label: "Minhas solicitações", href: "/dashboard/solicitacoes" },
    { label: "Meu perfil", href: "/dashboard/perfil" },
  ],

  PROTECTOR: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Meus animais", href: "/dashboard/animais" },
    { label: "Cadastrar animal", href: "/dashboard/animais/novo" },
    { label: "Solicitações", href: "/dashboard/solicitacoes" },
    { label: "Meu perfil", href: "/dashboard/perfil" },
  ],

  PARTNER: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Minha organização", href: "/dashboard/organizacao" },
    { label: "Participações", href: "/dashboard/participacoes" },
    { label: "Meu perfil", href: "/dashboard/perfil" },
  ],

  ADMIN: [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Usuários", href: "/admin/usuarios" },
    { label: "Animais", href: "/admin/animais" },
    { label: "Adoções", href: "/admin/adocoes" },
    { label: "Resgates", href: "/admin/resgates" },
    { label: "Parceiros", href: "/admin/parceiros" },
    { label: "Recomendações", href: "/admin/recomendacoes" },
  ],
};

export default function NavMenu({ role, onClose }: { role: string; onClose: () => void }) {
  const menuItems = menuByRole[role as keyof typeof menuByRole] || [];
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        {menuItems.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              onClick={onClose}
              className="text-white hover:text-gray-300"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
