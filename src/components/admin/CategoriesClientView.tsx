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
  ExternalLink,
  Upload
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
  const [catImage, setCatImage] = useState("");
  const [savingCat, setSavingCat] = useState(false);
  const [uploadingCatImg, setUploadingCatImg] = useState(false);

  const handleUploadCatImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCatImg(true);
    const formData = new FormData();
    formData.append("files", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (res.ok && json.success && (json.url || json.urls?.[0])) {
        const url = json.url || json.urls[0];
        setCatImage(url);
        toast.success("Category photo uploaded from gallery!");
      } else {
        toast.error(json.error || "Failed to upload image");
      }
    } catch (err: any) {
      toast.error(err.message || "Upload error");
    } finally {
      setUploadingCatImg(false);
      e.target.value = "";
    }
  };

  // Subcategory Modal
  const [showSubModal, setShowSubModal] = useState(false);
  const [targetParentCatId, setTargetParentCatId] = useState<string>("");
  const [editingSub, setEditingSub] = useState<SubcategoryItem | null>(null);
  const [subName, setSubName] = useState("");
  const [savingSub, setSavingSub] = useState(false);

  const toSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const toggleExpand = (id: string) => {
    setExpandedCats((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Open Create Category Modal
  const handleOpenNewCat = () => {
    setEditingCat(null);
    setCatName("");
    setCatImage("/assets/banners/banner-lawn.jpg");
    setShowCatModal(true);
  };

  // Open Edit Category Modal
  const handleOpenEditCat = (cat: CategoryItem) => {
    setEditingCat(cat);
    setCatName(cat.name);
    setCatImage(cat.image || "/assets/banners/banner-lawn.jpg");
    setShowCatModal(true);
  };

  // Save Category (Create or Edit)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    setSavingCat(true);
    const autoSlug = toSlug(catName);

    try {
      if (editingCat) {
        const res = await fetch("/api/categories", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCat.id,
            name: catName.trim(),
            slug: editingCat.slug || autoSlug,
            image: catImage,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingCat.id
                ? { ...c, name: catName.trim(), image: catImage }
                : c
            )
          );
          toast.success("Category updated!");
          setShowCatModal(false);
        } else {
          toast.error(data.error || "Failed to update category");
        }
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: catName.trim(),
            slug: autoSlug,
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
    setShowSubModal(true);
  };

  // Open Edit Subcategory Modal
  const handleOpenEditSub = (parentId: string, sub: SubcategoryItem) => {
    setTargetParentCatId(parentId);
    setEditingSub(sub);
    setSubName(sub.name);
    setShowSubModal(true);
  };

  // Save Subcategory (Create or Edit)
  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !targetParentCatId) return;
    setSavingSub(true);
    const autoSlug = toSlug(subName);

    try {
      if (editingSub) {
        const res = await fetch("/api/categories", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "subcategory",
            id: editingSub.id,
            name: subName.trim(),
            slug: editingSub.slug || autoSlug,
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
                  s.id === editingSub.id ? { ...s, name: subName.trim() } : s
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
            name: subName.trim(),
            slug: autoSlug,
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
              <div className="p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleExpand(cat.id)}
                    className="p-1.5 rounded-lg text-brand-500 hover:bg-sand-100 transition-colors shrink-0 cursor-pointer"
                    title={isExpanded ? "Collapse subcategories" : "Expand subcategories"}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-brand-700" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-brand-500" />
                    )}
                  </button>

                  <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-sand-100 border border-sand-200 shrink-0">
                    <Image
                      src={cat.image || "/assets/banners/banner-lawn.jpg"}
                      alt={cat.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif font-bold text-base text-brand-950 leading-snug">
                      {cat.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-brand-500 mt-0.5">
                      <span>{subCount} Subcategories</span>
                      <span>•</span>
                      <span>{prodCount} Dresses</span>
                    </div>
                  </div>
                </div>

                {/* Category Actions */}
                <div className="flex items-center flex-wrap justify-end gap-2 shrink-0 border-t sm:border-t-0 border-sand-100 pt-2.5 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditCat(cat)}
                    className="px-3 py-1.5 rounded-lg bg-brand-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Edit category"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-gold-400" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenAddSub(cat.id)}
                    className="px-3 py-1.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-brand-900 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Add subcategory to this collection"
                  >
                    <Plus className="w-3.5 h-3.5 text-gold-700" />
                    <span>+ Sub</span>
                  </button>

                  <Link
                    href={`/shop?category=${cat.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg text-brand-500 hover:text-brand-900 hover:bg-sand-100 transition-colors"
                    title="View live in shop"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="px-2.5 py-1.5 rounded-lg text-maroon-600 hover:bg-maroon-50 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>

              {/* Subcategories Accordion Content */}
              {isExpanded && (
                <div className="bg-sand-50/60 border-t border-sand-200 p-3.5 sm:p-5 sm:pl-14 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-gold-600" /> Subcategories
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenAddSub(cat.id)}
                      className="text-xs font-bold text-gold-700 hover:text-gold-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add another
                    </button>
                  </div>

                  {subCount === 0 ? (
                    <div className="p-4 bg-white rounded-xl border border-sand-200 text-center text-xs text-brand-500">
                      No subcategories created yet for {cat.name}. Click &quot;Add Sub&quot; to create filters.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                      {cat.subcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="bg-white p-3 rounded-xl border border-sand-200 shadow-sm flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-brand-950 truncate">{sub.name}</p>
                            <span className="text-[10px] text-brand-500 font-mono truncate block">
                              /{sub.slug}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEditSub(cat.id, sub)}
                              className="p-1.5 text-brand-600 hover:text-brand-950 hover:bg-sand-100 rounded-lg cursor-pointer"
                              title="Edit subcategory"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubcategory(cat.id, sub.id, sub.name)}
                              className="p-1.5 text-maroon-500 hover:text-maroon-700 hover:bg-maroon-50 rounded-lg cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowCatModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-4 sm:p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <h3 className="font-serif font-bold text-base sm:text-lg text-brand-950 truncate pr-2">
                {editingCat ? `Edit Category: ${editingCat.name}` : "Create New Category"}
              </h3>
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                className="p-1.5 rounded-full text-brand-500 hover:bg-sand-100 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brand-900 mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lawn Formals, Organza Formals"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-sand-300 bg-sand-50 text-brand-950 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-brand-900">Cover Photo</label>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-sand-200 bg-sand-50">
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-sand-200 border border-sand-300 shrink-0">
                    {catImage ? (
                      <Image
                        src={catImage}
                        alt="Category cover"
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <label className="flex-1 cursor-pointer py-3 px-4 bg-brand-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all">
                    <Upload className="w-4 h-4 text-gold-400" />
                    <span>{uploadingCatImg ? "Uploading..." : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingCatImg}
                      onChange={handleUploadCatImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="flex-1 py-3 rounded-xl bg-sand-200 text-brand-900 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCat}
                  className="flex-1 py-3 rounded-xl bg-brand-900 text-white font-bold hover:bg-black cursor-pointer shadow"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowSubModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-4 sm:p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <h3 className="font-serif font-bold text-base sm:text-lg text-brand-950">
                {editingSub ? "Edit Subcategory" : "Add Subcategory"}
              </h3>
              <button
                type="button"
                onClick={() => setShowSubModal(false)}
                className="p-1.5 rounded-full text-brand-500 hover:bg-sand-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubcategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brand-900 mb-1.5">Subcategory Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unstitched 3-Piece, Printed Lawn"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-sand-300 bg-sand-50 text-brand-950 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubModal(false)}
                  className="flex-1 py-3 rounded-xl bg-sand-200 text-brand-900 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSub}
                  className="flex-1 py-3 rounded-xl bg-brand-900 text-white font-bold hover:bg-black cursor-pointer shadow"
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
