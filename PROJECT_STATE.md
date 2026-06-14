# PROJECT_STATE.md
# Velix AI Trading Platform — Engineer Onboarding Document
# Last updated: 2026-05-26
# Maintained by: Velix CTO

---

## 1. Project Overview

Velix is an AI-powered trading signal platform for retail Forex, Gold and Commodity traders. The platform generates trading signals using a multi-condition technical analysis engine, broadcasts them to a Telegram channel automatically, and displays them on a web dashboard.

**Core value proposition:** Automated, rule-based AI signal generation with Entry, TP1, TP2 and Stop Loss levels — delivered to users via Telegram and a live web dashboard.

**Target users:** Retail traders in Malaysia and Southeast Asia trading Forex, Gold, Oil and indices.

**Business model:** Free public Telegram channel (growth/trust building) → paid VIP Telegram channel (subscription, RM49–99/month). Subscription system does not exist yet.

**Live URLs:**
- Frontend: `https://velix-frontend.netlify.app`
- Backend API: `https://gammax-backend-production.up.railway.app`
- Telegram Bot: `@gammax_ai_bot`
- Telegram Channel: `@gammax_signals`

---

## 2. Current Completion Status

| Area | Status | Notes |
|------|--------|-------|
| Backend API | ✅ Live | Railway, Python FastAPI |
| Signal engine | ✅ Functional | RSI 20/80 strategy |
| Telegram auto-broadcast | ✅ Working | Every hour via cron |
| Frontend website | ✅ Live | Netlify, React + Vite |
| Database | ✅ Connected | Supabase PostgreSQL |
| Signal history storage | ✅ Saving | Writing to Supabase on broadcast |
| TP/SL auto-detection | ❌ Missing | Manual only |
| Persistent cache | ❌ Missing | In-memory, lost on restart |
| Signal deduplication | ❌ Missing | Can re-broadcast same signal |
| Subscription system | ❌ Missing | No revenue collection |
| Admin error alerts | ❌ Missing | No failure notifications |
| User authentication | ❌ Missing | All data is public |
| Backtesting | ❌ Missing | Win rate unvalidated |

**Overall:** Functional prototype. Not ready for paying users.

---

## 3. Tech Stack

### Backend
- **Language:** Python 3.11.9
- **Framework:** FastAPI + Uvicorn
- **HTTP client:** httpx (async)
- **Data validation:** Pydantic v2
- **Hosting:** Railway (free tier, $5 credit remaining — needs upgrade)
- **Process manager:** Uvicorn via Procfile

### Frontend
- **Framework:** React 18 + Vite 5
- **Routing:** react-router-dom v6
- **Styling:** Inline styles only (no CSS framework)
- **Charts:** TradingView embedded widget
- **Hosting:** Netlify (free tier)
- **Build:** `npm run build` → `dist/`

### Database
- **Provider:** Supabase (free tier)
- **Engine:** PostgreSQL
- **Access:** REST API via httpx (no Supabase SDK installed)
- **Region:** Southeast Asia (Singapore)

### External Services
- **Market data (primary):** Twelve Data REST API — 3 keys, 800 credits/day each, auto-rotating
- **Market data (USOIL/US500):** Yahoo Finance unofficial endpoint — no API key, no SLA
- **Messaging:** Telegram Bot API via webhook
- **Scheduling:** cron-job.org (free, external HTTP cron)
- **Charts:** TradingView embed widget (free, no API key)

---

## 4. Existing Modules

### Backend modules

#### `services/signal_engine.py`
Core AI analysis engine. Responsibilities:
- Fetches OHLCV candle data from Twelve Data (`fetch_candles`) and Yahoo Finance (`fetch_candles_yahoo`)
- Routes data source per pair via `get_candles(symbol)`
- Calculates EMA 9, EMA 21, RSI 14, ATR 14
- Detects: Pin Bar, Engulfing candle, Double Bottom, Break of Structure, EMA turning direction, Support/Resistance levels
- Applies signal conditions (RSI 20/80 thresholds)
- Returns a `Signal` object or `None` if no valid setup
- `get_heatmap()` generates trend/RSI overview for all pairs

