import React from "react";
import AdminLayoutShell from "@/components/admin/AdminLayoutShell";

export const metadata = {
  title: "Admin Portal | Tauheed Textile Operations",
  description: "Executive multi-role commerce management system for Tauheed Textile",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
