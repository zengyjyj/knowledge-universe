import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json({ error: "Missing" }, { status: 400 });

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({
              name,
              value,
              ...options,
              sameSite: "lax",
              secure: false,
              path: "/",
            });
          },
          remove(name: string, options: any) {
            cookieStore.set({
              name,
              value: "",
              ...options,
              sameSite: "lax",
              secure: false,
              path: "/",
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    if (data?.session) {
      const { error: setError } = await supabase.auth.setSession(data.session);
      if (setError)
        return NextResponse.json({ error: setError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, user: data?.user ?? null });
  } catch (err) {
    console.error("api/auth/login error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
