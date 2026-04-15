import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/ai-battle-arena",
  JWT_SECRET: process.env.JWT_SECRET || "super-secret-key-change-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  COHERE_API_KEY: process.env.COHERE_API_KEY || "",
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || "",
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
};

export default config;