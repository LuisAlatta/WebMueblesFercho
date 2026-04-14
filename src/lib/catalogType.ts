export type CatalogType = "min" | "max";

export const CATALOG_TYPE_COOKIE = "catalog_type";

export function getCatalogTypeFromCookie(cookiesStr: string | null): CatalogType {
  if (!cookiesStr) return "min";
  const match = cookiesStr.match(new RegExp(`(^| )${CATALOG_TYPE_COOKIE}=([^;]+)`));
  if (match) {
    const val = match[2];
    if (val === "min" || val === "max") return val;
  }
  return "min";
}

export function setCatalogTypeCookie(type: CatalogType) {
  if (typeof document !== "undefined") {
    // Cookie expires in 365 days
    document.cookie = `${CATALOG_TYPE_COOKIE}=${type}; path=/; max-age=31536000; SameSite=Lax`;
  }
}
