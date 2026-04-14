import api from "../../../shared/services/api.js";
import type {
  BattleRequest,
  BattleResponse,
  BattleHistoryResponse,
} from "../types/battle.types";

export const battleService = {
  /**
   * POST /battle — Create a new AI battle
   */
  async createBattle(payload: BattleRequest): Promise<BattleResponse> {
    const { data } = await api.post<BattleResponse>("/battle", payload);
    return data;
  },

  /**
   * GET /battle/history — Get user's battle history (paginated)
   */
  async getHistory(
    page: number = 1,
    limit: number = 10
  ): Promise<BattleHistoryResponse> {
    const { data } = await api.get<BattleHistoryResponse>("/battle/history", {
      params: { page, limit },
    });
    return data;
  },
};
