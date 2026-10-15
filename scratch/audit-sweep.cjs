const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const errors = [];

  // --- Desktop sweep of all views ---
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE-ERR: ' + m.text()); });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1500);

  // Homepage metrics
  const home = await page.evaluate(() => {
    const out = {};
    const hero = document.querySelector('.home-shell');
    if (hero) {
      const r = hero.getBoundingClientRect();
      out.shellWidth = Math.round(r.width);
      out.heroH = document.querySelector('.home-hero')?.getBoundingClientRect().height;
      out.gapHeroActions = (() => {
        const h = document.querySelector('.home-hero');
        const a = document.querySelector('.home-actions');
        if (!h || !a) return null;
        return Math.round(a.getBoundingClientRect().top - h.getBoundingClientRect().bottom);
      })();
    }
    const pitch = document.querySelector('.header-pitch-track');
    out.pitchTrackVisible = pitch ? getComputedStyle(pitch).display !== 'none' : false;
    out.pitchTrackH = pitch ? Math.round(pitch.getBoundingClientRect().height) : 0;
    out.headerH = Math.round(document.querySelector('.site-header')?.getBoundingClientRect().height || 0);
    out.columns = getComputedStyle(document.querySelector('.home-pillars-grid') || document.body).gridTemplateColumns;
    out.bodyScrollW = document.documentElement.scrollWidth;
    out.winW = window.innerWidth;
    out.hOverflow = document.documentElement.scrollWidth > window.innerWidth;
    out.heroSubTitle = document.querySelector('.home-hero-sub-title')?.textContent || null;
    const h1 = document.querySelector('.home-hero-title');
    out.h1font = h1 ? getComputedStyle(h1).fontSize + '/' + getComputedStyle(h1).fontFamily : null;
    out.pillars = [...document.querySelectorAll('.home-pillar-card')].map(c => {
      const r = c.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), clip: c.scrollHeight > c.clientHeight + 2 };
    });
    const comps = [...document.querySelectorAll('.home-comp-card')];
    out.compCards = comps.length;
    const firstPillarTop = Math.round(document.querySelector('.home-pillars-grid')?.getBoundingClientRect().top || 0);
    const compTop = Math.round(document.querySelector('.home-competitions-section')?.getBoundingClientRect().top || 0);
    out.firstViewport = { pillarsTop: firstPillarTop, compSectionTop: compTop };
    out.navLinks = [...document.querySelectorAll('.top-nav-link')].map(n => n.textContent.trim());
    return out;
  });
  console.log('HOME metrics:', JSON.stringify(home, null, 1));
  await page.screenshot({ path: 'scratch/audit-home-1440.png', fullPage: true });

  // Featured competition name / count check
  const compsTxt = await page.evaluate(() =>
    [...document.querySelectorAll('.home-comp-card')].map(c => c.textContent.trim().replace(/\s+/g, ' ')));
  console.log('FEATURED comps:', JSON.stringify(compsTxt, null, 1));

  // View navigation
  const navs = [
    ['competition', 'Competitions'],
    ['tournament-sim', 'Simulator'],
    ['standings-view', 'Standings'],
    ['archive-view', 'Archive'],
    ['analytics-view', 'Analytics'],
  ];
  for (const [nav, name] of navs) {
    await page.evaluate(id => { document.querySelector('.top-nav-link[data-nav="' + id + '"]')?.click(); }, nav);
    await page.waitForTimeout(1000);
    const v = await page.evaluate(() => {
      const p = [...document.querySelectorAll('.view-panel')].find(x => !x.hidden);
      return p ? p.id : 'NONE';
    });
    const backLabel = await page.evaluate(() => {
      const w = document.getElementById('standings-laliga-back');
      return w && !w.hidden ? w.querySelector('span')?.textContent : 'hidden';
    });
    const season = await page.evaluate(() => document.getElementById('hero-season-badge')?.textContent);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`NAV ${name} -> ${v} | laliga-back: ${backLabel} | season: ${season} | overflow: ${overflow}`);
    await page.screenshot({ path: `scratch/audit-${nav}-1440.png` });
  }

  // --- WC simulation smoke test ---
  await page.evaluate(() => { document.querySelector('.top-nav-link[data-nav="tournament-sim"]')?.click(); });
  await page.waitForTimeout(800);
  const wc = await page.evaluate(async () => {
    const t0 = performance.now();
    window.scrollTo(0, 0);
    const btn = document.getElementById('sim-stage-action-btn');
    return { btnText: btn?.textContent, disabled: btn?.disabled };
  });
  console.log('WC sim state:', JSON.stringify(wc));
  // Simulate all stages + full sim
  await page.locator('#sim-instant-btn').click();
  await page.waitForTimeout(2500);
  const wcAfter = await page.evaluate(() => {
    const groups = document.getElementById('groups-grid-container')?.innerText.slice(0, 120) || '';
    const champ = document.getElementById('champion-team-name')?.textContent || 'none';
    const banner = !document.getElementById('champion-banner')?.hidden;
    return { groups, champ, banner };
  });
  console.log('WC after FULL SIM:', JSON.stringify(wcAfter));
  await page.screenshot({ path: 'scratch/audit-wc-done-1440.png' });

  // --- Reset/restart determinism quick-check in page context ---
  const det = await page.evaluate(async () => {
    if (!window.runFullTournamentSimulation) return 'no api';
    return window.ArenaRandom ? typeof window.ArenaRandom === 'function' ? 'arena-random-fn' : 'arena-random-obj' : 'no prng';
  });
  console.log('PRNG api:', det);

  // --- Responsive sweep on homepage ---
  for (const w of [1280, 1024, 768, 390, 375]) {
    const p2 = await browser.newPage({ viewport: { width: w, height: 900 } });
    const errs2 = [];
    p2.on('pageerror', e => errs2.push(e.message));
    await p2.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 45000 });
    await p2.waitForTimeout(900);
    const m = await p2.evaluate(() => ({
      hOverflow: document.documentElement.scrollWidth > window.innerWidth,
      scrollW: document.documentElement.scrollWidth,
      shellW: document.querySelector('.home-shell') ? Math.round(document.querySelector('.home-shell').getBoundingClientRect().width) : null,
      shellML: getComputedStyle(document.querySelector('.home-shell') || document.body).marginLeft,
      navCollide: (() => {
        const nav = document.querySelector('.top-nav');
        const right = document.querySelector('.header-right');
        if (!nav || !right) return null;
        return !(nav.getBoundingClientRect().right < right.getBoundingClientRect().left);
      })(),
      h1font: (() => { const h = document.querySelector('.home-hero-title'); return h ? getComputedStyle(h).fontSize : null; })(),
    }));
    console.log(`VIEWPORT ${w}:`, JSON.stringify(m), errs2.length ? 'ERRS:' + errs2[0] : '');
    await p2.screenshot({ path: `scratch/audit-${w}.png` });
    await p2.close();
  }

  console.log('ERRORS:', errors.length ? errors.slice(0, 12) : 'none');
  await browser.close();
  console.log('AUDIT SWEEP DONE');
})();
