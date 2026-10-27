"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "../../services/api";
import { authService, errorMessage } from "../../services/auth";

interface Result {
  petId: number;
  name: string;
  species: string;
  score: number;
}

const LEVELS = [
  { value: "Low", label: "Baixo" },
  { value: "Medium", label: "Médio" },
  { value: "High", label: "Alto" },
];

const initialForm = {
  home_type: "Apartment",
  has_yard: false,
  has_children: false,
  children_age_group: "NOT_APPLICABLE",
  has_other_pets: false,
  other_pets_type: "NONE",
  dog_experience: "Beginner",
  available_time: "Medium",
  activity_level: "Medium",
  preferred_size: "Medium",
  preferred_age: "Adulto",
};

const fieldClass =
  "w-full rounded-2xl border border-[#E5D8CC] bg-white px-4 py-3 text-sm text-[#263238] shadow-sm outline-none transition focus:border-[#4D246A] focus:ring-4 focus:ring-[#4D246A]/10";
const labelClass =
  "mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#6D5D53]";

function repairEncoding(value: string) {
  let repaired = value;
  for (let attempt = 0; attempt < 2 && /[ÃÂâ]/.test(repaired); attempt += 1) {
    try {
      const bytes = Uint8Array.from(repaired, (character) =>
        character.charCodeAt(0) & 0xff,
      );
      const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      if (decoded === repaired) break;
      repaired = decoded;
    } catch {
      break;
    }
  }
  return repaired;
}

function speciesLabel(species: string) {
  const normalized = repairEncoding(species).toLowerCase();
  return normalized === "dog" || normalized === "cão" ? "Cão" : "Gato";
}

function scoreLabel(score: number) {
  return `${Math.round(score * 100)}%`;
}

