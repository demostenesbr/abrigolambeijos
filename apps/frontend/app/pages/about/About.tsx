import Image from "next/image";

const team = [
  {
    name: "Ana Cristina Ferreira",
    role: "Fundadora & Diretora",
    years: "12 anos",
    img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Rodrigo Mendes",
    role: "Coordenador de Resgates",
    years: "7 anos",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Dra. Camila Souza",
    role: "Médica Veterinária",
    years: "5 anos",
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Lucas Andrade",
    role: "Tecnologia & Comunicação",
    years: "3 anos",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format",
  },
];

const timeline = [
  {
    year: "2014",
    event: "Fundação do Abrigo Lambeijos com 3 voluntárias e 12 animais acolhidos.",
  },
  {
    year: "2016",
    event:
      "Primeiro abrigo oficial inaugurado em São Paulo. 200 adoções realizadas.",
  },
  {
    year: "2018",
    event:
      "Parceria com 15 clínicas veterinárias. Programa de saúde preventiva lançado.",
  },
  {
    year: "2020",
    event: "Sistema digital de busca de animais perdidos. Cobertura estadual.",
  },
  {
    year: "2022",
    event:
      "3.000ª adoção realizada. Expansão para 3 cidades da Grande São Paulo.",
  },
  {
    year: "2024",
    event:
      "Rede com 87 parceiros, 50 voluntários ativos e 4.200 animais resgatados.",
  },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-80 md:h-96 overflow-hidden bg-[#1A1033]">
        <Image
          src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1400&h=600&fit=crop&auto=format"
          alt="Animais felizes"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          width={1400}
          height={600}
        />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#F28C28] mb-4">
              Nossa história
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-[#EDE7F6] leading-tight max-w-xl">
              12 anos cuidando de quem não tem voz
            </h1>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="font-bold text-4xl text-[#263238] mb-6">
            Nossa missão
          </h2>
          <p className="text-[#37474F] leading-relaxed text-lg mb-6">
            Resgatar, reabilitar e reintegrar animais em situação de risco à
            sociedade, promovendo adoções responsáveis e educando a comunidade
            sobre guarda consciente e bem-estar animal.
          </p>
          <p className="text-[#546E7A] leading-relaxed">
            Acreditamos que todo animal merece ser tratado com dignidade, amor e
            cuidados adequados — independentemente de raça, tamanho ou
            histórico. Somos movidos pela certeza de que uma sociedade mais
            justa com os animais é uma sociedade mais justa com todos.
          </p>
        </div>
        <div className="space-y-4">
          {[
            {
              title: "Visão",
              text: "Ser referência nacional em bem-estar animal, promovendo uma cultura de adoção responsável.",
              color: "text-[#4D246A]",
            },
            {
              title: "Valores",
              text: "Empatia, transparência, respeito pela vida, colaboração e inovação para o bem-estar animal.",
              color: "text-[#F28C28]",
            },
            {
              title: "Impacto",
              text: "Mais de 4.200 animais resgatados, 3.100 adoções e 87 parceiros ativos em toda a Grande SP.",
              color: "text-[#43A047]",
            },
          ].map((v) => (
            <div
              key={v.title}
              className="bg-white border border-[#D1C4E9] rounded-2xl p-6"
            >
              <h3 className={`font-semibold text-lg mb-2 ${v.color}`}>
                {v.title}
              </h3>
              <p className="text-sm text-[#546E7A] leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-[#EDE7F6] border-y border-[#D1C4E9] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#4D246A] mb-3">
              Jornada
            </p>
            <h2 className="font-bold text-4xl text-[#263238]">
              Nossa trajetória
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-24 top-0 bottom-0 w-px bg-[#D1C4E9]" />
            <div className="space-y-8">
              {timeline.map((t) => (
                <div key={t.year} className="flex items-start gap-6">
                  <div className="w-20 shrink-0 text-right font-bold text-[#4D246A] text-lg">
                    {t.year}
                  </div>
                  <div className="relative shrink-0">
                    <div className="w-3 h-3 rounded-full bg-[#F28C28] mt-1.5 relative z-10" />
                  </div>
                  <p className="text-[#37474F] leading-relaxed pt-0.5">
                    {t.event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#4D246A] mb-3">
            As pessoas
          </p>
          <h2 className="font-bold text-4xl text-[#263238]">
            Quem faz acontecer
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m) => (
            <div key={m.name} className="text-center group">
              <h3 className="font-semibold text-[#263238] mb-1">{m.name}</h3>
              <p className="text-sm text-[#4D246A] font-medium mb-1">
                {m.role}
              </p>
              <p className="text-xs text-[#78909C]">{m.years} no Abrigo Lambeijos</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
