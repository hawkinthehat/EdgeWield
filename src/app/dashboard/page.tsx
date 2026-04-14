export default function Dashboard() {
  const menuItems = ['Hedge Finder', 'Steam Room', 'Odds Scanner', 'Settings'];

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw', 
      backgroundColor: '#050608', 
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      {/* SIDEBAR */}
      <div style={{ 
        width: '260px', 
        borderRight: '1px solid #1F2937', 
        display: 'flex', 
        flexDirection: 'column',
        padding: '20px'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '900', 
          fontStyle: 'italic', 
          color: '#3B82F6',
          marginBottom: '40px' 
        }}>
          EDGE<span style={{ color: 'white' }}>WIELD</span>
        </h2>
        
        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => (
            <div key={item} style={{
              padding: '12px 16px',
              marginBottom: '8px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: item === 'Hedge Finder' ? 'white' : '#9CA3AF',
              backgroundColor: item === 'Hedge Finder' ? '#111827' : 'transparent'
            }}>
              {item}
            </div>
          ))}
        </nav>

        <div style={{ padding: '10px', fontSize: '12px', color: '#4B5563' }}>
          Account: <span style={{ color: '#10B981' }}>Pro Plan</span>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ 
          height: '64px', 
          borderBottom: '1px solid #1F2937', 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 30px',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontWeight: 'bold' }}>HEDGE FINDER</span>
          <div style={{ 
            backgroundColor: '#3B82F6', 
            padding: '6px 12px', 
            borderRadius: '4px', 
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            LIVE FEED
          </div>
        </header>

        <main style={{ padding: '30px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Active Opportunities</h3>
            <span style={{ color: '#10B981', fontSize: '12px' }}>● 12 New Edges Found</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: '#64748B', fontSize: '12px', borderBottom: '1px solid #1F2937' }}>
                <th style={{ padding: '12px' }}>MATCHUP</th>
                <th style={{ padding: '12px' }}>MARKET</th>
                <th style={{ padding: '12px' }}>EDGE</th>
                <th style={{ padding: '12px' }}>BOOKS</th>
                <th style={{ padding: '12px' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {[
                { game: 'Lakers vs Celtics', market: 'O/U 224.5', edge: '4.2%', books: 'DK / FD', profit: '$42.10' },
                { game: 'Man City vs Arsenal', market: 'ML - Draw', edge: '2.8%', books: 'B365 / MGM', profit: '$28.00' },
                { game: 'Chiefs vs Ravens', market: 'Spread -3.5', edge: '5.1%', books: 'Pinnacle / DK', profit: '$51.05' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #111827', fontSize: '14px' }}>
                  <td style={{ padding: '16px', fontWeight: 'bold' }}>{row.game}</td>
                  <td style={{ padding: '16px', color: '#9CA3AF' }}>{row.market}</td>
                  <td style={{ padding: '16px', color: '#10B981', fontWeight: 'bold' }}>{row.edge}</td>
                  <td style={{ padding: '16px', color: '#3B82F6' }}>{row.books}</td>
                  <td style={{ padding: '16px' }}>
                    <button style={{ background: '#1F2937', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                      View Bet
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}