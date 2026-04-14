export type ModelName = "mixtral" | "cohere" | "mistral" | "openrouter";

export interface BattleRequest {
  problem: string;
  modelA: ModelName;
  modelB: ModelName;
}

export interface BattleResult {
  battleId: string;
  problem: string;
  modelA: string;
  modelB: string;
  responseA: string;
  responseB: string;
  scoreA: number;
  scoreB: number;
  winner: string;
  reasoningA: string;
  reasoningB: string;
  fromCache?: boolean;
  createdAt: string;
}

export interface BattleHistoryItem {
  _id: string;
  userId: string;
  problem: string;
  modelA: string;
  modelB: string;
  responseA: string;
  responseB: string;
  scoreA: number;
  scoreB: number;
  winner: string;
  reasoningA: string;
  reasoningB: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface BattleResponse {
  success: boolean;
  message: string;
  data: BattleResult;
}

export interface BattleHistoryResponse {
  success: boolean;
  data: {
    battles: BattleHistoryItem[];
    pagination: Pagination;
  };
}

export interface BattleState {
  currentBattle: BattleResult | null;
  history: BattleHistoryItem[];
  pagination: Pagination | null;
  isLoading: boolean;
  isBattling: boolean;
}
