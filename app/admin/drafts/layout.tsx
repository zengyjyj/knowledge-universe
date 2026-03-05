import { getCurrentProfile } from "@/data/queries/profilesServer";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  console.log("app/admin/drafts/layout", profile);

  if (!profile || profile.role !== "admin") {
    redirect("/user");
  }
  return <>{children}</>;
}
