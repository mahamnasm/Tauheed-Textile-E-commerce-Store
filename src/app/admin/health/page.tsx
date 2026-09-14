import React from "react";
import { getLiveSystemHealth } from "@/lib/performanceOptimizer";
import AdminHealthClientView from "@/components/admin/AdminHealthClientView";

export const metadata = {
  title: "Website Health & Speed Optimizer | Tauheed Textile Admin",
};

export const revalidate = 0;

export default async function AdminHealthPage() {
  const report = await getLiveSystemHealth();
  return <AdminHealthClientView initialReport={report} />;
}
