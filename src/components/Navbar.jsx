import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/',          label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/history',   label: 'History' },
  ]

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(5,14,31,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 56,
        width: '100%',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--orange-500), var(--orange-600))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: '#fff',
            boxShadow: '0 0 16px rgba(249,115,22,0.4)',
          }}>V</div>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
            color: 'var(--white)', letterSpacing: '-0.5px',
          }}>Velix</span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
          {links.map(link => (
            <Link key={link.to} to={link.to} style={{
              textDecoration: 'none',
              padding: '6px 14px', borderRadius: 8,
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
              color: pathname === link.to ? 'var(--white)' : 'var(--text-secondary)',
              background: pathname === link.to ? 'var(--blue-600)' : 'transparent',
              transition: 'all 0.2s',
              minHeight: 'var(--touch-target)',
              display: 'flex', alignItems: 'center',
            }}>{link.label}</Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 1.5s ease infinite', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)', letterSpacing: 1 }} className="live-text">LIVE</span>
          </div>

          {/* Telegram button — desktop only */}
          <a href="https://t.me/gammax_signals" target="_blank" rel="noopener noreferrer"
            className="tg-btn-desktop"
            style={{
              textDecoration: 'none',
              padding: '8px 14px', borderRadius: 8,
              background: 'linear-gradient(135deg, var(--orange-500), var(--orange-600))',
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#fff',
              boxShadow: '0 2px 12px rgba(249,115,22,0.3)',
              whiteSpace: 'nowrap',
              minHeight: 'var(--touch-target)',
              display: 'flex', alignItems: 'center',
            }}>Join Telegram</a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{
              background: menuOpen ? 'var(--blue-700)' : 'none',
              border: '1px solid',
              borderColor: menuOpen ? 'var(--border-bright)' : 'transparent',
              borderRadius: 8,
              color: 'var(--text-primary)', cursor: 'pointer',
              padding: '8px', display: 'none',
              minWidth: 'var(--touch-target)', minHeight: 'var(--touch-target)',
              alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 56, left: 0, right: 0, zIndex: 99,
          background: 'var(--blue-800)',
          borderBottom: '1px solid var(--border)',
          padding: '8px 16px 16px',
          display: 'flex', flexDirection: 'column', gap: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          {links.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} style={{
              textDecoration: 'none',
              padding: '12px 16px', borderRadius: 10,
              fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 500,
              color: pathname === link.to ? 'var(--white)' : 'var(--text-secondary)',
              background: pathname === link.to ? 'var(--blue-600)' : 'rgba(255,255,255,0.03)',
              border: '1px solid',
              borderColor: pathname === link.to ? 'rgba(249,115,22,0.3)' : 'transparent',
              minHeight: 'var(--touch-target)',
              display: 'flex', alignItems: 'center',
            }}>{link.label}</Link>
          ))}

          <a href="https://t.me/gammax_signals" target="_blank" rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            style={{
              textDecoration: 'none', marginTop: 8,
              padding: '12px 16px', borderRadius: 10,
              background: 'linear-gradient(135deg, var(--orange-500), var(--orange-600))',
              fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: '#fff',
              textAlign: 'center', minHeight: 'var(--touch-target)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>📱 Join Telegram Channel</a>
        </div>
      )}

      {/* Overlay to close menu */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 98,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .tg-btn-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .live-text { display: none; }
        }
        @media (min-width: 641px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  )
}
