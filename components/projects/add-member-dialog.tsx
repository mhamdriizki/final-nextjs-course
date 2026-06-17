'use client'

import { useActionState } from 'react'
import { UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { addMember } from '@/actions/projects'

export function AddMemberDialog({ projectId }: { projectId: string }) {
  const [state, action, pending] = useActionState(addMember, {})

  return (
    <Dialog>
      <DialogTrigger className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
        <UserPlus className="h-4 w-4 mr-2" />
        Add member
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add a member</DialogTitle>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <input type="hidden" name="projectId" value={projectId} />
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" name="email" type="email" placeholder="colleague@example.com" required />
          </div>
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Adding…' : 'Add member'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
