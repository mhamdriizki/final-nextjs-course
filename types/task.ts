import { z } from 'zod'

export const TaskStatus = z.enum(['TODO', 'IN_PROGRESS', 'DONE'])
export const TaskPriority = z.enum(['LOW', 'MEDIUM', 'HIGH'])

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  status: TaskStatus.default('TODO'),
  priority: TaskPriority.default('MEDIUM'),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
  projectId: z.string().min(1),
})

export const UpdateTaskSchema = CreateTaskSchema.omit({ projectId: true }).partial()

export const UpdateTaskStatusSchema = z.object({
  taskId: z.string().min(1),
  status: TaskStatus,
})

export const CreateCommentSchema = z.object({
  body: z.string().min(1, 'Comment cannot be empty').max(2000),
  taskId: z.string().min(1),
})

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>
