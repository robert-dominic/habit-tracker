# Minimalist Habit Tracker

A clean, offline-first Progressive Web App designed to help you build and sustain consistent daily routines without distraction. Crafted with a premium minimalist interface to keep momentum visible.

## Key Features

- **Daily Focus**: Seamlessly create, edit, and track daily habits from any device.
- **Visual Streaks**: Tracking algorithms that actively recognize consecutive completions, rewarding streaks with integrated flame indicators. 
- **Offline Reliable**: 100% functional without an internet connection. Client-side local storage safely synchronizes your state.
- **Mobile First**: Built specifically to feel tactile and fluid heavily optimized for 320px screens while retaining elegant spacing on desktop views.
- **PWA Ready**: Complete with a localized Service Worker and manifest file allowing seamless "Add to Homescreen" native application functionality.

## Technical Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS (v4)
- **Type Checking**: Strict TypeScript definitions
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

First, install the dependencies ensuring environments mirror testing constraints:

```bash
npm install
```

Start the localized development server:

```bash
npm run dev
```

Navigate horizontally to `http://localhost:3000` to review the instance. 

## Testing

The UI heavily relies on structurally predictable `data-testid` properties to satisfy integration matrices seamlessly. You can run the deterministic suites locally:

```bash
npm run test:unit
```