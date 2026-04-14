import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { CATALOG_TYPE_COOKIE } from "@/lib/catalogType";

export const revalidate = 0; // Evitar que el caché de la landing antigua se quede pegado

export default async function HomePage() {
  const cookieStore = await cookies();
  const catalogType = cookieStore.get(CATALOG_TYPE_COOKIE)?.value || "min";
  
  // Redirigir a la vista del catálogo según el tipo actual
  redirect(`/catalogo/${catalogType}`);
}
