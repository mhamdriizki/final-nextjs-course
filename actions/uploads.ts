'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

const UpdateAvatarSchema = z.object({ url: z.url() })

const CreateAttachmentSchema = z.object({
  taskId: z.string().min(1),
  url: z.url(),
  filename: z.string().min(1).max(255),
})

export async function updateAvatar(url: string): Promise<void> {
  const session = await requireSession()
  const parsed = UpdateAvatarSchema.safeParse({ url })
  if (!parsed.success) return

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: parsed.data.url },
  })

  revalidatePath('/profile')
}

export async function createAttachment(
  taskId: string,
  url: string,
  filename: string
): Promise<{ error?: string }> {
  const session = await requireSession()
  const parsed = CreateAttachmentSchema.safeParse({ taskId, url, filename })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const task = await prisma.task.findUnique({ where: { id: parsed.data.taskId } })
  if (!task) return { error: 'Task not found' }

  const membership = await prisma.membership.findUnique({
    where: { userId_projectId: { userId: session.user.id, projectId: task.projectId } },
  })
  if (!membership) return { error: 'Forbidden' }

  await prisma.attachment.create({
    data: {
      url: parsed.data.url,
      filename: parsed.data.filename,
      taskId: parsed.data.taskId,
    },
  })

  revalidatePath(`/tasks/${parsed.data.taskId}`)
  return {}
}
