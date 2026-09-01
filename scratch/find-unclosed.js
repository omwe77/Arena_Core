const fs = require('fs');

const css = fs.readFileSync('style.css', 'utf8');
const lines = css.split('\n');

let balance = 0;
let stack = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const cleanLine = line.replace(/\/\*[\s\S]*?\*\//g, '').replace(/'[^']*'/g, "''").replace(/"[^"]*"/g, '""');
  for (let j = 0; j < cleanLine.length; j++) {
    const ch = cleanLine[j];
    if (ch === '{') {
      balance++;
      stack.push({ line: i + 1, text: line.trim() });
    } else if (ch === '}') {
      balance--;
      stack.pop();
    }
  }
}

console.log('Unclosed blocks:', stack);
