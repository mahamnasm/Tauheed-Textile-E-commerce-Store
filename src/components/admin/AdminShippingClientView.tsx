"use client";

import React, { useState } from "react";
import {
  Truck,
  Package,
  Search,
  ExternalLink,
  ShieldCheck,
  Scale,
  DollarSign,
  Clock,
  Phone,
  CheckCircle2,
  RefreshCw,
  Building2,
  Sliders,
  Send,
  Sparkles,
  MapPin,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

export interface ShippingZoneItem {
  id: string;
  name: string;
  citiesJson: string;
  standardRate: number;
  expressRate?: number | null;
  freeShippingThreshold: number;
  estimatedDays: string;
}

export interface DispatchOrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  city: string;
  status: string;
  total: number;
  trackingNumber?: string | null;
  courier?: string | null;
  notes?: string | null;
  createdAt: string | Date;
}

interface CourierProvider {
  id: string;
  name: string;
  brandColor: string;
  logoText: string;
  portalUrl: string;
  trackingUrlPattern: string;
  helpline: string;
  sla: string;
  apiStatus: "CONNECTED" | "ACTIVE" | "READY";
  tag: string;
  description: string;
}

const COURIER_PROVIDERS: CourierProvider[] = [
  {
    id: "trax",
    name: "Trax Logistics",
    brandColor: "#E11D48",
    logoText: "TRAX",
    portalUrl: "https://sonic.pk",
    trackingUrlPattern: "https://trax.pk/tracking?tracking_number=",
    helpline: "021-111-118-729",
    sla: "24-48 Hours",
    apiStatus: "CONNECTED",
    tag: "Primary COD Partner",
    description: "Automated API booking, swift doorstep COD collection, nationwide coverage.",
  },
  {
    id: "tcs",
    name: "TCS Express & Logistics",
    brandColor: "#DC2626",
    logoText: "TCS",
    portalUrl: "https://envio.tcsexpress.com",
    trackingUrlPattern: "https://www.tcsexpress.com/track/",
    helpline: "021-111-123-456",
    sla: "Overnight / 24 Hours",
    apiStatus: "ACTIVE",
    tag: "Premium Express",
    description: "Fastest transit to Tier 1 & Tier 2 cities with priority handling.",
  },
  {
    id: "postex",
    name: "PostEx Logistics",
    brandColor: "#2563EB",
    logoText: "PostEx",
    portalUrl: "https://merchant.postex.pk",
    trackingUrlPattern: "https://postex.pk/tracking?cn=",
    helpline: "042-325-00-111",
    sla: "1-2 Business Days",
    apiStatus: "ACTIVE",
    tag: "Instant COD Payout",
    description: "Upfront cash flow financing, automated SMS dispatch updates to customers.",
  },
  {
    id: "mnp",
    name: "M&P Express (Muller & Phipps)",
    brandColor: "#D97706",
    logoText: "M&P",
    portalUrl: "https://mulphilog.com/booking",
    trackingUrlPattern: "https://mulphilog.com/tracking?cn=",
    helpline: "021-111-202-020",
    sla: "2-3 Days",
    apiStatus: "READY",
    tag: "Deep Rural Reach",
    description: "Exceptional reach across remote tehsils and smaller towns in Punjab & KPK.",
  },
  {
    id: "leopard",
    name: "Leopards Courier",
    brandColor: "#EAB308",
    logoText: "LEOPARDS",
    portalUrl: "https://merchant.leopardscourier.com",
    trackingUrlPattern: "https://www.leopardscourier.com/tracking?cn=",
    helpline: "021-111-300-786",
    sla: "2-4 Days",
    apiStatus: "READY",
    tag: "Economy Bulk",
    description: "Reliable surface freight and economical multi-kg festive parcel transport.",
  },
  {
    id: "callcourier",
    name: "Call Courier Logistics",
    brandColor: "#10B981",
    logoText: "CALL COURIER",
    portalUrl: "https://cod.callcourier.com.pk",
    trackingUrlPattern: "https://callcourier.com.pk/tracking?cn=",
    helpline: "042-111-786-227",
    sla: "2-3 Days",
    apiStatus: "READY",
    tag: "COD Specialist",
    description: "Punjab & Sindh high-volume COD fulfillment with integrated web portal.",
  },
];

