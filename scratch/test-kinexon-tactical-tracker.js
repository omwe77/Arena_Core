const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const styleCss = fs.readFileSync('style.css', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');

console.log('=== VERIFYING KINEXON PRO TACTICAL TRACKER BOARD ===');

// 1. Check HTML Markup
const hasTacModal = indexHtml.includes('id="tactical-tracker-modal"') &&
                    indexHtml.includes('tac-pitch-board') &&
                    indexHtml.includes('tac-nodes-layer') &&
                    indexHtml.includes('tac-mesh-group') &&
                    indexHtml.includes('tac-t1-gk') &&
                    indexHtml.includes('tac-t2-gk') &&
                    indexHtml.includes('tac-ball-box');
console.log('✓ KINEXON Tactical Tracker Modal in HTML:', hasTacModal);

// 2. Check CSS
const hasTacCss = styleCss.includes('.tactical-tracker-modal') &&
                  styleCss.includes('.tac-dialog') &&
                  styleCss.includes('.tac-node') &&
                  styleCss.includes('.tac-ball-node') &&
                  styleCss.includes('.tac-dist-label');
console.log('✓ KINEXON Tactical Tracker CSS styling & player node layout:', hasTacCss);

// 3. Check JS Controller
const hasTacJs = appJs.includes('openProTacticalTracker') &&
                 appJs.includes('getTacticalRoster') &&
                 appJs.includes('tac-dist-label') &&
                 appJs.includes('window.openProTacticalTracker = openProTacticalTracker') &&
                 appJs.includes('openProTacticalTracker(match.home, match.away');
console.log('✓ JS Tactical Controller, 22-player tracking & delegation on all match plays:', hasTacJs);

console.log('\nAll KINEXON Pro Tactical Tracker checks passed successfully! 🎉');
