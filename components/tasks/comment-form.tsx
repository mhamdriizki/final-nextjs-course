'use client'

import { useActionState, useRef, useEffect } from 'react'
import { addComment } from '@/actions/comments'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function CommentForm({ taskId }: { taskId: string }) {
  const [state, action, pending] = useActionState(addComment, {})
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!pending && !state.error) formRef.current?.reset()
  }, [pending, state.error])

  return (
    <form ref={formRef} action={action} className="space-y-2">
      <input type="hidden" name="taskId" value={taskId} />
      <Textarea name="body" placeholder="Add a comment…" rows={3} required maxLength={2000} />
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? 'Posting…' : 'Post comment'}
        </Button>
      </div>
    </form>
  )
}
