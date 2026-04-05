export default function AdminLoading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#C9A96E] animate-spin" />
      </div>
    </div>
  );
}
