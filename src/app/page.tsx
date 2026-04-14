'use client'; // This tells Next.js this page is interactive
import { useState, useEffect } from 'react';

export default function EdgeScanner() {
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [bets, setBets] = useState([
    { market: "NBA - Lakers vs Nuggets", edge: "+4.2%", bookie: "DraftKings", odds: "-110" },
    { market: "MLB - Yankees vs Red Sox", edge: "+2.8%", bookie: "FanDuel", odds: "+125" },
    { market: "UFC - Jones vs Miocic", edge: "+6.1%", bookie: "Pinnacle", odds: "-105" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate a new bet arriving
      setLastUpdated(new Date().toLocaleTimeString());
      
      // This logic "shuffles" the edges slightly to simulate real-time odds shifting
      setBets(currentBets => currentBets.map(bet => ({
        ...bet,
        edge: "+" + (Math.random() * (7 - 2) + 2).toFixed(1) + "%"
      })));
    }, 5000); // Updates every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: '#050608', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '10px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>EDGE<span style={{ color: '#3B82F6' }}>WIELD</span></h1>
        <div style={{ color: '#10b981', fontSize: '12px' }}>● LIVE FEED: {lastUpdated}</div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '30px' }}>
        {['3.4% Avg Edge', '1,204 Scans', '+12% ROI'].map(stat => (
          <div key={stat} style={{ background: '#0f172a', padding: '10px', borderRadius: '4px', border: '1px solid #1e293b', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>{stat}</div>
        ))}
      </div>

      {/* Scanner Table */}
      <div style={{ background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
        {bets.map((bet, i) => (
          <div key={i} style={{ padding: '15px', borderBottom: '1px solid #1e293b', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center' }}>
            <div>
               <div style={{ fontSize: '14px', fontWeight: '600' }}>{bet.market}</div>
               <div style={{ fontSize: '11px', color: '#64748B' }}>{bet.bookie}</div>
            </div>
            <div style={{ fontFamily: 'monospace', textAlign: 'center' }}>{bet.odds}</div>
            <div style={{ color: '#10b981', fontWeight: 'bold', textAlign: 'right', fontSize: '18px' }}>{bet.edge}</div>
          </div>
        ))}
      </div>
    </div>
  );
}