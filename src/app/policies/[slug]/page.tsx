import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck, RotateCcw, Ruler, Scissors } from "lucide-react";

export default function PolicyPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const policies: Record<string, { title: string; subtitle: string; content: React.ReactNode }> = {
    shipping: {
      title: "Shipping & Nationwide Delivery Policy",
      subtitle: "Fast, reliable courier delivery across all 4 provinces and AJK",
      content: (
        <div className="space-y-6 text-xs text-brand-700 leading-relaxed">
          <p>
            At <strong>Tauheed Textile</strong>, we partner with premier courier networks including <strong>TCS Express, Trax Logistics, and Leopards Courier</strong> to ensure seamless nationwide fulfillment.
          </p>

          <h3 className="font-serif font-bold text-sm text-brand-950">1. Delivery Timeline</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Lahore Metropolitan:</strong> 24 to 48 hours (Same-Day / Next-Day dispatch available).</li>
            <li><strong>Major Cities (Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Sialkot, Peshawar):</strong> 2 to 3 Business Days via TCS Express.</li>
            <li><strong>Regional Towns & Rural Areas:</strong> 3 to 5 Business Days via Trax / Leopards.</li>
          </ul>

          <h3 className="font-serif font-bold text-sm text-brand-950">2. Shipping Charges & Free Delivery</h3>
          <p>
            We offer <strong>FREE Nationwide Delivery</strong> on all orders totaling <strong>Rs. 4,999 or more</strong>. For orders below this threshold, a standard flat courier charge of <strong>Rs. 250</strong> applies anywhere in Pakistan.
          </p>

          <h3 className="font-serif font-bold text-sm text-brand-950">3. Cash On Delivery (COD) Verification</h3>
          <p>
            First-time COD orders may receive a brief WhatsApp or telephone confirmation call from our verification team prior to warehouse packing to prevent courier returns.
          </p>
        </div>
      ),
    },
    returns: {
      title: "7-Day Hassle-Free Returns & Exchanges",
      subtitle: "Customer satisfaction and peace of mind guaranteed",
      content: (
        <div className="space-y-6 text-xs text-brand-700 leading-relaxed">
          <p>
            Tauheed Textile takes pride in the flawless quality of our fabrics and tailoring. If you receive an article that is damaged, misprinted, or incorrectly sized, you may request an exchange or store credit within <strong>7 days</strong> of delivery.
          </p>

          <h3 className="font-serif font-bold text-sm text-brand-950">Eligibility Guidelines</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Unstitched items must be uncut, unwashed, and in their original packaging with designer tags intact.</li>
            <li>Stitched pret articles must remain unworn, with all swing tags attached.</li>
            <li>Custom made-to-measure bridal or bespoke stitching can only be altered or exchanged for workmanship flaws.</li>
          </ul>

          <h3 className="font-serif font-bold text-sm text-brand-950">How to Initiate a Return</h3>
          <p>
            Simply visit our <Link href="/account" className="text-gold-700 font-bold underline">Customer Portal</Link> or send a photo of the parcel and your order number to our WhatsApp concierge at <strong>0340 0262732</strong>. Our team will schedule reverse pickup or direct replacement.
          </p>
        </div>
      ),
    },
    "size-guide": {
      title: "Women's Pret & Stitched Size Guide",
      subtitle: "Accurate Pakistani garment measurements in inches",
      content: (
        <div className="space-y-6 text-xs text-brand-700 leading-relaxed">
          <p>
            Our pret collections are tailored to comfortable Pakistani women's silhouettes. Please consult the standard measurement table below before placing your order:
          </p>

          <div className="overflow-x-auto border border-sand-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-sand-100 text-brand-900 uppercase">
                <tr>
                  <th className="p-3">Size Tag</th>
                  <th className="p-3">Chest</th>
                  <th className="p-3">Waist</th>
                  <th className="p-3">Hips</th>
                  <th className="p-3">Kurta Length</th>
                  <th className="p-3">Trouser Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                <tr><td className="p-3 font-bold">Extra Small (XS)</td><td className="p-3">36"</td><td className="p-3">32"</td><td className="p-3">38"</td><td className="p-3">40"</td><td className="p-3">37"</td></tr>
                <tr><td className="p-3 font-bold">Small (S)</td><td className="p-3">38"</td><td className="p-3">34"</td><td className="p-3">40"</td><td className="p-3">42"</td><td className="p-3">38"</td></tr>
                <tr><td className="p-3 font-bold">Medium (M)</td><td className="p-3">40"</td><td className="p-3">36"</td><td className="p-3">42"</td><td className="p-3">44"</td><td className="p-3">38"</td></tr>
                <tr><td className="p-3 font-bold">Large (L)</td><td className="p-3">44"</td><td className="p-3">40"</td><td className="p-3">46"</td><td className="p-3">45"</td><td className="p-3">39"</td></tr>
                <tr><td className="p-3 font-bold">Extra Large (XL)</td><td className="p-3">48"</td><td className="p-3">44"</td><td className="p-3">50"</td><td className="p-3">46"</td><td className="p-3">40"</td></tr>
              </tbody>
            </table>
          </div>

          <p className="italic text-sand-500">
            * All measurements are garment dimensions. For custom bridal sizing or bespoke sleeves, please contact us on WhatsApp.
          </p>
        </div>
      ),
    },
    "fabric-care": {
      title: "Luxury Fabric & Needlework Care Instructions",
      subtitle: "Preserving the beauty, colors, and zari sheen of your Tauheed creations",
      content: (
        <div className="space-y-6 text-xs text-brand-700 leading-relaxed">
          <h3 className="font-serif font-bold text-sm text-brand-950">1. Swiss Lawn & Voile Dupattas</h3>
          <p>
            Gentle hand-wash in cold water using a mild silk/wool detergent. Do not wring or spin-dry. Always dry in indirect shade to protect botanical and pastel dye brilliance.
          </p>

          <h3 className="font-serif font-bold text-sm text-brand-950">2. Pure Chiffon, Organza & Zari Work</h3>
          <p>
            <strong>Dry clean only.</strong> Never spray alcohol-based perfumes or deodorants directly onto zari, dabka, or silver tilla embellishments, as it can cause oxidation.
          </p>

          <h3 className="font-serif font-bold text-sm text-brand-950">3. Storage & Muslin Cloth Wrap</h3>
          <p>
            Store festive velvet and embroidered kalidars folded in breathable cotton or muslin bags. Avoid plastic wraps that trap moisture.
          </p>
        </div>
      ),
    },
    faq: {
      title: "Frequently Asked Questions (FAQ)",
      subtitle: "Everything you need to know about ordering, delivery, and fabric care",
      content: (
        <div className="space-y-6 text-xs text-brand-700 leading-relaxed">
          <h3 className="font-serif font-bold text-sm text-brand-950">1. How do I place an order?</h3>
          <p>
            You can place an order directly on our website by adding items to your bag and choosing Cash On Delivery at checkout, or tap the green <strong>"Order on WhatsApp"</strong> button on any product page to chat directly with our sales team.
          </p>

          <h3 className="font-serif font-bold text-sm text-brand-950">2. Is Cash On Delivery (COD) available in my city?</h3>
          <p>
            Yes! We offer COD across 250+ cities, towns, and tehsils in Pakistan via TCS, Trax, and Leopards courier.
          </p>

          <h3 className="font-serif font-bold text-sm text-brand-950">3. How long will delivery take?</h3>
          <p>
            Orders in Lahore are delivered in 1-2 days. Major cities (Karachi, Islamabad, Rawalpindi, Faisalabad) receive parcels in 2-3 business days. Other regions take 3-5 days.
          </p>

          <h3 className="font-serif font-bold text-sm text-brand-950">4. Can I exchange an item if the size does not fit?</h3>
          <p>
            Yes, we provide a 7-day hassle-free exchange window. Simply contact us via WhatsApp at <strong>0340 0262732</strong> with your order number.
          </p>

          <h3 className="font-serif font-bold text-sm text-brand-950">5. Are all fabrics 100% authentic?</h3>
          <p>
            Tauheed Textile guarantees 100% original, pure natural fibers, authentic Swiss lawns, and handcrafted zari embroidery.
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
      <div className="bg-white rounded-3xl border border-sand-200 shadow-xl p-8 sm:p-12 space-y-8">
        <div className="border-b border-sand-200 pb-6">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-700">Official Brand Guidelines</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950 mt-1">
            {currentPolicy.title}
          </h1>
          <p className="text-xs sm:text-sm text-brand-600 mt-1">
            {currentPolicy.subtitle}
          </p>
        </div>

        {currentPolicy.content}

        <div className="pt-8 border-t border-sand-200 flex items-center justify-between text-xs">
          <span className="text-brand-500">Tauheed Textile Client Protection & Care</span>
          <Link href="/shop" className="text-gold-700 hover:text-gold-800 font-bold uppercase tracking-wider">
            Shop Catalog ?
          </Link>
        </div>
      </div>
    </div>
  );
}
