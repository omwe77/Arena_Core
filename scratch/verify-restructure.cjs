const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text().slice(0, 80)); });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1200);

  // 1) Nav tab inventory
  const tabs = await page.evaluate(() => [...document.querySelectorAll('.top-nav-link')].map(b => b.dataset.nav));
  console.log('nav tabs:', tabs.join(','));

  // 2) Competitions view
  await page.evaluate(() => { document.querySelector('.top-nav-link[data-nav="competitions-view"]')?.click(); });
  await page.waitForTimeout(900);
  const viewInfo = await page.evaluate(() => {
    const panel = document.getElementById('view-competitions-view');
    const cards = [...document.querySelectorAll('#competitions-grid .archive-card')];
    const boards = cards.slice(0, 3).map(c => ({
      title: c.querySelector('.archive-card-title')?.textContent,
      boards: [...c.querySelectorAll('.archive-section-title')].map(t => t.textContent.trim()),
      assistRows: [...c.querySelectorAll('.archive-assists-val')].slice(0, 2).map(v => v.textContent.trim()),
    }));
    return { panelVisible: panel && !panel.hidden, cardCount: cards.length, boards };
  });
  console.log('competitions view:', JSON.stringify(viewInfo, null, 1));
  await page.screenshot({ path: 'scratch/competitions-view.png' });

  // Card is actionable: click Premier League card -> showcase
  await page.evaluate(() => {
    const card = [...document.querySelectorAll('.archive-card')].find(c => /premier/i.test(c.textContent));
    card?.click();
  });
  await page.waitForTimeout(900);
  const afterCardClick = await page.evaluate(() => ({
    view: [...document.querySelectorAll('.view-panel')].find(x => !x.hidden)?.id,
    compName: document.getElementById('comp-current-name')?.textContent,
  }));
  console.log('after PL card click:', JSON.stringify(afterCardClick));

  // Deep link /archive still works
  await page.goto('http://localhost:5173/#/archive', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const deepLink = await page.evaluate(() => [...document.querySelectorAll('.view-panel')].find(x => !x.hidden)?.id);
  console.log('deep link /#/archive →', deepLink);

  // 3) WC sim-scoping regression: groups B only, then knockout fixtures exist without re-sim
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await page.evaluate(() => localStorage.removeItem('arena_tournament_state_wc'));
  await page.evaluate(() => { document.querySelector('.top-nav-link[data-nav="tournament-sim"]')?.click(); });
  await page.waitForTimeout(700);
  await page.evaluate(() => { document.querySelector('.bracket-tab[data-stage="groups"]')?.click(); });
  await page.waitForTimeout(600);
  await page.locator('.btn-quick-group-sim[data-group="B"]').first().click();
  await page.waitForTimeout(500);
  const g1 = await page.evaluate(() => [...document.querySelectorAll('#groups-grid-container .group-card')].slice(0, 3).map(c => ({
    g: c.querySelector('.group-title span')?.textContent.replace('GROUP', '').trim().slice(0, 2),
    chip: c.querySelector('.group-status-done')?.textContent.trim() || null,
    mpSum: [...c.querySelectorAll('tbody tr')].map(tr => parseInt(tr.children[2].textContent, 10) || 0).reduce((a, b) => a + b, 0),
  })));
  console.log('single group after fix:', JSON.stringify(g1));

  // Play ALL remaining groups
  for (const letter of await page.evaluate(() => [...document.querySelectorAll('.btn-quick-group-sim')].map(b => b.dataset.group))) {
    await page.locator(`.btn-quick-group-sim[data-group="${letter}"]`).first().click();
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(800);
  const r32Ready = await page.evaluate(() => {
    document.querySelector('.bracket-tab[data-stage="r32"]')?.click();
    return null;
  }).then(() => page.evaluate(() => ({
    hasFixtures: document.querySelectorAll('#bracket-tree-container .bracket-match-card').length,
    fastSimButtons: document.querySelectorAll('.btn-card-fast-sim').length,
    pendingBanner: !!document.querySelector('.stage-pending-banner'),
  })));
  console.log('r32 after all groups hand-played:', JSON.stringify(r32Ready));
  await page.screenshot({ path: 'scratch/r32-after-hand-groups.png' });

  console.log('ERRORS:', errors.length ? errors.slice(0, 8) : 'none');
  await browser.close();
  console.log('RESTRUCTURE VERIFY DONE');
})();
