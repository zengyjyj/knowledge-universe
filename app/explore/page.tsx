"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cloudIcons, cloudColors, withOpacity } from "@/data/clouds";
import StarfieldBackground from "@/components/starfieldBackground";
import { useRouter } from "next/navigation";
import { LayoutGrid, Layers } from "lucide-react";
import { getAllClouds } from "@/data/queries/cloud";
import type { Cloud } from "@/data/types/database";

export default function ExplorePage() {
  const [mode, setMode] = useState<"structure" | "content">("content");
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAllClouds()
      .then(setClouds)
      .finally(() => setLoading(false));
  }, []);
  const [currentCloud, setCurrentCloud] = useState<string>("life");

  return (
    <>
      {/* 背景渐变 */}
      <div className="bg-radial-space" />

      <StarfieldBackground />

      <div
        className="relative w-full  overflow-hidden "
        style={{ padding: 40 }}
      >
        {/* 标题 + 模式切换按钮 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-light">探索模式</h2>

          <button
            onClick={() =>
              setMode(mode === "structure" ? "content" : "structure")
            }
            className="flex items-center gap-2 px-4 py-2 border rounded-lg border-gray-300  hover:bg-gray-400"
          >
            {mode === "structure" ? (
              <>
                <LayoutGrid size={15} />
                <span>内容模式</span>
              </>
            ) : (
              <>
                <Layers size={15} />
                <span>结构模式</span>
              </>
            )}
          </button>
        </div>

        {/* 结构模式（五大云） */}
        {mode === "structure" && (
          <div className="flex flex-col justify-center items-center  mt-20  ">
            {/* 第一排：三个云 */}
            <div className="flex justify-center gap-[8vw]">
              {clouds.slice(0, 3).map((cloud) => (
                <CloudCard
                  key={cloud.name}
                  keyName={cloud.name}
                  cloud={{ ...cloud, icon: cloudIcons[cloud.name] }}
                  color={cloudColors[cloud.name]}
                  href={`/explore/${cloud.name}`}
                />
              ))}
            </div>

            {/* 第二排：两个云 */}
            <div className="flex justify-center gap-[10vw]">
              {clouds.slice(3, 5).map((cloud) => (
                <CloudCard
                  key={cloud.name}
                  keyName={cloud.name}
                  cloud={{ ...cloud, icon: cloudIcons[cloud.name] }}
                  color={cloudColors[cloud.name]}
                  href={`/explore/${cloud.name}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* 内容模式（所有节点列表）  */}
        {mode === "content" && (
          <div className="mt-10 ">
            {/* 云按钮 */}
            <div className="flex justify-center gap-4 mb-8">
              {clouds.map((cloud) => {
                return (
                  <CloudButton
                    key={cloud.name}
                    keyName={cloud.name}
                    label={cloud.title}
                    icon={cloudIcons[cloud.name]}
                    color={cloudColors[cloud.name]}
                    isActive={currentCloud === cloud.name}
                    onClick={() => setCurrentCloud(cloud.name)}
                  />
                );
              })}
            </div>

            {/* node 列表 */}
            <div className="flex flex-wrap gap-6">
              <p>TODO:</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* 5 clouds*/
function CloudCard({ keyName, cloud, href, color }: any) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(href)}
      className="
        group relative flex flex-col items-center justify-center
        w-40 h-40 rounded-full p-4
        bg-white/5 backdrop-blur border border-white/10
        transition-all duration-300 cursor-pointer
        hover:scale-110 soft-float
      "
      style={{
        ["--cloud-color" as any]: color,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 0 25px ${color}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* 彩色扩散光晕 */}
      <div
        className="
          absolute inset-0 rounded-full opacity-0
          group-hover:opacity-30 group-hover:scale-110
          transition-all duration-500   "
        style={{ background: color }}
      />

      <div className="relative z-10 mb-2  group-hover:text-[var(--cloud-color)]">
        {cloud.icon}
      </div>

      <h2 className="relative z-10 text-lg   group-hover:text-white text-center">
        {cloud.title}
      </h2>

      <p className="relative z-10 font-light text-gray-400 text-xs text-center mt-1 leading-relaxed">
        {cloud.description}
      </p>
    </div>
  );
}

function CloudButton({ label, icon, color, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-center gap-2 px-4 py-2
        border text-sm transition    rounded-full 
      `}
      style={{
        backgroundColor: isActive
          ? withOpacity(color, 0.4)
          : withOpacity(color, 0.05),
        borderColor: isActive ? color : "rgba(255,255,255,0.2)",
        boxShadow: isActive ? `0 0 18px ${color}` : "none",
        color: isActive ? "white" : "rgba(156,163,175,1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 0 18px ${color}`;
        e.currentTarget.style.color = "white";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isActive
          ? color
          : "rgba(255,255,255,0.2)";
        e.currentTarget.style.boxShadow = isActive
          ? `0 0 18px ${color}`
          : "none";
        e.currentTarget.style.color = isActive
          ? "white"
          : "rgba(156,163,175,1)";
      }}
    >
      <div
        className="shrink-0 transition-colors duration-300"
        style={{
          color: isActive ? color : "rgba(255,255,255,0.5)",
        }}
      >
        {icon}
      </div>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function NodeCard({ node, color }: any) {
  return (
    <Link
      href={`/node/${node.id}`}
      className="
        group relative block p-5 w-60 rounded-xl
        bg-white/5 border transition-all duration-300
        hover:scale-105 cursor-pointer overflow-hidden
      "
      style={{
        borderColor: "rgba(255,255,255,0.2)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
      }}
    >
      {/* 光晕 */}
      <div
        className="
          absolute inset-0 rounded-xl opacity-0
          group-hover:opacity-20 group-hover:scale-110
          transition-all duration-500
          
        "
      />

      <h4 className="relative z-10 text-center text-gray-200 group-hover:text-white">
        {node.title}
      </h4>
    </Link>
  );
}
