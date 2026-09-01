const fs = require('fs');

const realDataCode = fs.readFileSync('data/real-tournaments.js', 'utf8');
const appCode = fs.readFileSync('app.js', 'utf8');

const vm = require('vm');

// Create mock DOM for full simulation run
const elements = new Map();
function getEl(id) {
  if (!elements.has(id)) {
    elements.set(id, {
      id,
      hidden: false,
      textContent: '',
      innerHTML: '',
      style: {},
      classList: {
        add: () => {},
        remove: () => {},
        toggle: () => {},
        contains: () => false
      },
      setAttribute: () => {},
      getAttribute: () => null,
      querySelectorAll: () => [],
      querySelector: () => null,
      addEventListener: () => {},
      removeEventListener: () => {},
      dataset: {}
    });
  }
  return elements.get(id);
}

const mockDoc = {
  getElementById: getEl,
  querySelectorAll: () => [],
  querySelector: () => getEl('mock-el'),
  createElement: (tag) => getEl(`mock-${tag}`),
  addEventListener: () => {},
  documentElement: getEl('html'),
  body: getEl('body')
};

const sandbox = {
  window: {},
  document: mockDoc,
  console: console,
  Math: Math,
  setTimeout: (fn, ms) => fn(),
  clearTimeout: () => {},
  setInterval: (fn, ms) => 1,
  clearInterval: () => {},
  requestAnimationFrame: (fn) => 1,
  cancelAnimationFrame: () => {},
  Date: Date,
  Set: Set,
  Map: Map,
  Array: Array,
  Object: Object,
  parseInt: parseInt,
  parseFloat: parseFloat,
  String: String,
  Number: Number,
  Boolean: Boolean
};
sandbox.window = sandbox;

vm.createContext(sandbox);
vm.runInContext(realDataCode, sandbox);

console.log('--- TESTING REAL TOURNAMENTS SIMULATION ---');
// Let's test WC, EURO, COPA simulation
for (const key of ['wc', 'euro', 'copa']) {
  const comp = sandbox.REAL_TOURNAMENTS_DATA[key];
  console.log(`Checking ${key}: name="${comp?.name}", teams count=${comp?.teams?.length}`);
}
