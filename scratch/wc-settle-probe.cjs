const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1000);

  // Fresh state: clear saved WC state first
  await page.evaluate(() => localStorage.removeItem('arena_tournament_state_wc'));
  await page.evaluate(() => { document.querySelector('.top-nav-link[data-nav="tournament-sim"]')?.click(); });
  await page.waitForTimeout(600);

  await page.locator('#sim-instant-btn').click();

  // Poll until stage button lands on completed or champion banner shown, max 20s
  let settled = false;
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(500);
    const st = await page.evaluate(() => ({
      btn: document.getElementById('sim-stage-action-btn')?.textContent.trim(),
      champ: !document.getElementById('champion-banner')?.hidden,
      running: /RUNNING/.test(document.getElementById('sim-stage-action-btn')?.textContent || ''),
    }));
    if (st.champ && !st.running) { settled = true; break; }
  }
  console.log('settled:', settled);
  await page.waitForTimeout(1500);

  const allView = await page.evaluate(() => {
    const grid = document.getElementById('groups-grid-container');
    return { hidden: grid?.hidden, text: grid && !grid.hidden ? grid.innerText.replace(/\s+/g, ' ').slice(0, 160) : '(hidden)' };
  });
  console.log('ALL tab groups container:', JSON.stringify(allView));

  // R32 sample results
  const r32 = await page.evaluate(() => {
    document.querySelector('.bracket-tab[data-stage="r32"]')?.click();
    return true;
  });
  await page.waitForTimeout(500);
  const r32text = await page.evaluate(() => document.getElementById('bracket-tree-container')?.innerText.replace(/\s+/g, ' ').slice(0, 150));
  console.log('R32:', r32text);

  // localStorage after settle
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('arena_tournament_state_wc') || 'null'));
  console.log('SAVED groupsPlayed:', saved?.groupsPlayed, '| champion:', saved?.champion, '| r32 len:', saved?.r32?.length, '| sim r32:', saved?.r32?.filter(m => m.isSimulated).length);

  console.log('ERRORS:', errors.length ? errors.slice(0, 6) : 'none');
  await browser.close();
  console.log('SETTLE PROBE DONE');
})();
