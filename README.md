ARENA_CORE

A football platform combining competition data, standings, match information, highlights, and interactive tournament simulation in one interface.




**Overview**

ARENA_CORE is a client-side football platform built around two connected areas:

Football Data Hub — competition standings, match-centre information, player statistics, team information, and highlights.

Tournament Simulator — hypothetical competitions generated from team-strength models, including group stages, league seasons, knockout rounds, extra time, and penalties.

The project separates real competition data from simulation results in the UI so users can distinguish retrieved football information from generated outcomes.

Features

Support for 10+ competitions across international, continental, and domestic football.

Competition switching without leaving the main interface.

Standings tables with matches played, wins, draws, losses, goals, goal difference, points, form, and status where available.

Match centre and detailed match views.

Top-scorer and player-stat sections.

Highlights hub with:

competition filters

finals-only filtering

text/fuzzy search

saved favourites

click-to-load video embeds

**Tournament simulation with:**
group stages

league-season simulation

knockout progression

stage-by-stage views

instant full simulation

simulated match clocks

pause, resume, restart, and skip controls

extra time and penalty shootouts for knockout matches

champion celebration UI

Poisson-based score generation using team-strength inputs.

Responsive UI with navigation, modal views, notifications, and competition-specific presentation.

Optional API-Football data acquisition and local caching for updating football datasets.

Tech Stack & Architecture

Frontend

HTML5

CSS3

Vanilla JavaScript

Font Awesome for interface icons

Runtime / tooling

Node.js for data-fetching utilities and test/check scripts

CommonJS modules for Node-side utilities

No frontend build system or bundler

No runtime npm dependencies are declared in package.json

Architecture

index.html
   │
   ├── style.css
   ├── data/real-tournaments.js ── real football data layer
   └── app.js ──────────────────── UI + simulation engine

Optional data refresh:

scripts/fetch-football-data.js
   │
   └── API-Football ──> data/real-tournaments.json
                         data/real-tournaments.js

Highlights:

highlights.json / in-app highlight dataset
   └── filters + search + favourites + video facade

Prerequisites

For the basic website:

A modern web browser such as Chrome, Edge, Firefox, or Safari.

For the Node.js scripts and tests:

Node.js 18+ recommended, because the data-fetching scripts use the built-in fetch() API.

For refreshing live football data:

An API-Football account and API key.

Installation

Clone the repository and enter the project directory:

git clone <YOUR_REPOSITORY_URL>
cd worldcup-project

There is no frontend dependency installation or build step required. You can run the site directly after cloning.

Quick Start

Open index.html in a browser:

index.html

Or, from a local terminal on a machine with Python installed:

python -m http.server 8000

Then open:

http://localhost:8000

Example usage

The main application is browser-based, so the normal usage pattern is simply to load the page:

<script src="data/real-tournaments.js"></script>
<script src="app.js"></script>

After loading the application, users can switch competitions, inspect real football data, open match details or highlights, and run a tournament simulation from the simulator controls.

Usage

Explore competition data

Select a competition from the tournament selector.

Open standings, match centre, or player-stat views.

Use the relevant competition filters to change the displayed dataset.

Run a simulation

Select a competition.

Use Draw Teams where applicable.

Run the group stage or league matchdays.

Progress through the available knockout stages.

Use Instant Full Simulation to complete the competition automatically.

Inspect the generated fixtures, scores, stage results, and champion.

Highlights

Use the highlights section to:

search by team or match name

filter by competition

show finals only

save or remove favourites

open a selected video through the embedded player flow

Data & API

ARENA_CORE can work from the bundled local data layer without requiring an API call from the browser.

The optional Node.js fetch script is:

node scripts/fetch-football-data.js

Set the API key before running it:

# Windows PowerShell
$env:API_FOOTBALL_KEY="YOUR_API_KEY"
node scripts/fetch-football-data.js

# macOS / Linux
export API_FOOTBALL_KEY="YOUR_API_KEY"
node scripts/fetch-football-data.js

The fetch layer uses API-Football and is designed to collect competition teams, standings, top scorers, and sample fixtures, then write sanitised local datasets under data/.

Competition coverage

The project includes configurations for competitions such as:

FIFA World Cup

UEFA Champions League

Premier League

La Liga

Serie A

Bundesliga

Ligue 1

Liga Portugal

Eredivisie

Trendyol Süper Lig

Scottish Premiership

UEFA Euro 2024

Copa América 2024

The exact set available in each UI view depends on the corresponding simulator and data configuration.

Testing

The repository contains several focused Node.js test/check scripts, including:

node test-index.js
node test-html.js
node test-fns.js
node test-hl.js
node test-sim.js
node test-check.js

For example, the simulation test exercises the Poisson score model, fixture generation, and group-standings calculation:

node test-sim.js

Current test-script note

package.json currently contains a placeholder npm test command that intentionally exits with an error:

npm test

Until that script is replaced, use the individual test files above for repository checks.

Contributing

Contributions are welcome.

Create a feature branch:

git checkout -b feature/your-change

Make focused changes and keep existing functionality working.

Follow the existing style in HTML, CSS, and JavaScript files.

Use clear commit messages describing the change.

Run the relevant Node.js checks before opening a pull request.

Open a pull request with:

a short description of the change

screenshots or GIFs for UI changes

test/check results

any known limitations

Avoid committing API keys or other secrets. Use environment variables for API credentials.

Known Issues

npm test is not wired to the real test suite yet.

The main frontend is intentionally no-build-step, so there is no bundled production build pipeline.

Some football datasets are local/sanitised snapshots rather than guaranteed live data.

Video content depends on the external video source and its availability.

The project contains a number of development/check scripts and scratch files that are useful during development but are not part of the core browser runtime.

Roadmap

Potential next steps:

Replace placeholder or static datasets with a fully managed live-data pipeline.

Turn the existing test scripts into a single automated test command.

Add CI for regression checks.

Improve separation between data, simulation logic, and UI code.

Add persistent user accounts and cross-device favourites.

Expand match detail pages and historical competition coverage.

License



This project is currently marked as ISC in package.json.

If the repository does not contain a LICENSE file yet, add the appropriate ISC license text before publishing the repository as a fully licensed open-source project.

Maintainer: Om Dangol

For bugs and feature requests, open a GitHub issue with a clear reproduction or proposed change.
