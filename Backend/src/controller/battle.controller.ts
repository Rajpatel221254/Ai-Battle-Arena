import type { Request, Response } from "express";
import Battle from "../models/battle.model.js";
import runGraph from "../ai/graph.ai.js";
import { cacheManager } from "../utils/cache.js";

// Valid model names for input validation
const VALID_MODELS = ["mixtral", "cohere", "mistral", "openrouter"] as const;
type ModelName = (typeof VALID_MODELS)[number];

const isValidModel = (model: string): model is ModelName => {
  return VALID_MODELS.includes(model as ModelName);
};

/**
 * POST /api/battle
 * Create a new AI battle
 */
export const createBattle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { problem, modelA, modelB } = req.body;
    const userId = req.user!.id;

    // Validate model names
    if (!isValidModel(modelA)) {
      res.status(400).json({
        success: false,
        message: `Invalid modelA. Must be one of: ${VALID_MODELS.join(", ")}`,
      });
      return;
    }

    if (!isValidModel(modelB)) {
      res.status(400).json({
        success: false,
        message: `Invalid modelB. Must be one of: ${VALID_MODELS.join(", ")}`,
      });
      return;
    }

    if (modelA === modelB) {
      res.status(400).json({
        success: false,
        message: "modelA and modelB must be different",
      });
      return;
    }

    // Check cache first
    const cacheKey = cacheManager.generateKey(problem, modelA, modelB);
    const cachedResult = cacheManager.get(cacheKey);

    let graphResult: any;

    if (cachedResult) {
      console.log("⚡ Cache hit — returning cached AI result");
      graphResult = cachedResult;
    } else {
      console.log("🤖 Cache miss — calling AI models...");
      graphResult = await runGraph(problem, modelA, modelB);

      // Cache for 1 hour
      cacheManager.set(cacheKey, graphResult, 3600);
    }

    // Determine winner
    const scoreA = graphResult.judge?.solution_1_score ?? 0;
    const scoreB = graphResult.judge?.solution_2_score ?? 0;
    let winner: string;

    if (scoreA > scoreB) {
      winner = modelA;
    } else if (scoreB > scoreA) {
      winner = modelB;
    } else {
      winner = "tie";
    }

    // Save battle to database
    const battle = await Battle.create({
      userId,
      problem,
      modelA,
      modelB,
      responseA: graphResult.solution_1 ?? "",
      responseB: graphResult.solution_2 ?? "",
      scoreA,
      scoreB,
      winner,
      reasoningA: graphResult.judge?.solution_1_reasoning ?? "N/A",
      reasoningB: graphResult.judge?.solution_2_reasoning ?? "N/A",
    });

    res.status(201).json({
      success: true,
      message: "Battle completed",
      data: {
        battleId: battle._id,
        problem: battle.problem,
        modelA: battle.modelA,
        modelB: battle.modelB,
        responseA: battle.responseA,
        responseB: battle.responseB,
        scoreA: battle.scoreA,
        scoreB: battle.scoreB,
        winner: battle.winner,
        reasoningA: battle.reasoningA,
        reasoningB: battle.reasoningB,
        fromCache: !!cachedResult,
        createdAt: battle.createdAt,
      },
    });
  } catch (error) {
    console.error("Battle error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to run battle. Please try again.",
    });
  }
};

/**
 * GET /api/battle/history
 * Get battle history for the authenticated user
 */
export const getBattleHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;

    // Pagination
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const [battles, total] = await Promise.all([
      Battle.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Battle.countDocuments({ userId }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        battles,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + battles.length < total,
        },
      },
    });
  } catch (error) {
    console.error("Battle history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch battle history",
    });
  }
};
