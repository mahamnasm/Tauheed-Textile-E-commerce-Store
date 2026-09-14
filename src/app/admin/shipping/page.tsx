import React from "react";
import { prisma } from "@/lib/prisma";
import { Truck, MapPin } from "lucide-react";

export const revalidate = 0;

export default async function AdminShippingPage() {
  const zones = await prisma.shippingZone.findMany();

  return (
    <div className="space-y-6">
      <div className="border-b border-sand-300 pb-6">
        <span className="text-xs font-bold tracking-widest uppercase text-gold-700">Courier Logistics</span>
        <h1 className="font-serif text-3xl font-bold text-brand-950 mt-1">Shipping Zones & Courier Rates</h1>
        <p className="text-xs text-brand-600 mt-1">Manage delivery fee thresholds, city zones, and courier integrations</p>
      </div>

      <div className="space-y-4">
        {zones.map((z) => {
          let cities: string[] = [];
          try {
            cities = JSON.parse(z.citiesJson);
          } catch (e) {
            cities = [z.citiesJson];
          }

          return (
            <div key={z.id} className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-100 pb-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-brand-950">{z.name}</h3>
                  <p className="text-xs text-brand-500">Estimated transit: {z.estimatedDays}</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-3 py-1 bg-sand-100 rounded-lg text-brand-900 font-bold">
                    Standard: Rs. {z.standardRate}
                  </span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-lg font-bold">
                    Free above Rs. {z.freeShippingThreshold.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-brand-900 uppercase">Covered Cities:</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {cities.map((city) => (
                    <span key={city} className="px-2 py-0.5 bg-sand-50 border border-sand-200 rounded text-[11px] text-brand-700">
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
  );
}
