import { createSupabaseServerClient } from "@/lib/supabase/supabaseServer";
import { createSupabaseAdminClient } from "@/lib/supabase/supabaseAdmin";
import { getCurrentProfile } from "./profilesServer";

export async function insertNodeDraft(payload: {
  user_question: string;
  subcategory_name: string;
  title: string;
  definition: string;
  question: string;
  ai_answer: string;
}) {
  const supabase = await createSupabaseServerClient();
  const profile = await getCurrentProfile();
  console.log(profile);
  console.log(payload);
  const { error } = await supabase
    .from("nodesDraft")
    .insert({
      ...payload,
      status: "draft",
      profile_id: profile?.user_id || null,
    })
    .select()
    .single();

  return error;
}

export async function getNodeDrafts() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("nodesDraft")
    .select("*")
    .eq("status", "draft")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteNodeDraft(id: number) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("nodesDraft").delete().eq("id", id);

  if (error) throw error;
}

export async function publishNodeDraft({
  draftId,
  title,
  definition,
  question,
  ai_answer,
  subcategoryName,
  subcategoryId,
}: {
  draftId: number;
  title: string;
  definition: string;
  question: string;
  ai_answer: string;
  subcategoryName: string;
  subcategoryId: number;
}) {
  const supabase = await createSupabaseAdminClient();
  const { error: updateError } = await supabase
    .from("nodesDraft")
    .update({
      title,
      definition,
      question,
      ai_answer,
      subcategory_name: subcategoryName,
    })
    .eq("id", draftId);

  if (updateError) throw updateError;

  // 创建正式 node
  const { data: newNode, error: insertError } = await supabase
    .from("nodes")
    .insert({
      title,
      definition,
      question,
      detail: ai_answer,
      subcategory_id: subcategoryId,
      status: "published",
    })
    .select()
    .single();

  if (insertError) throw insertError;

  // 回写 draft
  const { error: finalError } = await supabase
    .from("nodesDraft")
    .update({
      node_id: newNode.id,
      status: "published",
    })
    .eq("id", draftId);

  if (finalError) throw finalError;

  return newNode;
}
