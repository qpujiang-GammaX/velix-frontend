# REALITY_AUDIT.md

# Velix Reality Audit

Compared sources:
- Documentation: `C:\Users\kaboa\Downloads\velix-frontend\velix\PROJECT_STATE.md`
- Frontend files inspected: `C:\Users\kaboa\Downloads\velix-frontend\velix`
- Backend files inspected: `C:\Users\kaboa\Downloads\Gamma\gammax_platform\gammax\backend`

Audit date: 2026-06-01

Note: neither inspected folder is a Git repository according to `git status`. The frontend folder contains `PROJECT_STATE.md`; the backend folder was located separately by searching for the documented backend modules.

## Matching

### Frontend modules

| Module | Reality | Notes |
|---|---|---|
| `index.html` | Exists | App shell exists. |
| `vite.config.js` | Exists | Vite React config exists. |
| `netlify.toml` | Exists | Netlify config exists. |
| `package.json` | Exists | React 18, Vite 5, `react-router-dom` v6 are present. |
| `.env.example` | Exists | Contains `VITE_API_URL=https://gammax-backend-production.up.railway.app`. |
| `src/main.jsx` | Exists | Uses `BrowserRouter` and renders `App`. |
| `src/App.jsx` | Exists | Routes `/`, `/dashboard`, `/history`. |
| `src/index.css` | Exists | Global CSS variables and styles exist. |
| `src/pages/Landing.jsx` | Exists | Marketing homepage exists. |
| `src/pages/Dashboard.jsx` | Exists | Fetches `/api/signals/all` and `/api/signals/heatmap` every 15 minutes. |
| `src/pages/History.jsx` | Exists | Fetches `/api/signals/history` and `/api/signals/stats`; displays result badges. |
| `src/components/Navbar.jsx` | Exists | Navigation component exists. |
| `src/components/SignalCard.jsx` | Exists | Active signal display exists. |
| `src/components/MarketCard.jsx` | Exists | Market overview card exists. |
| `src/components/TradingChart.jsx` | Exists | TradingView widget wrapper exists. |
| `src/components/HeatmapTable.jsx` | Exists | Heatmap table exists. |

### Backend modules

| Module | Reality | Notes |
|---|---|---|
| `main.py` | Exists | FastAPI app mounts health, signals, and telegram routers; CORS allows all origins. |
| `requirements.txt` | Exists | Contains FastAPI, Uvicorn, httpx, Pydantic, python-dotenv. |
| `models/signal.py` | Exists | Defines `Signal`, enums, and `to_telegram_message()`. |
| `routers/health.py` | Exists | Defines `/` and `/health`. |
| `routers/telegram.py` | Exists | Telegram webhook endpoint exists and routes messages to command handler. |
| `services/telegram_service.py` | Exists | `send_message`, `broadcast_signal`, and `handle_bot_command` exist. Also includes `send_tp_hit_update`. |
| `services/signal_engine.py` | Partially exists | Core indicator and signal-generation logic exists, but documented candle routing and advanced pattern detection do not. |
| `routers/signals.py` | Partially exists | Basic signal endpoints exist, but several documented cron/history/cache endpoints do not. |

## Missing

### Backend files documented but not present

| Module/File | Reality | Documentation claim |
|---|---|---|
| `services/supabase_service.py` | Missing | Document says it handles `save_signal`, `get_signal_history`, `get_winrate_stats`, and `update_signal_result`. |
| `services/price_checker.py` | Missing | Document correctly lists it as a missing high-priority module. |
| `Procfile` | Missing | Document lists it as an important backend file. |
| `.python-version` | Missing | Document lists Python `3.11.9` via `.python-version`. |

### Backend endpoints documented but not present

| Endpoint | Reality | Notes |
|---|---|---|
| `GET /api/signals/update` | Missing | Document says this is the main cron endpoint. Actual router has no `/update`. |
| `GET /api/signals/rsi-check` | Missing | Document says this runs every 15 minutes and should later call price checker. |
| `GET /api/signals/history` | Missing | Frontend calls this endpoint, but backend router does not define it. |
| `GET /api/signals/stats` | Missing | Frontend calls this endpoint, but backend router does not define it. |
| `GET /api/signals/latest?symbol=` | Partially exists | Actual route exists as `/latest`, but it generates a fresh signal instead of returning only cached/latest persisted data. |

