const { chromium } = require('@playwright/test');
const URL = process.env.TARGET || 'https://lemon-ocean-06aede400.5.azurestaticapps.net/';
(async () => {
  const browser = await chromium.launch();
  for (const [label, vp, extra] of [['desktop', { width: 1440, height: 900 }, {}], ['tablet', { width: 834, height: 1112 }, {}], ['mobile', { width: 375, height: 812 }, { isMobile: true, hasTouch: true }]]) {
    const page = await browser.newPage({ viewport: vp, ...extra });
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => { const b = document.querySelector('[data-nav="tournament-sim"]'); if (b) b.click(); });
    await page.waitForTimeout(900);
    await page.evaluate(() => { const b = document.getElementById('sim-instant-btn'); if (b) b.click(); });
    await page.waitForTimeout(3500);
    await page.evaluate(() => { const s = document.getElementById('sim-skip-btn'); if (s) s.click(); });
    await page.waitForTimeout(2000);
    const out = await page.evaluate(() => {
      function contains(anc, desc) { for (let n = desc; n; n = n.parentElement) if (n === anc) return true; return false; }
      const els = [...document.querySelectorAll('.sim-header-card, .sim-clock-hud, #champion-banner, .bracket-nav-tabs, .ticker-bar, .group-card, .bracket-column, .match-card, .stage-badge, .live-control-bar, .footer, .site-footer')]
        .filter(e => e.offsetParent !== null);
      const hits = [];
      for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) {
        if (contains(els[i], els[j]) || contains(els[j], els[i])) continue; // skip ancestry
        const ra = els[i].getBoundingClientRect(), rb = els[j].getBoundingClientRect();
        const ox = Math.max(0, Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left));
        const oy = Math.max(0, Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top));
        const area = ox * oy;
        if (area > 500) hits.push({
          a: els[i].className.toString().slice(0, 40), b: els[j].className.toString().slice(0, 40),
          pctA: +(area / (ra.width * ra.height) * 100).toFixed(0), pctB: +(area / (rb.width * rb.height) * 100).toFixed(0),
          a: [ra.left, ra.top, ra.width, ra.height].map(Math.round), b: [rb.left, rb.top, rb.width, rb.height].map(Math.round)
        });
      }
      return {
        groupCards: document.querySelectorAll('.group-card').length,
        bracketCols: document.querySelectorAll('.bracket-column').length,
        matchCards: document.querySelectorAll('.match-card').length,
        clockPos: getComputedStyle(document.getElementById('sim-clock-hud')).position,
        overlaps: hits.slice(0, 12),
        scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth,
      };
    });
    console.log(`\n### ${label}:`, JSON.stringify(out, null, 1));
    await page.screenshot({ path: `scratch/shots/live-${label}-after-skip.png` });
    await page.close();
  }
  await browser.close();
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
