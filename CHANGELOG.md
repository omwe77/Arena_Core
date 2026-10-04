# Changelog

All notable changes to ARENA_CORE are documented in this file.

## [v1.2.0] — 2026-10-04

### UI De-clutter & Theme Consolidation
A visual/UX refactor. No simulation, RNG, routing or data-structure changes.

- **Contextual competition control**: the permanently-visible 13-tab competition
  bar is replaced by one compact dropdown, shown only on competition-scoped
  views (showcase, simulation, standings, archive) and hidden on the global Home.
- **Home simplified**: removed the duplicated ARENA identity lockup and the four
  implementation status metrics (ACTIVE COMPETITIONS / TEAMS LOADED / SIMULATED
  MATCHES / MAX DRAW SIZE). Home is now a single hero ("What do you want to
  simulate?"), one primary action (RUN SIMULATION), one secondary action
  (EXPLORE ARCHIVE) and four curated Featured Competitions.
- **Shell fix**: `switchView()` now renders exactly one top-level panel. Home and
  the tournament panel previously rendered simultaneously on load.
- **Single global footer**: removed two duplicated stadium-broadcast footers
  (repeated branding, a 10-button competition list, a feature list, and fake
  BUILD/STATUS telemetry). One compact footer with Methodology + Archive links.
- **One data-mode indicator**: collapsed the repeated ARCHIVE DATA /
  HYPOTHETICAL SIMULATION badges to the single global header badge.
- **Restrained motion**: removed the `!important` hover-stunt system (button
  lift/scale/shine-sweep, card lift + neon glow, ribbon/badge lift + rotate,
  table-row slide, crest zoom, crown spin). Hover is now colour/border only.
- **Unified competition themes**: removed the UCL whole-app background override
  and per-competition neon glow on the sim header, group cards, stage button and
  bracket tabs. Competition colour remains as an accent only.

### Simulation & Mobile
- **Simulation top bars consolidated**: 13 near-identical per-competition top
  bars (the literal "13 mini websites" pattern) replaced by one contextual
  `.sim-context-bar`. ~60 lines of duplicated JS and ~67 dead CSS rules removed.
- **Mobile header simplified**: at ≤768px the animated striker, ball and
  decorative pitch effects are removed; brand, navigation and context read first.

CSS 325.5 kB → 304.9 kB · index.html 85.1 kB → 76.4 kB.

## [v1.1.0] — 2026-10-03

### Design System & Token Migration
- **Phase A**: Removed misleading "REAL DATA"/"LIVE DATA" labels, fixed sponsor names, corrected README claims
- **Phase B**: Established semantic CSS custom property system (colors, typography, spacing, radius, shadows, motion, layout)
- **Phase C**: Re-skinned application shell (header, nav, footer) with design tokens
- **Phase D**: Added product-level home command center with status dashboard and competition grid

### Simulation Lab
- **Phase E**: Migrated all simulation lab components to design tokens
  - Bracket match cards, stage badges, champion banner, ticker bar
  - Per-competition theme overrides now use `color-mix()` with semantic tokens
  - Focus-visible styles for all sim controls
  - Removed duplicate `prefers-reduced-motion` block

### Competitive Analytics
- **Phase F**: Full token migration for standings and leaders
  - Position badges, zone badges, tech-table, leader items
  - Fixed undefined token references (`--danger-red`, `--border-subtle`, etc.)
  - Per-competition theme override token names corrected

### Archive Browsing
- **Phase F**: New archive view with competition cards
  - Displays standings, top scorers, team counts per competition
  - Token-based grid layout with hover effects
  - Stagger entrance animation
  - Wired into router navigation

### Match Center & Intel
- **Phase G**: Match events CSS token migration
  - Event list, event rows, event team/player/minute styling
  - Verified: 2D pitch viewer, timeline, stats panels, lineups, event feed all functional

### Mobile & Accessibility
- **Phase H**: Comprehensive accessibility pass
  - 44px minimum touch targets for all interactive elements
  - Focus-visible styles for all buttons, links, inputs, tabs
  - Skip-to-content link for keyboard navigation
  - High contrast mode support via `prefers-contrast` media query
  - ARIA roles on view panels, aria-labels on nav buttons

### Performance & Polish
- **Phase I**: Render optimizations
  - `content-visibility: auto` on view panels
  - `contain: layout style` on cards and grid containers
  - GPU-accelerated animations (`will-change: transform`, `translateZ(0)`)
  - `contain: layout` on large lists

### Release
- **Phase J**: Final validation
  - All engine checks pass (CSS braces, HTML structure, tournament data, formations)
  - All custom draw tests pass
  - All JavaScript syntax checks pass
  - Zero console errors

---

## [v1.0.0] — 2026-09-30

### Initial Release
- 13 major football competitions (World Cup 2026, EURO 2024, Copa América, UCL, Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Liga Portugal, Eredivisie, Süper Lig, Scottish Premiership)
- Poisson goal distribution simulation engine
- Full knockout + group stage simulation progression
- Dynamic hero video backgrounds per competition
- World Cup 48-team custom draw modal
- Match timers, player scorers, extra time, penalty shootouts
- Anime.js motion engine + procedural WebAudio SFX
- ARENA_CORE Striker interactive header
- Fully responsive (375px mobile → 1280px+ desktop)
- Azure Static Web Apps CI/CD
