"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  ShoppingBag, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Star, 
  Check, 
  Share2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Package,
  Scissors,
  Play,
  Image as ImageIcon,
  MessageCircle,
  Camera,
  Upload
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductCard from "./ProductCard";

interface ProductDetailClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const variants = product.variants || [];
  const defaultVariant = variants[0] || {
    id: `unstitched-${product.id}`,
    size: "Unstitched",
    color: "Original",
    stitchedType: "Unstitched",
    priceAdjustment: 0,
    stockQuantity: 50,
  };

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Karachi");
  const [mediaMode, setMediaMode] = useState<"PHOTO" | "VIDEO">("PHOTO");

  // Reviews state
  const [reviewsList, setReviewsList] = useState<any[]>(product.reviews || []);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [revRating, setRevRating] = useState(5);
  const [revName, setRevName] = useState("");
  const [revCity, setRevCity] = useState("");
  const [revTitle, setRevTitle] = useState("");
  const [revComment, setRevComment] = useState("");
  const [revImage, setRevImage] = useState<string | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const images = product.images?.length > 0 ? product.images : [{ url: "/assets/hero-model.jpg" }];
  const currentImage = images[selectedImageIndex] || images[0];

  const effectiveBasePrice = product.salePrice || product.basePrice;
  const effectivePrice = effectiveBasePrice + (defaultVariant?.priceAdjustment || 0);
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(
      {
        variantId: defaultVariant.id,
        productId: product.id,
        productTitle: product.title,
        productSlug: product.slug,
        image: currentImage.url,
        size: "Unstitched",
        color: defaultVariant.color || "Original",
        stitchedType: "Unstitched",
        price: effectivePrice,
        maxStock: defaultVariant.stockQuantity || 50,
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getCityDeliveryEstimate = (city: string) => {
    if (city === "Karachi") return "1-2 Working Days (Flat Rs. 350)";
    if (["Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Sialkot", "Gujranwala"].includes(city)) {
      return "4-5 Working Days (Weight-Based)";
    }
    return "5-7 Working Days (Regional & Rural Areas)";
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      alert("Image size should be less than 6MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setRevImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) {
      alert("Please fill in your name and review comments.");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          customerName: revName.trim(),
          reviewerCity: revCity.trim() || undefined,
          rating: revRating,
          title: revTitle.trim() || "Verified Buyer Review",
          comment: revComment.trim(),
          imageUrl: revImage || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReviewSuccess(true);
        if (data.review) {
          setReviewsList((prev) => [data.review, ...prev]);
        }
        setTimeout(() => {
          setShowReviewModal(false);
          setReviewSuccess(false);
          setRevTitle("");
          setRevComment("");
          setRevImage(null);
        }, 2200);
      } else {
        alert(data.error || "Failed to submit review. Please try again.");
      }
    } catch (err) {
      alert("Error submitting review. Please check your connection.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-10 pb-24 sm:pb-12">
      {/* Breadcrumbs */}
      <nav className="text-xs text-[#6B6259] flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-[#171717]">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#171717]">Shop</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#171717]">
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-[#171717] font-semibold truncate max-w-[200px] sm:max-w-none">
          {product.title}
        </span>
      </nav>

      {/* Main Grid: Gallery on Left, Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Left Column: Image Gallery & Video Reel */}
        <div className="space-y-4">
          {/* Media Switcher Tab (Only shown if videoUrl exists) */}
          {product.videoUrl && (
            <div className="flex gap-2 p-1 rounded-xl bg-[#F0EBE3] border border-[#E7E1D8] w-fit">
              <button
                onClick={() => setMediaMode("PHOTO")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  mediaMode === "PHOTO"
                    ? "bg-white text-[#171717] shadow-sm"
                    : "text-[#6B6259] hover:text-[#171717]"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Photo Gallery
              </button>
              <button
                onClick={() => setMediaMode("VIDEO")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  mediaMode === "VIDEO"
                    ? "bg-white text-[#171717] shadow-sm"
                    : "text-[#6B6259] hover:text-[#171717]"
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Runway Reel
              </button>
            </div>
          )}

          {/* Media Viewport */}
          {mediaMode === "VIDEO" && product.videoUrl ? (
            <div className="relative aspect-[9/16] max-h-[620px] mx-auto rounded-2xl overflow-hidden bg-black shadow-lg">
              <video
                src={product.videoUrl}
                poster={currentImage.url}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#F0EBE3] border border-[#E7E1D8] group">
              <Image
                src={currentImage.url}
                alt={product.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-2.5 rounded-full transition-all backdrop-blur-md shadow-sm z-10 ${
                  isWishlisted
                    ? "bg-[#9B3D3D] text-white"
                    : "bg-white/80 text-[#6B6259] hover:text-[#9B3D3D] hover:bg-white"
                }`}
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>

              {/* Expand / Zoom Button */}
              <button
                onClick={() => setShowZoomModal(true)}
                className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/80 text-[#171717] backdrop-blur-md hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="Click to Zoom Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Prev / Next Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-[#171717] hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-[#171717] hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter Pill */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-4 px-2.5 py-1 rounded-full bg-black/70 text-white text-[10px] font-mono tracking-wider backdrop-blur-sm z-10">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              )}
            </div>
          )}

          {/* Thumbnails */}
          {(images.length > 1 || product.videoUrl) && (
            <div className="space-y-1">
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMediaMode("PHOTO");
                      setSelectedImageIndex(idx);
                    }}
                    className={`relative w-16 sm:w-20 h-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-[#F0EBE3] ${
                      mediaMode === "PHOTO" && selectedImageIndex === idx
                        ? "border-[#7A6652] ring-1 ring-[#7A6652]/30 scale-105"
                        : "border-transparent opacity-65 hover:opacity-100"
                    }`}
                  >
                    <Image src={img.url} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}

                {/* Video Reel Thumbnail in Slider */}
                {product.videoUrl && (
                  <button
                    onClick={() => setMediaMode("VIDEO")}
                    className={`relative w-16 sm:w-20 h-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-black flex flex-col items-center justify-center text-white ${
                      mediaMode === "VIDEO"
                        ? "border-[#7A6652] ring-1 ring-[#7A6652]/30 scale-105"
                        : "border-transparent opacity-75 hover:opacity-100"
                    }`}
                    title="Watch Runway Reel"
                  >
                    <Image src={currentImage.url} alt="Video Thumbnail" fill className="object-cover opacity-50" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1 z-10">
                      <div className="w-7 h-7 rounded-full bg-white/90 text-[#171717] flex items-center justify-center shadow">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-white">Reel</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Product Details & Controls */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[#7A6652] font-semibold">
                {product.fabric} {product.workType ? `• ${product.workType}` : ""}
              </span>
              <span className="text-xs text-[#9B9289]">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717] mt-2">
              {product.title}
            </h1>

            {/* Ratings & Suit Type */}
            <div className="flex items-center gap-3 mt-3 text-xs">
              <div className="flex items-center gap-1 text-[#D4A017]">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-[#171717]">5.0</span>
              </div>
              <span className="text-[#6B6259]">|</span>
              <span className="text-[#6B6259]">({reviewsList.length || 2} customer reviews)</span>
              <span className="text-[#6B6259]">|</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F0EBE3] text-[#171717] text-xs font-semibold">
                {product.pieceCount || 3}-Piece Unstitched
              </span>
            </div>
          </div>



          {/* Pre-Order Banner */}
          {product.isPreOrder && (
            <div className="p-3 bg-[#FEF3CD] border border-[#F5D87E] text-[#7A5C00] rounded-xl text-xs font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0" />
              <span>
                Pre-Order Ensembles: Estimated dispatch {product.preOrderDate || "within 7 to 10 business days"}.
              </span>
            </div>
          )}

          {/* Price Area */}
          <div className="p-4 rounded-xl bg-white border border-[#E7E1D8] shadow-sm flex items-baseline gap-3">
            <span className="font-serif text-3xl font-bold text-[#171717]">
              Rs. {effectivePrice.toLocaleString()}
            </span>
            {product.comparePrice && product.comparePrice > effectivePrice && (
              <>
                <span className="text-sm text-[#9B9289] line-through">
                  Rs. {product.comparePrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-[#9B3D3D] bg-[#FEF2F2] px-2 py-0.5 rounded">
                  {Math.round(((product.comparePrice - effectivePrice) / product.comparePrice) * 100)}% OFF
                </span>
              </>
            )}
            <span className="ml-auto text-xs text-[#1A6B3C] font-semibold flex items-center gap-1">
              <Check className="w-4 h-4" /> In Stock (Unstitched)
            </span>
          </div>

          {/* Unstitched Format Notice & Custom Stitching Option */}
          <div className="p-4 rounded-xl bg-white border border-[#E7E1D8] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1A6B3C]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                  Unstitched Ensemble ({product.pieceCount || 3} Piece)
                </span>
              </div>
              <span className="text-xs font-semibold text-[#7A6652] bg-[#F0EBE3] px-2.5 py-1 rounded-md">
                Standard Cut
              </span>
            </div>
            <p className="text-xs text-[#6B6259] leading-relaxed">
              Includes complete authentic unstitched shirt, dupatta, and trousers as crafted by Tauheed Textile. Ready for custom tailor stitching according to your preferred measurements and fit.
            </p>

            {/* Custom Stitching Callout via WhatsApp */}
            <div className="pt-3 border-t border-[#E7E1D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs text-[#171717] font-semibold">
                <Scissors className="w-4 h-4 text-[#7A6652]" />
                <span>Need Custom Tailor Stitching?</span>
              </div>
              <a
                href={`https://wa.me/923400262732?text=${encodeURIComponent(
                  `Salam Tauheed Textile, I would like to order custom stitching for "${product.title}" (SKU: ${product.sku}). Please share your stitching catalog and measurement guide.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Order Stitching via WhatsApp
              </a>
            </div>
          </div>

          {/* Quantity & Add to Bag / WhatsApp Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <div className="flex items-center border border-[#E7E1D8] rounded-xl px-3 bg-white text-[#171717]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-2 hover:text-[#7A6652] font-bold text-base"
                >
                  -
                </button>
                <span className="px-3 text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 py-2 hover:text-[#7A6652] font-bold text-base"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all ${
                  added
                    ? "bg-[#1A6B3C] text-white"
                    : "bg-[#171717] text-white hover:bg-black"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Add to Bag
                  </>
                )}
              </button>
            </div>

            {/* Direct Order via WhatsApp */}
            <a
              href={`https://wa.me/923400262732?text=${encodeURIComponent(
                `Salam Tauheed Textile, I want to order "${product.title}" (Unstitched, SKU: ${product.sku}) priced at Rs. ${effectivePrice}. Please confirm availability.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Order Instant via WhatsApp
            </a>
          </div>

          {/* Delivery Calculator */}
          <div className="p-4 rounded-xl bg-white border border-[#E7E1D8] shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#171717] flex items-center gap-1.5">
                <Truck className="w-4 h-4" /> Nationwide Delivery Timeline:
              </span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-[#F8F5F0] border border-[#E7E1D8] rounded px-2.5 py-1 text-xs text-[#171717] focus:outline-none"
              >
                <option value="Karachi">Karachi</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Multan">Multan</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Sialkot">Sialkot</option>
                <option value="Gujranwala">Gujranwala</option>
                <option value="Quetta">Quetta</option>
                <option value="Other">Other City</option>
              </select>
            </div>
            <p className="text-sm text-[#6B6259]">
              Estimated delivery to <span className="font-bold text-[#171717]">{selectedCity}</span>: {getCityDeliveryEstimate(selectedCity)}. 
              <strong className="text-[#171717]"> Free nationwide delivery on orders over Rs. 10,000.</strong> Flat 5% off on advance payment orders.
            </p>
          </div>

          {/* Trust Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-[#6B6259] p-2.5 rounded-xl bg-[#F0EBE3] border border-[#E7E1D8]">
              <ShieldCheck className="w-4 h-4 text-[#7A6652] shrink-0" />
              <span>100% Authentic Fabric</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B6259] p-2.5 rounded-xl bg-[#F0EBE3] border border-[#E7E1D8]">
              <RotateCcw className="w-4 h-4 text-[#7A6652] shrink-0" />
              <span>7-Day Exchange Policy</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B6259] p-2.5 rounded-xl bg-[#F0EBE3] border border-[#E7E1D8]">
              <Truck className="w-4 h-4 text-[#7A6652] shrink-0" />
              <span>Nationwide COD</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B6259] p-2.5 rounded-xl bg-[#F0EBE3] border border-[#E7E1D8]">
              <Package className="w-4 h-4 text-[#7A6652] shrink-0" />
              <span>Luxury Packaging</span>
            </div>
          </div>

          {/* Details Accordion */}
          <div className="border-t border-[#E7E1D8] pt-4 space-y-4">
            <div>
              <h3 className="font-serif font-bold text-sm text-[#171717] mb-1">Package Inclusions:</h3>
              <p className="text-sm text-[#6B6259] leading-relaxed bg-[#F8F5F0] p-3 rounded-lg border border-[#E7E1D8]">
                {product.packageIncludes || "Includes complete front, back, sleeves, pure dupatta, and trousers with authentic signature borders."}
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-sm text-[#171717] mb-1">Fabric & Description:</h3>
              <p className="text-sm text-[#6B6259] leading-relaxed bg-[#F8F5F0] p-3 rounded-lg border border-[#E7E1D8]">
                {product.description}
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-sm text-[#171717] mb-1">Care & Preservation:</h3>
              <p className="text-sm text-[#6B6259] leading-relaxed bg-[#F8F5F0] p-3 rounded-lg border border-[#E7E1D8]">
                {product.careInstructions || "Dry clean recommended. Gentle hand wash in cold water. Iron on reverse side with mild steam."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="border-t border-[#E7E1D8] pt-12">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#171717]">
              Customer Reviews ({reviewsList.length})
            </h2>
            <p className="text-xs text-[#6B6259] mt-0.5">Authentic feedback with unboxing and wearing photos</p>
          </div>
          <button
            onClick={() => setShowReviewModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#171717] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
          >
            <Camera className="w-4 h-4" />
            Write a Review & Add Photo
          </button>
        </div>

        {reviewsList.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-[#E7E1D8] space-y-3">
            <p className="text-sm text-[#6B6259]">Be the first to share your experience with this outfit!</p>
            <button
              onClick={() => setShowReviewModal(true)}
              className="text-xs font-bold text-[#7A6652] hover:underline"
            >
              Click here to write a review
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviewsList.map((r: any) => (
              <div key={r.id || r.customerName} className="p-5 rounded-xl bg-white border border-[#E7E1D8] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#D4A017]">
                    {[...Array(r.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#9B9289]">
                    {r.reviewerCity ? `${r.reviewerCity} • ` : ""}Verified Customer
                  </span>
                </div>

                <h4 className="font-serif font-bold text-sm text-[#171717]">{r.title}</h4>
                <p className="text-sm text-[#6B6259] italic">"{r.comment}"</p>

                {/* Customer Review Image (PC / Mobile uploaded) */}
                {r.imageUrl && (
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-[#E7E1D8] bg-[#F8F5F0]">
                    <Image
                      src={r.imageUrl}
                      alt="Customer review photo"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="pt-2 text-xs text-[#9B9289] font-medium border-t border-[#F0EBE3] flex items-center justify-between">
                  <span>— {r.customerName}</span>
                  {r.isFeatured && (
                    <span className="text-[10px] bg-[#F0EBE3] text-[#7A6652] font-semibold px-2 py-0.5 rounded">
                      Featured Review
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Submission Modal (PC & Mobile Photo Upload) */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !submittingReview && setShowReviewModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl z-10 space-y-4 text-[#171717] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E7E1D8] pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg">Write a Customer Review</h3>
                <p className="text-xs text-[#6B6259]">Share your thoughts & photos with other buyers</p>
              </div>
              <button 
                onClick={() => setShowReviewModal(false)} 
                className="p-1.5 rounded-full text-[#6B6259] hover:bg-[#F0EBE3]"
                disabled={submittingReview}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSuccess ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1A6B3C]/10 text-[#1A6B3C] mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-lg text-[#171717]">Review Submitted!</h4>
                <p className="text-sm text-[#6B6259]">
                  Thank you for your feedback. Your review will help fellow fashion lovers.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                {/* Star Rating Selection */}
                <div>
                  <label className="block font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                    Your Rating:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRevRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= revRating ? "text-[#D4A017] fill-current" : "text-[#D4CFC9]"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-[#6B6259] ml-2">
                      {revRating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Customer Name & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#171717] uppercase tracking-wider mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      placeholder="e.g. Ayesha Khan"
                      className="w-full p-2.5 rounded-lg border border-[#E7E1D8] bg-[#F8F5F0] text-sm text-[#171717] focus:outline-none focus:border-[#7A6652]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#171717] uppercase tracking-wider mb-1">
                      City (Optional)
                    </label>
                    <input
                      type="text"
                      value={revCity}
                      onChange={(e) => setRevCity(e.target.value)}
                      placeholder="e.g. Lahore / Karachi"
                      className="w-full p-2.5 rounded-lg border border-[#E7E1D8] bg-[#F8F5F0] text-sm text-[#171717] focus:outline-none focus:border-[#7A6652]"
                    />
                  </div>
                </div>

                {/* Review Headline */}
                <div>
                  <label className="block font-bold text-[#171717] uppercase tracking-wider mb-1">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    value={revTitle}
                    onChange={(e) => setRevTitle(e.target.value)}
                    placeholder="e.g. Stunning fabric quality and rich colors!"
                    className="w-full p-2.5 rounded-lg border border-[#E7E1D8] bg-[#F8F5F0] text-sm text-[#171717] focus:outline-none focus:border-[#7A6652]"
                  />
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block font-bold text-[#171717] uppercase tracking-wider mb-1">
                    Your Review *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    placeholder="Tell us about the fabric texture, embroidery details, and your wearing experience..."
                    className="w-full p-2.5 rounded-lg border border-[#E7E1D8] bg-[#F8F5F0] text-sm text-[#171717] focus:outline-none focus:border-[#7A6652]"
                  />
                </div>

                {/* Photo Upload (PC & Mobile Supported) */}
                <div>
                  <label className="block font-bold text-[#171717] uppercase tracking-wider mb-1">
                    Add Photo (PC / Mobile)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E7E1D8] bg-[#F0EBE3] hover:bg-[#E7E1D8] text-xs font-bold text-[#171717] transition-all">
                      <Camera className="w-4 h-4 text-[#7A6652]" />
                      <span>{revImage ? "Change Photo" : "Upload Unboxing Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                    {revImage && (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#7A6652]">
                        <Image src={revImage} alt="Uploaded preview" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => setRevImage(null)}
                          className="absolute top-0 right-0 p-0.5 bg-black/70 text-white rounded-bl"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-[#6B6259] mt-1">
                    Upload a photo from your gallery or take one directly with your camera.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-3.5 bg-[#171717] hover:bg-black disabled:opacity-50 text-white rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  {submittingReview ? "Submitting Review..." : "Submit Verified Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Image Zoom Modal */}
      {showZoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <button
            onClick={() => setShowZoomModal(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white z-20"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-3xl aspect-[3/4] max-h-[85vh] rounded-2xl overflow-hidden bg-white">
            <Image
              src={currentImage.url}
              alt={product.title}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[#E7E1D8] pt-12 bg-[#F8F5F0] -mx-4 px-4 sm:-mx-8 sm:px-8 lg:-mx-16 lg:px-16 pb-12 mt-12">
          <div className="flex items-center justify-between mb-8 pt-8">
            <h2 className="text-2xl font-serif font-bold text-[#171717]">You May Also Like</h2>
            <Link href="/shop" className="text-xs font-bold text-[#7A6652] hover:text-[#171717] uppercase">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p: any) => (
              <ProductCard
                key={p.id}
                id={p.id}
                slug={p.slug}
                title={p.title}
                fabric={p.fabric}
                basePrice={p.basePrice}
                comparePrice={p.comparePrice}
                salePrice={p.salePrice}
                images={p.images}
                variants={p.variants}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-[#E7E1D8] px-4 py-3 z-50 flex gap-3 shadow-lg" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 12px), 12px)' }}>
        <button
          onClick={handleAddToCart}
          className={`flex-1 rounded-full py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
            added ? "bg-[#1A6B3C] text-white" : "bg-[#171717] text-white"
          }`}
        >
          {added ? <Check className="w-4 h-4" /> : "ADD TO BAG"}
        </button>
        <a
          href={`https://wa.me/923400262732?text=${encodeURIComponent(
            `Salam Tauheed Textile, I want to order "${product.title}" (Unstitched, SKU: ${product.sku}) priced at Rs. ${effectivePrice}. Please confirm availability.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 bg-[#128C7E] text-white rounded-full py-3 px-4 text-xs font-bold flex items-center justify-center gap-1.5"
          aria-label="Order via WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
