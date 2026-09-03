const fs = require('fs');
const path = require('path');

console.log('--- VALIDATING JAVASCRIPT SYNTAX ---');
try {
  const dataCode = fs.readFileSync(path.join(__dirname, '..', 'data', 'real-tournaments.js'), 'utf8');
  new Function('window', dataCode)({});
  console.log('✓ data/real-tournaments.js parsed without syntax errors');
} catch (e) {
  console.error('✗ data/real-tournaments.js error:', e);
}

// Check app.js syntax using vm.Script
const vm = require('vm');
try {
  const appCode = fs.readFileSync('app.js', 'utf8');
  new vm.Script(appCode);
  console.log('✓ app.js parsed without syntax errors');
} catch (e) {
  console.error('✗ app.js error:', e);
}

// Check style.css braces balance
const css = fs.readFileSync('style.css', 'utf8');
let openBraces = 0;
for (const ch of css.replace(/\/\*[\s\S]*?\*\//g, '')) {
  if (ch === '{') openBraces++;
  else if (ch === '}') openBraces--;
}
console.log('✓ style.css braces balance:', openBraces === 0 ? 'PERFECT (0)' : `MISMATCH (${openBraces})`);

// Check index.html for modal elements
const html = fs.readFileSync('index.html', 'utf8');
const requiredIds = [
  'detailed-stats-modal',
  'dstats-panel-livepitch',
  'dstats-pitch-players',
  'dstats-pitch-ball',
  'dstats-pitch-banner',
  'dstats-btn-play-pause',
  'dstats-scrubber-track',
  'dstats-panel-summary',
  'dstats-panel-feed',
  'dstats-panel-stats',
  'dstats-panel-lineups',
  'dstats-panel-info',
  'sim-stage-action-btn',
  'sim-instant-btn'
];

let allFound = true;
for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) {
    console.error(`✗ Missing element with id="${id}" in index.html`);
    allFound = false;
  }
}
if (allFound) {
  console.log('✓ All critical modal and simulation elements present in index.html');
}
