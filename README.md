# UNAU — Makerere University Chapter website

Next.js 14 (App Router) + Prisma + PostgreSQL, monolithic architecture:
`services/` (Prisma logic) → `actions/` (Server Actions, the "API" layer) → `components/` & `app/` (UI).

## What's built

- Public homepage with admin-editable highlight cards and hero photo
- Student signup with name/email/programme/etc. and an SDG picker capped at 3–5 goals
- Projects listing + a detail page per project (MUN is seeded) with an **admin-defined, per-project
  registration form** (text/email/textarea/dropdown fields)
- Two seeded admin accounts, JWT session cookie, `/admin/*` routes protected by middleware
- Admin dashboard: member count, total registrations, most-picked SDG, full member table, project table
- Admin → Manage Homepage: edit the welcome message, add/delete highlight cards (with image upload),
  add/delete footer contact links
- Admin → Manage Projects: create a project with its own registration form (add/remove fields, mark
  required, set dropdown options), edit a project's name/description/status/banner, delete a project
- Image uploads go to Vercel Blob storage

**Known limitations (good next steps, not required to launch):**
- Homepage cards and footer links can be deleted/re-added but not edited in place yet
- A project's registration *fields* can't be edited after creation — delete and recreate the project
  if the fields need to change
- No self-service password reset for admins (reseed or update the DB row directly for now)

## 1. Local setup

```bash
npm install
cp .env.example .env      # then fill in DATABASE_URL and SESSION_SECRET at minimum
npm run db:push           # creates tables from prisma/schema.prisma
npm run db:seed           # creates your two admin accounts + starter content
npm run dev
```

Visit `http://localhost:3000`. Admin login is at `/admin/login`, using the emails/passwords you set in
`.env` (`ADMIN1_EMAIL` / `ADMIN1_PASSWORD`, `ADMIN2_EMAIL` / `ADMIN2_PASSWORD`).

`SESSION_SECRET` can be any long random string — generate one with:
```bash
openssl rand -base64 32
```

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial UNAU Mak Chapter site"
gh repo create unau-mak-chapter --private --source=. --push
# (or create the repo on github.com and follow its "push an existing repo" instructions)
```

## 3. Database — pick one (all have free tiers)

- **Vercel Postgres**: in your Vercel project, go to Storage → Create Database → Postgres. It fills in
  `DATABASE_URL` for you automatically.
- **Neon** (https://neon.tech) or **Supabase** (https://supabase.com): create a project, copy the
  connection string into `DATABASE_URL`. Use the "pooled" connection string if offered — Next.js on
  Vercel runs serverless, and pooled connections handle that better.

## 4. Deploy on Vercel

1. Go to https://vercel.com/new and import the GitHub repo you just pushed.
2. Before the first deploy, open **Environment Variables** and add:
   - `DATABASE_URL` — from step 3
   - `SESSION_SECRET` — the random string from step 1
   - `ADMIN1_EMAIL`, `ADMIN1_PASSWORD`, `ADMIN1_NAME`
   - `ADMIN2_EMAIL`, `ADMIN2_PASSWORD`, `ADMIN2_NAME`
3. Click **Deploy**. Vercel runs `npm install` → `postinstall` (Prisma generate) → `npm run build`.
4. **Add Vercel Blob storage** (for image uploads): in the deployed project, go to
   Storage → Create Database → Blob → Connect to Project. This automatically adds the
   `BLOB_READ_WRITE_TOKEN` environment variable — no manual copying needed.
5. **Create the database tables.** Vercel doesn't run `db:push`/`db:seed` automatically. From your
   local machine, with `DATABASE_URL` in your local `.env` pointed at the *production* database:
   ```bash
   npm run db:push
   npm run db:seed
   ```
   (Alternatively, run these from the Vercel dashboard's project → Settings → the "Deploy Hooks" /
   terminal features, or via `vercel env pull` + the commands above.)
6. Redeploy (or it will already be live) — visit your `*.vercel.app` URL.

## 5. After deploying

- Log in at `/admin/login` with the admin accounts you seeded, and change the passwords by re-running
  the seed with new `ADMIN1_PASSWORD` / `ADMIN2_PASSWORD` values (it upserts by email, so it updates the
  existing row) — or update the `Admin` table directly.
- Add your other chapter projects from Admin → Manage Projects.
- Update the footer welcome message and contact links from Admin → Manage Homepage.

## Project structure

```
prisma/schema.prisma       Database models
prisma/seed.ts              Seeds admins + starter content + MUN project
src/lib/                    Prisma client, admin session (JWT), SDG list
src/services/                Prisma queries — the only files that talk to the DB
src/actions/                 Server Actions — call services, used directly by forms
src/components/              Client components (forms, header/footer, toast)
src/app/                     Pages and the one API route (image upload)
src/middleware.ts            Redirects logged-out visitors away from /admin/*
```
