/**
 * Format a date string into a human-readable format.
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate text to a given length with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Get a color associated with an AI model.
 */
export function getModelColor(model: string): string {
  const colors: Record<string, string> = {
    mixtral: "#f97316",
    cohere: "#8b5cf6",
    mistral: "#3b82f6",
    openrouter: "#10b981",
  };
  return colors[model] || "#6b7280";
}

/**
 * Get winner display text.
 */
export function getWinnerText(winner: string): string {
  if (winner === "tie") return "It's a Tie!";
  return `${capitalize(winner)} Wins!`;
}