### Backend behavior documented but not present

| Feature | Reality | Notes |
|---|---|---|
| Supabase database connection | Missing in inspected backend | No Supabase URL/key usage or Supabase service file found. |
| Signal history storage | Missing in inspected backend | Broadcast endpoint does not save generated signals. |
| Win-rate stats | Missing in inspected backend | No stats service or endpoint. |
| Persistent signal cache | Missing | Only in-memory `_signal_cache` exists. |
| `_heatmap_cache` | Missing | Document says router manages `_heatmap_cache`; actual router does not. |
| Signal deduplication | Missing | No dedupe logic found. |
| Admin alert system | Missing | No owner/admin alert code found. |
| Rate limiting | Missing | No rate limiting found. |
| Backtest script | Missing | No backtest file found. |
| Subscription system/table | Missing | No subscription implementation found. |

### Market-data support documented but not present

| Feature | Reality | Notes |
|---|---|---|
| `fetch_candles` | Missing | Actual function is `fetch_price_data`. |
| `fetch_candles_yahoo` | Missing | No Yahoo Finance fetcher found. |
| `get_candles(symbol)` | Missing | No routing function found. |
| Three Twelve Data API keys with auto-rotation | Missing | Actual backend reads only `TWELVE_DATA_API_KEY`. |
| USOIL/US500 backend support | Missing | Backend `PAIRS` only includes `XAUUSD`, `EURUSD`, `BTCUSD`, `GBPUSD`. |
| `USD/JPY` support | Missing | Frontend lists it; backend does not. |

## Unexpected

| Item | Reality | Why unexpected |
|---|---|---|
| Frontend and backend are in different folders | Frontend is under `Downloads\velix-frontend\velix`; backend is under `Downloads\Gamma\gammax_platform\gammax\backend`. | `PROJECT_STATE.md` presents one project state, but the inspected code is split across separate locations. |
| Neither inspected folder is a Git repository | `git status` fails in both folders. | The request refers to the actual repository, but the inspected folders appear to be file copies, not repo roots. |
| Backend has a literal `{routers,services,models}` directory | Empty-looking directory named `{routers,services,models}` exists. | This looks like an accidental shell brace-expansion artifact. |
| `services/telegram_service.py` includes `send_tp_hit_update` | Exists but is not mentioned in the documented module responsibilities. | This is a partial start toward BE-29, but only TP notifications are represented. |
| `routers/signals.py` has `POST /broadcast` | Exists, but not listed in `PROJECT_STATE.md` under router responsibilities. | Documentation emphasizes `/update` cron instead. |
| `routers/signals.py` has `GET /cached/{symbol}` | Exists, but not documented. | Actual cache access differs from documented `/latest` behavior. |
| Backend supports `BTCUSD` | Actual `PAIRS` includes `BTCUSD`. | Frontend documented/current pair tabs focus on `XAU/USD`, `EUR/USD`, `GBP/USD`, `USD/JPY`, `USOIL`, `US500`; BTC is not in those tabs. |
| Frontend symbols contain slashes | Frontend uses `XAU/USD`, `EUR/USD`, `GBP/USD`, `USD/JPY`. | Backend uses compact symbols like `XAUUSD`; this may prevent matching active signals/heatmap rows. |
| Encoding artifacts appear in source and docs | Many emoji/box-drawing characters render as mojibake. | This may be an encoding issue in copied files, terminal output, or source files. |

## Outdated Documentation

### Completion status appears ahead of inspected backend

