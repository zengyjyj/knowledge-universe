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
    console.log("app/user/[username]/layout : profile null");
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

//   return (
//     <div className="relative min-h-screen bg-[#050510] text-white overflow-hidden">
//       {/* 星空背景 */}
//       <StarfieldBackground />

//       {/* 内容层 */}
//       <div className="relative z-10 flex min-h-screen">
//         {/* Sidebar  */}
//         <aside className="flex-[1] flex shrink-0 p-6 bg-white/5 backdrop-blur-xl border-r border-white/10">
//           <nav className="space-y-2 text-sm">
//             <SidebarItem href={base} label="概览" />
//             <SidebarItem href={`${base}/favorites`} label="知识收藏" />
//             <SidebarItem href={`${base}/goal`} label="目标计划" />
//             <SidebarItem href={`${base}/account`} label="账户管理" />
//           </nav>
//         </aside>

//         {/* 主内容区 */}
//         <main className="flex-[5] flex justify-center p-10">
//           <div className="w-full max-w-5xl">{children}</div>
//         </main>
//       </div>
//     </div>
//   );
// }

// function SidebarItem({
//   href,
//   label,
//   active = false,
// }: {
//   href: string;
//   label: string;
//   active?: boolean;
// }) {
//   return (
//     <Link
//       href={href}
//       className={`
//         relative flex items-center px-4 py-3 rounded-2xl transition
//         ${
//           active
//             ? `
//               bg-white/20 text-white
//               before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2
//               before:h-6 before:w-1 before:rounded-full
//               before:bg-gradient-to-b before:from-pink-400 before:to-purple-400
//             `
//             : "text-white/60 hover:text-white hover:bg-white/10"
//         }
//       `}
//     >
//       {label}
//     </Link>
//   );
// }
