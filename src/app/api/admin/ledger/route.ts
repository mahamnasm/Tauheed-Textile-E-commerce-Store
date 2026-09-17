import { NextRequest, NextResponse } from "next/server";
import { getManualLedgerEntries, saveManualLedgerEntries, ManualLedgerEntry } from "@/lib/ledgerStore";

// GET all ledger entries
export async function GET() {
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load ledger" },
      { status: 500 }
    );
  }
}

// POST: Add new entry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, type, category, amount, paymentMethod, date, reference, notes } = body;

    if (!title || !amount || !type) {
      return NextResponse.json(
        { success: false, error: "Title, type (INCOME/EXPENSE), and amount are required" },
        { status: 400 }
      );
    }

    const currentEntries = await getManualLedgerEntries();

    const newEntry: ManualLedgerEntry = {
      id: `leg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      type: type === "INCOME" ? "INCOME" : "EXPENSE",
      category: category ? category.trim() : "Miscellaneous",
      amount: Math.abs(Number(amount)),
      paymentMethod: paymentMethod || "CASH",
      date: date || new Date().toISOString().split("T")[0],
      reference: reference ? reference.trim() : undefined,
      notes: notes ? notes.trim() : undefined,
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add ledger entry" },
      { status: 500 }
    );
  }
}

// PATCH: Edit existing entry
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, type, category, amount, paymentMethod, date, reference, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Entry ID is required" },
        { status: 400 }
      );
    }

    const currentEntries = await getManualLedgerEntries();
    const index = currentEntries.findIndex((e) => e.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Ledger entry not found" },
        { status: 404 }
      );
    }

    const target = currentEntries[index];
    const updatedEntry: ManualLedgerEntry = {
      ...target,
      title: title !== undefined ? title.trim() : target.title,
      type: type !== undefined ? (type === "INCOME" ? "INCOME" : "EXPENSE") : target.type,
      category: category !== undefined ? category.trim() : target.category,
      amount: amount !== undefined ? Math.abs(Number(amount)) : target.amount,
      paymentMethod: paymentMethod !== undefined ? paymentMethod : target.paymentMethod,
      date: date !== undefined ? date : target.date,
      reference: reference !== undefined ? reference.trim() : target.reference,
      notes: notes !== undefined ? notes.trim() : target.notes,
    };

    currentEntries[index] = updatedEntry;
    await saveManualLedgerEntries(currentEntries);

    return NextResponse.json({
      success: true,
      message: `Ledger entry "${updatedEntry.title}" updated successfully!`,
      entry: updatedEntry,
      entries: currentEntries,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update ledger entry" },
      { status: 500 }
    );
  }
}

// DELETE: Remove entry
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Entry ID is required" },
        { status: 400 }
      );
    }

    const currentEntries = await getManualLedgerEntries();
    const updated = currentEntries.filter((e) => e.id !== id);

    await saveManualLedgerEntries(updated);

    return NextResponse.json({
      success: true,
      message: "Ledger entry deleted successfully.",
      entries: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete ledger entry" },
      { status: 500 }
    );
  }
}
