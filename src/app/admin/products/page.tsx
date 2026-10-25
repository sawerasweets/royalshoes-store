"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import { formatPKR } from "@/lib/utils";
import {
  Plus,
  Search,
  Edit3,
  Check,
  X,
  Upload,
  Sparkles,
  Percent,
  CheckCircle2,
  ExternalLink,
  Layers,
} from "lucide-react";

const CATEGORY_MAP: Record<string, { id: string; name: string; subs: { id: string; name: string }[] }> = {
  "cat-men": {
    id: "cat-men",
    name: "MEN",
    subs: [
      { id: "sub-men-formal-shoes", name: "Formal Shoes" },
      { id: "sub-men-casual-shoes", name: "Casual Shoes" },
      { id: "sub-men-sneakers", name: "Sneakers" },
      { id: "sub-men-sandals", name: "Sandals" },
      { id: "sub-men-slippers", name: "Slippers" },
      { id: "sub-men-loafers", name: "Loafers" },
      { id: "sub-men-moccasins", name: "Moccasins" },
      { id: "sub-men-boots", name: "Boots" },
      { id: "sub-men-sports-shoes", name: "Sports Shoes" },
    ],
  },
  "cat-women": {
    id: "cat-women",
    name: "WOMEN",
    subs: [
      { id: "sub-women-heels", name: "Heels" },
      { id: "sub-women-flats", name: "Flats" },
      { id: "sub-women-sandals", name: "Sandals" },
      { id: "sub-women-comfort-shoes", name: "Comfort Shoes" },
      { id: "sub-women-block-heels", name: "Block Heels" },
      { id: "sub-women-kitten-heels", name: "Kitten Heels" },
      { id: "sub-women-mules", name: "Mules" },
      { id: "sub-women-moccasins", name: "Moccasins" },
      { id: "sub-women-pumps", name: "Pumps" },
      { id: "sub-women-sneakers", name: "Sneakers" },
      { id: "sub-women-slippers", name: "Slippers" },
      { id: "sub-women-wedges", name: "Wedges" },
    ],
  },
  "cat-bags": {
    id: "cat-bags",
    name: "BAGS",
    subs: [
      { id: "sub-bags-handbags", name: "Handbags" },
      { id: "sub-bags-shoulder-bags", name: "Shoulder Bags" },
      { id: "sub-bags-tote-bags", name: "Tote Bags" },
      { id: "sub-bags-backpacks", name: "Backpacks" },
      { id: "sub-bags-crossbody-bags", name: "Crossbody Bags" },
      { id: "sub-bags-travel-bags", name: "Travel Bags" },
      { id: "sub-bags-clutches", name: "Clutches" },
    ],
  },
  "cat-accessories": {
    id: "cat-accessories",
    name: "ACCESSORIES",
    subs: [
      { id: "sub-accessories-wallets", name: "Wallets" },
      { id: "sub-accessories-belts", name: "Belts" },
      { id: "sub-accessories-leather", name: "Leather Accessories" },
    ],
  },
  "cat-kids": {
    id: "cat-kids",
    name: "KIDS",
    subs: [
      { id: "sub-kids-boys-shoes", name: "Boys' Shoes" },
      { id: "sub-kids-girls-shoes", name: "Girls' Shoes" },
      { id: "sub-kids-sneakers", name: "Sneakers" },
      { id: "sub-kids-sandals", name: "Sandals" },
      { id: "sub-kids-slippers", name: "Slippers" },
      { id: "sub-kids-school-shoes", name: "School Shoes" },
    ],
  },
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Edit / Form state
  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    categoryId: "cat-men",
    subcategoryId: "sub-men-formal-shoes",
    sku: "",
    price: "",
    originalPrice: "",
    description: "",
    imageUrl: "",
    stock: "12",
    isPublished: true,
    isFeatured: false,
    isNewArrival: false,
    isBestseller: false,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open Edit Modal with full pre-filled values
  const handleOpenEdit = (p: any) => {
    const primaryImg = p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url || "";
    const avgStock = p.variants?.[0]?.stock ?? 12;

    setEditFormData({
      id: p.id,
      name: p.name || "",
      categoryId: p.categoryId || "cat-men",
      subcategoryId: p.subcategoryId || "",
      sku: p.sku || "",
      price: String(p.price || ""),
      originalPrice: p.originalPrice ? String(p.originalPrice) : "",
      description: p.description || "",
      imageUrl: primaryImg,
      stock: String(avgStock),
      isPublished: Boolean(p.isPublished),
      isFeatured: Boolean(p.isFeatured),
      isNewArrival: Boolean(p.isNewArrival),
      isBestseller: Boolean(p.isBestseller),
    });

    setIsEditing(true);
  };

  // Save Edit Changes
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isNew = isCreating;
      const method = isNew ? "POST" : "PATCH";
      const payload: any = {
        name: editFormData.name,
        sku: editFormData.sku,
        categoryId: editFormData.categoryId,
        subcategoryId: editFormData.subcategoryId || null,
        price: Number(editFormData.price),
        originalPrice: editFormData.originalPrice ? Number(editFormData.originalPrice) : null,
        description: editFormData.description,
        imageUrl: editFormData.imageUrl,
        stock: Number(editFormData.stock),
        isPublished: editFormData.isPublished,
        isFeatured: editFormData.isFeatured,
        isNewArrival: editFormData.isNewArrival,
        isBestseller: editFormData.isBestseller,
      };

      if (!isNew) {
        payload.id = editFormData.id;
      }

      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        setIsCreating(false);
        showToast(`Product "${editFormData.name}" ${isNew ? "created" : "updated"} successfully!`);
        fetchProducts();
      } else {
        alert(data.error || `Failed to ${isNew ? "create" : "update"} product.`);
      }
    } catch {
      alert("Error saving product changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick discount calculation helper
  const calculateDiscountPercent = (price: string, originalPrice: string) => {
    const p = Number(price);
    const op = Number(originalPrice);
    if (!p || !op || op <= p) return null;
    return Math.round(((op - p) / op) * 100);
  };

  const applyPresetDiscount = (percent: number) => {
    const currentPrice = Number(editFormData.price);
    if (!currentPrice || currentPrice <= 0) return;
    // If selling price is 4000, 20% discount means original was 4000 / (1 - 0.20) = 5000
    const calculatedOriginal = Math.round(currentPrice / (1 - percent / 100));
    setEditFormData({ ...editFormData, originalPrice: String(calculatedOriginal) });
  };

  const removeDiscount = () => {
    setEditFormData({ ...editFormData, originalPrice: "" });
  };

  // Handle Photo File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setEditFormData((prev) => ({ ...prev, imageUrl: data.url }));
        showToast("New image uploaded and attached!");
      } else {
        alert(data.error || "Failed to upload file.");
      }
    } catch {
      alert("Error uploading image file.");
    } finally {
      setIsUploading(false);
    }
  };

  // Toggle quick publish
  const handleTogglePublish = async (prod: any) => {
    try {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: prod.id,
          isPublished: !prod.isPublished,
        }),
      });
      fetchProducts();
    } catch {
      // fallback
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.subcategoryName && p.subcategoryName.toLowerCase().includes(search.toLowerCase())) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      categoryFilter === "ALL" ||
      (p.categoryName && p.categoryName.toUpperCase() === categoryFilter);

    return matchesSearch && matchesCategory;
  });

  const discountPercent = calculateDiscountPercent(editFormData.price, editFormData.originalPrice);
  const activeSubs = CATEGORY_MAP[editFormData.categoryId]?.subs || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-[#D4AF37] text-[#080808] px-4 py-2.5 rounded shadow-xl font-bold text-xs uppercase tracking-luxury animate-fade-in">
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-4">
          <div>
            <span className="text-[10px] font-bold tracking-brand uppercase text-[#D4AF37]">
              CATALOGUE MANAGEMENT
            </span>
            <h1 className="font-brand text-2xl font-extrabold tracking-luxury text-[#F5F0E6]">
              PRODUCTS & INVENTORY
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Edit rates, discounts, images, stock, and descriptions directly for any piece.
            </p>
          </div>
          <button
            onClick={() => {
              setEditFormData({
                id: `prod-new-${Date.now()}`,
                name: "",
                categoryId: "cat-men",
                subcategoryId: "sub-men-formal-shoes",
                sku: `SW-M-NEW-${Math.floor(100 + Math.random() * 900)}`,
                price: "",
                originalPrice: "",
                description: "",
                imageUrl: "/products/prod-men-formal-shoes-1-1.svg",
                stock: "12",
                isPublished: true,
                isFeatured: false,
                isNewArrival: true,
                isBestseller: false,
              });
              setIsCreating(true);
            }}
            className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#AA8822] text-[#080808] px-5 py-2.5 text-xs font-bold uppercase tracking-luxury transition-all shadow-md"
          >
            <Plus size={15} />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Category Filter Pills & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {["ALL", "MEN", "WOMEN", "BAGS", "ACCESSORIES", "KIDS"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-[11px] font-bold tracking-luxury uppercase transition-colors border ${
                  categoryFilter === cat
                    ? "bg-[#D4AF37] text-[#080808] border-[#D4AF37]"
                    : "bg-[#111111] text-gray-300 border-[#2A2A2A] hover:border-[#D4AF37]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, SKU, or subcategory..."
              className="w-full bg-[#111111] border border-[#2A2A2A] text-xs text-[#F5F0E6] pl-8 pr-3 py-1.5 outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Products View: Mobile Cards + Desktop Table */}
        <div className="bg-[#111111] border border-[#2A2A2A] overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-gray-400">Loading catalog...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-500">No products match your search.</div>
          ) : (
            <>
              {/* MOBILE CARD VIEW (Optimized for all smartphones) */}
              <div className="block md:hidden divide-y divide-[#2A2A2A]">
                {filteredProducts.map((p) => {
                  const hasDiscount = p.originalPrice && p.originalPrice > p.price;
                  const discount = hasDiscount
                    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                    : null;
                  const primaryImg = p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url || "/products/luxury-oxford.svg";
                  const totalStock = p.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) ?? 0;

                  return (
                    <div key={p.id} className="p-4 space-y-3 bg-[#111111] hover:bg-[#151515] transition-colors">
                      {/* Top Bar: SKU + Status */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-gray-400 font-semibold">{p.sku}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePublish(p)}
                            className={`px-2 py-0.5 text-[10px] uppercase font-bold border transition-colors ${
                              p.isPublished
                                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400"
                                : "bg-gray-800 border-gray-600 text-gray-400"
                            }`}
                          >
                            {p.isPublished ? "Active" : "Draft"}
                          </button>
                          {p.isFeatured && <span className="text-[#D4AF37] text-xs">★</span>}
                        </div>
                      </div>

                      {/* Middle: Image + Details */}
                      <div className="flex gap-3">
                        <div className="relative w-16 h-20 bg-[#0A0A0A] border border-[#2A2A2A] flex-shrink-0 overflow-hidden">
                          <Image
                            src={primaryImg}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="font-semibold text-sm text-[#F5F0E6] line-clamp-1">{p.name}</div>
                          <div className="text-[10px] text-[#D4AF37] uppercase font-bold">
                            {p.categoryName || "ROYAL SHOES"} {p.subcategoryName ? `• ${p.subcategoryName}` : ""}
                          </div>
                          <div className="flex items-baseline gap-2 pt-0.5">
                            <span className="font-mono font-bold text-sm text-[#F5F0E6]">{formatPKR(p.price)}</span>
                            {hasDiscount && (
                              <span className="font-mono text-[10px] text-gray-500 line-through">
                                {formatPKR(p.originalPrice)}
                              </span>
                            )}
                            {hasDiscount && (
                              <span className="px-1 py-0.2 text-[9px] font-bold bg-[#D4AF37] text-[#080808]">
                                -{discount}%
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            Stock:{" "}
                            {totalStock > 0 ? (
                              <span className="text-emerald-400 font-bold">{totalStock} units</span>
                            ) : (
                              <span className="text-red-400 font-bold">Out of stock</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Prominent Action Button: EDIT PRODUCT & PRICE */}
                      <div className="pt-1 flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="flex-1 py-2.5 bg-[#D4AF37] hover:bg-[#AA8822] text-[#080808] font-bold text-xs uppercase tracking-luxury flex items-center justify-center gap-2 shadow rounded-sm transition-all"
                        >
                          <Edit3 size={13} />
                          <span>Edit Product & Price</span>
                        </button>
                        <a
                          href={`/product/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 border border-[#2A2A2A] hover:border-[#D4AF37] text-gray-400 hover:text-[#D4AF37] transition-colors"
                          title="View on Storefront"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP TABLE VIEW (With sticky actions column & Column 2 Edit button) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#2A2A2A] text-gray-400 uppercase tracking-luxury text-[10px] bg-[#0A0A0A]">
                      <th className="p-3.5">Image</th>
                      <th className="p-3.5">Product Title & Action</th>
                      <th className="p-3.5">SKU</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5 text-right">Price (PKR)</th>
                      <th className="p-3.5 text-center">Discount</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-center">Featured</th>
                      <th className="p-3.5 text-center">Stock</th>
                      <th className="p-3.5 text-center sticky right-0 bg-[#0A0A0A] shadow-[-6px_0_12px_rgba(0,0,0,0.6)] z-10">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A2A]">
                    {filteredProducts.map((p) => {
                      const hasDiscount = p.originalPrice && p.originalPrice > p.price;
                      const discount = hasDiscount
                        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                        : null;
                      const primaryImg = p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url || "/products/luxury-oxford.svg";
                      const totalStock = p.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) ?? 0;

                      return (
                        <tr key={p.id} className="hover:bg-[#171717] transition-colors group">
                          <td className="p-3.5">
                            <div className="relative w-11 h-14 bg-[#0A0A0A] border border-[#2A2A2A] overflow-hidden">
                              <Image
                                src={primaryImg}
                                alt={p.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </td>
                          <td className="p-3.5 min-w-[220px]">
                            <div className="font-semibold text-[#F5F0E6] line-clamp-1">{p.name}</div>
                            <div className="text-[10px] text-gray-400 truncate max-w-xs">{p.description}</div>
                            {/* Immediate In-Cell Edit Button (Unmissable) */}
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                onClick={() => handleOpenEdit(p)}
                                className="inline-flex items-center gap-1.5 bg-[#D4AF37] hover:bg-[#AA8822] text-[#080808] px-2.5 py-1 text-[11px] font-bold uppercase tracking-luxury rounded-sm shadow transition-all hover:scale-105"
                                title="Edit product details, price, discount, picture & stock"
                              >
                                <Edit3 size={11} />
                                <span>Edit Product & Price</span>
                              </button>
                              <a
                                href={`/product/${p.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#D4AF37] border border-[#2A2A2A] hover:border-[#D4AF37] px-2 py-0.5 transition-colors"
                                title="View on Storefront"
                              >
                                <ExternalLink size={11} />
                                <span>View</span>
                              </a>
                            </div>
                          </td>
                          <td className="p-3.5 font-mono text-gray-400 text-[11px] whitespace-nowrap">{p.sku}</td>
                          <td className="p-3.5 text-gray-300 whitespace-nowrap">
                            <span className="text-[10px] uppercase font-bold text-[#D4AF37] block">
                              {p.categoryName || "ROYAL SHOES"}
                            </span>
                            <span className="text-[11px] text-gray-300">
                              {p.subcategoryName || "—"}
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="font-mono font-bold text-[#F5F0E6]">
                              {formatPKR(p.price)}
                            </div>
                            {hasDiscount && (
                              <div className="font-mono text-[10px] text-gray-500 line-through">
                                {formatPKR(p.originalPrice)}
                              </div>
                            )}
                          </td>
                          <td className="p-3.5 text-center whitespace-nowrap">
                            {hasDiscount ? (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#D4AF37] text-[#080808]">
                                -{discount}%
                              </span>
                            ) : (
                              <span className="text-gray-600 text-[11px]">—</span>
                            )}
                          </td>
                          <td className="p-3.5 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleTogglePublish(p)}
                              className={`px-2 py-0.5 text-[10px] uppercase font-bold border transition-colors ${
                                p.isPublished
                                  ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400 hover:border-emerald-400"
                                  : "bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400"
                              }`}
                            >
                              {p.isPublished ? "Active" : "Draft"}
                            </button>
                          </td>
                          <td className="p-3.5 text-center">
                            {p.isFeatured ? (
                              <span className="text-[#D4AF37] text-sm">★</span>
                            ) : (
                              <span className="text-gray-600 text-xs">—</span>
                            )}
                          </td>
                          <td className="p-3.5 text-center font-mono text-gray-300">
                            {totalStock > 0 ? (
                              <span className="text-emerald-400">{totalStock}</span>
                            ) : (
                              <span className="text-red-400 font-bold">0</span>
                            )}
                          </td>
                          <td className="p-3.5 text-center whitespace-nowrap sticky right-0 bg-[#111111] group-hover:bg-[#171717] shadow-[-6px_0_12px_rgba(0,0,0,0.6)] z-10">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenEdit(p)}
                                className="inline-flex items-center gap-1 bg-[#D4AF37] hover:bg-[#AA8822] text-[#080808] px-3 py-1 font-bold text-[11px] uppercase tracking-luxury shadow transition-colors"
                                title="Edit product details, discount, picture, and stock"
                              >
                                <Edit3 size={11} />
                                <span>Edit</span>
                              </button>
                              <a
                                href={`/product/${p.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 border border-[#2A2A2A] hover:border-[#D4AF37] text-gray-400 hover:text-[#D4AF37] transition-colors"
                                title="View on Storefront"
                              >
                                <ExternalLink size={12} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* ========================================================= */}
        {/* EDIT PRODUCT MODAL (COMPLETE EDITING FOR ALL PROPERTIES)   */}
        {/* ========================================================= */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#111111] border border-[#D4AF37] max-w-2xl w-full p-6 space-y-5 my-8 shadow-2xl animate-fade-in max-h-[92vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#D4AF37] text-black">
                    <Edit3 size={16} />
                  </div>
                  <div>
                    <h3 className="font-brand text-sm font-bold text-[#F5F0E6] uppercase tracking-luxury">
                      Edit Product Details
                    </h3>
                    <p className="text-[10px] text-gray-400">
                      ID: {editFormData.id} | SKU: {editFormData.sku}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                {/* 1. Title & SKU */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-gray-300 font-semibold mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] p-2.5 text-[#F5F0E6] outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">SKU *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.sku}
                      onChange={(e) => setEditFormData({ ...editFormData, sku: e.target.value })}
                      className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] p-2.5 text-[#F5F0E6] outline-none font-mono"
                    />
                  </div>
                </div>

                {/* 2. Category & Subcategory Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Main Category *</label>
                    <select
                      value={editFormData.categoryId}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        const firstSub = CATEGORY_MAP[newCat]?.subs[0]?.id || "";
                        setEditFormData({
                          ...editFormData,
                          categoryId: newCat,
                          subcategoryId: firstSub,
                        });
                      }}
                      className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] p-2.5 text-[#F5F0E6] outline-none cursor-pointer uppercase font-semibold"
                    >
                      <option value="cat-men">MEN</option>
                      <option value="cat-women">WOMEN</option>
                      <option value="cat-bags">BAGS</option>
                      <option value="cat-accessories">ACCESSORIES</option>
                      <option value="cat-kids">KIDS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Subcategory *</label>
                    <select
                      value={editFormData.subcategoryId}
                      onChange={(e) => setEditFormData({ ...editFormData, subcategoryId: e.target.value })}
                      className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] p-2.5 text-[#F5F0E6] outline-none cursor-pointer"
                    >
                      {activeSubs.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Pricing, Discount & Sale Calculation */}
                <div className="p-3.5 bg-[#0A0A0A] border border-[#2A2A2A] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
                    <span className="font-brand text-[11px] font-bold uppercase tracking-luxury text-[#D4AF37] flex items-center gap-1.5">
                      <Percent size={13} />
                      <span>Rates & Discount Management</span>
                    </span>
                    {discountPercent && (
                      <span className="px-2 py-0.5 bg-[#D4AF37] text-black font-extrabold text-[10px] uppercase tracking-luxury animate-pulse">
                        🔥 {discountPercent}% OFF ACTIVE
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">
                        Final Selling Rate (PKR) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono">Rs.</span>
                        <input
                          type="number"
                          required
                          value={editFormData.price}
                          onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                          className="w-full bg-[#111111] border border-[#2A2A2A] focus:border-[#D4AF37] pl-10 pr-3 py-2 text-[#F5F0E6] outline-none font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">
                        Original / Cut Price (PKR)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono">Rs.</span>
                        <input
                          type="number"
                          value={editFormData.originalPrice}
                          onChange={(e) => setEditFormData({ ...editFormData, originalPrice: e.target.value })}
                          placeholder="Optional (shows strike-through)"
                          className="w-full bg-[#111111] border border-[#2A2A2A] focus:border-[#D4AF37] pl-10 pr-3 py-2 text-gray-300 outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preset Discount Buttons */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">Apply Preset Discount:</span>
                    <button
                      type="button"
                      onClick={() => applyPresetDiscount(10)}
                      className="px-2 py-0.5 bg-[#171717] hover:bg-[#D4AF37] hover:text-black text-gray-300 text-[10px] font-bold border border-[#2A2A2A] transition-colors"
                    >
                      10% OFF
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetDiscount(15)}
                      className="px-2 py-0.5 bg-[#171717] hover:bg-[#D4AF37] hover:text-black text-gray-300 text-[10px] font-bold border border-[#2A2A2A] transition-colors"
                    >
                      15% OFF
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetDiscount(20)}
                      className="px-2 py-0.5 bg-[#171717] hover:bg-[#D4AF37] hover:text-black text-gray-300 text-[10px] font-bold border border-[#2A2A2A] transition-colors"
                    >
                      20% OFF
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetDiscount(25)}
                      className="px-2 py-0.5 bg-[#171717] hover:bg-[#D4AF37] hover:text-black text-gray-300 text-[10px] font-bold border border-[#2A2A2A] transition-colors"
                    >
                      25% OFF
                    </button>
                    {editFormData.originalPrice && (
                      <button
                        type="button"
                        onClick={removeDiscount}
                        className="px-2 py-0.5 bg-red-950/40 text-red-400 border border-red-800/40 hover:bg-red-900/60 text-[10px] font-bold transition-colors ml-auto"
                      >
                        Remove Discount
                      </button>
                    )}
                  </div>
                </div>

                {/* 4. Product Image & Upload */}
                <div className="p-3.5 bg-[#0A0A0A] border border-[#2A2A2A] space-y-3">
                  <label className="block text-gray-300 font-semibold mb-1">Product Photograph *</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {/* Live Preview */}
                    <div className="relative w-24 h-28 bg-[#000000] border border-[#D4AF37]/50 flex-shrink-0 overflow-hidden shadow">
                      {editFormData.imageUrl ? (
                        <Image
                          src={editFormData.imageUrl}
                          alt="Product preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">
                          No Pic
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2.5 w-full">
                      {/* Image URL Input */}
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-1">Image URL / Path:</span>
                        <input
                          type="text"
                          value={editFormData.imageUrl}
                          onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                          placeholder="/products/prod-men-sandals-1-1.svg"
                          className="w-full bg-[#111111] border border-[#2A2A2A] focus:border-[#D4AF37] p-2 text-[#F5F0E6] outline-none font-mono text-[11px]"
                        />
                      </div>

                      {/* File Upload Button */}
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F5F0E6] border border-[#D4AF37]/40 text-[11px] font-semibold transition-colors"
                        >
                          <Upload size={13} className="text-[#D4AF37]" />
                          <span>{isUploading ? "Uploading File..." : "Upload New Image from Computer"}</span>
                        </button>
                        <span className="text-[10px] text-gray-500 block mt-1">
                          Accepts JPG, PNG, WEBP, SVG files from your device.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Stock / Inventory */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Inventory Stock Quantity (Units in Atelier)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editFormData.stock}
                    onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                    className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] p-2.5 text-[#F5F0E6] outline-none font-mono"
                  />
                  <span className="text-[10px] text-gray-500 block mt-1">
                    Updates in-stock availability across all size and color variants for immediate checkout.
                  </span>
                </div>

                {/* 6. Description & Material Quality */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Quality & Craftsmanship Description
                  </label>
                  <textarea
                    rows={3}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] p-2.5 text-[#F5F0E6] outline-none leading-relaxed"
                  />
                </div>

                {/* 7. Feature Toggles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#2A2A2A]">
                  <label className="flex items-center gap-2 cursor-pointer bg-[#0A0A0A] p-2 border border-[#2A2A2A]">
                    <input
                      type="checkbox"
                      checked={editFormData.isPublished}
                      onChange={(e) => setEditFormData({ ...editFormData, isPublished: e.target.checked })}
                      className="accent-[#D4AF37]"
                    />
                    <span className="text-[11px] text-gray-300">Published</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-[#0A0A0A] p-2 border border-[#2A2A2A]">
                    <input
                      type="checkbox"
                      checked={editFormData.isFeatured}
                      onChange={(e) => setEditFormData({ ...editFormData, isFeatured: e.target.checked })}
                      className="accent-[#D4AF37]"
                    />
                    <span className="text-[11px] text-gray-300">Featured ★</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-[#0A0A0A] p-2 border border-[#2A2A2A]">
                    <input
                      type="checkbox"
                      checked={editFormData.isNewArrival}
                      onChange={(e) => setEditFormData({ ...editFormData, isNewArrival: e.target.checked })}
                      className="accent-[#D4AF37]"
                    />
                    <span className="text-[11px] text-gray-300">New Arrival</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-[#0A0A0A] p-2 border border-[#2A2A2A]">
                    <input
                      type="checkbox"
                      checked={editFormData.isBestseller}
                      onChange={(e) => setEditFormData({ ...editFormData, isBestseller: e.target.checked })}
                      className="accent-[#D4AF37]"
                    />
                    <span className="text-[11px] text-gray-300">Bestseller</span>
                  </label>
                </div>

                {/* Modal Actions */}
                <div className="pt-4 border-t border-[#2A2A2A] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 border border-[#2A2A2A] hover:border-gray-500 text-gray-400 hover:text-white uppercase tracking-luxury text-[11px] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-2.5 bg-[#D4AF37] hover:bg-[#AA8822] text-[#080808] font-extrabold uppercase tracking-luxury text-[11px] shadow-lg transition-all"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Creating New Product (Reuses same clean structure) */}
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#111111] border border-[#D4AF37] max-w-2xl w-full p-6 space-y-5 my-8 shadow-2xl animate-fade-in max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#D4AF37] text-black">
                    <Plus size={16} />
                  </div>
                  <h3 className="font-brand text-sm font-bold text-[#F5F0E6] uppercase tracking-luxury">
                    Add New Product
                  </h3>
                </div>
                <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-gray-300 font-semibold mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      placeholder="e.g. Royal Oxford Shoes"
                      className="w-full bg-[#080808] border border-[#2A2A2A] p-2.5 text-[#F5F0E6] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">SKU *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.sku}
                      onChange={(e) => setEditFormData({ ...editFormData, sku: e.target.value })}
                      className="w-full bg-[#080808] border border-[#2A2A2A] p-2.5 text-[#F5F0E6] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Category *</label>
                    <select
                      value={editFormData.categoryId}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        const firstSub = CATEGORY_MAP[newCat]?.subs[0]?.id || "";
                        setEditFormData({
                          ...editFormData,
                          categoryId: newCat,
                          subcategoryId: firstSub,
                        });
                      }}
                      className="w-full bg-[#080808] border border-[#2A2A2A] p-2.5 text-[#F5F0E6] outline-none cursor-pointer uppercase font-semibold"
                    >
                      <option value="cat-men">MEN</option>
                      <option value="cat-women">WOMEN</option>
                      <option value="cat-bags">BAGS</option>
                      <option value="cat-accessories">ACCESSORIES</option>
                      <option value="cat-kids">KIDS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Subcategory *</label>
                    <select
                      value={editFormData.subcategoryId}
                      onChange={(e) => setEditFormData({ ...editFormData, subcategoryId: e.target.value })}
                      className="w-full bg-[#080808] border border-[#2A2A2A] p-2.5 text-[#F5F0E6] outline-none cursor-pointer"
                    >
                      {activeSubs.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Selling Rate (PKR) *</label>
                    <input
                      type="number"
                      required
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                      placeholder="6950"
                      className="w-full bg-[#080808] border border-[#2A2A2A] p-2.5 text-[#F5F0E6] outline-none font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Original Price (PKR)</label>
                    <input
                      type="number"
                      value={editFormData.originalPrice}
                      onChange={(e) => setEditFormData({ ...editFormData, originalPrice: e.target.value })}
                      placeholder="Optional"
                      className="w-full bg-[#080808] border border-[#2A2A2A] p-2.5 text-gray-300 outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Initial Stock Quantity</label>
                  <input
                    type="number"
                    value={editFormData.stock}
                    onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                    className="w-full bg-[#080808] border border-[#2A2A2A] p-2.5 text-[#F5F0E6] outline-none font-mono"
                  />
                </div>

                {/* Product Photograph & Upload */}
                <div className="p-3.5 bg-[#0A0A0A] border border-[#2A2A2A] space-y-3">
                  <label className="block text-gray-300 font-semibold mb-1">Product Photograph *</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="relative w-24 h-28 bg-[#000000] border border-[#D4AF37]/50 flex-shrink-0 overflow-hidden shadow">
                      {editFormData.imageUrl ? (
                        <Image
                          src={editFormData.imageUrl}
                          alt="Product preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">
                          No Pic
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2.5 w-full">
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-1">Image URL / Path:</span>
                        <input
                          type="text"
                          value={editFormData.imageUrl}
                          onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                          placeholder="/products/prod-men-sandals-1-1.svg"
                          className="w-full bg-[#111111] border border-[#2A2A2A] focus:border-[#D4AF37] p-2 text-[#F5F0E6] outline-none font-mono text-[11px]"
                        />
                      </div>

                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F5F0E6] border border-[#D4AF37]/40 text-[11px] font-semibold transition-colors"
                        >
                          <Upload size={13} className="text-[#D4AF37]" />
                          <span>{isUploading ? "Uploading File..." : "Upload Image from Device"}</span>
                        </button>
                        <span className="text-[10px] text-gray-500 block mt-1">
                          Accepts JPG, PNG, WEBP, SVG files from your device.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full bg-[#080808] border border-[#2A2A2A] p-2.5 text-[#F5F0E6] outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-[#2A2A2A] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-5 py-2.5 border border-[#2A2A2A] text-gray-400 hover:text-white uppercase tracking-luxury text-[11px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-2.5 bg-[#D4AF37] hover:bg-[#AA8822] text-[#080808] font-bold uppercase tracking-luxury text-[11px]"
                  >
                    {isSubmitting ? "Adding..." : "Add to Atelier"}
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
