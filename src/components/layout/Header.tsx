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

  return (
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

      {/* Mobile Drawer Navigation (No Horizontal Overflow) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#080808] border-r border-[#2A2A2A] shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#2A2A2A]">
                <div className="font-brand text-xl font-bold tracking-brand text-[#F5F0E6]">
                  ROYAL SHOES
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-[#D4AF37]"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Mobile Category Links */}
              <nav className="py-6 space-y-4">
                {MAIN_CATEGORIES.map((cat) => {
                  const href = cat.slug === "all" ? "/all" : `/${cat.slug}`;
                  const isExpanded = activeDropdown === cat.slug;
                  return (
                    <div key={cat.slug} className="border-b border-[#2A2A2A]/40 pb-3">
                      <div className="flex items-center justify-between">
                        <Link
                          href={href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-sm font-semibold tracking-luxury uppercase text-[#F5F0E6] hover:text-[#D4AF37]"
                        >
                          {cat.name}
                        </Link>
                        {cat.subcategories.length > 0 && (
                          <button
                            onClick={() => setActiveDropdown(isExpanded ? null : cat.slug)}
                            className="p-1 text-gray-400 hover:text-[#D4AF37]"
                            aria-label={`Toggle ${cat.name} subcategories`}
                          >
                            <ChevronDown
                              size={16}
                              className={`transition-transform duration-200 ${isExpanded ? "rotate-180 text-[#D4AF37]" : ""}`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Nested subcategories */}
                      {isExpanded && cat.subcategories.length > 0 && (
                        <div className="mt-2 pl-3 space-y-2 border-l border-[#2A2A2A]">
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub.slug}
                              href={`/${cat.slug}?sub=${encodeURIComponent(sub.name)}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block text-xs text-gray-400 hover:text-[#D4AF37] py-1"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Drawer Footer with Contact & Policies */}
            <div className="pt-6 border-t border-[#2A2A2A] space-y-3 text-xs text-gray-400">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <Phone size={14} />
                <a href={BRAND.contact.phoneTel} className="font-mono">
                  {BRAND.contact.phoneDisplay}
                </a>
              </div>
              <div className="flex flex-col gap-1.5 text-[11px] uppercase tracking-wider">
                <Link href="/about" className="hover:text-white">Our Story</Link>
                <Link href="/shipping" className="hover:text-white">Shipping Policy</Link>
                <Link href="/returns" className="hover:text-white">Return & Exchange</Link>
                <Link href="/contact" className="hover:text-white">Contact Concierge</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
