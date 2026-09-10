import { useState } from "react";
import { Link } from "react-router";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const inputClass =
    "w-full bg-white border border-[#D1C4E9] rounded-xl px-4 py-3 text-[#263238] text-sm placeholder-[#78909C] focus:outline-none focus:border-[#4D246A] focus:ring-2 focus:ring-[#4D246A]/20 transition-all";

  return (
    <div className="min-h-[calc(100vh-4rem)] grid md:grid-cols-2">
      {/* Left panel */}
      <div
        className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1A1033 0%, #4D246A 100%)",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=900&fit=crop&auto=format"
          alt="Animais felizes"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="text-[#EDE7F6] text-xl font-semibold">
              Lar Feliz
            </span>
          </Link>
        </div>
        <div className="relative z-10">
          <blockquote className="text-3xl text-[#EDE7F6] leading-snug mb-6">
            Cada animal resgatado é uma história de amor que está apenas
            começando
          </blockquote>
          <p className="text-[#78909C] text-sm">
            Ana Cristina Ferreira, fundadora
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { n: "4.200+", l: "Resgatados" },
            { n: "3.100+", l: "Adotados" },
            { n: "87", l: "Parceiros" },
          ].map((s) => (
            <div
              key={s.l}
              className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm"
            >
              <div className="font-bold text-[#F28C28] text-xl">{s.n}</div>
              <div className="text-xs text-[#78909C]">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8 bg-[#FFF8F0]">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="font-bold text-4xl text-[#263238] mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-[#546E7A]">
              Não tem conta?{" "}
              <Link
                to="/cadastro"
                className="text-[#4D246A] font-semibold hover:underline underline-offset-4"
              >
                Cadastre-se
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-[#37474F] uppercase tracking-wider">
                  Senha
                </label>
                <a
                  href="#"
                  className="text-xs text-[#4D246A] hover:underline underline-offset-4"
                >
                  Esqueci a senha
                </a>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F28C28] text-white font-semibold py-3.5 rounded-full hover:bg-[#D97820] transition-all disabled:opacity-60 active:scale-95 mt-2"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#D1C4E9]" />
            <span className="text-xs text-[#78909C]">ou</span>
            <div className="flex-1 h-px bg-[#D1C4E9]" />
          </div>

          <button className="w-full border border-[#D1C4E9] bg-white text-[#37474F] font-semibold py-3.5 rounded-full hover:bg-[#EDE7F6] transition-colors text-sm flex items-center justify-center gap-2">
            <span>G</span> Entrar com Google
          </button>

          <p className="text-xs text-center text-[#78909C] mt-6 leading-relaxed">
            Ao entrar, você concorda com nossos{" "}
            <a href="#" className="underline underline-offset-4">
              Termos de Uso
            </a>{" "}
            e{" "}
            <a href="#" className="underline underline-offset-4">
              Política de Privacidade
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
