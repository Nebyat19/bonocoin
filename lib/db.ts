import { Pool } from "@neondatabase/serverless"
import type { QueryResultRow } from "@neondatabase/serverless"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

type QueryValue = string | number | boolean | null

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, values?: QueryValue[]): Promise<T[]> {
  const client = await pool.connect()
  try {
    const result = await client.query<T>(text, values)
    return result.rows
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  } finally {
    client.release()
  }
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(text: string, values?: QueryValue[]): Promise<T | null> {
  const rows = await query<T>(text, values)
  return rows.length > 0 ? rows[0] : null
}
