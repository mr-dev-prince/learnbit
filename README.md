<div align="center">

# learn<span>bit.</span>

**Personal learning, organized with intent.**

Learnbit is an open-source learning workspace that brings your study tasks, spaced revision, habits, daily schedule, learning roadmaps and system-design notes into one place, so the things you learn come back to you before you forget them.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io)
[![Supabase](https://img.shields.io/badge/Auth-Supabase-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Bun](https://img.shields.io/badge/Bun-1.3-000?logo=bun)](https://bun.sh)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#features) · [Quick start](#quick-start) · [Configuration](#configuration) · [API](#api-reference) · [Deployment](#deployment) · [Contributing](#contributing)

</div>

---

## Table of contents

- [Why Learnbit](#why-learnbit)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Database](#database)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [API reference](#api-reference)
- [Deployment](#deployment)
- [Security notes](#security-notes)
- [Contributing](#contributing)
- [License](#license)

## Why Learnbit

Most self-learners keep their progress in a pile of browser tabs, bookmarks, to-do apps and notebooks. Learnbit replaces that pile with one opinionated system:

1. **Capture** what you are learning as tasks, with resources attached.
2. **Revisit** completed topics on a spaced-repetition schedule.
3. **Sustain** the routine with habit streaks and a time-boxed day plan.
4. **Zoom out** with roadmaps and an architecture notebook for the bigger picture.

## Features

| Module             | What it does                                                                                                                                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dashboard**      | Task board with daily, weekly and monthly views, quick-add, pinning, due dates, attached resource links, and estimated vs. actual time tracking.                                                                  |
| **Revision queue** | Mark any task for revision and Learnbit schedules it for you. Each revision step records its interval, notes and status (`PENDING`, `COMPLETED`, `SKIPPED`), so you build a revision history per topic.           |
| **Habit tracker**  | Daily habits with a GitHub-style heatmap, current and best streaks, and an optional _skip weekends_ mode that keeps streaks alive across Saturdays and Sundays.                                                   |
| **Day planner**    | Set your wake and sleep times. Learnbit works out how many minutes you have, then lets you time-box activities against that budget and tick them off as you go.                                                   |
| **Roadmaps**       | Long-term learning plans split into ordered modules, each with its own status, plus an estimated time and resource list for the roadmap.                                                                          |
| **Architectures**  | A system-design notebook with a rich-text editor (Lexical), live Mermaid diagrams, ready-made templates (full-stack web app, microservices, RAG pipeline, OAuth/JWT flow, ERD), tags, categories, and a PIN lock. |
| **Completed**      | An archive of everything you have finished.                                                                                                                                                                       |
| **Settings**       | Profile and security settings.                                                                                                                                                                                    |

Across the whole app you also get:

- Email/password and **Google OAuth** sign-in through Supabase Auth
- **Light and dark themes**, saved per browser
- Cached, optimistic data fetching with TanStack Query, with toast feedback on mutations
- A collapsible sidebar and a quick-add modal (submit with <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd>)

## Tech stack

| Layer        | Technology                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Framework    | [Next.js 16](https://nextjs.org) (App Router, Route Handlers)                                                                         |
| UI           | [React 19](https://react.dev), [Tailwind CSS v4](https://tailwindcss.com), [lucide-react](https://lucide.dev)                         |
| Language     | TypeScript (strict mode)                                                                                                              |
| Server state | [TanStack Query v5](https://tanstack.com/query)                                                                                       |
| Client state | [Redux Toolkit](https://redux-toolkit.js.org) (UI and modal state)                                                                    |
| Database     | PostgreSQL via [Prisma 7](https://www.prisma.io) and the `@prisma/adapter-pg` driver adapter                                          |
| Auth         | [Supabase Auth](https://supabase.com/docs/guides/auth) with `@supabase/ssr` (cookie-based sessions)                                   |
| Editors      | [Lexical](https://lexical.dev), [react-markdown](https://github.com/remarkjs/react-markdown) + GFM, [Mermaid](https://mermaid.js.org) |
| Visuals      | [OGL](https://github.com/oframe/ogl) (WebGL hero background)                                                                          |
| Tooling      | [Bun](https://bun.sh), ESLint 9 (flat config), Prettier                                                                               |
| Hosting      | [Vercel](https://vercel.com); scheduled jobs on GitHub Actions                                                                        |

## Architecture

```text
┌──────────────────────────────────────────────────────────────────┐
│ Browser                                                          │
│  React client components ─► hooks/ (TanStack Query) ─► services/ │
└───────────────────────────────┬──────────────────────────────────┘
                                │ fetch /api/*  (Supabase session cookie)
┌───────────────────────────────▼──────────────────────────────────┐
│ Next.js Route Handlers  (src/app/api/**/route.ts)                │
│  apiHandler() ─► getAuthenticatedUser() ─► lib/<domain>.ts       │
│  consistent { success, data, message } / { success, error }     │
└───────────────────────────────┬──────────────────────────────────┘
                                │ Prisma Client (pg driver adapter)
┌───────────────────────────────▼──────────────────────────────────┐
│ PostgreSQL                                                       │
└──────────────────────────────────────────────────────────────────┘
```

- **`services/`** is the typed HTTP client for each domain. It calls `/api/*`.
- **`hooks/`** wraps the services in TanStack Query hooks (`useTasks`, `useHabits` and so on). Cache keys are centralised in `lib/queryKeys.ts`.
- **Route handlers** are thin. Each one authenticates the user, validates input and hands off to a domain module in `lib/` (`lib/tasks.ts`, `lib/habits.ts` and so on), which owns the Prisma queries.
- **Errors** are typed (`lib/api/errors.ts`) and serialised in one place (`lib/api/handler.ts`), so every endpoint returns the same response shape.
- **Every row is scoped by `userId`**, which comes from the Supabase session on the server and is never taken from the request body.

## Quick start

### Prerequisites

- [Bun](https://bun.sh) **1.3+** (the repo pins `bun@1.3.14`)
- A **PostgreSQL** database: local, Docker, or hosted (Supabase, Neon, Aiven and others)
- A **Supabase** project for authentication (the free tier is enough)

### 1. Clone and install

```bash
git clone https://github.com/mr-dev-prince/learnbit.git
cd learnbit
bun install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in the values described in [Configuration](#configuration). Both Next.js and the Prisma CLI read `.env`.

### 3. Set up the database

```bash
bunx prisma migrate dev   # apply migrations to your database
bunx prisma generate      # generate the Prisma Client
```

### 4. Configure Supabase Auth

In your Supabase dashboard:

1. Under **Authentication → URL Configuration**, set **Site URL** to `http://localhost:3000` and add `http://localhost:3000/auth/callback` to **Redirect URLs**.
2. _(Optional)_ Under **Authentication → Providers → Google**, enable Google and add your Google OAuth client ID and secret.

### 5. Run the app

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and you'll land on the dashboard.

To confirm the database connection, open [http://localhost:3000/api/health/db](http://localhost:3000/api/health/db).

## Configuration

| Variable                               |  Required  | Description                                                                                                                                    |
| -------------------------------------- | :--------: | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             |     ✅     | Your Supabase project URL (`https://<ref>.supabase.co`).                                                                                       |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |     ✅     | Your Supabase publishable (anon) key. It is safe to expose in the browser.                                                                     |
| `DATABASE_URL`                         |     ✅     | PostgreSQL connection string, for example `postgresql://user:password@host:5432/learnbit`.                                                     |
| `CRON_SECRET`                          | Production | Shared secret that protects `/api/cron/*`. Callers send it as `Authorization: Bearer <CRON_SECRET>`. Generate one with `openssl rand -hex 32`. |

> [!IMPORTANT]
> Never commit `.env`. It is already in `.gitignore`.

## Database

The Prisma schema is split by domain in [`prisma/schema/`](prisma/schema):

| File                  | Models                               |
| --------------------- | ------------------------------------ |
| `task.prisma`         | `Task`, `TaskResource`               |
| `revise.prisma`       | `Revision` (+ `RevisionStatus` enum) |
| `habit.prisma`        | `Habit`, `HabitLog`                  |
| `day-planner.prisma`  | `DayPlanner`, `Activity`             |
| `roadmap.prisma`      | `Roadmap`, `RoadmapModule`           |
| `architecture.prisma` | `Architecture`                       |
| `enums.prisma`        | `TaskStatus`                         |

Common commands:

```bash
bunx prisma migrate dev --name <change>   # create and apply a migration (development)
bunx prisma migrate deploy                # apply pending migrations (production)
bunx prisma studio                        # browse your data
bunx prisma validate                      # validate the schema
```

[`PRISMA_COMMANDS.md`](PRISMA_COMMANDS.md) has the full migration workflow.

## Available scripts

| Command              | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `bun dev`            | Start the development server on `localhost:3000`.    |
| `bun run build`      | Generate the Prisma Client and build for production. |
| `bun start`          | Start the production server.                         |
| `bun run lint`       | Run ESLint.                                          |
| `bun run lint:fix`   | Run ESLint and fix what it can automatically.        |
| `bun run format`     | Format the codebase with Prettier.                   |
| `bun x tsc --noEmit` | Type-check the project.                              |

## Project structure

```text
learnbit/
├── prisma/
│   ├── schema/              # Prisma schema, split by domain
│   └── migrations/          # SQL migrations
├── public/                  # Static assets (fonts, media)
├── src/
│   ├── app/
│   │   ├── (auth)/          # /login, /signup
│   │   ├── (dashboard)/     # Signed-in app: dashboard, habits, roadmaps, ...
│   │   ├── api/             # REST route handlers
│   │   ├── auth/callback/   # Supabase OAuth code exchange
│   │   ├── layout.tsx       # Root layout, fonts, providers
│   │   └── page.tsx         # Landing page
│   ├── components/          # Feature components (tasks/, habits/, roadmaps/, ...) and ui/
│   ├── hooks/               # TanStack Query hooks per domain
│   ├── lib/                 # Server-side domain logic, Prisma client, API helpers
│   ├── services/            # Typed client-side API wrappers
│   ├── store/               # Redux Toolkit store and slices
│   ├── types/               # Shared TypeScript types
│   └── utils/               # Supabase clients, date and habit utilities
├── ai-context/              # Architecture and convention docs for contributors and AI agents
├── prisma.config.ts
└── CONTRIBUTION.md
```

## API reference

Every endpoint lives under `/api` and requires an authenticated Supabase session, except the health endpoints. Responses use one envelope:

```jsonc
// success
{ "success": true, "data": { /* ... */ }, "message": "..." }

// error
{ "success": false, "error": { "code": "UNAUTHORIZED", "message": "..." } }
```

| Resource      | Endpoint                              | Methods                        |
| ------------- | ------------------------------------- | ------------------------------ |
| Tasks         | `/api/tasks`                          | `GET` `POST`                   |
|               | `/api/tasks/:id`                      | `GET` `PUT` `DELETE`           |
|               | `/api/tasks/:id/revisions`            | `GET` `POST` `DELETE`          |
| Revisions     | `/api/revisions`                      | `GET`                          |
|               | `/api/revisions/:id`                  | `PATCH`                        |
| Habits        | `/api/habits`                         | `GET` `POST`                   |
|               | `/api/habits/:id`                     | `GET` `PUT` `DELETE`           |
|               | `/api/habits/:id/log`                 | `POST` `DELETE`                |
| Day planner   | `/api/day-planner`                    | `GET` `POST`                   |
|               | `/api/day-planner/:id`                | `PUT`                          |
|               | `/api/activities`                     | `POST`                         |
|               | `/api/activities/:id`                 | `PUT` `DELETE`                 |
| Roadmaps      | `/api/roadmaps`                       | `GET` `POST`                   |
|               | `/api/roadmaps/:id`                   | `GET` `PUT` `DELETE`           |
|               | `/api/roadmaps/:id/modules`           | `GET` `POST`                   |
|               | `/api/roadmaps/:id/modules/:moduleId` | `PUT` `DELETE`                 |
| Architectures | `/api/architectures`                  | `GET` `POST`                   |
|               | `/api/architectures/:id`              | `GET` `PUT` `DELETE`           |
| Health        | `/api/health/db`                      | `GET` (public)                 |
|               | `/api/cron/db-health`                 | `GET` (requires `CRON_SECRET`) |

## Deployment

Learnbit is built for **Vercel**, but runs on any platform that supports Next.js 16 and Node.js.

1. Push your fork to GitHub and import it into Vercel.
2. Add the environment variables from [Configuration](#configuration) under **Project → Settings → Environment Variables**.
3. Apply migrations to your production database:
   ```bash
   DATABASE_URL="<production-url>" bunx prisma migrate deploy
   ```
4. Deploy. The build command (`prisma generate && next build`) is already set in `package.json`.
5. In Supabase, add your production domain as the **Site URL** and add `https://<your-domain>/auth/callback` to **Redirect URLs**.

### Scheduled jobs

[`.github/workflows/db-health.yml`](.github/workflows/db-health.yml) calls `/api/cron/db-health` every three hours (`0 */3 * * *`, UTC). It checks both databases and logs their latency: a `SELECT 1` on the Aiven Postgres, and a read of the `keep_alive` table in Supabase. The run fails if either check fails. The Supabase read also counts as database activity, which stops the free-plan project from pausing after 7 idle days. Vercel Hobby only allows daily cron jobs, so the schedule runs on GitHub Actions instead.

To enable it, first create the `keep_alive` table by running [`supabase/keep-alive.sql`](supabase/keep-alive.sql) once in the Supabase SQL editor. Then set `CRON_SECRET` in the Vercel environment variables (the endpoint rejects every request without it). Then add two repository secrets under **Settings → Secrets and variables → Actions**: `CRON_SECRET` (the same value) and `APP_URL` (your production URL, for example `https://learnbit.vercel.app`). You can trigger a run manually from the **Actions** tab.

## Security notes

- **Authentication** uses Supabase's cookie-based SSR sessions. The server checks the user with `supabase.auth.getUser()` on every API request.
- **Data isolation**: every query is scoped to the authenticated `userId` on the server.
- **Architecture PIN lock**: the PIN is stored in the browser (`localStorage`) and the unlocked state lasts for the browser session. It keeps casual onlookers out on a shared screen, but **it is not encryption** and does not protect data on the server. The default PIN is `1234`, so change it from the Architectures page.
- **Maintenance endpoint**: `/api/backfill` recalculates best streaks for all habits. Restrict or remove it before you expose a multi-user deployment.
- Found a vulnerability? Please report it privately to the maintainer instead of opening a public issue.

## Contributing

Contributions are welcome, from bug reports to new modules.

1. Read [`CONTRIBUTION.md`](CONTRIBUTION.md) and the docs in [`ai-context/`](ai-context).
2. Create a branch: `git checkout -b feature/your-feature` or `fix/your-bug`.
3. Follow the project conventions: strict TypeScript, functional components, Tailwind for styling, and the `@/` import alias.
4. Before you push, run:
   ```bash
   bun run format
   bun run lint
   bun x tsc --noEmit
   ```
5. Write commit messages in the [Conventional Commits](https://www.conventionalcommits.org) format (`feat:`, `fix:`, `docs:` and so on) and open a pull request against `main`.

## License

Learnbit is released under the [MIT License](LICENSE). © 2026 Prince Chaurasia.

<div align="center">
<sub>Built for people who want to keep learning.</sub>
</div>
