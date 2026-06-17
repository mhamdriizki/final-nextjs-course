'use client'

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpDown } from 'lucide-react'
import { TaskStatusBadge, TaskPriorityBadge } from './task-status-badge'

type Status = 'TODO' | 'IN_PROGRESS' | 'DONE'
type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

interface Task {
  id: string
  title: string
  status: Status
  priority: Priority
  dueDate: Date | null
  assignee: { name: string } | null
}

const columnHelper = createColumnHelper<Task>()

const columns = [
  columnHelper.accessor('title', {
    header: 'Title',
    cell: (info) => (
      <Link href={`/tasks/${info.row.original.id}`} className="font-medium hover:underline">
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor('status', {
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 text-xs font-medium"
        onClick={() => column.toggleSorting()}
      >
        Status <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: (info) => <TaskStatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor('priority', {
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 text-xs font-medium"
        onClick={() => column.toggleSorting()}
      >
        Priority <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: (info) => <TaskPriorityBadge priority={info.getValue()} />,
  }),
  columnHelper.accessor('assignee', {
    header: 'Assignee',
    cell: (info) => info.getValue()?.name ?? <span className="text-muted-foreground">—</span>,
  }),
  columnHelper.accessor('dueDate', {
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 text-xs font-medium"
        onClick={() => column.toggleSorting()}
      >
        Due <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: (info) => {
      const d = info.getValue()
      if (!d) return <span className="text-muted-foreground">—</span>
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
  }),
]

export function TaskTable({ tasks }: { tasks: Task[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, columnFilters, globalFilter },
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
          onChange={(e) => {
            const val = e.target.value
            table.getColumn('status')?.setFilterValue(val || undefined)
          }}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <select
          onChange={(e) => {
            const val = e.target.value
            table.getColumn('priority')?.setFilterValue(val || undefined)
          }}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
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
        {table.getFilteredRowModel().rows.length} task{table.getFilteredRowModel().rows.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
