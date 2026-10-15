const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();

  // --- Custom draw: user path (featured card -> WC showcase -> CUSTOM DRAW) ---
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1200);
  await page.evaluate(() => { document.querySelector('.home-comp-card[data-tourn="wc"]')?.click(); });
  await page.waitForTimeout(900);
  const showcase = await page.evaluate(() => ({
    simTitle: document.getElementById('active-tourn-title')?.textContent,
    hasDrawBtn: !!document.getElementById('btn-wc-custom-draw'),
    btnText: document.getElementById('btn-wc-custom-draw')?.textContent.trim(),
  }));
  console.log('WC showcase:', JSON.stringify(showcase));
  await page.evaluate(() => document.getElementById('btn-wc-custom-draw')?.click());
  await page.waitForTimeout(800);
  const modal1 = await page.evaluate(() => {
    const modal = document.getElementById('wc-draw-modal');
    const grid = document.getElementById('wc-draw-grid');
    const count = document.getElementById('wc-draw-selected-count')?.textContent;
    const startDisabled = document.getElementById('wc-draw-btn-start')?.disabled;
    return { open: modal && !modal.hidden, nationCards: grid?.children.length, selected: count, startDisabled,
      prefill: { uefa: document.getElementById('pill-uefa')?.textContent, caf: document.getElementById('pill-caf')?.textContent } };
  });
  console.log('draw modal fresh:', JSON.stringify(modal1));

  // Pick 2 nations to test selection counting, then REAL preset then CLEAR
  await page.evaluate(() => {
    const cards = [...document.querySelectorAll('#wc-draw-grid .wc-draw-nation-card, #wc-draw-grid > *')];
    cards.slice(0, 2).forEach(c => c.click());
  });
  await page.waitForTimeout(300);
  const sel2 = await page.evaluate(() => ({ selected: document.getElementById('wc-draw-selected-count')?.textContent }));
  console.log('after 2 clicks selected:', JSON.stringify(sel2));
  await page.evaluate(() => document.getElementById('wc-draw-btn-reset')?.click());
  await page.waitForTimeout(200);
  const sel0 = await page.evaluate(() => ({ selected: document.getElementById('wc-draw-selected-count')?.textContent, startDisabled: document.getElementById('wc-draw-btn-start')?.disabled }));
  console.log('after CLEAR:', JSON.stringify(sel0));

  // REAL 2026 preset + launch
  await page.evaluate(() => document.getElementById('wc-draw-preset-real')?.click());
  await page.waitForTimeout(500);
  const sel48 = await page.evaluate(() => ({ selected: document.getElementById('wc-draw-selected-count')?.textContent, startDisabled: document.getElementById('wc-draw-btn-start')?.disabled }));
  console.log('after REAL 2026:', JSON.stringify(sel48));
  await page.evaluate(() => document.getElementById('wc-draw-btn-start')?.click());
  await page.waitForTimeout(1500);
  const launched = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('arena_tournament_state_wc') || 'null');
    const letters = saved?.groups ? Object.keys(saved.groups) : [];
    const names = letters.flatMap(l => saved.groups[l].map(t => t.name));
    return { letters: letters.length, perGroup: [...new Set(letters.map(l => saved.groups[l].length))].join(','), uniqueTeams: new Set(names).size, totalTeams: names.length, modalHidden: document.getElementById('wc-draw-modal').hidden, simVisible: !document.getElementById('view-tournament-sim')?.hidden };
  });
  console.log('custom draw launched:', JSON.stringify(launched));

  // close + reopen modal (dismissability)
  await page.evaluate(() => { document.getElementById('btn-wc-custom-draw')?.click(); });
  await page.waitForTimeout(400);
  const reopen = await page.evaluate(() => ({ open: !document.getElementById('wc-draw-modal')?.hidden }));
  await page.evaluate(() => { document.getElementById('wc-draw-close')?.click(); });
  await page.waitForTimeout(300);
  const closed = await page.evaluate(() => ({ open: !document.getElementById('wc-draw-modal')?.hidden }));
  console.log('modal reopen -> close:', JSON.stringify(reopen), '->', JSON.stringify(closed));

  // Escape key dismiss
  await page.evaluate(() => { document.getElementById('btn-wc-custom-draw')?.click(); });
  await page.waitForTimeout(300);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const escClosed = await page.evaluate(() => !document.getElementById('wc-draw-modal')?.hidden);
  console.log('esc closed modal?', escClosed);
  console.log('DRAW PAGE ERRORS:', errors.length ? errors : 'none');
  await page.close();

  // --- Responsive re-sweep ---
  for (const w of [1440, 1280, 1024, 768, 390, 375]) {
    const p = await browser.newPage({ viewport: { width: w, height: 900 } });
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 45000 });
    await p.waitForTimeout(900);
    const m = await p.evaluate(() => {
      const gc = (el, prop) => el ? getComputedStyle(el).getPropertyValue(prop) : null;
      const shell = document.querySelector('.home-shell');
      const pillars = document.querySelector('.home-pillars-grid');
      const comps = document.querySelector('.home-comp-grid');
      const compSection = document.querySelector('.home-competitions-section');
      const nav = document.querySelector('.top-nav');
      const right = document.querySelector('.header-right');
      return {
        hOverflow: document.documentElement.scrollWidth > window.innerWidth,
        shellW: shell ? Math.round(shell.getBoundingClientRect().width) : null,
        pillarCols: pillars ? gc(pillars, 'grid-template-columns').split(' ').length : null,
        compCols: comps ? gc(comps, 'grid-template-columns').split(' ').length : null,
        compSectionTop: compSection ? Math.round(compSection.getBoundingClientRect().top) : null,
        h1: gc(document.querySelector('.home-hero-title'), 'font-size'),
        navFont: gc(document.querySelector('.top-nav-link'), 'font-size'),
        audioVisible: (() => { const a = document.getElementById('audio-toggle'); if (!a) return 'none'; const r = a.getBoundingClientRect(); return r.width > 0 && r.height > 0; })(),
        navBelowRight: nav && right ? nav.getBoundingClientRect().top >= right.getBoundingClientRect().top : null,
      };
    });
    console.log(w + ':', JSON.stringify(m), errs.length ? 'ERR:' + errs[0] : '');
    await p.screenshot({ path: `scratch/final-${w}.png` });
    await p.close();
  }

  await browser.close();
  console.log('DRAW+RESPONSIVE PROBE DONE');
})();
