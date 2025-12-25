import { ChevronRight, MessageSquare } from "lucide-react";

export function Community() {
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
