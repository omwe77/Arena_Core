# ARENA_CORE — Architecture Documentation

## Overview

ARENA_CORE is a single-page application (SPA) built with vanilla HTML, CSS, and JavaScript. It uses a custom state management system, a seeded PRNG for deterministic simulation, and a modular architecture with clear separation of concerns.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    index.html                         │  │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────────────────┐  │  │
│  │  │  Home   │  │   Sim    │  │  Standings/Archive  │  │  │
│  │  │  View   │  │  View    │  │      Views          │  │  │
│  │  └────┬────┘  └────┬─────┘  └──────────┬──────────┘  │  │
│  │       │            │                    │              │  │
│  │  ┌────┴────────────┴────────────────────┴──────────┐  │  │
│  │  │              app.js (Core Engine)                │  │  │
│  │  │  ┌─────────┐ ┌──────────┐ ┌────────────────┐    │  │  │
│  │  │  │  State  │ │  Router  │ │  Tournament    │    │  │  │
│  │  │  │  Store  │ │          │ │  Config        │    │  │  │
│  │  │  └─────────┘ └──────────┘ └────────────────┘    │  │  │
│  │  │  ┌─────────┐ ┌──────────┐ ┌────────────────┐    │  │  │
│  │  │  │  Match  │ │  Custom  │ │  Simulation    │    │  │  │
│  │  │  │  Center │ │  Draw    │ │  Engine        │    │  │  │
│  │  │  └─────────┘ └──────────┘ └────────────────┘    │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐   │  │
│  │  │  motion-fx   │  │  audio-fx    │  │  random    │   │  │
│  │  │  (Anime.js)  │  │  (WebAudio)  │  │  (seeded)  │   │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Module Responsibilities

### Core Engine (`app.js`)

The main application file (~10,000 lines) contains:

- **State Management**: `tournamentState` object holds all simulation state per competition
- **Routing**: `switchView()` function manages view transitions
- **Simulation Engine**: Poisson-based goal sampling, knockout progression, penalty shootouts
- **DOM Rendering**: All UI rendering functions (standings, brackets, match cards, etc.)
- **Event Handling**: User interactions, modal management, audio triggers

### State Store (`js/state.js`)

Manages application state with a simple pub/sub pattern:
- `AppState.get(key)` — retrieve state
- `AppState.set(key, value)` — update state and notify subscribers
- `AppState.subscribe(key, callback)` — listen for state changes

### Router (`js/router.js`)

Lightweight client-side router:
- `ArenaRouter.navigate(path)` — change view based on URL
- `ArenaRouter.getCurrentRoute()` — get current route
- Supports browser back/forward buttons

### Motion Engine (`js/motion-fx.js`)

Anime.js orchestration:
- `runAnime(config)` — execute Anime.js animations
- `staggerStandings()` — animate standings table rows
- `staggerFixtures()` — animate match cards
- `staggerArchive()` — animate archive cards
- `launchChampionConfetti()` — celebration effect
- `showGoalBanner()` — goal celebration overlay

### Audio Engine (`js/audio-fx.js`)

Procedural WebAudio synthesizer:
- `playGoalCheer()` — crowd roar + whistle
- `playKick()` — ball kick sound
- `playFanfare()` — championship fanfare
- `playUIClick()` — UI interaction sound
- All sounds generated procedurally, zero audio assets

### Randomness (`js/random.js`)

Seeded PRNG for deterministic simulation:
- `seedRandom(seed)` — initialize with seed
- `nextRandom()` — get next random number
- `nextInt(min, max)` — get random integer in range
- `nextPoisson(lambda)` — sample from Poisson distribution

### Data Layer (`data/real-tournaments.js`)

Archived competition snapshots:
- Team rosters with names, codes, countries, logos
- Historical standings with positions, points, goals
- Top scorers with names, teams, goals, assists
- All data is static and bundled client-side

## Data Flow

```
User Interaction
       │
       ▼
┌─────────────┐
│  Event      │
│  Handler    │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  State      │────▶│  Render     │
│  Update     │     │  Function   │
└─────────────┘     └──────┬──────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│  Simulation │     │  DOM        │
│  Engine     │     │  Update     │
└─────────────┘     └─────────────┘
```

## Key Design Decisions

### Why Vanilla JS?

- Zero framework overhead
- Full control over DOM manipulation
- No build step required for development
- Easy to understand for recruiters

### Why Seeded PRNG?

- Deterministic simulations (same seed = same result)
- Reproducible for testing
- Allows "rematch" with same conditions

### Why Procedural Audio?

- Zero audio file downloads
- Instant loading
- No external dependencies
- Consistent across all devices

### Why CSS Custom Properties?

- Centralized design tokens
- Easy theme switching per competition
- Maintainable and scalable
- No CSS preprocessor required

## Performance Considerations

- **Content visibility**: Off-screen panels use `content-visibility: auto`
- **GPU acceleration**: Animations use `transform` and `opacity`
- **Lazy loading**: Images and videos load on demand
- **Vendored libraries**: Anime.js and canvas-confetti bundled locally
- **No framework overhead**: Vanilla JS with minimal dependencies

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Uses modern CSS features (custom properties, grid, flexbox, `color-mix()`) and ES6+ JavaScript.
