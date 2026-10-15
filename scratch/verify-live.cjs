const { chromium } = require('@playwright/test');
const URL = 'https://lemon-ocean-06aede400.5.azurestaticapps.net/';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text().slice(0, 200)); });
  const failed = [];
  page.on('requestfailed', r => failed.push(r.url().split('/').slice(-1)[0] + ' :: ' + (r.failure()||{}).errorText));
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(2500);

  const state = await page.evaluate(() => {
    const panels = [...document.querySelectorAll('.view-panel')].map(p => ({ id: p.id, hidden: p.hidden, display: getComputedStyle(p).display }));
    const active = document.querySelector('.top-nav-link.active');
    return {
      panels,
      activeNav: active ? active.dataset.nav : null,
      hasApp: typeof window.app !== 'undefined',
      hasRouter: !!window.ArenaRouter,
      bodyDatasetTheme: document.body.dataset.theme || null,
      scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth,
      ball: !!document.querySelector('.home-hero-3d-ball'),
      heroCss: (() => { const h = document.querySelector('.home-hero'); return h ? getComputedStyle(h).display : null; })(),
    };
  });
  console.log('STATE:', JSON.stringify(state, null, 1));
  console.log('ERRORS:', JSON.stringify(errors.slice(0, 8)));
  console.log('FAILEDREQ:', JSON.stringify(failed.slice(0, 10)));
  await page.screenshot({ path: 'scratch/shots/live-desktop.png', fullPage: true });
  await browser.close();
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
