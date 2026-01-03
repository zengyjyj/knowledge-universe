"use client";

import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

export default function AuthModalClient() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
