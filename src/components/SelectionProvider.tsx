"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Ctx = {
  ids: Set<string>;
  count: number;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  clear: () => void;
  asArray: () => string[];
};

const SelectionContext = createContext<Ctx | null>(null);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(() => new Set());

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clear = useCallback(() => setIds(new Set()), []);
  const has = useCallback((id: string) => ids.has(id), [ids]);
  const asArray = useCallback(() => Array.from(ids), [ids]);

  const value = useMemo<Ctx>(
    () => ({ ids, count: ids.size, has, toggle, clear, asArray }),
    [ids, has, toggle, clear, asArray],
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection(): Ctx {
  const v = useContext(SelectionContext);
  if (!v) throw new Error("useSelection must be used inside SelectionProvider");
  return v;
}
