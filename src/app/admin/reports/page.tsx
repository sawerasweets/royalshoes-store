"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { formatPKR } from "@/lib/utils";
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingBag,
  CreditCard,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";

interface SalesReportData {
  stats: {
    totalRevenue: number;
    todaySales: number;
    weekSales: number;
    monthSales: number;
    totalOrders: number;
    activeOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    aov: number;
  };
  statusCounts: Record<string, number>;
  paymentBreakdown: Record<string, { count: number; total: number }>;
  salesByDate: Array<{ date: string; revenue: number; orders: number }>;
  topProducts: Array<{ name: string; sku: string; units: number; revenue: number }>;
}

export default function AdminReportsPage() {
  const [data, setData] = useState<SalesReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExportCSV = () => {
    if (!data) return;

    let csv = "ROYAL SHOES SALES REPORT\n";
    csv += `Exported On: ${new Date().toLocaleString()}\n\n`;

    csv += "KEY PERFORMANCE INDICATORS\n";
    csv += `Total Gross Revenue (PKR),${data.stats.totalRevenue}\n`;
    csv += `Today Sales (PKR),${data.stats.todaySales}\n`;
    csv += `This Week Sales (PKR),${data.stats.weekSales}\n`;
    csv += `This Month Sales (PKR),${data.stats.monthSales}\n`;
    csv += `Total Orders,${data.stats.totalOrders}\n`;
    csv += `Average Order Value (PKR),${data.stats.aov}\n\n`;

    csv += "PAYMENT METHOD BREAKDOWN\n";
    csv += "Method,Orders Count,Total Revenue (PKR)\n";
    for (const [pm, val] of Object.entries(data.paymentBreakdown)) {
      csv += `${pm},${val.count},${val.total}\n`;
    }
    csv += "\n";

    csv += "TOP SELLING PRODUCTS\n";
    csv += "Product Name,SKU,Units Sold,Revenue (PKR)\n";
    data.topProducts.forEach((p) => {
      csv += `"${p.name}",${p.sku},${p.units},${p.revenue}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `royalshoes-sales-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const maxRevenue = data?.salesByDate
    ? Math.max(...data.salesByDate.map((d) => d.revenue), 1)
    : 1;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4DDD3] pb-5">
          <div>
            <span className="text-[10px] font-bold tracking-brand uppercase text-[#795548]">
              EXECUTIVE BUSINESS INTELLIGENCE
            </span>
            <h1 className="font-brand text-2xl sm:text-3xl font-extrabold tracking-luxury text-[#4A342E] mt-0.5">
              SALES & REVENUE AUDIT
            </h1>
            <p className="text-xs text-[#6B635B] mt-1">
              Live financial reporting, order volume metrics, and high-velocity footwear analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              disabled={!data || loading}
              className="inline-flex items-center justify-center gap-2 bg-[#FFFFFF] hover:bg-[#202020] text-[#795548] border border-[#795548]/60 hover:border-[#795548] font-bold text-xs uppercase tracking-luxury px-4 py-2.5 transition-colors disabled:opacity-50"
            >
              <Download size={15} />
              <span>Export CSV Audit</span>
            </button>
          </div>
        </div>

        {loading || !data ? (
          <div className="py-24 text-center text-xs text-[#6B635B] space-y-3">
            <div className="inline-block w-8 h-8 border-2 border-[#795548] border-t-transparent rounded-full animate-spin" />
            <div>Calculating Financial Ledger & Sales Metrics...</div>
          </div>
        ) : (
          <>
            {/* Primary Revenue Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-[#FFFFFF] border border-[#E4DDD3] space-y-2">
                <div className="flex items-center justify-between text-[#6B635B]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Gross Revenue</span>
                  <DollarSign size={16} className="text-[#795548]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#795548]">
                  {formatPKR(data.stats.totalRevenue)}
                </div>
                <div className="text-[10px] text-gray-500">
                  Calculated from {data.stats.totalOrders} total client reservations
                </div>
              </div>

              <div className="p-5 bg-[#FFFFFF] border border-[#E4DDD3] space-y-2">
                <div className="flex items-center justify-between text-[#6B635B]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Today's Sales</span>
                  <TrendingUp size={16} className="text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                  {formatPKR(data.stats.todaySales)}
                </div>
                <div className="text-[10px] text-gray-500">
                  Orders placed since 12:00 AM midnight
                </div>
              </div>

              <div className="p-5 bg-[#FFFFFF] border border-[#E4DDD3] space-y-2">
                <div className="flex items-center justify-between text-[#6B635B]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Last 7 Days</span>
                  <Calendar size={16} className="text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#292D30]">
                  {formatPKR(data.stats.weekSales)}
                </div>
                <div className="text-[10px] text-gray-500">
                  Weekly velocity across all boutiques
                </div>
              </div>

              <div className="p-5 bg-[#FFFFFF] border border-[#E4DDD3] space-y-2">
                <div className="flex items-center justify-between text-[#6B635B]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Avg Order Value (AOV)</span>
                  <Layers size={16} className="text-[#795548]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#292D30]">
                  {formatPKR(data.stats.aov)}
                </div>
                <div className="text-[10px] text-gray-500">
                  Average spend per customer purchase
                </div>
              </div>
            </div>

            {/* Daily Sales Bar Graph (Last 14 Days) */}
            <div className="p-6 bg-[#FFFFFF] border border-[#E4DDD3] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E4DDD3] pb-3">
                <div>
                  <h3 className="font-brand text-sm font-bold tracking-luxury uppercase text-[#4A342E]">
                    14-DAY REVENUE TRAJECTORY
                  </h3>
                  <p className="text-[11px] text-[#6B635B]">
                    Daily sales performance graph
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#6B635B] font-mono">
                  <span className="w-2.5 h-2.5 bg-[#795548] inline-block" />
                  <span>PKR Revenue</span>
                </div>
              </div>

              <div className="h-48 flex items-end gap-2 pt-6 pb-2">
                {data.salesByDate.map((item, idx) => {
                  const heightPercent = Math.max(8, Math.round((item.revenue / maxRevenue) * 100));
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center justify-end h-full gap-2 group relative"
                    >
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-10 bg-[#F5F0E6] border border-[#795548] text-[10px] py-1 px-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap shadow-lg">
                        <div className="font-bold text-[#795548]">{formatPKR(item.revenue)}</div>
                        <div className="text-[#6B635B]">{item.orders} orders</div>
                      </div>

                      {/* Bar */}
                      <div className="w-full bg-[#FAF7F2] rounded-t-sm h-full flex items-end overflow-hidden">
                        <div
                          className="w-full bg-[#795548] group-hover:bg-[#f3ca4b] transition-all duration-300"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>

                      {/* Date Label */}
                      <span className="text-[9px] font-mono text-[#6B635B] truncate max-w-full">
                        {item.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Two-Column Grid: Order Lifecycle Pipeline + Payment Methods */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Order Pipeline Status Breakdown */}
              <div className="lg:col-span-7 p-6 bg-[#FFFFFF] border border-[#E4DDD3] space-y-4">
                <h3 className="font-brand text-sm font-bold tracking-luxury uppercase text-[#4A342E] border-b border-[#E4DDD3] pb-3">
                  ORDER LIFECYCLE BREAKDOWN
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-[#FAF7F2] border border-[#E4DDD3] space-y-1">
                    <div className="text-[#6B635B] flex items-center gap-1.5 text-[11px]">
                      <Clock size={13} className="text-amber-400" />
                      <span>Pending Review</span>
                    </div>
                    <div className="text-xl font-bold font-mono text-amber-400">
                      {data.statusCounts.PENDING || 0}
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] border border-[#E4DDD3] space-y-1">
                    <div className="text-[#6B635B] flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 size={13} className="text-blue-400" />
                      <span>Confirmed</span>
                    </div>
                    <div className="text-xl font-bold font-mono text-blue-400">
                      {data.statusCounts.CONFIRMED || 0}
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] border border-[#E4DDD3] space-y-1">
                    <div className="text-[#6B635B] flex items-center gap-1.5 text-[11px]">
                      <Truck size={13} className="text-indigo-400" />
                      <span>Dispatched</span>
                    </div>
                    <div className="text-xl font-bold font-mono text-indigo-400">
                      {data.statusCounts.SHIPPED || 0}
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] border border-[#E4DDD3] space-y-1">
                    <div className="text-[#6B635B] flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>Delivered</span>
                    </div>
                    <div className="text-xl font-bold font-mono text-emerald-400">
                      {data.statusCounts.DELIVERED || 0}
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] border border-[#E4DDD3] space-y-1">
                    <div className="text-[#6B635B] flex items-center gap-1.5 text-[11px]">
                      <XCircle size={13} className="text-rose-400" />
                      <span>Cancelled</span>
                    </div>
                    <div className="text-xl font-bold font-mono text-rose-400">
                      {data.statusCounts.CANCELLED || 0}
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] border border-[#E4DDD3] space-y-1">
                    <div className="text-[#6B635B] flex items-center gap-1.5 text-[11px]">
                      <Package size={13} className="text-[#795548]" />
                      <span>Total Booked</span>
                    </div>
                    <div className="text-xl font-bold font-mono text-[#292D30]">
                      {data.stats.totalOrders}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Payment Method Distribution */}
              <div className="lg:col-span-5 p-6 bg-[#FFFFFF] border border-[#E4DDD3] space-y-4">
                <h3 className="font-brand text-sm font-bold tracking-luxury uppercase text-[#4A342E] border-b border-[#E4DDD3] pb-3">
                  PAYMENT GATEWAYS
                </h3>

                <div className="space-y-3">
                  <div className="p-3 bg-[#FAF7F2] border border-[#E4DDD3] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#4A342E]">Cash On Delivery (COD)</div>
                      <div className="text-[10px] text-gray-500">
                        {data.paymentBreakdown.COD?.count || 0} client orders
                      </div>
                    </div>
                    <div className="text-right font-mono font-bold text-xs text-[#795548]">
                      {formatPKR(data.paymentBreakdown.COD?.total || 0)}
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] border border-[#E4DDD3] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-emerald-400">Easypaisa Mobile Transfer</div>
                      <div className="text-[10px] text-gray-500">
                        {data.paymentBreakdown.EASYPAISA?.count || 0} client orders
                      </div>
                    </div>
                    <div className="text-right font-mono font-bold text-xs text-emerald-400">
                      {formatPKR(data.paymentBreakdown.EASYPAISA?.total || 0)}
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] border border-[#E4DDD3] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-blue-400">Direct Bank Wire / Meezan</div>
                      <div className="text-[10px] text-gray-500">
                        {data.paymentBreakdown.BANK_TRANSFER?.count || 0} client orders
                      </div>
                    </div>
                    <div className="text-right font-mono font-bold text-xs text-blue-400">
                      {formatPKR(data.paymentBreakdown.BANK_TRANSFER?.total || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top 10 Best-Selling Footwear Models */}
            <div className="p-6 bg-[#FFFFFF] border border-[#E4DDD3] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E4DDD3] pb-3">
                <div>
                  <h3 className="font-brand text-sm font-bold tracking-luxury uppercase text-[#4A342E]">
                    TOP SELLING LUXURY FOOTWEAR MODELS
                  </h3>
                  <p className="text-[11px] text-[#6B635B]">
                    Highest-velocity creations ranked by gross revenue generated
                  </p>
                </div>
                <ShoppingBag size={18} className="text-[#795548]" />
              </div>

              {data.topProducts.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-500">
                  No products sold yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E4DDD3] bg-[#FAF7F2] text-[#6B635B] uppercase tracking-luxury text-[10px]">
                        <th className="p-3 font-bold">Rank</th>
                        <th className="p-3 font-bold">Footwear Model</th>
                        <th className="p-3 font-bold">SKU Reference</th>
                        <th className="p-3 font-bold text-right">Units Sold</th>
                        <th className="p-3 font-bold text-right">Gross Generated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4DDD3]">
                      {data.topProducts.map((p, idx) => (
                        <tr key={idx} className="hover:bg-[#161616] transition-colors">
                          <td className="p-3 font-mono font-bold text-[#795548]">
                            #{idx + 1}
                          </td>
                          <td className="p-3 font-medium text-[#292D30]">
                            {p.name}
                          </td>
                          <td className="p-3 font-mono text-[#6B635B] text-[11px]">
                            {p.sku}
                          </td>
                          <td className="p-3 font-mono text-right text-[#5C5855]">
                            {p.units} pairs
                          </td>
                          <td className="p-3 font-mono text-right font-bold text-[#795548]">
                            {formatPKR(p.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
