import type { Metadata } from 'next'
import { requireSession } from '@/lib/session'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await requireSession()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome back, {session.user.name}. Analytics overview — coming soon.
      </p>
    </div>
  )
}
