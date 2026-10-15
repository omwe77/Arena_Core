const { chromium } = require('@playwright/test');
const URL = 'https://lemon-ocean-06aede400.5.azurestaticapps.net/';
(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message.slice(0, 120)));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text().slice(0, 120)); });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  const res = await page.evaluate(() => {
    function contains(a, d) { for (let n = d; n; n = n.parentElement) if (n === a) return true; return false; }
    return {
      heroScene: !!document.querySelector('.hero-scene') && !!document.querySelector('.hero-pitch'),
      oldBallGone: !document.querySelector('.home-hero-3d-ball'),
      headerStacked: getComputedStyle(document.querySelector('.sim-header-card')).flexDirection,
    };
  });
  await page.evaluate(() => { document.querySelector('[data-nav="tournament-sim"]').click(); });
  await page.waitForTimeout(900);
  const leaf = await page.evaluate(() => {
    function contains(a, d) { for (let n = d; n; n = n.parentElement) if (n === a) return true; return false; }
    const els = [...document.querySelectorAll('.page-content *')].filter(e => {
      if (e.offsetParent === null) return false;
      if (getComputedStyle(e).position === 'fixed') return false;
      const kids = [...e.children];
      return (kids.length === 0 || kids.every(k => getComputedStyle(k).position === 'absolute'))
        && (e.textContent || '').trim().length > 3;
    });
    const hits = [];
    for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) {
      if (contains(els[i], els[j]) || contains(els[j], els[i])) continue;
      const ra = els[i].getBoundingClientRect(), rb = els[j].getBoundingClientRect();
      const ox = Math.max(0, Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left));
      const oy = Math.max(0, Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top));
      if (ox * oy > 700) hits.push((els[i].className || '').toString().slice(0, 36) + ' <-> ' + (els[j].className || '').toString().slice(0, 36));
    }
    return { nodes: els.length, hits: hits.slice(0, 8), overflow: document.documentElement.scrollWidth - window.innerWidth };
  });
  await page.screenshot({ path: 'scratch/shots/live-final-mobile-sim.png' });
  console.log(JSON.stringify({ res, leaf, errors: errors.slice(0, 6) }, null, 1));
  await b.close();
})().catch(e => { console.error('FATAL ' + e.message); process.exit(1); });
