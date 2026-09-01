const fs = require('fs');

const realTournamentsCode = fs.readFileSync('data/real-tournaments.js', 'utf8');

const vm = require('vm');
const context = {
  window: {},
  console: console,
};
context.window = context;
vm.createContext(context);
vm.runInContext(realTournamentsCode, context);
console.log('Real data loaded. Competitions:', Object.keys(context.REAL_TOURNAMENTS_DATA || {}));

for (const k of ['wc', 'euro', 'copa', 'ucl', 'pl', 'laliga', 'serieA', 'bundesliga']) {
  const t = context.REAL_TOURNAMENTS_DATA[k];
  console.log(`${k}: teams count = ${t?.teams?.length}`);
}
