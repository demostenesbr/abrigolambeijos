import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { apiErrorMessage, formatDate } from "../../utils/adminFormatters";

interface Rescue {
  id: number;
  name: string;
  location: string;
  createdAt: string;
}

export default function AdminRescues() {
  const [rescues, setRescues] = useState<Rescue[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", location: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { queueMicrotask(() => { api.get<Rescue[]>("/rescues").then(setRescues).catch((requestError) => setError(apiErrorMessage(requestError))).finally(() => setLoading(false)); }); }, []);
  const visible = useMemo(() => rescues.filter((rescue) => `${rescue.name} ${rescue.location}`.toLowerCase().includes(query.toLowerCase())), [query, rescues]);

  const createRescue = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setError(null);
    try { const created = await api.post<Rescue>("/rescues", form); setRescues((current) => [created, ...current]); setForm({ name: "", location: "" }); setShowForm(false); }
    catch (requestError) { setError(apiErrorMessage(requestError)); }
    finally { setSaving(false); }
  };
  const removeRescue = async (id: number) => {
    if (!window.confirm("Remover este registro de resgate?")) return;
    try { await api.delete(`/rescues/${id}`); setRescues((current) => current.filter((rescue) => rescue.id !== id)); }
    catch (requestError) { setError(apiErrorMessage(requestError)); }
  };

  return <div className="space-y-6">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-widest text-[#F28C28]">Histórico de proteção</p><h1 className="mt-1 text-3xl font-black text-[#2F2140]">Resgates</h1><p className="mt-1 text-sm text-[#78909C]">Registre a origem e o local dos animais acolhidos pelo abrigo.</p></div><button onClick={() => setShowForm((value) => !value)} className="rounded-full bg-[#F28C28] px-5 py-3 text-sm font-bold text-white hover:bg-[#D97820]">{showForm ? "Fechar registro" : "+ Novo resgate"}</button></header>
    <div className="grid gap-4 sm:grid-cols-2"><Metric label="Resgates registrados" value={rescues.length} color="text-[#4D246A]" /><Metric label="Localidades alcançadas" value={new Set(rescues.map((rescue) => rescue.location)).size} color="text-[#F28C28]" /></div>
    {showForm && <form onSubmit={createRescue} className="grid gap-3 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-3"><input required placeholder="Nome ou identificação do resgate" className="rounded-xl border p-3 text-sm" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><input required placeholder="Localização" className="rounded-xl border p-3 text-sm" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /><button disabled={saving} className="rounded-xl bg-[#4D246A] p-3 text-sm font-bold text-white disabled:opacity-60">{saving ? "Salvando..." : "Salvar registro"}</button></form>}
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm"><div className="border-b border-[#EEE7F1] p-4"><input aria-label="Buscar resgates" placeholder="Buscar por nome ou local..." className="w-full rounded-xl border border-[#E5DCEB] px-4 py-3 text-sm outline-none focus:border-[#4D246A] sm:max-w-md" value={query} onChange={(event) => setQuery(event.target.value)} /></div>{loading ? <p className="p-8 text-sm text-[#78909C]">Carregando resgates...</p> : visible.length === 0 ? <p className="p-8 text-center text-sm text-[#78909C]">Nenhum resgate encontrado.</p> : <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">{visible.map((rescue) => <article key={rescue.id} className="rounded-2xl border border-[#EEE7F1] p-5 hover:shadow-md"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF1E3] text-xl">🚑</div><h2 className="mt-4 font-black text-[#2F2140]">{rescue.name}</h2><p className="mt-1 text-sm text-[#546E7A]">📍 {rescue.location}</p><p className="mt-4 text-xs text-[#78909C]">Registrado em {formatDate(rescue.createdAt)}</p><button onClick={() => void removeRescue(rescue.id)} className="mt-4 text-xs font-bold text-red-600 hover:underline">Remover registro</button></article>)}</div>}</section>
  </div>;
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) { return <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-[#78909C]">{label}</p><p className={`mt-2 text-3xl font-black ${color}`}>{value}</p></div>; }
