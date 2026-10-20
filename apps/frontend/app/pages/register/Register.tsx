"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authService, errorMessage } from "../../services/auth";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    role: "adotante",
    agreed: false,
  });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setDone(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white border border-[#D1C4E9] rounded-xl px-4 py-3 text-[#263238] text-sm placeholder-[#78909C] focus:outline-none focus:border-[#4D246A] focus:ring-2 focus:ring-[#4D246A]/20 transition-all";

  if (done) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 bg-[#FFF8F0]">
        <div className="text-center max-w-sm">
          <div className="text-7xl mb-6">🐾</div>
          <h2 className="font-bold text-4xl text-[#263238] mb-4">
            Bem-vindo à família!
          </h2>
          <p className="text-[#546E7A] leading-relaxed mb-8">
            Sua conta foi criada com sucesso. Verifique seu e-mail para ativar o
            cadastro e começar a fazer a diferença na vida dos animais.
          </p>
          <Link
            href="/entrar"
            className="inline-block bg-[#F28C28] text-white font-semibold px-10 py-4 rounded-full hover:bg-[#D97820] transition-colors"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid md:grid-cols-2">
      {/* Left panel */}
      <div
        className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1A1033 0%, #4D246A 100%)",
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=900&fit=crop&auto=format"
          alt="Animal feliz"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
          width={800}
          height={900}
          loading="eager"
        />
        <div className="relative z-10">
          <h2 className="text-3xl text-[#EDE7F6] font-bold">Abrigo Lambeijos</h2>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl text-white font-bold leading-snug">
            Faça parte da maior rede de proteção animal.
          </h2>
          <ul className="space-y-3">
            {[
              "Acompanhe animais disponíveis para adoção",
              "Registre animais perdidos ou encontrados",
              "Acesse dicas exclusivas de saúde animal",
              "Conecte-se com nossa rede de parceiros",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm text-[#D1C4E9]"
              >
                <span className="w-5 h-5 rounded-full bg-[#F28C28]/30 flex items-center justify-center text-xs flex-shrink-0 text-[#F28C28]">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative z-10 text-xs text-[#546E7A]">
          Grátis para sempre para tutores e protetores
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8 bg-[#FFF8F0] overflow-y-auto">
        <div className="w-full max-w-sm py-8">
          <div className="mb-8">
            <h1 className="font-bold text-4xl text-[#263238] mb-2">
              Criar conta
            </h1>
            <p className="text-sm text-[#546E7A]">
              Já tem conta?{" "}
              <Link
                href="/entrar"
                className="text-[#4D246A] font-semibold hover:underline underline-offset-4"
              >
                Entrar
              </Link>
            </p>
          </div>

          {/* Role picker */}
          <div className="grid grid-cols-3 gap-2 mb-6 bg-[#EDE7F6] rounded-2xl p-1.5">
            {[
              { key: "adotante", label: "Adotante" },
              { key: "protetor", label: "Protetor" },
              { key: "parceiro", label: "Parceiro" },
            ].map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setForm({ ...form, role: r.key })}
                className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                  form.role === r.key
                    ? "bg-white text-[#263238] shadow-sm"
                    : "text-[#546E7A] hover:text-[#263238]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#37474F] mb-1.5 uppercase tracking-wider">
                Nome completo
              </label>
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
              <label className="block text-xs font-semibold text-[#37474F] mb-1.5 uppercase tracking-wider">
                E-mail
              </label>
              <input
                type="email"
                required
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#37474F] mb-1.5 uppercase tracking-wider">
                Telefone
              </label>
              <input
                type="tel"
                placeholder="(11)90000-0000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#37474F] mb-1.5 uppercase tracking-wider">
                Senha
              </label>
              <input
                type="password"
                required
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#37474F] mb-1.5 uppercase tracking-wider">
                Confirmar senha
              </label>
              <input
                type="password"
                required
                placeholder="Repita a senha"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className={inputClass}
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={form.agreed}
                onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
                className="mt-0.5 accent-[#4D246A]"
              />
              <span className="text-xs text-[#546E7A] leading-relaxed">
                Li e concordo com os{" "}
                <a
                  href="/termos-de-uso"
                  className="text-[#4D246A] underline underline-offset-4"
                >
                  Termos de Uso
                </a>{" "}
                e a{" "}
                <a
                  href="/politica-de-privacidade"
                  className="text-[#4D246A] underline underline-offset-4"
                >
                  Política de Privacidade
                </a>
                .
              </span>
            </label>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F28C28] text-white font-semibold py-3.5 rounded-full hover:bg-[#D97820] transition-all active:scale-95 disabled:opacity-60"
            >
              {loading ? "Criando..." : "Criar conta grátis"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