#### `services/telegram_service.py`
Telegram messaging layer. Responsibilities:
- `send_message(chat_id, text)` — sends Markdown message to any chat
- `broadcast_signal(signal)` — sends to public channel
- `handle_bot_command(chat_id, command, latest_signal)` — handles /start, /signal, /winrate, /subscribe, /status

#### `services/supabase_service.py`
Supabase database layer. Responsibilities:
- `save_signal(signal)` — inserts new signal record to `signal_history` table
- `get_signal_history(symbol, limit)` — retrieves historical signals
- `get_winrate_stats(symbol)` — calculates TP1/TP2/SL hit rates
- `update_signal_result(signal_id, result, hit_price)` — updates result (currently unused, manual only)

#### `routers/signals.py`
Main API router. All endpoints under `/api/signals/`. Responsibilities:
- Manages in-memory `_signal_cache` and `_heatmap_cache`
- `GET /update` — main cron endpoint: generates signals, broadcasts, saves to Supabase, updates heatmap
- `GET /all` — returns cached signals
- `GET /heatmap` — returns cached heatmap
- `GET /rsi-check` — checks RSI extremes from cached heatmap, sends alerts
- `GET /history` — reads from Supabase
- `GET /stats` — win rate stats from Supabase
- `GET /latest?symbol=` — single pair cached signal

#### `routers/telegram.py`
Telegram webhook receiver. Receives POST from Telegram, routes to `handle_bot_command`.

#### `routers/health.py`
`GET /` and `GET /health` — health check endpoints.

#### `models/signal.py`
Pydantic model for `Signal`. Contains `to_telegram_message()` which formats the Telegram broadcast message with emoji, confidence bar, TP/SL levels.

#### `main.py`
FastAPI app entry point. Mounts all routers. Configures CORS (allow all origins — to be tightened).

### Frontend modules

#### `pages/Landing.jsx`
Marketing homepage. Hero section, features grid, pairs ticker, CTA to Telegram. No API calls.

#### `pages/Dashboard.jsx`
Main trading dashboard. Fetches `/api/signals/all` and `/api/signals/heatmap` every 15 minutes. Renders pair tabs, SignalCard or MarketCard for active pair, TradingView chart, sidebar with AI analysis panel and heatmap.

#### `pages/History.jsx`
Signal history and win rate page. Fetches `/api/signals/history` and `/api/signals/stats`. Pair filter tabs. Table of past signals with result badges.

#### `components/Navbar.jsx`
Top navigation. Velix logo, page links, live indicator, Telegram CTA button. Mobile hamburger menu.

#### `components/SignalCard.jsx`
Renders an active signal: symbol, module, direction (BUY/SELL), entry/TP1/TP2/SL grid, trend/strength/RSI stats.

#### `components/MarketCard.jsx`
Renders market overview when no active signal exists for a pair. Shows price, RSI, trend, strength and "AI watching" status.

#### `components/TradingChart.jsx`
TradingView embedded chart widget. Maps Velix pair symbols to TradingView symbols (e.g. `XAU/USD` → `TRADENATION:XAUUSD`). Destroys and recreates widget on symbol change.

#### `components/HeatmapTable.jsx`
Sidebar heatmap list. Shows all pairs with trend direction, strength bar, RSI. Clickable to switch active pair.

---

## 5. Production-Ready Modules

These modules are stable and should not be modified without a clear reason:

- `routers/health.py` — stable
- `routers/telegram.py` — stable
- `models/signal.py` — stable, including `to_telegram_message()`
- `services/telegram_service.py` — stable
- `components/Navbar.jsx` — stable
- `components/SignalCard.jsx` — stable
- `components/MarketCard.jsx` — stable
- `components/HeatmapTable.jsx` — stable
- `pages/Landing.jsx` — stable
- Cron job schedule on cron-job.org — do not change timing without testing

---

## 6. Prototype Modules

These modules work but have known weaknesses:

- `services/signal_engine.py` — strategy unvalidated, Yahoo Finance source fragile
- `services/supabase_service.py` — `update_signal_result` exists but is never called automatically
- `routers/signals.py` — in-memory cache lost on restart, no deduplication logic
- `pages/Dashboard.jsx` — 15-min auto-refresh is slow; cache may be stale after restart
- `pages/History.jsx` — renders empty state until signals accumulate; result column always shows OPEN
- `components/TradingChart.jsx` — CXM:USOIL and GBEBROKERS:US500 may not load for all users

