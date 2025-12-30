import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/data/queries/profiles";

export default async function UserCenterPage({
  params,
}: {
  params: { username: string };
}) {
  //TODO: error 404
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/app/user");
  }

  if (profile.username !== params.username) {
    redirect(`/app/user/${profile.username}`);
  }

  return (
    <div>
      <h1>Welcome {profile.username}</h1>
    </div>
  );
}
