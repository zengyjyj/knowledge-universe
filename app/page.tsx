"use client";

import { useRouter } from "next/navigation";
import StarfieldBackground from "@/components/starfieldBackground";
import { HomeCard, homeCards } from "@/data/entries";
import { Compass, Target, MessageCircle } from "lucide-react";
import { withOpacity } from "@/data/clouds";

export default function HomePage() {
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
          <section className="text-center mt-[18vh] mb-20">
            <h1
              className="text-5xl md:text-8xl font-thin mb-8 tracking-tight text-transparent bg-clip-text 
            bg-gradient-to-b from-white via-white to-white/40 drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]"
            >
              让世界变得清晰
            </h1>
            <p className="mt-6 text-lg text-gray-400 tracking-widest">
              结构化探索 · 目标学习路径 · AI 即时知识卡
            </p>
          </section>

          {/* 卡片区 */}
          <section className="grid grid-cols-1 mt-3 md:grid-cols-3 gap-8 items-stretch">
            {homeCards.map((card) => (
              <CardItem key={card.id} {...card} />
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}

const iconMap = {
  compass: <Compass className="w-7 h-7 text-blue-400" />,
  target: <Target className="w-6 h-6 text-green-400" />,
  message: <MessageCircle className="w-6 h-6 text-purple-400" />,
};

export function CardItem(card: HomeCard) {
  const router = useRouter();
  const scanColor = withOpacity(card.color, 0.12);
  const borderColor = withOpacity(card.color, 0.5);
  const shadowColor = withOpacity(card.color, 0.55);

  return (
    <div
      onClick={() => router.push(card.route)}
      style={{
        ["--scan-color" as any]: scanColor,
        ["--border-color" as any]: borderColor,
        ["--shadow-color" as any]: shadowColor,
      }}
      className={` 
        relative overflow-hidden
        group cursor-pointer p-6 rounded-3xl
          h-full min-h-[250px]
        bg-white/5 border border-white/15 backdrop-blur
        shadow-[inset_0_0_8px_rgba(255,255,255,0.05)]
        transition-all duration-300
        hover:scale-[1.03] hover:bg-white/10
        hover:border-[var(--border-color)]
        hover:shadow-[0_0_25px_var(--shadow-color)]
  
      `}
    >
      {/*  扫描线 */}
      <div
        className={`
          pointer-events-none
          absolute inset-0
          translate-y-[-120%]
          transition-transform duration-1000 ease-in-out
          group-hover:translate-y-[120%]
        `}
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--scan-color), transparent)",
        }}
      />

      {/*  内容层  */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          {iconMap[card.iconKey]}
          <h3 className="text-2xl font-light group-hover:text-white">
            {card.title}
          </h3>
        </div>

        <p className="text-sm text-gray-400   mb-10">{card.subtitle}</p>

        <p
          className={`
            text-sm  leading-relaxed transition-colors duration-300
              text-gray-400 group-hover:text-white
          `}
        >
          {card.description}
        </p>
      </div>
    </div>
  );
}
