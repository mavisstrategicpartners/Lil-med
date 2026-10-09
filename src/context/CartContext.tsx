import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem { id: string; name: string; price: number; image: string; qty: number; }
interface CartCtx {
  items: CartItem[];
  add: (i: Omit<CartItem,"qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
}
const Ctx = createContext<CartCtx | null>(null);
const KEY = "lilmed:cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hyd, setHyd] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(KEY); if (r) setItems(JSON.parse(r)); } catch {} setHyd(true); }, []);
  useEffect(() => { if (hyd) try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} }, [items, hyd]);

  const value = useMemo<CartCtx>(() => ({
    items,
    add: (i, qty = 1) => setItems(prev => {
      const ex = prev.find(p => p.id === i.id);
      if (ex) return prev.map(p => p.id === i.id ? { ...p, qty: p.qty + qty } : p);
      return [...prev, { ...i, qty }];
    }),
    remove: (id) => setItems(prev => prev.filter(p => p.id !== id)),
    setQty: (id, qty) => setItems(prev => prev.map(p => p.id === id ? { ...p, qty: Math.max(1, qty) } : p)),
    clear: () => setItems([]),
    count: items.reduce((s, i) => s + i.qty, 0),
    total: items.reduce((s, i) => s + i.qty * i.price, 0),
  }), [items]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useCart() { const c = useContext(Ctx); if (!c) throw new Error("useCart within CartProvider"); return c; }
