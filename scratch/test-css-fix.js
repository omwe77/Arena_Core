const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// Fix badgeAnimateIn
css = css.replace(
  `@keyframes badgeAnimateIn {
  from { opacity: 0.5; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1);
}`,
  `@keyframes badgeAnimateIn {
  from { opacity: 0.5; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}`
);

// Check if any other unclosed braces exist
let balance = 0;
let stack = [];
const lines = css.split('\n');

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

console.log('Balance after fix:', balance);
console.log('Unclosed stack:', stack);
