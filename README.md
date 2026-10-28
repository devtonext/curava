# Curava — Healthcare Website Template + Admin Dashboard

A modern multi-page clinic and healthcare website built with **React 18 + Vite**, with a full **admin dashboard** and a **Supabase** backend.
Every heading, paragraph, image, colour, list and form option can be edited from the dashboard. No code needed.

**Works out of the box in demo mode:** without any setup, the site and dashboard run on built-in demo content that is saved in your browser.
Connect Supabase (about 5 minutes) to make it live.

---

## ✨ Features

**Website**
- 7 pages: Home, Programs, Specialists, Insights (blog), Article detail, About, Contact, plus a 404 page
- Hero with an animated stat card, partner logo strip, feature showcase that swaps images on hover, scrolling banner
- Animated counters, testimonial slider, specialist profiles in a pop-up window, specialty filters
- Pricing plans, FAQ accordion, step-by-step process, company timeline
- Blog with categories, search, featured post, article pages and related posts
- Contact form plus appointment booking (pre-filled from doctor and plan buttons)
- Newsletter sign-up, dismissible announcement bar, scroll progress bar, back-to-top button
- Brand colours set from the dashboard, with every shade generated automatically
- Fully responsive. Supports SEO tags, per-page titles, keyboard focus and reduced-motion settings

**Admin dashboard (`/admin`)**
- Overview showing pending bookings, new messages, subscribers and recent activity
- **Page editor**: every section of every page, including text, line breaks, lists, images, links and colours
- **Collections**: add, edit, duplicate, delete, reorder and hide/publish specialists, articles, reviews, pricing plans, FAQs, programs, stats, features, values, timeline and partners
- **Inbox**: appointments and messages with status tracking, search, filters, detail view and CSV export. Subscriber list with CSV export
- **Media library**: drag-and-drop image upload (Supabase Storage), with a picker in every image field
- **Setup page**: shows the connection status and a step-by-step guide
- Secure: protected by Supabase Auth and row-level security (database rules that decide who can read or change each table). The first account created becomes admin

---

## 🚀 Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173 for the website, and http://localhost:5173/admin for the dashboard.

In **demo mode**, sign in with `admin@demo.com` / `demo1234`. Edits are stored in your browser only.

---

## 🗄️ Go live with Supabase (5 steps)

