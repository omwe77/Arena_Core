const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const counts = await page.evaluate(() => {
    const sheet = document.querySelector('link[href*="style.css"]');
    return {
      sheets: document.styleSheets.length,
      styleCssRules: sheet ? sheet.sheet.cssRules.length : 'no link',
      sheetHref: sheet ? sheet.href : null,
    };
  });
  console.log(JSON.stringify(counts));
  await browser.close();
})();
