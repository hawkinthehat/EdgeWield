'use client';
import React, { useState, useEffect } from 'react';

export default function Page() {
  const [games, setGames] = useState<any>(null);
  const [status, setStatus] = useState('Initializing...');
  const API_KEY = '6a2a23c0116d4c2cc4abb4163144e7c1';

  const getProb = (odds: number) => {
    if (odds > 0) return 100 / (odds + 100);
    return Math.abs(odds) / (Math.abs(odds) + 100);
  };

  useEffect(() => {
    async function getOdds() {
      try {
        setStatus('Scanning 50+ Books...');
        const url = `https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${API_KEY}&regions=us&markets=h2h&oddsFormat=american`;
        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data)) {
          // @ts-ignore
          setGames(data.slice(0, 15));
          setStatus('Live');
        }
      } catch (err: any) { setStatus('Error'); }
    }
    getOdds();
  }, []);

  return (
    <div style={{ backgroundColor: '#050608', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#3B82F6', margin: 0, fontSize: '24px', fontWeight: '900' }}>EDGEWIELD</h1>
        <div style={{ fontSize: '10px', color: '#10b981', marginTop: '5px', letterSpacing: '2px' }}>MULTI-BOOK SCANNER ACTIVE</div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {games && games.map((game: any) => {
          // NEW LOGIC: Find the BEST odds across ALL available bookmakers
          let bestHome = -9999;
          let bestAway = -9999;
          let homeBook = "";
          let awayBook = "";

          game.bookmakers?.forEach((book: any) => {
            const market = book.markets?.[0];
            if (market) {
              const hOdds = market.outcomes[0]?.price;
              const aOdds = market.outcomes[1]?.price;
              if (hOdds > bestHome) { bestHome = hOdds; homeBook = book.title; }
              if (aOdds > bestAway) { bestAway = aOdds; awayBook = book.title; }
            }
          });

          const edge = (1 - (getProb(bestHome) + getProb(bestAway))) * 100;

          return (
            <div key={game.id} style={{ background: '#0f172a', padding: '18px', borderRadius: '16px', border: edge > 0 ? '2px solid #10b981' : '1px solid #1e293b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{game.home_team} vs {game.away_team}</div>
                <div style={{ background: edge > 0 ? '#10b981' : '#1e293b', color: edge > 0 ? 'black' : '#94a3b8', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '900' }}>
                  {edge > 0 ? `+${edge.toFixed(1)}% ARB` : `${edge.toFixed(1)}% HOLD`}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: '#050608', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '9px', color: '#64748B' }}>{homeBook || 'Home'}</div>
                  <div style={{ color: '#fff', fontWeight: 'bold' }}>{bestHome > 0 ? `+${bestHome}` : bestHome}</div>
                </div>
                <div style={{ background: '#050608', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '9px', color: '#64748B' }}>{awayBook || 'Away'}</div>
                  <div style={{ color: '#fff', fontWeight: 'bold' }}>{bestAway > 0 ? `+${bestAway}` : bestAway}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
