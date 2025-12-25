import { ChevronRight, Sparkles } from "lucide-react";

export function QuickQA() {
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
