'use client'

import { useActionState } from 'react'
import { updateProject } from '@/actions/projects'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface EditProjectFormProps {
  project: { id: string; name: string; description: string | null; color: string | null }
}

const PRESET_COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
]

export function EditProjectForm({ project }: EditProjectFormProps) {
  const boundAction = updateProject.bind(null, project.id)
  const [state, action, pending] = useActionState(boundAction, {})

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Project name</Label>
        <Input id="name" name="name" defaultValue={project.name} required maxLength={80} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" defaultValue={project.description ?? ''} maxLength={500} />
      </div>
      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <label key={c} className="cursor-pointer">
              <input
                type="radio"
                name="color"
                value={c}
                defaultChecked={project.color === c}
                className="sr-only"
              />
              <span
                className="block h-6 w-6 rounded-full ring-2 ring-transparent ring-offset-2 hover:ring-primary transition-all has-checked:ring-primary"
                style={{ backgroundColor: c }}
              />
            </label>
          ))}
        </div>
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.error === undefined && !pending && (
        <p className="text-sm text-muted-foreground" aria-live="polite" />
      )}
      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  )
}
