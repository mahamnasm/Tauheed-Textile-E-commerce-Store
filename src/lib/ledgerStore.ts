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

const DEFAULT_SAMPLE_ENTRIES: ManualLedgerEntry[] = [
  {
    id: "leg_init_1",
    date: new Date().toISOString().split("T")[0],
    type: "EXPENSE",
    category: "Stitching & Karigar Labor",
    title: "Master Tailor Iqbal — Tailoring & Adda Labor (12 Suits)",
    amount: 14500,
    paymentMethod: "CASH",
    reference: "VOUCH-881",
    notes: "Stitching charges for formal chiffon batch",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "leg_init_2",
    date: new Date().toISOString().split("T")[0],
    type: "INCOME",
    category: "Direct / Walk-in Sales",
    title: "Walk-in Cash Sale — 2x Luxury Lawn Suits (Lahore Outlet)",
    amount: 11800,
    paymentMethod: "CASH",
    reference: "INV-OFFLINE-041",
    notes: "Walk-in client payment received in cash register",
    createdAt: new Date().toISOString(),
  },
  {
    id: "leg_init_3",
    date: new Date().toISOString().split("T")[0],
    type: "EXPENSE",
    category: "Fabric & Raw Materials",
    title: "Azam Cloth Market — 60 Gaz Pure Egyptian Cotton Lawn",
    amount: 28500,
    paymentMethod: "BANK_TRANSFER",
    reference: "Meezan-TX-9941",
    notes: "Summer lawn fabric intake roll purchase",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "leg_init_4",
    date: new Date().toISOString().split("T")[0],
    type: "EXPENSE",
    category: "Packaging & Boxes",
    title: "Poly-Mailers & Luxury Gold Embossed Boxes (300 pcs)",
    amount: 6200,
    paymentMethod: "EASYPAISA",
    reference: "EP-441209",
    notes: "Shipping packaging materials replenishment",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

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

    // Initialize with sample entries if empty
    await saveManualLedgerEntries(DEFAULT_SAMPLE_ENTRIES);
    return DEFAULT_SAMPLE_ENTRIES;
  } catch (err) {
    console.error("Failed to read manual ledger entries from DB:", err);
    return DEFAULT_SAMPLE_ENTRIES;
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
