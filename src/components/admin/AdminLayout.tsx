"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  CreditCard,
  Settings,
  History,
  Store,
  LogOut,
  Tag,
  TrendingUp,
  Layers,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  adminName?: string;
}

export function AdminLayout({ children, adminName = "Administrator" }: AdminLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders & Fulfillment", href: "/admin/orders", icon: Package },
    { label: "Products & Stock", href: "/admin/products", icon: ShoppingBag },
    { label: "Inventory Reserves", href: "/admin/stock", icon: Layers },
    { label: "Sales Reports", href: "/admin/reports", icon: TrendingUp },
    { label: "VIP Promo Codes", href: "/admin/promos", icon: Tag },
    { label: "Payment Verification", href: "/admin/payments", icon: CreditCard },
    { label: "Store Settings", href: "/admin/settings", icon: Settings },
    { label: "Audit Logs", href: "/admin/audit", icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#292D30] flex flex-col md:flex-row border-t border-[#E4DDD3]">
      {/* Mobile Top Header & Navigation Bar (Compact, No Vertical Bloat) */}
      <div className="md:hidden bg-[#FFFFFF] border-b border-[#E4DDD3] sticky top-0 z-30">
        <div className="p-3.5 flex items-center justify-between border-b border-[#E4DDD3]/60">
          <div>
            <div className="text-[9px] font-bold tracking-brand uppercase text-[#795548]">
              EXECUTIVE DESK
            </div>
            <div className="font-brand text-sm font-bold tracking-luxury text-[#4A342E]">
              ROYAL SHOES ADMIN
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/"
              className="flex items-center gap-1 text-[#6B635B] hover:text-[#795548] text-[11px]"
            >
              <Store size={14} />
              <span>Store</span>
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="flex items-center gap-1 text-rose-400 hover:text-rose-300 text-[11px]"
              >
                <LogOut size={13} />
                <span>Exit</span>
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Horizontal Scrollable Tab Bar */}
        <div className="overflow-x-auto flex items-center gap-1 px-2 py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 whitespace-nowrap text-[11px] font-bold uppercase tracking-luxury transition-colors border rounded-sm flex-shrink-0 ${
                  isActive
                    ? "bg-[#795548] text-white border-[#795548]"
                    : "bg-[#F5F0E6] text-[#6B635B] border-[#E4DDD3] hover:border-[#795548]"
                }`}
              >
                <Icon size={12} />
                <span>{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex w-64 bg-[#FFFFFF] border-r border-[#E4DDD3] p-6 flex-col justify-between flex-shrink-0 min-h-screen">
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="pb-4 border-b border-[#E4DDD3] space-y-1">
            <span className="text-[10px] font-bold tracking-brand uppercase text-[#795548]">
              EXECUTIVE DESK
            </span>
            <div className="font-brand text-lg font-bold tracking-luxury text-[#4A342E]">
              ROYAL SHOES ADMIN
            </div>
            <div className="text-[11px] text-[#6B635B] truncate">{adminName}</div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-none border transition-colors ${
                    isActive
                      ? "bg-[#FAF7F2] border-[#795548] text-[#795548] font-bold"
                      : "border-transparent text-[#6B635B] hover:text-[#4A342E] hover:bg-[#FAF7F2]"
                  }`}
                  >
                  <Icon size={16} className={isActive ? "text-[#795548]" : "text-[#6B635B]"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Action */}
        <div className="pt-6 border-t border-[#E4DDD3] space-y-2 text-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#6B635B] hover:text-[#795548] py-1.5 transition-colors"
          >
            <Store size={15} />
            <span>Storefront Boutique</span>
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 text-rose-400 hover:text-rose-300 py-1.5 transition-colors w-full text-left"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto max-w-full">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
