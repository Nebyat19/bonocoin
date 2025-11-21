import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const creatorIdParam = req.nextUrl.searchParams.get("creator_id")
    if (!creatorIdParam) {
      return NextResponse.json({ error: "Creator ID is required" }, { status: 400 })
    }

    const creatorId = Number.parseInt(creatorIdParam, 10)
    if (isNaN(creatorId)) {
      return NextResponse.json({ error: "Invalid creator ID" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { data: supporters, error } = await supabase
      .from("supporters")
      .select(
        `
        *,
        user:users!supporters_user_id_fkey(id, username, first_name, last_name)
      `
      )
      .eq("creator_id", creatorId)
      .order("total_sent", { ascending: false })

    if (error) {
      throw error
    }

    const formatted = (supporters || []).map((s: any) => ({
      id: String(s.id),
      supporter_name: s.supporter_name || (s.user as any)?.first_name || (s.user as any)?.username || "Anonymous",
      total_sent: Number(s.total_sent),
      first_supported_at: s.first_supported_at,
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error("Error fetching supporters:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch supporters" },
      { status: 500 }
    )
  }
}

