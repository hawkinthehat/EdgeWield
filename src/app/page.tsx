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
        setStatus('Scanning...');
        const url = `https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${API_KEY}&regions=us&markets=h2h&oddsFormat=american`;
        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data)) {
          // @ts-ignore
          setGames(data.slice(0, 20));
          setStatus('Live');
        }
      } catch (err: any) { setStatus('Error'); }
    }
    getOdds();
    const interval = setInterval(getOdds, 60000); // Auto-refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: '#02040a', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #1e293b', paddingBottom: '15px' }}>
        <h1 style={{ color: '#3B82F6', margin: 0, fontSize: '20px', fontWeight: '900' }}>EDGE<span style={{color: '#fff'}}>WIELD</span></h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
          <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748B' }}>{status}</span>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {games && games.map((game: any) => {
          let bestHome = -9999;
          let bestAway = -9999;
          let homeBook = "N/A";
          let awayBook = "N/A";

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
            <div key={game.id} style={{ background: '#0f172a', padding: '15px', borderRadius: '12px', border: edge > 0 ? '1px solid #10b981' : '1px solid #1e293b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{game.home_team} vs {game.away_team}</div>
                <div style={{ background: edge > 0 ? '#10b981' : '#1e293b', color: edge > 0 ? '#000' : '#94a3b8', padding: '3px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold' }}>
                  {edge > 0 ? `+${edge.toFixed(1)}% ARB` : `${edge.toFixed(1)}% HOLD`}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ background: '#02040a', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '8px', color: '#64748B', marginBottom: '2px' }}>{homeBook}</div>
                  <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>{bestHome > 0 ? `+${bestHome}` : bestHome}</div>
                </div>
                <div style={{ background: '#02040a', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '8px', color: '#64748B', marginBottom: '2px' }}>{awayBook}</div>
                  <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>{bestAway > 0 ? `+${bestAway}` : bestAway}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
