export default function HeatmapTable({ data, onSelect, activePair }) {
  if (!data || data.length === 0) return null

  return (
    <div style={{ background: 'var(--blue-800)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(249,115,22,0.05)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: 'var(--orange-400)', letterSpacing: 1 }}>
          MARKET HEATMAP
        </span>
      </div>
      {data.map((item, i) => {
        const isBull   = item.trend === 'BULLISH'
        const color    = isBull ? 'var(--green)' : 'var(--red)'
        const isActive = activePair === item.symbol
        return (
          <button key={item.symbol} onClick={() => onSelect(item.symbol)} style={{
            width: '100%', padding: '12px 16px', textAlign: 'left',
            background: isActive ? 'rgba(249,115,22,0.06)' : 'transparent',
            border: 'none', borderBottom: i < data.length - 1 ? '1px solid rgba(30,64,128,0.3)' : 'none',
            cursor: 'pointer', transition: 'background 0.15s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: isActive ? 'var(--orange-400)' : 'var(--white)' }}>
                {item.symbol}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color }}>
                {item.trend}
              </span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
              <div style={{ height: '100%', borderRadius: 2, background: color, width: `${item.strength || 50}%`, transition: 'width 0.8s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>{item.strength?.toFixed(1)}% strength</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>RSI {item.rsi?.toFixed(1)}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
