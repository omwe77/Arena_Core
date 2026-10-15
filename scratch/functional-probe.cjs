const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE-ERR: ' + m.text()); });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1200);

  const dump = () => page.evaluate(() => ({
    view: [...document.querySelectorAll('.view-panel')].find(x => !x.hidden)?.id,
    activeNav: document.querySelector('.top-nav-link.active')?.dataset.nav,
    champ: !document.getElementById('champion-banner')?.hidden ? document.getElementById('champion-team-name')?.textContent.trim() : null,
    stageBtn: document.getElementById('sim-stage-action-btn')?.textContent.trim(),
    groupsText: document.getElementById('groups-grid-container')?.innerText.replace(/\s+/g, ' ').slice(0, 180),
    ticker: document.getElementById('bracket-ticker-text')?.textContent.slice(0, 120),
  }));

  // --- WC full simulation end-to-end ---
  await page.evaluate(() => { document.querySelector('.top-nav-link[data-nav="tournament-sim"]')?.click(); });
  await page.waitForTimeout(800);
  console.log('after sim nav:', JSON.stringify(await dump()));
  await page.locator('#sim-instant-btn').click();
  await page.waitForTimeout(3000);
  const afterFull = await dump();
  console.log('after FULL SIM:', JSON.stringify(afterFull));

  // Groups integrity: count of groups, teams per group
  const groupAudit = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('#groups-grid-container .group-card, #groups-grid-container .tech-card')];
    return { cards: cards.length, sample: cards[0]?.innerText.replace(/\s+/g, ' ').slice(0, 200) };
  });
  console.log('group audit:', JSON.stringify(groupAudit));

  // Reset behaviour: the RESET button should clear the sim
  await page.locator('#sim-draw-btn').click();
  await page.waitForTimeout(1200);
  console.log('after RESET:', JSON.stringify(await dump()));

  // --- Custom draw modal ---
  await page.evaluate(() => {
    // reach a competition showcase then open custom draw
    const td = document.getElementById('wc-draw-modal');
    return td ? td.hidden : 'no modal';
  });
  // Find how the draw opens: likely a button on WC home subview
  const drawOpen = await page.evaluate(() => {
    const btn = document.getElementById('btn-custom-draw') || document.querySelector('[id*="custom-draw-open"], [class*="custom-draw-trigger"]');
    return btn ? btn.id || btn.className : 'no button found';
  });
  console.log('custom draw trigger:', drawOpen);
  const anyDrawBtns = await page.evaluate(() => {
    return [...document.querySelectorAll('[id^="btn-"], button')].filter(b => /custom|draw/i.test((b.id || '') + (b.textContent || ''))).map(b => ({ id: b.id, txt: b.textContent.trim().slice(0, 40), visible: !!b.offsetParent }));
  });
  console.log('draw-ish buttons:', JSON.stringify(anyDrawBtns.slice(0, 12)));

  // --- Competitions nav (archive) then back ---
  await page.evaluate(() => { document.querySelector('.top-nav-link[data-nav="competitions-view"]')?.click(); });
  await page.waitForTimeout(800);
  console.log('Comp nav ->', JSON.stringify((await dump()).view));
  await page.evaluate(() => { document.querySelector('.top-nav-link[data-nav="tournament-home"]')?.click(); });
  await page.waitForTimeout(800);
  console.log('Home nav ->', JSON.stringify((await dump()).view));

  // --- Sound toggle click ---
  const audioBefore = await page.evaluate(() => document.getElementById('audio-label')?.textContent);
  await page.locator('#audio-toggle').click();
  await page.waitForTimeout(300);
  const audioAfter = await page.evaluate(() => document.getElementById('audio-label')?.textContent);
  console.log('audio toggle:', audioBefore, '->', audioAfter);

  console.log('ERRORS:', errors.length ? errors.slice(0, 10) : 'none');
  await browser.close();
  console.log('FUNCTIONAL PROBE DONE');
})();
