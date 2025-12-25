"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export function FavoriteNodeButton({ nodeId }: { nodeId: number }) {
  const [liked, setLiked] = useState(false);

  function toggleLike() {
    setLiked((prev) => !prev);
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
          ${liked ? "fill-red-500 text-red-500" : "text-gray-300"}
        `}
      />
    </button>
  );
}
