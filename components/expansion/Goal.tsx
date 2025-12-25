import { ChevronRight, Goal as GoalIcon } from "lucide-react";

export function Goal() {
  return (
    <div
      className="
        p-1 rounded-2xl bg-gradient-to-r
        from-yellow-500/30 via-amber-500/20 to-yellow-500/30  "
    >
      <button
        className="
          w-full flex items-center justify-between p-6
          rounded-xl bg-[#0a0a16] hover:bg-[#171a0f]
          transition-all group  "
      >
        <div className="flex items-center gap-4">
          {/* icon */}
          <div
            className="
              p-3 rounded-full
              bg-amber-500/10 text-amber-400
              group-hover:scale-110 transition-transform "
          >
            <GoalIcon className="w-6 h-6" />
          </div>

          <div className="text-left">
            <h3
              className="
                text-lg font-medium text-white
                group-hover:text-amber-300
                transition-colors  "
            >
              目标模式
            </h3>
            <p className="text-sm text-gray-500">生成定制化的目标模式</p>
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
