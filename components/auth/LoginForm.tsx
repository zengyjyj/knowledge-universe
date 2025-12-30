"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/data/queries/profilesBrowser";
import { authErrorMap } from "./authErrorMap";
import { AuthErrorCode } from "@/data/authErrors";
import { Mail, Lock } from "lucide-react";
const inputBase =
  "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 outline-none transition";

const inputFocus =
  "focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20";

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("请输入邮箱和密码");
      setLoading(false);
      return;
    }

    try {
      await login({ email, password });
      onSuccess();
      router.refresh();
      console.log("component/auth/loginForm login succes");
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

      {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
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
        {loading ? "登录中…" : "登录"}
      </button>
    </form>
  );
}
