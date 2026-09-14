import React from "react";
import { getDynamicAiConfig } from "@/lib/dynamicAiConfig";
import AdminAiClientView from "@/components/admin/AdminAiClientView";

export const revalidate = 0;

export default async function AdminAiPage() {
  const config = await getDynamicAiConfig();

  return <AdminAiClientView initialConfig={config} />;
}
