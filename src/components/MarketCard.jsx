export default function MarketCard({ data }) {
  const isBull = data.trend === 'BULLISH'
  const color  = isBull ? 'var(--green)' : 'var(--red)'

  return (
    <div style={{
      background: 'var(--blue-800)',
      border: `1px solid ${isBull ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    }}>
      <div style={{
        padding: '18px 20px',
        background: isBull ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', letterSpacing: 2, marginBottom: 4 }}>AI MARKET ANALYSIS</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--white)' }}>{data.symbol}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{data.name}</div>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color, textAlign: 'right' }}>
          {isBull ? '▲ BULLISH' : '▼ BEARISH'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderBottom: '1px solid var(--border)' }}>
        {[
          { label: 'PRICE',    value: data.price?.toFixed(4),     color: 'var(--blue-100)' },
          { label: 'RSI',      value: data.rsi?.toFixed(1),        color: data.rsi < 30 ? 'var(--green)' : data.rsi > 70 ? 'var(--red)' : 'var(--orange-400)' },
          { label: 'STRENGTH', value: `${data.strength?.toFixed(1)}%`, color: 'var(--orange-400)' },
        ].map(({ label, value, color }, i) => (
          <div key={label} style={{
            padding: '16px', textAlign: 'center',
            borderRight: i < 2 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 2, marginBottom: 6 }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600, color }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 20px', borderRadius: 8,
          background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--orange-400)' }}>
            ⏳ AI watching — waiting for setup
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginTop: 10 }}>
          {data.rsi < 35 ? '🟢 RSI oversold — BUY setup may form' :
           data.rsi > 65 ? '🔴 RSI overbought — SELL setup may form' :
           '⚪ RSI neutral — monitoring for breakout'}
        </div>
      </div>
    </div>
  )
}
