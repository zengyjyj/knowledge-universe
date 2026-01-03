export const dynamic = "force-dynamic";
import { getCurrentProfile } from "@/data/queries/profilesServer";
import Link from "next/link";
import { redirect } from "next/navigation";
import Overview from "./Overview";
import Favorites from "./Favorites";
import Goal from "./Goal";
import Account from "./Account";
import { LayoutDashboard, Bookmark, Target, Settings } from "lucide-react";

/**
 * 左侧是竖着的目录页：
 * 个人信息：
 *    开头有个居中的“欢迎回来！“，
 *    标题下面是卡片（包含头像icon，username，mail，等级）
 *    卡片下面也有几个小卡片：学习天数，已完成目标，已收藏内容和已学习时长
 * 知识收藏：TODO
 * 目标计划：TODO
 * 账户管理：TODO（退出登陆）
 *    个人资料的编辑：更换username，更换邮箱，更换密码，退出账户，删除账户
 *
 */

type Mode = "overview" | "favorites" | "goal" | "account";
const MODES: Mode[] = ["overview", "favorites", "goal", "account"];

export default async function UserCenterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const profile = await getCurrentProfile();
  if (!profile) {
    console.log("app/user/[username] profile null should return to /user ");
    redirect("/user");
  }
  console.log("app/user/[username]");

  const sp = await searchParams;
  const raw = sp.mode;
  const modeStr = Array.isArray(raw) ? raw[0] : raw;
  const mode: Mode = MODES.includes(modeStr as Mode)
    ? (modeStr as Mode)
    : "overview";
  const base = `/user/${profile.username}`;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex-1 shrink-0 p-6 bg-white/5 backdrop-blur-xl border-r border-white/10">
        <nav className="space-y-2 text-sm">
          <SidebarItem
            href={`${base}?mode=overview`}
            label="概览"
            icon={<LayoutDashboard />}
            active={mode === "overview"}
          />
          <SidebarItem
            href={`${base}?mode=favorites`}
            label="知识收藏"
            icon={<Bookmark />}
            active={mode === "favorites"}
          />
          <SidebarItem
            href={`${base}?mode=goal`}
            label="目标计划"
            icon={<Target />}
            active={mode === "goal"}
          />
          <SidebarItem
            href={`${base}?mode=account`}
            label="账户管理"
            icon={<Settings />}
            active={mode === "account"}
          />
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-[5] p-10 flex justify-center">
        <div className="w-full max-w-5xl">
          {mode === "overview" && <Overview profile={profile} />}
          {mode === "favorites" && <Favorites />}
          {mode === "goal" && <Goal />}
          {mode === "account" && <Account />}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        relative flex items-center px-4 py-3 rounded-2xl transition
        ${
          active
            ? `
              bg-white/20 text-white
              before:absolute before:left-0 before:top-1/2
              before:-translate-y-1/2
              before:h-6 before:w-1 before:rounded-full
              before:bg-gradient-to-b
              before:from-pink-400 before:to-purple-400
            `
            : "text-white/60 hover:text-white hover:bg-white/10"
        }
      `}
    >
      <span
        className={`
          mr-3 flex items-center justify-center transition
          ${active ? "text-purple-400" : "text-white/50 group-hover:text-white"}
        `}
        style={{ width: 20, height: 20 }}
      >
        {icon}
      </span>

      <span className="font-medium">{label}</span>
    </Link>
  );
}
