# Database Migrations

This directory contains database migration files for Bonocoin.

## Migration Files

Migration files are named with a number prefix and description:
- `001_initial_schema.sql` - Initial database schema
- `002_add_feature.sql` - Example: Adding a new feature
- etc.

## Running Migrations

### Option 1: Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   (Find your project ref in Supabase dashboard URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`)

3. Push migrations:
   ```bash
   supabase db push
   ```

### Option 2: Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of each migration file (in order: 001, 002, etc.)
5. Paste and click **Run**

### Option 3: Programmatic (via API)

Run migrations programmatically:
```bash
npm run migrate
```

This will show you which migrations need to be run and provide instructions.

## Creating New Migrations

1. Create a new file: `migrations/XXX_description.sql`
   - Replace `XXX` with the next number (002, 003, etc.)
   - Replace `description` with a brief description

2. Write your SQL migration:
   ```sql
   -- Migration: XXX_description
   -- Description: What this migration does
   -- Created: YYYY-MM-DD

   -- Your SQL here
   ALTER TABLE users ADD COLUMN new_field VARCHAR(255);
   ```

3. Run the migration using one of the methods above

## Migration Tracking

Migrations are tracked in the `schema_migrations` table, which is created automatically by the first migration. This prevents running the same migration twice.

## Switching Database Platforms

To switch to a different database platform (e.g., PostgreSQL, MySQL, etc.):

1. The migration files use standard SQL that should work with most PostgreSQL-compatible databases
2. For other databases, you may need to adjust:
   - Data types (e.g., `BIGSERIAL` → `BIGINT AUTO_INCREMENT` for MySQL)
   - JSON handling (e.g., `JSONB` → `JSON` for MySQL)
   - Syntax differences

3. Update the database connection in:
   - `lib/supabase/server.ts` (or create a new adapter)
   - Environment variables

## Best Practices

- Always use `IF NOT EXISTS` for tables and indexes
- Test migrations on a development database first
- Never modify existing migration files (create new ones instead)
- Keep migrations small and focused
- Document what each migration does

