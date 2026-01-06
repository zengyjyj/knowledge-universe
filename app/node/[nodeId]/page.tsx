"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getNodeDetailById } from "@/data/queries/nodes";
import { Node, NodePath } from "@/data/types/database";
import StarfieldBackground from "@/components/starfieldBackground";
import { Cloudy } from "lucide-react";
import { Community } from "@/components/expansion/Community";
import { QuickQA } from "@/components/expansion/QuickQA";
import { Goal } from "@/components/expansion/Goal";
import { Heart } from "lucide-react";
import { getNodeState, toggleFavoriteNodeAction } from "./nodeActions";

export default function NodePage() {
  const params = useParams();
  const nodeIdStr = params.nodeId as string;
  const nodeId = Number(nodeIdStr);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [node, setNode] = useState<Node | null>(null);
  const [nodePath, setNodePath] = useState<NodePath | null>(null);

  //get node by nodeId
  useEffect(() => {
    async function run() {
      try {
        getNodeDetailById(nodeId).then((res) => {
          setNode(res.node);
          setNodePath(res.nodePath);
        });
        getNodeState(nodeId).then((res) => {
          setLoggedIn(res.loggedIn);
          setFavorited(res.favorited);
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    if (nodeId) run();
  }, [nodeId, favorited, loggedIn]);

  if (error || loading || !node || !nodePath) return null;

  //node detail
  const detailBlocks = node.detail
    .split("<<<>>>")
    .map((b) => b.trim())
    .filter(Boolean);

  const nodeDetails: { title: string; content: string }[] = [];
  for (let i = 0; i < detailBlocks.length; i += 2) {
    nodeDetails.push({
      title: detailBlocks[i],
      content: detailBlocks[i + 1] ?? "",
    });
  }

  return (
    <div className="relative w-full overflow-hidden">
      <StarfieldBackground />
      <FavoriteNodeButton
        nodeId={node.id}
        favorited={favorited}
        loggedIn={loggedIn}
        onChangeFavorited={setFavorited}
      />

      <div className="relative z-10 text-white w-screen px-20 py-10">
        {/* path */}
        <div className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
          {
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Cloudy className=" w-4 h-4 group-hover:scale-110" />
              <BackToCloud cTitle={nodePath.cTitle} />

              <span className="opacity-40">{">>"}</span>
              <BackToCategory
                cName={nodePath.cName}
                catTitle={nodePath.catTitle}
              />

              <span className="opacity-40">{">>"}</span>
              <BackToSubCategory
                cName={nodePath.cName}
                subName={nodePath.subName}
                subTitle={nodePath.subTitle}
              />
            </div>
          }
        </div>

        <div className="max-w-3xl mx-auto pt-20">
          {/* Node Intro */}
          <div className="max-w-3xl">
            <h1 className="text-5xl font-light">{node.title}</h1>
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
              {node.definition}
            </p>
          </div>

          {/* Node detail */}
          <div className="grid grid-cols-1 gap-4 mt-14">
            {nodeDetails.map((block, index) => (
              <NodeDetail
                key={index}
                title={block.title}
                content={block.content}
              />
            ))}
          </div>

          {/* expansion placeholder */}
          <div className="grid gap-6 mt-10">
            {/* 社区 */}
            <Community />
          </div>

          <div className="flex items-center gap-3 mt-10 ">
            <span className="w-2 h-2 rounded-full bg-gray-500" />
            <h3 className="text-sm  text-gray-500 tracking-wide">下一步行动</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            {/* goal */}
            <Goal />
            {/* 即问即答 */}
            <QuickQA />
          </div>

          <SearchInSub
            cName={nodePath.cName}
            subName={nodePath.subName}
            subTitle={nodePath.subTitle}
          />
        </div>
      </div>
    </div>
  );
}

function NodeDetail({ title, content }: { title: string; content: string }) {
  return (
    <div
      className="
            rounded-xl p-6 text-left
            bg-white/5  border border-transparent
            transition-all duration-300
             
        "
    >
      <div className="text-lg text-white font-light">{title}</div>
      <div className="text-sm text-gray-500 mt-1"> {content}</div>
    </div>
  );
}

function BackToCloud({ cTitle }: { cTitle: string }) {
  const router = useRouter();
  return (
    <span
      onClick={() => router.push(`/explore`)}
      className="cursor-pointer hover:text-white transition"
    >
      {cTitle}
    </span>
  );
}

function BackToCategory({
  cName,
  catTitle,
}: {
  cName: string;
  catTitle: string;
}) {
  const router = useRouter();
  return (
    <span
      onClick={() => router.push(`/explore/${cName}`)}
      className="cursor-pointer hover:text-white transition"
    >
      {catTitle}
    </span>
  );
}

function BackToSubCategory({
  cName,
  subName,
  subTitle,
}: {
  cName: string;
  subName: string;
  subTitle: string;
}) {
  const router = useRouter();
  return (
    <span
      onClick={() => router.push(`/explore/${cName}/${subName}`)}
      className="cursor-pointer hover:text-white transition"
    >
      {subTitle}
    </span>
  );
}

function SearchInSub({
  cName,
  subName,
  subTitle,
}: {
  cName: string;
  subName: string;
  subTitle: string;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/explore/${cName}/${subName}`)}
      className="
        w-full mt-5
        rounded-3xl  py-2  flex   justify-center
       border border-white/15
        hover:bg-white/7 hover:scale-[1.02]
        transition-all duration-300"
    >
      <span className="text-sm font-light text-center text-gray-400">
        ← 继续看看其他 {subTitle} 知识
      </span>
    </button>
  );
}

export function FavoriteNodeButton({
  nodeId,
  favorited,
  loggedIn,
  onChangeFavorited,
}: {
  nodeId: number;
  favorited: boolean;
  loggedIn: boolean;
  onChangeFavorited: (v: boolean) => void;
}) {
  async function toggleLike() {
    if (!loggedIn) {
      const router = useRouter();
      router.push("/user");
      return;
    }

    const nextFavorited = await toggleFavoriteNodeAction(nodeId, favorited);
    onChangeFavorited(nextFavorited);
  }

  return (
    <button
      onClick={toggleLike}
      className="
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        flex items-center justify-center
        backdrop-blur
        bg-white/10 border border-transparent
        shadow-lg
        transition-all duration-300  
        hover:scale-110
        hover:bg-white/20
      "
      aria-label="收藏 / 点赞该知识节点"
    >
      <Heart
        className={`
          w-6 h-6 transition-all duration-300
          ${favorited ? "fill-red-500 text-red-500" : "text-gray-300"}
        `}
      />
    </button>
  );
}
