import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { requireSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { AddMemberDialog } from '@/components/projects/add-member-dialog'
import { RemoveMemberForm } from '@/components/projects/remove-member-form'
import { EditProjectForm } from '@/components/projects/edit-project-form'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const project = await prisma.project.findUnique({ where: { id }, select: { name: true } })
  return { title: project ? `Settings — ${project.name}` : 'Settings' }
}

export default async function ProjectSettingsPage({ params }: Props) {
  const { id } = await params
  const session = await requireSession()

  const project = await prisma.project.findUnique({
    where: { id },
    include: { members: { include: { user: true }, orderBy: { createdAt: 'asc' } } },
  })

  if (!project) notFound()

  const isMember = project.members.some((m) => m.userId === session.user.id)
  if (!isMember) notFound()

  const isOwner = project.ownerId === session.user.id

  return (
    <div className="p-6 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Project settings</h1>
        <p className="text-sm text-muted-foreground mt-1">{project.name}</p>
      </div>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-sm font-semibold">General</h2>
        <EditProjectForm project={project} />
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            Members <span className="text-muted-foreground font-normal">({project.members.length})</span>
          </h2>
          <AddMemberDialog projectId={id} />
        </div>

        <ul className="space-y-2">
          {project.members.map((membership) => {
            const user = membership.user
            const initials = user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
            const canRemove = isOwner || membership.userId === session.user.id
            const isProjectOwner = user.id === project.ownerId

            return (
              <li key={membership.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isProjectOwner && (
                    <span className="text-xs text-muted-foreground">Owner</span>
                  )}
                  {canRemove && !isProjectOwner && (
                    <RemoveMemberForm
                      memberId={membership.userId}
                      projectId={id}
                      isSelf={membership.userId === session.user.id}
                    />
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
