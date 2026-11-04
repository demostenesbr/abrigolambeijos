import { memo, useCallback, useEffect, useState } from "react";
import { api } from "../../services/api";
import { apiErrorMessage } from "../../utils/adminFormatters";
import PetPhotoConverter from "../../components/pets/PetPhotoConverter";
import Pagination from "../../components/common/Pagination";

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
  birthdate: string;
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

interface PetsPage {
  items: Pet[];
  total: number;
  page: number;
  pages: number;
  summary: { dogs: number; small: number; medium: number; large: number };
}

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 300;

const photoUrls = import.meta.glob<string>("../../assets/pets/WEBP/*.webp", { eager: true, query: "?url", import: "default" });
const petPhotoUrl = (file?: string | null) => (file ? photoUrls[`../../assets/pets/WEBP/${file}`] : undefined);

const SIZE_PT: Record<string, string> = { Small: "Pequeno", Medium: "Médio", Large: "Grande" };
const LEVEL_PT: Record<string, string> = { Low: "Baixa", Medium: "Média", High: "Alta" };
const TEMPERAMENT_PT: Record<string, string> = { Affectionate: "Carinhoso", Calm: "Calmo", Independent: "Independente", Playful: "Brincalhão", Territorial: "Territorial" };
const GENDER_PT: Record<string, string> = { Male: "Macho", Female: "Fêmea", Macho: "Macho", "Fêmea": "Fêmea" };
const translate = (map: Record<string, string>, value: string) => map[value] ?? value;
const levelOptions: [string, string][] = Object.entries(LEVEL_PT);
const toDateInput = (value: string) => value.slice(0, 10);

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = () => ({
  animalname: "", rganimal: "", name: "", race: "", gender: "Macho",
  size: "Medium", estimatedchronologicalage: "1", dateentry: today(),
  birthdate: today(), species: "Dog",
  energyLevel: "Medium", temperament: "Affectionate", sociability: "Medium",
  exerciseNeed: "Medium", apartmentAdaptability: "Medium", petphoto: "",
});

type PetFormValues = ReturnType<typeof emptyForm>;

const formFromPet = (pet: Pet): PetFormValues => ({
  animalname: pet.animalname, rganimal: pet.rganimal, name: pet.name, race: pet.race,
  gender: translate(GENDER_PT, pet.gender), size: pet.size,
  estimatedchronologicalage: String(pet.estimatedchronologicalage),
  dateentry: toDateInput(pet.dateentry), birthdate: toDateInput(pet.birthdate),
  species: pet.species, energyLevel: pet.energyLevel, temperament: pet.temperament,
  sociability: pet.sociability, exerciseNeed: pet.exerciseNeed,
  apartmentAdaptability: pet.apartmentAdaptability, petphoto: "",
});

