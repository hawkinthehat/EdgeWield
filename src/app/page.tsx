'use client';
import { useState, useEffect } from 'react';

export default function EdgeWield() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_KEY = '6a2a23c0116d4c2cc4abb4163144e7c1';

  useEffect(() => {
    async function fetchOdds() {
      try {
        // Fetching upcoming NBA games (you can change 'basketball_nba' to 'upcoming')
        const response = await fetch(`https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?apiKey=${API_KEY}&regions=us&markets=h2h&oddsFormat=american`);
        const data = await response.json();
        setGames(data.slice(0, 10)); // Just take the top 10 games
        setLoading(false);
      } catch (error) {
        console.error("Error fetching odds:", error);
        setLoading(false);
      }
    }
    fetchOdds();
  }, []);

  return (
    <div style={{ backgroundColor: '#050608', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>
        EDGE<span style={{ color: '#3B82F6' }}>WIELD</span>
      </h1>
      <p style={{ textAlign: 'center', color: '#64748B', fontSize: '12px', marginBottom: '30px' }}>LIVE NBA MARKET DATA</p>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#3B82F6' }}>SCANNING THE MARKET...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {games.map((game, i) => (
            <div key={i} style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>
                {game.home_team} vs {game.away_team}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {game.bookmakers[0]?.markets[0]?.outcomes.map((outcome, idx) => (
                  <div key={idx} style={{ background: '#050608', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #3B82F6' }}>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>{outcome.name}</div>
                    <div style={{ fontWeight: 'bold', color: '#10b981' }}>{outcome.price > 0 ? `+${outcome.price}` : outcome.price}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '10px', color: '#475569', marginTop: '10px', textAlign: 'right' }}>
                Via {game.bookmakers[0]?.title || 'Global Books'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
