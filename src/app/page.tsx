export default function EdgeScanner() {
  const mockBets = [
    { market: "NBA - Lakers vs Nuggets", edge: "+4.2%", bookie: "DraftKings", odds: "-110", status: "EV+" },
    { market: "MLB - Yankees vs Red Sox", edge: "+2.8%", bookie: "FanDuel", odds: "+125", status: "EV+" },
    { market: "UFC - Jones vs Miocic", edge: "+6.1%", bookie: "Pinnacle", odds: "-105", status: "HIGH EDGE" },
  ];

  return (
    <div style={{ backgroundColor: '#050608', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '10px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>EDGE<span style={{ color: '#3B82F6' }}>WIELD</span> <span style={{fontSize: '12px', color: '#64748B'}}>BETA v1.0</span></h1>
        <div style={{ color: '#10b981' }}>● LIVE FEED</div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
        {['Avg Edge: 3.4%', 'Active Scans: 1,204', 'Daily ROI: +12%'].map(stat => (
          <div key={stat} style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #1e293b', textAlign: 'center', fontSize: '14px' }}>{stat}</div>
        ))}
      </div>

      {/* Scanner Table */}
      <div style={{ background: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
        <div style={{ padding: '15px', borderBottom: '1px solid #1e293b', fontWeight: 'bold', color: '#64748B', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
          <span>MARKET</span>
          <span>BOOKIE</span>
          <span>ODDS</span>
          <span>EDGE</span>
        </div>
        {mockBets.map((bet, i) => (
          <div key={i} style={{ padding: '20px', borderBottom: '1px solid #1e293b', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', alignItems: 'center' }}>
            <span style={{ fontWeight: '600' }}>{bet.market}</span>
            <span style={{ color: '#94a3b8' }}>{bet.bookie}</span>
            <span style={{ fontFamily: 'monospace' }}>{bet.odds}</span>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>{bet.edge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}