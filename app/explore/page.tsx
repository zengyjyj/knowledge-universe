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

          <SwitchModeButton mode={mode} onChange={setMode} />
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
              <p>Effet:https://uiverse.io/ElSombrero2/tricky-robin-67</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function SwitchModeButton({
  mode,
  onChange,
}: {
  mode: "structure" | "content";
  onChange: (mode: "structure" | "content") => void;
}) {
  return (
    <div
      onClick={() => onChange(mode === "content" ? "structure" : "content")}
      className="
        relative flex items-center
        w-40 h-11
        rounded-full
        bg-white/5 border border-white/15
        backdrop-blur
        cursor-pointer select-none
      "
    >
      {/* 滑块*/}
      <div
        className="
          absolute top-1 left-1
          h-9 w-[calc(50%-4px)]
          rounded-full
          transition-all duration-300 ease-out
        "
        style={{
          transform: mode === "content" ? "translateX(0)" : "translateX(100%)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.15))",
          boxShadow:
            "0 8px 20px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.4)",
        }}
      />

      {/* 左：内容模式 */}
      <div className="relative z-10 flex-1 flex items-center justify-center gap-1 text-sm">
        <LayoutGrid size={14} />
        <span
          className={`transition-colors ${
            mode === "content" ? "text-white" : "text-gray-400"
          }`}
        >
          内容
        </span>
      </div>

      {/* 右：结构模式 */}
      <div className="relative z-10 flex-1 flex items-center justify-center gap-1 text-sm">
        <Layers size={14} />
        <span
          className={`transition-colors ${
            mode === "structure" ? "text-white" : "text-gray-400"
          }`}
        >
          结构
        </span>
      </div>
    </div>
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
      style={{
        ["--scan-color" as any]: color,
        backgroundColor: isActive
          ? withOpacity(color, 0.2)
          : withOpacity(color, 0.06),
        borderColor: isActive ? color : "rgba(255,255,255,0.2)",
        boxShadow: isActive ? `0 0 18px ${color}` : "none",
      }}
      className={`
       group relative overflow-hidden
        w-full flex items-center justify-center gap-2
        px-4 py-2 rounded-full border text-sm
         ${isActive ? "text-white" : "text-gray-400"}
        transition-all duration-300
        hover:text-white hover:border-[var(--scan-color)]
        hover:shadow-[0_0_18px_var(--scan-color)]
      `}
    >
      {/* 扫描效果 */}
      <span
        className="
          pointer-events-none
          absolute inset-0
          translate-y-[-120%]
          transition-transform duration-700 ease-out
          group-hover:translate-y-[120%]
        "
        style={{
          opacity: 0.2,
          background:
            "linear-gradient(to bottom, transparent, var(--scan-color), transparent)",
        }}
      />

      {/* 内容 */}
      <span className="relative z-10 flex items-center gap-2">
        <span
          className="transition-colors duration-300"
          style={{
            color: isActive ? color : "rgba(255,255,255,0.5)",
          }}
        >
          {icon}
        </span>

        <span className="whitespace-nowrap">{label}</span>
      </span>
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
