const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    const card = document.querySelector('#home-featured-grid .home-comp-card[data-tourn="wc"]');
    if (card) card.click();
  });
  await page.waitForTimeout(900);
  const rects = await page.evaluate(() => {
    const r = sel => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), z: cs.zIndex, pos: cs.position };
    };
    return {
      bar: r('#competition-selector-bar'),
      hud: r('#hero-video-hud-wc'),
      soundBtn: r('#hvh-sound-btn-wc'),
      hero: r('#wc-interactive-hero'),
      headerH: getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
    };
  });
  console.log(JSON.stringify(rects, null, 1));
  await browser.close();
})();
