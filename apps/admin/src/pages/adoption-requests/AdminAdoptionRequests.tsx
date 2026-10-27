import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { apiErrorMessage, formatDate, statusClass, statusLabel } from "../../utils/adminFormatters";

interface AdoptionRequest {
  id: number;
  petName: string;
  userName: string;
  email: string;
  phone: string;
  status: string;
  requestDate: string;
  experience: string;
  home: string;
}

const requestStatuses = ["pending", "approved", "rejected"];

export default function AdminAdoptionRequests() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setRequests(await api.get<AdoptionRequest[]>("/adoption-requests"));
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { queueMicrotask(() => { void loadRequests(); }); }, []);

  const visibleRequests = useMemo(
    () => filter === "all" ? requests : requests.filter((request) => request.status === filter),
    [filter, requests],
  );

  const updateStatus = async (id: number, status: string) => {
    try {
      const updated = await api.patch<AdoptionRequest>(`/adoption-requests/${id}`, { status });
      setRequests((current) => current.map((request) => request.id === id ? updated : request));
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    }
  };

  return (
    <div className="space-y-6">
      <header><p className="text-xs font-bold uppercase tracking-widest text-[#F28C28]">Fluxo de adoção</p><h1 className="mt-1 text-3xl font-black text-[#2F2140]">Solicitações de adoção</h1><p className="mt-1 text-sm text-[#78909C]">Analise os pedidos e acompanhe cada decisão do abrigo.</p></header>
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Pendentes" value={requests.filter((item) => item.status === "pending").length} tone="amber" />
        <Metric label="Aprovadas" value={requests.filter((item) => item.status === "approved").length} tone="green" />
        <Metric label="Total" value={requests.length} tone="purple" />
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-[#EEE7F1] p-4">
          {["all", ...requestStatuses].map((status) => <button key={status} onClick={() => setFilter(status)} className={`rounded-full px-4 py-2 text-xs font-bold ${filter === status ? "bg-[#4D246A] text-white" : "bg-[#F5F1F8] text-[#6D5D78]"}`}>{status === "all" ? "Todas" : statusLabel(status)}</button>)}
        </div>
        {loading ? <p className="p-8 text-sm text-[#78909C]">Carregando solicitações...</p> : visibleRequests.length === 0 ? <p className="p-8 text-center text-sm text-[#78909C]">Nenhuma solicitação neste filtro.</p> : <div className="grid gap-4 p-4 lg:grid-cols-2">{visibleRequests.map((request) => <article key={request.id} className="rounded-2xl border border-[#EEE7F1] p-5 transition hover:shadow-md"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold text-[#F28C28]">SOLICITAÇÃO #{request.id}</p><h2 className="mt-1 text-lg font-black text-[#2F2140]">{request.petName}</h2></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(request.status)}`}>{statusLabel(request.status)}</span></div><div className="mt-4 grid gap-2 text-sm text-[#546E7A] sm:grid-cols-2"><p><strong className="text-[#37474F]">Candidato:</strong> {request.userName}</p><p><strong className="text-[#37474F]">Data:</strong> {formatDate(request.requestDate)}</p><p><strong className="text-[#37474F]">E-mail:</strong> {request.email}</p><p><strong className="text-[#37474F]">Telefone:</strong> {request.phone}</p></div><p className="mt-4 line-clamp-2 text-sm text-[#78909C]">{request.home || request.experience}</p><div className="mt-5 flex flex-wrap gap-2 border-t border-[#F1ECF4] pt-4">{requestStatuses.filter((status) => status !== request.status).map((status) => <button key={status} onClick={() => void updateStatus(request.id, status)} className={`rounded-lg px-3 py-2 text-xs font-bold ${status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{status === "approved" ? "Aprovar" : "Recusar"}</button>)}</div></article>)}</div>}
      </section>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: string }) {
  const colors: Record<string, string> = { amber: "text-amber-600", green: "text-emerald-600", purple: "text-[#4D246A]" };
  return <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-[#78909C]">{label}</p><p className={`mt-2 text-3xl font-black ${colors[tone]}`}>{value}</p></div>;
}
