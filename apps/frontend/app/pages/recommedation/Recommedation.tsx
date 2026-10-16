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
  "w-full bg-white border border-[#D1C4E9] rounded-xl px-4 py-3 text-sm text-[#263238]";
const labelClass =
  "block text-xs font-semibold text-[#37474F] mb-1.5 uppercase tracking-wider";

export default function Recommendation() {
  const [form, setForm] = useState(initialForm);
  const [results, setResults] = useState<Result[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof initialForm>(
    key: K,
    value: (typeof initialForm)[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!authService.getToken()) {
      setError("Faça login para receber recomendações.");
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
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FFF8F0] px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-bold text-4xl text-[#263238] mb-2">
          Encontre seu companheiro
        </h1>
        <p className="text-sm text-[#546E7A] mb-8">
          Responda sobre o seu perfil e nosso modelo indica os animais mais
          compatíveis.{" "}
          <Link href="/entrar" className="text-[#4D246A] font-semibold underline">
            Entrar
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="home_type">Moradia</label>
            <select id="home_type" className={fieldClass} value={form.home_type}
              onChange={(e) => set("home_type", e.target.value)}>
              <option value="Apartment">Apartamento</option>
              <option value="House">Casa</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="dog_experience">Experiência com pets</label>
            <select id="dog_experience" className={fieldClass} value={form.dog_experience}
              onChange={(e) => set("dog_experience", e.target.value)}>
              <option value="Beginner">Iniciante</option>
              <option value="Intermediate">Intermediária</option>
              <option value="Experienced">Experiente</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="available_time">Tempo disponível</label>
            <select id="available_time" className={fieldClass} value={form.available_time}
              onChange={(e) => set("available_time", e.target.value)}>
              {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="activity_level">Nível de atividade</label>
            <select id="activity_level" className={fieldClass} value={form.activity_level}
              onChange={(e) => set("activity_level", e.target.value)}>
              {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="preferred_size">Porte preferido</label>
            <select id="preferred_size" className={fieldClass} value={form.preferred_size}
              onChange={(e) => set("preferred_size", e.target.value)}>
              <option value="Small">Pequeno</option>
              <option value="Medium">Médio</option>
              <option value="Large">Grande</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="preferred_age">Idade preferida</label>
            <select id="preferred_age" className={fieldClass} value={form.preferred_age}
              onChange={(e) => set("preferred_age", e.target.value)}>
              <option value="Filhote">Filhote</option>
              <option value="Adulto">Adulto</option>
              <option value="Idoso">Idoso</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-[#37474F]">
            <input type="checkbox" checked={form.has_yard}
              onChange={(e) => set("has_yard", e.target.checked)} />
            Tenho quintal
          </label>
          <label className="flex items-center gap-2 text-sm text-[#37474F]">
            <input type="checkbox" checked={form.has_children}
              onChange={(e) => set("has_children", e.target.checked)} />
            Tenho crianças em casa
          </label>
          {form.has_children && (
            <div>
              <label className={labelClass} htmlFor="children_age_group">Faixa etária</label>
              <select id="children_age_group" className={fieldClass}
                value={form.children_age_group}
                onChange={(e) => set("children_age_group", e.target.value)}>
                <option value="NOT_APPLICABLE">Selecione</option>
                <option value="CHILDREN_0_5">0 a 5 anos</option>
                <option value="CHILDREN_6_12">6 a 12 anos</option>
                <option value="CHILDREN_13_17">13 a 17 anos</option>
              </select>
            </div>
          )}
          <label className="flex items-center gap-2 text-sm text-[#37474F]">
            <input type="checkbox" checked={form.has_other_pets}
              onChange={(e) => set("has_other_pets", e.target.checked)} />
            Tenho outros animais
          </label>
          {form.has_other_pets && (
            <div>
              <label className={labelClass} htmlFor="other_pets_type">Tipo</label>
              <select id="other_pets_type" className={fieldClass}
                value={form.other_pets_type}
                onChange={(e) => set("other_pets_type", e.target.value)}>
                <option value="NONE">Selecione</option>
                <option value="DOG">Cães</option>
                <option value="CAT">Gatos</option>
              </select>
            </div>
          )}

          {error && (
            <p role="alert" className="sm:col-span-2 text-sm text-red-600">{error}</p>
          )}
          <button type="submit" disabled={loading}
            className="sm:col-span-2 bg-[#F28C28] text-white font-semibold py-3.5 rounded-full hover:bg-[#D97820] disabled:opacity-60">
            {loading ? "Analisando perfil..." : "Ver recomendações"}
          </button>
        </form>

        {results && (
          <ol className="mt-10 space-y-3">
            {results.map((r, i) => (
              <li key={r.petId}
                className="flex items-center justify-between bg-white border border-[#D1C4E9] rounded-xl px-5 py-4">
                <span className="text-[#263238] font-semibold">
                  {i + 1}. {r.name}{" "}
                  <span className="text-xs text-[#78909C]">
                    ({r.species === "Dog" ? "Cão" : "Gato"})
                  </span>
                </span>
                <span className="text-[#4D246A] font-bold">
                  {(r.score * 100).toFixed(0)}% compatível
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
