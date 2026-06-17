import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { requireSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const project = await prisma.project.findUnique({ where: { id }, select: { name: true } })
  return { title: project?.name ?? 'Project' }
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params
  const session = await requireSession()

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      members: { include: { user: true } },
      _count: { select: { tasks: true } },
    },
  })

  if (!project) notFound()

  const isMember = project.members.some((m) => m.userId === session.user.id)
  if (!isMember) notFound()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {project.color && (
            <div className="h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: project.color }} />
          )}
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold truncate">{project.name}</h1>
            {project.description && (
              <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {project.archived && <Badge variant="secondary">Archived</Badge>}
          <Link
            href={`/projects/${id}/settings`}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </div>
      </div>

      {/* Task board — coming in feat/tasks */}
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">
          Task board coming in the next milestone.
        </p>
      </div>
    </div>
  )
}
