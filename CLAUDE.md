# CLAUDE.md — Project Management Dashboard (Final Project)

Rules for Claude Code working in this repository. Read `PRD.md` for what to build.

## Project context
A **standalone full-stack capstone app** (Project Management Dashboard), separate from the course example repo. It is the reference app the course builds toward and the demo recorded in Modul 0. Build it as **one cohesive app** via feature branches.

## Golden rules
1. **Feature branches off `main`.** Name: `feat/<area>` (e.g., `feat/auth`, `feat/tasks`). Branch from the latest `main`; keep each branch scoped to one feature area (see PRD §9).
2. **Push the branch and open a PR** for the instructor to review and merge. **Do not merge yourself.** Merge order follows the milestone sequence so each PR's diff stays clean.
3. **Document well, but only what's needed.** Maintain `README.md` (setup, scripts, env vars, demo accounts). No unnecessary files or abstractions; don't over-engineer.
4. **Stay on the locked stack & verify current docs.** Next 16, React 19, TS (strict), Tailwind v4 + shadcn/ui, Prisma 7, Better Auth, Zod, Bun, Vercel. These libraries are recent — confirm current APIs against official docs before coding; do not rely on memory.
5. **No banned/deprecated patterns:** `proxy.ts` not `middleware.ts`; `params`/`searchParams` are **async** (await them); caching is **opt-in** (`use cache`).
6. **Security is non-negotiable.** Never rely on `proxy.ts` alone for auth (CVE-2025-29927 class). Verify session + permission in every protected Server Component, Server Action, and Route Handler. Scope all data access to the current user; never trust client-sent IDs without an ownership check.
7. **Use Bun for everything:** `bun install`, `bun add`, `bun --bun next dev`, `bunx shadcn@latest add ...`, `bunx prisma ...`.
8. **No tests, no Docker, Vercel-only.** Testing is out of course scope — do not add a test framework. Deploy target is Vercel only.
9. **Validate all input with Zod** on the server. TypeScript `strict`; avoid `any`.
10. **Quality gate before every PR:** ESLint + Prettier + `tsc --noEmit` must pass; the app must build.

## Git & PR workflow
```bash
git checkout main && git pull
git checkout -b feat/tasks
# ...build the feature...
git add -A && git commit -m "feat(tasks): CRUD, statuses, optimistic UI"
git push -u origin feat/tasks
# open a PR -> base: main
```
- **Commits:** Conventional Commits (`feat`, `fix`, `chore`, `docs`).
- **PR body:** what was built, how to run/test manually, env needed, and what to review.
- Keep diffs scoped to the feature.

## Commands
| Task | Command |
|------|---------|
| Install | `bun install` |
| Dev | `bun --bun next dev` |
| Lint / format / types | `bun run lint` · `bunx prettier -w .` · `bunx tsc --noEmit` |
| shadcn component | `bunx shadcn@latest add button` |
| Prisma migrate / studio / seed | `bunx prisma migrate dev` · `bunx prisma studio` · `bun run db:seed` |
| Prod migrate (deploy) | `bunx prisma migrate deploy` |

## Architecture & conventions
- App Router; **Server Components by default**, `'use client'` only for interactivity.
- **Mutations via Server Actions** (Zod-validated); Route Handlers only where Actions don't fit.
- Prisma Client **singleton**; driver adapter `@prisma/adapter-pg`; connection pooling for production.
- Feature-based folders: `components/{ui,layout,projects,tasks,...}`, `lib/`, `actions/`, `types/`.
- shadcn/ui is the only component system; theme via CSS variables; dark mode supported.
- Optimistic UI (`useOptimistic`) for task status changes.

## Do NOT
- Merge PRs yourself.
- Add tests, Docker, or non-Vercel deploy targets.
- Use deprecated Next patterns (`middleware.ts`, sync params) or assume default fetch caching.
- Introduce dependencies outside the locked stack without justifying them in the PR.
- Commit secrets or real `.env` files.

## Demo readiness (for Modul 0)
- Ship `prisma/seed.ts` with demo users (1 admin, 2 members), projects, tasks, comments, attachments.
- Document demo accounts in `README.md`.
- Ensure a clean `bun install && bun run db:migrate && bun run db:seed && bun --bun next dev` works, and deploy to Vercel.
