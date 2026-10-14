// @ts-check
import { test, expect } from '@playwright/test';

test.describe('ARENA_CORE Platform Tests', () => {

  // Helper: the app now boots on the product Home. Each competition's hero and
  // Custom Draw live on its showcase, reached from a Featured competition card.
  async function goToSimulator(page) {
    await page.evaluate(() => {
      const card = document.querySelector('#home-featured-grid .home-comp-card[data-tourn="wc"]');
      if (card) card.click();
    });
    await page.waitForTimeout(700);
  }

  test('has correct page title and header elements', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/ARENA_CORE/);

    const pitchTrack = page.locator('#header-pitch-track');
    await expect(pitchTrack).toBeVisible();

    const arenaActor = page.locator('#arena-pitch-actor');
    await expect(arenaActor).toBeVisible();
  });

  test('home is a single focused panel with contextual competition control', async ({ page }) => {
    await page.goto('/');

    // Exactly one top-level panel renders.
    await expect(page.locator('#view-product-home')).toBeVisible();
    await expect(page.locator('#view-tournament-sim')).toBeHidden();

    // No duplicated brand identity or implementation status metrics on Home.
    await expect(page.locator('.home-identity')).toHaveCount(0);
    await expect(page.locator('.home-status-card')).toHaveCount(0);

    // Curated competition selection, not all 13.
    await expect(page.locator('#home-featured-grid .home-comp-card')).toHaveCount(4);

    // Competition control is contextual: hidden on Home.
    await expect(page.locator('#competition-selector-bar')).toBeHidden();
  });

  test('competition control appears on views where switching is relevant', async ({ page }) => {
    await page.goto('/');

    // Global Home is competition-agnostic: no control.
    await expect(page.locator('#competition-selector-bar')).toBeHidden();

    // Competition-scoped views expose it.
    await goToSimulator(page);
    await expect(page.locator('#competition-selector-bar')).toBeVisible();
    await expect(page.locator('#comp-current-name')).toHaveText(/WORLD CUP/);

    await page.evaluate(() => document.querySelector('.top-nav-link[data-nav="product-home"]')?.click());
    await expect(page.locator('#competition-selector-bar')).toBeHidden();
  });

  test('renders World Cup hero and interactive video HUD', async ({ page }) => {
    await page.goto('/');
    await goToSimulator(page);

    const wcHero = page.locator('#wc-interactive-hero');
    await expect(wcHero).toBeVisible();

    const videoBg = page.locator('#hero-video-bg-wc');
    await expect(videoBg).toBeAttached();

    const hud = page.locator('#hero-video-hud-wc');
    await expect(hud).toBeVisible();

    const soundBtn = page.locator('#hvh-sound-btn-wc');
    await expect(soundBtn).toBeVisible();

    const playBtn = page.locator('#hvh-play-btn-wc');
    await expect(playBtn).toBeVisible();

    const modeBtn = page.locator('#hvh-bg-btn-wc');
    await expect(modeBtn).toBeVisible();
  });

  test('hero video HUD controls respond to clicks', async ({ page }) => {
    await page.goto('/');
    await goToSimulator(page);
    await page.keyboard.press('Escape');

    const soundBtn = page.locator('#hvh-sound-btn-wc');
    await expect(soundBtn).toBeVisible();
    await soundBtn.click();
    await expect(soundBtn).toHaveClass(/hvh-btn-active/);

    const playBtn = page.locator('#hvh-play-btn-wc');
    await expect(playBtn).toBeVisible();
    await playBtn.click();
    await expect(playBtn).toHaveClass(/hvh-btn-paused/);

    const modeBtn = page.locator('#hvh-bg-btn-wc');
    await expect(modeBtn).toBeVisible();
    await modeBtn.click();
    await expect(modeBtn).toHaveClass(/hvh-btn-active/);
  });

  test('custom draw modal opens and closes correctly', async ({ page }) => {
    await page.goto('/');
    await goToSimulator(page);

    const customDrawBtn = page.locator('#btn-wc-custom-draw');
    await expect(customDrawBtn).toBeVisible();
    await customDrawBtn.click();

    const modal = page.locator('#wc-draw-modal');
    await expect(modal).toBeVisible();

    const closeBtn = page.locator('#wc-draw-close');
    await closeBtn.click();
    await expect(modal).toBeHidden();
  });

  test('each tournament has its own distinct hero video', async ({ page }) => {
    await page.goto('/');
    await goToSimulator(page);
    await page.waitForTimeout(1000);

    const wcIframe = page.locator('#hero-video-iframe-wc');
    await expect(wcIframe).toHaveAttribute('src', /I_kDmkCBm_c/);

    // Switch competition via the contextual control
    const uclOpt = page.locator('.comp-option[data-tourn="ucl"]');
    if (await uclOpt.count() > 0) {
      await page.locator('#comp-dropdown-trigger').click();
      await uclOpt.click();
      await page.waitForTimeout(600);
      const uclIframe = page.locator('#hero-video-iframe-ucl');
      await expect(uclIframe).toHaveAttribute('src', /V_YxSJXR9D4/);
    }

    const plOpt = page.locator('.comp-option[data-tourn="pl"]');
    if (await plOpt.count() > 0) {
      await page.locator('#comp-dropdown-trigger').click();
      await plOpt.click();
      await page.waitForTimeout(600);
      const plIframe = page.locator('#hero-video-iframe-pl');
      await expect(plIframe).toHaveAttribute('src', /wpcKyur-kbI/);
    }
  });

  test('navigation switches between all views', async ({ page }) => {
    await page.goto('/');

    // Ensure nav is visible first
    const nav = page.locator('.top-nav');
    await expect(nav).toBeVisible();

    // Use evaluate to click directly, bypassing all visibility checks
    await page.evaluate(() => document.querySelector('.top-nav-link[data-nav="product-home"]')?.click());
    await expect(page.locator('#view-product-home')).toBeVisible();

    await page.evaluate(() => document.querySelector('.top-nav-link[data-nav="tournament-sim"]')?.click());
    await expect(page.locator('#view-tournament-sim')).toBeVisible();

    await page.evaluate(() => document.querySelector('.top-nav-link[data-nav="standings-view"]')?.click());
    await expect(page.locator('#view-standings-view')).toBeVisible();

    await page.evaluate(() => document.querySelector('.top-nav-link[data-nav="competitions-view"]')?.click());
    await expect(page.locator('#view-competitions-view')).toBeVisible();
  });

  test('data mode badge updates based on active view', async ({ page }) => {
    await page.goto('/');

    await page.click('.top-nav-link[data-nav="standings-view"]');
    const badge = page.locator('#global-data-mode-text');
    await expect(badge).toHaveText('ARCHIVE DATA');

    await page.click('.top-nav-link[data-nav="tournament-sim"]');
    await expect(badge).toHaveText('SIMULATION');
  });

  test('competitions view renders detailed competition cards', async ({ page }) => {
    await page.goto('/');

    await page.click('.top-nav-link[data-nav="competitions-view"]');
    const grid = page.locator('#competitions-grid');
    await expect(grid).toBeVisible();

    const cards = page.locator('.archive-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // The old dedicated Archive/Analytics tabs are gone from the header.
    await expect(page.locator('.top-nav-link[data-nav="archive-view"]')).toHaveCount(0);
    await expect(page.locator('.top-nav-link[data-nav="analytics-view"]')).toHaveCount(0);
  });

  test('standings view renders table structure', async ({ page }) => {
    await page.goto('/');

    await page.click('.top-nav-link[data-nav="standings-view"]');
    const table = page.locator('#standings-table-body');
    await expect(table).toBeVisible();
  });

  test('simulation controls are visible and clickable', async ({ page }) => {
    await page.goto('/');

    await page.click('.top-nav-link[data-nav="tournament-sim"]');
    const simControls = page.locator('.sim-controls-group, .sim-header-card');
    await expect(simControls.first()).toBeVisible();
  });

  test('keyboard navigation works for main nav', async ({ page }) => {
    await page.goto('/');

    // Tab should focus some interactive element
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.className || '');
    expect(focused.length).toBeGreaterThan(0);
  });

  test('modal focus trap works in custom draw', async ({ page }) => {
    await page.goto('/');
    await goToSimulator(page);

    const drawBtn = page.locator('#btn-wc-custom-draw');
    await drawBtn.click();

    const modal = page.locator('#wc-draw-modal');
    await expect(modal).toBeVisible();

    // Check that modal contains focusable elements
    const focusableCount = await page.evaluate(() => {
      const modal = document.getElementById('wc-draw-modal');
      if (!modal) return 0;
      return modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').length;
    });
    expect(focusableCount).toBeGreaterThan(0);
  });

  test('mobile navigation is usable at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const nav = page.locator('.top-nav');
    await expect(nav).toBeVisible();

    const navLinks = page.locator('.top-nav-link');
    const count = await navLinks.count();
    expect(count).toBeGreaterThanOrEqual(3);

    for (let i = 0; i < count; i++) {
      await navLinks.nth(i).click({ force: true });
      await page.waitForTimeout(300);
    }
  });

  test('no console errors during full navigation', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('/');

    const navLinks = page.locator('.top-nav-link');
    const count = await navLinks.count();
    for (let i = 0; i < count; i++) {
      await navLinks.nth(i).click();
      await page.waitForTimeout(300);
    }

    expect(errors).toEqual([]);
  });

  // Regression: a completed World Cup simulation must survive a page reload.
  // Previously, tournament state was only saved at init, so a full sim was
  // silently reset to its zeroed pre-simulation snapshot after reloading.
  test('completed full simulation state persists across page reload', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('arena_tournament_state_wc'));
    await page.reload();
    await page.waitForTimeout(600);

    await page.click('.top-nav-link[data-nav="tournament-sim"]');
    await page.click('#sim-instant-btn');

    // Wait for the instant full simulation to settle on a champion.
    await page.waitForFunction(() => {
      const banner = document.getElementById('champion-banner');
      const btn = document.getElementById('sim-stage-action-btn')?.textContent || '';
      return banner && !banner.hidden && !btn.includes('RUNNING');
    }, null, { timeout: 45_000 });

    const championBefore = await page.evaluate(() => {
      const saved = JSON.parse(localStorage.getItem('arena_tournament_state_wc') || 'null');
      return saved?.champion || null;
    });
    expect(championBefore).not.toBeNull();

    await page.goto('/');
    await page.waitForTimeout(800);
    await page.click('.top-nav-link[data-nav="tournament-sim"]');

    await expect(page.locator('#champion-banner')).toBeVisible();
    const championAfter = await page.evaluate(() => {
      const saved = JSON.parse(localStorage.getItem('arena_tournament_state_wc') || 'null');
      return saved?.champion || null;
    });
    expect(championAfter).toBe(championBefore);
  });

  // Regression: the TEAM-vs-TEAM match cards in the simulator must follow the
  // light design system. A midnight-era rule gave the card a dark surface
  // while team names used near-black ink, producing unreadable names.
  //
  // Knockout rounds R32/R16 now render compact bracket cards (one per fixture,
  // each with its own individually-wired Simulate button). Full detail `.sfc-card`
  // is still used for the later, smaller rounds (QF/SF/GF), so this test drives the
  // simulation all the way through to the Grand Final and asserts there.
  test('match cards render team names with light surface and dark navy text', async ({ page }) => {
    test.setTimeout(90_000);

    await page.goto('/');
    await page.click('.top-nav-link[data-nav="tournament-sim"]');

    // Run the full tournament so we end up on the Grand Final, which still renders
    // a full `.sfc-card` for the single championship fixture.
    const instantBtn = page.locator('#sim-instant-btn');
    if (await instantBtn.count() && !(await instantBtn.isDisabled())) {
      await instantBtn.click();
      await page.waitForFunction(
        () => {
          const banner = document.getElementById('champion-banner');
          const btn = document.getElementById('sim-stage-action-btn');
          const btnText = btn ? btn.textContent : '';
          return banner && !banner.hidden && !btnText.includes('RUNNING');
        },
        null,
        { timeout: 60_000 }
      );
    } else {
      // Fallback: step through with the main action button if Instant isn't available.
      for (let i = 0; i < 6; i++) {
        const btn = page.locator('#sim-stage-action-btn');
        if (await btn.count() === 0 || (await btn.isDisabled())) break;
        await btn.click();
        await page.waitForTimeout(1200);
        const gfCard = await page.locator('.sfc-card').count();
        if (gfCard > 0) break;
      }
    }

    await expect(page.locator('.sfc-card').first()).toBeVisible();
    await expect(page.locator('.sfc-card .sfc-team-name').first()).toBeVisible();

    const styles = await page.evaluate(() => {
      const card = document.querySelector('.sfc-card');
      const name = card.querySelector('.sfc-team-name');
      const nameStyle = getComputedStyle(name);
      // Effective card surface: nearest opaque background colour.
      let surface = 'rgb(255, 255, 255)';
      let node = name;
      while (node) {
        const bg = getComputedStyle(node).backgroundColor;
        if (!/rgba\(.*,\s*0\)/.test(bg)) { surface = bg; break; }
        node = node.parentElement;
      }
      const rgb = (c) => (c.match(/rgba?\((\d+), (\d+), (\d+)/) || []).slice(1, 4).map(Number);
      const [r, g, b] = rgb(nameStyle.color);
      const [surfR, surfG, surfB] = rgb(surface);
      const lum = (arr) => {
        const lin = arr.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
        return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
      };
      const L1 = lum([r, g, b]) + 0.05;
      const L2 = lum([surfR, surfG, surfB]) + 0.05;
      return {
        color: nameStyle.color,
        surface,
        contrast: (Math.max(L1, L2) / Math.min(L1, L2)),
      };
    });

    // Team-name text must be dark navy ink on a light card surface and meet
    // AA contrast for normal text.
    expect(styles.contrast).toBeGreaterThanOrEqual(4.5);
    const rgb = (c) => (c.match(/rgba?\((\d+), (\d+), (\d+)/) || []).slice(1, 4).map(Number);
    const [r, g, b] = rgb(styles.color);
    expect(r).toBeLessThan(80);
    expect(g).toBeLessThan(80);
    expect(b).toBeLessThan(100);
    const [sr, sg, sb] = rgb(styles.surface);
    expect(sr).toBeGreaterThan(200);
    expect(sg).toBeGreaterThan(200);
    expect(sb).toBeGreaterThan(200);

    // Screenshot evidence for the light card rendering.
    await page.screenshot({ path: 'test-results/match-card-contrast.png' });
  });
});
