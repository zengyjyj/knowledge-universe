"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import StarfieldBackground from "@/components/starfieldBackground";
import { Layers, Target, ArrowLeft } from "lucide-react";
import type { SubCategory } from "@/data/types/database";
import { getSubCategoriesMapByCatId } from "@/data/queries/subCategories";

export default function GoalCategoryPage() {
  const router = useRouter();

  const params = useParams();
  const searchParams = useSearchParams();

  const categoryId = Number(params.categoryId);
  const categoryName = searchParams.get("name");

  const [subCategoriesMap, setSubCategoriesMap] = useState<
    Map<number, SubCategory[]>
  >(new Map());

  const [activeSubCat, setActiveSubCat] = useState<SubCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      try {
        setLoading(true);
        const subCatsMapRes = await getSubCategoriesMapByCatId();
        setSubCategoriesMap(subCatsMapRes ?? new Map());

        // 默认选中第一个 subcategory
        const firstSub = subCatsMapRes?.get(categoryId)?.[0];
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

  const subCategories = subCategoriesMap.get(categoryId) ?? [];

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

          {/* 右侧选中subCategory标题 */}
          <div className="flex-[3] flex items-center ml-5">
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
              {subCategories.map((sub) => {
                const isActive = activeSubCat?.id === sub.id;

                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubCat(sub)}
                    className={`
                      group w-full text-left px-3 py-2 rounded-lg border text-base
                      transition-all duration-300 hover:scale-[1.07]
                      ${
                        isActive
                          ? "bg-white/10 border-white/40 text-white/80 scale-[1.07]"
                          : "bg-white/5 border-white/10 text-white/50  hover:bg-white/10"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <Layers
                        size={15}
                        className={`
                            transition-colors duration-300
                            ${isActive ? "text-green-600" : "text-white/50  "}
                          `}
                      />
                      <span className="truncate">{sub.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 中间竖线 */}
            <div className="w-px bg-white/10" />

            {/* 右侧 Goals */}
            <div className="flex-[6] bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[400px]">
              {activeSubCat ? (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    <Target size={18} />
                    <h2 className="text-lg font-light">Goals</h2>
                  </div>

                  <div className="text-white/50">TODO: Goals 列表</div>
                </>
              ) : (
                <div className="text-white/40">Select a SubCategory</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
