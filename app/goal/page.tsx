"use client";

import { useEffect, useState, useMemo } from "react";
import { cloudIcons, cloudColors } from "@/data/clouds";
import StarfieldBackground from "@/components/starfieldBackground";
import { useRouter } from "next/navigation";
import { Bot, Layers, Target } from "lucide-react";
import { getAllClouds } from "@/data/queries/cloud";
import type { Category, Cloud, SubCategory } from "@/data/types/database";
import { getCategoriesMapByCloudId } from "@/data/queries/categories";

export default function GoalPage() {
  const [mode, setMode] = useState<"structure" | "AI">("AI");
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<Map<number, Category[]>>(
    new Map(),
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function run() {
      try {
        setLoading(true);

        const [cloudsRes, catsMapRes] = await Promise.all([
          getAllClouds(),
          getCategoriesMapByCloudId(),
        ]);
        setClouds(cloudsRes ?? []);
        setCategoriesMap(catsMapRes ?? new Map());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    run();
  }, []);

  return (
    <div className="relative z-10 text-white">
      {/* 背景渐变 */}
      <div className="bg-radial-space" />
      <StarfieldBackground />

      <div className="relative w-full px-10 pt-10 ">
        {/* 标题 + 模式切换按钮 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Target
              size={10}
              strokeWidth={2}
              className="w-10 h-10  rounded-xl p-1.5 text-white/90
                flex items-center justify-center bg-green-400 "
            />
            <h2 className="text-3xl font-light tracking-widest text-white">
              目标模式
            </h2>
          </div>

          <SwitchModeButton mode={mode} onChange={setMode} />
        </div>

        {loading ? (
          <div className="text-white/50 mt-16">Loading...</div>
        ) : error ? (
          <div className="mt-20 text-red-300">{error}</div>
        ) : (
          <>
            {/* AI问答模式  */}
            {mode === "AI" && <GoalAIMode />}

            {/* 结构模式（hover cloud -> categories -> subcategories） */}
            {mode === "structure" && (
              <StructureMode clouds={clouds} categoriesMap={categoriesMap} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SwitchModeButton({
  mode,
  onChange,
}: {
  mode: "structure" | "AI";
  onChange: (mode: "structure" | "AI") => void;
}) {
  return (
    <div
      onClick={() => onChange(mode === "AI" ? "structure" : "AI")}
      className="
        relative flex items-center
        w-40 h-11
        rounded-full
        bg-white/5 border border-white/15
        backdrop-blur
        cursor-pointer select-none
      "
    >
      {/* 滑块*/}
      <div
        className="
          absolute top-1 left-1
          h-9 w-[calc(50%-4px)]
          rounded-full
          transition-all duration-300 ease-out
        "
        style={{
          transform: mode === "AI" ? "translateX(0)" : "translateX(100%)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.15))",
          boxShadow:
            "0 8px 20px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.4)",
        }}
      />

      {/* 左：AI模式 TODO title to change */}
      <div className="relative z-10 flex-1 flex items-center justify-center gap-1 text-sm">
        <Bot size={14} />
        <span
          className={`transition-colors ${
            mode === "AI" ? "text-white" : "text-gray-400"
          }`}
        >
          AI生成
        </span>
      </div>

      {/* 右：结构模式 */}
      <div className="relative z-10 flex-1 flex items-center justify-center gap-1 text-sm">
        <Layers size={14} />
        <span
          className={`transition-colors ${
            mode === "structure" ? "text-white" : "text-gray-400"
          }`}
        >
          结构
        </span>
      </div>
    </div>
  );
}

function GoalAIMode() {
  const [goalText, setGoalText] = useState("");
  const [level, setLevel] = useState<"beginner" | "touch" | "base">("beginner");

  const canSubmit = goalText.trim().length > 0;
  const router = useRouter();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 animate-fade-up">
      {/* 顶部大标题区 */}
      <section className="text-center mt-[4vh] mb-5">
        <h1>
          <span className="text-4xl font-thin tracking-tight text-white/90">
            你想学什么？
          </span>
          <span className="mt-3 text-5xl font-light tracking-tight text-emerald-400/90">
            告诉我你的目标
          </span>
        </h1>

        <p className="mt-3 text-base md:text-lg  font-light  text-white/50">
          清晰的起点是成功的一半, AI 将为你构建结构化的知识路径。
        </p>
      </section>

      {/* 玻璃卡片 */}
      <div
        className="relative rounded-3xl mt-8
          border border-white/10 
          bg-white/[0.04] backdrop-blur-xl
          shadow-[0_0_30px_rgba(74,222,128,0.4)]"
      >
        <div className="p-6 md:p-10">
          {/* 你的目标 */}
          <div>
            <div className="relative">
              <div className="text-white/70 text-s mb-2">你的目标 </div>
              <input
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                placeholder="输入你的目标，例如：我想学健身 / 我想学Web"
                className="
                  w-full h-14  
                  rounded-2xl
                  bg-black/20  border border-emerald-400/40
                  focus:border-emerald-400
                  focus:ring-2 focus:ring-emerald-400/25
                  outline-none
                  px-5 pr-14
                  text-white/90 placeholder:text-white/35
                  transition
                "
              />
            </div>
          </div>

          {/* 熟悉程度 */}
          <div className="mt-6">
            <div className="text-white/70 text-s mb-2">熟悉程度</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LevelCard
                active={level === "beginner"}
                onClick={() => setLevel("beginner")}
                title="完全不了解"
              />
              <LevelCard
                active={level === "touch"}
                onClick={() => setLevel("touch")}
                title="略有接触"
              />
              <LevelCard
                active={level === "base"}
                onClick={() => setLevel("base")}
                title="有一定基础"
              />
            </div>
          </div>

          {/* CTA */}
          <button
            disabled={!canSubmit}
            className={`
              mt-10 w-full h-14 
              rounded-2xl
              flex items-center justify-center gap-2
              text-base md:text-lg font-medium
              transition
              ${
                canSubmit
                  ? "bg-emerald-500/90 hover:bg-emerald-500 text-white shadow-[0_0_40px_rgba(16,185,129,0.25)]"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              }
            `}
            onClick={() => {
              // TODO: 接 AI
              sessionStorage.setItem("aiAsk_goalText", goalText);
              sessionStorage.setItem("aiAsk_level", level);
              console.log({ goalText, level });
              router.push(`/goal/aiAsk`);
            }}
          >
            <span className="text-xl">⚡</span>
            生成我的专属学习路径
          </button>
        </div>
      </div>
    </div>
  );
}

function LevelCard({
  active,
  onClick,
  title,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group w-full
        rounded-2xl border
        px-5 py-4
        flex items-center gap-4
        transition
        ${
          active
            ? "border-emerald-400/60 bg-emerald-400/10"
            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
        }
      `}
    >
      <span
        className={`
          w-5 h-5 rounded-full border flex items-center justify-center
          ${
            active
              ? "border-emerald-400/80"
              : "border-white/20 group-hover:border-white/30"
          }
        `}
      >
        <span
          className={`
            w-2.5 h-2.5 rounded-full
            ${active ? "bg-emerald-400" : "bg-transparent"}
          `}
        />
      </span>

      <span className={`${active ? "text-white" : "text-white/55"} text-sm`}>
        {title}
      </span>
    </button>
  );
}

//结构模式
function StructureMode({
  clouds,
  categoriesMap,
}: {
  clouds: Cloud[];
  categoriesMap: Map<number, Category[]>;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center mt-16">
      {/* 第一排：3 个 */}
      <div className="flex justify-center gap-[10vw]">
        {clouds.slice(0, 3).map((cloud) => {
          const color = cloudColors[cloud.name];
          const categories = categoriesMap.get(cloud.id) ?? [];

          return (
            <CloudOrbitCard
              key={cloud.id}
              cloud={{ ...cloud, icon: cloudIcons[cloud.name] }}
              color={color}
              categories={categories}
            />
          );
        })}
      </div>

      {/* 第二排：2 个 */}
      <div className="flex justify-center gap-[14vw] mt-12">
        {clouds.slice(3, 5).map((cloud) => {
          const color = cloudColors[cloud.name];
          const categories = categoriesMap.get(cloud.id) ?? [];

          return (
            <CloudOrbitCard
              key={cloud.id}
              cloud={{ ...cloud, icon: cloudIcons[cloud.name] }}
              color={color}
              categories={categories}
            />
          );
        })}
      </div>
    </div>
  );
}

/*云卡 + hover 右侧弧形 categories */
function CloudOrbitCard({
  cloud,
  color,
  categories,
}: {
  cloud: any;
  color: string;
  categories: Category[];
}) {
  return (
    <div className="relative group">
      <div
        className="
        cloud-bounce  
      relative flex flex-col items-center justify-center
      w-40 h-40 rounded-full p-4
      bg-white/5 backdrop-blur border border-white/10
      transition-transform duration-300 cursor-pointer
        "
        style={{ ["--cloud-color" as any]: color }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* 光晕 */}
        <div
          className="
            absolute inset-0 rounded-full opacity-0
            group-hover:opacity-25 group-hover:scale-110
            transition-all duration-500
              pointer-events-none z-0
          "
          style={{ background: color }}
        />

        <div className="relative z-10 mb-2 group-hover:text-[var(--cloud-color)]">
          {cloud.icon}
        </div>

        <h2 className="relative z-10 text-l font-light tracking-widest text-white text-center">
          {cloud.title}
        </h2>

        <p className="relative z-10 font-light text-white/45 text-xs text-center  leading-relaxed">
          {cloud.description}
        </p>
      </div>

      {/* categories  */}
      <OrbitCategories color={color} categories={categories} />
    </div>
  );
}

/** categories 绕右侧弧形排列 */
function OrbitCategories({
  categories,
  color,
}: {
  categories: Category[];
  color: string;
}) {
  const router = useRouter();
  const radius = 110;
  const arcStart = -40; // 右上
  const arcEnd = 40; // 右下
  const items = categories.slice(0, 6);
  const n = categories.length;

  const angles = useMemo(() => {
    if (n <= 1) return [0];
    const step = (arcEnd - arcStart) / (n - 1);
    return new Array(n).fill(0).map((_, i) => arcStart + i * step);
  }, [n]);

  return (
    <div
      className="
          absolute inset-0
          opacity-0 translate-x-[-20px]
          group-hover:opacity-100 group-hover:translate-x-0
          transition-all duration-400
      "
    >
      {/* hover 展开时允许点击 */}
      <div className="absolute inset-0 pointer-events-auto">
        {items.map((c, idx) => {
          const a = (angles[idx] * Math.PI) / 180;
          const x = Math.cos(a) * radius;
          const y = Math.sin(a) * radius;

          return (
            <button
              key={c.id}
              type="button"
              onClick={() =>
                router.push(`/goal/${c.id}?name=${encodeURIComponent(c.title)}`)
              }
              className="
                absolute flex items-center   w-[180px]  
                text-left gap-2  text-white/70 hover:text-white
                transition  select-none
              "
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-20%, -50%) translate(${x}px, ${y}px)`,
                textShadow: "0 0 22px rgba(0,0,0,0.6)",
              }}
            >
              {/* 小圆点 + category titles*/}
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: color,
                  boxShadow: `0 0 10px ${color}`,
                }}
              />
              <span className="text-s font-light whitespace-nowrap">
                {c.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
