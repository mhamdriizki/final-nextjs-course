import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const f = createUploadthing()

export const ourFileRouter = {
  avatarUploader: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({ headers: req.headers })
      if (!session) throw new Error('Unauthorized')
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ file }) => {
      return { ufsUrl: file.ufsUrl }
    }),

  taskAttachment: f({
    image: { maxFileSize: '8MB', maxFileCount: 1 },
    pdf: { maxFileSize: '8MB', maxFileCount: 1 },
  })
    .input(z.object({ taskId: z.string().min(1) }))
    .middleware(async ({ req, input }) => {
      const session = await auth.api.getSession({ headers: req.headers })
      if (!session) throw new Error('Unauthorized')

      const task = await prisma.task.findUnique({ where: { id: input.taskId } })
      if (!task) throw new Error('Task not found')

      const membership = await prisma.membership.findUnique({
        where: { userId_projectId: { userId: session.user.id, projectId: task.projectId } },
      })
      if (!membership) throw new Error('Forbidden')

      return { userId: session.user.id, taskId: input.taskId }
    })
    .onUploadComplete(async ({ file }) => {
      return { ufsUrl: file.ufsUrl, filename: file.name }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
