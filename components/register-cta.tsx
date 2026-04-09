"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthDialog } from "@/components/auth-dialog";
import { registerForClassAction } from "@/app/(platform)/classes/[id]/actions";

export function RegisterCTA({
  classId,
  classTitle,
  isFull = false,
  isLoggedIn = false,
  isRegistered = false,
}: {
  classId: string;
  classTitle: string;
  isFull?: boolean;
  isLoggedIn?: boolean;
  isRegistered?: boolean;
}) {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(isRegistered);
  const [error, setError] = useState<string | null>(null);

  if (isFull && !registered) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-full bg-gray-100 px-8 py-4 text-base font-medium text-gray-400"
      >
        Class is full
      </button>
    );
  }

  if (registered) {
    return (
      <div className="w-full rounded-full bg-green-50 px-4 py-4 text-center text-base font-medium text-green-700 border border-green-200">
        You're registered!
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <AuthDialog
          open={authOpen}
          onOpenChange={setAuthOpen}
          defaultMode="signup"
          onSuccess={() => router.refresh()}
        />
        <button
          onClick={() => setAuthOpen(true)}
          className="w-full cursor-pointer rounded-full bg-[#C94256] px-4 py-4 text-base font-medium text-white transition-all hover:bg-[#a33045]"
        >
          Sign up to register
        </button>
      </>
    );
  }

  const handleRegister = async () => {
    setRegistering(true);
    setError(null);
    const result = await registerForClassAction(classId);
    setRegistering(false);
    if (result.success) {
      setRegistered(true);
      router.refresh();
      toast.success("You're registered!");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleRegister}
        disabled={registering}
        className="w-full cursor-pointer rounded-full bg-[#C94256] px-8 py-4 text-base font-medium text-white transition-all hover:bg-[#a33045] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {registering ? "Registering..." : `Register`}
      </button>
      {error && <p className="text-center text-xs text-red-600">{error}</p>}
    </div>
  );
}
