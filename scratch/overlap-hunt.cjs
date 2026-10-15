const { chromium } = require('@playwright/test');
const URL = process.env.TARGET || 'https://lemon-ocean-06aede400.5.azurestaticapps.net/';

async function overlapReport(page, label, selectors) {
  const report = await page.evaluate((selectors) => {
    function boxOf(el) { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }
    function inter(a, b) {
      const ox = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
      const oy = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
      return ox * oy;
    }
    const out = {};
    for (const sel of selectors) {
      const els = [...document.querySelectorAll(sel)].filter(e => e.offsetParent !== null || getComputedStyle(e).position === 'fixed');
      const boxes = els.map(e => ({ el: e, b: boxOf(e) }));
      const hits = [];
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const area = inter(boxes[i].b, boxes[j].b);
          if (area > 400) { // >400px^2 = real visual overlap, not border rounding
            hits.push({
              a: (boxes[i].el.className || sel).toString().slice(0, 50),
              b: (boxes[j].el.className || sel).toString().slice(0, 50),
              pct: +(area / Math.min(boxes[i].b.w * boxes[i].b.h, boxes[j].b.w * boxes[j].b.h) * 100).toFixed(0),
            });
          }
        }
      }
      // Also container overflow (content wider than box = visual overflow risk)
      const overflow = els.filter(e => e.scrollWidth > e.clientWidth + 2 || e.scrollHeight > e.clientHeight + 2).length;
      out[sel] = { count: els.length, overlaps: hits.slice(0, 6), overflowingChildren: overflow };
    }
    // Global overflow
    out._doc = { scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth };
    return out;
  }, selectors);
  console.log(`\n=== ${label} ===`);
  console.log(JSON.stringify(report, null, 1));
}

(async () => {
  const browser = await chromium.launch();
  for (const [label, vp, ctx] of [['desktop', { width: 1440, height: 900 }, {}], ['tablet', { width: 834, height: 1112 }, {}], ['mobile', { width: 375, height: 812 }, { isMobile: true, hasTouch: true }]]) {
    const page = await browser.newPage({ viewport: vp, ...ctx });
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);

    // Home
    await overlapReport(page, `home ${label}`, ['.home-shell', '.home-hero', '.home-comp-grid', '.home-pillars-grid']);
    await page.screenshot({ path: `scratch/shots/live-${label}-home.png`, fullPage: false });

    // Simulator: click a comp card to enter sim view
    await page.evaluate(() => { const c = document.querySelector('#home-featured-grid .home-comp-card'); if (c) c.click(); });
    await page.waitForTimeout(1200);
    await overlapReport(page, `sim ${label}`, ['.groups-grid-container', '.group-card', '.bracket-tree-container', '.bracket-column', '.sim-header-card', '.tournament-stage-viewport', '.bracket-note-card.match-card, .match-card', '.group-table', '.tech-table']);
    await page.screenshot({ path: `scratch/shots/live-${label}-sim.png`, fullPage: false });

    // Standings
    await page.evaluate(() => { const b = document.querySelector('[data-nav="standings-view"]'); if (b) b.click(); });
    await page.waitForTimeout(900);
    await overlapReport(page, `standings ${label}`, ['.standings-grid', '.tech-card', '.tech-table', '.leaders-list']);
    await page.screenshot({ path: `scratch/shots/live-${label}-standings.png`, fullPage: false });

    // Competitions
    await page.evaluate(() => { const b = document.querySelector('[data-nav="competitions-view"]'); if (b) b.click(); });
    await page.waitForTimeout(900);
    await overlapReport(page, `competitions ${label}`, ['.archive-grid', '.archive-card']);
    await page.screenshot({ path: `scratch/shots/live-${label}-comps.png`, fullPage: false });

    await page.close();
  }
  await browser.close();
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
