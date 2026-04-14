import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useBattle } from "../../hooks/useBattle";
import Loader from "../../../../shared/components/Loader";
import { formatDate, capitalize, getModelColor, truncate } from "../../../../shared/utils";

export default function Dashboard() {
  const { user } = useAuth();
  const { history, isLoading, fetchHistory } = useBattle();

  useEffect(() => {
    fetchHistory(1, 5);
  }, [fetchHistory]);

  const recentBattles = history.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero section */}
      <div className="relative overflow-hidden rounded-2xl glass p-8 sm:p-12 mb-8 animate-fade-in-up">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-neon-cyan/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-neon-purple/10 to-transparent rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl animate-float">⚔️</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-arena-50">
              Welcome back, <span className="gradient-text">{user?.name}</span>
            </h1>
          </div>
          <p className="text-arena-400 mt-2 text-lg max-w-2xl">
            Ready to pit AI models against each other? Start a new battle and watch them compete in real-time.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/battle"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-orange via-neon-pink to-neon-purple 
                text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-neon-pink/20"
            >
              ⚔️ Start New Battle
            </Link>
            <Link
              to="/history"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-light text-arena-300 
                font-medium text-sm hover:text-arena-100 hover:bg-arena-700/50 transition-all"
            >
              📊 View All History
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 stagger">
        <StatCard
          icon="⚔️"
          label="Total Battles"
          value={history.length > 0 ? `${history.length}+` : "0"}
          color="from-neon-cyan/20 to-neon-blue/10"
        />
        <StatCard
          icon="🏆"
          label="Last Winner"
          value={
            recentBattles.length > 0
              ? capitalize(recentBattles[0].winner)
              : "N/A"
          }
          color="from-neon-orange/20 to-neon-pink/10"
        />
        <StatCard
          icon="🤖"
          label="Models Available"
          value="4"
          color="from-neon-purple/20 to-neon-pink/10"
        />
      </div>

      {/* Recent Battles */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-arena-100">Recent Battles</h2>
          {recentBattles.length > 0 && (
            <Link
              to="/history"
              className="text-sm text-neon-cyan hover:text-neon-cyan/80 font-medium transition-colors"
            >
              View all →
            </Link>
          )}
        </div>

        {isLoading ? (
          <Loader label="Loading recent battles…" />
        ) : recentBattles.length === 0 ? (
          <div className="glass-light rounded-xl p-12 text-center">
            <div className="text-4xl mb-3">🎮</div>
            <h3 className="text-lg font-semibold text-arena-200 mb-1">
              No battles yet
            </h3>
            <p className="text-arena-400 text-sm mb-4">
              Start your first AI battle and see the results here!
            </p>
            <Link
              to="/battle"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple 
                text-arena-900 font-semibold text-sm hover:opacity-90 transition-all"
            >
              ⚔️ Start Battle
            </Link>
          </div>
        ) : (
          <div className="space-y-3 stagger">
            {recentBattles.map((battle) => (
              <BattleCard key={battle._id} battle={battle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stat Card ───────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="glass rounded-xl p-5 hover:border-arena-600/50 transition-all duration-200">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-lg mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-arena-100">{value}</p>
      <p className="text-sm text-arena-400 mt-0.5">{label}</p>
    </div>
  );
}

// ── Battle Card ─────────────────────────────────────────────────────
function BattleCard({ battle }: { battle: { _id: string; problem: string; modelA: string; modelB: string; scoreA: number; scoreB: number; winner: string; createdAt: string } }) {
  const isTie = battle.winner === "tie";
  return (
    <div className="glass-light rounded-xl p-4 hover:bg-arena-700/30 transition-all duration-200 group">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-arena-200 font-medium truncate">
            {truncate(battle.problem, 80)}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-md text-white/90"
              style={{ backgroundColor: getModelColor(battle.modelA) }}
            >
              {capitalize(battle.modelA)} ({battle.scoreA})
            </span>
            <span className="text-xs text-arena-500">vs</span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-md text-white/90"
              style={{ backgroundColor: getModelColor(battle.modelB) }}
            >
              {capitalize(battle.modelB)} ({battle.scoreB})
            </span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              isTie
                ? "bg-tie/15 text-tie"
                : "bg-win/15 text-win"
            }`}
          >
            {isTie ? "Tie" : `${capitalize(battle.winner)} wins`}
          </span>
          <p className="text-xs text-arena-500 mt-1">
            {formatDate(battle.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
