const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const data = await page.evaluate(() => {
    const pick = sel => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily.slice(0, 40),
        weight: cs.fontWeight,
        color: cs.color,
        bg: cs.backgroundColor,
        border: cs.border,
        radius: cs.borderRadius,
        padding: cs.padding,
        w: Math.round(r.width),
        h: Math.round(r.height),
      };
    };
    return {
      body: { bg: getComputedStyle(document.body).backgroundColor, font: getComputedStyle(document.body).fontFamily.slice(0, 60) },
      header: pick('.arena-broadcast-header') || pick('header'),
      heroBadge: pick('.home-hero-badge'),
      heroTitle: pick('.home-hero-title'),
      heroSubTitle: pick('.home-hero-sub-title'),
      heroSub: pick('.home-hero-sub'),
      ctaPrimary: pick('.home-cta-btn'),
      ctaSecondary: pick('.home-cta-btn-secondary'),
      pillarCard: pick('.home-pillar-card'),
      pillarTag: pick('.home-pillar-tag'),
      pillarTitle: pick('.home-pillar-title'),
      sectionHeading: pick('.home-section-heading'),
      compCard: pick('.home-comp-card'),
      compName: pick('.home-comp-name'),
      view: document.querySelector('.view-panel:not([hidden])')?.id,
      shellWidth: Math.round(document.querySelector('.home-shell')?.getBoundingClientRect().width || 0),
    };
  });
  console.log(JSON.stringify(data, null, 1));
  await browser.close();
})();
