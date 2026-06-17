import type { Metadata } from 'next'
import { Suspense } from 'react'
import { requireSession } from '@/lib/session'
import {
  getOverviewStats,
  getTasksByStatus,
  getCompletionOverTime,
  getAllTasksForUser,
} from '@/lib/analytics'
import { StatCard } from '@/components/dashboard/stat-card'
import { TaskStatusChart } from '@/components/dashboard/task-status-chart'
import { CompletionChart } from '@/components/dashboard/completion-chart'
import { DashboardTasksTable } from '@/components/dashboard/tasks-table'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await requireSession()
  const userId = session.user.id

  const [stats, statusData, completionData, tasks] = await Promise.all([
    getOverviewStats(userId),
    getTasksByStatus(userId),
    getCompletionOverTime(userId),
    getAllTasksForUser(userId),
  ])

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back, {session.user.name}</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active projects" value={stats.totalProjects} />
        <StatCard label="Total tasks" value={stats.totalTasks} />
        <StatCard
          label="Completion rate"
          value={`${stats.completionRate}%`}
          sub={`${stats.doneTasks} of ${stats.totalTasks} done`}
        />
        <StatCard
          label="Overdue"
          value={stats.overdueTasks}
          sub="tasks past due date"
          accent={stats.overdueTasks > 0}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-semibold">Tasks by status</p>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-48 animate-pulse rounded bg-muted" />}>
              <TaskStatusChart data={statusData} />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-semibold">Completions — last 30 days</p>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-48 animate-pulse rounded bg-muted" />}>
              <CompletionChart data={completionData} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* All tasks table */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">All tasks</h2>
        <Suspense fallback={<div className="h-48 animate-pulse rounded bg-muted" />}>
          <DashboardTasksTable tasks={tasks} />
        </Suspense>
      </div>
    </div>
  )
}
