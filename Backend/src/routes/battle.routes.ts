import express from "express";
import { createBattle, getBattleHistory } from "../controller/battle.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate, battleSchema } from "../middlewares/validate.middleware.js";

const battleRouter = express.Router();

// All battle routes are protected
battleRouter.use(authMiddleware);

// POST /api/battle — Create a new battle
battleRouter.post("/", validate(battleSchema), createBattle);

// GET /api/battle/history — Get user's battle history
battleRouter.get("/history", getBattleHistory);

export default battleRouter;
