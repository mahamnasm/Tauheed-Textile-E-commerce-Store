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
  Image as ImageIcon,
  MessageCircle
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
    <div className="space-y-10 pb-20 sm:pb-10">
      {/* Breadcrumbs */}
      <nav className="text-xs text-[#6B6259] flex items-center gap-1.5">
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
        <span className="text-[#171717] font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery Column */}
        <div className="space-y-4">
          {/* Media Mode Selector */}
          {product.videoUrl && (
            <div className="flex rounded-xl p-1 bg-[#F0EBE3] border border-[#E7E1D8]">
              <button
                type="button"
                onClick={() => setMediaMode("PHOTO")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                  mediaMode === "PHOTO"
                    ? "bg-white text-[#171717] shadow-sm"
                    : "text-[#6B6259] hover:text-[#171717]"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Photo Gallery ({images.length})
              </button>
              <button
                type="button"
                onClick={() => setMediaMode("VIDEO")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                  mediaMode === "VIDEO"
                    ? "bg-white text-[#171717] shadow-sm"
                    : "text-[#6B6259] hover:text-[#171717]"
                }`}
              >
                <Video className="w-3.5 h-3.5" /> Watch Runway Reel
              </button>
            </div>
          )}

          {/* Media Player or Main Display Image */}
          {mediaMode === "VIDEO" && product.videoUrl ? (
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-black border border-[#E7E1D8] shadow-xl flex items-center justify-center">
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
                <span className="px-3 py-1 bg-black/80 text-white text-xs font-bold uppercase rounded-lg shadow border border-[#E7E1D8] flex items-center gap-1">
                  <Play className="w-3 h-3 fill-current" /> Runway Walk
                </span>
              </div>
            </div>
          ) : (
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#F0EBE3] border border-[#E7E1D8] group">
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
                  <span className="px-3 py-1 bg-[#9B3D3D] text-white text-xs font-bold uppercase rounded-lg shadow">
                    Sale
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="px-3 py-1 bg-[#171717] text-white text-xs font-bold uppercase rounded-lg shadow">
                    New Arrival
                  </span>
                )}
                {product.isPreOrder && (
                  <span className="px-3 py-1 bg-[#7A5C00] text-white text-xs font-bold uppercase rounded-lg shadow">
                    Pre-Order
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md z-10 ${
                  isWishlisted
                    ? "bg-[#9B3D3D] text-white"
                    : "bg-white/80 text-[#171717] hover:text-[#9B3D3D]"
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
                    className={`relative w-16 sm:w-20 h-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-[#F0EBE3] ${
                      mediaMode === "PHOTO" && selectedImageIndex === idx
                        ? "border-[#7A6652] ring-1 ring-[#7A6652]/30 scale-105"
                        : "border-transparent opacity-65 hover:opacity-100"
                    }`}
                  >
                    <Image src={img.url} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Details & Controls */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[#7A6652] font-semibold">
                {product.fabric} • {product.workType}
              </span>
              <span className="text-xs text-[#9B9289]">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717] mt-2">
              {product.title}
            </h1>

            {/* Ratings & Occasion */}
            <div className="flex items-center gap-3 mt-3 text-xs">
              <div className="flex items-center gap-1 text-[#D4A017]">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-[#171717]">5.0</span>
              </div>
              <span className="text-[#6B6259]">|</span>
              <span className="text-[#6B6259]">({product.reviews?.length || 4} reviews)</span>
              <span className="text-[#6B6259]">|</span>
              <span className="px-2 py-0.5 rounded bg-[#F0EBE3] text-[#171717] text-xs">
                {product.pieceCount}-Piece Set
              </span>
            </div>
          </div>

          {/* Video Reel Callout Button */}
          {product.videoUrl && (
            <button
              type="button"
              onClick={() => setMediaMode(mediaMode === "VIDEO" ? "PHOTO" : "VIDEO")}
              className="w-full p-3 rounded-xl bg-[#171717] text-white border border-[#2A2626] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md font-serif hover:bg-black"
            >
              <Play className="w-4 h-4 fill-current" />
              {mediaMode === "VIDEO" ? "Switch to Photo Gallery" : "Watch Runway Reel in Motion"}
            </button>
          )}

          {/* Pre-Order Banner */}
          {product.isPreOrder && (
            <div className="p-3 bg-[#FEF3CD] border border-[#F5D87E] text-[#7A5C00] rounded-xl text-xs font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0" />
              <span>
                Pre-Order Ensembles: Estimated dispatch {product.preOrderDate || "within 10 to 14 business days"}.
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
              <Check className="w-4 h-4" /> In Stock
            </span>
          </div>

          {/* Variants Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                Select Option (Stitched / Unstitched)
              </label>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowAIFitModal(true)}
                  className="text-xs text-[#7A6652] bg-[#F0EBE3] border border-[#E7E1D8] rounded-lg px-2.5 py-1 flex items-center gap-1 transition-all hover:bg-[#E7E1D8] shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI Fit Advisor
                </button>
                <button
                  onClick={() => setShowSizeModal(true)}
                  className="text-xs text-[#6B6259] hover:text-[#171717] font-semibold flex items-center gap-1"
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
                        ? "border-[#7A6652] bg-[#F8F5F0] ring-2 ring-[#7A6652]/20"
                        : "border-[#E7E1D8] bg-white hover:border-[#C4A882]"
                    }`}
                  >
                    <span className="text-xs font-bold text-[#171717]">{v.size}</span>
                    <span className="text-[11px] text-[#6B6259]">{v.stitchedType}</span>
                    <span className="text-[10px] text-[#7A6652] font-semibold mt-1">
                      {v.priceAdjustment > 0 ? `+Rs. ${v.priceAdjustment}` : "Standard"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Sizing Callout */}
            <div className="p-3 rounded-xl bg-[#F0EBE3] border border-[#E7E1D8] flex items-center justify-between text-xs text-[#6B6259]">
              <span className="flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5" /> Need Custom Stitching?
              </span>
              <a
                href={`https://wa.me/923400262732?text=${encodeURIComponent(
                  `Salam Tauheed Textile, I want custom made-to-measure stitching for "${product.title}" (SKU: ${product.sku}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7A6652] hover:underline font-bold"
              >
                Request via WhatsApp
              </a>
            </div>
          </div>

          {/* Quantity & Add to Cart / WhatsApp Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <div className="flex items-center border border-[#E7E1D8] rounded-xl px-3 bg-white text-[#171717]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-2 hover:text-[#7A6652] font-bold"
                >
                  -
                </button>
                <span className="px-3 text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 py-2 hover:text-[#7A6652] font-bold"
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
                    <Check className="w-5 h-5" /> Added
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
                `Salam Tauheed Textile, I want to order "${product.title}" (${selectedVariant?.size || "Unstitched"}, SKU: ${product.sku}) priced at Rs. ${effectivePrice}. Please confirm availability.`
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
                <Truck className="w-4 h-4" /> Nationwide Delivery Estimate:
              </span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-[#F8F5F0] border border-[#E7E1D8] rounded px-2 py-1 text-xs text-[#171717] focus:outline-none"
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
            <p className="text-sm text-[#6B6259]">
              Estimated delivery to <span className="font-bold">{selectedCity}</span>: {getCityDeliveryEstimate(selectedCity)}. 
              Free delivery on orders over Rs. 9,999. Flat 5% off on advance payment orders.
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
              <span>7-Day Exchange Window</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B6259] p-2.5 rounded-xl bg-[#F0EBE3] border border-[#E7E1D8]">
              <Truck className="w-4 h-4 text-[#7A6652] shrink-0" />
              <span>Nationwide COD</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B6259] p-2.5 rounded-xl bg-[#F0EBE3] border border-[#E7E1D8]">
              <Package className="w-4 h-4 text-[#7A6652] shrink-0" />
              <span>Luxury Garment Packaging</span>
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
                {product.careInstructions || "Dry clean recommended. Gentle hand wash in cold water. Iron on reverse side."}
              </p>
            </div>
          </div>
        </div>
      </div>

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

      {/* Size Chart Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSizeModal(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl z-10 space-y-4 text-[#171717]">
            <div className="flex items-center justify-between border-b border-[#E7E1D8] pb-3">
              <h3 className="font-serif font-bold text-lg">Size Chart (Inches)</h3>
              <button 
                onClick={() => setShowSizeModal(false)} 
                className="p-1 rounded-full text-[#6B6259] hover:bg-[#F0EBE3]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F8F5F0] uppercase">
                  <tr>
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Chest</th>
                    <th className="p-2.5">Waist</th>
                    <th className="p-2.5">Hips</th>
                    <th className="p-2.5">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E1D8]">
                  <tr><td className="p-2.5 font-bold">XS</td><td className="p-2.5">36"</td><td className="p-2.5">32"</td><td className="p-2.5">38"</td><td className="p-2.5">40"</td></tr>
                  <tr><td className="p-2.5 font-bold">S</td><td className="p-2.5">38"</td><td className="p-2.5">34"</td><td className="p-2.5">40"</td><td className="p-2.5">42"</td></tr>
                  <tr><td className="p-2.5 font-bold">M</td><td className="p-2.5">40"</td><td className="p-2.5">36"</td><td className="p-2.5">42"</td><td className="p-2.5">44"</td></tr>
                  <tr><td className="p-2.5 font-bold">L</td><td className="p-2.5">44"</td><td className="p-2.5">40"</td><td className="p-2.5">46"</td><td className="p-2.5">45"</td></tr>
                  <tr><td className="p-2.5 font-bold">XL</td><td className="p-2.5">48"</td><td className="p-2.5">44"</td><td className="p-2.5">50"</td><td className="p-2.5">46"</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-[#6B6259] italic">
              * Measurements are in inches. Custom tailored orders can also be requested via WhatsApp.
            </p>
          </div>
        </div>
      )}

      {/* AI Fit Modal */}
      {showAIFitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-[#171717]">
            <button
              onClick={() => setShowAIFitModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#6B6259] hover:text-[#171717] hover:bg-[#F0EBE3] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F0EBE3] flex items-center justify-center text-[#7A6652]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#7A6652] tracking-wider uppercase">Atelier Fit Advisor</span>
                <h3 className="font-serif font-bold text-xl">AI Smart Sizing</h3>
              </div>
            </div>

            <p className="text-[#6B6259] leading-relaxed text-sm">
              Enter your measurements to calculate your optimal size.
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block font-bold mb-1">Height</label>
                <div className="flex gap-2">
                  <select
                    value={fitHeightFeet}
                    onChange={(e) => setFitHeightFeet(Number(e.target.value))}
                    className="w-full p-2.5 border border-[#E7E1D8] rounded-xl bg-[#F8F5F0]"
                  >
                    {[4, 5, 6].map((ft) => (
                      <option key={ft} value={ft}>{ft} ft</option>
                    ))}
                  </select>
                  <select
                    value={fitHeightInches}
                    onChange={(e) => setFitHeightInches(Number(e.target.value))}
                    className="w-full p-2.5 border border-[#E7E1D8] rounded-xl bg-[#F8F5F0]"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={i}>{i} in</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Chest (Inches)</label>
                <input
                  type="number"
                  value={fitChest}
                  onChange={(e) => setFitChest(Number(e.target.value))}
                  className="w-full p-2.5 border border-[#E7E1D8] rounded-xl bg-[#F8F5F0]"
                  placeholder="e.g. 36"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Waist (Inches)</label>
                <input
                  type="number"
                  value={fitWaist}
                  onChange={(e) => setFitWaist(Number(e.target.value))}
                  className="w-full p-2.5 border border-[#E7E1D8] rounded-xl bg-[#F8F5F0]"
                  placeholder="e.g. 30"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Preference</label>
                <select
                  value={fitPreference}
                  onChange={(e) => setFitPreference(e.target.value as any)}
                  className="w-full p-2.5 border border-[#E7E1D8] rounded-xl bg-[#F8F5F0]"
                >
                  <option value="regular">Standard</option>
                  <option value="tailored">Tailored</option>
                  <option value="modest_loose">Modest</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCalculateFit}
              className="w-full py-3 bg-[#171717] hover:bg-black text-white rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm text-sm"
            >
              <Sparkles className="w-4 h-4" /> Calculate Size
            </button>

            {fitResult && (
              <div className="p-4 rounded-xl bg-[#F8F5F0] border border-[#E7E1D8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider">Recommended:</span>
                  <span className="px-3 py-1 bg-white border border-[#E7E1D8] font-serif font-bold text-sm rounded-lg">
                    {fitResult.size}
                  </span>
                </div>
                <p className="text-sm text-[#6B6259]">{fitResult.advice}</p>
                <div className="pt-2 border-t border-[#E7E1D8] flex items-center justify-between text-xs text-[#6B6259]">
                  <span>Finished Chest: <strong>{fitResult.finishedChest}"</strong></span>
                  <span>Finished Waist: <strong>{fitResult.finishedWaist}"</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="border-t border-[#E7E1D8] pt-12">
        <h2 className="font-serif text-2xl font-bold text-[#171717] mb-6">
          Customer Reviews ({product.reviews?.length || 2})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.reviews?.map((r: any) => (
            <div key={r.id} className="p-5 rounded-xl bg-white border border-[#E7E1D8] shadow-sm space-y-2">
              <div className="flex items-center gap-1 text-[#D4A017]">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <h4 className="font-serif font-bold text-sm text-[#171717]">{r.title}</h4>
              <p className="text-sm text-[#6B6259] italic">"{r.comment}"</p>
              <div className="pt-2 text-xs text-[#9B9289] font-medium">
                — {r.customerName}
              </div>
            </div>
          ))}
        </div>
      </div>

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
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-[#E7E1D8] px-4 py-3 z-50 flex gap-3" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 12px), 12px)' }}>
        <button
          onClick={handleAddToCart}
          className={`flex-1 rounded-full py-3 text-sm font-bold flex items-center justify-center gap-2 ${
            added ? "bg-[#1A6B3C] text-white" : "bg-[#171717] text-white"
          }`}
        >
          {added ? <Check className="w-5 h-5" /> : "ADD TO BAG"}
        </button>
        <a
          href={`https://wa.me/923400262732?text=${encodeURIComponent(
            `Salam Tauheed Textile, I want to order "${product.title}" (${selectedVariant?.size || "Unstitched"}, SKU: ${product.sku}) priced at Rs. ${effectivePrice}. Please confirm availability.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 bg-[#128C7E] text-white rounded-full py-3 px-4 text-sm font-bold flex items-center justify-center"
          aria-label="Order via WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
