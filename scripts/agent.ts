import { chromium } from 'playwright';

const MOCK_DETAILS = {
  name: "Drobe Demo",
  email: "agent@drobe.ai",
  phone: "9876543210",
  address: "123 Hacker Street",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560001",
  expiry: "12/30",
  cvv: "159",
};

async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function setStatus(page: any, msg: string) {
  await page.evaluate((text: string) => {
    const el = document.getElementById('drobe-agent-status');
    if (el) el.innerHTML = text;
  }, msg).catch(() => {});
  console.log(`[AGENT] ${msg.replace(/<[^>]+>/g, '')}`);
}

async function injectOverlay(page: any, cardLastFour: string) {
  await page.evaluate((last4: string) => {
    // Remove existing overlay if any
    document.getElementById('drobe-agent-overlay')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'drobe-agent-overlay';
    overlay.innerHTML = `
      <div style="
        position: fixed; bottom: 20px; right: 20px; 
        background: rgba(10,10,10,0.95); color: #fff; 
        padding: 18px 22px; border-radius: 14px; 
        font-family: -apple-system, monospace; 
        z-index: 2147483647; 
        box-shadow: 0 20px 60px rgba(0,0,0,0.8); 
        border: 1px solid rgba(255,255,255,0.15); 
        pointer-events: none;
        min-width: 280px;
      ">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
          <span style="font-size: 20px;">🤖</span>
          <div>
            <div style="font-size: 13px; font-weight: 700; color: #fff; letter-spacing: -0.3px;">Drobe Autonomous Checkout</div>
            <div style="font-size: 10px; color: #4ade80; margin-top: 2px; font-weight: 600; letter-spacing: 1px;">● ACTIVE</div>
          </div>
        </div>
        <div style="font-size: 10px; color: rgba(255,255,255,0.5); margin-bottom: 10px; font-family: monospace; letter-spacing: 2px;">
          PRAVA VIRTUAL CARD: •••• •••• •••• ${last4}
        </div>
        <div style="font-size: 12px; line-height: 1.5; color: rgba(255,255,255,0.85);" id="drobe-agent-status">
          Initializing...
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }, cardLastFour).catch(() => {});
}

async function clickFirst(page: any, selectors: string[]): Promise<boolean> {
  for (const sel of selectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 1500 }).catch(() => false)) {
        await el.scrollIntoViewIfNeeded().catch(() => {});
        await el.hover().catch(() => {});
        await sleep(400);
        await el.click({ force: true, timeout: 3000 });
        console.log(`[AGENT] Clicked: ${sel}`);
        return true;
      }
    } catch (_) {}
  }
  return false;
}

async function fillInputs(page: any, token: string) {
  const inputs = await page.locator('input:visible').all();
  for (const input of inputs) {
    try {
      const attrs: Record<string, string> = {};
      for (const attr of ['name', 'id', 'placeholder', 'autocomplete', 'type']) {
        attrs[attr] = ((await input.getAttribute(attr)) || '').toLowerCase();
      }
      const full = Object.values(attrs).join(' ');

      if (full.includes('first') && !full.includes('last')) {
        await input.fill('Drobe').catch(() => {});
      } else if (full.includes('last')) {
        await input.fill('Demo').catch(() => {});
      } else if (full.includes('name') && !full.includes('card')) {
        await input.fill(MOCK_DETAILS.name).catch(() => {});
      } else if (full.includes('email')) {
        await input.fill(MOCK_DETAILS.email).catch(() => {});
      } else if (full.includes('phone') || full.includes('mobile') || attrs.type === 'tel') {
        await input.fill(MOCK_DETAILS.phone).catch(() => {});
      } else if (full.includes('address') || full.includes('street') || full.includes('line1')) {
        await input.fill(MOCK_DETAILS.address).catch(() => {});
      } else if (full.includes('city')) {
        await input.fill(MOCK_DETAILS.city).catch(() => {});
      } else if (full.includes('state')) {
        await input.fill(MOCK_DETAILS.state).catch(() => {});
      } else if (full.includes('zip') || full.includes('postal') || full.includes('pin')) {
        await input.fill(MOCK_DETAILS.pincode).catch(() => {});
      } else if ((full.includes('card') || full.includes('pan')) && (full.includes('number') || full.includes('num'))) {
        await input.fill(token).catch(() => {});
      } else if (full.includes('cvv') || full.includes('cvc') || full.includes('security')) {
        await input.fill(MOCK_DETAILS.cvv).catch(() => {});
      } else if (full.includes('exp') || full.includes('mm/yy') || full.includes('valid')) {
        await input.fill(MOCK_DETAILS.expiry).catch(() => {});
      }
    } catch (_) {}
  }
}

async function resolveUrl(page: any, url: string, last4: string): Promise<string> {
  const u = url.toLowerCase();

  // If this is a Google Shopping or redirect URL, click through to the actual retailer
  if (u.includes('google.com/search') || u.includes('google.com/shopping') || u.includes('goog')) {
    console.log('[AGENT] Detected Google Shopping URL — navigating and clicking Visit Site...');
    await setStatus(page, 'Google Shopping detected — clicking through to retailer...');
    await sleep(1500);

    // Try clicking "Visit site" button on Google Shopping
    const visitClicked = await clickFirst(page, [
      'a:has-text("Visit site")',
      'a[data-url*="myntra"]',
      'a[data-url*="ajio"]',
      'a[data-url*="amazon"]',
      'a[href*="myntra"]',
      'a[href*="ajio"]',
      'a[href*="amazon"]',
    ]);

    if (visitClicked) {
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
      await sleep(2000);
      return page.url();
    }
  }
  return url;
}

async function runAgent() {
  const url = process.argv[2];
  const token = process.argv[3] || '4111111111111111';

  if (!url) {
    console.error("Usage: npx tsx scripts/agent.ts <url> <token>");
    process.exit(1);
  }

  const last4 = token.slice(-4);
  console.log(`\n[AGENT] ═══════════════════════════════════`);
  console.log(`[AGENT]   Drobe Autonomous Checkout`);
  console.log(`[AGENT] ───────────────────────────────────`);
  console.log(`[AGENT]   URL: ${url}`);
  console.log(`[AGENT]   Card: •••• •••• •••• ${last4}`);
  console.log(`[AGENT] ═══════════════════════════════════\n`);

  const browser = await chromium.launch({
    headless: false,
    slowMo: 350,
    args: ['--start-maximized', '--disable-blink-features=AutomationControlled', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: null,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-IN',
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    (window as any).chrome = { runtime: {} };
  });

  const page = await context.newPage();

  try {
    // ── Step 1: Navigate ──────────────────────────────────────────────
    console.log('[AGENT] Navigating...');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await sleep(2500);
    await injectOverlay(page, last4);

    // ── Step 1b: Escape Google Shopping if needed ─────────────────────
    const currentUrl = page.url();
    if (currentUrl.includes('google.com') || currentUrl.includes('goog')) {
      await setStatus(page, 'Google Shopping page detected.<br>Clicking through to retailer...');
      await sleep(1000);

      const visitClicked = await clickFirst(page, [
        'a:has-text("Visit site")',
        'a[aria-label*="Myntra"]',
        'a[href*="myntra.com"]',
        'a[href*="ajio.com"]',
        'a[href*="amazon.in"]',
      ]);

      if (visitClicked) {
        await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
        await sleep(2000);
        await injectOverlay(page, last4);
        await setStatus(page, `Arrived at ${new URL(page.url()).hostname}!`);
        await sleep(1000);
      }
    }

    await setStatus(page, 'Scanning product page...');
    await sleep(1500);

    // ── Step 2: Add to Cart/Bag ───────────────────────────────────────
    await setStatus(page, 'Looking for Add to Bag / Buy Now...');
    const addClicked = await clickFirst(page, [
      'button:has-text("ADD TO BAG")',
      'button:has-text("Add to Bag")',
      'button:has-text("ADD TO CART")',
      'button:has-text("Add to Cart")',
      'button:has-text("BUY NOW")',
      'button:has-text("Buy Now")',
      '[data-action="add-to-bag"]',
      '[class*="addToBag"]',
      '.add-to-bag',
    ]);

    if (addClicked) {
      await setStatus(page, '✅ Added to bag! Waiting for confirmation...');
      await sleep(3000);
    } else {
      await setStatus(page, '⚠️ Add to bag button not found — scrolling to find it...');
      await page.mouse.wheel(0, 400);
      await sleep(1000);
      // Try once more after scroll
      await clickFirst(page, ['button:has-text("ADD TO BAG")', 'button:has-text("Add to Bag")']);
      await sleep(2000);
    }

    // ── Step 3: Go to Checkout ────────────────────────────────────────
    await setStatus(page, 'Navigating to checkout...');
    const checkoutClicked = await clickFirst(page, [
      'button:has-text("PROCEED TO BUY")',
      'button:has-text("Proceed to Buy")',
      'a:has-text("PROCEED TO BUY")',
      'button:has-text("CHECKOUT")',
      'button:has-text("Checkout")',
      'a:has-text("Proceed to Checkout")',
      'a:has-text("View Bag & Checkout")',
      'a[href*="/checkout"]',
    ]);

    if (checkoutClicked) {
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
      await sleep(3000);
      await injectOverlay(page, last4);
      await setStatus(page, 'Reached checkout page!');
      await sleep(1000);
    }

    // ── Step 4: Handle Login wall — try guest or proceed anyway ───────
    await setStatus(page, 'Checking login requirements...');
    const guestBtn = await clickFirst(page, [
      'button:has-text("Continue as Guest")',
      'button:has-text("Guest Checkout")',
      'a:has-text("Skip")',
      'button:has-text("Skip")',
    ]);
    if (guestBtn) {
      await sleep(2000);
      await injectOverlay(page, last4);
    }

    // ── Step 5: Fill Address form ─────────────────────────────────────
    await setStatus(page, 'Filling shipping address...');
    await fillInputs(page, token);
    await sleep(1500);

    await clickFirst(page, [
      'button:has-text("CONTINUE")',
      'button:has-text("Continue")',
      'button:has-text("Next")',
      'button:has-text("Confirm Address")',
      'button:has-text("SAVE AND CONTINUE")',
    ]);
    await sleep(2500);
    await injectOverlay(page, last4);

    // ── Step 6: Fill Payment ──────────────────────────────────────────
    await setStatus(page, `💳 Injecting Prava Virtual Card: •••• •••• •••• ${last4}...`);
    
    // Select "Credit/Debit Card" payment option if visible
    await clickFirst(page, [
      'label:has-text("Credit")',
      'label:has-text("Debit")',
      'button:has-text("Add Card")',
      'div:has-text("Credit / Debit"):visible',
      '[data-payment="card"]',
    ]);
    await sleep(1000);

    await fillInputs(page, token);
    await sleep(2000);

    // ── Step 7: Submit Order ──────────────────────────────────────────
    await setStatus(page, '🚀 Placing order...');
    const submitted = await clickFirst(page, [
      'button:has-text("PLACE ORDER")',
      'button:has-text("Place Order")',
      'button:has-text("PAY NOW")',
      'button:has-text("Pay Now")',
      'button:has-text("CONFIRM ORDER")',
      'button:has-text("Confirm and Pay")',
      'button:has-text("PAY & CONFIRM")',
      'input[type="submit"]',
    ]);

    await sleep(3000);
    await injectOverlay(page, last4);

    if (submitted) {
      await setStatus(page, '📡 Order submitted!<br><small style="color:#fbbf24">Merchant may decline — expected in sandbox mode.</small>');
    } else {
      await setStatus(page, '⚠️ Submit button not found.<br><small>Merchant likely requires login. Page is open for your review.</small>');
    }

    console.log('[AGENT] ✅ Checkout flow complete. Browser stays open for 20s...');
    await sleep(20000);

  } catch (err: any) {
    console.error('[AGENT] ❌ Error:', err.message);
    await setStatus(page, `❌ Error: ${err.message}`).catch(() => {});
    await sleep(8000);
  } finally {
    await browser.close();
    console.log('[AGENT] Browser closed.');
  }
}

runAgent();
