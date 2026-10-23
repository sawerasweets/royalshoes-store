"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Settings, Save, Check, Phone, MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/constants";

interface SettingsFormData {
  storeName: string;
  storeTagline: string;
  businessPhone: string;
  whatsappNumber: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  announcementText: string;
  showAnnouncement: boolean;
  easypaisaInstructions: string;
  bankInstructions: string;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<SettingsFormData>({
    storeName: "ROYAL SHOES",
    storeTagline: "STEP INTO ELEGANCE",
    businessPhone: BRAND.contact.phoneDisplay,
    whatsappNumber: BRAND.contact.whatsappIntl,
    freeShippingThreshold: 5000,
    standardShippingFee: 250,
    announcementText: "ROYAL SHOES — COMPLIMENTARY NATIONWIDE EXPRESS DELIVERY ON ORDERS OVER RS. 5,000",
    showAnnouncement: true,
    easypaisaInstructions: "Transfer to ROYAL SHOES Official Easypaisa Account: 03481702710 (Title: ROYAL SHOES). Enter the 11-digit TRX ID below after sending.",
    bankInstructions: "Bank: Meezan Bank Ltd | Account Title: ROYAL SHOES ATELIER | Account/IBAN: PK55MEZN0001234567890123 | Reference: Your Order Number.",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          setFormData({
            storeName: data.settings.storeName,
            storeTagline: data.settings.storeTagline,
            businessPhone: data.settings.businessPhone,
            whatsappNumber: data.settings.whatsappNumber,
            freeShippingThreshold: data.settings.freeShippingThreshold,
            standardShippingFee: data.settings.standardShippingFee,
            announcementText: data.settings.announcementText || "",
            showAnnouncement: data.settings.showAnnouncement,
            easypaisaInstructions: data.settings.easypaisaInstructions || "",
            bankInstructions: data.settings.bankInstructions || "",
          });
        }
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          freeShippingThreshold: Number(formData.freeShippingThreshold),
          standardShippingFee: Number(formData.standardShippingFee),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSavedMessage(true);
        setTimeout(() => setSavedMessage(false), 3000);
      }
    } catch {
      // fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        <div className="border-b border-[#2A2A2A] pb-4">
          <span className="text-[10px] font-bold tracking-brand uppercase text-[#D4AF37]">
            STORE BRANDING & COMMERCE
          </span>
          <h1 className="font-brand text-2xl font-extrabold tracking-luxury text-[#F5F0E6]">
            STORE & CONTACT SETTINGS
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Configure ROYAL SHOES Black & Gold edition parameters, official phone numbers, and delivery thresholds.
          </p>
        </div>

        {savedMessage && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 text-xs text-emerald-400 flex items-center gap-2 animate-fade-in">
            <Check size={16} />
            <span>Store settings successfully updated in live database!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 text-xs">
          {/* Brand Identity */}
          <div className="p-6 bg-[#111111] border border-[#2A2A2A] space-y-4">
            <h2 className="font-brand text-sm font-bold uppercase tracking-luxury text-[#D4AF37] border-b border-[#2A2A2A] pb-2">
              1. Brand Identity & Presence
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] p-2.5 text-[#F5F0E6] outline-none font-bold tracking-brand"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Official Tagline *</label>
                <input
                  type="text"
                  required
                  value={formData.storeTagline}
                  onChange={(e) => setFormData({ ...formData, storeTagline: e.target.value })}
                  className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] p-2.5 text-[#F5F0E6] outline-none tracking-luxury"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Top Announcement Marquee</label>
              <input
                type="text"
                value={formData.announcementText}
                onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] p-2.5 text-[#F5F0E6] outline-none tracking-wider text-[11px]"
              />
            </div>
          </div>

          {/* Official Contact Channels (Phase 17) */}
          <div className="p-6 bg-[#111111] border border-[#2A2A2A] space-y-4">
            <h2 className="font-brand text-sm font-bold uppercase tracking-luxury text-[#D4AF37] border-b border-[#2A2A2A] pb-2">
              2. Official Business Contact Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Official Business Phone (Voice / Support) *
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                  <input
                    type="text"
                    required
                    value={formData.businessPhone}
                    onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                    className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] pl-8 pr-3 py-2.5 text-[#F5F0E6] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  WhatsApp Concierge Number (International Format) *
                </label>
                <div className="relative">
                  <MessageCircle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                  <input
                    type="text"
                    required
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] pl-8 pr-3 py-2.5 text-[#F5F0E6] outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Shipping Pricing (Phase 15) */}
          <div className="p-6 bg-[#111111] border border-[#2A2A2A] space-y-4">
            <h2 className="font-brand text-sm font-bold uppercase tracking-luxury text-[#D4AF37] border-b border-[#2A2A2A] pb-2">
              3. Nationwide Shipping Thresholds
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Complimentary Free Shipping Threshold (PKR) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.freeShippingThreshold}
                  onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                  className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] p-2.5 text-[#F5F0E6] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Standard Flat Shipping Fee (PKR) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.standardShippingFee}
                  onChange={(e) => setFormData({ ...formData, standardShippingFee: Number(e.target.value) })}
                  className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] p-2.5 text-[#F5F0E6] outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Payment Instructions (Phase 16) */}
          <div className="p-6 bg-[#111111] border border-[#2A2A2A] space-y-4">
            <h2 className="font-brand text-sm font-bold uppercase tracking-luxury text-[#D4AF37] border-b border-[#2A2A2A] pb-2">
              4. Payment Instructions
            </h2>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Easypaisa Checkout Instructions
              </label>
              <textarea
                rows={2}
                value={formData.easypaisaInstructions}
                onChange={(e) => setFormData({ ...formData, easypaisaInstructions: e.target.value })}
                className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] p-2.5 text-[#F5F0E6] outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Bank Transfer Checkout Instructions
              </label>
              <textarea
                rows={2}
                value={formData.bankInstructions}
                onChange={(e) => setFormData({ ...formData, bankInstructions: e.target.value })}
                className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] p-2.5 text-[#F5F0E6] outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#AA8822] text-[#080808] font-bold text-xs uppercase tracking-luxury px-8 py-3.5 transition-all shadow-md hover:scale-[1.02]"
            >
              <Save size={15} />
              <span>{isSubmitting ? "Saving..." : "Save Store Configuration"}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
