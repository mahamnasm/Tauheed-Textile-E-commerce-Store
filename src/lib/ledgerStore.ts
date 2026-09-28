import { prisma } from "@/lib/prisma";

export interface ManualLedgerEntry {
  id: string;
  date: string; // YYYY-MM-DD
  type: "EXPENSE" | "INCOME";
  category: string;
  title: string;
  amount: number;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "JAZZCASH" | "EASYPAISA";
  reference?: string;
  notes?: string;
  createdAt: string;
}

export interface LedgerFinancialSummary {
  websiteSales: number;
  websiteCogs: number;
  websiteNetMargin: number;
  offlineIncomes: number;
  offlineExpenses: number;
  combinedRevenue: number;
  totalExpenses: number;
  netBusinessProfit: number;
}

export async function getManualLedgerEntries(): Promise<ManualLedgerEntry[]> {
  try {
    const record = await prisma.setting.findUnique({
      where: { key: "admin_manual_ledger_entries" },
    });

    if (record && record.value) {
      const parsed = JSON.parse(record.value);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }

    return [];
  } catch (err) {
    console.error("Failed to read manual ledger entries from DB:", err);
    return [];
  }
}

export async function saveManualLedgerEntries(entries: ManualLedgerEntry[]): Promise<boolean> {
  try {
    await prisma.setting.upsert({
      where: { key: "admin_manual_ledger_entries" },
      update: { value: JSON.stringify(entries) },
      create: {
        key: "admin_manual_ledger_entries",
        value: JSON.stringify(entries),
        description: "Tauheed Textile Business General Ledger (Non-Website Offline Incomes & Expenses)",
      },
    });
    return true;
  } catch (err) {
    console.error("Failed to save manual ledger entries to DB:", err);
    return false;
  }
}
