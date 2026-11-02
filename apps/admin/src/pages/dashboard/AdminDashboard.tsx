import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../../services/api";
import { getStoredUser } from "../../services/adminAuth";
import {
  apiErrorMessage,
  formatCurrency,
  formatDate,
  formatMonth,
  statusClass,
  statusLabel,
} from "../../utils/adminFormatters";

interface AdminOverview {
  pets: { total: number; thisMonth: number };
  adopters: { total: number; thisMonth: number };
  adoptionRequests: { pending: number; stale: number };
  adoptions: { completed: number; thisMonth: number };
  rescues: { total: number; thisMonth: number; active: number; inTreatment: number };
  recommendations: number;
  partners: { total: number; active: number };
  donations: {
    thisMonth: number;
    previousMonth: number;
    total: number;
    recurringThisMonth: number;
  };
  recentRequests: {
    id: number;
    userName: string;
    petName: string;
    requestDate: string;
    status: string;
  }[];
  recentRescues: {
    id: number;
    name: string;
    location: string;
    status: string;
    createdAt: string;
  }[];
  rescuesByMonth: { month: string; value: number }[];
}

const monthDelta = (count: number) => `+${count} este mês`;

function donationDelta(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? "Primeiras doações do período" : "Sem doações no mês anterior";
  const change = Math.round(((current - previous) / previous) * 100);
  return `${change >= 0 ? "+" : ""}${change}% vs mês anterior`;
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const user = getStoredUser();

  useEffect(() => {
    api
      .get<AdminOverview>("/stats/admin")
      .then(setData)
      .catch((requestError) => setError(apiErrorMessage(requestError)));
  }, []);

  const kpis = data
    ? [
        { label: "Pets cadastrados", value: data.pets.total.toLocaleString("pt-BR"), delta: monthDelta(data.pets.thisMonth), icon: "🐶", color: "bg-[#EDE7F6] text-[#4D246A]" },
        { label: "Adotantes cadastrados", value: data.adopters.total.toLocaleString("pt-BR"), delta: monthDelta(data.adopters.thisMonth), icon: "👤", color: "bg-[#FFF3E0] text-[#F28C28]" },
        { label: "Solicitações pendentes", value: data.adoptionRequests.pending.toLocaleString("pt-BR"), delta: `${data.adoptionRequests.stale} aguardando há +3 dias`, icon: "📋", color: "bg-[#FCE4EC] text-[#D9534F]" },
        { label: "Adoções realizadas", value: data.adoptions.completed.toLocaleString("pt-BR"), delta: monthDelta(data.adoptions.thisMonth), icon: "❤️", color: "bg-[#E8F5E9] text-[#43A047]" },
        { label: "Resgates registrados", value: data.rescues.total.toLocaleString("pt-BR"), delta: `${monthDelta(data.rescues.thisMonth)} · ${data.rescues.active} ativos (${data.rescues.inTreatment} em tratamento)`, icon: "🚑", color: "bg-[#E3F2FD] text-[#3A7CA5]" },
        { label: "Doações (mês)", value: formatCurrency(data.donations.thisMonth), delta: `${donationDelta(data.donations.thisMonth, data.donations.previousMonth)} · ${formatCurrency(data.donations.recurringThisMonth)} recorrentes`, icon: "💰", color: "bg-[#FFFDE7] text-[#F4C95D]" },
        { label: "Recomendações geradas (ML)", value: data.recommendations.toLocaleString("pt-BR"), delta: "Modelo de compatibilidade", icon: "🧠", color: "bg-[#EDE7F6] text-[#4D246A]" },
        { label: "Parceiros", value: data.partners.active.toLocaleString("pt-BR"), delta: `Ativos de ${data.partners.total} cadastrados`, icon: "🤝", color: "bg-[#E8F5E9] text-[#43A047]" },
        { label: "Total arrecadado", value: formatCurrency(data.donations.total), delta: "Desde o início", icon: "🏦", color: "bg-[#FFFDE7] text-[#F4C95D]" },
      ]
    : [];

  const maxRescues = Math.max(1, ...(data?.rescuesByMonth.map((item) => item.value) ?? [1]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#263238]">Visão Geral</h1>
        <p className="text-sm text-[#546E7A] mt-0.5">
          Bem-vindo{user?.name ? `, ${user.name}` : ""}. Aqui está o resumo de hoje.
        </p>
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!data && !error && <p className="text-sm text-[#78909C]">Carregando indicadores...</p>}

      {data && (
        <>
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
            <div className="bg-white rounded-2xl border border-[#E8E0F0] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-[#263238]">Solicitações recentes</h2>
                <Link to="/admin/solicitacoes" className="text-xs font-semibold text-[#4D246A] hover:underline underline-offset-4">
                  Ver todas →
                </Link>
              </div>
              {data.recentRequests.length === 0 ? (
                <p className="text-sm text-[#78909C]">Nenhuma solicitação registrada.</p>
              ) : (
                <div className="space-y-3">
                  {data.recentRequests.map((s) => (
                    <div key={s.id} className="flex items-center justify-between py-2.5 border-b border-[#F3F0F8] last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#78909C] w-14">#{s.id}</span>
                        <div>
                          <p className="text-sm font-semibold text-[#263238]">{s.userName}</p>
                          <p className="text-xs text-[#78909C]">🐶 {s.petName} · {formatDate(s.requestDate)}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClass(s.status)}`}>{statusLabel(s.status)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E0F0] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-[#263238]">Resgates recentes</h2>
                <Link to="/admin/resgates" className="text-xs font-semibold text-[#4D246A] hover:underline underline-offset-4">
                  Ver todos →
                </Link>
              </div>
              {data.recentRescues.length === 0 ? (
                <p className="text-sm text-[#78909C]">Nenhum resgate registrado.</p>
              ) : (
                <div className="space-y-3">
                  {data.recentRescues.map((r) => (
                    <div key={r.id} className="py-2.5 border-b border-[#F3F0F8] last:border-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-[#263238]">{r.name}</p>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClass(r.status)}`}>{statusLabel(r.status)}</span>
                      </div>
                      <p className="text-xs text-[#78909C]">📍 {r.location} · {formatDate(r.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-[#F3F0F8]">
                <p className="text-xs font-semibold text-[#78909C] uppercase tracking-wider mb-3">Resgates por mês</p>
                <div className="flex items-end gap-2 h-20">
                  {data.rescuesByMonth.map((item) => (
                    <div key={item.month} className="flex-1 h-full flex flex-col items-center justify-end gap-1">
                      <span className="text-[10px] text-[#78909C] font-semibold">{item.value}</span>
                      <div
                        className="w-full rounded-t-md bg-[#4D246A]/20 hover:bg-[#4D246A]/40 transition-colors"
                        style={{ height: `${(item.value / maxRescues) * 70}%`, minHeight: 2 }}
                      />
                      <span className="text-[9px] text-[#78909C] capitalize">{formatMonth(item.month)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="bg-white rounded-2xl border border-[#E8E0F0] p-6">
        <h2 className="font-bold text-[#263238] mb-4">Ações rápidas</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Cadastrar pet", to: "/admin/pets", color: "bg-[#4D246A] text-white hover:bg-[#3A1854]" },
            { label: "Registrar resgate", to: "/admin/resgates", color: "bg-[#D9534F] text-white hover:bg-[#C0392B]" },
            { label: "Ver doações", to: "/admin/doacoes", color: "bg-[#43A047] text-white hover:bg-[#388E3C]" },
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
