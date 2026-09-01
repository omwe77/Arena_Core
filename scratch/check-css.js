const fs = require('fs');

const css = fs.readFileSync('style.css', 'utf8');
const lines = css.split('\n');

const dstatsStart = lines.findIndex(l => l.includes('.detailed-stats-modal') || l.includes('.dstats-dialog'));
console.log('dstats start line in style.css:', dstatsStart + 1);
if (dstatsStart !== -1) {
  console.log(lines.slice(Math.max(0, dstatsStart - 20), dstatsStart + 40).join('\n'));
}

// Let's check for unmatched braces in style.css before dstats
let openBraces = 0;
let errorLine = -1;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Simple brace count (ignoring strings/comments roughly)
  const cleanLine = line.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const ch of cleanLine) {
    if (ch === '{') openBraces++;
    else if (ch === '}') {
      openBraces--;
      if (openBraces < 0) {
        console.log(`Extra closing brace at line ${i+1}: ${line}`);
        openBraces = 0;
      }
    }
  }
}
console.log('Final open braces count:', openBraces);
