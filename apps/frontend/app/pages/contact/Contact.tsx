"use client";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const subjects = [
    "Quero adotar um animal",
    "Perdi meu animal",
    "Encontrei um animal",
    "Quero ser voluntário",
    "Quero ser parceiro",
    "Doação",
    "Outro assunto",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputClass =
    "w-full bg-white border border-[#D1C4E9] rounded-xl px-4 py-3 text-[#263238] text-sm placeholder-[#78909C] focus:outline-none focus:border-[#4D246A] focus:ring-2 focus:ring-[#4D246A]/20 transition-all";

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-[#4D246A] mb-3">Fale conosco</p>
        <h1 className="font-bold text-5xl text-[#263238] mb-4">Entre em contato</h1>
        <p className="text-[#546E7A] max-w-lg leading-relaxed">
          Nossa equipe responde em até 24 horas úteis. Para emergências com animais, ligue diretamente.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        {/* Contact info */}
        <div className="space-y-8">
          {[
            { icon: "📞", title: "Telefone", info: "(11) 3456-7890", sub: "Seg–Sex, 8h–18h" },
            { icon: "🆘", title: "Emergências", info: "(11) 9.8765-4321", sub: "24 horas, 7 dias" },
            { icon: "📧", title: "E-mail", info: "contato@larfeliz.org.br", sub: "Resposta em até 24h" },
            { icon: "📍", title: "Endereço", info: "Rua dos Pinheiros, 142", sub: "São Paulo, SP — 05422-000" },
          ].map((c) => (
            <div key={c.title} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#EDE7F6] flex items-center justify-center text-lg shrink-0">
                {c.icon}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#78909C] mb-0.5">{c.title}</p>
                <p className="font-semibold text-[#263238] text-sm">{c.info}</p>
                <p className="text-xs text-[#78909C]">{c.sub}</p>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-[#D1C4E9]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#78909C] mb-3">Redes sociais</p>
            <div className="flex gap-3">
              {[
                { label: "Instagram", handle: "@larfelizsp" },
                { label: "Facebook", handle: "/larfeliz" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className="flex-1 text-center p-3 bg-white border border-[#D1C4E9] rounded-xl hover:border-[#4D246A] hover:text-[#4D246A] transition-all text-xs font-semibold text-[#37474F]"
                >
                  <div>{s.label}</div>
                  <div className="text-[#78909C] font-normal mt-0.5">{s.handle}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 bg-white border border-[#D1C4E9] rounded-2xl px-8">
              <div className="text-6xl mb-6">🐾</div>
              <h2 className="font-bold text-3xl text-[#263238] mb-3">Mensagem enviada!</h2>
              <p className="text-[#546E7A] mb-6 max-w-sm leading-relaxed">
                Obrigado por entrar em contato. Nossa equipe responderá em breve.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="bg-[#F28C28] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#D97820] transition-colors"
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-[#D1C4E9] rounded-2xl p-8">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#37474F] mb-1.5 uppercase tracking-wider">Nome</label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#37474F] mb-1.5 uppercase tracking-wider">E-mail</label>
                  <input
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#37474F] mb-1.5 uppercase tracking-wider">Assunto</label>
                <select
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Selecione um assunto</option>
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#37474F] mb-1.5 uppercase tracking-wider">Mensagem</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Como podemos ajudar?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#F28C28] text-white font-semibold py-3.5 rounded-full hover:bg-[#D97820] transition-colors active:scale-95"
              >
                Enviar mensagem
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
