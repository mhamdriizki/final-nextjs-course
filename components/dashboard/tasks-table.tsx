'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { TaskStatusBadge, TaskPriorityBadge } from '@/components/tasks/task-status-badge'

type Status = 'TODO' | 'IN_PROGRESS' | 'DONE'
type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

interface Task {
  id: string
  title: string
  status: Status
  priority: Priority
  dueDate: Date | null
  project: { name: string; color: string | null }
  assignee: { name: string } | null
}

const col = createColumnHelper<Task>()

const columns = [
  col.accessor('title', {
    header: 'Title',
    cell: (info) => (
      <Link href={`/tasks/${info.row.original.id}`} className="font-medium hover:underline">
        {info.getValue()}
      </Link>
    ),
  }),
  col.accessor((row) => row.project.name, {
    id: 'project',
    header: 'Project',
    cell: (info) => (
      <span className="flex items-center gap-1.5 text-sm">
        {info.row.original.project.color && (
          <span
            className="inline-block h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: info.row.original.project.color }}
          />
        )}
        {info.getValue()}
      </span>
    ),
  }),
  col.accessor('status', {
    header: ({ column }) => (
      <button className="flex items-center gap-1 text-xs font-medium" onClick={() => column.toggleSorting()}>
        Status <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: (info) => <TaskStatusBadge status={info.getValue()} />,
  }),
  col.accessor('priority', {
    header: ({ column }) => (
      <button className="flex items-center gap-1 text-xs font-medium" onClick={() => column.toggleSorting()}>
        Priority <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: (info) => <TaskPriorityBadge priority={info.getValue()} />,
  }),
  col.accessor('assignee', {
    header: 'Assignee',
    cell: (info) => info.getValue()?.name ?? <span className="text-muted-foreground">—</span>,
  }),
  col.accessor('dueDate', {
    header: ({ column }) => (
      <button className="flex items-center gap-1 text-xs font-medium" onClick={() => column.toggleSorting()}>
        Due <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: (info) => {
      const d = info.getValue()
      if (!d) return <span className="text-muted-foreground">—</span>
      const overdue = new Date(d) < new Date()
      return (
        <span className={overdue ? 'text-destructive' : ''}>
          {new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      )
    },
  }),
]

interface Props {
  tasks: Task[]
}

export function DashboardTasksTable({ tasks }: Props) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = statusFilter ? tasks.filter((t) => t.status === statusFilter) : tasks

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
  })

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search tasks…"
          className="h-8 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring sm:flex-none sm:w-56"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-160 text-sm">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No tasks found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t hover:bg-muted/30 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        {table.getRowModel().rows.length} of {tasks.length} task{tasks.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
