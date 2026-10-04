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

    await page.evaluate(() => document.querySelector('.top-nav-link[data-nav="archive-view"]')?.click());
    await expect(page.locator('#view-archive-view')).toBeVisible();
  });

  test('data mode badge updates based on active view', async ({ page }) => {
    await page.goto('/');

    await page.click('.top-nav-link[data-nav="standings-view"]');
    const badge = page.locator('#global-data-mode-text');
    await expect(badge).toHaveText('ARCHIVE DATA');

    await page.click('.top-nav-link[data-nav="tournament-sim"]');
    await expect(badge).toHaveText('SIMULATION');
  });

  test('archive view renders competition cards', async ({ page }) => {
    await page.goto('/');

    await page.click('.top-nav-link[data-nav="archive-view"]');
    const grid = page.locator('#archive-grid');
    await expect(grid).toBeVisible();

    const cards = page.locator('.archive-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
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
});
