interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, total, pageSize, onChange }: PaginationProps) {
  if (total <= pageSize) return null;

  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);
  const buttonClass =
    "rounded-lg border border-[#E5DCEB] px-3 py-1.5 text-xs font-bold text-[#4D246A] disabled:opacity-40";

  return (
    <nav aria-label="Paginação" className="flex items-center justify-between gap-3 border-t border-[#EEE7F1] p-4 text-xs text-[#78909C]">
      <span>{first}–{last} de {total}</span>
      <div className="flex items-center gap-2">
        <button type="button" className={buttonClass} disabled={page <= 1} onClick={() => onChange(page - 1)}>Anterior</button>
        <span>Página {page} de {totalPages}</span>
        <button type="button" className={buttonClass} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Próxima</button>
      </div>
    </nav>
  );
}
