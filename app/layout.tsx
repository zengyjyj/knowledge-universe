/* 顶部导航 */

import Link from "next/link";
import "./globals.css";
import { getCurrentProfile } from "@/data/queries/profilesServer";
import { MessageCircleQuestion, CircleUser } from "lucide-react";

export const metadata = {
  title: "序光",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode /**任何 React 能渲染的东西 */;
}) {
  const profile = await getCurrentProfile();

  const userHref = profile ? `/user/${profile.username}` : "/user";
  console.log("app/layout: profile", profile, "userHref:", userHref);

  return (
    <html lang="zh">
      <body>
        {/* 顶部导航 */}
        <header
          className="relative z-50  fixed top-0 left-0 w-full
            z-50
            flex items-center justify-between
            px-8 py-2
            backdrop-blur-md
            bg-black/40
            border-b border-white/10"
        >
          {/* 左侧 Logo + 名称 */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="logo"
              width={36}
              height={36}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <span
              className="
                font-light text-xl  tracking-[0.25em]  transition-colors
              "
            >
              序光
            </span>
          </Link>

          {/* 右侧区域 */}
          <div className="flex items-center gap-5">
            <Link href="/ask" className="group">
              <MessageCircleQuestion
                size={30}
                strokeWidth={2}
                className="
                text-purple-400/70
                transition-all duration-300
                group-hover:text-purple-400/90
                group-hover:scale-110
                group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]
              "
              />
            </Link>

            <Link href={userHref} className="group">
              <CircleUser
                size={30}
                strokeWidth={2}
                className="
                text-indigo-400/80
                transition-all duration-300
                group-hover:text-indigo-400/90
                group-hover:scale-110
                group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]
              "
              />
            </Link>
          </div>
        </header>

        {/* 页面内容 */}
        <main>{children}</main>
      </body>
    </html>
  );
}
