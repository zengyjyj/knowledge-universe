"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import StarfieldBackground from "@/components/starfieldBackground";
import { Layers, Target, ArrowLeft } from "lucide-react";
import type { GoalLite, SubCategory } from "@/data/types/database";
import { getSubCategoriesByCatId } from "@/data/queries/subCategories";
import { getGoalsByCategoryId } from "@/data/queries/goal";

export default function GoalCategoryPage() {
  const router = useRouter();

  const params = useParams();
  const searchParams = useSearchParams();

  const categoryId = Number(params.categoryId);
  const categoryName = searchParams.get("name");

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [goalsMap, setGoalsMap] = useState<Map<number, GoalLite[]>>(new Map());

  const [activeSubCat, setActiveSubCat] = useState<SubCategory | null>(null);
  const activeGoals = activeSubCat ? (goalsMap.get(activeSubCat.id) ?? []) : [];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      try {
        setLoading(true);
        console.log("test database");
        const [subCatsRes, goalsMapRes] = await Promise.all([
          getSubCategoriesByCatId(categoryId),
          getGoalsByCategoryId(categoryId),
        ]);

        setSubCategories(subCatsRes ?? []);
        setGoalsMap(goalsMapRes ?? new Map());
        console.log("res");
        console.log(subCatsRes);
        console.log(goalsMapRes);

        // 默认选中第一个 subcategory
        const firstSub = subCatsRes?.[0];
        if (firstSub) {
          setActiveSubCat(firstSub);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    if (categoryId) run();
  }, [categoryId]);

  return (
    <div className="relative z-10 text-white ">
      {/* 背景 */}
      <div className="bg-radial-space" />
      <StarfieldBackground />

      <div className="relative w-full h-full px-10 pt-10">
        <div className="flex items-stretch gap-6 mb-8">
          {/* 返回到category*/}
          <div className="flex-[1] flex items-center">
            <button
              onClick={() => router.push("/goal")}
              className="flex items-center gap-2 text-white/60 hover:text-white transition"
            >
              <ArrowLeft size={18} />
              {categoryName}
            </button>
          </div>

          {/* 选中subCategory标题 */}
          <div className="flex-[3] flex items-center ">
            <h1 className="text-2xl font-light tracking-wide">
              {activeSubCat?.title}
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="text-white/50 mt-16">Loading...</div>
        ) : error ? (
          <div className="mt-20 text-red-300">{error}</div>
        ) : (
          <div className="flex items-stretch gap-6">
            {/* 左侧 SubCategory 目录 */}
            <div className="flex-[1.5] min-w-[200px] space-y-4">
              {subCategories.map((sub) => (
                <SubCategoryButton
                  key={sub.id}
                  sub={sub}
                  isActive={activeSubCat?.id === sub.id}
                  onClick={() => setActiveSubCat(sub)}
                />
              ))}
            </div>

            {/* 中间竖线 */}
            <div className="w-px bg-white/10" />

            {/* 右侧 Goals */}
            <div className="flex-[6] bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[400px]">
              {activeGoals.length === 0 ? (
                <div className="text-white/40">No goals available</div>
              ) : (
                <div className="grid gap-4">
                  {activeGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getDifficultyStyle(difficulty?: string | null) {
  switch (difficulty) {
    case "beginner":
      return {
        label: "入门",
        className: "bg-green-500/20 text-green-500 border-green-500/30",
      };

    case "intermediate":
      return {
        label: "中级",
        className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      };

    case "advanced":
      return {
        label: "高级",
        className: "bg-red-500/20 text-red-500 border-red-500/30",
      };

    default:
      return {
        label: "未知",
        className: "bg-gray-500/20 text-gray-400 border-gray-400/30",
      };
  }
}

function SubCategoryButton({
  sub,
  isActive,
  onClick,
}: {
  sub: SubCategory;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        group w-full text-left px-3 py-2 rounded-lg border text-base
        transition-all duration-300 hover:scale-[1.07]
        ${
          isActive
            ? "bg-white/10 border-white/40 text-white/80 scale-[1.07]"
            : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
        }
      `}
    >
      <div className="flex items-center gap-2">
        <Layers
          size={15}
          className={`
            transition-colors duration-300
            ${isActive ? "text-green-600" : "text-white/50"}
          `}
        />
        <span className="truncate">{sub.title}</span>
      </div>
    </button>
  );
}

function GoalCard({ goal }: { goal: GoalLite }) {
  const diff = getDifficultyStyle(goal.difficulty);

  return (
    <div
      className="group relative bg-white/5 border border-white/10 rounded-xl 
          p-4 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]
          "
    >
      {/* 难度标签 */}
      <div className="absolute top-4 right-4">
        <span
          className={`px-3 py-1 text-xs rounded-full border ${diff.className}`}
        >
          {diff.label}
        </span>
      </div>

      {/* Title */}
      <div className="flex items-center gap-2">
        <Target
          size={18}
          className="transition-colors duration-300 text-white/70 group-hover:text-green-600"
        />
        <p
          className="text-lg font-base  
              text-white/70 group-hover:text-white transition-colors"
        >
          {goal.title}
        </p>
      </div>

      {/* Introduction */}
      <p className="text-sm font-light text-white/50 leading-relaxed ml-2 mr-2">
        {goal.introduction}
      </p>
    </div>
  );
}
