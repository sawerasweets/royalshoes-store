import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import PwaRegister from "@/components/common/PwaRegister";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    template: "%s | ROYAL SHOES — Black & Gold Edition",
    default: "ROYAL SHOES — Black & Gold Edition | Luxury Footwear & Fashion",
  },
  description:
    "Step into elegance with ROYAL SHOES. Handcrafted luxury footwear, artisanal leather bags, and refined accessories. Nationwide delivery across Pakistan.",
  manifest: "/manifest.json",
  icons: {
    icon: "/brand/icon-192.png",
    apple: "/brand/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ROYAL SHOES",
  },
  keywords: [
    "ROYAL SHOES",
    "Luxury Footwear Pakistan",
    "Men Formal Shoes",
    "Women Heels",
    "Leather Loafers",
    "Handmade Shoes",
    "Leather Bags",
    "Accessories",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://royalshoes.store"),
  openGraph: {
    title: "ROYAL SHOES — Black & Gold Edition",
    description: "Step into elegance. Handcrafted luxury footwear and accessories.",
    siteName: "ROYAL SHOES",
    locale: "en_PK",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, settings] = await Promise.all([
    getCurrentUser(),
    prisma.storeSettings.findUnique({ where: { id: "singleton" } }).catch(() => null),
  ]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#080808] text-[#F5F0E6] antialiased selection:bg-[#D4AF37] selection:text-[#080808]">
        <Header
          userName={user ? user.name : null}
          userRole={user ? user.role : null}
          announcementText={settings?.announcementText}
          announcementActive={settings?.showAnnouncement ?? true}
        />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <PwaRegister />
      </body>
    </html>
  );
}
