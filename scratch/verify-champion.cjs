const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  // Drive the REAL app path: set a champion in state, re-render, then navigate to sim view
  const res = await page.evaluate(() => {
    const app = window;
    // find active tournament key from app scope via exposed render path
    try {
      // tell app a champion is crowned (uses its real state/config)
      const tournKey = Object.keys(app.TOURNAMENTS_CONFIG || {})[0] || 'wc';
      if (app.tournamentState && app.tournamentState[tournKey]) {
        app.tournamentState[tournKey].champion = 'BRAZIL';
      }
      if (typeof app.renderActiveTournament === 'function') app.renderActiveTournament();
      else location.hash = '#/sim';
    } catch (e) {
      return { exception: String(e) };
    }
    return { ok: true };
  });
  await page.waitForTimeout(500);
  const nav = await page.evaluate(() => { document.querySelector('[data-nav="tournament-sim"]').click(); });
  await page.waitForTimeout(800);
  const out = await page.evaluate(() => {
    const b = document.getElementById('champion-banner');
    if (!b) return { found: false };
    return { found: true, hidden: b.hidden, opacity: getComputedStyle(b).opacity,
             celebrated: !!b._arenaMotionCelebrated,
             name: (document.getElementById('champion-team-name')||{}).textContent };
  });
  await page.screenshot({ path: 'scratch/shots/champion-banner.png' });
  console.log(JSON.stringify({ res, out, errors: errors.slice(0,4) }));
  await browser.close();
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
