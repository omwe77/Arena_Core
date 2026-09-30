# ARENA_CORE — Project Status Log

> Internal working notes. Not a user-facing document.
> This file tracks completed phases and remaining work for the
> ARENA_CORE frontend modernization project (2026-09-30).

---

## Repository

- **Remote:** `https://github.com/omwe77/Arena_Core.git`
- **Branch:** `main` (deployable)
- **Local HEAD:** see git log below

---

## Completed Phases

### Phase A — Correctness Pass ✅ (merged to main)
- Removed all misleading labels: "REAL DATA", "LIVE DATA", "REAL-TIME", "LIVE"
- Changed KINEXON references to generic "tracking" language
- Fixed sponsor names (Movistar, Spurs, etc.)
- Corrected README.md claims about data sources
- Removed anomalous non-deterministic `saveState()` call
- Ensured simulation outcomes are unattested/unsponsored

### Phase B — Design Token System ✅ (merged to main)
- Established semantic CSS custom property system (`style.css`)
- Color tokens: neutrals, text, borders, accent, semantic status, data provenance
- Typography tokens: font families (Chakra Petch, Outfit, Share Tech Mono), scale, weights, line-height
- Spacing, radius, shadow, motion, z-index, nav/scrollbar tokens
- Per-competition theme overrides on `--color-accent` and `--color-accent-subtle` only
- Created `docs/DESIGN_TOKENS.md` reference
- Component standards guide: buttons, inputs, labels, cards, tables, badges, toasts, focus, reduced-motion, dark-platform rules

### Phase C — Application Shell ✅ (merged to main)
- Re-skinned top header bar with token-based styling
- Re-skinned main navigation buttons (HOME, SIMULATOR, LEAGUE STANDINGS)
- Re-skinned competition selector tabs
- Re-skinned header data-mode badge (pulsing dot + text)
- Re-skinned footer with token-based surface/button/footer-region/footer-links/footer-bottom-bar
- Responsive: header on small screens uses centered logo + wrap nav + single row footer

### Phase D — Home / Landing ✅ (merged to main)
- Added `#view-product-home` panel — product-level command center
- Brand identity pillar (ARENA CORE wordmark + tagline)
- Status dashboard (active competitions, teams loaded, simulated matches, max draw size)
- Primary CTAs (SIMULATE, STANDINGS buttons)
- Competition grid populated from `TOURNAMENTS_CONFIG`
- HOME nav button routes to product home (was competition-specific before)
- Responsive: 4-col → 2-col → 1-col breakpoints
- `renderProductHome()` populates status values from real config fields

---

## In Progress

### Phase E — Simulation Lab (PARTIAL — `style.css` modified, not committed)
The following CSS classes were rewritten to use design tokens:

- `.sim-header-card` — dark surface, clean header-info + controls layout
- `.sim-action-btn` (outline, primary, ghost, gold, active-full-sim) — token-based surfaces, no emoji in text, uppercase labels
- `.sim-ctrl-btn` (base, gold) — consistent sizing, token borders
- `.sim-clock-hud` — surface card, token border, cleaner clock display
- `.clock-display-wrap`, `.clock-icon`, `.clock-stage-label`, `.clock-timer`
- `.clock-progress-track`, `.clock-progress-fill` — token accent gradient
- `.champion-banner` — surface card, gold left border, restrained celebration
- `.trophy-icon`, `.champ-label`, `.champ-name`
- `.bracket-nav-tabs`, `.bracket-tab-group`, `.bracket-tab`, `.bracket-tab.active`
- `.stage-badge` — token-based, uppercase label
- `.ticker-bar`, `.ticker-badge`, `.ticker-scroll` — token-based, restrained
- `.data-badge.SIM_DATA`, `.data-badge.SIMULATION` — token-based (was hardcoded rgba values)
- `.sim-controls-group` width adjusted to 190px

**Not yet done in Phase E:**
- Bracket match card styling review (existing `.bracket-match-card` rules still reference old colors in some places — needs audit)
- Stage-specific badge variants (stage-badge-qf, stage-badge-sf, stage-badge-gf) — may need token migration
- Per-competition sim topbar overrides (`[data-theme="..."] .sim-header-card` rules in CSS) — still use old hardcoded accent values; should migrate to token system where appropriate
- Reduced-motion and keyboard-focus verification for new sim controls

---

## Remaining Phases (not started)

### Phase F — Competitive Analytics (not started)
- Design and build archive-data browsing experience
- Competition selector integration with archive view
- Standings table redesign (token-based)
- Top scorers / leaders redesign
- Any analytics visual cards (if applicable)

### Phase G — Match Center & Intel (not started)
- Match detail view review and redesign
- Match stats panels
- Timeline / event feed
- 2D pitch viewer (if applicable)

### Phase H — Mobile + Accessibility Pass (not started)
- Full responsive audit across all views
- Touch target sizing review
- Keyboard navigation audit
- Focus state review
- Screen reader / ARIA review
- Reduced-motion verification
- Color contrast audit

### Phase I — Performance & Polish (not started)
- Unused CSS audit
- Animation budget review
- Render performance check
- Final visual consistency pass

### Phase J — Release (not started)
- Final lint/build/test sweep
- CHANGELOG update
- Final push to main

---

## Git Log (recent)

```
fbe2596 fix(ui-home): derive display values from real TOURNAMENTS_CONFIG fields
6468fe8 feat(ui): add product-level home command center
c669e96 feat(ui): modernize application shell with design tokens
78fa44b feat(ui): establish ARENA design token system
87c37b7 fix(provenance): remove misleading live/real data labels throughout UI
5764ecc Merge branch 'feat/m3-seeded-prng'
```

## Notes

- Two stale remote branches were deleted from GitHub (`feat/m3-seeded-prng`, `fix/m2-data-provenance-labels`) — their changes are already in main
- `style.css` currently has uncommitted Phase E changes (sim lab rewrite)
- Build, lint, and test all pass on committed state
- No feature branches should be created going forward — work directly on main

---

*Last updated: 2026-09-30*
