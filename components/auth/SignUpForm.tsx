"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp, getCurrentProfile } from "@/data/queries/profiles";
import { authErrorMap } from "./authErrorMap";
import { AuthErrorCode } from "@/data/authErrors";
import { Mail, Lock, UserPen, ShieldCheck } from "lucide-react";

const inputBase =
  "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 outline-none transition";

const inputFocus =
  "focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20";

export default function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (loading) return;

    setError(null);
    setLoading(true);
    setSuccess(false);

    if (!email || !password || !confirmPassword) {
      setError("请输入邮箱和密码");
      setLoading(false);
      return;
    }

    while (password != confirmPassword) {
      setError("两次输入的密码不一致");
      setLoading(false);
      return;
    }

    try {
      await signUp({ email, password });

      setSuccess(true);
    } catch (e: any) {
      const code = e.message ?? AuthErrorCode.UNKNOWN_ERROR;
      setError(authErrorMap[code] ?? authErrorMap.UNKNOWN_ERROR);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-3"
    >
      <div className="relative">
        <Mail
          className="absolute left-4 top-1/2 -translate-y-1/2
               w-5 h-5 text-white/40 pointer-events-none"
        />
        <input
          className={`${inputBase} ${inputFocus} pl-11`}
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="relative">
        <Lock
          className="absolute left-4 top-1/2 -translate-y-1/2
               w-5 h-5 text-white/40 pointer-events-none"
        />
        <input
          className={`${inputBase} ${inputFocus} pl-11`}
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="relative">
        <ShieldCheck
          className="absolute left-4 top-1/2 -translate-y-1/2
               w-5 h-5 text-white/40 pointer-events-none"
        />
        <input
          className={`${inputBase} ${inputFocus} pl-11`}
          type="password"
          placeholder="确认密码"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`mt-4 w-full rounded-xl py-3 font-medium transition
          ${
            loading
              ? "bg-blue-500/40 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-400"
          }`}
      >
        {loading ? "注册中…" : "注册"}
      </button>

      {success && (
        <div className="mt-4 rounded-xl bg-blue-500/10 border border-blue-400/20 p-4 text-sm text-blue-200">
          📧 注册成功！
          <br />
          请前往邮箱完成验证后重新登录。
        </div>
      )}
    </form>
  );
}
