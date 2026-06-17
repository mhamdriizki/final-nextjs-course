'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireSession } from '@/lib/session'
import { requireProjectMember } from '@/lib/permissions'
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  UpdateTaskStatusSchema,
} from '@/types/task'

export type TaskActionState = { error?: string }

export async function createTask(
  _prev: TaskActionState,
  formData: FormData
): Promise<TaskActionState> {
  await requireSession()

  const parsed = CreateTaskSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    status: formData.get('status') || 'TODO',
    priority: formData.get('priority') || 'MEDIUM',
    dueDate: formData.get('dueDate') || undefined,
    assigneeId: formData.get('assigneeId') || undefined,
    projectId: formData.get('projectId'),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  // Verify caller is a project member
  await requireProjectMember(parsed.data.projectId)

  const task = await prisma.task.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status,
      priority: parsed.data.priority,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
      assigneeId: parsed.data.assigneeId || null,
      projectId: parsed.data.projectId,
    },
  })

  revalidatePath(`/projects/${parsed.data.projectId}`)
  redirect(`/tasks/${task.id}`)
}

export async function updateTask(
  taskId: string,
  _prev: TaskActionState,
  formData: FormData
): Promise<TaskActionState> {
  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task) return { error: 'Task not found' }

  await requireProjectMember(task.projectId)

  const parsed = UpdateTaskSchema.safeParse({
    title: formData.get('title') || undefined,
    description: formData.get('description') || undefined,
    status: formData.get('status') || undefined,
    priority: formData.get('priority') || undefined,
    dueDate: formData.get('dueDate') || undefined,
    assigneeId: formData.get('assigneeId') || undefined,
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      ...parsed.data,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
      assigneeId: parsed.data.assigneeId ?? undefined,
    },
  })

  revalidatePath(`/tasks/${taskId}`)
  revalidatePath(`/projects/${task.projectId}`)
  return {}
}

export async function updateTaskStatus(taskId: string, status: string): Promise<void> {
  const parsed = UpdateTaskStatusSchema.safeParse({ taskId, status })
  if (!parsed.success) return

  const task = await prisma.task.findUnique({ where: { id: parsed.data.taskId } })
  if (!task) return

  await requireProjectMember(task.projectId)

  await prisma.task.update({
    where: { id: parsed.data.taskId },
    data: { status: parsed.data.status },
  })

  revalidatePath(`/projects/${task.projectId}`)
}

export async function deleteTask(taskId: string): Promise<void> {
  await requireSession()
  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task) return

  await requireProjectMember(task.projectId)

  await prisma.task.delete({ where: { id: taskId } })
  revalidatePath(`/projects/${task.projectId}`)
  redirect(`/projects/${task.projectId}`)
}
