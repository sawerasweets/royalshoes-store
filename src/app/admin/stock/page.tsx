"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Plus,
  Minus,
  Save,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface VariantItem {
  id: string;
  productId: string;
  productName?: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  additionalPrice: number;
}

interface StockMovement {
  id: string;
  variantId: string;
  quantity: number;
  reason: string;
  referenceId?: string | null;
  createdAt: string;
}

export default function AdminStockPage() {
  const [variants, setVariants] = useState<VariantItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [stats, setStats] = useState({
    totalVariants: 0,
    totalInventoryUnits: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<"ALL" | "LOW" | "OUT" | "IN">("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Local draft quantities
  const [draftStocks, setDraftStocks] = useState<Record<string, number>>({});

  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stock");
      const json = await res.json();
      if (json.success) {
        setVariants(json.variants || []);
        setMovements(json.movements || []);
        setStats(json.stats || { totalVariants: 0, totalInventoryUnits: 0, lowStockCount: 0, outOfStockCount: 0 });

        // Initialize draft stocks
        const drafts: Record<string, number> = {};
        (json.variants || []).forEach((v: VariantItem) => {
          drafts[v.id] = v.stock;
        });
        setDraftStocks(drafts);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleStockDelta = (variantId: string, delta: number) => {
    const current = draftStocks[variantId] ?? 0;
    const nextVal = Math.max(0, current + delta);
    setDraftStocks((prev) => ({ ...prev, [variantId]: nextVal }));
  };

  const handleStockChange = (variantId: string, val: string) => {
    const num = parseInt(val, 10);
    setDraftStocks((prev) => ({
      ...prev,
      [variantId]: isNaN(num) ? 0 : Math.max(0, num),
    }));
  };

  const handleSaveStock = async (v: VariantItem) => {
    const newStock = draftStocks[v.id];
    if (newStock === undefined || newStock === v.stock) return;

    setUpdatingId(v.id);
    try {
      const res = await fetch("/api/admin/stock", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: v.id,
          stock: newStock,
          reason: newStock > v.stock ? "RESTOCK" : "CORRECTION",
        }),
      });

      const json = await res.json();
      if (json.success) {
        fetchStock();
      }
    } catch {
      // fallback
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredVariants = variants.filter((v) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (v.productName && v.productName.toLowerCase().includes(q)) ||
      (v.sku && v.sku.toLowerCase().includes(q)) ||
      v.size.toLowerCase().includes(q) ||
      v.color.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (filterMode === "LOW") return v.stock > 0 && v.stock <= 3;
    if (filterMode === "OUT") return v.stock <= 0;
    if (filterMode === "IN") return v.stock > 3;
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4DDD3] pb-5">
          <div>
            <span className="text-[10px] font-bold tracking-brand uppercase text-[#795548]">
              INVENTORY MANAGEMENT & AUDIT
            </span>
            <h1 className="font-brand text-2xl sm:text-3xl font-extrabold tracking-luxury text-[#4A342E] mt-0.5">
              STOCK & ATELIER RESERVES
            </h1>
            <p className="text-xs text-[#6B635B] mt-1">
              Live warehouse counts, instant size adjustments, and automated replenishment alerts.
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-[#FFFFFF] border border-[#E4DDD3] space-y-2">
            <div className="flex items-center justify-between text-[#6B635B]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Shoe Pairs</span>
              <Package size={16} className="text-[#795548]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#795548]">
              {stats.totalInventoryUnits}
            </div>
            <div className="text-[10px] text-gray-500">
              Available across all size variations
            </div>
          </div>

          <div className="p-5 bg-[#FFFFFF] border border-[#E4DDD3] space-y-2">
            <div className="flex items-center justify-between text-[#6B635B]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Catalog Variants</span>
              <TrendingUp size={16} className="text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#292D30]">
              {stats.totalVariants}
            </div>
            <div className="text-[10px] text-gray-500">
              Unique SKU and size options
            </div>
          </div>

          <div className="p-5 bg-[#FFFFFF] border border-[#E4DDD3] space-y-2">
            <div className="flex items-center justify-between text-[#6B635B]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock Warning</span>
              <AlertTriangle size={16} className="text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
              {stats.lowStockCount}
            </div>
            <div className="text-[10px] text-gray-500">
              Under 3 pairs remaining in stock
            </div>
          </div>

          <div className="p-5 bg-[#FFFFFF] border border-[#E4DDD3] space-y-2">
            <div className="flex items-center justify-between text-[#6B635B]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Sold Out Variants</span>
              <XCircle size={16} className="text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-400">
              {stats.outOfStockCount}
            </div>
            <div className="text-[10px] text-gray-500">
              Immediate restocking required
            </div>
          </div>
        </div>

        {/* Toolbar & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFFFFF] p-3 border border-[#E4DDD3]">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B635B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by shoe name, size (e.g. 42), or SKU..."
              className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] pl-9 pr-4 py-2 outline-none"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setFilterMode("ALL")}
              className={`px-3 py-2 border transition-all text-[11px] font-bold uppercase tracking-wider ${
                filterMode === "ALL"
                  ? "bg-[#795548] text-white border-[#795548]"
                  : "bg-[#F5F0E6] text-[#6B635B] border-[#E4DDD3] hover:text-[#292D30]"
              }`}
            >
              All ({variants.length})
            </button>
            <button
              onClick={() => setFilterMode("LOW")}
              className={`px-3 py-2 border transition-all text-[11px] font-bold uppercase tracking-wider ${
                filterMode === "LOW"
                  ? "bg-amber-500 text-black border-amber-500 font-extrabold"
                  : "bg-[#F5F0E6] text-[#6B635B] border-[#E4DDD3] hover:text-[#292D30]"
              }`}
            >
              Low Stock ({stats.lowStockCount})
            </button>
            <button
              onClick={() => setFilterMode("OUT")}
              className={`px-3 py-2 border transition-all text-[11px] font-bold uppercase tracking-wider ${
                filterMode === "OUT"
                  ? "bg-rose-500 text-white border-rose-500 font-extrabold"
                  : "bg-[#F5F0E6] text-[#6B635B] border-[#E4DDD3] hover:text-[#292D30]"
              }`}
            >
              Sold Out ({stats.outOfStockCount})
            </button>
            <button
              onClick={() => setFilterMode("IN")}
              className={`px-3 py-2 border transition-all text-[11px] font-bold uppercase tracking-wider ${
                filterMode === "IN"
                  ? "bg-emerald-500 text-black border-emerald-500 font-extrabold"
                  : "bg-[#F5F0E6] text-[#6B635B] border-[#E4DDD3] hover:text-[#292D30]"
              }`}
            >
              In Stock
            </button>
          </div>
        </div>

        {/* Stock Table */}
        <div className="bg-[#FFFFFF] border border-[#E4DDD3] overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs text-[#6B635B] space-y-2">
              <div className="inline-block w-6 h-6 border-2 border-[#795548] border-t-transparent rounded-full animate-spin" />
              <div>Loading Warehouse Stock Ledger...</div>
            </div>
          ) : filteredVariants.length === 0 ? (
            <div className="py-16 text-center text-xs text-gray-500">
              No product variants match your filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E4DDD3] bg-[#FAF7F2] text-[#6B635B] uppercase tracking-luxury text-[10px]">
                    <th className="p-3.5 font-bold">Model / Product</th>
                    <th className="p-3.5 font-bold">SKU Reference</th>
                    <th className="p-3.5 font-bold">Size</th>
                    <th className="p-3.5 font-bold">Color</th>
                    <th className="p-3.5 font-bold text-center">Status</th>
                    <th className="p-3.5 font-bold text-center">Stock Adjustment</th>
                    <th className="p-3.5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4DDD3]">
                  {filteredVariants.map((v) => {
                    const isModified = draftStocks[v.id] !== undefined && draftStocks[v.id] !== v.stock;
                    const isSaving = updatingId === v.id;

                    return (
                      <tr key={v.id} className="hover:bg-[#161616] transition-colors">
                        <td className="p-3.5 font-medium text-[#292D30]">
                          {v.productName || "Footwear Model"}
                        </td>
                        <td className="p-3.5 font-mono text-[#6B635B] text-[11px]">
                          {v.sku}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-[#795548]">
                          EU {v.size}
                        </td>
                        <td className="p-3.5 text-[#5C5855]">
                          {v.color}
                        </td>
                        <td className="p-3.5 text-center">
                          {v.stock <= 0 ? (
                            <span className="px-2 py-0.5 bg-rose-950/40 border border-rose-500/40 text-rose-400 font-bold text-[10px] uppercase tracking-wider">
                              Sold Out
                            </span>
                          ) : v.stock <= 3 ? (
                            <span className="px-2 py-0.5 bg-amber-950/40 border border-amber-500/40 text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                              Low ({v.stock} left)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                              In Stock ({v.stock})
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="inline-flex items-center border border-[#E4DDD3] bg-[#F5F0E6]">
                            <button
                              type="button"
                              onClick={() => handleStockDelta(v.id, -1)}
                              className="px-2.5 py-1 text-[#6B635B] hover:text-rose-400 font-bold"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={0}
                              value={draftStocks[v.id] ?? v.stock}
                              onChange={(e) => handleStockChange(v.id, e.target.value)}
                              className="w-12 text-center bg-transparent font-mono font-bold text-xs text-[#292D30] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleStockDelta(v.id, 1)}
                              className="px-2.5 py-1 text-[#6B635B] hover:text-emerald-400 font-bold"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleSaveStock(v)}
                            disabled={!isModified || isSaving}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-luxury rounded-sm transition-all ${
                              isModified
                                ? "bg-[#795548] hover:bg-[#5D4037] text-white shadow-md animate-pulse"
                                : "bg-transparent text-gray-600 border border-gray-800 cursor-not-allowed"
                            }`}
                          >
                            <Save size={11} />
                            <span>{isSaving ? "Saving..." : "Save"}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Inventory Movements Trail */}
        <div className="space-y-4">
          <div className="border-b border-[#E4DDD3] pb-3">
            <h3 className="font-brand text-base font-bold tracking-luxury uppercase text-[#4A342E]">
              RECENT INVENTORY AUDIT MOVEMENTS ({movements.length})
            </h3>
            <p className="text-xs text-[#6B635B]">
              Audit log of stock deductions from sales and manual replenishments by administrator.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E4DDD3] overflow-hidden">
            {movements.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-500">
                No recent stock movements recorded.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E4DDD3] bg-[#FAF7F2] text-[#6B635B] uppercase tracking-luxury text-[10px]">
                      <th className="p-3 font-bold">Movement ID</th>
                      <th className="p-3 font-bold">Variant ID</th>
                      <th className="p-3 font-bold">Quantity Delta</th>
                      <th className="p-3 font-bold">Reason</th>
                      <th className="p-3 font-bold">Reference</th>
                      <th className="p-3 font-bold text-right">Logged At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4DDD3]">
                    {movements.slice(0, 15).map((m) => (
                      <tr key={m.id} className="hover:bg-[#161616] transition-colors">
                        <td className="p-3 font-mono text-[#6B635B] text-[11px]">{m.id}</td>
                        <td className="p-3 font-mono text-xs text-[#292D30]">{m.variantId}</td>
                        <td className="p-3 font-mono font-bold">
                          {m.quantity > 0 ? (
                            <span className="text-emerald-400">+{m.quantity}</span>
                          ) : (
                            <span className="text-rose-400">{m.quantity}</span>
                          )}
                        </td>
                        <td className="p-3 text-[#5C5855]">
                          <span className="px-2 py-0.5 bg-[#F5F0E6] border border-[#E4DDD3] text-[10px] uppercase font-bold">
                            {m.reason}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[#6B635B] text-[11px]">
                          {m.referenceId || "N/A"}
                        </td>
                        <td className="p-3 font-mono text-gray-500 text-right text-[11px]">
                          {new Date(m.createdAt).toLocaleString()}
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
    </AdminLayout>
  );
}
