import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { action, note } = await req.json(); // action: "approve" | "reject"

  const { data: draft, error: readErr } = await supabaseAdmin
    .from("draft_nodes")
    .select("id, ai_json, status")
    .eq("id", params.id)
    .single();

  if (readErr)
    return Response.json({ error: readErr.message }, { status: 500 });
  if (!draft) return Response.json({ error: "not found" }, { status: 404 });

  if (action === "reject") {
    const { error } = await supabaseAdmin
      .from("draft_nodes")
      .update({
        status: "rejected",
        reviewer_note: note ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ ok: true });
  }

  if (action === "approve") {
    const ai = draft.ai_json as any;

    // 先最小化：直接插 nodes，不处理 cloud 映射（后面再补）
    const { error: insertErr } = await supabaseAdmin.from("nodes").insert({
      question: ai.question,
      definition: ai.definition,
      keywords: ai.keywords ?? [],
    });

    if (insertErr)
      return Response.json({ error: insertErr.message }, { status: 500 });

    const { error: updErr } = await supabaseAdmin
      .from("draft_nodes")
      .update({
        status: "approved",
        reviewer_note: note ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    if (updErr)
      return Response.json({ error: updErr.message }, { status: 500 });

    return Response.json({ ok: true });
  }

  return Response.json({ error: "invalid action" }, { status: 400 });
}
