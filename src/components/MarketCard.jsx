export default function MarketCard({ data }) {
  const isBull = data.trend === 'BULLISH'
  const color  = isBull ? 'var(--green)' : 'var(--red)'

  const rsiColor = data.rsi <= 20 ? 'var(--green)' :
                   data.rsi >= 80 ? 'var(--red)'   :
                   data.rsi <= 30 ? '#86efac'       :
                   data.rsi >= 70 ? '#fca5a5'       : 'var(--orange-400)'

  const rsiNote = data.rsi <= 20 ? '🟢 Oversold — BUY trigger zone' :
                  data.rsi >= 80 ? '🔴 Overbought — SELL trigger zone' :
                  data.rsi <= 30 ? '🟡 Approaching oversold' :
                  data.rsi >= 70 ? '🟡 Approaching overbought' :
                  '⚪ Neutral — watching'

  const distToTrigger = data.rsi <= 50
    ? `${(data.rsi - 20).toFixed(1)} pts to BUY trigger`
    : `${(80 - data.rsi).toFixed(1)} pts to SELL trigger`

  return (
    <div style={{
      background: 'var(--blue-800)',
      border: `1px solid ${isBull ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: 'clamp(14px,3vw,20px)',
        background: isBull ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 2, marginBottom: 6 }}>
            AI MARKET ANALYSIS
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px,5vw,24px)', fontWeight: 700, color: 'var(--white)' }}>
            {data.symbol?.replace('/', '')}
          </div>
          {data.name && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>
              {data.name}
            </div>
          )}
        </div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(16px,4vw,22px)',
          fontWeight: 800, color, textAlign: 'right', flexShrink: 0,
        }}>
          {isBull ? '▲ BUY' : '▼ SELL'}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', fontWeight: 400, marginTop: 2 }}>
            bias
          </div>
        </div>
      </div>

      {/* Price stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
        borderBottom: '1px solid var(--border)',
      }}>
        {[
          { label: 'PRICE',    value: data.price?.toFixed(data.price > 100 ? 2 : 5), color: 'var(--blue-100)' },
          { label: 'RSI',      value: data.rsi?.toFixed(1), color: rsiColor },
          { label: 'STRENGTH', value: `${data.strength?.toFixed(1)}%`, color: 'var(--orange-400)' },
        ].map(({ label, value, color }, i) => (
          <div key={label} style={{
            padding: '14px 12px', textAlign: 'center',
            borderRight: i < 2 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 6 }}>
              {label}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(13px,3vw,16px)', fontWeight: 600, color }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* RSI status */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>
          {rsiNote}
        </div>

        {/* RSI progress bar toward trigger */}
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{
            height: '100%', borderRadius: 2,
            background: data.rsi <= 50
              ? `linear-gradient(90deg, var(--green), ${rsiColor})`
              : `linear-gradient(90deg, ${rsiColor}, var(--red))`,
            width: data.rsi <= 50
              ? `${Math.max(0, 100 - ((data.rsi - 20) / 30) * 100)}%`
              : `${Math.max(0, ((data.rsi - 50) / 30) * 100)}%`,
            transition: 'width 1s ease',
          }} />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>
          {distToTrigger}
        </div>
      </div>

      {/* Waiting indicator */}
      <div style={{ padding: '14px 16px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 16px', borderRadius: 8,
          background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--orange-400)', animation: 'pulse 1.5s ease infinite', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--orange-400)' }}>
            AI scanning every 15 min
          </span>
        </div>
      </div>
    </div>
  )
}
