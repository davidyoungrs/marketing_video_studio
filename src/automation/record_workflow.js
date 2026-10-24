const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function recordWorkflow() {
  const recordingsDir = path.join(__dirname, '../../recordings');
  if (!fs.existsSync(recordingsDir)) {
    fs.mkdirSync(recordingsDir, { recursive: true });
  }

  console.log('Starting Playwright automated capture session...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--window-size=1920,1080', '--autoplay-policy=no-user-gesture-required']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: recordingsDir,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();

  console.log('Navigating to landing page...');
  await page.goto('https://www.reallysimpleapps.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Accept cookies if present
  try {
    const acceptBtn = page.getByRole('button', { name: 'Accept All' });
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
      await page.waitForTimeout(1000);
    }
  } catch(e) {}

  // Beat 1: Landing Page & Hook
  console.log('Beat 1: Interacting with landing page...');
  await page.mouse.move(960, 400, { steps: 25 });
  await page.waitForTimeout(1500);

  // Click "Start for Free"
  const startForFreeBtn = page.getByRole('link', { name: 'Start for Free' }).first();
  await startForFreeBtn.hover();
  await page.waitForTimeout(1000);
  await startForFreeBtn.click();

  // Beat 2: In the card builder
  console.log('Beat 2: Card builder loaded, entering details...');
  await page.waitForURL('**/create', { timeout: 15000 });
  await page.waitForTimeout(2000);

  // Fill in synthetic details
  const nameInput = page.getByPlaceholder('John Doe');
  await nameInput.click();
  await nameInput.pressSequentially('Sarah Jenkins', { delay: 100 });
  await page.waitForTimeout(800);

  const titleInput = page.getByPlaceholder('Chief Executive Officer');
  await titleInput.click();
  await titleInput.pressSequentially('Head of Partnerships', { delay: 90 });
  await page.waitForTimeout(800);

  const companyInput = page.getByPlaceholder('Acme Corp');
  await companyInput.click();
  await companyInput.pressSequentially('Apex Dynamics', { delay: 90 });
  await page.waitForTimeout(1000);

  // Bio
  const bioInput = page.getByPlaceholder('Tell us about yourself...');
  await bioInput.click();
  await bioInput.pressSequentially('Scaling digital growth and enterprise collaborations globally.', { delay: 60 });
  await page.waitForTimeout(1200);

  // Beat 3: Contact & Channels
  console.log('Beat 3: Adding contact numbers & links...');
  const mobileInput = page.getByPlaceholder('Mobile');
  await mobileInput.click();
  await mobileInput.pressSequentially('555-019-2834', { delay: 80 });
  await page.waitForTimeout(800);

  const emailInput = page.getByPlaceholder('Email Address');
  if (await emailInput.count() > 0) {
    await emailInput.first().click();
    await emailInput.first().pressSequentially('sarah.jenkins@apexdynamics.io', { delay: 70 });
    await page.waitForTimeout(1000);
  }

  // Beat 4: Themes & Typography
  console.log('Beat 4: Testing theme palettes & typography...');
  const themes = ['MIDNIGHT', 'AURORA', 'SUNSET', 'OCEAN'];
  for (const theme of themes) {
    const themeBtn = page.getByRole('button', { name: theme, exact: true });
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(1200);
    }
  }

  const fontBtn = page.getByRole('button', { name: 'Outfit', exact: true });
  if (await fontBtn.isVisible()) {
    await fontBtn.click();
    await page.waitForTimeout(1200);
  }

  // Beat 5: Review & Choose Plan
  console.log('Beat 5: Reviewing card and plan...');
  const reviewBtn = page.getByRole('button', { name: 'Review & Choose Plan' });
  if (await reviewBtn.isVisible()) {
    await reviewBtn.hover();
    await page.waitForTimeout(1000);
    await reviewBtn.click();
    await page.waitForTimeout(3000);
  }

  console.log('Closing session to finalize raw footage video...');
  await page.close();
  await context.close();
  await browser.close();

  // Find the generated video file
  const videoFiles = fs.readdirSync(recordingsDir).filter(f => f.endsWith('.webm'));
  if (videoFiles.length > 0) {
    const latestVideo = path.join(recordingsDir, videoFiles[videoFiles.length - 1]);
    const targetMp4 = path.join(recordingsDir, 'raw_footage.mp4');
    console.log(`Video recorded: ${latestVideo}. Converting to MP4: ${targetMp4}`);
    const cp = require('child_process');
    cp.execSync(`ffmpeg -y -i "${latestVideo}" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p "${targetMp4}"`);
    console.log('Genuine browser footage captured and converted successfully!');
  }
}

recordWorkflow().catch(err => {
  console.error('Recording workflow error:', err);
  process.exit(1);
});
