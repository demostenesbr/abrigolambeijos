import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { apiErrorMessage, formatDate } from "../../utils/adminFormatters";

interface Adoption {
  id: number;
  adopterId: number;
  animalId: number;
  adoptionDate: string;
  status: "in_progress" | "completed";
  createdAt: string;
}

type AdoptionFilter = "all" | "upcoming" | "completed";

export default function AdminAdoptions() {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [filter, setFilter] = useState<AdoptionFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Adoption[]>("/adoptions").then(setAdoptions).catch((requestError) => setError(apiErrorMessage(requestError))).finally(() => setLoading(false));
  }, []);

  const completed = adoptions.filter((adoption) => adoption.status === "completed");
  const upcoming = adoptions.filter((adoption) => adoption.status === "in_progress");
  const visible = useMemo(() => filter === "completed" ? completed : filter === "upcoming" ? upcoming : adoptions, [adoptions, completed, filter, upcoming]);

  const removeAdoption = async (id: number) => {
    if (!window.confirm("Remover este registro de adoção?")) return;
    try {
      await api.delete(`/adoptions/${id}`);
      setAdoptions((current) => current.filter((adoption) => adoption.id !== id));
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    }
  };

  const updateStatus = async (id: number, status: Adoption["status"]) => {
    try {
      const updated = await api.patch<Adoption>(`/adoptions/${id}`, { status });
      setAdoptions((current) => current.map((adoption) => adoption.id === id ? updated : adoption));
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    }
  };

  return <div className="space-y-6">
    <header><p className="text-xs font-bold uppercase tracking-widest text-[#F28C28]">Pós-aprovação</p><h1 className="mt-1 text-3xl font-black text-[#2F2140]">Adoções</h1><p className="mt-1 text-sm text-[#78909C]">Gerencie os vínculos em andamento e as adoções realizadas.</p></header>
    <div className="grid gap-4 sm:grid-cols-3"><Metric label="Em andamento" value={upcoming.length} color="text-amber-600" /><Metric label="Realizadas" value={completed.length} color="text-emerald-600" /><Metric label="Total de vínculos" value={adoptions.length} color="text-[#4D246A]" /></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm"><div className="flex flex-wrap gap-2 border-b border-[#EEE7F1] p-4">{([["all", "Todas"], ["upcoming", "Em andamento"], ["completed", "Realizadas"]] as [AdoptionFilter, string][]).map(([key, label]) => <button key={key} onClick={() => setFilter(key)} className={`rounded-full px-4 py-2 text-xs font-bold ${filter === key ? "bg-[#4D246A] text-white" : "bg-[#F5F1F8] text-[#6D5D78]"}`}>{label}</button>)}</div>{loading ? <p className="p-8 text-sm text-[#78909C]">Carregando adoções...</p> : visible.length === 0 ? <p className="p-8 text-center text-sm text-[#78909C]">Nenhuma adoção neste filtro.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-[#FAF8FC] text-xs uppercase tracking-wider text-[#78909C]"><tr><th className="px-5 py-4">Registro</th><th className="px-5 py-4">Adotante</th><th className="px-5 py-4">Animal</th><th className="px-5 py-4">Data</th><th className="px-5 py-4">Situação</th><th className="px-5 py-4" /></tr></thead><tbody className="divide-y divide-[#F1ECF4]">{visible.map((adoption) => { const isCompleted = adoption.status === "completed"; return <tr key={adoption.id} className="hover:bg-[#FCFAFD]"><td className="px-5 py-4 font-bold text-[#4D246A]">#{adoption.id}</td><td className="px-5 py-4 text-[#546E7A]">Adotante #{adoption.adopterId}</td><td className="px-5 py-4 text-[#546E7A]">Pet #{adoption.animalId}</td><td className="px-5 py-4 text-[#546E7A]">{formatDate(adoption.adoptionDate)}</td><td className="px-5 py-4"><select aria-label={`Status da adoção ${adoption.id}`} value={adoption.status} onChange={(event) => void updateStatus(adoption.id, event.target.value as Adoption["status"])} className={`rounded-full border-0 px-3 py-1 text-xs font-bold ${isCompleted ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}><option value="in_progress">Em andamento</option><option value="completed">Realizada</option></select></td><td className="px-5 py-4 text-right"><button onClick={() => void removeAdoption(adoption.id)} className="text-xs font-bold text-red-600 hover:underline">Remover</button></td></tr>; })}</tbody></table></div>}</section>
  </div>;
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) { return <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-[#78909C]">{label}</p><p className={`mt-2 text-3xl font-black ${color}`}>{value}</p></div>; }
