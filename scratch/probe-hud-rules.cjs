const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const info = await page.evaluate(() => {
    const card = document.querySelector('#home-featured-grid .home-comp-card[data-tourn="wc"]');
    if (card) card.click();
    return true;
  });
  await page.waitForTimeout(900);
  const rules = await page.evaluate(() => {
    const hud = document.querySelector('#hero-video-hud-wc');
    if (!hud) return 'NO HUD';
    const matches = [];
    for (const sheet of document.styleSheets) {
      let list; try { list = sheet.cssRules; } catch { continue; }
      const walk = ruleList => {
        for (const r of ruleList) {
          if (r.cssRules) { walk(r.cssRules); continue; }
          if (!r.selectorText) continue;
          try {
            if (hud.matches(r.selectorText)) {
              matches.push({
                sel: r.selectorText,
                css: r.style.cssText.slice(0, 120),
                href: sheet.href ? sheet.href.split('/').pop() : 'inline',
              });
            }
          } catch {}
        }
      };
      walk(list);
    }
    return matches.filter(m => /hero-video-hud$|^\.hero-video-hud/.test(m.sel) || m.css.includes('position') || m.css.includes('z-index'));
  });
  console.log(JSON.stringify(info), JSON.stringify(rules, null, 1));
  await browser.close();
})();
