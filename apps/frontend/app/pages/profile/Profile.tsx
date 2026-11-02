"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../services/api";
import { authService, errorMessage } from "../../services/auth";

interface Profile {
  id: number;
  email: string;
  name?: string | null;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = authService.getUser();
    if (!stored || stored.role === "ADMIN") {
      router.replace("/entrar");
      return;
    }
    api
      .get<Profile>("/auth/me")
      .then((user) => {
        setProfile(user);
        setForm({ name: user.name ?? "", email: user.email });
      })
      .catch(() => {
        authService.logout();
        router.replace("/entrar");
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const updated = await api.patch<Profile>(`/users/${profile.id}`, {
        name: form.name,
        email: form.email,
      });
      setProfile({ ...profile, ...updated });
      authService.updateStoredUser({
        id: profile.id,
        email: updated.email ?? form.email,
        role: profile.role,
      });
      setMessage("Perfil atualizado com sucesso.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full bg-white border border-[#D1C4E9] rounded-xl px-4 py-3 text-[#263238] text-sm focus:outline-none focus:border-[#4D246A] focus:ring-2 focus:ring-[#4D246A]/20 transition-all";

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#546E7A]">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FFF8F0] px-6 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="font-bold text-4xl text-[#263238] mb-2">Meu perfil</h1>
        <p className="text-sm text-[#546E7A] mb-8">
          Atualize seus dados de contato.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#37474F] mb-1.5 uppercase tracking-wider">
              Nome
            </label>
            <input
              type="text"
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#37474F] mb-1.5 uppercase tracking-wider">
              E-mail
            </label>
            <input
              type="email"
              required
              className={inputClass}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          {message && <p className="text-sm text-emerald-700">{message}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#F28C28] text-white font-semibold py-3.5 rounded-full hover:bg-[#D97820] transition-colors disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}
