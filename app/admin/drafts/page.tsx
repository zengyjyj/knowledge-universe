"use client";

import { useEffect, useState } from "react";

export default function AdminDraftsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/drafts"); //获取所有 pending 草稿
    const data = await res.json();
    setItems(data.data ?? []);
    setLoading(false);
  }

  async function act(id: string, action: "approve" | "reject") {
    await fetch(`/api/admin/drafts/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Draft 审核</h1>
      {loading && <div>加载中...</div>}

      <div className="space-y-4">
        {items.map((d) => (
          <div key={d.id} className="border rounded p-4">
            <div className="text-sm text-gray-500">{d.id}</div>
            <div className="mt-2">
              <div className="font-semibold">用户问题</div>
              <div>{d.user_question}</div>
            </div>

            <div className="mt-3">
              <div className="font-semibold">AI 结果</div>
              <pre className="text-sm bg-gray-50 p-2 rounded overflow-auto">
                {JSON.stringify(d.ai_json, null, 2)}
              </pre>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                className="border rounded px-3 py-1"
                onClick={() => act(d.id, "approve")}
              >
                ✅ 通过
              </button>
              <button
                className="border rounded px-3 py-1"
                onClick={() => act(d.id, "reject")}
              >
                ❌ 拒绝
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
