# HelpHub AI — Replit Project

## Overview
HelpHub AI is a community support platform where students, mentors and builders ask for help, offer help, and track their community impact. Built with Next.js 16 App Router, Firebase Auth + Firestore, Gemini AI, Tailwind CSS v4, and Framer Motion.

## Architecture

### Stack
- **Next.js 16** App Router, JSX only
- **Firebase** Auth (Email/Password) + Firestore (real-time)
- **Tailwind CSS v4** with `@theme {}` custom tokens in `styles/globals.css`
- **Framer Motion** for animations
- **Google Gemini** AI via server-side API route only (`app/api/gemini/route.js`)

### Port & Host
- Dev server runs on `port 5000`, host `0.0.0.0` for Replit preview
- Configured in `package.json`: `next dev -p 5000 -H 0.0.0.0`

### Environment Variables
All secrets stored as Replit secrets (never in code):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `GEMINI_API_KEY` (server-side only, never exposed to browser)

## Firebase Auth Flow
The auth page uses an **upsert pattern**:
1. Try `signInWithEmailAndPassword`
2. If user doesn't exist → auto `createUserWithEmailAndPassword`
3. Save basic profile to Firestore `users/{uid}`
4. Store `helphub_role` and `helphub_name` in localStorage
5. If profile already exists → redirect `/dashboard`, otherwise → `/onboarding`

Demo users: `ayesha@helplytics.ai`, `hassan@helplytics.ai`, `sara@helplytics.ai` — all password `helphub2024`

## Firestore Collections
- `users/{uid}` — name, email, role, location, skills, trustScore, helpCount, badgesEarned
- `requests/{id}` — title, description, category, urgency, status, tags, aiSummary, helpers[], userId, userName
- `chats/{id}` — participants[], senderName, receiverName, lastMessage, lastTimestamp
- `notifications/{id}` — type, text, userId, read, timestamp

## AuthContext
`context/AuthContext.jsx` exposes `{ user, profile, loading, refreshProfile }` — profile is loaded from Firestore on auth state change.

## Design System (Tailwind v4 @theme tokens)
- `bg-hero` → `#1C2B2B`
- `bg-teal-primary` → `#0D9488`
- `bg-teal-dark` → `#0A7A70`
- `bg-cream` → `#EAE6DC`
- Body: warm cream gradient, `background-attachment: fixed`
- Cards: `bg-white rounded-[16px] shadow-card`
- Buttons: `rounded-full`

## Pages
- `/` Landing
- `/auth` Login/Signup (upsert)
- `/onboarding` 3-step wizard + Gemini skill suggestions
- `/dashboard` Stats, AI insight, real-time request feed
- `/explore` Real-time Firestore feed + filters
- `/create` Create request + Gemini AI analysis
- `/request/[id]` Request detail, helpers, mark-as-solved
- `/messages` Firestore chats + send message
- `/leaderboard` Rankings, trust scores, badges
- `/profile/[uid]` Public profile, edit form
- `/notifications` Notification feed
- `/ai-center` AI trends, mentor pool
- `/admin` Content governance

## AI Center
Server-side only: `app/api/gemini/route.js` handles `analyze_request`, `generate_summary`, `suggest_skills` actions using `GEMINI_API_KEY`. Client calls `/api/gemini` via POST.

## Firestore Security Rules
`firestore.rules` — deploy via Firebase CLI or Console. Rules require `auth != null` for all reads/writes. Currently Firebase project may be in test mode (allow all) — update rules before production.

## Mock Data Fallback
Every page initializes with static mock data as `useState(MOCK_...)` default. If Firestore has real data, it replaces the mock. This ensures the demo works even without seeded data.
