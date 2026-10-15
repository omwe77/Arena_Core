const { chromium } = require('@playwright/test');
const URL = process.env.TARGET || 'http://localhost:5173/';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(1800);
  await page.evaluate(() => { const b = document.querySelector('[data-nav="tournament-sim"]'); if (b) b.click(); });
  await page.waitForTimeout(900);
  const res = await page.evaluate(() => {
    const badge = document.querySelector('#hero-season-badge') || document.querySelector('.data-badge');
    const btn = document.querySelector('#sim-draw-btn');
    if (!badge || !btn) return { badge: !!badge, btn: !!btn };
    const rb = badge.getBoundingClientRect(), rn = btn.getBoundingClientRect();
    const info = document.querySelector('.sim-header-info');
    const card = document.querySelector('.sim-header-card');
    const csLine = getComputedStyle(badge.parentElement);
    const csBadge = getComputedStyle(badge);
    const csCard = getComputedStyle(card);
    const csInfo = getComputedStyle(info);
    const csCtrl = getComputedStyle(document.querySelector('.sim-controls-group'));
    const csTop = getComputedStyle(document.querySelector('.sim-top-btns'));
    return {
      badgeBox: [rb.x, rb.y, rb.width, rb.height].map(Math.round),
      btnBox: [rn.x, rn.y, rn.width, rn.height].map(Math.round),
      overlap: rb.right - rn.left,
      cardCss: { display: csCard.display, flexWrap: csCard.flexWrap, gridCols: csCard.gridTemplateColumns, padding: csCard.padding, width: csCard.width },
      infoCss: { width: csInfo.width, maxWidth: csInfo.maxWidth, overflow: csInfo.overflow, flexShrink: csInfo.flexShrink, minWidth: csInfo.minWidth },
      lineCss: { width: csLine.width, flexWrap: csLine.flexWrap, overflow: csLine.overflow, flexShrink: csLine.flexShrink, minWidth: csLine.minWidth, whiteSpace: csLine.whiteSpace },
      badgeCss: { width: csBadge.width, minWidth: csBadge.minWidth, whiteSpace: csBadge.whiteSpace, flexShrink: csBadge.flexShrink, fontSize: csBadge.fontSize },
      ctrlCss: { width: csCtrl.width, flex: csCtrl.flex, flexBasis: csCtrl.flexBasis },
      topBtnsCss: { width: csTop.width, display: csTop.display, flexWrap: csTop.flexWrap },
    };
  });
  console.log(JSON.stringify(res, null, 1));
  await page.screenshot({ path: 'scratch/shots/overlap-local-mobile.png' });
  await browser.close();
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
