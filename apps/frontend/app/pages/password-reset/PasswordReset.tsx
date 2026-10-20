"use client";

import { useState } from "react";
import Image from "next/image";

export default function PasswordReset() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          <h2 className="text-3xl text-[#EDE7F6] font-bold">
            Abrigo Lambeijos
          </h2>
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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8 bg-[#FFF8F0]">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="font-bold text-4xl text-[#263238] mb-2">
              Redefinição de Senha
            </h1>
            <p className="text-sm text-[#546E7A]">
              Por favor, insira e confirme sua nova senha abaixo.
            </p>
            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError("");
              setMessage("");
              try {
                // Replace with your password reset logic
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setMessage(
                  "Email de redefinição de senha enviado com sucesso!",
                );
              } catch {
                setError("Ocorreu um erro ao tentar redefinir a senha.");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="mb-4">
              <label
                className="block text-sm text-[#263238] mb-2"
                htmlFor="password"
              >
                Digite uma nova senha
              </label>
              <input
                type="password"
                id="password"
                placeholder="Digite uma nova senha"
                className="w-full bg-white border border-[#D1C4E9] rounded-xl px-4 py-3 text-[#263238] text-sm placeholder-[#78909C] focus:outline-none focus:border-[#4D246A] focus:ring-2 focus:ring-[#4D246A]/20 transition-all"

                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm text-[#263238] mb-2"
                htmlFor="confirmPassword"
              >
                Confirme a nova senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirme a nova senha"
                className="w-full bg-white border border-[#D1C4E9] rounded-xl px-4 py-3 text-[#263238] text-sm placeholder-[#78909C] focus:outline-none focus:border-[#4D246A] focus:ring-2 focus:ring-[#4D246A]/20 transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#4D246A] text-white font-semibold py-3 rounded-xl hover:bg-[#3b1a57] transition-all disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Redefinir Senha"}
            </button>
          </form>
          {message && <p>{message}</p>}
          {error && <p>{error}</p>}
        </div>
      </div>
    </div>
  );
}
