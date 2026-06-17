import { z } from 'zod'

export const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid color').optional(),
})

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  archived: z.boolean().optional(),
})

export const AddMemberSchema = z.object({
  email: z.email('Invalid email address'),
  projectId: z.string().min(1),
})

export const RemoveMemberSchema = z.object({
  memberId: z.string().min(1),
  projectId: z.string().min(1),
})

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>
export type AddMemberInput = z.infer<typeof AddMemberSchema>
