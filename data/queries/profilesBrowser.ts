import { supabase } from "@/lib/supabase/browser";
import { AuthErrorCode } from "../authErrors";

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

  return data;
}

export async function logout() {
  await supabase.auth.signOut();
}
