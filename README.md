# ARENA_CORE ⚽🏆

> An interactive football tournament simulator and match center built entirely with vanilla web standards. Simulate international cups, continental leagues, and domestic seasons with custom brackets, tactical 2D pitch views, and live celebrations.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Azure%20Static%20Web%20Apps-2ecc71?style=for-the-badge&logo=microsoftazure)](https://lemon-ocean-06aede400.5.azurestaticapps.net)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions)](https://github.com/omwe77/Arena_Core/actions)
[![Tests](https://img.shields.io/badge/Tests-39%2F39%20Passing-4EA140?style=for-the-badge)](https://github.com/omwe77/Arena_Core/tree/main/e2e)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](https://github.com/omwe77/Arena_Core/blob/main/LICENSE)

---

## 🌟 What is Arena Core?

Arena Core is a lightweight football tournament simulator that lets you explore and simulate outcomes across 13 major international, continental, and domestic football competitions. Whether you want to see who wins the expanded 48-team 2026 World Cup, run the new 36-team UEFA Champions League Swiss stage, or simulate a 38-matchday Premier League title race, Arena Core calculates realistic match outcomes in seconds right in your browser.

👉 **Play it live:** [https://lemon-ocean-06aede400.5.azurestaticapps.net](https://lemon-ocean-06aede400.5.azurestaticapps.net)

---

## 🚀 Key Features

* **🏆 13 Major Competitions**
  * **International Tournaments:** FIFA World Cup (48 teams), UEFA EURO (24 teams), Copa América (16 teams).
  * **Club Competitions:** UEFA Champions League (new 36-team Swiss League phase).
  * **Domestic Leagues:** Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Liga Portugal, Eredivisie, Süper Lig, and Scottish Premiership.

* **⚡ Fast & Flexible Simulations**
  * **Instant Sim:** Simulate an entire tournament or season at the click of a button.
  * **Stage-by-Stage / Match-by-Match:** Progress through group stages, round of 16, quarterfinals, semifinals, and finals one round at a time.
  * **Poisson Engine:** Match outcomes are generated using team attack and defense ratings, home advantage, and extra time / penalties when knockout matches draw.
  * **Seeded PRNG:** Powered by Mulberry32 to allow reproducible, deterministic simulation runs.

* **🏟️ Interactive Match Center & 2D Tactical Pitch**
  * Click any simulated fixture to inspect tactical lineups and player formations (4-3-3, 4-2-3-1, 3-5-2, etc.).
  * Interactive playback scrubber with minute-by-minute simulated commentary, goal highlights, and cards.
  * In-depth match telemetry: Expected Goals (xG), possession, total shots, shots on target, and fouls.
  * Seamless bracket navigation: click "Details" on any compact knockout card to instantly switch to that tournament stage and smoothly scroll to the fixture.
  * On-card simulation controls: run instant simulations directly from match cards with real-time score badges and live stage updating.

* **🎲 Custom World Cup Draw**
  * Build your own custom 48-nation World Cup!
  * Filter and pick nations across all 6 FIFA confederations (UEFA, CONMEBOL, CONCACAF, CAF, AFC, OFC).
  * Choose presets (Real 2026, Elite 48, Random Draw) and simulate hypothetical world champions.

* **🎉 Champion Celebrations & Audio FX**
  * Full victory fanfare, champion modal, golden boot and stats breakdown, and confetti animations when a champion is crowned.
  * Built-in WebAudio procedural sound synthesizer (stadium whistles, crowd cheers, goal horns) with one-click mute toggle.

* **📊 Historical Archives & Real Standings**
  * Browse packaged real-world league tables, top scorers, and tournament milestones for every supported competition.
  * Clean UI separation between verified historical records (`ARCHIVE DATA`) and hypothetical model runs (`SIMULATION`).

* **💡 Pure Vanilla Architecture**
  * Built with native HTML5, CSS3, and JavaScript — zero heavy frontend frameworks, zero build step required for development, and instant page loads.

* **♿ Accessibility & Keyboard Navigation**
  * Fully compliant semantic HTML5 landmarks (`<main id="mainContent">`, `<nav>`, `<header>`) and skip-to-content navigation for screen readers.
  * Universal keyboard shortcuts: press `Escape` anytime to dismiss active dialogs (`Methodology`, `Custom Draw`, `Champions Modal`).
  * Full tab order and ARIA role definitions across tournament tabs, fixtures, and action buttons.

---

## 📐 Simulation Engine & Mathematical Model

Arena Core uses a stochastic simulation framework calibrated against real-world football outcomes:

1. **Rating Calibration:** Every club and national team possesses granular attack, defense, and overall strength ratings.
2. **Expected Goals ($\lambda$):** Match goal rates are modeled as independent Poisson distributions with parameters $\lambda_{\text{home}}$ and $\lambda_{\text{away}}$ derived from team offensive power vs. opponent defensive resilience, adjusted for home advantage and competition stage tension.
3. **Deterministic PRNG:** Simulations use the `Mulberry32` pseudo-random number generator. Seeds can be configured to produce bit-exact, deterministic results across browser environments.
4. **Knockout Tie-Breaking:** Draws in knockout rounds trigger extra time simulation (30 minutes) followed by a 5-round sudden-death penalty shootout model factoring in penalty conversion probabilities.

---

## 🏆 Tournament Formats & Bracket Rules

* **FIFA World Cup (Expanded 48-Team Format):**
  * **Group Stage:** 48 nations arranged into 12 groups of 4 (Groups A through L).
  * **Advancement Criteria:** Top 2 nations from each group (24 teams) plus the 8 best third-placed nations automatically qualify for the knockout stage.
  * **Single-Elimination Knockout:** 32 teams contest the Round of 32, followed by Round of 16, Quarterfinals, Semifinals, 3rd Place Playoff, and the Final.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Vanilla JavaScript (ES6+), HTML5, CSS3 | Fast UI rendering without virtual DOM overhead |
| **Styling** | Custom Design Tokens & CSS Grid/Flexbox | Clean daylight broadcast aesthetic and responsive mobile layouts |
| **Audio** | WebAudio API | Procedural sound synthesis (zero audio asset downloads) |
| **Testing** | Playwright & Node.js | Automated end-to-end and integration test suite |
| **CI/CD** | GitHub Actions & Azure Static Web Apps | Automated validation and instant production deployments |

---

## 💻 Getting Started Locally

No complex build setup or compilation is needed. Just clone and serve:

```bash
# 1. Clone the repository
git clone https://github.com/omwe77/Arena_Core.git
cd Arena_Core

# 2. Start any local static server
npx serve .
# or using Python:
python -m http.server 8080
```

Open your browser and navigate to `http://localhost:8080` (or `http://localhost:3000`).

---

## 🧪 Running Tests

To run the full validation and Playwright test suite:

```bash
# Install dependencies
npm install

# Run the complete test suite (syntax validation + Playwright E2E)
npm test

# Run ESLint
npm run lint
```

---

## 📄 License

This project is licensed under the [ISC License](LICENSE) © [Om Dangol](https://github.com/omwe77).
