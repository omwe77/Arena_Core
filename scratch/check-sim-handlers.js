const fs = require('fs');
const appJs = fs.readFileSync('app.js', 'utf8');
const lines = appJs.split('\n');

console.log('=== SEARCH INSTANT AND CUSTOM DRAW IN APP.JS ===');
lines.forEach((l, idx) => {
  if (l.includes('sim-instant-btn') || l.includes('wc-draw-btn-start') || l.includes('btn-wc-explore')) {
    console.log(`Line ${idx + 1}: ${l}`);
  }
});

const instantIdx = lines.findIndex(l => l.includes('sim-instant-btn'));
if (instantIdx !== -1) {
  console.log('=== sim-instant-btn handler ===');
  console.log(lines.slice(instantIdx - 5, instantIdx + 40).join('\n'));
}

const customStartIdx = lines.findIndex(l => l.includes('wc-draw-btn-start'));
if (customStartIdx !== -1) {
  console.log('=== wc-draw-btn-start handler ===');
  console.log(lines.slice(customStartIdx - 5, customStartIdx + 40).join('\n'));
}
