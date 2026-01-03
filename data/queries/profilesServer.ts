// data/queries/profilesServer.ts

import { cache } from "react";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
    return MEMO.profile;
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
    return profile;
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
// import { cache } from "react";
// import { createSupabaseServerClient } from "@/lib/supabase/server";

// /**
//  * 获取当前登录用户的 profile
//  * - 同一个请求内：只会真正调用 Supabase 一次
//  * - layout / page / 其他 server component 复用结果
//  */
// export const getCurrentProfile = cache(async () => {
//   const supabase = await createSupabaseServerClient();

//   const {
//     data: { user },
//     error: authError,
//   } = await supabase.auth.getUser();

//   if (authError || !user) {
//     return null;
//   }

//   const { data: profile, error: profileError } = await supabase
//     .from("profiles")
//     .select("*")
//     .eq("user_id", user.id)
//     .single();

//   if (profileError) {
//     return null;
//   }

//   return profile;
// });
