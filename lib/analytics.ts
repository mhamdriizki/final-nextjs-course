import { prisma } from '@/lib/prisma'

export async function getOverviewStats(userId: string) {
  const memberships = await prisma.membership.findMany({
    where: { userId },
    select: { projectId: true },
  })
  const projectIds = memberships.map((m) => m.projectId)

  const [totalProjects, totalTasks, doneTasks, overdueTasks] = await Promise.all([
    prisma.project.count({ where: { id: { in: projectIds }, archived: false } }),
    prisma.task.count({ where: { projectId: { in: projectIds } } }),
    prisma.task.count({ where: { projectId: { in: projectIds }, status: 'DONE' } }),
    prisma.task.count({
      where: {
        projectId: { in: projectIds },
        status: { not: 'DONE' },
        dueDate: { lt: new Date() },
      },
    }),
  ])

  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  return { totalProjects, totalTasks, doneTasks, overdueTasks, completionRate }
}

export async function getTasksByStatus(userId: string) {
  const memberships = await prisma.membership.findMany({
    where: { userId },
    select: { projectId: true },
  })
  const projectIds = memberships.map((m) => m.projectId)

  const [todo, inProgress, done] = await Promise.all([
    prisma.task.count({ where: { projectId: { in: projectIds }, status: 'TODO' } }),
    prisma.task.count({ where: { projectId: { in: projectIds }, status: 'IN_PROGRESS' } }),
    prisma.task.count({ where: { projectId: { in: projectIds }, status: 'DONE' } }),
  ])

  return [
    { status: 'To Do', count: todo },
    { status: 'In Progress', count: inProgress },
    { status: 'Done', count: done },
  ]
}

export async function getCompletionOverTime(userId: string) {
  const memberships = await prisma.membership.findMany({
    where: { userId },
    select: { projectId: true },
  })
  const projectIds = memberships.map((m) => m.projectId)

  const since = new Date()
  since.setDate(since.getDate() - 29)
  since.setHours(0, 0, 0, 0)

  const tasks = await prisma.task.findMany({
    where: {
      projectId: { in: projectIds },
      status: 'DONE',
      updatedAt: { gte: since },
    },
    select: { updatedAt: true },
  })

  // Build a map of date -> count for the last 30 days
  const counts: Record<string, number> = {}
  for (let i = 0; i < 30; i++) {
    const d = new Date(since)
    d.setDate(since.getDate() + i)
    counts[d.toISOString().slice(0, 10)] = 0
  }
  for (const t of tasks) {
    const key = t.updatedAt.toISOString().slice(0, 10)
    if (key in counts) counts[key]++
  }

  return Object.entries(counts).map(([date, completed]) => ({ date, completed }))
}

export async function getAllTasksForUser(userId: string) {
  const memberships = await prisma.membership.findMany({
    where: { userId },
    select: { projectId: true },
  })
  const projectIds = memberships.map((m) => m.projectId)

  return prisma.task.findMany({
    where: { projectId: { in: projectIds } },
    include: {
      project: { select: { name: true, color: true } },
      assignee: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}
