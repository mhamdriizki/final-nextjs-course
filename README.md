# ProjectFlow

A full-stack project management dashboard built with Next.js 16.

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Prisma 7 · Better Auth · Zod · Bun · Vercel

## Local setup

```bash
# 1. Install dependencies
bun install

# 2. Copy env and fill in values
cp .env.example .env

# 3. Run migrations
bun run db:migrate   # or: bunx prisma migrate dev

# 4. Seed demo data
bun run db:seed

# 5. Start dev server
bun --bun next dev
```

## Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Prisma Postgres connection string |
| `BETTER_AUTH_SECRET` | Random secret (run `openssl rand -hex 32`) |
| `BETTER_AUTH_URL` | App base URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Same as above, exposed to the browser |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `UPLOADTHING_TOKEN` | UploadThing API token |

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@demo.test` | `Demo1234!` |
| Member | `alice@demo.test` | `Demo1234!` |
| Member | `bob@demo.test` | `Demo1234!` |
