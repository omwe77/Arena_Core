1|# ARENA CORE — Forensic Architecture & Product Audit (Milestone 0)
2|
3|> **Document Version:** 1.0.0  
4|> **Date:** September 17, 2026  
5|> **Audited Repository:** `arena-core` (`omwe77/Arena_Core`)  
6|> **Audited Target:** [https://lemon-ocean-06aede400.5.azurestaticapps.net/](https://lemon-ocean-06aede400.5.azurestaticapps.net/)  
7|> **Status:** Baselined & Verified
8|
9|---
10|
11|## 1. Executive Summary
12|
13|ARENA_CORE is a hybrid web application uniting archived football competition statistics (bundled as static local snapshots) with an in-browser mathematical Poisson tournament simulation engine.
14|
15|While feature-dense with rich animations, video highlights, and multi-tournament formats (World Cup 48, UEFA Champions League, Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Liga Portugal, Eredivisie, Süper Lig, Scottish Premiership), the application has evolved organically into a monolithic single-file architecture (`app.js` ~9,800 lines; `style.css` ~16,400 lines; `index.html` ~1,540 lines). Multiple competing modals, pseudo-3D layers, synthetic player algorithms branded with external trademarked technology names (e.g., KINEXON), and lack of true URL routing prevent it from functioning as a cohesive, production-grade football software platform.
16|
17|This audit establishes the comprehensive technical baseline required before embarking on subsequent architectural milestones.
18|
19|---
20|
21|## 2. Technical Stack & Repository Inventory
22|
23|| Layer | Technology | Details |
24||---|---|---|
25|| **Core Frontend** | Vanilla HTML5 / ES6+ JavaScript | Bundled with Vite (`vite@8.3.0`), standard ESM |
26|| **Styling** | Vanilla CSS (BEM & utility tokens) | `style.css` (~412KB, 16,400+ lines) |
27|| **Motion & FX** | Anime.js (`animejs@4.5.0`), Canvas Confetti | `js/motion-fx.js` |
28|| **Audio Engine** | Web Audio API Procedural Synth | `js/audio-fx.js` (no external audio assets needed) |
29|| **Testing** | Node syntax checks & custom validation scripts | Playwright configured (`@playwright/test@1.63.0`) |
30|| **Linting** | ESLint 10 (`@eslint/js`, `globals`) | Configured in `eslint.config.js` |
31|| **CI/CD** | GitHub Actions & Azure Static Web Apps | `.github/workflows/azure-static-web-apps-*.yml` |
32|| **Data Fetch** | Static bundled snapshots | Public football statistics |
33|
34|---
35|
36|## 3. Subsystem Breakdown
37|
38|### 3.1 Data Layer & Ingestion
39|- **Offline Cache**: `data/real-tournaments.json` and `data/real-tournaments.js` (~350KB) store pre-fetched fixtures, standings, top scorers, and team logos (from `images.fotmob.com`).
40|- **Fetch Script**: `scripts/fetch-football-data.js` reads `process.env.API_FOOTBALL_KEY` and rate-limits to 10 req/min for free tier safety.
41|- **Problem**: In-browser code has no clear schema enforcement or graceful offline fallback UI when API data fails or is absent.
42|
43|### 3.2 Simulation Engine (Poisson Model)
44|- **Engine Core**: Located inside `app.js`. Uses attack/defense ratings computed from historical FIFA/UEFA performance, applied through a Poisson distribution algorithm with home advantage adjustment.
45|- **Deterministic Seeding**: Currently uses `Math.random()`; simulations are **not** reproducible via seeds.
46|- **Clock & Progression**: Simulation loop mixes UI animation intervals with game state progression, creating race conditions when users toggle pause/skip/fast-sim rapidly.
47|
48|### 3.3 Routing & Application State
49|- **Current Pattern**: Zero client-side routing. Navigation is driven by DOM manipulation (`section.hidden = true/false` and `.classList.add('active')`).
50|- **Deep Linking**: Impossible on current deployed build. Users cannot share a direct link to `/competition/ucl`, `/match/:id`, or `/simulation/:id`.
51|- **State Store**: Centralized global mutable object `tournamentState` stored inside an IIFE closure with ad-hoc `localStorage` sync.
52|
53|### 3.4 Modals & Match Inspection Architecture
54|- Currently, **4 separate match inspection systems** coexist in the DOM:
55|  1. `#match-detail-modal`: Legacy basic modal with minute-by-minute text events.
56|  2. `#detailed-stats-modal`: 7-tab Sofascore-style popup with live 2D pitch, momentum chart, lineups, and commentary.
57|  3. `#holo-broadcast-modal`: Pseudo-3D stadium broadcast studio with layered CSS perspective pitch.
58|  4. `#tactical-tracker-modal`: ARENA Tactical Radar modal with 22 synthesized nodes.
59|- **Problem**: Multiple competing modals create memory leaks, audio desync, and conflicting user expectations.
60|
61|---
62|
63|## 4. Forensic Issues Matrix
64|
65|### 4.1 What Works Well ✅
66|1. **Rich Simulation Depth**: High-fidelity Poisson probability modeling across 10 global tournaments.
67|2. **Visual Excitement**: Custom interactive ARENA_CORE striker pitch track, dynamic video background player with 1080p highlights, responsive goal celebrations, and confetti cannons.
68|3. **Audio Synthesis**: High-performance Web Audio synthesizer generating authentic stadium whistles, kick acoustics, and goal horns without external MP3 dependencies.
69|4. **Data Coverage**: Real standings, top scorers, and club crests for Europe's top leagues and international cups.
70|5. **Zero Lint Errors**: Modernized ESLint flat config passing cleanly.
71|
72|### 4.2 What Is Broken / Problematic ⚠️
73|1. **Broken Character Encodings**: `âš½` and `Â©` were appearing due to UTF-8/Windows-1252 mismatch (now corrected to clean SVG vector brand emblem).
74|2. **Lack of URL Routing**: Refreshing deep views resets to home; back/forward browser buttons do not navigate views.
75|3. **Non-Reproducible Simulations**: Lack of seedable PRNG (pseudo-random number generator) prevents scientific verification or match replay sharing.
76|4. **Competing Modals**: 4 disparate popup views for the same match entity.
77|5. **DOM Duplication**: Double footer elements (`stadium-broadcast-footer`) present inside `index.html`.
78|
79|### 4.3 Fake / Unsupported Claims & Misleading Terminology ❌
80|- **"ARENA Tactical Radar"**: Uses synthesized 2D trigonometry for tactical visualization.
81|- **"Real-Time Radar" / "Official Match Arena"**: Used for purely simulated match matches.
82|- **"Real Scorers" vs "Simulation"**: Confusing UI badges rather than clean data provenance tags (`REAL HISTORICAL` vs `SIMULATED HYPOTHETICAL`).
83|- **"Status: 100% Operational" / "Build: 2024.11.STRIKER"**: Arbitrary decorative tags that convey no real diagnostic meaning.
84|
85|### 4.4 Accessibility & Performance Risks 🔍
86|- **Accessibility**: Missing `aria-live` announcements during live match updates, several icon-only buttons lack `aria-label`, focus trapping in modals is incomplete.
87|- **Performance**: Giant 412KB CSS and 458KB JS monolith loaded synchronously on first paint. 3D perspective layers consume GPU cycles even when modals are hidden.
88|
89|---
90|
91|## 5. Architectural Target Blueprint
92|
93|```
94|                     ┌───────────────────────────┐
95|                     │   Bundled static snapshots │
96|                     └─────────────┬─────────────┘
97|                                   │ (scripts/fetch-football-data.js)
98|                     ┌─────────────▼─────────────┐
99|                     │ Normalized Local Cache    │
100|                     │ (data/real-tournaments)   │