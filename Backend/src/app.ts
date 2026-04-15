import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import battleRouter from "./routes/battle.routes.js";


const app = express();

// ── Global Middleware ───────────────────────────────────────────────
app.use(cors(
  {
    origin: "https://ai-battle-arena-mbrc.vercel.app",
    credentials: true,
  }
));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Battle Arena API is running",
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ──────────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/battle", battleRouter);

// ── 404 Handler ─────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ── Global Error Handler ────────────────────────────────────────────
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

export default app;