export default function AdminShippingClientView({
  initialZones = [],
  recentOrders = [],
}: {
  initialZones: ShippingZoneItem[];
  recentOrders: DispatchOrderItem[];
}) {
  // Tracking Search States
  const [searchCn, setSearchCn] = useState("");
  const [selectedCourier, setSelectedCourier] = useState<string>("auto");
  const [trackingResult, setTrackingResult] = useState<any | null>(null);

  // Live Weight Delivery Simulator States
  const [simOrderAmount, setSimOrderAmount] = useState<number>(6500);
  const [simWeight, setSimWeight] = useState<number>(2.0);
  const [simCity, setSimCity] = useState<string>("Lahore");

  // Calculate live simulator values
  const isSimFreeDelivery = simOrderAmount >= 10000;
  let simGrossDelivery = 0;
  let simSubsidyDiscount = 0;
  let simNetCustomerPayable = 0;

  if (isSimFreeDelivery) {
    simGrossDelivery = 0;
    simSubsidyDiscount = 0;
    simNetCustomerPayable = 0;
  } else {
    if (simCity.toLowerCase() === "karachi") {
      simGrossDelivery = 350;
    } else {
      if (simWeight <= 1.0) {
        simGrossDelivery = 350;
      } else if (simWeight <= 3.0) {
        simGrossDelivery = 450;
      } else if (simWeight <= 5.0) {
        simGrossDelivery = 550;
      } else {
        simGrossDelivery = 550 + Math.ceil(simWeight - 5.0) * 100;
      }
    }
    // Max Rs. 200 delivery subsidy discount
    simSubsidyDiscount = Math.min(200, simGrossDelivery);
    simNetCustomerPayable = Math.max(0, simGrossDelivery - simSubsidyDiscount);
  }

  // Handle Quick Tracking Search
  const handleTrackConsignment = (e?: React.FormEvent, directCn?: string, directCourier?: string) => {
    if (e) e.preventDefault();
    const queryCn = (directCn || searchCn).trim();
    if (!queryCn) {
      toast.error("Please enter a Consignment / Tracking Number (CN)");
      return;
    }

    let courier = directCourier || selectedCourier;
    if (courier === "auto") {
      if (queryCn.toUpperCase().startsWith("TRX") || queryCn.length === 12) {
        courier = "trax";
      } else if (queryCn.toUpperCase().startsWith("PX") || queryCn.length === 10) {
        courier = "postex";
      } else if (queryCn.toUpperCase().startsWith("LPC") || queryCn.length === 9) {
        courier = "leopard";
      } else {
        courier = "tcs";
      }
    }

    const provider = COURIER_PROVIDERS.find((p) => p.id === courier) || COURIER_PROVIDERS[0];
    const trackingFullUrl = `${provider.trackingUrlPattern}${encodeURIComponent(queryCn)}`;

    // Set local simulated live status preview
    setTrackingResult({
      cn: queryCn,
      courierName: provider.name,
      portalUrl: trackingFullUrl,
      timestamp: new Date().toLocaleTimeString(),
      status: "IN_TRANSIT",
      statusText: "Dispatched from Hub & In Transit to Destination",
      origin: "Tauheed Textile Central Warehouse (Karachi/Lahore)",
      destination: "Customer Destination Hub",
    });

    toast.success(`Tracking ${queryCn} via ${provider.name}`);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sand-300 pb-5 sm:pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gold-700 bg-gold-50 border border-gold-200 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-gold-600" />
              Pakistani Logistics Command
            </span>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-bold">
              6 COURIERS ACTIVE
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950">
            Multifunctional Shipping & Logistics Hub
          </h1>
          <p className="text-xs text-brand-600 mt-0.5">
            All-in-one logistics control: track consignments across all Pakistani couriers, monitor automated parcel weight rules, and manage merchant portals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="px-3.5 py-2.5 bg-white hover:bg-sand-50 border border-sand-300 text-brand-900 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold-700" />
            <span>Refresh Logistics</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Active Delivery Rule */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sand-500">Weight & Subsidy Rule</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-brand-950">Max Rs. 200 Subsidy</div>
            <p className="text-xs text-emerald-700 font-semibold mt-0.5">
              DCC Free: 100% Free on Orders &ge; Rs. 10,000
            </p>
          </div>
        </div>

        {/* Card 2: Auto Weight Detection */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sand-500">Auto Weight Sensor</span>
            <div className="p-2 bg-gold-50 text-gold-700 rounded-xl border border-gold-200">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-brand-950">Smart Suit Detection</div>
            <p className="text-xs text-brand-600 mt-0.5">
              0.5kg (Pret) • 0.8kg (2pc) • 1.0kg (3pc) • 1.8kg (Velvet)
            </p>
          </div>
        </div>

        {/* Card 3: Connected Couriers */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sand-500">Courier Network</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-brand-950">6 Major Providers</div>
            <p className="text-xs text-brand-600 mt-0.5">
              TCS, Trax, PostEx, M&P, Leopards & Call Courier
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: ALL-IN-ONE CONSIGNMENT TRACKING LOOKUP */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-100 pb-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-gold-700">Quick Search</span>
            <h2 className="font-serif text-xl font-bold text-brand-950 flex items-center gap-2">
              <Search className="w-5 h-5 text-gold-700" />
              <span>Universal Consignment Tracking Lookup</span>
            </h2>
            <p className="text-xs text-brand-600 mt-0.5">
              Enter any CN or tracking code from any Pakistani courier to track the customer parcel status instantly.
            </p>
          </div>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleTrackConsignment} className="flex flex-col md:flex-row items-stretch gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-brand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchCn}
              onChange={(e) => setSearchCn(e.target.value)}
              placeholder="Enter Consignment Number (e.g. 7748920194, TRX-992140, PX-884210)..."
              className="w-full pl-10 pr-4 py-3 bg-sand-50 border border-sand-300 rounded-xl text-xs font-mono text-brand-950 placeholder-brand-400 focus:outline-none focus:border-gold-600"
            />
          </div>

          <div className="w-full md:w-56 shrink-0">
            <select
              value={selectedCourier}
              onChange={(e) => setSelectedCourier(e.target.value)}
              className="w-full px-3.5 py-3 bg-sand-50 border border-sand-300 rounded-xl text-xs text-brand-950 focus:outline-none focus:border-gold-600"
            >
              <option value="auto">⚡ Auto-Detect Courier</option>
              {COURIER_PROVIDERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-brand-950 hover:bg-black text-sand-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Truck className="w-4 h-4 text-gold-400" />
            <span>Track Parcel</span>
          </button>
        </form>

        {/* Quick Demo CN Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-brand-600">Quick Test CNs:</span>
          {[
            { name: "TCS", cn: "7748920194", courier: "tcs" },
            { name: "TRAX", cn: "TRX-992140", courier: "trax" },
            { name: "POSTEX", cn: "PX-884210", courier: "postex" },
            { name: "LEOPARDS", cn: "LPC-554109", courier: "leopard" },
          ].map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSearchCn(sample.cn);
                setSelectedCourier(sample.courier);
                handleTrackConsignment(undefined, sample.cn, sample.courier);
              }}
              className="px-2.5 py-1 bg-sand-100 hover:bg-sand-200 text-brand-900 border border-sand-300 rounded-lg text-[10px] font-mono font-bold transition-colors cursor-pointer"
            >
              {sample.name}: {sample.cn}
            </button>
          ))}
        </div>

        {/* Live Tracking Result Banner */}
        {trackingResult && (
          <div className="p-5 rounded-2xl bg-sand-50 border border-sand-300 space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-md text-xs font-bold font-mono">
                  CN: {trackingResult.cn}
                </span>
                <span className="text-xs font-bold text-brand-900">
                  via {trackingResult.courierName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={trackingResult.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-950 text-sand-100 text-xs font-bold hover:bg-black transition-colors"
                >
                  <span>Open Courier Official Tracking</span>
                  <ExternalLink className="w-3 h-3 text-gold-400" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-white rounded-xl border border-sand-200">
                <span className="text-sand-500 font-medium block">Current Transit Status</span>
                <span className="text-emerald-700 font-bold mt-1 block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {trackingResult.statusText}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sand-200">
                <span className="text-sand-500 font-medium block">Origin Dispatch Hub</span>
                <span className="text-brand-950 font-semibold mt-1 block">
                  {trackingResult.origin}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sand-200">
                <span className="text-sand-500 font-medium block">Destination</span>
                <span className="text-brand-950 font-semibold mt-1 block">
                  {trackingResult.destination}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: 6 PAKISTANI COURIER PROVIDERS LAUNCHPAD */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-200 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-gold-700">Couriers Command</span>
            <h2 className="font-serif text-xl font-bold text-brand-950">
              Pakistani Logistics Service Providers
            </h2>
            <p className="text-xs text-brand-600 mt-0.5">
              Direct access to merchant portals, booking engines, tracking pages, and 24/7 courier account manager helplines.
            </p>
          </div>
          <span className="text-xs font-mono bg-sand-100 text-brand-800 px-3 py-1 rounded-lg border border-sand-300 font-bold">
            6 Connected Logistics Portals
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COURIER_PROVIDERS.map((courier) => (
            <div
              key={courier.id}
              className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm hover:border-gold-500/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-xs"
                      style={{ backgroundColor: courier.brandColor }}
                    >
                      {courier.logoText.slice(0, 3)}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sm text-brand-950">{courier.name}</h3>
                      <span className="text-[10px] text-brand-500 font-mono">{courier.tag}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-100 text-emerald-900 border border-emerald-300">
                    {courier.apiStatus}
                  </span>
                </div>

                <p className="text-xs text-brand-600 leading-relaxed mb-3">
                  {courier.description}
                </p>

                <div className="space-y-1.5 text-[11px] bg-sand-50 p-3 rounded-xl border border-sand-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sand-600">Transit SLA:</span>
                    <span className="font-bold text-brand-950">{courier.sla}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sand-600">Merchant Helpline:</span>
                    <a
                      href={`tel:${courier.helpline}`}
                      className="font-bold text-gold-700 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      {courier.helpline}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-sand-100 flex items-center gap-2">
                <a
                  href={courier.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 bg-brand-950 hover:bg-black text-sand-100 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <span>Portal Login</span>
                  <ExternalLink className="w-3 h-3 text-gold-400" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCourier(courier.id);
                    window.scrollTo({ top: 120, behavior: "smooth" });
                    toast(`Selected ${courier.name} for consignment tracking`);
                  }}
                  className="py-2 px-3 bg-sand-100 hover:bg-sand-200 text-brand-900 rounded-xl text-xs font-bold transition-colors"
                >
                  Track CN
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: AUTOMATIC WEIGHT DETECTION & DELIVERY RULES SIMULATOR */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 sm:p-7 space-y-6">
        <div className="border-b border-sand-100 pb-4">
          <span className="text-[10px] font-bold tracking-widest uppercase text-gold-700">Rules Engine</span>
          <h2 className="font-serif text-xl font-bold text-brand-950 flex items-center gap-2">
            <Scale className="w-5 h-5 text-gold-700" />
            <span>Weight-Based Delivery Rules & Subsidy Simulator</span>
          </h2>
          <p className="text-xs text-brand-600 mt-0.5">
            Real-time preview of the automated delivery pricing engine: products auto-detect parcel weight, maximum Rs. 200 delivery subsidy discount is applied, rest delivery is charged by weight, and orders over Rs. 10,000 qualify for 100% DCC Free Delivery.
          </p>
        </div>

        {/* Active Rules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sand-500 block">
              1. Auto Weight Sensor
            </span>
            <p className="text-xs font-bold text-brand-950 mt-1">
              Suit Type Auto-Detection
            </p>
            <p className="text-[11px] text-brand-600 mt-0.5">
              1-Piece/Pret: 0.5kg • 2pc: 0.8kg • 3pc: 1.0kg • Velvet: 1.8kg
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sand-500 block">
              2. Delivery Subsidy
            </span>
            <p className="text-xs font-bold text-emerald-700 mt-1">
              Max Rs. 200 Discount
            </p>
            <p className="text-[11px] text-brand-600 mt-0.5">
              Tauheed Textile subsidizes up to Rs. 200 on every shipment
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sand-500 block">
              3. Rest Delivery by Weight
            </span>
            <p className="text-xs font-bold text-brand-950 mt-1">
              Incremental Slabs
            </p>
            <p className="text-[11px] text-brand-600 mt-0.5">
              &le; 1kg: Rs. 350 | &le; 3kg: Rs. 450 | &le; 5kg: Rs. 550
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
              4. DCC Free Nationwide
            </span>
            <p className="text-xs font-bold text-emerald-950 mt-1">
              100% Free &ge; Rs. 10,000
            </p>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Any order with basket subtotal &ge; 10k pays Rs. 0 delivery
            </p>
          </div>
        </div>

        {/* Live Interactive Simulator Controls */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-sand-50 via-white to-sand-50 border border-sand-300 space-y-4">
          <div className="flex items-center justify-between border-b border-sand-200 pb-3">
            <span className="text-xs font-bold text-brand-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-gold-700" />
              <span>Interactive Customer Checkout Simulator</span>
            </span>
            <span className="text-[11px] text-gold-700 font-bold bg-gold-50 border border-gold-200 px-2 py-0.5 rounded">
              Live Real-Time
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Input 1: Order Subtotal */}
            <div>
              <label className="block text-xs font-semibold text-brand-800 mb-1">
                Order Value (PKR):
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={simOrderAmount}
                  onChange={(e) => setSimOrderAmount(Number(e.target.value) || 0)}
                  step={500}
                  min={0}
                  className="w-full px-3.5 py-2.5 bg-white border border-sand-300 rounded-xl text-xs font-mono font-bold text-brand-950 focus:outline-none focus:border-gold-600"
                />
              </div>
              <span className="text-[10px] text-brand-500 mt-1 block">
                {simOrderAmount >= 10000 ? "🎉 Qualifies for DCC FREE" : `Rs. ${(10000 - simOrderAmount).toLocaleString()} away from DCC Free`}
              </span>
            </div>

            {/* Input 2: Total Weight */}
            <div>
              <label className="block text-xs font-semibold text-brand-800 mb-1">
                Detected Parcel Weight (KG):
              </label>
              <input
                type="number"
                value={simWeight}
                onChange={(e) => setSimWeight(Math.max(0.1, Number(e.target.value) || 1.0))}
                step={0.5}
                min={0.1}
                className="w-full px-3.5 py-2.5 bg-white border border-sand-300 rounded-xl text-xs font-mono font-bold text-brand-950 focus:outline-none focus:border-gold-600"
              />
              <span className="text-[10px] text-brand-500 mt-1 block">
                {simWeight <= 1 ? "1 Suit (Light)" : simWeight <= 3 ? "2-3 Suits (Standard)" : "Bulk / Heavy Festive"}
              </span>
            </div>

            {/* Input 3: Destination City */}
            <div>
              <label className="block text-xs font-semibold text-brand-800 mb-1">
                Destination City:
              </label>
              <select
                value={simCity}
                onChange={(e) => setSimCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-sand-300 rounded-xl text-xs font-bold text-brand-950 focus:outline-none focus:border-gold-600"
              >
                <option value="Lahore">Lahore (Nationwide Weight)</option>
                <option value="Karachi">Karachi (City Hub Flat)</option>
                <option value="Islamabad">Islamabad (Nationwide Weight)</option>
                <option value="Faisalabad">Faisalabad (Nationwide Weight)</option>
                <option value="Rawalpindi">Rawalpindi (Nationwide Weight)</option>
                <option value="Peshawar">Peshawar (Nationwide Weight)</option>
                <option value="Quetta">Quetta (Nationwide Weight)</option>
              </select>
              <span className="text-[10px] text-brand-500 mt-1 block">
                Transit: 2-4 working days
              </span>
            </div>
          </div>

          {/* Result Calculation Output Bar */}
          <div className="mt-4 pt-4 border-t border-sand-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-sand-200">
              <span className="text-sand-500 block text-[10px] uppercase font-bold">Gross Delivery</span>
              <span className="text-brand-950 font-bold font-mono text-sm mt-0.5 block">
                Rs. {simGrossDelivery}
              </span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-emerald-700 block text-[10px] uppercase font-bold">Delivery Subsidy</span>
              <span className="text-emerald-800 font-bold font-mono text-sm mt-0.5 block">
                -Rs. {simSubsidyDiscount}
              </span>
            </div>

            <div className="p-3 bg-sand-100 rounded-xl border border-sand-300">
              <span className="text-brand-700 block text-[10px] uppercase font-bold">Net Customer Pays</span>
              <span className="text-brand-950 font-black font-mono text-base mt-0.5 block">
                {simNetCustomerPayable === 0 ? "Rs. 0 (FREE)" : `Rs. ${simNetCustomerPayable}`}
              </span>
            </div>

            <div className={`p-3 rounded-xl border ${isSimFreeDelivery ? "bg-emerald-100 border-emerald-300 text-emerald-950" : "bg-sand-50 border-sand-200 text-brand-700"}`}>
              <span className="block text-[10px] uppercase font-bold">DCC Free Trigger</span>
              <span className="font-bold text-xs mt-1 block">
                {isSimFreeDelivery ? "🎉 ACTIVE (Free Above 10k)" : "Inactive (< 10k)"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: RECENT DISPATCHES & CONSIGNMENT TRACKING LOG */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-100 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-gold-700">Dispatch Log</span>
            <h2 className="font-serif text-xl font-bold text-brand-950 flex items-center gap-2">
              <Package className="w-5 h-5 text-gold-700" />
              <span>Recent Dispatched Orders & Consignment Status</span>
            </h2>
          </div>
          <span className="text-xs text-brand-500 font-mono bg-sand-100 px-2 py-1 rounded-lg">
            {recentOrders.length} Recent Orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-900 border-collapse">
            <thead>
              <tr className="border-b border-sand-200 text-brand-600 bg-sand-50/50">
                <th className="py-3 px-3 font-semibold">Order</th>
                <th className="py-3 px-3 font-semibold">Customer</th>
                <th className="py-3 px-3 font-semibold">City</th>
                <th className="py-3 px-3 font-semibold">Amount</th>
                <th className="py-3 px-3 font-semibold">Courier</th>
                <th className="py-3 px-3 font-semibold">Tracking (CN)</th>
                <th className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100 font-sans">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sand-400 text-xs">
                    No orders have been dispatched yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const courierId = (order.courier || "tcs").toLowerCase();
                  const provider = COURIER_PROVIDERS.find((p) => p.id === courierId) || COURIER_PROVIDERS[0];
                  const trackingUrl = order.trackingNumber ? `${provider.trackingUrlPattern}${order.trackingNumber}` : null;

                  return (
                    <tr key={order.id} className="hover:bg-sand-50/70 transition-colors">
                      <td className="py-3 px-3 font-bold font-mono text-brand-950">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-3 font-semibold">{order.customerName}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-sand-100 rounded text-[11px] font-medium">
                          {order.city}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold">
                        Rs. {order.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-sand-100 rounded text-[10px] font-bold font-mono">
                          {order.courier || "TCS Logistics"}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {order.trackingNumber ? (
                          <span className="text-emerald-700 font-bold">{order.trackingNumber}</span>
                        ) : (
                          <span className="text-sand-400 italic">Pending CN</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {order.trackingNumber ? (
                          <a
                            href={trackingUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-sand-100 hover:bg-sand-200 text-brand-900 rounded-lg text-[11px] font-bold transition-colors"
                          >
                            <span>Track</span>
                            <ExternalLink className="w-3 h-3 text-gold-700" />
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSearchCn(order.orderNumber);
                              toast(`Assigning consignment for ${order.orderNumber}`);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-sand-100 hover:bg-sand-200 text-brand-700 rounded-lg text-[11px] font-medium transition-colors"
                          >
                            Assign CN
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: REGIONAL SHIPPING ZONES */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 sm:p-7 space-y-4">
        <div className="border-b border-sand-100 pb-3">
          <span className="text-[10px] font-bold tracking-widest uppercase text-gold-700">Zone Coverage</span>
          <h2 className="font-serif text-xl font-bold text-brand-950 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gold-700" />
            <span>Configured Shipping Zones & City SLAs</span>
          </h2>
        </div>

        <div className="space-y-4">
          {initialZones.map((z) => {
            let cities: string[] = [];
            try {
              cities = JSON.parse(z.citiesJson);
            } catch (e) {
              cities = [z.citiesJson];
            }

            return (
              <div key={z.id} className="p-5 rounded-2xl bg-sand-50/70 border border-sand-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-200 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-brand-950">{z.name}</h3>
                    <p className="text-xs text-brand-500">Estimated transit: {z.estimatedDays}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-3 py-1 bg-white border border-sand-300 rounded-lg text-brand-900 font-bold">
                      Base: Rs. {z.standardRate}
                    </span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg font-bold">
                      Free above Rs. {z.freeShippingThreshold.toLocaleString()} (DCC Free)
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-brand-900 uppercase">Covered Cities:</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {cities.map((city) => (
                      <span key={city} className="px-2 py-0.5 bg-white border border-sand-200 rounded text-[11px] text-brand-700">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
