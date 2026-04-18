export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-teal-primary animate-spin"></div>
    </div>
  );
}
