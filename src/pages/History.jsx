import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'https://gammax-backend-production.up.railway.app'

const RESULT_STYLE = {
  OPEN: { color: '#f59e0b',  bg: 'rgba(245,158,11,0.1)',  label: '⏳ OPEN' },
  TP1:  { color: '#22c55e',  bg: 'rgba(34,197,94,0.1)',   label: '✅ TP1' },
  TP2:  { color: '#16a34a',  bg: 'rgba(22,163,74,0.1)',   label: '🎯 TP2' },
  SL:   { color: '#ef4444',  bg: 'rgba(239,68,68,0.1)',   label: '🛑 SL' },
}

const PAIRS = ['All', 'XAU/USD', 'EUR/USD', 'GBP/USD', 'USD/JPY', 'USOIL', 'US500']

export default function History() {
  const [history, setHistory] = useState([])
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('All')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sym = filter !== 'All' ? `&symbol=${encodeURIComponent(filter)}` : ''
        const [h, s] = await Promise.all([
          fetch(`${API}/api/signals/history?limit=50${sym}`),
          fetch(`${API}/api/signals/stats${filter !== 'All' ? `?symbol=${encodeURIComponent(filter)}` : ''}`),
        ])
        const hd = await h.json()
        const sd = await s.json()
        if (hd.success) setHistory(hd.history)
        if (sd.success) setStats(sd.stats)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [filter])

  return (
    <main style={{ flex: 1, padding: '24px 20px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--white)' }}>
          Signal History
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Track record of all AI-generated signals
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total Signals', value: stats.total,    color: 'var(--white)' },
            { label: 'Open',          value: stats.open || 0, color: 'var(--orange-400)' },
            { label: 'TP1 Hit',       value: stats.tp1_hit,  color: 'var(--green)' },
            { label: 'TP2 Hit',       value: stats.tp2_hit,  color: '#16a34a' },
            { label: 'SL Hit',        value: stats.sl_hit,   color: 'var(--red)' },
            { label: 'Win Rate',      value: `${stats.winrate}%`, color: stats.winrate >= 60 ? 'var(--green)' : stats.winrate >= 40 ? 'var(--orange-400)' : 'var(--red)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: 'var(--blue-800)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '16px',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginBottom: 6, letterSpacing: 1 }}>{label.toUpperCase()}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Win rate bar */}
      {stats && stats.total > 0 && (
        <div style={{ background: 'var(--blue-800)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', letterSpacing: 1 }}>WIN RATE</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: stats.winrate >= 60 ? 'var(--green)' : stats.winrate >= 40 ? 'var(--orange-400)' : 'var(--red)' }}>
              {stats.winrate}%
            </span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 4,
              background: stats.winrate >= 60 ? 'var(--green)' : stats.winrate >= 40 ? 'var(--orange-400)' : 'var(--red)',
              width: `${stats.winrate}%`, transition: 'width 1s ease',
            }} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginTop: 6 }}>
            Based on {stats.total} closed signals
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {PAIRS.map(pair => (
          <button key={pair} onClick={() => setFilter(pair)} style={{
            padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
            whiteSpace: 'nowrap', transition: 'all 0.2s', border: '1px solid',
            background: filter === pair ? 'rgba(249,115,22,0.12)' : 'var(--blue-800)',
            borderColor: filter === pair ? 'rgba(249,115,22,0.5)' : 'var(--border)',
            color: filter === pair ? 'var(--orange-400)' : 'var(--text-secondary)',
          }}>{pair}</button>
        ))}
      </div>

      {/* History table */}
      <div style={{ background: 'var(--blue-800)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '90px 60px 90px 1fr 1fr 90px 90px',
          gap: 12, padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--blue-700)',
        }}>
          {['PAIR', 'TYPE', 'ENTRY', 'TP1 / TP2', 'STOP LOSS', 'RESULT', 'DATE'].map(h => (
            <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 1 }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)', animation: 'pulse 1.5s ease infinite' }}>
            LOADING...
          </div>
        ) : history.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--text-secondary)', marginBottom: 8 }}>No signals yet</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)' }}>Signals will appear here after market opens</div>
          </div>
        ) : (
          history.map((item, i) => {
            const result = RESULT_STYLE[item.result] || RESULT_STYLE.OPEN
            const isBuy  = item.signal_type === 'BUY'
            return (
              <div key={item.id} style={{
                display: 'grid', gridTemplateColumns: '90px 60px 90px 1fr 1fr 90px 90px',
                gap: 12, padding: '12px 16px', alignItems: 'center',
                borderBottom: i < history.length - 1 ? '1px solid rgba(30,64,128,0.3)' : 'none',
                transition: 'background 0.15s',
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600, color: 'var(--white)' }}>{item.symbol}</span>
                <span style={{
                  fontSize: 9, padding: '3px 7px', borderRadius: 5, fontWeight: 700, textAlign: 'center',
                  background: isBuy ? 'var(--green-dim)' : 'var(--red-dim)',
                  color: isBuy ? 'var(--green)' : 'var(--red)',
                  fontFamily: 'var(--font-mono)',
                }}>{item.signal_type}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--blue-100)' }}>{item.entry}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)' }}>
                  {item.tp1} / {item.tp2}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--red)' }}>{item.sl}</span>
                <span style={{
                  fontSize: 9, padding: '3px 8px', borderRadius: 5, fontWeight: 700,
                  background: result.bg, color: result.color,
                  fontFamily: 'var(--font-mono)', textAlign: 'center',
                }}>{result.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
                  {item.timestamp?.slice(0, 10)}
                </span>
              </div>
            )
          })
        )}
      </div>
    </main>
  )
}
