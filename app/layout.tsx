/*
✅ 放 Logo / 顶部导航 / 背景
✅ 所有页面共享
✅ 切换页面时不会重复加载
*/

import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode /**任何 React 能渲染的东西 */;
}) {
  return (
    <html lang="zh">
      <body>
        {/* 顶部导航 */}
        <header className="relative z-50" style={styles.header}>
          {/* 左侧 Logo + 名称 */}
          <Link href="/" style={styles.left}>
            <img src="/logo.png" alt="logo" style={styles.logoImage} />
            <span style={styles.logoText}>序光</span>
          </Link>

          {/* 右侧区域 */}
          <div style={styles.right}>
            <Link href="/ask">
              <img src="/ask.png" alt="问答" style={styles.askingImage} />
            </Link>

            <Link href="/user">
              <img
                src="/user.png"
                alt="user space"
                style={styles.profileImage}
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
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 32px",
    borderBottom: "0.8px solid #746c6cff",
  },

  left: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    gap: 10,
  },

  logoImage: {
    width: 36,
    height: 36,
  },

  logoText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
    letterSpacing: "2px",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  askingImage: {
    width: 40,
    height: 40,
    cursor: "pointer",
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    cursor: "pointer",
  },
};
