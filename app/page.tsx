"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Compass, Target, MessageCircle } from "lucide-react";
import StarfieldBackground from "@/components/starfieldBackground";

export default function HomePage() {
  const router = useRouter();
  const [hover, setHover] = useState<number | null>(null);
  const cards = [
    {
      id: 1,
      title: "Explore",
      subtitle: "探索模式",
      description: "自由浏览结构化知识网络，发现意想不到的关联与洞见。",
      icon: <Compass className="w-6 h-6 text-blue-400" />,
      route: "/explore",
      borderColor:
        "hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.8)]",
    },
    {
      id: 2,
      title: "Path",
      subtitle: "目标模式",
      description: "围绕你的目标生成循序渐进的学习路径。",
      icon: <Target className="w-6 h-6 text-green-400" />,
      route: "/goal",
      borderColor:
        "hover:border-green-400 hover:shadow-[0_0_20px_rgba(74,222,128,0.8)]",
    },
    {
      id: 3,
      title: "Ask",
      subtitle: "即问即答",
      description: "随时发问，获得结构化的即时知识卡与解释。",
      icon: <MessageCircle className="w-6 h-6 text-purple-400" />,
      route: "/ask",
      borderColor:
        "hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.8)]",
    },
  ];

  return (
    <div className="relative z-10 text-white  ">
      <div>
        {/* 背景渐变 */}
        <div className="bg-radial-space" />
        {/* 网格 */}
        <div className="bg-tech-grid" />
        <StarfieldBackground />
      </div>

      {/* 页面内容 */}
      <main className="relative z-10 w-full mx-auto px-6  ">
        <div className="flex flex-col items-center ">
          <section className="text-center mt-[20vh] mb-24">
            <h1 className="text-5xl md:text-8xl font-thin mb-8 animate-fade-in tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]">
              让世界变得清晰
            </h1>
            <p className="mt-6 text-lg text-gray-400 tracking-widest">
              结构化探索 · 目标学习路径 · AI 即时知识卡
            </p>
          </section>
          {/* 卡片区 */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => router.push(card.route)}
                onMouseEnter={() => setHover(card.id)}
                onMouseLeave={() => setHover(null)}
                className={`
                group cursor-pointer p-6 rounded-2xl 
                bg-white/5 border border-white/10 backdrop-blur 
                shadow-[inset_0_0_8px_rgba(255,255,255,0.05)] 
                transition-all duration-300
                ${
                  hover === card.id
                    ? `  border-white/40  shadow-[0_0_25px_rgba(255,255,255,0.25)] scale-[1.03]  bg-white/10    ${card.borderColor}   `
                    : ""
                }
              `}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  {card.icon}
                  <h3 className="text-2xl font-light group-hover:text-white">
                    {card.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-400 text-center mb-8">
                  {card.subtitle}
                </p>
                <p
                  className={`
                text-sm   leading-relaxed transition-colors duration-300
                ${hover === card.id ? "text-white" : "text-gray-400"} 
              `}
                >
                  {card.description}
                </p>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
