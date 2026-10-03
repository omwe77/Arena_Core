# ARENA CORE — Forensic Architecture & Product Audit (Milestone 0)

> **Document Version:** 1.0.0  
> **Date:** September 17, 2026  
> **Audited Repository:** `arena-core` (`omwe77/Arena_Core`)  
> **Audited Target:** [https://lemon-ocean-06aede400.5.azurestaticapps.net/](https://lemon-ocean-06aede400.5.azurestaticapps.net/)  
> **Status:** Baselined & Verified

---

## 1. Executive Summary

ARENA CORE is a hybrid web application uniting real-world football competition statistics (ingested via API-Football and FotMob image assets) with an in-browser mathematical Poisson tournament simulation engine.

While feature-dense with rich animations, video highlights, and multi-tournament formats (World Cup 48, UEFA Champions League, Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Liga Portugal, Eredivisie, Süper Lig, Scottish Premiership), the application has evolved organically into a monolithic single-file architecture (`app.js` ~9,800 lines; `style.css` ~16,400 lines; `index.html` ~1,540 lines). Multiple competing modals, pseudo-3D layers, synthetic player algorithms branded with external trademarked technology names (e.g., KINEXON), and lack of true URL routing prevent it from functioning as a cohesive, production-grade football software platform.

This audit establishes the comprehensive technical baseline required before embarking on subsequent architectural milestones.

---

## 2. Technical Stack & Repository Inventory

| Layer | Technology | Details |
|---|---|---|
| **Core Frontend** | Vanilla HTML5 / ES6+ JavaScript | Bundled with Vite (`vite@8.3.0`), standard ESM |
| **Styling** | Vanilla CSS (BEM & utility tokens) | `style.css` (~412KB, 16,400+ lines) |
| **Motion & FX** | Anime.js (`animejs@4.5.0`), Canvas Confetti | `js/motion-fx.js` |
| **Audio Engine** | Web Audio API Procedural Synth | `js/audio-fx.js` (no external audio assets needed) |
| **Testing** | Node syntax checks & custom validation scripts | Playwright configured (`@playwright/test@1.63.0`) |
| **Linting** | ESLint 10 (`@eslint/js`, `globals`) | Configured in `eslint.config.js` |
| **CI/CD** | GitHub Actions & Azure Static Web Apps | `.github/workflows/azure-static-web-apps-*.yml` |
| **Data Fetch** | Node fetch scripts (`scripts/fetch-football-data.js`) | API-Football (`v3.football.api-sports.io`) |

---

## 3. Subsystem Breakdown

### 3.1 Data Layer & Ingestion
- **Offline Cache**: `data/real-tournaments.json` and `data/real-tournaments.js` (~350KB) store pre-fetched fixtures, standings, top scorers, and team logos (from `images.fotmob.com`).
- **Fetch Script**: `scripts/fetch-football-data.js` reads `process.env.API_FOOTBALL_KEY` and rate-limits to 10 req/min for free tier safety.
- **Problem**: In-browser code has no clear schema enforcement or graceful offline fallback UI when API data fails or is absent.

### 3.2 Simulation Engine (Poisson Model)
- **Engine Core**: Located inside `app.js`. Uses attack/defense ratings computed from historical FIFA/UEFA performance, applied through a Poisson distribution algorithm with home advantage adjustment.
- **Deterministic Seeding**: Currently uses `Math.random()`; simulations are **not** reproducible via seeds.
- **Clock & Progression**: Simulation loop mixes UI animation intervals with game state progression, creating race conditions when users toggle pause/skip/fast-sim rapidly.

### 3.3 Routing & Application State
- **Current Pattern**: Zero client-side routing. Navigation is driven by DOM manipulation (`section.hidden = true/false` and `.classList.add('active')`).
- **Deep Linking**: Impossible on current deployed build. Users cannot share a direct link to `/competition/ucl`, `/match/:id`, or `/simulation/:id`.
- **State Store**: Centralized global mutable object `tournamentState` stored inside an IIFE closure with ad-hoc `localStorage` sync.

### 3.4 Modals & Match Inspection Architecture
- Currently, **4 separate match inspection systems** coexist in the DOM:
  1. `#match-detail-modal`: Legacy basic modal with minute-by-minute text events.
  2. `#detailed-stats-modal`: 7-tab Sofascore-style popup with live 2D pitch, momentum chart, lineups, and commentary.
  3. `#holo-broadcast-modal`: Pseudo-3D stadium broadcast studio with layered CSS perspective pitch.
  4. `#tactical-tracker-modal`: "KINEXON" Tactical Radar modal with 22 synthesized nodes.
- **Problem**: Multiple competing modals create memory leaks, audio desync, and conflicting user expectations.

---

## 4. Forensic Issues Matrix

### 4.1 What Works Well ✅
1. **Rich Simulation Depth**: High-fidelity Poisson probability modeling across 10 global tournaments.
2. **Visual Excitement**: Custom interactive ARENA_CORE striker pitch track, dynamic video background player with 1080p highlights, responsive goal celebrations, and confetti cannons.
3. **Audio Synthesis**: High-performance Web Audio synthesizer generating authentic stadium whistles, kick acoustics, and goal horns without external MP3 dependencies.
4. **Data Coverage**: Real standings, top scorers, and club crests for Europe's top leagues and international cups.
5. **Zero Lint Errors**: Modernized ESLint flat config passing cleanly.

### 4.2 What Is Broken / Problematic ⚠️
1. **Broken Character Encodings**: `âš½` and `Â©` were appearing due to UTF-8/Windows-1252 mismatch (now corrected to clean SVG vector brand emblem).
2. **Lack of URL Routing**: Refreshing deep views resets to home; back/forward browser buttons do not navigate views.
3. **Non-Reproducible Simulations**: Lack of seedable PRNG (pseudo-random number generator) prevents scientific verification or match replay sharing.
4. **Competing Modals**: 4 disparate popup views for the same match entity.
5. **DOM Duplication**: Double footer elements (`stadium-broadcast-footer`) present inside `index.html`.

### 4.3 Fake / Unsupported Claims & Misleading Terminology ❌
- **"KINEXON Tactical Radar"**: Uses synthesized 2D trigonometry; claims trademarked KINEXON technology without official partnership.
- **"Real-Time Radar" / "Official Match Arena"**: Used for purely simulated match matches.
- **"Real Scorers" vs "Simulation"**: Confusing UI badges rather than clean data provenance tags (`REAL HISTORICAL` vs `SIMULATED HYPOTHETICAL`).
- **"Status: 100% Operational" / "Build: 2024.11.STRIKER"**: Arbitrary decorative tags that convey no real diagnostic meaning.

### 4.4 Accessibility & Performance Risks 🔍
- **Accessibility**: Missing `aria-live` announcements during live match updates, several icon-only buttons lack `aria-label`, focus trapping in modals is incomplete.
- **Performance**: Giant 412KB CSS and 458KB JS monolith loaded synchronously on first paint. 3D perspective layers consume GPU cycles even when modals are hidden.

---

## 5. Architectural Target Blueprint

```
                     ┌───────────────────────────┐
                     │   API-Football / FotMob   │
                     └─────────────┬─────────────┘
                                   │ (scripts/fetch-football-data.js)
                     ┌─────────────▼─────────────┐
                     │ Normalized Local Cache    │
                     │ (data/real-tournaments)   │
                     └─────────────┬─────────────┘
                                   │
                     ┌─────────────▼─────────────┐
                     │   Single App Store &      │
                     │   URL Client Router       │
                     └─────────────┬─────────────┘
                                   │
                     ┌─────────────▼─────────────┐
                     │ Seeded Simulation Engine  │
                     │ (Poisson + Event Stream)  │
                     └─────────────┬─────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          ▼                        ▼                        ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Unified Match   │     │  Interactive 2D  │     │   AudioManager   │
│   Center UI      │     │  Tactical Pitch  │     │   (WebAudio)     │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

## 6. Milestone 0 Sign-Off

- **Baseline Established**: Full repository scanned and documented.
- **Immediate Fixes Included**: Corrected top brand header and footers to unified `ARENA CORE` identity with crisp SVG soccer ball emblem, removing corrupt `âš½` artifacts.
- **Next Phase**: **Milestone 1** (Application State + Routing Foundation).
