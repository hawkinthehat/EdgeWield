<button 
  onClick={() => {
    console.log("Opening Calc"); // This helps us debug
    setSelectedBet(bet);
    setCalcOpen(true);
  }}
  style={{ 
    background: '#3B82F6', // Changed to solid blue so it's easier to see
    color: 'white', 
    padding: '10px 16px', 
    borderRadius: '8px', 
    fontSize: '12px', 
    fontWeight: 'bold',
    border: 'none'
  }}>
  CALC
</button>