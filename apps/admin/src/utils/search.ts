const normalize = (value: unknown) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/#/g, "")
    .toLowerCase();

// Todos os termos digitados precisam aparecer em algum dos campos (ignora acentos, caixa e "#").
export function matchesSearch(query: string, ...fields: unknown[]) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = fields.map(normalize).join(" ");
  return terms.every((term) => haystack.includes(term));
}
