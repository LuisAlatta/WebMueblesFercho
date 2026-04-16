"use client";

import { type LucideIcon, ChevronRight } from "lucide-react";
import Link from "next/link";

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  icon: Icon,
  breadcrumbs,
  actions,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-xs text-slate-500 mb-3" aria-label="Breadcrumb">
          {breadcrumbs.map((bc, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return (
              <span key={i} className="flex items-center gap-1">
                {bc.href && !isLast ? (
                  <Link
                    href={bc.href}
                    className="hover:text-slate-800 transition-colors"
                  >
                    {bc.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-slate-700 font-medium" : ""}>
                    {bc.label}
                  </span>
                )}
                {!isLast && <ChevronRight className="w-3 h-3 text-slate-300" />}
              </span>
            );
          })}
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FAF9F7] to-white border border-[#C9A96E]/20 flex items-center justify-center shrink-0 shadow-sm">
              <Icon className="w-5 h-5 text-[#C9A96E]" />
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight leading-tight">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-slate-500 mt-1 leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0 flex-wrap">{actions}</div>
        )}
      </div>

      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
