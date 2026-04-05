"use client";

import { createContext, useContext, useState } from "react";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutContextValue {
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextValue>({
  toggleMobileMenu: () => {},
  closeMobileMenu: () => {},
});

export function useAdminLayout() {
  return useContext(AdminLayoutContext);
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AdminLayoutContext.Provider
      value={{
        toggleMobileMenu: () => setMobileOpen((v) => !v),
        closeMobileMenu: () => setMobileOpen(false),
      }}
    >
      <div className="flex h-screen overflow-hidden bg-[#F1F5F9]">
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {children}
        </div>
      </div>
    </AdminLayoutContext.Provider>
  );
}
