"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StarfieldBackground from "@/components/starfieldBackground";
import { TREES, TreeNode } from "@/data/cloudsTree/types";
import { CLOUDS, cloudIcons, cloudColors, withOpacity } from "@/data/clouds";
import React from "react";

export default function CloudPage() {
  const params = useParams();
  const cloudKey = params.cloud as keyof typeof TREES;
  const tree = TREES[cloudKey];
  const cloudInfo = CLOUDS[cloudKey];

  if (!tree) return <div>云不存在</div>;

  return (
    <div className="relative w-full overflow-hidden">
      {/* 背景 */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none 
        bg-[radial-gradient(circle_at_center,_#1b1b3f,_#050510_60%,_#02010a)]"
      />
      <StarfieldBackground />

      <div
        className="relative z-10 text-white w-screen px-20 py-10"
        style={{ padding: 20 }}
      >
        {/* 返回 */}
        <Link
          href="/explore"
          className="text-gray-400 hover:text-white text-s  inline-block"
        >
          ← 探索模式
        </Link>

        <div className="flex w-full   gap-5 mt-10" style={{ padding: 1 }}>
          {/* 左侧cloud*/}
          <div
            className="flex items-center justify-center"
            style={{ width: "45%", height: "70vh" }}
          >
            <div className="  center">
              <CloudLargeCard cloudKey={cloudKey} cloudInfo={cloudInfo} />
            </div>
          </div>

          {/* 右侧目录  */}
          <div className="   min-w-0 overflow-hidden" style={{ width: "55%" }}>
            <div className="border-l border-white/10 pl-6 overflow-auto">
              {tree.children?.map((child) => (
                <Tree key={child.id} node={child} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CloudLargeCard({ cloudKey, cloudInfo }: any) {
  const color = cloudColors[cloudKey];

  return (
    <svg
      width={240}
      height={240}
      viewBox="0 0 260 260"
      className="flex-none  animate-soft-float"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="12" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle
        cx="130"
        cy="130"
        r="120"
        fill="rgba(178, 166, 166, 0.05)"
        stroke={color}
        strokeWidth="2"
        filter="url(#glow)"
        className="pulse-soft"
      />

      <foreignObject x="30" y="75" width="200" height="180">
        <div
          className=" flex flex-col items-center justify-center text-center text-white"
          style={{ ["--cloud-color" as any]: color }}
        >
          <div className="mb-2 text-[color:var(--cloud-color)]">
            {React.cloneElement(cloudIcons[cloudKey], {
              className: "w-10 h-10",
            })}
          </div>

          <div className="text-2xl font-light">{cloudInfo.title}</div>
          <div className="text-s text-gray-400 mt-2">
            {cloudInfo.description}
          </div>
        </div>
      </foreignObject>
    </svg>
  );
}

type Props = {
  node: TreeNode;
  path?: string[];
  level?: number;
};
function Tree({ node, path = [], level = 0 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const currentPath = [...path, node.title];

  // 字体与透明度随层级变化
  const fontSize = Math.max(12, 25 - level * 2);
  const opacity = Math.max(0.65, 1 - level * 0.1);

  return (
    <div
      className="mt-3"
      style={{
        marginLeft: level * 30,
        fontSize,
        opacity,
      }}
    >
      <div
        onClick={() => hasChildren && setExpanded(!expanded)}
        className="
          group flex items-center gap-3
          cursor-pointer
          transition-all duration-300
          hover:opacity-100 hover:text-white
        "
      >
        {/* 节点圆点 */}
        <span
          className={`
            w-2.5 h-2.5 rounded-full
            transition-all duration-300
            ${
              hasChildren
                ? expanded
                  ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  : "border border-white/40"
                : "bg-white/50 shadow-[0_0_6px_rgba(255,255,255,0.5)]"
            }
          `}
        />

        {/* 文本 */}
        {hasChildren ? (
          <span className="select-none">{node.title}</span>
        ) : (
          <Link
            href={{
              pathname: `/node/${node.id}`,
              query: { path: JSON.stringify(currentPath) },
            }}
            className="transition-colors hover:text-blue-300"
          >
            {node.title}
          </Link>
        )}
      </div>

      {expanded &&
        node.children?.map((child) => (
          <Tree
            key={child.id}
            node={child}
            path={currentPath}
            level={level + 1}
          />
        ))}
    </div>
  );
}
