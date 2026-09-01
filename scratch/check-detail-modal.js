const fs = require('fs');

const appJs = fs.readFileSync('app.js', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');

const modalStart = indexHtml.indexOf('id="detailed-stats-modal"');
const modalEnd = indexHtml.indexOf('<!-- 3D Holographic Stadium Stage', modalStart);
console.log('=== detailed-stats-modal in index.html ===');
console.log(indexHtml.substring(modalStart - 50, modalStart + 3500));

const openFnIdx = appJs.indexOf('function openDetailedStatsModal');
console.log('=== openDetailedStatsModal in app.js ===');
console.log(appJs.substring(openFnIdx, openFnIdx + 3000));
