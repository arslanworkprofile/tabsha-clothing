# Tabsha Clothing Studio — Phase 1

A premium fashion storefront + basic admin, built on Next.js 15 (App Router), React 19, TypeScript, and Tailwind, using your brand tokens (Ash Grey `#2F343A`, Poppins headings, Inter body).

This is **Phase 1** of the full spec you provided. The original brief describes a platform on the scale of a full production marketplace (multi-gateway payments, full auth with Google login, order management, coupons, analytics, SEO pipeline, etc.) — genuinely months of work. Phase 1 focuses on a real, working core: storefront, cart, checkout UI, and a basic admin for managing products with local image uploads. Everything below actually runs; nothing is a mockup.

## What's included and working

- **Storefront**: home (hero, categories, new arrivals/trending/best sellers rails, testimonials), shop page with live filters (category, gender, size, color, sort) + pagination-ready data layer, product detail page (gallery, color/size/qty, related products), slide-out cart + cart page, checkout page (Cash on Delivery; card gateways stubbed for Phase 2).
- **Admin auth (real, wired up)**: `/admin/login` authenticates against `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` in `.env.local`, issues a JWT in an httpOnly cookie, and `middleware.ts` gates every `/admin/*` page plus the products/categories/settings/upload write APIs (POST/PUT/DELETE) behind a valid session. Default dev login: `admin@tabsha.com` / `Tabsha@Admin123` — see "Admin login" below to change it.
- **Customer auth (real, wired up)**: `/login` and `/register` are bcrypt + JWT, same pattern as admin auth, gating `/dashboard/*`. No Google login — removed on request rather than left as a dead button.
- **Admin panel**: `/admin` dashboard with stat cards (linking into each section), plus:
  - **Real, persisted**: Products (list/add/edit/delete with image upload), Categories (list/add/edit/delete with image upload), Customers (real registered users), Settings (store name, currency, shipping fees — actually saved to disk).
  - **Sample data / UI shells**: Orders, Coupons, Reviews — each page says so plainly; the backend models (Order, Coupon, Review) don't exist yet. See "Not yet built" below.
- **Static pages**: About, FAQ, Contact, Privacy, Terms, Returns, Shipping.
- **Demo product imagery**: original, procedurally generated textile artwork (jewel-tone gradients, temple borders, mandala motifs) rather than scraped photos — see "About the demo images" below. Includes six saree products (Banarasi, Kanjivaram, chiffon, georgette, royal fuchsia, peacock teal) alongside the original Western-wear catalog.
- **Image uploads**: drag-and-drop, multi-file, preview, delete, replace. Files are compressed, resized (max 1600px edge), and converted to WebP via `sharp`, saved to `/public/uploads/products`, with only the path stored in the database — no Cloudinary, as requested.
- **Data layer**: runs out of the box on a local JSON file store (`data/db.json`, `data/categories.json`, `data/users.json`, auto-created and seeded on first run) — no database setup needed to try it. Add a `MONGODB_URI` to `.env.local` and the same code switches to real MongoDB via Mongoose, no code changes required (`services/productService.ts` / `categoryService.ts` / `userService.ts` are the switch points).

## About the demo product images

Real product photography found on the web belongs to whoever shot it — embedding scraped photos in a storefront (even a demo one) would reuse that without a license. Instead, `scripts/generate-demo-art.js` procedurally draws original textile-style artwork (temple borders, a woven lattice, a mandala motif, ten jewel-tone palettes) and rasterizes it to WebP with `sharp`. It's meant to make the storefront look populated and give you a real sense of the layout with imagery — swap in your own licensed or original product photography through the admin panel before launch.

To regenerate or add more variants: `node scripts/generate-demo-art.js` (edit the `jobs` array at the bottom of the script to add slugs/palettes).

## Running with a local MongoDB instead of the JSON store

By default (`.env.example`) `MONGODB_URI` is blank, so the app runs on the zero-setup local JSON store. To use MongoDB instead:

1. **Install and start MongoDB locally** (pick one):
   - macOS: `brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community`
   - Windows/Linux: install MongoDB Community Server from mongodb.com and start the `mongod` service
   - Or via Docker (works on any OS, no install needed): `docker run -d -p 27017:27017 --name tabsha-mongo mongo`
2. **Set the connection string** in `.env.local`:
   ```
   MONGODB_URI=mongodb://localhost:27017/tabsha
   ```
