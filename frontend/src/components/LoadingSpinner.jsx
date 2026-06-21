import { Briefcase } from "lucide-react";
const LoadingSpinner = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"></div>
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-200">
            <Briefcase className="size-5" />
          </div>
        </div>
        <p className="text-sm font-medium text-gray-600">
          Finding amazing opportunities...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
