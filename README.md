# ARENA_CORE — Deterministic Football Simulation Engine & Match Center

> An interactive football simulation platform and analytics dashboard. Features archived historical competition datasets, a seeded Poisson-based tournament simulation engine, interactive 2D tactical pitch visualizations, and custom 48-team World Cup bracket generation—built with vanilla web standards and zero framework overhead.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Azure%20Static%20Web%20Apps-2ecc71?style=for-the-badge&logo=microsoftazure)](https://lemon-ocean-06aede400.5.azurestaticapps.net)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions)](https://github.com/omwe77/Arena_Core/actions)
[![Tests](https://img.shields.io/badge/Tests-Playwright%20%2B%20Node-4EA140?style=for-the-badge)](https://github.com/omwe77/Arena_Core/tree/main/e2e)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](https://github.com/omwe77/Arena_Core/blob/main/LICENSE)

---

## 1. Project Overview

ARENA_CORE is a high-performance, single-page application that pairs **bundled historical competition snapshots** with a **mathematical match simulation engine**. Spanning 13 major international, continental, and domestic football competitions, the platform delivers:

- **Mathematical Simulation:** Full tournament simulations powered by a Poisson goal-distribution model and team attack/defense ratings.
- **Seeded Determinism:** Reproducible tournament execution via Mulberry32 Pseudo-Random Number Generation (PRNG).
- **Match Center:** Dynamic 2D pitch view with tactical formations, minute-by-minute simulated timelines, and scrubber controls.
- **Custom World Cup Draw:** Interactive 48-team confederation selector and randomized bracket generator.
- **Historical Archives:** Browsable league tables, top scorers, and tournament milestones from bundled historical seasons.

**Live Production Deployment:** [https://lemon-ocean-06aede400.5.azurestaticapps.net](https://lemon-ocean-06aede400.5.azurestaticapps.net)

---

## 2. System Architecture

Built entirely on native web standards to maximize runtime performance and eliminate framework overhead:

```
                            ┌────────────────────────┐
                            │       index.html       │
                            │   Single-Page Layout   │
                            └───────────┬────────────┘
                                        │
           ┌────────────────────────────┼───────────────────────────┐
           │                            │                           │
┌──────────▼──────────┐      ┌──────────▼──────────┐     ┌──────────▼──────────┐
│      app.js         │      │      style.css      │     │    js/random.js     │
│ State Orchestrator  │      │ Design Token System │     │ Seeded Mulberry32   │
│ DOM & Event Router  │      │ GPU-Accelerated CSS │     │ PRNG for Sim State  │
└──────────┬──────────┘      └─────────────────────┘     └──────────┬──────────┘
           │                                                        │
           ├────────────────────────────┬───────────────────────────┘
           │                            │
┌──────────▼──────────┐      ┌──────────▼──────────┐     ┌─────────────────────┐
│   js/motion-fx.js   │      │   js/audio-fx.js    │     │ data/real-tournaments│
│ Anime.js Transitions│      │ WebAudio Synthesizer│     │ Archived Competition│
│ Stagger Animations  │      │ Procedural FX       │     │ Historical Datasets │
└─────────────────────┘      └─────────────────────┘     └─────────────────────┘
```

### Module Responsibilities

| Module | Location | Purpose |
|---|---|---|
| **Core Engine** | `app.js` | Central state management, simulation execution, tournament bracket progression, and DOM rendering. |
| **Randomness** | `js/random.js` | Mulberry32 32-bit seeded PRNG ensuring deterministic, replayable match sequences. |
| **Motion** | `js/motion-fx.js` | Anime.js timeline orchestrations for card entrances and score updates. |
| **Synthesized Audio** | `js/audio-fx.js` | Pure WebAudio API sound synthesis (stadium cheers, whistle, button clicks)—zero audio file downloads. |
| **Data Repository** | `data/real-tournaments.js` | Curated static historical snapshots across all 13 supported tournaments. |
| **Hero Media** | `data/hero-videos.js` | On-demand video backdrop configuration per competition. |

---

## 3. Mathematical Simulation Engine

Match outcomes are generated mathematically using a **Poisson goal-distribution model** parameterized by relative team ratings:

### Expected Goals ($\lambda$) Calculation

For any match between Home Team $H$ and Away Team $A$:

$$\lambda_{\text{home}} = \text{base\_attack}_H \times \text{defense\_factor}_A \times \text{home\_advantage}$$

$$\lambda_{\text{away}} = \text{base\_attack}_A \times \text{defense\_factor}_H$$

Where:
- $\text{base\_attack}$ represents normalized historical goal production per 90 minutes.
- $\text{defense\_factor}$ scales inversely with opponent defensive strength.
- $\text{home\_advantage}$ is a calibration constant (typically 1.15 to 1.25) applied for domestic league fixtures.

### Goal Sampling

Match scorelines are independently sampled from the discrete Poisson probability mass function:

$$P(X = k) = \frac{\lambda^k e^{-\lambda}}{k!}$$

### Knockout Rules & Seeded PRNG

- **Group Stage:** Complete round-robin execution with points (3/1/0), goal difference, and goals-scored tiebreakers.
- **Knockout Stage:** Single-elimination tree. Ties at 90 minutes trigger extra time ($\lambda \times 0.33$) followed by penalty shootout simulations.
- **Reproducibility:** Simulations initialize from a 32-bit seed using Mulberry32. Providing the identical seed guarantees identical tournament brackets and match scores.

---

## 4. Data Provenance & Integrity

To maintain absolute credibility, the application enforces clear data classification throughout the user interface:

| Label | Definition | Scope |
|---|---|---|
| `ARCHIVE DATA` | Verified historical records | Real final standings and top scorers bundled in `data/real-tournaments.js` (past seasons). |
| `SIMULATION` | Hypothetical model output | All live simulation results generated on-the-fly by the Poisson engine. |

**What ARENA_CORE Does NOT Claim:**
- It is **not** a predictive betting or forecasting model.
- It does **not** consume live real-time stadium tracking telemetry.
- All real-world tournament rosters and standings represent packaged historical benchmarks.

---

## 5. Supported Competitions

1. **International:** FIFA World Cup (48 teams), UEFA EURO (24 teams), Copa América (16 teams).
2. **Continental:** UEFA Champions League (36-team Swiss League phase).
3. **Domestic Leagues:** Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Liga Portugal, Eredivisie, Süper Lig, Scottish Premiership.

---

## 6. Quick Start & Local Development

### Prerequisites
- Node.js 18+ (for running validation tests and Playwright E2E).
- Modern web browser.

### Running Locally

```bash
# Clone the repository
git clone https://github.com/omwe77/Arena_Core.git
cd Arena_Core

# Serve using any static web server (no build step needed for dev)
npx serve .
# or:
python -m http.server 8080
```

Navigate to `http://localhost:8080`.

---

## 7. Testing & Quality Assurance

ARENA_CORE incorporates an extensive testing pipeline:

```bash
# Install dependencies
npm install

# Run comprehensive engine validation
npm test

# Run Playwright End-to-End browser tests
npx playwright test

# Run ESLint validation
npm run lint
```

### Test Scope
- **Engine Integrity:** Validates CSS token balance, DOM modal hierarchy, tournament data completeness, and formation player counts (22 on pitch).
- **Runtime Sanity:** Simulates headless startup to guarantee zero uncaught browser console errors.
- **Custom Draw Validation:** Validates exact 48-nation allocation, confederation constraints, and bracket progression.
- **E2E Automation:** Headless browser runs verifying navigation, simulation triggers, standings recalculation, and modal interactions.

---

## 8. Deployment & CI/CD Pipeline

- **Platform:** Microsoft Azure Static Web Apps.
- **Pipeline:** GitHub Actions (`.github/workflows/azure-static-web-apps-*.yml`).
- **Policy:** Deployment triggers on pushes to `main` only after Playwright E2E tests pass cleanly.

---

## 9. Known Limitations

- **Dataset Snapshots:** Tournament data represents historical baselines rather than a live-polling API feed.
- **State Persistence:** Custom draws and simulation results persist within browser `localStorage`; no cloud account sync.
- **Statistical Model:** Poisson sampling assumes independence between goals, serving as a clean computational simulation rather than a commercial betting predictor.

---

## 10. License

ISC License © [Om Dangol](https://github.com/omwe77) & Contributors.
