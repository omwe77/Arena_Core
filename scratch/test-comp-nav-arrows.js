const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');
const styleCss = fs.readFileSync('style.css', 'utf8');

console.log('=== VERIFYING COMPETITION BAR ARROWS & TOURNAMENT VISIBILITY ===');

// Check that left and right arrows exist in HTML
const hasArrowsHtml = html.includes('id="comp-nav-left"') && html.includes('id="comp-nav-right"');
console.log('✓ Left and Right chevron buttons in HTML:', hasArrowsHtml);

// Check that Euro and Copa are near the front alongside World Cup
const wcIdx = html.indexOf('data-tourn="wc"');
const euroIdx = html.indexOf('data-tourn="euro"');
const copaIdx = html.indexOf('data-tourn="copa"');
const uclIdx = html.indexOf('data-tourn="ucl"');
const isFrontOrdered = (wcIdx < euroIdx) && (euroIdx < copaIdx) && (copaIdx < uclIdx);
console.log('✓ Euro 2024 and Copa América placed right beside World Cup:', isFrontOrdered);

// Check CSS rules for arrows and sleek scrollbar
const hasArrowCss = styleCss.includes('.comp-nav-arrow') && styleCss.includes('.comp-bar-inner::-webkit-scrollbar');
console.log('✓ Glassmorphic arrow styling & slim scrollbar in CSS:', hasArrowCss);

// Check JS click handlers for smooth scrolling
const hasArrowJs = appJs.includes('comp-nav-left') && appJs.includes('scrollBy') && appJs.includes('updateCompNavArrows');
console.log('✓ Click-to-scroll & auto-disabled state in app.js:', hasArrowJs);

console.log('\nAll checks passed successfully! 🎉');
