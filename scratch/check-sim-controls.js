const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

lines.forEach((l, idx) => {
  if (l.includes('sim-stage-action-btn') || l.includes('sim-header-card') || l.includes('bracket-nav-tabs') || l.includes('stage-tabs-group') || l.includes('tournament-stage-viewport')) {
    console.log(`Line ${idx + 1}: ${l}`);
  }
});

const simHeaderIdx = lines.findIndex(l => l.includes('sim-header-card'));
if (simHeaderIdx !== -1) {
  console.log(lines.slice(simHeaderIdx, simHeaderIdx + 80).join('\n'));
}
