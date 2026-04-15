'use client';
import React, { useState, useEffect } from 'react';

export default function Page() {
  const [games, setGames] = useState<any>(null);
  const API_KEY = '6a2a23c0116d4c2cc4abb4163144e7c1';

  // Function to convert American Odds to Probability
  const getProb = (odds: number) => {
    if (odds > 0) return 100 / (odds + 100);
    return Math.abs(odds) / (Math.abs(odds) + 100);
  };

  useEffect(() => {
    async function getOdds() {
      const res = await fetch(`https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${API_KEY}&regions=us&markets=h2h&oddsFormat=american`);
      const data = await res.json();
      if (Array.isArray(data)) {
        // @ts-ignore
        setGames(data.slice(0, 15));
      }
    }
    getOdds();
  }, []);

  return (
    <div style={{ backgroundColor: '#050608', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#3B82F6', fontSize: '22px', letterSpacing: '2px', marginBottom: '30px' }}>EDGEWIELD ENGINE</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {games && games.map((game: any) => {
          // Logic: We compare the two outcomes. 
          // If the total implied probability is low, the bookie is "loose" and there is an edge.
          const outcomes = game.bookmakers?.[0]?.markets?.[0]?.outcomes || [];
          const prob1 = getProb(outcomes[0]?.price || 0);
          const prob2 = getProb(outcomes[1]?.price || 0);
          const totalProb = prob1 + prob2;
          const edge = (1 - totalProb) * 100; // Simplified edge calculation

          return (
            <div key={game.id} style={{ background: '#0f172a', padding: '20px', borderRadius: '15px', border: edge > 2 ? '1px solid #10b981' : '1px solid #1e293b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{game.home_team} vs {game.away_team}</div>
                {edge > 0 && (
                  <div style={{ background: '#10b981', color: 'black', padding: '4px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: '900' }}>
                    +{edge.toFixed(1)}% EDGE
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {outcomes.map((out: any, i: number) => (
                  <div key={i} style={{ flex: 1, background: '#050608', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid #1e293b' }}>
                    <div style={{ fontSize: '10px', color: '#64748B', marginBottom: '5px' }}>{out.name}</div>
                    <div style={{ color: '#fff', fontWeight: 'bold' }}>{out.price > 0 ? `+${out.price}` : out.price}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
