# Drobe - Hackathon Progress Tracker

## 🚀 Current Implementation Status

### Phase 1: AI Vision (Grabbit)
- [x] **Upload Component:** Drag & Drop image upload UI.
- [x] **AI Image Analysis:** Uses `gpt-4o` to scan images and detect *multiple* clothing items simultaneously (multi-item support).
- [x] **Data Extraction:** Extracts Category, Gender, Color, Style, and Distinctive Feature for each item.
- **Tools Used:**
  - OpenAI API (Vision `gpt-4o`)
  - Next.js API Routes (`/api/analyze-image`)

### Phase 2: Search & Display
- [x] **Search Integration:** Takes extracted AI attributes and runs highly-targeted Google Shopping searches.
- [x] **Gender-Aware Search:** Reads user's Style DNA gender profile and injects it into all search queries (e.g. "Men's tan leather belt").
- [x] **UI Rendering:** Displays found products in grouped sections (by outfit piece) with compact product cards (`w-[180px] md:w-[220px]`).
- **Tools Used:**
  - Serper.dev API (Google Shopping results)
  - Next.js API Routes (`/api/find-product`)
  - `ProductMatchCard.tsx` component

### Phase 3: Payments & Digital Wardrobe
- [x] **Checkout Flow:** Interactive multi-item cart with a polished `PaymentModal` (Prava Sandbox integration).
- [x] **Prava Sandbox:** Real Prava session creation via `/api/prava/session` and `/api/prava/status`. Popup window for FIDO auth flow.
- [x] **Database Write:** Successfully saves purchased items into `purchases` and `wardrobe_items` tables.
- [x] **Wardrobe Dashboard:** `/dashboard` page — pulls user's saved items, displays in masonry grid with filter tabs (All / Tops / Bottoms / Shoes / Accessories).
- [x] **"Complete This Outfit" Button:** Hover any wardrobe item → ✨ pill appears → deep-links to Iris with item pre-filled as context.
- **Tools Used:**
  - Supabase (PostgreSQL: `purchases`, `wardrobe_items`)
  - Framer Motion (modal animations, layout transitions)
  - Next.js Server Components + Client Components

### Phase 4: Iris The AI Stylist
- [x] **Styling API:** Reads wardrobe from Supabase, sends to Groq LLaMA-3.3-70B (updated from deprecated llama3-70b-8192), generates full outfit.
- [x] **Missing Piece Detection:** Identifies exactly one missing item and searches for it using gender-aware free-form keyword query.
- [x] **Missing Piece Results:** Fixed to use direct keyword search (e.g. "Men's tan leather belt buy online myntra ajio") — no more irrelevant results.
- [x] **Cross-Feature Integration:** Auto-triggers `/api/find-product` to find real-world products for the missing piece.
- [x] **Auto-Save to History:** Every Iris outfit session is automatically saved to the `outfits` table in Supabase.
- [x] **Occasion Quick-Picks:** 8 rich emoji pills — 💼 Job Interview, 🌹 Date Night, ☀️ Casual Day Out, 🎉 Party, ✈️ Travel, 💪 Gym, 💍 Wedding Guest, 🏠 Work From Home.
- [x] **Loading Screen Personality:** Rotating Iris one-liners during loading (8 lines, smooth AnimatePresence fade).
- [x] **Iris Outfit Canvas:**
  - "Iris picked from your wardrobe" — compact 120x140px cards with accent border
  - "Also in your wardrobe that pairs well" — 110x110px cards showing non-selected items
  - Missing piece section with correctly-sized product cards
- [x] **Style DNA Integration:** Iris mentions the user's fit preference and vibe in every outfit explanation.
- [x] **Stylist UI:** Chat-style page at `/dashboard/style` with split canvas + chat layout.
- **Tools Used:**
  - Groq API (`llama-3.3-70b-versatile`)
  - Supabase (wardrobe read + outfits write)
  - Next.js API Routes (`/api/style-outfit`)

