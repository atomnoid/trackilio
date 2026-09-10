import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** POST /api/members/invite — create a list collaborator invite link */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listId, role = "viewer" } = await request.json();
  if (!listId) return NextResponse.json({ error: "listId is required" }, { status: 400 });

  const validRoles = ["editor", "viewer"];
  if (!validRoles.includes(role)) return NextResponse.json({ error: "Role must be editor or viewer" }, { status: 400 });

  const { data: listData } = await (supabase as any)
    .from("wander_lists").select("owner_id").eq("id", listId).maybeSingle();

  if (!listData) return NextResponse.json({ error: "List not found" }, { status: 404 });
  if (listData.owner_id !== user.id) return NextResponse.json({ error: "Only the list owner can create invite links" }, { status: 403 });

  const { data: invite, error } = await (supabase as any)
    .from("list_invites")
    .insert({ list_id: listId, invited_by: user.id, role })
    .select("token")
    .single();

  if (error || !invite) return NextResponse.json({ error: "Failed to create invite link." }, { status: 500 });

  return NextResponse.json({
    token: invite.token,
    url: `${siteUrl}/l/invite/${invite.token}`,
  });
}