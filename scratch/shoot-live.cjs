const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text().slice(0, 200)); });
  page.on('requestfailed', r => errors.push('REQFAIL: ' + r.url().slice(0, 120) + ' :: ' + (r.failure()?.errorText || '')));

  await page.goto('https://lemon-ocean-06aede400.5.azurestaticapps.net/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(2000);

  const state = await page.evaluate(() => {
    const panels = [...document.querySelectorAll('.view-panel')].map(p => ({ id: p.id, hidden: p.hidden }));
    const scripts = [...document.querySelectorAll('script[src]')].map(s => s.getAttribute('src'));
    return {
      title: document.title,
      panels,
      scriptCount: scripts.length,
      scripts,
      bodyText: document.body.innerText.slice(0, 300),
      headerVisible: !!document.querySelector('.site-header')?.offsetParent,
      heroVisible: !!document.querySelector('.home-hero')?.offsetParent,
    };
  });
  console.log(JSON.stringify(state, null, 1));
  console.log('ERRORS:', errors.length ? errors.slice(0, 12) : 'none');

  await page.screenshot({ path: 'scratch/live-desktop.png', fullPage: true });
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mob.goto('https://lemon-ocean-06aede400.5.azurestaticapps.net/', { waitUntil: 'networkidle', timeout: 45000 });
  await mob.waitForTimeout(1500);
  await mob.screenshot({ path: 'scratch/live-mobile.png', fullPage: true });
  await browser.close();
  console.log('LIVE SHOTS DONE');
})();
