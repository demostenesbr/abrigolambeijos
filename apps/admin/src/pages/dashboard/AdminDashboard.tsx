import { Link } from "react-router";

const kpis = [
  { label: "Pets cadastrados", value: "142", delta: "+8 este mês", icon: "🐶", color: "bg-[#EDE7F6] text-[#4D246A]" },
  { label: "Adotantes ativos", value: "389", delta: "+23 este mês", icon: "👤", color: "bg-[#FFF3E0] text-[#F28C28]" },
  { label: "Solicitações pendentes", value: "17", delta: "5 aguardando há +3 dias", icon: "📋", color: "bg-[#FCE4EC] text-[#D9534F]" },
  { label: "Adoções realizadas", value: "3.141", delta: "+14 este mês", icon: "❤️", color: "bg-[#E8F5E9] text-[#43A047]" },
  { label: "Resgates ativos", value: "29", delta: "6 em tratamento", icon: "🚑", color: "bg-[#E3F2FD] text-[#3A7CA5]" },
  { label: "Doações (mês)", value: "R$ 12.480", delta: "+18% vs mês anterior", icon: "💰", color: "bg-[#FFFDE7] text-[#F4C95D]" },
];

const recentSolicitations = [
  { id: "#1042", adotante: "Carlos Mendonça", pet: "Amendoim", data: "09/09/2026", status: "Pendente" },
  { id: "#1041", adotante: "Fernanda Lima", pet: "Rex", data: "08/09/2026", status: "Em análise" },
  { id: "#1040", adotante: "Juliana Ramos", pet: "Max", data: "07/09/2026", status: "Aprovado" },
  { id: "#1039", adotante: "Bruno Souza", pet: "Bolinha", data: "06/09/2026", status: "Aprovado" },
  { id: "#1038", adotante: "Mariana Costa", pet: "Thor", data: "05/09/2026", status: "Reprovado" },
];

const recentResgates = [
  { animal: "Sem nome (vira-lata)", local: "Av. Paulista, 1000", data: "10/09/2026", status: "Em triagem" },
  { animal: "Labrador fêmea", local: "R. Augusta, 450", data: "09/09/2026", status: "Em tratamento" },
  { animal: "Beagle macho", local: "Pq. Ibirapuera", data: "08/09/2026", status: "Recuperado" },
];

const statusColor: Record<string, string> = {
  Pendente: "bg-[#FFF3E0] text-[#F28C28]",
  "Em análise": "bg-[#E3F2FD] text-[#3A7CA5]",
  Aprovado: "bg-[#E8F5E9] text-[#43A047]",
  Reprovado: "bg-[#FCE4EC] text-[#D9534F]",
  "Em triagem": "bg-[#FFF3E0] text-[#F28C28]",
  "Em tratamento": "bg-[#E3F2FD] text-[#3A7CA5]",
  Recuperado: "bg-[#E8F5E9] text-[#43A047]",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#263238]">Visão Geral</h1>
        <p className="text-sm text-[#546E7A] mt-0.5">Bem-vinda, Ana Cristina. Aqui está o resumo de hoje.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-2xl border border-[#E8E0F0] p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-[#78909C] uppercase tracking-wider leading-tight max-w-[70%]">{k.label}</p>
              <span className={`text-xl w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${k.color}`}>{k.icon}</span>
            </div>
            <p className="text-2xl font-bold text-[#263238] mb-1">{k.value}</p>
            <p className="text-xs text-[#78909C]">{k.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent solicitations */}
        <div className="bg-white rounded-2xl border border-[#E8E0F0] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#263238]">Solicitações recentes</h2>
            <Link to="/admin/solicitacoes" className="text-xs font-semibold text-[#4D246A] hover:underline underline-offset-4">
              Ver todas →
            </Link>
          </div>
          <div className="space-y-3">
            {recentSolicitations.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2.5 border-b border-[#F3F0F8] last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#78909C] w-14">{s.id}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#263238]">{s.adotante}</p>
                    <p className="text-xs text-[#78909C]">🐶 {s.pet} · {s.data}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[s.status]}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent rescues */}
        <div className="bg-white rounded-2xl border border-[#E8E0F0] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#263238]">Resgates recentes</h2>
            <Link to="/admin/resgates" className="text-xs font-semibold text-[#4D246A] hover:underline underline-offset-4">
              Ver todos →
            </Link>
          </div>
          <div className="space-y-3">
            {recentResgates.map((r) => (
              <div key={r.animal} className="flex items-center justify-between py-2.5 border-b border-[#F3F0F8] last:border-0">
                <div>
                  <p className="text-sm font-semibold text-[#263238]">{r.animal}</p>
                  <p className="text-xs text-[#78909C]">📍 {r.local} · {r.data}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[r.status]}`}>{r.status}</span>
              </div>
            ))}
          </div>

          {/* Simple bar chart */}
          <div className="mt-6 pt-5 border-t border-[#F3F0F8]">
            <p className="text-xs font-semibold text-[#78909C] uppercase tracking-wider mb-3">Resgates por mês</p>
            <div className="flex items-end gap-2 h-16">
              {[12, 18, 9, 24, 16, 29].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-[#4D246A]/20 hover:bg-[#4D246A]/40 transition-colors"
                    style={{ height: `${(v / 29) * 100}%` }}
                  />
                  <span className="text-[9px] text-[#78909C]">{["A", "M", "J", "J", "A", "S"][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-[#E8E0F0] p-6">
        <h2 className="font-bold text-[#263238] mb-4">Ações rápidas</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Cadastrar pet", to: "/admin/pets", color: "bg-[#4D246A] text-white hover:bg-[#3A1854]" },
            { label: "Registrar resgate", to: "/admin/resgates", color: "bg-[#D9534F] text-white hover:bg-[#C0392B]" },
            { label: "Nova doação", to: "/admin/doacoes", color: "bg-[#43A047] text-white hover:bg-[#388E3C]" },
            { label: "Ver solicitações", to: "/admin/solicitacoes", color: "bg-[#F28C28] text-white hover:bg-[#D97820]" },
          ].map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${a.color}`}
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
