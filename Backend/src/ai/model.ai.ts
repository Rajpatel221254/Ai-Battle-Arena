import { ChatGoogle } from "@langchain/google";
import { ChatCohere } from "@langchain/cohere";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatOpenRouter } from "@langchain/openrouter";
import config from "../config/config.js";

export const gemini = new ChatGoogle({
  model: "gemini-flash-latest",
  apiKey: config.GEMINI_API_KEY,
  temperature: 0.2,
});

export const openrouter = new ChatOpenRouter({
  model: "meta-llama/llama-3-8b-instruct",
  apiKey: config.OPENROUTER_API_KEY,
  temperature: 0.7,
});

export const mistral = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: config.MISTRAL_API_KEY,
  temperature: 0.7,
});

export const cohere = new ChatCohere({
  model: "command-a-03-2025",
  apiKey: config.COHERE_API_KEY,
  temperature: 0.7,
});

export const mixtral = new ChatOpenRouter({
  model: "mistralai/mixtral-8x7b-instruct",
  apiKey: config.OPENROUTER_API_KEY,
  temperature: 0.7,
});
