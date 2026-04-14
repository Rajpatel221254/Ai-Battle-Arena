import type { BattleResult } from "../../types/battle.types";
import { capitalize, getModelColor, getWinnerText, formatDate } from "../../../../shared/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface BattleResultProps {
  result: BattleResult;
  onNewBattle?: () => void;
}

export default function BattleResultView({ result, onNewBattle }: BattleResultProps) {
  const isTie = result.winner === "tie";
  const winnerColor = isTie ? "#f59e0b" : getModelColor(result.winner);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Winner Banner */}
      <div
        className="text-center py-6 px-4 rounded-2xl border"
        style={{
          background: `linear-gradient(135deg, ${winnerColor}10, ${winnerColor}05)`,
          borderColor: `${winnerColor}30`,
        }}
      >
        <div className="text-4xl mb-2">{isTie ? "🤝" : "🏆"}</div>
        <h2 className="text-2xl font-extrabold" style={{ color: winnerColor }}>
          {getWinnerText(result.winner)}
        </h2>
        <p className="text-arena-400 text-sm mt-1">
          {result.fromCache && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-arena-700/60 text-xs text-arena-300 mr-2">
              ⚡ Cached
            </span>
          )}
          {formatDate(result.createdAt)}
        </p>
      </div>

      {/* Score Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <ScoreCard
          model={result.modelA}
          score={result.scoreA}
          isWinner={result.winner === result.modelA}
        />
        <ScoreCard
          model={result.modelB}
          score={result.scoreB}
          isWinner={result.winner === result.modelB}
        />
      </div>

      {/* Score Bar */}
      <div className="glass-light rounded-xl p-4">
        <div className="flex items-center justify-between text-xs text-arena-400 mb-2">
          <span>{capitalize(result.modelA)}</span>
          <span>{capitalize(result.modelB)}</span>
        </div>
        <div className="h-3 rounded-full bg-arena-700 overflow-hidden flex">
          <div
            className="h-full rounded-l-full transition-all duration-1000"
            style={{
              width: `${(result.scoreA / (result.scoreA + result.scoreB || 1)) * 100}%`,
              backgroundColor: getModelColor(result.modelA),
            }}
          />
          <div
            className="h-full rounded-r-full transition-all duration-1000"
            style={{
              width: `${(result.scoreB / (result.scoreA + result.scoreB || 1)) * 100}%`,
              backgroundColor: getModelColor(result.modelB),
            }}
          />
        </div>
      </div>

      {/* Problem */}
      <div className="glass-light rounded-xl p-5">
        <h3 className="text-sm font-semibold text-arena-300 mb-2">📋 Problem</h3>
        <p className="text-arena-200 text-sm leading-relaxed font-mono whitespace-pre-wrap">
          {result.problem}
        </p>
      </div>

      {/* Responses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ResponseCard
          model={result.modelA}
          response={result.responseA}
          reasoning={result.reasoningA}
          score={result.scoreA}
          isWinner={result.winner === result.modelA}
        />
        <ResponseCard
          model={result.modelB}
          response={result.responseB}
          reasoning={result.reasoningB}
          score={result.scoreB}
          isWinner={result.winner === result.modelB}
        />
      </div>

      {/* New Battle Button */}
      {onNewBattle && (
        <div className="text-center pt-2">
          <button
            onClick={onNewBattle}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-arena-900 
              font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-neon-cyan/20 cursor-pointer"
          >
            ⚔️ Start New Battle
          </button>
        </div>
      )}
    </div>
  );
}

// ── Score Card ───────────────────────────────────────────────────────
function ScoreCard({
  model,
  score,
  isWinner,
}: {
  model: string;
  score: number;
  isWinner: boolean;
}) {
  const color = getModelColor(model);
  return (
    <div
      className={`rounded-xl p-5 text-center border transition-all ${
        isWinner ? "shadow-lg" : "glass-light"
      }`}
      style={
        isWinner
          ? {
              background: `linear-gradient(135deg, ${color}15, ${color}08)`,
              borderColor: `${color}40`,
              boxShadow: `0 8px 32px ${color}15`,
            }
          : { borderColor: "transparent" }
      }
    >
      {isWinner && <div className="text-xl mb-1">👑</div>}
      <div
        className="text-3xl font-extrabold"
        style={{ color: isWinner ? color : undefined }}
      >
        {score}<span className="text-lg text-arena-500">/10</span>
      </div>
      <div className="text-sm font-medium mt-1" style={{ color }}>
        {capitalize(model)}
      </div>
    </div>
  );
}

// ── Response Card ───────────────────────────────────────────────────
function ResponseCard({
  model,
  response,
  reasoning,
  score,
  isWinner,
}: {
  model: string;
  response: string;
  reasoning: string;
  score: number;
  isWinner: boolean;
}) {
  const color = getModelColor(model);
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: `${color}25` }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: `${color}10` }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-bold" style={{ color }}>
            {capitalize(model)}
          </span>
          {isWinner && <span className="text-xs">👑</span>}
        </div>
        <span className="text-xs font-mono text-arena-400">
          {score}/10
        </span>
      </div>

      {/* Response */}
      <div className="p-4 bg-arena-800/40">
        <h4 className="text-xs font-semibold text-arena-400 mb-2 uppercase tracking-wide">
          Response
        </h4>
        <div className="text-arena-200 text-xs leading-relaxed max-h-64 overflow-y-auto prose prose-invert prose-sm max-w-none prose-pre:bg-[#1e1e1e] prose-pre:p-0 prose-pre:-mx-0">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus as any}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-md border border-arena-700/50 text-xs !my-2"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-arena-700/50 px-1 py-0.5 rounded text-arena-100" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {response || "No response generated."}
          </ReactMarkdown>
        </div>
      </div>

      {/* Reasoning */}
      <div className="p-4 border-t border-arena-700/30">
        <h4 className="text-xs font-semibold text-arena-400 mb-2 uppercase tracking-wide">
          Judge's Reasoning
        </h4>
        <p className="text-arena-300 text-xs leading-relaxed">
          {reasoning || "No reasoning provided."}
        </p>
      </div>
    </div>
  );
}
