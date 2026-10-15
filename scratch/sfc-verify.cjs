const { chromium } = require('@playwright/test');

function luminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
function parse(c) {
  const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m) return null;
  if (m[4] !== undefined && parseFloat(m[4]) === 0) return null;
  return [ +m[1], +m[2], +m[3] ];
}
function contrast(fg, bg) {
  const bf = parse(fg), bb = parse(bg);
  if (!bf || !bb) return null;
  const L1 = luminance(...bf), L2 = luminance(...bb);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}
// blend rgba bg over white to get effective color
function blendOverWhite(c) {
  const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m) return c;
  const a = m[4] !== undefined ? parseFloat(m[4]) : 1;
  if (a >= 0.999) return `rgb(${m[1]},${m[2]},${m[3]})`;
  const r = Math.round(+m[1] * a + 255 * (1 - a));
  const g = Math.round(+m[2] * a + 255 * (1 - a));
  const b = Math.round(+m[3] * a + 255 * (1 - a));
  return `rgb(${r},${g},${b})`;
}

async function analyzeCard(cards) {
  return cards.map(card => {
    const name = card.querySelector('.sfc-team-name');
    const score = card.querySelector('.sfc-score-box');
    const label = card.querySelector('.sfc-comp-label');
    const gs = getComputedStyle(name);
    const sbs = getComputedStyle(score);
    const gsL = getComputedStyle(label);
    // effective: walk up for opaque bg
    let eff = 'rgb(255,255,255)';
    let node = name;
    while (node) {
      const bg = blendOverWhite(getComputedStyle(node).backgroundColor);
      eff = node === document.body ? eff : bg;
      if (!/rgba\(.*, 0\)/.test(getComputedStyle(node).backgroundColor)) break;
      node = node.parentElement;
    }
    return {
      team: name.textContent.trim().slice(0, 14),
      nameColor: gs.color, effBg: eff,
      nameContrast: contrast(gs.color, eff).toFixed(2),
      scoreColor: sbs.color, scoreContrast: contrast(sbs.color, eff).toFixed(2),
      labelContrast: contrast(gsL.color, blurBg(label, name)).toFixed(2),
    };
    function blurBg(el, _n) {
      let n = el;
      while (n) {
        const bg = getComputedStyle(n).backgroundColor;
        if (!/rgba\(.*, 0\)/.test(bg)) return blendOverWhite(bg);
        n = n.parentElement;
      }
      return 'rgb(255,255,255)';
    }
  });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  eval('');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1200);

  // WC: simulate group stage → knockout fixtures (sfc cards)
  await page.evaluate(() => { document.querySelector('.top-nav-link[data-nav="tournament-sim"]')?.click(); });
  await page.waitForTimeout(900);
  await page.evaluate(() => { document.getElementById('sim-stage-action-btn')?.click(); });
  await page.waitForTimeout(1000);
  await page.evaluate(() => { const b = document.getElementById('sim-stage-action-btn'); if (b && !b.disabled) b.click(); });
  await page.waitForTimeout(600);
  await page.evaluate(() => { const b = document.getElementById('sim-stage-action-btn'); if (b && !b.disabled && !/GROUP|COMPLETE/i.test(b.textContent || '') && !/GROUP/.test(b.textContent || '')) b.click(); });
  await page.waitForTimeout(1200);
  let analysis = await page.evaluate(analyzeCard.toString(), []).then(() => null).catch(() => null);
  // simpler: run in-page versions (contrast helpers defined inside evaluate)
  const inPage = await page.evaluate(() => {
    function luminance(r, g, b) { const a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; }
    function parse(c) { const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/); if (!m) return null; if (m[4] !== undefined && parseFloat(m[4]) === 0) return null; return [+m[1], +m[2], +m[3]]; }
    function blend(c) { const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/); if (!m) return c; const a = m[4] !== undefined ? parseFloat(m[4]) : 1; if (a >= 0.999) return 'rgb(' + m[1] + ',' + m[2] + ',' + m[3] + ')'; return 'rgb(' + Math.round(+m[1] * a + 255 * (1 - a)) + ',' + Math.round(+m[2] * a + 255 * (1 - a)) + ',' + Math.round(+m[3] * a + 255 * (1 - a)) + ')'; }
    function contrast(fg, bg) { const bf = parse(fg), bb = parse(bg); if (!bf || !bb) return null; const L1 = luminance(...bf), L2 = luminance(...bb); return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05); }
    function effBg(el) { let n = el; while (n) { const bg = getComputedStyle(n).backgroundColor; if (!/rgba\(.*, 0\)/.test(bg)) return blend(bg); n = n.parentElement; } return 'rgb(255,255,255)'; }
    const cards = [...document.querySelectorAll('.sfc-card')];
    const pick = cards.slice(0, 3).map(card => {
      const name = card.querySelector('.sfc-team-name');
      const score = card.querySelector('.sfc-score-box');
      const badge = card.querySelector('.sfc-status-badge');
      if (!name || !score) return null;
      const bg = effBg(name);
      return {
        team: name.textContent.trim().slice(0, 16),
        cardBg: getComputedStyle(card).backgroundColor,
        nameColor: getComputedStyle(name).color,
        nameContrast: contrast(getComputedStyle(name).color, bg).toFixed(2),
        scoreColor: getComputedStyle(score).color,
        scoreContrast: contrast(getComputedStyle(score).color, bg).toFixed(2),
        badgeText: badge ? badge.textContent.trim() : null,
        badgeContrast: badge ? contrast(getComputedStyle(badge).color, effBg(badge)).toFixed(2) : null,
        nameOverflow: (getComputedStyle(name).overflow),
      };
    });
    return pick;
  });
  console.log('=== SFC CARDS (knockout view) ===', JSON.stringify(inPage, null, 1));
  await page.screenshot({ path: 'scratch/sfc-cards-after.png', fullPage: false });

  console.log('ERRORS:', errors.length ? errors.slice(0, 8) : 'none');
  await browser.close();
  console.log('SFC VERIFY DONE');
})();
