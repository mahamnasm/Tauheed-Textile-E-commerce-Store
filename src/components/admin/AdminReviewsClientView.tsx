"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  Check, 
  X, 
  Trash2, 
  Heart, 
  Edit3, 
  Search, 
  Filter, 
  MessageSquare, 
  Camera,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Plus,
  RotateCcw,
  CheckCheck
} from "lucide-react";
import toast from "react-hot-toast";

interface ReviewItem {
  id: string;
  productId: string;
  customerName: string;
  reviewerCity?: string | null;
  rating: number;
  title: string;
  comment: string;
  imageUrl?: string | null;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
  product?: {
    id: string;
    title: string;
    slug: string;
    images?: { url: string }[];
  } | null;
}

const PAKISTANI_NAME_PRESETS = [
  "Fatima Zahra",
  "Ayesha Bilal",
  "Zainab Farooq",
  "Maryam Sheikh",
  "Hira Siddiqui",
  "Maham Khan",
  "Sana Naveed",
  "Anum Javed",
  "Komal Riaz",
  "Bushra Alvi",
  "Sadia Imran",
  "Nida Yasir"
];

const PAKISTANI_CITY_PRESETS = [
  "Lahore, DHA Phase 5",
  "Karachi, Clifton",
  "Islamabad, F-7",
  "Rawalpindi, Bahria Town",
  "Faisalabad",
  "Multan, Cantt",
  "Peshawar, Hayatabad",
  "Sialkot",
  "Gujranwala",
  "Hyderabad, Sindh"
];

