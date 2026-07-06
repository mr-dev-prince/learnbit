# Prisma Migration Cheat Sheet

## Development Workflow

1.  Modify your Prisma schema (`prisma/schema`).
2.  Create and apply a migration.
3.  Test the application.
4.  Review the generated SQL.
5.  Commit both the schema changes and the migration.

---

## Common Commands

### Create and apply a migration

```bash
npx prisma migrate dev --name <migration-name>
```

Example:

```bash
npx prisma migrate dev --name add-revision-model
```

### Regenerate the Prisma Client

```bash
npx prisma generate
```

### Open Prisma Studio

```bash
npx prisma studio
```

### Check migration status

```bash
npx prisma migrate status
```

### Deploy migrations (Production)

```bash
npx prisma migrate deploy
```

### Reset the development database

> **Warning:** Deletes all data.

```bash
npx prisma migrate reset
```

### Validate the Prisma schema

```bash
npx prisma validate
```

### Format the Prisma schema

```bash
npx prisma format
```

---

## Recommended Workflow

```text
Edit Prisma Schema
        ↓
npx prisma migrate dev --name <change>
        ↓
Test the application
        ↓
Review migration.sql
        ↓
Commit schema + migration
        ↓
Push to Git
        ↓
Production:
npx prisma migrate deploy
```

---

## Things to Avoid

- Do **not** use `npx prisma db push` once you've adopted Prisma
  Migrate.
- Do **not** edit old migration files after they've been committed.
- Do **not** delete migration folders.
- Do **not** manually modify the production database outside Prisma.

---

## When to Use Each Command

---

Command Purpose

---

`prisma migrate dev` Create and apply a new migration
during development

`prisma migrate deploy` Apply existing migrations in
production

`prisma generate` Regenerate the Prisma Client

`prisma studio` Browse and edit database records

`prisma migrate status` Check migration state

`prisma migrate reset` Reset the development database

`prisma validate` Validate the Prisma schema

`prisma format` Format the Prisma schema
-----------------------------------------------------------------------