### Phase 5: Autonomous Checkout Agent
- [x] **Playwright Browser Agent:** `scripts/agent.ts` — opens a real visible browser, not headless.
- [x] **Google Shopping Redirect:** Detects Google Shopping URLs and auto-clicks "Visit site" to reach the actual retailer (Myntra/Ajio).
- [x] **Full Checkout Flow:** Navigates to product → Add to Bag → Go to Checkout → Fill address → Inject Prava virtual card → Place Order.
- [x] **Agent Overlay UI:** Floating dark overlay shows card number, status, and live step-by-step progress inside the browser.
- [x] **Backend Trigger:** `/api/checkout/route.ts` spawns the agent as a detached child process after Prava session completes.
- **Tools Used:**
  - Playwright (Chromium, non-headless, stealth args)
  - Node.js `child_process.spawn` (shell: true, absolute cwd)

### Phase 6: History
- [x] **Buying History:** `/dashboard/history` — Purchases tab showing every item bought via Drobe: image, category, color, retailer, price, date, status badge.
- [x] **Outfit History:** Outfit Sessions tab — every Iris-built look: occasion, item count, missing piece, "Recreate this look" link.
- [x] **Loading Personality:** Rotating Iris one-liners during history fetch.
- [x] **Sidebar Link:** History added to nav (replaces placeholder Gap Analysis).

### Phase 7: Wishlist
- [x] **Global Zustand Store:** `store/useWishlist.ts` — optimistic updates, shared state across all pages.
- [x] **Heart Button on Every Card:** Appears on hover on all `ProductMatchCard` components. Animates between empty/filled. Instant toggle with DB sync.
- [x] **Wishlist Page:** `/dashboard/wishlist` — compact 5-column grid, hover reveals 3 action buttons (Add to Cart, View on Site, Remove).
- [x] **API:** `GET/POST/DELETE /api/wishlist` with `unique(user_id, product_id)` dedup constraint.
- [x] **Sidebar Link:** Wishlist activated in nav.
- [ ] **DB Migration Needed:** Run SQL below in Supabase SQL Editor.

---

## 📋 Still To Do

### High Impact
- [ ] **Price Drop Alerts:** Save items to wishlist with price at that moment. Re-search to surface cheaper options.
- [ ] **Share Your Look:** Generate a shareable `/look/[id]` page showing the outfit mosaic and buy links.
- [ ] **Outfit Fit Score:** Iris rates the outfit 1-10 for the occasion displayed as a badge.

### Low Effort, High Demo Value
- [ ] **Live "Items Grabbed" Counter:** NumberTicker on landing page showing total items grabbed (Supabase COUNT).
- [ ] **"Is This Worth Buying?" Pre-Purchase Check:** Before checkout, Iris checks if you already own something similar.

### Polish
- [ ] Ensure all empty states look intentional.
- [ ] Final end-to-end test of the entire user journey before submission.
- [ ] Run wishlist DB migration in Supabase SQL Editor.

---

## Pending DB Migration

Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/artgtlhbxtqvuypylacq/sql):

```sql
create table if not exists wishlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  product_id text not null,
  title text,
  price numeric,
  image_url text,
  link text,
  retailer text,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);
alter table wishlist enable row level security;
```

---

## Full Route Map

| Route | Description |
|---|---|
| `/dashboard` | Wardrobe grid + Add piece modal |
| `/dashboard/grab` | AI image scan → product search → cart |
| `/dashboard/style` | Iris AI stylist chat + outfit canvas |
| `/dashboard/history` | Buying history + outfit sessions |
| `/dashboard/wishlist` | Saved product wishlist |
| `/dashboard/profile` | Style DNA profile setup |
| `/api/analyze-image` | GPT-4o image → clothing attributes |
| `/api/find-product` | Serper Google Shopping search (gender-aware) |
| `/api/style-outfit` | Groq Iris outfit generation + auto-save |
| `/api/checkout` | Save purchase + spawn Playwright agent |
| `/api/prava/session` | Create Prava Sandbox virtual card session |
| `/api/prava/status` | Poll Prava session status |
| `/api/history` | Fetch purchases + outfits |
| `/api/wishlist` | GET / POST / DELETE wishlist items |
| `/api/wardrobe` | GET / POST / DELETE wardrobe items |
| `/api/profile` | Save Style DNA |
