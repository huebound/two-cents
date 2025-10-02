"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type RegisterConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
};

export function RegisterConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting = false,
}: RegisterConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registration confirmed</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          You&apos;re in! We&apos;ll see you at the class.
        </p>
        <DialogFooter>
          <Button onClick={onConfirm} disabled={isSubmitting} className="w-full sm:w-auto">
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RegisterConfirmDialog;
