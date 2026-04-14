import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { CATALOG_TYPE_COOKIE } from "@/lib/catalogType";

export default async function CatalogoRedirect() {
  const cookieStore = await cookies();
  const catalogType = cookieStore.get(CATALOG_TYPE_COOKIE)?.value || "min";
  redirect(`/catalogo/${catalogType}`);
}
