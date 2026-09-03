const fs = require('fs');

const elements = {};
function createMockElement(id, tag = 'div') {
  const el = {
    id,
    tagName: tag.toUpperCase(),
    hidden: false,
    attributes: {},
    classList: {
      _classes: new Set(),
      add(...c) { c.forEach(x => this._classes.add(x)); },
      remove(...c) { c.forEach(x => this._classes.delete(x)); },
      contains(x) { return this._classes.has(x); }
    },
    style: {},
    dataset: {},
    children: [],
    innerHTML: '',
    textContent: '',
    appendChild(child) { this.children.push(child); return child; },
    setAttribute(k, v) { this.attributes[k] = String(v); },
    getAttribute(k) { return this.attributes[k] || null; },
    removeAttribute(k) { delete this.attributes[k]; },
    addEventListener(evt, fn) {},
    querySelectorAll(sel) { return []; },
    querySelector(sel) { return createMockElement('sub-' + Math.random()); },
    getBoundingClientRect() { return { left: 0, top: 0, width: 800, height: 600 }; },
    focus() {}
  };
  return el;
}

const mockDoc = {
  getElementById(id) {
    if (!elements[id]) elements[id] = createMockElement(id);
    return elements[id];
  },
  querySelectorAll(sel) { return []; },
  querySelector(sel) { return createMockElement('sub-' + Math.random()); },
  createElement(tag) { return createMockElement('', tag); },
  addEventListener(evt, fn) {
    if (evt === 'DOMContentLoaded') {
      setTimeout(fn, 10);
    }
  },
  documentElement: createMockElement('html', 'html'),
  body: createMockElement('body', 'body')
};

const mockWin = {
  document: mockDoc,
  location: { origin: 'http://localhost' },
  REAL_TOURNAMENTS_DATA: {
    wc: { teams: Array.from({ length: 48 }, (_, i) => ({ name: `Nation ${i+1}`, code: `N${i+1}`, logo: 'flag.png' })) },
    ucl: { teams: Array.from({ length: 36 }, (_, i) => ({ name: `Club ${i+1}`, code: `C${i+1}`, logo: 'logo.png' })) },
    pl: { teams: Array.from({ length: 20 }, (_, i) => ({ name: `PL Team ${i+1}`, code: `P${i+1}`, logo: 'logo.png' })) },
    laliga: { teams: Array.from({ length: 20 }, (_, i) => ({ name: `LL Team ${i+1}`, code: `L${i+1}`, logo: 'logo.png' })) },
    serieA: { teams: Array.from({ length: 20 }, (_, i) => ({ name: `SA Team ${i+1}`, code: `S${i+1}`, logo: 'logo.png' })) },
    bundesliga: { teams: Array.from({ length: 18 }, (_, i) => ({ name: `BL Team ${i+1}`, code: `B${i+1}`, logo: 'logo.png' })) },
    ligue1: { teams: Array.from({ length: 18 }, (_, i) => ({ name: `L1 Team ${i+1}`, code: `L${i+1}`, logo: 'logo.png' })) },
    ligaPortugal: { teams: Array.from({ length: 18 }, (_, i) => ({ name: `LP Team ${i+1}`, code: `P${i+1}`, logo: 'logo.png' })) },
    eredivisie: { teams: Array.from({ length: 18 }, (_, i) => ({ name: `ER Team ${i+1}`, code: `E${i+1}`, logo: 'logo.png' })) },
    superLig: { teams: Array.from({ length: 18 }, (_, i) => ({ name: `SL Team ${i+1}`, code: `T${i+1}`, logo: 'logo.png' })) }
  },
  requestAnimationFrame(fn) { return setTimeout(fn, 16); },
  cancelAnimationFrame(id) { clearTimeout(id); },
  addEventListener() {},
  scrollTo() {}
};

global.window = mockWin;
global.document = mockDoc;
global.requestAnimationFrame = mockWin.requestAnimationFrame;

try {
  const code = fs.readFileSync('app.js', 'utf8');
  eval(code);
  setTimeout(() => {
    console.log('✅ DOMContentLoaded and startup cycle executed with 0 errors!');
    process.exit(0);
  }, 50);
} catch (err) {
  console.error('FAILED TO EXECUTE app.js:', err);
  process.exit(1);
}
