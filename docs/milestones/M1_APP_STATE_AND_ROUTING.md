# Milestone 1: Application State + Routing Foundation

## Step 2: Mini PRD

### 1. Problem
ARENA CORE is currently managed through manual DOM element visibility toggles (`hidden` attributes and `.classList.add('active')`) inside a monolithic IIFE. The application lacks URL-based routing, deep linking, browser history support (back/forward buttons), and a single source of truth for application and simulation lifecycle states. When a user refreshes the page or copies a URL to a friend, the context is lost and resets to the default World Cup landing view.

### 2. Users
- **Football Enthusiasts & Analysts**: Want to bookmark and share specific tournament standings, fixtures, or simulation states directly.
- **Developers & Testers**: Require deterministic application states, predictable route transitions, and observable store updates without hidden background processes leaking timers.

### 3. Objective
Introduce a centralized, observable state store (`appStore`) and a declarative client-side router supporting both HTML5 History API and Hash-based routing, with explicit simulation lifecycle states (`READY | PLAYING | PAUSED | REPLAYING | FINISHED | ERROR`).

### 4. Scope
- Central `appState` reactive store object:
  ```js
  appState = {
    route: { path: '/', params: {}, query: {} },
    competition: 'wc',
    season: '2023/2024',
    simulation: {
      simulationId: null,
      seed: null,
      modelVersion: 'v1.0.0',
      datasetVersion: '2024.11',
      status: 'READY', // READY | PLAYING | PAUSED | REPLAYING | FINISHED | ERROR
      stage: 'all',
      currentMatch: null,
      currentMinute: 0,
      completed: false,
      champion: null
    },
    userPreferences: { sfxEnabled: true, theme: 'dark' },
    dataStatus: 'ONLINE' // ONLINE | CACHED | OFFLINE
  }
  ```
- Declarative route pattern matching:
  - `/` (Home)
  - `/competitions`
  - `/competition/:competitionId`
  - `/competition/:competitionId/standings`
  - `/competition/:competitionId/fixtures`
  - `/competition/:competitionId/teams`
  - `/competition/:competitionId/simulation`
  - `/match/:matchId`
  - `/match/:matchId/replay`
  - `/simulation/:simulationId`
  - `/draw/:competitionId`
  - `/data`
  - `/methodology`
  - `/settings`
- Synchronization with existing tournament selectors and navigation bars.
- Azure Static Web Apps `staticwebapp.config.json` navigation fallback.

### 5. Non-Goals
- Full redesign of the visual UI components (reserved for Milestone 4).
- Replacing Poisson mathematical simulation logic with Dixon-Coles (reserved for Milestone 17).
- Full 3D Three.js stadium redesign (reserved for Milestone 18).

### 6. Requirements
1. **URL Navigation**: Clicking nav links or competition tabs updates the URL path without full page reload.
2. **History Traversal**: Browser Back and Forward buttons navigate between views properly.
3. **Deep Linking & Refresh**: Navigating directly to `/competition/pl/standings` or `/#/competition/ucl` loads the correct tournament and sub-view.
4. **Deterministic Simulation State**: The simulation lifecycle must only exist in one state at a time (`READY`, `PLAYING`, `PAUSED`, `REPLAYING`, `FINISHED`, `ERROR`).
5. **No Timer Leaks**: Switching routes or tournaments cancels any ongoing match intervals or orphaned animation loops.

### 7. Acceptance Criteria
- [x] Changing views or tournaments updates `window.location`.
- [x] Direct load of `/competition/ucl` or `/#/competition/ucl/simulation` opens UCL simulator directly.
- [x] Browser Back button returns to the previous view without breaking state.
- [x] Central store publishes state changes to subscribers.
- [x] No duplicate simulation timers running simultaneously.
- [x] Build passes (`npm run build`), lint passes (`npm run lint`), test suite passes (`npm run test`).

### 8. Dependencies
- Native `window.history`, `popstate`, `hashchange`.
- Standard ESM module structure.

### 9. Risks & Mitigations
- *Risk*: Azure Static Web Apps returns 404 for direct paths like `/data`.
  *Mitigation*: Provide `staticwebapp.config.json` with `navigationFallback.rewrite: "/index.html"`, and support hash fallback `/#/...`.

---

## Step 3: Mini TRD

### 1. Current Architecture Involved
- `app.js`: Contains `switchView(viewId)`, `selectTournament(key)`, event listeners on `.top-nav-link`, `.comp-tab`, and buttons.
- State is fragmented across `tournamentState[key]`, `activeTournKey`, `leagueAutoSimActive`, `currentStage`, and various flags.

### 2. Target Architecture
- Create `js/router.js`: Lightweight, zero-dependency client router with pattern matching, param extraction, and history management.
- Create `js/state.js`: Central state container (`appStore`) with pub/sub listener pattern and explicit status enums.
- Integrate into `app.js`: Wire route changes directly to `switchView` and `selectTournament`, ensuring unidirectional state flow:
  `URL Event / User Action -> appStore.dispatch() -> State Updated -> UI Rendered`.
- Create `staticwebapp.config.json`: Configure client-side SPA routing for Azure.

### 3. Files Affected
- `js/state.js` (NEW)
- `js/router.js` (NEW)
- `staticwebapp.config.json` (NEW)
- `index.html` (Include `js/state.js` and `js/router.js` modules)
- `app.js` (Bridge router events to core renderers)
- `eslint.config.js` (Include new modules in lint scope)

### 4. Rollback Considerations
If routing malfunctions on legacy browsers, `js/router.js` falls back gracefully to in-memory state or hash-based fallback with no breaking behavior.
