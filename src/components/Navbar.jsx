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
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(5,14,31,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 64,
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, var(--orange-500), var(--orange-400))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: '#fff',
          boxShadow: '0 0 16px rgba(249,115,22,0.4)',
        }}>V</div>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20,
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
          }}>{link.label}</Link>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 1.5s ease infinite' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', letterSpacing: 1 }}>LIVE</span>
        </div>
        <a href="https://t.me/gammax_signals" target="_blank" rel="noopener noreferrer" style={{
          textDecoration: 'none',
          padding: '7px 16px', borderRadius: 8,
          background: 'linear-gradient(135deg, var(--orange-500), var(--orange-600))',
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#fff',
          boxShadow: '0 2px 12px rgba(249,115,22,0.3)',
          transition: 'all 0.2s',
        }}>Join Telegram</a>

        {/* Mobile menu button */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          display: 'none', background: 'none', border: 'none',
          color: 'var(--text-primary)', cursor: 'pointer', padding: 4,
        }} className="mobile-menu-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: 64, left: 0, right: 0,
          background: 'var(--blue-800)', borderBottom: '1px solid var(--border)',
          padding: 16, display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {links.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} style={{
              textDecoration: 'none', padding: '10px 16px', borderRadius: 8,
              fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500,
              color: pathname === link.to ? 'var(--white)' : 'var(--text-secondary)',
              background: pathname === link.to ? 'var(--blue-600)' : 'transparent',
            }}>{link.label}</Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
