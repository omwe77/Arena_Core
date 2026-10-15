const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1200);

  const colorInfo = () => page.evaluate(() => {
    function bgOf(el) {
      if (!el) return null;
      const c = getComputedStyle(el);
      return c.backgroundColor + (c.backgroundImage !== 'none' ? ' +BG-IMG:' + c.backgroundImage.slice(0, 60) : '');
    }
    function fgOf(el) { return el ? getComputedStyle(el).color : null; }
    function chain(el) {
      const out = [];
      let node = el;
      for (let i = 0; i < 6 && node && node !== document.documentElement; i++) {
        out.push({ sel: node.tagName.toLowerCase() + '.' + String(node.className).split(' ').slice(0, 3).join('.'), bg: bgOf(node), fg: fgOf(node) });
        node = node.parentElement;
      }
      return out;
    }
    // League fixture state vs complete fixture card
    const results = {};
    for (const [key, sel] of [
      ['bracket-card', '.bracket-match-card'],
      ['league-card', '.laliga-fixture-card'],
      ['unified', '.unified-match-card'],
    ]) {
      const card = document.querySelector(sel);
      if (!card) { results[key] = 'not-in-dom'; continue; }
      const name = card.querySelector('.b-team-name');
      const row = card.querySelector('.bracket-team-row');
      const score = card.querySelector('.b-team-score');
      results[key] = {
        cardBg: bgOf(card), cardColor: fgOf(card),
        rowBg: bgOf(row), rowColor: fgOf(row),
        nameBg: bgOf(name), nameColor: fgOf(name), nameCls: name ? name.className : null,
        scoreBg: bgOf(score), scoreColor: fgOf(score),
        ancestors: chain(name),
      };
    }
    return results;
  });

  // Simulate one group match to get a completed bracket-match-card with names
  await page.evaluate(() => { document.querySelector('.top-nav-link[data-nav="tournament-sim"]')?.click(); });
  await page.waitForTimeout(900);
  await page.evaluate(() => {
    const tab = document.querySelector('.bracket-tab[data-stage="groups"]');
    if (tab) tab.click();
  });
  await page.waitForTimeout(600);
  await page.evaluate(() => {
    const quick = document.querySelector('#groups-grid-container .btn-quick-group-sim');
    if (quick) quick.click();
  });
  await page.waitForTimeout(1200);
  const r1 = await colorInfo();
  console.log('=== WC GROUPS state ===');
  console.log(JSON.stringify(r1, null, 1));

  // League (PL) matchday view
  await page.evaluate(() => { document.querySelector('.top-nav-link[data-nav="product-home"], .top-nav-link[data-nav="tournament-home"]')?.click(); });
  await page.waitForTimeout(600);
  const hasLeagueBtn = await page.evaluate(() => {
    // navigate to PL via dropdown on comp selector
    const trigger = document.getElementById('comp-dropdown-trigger');
    if (!trigger) return 'no-trigger';
    trigger.click();
    return 'opened';
  });
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    const opt = [...document.querySelectorAll('.comp-option')].find(o => /premier/i.test(o.textContent));
    if (opt) opt.click();
  });
  await page.waitForTimeout(900);
  await page.evaluate(() => { document.querySelector('.top-nav-link[data-nav="tournament-sim"]')?.click(); });
  await page.waitForTimeout(900);
  const r2 = await colorInfo();
  console.log('=== LEAGUE (PL) state ===');
  console.log(JSON.stringify(r2, null, 1));
  await page.screenshot({ path: 'scratch/league-card-probe.png' });

  console.log('ERRORS:', errors.length ? errors.slice(0, 8) : 'none');
  await browser.close();
  console.log('CARD PROBE DONE');
})();
