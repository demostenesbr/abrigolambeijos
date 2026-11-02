"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { statsService, type PublicPartner } from "../../services/stats";

const typeIcons: Record<string, string> = {
  "Veterinária": "🩺",
  "Hospital Veterinário": "🏥",
  "Pet Shop": "🛍️",
  "Adestramento": "🎓",
  "Farmácia": "💊",
  "Grooming": "🛁",
};

const benefits = [
  {
    icon: "📢",
    title: "Visibilidade",
    desc: "Logo e perfil destacados em nosso site, app e redes sociais com +50k seguidores.",
  },
  {
    icon: "🤝",
    title: "Rede de apoio",
    desc: "Conexão com outras organizações, veterinários, ONGs e tutores engajados.",
  },
  {
    icon: "🌱",
    title: "Impacto real",
    desc: "Relatórios trimestrais com dados sobre animais impactados pela sua parceria.",
  },
  {
    icon: "🏆",
    title: "Certificação",
    desc: "Selo Abrigo Lambeijos de responsabilidade animal — reconhecido em todo o estado.",
  },
];

export default function Partners() {
  const [partners, setPartners] = useState<PublicPartner[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    statsService
      .getPartners()
      .then((data) => active && setPartners(data))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#4D246A] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#D1C4E9] mb-4">
            Rede de parceiros
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-5 leading-tight max-w-2xl">
            Juntos fazemos mais por cada animal
          </h1>
          <p className="text-[#D1C4E9] max-w-xl leading-relaxed text-lg">
            Nossa rede reúne clínicas, pet shops, hospitais e empresas que
            compartilham o compromisso com o bem-estar animal.
          </p>
        </div>
      </section>

      {/* Partners grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-bold text-4xl text-[#263238]">
            Nossos parceiros
          </h2>
          <span className="text-sm text-[#546E7A]">
            {partners ? `${partners.length} parceiros ativos` : ""}
          </span>
        </div>

        {partners === null || partners.length === 0 ? (
          <p className="text-center py-16 text-[#78909C]">
            {failed
              ? "Não foi possível carregar os parceiros agora."
              : partners
                ? "Em breve novos parceiros por aqui."
                : "Carregando parceiros..."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-[#D1C4E9] rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#4D246A]/30 transition-all"
              >
                <div
                  className="h-32 bg-[#EDE7F6] flex items-center justify-center text-5xl"
                  aria-hidden="true"
                >
                  {typeIcons[p.type] ?? "🤝"}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-[#263238]">
                      {p.name}
                    </h3>
                    <span className="text-xs bg-[#EDE7F6] text-[#4D246A] px-2 py-1 rounded-full shrink-0 ml-2 font-semibold">
                      {p.type}
                    </span>
                  </div>
                  <p className="text-xs text-[#78909C] mb-3">
                    📍 {p.city}, {p.state}
                  </p>
                  <p className="text-sm text-[#546E7A] leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why become a partner */}
      <section className="bg-[#EDE7F6] border-y border-[#D1C4E9] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#F28C28] mb-3">
              Por que se juntar
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#263238]">
              Vantagens de ser parceiro
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="text-center p-6 bg-white rounded-2xl border border-[#D1C4E9]"
              >
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="font-semibold text-lg text-[#263238] mb-2">
                  {b.title}
                </h3>
                <p className="text-sm text-[#546E7A] leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/contato"
              className="inline-block bg-[#F28C28] text-white font-semibold px-10 py-4 rounded-full hover:bg-[#D97820] transition-colors"
            >
              Quero ser parceiro
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
