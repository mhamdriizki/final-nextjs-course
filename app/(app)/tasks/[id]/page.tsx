import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { requireSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { TaskStatusBadge, TaskPriorityBadge } from '@/components/tasks/task-status-badge'
import { CommentForm } from '@/components/tasks/comment-form'
import { CommentList } from '@/components/tasks/comment-list'
import { deleteTask } from '@/actions/tasks'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const task = await prisma.task.findUnique({ where: { id }, select: { title: true } })
  return { title: task?.title ?? 'Task' }
}

export default async function TaskPage({ params }: Props) {
  const { id } = await params
  const session = await requireSession()

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      project: true,
      assignee: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: 'asc' },
      },
      attachments: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!task) notFound()

  // Verify caller is a project member
  const membership = await prisma.membership.findUnique({
    where: { userId_projectId: { userId: session.user.id, projectId: task.projectId } },
  })
  if (!membership) notFound()

  const dueDateFormatted = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div className="p-6 max-w-3xl space-y-6">
      {/* Breadcrumb */}
      <Link
        href={`/projects/${task.projectId}`}
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), '-ml-2 text-muted-foreground')}
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        {task.project.name}
      </Link>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold leading-tight">{task.title}</h1>
          <form action={deleteTask.bind(null, task.id)}>
            <button
              type="submit"
              className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </form>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
        </div>
      </div>

      <Separator />

      {/* Meta */}
      <dl className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Assignee</dt>
          <dd className="font-medium mt-0.5">{task.assignee?.name ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Due date</dt>
          <dd className="font-medium mt-0.5">{dueDateFormatted ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Project</dt>
          <dd className="mt-0.5">
            <Link href={`/projects/${task.projectId}`} className="font-medium hover:underline">
              {task.project.name}
            </Link>
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Created</dt>
          <dd className="font-medium mt-0.5">
            {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </dd>
        </div>
      </dl>

      {task.description && (
        <>
          <Separator />
          <div className="space-y-1.5">
            <h2 className="text-sm font-medium">Description</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.description}</p>
          </div>
        </>
      )}

      {task.attachments.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h2 className="text-sm font-medium">Attachments ({task.attachments.length})</h2>
            <ul className="space-y-1">
              {task.attachments.map((a) => (
                <li key={a.id}>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {a.filename}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <Separator />

      {/* Comments */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium">Comments ({task.comments.length})</h2>
        <CommentList comments={task.comments} currentUserId={session.user.id} />
        <CommentForm taskId={task.id} />
      </div>
    </div>
  )
}
