import { chromium } from 'playwright';
import type { Page } from 'playwright';
import path from 'path';
import fs from 'fs';

async function smoothMouseMove(page: Page, x: number, y: number, steps = 30) {
  await page.mouse.move(x, y, { steps });
}

async function typeLikeUser(page: Page, selector: string, text: string) {
  const locator = page.locator(selector);
  await locator.click();
  for (const char of text) {
    await page.keyboard.type(char, { delay: Math.random() * 80 + 30 });
  }
}

async function runBRoll() {
  console.log('🎥 Starting ClawSearchDarkDesk B-Roll Recording...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 60 });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: 'recordings/', size: { width: 1920, height: 1080 } }
  });

  const page = await context.newPage();

  console.log('Loading app...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  
  await smoothMouseMove(page, 960, 540);
  await page.waitForTimeout(1000);

  console.log('Navigating to Dashboard...');
  await page.click('a[href="/dashboard"]');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('Entering repo URL...');
  await typeLikeUser(page, '#sweep-input', 'https://github.com/solana-labs/solana-pay');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Enter');
  
  await page.waitForTimeout(5000);

  await page.close();
  await context.close();
  
  const videoPath = await page.video()?.path();
  if (videoPath) {
    const finalPath = path.join('/Users/edycu/Projects/DemoStudio/public/projects/ClawSearchDarkDesk', 'ClawSearchDarkDesk_BRoll.webm');
    const finalDir = path.dirname(finalPath);
    if (!fs.existsSync(finalDir)) fs.mkdirSync(finalDir, { recursive: true });
    fs.renameSync(videoPath, finalPath);
    console.log(`🎬 B-Roll recorded at: ${finalPath}`);
  }

  await browser.close();
}

runBRoll().catch(console.error);
