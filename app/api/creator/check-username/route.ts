import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const handle = req.nextUrl.searchParams.get("handle")
    if (!handle) {
      return NextResponse.json({ error: "Handle is required" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    // Check if handle is already taken
    const { data, error } = await supabase
      .from("creators")
      .select("id")
      .eq("handle", handle.toLowerCase())
      .maybeSingle()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    return NextResponse.json({ available: !data })
  } catch (error) {
    console.error("Error checking username:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to check username" },
      { status: 500 }
    )
  }
}

