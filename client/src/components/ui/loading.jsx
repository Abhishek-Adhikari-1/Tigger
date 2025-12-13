export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full flex-col">
      <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
      <div className="mt-3">Loading</div>
    </div>
  );
}
