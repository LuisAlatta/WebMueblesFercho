import { redirect } from "next/navigation";

// Catálogo público — se construye en Fase 3
// Por ahora redirige al panel admin
export default function Home() {
  redirect("/admin");
}
