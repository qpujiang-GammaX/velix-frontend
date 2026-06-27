import { useEffect, useState } from 'react'

const MODULE_COLOR = {
  'GAMMA AI': '#f97316',
  'PEAK AI':  '#3d6ab5',
  'OMEGA AI': '#8b5cf6',
  'DELTA AI': '#f59e0b',
}

export default function SignalCard({ signal }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [signal])

  const isBuy     = signal.signal_type === 'BUY'
  const isScalp   = signal.ai_module === 'DELTA AI'
  const color     = isBuy ? 'var(--green)' : 'var(--red)'
  const modColor  = MODULE_COLOR[signal.ai_module] || 'var(--orange-400)'
  const riskColor = { LOW: 'var(--green)', MEDIUM: 'var(--orange-400)', HIGH: 'var(--red)' }[signal.risk]

  const riskDist = Math.abs(signal.entry - signal.sl)
  const tp1Dist  = Math.abs(signal.tp1 - signal.entry)
  const tp2Dist  = Math.abs(signal.tp2 - signal.entry)
  const rr1 = riskDist > 0 ? (tp1Dist / riskDist).toFixed(1) : 0
  const rr2 = riskDist > 0 ? (tp2Dist / riskDist).toFixed(1) : 0

  const scoreBarFilled = Math.round(signal.confidence / 10)
  const scoreBar = '▓'.repeat(scoreBarFilled) + '░'.repeat(10 - scoreBarFilled)

  return (
    <div style={{
      background: 'var(--blue-800)',
      border: `1px solid ${isBuy ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'all 0.4s ease',
    }}>

      {/* Style tag */}
      <div style={{
        padding: '8px 16px',
        background: isScalp ? 'rgba(245,158,11,0.08)' : 'rgba(61,106,181,0.08)',
        borderBottom: `1px solid ${isScalp ? 'rgba(245,158,11,0.2)' : 'rgba(61,106,181,0.2)'}`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 14 }}>{isScalp ? '⚡' : '📈'}</span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
          color: isScalp ? 'var(--orange-400)' : 'var(--blue-100)', letterSpacing: 1,
        }}>{isScalp ? 'SCALP ENTRY (M15)' : 'SWING SIGNAL (H1)'}</span>
      </div>

      {/* Header */}
      <div style={{
        padding: 'clamp(14px,3vw,20px)',
        background: isBuy ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)',
        borderBottom: `1px solid ${isBuy ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
              color: modColor, padding: '2px 8px', borderRadius: 5,
              background: `${modColor}18`, border: `1px solid ${modColor}30`,
            }}>{signal.ai_module}</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600,
              color: riskColor, padding: '2px 8px', borderRadius: 5,
              background: `${riskColor}18`, border: `1px solid ${riskColor}30`,
            }}>{signal.risk} RISK</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px,5vw,24px)', fontWeight: 700, color: 'var(--white)' }}>
            {signal.symbol.replace('/', '')}
          </div>
        </div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(24px,6vw,36px)',
          fontWeight: 800, color,
          textShadow: `0 0 20px ${color}50`,
          flexShrink: 0,
        }}>
          {isBuy ? '▲' : '▼'} {signal.signal_type}
        </div>
      </div>

      {/* AI Score bar */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 1 }}>AI SCORE</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: signal.confidence >= 75 ? 'var(--green)' : 'var(--orange-400)' }}>
            {signal.confidence:.0f}/100
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: signal.confidence >= 75 ? 'var(--green)' : 'var(--orange-400)', letterSpacing: 1 }}>
          {scoreBar}
        </div>
      </div>

      {/* Price levels — 2x2 grid on mobile */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        borderBottom: '1px solid var(--border)',
      }} className="price-grid">
        {[
          { label: 'ENTRY',     value: signal.entry, color: 'var(--blue-100)', rr: null },
          { label: 'STOP LOSS', value: signal.sl,    color: 'var(--red)',      rr: null },
          { label: 'TP 1',      value: signal.tp1,   color: 'var(--green)',    rr: `1:${rr1}` },
          { label: 'TP 2',      value: signal.tp2,   color: '#16a34a',         rr: `1:${rr2}` },
        ].map(({ label, value, color, rr }, i) => (
          <div key={label} style={{
            padding: '14px 16px',
            borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
            borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 1 }}>{label}</span>
              {rr && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>{rr}</span>}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(12px,3vw,15px)', fontWeight: 600, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'RSI',     value: signal.rsi,     color: 'var(--text-primary)' },
          { label: 'STRENGTH',value: `${signal.strength}%`, color: 'var(--orange-400)' },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 2 }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color }}>{value}</div>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 2 }}>TIME</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>
            {signal.timestamp?.slice(11, 16)} UTC
          </div>
        </div>
      </div>

      {/* Confirmations — show on mobile too */}
      {signal.confirmations && signal.confirmations.length > 0 && (
        <div style={{
          padding: '10px 16px 14px',
          borderTop: '1px solid var(--border)',
          background: 'rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 8 }}>CONFIRMATIONS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {signal.confirmations.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <span style={{ color: 'var(--green)', fontSize: 10, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
