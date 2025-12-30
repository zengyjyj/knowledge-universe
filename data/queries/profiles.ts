import { supabase } from "@/lib/supabase";
import { AuthErrorCode } from "../authErrors";
import { Profile } from "../types/database";

export async function getCurrentProfile() {
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

export async function checkUsernameExists(username: string): Promise<boolean> {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  return !!data;
}

export async function signUp({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  // check email existence
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    console.error(error);
    if (error.message === "User already registered") {
      throw new Error(AuthErrorCode.EMAIL_ALREADY_EXISTS);
    }

    throw new Error(AuthErrorCode.SIGNUP_FAILED);
  }

  return;
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new Error(AuthErrorCode.INVALID_CREDENTIALS);
  }

  return data.user;
}
