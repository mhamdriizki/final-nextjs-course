'use client'

import { useActionState } from 'react'
import { removeMember } from '@/actions/projects'
import { Button } from '@/components/ui/button'

interface RemoveMemberFormProps {
  memberId: string
  projectId: string
  isSelf: boolean
}

export function RemoveMemberForm({ memberId, projectId, isSelf }: RemoveMemberFormProps) {
  const [, action, pending] = useActionState(removeMember, {})

  return (
    <form action={action}>
      <input type="hidden" name="memberId" value={memberId} />
      <input type="hidden" name="projectId" value={projectId} />
      <Button type="submit" variant="ghost" size="sm" disabled={pending}
        className="text-muted-foreground hover:text-destructive h-7 text-xs"
      >
        {isSelf ? 'Leave' : 'Remove'}
      </Button>
    </form>
  )
}
