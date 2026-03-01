import { createSupabaseServerClient } from "@/lib/supabase/supabaseServer";
import { getCurrentProfile } from "./profilesServer";

export async function insertNodeDraft(payload: {
  user_question: string;
  subcategery_name: string;
  title: string;
  definition: string;
  question: string;
  ai_answer: string;
}) {
  const supabase = await createSupabaseServerClient();
  const profile = await getCurrentProfile();

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
