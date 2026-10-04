/**
 * ARENA CORE — Seeded RNG wiring tests
 *
 * Proves that js/random.js is the implementation actually loaded (not the
 * Math.random fallback stub), that it is referenced by index.html before the
 * simulation scripts, and that the mulberry32 generator is deterministic.
 *
 * No RNG logic is reimplemented here: random.js and state.js are executed in a
 * VM with a mock window, exactly as the browser loads them.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

let passed = 0;
function ok(name, cond, detail) {
  if (!cond) {
    console.error(`  ✗ FAIL: ${name}${detail ? ' — ' + detail : ''}`);
    process.exitCode = 1;
    return;
  }
  passed++;
  console.log(`  ✓ ${name}`);
}

console.log('=== SEEDED RNG WIRING TESTS ===');

// ---------------------------------------------------------------------------
// 1. index.html must reference js/random.js exactly once, before state.js/app.js
// ---------------------------------------------------------------------------
const html = read('index.html');
const randomRefs = html.match(/<script[^>]*src="js\/random\.js"[^>]*>/g) || [];
ok('index.html references js/random.js exactly once', randomRefs.length === 1, `found ${randomRefs.length}`);
ok('js/random.js is loaded with defer (ordered, before DOMContentLoaded)',
  randomRefs.length === 1 && /defer/.test(randomRefs[0]));

const idxRandom = html.indexOf('src="js/random.js"');
const idxState = html.indexOf('src="js/state.js"');
const idxApp = html.indexOf('src="app.js"');
ok('js/random.js appears before js/state.js', idxRandom !== -1 && idxRandom < idxState);
ok('js/random.js appears before app.js', idxRandom !== -1 && idxRandom < idxApp);

// ---------------------------------------------------------------------------
// 2. Execute the real modules (random.js then state.js) as the browser would.
//    Deferred scripts run in document order, so state.js sees ArenaRandom.
// ---------------------------------------------------------------------------
const sandbox = {
  Math,
  Date,
  console: { warn() {}, log() {}, error() {} },
  setTimeout,
  clearTimeout,
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

vm.runInContext(read('js/random.js'), sandbox, { filename: 'js/random.js' });
ok('random.js exposes window.ArenaRandom', !!sandbox.window.ArenaRandom);

const AR = sandbox.window.ArenaRandom;
ok('ArenaRandom.isSeeded() is false before seeding', AR.isSeeded() === false);
ok('ArenaRandom.getSeed() is null before seeding', AR.getSeed() === null);

// state.js provides AppState and calls ArenaRandom.seed() inside resetSimulation
vm.runInContext(read('js/state.js'), sandbox, { filename: 'js/state.js' });
ok('state.js loaded and kept the real ArenaRandom (not the stub)',
  sandbox.window.ArenaRandom === AR);

// ---------------------------------------------------------------------------
// 3. initTournamentState's seeding contract (the call app.js makes at line ~1320)
// ---------------------------------------------------------------------------
AR.seed(123456789);
ok('after seed(), isSeeded() is true', AR.isSeeded() === true);
ok('after seed(), getSeed() returns the numeric seed', AR.getSeed() === 123456789);

// ---------------------------------------------------------------------------
// 4. Determinism: same seed => same sequence; different seed => different draw
// ---------------------------------------------------------------------------
function draw(seedValue, n) {
  AR.seed(seedValue);
  const out = [];
  for (let i = 0; i < n; i++) out.push(AR.random());
  return out;
}

const a = draw(42, 8);
const b = draw(42, 8);
ok('same seed produces an identical sequence', a.every((v, i) => v === b[i]));

const c = draw(43, 8);
ok('a different seed produces a different sequence', a.some((v, i) => v !== c[i]));

// Poisson sampling (the goal model) must be reproducible from a seed too
function poissonRun(seedValue, n) {
  AR.seed(seedValue);
  const out = [];
  for (let i = 0; i < n; i++) out.push(AR.poisson(1.35));
  return out;
}
const p1 = poissonRun(7, 30);
const p2 = poissonRun(7, 30);
ok('Poisson goal sampling is reproducible for the same seed', p1.every((v, i) => v === p2[i]));
ok('Poisson samples are valid non-negative integers', p1.every(v => Number.isInteger(v) && v >= 0));

// ---------------------------------------------------------------------------
// 5. Different seeds are *capable* of different results (not required to differ
//    on every single draw, but must differ across a reasonable sample)
// ---------------------------------------------------------------------------
function outcome(seedValue) {
  AR.seed(seedValue);
  const h = AR.poisson(1.5);
  const aw = AR.poisson(1.2);
  return `${h}-${aw}`;
}
const outcomes = new Set();
for (let s = 1; s <= 40; s++) outcomes.add(outcome(s));
ok('different seeds produce a range of outcomes', outcomes.size > 1, `distinct outcomes: ${outcomes.size}`);

// ---------------------------------------------------------------------------
// 6. The app.js top-level stub must NOT override the real module
// ---------------------------------------------------------------------------
const appJs = read('app.js');
ok('app.js guards the stub with if (!ArenaRandom)',
  /var ArenaRandom = window\.ArenaRandom;/.test(appJs) && /if \(!ArenaRandom\)/.test(appJs));

// ---------------------------------------------------------------------------
// 7. Simulation randomness is routed through ArenaRandom, not Math.random
// ---------------------------------------------------------------------------
// samplePoisson (app.js ~line 806) must draw from window.ArenaRandom.random()
const samplePoissonBody = appJs.slice(appJs.indexOf('function samplePoisson'));
ok('samplePoisson draws from window.ArenaRandom.random()',
  samplePoissonBody.slice(0, 400).includes('window.ArenaRandom.random()'));
// goal-minute generation (app.js ~line 1141) must use ArenaRandom
ok('goal-minute generation uses window.ArenaRandom',
  /window\.ArenaRandom\.chance\(0\.65\)/.test(appJs));
ok('knockout draw shuffles use ArenaRandom.shuffle',
  /ArenaRandom\.shuffle\(/.test(appJs));

console.log(`\n=== ${passed} SEEDED RNG WIRING CHECKS PASSED ===`);
