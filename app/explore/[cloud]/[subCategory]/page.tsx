"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StarfieldBackground from "@/components/starfieldBackground";
import { Cloud, Node, SubCategory } from "@/data/types/database";
import { getNodesBySubCategoryName } from "@/data/queries/nodes";
import { getSubCategoryByName } from "@/data/queries/subCategories";
import { getCloudByName } from "@/data/queries/cloud";
import { Cloudy as CloudIcon } from "lucide-react";
import { Community } from "@/components/expansion/Community";
import { QuickQA } from "@/components/expansion/QuickQA";

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

        <div className="max-w-3xl mx-auto pt-20">
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
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <h3 className="text-lg font-light text-blue-400 tracking-wide">
                扩展分支
              </h3>
            </div>

            {nodes.map((node) => (
              <NodeButton key={node.id} node={node} />
            ))}
          </div>

          {/* expansion placeholder */}
          <div className="flex items-center gap-3 mt-16 ">
            <span className="w-2 h-2 rounded-full bg-gray-500" />
            <h3 className="text-sm   text-gray-500 tracking-wide">
              下一步行动
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-4">
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
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/node/${node.id}`)}
      className="
            rounded-xl p-6 text-left
            bg-white/5  border border-transparent
            transition-all duration-300
            hover:bg-blue-400/10  hover:border-blue-400/10 hover:scale-[1.01]
        "
    >
      <div className="text-lg text-white font-light">{node.title}</div>
      <div className="text-sm text-gray-500 mt-1"> {node.definition}</div>
    </button>
  );
}