export default function AdminPets() {
  const [data, setData] = useState<PetsPage | null>(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
    if (query) params.set("q", query);

    queueMicrotask(() => setLoading(true));
    api
      .get<PetsPage>(`/pets?${params.toString()}`, controller.signal)
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(apiErrorMessage(requestError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [page, query, reloadKey]);

  const reload = useCallback(() => setReloadKey((value) => value + 1), []);

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditingPet(null);
  }, []);

  const startEdit = useCallback((pet: Pet) => {
    setError(null);
    setEditingPet(pet);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const savePet = useCallback(
    async (form: PetFormValues) => {
      setSaving(true);
      setError(null);
      const fields = {
        ...form,
        petphoto: form.petphoto || undefined,
        estimatedchronologicalage: Number(form.estimatedchronologicalage),
        dateentry: new Date(`${form.dateentry}T12:00:00`).toISOString(),
        birthdate: new Date(`${form.birthdate}T12:00:00`).toISOString(),
      };
      try {
        if (editingPet) {
          await api.patch<Pet>(`/pets/${editingPet.id}`, fields);
        } else {
          await api.post<Pet>("/pets", {
            ...fields,
            microchipped: false, castrated: false,
            coattypecoloration: "Não informado", predominantcoatcolor: "Não informado",
            signsanddistinctive: "Não informado",
            childrenCompatibility: false, dogsCompatibility: false, catsCompatibility: false,
          });
          setPage(1);
        }
        closeForm();
        reload();
      } catch (requestError) {
        setError(apiErrorMessage(requestError));
      } finally {
        setSaving(false);
      }
    },
    [editingPet, closeForm, reload],
  );

  const removePet = useCallback(
    async (id: number) => {
      if (!window.confirm("Remover este pet do catálogo?")) return;
      try {
        await api.delete(`/pets/${id}`);
        reload();
      } catch (requestError) {
        setError(apiErrorMessage(requestError));
      }
    },
    [reload],
  );

  const summary = data?.summary ?? { dogs: 0, small: 0, medium: 0, large: 0 };
  const pets = data?.items ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#F28C28]">Catálogo e compatibilidade</p>
          <h1 className="mt-1 text-3xl font-black text-[#2F2140]">Pets</h1>
          <p className="mt-1 text-sm text-[#78909C]">Cadastre os animais e mantenha os atributos usados pelo modelo de recomendação.</p>
        </div>
        <button
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
          className="rounded-full bg-[#F28C28] px-5 py-3 text-sm font-bold text-white hover:bg-[#D97820]"
        >
          {showForm ? "Fechar cadastro" : "+ Novo pet"}
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Total de cães" value={summary.dogs} color="text-[#4D246A]" />
        <Metric label="Pequenos" value={summary.small} color="text-[#F28C28]" />
        <Metric label="Médios" value={summary.medium} color="text-emerald-600" />
        <Metric label="Grandes" value={summary.large} color="text-sky-600" />
      </div>

      {showForm && (
        <PetForm
          key={editingPet?.id ?? "new"}
          editingPet={editingPet}
          saving={saving}
          onSubmit={savePet}
        />
      )}

      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-[#EEE7F1] p-4">
          <input
            aria-label="Buscar pets"
            placeholder="Buscar por nome, raça ou RG..."
            className="w-full rounded-xl border border-[#E5DCEB] px-4 py-3 text-sm outline-none focus:border-[#4D246A] sm:max-w-md"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>
        {loading && !data ? (
          <p className="p-8 text-sm text-[#78909C]">Carregando pets...</p>
        ) : pets.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#78909C]">Nenhum pet encontrado.</p>
        ) : (
          <div className={`grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3 ${loading ? "opacity-60" : ""}`}>
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} onEdit={startEdit} onRemove={removePet} />
            ))}
          </div>
        )}
        <Pagination page={page} totalPages={data?.pages ?? 1} total={data?.total ?? 0} pageSize={PAGE_SIZE} onChange={setPage} />
      </section>
    </div>
  );
}

