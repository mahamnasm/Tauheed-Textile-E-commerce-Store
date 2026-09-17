import { NextRequest, NextResponse } from "next/server";
import { getManualLedgerEntries, saveManualLedgerEntries, ManualLedgerEntry } from "@/lib/ledgerStore";
import { requireAdmin } from "@/lib/requireAdmin";
import { internalError, jsonError } from "@/lib/http";

// GET all ledger entries
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const entries = await getManualLedgerEntries();
    const totalOfflineIncome = entries
      .filter((e) => e.type === "INCOME")
      .reduce((sum, e) => sum + e.amount, 0);
    const totalOfflineExpense = entries
      .filter((e) => e.type === "EXPENSE")
      .reduce((sum, e) => sum + e.amount, 0);
    const netOfflineBalance = totalOfflineIncome - totalOfflineExpense;

    return NextResponse.json({
      success: true,
      entries,
      summary: {
        totalOfflineIncome,
        totalOfflineExpense,
        netOfflineBalance,
      },
    });
  } catch (error: unknown) {
    return internalError("GET /api/admin/ledger error:", error);
  }
}

const VALID_PAYMENT_METHODS = ["CASH", "BANK_TRANSFER", "JAZZCASH", "EASYPAISA"] as const;
type ValidMethod = typeof VALID_PAYMENT_METHODS[number];

function parsePaymentMethod(val: unknown, fallback: ValidMethod = "CASH"): ValidMethod {
  if (typeof val === "string" && (VALID_PAYMENT_METHODS as readonly string[]).includes(val)) {
    return val as ValidMethod;
  }
  return fallback;
}

// POST: Add new entry
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { title, type, category, amount, paymentMethod, date, reference, notes } = body;

    if (!title || !amount || !type) {
      return jsonError("Title, type (INCOME/EXPENSE), and amount are required", 400);
    }

    const currentEntries = await getManualLedgerEntries();

    const newEntry: ManualLedgerEntry = {
      id: `leg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: String(title).trim().slice(0, 150),
      type: type === "INCOME" ? "INCOME" : "EXPENSE",
      category: category ? String(category).trim().slice(0, 80) : "Miscellaneous",
      amount: Math.abs(Number(amount)),
      paymentMethod: parsePaymentMethod(paymentMethod, "CASH"),
      date: date || new Date().toISOString().split("T")[0],
      reference: reference ? String(reference).trim().slice(0, 100) : undefined,
      notes: notes ? String(notes).trim().slice(0, 500) : undefined,
      createdAt: new Date().toISOString(),
    };

    const updated = [newEntry, ...currentEntries];
    await saveManualLedgerEntries(updated);

    return NextResponse.json({
      success: true,
      message: `Ledger entry "${newEntry.title}" added successfully!`,
      entry: newEntry,
      entries: updated,
    });
  } catch (error: unknown) {
    return internalError("POST /api/admin/ledger error:", error);
  }
}

// PATCH: Edit existing entry
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { id, title, type, category, amount, paymentMethod, date, reference, notes } = body;

    if (!id) {
      return jsonError("Entry ID is required", 400);
    }

    const currentEntries = await getManualLedgerEntries();
    const index = currentEntries.findIndex((e) => e.id === id);

    if (index === -1) {
      return jsonError("Ledger entry not found", 404);
    }

    const target = currentEntries[index];
    const updatedEntry: ManualLedgerEntry = {
      ...target,
      title: title !== undefined ? String(title).trim().slice(0, 150) : target.title,
      type: type !== undefined ? (type === "INCOME" ? "INCOME" : "EXPENSE") : target.type,
      category: category !== undefined ? String(category).trim().slice(0, 80) : target.category,
      amount: amount !== undefined ? Math.abs(Number(amount)) : target.amount,
      paymentMethod: paymentMethod !== undefined ? parsePaymentMethod(paymentMethod, target.paymentMethod) : target.paymentMethod,
      date: date !== undefined ? String(date) : target.date,
      reference: reference !== undefined ? String(reference).trim().slice(0, 100) : target.reference,
      notes: notes !== undefined ? String(notes).trim().slice(0, 500) : target.notes,
    };

    currentEntries[index] = updatedEntry;
    await saveManualLedgerEntries(currentEntries);

    return NextResponse.json({
      success: true,
      message: `Ledger entry "${updatedEntry.title}" updated successfully!`,
      entry: updatedEntry,
      entries: currentEntries,
    });
  } catch (error: unknown) {
    return internalError("PATCH /api/admin/ledger error:", error);
  }
}

// DELETE: Remove entry
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return jsonError("Entry ID is required", 400);
    }

    const currentEntries = await getManualLedgerEntries();
    const updated = currentEntries.filter((e) => e.id !== id);

    await saveManualLedgerEntries(updated);

    return NextResponse.json({
      success: true,
      message: "Ledger entry deleted successfully.",
      entries: updated,
    });
  } catch (error: unknown) {
    return internalError("DELETE /api/admin/ledger error:", error);
  }
}