| Documentation claim | Actual repository state |
|---|---|
| Backend API is live and includes current production behavior | Local backend is a minimal FastAPI app; production status cannot be verified from files. |
| Database is connected | No Supabase service, env vars, imports, or HTTP calls found in inspected backend. |
| Signal history storage is saving to Supabase on broadcast | Actual broadcast endpoint only generates and broadcasts; it does not save. |
| Telegram auto-broadcast works every hour via cron | Actual backend has `POST /broadcast`; no `/update` endpoint or cron config found locally. |
| Signal engine uses RSI 20/80 strategy | Actual `generate_signal` uses trend plus RSI thresholds around 65/35, not strict RSI 20/80. |
| Signal engine detects pin bar, engulfing, double bottom, BOS, EMA turning, support/resistance | Actual signal engine only calculates EMA, RSI, ATR, trend, risk, and TP/SL. |
| Signal engine routes Twelve Data/Yahoo via `get_candles(symbol)` | Actual engine only uses Twelve Data via `fetch_price_data`. |
| Backend tracks 6 pairs including gold, forex, oil, and indices | Actual backend tracks 4 pairs: `XAUUSD`, `EURUSD`, `BTCUSD`, `GBPUSD`. |
| `routers/signals.py` manages `_heatmap_cache` | Actual router has only `_signal_cache`. |
| `/history` and `/stats` are available | Frontend expects them, but backend does not define them. |
| `services/supabase_service.py` is a prototype module | It is missing from inspected backend. |
| VIP channel broadcast is not wired in | Actual `broadcast_signal` sends to `VIP_CHANNEL` if configured. The broader VIP product is still missing. |
| Important backend files include `Procfile` and `.python-version` | Both are missing in inspected backend. |

### Frontend documentation mostly matches, with symbol/API caveats

| Documentation claim | Actual repository state |
|---|---|
| Frontend is React 18 + Vite 5 | Matches. |
| Routing uses `react-router-dom` v6 | Matches. |
| Inline styles only | Mostly matches; there is also global `index.css`, as documented. |
| Dashboard fetches `/all` and `/heatmap` every 15 minutes | Matches. |
| History fetches `/history` and `/stats` | Matches frontend code, but backend lacks those endpoints. |
| TradingChart maps Velix pair symbols to TradingView symbols | Component exists; exact mapping should be reviewed separately if needed. |

## Recommended Updates to PROJECT_STATE.md

1. Add a repository-location note distinguishing the frontend folder from the backend folder, or point to the actual monorepo/repo root if these inspected folders are not authoritative.

2. Change backend completion status from "Database connected" and "Signal history storage saving" to "Not present in inspected backend" unless another backend branch contains `supabase_service.py`.

3. Update `services/signal_engine.py` documentation to match current reality:
   - Actual functions: `fetch_price_data`, `calculate_ema`, `calculate_rsi`, `detect_trend`, `calculate_atr`, `select_ai_module`, `assess_risk`, `generate_signal`, `get_heatmap`.
   - Missing functions: `fetch_candles`, `fetch_candles_yahoo`, `get_candles`.
   - Missing advanced detections: pin bar, engulfing, double bottom, BOS, EMA turning, support/resistance.

4. Update `routers/signals.py` documentation to list actual endpoints:
   - `GET /latest`
   - `GET /all`
   - `GET /heatmap`
   - `POST /broadcast`
   - `GET /cached/{symbol}`

5. Mark these documented endpoints as planned/missing, not existing:
   - `GET /update`
   - `GET /rsi-check`
   - `GET /history`
   - `GET /stats`

6. Move `services/supabase_service.py` from "Existing Modules" / "Prototype Modules" into "Missing Modules" for the inspected backend, unless a different backend branch is the source of truth.

7. Keep `services/price_checker.py` listed as missing, but update its prerequisites: it depends on adding or restoring Supabase access and a current-price/candle helper first.

8. Update environment-variable documentation for inspected backend:
   - Present in `.env.example`: `TWELVE_DATA_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID`, `TELEGRAM_VIP_CHANNEL_ID`.
   - Missing from `.env.example`: `TWELVE_DATA_API_KEY_2`, `TWELVE_DATA_API_KEY_3`, `SUPABASE_URL`, `SUPABASE_KEY`, `ALPHA_VANTAGE_API_KEY`.

9. Update pair coverage documentation:
   - Backend actual: `XAUUSD`, `EURUSD`, `BTCUSD`, `GBPUSD`.
   - Frontend actual: `XAU/USD`, `EUR/USD`, `GBP/USD`, `USD/JPY`, `USOIL`, `US500`.
   - Document the symbol normalization gap between frontend and backend.

10. Update "VIP channel broadcast not wired in": actual Telegram broadcast already sends to `TELEGRAM_VIP_CHANNEL_ID` when configured, although subscription/VIP product logic is still missing.

11. Add the unexpected actual endpoints `POST /broadcast` and `GET /cached/{symbol}` to the backend module section.

12. Add a note that `Procfile` and `.python-version` are documented but absent from the inspected backend folder.
