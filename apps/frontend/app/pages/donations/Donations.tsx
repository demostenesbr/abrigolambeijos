import { useState } from "react";

const tiers = [
  {
    amount: 30,
    label: "Amigo",
    perks: [
      "1 animal alimentado por 30 dias",
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

const pixKey = "doacoes@larfeliz.org.br";

export default function Donations() {
  const [selected, setSelected] = useState(80);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState<"pix" | "cartao" | "boleto">("pix");
  const [donated, setDonated] = useState(false);

  const finalAmount = custom ? Number(custom) : selected;

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
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {impacts.map((i) => (
            <div key={i.value} className="text-center">
              <div className="font-bold text-2xl text-[#F4C95D] mb-1">
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

        {/* Payment */}
        <div className="bg-white border border-[#D1C4E9] rounded-2xl p-8 sticky top-24">
          {donated ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🐾</div>
              <h3 className="font-bold text-2xl text-[#263238] mb-3">
                Obrigado pela doação!
              </h3>
              <p className="text-[#546E7A] text-sm leading-relaxed mb-6">
                Sua contribuição de <strong>R$ {finalAmount}</strong> já está
                fazendo a diferença. Você receberá um e-mail de confirmação em
                breve.
              </p>
              <button
                onClick={() => setDonated(false)}
                className="text-sm font-semibold text-[#4D246A] hover:underline underline-offset-4"
              >
                Fazer outra doação
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-xl text-[#263238] mb-6">
                Finalizar doação
              </h3>

              <div className="bg-[#EDE7F6] border border-[#D1C4E9] rounded-xl p-4 mb-6 text-center">
                <p className="text-xs text-[#546E7A] mb-1">Valor selecionado</p>
                <p className="font-bold text-4xl text-[#4D246A]">
                  R$ {finalAmount || "–"}
                </p>
              </div>

              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#546E7A] mb-3">
                  Forma de pagamento
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { key: "pix", label: "PIX" },
                      { key: "cartao", label: "Cartão" },
                      { key: "boleto", label: "Boleto" },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setMethod(m.key)}
                      className={`py-2.5 text-sm font-semibold rounded-xl border transition-all ${
                        method === m.key
                          ? "bg-[#4D246A] text-white border-[#4D246A]"
                          : "border-[#D1C4E9] text-[#37474F] hover:border-[#4D246A]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {method === "pix" && (
                <div className="bg-[#FFF8F0] border border-[#D1C4E9] rounded-xl p-4 mb-5 text-center">
                  <div className="w-32 h-32 mx-auto bg-[#EDE7F6] rounded-xl mb-3 flex items-center justify-center text-5xl">
                    📱
                  </div>
                  <p className="text-xs text-[#546E7A] mb-1">Chave PIX</p>
                  <p className="font-semibold text-[#263238] text-sm">
                    {pixKey}
                  </p>
                </div>
              )}

              {method === "cartao" && (
                <div className="space-y-3 mb-5">
                  <input
                    placeholder="Número do cartão"
                    className="w-full border border-[#D1C4E9] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4D246A] bg-[#FFF8F0]"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Validade"
                      className="border border-[#D1C4E9] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4D246A] bg-[#FFF8F0]"
                    />
                    <input
                      placeholder="CVV"
                      className="border border-[#D1C4E9] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4D246A] bg-[#FFF8F0]"
                    />
                  </div>
                </div>
              )}

              {method === "boleto" && (
                <div className="bg-[#FFF8F0] border border-[#D1C4E9] rounded-xl p-4 mb-5 text-center">
                  <p className="text-sm text-[#546E7A]">
                    O boleto será gerado e enviado para o seu e-mail cadastrado.
                  </p>
                </div>
              )}

              <button
                disabled={!finalAmount}
                onClick={() => finalAmount && setDonated(true)}
                className="w-full bg-[#F28C28] text-white font-semibold py-4 rounded-full hover:bg-[#D97820] transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              >
                Confirmar doação de R$ {finalAmount || "–"}
              </button>

              <p className="text-xs text-center text-[#78909C] mt-3">
                🔒 Pagamento seguro · 100% dos recursos vão para os animais
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
