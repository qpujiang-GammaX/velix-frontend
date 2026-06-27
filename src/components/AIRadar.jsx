export default function AIRadar({ data }) {
  if (!data || data.length === 0) return null

  const radar = data.map(item => {
    const rsi = item.rsi
    let distance, direction
    if (rsi <= 50) {
      distance  = rsi - 20
      direction = 'BUY'
    } else {
      distance  = 80 - rsi
      direction = 'SELL'
    }
    let zone
    if (distance <= 0)   zone = 'TRIGGERED'
    else if (distance <= 5)  zone = 'IMMINENT'
    else if (distance <= 15) zone = 'CLOSE'
    else if (distance <= 25) zone = 'APPROACHING'
    else zone = 'NEUTRAL'

    return { ...item, distance, zone, direction }
  })
  .filter(r => r.zone !== 'NEUTRAL')
  .sort((a, b) => a.distance - b.distance)

  if (radar.length === 0) return null

  const ZONE_STYLE = {
    TRIGGERED:   { color: 'var(--green)',        bg: 'rgba(34,197,94,0.12)',    label: '🔥 SIGNAL ZONE',  dot: '#22c55e' },
    IMMINENT:    { color: '#f97316',              bg: 'rgba(249,115,22,0.12)',   label: '⚡ IMMINENT',     dot: '#f97316' },
    CLOSE:       { color: 'var(--orange-400)',    bg: 'rgba(249,115,22,0.08)',   label: '👀 CLOSE',        dot: '#fb923c' },
    APPROACHING: { color: 'var(--blue-100)',      bg: 'rgba(61,106,181,0.08)',   label: '📡 WATCHING',     dot: '#6b93d6' },
  }

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: 'var(--orange-400)', letterSpacing: 1 }}>
            AI RADAR
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>
            RSI ≤20 / ≥80
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
          color: 'var(--orange-400)', padding: '2px 8px', borderRadius: 10,
          background: 'rgba(249,115,22,0.12)',
        }}>{radar.length} watching</span>
      </div>

      {radar.map((item, i) => {
        const style = ZONE_STYLE[item.zone]
        const pct   = item.zone === 'TRIGGERED' ? 100 :
                      Math.max(0, 100 - (item.distance / 25) * 100)

        return (
          <div key={item.symbol} style={{
            padding: '12px 16px',
            borderBottom: i < radar.length - 1 ? '1px solid rgba(30,64,128,0.3)' : 'none',
            background: item.zone === 'TRIGGERED' ? 'rgba(34,197,94,0.04)' :
                        item.zone === 'IMMINENT'  ? 'rgba(249,115,22,0.04)' : 'transparent',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: style.dot,
                  boxShadow: item.zone === 'TRIGGERED' ? `0 0 8px ${style.dot}` : 'none',
                  animation: item.zone === 'TRIGGERED' ? 'pulse 1s ease infinite' : 'none',
                }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--white)' }}>
                  {item.symbol.replace('/', '')}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
                  color: item.direction === 'BUY' ? 'var(--green)' : 'var(--red)',
                  padding: '1px 6px', borderRadius: 4,
                  background: item.direction === 'BUY' ? 'var(--green-dim)' : 'var(--red-dim)',
                }}>{item.direction}</span>
              </div>
              <span style={{
                fontSize: 9, padding: '3px 8px', borderRadius: 10, fontWeight: 700,
                background: style.bg, color: style.color,
                fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
              }}>{style.label}</span>
            </div>

            {/* Progress bar toward trigger */}
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: style.dot,
                width: `${pct}%`,
                transition: 'width 0.8s ease',
                boxShadow: item.zone === 'TRIGGERED' ? `0 0 6px ${style.dot}` : 'none',
              }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>
                RSI {item.rsi.toFixed(1)}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: style.color }}>
                {item.zone === 'TRIGGERED'
                  ? 'At trigger!'
                  : `${item.distance.toFixed(1)} pts away`}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