export default function Recommendation() {
  const [form, setForm] = useState(initialForm);
  const [results, setResults] = useState<Result[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof initialForm>(
    key: K,
    value: (typeof initialForm)[K],
  ) => setForm((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!authService.getToken()) {
      setError("Faça login para receber recomendações personalizadas.");
      return;
    }

    setLoading(true);
    try {
      const profile = {
        ...form,
        children_age_group: form.has_children
          ? form.children_age_group
          : "NOT_APPLICABLE",
        other_pets_type: form.has_other_pets ? form.other_pets_type : "NONE",
      };
      const data = await api.post<{ results: Result[] }>("/recommendations/me", {
        profile,
        topN: 5,
      });
      setResults(data.results);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FFF9F3] text-[#263238]">
      <section className="relative overflow-hidden bg-[#24143F] px-6 pb-20 pt-14 text-white sm:px-10 lg:px-16">
        <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#F28C28]/20 blur-3xl" />
        <div className="absolute -bottom-36 left-1/3 h-72 w-72 rounded-full bg-[#8E5AAE]/30 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-3 text-sm text-[#DCCCE8]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg">
              ✨
            </span>
            Recomendação inteligente para adoção
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              O próximo amor da sua vida pode estar esperando por você.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#E8DDF0] sm:text-lg">
              Conte um pouco sobre a sua rotina. Cruzamos o seu perfil com as
              necessidades dos nossos animais para encontrar combinações mais
              felizes e duradouras.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-[#E8DDF0]">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
              01. Seu perfil
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
              02. Análise de compatibilidade
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
              03. Seus companheiros ideais
            </span>
          </div>
        </div>
      </section>

      <main className="relative mx-auto -mt-10 max-w-6xl px-6 pb-16 sm:px-10 lg:px-16">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#EADFD5] bg-white p-6 shadow-[0_20px_60px_rgba(54,34,25,0.12)] sm:p-10"
        >
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F28C28]">
                Seu estilo de vida
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#2F2140]">
                Vamos encontrar uma boa combinação
              </h2>
            </div>
            <p className="text-sm text-[#806F65]">Leva menos de 2 minutos</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[#4D246A]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F1E8F6]">
                  🏠
                </span>
                Sua casa
              </h3>
              <div>
                <label className={labelClass} htmlFor="home_type">Moradia</label>
                <select id="home_type" className={fieldClass} value={form.home_type} onChange={(event) => set("home_type", event.target.value)}>
                  <option value="Apartment">Apartamento</option>
                  <option value="House">Casa</option>
                </select>
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#EDE3DA] p-3 text-sm text-[#574940]">
                <input className="h-4 w-4 accent-[#F28C28]" type="checkbox" checked={form.has_yard} onChange={(event) => set("has_yard", event.target.checked)} />
                Tenho quintal
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#EDE3DA] p-3 text-sm text-[#574940]">
                <input className="h-4 w-4 accent-[#F28C28]" type="checkbox" checked={form.has_children} onChange={(event) => set("has_children", event.target.checked)} />
                Tenho crianças em casa
              </label>
              {form.has_children && (
                <div>
                  <label className={labelClass} htmlFor="children_age_group">Faixa etária</label>
                  <select id="children_age_group" className={fieldClass} value={form.children_age_group} onChange={(event) => set("children_age_group", event.target.value)}>
                    <option value="NOT_APPLICABLE">Selecione</option>
                    <option value="CHILDREN_0_5">0 a 5 anos</option>
                    <option value="CHILDREN_6_12">6 a 12 anos</option>
                    <option value="CHILDREN_13_17">13 a 17 anos</option>
                  </select>
                </div>
              )}
            </section>

            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[#4D246A]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F1E8F6]">
                  🐾
                </span>
                Sua rotina
              </h3>
              <div>
                <label className={labelClass} htmlFor="dog_experience">Experiência com pets</label>
                <select id="dog_experience" className={fieldClass} value={form.dog_experience} onChange={(event) => set("dog_experience", event.target.value)}>
                  <option value="Beginner">Iniciante</option>
                  <option value="Intermediate">Intermediária</option>
                  <option value="Experienced">Experiente</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="available_time">Tempo disponível</label>
                <select id="available_time" className={fieldClass} value={form.available_time} onChange={(event) => set("available_time", event.target.value)}>
                  {LEVELS.map((level) => <option key={level.value} value={level.value}>{level.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="activity_level">Nível de atividade</label>
                <select id="activity_level" className={fieldClass} value={form.activity_level} onChange={(event) => set("activity_level", event.target.value)}>
                  {LEVELS.map((level) => <option key={level.value} value={level.value}>{level.label}</option>)}
                </select>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[#4D246A]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F1E8F6]">
                  💛
                </span>
                Preferências
              </h3>
              <div>
                <label className={labelClass} htmlFor="preferred_size">Porte preferido</label>
                <select id="preferred_size" className={fieldClass} value={form.preferred_size} onChange={(event) => set("preferred_size", event.target.value)}>
                  <option value="Small">Pequeno</option>
                  <option value="Medium">Médio</option>
                  <option value="Large">Grande</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="preferred_age">Idade preferida</label>
                <select id="preferred_age" className={fieldClass} value={form.preferred_age} onChange={(event) => set("preferred_age", event.target.value)}>
                  <option value="Filhote">Filhote</option>
                  <option value="Adulto">Adulto</option>
                  <option value="Idoso">Idoso</option>
                </select>
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#EDE3DA] p-3 text-sm text-[#574940]">
                <input className="h-4 w-4 accent-[#F28C28]" type="checkbox" checked={form.has_other_pets} onChange={(event) => set("has_other_pets", event.target.checked)} />
                Tenho outros animais
              </label>
              {form.has_other_pets && (
                <div>
                  <label className={labelClass} htmlFor="other_pets_type">Tipo</label>
                  <select id="other_pets_type" className={fieldClass} value={form.other_pets_type} onChange={(event) => set("other_pets_type", event.target.value)}>
                    <option value="NONE">Selecione</option>
                    <option value="DOG">Cães</option>
                    <option value="CAT">Gatos</option>
                  </select>
                </div>
              )}
            </section>
          </div>

          {error && <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#F0E7DF] pt-6 sm:flex-row">
            <p className="text-xs leading-5 text-[#806F65]">
              Ainda não entrou? <Link href="/entrar" className="font-bold text-[#4D246A] underline underline-offset-2">Faça login</Link> para salvar sua busca.
            </p>
            <button type="submit" disabled={loading} className="w-full rounded-full bg-[#F28C28] px-8 py-3.5 font-bold text-white shadow-lg shadow-[#F28C28]/20 transition hover:bg-[#D97820] disabled:cursor-wait disabled:opacity-60 sm:w-auto">
              {loading ? "Analisando seu perfil..." : "Encontrar meus companheiros"}
            </button>
          </div>
        </form>

        {results && (
          <section aria-live="polite" className="mt-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F28C28]">Resultado da análise</p>
                <h2 className="mt-2 text-3xl font-black text-[#2F2140]">Encontramos conexões especiais</h2>
              </div>
              <span className="hidden rounded-full bg-[#F1E8F6] px-4 py-2 text-sm font-bold text-[#4D246A] sm:inline-flex">{results.length} sugestões</span>
            </div>
            {results.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#D8C8BC] bg-white p-10 text-center text-[#806F65]">
                Não encontramos uma combinação agora. Tente ajustar suas preferências.
              </div>
            ) : (
              <ol className="grid gap-4 md:grid-cols-2">
                {results.map((result, index) => {
                  const score = Math.max(0, Math.min(100, Math.round(result.score * 100)));
                  return (
                    <li key={result.petId} className="group flex items-center gap-4 rounded-3xl border border-[#EADFD5] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#F6EEE7] text-3xl">
                        {speciesLabel(result.species) === "Cão" ? "🐶" : "🐱"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-xs font-black text-[#F28C28]">0{index + 1}</span>
                          <h3 className="truncate text-lg font-black text-[#2F2140]">{repairEncoding(result.name)}</h3>
                        </div>
                        <p className="text-sm text-[#806F65]">{speciesLabel(result.species)} • Combina com o seu perfil</p>
                      </div>
                      <div className="text-right">
                        <strong className="block text-2xl font-black text-[#4D246A]">{scoreLabel(result.score)}</strong>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A887D]">compatível</span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
