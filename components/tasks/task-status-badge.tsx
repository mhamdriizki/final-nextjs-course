import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_LABELS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
} as const

const STATUS_CLASSES = {
  TODO: 'bg-muted text-muted-foreground',
  IN_PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  DONE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
} as const

const PRIORITY_LABELS = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' } as const

const PRIORITY_CLASSES = {
  LOW: 'bg-muted text-muted-foreground',
  MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  HIGH: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
} as const

type Status = keyof typeof STATUS_LABELS
type Priority = keyof typeof PRIORITY_LABELS

export function TaskStatusBadge({ status }: { status: Status }) {
  return (
    <Badge className={cn('border-0', STATUS_CLASSES[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}

export function TaskPriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge className={cn('border-0', PRIORITY_CLASSES[priority])}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  )
}
