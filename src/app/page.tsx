'use client';
import React, { useState, useEffect } from 'react';

export default function Page() {
  const [games, setGames] = useState<any>(null);
  const [status, setStatus] = useState('Initializing...');
  const API_KEY = '6a2a23c0116d4c2cc4abb4163144e7c1';

  useEffect(() => {
    async function getOdds() {
      try {
        setStatus('Scanning Markets...');
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
        <h1 style={{ color: '#3B82F6', margin: 0, fontSize: '24px' }}>EDGEWIELD <span style={{fontSize: '10px', verticalAlign: 'middle', color: '#10b981'}}>PRO</span></h1>
        <p style={{ fontSize: '10px', color: '#64748B' }}>{status.toUpperCase()}</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {games && games.map((game: any) => {
          // SIMPLE EDGE LOGIC: 
          // If the first bookie is offering > +150 on an underdog, let's flag it for now
          // We will refine this math tomorrow with a true "No-Vig" formula
          const oddsValue = game.bookmakers?.[0]?.markets?.[0]?.outcomes?.[0]?.price || 0;
          const isEdge = oddsValue > 150; 

          return (
            <div key={game.id} style={{ 
              background: '#0f172a', 
              padding: '15px', 
              borderRadius: '12px', 
              border: isEdge ? '1px solid #F59E0B' : '1px solid #1e293b',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {isEdge && <div style={{ position: 'absolute', top: 0, right: 0, background: '#F59E0B', color: 'black', fontSize: '8px', padding: '2px 8px', fontWeight: 'bold' }}>VALUE DETECTED</div>}
              
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>{game.home_team} vs {game.away_team}</div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                {game.bookmakers?.[0]?.markets?.[0]?.outcomes?.map((out: any, i: number) => (
                  <div key={i} style={{ flex: 1, background: '#050608', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #3B82F6' }}>
                    <div style={{ fontSize: '9px', color: '#64748B' }}>{out.name}</div>
                    <div style={{ color: isEdge ? '#F59E0B' : '#10b981', fontWeight: 'bold' }}>{out.price > 0 ? `+${out.price}` : out.price}</div>
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
