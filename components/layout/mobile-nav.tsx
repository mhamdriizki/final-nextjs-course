'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, FolderKanban, User, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOutAction } from '@/actions/auth'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/profile', label: 'Profile', icon: User },
]

interface MobileNavProps {
  user: { name: string; email: string }
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <button
        className="md:hidden flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-background px-4 py-6">
            <div className="mb-8 flex items-center justify-between px-2">
              <Link
                href="/dashboard"
                className="text-xl font-bold"
                onClick={() => setOpen(false)}
              >
                ProjectFlow
              </Link>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent transition-colors"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    pathname.startsWith(href)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="space-y-1">
              <div className="px-3 py-2">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </form>
            </div>
          </aside>
        </>
      )}
    </>
  )
}
