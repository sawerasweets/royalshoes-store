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
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#111111] border-r border-[#2A2A2A] p-6 flex flex-col justify-between flex-shrink-0">
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
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
