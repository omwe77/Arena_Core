const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const lines = indexHtml.split('\n');

console.log('=== SEARCH MODALS IN INDEX.HTML ===');
lines.forEach((l, idx) => {
  if (l.includes('match-detail-modal') || l.includes('detailed-stats-modal')) {
    console.log(`Line ${idx + 1}: ${l}`);
  }
});

// Print the content of match-detail-modal and detailed-stats-modal
const matchDetailStart = lines.findIndex(l => l.includes('id="match-detail-modal"'));
if (matchDetailStart !== -1) {
  console.log('=== match-detail-modal ===');
  console.log(lines.slice(matchDetailStart, matchDetailStart + 120).join('\n'));
}

const detailedStatsStart = lines.findIndex(l => l.includes('id="detailed-stats-modal"'));
if (detailedStatsStart !== -1) {
  console.log('=== detailed-stats-modal ===');
  console.log(lines.slice(detailedStatsStart, detailedStatsStart + 120).join('\n'));
}
