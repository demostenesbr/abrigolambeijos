import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { apiErrorMessage } from "../../utils/adminFormatters";

interface Pet {
  id: number;
  name: string;
  animalname: string;
  rganimal: string;
  race: string;
  species: string;
  gender: string;
  size: string;
  estimatedchronologicalage: number;
  dateentry: string;
  petphoto?: string | null;
  energyLevel: string;
  temperament: string;
  sociability: string;
  exerciseNeed: string;
  apartmentAdaptability: string;
  childrenCompatibility: boolean;
  dogsCompatibility: boolean;
  catsCompatibility: boolean;
}

const initialForm = {
  animalname: "", rganimal: "", name: "", race: "", gender: "Male",
  size: "Medium", estimatedchronologicalage: "1", dateentry: new Date().toISOString().slice(0, 10),
  birthdate: new Date().toISOString().slice(0, 10), species: "Dog",
  energyLevel: "Medium", temperament: "Affectionate", sociability: "Medium",
  exerciseNeed: "Medium", apartmentAdaptability: "Medium",
};

export default function AdminPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPets = async () => {
    try { setLoading(true); setPets(await api.get<Pet[]>("/pets")); }
    catch (requestError) { setError(apiErrorMessage(requestError)); }
    finally { setLoading(false); }
  };
  useEffect(() => { queueMicrotask(() => { void loadPets(); }); }, []);

  const visible = useMemo(() => pets.filter((pet) => `${pet.name} ${pet.animalname} ${pet.race} ${pet.rganimal}`.toLowerCase().includes(query.toLowerCase())), [pets, query]);

  const createPet = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true); setError(null);
    try {
      const created = await api.post<Pet>("/pets", {
        ...form,
        estimatedchronologicalage: Number(form.estimatedchronologicalage),
        dateentry: new Date(`${form.dateentry}T12:00:00`).toISOString(),
        birthdate: new Date(`${form.birthdate}T12:00:00`).toISOString(),
        microchipped: false, castrated: false,
        coattypecoloration: "Não informado", predominantcoatcolor: "Não informado",
        signsanddistinctive: "Não informado",
        childrenCompatibility: false, dogsCompatibility: false, catsCompatibility: false,
      });
      setPets((current) => [created, ...current]); setForm(initialForm); setShowForm(false);
    } catch (requestError) { setError(apiErrorMessage(requestError)); }
    finally { setSaving(false); }
  };

  const removePet = async (id: number) => {
    if (!window.confirm("Remover este pet do catálogo?")) return;
    try { await api.delete(`/pets/${id}`); setPets((current) => current.filter((pet) => pet.id !== id)); }
    catch (requestError) { setError(apiErrorMessage(requestError)); }
  };

  return <div className="space-y-6">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-widest text-[#F28C28]">Catálogo e compatibilidade</p><h1 className="mt-1 text-3xl font-black text-[#2F2140]">Pets</h1><p className="mt-1 text-sm text-[#78909C]">Cadastre os animais e mantenha os atributos usados pelo modelo de recomendação.</p></div><button onClick={() => setShowForm((value) => !value)} className="rounded-full bg-[#F28C28] px-5 py-3 text-sm font-bold text-white hover:bg-[#D97820]">{showForm ? "Fechar cadastro" : "+ Novo pet"}</button></header>
    <div className="grid gap-4 sm:grid-cols-3"><Metric label="Animais cadastrados" value={pets.length} color="text-[#4D246A]" /><Metric label="Cães" value={pets.filter((pet) => pet.species === "Dog").length} color="text-[#F28C28]" /><Metric label="Gatos" value={pets.filter((pet) => pet.species === "Cat").length} color="text-emerald-600" /></div>
    {showForm && <form onSubmit={createPet} className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="mb-4 text-lg font-black text-[#2F2140]">Cadastrar pet</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{([["name", "Nome de exibição"], ["animalname", "Nome no registro"], ["rganimal", "RG do animal"], ["race", "Raça"]] as [keyof typeof form, string][]).map(([key, label]) => <input key={key} required placeholder={label} className="rounded-xl border p-3 text-sm" value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />)}<Select label="Espécie" value={form.species} onChange={(value) => setForm({ ...form, species: value })} options={[["Dog", "Cão"], ["Cat", "Gato"]]} /><Select label="Porte" value={form.size} onChange={(value) => setForm({ ...form, size: value })} options={[["Small", "Pequeno"], ["Medium", "Médio"], ["Large", "Grande"]]} /><label className="text-xs font-semibold text-[#78909C]">Idade (anos)<input required type="number" min="0" className="mt-1 w-full rounded-xl border p-3 text-sm" value={form.estimatedchronologicalage} onChange={(event) => setForm({ ...form, estimatedchronologicalage: event.target.value })} /></label><label className="text-xs font-semibold text-[#78909C]">Entrada<input required type="date" className="mt-1 w-full rounded-xl border p-3 text-sm" value={form.dateentry} onChange={(event) => setForm({ ...form, dateentry: event.target.value })} /></label><label className="text-xs font-semibold text-[#78909C]">Nascimento<input required type="date" className="mt-1 w-full rounded-xl border p-3 text-sm" value={form.birthdate} onChange={(event) => setForm({ ...form, birthdate: event.target.value })} /></label><Select label="Energia (ML)" value={form.energyLevel} onChange={(value) => setForm({ ...form, energyLevel: value })} options={["Low", "Medium", "High"].map((item) => [item, item])} /><Select label="Sociabilidade (ML)" value={form.sociability} onChange={(value) => setForm({ ...form, sociability: value })} options={["Low", "Medium", "High"].map((item) => [item, item])} /><Select label="Exercício (ML)" value={form.exerciseNeed} onChange={(value) => setForm({ ...form, exerciseNeed: value })} options={["Low", "Medium", "High"].map((item) => [item, item])} /><Select label="Adaptação (ML)" value={form.apartmentAdaptability} onChange={(value) => setForm({ ...form, apartmentAdaptability: value })} options={["Low", "Medium", "High"].map((item) => [item, item])} /></div><button disabled={saving} className="mt-5 rounded-xl bg-[#4D246A] px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{saving ? "Salvando..." : "Salvar pet"}</button></form>}
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm"><div className="border-b border-[#EEE7F1] p-4"><input aria-label="Buscar pets" placeholder="Buscar por nome, raça ou RG..." className="w-full rounded-xl border border-[#E5DCEB] px-4 py-3 text-sm outline-none focus:border-[#4D246A] sm:max-w-md" value={query} onChange={(event) => setQuery(event.target.value)} /></div>{loading ? <p className="p-8 text-sm text-[#78909C]">Carregando pets...</p> : visible.length === 0 ? <p className="p-8 text-center text-sm text-[#78909C]">Nenhum pet encontrado.</p> : <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">{visible.map((pet) => <article key={pet.id} className="rounded-2xl border border-[#EEE7F1] p-5 hover:shadow-md"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6EEE7] text-2xl">{pet.species === "Dog" ? "🐶" : "🐱"}</div><div><h2 className="font-black text-[#2F2140]">{pet.name}</h2><p className="text-xs text-[#78909C]">#{pet.id} · {pet.rganimal}</p></div></div><span className="rounded-full bg-[#F1E8F6] px-2 py-1 text-[10px] font-bold text-[#4D246A]">{pet.size}</span></div><div className="mt-4 grid grid-cols-2 gap-2 text-sm text-[#546E7A]"><p><strong>Raça:</strong> {pet.race}</p><p><strong>Idade:</strong> {pet.estimatedchronologicalage} anos</p><p><strong>Energia:</strong> {pet.energyLevel}</p><p><strong>Temperamento:</strong> {pet.temperament}</p></div><div className="mt-4 flex justify-end border-t border-[#F1ECF4] pt-3"><button onClick={() => void removePet(pet.id)} className="text-xs font-bold text-red-600 hover:underline">Remover</button></div></article>)}</div>}</section>
  </div>;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) { return <label className="text-xs font-semibold text-[#78909C]">{label}<select className="mt-1 w-full rounded-xl border bg-white p-3 text-sm text-[#263238]" value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>; }
function Metric({ label, value, color }: { label: string; value: number; color: string }) { return <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-[#78909C]">{label}</p><p className={`mt-2 text-3xl font-black ${color}`}>{value}</p></div>; }
