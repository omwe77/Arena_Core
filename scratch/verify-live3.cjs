const { chromium } = require('@playwright/test');
const URL = 'https://lemon-ocean-06aede400.5.azurestaticapps.net/';
(async () => {
  const browser = await chromium.launch();
  for (const [label, vp, extra] of [['desktop', { width: 1440, height: 900 }, {}], ['mobile', { width: 375, height: 812 }, { isMobile: true, hasTouch: true }]]) {
    const page = await browser.newPage({ viewport: vp, ...extra });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message.slice(0, 120)));
    page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text().slice(0, 120)); });
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2400);
    const res = await page.evaluate(() => {
      function contains(a, d) { for (let n = d; n; n = n.parentElement) if (n === a) return true; return false; }
      const out = {};
      // striker can never paint/hit-test above controls
      const controls = [document.querySelector('.audio-toggle'), document.getElementById('global-data-mode'), document.querySelector('.top-nav-link.active')];
      out.controlHits = controls.map(c => {
        if (!c) return 'missing';
        const r = c.getBoundingClientRect();
        const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return (top === c || c.contains(top)) ? 'ok' : 'covered-by-' + (top && ((top.className || top.id || top.tagName) + '').slice(0, 30));
      });
      out.scrim = !!document.querySelector('.hero-scrim') && !!document.querySelector('.hero-pitch');
      // full content sweep on sim view after a real run
      return out;
    });
    await page.evaluate(() => { document.querySelector('[data-nav="tournament-sim"]').click(); });
    await page.waitForTimeout(900);
    await page.evaluate(() => { const x = document.getElementById('sim-instant-btn'); if (x) x.click(); });
    await page.waitForTimeout(3500);
    await page.evaluate(() => { const x = document.getElementById('sim-skip-btn'); if (x) x.click(); });
    await page.waitForTimeout(2200);
    res.postSim = await page.evaluate(() => {
      function contains(a, d) { for (let n = d; n; n = n.parentElement) if (n === a) return true; return false; }
      const els = [...document.querySelectorAll('.page-content *')].filter(e => {
        if (e.offsetParent === null) return false;
        const kids = [...e.children];
        return (kids.length === 0 || kids.every(k => getComputedStyle(k).position === 'absolute')) && (e.textContent || '').trim().length > 3;
      });
      const hits = [];
      for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) {
        if (contains(els[i], els[j]) || contains(els[j], els[i])) continue;
        const ra = els[i].getBoundingClientRect(), rb = els[j].getBoundingClientRect();
        const ox = Math.max(0, Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left));
        const oy = Math.max(0, Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top));
        if (ox * oy > 700) hits.push((els[i].className || '').toString().slice(0, 34) + ' <-> ' + (els[j].className || '').toString().slice(0, 34));
      }
      return { nodes: els.length, hits: hits.slice(0, 8), overflow: document.documentElement.scrollWidth - window.innerWidth,
               groupCards: document.querySelectorAll('.group-card').length };
    });
    await page.screenshot({ path: `scratch/shots/live3-${label}.png` });
    res.errors = errors.slice(0, 5);
    console.log(`### ${label}:`, JSON.stringify(res, null, 1));
    await page.close();
  }
  await browser.close();
})().catch(e => { console.error('FATAL ' + e.message); process.exit(1); });
