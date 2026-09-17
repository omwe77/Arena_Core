# ARENA_CORE // Global Football Platform & Tournament Simulator

> A high-performance, responsive football platform combining official competition data, live standings, match centers, media highlights, and a 10-competition Poisson mathematical tournament simulation engine.

[![Azure Static Web Apps Deployment](https://img.shields.io/badge/Live%20Demo-Azure%20Static%20Web%20Apps-2ecc71?style=for-the-badge&logo=microsoftazure)](https://lemon-ocean-06aede400.5.azurestaticapps.net)
[![Tech Stack](https://img.shields.io/badge/Stack-Vanilla%20JS%20%7C%20HTML5%20%7C%20CSS3%20%7C%20Bash-00E5FF?style=for-the-badge)](https://github.com/omwe77/SIEP--arena_coore)
[![Release](https://img.shields.io/badge/Release-v1.0.0-ff6b35?style=for-the-badge)](https://github.com/omwe77/SIEP--arena_coore/releases/tag/v1.0.0)

---

## 🌐 Live Demo
Experience the live application on Azure Static Web Apps (auto-deploys on every push to `main`):  
👉 **[https://lemon-ocean-06aede400.5.azurestaticapps.net](https://lemon-ocean-06aede400.5.azurestaticapps.net)**

---

## 📸 Showcase & Screenshots

| Desktop Command Center | Mario Striker Header & Custom Draw |
| :---: | :---: |
| ![ARENA_CORE Desktop](bundesliga_hero_bg.jpg) | ![Mario Striker Pitch](assets/mario_stadium_header.jpg) |

---

## 🛠️ Tech Stack

* **Frontend Architecture**: Semantic HTML5, Vanilla CSS3 (Custom Design System & Glassmorphism), Modern Flexbox & CSS Grid.
* **Scripting & Engine**: Vanilla JavaScript (ES6+), Zero Heavy Framework Dependencies.
* **Motion & Audio**: Anime.js motion engine, procedural WebAudio API synthesizer (zero audio asset downloads).
* **Simulation Algorithm**: Poisson Goal Distribution Model ($\lambda$ adjusted for FIFA rankings, home advantage, and attack/defense strength).
* **Automation & DevOps**: Bash Automation Script (`setup.sh`), Git Version Control, GitHub Actions / Azure Static Web Apps CI/CD.
* **Testing**: Playwright E2E test suite, custom Node.js validation scripts.

---

## ⚡ Quick Start

Clone and run the project locally in under 30 seconds:

```bash
# 1. Clone the repository
git clone https://github.com/omwe77/SIEP--arena_coore.git

# 2. Navigate to the project directory
cd SIEP--arena_coore

# 3. Make setup script executable & run automated setup
chmod +x setup.sh
./setup.sh
```

### Running the Web App:
* **Option A**: Double-click `index.html` to open directly in any web browser.
* **Option B (Recommended Local Server)**:
  ```bash
  python3 -m http.server 8080
  # Open http://localhost:8080 in your browser
  ```

---

## 👥 Team & Roles

| Contributor | GitHub Username | Role & Responsibilities |
| :--- | :--- | :--- |
| **Om Dangol** | [@omwe77](https://github.com/omwe77) | Full-Stack Lead, Poisson Sim Engine, Custom Draw UI & Navigation |
| **Team Member** | [@np01ai4a250216](https://github.com/np01ai4a250216) | Frontend Architecture, Mario Striker Engine, Responsive Styling & QA |

---

## 🏆 Key Features

- [x] **13 Major Football Competitions**:
  - *International*: FIFA World Cup 2026, UEFA EURO 2024, Copa América.
  - *Continental*: UEFA Champions League (36-team Swiss League Phase).
  - *Domestic Leagues*: Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Liga Portugal, Eredivisie, Süper Lig, Scottish Premiership.
- [x] **Dynamic Hero Video Backgrounds**:
  - Each of the 13 competitions has a dedicated, full-viewport looping video background on its hero section.
  - Auto-play with configurable start offsets and seamless loop behavior.
- [x] **Liga Portugal Embeddable Highlight Reel**:
  - Inline YouTube iframe gateway directly within the Liga Portugal hero section.
- [x] **UCL 9-League Qualification Gateway**:
  - Interactive panel showing the 9 domestic leagues feeding teams into the UEFA Champions League.
- [x] **World Cup 48-Team Custom Draw Modal**:
  - Interactive selection of all 48 qualified nations across 6 global confederations (UEFA, CONMEBOL, CONCACAF, CAF, AFC, OFC).
  - Real 2026 confederation allocation presets & FIFA strength tiers.
- [x] **Full Knockout & Group Simulation Progression**:
  - Group Stages (Groups A–L) $\to$ Round of 32 $\to$ Round of 16 $\to$ Quarter-finals $\to$ Semi-finals $\to$ Grand Final.
- [x] **Live Match Timers & Authentic Player Scorers**:
  - Minute-by-minute live cards, authentic player goal events, extra time (AET), and penalty shootouts.
- [x] **Anime.js Motion Engine**:
  - Smooth entrance animations for cards, panels, and stat reveals using Anime.js.
- [x] **Procedural Audio FX Synthesizer**:
  - Zero asset downloads — all sound effects (goal cheer, kick, fanfare, UI click) are generated in real-time via the WebAudio API.
  - Persistent SFX toggle button with `localStorage` preference memory.
- [x] **High-Stakes Knockout UI & Celebrations**:
  - Championship crowning ceremony with confetti particle physics engine.
  - Goal celebration banners with animated entrance and timed dismissal.
- [x] **Mario Striker Interactive Header**:
  - Rigged vector character running on grass turf with power shots and comic celebrations.
- [x] **Fully Responsive Design**:
  - Tested and optimized from **375px mobile** up to **1280px+ desktop** viewports.
- [x] **Zero Console Errors**:
  - 100% clean runtime lifecycle with no third-party bundle bloat.

---

## 📁 Repository Structure

```text
SIEP--arena_coore/
├── index.html                  # Semantic HTML5 root entry point
├── style.css                   # Custom CSS3 styling, responsive grid & themes
├── app.js                      # Core simulation engine & DOM controllers
├── setup.sh                    # Automated bash verification & launch script
├── js/
│   ├── audio-fx.js             # Procedural WebAudio synthesizer & SFX toggle
│   └── motion-fx.js            # Anime.js motion orchestration engine
├── vendor/
│   ├── anime.min.js            # Anime.js animation library (vendored)
│   └── confetti.browser.js     # Canvas-confetti particle engine (vendored)
├── data/
│   ├── real-tournaments.js     # API-Football real data cache
│   ├── hero-videos.js          # Hero video ID & config per competition
│   └── real-tournaments.json   # Competition metadata index
├── assets/                     # Stadium, header graphic & video assets
├── e2e/                        # Playwright end-to-end test suite
├── tests/                      # Unit & integration test suite
├── scripts/                    # Utility & maintenance scripts
└── README.md                   # Complete showcase documentation
```

---

## 📄 License

ISC © [Om Dangol](https://github.com/omwe77) & Contributors