export default function AdminReviewsClientView({
  initialReviews = [],
}: {
  initialReviews: ReviewItem[];
}) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "APPROVED" | "PENDING" | "FEATURED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Create Desi Review Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addCustomerName, setAddCustomerName] = useState("");
  const [addCity, setAddCity] = useState("Lahore, DHA Phase 5");
  const [addRating, setAddRating] = useState(5);
  const [addTitle, setAddTitle] = useState("Original Swiss Lawn & Breathtaking Embroidery!");
  const [addComment, setAddComment] = useState("");
  const [addImageUrl, setAddImageUrl] = useState("");
  const [addIsApproved, setAddIsApproved] = useState(true);
  const [addIsFeatured, setAddIsFeatured] = useState(true);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  // Edit modal state
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [editCustomerName, setEditCustomerName] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [savingEdit, setSavingEdit] = useState(false);

  // Quick Seed 10 authentic Pakistani reviews (Wipes old ones)
  const handleSeedReviews = async () => {
    if (!confirm("This will delete all old reviews and replace them with 10 authentic Pakistani customer reviews (with Pakistani names, local cities & desi feedback). Proceed?")) return;

    setIsSeeding(true);
    try {
      const res = await fetch("/api/admin/reviews/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to seed reviews");

      setReviews(data.reviews);
      toast.success("10 authentic Pakistani desi reviews loaded successfully!", { icon: "🇵🇰" });
    } catch (err: any) {
      toast.error(err.message || "Failed to seed reviews");
    } finally {
      setIsSeeding(false);
    }
  };

  // Bulk Delete All Reviews
  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to permanently delete ALL reviews currently in the database?")) return;

    setIsDeletingAll(true);
    try {
      const res = await fetch("/api/reviews?all=true", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete reviews");

      setReviews([]);
      toast.success("All reviews deleted from the database.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete reviews");
    } finally {
      setIsDeletingAll(false);
    }
  };

  // Approve all pending reviews with 1 click
  const handleApproveAllPending = async () => {
    const pending = reviews.filter((r) => !r.isApproved);
    if (pending.length === 0) return;

    const count = pending.length;
    try {
      await Promise.all(
        pending.map((r) =>
          fetch("/api/reviews", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: r.id, isApproved: true }),
          })
        )
      );

      setReviews((prev) => prev.map((r) => ({ ...r, isApproved: true })));
      toast.success(`All ${count} pending reviews are now approved and live on the website!`, { icon: "✅" });
    } catch {
      toast.error("Failed to approve all pending reviews");
    }
  };

  // Create new review
  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addCustomerName.trim() || !addComment.trim()) {
      toast.error("Customer name and review comment are required");
      return;
    }

    setIsSubmittingAdd(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isAdmin: true,
          customerName: addCustomerName.trim(),
          reviewerCity: addCity.trim(),
          rating: addRating,
          title: addTitle.trim(),
          comment: addComment.trim(),
          imageUrl: addImageUrl.trim() || null,
          isApproved: addIsApproved,
          isFeatured: addIsFeatured,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create review");

      setReviews((prev) => [data.review, ...prev]);
      toast.success(addIsApproved ? "Desi review published and live on website!" : "Review saved as pending approval!");
      setIsAddModalOpen(false);
      // Reset
      setAddCustomerName("");
      setAddComment("");
      setAddImageUrl("");
    } catch (err: any) {
      toast.error(err.message || "Failed to create review");
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  // Toggle approval (Approve / Unapprove before showing on live store)
  const handleToggleApprove = async (id: string, currentStatus: boolean) => {
    try {
      const nextStatus = !currentStatus;
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved: nextStatus }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isApproved: nextStatus } : r))
        );
        toast.success(
          nextStatus 
            ? "✅ Review Approved & Live on Website!" 
            : "🚫 Review Hidden from Live Website", 
          { icon: nextStatus ? "✅" : "👁️‍🗨️" }
        );
      }
    } catch {
      toast.error("Failed to update approval status");
    }
  };

  // Toggle feature / like
  const handleToggleFeature = async (id: string, currentStatus: boolean) => {
    try {
      const nextStatus = !currentStatus;
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFeatured: nextStatus }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isFeatured: nextStatus } : r))
        );
        toast.success(nextStatus ? "Review featured on homepage!" : "Removed from featured");
      }
    } catch {
      toast.error("Failed to toggle feature");
    }
  };

  // Open edit modal
  const openEditModal = (review: ReviewItem) => {
    setEditingReview(review);
    setEditCustomerName(review.customerName);
    setEditCity(review.reviewerCity || "");
    setEditTitle(review.title);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  // Save edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    setSavingEdit(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingReview.id,
          customerName: editCustomerName.trim(),
          reviewerCity: editCity.trim() || null,
          title: editTitle.trim(),
          comment: editComment.trim(),
          rating: editRating,
        }),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === editingReview.id
              ? { 
                  ...r, 
                  customerName: editCustomerName.trim(), 
                  reviewerCity: editCity.trim() || null,
                  title: editTitle.trim(), 
                  comment: editComment.trim(), 
                  rating: editRating 
                }
              : r
          )
        );
        toast.success("Review updated successfully");
        setEditingReview(null);
      } else {
        toast.error("Failed to save changes");
      }
    } catch {
      toast.error("Network error while updating");
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete review
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this customer review?")) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        toast.success("Review deleted permanently");
      }
    } catch {
      toast.error("Failed to delete review");
    }
  };

  // Filtering
  const filteredReviews = reviews.filter((r) => {
    const matchesFilter =
      activeFilter === "ALL" ||
      (activeFilter === "APPROVED" && r.isApproved) ||
      (activeFilter === "PENDING" && !r.isApproved) ||
      (activeFilter === "FEATURED" && r.isFeatured);

    const matchesSearch =
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.reviewerCity || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.product?.title || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const pendingCount = reviews.filter((r) => !r.isApproved).length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;
  const featuredCount = reviews.filter((r) => r.isFeatured).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-brand-950">
              Customer Reviews & Moderation
            </h1>
            {pendingCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                {pendingCount} Awaiting Approval
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                All Approved & Live
              </span>
            )}
          </div>
          <p className="text-xs text-brand-600 mt-1">
            Moderate authentic Pakistani reviews, approve or hide before uploading to the live website, and like/feature on the homepage.
          </p>
        </div>

        {/* Stats & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div className="px-3 py-1.5 bg-white rounded-xl border border-sand-300 shadow-xs text-center">
            <span className="text-brand-500 block text-[10px] font-semibold uppercase">Total</span>
            <span className="font-bold text-brand-950 text-sm">{reviews.length}</span>
          </div>
          <div className="px-3 py-1.5 bg-white rounded-xl border border-sand-300 shadow-xs text-center">
            <span className="text-emerald-700 block text-[10px] font-semibold uppercase">Live</span>
            <span className="font-bold text-emerald-700 text-sm">{approvedCount}</span>
          </div>
          <div className="px-3 py-1.5 bg-white rounded-xl border border-sand-300 shadow-xs text-center">
            <span className="text-amber-700 block text-[10px] font-semibold uppercase">Pending</span>
            <span className="font-bold text-amber-700 text-sm">{pendingCount}</span>
          </div>

          <button
            type="button"
            onClick={handleSeedReviews}
            disabled={isSeeding}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-sand-300 bg-white hover:bg-sand-50 text-brand-900 text-xs font-bold transition-all shadow-xs"
            title="Wipe old reviews and seed 10 authentic Pakistani reviews"
          >
            <span>🇵🇰</span>
            <span>{isSeeding ? "Seeding..." : "Load 10 Desi Reviews"}</span>
          </button>

          <button
            type="button"
            onClick={handleDeleteAll}
            disabled={isDeletingAll || reviews.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-maroon-200 bg-white hover:bg-maroon-50 text-maroon-700 text-xs font-bold transition-all shadow-xs disabled:opacity-40"
            title="Delete all reviews in the database"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete All</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Desi Review</span>
          </button>
        </div>
      </div>

      {/* Pending Reviews Alert Banner */}
      {pendingCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">
                {pendingCount} review(s) are awaiting admin approval!
              </p>
              <p className="text-[11px] text-amber-700">
                These reviews are currently hidden from visitors. Click "Approve & Publish" on each card or approve all at once.
              </p>
            </div>
          </div>
          <button
            onClick={handleApproveAllPending}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-sm transition-all"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Approve All ({pendingCount}) to Live Store</span>
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "ALL", label: `All (${reviews.length})` },
            { id: "PENDING", label: `⏳ Pending Approval (${pendingCount})` },
            { id: "APPROVED", label: `✅ Live on Website (${approvedCount})` },
            { id: "FEATURED", label: `🌟 Featured (${featuredCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? "bg-brand-900 text-sand-50 shadow-sm"
                  : "bg-sand-100 text-brand-700 hover:bg-sand-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
          <input
            type="text"
            placeholder="Search by Pakistani name, city, comment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 border border-sand-300 rounded-xl bg-sand-50/50 focus:outline-none focus:ring-1 focus:ring-gold-500"
          />
        </div>
      </div>

      {/* Reviews Grid */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-sand-200 p-12 text-center space-y-3">
          <MessageSquare className="w-10 h-10 text-brand-300 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-brand-950">No reviews found</h3>
          <p className="text-xs text-brand-500">No reviews match the selected filter criteria.</p>
          {reviews.length === 0 && (
            <button
              onClick={handleSeedReviews}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-950 text-white text-xs font-bold"
            >
              <span>🇵🇰</span>
              <span>Load 10 Authentic Pakistani Reviews</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition-all ${
                !rev.isApproved
                  ? "border-amber-300 bg-amber-50/20 ring-1 ring-amber-300"
                  : rev.isFeatured
                  ? "border-gold-500/80 ring-1 ring-gold-500/20"
                  : "border-sand-200 hover:border-sand-300"
              }`}
            >
              <div className="space-y-3">
                {/* Top Row: Stars + Live/Pending Approval Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-gold-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? "fill-current" : "text-sand-300"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {rev.isFeatured && (
                      <span className="text-[10px] bg-gold-100 text-gold-900 border border-gold-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-gold-500 text-gold-500" /> Featured
                      </span>
                    )}
                    {rev.isApproved ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> Live on Web
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-600" /> Pending Approval
                      </span>
                    )}
                  </div>
                </div>

                {/* Customer Photo Uploaded (if any) */}
                {rev.imageUrl && (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden bg-sand-100 border border-sand-200">
                    <Image
                      src={rev.imageUrl}
                      alt="Customer review photo"
                      fill
                      className="object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium flex items-center gap-1 backdrop-blur-sm">
                      <Camera className="w-3 h-3" /> Customer Photo
                    </span>
                  </div>
                )}

                {/* Title & Comment */}
                <div>
                  <h4 className="font-serif font-bold text-sm text-brand-950 line-clamp-1">
                    {rev.title}
                  </h4>
                  <p className="text-xs text-brand-700 mt-1 line-clamp-4 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Pakistani Customer Info */}
                <div className="text-[11px] text-brand-500 pt-2 border-t border-sand-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-brand-950 block">
                      {rev.customerName}
                    </span>
                    {rev.reviewerCity && (
                      <span className="text-[10px] text-brand-600 flex items-center gap-1">
                        <span>📍</span>
                        <span>{rev.reviewerCity}</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-sand-500">
                    {new Date(rev.createdAt).toLocaleDateString("en-PK")}
                  </span>
                </div>

                {/* Attached Product */}
                {rev.product && (
                  <div className="p-2 rounded-lg bg-sand-50 border border-sand-200 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-brand-800 truncate max-w-[180px]">
                      {rev.product.title}
                    </span>
                    <Link
                      href={`/product/${rev.product.slug}`}
                      target="_blank"
                      className="text-gold-700 hover:text-gold-900 font-semibold inline-flex items-center gap-0.5"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Action Buttons: Explicit Approve / Reject Option Before Uploading to Website */}
              <div className="pt-3.5 mt-3 border-t border-sand-200 flex items-center justify-between gap-1.5 flex-wrap">
                {/* APPROVE / HIDE TOGGLE */}
                <button
                  onClick={() => handleToggleApprove(rev.id, rev.isApproved)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                    rev.isApproved
                      ? "bg-sand-100 text-brand-800 hover:bg-sand-200 border border-sand-300"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  }`}
                  title={rev.isApproved ? "Hide this review from live website" : "Approve and publish this review to live website"}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{rev.isApproved ? "Hide from Web" : "Approve for Web"}</span>
                </button>

                {/* LIKE / FEATURE TOGGLE */}
                <button
                  onClick={() => handleToggleFeature(rev.id, rev.isFeatured)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    rev.isFeatured
                      ? "bg-gold-500 text-white shadow-xs"
                      : "bg-sand-100 hover:bg-gold-100 text-gold-800 border border-sand-200"
                  }`}
                  title="Like / Feature on homepage reviews slider"
                >
                  <Heart className={`w-3.5 h-3.5 ${rev.isFeatured ? "fill-white" : ""}`} />
                  <span>{rev.isFeatured ? "Liked" : "Like"}</span>
                </button>

                {/* EDIT BUTTON */}
                <button
                  onClick={() => openEditModal(rev)}
                  className="p-1.5 rounded-lg text-brand-600 hover:bg-sand-200 transition-colors"
                  title="Edit customer name or review text"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="p-1.5 rounded-lg text-maroon-600 hover:bg-maroon-50 transition-colors"
                  title="Delete review permanently"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setEditingReview(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <h3 className="font-serif font-bold text-lg text-brand-950">
                Edit Review: {editingReview.customerName}
              </h3>
              <button
                onClick={() => setEditingReview(null)}
                className="p-1 rounded-full text-brand-400 hover:bg-sand-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-900 mb-1">Customer Name (Pakistani)</label>
                  <input
                    type="text"
                    required
                    value={editCustomerName}
                    onChange={(e) => setEditCustomerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-sand-300 bg-sand-50 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-900 mb-1">City / Location</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-sand-300 bg-sand-50 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-900 mb-1">Star Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setEditRating(s)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          s <= editRating ? "text-gold-500 fill-current" : "text-sand-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-brand-800 ml-2">{editRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-900 mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sand-300 bg-sand-50 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-900 mb-1">Desi Review Comment</label>
                <textarea
                  rows={4}
                  required
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sand-300 bg-sand-50 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-sand-200">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 rounded-lg bg-sand-200 text-brand-900 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-lg bg-brand-900 text-white font-bold hover:bg-brand-950"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW DESI REVIEW MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-sand-300 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-brand-950 flex items-center gap-2">
                  <span>🇵🇰</span>
                  <span>Add Authentic Pakistani Desi Review</span>
                </h3>
                <p className="text-[11px] text-brand-600">Enter customer details, feedback, and choose approval status</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-sand-500 hover:text-brand-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-4 text-xs">
              {/* Quick Name Presets */}
              <div>
                <label className="block font-bold text-brand-900 mb-1">
                  Customer Name (Pakistani) *
                </label>
                <input
                  type="text"
                  required
                  value={addCustomerName}
                  onChange={(e) => setAddCustomerName(e.target.value)}
                  placeholder="e.g. Fatima Zahra, Ayesha Bilal"
                  className="w-full p-2.5 rounded-xl border border-sand-300 bg-sand-50 font-medium text-brand-950"
                />
                <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                  <span className="text-[10px] text-sand-500 font-semibold">Quick Names:</span>
                  {PAKISTANI_NAME_PRESETS.slice(0, 6).map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setAddCustomerName(name)}
                      className="px-2 py-0.5 rounded-md bg-sand-100 hover:bg-sand-200 text-[10px] font-medium text-brand-800"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* City / Location */}
              <div>
                <label className="block font-bold text-brand-900 mb-1">City / Location</label>
                <input
                  type="text"
                  value={addCity}
                  onChange={(e) => setAddCity(e.target.value)}
                  placeholder="e.g. Lahore, DHA Phase 5"
                  className="w-full p-2.5 rounded-xl border border-sand-300 bg-sand-50 font-medium text-brand-950"
                />
                <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                  <span className="text-[10px] text-sand-500 font-semibold">Cities:</span>
                  {PAKISTANI_CITY_PRESETS.slice(0, 5).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setAddCity(city)}
                      className="px-2 py-0.5 rounded-md bg-sand-100 hover:bg-sand-200 text-[10px] font-medium text-brand-800"
                    >
                      {city.split(",")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block font-bold text-brand-900 mb-1">Star Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setAddRating(s)}
                      className="p-1 text-sand-300 hover:text-gold-500 transition-colors"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          s <= addRating ? "text-gold-500 fill-current" : "text-sand-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-brand-800 ml-2">{addRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-900 mb-1">Review Headline</label>
                <input
                  type="text"
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                  placeholder="e.g. Pure Swiss Lawn & Neat Embroidery"
                  className="w-full p-2.5 rounded-xl border border-sand-300 bg-sand-50 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-900 mb-1">
                  Review Text (Desi style customer experience) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={addComment}
                  onChange={(e) => setAddComment(e.target.value)}
                  placeholder="e.g. Alhamdulillah received my parcel today! Fabric bohot soft aur breathable hai, dupatta fall is so gorgeous. Highly recommend Tauheed Textile!"
                  className="w-full p-2.5 rounded-xl border border-sand-300 bg-sand-50 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-900 mb-1">
                  Customer Unboxing Photo URL (Optional)
                </label>
                <input
                  type="text"
                  value={addImageUrl}
                  onChange={(e) => setAddImageUrl(e.target.value)}
                  placeholder="/assets/prod-nafasat.jpg or photo URL"
                  className="w-full p-2.5 rounded-xl border border-sand-300 bg-sand-50 font-mono text-[11px]"
                />
              </div>

              {/* APPROVE REVIEW OPTION BEFORE UPLOADING ON WEBSITE */}
              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-300 space-y-2.5">
                <p className="font-bold text-brand-950 uppercase tracking-wider text-[11px]">
                  Website Upload & Approval Status:
                </p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="approvalStatus"
                      checked={addIsApproved}
                      onChange={() => setAddIsApproved(true)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-bold text-emerald-800 block">
                        ✅ Approve & Upload to Website Immediately
                      </span>
                      <span className="text-[10px] text-brand-500">
                        Will be live immediately on storefront and product pages.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="approvalStatus"
                      checked={!addIsApproved}
                      onChange={() => setAddIsApproved(false)}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <span className="font-bold text-amber-900 block">
                        ⏳ Hold as Pending (Require Approval Before Uploading)
                      </span>
                      <span className="text-[10px] text-brand-500">
                        Kept hidden in Admin until you explicitly click "Approve for Web".
                      </span>
                    </div>
                  </label>
                </div>

                <div className="pt-2 border-t border-sand-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addIsFeatured}
                      onChange={(e) => setAddIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500"
                    />
                    <span className="font-bold text-brand-900">Feature on homepage reviews slider</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-sand-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-sand-300 text-brand-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdd}
                  className="px-6 py-2 rounded-xl bg-brand-950 hover:bg-black text-white font-bold uppercase tracking-wider shadow-md disabled:opacity-50"
                >
                  {isSubmittingAdd ? "Saving..." : "Add Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
