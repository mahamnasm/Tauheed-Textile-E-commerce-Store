"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Download, X, Check, ShoppingBag, Eye, Trash2, Star, Sparkles, Image as ImageIcon, Video, Tag, Layers, ArrowUp, Calendar, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseVideoUrl } from "@/lib/videoUtils";

interface AdminProductsClientViewProps {
  products: any[];
  categories: any[];
  collections?: any[];
}

const LUXURY_ASSET_PRESETS = [
  { label: "Nafasat Chiffon", url: "/assets/prod-nafasat.jpg" },
  { label: "Armani Lawn", url: "/assets/prod-armani.jpg" },
  { label: "Trendz Pret", url: "/assets/prod-trendz.jpg" },
  { label: "Shrenz Kalidar", url: "/assets/prod-shrenz.jpg" },
  { label: "Al-Hassan Noir", url: "/assets/prod-alhassan.jpg" },
  { label: "DesignsNow Pret", url: "/assets/prod-designsnow.jpg" },
  { label: "Imperial Velvet", url: "/assets/prod-velvet.jpg" },
  { label: "Bridal Barat", url: "/assets/prod-bridal.jpg" },
  { label: "Meher Co-ord", url: "/assets/prod-meher.jpg" },
  { label: "Bano Lawn", url: "/assets/prod-bano.jpg" },
  { label: "Editorial Peach", url: "/assets/hero-model.jpg" },
  { label: "Emerald Reel", url: "/assets/reel-1.jpg" },
  { label: "Pastel Reel", url: "/assets/reel-2.jpg" },
];

