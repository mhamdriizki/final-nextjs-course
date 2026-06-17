'use client'

import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { TaskForm } from './task-form'

interface Member {
  userId: string
  user: { id: string; name: string }
}

interface CreateTaskDialogProps {
  projectId: string
  members: Member[]
}

export function CreateTaskDialog({ projectId, members }: CreateTaskDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className={cn(buttonVariants({ size: 'sm' }))}>
        <Plus className="h-4 w-4 mr-1.5" />
        Add task
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a task</DialogTitle>
        </DialogHeader>
        <TaskForm projectId={projectId} members={members} />
      </DialogContent>
    </Dialog>
  )
}
