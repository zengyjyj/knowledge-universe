"use client";

import { useEffect, useState } from "react";
import { cloudIcons, cloudColors, withOpacity } from "@/data/clouds";
import StarfieldBackground from "@/components/starfieldBackground";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutGrid,
  Layers,
  CircleArrowRight,
  CircleQuestionMark,
  Search,
} from "lucide-react";
import { getAllClouds } from "@/data/queries/cloud";
import type { Cloud, GuideNode } from "@/data/types/database";
import { getGuideNodes } from "@/data/queries/nodes";

export default function ExplorePage() {
  const [mode, setMode] = useState<"structure" | "content">("content");
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [guideNodes, setGuideNodes] = useState<Map<string, GuideNode[]>>(
    new Map(),
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAllClouds()
      .then(setClouds)
      .finally(() => setLoading(false));

    getGuideNodes()
      .then(setGuideNodes)
      .finally(() => setLoading(false));
  }, []);
  const [currentCloud, setCurrentCloud] = useState<string>("life");

  // console.log("GuideNodes Map:", guideNodes);
  // console.log("life cloud nodes:", guideNodes.get("life"));
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
          {mode === "content" && (
            <h2 className="text-3xl   font-thin tracking-widest">探索模式</h2>
          )}
          {mode === "structure" && (
            <h2 className="text-3xl font-thin tracking-widest">结构模式</h2>
          )}

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
            {/* guideCard 引导小卡片 */}
            <div
              className=" grid gap-3 grid-cols-1
              sm:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
          "
            >
              {guideNodes.get(currentCloud) &&
                guideNodes
                  .get(currentCloud)!
                  .map((node) => (
                    <GuideCard
                      key={node.id}
                      node={node}
                      color={cloudColors[currentCloud]}
                    />
                  ))}
              {<EmptyState />}
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

      <h2 className="relative z-10 text-lg font-light tracking-widest group-hover:text-white text-center">
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
        borderColor: isActive
          ? withOpacity(color, 0.6)
          : "rgba(255,255,255,0.2)",
        boxShadow: isActive ? `0 0 18px ${color}` : "none",
      }}
      className={`
        bg-white/5
        group relative overflow-hidden
        w-full flex items-center justify-center gap-2
        px-4 py-2 rounded-full border text-sm
         ${isActive ? "text-white" : "text-gray-400"}
        transition-all duration-300
        hover:text-white  
        hover:bg-white/10
      `}
    >
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

function GuideCard({ node, color }: any) {
  return (
    <div className="group relative h-[170px] mb-3 break-inside-avoid">
      {/* 动态颜色旋转渐变 */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <div
          className="
            absolute inset-0 
            opacity-0
            group-hover:opacity-80
            transition-opacity 
            group-hover:animate-spin-slow
            group-hover:delay-150
            pointer-events-none
          "
          style={{
            background: `conic-gradient(from 0deg, transparent, ${color}, transparent)`,
          }}
        />
        <div className="absolute inset-[2px] rounded-3xl bg-[#0b0f1a]" />
      </div>

      {/*  3D 翻转 */}
      <div className="relative h-full [perspective:1000px]">
        <div
          className="
            relative h-full
            transition-transform duration-500
            [transform-style:preserve-3d]
            group-hover:[transform:rotateY(180deg)]
          "
        >
          {/* 正面 */}
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <div
              className="
                h-full  bg-transparent  backdrop-blur-sm
                border border-white/10
                rounded-3xl  px-4 py-4
                flex items-center justify-center
                text-center "
            >
              <h3 className="text-lg text-white/85 leading-snug font-light flex items-start gap-2">
                <span className="flex-shrink-0 mt-[2px]" style={{ color }}>
                  <CircleQuestionMark size={18} strokeWidth={1.8} />
                </span>
                <span>{node.question}</span>
              </h3>
            </div>
          </div>

          {/* 背面 */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div
              className="
                h-full bg-grey/30 backdrop-blur
                border border-white/5
                rounded-3xl  px-4 py-4
                flex items-center justify-center
                text-center  "
            >
              <p className="text-sm text-gray-400  ">{node.definition}</p>
              {/* 右下角跳转按钮 */}
              <Link
                href={`/node/${node.id}`}
                onClick={(e) => e.stopPropagation()}
                className="
                  absolute bottom-3 right-4
                  flex items-center gap-1
                  text-xs  text-white/80
                  border border-white/30 rounded-full px-2 py-1
                  group-hover:opacity-100
                  soft-float
                  hover:text-white  hover:border-white/80
                "
                style={{
                  textShadow: `0 0 8px ${color}40`,
                }}
              >
                <span>了解更多</span>
                <CircleArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="text-white/20 ">
        <Search size={45} strokeWidth={2} />
      </div>

      <h3 className="  mt-3 text-2xl   tracking-widest text-white/20">
        暂无相关卡片
      </h3>

      <Link
        href="/ask"
        className="
          text-sm text-white/50
          mt-3
          px-5 py-1
          rounded-full
          border border-white/40
          hover:text-white/70 
           hover:bg-white/30
          transition-all
        "
      >
        去AI提问 →
      </Link>
    </div>
  );
}
