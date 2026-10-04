# ARENA CORE — Session State & Milestone Roadmap

> **Last Updated:** 2026-10-04  
> **Active Branch:** `main`  
> **Live Site:** https://lemon-ocean-06aede400.5.azurestaticapps.net/  
> **Repo:** `omwe77/Arena_Core`  
> **Deployed via:** GitHub Actions → Azure Static Web Apps (auto on push to `main`)

---

## 🏁 Milestone Completion Status

| # | Milestone | Status | Commit |
|---|-----------|--------|--------|
| 0 | Forensic Audit + Brand Standardization | ✅ DONE | `cd53c6e` |
| 1 | Application State + Client-Side Routing | ✅ DONE | `ed6adc0` |
| 2 | Data Provenance Separation | ✅ DONE | `8ced369` |
| 3 | Unified Match Center | ⏳ TODO | — |
| 4 | Premium Design System Overhaul | ✅ DONE | `f272d65` |
| 5 | Seeded PRNG Simulation Engine | ✅ DONE | `8aba6b2` |
| 6 | Simulation Event Stream + Replay | ⏳ TODO | — |
| 7 | Real Standings + Fixtures Integration | ⏳ TODO | — |
| 8 | Top Scorers & Player Stats Panel | ⏳ TODO | — |
| 9 | Competition Header + Hero Redesign | ⏳ TODO | — |
| 10 | Responsive Mobile Layout | ⏳ TODO | — |
| 11 | Accessibility Audit + ARIA Live Regions | ⏳ TODO | — |
| 12 | Performance: CSS/JS Code Splitting | ⏳ TODO | — |
| 13 | Offline / Cached Data Fallback UI | ⏳ TODO | — |
| 14 | Settings Panel + User Preferences Persistence | ⏳ TODO | — |
| 15 | Match Replay Sharing (URL-encoded seed) | ⏳ TODO | — |
| 16 | Tactical Tracker Cleanup (remove branding) | ✅ DONE | — |
| 17 | Dixon-Coles Model Upgrade | ⏳ TODO | — |
| 18 | 3D Three.js Stadium View | ⏳ TODO | — |
| 19 | Progressive Web App (PWA) Manifest + SW | ⏳ TODO | — |
| 20 | Data Fetch Pipeline Improvements | ⏳ TODO | — |
| 21–40 | (Remaining premium features TBD) | ⏳ TODO | — |

### v1.2.0 — UI De-clutter & Theme Consolidation (M4)
Shipped as four focused commits (`3c4da46`, `428face`, `9def9fc`, `f272d65`):

1. **Contextual competition control** — one compact dropdown replaces the
   permanently-visible 13-tab bar; hidden on Home, shown on competition-scoped
   views.
2. **Single focused Home** — removed the duplicated brand lockup and the four
   implementation status metrics; one hero, one primary CTA, one secondary CTA,
   four curated Featured Competitions.
3. **Shell fix** — `switchView()` renders exactly one top-level panel (Home and
   the tournament panel previously rendered together on load).
4. **One global footer** — removed two duplicated footers with fake BUILD/STATUS
   telemetry; one compact footer with Methodology + Archive links.
5. **One data-mode indicator** — collapsed repeated provenance badges.
6. **Restrained motion** — removed the `!important` hover-stunt system.
7. **Unified themes** — removed the UCL whole-app background override and
   per-competition neon glow; competition colour is an accent only.

See `CHANGELOG.md` [v1.2.0] for details. `npm run lint`, `npm test`,
`npm run build` and `npx playwright test` (16/16) all pass.

---

## 📂 Key Files & Architecture

```
arena-core/
├── index.html          # Main SPA shell (~1540 lines)
├── app.js              # Core IIFE: simulation engine + renderers (~10,271 lines)
├── style.css           # Design system + components (~16,400 lines / 413KB)
├── js/
│   ├── state.js        # [NEW M1] Central AppState reactive store
│   ├── router.js       # [NEW M1] ArenaRouter - HTML5 History + hash fallback
│   ├── motion-fx.js    # Anime.js motion engine (goal banners, transitions)
│   └── audio-fx.js     # Web Audio procedural synthesizer (no MP3 assets)
├── data/
│   ├── real-tournaments.json   # Bundled competition snapshots
│   └── real-tournaments.js     # Same, as JS module
├── scripts/
│   └── fetch-football-data.js  # Node.js data refresh utility (optional)
├── vendor/
│   └── confetti.browser.js     # Canvas confetti (champion celebrations)
├── staticwebapp.config.json    # [NEW M1] Azure SPA route fallback config
├── docs/
│   ├── ARENA_CORE_AUDIT.md     # M0 forensic audit
│   └── milestones/
│       └── M1_APP_STATE_AND_ROUTING.md
└── eslint.config.js            # ESLint flat config (vendor/** ignored)
```

