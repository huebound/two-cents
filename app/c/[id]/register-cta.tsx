"use client";

import { useState } from "react";
import { AuthDialog } from "@/components/auth-dialog";

export function RegisterCTA({
  classTitle,
  isFull = false,
}: {
  classTitle: string;
  isFull?: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (isFull) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-full bg-gray-100 px-8 py-4 text-base font-semibold text-gray-400"
      >
        Class is full
      </button>
    );
  }

  return (
    <>
      <AuthDialog open={open} onOpenChange={setOpen} />
      <button
        onClick={() => setOpen(true)}
        className="w-full cursor-pointer rounded-full bg-[#F6DE27] px-8 py-4 text-base font-semibold text-black transition-colors hover:bg-[#DFC711]"
      >
        Register for this class
      </button>
    </>
  );
}
