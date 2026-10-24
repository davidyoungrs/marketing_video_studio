const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runLogin() {
  const sessionDir = path.join(__dirname, '../../.auth_session');
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  console.log('======================================================');
  console.log('Launching browser for one-time interactive login...');
  console.log('Please log into Vercel / your preview account in the opened window.');
  console.log('Once you see the application landing page / dashboard,');
  console.log('simply close the browser window or press Enter here.');
  console.log('======================================================');

  const context = await chromium.launchPersistentContext(sessionDir, {
    headless: false,
    channel: 'chrome',
    viewport: { width: 1440, height: 900 }
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  
  const targetUrl = 'https://reallysimple-4gth097za-davidyoungrs-projects.vercel.app';
  await page.goto(targetUrl).catch(e => console.log('Navigation:', e.message));

  // Wait until user closes the browser or enters a newline
  await new Promise((resolve) => {
    context.on('close', () => {
      console.log('Browser window closed. Session saved successfully in .auth_session/.');
      resolve();
    });

    process.stdin.resume();
    process.stdin.on('data', async () => {
      console.log('Enter pressed. Closing browser and saving session...');
      await context.close().catch(() => {});
      resolve();
    });
  });

  process.exit(0);
}

runLogin().catch(err => {
  console.error('Login error:', err);
  process.exit(1);
});
