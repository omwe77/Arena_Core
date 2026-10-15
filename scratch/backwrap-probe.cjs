const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1200);
  await page.evaluate(() => { document.querySelector('.home-comp-card[data-tourn="pl"]')?.click(); });
  await page.waitForTimeout(900);
  await page.evaluate(() => { document.querySelector('.top-nav-link[data-nav="standings-view"]')?.click(); });
  await page.waitForTimeout(1000);
  const info = await page.evaluate(() => {
    const w = document.getElementById('standings-laliga-back');
    const b = document.getElementById('btn-standings-back-laliga');
    const wrapInDom = !!w;
    const section = document.getElementById('view-standings-view');
    return {
      wrapInDom,
      wHidden: w ? w.hidden : null,
      wDisplay: w ? getComputedStyle(w).display : null,
      wHtml: w ? w.outerHTML.slice(0, 300) : null,
      btnOnclick: b ? String(b.onclick).slice(0, 80) : null,
      sectionChildren: section ? [...section.children].map(c => c.className || c.tagName).slice(0, 10) : null,
      sectionHtmlHead: section ? section.innerHTML.slice(0, 400) : null,
    };
  });
  console.log(JSON.stringify(info, null, 1));
  await browser.close();
})();
