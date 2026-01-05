import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export function useQueryParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getParam = useCallback(
    (key: string): string | undefined => {
      return searchParams.get(key) || undefined;
    },
    [searchParams]
  );

  const setParam = useCallback(
    (key: string, value: string | number | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const setParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const removeParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const clearParams = useCallback(() => {
    router.push(window.location.pathname);
  }, [router]);

  const getAllParams = useMemo(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  return {
    getParam,
    setParam,
    setParams,
    removeParam,
    clearParams,
    getAllParams,
    searchParams,
  };
}

