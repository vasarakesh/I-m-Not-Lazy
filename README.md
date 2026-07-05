# Im Not Lazy

A free web app for college-age adults (18–25) to gradually escape social media addiction and reclaim time — without shame-heavy or extreme detox tactics.

## Stack

- **React + Vite** — frontend
- **Firebase Auth** — authentication
- **Firestore** — user data persistence
- **Vercel** — hosting
- **Local JSON** — wizard steps and learn-feed content

## Getting started

### Prerequisites

- Node.js 18+
- A Firebase project with Auth (Email/Password) and Firestore enabled

### Install

```powershell
cd "C:\Users\Rakesh Vasa\Desktop\ImNotLazy"
npm install
```

### Environment variables

Copy the example file and fill in your Firebase web app config:

```powershell
copy .env.example .env
```

Required variables (from Firebase Console → Project Settings → Your apps → Web app):

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Add the same variables in your **Vercel project dashboard** under Settings → Environment Variables.

### Firebase setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Sign-in method → **Email/Password**
3. Create a **Firestore** database (start in production mode)
4. Deploy security rules from `firestore.rules.example`:
   ```powershell
   firebase deploy --only firestore:rules
   ```
   Or paste the rules manually in Firebase Console → Firestore → Rules.

### Run locally

```powershell
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build

```powershell
npm run build
```

Output goes to `dist/` — Vercel picks this up automatically. The marketing website is copied to `dist/website/` and served at `/`.

## Deploy to Vercel

1. Import [github.com/vasarakesh/I-m-Not-Lazy](https://github.com/vasarakesh/I-m-Not-Lazy) in the [Vercel dashboard](https://vercel.com/new) (or run `vercel login` then `vercel deploy --prod`).
2. Add `VITE_FIREBASE_*` env vars in Project Settings → Environment Variables (required for the app; not needed for the marketing homepage).
3. Production URL will be shown after deploy (e.g. `https://im-not-lazy.vercel.app`).

### Regenerate app screenshots

```powershell
npm run screenshots
```

This captures PNGs from `website/mockups/` into `website/screenshots/` for the product website gallery.

## App routes

| Route | Description |
|-------|-------------|
| `/` | Product marketing website (features, screenshots, about) |
| `/onboarding` | Age gate, auth, quiz, detox path |
| `/wizard` | JSON-driven setup wizard (Instagram, YouTube) |
| `/dashboard` | Streaks, usage trend, reclaimed hours |
| `/check-in` | Daily intention, reflection, mood, scroll time |
| `/learn` | Educational cards from JSON |
| `/settings` | Account, theme, delete data |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |

## Firestore data model

```
users/{uid}
  email, createdAt, onboardingComplete, ageConfirmedAt
  onboarding: { apps[], hoursPerDay, reclaimedGoals[], completedAt }
  detoxPath: { id, title, summary, recommendations[], generatedAt }
  stats: { currentStreak, bestStreak, lastCheckInDate, baselineHours }
  badges: { instagramWizardComplete, youtubeWizardComplete, ... }

users/{uid}/wizardProgress/{platformId}
  completedSteps[], completedAt, updatedAt

users/{uid}/checkIns/{YYYY-MM-DD}
  morningIntention, eveningReflection, mood, reportedScrollHours, updatedAt

users/{uid}/usageLogs/{YYYY-MM-DD}
  hours, updatedAt
```

## Content files

Edit these JSON files to update app content without code changes:

- `src/content/onboarding-options.json` — quiz choices
- `src/content/wizard-steps.json` — platform setup steps
- `src/content/learn-feed.json` — educational cards

## Design system

Nexus — warm beige surfaces, teal accent, light/dark mode, mobile-first, left-aligned text. Tokens live in `src/styles/tokens.css`.

## License

MIT — see [LICENSE](LICENSE).
