"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  optional,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <div className="flex items-baseline justify-between gap-2">
          <Label
            htmlFor={htmlFor}
            className="text-xs font-medium text-slate-700"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </Label>
          {optional && (
            <span className="text-[11px] text-slate-400">Opcional</span>
          )}
        </div>
      )}
      {children}
      {error ? (
        <div className="flex items-start gap-1.5 text-xs text-red-600 mt-1">
          <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : hint ? (
        <p className="text-[11px] text-slate-500 leading-relaxed">{hint}</p>
      ) : null}
    </div>
  );
}
