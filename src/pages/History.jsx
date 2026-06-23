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
  const [styleFilter, setStyleFilter] = useState('All') // All / H1 / M15

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sym = filter !== 'All' ? `&symbol=${encodeURIComponent(filter)}` : ''
        const style = styleFilter !== 'All' ? `&signal_style=${styleFilter}` : ''
        const statsStyle = styleFilter !== 'All' ? `?signal_style=${styleFilter}` : ''
        const [h, s] = await Promise.all([
          fetch(`${API}/api/signals/history?limit=50${sym}${style}`),
          fetch(`${API}/api/signals/stats${statsStyle}`),
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
  }, [filter, styleFilter])

  return (
    <main style={{ flex: 1, padding: '16px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 700, color: 'var(--white)' }}>
          Signal History
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Track record of all AI-generated signals
        </p>
      </div>

      {/* Stats cards — 2 columns on mobile */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10, marginBottom: 16,
        }} className="stats-grid">
          {[
            { label: 'Total', value: stats.total,    color: 'var(--white)' },
            { label: 'Open',  value: stats.open || 0, color: 'var(--orange-400)' },
            { label: 'Win Rate', value: `${stats.winrate}%`, color: stats.winrate >= 60 ? 'var(--green)' : stats.winrate >= 40 ? 'var(--orange-400)' : 'var(--red)' },
            { label: 'TP1',   value: stats.tp1_hit,  color: 'var(--green)' },
            { label: 'TP2',   value: stats.tp2_hit,  color: '#16a34a' },
            { label: 'SL',    value: stats.sl_hit,   color: 'var(--red)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: 'var(--blue-800)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '12px 10px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginBottom: 4, letterSpacing: 1 }}>
                {label.toUpperCase()}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 700, color }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Win rate bar */}
      {stats && stats.total > 0 && (
        <div style={{
          background: 'var(--blue-800)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', letterSpacing: 1 }}>WIN RATE</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: stats.winrate >= 60 ? 'var(--green)' : stats.winrate >= 40 ? 'var(--orange-400)' : 'var(--red)' }}>
              {stats.winrate}%
            </span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 3,
              background: stats.winrate >= 60 ? 'var(--green)' : stats.winrate >= 40 ? 'var(--orange-400)' : 'var(--red)',
              width: `${stats.winrate}%`, transition: 'width 1s ease',
            }} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginTop: 6 }}>
            Based on {stats.total} closed signals
          </div>
        </div>
      )}

      {/* Signal style filter (H1 / M15) */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {['All', 'H1', 'M15'].map(s => (
          <button key={s} onClick={() => setStyleFilter(s)} style={{
            padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
            border: '1px solid',
            background: styleFilter === s ? 'rgba(249,115,22,0.12)' : 'var(--blue-800)',
            borderColor: styleFilter === s ? 'rgba(249,115,22,0.5)' : 'var(--border)',
            color: styleFilter === s ? 'var(--orange-400)' : 'var(--text-secondary)',
            minHeight: 'var(--touch-target)', display: 'flex', alignItems: 'center',
          }}>
            {s === 'All' ? 'All Signals' : s === 'H1' ? '📈 Swing' : '⚡ Scalp'}
          </button>
        ))}
      </div>

      {/* Pair filter tabs — horizontal scroll */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 16,
        overflowX: 'auto', paddingBottom: 4,
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}>
        {PAIRS.map(pair => (
          <button key={pair} onClick={() => setFilter(pair)} style={{
            padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
            whiteSpace: 'nowrap', flexShrink: 0,
            border: '1px solid',
            background: filter === pair ? 'rgba(249,115,22,0.12)' : 'var(--blue-800)',
            borderColor: filter === pair ? 'rgba(249,115,22,0.5)' : 'var(--border)',
            color: filter === pair ? 'var(--orange-400)' : 'var(--text-secondary)',
            minHeight: 'var(--touch-target)', display: 'flex', alignItems: 'center',
          }}>{pair}</button>
        ))}
      </div>

      {/* Signal list — cards on mobile, table on desktop */}
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
        <>
          {/* Mobile card list */}
          <div className="mobile-cards" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {history.map((item) => {
              const result = RESULT_STYLE[item.result] || RESULT_STYLE.OPEN
              const isBuy  = item.signal_type === 'BUY'
              const isM15  = item.signal_style === 'M15'
              return (
                <div key={item.id} style={{
                  background: 'var(--blue-800)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '14px 16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--white)' }}>{item.symbol}</span>
                        <span style={{
                          fontSize: 9, padding: '2px 7px', borderRadius: 5, fontWeight: 700,
                          background: isBuy ? 'var(--green-dim)' : 'var(--red-dim)',
                          color: isBuy ? 'var(--green)' : 'var(--red)',
                          fontFamily: 'var(--font-mono)',
                        }}>{item.signal_type}</span>
                        {isM15 && (
                          <span style={{
                            fontSize: 9, padding: '2px 7px', borderRadius: 5, fontWeight: 700,
                            background: 'rgba(249,115,22,0.1)', color: 'var(--orange-400)',
                            fontFamily: 'var(--font-mono)',
                          }}>M15</span>
                        )}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
                        {item.timestamp?.slice(0, 10)}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 10, padding: '4px 10px', borderRadius: 6, fontWeight: 700,
                      background: result.bg, color: result.color,
                      fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
                    }}>{result.label}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                    {[
                      { label: 'ENTRY', value: item.entry, color: 'var(--blue-100)' },
                      { label: 'TP1',   value: item.tp1,   color: 'var(--green)' },
                      { label: 'TP2',   value: item.tp2,   color: '#16a34a' },
                      { label: 'SL',    value: item.sl,    color: 'var(--red)' },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 2 }}>{label}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop table */}
          <div className="desktop-table" style={{ background: 'var(--blue-800)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '100px 60px 90px 1fr 1fr 80px 80px 90px',
              gap: 10, padding: '10px 16px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--blue-700)',
            }}>
              {['PAIR', 'TYPE', 'STYLE', 'ENTRY', 'TP1 / TP2', 'SL', 'RESULT', 'DATE'].map(h => (
                <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 1 }}>{h}</span>
              ))}
            </div>

            {history.map((item, i) => {
              const result = RESULT_STYLE[item.result] || RESULT_STYLE.OPEN
              const isBuy  = item.signal_type === 'BUY'
              const isM15  = item.signal_style === 'M15'
              return (
                <div key={item.id} style={{
                  display: 'grid', gridTemplateColumns: '100px 60px 90px 1fr 1fr 80px 80px 90px',
                  gap: 10, padding: '10px 16px', alignItems: 'center',
                  borderBottom: i < history.length - 1 ? '1px solid rgba(30,64,128,0.3)' : 'none',
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600, color: 'var(--white)' }}>{item.symbol}</span>
                  <span style={{
                    fontSize: 9, padding: '3px 7px', borderRadius: 5, fontWeight: 700, textAlign: 'center',
                    background: isBuy ? 'var(--green-dim)' : 'var(--red-dim)',
                    color: isBuy ? 'var(--green)' : 'var(--red)',
                    fontFamily: 'var(--font-mono)',
                  }}>{item.signal_type}</span>
                  <span style={{
                    fontSize: 9, padding: '3px 7px', borderRadius: 5, fontWeight: 700,
                    background: isM15 ? 'rgba(249,115,22,0.1)' : 'rgba(61,106,181,0.1)',
                    color: isM15 ? 'var(--orange-400)' : 'var(--blue-100)',
                    fontFamily: 'var(--font-mono)',
                  }}>{isM15 ? '⚡ M15' : '📈 H1'}</span>
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
            })}
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-cards { display: flex !important; }
          .desktop-table { display: none !important; }
          .stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 769px) {
          .mobile-cards { display: none !important; }
          .desktop-table { display: block !important; }
        }
      `}</style>
    </main>
  )
}
