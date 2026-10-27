import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { apiErrorMessage } from "../../utils/adminFormatters";

interface Adopter {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: string;
}

export default function AdminAdopters() {
  const [adopters, setAdopters] = useState<Adopter[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAdopters = async () => {
    try {
      setLoading(true);
      setAdopters(await api.get<Adopter[]>("/adopters"));
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { queueMicrotask(() => { void loadAdopters(); }); }, []);

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return adopters.filter((adopter) =>
      `${adopter.name} ${adopter.email}`.toLowerCase().includes(term),
    );
  }, [adopters, query]);

  const createAdopter = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const created = await api.post<Adopter>("/adopters", form);
      setAdopters((current) => [created, ...current]);
      setForm({ name: "", email: "", phone: "" });
      setShowForm(false);
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const removeAdopter = async (id: number) => {
    if (!window.confirm("Remover este adotante?")) return;
    try {
      await api.delete(`/adopters/${id}`);
      setAdopters((current) => current.filter((adopter) => adopter.id !== id));
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-bold uppercase tracking-widest text-[#F28C28]">Relacionamento</p><h1 className="mt-1 text-3xl font-black text-[#2F2140]">Adotantes</h1><p className="mt-1 text-sm text-[#78909C]">Pessoas cadastradas para encontrar um novo companheiro.</p></div>
        <button onClick={() => setShowForm((value) => !value)} className="rounded-full bg-[#F28C28] px-5 py-3 text-sm font-bold text-white hover:bg-[#D97820]">{showForm ? "Fechar cadastro" : "+ Novo adotante"}</button>
      </header>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total de adotantes" value={adopters.length} color="text-[#4D246A]" />
        <Stat label="Com telefone" value={adopters.filter((item) => item.phone).length} color="text-emerald-600" />
        <Stat label="Encontrados" value={filtered.length} color="text-[#F28C28]" />
      </div>
      {showForm && <form onSubmit={createAdopter} className="grid gap-3 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-4">
        <input required placeholder="Nome completo" className="rounded-xl border p-3 text-sm" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input required type="email" placeholder="E-mail" className="rounded-xl border p-3 text-sm" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input placeholder="Telefone" className="rounded-xl border p-3 text-sm" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        <button disabled={saving} className="rounded-xl bg-[#4D246A] p-3 text-sm font-bold text-white disabled:opacity-60">{saving ? "Salvando..." : "Salvar"}</button>
      </form>}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-[#EEE7F1] p-4"><input aria-label="Buscar adotantes" placeholder="Buscar por nome ou e-mail..." className="w-full rounded-xl border border-[#E5DCEB] px-4 py-3 text-sm outline-none focus:border-[#4D246A] sm:max-w-sm" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        {loading ? <Loading /> : filtered.length === 0 ? <Empty text="Nenhum adotante encontrado." /> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-[#FAF8FC] text-xs uppercase tracking-wider text-[#78909C]"><tr><th className="px-5 py-4">Adotante</th><th className="px-5 py-4">Contato</th><th className="px-5 py-4">Cadastro</th><th className="px-5 py-4 text-right">Ações</th></tr></thead><tbody className="divide-y divide-[#F1ECF4]">{filtered.map((adopter) => <tr key={adopter.id} className="hover:bg-[#FCFAFD]"><td className="px-5 py-4"><p className="font-bold text-[#2F2140]">{adopter.name}</p><p className="text-xs text-[#78909C]">#{adopter.id}</p></td><td className="px-5 py-4 text-[#546E7A]">{adopter.email}<br />{adopter.phone ?? "Telefone não informado"}</td><td className="px-5 py-4 text-[#546E7A]">{new Date(adopter.createdAt).toLocaleDateString("pt-BR")}</td><td className="px-5 py-4 text-right"><button onClick={() => void removeAdopter(adopter.id)} className="text-xs font-bold text-red-600 hover:underline">Remover</button></td></tr>)}</tbody></table></div>}
      </section>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-[#78909C]">{label}</p><p className={`mt-2 text-3xl font-black ${color}`}>{value}</p></div>;
}
function Loading() { return <p className="p-8 text-sm text-[#78909C]">Carregando dados...</p>; }
function Empty({ text }: { text: string }) { return <p className="p-8 text-center text-sm text-[#78909C]">{text}</p>; }
