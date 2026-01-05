"use client";
import { useState } from "react";
import { logoutAction, updateUsernameAction } from "./AccountServer";

export default function Account({ username }: { username: string }) {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">⚙️ 账户管理</h1>

      {/* 修改用户名 */}
      <section className="rounded-3xl p-6 bg-white/10 border border-white/10 space-y-4">
        <h2 className="text-lg font-semibold">修改用户名</h2>
        <UsernameForm username={username} />
      </section>

      {/* 退出登录 */}
      <section className="relative rounded-3xl p-6  ">
        <form action={logoutAction} className="absolute bottom-6 right-6">
          <button
            type="submit"
            className="rounded-xl px-4 py-2 bg-red-600/80 hover:bg-red-600 transition"
          >
            退出登录
          </button>
        </form>
      </section>
    </div>
  );
}

function UsernameForm({ username }: { username: string }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={async (formData) => {
        try {
          setError(null);
          await updateUsernameAction(formData, username);
        } catch (e: any) {
          setError(e.message);
        }
      }}
      className="space-y-2 max-w-md"
    >
      <div className="flex items-center gap-3">
        <input
          name="newUsername"
          placeholder="新的用户名"
          className="flex-1 rounded-xl bg-black/30 px-4 py-2 border border-white/10 outline-none"
        />

        <button
          type="submit"
          className="shrink-0 rounded-xl px-4 py-2 bg-purple-600 hover:bg-purple-500 transition"
        >
          保存修改
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}
