import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  BattleResult,
  BattleHistoryItem,
  Pagination,
  BattleState,
} from "../types/battle.types";

// ── Actions exposed by the battle store ─────────────────────────────
interface BattleActions {
  setCurrentBattle: (result: BattleResult | null) => void;
  setHistory: (battles: BattleHistoryItem[], pagination: Pagination) => void;
  appendHistory: (battles: BattleHistoryItem[], pagination: Pagination) => void;
  setLoading: (loading: boolean) => void;
  setBattling: (battling: boolean) => void;
  clearCurrentBattle: () => void;
}

type BattleContextValue = BattleState & BattleActions;

const BattleContext = createContext<BattleContextValue | undefined>(undefined);

// ── Provider ────────────────────────────────────────────────────────
export function BattleProvider({ children }: { children: ReactNode }) {
  const [currentBattle, setCurrentBattle] = useState<BattleResult | null>(null);
  const [history, setHistoryState] = useState<BattleHistoryItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBattling, setIsBattling] = useState(false);

  const setHistory = useCallback(
    (battles: BattleHistoryItem[], pag: Pagination) => {
      setHistoryState(battles);
      setPagination(pag);
    },
    []
  );

  const appendHistory = useCallback(
    (battles: BattleHistoryItem[], pag: Pagination) => {
      setHistoryState((prev) => [...prev, ...battles]);
      setPagination(pag);
    },
    []
  );

  const setLoading = useCallback((l: boolean) => setIsLoading(l), []);
  const setBattling = useCallback((b: boolean) => setIsBattling(b), []);
  const clearCurrentBattle = useCallback(() => setCurrentBattle(null), []);

  return (
    <BattleContext.Provider
      value={{
        currentBattle,
        history,
        pagination,
        isLoading,
        isBattling,
        setCurrentBattle,
        setHistory,
        appendHistory,
        setLoading,
        setBattling,
        clearCurrentBattle,
      }}
    >
      {children}
    </BattleContext.Provider>
  );
}

// ── Hook to consume battle context ──────────────────────────────────
export function useBattleStore(): BattleContextValue {
  const ctx = useContext(BattleContext);
  if (!ctx)
    throw new Error("useBattleStore must be used inside <BattleProvider>");
  return ctx;
}
