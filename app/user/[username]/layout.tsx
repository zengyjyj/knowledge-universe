import StarfieldBackground from "@/components/starfieldBackground";
import { getCurrentProfile } from "@/data/queries/profilesServer";
import { redirect } from "next/navigation";

export default async function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/user");
  }

  if (profile.username !== username) {
    console.log(
      "app/user/[username]/layout : profile.username !== params.username"
    );
    redirect(`/user/${profile.username}`);
  }

  console.log("app/user/[username]/layout ", profile);

  return (
    <div className="relative min-h-screen bg-[#050510] text-white overflow-hidden">
      <StarfieldBackground />
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
