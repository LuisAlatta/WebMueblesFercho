"use client";

import { useEffect } from "react";
import { CatalogType } from "@/lib/catalogType";
import { useCatalogType } from "./CatalogTypeProvider";

export default function CatalogTypeSync({ tipo }: { tipo: CatalogType }) {
  const { catalogType, setCatalogType } = useCatalogType();

  useEffect(() => {
    if (tipo !== catalogType) {
      setCatalogType(tipo);
    }
  }, [tipo, catalogType, setCatalogType]);

  return null;
}
