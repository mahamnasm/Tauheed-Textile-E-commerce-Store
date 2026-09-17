import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="space-y-6 max-w-md w-full">
        <h1 className="font-serif text-8xl font-bold text-[#171717] opacity-10 select-none">404</h1>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-[#171717]">Page Not Found</h2>
          <p className="text-sm text-[#6B6259]">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#171717] text-white rounded-xl text-sm font-bold hover:bg-[#2D2620] transition-colors w-full sm:w-auto mt-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Homepage
        </Link>
      </div>
    </div>
  );
}
