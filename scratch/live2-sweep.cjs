const { chromium } = require('@playwright/test');
const URL = process.env.TARGET || 'https://lemon-ocean-06aede400.5.azurestaticapps.net/';

async function sweep(page, label) {
  const res = await page.evaluate(() => {
    function contains(a, d) { for (let n = d; n; n = n.parentElement) if (n === a) return true; return false; }
    const roots = ['.page-content', '.site-header', '.competition-selector-bar'];
    const els = roots.flatMap(sel => [...document.querySelectorAll(sel + ' *')]).filter(e => {
      if (e.tagName === 'SCRIPT' || e.tagName === 'STYLE') return false;
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      const r = e.getBoundingClientRect();
      if (r.width < 8 || r.height < 4) return false;
      // skip transparent text-less wrappers
      return true;
    });
    const fx = [...document.querySelectorAll('.page-content *')].filter(e => {
      const cs = getComputedStyle(e);
      return cs.position === 'fixed' && cs.display !== 'none' && e.getBoundingClientRect().width > 10;
    });
    const all = els.concat(fx.filter(e => !els.includes(e)));
    const hits = [];
    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        const A = all[i], B = all[j];
        if (contains(A, B) || contains(B, A)) continue;
        const ra = A.getBoundingClientRect(), rb = B.getBoundingClientRect();
        const ox = Math.max(0, Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left));
        const oy = Math.max(0, Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top));
        if (ox * oy > 900) {
          hits.push({
            a: (A.className || A.tagName).toString().slice(0, 42) + (A.id ? '#' + A.id : ''),
            b: (B.className || B.tagName).toString().slice(0, 42) + (B.id ? '#' + B.id : ''),
            pctA: Math.round(ox * oy / (ra.width * ra.height) * 100),
            pctB: Math.round(ox * oy / (rb.width * rb.height) * 100),
            tA: (A.textContent || '').trim().slice(0, 24),
            tB: (B.textContent || '').trim().slice(0, 24),
            fixed: getComputedStyle(A).position === 'fixed' || getComputedStyle(B).position === 'fixed',
          });
        }
      }
    }
    return {
      n: all.length,
      hits: hits.sort((x, y) => Math.max(y.pctA, y.pctB) - Math.max(x.pctA, x.pctB)).slice(0, 14),
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
  console.log(`\n### ${label}: elems=${res.n} overflowPx=${res.overflow}`);
  if (res.hits.length) console.log(JSON.stringify(res.hits, null, 1));
  else console.log('no overlaps');
  return res;
}

(async () => {
  const browser = await chromium.launch();
  for (const [label, vp, extra] of [['desktop', { width: 1440, height: 900 }, {}], ['tablet', { width: 834, height: 1112 }, {}], ['mobile', { width: 375, height: 812 }, { isMobile: true, hasTouch: true }]]) {
    const page = await browser.newPage({ viewport: vp, ...extra });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message.slice(0, 100)));
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2200);
    console.log(`\n=== VIEWPORT ${label} ===`);
    // Home
    await sweep(page, `${label} home`);
    await page.screenshot({ path: `scratch/shots/live2-${label}-home.png`, fullPage: false });

    // Comps
    await page.evaluate(() => { const b = document.querySelector('[data-nav="competitions-view"]'); if (b) b.click(); });
    await page.waitForTimeout(900);
    await sweep(page, `${label} comps`);
    await page.screenshot({ path: `scratch/shots/live2-${label}-comps.png` });

    // Standings
    await page.evaluate(() => { const b = document.querySelector('[data-nav="standings-view"]'); if (b) b.click(); });
    await page.waitForTimeout(900);
    await sweep(page, `${label} standings`);
    await page.screenshot({ path: `scratch/shots/live2-${label}-standings.png` });

    // Sim all tournaments:iterate competitions via the competition selector if available
    await page.evaluate(() => { const b = document.querySelector('[data-nav="tournament-sim"]'); if (b) b.click(); });
    await page.waitForTimeout(900);
    // full sim + skip to get real bracket state
    await page.evaluate(() => { const b = document.getElementById('sim-instant-btn'); if (b) b.click(); });
    await page.waitForTimeout(3500);
    await page.evaluate(() => { const b = document.getElementById('sim-skip-btn'); if (b) b.click(); });
    await page.waitForTimeout(2200);
    await sweep(page, `${label} sim(post-sim)`);
    await page.screenshot({ path: `scratch/shots/live2-${label}-sim.png` });

    // Open the custom draw modal at this viewport
    await page.evaluate(() => { const b = document.querySelector('#btn-wc-custom-draw'); if (b) b.click(); });
    await page.waitForTimeout(900);
    const modalOpen = await page.evaluate(() => { const m = document.getElementById('wc-draw-modal'); return m && !m.hidden; });
    if (modalOpen) {
      await sweep(page, `${label} draw-modal`);
      await page.screenshot({ path: `scratch/shots/live2-${label}-draw.png` });
      await page.evaluate(() => { window.closeCustomDrawModal && window.closeCustomDrawModal(); });
      await page.waitForTimeout(400);
    }
    if (errors.length) console.log('PAGEERRORS:', JSON.stringify(errors.slice(0, 5)));
    await page.close();
  }
  await browser.close();
})().catch(e => { console.error('FATAL ' + e.message); process.exit(1); });