---

## 7. Missing Modules

These do not exist and must be built:

| Module | Priority | Description |
|--------|----------|-------------|
| `services/price_checker.py` | HIGH | Fetches current price, compares to open signal TP/SL, calls `update_signal_result` |
| Signal deduplication | HIGH | Prevents same signal broadcasting twice within 4 hours |
| Persistent cache on startup | HIGH | Load last known signals from Supabase into memory on app start |
| Admin alert system | HIGH | Sends Telegram DM to owner on critical failures |
| `pages/Pricing.jsx` | MEDIUM | Pricing plans page for website |
| Subscription table in Supabase | MEDIUM | Track paying users |
| VIP channel broadcast | MEDIUM | `TELEGRAM_VIP_CHANNEL_ID` env var exists but VIP broadcast not wired in |
| Rate limiting | MEDIUM | Prevent API abuse |
| Backtest script | MEDIUM | Validate RSI 20/80 strategy against historical data |
| Favicon + OG meta tags | LOW | SEO and social sharing |
| Custom domain | LOW | velix.ai or velix.trade |

---

## 8. Current Sprint

**Sprint goal:** Stabilise data persistence and begin TP/SL auto-detection so the Signal History page shows real results.

**Active issues:**
- `[BE-01]` Signal deduplication — prevent same signal re-broadcasting within 4 hours
- `[BE-15]` Create `signal_cache` table in Supabase
- `[BE-16]` Upsert signal cache on every successful signal generation
- `[BE-17]` Load signal cache from Supabase on app startup
- `[BE-23]` Create `price_checker` service
- `[BE-28]` Wire price checker into existing 15-min RSI cron endpoint
- `[BE-29]` Send Telegram TP1/TP2/SL hit notifications
- `[OPS-01]` Upgrade Railway to paid plan before free credit expires

---

## 9. Current Highest Priority

**TP/SL Auto-Detection (`services/price_checker.py`)**

Without this, the Signal History page permanently shows every signal as `OPEN`. Users and potential subscribers cannot evaluate signal quality. This is the single most important missing piece before accepting paying users.

Implementation approach:
1. Query Supabase for all signals where `result = 'OPEN'`
2. For each open signal, call `get_candles(symbol)` to get current price
3. Compare current price to `tp1`, `tp2`, `sl`
4. If hit: call `update_signal_result(id, result, hit_price)` and send Telegram notification
5. Integrate into the existing `/api/signals/rsi-check` endpoint (already runs every 15 minutes)

---

## 10. Important Backend Files

```
gammax-backend/
├── main.py                          # App entry point, router mounting, CORS
├── Procfile                         # web: uvicorn main:app --host 0.0.0.0 --port $PORT
├── requirements.txt                 # fastapi, uvicorn, httpx, pydantic, python-dotenv
├── .python-version                  # 3.11.9
├── models/
│   └── signal.py                    # Signal Pydantic model + to_telegram_message()
├── routers/
│   ├── signals.py                   # All /api/signals/* endpoints + in-memory cache
│   ├── telegram.py                  # Webhook receiver
│   └── health.py                    # / and /health
└── services/
    ├── signal_engine.py             # AI engine: data fetching, indicators, signal logic
    ├── telegram_service.py          # send_message, broadcast_signal, handle_bot_command
    └── supabase_service.py          # save_signal, get_signal_history, update_signal_result
```

**Railway environment variables (all required):**
```
TWELVE_DATA_API_KEY       # Key 1 (primary)
TWELVE_DATA_API_KEY_2     # Key 2 (fallback)
TWELVE_DATA_API_KEY_3     # Key 3 (fallback)
TELEGRAM_BOT_TOKEN        # Bot token from BotFather
TELEGRAM_CHANNEL_ID       # @gammax_signals (public)
TELEGRAM_VIP_CHANNEL_ID   # (empty for now)
SUPABASE_URL              # https://jllwhxoivccmezwefzpl.supabase.co
SUPABASE_KEY              # Supabase secret key
ALPHA_VANTAGE_API_KEY     # Inactive, reserved
```

---

## 11. Important Frontend Files

