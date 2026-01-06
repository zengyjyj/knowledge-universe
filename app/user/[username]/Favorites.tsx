"use client";

import { useEffect, useState } from "react";
import { getFavoriteNodesAction } from "./ServerActions";
import type { Node } from "@/data/types/database";
import { useRouter } from "next/navigation";

export default function Favorites() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavoriteNodesAction()
      .then(setNodes)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">📚 我的知识收藏</h1>

      {loading ? (
        <div className="rounded-3xl p-6 bg-white/10 border border-white/10">
          <p className="text-white/40 text-sm">加载中…</p>
        </div>
      ) : nodes.length === 0 ? (
        <div className="rounded-3xl p-6 bg-white/10 border border-white/10">
          <p className="text-white/50 text-sm">你还没有收藏任何知识节点 ✨</p>
        </div>
      ) : (
        <div
          className="
             grid gap-4 grid-cols-1  
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
        >
          {nodes.map((node) => (
            <NodeCard key={node.id} node={node} />
          ))}
        </div>
      )}
    </div>
  );
}

function NodeCard({ node }: { node: Node }) {
  const router = useRouter();
  return (
    <div
      key={node.id}
      onClick={() => router.push(`/node/${node.id}`)}
      className=" 
        rounded-3xl p-6

        bg-gradient-to-br
        from-purple-400/30 via-transparent/20 to-sky-300/20

        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-2xl
      
                "
    >
      <h3
        className=" text-lg
          font-medium
          leading-snug
          text-white
          tracking-wide
          line-clamp-2"
      >
        {node.title}
      </h3>

      <p
        className=" mt-4
          text-sm
          leading-relaxed
          text-white/70
          line-clamp-6"
      >
        {node.definition}
      </p>
    </div>
  );
}
