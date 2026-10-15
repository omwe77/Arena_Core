const { chromium } = require('@playwright/test');
const t0 = Date.now();
(async () => {
  const browser = await chromium.launch();
  console.log('launch', Date.now() - t0);
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  console.log('ctx', Date.now() - t0);
  const r = await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log('goto', Date.now() - t0, r && r.status());
  await page.waitForTimeout(1500);
  console.log('wait', Date.now() - t0);
  const out = await page.evaluate(() => {
    const sprite = document.getElementById('arena-pitch-actor');
    const audio = document.querySelector('.audio-toggle');
    const r = audio.getBoundingClientRect();
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return {
      hit: top === audio || audio.contains(top) ? 'control-ok' : 'covered-by ' + (top && (top.className || top.id)),
      spriteRight: sprite ? Math.round(sprite.getBoundingClientRect().right) : null,
      audioLeft: Math.round(r.left),
      scrim: !!document.querySelector('.hero-scrim'),
      jsReveal: document.documentElement.className.includes('js-reveal'),
    };
  });
  console.log('evaluate', Date.now() - t0, JSON.stringify(out));
  await browser.close();
})().catch(e => { console.log('ERR', Date.now() - t0, e.message); process.exit(1); });
