'use client';
import React, { useState, useEffect } from 'react';

export default function Page() {
  // 1. Initialize as null to break the "never[]" loop
  const [games, setGames] = useState<any>(null);
  const [status, setStatus] = useState('Initializing...');
  const API_KEY = '6a2a23c0116d4c2cc4abb4163144e7c1';

  useEffect(() => {
    async function getOdds() {
      try {
        setStatus('Fetching Live Markets...');
        const url = `https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${API_KEY}&regions=us&markets=h2h&oddsFormat=american`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('API Key Issue');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          // 2. The magic "ignore" comment for Vercel
          // @ts-ignore
          setGames(data.slice(0, 10));
          setStatus('Live');
        } else {
          setGames([]);
        }
      } catch (err: any) {
        setStatus('Error: ' + err.message);
      }
    }
    getOdds();
  }, []);

  return (
    <div style={{ backgroundColor: '#050608', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#3B82F6', margin: 0 }}>EDGEWIELD</h1>
        <p style={{ fontSize: '10px', color: '#64748B' }}>STATUS: {status}</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {games && games.length > 0 ? games.map((game: any) => (
          <div key={game.id} style={{ background: '#0f172a', padding: '15px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>{game.home_team} vs {game.away_team}</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {game.bookmakers?.[0]?.markets?.[0]?.outcomes?.map((out: any, i: number) => (
                <div key={i} style={{ flex: 1, background: '#050608', padding: '10px', borderRadius: '6px', textAlign: 'center', border: '1px solid #3B82F6' }}>
                  <div style={{ fontSize: '9px', color: '#64748B' }}>{out.name}</div>
                  <div style={{ color: '#10b981', fontWeight: 'bold' }}>{out.price}</div>
                </div>
              ))}
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '50px' }}>
            {status === 'Live' ? 'No games found.' : 'Scanning...'}
          </div>
        )}
      </div>
    </div>
  );
}