### 1. Create a Supabase project
Go to [supabase.com/dashboard](https://supabase.com/dashboard), click **New project**, and choose a name, database password and region.

### 2. Run the setup SQL
In your project, open **SQL Editor → New query**. Paste the **entire contents** of [`supabase/setup.sql`](supabase/setup.sql) and click **Run**.

This creates:
- all tables (content, collections and form submissions)
- row-level security rules (visitors can read published content and submit forms, only admins can edit)
- the `media` storage bucket for image uploads
- the "first sign-up becomes admin" trigger
- the demo content, so your site looks complete straight away

> It's safe to run again. It never overwrites content you've edited.
> Prefer an empty site? Run [`supabase/schema.sql`](supabase/schema.sql) instead of `setup.sql`.

### 3. Add your keys
Go to **Project Settings → API** (or **Connect → App Frameworks**) and copy the **Project URL** and the **anon / public** key.

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_SUPABASE_BUCKET=media
```

Restart `npm run dev`.

> ⚠️ Only use the **anon** key. Never put the `service_role` key in the frontend.

### 4. Create your admin account
Open `/admin/login`. Because no admin exists yet, you'll see **Create the admin account**. The first account you create becomes the site owner.

If Supabase asks you to confirm your email, click the link in your inbox, then sign in.
(To skip confirmation while testing, go to **Authentication → Sign In / Providers → Email** and turn off **Confirm email**.)

### 5. Lock down sign-ups (recommended)
Go to **Authentication → Sign In / Providers** and turn off **Allow new users to sign up**. Nobody else can then create an account.

---

## ▲ Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, click **Add New → Project** and import the repo. The framework is detected as **Vite**.
3. Under **Environment Variables**, add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and `VITE_SUPABASE_BUCKET`.
4. Click **Deploy**.

Add the variables before deploying. Vite reads them at build time, so if you change them later you must redeploy.
`vercel.json` (Vercel) and `public/_redirects` (Netlify) are included, so links like `/about` or `/admin` still work when someone opens them directly or refreshes the page.

In Supabase, set **Authentication → URL Configuration → Site URL** to your live domain so confirmation emails link to the right place.

---

## 👥 Add more admins

Ask the person to sign up first (temporarily turn sign-ups back on, or invite them from **Authentication → Users → Invite**). Then run:

```sql
insert into public.admin_users (user_id, email)
select id, email from auth.users where email = 'teammate@example.com';
```

To remove an admin:

```sql
delete from public.admin_users where email = 'teammate@example.com';
```

---

## 🧱 Database schema

| Table | Purpose | Read | Write |
|---|---|---|---|
| `site_content` | One JSON document per page section (`general`, `seo`, `contact`, `home_hero`, `home_features`, `home_sections`, `programs_page`, `specialists_page`, `insights_page`, `about_page`, `contact_page`) | Everyone | Admins |
| `doctors` | Specialists (name, role, years, categories[], bio, image, featured) | Published rows | Admins |
| `articles` | Blog posts (slug, title, excerpt, body, category, author, read time, image, featured, date) | Published rows | Admins |
| `reviews` | Testimonials (name, meta, quote, rating, avatar) | Published rows | Admins |
| `plans` | Pricing (name, price, period, description, features[], highlighted, button label) | Published rows | Admins |
| `programs`, `steps`, `faqs`, `features`, `stats`, `company_values`, `milestones`, `partners` | Other lists shown on the site | Published rows | Admins |
| `appointments` | Booking requests (status: pending, confirmed, completed, cancelled) | Admins | Visitors can insert |
| `messages` | Contact form messages (status: new, read, archived) | Admins | Visitors can insert |
| `subscribers` | Newsletter emails (unique) | Admins | Visitors can insert |
| `admin_users` | Who can use the dashboard | Admins | Admins |
| `storage.media` | Uploaded images (public bucket) | Everyone | Admins |

Every collection table has `id`, `sort_order`, `published`, `created_at` and `updated_at`.

---

## 🗂️ Project structure

```
supabase/
  setup.sql        ← run this once in the Supabase SQL editor (schema + demo content)
  schema.sql       ← tables, security rules, storage, admin trigger only
  seed.sql         ← demo content only (generated)
scripts/build-sql.mjs  regenerates seed.sql/setup.sql from src/lib/defaults.js
src/
  lib/api.js       data layer: Supabase driver + browser-storage demo driver
  lib/defaults.js  all default/demo content
  lib/site.jsx     loads content, applies theme colours + SEO tags
  components/      shared UI (Header, Footer, Pricing, DoctorCard, Modal, …)
  pages/           website pages
  admin/
    schema.js      what the dashboard can edit (add fields here)
    fields.jsx     form inputs (image upload, colour, lists, tags, …)
    pages/         Overview, PageEditor, CollectionManager, Inbox, Media, Setup
  styles/global.css
```

---

## 🛠️ Customising

**Edit content:** use the dashboard. Everything on the site is editable there.

**Change the default/demo content:** edit `src/lib/defaults.js`, then run `npm run build:sql` to regenerate the SQL files.

**Add a new editable field to a section**
1. Add it to the section in `src/lib/defaults.js` (for example, add `badge_text` to `home_hero`).
2. Add it to the matching section in `src/admin/schema.js`, for example `{ name: "badge_text", label: "Badge text", type: "text" }`.
3. Use it in the page: `content.home_hero.badge_text`.

No database change is needed, because sections are stored as JSON.

**Add a field to a collection:** add the column in Supabase:

```sql
alter table public.doctors add column languages text;
```

Then add the field to `COLLECTIONS.doctors.fields` in `src/admin/schema.js` and use it in the component.

**Field types available in the dashboard:** `text`, `textarea`, `title` (multi-line heading), `list`, `tags`, `image`, `number`, `select`, `boolean`, `color`, `date`, `url`, `slug`, `markdown`.

**Article formatting:** leave a blank line between paragraphs, and start a line with `## ` for a heading.

**Fonts:** Inter Tight from Google Fonts, loaded in `index.html`.

---

## ❓ Troubleshooting

| Problem | Fix |
|---|---|
| The dashboard still says "Demo mode" | `.env` is missing, or the dev server wasn't restarted. On Vercel, add the variables and **redeploy**. |
| `relation "public.site_content" does not exist` | `supabase/setup.sql` hasn't been run in the correct project. |
| "No admin access" after signing in | The account isn't in `admin_users`. Add it with the SQL above. |
| Image upload fails | Check that the `media` bucket exists (Storage) and that you're signed in as an admin. |
| Forms show "new row violates row-level security policy" | Re-run `setup.sql` to restore the security rules. |
| A page shows 404 after refreshing on the live site | Make sure `vercel.json` (or `public/_redirects` on Netlify) was deployed. |

---

## 📄 Credits

- Demo photos: [Unsplash](https://unsplash.com) (free licence) and [randomuser.me](https://randomuser.me). Replace them with your own images before launch.
- Icons: inline SVG.
- Built with React, React Router, Vite and Supabase.
