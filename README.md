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
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for OG tags, sitemap, and robots (e.g. `https://your-app.vercel.app`) |

## Deploy to Vercel

1. Push the repo and import it in the [Vercel dashboard](https://vercel.com/new).
2. Set all environment variables above in **Project → Settings → Environment Variables**. For `BETTER_AUTH_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL`, use your Vercel deployment URL.
3. Vercel will run `bunx prisma migrate deploy && bun run build` automatically on each deploy (`vercel.json` configures this).
4. After the first deploy, the database is migrated. Run the seed once if you need demo data:
   ```bash
   DATABASE_URL=<your-prod-url> bun run db:seed
   ```

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@demo.test` | `Demo1234!` |
| Member | `alice@demo.test` | `Demo1234!` |
| Member | `bob@demo.test` | `Demo1234!` |
