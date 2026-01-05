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

      {/* 退出登录/删除账号 */}
      <section className="rounded-3xl p-5  ">
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto  ">
          <AccountDeleteForm />
          <LogoutForm />
        </div>
      </section>
    </div>
  );
}

function UsernameForm({ username }: { username: string }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={async (formData) => {
        setError(null);
        const res = await updateUsernameAction(formData, username);
        if (res?.error) {
          setError(res.error);
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

function LogoutForm() {
  return (
    <form className="flex justify-center" action={logoutAction}>
      <button
        type="submit"
        className="rounded-xl px-6 py-2 bg-orange-600/80 hover:bg-orange-600 transition"
      >
        退出登录
      </button>
    </form>
  );
}

function AccountDeleteForm() {
  return (
    // TODO :deleteAccountAction
    <form className="flex justify-center">
      <button
        type="submit"
        className="rounded-xl px-6 py-2 bg-gray-600/80 hover:bg-gray-600 transition"
      >
        删除账号
      </button>
    </form>
  );
}
