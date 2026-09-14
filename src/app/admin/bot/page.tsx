import React from "react";
import { prisma } from "@/lib/prisma";
import { getAiVideoBotState } from "@/lib/aiVideoBot";
import AdminAiBotClientView from "@/components/admin/AdminAiBotClientView";

export const revalidate = 0;

export default async function AdminAiBotPage() {
  const [botState, activeReels] = await Promise.all([
    getAiVideoBotState(),
    prisma.watchBuyVideo.findMany({
      where: { isActive: true },
      include: { product: true },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  return (
    <AdminAiBotClientView
      initialState={botState}
      activeReels={activeReels}
    />
  );
}
