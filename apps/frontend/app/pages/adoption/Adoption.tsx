"use client";
import { useState } from "react";
import Image from "next/image";
/*import VaccinatedIcon from "./../../assets/vaccinated.png";
import NeuteredIcon from "./../../assets/castratated.png";
import MicrochippedIcon from "./../../assets/microchipped.png";
*/
type Tab = "adotar" | "perdidos" | "encontrados";

const allAnimals = [
  {
    id: 1,
    name: "Amendoim",
    breed: "Vira-lata caramelo",
    age: "2 anos",
    size: "medio",
    status: "adotar",
    city: "São Paulo, SP",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=420&fit=crop&auto=format",
    vaccinated: true,
    neutered: true,
    microchipped: true,
  },
  {
    id: 2,
    name: "Bolinha",
    breed: "Poodle mix",
    age: "3 anos",
    size: "pequeno",
    status: "adotar",
    city: "Campinas, SP",
    img: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=500&h=420&fit=crop&auto=format",
    vaccinated: true,
    neutered: true,
    microchipped: true,
  },
  {
    id: 3,
    name: "Rex",
    breed: "Pastor mix",
    age: "7 anos",
    size: "grande",
    status: "adotar",
    city: "São Bernardo, SP",
    img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&h=420&fit=crop&auto=format",
    vaccinated: true,
    neutered: false,
    microchipped: false,
  },
  {
    id: 4,
    name: "Pipoca",
    breed: "Shih-tzu mix",
    age: "1 ano",
    size: "pequeno",
    status: "adotar",
    city: "São Paulo, SP",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=420&fit=crop&auto=format",
    vaccinated: true,
    neutered: false,
    microchipped: true,
  },
  {
    id: 5,
    name: "Thor",
    breed: "Labrador mix",
    age: "4 anos",
    size: "grande",
    status: "perdido",
    city: "Guarulhos, SP",
    img: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&h=420&fit=crop&auto=format",
    vaccinated: true,
    neutered: true,
    microchipped: true,
  },
  {
    id: 6,
    name: "Duke",
    breed: "Beagle",
    age: "2 anos",
    size: "medio",
    status: "perdido",
    city: "Santo André, SP",
    img: "https://images.unsplash.com/photo-1612195583950-b8fd34c87093?w=500&h=420&fit=crop&auto=format",
    vaccinated: true,
    neutered: false,
    microchipped: false,
  },
  {
    id: 7,
    name: "Toby",
    breed: "Vira-lata",
    age: "5 anos",
    size: "medio",
    status: "encontrado",
    city: "Osasco, SP",
    img: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=500&h=420&fit=crop&auto=format",
    vaccinated: false,
    neutered: false,
    microchipped: false,
  },
  {
    id: 8,
    name: "Max",
    breed: "Rottweiler mix",
    age: "3 anos",
    size: "grande",
    status: "adotar",
    city: "São Paulo, SP",
    img: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=500&h=420&fit=crop&auto=format",
    vaccinated: true,
    neutered: true,
    microchipped: true,
  },
];

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

  const filtered = allAnimals.filter((a) => {
    if (a.status !== tab) return false;
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
                <Image
                  src={a.img}
                  alt={a.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={500}
                  height={420}
                  loading="eager"
                />
                <span
                  className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${statusLabels[a.status].color}`}
                >
                  {statusLabels[a.status].label}
                </span>
                <span className="absolute top-3 right-3 text-xs font-semibold bg-white/90 text-[#4D246A] px-2 py-1 rounded-full">
                  {sizeLabels[a.size]}
                </span>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="text-lg font-bold text-[#263238]">{a.name}</h3>
                  <span className="text-xs bg-[#EDE7F6] text-[#4D246A] px-2 py-0.5 rounded-full font-semibold">
                    {a.age}
                  </span>
                </div>
                <p className="text-xs text-[#546E7A] mb-1">{a.breed}</p>
                <p className="text-xs text-[#78909C] mb-3">📍 {a.city}</p>
                <div className="flex gap-2 mb-4 flex-wrap">
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
    </div>
  );
}
