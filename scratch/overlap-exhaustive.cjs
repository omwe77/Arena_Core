const { chromium } = require('@playwright/test');
const URL = process.env.TARGET || 'https://lemon-ocean-06aede400.5.azurestaticapps.net/';
(async () => {
  const browser = await chromium.launch();
  for (const [label, vp, extra] of [['desktop', { width: 1440, height: 900 }, {}], ['mobile', { width: 375, height: 812 }, { isMobile: true, hasTouch: true }]]) {
    const page = await browser.newPage({ viewport: vp, ...extra });
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2200);
    for (const [view, navSel] of [['home', '.top-nav-link[data-nav="tournament-home"]'], ['sim', '[data-nav="tournament-sim"]'], ['standings', '[data-nav="standings-view"]'], ['comps', '[data-nav="competitions-view"]']]) {
      await page.evaluate((sel) => { const b = document.querySelector(sel); if (b) b.click(); }, navSel);
      await page.waitForTimeout(view === 'home' ? 600 : 900);
      const res = await page.evaluate(() => {
        function contains(anc, desc) { for (let n = desc; n; n = n.parentElement) if (n === anc) return true; return false; }
        // visible leaf-ish nodes carrying text or imagery
        const els = [...document.querySelectorAll('.page-content *')].filter(e => {
          if (e.offsetParent === null) return false;
          const cs = getComputedStyle(e);
          if (cs.position === 'fixed') return false; // fixed toasts/HUDs overlay by design
          const kids = [...e.children];
          const isLeaf = kids.length === 0 || (kids.every(k => getComputedStyle(k).position === 'absolute') && e.textContent.trim()?.length < 120);
          return isLeaf && (e.textContent || '').trim().length > 3;
        });
        const hits = [];
        for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) {
          if (contains(els[i], els[j]) || contains(els[j], els[i])) continue;
          if (els[i].parentElement !== els[j].parentElement) {
            // allow different parents only if both visible; keep though — overlap still matters
          }
          const ra = els[i].getBoundingClientRect(), rb = els[j].getBoundingClientRect();
          const ox = Math.max(0, Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left));
          const oy = Math.max(0, Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top));
          if (ox * oy > 900) hits.push({
            a: els[i].className.toString().slice(0, 44) || els[i].tagName,
            b: els[j].className.toString().slice(0, 44) || els[j].tagName,
            tA: (els[i].textContent || '').trim().slice(0, 30),
            tB: (els[j].textContent || '').trim().slice(0, 30),
            pctA: +(ox * oy / (ra.width * ra.height) * 100).toFixed(0),
          });
        }
        return { n: els.length, hits: hits.slice(0, 10) };
      });
      console.log(`[${label}] ${view}: nodes=${res.n} hits=${res.hits.length} ${res.hits.length ? JSON.stringify(res.hits, null, 1) : ''}`);
      if (res.hits.length) await page.screenshot({ path: `scratch/shots/overlap-${label}-${view}.png` });
    }
    await page.close();
  }
  await browser.close();
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
