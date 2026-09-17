"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Building2,
  Wallet,
  Receipt,
  Search,
  Filter,
  RefreshCw,
  FileText,
  CreditCard,
  Banknote,
  Smartphone,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { ManualLedgerEntry } from "@/lib/ledgerStore";

export interface ProofItem {
  id: string;
  transactionRef?: string | null;
  proofImage: string;
  status: string;
  reviewedBy?: string | null;
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    guestPhone: string;
    total: number;
    paymentMethod: string;
  };
}

const CATEGORY_PRESETS = [
  "Stitching & Karigar Labor",
  "Fabric & Raw Materials",
  "Dyeing & Printing",
  "Packaging & Boxes",
  "Store Rent & Utilities",
  "Direct / Walk-in Sales",
  "Staff Salaries & Wages",
  "Delivery & Rider Cash Settlement",
  "Marketing & Photography",
  "Petty Cash & Miscellaneous",
];

export default function AdminPaymentsLedgerView({
  initialProofs = [],
  initialLedgerEntries = [],
  websiteSales = 0,
  websiteCogs = 0,
}: {
  initialProofs: ProofItem[];
  initialLedgerEntries: ManualLedgerEntry[];
  websiteSales: number;
  websiteCogs: number;
}) {
  const [proofs, setProofs] = useState<ProofItem[]>(initialProofs);
  const [ledgerEntries, setLedgerEntries] = useState<ManualLedgerEntry[]>(initialLedgerEntries);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "EXPENSE" | "INCOME">("ALL");

  // Modal State for Add / Edit Ledger Entry
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ManualLedgerEntry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [entryType, setEntryType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORY_PRESETS[0]);
  const [amount, setAmount] = useState<number | string>("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "BANK_TRANSFER" | "JAZZCASH" | "EASYPAISA">("CASH");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  // Calculate Totals
  const totalOfflineIncome = ledgerEntries
    .filter((e) => e.type === "INCOME")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalOfflineExpense = ledgerEntries
    .filter((e) => e.type === "EXPENSE")
    .reduce((sum, e) => sum + e.amount, 0);

  const combinedGrossRevenue = websiteSales + totalOfflineIncome;
  const totalOverallExpenses = websiteCogs + totalOfflineExpense;
  const netTrueBusinessProfit = combinedGrossRevenue - totalOverallExpenses;

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingEntry(null);
    setEntryType("EXPENSE");
    setTitle("");
    setCategory(CATEGORY_PRESETS[0]);
    setAmount("");
    setPaymentMethod("CASH");
    setDate(new Date().toISOString().split("T")[0]);
    setReference("");
    setNotes("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (entry: ManualLedgerEntry) => {
    setEditingEntry(entry);
    setEntryType(entry.type);
    setTitle(entry.title);
    setCategory(entry.category);
    setAmount(entry.amount);
    setPaymentMethod(entry.paymentMethod);
    setDate(entry.date);
    setReference(entry.reference || "");
    setNotes(entry.notes || "");
    setIsModalOpen(true);
  };

  // Submit Add / Edit
  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) {
      toast.error("Please provide title and amount");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        id: editingEntry?.id,
        type: entryType,
        title: title.trim(),
        category,
        amount: Math.abs(Number(amount)),
        paymentMethod,
        date,
        reference: reference.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      const res = await fetch("/api/admin/ledger", {
        method: editingEntry ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save ledger entry");

      if (editingEntry) {
        setLedgerEntries((prev) =>
          prev.map((item) => (item.id === data.entry.id ? data.entry : item))
        );
        toast.success(`Entry "${data.entry.title}" updated!`);
      } else {
        setLedgerEntries((prev) => [data.entry, ...prev]);
        toast.success(`Entry "${data.entry.title}" recorded!`);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Entry
  const handleDeleteEntry = async (id: string, titleStr: string) => {
    if (!confirm(`Are you sure you want to delete ledger entry "${titleStr}"?`)) return;

    try {
      const res = await fetch(`/api/admin/ledger?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete entry");

      setLedgerEntries((prev) => prev.filter((item) => item.id !== id));
      toast.success("Ledger entry deleted.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete entry");
    }
  };

  // Filtered Entries
  const filteredEntries = ledgerEntries.filter((e) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      (e.reference && e.reference.toLowerCase().includes(q)) ||
      e.paymentMethod.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (filterType === "EXPENSE") return e.type === "EXPENSE";
    if (filterType === "INCOME") return e.type === "INCOME";
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sand-300 pb-5 sm:pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gold-700 bg-gold-50 border border-gold-200 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-gold-600" />
              Financial &amp; Business Khata
            </span>
            <span className="text-[10px] font-mono bg-brand-900 text-gold-300 px-2 py-0.5 rounded font-bold">
              EDITABLE GENERAL LEDGER
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950">
            Payments, Profit &amp; General Business Ledger
          </h1>
          <p className="text-xs text-brand-600 mt-0.5">
            Track online store revenues alongside offline factory expenses (stitching, fabric, dyeing, rent) and walk-in sales in one complete financial ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-brand-950 hover:bg-black text-sand-100 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>+ Add Ledger Entry</span>
          </button>
        </div>
      </div>

      {/* 4 Multi-Tiered Financial P&L Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Website Gross Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-brand-600">
            <span>Website Online Sales</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <Receipt className="w-4 h-4" />
            </span>
          </div>
          <p className="font-serif font-bold text-xl sm:text-2xl text-brand-950">
            Rs. {websiteSales.toLocaleString()}
          </p>
          <span className="text-[10px] text-brand-500 block">
            From verified COD &amp; advance orders
          </span>
        </div>

        {/* Card 2: Offline / Extra Incomes */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-brand-600">
            <span>Extra Offline Incomes</span>
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
              <ArrowDownRight className="w-4 h-4" />
            </span>
          </div>
          <p className="font-serif font-bold text-xl sm:text-2xl text-blue-700">
            +Rs. {totalOfflineIncome.toLocaleString()}
          </p>
          <span className="text-[10px] text-blue-700 font-semibold block">
            Walk-in sales &amp; manual orders
          </span>
        </div>

        {/* Card 3: Non-Website Business Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-brand-600">
            <span>Extra Business Expenses</span>
            <span className="p-1.5 bg-rose-50 text-maroon-700 rounded-lg">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <p className="font-serif font-bold text-xl sm:text-2xl text-maroon-700">
            -Rs. {totalOfflineExpense.toLocaleString()}
          </p>
          <span className="text-[10px] text-maroon-700 font-semibold block">
            Labor, fabric intake, rent &amp; utilities
          </span>
        </div>

        {/* Card 4: Net True Business Profit */}
        <div className="bg-white p-5 rounded-2xl border-2 border-emerald-300 shadow-sm space-y-1 bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex items-center justify-between text-xs text-brand-600">
            <span className="font-bold text-brand-900">Net True Business Profit</span>
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg font-bold">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="font-serif font-bold text-xl sm:text-2xl text-emerald-800">
            Rs. {netTrueBusinessProfit.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-800 font-bold block">
            Total Inflow minus Total Outflow
          </span>
        </div>
      </div>

      {/* SECTION 1: EDITABLE BUSINESS LEDGER (FOR EXTRA THINGS OUTSIDE WEBSITE) */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-100 pb-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-gold-700">
              Khata / General Ledger
            </span>
            <h2 className="font-serif text-xl font-bold text-brand-950 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-gold-700" />
              <span>Business General Ledger (Extra Incomes &amp; Expenses)</span>
            </h2>
            <p className="text-xs text-brand-600 mt-0.5">
              Add and edit any external expense or income not captured automatically by the website (karigar stitching, dye master, fabric rolls, packaging, shop rent, or walk-in cash).
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-brand-950 hover:bg-black text-sand-100 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-gold-400" />
            <span>+ Add Entry</span>
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ledger by title, category, voucher ref #, or payment channel..."
              className="w-full pl-10 pr-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-xs text-brand-950 placeholder-brand-400 focus:outline-none focus:border-gold-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                filterType === "ALL"
                  ? "bg-brand-950 text-sand-100"
                  : "bg-sand-100 text-brand-800 hover:bg-sand-200"
              }`}
            >
              All ({ledgerEntries.length})
            </button>
            <button
              onClick={() => setFilterType("EXPENSE")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                filterType === "EXPENSE"
                  ? "bg-rose-700 text-white"
                  : "bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100"
              }`}
            >
              Expenses Only ({ledgerEntries.filter((e) => e.type === "EXPENSE").length})
            </button>
            <button
              onClick={() => setFilterType("INCOME")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                filterType === "INCOME"
                  ? "bg-emerald-700 text-white"
                  : "bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              Incomes Only ({ledgerEntries.filter((e) => e.type === "INCOME").length})
            </button>
          </div>
        </div>

        {/* Ledger Entries Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-sand-50 text-brand-800 uppercase text-[11px]">
              <tr>
                <th className="p-3 font-semibold">Date &amp; Ref</th>
                <th className="p-3 font-semibold">Description / Title</th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">Paid / Received Via</th>
                <th className="p-3 font-semibold text-right">Amount (PKR)</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100 font-sans">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sand-400 text-xs">
                    No ledger entries found. Click &quot;+ Add Ledger Entry&quot; to record your first extra expense or income.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((item) => {
                  const isExpense = item.type === "EXPENSE";

                  return (
                    <tr key={item.id} className="hover:bg-sand-50/70 transition-colors">
                      {/* Date & Ref */}
                      <td className="p-3 whitespace-nowrap">
                        <span className="font-bold text-brand-950 block">{item.date}</span>
                        <span className="text-[10px] text-brand-500 font-mono">
                          {item.reference || "No Ref"}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="p-3 max-w-sm">
                        <span className="font-bold text-brand-950 block text-xs">
                          {item.title}
                        </span>
                        {item.notes && (
                          <span className="text-[11px] text-brand-500 italic block mt-0.5">
                            {item.notes}
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-sand-100 text-brand-900 border border-sand-200 rounded-lg text-[11px] font-semibold">
                          {item.category}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td className="p-3 whitespace-nowrap">
                        <span className="text-[11px] font-bold font-mono text-brand-800">
                          {item.paymentMethod.replace(/_/g, " ")}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="p-3 text-right whitespace-nowrap font-mono font-bold text-sm">
                        <span
                          className={
                            isExpense
                              ? "text-maroon-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200"
                              : "text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200"
                          }
                        >
                          {isExpense ? "-Rs. " : "+Rs. "}
                          {item.amount.toLocaleString()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 bg-sand-100 hover:bg-gold-50 hover:text-gold-800 border border-sand-300 rounded-lg transition-colors"
                            title="Edit Entry"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-gold-700" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEntry(item.id, item.title)}
                            className="p-1.5 bg-sand-100 hover:bg-rose-50 hover:text-maroon-700 border border-sand-300 rounded-lg transition-colors"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-maroon-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: BANK PROOFS VERIFICATION QUEUE */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-100 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-gold-700">Verification</span>
            <h3 className="font-serif font-bold text-base text-brand-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-700" />
              <span>Advance Payment Slip Verification Queue ({proofs.length})</span>
            </h3>
            <p className="text-xs text-brand-500 mt-0.5">
              Review customer screenshot receipts for Bank Transfer, JazzCash, and EasyPaisa orders before approving dispatch.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-sand-50 text-brand-800 uppercase text-[11px]">
              <tr>
                <th className="p-3 font-semibold">Order #</th>
                <th className="p-3 font-semibold">Customer</th>
                <th className="p-3 font-semibold">Reference / Bank</th>
                <th className="p-3 font-semibold">Amount</th>
                <th className="p-3 font-semibold">Proof Screenshot</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Reviewed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100 font-sans">
              {proofs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sand-400 text-xs">
                    No pending bank transfer slips to review.
                  </td>
                </tr>
              ) : (
                proofs.map((p) => (
                  <tr key={p.id} className="hover:bg-sand-50/60 transition-colors">
                    <td className="p-3 font-bold text-brand-950 font-mono">{p.order.orderNumber}</td>
                    <td className="p-3">
                      <p className="font-bold text-brand-900">{p.order.customerName}</p>
                      <p className="text-[11px] text-brand-500 font-mono">{p.order.guestPhone}</p>
                    </td>
                    <td className="p-3 text-brand-700 font-mono">
                      {p.transactionRef || "N/A"}
                    </td>
                    <td className="p-3 font-serif font-bold text-brand-950">
                      Rs. {p.order.total.toLocaleString()}
                    </td>
                    <td className="p-3">
                      {p.proofImage ? (
                        <a
                          href={p.proofImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-gold-700 hover:text-gold-900 underline font-bold"
                        >
                          View Receipt &rarr;
                        </a>
                      ) : (
                        <span className="text-sand-400 italic">No receipt image</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          p.status === "VERIFIED"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-brand-600">{p.reviewedBy || "Pending Review"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT LEDGER ENTRY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-sand-300 shadow-2xl overflow-hidden animate-scaleUp">
            <div className="p-6 border-b border-sand-200 bg-sand-50/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-gold-700">
                  {editingEntry ? "Update Entry" : "New Ledger Entry"}
                </span>
                <h3 className="font-serif text-lg font-bold text-brand-950">
                  {editingEntry ? "Edit Ledger Transaction" : "Record Non-Website Expense / Income"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-brand-400 hover:text-brand-950 rounded-xl hover:bg-sand-100 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="p-6 space-y-4 text-xs">
              {/* Type Switcher */}
              <div>
                <label className="block font-bold text-brand-900 uppercase tracking-wider mb-1.5">
                  Transaction Type:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEntryType("EXPENSE")}
                    className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                      entryType === "EXPENSE"
                        ? "bg-rose-700 text-white border-rose-700 shadow-sm"
                        : "bg-sand-50 text-brand-800 border-sand-300 hover:bg-sand-100"
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Expense (-)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEntryType("INCOME")}
                    className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                      entryType === "INCOME"
                        ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                        : "bg-sand-50 text-brand-800 border-sand-300 hover:bg-sand-100"
                    }`}
                  >
                    <ArrowDownRight className="w-4 h-4" />
                    <span>Income (+)</span>
                  </button>
                </div>
              </div>

              {/* Title / Description */}
              <div>
                <label className="block font-semibold text-brand-900 mb-1">
                  Description / Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Tailor Stitching Labor (15 Suits)..."
                  className="w-full px-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-brand-950 focus:outline-none focus:border-gold-600 font-medium"
                />
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-900 mb-1">
                    Amount (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full px-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-xl font-mono font-bold text-brand-950 focus:outline-none focus:border-gold-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-900 mb-1">
                    Transaction Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-xl font-mono text-brand-950 focus:outline-none focus:border-gold-600"
                  />
                </div>
              </div>

              {/* Category & Payment Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-900 mb-1">
                    Category Preset
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-brand-950 focus:outline-none focus:border-gold-600 font-medium"
                  >
                    {CATEGORY_PRESETS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-900 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-brand-950 focus:outline-none focus:border-gold-600 font-medium"
                  >
                    <option value="CASH">Cash in Hand / Register</option>
                    <option value="BANK_TRANSFER">Bank Account (Meezan/HBL)</option>
                    <option value="JAZZCASH">JazzCash Wallet</option>
                    <option value="EASYPAISA">EasyPaisa Wallet</option>
                  </select>
                </div>
              </div>

              {/* Voucher Reference & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-900 mb-1">
                    Voucher / Receipt Ref #
                  </label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g. VOUCH-102"
                    className="w-full px-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-xl font-mono text-brand-950 focus:outline-none focus:border-gold-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-900 mb-1">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Cleared by manager"
                    className="w-full px-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-brand-950 focus:outline-none focus:border-gold-600"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-sand-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-sand-300 text-brand-700 hover:bg-sand-100 font-bold uppercase tracking-wider text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-brand-950 hover:bg-black text-sand-100 font-bold uppercase tracking-wider text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? "Saving..." : editingEntry ? "Save Changes" : "Record Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
