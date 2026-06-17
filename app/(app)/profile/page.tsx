import type { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'
import { requireSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { AvatarUpload } from '@/components/uploads/avatar-upload'

export const metadata: Metadata = { title: 'Profile' }

export default async function ProfilePage() {
  const session = await requireSession()

  // Fetch fresh user data so avatar is up-to-date after upload
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true, role: true, createdAt: true },
  })

  if (!user) return null

  return (
    <div className="p-6 max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account settings</p>
      </div>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-sm font-semibold">Photo</h2>
        <AvatarUpload currentImage={user.image} name={user.name} />
      </section>

      <Separator />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Account details</h2>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium mt-0.5">{user.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium mt-0.5">{user.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Role</dt>
            <dd className="font-medium mt-0.5 capitalize">{user.role.toLowerCase()}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Member since</dt>
            <dd className="font-medium mt-0.5">
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
