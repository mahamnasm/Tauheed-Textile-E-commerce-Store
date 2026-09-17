"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8F5F0] text-brand-950 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        <main className="flex-1 p-3 sm:p-6 lg:p-10 pb-24 lg:pb-10 w-full max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
