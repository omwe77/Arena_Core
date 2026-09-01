const fs = require('fs');
const appJs = fs.readFileSync('app.js', 'utf8');
const lines = appJs.split('\n');

const preIdx = lines.findIndex(l => l.includes('function precomputeMatchResult'));
console.log('precomputeMatchResult at line:', preIdx + 1);
if (preIdx !== -1) {
  console.log(lines.slice(preIdx, preIdx + 80).join('\n'));
}
