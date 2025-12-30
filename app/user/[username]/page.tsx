import { getCurrentProfile } from "@/data/queries/profilesServer";
import { redirect } from "next/navigation";

export default async function UserCenterPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const profile = await getCurrentProfile();
  console.log("app/user/[username]", profile);
  if (!profile) {
    console.log("app/user/[username] profile null should return to /user ");
    redirect("/user");
  }

  if (profile.username !== username) {
    redirect(`/user/${profile.username}`);
  }

  return <div>Welcome {profile.username}</div>;
}
