"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { formatPKR } from "@/lib/utils";
import {
  Tag,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Copy,
  Trash2,
  TrendingUp,
  Percent,
  Truck,
  DollarSign,
  Calendar,
  AlertCircle,
  Users,
  Clock,
  Sparkles,
  Check,
} from "lucide-react";

interface PromoCode {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  discountPercent?: number | null;
  discountAmount?: number | null;
  minOrderAmount: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  timesUsed: number;
  perCustomerLimit?: number | null;
  description?: string | null;
  isActive: boolean;
  endDate?: string | null;
  createdAt: string;
}

interface PromoUsage {
  id: string;
  couponId: string;
  orderId: string;
  orderNumber?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  discountAmount: number;
  createdAt: string;
}

export default function AdminPromosPage() {
  const [coupons, setCoupons] = useState<PromoCode[]>([]);
  const [usages, setUsages] = useState<PromoUsage[]>([]);
  const [stats, setStats] = useState({
    totalCodes: 0,
    activeCodes: 0,
    totalTimesUsed: 0,
    totalDiscountGiven: 0,
  });

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Create Modal State
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form Fields
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED" | "FREE_SHIPPING">("PERCENTAGE");
  const [discountPercent, setDiscountPercent] = useState<string>("10");
  const [discountAmount, setDiscountAmount] = useState<string>("200");
  const [minOrderAmount, setMinOrderAmount] = useState<string>("2000");
  const [maxDiscount, setMaxDiscount] = useState<string>("");
  const [usageLimit, setUsageLimit] = useState<string>("");
  const [perCustomerLimit, setPerCustomerLimit] = useState<string>("1");
  const [description, setDescription] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/promos");
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons || []);
        setUsages(data.usages || []);
        setStats(data.stats || { totalCodes: 0, activeCodes: 0, totalTimesUsed: 0, totalDiscountGiven: 0 });
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleActive = async (promo: PromoCode) => {
    try {
      const res = await fetch("/api/admin/promos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: promo.id,
          isActive: !promo.isActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchPromos();
      }
    } catch {
      // fallback
    }
  };

  const handleDelete = async (id: string, promoCode: string) => {
    if (!confirm(`Are you sure you want to permanently delete VIP Promo Code "${promoCode}"?`)) return;
    try {
      const res = await fetch(`/api/admin/promos?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchPromos();
      }
    } catch {
      // fallback
    }
  };

  const applyTemplate = (preset: "WELCOME10" | "ROYAL200" | "GOLD10" | "FREESHIP") => {
    if (preset === "WELCOME10") {
      setCode("WELCOME10");
      setDiscountType("PERCENTAGE");
      setDiscountPercent("10");
      setMinOrderAmount("2000");
      setMaxDiscount("1000");
      setPerCustomerLimit("1");
      setDescription("Welcome privilege for first-time royal patrons");
    } else if (preset === "ROYAL200") {
      setCode("ROYAL200");
      setDiscountType("FIXED");
      setDiscountAmount("200");
      setMinOrderAmount("3000");
      setMaxDiscount("");
      setPerCustomerLimit("1");
      setDescription("PKR 200 Atelier luxury credit on eligible orders");
    } else if (preset === "GOLD10") {
      setCode("GOLD10");
      setDiscountType("PERCENTAGE");
      setDiscountPercent("10");
      setMinOrderAmount("3000");
      setMaxDiscount("1500");
      setPerCustomerLimit("2");
      setDescription("10% Gold VIP Privilege discount for valued customers");
    } else if (preset === "FREESHIP") {
      setCode("FREESHIP");
      setDiscountType("FREE_SHIPPING");
      setMinOrderAmount("1500");
      setMaxDiscount("");
      setPerCustomerLimit("1");
      setDescription("Complimentary nationwide white-glove shipping waiver");
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const payload: any = {
        code,
        discountType,
        minOrderAmount: Number(minOrderAmount) || 0,
        perCustomerLimit: Number(perCustomerLimit) || 1,
        description: description.trim(),
        isActive,
      };

      if (discountType === "PERCENTAGE") {
        payload.discountPercent = Number(discountPercent);
        if (maxDiscount.trim()) payload.maxDiscount = Number(maxDiscount);
      } else if (discountType === "FIXED") {
        payload.discountAmount = Number(discountAmount);
      }

      if (usageLimit.trim()) {
        payload.usageLimit = Number(usageLimit);
      }

      if (expiresAt.trim()) {
        payload.expiresAt = new Date(expiresAt).toISOString();
      }

      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        // Reset form
        setCode("");
        setDescription("");
        setExpiresAt("");
        fetchPromos();
      } else {
        setFormError(data.error || "Failed to create promo code.");
      }
    } catch {
      setFormError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered coupons
  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterStatus === "ACTIVE") return c.isActive;
    if (filterStatus === "INACTIVE") return !c.isActive;
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4DDD3] pb-5">
          <div>
            <span className="text-[10px] font-bold tracking-brand uppercase text-[#795548]">
              PRIVILEGE SUITE & DISCOUNTS
            </span>
            <h1 className="font-brand text-2xl sm:text-3xl font-extrabold tracking-luxury text-[#4A342E] mt-0.5">
              VIP PROMO CODES & OFFERS
            </h1>
            <p className="text-xs text-[#6B635B] mt-1">
              Configure royal discount vouchers, campaign codes, and single-use customer privileges.
            </p>
          </div>

          <button
            onClick={() => {
              setFormError(null);
              setShowModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 bg-[#795548] hover:bg-[#5D4037] text-white font-bold text-xs uppercase tracking-luxury px-5 py-3 transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
          >
            <Plus size={16} />
            <span>Create VIP Code</span>
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#FFFFFF] border border-[#E4DDD3] space-y-1">
            <div className="flex items-center justify-between text-[#6B635B]">
              <span className="text-[11px] uppercase tracking-wider">Total Codes</span>
              <Tag size={15} className="text-[#795548]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#292D30]">{stats.totalCodes}</div>
            <div className="text-[10px] text-gray-500">Configured in Atelier</div>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#E4DDD3] space-y-1">
            <div className="flex items-center justify-between text-[#6B635B]">
              <span className="text-[11px] uppercase tracking-wider">Active Codes</span>
              <CheckCircle2 size={15} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">{stats.activeCodes}</div>
            <div className="text-[10px] text-gray-500">Currently redeemable</div>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#E4DDD3] space-y-1">
            <div className="flex items-center justify-between text-[#6B635B]">
              <span className="text-[11px] uppercase tracking-wider">Times Redeemed</span>
              <TrendingUp size={15} className="text-blue-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#292D30]">{stats.totalTimesUsed}</div>
            <div className="text-[10px] text-gray-500">Customer checkout redemptions</div>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#E4DDD3] space-y-1">
            <div className="flex items-center justify-between text-[#6B635B]">
              <span className="text-[11px] uppercase tracking-wider">Total Savings</span>
              <DollarSign size={15} className="text-[#795548]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#795548]">
              {formatPKR(stats.totalDiscountGiven)}
            </div>
            <div className="text-[10px] text-gray-500">Granted to patrons</div>
          </div>
        </div>

        {/* Toolbar & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFFFFF] p-3 border border-[#E4DDD3]">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B635B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code (e.g. GOLD10, WELCOME) or description..."
              className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] pl-9 pr-4 py-2 outline-none"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-3 py-2 border transition-all text-[11px] font-bold uppercase tracking-wider ${
                filterStatus === "ALL"
                  ? "bg-[#795548] text-white border-[#795548]"
                  : "bg-[#F5F0E6] text-[#6B635B] border-[#E4DDD3] hover:text-[#292D30]"
              }`}
            >
              All ({coupons.length})
            </button>
            <button
              onClick={() => setFilterStatus("ACTIVE")}
              className={`px-3 py-2 border transition-all text-[11px] font-bold uppercase tracking-wider ${
                filterStatus === "ACTIVE"
                  ? "bg-emerald-500 text-black border-emerald-500"
                  : "bg-[#F5F0E6] text-[#6B635B] border-[#E4DDD3] hover:text-[#292D30]"
              }`}
            >
              Active ({stats.activeCodes})
            </button>
            <button
              onClick={() => setFilterStatus("INACTIVE")}
              className={`px-3 py-2 border transition-all text-[11px] font-bold uppercase tracking-wider ${
                filterStatus === "INACTIVE"
                  ? "bg-gray-700 text-white border-gray-700"
                  : "bg-[#F5F0E6] text-[#6B635B] border-[#E4DDD3] hover:text-[#292D30]"
              }`}
            >
              Inactive ({coupons.length - stats.activeCodes})
            </button>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-[#FFFFFF] border border-[#E4DDD3] overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-xs text-[#6B635B] space-y-2">
              <div className="inline-block w-6 h-6 border-2 border-[#795548] border-t-transparent rounded-full animate-spin" />
              <div>Loading VIP Promo Directory...</div>
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#6B635B] space-y-3">
              <Tag size={28} className="mx-auto text-gray-600" />
              <div className="font-brand text-sm text-[#4A342E]">No promo codes found</div>
              <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                No active or inactive promotional codes match your filter criteria. Create a new VIP code to start granting privileges.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E4DDD3] bg-[#FAF7F2] text-[#6B635B] uppercase tracking-luxury text-[10px]">
                      <th className="p-4 font-bold">Code</th>
                      <th className="p-4 font-bold">Type & Benefit</th>
                      <th className="p-4 font-bold">Rules & Thresholds</th>
                      <th className="p-4 font-bold">Usage Progress</th>
                      <th className="p-4 font-bold">Expiry</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4DDD3]">
                    {filteredCoupons.map((c) => (
                      <tr key={c.id} className="hover:bg-[#161616] transition-colors">
                        {/* Code */}
                        <td className="p-4 font-mono font-bold text-sm text-[#795548]">
                          <div className="flex items-center gap-2">
                            <span>{c.code}</span>
                            <button
                              onClick={() => handleCopy(c.code)}
                              className="text-gray-500 hover:text-[#795548] transition-colors p-1"
                              title="Copy code"
                            >
                              {copiedCode === c.code ? (
                                <Check size={13} className="text-emerald-400" />
                              ) : (
                                <Copy size={13} />
                              )}
                            </button>
                          </div>
                          {c.description && (
                            <div className="text-[10px] font-sans font-normal text-[#6B635B] mt-0.5 max-w-xs truncate">
                              {c.description}
                            </div>
                          )}
                        </td>

                        {/* Benefit */}
                        <td className="p-4">
                          {c.discountType === "PERCENTAGE" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#795548]/10 border border-[#795548]/40 text-[#795548] font-bold text-[11px]">
                              <Percent size={12} />
                              <span>{c.discountPercent}% OFF</span>
                            </span>
                          )}
                          {c.discountType === "FIXED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 border border-blue-500/40 text-blue-400 font-bold text-[11px]">
                              <span>PKR {c.discountAmount} OFF</span>
                            </span>
                          )}
                          {c.discountType === "FREE_SHIPPING" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-bold text-[11px]">
                              <Truck size={12} />
                              <span>COMPLIMENTARY SHIPPING</span>
                            </span>
                          )}
                        </td>

                        {/* Rules */}
                        <td className="p-4 space-y-0.5 text-[11px] text-[#5C5855]">
                          <div>
                            Min Spend:{" "}
                            <strong className="text-[#292D30]">
                              {c.minOrderAmount > 0 ? formatPKR(c.minOrderAmount) : "None"}
                            </strong>
                          </div>
                          {c.maxDiscount && (
                            <div className="text-[#6B635B]">
                              Max Cap: <strong className="text-[#292D30]">{formatPKR(c.maxDiscount)}</strong>
                            </div>
                          )}
                          <div className="text-gray-500 text-[10px]">
                            Limit: {c.perCustomerLimit || 1} per customer
                          </div>
                        </td>

                        {/* Usage */}
                        <td className="p-4 font-mono">
                          <div className="text-xs font-bold text-[#4A342E]">
                            {c.timesUsed}{" "}
                            <span className="text-gray-500 text-[11px] font-normal">
                              / {c.usageLimit != null ? c.usageLimit : "∞"}
                            </span>
                          </div>
                          {c.usageLimit && (
                            <div className="w-24 bg-[#F5F0E6] h-1.5 mt-1 border border-[#E4DDD3]">
                              <div
                                className="bg-[#795548] h-full"
                                style={{
                                  width: `${Math.min(100, (c.timesUsed / c.usageLimit) * 100)}%`,
                                }}
                              />
                            </div>
                          )}
                        </td>

                        {/* Expiry */}
                        <td className="p-4 text-[11px] text-[#6B635B]">
                          {c.endDate ? (
                            <div className="flex items-center gap-1">
                              <Calendar size={13} className="text-gray-500" />
                              <span>{new Date(c.endDate).toLocaleDateString()}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">No Expiration</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleActive(c)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                              c.isActive
                                ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/50 hover:bg-emerald-900/40"
                                : "bg-gray-900 text-gray-500 border-gray-700 hover:text-[#5C5855]"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                c.isActive ? "bg-emerald-400 animate-pulse" : "bg-gray-600"
                              }`}
                            />
                            <span>{c.isActive ? "Active" : "Inactive"}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(c.id, c.code)}
                            className="p-1.5 text-gray-500 hover:text-rose-400 transition-colors rounded hover:bg-rose-950/30"
                            title="Delete promo code"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="lg:hidden divide-y divide-[#E4DDD3]">
                {filteredCoupons.map((c) => (
                  <div key={c.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-base text-[#795548]">{c.code}</span>
                          <button
                            onClick={() => handleCopy(c.code)}
                            className="text-gray-500 hover:text-[#4A342E] p-1"
                          >
                            {copiedCode === c.code ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          </button>
                        </div>
                        {c.description && <p className="text-[11px] text-[#6B635B] mt-0.5">{c.description}</p>}
                      </div>

                      <button
                        onClick={() => handleToggleActive(c)}
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                          c.isActive
                            ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/50"
                            : "bg-gray-900 text-gray-500 border-gray-700"
                        }`}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      {c.discountType === "PERCENTAGE" && (
                        <span className="px-2 py-0.5 bg-[#795548]/10 border border-[#795548]/40 text-[#795548] font-bold text-[11px]">
                          {c.discountPercent}% OFF
                        </span>
                      )}
                      {c.discountType === "FIXED" && (
                        <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/40 text-blue-400 font-bold text-[11px]">
                          PKR {c.discountAmount} OFF
                        </span>
                      )}
                      {c.discountType === "FREE_SHIPPING" && (
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-bold text-[11px]">
                          FREE SHIPPING
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-[#5C5855] space-y-1 bg-[#F5F0E6] p-2.5 border border-[#E4DDD3]">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Min Spend:</span>
                        <span>{c.minOrderAmount > 0 ? formatPKR(c.minOrderAmount) : "None"}</span>
                      </div>
                      {c.maxDiscount && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Max Discount:</span>
                          <span>{formatPKR(c.maxDiscount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Redeemed:</span>
                        <span className="font-mono">{c.timesUsed} / {c.usageLimit || "∞"}</span>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleDelete(c.id, c.code)}
                        className="text-xs text-rose-400 hover:underline inline-flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        <span>Delete Code</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Recent Usage History Section */}
        <div className="space-y-4">
          <div className="border-b border-[#E4DDD3] pb-3">
            <h3 className="font-brand text-base font-bold tracking-luxury uppercase text-[#4A342E]">
              RECENT PROMO REDEMPTION LEDGER ({usages.length})
            </h3>
            <p className="text-xs text-[#6B635B]">
              Audit log of customer orders where promotional privilege codes were successfully verified.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E4DDD3] overflow-hidden">
            {usages.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-500">
                No orders have redeemed promotional codes yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E4DDD3] bg-[#FAF7F2] text-[#6B635B] uppercase tracking-luxury text-[10px]">
                      <th className="p-3.5 font-bold">Order #</th>
                      <th className="p-3.5 font-bold">Customer</th>
                      <th className="p-3.5 font-bold">Phone / Contact</th>
                      <th className="p-3.5 font-bold">Discount Conceded</th>
                      <th className="p-3.5 font-bold text-right">Redeemed On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4DDD3]">
                    {usages.slice(0, 20).map((u) => (
                      <tr key={u.id} className="hover:bg-[#161616] transition-colors">
                        <td className="p-3.5 font-mono font-bold text-[#795548]">
                          {u.orderNumber || "ROYAL-ORDER"}
                        </td>
                        <td className="p-3.5 text-[#292D30] font-medium">
                          {u.customerName || "Patron"}
                        </td>
                        <td className="p-3.5 font-mono text-[#5C5855]">
                          {u.customerPhone || u.customerEmail || "N/A"}
                        </td>
                        <td className="p-3.5 font-mono text-emerald-400 font-bold">
                          -{formatPKR(u.discountAmount)}
                        </td>
                        <td className="p-3.5 font-mono text-gray-500 text-right text-[11px]">
                          {new Date(u.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#795548]/50 max-w-lg w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#E4DDD3] pb-3">
              <div>
                <span className="text-[9px] font-bold tracking-brand uppercase text-[#795548]">
                  NEW VIP INCENTIVE
                </span>
                <h2 className="font-brand text-lg font-bold tracking-luxury text-[#4A342E]">
                  CREATE PRIVILEGE PROMO CODE
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#6B635B] hover:text-[#4A342E] p-1"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/50 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            {/* Quick Templates */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B635B] flex items-center gap-1">
                <Sparkles size={12} className="text-[#795548]" />
                <span>Quick Preset Templates</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                <button
                  type="button"
                  onClick={() => applyTemplate("WELCOME10")}
                  className="p-2 border border-[#E4DDD3] hover:border-[#795548] bg-[#FAF7F2] text-left hover:bg-[#161616] transition-colors"
                >
                  <div className="font-bold text-[#795548]">WELCOME10</div>
                  <div className="text-[#6B635B] text-[9px]">10% Off 1st Buy</div>
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate("ROYAL200")}
                  className="p-2 border border-[#E4DDD3] hover:border-[#795548] bg-[#FAF7F2] text-left hover:bg-[#161616] transition-colors"
                >
                  <div className="font-bold text-blue-400">ROYAL200</div>
                  <div className="text-[#6B635B] text-[9px]">PKR 200 Flat</div>
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate("GOLD10")}
                  className="p-2 border border-[#E4DDD3] hover:border-[#795548] bg-[#FAF7F2] text-left hover:bg-[#161616] transition-colors"
                >
                  <div className="font-bold text-[#795548]">GOLD10</div>
                  <div className="text-[#6B635B] text-[9px]">10% VIP Pass</div>
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate("FREESHIP")}
                  className="p-2 border border-[#E4DDD3] hover:border-[#795548] bg-[#FAF7F2] text-left hover:bg-[#161616] transition-colors"
                >
                  <div className="font-bold text-emerald-400">FREESHIP</div>
                  <div className="text-[#6B635B] text-[9px]">Free Delivery</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-4 text-xs">
              {/* Code */}
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#5C5855] mb-1">
                  Promo Code Voucher <span className="text-[#795548]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. VIP2026, SUMMER500"
                  className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#795548] font-mono font-bold px-3 py-2.5 outline-none tracking-widest uppercase"
                />
              </div>

              {/* Discount Type */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold uppercase text-[#5C5855]">
                  Benefit Category <span className="text-[#795548]">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDiscountType("PERCENTAGE")}
                    className={`py-2 px-3 border text-center transition-all ${
                      discountType === "PERCENTAGE"
                        ? "border-[#795548] bg-[#795548]/10 text-[#795548] font-bold"
                        : "border-[#E4DDD3] bg-[#F5F0E6] text-[#6B635B]"
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType("FIXED")}
                    className={`py-2 px-3 border text-center transition-all ${
                      discountType === "FIXED"
                        ? "border-blue-500 bg-blue-500/10 text-blue-400 font-bold"
                        : "border-[#E4DDD3] bg-[#F5F0E6] text-[#6B635B]"
                    }`}
                  >
                    Fixed (PKR)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType("FREE_SHIPPING")}
                    className={`py-2 px-3 border text-center transition-all ${
                      discountType === "FREE_SHIPPING"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold"
                        : "border-[#E4DDD3] bg-[#F5F0E6] text-[#6B635B]"
                    }`}
                  >
                    Free Shipping
                  </button>
                </div>
              </div>

              {/* Value Fields */}
              {discountType === "PERCENTAGE" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5C5855] mb-1">
                      Discount Percentage (%) <span className="text-[#795548]">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={100}
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      placeholder="10"
                      className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3 py-2 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5C5855] mb-1">
                      Max Discount Cap (PKR)
                    </label>
                    <input
                      type="number"
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(e.target.value)}
                      placeholder="e.g. 1500 (Optional)"
                      className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3 py-2 outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              {discountType === "FIXED" && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#5C5855] mb-1">
                    Discount Amount (PKR) <span className="text-[#795548]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    placeholder="200"
                    className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3 py-2 outline-none font-mono"
                  />
                </div>
              )}

              {/* Thresholds */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5C5855] mb-1">
                    Minimum Order (PKR)
                  </label>
                  <input
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    placeholder="0"
                    className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3 py-2 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5C5855] mb-1">
                    Customer Usage Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={perCustomerLimit}
                    onChange={(e) => setPerCustomerLimit(e.target.value)}
                    placeholder="1"
                    className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3 py-2 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Overall Limit & Expiry */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5C5855] mb-1">
                    Total Campaign Usage Limit
                  </label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    placeholder="Leave blank for infinite"
                    className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3 py-2 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5C5855] mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3 py-2 outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-semibold text-[#5C5855] mb-1">
                  VIP Campaign Description / Internal Note
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. VIP Club exclusive weekend 10% privilege"
                  className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3 py-2 outline-none"
                />
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-[#795548] w-4 h-4"
                />
                <span className="text-xs text-[#292D30]">Activate this code immediately upon publishing</span>
              </label>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E4DDD3]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#E4DDD3] text-[#6B635B] hover:text-[#4A342E] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#795548] hover:bg-[#5D4037] text-white font-bold px-6 py-2 transition-all uppercase tracking-luxury text-xs shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? "Creating Code..." : "Publish VIP Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
