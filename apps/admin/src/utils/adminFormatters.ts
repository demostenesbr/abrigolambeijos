export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// month no formato YYYY-MM
export function formatMonth(month: string) {
  const [year, monthIndex] = month.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(new Date(year, monthIndex - 1, 1))
    .replace(".", "");
}

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Pendente",
    approved: "Aprovada",
    rejected: "Recusada",
    completed: "Concluída",
    in_progress: "Em andamento",
    confirmed: "Confirmada",
    failed: "Falhou",
    refunded: "Estornada",
    active: "Ativo",
    inactive: "Inativo",
    triage: "Triagem",
    in_treatment: "Em tratamento",
    recovered: "Recuperado",
  };
  return labels[status] ?? status;
}

export function statusClass(status: string) {
  if (["approved", "completed", "confirmed", "active", "recovered"].includes(status)) {
    return "bg-emerald-50 text-emerald-700";
  }
  if (["rejected", "failed", "inactive"].includes(status)) return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

export function apiErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Não foi possível carregar os dados.";
}

export function repairEncoding(value: string) {
  let repaired = value;
  for (let attempt = 0; attempt < 2 && /[ÃÂâ]/.test(repaired); attempt += 1) {
    try {
      const bytes = Uint8Array.from(repaired, (character) => character.charCodeAt(0) & 0xff);
      const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      if (decoded === repaired) break;
      repaired = decoded;
    } catch {
      break;
    }
  }
  return repaired;
}
