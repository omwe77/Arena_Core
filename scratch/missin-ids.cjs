// Compare app.js getElementById targets against index.html ids to find dead selectors.
const fs = require('fs');

const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

const referenced = new Set();
for (const m of app.matchAll(/getElementById\(\s*['"]([A-Za-z0-9_\-]+)['"]\s*\)/g)) referenced.add(m[1]);

const htmlIds = new Set();
for (const m of html.matchAll(/id="([A-Za-z0-9_\-]+)"/g)) htmlIds.add(m[1]);

// ids created dynamically in app.js renderers
const dynamicIds = new Set();
for (const m of app.matchAll(/id="([A-Za-z0-9_\-]+)"/g)) dynamicIds.add(m[1]);

const missing = [...referenced].filter(id => !htmlIds.has(id) && !dynamicIds.has(id));
console.log('Missing ids (referenced via getElementById but never defined):');
console.log(missing.join('\n') || '(none)');
