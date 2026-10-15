const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1200);

  const probe = await page.evaluate(() => {
    const gc = (el, prop) => el ? getComputedStyle(el).getPropertyValue(prop) : null;
    const box = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { x: Math.round(r.x), w: Math.round(r.width), y: Math.round(r.y), h: Math.round(r.height) }; };
    const root = document.documentElement;
    const out = {};
    out.containerMax = root.style.getPropertyValue('--container-max') || gc(root, '--container-max');
    out.headerBg = gc(document.querySelector('.site-header'), 'background-color');
    out.headerBox = box(document.querySelector('.site-header'));
    out.topNavBox = box(document.querySelector('.site-header .top-nav'));
    out.headerRightBox = box(document.querySelector('.header-right'));
    out.pageContent = { maxW: gc(document.querySelector('.page-content'), 'max-width'), padL: gc(document.querySelector('.page-content'), 'padding-left'), box: box(document.querySelector('.page-content')) };
    out.viewPanel = { box: box(document.querySelector('#view-product-home')), pad: gc(document.querySelector('#view-product-home'), 'padding') };
    out.homeShell = { box: box(document.querySelector('.home-shell')), maxW: gc(document.querySelector('.home-shell'), 'max-width') };
    out.h1 = { f: gc(document.querySelector('.home-hero-title'), 'font-size') , box: box(document.querySelector('.home-hero-title')) };
    out.heroBox = box(document.querySelector('.home-hero'));
    out.pillars = { cols: gc(document.querySelector('.home-pillars-grid'), 'grid-template-columns'), box: box(document.querySelector('.home-pillars-grid')) };
    out.compGrid = { cols: gc(document.querySelector('.home-comp-grid'), 'grid-template-columns'), box: box(document.querySelector('.home-comp-grid')) };
    out.navLinkFont = gc(document.querySelector('.top-nav-link'), 'font-size');
    out.audioLabelDisplay = gc(document.querySelector('.audio-label'), 'display');
    out.heroTitleEffRule = null;
    return out;
  });
  console.log(JSON.stringify(probe, null, 1));

  // mobile probe
  const p2 = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await p2.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 45000 });
  await p2.waitForTimeout(1000);
  const m = await p2.evaluate(() => {
    const gc = (el, prop) => el ? getComputedStyle(el).getPropertyValue(prop) : null;
    const vis = (sel) => { const el = document.querySelector(sel); if (!el) return 'none-el'; return getComputedStyle(el).display; };
    return {
      headerBg: gc(document.querySelector('.site-header'), 'background-color'),
      headerRight: vis('.header-right'),
      audioToggle: vis('.audio-toggle'),
      navFont: gc(document.querySelector('.top-nav-link'), 'font-size'),
      h1: gc(document.querySelector('.home-hero-title'), 'font-size'),
      homeShellW: Math.round(document.querySelector('.home-shell')?.getBoundingClientRect().width || 0),
      navOverlap: (() => {
        const nav = document.querySelector('.top-nav');
        const right = document.querySelector('.header-right');
        if (!nav || !right) return 'n/a';
        const nr = nav.getBoundingClientRect(), rr = right.getBoundingClientRect();
        return nr.bottom > rr.top && nr.top < rr.bottom && nr.right > rr.left && nr.left < rr.right;
      })(),
      headerH: Math.round(document.querySelector('.site-header')?.getBoundingClientRect().height || 0),
    };
  });
  console.log('MOBILE 390:', JSON.stringify(m, null, 1));
  await browser.close();
})();
