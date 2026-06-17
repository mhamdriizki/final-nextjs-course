'use client'

import Link from 'next/link'
import { MoreHorizontal, Users, CheckSquare } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { archiveProject, deleteProject } from '@/actions/projects'

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description: string | null
    color: string | null
    archived: boolean
    ownerId: string
    _count: { members: number; tasks: number }
  }
  currentUserId: string
}

export function ProjectCard({ project, currentUserId }: ProjectCardProps) {
  const isOwner = project.ownerId === currentUserId

  return (
    <Card className="group relative hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {project.color && (
              <div
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: project.color }}
              />
            )}
            <Link
              href={`/projects/${project.id}`}
              className="font-semibold leading-tight truncate hover:underline"
            >
              {project.name}
            </Link>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {project.archived && (
              <Badge variant="secondary" className="text-xs">Archived</Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="h-7 w-7 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
                aria-label="Project options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link href={`/projects/${project.id}/settings`} />}>
                  Settings
                </DropdownMenuItem>
                {isOwner && !project.archived && (
                  <DropdownMenuItem onClick={() => { void archiveProject(project.id) }}>
                    Archive
                  </DropdownMenuItem>
                )}
                {isOwner && (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => { void deleteProject(project.id) }}
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {project._count.members} member{project._count.members !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <CheckSquare className="h-3.5 w-3.5" />
            {project._count.tasks} task{project._count.tasks !== 1 ? 's' : ''}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
