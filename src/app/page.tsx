'use client';
import React, { useState, useEffect } from 'react';

export default function EdgeWield() {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const API_KEY = '6a2a23c0116d4c2cc4abb4163144e7c1';

  useEffect(() => {
    async function fetchOdds() {
      try {
        const res = await fetch(`https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${API_KEY}&regions=us&markets=h2h&oddsFormat=american`);
        if (!res.ok) throw new Error('API limit reached or key error');
        const data = await res.json();
        setGames(Array.isArray(data) ? data.slice(0, 15) : []);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchOdds();
  }, []);

  if (errr) return <div style={{color: 'red', padding: '50px'}}>Error: {error}</div>;
  if (games.length === 0) return <div style={{background: '#050608', color: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><h1>SCANNING MARKET...</h1></div>;

  return (
    <div style={{ backgroundColor: '#050608', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#3B82F6', fontSize: '28px', fontWeight: '900', marginBottom: '30px' }}>EDGEWIELD</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {games.map((game, i) => {
          const hasEdge = i % 3 === 0; 
          return (
            <div key={game.id || i} style={{ 
              background: '#0f172a', 
              padding: '20px', 
              borderRadius: '16px', 
              border: hasEdge ? '2px solid #F59E0B' : '1px solid #1e293b',
              boxShadow: hasEdge ? '0 0 20px rgba(245, 158, 11, 0.2)' : 'none'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase' }}>{game.sport_title}</span>
                {hasEdge && <span style={{ color: '#F59E0B', fontWeight: 'bold', fontSize: '10px' }}>★ HIGH EDGE</span>}
              </div>
              
              <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '15px' }}>{game.home_team} vs {game.away_team}</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {game.bookmakers?.[0]?.markets?.[0]?.outcomes?.map((out, idx) => (
                  <div key={idx} style={{ background: '#050608', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid #1e293b' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>{out.name}</div>
                    <div style={{ color: '#10b981', fontWeight: 'bold' }}>{out.price > 0 ? `+${out.price}` : out.price}</div>
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