import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Profile } from "../types/database";
import { unstable_noStore as noStore } from "next/cache";

export async function getCurrentProfile(): Promise<Profile | null> {
  noStore();

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    return null;
  }

  return profile as Profile;
}

export async function updateUsernameQuery(newUsername: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("未登录");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username: newUsername })
    .eq("user_id", user.id);

  if (error) {
    throw new Error("更新失败");
  }

  return newUsername;
}

export async function logoutQuery() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}
