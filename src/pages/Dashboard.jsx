import { useState, useEffect, useCallback } from 'react'
import SignalCard from '../components/SignalCard'
import HeatmapTable from '../components/HeatmapTable'
import TradingChart from '../components/TradingChart'
import MarketCard from '../components/MarketCard'
import AIRadar from '../components/AIRadar'

const API = import.meta.env.VITE_API_URL || 'https://gammax-backend-production.up.railway.app'
const PAIRS = ['XAU/USD', 'EUR/USD', 'GBP/USD', 'USD/JPY', 'USOIL', 'US500']
const PAIR_SHORT = {
  'XAU/USD': 'XAU', 'EUR/USD': 'EUR', 'GBP/USD': 'GBP',
  'USD/JPY': 'JPY', 'USOIL': 'OIL', 'US500': 'S&P'
}

export default function Dashboard() {
  const [signals,     setSignals]     = useState([])
  const [heatmap,     setHeatmap]     = useState([])
  const [diagnostics, setDiagnostics] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [lastUpdate,  setLastUpdate]  = useState(null)
  const [activePair,  setActivePair]  = useState('XAU/USD')
  const [error,       setError]       = useState(null)
  const [tab,         setTab]         = useState('signal') // signal | chart | market

  const fetchData = useCallback(async () => {
    try {
      const [s, h, d] = await Promise.all([
        fetch(`${API}/api/signals/all`),
        fetch(`${API}/api/signals/heatmap`),
        fetch(`${API}/api/signals/diagnostics`),
      ])
      const sd = await s.json()
      const hd = await h.json()
      const dd = await d.json()
      if (sd.success) setSignals(sd.signals)
      if (hd.success) setHeatmap(hd.heatmap)
      if (dd.success) setDiagnostics(dd.diagnostics || [])
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
  const activeDiag   = diagnostics.find(d => d.symbol === activePair) || null

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', gap: 8,
        borderBottom: '1px solid var(--border)',
        background: 'var(--blue-800)',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--white)' }}>
            Live Dashboard
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', marginTop: 1 }}>
            {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : 'Loading...'}
          </div>
        </div>
        <button onClick={fetchData} style={{
          padding: '8px 14px', borderRadius: 8, flexShrink: 0,
          background: 'var(--blue-700)', border: '1px solid var(--border-bright)',
          fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)',
          cursor: 'pointer', minHeight: 40,
        }}>↻</button>
      </div>

      {error && (
        <div style={{
          padding: '10px 16px', background: 'var(--red-dim)',
          fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--red)',
        }}>⚠️ {error}</div>
      )}

      {/* ── Pair tabs — horizontal scroll ───────────────────── */}
      <div style={{
        display: 'flex', gap: 6, padding: '10px 16px',
        overflowX: 'auto', background: 'var(--blue-800)',
        borderBottom: '1px solid var(--border)',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        {PAIRS.map(pair => {
          const sig    = signals.find(s => s.symbol === pair)
          const heat   = heatmap.find(h => h.symbol === pair)
          const diag   = diagnostics.find(d => d.symbol === pair)
          const active = activePair === pair
          return (
            <button key={pair} onClick={() => { setActivePair(pair); setTab('signal') }} style={{
              flexShrink: 0, padding: '6px 12px', borderRadius: 8,
              border: '1px solid',
              background: active ? 'rgba(249,115,22,0.15)' : 'var(--blue-700)',
              borderColor: active ? 'rgba(249,115,22,0.6)' : 'var(--border)',
              color: active ? 'var(--orange-400)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', minHeight: 40,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {PAIR_SHORT[pair] || pair}
              {sig ? (
                <span style={{
                  fontSize: 8, padding: '1px 4px', borderRadius: 3, fontWeight: 800,
                  background: sig.signal_type === 'BUY' ? 'var(--green-dim)' : 'var(--red-dim)',
                  color: sig.signal_type === 'BUY' ? 'var(--green)' : 'var(--red)',
                }}>{sig.signal_type}</span>
              ) : diag?.rsi_extreme ? (
                <span style={{
                  fontSize: 8, padding: '1px 4px', borderRadius: 3, fontWeight: 800,
                  background: 'rgba(249,115,22,0.2)', color: 'var(--orange-400)',
                  animation: 'pulse 1.5s ease infinite',
                }}>🔥</span>
              ) : heat ? (
                <span style={{ fontSize: 10, color: heat.trend === 'BULLISH' ? 'var(--green)' : 'var(--red)' }}>
                  {heat.trend === 'BULLISH' ? '▲' : '▼'}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--orange-400)', animation: 'pulse 1.5s ease infinite' }}>
            Loading AI data...
          </span>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* ── Desktop: 2-col | Mobile: stacked ──────────────── */}
          <div className="dash-layout" style={{
            flex: 1, display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) 320px',
            gap: 0, overflow: 'auto',
          }}>

            {/* LEFT — main content */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>

              {/* Mobile tab bar */}
              <div className="mobile-only" style={{
                display: 'none', gap: 6,
                background: 'var(--blue-700)', padding: 4, borderRadius: 10,
                border: '1px solid var(--border)',
              }}>
                {[
                  { key: 'signal', label: '📊 Signal' },
                  { key: 'chart',  label: '📈 Chart' },
                  { key: 'market', label: '🌡️ Market' },
                ].map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)} style={{
                    flex: 1, padding: '9px 4px', borderRadius: 7,
                    border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
                    background: tab === t.key ? 'var(--blue-500)' : 'transparent',
                    color: tab === t.key ? 'var(--white)' : 'var(--text-secondary)',
                    minHeight: 40,
                  }}>{t.label}</button>
                ))}
              </div>

              {/* Signal / Market card */}
              <div className={tab === 'signal' || tab === 'market' ? '' : 'desktop-only'}>
                {activeSignal
                  ? <SignalCard signal={activeSignal} />
                  : activeHeat
                  ? <MarketCard data={activeHeat} />
                  : (
                    <div style={{
                      background: 'var(--blue-800)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)', padding: '40px 20px', textAlign: 'center',
                    }}>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--text-dim)' }}>
                        No data for {activePair}
                      </p>
                    </div>
                  )
                }
              </div>

              {/* Chart */}
              <div className={tab === 'chart' ? '' : 'desktop-only'} style={{ display: tab === 'chart' ? 'block' : undefined }}>
                <TradingChart symbol={activePair} height={420} />
              </div>

              {/* Other signals — desktop only */}
              {signals.filter(s => s.symbol !== activePair).length > 0 && (
                <div className="desktop-only">
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600,
                    color: 'var(--text-secondary)', marginBottom: 10, letterSpacing: 1,
                  }}>OTHER ACTIVE SIGNALS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 8 }}>
                    {signals.filter(s => s.symbol !== activePair).map(sig => (
                      <button key={sig.symbol} onClick={() => setActivePair(sig.symbol)} style={{
                        textAlign: 'left', background: 'var(--blue-800)',
                        border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                        padding: '10px 12px', cursor: 'pointer', minHeight: 44,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, color: 'var(--white)' }}>{sig.symbol}</span>
                          <span style={{
                            fontSize: 9, padding: '2px 5px', borderRadius: 4, fontWeight: 700,
                            background: sig.signal_type === 'BUY' ? 'var(--green-dim)' : 'var(--red-dim)',
                            color: sig.signal_type === 'BUY' ? 'var(--green)' : 'var(--red)',
                          }}>{sig.signal_type}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>
                          {sig.entry} · {sig.confidence}%
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT sidebar */}
            <div style={{
              borderLeft: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', gap: 0,
              overflowY: 'auto',
            }}>

              {/* Mobile: market overview tab */}
              <div className={tab === 'market' ? 'mobile-show' : 'desktop-only'} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* AI Diagnosis for active pair */}
                {activeDiag && (
                  <div style={{ background: 'var(--blue-800)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(249,115,22,0.05)' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: 'var(--orange-400)', letterSpacing: 1 }}>
                        🔬 {activePair} ANALYSIS
                      </span>
                    </div>
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { label: 'H4 TREND',  value: activeDiag.h4_trend,
                          color: activeDiag.h4_trend === 'BULLISH' ? 'var(--green)' : activeDiag.h4_trend === 'BEARISH' ? 'var(--red)' : 'var(--orange-400)' },
                        { label: 'RSI',       value: `${activeDiag.rsi?.toFixed(1)} ${activeDiag.rsi_extreme ? '🔥' : `(${activeDiag.rsi_watching} in ${activeDiag.rsi_distance_to_extreme?.toFixed(1)})`}`,
                          color: activeDiag.rsi_extreme ? (activeDiag.rsi_watching === 'BUY' ? 'var(--green)' : 'var(--red)') : 'var(--text-primary)' },
                        { label: 'VOLATILITY', value: `${activeDiag.volatility_pct}% ${activeDiag.volatility_ok ? '✅' : '⚠️'}`,
                          color: activeDiag.volatility_ok ? 'var(--green)' : 'var(--orange-400)' },
                        { label: 'MACD',      value: activeDiag.macd_bullish ? '🟢 Bullish' : activeDiag.macd_bearish ? '🔴 Bearish' : '⚪ Neutral',
                          color: activeDiag.macd_bullish ? 'var(--green)' : activeDiag.macd_bearish ? 'var(--red)' : 'var(--text-secondary)' },
                        { label: 'SIGNAL MIN', value: `${activeDiag.min_score_required}/100`, color: 'var(--text-secondary)' },
                      ].map(({ label, value, color }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{label}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Radar */}
                <AIRadar data={heatmap} />

                {/* All pairs diagnostics */}
                {diagnostics.length > 0 && (
                  <div style={{ background: 'var(--blue-800)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(249,115,22,0.05)' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: 'var(--orange-400)', letterSpacing: 1 }}>
                        ALL PAIRS
                      </span>
                    </div>
                    {diagnostics.map((d, i) => {
                      const h4Color = d.h4_trend === 'BULLISH' ? 'var(--green)' : d.h4_trend === 'BEARISH' ? 'var(--red)' : 'var(--orange-400)'
                      const isActive = d.symbol === activePair
                      return (
                        <button key={d.symbol} onClick={() => setActivePair(d.symbol)} style={{
                          width: '100%', textAlign: 'left',
                          padding: '11px 16px',
                          borderBottom: i < diagnostics.length - 1 ? '1px solid rgba(30,64,128,0.3)' : 'none',
                          background: isActive ? 'rgba(249,115,22,0.05)' : 'transparent',
                          borderLeft: isActive ? '3px solid var(--orange-400)' : '3px solid transparent',
                          border: 'none', cursor: 'pointer',
                          minHeight: 52,
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, color: isActive ? 'var(--orange-400)' : 'var(--white)' }}>
                                {d.symbol}
                              </span>
                              {d.rsi_extreme && (
                                <span style={{
                                  fontSize: 8, padding: '1px 5px', borderRadius: 3, fontWeight: 800,
                                  background: d.rsi_watching === 'BUY' ? 'var(--green-dim)' : 'var(--red-dim)',
                                  color: d.rsi_watching === 'BUY' ? 'var(--green)' : 'var(--red)',
                                  animation: 'pulse 1.5s ease infinite',
                                }}>🔥 {d.rsi_watching}</span>
                              )}
                            </div>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: h4Color }}>
                              {d.h4_trend === 'BULLISH' ? '▲ BUY' : d.h4_trend === 'BEARISH' ? '▼ SELL' : '— RANGING'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>
                              RSI {d.rsi?.toFixed(1)} · {d.rsi_distance_to_extreme?.toFixed(1)} to {d.rsi_watching}
                            </span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: d.volatility_ok ? 'var(--green)' : 'var(--text-dim)' }}>
                              {d.volatility_ok ? '✅ vol ok' : '⚠️ low vol'}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Heatmap */}
                <HeatmapTable data={heatmap} activePair={activePair} onSelect={setActivePair} />
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .dash-layout {
            grid-template-columns: 1fr !important;
          }
          .desktop-only { display: none !important; }
          .mobile-only  { display: flex !important; }
          .mobile-show  { display: flex !important; flex-direction: column; gap: 16px; padding: 16px; }
        }
        @media (min-width: 769px) {
          .mobile-only  { display: none !important; }
          .mobile-show  { display: flex !important; flex-direction: column; gap: 16px; padding: 16px; }
        }
      `}</style>
    </div>
  )
}
