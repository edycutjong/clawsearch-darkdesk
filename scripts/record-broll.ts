import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUT_DIR = path.join(process.cwd(), 'docs', 'assets');
const BASE_URL = 'http://localhost:3000';
const VIEWPORT = { width: 1440, height: 900 };

/* eslint-disable @typescript-eslint/no-explicit-any */
async function recordScene(
  browser: any,
  sceneName: string,
  url: string,
  action: (page: any) => Promise<void>
) {
  console.log(`\n🎬 Preparing scene: ${sceneName}...`);
  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: {
      dir: OUT_DIR,
      size: VIEWPORT,
    },
  });

  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });

  // Hide Next.js dev indicator for clean recordings
  await page.addStyleTag({
    content: `
      nextjs-portal { display: none !important; }
      [data-nextjs-dialog-overlay] { display: none !important; }
    `,
  });

  // Let initial CSS animations settle
  await page.waitForTimeout(2500);

  console.log(`🎥 Recording: ${sceneName}...`);
  await action(page);

  const videoPath = await page.video()?.path();
  await context.close(); // finalizes the video file

  if (videoPath && fs.existsSync(videoPath)) {
    const finalPath = path.join(OUT_DIR, `broll-${sceneName}.webm`);
    fs.renameSync(videoPath, finalPath);
    console.log(`✅ Saved broll-${sceneName}.webm`);
  }
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log('🎬 ClawSearch DarkDesk — B-Roll Recording');
  console.log('==========================================');
  console.log(`Output: ${OUT_DIR}\n`);

  const browser = await chromium.launch({ headless: true });

  // ─── Scene 1: Landing Hero ─────────────────────────────────
  // Captures: mesh gradient, floating orbs, code rain, particle
  // effects, badge glow, headline shimmer, and count-up stats
  await recordScene(browser, 'landing-hero', BASE_URL, async (page) => {
    // Watch the full entrance animation sequence
    await page.waitForTimeout(6000);
  });

  // ─── Scene 2: Feature Cards Spotlight ──────────────────────
  // Captures: spotlight mouse-follow effect on glassmorphism cards,
  // card-3d tilt, and shine effect
  await recordScene(browser, 'feature-cards', BASE_URL, async (page) => {
    // Scroll to feature grid
    const featureGrid = page.locator('.stagger-children');
    await featureGrid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // Hover across each card to trigger spotlight + 3D tilt
    const cards = page.locator('.card-3d');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const box = await card.boundingBox();
      if (box) {
        // Sweep mouse across card for spotlight + 3D effect
        await page.mouse.move(box.x + 20, box.y + box.height / 2, { steps: 15 });
        await page.waitForTimeout(400);
        await page.mouse.move(box.x + box.width - 20, box.y + box.height / 2, { steps: 25 });
        await page.waitForTimeout(800);
      }
    }
    await page.mouse.move(0, 0);
    await page.waitForTimeout(1000);
  });

  // ─── Scene 3: Trade Desk Overview ──────────────────────────
  // Captures: full 3-column Bloomberg Terminal layout with all
  // panels sliding in, animated grid background, floating orbs
  await recordScene(browser, 'trade-desk', `${BASE_URL}/trade`, async (page) => {
    // Watch the staggered panel slide-in animations
    await page.waitForTimeout(6000);
  });

  // ─── Scene 4: AI Chat Negotiation ─────────────────────────
  // Captures: terminal scanlines, typing animation in AI Chat,
  // ChainGPT response streaming with purple accent
  await recordScene(browser, 'ai-negotiation', `${BASE_URL}/trade`, async (page) => {
    // Wait for panels to load
    await page.waitForTimeout(3000);

    // Type a trade negotiation message
    const chatInput = page.locator('input[placeholder], textarea[placeholder]').first();
    if (await chatInput.count() > 0) {
      await chatInput.click();
      await page.waitForTimeout(500);

      // Type character by character for cinematic effect
      const message = 'Buy 500 tokenized T-Bills at 4.85% yield';
      for (const char of message) {
        await chatInput.press(char === ' ' ? 'Space' : char);
        await page.waitForTimeout(60 + Math.random() * 40);
      }
      await page.waitForTimeout(800);

      // Submit the message
      await page.keyboard.press('Enter');
      await page.waitForTimeout(5000);
    } else {
      // Fallback: just capture the panel with existing content
      await page.waitForTimeout(5000);
    }
  });

  // ─── Scene 5: Escrow Flow ─────────────────────────────────
  // Captures: DarkDeskEscrow component with gradient-border,
  // escrow state transitions, confidential token visualization
  await recordScene(browser, 'escrow-flow', `${BASE_URL}/trade`, async (page) => {
    await page.waitForTimeout(3000);

    // Focus on the escrow panel (center column)
    const escrowPanel = page.locator('text=Confidential Escrow').first();
    if (await escrowPanel.count() > 0) {
      await escrowPanel.scrollIntoViewIfNeeded();
    }
    await page.waitForTimeout(1500);

    // Try to interact with escrow buttons
    const escrowButtons = page.locator('.lg\\:col-span-4 button');
    const btnCount = await escrowButtons.count();
    for (let i = 0; i < btnCount; i++) {
      await escrowButtons.nth(i).hover();
      await page.waitForTimeout(1200);
    }
    await page.waitForTimeout(2000);
  });

  // ─── Scene 6: Split-Screen Verifier ───────────────────────
  // Captures: Arbiscan (red/encrypted) vs DarkDesk (green/clear)
  // side-by-side comparison with scanline overlay
  await recordScene(browser, 'split-verifier', `${BASE_URL}/trade`, async (page) => {
    await page.waitForTimeout(3000);

    // Scroll to the Dark Pool Analytics panel (bottom-right)
    const analyticsPanel = page.locator('text=Dark Pool Analytics').first();
    if (await analyticsPanel.count() > 0) {
      await analyticsPanel.scrollIntoViewIfNeeded();
    }
    await page.waitForTimeout(5000);
  });

  await browser.close();

  console.log('\n==========================================');
  console.log('🎉 All B-Roll clips saved to docs/assets/');
  console.log('   Clips generated:');
  console.log('   • broll-landing-hero.webm');
  console.log('   • broll-feature-cards.webm');
  console.log('   • broll-trade-desk.webm');
  console.log('   • broll-ai-negotiation.webm');
  console.log('   • broll-escrow-flow.webm');
  console.log('   • broll-split-verifier.webm');
}

main().catch((err) => {
  console.error('❌ Error recording B-Roll:', err);
  process.exit(1);
});

export {};
