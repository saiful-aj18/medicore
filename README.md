# MediCare — Complete Hospital Website

A complete hospital website built with **Next.js (App Router) + React +
lucide-react**: a public landing page, patient booking with payment, staff
login with JWT security, the full OPS dashboard, and an AI chatbot.
Demo data lives in `src/data/` — swap it for a real database when ready.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 (landing page)

```bash
npm run build
npm run start
```

> If `npm run build` crashes with "JavaScript heap out of memory" on a
> low-RAM PC, the build script already raises Node's heap to 3 GB. You
> can also run it manually in PowerShell:
> `$env:NODE_OPTIONS="--max-old-space-size=3072"; npm run build`

## Database — MongoDB (real, shared by everyone)

All hospital data (patients, doctors, appointments, medicines, emergency
cases, beds, staff logins) lives in **MongoDB via Mongoose**. A booking
made on `/book` appears in OPS Appointments for every staff member, on
any device. Without a database the app still works in **demo mode**
(seed data, saves only in that browser).

### Set it up (free, 5 minutes — MongoDB Atlas)

1. Create a free account at https://cloud.mongodb.com and a free **M0**
   cluster.
2. **Database Access** → Add a database user (username + password).
3. **Network Access** → Add IP `0.0.0.0/0` (so Vercel can reach it).
4. **Database** → Connect → Drivers → copy the connection string.
5. Create `.env.local` in the project root (copy `.env.example`):

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/medicare
JWT_SECRET=<random 32+ chars, see below>
```

Generate the secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

6. Seed the database (also happens automatically on first use):

```bash
npm run db:seed
```

### Terminal commands (DB)

| Command | What it does |
|---|---|
| `npm run db:seed` | Fill an empty database with the demo data (patients, doctors, appointments, medicines, emergency cases, beds, staff logins) |
| `npm run dev` | Run locally with the database |
| `npm run build` | Check everything compiles before deploy |

### Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

Or push to GitHub and Import Project on vercel.com. In the Vercel
dashboard add the same two environment variables:

- `MONGODB_URI` — the Atlas connection string above
- `JWT_SECRET` — the random secret above

(Optional: `SSLCOMMERZ_STORE_ID` / `SSLCOMMERZ_STORE_PASSWORD` /
`SSLCOMMERZ_IS_SANDBOX` for live payments.)

## API (all under `/api`)

| Route | What it does |
|---|---|
| `GET/POST /api/patients` | List / admit a patient |
| `GET/PATCH /api/doctors` | List / toggle on-off duty |
| `GET/POST/PATCH /api/appointments` | List / book / complete-cancel; `?search=` finds a booking by ID, phone or name |
| `GET/PATCH /api/medicines` | List / reorder (+100 units) |
| `GET/PATCH /api/emergency` | List / update case status |
| `GET/PATCH /api/beds` | Wards + bed grid / change a bed's status |
| `POST /api/seed` | Seed an empty database |
| `POST /api/auth/login` | Staff login (checks MongoDB users first, demo accounts as fallback) |
| `POST /api/payments` | Demo payment gateway (SSLCommerz hook for live) |

Every GET returns `{ mode: "db" | "demo", ... }` — in demo mode the
same seed data is returned so the site works with no database at all.

## Demo logins (staff)

| Role | Email | Password |
|---|---|---|
| Admin | admin@medicare.hospital | admin123 |
| Doctor | doctor@medicare.hospital | doctor123 |

Change these in `src/lib/users.js` and set `JWT_SECRET` in `.env.local`
(copy `.env.example`) before going live.

## Pages

| Route | What it does |
|---|---|
| `/` | **Landing page** — hero, services, how booking works, doctors, health tips, testimonials, FAQ, emergency banner, contact/footer + AI chat |
| `/book` | **Public patient booking** — no login: department → doctor (fee shown) → date & time → details → **payment (bKash / Nagad / Card / Cash)** → booking ID + status check |
| `/login` | Staff login (admin / doctor), bcrypt passwords, JWT cookie, rate-limited |
| `/dashboard` | OPS dashboard (login required) — hero, AI insights, stats, charts, alerts |
| `/patients` | Search + filter, admit a patient (saved in browser) |
| `/doctors` | Doctor cards, filters, on/off-duty toggle |
| `/appointments` | Schedule, complete/cancel; online bookings from `/book` show as “Online” |
| `/beds` | Ward occupancy, bed grid, summary |
| `/emergency` | Alerts, triage guidance, case status |
| `/pharmacy` | Medicine stock, low/critical stock, reorder |
| `/analytics` | Admissions vs discharges, department ranking |
| `/settings` | Profile, hospital details, notification toggles |

## What's inside

- **Landing page** — everything a hospital website needs: services,
  doctors, fees, health tips, testimonials, FAQ, emergency contact.
- **Payments** — booking checkout with bKash, Nagad, Card or Cash at
  hospital. `POST /api/payments` is the gateway entry point: **demo mode**
  (no credentials) simulates a successful payment with a transaction ID;
  set `SSLCOMMERZ_STORE_ID` / `SSLCOMMERZ_STORE_PASSWORD` /
  `SSLCOMMERZ_IS_SANDBOX` in `.env.local` for live SSLCommerz — the route
  documents where the real init call goes, and payment is never trusted
  from the client alone.
- **Security** — `src/middleware.js` redirects every OPS page to `/login`
  without a valid JWT (httpOnly cookie, 8h, HS256 via `jose`); passwords
  are bcrypt hashes, never plaintext; login is rate-limited (5 failed
  attempts / 15 min); security headers in `next.config.mjs`
  (nosniff, frame deny, referrer, permissions, COOP).
- **AI live chatbot** — floating “Ask MediCare” widget on the landing and
  booking pages. Answers booking, fees, hours, doctors, departments and
  emergency questions instantly, with quick-reply chips. Rule-based on a
  hospital knowledge base (no API key needed); swap `reply()` in
  `src/components/ChatWidget.js` for a real LLM API when ready.
- **Working navigation, dark mode, global search, responsive** — same as v2/v3. **Fully mobile responsive**: landing, booking, login and all OPS pages stack cleanly on a phone with zero horizontal overflow; the OPS sidebar becomes a slide-in drawer (☰ button in the top bar) and the landing page gets a mobile menu, so staff and patients can use everything from a phone.

## Structure

```
src/
  app/
    page.js            # landing page (public)
    layout.js, globals.css
    book/              # public booking + payment
    login/             # staff login
    dashboard/         # OPS dashboard (protected)
    patients/ doctors/ appointments/ beds/
    emergency/ pharmacy/ analytics/ settings/
    api/
      auth/login/      # bcrypt + JWT + rate limit
      auth/logout/
      payments/        # demo gateway / SSLCommerz hook
  components/
    DashboardShell.js, Sidebar.js (with logout), TopBar.js
    ChatWidget.js      # AI assistant
    HeroCard.js, DoctorArt.js, StatCards.js, AdmissionChart.js,
    BedOccupancy.js, DepartmentPerformance.js, EmergencyAlerts.js,
    Appointments.js, ActivityTimeline.js, AIAssistant.js, PageHeader.js
  lib/
    auth.js            # JWT sign/verify (jose)
    users.js           # demo staff accounts (bcrypt hashes, DB fallback)
    mongodb.js         # Mongoose connection (cached, demo mode when unset)
    models.js          # Patient, Doctor, Appointment, Medicine,
                       #   EmergencyCase, Ward, StaffUser
    seed.js            # auto-seed an empty DB from src/data/hospital.js
  middleware.js        # protects all OPS routes
  data/
    dashboard.js, hospital.js   # seed data + demo-mode fallback
scripts/
  seed.mjs             # npm run db:seed
```

## Next step for a real hospital

1. ~~Set `JWT_SECRET` and replace the demo users~~ — **done in v6**:
   staff accounts now live in MongoDB (seeded with the demo logins).
   Change them in the database, or add new staff in the `staffusers`
   collection, and set a real `JWT_SECRET` in Vercel.
2. Add SSLCommerz merchant credentials to `.env.local` / Vercel for live
   payments.
3. Deploy to Vercel — the client then opens one link; nothing to install.
