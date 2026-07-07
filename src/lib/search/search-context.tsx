"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface SearchContextValue {
  query: string;
  setQuery: (query: string) => void;
  normalizedQuery: string;
  isSearchActive: boolean;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery("");
  }, [pathname]);

  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);
  const isSearchActive = normalizedQuery.length > 0;

  const value = useMemo(
    () => ({
      query,
      setQuery,
      normalizedQuery,
      isSearchActive,
    }),
    [query, normalizedQuery, isSearchActive]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function usePageSearch() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("usePageSearch must be used within SearchProvider");
  }

  return context;
}
