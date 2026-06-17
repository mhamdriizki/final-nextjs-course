import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <p className="text-muted-foreground">Sign in — coming soon</p>
    </main>
  )
}
