const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const dataJs = fs.readFileSync('data/real-tournaments.js', 'utf-8');
const appJs = fs.readFileSync('app.js', 'utf-8');

try {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM(html, { runScripts: "dangerously" });
  const window = dom.window;

  window.eval(dataJs);
  console.log('data/real-tournaments.js loaded');
  window.eval(appJs);
  console.log('app.js loaded');
  const event = new window.Event('DOMContentLoaded');
  window.document.dispatchEvent(event);
  console.log('DOMContentLoaded finished');
} catch (err) {
  console.error('ERROR:', err);
}