```
velix-frontend/
├── index.html                       # App shell, Google Fonts (Inter, Space Grotesk, JetBrains Mono)
├── vite.config.js                   # Vite + React plugin
├── netlify.toml                     # build: npm run build, publish: dist, SPA redirect
├── package.json                     # react, react-dom, react-router-dom, vite
├── src/
│   ├── main.jsx                     # ReactDOM root, BrowserRouter
│   ├── App.jsx                      # Routes: / /dashboard /history
│   ├── index.css                    # CSS variables (brand colours), global reset, animations
│   ├── pages/
│   │   ├── Landing.jsx              # Marketing homepage
│   │   ├── Dashboard.jsx            # Live signals + chart + heatmap
│   │   └── History.jsx              # Signal history table + win rate
│   └── components/
│       ├── Navbar.jsx               # Top nav + mobile menu
│       ├── SignalCard.jsx           # Active signal display
│       ├── MarketCard.jsx           # No-signal market overview
│       ├── TradingChart.jsx         # TradingView widget wrapper
│       └── HeatmapTable.jsx         # Sidebar pair list
```

**Netlify environment variable:**
```
VITE_API_URL    # https://gammax-backend-production.up.railway.app
```

**Brand colours (defined in `src/index.css`):**
- Primary: Deep blue `#050e1f` (70%)
- Secondary: White `#ffffff` (20%)
- Accent: Orange `#f97316` (10%)
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (mono/data)

---

## 12. Constraints

**Do not change:**
- Telegram channel username `@gammax_signals` — already shared publicly
- Bot username `@gammax_ai_bot` — already shared publicly
- Supabase `signal_history` table schema — data already being written to it
- Railway service name — URL is hardcoded in Netlify env var and cron-job.org
- `to_telegram_message()` format in `models/signal.py` — users expect this format

**Technical constraints:**
- Twelve Data free tier: 800 credits/day per key. Each full signal update cycle (6 pairs × 100 candles) costs approximately 6 credits. Heatmap costs another 6. Total: ~12 credits per cron run × 24 runs = ~288 credits/day per key. Headroom exists but manual testing burns credits fast.
- Yahoo Finance has no rate limit documentation and no SLA. Treat USOIL and US500 as best-effort only.
- Railway free tier has ~$5 credit remaining. Must upgrade to Hobby ($5/month) before credit expires or backend goes offline.
- Supabase free tier: 500MB storage, 2GB bandwidth/month. Not a concern at current scale.
- cron-job.org free tier: unlimited jobs but minimum 1-minute interval. Current setup uses 1-hour and 15-minute intervals.
- Frontend has no authentication. All API endpoints are public. Do not store sensitive user data on the frontend.

**Code style constraints:**
- Backend: async/await throughout. No synchronous HTTP calls.
- Frontend: inline styles only — no Tailwind, no CSS modules, no styled-components.
- All prices and financial values stored as `DECIMAL(15,5)` in Supabase.
- Python files must use 4-space indentation. GitHub web editor has caused indentation bugs — prefer raw file replacement over in-editor edits.

---

## 13. Definition of Done — Next Milestone

**Milestone: TP/SL Auto-Detection**

The milestone is complete when ALL of the following are true:

- [ ] `services/price_checker.py` exists and is importable
- [ ] `check_open_signals()` async function queries Supabase for all `result = 'OPEN'` signals
- [ ] For each open signal, current price is fetched via `get_candles(symbol)` from `signal_engine.py`
- [ ] TP1, TP2 and SL levels are compared against the current candle close price
- [ ] On TP1 hit: `update_signal_result(id, 'TP1', hit_price)` is called successfully
- [ ] On TP2 hit: `update_signal_result(id, 'TP2', hit_price)` is called successfully
- [ ] On SL hit: `update_signal_result(id, 'SL', hit_price)` is called successfully
- [ ] On any hit: a formatted Telegram message is sent to `@gammax_signals`
- [ ] `check_open_signals()` is called inside the existing `/api/signals/rsi-check` endpoint
- [ ] Supabase `signal_history` table shows non-OPEN results after a signal is closed
- [ ] Velix `/history` page displays TP1/TP2/SL result badges correctly
- [ ] No duplicate hit notifications sent for the same signal
- [ ] Railway Deploy Logs show `[PriceChecker]` log lines confirming checks are running
- [ ] Tested manually by verifying a known closed signal updates correctly in Supabase

---

*This document should be updated after every sprint. Do not let it go stale.*
