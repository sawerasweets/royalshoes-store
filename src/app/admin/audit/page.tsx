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
        <div className="border-b border-[#E4DDD3] pb-4">
          <span className="text-[10px] font-bold tracking-brand uppercase text-[#795548]">
            SECURITY & ACCOUNTABILITY
          </span>
          <h1 className="font-brand text-2xl font-extrabold tracking-luxury text-[#4A342E]">
            ADMINISTRATIVE AUDIT LOGS
          </h1>
          <p className="text-xs text-[#6B635B] mt-1">
            Immutable system event records for order updates, catalog modifications, and financial actions.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E4DDD3] overflow-hidden">
          {logs.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-500">
              No audit records recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E4DDD3] text-[#6B635B] uppercase tracking-luxury text-[10px] bg-[#FAF7F2]">
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Action</th>
                    <th className="p-3.5">Entity</th>
                    <th className="p-3.5">Admin / Actor</th>
                    <th className="p-3.5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4DDD3]">
                  {logs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-[#FFFFFF] transition-colors">
                      <td className="p-3.5 font-mono text-[11px] text-[#6B635B]">
                        {new Date(log.createdAt).toLocaleString("en-PK")}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider bg-[#F5F0E6] border-[#795548]/40 text-[#795548]">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3.5 text-[#5C5855] font-semibold">{log.entity}</td>
                      <td className="p-3.5 text-[#6B635B]">
                        {log.userName ? `${log.userName} (${log.userEmail})` : "System / Guest"}
                      </td>
                      <td className="p-3.5 text-[#5C5855] max-w-xs truncate">
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
