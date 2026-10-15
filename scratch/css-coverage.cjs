const fs = require('fs');

(async () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const js = fs.readFileSync('app.js', 'utf8');
  const css = fs.readFileSync('style.css', 'utf8');

  const valid = /^[A-Za-z][A-Za-z0-9_-]{2,}$/;
  const used = new Set();
  const collect = s => { for (const c of s) if (valid.test(c)) used.add(c); };

  const re = /class="([^"]+)"/g;
  for (const src of [html, js]) {
    let m;
    while ((m = re.exec(src)) !== null) {
      const raw = m[1].split('${')[0]; // drop dynamic template tails
      collect(raw.split(/\s+/));
    }
  }
  const re2 = /classList\.(?:add|toggle|remove)\(\s*'([^']+)'/g;
  let m2;
  while ((m2 = re2.exec(js)) !== null) if (valid.test(m2[1])) used.add(m2[1]);

  const classNames = new Set();
  const cssRe = /\.([A-Za-z][A-Za-z0-9_-]*)/g;
  let cm;
  while ((cm = cssRe.exec(css)) !== null) classNames.add(cm[1]);

  const missing = [...used].filter(c => !classNames.has(c));
  missing.sort();
  console.log('USED-BUT-UNSTYLED:', missing.length);
  console.log(missing.join('\n'));
})();
