import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import prisma from "@/lib/db";
import { History, ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function AdminAuditPage() {
  const logs = await prisma.auditLog.findMany({ take: 100 });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b border-[#2A2A2A] pb-4">
          <span className="text-[10px] font-bold tracking-brand uppercase text-[#D4AF37]">
            SECURITY & ACCOUNTABILITY
          </span>
          <h1 className="font-brand text-2xl font-extrabold tracking-luxury text-[#F5F0E6]">
            ADMINISTRATIVE AUDIT LOGS
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Immutable system event records for order updates, catalog modifications, and financial actions.
          </p>
        </div>

        <div className="bg-[#111111] border border-[#2A2A2A] overflow-hidden">
          {logs.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-500">
              No audit records recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2A2A2A] text-gray-400 uppercase tracking-luxury text-[10px] bg-[#0A0A0A]">
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Action</th>
                    <th className="p-3.5">Entity</th>
                    <th className="p-3.5">Admin / Actor</th>
                    <th className="p-3.5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {logs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-[#171717] transition-colors">
                      <td className="p-3.5 font-mono text-[11px] text-gray-400">
                        {new Date(log.createdAt).toLocaleString("en-PK")}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider bg-[#080808] border-[#D4AF37]/40 text-[#D4AF37]">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3.5 text-gray-300 font-semibold">{log.entity}</td>
                      <td className="p-3.5 text-gray-400">
                        {log.userName ? `${log.userName} (${log.userEmail})` : "System / Guest"}
                      </td>
                      <td className="p-3.5 text-gray-300 max-w-xs truncate">
                        {log.details || "-"}
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
