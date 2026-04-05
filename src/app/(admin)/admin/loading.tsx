import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#C9A96E]" />
        <p className="text-sm text-slate-400">Cargando...</p>
      </div>
    </div>
  );
}
