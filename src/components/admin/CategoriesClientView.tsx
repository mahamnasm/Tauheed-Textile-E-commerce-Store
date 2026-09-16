"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  FolderPlus, 
  Plus, 
  Trash2, 
  Edit3, 
  Layers, 
  ChevronRight, 
  ChevronDown, 
  X, 
  Check, 
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";

interface SubcategoryItem {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  subcategories: SubcategoryItem[];
  _count?: {
    products: number;
  };
}

export default function CategoriesClientView({
  initialCategories = [],
}: {
  initialCategories: CategoryItem[];
}) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  // Category Modal
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catImage, setCatImage] = useState("");
  const [savingCat, setSavingCat] = useState(false);

  // Subcategory Modal
  const [showSubModal, setShowSubModal] = useState(false);
  const [targetParentCatId, setTargetParentCatId] = useState<string>("");
  const [editingSub, setEditingSub] = useState<SubcategoryItem | null>(null);
  const [subName, setSubName] = useState("");
  const [subSlug, setSubSlug] = useState("");
  const [savingSub, setSavingSub] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedCats((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Open Create Category Modal
  const handleOpenNewCat = () => {
    setEditingCat(null);
    setCatName("");
    setCatSlug("");
    setCatDesc("");
    setCatImage("/assets/banners/banner-lawn.jpg");
    setShowCatModal(true);
  };

  // Open Edit Category Modal
  const handleOpenEditCat = (cat: CategoryItem) => {
    setEditingCat(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDesc(cat.description || "");
    setCatImage(cat.image || "/assets/banners/banner-lawn.jpg");
    setShowCatModal(true);
  };

  // Save Category (Create or Edit)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    setSavingCat(true);

    try {
      if (editingCat) {
        // Edit
        const res = await fetch("/api/categories", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCat.id,
            name: catName,
            slug: catSlug,
            description: catDesc,
            image: catImage,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingCat.id
                ? { ...c, name: catName, slug: catSlug || c.slug, description: catDesc, image: catImage }
                : c
            )
          );
          toast.success("Category updated!");
          setShowCatModal(false);
        } else {
          toast.error(data.error || "Failed to update category");
        }
      } else {
        // Create
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: catName,
            slug: catSlug,
            description: catDesc,
            image: catImage,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCategories((prev) => [...prev, { ...data.category, subcategories: [] }]);
          toast.success("New category added!");
          setShowCatModal(false);
        } else {
          toast.error(data.error || "Failed to create category");
        }
      }
    } catch {
      toast.error("Network error while saving category");
    } finally {
      setSavingCat(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}" and its subcategories?`)) return;
    try {
      const res = await fetch(`/api/categories?id=${id}&type=category`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        toast.success(`Category "${name}" deleted`);
      }
    } catch {
      toast.error("Failed to delete category");
    }
  };

  // Open Add Subcategory Modal
  const handleOpenAddSub = (parentId: string) => {
    setTargetParentCatId(parentId);
    setEditingSub(null);
    setSubName("");
    setSubSlug("");
    setShowSubModal(true);
  };

  // Open Edit Subcategory Modal
  const handleOpenEditSub = (parentId: string, sub: SubcategoryItem) => {
    setTargetParentCatId(parentId);
    setEditingSub(sub);
    setSubName(sub.name);
    setSubSlug(sub.slug);
    setShowSubModal(true);
  };

  // Save Subcategory (Create or Edit)
  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !targetParentCatId) return;
    setSavingSub(true);

    try {
      if (editingSub) {
        const res = await fetch("/api/categories", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "subcategory",
            id: editingSub.id,
            name: subName,
            slug: subSlug,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCategories((prev) =>
            prev.map((c) => {
              if (c.id !== targetParentCatId) return c;
              return {
                ...c,
                subcategories: c.subcategories.map((s) =>
                  s.id === editingSub.id ? { ...s, name: subName, slug: subSlug || s.slug } : s
                ),
              };
            })
          );
          toast.success("Subcategory updated!");
          setShowSubModal(false);
        } else {
          toast.error(data.error || "Failed to update subcategory");
        }
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "subcategory",
            categoryId: targetParentCatId,
            name: subName,
            slug: subSlug,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCategories((prev) =>
            prev.map((c) => {
              if (c.id !== targetParentCatId) return c;
              return {
                ...c,
                subcategories: [...(c.subcategories || []), data.subcategory],
              };
            })
          );
          setExpandedCats((prev) => ({ ...prev, [targetParentCatId]: true }));
          toast.success("Subcategory added!");
          setShowSubModal(false);
        } else {
          toast.error(data.error || "Failed to add subcategory");
        }
      }
    } catch {
      toast.error("Network error while saving subcategory");
    } finally {
      setSavingSub(false);
    }
  };

  // Delete Subcategory
  const handleDeleteSubcategory = async (catId: string, subId: string, subName: string) => {
    if (!confirm(`Delete subcategory "${subName}"?`)) return;
    try {
      const res = await fetch(`/api/categories?id=${subId}&type=subcategory`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) => {
            if (c.id !== catId) return c;
            return {
              ...c,
              subcategories: c.subcategories.filter((s) => s.id !== subId),
            };
          })
        );
        toast.success(`Subcategory "${subName}" deleted`);
      }
    } catch {
      toast.error("Failed to delete subcategory");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-brand-950">
            Collections & Subcategories Manager
          </h1>
          <p className="text-xs text-brand-600 mt-1">
            Dynamically add, edit, or customize product categories and expandable subcategories anytime.
          </p>
        </div>

        <button
          onClick={handleOpenNewCat}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-950 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
        >
          <FolderPlus className="w-4 h-4 text-gold-400" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const isExpanded = !!expandedCats[cat.id];
          const subCount = cat.subcategories?.length || 0;
          const prodCount = cat._count?.products || 0;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden transition-all"
            >
              {/* Category Header Row */}
              <div className="p-4 sm:p-5 flex items-center justify-between gap-4 bg-white">
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => toggleExpand(cat.id)}
                    className="p-1 rounded-lg text-brand-400 hover:bg-sand-100 transition-colors shrink-0"
                    title={isExpanded ? "Collapse subcategories" : "Expand subcategories"}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-brand-700" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-brand-500" />
                    )}
                  </button>

                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-sand-100 border border-sand-200 shrink-0 hidden sm:block">
                    <Image
                      src={cat.image || "/assets/banners/banner-lawn.jpg"}
                      alt={cat.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif font-bold text-base text-brand-950 truncate">
                        {cat.name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sand-100 text-brand-600 border border-sand-200">
                        slug: /{cat.slug}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-brand-500 mt-0.5">
                      <span>{subCount} Subcategories</span>
                      <span>•</span>
                      <span>{prodCount} Active Dresses</span>
                    </div>
                  </div>
                </div>

                {/* Category Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenAddSub(cat.id)}
                    className="px-3 py-1.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-brand-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Add subcategory to this collection"
                  >
                    <Plus className="w-3.5 h-3.5 text-gold-700" />
                    <span className="hidden sm:inline">Add Subcategory</span>
                  </button>

                  <Link
                    href={`/shop?category=${cat.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg text-brand-400 hover:text-brand-900 hover:bg-sand-100 transition-colors"
                    title="View live in shop"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleOpenEditCat(cat)}
                    className="p-2 rounded-lg text-brand-600 hover:bg-sand-100 transition-colors"
                    title="Edit category"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-2 rounded-lg text-maroon-600 hover:bg-maroon-50 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subcategories Accordion Content */}
              {isExpanded && (
                <div className="bg-sand-50/60 border-t border-sand-200 p-4 sm:p-5 pl-8 sm:pl-16 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-gold-600" /> Subcategories
                    </span>
                    <button
                      onClick={() => handleOpenAddSub(cat.id)}
                      className="text-xs font-bold text-gold-700 hover:text-gold-900 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add another
                    </button>
                  </div>

                  {subCount === 0 ? (
                    <div className="p-4 bg-white rounded-xl border border-sand-200 text-center text-xs text-brand-500">
                      No subcategories created yet for {cat.name}. Click "Add Subcategory" to create filters like 2 Piece, 3 Piece, Printed, or Embroidered.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {cat.subcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="bg-white p-3 rounded-xl border border-sand-200 shadow-sm flex items-center justify-between gap-2"
                        >
                          <div>
                            <p className="font-semibold text-xs text-brand-950">{sub.name}</p>
                            <span className="text-[10px] text-brand-500 font-mono">
                              /{sub.slug}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleOpenEditSub(cat.id, sub)}
                              className="p-1 text-brand-500 hover:text-brand-900 rounded"
                              title="Edit subcategory"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSubcategory(cat.id, sub.id, sub.name)}
                              className="p-1 text-maroon-500 hover:text-maroon-700 rounded"
                              title="Delete subcategory"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Category Modal (Create / Edit) */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCatModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <h3 className="font-serif font-bold text-lg text-brand-950">
                {editingCat ? `Edit Category: ${editingCat.name}` : "Create New Category"}
              </h3>
              <button
                onClick={() => setShowCatModal(false)}
                className="p-1 rounded-full text-brand-400 hover:bg-sand-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brand-900 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lawn Formals, Organza Formals"
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (!editingCat) {
                      setCatSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)+/g, "")
                      );
                    }
                  }}
                  className="w-full p-2.5 rounded-lg border border-sand-300 bg-sand-50 focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-900 mb-1">URL Slug</label>
                <input
                  type="text"
                  placeholder="e.g. lawn-formals"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-sand-300 bg-sand-50 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-900 mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="/assets/banners/banner-lawn.jpg"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-sand-300 bg-sand-50 focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-900 mb-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Brief overview of this luxury collection..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-sand-300 bg-sand-50 focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="px-4 py-2 rounded-lg bg-sand-200 text-brand-900 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCat}
                  className="px-5 py-2 rounded-lg bg-brand-900 text-white font-bold hover:bg-brand-950"
                >
                  {savingCat ? "Saving..." : editingCat ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcategory Modal (Create / Edit) */}
      {showSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSubModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <h3 className="font-serif font-bold text-lg text-brand-950">
                {editingSub ? `Edit Subcategory` : "Add Subcategory"}
              </h3>
              <button
                onClick={() => setShowSubModal(false)}
                className="p-1 rounded-full text-brand-400 hover:bg-sand-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubcategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brand-900 mb-1">Subcategory Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2 Piece, 3 Piece, Maxi, Sari, Embroidered"
                  value={subName}
                  onChange={(e) => {
                    setSubName(e.target.value);
                    if (!editingSub) {
                      setSubSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)+/g, "")
                      );
                    }
                  }}
                  className="w-full p-2.5 rounded-lg border border-sand-300 bg-sand-50 focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-900 mb-1">URL Slug</label>
                <input
                  type="text"
                  placeholder="e.g. 2-piece"
                  value={subSlug}
                  onChange={(e) => setSubSlug(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-sand-300 bg-sand-50 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubModal(false)}
                  className="px-4 py-2 rounded-lg bg-sand-200 text-brand-900 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSub}
                  className="px-5 py-2 rounded-lg bg-brand-900 text-white font-bold hover:bg-brand-950"
                >
                  {savingSub ? "Saving..." : editingSub ? "Update Subcategory" : "Add Subcategory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
