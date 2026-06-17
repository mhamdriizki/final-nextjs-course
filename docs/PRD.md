# PRD — Project Management Dashboard (Final Project)

**Repo:** `pm-dashboard` (standalone)
**Owner:** Muhamad Rizki (EasyCoding instructor)
**Audience for this doc:** Claude Code (build agent) + instructor

> Read `CLAUDE.md` first for the git/branch workflow and hard rules. This PRD defines **what** to build.

---

## 1. Purpose

A standalone, full-stack **Project Management Dashboard**. This repo is **separate from the course example repo** and serves two roles:

1. The **capstone reference app** the course builds toward (concept-first: students assemble it conceptually by Modul 16).
2. The **demo asset** — the finished, deployed app is screen-recorded in **Modul 0 (Orientasi)** as the "this is what you'll build" preview.

Because of (2), the first priority is to reach a **working, seeded, deployed app** that can be recorded.

---

## 2. Goals & Non-Goals

### Goals
- A working, deployed (Vercel), production-shaped app using the full course stack.
- Clean, readable, teachable code (it is studied by learners).
- Seeded demo data + demo accounts so the app looks real on first run.

### Non-Goals (do NOT build)
- **No automated tests** (out of course scope) — no Vitest/Jest/Playwright unless asked.
- **No Docker / self-host / GitHub Pages.** Deploy target is **Vercel only**.
- No real-time/WebSockets, billing, mobile app, i18n, GraphQL, or monorepo tooling.

---

## 3. Personas & Roles

| Role | Capabilities |
|------|--------------|
| **Admin** | Member capabilities + create projects, manage membership/roles, delete any project/task. |
| **Member** | View own projects, create/edit/complete tasks, comment, upload attachments, edit own profile. |

RBAC is enforced **server-side in the data layer / Server Actions** — never only in the UI or `proxy.ts` (see §8).

---

## 4. Tech Stack (locked — matches the course)

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, RSC, Server Actions) |
| UI | React 19 |
| Language | TypeScript 5.x, `strict: true` |
| Styling | Tailwind CSS v4 + shadcn/ui (only component system) |
| DB | PostgreSQL (hosted: Prisma Postgres / Neon / Supabase) |
| ORM | Prisma 7 (`prisma-client` generator, `prisma.config.ts`, `@prisma/adapter-pg`) |
| Auth | Better Auth (email/password + Google) + Prisma adapter |
| Validation | Zod (shared client + server schemas) |
| Forms | react-hook-form + Zod; React 19 `useActionState`/`useFormStatus`/`useOptimistic` |
| Tables/Charts | TanStack Table + Recharts (or Tremor) |
| Tooling | Bun, ESLint, Prettier |
| Deploy | Vercel |

Confirm current APIs against official docs. No deprecated patterns: `proxy.ts` not `middleware.ts`; async `params`/`searchParams`; caching is opt-in (`use cache`).

---

## 5. Feature Requirements (with acceptance criteria)

**5.1 Auth (Better Auth)** — email/password + Google login, sessions, logout. New users default to `MEMBER`. Unauthenticated users redirected to `/login`. *Done when:* a user can sign up, log in (both methods), reach the dashboard, and log out.

**5.2 Projects** — Admin creates projects (name, description, optional color). Project has owner + members. List/detail/edit/archive/delete. *Done when:* CRUD works via Server Actions; non-members cannot read a project they don't belong to.

**5.3 Members** — Admin/owner adds existing users to a project and sets project role; remove members. *Done when:* changes revalidate immediately and are enforced server-side.

**5.4 Tasks** — Within a project: CRUD. Fields: title, description, `status` (TODO/IN_PROGRESS/DONE), `priority` (LOW/MEDIUM/HIGH), assignee (a member), due date. Board/table view; filter/sort/paginate. *Done when:* status changes use **optimistic UI** (`useOptimistic`) and Server Actions; inputs validated with Zod.

**5.5 Comments** — Members comment on tasks (author + timestamp). *Done when:* add/list works; only author or admin can delete.

**5.6 Attachments & Avatars** — Upload task attachments + user avatar to cloud storage (Cloudinary/UploadThing); Zod type/size validation; display via `next/image`. *Done when:* upload + display works; invalid files rejected with a clear error.

**5.7 Dashboard / Analytics** — Overview with stat cards (projects, open tasks, completion %, overdue), charts (tasks by status, completion over time), and a tasks table (TanStack Table) with sort/filter/pagination. *Done when:* it reflects real seeded data and updates after mutations.

---

## 6. Data Model (Prisma 7 sketch)

