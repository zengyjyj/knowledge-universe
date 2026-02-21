"use client";

import StarfieldBackground from "@/components/starfieldBackground";
import { useEffect, useState } from "react";

export default function AskPage() {
  const [goalText, setGoalText] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);

  useEffect(() => {
    const storedGoal = sessionStorage.getItem("aiAsk_goalText");
    const storedLevel = sessionStorage.getItem("aiAsk_level");

    if (storedGoal) setGoalText(storedGoal);
    if (storedLevel) setLevel(storedLevel);
  }, []);
  return (
    <div className="relative text-white overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-radial-space" />
      <StarfieldBackground />

      {/* 内容 */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-2xl shadow-xl">
          <h1 className="text-3xl font-light mb-4">🎯 Goal TODO</h1>

          <p className="text-xl text-white/90 mb-2">Quesetion: {goalText}</p>
          <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-sm text-white/70">
            Level: {level}
          </div>
        </div>
      </main>
    </div>
  );
}
