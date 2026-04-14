"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CatalogType, getCatalogTypeFromCookie, setCatalogTypeCookie } from "@/lib/catalogType";

interface CatalogTypeContextProps {
  catalogType: CatalogType;
  setCatalogType: (type: CatalogType) => void;
}

const CatalogTypeContext = createContext<CatalogTypeContextProps | undefined>(undefined);

export function CatalogTypeProvider({
  children,
  initialType = "min",
}: {
  children: React.ReactNode;
  initialType?: CatalogType;
}) {
  const [catalogType, setCatalogTypeState] = useState<CatalogType>(initialType);

  useEffect(() => {
    // Read from document cookie on mount in case it changed via other tabs/pages
    const typeFromCookie = getCatalogTypeFromCookie(document.cookie);
    if (typeFromCookie !== catalogType) {
      setCatalogTypeState(typeFromCookie);
    }
  }, []);

  const setCatalogType = (type: CatalogType) => {
    setCatalogTypeState(type);
    setCatalogTypeCookie(type);
  };

  return (
    <CatalogTypeContext.Provider value={{ catalogType, setCatalogType }}>
      {children}
    </CatalogTypeContext.Provider>
  );
}

export function useCatalogType() {
  const context = useContext(CatalogTypeContext);
  if (context === undefined) {
    throw new Error("useCatalogType must be used within a CatalogTypeProvider");
  }
  return context;
}
