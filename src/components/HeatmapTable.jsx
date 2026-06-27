export default function HeatmapTable({ data, onSelect, activePair }) {
  if (!data || data.length === 0) return null

  return (
    <div style={{
      background: 'var(--blue-800)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(249,115,22,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 12,
          fontWeight: 600, color: 'var(--orange-400)', letterSpacing: 1,
        }}>MARKET HEATMAP</span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)',
        }}>tap to switch</span>
      </div>

      {data.map((item, i) => {
        const isBull   = item.trend === 'BULLISH'
        const color    = isBull ? 'var(--green)' : 'var(--red)'
        const isActive = activePair === item.symbol

        const rsiColor = item.rsi <= 20 ? 'var(--green)' :
                         item.rsi >= 80 ? 'var(--red)'   :
                         item.rsi <= 30 ? '#86efac'       :
                         item.rsi >= 70 ? '#fca5a5'       : 'var(--text-secondary)'

        const rsiAlert = item.rsi <= 20 || item.rsi >= 80

        return (
          <button
            key={item.symbol}
            onClick={() => onSelect(item.symbol)}
            style={{
              width: '100%', textAlign: 'left',
              padding: '12px 16px',
              background: isActive
                ? 'rgba(249,115,22,0.06)'
                : rsiAlert ? 'rgba(34,197,94,0.02)' : 'transparent',
              border: 'none',
              borderBottom: i < data.length - 1 ? '1px solid rgba(30,64,128,0.3)' : 'none',
              borderLeft: isActive ? '3px solid var(--orange-400)' : '3px solid transparent',
              cursor: 'pointer', transition: 'all 0.15s',
              minHeight: 'var(--touch-target)',
            }}
          >
            {/* Row 1: symbol + trend + RSI */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 6,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
                  color: isActive ? 'var(--orange-400)' : 'var(--white)',
                }}>{item.symbol}</span>

                {rsiAlert && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700,
                    color: item.rsi <= 20 ? 'var(--green)' : 'var(--red)',
                    padding: '1px 5px', borderRadius: 4,
                    background: item.rsi <= 20 ? 'var(--green-dim)' : 'var(--red-dim)',
                    animation: 'pulse 1.5s ease infinite',
                  }}>
                    {item.rsi <= 20 ? '🔥 BUY ZONE' : '🔥 SELL ZONE'}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  fontWeight: 600, color: rsiColor,
                }}>RSI {item.rsi?.toFixed(1)}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  fontWeight: 700, color,
                }}>{isBull ? '▲ BUY' : '▼ SELL'}</span>
              </div>
            </div>

            {/* Row 2: strength bar + price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2, background: color,
                  width: `${item.strength || 0}%`, transition: 'width 0.8s ease',
                }} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', flexShrink: 0 }}>
                {item.strength?.toFixed(1)}%
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', flexShrink: 0 }}>
                {item.price?.toFixed(item.price > 100 ? 2 : 4)}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
