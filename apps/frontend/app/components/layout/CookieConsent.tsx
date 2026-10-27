"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "abrigo_cookie_consent";

type Consent = "all" | "necessary";

function saveConsent(consent: Consent) {
  localStorage.setItem(CONSENT_KEY, consent);
  document.cookie = `abrigo_cookie_consent=${consent}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setVisible(!localStorage.getItem(CONSENT_KEY));
  }, []);

  const accept = (consent: Consent) => {
    saveConsent(consent);
    setVisible(false);
    setSettingsOpen(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="dialog"
      aria-label="Preferências de cookies"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-5xl rounded-2xl border border-[#E8DCCF] bg-white p-5 shadow-[0_12px_40px_rgba(38,25,18,0.2)] sm:inset-x-6 sm:p-6"
    >
      {!settingsOpen ? (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-3">
            <span className="mt-0.5 text-2xl" aria-hidden="true">
              🍪
            </span>
            <p className="max-w-3xl text-sm leading-6 text-[#4E4038]">
              Ao clicar em &ldquo;Aceite todos os Cookies&rdquo;, você concorda
              com o armazenamento de cookies no seu dispositivo para melhorar a
              navegação no site, analisar o uso do site e auxiliar nossos
              esforços de marketing.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="rounded-full border border-[#4D246A] px-5 py-2.5 text-sm font-bold text-[#4D246A] transition hover:bg-[#F4EDF7]"
            >
              Configurações de Cookies
            </button>
            <button
              type="button"
              onClick={() => accept("all")}
              className="rounded-full bg-[#F28C28] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#D97820]"
            >
              Aceite todos os Cookies
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-[#2F2140]">
                Configurações de Cookies
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#6D5D53]">
                Escolha como os cookies podem ser usados neste dispositivo.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              aria-label="Fechar configurações de cookies"
              className="text-xl text-[#78909C] hover:text-[#2F2140]"
            >
              ×
            </button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-[#FAF7F3] p-4">
              <p className="font-bold text-[#2F2140]">Cookies necessários</p>
              <p className="mt-1 text-xs leading-5 text-[#6D5D53]">
                Essenciais para segurança, sessão e funcionamento do site.
              </p>
              <span className="mt-2 inline-block text-xs font-bold text-emerald-700">
                Sempre ativos
              </span>
            </div>
            <div className="rounded-xl bg-[#FAF7F3] p-4">
              <p className="font-bold text-[#2F2140]">Cookies opcionais</p>
              <p className="mt-1 text-xs leading-5 text-[#6D5D53]">
                Ajudam a analisar a navegação e melhorar nossas comunicações.
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-col-reverse justify-end gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => accept("necessary")}
              className="rounded-full border border-[#D8C8E2] px-5 py-2.5 text-sm font-bold text-[#4D246A] hover:bg-[#F4EDF7]"
            >
              Apenas necessários
            </button>
            <button
              type="button"
              onClick={() => accept("all")}
              className="rounded-full bg-[#F28C28] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#D97820]"
            >
              Aceite todos os Cookies
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
