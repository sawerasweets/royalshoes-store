"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, User, Mail, Lock, Phone, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/account");
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 sm:py-24 max-w-md mx-auto">
      <div className="bg-[#111111] border border-[#2A2A2A] p-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold tracking-brand uppercase text-[#D4AF37]">
            CLIENT PRIVILEGE
          </span>
          <h1 className="font-brand text-2xl font-extrabold tracking-luxury text-[#F5F0E6]">
            CREATE AN ACCOUNT
          </h1>
          <p className="text-xs text-gray-400">
            Enjoy priority order fulfillment, tracked parcels, and size personalization.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/50 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle size={15} className="flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Asad Malik"
                className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] text-xs text-[#F5F0E6] pl-10 pr-3.5 py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] text-xs text-[#F5F0E6] pl-10 pr-3.5 py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03001234567"
                className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] text-xs text-[#F5F0E6] pl-10 pr-3.5 py-3 outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Create Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] text-xs text-[#F5F0E6] pl-10 pr-3.5 py-3 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#AA8822] text-[#080808] font-bold text-xs uppercase tracking-luxury py-3.5 px-6 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <span>{loading ? "Registering..." : "Create Account"}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="pt-4 border-t border-[#2A2A2A] text-center text-xs text-gray-400">
          <span>Already registered? </span>
          <Link href="/account/login" className="text-[#D4AF37] font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
