import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '🤖', title: 'Multi-AI Engine', desc: 'GAMMA, PEAK, OMEGA & DELTA AI modules analyze different market conditions simultaneously.' },
  { icon: '⚡', title: 'Real-Time Signals', desc: 'Signals generated every hour with Entry, TP1, TP2 and Stop Loss levels.' },
  { icon: '📊', title: 'Market Heatmap', desc: 'Instant overview of trend direction and strength across all tracked pairs.' },
  { icon: '📡', title: 'Telegram Alerts', desc: 'Instant signal delivery to your phone via Telegram. Never miss a setup.' },
  { icon: '🎯', title: 'RSI Alerts', desc: 'Automatic alerts when RSI hits extreme levels (20/80) on any pair.' },
  { icon: '📈', title: 'Signal History', desc: 'Full track record of every signal with TP/SL results and win rate stats.' },
]

const PAIRS = [
  { symbol: 'XAU/USD', name: 'Gold', flag: '🥇' },
  { symbol: 'EUR/USD', name: 'Euro', flag: '🇪🇺' },
  { symbol: 'GBP/USD', name: 'Pound', flag: '🇬🇧' },
  { symbol: 'USD/JPY', name: 'Yen', flag: '🇯🇵' },
  { symbol: 'USOIL',   name: 'Crude Oil', flag: '🛢️' },
  { symbol: 'US500',   name: 'S&P 500', flag: '📈' },
]

export default function Landing() {
  return (
    <main style={{ flex: 1, overflowX: 'hidden' }}>
      {/* Hero */}
      <section style={{
        padding: 'clamp(48px, 10vw, 96px) 20px clamp(56px, 12vw, 112px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 'min(600px, 100vw)', height: 300,
          background: 'radial-gradient(ellipse, rgba(249,115,22,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 100,
            background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)',
            marginBottom: 24,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--orange-500)', animation: 'pulse 1.5s ease infinite', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--orange-400)', letterSpacing: 1 }}>
              AI-POWERED TRADING SIGNALS
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 8vw, 64px)',
            fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.5px',
            color: 'var(--white)', marginBottom: 16,
          }}>
            Trade Smarter with<br />
            <span style={{ color: 'var(--orange-500)' }}>Velix AI</span>
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 4vw, 18px)',
            color: 'var(--text-secondary)', lineHeight: 1.7,
            maxWidth: 480, margin: '0 auto 32px',
            padding: '0 8px',
          }}>
            Institutional-grade AI analysis for Forex, Gold & Commodities.
            Real-time signals with Entry, TP and Stop Loss levels.
          </p>

          {/* CTA buttons — stack on mobile */}
          <div style={{
            display: 'flex', gap: 12, justifyContent: 'center',
            flexDirection: 'column', alignItems: 'center',
            padding: '0 16px',
          }}>
            <Link to="/dashboard" style={{
              textDecoration: 'none', width: '100%', maxWidth: 320,
              padding: '14px 28px', borderRadius: 12,
              background: 'linear-gradient(135deg, var(--orange-500), var(--orange-600))',
              fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: '#fff',
              boxShadow: '0 4px 20px rgba(249,115,22,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: 'var(--touch-target)',
            }}>View Live Signals →</Link>

            <a href="https://t.me/gammax_signals" target="_blank" rel="noopener noreferrer" style={{
              textDecoration: 'none', width: '100%', maxWidth: 320,
              padding: '14px 28px', borderRadius: 12,
              background: 'var(--blue-700)', border: '1px solid var(--border-bright)',
              fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600,
              color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: 'var(--touch-target)',
            }}>Join Telegram Channel</a>
          </div>
        </div>
      </section>

      {/* Pairs ticker */}
      <section style={{
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        background: 'var(--blue-800)', padding: '14px 0',
        overflowX: 'auto', WebkitOverflowScrolling: 'touch',
      }}>
        <div style={{
          display: 'flex', gap: 'clamp(16px, 5vw, 32px)',
          padding: '0 20px',
          minWidth: 'max-content',
        }}>
          {PAIRS.map(pair => (
            <div key={pair.symbol} style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: 20 }}>{pair.flag}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--white)' }}>{pair.symbol}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>{pair.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: 'clamp(48px, 10vw, 80px) 20px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 5vw, 32px)',
            fontWeight: 700, color: 'var(--white)', marginBottom: 10,
          }}>Everything you need to trade with confidence</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Powered by multiple AI modules working together
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: 16,
        }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: 'var(--blue-800)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: 'clamp(16px, 4vw, 24px)',
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600,
                color: 'var(--white)', marginBottom: 8,
              }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section style={{
        background: 'var(--blue-800)',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        padding: 'clamp(24px, 6vw, 40px) 20px',
      }}>
        <div style={{
          maxWidth: 800, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16, textAlign: 'center',
        }}>
          {[
            { value: '6', label: 'Markets Tracked' },
            { value: '24/7', label: 'AI Monitoring' },
            { value: 'RSI 20/80', label: 'Precision Filter' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(20px, 5vw, 32px)',
                fontWeight: 700, color: 'var(--orange-400)', marginBottom: 4,
              }}>{value}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', letterSpacing: 1 }}>
                {label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: 'clamp(48px, 10vw, 80px) 20px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(20px, 5vw, 32px)',
          fontWeight: 700, color: 'var(--white)', marginBottom: 12,
        }}>Start receiving signals today</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 28, padding: '0 16px' }}>
          Join our Telegram channel for free real-time alerts
        </p>
        <a href="https://t.me/gammax_signals" target="_blank" rel="noopener noreferrer" style={{
          textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          padding: '14px 32px', borderRadius: 12,
          background: 'linear-gradient(135deg, var(--orange-500), var(--orange-600))',
          fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: '#fff',
          boxShadow: '0 4px 20px rgba(249,115,22,0.35)',
          minHeight: 'var(--touch-target)', minWidth: 200,
        }}>Join @gammax_signals →</a>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '20px', textAlign: 'center',
        borderTop: '1px solid var(--border)',
      }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>
          © 2026 Velix AI · Not financial advice · Trade responsibly
        </p>
      </footer>
    </main>
  )
}
