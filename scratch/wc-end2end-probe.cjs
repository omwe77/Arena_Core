const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1200);

  // Navigate: simulator
  await page.evaluate(() => { document.querySelector('.top-nav-link[data-nav="tournament-sim"]')?.click(); });
  await page.waitForTimeout(800);

  // FULL SIM
  await page.locator('#sim-instant-btn').click();
  await page.waitForTimeout(3500);

  // 1) DOM group card values after full sim
  const domGroups = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('#groups-grid-container .group-card, #groups-grid-container .tech-card')];
    return cards.slice(0, 3).map(c => c.innerText.replace(/\s+/g, ' ').slice(0, 220));
  });
  console.log('DOM group cards after FULL SIM:', JSON.stringify(domGroups, null, 1));

  // 2) Internal state
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('arena_tournament_state_wc') || 'null'));
  if (saved) {
    const gA = saved.groups?.['A'];
    console.log('STATE groupsPlayed:', saved.groupsPlayed, '| champion:', saved.champion, '| group A:', JSON.stringify(gA));
    console.log('STATE stage sizes:', ['groupMatches', 'r32', 'r16', 'qf', 'sf', 'gf'].map(k => saved[k] ? saved[k].length : 'undef').join(','));
    const simM = (saved.groupMatches || []).flat().filter(m => m.isSimulated).length;
    console.log('STATE simulated group matches:', simM);
  } else { console.log('STATE: none'); }

  // 3) switch to GROUPS stage tab and re-render — do values appear?
  await page.evaluate(() => {
    const tab = document.querySelector('.bracket-tab[data-stage="groups"]');
    if (tab) tab.click();
  });
  await page.waitForTimeout(700);
  const domGroups2 = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('#groups-grid-container .group-card, #groups-grid-container .tech-card')];
    return cards.slice(0, 2).map(c => c.innerText.replace(/\s+/g, ' ').slice(0, 200));
  });
  console.log('DOM group cards on GROUPS tab after FULL SIM:', JSON.stringify(domGroups2, null, 1));

  // 4) R32 bracket populated?
  await page.evaluate(() => { const t = document.querySelector('.bracket-tab[data-stage="r32"]'); if (t) t.click(); });
  await page.waitForTimeout(700);
  const r32text = await page.evaluate(() => document.getElementById('bracket-tree-container')?.innerText.replace(/\s+/g, ' ').slice(0, 240));
  console.log('R32 bracket:', r32text);

  // --- Custom Draw flow ---
  await page.evaluate(() => { const t = document.querySelector('.bracket-tab[data-stage="groups"]'); if (t) t.click(); });
  await page.waitForTimeout(300);
  // Go to WC home subview via back button (btn-back-to-comp-home in context bar)
  const backBtn = await page.evaluate(() => { const b = document.getElementById('btn-back-to-comp-home'); if (b) { b.click(); return 'clicked'; } return 'missing'; });
  console.log('back to comp home:', backBtn);
  await page.waitForTimeout(700);
  const drawBtn = await page.evaluate(() => { const b = document.getElementById('btn-wc-custom-draw'); if (b) { b.click(); return b.textContent.trim(); } return 'missing'; });
  console.log('custom draw btn:', drawBtn);
  await page.waitForTimeout(600);
  const modalState = await page.evaluate(() => {
    const modal = document.getElementById('wc-draw-modal');
    const grid = document.getElementById('wc-draw-grid');
    return { hidden: !!modal?.hidden, nationCards: grid ? grid.children.length : 0, selected: document.getElementById('wc-draw-selected-count')?.textContent };
  });
  console.log('draw modal:', JSON.stringify(modalState));

  // Use REAL 2026 preset, launch, verify groups
  await page.locator('#wc-draw-preset-real').click();
  await page.waitForTimeout(400);
  const cnt = await page.evaluate(() => document.getElementById('wc-draw-selected-count')?.textContent);
  console.log('after REAL preset selected:', cnt);
  const startDisabled = await page.locator('#wc-draw-btn-start').isDisabled();
  console.log('launch disabled?', startDisabled);
  if (!startDisabled) {
    await page.locator('#wc-draw-btn-start').click();
    await page.waitForTimeout(2000);
    const afterDraw = await page.evaluate(() => {
      const saved = JSON.parse(localStorage.getItem('arena_tournament_state_wc') || 'null');
      const letters = saved?.groups ? Object.keys(saved.groups) : [];
      const sizes = letters.map(l => saved.groups[l].length);
      // uniqueness check
      const names = letters.flatMap(l => saved.groups[l].map(t => t.name));
      return { letters: letters.length, sizes: sizes.join(','), unique: new Set(names).size, total: names.length, modalHidden: document.getElementById('wc-draw-modal').hidden };
    });
    console.log('custom draw result:', JSON.stringify(afterDraw));
    // LAUNCH knockout sim quickly
    await page.locator('#sim-stage-action-btn').click();
    await page.waitForTimeout(1500);
    const stageBtn2 = await page.evaluate(() => document.getElementById('sim-stage-action-btn')?.textContent.trim());
    console.log('after group stage sim, stage button:', stageBtn2);
  }

  console.log('ERRORS:', errors.length ? errors.slice(0, 6) : 'none');
  await browser.close();
  console.log('WC E2E PROBE DONE');
})();
