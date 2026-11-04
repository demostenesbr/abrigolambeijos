import { useMemo, useState } from "react";

export const DEFAULT_PAGE_SIZE = 20;

// Paginação no cliente: renderiza apenas a página atual, evitando montar centenas de nós no DOM.
export function usePagedList<T>(items: T[], pageSize = DEFAULT_PAGE_SIZE) {
  const [requestedPage, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(requestedPage, totalPages);

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  return { page, setPage, totalPages, pageItems, total: items.length, pageSize };
}
