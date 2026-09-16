import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck, RotateCcw, Clock, Scissors, CheckCircle2 } from "lucide-react";

export default function PolicyPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const policies: Record<string, { title: string; subtitle: string; content: React.ReactNode }> = {
    shipping: {
      title: "Shipping & Nationwide Delivery Policy",
      subtitle: "Fast, reliable courier fulfillment across Karachi and all nationwide cities",
      content: (
        <div className="space-y-6 text-xs text-[#6B6259] leading-relaxed">
          <p>
            At <strong>Tauheed Textile</strong>, every ensemble is packed with bespoke luxury care to ensure pristine doorstep delivery across Pakistan.
          </p>

          <h3 className="font-serif font-bold text-sm text-[#171717]">1. Free Shipping Threshold</h3>
          <p>
            We offer <strong>FREE Nationwide Delivery</strong> on all orders totaling <strong>Rs. 10,000 or more</strong>. No shipping charges apply to qualifying orders.
          </p>

          <h3 className="font-serif font-bold text-sm text-[#171717]">2. Weight-Based Shipping Rates (Orders under Rs. 10,000)</h3>
          <div className="overflow-x-auto border border-[#E7E1D8] rounded-xl bg-white">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8F5F0] text-[#171717] uppercase font-bold">
                <tr>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Parcel Weight</th>
                  <th className="p-3">Delivery Rate</th>
                  <th className="p-3">Estimated Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E1D8]">
                <tr>
                  <td className="p-3 font-semibold text-[#171717]">Karachi (Local)</td>
                  <td className="p-3">All Weights</td>
                  <td className="p-3 font-bold text-[#171717]">Flat Rs. 350</td>
                  <td className="p-3">Same-Day to 1-2 Working Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#171717]">Nationwide (Major Cities)</td>
                  <td className="p-3">Up to 1.0 kg</td>
                  <td className="p-3 font-bold text-[#171717]">Rs. 350</td>
                  <td className="p-3">4-5 Working Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#171717]">Nationwide (Major Cities)</td>
                  <td className="p-3">2.0 – 3.0 kg</td>
                  <td className="p-3 font-bold text-[#171717]">Rs. 450</td>
                  <td className="p-3">4-5 Working Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#171717]">Nationwide (Major Cities)</td>
                  <td className="p-3">4.0 – 5.0 kg</td>
                  <td className="p-3 font-bold text-[#171717]">Rs. 550</td>
                  <td className="p-3">4-5 Working Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#171717]">Regional & Rural Areas</td>
                  <td className="p-3">Above 5.0 kg</td>
                  <td className="p-3 font-bold text-[#171717]">Rs. 550 + Rs. 100/kg</td>
                  <td className="p-3">5-7 Working Days</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-serif font-bold text-sm text-[#171717]">3. Payment Surcharge & Advance Payment Perks</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Cash on Delivery (COD):</strong> A standard 4% courier collection handling fee is automatically calculated and added to COD orders at checkout.
            </li>
            <li>
              <strong>Advance Payment (Bank Transfer / JazzCash / EasyPaisa):</strong> The 4% COD fee is completely waived, AND an instant <strong>Flat 5% OFF</strong> is applied to your order subtotal!
            </li>
          </ul>

          <h3 className="font-serif font-bold text-sm text-[#171717]">4. Dispatch & Tracking</h3>
          <p>
            Once dispatched, you will receive an SMS and tracking consignment number. You can monitor your shipment milestones anytime on our <Link href="/track-order" className="text-[#7A6652] font-bold underline">Track Order</Link> page.
          </p>
        </div>
      ),
    },
    returns: {
      title: "7-Day Exchange Policy (No Returns)",
      subtitle: "Customer satisfaction and quality assurance commitment",
      content: (
        <div className="space-y-6 text-xs text-[#6B6259] leading-relaxed">
          <p>
            Tauheed Textile guarantees the finest craftsmanship and pure authentic fabrics. To maintain luxury hygiene and fair pricing, we operate under a strict <strong>7-Day Exchange Policy</strong>.
          </p>

          <div className="p-4 rounded-xl bg-[#FDF2F2] border border-[#F2BDBD] text-[#9B3D3D] font-medium">
            <strong>Important:</strong> We offer exchanges only. Cash returns and refunds are not accepted.
          </div>

          <h3 className="font-serif font-bold text-sm text-[#171717]">Exchange Eligibility Guidelines</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Articles must be unwashed, uncut, and in their original packaging with all designer seal tags intact.</li>
            <li>Exchange requests must be submitted within <strong>7 calendar days</strong> from the parcel delivery date.</li>
            <li>Items purchased on seasonal clearance or final sale are eligible for exchange only in the case of manufacturing or fabric defects.</li>
          </ul>

          <h3 className="font-serif font-bold text-sm text-[#171717]">How to Initiate an Exchange</h3>
          <p>
            Contact our customer care concierge via WhatsApp at <strong>0340 0262732</strong> (Mon–Sat 1:00 PM – 9:00 PM PKT). Please provide your order number (e.g. TT-2026-1001) along with photos of the article. Our support team will assist you with the exchange process.
          </p>
        </div>
      ),
    },
    "fabric-care": {
      title: "Luxury Fabric & Needlework Care Instructions",
      subtitle: "Preserving the beauty, colors, and zari sheen of your Tauheed creations",
      content: (
        <div className="space-y-6 text-xs text-[#6B6259] leading-relaxed">
          <h3 className="font-serif font-bold text-sm text-[#171717]">1. Swiss Lawn & Cotton Dupattas</h3>
          <p>
            Gentle hand-wash in cold water using a mild fabric liquid. Do not wring or spin-dry. Always dry in indirect shade to protect pastel dye brilliance.
          </p>

          <h3 className="font-serif font-bold text-sm text-[#171717]">2. Pure Chiffon, Organza, Net & Zari Work</h3>
          <p>
            <strong>Dry clean only.</strong> Never spray alcohol-based perfumes directly onto tilla, sequins, or hand-embellishments. Iron on reverse side with mild steam.
          </p>

          <h3 className="font-serif font-bold text-sm text-[#171717]">3. Storage Guidelines</h3>
          <p>
            Store festive velvet, raw silk, and embroidered ensembles folded in breathable cotton bags. Keep in a cool, dry place.
          </p>
        </div>
      ),
    },
    faq: {
      title: "Frequently Asked Questions (FAQ)",
      subtitle: "Everything you need to know about ordering, delivery, and custom stitching",
      content: (
        <div className="space-y-6 text-xs text-[#6B6259] leading-relaxed">
          <h3 className="font-serif font-bold text-sm text-[#171717]">1. How do I place an order?</h3>
          <p>
            You can order directly through our website checkout or tap <strong>"Order Instant via WhatsApp"</strong> on any article page to order directly with our sales team.
          </p>

          <h3 className="font-serif font-bold text-sm text-[#171717]">2. Can I get custom tailor stitching?</h3>
          <p>
            Yes! While all articles are sold as authentic unstitched collections, we provide custom made-to-measure tailor stitching upon request. Simply tap <strong>"Need Custom Stitching? Order via WhatsApp"</strong> on the dress page.
          </p>

          <h3 className="font-serif font-bold text-sm text-[#171717]">3. What are the delivery times?</h3>
          <p>
            Karachi deliveries arrive within Same-Day to 1-2 working days. Major cities nationwide take 4-5 working days. Regional and rural areas take 5-7 working days.
          </p>

          <h3 className="font-serif font-bold text-sm text-[#171717]">4. Is Cash on Delivery (COD) available?</h3>
          <p>
            Yes, COD is available across Pakistan. A 4% handling fee applies to COD parcels, or you can pay via Bank Transfer / JazzCash / EasyPaisa to waive this fee and receive Flat 5% OFF!
          </p>

          <h3 className="font-serif font-bold text-sm text-[#171717]">5. What is your exchange policy?</h3>
          <p>
            We offer a 7-day exchange window for unstitched garments in original condition. We do not accept cash returns or refunds.
          </p>

          <h3 className="font-serif font-bold text-sm text-[#171717]">6. What are your customer support hours?</h3>
          <p>
            Our support desk is open <strong>Monday to Saturday from 1:00 PM to 9:00 PM PKT</strong>.
          </p>
        </div>
      ),
    },
  };

  const currentPolicy = policies[slug];

  if (!currentPolicy) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Header */}
      <div className="border-b border-[#E7E1D8] pb-8 mb-8 text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-[#7A6652]">
          Tauheed Textile Policies
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717] mt-1">
          {currentPolicy.title}
        </h1>
        <p className="text-xs text-[#6B6259] mt-2">{currentPolicy.subtitle}</p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E7E1D8] shadow-sm mb-12">
        {currentPolicy.content}
      </div>

      {/* Related Policies Strip */}
      <div className="border-t border-[#E7E1D8] pt-8">
        <h4 className="font-serif font-bold text-sm text-[#171717] mb-4 text-center sm:text-left">
          Explore Other Policies
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {slug !== "shipping" && (
            <Link
              href="/policies/shipping"
              className="p-3.5 rounded-xl border border-[#E7E1D8] bg-white hover:border-[#7A6652] transition-colors text-xs font-bold text-[#171717] flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-[#7A6652]" /> Shipping Policy
            </Link>
          )}
          {slug !== "returns" && (
            <Link
              href="/policies/returns"
              className="p-3.5 rounded-xl border border-[#E7E1D8] bg-white hover:border-[#7A6652] transition-colors text-xs font-bold text-[#171717] flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-[#7A6652]" /> 7-Day Exchange
            </Link>
          )}
          {slug !== "fabric-care" && (
            <Link
              href="/policies/fabric-care"
              className="p-3.5 rounded-xl border border-[#E7E1D8] bg-white hover:border-[#7A6652] transition-colors text-xs font-bold text-[#171717] flex items-center gap-2"
            >
              <Scissors className="w-4 h-4 text-[#7A6652]" /> Fabric Care
            </Link>
          )}
          {slug !== "faq" && (
            <Link
              href="/policies/faq"
              className="p-3.5 rounded-xl border border-[#E7E1D8] bg-white hover:border-[#7A6652] transition-colors text-xs font-bold text-[#171717] flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#7A6652]" /> FAQ
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
