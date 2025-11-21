#!/usr/bin/env node
/**
 * Database Migration Status Checker
 * 
 * This script shows which migrations need to be run.
 * 
 * To actually run migrations, use:
 * 1. Supabase CLI: supabase db push
 * 2. Supabase Dashboard SQL Editor
 */

import { getMigrations, printMigrationInstructions } from "../lib/migrate"

async function main() {
  try {
    console.log("🚀 Bonocoin Database Migration Tool\n")
    
    const migrations = await getMigrations()
    
    if (migrations.length === 0) {
      console.log("⚠️  No migration files found in migrations/ directory")
      process.exit(0)
    }
    
    printMigrationInstructions(migrations)
    
    process.exit(0)
  } catch (error) {
    console.error("❌ Error:", error)
    process.exit(1)
  }
}

main()

