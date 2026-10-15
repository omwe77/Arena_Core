const { chromium } = require('@playwright/test');

(async () => {
  const report = {};
  const shots = [];

  // ---------- Desktop 1440x900 ----------
  {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1400);

    // A. 3D ball present + entrance completed
    const ballData = await page.evaluate(() => {
      const ball = document.querySelector('.home-hero-3d-ball');
      if (!ball) return null;
      const cs = getComputedStyle(ball);
      return { transform: cs.transform, opacity: cs.opacity, perspectiveParent: !!document.querySelector('.home-hero-3d-perspective') };
    });
    report.ball = ballData;
    await page.screenshot({ path: 'scratch/shots/desktop-hero.png' }); shots.push('desktop-hero.png');

    // Pointer parallax: mouse over the overlay, capture transform before/after
    const overlay = page.locator('.home-hero-3d-mouse-overlay');
    const before = await page.evaluate(() => getComputedStyle(document.querySelector('.home-hero-3d-ball')).transform);
    const box = await overlay.boundingBox();
    if (box) await page.mouse.move(box.x + box.width / 2 + 40, box.y + box.height / 2 - 30, { steps: 5 });
    await page.waitForTimeout(260);
    const after = await page.evaluate(() => getComputedStyle(document.querySelector('.home-hero-3d-ball')).transform);
    report.parallax = { changed: before !== after, before: before.slice(0, 60), after: after.slice(0, 60) };

    // B. Scroll reveals: sections/pillars reach visible state after scrolling
    await page.evaluate(() => document.querySelector('.home-pillars-grid').scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(1100);
    const reveal = await page.evaluate(() => {
      const g = document.querySelector('.home-pillars-grid');
      const card = document.querySelector('.home-pillar-card');
      return { gridOpacity: getComputedStyle(g).opacity, cardOpacity: getComputedStyle(card).opacity };
    });
    report.scrollReveal = reveal;
    await page.screenshot({ path: 'scratch/shots/desktop-pillars.png' }); shots.push('desktop-pillars.png');
    await page.evaluate(() => document.querySelector('.home-competitions-section').scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(1100);
    await page.screenshot({ path: 'scratch/shots/desktop-comps.png' }); shots.push('desktop-comps.png');

    // C. Draw modal stagger
    await page.evaluate(() => { document.querySelector('#home-featured-grid .home-comp-card[data-tourn="wc"]').click(); });
    await page.waitForTimeout(700);
    await page.evaluate(() => { document.querySelector('#btn-wc-custom-draw').click(); });
    await page.waitForTimeout(900);
    report.draw = await page.evaluate(() => {
      const modal = document.getElementById('wc-draw-modal');
      const cards = [...document.querySelectorAll('#wc-draw-grid .wc-nation-card')];
      return {
        modalOpen: !!modal && !modal.hidden,
        cardCount: cards.length,
        staggered: cards.filter(c => c._arenaMotionPresented).length,
        firstOpacity: cards.length ? getComputedStyle(cards[0]).opacity : null,
      };
    });
    await page.screenshot({ path: 'scratch/shots/desktop-draw.png' }); shots.push('desktop-draw.png');
    await page.evaluate(() => { window.closeCustomDrawModal && window.closeCustomDrawModal(); });
    await page.waitForTimeout(300);

    // Desktop overflow + console errors
    report.desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    report.desktopErrors = errors.slice(0, 6);
    await browser.close();
  }

  // ---------- Mobile 375x812 ----------
  {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1400);
    report.mobile = await page.evaluate(() => {
      const ball = document.querySelector('.home-hero-3d-ball');
      return {
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        ballVisible: !!ball && ball.getBoundingClientRect().width > 0,
        heroTitleVisible: getComputedStyle(document.querySelector('.home-hero-title')).opacity,
      };
    });
    await page.screenshot({ path: 'scratch/shots/mobile-home.png' }); shots.push('mobile-home.png');
    report.mobileErrors = errors.slice(0, 6);
    await browser.close();
  }

  // ---------- Reduced motion (emulate) ----------
  {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    report.reduced = await page.evaluate(() => {
      const title = document.querySelector('.home-hero-title');
      const card = document.querySelector('.home-pillar-card');
      return {
        titleOpacity: title ? getComputedStyle(title).opacity : null,
        titleTransform: title ? getComputedStyle(title).transform : null,
        cardOpacity: card ? getComputedStyle(card).opacity : null,
      };
    });
    await page.screenshot({ path: 'scratch/shots/reduced-motion.png' }); shots.push('reduced-motion.png');
    await browser.close();
  }

  console.log(JSON.stringify(report, null, 1));
  console.log('SHOTS:', shots.join(', '));
})().catch(e => { console.error('FATAL', e); process.exit(1); });
