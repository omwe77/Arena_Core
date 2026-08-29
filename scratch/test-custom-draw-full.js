const fs = require('fs');

const elements = {};
function createMockElement(id, tag = 'div') {
  return {
    id,
    tagName: tag.toUpperCase(),
    hidden: false,
    attributes: {},
    classList: {
      _classes: new Set(),
      add(...c) { c.forEach(x => this._classes.add(x)); },
      remove(...c) { c.forEach(x => this._classes.delete(x)); },
      toggle(c, force) { if (force !== undefined) { force ? this._classes.add(c) : this._classes.delete(c); } else { this._classes.has(c) ? this._classes.delete(c) : this._classes.add(c); } },
      contains(x) { return this._classes.has(x); }
    },
    style: {
      setProperty(k, v) { this[k] = v; }
    },
    dataset: {},
    children: [],
    innerHTML: '',
    textContent: '',
    appendChild(child) { this.children.push(child); return child; },
    setAttribute(k, v) { this.attributes[k] = String(v); },
    getAttribute(k) { return this.attributes[k] || null; },
    removeAttribute(k) { delete this.attributes[k]; },
    addEventListener(evt, fn) { this['on' + evt] = fn; },
    querySelectorAll(sel) { return []; },
    querySelector(sel) { return createMockElement('sub-' + Math.random()); },
    closest(sel) { return this; },
    getBoundingClientRect() { return { left: 0, top: 0, width: 800, height: 600 }; },
    focus() {}
  };
}

const mockDoc = {
  getElementById(id) {
    if (!elements[id]) elements[id] = createMockElement(id);
    return elements[id];
  },
  querySelectorAll(sel) { return []; },
  querySelector(sel) { return createMockElement('sub-' + Math.random()); },
  createElement(tag) { return createMockElement('', tag); },
  addEventListener(evt, fn) {},
  documentElement: createMockElement('html', 'html'),
  body: createMockElement('body', 'body')
};

const mockWin = {
  document: mockDoc,
  REAL_TOURNAMENTS_DATA: {
    wc: { teams: Array.from({ length: 48 }, (_, i) => ({ name: `NATION ${i+1}`, code: `N${i+1}`, logo: 'flag.png' })) }
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

  console.log('Testing openCustomDrawModal()...');
  mockWin.openCustomDrawModal();
  const modal = mockDoc.getElementById('wc-draw-modal');
  if (modal.hidden === false) {
    console.log('✓ Modal is visible (hidden: false)');
  } else {
    throw new Error('Modal hidden was not set to false');
  }

  const grid = mockDoc.getElementById('wc-draw-grid');
  if (grid.innerHTML.includes('wc-nation-card')) {
    console.log('✓ Nation cards rendered successfully');
  } else {
    throw new Error('Nation cards not rendered');
  }

  console.log('Testing closeCustomDrawModal()...');
  mockWin.closeCustomDrawModal();
  if (modal.hidden === true) {
    console.log('✓ Modal closed successfully (hidden: true)');
  } else {
    throw new Error('Modal hidden was not set to true');
  }

  console.log('\nALL CUSTOM DRAW TESTS PASSED SUCCESSFULLY! 🎉');
} catch (err) {
  console.error('TEST FAILED:', err);
  process.exit(1);
}
