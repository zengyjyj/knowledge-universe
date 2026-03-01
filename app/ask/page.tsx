"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, CircleUserRound } from "lucide-react";
import StarfieldBackground from "@/components/starfieldBackground";

type Message =
  | { role: "user"; content: string }
  | { role: "assistant"; content: AIContent };

type AIContent = {
  title: string;
  definition: string;
  detail?: string[];
};

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function onAsk() {
    if (!question.trim()) return;

    const userQuestion = question;
    setQuestion("");
    setError(null);

    // 添加用户问题
    setMessages((prev) => [...prev, { role: "user", content: userQuestion }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "request failed");

      // 添加 AI 回答
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: {
            title: data.title,
            definition: data.definition,
            detail:
              typeof data.detail === "string"
                ? data.detail
                    .split("<<<>>>")
                    .map((b: string) => b.trim())
                    .filter(Boolean)
                : [],
          },
        },
      ]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative  text-white overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-radial-space" />
      <StarfieldBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-10 pb-40">
        {/* 标题 */}
        <h1 className="text-4xl text-center bg-gradient-to-r from-white to-purple-500 bg-clip-text text-transparent">
          有什么想问的？ 即刻获取答案
        </h1>
        <p className="mt-3 text-sm text-white/50 text-center">
          输入任何问题，AI 将为你构建结构化的知识图谱与核心要点。
        </p>

        {/* 对话区域 */}
        <div className="mt-10 flex flex-col gap-5 max-w-3xl mx-auto">
          {/*  固定欢迎消息  */}
          <AIMessage
            animate
            content="你好！我是你的 AI 知识助手。 有什么想了解的吗？我可以为你解析复杂概念， 生成清晰的知识卡片。"
          />

          {/* ===== 动态消息 ===== */}
          {messages.map((msg, index) =>
            msg.role === "user" ? (
              <UserMessage key={index} content={msg.content} />
            ) : (
              <AIMessage key={index} content={msg.content} />
            ),
          )}

          {loading && <AIMessage content="AI 正在生成......" />}

          {error && <div className="text-red-400">{error}</div>}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* 底部输入框 */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-6 pb-8">
        <div className="max-w-3xl mx-auto relative">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAsk()}
            placeholder="输入你的问题..."
            className="w-full bg-black/40 backdrop-blur-xl 
                      border border-blue-500/30 focus:border-blue-500/80
                      outline-none rounded-2xl py-4 px-6 pr-16 text-white placeholder-white/40"
          />

          <button
            onClick={onAsk}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AIMessage({
  content,
  animate = false,
}: {
  content: AIContent | string;
  animate?: boolean;
}) {
  const isSimpleText = typeof content === "string";
  console.log(content);

  return (
    <div className={`flex justify-start ${animate ? "animate-fade-up" : ""}`}>
      <div className="flex items-center gap-3 max-w-[80%]">
        {/* AI Icon */}
        <div className="w-9 h-9  shrink-0 flex-none rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
          <Bot size={18} className="text-white" />
        </div>

        {/* 气泡 */}
        <div className="bg-white-500/10 border border-purple-600/30 rounded-2xl px-3 py-3 text-white/80  ">
          {isSimpleText ? (
            content
          ) : (
            <>
              <div className="font-semibold ">{content.title}:</div>
              <div className="text-white/80 mb-2 whitespace-pre-line leading-relaxed">
                {content.definition}
              </div>

              {content.detail && content.detail.length > 0 && (
                <div className="mt-2 space-y-2">
                  {content.detail.map((_, i) => {
                    if (i % 2 !== 0) return null;

                    const heading = content.detail[i];
                    const body = content.detail[i + 1];

                    return (
                      <div key={i}>
                        <div className="font-semibold text-white/80">
                          • {heading}
                        </div>
                        <div className="text-white/70 leading-relaxed ml-3">
                          {body}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="flex items-center gap-3 max-w-[80%]">
        {/* 气泡 */}
        <div className="bg-blue-600/10 border border-blue-600/20 rounded-2xl px-3 py-3  text-white/80 backdrop-blur-xl">
          {content}
        </div>

        {/* User Icon */}
        <div className="w-9 h-9 shrink-0 flex-none rounded-full bg-blue-500 flex items-center justify-center">
          <CircleUserRound size={18} className="text-white" />
        </div>
      </div>
    </div>
  );
}
