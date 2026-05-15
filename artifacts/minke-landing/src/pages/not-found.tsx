export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-4 p-8 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">404 — Page Not Found</h1>
        <p className="text-sm text-gray-600">
          The page you were looking for doesn't exist.
        </p>
      </div>
    </div>
  );
}
