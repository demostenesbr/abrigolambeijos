"use client";
import { useEffect, useState } from "react";

const tiers = [
  {
    amount: 30,
    label: "Amigo",
    perks: [
      "1 animal alimentado por 30   dias",
      "Boletim mensal de impacto",
      "Certificado digital",
    ],
  },
  {
    amount: 80,
    label: "Protetor",
    perks: [
      "3 animais alimentados",
      "Vacina para 1 animal",
      "Relatório mensal detalhado",
      "Menção nas redes sociais",
    ],
    featured: true,
  },
  {
    amount: 150,
    label: "Guardião",
    perks: [
      "Consulta veterinária custeada",
      "Castração subsidiada",
      "Visita ao abrigo",
      "Placa de agradecimento",
      "Relatório personalizado",
    ],
  },
];

const impacts = [
  { value: "R$ 30", label: "alimenta 1 animal por um mês" },
  { value: "R$ 80", label: "custeia vacinas essenciais" },
  { value: "R$ 200", label: "paga uma consulta veterinária" },
  { value: "R$ 500", label: "financia uma castração completa" },
];

const pixCode =
  "00020126580014BR.GOV.BCB.PIX0136abrigolambeijos@gmail.com5204000053039865802BR5917ABRIGO LAMBEIJOS6009SAO PAULO62070503***6304A1B2";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function PixQrCode() {
  const cells = Array.from({ length: 29 * 29 }, (_, index) => {
    const row = Math.floor(index / 29);
    const column = index % 29;
    const inTopLeft = row < 7 && column < 7;
    const inTopRight = row < 7 && column > 21;
    const inBottomLeft = row > 21 && column < 7;
    const finderCell =
      (inTopLeft || inTopRight || inBottomLeft) &&
      (row === 0 ||
        row === 6 ||
        column === 0 ||
        column === 6 ||
        (row >= 2 && row <= 4 && column >= 2 && column <= 4) ||
        (inTopRight && row >= 2 && row <= 4 && column >= 24 && column <= 26) ||
        (inBottomLeft && row >= 24 && row <= 26 && column >= 2 && column <= 4));
    const dataCell =
      !inTopLeft &&
      !inTopRight &&
      !inBottomLeft &&
      ((row * 3 + column * 5 + row * column) % 7 < 3 ||
        (row + column * 2) % 11 === 0);

    return finderCell || dataCell;
  });

  return (
    <div
      className="grid aspect-square w-full grid-cols-[repeat(29,minmax(0,1fr))] overflow-hidden bg-white p-2"
      role="img"
      aria-label="QR Code PIX para pagamento"
    >
      {cells.map((filled, index) => (
        <span
          key={index}
          className={filled ? "bg-[#263238]" : "bg-white"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function Donations() {
  const [selected, setSelected] = useState(80);
  const [custom, setCustom] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<
    "selection" | "pix" | "success"
  >("selection");
  const [checkoutAmount, setCheckoutAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [copied, setCopied] = useState(false);

  const finalAmount = custom ? Number(custom) : selected;
  const isValidAmount = Number.isFinite(finalAmount) && finalAmount >= 10;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    if (checkoutStep !== "pix") return;

    const timerId = window.setInterval(() => {
      setTimeLeft((current) => Math.max(0, current - 1));
    }, 1000);

    const validationId = window.setTimeout(() => {
      setCheckoutStep("success");
    }, 8000);

    return () => {
      window.clearInterval(timerId);
      window.clearTimeout(validationId);
    };
  }, [checkoutStep]);

  const startPixCheckout = () => {
    if (!isValidAmount) return;
    setCheckoutAmount(finalAmount);
    setTimeLeft(300);
    setCopied(false);
    setCheckoutStep("pix");
  };

  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = pixCode;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  function setDonated(donated: boolean): void {
    setCheckoutStep(donated ? "success" : "selection");

    if (!donated) {
      setCheckoutAmount(0);
      setTimeLeft(300);
      setCopied(false);
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#4D246A] py-20 px-6">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#D1C4E9]/70 mb-4">
            Faça parte da mudança
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-5 leading-tight max-w-2xl">
            Sua doação transforma vidas de verdade
          </h1>
          <p className="text-[#D1C4E9]/80 max-w-xl leading-relaxed text-lg">
            100% dos recursos vão direto para alimentação, saúde e cuidados dos
            animais resgatados. Sem intermediários.
          </p>
        </div>
      </section>

      {/* Impact numbers */}
      <section className="bg-[#1A1033] py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 pb-8 mb-8 border-b border-white/10">
          {impacts.map((i) => (
            <div key={i.label} className="text-center">
              <div className="font-bold text-3xl text-[#F28C28] mb-1">
                {i.value}
              </div>
              <div className="text-xs text-[#78909C]">{i.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-start">
        {/* Tiers */}
        <div>
          <h2 className="font-bold text-3xl text-[#263238] mb-8">
            Planos de apoio mensal
          </h2>
          <div className="space-y-4">
            {tiers.map((t) => (
              <div
                key={t.amount}
                onClick={() => {
                  setSelected(t.amount);
                  setCustom("");
                }}
                className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                  selected === t.amount && !custom
                    ? "border-[#4D246A] bg-[#4D246A]/5 shadow-md"
                    : "border-[#D1C4E9] bg-white hover:border-[#4D246A]/40"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-bold text-2xl text-[#263238]">
                      R$ {t.amount}
                    </span>
                    <span className="text-sm text-[#546E7A] ml-1">/mês</span>
                    {t.featured && (
                      <span className="ml-3 text-xs font-bold bg-[#F28C28] text-white px-2.5 py-0.5 rounded-full">
                        Mais escolhido
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-[#4D246A] bg-[#EDE7F6] px-3 py-1 rounded-full">
                    {t.label}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {t.perks.map((p) => (
                    <li
                      key={p}
                      className="flex items-center gap-2 text-sm text-[#37474F]"
                    >
                      <span className="text-[#43A047] font-bold">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="rounded-2xl border-2 border-[#D1C4E9] bg-white p-5">
              <label className="block text-sm font-semibold text-[#37474F] mb-2">
                Outro valor
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[#546E7A] font-semibold">R$</span>
                <input
                  type="number"
                  min="10"
                  placeholder="Insira o valor"
                  value={custom}
                  onChange={(e) => {
                    setCustom(e.target.value);
                    setSelected(0);
                  }}
                  className="flex-1 bg-[#FFF8F0] border border-[#D1C4E9] rounded-xl px-4 py-2.5 text-[#263238] text-sm focus:outline-none focus:border-[#4D246A]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Checkout */}
        <div className="bg-white border border-[#D1C4E9] rounded-2xl p-8 sticky top-24">
          {checkoutStep === "success" && (
            <div
              className="flex min-h-[460px] flex-col items-center justify-center text-center"
              role="status"
              aria-live="polite"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#43A047]/10">
                <svg
                  viewBox="0 0 24 24"
                  className="h-11 w-11 text-[#43A047]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path
                    d="m5 12.5 4.2 4.2L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#43A047]">
                Pagamento confirmado
              </p>
              <h3 className="mb-4 max-w-sm text-2xl font-bold leading-tight text-[#263238]">
                Doação recebida com sucesso! Muito obrigado pelo seu apoio.
              </h3>
              <p className="text-[#546E7A] text-sm leading-relaxed mb-6">
                Sua contribuição de de{" "}
                <strong className="text-[#263238]">
                  {formatCurrency(checkoutAmount)}
                </strong>{" "}
                já está fazendo a diferença. Você receberá um e-mail de
                confirmação em breve.
              </p>
              <button
                onClick={() => setDonated(false)}
                className="text-sm font-semibold text-[#4D246A] hover:underline underline-offset-4"
              >
                Fazer outra doação
              </button>
            </div>
          )}

          {checkoutStep === "pix" && (
            <div className="text-center">
              <div className="mb-5 flex items-center justify-between gap-4 text-left">
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#4D246A]">
                    Pagamento via PIX
                  </p>
                  <h3 className="text-xl font-bold text-[#263238]">
                    Escaneie para doar
                  </h3>
                </div>
                <div
                  className="shrink-0 rounded-xl bg-[#FFF8F0] px-3 py-2 text-center"
                  aria-label={`${minutes} minutos e ${seconds} segundos restantes`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#78909C]">
                    Expira em
                  </p>
                  <p className="font-mono text-lg font-bold tabular-nums text-[#D9534F]">
                    {String(minutes).padStart(2, "0")}:
                    {String(seconds).padStart(2, "0")}
                  </p>
                </div>
              </div>

              <div className="mx-auto mb-4 w-full max-w-[220px] rounded-2xl border border-[#D1C4E9] bg-white p-3 shadow-sm">
                <PixQrCode />
              </div>

              <p className="mb-1 text-sm text-[#546E7A]">Valor da doação</p>
              <p className="mb-5 text-2xl font-bold text-[#4D246A]">
                {formatCurrency(checkoutAmount)}
              </p>

              <button
                type="button"
                onClick={copyPixCode}
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#4D246A] px-5 py-3 text-sm font-semibold text-[#4D246A] transition-colors hover:bg-[#EDE7F6] focus:outline-none focus:ring-2 focus:ring-[#4D246A] focus:ring-offset-2"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="8" y="8" width="11" height="11" rx="2" />
                  <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                </svg>
                {copied
                  ? "Código PIX copiado"
                  : "Copiar Código PIX (Copia e Cola)"}
              </button>

              <div
                className="mt-6 rounded-xl bg-[#3A7CA5]/8 px-4 py-3"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#3A7CA5]/25 border-t-[#3A7CA5]" />
                  <p className="text-xs font-semibold text-[#3A7CA5]">
                    Aguardando validação da transferência pelo banco
                  </p>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#3A7CA5]/15">
                  <div className="h-full w-2/5 animate-pulse rounded-full bg-[#3A7CA5]" />
                </div>
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-[#78909C]">
                Esta etapa será confirmada automaticamente após a identificação
                do pagamento.
              </p>
            </div>
          )}

          {checkoutStep === "selection" && (
            <>
              <h3 className="font-bold text-xl text-[#263238] mb-6">
                Finalizar doação
              </h3>

              <div className="bg-[#EDE7F6] border border-[#D1C4E9] rounded-xl p-4 mb-6 text-center">
                <p className="text-xs text-[#546E7A] mb-1">Valor selecionado</p>
                <p className="font-bold text-4xl text-[#4D246A]">
                  {finalAmount ? formatCurrency(finalAmount) : "–"}
                </p>
              </div>

              <div className="mb-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#546E7A]">
                  Forma de pagamento
                </p>
                <div className="flex items-center gap-3 rounded-xl border-2 border-[#4D246A] bg-[#4D246A]/5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4D246A] text-white">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path d="m8.2 4.8 3.8 3.8 3.8-3.8M8.2 19.2l3.8-3.8 3.8 3.8M4.8 8.2 8.6 12l-3.8 3.8M19.2 8.2 15.4 12l3.8 3.8" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[#263238]">PIX</p>
                    <p className="text-xs text-[#546E7A]">
                      Aprovação rápida e pagamento seguro
                    </p>
                  </div>
                </div>
              </div>

              <button
                disabled={!isValidAmount}
                onClick={startPixCheckout}
                className="w-full bg-[#F28C28] text-white font-semibold py-4 rounded-full hover:bg-[#D97820] transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2"
              >
                Confirmar doação de{" "}
                {finalAmount ? formatCurrency(finalAmount) : "R$ –"}
              </button>

              {custom && !isValidAmount && (
                <p className="mt-3 text-center text-xs font-medium text-[#D9534F]">
                  O valor mínimo para doação é R$ 10,00.
                </p>
              )}

              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-[#78909C]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="5" y="10" width="14" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                Pagamento seguro · 100% dos recursos vão para os animais
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
