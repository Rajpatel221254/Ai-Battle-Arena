import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import config from "./src/config/config.js";

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(Number(config.PORT), "0.0.0.0", () => {
      console.log(`\n🚀 AI Battle Arena Server running on port ${config.PORT}`);
      console.log(`📡 Health check: http://localhost:${config.PORT}/api/health`);
      console.log(`🔐 Auth API:     http://localhost:${config.PORT}/api/auth`);
      console.log(`⚔️  Battle API:   http://localhost:${config.PORT}/api/battle\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
