export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Pendente",
    approved: "Aprovada",
    rejected: "Recusada",
    completed: "Concluída",
    in_progress: "Em andamento",
  };
  return labels[status] ?? status;
}

export function statusClass(status: string) {
  if (status === "approved" || status === "completed") {
    return "bg-emerald-50 text-emerald-700";
  }
  if (status === "rejected") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

export function apiErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Não foi possível carregar os dados.";
}
