# HelpHub AI — Helplytics Community Support Platform

> SMIT Grand Coding Night — April 2026
> Production-ready, pixel-perfect, AI-powered community help platform.

---

## Rules (Enforced After Every Task)

1. **Zero Vulnerabilities** — Run a security check after every completed task. No API key exposed client-side (Gemini key server-only). No `dangerouslySetInnerHTML`. All Firestore writes auth-guarded.
2. **Pixel Perfection** — Every page must match the provided reference screenshots exactly: colors, fonts, spacing, border-radius, badge chips, card shadows, dark hero cards, and warm cream gradient background.
3. **No Mock Data** — All displayed data must be real and fetched from Firebase Firestore. Mock fallback arrays exist ONLY as a last-resort safety net for empty collections during demo, not as primary data.
4. **README Updated** — After every completed task, update the `## ✅ Completed` and `## 🔲 Remaining` sections below.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, JSX only — no TypeScript) |
| Auth + DB | Firebase Auth + Firestore |
| Image Storage | Cloudinary (URL stored in Firestore) |
| AI | Google Gemini 1.5 Flash (server-side `/api/gemini` only) |
| Styling | Tailwind CSS v4 (custom design tokens) |
| Animation | Framer Motion |
| Routing | Next.js App Router |

---

## Architecture

```
helplytics/
├── app/
│   ├── layout.jsx              # Root layout — AuthProvider + Navbar + global styles
│   ├── page.jsx                # Landing page (hero, stats, core flow, featured requests)
│   ├── auth/page.jsx           # Login/Signup with demo user selector + Firebase Auth
│   ├── onboarding/page.jsx     # 3-step wizard: identity → skills → needs (Gemini AI)
│   ├── dashboard/page.jsx      # Stats cards, AI insight, recent requests
│   ├── explore/page.jsx        # Real-time Firestore feed with 4 filters
│   ├── create/page.jsx         # Create request form + Gemini AI assistant panel
│   ├── request/[id]/page.jsx   # Request detail: AI summary, helpers, actions
│   ├── messages/page.jsx       # Direct messaging between helpers & requesters
│   ├── leaderboard/page.jsx    # Rankings, trust scores, badge system
│   ├── profile/[uid]/page.jsx  # Public profile + owner edit panel + Cloudinary upload
│   ├── notifications/page.jsx  # Live notification feed (Firestore real-time)
│   ├── ai-center/page.jsx      # Trend pulse, urgency watch, AI recommendations
│   ├── admin/page.jsx          # Request governance, user directory, delete actions
│   └── api/
│       └── gemini/route.js     # Server-side Gemini handler (analyze/summarize/skills)
├── components/
│   ├── Navbar.jsx              # Context-aware nav (route-aware links, active pill)
│   ├── HeroBanner.jsx          # Dark rounded header card used across all pages
│   ├── RequestCard.jsx         # Help request summary card for feeds
│   ├── AIPanel.jsx             # Teal-outlined AI suggestion side panel
│   ├── BadgeChip.jsx           # Colored badge for category/urgency/status
│   └── LoadingSpinner.jsx      # Centered spinner for loading states
├── context/
│   └── AuthContext.jsx         # Firebase onAuthStateChanged + Firestore profile
├── lib/
│   ├── firebase.js             # Firebase app init (env-var config)
│   ├── firestore.js            # Generic CRUD wrappers (addDoc, getDocs, updateDoc)
│   ├── aiHelpers.js            # Client wrappers for /api/gemini + trust score logic
│   ├── animations.js           # Framer Motion variants (fadeUp, stagger, slideIn)
│   └── cloudinary.js           # Cloudinary upload helper (unsigned preset)
├── styles/
│   └── globals.css             # Warm cream gradient bg, CSS custom properties
├── tailwind.config.js          # Custom tokens: teal-primary, hero, cream, shadow-card
└── next.config.mjs             # allowedDevOrigins for Replit proxy
```

---

## Firestore Data Model

### `users/{uid}`
```json
{
  "name": "Ayesha Khan",
  "email": "ayesha@helplytics.ai",
  "role": "Both",
  "location": "Karachi",
  "skills": ["Figma", "UI/UX", "HTML/CSS"],
  "needsHelpWith": ["React", "Node.js"],
  "interests": ["Hackathons", "Community Building"],
  "trustScore": 100,
  "helpCount": 35,
  "badgesEarned": ["Design Ally", "Fast Responder", "Top Mentor"],
  "requestsCreated": 3,
  "photoURL": "",
  "createdAt": "ISO string"
}
```

### `requests/{id}`
```json
{
  "title": "Need help making my portfolio responsive",
  "description": "My HTML/CSS portfolio breaks on tablets...",
  "category": "Web Development",
  "urgency": "High",
  "status": "Open",
  "tags": ["HTML/CSS", "Responsive", "Portfolio"],
  "userId": "uid",
  "userName": "Sara Noor",
  "userLocation": "Karachi",
  "helpers": [],
  "aiSummary": "",
  "createdAt": "ISO string"
}
```

