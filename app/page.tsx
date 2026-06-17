import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl font-bold tracking-tight">ProjectFlow</h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Manage projects, track tasks, and collaborate with your team — all in
          one place.
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/dashboard" className={cn(buttonVariants({ size: 'lg' }))}>
          Go to Dashboard
        </Link>
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
        >
          Sign In
        </Link>
      </div>
    </main>
  )
}
