'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireSession } from '@/lib/session'
import { requireProjectMember } from '@/lib/permissions'
import { CreateCommentSchema } from '@/types/task'

export type CommentActionState = { error?: string }

export async function addComment(
  _prev: CommentActionState,
  formData: FormData
): Promise<CommentActionState> {
  const session = await requireSession()

  const parsed = CreateCommentSchema.safeParse({
    body: formData.get('body'),
    taskId: formData.get('taskId'),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const task = await prisma.task.findUnique({ where: { id: parsed.data.taskId } })
  if (!task) return { error: 'Task not found' }

  await requireProjectMember(task.projectId)

  await prisma.comment.create({
    data: {
      body: parsed.data.body,
      taskId: parsed.data.taskId,
      authorId: session.user.id,
    },
  })

  revalidatePath(`/tasks/${parsed.data.taskId}`)
  return {}
}

export async function deleteComment(commentId: string): Promise<void> {
  const session = await requireSession()

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { task: true },
  })
  if (!comment) return

  // Only the author can delete their comment
  if (comment.authorId !== session.user.id) return

  await prisma.comment.delete({ where: { id: commentId } })
  revalidatePath(`/tasks/${comment.taskId}`)
}
