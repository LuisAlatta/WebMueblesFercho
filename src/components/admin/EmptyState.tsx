"use client";

import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  size?: "sm" | "md" | "lg";
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  size = "md",
}: EmptyStateProps) {
  const sizes = {
    sm: { py: "py-10", iconBox: "w-12 h-12 rounded-xl", icon: "w-5 h-5" },
    md: { py: "py-14", iconBox: "w-14 h-14 rounded-2xl", icon: "w-6 h-6" },
    lg: { py: "py-20", iconBox: "w-16 h-16 rounded-2xl", icon: "w-7 h-7" },
  }[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`bg-white rounded-2xl border border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] px-6 ${sizes.py} flex flex-col items-center text-center`}
    >
      <div
        className={`${sizes.iconBox} bg-gradient-to-br from-[#FAF9F7] to-white border border-[#C9A96E]/20 flex items-center justify-center mb-4 shadow-sm`}
      >
        <Icon className={`${sizes.icon} text-[#C9A96E]`} />
      </div>
      <p className="font-semibold text-[#1C1C1E] text-sm">{title}</p>
      {description && (
        <p className="text-sm text-slate-500 mt-1.5 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Link
            href={actionHref}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white px-4 h-9 rounded-lg transition-colors shadow-sm"
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white px-4 h-9 rounded-lg transition-colors shadow-sm"
          >
            {actionLabel}
          </button>
        )
      )}
    </motion.div>
  );
}
