"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "./../../assets/abrigo-lambeijos.png";
import { authService, errorMessage } from "../../services/auth";

export default function ForgotPassword() {
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
          alt="Animais felizes"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
          width={800}
          height={900}
          loading="eager"
        />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">
              {" "}
              <Image
                src={Logo}
                alt="Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </span>
            <span className="text-[#EDE7F6] text-xl font-semibold">
              Abrigo Lambeijos
            </span>
          </Link>
        </div>
        <div className="relative z-10">
          <blockquote className="text-3xl text-[#EDE7F6] leading-snug mb-6">
            Cada animal resgatado é uma história de amor que está apenas
            começando
          </blockquote>
          <p className="text-[#78909C] text-sm">Meyre Morley, fundadora</p>
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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8 bg-[#FFF8F0]">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="font-bold text-4xl text-[#263238] mb-2">
              Esqueci minha senha
            </h1>
            <p className="text-sm text-[#546E7A]">
              Insira seu e-mail para receber instruções de redefinição de senha.
            </p>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError("");
              setMessage("");
              try {
                const forgotPassword = (
                  authService as typeof authService & {
                    forgotPassword?: (email: string) => Promise<unknown>;
                  }
                ).forgotPassword;

                if (!forgotPassword) {
                  throw new Error(
                    "A redefinição de senha não está disponível no momento.",
                  );
                }

                await forgotPassword(forgotPasswordEmail);
                setMessage(
                  "Instruções de redefinição de senha enviadas com sucesso!",
                );
              } catch (err) {
                setError(errorMessage(err));
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="mb-4">
              <label
                className="block text-sm text-[#263238] mb-2"
                htmlFor="email"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                className="w-full bg-white border border-[#D1C4E9] rounded-xl px-4 py-3 text-[#263238] text-sm placeholder-[#78909C] focus:outline-none focus:border-[#4D246A] focus:ring-2 focus:ring-[#4D246A]/20 transition-all"
                placeholder="seuemail@exemplo.com"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#4D246A] text-white font-semibold py-3 rounded-xl hover:bg-[#3b1a57] transition-all disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </form>
          {message && <p className="text-sm text-green-600 mt-4">{message}</p>}
          {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}
