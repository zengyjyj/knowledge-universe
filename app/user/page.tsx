import { getCurrentProfile } from "@/data/queries/profilesServer";
import { redirect } from "next/navigation";
import AuthModalClient from "./authModalClient";

export default async function UserPage() {
  let profile = null;

  try {
    profile = await getCurrentProfile();
    console.log("app/user/page try getCurrentProfile:", profile);
  } catch {
    profile = null;
  }

  if (profile) {
    console.log("app/user/page check profile:", profile);
    redirect(`/user/${profile.username}`);
  }

  //此file是Server Component 不能给 Client Component 传函数
  // ❌ return <AuthModal open={true} onClose={() => {}} />;
  console.log("app/user/page -> login/signup");
  return <AuthModalClient />;
}
