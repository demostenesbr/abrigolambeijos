import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { apiErrorMessage } from "../../utils/adminFormatters";
import { getAccessToken, getStoredUser, persistAdminSession, type AdminUser } from "../../services/adminAuth";

interface Profile extends AdminUser {
  name?: string | null;
  status: string;
}

export default function AdminProfile() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const [profile, setProfile] = useState<Profile | null>(
    storedUser ? { ...storedUser, status: "ACTIVE" } : null,
  );
  const [form, setForm] = useState({
    name: storedUser?.name ?? "",
    email: storedUser?.email ?? "",
  });
  const [loading, setLoading] = useState(!storedUser);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      api.get<Profile>("/auth/me")
        .then((user) => {
          setProfile(user);
          setForm({ name: user.name ?? "", email: user.email });
        })
        .catch((requestError) => setError(apiErrorMessage(requestError)))
        .finally(() => setLoading(false));
    });
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const updated = await api.patch<Profile>(`/users/${profile.id}`, form);
      setProfile(updated);
      const token = getAccessToken();
      if (token) persistAdminSession({ accessToken: token, user: updated });
      setMessage("Perfil atualizado com sucesso.");
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-[#78909C]">Carregando perfil...</p>;
  if (!profile) return <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error ?? "Perfil não encontrado."}</p>;

  return <div className="mx-auto max-w-3xl space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-[#F28C28]">Conta administrativa</p><h1 className="mt-1 text-3xl font-black text-[#2F2140]">Meu perfil</h1><p className="mt-1 text-sm text-[#78909C]">Atualize o nome exibido e o e-mail usado para entrar no Admin.</p></div><button type="button" onClick={() => navigate("/admin/home")} className="rounded-full border border-[#D8C8E2] px-5 py-2.5 text-sm font-bold text-[#4D246A] hover:bg-[#F5F1F8]">← Voltar ao início</button></header>
    <form onSubmit={save} className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-4 border-b border-[#EEE7F1] pb-6"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4D246A] text-xl font-black text-white">{(form.name || form.email).slice(0, 2).toUpperCase()}</div><div><h2 className="font-black text-[#2F2140]">{form.name || "Administrador"}</h2><p className="text-sm text-[#78909C]">Perfil {profile.role === "ADMIN" ? "administrador" : profile.role}</p></div></div>
      <div className="grid gap-5 sm:grid-cols-2"><label className="text-xs font-bold uppercase tracking-wider text-[#78909C]">Nome de login<input required className="mt-2 w-full rounded-xl border border-[#E5DCEB] p-3 text-sm font-normal text-[#263238] outline-none focus:border-[#4D246A]" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label className="text-xs font-bold uppercase tracking-wider text-[#78909C]">E-mail de acesso<input required type="email" className="mt-2 w-full rounded-xl border border-[#E5DCEB] p-3 text-sm font-normal text-[#263238] outline-none focus:border-[#4D246A]" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label></div>
      {message && <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
      {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button disabled={saving} className="mt-6 rounded-full bg-[#F28C28] px-6 py-3 text-sm font-bold text-white hover:bg-[#D97820] disabled:opacity-60">{saving ? "Salvando..." : "Salvar alterações"}</button>
    </form>
  </div>;
}
