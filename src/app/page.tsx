'use client';
import React, { useState, useEffect } from 'react';

export default function Page() {
  const [games, setGames] = useState<any>(null);
  const [status, setStatus] = useState('Initializing...');
  const API_KEY = '6a2a23c0116d4c2cc4abb4163144e7c1';

  // Math: Convert American Odds to Implied Probability
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
          setGames(data.slice(0, 15));
          setStatus('Live');
        }
      } catch (err: any) {
        setStatus('Error');
      }
    }
    getOdds();
  }, []);

  return (
    <div style={{ backgroundColor: '#050608', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#3B82F6', margin: 0, fontSize: '24px', letterSpacing: '1px' }}>EDGEWIELD</h1>
        <div style={{ fontSize: '10px', color: '#64748B', marginTop: '5px' }}>MARKET SCANNER • {status.toUpperCase()}</div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {games && games.map((game: any) => {
          // Math Logic: Calculate the Bookie's "Hold" (Vig)
          const outcomes = game.bookmakers?.[0]?.markets?.[0]?.outcomes || [];
          if (outcomes.length < 2) return null;

          const prob1 = getProb(outcomes[0]?.price || 0);
          const prob2 = getProb(outcomes[1]?.price || 0);
          
          // Hold is how much over 100% the probabilities add up to.
          // Example: 52% + 52% = 104% (4% Hold/Tax)
          const marketHold = (prob1 + prob2 - 1) * 100;
          const edgeValue = (marketHold * -1); // Positive means value for us

          return (
            <div key={game.id} style={{ 
              background: '#0f172a', 
              padding: '18px', 
              borderRadius: '16px', 
              border: '1px solid #1e293b'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginBottom: '2px' }}>{game.sport_title}</div>
                  <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{game.home_team} vs {game.away_team}</div>
                </div>
                
                {/* Status Badge: Green if Edge, Grey if Hold */}
                <div style={{ 
                  background: edgeValue > 0 ? '#10b981' : '#1e293b', 
                  color: edgeValue > 0 ? 'black' : '#94a3b8', 
                  padding: '5px 10px', 
                  borderRadius: '6px', 
                  fontSize: '10px', 
                  fontWeight: 'bold' 
                }}>
                  {edgeValue > 0 ? `+${edgeValue.toFixed(1)}% EDGE` : `${edgeValue.toFixed(1)}% HOLD`}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {outcomes.map((out: any, i: number) => (
                  <div key={i} style={{ flex: 1, background: '#050608', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid #1e293b' }}>
                    <div style={{ fontSize: '9px', color: '#64748B', marginBottom: '4px' }}>{out.name}</div>
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