import { getSupabaseServerClient } from "./supabase/server"
import { readFileSync, readdirSync, existsSync } from "fs"
import { join } from "path"

interface MigrationInfo {
  name: string
  path: string
  applied: boolean
}

/**
 * Get list of migration files and their status
 */
export async function getMigrations(): Promise<MigrationInfo[]> {
  const migrationsDir = join(process.cwd(), "migrations")
  
  if (!existsSync(migrationsDir)) {
    return []
  }

  // Get all migration files
  const allFiles = readdirSync(migrationsDir)
  const migrationFiles = allFiles
    .filter((file) => file.endsWith(".sql"))
    .sort() // Ensure migrations run in order

  const migrations: MigrationInfo[] = migrationFiles.map((file) => ({
    name: file.replace(".sql", ""),
    path: join(migrationsDir, file),
    applied: false,
  }))

  // Check which migrations have been applied
  const supabase = getSupabaseServerClient()
  if (supabase) {
    try {
      const { data: appliedMigrations } = await supabase
        .from("schema_migrations")
        .select("migration_name")

      const appliedNames = new Set(
        (appliedMigrations as Array<{ migration_name: string }> | null)?.map(
          (m) => m.migration_name
        ) || []
      )

      migrations.forEach((m) => {
        m.applied = appliedNames.has(m.name)
      })
    } catch (error) {
      // Table doesn't exist yet, all migrations are pending
      console.log("Migration tracking table doesn't exist yet")
    }
  }

  return migrations
}

/**
 * Get migration SQL content
 */
export function getMigrationSQL(migrationPath: string): string {
  return readFileSync(migrationPath, "utf-8")
}

/**
 * Print migration instructions
 */
export function printMigrationInstructions(migrations: MigrationInfo[]) {
  const pending = migrations.filter((m) => !m.applied)
  const applied = migrations.filter((m) => m.applied)

  console.log("\n📊 Migration Status:\n")
  console.log(`✅ Applied: ${applied.length}`)
  console.log(`⏳ Pending: ${pending.length}\n`)

  if (pending.length > 0) {
    console.log("📋 Pending Migrations:")
    pending.forEach((m, i) => {
      console.log(`   ${i + 1}. ${m.name}`)
    })
    console.log("\n🚀 To apply migrations, use one of these methods:\n")
    console.log("1. Supabase CLI (Recommended):")
    console.log("   npm install -g supabase")
    console.log("   supabase link --project-ref YOUR_PROJECT_REF")
    console.log("   supabase db push\n")
    console.log("2. Supabase Dashboard:")
    console.log("   - Go to SQL Editor in your Supabase dashboard")
    console.log("   - Copy and run each migration file in order")
    pending.forEach((m) => {
      console.log(`     - ${m.name}`)
    })
    console.log()
  } else {
    console.log("✅ All migrations are up to date!\n")
  }
}