// O estado do formulário fica isolado aqui: digitar não re-renderiza a lista de pets.
function PetForm({ editingPet, saving, onSubmit }: { editingPet: Pet | null; saving: boolean; onSubmit: (form: PetFormValues) => void }) {
  const [form, setForm] = useState<PetFormValues>(() => (editingPet ? formFromPet(editingPet) : emptyForm()));
  const set = (key: keyof PetFormValues) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  const textFields: [keyof PetFormValues, string][] = [
    ["name", "Nome de exibição"], ["animalname", "Nome no registro"], ["rganimal", "RG do animal"], ["race", "Raça"],
  ];

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!saving) onSubmit(form);
      }}
      className="rounded-2xl bg-white p-5 shadow-sm"
    >
      <h2 className="mb-4 text-lg font-black text-[#2F2140]">{editingPet ? `Editar pet #${editingPet.id}` : "Cadastrar pet"}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {textFields.map(([key, label]) => (
          <input key={key} required placeholder={label} className="rounded-xl border p-3 text-sm" value={form[key]} onChange={(event) => set(key)(event.target.value)} />
        ))}
        <Select label="Espécie" value={form.species} onChange={set("species")} options={[["Dog", "Cão"], ["Cat", "Gato"]]} />
        <Select label="Sexo" value={form.gender} onChange={set("gender")} options={[["Macho", "Macho"], ["Fêmea", "Fêmea"]]} />
        <Select label="Porte" value={form.size} onChange={set("size")} options={Object.entries(SIZE_PT)} />
        <label className="text-xs font-semibold text-[#78909C]">Idade (anos)
          <input required type="number" min="0" className="mt-1 w-full rounded-xl border p-3 text-sm" value={form.estimatedchronologicalage} onChange={(event) => set("estimatedchronologicalage")(event.target.value)} />
        </label>
        <label className="text-xs font-semibold text-[#78909C]">Entrada
          <input required type="date" className="mt-1 w-full rounded-xl border p-3 text-sm" value={form.dateentry} onChange={(event) => set("dateentry")(event.target.value)} />
        </label>
        <label className="text-xs font-semibold text-[#78909C]">Nascimento
          <input required type="date" className="mt-1 w-full rounded-xl border p-3 text-sm" value={form.birthdate} onChange={(event) => set("birthdate")(event.target.value)} />
        </label>
        <PetPhotoConverter onConverted={set("petphoto")} />
        <Select label="Energia (ML)" value={form.energyLevel} onChange={set("energyLevel")} options={levelOptions} />
        <Select label="Temperamento (ML)" value={form.temperament} onChange={set("temperament")} options={Object.entries(TEMPERAMENT_PT)} />
        <Select label="Sociabilidade (ML)" value={form.sociability} onChange={set("sociability")} options={levelOptions} />
        <Select label="Exercício (ML)" value={form.exerciseNeed} onChange={set("exerciseNeed")} options={levelOptions} />
        <Select label="Adaptação (ML)" value={form.apartmentAdaptability} onChange={set("apartmentAdaptability")} options={levelOptions} />
      </div>
      <button disabled={saving} className="mt-5 rounded-xl bg-[#4D246A] px-5 py-3 text-sm font-bold text-white disabled:opacity-60">
        {saving ? "Salvando..." : editingPet ? "Salvar alterações" : "Salvar pet"}
      </button>
    </form>
  );
}

const PetCard = memo(function PetCard({ pet, onEdit, onRemove }: { pet: Pet; onEdit: (pet: Pet) => void; onRemove: (id: number) => void }) {
  const photo = petPhotoUrl(pet.petphoto);
  return (
    <article className="rounded-2xl border border-[#EEE7F1] p-5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[#F6EEE7] text-2xl">
            {photo ? <img src={photo} alt={`Foto de ${pet.name}`} className="h-full w-full object-cover" loading="lazy" /> : pet.species === "Dog" ? "🐶" : "🐱"}
          </div>
          <div>
            <h2 className="font-black text-[#2F2140]">{pet.name}</h2>
            <p className="text-xs text-[#78909C]">#{pet.id} · {pet.rganimal}</p>
          </div>
        </div>
        <span className="rounded-full bg-[#F1E8F6] px-2 py-1 text-[10px] font-bold text-[#4D246A]">{translate(SIZE_PT, pet.size)}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-[#546E7A]">
        <p><strong>Raça:</strong> {pet.race}</p>
        <p><strong>Idade:</strong> {pet.estimatedchronologicalage} anos</p>
        <p><strong>Energia:</strong> {translate(LEVEL_PT, pet.energyLevel)}</p>
        <p><strong>Temperamento:</strong> {translate(TEMPERAMENT_PT, pet.temperament)}</p>
      </div>
      <div className="mt-4 flex justify-end gap-4 border-t border-[#F1ECF4] pt-3">
        <button onClick={() => onEdit(pet)} className="text-xs font-bold text-[#4D246A] hover:underline">Editar</button>
        <button onClick={() => void onRemove(pet.id)} className="text-xs font-bold text-red-600 hover:underline">Remover</button>
      </div>
    </article>
  );
});

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
  return (
    <label className="text-xs font-semibold text-[#78909C]">{label}
      <select className="mt-1 w-full rounded-xl border bg-white p-3 text-sm text-[#263238]" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#78909C]">{label}</p>
      <p className={`mt-2 text-3xl font-black ${color}`}>{value}</p>
    </div>
  );
}
