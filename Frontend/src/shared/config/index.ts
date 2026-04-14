export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "/api",
} as const;

export const AI_MODELS = [
  { value: "mixtral", label: "Mixtral", color: "#f97316" },
  { value: "cohere", label: "Cohere", color: "#8b5cf6" },
  { value: "mistral", label: "Mistral", color: "#3b82f6" },
  { value: "openrouter", label: "OpenRouter", color: "#10b981" },
] as const;
