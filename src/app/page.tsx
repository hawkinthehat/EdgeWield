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
      
      {/* Updated Toggle Buttons with Forced Colors */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <button 
          onClick={() => setView('scanner')} 
          style={{ 
            flex: 1, padding: '15px', borderRadius: '12px', border: 'none', 
            background: view === 'scanner' ? '#3B82F6' : '#1e293b', 
            color: 'white', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer',
            boxShadow: view === 'scanner' ? '0 0 15px rgba(59, 130, 246, 0.5)' : 'none'
          }}>
          SCANNER
        </button>
        <button 
          onClick={() => setView('steam')} 
          style={{ 
            flex: 1, padding: '15px', borderRadius: '12px', border: 'none', 
            background: view === 'steam' ? '#FF4444' : '#1e293b', 
            color: 'white', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer',
            boxShadow: view === 'steam' ? '0 0 15px rgba(255, 68, 68, 0.5)' : 'none'
          }}>
          STEAM ROOM
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
         <span style={{ fontSize: '11px', color: '#64748B', letterSpacing: '1px' }}>FEED UPDATED: {lastUpdated}</span>
      </div>

      {view === 'scanner' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{color: '#3B82F6', fontSize: '14px'}}>ACTIVE VALUE SCANS</h3>
          {scannerBets.map((bet, i) => (
            <div key={i} style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600' }}>{bet.market}</span>
              <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '18px' }}>{bet.edge}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{color: '#FF4444', fontSize: '14px'}}>MARKET STEAM ALERTS</h3>
          {steamAlerts.map((alert, i) => (
            <div key={i} style={{ background: '#1a1010', padding: '20px', borderRadius: '12px', border: '1px solid #450a0a' }}>
              <div style={{ color: '#FF4444', fontWeight: 'bold', fontSize: '11px', marginBottom: '5px' }}>{alert.intensity} MOVEMENT</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{alert.move}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}