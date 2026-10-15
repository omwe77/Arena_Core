const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  const visiblePanel = () =>
    page.evaluate(() => {
      const p = [...document.querySelectorAll('.view-panel')].find(x => !x.hidden);
      return p ? p.id : 'none';
    });

  console.log('Start view:', await visiblePanel());

  // 1. Home -> featured competition card goes to its tournament home
  await page.evaluate(() => document.querySelector('.home-comp-card')?.click());
  await page.waitForTimeout(500);
  console.log('After comp card click (expect tournament sim panel showing tourn home):', await visiblePanel());

  // 2. Switch tournament via dropdown while on that tournament page
  //    Need to be inside a tournament context: the dropdown is contextual.
  const hasDropdown = await page.evaluate(() => !!document.getElementById('comp-dropdown-trigger'));
  console.log('comp-dropdown present:', hasDropdown);

  if (hasDropdown) {
    await page.evaluate(() => {
      const trigger = document.getElementById('comp-dropdown-trigger');
      trigger.click();
    });
    await page.waitForTimeout(300);
    const options = await page.evaluate(() =>
      [...document.querySelectorAll('.comp-option')].map(o => o.dataset.tourn)
    );
    console.log('Dropdown options:', options.join(','));

    // Pick a tournament different from the current one
    await page.evaluate(() => {
      const opts = [...document.querySelectorAll('.comp-option')];
      const current = opts.find(o => o.getAttribute('aria-selected') === 'true');
      const target = opts.find(o => o !== current);
      target.click();
    });
    await page.waitForTimeout(600);
    console.log('After dropdown switch (tourn panel must stay visible):', await visiblePanel());

    // Verify visible panel belongs to the newly selected tournament:
    const state = await page.evaluate(() => {
      const theme = document.body.getAttribute('data-theme');
      const panel = [...document.querySelectorAll('.view-panel')].find(x => !x.hidden);
      const heading = panel?.querySelector('h1, h2, .sim-breadcrumb-title, .tourn-hero-title')?.textContent?.trim() || '';
      return { theme, panel: panel?.id, heading: heading.slice(0, 60) };
    });
    console.log('State:', JSON.stringify(state));
  }

  // 3. Number-key shortcut: select first tournament (wc), then '5' (pl)
  await page.keyboard.press('5');
  await page.waitForTimeout(600);
  const afterKey = await page.evaluate(() => ({
    panel: [...document.querySelectorAll('.view-panel')].find(x => !x.hidden)?.id,
    theme: document.body.getAttribute('data-theme'),
  }));
  console.log('After pressing "5" (expect tournament panel + theme pl):', JSON.stringify(afterKey));

  console.log('PAGE ERRORS:', errors.length ? errors.slice(0, 5) : 'none');
  await page.screenshot({ path: 'scratch/tourn-switch.png', fullPage: false });
  await browser.close();
  console.log('E2E DONE');
})();
