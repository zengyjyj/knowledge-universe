"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import StarfieldBackground from "@/components/starfieldBackground";
import { cloudIcons, cloudColors } from "@/data/clouds";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllCloudsMap(),
      getAllCategoriesMap(),
      getAllSubCategoriesMap(),
    ]).then(([cMap, catMap, subMap]) => {
      setCloudsMap(cMap);
      setCategoriesMap(catMap);
      setSubCategoriesMap(subMap);
      setLoading(false);
    });
  }, []);

  if (!loading) {
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
        <div className="bg-radial-space" />
        <StarfieldBackground />

        <div
          className="relative z-10 text-white w-screen px-20 py-10"
          style={{ padding: 30 }}
        >
          {/* 返回键 */}
          <BackButton
            cloud={cloudInfo}
            activeCategoryId={activeCategoryId}
            onBackToCloud={() => setActiveCategoryId(null)}
          />

          <div className="flex w-full justify-center  ">
            <div className="flex w-full max-w-6xl gap-8" style={{ padding: 1 }}>
              {/* 左侧cloud*/}
              <div className="flex-[3.5] flex items-center justify-center  ">
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
                    category={
                      categories.find((c) => c.id === activeCategoryId)!
                    }
                    subCategories={subCategories}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function BackButton({
  cloud,
  activeCategoryId,
  onBackToCloud,
}: {
  cloud: Cloud;
  activeCategoryId: number | null;
  onBackToCloud: () => void;
}) {
  if (activeCategoryId === null) {
    return (
      <Link href="/explore" className="text-gray-400 hover:text-white text-s">
        ← 探索模式
      </Link>
    );
  }

  return (
    <button
      onClick={onBackToCloud}
      className="text-gray-400 hover:text-white text-s"
    >
      ← {cloud.title}
    </button>
  );
}

function CloudLargeCard({ cloudKey }: { cloudKey: string }) {
  const color = cloudColors[cloudKey];
  return (
    <svg
      width={300}
      height={300}
      viewBox="-20 -20 300 300"
      className="flex-none soft-float"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <OrbitRings color={color} />
      <OrbitStars />

      <circle
        cx="130"
        cy="130"
        r="92"
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
    <div className="mt-6">
      <h3 className="text-5xl font-light text-white ">{cloudInfo.title}</h3>
      <p className="text-xl text-gray-400 font-light mt-2">
        | {cloudInfo.description}
      </p>

      <div className=" grid grid-cols-2  gap-6 mt-8 auto-rows-fr">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className="
            rounded-3xl p-6 text-left
            bg-white/5 border border-white/15
            transition-all duration-300
            hover:bg-white/10 hover:scale-[1.01]   "
          >
            <div className="text-xl font-light text-white">{cat.title}</div>
            <div className="text-sm text-gray-500 mt-1">
              | {cat.description}
            </div>
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
}: {
  category: Category;
  cloud: Cloud;
  subCategories: SubCategory[];
}) {
  const router = useRouter();
  return (
    <div className="mt-6">
      <h3 className="text-5xl font-light  ">{category.title}</h3>
      <p className="text-xl text-gray-400 font-light mt-2">
        | {category.description}
      </p>

      <div className="grid grid-cols-2 gap-6 mt-8">
        {subCategories.map((sub) => (
          <button
            key={sub.id}
            onClick={() => router.push(`/explore/${cloud.name}/${sub.name}`)}
            className="
              rounded-3xl p-6 text-left
              bg-white/5 border border-white/15
              transition-all duration-300
              hover:bg-white/10 hover:scale-[1.02]
            "
          >
            <div className="text-xl font-light text-white">{sub.title}</div>
            <div className="text-sm text-gray-500 mt-1">
              | {sub.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function OrbitRings({ color }: { color: string }) {
  const rings = [
    { r: 100, opacity: 0.44 },
    { r: 107, opacity: 0.35 },
    { r: 114, opacity: 0.25 },
    { r: 122, opacity: 0.25 },
    { r: 132, opacity: 0.15 },
    { r: 140, opacity: 0.1 },
    { r: 146, opacity: 0.09 },
  ];

  return (
    <>
      {rings.map((ring, i) => (
        <circle
          key={i}
          cx="130"
          cy="130"
          r={ring.r}
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity={ring.opacity}
        />
      ))}
    </>
  );
}

function OrbitStars() {
  return (
    <>
      <OrbitStar radius={100} angle={0} duration={20} opacity={0.9} />
      <OrbitStar radius={107} angle={20} duration={18} opacity={0.8} />
      <OrbitStar radius={114} angle={20} duration={16} opacity={0.75} />
      <OrbitStar radius={114} angle={20} duration={15} opacity={0.7} />
      <OrbitStar radius={122} angle={60} duration={13} opacity={0.65} />
      <OrbitStar radius={122} angle={200} duration={13} opacity={0.6} />
      <OrbitStar radius={140} angle={200} duration={14} opacity={0.55} />
    </>
  );
}

function OrbitStar({
  radius,
  angle,
  size = 1.5,
  color = "grey",
  duration,
  opacity,
}: {
  radius: number;
  angle: number;
  size?: number;
  color?: string;
  duration?: number;
  opacity?: number;
}) {
  return (
    <g
      style={{
        transformOrigin: "130px 130px",
        animation: `spin ${duration}s linear infinite`,
        animationDelay: `-${Math.random() * 10}s`,
        transform: `rotate(${angle}deg)`,
      }}
    >
      <circle
        cx={130}
        cy={130 - radius}
        r={size}
        fill={color}
        opacity={opacity}
      />
    </g>
  );
}
