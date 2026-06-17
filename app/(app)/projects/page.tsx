import type { Metadata } from 'next'
import { requireSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { ProjectCard } from '@/components/projects/project-card'
import { CreateProjectDialog } from '@/components/projects/create-project-dialog'

export const metadata: Metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  const session = await requireSession()

  const projects = await prisma.project.findMany({
    where: { members: { some: { userId: session.user.id } } },
    include: { _count: { select: { members: true, tasks: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const active = projects.filter((p) => !p.archived)
  const archived = projects.filter((p) => p.archived)

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {active.length} active project{active.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="shrink-0">
          <CreateProjectDialog />
        </div>
      </div>

      {active.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground text-sm">No projects yet. Create your first one.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((project) => (
            <ProjectCard key={project.id} project={project} currentUserId={session.user.id} />
          ))}
        </div>
      )}

      {archived.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground">Archived</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archived.map((project) => (
              <ProjectCard key={project.id} project={project} currentUserId={session.user.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
