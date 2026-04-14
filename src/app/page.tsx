'use client';
import { useState, useEffect } from 'react';

export default function EdgeWieldApp() {
  const [view, setView] = useState('scanner'); // 'scanner' or 'steam'
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  
  // Simulated Steam Data
  const steamAlerts = [
    { move: "KC Chiefs -3.5 → -5.5", bookies: "Global", intensity: "CRITICAL", time: "2m ago" },
    { move: "O 220.5 → O 224.5", bookies: "Vegas", intensity: "HIGH", time: "5m ago" },
    { move: "Connor McGregor ML", bookies: "Pinnacle", intensity: "SUDDEN", time: "Just Now" },
  ];

  const scannerBets = [
    { market: "NBA - Lakers vs Nuggets", edge: "+4.2%", bookie: "DraftKings", odds: "-110" },
    { market: "MLB - Yankees vs Red Sox", edge: "+2.8%", bookie: "FanDuel", odds: "+125" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: '#050608', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', padding: '20px' }}>
      
      {/* Navigation Toggle */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <button 
          onClick={() => setView('scanner')}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: view === 'scanner' ? '#3B82F6' : '#1e293b', color: 'white', fontWeight: 'bold' }}>
          SCANNER
        </button>
        <button 
          onClick={() => setView('steam')}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: view === 'steam' ? '#EF4444' : '#1e293b', color: 'white', fontWeight: 'bold' }}>
          STEAM ROOM
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span style={{ fontSize: '12px', color: '#64748B' }}>STATUS: <span style={{ color: '#10b981' }}>CONNECTED</span></span>
        <span style={{ fontSize: '12px', color: '#64748B' }}>{lastUpdated}</span>
      </div>

      {view === 'scanner' ? (
        /* SCANNER VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {scannerBets.map((bet, i) => (
            <div key={i} style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3B82F6', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '14px' }}>{bet.market}</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>{bet.bookie}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>{bet.edge}</div>
                <div style={{ fontSize: '12px' }}>{bet.odds}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* STEAM ROOM VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {steamAlerts.map((alert, i) => (
            <div key={i} style={{ background: '#1a1010', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #EF4444' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#EF4444', fontWeight: 'bold', fontSize: '12px' }}>⚠ {alert.intensity} STEAM</span>
                <span style={{ fontSize: '10px', color: '#64748B' }}>{alert.time}</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{alert.move}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Source: {alert.bookies}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}