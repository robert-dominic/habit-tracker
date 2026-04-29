# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits. Built as part of HNG Internship Stage 3.

---

## Deliverable Links

- **Live Application**: (https://habit-tracker.pxxl.click/)
- **Video Walkthrough**: (https://drive.google.com/file/d/1dmh7KkiaFRfuUM42oBcWnFd3Fp9_sAhz/view?usp=drive_link)

---

## Project Overview

This app allows users to sign up, log in, create habits, mark them complete each day, and view their current streak. All data is stored locally in the browser using `localStorage` — no backend or remote database is involved. The app is installable as a PWA and supports basic offline usage after the first load.

---

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- npm

### Install dependencies

```bash
git clone https://github.com/robert-dominic/habit-tracker.git
cd habit-tracker
npm install
```

### Install Playwright browsers (for E2E tests)

```bash
npx playwright install
```

---

## Run Instructions

### Development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
npm run build
npm run start
```

---

## Test Instructions

### Run all tests

```bash
npm test
```

### Run unit tests only (with coverage)

```bash
npm run test:unit
```

### Run integration tests only

```bash
npm run test:integration
```

### Run end-to-end tests only

```bash
npm run test:e2e
```

### View coverage report

After running `npm run test:unit`, a coverage report is generated in the `coverage/` directory. Open `coverage/index.html` in your browser to view it.

---

## Local Persistence Structure

All data is stored in `localStorage` under three keys:

### `habit-tracker-users`

Stores a JSON array of registered users.

```json
[
  {
    "id": "unique-string",
    "email": "user@example.com",
    "password": "plaintext-password",
    "createdAt": "2026-04-27T10:00:00.000Z"
  }
]
```

> Note: Passwords were stored in plain text intentionally for this stage.

### `habit-tracker-session`

Stores the currently logged-in user's session, or `null` when no session exists.

```json
{
  "userId": "unique-string",
  "email": "user@example.com"
}
```

### `habit-tracker-habits`

Stores a JSON array of all habits across all users. Each habit is linked to its owner via `userId`.

```json
[
  {
    "id": "unique-string",
    "userId": "owner-user-id",
    "name": "Drink Water",
    "description": "Stay hydrated throughout the day",
    "frequency": "daily",
    "createdAt": "2026-04-27T10:00:00.000Z",
    "completions": ["2026-04-27", "2026-04-28"]
  }
]
```

`completions` contains unique ISO calendar dates in `YYYY-MM-DD` format. Each date represents a day the habit was marked complete.

---

## PWA Support

### How it was implemented

**manifest.json** — located at `public/manifest.json`. Declares the app name, short name, start URL, display mode (`standalone`), background and theme colors, and icon paths for 192x192 and 512x512 PNG icons. This enables browsers to prompt users to install the app.

**Service Worker** — located at `public/sw.js`. Registered on the client side inside a `useEffect` in the root layout. On install, it pre-caches the app shell (HTML, CSS, JS). On fetch, it serves cached assets first and falls back to the network. This allows the app to load offline after it has been visited at least once.

**Icons** — located at `public/icons/icon-192.png` and `public/icons/icon-512.png`. Used by the manifest and required for PWA installability.

---

## Trade-offs and Limitations

- **Plain text passwords** — authentication is entirely local and deterministic. No hashing is applied to passwords.
- **No real auth** — session management mimics JWT behavior using a localStorage object. There is no token expiry or server-side validation.
- **Single frequency** — only `daily` frequency is supported. The frequency field is fixed and cannot be changed by the user.
- **No data sync** — data only exists in the browser where it was created. Clearing browser storage or switching devices resets everything.
- **Offline support is shell-only** — the service worker caches the app shell for offline rendering but does not cache dynamic user data. Users can see the shell offline but not interact with fresh data.

---

## Test File Map

### Unit Tests — `tests/unit/`

| File | Function tested | What it verifies |
|------|----------------|------------------|
| `slug.test.ts` | `getHabitSlug` | Converts habit names to URL-safe slugs used as test IDs on habit cards |
| `validators.test.ts` | `validateHabitName` | Validates habit name input — empty rejection, length limit, trimmed return |
| `streaks.test.ts` | `calculateCurrentStreak` | Counts consecutive daily completions backwards from today |
| `habits.test.ts` | `toggleHabitCompletion` | Adds or removes a completion date without mutating the original habit |

### Integration Tests — `tests/integration/`

| File | Components tested | What it verifies |
|------|------------------|------------------|
| `auth-flow.test.tsx` | `LoginForm`, `SignupForm` | Signup creates a session, duplicate email is rejected, login stores session, invalid credentials show error |
| `habit-form.test.tsx` | `HabitForm`, `HabitList`, `HabitCard` | Creating, editing, and deleting habits, plus toggling completion and verifying streak updates |

### End-to-End Tests — `tests/e2e/`

| File | What it verifies |
|------|-----------------|
| `app.spec.ts` | Full user journeys: splash screen redirect, protected routes, signup, login, habit CRUD, streak update, session persistence across reload, logout, and offline app shell loading |

---

## How Implementation Maps to the Technical Requirements Document

| Requirement | Implementation |
|-------------|---------------|
| Route `/` with splash screen | `src/app/page.tsx` — renders `SplashScreen`, checks session, redirects after 800–2000ms |
| Route `/login` | `src/app/login/page.tsx` — renders `LoginForm` |
| Route `/signup` | `src/app/signup/page.tsx` — renders `SignupForm` |
| Route `/dashboard` (protected) | `src/app/dashboard/page.tsx` — wrapped in `ProtectedRoute` |
| localStorage persistence | `src/lib/storage.ts` — all reads/writes go through this file using keys from `src/lib/constants.ts` |
| Auth logic | `src/lib/auth.ts` — signup, login, logout functions |
| Habit slug utility | `src/lib/slug.ts` — `getHabitSlug` |
| Habit name validation | `src/lib/validators.ts` — `validateHabitName` |
| Streak calculation | `src/lib/streaks.ts` — `calculateCurrentStreak` |
| Completion toggle | `src/lib/habits.ts` — `toggleHabitCompletion` |
| Type contracts | `src/types/auth.ts`, `src/types/habit.ts` |
| Slug-based test IDs on habit cards | `src/components/habits/HabitCard.tsx` — uses `getHabitSlug(habit.name)` to generate `data-testid` values |
| PWA manifest and service worker | `public/manifest.json`, `public/sw.js`, registered in `src/app/layout.tsx` |
| 80% coverage on `src/lib` | Enforced via `vitest.config.ts` coverage threshold |