3. **Seed the database** with the same demo catalog (10 products, including the 6 sarees):
   ```bash
   npm run seed
   ```
   This is safe to re-run — it upserts by slug, so it won't create duplicates.
4. **Run the app as normal**: `npm run dev`

If MongoDB isn't running when you start the app, pages that read products (home, shop, product detail) will fail to load, since the app is now pointed at Mongo rather than the local JSON store. To go back to the zero-setup local JSON store at any time, just clear `MONGODB_URI` in `.env.local` (leave it blank) and restart the dev server — no other changes needed.

Categories and users follow the same local-JSON-by-default / Mongo-when-configured pattern (`data/categories.json`, `data/users.json`) — no separate seed step needed for those, they self-seed on first read either way.

## Customer login & registration

`/register` and `/login` are wired to a real backend, same pattern as admin auth: bcrypt-hashed passwords, JWT in an httpOnly cookie (`tabsha_user_token`), and `middleware.ts` gates every `/dashboard/*` page behind a valid session.

- Users are stored in MongoDB's `users` collection when `MONGODB_URI` is set, or in `data/users.json` (auto-created) when it's not — same switch as products.
- Register at `/register` to create an account, or log in at `/login` if you already have one.
- The dashboard sidebar shows your real name and has a working **Log out** button.
- There's no "Continue with Google" button — it was removed rather than left as a non-functional placeholder. If you want real Google sign-in later, that's an OAuth integration (NextAuth.js or a custom flow) on top of the existing JWT session system.
- Not yet built: password reset emails (the `/forgot-password` and `/reset-password` pages are UI-only), and persisting phone/city/order history beyond name + email.

## Admin login

`/admin/login` → **admin@tabsha.com** / **Tabsha@Admin123** (default dev credentials, set as plain text in `.env.local` — simple on purpose, so there's nothing that can get mangled while you're developing locally).

To change them:
1. In `.env.local`, set `ADMIN_EMAIL=you@example.com` and `ADMIN_PASSWORD=yourNewPassword`.
2. Restart the dev server.

Before deploying anywhere real, switch to a bcrypt hash instead (it takes priority over `ADMIN_PASSWORD` if both are set):
```bash
node -e "console.log(require('bcryptjs').hashSync('yourPassword', 10))"
```
Put the output in `ADMIN_PASSWORD_HASH` and leave `ADMIN_PASSWORD` blank.

How it works: `/api/auth/admin-login` checks the submitted credentials against those env vars and, on success, sets an httpOnly JWT cookie (`tabsha_admin_token`, 7-day expiry, signed with `JWT_SECRET`). `middleware.ts` requires a valid cookie for every `/admin/*` page (redirecting to `/admin/login` otherwise) and for any non-GET call to `/api/products`, `/api/categories`, `/api/settings`, or `/api/upload`. Log out from the button at the bottom of the admin sidebar, which clears the cookie.

This covers the admin dashboard; customer accounts (`/login`, `/register`, `/dashboard/*`) use a separate, equally-real JWT session — see "Customer login & registration" above.

## Not yet built (Phase 2+)

These are in the original spec but intentionally out of scope for this pass, so Phase 1 could be real and tested rather than a pile of stubs:

