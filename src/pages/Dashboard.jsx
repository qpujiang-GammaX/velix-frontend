import { useState, useEffect, useCallback } from 'react'
import SignalCard from '../components/SignalCard'
import HeatmapTable from '../components/HeatmapTable'
import TradingChart from '../components/TradingChart'
import MarketCard from '../components/MarketCard'

const API = import.meta.env.VITE_API_URL || 'https://gammax-backend-production.up.railway.app'
const PAIRS = ['XAU/USD', 'EUR/USD', 'GBP/USD', 'USD/JPY', 'USOIL', 'US500']

export default function Dashboard() {
  const [signals, setSignals]   = useState([])
  const [heatmap, setHeatmap]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [activePair, setActivePair] = useState('XAU/USD')
  const [error, setError]       = useState(null)

  const fetchData = useCallback(async () => {
    try {
      const [s, h] = await Promise.all([
        fetch(`${API}/api/signals/all`),
        fetch(`${API}/api/signals/heatmap`),
      ])
      const sd = await s.json()
      const hd = await h.json()
      if (sd.success) setSignals(sd.signals)
      if (hd.success) setHeatmap(hd.heatmap)
      setLastUpdate(new Date())
      setError(null)
    } catch {
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const t = setInterval(fetchData, 900000)
    return () => clearInterval(t)
  }, [fetchData])

  const activeSignal = signals.find(s => s.symbol === activePair) || null
  const activeHeat   = heatmap.find(h => h.symbol === activePair) || null

  return (
    <main style={{ flex: 1, padding: '24px 20px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--white)' }}>
            Live Dashboard
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : 'Loading...'}
          </p>
        </div>
        <button onClick={fetchData} style={{
          padding: '8px 16px', borderRadius: 8,
          background: 'var(--blue-700)', border: '1px solid var(--border-bright)',
          fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)',
          cursor: 'pointer', transition: 'all 0.2s',
        }}>↻ Refresh</button>
      </div>

      {error && (
        <div style={{
          background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 8, padding: '10px 16px', marginBottom: 16,
          fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--red)',
        }}>⚠️ {error}</div>
      )}

      {/* Pair tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {PAIRS.map(pair => {
          const sig  = signals.find(s => s.symbol === pair)
          const heat = heatmap.find(h => h.symbol === pair)
          const active = activePair === pair
          return (
            <button key={pair} onClick={() => setActivePair(pair)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600,
              whiteSpace: 'nowrap', transition: 'all 0.2s', border: '1px solid',
              background: active ? 'rgba(249,115,22,0.12)' : 'var(--blue-800)',
              borderColor: active ? 'rgba(249,115,22,0.5)' : 'var(--border)',
              color: active ? 'var(--orange-400)' : 'var(--text-secondary)',
            }}>
              {pair}
              {sig ? (
                <span style={{
                  fontSize: 9, padding: '2px 5px', borderRadius: 4, fontWeight: 700,
                  background: sig.signal_type === 'BUY' ? 'var(--green-dim)' : 'var(--red-dim)',
                  color: sig.signal_type === 'BUY' ? 'var(--green)' : 'var(--red)',
                }}>{sig.signal_type}</span>
              ) : heat ? (
                <span style={{ fontSize: 12, color: heat.trend === 'BULLISH' ? 'var(--green)' : 'var(--red)' }}>
                  {heat.trend === 'BULLISH' ? '↑' : '↓'}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--orange-400)', animation: 'pulse 1.5s ease infinite' }}>
            Loading AI data...
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 20 }}>

          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {activeSignal
              ? <SignalCard signal={activeSignal} />
              : activeHeat
              ? <MarketCard data={activeHeat} />
              : (
                <div style={{
                  background: 'var(--blue-800)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: '60px 40px', textAlign: 'center',
                }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--text-dim)' }}>
                    No data for {activePair}
                  </p>
                </div>
              )
            }

            <TradingChart symbol={activePair} height={580} />

            {/* Other pairs */}
            {signals.filter(s => s.symbol !== activePair).length > 0 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, letterSpacing: 1 }}>
                  OTHER ACTIVE SIGNALS
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                  {signals.filter(s => s.symbol !== activePair).map(sig => (
                    <button key={sig.symbol} onClick={() => setActivePair(sig.symbol)} style={{
                      textAlign: 'left', background: 'var(--blue-800)',
                      border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                      padding: '12px 14px', cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: 'var(--white)' }}>{sig.symbol}</span>
                        <span style={{
                          fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 700,
                          background: sig.signal_type === 'BUY' ? 'var(--green-dim)' : 'var(--red-dim)',
                          color: sig.signal_type === 'BUY' ? 'var(--green)' : 'var(--red)',
                        }}>{sig.signal_type}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
                        Entry: <span style={{ color: 'var(--blue-100)' }}>{sig.entry}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                        Conf: <span style={{ color: 'var(--orange-400)' }}>{sig.confidence}%</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* AI Panel */}
            {(activeSignal || activeHeat) && (
              <div style={{ background: 'var(--blue-800)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(249,115,22,0.05)' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: 'var(--orange-400)', letterSpacing: 1 }}>
                    AI ANALYSIS
                  </span>
                </div>
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {activeSignal ? (
                    <>
                      {/* Confidence bar */}
                      {[
                        { label: 'AI CONFIDENCE', value: activeSignal.confidence, color: activeSignal.confidence >= 75 ? 'var(--green)' : activeSignal.confidence >= 50 ? 'var(--orange-400)' : 'var(--red)' },
                        { label: 'TREND STRENGTH', value: activeSignal.strength, color: 'var(--blue-100)' },
                      ].map(({ label, value, color }) => (
                        <div key={label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 1 }}>{label}</span>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, color }}>{value}%</span>
                          </div>
                          <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 3, background: color, width: `${value}%`, transition: 'width 1s ease' }} />
                          </div>
                        </div>
                      ))}
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                          { label: 'MODULE',  value: activeSignal.ai_module },
                          { label: 'SIGNAL',  value: activeSignal.signal_type, color: activeSignal.signal_type === 'BUY' ? 'var(--green)' : 'var(--red)' },
                          { label: 'TREND',   value: activeSignal.trend, color: activeSignal.trend === 'BULLISH' ? 'var(--green)' : 'var(--red)' },
                          { label: 'RSI',     value: activeSignal.rsi },
                          { label: 'RISK',    value: activeSignal.risk, color: { LOW: 'var(--green)', MEDIUM: 'var(--orange-400)', HIGH: 'var(--red)' }[activeSignal.risk] },
                        ].map(({ label, value, color }) => (
                          <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{label}</span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: color || 'var(--text-primary)' }}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : activeHeat && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { label: 'PRICE',    value: activeHeat.price?.toFixed(4), color: 'var(--blue-100)' },
                        { label: 'TREND',    value: activeHeat.trend, color: activeHeat.trend === 'BULLISH' ? 'var(--green)' : 'var(--red)' },
                        { label: 'RSI',      value: activeHeat.rsi?.toFixed(1), color: 'var(--text-primary)' },
                        { label: 'STRENGTH', value: `${activeHeat.strength?.toFixed(1)}%`, color: 'var(--orange-400)' },
                      ].map(({ label, value, color }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{label}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color }}>{value}</span>
                        </div>
                      ))}
                      <div style={{ marginTop: 8, padding: '8px 10px', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 6 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--orange-400)' }}>⏳ Watching for setup</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <HeatmapTable data={heatmap} activePair={activePair} onSelect={setActivePair} />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          main > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
