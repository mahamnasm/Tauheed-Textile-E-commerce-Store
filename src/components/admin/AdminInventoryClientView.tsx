"use client";

import React, { useState } from "react";
import {
  Boxes,
  Edit2,
  Check,
  X,
  Search,
  RefreshCw,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Tag,
  ArrowDownRight,
  ArrowUpRight,
  SlidersHorizontal,
} from "lucide-react";
import toast from "react-hot-toast";

export interface VariantItem {
  id: string;
  productId: string;
  size: string;
  color: string;
  stitchedType: string;
  sku: string;
  barcode?: string | null;
  stockQuantity: number;
  reservedStock: number;
  product: {
    id: string;
    title: string;
    slug: string;
    sku: string;
    basePrice: number;
    salePrice?: number | null;
  };
}

export interface MovementItem {
  id: string;
  variantId: string;
  changeQty: number;
  previousQty: number;
  newQty: number;
  type: string;
  reason?: string | null;
  staffName: string;
  createdAt: string | Date;
  variant?: {
    sku: string;
    product?: {
      title: string;
    };
  };
}

export default function AdminInventoryClientView({
  initialVariants = [],
  initialMovements = [],
}: {
  initialVariants: VariantItem[];
  initialMovements: MovementItem[];
}) {
  const [variants, setVariants] = useState<VariantItem[]>(initialVariants);
  const [movements, setMovements] = useState<MovementItem[]>(initialMovements);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "LOW_STOCK" | "HEALTHY">("ALL");

  // In-line SKU editing state
  const [editingSkuId, setEditingSkuId] = useState<string | null>(null);
  const [editSkuValue, setEditSkuValue] = useState("");
  const [syncProductSku, setSyncProductSku] = useState(false);
  const [isSavingSku, setIsSavingSku] = useState(false);

  // In-line Stock editing state
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editStockValue, setEditStockValue] = useState<number>(0);

  const startEditSku = (v: VariantItem) => {
    setEditingSkuId(v.id);
    setEditSkuValue(v.sku);
    setSyncProductSku(false);
  };

  const cancelEditSku = () => {
    setEditingSkuId(null);
    setEditSkuValue("");
  };

  const handleSaveSku = async (variantId: string) => {
    if (!editSkuValue.trim()) {
      toast.error("SKU cannot be blank");
      return;
    }

    setIsSavingSku(true);
    try {
      const res = await fetch("/api/admin/inventory/sku", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId,
          sku: editSkuValue.trim().toUpperCase(),
          syncProductSku,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update SKU");

      setVariants((prev) =>
        prev.map((v) =>
          v.id === variantId
            ? {
                ...v,
                sku: data.variant.sku,
                product: {
                  ...v.product,
                  sku: syncProductSku ? data.variant.sku : v.product.sku,
                },
              }
            : v
        )
      );

      toast.success(`SKU updated to "${data.variant.sku}"!`);
      setEditingSkuId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update SKU");
    } finally {
      setIsSavingSku(false);
    }
  };

  const handleQuickStockAdjust = async (variantId: string, delta: number) => {
    const target = variants.find((v) => v.id === variantId);
    if (!target) return;
    const newQty = Math.max(0, target.stockQuantity + delta);

    try {
      const res = await fetch("/api/admin/inventory/sku", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId,
          stockQuantity: newQty,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to adjust stock");

      setVariants((prev) =>
        prev.map((v) => (v.id === variantId ? { ...v, stockQuantity: newQty } : v))
      );
      toast.success(`Stock adjusted to ${newQty} units`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update stock");
    }
  };

  const handleSaveDirectStock = async (variantId: string) => {
    try {
      const res = await fetch("/api/admin/inventory/sku", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId,
          stockQuantity: Math.max(0, editStockValue),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save stock");

      setVariants((prev) =>
        prev.map((v) => (v.id === variantId ? { ...v, stockQuantity: Math.max(0, editStockValue) } : v))
      );
      toast.success(`Stock set to ${editStockValue} units`);
      setEditingStockId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update stock");
    }
  };

  // Filtered variants
  const filteredVariants = variants.filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      v.sku.toLowerCase().includes(q) ||
      v.product.title.toLowerCase().includes(q) ||
      v.size.toLowerCase().includes(q) ||
      v.color.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (filterStatus === "LOW_STOCK") return v.stockQuantity <= 5;
    if (filterStatus === "HEALTHY") return v.stockQuantity > 5;
    return true;
  });

  const lowStockCount = variants.filter((v) => v.stockQuantity <= 5).length;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sand-300 pb-5 sm:pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gold-700 bg-gold-50 border border-gold-200 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-gold-600" />
              Stock &amp; Audit
            </span>
            <span className="text-[10px] font-mono bg-brand-900 text-gold-300 px-2 py-0.5 rounded font-bold">
              EDITABLE SKU ENABLED
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950">
            Inventory Ledger &amp; SKU Management
          </h1>
          <p className="text-xs text-brand-600 mt-0.5">
            Real-time stock balances with 1-click editable SKUs, stock level adjustments, and inventory movements audit trail.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="px-3.5 py-2.5 bg-white hover:bg-sand-50 border border-sand-300 text-brand-900 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold-700" />
            <span>Refresh Ledger</span>
          </button>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm space-y-1">
          <span className="text-xs text-brand-600">Total Tracked Variants</span>
          <p className="font-serif font-bold text-2xl text-brand-950">
            {variants.length} SKUs
          </p>
          <span className="text-[10px] text-brand-500">Active variant inventory codes</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm space-y-1">
          <span className="text-xs text-brand-600">Low Stock Warnings</span>
          <p className="font-serif font-bold text-2xl text-amber-700">
            {lowStockCount} Variants
          </p>
          <span className="text-[10px] text-amber-700 font-semibold">
            &le; 5 units remaining in warehouse
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm space-y-1">
          <span className="text-xs text-brand-600">Total Physical Units in Stock</span>
          <p className="font-serif font-bold text-2xl text-emerald-700">
            {variants.reduce((sum, v) => sum + v.stockQuantity, 0).toLocaleString()} Units
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold">Available for sale</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-sand-200 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-brand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by SKU code (e.g. TT-LAWN), product title, size, or color..."
            className="w-full pl-10 pr-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-xs font-mono text-brand-950 placeholder-brand-400 focus:outline-none focus:border-gold-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === "ALL"
                ? "bg-brand-950 text-sand-100"
                : "bg-sand-100 text-brand-800 hover:bg-sand-200"
            }`}
          >
            All ({variants.length})
          </button>
          <button
            onClick={() => setFilterStatus("LOW_STOCK")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === "LOW_STOCK"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
            }`}
          >
            Low Stock ({lowStockCount})
          </button>
          <button
            onClick={() => setFilterStatus("HEALTHY")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === "HEALTHY"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            Healthy ({variants.length - lowStockCount})
          </button>
        </div>
      </div>

      {/* Current Stock by SKU Variant Table with Editable SKU */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-100 pb-3">
          <div>
            <h3 className="font-serif font-bold text-base text-brand-950">
              Current Stock by SKU Variant
            </h3>
            <p className="text-xs text-brand-500 mt-0.5">
              Click on any SKU code or the edit button to rename or reformat SKU numbers instantly.
            </p>
          </div>
          <span className="text-xs font-mono bg-sand-100 text-brand-700 px-2.5 py-1 rounded-lg">
            Showing {filteredVariants.length} of {variants.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-sand-50 text-brand-800 uppercase text-[11px]">
              <tr>
                <th className="p-3 font-semibold">Product Title</th>
                <th className="p-3 font-semibold">Variant SKU (Editable)</th>
                <th className="p-3 font-semibold">Option / Stitching</th>
                <th className="p-3 font-semibold">Color</th>
                <th className="p-3 font-semibold">Available Stock</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100 font-sans">
              {filteredVariants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sand-400 text-xs">
                    No variants matched your search or filter.
                  </td>
                </tr>
              ) : (
                filteredVariants.map((v) => {
                  const isEditingSku = editingSkuId === v.id;
                  const isEditingStock = editingStockId === v.id;

                  return (
                    <tr key={v.id} className="hover:bg-sand-50/60 transition-colors">
                      {/* Product Title */}
                      <td className="p-3 font-bold text-brand-950 max-w-xs">
                        <span className="block truncate" title={v.product.title}>
                          {v.product.title}
                        </span>
                        <span className="text-[10px] text-brand-500 font-mono">
                          Parent SKU: {v.product.sku}
                        </span>
                      </td>

                      {/* Variant SKU (Editable!) */}
                      <td className="p-3">
                        {isEditingSku ? (
                          <div className="space-y-1.5 max-w-xs">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={editSkuValue}
                                onChange={(e) => setEditSkuValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveSku(v.id);
                                  if (e.key === "Escape") cancelEditSku();
                                }}
                                autoFocus
                                className="px-2.5 py-1.5 bg-sand-50 border-2 border-gold-600 rounded-lg text-xs font-mono font-bold text-brand-950 focus:outline-none w-48 shadow-inner"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveSku(v.id)}
                                disabled={isSavingSku}
                                className="p-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors"
                                title="Save SKU"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditSku}
                                disabled={isSavingSku}
                                className="p-1.5 bg-sand-200 hover:bg-sand-300 text-brand-800 rounded-lg transition-colors"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <label className="flex items-center gap-1.5 text-[10px] text-brand-600 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={syncProductSku}
                                onChange={(e) => setSyncProductSku(e.target.checked)}
                                className="rounded border-sand-300 text-gold-600"
                              />
                              <span>Also update main product SKU</span>
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 group">
                            <span
                              onClick={() => startEditSku(v)}
                              className="font-mono font-bold text-brand-900 bg-sand-100 hover:bg-gold-50 border border-sand-300 hover:border-gold-500 px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-all shadow-xs"
                              title="Click to edit SKU"
                            >
                              {v.sku}
                            </span>
                            <button
                              type="button"
                              onClick={() => startEditSku(v)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gold-700 hover:bg-sand-100 rounded transition-opacity"
                              title="Edit SKU"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Option */}
                      <td className="p-3 text-brand-800">
                        {v.size} ({v.stitchedType})
                      </td>

                      {/* Color */}
                      <td className="p-3 text-brand-600">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-sand-400 border border-sand-500"></span>
                          <span>{v.color}</span>
                        </span>
                      </td>

                      {/* Available Stock (Quick adjust + / -) */}
                      <td className="p-3">
                        {isEditingStock ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={editStockValue}
                              onChange={(e) => setEditStockValue(Number(e.target.value) || 0)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveDirectStock(v.id);
                                if (e.key === "Escape") setEditingStockId(null);
                              }}
                              autoFocus
                              className="w-16 px-2 py-1 bg-sand-50 border border-gold-600 rounded text-xs font-mono font-bold"
                            />
                            <button
                              onClick={() => handleSaveDirectStock(v.id)}
                              className="p-1 bg-emerald-600 text-white rounded"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setEditingStockId(null)}
                              className="p-1 bg-sand-200 rounded"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuickStockAdjust(v.id, -1)}
                              className="w-5 h-5 rounded bg-sand-100 hover:bg-sand-200 text-brand-800 flex items-center justify-center font-bold"
                              title="Decrement Stock"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span
                              onClick={() => {
                                setEditingStockId(v.id);
                                setEditStockValue(v.stockQuantity);
                              }}
                              className="font-serif font-bold text-sm text-brand-950 cursor-pointer hover:underline"
                              title="Click to set stock directly"
                            >
                              {v.stockQuantity} units
                            </span>
                            <button
                              onClick={() => handleQuickStockAdjust(v.id, 1)}
                              className="w-5 h-5 rounded bg-sand-100 hover:bg-sand-200 text-brand-800 flex items-center justify-center font-bold"
                              title="Increment Stock"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            v.stockQuantity <= 5
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          }`}
                        >
                          {v.stockQuantity <= 5 ? "LOW STOCK ALERT" : "HEALTHY"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => startEditSku(v)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-sand-100 hover:bg-gold-50 hover:border-gold-400 border border-sand-300 text-brand-900 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-gold-700" />
                          <span>Edit SKU</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Movements Log */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-sand-100 pb-3">
          <div>
            <h3 className="font-serif font-bold text-base text-brand-950">
              Recent Inventory Movements Audit Trail
            </h3>
            <p className="text-xs text-brand-500 mt-0.5">
              Logged history of stock edits, sales deductions, and SKU renames.
            </p>
          </div>
          <span className="text-xs font-mono bg-sand-100 text-brand-700 px-2 py-1 rounded-lg">
            {movements.length} Entries
          </span>
        </div>

        <div className="divide-y divide-sand-100 text-xs">
          {movements.length === 0 ? (
            <div className="py-6 text-center text-sand-400">
              No inventory adjustments recorded yet.
            </div>
          ) : (
            movements.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-brand-950">
                    {m.variant?.product?.title || "Variant"} •{" "}
                    <span className="font-mono text-gold-700">{m.variant?.sku}</span>
                  </p>
                  <p className="text-[11px] text-brand-500">
                    Reason: {m.reason || "Manual Stock Adjustment"} • Staff: {m.staffName}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`font-bold font-mono ${
                      m.changeQty >= 0 ? "text-emerald-700" : "text-maroon-700"
                    }`}
                  >
                    {m.changeQty >= 0 ? `+${m.changeQty}` : m.changeQty} units
                  </span>
                  <p className="text-[10px] text-brand-400">
                    {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
