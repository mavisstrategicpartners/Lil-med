import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface EnquiryItem {
  id: string;
  name: string;
  category: string;
}

interface EnquiryContextValue {
  items: EnquiryItem[];
  add: (item: EnquiryItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  count: number;
}

const EnquiryContext = createContext<EnquiryContextValue | null>(null);
const STORAGE_KEY = "lilmed:enquiry";

function safeGet(): EnquiryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as EnquiryItem[]) : [];
  } catch {
    return [];
  }
}
function safeSet(items: EnquiryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<EnquiryItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(safeGet());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) safeSet(items);
  }, [items, hydrated]);

  const value = useMemo<EnquiryContextValue>(
    () => ({
      items,
      add: (item) =>
        setItems((prev) => (prev.some((p) => p.id === item.id) ? prev : [...prev, item])),
      remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      clear: () => setItems([]),
      has: (id) => items.some((p) => p.id === id),
      count: items.length,
    }),
    [items]
  );

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used within EnquiryProvider");
  return ctx;
}
