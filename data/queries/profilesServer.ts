import { createSupabaseServerClient } from "@/lib/supabase/server";

import { Profile } from "../types/database";

export async function getCurrentProfile() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) return null;
  return data as Profile;
}
