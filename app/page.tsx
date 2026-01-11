"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import StarfieldBackground from "@/components/starfieldBackground";
import { HomeCard, homeCards } from "@/data/types/homeCard";
import { Compass, Target, MessageCircle } from "lucide-react";

export default function HomePage() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="relative z-10 text-white">
      {/* 背景 */}
      <div className="bg-radial-space" />
      <div className="bg-tech-grid" />
      <StarfieldBackground />

      {/* 页面内容 */}
      <main className="relative z-10 w-full mx-auto px-6">
        <div className="flex flex-col items-center">
          {/* 标题区 */}
          <section className="text-center mt-[20vh] mb-24">
            <h1 className="text-5xl md:text-8xl font-thin mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]">
              让世界变得清晰
            </h1>
            <p className="mt-6 text-lg text-gray-400 tracking-widest">
              结构化探索 · 目标学习路径 · AI 即时知识卡
            </p>
          </section>

          {/* 卡片区 */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeCards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                hover={hover}
                setHover={setHover}
              />
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}

const iconMap = {
  compass: <Compass className="w-6 h-6 text-blue-400" />,
  target: <Target className="w-6 h-6 text-green-400" />,
  message: <MessageCircle className="w-6 h-6 text-purple-400" />,
};
type CardItemProps = {
  card: HomeCard;
  hover: number | null;
  setHover: (id: number | null) => void;
};

export function CardItem({ card, hover, setHover }: CardItemProps) {
  const router = useRouter();
  const isHover = hover === card.id;

  return (
    <div
      onClick={() => router.push(card.route)}
      onMouseEnter={() => setHover(card.id)}
      onMouseLeave={() => setHover(null)}
      style={{
        // 注入扫描线颜色（来自静态数据）
        ["--scan-color" as any]: card.scanColor,
      }}
      className={`
        relative overflow-hidden
        group cursor-pointer p-6 rounded-3xl
        bg-white/5 border border-white/15 backdrop-blur
        shadow-[inset_0_0_8px_rgba(255,255,255,0.05)]
        transition-all duration-300
        ${
          isHover
            ? `border-white/40 shadow-[0_0_25px_rgba(255,255,255,0.25)]
               scale-[1.03] bg-white/10 ${card.borderColor}`
            : ""
        }
      `}
    >
      {/*  扫描线 */}
      <div
        className={`
          pointer-events-none
          absolute inset-0
          translate-y-[-120%]
          transition-transform duration-1000 ease-in-out
          ${isHover ? "translate-y-[120%]" : ""}
        `}
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--scan-color), transparent)",
        }}
      />

      {/*  内容层  */}
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          {iconMap[card.iconKey]}
          <h3 className="text-2xl font-light group-hover:text-white">
            {card.title}
          </h3>
        </div>

        <p className="text-sm text-gray-400 text-center mb-10">
          {card.subtitle}
        </p>

        <p
          className={`
            text-sm text-center leading-relaxed transition-colors duration-300
            ${isHover ? "text-white" : "text-gray-400"}
          `}
        >
          {card.description}
        </p>
      </div>
    </div>
  );
}
