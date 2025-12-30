"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentProfile } from "@/data/queries/profiles";
import AuthModal from "@/components/auth/AuthModal";

export default function UserEntryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    async function check() {
      const profile = await getCurrentProfile();
      console.log(profile);
      if (!profile) {
        setShowAuth(true);
      } else {
        router.replace(`/app/user/${profile.username}`);
      }

      setLoading(false);
    }

    check();
  }, [router]);

  if (loading) return null;

  return (
    <>
      {showAuth && <AuthModal open={true} onClose={() => setShowAuth(false)} />}
    </>
  );
}
