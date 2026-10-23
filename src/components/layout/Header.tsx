"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingBag, User as UserIcon, Menu, X, ChevronDown, Phone } from "lucide-react";
import { BRAND, MAIN_CATEGORIES } from "@/lib/constants";

interface HeaderProps {
  cartCount?: number;
  userName?: string | null;
}

export function Header({ cartCount = 0, userName = null }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [liveCount, setLiveCount] = useState(cartCount);
  const [selectedMobileCategory, setSelectedMobileCategory] = useState<string>("men");
  const pathname = usePathname();
  const router = useRouter();

  // Listen to client-side cart updates
  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem("royal_cart") || localStorage.getItem("sawera_cart");
        if (stored) {
          const items = JSON.parse(stored);
          const total = items.reduce((acc: number, item: { quantity: number }) => acc + (item.quantity || 1), 0);
          setLiveCount(total);
        } else {
          setLiveCount(0);
        }
      } catch {
        // fallback
      }
    };

    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("cart-updated", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cart-updated", updateCount);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const activeCategoryData =
    MAIN_CATEGORIES.find((c) => c.slug === selectedMobileCategory) || MAIN_CATEGORIES[1];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#080808]/95 backdrop-blur-md border-b border-[#2A2A2A]">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#111111] border-b border-[#2A2A2A] text-[11px] uppercase tracking-luxury text-[#F5F0E6]/90 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4">
            <span className="text-[#D4AF37]">Complimentary Shipping</span> Across Pakistan Above Rs. 5,000
          </div>
          <div className="mx-auto md:mx-0 flex items-center gap-2">
            <Phone size={11} className="text-[#D4AF37]" />
            <span>Concierge:</span>
            <a
              href={BRAND.contact.phoneTel}
              className="font-mono text-[#D4AF37] hover:underline tracking-normal font-medium"
            >
              {BRAND.contact.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Mobile Menu Trigger & Desktop Search */}
          <div className="flex items-center gap-4 lg:w-1/4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#F5F0E6] hover:text-[#D4AF37] transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu size={24} />
            </button>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden lg:flex items-center gap-2 text-xs uppercase tracking-luxury text-[#F5F0E6]/80 hover:text-[#D4AF37] transition-colors py-2"
              aria-label="Search Collection"
            >
              <Search size={18} className="text-[#D4AF37]" />
              <span>Search</span>
            </button>
          </div>

          {/* Center: Brand Wordmark */}
          <div className="flex flex-col items-center justify-center flex-1 lg:w-2/4">
            <Link href="/" className="group flex flex-col items-center text-center">
              <span className="font-brand text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-brand text-[#F5F0E6] group-hover:text-[#D4AF37] transition-colors duration-300">
                ROYAL SHOES
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.35em] text-[#D4AF37] font-medium uppercase mt-0.5">
                {BRAND.tagline}
              </span>
            </Link>
          </div>

          {/* Right: Search (Mobile), Account & Cart */}
          <div className="flex items-center justify-end gap-3 sm:gap-5 lg:w-1/4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden p-2 text-[#F5F0E6] hover:text-[#D4AF37] transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <Link
              href="/account"
              className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#F5F0E6]/80 hover:text-[#D4AF37] transition-colors p-2"
              aria-label="Account"
            >
              <UserIcon size={20} />
              <span className="hidden xl:inline text-[11px] tracking-luxury">
                {userName ? userName.split(" ")[0] : "Account"}
              </span>
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center gap-2 p-2 text-[#F5F0E6] hover:text-[#D4AF37] transition-colors"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={21} className="text-[#D4AF37]" />
              {liveCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#080808] font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {liveCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Desktop Primary Category Navigation (Phase 6 exact order: ALL, MEN, WOMEN, BAGS, ACCESSORIES, KIDS) */}
        <nav className="hidden lg:flex items-center justify-center space-x-8 border-t border-[#2A2A2A]/60 py-3">
          {MAIN_CATEGORIES.map((cat) => {
            const hasSubs = cat.subcategories.length > 0;
            const href = cat.slug === "all" ? "/all" : `/${cat.slug}`;
            const isActive = pathname === href || pathname.startsWith(`/${cat.slug}/`);

            return (
              <div
                key={cat.slug}
                className="relative group"
                onMouseEnter={() => hasSubs && setActiveDropdown(cat.slug)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={href}
                  className={`flex items-center gap-1.5 text-[12px] font-semibold tracking-luxury uppercase transition-colors py-1 ${
                    isActive
                      ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                      : "text-[#F5F0E6]/85 hover:text-[#D4AF37]"
                  }`}
                >
                  <span>{cat.name}</span>
                  {hasSubs && <ChevronDown size={12} className="opacity-60 group-hover:rotate-180 transition-transform" />}
                </Link>

                {/* Subcategory Dropdown Panel */}
                {hasSubs && activeDropdown === cat.slug && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-[#111111] border border-[#2A2A2A] shadow-2xl py-3 px-2 z-50 animate-fade-in">
                    <div className="text-[10px] font-bold tracking-luxury uppercase text-[#D4AF37] px-3 pb-2 border-b border-[#2A2A2A]">
                      {cat.name} Collections
                    </div>
                    <div className="py-1">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/${cat.slug}?sub=${encodeURIComponent(sub.name)}`}
                          className="block px-3 py-1.5 text-xs text-[#F5F0E6]/80 hover:text-[#D4AF37] hover:bg-[#171717] transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Expandable Search Input Bar */}
      {isSearchOpen && (
        <div className="border-t border-[#2A2A2A] bg-[#111111] py-4 px-4 sm:px-6 animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shoes, heels, loafers, leather bags..."
                className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] text-sm text-[#F5F0E6] px-4 py-2.5 outline-none tracking-wide placeholder:text-gray-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-[#D4AF37] hover:bg-[#AA8822] text-[#080808] px-6 py-2.5 text-xs font-bold uppercase tracking-luxury transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      )}

      </header>

      {/* Fullscreen Zero-Scroll Mobile Navigation Modal (Rendered outside <header> so backdrop-blur does not trap it!) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden bg-[#080808] flex flex-col justify-between overflow-y-auto animate-fade-in">
          <div className="p-4 sm:p-6 space-y-4">
            {/* Top Bar with Brand & Big Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
              <div>
                <div className="font-brand text-lg font-extrabold tracking-brand text-[#F5F0E6]">
                  ROYAL SHOES
                </div>
                <div className="text-[9px] tracking-[0.3em] text-[#D4AF37] uppercase font-semibold">
                  {BRAND.tagline}
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#D4AF37]/60 bg-[#111111] hover:bg-[#171717] text-[#D4AF37] hover:text-white text-xs font-bold uppercase tracking-luxury rounded-sm transition-colors"
                aria-label="Close menu"
              >
                <X size={16} />
                <span>Close</span>
              </button>
            </div>

            {/* Department Selector (All 6 Departments Clearly Displayed on Screen) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-luxury text-gray-400">
                <span>Select Department:</span>
                <span className="text-[#D4AF37]">Tap to view styles</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {MAIN_CATEGORIES.map((cat) => {
                  const isSelected = selectedMobileCategory === cat.slug;
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => {
                        if (cat.slug === "all") {
                          router.push("/all");
                          setIsMobileMenuOpen(false);
                        } else {
                          setSelectedMobileCategory(cat.slug);
                        }
                      }}
                      className={`py-2 px-1 text-center border text-[11px] font-bold uppercase tracking-luxury transition-all rounded-sm flex flex-col items-center justify-center ${
                        isSelected
                          ? "bg-[#D4AF37] text-[#080808] border-[#D4AF37] shadow-lg font-extrabold"
                          : "bg-[#111111] text-[#F5F0E6] border-[#2A2A2A] hover:border-[#D4AF37]"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-[8.5px] uppercase mt-0.5 tracking-wider ${isSelected ? "text-[#080808]/80 font-bold" : "text-gray-400"}`}>
                        {cat.slug === "all" ? "222 Items" : `${cat.subcategories.length} Styles`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subcategories Grid for the Active Department (Direct on screen, 0 scrolling!) */}
            {activeCategoryData && activeCategoryData.subcategories.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between border-b border-[#2A2A2A]/60 pb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-luxury text-[#D4AF37]">
                    {activeCategoryData.name} Styles ({activeCategoryData.subcategories.length})
                  </span>
                  <Link
                    href={`/${activeCategoryData.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[10px] uppercase tracking-luxury text-gray-300 hover:text-[#D4AF37] underline font-semibold"
                  >
                    View All {activeCategoryData.name} &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {activeCategoryData.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/${activeCategoryData.slug}?sub=${encodeURIComponent(sub.name)}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 bg-[#111111] hover:bg-[#1a1a1a] border border-[#2A2A2A] hover:border-[#D4AF37] transition-all flex items-center justify-between group rounded-sm"
                    >
                      <span className="text-[11px] text-[#F5F0E6] group-hover:text-[#D4AF37] font-medium line-clamp-1">
                        {sub.name}
                      </span>
                      <span className="text-[#D4AF37] text-xs opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform">
                        &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Footer: Direct Concierge & Links */}
          <div className="p-4 bg-[#111111] border-t border-[#2A2A2A] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <a
                href={BRAND.contact.phoneTel}
                className="flex items-center gap-1.5 text-[#D4AF37] font-mono text-xs font-bold"
              >
                <Phone size={13} />
                <span>{BRAND.contact.phoneDisplay}</span>
              </a>
              <a
                href={BRAND.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1"
              >
                <span>WhatsApp Chat</span>
              </a>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 uppercase tracking-luxury pt-1 border-t border-[#2A2A2A]/40">
              <Link href="/all" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">
                All Products
              </Link>
              <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">
                My Account
              </Link>
              <Link href="/shipping" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">
                Delivery Info
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
