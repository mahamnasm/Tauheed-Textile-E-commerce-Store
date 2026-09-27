"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Portal Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-md w-full bg-white border border-[#E7E1D8] rounded-3xl p-6 sm:p-8 text-center shadow-xl">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h2 className="font-serif text-2xl font-bold text-[#171717]">
          Connection Resuming
        </h2>
        <p className="text-xs sm:text-sm text-[#6B6259] mt-2 leading-relaxed">
          The cloud database or background service is resuming from idle sleep. Please click retry to reconnect.
        </p>

        {error?.digest && (
          <p className="text-[11px] font-mono text-[#9B8C7E] bg-[#F8F5F0] py-1 px-2 rounded-lg mt-3 inline-block">
            Digest: {error.digest}
          </p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#171717] hover:bg-[#2A2626] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-[#E7E1D8] hover:bg-[#F0EBE3] text-[#171717] text-xs font-semibold rounded-xl transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