export default function AdminProductsClientView({
  products,
  categories,
  collections = [],
}: AdminProductsClientViewProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [fabric, setFabric] = useState("Luxury Lawn & Pure Silk");
  const [workType, setWorkType] = useState("Resham & Tilla Embroidery");
  const [pieceCount, setPieceCount] = useState("3");
  const [weight, setWeight] = useState("1.0");
  const [basePrice, setBasePrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [collectionId, setCollectionId] = useState(collections[0]?.id || "");
  const [initialStock, setInitialStock] = useState("30");
  const [description, setDescription] = useState("");
  const [packageIncludes, setPackageIncludes] = useState("");
  const [careInstructions, setCareInstructions] = useState("Dry clean recommended. Gentle hand wash in cold water.");
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSale, setIsSale] = useState(false);
  const [isPreOrder, setIsPreOrder] = useState(false);
  const [preOrderDate, setPreOrderDate] = useState("");

  // Multi-Image State: starts EMPTY so admin uploads their own chosen pictures
  const [images, setImages] = useState<string[]>([]);

  const handleAddImageSlot = () => {
    setImages((prev) => [...prev, ""]);
  };

  const handleUpdateImage = (index: number, newUrl: string) => {
    setImages((prev) => {
      const copy = [...prev];
      copy[index] = newUrl;
      return copy;
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetAsCover = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [chosen] = copy.splice(index, 1);
      copy.unshift(chosen);
      return copy;
    });
  };

  const [uploadingPC, setUploadingPC] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const handlePCFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPC(true);
    setUploadProgress(`Uploading ${files.length} image(s) from your PC...`);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success && json.urls) {
        setImages((prev) => [...prev, ...json.urls]);
        setUploadProgress(`Successfully uploaded ${json.urls.length} photo(s) from your PC!`);
        setTimeout(() => setUploadProgress(""), 4000);
      } else {
        alert(json.error || "Failed to upload files from PC.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload files from PC.");
    } finally {
      setUploadingPC(false);
      e.target.value = "";
    }
  };

  const [uploadingVideo, setUploadingVideo] = useState(false);
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success && (json.url || json.urls?.[0])) {
        const uploaded = json.url || json.urls[0];
        setVideoUrl(uploaded);
      } else {
        alert(json.error || "Failed to upload video.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload video.");
    } finally {
      setUploadingVideo(false);
      e.target.value = "";
    }
  };

  const [aiLoading, setAiLoading] = useState(false);
  const [aiBanner, setAiBanner] = useState("");

  const handleGenerateAICopy = async () => {
    if (!title.trim()) {
      alert("Please enter a Product Title first so the AI knows what to write about.");
      return;
    }
    setAiLoading(true);
    setAiBanner("");
    try {
      const selectedCat = categories.find((c) => c.id === categoryId);
      const res = await fetch("/api/ai/copywriter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          categoryName: selectedCat?.name || "",
          fabricHint: fabric,
          workHint: workType,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        const data = json.data;
        if (data.description) setDescription(data.description);
        if (data.fabric) setFabric(data.fabric);
        if (data.workType) setWorkType(data.workType);
        if (data.packageIncludes) setPackageIncludes(data.packageIncludes);
        if (data.suggestedPrice && !basePrice) setBasePrice(data.suggestedPrice.toString());
        setAiBanner("✨ AI Haute Couture Copy & Specs generated successfully!");
      } else {
        alert(json.error || "Failed to generate copy.");
      }
    } catch (e: any) {
      alert(e.message || "Failed to connect to AI copywriter.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const filteredImages = images.map((i) => i.trim()).filter(Boolean);
      if (filteredImages.length === 0) {
        throw new Error("Please add at least one product image.");
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          sku,
          barcode: barcode || null,
          videoUrl: videoUrl || null,
          fabric,
          workType,
          pieceCount,
          weight: parseFloat(weight) || 1.0,
          basePrice,
          comparePrice: comparePrice || null,
          costPrice: costPrice || null,
          categoryId: categoryId || null,
          collectionId: collectionId || null,
          images: filteredImages,
          imageUrl: filteredImages[0],
          initialStock,
          description,
          packageIncludes,
          careInstructions,
          isNewArrival,
          isBestSeller,
          isFeatured,
          isSale,
          isPreOrder,
          preOrderDate: isPreOrder ? preOrderDate : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      setIsModalOpen(false);
      // Reset form
      setTitle("");
      setSku("");
      setBarcode("");
      setBasePrice("");
      setComparePrice("");
      setCostPrice("");
      setDescription("");
      setPackageIncludes("");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sand-300 pb-5 sm:pb-6">
        <div>
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gold-700">Catalog Engine</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950 mt-1">Product Management</h1>
          <p className="text-xs text-brand-600 mt-1">
            Manage luxury collections, multi-angle images ({">"} 5 photos), fabrics, variants, and stock
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2.5 bg-brand-900 hover:bg-brand-950 text-sand-50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4 text-gold-400" /> Add New Product
          </button>
          <a
            href="/api/products/csv"
            className="flex-1 sm:flex-none justify-center px-3 sm:px-4 py-2.5 bg-white hover:bg-sand-50 border border-sand-300 text-brand-900 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-gold-700" /> Export CSV
          </a>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-sand-50 text-brand-800 uppercase">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Category</th>
                <th className="p-3">Gallery</th>
                <th className="p-3">Fabric</th>
                <th className="p-3">Price (PKR)</th>
                <th className="p-3">Variants</th>
                <th className="p-3">Stock</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Storefront</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {products.map((p) => {
                const totalStock = p.variants?.reduce((sum: number, v: any) => sum + v.stockQuantity, 0) || 0;
                return (
                  <tr key={p.id} className="hover:bg-sand-50/60">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded bg-sand-100 overflow-hidden shrink-0">
                          <Image
                            src={p.images[0]?.url || "/assets/reel-2.jpg"}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-brand-950 line-clamp-1">{p.title}</p>
                          <span className="text-[10px] text-brand-500">{p.pieceCount}-Piece Ensemble</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-brand-700">{p.sku}</td>
                    <td className="p-3 text-brand-700">{p.category?.name || "Standard"}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-sand-100 text-brand-900 font-bold text-[10px]">
                        {p.images?.length || 1} image{p.images?.length === 1 ? "" : "s"}
                      </span>
                    </td>
                    <td className="p-3 text-brand-600">{p.fabric}</td>
                    <td className="p-3 font-serif font-bold text-brand-950">
                      Rs. {p.basePrice.toLocaleString()}
                    </td>
                    <td className="p-3 text-brand-700">
                      {p.variants?.length || 0} options
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        totalStock > 10 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {totalStock} units
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-sand-100 text-[10px] font-semibold text-emerald-800">
                        Active
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <Link
                        href={`/product/${p.slug}`}
                        target="_blank"
                        className="text-gold-700 hover:text-gold-800 font-bold"
                      >
                        Preview &rarr;
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brand-950/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto space-y-6 animate-fadeIn border border-sand-200">
            <div className="flex items-center justify-between border-b border-sand-200 pb-4">
              <div>
                <span className="text-xs font-bold text-gold-700 uppercase tracking-widest">Catalog Engine</span>
                <h3 className="font-serif font-bold text-2xl text-brand-950">Add New Luxury Product</h3>
                <p className="text-xs text-brand-500">Configure multi-angle photography, fabrics, pricing, and variants</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-brand-600 hover:bg-sand-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-maroon-50 border border-maroon-200 text-maroon-800 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-6 text-xs">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-sand-100 pb-1">
                  <h4 className="font-serif font-bold text-sm text-brand-950 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-gold-600" /> Basic Details
                  </h4>
                  <button
                    type="button"
                    onClick={handleGenerateAICopy}
                    disabled={aiLoading}
                    className="flex items-center gap-1.5 px-3 py-1 bg-gold-600 hover:bg-gold-500 text-brand-950 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all shadow-sm disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? "animate-spin" : "animate-pulse"}`} />
                    {aiLoading ? "Crafting Luxury Copy..." : "✨ Generate Specs with AI"}
                  </button>
                </div>

                {aiBanner && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] font-medium flex items-center justify-between">
                    <span>{aiBanner}</span>
                    <button type="button" onClick={() => setAiBanner("")} className="text-emerald-600 hover:text-emerald-800">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mahnoor Velvet Embroidered 3-Piece"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 text-brand-950 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Article SKU *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TT-VLV-007"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 uppercase font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Category *</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-medium text-brand-950"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Collection</label>
                    <select
                      value={collectionId}
                      onChange={(e) => setCollectionId(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-medium text-brand-950"
                    >
                      <option value="">None (Standard Collection)</option>
                      {collections.map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Barcode / EAN (Optional)</label>
                    <input
                      type="text"
                      placeholder="896400012345"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Fabric & Workmanship */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-sm text-brand-950 border-b border-sand-100 pb-1 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gold-600" /> Fabric & Workmanship
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Fabric Type *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pure Crinkle Chiffon & Silk"
                      value={fabric}
                      onChange={(e) => setFabric(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Work / Embroidery Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Tilla, Zari, Cutwork & Micro-Sequins"
                      value={workType}
                      onChange={(e) => setWorkType(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Piece Count</label>
                    <select
                      value={pieceCount}
                      onChange={(e) => setPieceCount(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-medium"
                    >
                      <option value="3">3 Piece (Shirt, Trouser, Dupatta)</option>
                      <option value="2">2 Piece (Shirt & Trouser / Dupatta)</option>
                      <option value="1">1 Piece (Kurta / Kalidar / Shawl)</option>
                      <option value="4">4 Piece (Includes Inner Lining Slip)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">
                      Parcel Weight (KG) <span className="text-[10px] text-brand-500">(Auto-calculates Delivery)</span>
                    </label>
                    <div className="space-y-1.5">
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="1.0"
                        className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-bold text-brand-950 font-mono"
                      />
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {[
                          { label: "0.5kg (Silk)", val: "0.5" },
                          { label: "0.8kg (2-pc)", val: "0.8" },
                          { label: "1.0kg (3-pc Lawn)", val: "1.0" },
                          { label: "1.5kg (Bridal)", val: "1.5" },
                        ].map((p) => (
                          <button
                            key={p.val}
                            type="button"
                            onClick={() => setWeight(p.val)}
                            className={`px-2 py-0.5 rounded border transition-colors ${
                              weight === p.val
                                ? "bg-brand-950 text-white border-brand-950 font-bold"
                                : "bg-white text-brand-700 border-sand-300 hover:bg-sand-100"
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-sm text-brand-950 border-b border-sand-100 pb-1 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-gold-600" /> Pricing & Inventory
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Selling Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      placeholder="12950"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-bold text-brand-950"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Compare Price (Strike-through)</label>
                    <input
                      type="number"
                      placeholder="15500"
                      value={comparePrice}
                      onChange={(e) => setComparePrice(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Initial Stock Units</label>
                    <input
                      type="number"
                      placeholder="30"
                      value={initialStock}
                      onChange={(e) => setInitialStock(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50"
                    />
                  </div>
                </div>
              </div>

              {/* MULTI-IMAGE GALLERY (MORE THAN 5 IMAGES SUPPORT) */}
              <div className="space-y-3 p-4 rounded-2xl bg-sand-50/80 border border-sand-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-sand-200 pb-3">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-brand-950 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-gold-600" /> Product Gallery ({images.length} Images Added)
                    </h4>
                    <p className="text-[11px] text-brand-600 mt-0.5">
                      Add more than 5 images (unlimited multi-angle photography supported). First photo is the main cover image.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {images.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Are you sure you want to remove all images and start fresh with your own pictures?")) {
                            setImages([]);
                          }
                        }}
                        className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
                        title="Remove all pre-filled images and start fresh"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>🗑️ Remove All Images (Start Fresh)</span>
                      </button>
                    )}

                    <label
                      htmlFor="pc-image-upload-top"
                      className="cursor-pointer px-3.5 py-1.5 bg-brand-900 hover:bg-black text-sand-50 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Upload className="w-3.5 h-3.5 text-gold-400" /> 📱 Upload from Gallery / PC
                    </label>
                    <input
                      id="pc-image-upload-top"
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={uploadingPC}
                      onChange={handlePCFileUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={handleAddImageSlot}
                      className="px-3 py-1.5 bg-sand-200 hover:bg-sand-300 text-brand-900 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> URL Slot
                    </button>
                  </div>
                </div>

                {/* PC / Phone File Upload Dropzone */}
                <label
                  htmlFor="pc-image-upload-dropzone"
                  className="cursor-pointer border-2 border-dashed border-gold-400/70 hover:border-gold-600 bg-sand-100/70 hover:bg-sand-100 p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all group"
                >
                  <input
                    id="pc-image-upload-dropzone"
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploadingPC}
                    onChange={handlePCFileUpload}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-gold-100 border border-gold-300 flex items-center justify-center text-gold-700 mb-1.5 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-xs text-brand-950">
                    {uploadingPC ? "Uploading Photos from Device..." : "📱 Click to Browse Gallery or Drag & Drop Photos from PC / Phone"}
                  </p>
                  <p className="text-[11px] text-brand-600 mt-0.5">
                    Select multiple high-resolution photos (.jpg, .png, .webp). Photos are uploaded instantly and ready for ordering.
                  </p>
                </label>

                {uploadProgress && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] font-bold flex items-center gap-2 animate-fadeIn">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{uploadProgress}</span>
                  </div>
                )}

                {/* Image Thumbnails Strip or Clean Empty State */}
                {images.length === 0 ? (
                  <div className="p-6 border-2 border-dashed border-sand-300 rounded-2xl text-center bg-sand-50/60 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-sand-200 text-brand-600 flex items-center justify-center mb-2">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-xs text-brand-950">No dress photos added yet</p>
                    <p className="text-[11px] text-brand-500 mt-0.5 max-w-sm">
                      Upload your own pictures from your PC / Phone above, or click "+ Add Image Link" below to paste a photo link.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                    {images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-xl overflow-hidden border-2 p-1 bg-white shadow-sm flex flex-col justify-between group ${
                          idx === 0 ? "border-gold-600 ring-2 ring-gold-600/30" : "border-sand-200"
                        }`}
                      >
                        <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-sand-100">
                          {imgUrl ? (
                            <Image
                              src={imgUrl}
                              alt={`Product view ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sand-400 text-[10px]">
                              Empty Link
                            </div>
                          )}
                          <span className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            idx === 0 ? "bg-gold-600 text-white" : "bg-brand-950/70 text-sand-100"
                          }`}>
                            {idx === 0 ? "Main Cover" : `#${idx + 1}`}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 p-1 rounded bg-maroon-600 text-white opacity-80 hover:opacity-100 transition-opacity"
                            title="Remove image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="pt-1.5 flex items-center justify-between gap-1">
                          {idx !== 0 ? (
                            <button
                              type="button"
                              onClick={() => handleSetAsCover(idx)}
                              className="text-[10px] text-gold-700 hover:text-gold-900 font-bold flex items-center gap-0.5"
                            >
                              <ArrowUp className="w-2.5 h-2.5" /> Make Cover
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-700 font-bold">Primary</span>
                          )}
                          <span className="text-[10px] text-brand-400 font-mono">#{idx + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Editable URL Fields List for Custom Links */}
                <div className="space-y-2 pt-2 border-t border-sand-200">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-brand-900">
                      Paste Custom Image Paths (or click Add Image Link):
                    </label>
                    <button
                      type="button"
                      onClick={handleAddImageSlot}
                      className="px-2.5 py-1 rounded-md bg-sand-100 hover:bg-sand-200 text-brand-900 text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3 text-gold-700" /> Add Image Link
                    </button>
                  </div>
                  {images.length > 0 && (
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {images.map((imgUrl, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-16 text-[11px] font-semibold text-brand-700 shrink-0">
                            {idx === 0 ? "Cover (1):" : `Photo ${idx + 1}:`}
                          </span>
                          <input
                            type="text"
                            value={imgUrl}
                            onChange={(e) => handleUpdateImage(idx, e.target.value)}
                            placeholder="/assets/prod-nafasat.jpg or https://..."
                            className="flex-1 p-2 border border-sand-300 rounded-lg bg-white text-xs text-brand-900 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-2 text-maroon-600 hover:bg-maroon-50 rounded-lg shrink-0"
                            title="Delete photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* DRESS RUNWAY VIDEO (YOUTUBE, INSTAGRAM REEL, OR MP4) */}
              <div className="space-y-3 p-4 rounded-2xl bg-sand-50/80 border border-sand-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-sand-200 pb-2">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-brand-950 flex items-center gap-2">
                      <Video className="w-4 h-4 text-gold-600" /> Dress Runway Video (YouTube, Instagram Reel, or MP4)
                    </h4>
                    <p className="text-[11px] text-brand-600 mt-0.5">
                      Paste a YouTube Link (youtu.be / shorts), Instagram Reel URL, Direct MP4, or upload from your device.
                    </p>
                  </div>

                  <label className="cursor-pointer px-3.5 py-1.5 bg-brand-900 hover:bg-black text-sand-50 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all shrink-0">
                    <Upload className="w-3.5 h-3.5 text-gold-400" /> {uploadingVideo ? "Uploading..." : "Upload MP4 from Device"}
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      disabled={uploadingVideo}
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Paste YouTube Link (youtu.be / shorts), Instagram Reel URL, or MP4..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="flex-1 p-2.5 border border-sand-300 rounded-xl bg-white text-xs font-mono text-brand-950"
                    />
                    {videoUrl && (
                      <button
                        type="button"
                        onClick={() => setVideoUrl("")}
                        className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors shrink-0"
                      >
                        Clear Video
                      </button>
                    )}
                  </div>

                  {/* Video Type Detection & Live Preview */}
                  {videoUrl ? (() => {
                    const parsed = parseVideoUrl(videoUrl);
                    return (
                      <div className="p-3 bg-white border border-sand-200 rounded-xl flex items-center gap-3">
                        <div className="w-20 h-14 rounded-lg bg-black overflow-hidden relative shrink-0 border border-sand-300">
                          {parsed.type === "youtube" ? (
                            <iframe
                              src={parsed.embedUrl}
                              title="YouTube Preview"
                              className="w-full h-full border-0 pointer-events-none"
                            />
                          ) : parsed.type === "instagram" ? (
                            <iframe
                              src={parsed.embedUrl}
                              title="Instagram Preview"
                              className="w-full h-full border-0 pointer-events-none"
                            />
                          ) : (
                            <video src={videoUrl} className="w-full h-full object-cover" muted />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              parsed.type === "youtube"
                                ? "bg-red-100 text-red-700"
                                : parsed.type === "instagram"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}>
                              {parsed.type === "youtube" ? "▶️ YouTube Video / Short" : parsed.type === "instagram" ? "📸 Instagram Reel" : "🎥 MP4 Video"}
                            </span>
                            <span className="text-[11px] font-semibold text-brand-900">Plays directly on main website</span>
                          </div>
                          <p className="text-[10px] font-mono text-brand-500 truncate mt-0.5">
                            {videoUrl}
                          </p>
                        </div>
                      </div>
                    );
                  })() : (
                    <span className="text-[11px] text-sand-500 italic block">No video attached (supports YouTube Shorts/Videos, Instagram Reels, and direct MP4)</span>
                  )}
                </div>
              </div>

              {/* Package Inclusions & Care Details */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-sm text-brand-950 border-b border-sand-100 pb-1">
                  Product Narrative & Care
                </h4>

                <div>
                  <label className="block font-bold text-brand-900 mb-1">Package Contents Breakdown</label>
                  <input
                    type="text"
                    placeholder="e.g. Embroidered Shirt 3m, Pure Silk Dupatta 2.5m, Dyed Trouser 2.5m, Embroidered Daman Patches"
                    value={packageIncludes}
                    onChange={(e) => setPackageIncludes(e.target.value)}
                    className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Product Description</label>
                    <textarea
                      rows={2}
                      placeholder="Editorial story, embroidery aesthetics, and occasion wear styling..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Care & Preservation Instructions</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Dry clean recommended. Store in cotton cover. Avoid spraying perfume on zari."
                      value={careInstructions}
                      onChange={(e) => setCareInstructions(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-brand-900 mb-1">Video Reel / Runway URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://example.com/videos/dress-walk.mp4"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-mono"
                  />
                </div>
              </div>

              {/* Badges & Special Features */}
              <div className="space-y-3 pt-2">
                <h4 className="font-serif font-bold text-sm text-brand-950 border-b border-sand-100 pb-1">
                  Storefront Badges & Launch Options
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-sand-200 bg-sand-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNewArrival}
                      onChange={(e) => setIsNewArrival(e.target.checked)}
                      className="rounded text-gold-600 focus:ring-gold-500"
                    />
                    <span className="font-semibold text-brand-900">New Arrival</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl border border-sand-200 bg-sand-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                      className="rounded text-gold-600 focus:ring-gold-500"
                    />
                    <span className="font-semibold text-brand-900">Bestseller</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl border border-sand-200 bg-sand-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded text-gold-600 focus:ring-gold-500"
                    />
                    <span className="font-semibold text-brand-900">Featured</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl border border-sand-200 bg-sand-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSale}
                      onChange={(e) => setIsSale(e.target.checked)}
                      className="rounded text-gold-600 focus:ring-gold-500"
                    />
                    <span className="font-semibold text-brand-900">Sale Special</span>
                  </label>
                </div>

                {/* Pre-Order Option */}
                <div className="p-3 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPreOrder}
                      onChange={(e) => setIsPreOrder(e.target.checked)}
                      className="rounded text-gold-600 focus:ring-gold-500"
                    />
                    <span className="font-semibold text-brand-900">Enable Pre-Order for this Product</span>
                  </label>

                  {isPreOrder && (
                    <div className="pt-2">
                      <label className="block font-bold text-brand-900 mb-1">Expected Dispatch Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Dispatches on 25th September 2026"
                        value={preOrderDate}
                        onChange={(e) => setPreOrderDate(e.target.value)}
                        className="w-full p-2.5 border border-sand-300 rounded-lg bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-sand-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-sand-300 rounded-xl font-bold text-brand-800 hover:bg-sand-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-brand-900 hover:bg-brand-950 text-white rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 shadow"
                >
                  {isSubmitting ? "Publishing Product..." : `Create Product (${images.length} Photos)`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
