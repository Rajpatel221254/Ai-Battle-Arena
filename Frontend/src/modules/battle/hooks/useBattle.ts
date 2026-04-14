import { useCallback } from "react";
import toast from "react-hot-toast";
import { battleService } from "../services/battleService";
import { useBattleStore } from "../store/battleStore";
import type { BattleRequest } from "../types/battle.types";
import type { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

/**
 * Custom hook encapsulating all battle logic.
 * Connects the service layer → store layer and handles UX concerns.
 */
export function useBattle() {
  const {
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
  } = useBattleStore();

  const startBattle = useCallback(
    async (payload: BattleRequest) => {
      setBattling(true);
      clearCurrentBattle();
      try {
        const res = await battleService.createBattle(payload);
        if (res.success) {
          setCurrentBattle(res.data);
          toast.success("Battle complete! ⚔️");
        }
        return res.data;
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>;
        const msg =
          error.response?.data?.message ||
          "Battle failed. Please try again.";
        toast.error(msg);
        throw error;
      } finally {
        setBattling(false);
      }
    },
    [setBattling, setCurrentBattle, clearCurrentBattle]
  );

  const fetchHistory = useCallback(
    async (page: number = 1, limit: number = 10) => {
      setLoading(true);
      try {
        const res = await battleService.getHistory(page, limit);
        if (res.success) {
          if (page === 1) {
            setHistory(res.data.battles, res.data.pagination);
          } else {
            appendHistory(res.data.battles, res.data.pagination);
          }
        }
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>;
        const msg =
          error.response?.data?.message ||
          "Failed to load history.";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setHistory, appendHistory]
  );

  return {
    currentBattle,
    history,
    pagination,
    isLoading,
    isBattling,
    startBattle,
    fetchHistory,
    clearCurrentBattle,
  };
}