---

## 🔧 Tech Stack

| Layer | Tech |
|-------|------|
| Core | Vanilla HTML5 / ES6+ JS (Vite bundler) |
| Styling | Vanilla CSS (BEM + design tokens) |
| Motion | Anime.js 4.5.0 |
| Audio | Web Audio API (procedural — no MP3s) |
| Testing | Playwright + custom Node validation scripts |
| Linting | ESLint 10 (flat config) |
| CI/CD | GitHub Actions → Azure Static Web Apps |
| Data | Static bundled snapshots |

---

## ✅ What Works (Do NOT Break)

1. **Poisson simulation engine** — 10 competitions (WC, UCL, PL, La Liga, Serie A, Bundesliga, Ligue 1, Liga Portugal, Eredivisie, Süper Lig, Scottish Prem)
2. **Hero video backgrounds** — 13 competition-specific 1080p video loops
3. **Goal celebration banners + confetti cannon** — Anime.js + canvas-confetti
4. **Web Audio synthesizer** — Procedural kick/whistle/horn (no MP3 deps)
5. **Real standings + top scorers** — Loaded from `data/real-tournaments.json`
6. **UCL qualification gateway** — 9-league feeder system
7. **Liga Portugal highlight reel** — Embedded YouTube iframe
8. **AppState store + ArenaRouter** — Milestone 1 (just shipped)
9. **Lint: 0 errors** — `npm run lint` passes clean
10. **Tests: PASS** — `npm run test` passes

---

## ⚠️ Known Issues (Audit Findings - To Fix in Future Milestones)

1. **4 competing match modals** — `#match-detail-modal`, `#detailed-stats-modal`, `#holo-broadcast-modal`, `#tactical-tracker-modal` all exist simultaneously → consolidate to 1 (M3)
2. **Non-reproducible simulation** — Uses `Math.random()` → migrate to seeded PRNG (M5)
3. **Tactical Tracker branding** — Rename/rebrand (M16)
4. **Missing ARIA live regions** — No `aria-live` on match updates (M11)
5. **Monolith** — `app.js` 459KB, `style.css` 413KB loaded synchronously (M12)
6. **DOM duplicate footer** — `stadium-broadcast-footer` appears twice in `index.html`

---

## 🚀 Git & Deploy

```bash
# Current state (clean, 1 commit ahead of origin):
git log --oneline -5
# ed6adc0 feat(m1): add AppState store, ArenaRouter, SPA routing config, and URL-synced navigation
# cd53c6e docs: complete milestone 0 forensic audit and standardize ARENA CORE brand logo
# 529917d docs: update README for v1.0.0 final release
# c35c24e feat: merge feature/interactive-motion-and-audio-fx into main
# a803280 feat: merge feature/hero-video-ui-enhancements into main

# Push to deploy:
git push origin main
```

---

## 🎯 Next Session — Pick Up Here

**Resume at: Milestone 2 — Data Provenance Separation**

### M2 Goal
Clearly distinguish between **REAL** (historical API data) and **SIMULATED** (hypothetical Poisson output) content throughout the UI so users are never misled about data source.

### M2 Specific Tasks
1. Add `data-provenance="real"` / `data-provenance="simulated"` attributes to all result cells and score displays in `app.js` renderer functions.
2. Replace misleading badge text (`"Status: 100% Operational"`, `"Build: 2024.11.STRIKER"`, `"Real-Time Radar"`) with accurate labels (`REAL HISTORICAL`, `SIMULATED HYPOTHETICAL`).
3. Add a visual badge component in `style.css` — pill with `🟢 ARCHIVE DATA` (green) vs `🔵 SIMULATION` (blue) styling.
4. Ensure simulation results panels always show the seeded simulation ID badge.
5. Document in `docs/milestones/M2_DATA_PROVENANCE.md`.

---

## 📋 NPM Commands

```bash
npm run dev      # Start local Vite dev server (http://localhost:5173)
npm run build    # Production bundle → dist/
npm run lint     # ESLint (must exit 0)
npm run test     # Custom Node validation suite (must exit 0)
```

---

## 🌐 Deployment

- **Trigger:** Push to `main` → GitHub Actions → Azure Static Web Apps
- **Live URL:** https://lemon-ocean-06aede400.5.azurestaticapps.net/
- **SPA Fallback:** `staticwebapp.config.json` rewrites all routes → `index.html`
