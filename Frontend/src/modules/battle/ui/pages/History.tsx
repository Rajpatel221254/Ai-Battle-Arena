import { useEffect, useState } from "react";
import { useBattle } from "../../hooks/useBattle";
import Loader from "../../../../shared/components/Loader";
import {
  formatDate,
  capitalize,
  getModelColor,
  truncate,
} from "../../../../shared/utils";
import type { BattleHistoryItem } from "../../types/battle.types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function History() {
  const { history, pagination, isLoading, fetchHistory } = useBattle();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory(1, 10);
  }, [fetchHistory]);

  const loadMore = () => {
    if (pagination?.hasMore) {
      fetchHistory(pagination.page + 1, 10);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold text-arena-50">
          Battle <span className="gradient-text">History</span>
        </h1>
        <p className="text-arena-400 mt-1">
          {pagination
            ? `${pagination.total} total battles`
            : "Loading..."}
        </p>
      </div>

      {/* Content */}
      {isLoading && history.length === 0 ? (
        <Loader size="inline" label="Loading battle history…" />
      ) : history.length === 0 ? (
        <div className="glass-light rounded-xl p-12 text-center animate-fade-in-up">
          <div className="text-4xl mb-3">📭</div>
          <h3 className="text-lg font-semibold text-arena-200 mb-1">
            No battles found
          </h3>
          <p className="text-arena-400 text-sm">
            Start your first battle and it will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3 stagger">
            {history.map((battle) => (
              <HistoryRow
                key={battle._id}
                battle={battle}
                isExpanded={expandedId === battle._id}
                onToggle={() =>
                  setExpandedId((prev) =>
                    prev === battle._id ? null : battle._id
                  )
                }
              />
            ))}
          </div>

          {/* Load More */}
          {pagination?.hasMore && (
            <div className="text-center mt-6">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="px-6 py-3 rounded-xl glass-light text-arena-300 font-medium text-sm 
                  hover:text-arena-100 hover:bg-arena-700/50 transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader size="button" /> Loading…
                  </span>
                ) : (
                  `Load More (${pagination.total - history.length} remaining)`
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Expandable row ──────────────────────────────────────────────────
function HistoryRow({
  battle,
  isExpanded,
  onToggle,
}: {
  battle: BattleHistoryItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const isTie = battle.winner === "tie";
  const winnerColor = isTie ? "#f59e0b" : getModelColor(battle.winner);

  return (
    <div className="glass-light rounded-xl overflow-hidden transition-all duration-300 hover:bg-arena-700/30">
      {/* Summary row */}
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm text-arena-200 font-medium">
            {truncate(battle.problem, 90)}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <ModelBadge model={battle.modelA} score={battle.scoreA} />
            <span className="text-xs text-arena-500 font-semibold">VS</span>
            <ModelBadge model={battle.modelB} score={battle.scoreB} />
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <div className="text-right">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: `${winnerColor}20`,
                color: winnerColor,
              }}
            >
              {isTie ? "Tie" : `${capitalize(battle.winner)} wins`}
            </span>
            <p className="text-xs text-arena-500 mt-1">
              {formatDate(battle.createdAt)}
            </p>
          </div>
          <svg
            className={`w-4 h-4 text-arena-500 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-1 border-t border-arena-700/30 animate-fade-in-up space-y-4">
          {/* Problem */}
          <div>
            <h4 className="text-xs font-semibold text-arena-400 uppercase tracking-wide mb-1">
              Problem
            </h4>
            <p className="text-sm text-arena-200 font-mono whitespace-pre-wrap bg-arena-800/50 rounded-lg p-3">
              {battle.problem}
            </p>
          </div>

          {/* Responses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResponseBlock
              model={battle.modelA}
              response={battle.responseA}
              reasoning={battle.reasoningA}
              score={battle.scoreA}
              isWinner={battle.winner === battle.modelA}
            />
            <ResponseBlock
              model={battle.modelB}
              response={battle.responseB}
              reasoning={battle.reasoningB}
              score={battle.scoreB}
              isWinner={battle.winner === battle.modelB}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ModelBadge({ model, score }: { model: string; score: number }) {
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded-md text-white/90"
      style={{ backgroundColor: getModelColor(model) }}
    >
      {capitalize(model)} ({score})
    </span>
  );
}

function ResponseBlock({
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
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: `${color}25` }}
    >
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ background: `${color}10` }}
      >
        <span className="text-xs font-bold flex items-center gap-1.5" style={{ color }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          {capitalize(model)} {isWinner && "👑"}
        </span>
        <span className="text-xs font-mono text-arena-400">{score}/10</span>
      </div>
      <div className="p-3 space-y-2">
        <div className="text-xs text-arena-200 max-h-48 overflow-y-auto leading-relaxed prose prose-invert prose-sm max-w-none prose-pre:bg-[#1e1e1e] prose-pre:p-0 prose-pre:-mx-0">
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
        <div className="border-t border-arena-700/30 pt-2">
          <p className="text-xs text-arena-400 leading-relaxed">
            <span className="font-semibold text-arena-300">Reasoning: </span>
            {reasoning || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
