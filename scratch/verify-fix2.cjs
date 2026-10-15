const { chromium } = require('@playwright/test');
const URL = process.env.TARGET || 'http://localhost:5174/';
(async () => {
  const report = {};
  const browser = await chromium.launch();
  for (const [label, vp, extra] of [
    ['desktop', { width: 1440, height: 900 }, {}],
    ['tablet', { width: 834, height: 1112 }, {}],
    ['mobile', { width: 375, height: 812 }, { isMobile: true, hasTouch: true }],
  ]) {
    const page = await browser.newPage({ viewport: vp, ...extra });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message.slice(0, 120)));
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1600);
    report[label] = await page.evaluate(() => {
      const out = {};
      const sprite = document.getElementById('arena-pitch-actor');
      const controls = [document.querySelector('.audio-toggle'), document.getElementById('global-data-mode'), document.querySelector('.top-nav-link.active')];
      out.controlHits = controls.map(c => {
        if (!c) return 'missing';
        const r = c.getBoundingClientRect();
        const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return (top === c || c.contains(top)) ? 'ok' : 'covered';
      });
      out.spriteBox = sprite ? sprite.getBoundingClientRect().toJSON() : null;
      out.scrim = !!document.querySelector('.hero-scrim');
      out.heroTitleOpacity = getComputedStyle(document.querySelector('.home-hero-title')).opacity;
      out.jsReveal = document.documentElement.className.includes('js-reveal');
      out.subtitleOverStand = (() => {
        const sub = document.querySelector('.home-hero-sub');
        const stand = document.querySelector('.hero-stand-b');
        if (!sub || !stand) return null;
        const rs = sub.getBoundingClientRect(), rt = stand.getBoundingClientRect();
        const oy = Math.max(0, Math.min(rs.bottom, rt.bottom) - Math.max(rs.top, rt.top));
        const ox = Math.max(0, Math.min(rs.right, rt.right) - Math.max(rs.left, rt.left));
        return Math.round(oy * ox / (rs.width * rs.height) * 100);
      })();
      return out;
    });
    await page.screenshot({ path: `scratch/shots/fix2-${label}.png` });
    if (errors.length) report[label].errors = errors.slice(0, 4);
    await page.close();
  }
  await browser.close();

  const rb = await chromium.launch();
  const pr = await rb.newPage({ viewport: { width: 1440, height: 900 } });
  await pr.emulateMedia({ reducedMotion: 'reduce' });
  await pr.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await pr.waitForTimeout(700);
  report.reduced = await pr.evaluate(() => {
    const sprite = document.getElementById('arena-pitch-actor');
    const leg = document.querySelector('.arena-leg-left');
    return {
      legAnimation: leg ? getComputedStyle(leg).animationName : null,
      leftInline: sprite ? (sprite.style.left || 'unset') : null,
      jsReveal: document.documentElement.className.includes('js-reveal'),
      titleOpacity: getComputedStyle(document.querySelector('.home-hero-title')).opacity,
    };
  });
  await pr.screenshot({ path: 'scratch/shots/fix2-reduced.png' });
  await rb.close();
  console.log(JSON.stringify(report, null, 1));
})().catch(e => { console.error('FATAL ' + e.message); process.exit(1); });
