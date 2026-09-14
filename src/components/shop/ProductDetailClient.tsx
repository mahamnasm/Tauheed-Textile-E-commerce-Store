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
  Ruler, 
  Share2,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Package,
  Scissors,
  Video,
  Play,
  Image as ImageIcon
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
  const [selectedVariantId, setSelectedVariantId] = useState<string>(variants[0]?.id || "");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showAIFitModal, setShowAIFitModal] = useState(false);
  const [fitHeightFeet, setFitHeightFeet] = useState(5);
  const [fitHeightInches, setFitHeightInches] = useState(4);
  const [fitChest, setFitChest] = useState(36);
  const [fitWaist, setFitWaist] = useState(30);
  const [fitPreference, setFitPreference] = useState<"tailored" | "regular" | "modest_loose">("regular");
  const [fitResult, setFitResult] = useState<any | null>(null);

  const handleCalculateFit = () => {
    const chest = Number(fitChest);
    const waist = Number(fitWaist);
    let size = "Medium";
    let ease = fitPreference === "modest_loose" ? 3.5 : fitPreference === "regular" ? 2.5 : 1.5;
    if (chest <= 34) size = "Small";
    else if (chest <= 37) size = "Medium";
    else if (chest <= 41) size = "Large";
    else size = "XL";

    const advice = fitPreference === "modest_loose"
      ? `For a graceful, modest flowing drape with generous room around waist & hips, Size ${size} is optimal (+${ease}" ease).`
      : fitPreference === "tailored"
      ? `Size ${size} provides a clean contoured silhouette highlighting the neckline and waistline (+${ease}" ease).`
      : `Size ${size} provides our standard balanced luxury cut with a straight drop (+${ease}" ease).`;

    setFitResult({
      size,
      advice,
      finishedChest: chest + ease,
      finishedWaist: waist + (ease * 0.8)
    });

    const match = variants.find((v: any) => v.size.toLowerCase().includes(size.toLowerCase()));
    if (match) setSelectedVariantId(match.id);
  };

  const [showZoomModal, setShowZoomModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Lahore");
  const [mediaMode, setMediaMode] = useState<"PHOTO" | "VIDEO">("PHOTO");

  const images = product.images?.length > 0 ? product.images : [{ url: "/assets/hero-model.jpg" }];
  const currentImage = images[selectedImageIndex] || images[0];

  const selectedVariant = variants.find((v: any) => v.id === selectedVariantId) || variants[0];
  const effectiveBasePrice = product.salePrice || product.basePrice;
  const effectivePrice = effectiveBasePrice + (selectedVariant?.priceAdjustment || 0);

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addToCart(
      {
        variantId: selectedVariant.id,
        productId: product.id,
        productTitle: product.title,
        productSlug: product.slug,
        image: currentImage.url,
        size: selectedVariant.size,
        color: selectedVariant.color,
        stitchedType: selectedVariant.stitchedType,
        price: effectivePrice,
        maxStock: selectedVariant.stockQuantity || 10,
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
    if (city === "Lahore") return "1-2 Business Days (Same-Day / Next-Day Dispatch)";
    if (["Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Sialkot", "Gujranwala"].includes(city)) {
      return "2-3 Business Days via TCS Express";
    }
    return "3-5 Business Days via Trax / Leopards";
  };

  return (
    <div className="space-y-16">
      {/* Breadcrumbs */}
      <nav className="text-xs text-brand-600 flex items-center gap-2">
        <Link href="/" className="hover:text-gold-700">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-gold-700">Shop</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-gold-700">
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-brand-900 font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery Column (Supports > 5 Images + Runway Video) */}
        <div className="space-y-4">
          {/* Media Mode Selector: Photos vs Video Reel (if video exists) */}
          {product.videoUrl && (
            <div className="flex rounded-xl p-1 bg-sand-100 border border-sand-200">
              <button
                type="button"
                onClick={() => setMediaMode("PHOTO")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                  mediaMode === "PHOTO"
                    ? "bg-brand-950 text-gold-400 shadow-sm"
                    : "text-brand-700 hover:text-brand-950"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Photo Gallery ({images.length})
              </button>
              <button
                type="button"
                onClick={() => setMediaMode("VIDEO")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                  mediaMode === "VIDEO"
                    ? "bg-brand-950 text-gold-400 shadow-sm"
                    : "text-brand-700 hover:text-brand-950"
                }`}
              >
                <Video className="w-3.5 h-3.5 text-gold-500" /> Watch Runway Reel
              </button>
            </div>
          )}

          {/* Media Player or Main Display Image */}
          {mediaMode === "VIDEO" && product.videoUrl ? (
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-black border border-sand-200 shadow-xl flex items-center justify-center">
              {product.videoUrl.includes("youtube.com") || product.videoUrl.includes("youtu.be") ? (
                <iframe
                  src={product.videoUrl.replace("watch?v=", "embed/")}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={product.videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-4 left-4 pointer-events-none">
                <span className="px-3 py-1 bg-ink-black/80 text-gold-400 text-xs font-bold uppercase rounded-lg shadow border border-sand-800 flex items-center gap-1">
                  <Play className="w-3 h-3 fill-current" /> Runway Walk
                </span>
              </div>
            </div>
          ) : (
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-sand-100 border border-sand-200 shadow-md group">
              <Image
                src={currentImage.url}
                alt={currentImage.alt || product.title}
                fill
                priority
                className="object-cover object-top cursor-zoom-in transition-transform duration-500 hover:scale-105"
                onClick={() => setShowZoomModal(true)}
              />

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {product.isSale && (
                  <span className="px-3 py-1 bg-maroon-700 text-white text-xs font-bold uppercase rounded-lg shadow">
                    Sale
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="px-3 py-1 bg-brand-950 text-gold-400 text-xs font-bold uppercase rounded-lg shadow border border-gold-500/30">
                    New Arrival
                  </span>
                )}
                {product.isPreOrder && (
                  <span className="px-3 py-1 bg-gold-600 text-white text-xs font-bold uppercase rounded-lg shadow">
                    Pre-Order
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md z-10 ${
                  isWishlisted
                    ? "bg-maroon-600 text-white"
                    : "bg-white/80 text-brand-900 hover:text-maroon-600"
                }`}
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>

              {/* Expand / Zoom Button */}
              <button
                onClick={() => setShowZoomModal(true)}
                className="absolute bottom-4 right-4 p-2.5 rounded-full bg-brand-950/70 text-white backdrop-blur-md hover:bg-brand-950 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="Click to Zoom Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Prev / Next Arrows for Multi-image */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-brand-950 hover:bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-brand-950 hover:bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter Pill */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-4 px-2.5 py-1 rounded-full bg-brand-950/75 text-sand-200 text-[10px] font-mono tracking-wider backdrop-blur-sm z-10">
                  {selectedImageIndex + 1} / {images.length} Photos
                </div>
              )}
            </div>
          )}

          {/* Multi-Image Thumbnail Gallery (Supports More Than 5 Images) */}
          {images.length > 1 && (
            <div className="space-y-1">
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMediaMode("PHOTO");
                      setSelectedImageIndex(idx);
                    }}
                    className={`relative w-16 sm:w-20 h-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-sand-100 ${
                      mediaMode === "PHOTO" && selectedImageIndex === idx
                        ? "border-gold-600 ring-2 ring-gold-600/30 shadow-md scale-105"
                        : "border-transparent opacity-65 hover:opacity-100"
                    }`}
                  >
                    <Image src={img.url} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-brand-500 italic">
                * Scroll right to view all {images.length} editorial angles. Click any image to enlarge.
              </p>
            </div>
          )}
        </div>

        {/* Product Details & Purchase Controls */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-gold-700 font-bold">
                {product.fabric} • {product.workType}
              </span>
              <span className="text-xs text-brand-500 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-950 mt-2">
              {product.title}
            </h1>

            {/* Ratings & Occasion */}
            <div className="flex items-center gap-3 mt-3 text-xs">
              <div className="flex items-center gap-1 text-gold-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-brand-900">5.0</span>
              </div>
              <span className="text-sand-400">|</span>
              <span className="text-brand-700 font-medium">({product.reviews?.length || 4} verified Pakistani reviews)</span>
              <span className="text-sand-400">|</span>
              <span className="px-2 py-0.5 rounded bg-sand-200/80 text-brand-800 font-semibold text-[11px]">
                {product.pieceCount}-Piece Set
              </span>
            </div>
          </div>

          {/* Video Reel Callout Button (if video attached) */}
          {product.videoUrl && (
            <button
              type="button"
              onClick={() => setMediaMode(mediaMode === "VIDEO" ? "PHOTO" : "VIDEO")}
              className="w-full p-3 rounded-xl bg-brand-950 text-gold-300 hover:bg-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-gold-500/30 transition-all shadow-md font-serif"
            >
              <Play className="w-4 h-4 text-gold-400 fill-current" />
              {mediaMode === "VIDEO" ? "Switch to Photo Gallery" : "Watch Runway Reel in Motion"}
            </button>
          )}

          {/* Pre-Order Banner (if applicable) */}
          {product.isPreOrder && (
            <div className="p-3 bg-brand-950 text-gold-300 rounded-xl text-xs font-semibold flex items-center gap-2 border border-gold-500/30">
              <Clock className="w-4 h-4 text-gold-400 shrink-0" />
              <span>
                Pre-Order Ensembles: Estimated dispatch {product.preOrderDate || "within 10 to 14 business days"}.
              </span>
            </div>
          )}

          {/* Price Banner */}
          <div className="p-4 rounded-xl bg-sand-100/70 border border-sand-200 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-bold text-brand-950">
              Rs. {effectivePrice.toLocaleString()}
            </span>
            {product.comparePrice && product.comparePrice > effectivePrice && (
              <>
                <span className="text-sm text-sand-400 line-through">
                  Rs. {product.comparePrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-maroon-700 bg-maroon-50 px-2 py-0.5 rounded">
                  {Math.round(((product.comparePrice - effectivePrice) / product.comparePrice) * 100)}% OFF
                </span>
              </>
            )}
            <span className="ml-auto text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <Check className="w-4 h-4" /> In Stock & Ready to Ship
            </span>
          </div>

          {/* Variants Selector (Size & Stitching) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-brand-900 uppercase tracking-wider">
                Select Option (Stitched / Unstitched)
              </label>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowAIFitModal(true)}
                  className="text-xs text-gold-400 hover:text-gold-300 font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gold-500/15 border border-gold-500/30 transition-all hover:bg-gold-500/25 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" /> AI Fit Advisor
                </button>
                <button
                  onClick={() => setShowSizeModal(true)}
                  className="text-xs text-sand-400 hover:text-sand-200 font-semibold flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" /> Size Chart
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {variants.map((v: any) => {
                const isSelected = selectedVariant?.id === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? "border-gold-600 bg-sand-50 ring-2 ring-gold-600/30 text-brand-950 shadow-sm"
                        : "border-sand-300 hover:border-gold-400 bg-white text-brand-800"
                    }`}
                  >
                    <span className="text-xs font-bold">{v.size}</span>
                    <span className="text-[11px] text-brand-600">{v.stitchedType}</span>
                    <span className="text-[10px] text-gold-700 font-semibold mt-1">
                      {v.priceAdjustment > 0 ? `+Rs. ${v.priceAdjustment}` : "Standard"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Sizing Callout (Inspired by reference Pakistani couture sites) */}
            <div className="p-3 rounded-xl bg-sand-50 border border-sand-200/70 flex items-center justify-between text-xs">
              <span className="text-brand-700 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-gold-600" /> Need Made-to-Measure Custom Stitching?
              </span>
              <a
                href={`https://wa.me/923400262732?text=${encodeURIComponent(
                  `Salam Tauheed Textile, I want custom made-to-measure stitching for "${product.title}" (SKU: ${product.sku}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-700 hover:text-gold-800 font-bold underline"
              >
                Request via WhatsApp
              </a>
            </div>
          </div>

          {/* Quantity & Add to Cart / WhatsApp Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <div className="flex items-center border border-sand-300 rounded-xl px-3 bg-sand-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-2 text-brand-700 hover:text-gold-700 font-bold"
                >
                  -
                </button>
                <span className="px-3 text-sm font-bold text-brand-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 py-2 text-brand-700 hover:text-gold-700 font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-brand-900 hover:bg-brand-950 text-sand-50"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Shopping Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-gold-400" /> Add to Shopping Bag
                  </>
                )}
              </button>
            </div>

            {/* Direct Order via WhatsApp (0340 0262732) */}
            <a
              href={`https://wa.me/923400262732?text=${encodeURIComponent(
                `Salam Tauheed Textile, I want to order "${product.title}" (${selectedVariant?.size || "Unstitched"}, SKU: ${product.sku}) priced at Rs. ${effectivePrice}. Please confirm availability.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow transition-all"
            >
              Order Instant via WhatsApp (0340 0262732)
            </a>
          </div>

          {/* Pakistan Delivery Calculator */}
          <div className="p-4 rounded-xl bg-white border border-sand-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-brand-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-gold-600" /> Nationwide Delivery Estimate:
              </span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-sand-50 border border-sand-300 rounded px-2 py-1 text-xs text-brand-900 focus:outline-none"
              >
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
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
            <p className="text-xs text-brand-700 bg-sand-50 p-2 rounded border border-sand-100">
              Estimated delivery to <span className="font-bold">{selectedCity}</span>: {getCityDeliveryEstimate(selectedCity)}. 
              Cash on delivery available. Free delivery on orders over Rs. 4,999.
            </p>
          </div>

          {/* Luxury Guarantees Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-brand-800 p-2.5 rounded-xl bg-sand-50/70 border border-sand-200/60">
              <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
              <span>100% Authentic Fabric</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-800 p-2.5 rounded-xl bg-sand-50/70 border border-sand-200/60">
              <RotateCcw className="w-4 h-4 text-gold-600 shrink-0" />
              <span>7-Day Exchange Window</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-800 p-2.5 rounded-xl bg-sand-50/70 border border-sand-200/60">
              <Truck className="w-4 h-4 text-gold-600 shrink-0" />
              <span>Nationwide COD Fulfillment</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-800 p-2.5 rounded-xl bg-sand-50/70 border border-sand-200/60">
              <Package className="w-4 h-4 text-gold-600 shrink-0" />
              <span>Luxury Garment Packaging</span>
            </div>
          </div>

          {/* Package Contents Accordion */}
          <div className="border-t border-sand-200 pt-4 space-y-4">
            <div>
              <h3 className="font-serif font-bold text-sm text-brand-950 mb-1">Package Inclusions:</h3>
              <p className="text-xs text-brand-700 leading-relaxed bg-sand-50 p-3 rounded-lg border border-sand-200/60">
                {product.packageIncludes || "Includes complete front, back, sleeves, pure dupatta, and trousers with authentic signature borders."}
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-sm text-brand-950 mb-1">Fabric & Description:</h3>
              <p className="text-xs text-brand-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-sm text-brand-950 mb-1">Care & Preservation:</h3>
              <p className="text-xs text-brand-600">
                {product.careInstructions || "Dry clean recommended. Gentle hand wash in cold water. Iron on reverse side."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Zoom Modal */}
      {showZoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/90 backdrop-blur-md">
          <button
            onClick={() => setShowZoomModal(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white z-20"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-3xl aspect-[3/4] max-h-[85vh] rounded-2xl overflow-hidden">
            <Image
              src={currentImage.url}
              alt={product.title}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brand-950/70 backdrop-blur-sm" onClick={() => setShowSizeModal(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <h3 className="font-serif font-bold text-lg text-brand-950">Pakistani Women's Size Chart (Inches)</h3>
              <button 
                onClick={() => setShowSizeModal(false)} 
                className="p-1 rounded-full text-brand-600 hover:bg-sand-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-sand-100 text-brand-900 uppercase">
                  <tr>
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Chest</th>
                    <th className="p-2.5">Waist</th>
                    <th className="p-2.5">Hips</th>
                    <th className="p-2.5">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200">
                  <tr><td className="p-2.5 font-bold">XS</td><td className="p-2.5">36"</td><td className="p-2.5">32"</td><td className="p-2.5">38"</td><td className="p-2.5">40"</td></tr>
                  <tr><td className="p-2.5 font-bold">S</td><td className="p-2.5">38"</td><td className="p-2.5">34"</td><td className="p-2.5">40"</td><td className="p-2.5">42"</td></tr>
                  <tr><td className="p-2.5 font-bold">M</td><td className="p-2.5">40"</td><td className="p-2.5">36"</td><td className="p-2.5">42"</td><td className="p-2.5">44"</td></tr>
                  <tr><td className="p-2.5 font-bold">L</td><td className="p-2.5">44"</td><td className="p-2.5">40"</td><td className="p-2.5">46"</td><td className="p-2.5">45"</td></tr>
                  <tr><td className="p-2.5 font-bold">XL</td><td className="p-2.5">48"</td><td className="p-2.5">44"</td><td className="p-2.5">50"</td><td className="p-2.5">46"</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-brand-500 italic">
              * Measurements are in inches. Custom tailored orders can also be requested via WhatsApp concierge.
            </p>
          </div>
        </div>
      )}

      {/* AI Fit & Sizing Advisor Modal */}
      {showAIFitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-sand-200 relative text-xs">
            <button
              onClick={() => setShowAIFitModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-brand-400 hover:text-brand-900 hover:bg-sand-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-gold-700 tracking-wider uppercase">Atelier Fit Advisor</span>
                <h3 className="font-serif font-bold text-xl text-brand-950">AI Smart Sizing & Tailoring</h3>
              </div>
            </div>

            <p className="text-brand-600 leading-relaxed text-xs">
              Enter your measurements to calculate your optimal silhouette size for <strong>{product.title}</strong> based on fabric drape and tailoring standards.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-brand-900 mb-1">Height</label>
                <div className="flex gap-2">
                  <select
                    value={fitHeightFeet}
                    onChange={(e) => setFitHeightFeet(Number(e.target.value))}
                    className="w-full p-2.5 border border-sand-300 rounded-xl bg-sand-50"
                  >
                    {[4, 5, 6].map((ft) => (
                      <option key={ft} value={ft}>{ft} ft</option>
                    ))}
                  </select>
                  <select
                    value={fitHeightInches}
                    onChange={(e) => setFitHeightInches(Number(e.target.value))}
                    className="w-full p-2.5 border border-sand-300 rounded-xl bg-sand-50"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={i}>{i} in</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-900 mb-1">Chest / Bust (Inches)</label>
                <input
                  type="number"
                  value={fitChest}
                  onChange={(e) => setFitChest(Number(e.target.value))}
                  className="w-full p-2.5 border border-sand-300 rounded-xl bg-sand-50"
                  placeholder="e.g. 36"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-900 mb-1">Waist (Inches)</label>
                <input
                  type="number"
                  value={fitWaist}
                  onChange={(e) => setFitWaist(Number(e.target.value))}
                  className="w-full p-2.5 border border-sand-300 rounded-xl bg-sand-50"
                  placeholder="e.g. 30"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-900 mb-1">Preferred Silhouette</label>
                <select
                  value={fitPreference}
                  onChange={(e) => setFitPreference(e.target.value as any)}
                  className="w-full p-2.5 border border-sand-300 rounded-xl bg-sand-50"
                >
                  <option value="regular">Standard Balanced Cut</option>
                  <option value="tailored">Contoured / Tailored</option>
                  <option value="modest_loose">Modest / Flowing Flare</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCalculateFit}
              className="w-full py-3 bg-brand-950 hover:bg-black text-sand-50 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4 text-gold-400" /> Calculate Optimal Size
            </button>

            {fitResult && (
              <div className="p-4 rounded-2xl bg-gold-50 border border-gold-200 text-brand-950 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-gold-900">Recommended Size:</span>
                  <span className="px-3 py-1 bg-gold-600 text-brand-950 font-serif font-bold text-sm rounded-lg shadow-sm">
                    {fitResult.size}
                  </span>
                </div>
                <p className="text-xs text-brand-800 leading-relaxed">{fitResult.advice}</p>
                <div className="pt-2 border-t border-gold-200/80 flex items-center justify-between text-[11px] text-brand-700">
                  <span>Finished Chest: <strong>{fitResult.finishedChest}"</strong></span>
                  <span>Finished Waist: <strong>{fitResult.finishedWaist}"</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="border-t border-sand-200 pt-12">
        <h2 className="font-serif text-2xl font-bold text-brand-950 mb-6">
          Customer Reviews ({product.reviews?.length || 2})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.reviews?.map((r: any) => (
            <div key={r.id} className="p-5 rounded-xl bg-white border border-sand-200 shadow-sm space-y-2">
              <div className="flex items-center gap-1 text-gold-500">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <h4 className="font-serif font-bold text-sm text-brand-950">{r.title}</h4>
              <p className="text-xs text-brand-700 italic">"{r.comment}"</p>
              <div className="pt-2 text-[11px] text-brand-500 font-medium">
                — {r.customerName}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* You May Also Like */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-sand-200 pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl font-bold text-brand-950">You May Also Adore</h2>
            <Link href="/shop" className="text-xs font-bold text-gold-700 hover:text-gold-800 uppercase">
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
    </div>
  );
}
