import { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface UsePaginationOptions {
  initialPage?: number;
  itemsPerPage?: number;
  syncWithUrl?: boolean;
  paramName?: string;
}

interface UsePaginationReturn {
  page: number;
  setPage: (page: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  goToFirst: () => void;
  goToLast: (totalPages: number) => void;
  offset: number;
  limit: number;
}

export function usePagination({
  initialPage = 1,
  itemsPerPage = 20,
  syncWithUrl = false,
  paramName = 'page',
}: UsePaginationOptions = {}): UsePaginationReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getPageFromUrl = useCallback(() => {
    if (syncWithUrl) {
      const pageParam = searchParams.get(paramName);
      return pageParam ? parseInt(pageParam, 10) : initialPage;
    }
    return initialPage;
  }, [syncWithUrl, searchParams, paramName, initialPage]);

  const [page, setPageState] = useState(getPageFromUrl);

  const setPage = useCallback(
    (newPage: number) => {
      setPageState(newPage);
      if (syncWithUrl) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(paramName, newPage.toString());
        router.push(`?${params.toString()}`);
      }
    },
    [syncWithUrl, searchParams, router, paramName]
  );

  const goToNext = useCallback(() => {
    setPage(page + 1);
  }, [page, setPage]);

  const goToPrevious = useCallback(() => {
    setPage(Math.max(1, page - 1));
  }, [page, setPage]);

  const goToFirst = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const goToLast = useCallback(
    (totalPages: number) => {
      setPage(totalPages);
    },
    [setPage]
  );

  const offset = (page - 1) * itemsPerPage;
  const limit = itemsPerPage;

  return {
    page,
    setPage,
    goToNext,
    goToPrevious,
    goToFirst,
    goToLast,
    offset,
    limit,
  };
}

