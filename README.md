# HelpHub AI — Build Tracker

## ✅ Completed
- [x] Project setup + folder structure
- [x] Firebase + Cloudinary config
- [x] Tailwind custom color tokens (teal-primary, teal-dark, hero, cream, text-primary, text-body, text-muted, border-light, card-alt, shadow-card)
- [x] Global CSS (warm cream gradient background, CSS variables)
- [x] AuthContext (Firebase onAuthStateChanged, useAuth hook)
- [x] Reusable components: Navbar, HeroBanner, RequestCard, BadgeChip, AIPanel, LoadingSpinner
- [x] PHASE 1: Landing Page (two-column hero, dark right card, count-up stats, core flow, featured requests, footer)
- [x] PHASE 1: Auth Page (dark left card, demo user dropdown, role selection, Firebase auth)
- [x] PHASE 1: Onboarding Page (3-step wizard, Gemini AI skill suggestions, Firebase Firestore save)
- [x] PHASE 2: Dashboard (stats cards, AI insight banner, recent requests grid, quick actions)
- [x] PHASE 2: Explore / Feed (real-time Firestore + mock fallback, 4 filters, request cards)
- [x] PHASE 2: Create Request (Gemini AI auto-analyze, form fields, publish to Firestore)
- [x] PHASE 2: Request Detail (AI summary, helpers list, "I can help" / "Mark as solved" actions)
- [x] PHASE 3: Messaging (conversation stream + send message, Firestore chats + mock fallback)
- [x] PHASE 3: Leaderboard (rankings, trust score progress bars, badge system, mock + Firestore data)
- [x] PHASE 3: Profile (public profile, edit form, trust score, skills, badges, Firestore update)
- [x] PHASE 3: Notifications (9-item feed matching reference design, Unread/Read states)
- [x] PHASE 4: AI Center (trend pulse, urgency watch, mentor pool, AI recommendations + fallback)
- [x] PHASE 4: Admin Panel (content governance, requests table, users directory, delete action)
- [x] Gemini API server-side route (GEMINI_API_KEY, analyze/summarize/suggest_skills actions)
- [x] Pixel-perfect design system (cream bg, dark hero cards, teal buttons, badge chips, card shadows)
- [x] Framer Motion animations (fade-up stagger on landing, count-up stats, slide-in onboarding, progress bars)
- [x] Per-page Navbar context (different links per route, active pill highlight)
- [x] Static fallback mock data on all pages for demo without Firebase seeding

## 🔲 Remaining
- [ ] Cloudinary image upload integration (profile photo upload)
- [ ] Real-time notification listeners from Firestore
- [ ] Firebase Firestore security rules (auth-required on production)
- [ ] Admin analytics charts

## Vulnerability Log

| Task | Check | Status |
|------|-------|--------|
| API Key exposure | GEMINI_API_KEY server-side only via /api/gemini route | ✅ |
| Firebase keys | NEXT_PUBLIC_* (browser-safe per Firebase design) | ✅ |
| Input sanitization | All form inputs via React controlled state (no innerHTML) | ✅ |
| Auth guards | Profile edit only for owner, Admin mocked open for demo | ⚠️ Demo mode |
| Firestore rules | Add `auth != null` rules in Firebase Console before production | 🔲 Pending |
| Memory leaks | All onSnapshot listeners return unsub() in useEffect cleanup | ✅ |
| XSS | No dangerouslySetInnerHTML used anywhere | ✅ |

## Design System Reference

| Token | Value |
|-------|-------|
| Page background | `linear-gradient(135deg, #EAE6DC 0%, #EDE8E0 40%, #F2EDE8 70%, #EDE4D8 100%)` |
| Hero card bg | `#1C2B2B` (bg-hero) |
| Teal primary | `#0D9488` (bg-teal-primary) |
| Teal hover | `#0A7A70` (bg-teal-dark) |
| Card bg | `#FFFFFF`, border-radius 16px, shadow-card |
| Font | Inter — 900 hero headings, 700 bold, 600 semibold, 400 body |
| Badge — High | bg `#FEE2E2` text `#DC2626` |
| Badge — Medium | bg `#FEF9C3` text `#B45309` |
| Badge — Low | bg `#DCFCE7` text `#16A34A` |
| Badge — Solved | bg `#E0F2F1` text `#0D9488` |
| Badge — Category | bg `#F3F4F6` text `#374151` |

## Stack
- **Next.js 16** (App Router, JSX only — no TypeScript)
- **Firebase** (Auth + Firestore)
- **Cloudinary** (image storage, URL stored in Firestore)
- **Tailwind CSS v4** (custom design tokens)
- **Framer Motion** (all animations)
- **Google Gemini AI** (server-side API route only)