### `messages/{id}`
```json
{
  "from": "Ayesha Khan",
  "fromUid": "uid",
  "to": "Sara Noor",
  "toUid": "uid",
  "text": "I checked your portfolio request...",
  "timestamp": "ISO string"
}
```

### `notifications/{id}`
```json
{
  "userId": "uid",
  "text": "\"Need help\" was marked as solved",
  "type": "Status",
  "read": false,
  "createdAt": "ISO string"
}
```

---

## Design System

| Token | Value |
|-------|-------|
| Page background | `linear-gradient(135deg, #EAE6DC 0%, #EDE8E0 40%, #F2EDE8 70%, #EDE4D8 100%)` |
| Hero card bg | `#1C2B2B` (`bg-hero`) |
| Teal primary | `#0D9488` (`bg-teal-primary`) |
| Teal hover | `#0A7A70` (`bg-teal-dark`) |
| Card bg | `#FFFFFF`, border-radius `16px`, `shadow-card` |
| Font | Inter — 900 hero headings, 700 bold, 600 semibold, 400 body |
| Badge — High | bg `#FEE2E2` text `#DC2626` |
| Badge — Medium | bg `#FEF9C3` text `#B45309` |
| Badge — Low | bg `#DCFCE7` text `#16A34A` |
| Badge — Solved | bg `#E0F2F1` text `#0D9488` |
| Badge — Open | bg `#F3F4F6` text `#374151` |
| Badge — Category | bg `#F3F4F6` text `#374151` |
| Section label | 11px, font-semibold, `#0D9488`, uppercase, letter-spacing 0.1em |
| Hero heading | clamp(36px–52px), font-black, `#0F1A17`, line-height 1.1 |
| Body text | 14–15px, `#374151` |
| Muted text | `#6B7280` |

---

## Phase-by-Phase Build Plan

### PHASE 0 — Foundation ✅
- [x] Next.js 16 App Router setup (JSX only, no TypeScript)
- [x] Tailwind CSS v4 with custom design tokens
- [x] Firebase init (Auth + Firestore) via env vars
- [x] Global warm cream gradient background
- [x] AuthContext with `onAuthStateChanged` + Firestore profile fetch
- [x] Reusable components: Navbar, HeroBanner, RequestCard, BadgeChip, AIPanel, LoadingSpinner
- [x] Framer Motion animation variants (fadeUp, stagger, slideIn)
- [x] Gemini API server-side route (`/api/gemini`)

### PHASE 1 — Public Pages ✅
- [x] **Landing Page** — Two-column hero (dark right card, amber circle), count-up stats, core flow cards, featured requests grid, footer
- [x] **Auth Page** — Dark left info card, demo user dropdown (Ayesha/Hassan/Sara), role selection, email/password, Firebase Auth (auto-create on first login), redirect to onboarding or dashboard
- [x] **Onboarding Page** — 3-step wizard: identity form → skills + Gemini suggestions → needs/interests, saves to Firestore users collection

### PHASE 2 — Core App Pages ✅
- [x] **Dashboard** — Stats cards (my requests, help count, trust score), AI insight banner based on skills, recent community requests grid (real Firestore data), quick action buttons
- [x] **Explore / Feed** — Real-time Firestore `onSnapshot`, category filter, urgency filter, skills filter, location filter, RequestCard grid
- [x] **Create Request** — Title, description, tags, category dropdown, urgency dropdown, AI Assistant panel (Gemini auto-analyze on description change), Apply AI suggestions button, Publish to Firestore
- [x] **Request Detail** — Full request display, AI summary (Gemini), requester info, helpers list with trust scores, "I can help" (adds to helpers array), "Mark as solved" (updates status), HeroBanner with category/urgency/status badges

### PHASE 3 — Community & Social ✅
- [x] **Messaging** — Conversation stream (real Firestore messages), send message form with user selector, timestamp display, real-time `onSnapshot`
- [x] **Leaderboard** — Top helpers ranked by trustScore from Firestore users collection, avatar initials with colored circles, trust score progress bars (gold/teal gradient), badge system display
- [x] **Profile** — Dark hero header with name/role/location, public skills + badges + trust score + contribution count panel, owner edit form (name, location, skills, interests), save to Firestore, Cloudinary photo upload
- [x] **Notifications** — Live notification feed from Firestore `notifications` collection, Unread/Read state toggle, type labels (Status, Match, Request, Reputation, Insight)

### PHASE 4 — AI & Admin ✅
- [x] **AI Center** — Trend pulse card (most common category), urgency watch count, mentor pool count, AI recommendations list (high urgency requests with Gemini summaries)
- [x] **Admin Panel** — Requests table with delete, users directory, content governance

