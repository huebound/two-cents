"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RegisterConfirmDialog } from "@/components/register-confirm-dialog";
import { registerForClassAction } from "./actions";

type RegisterButtonProps = {
  classId: string;
  isRegistered: boolean;
  isFull: boolean;
};

export function RegisterButton({ classId, isRegistered, isFull }: RegisterButtonProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRegister = () => {
    if (isRegistered || isFull || isPending) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await registerForClassAction(classId);

      if (result.success) {
        setIsDialogOpen(true);
      } else {
        setError(result.error);
      }
    });
  };

  const handleDialogConfirm = () => {
    setIsDialogOpen(false);
    router.push("/home");
  };

  const buttonLabel = isRegistered
    ? "Registered"
    : isFull
      ? "Class Full"
      : isPending
        ? "Registering…"
        : "Register";

  return (
    <div className="space-y-3">
      <Button
        onClick={handleRegister}
        disabled={isRegistered || isFull || isPending}
        className="w-full sm:w-auto"
      >
        {buttonLabel}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <RegisterConfirmDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleDialogConfirm}
      />
    </div>
  );
}

export default RegisterButton;
