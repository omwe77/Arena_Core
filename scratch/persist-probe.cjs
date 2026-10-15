const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1000);
  await page.evaluate(() => localStorage.removeItem('arena_tournament_state_wc'));
  await page.evaluate(() => { document.querySelector('.top-nav-link[data-nav="tournament-sim"]')?.click(); });
  await page.waitForTimeout(600);

  await page.locator('#sim-instant-btn').click();
  let settled = false;
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(500);
    const st = await page.evaluate(() => ({
      champ: !document.getElementById('champion-banner')?.hidden,
      running: /RUNNING/.test(document.getElementById('sim-stage-action-btn')?.textContent || ''),
    }));
    if (st.champ && !st.running) { settled = true; break; }
  }
  console.log('sim settled + champion:', settled);
  await page.waitForTimeout(1000);

  const saved1 = await page.evaluate(() => JSON.parse(localStorage.getItem('arena_tournament_state_wc') || 'null'));
  console.log('BEFORE reload → groupsPlayed:', saved1?.groupsPlayed, '| champion:', saved1?.champion, '| gf simulated:', saved1?.gf?.filter(m => m.isSimulated).length);

  // Reload and check restoration
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1500);
  const saved2 = await page.evaluate(() => JSON.parse(localStorage.getItem('arena_tournament_state_wc') || 'null'));
  const champBanner = await page.evaluate(() => {
    document.querySelector('.top-nav-link[data-nav="tournament-sim"]')?.click();
    return !document.getElementById('champion-banner')?.hidden;
  });
  await page.waitForTimeout(1200);
  const champAfterReload = await page.evaluate(() => (!document.getElementById('champion-banner')?.hidden) ? document.getElementById('champion-team-name')?.textContent.trim() : 'hidden');
  const bannerAfterNav = await page.evaluate(() => (!document.getElementById('champion-banner')?.hidden) ? document.getElementById('champion-team-name')?.textContent.trim() : 'hidden');
  const groupsPlayedAfterNav = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('arena_tournament_state_wc') || 'null');
    return saved?.groupsPlayed;
  });
  console.log('AFTER reload → champion:', saved2?.champion, '| groupsPlayed:', groupsPlayedAfterNav, '| banner after reaload+simnav:', typeof flagB !== 'undefined' ? '' : '', bannerAfterNav, '| simnav banner:', champAfterReload);
  console.log('ERRORS:', errors.length ? errors.slice(0, 6) : 'none');
  await browser.close();
  console.log('PERSIST PROBE DONE');
})();
