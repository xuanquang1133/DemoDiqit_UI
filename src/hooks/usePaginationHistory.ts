import { useCallback } from "react";
import { useSearchParams } from "react-router";

const STORAGE_KEY_PREFIX = "intershop_pagination_";

interface UsePaginationHistoryOptions {
  scope: string;
  defaultPage?: number;
  defaultLimit?: number;
}

export function usePaginationHistory(options: UsePaginationHistoryOptions) {
  const { scope, defaultPage = 1, defaultLimit = 10 } = options;

  const storageKey = `${STORAGE_KEY_PREFIX}${scope}`;
  const [searchParams, setSearchParams] = useSearchParams();

  const queryPage = searchParams.get("page");
  const page = queryPage ? parseInt(queryPage, 10) : defaultPage;

  const setPage = useCallback(
    (newPage: number) => {
      try {
        sessionStorage.setItem(storageKey, String(newPage));
      } catch {
        // sessionStorage may be unavailable
      }
      setSearchParams((prev) => {
        if (newPage === 1) {
          prev.delete("page");
          return prev;
        }
        prev.set("page", String(newPage));
        return prev;
      });
    },
    [storageKey, setSearchParams]
  );

  const clearStoredPage = useCallback(() => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }, [storageKey]);

  const getReturnHref = useCallback(
    (basePath: string): string => {
      try {
        const stored = sessionStorage.getItem(storageKey);
        const storedPage = stored ? parseInt(stored, 10) : defaultPage;
        if (storedPage <= 1) return basePath;
        return `${basePath}?page=${storedPage}`;
      } catch {
        return basePath;
      }
    },
    [storageKey, defaultPage]
  );

  return {
    page,
    setPage,
    getReturnHref,
    clearStoredPage,
    defaultLimit,
  };
}
