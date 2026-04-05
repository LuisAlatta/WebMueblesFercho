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
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-100 px-6 py-14 flex flex-col items-center text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#FAF9F7] border border-gray-100 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#C9A96E]" />
      </div>
      <p className="font-medium text-[#1C1C1E] text-sm">{title}</p>
      {description && (
        <p className="text-sm text-[#7A7A7A] mt-1 max-w-xs">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white px-4 py-2 rounded-lg transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
}
