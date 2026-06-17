'use client'

import { useOptimistic, useTransition } from 'react'
import Link from 'next/link'
import { CalendarDays, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateTaskStatus } from '@/actions/tasks'
import { TaskPriorityBadge } from './task-status-badge'

type Status = 'TODO' | 'IN_PROGRESS' | 'DONE'
type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

interface Task {
  id: string
  title: string
  status: Status
  priority: Priority
  dueDate: Date | null
  assignee: { name: string } | null
}

const COLUMNS: { key: Status; label: string }[] = [
  { key: 'TODO', label: 'To Do' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'DONE', label: 'Done' },
]

export function TaskBoard({ tasks }: { tasks: Task[] }) {
  const [optimisticTasks, setOptimisticStatus] = useOptimistic(
    tasks,
    (current, { taskId, status }: { taskId: string; status: Status }) =>
      current.map((t) => (t.id === taskId ? { ...t, status } : t))
  )
  const [, startTransition] = useTransition()

  function handleStatusChange(taskId: string, status: Status) {
    startTransition(async () => {
      setOptimisticStatus({ taskId, status })
      await updateTaskStatus(taskId, status)
    })
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-4 min-h-100" style={{ minWidth: 'calc(3 * 18rem + 2 * 1rem)' }}>
      {COLUMNS.map(({ key, label }) => {
        const columnTasks = optimisticTasks.filter((t) => t.status === key)
        return (
          <div key={key} className="flex w-72 shrink-0 flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium">{label}</span>
              <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                {columnTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 rounded-lg bg-muted/40 p-2 min-h-50">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>
        )
      })}
      </div>
    </div>
  )
}

function TaskCard({
  task,
  onStatusChange,
}: {
  task: Task
  onStatusChange: (id: string, s: Status) => void
}) {
  const isOverdue =
    task.dueDate && task.status !== 'DONE' && new Date(task.dueDate) < new Date()

  return (
    <div className="rounded-md bg-card border p-3 space-y-2 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/tasks/${task.id}`} className="text-sm font-medium hover:underline line-clamp-2">
        {task.title}
      </Link>
      <div className="flex items-center gap-1.5 flex-wrap">
        <TaskPriorityBadge priority={task.priority} />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
          {task.assignee && (
            <span className="flex items-center gap-1 truncate">
              <User className="h-3 w-3 shrink-0" />
              {task.assignee.name.split(' ')[0]}
            </span>
          )}
          {task.dueDate && (
            <span className={cn('flex items-center gap-1', isOverdue && 'text-destructive')}>
              <CalendarDays className="h-3 w-3 shrink-0" />
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
          className="text-xs border-0 bg-transparent focus:outline-none cursor-pointer text-muted-foreground hover:text-foreground"
          aria-label="Change status"
          onClick={(e) => e.stopPropagation()}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>
    </div>
  )
}
