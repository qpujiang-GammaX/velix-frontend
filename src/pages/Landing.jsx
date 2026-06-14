import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '🤖', title: 'Multi-AI Engine', desc: 'GAMMA, PEAK, OMEGA & DELTA AI modules analyze different market conditions simultaneously.' },
  { icon: '⚡', title: 'Real-Time Signals', desc: 'Signals generated every hour with Entry, TP1, TP2 and Stop Loss levels.' },
  { icon: '📊', title: 'Market Heatmap', desc: 'Instant overview of trend direction and strength across all tracked pairs.' },
  { icon: '📡', title: 'Telegram Alerts', desc: 'Instant signal delivery to your phone via Telegram. Never miss a setup.' },
  { icon: '🎯', title: 'RSI Alerts', desc: 'Automatic alerts when RSI hits extreme levels (30/70) on any pair.' },
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
    <main style={{ flex: 1 }}>
      {/* Hero */}
      <section style={{
        padding: '80px 24px 100px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 300,
          background: 'radial-gradient(ellipse, rgba(249,115,22,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 100,
            background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)',
            marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--orange-500)', animation: 'pulse 1.5s ease infinite' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--orange-400)', letterSpacing: 1 }}>
              AI-POWERED TRADING SIGNALS
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1px',
            color: 'var(--white)', marginBottom: 20,
          }}>
            Trade Smarter with<br />
            <span style={{ color: 'var(--orange-500)' }}>Velix AI</span>
          </h1>

          <p style={{
            fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7,
            maxWidth: 520, margin: '0 auto 40px',
          }}>
            Institutional-grade AI analysis for Forex, Gold & Commodities.
            Real-time signals with Entry, TP and Stop Loss levels.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" style={{
              textDecoration: 'none',
              padding: '14px 28px', borderRadius: 10,
              background: 'linear-gradient(135deg, var(--orange-500), var(--orange-600))',
              fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: '#fff',
              boxShadow: '0 4px 20px rgba(249,115,22,0.35)',
              transition: 'all 0.2s',
            }}>View Live Signals →</Link>

            <a href="https://t.me/gammax_signals" target="_blank" rel="noopener noreferrer" style={{
              textDecoration: 'none',
              padding: '14px 28px', borderRadius: 10,
              background: 'var(--blue-700)', border: '1px solid var(--border-bright)',
              fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600,
              color: 'var(--text-primary)', transition: 'all 0.2s',
            }}>Join Telegram Channel</a>
          </div>
        </div>
      </section>

      {/* Pairs ticker */}
      <section style={{
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        background: 'var(--blue-800)', padding: '16px 24px',
        overflowX: 'auto',
      }}>
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', minWidth: 'max-content', margin: '0 auto' }}>
          {PAIRS.map(pair => (
            <div key={pair.symbol} style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: 18 }}>{pair.flag}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--white)' }}>{pair.symbol}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>{pair.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700, color: 'var(--white)', marginBottom: 12,
          }}>Everything you need to trade with confidence</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
            Powered by multiple AI modules working together
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: 'var(--blue-800)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '24px',
              transition: 'border-color 0.2s',
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--white)', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
        background: 'var(--blue-800)',
        borderTop: '1px solid var(--border)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)',
          fontWeight: 700, color: 'var(--white)', marginBottom: 16,
        }}>Start receiving signals today</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 32 }}>
          Join our Telegram channel for free real-time alerts
        </p>
        <a href="https://t.me/gammax_signals" target="_blank" rel="noopener noreferrer" style={{
          textDecoration: 'none',
          display: 'inline-block',
          padding: '14px 32px', borderRadius: 10,
          background: 'linear-gradient(135deg, var(--orange-500), var(--orange-600))',
          fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: '#fff',
          boxShadow: '0 4px 20px rgba(249,115,22,0.35)',
        }}>Join @gammax_signals →</a>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '24px', textAlign: 'center',
        borderTop: '1px solid var(--border)',
      }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>
          © 2026 Velix AI · Not financial advice · Trade responsibly
        </p>
      </footer>
    </main>
  )
}
