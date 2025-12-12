"use client";

import { JSX, useState } from "react";
import Link from "next/link";
import { CLOUDS } from "@/data/clouds";
import { NODES } from "@/data/nodes/types";
import StarfieldBackground from "@/components/starfieldBackground";
import {
  LayoutGrid,
  Layers,
  Heart,
  Book,
  User,
  Globe,
  Star,
} from "lucide-react";

const cloudIcons: Record<string, JSX.Element> = {
  life: <Heart className="w-7 h-7 text-red-300" />,
  learning: <Book className="w-7 h-7 text-blue-300" />,
  skill: <Star className="w-7 h-7 text-yellow-300" />,
  growth: <User className="w-7 h-7 text-green-300" />,
  world: <Globe className="w-7 h-7 text-purple-300" />,
};
const cloudColors: Record<string, string> = {
  life: "rgba(210, 109, 109, 0.4)",
  learning: "rgba(100,150,255,0.4)",
  skill: "rgba(255,220,100,0.4)",
  growth: "rgba(35, 220, 22, 0.45)",
  world: "rgba(212, 51, 172, 0.42)",
};

export default function ExplorePage() {
  const [mode, setMode] = useState<"structure" | "content">("structure");
  const [currentCloud, setCurrentCloud] = useState<keyof typeof CLOUDS>("life");

  return (
    <>
      {/* 背景渐变 */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#1b1b3f,_#050510_60%,_#02010a)]" />

      <StarfieldBackground />
      <div className="relative  " style={{ padding: 40 }}>
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
          <div className="flex flex-col justify-center items-center w-full h-[80vh]">
            {/* 第一排：三个云 */}
            <div className="flex justify-center gap-[8vw]">
              {Object.entries(CLOUDS)
                .slice(0, 3)
                .map(([key, cloud]) => (
                  <CloudCard
                    key={key}
                    cloud={{ ...cloud, icon: cloudIcons[key] }}
                    color={cloudColors[key]}
                    href={`/explore/${key}`}
                  />
                ))}
            </div>

            <div className="h-[4vh]" />

            {/* 第二排：两个云 */}
            <div className="flex justify-center gap-[10vw]">
              {Object.entries(CLOUDS)
                .slice(3, 5)
                .map(([key, cloud]) => (
                  <CloudCard
                    key={key}
                    cloud={{ ...cloud, icon: cloudIcons[key] }}
                    color={cloudColors[key]}
                    href={`/explore/${key}`}
                  />
                ))}
            </div>
          </div>
        )}

        {/* 内容模式（所有节点列表）  */}
        {mode === "content" && (
          <div className="mt-10">
            {/* 云按钮 */}
            <div className="flex justify-center gap-4 mb-8">
              {Object.entries(CLOUDS).map(([key, cloud]) => (
                <CloudButton
                  key={key}
                  keyName={key}
                  label={cloud.title}
                  icon={cloudIcons[key]}
                  color={cloudColors[key]}
                  isActive={currentCloud === key}
                  onClick={() => setCurrentCloud(key as keyof typeof CLOUDS)}
                />
              ))}
            </div>

            {/* node 列表 */}
            <div className="flex flex-wrap gap-6">
              {Object.values(NODES)
                .filter((n) => n.cloud === currentCloud)
                .map((node) => (
                  <NodeCard
                    key={node.id}
                    node={node}
                    color={cloudColors[node.cloud]}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* 5 clouds*/
function CloudCard({ cloud, href, color }: any) {
  return (
    <Link
      href={href}
      className="
        group flex flex-col items-center justify-center
        w-40 h-40 rounded-full p-4
        bg-white/5 backdrop-blur border border-white/10
        transition-all duration-300 cursor-pointer
        hover:scale-110   animate-soft-float
      "
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 0 25px ${color}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
      }}
    >
      <div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 
                transition-all duration-500 scale-75 group-hover:scale-110"
        style={{ background: color }}
      />

      <div className="mb-2">{cloud.icon}</div>

      <h2 className="text-lg font-light group-hover:text-white text-center ">
        {cloud.title}
      </h2>

      <p className="text-gray-400 text-xs text-center mt-1 leading-relaxed">
        {cloud.description}
      </p>
    </Link>
  );
}
function CloudButton({ label, icon, color, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-center gap-2 px-4 py-2
        rounded-lg border text-sm transition
        bg-white/5
        ${isActive ? "text-white bg-white/10" : "text-gray-300"}
      `}
      style={{
        borderColor: isActive ? color : "rgba(255,255,255,0.2)",
        boxShadow: isActive ? `0 0 20px ${color}` : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 0 18px ${color}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isActive
          ? color
          : "rgba(255,255,255,0.2)";
        e.currentTarget.style.boxShadow = isActive
          ? `0 0 18px ${color}`
          : "none";
      }}
    >
      <div className="shrink-0">{icon}</div>
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
