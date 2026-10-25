import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { formatPKR } from "@/lib/utils";
import { Package, User, MapPin, LogOut, ArrowRight, ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/account/login");
  }

  // Fetch customer's own orders
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    take: 10,
  });

  return (
    <div className="space-y-10 pb-20 pt-4 max-w-5xl mx-auto">
      {/* Account Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4DDD3] pb-6">
        <div>
          <span className="text-[10px] font-bold tracking-brand uppercase text-[#795548]">
            CLIENT PORTFOLIO
          </span>
          <h1 className="font-brand text-2xl sm:text-3xl font-extrabold tracking-luxury text-[#4A342E] mt-0.5">
            WELCOME, {user.name.toUpperCase()}
          </h1>
          <p className="text-xs text-[#6B635B] mt-1">
            {user.email} • {user.role === "ADMIN" ? "Store Administrator" : "Privilege Member"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 bg-[#795548] text-white px-4 py-2 text-xs font-bold uppercase tracking-luxury hover:bg-[#5D4037] transition-colors"
            >
              <span>Admin Dashboard</span>
            </Link>
          )}

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 border border-[#E4DDD3] hover:border-rose-500 hover:text-rose-400 text-[#6B635B] px-4 py-2 text-xs uppercase tracking-luxury transition-colors"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Orders List */}
        <div className="md:col-span-8 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#E4DDD3]">
            <h2 className="font-brand text-sm font-bold tracking-luxury uppercase text-[#4A342E] flex items-center gap-2">
              <Package size={16} className="text-[#795548]" />
              <span>Your Orders & Reservations ({orders.length})</span>
            </h2>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div
                  key={order.id}
                  className="p-5 bg-[#FFFFFF] border border-[#E4DDD3] hover:border-gray-600 transition-colors space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4DDD3] pb-3 text-xs">
                    <div>
                      <span className="text-[#6B635B]">Order: </span>
                      <strong className="text-[#795548] font-mono">{order.orderNumber}</strong>
                    </div>
                    <div className="text-[#6B635B]">
                      {new Date(order.createdAt).toLocaleDateString("en-PK", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="px-2.5 py-0.5 border text-[11px] font-bold uppercase tracking-luxury bg-[#FFFFFF] border-[#795548]/50 text-[#795548]">
                      {order.status}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-xs text-[#6B635B]">
                      <span>{order.items?.length || 1} Item(s)</span> •{" "}
                      <span>{order.paymentMethod}</span>
                    </div>
                    <div className="font-mono font-bold text-sm text-[#292D30]">
                      {formatPKR(order.grandTotal)}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Link
                      href={`/order/${order.orderNumber}`}
                      className="inline-flex items-center gap-1.5 text-xs text-[#795548] hover:underline uppercase tracking-luxury font-semibold"
                    >
                      <span>View Order Details & Status</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[#FFFFFF] border border-[#E4DDD3] space-y-3">
              <p className="text-xs text-[#6B635B]">You haven&apos;t placed any orders yet.</p>
              <Link
                href="/all"
                className="inline-block bg-[#795548] text-white text-xs font-bold uppercase tracking-luxury px-6 py-2.5 hover:bg-[#5D4037]"
              >
                Start Exploring
              </Link>
            </div>
          )}
        </div>

        {/* Right: Account Summary & Concierge */}
        <div className="md:col-span-4 space-y-6">
          <div className="p-6 bg-[#FFFFFF] border border-[#E4DDD3] space-y-4 text-xs">
            <h3 className="font-brand text-xs font-bold tracking-luxury uppercase text-[#4A342E] pb-2 border-b border-[#E4DDD3] flex items-center gap-2">
              <User size={14} className="text-[#795548]" />
              <span>Personal Details</span>
            </h3>

            <div className="space-y-2 text-[#5C5855]">
              <div>
                <span className="text-gray-500 block text-[10px] uppercase">Name</span>
                <span className="font-semibold text-white">{user.name}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase">Email</span>
                <span>{user.email}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase">Phone</span>
                <span className="font-mono">{user.phone || "Not specified"}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#FFFFFF] border border-[#E4DDD3] space-y-3 text-xs text-[#6B635B]">
            <div className="flex items-center gap-2 text-[#795548] font-semibold uppercase tracking-wider">
              <ShieldCheck size={16} />
              <span>ROYAL SHOES Concierge Service</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Need personalized styling consultation or custom leather fitting? Reach your direct concierge anytime at <strong className="text-white font-mono">03481702710</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
