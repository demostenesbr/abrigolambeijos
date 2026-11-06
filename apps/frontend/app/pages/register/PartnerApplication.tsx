"use client";

import { useState } from "react";
import { api } from "../../services/api";
import { errorMessage } from "../../services/auth";

const initialForm = {
  name: "", type: "", contact: "", email: "", phone: "",
  address: "", city: "", state: "", country: "Brasil", description: "",
};

const fields: { key: keyof typeof initialForm; label: string; type?: string; maxLength: number }[] = [
  { key: "name", label: "Nome da empresa ou organização", maxLength: 150 },
  { key: "type", label: "Área de atuação", maxLength: 100 },
  { key: "contact", label: "Pessoa de contato", maxLength: 150 },
  { key: "email", label: "E-mail de contato", type: "email", maxLength: 254 },
  { key: "phone", label: "Telefone", type: "tel", maxLength: 30 },
  { key: "address", label: "Endereço", maxLength: 200 },
  { key: "city", label: "Cidade", maxLength: 100 },
  { key: "state", label: "Estado", maxLength: 100 },
  { key: "country", label: "País", maxLength: 100 },
  { key: "description", label: "Como deseja contribuir", maxLength: 1000 },
];

export default function PartnerApplication() {
  const [form, setForm] = useState(initialForm);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (Object.values(form).some((value) => !value.trim())) {
      setError("Preencha todos os campos da solicitação.");
      return;
    }
    setLoading(true);
    try {
      const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
      await api.post<{ message: string }>("/partners/applications", payload);
      setDone(true);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="rounded-2xl bg-[#E8F5E9] p-5 text-sm text-[#265D2C]">
        <h2 className="font-bold">Solicitação enviada</h2>
        <p className="mt-2">O abrigo poderá analisar os dados e entrar em contato. O envio não cria uma conta nem publica a parceria.</p>
      </div>
    );
  }

  const inputClass = "w-full bg-white border border-[#D1C4E9] rounded-xl px-4 py-3 text-[#263238] text-sm focus:outline-none focus:border-[#4D246A] focus:ring-2 focus:ring-[#4D246A]/20";

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm leading-6 text-[#546E7A]">
        Envie os dados para análise do abrigo. Esta solicitação não cria uma conta ou concede acesso de parceiro.
      </p>
      {fields.map((field) => (
        <label key={field.key} className="block text-xs font-semibold text-[#37474F]">
          <span className="mb-1.5 block uppercase tracking-wider">{field.label}</span>
          {field.key === "description" ? (
            <textarea required maxLength={field.maxLength} value={form[field.key]} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} className={inputClass} rows={3} />
          ) : (
            <input required type={field.type ?? "text"} maxLength={field.maxLength} value={form[field.key]} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} className={inputClass} />
          )}
        </label>
      ))}
      <label className="flex items-start gap-3 text-xs leading-relaxed text-[#546E7A]">
        <input type="checkbox" required checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-0.5 accent-[#4D246A]" />
        <span>Li e concordo com os <a href="/termos-de-uso" className="text-[#4D246A] underline">Termos de Uso</a> e a <a href="/politica-de-privacidade" className="text-[#4D246A] underline">Política de Privacidade</a>.</span>
      </label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="w-full rounded-full bg-[#F28C28] py-3.5 font-semibold text-white hover:bg-[#D97820] disabled:opacity-60">
        {loading ? "Enviando..." : "Enviar solicitação"}
      </button>
    </form>
  );
}
