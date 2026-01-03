import { getCurrentProfile } from "@/data/queries/profilesServer";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  console.log("app/user/layout", profile);

  return <>{children}</>;
}
