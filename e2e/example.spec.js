// @ts-check
import { test, expect } from '@playwright/test';

test.describe('ARENA_CORE Platform Tests', () => {
  test('has correct page title and header elements', async ({ page }) => {
    await page.goto('/');

    // Expect page title
    await expect(page).toHaveTitle(/ARENA CORE/);

    // Expect Header pitch track and ARENA_CORE striker runner
    const pitchTrack = page.locator('#header-pitch-track');
    await expect(pitchTrack).toBeVisible();

    const arenaActor = page.locator('#arena-pitch-actor');
    await expect(arenaActor).toBeVisible();
  });

  test('renders World Cup hero and interactive video HUD', async ({ page }) => {
    await page.goto('/');

    // World cup showcase hero exists
    const wcHero = page.locator('#wc-interactive-hero');
    await expect(wcHero).toBeVisible();

    // Verify hero video background wrapper exists
    const videoBg = page.locator('#hero-video-bg-wc');
    await expect(videoBg).toBeAttached();

    // Verify Interactive Hero Video HUD exists
    const hud = page.locator('#hero-video-hud-wc');
    await expect(hud).toBeVisible();

    // Verify Sound toggle button exists
    const soundBtn = page.locator('#hvh-sound-btn-wc');
    await expect(soundBtn).toBeVisible();

    // Verify Play/Pause toggle button exists
    const playBtn = page.locator('#hvh-play-btn-wc');
    await expect(playBtn).toBeVisible();

    // Verify Video / Artwork toggle button exists
    const modeBtn = page.locator('#hvh-bg-btn-wc');
    await expect(modeBtn).toBeVisible();
  });

  test('hero video HUD controls respond to clicks', async ({ page }) => {
    await page.goto('/');
    // Dismiss any Vite HMR error overlay that might intercept pointer events
    await page.keyboard.press('Escape');

    // 1. Test Sound Toggle
    const soundBtn = page.locator('#hvh-sound-btn-wc');
    await expect(soundBtn).toBeVisible();
    await soundBtn.click();
    await expect(soundBtn).toHaveClass(/hvh-btn-active/);

    // 2. Test Playback Toggle
    const playBtn = page.locator('#hvh-play-btn-wc');
    await expect(playBtn).toBeVisible();
    await playBtn.click();
    await expect(playBtn).toHaveClass(/hvh-btn-paused/);

    // 3. Test Mode Toggle (Switch between Video and Artwork)
    const modeBtn = page.locator('#hvh-bg-btn-wc');
    await expect(modeBtn).toBeVisible();
    await modeBtn.click();
    await expect(modeBtn).toHaveClass(/hvh-btn-active/);
  });

  test('custom draw modal opens and closes correctly', async ({ page }) => {
    await page.goto('/');

    const customDrawBtn = page.locator('#btn-wc-custom-draw');
    await expect(customDrawBtn).toBeVisible();
    await customDrawBtn.click();

    const modal = page.locator('#wc-draw-modal');
    await expect(modal).toBeVisible();

    // Close modal via close button
    const closeBtn = page.locator('#wc-draw-close');
    await closeBtn.click();
    await expect(modal).toBeHidden();
  });

  test('each tournament has its own distinct hero video', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // 1. Check World Cup hero video
    const wcIframe = page.locator('#hero-video-iframe-wc');
    await expect(wcIframe).toHaveAttribute('src', /I_kDmkCBm_c/);

    // 2. Switch to UCL
    const uclTab = page.locator('.tourn-tab[data-tourn="ucl"]');
    if (await uclTab.count() > 0) {
      await uclTab.click();
      await page.waitForTimeout(500);
      const uclIframe = page.locator('#hero-video-iframe-ucl');
      await expect(uclIframe).toHaveAttribute('src', /V_YxSJXR9D4/);
    }

    // 3. Switch to Premier League
    const plTab = page.locator('.tourn-tab[data-tourn="pl"]');
    if (await plTab.count() > 0) {
      await plTab.click();
      await page.waitForTimeout(500);
      const plIframe = page.locator('#hero-video-iframe-pl');
      await expect(plIframe).toHaveAttribute('src', /wpcKyur-kbI/);
    }
  });
});


