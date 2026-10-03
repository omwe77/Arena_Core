# Changelog

All notable changes to ARENA_CORE are documented in this file.

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
- Mario Striker interactive header
- Fully responsive (375px mobile → 1280px+ desktop)
- Azure Static Web Apps CI/CD
