"use client";

import { usePublicStats } from "./usePublicStats";

export function AuthStats() {
  const s = usePublicStats();
  const items = [
    { n: s.rescued, l: "Resgatados" },
    { n: s.adoptions, l: "Adotados" },
    { n: s.partners, l: "Parceiros" },
  ];

  return (
    <div className="relative z-10 grid grid-cols-3 gap-4">
      {items.map((i) => (
        <div
          key={i.l}
          className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm"
        >
          <div className="font-bold text-[#F28C28] text-xl">{i.n}</div>
          <div className="text-xs text-[#78909C]">{i.l}</div>
        </div>
      ))}
    </div>
  );
}

export function HomeStats({ variant }: { variant: "hero" | "mobile" }) {
  const s = usePublicStats();
  const items = [
    { value: s.rescued, label: "Animais resgatados" },
    { value: s.adoptions, label: "Adoções realizadas" },
    { value: s.partners, label: "Parceiros ativos" },
    { value: s.raised, label: s.raisedLabel },
  ];

  if (variant === "hero") {
    return (
      <div className="hidden md:grid grid-cols-2 gap-4">
        {items.map((i) => (
          <div
            key={i.label}
            className="bg-[#EDE7F6]/10 backdrop-blur-sm border border-[#D1C4E9]/20 rounded-2xl p-6 text-center"
          >
            <div className="font-bold text-3xl text-[#F28C28] mb-1">
              {i.value}
            </div>
            <div className="text-xs text-[#78909C] font-medium">{i.label}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="md:hidden bg-[#1A1033] px-6 pb-10 grid grid-cols-2 gap-4">
      {items.map((i) => (
        <div key={i.label} className="bg-[#2D1B4E] rounded-xl p-4 text-center">
          <div className="font-bold text-2xl text-[#F28C28] mb-0.5">
            {i.value}
          </div>
          <div className="text-xs text-[#78909C]">{i.label}</div>
        </div>
      ))}
    </section>
  );
}
