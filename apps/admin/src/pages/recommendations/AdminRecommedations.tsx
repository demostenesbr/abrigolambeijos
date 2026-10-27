import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { apiErrorMessage, formatDate } from "../../utils/adminFormatters";

interface Recommendation {
  id: number;
  adopterId: number;
  animalId: number;
  recommendationText: string;
  createdAt: string;
}

export default function AdminRecommedations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setRecommendations(await api.get<Recommendation[]>("/recommendations"));
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { queueMicrotask(() => { void loadRecommendations(); }); }, []);

  const visible = useMemo(() => recommendations.filter((recommendation) =>
    `${recommendation.adopterId} ${recommendation.animalId} ${recommendation.recommendationText}`.toLowerCase().includes(query.toLowerCase()),
  ), [query, recommendations]);

  const removeRecommendation = async (id: number) => {
    if (!window.confirm("Remover esta recomendação?")) return;
    try {
      await api.delete(`/recommendations/${id}`);
      setRecommendations((current) => current.filter((recommendation) => recommendation.id !== id));
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    }
  };

  return <div className="space-y-6">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-widest text-[#F28C28]">Inteligência do abrigo</p><h1 className="mt-1 text-3xl font-black text-[#2F2140]">Recomendações</h1><p className="mt-1 max-w-2xl text-sm text-[#78909C]">Acompanhe os rankings gerados pelo modelo de compatibilidade adotante × animal.</p></div><a href="http://localhost:3000/recomendacao" target="_blank" rel="noreferrer" className="rounded-full border border-[#D8C8E2] px-5 py-3 text-center text-sm font-bold text-[#4D246A] hover:bg-[#F5F1F8]">Abrir experiência do adotante ↗</a></header>
    <div className="grid gap-4 sm:grid-cols-3"><Metric label="Recomendações geradas" value={recommendations.length} color="text-[#4D246A]" /><Metric label="Adotantes atendidos" value={new Set(recommendations.map((item) => item.adopterId)).size} color="text-[#F28C28]" /><Metric label="Animais indicados" value={new Set(recommendations.map((item) => item.animalId)).size} color="text-emerald-600" /></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm"><div className="border-b border-[#EEE7F1] p-4"><input aria-label="Buscar recomendações" placeholder="Buscar por adotante, animal ou texto..." className="w-full rounded-xl border border-[#E5DCEB] px-4 py-3 text-sm outline-none focus:border-[#4D246A] sm:max-w-lg" value={query} onChange={(event) => setQuery(event.target.value)} /></div>{loading ? <p className="p-8 text-sm text-[#78909C]">Carregando recomendações...</p> : visible.length === 0 ? <p className="p-8 text-center text-sm text-[#78909C]">Nenhuma recomendação encontrada.</p> : <div className="grid gap-4 p-4 md:grid-cols-2">{visible.map((recommendation) => <article key={recommendation.id} className="rounded-2xl border border-[#EEE7F1] p-5 hover:shadow-md"><div className="flex items-start justify-between gap-3"><span className="rounded-full bg-[#F1E8F6] px-3 py-1 text-xs font-bold text-[#4D246A]">#{recommendation.id}</span><span className="text-xs text-[#9A887D]">{formatDate(recommendation.createdAt)}</span></div><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl bg-[#FAF8FC] p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#78909C]">Adotante</p><p className="mt-1 font-black text-[#2F2140]">#{recommendation.adopterId}</p></div><div className="rounded-xl bg-[#FAF8FC] p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#78909C]">Animal</p><p className="mt-1 font-black text-[#2F2140]">#{recommendation.animalId}</p></div></div><p className="mt-4 text-sm leading-6 text-[#546E7A]">{recommendation.recommendationText}</p><button onClick={() => void removeRecommendation(recommendation.id)} className="mt-4 text-xs font-bold text-red-600 hover:underline">Remover registro</button></article>)}</div>}</section>
  </div>;
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) { return <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-[#78909C]">{label}</p><p className={`mt-2 text-3xl font-black ${color}`}>{value}</p></div>; }
