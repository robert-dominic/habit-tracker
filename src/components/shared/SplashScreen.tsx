'use client'

export default function SplashScreen() {
  return (
    <main
      data-testid="splash-screen"
      className="relative flex min-h-screen items-center justify-center bg-background px-6 text-foreground"
    >
      <div className="relative flex w-full max-w-sm flex-col items-center text-center">
        <div className="relative mb-8 flex h-20 w-20 items-center justify-center border border-border bg-surface shadow-sm">
          <div className="h-10 w-10 bg-primary" />
        </div>

        <p className="text-sm font-medium tracking-widest text-muted uppercase">Welcome to</p>
        <h1 className="mt-4 font-heading text-4xl leading-none tracking-tight text-foreground sm:text-5xl">
          Habit Tracker
        </h1>
        <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted sm:text-base">
          Loading your habits and session in a clean, focused space.
        </p>
      </div>
    </main>
  )
}
