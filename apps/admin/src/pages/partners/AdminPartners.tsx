import { useState } from "react";

const parceiros = [
  { id: 1, name: "Clínica Pata e Vida", type: "Veterinária", city: "São Paulo, SP", contact: "contato@pataevida.com.br", phone: "(11) 3211-4500", status: "Ativo", since: "Mar/2022", beneficio: "30% desc. em consultas" },
  { id: 2, name: "Ração Natural SP", type: "Pet Shop", city: "Campinas, SP", contact: "parceria@racaonatural.com.br", phone: "(19) 3344-5600", status: "Ativo", since: "Jun/2023", beneficio: "Doação mensal de ração" },
  { id: 3, name: "Pet Care Hospital", type: "Hospital Vet.", city: "São Paulo, SP", contact: "parcerias@petcare.com.br", phone: "(11) 4002-8922", status: "Ativo", since: "Jan/2021", beneficio: "Cirurgias a preço de custo" },
  { id: 4, name: "Espaço Animal", type: "Adestramento", city: "Guarulhos, SP", contact: "info@espacoanimal.com.br", phone: "(11) 2233-4455", status: "Ativo", since: "Set/2024", beneficio: "Treinamento gratuito para adotados" },
  { id: 5, name: "FarmaPet", type: "Farmácia", city: "Santo André, SP", contact: "farma@farmapet.com.br", phone: "(11) 4321-9876", status: "Inativo", since: "Nov/2022", beneficio: "40% desc. em medicamentos" },
  { id: 6, name: "Banho & Tosa Premium", type: "Grooming", city: "São Paulo, SP", contact: "agenda@banhotosa.com.br", phone: "(11) 9.7788-9900", status: "Ativo", since: "Abr/2025", beneficio: "Banho solidário mensal" },
];

const statusColor: Record<string, string> = {
  Ativo: "bg-[#E8F5E9] text-[#43A047]",
  Inativo: "bg-[#FCE4EC] text-[#D9534F]",
  Pendente: "bg-[#FFF3E0] text-[#F28C28]",
};

const typeColor: Record<string, string> = {
  "Veterinária": "bg-[#E3F2FD] text-[#3A7CA5]",
  "Pet Shop": "bg-[#EDE7F6] text-[#4D246A]",
  "Hospital Vet.": "bg-[#FCE4EC] text-[#D9534F]",
  "Adestramento": "bg-[#FFF3E0] text-[#F28C28]",
  "Farmácia": "bg-[#E8F5E9] text-[#43A047]",
  "Grooming": "bg-[#FFFDE7] text-[#F4C95D]",
};

export default function AdminPartners() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = parceiros.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase())
  );

  const ativos = parceiros.filter((p) => p.status === "Ativo").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263238]">🤝 Parceiros</h1>
          <p className="text-sm text-[#546E7A]">{ativos} parceiros ativos de {parceiros.length} cadastrados</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#4D246A] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#3A1854] transition-colors"
        >
          + Novo parceiro
        </button>
      </div>

      {/* Type breakdown */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {["Veterinária", "Pet Shop", "Hospital Vet.", "Adestramento", "Farmácia", "Grooming"].map((t) => {
          const count = parceiros.filter((p) => p.type === t).length;
          return (
            <div key={t} className="bg-white rounded-xl border border-[#E8E0F0] p-3 text-center">
              <p className="text-xl font-bold text-[#4D246A]">{count}</p>
              <p className="text-[10px] text-[#78909C] mt-0.5">{t}</p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-[#E8E0F0] p-4">
        <input
          type="text"
          placeholder="Buscar por nome, tipo ou cidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#F3F0F8] border border-[#D1C4E9] rounded-xl px-4 py-2 text-sm text-[#263238] placeholder-[#78909C] focus:outline-none focus:border-[#4D246A]"
        />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-[#E8E0F0] p-5 hover:shadow-md hover:border-[#4D246A]/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="font-bold text-[#263238]">{p.name}</p>
                <p className="text-xs text-[#78909C]">📍 {p.city}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColor[p.status]}`}>{p.status}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColor[p.type] || "bg-[#F3F0F8] text-[#546E7A]"}`}>{p.type}</span>
              </div>
            </div>

            <div className="space-y-1.5 mb-4 text-xs text-[#546E7A]">
              <p>📧 {p.contact}</p>
              <p>📞 {p.phone}</p>
              <p>📅 Parceiro desde {p.since}</p>
            </div>

            <div className="bg-[#F9F7FC] rounded-xl px-3 py-2 mb-4">
              <p className="text-xs font-semibold text-[#4D246A]">Benefício oferecido</p>
              <p className="text-xs text-[#546E7A] mt-0.5">{p.beneficio}</p>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 text-xs font-semibold border border-[#D1C4E9] text-[#546E7A] py-2 rounded-full hover:bg-[#F3F0F8] transition-colors">
                Editar
              </button>
              <button className={`flex-1 text-xs font-semibold py-2 rounded-full transition-colors ${
                p.status === "Ativo"
                  ? "bg-[#FCE4EC] text-[#D9534F] hover:bg-[#D9534F] hover:text-white"
                  : "bg-[#E8F5E9] text-[#43A047] hover:bg-[#43A047] hover:text-white"
              }`}>
                {p.status === "Ativo" ? "Desativar" : "Reativar"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-[#E8E0F0] w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#263238]">Novo parceiro</h2>
              <button onClick={() => setShowForm(false)} className="text-[#78909C] hover:text-[#263238] text-xl">×</button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Nome da empresa", placeholder: "Ex: Clínica Veterinária...", type: "text" },
                { label: "E-mail de contato", placeholder: "contato@empresa.com.br", type: "email" },
                { label: "Telefone", placeholder: "(11) 9.0000-0000", type: "tel" },
                { label: "Cidade", placeholder: "Ex: São Paulo, SP", type: "text" },
                { label: "Benefício oferecido", placeholder: "Ex: 20% de desconto em...", type: "text" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-[#37474F] mb-1.5 uppercase tracking-wider">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} className="w-full border border-[#D1C4E9] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4D246A] bg-[#F9F7FC]" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-[#37474F] mb-1.5 uppercase tracking-wider">Tipo</label>
                <select className="w-full border border-[#D1C4E9] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4D246A] bg-[#F9F7FC]">
                  {["Veterinária", "Pet Shop", "Hospital Vet.", "Adestramento", "Farmácia", "Grooming", "Outro"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-[#D1C4E9] text-[#546E7A] font-semibold py-2.5 rounded-full text-sm hover:bg-[#F3F0F8] transition-colors">Cancelar</button>
                <button onClick={() => setShowForm(false)} className="flex-1 bg-[#4D246A] text-white font-semibold py-2.5 rounded-full text-sm hover:bg-[#3A1854] transition-colors">Cadastrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