- **Customer auth extras**: registration/login are real (see "Customer login & registration" above); still missing are Google OAuth, password reset emails, and a persisted profile beyond name/email (phone/city/order history are demo-only).
- Orders: an Order model, real order history/invoices/tracking/refunds — checkout currently just clears the cart with an alert, and both the customer dashboard's Orders page and the admin Orders page show static sample rows.
- Payments: Stripe/Razorpay/EasyPaisa/JazzCash integration.
- Coupons that actually apply at checkout (the admin Coupons page is interactive but session-only — added coupons reset on refresh, nothing validates them at checkout yet).
- Reviews/ratings backend (the admin Reviews page shows sample data; product pages don't collect real reviews yet).
- Persisted wishlist (the dashboard wishlist page currently just shows sample products).
- SEO: sitemap.xml, robots.txt, Schema.org structured data, breadcrumbs markup.
- Bulk product upload/delete, CSV import.
- Instant search with suggestions, dark mode toggle, blog.
- Wiring the storefront's category tiles (homepage `CategoryGrid`, shop filters) to the new dynamic Categories admin data — right now they're separate: Categories in `/admin/categories` are manageable and stored for real, but the storefront still uses the original hardcoded Men/Women/Accessories categories and the `Product.category` enum (`clothing`/`accessories`). Connecting these is straightforward but touches the product form and filters, so it's left as a deliberate next step rather than done partially.

## Deploying to Vercel

Vercel's serverless functions have a **read-only, ephemeral filesystem** — the local JSON store and local image uploads (both of which write to disk) don't work correctly once deployed, even though they're fine for local dev. Here's what that means and how to deploy anyway:

### 1. MongoDB Atlas is required for deployment

The local JSON store can appear to "work" on Vercel for a single request, then lose data on the next one (different serverless instance, no shared disk). Point the deployed app at a real database:

1. In Vercel's project settings → **Environment Variables**, add:
   ```
   MONGODB_URI=<your Atlas connection string>
   ```
2. Seed it with the demo catalog (run this **locally**, pointed at the same Atlas cluster — there's no separate "run on Vercel" step, it's the same database either way):
   ```bash
   # in .env.local, temporarily set MONGODB_URI to your Atlas string, then:
   npm run seed
   ```
   This upserts by slug, so it's safe to re-run later.

### 2. Image uploads are stored in MongoDB

Images uploaded through `/admin/products/new` (or Add Category) are compressed to WebP with `sharp`, then stored as binary documents in their own `images` collection in MongoDB — not on disk. Vercel's filesystem is read-only in production, so writing to `public/uploads` there fails outright; storing the bytes in the same database everything else already uses avoids needing a separate storage service. Each image is served back out at `/api/images/<id>` (see `app/api/images/[id]/route.ts`), and that URL is what gets saved on the product/category document.

Since MongoDB caps a single document at 16MB, uploads are resized (max 1600px) and compressed before storage — comfortably under that limit for normal product photography.

The demo catalog images (`public/uploads/products/demo/*.webp`) are unaffected — they're committed static files, not runtime uploads, so they deploy and serve normally regardless of MongoDB.

If `MONGODB_URI` isn't set, uploads fall back to writing `public/uploads/products/` on local disk — fine for local dev, but this path never runs on a real Vercel deployment (nothing else persists there without Mongo either).

### 3. Required environment variables on Vercel

Set these in **Project Settings → Environment Variables** (Production, and Preview if you want preview deployments to work too):

| Variable | Value |
|---|---|
| `MONGODB_URI` | Your Atlas connection string (required — see above) |
| `JWT_SECRET` | A strong random string — generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. **Don't reuse the dev default.** |
| `JWT_EXPIRES_IN` | `7d` |
| `ADMIN_EMAIL` | Your real admin email |
| `ADMIN_PASSWORD_HASH` | A bcrypt hash — generate with `node -e "console.log(require('bcryptjs').hashSync('yourRealPassword', 10))"`. Use this instead of plain `ADMIN_PASSWORD` for anything deployed. |
| `NEXT_PUBLIC_SITE_NAME` | `"Tabsha Clothing Studio"` (or your own) |

Leave `ADMIN_PASSWORD`, `GOOGLE_CLIENT_ID`/`SECRET`, and `STRIPE_*` unset unless/until you're using them.

### 4. Push to GitHub and import into Vercel

```bash
git init
git add -A
git commit -m "Initial commit"
```
Create a new (empty) repo on GitHub, then:
```bash
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```
Then in Vercel: **Add New → Project → Import** your GitHub repo. Vercel auto-detects Next.js — no build command changes needed. Add the environment variables above before the first deploy (or add them and redeploy).

### 5. After the first deploy

- Log in at `https://your-domain.vercel.app/admin/login` with the real credentials you set above (not the dev defaults).
- Double-check `MONGODB_URI` actually took effect: if the storefront shows no products, it's almost always either a missing/wrong `MONGODB_URI` or a database that hasn't been seeded yet (`npm run seed` locally against that same Atlas string fixes it).
- Categories and users self-seed into Mongo on first read, same as products — no separate seed step needed for those.



```bash
npm install
cp .env.example .env.local   # leave MONGODB_URI empty to use the local JSON store
npm run dev
```

Visit `http://localhost:3000` for the storefront and `http://localhost:3000/admin` for the admin panel.

### Switching to MongoDB Atlas later

1. Create a cluster, get your connection string.
2. Put it in `.env.local` as `MONGODB_URI=...`.
3. Restart the dev server — `services/productService.ts` detects the env var and routes all reads/writes through `models/Product.ts` (Mongoose) instead of the local JSON store automatically.

## Folder structure

```
app/            Routes (App Router): storefront pages, /admin, /api
components/     Reusable UI (Header, ProductCard, ImageUploader, admin form, etc.)
lib/            db connection, local JSON store, utils
models/         Mongoose schemas
services/       Data-access layer (the Mongo/local switch lives here)
store/          Zustand cart store
types/          Shared TypeScript types
public/uploads/ Local image storage (product images land in /products)
data/           Local JSON "database" file (git-ignored)
```

## Notes on things you'll want to change before launch

- Admin auth is real but single-account (env-var credentials, no per-admin accounts/audit trail) — fine for one person running the store, not yet a multi-admin system. See "Admin login" above.
- `app/checkout/page.tsx` doesn't persist orders yet — it's UI only.
- Currency is formatted as PKR by default (`lib/utils.ts` → `formatPKR`); change if needed.
- Seed products live in `data/seed-products.json` — replace/delete once you're adding real products through the admin panel. If you edit this file, bump `SEED_VERSION` in `lib/localStore.ts` so the local JSON store picks up the change (see "Fixes in this update" below), and re-run `npm run seed` if you're on MongoDB.

## Fixes in this update

Two real bugs were found and fixed by actually running the project end-to-end (not just reading the code):

1. **Admin login stuck on "Signing in…" forever.** `lib/auth.ts` used `jsonwebtoken` to verify the admin session token, but that check runs inside `middleware.ts`, which Next.js executes on the **Edge runtime** — and `jsonwebtoken` depends on Node's `crypto` module, which Edge doesn't fully support. It was failing silently: a valid token went in, `null` came back out, every request to `/admin` bounced back to `/admin/login`. Fixed by switching to [`jose`](https://github.com/panva/jose), the JWT library built for the Edge runtime. `bcryptjs` (used for password hashing, genuinely Node-only) was also split out into `lib/passwords.ts` so it can't accidentally get pulled into the Edge middleware bundle again.
2. **`next build` failed outright** on `/login` and `/admin/login` — both use `useSearchParams()` without the `<Suspense>` boundary Next.js requires for that hook in a page it prerenders. Dev mode hid this; a real production build didn't. Fixed by wrapping both forms in `Suspense`.

Verified after the fix, on an actual `next build` (not just `next dev`): wrong password → 401, correct login → session cookie set, `/admin` with that cookie → 200, logout → session cleared and `/admin` redirects again, and all routes build with zero errors or warnings.

If your local product images still look wrong: check whether `MONGODB_URI` is set in `.env.local`. If it is, the app reads from your local MongoDB, not the JSON store — and Mongo doesn't auto-refresh stale seed data the way the JSON store now does. Run `npm run seed` to upsert the current demo catalog (fresh saree images included) into it.

**Third fix, this update:**

3. **Duplicate route build error** (`You cannot have two parallel pages that resolve to the same path`) — this one was a packaging mistake, not a code bug: an old zip wasn't deleted before a new one was created, so `zip` merged a stale `app/admin/products/page.tsx` on top of the current `app/admin/(protected)/products/page.tsx`. If you still hit this after re-downloading, it means your local project folder itself has leftover files from an earlier extraction into the same directory — delete the whole project folder and extract fresh rather than extracting on top of an existing one (unzipping only adds/overwrites, it never removes files that aren't in the new archive).
4. **Storefront header/footer/cart drawer were wrapping `/admin` pages**, and the admin sidebar wasn't showing up clearly against that visual noise. The root layout (`app/layout.tsx`) was rendering `Header`/`Footer`/`CartDrawer` unconditionally for every route. Fixed with a new `components/SiteChrome.tsx` client component that checks the current path and skips the storefront chrome entirely for `/admin/*`, replaced with its own minimal `AdminTopbar`.
5. **"Continue with Google" removed** from `/login` — it was a non-functional placeholder button; removed on request rather than left in.
6. **Categories, Customers, Orders, Coupons, Reviews, and Settings sections added** to the admin sidebar (previously just Dashboard/Products/Add Product). Categories, Customers, and Settings are fully real (persisted, gated, tested); Orders/Coupons/Reviews are sample-data UI shells, clearly labeled as such on each page — see "What's included and working" above for the exact breakdown.
