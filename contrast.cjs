const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.body.style.zoom = '1');
  await page.waitForTimeout(200);
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.evaluate(() => {
    const lum = rgb => {
      const m = rgb.match(/(\d+\.\d+|\d+)/g);
      if (!m) return null;
      const [r, g, b] = [+(m[0]), +(m[1]), +(m[2])];
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const contrast = (a, b) => {
      const la = lum(a), lb = lum(b);
      if (la == null || lb == null) return null;
      return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
    };
    const effectiveBg = el => {
      const cs = getComputedStyle(el);
      if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') return cs.backgroundColor;
      if (el.parentElement === null) return 'rgba(0, 0, 0, 0)';
      return effectiveBg(el.parentElement);
    };

    const checks = [
      ['brand-logo .logo-title','.brand-logo .logo-title'],
      ['brand tagline (.font-label-telemetry in header)','header .font-label-telemetry'],
      ['brand-core','.brand-logo .logo-title .logo-core'],
      ['home-hero-title','.home-hero-title'],
      ['home-hero-sub-title','.home-hero-sub-title'],
      ['home-hero-sub','.home-hero-sub'],
      ['home-pillar-title','.home-pillar-card .home-pillar-title'],
      ['home-pillar-tag','.home-pillar-card .home-pillar-tag'],
      ['home-comp-name','.home-comp-card .home-comp-name'],
      ['home-comp-detail','.home-comp-card .home-comp-detail'],
      ['home-section-heading','.home-section-heading'],
      ['logo-ball-icon','.logo-ball-icon'],
      ['nav-inactive','.top-nav-link:not(.active)'],
      ['nav-active','.top-nav-link.active'],
      ['data-mode-badge text','.data-mode-badge .mode-text'],
      ['sim-header-card text','.sim-header-card'],
      ['tourn-title','.tourn-title'],
      ['bracket-tab-inactive','.bracket-tab:not(.active)'],
      ['bracket-tab-active','.bracket-tab.active'],
      ['stage-badge','.stage-badge'],
      ['sim-action-btn.primary text','.sim-action-btn.primary'],
      ['sim-context-back text','.sim-context-back'],
      ['comp-dropdown-trigger text','.comp-dropdown-trigger'],
      ['ticker-bar','.ticker-bar'],
      ['ticker-badge','.ticker-badge'],
      ['ticker-text','#bracket-ticker-text'],
      ['champ-name','#champion-team-name'],
      ['section-banner h2','.section-banner h2'],
      ['section-banner p','.section-banner p'],
      ['tech-card','.tech-card'],
      ['card-title','.card-title'],
      ['thead th','.tech-table thead th'],
      ['tbody td body row','.tech-table tbody tr:first-child td'],
      ['top-scorers','#top-scorers-list'],
      ['archive-card','.archive-card']
    ];
    const rows = checks.map(([lbl, sel]) => {
      const els = document.querySelectorAll(sel);
      if (!els.length) return { lbl, missing: true };
      const results = [];
      for (const el of els) {
        const cs = getComputedStyle(el);
        const ownBg = cs.backgroundColor;
        const effectiveBgCss = effectiveBg(el);
        const c1 = cs.color, c2 = effectiveBgCss === 'rgba(0, 0, 0, 0)' ? cs.backgroundColor : effectiveBgCss;
        const l1 = lum(c1), l2 = lum(c2);
        const ratio = contrast(c1, c2);
        const darkOnLight = (l1 !== null && l2 !== null) && l1 < l2;
        const fail = ratio != null && ratio < 4.5 && darkOnLight && (l1 !== null && l2 !== null && l1 < l2);
        results.push({
          lbl, color: c1, ownBg, effectiveBg: c2,
          ratio: ratio == null ? null : +ratio.toFixed(2),
          l1: l1 == null ? null : +l1.toFixed(3),
          l2: l2 == null ? null : +l2.toFixed(3),
          text: (el.textContent || '').trim().slice(0, 60),
          fail
        });
      }
      return results;
    }).flat();
    window._contrastRows = rows;
  });
  const rows = await page.evaluate(() => window._contrastRows);
  for (const r of rows) {
    if (r.missing) console.log('MISSING ' + r.lbl);
    else console.log((r.fail ? 'F:' : 'OK:') + r.lbl + ' color=' + r.color + ' own-bg=' + r.ownBg + ' eff-bg=' + r.effectiveBg + ' ratio=' + r.ratio + (r.fail ? ' FAIL' : '') + ' text=' + r.text.slice(0,60) + (r.fail ? ' | l1=' + r.l1 + ' l2=' + r.l2 : ''));
  }
  await browser.close();
})();
