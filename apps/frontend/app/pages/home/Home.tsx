import Link from "next/link";

const animals = [
  {
    id: 1,
    name: "Amendoim",
    type: "Cachorro",
    breed: "Vira-lata caramelo",
    age: "2 anos",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=500&fit=crop&auhref=format",
    tag: "Adoção",
    tagColor: "bg-[#43A047] text-white",
  },
  {
    id: 2,
    name: "Bolinha",
    type: "Cachorro",
    breed: "Poodle mix",
    age: "3 anos",
    img: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&h=500&fit=crop&auhref=format",
    tag: "Adoção",
    tagColor: "bg-[#43A047] text-white",
  },
  {
    id: 3,
    name: "Thor",
    type: "Cachorro",
    breed: "Labrador mix",
    age: "4 anos",
    img: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=500&fit=crop&auhref=format",
    tag: "Perdido",
    tagColor: "bg-[#D9534F] text-white",
  },
];

const stats = [
  { value: "4.200+", label: "Animais resgatados" },
  { value: "3.100+", label: "Adoções realizadas" },
  { value: "87", label: "Parceiros ativos" },
  { value: "12", label: "Anos de atuação" },
];

const healthTips = [
  {
    icon: "💉",
    title: "Vacinação em dia",
    desc: "Mantenha o calendário vacinal atualizado para prevenir doenças graves como raiva, cinomose e parvovirose.",
  },
  {
    icon: "🦷",
    title: "Saúde bucal",
    desc: "Escove os dentes do seu pet pelo menos 3x por semana. Problemas dentários podem afetar órgãos vitais.",
  },
  {
    icon: "🏃",
    title: "Exercício regular",
    desc: "Passeios diários e brincadeiras mantêm o peso ideal e reduzem ansiedade e comportamentos destrutivos.",
  },
  {
    icon: "🩺",
    title: "Check-up anual",
    desc: "Visitas anuais ao veterinário identificam problemas antes que se tornem sérios. Prevenção é o melhor remédio.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#1A1033]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1600&h=900&fit=crop&auhref=format')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1033]/95 via-[#1A1033]/70 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#F28C28] mb-6 bg-[#F28C28]/10 px-4 py-1.5 rounded-full border border-[#F28C28]/30">
              Resgates · Adoção · Saúde Animal
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-[#EDE7F6] mb-6">
              Toda vida merece{" "}
              <em className="text-[#F28C28] not-italic">amor</em>
              {" "}e um lar.
            </h1>
            <p className="text-[#78909C] text-lg leading-relaxed max-w-md mb-10">
              Somos uma rede de resgate, adoção e cuidado animal. Conectamos
              famílias a companheiros que precisam de uma segunda chance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/adotar"
                className="bg-[#F28C28] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#D97820] transition-all hover:shadow-lg hover:shadow-[#F28C28]/30 active:scale-95"
              >
                Quero Adotar
              </Link>
              <Link
                href="/doacoes"
                className="border border-[#D1C4E9]/40 text-[#EDE7F6] font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-all"
              >
                Fazer Doação
              </Link>
            </div>
          </div>

          {/* Floating stats card */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-[#EDE7F6]/10 backdrop-blur-sm border border-[#D1C4E9]/20 rounded-2xl p-6 text-center"
              >
                <div className="font-bold text-3xl text-[#F28C28] mb-1">
                  {s.value}
                </div>
                <div className="text-xs text-[#78909C] font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#546E7A]">
          <span className="text-xs tracking-widest uppercase">Explorar</span>
          <div className="w-px h-8 bg-[#546E7A] animate-pulse" />
        </div>
      </section>

      {/* Mobile stats */}
      <section className="md:hidden bg-[#1A1033] px-6 pb-10 grid grid-cols-2 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#2D1B4E] rounded-xl p-4 text-center">
            <div className="font-bold text-2xl text-[#F28C28] mb-0.5">{s.value}</div>
            <div className="text-xs text-[#78909C]">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Featured animals */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#4D246A] mb-3">Em destaque</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#263238]">
              Esperando por você
            </h2>
          </div>
          <Link href="/adotar" className="hidden md:block text-sm font-semibold text-[#F28C28] hover:underline underline-offset-4">
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {animals.map((a) => (
            <div
              key={a.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#D1C4E9] hover:border-[#4D246A]/40 hover:shadow-xl hover:shadow-[#4D246A]/10 transition-all duration-300"
            >
              <div className="relative h-64 bg-[#EDE7F6] overflow-hidden">
                <img
                  src={a.img}
                  alt={a.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${a.tagColor}`}>
                  {a.tag}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-xl text-[#263238]">{a.name}</h3>
                  <span className="text-xs bg-[#EDE7F6] text-[#4D246A] px-2 py-1 rounded-full font-semibold">{a.age}</span>
                </div>
                <p className="text-sm text-[#546E7A] mb-4">{a.breed}</p>
                <Link
                  href="/adotar"
                  className="block w-full text-center text-sm font-semibold bg-[#F28C28] text-white py-2.5 rounded-full hover:bg-[#D97820] transition-colors"
                >
                  {a.tag === "Perdido" ? "Ajudar a encontrar" : "Quero adotar"}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="md:hidden text-center mt-8">
          <Link href="/adotar" className="text-sm font-semibold text-[#F28C28] hover:underline underline-offset-4">
            Ver todos os animais →
          </Link>
        </div>
      </section>

      {/* Lost & Found Banner */}
      <section className="bg-[#4D246A] py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Perdeu ou encontrou um animal?
            </h2>
            <p className="text-[#D1C4E9] max-w-lg leading-relaxed">
              Nossa rede de busca conecta tutores e encontradores em toda a região.
              Cadastre imagens, localização e ajude a reunir famílias.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/adotar"
              className="bg-[#D9534F] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#C0392B] transition-colors text-sm text-center"
            >
              Perdi meu animal
            </Link>
            <Link
              href="/adotar"
              className="bg-[#43A047] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#388E3C] transition-colors text-sm text-center"
            >
              Encontrei um animal
            </Link>
          </div>
        </div>
      </section>

      {/* Health Tips */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#4D246A] mb-3">Saúde Animal</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#263238]">
            Cuide bem do seu pet
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {healthTips.map((tip) => (
            <div key={tip.title} className="bg-white border border-[#D1C4E9] rounded-2xl p-6 hover:border-[#4D246A]/40 hover:shadow-md transition-all">
              <div className="text-3xl mb-4">{tip.icon}</div>
              <h3 className="font-semibold text-lg text-[#263238] mb-2">{tip.title}</h3>
              <p className="text-sm text-[#546E7A] leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Donation CTA */}
      <section className="mx-6 mb-20 rounded-3xl overflow-hidden relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=1400&h=600&fit=crop&auhref=format')",
          }}
        />
        <div className="absolute inset-0 bg-[#1A1033]/85" />
        <div className="relative z-10 max-w-2xl mx-auto text-center py-20 px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#F28C28] mb-4">Faça a diferença</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#EDE7F6] mb-5 leading-tight">
            Sua doação salva vidas
          </h2>
          <p className="text-[#78909C] leading-relaxed mb-8">
            Com apenas R$ 30/mês você garante alimentação, vacinas e cuidados médicos
            para um animal em reabilitação.
          </p>
          <Link
            href="/doacoes"
            className="inline-block bg-[#F28C28] text-white font-semibold px-10 py-4 rounded-full hover:bg-[#D97820] transition-all hover:shadow-xl hover:shadow-[#F28C28]/40"
          >
            Quero Doar Agora
          </Link>
        </div>
      </section>
    </div>
  );
}
