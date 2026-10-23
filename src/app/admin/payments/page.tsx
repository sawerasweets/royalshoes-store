"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { formatPKR } from "@/lib/utils";
import { CreditCard, Check, X, ShieldAlert, Clock } from "lucide-react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleVerify = async (payment: any, status: "VERIFIED" | "REJECTED") => {
    setActionLoading(payment.id);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: payment.id,
          orderId: payment.orderId,
          status,
          notes: status === "VERIFIED" ? "Verified via finance portal" : "Reference invalid",
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchPayments();
      }
    } catch {
      // fallback
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b border-[#2A2A2A] pb-4">
          <span className="text-[10px] font-bold tracking-brand uppercase text-[#D4AF37]">
            FINANCIAL AUDIT
          </span>
          <h1 className="font-brand text-2xl font-extrabold tracking-luxury text-[#F5F0E6]">
            MANUAL PAYMENT VERIFICATION
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Validate Easypaisa mobile transfers and direct bank receipts before parcel dispatch.
          </p>
        </div>

        <div className="bg-[#111111] border border-[#2A2A2A] overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-gray-400">Loading payment ledger...</div>
          ) : payments.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-500">
              No manual payments pending verification.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2A2A2A] text-gray-400 uppercase tracking-luxury text-[10px] bg-[#0A0A0A]">
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Order #</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Method</th>
                    <th className="p-3.5">Reference ID (TRX)</th>
                    <th className="p-3.5 text-right">Amount (PKR)</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-center">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#171717] transition-colors">
                      <td className="p-3.5 text-gray-400 text-[11px]">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-[#D4AF37]">
                        <a href={`/order/${p.orderNumber}`} target="_blank" className="hover:underline">
                          {p.orderNumber || p.orderId}
                        </a>
                      </td>
                      <td className="p-3.5 font-medium text-[#F5F0E6]">
                        {p.customerName || "Customer"}
                      </td>
                      <td className="p-3.5 text-gray-300 font-semibold">{p.method}</td>
                      <td className="p-3.5 font-mono text-xs text-[#D4AF37]">
                        {p.referenceNumber || "None (COD)"}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-[#F5F0E6]">
                        {formatPKR(p.amount)}
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider ${
                            p.status === "VERIFIED"
                              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400"
                              : p.status === "REJECTED"
                              ? "bg-rose-950/40 border-rose-500/40 text-rose-400"
                              : "bg-amber-950/40 border-amber-500/40 text-amber-400"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        {p.status === "PENDING" ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleVerify(p, "VERIFIED")}
                              disabled={actionLoading === p.id}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-luxury flex items-center gap-1 shadow-sm"
                            >
                              <Check size={12} />
                              <span>Verify</span>
                            </button>
                            <button
                              onClick={() => handleVerify(p, "REJECTED")}
                              disabled={actionLoading === p.id}
                              className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700 font-bold text-[10px] uppercase tracking-luxury flex items-center gap-1"
                            >
                              <X size={12} />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-[11px]">
                            {p.verifiedBy ? `By ${p.verifiedBy}` : "Completed"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
