"use client";

import { useState, useEffect, useRef } from "react";
import { removeDraft, publishDraft } from "./actions";

import StarfieldBackground from "@/components/starfieldBackground";

type Draft = {
  id: number;
  title: string;
  definition: string;
  question: string;
  ai_answer: string;
  subcategory_name: string | null;
  created_at: string;
};

type Subcategory = {
  id: number;
  title: string;
};

export default function DraftsClient({
  initialDrafts,
  subcategories,
}: {
  initialDrafts: Draft[];
  subcategories: Subcategory[];
}) {
  const [drafts, setDrafts] = useState(initialDrafts);
  const [activeDraftId, setActiveDraftId] = useState<number | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState<"node" | "goal">("node");

  async function handlePublish(draft: Draft) {
    if (!selectedSubcategoryId) {
      alert("请选择 subcategory");
      return;
    }

    setLoading(true);

    await publishDraft({
      draftId: draft.id,
      title: draft.title,
      definition: draft.definition,
      question: draft.question,
      ai_answer: draft.ai_answer,
      subcategoryName: draft.subcategory_name || "",
      subcategoryId: selectedSubcategoryId,
    });

    setDrafts(drafts.filter((d) => d.id !== draft.id));
    setActiveDraftId(null);
    setLoading(false);
  }

  async function handleDelete(draft: Draft) {
    setLoading(true);
    await removeDraft(draft.id);
    setDrafts(drafts.filter((d) => d.id !== draft.id));
    setActiveDraftId(null);
    setLoading(false);
  }

  return (
    <div className="relative z-10 text-white">
      <StarfieldBackground />

      <main className="relative   z-10 w-full mx-auto px-6">
        {/* 顶部切换按钮 */}
        <div className="mb-8">
          <SwitchModeButton mode={mode} onChange={setMode} />
        </div>

        {/* 如果以后做 goal draft，这里可以切换组件 */}
        {mode === "node" && (
          <NodeDraftSection
            drafts={drafts}
            subcategories={subcategories}
            activeDraftId={activeDraftId}
            setActiveDraftId={setActiveDraftId}
            selectedSubcategoryId={selectedSubcategoryId}
            setSelectedSubcategoryId={setSelectedSubcategoryId}
            loading={loading}
            onPublish={handlePublish}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}

function SwitchModeButton({
  mode,
  onChange,
}: {
  mode: "node" | "goal";
  onChange: (mode: "node" | "goal") => void;
}) {
  return (
    <div
      onClick={() => onChange(mode === "node" ? "goal" : "node")}
      className="
        relative flex items-center  w-64 h-11 mt-5
        rounded-full  bg-white/5 border border-white/15
        backdrop-blur   cursor-pointer select-none
      "
    >
      {/* 滑块 */}
      <div
        className="
          absolute top-1 left-1
          h-9 w-[calc(50%-4px)]
          rounded-full
          transition-all duration-300 ease-out
        "
        style={{
          transform: mode === "node" ? "translateX(0)" : "translateX(100%)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.15))",
          boxShadow:
            "0 8px 20px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.4)",
        }}
      />

      {/* 左：Node Draft */}
      <div className="relative z-10 flex-1 flex items-center justify-center gap-1 text-sm">
        <span
          className={`transition-colors ${
            mode === "node" ? "text-white" : "text-gray-400"
          }`}
        >
          知识卡片Node
        </span>
      </div>

      {/* 右：Goal Draft */}
      <div className="relative z-10 flex-1 flex items-center justify-center gap-1 text-sm">
        <span
          className={`transition-colors ${
            mode === "goal" ? "text-white" : "text-gray-400"
          }`}
        >
          学习计划Goal
        </span>
      </div>
    </div>
  );
}

function NodeDraftSection({
  drafts,
  subcategories,
  activeDraftId,
  setActiveDraftId,
  selectedSubcategoryId,
  setSelectedSubcategoryId,
  loading,
  onPublish,
  onDelete,
}: {
  drafts: any[];
  subcategories: any[];
  activeDraftId: number | null;
  setActiveDraftId: (id: number | null) => void;
  selectedSubcategoryId: number | null;
  setSelectedSubcategoryId: (id: number | null) => void;
  loading: boolean;
  onPublish: (draft: any) => void;
  onDelete: (draft: any) => void;
}) {
  function toggleDraft(draft: any) {
    if (activeDraftId === draft.id) {
      setActiveDraftId(null);
      return;
    }

    setActiveDraftId(draft.id);

    const matched = subcategories.find(
      (s) => s.title === draft.subcategory_name,
    );

    setSelectedSubcategoryId(matched?.id || null);
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {drafts.map((draft) => {
        const isActive = activeDraftId === draft.id;

        return (
          <div key={draft.id} className="border border-white/10 rounded-lg">
            {/* 标题行 */}
            <div
              onClick={() => toggleDraft(draft)}
              className="  p-4 cursor-pointer hover:bg-white/5   flex justify-between items-center"
            >
              <span>{draft.title}</span>

              {/* 箭头 */}
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  isActive ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>

            {isActive && (
              <div className="p-6 space-y-6 border-t border-white/10 bg-white/5">
                {/* 定义 */}
                <FormTextareaField
                  label="定义："
                  value={draft.definition}
                  onChange={(val) => (draft.definition = val)}
                />

                {/* 问题 */}
                <FormTextareaField
                  label="问题："
                  value={draft.question}
                  onChange={(val) => (draft.question = val)}
                />

                {/* AI 回答 */}
                <FormTextareaField
                  label="AI 回答："
                  value={draft.ai_answer}
                  onChange={(val) => (draft.ai_answer = val)}
                />

                {/* 分类 */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 tracking-wide">
                    三级分类名字 ：
                  </label>
                  <select
                    className="
                    w-full bg-black/40 p-3 rounded
                    focus:outline-none focus:ring-2 focus:ring-white/20
                    transition
                    "
                    value={selectedSubcategoryId || ""}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      const sub = subcategories.find((s) => s.id === id);

                      setSelectedSubcategoryId(id);

                      if (sub) {
                        draft.subcategory_name = sub.title;
                      }
                    }}
                  >
                    <option value="">请选择 subcategory</option>
                    {subcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 按钮 */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => onPublish(draft)}
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 rounded"
                  >
                    发布
                  </button>

                  <button
                    onClick={() => onDelete(draft)}
                    disabled={loading}
                    className="px-6 py-2 bg-red-600 rounded"
                  >
                    删除
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FormTextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }, [value]); // 👈 每次 value 变化都会重新计算高度

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400 tracking-wide">{label}</label>

      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full bg-black/40 p-3 rounded
          resize-none overflow-hidden
          focus:outline-none focus:ring-2 focus:ring-white/30
          transition border border-white/20
        "
      />
    </div>
  );
}
