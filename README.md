<div align="center">

# 🏥 MediCare — Complete Hospital Website

### A full hospital website: public landing page, online patient booking with payment,
### staff login, and a complete OPS dashboard — all in one Next.js app.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://medicare73.vercel.app/)
[![GSAP](https://img.shields.io/badge/Animations-GSAP-0AE448?logo=greensock)](https://gsap.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**🌐 Live demo: [medicare73.vercel.app](https://medicare73.vercel.app/)**

[✨ Features](#-features) · [🚀 Quick start](#-quick-start) · [🗄️ Database](#️-database--mongodb) · [🔌 API](#-api) · [🔐 Demo logins](#-demo-logins-staff)

</div>

---

## ✨ Features

### 🌍 Public website (no login needed)
| | |
|---|---|
| **Landing page** | Hero with banner photo, rated banner (★★★★★ 4.9/5), services, how booking works, doctors with photos, health tips, testimonials, FAQ, emergency banner — with GSAP scroll animations |
| **Patient booking** | Department → doctor (fee shown) → date & time → details → **payment (bKash / Nagad / Card / Cash)** → booking ID + status check by ID, phone or name |
| **AI chatbot** | Floating **“Ask MediCare”** assistant — answers booking, fees, hours, doctors & emergency questions instantly |

### 🛡️ OPS dashboard (staff login required)
| | |
|---|---|
| **Dashboard** | Live stats, bed occupancy, AI insights, alerts, charts |
| **Patients** | Search + filter, admit a patient |
| **Doctors** | Doctor cards with photos, on/off-duty toggle |
| **Appointments** | Schedule, complete / cancel — online bookings show as “Online” |
| **Beds** | Ward occupancy, bed grid, change any bed's status |
| **Emergency** | Triage alerts, case status updates |
| **Pharmacy** | Medicine stock, low / critical alerts, reorder (+100) |
| **Analytics & Settings** | Admissions vs discharges, department ranking, profile & notifications |

> 📱 **Fully mobile responsive** — landing, booking, login and every OPS page stack cleanly on a phone with zero horizontal overflow. The OPS sidebar becomes a slide-in drawer, so staff and patients can use everything from a phone.
>
> 🌙 **Dark mode, global search** — the dashboard has a working dark mode (remembered) and global search that jumps straight to the right patient.

---

## 🛠️ Tech stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 15** (App Router) + **React 19** |
| Database | **MongoDB** via **Mongoose** (auto-seed, demo-mode fallback) |
| Auth | **JWT** (httpOnly cookie, 8h, `jose`) + **bcrypt** passwords, rate-limited login |
| Payments | **SSLCommerz** hook (demo mode without credentials, sandbox ready) |
| Animations | **GSAP** + ScrollTrigger |
| Analytics | **Vercel Analytics** |
| Styling | Custom CSS (no Tailwind) · `lucide-react` icons |
| Hosting | **Vercel** (auto-deploy from `main`) |

---

## 🚀 Quick start

```bash
npm install
npm run dev          # → http://localhost:3000
```

```bash
npm run build        # check everything compiles
npm run start        # production server
```

> 💡 **Low-RAM PC?** If `npm run build` crashes with “JavaScript heap out of memory”,
> the build script already raises Node's heap to 3 GB. Or build in the cloud with Vercel —
> `vercel --prod` builds on Vercel's machines, no local RAM needed.

---

## 🗄️ Database — MongoDB

All hospital data — patients, doctors, appointments, medicines, emergency cases,
beds, staff logins — lives in **MongoDB via Mongoose**. A booking made on `/book`
appears in OPS Appointments for every staff member, on any device.

Without a database the app still works in **demo mode** (seed data, saves only in
that browser). Every API response tells you which mode it is: `{ mode: "db" | "demo" }`.

### Set it up (free, ~5 minutes — MongoDB Atlas)

1. Create a free account at [cloud.mongodb.com](https://cloud.mongodb.com) and a free **M0** cluster.
2. **Database Access** → add a database user (username + password).
3. **Network Access** → add IP `0.0.0.0/0` (so Vercel can reach it).
4. **Database** → Connect → Drivers → copy the connection string.
5. Create `.env.local` in the project root (copy `.env.example`):

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/medicare
JWT_SECRET=<random 32+ chars>
```

Generate the secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

6. Seed the database (also happens automatically on first use):

```bash
npm run db:seed
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

Or push to GitHub and **Import Project** on [vercel.com](https://vercel.com).
In the Vercel dashboard, add the same environment variables:

| Variable | What it is |
|---|---|
| `MONGODB_URI` | The Atlas connection string above |
| `JWT_SECRET` | The random secret above |
| `SSLCOMMERZ_STORE_ID` / `SSLCOMMERZ_STORE_PASSWORD` / `SSLCOMMERZ_IS_SANDBOX` | *(Optional)* for live payments |
| `NEXT_PUBLIC_SITE_URL` | Your production URL, e.g. `https://medicare73.vercel.app` |

---

## 🔌 API

All routes live under `/api`:

| Route | What it does |
|---|---|
| `GET / POST /api/patients` | List / admit a patient |
| `GET / PATCH /api/doctors` | List / toggle on-off duty |
| `GET / POST / PATCH /api/appointments` | List / book / complete-cancel · `?search=` finds a booking by ID, phone or name |
| `GET / PATCH /api/medicines` | List / reorder (+100 units) |
| `GET / PATCH /api/emergency` | List / update case status |
| `GET / PATCH /api/beds` | Wards + bed grid / change a bed's status |
| `POST /api/seed` | Seed an empty database |
| `POST /api/auth/login` | Staff login (checks MongoDB users first, demo accounts as fallback) |
| `GET /api/auth/me` | Who is signed in (name, email, role) |
| `POST /api/payments` | Demo payment gateway (SSLCommerz hook for live) |

---

## 🔐 Demo logins (staff)

| Role | Email | Password |
|---|---|---|
| 👨‍💼 Admin | `admin@medicare.hospital` | `admin123` |
| 👨‍⚕️ Doctor | `doctor@medicare.hospital` | `doctor123` |

> ⚠️ These are **demo** accounts. Change them in the database (the `staffusers`
> collection) and set a real `JWT_SECRET` in Vercel before giving the site to a
> real hospital.

---

## 🔒 Security

- `src/middleware.js` redirects every OPS page to `/login` without a valid JWT
  (httpOnly cookie, 8h, HS256 via `jose`)
- Passwords are **bcrypt hashes**, never plaintext
- Login is **rate-limited** (5 failed attempts / 15 min)
- Security headers in `next.config.mjs` (nosniff, frame deny, referrer, permissions, COOP)
- Payment is never trusted from the client alone — `POST /api/payments` is the
  gateway entry point; demo mode simulates a successful payment with a
  transaction ID, live mode uses SSLCommerz

---

## 📁 Project structure

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
      auth/            # login / logout / me (bcrypt + JWT + rate limit)
      payments/        # demo gateway / SSLCommerz hook
  components/
    DashboardShell.js, Sidebar.js, TopBar.js
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
    landing-animations.js   # GSAP hero + scroll animations
  middleware.js        # protects all OPS routes
  data/
    dashboard.js, hospital.js   # seed data + demo-mode fallback
scripts/
  seed.mjs             # npm run db:seed
```

---

## ✅ Next steps for a real hospital

1. Change the demo staff accounts in MongoDB and set a real `JWT_SECRET` in Vercel.
2. Add SSLCommerz **merchant** credentials for live payments (sandbox keys are demo only).
3. Deploy to Vercel — the hospital then opens one link; nothing to install.

---

<div align="center">

**Built with ❤️ using Next.js · Live at [medicare73.vercel.app](https://medicare73.vercel.app/)**

</div>
