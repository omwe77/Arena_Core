const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const shots = [
    { name: 'home-desktop', width: 1440, height: 900 },
    { name: 'home-mobile', width: 390, height: 844 },
  ];
  for (const s of shots) {
    const page = await browser.newPage({ viewport: { width: s.width, height: s.height } });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `scratch/${s.name}.png`, fullPage: true });
    await page.close();
  }
  await browser.close();
  console.log('SHOTS DONE');
})();
