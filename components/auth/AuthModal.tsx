"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import StarfieldBackground from "../starfieldBackground";

export default function AuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* 星空 */}
      <StarfieldBackground />

      {/* Modal */}
      <div
        className="relative z-50 w-full max-w-md rounded-2xl
                   bg-white/10 backdrop-blur-xl
                   border border-white/15
                   shadow-2xl px-8 py-6"
      >
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-lg text-sm transition
              ${
                mode === "login"
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:text-white"
              }`}
          >
            登录
          </button>

          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded-lg text-sm transition
              ${
                mode === "signup"
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:text-white"
              }`}
          >
            注册
          </button>
        </div>

        {/* Form */}
        {mode === "login" ? (
          <LoginForm onSuccess={onClose} />
        ) : (
          <SignUpForm onSuccess={onClose} />
        )}
      </div>
    </div>
  );
}
