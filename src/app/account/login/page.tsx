"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, AlertCircle, Eye, EyeOff, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.user.role === "ADMIN" || data.user.role === "STAFF") {
          router.push("/admin");
        } else {
          router.push("/account");
        }
      } else {
        setError(data.error || "Authentication failed.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 max-w-md mx-auto px-4">
      <div className="bg-[#FFFFFF] border border-[#E4DDD3] p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-1.5">
          <span className="text-[10px] font-bold tracking-brand uppercase text-[#795548]">
            ROYAL SHOES PRIVILEGE
          </span>
          <h1 className="font-brand text-2xl font-extrabold tracking-luxury text-[#4A342E]">
            SIGN IN TO YOUR ATELIER
          </h1>
          <p className="text-xs text-[#6B635B]">
            Sign in with your Email, Phone Number, or Username.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/50 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle size={16} className="flex-shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5855] mb-1.5">
              Email, Mobile Phone or Username
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#795548]" />
              <input
                type="text"
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="03481702710 or admin@royalshoes.store"
                className="w-full bg-[#FFFFFF] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] pl-10 pr-3.5 py-3.5 outline-none transition-colors"
              />
            </div>
            <p className="text-[10px] text-[#6B635B] mt-1">
              Admins can enter phone (e.g. <span className="text-[#4A342E] font-medium">03481702710</span>) or <span className="text-[#4A342E] font-medium">admin</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5855] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#795548]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#FFFFFF] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] pl-10 pr-10 py-3.5 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B635B] hover:text-[#795548] p-1 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#795548] hover:bg-[#5D4037] text-white font-bold text-xs uppercase tracking-luxury py-3.5 px-6 transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2"
          >
            <span>{loading ? "AUTHENTICATING..." : "SIGN IN TO ATELIER"}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="bg-[#FAF7F2] border border-[#E4DDD3] p-3 text-[11px] text-[#6B635B] space-y-1">
          <div className="flex items-center gap-1.5 text-[#795548] font-semibold text-[10px] uppercase tracking-wider">
            <UserCheck size={13} />
            <span>VIP Admin Quick Access</span>
          </div>
          <p>
            You can sign in using your registered mobile number <strong className="text-[#4A342E]">03481702710</strong>, username <strong className="text-[#4A342E]">admin</strong>, or email.
          </p>
        </div>

        <div className="pt-4 border-t border-[#E4DDD3] text-center text-xs text-[#6B635B]">
          <span>New to ROYAL SHOES? </span>
          <Link href="/account/register" className="text-[#795548] font-bold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
