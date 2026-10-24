const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const overlaysDir = path.join(__dirname, '../../overlays');
if (!fs.existsSync(overlaysDir)) {
  fs.mkdirSync(overlaysDir, { recursive: true });
}

const captions = [
  { id: 'beat1', title: 'CREATE IN SECONDS', subtitle: '100% Free Interactive Digital Card' },
  { id: 'beat2', title: 'REAL-TIME LIVE PREVIEW', subtitle: 'Dynamic Mobile Device Synchronization' },
  { id: 'beat3', title: 'ONE-TAP CONTACT SAVING', subtitle: 'Instant Phone, Email & Social Connect' },
  { id: 'beat4', title: 'CURATED DESIGNER THEMES', subtitle: 'Tailored Typography & Modern Palettes' },
  { id: 'beat5', title: 'START FOR FREE TODAY', subtitle: 'reallysimpleapps.com' }
];

async function generateOverlays() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  for (const cap of captions) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            width: 1920px;
            height: 1080px;
            background: transparent;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            position: relative;
          }
          .badge-container {
            position: absolute;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            background: rgba(15, 23, 42, 0.88);
            border: 1px solid rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(16px);
            padding: 16px 36px;
            border-radius: 9999px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08);
          }
          .title {
            color: #38bdf8;
            font-size: 26px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin-bottom: 4px;
          }
          .subtitle {
            color: #f8fafc;
            font-size: 20px;
            font-weight: 500;
            letter-spacing: 0.02em;
          }
        </style>
      </head>
      <body>
        <div class="badge-container">
          <div class="title">${cap.title}</div>
          <div class="subtitle">${cap.subtitle}</div>
        </div>
      </body>
      </html>
    `;
    await page.setContent(html);
    const outPng = path.join(overlaysDir, `${cap.id}.png`);
    await page.screenshot({ path: outPng, omitBackground: true });
    console.log(`Generated overlay: ${outPng}`);
  }

  await browser.close();
}

generateOverlays().catch(err => {
  console.error(err);
  process.exit(1);
});
