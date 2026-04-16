"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Hide this column below a breakpoint on desktop table. */
  hideBelow?: "sm" | "md" | "lg" | "xl";
  /** Right-align (useful for numeric columns). */
  align?: "left" | "right" | "center";
  className?: string;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string | number;
  loading?: boolean;
  skeletonRows?: number;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => ReactNode;
  /** Custom mobile card renderer. If omitted, cards show all columns stacked. */
  mobileCard?: (row: T) => ReactNode;
  emptyState?: ReactNode;
  className?: string;
}

const hideBelowClass = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
} as const;

const alignClass = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

export default function DataTable<T>({
  data,
  columns,
  getRowKey,
  loading = false,
  skeletonRows = 4,
  onRowClick,
  actions,
  mobileCard,
  emptyState,
  className,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <>
        {/* Mobile skeleton */}
        <div className="lg:hidden space-y-3">
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200/70 p-4 space-y-2.5"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>
        {/* Desktop skeleton */}
        <div className="hidden lg:block bg-white rounded-xl border border-slate-200/70 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200/70">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider",
                      alignClass[col.align ?? "left"],
                      col.hideBelow && hideBelowClass[col.hideBelow]
                    )}
                  >
                    {col.header}
                  </th>
                ))}
                {actions && <th className="px-5 py-3" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-5 py-3",
                        col.hideBelow && hideBelowClass[col.hideBelow]
                      )}
                    >
                      <Skeleton className="h-4 w-24" />
                    </td>
                  ))}
                  {actions && (
                    <td className="px-5 py-3">
                      <div className="flex gap-2 justify-end">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={className}>
      {/* Mobile: cards */}
      <div className="lg:hidden space-y-3">
        <AnimatePresence mode="popLayout">
          {data.map((row, i) => (
            <motion.div
              key={getRowKey(row)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18, delay: Math.min(i * 0.03, 0.2) }}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "bg-white rounded-xl border border-slate-200/70 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]",
                onRowClick && "cursor-pointer hover:border-slate-300 transition-colors"
              )}
            >
              {mobileCard ? (
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">{mobileCard(row)}</div>
                  {actions && (
                    <div
                      className="flex items-center gap-1 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {actions(row)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    {columns.map((col, ci) => (
                      <div
                        key={col.key}
                        className={cn(
                          ci === 0
                            ? "text-sm font-semibold text-slate-900"
                            : "text-xs text-slate-600 flex items-center gap-1.5"
                        )}
                      >
                        {ci > 0 && (
                          <span className="text-slate-400">{col.header}:</span>
                        )}
                        <span className="min-w-0 truncate">{col.cell(row)}</span>
                      </div>
                    ))}
                  </div>
                  {actions && (
                    <div
                      className="flex items-center gap-1 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {actions(row)}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop: table */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200/70 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-200/70">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    "px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider",
                    alignClass[col.align ?? "left"],
                    col.hideBelow && hideBelowClass[col.hideBelow]
                  )}
                >
                  {col.header}
                </th>
              ))}
              {actions && <th className="px-5 py-3 w-1" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {data.map((row) => (
                <motion.tr
                  key={getRowKey(row)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "transition-colors",
                    onRowClick && "cursor-pointer hover:bg-slate-50/60"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-5 py-3 text-slate-700",
                        alignClass[col.align ?? "left"],
                        col.hideBelow && hideBelowClass[col.hideBelow],
                        col.className
                      )}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                  {actions && (
                    <td
                      className="px-5 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1 justify-end">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
