import { useState, type FormEvent } from "react";
import type { ModelName, BattleRequest } from "../../types/battle.types";
import { AI_MODELS } from "../../../../shared/config";
import Loader from "../../../../shared/components/Loader";

interface BattleFormProps {
  onSubmit: (data: BattleRequest) => void;
  isLoading: boolean;
}

export default function BattleForm({ onSubmit, isLoading }: BattleFormProps) {
  const [problem, setProblem] = useState("");
  const [modelA, setModelA] = useState<ModelName>("mixtral");
  const [modelB, setModelB] = useState<ModelName>("cohere");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!problem.trim() || problem.trim().length < 5) {
      setError("Problem must be at least 5 characters.");
      return;
    }
    if (modelA === modelB) {
      setError("Please select two different models.");
      return;
    }

    onSubmit({ problem: problem.trim(), modelA, modelB });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Problem Input */}
      <div>
        <label
          htmlFor="battle-problem"
          className="block text-sm font-medium text-arena-300 mb-2"
        >
          ⚡ Problem Statement
        </label>
        <textarea
          id="battle-problem"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Describe the coding problem or challenge for the AI models to solve..."
          rows={4}
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-xl bg-arena-800/80 border border-arena-600/50 text-arena-100 
            placeholder:text-arena-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/40 
            focus:border-neon-cyan/50 transition-all duration-200 text-sm resize-none
            disabled:opacity-50 font-mono"
        />
      </div>

      {/* Model Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ModelSelect
          label="🥊 Model A (Challenger)"
          value={modelA}
          onChange={setModelA}
          otherModel={modelB}
          disabled={isLoading}
        />
        <ModelSelect
          label="🥊 Model B (Defender)"
          value={modelB}
          onChange={setModelB}
          otherModel={modelA}
          disabled={isLoading}
        />
      </div>

      {/* VS indicator */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-3">
          <ModelBadge model={modelA} />
          <span className="text-2xl font-extrabold gradient-text-warm">VS</span>
          <ModelBadge model={modelB} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-neon-orange via-neon-pink to-neon-purple text-white 
          font-bold text-sm hover:opacity-90 transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-lg shadow-neon-pink/20 hover:shadow-neon-pink/30
          flex items-center justify-center gap-2 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader size="button" />
            <span>AI Models are battling…</span>
          </>
        ) : (
          <>
            <span>⚔️</span> Start Battle
          </>
        )}
      </button>
    </form>
  );
}

// ── Model Select ────────────────────────────────────────────────────
function ModelSelect({
  label,
  value,
  onChange,
  otherModel,
  disabled,
}: {
  label: string;
  value: ModelName;
  onChange: (v: ModelName) => void;
  otherModel: ModelName;
  disabled: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-arena-300 mb-2">
        {label}
      </label>
      <div className="space-y-2">
        {AI_MODELS.map((model) => {
          const isSelected = value === model.value;
          const isOther = otherModel === model.value;
          return (
            <button
              key={model.value}
              type="button"
              disabled={disabled || isOther}
              onClick={() => onChange(model.value as ModelName)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? "bg-arena-700/80 border-2 shadow-lg"
                    : isOther
                    ? "bg-arena-800/40 border border-arena-700/30 opacity-40 cursor-not-allowed"
                    : "bg-arena-800/60 border border-arena-700/40 hover:bg-arena-700/50 hover:border-arena-600"
                }`}
              style={
                isSelected
                  ? { borderColor: model.color, boxShadow: `0 0 20px ${model.color}20` }
                  : {}
              }
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: model.color }}
              />
              <span className={isSelected ? "text-arena-100" : "text-arena-400"}>
                {model.label}
              </span>
              {isSelected && (
                <span className="ml-auto text-xs" style={{ color: model.color }}>
                  Selected
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Small model badge ───────────────────────────────────────────────
function ModelBadge({ model }: { model: string }) {
  const m = AI_MODELS.find((ai) => ai.value === model);
  return (
    <span
      className="px-3 py-1 rounded-lg text-xs font-bold text-white/90"
      style={{ backgroundColor: m?.color || "#6b7280" }}
    >
      {m?.label || model}
    </span>
  );
}
