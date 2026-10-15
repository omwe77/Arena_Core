const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1200);

  // Select Premier League via featured card, then standings view
  await page.evaluate(() => { document.querySelector('.home-comp-card[data-tourn="pl"]')?.click(); });
  await page.waitForTimeout(900);
  await page.evaluate(() => { document.querySelector('.top-nav-link[data-nav="standings-view"]')?.click(); });
  await page.waitForTimeout(900);
  const st = await page.evaluate(() => ({
    banner: document.getElementById('standings-banner-title')?.textContent,
    backLabel: (() => { const w = document.getElementById('standings-laliga-back'); return w && !w.hidden ? w.querySelector('span')?.textContent : 'hidden'; })(),
    seasonBadge: document.getElementById('hero-season-badge')?.textContent,
    tableTitle: document.getElementById('standings-table-title')?.textContent,
    scorers: document.getElementById('top-scorers-list')?.children.length,
  }));
  console.log('PL standings view:', JSON.stringify(st));

  // Back button returns to PL showcase
  await page.evaluate(() => document.getElementById('btn-standings-back-laliga')?.click());
  await page.waitForTimeout(900);
  const afterBack = await page.evaluate(() => ({
    view: [...document.querySelectorAll('.view-panel')].find(x => !x.hidden)?.id,
  }));
  console.log('after back:', JSON.stringify(afterBack));

  // World Cup standings → knockout message (no back button)
  await page.evaluate(() => { document.querySelector('.home-comp-card[data-tourn="wc"]')?.click?.(); });
  await page.waitForTimeout(500);
  await page.evaluate(() => { document.querySelector('.top-nav-link[data-nav="product-home"], .top-nav-link[data-nav="tournament-home"]')?.click(); });
  await page.waitForTimeout(500);
  await page.evaluate(() => { document.querySelector('.top-nav-link[data-nav="standings-view"]')?.click(); });
  await page.waitForTimeout(900);
  const wcSt = await page.evaluate(() => ({
    banner: document.getElementById('standings-banner-title')?.textContent,
    backLabel: (() => { const w = document.getElementById('standings-laliga-back'); return w && !w.hidden ? w.querySelector('span')?.textContent : 'hidden'; })(),
    emptyStateVisible: document.getElementById('standings-table-body')?.innerText.slice(0, 80),
  }));
  console.log('WC standings view:', JSON.stringify(wcSt));
  await browser.close();
  console.log('STANDINGS PROBE DONE');
})();
