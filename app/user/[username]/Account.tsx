"use client";
import { useState } from "react";
import { logoutAction, updateUsernameAction } from "./AccountServer";

export default function Account({ username }: { username: string }) {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">⚙️ 账户管理</h1>

      {/* 修改个人信息 */}
      <section className="rounded-3xl p-8 bg-white/10 border border-white/10   mx-auto space-y-4">
        <h2 className="text-lg font-semibold text-white/90">个人信息</h2>
        <UsernameForm username={username} />
        <MailForm />
      </section>

      {/* 退出登录/删除账号 */}
      <section className="rounded-3xl p-5   ">
        <div className="grid grid-cols-2 gap-16 max-w-md mx-auto  ">
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
    >
      {inputAndButton("输入新的用户名", "修改")}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}

function MailForm() {
  const [error, setError] = useState<string | null>(null);

  return (
    <form>
      {inputAndButton("TODO:输入新的邮箱地址", "修改")}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}
function LogoutForm() {
  return (
    <form className="flex justify-center" action={logoutAction}>
      <button
        type="submit"
        className="rounded-full px-8 py-3 
        bg-orange-500/50 text-orange-300 hover:bg-orange-500/70 transition"
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
        className="rounded-full px-8 py-3 
        bg-gray-600/60 text-gray-300 hover:bg-gray-600 transition"
      >
        删除账号
      </button>
    </form>
  );
}

function inputAndButton(placeholder: string, buttonText: string) {
  return (
    <div className="flex items-center gap-4">
      <input
        name="input"
        placeholder={placeholder}
        className="flex-1  rounded-full bg-black/30 px-4 py-3 border border-white/10 outline-none"
      />

      <button
        type="submit"
        className="shrink-0 rounded-full px-6 py-3
               bg-purple-400/50 text-white-400
               hover:bg-purple-400  transition"
      >
        {buttonText}
      </button>
    </div>
  );
}
