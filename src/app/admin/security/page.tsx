import React from "react";
import AdminSecurityClientView from "@/components/admin/AdminSecurityClientView";

export const metadata = {
  title: "Security & Portal Lockdown | Tauheed Textile Admin",
};

export const revalidate = 0;

export default function AdminSecurityPage() {
  return <AdminSecurityClientView />;
}
