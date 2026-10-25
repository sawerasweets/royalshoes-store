"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { formatPKR } from "@/lib/utils";
import { Package, Search, Filter, Check, Clock, Eye, Edit3, X, MessageSquare, Truck } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Modal edit fields
  const [editStatus, setEditStatus] = useState("PENDING");
  const [editPaymentStatus, setEditPaymentStatus] = useState("PENDING");
  const [editTracking, setEditTracking] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const sendWhatsAppNotification = (order: any, type: "CONFIRMATION" | "DISPATCH") => {
    let phone = (order.customerPhone || "").replace(/[^0-9]/g, "");
    if (phone.startsWith("0")) phone = "92" + phone.slice(1);
    if (!phone.startsWith("92")) phone = "92" + phone;

    let text = "";
    if (type === "CONFIRMATION") {
      text = `Assalam-o-Alaikum ${order.customerName}! ✨\n\nThis is ROYAL SHOES Concierge.\nYour luxury order *#${order.orderNumber}* for *Rs. ${Number(order.grandTotal).toLocaleString()}* has been *CONFIRMED*!\n\n📍 Delivery: ${order.shippingAddress}, ${order.city}\n💳 Payment: ${order.paymentMethod}\n\nOur artisans are preparing your footwear for dispatch.\nThank you for choosing ROYAL SHOES!`;
    } else {
      text = `Assalam-o-Alaikum ${order.customerName}! 🚚\n\nYour ROYAL SHOES parcel *#${order.orderNumber}* has been *DISPATCHED*!\n\n📦 Courier Tracking: *${order.trackingNumber || "Assigned"}*\n💰 Total Payable: Rs. ${Number(order.grandTotal).toLocaleString()}\n\nTrack your delivery or reply here anytime for concierge assistance.\nROYAL SHOES — Step into Elegance`;
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openEditModal = (order: any) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditPaymentStatus(order.paymentStatus);
    setEditTracking(order.trackingNumber || "");
    setEditNotes(order.internalNotes || "");
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: editStatus,
          paymentStatus: editPaymentStatus,
          trackingNumber: editTracking,
          internalNotes: editNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch {
      // fallback
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4DDD3] pb-4">
          <div>
            <span className="text-[10px] font-bold tracking-brand uppercase text-[#795548]">
              FULFILLMENT LEDGER
            </span>
            <h1 className="font-brand text-2xl font-extrabold tracking-luxury text-[#4A342E]">
              CLIENT ORDERS & FULFILLMENT
            </h1>
          </div>
          <button
            onClick={fetchOrders}
            className="text-xs uppercase tracking-luxury text-[#795548] hover:underline"
          >
            Refresh Ledger
          </button>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FFFFFF] p-4 border border-[#E4DDD3]">
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, customer name, or phone..."
              className="w-full bg-[#F5F0E6] border border-[#E4DDD3] text-xs text-[#292D30] pl-9 pr-3.5 py-2.5 outline-none focus:border-[#795548]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-[#6B635B] uppercase tracking-wider text-[10px]">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F5F0E6] border border-[#E4DDD3] text-xs text-[#292D30] px-3 py-2 outline-none cursor-pointer focus:border-[#795548]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders View: Mobile Cards + Desktop Table */}
        <div className="bg-[#FFFFFF] border border-[#E4DDD3] overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-[#6B635B]">Loading order records...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-500">No matching orders found.</div>
          ) : (
            <>
              {/* MOBILE CARDS */}
              <div className="block md:hidden divide-y divide-[#E4DDD3]">
                {filteredOrders.map((o) => (
                  <div key={o.id} className="p-4 space-y-3 bg-[#FFFFFF]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-[#795548] text-sm">
                        {o.orderNumber}
                      </span>
                      <span className="text-[11px] text-[#6B635B]">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-sm text-[#292D30]">{o.customerName}</div>
                        <div className="text-xs text-[#6B635B] font-mono">{o.customerPhone}</div>
                        <div className="text-xs text-[#6B635B] mt-0.5">{o.city}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-sm text-[#795548]">
                          {formatPKR(o.grandTotal)}
                        </div>
                        <div className="text-[10px] text-[#6B635B] uppercase mt-0.5">
                          {o.paymentMethod}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-[10px] uppercase font-bold">
                      <span className="px-2 py-0.5 border border-gray-700 bg-[#F5F0E6] text-gray-200">
                        Status: {o.status}
                      </span>
                      <span className={`px-2 py-0.5 border ${
                        o.paymentStatus === "VERIFIED"
                          ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400"
                          : "bg-amber-950/40 border-amber-500/40 text-amber-400"
                      }`}>
                        Pay: {o.paymentStatus}
                      </span>
                    </div>

                    <button
                      onClick={() => openEditModal(o)}
                      className="w-full py-2 bg-[#795548] hover:bg-[#5D4037] text-white font-bold text-xs uppercase tracking-luxury flex items-center justify-center gap-2 rounded-sm shadow transition-colors"
                    >
                      <Edit3 size={13} />
                      <span>Manage Order Status</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* DESKTOP TABLE */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E4DDD3] text-[#6B635B] uppercase tracking-luxury text-[10px] bg-[#FAF7F2]">
                      <th className="p-3.5">Order #</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">City</th>
                      <th className="p-3.5">Items</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Payment</th>
                      <th className="p-3.5 text-right">Total</th>
                      <th className="p-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4DDD3]">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#FFFFFF] transition-colors">
                        <td className="p-3.5 font-mono font-bold text-[#795548]">
                          {o.orderNumber}
                        </td>
                        <td className="p-3.5 text-[#6B635B] text-[11px]">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3.5 font-medium text-[#292D30]">
                          <div>{o.customerName}</div>
                          <div className="text-[10px] text-[#6B635B] font-mono">{o.customerPhone}</div>
                        </td>
                        <td className="p-3.5 text-[#5C5855]">{o.city}</td>
                        <td className="p-3.5 text-[#6B635B]">{o.items?.length || 1}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider bg-[#F5F0E6] border-gray-700 text-gray-200">
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider ${
                            o.paymentStatus === "VERIFIED"
                              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400"
                              : "bg-amber-950/40 border-amber-500/40 text-amber-400"
                          }`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-[#4A342E]">
                          {formatPKR(o.grandTotal)}
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => sendWhatsAppNotification(o, "CONFIRMATION")}
                              className="p-1 bg-emerald-950/60 border border-emerald-500/50 hover:bg-emerald-900 text-emerald-400 rounded transition-colors"
                              title="Send WhatsApp Order Confirmation"
                            >
                              <MessageSquare size={13} />
                            </button>
                            <button
                              onClick={() => openEditModal(o)}
                              className="inline-flex items-center gap-1 bg-[#795548] hover:bg-[#5D4037] text-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-luxury rounded-sm shadow transition-colors"
                              title="Manage Order Status"
                            >
                              <Edit3 size={11} />
                              <span>Manage</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Modal for Order Status & Payment Updates */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#FFFFFF] border border-[#795548]/50 max-w-lg w-full p-6 space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#E4DDD3] pb-3">
                <div className="space-y-0.5">
                  <div className="font-brand text-sm font-bold text-[#4A342E]">
                    MANAGE ORDER #{selectedOrder.orderNumber}
                  </div>
                  <div className="text-xs text-[#6B635B]">
                    {selectedOrder.customerName} ({selectedOrder.city})
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-[#6B635B] hover:text-[#4A342E]"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#5C5855] font-semibold uppercase mb-1">
                    Fulfillment Status (Phase 19 Lifecycle)
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] p-2.5 outline-none cursor-pointer"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#5C5855] font-semibold uppercase mb-1">
                    Payment Status
                  </label>
                  <select
                    value={editPaymentStatus}
                    onChange={(e) => setEditPaymentStatus(e.target.value)}
                    className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] p-2.5 outline-none cursor-pointer"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#5C5855] font-semibold uppercase mb-1">
                    Courier Consignment Tracking Number
                  </label>
                  <input
                    type="text"
                    value={editTracking}
                    onChange={(e) => setEditTracking(e.target.value)}
                    placeholder="e.g. TCS-948172901 / Leopard-82710"
                    className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] p-2.5 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#5C5855] font-semibold uppercase mb-1">
                    Internal Atelier Notes
                  </label>
                  <textarea
                    rows={2}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Internal verification notes..."
                    className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] p-2.5 outline-none"
                  />
                </div>

                {/* 1-Click WhatsApp Customer Contact */}
                <div className="p-3 bg-[#F5F0E6] border border-[#E4DDD3] space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#5C5855] flex items-center justify-between">
                    <span>Customer WhatsApp Contact ({selectedOrder.customerPhone})</span>
                    <span className="text-emerald-400 font-normal">1-Click Automated</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => sendWhatsAppNotification(selectedOrder, "CONFIRMATION")}
                      className="inline-flex items-center justify-center gap-1.5 p-2 bg-emerald-950/60 border border-emerald-500/60 hover:bg-emerald-900 text-emerald-400 text-[11px] font-bold uppercase tracking-wider transition-colors"
                    >
                      <MessageSquare size={13} />
                      <span>Send Confirmation</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => sendWhatsAppNotification(selectedOrder, "DISPATCH")}
                      className="inline-flex items-center justify-center gap-1.5 p-2 bg-[#FFFFFF] border border-[#795548]/60 hover:bg-[#222222] text-[#795548] text-[11px] font-bold uppercase tracking-wider transition-colors"
                    >
                      <Truck size={13} />
                      <span>Send Tracking</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E4DDD3] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 border border-[#E4DDD3] text-[#6B635B] hover:text-[#4A342E] uppercase tracking-luxury text-[11px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-2 bg-[#795548] hover:bg-[#5D4037] text-white font-bold uppercase tracking-luxury text-[11px]"
                  >
                    {isUpdating ? "Saving..." : "Save Order Status"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
