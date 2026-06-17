'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireSession } from '@/lib/session'
import { requireProjectMember } from '@/lib/permissions'
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  AddMemberSchema,
  RemoveMemberSchema,
} from '@/types/project'

export type ProjectActionState = { error?: string }

export async function createProject(
  _prev: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  const session = await requireSession()

  const parsed = CreateProjectSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description') || undefined,
    color: formData.get('color') || undefined,
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const project = await prisma.project.create({
    data: {
      ...parsed.data,
      ownerId: session.user.id,
      members: { create: { userId: session.user.id } },
    },
  })

  revalidatePath('/projects')
  redirect(`/projects/${project.id}`)
}

export async function updateProject(
  projectId: string,
  _prev: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  await requireProjectMember(projectId)

  const parsed = UpdateProjectSchema.safeParse({
    name: formData.get('name') || undefined,
    description: formData.get('description') || undefined,
    color: formData.get('color') || undefined,
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  await prisma.project.update({ where: { id: projectId }, data: parsed.data })

  revalidatePath(`/projects/${projectId}`)
  revalidatePath('/projects')
  return {}
}

export async function archiveProject(projectId: string): Promise<void> {
  await requireProjectMember(projectId)
  await prisma.project.update({ where: { id: projectId }, data: { archived: true } })
  revalidatePath('/projects')
  redirect('/projects')
}

export async function deleteProject(projectId: string): Promise<void> {
  const session = await requireSession()
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project || project.ownerId !== session.user.id) return
  await prisma.project.delete({ where: { id: projectId } })
  revalidatePath('/projects')
  redirect('/projects')
}

export async function addMember(
  _prev: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  const session = await requireSession()

  const parsed = AddMemberSchema.safeParse({
    email: formData.get('email'),
    projectId: formData.get('projectId'),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  // Caller must be a member
  await requireProjectMember(parsed.data.projectId)

  const userToAdd = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  if (!userToAdd) return { error: 'No user found with that email' }
  if (userToAdd.id === session.user.id) return { error: 'You are already a member' }

  const existing = await prisma.membership.findUnique({
    where: { userId_projectId: { userId: userToAdd.id, projectId: parsed.data.projectId } },
  })
  if (existing) return { error: 'User is already a member' }

  await prisma.membership.create({
    data: { userId: userToAdd.id, projectId: parsed.data.projectId },
  })

  revalidatePath(`/projects/${parsed.data.projectId}/settings`)
  return {}
}

export async function removeMember(
  _prev: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  const session = await requireSession()

  const parsed = RemoveMemberSchema.safeParse({
    memberId: formData.get('memberId'),
    projectId: formData.get('projectId'),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const project = await prisma.project.findUnique({ where: { id: parsed.data.projectId } })
  if (!project) return { error: 'Project not found' }

  // Only owner can remove members; members can remove themselves
  const isSelf = parsed.data.memberId === session.user.id
  const isOwner = project.ownerId === session.user.id
  if (!isSelf && !isOwner) return { error: 'Not authorised' }
  if (parsed.data.memberId === project.ownerId) return { error: 'Cannot remove the project owner' }

  await prisma.membership.delete({
    where: {
      userId_projectId: { userId: parsed.data.memberId, projectId: parsed.data.projectId },
    },
  })

  revalidatePath(`/projects/${parsed.data.projectId}/settings`)
  return {}
}
