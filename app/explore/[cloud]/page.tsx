"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import StarfieldBackground from "@/components/starfieldBackground";
import { cloudIcons, cloudColors, withOpacity } from "@/data/clouds";
import React from "react";
import { getAllCategoriesMap } from "@/data/queries/categories";
import { getAllSubCategoriesMap } from "@/data/queries/subCategories";
import { getAllCloudsMap } from "@/data/queries/cloud";
import type { Cloud, Category, SubCategory } from "@/data/types/database";

export default function CloudPage() {
  const params = useParams();
  const [cloudsMap, setCloudsMap] = useState<Map<string, Cloud>>(new Map());
  const [categoriesMap, setCategoriesMap] = useState<Map<number, Category[]>>(
    new Map()
  );
  const [subCategoriesMap, setSubCategoriesMap] = useState<
    Map<number, SubCategory[]>
  >(new Map());
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      getAllCloudsMap(),
      getAllCategoriesMap(),
      getAllSubCategoriesMap(),
    ]).then(([cMap, catMap, subMap]) => {
      setCloudsMap(cMap);
      setCategoriesMap(catMap);
      setSubCategoriesMap(subMap);
    });
  }, []);

  const cloudName = params.cloud as string; //get current cloud
  const cloudInfo = cloudsMap.get(cloudName);
  if (!cloudInfo) return <div>云不存在</div>;
  const categories = categoriesMap.get(cloudInfo.id) ?? [];
  const subCategories =
    activeCategoryId !== null
      ? subCategoriesMap.get(activeCategoryId) ?? []
      : [];

  return (
    <div className="relative w-full overflow-hidden">
      {/* 背景 */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none 
        bg-[radial-gradient(circle_at_center,_#1b1b3f,_#050510_60%,_#02010a)]"
      />
      <StarfieldBackground />

      <div
        className="relative z-10 text-white w-screen px-20 py-10"
        style={{ padding: 20 }}
      >
        {/* 返回 */}
        <Link
          href="/explore"
          className="text-gray-400 hover:text-white text-s  inline-block"
        >
          ← 探索模式
        </Link>

        <div className="flex w-full justify-center  ">
          <div className="flex w-full max-w-6xl gap-8" style={{ padding: 1 }}>
            {/* 左侧cloud*/}
            <div className="flex-[3] flex items-center justify-center h-[70vh]">
              <div className="  center">
                <CloudLargeCard cloudKey={cloudName} />
              </div>
            </div>

            {/* 右侧二/三级分类  */}
            <div className="flex-[6] min-w-0  flex flex-col">
              {activeCategoryId === null ? (
                <CategoryGrid
                  categories={categories}
                  cloudInfo={cloudInfo}
                  onSelect={(id) => setActiveCategoryId(id)}
                />
              ) : (
                <SubCategoryCard
                  cloud={cloudInfo}
                  category={categories.find((c) => c.id === activeCategoryId)!}
                  subCategories={subCategories}
                  onBack={() => setActiveCategoryId(null)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CloudLargeCard({ cloudKey }: { cloudKey: string }) {
  const color = cloudColors[cloudKey];
  return (
    <svg
      width={240}
      height={240}
      viewBox="0 0 260 260"
      className="flex-none  animate-soft-float"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="12" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle
        cx="130"
        cy="130"
        r="100"
        fill="rgba(178, 166, 166, 0.05)"
        stroke={color}
        strokeWidth="2"
        filter="url(#glow)"
        className="pulse-soft"
      />

      <foreignObject x="30" y="105" width="200" height="180">
        <div
          className=" flex flex-col items-center justify-center text-center text-white"
          style={{ ["--cloud-color" as any]: color }}
        >
          <div className="mb-2 text-[color:var(--cloud-color)]">
            {React.cloneElement(cloudIcons[cloudKey], {
              className: "w-10 h-10",
            })}
          </div>
        </div>
      </foreignObject>
    </svg>
  );
}
function CategoryGrid({
  cloudInfo,
  categories,
  onSelect,
}: {
  cloudInfo: Cloud;
  categories: Category[];
  onSelect: (id: number) => void;
}) {
  return (
    <div className="mt-10">
      <h3 className="text-4xl font-light text-white">{cloudInfo.title}</h3>
      <p className="text-2xl text-gray-400 font-light mt-2">
        | {cloudInfo.description}
      </p>

      <div className=" grid grid-cols-2  gap-6 mt-8 auto-rows-fr">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className="
            rounded-xl p-6 text-left
            bg-white/5 border border-white/15
            transition-all duration-300
            hover:bg-white/10 hover:scale-[1.01]   "
          >
            <div className="text-lg font-light text-white">{cat.title}</div>
            <div className="text-sm text-gray-400 mt-2">{cat.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SubCategoryCard({
  category,
  cloud,
  subCategories,
  onBack,
}: {
  category: Category;
  cloud: Cloud;
  subCategories: SubCategory[];
  onBack: () => void;
}) {
  const router = useRouter();

  return (
    <div className="mt-10">
      <button
        onClick={onBack}
        className="mt-2 text-gray-400 hover:text-white text-sm"
      >
        ← 返回 {cloud.title}
      </button>

      <h3 className="text-4xl font-light mt-3">{category.title}</h3>

      <div className="grid grid-cols-2 gap-6 mt-4">
        {subCategories.map((sub) => (
          <button
            key={sub.id}
            onClick={() => router.push(`/explore/${cloud.name}/${sub.name}`)}
            className="
              rounded-xl p-6 text-left
              bg-white/5 border border-white/15
              transition-all duration-300
              hover:bg-white/10 hover:scale-[1.02]
            "
          >
            <div className="text-lg font-light text-white">{sub.title}</div>
            <div className="text-sm text-gray-400 mt-2">{sub.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
