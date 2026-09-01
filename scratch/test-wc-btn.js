const fs = require('fs');
const app = fs.readFileSync('app.js', 'utf8');
console.log('btn-wc-sim-now present in app.js:', app.includes('btn-wc-sim-now'));
