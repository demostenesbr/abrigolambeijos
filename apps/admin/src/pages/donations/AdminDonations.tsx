const doacoes = [
  { id: "#D0512", doador: "Ana Paula Santos", valor: 150, tipo: "Mensal", metodo: "PIX", plano: "Guardião", data: "09/09/2026", status: "Confirmado" },
  { id: "#D0511", doador: "Marcos Pereira", valor: 80, tipo: "Mensal", metodo: "Cartão", plano: "Protetor", data: "08/09/2026", status: "Confirmado" },
  { id: "#D0510", doador: "Larissa Vieira", valor: 50, tipo: "Avulso", metodo: "PIX", plano: "—", data: "07/09/2026", status: "Confirmado" },
  { id: "#D0509", doador: "Diego Carvalho", valor: 30, tipo: "Mensal", metodo: "PIX", plano: "Amigo", data: "06/09/2026", status: "Confirmado" },
  { id: "#D0508", doador: "Anônimo", valor: 200, tipo: "Avulso", metodo: "Boleto", plano: "—", data: "05/09/2026", status: "Pendente" },
  { id: "#D0507", doador: "Tatiana Mello", valor: 80, tipo: "Mensal", metodo: "Cartão", plano: "Protetor", data: "04/09/2026", status: "Confirmado" },
  { id: "#D0506", doador: "Henrique Lima", valor: 150, tipo: "Mensal", metodo: "PIX", plano: "Guardião", data: "03/09/2026", status: "Estornado" },
];

const statusColor: Record<string, string> = {
  Confirmado: "bg-[#E8F5E9] text-[#43A047]",
  Pendente: "bg-[#FFF3E0] text-[#F28C28]",
  Estornado: "bg-[#FCE4EC] text-[#D9534F]",
};

const totalConfirmado = doacoes.filter((d) => d.status === "Confirmado").reduce((s, d) => s + d.valor, 0);
const totalMensal = doacoes.filter((d) => d.tipo === "Mensal" && d.status === "Confirmado").reduce((s, d) => s + d.valor, 0);
const totalAvulso = doacoes.filter((d) => d.tipo === "Avulso" && d.status === "Confirmado").reduce((s, d) => s + d.valor, 0);

export default function AdminDonations() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#263238]">💰 Doações</h1>
        <p className="text-sm text-[#546E7A]">Controle financeiro das doações recebidas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E8E0F0] p-5">
          <p className="text-xs font-semibold text-[#78909C] uppercase tracking-wider mb-2">Total confirmado (mês)</p>
          <p className="text-3xl font-bold text-[#4D246A]">R$ {totalConfirmado.toLocaleString("pt-BR")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8E0F0] p-5">
          <p className="text-xs font-semibold text-[#78909C] uppercase tracking-wider mb-2">Recorrentes</p>
          <p className="text-3xl font-bold text-[#43A047]">R$ {totalMensal}</p>
          <p className="text-xs text-[#78909C] mt-1">{doacoes.filter((d) => d.tipo === "Mensal" && d.status === "Confirmado").length} assinantes ativos</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8E0F0] p-5">
          <p className="text-xs font-semibold text-[#78909C] uppercase tracking-wider mb-2">Doações avulsas</p>
          <p className="text-3xl font-bold text-[#F28C28]">R$ {totalAvulso}</p>
          <p className="text-xs text-[#78909C] mt-1">{doacoes.filter((d) => d.tipo === "Avulso" && d.status === "Confirmado").length} doações pontuais</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-[#E8E0F0] p-6">
        <p className="text-sm font-bold text-[#263238] mb-4">Arrecadação mensal (R$)</p>
        <div className="flex items-end gap-3 h-24">
          {[8200, 9400, 7800, 11200, 10500, 12480].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-[#78909C] font-semibold">
                {(v / 1000).toFixed(1)}k
              </span>
              <div
                className="w-full rounded-t-lg bg-[#4D246A] hover:bg-[#F28C28] transition-colors cursor-default"
                style={{ height: `${(v / 12480) * 100}%` }}
              />
              <span className="text-[9px] text-[#78909C]">{["A", "M", "J", "J", "A", "S"][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E0F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F3F0F8] bg-[#F9F7FC]">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#78909C] uppercase tracking-wider">ID</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#78909C] uppercase tracking-wider">Doador</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#78909C] uppercase tracking-wider">Valor</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#78909C] uppercase tracking-wider">Tipo</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#78909C] uppercase tracking-wider">Método</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#78909C] uppercase tracking-wider">Plano</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#78909C] uppercase tracking-wider">Data</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#78909C] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {doacoes.map((d) => (
                <tr key={d.id} className="border-b border-[#F3F0F8] hover:bg-[#F9F7FC] transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-[#78909C]">{d.id}</td>
                  <td className="px-4 py-3.5 font-semibold text-[#263238]">{d.doador}</td>
                  <td className="px-4 py-3.5 font-bold text-[#4D246A]">R$ {d.valor}</td>
                  <td className="px-4 py-3.5 text-[#546E7A]">{d.tipo}</td>
                  <td className="px-4 py-3.5 text-[#546E7A]">{d.metodo}</td>
                  <td className="px-4 py-3.5 text-[#546E7A]">{d.plano}</td>
                  <td className="px-4 py-3.5 text-[#546E7A]">{d.data}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[d.status]}`}>{d.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