Auth tables (`User`/`Session`/`Account`/`Verification`) are owned by **Better Auth's** schema — align to it and extend `User` with `role`. App-domain models:

```prisma
enum Role { ADMIN MEMBER }
enum TaskStatus { TODO IN_PROGRESS DONE }
enum Priority { LOW MEDIUM HIGH }

model User { id String @id; name String; email String @unique; image String?
  role Role @default(MEMBER); memberships Membership[]; assigned Task[] @relation("Assignee"); comments Comment[] }

model Project { id String @id @default(cuid()); name String; description String?; ownerId String
  members Membership[]; tasks Task[]; createdAt DateTime @default(now()) }

model Membership { id String @id @default(cuid()); userId String; projectId String
  user User @relation(fields:[userId], references:[id]); project Project @relation(fields:[projectId], references:[id])
  @@unique([userId, projectId]) }

model Task { id String @id @default(cuid()); title String; description String?
  status TaskStatus @default(TODO); priority Priority @default(MEDIUM); dueDate DateTime?
  projectId String; assigneeId String?
  project Project @relation(fields:[projectId], references:[id])
  assignee User? @relation("Assignee", fields:[assigneeId], references:[id])
  comments Comment[]; attachments Attachment[]; createdAt DateTime @default(now()) }

model Comment { id String @id @default(cuid()); body String; taskId String; authorId String
  task Task @relation(fields:[taskId], references:[id]); author User @relation(fields:[authorId], references:[id]); createdAt DateTime @default(now()) }

model Attachment { id String @id @default(cuid()); url String; filename String; taskId String
  task Task @relation(fields:[taskId], references:[id]); createdAt DateTime @default(now()) }
```

---

## 7. Route Map (App Router)

```
/                         landing (static)
/login, /register         auth (Better Auth)
/dashboard                stats + charts            [protected]
/projects                 user's projects           [protected]
/projects/[id]            tasks board/table         [protected]
/projects/[id]/settings   members & settings        [admin/owner]
/tasks/[id]               comments + attachments    [protected]
/profile                  profile + avatar          [protected]
proxy.ts                  coarse gating (NOT the security boundary)
```
Use `loading.tsx` / `error.tsx` / `not-found.tsx` in protected segments.

---

## 8. Non-Functional & Security

- TypeScript `strict`; types inferred Prisma → UI; avoid `any`.
- Every mutation input validated with Zod on the server.
- Mobile-first responsive; shadcn/Radix a11y; dark mode.
- Server Components by default; opt into caching with `use cache`; stream with Suspense.
- **Security:** do not rely on `proxy.ts` alone for auth (CVE-2025-29927 class). Every protected Server Component / Server Action / Route Handler independently verifies session + permission. Authorization scoped to the current user in the data layer (only return projects where a `Membership` exists). Never trust client-sent IDs without an ownership check.
- All secrets in env vars; provide `.env.example`; never commit secrets.

---

## 9. Suggested Build Milestones (feature branches → PRs)

Build as one cohesive app via feature branches off `main` (see `CLAUDE.md`). Suggested order:

1. `feat/scaffold` — base app: Next 16 + TS + Tailwind + shadcn + ESLint/Prettier + `.env.example`.
2. `feat/db-prisma` — Prisma schema, migrations, client singleton, seed.
3. `feat/auth` — Better Auth + Prisma adapter, login/register/logout, `proxy.ts` + data-layer checks, RBAC.
4. `feat/projects` — projects + membership CRUD (Server Actions, Zod).
5. `feat/tasks` — tasks CRUD, statuses, assignees, optimistic UI; comments.
6. `feat/uploads` — attachments + avatars.
7. `feat/dashboard` — analytics: stat cards, charts, TanStack Table, filters, pagination.
8. `feat/seo` — metadata, sitemap, robots, fonts.
9. `feat/deploy` — Vercel config, migrate-deploy in build, production DB pooling.

> If the immediate need is the Modul 0 demo, build straight through these milestones to a deployed, seeded app first.

---

## 10. Demo & Definition of Done

- Seed (`prisma/seed.ts`, `bun run db:seed`): 1 admin + 2 members, 3–4 projects, ~15 tasks across statuses, a few comments/attachments.
- Demo accounts documented in `README.md` (e.g. `admin@demo.test`).
- Deployed to Vercel with seeded DB; demo accounts log in; dashboard shows real data.
- Runs with `bun install && bun run db:migrate && bun run db:seed && bun --bun next dev`.
- `README.md` documents setup, scripts, env vars, and demo accounts.
