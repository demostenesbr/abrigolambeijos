import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { usePagedList } from "../../hooks/usePagedList";
import Pagination from "../../components/common/Pagination";
import { api } from "../../services/api";
import { apiErrorMessage, formatDate, statusClass, statusLabel } from "../../utils/adminFormatters";

interface Partner {
  id: number;
  name: string;
  type: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  description: string;
  location: string;
  status: "active" | "inactive";
  createdAt: string;
}

const emptyForm = {
  name: "",
  type: "",
  contact: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "Brasil",
  description: "",
};

const typeSuggestions = ["Veterinária", "Pet Shop", "Hospital Vet.", "Adestramento", "Farmácia", "Grooming"];

const fields: { key: keyof typeof emptyForm; label: string; type?: string; placeholder: string }[] = [
  { key: "name", label: "Nome da empresa", placeholder: "Ex: Clínica Veterinária..." },
  { key: "contact", label: "Pessoa de contato", placeholder: "Nome do responsável" },
  { key: "email", label: "E-mail de contato", type: "email", placeholder: "contato@empresa.com.br" },
  { key: "phone", label: "Telefone", type: "tel", placeholder: "(11) 9.0000-0000" },
  { key: "address", label: "Endereço", placeholder: "Rua, número" },
  { key: "city", label: "Cidade", placeholder: "Ex: São Paulo" },
  { key: "state", label: "Estado", placeholder: "Ex: SP" },
  { key: "country", label: "País", placeholder: "Brasil" },
  { key: "description", label: "Benefício oferecido", placeholder: "Ex: 20% de desconto em..." },
];

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Partner[]>("/partners")
      .then(setPartners)
      .catch((requestError) => setError(apiErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  const deferredSearch = useDeferredValue(search);
  const filtered = useMemo(() => {
    const term = deferredSearch.toLowerCase();
    return partners.filter((p) => `${p.name} ${p.type} ${p.city}`.toLowerCase().includes(term));
  }, [partners, deferredSearch]);
  const paged = usePagedList(filtered);

  const typeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const partner of partners) counts.set(partner.type, (counts.get(partner.type) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [partners]);

  const createPartner = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const created = await api.post<Partner>("/partners", {
        ...form,
        location: `${form.city}, ${form.state}`,
      });
      setPartners((current) => [created, ...current]);
      setForm(emptyForm);
      setShowForm(false);
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (partner: Partner) => {
    try {
      const updated = await api.patch<Partner>(`/partners/${partner.id}`, {
        status: partner.status === "active" ? "inactive" : "active",
      });
      setPartners((current) => current.map((item) => (item.id === partner.id ? updated : item)));
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    }
  };

  const removePartner = async (id: number) => {
    if (!window.confirm("Remover este parceiro?")) return;
    try {
      await api.delete(`/partners/${id}`);
      setPartners((current) => current.filter((partner) => partner.id !== id));
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    }
  };

  const inputClass = "w-full border border-[#D1C4E9] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4D246A] bg-[#F9F7FC]";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263238]">🤝 Parceiros</h1>
          <p className="text-sm text-[#546E7A]">
            {partners.length} parceiros cadastrados · {partners.filter((p) => p.status === "active").length} ativos
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#4D246A] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#3A1854] transition-colors"
        >
          + Novo parceiro
        </button>
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      {typeCounts.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {typeCounts.map(([type, count]) => (
            <div key={type} className="bg-white rounded-xl border border-[#E8E0F0] p-3 text-center">
              <p className="text-xl font-bold text-[#4D246A]">{count}</p>
              <p className="text-[10px] text-[#78909C] mt-0.5">{type}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E8E0F0] p-4">
        <input
          type="text"
          placeholder="Buscar por nome, tipo ou cidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#F3F0F8] border border-[#D1C4E9] rounded-xl px-4 py-2 text-sm text-[#263238] placeholder-[#78909C] focus:outline-none focus:border-[#4D246A]"
        />
      </div>

      {loading ? (
        <p className="text-sm text-[#78909C]">Carregando parceiros...</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-[#78909C]">Nenhum parceiro encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paged.pageItems.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-[#E8E0F0] p-5 hover:shadow-md hover:border-[#4D246A]/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-bold text-[#263238]">{p.name}</p>
                  <p className="text-xs text-[#78909C]">📍 {p.city}, {p.state}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EDE7F6] text-[#4D246A]">{p.type}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusClass(p.status)}`}>{statusLabel(p.status)}</span>
                </div>
              </div>

              <div className="space-y-1.5 mb-4 text-xs text-[#546E7A]">
                <p>👤 {p.contact}</p>
                <p>📧 {p.email}</p>
                <p>📞 {p.phone}</p>
                <p>📅 Parceiro desde {formatDate(p.createdAt)}</p>
              </div>

              <div className="bg-[#F9F7FC] rounded-xl px-3 py-2 mb-4">
                <p className="text-xs font-semibold text-[#4D246A]">Benefício oferecido</p>
                <p className="text-xs text-[#546E7A] mt-0.5">{p.description}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => void toggleStatus(p)}
                  className="flex-1 text-xs font-semibold py-2 rounded-full bg-[#EDE7F6] text-[#4D246A] hover:bg-[#4D246A] hover:text-white transition-colors"
                >
                  {p.status === "active" ? "Desativar" : "Ativar"}
                </button>
                <button
                  onClick={() => void removePartner(p.id)}
                  className="flex-1 text-xs font-semibold py-2 rounded-full bg-[#FCE4EC] text-[#D9534F] hover:bg-[#D9534F] hover:text-white transition-colors"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination page={paged.page} totalPages={paged.totalPages} total={paged.total} pageSize={paged.pageSize} onChange={paged.setPage} />

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <form onSubmit={createPartner} className="bg-white rounded-2xl border border-[#E8E0F0] w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#263238]">Novo parceiro</h2>
              <button type="button" onClick={() => setShowForm(false)} className="text-[#78909C] hover:text-[#263238] text-xl">×</button>
            </div>
            <div className="space-y-4">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-[#37474F] mb-1.5 uppercase tracking-wider">{f.label}</label>
                  <input
                    required
                    type={f.type ?? "text"}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={(event) => setForm({ ...form, [f.key]: event.target.value })}
                    className={inputClass}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-[#37474F] mb-1.5 uppercase tracking-wider">Tipo</label>
                <input
                  required
                  list="partner-types"
                  placeholder="Ex: Veterinária"
                  value={form.type}
                  onChange={(event) => setForm({ ...form, type: event.target.value })}
                  className={inputClass}
                />
                <datalist id="partner-types">
                  {[...new Set([...typeSuggestions, ...typeCounts.map(([type]) => type)])].map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-[#D1C4E9] text-[#546E7A] font-semibold py-2.5 rounded-full text-sm hover:bg-[#F3F0F8] transition-colors">Cancelar</button>
                <button disabled={saving} className="flex-1 bg-[#4D246A] text-white font-semibold py-2.5 rounded-full text-sm hover:bg-[#3A1854] transition-colors disabled:opacity-60">{saving ? "Salvando..." : "Cadastrar"}</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
