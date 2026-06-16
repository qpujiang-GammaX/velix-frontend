export default function AIRadar({ data }) {
  if (!data || data.length === 0) return null

  // Calculate "distance to extreme" for each pair
  const radar = data.map(item => {
    const rsi = item.rsi
    let distance, direction
    if (rsi <= 50) {
      distance = rsi - 20   // how far above the BUY trigger (20)
      direction = 'BUY'
    } else {
      distance = 80 - rsi   // how far below the SELL trigger (80)
      direction = 'SELL'
    }
    let zone
    if (distance <= 0) zone = 'TRIGGERED'
    else if (distance <= 10) zone = 'CLOSE'
    else if (distance <= 20) zone = 'APPROACHING'
    else zone = 'NEUTRAL'

    return { ...item, distance, zone, direction }
  })
  .filter(r => r.zone !== 'NEUTRAL')
  .sort((a, b) => a.distance - b.distance)

  const ZONE_STYLE = {
    TRIGGERED:   { color: 'var(--green)',   bg: 'rgba(34,197,94,0.1)',  label: '🔥 SIGNAL ZONE' },
    CLOSE:       { color: 'var(--orange-400)', bg: 'rgba(249,115,22,0.08)', label: '⚡ CLOSE' },
    APPROACHING: { color: 'var(--blue-100)', bg: 'rgba(61,106,181,0.08)', label: '👀 APPROACHING' },
  }

  return (
    <div style={{ background: 'var(--blue-800)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(249,115,22,0.05)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: 'var(--orange-400)', letterSpacing: 1 }}>
          AI RADAR
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginLeft: 8 }}>
          RSI extremes (≤20 / ≥80)
        </span>
      </div>

      {radar.length === 0 ? (
        <div style={{ padding: '20px 16px', textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>
            All pairs neutral — no extremes nearby
          </span>
        </div>
      ) : (
        radar.map((item, i) => {
          const style = ZONE_STYLE[item.zone]
          return (
            <div key={item.symbol} style={{
              padding: '10px 16px',
              borderBottom: i < radar.length - 1 ? '1px solid rgba(30,64,128,0.3)' : 'none',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: 'var(--white)' }}>
                  {item.symbol}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>
                  RSI {item.rsi.toFixed(1)} · watching for {item.direction}
                </div>
              </div>
              <span style={{
                fontSize: 9, padding: '3px 8px', borderRadius: 5, fontWeight: 700,
                background: style.bg, color: style.color, fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
              }}>{style.label}</span>
            </div>
          )
        })
      )}
    </div>
  )
}
