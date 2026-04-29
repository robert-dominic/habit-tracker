import SignupForm from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <main className="flex min-h-screen bg-background">
      <div className="relative hidden w-0 flex-1 lg:block bg-surface-muted">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg space-y-6">
            <h3 className="text-3xl font-bold text-foreground">
              Join the tracking
            </h3>
            <p className="text-lg text-muted">
              Create your account, add habits in seconds, and track today&apos;s
              progress in a calm interface designed to keep momentum visible.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <h2 className="mt-8 text-3xl font-bold tracking-tight text-foreground">
              Daily Focus
            </h2>
            <p className="mt-2 text-sm text-muted">
              Build a rhythm that feels sustainable.
            </p>
          </div>
          <SignupForm />
        </div>
      </div>
    </main>
  )
}
