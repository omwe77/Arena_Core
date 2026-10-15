const { chromium } = require('@playwright/test');
const URL = process.env.TARGET || 'https://lemon-ocean-06aede400.5.azurestaticapps.net/';
(async () => {
  const browser = await chromium.launch();
  for (const [label, vp, extra] of [['desktop', { width: 1440, height: 900 }, {}], ['mobile', { width: 375, height: 812 }, { isMobile: true, hasTouch: true }]]) {
    const page = await browser.newPage({ viewport: vp, ...extra });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message.slice(0, 120)));
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);
    // Nav to sim view directly
    await page.evaluate(() => { const b = document.querySelector('[data-nav="tournament-sim"]'); if (b) b.click(); });
    await page.waitForTimeout(1000);
    const pre = await page.evaluate(() => ({
      visiblePanel: [...document.querySelectorAll('.view-panel')].find(p => !p.hidden)?.id,
      groupCards: document.querySelectorAll('.group-card').length,
      bracketCols: document.querySelectorAll('.bracket-column').length,
      activeTournTitle: document.getElementById('active-tourn-title')?.textContent,
      subView: window.ArenaRouter && window.location.hash,
    }));
    console.log(`PRE-SIM ${label}:`, JSON.stringify(pre));
    // Click FULL SIMULATION
    await page.evaluate(() => { const b = document.getElementById('sim-instant-btn'); if (b) b.click(); });
    await page.waitForTimeout(3000);
    const post = await page.evaluate(() => {
      function boxOf(el) { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }
      function inter(a, b) { const ox = Math.max(0, Math.min(a.x+a.w, b.x+b.w) - Math.max(a.x, b.x)); const oy = Math.max(0, Math.min(a.y+a.h, b.y+b.h) - Math.max(a.y, b.y)); return ox*oy; }
      const sels = ['.sim-header-card', '.sim-clock-hud', '#champion-banner', '.tournament-stage-viewport', '.bracket-nav-tabs', '.ticker-bar', '#groups-grid-container', '.group-card', '#bracket-tree-container', '.bracket-column', '.standings-grid'];
      const hits = [];
      const els = sels.flatMap(s => [...document.querySelectorAll(s)]).filter(e => e.offsetParent !== null);
      for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) {
        const a = boxOf(els[i]), b = boxOf(els[j]);
        const area = inter(a, b);
        if (a.w*a.h > 0 && b.w*b.h > 0 && area > 500) {
          hits.push({ a: els[i].className.toString().slice(0,45) + '#' + els[i].id, b: els[j].className.toString().slice(0,45) + '#' + els[j].id, pct: +(area / Math.min(a.w*a.h, b.w*b.h)*100).toFixed(0), aBox: a, bBox: b });
        }
      }
      return {
        groupCards: document.querySelectorAll('.group-card').length,
        bracketCols: document.querySelectorAll('.bracket-column').length,
        tickerLen: (document.getElementById('bracket-ticker-text')||{}).textContent?.length,
        clockShown: (() => { const c = document.getElementById('sim-clock-hud'); return c ? { hidden: c.hidden, pos: getComputedStyle(c).position, box: boxOf(c) } : null; })(),
        championShown: (() => { const c = document.getElementById('champion-banner'); return c ? { hidden: c.hidden, box: c.hidden ? null : boxOf(c) } : null; })(),
        matchCards: document.querySelectorAll('.match-card').length,
        overlaps: hits.slice(0, 10),
        scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth,
      };
    });
    console.log(`POST-SIM ${label}:`, JSON.stringify(post, null, 1));
    console.log(`PAGEERRORS ${label}:`, JSON.stringify(errors.slice(0,5)));
    await page.screenshot({ path: `scratch/shots/live-${label}-postsim.png`, fullPage: false });
    await page.screenshot({ path: `scratch/shots/live-${label}-postsim-full.png`, fullPage: true });
    await page.close();
  }
  await browser.close();
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
