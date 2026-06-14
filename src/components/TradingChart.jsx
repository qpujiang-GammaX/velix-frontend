import { useEffect, useRef } from 'react'

const SYMBOL_MAP = {
  'XAU/USD': 'TRADENATION:XAUUSD',
  'EUR/USD': 'OANDA:EURUSD',
  'GBP/USD': 'OANDA:GBPUSD',
  'USD/JPY': 'OANDA:USDJPY',
  'USOIL':   'CXM:USOIL',
  'US500':   'GBEBROKERS:US500',
}

export default function TradingChart({ symbol, height = 580 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const tvSymbol = SYMBOL_MAP[symbol] || `OANDA:${symbol.replace('/', '')}`

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: '60',
      timezone: 'Asia/Kuala_Lumpur',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: '#081428',
      gridColor: 'rgba(30,64,128,0.15)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      hide_volume: false,
      support_host: 'https://www.tradingview.com',
      studies: ['STD;RSI', 'STD;EMA'],
    })

    containerRef.current.appendChild(script)
    return () => { if (containerRef.current) containerRef.current.innerHTML = '' }
  }, [symbol])

  return (
    <div style={{
      background: 'var(--blue-800)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(249,115,22,0.03)',
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 1.5s ease infinite' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', letterSpacing: 1 }}>LIVE CHART</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: 'var(--orange-400)' }}>{symbol}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>· H1 · TradingView</span>
      </div>
      <div ref={containerRef} className="tradingview-widget-container" style={{ height, width: '100%' }} />
    </div>
  )
}
