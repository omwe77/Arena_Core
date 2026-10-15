const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1000);

  // Fresh WC state
  await page.evaluate(() => { localStorage.removeItem('arena_tournament_state_wc'); });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.click('.top-nav-link[data-nav="tournament-sim"]');
  await page.waitForTimeout(700);
  await page.evaluate(() => { document.querySelector('.bracket-tab[data-stage="groups"]')?.click(); });
  await page.waitForTimeout(600);

  // 1) Simulate ONE group only
  const before = await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('arena_tournament_state_wc') || '{}');
    return s.groups ? Object.fromEntries(Object.entries(s.groups).map(([l, arr]) => [l, arr.map(t => t.mp)])) : {};
  });
  await page.evaluate(() => {
    const btn = document.querySelector('#groups-grid-container .btn-quick-group-sim[data-group="A"]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(1500);
  const simState = await page.evaluate(() => {
    const s = tournamentState && typeof tournamentState !== 'undefined' ? tournamentState : null;
    return null;
  }).catch(() => null);
  const stateAfter = await page.evaluate(() => {
    // tournamentState is inside the IIFE; read from rendered DOM instead
    const groupCards = [...document.querySelectorAll('#groups-grid-container .group-card')];
    return groupCards.map(c => ({
      title: c.querySelector('.group-title span')?.textContent.trim().slice(0, 12),
      played: !!c.querySelector('.group-status-done'),
      mpSum: [...c.querySelectorAll('tbody tr')].map(tr => tr.children[2].textContent.trim()).join(','),
    }));
  });
  console.log('GROUP A sim -> all groups render state:');
  console.log(JSON.stringify(stateAfter, null, 1));
  const playedCount = stateAfter.filter(g => g.played).length;
  console.log('groups now marked PLAYED:', playedCount, 'of', stateAfter.length);

  // 2) Now simulate remaining groups via the summary hub "SIMULATE ALL 12 GROUPS"? No — test single-match in knockout:
  // Play the remaining 11 groups through individual sim buttons (legit way) then check knockout single behavior.
  await page.evaluate(() => {
    document.querySelectorAll('#groups-grid-container .btn-quick-group-sim').forEach(b => b.click());
  });
  await page.waitForTimeout(1200);
  // groups all played -> groupsPlayed; go to r32 tab
  await page.evaluate(() => { document.querySelector('.bracket-tab[data-stage="r32"]')?.click(); });
  await page.waitForTimeout(800);
  // Click ONE match's Kick off / simulate (btn-sim-single on card 0)
  const cardBtns = await page.evaluate(() => ({
    simSingle: document.querySelectorAll('.btn-card-fast-sim').length,
    track: document.querySelectorAll('.btn-sim-single').length,
    stageQuick: [...document.querySelectorAll('.btn-stage-quick-action')].map(b => ({ cls: b.className, stage: b.dataset.stage, txt: b.textContent.trim().slice(0, 30) })).slice(0, 4),
  }));
  console.log('R32 controls:', JSON.stringify(cardBtns));
  const matchStateBefore = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('arena_tournament_state_wc') || '{}');
    return saved.r32 ? saved.r32.filter(m => m.isSimulated).length : -1;
  });
  await page.evaluate(() => {
    const b = document.querySelector('.btn-card-fast-sim');
    if (b) b.click();
  });
  await page.waitForTimeout(2500);
  const matchStateAfter = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('arena_tournament_state_wc') || '{}');
    return saved.r32 ? saved.r32.filter(m => m.isSimulated).length : -1;
  });
  console.log('R32 simulated matches: before', matchStateBefore, '→ after ONE fast sim + settle:', matchStateAfter);
  await page.waitForTimeout(4000);
  const afterLong = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('arena_tournament_state_wc') || 'null') || {};
    return saved.r32 ? saved.r32.filter(m => m.isSimulated).length : -1;
  });
  console.log('R32 simulated matches after longer wait:', afterLong);

  console.log('ERRORS:', errors.length ? errors.slice(0, 8) : 'none');
  await browser.close();
  console.log('SIM SCOPE PROBE DONE');
})();
