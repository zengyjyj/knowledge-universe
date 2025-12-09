// 五大云入口页
import Link from "next/link";
import { CLOUDS } from "@/data/clouds";

export default function ExplorePage() {
  return (
    <div style={{ padding: 40 }}>
      <h2>探索模式</h2>

      <div style={{ display: "flex", gap: 20, marginTop: 40 }}>
        {Object.entries(CLOUDS).map(([key, cloud]) => (
          <Link
            key={key}
            href={`/explore/${key}`} // 点击云跳转到对应结构树页面
            style={{
              display: "block",
              padding: 24,
              width: 220,
              border: "1px solid #eee",
              borderRadius: 16,
              textDecoration: "none",
              color: "#000",
            }}
          >
            <h3>{cloud.title}</h3>
            <p style={{ color: "#666" }}>{cloud.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
