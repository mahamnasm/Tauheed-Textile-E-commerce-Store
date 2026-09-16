import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle, Truck, Package, Phone, ArrowRight, ShieldCheck, MapPin, ExternalLink, FileCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

interface OrderConfirmationProps {
  params: {
    orderNumber: string;
  };
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const { orderNumber } = params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: { product: true },
      },
      bankTransferProof: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="bg-white rounded-3xl border border-sand-200 shadow-xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-brand-950 text-sand-50 p-8 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-gold-500/20 border border-gold-400/40 flex items-center justify-center mx-auto text-gold-400">
            <CheckCircle className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
            Shukriya! Order Received
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs sm:text-sm text-sand-300 max-w-md mx-auto">
            Your order has been safely placed. We are preparing your exquisite pieces for dispatch.
          </p>
        </div>

        {/* Order Info & Delivery Timeline */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Tracking Progress Ribbon */}
          <div className="p-6 rounded-2xl bg-sand-100/70 border border-sand-200">
            <h3 className="font-serif font-bold text-sm text-brand-950 mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-gold-700" />
              Order Dispatch Progress
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="space-y-1.5">
                <div className="w-6 h-6 rounded-full bg-brand-900 text-white flex items-center justify-center mx-auto font-bold text-[10px]">
                  ?
                </div>
                <p className="font-bold text-brand-950">Received</p>
                <p className="text-[10px] text-brand-500">Order logged</p>
              </div>

              <div className="space-y-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto font-bold text-[10px] ${
                  order.orderStatus !== "PENDING" ? "bg-brand-900 text-white" : "bg-sand-300 text-brand-700"
                }`}>
                  2
                </div>
                <p className="font-bold text-brand-950">Confirmed</p>
                <p className="text-[10px] text-brand-500">Phone verified</p>
              </div>

              <div className="space-y-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto font-bold text-[10px] ${
                  ["PACKED", "SHIPPED", "DELIVERED"].includes(order.orderStatus) ? "bg-brand-900 text-white" : "bg-sand-300 text-brand-700"
                }`}>
                  3
                </div>
                <p className="font-bold text-brand-950">Packed</p>
                <p className="text-[10px] text-brand-500">Quality check</p>
              </div>

              <div className="space-y-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto font-bold text-[10px] ${
                  ["SHIPPED", "DELIVERED"].includes(order.orderStatus) ? "bg-brand-900 text-white" : "bg-sand-300 text-brand-700"
                }`}>
                  4
                </div>
                <p className="font-bold text-brand-950">Dispatched</p>
                <p className="text-[10px] text-brand-500">{order.courierName || "TCS / Trax"}</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Customer & Shipping Details */}
            <div className="p-5 rounded-2xl bg-white border border-sand-200 space-y-3">
              <h4 className="font-serif font-bold text-sm text-brand-950 border-b border-sand-100 pb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gold-700" />
                Shipping Details
              </h4>
              <div className="space-y-1 text-brand-700">
                <p><span className="font-semibold text-brand-950">Recipient:</span> {order.customerName}</p>
                <p><span className="font-semibold text-brand-950">Mobile:</span> {order.guestPhone}</p>
                {order.guestEmail && <p><span className="font-semibold text-brand-950">Email:</span> {order.guestEmail}</p>}
                <p><span className="font-semibold text-brand-950">Address:</span> {order.address}</p>
                {order.landmark && <p><span className="font-semibold text-brand-950">Landmark:</span> {order.landmark}</p>}
                <p><span className="font-semibold text-brand-950">City / Province:</span> {order.city}, {order.province}</p>
              </div>
            </div>

            {/* Payment & Status */}
            <div className="p-5 rounded-2xl bg-white border border-sand-200 space-y-3">
              <h4 className="font-serif font-bold text-sm text-brand-950 border-b border-sand-100 pb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold-700" />
                Payment & Billing
              </h4>
              <div className="space-y-1 text-brand-700">
                <p><span className="font-semibold text-brand-950">Payment Method:</span> {order.paymentMethod}</p>
                <p><span className="font-semibold text-brand-950">Payment Status:</span> {order.paymentStatus}</p>
                <p><span className="font-semibold text-brand-950">Subtotal:</span> Rs. {order.subtotal.toLocaleString()}</p>
                <p><span className="font-semibold text-brand-950">Delivery:</span> {order.shippingFee === 0 ? "FREE" : `Rs. ${order.shippingFee}`}</p>
                {order.discount > 0 && <p className="text-emerald-700 font-semibold"><span>Discount:</span> -Rs. {order.discount.toLocaleString()}</p>}
                <p className="font-serif font-bold text-base text-brand-950 pt-2 border-t border-sand-100">
                  Total Payable: <span className="text-gold-700">Rs. {order.total.toLocaleString()}</span>
                </p>
              </div>

              {order.bankTransferProof && (
                <div className="mt-3 p-3.5 bg-sand-50 rounded-xl border border-sand-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-950 text-xs flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      Payment Receipt Attached
                    </span>
                    {order.bankTransferProof.transactionRef && (
                      <span className="text-brand-600 font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-sand-200">
                        {order.bankTransferProof.transactionRef}
                      </span>
                    )}
                  </div>

                  {order.bankTransferProof.proofImage && (
                    <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-sand-200 bg-white">
                      <Image
                        src={order.bankTransferProof.proofImage}
                        alt="Payment Receipt"
                        fill
                        className="object-contain p-1"
                      />
                      <a
                        href={order.bankTransferProof.proofImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2 right-2 bg-brand-950/80 hover:bg-black text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-xs shadow-sm"
                      >
                        <span>View Full Image</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  )}

                  <p className="text-[10px] text-emerald-800 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Receipt received. Our accounts team will verify and confirm within 15-30 mins.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ordered Items List */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-brand-950">Items in this Order</h4>
            <div className="divide-y divide-sand-200 border border-sand-200 rounded-2xl overflow-hidden bg-white">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-brand-950">{item.product.title}</h5>
                    <p className="text-brand-500 text-[11px]">{item.variantDetails}</p>
                    <p className="text-brand-600 mt-1">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right font-serif font-bold text-sm text-brand-950">
                    Rs. {item.total.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp / Concierge Callout */}
          <div className="p-5 rounded-2xl bg-sand-100 border border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h5 className="font-serif font-bold text-sm text-brand-950">Need assistance or delivery change?</h5>
              <p className="text-xs text-brand-600">Our customer care team is available on WhatsApp daily 10 AM - 10 PM.</p>
            </div>
            <a
              href={`https://wa.me/923400262732?text=${encodeURIComponent(
                `Salam Tauheed Textile, I have a query regarding my order #${order.orderNumber}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0"
            >
              WhatsApp Us
            </a>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-900 text-sand-50 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-950 transition-all shadow-md"
            >
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
