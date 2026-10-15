const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  await page.goto('https://lemon-ocean-06aede400.5.azurestaticapps.net/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1500);

  const views = [
    ['competitions', 'Competitions'],
    ['tournament-sim', 'Simulator'],
    ['standings-view', 'Standings'],
    ['archive-view', 'Archive'],
    ['tactical-tracker', 'Analytics'],
  ];
  for (const [nav, name] of views) {
    await page.evaluate(id => {
      const btn = document.querySelector(`.top-nav-link[data-nav="${id}"]`);
      if (btn) btn.click();
    }, nav);
    await page.waitForTimeout(1200);
    const panel = await page.evaluate(() => {
      const p = [...document.querySelectorAll('.view-panel')].find(x => !x.hidden);
      return { id: p?.id, textLen: document.body.innerText.length, top: document.body.innerText.slice(0, 160) };
    });
    console.log(`--- ${name} -> ${panel.id} (textLen ${panel.textLen})`);
    console.log('   text:', panel.top.replace(/\n/g, ' | ').slice(0, 150));
    await page.screenshot({ path: `scratch/live-${nav}.png`, fullPage: false });
  }
  console.log('PAGE ERRORS:', errors.length ? errors.slice(0, 8) : 'none');
  await browser.close();
  console.log('SWEEP DONE');
})();
