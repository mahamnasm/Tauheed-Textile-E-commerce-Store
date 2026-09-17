"use client";

import React, { useState } from "react";
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  RefreshCw,
  Percent,
  Coins,
  Users,
  Calendar,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import toast from "react-hot-toast";

export interface CouponItem {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string | null;
  createdAt: string | Date;
}

export default function AdminCouponManager({
  initialCoupons = [],
}: {
  initialCoupons: CouponItem[];
}) {
  const [coupons, setCoupons] = useState<CouponItem[]>(initialCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);

  // Form states
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderValue, setMinOrderValue] = useState<number>(0);
  const [usageLimit, setUsageLimit] = useState<string>("100");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In-line quick edit state
  const [quickEditingId, setQuickEditingId] = useState<string | null>(null);
  const [quickLimit, setQuickLimit] = useState<number>(100);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setCode("");
    setDiscountType("PERCENTAGE");
    setDiscountValue(10);
    setMinOrderValue(0);
    setUsageLimit("100");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (c: CouponItem) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDiscountType(c.discountType as any);
    setDiscountValue(c.discountValue);
    setMinOrderValue(c.minOrderValue);
    setUsageLimit(c.usageLimit !== null && c.usageLimit !== undefined ? String(c.usageLimit) : "");
    setIsActive(c.isActive);
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Coupon code is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        id: editingCoupon?.id,
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue) || 0,
        usageLimit: usageLimit === "" ? null : Number(usageLimit),
        isActive,
      };

      const res = await fetch("/api/admin/coupons", {
        method: editingCoupon ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save coupon");

      if (editingCoupon) {
        setCoupons((prev) => prev.map((c) => (c.id === data.coupon.id ? data.coupon : c)));
        toast.success(`Coupon ${data.coupon.code} updated!`);
      } else {
        setCoupons((prev) => [data.coupon, ...prev]);
        toast.success(`Coupon ${data.coupon.code} created!`);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle status");

      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !currentStatus } : c))
      );
      toast.success(`Coupon ${!currentStatus ? "activated" : "deactivated"}`);
    } catch (err: any) {
      toast.error(err.message || "Status toggle failed");
    }
  };

  const handleSaveQuickLimit = async (c: CouponItem) => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, usageLimit: quickLimit }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update limit");

      setCoupons((prev) =>
        prev.map((item) => (item.id === c.id ? { ...item, usageLimit: quickLimit } : item))
      );
      setQuickEditingId(null);
      toast.success("User limit updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update limit");
    }
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!confirm(`Are you sure you want to permanently delete coupon "${couponCode}"?`)) return;

    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete coupon");

      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast.success(`Coupon ${couponCode} deleted.`);
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gold-100 text-gold-800">
              <Tag className="w-5 h-5" />
            </span>
            <h3 className="font-serif font-bold text-lg text-brand-950">
              Discount Coupons & User Usage Limits
            </h3>
          </div>
          <p className="text-xs text-brand-600 mt-1">
            Create editable promo discount codes and set how many times each coupon can be redeemed by customers.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-sand-50 text-brand-800 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="p-3">Coupon Code</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Min Order</th>
              <th className="p-3">User Usage Limit</th>
              <th className="p-3">Redeemed</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-brand-500">
                  No coupons found. Click "Create New Coupon" to add your first discount code.
                </td>
              </tr>
            ) : (
              coupons.map((c) => {
                const isQuickEdit = quickEditingId === c.id;
                const isLimitExceeded = c.usageLimit !== null && c.usageLimit !== undefined && c.usedCount >= c.usageLimit;

                return (
                  <tr key={c.id} className="hover:bg-sand-50/50 transition-colors">
                    {/* Code */}
                    <td className="p-3">
                      <span className="font-mono font-bold text-xs bg-sand-100 text-brand-950 px-2.5 py-1 rounded-lg border border-sand-300">
                        {c.code}
                      </span>
                    </td>

                    {/* Discount Value */}
                    <td className="p-3">
                      <span className="font-bold text-emerald-700">
                        {c.discountType === "PERCENTAGE" ? `${c.discountValue}% OFF` : `Rs. ${c.discountValue} FLAT`}
                      </span>
                    </td>

                    {/* Min Order */}
                    <td className="p-3 text-brand-700">
                      {c.minOrderValue > 0 ? `Rs. ${c.minOrderValue.toLocaleString()}` : "None"}
                    </td>

                    {/* Usage Limit (In-place editable!) */}
                    <td className="p-3">
                      {isQuickEdit ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="1"
                            value={quickLimit}
                            onChange={(e) => setQuickLimit(Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-sand-300 rounded text-xs font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveQuickLimit(c)}
                            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                            title="Save"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setQuickEditingId(null)}
                            className="p-1 bg-sand-200 text-brand-700 rounded hover:bg-sand-300"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-brand-800">
                            {c.usageLimit !== null && c.usageLimit !== undefined ? `${c.usageLimit} uses` : "Unlimited"}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setQuickEditingId(c.id);
                              setQuickLimit(c.usageLimit || 100);
                            }}
                            className="text-sand-400 hover:text-brand-950 p-0.5 rounded"
                            title="Quick Edit Limit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Used Count */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-semibold ${isLimitExceeded ? "text-rose-700 font-bold" : "text-brand-700"}`}>
                          {c.usedCount}
                        </span>
                        {isLimitExceeded && (
                          <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold">
                            FULL
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(c.id, c.isActive)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] transition-all ${
                          c.isActive
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                            : "bg-sand-200 text-sand-700 border border-sand-300 hover:bg-sand-300"
                        }`}
                      >
                        {c.isActive ? "ACTIVE" : "PAUSED"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(c)}
                          className="p-1.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-brand-800 transition-colors"
                          title="Full Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id, c.code)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal: Create / Edit Coupon */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-sand-300 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-sand-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-brand-950 flex items-center gap-2">
                <Tag className="w-5 h-5 text-gold-600" />
                <span>{editingCoupon ? `Edit Coupon (${editingCoupon.code})` : "Create New Promo Coupon"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-brand-400 hover:text-brand-950 hover:bg-sand-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              {/* Code */}
              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">
                  Coupon Code <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. EID2026, SUMMER15, VIP10"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 text-xs font-mono font-bold uppercase focus:outline-none focus:border-gold-500 bg-sand-50"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-900 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-sand-300 text-xs font-medium focus:outline-none focus:border-gold-500 bg-white"
                  >
                    <option value="PERCENTAGE">Percentage (% Off)</option>
                    <option value="FIXED">Flat Rupees (Rs. Off)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-900 mb-1">
                    {discountType === "PERCENTAGE" ? "Discount (%)" : "Discount (Rs.)"}{" "}
                    <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={discountType === "PERCENTAGE" ? 100 : 50000}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-sand-300 text-xs font-bold focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Min Order & Usage Limit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-900 mb-1">
                    Min. Order Amount (Rs.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    placeholder="0 for no minimum"
                    className="w-full px-3 py-2.5 rounded-xl border border-sand-300 text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-900 mb-1">
                    User Usage Limit (Quota)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    placeholder="Leave empty for unlimited"
                    className="w-full px-3 py-2.5 rounded-xl border border-sand-300 text-xs focus:outline-none focus:border-gold-500"
                  />
                  <p className="text-[10px] text-brand-500 mt-0.5">e.g. 50 = max 50 customers can use it.</p>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="couponActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500"
                />
                <label htmlFor="couponActive" className="text-xs font-bold text-brand-900 cursor-pointer">
                  Activate this coupon immediately for customer checkout
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-sand-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-sand-300 text-brand-700 text-xs font-bold hover:bg-sand-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-brand-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingCoupon ? "Save Changes" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
