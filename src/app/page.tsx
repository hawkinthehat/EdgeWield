'use client';
import { useState, useEffect } from 'react';

export default function EdgeWieldApp() {
  const [view, setView] = useState('scanner'); 
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  
  const steamAlerts = [
    { move: "KC Chiefs -3.5 → -5.5", intensity: "CRITICAL", time: "2m ago" },
    { move: "Lakers ML +150 → +110", intensity: "HIGH", time: "5m ago" },
    { move: "O 220.5 → O 224.5", intensity: "SUDDEN", time: "Just Now" },
  ];

  const scannerBets = [
    { market: "NBA - Lakers vs Nuggets", edge: "+4.2%", bookie: "DraftKings" },
    { market: "MLB - Yankees vs Red Sox", edge: "+2.8%", bookie: "FanDuel" },
  ];

  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date().toLocaleTimeString()), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: '#050608', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <button onClick={() => setView('scanner')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: view === 'scanner' ? '#3B82F6' : '#1e293b', color: 'white', fontWeight: 'bold' }}>SCANNER</button>
        <button onClick={() => setView('steam')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: view === 'steam' ? '#EF4444' : '#1e293b', color: 'white', fontWeight: 'bold' }}>STEAM ROOM</button>
      </div>

      {view === 'scanner' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{color: '#3B82F6'}}>LIVE SCANNER</h3>
          {scannerBets.map((bet, i) => (
            <div key={i} style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3B82F6', display: 'flex', justifyContent: 'space-between' }}>
              <span>{bet.market}</span>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>{bet.edge}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{color: '#EF4444'}}>STEAM ALERT ROOM</h3>
          {steamAlerts.map((alert, i) => (
            <div key={i} style={{ background: '#1a1010', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #EF4444' }}>
              <div style={{ color: '#EF4444', fontWeight: 'bold', fontSize: '11px' }}>{alert.intensity}</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{alert.move}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}