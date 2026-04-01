'use client';

import { useEffect, useMemo, useState } from 'react';

type Outcome = {
  name: string;
  price: number;
};

type Market = {
  outcomes: Outcome[];
};

type Bookmaker = {
  key: string;
  title: string;
  markets: Market[];
  link?: string;
  referral_label?: string;
};

type Game = {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  bookmakers: Bookmaker[];
};

type BetBridgeButtonProps = {
  bookmaker: string;
  marketData: {
    name: string;
    price: number;
    link?: string;
  };
};

function BetBridgeButton({ bookmaker, marketData }: BetBridgeButtonProps) {
  const handleBetClick = () => {
    if (marketData.link) {
      window.location.assign(marketData.link);
      return;
    }

    const schemes: Record<string, string> = {
      fanduel: 'fanduel://sportsbook',
      draftkings: 'draftkings://sportsbook',
      betmgm: 'betmgm://sportsbook',
    };
    window.location.href = schemes[bookmaker.toLowerCase()] ?? '#';
  };

  const brandStyles: Record<string, string> = {
    fanduel: 'bg-[#0062E3] hover:bg-[#0051ba]',
    draftkings: 'bg-[#51A341] hover:bg-[#438a35]',
    betmgm: 'bg-[#1A1A1A] border-b-2 border-[#CCAD60]',
  };

  return (
    <button
      onClick={handleBetClick}
      type="button"
      className={`${brandStyles[bookmaker.toLowerCase()] ?? 'bg-slate-700'} flex w-full items-center justify-between rounded-lg px-4 py-2 text-white shadow-md transition-transform active:scale-95`}
    >
      <span className="text-xs font-bold uppercase">{bookmaker}</span>
      <span className="font-mono text-sm font-black">
        {marketData.price > 0 ? `+${marketData.price}` : marketData.price}
      </span>
    </button>
  );
}

export default function MasterTerminal() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const env =
    typeof process !== 'undefined' && process.env
      ? process.env
      : ({} as Record<string, string | undefined>);
  const API_KEY = env.NEXT_PUBLIC_THE_ODDS_API_KEY ?? '';
  const SPORT = env.NEXT_PUBLIC_THE_ODDS_SPORT ?? 'americanfootball_nfl';

  const oddsUrl = useMemo(() => {
    if (!API_KEY) {
      return '';
    }
    return `https://api.the-odds-api.com/v4/sports/${SPORT}/odds/?apiKey=${API_KEY}&regions=us&markets=h2h&oddsFormat=american`;
  }, [API_KEY, SPORT]);

  useEffect(() => {
    const fetchOdds = async () => {
      if (!oddsUrl) {
        setError('Set NEXT_PUBLIC_THE_ODDS_API_KEY to load live odds.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(oddsUrl);
        if (!res.ok) {
          setError(`Odds request failed (${res.status}).`);
          setLoading(false);
          return;
        }

        const data = (await res.json()) as Game[];
        setGames(data);
      } catch {
        setError('Unable to fetch odds right now.');
      } finally {
        setLoading(false);
      }
    };

    void fetchOdds();
  }, [oddsUrl]);

  if (loading) {
    return <div className="p-10 text-center text-slate-500 animate-pulse">Loading Live Lines...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-black tracking-tighter italic text-slate-900">
            EDGEWIELD <span className="text-blue-600">v1.0</span>
          </h1>
          <p className="text-sm text-slate-500">Live Market Arbitrage &amp; Deep Links</p>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between bg-slate-900 p-4 text-white">
                <div className="flex items-center gap-4">
                  <div className="rounded bg-blue-600 px-2 py-1 text-xs font-bold">LIVE</div>
                  <span className="text-sm font-bold uppercase tracking-wide">
                    {game.home_team} <span className="mx-1 text-slate-400">vs</span> {game.away_team}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Starts:{' '}
                  {new Date(game.commence_time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 lg:grid-cols-3">
                {game.bookmakers.map((book) => (
                  <div key={book.key} className="space-y-2">
                    {(book.markets[0]?.outcomes ?? []).map((outcome) => (
                      <BetBridgeButton
                        key={`${book.key}-${outcome.name}`}
                        bookmaker={book.title || book.key}
                        marketData={{
                          name: outcome.name,
                          price: outcome.price,
                          link: book.link ?? book.referral_label,
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
