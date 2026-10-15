const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const state = await page.evaluate(() => {
    const panels = [...document.querySelectorAll('.view-panel')].map(p => ({
      id: p.id, hidden: p.hidden,
    }));
    return {
      url: location.href,
      hash: location.hash,
      panels,
      activeNav: document.querySelector('.top-nav-link.active')?.dataset.nav,
    };
  });
  console.log('AFTER LOAD:', JSON.stringify(state, null, 1));
  console.log('ERRORS:', errors.slice(0, 10));

  // Try navigating Home manually
  await page.evaluate(() => { if (window.ArenaRouter) window.ArenaRouter.navigate('/'); });
  await page.waitForTimeout(600);
  const state2 = await page.evaluate(() => ({
    panels: [...document.querySelectorAll('.view-panel')].map(p => ({ id: p.id, hidden: p.hidden })),
    homeShellVisible: !!document.querySelector('#view-product-home .home-shell')?.offsetParent,
  }));
  console.log('AFTER navigate(/):', JSON.stringify(state2, null, 1));

  await page.screenshot({ path: 'scratch/home-after-navigate.png', fullPage: true });
  await browser.close();
})();
