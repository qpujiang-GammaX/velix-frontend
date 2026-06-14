import { useEffect, useState } from 'react'

const MODULE_COLOR = {
  'GAMMA AI': '#f97316',
  'PEAK AI':  '#3d6ab5',
  'OMEGA AI': '#8b5cf6',
  'DELTA AI': '#eab308',
}

export default function SignalCard({ signal }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [signal])

  const isBuy  = signal.signal_type === 'BUY'
  const color  = isBuy ? 'var(--green)' : 'var(--red)'
  const dimBg  = isBuy ? 'var(--green-dim)' : 'var(--red-dim)'
  const modColor = MODULE_COLOR[signal.ai_module] || 'var(--orange-400)'

  const riskColor = { LOW: 'var(--green)', MEDIUM: 'var(--orange-400)', HIGH: 'var(--red)' }[signal.risk]

  return (
    <div style={{
      background: 'var(--blue-800)',
      border: `1px solid ${isBuy ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'all 0.4s ease',
      boxShadow: isBuy ? '0 4px 40px rgba(34,197,94,0.06)' : '0 4px 40px rgba(239,68,68,0.06)',
    }}>
      {/* Header */}
      <div style={{
        padding: '18px 20px',
        background: isBuy ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)',
        borderBottom: `1px solid ${isBuy ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
              color: modColor, letterSpacing: 1,
              padding: '2px 8px', borderRadius: 5,
              background: `${modColor}18`, border: `1px solid ${modColor}30`,
            }}>{signal.ai_module}</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600,
              color: riskColor, padding: '2px 8px', borderRadius: 5,
              background: `${riskColor}18`, border: `1px solid ${riskColor}30`,
            }}>{signal.risk} RISK</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--white)' }}>
              {signal.symbol}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>H1</span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800,
            color, letterSpacing: '-0.5px',
            textShadow: `0 0 20px ${color}50`,
          }}>
            {isBuy ? '▲' : '▼'} {signal.signal_type}
          </div>
        </div>
      </div>

      {/* Price levels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: '1px solid var(--border)' }}>
        {[
          { label: 'ENTRY',     value: signal.entry, color: 'var(--blue-100)' },
          { label: 'TP 1',      value: signal.tp1,   color: 'var(--green)' },
          { label: 'TP 2',      value: signal.tp2,   color: '#16a34a' },
          { label: 'STOP LOSS', value: signal.sl,    color: 'var(--red)' },
        ].map(({ label, value, color }, i) => (
          <div key={label} style={{
            padding: '16px', textAlign: 'center',
            borderRight: i < 3 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 2, marginBottom: 6 }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ padding: '14px 20px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { label: 'TREND',    value: signal.trend,    color: isBuy ? 'var(--green)' : 'var(--red)' },
          { label: 'STRENGTH', value: `${signal.strength}%`, color: 'var(--orange-400)' },
          { label: 'RSI',      value: signal.rsi,      color: 'var(--text-primary)' },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 4 }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 20px 14px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
        {signal.timestamp?.slice(0, 19)?.replace('T', ' ')} UTC
      </div>
    </div>
  )
}
