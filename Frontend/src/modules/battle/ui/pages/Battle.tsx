import { useBattle } from "../../hooks/useBattle";
import BattleForm from "../components/BattleForm";
import BattleResultView from "../components/BattleResult";
import Loader from "../../../../shared/components/Loader";

export default function Battle() {
  const { currentBattle, isBattling, startBattle, clearCurrentBattle } = useBattle();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-extrabold">
          <span className="gradient-text-warm">AI Battle</span>{" "}
          <span className="text-arena-100">Arena</span>
        </h1>
        <p className="text-arena-400 mt-2 max-w-lg mx-auto">
          Choose two AI models, present a coding challenge, and watch them go head-to-head.
          A judge scores both solutions.
        </p>
      </div>

      {/* Battle Loading Overlay */}
      {isBattling && (
        <div className="glass rounded-2xl p-12 text-center mb-8 animate-fade-in-up">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-orange to-neon-pink opacity-20 absolute inset-0 animate-pulse-glow" />
            <div className="relative">
              <Loader size="inline" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-arena-200 mb-1">
            ⚔️ Battle in Progress
          </h3>
          <p className="text-arena-400 text-sm">
            AI models are solving the problem... This may take up to 2 minutes.
          </p>
          <div className="mt-4 h-1 max-w-xs mx-auto rounded-full bg-arena-700 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-neon-orange to-neon-pink animate-shimmer" />
          </div>
        </div>
      )}

      {/* Show result or form */}
      {currentBattle && !isBattling ? (
        <div className="animate-fade-in-up">
          <BattleResultView
            result={currentBattle}
            onNewBattle={clearCurrentBattle}
          />
        </div>
      ) : !isBattling ? (
        <div className="glass rounded-2xl p-6 sm:p-8 animate-fade-in-up">
          <BattleForm onSubmit={startBattle} isLoading={isBattling} />
        </div>
      ) : null}
    </div>
  );
}
