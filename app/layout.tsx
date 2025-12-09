/*
✅ 放 Logo / 顶部导航 / 背景
✅ 所有页面共享
✅ 切换页面时不会重复加载
*/

import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode /**任何 React 能渲染的东西 */;
}) {
  return (
    <html lang="zh">
      <body>
        {/* 顶部导航 */}
        <header style={styles.header}>
          {/* 左侧   */}
          <Link href="/" style={styles.logo}>
            LOGO
          </Link>

          {/* 右侧区域 */}
          <div style={styles.right}>
            <Link href="/ask">
              <img src="/ask.png" alt="问答" style={styles.askingImage} />
            </Link>

            <Link href="/user">
              <img src="/user.png" alt="个人空间" style={styles.profileImage} />
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
    padding: "3px 32px",
    borderBottom: "1px solid #eee",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 12, // ✅ 间距
  },

  logo: {
    fontWeight: "bold",
    fontSize: 18,
    textDecoration: "none",
    color: "#000",
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
