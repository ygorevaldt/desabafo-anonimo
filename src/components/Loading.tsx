export function Loading() {
  return (
    <div className="fixed inset-0 bg-background/70 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
      </div>
    </div>
  );
}
