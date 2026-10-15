const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  // Mechanics check: toggle the real banner's hidden attr (same signal app.js line 1832 emits)
  const out = await page.evaluate(async () => {
    const b = document.getElementById('champion-banner');
    b.hidden = false; // simulate reveal mutation
    await new Promise(r => setTimeout(r, 900));
    const cs = getComputedStyle(b);
    const trophy = b.querySelector('.trophy-icon');
    return {
      bannerOpacity: cs.opacity,
      transitioned: cs.transitionName !== 'none' && cs.transitionDuration.includes('0.6s'),
      flag: !!b._arenaMotionCelebrated,
      trophyRan: !!(trophy && (trophy._animeSet || getComputedStyle(trophy).transform !== 'none') || trophy),
      trophyTransform: trophy ? getComputedStyle(trophy).transform.slice(0, 40) : null,
    };
  });
  // Dedupe check: reveal again -> no re-run
  const dedupe = await page.evaluate(async () => {
    const b = document.getElementById('champion-banner');
    b.style.transition = 'none'; b.style.opacity = '0.4'; // measurable marker
    b.hidden = true; await new Promise(r => setTimeout(r, 60));
    b.hidden = false; await new Promise(r => setTimeout(r, 900));
    return { secondRunOpacity: getComputedStyle(b).opacity, flag: !!b._arenaMotionCelebrated };
  });
  console.log(JSON.stringify({ out, dedupe }));
  await browser.close();
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
