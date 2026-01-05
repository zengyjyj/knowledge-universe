// data/queries/profilesServer.ts

import { cache } from "react";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Profile } from "../types/database";

/**
 * Module-level memo to avoid repeated Supabase calls in dev/HMR loops.
 * Increased TTL to 10s to absorb bursts.
 */
const MEMO_TTL_MS = 10000; // 10s
let MEMO = {
  profile: null as any | null,
  authCookieValue: null as string | null,
  expiresAt: 0,
};

export const getCurrentProfile = cache(async function getCurrentProfile() {
  const ts = new Date().toISOString();
  const cookieStore = await cookies();

  const authCookie =
    cookieStore.getAll().find((c) => /^sb-.*-auth-token$/.test(c.name))
      ?.value ?? null;

  // Serve from memo if unchanged and still fresh
  if (MEMO.authCookieValue === authCookie && Date.now() < MEMO.expiresAt) {
    // minimal log for visibility only
    console.debug(`[${ts}] getCurrentProfile: returning memoized profile`);
    return MEMO.profile as Profile;
  }

  const supabase = await createSupabaseServerClient();

  try {
    const userRes = await supabase.auth.getUser();
    const user = userRes.data?.user;
    if (!user || userRes.error) {
      MEMO = {
        profile: null,
        authCookieValue: authCookie,
        expiresAt: Date.now() + MEMO_TTL_MS,
      };
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      MEMO = {
        profile: null,
        authCookieValue: authCookie,
        expiresAt: Date.now() + MEMO_TTL_MS,
      };
      console.warn(
        `[${ts}] getCurrentProfile profile fetch error:`,
        profileError
      );
      return null;
    }

    MEMO = {
      profile,
      authCookieValue: authCookie,
      expiresAt: Date.now() + MEMO_TTL_MS,
    };
    console.debug(
      `[${ts}] getCurrentProfile: fetched profile and memoized (ttl ${MEMO_TTL_MS}ms)`
    );
    return profile as Profile;
  } catch (err) {
    MEMO = {
      profile: null,
      authCookieValue: authCookie,
      expiresAt: Date.now() + MEMO_TTL_MS,
    };
    console.error(`[${ts}] getCurrentProfile unexpected error:`, err);
    return null;
  }
});

export async function updateUsernameQuery(newUsername: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("未登录");
  }

  // 1. 检查是否已存在
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", newUsername)
    .maybeSingle();

  if (existing) {
    throw new Error("用户名已被占用");
  }

  // 2. 更新 profiles
  const { error } = await supabase
    .from("profiles")
    .update({ username: newUsername })
    .eq("user_id", user.id);

  if (error) {
    throw new Error("更新失败");
  }

  return newUsername;
}
