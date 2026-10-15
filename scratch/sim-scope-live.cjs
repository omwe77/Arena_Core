const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1000);

  const groupPlayedState = () => page.evaluate(() => {
    return [...document.querySelectorAll('#groups-grid-container .group-card')].map(c => ({
      g: c.querySelector('.group-title span')?.textContent.replace('GROUP', '').trim().slice(0, 2),
      played: !!c.querySelector('.group-status-done'),
      mp: [...c.querySelectorAll('tbody tr')].map(tr => parseInt(tr.children[2].textContent, 10) || 0).reduce((a, b) => a + b, 0),
    }));
  });

  // --- 1. Groups tab, simulate ONLY group B with a real click ---
  await page.evaluate(() => localStorage.removeItem('arena_tournament_state_wc'));
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await page.click('.top-nav-link[data-nav="tournament-sim"]');
  await page.waitForTimeout(600);
  await page.evaluate(() => { document.querySelector('.bracket-tab[data-stage="groups"]')?.click(); });
  await page.waitForTimeout(700);

  const btnB = page.locator('.btn-quick-group-sim[data-group="B"]').first();
  await btnB.click();
  await page.waitForTimeout(600);
  const g1 = await groupPlayedState();
  console.log('after group B sim:', JSON.stringify(g1));

  // --- 2. Play remaining groups individually, then r32 single match ---
  const remaining = await page.evaluate(() => {
    const pending = document.querySelectorAll('#groups-grid-container .btn-quick-group-sim');
    const letters = [...pending].map(b => b.dataset.group);
    return letters;
  });
  console.log('remaining groups pending:', remaining.join(','));
  for (const letter of remaining) {
    await page.locator(`.btn-quick-group-sim[data-group="${letter}"]`).first().click();
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(600);

  // Go to ROUND OF 32 tab
  await page.evaluate(() => { document.querySelector('.bracket-tab[data-stage="r32"]')?.click(); });
  await page.waitForTimeout(900);
  const controls = await page.evaluate(() => ({
    fast: [...document.querySelectorAll('.btn-card-fast-sim')].length,
    track: [...document.querySelectorAll('.btn-sim-single')].length,
    quickActions: [...document.querySelectorAll('.btn-stage-quick-action')].map(b => b.textContent.trim()).slice(0, 3),
  }));
  console.log('R32 controls after groups complete:', JSON.stringify(controls));

  const simCount = () => page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('arena_tournament_state_wc') || '{}');
    return saved.r32 ? saved.r32.filter(m => m.isSimulated).length : -1;
  });
  const count0 = await simCount();
  // Click the FIRST card's Simulate
  const fast = page.locator('.btn-card-fast-sim').first();
  if (await fast.count()) {
    await fast.click();
    await page.waitForTimeout(4000);
    const count1 = await simCount();
    console.log('R32 simulated count: before', count0, '→ after ONE card Simulate:', count1);
    // Click a second card's Simulate
    const second = page.locator('.btn-card-fast-sim').nth(1);
    if (await second.count()) {
      await second.click();
      await page.waitForTimeout(4000);
      console.log('R32 after TWO sims:', await simCount());
    }
  } else {
    console.log('no per-card fast sim buttons visible');
  }

  console.log('ERRORS:', errors.length ? errors.slice(0, 10) : 'none');
  await browser.close();
  console.log('SIM SCOPE LIVE DONE');
})();
