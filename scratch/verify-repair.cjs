const { chromium } = require('@playwright/test');
const URL = process.env.TARGET || 'http://localhost:5173/';
(async () => {
  const report = { shots: [] };

  // ---- Desktop ----------------------------------------------------------
  {
    const b = await chromium.launch();
    const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message.slice(0, 140)));
    page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text().slice(0, 140)); });
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1600);

    report.hero = await page.evaluate(() => {
      const hero = document.querySelector('.home-hero');
      const pitch = document.querySelector('.hero-pitch');
      const ball = document.querySelector('.hero-ball');
      const stand = document.querySelector('.hero-stand-a');
      const title = document.querySelector('.home-hero-title');
      return {
        heroHeight: Math.round(hero.getBoundingClientRect().height),
        pitchTransform: getComputedStyle(pitch).transform.slice(0, 40),
        ballVisible: !!ball && ball.getBoundingClientRect().width > 4,
        standVisible: !!stand && stand.getBoundingClientRect().width > 0,
        titleOpacity: getComputedStyle(title).opacity,
      };
    });
    report.shots.push('rpr-desktop-hero.png');
    await page.screenshot({ path: 'scratch/shots/rpr-desktop-hero.png' });

    const before = await page.evaluate(() => getComputedStyle(document.querySelector('[data-depth="18"]')).transform);
    const hb = await page.locator('.home-hero').boundingBox();
    await page.mouse.move(hb.x + hb.width * 0.72, hb.y + hb.height * 0.35, { steps: 4 });
    await page.waitForTimeout(220);
    const after = await page.evaluate(() => getComputedStyle(document.querySelector('[data-depth="18"]')).transform);
    report.parallax = { changed: before !== after };

    await page.evaluate(() => window.scrollTo(0, 700)); await page.waitForTimeout(900);
    report.reveals = await page.evaluate(() => {
      const q = s => document.querySelector(s);
      const st = e => e ? { visible: e.className.includes('is-visible'), op: getComputedStyle(e).opacity } : null;
      return { pillars: st(q('.home-pillars-grid')), pillarsCard: st(q('.home-pillar-card')) };
    });
    report.shots.push('rpr-desktop-scrolled.png');
    await page.screenshot({ path: 'scratch/shots/rpr-desktop-scrolled.png' });

    for (const sel of ['[data-nav="competitions-view"]', '[data-nav="standings-view"]', '[data-nav="tournament-sim"]']) {
      await page.evaluate(s => { document.querySelector(s).click(); }, sel);
      await page.waitForTimeout(800);
    }
    report.shots.push('rpr-desktop-sim.png');
    await page.screenshot({ path: 'scratch/shots/rpr-desktop-sim.png' });

    await page.evaluate(() => { const x = document.getElementById('sim-instant-btn'); if (x) x.click(); });
    await page.waitForTimeout(3500);
    await page.evaluate(() => { const x = document.getElementById('sim-skip-btn'); if (x) x.click(); });
    await page.waitForTimeout(2500);
    report.simAfter = await page.evaluate(() => {
      function contains(a, d) { for (let n = d; n; n = n.parentElement) if (n === a) return true; return false; }
      const els = [...document.querySelectorAll('.sim-header-card, .sim-clock-hud, #champion-banner, .bracket-nav-tabs, .ticker-bar, .group-card, .bracket-column, .stage-badge, .live-control-bar, .site-footer')].filter(e => e.offsetParent !== null);
      const hits = [];
      for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) {
        if (contains(els[i], els[j]) || contains(els[j], els[i])) continue;
        const ra = els[i].getBoundingClientRect(), rb = els[j].getBoundingClientRect();
        const ox = Math.max(0, Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left));
        const oy = Math.max(0, Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top));
        if (ox * oy > 500) hits.push(els[i].className.toString().slice(0, 30) + ' <-> ' + els[j].className.toString().slice(0, 30));
      }
      return {
        groupCards: document.querySelectorAll('.group-card').length,
        overlaps: hits.slice(0, 6),
        overflow: document.documentElement.scrollWidth - window.innerWidth,
      };
    });
    report.shots.push('rpr-desktop-postsim.png');
    await page.screenshot({ path: 'scratch/shots/rpr-desktop-postsim.png', fullPage: true });
    report.desktopErrors = errors.slice(0, 6);
    await b.close();
  }

  // ---- Mobile 375 ---------------------------------------------------------
  {
    const b = await chromium.launch();
    const page = await b.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message.slice(0, 120)));
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);
    report.mobileHome = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      heroH: Math.round(document.querySelector('.home-hero').getBoundingClientRect().height),
      titleOp: getComputedStyle(document.querySelector('.home-hero-title')).opacity,
    }));
    report.shots.push('rpr-mobile-home.png');
    await page.screenshot({ path: 'scratch/shots/rpr-mobile-home.png' });

    await page.evaluate(() => { document.querySelector('[data-nav="tournament-sim"]').click(); });
    await page.waitForTimeout(900);
    report.mobileLeaf = await page.evaluate(() => {
      function contains(a, d) { for (let n = d; n; n = n.parentElement) if (n === a) return true; return false; }
      const els = [...document.querySelectorAll('.page-content *')].filter(e => {
        if (e.offsetParent === null) return false;
        if (getComputedStyle(e).position === 'fixed') return false;
        const kids = [...e.children];
        const leaf = kids.length === 0 || kids.every(k => getComputedStyle(k).position === 'absolute');
        return leaf && (e.textContent || '').trim().length > 3;
      });
      const hits = [];
      for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) {
        if (contains(els[i], els[j]) || contains(els[j], els[i])) continue;
        const ra = els[i].getBoundingClientRect(), rb = els[j].getBoundingClientRect();
        const ox = Math.max(0, Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left));
        const oy = Math.max(0, Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top));
        if (ox * oy > 700) hits.push((els[i].className || '').toString().slice(0, 36) + ' <-> ' + (els[j].className || '').toString().slice(0, 36));
      }
      return { nodes: els.length, hits: hits.slice(0, 8) };
    });
    report.shots.push('rpr-mobile-sim.png');
    await page.screenshot({ path: 'scratch/shots/rpr-mobile-sim.png' });
    report.mobileErrors = errors.slice(0, 6);
    await b.close();
  }

  // ---- Reduced motion ------------------------------------------------------
  {
    const b = await chromium.launch();
    const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(700);
    report.reduced = await page.evaluate(() => {
      const title = document.querySelector('.home-hero-title');
      const card = document.querySelector('.home-pillar-card');
      return {
        titleOpacity: getComputedStyle(title).opacity,
        titleTransform: getComputedStyle(title).transform,
        cardOpacity: card ? getComputedStyle(card).opacity : null,
        ballTransform: getComputedStyle(document.querySelector('.hero-ball')).transform,
        jsRevealClass: document.documentElement.className.includes('js-reveal'),
      };
    });
    report.shots.push('rpr-reduced.png');
    await page.screenshot({ path: 'scratch/shots/rpr-reduced.png' });
    await b.close();
  }

  console.log(JSON.stringify(report, null, 1));
})().catch(e => { console.error('FATAL ' + e.message); process.exit(1); });
