export function Loading() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-55 flex justify-center items-center z-50">
      <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full border-t-rose-500 border-r-transparent border-b-transparent border-l-rose-500">
        <span className="visually-hidden"></span>
      </div>
    </div>
  );
}
