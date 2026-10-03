# ARENA_CORE — Global Football Platform & Tournament Simulator

> A premium football analytics and multi-tournament simulation platform. Browse archived competition data, simulate hypothetical tournament outcomes with a Poisson-based model, explore match centers with 2D pitch visualizations, and interact with a World Cup custom draw — all in a single-page application.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Azure%20Static%20Web%20Apps-2ecc71?style=for-the-badge&logo=microsoftazure)](https://lemon-ocean-06aede400.5.azurestaticapps.net)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions)](https://github.com/omwe77/Arena_Core/actions)
[![Tests](https://img.shields.io/badge/Tests-Playwright%20%2B%20Node-4EA140?style=for-the-badge)](https://github.com/omwe77/Arena_Core/tree/main/e2e)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](https://github.com/omwe77/Arena_Core/blob/main/LICENSE)

---

## What is ARENA_CORE?

ARENA_CORE is a single-page football platform that combines **archived historical competition data** with a **hypothetical tournament simulation engine**. It covers 13 major football competitions — from the FIFA World Cup to domestic leagues — and lets users:

- Browse historical standings and top scorers
- Simulate entire tournaments using a Poisson goal-distribution model
- Draw custom World Cup brackets with 48 teams
- Explore match centers with 2D pitch visualizations and minute-by-minute timelines
- Switch between competitions with themed accent colors

**Live demo:** [https://lemon-ocean-06aede400.5.azurestaticapps.net](https://lemon-ocean-06aede400.5.azurestaticapps.net)

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/omwe77/Arena_Core.git

# Navigate to the project
cd Arena_Core

# Run locally (any static server works)
python3 -m http.server 8080
# Open http://localhost:8080
```

No build step required for development. The app is vanilla HTML/CSS/JS.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Markup | Semantic HTML5 |
| Styling | Vanilla CSS3 with custom design-token system (CSS custom properties) |
| Scripting | Vanilla JavaScript (ES6+), zero framework dependencies |
| Motion | Anime.js (vendored), CSS transitions |
| Audio | Procedural WebAudio API synthesizer (zero audio assets) |
| Testing | Playwright E2E, Node.js validation scripts |
| CI/CD | GitHub Actions → Azure Static Web Apps |
| Build | Vite (for production bundling) |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    index.html                        │
│  ┌─────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │  Home   │  │   Sim    │  │  Standings/Archive│  │
│  │  View   │  │  View    │  │      Views        │  │
│  └────┬────┘  └────┬─────┘  └────────┬──────────┘  │
│       │            │                  │              │
│  ┌────┴────────────┴──────────────────┴──────────┐  │
│  │              app.js (Core Engine)              │  │
│  │  ┌─────────┐ ┌──────────┐ ┌────────────────┐  │  │
│  │  │  State  │ │  Router  │ │  Tournament    │  │  │
│  │  │  Store  │ │          │ │  Config        │  │  │
│  │  └─────────┘ └──────────┘ └────────────────┘  │  │
│  │  ┌─────────┐ ┌──────────┐ ┌────────────────┐  │  │
│  │  │  Match  │ │  Custom  │ │  Simulation    │  │  │
│  │  │  Center │ │  Draw    │ │  Engine        │  │  │
│  │  └─────────┘ └──────────┘ └────────────────┘  │  │
│  └────────────────────────────────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  motion-fx   │  │  audio-fx    │  │  random    │  │
│  │  (Anime.js)  │  │  (WebAudio)  │  │  (seeded)  │  │
│  └──────────────┘  └──────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Module Responsibilities

| Module | File | Responsibility |
|--------|------|----------------|
| Core Engine | `app.js` | State management, routing, simulation, DOM rendering |
| Motion | `js/motion-fx.js` | Anime.js orchestration, entrance animations, stagger effects |
| Audio | `js/audio-fx.js` | Procedural WebAudio SFX (goal cheer, kick, fanfare, UI click) |
| Randomness | `js/random.js` | Seeded PRNG for deterministic simulation |
| Data | `data/real-tournaments.js` | Archived competition snapshots (teams, standings, top scorers) |
| Config | `data/hero-videos.js` | Hero video IDs and per-competition config |

---

## Simulation Methodology

The simulation engine uses a **Poisson goal-distribution model** to generate hypothetical match outcomes.

### Core Model

For each match, the expected goals (lambda) for each team are calculated as:

```
lambda_home = base_attack_home * defense_factor_away * home_advantage
lambda_away = base_attack_away * defense_factor_home
```

Where:
- **base_attack** is derived from the team's historical goal-scoring rate
- **defense_factor** adjusts for the opponent's defensive strength
- **home_advantage** is a multiplier applied to the home team (typically 1.1–1.3)

### Goal Sampling

Goals are sampled from a Poisson distribution:

```
P(X = k) = (lambda^k * e^(-lambda)) / k!
```

Each team's goals are sampled independently. The match result is the pair of sampled goal counts.

### Knockout Progression

- **Group Stage**: Round-robin within groups. Top teams advance based on points, then goal difference, then goals scored.
- **Knockout Rounds**: Single-elimination. If tied after 90 minutes, extra time (30 min) is simulated. If still tied, a penalty shootout is simulated.
- **Seeded PRNG**: ARENA_CORE uses a seeded Mulberry32 PRNG for reproducible simulations. Each tournament session generates a fresh seed, while reusing the same seed reproduces the same random sequence.

### What the Model Does NOT Claim

- It does **not** predict real football outcomes
- It does **not** account for injuries, form, tactics, or weather
- It is a **mathematical simulation** for educational and entertainment purposes

---

## Data Provenance

### Archived Data

The `data/real-tournaments.js` file contains **historical snapshots** of competition data:

- **Source**: Publicly available football statistics (league tables, top scorers)
- **Season**: Varies by competition (typically 2022–2024)
- **What it includes**: Team rosters, final standings, top scorers
- **What it does NOT include**: Live data, real-time updates, play-by-play events

### Simulated Data

All simulation results are **hypothetical** and generated by the Poisson model. They are clearly labeled as "SIMULATION" throughout the UI.

### Data Labels

The application uses a strict labeling system:

| Label | Meaning |
|-------|---------|
| `ARCHIVE DATA` | Historical, bundled competition data |
| `SIMULATION` | Hypothetical, model-generated result |
| `HISTORICAL` | Past season data |

---

## Features

### 13 Major Football Competitions

- **International**: FIFA World Cup 2026, UEFA EURO 2024, Copa América 2024
- **Continental**: UEFA Champions League (36-team Swiss League Phase)
- **Domestic Leagues**: Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Liga Portugal, Eredivisie, Süper Lig, Scottish Premiership

### World Cup Custom Draw

- Interactive 48-team selection across 6 confederations
- Preset confederation allocations
- Randomize, clear, and validation (exactly 48 teams)
- Keyboard accessible

### Match Center

- 2D pitch visualization with player formations
- Minute-by-minute timeline with goal/card events
- Stats panels (possession, shots, passes)
- Lineups with player names
- Scrubber for replaying simulation

### Standings & Archive

- Live simulation standings with zone badges (UCL, UEL, Relegation)
- Historical standings from archived data
- Top scorers leaderboard
- Archive browser for all competitions

### Responsive Design

- Tested from 375px mobile to 1280px+ desktop
- Touch-friendly controls (44px minimum targets)
- Readable tables on mobile
- Adaptive grid layouts

### Accessibility

- Accessibility-focused design with keyboard navigation, focus management, and reduced-motion support
- Keyboard navigation throughout
- Focus-visible indicators
- ARIA labels and roles
- Reduced motion support
- Skip-to-content link

---

## Testing

### Automated Tests

```bash
# Run all tests
npm test

# Run Playwright E2E tests
npx playwright test

# Run lint
npm run lint
```

### Test Coverage

| Test Type | What it covers |
|-----------|---------------|
| Engine Validation | CSS braces, HTML structure, tournament data, formations |
| Runtime Execution | DOMContentLoaded, startup cycle, console errors |
| Custom Draw | Modal open/close, team selection, validation |
| E2E (Playwright) | Home, competition selection, simulation, custom draw, standings, archive, match modal |

### CI/CD

Every push to `main` triggers:
1. **Playwright Tests** — E2E test suite
2. **Build** — Vite production build
3. **Deploy** — Azure Static Web Apps (only if tests pass)

---

## Performance

- **Zero framework overhead** — vanilla JS with no runtime dependencies
- **Vendored libraries** — Anime.js and canvas-confetti are bundled locally
- **On-demand media** — Hero videos load only when a competition is selected
- **Content visibility** — Off-screen panels use `content-visibility: auto`
- **Composited animations** — Animations use `transform` and `opacity` for GPU compositing
- **Procedural audio** — No audio file downloads

---

## Project Structure

```
Arena_Core/
├── index.html                  # Main entry point
├── style.css                   # Design tokens + all component styles
├── app.js                      # Core engine (state, routing, simulation)
├── package.json
├── vite.config.js
├── js/
│   ├── audio-fx.js             # Procedural WebAudio synthesizer
│   ├── motion-fx.js            # Anime.js motion orchestration
│   └── random.js               # Seeded PRNG
├── data/
│   ├── real-tournaments.js     # Archived competition data
│   └── hero-videos.js          # Hero video config
├── vendor/
│   ├── anime.min.js            # Anime.js (vendored)
│   └── confetti.browser.js     # canvas-confetti (vendored)
├── e2e/                        # Playwright E2E tests
├── tests/                      # Unit & integration tests
├── scripts/                    # Utility scripts
├── docs/                       # Technical documentation
├── assets/                     # Images, videos, graphics
└── README.md
```

---

## Known Limitations

- **No real-time data** — All data is archived/historical
- **Simulation accuracy** — The Poisson model is a simplification; it does not predict real outcomes
- **No backend** — All data is bundled client-side
- **No user accounts** — No persistence of user preferences beyond localStorage
- **Video dependencies** — Hero videos require internet connection

---

## Future Engineering Directions

- [ ] Add more competitions (EFL Championship, Primeira Liga, etc.)
- [ ] Implement a more sophisticated simulation model (e.g., Dixon-Coles)
- [ ] Add head-to-head comparison between teams
- [ ] Implement a "season mode" with save/load
- [ ] Add more detailed match statistics (xG, possession, etc.)
- [ ] Implement a proper state management pattern (e.g., Redux-like)
- [ ] Add CSV export for standings and simulation results
- [ ] Implement a proper component-based architecture
- [ ] Add PWA support for offline use

---

## License

ISC © [Om Dangol](https://github.com/omwe77) & Contributors
