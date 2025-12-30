"use client";

// app/user/page.tsx
import { getCurrentProfile } from "@/data/queries/profilesServer";
import { redirect } from "next/navigation";
import AuthModal from "@/components/auth/AuthModal";

export default async function UserPage() {
  const profile = await getCurrentProfile();

  if (profile) {
    console.log("app/user/page check profile:", profile);
    redirect(`/user/${profile.username}`);
  }
  console.log("app/user/page -> login/signup");
  return <AuthModal open={true} onClose={() => {}} />;
}
