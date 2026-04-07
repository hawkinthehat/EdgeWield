import { getLiveOdds } from '@/lib/odds';

export default async function OddsList() {
  const games = await getLiveOdds('americanfootball_nfl');

  return (
    <div className="grid gap-4">
      {games.map((game) => (
        <div
          key={game.id}
          className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">NFL Live</p>
            <p className="font-semibold text-slate-800">
              {game.away_team} @ {game.home_team}
            </p>
          </div>

          <div className="text-right">
            <span className="mb-1 block text-xs text-slate-500">Best Market Price</span>
            <button className="rounded-lg bg-blue-600 px-4 py-2 font-mono font-bold text-white hover:bg-blue-700">
              {game.best_home_odds === null
                ? 'N/A'
                : game.best_home_odds > 0
                  ? `+${game.best_home_odds}`
                  : game.best_home_odds}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
