'use client';
import { useState, useEffect } from 'react';

export default function EdgeWieldApp() {
  const [view, setView] = useState('scanner'); 
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [calcOpen, setCalcOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState({ market: '', edge: '' });
  const [bankroll, setBankroll] = useState(1000);

  const scannerBets = [
    { market: "NBA - Lakers vs Nuggets", edge: "4.2", bookie: "DraftKings", odds: "-110" },
    { market: "MLB - Yankees vs Red Sox", edge: "2.8", bookie: "FanDuel", odds: "+125" },
  ];

  const openCalc = (bet) => {
    setSelectedBet(bet);
    setCalcOpen(true);
  };

  return (
    <div style={{ backgroundColor: '#050608', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', padding: '20px' }}>
      
      {/* View Toggles */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <button onClick={() => setView('scanner')} style={{ flex: 1, padding: '15px', borderRadius: '12px', border: 'none', background: view === 'scanner' ? '#3B82F6' : '#1e293b', color: 'white', fontWeight: 'bold' }}>SCANNER</button>
        <button onClick={() => setView('steam')} style={{ flex: 1, padding: '15px', borderRadius: '12px', border: 'none', background: view === 'steam' ? '#FF4444' : '#1e293b', color: 'white', fontWeight: 'bold' }}>STEAM</button>
      </div>

      {view === 'scanner' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {scannerBets.map((bet, i) => (
            <div key={i} style={{ background: '#0f172a', padding: '15px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '600' }}>{bet.market}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{bet.bookie}</div>
              </div>
              <button 
                onClick={() => openCalc(bet)}
                style={{ background: '#1e293b', color: '#3B82F6', border: '1px solid #3B82F6', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                CALC
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CALCULATOR MODAL */}
      {calcOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 100 }}>
          <div style={{ background: '#0f172a', width: '100%', maxWidth: '400px', borderRadius: '20px', padding: '30px', border: '1px solid #3B82F6', position: 'relative' }}>
            <button onClick={() => setCalcOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#64748B', fontSize: '20px' }}>✕</button>
            
            <h2 style={{ fontSize: '18px', marginBottom: '5px' }}>{selectedBet.market}</h2>
            <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '20px' }}>Edge: +{selectedBet.edge}%</div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#64748B' }}>YOUR BANKROLL ($)</label>
              <input 
                type="number" 
                value={bankroll} 
                onChange={(e) => setBankroll(Number(e.target.value))}
                style={{ width: '100%', background: '#050608', border: '1px solid #1e293b', padding: '12px', borderRadius: '8px', color: 'white', marginTop: '5px', fontSize: '18px' }}
              />
            </div>

            <div style={{ background: '#3B82F6', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>RECOMMENDED BET (Kelly 0.25)</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                ${(bankroll * (parseFloat(selectedBet.edge) / 100) * 0.25).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}