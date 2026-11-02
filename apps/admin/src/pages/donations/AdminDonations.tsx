import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { apiErrorMessage, formatCurrency, formatDate, formatMonth, statusClass } from "../../utils/adminFormatters";

interface Donation {
  id: number;
  donorName: string;
  amount: number;
  type: "one_time" | "monthly";
  method: "pix" | "card" | "boleto";
  plan: string | null;
  status: "confirmed" | "pending" | "refunded";
  createdAt: string;
}

const typeLabels = { one_time: "Única", monthly: "Mensal" } as const;
const methodLabels = { pix: "Pix", card: "Cartão", boleto: "Boleto" } as const;
const emptyForm = { donorName: "", amount: "", type: "one_time", method: "pix", plan: "" };

const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export default function AdminDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Donation[]>("/donations")
      .then(setDonations)
      .catch((requestError) => setError(apiErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  const metrics = useMemo(() => {
    const now = new Date();
    const currentKey = monthKey(now);
    const confirmed = donations.filter((item) => item.status === "confirmed");
    const total = confirmed.reduce((sum, item) => sum + item.amount, 0);
    const thisMonth = confirmed.filter((item) => monthKey(new Date(item.createdAt)) === currentKey);
    const series = Array.from({ length: 6 }, (_, index) => {
      const month = monthKey(new Date(now.getFullYear(), now.getMonth() - 5 + index, 1));
      const value = confirmed
        .filter((item) => monthKey(new Date(item.createdAt)) === month)
        .reduce((sum, item) => sum + item.amount, 0);
      return { month, value };
    });
    return {
      total,
      confirmedCount: confirmed.length,
      pendingCount: donations.filter((item) => item.status === "pending").length,
      monthTotal: thisMonth.reduce((sum, item) => sum + item.amount, 0),
      monthCount: thisMonth.length,
      recurringMonth: thisMonth
        .filter((item) => item.type === "monthly")
        .reduce((sum, item) => sum + item.amount, 0),
      donors: new Set(confirmed.map((item) => item.donorName.trim().toLowerCase())).size,
      average: confirmed.length ? total / confirmed.length : 0,
      series,
      maxValue: Math.max(1, ...series.map((item) => item.value)),
    };
  }, [donations]);

  const sorted = useMemo(
    () => [...donations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [donations],
  );

  const createDonation = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const created = await api.post<Donation>("/donations", {
        donorName: form.donorName.trim(),
        amount: Number(form.amount),
        type: form.type,
        method: form.method,
        ...(form.plan.trim() ? { plan: form.plan.trim() } : {}),
        status: "confirmed",
      });
      setDonations((current) => [created, ...current]);
      setForm(emptyForm);
      setShowForm(false);
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: number, status: Donation["status"]) => {
    try {
      const updated = await api.patch<Donation>(`/donations/${id}`, { status });
      setDonations((current) => current.map((item) => (item.id === id ? updated : item)));
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    }
  };

  const removeDonation = async (id: number) => {
    if (!window.confirm("Remover este registro de doação?")) return;
    try {
      await api.delete(`/donations/${id}`);
      setDonations((current) => current.filter((item) => item.id !== id));
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263238]">💰 Doações</h1>
          <p className="text-sm text-[#546E7A]">Controle financeiro das doações recebidas</p>
        </div>
        <button
          onClick={() => setShowForm((value) => !value)}
          className="bg-[#4D246A] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#3A1854] transition-colors"
        >
          {showForm ? "Fechar" : "+ Nova doação"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createDonation} className="grid gap-3 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-3">
          <input required placeholder="Nome do doador" className="rounded-xl border p-3 text-sm" value={form.donorName} onChange={(event) => setForm({ ...form, donorName: event.target.value })} />
          <input required type="number" min="0.01" step="0.01" placeholder="Valor (R$)" className="rounded-xl border p-3 text-sm" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} />
          <select className="rounded-xl border p-3 text-sm" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
            <option value="one_time">Doação única</option>
            <option value="monthly">Doação mensal</option>
          </select>
          <select className="rounded-xl border p-3 text-sm" value={form.method} onChange={(event) => setForm({ ...form, method: event.target.value })}>
            <option value="pix">Pix</option>
            <option value="card">Cartão</option>
            <option value="boleto">Boleto</option>
          </select>
          <input placeholder="Plano (opcional)" className="rounded-xl border p-3 text-sm" value={form.plan} onChange={(event) => setForm({ ...form, plan: event.target.value })} />
          <button disabled={saving} className="rounded-xl bg-[#4D246A] p-3 text-sm font-bold text-white disabled:opacity-60">{saving ? "Salvando..." : "Registrar doação"}</button>
        </form>
      )}

      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E8E0F0] p-5">
          <p className="text-xs font-semibold text-[#78909C] uppercase tracking-wider mb-2">Arrecadado no mês</p>
          <p className="text-3xl font-bold text-[#4D246A]">{formatCurrency(metrics.monthTotal)}</p>
          <p className="text-xs text-[#78909C] mt-1">{metrics.monthCount} doações · {formatCurrency(metrics.recurringMonth)} recorrentes</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8E0F0] p-5">
          <p className="text-xs font-semibold text-[#78909C] uppercase tracking-wider mb-2">Total desde o início</p>
          <p className="text-3xl font-bold text-[#43A047]">{formatCurrency(metrics.total)}</p>
          <p className="text-xs text-[#78909C] mt-1">{metrics.confirmedCount} confirmadas · {metrics.pendingCount} pendentes</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8E0F0] p-5">
          <p className="text-xs font-semibold text-[#78909C] uppercase tracking-wider mb-2">Doadores</p>
          <p className="text-3xl font-bold text-[#F28C28]">{metrics.donors}</p>
          <p className="text-xs text-[#78909C] mt-1">doadores distintos</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8E0F0] p-5">
          <p className="text-xs font-semibold text-[#78909C] uppercase tracking-wider mb-2">Doação média</p>
          <p className="text-3xl font-bold text-[#3A7CA5]">{formatCurrency(metrics.average)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E0F0] p-6">
        <p className="text-sm font-bold text-[#263238] mb-4">Arrecadação mensal (R$)</p>
        <div className="flex items-end gap-3 h-28">
          {metrics.series.map((item) => (
            <div key={item.month} className="flex-1 h-full flex flex-col items-center justify-end gap-1">
              <span className="text-[10px] text-[#78909C] font-semibold">
                {item.value >= 1000 ? `${(item.value / 1000).toFixed(1)}k` : item.value.toFixed(0)}
              </span>
              <div
                className="w-full rounded-t-lg bg-[#4D246A] hover:bg-[#F28C28] transition-colors cursor-default"
                style={{ height: `${(item.value / metrics.maxValue) * 70}%`, minHeight: 2 }}
              />
              <span className="text-[9px] text-[#78909C] capitalize">{formatMonth(item.month)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E0F0] overflow-hidden">
        {loading ? (
          <p className="p-8 text-sm text-[#78909C]">Carregando doações...</p>
        ) : sorted.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#78909C]">Nenhuma doação registrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F3F0F8] bg-[#F9F7FC]">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#78909C] uppercase tracking-wider">ID</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#78909C] uppercase tracking-wider">Doador</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#78909C] uppercase tracking-wider">Valor</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#78909C] uppercase tracking-wider">Tipo</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#78909C] uppercase tracking-wider">Método</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#78909C] uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#78909C] uppercase tracking-wider">Data</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((d) => (
                  <tr key={d.id} className="border-b border-[#F3F0F8] hover:bg-[#F9F7FC] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-[#78909C]">#{d.id}</td>
                    <td className="px-4 py-3.5 font-semibold text-[#263238]">{d.donorName}</td>
                    <td className="px-4 py-3.5 font-bold text-[#4D246A]">{formatCurrency(d.amount)}</td>
                    <td className="px-4 py-3.5 text-[#546E7A]">{typeLabels[d.type] ?? d.type}{d.plan ? ` · ${d.plan}` : ""}</td>
                    <td className="px-4 py-3.5 text-[#546E7A]">{methodLabels[d.method] ?? d.method}</td>
                    <td className="px-4 py-3.5">
                      <select
                        value={d.status}
                        onChange={(event) => void updateStatus(d.id, event.target.value as Donation["status"])}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 ${statusClass(d.status)}`}
                      >
                        <option value="confirmed">Confirmada</option>
                        <option value="pending">Pendente</option>
                        <option value="refunded">Estornada</option>
                      </select>
                    </td>
                    <td className="px-4 py-3.5 text-[#546E7A]">{formatDate(d.createdAt)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button onClick={() => void removeDonation(d.id)} className="text-xs font-bold text-red-600 hover:underline">Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
