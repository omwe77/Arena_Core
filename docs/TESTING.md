# ARENA_CORE — Testing Documentation

## Overview

ARENA_CORE uses a multi-layered testing strategy combining Node.js validation scripts, Playwright E2E tests, and manual browser verification.

## Test Commands

```bash
# Run all validation tests
npm test

# Run Playwright E2E tests
npx playwright test

# Run lint
npm run lint

# Run build
npm run build
```

## Test Layers

### Layer 1: Syntax Validation

**File**: `npm test` (first step)

Validates JavaScript syntax for all source files:
- `app.js` — core engine
- `data/hero-videos.js` — video configuration
- `data/real-tournaments.js` — archived data

### Layer 2: Engine Validation

**File**: `scratch/full-validation.js`

Validates:
- CSS braces are balanced
- HTML structure contains all required elements
- Tournament data is loaded correctly
- All 13 competitions have valid configurations
- Team counts match expected values

### Layer 3: Runtime Execution

**File**: `scratch/test-runtime-execution.js`

Validates:
- `DOMContentLoaded` event fires correctly
- Startup cycle executes without errors
- No console errors during initialization
- All critical DOM elements are present

### Layer 4: Custom Draw Validation

**File**: `scratch/test-custom-draw-full.js`

Validates:
- Custom draw modal opens and closes
- Team selection works correctly
- Validation prevents invalid states (not exactly 48 teams)
- Randomize and clear functions work
- Modal is accessible (keyboard navigation)

### Layer 5: Full Validation

**File**: `scratch/validate-all.js`

Runs all validation checks and reports:
- JavaScript syntax errors
- HTML structure issues
- CSS validity
- Tournament data integrity
- Missing or broken elements

### Layer 6: Playwright E2E Tests

**File**: `e2e/example.spec.js`

End-to-end tests covering:
- Home page load and navigation
- Competition selection
- Simulation flow
- Custom draw modal
- Standings view
- Archive view
- Match modal
- Mobile navigation
- Keyboard access

## CI/CD Integration

Every push to `main` triggers:

1. **Validate** job:
   - `npm ci` — install dependencies
   - `npm run lint` — ESLint
   - `npm run build` — Vite production build
   - `npm test` — all validation tests

2. **Deploy** job (only if validate passes):
   - Azure Static Web Apps deployment

## Test Coverage

| Area | Coverage | Tool |
|------|----------|------|
| JavaScript syntax | 100% | Node.js |
| HTML structure | Critical elements | Custom validation |
| CSS validity | Braces balance | Custom validation |
| Tournament data | All competitions | Custom validation |
| Simulation engine | Core logic | Custom validation |
| Custom draw | Full flow | Playwright |
| Navigation | All views | Playwright |
| Mobile | 375px viewport | Playwright |
| Accessibility | Keyboard, focus | Playwright |

## Known Testing Gaps

- **No unit tests** for individual functions (simulation engine, state management)
- **No visual regression** testing
- **No performance** benchmarking in CI
- **No cross-browser** testing (only Chromium via Playwright)

## Future Testing Improvements

- [ ] Add unit tests for simulation engine
- [ ] Add unit tests for state management
- [ ] Add visual regression tests
- [ ] Add performance benchmarks
- [ ] Add cross-browser testing (Firefox, Safari)
- [ ] Add accessibility automated testing (axe-core)
