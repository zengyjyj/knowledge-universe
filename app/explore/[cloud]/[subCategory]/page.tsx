"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StarfieldBackground from "@/components/starfieldBackground";
import { Cloud, Node, SubCategory } from "@/data/types/database";
import { getNodesBySubCategoryName } from "@/data/queries/nodes";
import { getSubCategoryByName } from "@/data/queries/subCategories";
import { getCloudByName } from "@/data/queries/cloud";
import {
  ChevronRight,
  Cloudy as CloudIcon,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function SubCategoryPage() {
  const router = useRouter();
  const params = useParams();

  const cloudName = params.cloud as string;
  const subCategoryName = params.subCategory as string;

  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [cloud, setCloud] = useState<Cloud | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setError(null);

        const [c, sub, n] = await Promise.all([
          getCloudByName(cloudName),
          getSubCategoryByName(subCategoryName),
          getNodesBySubCategoryName(subCategoryName),
        ]);

        if (cancelled) return;
        setCloud(c);
        setSubCategory(sub);
        setNodes(n);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }

    if (cloudName && subCategoryName) run();

    return () => {
      cancelled = true;
    };
  }, [cloudName, subCategoryName]);

  if (error || loading || !nodes || !subCategory) return null;

  return (
    <div className="relative w-full overflow-hidden">
      <StarfieldBackground />

      <div className="relative z-10 text-white w-screen px-20 py-10">
        {/* 返回 */}
        <button
          onClick={() => router.push(`/explore/${cloudName}`)}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"
        >
          <span>←</span>
          <CloudIcon className=" w-4 h-4 group-hover:scale-110" />
          <span>{cloud?.title}</span>
        </button>

        <div className="max-w-6xl mx-auto pt-20">
          {/* subCategory info */}
          <div className="max-w-3xl">
            <h1 className="text-5xl font-light">{subCategory?.title}</h1>
            <p
              className="
                relative text-l text-gray-500 mt-3 pl-4
                leading-relaxed  "
            >
              <span
                className="
                    absolute left-0 top-1 bottom-1 w-[2px]
                    bg-gradient-to-b from-blue-400/80 to-blue-400/20  "
              />
              {subCategory?.intro}
            </p>
          </div>

          {/* nodes */}
          <div className="grid grid-cols-1 gap-4 mt-14">
            <div className="flex items-center gap-3 ">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <h3 className="text-lg font-light text-blue-400 tracking-wide">
                扩展分支
              </h3>
            </div>
            {nodes.map((node) => (
              <NodeButton node={node} />
            ))}
          </div>

          {/* expansion placeholder */}
          <div className="grid grid-cols-2 gap-6 mt-16">
            {/* 社区 */}
            <Community />
            {/* 即问即答 */}
            <QuickQA />
          </div>
        </div>
      </div>
    </div>
  );
}

function NodeButton({ node }: { node: Node }) {
  return (
    <button
      key={node.id}
      className="
            rounded-xl p-6 text-left
            bg-white/5  border border-transparent
            transition-all duration-300
            hover:bg-blue-400/10  hover:border-blue-400/10 hover:scale-[1.01]
        "
    >
      <div className="text-lg text-white font-light">{node.title}</div>
      <div className="text-sm text-gray-500 mt-1">| {node.definition}</div>
    </button>
  );
}

function Community() {
  return (
    <div
      className="
            p-1 rounded-2xl bg-gradient-to-r  from-purple-500/20 via-blue-500/20 to-teal-500/20"
    >
      <button
        className="   w-full flex items-center justify-between p-6 
            rounded-xl bg-[#0a0a16] hover:bg-[#111122] transition-all group"
      >
        <div className="flex items-center gap-4">
          {/* icon */}
          <div className="p-3 rounded-full bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>

          <div className="text-left">
            <h3 className="text-lg font-medium text-white group-hover:text-purple-300 transition-colors">
              加入轻社区讨论
            </h3>
            <p className="text-sm text-gray-500">
              看看大家都在关注什么体检问题
            </p>
          </div>
        </div>

        {/* 右侧箭头 */}
        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
      </button>
    </div>
  );
}

function QuickQA() {
  return (
    <div
      className="
        p-1 rounded-2xl bg-gradient-to-r
        from-emerald-500/20 via-green-500/20 to-teal-500/20  "
    >
      <button
        className="
          w-full flex items-center justify-between p-6
          rounded-xl bg-[#0a0a16] hover:bg-[#0f1a14]
          transition-all group  "
      >
        <div className="flex items-center gap-4">
          {/* icon */}
          <div
            className="
              p-3 rounded-full
              bg-emerald-500/10 text-emerald-400
              group-hover:scale-110 transition-transform "
          >
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="text-left">
            <h3
              className="
                text-lg font-medium text-white
                group-hover:text-emerald-300
                transition-colors  "
            >
              即问即答
            </h3>
            <p className="text-sm text-gray-500">
              AI 快速解答你的体检与健康疑问
            </p>
          </div>
        </div>

        {/* 右侧箭头 */}
        <ChevronRight
          className="
            w-5 h-5 text-gray-600
            group-hover:text-white
            group-hover:translate-x-1
            transition-all
          "
        />
      </button>
    </div>
  );
}