### PHASE 5 — Production Hardening 🔲
- [ ] **Remove all mock data arrays** — All pages must fetch only from Firestore; mock fallbacks remain only for truly empty collections (0 documents)
- [ ] **Cloudinary image upload** — Profile photo upload in `/profile/[uid]` using unsigned upload preset; `photoURL` stored in Firestore user doc
- [ ] **Real-time notifications** — Write Firestore notification docs on: request publish, "I can help" click, "Mark as solved" click; notification feed reads live with `onSnapshot`
- [ ] **Firestore security rules** — `auth != null` guard on all write operations; profile updates only by owner (`request.auth.uid == userId`)
- [ ] **Environment secrets** — Confirm all keys set in Replit Secrets: `NEXT_PUBLIC_FIREBASE_*`, `GEMINI_API_KEY`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- [ ] **Seed Firestore** — Create seed script to populate demo requests/users/messages/notifications for empty-DB demo
- [ ] **Final vulnerability audit** — Check all 7 vulnerability categories (see log below)
- [ ] **Deploy to production** — Set production env vars, run `next build`, deploy

---

## ✅ Completed Tasks

- [x] Project setup + folder structure
- [x] Firebase + Cloudinary config files
- [x] Tailwind custom color tokens
- [x] Global CSS (warm cream gradient, CSS variables)
- [x] AuthContext (Firebase onAuthStateChanged, useAuth hook)
- [x] Reusable components: Navbar, HeroBanner, RequestCard, BadgeChip, AIPanel, LoadingSpinner
- [x] PHASE 1: Landing Page
- [x] PHASE 1: Auth Page
- [x] PHASE 1: Onboarding Page
- [x] PHASE 2: Dashboard
- [x] PHASE 2: Explore / Feed
- [x] PHASE 2: Create Request
- [x] PHASE 2: Request Detail
- [x] PHASE 3: Messaging
- [x] PHASE 3: Leaderboard
- [x] PHASE 3: Profile
- [x] PHASE 3: Notifications
- [x] PHASE 4: AI Center
- [x] PHASE 4: Admin Panel
- [x] Gemini API server-side route
- [x] Pixel-perfect design system (cream bg, dark hero cards, teal buttons, badge chips, card shadows)
- [x] Framer Motion animations (fade-up stagger, count-up stats, slide-in onboarding, progress bars)
- [x] Per-page Navbar context (different links per route, active pill highlight)
- [x] npm packages installed: next, react, firebase, framer-motion, @google/generative-ai, @cloudinary/react, @cloudinary/url-gen, tailwindcss

---

## 🔲 Remaining Tasks

- [ ] Remove mock data from all pages — dynamic Firestore only
- [ ] Cloudinary profile photo upload (unsigned preset)
- [ ] Real-time Firestore notification writes (on publish/help/solve events)
- [ ] Firestore security rules (`auth != null` + owner-only writes)
- [ ] Set all required Replit Secrets (Firebase, Gemini, Cloudinary)
- [ ] Seed script for demo data
- [ ] Final vulnerability audit
- [ ] Production deployment

---

## Vulnerability Log

| Check | Implementation | Status |
|-------|---------------|--------|
| Gemini API key exposure | Key used server-side only in `/api/gemini/route.js` | ✅ |
| Firebase keys | `NEXT_PUBLIC_*` (browser-safe per Firebase design, domain-restricted in Firebase Console) | ✅ |
| Input sanitization | All form inputs via React controlled state (no innerHTML / no eval) | ✅ |
| XSS | No `dangerouslySetInnerHTML` used anywhere | ✅ |
| Auth guards | Profile edit only shown to owner (`user.uid === uid`), Admin page needs production auth guard | ⚠️ Demo mode |
| Firestore rules | Need `auth != null` rules set in Firebase Console before production deploy | 🔲 Pending |
| Memory leaks | All `onSnapshot` listeners returned as `unsub()` in `useEffect` cleanup | ✅ |

---

## Required Environment Secrets

Set these in Replit Secrets before production deployment:

| Secret Key | Purpose |
|-----------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase project API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firestore project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `GEMINI_API_KEY` | Google Gemini AI key (server-side only) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned upload preset |

---

## AI Features (Gemini 1.5 Flash)

| Feature | Trigger | Action |
|---------|---------|--------|
| `analyze_request` | User types in Create Request description | Returns category, urgency, tags, rewrite suggestion |
| `generate_summary` | Request Detail page loads | Returns 2-sentence plain-text summary |
| `suggest_skills` | Onboarding step 2 / Profile page | Returns 4 related skill suggestions |

---

## Pixel-Perfect Reference Pages

| Page | Reference Image |
|------|----------------|
| Landing | WhatsApp_Image_2026-04-18_at_5.20.47_PM_(1) |
| AI Center | WhatsApp_Image_2026-04-18_at_5.20.47_PM_(2) |
| Auth | WhatsApp_Image_2026-04-18_at_5.20.47_PM |
| Messaging | WhatsApp_Image_2026-04-18_at_5.20.48_PM_(1) |
| Profile | WhatsApp_Image_2026-04-18_at_5.20.48_PM |
| Leaderboard | WhatsApp_Image_2026-04-18_at_5.20.49_PM_(1) |
| Notifications | WhatsApp_Image_2026-04-18_at_5.20.49_PM_(2) |
| Create Request | WhatsApp_Image_2026-04-18_at_5.20.49_PM |
| Explore / Feed | WhatsApp_Image_2026-04-18_at_5.20.50_PM_(1) |
| Request Detail | WhatsApp_Image_2026-04-18_at_5.20.50_PM |
