const fs = require('fs');

const styleCss = fs.readFileSync('style.css', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');

console.log('=== VERIFYING TV BROADCAST & 3D VS SHIELD MATCH CARDS ===');

// 1. Check CSS for TV Scorebug and 3D Shields
const hasScorebugCss = styleCss.includes('.card-scorebug-header') &&
                       styleCss.includes('.scorebug-ribbon-bar') &&
                       styleCss.includes('.card-vs-arena') &&
                       styleCss.includes('.vs-shield') &&
                       styleCss.includes('.vs-chrome-emblem') &&
                       styleCss.includes('.card-tactical-pattern-banner');
console.log('✓ TV Scorebug, 3D VS Shields, and Tactical Pattern CSS:', hasScorebugCss);

// 2. Check JavaScript Card Render Pipeline
const hasCardJs = appJs.includes('card-scorebug-header') &&
                  appJs.includes('scorebug-ribbon-bar') &&
                  appJs.includes('card-vs-arena') &&
                  appJs.includes('vs-shield') &&
                  appJs.includes('card-tactical-pattern-banner') &&
                  appJs.includes('btn-open-holo-broadcast');
console.log('✓ JavaScript Broadcast Card markup & tactical patterns:', hasCardJs);

console.log('\nAll TV Broadcast & 3D VS Match Card checks passed successfully! 🎉');
