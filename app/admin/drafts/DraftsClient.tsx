"use client";

import { useState, useEffect, useRef } from "react";
import { removeDraft, publishDraft, logoutAction } from "./actions";

import StarfieldBackground from "@/components/starfieldBackground";
import { useRouter } from "next/navigation";

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

  const [mode, setMode] = useState<"node" | "goal" | "setting">("node");

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

        {/*TODO:goal draft */}
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
            setDrafts={setDrafts}
          />
        )}
        {mode === "setting" && <SettingSection />}
      </main>
    </div>
  );
}

function SwitchModeButton({
  mode,
  onChange,
}: {
  mode: "node" | "goal" | "setting";
  onChange: (mode: "node" | "goal" | "setting") => void;
}) {
  const tabs = [
    { key: "node", label: "知识卡片 Node" },
    { key: "goal", label: "学习计划 Goal" },
    { key: "setting", label: "设置 Setting" },
  ] as const;

  return (
    <div className="flex items-center gap-8 border-b mt-3 ml-4 mr-4 border-white/20">
      {tabs.map((tab) => {
        const active = mode === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="relative pb-3 text-sm transition-colors"
          >
            <span
              className={
                active ? "text-white" : "text-gray-400 hover:text-gray-200"
              }
            >
              {tab.label}
            </span>

            {/* 下划线 */}
            {active && (
              <div
                className="
                absolute left-0 bottom-0
                w-full h-[2px]
                bg-white
                rounded
              "
              />
            )}
          </button>
        );
      })}
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
  setDrafts,
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
  setDrafts: React.Dispatch<React.SetStateAction<Draft[]>>;
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

  function updateDraftField(id: number, field: string, value: string) {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
    );
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
                  onChange={(val) =>
                    updateDraftField(draft.id, "definition", val)
                  }
                />

                {/* 问题 */}
                <FormTextareaField
                  label="问题："
                  value={draft.question}
                  onChange={(val) =>
                    updateDraftField(draft.id, "question", val)
                  }
                />

                {/* AI 回答 */}
                <FormTextareaField
                  label="AI 回答："
                  value={draft.ai_answer}
                  onChange={(val) =>
                    updateDraftField(draft.id, "ai_answer", val)
                  }
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
                        setDrafts((prev) =>
                          prev.map((d) =>
                            d.id === draft.id
                              ? { ...d, subcategory_name: sub.title }
                              : d,
                          ),
                        );
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
  }, [value]);

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

function SettingSection() {
  return (
    <form className="flex" action={logoutAction}>
      <button
        type="submit"
        className="
        rounded-full px-8 py-3 
        bg-orange-500/50 text-orange-300 
        hover:bg-orange-500/70 transition"
      >
        退出登录
      </button>
    </form>
  );
}
