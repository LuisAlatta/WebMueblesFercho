"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void | Promise<void>;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  onConfirm,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  }

  const Icon = variant === "danger" ? Trash2 : AlertTriangle;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                variant === "danger"
                  ? "bg-red-50 text-red-500"
                  : "bg-amber-50 text-amber-500"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-[#1C1C1E]">{title}</DialogTitle>
              {description && (
                <DialogDescription className="text-[#7A7A7A]">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 sm:flex-initial"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 sm:flex-initial ${
              variant === "danger"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white"
            }`}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook para simplificar el uso
export function useConfirmDialog() {
  const [state, setState] = useState<{
    open: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    variant?: "danger" | "default";
    onConfirm: () => void | Promise<void>;
  }>({
    open: false,
    title: "",
    onConfirm: () => {},
  });

  function confirm(opts: {
    title: string;
    description?: string;
    confirmLabel?: string;
    variant?: "danger" | "default";
    onConfirm: () => void | Promise<void>;
  }) {
    setState({ ...opts, open: true });
  }

  const dialogProps: ConfirmDialogProps = {
    ...state,
    onOpenChange: (open) => setState((s) => ({ ...s, open })),
  };

  return { confirm, dialogProps };
}
