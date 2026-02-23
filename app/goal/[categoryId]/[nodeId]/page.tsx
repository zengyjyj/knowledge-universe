"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getGoalsByNodeId } from "@/data/queries/goal";
import { Goal } from "@/data/types/database";
import { useSearchParams, useParams } from "next/navigation";
import StarfieldBackground from "@/components/starfieldBackground";
import { Link as LinkIcon, BookOpen, CalendarRange } from "lucide-react";
import { Community } from "@/components/expansion/Community";
import { QuickQA, QuickGoalQA } from "@/components/expansion/QuickQA";

export default function GoalPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const categoryId = Number(params?.categoryId);
  const nodeId = Number(params?.nodeId);
  const difficultyFromUrl = searchParams.get("difficulty");

  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");

  useEffect(() => {
    async function fetchGoals() {
      const data = await getGoalsByNodeId(nodeId);
      setGoals(data);

      if (data.length > 0) {
        setSelectedDifficulty(difficultyFromUrl ?? data[0].difficulty);
      }
    }

    if (nodeId) fetchGoals();
  }, [nodeId, difficultyFromUrl]);

  const currentGoal = goals.find((g) => g.difficulty === selectedDifficulty);

  if (!currentGoal) {
    return <div className="text-white p-10">Loading...</div>;
  }

  const descriptionBlocks = structuredDescriptionContent(
    currentGoal.description ?? "",
  );

  const infoContent = structuredInfoContent(currentGoal.information ?? "");

  return (
    <div className="relative w-full overflow-hidden">
      <StarfieldBackground />

      <div className="relative z-10 text-white w-screen px-20 py-10">
        {/* 返回 */}
        <Link
          href={`/goal/${categoryId}`}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-8"
        >
          <ArrowLeft size={18} />
          返回
        </Link>

        <div className="max-w-3xl mx-auto pt-10">
          {/* 标题 + 难度 */}
          <div className="flex items-center justify-between">
            <h1 className="text-5xl font-light">{currentGoal.title}</h1>

            {/* 难度按钮 */}
            <div className="flex gap-3">
              <DifficultyButtons
                goals={goals}
                selectedDifficulty={selectedDifficulty}
                onSelect={setSelectedDifficulty}
              />
            </div>
          </div>

          {/* introduction */}
          {currentGoal.introduction && (
            <div className="mt-6">
              <p
                className="
                  relative text-gray-500 pl-4
                  leading-relaxed"
              >
                <span
                  className="
                    absolute left-0 top-1 bottom-1 w-[2px]
                    bg-gradient-to-b from-emerald-700 to-emerald-900/50"
                />
                {currentGoal.introduction}
              </p>

              {/* period  */}
              {currentGoal.period && (
                <div className="mt-4 pl-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
                    <CalendarRange className="w-5 h-5 text-emerald-800" />
                    <span>学习周期：{currentGoal.period}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* description */}
          <div className="grid grid-cols-1 gap-4 mt-14">
            {descriptionBlocks.map((block, index) => (
              <GoalDescription key={index} block={block} />
            ))}
          </div>

          {/* information */}
          <GoalInformation infoContent={infoContent} />

          {/* expansion placeholder */}
          <div className="grid gap-6 mt-10">
            {/* 社区 */}
            <Community />
          </div>

          <div className="flex items-center gap-3 mt-10 ">
            <span className="w-2 h-2 rounded-full bg-gray-500" />
            <h3 className="text-sm  text-gray-500 tracking-wide">下一步行动</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            {/* TODO node */}
            <QuickQA />
            {/* 即问即答 */}
            <QuickGoalQA />
          </div>
        </div>
      </div>
    </div>
  );
}

const difficultyLabelMap: Record<string, string> = {
  beginner: "入门",
  intermediate: "进阶",
  advanced: "高级",
};

type StructuredLine =
  | { type: "paragraph"; text: string }
  | { type: "number"; text: string };

type DescriptionBlock = {
  title: string;
  content: StructuredLine[];
};

type StructuredInfoContent = {
  links: StructuredLine[];
  books: StructuredLine[];
};

function DifficultyButtons({
  goals,
  selectedDifficulty,
  onSelect,
}: {
  goals: Goal[];
  selectedDifficulty: string;
  onSelect: (difficulty: string) => void;
}) {
  const difficulties = Array.from(new Set(goals.map((g) => g.difficulty)));

  return (
    <div className="flex gap-3">
      {difficulties.map((difficulty) => (
        <button
          key={difficulty}
          onClick={() => onSelect(difficulty)}
          className={`
            px-4 py-1.5 rounded-full text-xs
            border border-white/10
            backdrop-blur
            transition-all duration-300
            ${
              selectedDifficulty === difficulty
                ? "bg-white/20 text-white scale-105"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }
          `}
        >
          {difficultyLabelMap[difficulty] ?? difficulty}
        </button>
      ))}
    </div>
  );
}

function GoalDescription({ block }: { block: DescriptionBlock }) {
  return (
    <div className="rounded-2xl p-5 bg-white/5 border border-white/5">
      <div className="text-lg text-white/80 font-base">{block.title}</div>

      <div className="text-sm text-gray-400 mt-3 space-y-2 ml-2 mr-2">
        {block.content.map((line, index) => (
          <div key={index}>
            {line.type === "number" ? (
              <div className="flex gap-3">
                <span className="text-gray-400 w-5 text-right">
                  {line.text.split(".")[0]}.
                </span>
                <span>{line.text.replace(/^\d+\.\s*/, "")}</span>
              </div>
            ) : (
              <div>{line.text}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalInformation({
  infoContent,
}: {
  infoContent: StructuredInfoContent;
}) {
  const hasLinks = infoContent.links.length > 0;
  const hasBooks = infoContent.books.length > 0;

  if (!hasLinks && !hasBooks) return null;

  return (
    <div className="rounded-2xl p-5 bg-white/5 border border-white/5 mt-4">
      <div className="text-lg text-white/80 font-base">参考资料 :</div>
      <div className="space-y-1.5 text-sm text-gray-400 mt-2 ml-3  ">
        {/* Links */}
        {hasLinks &&
          infoContent.links.map((item, index) => (
            <div
              key={`link-${index}`}
              className="flex items-center gap-3 hover:text-white transition"
            >
              <LinkIcon className="w-4 h-4 text-blue-400" />
              <span>{item.text}</span>
            </div>
          ))}

        {/* Books */}
        {hasBooks &&
          infoContent.books.map((item, index) => (
            <div
              key={`book-${index}`}
              className="flex items-center gap-3 hover:text-white transition"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>{item.text}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

function structuredDescriptionContent(content: string): DescriptionBlock[] {
  const blocks = content
    .split("<<<>>>")
    .map((b) => b.trim())
    .filter(Boolean);

  const result: DescriptionBlock[] = [];

  for (let i = 0; i < blocks.length; i += 2) {
    result.push({
      title: blocks[i],
      content: structuredLines(blocks[i + 1] ?? ""),
    });
  }

  return result;
}

function structuredInfoContent(content: string): StructuredInfoContent {
  const parts = content
    .split("<<<>>>")
    .map((b) => b.trim())
    .filter(Boolean);

  const result: StructuredInfoContent = {
    links: structuredLines(parts[0] ?? ""),
    books: structuredLines(parts[1] ?? ""),
  };

  return result;
}

function structuredLines(content: string): StructuredLine[] {
  const lines = content.split("\n");
  let numberIndex = 1;

  return lines.map((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      return { type: "paragraph" as const, text: "" };
    }

    if (line.startsWith("#")) {
      const text = line.replace(/^#\s*/, "");
      const result = {
        type: "number" as const,
        text: `${numberIndex}. ${text}`,
      };
      numberIndex++;
      return result;
    }

    const result: StructuredLine = {
      type: "paragraph",
      text: line,
    };

    return result;
  });
}
