"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Plus, 
  Download, 
  X, 
  Check, 
  ShoppingBag, 
  Trash2, 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  Tag, 
  Layers, 
  ArrowUp, 
  Upload, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  FolderTree, 
  Search, 
  CheckSquare, 
  Square,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
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

  // Dynamic local state for immediate reactive UI updates
  const [productList, setProductList] = useState<any[]>(products);
  const [collectionsList, setCollectionsList] = useState<any[]>(collections);

  // Sync props if changed
  React.useEffect(() => {
    setProductList(products);
  }, [products]);

  React.useEffect(() => {
    setCollectionsList(collections);
  }, [collections]);

  // -------------------------------------------------------------
  // 1. ADD NEW PRODUCT MODAL STATE
  // -------------------------------------------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
  const [subcategoryId, setSubcategoryId] = useState("");
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

  const [images, setImages] = useState<string[]>([]);
  const [uploadingPC, setUploadingPC] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiBanner, setAiBanner] = useState("");

  // -------------------------------------------------------------
  // 2. EDIT PRODUCT MODAL STATE
  // -------------------------------------------------------------
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editErrorMsg, setEditErrorMsg] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editSku, setEditSku] = useState("");
  const [editBarcode, setEditBarcode] = useState("");
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [editFabric, setEditFabric] = useState("");
  const [editWorkType, setEditWorkType] = useState("");
  const [editPieceCount, setEditPieceCount] = useState("3");
  const [editWeight, setEditWeight] = useState("1.0");
  const [editBasePrice, setEditBasePrice] = useState("");
  const [editComparePrice, setEditComparePrice] = useState("");
  const [editSalePrice, setEditSalePrice] = useState("");
  const [editCostPrice, setEditCostPrice] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editSubcategoryId, setEditSubcategoryId] = useState("");
  const [editCollectionId, setEditCollectionId] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPackageIncludes, setEditPackageIncludes] = useState("");
  const [editCareInstructions, setEditCareInstructions] = useState("");
  const [editInStock, setEditInStock] = useState(true);
  const [editIsNewArrival, setEditIsNewArrival] = useState(false);
  const [editIsBestSeller, setEditIsBestSeller] = useState(false);
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editIsSale, setEditIsSale] = useState(false);
  const [editIsPreOrder, setEditIsPreOrder] = useState(false);
  const [editPreOrderDate, setEditPreOrderDate] = useState("");

  // Multi-Angle Image Gallery state for edit
  const [editImages, setEditImages] = useState<string[]>([]);
  const [uploadingEditPC, setUploadingEditPC] = useState(false);
  const [uploadEditProgress, setUploadEditProgress] = useState("");
  const [uploadingEditVideo, setUploadingEditVideo] = useState(false);

  // Variants state for edit
  const [editVariants, setEditVariants] = useState<any[]>([]);

  // -------------------------------------------------------------
  // 3. COLLECTION MANAGEMENT MODAL STATE
  // -------------------------------------------------------------
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any | null>(null);
  const [colName, setColName] = useState("");
  const [colSlug, setColSlug] = useState("");
  const [colDesc, setColDesc] = useState("");
  const [colBanner, setColBanner] = useState("");
  const [colProductIds, setColProductIds] = useState<string[]>([]);
  const [colSearchQuery, setColSearchQuery] = useState("");
  const [isSavingCollection, setIsSavingCollection] = useState(false);
  const [uploadingColBanner, setUploadingColBanner] = useState(false);

  // -------------------------------------------------------------
  // ADD PRODUCT HANDLERS
  // -------------------------------------------------------------
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
        toast.success(`Uploaded ${json.urls.length} photo(s)!`);
        setTimeout(() => setUploadProgress(""), 4000);
      } else {
        toast.error(json.error || "Failed to upload files from PC.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload files from PC.");
    } finally {
      setUploadingPC(false);
      e.target.value = "";
    }
  };

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
        toast.success("Runway video uploaded successfully!");
      } else {
        toast.error(json.error || "Failed to upload video.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload video.");
    } finally {
      setUploadingVideo(false);
      e.target.value = "";
    }
  };

  const handleGenerateAICopy = async () => {
    if (!title.trim()) {
      toast.error("Please enter a Product Title first so the AI knows what to write about.");
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
        toast.error(json.error || "Failed to generate copy.");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to connect to AI copywriter.");
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
          subcategoryId: subcategoryId || null,
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
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create product");
      }

      // Add to local state
      if (data.product) {
        setProductList((prev) => [data.product, ...prev]);
      }

      toast.success("Product created successfully! 🎉");
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
      setImages([]);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create product");
      toast.error(err.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // EDIT PRODUCT OPEN & SAVE
  // -------------------------------------------------------------
  const handleOpenEditModal = (p: any) => {
    setEditingProduct(p);
    setEditTitle(p.title || "");
    setEditSku(p.sku || "");
    setEditBarcode(p.barcode || "");
    setEditVideoUrl(p.videoUrl || "");
    setEditFabric(p.fabric || "");
    setEditWorkType(p.workType || "");
    setEditPieceCount(String(p.pieceCount || 3));
    setEditWeight(String(p.weight || 1.0));
    setEditBasePrice(String(p.basePrice || ""));
    setEditComparePrice(p.comparePrice ? String(p.comparePrice) : "");
    setEditSalePrice(p.salePrice ? String(p.salePrice) : "");
    setEditCostPrice(p.costPrice ? String(p.costPrice) : "");
    setEditCategoryId(p.categoryId || "");
    setEditSubcategoryId(p.subcategoryId || "");
    setEditCollectionId(p.collectionId || "");
    setEditDescription(p.description || "");
    setEditPackageIncludes(p.packageIncludes || "");
    setEditCareInstructions(p.careInstructions || "");
    setEditInStock(p.inStock !== false);
    setEditIsNewArrival(Boolean(p.isNewArrival));
    setEditIsBestSeller(Boolean(p.isBestSeller));
    setEditIsFeatured(Boolean(p.isFeatured));
    setEditIsSale(Boolean(p.isSale));
    setEditIsPreOrder(Boolean(p.isPreOrder));
    setEditPreOrderDate(p.preOrderDate || "");

    // Populate images array
    const existingImgs = (p.images || []).map((img: any) => img.url).filter(Boolean);
    setEditImages(existingImgs.length > 0 ? existingImgs : ["/assets/hero-model.jpg"]);

    // Populate variants
    if (p.variants && p.variants.length > 0) {
      setEditVariants(p.variants.map((v: any) => ({ ...v })));
    } else {
      setEditVariants([
        {
          size: "Unstitched",
          color: "Default",
          stitchedType: "Unstitched",
          sku: `${p.sku || "TT"}-UN`,
          priceAdjustment: 0,
          stockQuantity: 25,
        },
      ]);
    }

    setEditErrorMsg("");
    setIsEditModalOpen(true);
  };

  // Image Gallery handlers for Edit modal
  const handleRemoveEditImage = (index: number) => {
    setEditImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetEditAsCover = (index: number) => {
    if (index === 0) return;
    setEditImages((prev) => {
      const copy = [...prev];
      const [chosen] = copy.splice(index, 1);
      copy.unshift(chosen);
      return copy;
    });
  };

  const handleMoveEditImage = (index: number, direction: "left" | "right") => {
    setEditImages((prev) => {
      const targetIdx = direction === "left" ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const handleReplaceEditImage = async (index: number, file: File) => {
    const formData = new FormData();
    formData.append("files", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (res.ok && json.success && (json.url || json.urls?.[0])) {
        const newUrl = json.url || json.urls[0];
        setEditImages((prev) => {
          const copy = [...prev];
          copy[index] = newUrl;
          return copy;
        });
        toast.success(`Photo #${index + 1} updated!`);
      } else {
        toast.error(json.error || "Failed to replace photo");
      }
    } catch (err: any) {
      toast.error(err.message || "Upload error");
    }
  };

  const handleEditPCFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingEditPC(true);
    setUploadEditProgress(`Uploading ${files.length} photo(s)...`);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (res.ok && json.success && json.urls) {
        setEditImages((prev) => [...prev, ...json.urls]);
        setUploadEditProgress(`Added ${json.urls.length} photo(s) to gallery!`);
        toast.success(`Added ${json.urls.length} photo(s) to gallery!`);
        setTimeout(() => setUploadEditProgress(""), 4000);
      } else {
        toast.error(json.error || "Failed to upload photo");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload photo");
    } finally {
      setUploadingEditPC(false);
      e.target.value = "";
    }
  };

  const handleEditVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingEditVideo(true);
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (res.ok && json.success && (json.url || json.urls?.[0])) {
        const uploaded = json.url || json.urls[0];
        setEditVideoUrl(uploaded);
        toast.success("Video replaced successfully!");
      } else {
        toast.error(json.error || "Failed to upload video");
      }
    } catch (err: any) {
      toast.error(err.message || "Upload error");
    } finally {
      setUploadingEditVideo(false);
      e.target.value = "";
    }
  };

  // Variants management in Edit Modal
  const handleAddEditVariant = () => {
    setEditVariants((prev) => [
      ...prev,
      {
        size: "M",
        color: "Default",
        stitchedType: "Stitched",
        sku: `${editSku || "TT"}-M-${prev.length + 1}`,
        priceAdjustment: 0,
        stockQuantity: 10,
      },
    ]);
  };

  const handleUpdateEditVariantField = (idx: number, field: string, val: any) => {
    setEditVariants((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleRemoveEditVariant = (idx: number) => {
    if (editVariants.length <= 1) {
      toast.error("Product must have at least one variant.");
      return;
    }
    setEditVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditErrorMsg("");

    if (!editTitle.trim() || !editSku.trim() || !editBasePrice || !editFabric.trim()) {
      setEditErrorMsg("Product Title, SKU, Base Price, and Fabric are required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }

    const filteredImages = editImages.map((i) => i.trim()).filter(Boolean);
    if (filteredImages.length === 0) {
      setEditErrorMsg("Please retain or upload at least one image in the product gallery.");
      toast.error("Please provide at least one photo.");
      return;
    }

    setIsSavingEdit(true);

    try {
      const payload = {
        id: editingProduct.id,
        title: editTitle.trim(),
        sku: editSku.trim().toUpperCase(),
        description: editDescription,
        fabric: editFabric.trim(),
        workType: editWorkType.trim(),
        pieceCount: parseInt(editPieceCount || "3", 10),
        weight: parseFloat(editWeight) || 1.0,
        basePrice: parseFloat(editBasePrice),
        comparePrice: editComparePrice ? parseFloat(editComparePrice) : null,
        salePrice: editSalePrice ? parseFloat(editSalePrice) : null,
        costPrice: editCostPrice ? parseFloat(editCostPrice) : null,
        categoryId: editCategoryId || null,
        subcategoryId: editSubcategoryId || null,
        collectionId: editCollectionId || null,
        barcode: editBarcode || null,
        videoUrl: editVideoUrl || null,
        packageIncludes: editPackageIncludes || null,
        careInstructions: editCareInstructions || null,
        inStock: editInStock,
        isNewArrival: editIsNewArrival,
        isBestSeller: editIsBestSeller,
        isFeatured: editIsFeatured,
        isSale: editIsSale,
        isPreOrder: editIsPreOrder,
        preOrderDate: editIsPreOrder ? editPreOrderDate : null,
        images: filteredImages,
        variants: editVariants,
      };

      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update product");
      }

      // Update table state immediately
      setProductList((prev) =>
        prev.map((item) => (item.id === editingProduct.id ? data.product : item))
      );

      toast.success("Product updated successfully! 🎉");
      setIsEditModalOpen(false);
      setEditingProduct(null);
      router.refresh();
    } catch (err: any) {
      setEditErrorMsg(err.message || "Failed to update product");
      toast.error(err.message || "Failed to update product");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // -------------------------------------------------------------
  // COLLECTION MANAGEMENT HANDLERS
  // -------------------------------------------------------------
  const handleOpenCollectionManager = () => {
    setEditingCollection(null);
    setColName("");
    setColSlug("");
    setColDesc("");
    setColBanner("/assets/cat-lawn-summer.jpg");
    setColProductIds([]);
    setColSearchQuery("");
    setIsCollectionModalOpen(true);
  };

  const handleEditCollection = (col: any) => {
    setEditingCollection(col);
    setColName(col.name);
    setColSlug(col.slug || "");
    setColDesc(col.description || "");
    setColBanner(col.bannerImage || "/assets/cat-lawn-summer.jpg");

    // Gather currently assigned product IDs
    const assignedIds = col.products
      ? col.products.map((p: any) => p.id)
      : productList.filter((p) => p.collectionId === col.id).map((p) => p.id);
    setColProductIds(assignedIds);
    setColSearchQuery("");
  };

  const handleUploadColBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingColBanner(true);
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (res.ok && json.success && (json.url || json.urls?.[0])) {
        const url = json.url || json.urls[0];
        setColBanner(url);
        toast.success("Collection banner uploaded!");
      } else {
        toast.error(json.error || "Failed to upload banner");
      }
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploadingColBanner(false);
      e.target.value = "";
    }
  };

  const handleToggleProductInCollection = (productId: string) => {
    setColProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSaveCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName.trim()) {
      toast.error("Collection name is required.");
      return;
    }

    setIsSavingCollection(true);

    try {
      const isEditing = Boolean(editingCollection);
      const url = "/api/admin/collections";
      const method = isEditing ? "PUT" : "POST";

      const payload = {
        id: editingCollection?.id,
        name: colName.trim(),
        slug: colSlug.trim(),
        description: colDesc.trim(),
        bannerImage: colBanner.trim() || null,
        productIds: colProductIds,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save collection");
      }

      const savedCol = data.collection;

      if (isEditing) {
        setCollectionsList((prev) => prev.map((c) => (c.id === savedCol.id ? savedCol : c)));
        // Refresh product list collection associations
        setProductList((prev) =>
          prev.map((p) => {
            if (colProductIds.includes(p.id)) {
              return { ...p, collectionId: savedCol.id, collection: savedCol };
            } else if (p.collectionId === savedCol.id) {
              return { ...p, collectionId: null, collection: null };
            }
            return p;
          })
        );
        toast.success("Collection updated successfully! 🎉");
      } else {
        setCollectionsList((prev) => [...prev, savedCol]);
        setProductList((prev) =>
          prev.map((p) =>
            colProductIds.includes(p.id) ? { ...p, collectionId: savedCol.id, collection: savedCol } : p
          )
        );
        toast.success("New collection created! 🎉");
      }

      setEditingCollection(null);
      setColName("");
      setColSlug("");
      setColDesc("");
      setColProductIds([]);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save collection");
    } finally {
      setIsSavingCollection(false);
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
            className="flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2.5 bg-brand-900 hover:bg-brand-950 text-sand-50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gold-400" /> Add New Product
          </button>

          <button
            onClick={handleOpenCollectionManager}
            className="flex-1 sm:flex-none justify-center px-3 sm:px-4 py-2.5 bg-white hover:bg-sand-50 border border-sand-300 text-brand-900 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <FolderTree className="w-3.5 h-3.5 text-gold-700" /> Collections ({collectionsList.length})
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
                <th className="p-3">Category & Collection</th>
                <th className="p-3">Gallery</th>
                <th className="p-3">Fabric</th>
                <th className="p-3">Price (PKR)</th>
                <th className="p-3">Variants</th>
                <th className="p-3">Stock</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {productList.map((p) => {
                const totalStock = p.variants?.reduce((sum: number, v: any) => sum + v.stockQuantity, 0) || 0;
                return (
                  <tr key={p.id} className="hover:bg-sand-50/60 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded bg-sand-100 overflow-hidden shrink-0">
                          <Image
                            src={p.images?.[0]?.url || "/assets/reel-2.jpg"}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-brand-950 line-clamp-1">{p.title}</p>
                          <span className="text-[10px] text-brand-500">{p.pieceCount || 3}-Piece Ensemble</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-brand-700 font-semibold">{p.sku}</td>
                    <td className="p-3 text-brand-700">
                      <div className="space-y-0.5">
                        <div className="font-medium text-brand-900">{p.category?.name || "Standard"}</div>
                        {p.subcategory && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-sand-200 text-brand-800 border border-sand-300 mr-1">
                            📂 {p.subcategory.name}
                          </span>
                        )}
                        {p.collection && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-gold-100 text-gold-900 border border-gold-200">
                            🏷️ {p.collection.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-sand-100 text-brand-900 font-bold text-[10px]">
                        {p.images?.length || 1} image{p.images?.length === 1 ? "" : "s"}
                      </span>
                    </td>
                    <td className="p-3 text-brand-600">{p.fabric}</td>
                    <td className="p-3">
                      <div className="font-serif font-bold text-brand-950">
                        Rs. {p.basePrice?.toLocaleString()}
                      </div>
                      {p.comparePrice && p.comparePrice > p.basePrice && (
                        <div className="text-[10px] text-brand-400 line-through">
                          Rs. {p.comparePrice?.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-brand-700">
                      <span className="font-medium">{p.variants?.length || 0} options</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        totalStock > 10 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {totalStock} units
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        p.inStock !== false ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                        {p.inStock !== false ? "Active" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="px-2.5 py-1 rounded-lg bg-gold-50 hover:bg-gold-500 hover:text-brand-950 text-gold-800 text-[11px] font-bold flex items-center gap-1 border border-gold-300 transition-all cursor-pointer shadow-xs"
                          title="Edit Product, Images & Variants"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="px-2 py-1 rounded-lg bg-sand-100 hover:bg-sand-200 text-brand-700 text-[11px] font-medium transition-colors"
                          title="View on Storefront"
                        >
                          View &rarr;
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 4. EDIT PRODUCT MODAL (COMPLETE PRE-POPULATED EDITING SUITE)   */}
      {/* ============================================================= */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-brand-950/70 backdrop-blur-sm" onClick={() => !isSavingEdit && setIsEditModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto space-y-6 animate-fadeIn border border-sand-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-sand-200 pb-4">
              <div>
                <span className="text-xs font-bold text-gold-700 uppercase tracking-widest flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5" /> Product Editor
                </span>
                <h3 className="font-serif font-bold text-2xl text-brand-950">
                  Edit: {editingProduct.title}
                </h3>
                <p className="text-xs text-brand-500">
                  SKU: <span className="font-mono font-bold text-brand-700">{editingProduct.sku}</span> &bull; Modify all attributes, multi-angle images, pricing, and variants
                </p>
              </div>
              <button
                type="button"
                disabled={isSavingEdit}
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full text-brand-600 hover:bg-sand-100 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {editErrorMsg && (
              <div className="p-3.5 rounded-xl bg-maroon-50 border border-maroon-200 text-maroon-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-maroon-600" />
                <span>{editErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditProduct} className="space-y-6 text-xs">
              {/* Basic Details */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-sm text-brand-950 flex items-center gap-2 border-b border-sand-100 pb-1">
                  <Layers className="w-4 h-4 text-gold-600" /> Basic Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 text-brand-950 font-medium focus:bg-white focus:border-gold-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Article SKU *</label>
                    <input
                      type="text"
                      required
                      value={editSku}
                      onChange={(e) => setEditSku(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 uppercase font-mono text-brand-950 focus:bg-white focus:border-gold-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Category *</label>
                    <select
                      value={editCategoryId}
                      onChange={(e) => {
                        setEditCategoryId(e.target.value);
                        setEditSubcategoryId("");
                      }}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-medium text-brand-950"
                    >
                      <option value="">None (Uncategorized)</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Subcategory</label>
                    <select
                      value={editSubcategoryId}
                      onChange={(e) => setEditSubcategoryId(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-medium text-brand-950"
                    >
                      <option value="">None (Main Category Only)</option>
                      {categories.find((c) => c.id === editCategoryId)?.subcategories?.map((sub: any) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Collection</label>
                    <select
                      value={editCollectionId}
                      onChange={(e) => setEditCollectionId(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-medium text-brand-950"
                    >
                      <option value="">None (Standard Catalog)</option>
                      {collectionsList.map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Barcode / EAN</label>
                    <input
                      type="text"
                      placeholder="e.g. 896400012345"
                      value={editBarcode}
                      onChange={(e) => setEditBarcode(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-mono text-brand-950"
                    />
                  </div>
                </div>
              </div>

              {/* Fabric & Workmanship */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-sm text-brand-950 border-b border-sand-100 pb-1 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gold-600" /> Fabric & Specifications
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Fabric Type *</label>
                    <input
                      type="text"
                      required
                      value={editFabric}
                      onChange={(e) => setEditFabric(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 text-brand-950 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Work / Embroidery Type</label>
                    <input
                      type="text"
                      value={editWorkType}
                      onChange={(e) => setEditWorkType(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 text-brand-950"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Piece Count</label>
                    <select
                      value={editPieceCount}
                      onChange={(e) => setEditPieceCount(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-medium text-brand-950"
                    >
                      <option value="3">3 Piece (Shirt, Trouser, Dupatta)</option>
                      <option value="2">2 Piece (Shirt & Trouser / Dupatta)</option>
                      <option value="1">1 Piece (Kurta / Kalidar / Shawl)</option>
                      <option value="4">4 Piece (Includes Slip/Lining)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Parcel Weight (KG)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-mono font-bold text-brand-950"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Stock Availability</label>
                    <select
                      value={editInStock ? "true" : "false"}
                      onChange={(e) => setEditInStock(e.target.value === "true")}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-medium text-brand-950"
                    >
                      <option value="true">In Stock (Ordering Active)</option>
                      <option value="false">Out of Stock (Disabled)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-sm text-brand-950 border-b border-sand-100 pb-1 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-gold-600" /> Pricing & Costing
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Selling Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      value={editBasePrice}
                      onChange={(e) => setEditBasePrice(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-bold text-brand-950 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Compare Price (Strike-through)</label>
                    <input
                      type="number"
                      placeholder="e.g. 15500"
                      value={editComparePrice}
                      onChange={(e) => setEditComparePrice(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Discount/Sale Price (Optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. 11950"
                      value={editSalePrice}
                      onChange={(e) => setEditSalePrice(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* ============================================================= */}
              {/* MULTI-ANGLE IMAGE GALLERY MANAGEMENT (VIEW, DELETE, REPLACE, REORDER) */}
              {/* ============================================================= */}
              <div className="space-y-3 p-4 rounded-2xl bg-sand-50/80 border border-sand-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-sand-200 pb-3">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-brand-950 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-gold-600" /> Multi-Angle Image Gallery ({editImages.length} Photos)
                    </h4>
                    <p className="text-[11px] text-brand-600 mt-0.5">
                      View, delete specific images, upload replacements, or reorder angles. Photo #1 is the Main Cover.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <label
                      htmlFor="edit-pc-image-upload-top"
                      className="cursor-pointer px-3 py-1.5 bg-brand-900 hover:bg-black text-sand-50 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Upload className="w-3.5 h-3.5 text-gold-400" /> Upload Photos
                    </label>
                    <input
                      id="edit-pc-image-upload-top"
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={uploadingEditPC}
                      onChange={handleEditPCFileUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => setEditImages((prev) => [...prev, ""])}
                      className="px-3 py-1.5 bg-sand-200 hover:bg-sand-300 text-brand-900 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> + URL Slot
                    </button>
                  </div>
                </div>

                {uploadEditProgress && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] font-bold flex items-center gap-2 animate-fadeIn">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{uploadEditProgress}</span>
                  </div>
                )}

                {/* Gallery Cards Grid with Reorder, Delete, and Replace actions */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                  {editImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`relative rounded-xl overflow-hidden border-2 p-1.5 bg-white shadow-sm flex flex-col justify-between group transition-all ${
                        idx === 0 ? "border-gold-600 ring-2 ring-gold-600/30" : "border-sand-200"
                      }`}
                    >
                      {/* Image Thumbnail & Badges */}
                      <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-sand-100">
                        {imgUrl ? (
                          <Image
                            src={imgUrl}
                            alt={`Product photo ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-sand-400 text-[10px] p-2 text-center">
                            <span>Empty Link</span>
                          </div>
                        )}

                        {/* Position Badge */}
                        <span className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          idx === 0 ? "bg-gold-600 text-white shadow-xs" : "bg-brand-950/75 text-sand-100"
                        }`}>
                          {idx === 0 ? "Cover #1" : `Angle #${idx + 1}`}
                        </span>

                        {/* Delete Specific Image Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveEditImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-md bg-maroon-600 text-white shadow hover:bg-maroon-700 transition-colors cursor-pointer"
                          title="Delete this image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Replace Button Overlay */}
                        <label
                          htmlFor={`replace-img-${idx}`}
                          className="absolute bottom-1 inset-x-1 py-1 rounded bg-brand-950/80 hover:bg-brand-950 text-white text-[10px] font-bold text-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity flex items-center justify-center gap-1"
                        >
                          <Upload className="w-3 h-3 text-gold-400" /> Replace
                        </label>
                        <input
                          id={`replace-img-${idx}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleReplaceEditImage(idx, f);
                            e.target.value = "";
                          }}
                        />
                      </div>

                      {/* Reordering Controls */}
                      <div className="pt-2 flex items-center justify-between gap-1 border-t border-sand-100 mt-1">
                        <div className="flex items-center gap-1">
                          {/* Move Left */}
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveEditImage(idx, "left")}
                            className="p-1 rounded bg-sand-100 hover:bg-sand-200 text-brand-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            title="Move photo earlier"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </button>

                          {/* Move Right */}
                          <button
                            type="button"
                            disabled={idx === editImages.length - 1}
                            onClick={() => handleMoveEditImage(idx, "right")}
                            className="p-1 rounded bg-sand-100 hover:bg-sand-200 text-brand-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            title="Move photo later"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Set as Cover */}
                        {idx !== 0 ? (
                          <button
                            type="button"
                            onClick={() => handleSetEditAsCover(idx)}
                            className="text-[10px] text-gold-700 hover:text-gold-900 font-bold flex items-center gap-0.5 cursor-pointer"
                            title="Promote to Main Cover"
                          >
                            <ArrowUp className="w-2.5 h-2.5" /> Make Cover
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-700 font-bold">Primary Cover</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom URL Inputs for Gallery */}
                <div className="space-y-1.5 pt-2 border-t border-sand-200">
                  <label className="block text-[11px] font-bold text-brand-900">
                    Direct Image URL Paths:
                  </label>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {editImages.map((imgUrl, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-16 text-[10px] font-semibold text-brand-700 shrink-0">
                          {idx === 0 ? "Cover (1):" : `Photo ${idx + 1}:`}
                        </span>
                        <input
                          type="text"
                          value={imgUrl}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditImages((prev) => {
                              const copy = [...prev];
                              copy[idx] = val;
                              return copy;
                            });
                          }}
                          placeholder="/assets/prod-lawn.jpg or https://..."
                          className="flex-1 p-1.5 border border-sand-300 rounded-lg bg-white text-xs text-brand-900 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveEditImage(idx)}
                          className="p-1.5 text-maroon-600 hover:bg-maroon-50 rounded-lg shrink-0 cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ============================================================= */}
              {/* VARIANTS & STOCK QUANTITY MANAGEMENT                           */}
              {/* ============================================================= */}
              <div className="space-y-3 p-4 rounded-2xl bg-sand-50/80 border border-sand-200">
                <div className="flex items-center justify-between border-b border-sand-200 pb-2">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-brand-950 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gold-600" /> Variants & Inventory ({editVariants.length} Variants)
                    </h4>
                    <p className="text-[11px] text-brand-600 mt-0.5">
                      Configure sizes, color variants, stitched options, variant SKU, price adjustments, and stock levels.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddEditVariant}
                    className="px-3 py-1.5 bg-brand-900 hover:bg-brand-950 text-sand-50 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-gold-400" /> Add Variant
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-sand-100/80 text-brand-900 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2">Size</th>
                        <th className="p-2">Color</th>
                        <th className="p-2">Stitching</th>
                        <th className="p-2">Variant SKU</th>
                        <th className="p-2">Price Adjust (+PKR)</th>
                        <th className="p-2">Stock (Units)</th>
                        <th className="p-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-200 bg-white">
                      {editVariants.map((v, idx) => (
                        <tr key={idx} className="hover:bg-sand-50/70">
                          <td className="p-2">
                            <input
                              type="text"
                              value={v.size || ""}
                              onChange={(e) => handleUpdateEditVariantField(idx, "size", e.target.value)}
                              className="w-24 p-1.5 border border-sand-300 rounded-md font-semibold text-brand-950 text-xs"
                              placeholder="e.g. S, M, L"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={v.color || ""}
                              onChange={(e) => handleUpdateEditVariantField(idx, "color", e.target.value)}
                              className="w-24 p-1.5 border border-sand-300 rounded-md text-brand-950 text-xs"
                              placeholder="e.g. Emerald"
                            />
                          </td>
                          <td className="p-2">
                            <select
                              value={v.stitchedType || "Unstitched"}
                              onChange={(e) => handleUpdateEditVariantField(idx, "stitchedType", e.target.value)}
                              className="p-1.5 border border-sand-300 rounded-md text-brand-950 text-xs font-medium"
                            >
                              <option value="Unstitched">Unstitched</option>
                              <option value="Stitched">Stitched</option>
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={v.sku || ""}
                              onChange={(e) => handleUpdateEditVariantField(idx, "sku", e.target.value)}
                              className="w-28 p-1.5 border border-sand-300 rounded-md font-mono text-[11px] text-brand-900 uppercase"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={v.priceAdjustment ?? 0}
                              onChange={(e) => handleUpdateEditVariantField(idx, "priceAdjustment", e.target.value)}
                              className="w-24 p-1.5 border border-sand-300 rounded-md font-mono text-brand-950 text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={v.stockQuantity ?? 0}
                              onChange={(e) => handleUpdateEditVariantField(idx, "stockQuantity", e.target.value)}
                              className="w-20 p-1.5 border border-sand-300 rounded-md font-mono font-bold text-brand-950 text-xs"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveEditVariant(idx)}
                              className="p-1.5 text-maroon-600 hover:bg-maroon-50 rounded-md transition-colors cursor-pointer"
                              title="Delete variant"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Product Narrative & Care Instructions */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-sm text-brand-950 border-b border-sand-100 pb-1">
                  Product Narrative & Description
                </h4>

                <div>
                  <label className="block font-bold text-brand-900 mb-1">Package Contents</label>
                  <input
                    type="text"
                    value={editPackageIncludes}
                    onChange={(e) => setEditPackageIncludes(e.target.value)}
                    className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 text-brand-950"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Product Description</label>
                    <textarea
                      rows={3}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 text-brand-950 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Care & Preservation Instructions</label>
                    <textarea
                      rows={3}
                      value={editCareInstructions}
                      onChange={(e) => setEditCareInstructions(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 text-brand-950 text-xs"
                    />
                  </div>
                </div>

                {/* Video Reel Link & Upload */}
                <div className="p-3.5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-brand-900">Video Reel / Runway URL</label>
                    <label className="cursor-pointer text-[11px] font-bold text-gold-700 hover:text-gold-900 flex items-center gap-1">
                      <Upload className="w-3 h-3" /> {uploadingEditVideo ? "Uploading..." : "Upload MP4"}
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleEditVideoUpload}
                        disabled={uploadingEditVideo}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="https://youtu.be/... or Instagram Reel URL"
                    value={editVideoUrl}
                    onChange={(e) => setEditVideoUrl(e.target.value)}
                    className="w-full p-2.5 border border-sand-300 rounded-lg bg-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Storefront Badges */}
              <div className="space-y-3 pt-2">
                <h4 className="font-serif font-bold text-sm text-brand-950 border-b border-sand-100 pb-1">
                  Storefront Badges & Launch Options
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-sand-200 bg-sand-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsNewArrival}
                      onChange={(e) => setEditIsNewArrival(e.target.checked)}
                      className="rounded text-gold-600 focus:ring-gold-500"
                    />
                    <span className="font-semibold text-brand-900">New Arrival</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl border border-sand-200 bg-sand-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsBestSeller}
                      onChange={(e) => setEditIsBestSeller(e.target.checked)}
                      className="rounded text-gold-600 focus:ring-gold-500"
                    />
                    <span className="font-semibold text-brand-900">Bestseller</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl border border-sand-200 bg-sand-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsFeatured}
                      onChange={(e) => setEditIsFeatured(e.target.checked)}
                      className="rounded text-gold-600 focus:ring-gold-500"
                    />
                    <span className="font-semibold text-brand-900">Featured</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl border border-sand-200 bg-sand-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsSale}
                      onChange={(e) => setEditIsSale(e.target.checked)}
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
                      checked={editIsPreOrder}
                      onChange={(e) => setEditIsPreOrder(e.target.checked)}
                      className="rounded text-gold-600 focus:ring-gold-500"
                    />
                    <span className="font-semibold text-brand-900">Enable Pre-Order for this Product</span>
                  </label>

                  {editIsPreOrder && (
                    <div className="pt-2">
                      <label className="block font-bold text-brand-900 mb-1">Expected Dispatch Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Dispatches on 25th September 2026"
                        value={editPreOrderDate}
                        onChange={(e) => setEditPreOrderDate(e.target.value)}
                        className="w-full p-2.5 border border-sand-300 rounded-lg bg-white font-medium"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-sand-200 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={isSavingEdit}
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 border border-sand-300 rounded-xl font-bold text-brand-800 hover:bg-sand-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-6 py-2.5 bg-brand-900 hover:bg-brand-950 text-white rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 shadow cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isSavingEdit ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-gold-400" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 5. COLLECTION MANAGER & EDITING MODAL                         */}
      {/* ============================================================= */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-brand-950/70 backdrop-blur-sm" onClick={() => !isSavingCollection && setIsCollectionModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto space-y-6 animate-fadeIn border border-sand-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-sand-200 pb-4">
              <div>
                <span className="text-xs font-bold text-gold-700 uppercase tracking-widest flex items-center gap-1">
                  <FolderTree className="w-3.5 h-3.5" /> Collection Manager
                </span>
                <h3 className="font-serif font-bold text-2xl text-brand-950">
                  {editingCollection ? `Edit Collection: ${editingCollection.name}` : "Collections & Campaigns"}
                </h3>
                <p className="text-xs text-brand-500">
                  Manage collection titles, descriptions, banner artwork, and assigned products
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCollectionModalOpen(false)}
                className="p-1 rounded-full text-brand-600 hover:bg-sand-100 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* If currently editing a collection (or creating new one) */}
            {editingCollection !== null || colName ? (
              <form onSubmit={handleSaveCollection} className="space-y-5 text-xs">
                <div className="p-4 bg-sand-50 rounded-2xl border border-sand-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sm text-brand-950">
                      {editingCollection ? "Update Collection Details" : "New Collection Details"}
                    </h4>
                    {editingCollection && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCollection(null);
                          setColName("");
                          setColSlug("");
                          setColDesc("");
                          setColProductIds([]);
                        }}
                        className="text-xs font-bold text-brand-600 hover:text-brand-900 cursor-pointer"
                      >
                        &larr; Back to all collections
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-brand-900 mb-1">Collection Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Winter Festive Velvet 2026"
                        value={colName}
                        onChange={(e) => setColName(e.target.value)}
                        className="w-full p-2.5 border border-sand-300 rounded-xl bg-white font-medium text-brand-950"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-brand-900 mb-1">URL Slug (Auto-generated if blank)</label>
                      <input
                        type="text"
                        placeholder="winter-festive-velvet"
                        value={colSlug}
                        onChange={(e) => setColSlug(e.target.value)}
                        className="w-full p-2.5 border border-sand-300 rounded-xl bg-white font-mono text-brand-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Collection Description</label>
                    <textarea
                      rows={2}
                      placeholder="High-fashion velvet, khaddar, and karandi silhouettes curated for winter soirees..."
                      value={colDesc}
                      onChange={(e) => setColDesc(e.target.value)}
                      className="w-full p-2.5 border border-sand-300 rounded-xl bg-white text-xs text-brand-950"
                    />
                  </div>

                  {/* Banner Image Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-brand-900">Collection Banner / Thumbnail Image</label>
                      <label className="cursor-pointer text-[11px] font-bold text-gold-700 hover:text-gold-900 flex items-center gap-1">
                        <Upload className="w-3 h-3" /> {uploadingColBanner ? "Uploading..." : "Upload Banner from Device"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleUploadColBanner}
                          disabled={uploadingColBanner}
                        />
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <div className="relative w-36 h-20 rounded-xl bg-sand-200 overflow-hidden border border-sand-300 shrink-0 shadow-xs">
                        {colBanner ? (
                          <Image src={colBanner} alt="Banner Preview" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sand-400 text-[10px]">No Banner</div>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="/assets/cat-lawn-summer.jpg or https://..."
                        value={colBanner}
                        onChange={(e) => setColBanner(e.target.value)}
                        className="flex-1 p-2.5 border border-sand-300 rounded-xl bg-white font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Assign / Remove Products Checklist */}
                  <div className="pt-2 border-t border-sand-200 space-y-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <label className="font-bold text-brand-900 block">
                          Assign or Remove Products ({colProductIds.length} Products Assigned)
                        </label>
                        <p className="text-[11px] text-brand-500">
                          Check products to include in this collection, uncheck to remove them.
                        </p>
                      </div>

                      <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-sand-400" />
                        <input
                          type="text"
                          placeholder="Search products by title/SKU..."
                          value={colSearchQuery}
                          onChange={(e) => setColSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 border border-sand-300 rounded-lg text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto border border-sand-200 rounded-xl bg-white divide-y divide-sand-100 p-1">
                      {productList
                        .filter((p) => {
                          if (!colSearchQuery) return true;
                          const q = colSearchQuery.toLowerCase();
                          return p.title?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q);
                        })
                        .map((prod) => {
                          const isAssigned = colProductIds.includes(prod.id);
                          return (
                            <div
                              key={prod.id}
                              onClick={() => handleToggleProductInCollection(prod.id)}
                              className={`p-2 flex items-center justify-between rounded-lg cursor-pointer transition-colors ${
                                isAssigned ? "bg-gold-50/70 border-l-4 border-gold-600" : "hover:bg-sand-50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="text-gold-700">
                                  {isAssigned ? (
                                    <CheckSquare className="w-4 h-4 text-gold-600" />
                                  ) : (
                                    <Square className="w-4 h-4 text-sand-400" />
                                  )}
                                </div>
                                <div className="relative w-8 h-10 rounded bg-sand-100 overflow-hidden shrink-0">
                                  <Image
                                    src={prod.images?.[0]?.url || "/assets/reel-1.jpg"}
                                    alt={prod.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-bold text-brand-950 text-xs">{prod.title}</p>
                                  <span className="font-mono text-[10px] text-brand-500">{prod.sku}</span>
                                </div>
                              </div>

                              <span className="text-[10px] font-bold text-brand-700 font-serif">
                                Rs. {prod.basePrice?.toLocaleString()}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCollection(null);
                      setColName("");
                    }}
                    className="px-4 py-2 border border-sand-300 rounded-xl font-bold text-brand-800 hover:bg-sand-50 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingCollection}
                    className="px-5 py-2 bg-brand-900 hover:bg-brand-950 text-white rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow transition-colors"
                  >
                    {isSavingCollection ? "Saving Collection..." : "Save Collection"}
                  </button>
                </div>
              </form>
            ) : (
              /* Collection Cards List */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-brand-950">Active Collections</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCollection(null);
                      setColName("New Luxury Collection");
                      setColSlug("");
                      setColDesc("");
                      setColBanner("/assets/cat-lawn-summer.jpg");
                      setColProductIds([]);
                    }}
                    className="px-3 py-1.5 bg-brand-900 hover:bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-gold-400" /> Create Collection
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {collectionsList.map((col) => {
                    const assignedCount = col._count?.products ?? productList.filter((p) => p.collectionId === col.id).length;
                    return (
                      <div
                        key={col.id}
                        className="p-3 rounded-2xl border border-sand-200 bg-sand-50/50 hover:bg-white hover:border-gold-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                      >
                        <div className="flex gap-3">
                          <div className="relative w-20 h-20 rounded-xl bg-sand-200 overflow-hidden shrink-0 border border-sand-300">
                            <Image
                              src={col.bannerImage || "/assets/cat-lawn-summer.jpg"}
                              alt={col.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-sm text-brand-950 truncate">{col.name}</h5>
                              <span className="px-2 py-0.5 rounded-full bg-gold-100 text-gold-900 text-[10px] font-bold shrink-0">
                                {assignedCount} product{assignedCount === 1 ? "" : "s"}
                              </span>
                            </div>
                            <p className="text-[11px] text-brand-600 font-mono mt-0.5">/{col.slug}</p>
                            <p className="text-[11px] text-brand-500 line-clamp-2 mt-1">
                              {col.description || "No editorial description specified."}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-sand-200 flex items-center justify-between">
                          <span className="text-[10px] text-brand-400">Created: {new Date(col.createdAt || Date.now()).toLocaleDateString()}</span>
                          <button
                            type="button"
                            onClick={() => handleEditCollection(col)}
                            className="px-3 py-1 bg-gold-50 hover:bg-gold-500 hover:text-brand-950 text-gold-800 rounded-lg text-xs font-bold flex items-center gap-1 border border-gold-300 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" /> Edit Collection
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* ADD NEW PRODUCT MODAL (ORIGINAL CREATION FLOW PRESERVED)      */}
      {/* ============================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-brand-950/70 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto space-y-6 animate-fadeIn border border-sand-200">
            <div className="flex items-center justify-between border-b border-sand-200 pb-4">
              <div>
                <span className="text-xs font-bold text-gold-700 uppercase tracking-widest">Catalog Engine</span>
                <h3 className="font-serif font-bold text-2xl text-brand-950">Add New Luxury Product</h3>
                <p className="text-xs text-brand-500">Configure multi-angle photography, fabrics, pricing, and variants</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-brand-600 hover:bg-sand-100 cursor-pointer"
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
                    className="flex items-center gap-1.5 px-3 py-1 bg-gold-600 hover:bg-gold-500 text-brand-950 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? "animate-spin" : "animate-pulse"}`} />
                    {aiLoading ? "Crafting Luxury Copy..." : "✨ Generate Specs with AI"}
                  </button>
                </div>

                {aiBanner && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] font-medium flex items-center justify-between">
                    <span>{aiBanner}</span>
                    <button type="button" onClick={() => setAiBanner("")} className="text-emerald-600 hover:text-emerald-800 cursor-pointer">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-bold text-brand-900 mb-1">Category *</label>
                    <select
                      value={categoryId}
                      onChange={(e) => {
                        setCategoryId(e.target.value);
                        setSubcategoryId("");
                      }}
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
                    <label className="block font-bold text-brand-900 mb-1">Subcategory</label>
                    <select
                      value={subcategoryId}
                      onChange={(e) => setSubcategoryId(e.target.value)}
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-medium text-brand-950"
                    >
                      <option value="">None (Main Category Only)</option>
                      {categories.find((c) => c.id === categoryId)?.subcategories?.map((sub: any) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
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
                      {collectionsList.map((col) => (
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
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="1.0"
                      className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 font-bold text-brand-950 font-mono"
                    />
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
                      Add multi-angle photography. First photo is the main cover image.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <label
                      htmlFor="pc-image-upload-top"
                      className="cursor-pointer px-3.5 py-1.5 bg-brand-900 hover:bg-black text-sand-50 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Upload className="w-3.5 h-3.5 text-gold-400" /> 📱 Upload Photos
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
                      className="px-3 py-1.5 bg-sand-200 hover:bg-sand-300 text-brand-900 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> URL Slot
                    </button>
                  </div>
                </div>

                {uploadProgress && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] font-bold flex items-center gap-2 animate-fadeIn">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{uploadProgress}</span>
                  </div>
                )}

                {images.length > 0 && (
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
                            className="absolute top-1 right-1 p-1 rounded bg-maroon-600 text-white opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
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
                              className="text-[10px] text-gold-700 hover:text-gold-900 font-bold flex items-center gap-0.5 cursor-pointer"
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
                  className="px-5 py-2.5 border border-sand-300 rounded-xl font-bold text-brand-800 hover:bg-sand-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-brand-900 hover:bg-brand-950 text-white rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 shadow cursor-pointer"
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
