'use client'

import { useActionState } from 'react'
import { createTask } from '@/actions/tasks'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Member {
  userId: string
  user: { id: string; name: string }
}

interface TaskFormProps {
  projectId: string
  members: Member[]
}

export function TaskForm({ projectId, members }: TaskFormProps) {
  const [state, action, pending] = useActionState(createTask, {})

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="projectId" value={projectId} />

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="Task title" required maxLength={200} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description <span className="text-muted-foreground">(optional)</span></Label>
        <Textarea id="description" name="description" placeholder="Add more details…" rows={3} maxLength={2000} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select name="status" id="status" defaultValue="TODO"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <select name="priority" id="priority" defaultValue="MEDIUM"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due date <span className="text-muted-foreground">(optional)</span></Label>
          <Input id="dueDate" name="dueDate" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="assigneeId">Assignee <span className="text-muted-foreground">(optional)</span></Label>
          <select name="assigneeId" id="assigneeId"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.userId} value={m.userId}>{m.user.name}</option>
            ))}
          </select>
        </div>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Creating…' : 'Create task'}
      </Button>
    </form>
  )
}
