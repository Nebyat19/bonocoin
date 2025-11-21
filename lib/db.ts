import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function query<T>(text: string, values?: (string | number | boolean | null)[]): Promise<T[]> {
  try {
    const result = await sql(text, values)
    return result as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function queryOne<T>(text: string, values?: (string | number | boolean | null)[]): Promise<T | null> {
  const result = await query<T>(text, values)
  return result.length > 0 ? result[0] : null
}
