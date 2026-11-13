"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { allAnimals, formatAge, type Animal } from "../../data/animals";
import { api } from "../../services/api";
import { authService, errorMessage } from "../../services/auth";
/*import VaccinatedIcon from "./../../assets/vaccinated.png";
import NeuteredIcon from "./../../assets/castratated.png";
import MicrochippedIcon from "./../../assets/microchipped.png";
*/
type Tab = "adotar" | "perdidos" | "encontrados";

const tabStatus = {
  adotar: "adotar",
  perdidos: "perdido",
  encontrados: "encontrado",
} as const;

const statusLabels: Record<string, { label: string; color: string }> = {
  adotar: { label: "Para adoção", color: "bg-[#43A047] text-white" },
  perdido: { label: "Perdido", color: "bg-[#D9534F] text-white" },
  encontrado: { label: "Encontrado", color: "bg-[#3A7CA5] text-white" },
};

const sizeLabels: Record<string, string> = {
  pequeno: "Pequeno",
  medio: "Médio",
  grande: "Grande",
};

export default function Adopt() {
  const [tab, setTab] = useState<Tab>("adotar");
  const [sizeFilter, setSizeFilter] = useState("todos");
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [requestForm, setRequestForm] = useState({
    phone: "",
    address: "",
    experience: "",
    home: "",
  });
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestFeedback, setRequestFeedback] = useState<{
    message: string;
    needsLogin?: boolean;
    success?: boolean;
  } | null>(null);

  const startAdoptionRequest = (animal: Animal) => {
    setRequestFeedback(null);
    if (!authService.getToken()) {
      setRequestFeedback({
        message: "Entre com uma conta de adotante para solicitar este animal.",
        needsLogin: true,
      });
      return;
    }
    if (authService.getUser()?.role !== "ADOPTER") {
      setRequestFeedback({
        message: "A solicitação de adoção está disponível para o perfil adotante.",
      });
      return;
    }
    if (!animal.rganimal) {
      setRequestFeedback({
        message: "Não foi possível identificar este cadastro no sistema. Tente novamente mais tarde.",
      });
      return;
    }
    setRequestForm({ phone: "", address: "", experience: "", home: "" });
    setSelectedAnimal(animal);
  };

  const submitAdoptionRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const animal = selectedAnimal;
    if (!animal?.rganimal) return;
    setSubmittingRequest(true);
    setRequestFeedback(null);
    try {
      await api.post("/adoption-requests/me", {
        animalReference: animal.rganimal,
        ...requestForm,
      });
      setSelectedAnimal(null);
      setRequestForm({ phone: "", address: "", experience: "", home: "" });
      setRequestFeedback({
        message: `Solicitação enviada para ${animal.name}. Ela ficará pendente até a análise do abrigo.`,
        success: true,
      });
    } catch (error) {
      setRequestFeedback({ message: errorMessage(error) });
    } finally {
      setSubmittingRequest(false);
    }
  };

  const filtered = allAnimals.filter((a) => {
    if (a.status !== tabStatus[tab]) return false;
    if (sizeFilter !== "todos" && a.size !== sizeFilter) return false;
    return true;
  });

  const tabs: { key: Tab; label: string; count: number }[] = [
    {
      key: "adotar",
      label: "Para Adoção",
      count: allAnimals.filter((a) => a.status === "adotar").length,
    },
    {
      key: "perdidos",
      label: "Animais Perdidos",
      count: allAnimals.filter((a) => a.status === "perdido").length,
    },
    {
      key: "encontrados",
      label: "Encontrados",
      count: allAnimals.filter((a) => a.status === "encontrado").length,
    },
  ];

  const tabActiveColors: Record<Tab, string> = {
    adotar: "bg-[#43A047] text-white",
    perdidos: "bg-[#D9534F] text-white",
    encontrados: "bg-[#3A7CA5] text-white",
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-[#4D246A] mb-3">
          Central de animais
        </p>
        <h1 className="text-5xl font-bold text-[#263238] mb-4">
          Encontre seu companheiro
        </h1>
        <p className="text-[#546E7A] max-w-lg leading-relaxed">
          Navegue pelos cães disponíveis para adoção, relate animais perdidos ou
          informe sobre encontrados.
        </p>
        {requestFeedback && (
          <p role={requestFeedback.success ? "status" : "alert"} className={`mt-4 max-w-2xl rounded-xl p-4 text-sm ${requestFeedback.success ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-900"}`}>
            {requestFeedback.message}{" "}
            {requestFeedback.needsLogin && <Link className="font-bold underline" href="/entrar">Entrar</Link>}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-[#EDE7F6] rounded-2xl p-1.5 w-fit flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t.key
                ? "bg-white text-[#263238] shadow-sm"
                : "text-[#546E7A] hover:text-[#263238]"
            }`}
          >
            {t.label}
            <span
              className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? tabActiveColors[t.key] : "bg-[#D1C4E9] text-[#546E7A]"}`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Size filter */}
      <div className="flex items-center gap-2 mb-10 flex-wrap">
        <label className="text-xs font-semibold text-[#546E7A] uppercase tracking-wider">
          Porte:
        </label>
        {["todos", "pequeno", "medio", "grande"].map((v) => (
          <button
            key={v}
            onClick={() => setSizeFilter(v)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
              sizeFilter === v
                ? "bg-[#4D246A] text-white border-[#4D246A]"
                : "border-[#D1C4E9] text-[#37474F] hover:border-[#4D246A]"
            }`}
          >
            {v === "todos" ? "Todos" : sizeLabels[v]}
          </button>
        ))}
      </div>

      {/* Report button */}
      {tab !== "adotar" && (
        <div className="mb-8 p-5 bg-white border border-[#D1C4E9] rounded-2xl flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-semibold text-[#263238]">
              {tab === "perdidos"
                ? "Perdeu seu animal?"
                : "Encontrou um animal?"}
            </p>
            <p className="text-sm text-[#546E7A]">
              Cadastre para nossa rede ajudar na busca.
            </p>
          </div>
          <button
            className={`font-semibold px-6 py-2.5 rounded-full transition-colors text-sm text-white ${
              tab === "perdidos"
                ? "bg-[#D9534F] hover:bg-[#C0392B]"
                : "bg-[#43A047] hover:bg-[#388E3C]"
            }`}
          >
            {tab === "perdidos"
              ? "Registrar animal perdido"
              : "Registrar animal encontrado"}
          </button>
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#78909C]">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-xl font-semibold">
            Nenhum animal encontrado com esses filtros.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#D1C4E9] hover:border-[#4D246A]/40 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-52 bg-[#EDE7F6] overflow-hidden">
                {a.img ? (
                  <Image
                    src={a.img}
                    alt={a.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    width={500}
                    height={420}
                    loading="eager"
                  />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center text-[#4D246A]/60"
                    role="img"
                    aria-label={`${a.name} (foto ainda não disponível)`}
                  >
                    <span className="text-6xl">🐶</span>
                    <span className="text-xs mt-2">Foto em breve</span>
                  </div>
                )}
                <span
                  className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${statusLabels[a.status].color}`}
                >
                  {statusLabels[a.status].label}
                </span>
                <span className="absolute top-3 right-3 text-xs font-semibold bg-white/90 text-[#4D246A] px-2 py-1 rounded-full">
                  {sizeLabels[a.size]}
                </span>
                {a.synthetic && (
                  <span
                    title="Registro sintético, gerado apenas para testes"
                    className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full"
                  >
                    <span aria-hidden="true">●</span> Dado sintético (teste)
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="text-lg font-bold text-[#263238]">{a.name}</h3>
                  <span className="text-xs bg-[#EDE7F6] text-[#4D246A] px-2 py-0.5 rounded-full font-semibold">
                    {formatAge(a)}
                  </span>
                </div>
                <p className="text-xs text-[#546E7A] mb-1">
                  {a.breed}
                  {a.gender ? ` · ${a.gender}` : ""}
                </p>
                {a.city && (
                  <p className="text-xs text-[#78909C] mb-1">📍 {a.city}</p>
                )}
                {a.details.length > 0 && (
                  <ul className="text-xs text-[#78909C] mb-3 list-disc pl-4 space-y-0.5">
                    {a.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                )}
                <div className="flex gap-2 mb-4 flex-wrap mt-3">
                  {a.vaccinated && (
                    <span className="text-xs bg-[#43A047]/10 text-[#43A047] px-2 py-2 rounded-full border border-[#43A047]/20">
                      {/*<Image
                        src={VaccinatedIcon}
                        alt="Cão Vacinado"
                        title="Cão Vacinado"
                        width={16}
                        height={16}
                        className="inline-block ml-1"
                      /> */} Vacinado
                    </span>
                  )}
                  {a.neutered && (
                    <span className="text-xs bg-[#43A047]/10 text-[#43A047] px-2 py-2 rounded-full border border-[#43A047]/20">
                      {/*<Image
                        src={NeuteredIcon}
                        alt="Cão Castrado"
                        title="Cão Castrado"
                        width={16}
                        height={16}
                        className="inline-block ml-1"
                      /> */}Castrado
                    </span>
                  )}
                  {a.microchipped && (
                    <span className="text-xs bg-[#43A047]/10 text-[#43A047] px-2 py-2 rounded-full border border-[#43A047]/20">
                      {/*<Image
                        src={MicrochippedIcon}
                        alt="Cão Microchipado"
                        title="Cão Microchipado"
                        width={16}
                        height={16}
                        className="inline-block ml-1"
                      /> */}Microchipado
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (a.status === "adotar") startAdoptionRequest(a);
                  }}
                  className={`w-full text-sm font-semibold py-2 rounded-full transition-colors text-white ${
                    a.status === "perdido"
                      ? "bg-[#D9534F] hover:bg-[#C0392B]"
                      : a.status === "encontrado"
                        ? "bg-[#43A047] hover:bg-[#388E3C]"
                        : "bg-[#F28C28] hover:bg-[#D97820]"
                  }`}
                >
                  {a.status === "adotar"
                    ? "Quero adotar"
                    : a.status === "perdido"
                      ? "Tenho informações"
                      : "É meu animal!"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAnimal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !submittingRequest) {
              setSelectedAnimal(null);
            }
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="adoption-request-title" className="my-8 w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#F28C28]">Solicitação de adoção</p>
                <h2 id="adoption-request-title" className="mt-1 text-2xl font-black text-[#2F2140]">{selectedAnimal.name}</h2>
                <p className="mt-2 text-sm text-[#78909C]">Seus dados de nome e e-mail virão da sua conta. O abrigo analisará o pedido.</p>
              </div>
              <button type="button" aria-label="Fechar" disabled={submittingRequest} onClick={() => setSelectedAnimal(null)} className="rounded-full px-3 py-1 text-xl text-[#78909C] hover:bg-[#F5F1F8]">×</button>
            </div>
            <form className="space-y-4" onSubmit={submitAdoptionRequest}>
              <label className="block text-sm font-semibold text-[#37474F]">Telefone
                <input required maxLength={30} value={requestForm.phone} onChange={(event) => setRequestForm((form) => ({ ...form, phone: event.target.value }))} className="mt-1 w-full rounded-xl border border-[#D1C4E9] px-3 py-2.5" />
              </label>
              <label className="block text-sm font-semibold text-[#37474F]">Endereço
                <input required maxLength={300} value={requestForm.address} onChange={(event) => setRequestForm((form) => ({ ...form, address: event.target.value }))} className="mt-1 w-full rounded-xl border border-[#D1C4E9] px-3 py-2.5" />
              </label>
              <label className="block text-sm font-semibold text-[#37474F]">Experiência com animais
                <textarea required maxLength={2000} rows={3} value={requestForm.experience} onChange={(event) => setRequestForm((form) => ({ ...form, experience: event.target.value }))} className="mt-1 w-full rounded-xl border border-[#D1C4E9] px-3 py-2.5" />
              </label>
              <label className="block text-sm font-semibold text-[#37474F]">Como é sua moradia e quem vive nela?
                <textarea required maxLength={2000} rows={3} value={requestForm.home} onChange={(event) => setRequestForm((form) => ({ ...form, home: event.target.value }))} className="mt-1 w-full rounded-xl border border-[#D1C4E9] px-3 py-2.5" />
              </label>
              {requestFeedback && !requestFeedback.success && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{requestFeedback.message}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" disabled={submittingRequest} onClick={() => setSelectedAnimal(null)} className="rounded-full border border-[#D1C4E9] px-5 py-2.5 text-sm font-semibold text-[#4D246A]">Cancelar</button>
                <button type="submit" disabled={submittingRequest} className="rounded-full bg-[#F28C28] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{submittingRequest ? "Enviando..." : "Enviar solicitação"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
