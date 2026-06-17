import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { requireSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { TaskBoard } from '@/components/tasks/task-board'
import { TaskTable } from '@/components/tasks/task-table'
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog'

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
      tasks: {
        include: { assignee: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
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
          <CreateTaskDialog projectId={id} members={project.members} />
          <Link
            href={`/projects/${id}/settings`}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </div>
      </div>

      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>
        <TabsContent value="board" className="mt-4">
          <TaskBoard tasks={project.tasks} />
        </TabsContent>
        <TabsContent value="table" className="mt-4">
          <TaskTable tasks={project.tasks} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
