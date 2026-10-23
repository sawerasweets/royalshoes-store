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
    { label: "Payment Verification", href: "/admin/payments", icon: CreditCard },
    { label: "Store & Contact Settings", href: "/admin/settings", icon: Settings },
    { label: "Audit Logs", href: "/admin/audit", icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F0E6] flex flex-col md:flex-row border-t border-[#2A2A2A]">
      {/* Mobile Top Header & Navigation Bar (Compact, No Vertical Bloat) */}
      <div className="md:hidden bg-[#111111] border-b border-[#2A2A2A] sticky top-0 z-30">
        <div className="p-3.5 flex items-center justify-between border-b border-[#2A2A2A]/60">
          <div>
            <div className="text-[9px] font-bold tracking-brand uppercase text-[#D4AF37]">
              EXECUTIVE DESK
            </div>
            <div className="font-brand text-sm font-bold tracking-luxury text-[#F5F0E6]">
              ROYAL SHOES ADMIN
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/"
              className="flex items-center gap-1 text-gray-400 hover:text-[#D4AF37] text-[11px]"
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
                    ? "bg-[#D4AF37] text-[#080808] border-[#D4AF37]"
                    : "bg-[#080808] text-gray-400 border-[#2A2A2A] hover:border-[#D4AF37]"
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
      <aside className="hidden md:flex w-64 bg-[#111111] border-r border-[#2A2A2A] p-6 flex-col justify-between flex-shrink-0 min-h-screen">
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="pb-4 border-b border-[#2A2A2A] space-y-1">
            <span className="text-[10px] font-bold tracking-brand uppercase text-[#D4AF37]">
              EXECUTIVE DESK
            </span>
            <div className="font-brand text-lg font-bold tracking-luxury text-[#F5F0E6]">
              ROYAL SHOES ADMIN
            </div>
            <div className="text-[11px] text-gray-400 truncate">{adminName}</div>
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
                      ? "bg-[#171717] border-[#D4AF37] text-[#D4AF37] font-bold"
                      : "border-transparent text-gray-400 hover:text-white hover:bg-[#171717]"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-[#D4AF37]" : "text-gray-400"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Action */}
        <div className="pt-6 border-t border-[#2A2A2A] space-y-2 text-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] py-1.5 transition-colors"
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
