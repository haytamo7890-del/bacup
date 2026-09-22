"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Niveau = "1bac" | "2bac";
type Ctx = { niveau: Niveau; setNiveau: (n: Niveau) => void };

const AdminLevelContext = createContext<Ctx>({ niveau: "2bac", setNiveau: () => {} });

/** Shared niveau (1bac | 2bac) for the whole admin, persisted per browser. */
export function AdminLevelProvider({ children }: { children: ReactNode }) {
  const [niveau, setN] = useState<Niveau>("2bac");
  useEffect(() => {
    try { const s = localStorage.getItem("admin_niveau"); if (s === "1bac" || s === "2bac") setN(s); } catch {}
  }, []);
  const setNiveau = (n: Niveau) => { setN(n); try { localStorage.setItem("admin_niveau", n); } catch {} };
  return <AdminLevelContext.Provider value={{ niveau, setNiveau }}>{children}</AdminLevelContext.Provider>;
}

export const useAdminLevel = () => useContext(AdminLevelContext);

/** Segmented 1 BAC / 2 BAC switch — governs every admin content page. */
export function AdminLevelSwitch() {
  const { niveau, setNiveau } = useAdminLevel();
  return (
    <div className="inline-flex rounded-full glass p-1 gap-1" title="Niveau géré">
      {(["1bac", "2bac"] as Niveau[]).map((n) => (
        <button key={n} onClick={() => setNiveau(n)}
          className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition ${niveau === n ? "bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white shadow-lg shadow-arctic-blue/20" : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"}`}>
          {n === "1bac" ? "1 BAC" : "2 BAC"}
        </button>
      ))}
    </div>
  );
}
