import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Profile' }

export default function ProfilePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="mt-2 text-muted-foreground">
        Your profile settings — coming soon
      </p>
    </div>
  )
}
